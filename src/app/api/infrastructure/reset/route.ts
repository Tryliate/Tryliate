import { NextRequest, NextResponse } from 'next/server';

const CLOUD_RUN_URL = process.env.NEXT_PUBLIC_ENGINE_URL || process.env.NEXT_PUBLIC_CLOUD_RUN_URL || 'https://tryliate-backend-374665986758.us-east1.run.app';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    const response = await fetch(`${CLOUD_RUN_URL}/api/infrastructure/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloud Run Reset failed: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('API Route Reset Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
