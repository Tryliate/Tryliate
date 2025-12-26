
import fetch from 'node-fetch';

const isLocal = process.argv.includes('--local') || process.env.LOCAL_TEST === 'true';
const BASE_URL = isLocal ? 'http://localhost:3001' : 'https://frontend-374665986758.us-central1.run.app';
const ENDPOINT = `${BASE_URL}/auth/callback/neural`;

async function verifyDeployment() {
  console.log('🧪 Starting Neural Auth Endpoint Verification...');
  console.log(`Target: ${ENDPOINT}`);

  try {
    // Test Case 1: Error Probe
    // We expect the new HTML error page, NOT a 404 or a standardized Next.js error page.
    // The presence of our custom HTML proves the new code is live.
    console.log('\nPlease wait... Probing with simulated error...');
    const response = await fetch(`${ENDPOINT}?error=probe_test&error_description=verification_script`);

    const text = await response.text();
    const status = response.status;

    console.log(`HTTP Status: ${status}`);

    if (status === 200 && text.includes('PROTOCOL FAILURE') && text.includes('probe_test')) {
      console.log('✅ PASS: Endpoint is active and serving the custom Error Interface.');
      console.log('   (The server correctly received the error param and rendered the popup closure UI)');
    } else if (status === 404) {
      console.error('❌ FAIL: Endpoint returned 404. Deployment might not have propagated yet.');
    } else {
      console.warn('⚠️ WARNING: Unexpected response content.');
      console.log('Preview:', text.substring(0, 200));
    }

    // Test Case 2: Code Probe (Missing params expected to fail)
    // We expect it to try and validate, fail (missing cookies/session), and return the error UI.
    // It should NOT redirect to the login page anymore (logic change in v1.6.2 to return HTML for popup context?)
    // Actually, looking at the code:
    // If specific errors occur (like protocol breakdown), it returns HTML.
    // If session is missing, it MIGHT still redirect or error.
    // Let's stick to the Error Probe as the primary "Is it alive?" check.

  } catch (err) {
    console.error('❌ FAIL: Network or execution error.', err);
  }
}

verifyDeployment();
