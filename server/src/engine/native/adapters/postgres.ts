
import postgres from 'postgres';
import { NativeJob, NativeQueueAdapter, WORKFLOW_SCHEMA_SQL } from '../queue.ts';

/**
 * Postgres Implementation of the Tryliate Queue
 * Supports both Neon and Supabase (Standard Postgres)
 */
export class PostgresQueueAdapter implements NativeQueueAdapter {
  private sql: postgres.Sql;

  constructor(connectionString: string) {
    // Initialize postgres client with robust settings
    this.sql = postgres(connectionString, {
      max: 10, // Pool size per user
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: { rejectUnauthorized: false }
    });
  }

  /**
   * Close the connection
   */
  async close() {
    await this.sql.end();
  }

  /**
   * Ensure the tryliate schema exists in the User's DB
   */
  async ensureSchema(): Promise<void> {
    // 1. Attempt to enable pg_cron if available (Optional, non-blocking)
    try {
      await this.sql`CREATE EXTENSION IF NOT EXISTS pg_cron`;
    } catch (e) {
      console.warn('[PostgresQueue] pg_cron extension not available or permission denied.');
    }

    // 2. Ensure Schema and Tables (Non-transactional to allow partial success)
    try {
      await this.sql`CREATE SCHEMA IF NOT EXISTS tryliate`;

      await this.sql`
        CREATE TABLE IF NOT EXISTS tryliate.jobs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          run_id UUID NOT NULL,
          workflow_id TEXT NOT NULL,
          node_id TEXT NOT NULL,
          payload JSONB NOT NULL DEFAULT '{}',
          status TEXT NOT NULL DEFAULT 'pending',
          attempts INT NOT NULL DEFAULT 0,
          max_attempts INT NOT NULL DEFAULT 3,
          next_run_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `;

      await this.sql`
        CREATE TABLE IF NOT EXISTS tryliate.runs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          workflow_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          status TEXT NOT NULL,
          input JSONB,
          output JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `;

      await this.sql`
        CREATE TABLE IF NOT EXISTS tryliate.steps (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          run_id UUID NOT NULL,
          node_id TEXT NOT NULL,
          status TEXT NOT NULL,
          input JSONB,
          output JSONB,
          error TEXT,
          started_at TIMESTAMP WITH TIME ZONE,
          completed_at TIMESTAMP WITH TIME ZONE
        )
      `;

      await this.sql`CREATE INDEX IF NOT EXISTS idx_jobs_poll ON tryliate.jobs (status, next_run_at)`;
    } catch (error) {
      console.error('Failed to ensure schema', error);
      throw error;
    }
  }

  /**
   * Add a job to the queue
   */
  async enqueueJob(job: Omit<NativeJob, 'id' | 'created_at' | 'status' | 'attempts' | 'next_run_at'> & { delayMs?: number }): Promise<string> {
    const nextRunAt = job.delayMs
      ? new Date(Date.now() + job.delayMs)
      : new Date();

    const result = await this.sql`
      INSERT INTO tryliate.jobs (
        run_id, workflow_id, node_id, payload, next_run_at
      ) VALUES (
        ${job.run_id}, ${job.workflow_id}, ${job.node_id}, ${job.payload}, ${nextRunAt}
      )
      RETURNING id
    `;

    return result[0].id;
  }

  /**
   * Lock and Fetch the next available job
   */
  async pollJob(): Promise<NativeJob | null> {
    const jobs = await this.sql<NativeJob[]>`
      UPDATE tryliate.jobs
      SET status = 'processing', updated_at = NOW()
      WHERE id = (
        SELECT id
        FROM tryliate.jobs
        WHERE status = 'pending'
          AND next_run_at <= NOW()
        ORDER BY next_run_at ASC
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      )
      RETURNING *
    `;

    return jobs.length > 0 ? jobs[0] : null;
  }

  /**
   * Mark execution complete
   */
  async completeJob(jobId: string, output: any): Promise<void> {
    await this.sql`
      UPDATE tryliate.jobs
      SET status = 'completed', updated_at = NOW()
      WHERE id = ${jobId}
    `;
  }

  /**
   * Handle Failure with Retry Logic
   */
  async failJob(jobId: string, error: string, retryDelayMs: number = 5000): Promise<void> {
    await this.sql.begin(async (sql) => {
      const [job] = await sql`SELECT attempts, max_attempts FROM tryliate.jobs WHERE id = ${jobId}`;

      if (!job) return;

      if (job.attempts + 1 >= job.max_attempts) {
        await sql`
          UPDATE tryliate.jobs
          SET status = 'failed', updated_at = NOW(), payload = jsonb_set(payload, '{error}', ${JSON.stringify(error)}::jsonb)
          WHERE id = ${jobId}
        `;
      } else {
        const nextRun = new Date(Date.now() + retryDelayMs);
        await sql`
          UPDATE tryliate.jobs
          SET 
            status = 'pending', 
            attempts = attempts + 1, 
            next_run_at = ${nextRun},
            updated_at = NOW(),
            payload = jsonb_set(payload, '{last_error}', ${JSON.stringify(error)}::jsonb)
          WHERE id = ${jobId}
        `;
      }
    });
  }

  /**
   * Schedule a recurring workflow using pg_cron
   */
  async scheduleWorkflowCron(workflowId: string, nodeId: string, cronExpression: string, payload: any = {}): Promise<void> {
    const jobName = `tryliate-cron-${workflowId}`;

    // Construct the SQL to be executed by cron
    const sqlToRun = `
      INSERT INTO tryliate.jobs (run_id, workflow_id, node_id, payload, next_run_at)
      VALUES (gen_random_uuid(), '${workflowId}', '${nodeId}', '${JSON.stringify(payload)}'::jsonb, NOW())
    `;

    try {
      await this.sql`
        SELECT cron.schedule(
          ${jobName},
          ${cronExpression},
          ${sqlToRun}
        )
      `;
      console.log(`[PostgresQueue] Scheduled recurring workflow ${workflowId} (${cronExpression})`);
    } catch (error: any) {
      console.error(`[PostgresQueue] Failed to schedule cron:`, error.message);
      throw error;
    }
  }

  /**
   * Remove a scheduled cron
   */
  async removeWorkflowCron(workflowId: string): Promise<void> {
    const jobName = `tryliate-cron-${workflowId}`;
    try {
      await this.sql`SELECT cron.unschedule(${jobName})`;
      console.log(`[PostgresQueue] Removed recurring workflow schedule for ${workflowId}`);
    } catch (error: any) {
      // If job doesn't exist, we don't throw
      if (error.message.includes('not found')) return;
      console.error(`[PostgresQueue] Failed to remove cron:`, error.message);
      throw error;
    }
  }

  /**
   * Helper to fetch workflow definition
   */
  async getWorkflow(workflowId: string): Promise<{ nodes: any[], edges: any[] } | null> {
    try {
      const [record] = await this.sql`SELECT nodes, edges FROM public.workflows WHERE id = ${workflowId}`;
      return record ? { nodes: record.nodes, edges: record.edges } : null;
    } catch (e) {
      console.error('Failed to fetch workflow', e);
      return null;
    }
  }
}
