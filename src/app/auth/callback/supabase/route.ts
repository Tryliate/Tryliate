import { NextResponse } from 'next/server';
import {
  exchangeCodeForToken,
  enrichUserProjectData,
  syncUserToVault
} from '../../../../lib/auth/supabase-modules';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const state = requestUrl.searchParams.get('state');

  // --- Origin Detection Logic ---
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  let origin = (host) ? `${proto}://${host}` : (siteUrl || requestUrl.origin);
  origin = origin.replace(/\/$/, '');

  // Default redirect path
  let finalNext = requestUrl.searchParams.get('next') ?? '/';

  console.log('🔗 [Auth Flow] Incoming Handshake:', {
    hasCode: !!code,
    hasState: !!state,
    origin
  });

  // Helper for error responses
  const renderError = (title: string, message: string, syncSuccessful = false) => {
    return new Response(`
      <html>
        <head>
          <title>Auth Error</title>
          <style>
            body { font-family: sans-serif; padding: 2rem; background: #050505; color: #fff; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #0a0a0a; border: 1px solid #222; padding: 40px; border-radius: 20px; max-width: 400px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            h1 { color: #fff; margin-bottom: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; }
            p { color: #888; margin-bottom: 30px; line-height: 1.5; font-size: 14px; }
            .btn { background: #fff; color: #000; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 12px; cursor: pointer; border: none; transition: all 0.2s; text-transform: uppercase; }
            .btn:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(255,255,255,0.2); }
            .status { margin-top: 20px; font-size: 10px; color: #333; text-transform: uppercase; font-weight: 800; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>${title}</h1>
            <p>${message}</p>
            <button onclick="handleClose()" class="btn">Close & Return to Canvas</button>
            <div class="status">${syncSuccessful ? 'IDENTITY SYNC SUCCESSFUL • PROTOCOL CRASHED IN FINAL HOP' : 'PROTOCOL CRASHED'}</div>
          </div>
          <script>
            function handleClose() {
              if (window.opener) {
                window.opener.postMessage({ type: 'TRYLIATE_AUTH_SUCCESS' }, '*');
              }
              window.close();
            }
            // Auto close if sync was actually successful
            if (${syncSuccessful}) {
              setTimeout(handleClose, 3000);
            }
          </script>
        </body>
      </html>
    `, { status: syncSuccessful ? 200 : 500, headers: { 'Content-Type': 'text/html' } });
  };

  if (!code || !state) {
    console.warn('⚠️ [Auth Flow] Missing Code or State');
    return NextResponse.redirect(`${origin}${finalNext}`);
  }

  let syncDone = false;
  try {
    // 1. Decode State
    console.log('🧬 [Auth Flow] Decoding state...');
    const decodedState = decodeURIComponent(state);
    const stateParams = new URLSearchParams(decodedState.replaceAll(',', '&'));
    const userId = stateParams.get('user_id');
    const nextOverride = stateParams.get('next');
    if (nextOverride) finalNext = nextOverride;

    if (!userId) throw new Error('User IDENTITY missing in state parameter.');

    // 2. Token Exchange
    const redirectUri = `${origin}/auth/callback/supabase`;
    console.log('📡 [Auth Flow] Exchanging code for token...', { redirectUri });
    const tokenData = await exchangeCodeForToken(code, redirectUri);

    // 3. Project Enrichment (Best Effort)
    console.log('📡 [Auth Flow] Enriching project data...');
    const projectData = await enrichUserProjectData(tokenData.access_token);

    // 4. Vault Sync (Database Update)
    console.log('🛡️ [Auth Flow] Synchronizing Identity to Vault for', userId);
    await syncUserToVault(userId, tokenData, projectData);
    syncDone = true;

    // 5. Success Redirect
    console.log('🎉 [Auth Flow] Protocol Stabilization Complete. Finalizing redirect.');
    const successUrlStr = `${origin}/auth/callback/supabase/success?final=${encodeURIComponent(finalNext)}`;
    
    const response = NextResponse.redirect(successUrlStr);

    // Authorization Cookie
    response.cookies.set('trymate_setup_token', tokenData.access_token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: origin.startsWith('https'),
      maxAge: 3600
    });

    return response;

  } catch (err: any) {
    console.error('❌ [Auth Flow] Critical Error:', err);
    // If sync was already done, we show a "Soft Error" that still allows closing
    return renderError('Handshake Disruption', err.message || 'Unknown system error.', syncDone);
  }
}
