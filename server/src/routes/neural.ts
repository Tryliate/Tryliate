import { Router, Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { db } from '../db/index';
import { agentMemory, mcpAuthorizations, workspaceHistory } from '../db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { AuthorizeSchema, RecallSchema, SaveMemorySchema, ToolCallSchema } from '../schemas';
import { NeuralAI } from '../ai';
import { GuardianEnforcer } from '../guardian';
import { initializeSupabaseMCP, callSupabaseMCP } from '../services/supabase';

const router: Router = Router();
const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const SUPABASE_SECRET_KEY = (process.env.SUPABASE_SECRET_KEY || '').trim();

router.post('/authorize', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, provider, scopes } = AuthorizeSchema.parse(req.body);
    await db.insert(mcpAuthorizations)
      .values({
        userId,
        provider,
        accessToken: 'BYOI_MANAGED',
        scopes,
        status: 'verified'
      })
      .onConflictDoUpdate({
        target: [mcpAuthorizations.userId, mcpAuthorizations.provider],
        set: { scopes, updatedAt: new Date() }
      });
    res.json({ success: true, message: 'Neural Guardian permissions updated.' });
  } catch (err: any) {
    next(err);
  }
});

router.post('/recall', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { agentId, query, limit } = RecallSchema.parse(req.body);
    const memories = await db.select()
      .from(agentMemory)
      .where(eq(agentMemory.agentId, agentId))
      .orderBy(desc(agentMemory.createdAt))
      .limit(limit);
    res.json({ success: true, memories });
  } catch (err: any) {
    next(err);
  }
});

router.post('/save-memory', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { agentId, userId, content, memoryType, metadata } = SaveMemorySchema.parse(req.body);
    const embedding = await NeuralAI.getEmbedding(content);
    await db.insert(agentMemory).values({
      agentId,
      userId,
      content,
      embedding,
      memoryType,
      metadata: metadata || {}
    });
    res.json({ success: true, message: 'Neural memory persisted.' });
  } catch (err: any) {
    next(err);
  }
});

router.post('/proxy', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, provider, tool, arguments: args } = ToolCallSchema.parse(req.body);
    const auth = await db.query.mcpAuthorizations.findFirst({
      where: and(eq(mcpAuthorizations.userId, userId), eq(mcpAuthorizations.provider, provider))
    });
    if (!auth) throw new Error(`Neural Link '${provider}' not found.`);

    const validation = GuardianEnforcer.validate(provider, tool, (auth.scopes as any) || []);
    if (!validation.success) {
      await db.insert(workspaceHistory).values({
        userId,
        action: 'NEURAL_SECURITY_BLOCK',
        details: { provider, tool, reason: validation.reason }
      });
      return res.status(403).json({ success: false, error: validation.reason });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);
    const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
    if (!user?.supabase_url || !user?.supabase_access_token) throw new Error('Bridge credentials missing.');

    const projectRef = user.supabase_url.split('://')[1]?.split('.')[0];
    if (!projectRef) throw new Error('Invalid Supabase URL.');

    const sessionId = await initializeSupabaseMCP(projectRef, user.supabase_access_token);
    const result = await callSupabaseMCP(projectRef, user.supabase_access_token, tool, args, sessionId);
    res.json({ success: true, result });
  } catch (err: any) {
    next(err);
  }
});

export default router;
