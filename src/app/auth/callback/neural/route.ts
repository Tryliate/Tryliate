export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  console.log('📡 [Neural Handshake] Incoming request:', request.url);

  try {
    // Robust URL parsing: Cloud Run / Proxies might send relative paths.
    // We provide a fallback base to ensure the URL constructor never throws.
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    const url = new URL(request.url, baseUrl);

    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    if (error) {
      console.log('⚠️ [Neural Handshake] Error detected:', { error, errorDescription });
      return new Response(
        `<html>
          <head><title>Neural Error</title></head>
          <body style="background:#000;color:#f33;font-family:monospace;padding:50px;text-align:center;">
            <h1 style="letter-spacing:0.2em;">PROTOCOL FAILURE</h1>
            <p style="color:#666;text-transform:uppercase;font-size:10px;">ID: ${error}</p>
            <div style="margin-top:20px;padding:20px;border:1px solid #221111;border-radius:10px;text-align:left;display:inline-block;max-width:400px;">
              <p style="font-size:12px;margin:0;">${errorDescription || 'The neural bridge failed to stabilize.'}</p>
            </div>
            <p style="margin-top:30px;font-size:9px;color:#333;">TRYLIATE NEURAL IDENTITY v1.6.4 • READY FOR PROD</p>
          </body>
        </html>`,
        {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        }
      );
    }

    console.log('✅ [Neural Handshake] Success');
    return new Response(
      `<html>
        <head><title>Neural Online</title></head>
        <body style="background:#000;color:#0f0;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
          <div style="text-align:center;border:1px solid rgba(0,255,0,0.2);padding:40px;border-radius:20px;">
            <h1 style="letter-spacing:0.3em;margin:0;">NEURAL KERNEL ONLINE</h1>
            <p style="font-size:9px;color:#050;margin-top:15px;text-transform:uppercase;font-weight:900;">Identity Synchronized</p>
          </div>
        </body>
      </html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  } catch (e: any) {
    console.error('❌ [Neural Handshake] FATAL ERROR:', e.message);
    return new Response(
      `<html><body style="background:#000;color:red;padding:50px;font-family:monospace;">
        <h1>BRIDGE_CRASH</h1>
        <pre>${e.message}</pre>
        <p>This usually happens if the URL constructor fails or environment variables are missing.</p>
      </body></html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}
