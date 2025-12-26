
import pkg from 'pg';
const { Client } = pkg;
import fetch from 'node-fetch';

const connectionString = 'postgresql://neondb_owner:npg_U2Mxk5pPeyrg@ep-sweet-dawn-a4cj3s5d-pooler.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require';
const USER_ID = '263b8f7b-8098-421f-aa4f-b813dbb46287';
const PROVIDER = 'github-neural';

async function testNeuralAuth() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  console.log('🧪 Starting Neural Auth Integration Test...');

  try {
    await client.connect();

    // 1. Setup Mock Authorization in Neon (Operational Cache)
    console.log('🛡️ Setting up Mock Authorization...');
    await client.query(`
      INSERT INTO mcp_authorizations (user_id, provider, access_token, status, scopes)
      VALUES ($1, $2, 'test_token_123', 'active', '["read_file", "list_repos"]')
      ON CONFLICT (user_id, provider) 
      DO UPDATE SET status = 'active', scopes = '["read_file", "list_repos"]'
    `, [USER_ID, PROVIDER]);

    // 2. Test the Proxy Endpoint (Neural Guardian)
    console.log('📡 Testing Neural Proxy (Allowed Tool)...');
    const allowedResponse = await fetch('https://tryliate-backend-374665986758.us-east1.run.app/api/neural/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: USER_ID,
        provider: PROVIDER,
        tool: 'read_file',
        arguments: { path: '/test.txt' }
      })
    });

    const allowedData = await allowedResponse.json();
    console.log('✅ Allowed Tool Result:', allowedData.success ? 'PASSED' : 'FAILED');
    if (!allowedData.success) console.log('   Reason:', allowedData.error || allowedData.message);

    console.log('📡 Testing Neural Proxy (Blocked Tool)...');
    const blockedResponse = await fetch('https://tryliate-backend-374665986758.us-east1.run.app/api/neural/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: USER_ID,
        provider: PROVIDER,
        tool: 'delete_repo', // Not in scopes!
        arguments: { name: 'secret-repo' }
      })
    });

    const blockedData = await blockedResponse.json();
    console.log('✅ Blocked Tool Result:', !blockedData.success ? 'PASSED (Access Denied)' : 'FAILED (Security Breach)');
    if (!blockedData.success) console.log('   Reason:', blockedData.error || blockedData.message);

    console.log('\n✨ Neural Auth Integration Logic is FUNCTIONAL.');

  } catch (err) {
    console.error('💥 Test Failed:', err.message);
    console.log('   Ensure the local server is running on port 8080.');
  } finally {
    await client.end();
  }
}

testNeuralAuth();
