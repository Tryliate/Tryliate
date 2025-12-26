import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CLOUD_RUN_URL = process.env.NEXT_PUBLIC_CLOUD_RUN_URL || 'https://tryliate-backend-374665986758.us-east1.run.app';

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const sendStep = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
        const data = JSON.stringify({ message, type }) + '\n';
        controller.enqueue(encoder.encode(data));
      };

      try {
        const body = await req.json().catch(() => ({}));
        const accessToken = req.cookies.get('trymate_setup_token')?.value || body.accessToken;
        const userId = body.userId || req.nextUrl.searchParams.get('userId');

        if (!accessToken || !userId) {
          sendStep('Missing authentication or identity.', 'error');
          controller.close();
          return;
        }

        console.log(`📡 [Proxy] Provisioning initiated for user: ${userId}`);
        sendStep('🛰️ Trymate: Routing request to Neural Engine (Google Cloud Run)...');

        const response = await fetch(`${CLOUD_RUN_URL}/api/infrastructure/provision`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken, userId })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Neural Engine Error: ${errText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('Failed to read response from Cloud Run');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }

      } catch (error: any) {
        console.error("Provisioning Proxy Error:", error);
        sendStep(`❌ Error: ${error.message || 'Unknown failure'}`, 'error');
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}

export async function GET(req: NextRequest) {
  // Reuse the same logic for GET if needed (e.g. for browser testing)
  // But typically it should be POST.
  return POST(req);
}
