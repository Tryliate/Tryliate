export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(JSON.stringify({
    success: true,
    message: "Neural Core Standby: Pulse detected via GET.",
    mode: "Diagnostics"
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(req: Request) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      // Ignore parse errors for diagnostics
    }

    const { canvasJson, userId } = (body as any);

    return new Response(JSON.stringify({
      success: true,
      message: "Neural Core Standby: Test sequence initialized.",
      note: "Standard engine currently in reconfiguration. Operating in Emulation Mode.",
      details: {
        nodeCount: canvasJson?.nodes?.length || 0,
        edgeCount: canvasJson?.edges?.length || 0
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Unknown error"
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
