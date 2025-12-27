import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Trymate } from '../../../../lib/trymate';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const state = requestUrl.searchParams.get('state');
  /* 
    Fix for Cloud Run Load Balancer Origin Issue:
    Cloud Run often reports '0.0.0.0' or 'localhost' in request.url.
    We must use the explicit public URL if defined, or fall back to x-forwarded-host.
  */
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto');

  let origin = requestUrl.origin;

  if (siteUrl) {
    origin = siteUrl;
  } else if (forwardedHost) {
    origin = `${forwardedProto || 'https'}://${forwardedHost}`;
  }

  let finalNext = requestUrl.searchParams.get('next') ?? '/';

  console.log('🔗 Incoming Neural Handshake:', {
    code: !!code,
    state,
    detectedOrigin: origin,
    requestUrl: request.url
  });

  if (code && state) {
    try {
      // 1. Precise State DNA Parsing
      const decodedState = decodeURIComponent(state);

      // Parse multi-fragment state DNA
      const stateParams = new URLSearchParams(decodedState.replaceAll(',', '&'));
      const userId = stateParams.get('user_id');
      const nextOverride = stateParams.get('next');

      if (nextOverride) finalNext = nextOverride;

      if (!userId) {
        console.error('❌ Neural Handshake Error: Missing user identity in state DNA.');
        return new Response(`Neural Handshake Error: Missing user identity in state.`, { status: 400 });
      }

      // 2. Token Exchange (Management API)
      const CLIENT_ID = process.env.SUPABASE_OAUTH_CLIENT_ID || process.env.NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID;
      const CLIENT_SECRET = process.env.SUPABASE_OAUTH_CLIENT_SECRET;

      if (!CLIENT_ID || !CLIENT_SECRET) {
        console.error('❌ Missing OAuth Credentials:', { hasClientId: !!CLIENT_ID, hasClientSecret: !!CLIENT_SECRET });
        return new Response('Neural Sync Error: Platform environment not calibrated (Missing CLIENT_ID or CLIENT_SECRET).', { status: 500 });
      }

      console.log('📡 Exchanging code for Management Token...');
      const tokenResponse = await fetch('https://api.supabase.com/v1/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: `${origin}/auth/callback/supabase`,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || tokenData.error) {
        console.error('❌ Supabase Token API Error:', tokenData);
        return new Response(`Infrastructure Auth Failed: ${tokenData.error_description || tokenData.error || 'Token exchange failed'}`, { status: 500 });
      }

      const accessToken = tokenData.access_token;
      if (!accessToken) {
        console.error('❌ No access token in Supabase response:', tokenData);
        return new Response('Neural Sync Error: Supabase did not return a valid management token.', { status: 500 });
      }

      console.log('✅ Access Token acquired. Synchronizing Administrative Vault...');

      // 3. Encrypted Architectural Recording (Master Vault Sync)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
      const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

      if (supabaseUrl && secretKey) {
        const tryliateSupabase = createClient(supabaseUrl, secretKey);

        const { error: updateError } = await tryliateSupabase.from('users').upsert({
          id: userId,
          supabase_connected: true,
          supabase_access_token: accessToken,
          supabase_refresh_token: tokenData.refresh_token || null,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

        if (updateError) {
          console.error('❌ Database Sync Failure:', updateError);
          return new Response(`Vault Sync Failed: ${updateError.message}`, { status: 500 });
        }

        console.log(`✅ User ${userId} synchronized in Master Vault.`);
      } else {
        console.error('❌ CRITICAL: Missing SUPABASE_SECRET_KEY or URL. Cannot save management token.');
        return new Response('Neural Sync Error: Master Vault credentials missing on server.', { status: 500 });
      }

      // 4. Finalizing and Redirect
      const successUrl = `${origin}/auth/callback/supabase/success?final=${encodeURIComponent(finalNext)}`;
      console.log(`🎉 Neural Handshake Complete. Redirecting to success page.`);

      const response = NextResponse.redirect(successUrl);

      // Set the setup token cookie for any immediate frontend-side provisioning
      response.cookies.set('trymate_setup_token', accessToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 3600,
        secure: process.env.NODE_ENV === 'production'
      });

      return response;

    } catch (err: any) {
      console.error('❌ Critical Callback Failure:', err);
      return new Response(`Neural Link Aborted: ${err.message}`, { status: 500 });
    }
  }

  // Fallback if no code/state
  return new Response(null, {
    status: 302,
    headers: { 'Location': `${origin}${finalNext}` }
  });
}
