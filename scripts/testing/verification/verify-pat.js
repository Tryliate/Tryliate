
import fetch from 'node-fetch';

const PROJECT_ID = 'pwadtgqevdemsoqhqmqm';
const ACCESS_TOKEN = 'sbp_3a31701abf274f90bddabca8eaaca7b4a9841ae1';

async function test() {
  const url = 'https://mcp.supabase.com/mcp?project_ref=' + PROJECT_ID;
  console.log('Testing Handshake...');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + ACCESS_TOKEN,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-supabase-project': PROJECT_ID
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'Test', version: '1.0.0' }
        }
      })
    });

    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
  } catch (e) {
    console.error('Error:', e);
  }
}

test();
