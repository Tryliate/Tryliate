
import fetch from 'node-fetch';

const BACKEND_URL = 'https://tryliate-backend-374665986758.us-east1.run.app';
const FRONTEND_URL = 'https://frontend-374665986758.us-central1.run.app';

async function testEngine() {
  console.log('🧪 Starting Tryliate Neural Engine Diagnostics...\n');

  // 1. Basic Online Check
  console.log('📡 [Step 1] Checking Backend Connectivity...');
  try {
    const res = await fetch(`${BACKEND_URL}/`);
    const data = await res.json();
    console.log(`✅ Backend is ONLINE: ${data.engine} (${data.status})`);
  } catch (e) {
    console.error('❌ Backend Connectivity FAILED:', e.message);
  }

  // 2. Health & Dependencies Check
  console.log('\n📡 [Step 2] Probing Neural Infrastructure (DB, Redis, Auth)...');
  try {
    const res = await fetch(`${BACKEND_URL}/health`);
    const health = await res.json();
    console.log(`📊 Health Status: ${health.status}`);
    console.log(`   - Supabase: ${health.services.supabase === 'healthy' ? '🟢' : '🔴'} ${health.services.supabase}`);
    console.log(`   - Neon (DB): ${health.services.neon === 'healthy' ? '🟢' : '🔴'} ${health.services.neon}`);
    console.log(`   - Redis:    ${health.services.redis === 'healthy' ? '🟢' : '🔴'} ${health.services.redis}`);

    if (res.status === 200) {
      console.log('✅ All Infrastructure components are healthy.');
    } else {
      console.warn('⚠️ Some components are degraded.');
    }
  } catch (e) {
    console.error('❌ Health Probe FAILED:', e.message);
  }

  // 3. MCP Registry Proxy Check
  console.log('\n📡 [Step 3] Checking MCP Registry Link...');
  try {
    const res = await fetch(`${BACKEND_URL}/api/mcp/official`);
    if (res.ok) {
      console.log('✅ MCP Registry Proxy is operational.');
    } else {
      console.error('❌ MCP Registry Proxy error:', res.status);
    }
  } catch (e) {
    console.error('❌ MCP Registry Proxy FAILED:', e.message);
  }

  // 4. Frontend Integration Check
  console.log('\n📡 [Step 4] Verifying Frontend -> Engine handshake...');
  const frontendUrls = [
    'https://frontend-374665986758.us-central1.run.app',
    'https://frontend-nh767yfnoq-uc.a.run.app'
  ];

  for (const url of frontendUrls) {
    console.log(`   - Testing ${url}...`);
    try {
      const res = await fetch(`${url}/api/run-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'test-diagnostic', canvasJson: { nodes: [], edges: [] } })
      });

      const text = await res.text();
      console.log(`     Status: ${res.status}`);

      try {
        const data = JSON.parse(text);
        if (data.success) {
          console.log('     ✅ Frontend Handshake successful:', data.message);
        } else {
          console.error('     ❌ Frontend Handshake failed:', data.error);
        }
      } catch (e) {
        console.warn('     ⚠️ Could not parse JSON response:', text.substring(0, 100));
      }
    } catch (e) {
      console.error(`     ❌ Connection FAILED to ${url}:`, e.message);
    }
  }

  console.log('\n🏁 Diagnostics Complete.');
}

testEngine();
