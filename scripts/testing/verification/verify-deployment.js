
import fetch from 'node-fetch';

const PROJECT_ID = 'pwadtgqevdemsoqhqmqm';
const ACCESS_TOKEN = 'sbp_3a31701abf274f90bddabca8eaaca7b4a9841ae1';

async function verify() {
  const url = 'https://mcp.supabase.com/mcp?project_ref=' + PROJECT_ID;
  console.log('🧐 Final Neural Audit...');

  try {
    const initRes = await fetch(url, {
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
        params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'Auditor', version: '1.0.0' } }
      })
    });
    const sessionId = initRes.headers.get('mcp-session-id');

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + ACCESS_TOKEN,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'x-supabase-project': PROJECT_ID,
        'mcp-session-id': sessionId
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: 'execute_sql',
          arguments: {
            query: `
              SELECT tablename, relrowsecurity 
              FROM pg_tables t 
              JOIN pg_class c ON t.tablename = c.relname 
              WHERE schemaname = 'public' AND tablename IN ('workflows', 'nodes', 'agent_memory');
              
              SELECT pubname, schemaname, tablename 
              FROM pg_publication_tables 
              WHERE pubname = 'supabase_realtime';
            `
          }
        }
      })
    });

    const data = await res.json();
    console.log('--- AUDIT RESULTS ---');
    console.log(data.result?.content?.[0]?.text);
  } catch (e) {
    console.error('Audit Error:', e);
  }
}

verify();
