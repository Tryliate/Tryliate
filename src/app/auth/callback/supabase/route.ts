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
  const renderError = (title: string, message: string) => {
    return new Response(`
      <div style="font-family:sans-serif; padding:2rem; background:#111; color:#fff;">
        <h1 style="color:#ff5555">${title}</h1>
        <p>${message}</p>
        <a href="/" style="color:#55aaff">&larr; Go Home</a>
      </div>
    `, { status: 500, headers: { 'Content-Type': 'text/html' } });
  };

  if (!code || !state) {
    return NextResponse.redirect(`${origin}${finalNext}`);
  }

  try {
    // 1. Decode State
    const decodedState = decodeURIComponent(state);
    const stateParams = new URLSearchParams(decodedState.replaceAll(',', '&'));
    const userId = stateParams.get('user_id');
    const nextOverride = stateParams.get('next');
    if (nextOverride) finalNext = nextOverride;

    if (!userId) throw new Error('User IDENTITY missing in state parameter.');

    // 2. Token Exchange
    const redirectUri = `${origin}/auth/callback/supabase`;
    const tokenData = await exchangeCodeForToken(code, redirectUri);

    // 3. Project Enrichment (Best Effort)
    const projectData = await enrichUserProjectData(tokenData.access_token);

    // 4. Vault Sync (Database Update)
    await syncUserToVault(userId, tokenData, projectData);

    // 5. Success Redirect
    const successUrl = new URL(`${origin}/auth/callback/supabase/success`);
    successUrl.searchParams.set('final', finalNext);

    const response = NextResponse.redirect(successUrl);

    // Authorization Cookie
    response.cookies.set('trymate_setup_token', tokenData.access_token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600
    });

    console.log('🎉 [Auth Flow] Success! Redirecting.');
    return response;

  } catch (err: any) {
    console.error('❌ [Auth Flow] Critical Error:', err);
    return renderError('Authorization Failed', err.message || 'Unknown system error.');
  }
}
