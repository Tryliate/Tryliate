
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const userId = '263b8f7b-8098-421f-aa4f-b813dbb46287';
const accessToken = 'sbp_oauth_b9bf9a2e773d3b4b6903a590d2b331b1dba3fda8';
const backendUrl = 'https://tryliate-backend-374665986758.us-east1.run.app/api/infrastructure/provision';

async function runProvision() {
  console.log('🚀 Triggering Neural Engine for user...');

  const response = await fetch(backendUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, accessToken })
  });

  const reader = response.body;
  const decoder = new TextDecoder();

  // Read the stream
  for await (const chunk of reader) {
    const text = decoder.decode(chunk);
    process.stdout.write(text);
  }

  console.log('\n\n🏁 Provisioning attempt complete.');
}

runProvision();
