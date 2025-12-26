
import fetch from 'node-fetch';

const BACKEND_URL = 'https://tryliate-backend-374665986758.us-east1.run.app';

async function testEndpoints() {
  const endpoints = [
    { name: 'Root', path: '/' },
    { name: 'Health', path: '/health' },
    { name: 'MCP Official', path: '/api/mcp/official' },
    { name: 'Foundry Nodes', path: '/api/mcp/foundry-nodes' },
    { name: 'MCP Glama', path: '/api/mcp/glama' }
  ];

  console.log('--- Testing Engine Endpoints ---');
  for (const ep of endpoints) {
    try {
      const res = await fetch(`${BACKEND_URL}${ep.path}`);
      console.log(`[${ep.name}] Status: ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`    Success: ${JSON.stringify(data).substring(0, 50)}...`);
      }
    } catch (e) {
      console.log(`[${ep.name}] FAILED: ${e.message}`);
    }
  }
}

testEndpoints();
