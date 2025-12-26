
import { WorkflowRunStatus } from '../types.ts';

/**
 * The Queue Item Structure
 * Stored in user's 'tryliate_queue' table
 */
export interface NativeJob {
  id: string; // UUID
  run_id: string;
  workflow_id: string;
  node_id: string; // The step to execute
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'dead';
  attempts: number;
  next_run_at: Date;
  created_at: Date;
}

/**
 * Interface for the Database Adapter
 * Allows us to plug in different DB connectors (Pool, Data API, etc)
 */
export interface NativeQueueAdapter {
  /**
   * Initialize the schema in the user's DB if it doesn't exist
   */
  ensureSchema(): Promise<void>;

  /**
   * Add a job to the queue
   */
  enqueueJob(job: Omit<NativeJob, 'id' | 'created_at' | 'status' | 'attempts' | 'next_run_at'> & { delayMs?: number }): Promise<string>;

  /**
   * Lock and Fetch the next available job
   * Uses FOR UPDATE SKIP LOCKED pattern
   */
  pollJob(): Promise<NativeJob | null>;

  /**
   * Mark job as completed
   */
  completeJob(jobId: string, output: any): Promise<void>;

  /**
   * Mark job as failed (schedule retry if needed)
   */
  failJob(jobId: string, error: string, retryDelayMs?: number): Promise<void>;

  /**
   * Schedule a recurring workflow using pg_cron
   */
  scheduleWorkflowCron(workflowId: string, nodeId: string, cronExpression: string, payload?: any): Promise<void>;

  /**
   * Remove a scheduled cron
   */
  removeWorkflowCron(workflowId: string): Promise<void>;
}

/**
 * SQL Schema for Reference
 */
export const WORKFLOW_SCHEMA_SQL = `
CREATE SCHEMA IF NOT EXISTS tryliate;

CREATE TABLE IF NOT EXISTS tryliate.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  workflow_id TEXT NOT NULL,
  node_id TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 3,
  next_run_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_status_run ON tryliate.jobs (status, next_run_at);

CREATE TABLE IF NOT EXISTS tryliate.runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL,
  input JSONB,
  output JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
);
`;
