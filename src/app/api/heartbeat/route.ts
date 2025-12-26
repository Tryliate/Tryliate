export const dynamic = 'force-dynamic';

export async function GET() {
  const status = {
    service: 'tryliate-neural-heartbeat',
    timestamp: new Date().toISOString(),
    status: 'operational',
    version: '1.4.7',
    checks: {
      proxy: 'active',
      routing: 'stable',
      security_headers: 'enforced'
    }
  };

  return new Response(JSON.stringify(status), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}
