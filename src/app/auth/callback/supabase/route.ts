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

  // Enhanced Origin Detection for Cloud Run / Proxies
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'https';

  // PRIORITY 1: Forwarded Headers (Matches User's Browser URL)
  // PRIORITY 2: Configured Site URL (Fallback for internal/stand-alone)
  // PRIORITY 3: Request Origin (Last resort)
  let origin = (host) ? `${proto}://${host}` : (siteUrl || requestUrl.origin);

  // Ensure origin doesn't end with slash
  origin = origin.replace(/\/$/, '');

  console.log('🔗 Incoming Neural Handshake:', {
    code: !!code,
    state,
    detectedOrigin: origin,
    siteUrlConfig: siteUrl,
    headerHost: host,
    requestUrl: request.url
  });

  let finalNext = requestUrl.searchParams.get('next') ?? '/';

  const renderError = (title: string, message: string, details?: any) => {
    return new Response(`
      <!DOCTYPE html>
      <html>
        <body style="font-family: system-ui, sans-serif; padding: 2rem; background: #0a0a0a; color: #ededed; line-height: 1.5;">
          <div style="max-width: 600px; margin: 0 auto; border: 1px solid #333; padding: 20px; border-radius: 8px; background: #111;">
            <h1 style="color: #ff4444; margin-top: 0;">${title}</h1>
            <p style="font-size: 1.1rem; color: #ccc;">${message}</p>
            ${details ? `<pre style="background: #000; padding: 10px; border-radius: 4px; overflow-x: auto; color: #888; font-size: 0.9rem;">${JSON.stringify(details, null, 2)}</pre>` : ''}
            <div style="margin-top: 20px;">
              <a href="/" style="color: #3b82f6; text-decoration: none;">&larr; Return Home</a>
            </div>
          </div>
        </body>
      </html>
    `, { status: 500, headers: { 'Content-Type': 'text/html' } });
  };

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
        return renderError('Neural Handshake Error', 'Missing user identity in state data.', { state: decodedState });
      }

      // 2. Token Exchange (Management API) - SECURE SERVER-SIDE ONLY
      const CLIENT_ID = process.env.NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID || process.env.SUPABASE_OAUTH_CLIENT_ID;
      const CLIENT_SECRET = process.env.SUPABASE_OAUTH_CLIENT_SECRET; // No NEXT_PUBLIC here for safety

      if (!CLIENT_ID || !CLIENT_SECRET) {
        console.error('❌ Missing OAuth Credentials:', {
          hasClientId: !!CLIENT_ID,
          hasClientSecret: !!CLIENT_SECRET,
          checked: ['SUPABASE_OAUTH_CLIENT_ID', 'NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID', 'SUPABASE_OAUTH_CLIENT_SECRET']
        });
        return renderError('Configuration Error', 'Platform environment not calibrated.', {
          error: 'Missing OAuth Credentials',
          hint: 'Ensure your Supabase OAuth Client ID and Secret are set in Cloud Run Secrets.'
        });
      }

      console.log('📡 Exchanging code for Management Token...');

      // Ensure the redirect URI exactly matches what was configured in Supabase
      const redirectUri = `${origin}/auth/callback/supabase`;
      console.log('🔗 Using Redirect URI:', redirectUri);

      const tokenResponse = await fetch('https://api.supabase.com/v1/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${CLIENT_ID.trim()}:${CLIENT_SECRET.trim()}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || tokenData.error) {
        console.error('❌ Supabase Token API Error:', tokenData);
        return renderError('Authorization Failed', 'Could not exchange code for token.', {
          supbase_error: tokenData,
          used_redirect_uri: redirectUri,
          id_used: CLIENT_ID.substring(0, 5) + '...'
        });
      }

      const accessToken = tokenData.access_token;
      if (!accessToken) {
        console.error('❌ No access token in Supabase response:', tokenData);
        return renderError('Authorization Error', 'Supabase did not return a valid management token.');
      }

      console.log('✅ Access Token acquired. Fetching Project Infrastructure...');

      // --- [NEW] Enrichment Step: Fetch Project ID and API Keys ---
      let projectRef = '';
      let anonKey = '';
      let serviceRoleKey = '';

      try {
        // 1. List Projects to find the one we care about
        console.log('📡 Listing Supabase Projects...');
        const projectsRes = await fetch('https://api.supabase.com/v1/projects', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (projectsRes.ok) {
          const projects = await projectsRes.json();
          console.log(`📊 Found ${projects.length} projects.`);

          // Pick "Tryliate Studio" or the most recently created one
          const target = projects.find((p: any) => p.name === 'Tryliate Studio') || projects[0];

          if (target) {
            projectRef = target.id;
            console.log(`🎯 Identified Target Project: ${target.name} (${projectRef})`);

            // 2. Fetch API Keys for this project
            console.log(`📡 Fetching API keys for ${projectRef}...`);
            const keysRes = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/api-keys`, {
              headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            if (keysRes.ok) {
              const keys = await keysRes.json();
              anonKey = keys.find((k: any) => k.name === 'anon')?.api_key || '';
              serviceRoleKey = keys.find((k: any) => k.name === 'service_role')?.api_key || '';
              console.log('✅ API Keys retrieved successfully.');
            } else {
              console.warn('⚠️ Could not fetch API keys:', await keysRes.text());
            }
          }
        } else {
          console.warn('⚠️ Could not list projects:', await projectsRes.text());
        }
      } catch (e: any) {
        console.error('⚠️ Enrichment failed (non-critical):', e.message);
      }
      // --- End Enrichment ---

      console.log('✅ Synchronizing Administrative Vault...');

      // 3. Encrypted Architectural Recording (Master Vault Sync)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
      const mainSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

      if (supabaseUrl && mainSecretKey) {
        const tryliateSupabase = createClient(supabaseUrl, mainSecretKey);

        const { error: updateError } = await tryliateSupabase.from('users').upsert({
          id: userId,
          supabase_connected: true,
          supabase_access_token: accessToken,
          supabase_refresh_token: tokenData.refresh_token || null,
          supabase_project_id: projectRef,
          supabase_anon_key: anonKey,
          supabase_service_role_key: serviceRoleKey,
          tryliate_initialized: !!projectRef, // If we found a project, consider it initialized
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

        if (updateError) {
          console.error('❌ Database Sync Failure:', updateError);
          // Don't fail the whole flow if purely DB sync fails, but log it
        } else {
          console.log(`✅ User ${userId} synchronized in Master Vault.`);
        }
      } else {
        console.error('❌ CRITICAL: Missing SUPABASE_SECRET_KEY or URL. Cannot save management token.');
      }

      // 4. Finalizing and Redirect
      const successUrl = `${origin}/auth/callback/supabase/success?final=${encodeURIComponent(finalNext)}`;
      console.log(`🎉 Neural Handshake Complete. Redirecting to: ${successUrl}`);

      // We use a explicit absolute URL for the redirect
      const response = NextResponse.redirect(new URL(successUrl, origin));

      // Set the setup token cookie for any immediate frontend-side provisioning
      response.cookies.set('trymate_setup_token', accessToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 3600,
        secure: true // Always secure in production
      });

      return response;

    } catch (err: any) {
      console.error('❌ Critical Callback Failure:', err);
      return renderError('System Malfunction', 'Critical failure during neural link handshake.', {
        message: err.message,
        stack: err.stack
      });
    }
  }

  // Fallback if no code/state
  const fallbackUrl = new URL(finalNext, origin).toString();
  return NextResponse.redirect(fallbackUrl);
}
