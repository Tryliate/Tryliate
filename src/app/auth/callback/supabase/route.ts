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
        return new Response(`Neural Handshake Error: Missing user identity in state DNA.`, { status: 400 });
      }

      // 2. Token Exchange (Management API)
      const CLIENT_ID = process.env.SUPABASE_OAUTH_CLIENT_ID || process.env.NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID;
      const CLIENT_SECRET = process.env.SUPABASE_OAUTH_CLIENT_SECRET;

      if (!CLIENT_ID || !CLIENT_SECRET) {
        console.error('Missing OAuth Credentials', { hasClientId: !!CLIENT_ID, hasClientSecret: !!CLIENT_SECRET });
        return new Response('Neural Sync Error: Platform environment not calibrated for OAuth.', { status: 500 });
      }

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

      if (tokenData.error) {
        console.error('❌ Token exchange failed:', tokenData);
        return new Response(`Infrastructure Auth Failed: ${tokenData.error_description || tokenData.error}`, { status: 500 });
      }

      const accessToken = tokenData.access_token;
      console.log('✅ Access Token acquired. Deferring Infrastructure Provisioning to User Control...');

      // 3. Encrypted Architectural Recording (PENDING STATE)
      // 3. Encrypted Architectural Recording (UPDATED)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

      if (supabaseUrl && serviceRoleKey) {
        try {
          const tryliateSupabase = createClient(supabaseUrl, serviceRoleKey);

          console.log('🔄 Syncing Supabase keys to user profile (Service Role)...');

          const { error: updateError } = await tryliateSupabase.from('users').update({
            supabase_connected: true,
            supabase_access_token: accessToken,
            supabase_refresh_token: tokenData.refresh_token || null,
            updated_at: new Date().toISOString()
          }).eq('id', userId);

          if (updateError) {
            console.error('❌ Failed to update user profile with Supabase keys:', updateError);
            // We don't block the redirect, but we log the error.
          } else {
            console.log('✅ User profile updated with Supabase connection status.');
          }
        } catch (err) {
          console.error('❌ Unexpected error during Supabase sync:', err);
        }
      } else {
        console.warn('⚠️ Missing Service Role Key or Supabase URL. Cannot update user profile.');
      }

      console.log('🎉 Neural Handshake Complete. Preparing Redirect...');

      // 4. Secure Cookie Storage for the "Create DB" Step
      const redirectUrlStr = `${origin}/auth/callback/supabase/success?final=${encodeURIComponent(finalNext)}`;
      console.log(`➡️ Redirecting to: ${redirectUrlStr}`);

      // We use a standard Response object instead of NextResponse to avoid potential internal Next.js
      // relative-URL resolution issues in the Cloud Run environment.
      const response = new Response(null, {
        status: 302,
        headers: {
          'Location': redirectUrlStr,
        }
      });

      // Manually set the cookie header
      const cookieValue = `trymate_setup_token=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
      response.headers.append('Set-Cookie', cookieValue);

      console.log('🍪 Cookie header set. Returning standard Response.');
      return response;

    } catch (err: any) {
      console.error('❌ Critical Callback Failure:', err);
      // Fallback redirect on error
      return new Response(null, {
        status: 302,
        headers: { 'Location': `${origin}${finalNext}?error=auth_failed` }
      });
    }
  }

  // Fallback if no code/state
  return new Response(null, {
    status: 302,
    headers: { 'Location': `${origin}${finalNext}` }
  });
}
