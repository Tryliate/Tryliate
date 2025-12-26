import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  console.log('📡 [Neural Handshake] Incoming request:', request.url);

  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    if (error) {
      console.log('⚠️ [Neural Handshake] Error detected:', { error, errorDescription });
      return new Response(createErrorHtml(error, errorDescription), { status: 200, headers: { 'Content-Type': 'text/html' } });
    }

    if (!code || !state) throw new Error('Invalid Handshake: Missing code or state.');

    // 1. Recover User Identity from state
    let userId: string;
    try {
      const decoded = JSON.parse(atob(state));
      userId = decoded.userId;
    } catch {
      // Fallback for older state formats
      throw new Error('Identity verification failed. Please try again.');
    }

    // 2. Initialize Master Connection
    const masterUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const masterKey = process.env.SUPABASE_SECRET_KEY || '';
    const masterSupabase = createClient(masterUrl, masterKey);

    // 3. Fetch User Infrastructure Info
    const { data: userData, error: userErr } = await masterSupabase
      .from('users')
      .select('supabase_url, supabase_publishable_key')
      .eq('id', userId)
      .single();

    if (userErr || !userData?.supabase_url) throw new Error('Infrastructure context not found. Is your project connected?');

    // 4. Perform PKCE Token Exchange
    const cookieStore = await cookies();
    const verifier = cookieStore.get('mcp_code_verifier')?.value;
    if (!verifier) throw new Error('Security Verifier expired. Please try again.');

    console.log(`🔄 Exchanging code for tokens on ${userData.supabase_url}...`);

    // Manual exchange because we are targeting the user's project, not Tryliate's
    const tokenResponse = await fetch(`${userData.supabase_url}/auth/v1/token?grant_type=pkce`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': userData.supabase_publishable_key || ''
      },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID,
        client_secret: process.env.SUPABASE_OAUTH_CLIENT_SECRET,
        code,
        code_verifier: verifier,
        redirect_uri: `${url.origin}/auth/callback/neural`
      })
    });

    if (!tokenResponse.ok) {
      const errBody = await tokenResponse.text();
      throw new Error(`Token Exchange Failed: ${errBody}`);
    }

    const tokens = await tokenResponse.json();

    // 5. Synchronize to Dual-Vault Architecture
    console.log(`🛡️ Synchronizing Identity for ${userId}...`);

    // A. Master Supabase: Store Refresh Token for long-term access
    await masterSupabase.from('users').update({
      supabase_refresh_token: tokens.refresh_token,
      updated_at: new Date().toISOString()
    }).eq('id', userId);

    // B. Neon Brain: Initialize Authorization Scopes via Master API 
    // (In production, this might be a direct Neon hit, but for now we follow the Gateway)
    // We'll use the existing server API if possible, or direct if we have the NEON_DATABASE_URL
    const NEON_URL = process.env.NEON_DATABASE_URL;
    if (NEON_URL) {
      const { Client } = await import('pg');
      const client = new Client({ connectionString: NEON_URL, ssl: { rejectUnauthorized: false } });
      await client.connect();
      await client.query(`
        INSERT INTO mcp_authorizations (user_id, provider, access_token, refresh_token, status, scopes)
        VALUES ($1, $2, $3, $4, 'verified', $5)
        ON CONFLICT (user_id, provider) DO UPDATE SET
          access_token = EXCLUDED.access_token,
          refresh_token = EXCLUDED.refresh_token,
          status = 'verified',
          last_handshake_at = NOW()
      `, [userId, 'supabase-neural', tokens.access_token, tokens.refresh_token, JSON.stringify(['read_file', 'list_repos', 'send_message'])]);
      await client.end();
    }

    console.log('✅ [Neural Handshake] Protocol Stabilization Complete.');

    return new Response(createSuccessHtml(), { status: 200, headers: { 'Content-Type': 'text/html' } });

  } catch (e: any) {
    console.error('❌ [Neural Handshake] FATAL ERROR:', e.message);
    return new Response(createErrorHtml('BRIDGE_CRASH', e.message), { status: 200, headers: { 'Content-Type': 'text/html' } });
  }
}

function createSuccessHtml() {
  return `<html>
    <head><title>Neural Online</title></head>
    <body style="background:#000;color:#0f0;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
      <div style="text-align:center;border:1px solid rgba(0,255,0,0.2);padding:40px;border-radius:20px;background:rgba(0,10,0,0.5);backdrop-filter:blur(10px);">
        <h1 style="letter-spacing:0.3em;margin:0;">NEURAL KERNEL ONLINE</h1>
        <p style="font-size:9px;color:#050;margin-top:15px;text-transform:uppercase;font-weight:900;">Identity Synchronized & Scopes Verified</p>
      </div>
      <script>
        if (window.opener) {
          window.opener.postMessage({ type: 'NEURAL_HANDSHAKE_SUCCESS' }, window.location.origin);
          setTimeout(() => window.close(), 1500);
        }
      </script>
    </body>
  </html>`;
}

function createErrorHtml(code: string, desc: string | null) {
  return `<html>
    <head><title>Neural Error</title></head>
    <body style="background:#000;color:#f33;font-family:monospace;padding:50px;text-align:center;">
      <h1 style="letter-spacing:0.2em;">PROTOCOL FAILURE</h1>
      <p style="color:#666;text-transform:uppercase;font-size:10px;">ID: ${code}</p>
      <div style="margin-top:20px;padding:20px;border:1px solid #221111;border-radius:10px;text-align:left;display:inline-block;max-width:400px;background:rgba(20,0,0,0.5);">
        <p style="font-size:12px;margin:0;">${desc || 'The neural bridge failed to stabilize.'}</p>
      </div>
      <p style="margin-top:30px;font-size:9px;color:#333;">TRYLIATE NEURAL IDENTITY v1.2.0 • PRODUCTION READY</p>
    </body>
  </html>`;
}
