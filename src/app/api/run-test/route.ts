import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Neural Core Standby: Pulse detected via GET.",
    mode: "Diagnostics"
  });
}

export async function POST(req: Request) {
  try {
    console.log("🧪 [Neural Engine] Test run requested via POST");

    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.warn("⚠️ [Neural Engine] Empty or invalid JSON body received");
      body = {};
    }

    const { canvasJson, userId } = body;
    console.log("🧪 [Neural Engine] Target User:", userId || "Anonymous");

    return NextResponse.json({
      success: true,
      message: "Neural Core Standby: Test sequence initialized.",
      note: "Standard engine currently in reconfiguration. Operating in Emulation Mode.",
      details: {
        nodeCount: canvasJson?.nodes?.length || 0,
        edgeCount: canvasJson?.edges?.length || 0
      }
    });
  } catch (error: any) {
    console.error("❌ [Neural Engine] Error triggering test:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

