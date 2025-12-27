import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env.local') });
dotenv.config();

/**
 * OAuth Diagnostic Utility
 * This script verifies if your environment is correctly configured for Supabase OAuth.
 */
async function runDiagnostic() {
  console.log('🔍 Starting Tryliate OAuth Diagnostic...\n');

  const clientId = process.env.NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID || process.env.SUPABASE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.SUPABASE_OAUTH_CLIENT_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // 1. Check Variable Presence
  console.log('--- Phase 1: Environment Variables ---');
  console.log('CLIENT_ID present:', !!clientId ? `✅ (${clientId.substring(0, 5)}...)` : '❌ MISSING');
  console.log('CLIENT_SECRET present:', !!clientSecret ? '✅ (Hidden)' : '❌ MISSING');
  console.log('SITE_URL detected:', siteUrl);
  console.log('');

  if (!clientId || !clientSecret) {
    console.error('🛑 DIAGNOSTIC FAILED: Missing essential OAuth credentials.');
    console.log('Please ensure NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID and SUPABASE_OAUTH_CLIENT_SECRET are set.');
    return;
  }

  // 2. Validate Redirect URI
  console.log('--- Phase 2: Redirect URI Validation ---');
  const expectedRedirect = `${siteUrl.replace(/\/$/, '')}/auth/callback/supabase`;
  console.log('Calculated Redirect URI:', expectedRedirect);
  console.log('💡 IMPORTANT: Ensure this EXACT URL is added to "Redirect URIs" in your Supabase OAuth App settings.');
  console.log('');

  // 3. Credential Handshake Test (Mock Token Exchange)
  console.log('--- Phase 3: Supabase API Handshake ---');
  console.log('Attempting to contact Supabase Management API...');

  try {
    const response = await fetch('https://api.supabase.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId.trim()}:${clientSecret.trim()}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: 'diagnostic_probe', // Intentional dummy code
        redirect_uri: expectedRedirect,
      }),
    });

    const status = response.status;
    const result = await response.json();

    if (status === 401 || (result.error === 'invalid_client')) {
      console.error('❌ AUTHENTICATION FAILED: The Client ID or Secret is incorrect.');
      console.log('Raw Error:', result);
    } else if (result.error === 'invalid_grant' || result.error_description?.includes('code')) {
      console.log('✅ CREDENTIALS VALID: Supabase recognized your application!');
      console.log('Note: Received "invalid_grant" as expected (diagnostic code was used).');
    } else if (result.error === 'redirect_uri_mismatch') {
      console.error('❌ CONFIGURATION ERROR: Redirect URI mismatch.');
      console.log('The URI calculated by this script does not match what you configured in Supabase.');
    } else {
      console.log('❓ Unexpected Status:', status);
      console.log('Response:', result);
    }

  } catch (err) {
    console.error('🛑 CONNECTION ERROR: Could not reach Supabase API.');
    console.log('Reason:', err.message);
    if (err.message.includes('fetch failed')) {
      console.log('💡 Note: This might be due to local network restrictions. Ensure you have internet access.');
    }
  }

  console.log('\n--- Diagnostic Complete ---');
  console.log('👉 If Phase 3 returned "invalid_grant", your credentials are CORRECT.');
  console.log('👉 If Phase 3 returned "invalid_client", check your SECRET KEY.');
}

runDiagnostic();
