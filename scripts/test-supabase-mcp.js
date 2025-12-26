
import dotenv from 'dotenv';

dotenv.config();

const PROJECT_ID = process.env.TEST_PROJECT_ID || 'uhcxwfpaxwofxxnupjsv';
const ACCESS_TOKEN = process.argv[2] || process.env.TEST_ACCESS_TOKEN;

async function testSupabaseMCP() {
  if (!ACCESS_TOKEN) {
    console.error('❌ Error: TEST_ACCESS_TOKEN is missing.');
    console.log('\nUsage:');
    console.log('  node scripts/test-supabase-mcp.js <YOUR_ACCESS_TOKEN>');
    return;
  }

  const url = `https://mcp.supabase.com/mcp?project_ref=${PROJECT_ID}`;

  console.log(`📡 Testing Official Supabase MCP Bridge...`);
  console.log(`🔗 Project: ${PROJECT_ID}`);
  console.log(`🌐 URL: ${url}`);

  try {
    // 0. Initialize
    console.log('\n--- Step 0: Initialize ---');
    const initRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'x-supabase-project': PROJECT_ID
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 0,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'Tryliate-Tester', version: '1.0.0' }
        }
      })
    });

    if (!initRes.ok) {
      console.error(`❌ Initialization Failed (${initRes.status}):`, await initRes.text());
      return;
    }

    const sessionId = initRes.headers.get('mcp-session-id');
    console.log(`� Handshake Session ID: ${sessionId}`);

    const commonHeaders = {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
      'x-supabase-project': PROJECT_ID,
    };
    if (sessionId) commonHeaders['mcp-session-id'] = sessionId;

    // 1. Run Schema
    console.log('\n--- Step 1: Run Full Neural Schema ---');
    const schemaSql = `
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Untitled Workflow',
  description TEXT,
  state JSONB DEFAULT '{"viewport": {"x": 0, "y": 0, "zoom": 1}}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.nodes (
  id TEXT PRIMARY KEY,
  workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  data JSONB NOT NULL,
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  width FLOAT,
  height FLOAT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.edges (
  id TEXT PRIMARY KEY,
  workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  target TEXT NOT NULL,
  source_handle TEXT,
  target_handle TEXT,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mcp_registry (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT,
  type TEXT DEFAULT 'server',
  data JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    user_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.function_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.traces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trace_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
    `;

    const statements = schemaSql.split(';').map(s => s.trim()).filter(s => s.length > 5);

    for (const stmt of statements) {
      console.log(`📡 Executing: ${stmt.substring(0, 50).replace(/\n/g, ' ')}...`);
      const res = await fetch(url, {
        method: 'POST',
        headers: commonHeaders,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'execute_sql',
            arguments: { query: stmt + ';' }
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result?.isError) {
          console.error('❌ TOOL ERROR:', data.result.content?.[0]?.text);
        } else {
          console.log('✅ OK');
        }
      } else {
        console.error('❌ HTTP ERROR:', await res.text());
      }
    }

    // 1b. Enable Realtime & RLS redunantly for test
    console.log('\n--- Step 1b: Enable Realtime & RLS ---');
    const syncSql = `
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE 
  public.workflows, 
  public.nodes, 
  public.edges, 
  public.events, 
  public.function_runs, 
  public.traces;

ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.function_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traces ENABLE ROW LEVEL SECURITY;
    `;

    const syncStmts = syncSql.split(';').map(s => s.trim()).filter(s => s.length > 5);
    for (const stmt of syncStmts) {
      await fetch(url, {
        method: 'POST',
        headers: commonHeaders,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'execute_sql',
            arguments: { query: stmt + ';' }
          }
        })
      });
      console.log(`📡 Meta: ${stmt.substring(0, 40)}... ✅`);
    }

    // 2. Refresh Visibility
    console.log('\n--- Step 2: Verify Tables ---');
    const listRes = await fetch(url, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 999,
        method: 'tools/call',
        params: {
          name: 'list_tables',
          arguments: { schemas: ['public'] }
        }
      })
    });

    if (listRes.ok) {
      const listData = await listRes.json();
      const tables = listData.result?.content?.[0]?.text || '';
      console.log(' Found Tables:\n', tables);
      if (tables.includes('workflows') && tables.includes('nodes')) {
        console.log('🚀 SUCCESS: ALL TABLES PERSISTED!');
      } else {
        console.log('⚠️ FAILURE: Tables still not found in list.');
      }
    }

    // 3. Verify RLS
    console.log('\n--- Step 3: Verify RLS Status ---');
    const rlsRes = await fetch(url, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1000,
        method: 'tools/call',
        params: {
          name: 'execute_sql',
          arguments: {
            query: "SELECT tablename, relrowsecurity FROM pg_tables t JOIN pg_class c ON t.tablename = c.relname WHERE schemaname = 'public' AND tablename IN ('workflows', 'events', 'nodes');"
          }
        }
      })
    });

    if (rlsRes.ok) {
      const rlsData = await rlsRes.json();
      console.log('📊 RLS Status:', JSON.stringify(rlsData.result, null, 2));
    }

  } catch (err) {
    console.error('💥 Critical Error:', err.message);
  }
}

testSupabaseMCP();
