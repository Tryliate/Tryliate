
import fetch from 'node-fetch';

const BACKEND_URL = 'https://tryliate-backend-374665986758.us-east1.run.app';
const INIT_ENDPOINT = `${BACKEND_URL}/api/debug/schema-init`;

async function waitForDeploymentAndInit() {
  console.log('⏳ Waiting for deployment to complete...');

  let deployed = false;
  // Poll for the new endpoint availability
  for (let i = 0; i < 60; i++) { // Try for 10 minutes
    try {
      // We check if the NEW endpoint exists (it wasn't there before)
      const res = await fetch(INIT_ENDPOINT);
      if (res.status !== 404) { // If it returns 200 or 500, it exists! 404 means old version.
        console.log('🚀 New deployment detected!');
        deployed = true;

        // Now run the init
        console.log('🛠️ Triggering Schema Initialization...');
        const initRes = await fetch(INIT_ENDPOINT);
        if (initRes.ok) {
          const data = await initRes.json();
          console.log('✅ Init Result:', data);
        } else {
          console.log('⚠️ Init endpoint returned error:', initRes.status);
        }

        console.log('🔧 Triggering Schema Repair...');
        const repairRes = await fetch(`${BACKEND_URL}/api/debug/schema-repair`);
        if (repairRes.ok) {
          const data = await repairRes.json();
          console.log('✅ Repair Result:', data);
        } else {
          console.log('⚠️ Repair endpoint returned error:', repairRes.status);
        }
        break;
      }
    } catch (e) {
      // Ignore connection errors during deployment
    }

    // Wait 10 seconds
    if (i % 6 === 0) console.log(`... polling (${i / 6} mins)`);
    await new Promise(r => setTimeout(r, 10000));
  }

  if (deployed) {
    console.log('\n🔍 Verifying Engine...');
    const verify = await fetch(`${BACKEND_URL}/api/mcp/foundry-nodes`);
    const status = verify.status;
    console.log(`foundry-nodes status: ${status} ${status === 200 ? '✅ (WORKING)' : '❌ (STILL FAILING)'}`);
  } else {
    console.log('❌ Timeout waiting for deployment.');
  }
}

waitForDeploymentAndInit();
