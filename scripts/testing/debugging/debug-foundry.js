
import { spawnSync } from 'child_process';

async function checkBuild() {
  console.log('⏳ Checking Cloud Build status...');
  while (true) {
    const res = spawnSync('gcloud', ['builds', 'list', '--region=us-central1', '--limit=1', '--format=value(status)'], { encoding: 'utf-8' });
    const status = res.stdout ? res.stdout.trim() : 'UNKNOWN';
    if (status === 'SUCCESS') {
      console.log('✅ Build SUCCESS!');
      break;
    } else if (status === 'FAILURE' || status === 'CANCELLED') {
      console.error('❌ Build FAILED or CANCELLED.');
      process.exit(1);
    }
    console.log(`... status: ${status}. Waiting 30s...`);
    await new Promise(r => setTimeout(r, 30000));
  }
}

async function debugEndpoint() {
  console.log('🔍 Probing /api/mcp/foundry-nodes...');
  const url = 'https://tryliate-backend-374665986758.us-east1.run.app/api/mcp/foundry-nodes';
  try {
    const res = await fetch(url);
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log('Body:', text);
    try {
      const json = JSON.parse(text);
      if (json.details) {
        console.log('\n🚨 ERROR DETAILS 🚨');
        console.log(json.details);
      }
      if (json.stack) {
        console.log('\n📚 STACK TRACE 📚');
        console.log(json.stack);
      }
    } catch (e) { }
  } catch (err) {
    console.error('Fetch failed:', err.message);
  }
}

async function main() {
  await checkBuild();
  // Wait a bit for Cloud Run to actually swap traffic (sometimes takes a few seconds after build success)
  console.log('⏳ Waiting 60s for Cloud Run traffic migration...');
  await new Promise(r => setTimeout(r, 60000));
  await debugEndpoint();
}

main();
