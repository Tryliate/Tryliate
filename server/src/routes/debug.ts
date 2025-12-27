import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { pool } from '../db/index';
import { redis } from '../redis';
import { BYOI_SCHEMA_SQL } from '../utils/sql';

const router: Router = Router();

// Unified Infrastructure Config
const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const SUPABASE_SECRET_KEY = (process.env.SUPABASE_SECRET_KEY || '').trim();

router.get('/health', async (req: Request, res: Response) => {
  const health: any = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      supabase: 'probing',
      master_db: 'probing',
      redis: 'probing'
    }
  };

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);
    const { error: sbError } = await supabase.from('users').select('count', { count: 'exact', head: true });
    health.services.supabase = sbError ? `error: ${sbError.message}` : 'healthy';

    try {
      await pool.query('SELECT 1');
      health.services.master_db = 'healthy';
    } catch (e: any) {
      health.services.master_db = `error: ${e.message}`;
    }

    try {
      await redis.ping();
      health.services.redis = 'healthy';
    } catch (e: any) {
      health.services.redis = `error: ${e.message}`;
    }

    const isAllHealthy = Object.values(health.services).every(v => v === 'healthy');
    res.status(isAllHealthy ? 200 : 207).json(health);
  } catch (err: any) {
    res.status(500).json({ status: 'ERROR', message: err.message, services: health.services });
  }
});

router.get('/schema-repair', async (req: Request, res: Response) => {
  try {
    console.log('🛠️ DEBUG: Repairing Schema...');
    let message = '';

    const resNodes = await pool.query(`
      SELECT column_name FROM information_schema.columns WHERE table_name = 'foundry_nodes'
    `);
    const nodeColumns = resNodes.rows.map((r: any) => r.column_name);
    if (nodeColumns.length > 0) {
      if (!nodeColumns.includes('data')) {
        if (nodeColumns.includes('meta')) {
          await pool.query('ALTER TABLE foundry_nodes RENAME COLUMN meta TO data');
          message += 'Foundry: Renamed meta to data. ';
        } else {
          await pool.query('ALTER TABLE foundry_nodes ADD COLUMN data JSONB NOT NULL DEFAULT \'{}\'');
          message += 'Foundry: Added missing data column. ';
        }
      }
    } else {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS public.foundry_nodes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          label TEXT NOT NULL,
          type TEXT NOT NULL,
          category TEXT NOT NULL,
          sub_category TEXT,
          data JSONB NOT NULL,
          created_at TIMESTAMPTZ DEFAULT now()
        );
      `);
      message += 'Foundry: Created table foundry_nodes. ';
    }

    const resUsers = await pool.query(`
      SELECT column_name FROM information_schema.columns WHERE table_name = 'users'
    `);
    const userColumns = resUsers.rows.map((r: any) => r.column_name);
    if (userColumns.length === 0) {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS public.users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE,
          supabase_project_id TEXT,
          supabase_access_token TEXT,
          supabase_db_pass TEXT,
          supabase_org_id TEXT,
          supabase_url TEXT,
          tryliate_initialized BOOLEAN DEFAULT false,
          supabase_connected BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now()
        );
      `);
      message += 'Master: Created users table. ';
    } else {
      const required = ['supabase_project_id', 'supabase_access_token', 'supabase_db_pass', 'supabase_connected', 'supabase_org_id', 'supabase_url'];
      for (const col of required) {
        if (!userColumns.includes(col)) {
          await pool.query(`ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ${col} TEXT`);
          message += `Master: Added ${col}. `;
        }
      }
    }

    res.json({ success: true, message: message || 'Schema is healthy.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/schema-init', async (req: Request, res: Response) => {
  try {
    await pool.query(BYOI_SCHEMA_SQL);
    res.json({ success: true, message: 'Schema initialized successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
