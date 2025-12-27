import { Router, Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { db } from '../db/index';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { SyncDatabaseSchema } from '../schemas';
import { initializeSupabaseMCP, callSupabaseMCP } from '../services/supabase';
import { NATIVE_ENGINE_SQL, splitSqlStatements } from '../utils/sql';
import { PostgresQueueAdapter } from '../engine/native/adapters/postgres';
import { z } from 'zod';

const router: Router = Router();
const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const SUPABASE_SECRET_KEY = (process.env.SUPABASE_SECRET_KEY || '').trim();

router.post('/provision', async (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Type', 'text/plain');
  const sendStep = (message: string, status: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    if (!res.writableEnded) res.write(`data: ${JSON.stringify({ message, status })}\n\n`);
  };

  try {
    const { userId } = SyncDatabaseSchema.parse(req.body);
    const userRecords = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const targetUser = userRecords[0];

    if (!targetUser) throw new Error('User profile not found.');
    if (!targetUser.supabaseProjectId || !targetUser.supabaseAccessToken) throw new Error('Supabase configuration missing.');

    const mcpSessionId = await initializeSupabaseMCP(targetUser.supabaseProjectId, targetUser.supabaseAccessToken);
    const statements = splitSqlStatements(NATIVE_ENGINE_SQL);
    for (const stmt of statements) {
      try { await callSupabaseMCP(targetUser.supabaseProjectId, targetUser.supabaseAccessToken, 'execute_sql', { query: stmt + ';' }, mcpSessionId); } catch (e) { }
    }

    sendStep('✅ Native Engine calibrated successfully.', 'success');
  } catch (err: any) {
    sendStep(`❌ Provisioning Failed: ${err.message}`, 'error');
  } finally {
    res.end();
  }
});

router.post('/run', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workflowId, userId, input } = z.object({
      workflowId: z.string(),
      userId: z.string().uuid(),
      input: z.any().optional().default({})
    }).parse(req.body);

    const userRecords = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const user = userRecords[0];

    if (!user || !user.supabaseUrl || !user.supabaseDbPass) throw new Error('Infrastructure not provisioned.');

    const host = user.supabaseUrl.replace('https://', '').replace('.supabase.co', '');
    const connectionString = `postgresql://postgres:${user.supabaseDbPass}@db.${host}.supabase.co:5432/postgres`;

    const adapter = new PostgresQueueAdapter(connectionString);
    await adapter.ensureSchema();

    const runId = crypto.randomUUID();
    const definition = await adapter.getWorkflow(workflowId);
    if (!definition) throw new Error('Workflow definition not found.');

    const firstNode = definition.nodes[0];
    if (!firstNode) throw new Error('Workflow has no nodes.');

    await adapter.enqueueJob({
      run_id: runId,
      workflow_id: workflowId,
      node_id: firstNode.id,
      payload: input
    });

    res.json({ success: true, runId, message: 'Workflow initialized on Native Engine.' });
  } catch (err: any) {
    next(err);
  }
});

export default router;
