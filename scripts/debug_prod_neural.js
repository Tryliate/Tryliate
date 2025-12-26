
import fetch from 'node-fetch';

async function debugProduction() {
  const url = 'https://frontend-374665986758.us-central1.run.app/auth/callback/neural?error=probe_test';
  console.log(`🔍 Debugging Production: ${url}`);

  try {
    const res = await fetch(url);
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Headers:`, JSON.stringify(res.headers.raw(), null, 2));
    console.log(`Body Length: ${text.length}`);
    console.log(`Body:\n${text}`);
  } catch (e) {
    console.error(`Fetch Error: ${e.message}`);
  }
}

debugProduction();
