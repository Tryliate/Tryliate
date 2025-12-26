
import fetch from 'node-fetch';

const PROJECT_ID = 'pwadtgqevdemsoqhqmqm';
const ACCESS_TOKEN = 'sbp_3a31701abf274f90bddabca8eaaca7b4a9841ae1';

async function verifyMCP() {
  const url = 'https://mcp.supabase.com/mcp?project_ref=' + PROJECT_ID;
  console.log('🔗 Probing Official Supabase MCP Bridge...');

  try {
    // 1. Initial Handshake
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
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'Tryliate-Tool-Probe', version: '1.0.0' }
        }
      })
    });

    if (!initRes.ok) throw new Error('Handshake Failed');
    const sessionId = initRes.headers.get('mcp-session-id');
    console.log('✅ Handshake: OK');

    // 2. List Tools
    const toolRes = await fetch(url, {
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
        id: 2,
        method: 'tools/list',
        params: {}
      })
    });

    const toolData = await toolRes.json();
    if (toolData.result?.tools) {
      console.log('✅ MCP Bridge is ALIVE.');
      console.log('🛠️ Available Tools:');
      toolData.result.tools.forEach(t => console.log(`   - ${t.name}: ${t.description.substring(0, 50)}...`));

      console.log('\n🚀 ALL SYSTEMS NOMINAL: Supabase MCP is fully functional for this project.');
    } else {
      console.log('⚠️ Bridge connected but no tools found.');
    }

  } catch (err) {
    console.error('❌ MCP Bridge Error:', err.message);
  }
}

verifyMCP();
