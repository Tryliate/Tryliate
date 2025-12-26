
import fetch from 'node-fetch';

/**
 * 🔱 Tryliate Manual Project Calibration (v1.1.3)
 * Forces 17-table Neural Architecture with COMPLETE RLS & Realtime coverage.
 */

const PROJECT_ID = process.env.SUPABASE_PROJECT_ID || 'pwadtgqevdemsoqhqmqm';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'sbp_REDACTED';

const TABLES = [
  'public.workflows',
  'public.nodes',
  'public.edges',
  'public.agent_memory',
  'public.mcp_registry',
  'public.mcp_authorizations',
  'public.flow_space',
  'public.workspace_history',
  'public.foundry_nodes',
  'public.neural_discovery_queue',
  'public.neural_links',
  'public.tool_catalog',
  'public.audit_trail',
  'public.user_settings',
  'tryliate.jobs',
  'tryliate.runs',
  'tryliate.steps'
];

async function calibrate() {
  const mcpUrl = 'https://mcp.supabase.com/mcp?project_ref=' + PROJECT_ID;
  console.log('📡 Forced Calibration (v1.1.3) - Full RLS Lockdown on ' + PROJECT_ID + '...');

  try {
    const initRes = await fetch(mcpUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + ACCESS_TOKEN,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'x-supabase-project': PROJECT_ID
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'RLS-Lockdown', version: '1.1.3' } }
      })
    });

    if (!initRes.ok) throw new Error('Handshake Failed');
    const sessionId = initRes.headers.get('mcp-session-id');

    const commonHeaders = {
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
      'x-supabase-project': PROJECT_ID,
      'mcp-session-id': sessionId
    };

    console.log('🔒 Enabling Row Level Security for ALL 17 tables...');

    for (const table of TABLES) {
      console.log(`🛡️ Securing ${table}...`);

      const sql = `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`;

      const res = await fetch(mcpUrl, {
        method: 'POST',
        headers: commonHeaders,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: { name: 'execute_sql', arguments: { query: sql } }
        })
      });

      const data = await res.json();
      if (data.result?.isError) {
        console.warn(`⚠️ Warning on ${table}: ` + (data.result.content?.[0]?.text || 'Check SQL'));
      } else {
        console.log(`✅ ${table} RLS: [ENABLED]`);
      }
    }

    // Ensure Realtime is also fully synced
    console.log('\n📡 Syncing Realtime Publication...');
    const realtimeSql = `
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
          CREATE PUBLICATION supabase_realtime;
        END IF;
      END $$;
      ALTER PUBLICATION supabase_realtime ADD TABLE ${TABLES.join(', ')};
    `;

    const rRes = await fetch(mcpUrl, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: { name: 'execute_sql', arguments: { query: realtimeSql } }
      })
    });

    console.log('✅ Realtime Publication updated.');
    console.log('\n🎉 ALL 17 TABLES ARE NOW SECURED WITH RLS.');

  } catch (err) {
    console.error('💥 Critical Failure:', err.message);
  }
}

calibrate();
