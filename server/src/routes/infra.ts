import { Router, Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import pkg from 'pg';
const { Client } = pkg;
import { db, pool } from '../db/index';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { ProvisionSchema, ResetSchema, SyncDatabaseSchema, SyncSchema } from '../schemas';
import { initializeSupabaseMCP, callSupabaseMCP } from '../services/supabase';
import { BYOI_SCHEMA_SQL, NATIVE_ENGINE_SQL, splitSqlStatements } from '../utils/sql';
import { trackExecution } from '../redis';
import { PostgresQueueAdapter } from '../engine/native/adapters/postgres';

const router: Router = Router();

// Unified Infrastructure Config
const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const SUPABASE_SECRET_KEY = (process.env.SUPABASE_SECRET_KEY || '').trim();

router.get('/provision', (req, res) => {
  res.status(200).send('🛰️ Tryliate Infrastructure Provisioning Endpoint is LIVE. Please use POST to initiate calibration.');
});

router.post('/provision', async (req: Request, res: Response, next: NextFunction) => {
  const sendStep = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    if (!res.writableEnded) res.write(JSON.stringify({ message, type }) + '\n');
  };

  try {
    let { accessToken, userId } = ProvisionSchema.parse(req.body);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    if (!accessToken) {
      console.log(`[PROVISION] Token missing in request for ${userId}. Probing Vaults...`);
      try {
        const userRecords = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        const vaultData = userRecords[0];
        if (vaultData && vaultData.supabaseAccessToken) {
          accessToken = vaultData.supabaseAccessToken;
          console.log(`[PROVISION] Management Token found in Runtime Vault (Drizzle).`);
        }
      } catch (vaultErr: any) {
        console.warn(`[PROVISION] Runtime Vault Probe failed: ${vaultErr.message}`);
      }

      if (!accessToken) {
        console.log(`[PROVISION] Probing Administrative Vault for ${userId}...`);
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('supabase_access_token, supabase_secret_key')
            .eq('id', userId)
            .single();
          if (userData) {
            accessToken = userData.supabase_access_token || undefined;
          }
        } catch (vaultErr: any) {
          console.error(`[PROVISION] Administrative Vault Probe failed: ${vaultErr.message}`);
        }
      }
    }

    if (!accessToken) {
      throw new Error('Supabase Management Token missing. Please "Disconnect" and then "Connect" Supabase Auth above to refresh your session.');
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.write(' '.repeat(1024) + '\n');

    await trackExecution(userId);

    sendStep('🤖 Trymate: Analyzing architecture quotas...');
    sendStep(`✅ Calibrating 17-Table Supabase MCP Architecture...`);

    let rawToken = accessToken;
    if (accessToken && !accessToken.startsWith('sbp_') && !accessToken.startsWith('sb_') && !accessToken.startsWith('eyJ')) {
      try {
        const decoded = Buffer.from(accessToken, 'base64').toString();
        if (decoded.startsWith('sbp_') || decoded.startsWith('sb_') || decoded.startsWith('eyJ')) {
          rawToken = decoded;
        }
      } catch (e) { }
    }

    const projectsResponse = await fetch('https://api.supabase.com/v1/projects', {
      headers: { 'Authorization': `Bearer ${rawToken}` }
    });

    if (!projectsResponse.ok) {
      if (projectsResponse.status === 401) throw new Error('Supabase Management session expired.');
      throw new Error(`Failed to list projects: ${projectsResponse.status}`);
    }
    const projects: any[] = await projectsResponse.json() as any[];

    let targetProject = projects.find(p => p.name === 'Tryliate Studio');
    let dbPass: string | null = null;

    if (targetProject) {
      await supabase.from('users').update({
        supabase_url: `https://${targetProject.id}.supabase.co`,
        supabase_project_id: targetProject.id,
        supabase_org_id: targetProject.organization_id || ''
      }).eq('id', userId);

      const { data: userData } = await supabase.from('users').select('supabase_secret_key, supabase_url').eq('id', userId).single();
      const storedProjectId = userData?.supabase_url?.match(/https:\/\/(.*)\.supabase\.co/)?.[1];

      if (!(userData && storedProjectId === targetProject.id && userData.supabase_secret_key)) {
        sendStep('⚠️ Orphaned project detected. Purging stale infrastructure...');
        const deleteRes = await fetch(`https://api.supabase.com/v1/projects/${targetProject.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${rawToken}` }
        });
        if (deleteRes.ok) targetProject = null;
        else throw new Error('Orphaned project lockout.');
      }
    }

    if (!targetProject) {
      const orgsResponse = await fetch('https://api.supabase.com/v1/organizations', {
        headers: { 'Authorization': `Bearer ${rawToken}` }
      });
      const organizations: any[] = await orgsResponse.json() as any[];
      const primaryOrg = organizations[0];
      if (!primaryOrg) throw new Error('No Supabase organization found.');

      dbPass = crypto.randomBytes(16).toString('hex') + 'A1!';
      const createResponse = await fetch('https://api.supabase.com/v1/projects', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${rawToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Tryliate Studio',
          organization_id: primaryOrg.id,
          region: 'us-east-1',
          plan: 'free',
          db_pass: dbPass
        })
      });
      if (!createResponse.ok) throw new Error('Project creation failed.');
      targetProject = await createResponse.json();
      await supabase.from('users').update({
        supabase_url: `https://${targetProject.id}.supabase.co`,
        supabase_project_id: targetProject.id,
        supabase_org_id: targetProject.organization_id || primaryOrg.id
      }).eq('id', userId);
    }

    const keysRes = await fetch(`https://api.supabase.com/v1/projects/${targetProject.id}/api-keys`, {
      headers: { 'Authorization': `Bearer ${rawToken}` }
    });
    if (!keysRes.ok) throw new Error('Failed to fetch API keys.');
    const keys: any[] = await keysRes.json() as any[];
    const secretKey = keys.find(k => k.name === 'service_role' || k.name === 'secret')?.api_key;
    const anonKey = keys.find(k => k.name === 'anon')?.api_key;

    if (!secretKey) throw new Error('Secret Key not discovered.');

    await supabase.from('users').update({
      supabase_connected: true,
      supabase_project_id: targetProject.id,
      supabase_org_id: targetProject.organization_id || '',
      supabase_url: `https://${targetProject.id}.supabase.co`,
      supabase_publishable_key: anonKey,
      supabase_secret_key: secretKey,
      tryliate_initialized: false
    }).eq('id', userId);

    const mcpSessionId = await initializeSupabaseMCP(targetProject.id, accessToken);
    const fullSchemaSql = BYOI_SCHEMA_SQL + '\n' + NATIVE_ENGINE_SQL;
    const statements = splitSqlStatements(fullSchemaSql);
    for (const stmt of statements) {
      try {
        await callSupabaseMCP(targetProject.id, accessToken, 'execute_sql', { query: stmt + ';' }, mcpSessionId);
      } catch (e) { }
    }

    await supabase.from('users').update({ tryliate_initialized: true }).eq('id', userId);
    await db.update(users).set({ tryliateInitialized: true, supabaseConnected: true, updatedAt: new Date() }).where(eq(users.id, userId));

    sendStep('🎉 Infrastructure Ready!', 'success');
  } catch (error: any) {
    sendStep(`❌ Error: ${error.message}`, 'error');
  } finally {
    res.end();
  }
});

router.post('/reset', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = ResetSchema.parse(req.body);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);
    const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
    if (user?.supabase_project_id && user?.supabase_access_token) {
      try {
        const mcpSessionId = await initializeSupabaseMCP(user.supabase_project_id, user.supabase_access_token);
        const sql = 'DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;';
        await callSupabaseMCP(user.supabase_project_id, user.supabase_access_token, 'execute_sql', { query: sql }, mcpSessionId);
      } catch (e) { }
    }
    await supabase.from('users').update({
      tryliate_initialized: false,
      supabase_connected: false,
      supabase_project_id: null,
      supabase_secret_key: null,
      supabase_url: null,
      supabase_publishable_key: null,
      supabase_db_pass: null,
      supabase_org_id: null,
      supabase_access_token: null,
      supabase_refresh_token: null
    }).eq('id', userId);
    res.json({ success: true, message: 'Infrastructure reset.' });
  } catch (err: any) {
    next(err);
  }
});

router.post('/sync-schema', async (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Type', 'text/plain');
  try {
    const { userId } = SyncDatabaseSchema.parse(req.body);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);
    const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
    if (!user?.supabase_project_id || !user?.supabase_access_token) throw new Error('Bridge not established.');

    const mcpSessionId = await initializeSupabaseMCP(user.supabase_project_id, user.supabase_access_token);
    const statements = splitSqlStatements(BYOI_SCHEMA_SQL + '\n' + NATIVE_ENGINE_SQL);
    for (const sql of statements) {
      try { await callSupabaseMCP(user.supabase_project_id, user.supabase_access_token, 'execute_sql', { query: sql + ';' }, mcpSessionId); } catch (e) { }
    }
    res.write(`data: ${JSON.stringify({ message: 'Sync Complete', status: 'success' })}\n\n`);
  } catch (err: any) {
    next(err);
  } finally {
    res.end();
  }
});

export default router;
