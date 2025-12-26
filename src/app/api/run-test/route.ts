import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { canvasJson, userId } = body;

    console.log("🧪 [Neural Engine] Test run requested for user:", userId);

    // Simulate engine validation
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
    console.error("Error triggering test:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
