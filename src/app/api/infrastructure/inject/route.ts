import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const CLOUD_RUN_URL = process.env.NEXT_PUBLIC_ENGINE_URL || process.env.NEXT_PUBLIC_CLOUD_RUN_URL || 'https://tryliate-backend-374665986758.us-east1.run.app';

export async function POST(request: Request) {
  let debugLog: string[] = [];
  try {
    const body = await request.json();
    const { userId } = body;
    const authHeader = request.headers.get('Authorization');

    if (!userId) {
      return NextResponse.json({ error: 'Identity required.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const secretKey = process.env.SUPABASE_SECRET_KEY;
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

    let platformSupabase;
    if (secretKey) {
      platformSupabase = createClient(supabaseUrl, secretKey);
    } else {
      if (!authHeader) {
        return NextResponse.json({ error: 'Missing Neural Token for RLS.' }, { status: 401 });
      }
      const token = authHeader.replace('Bearer ', '');
      platformSupabase = createClient(supabaseUrl, publishableKey, {
        global: { headers: { Authorization: `Bearer ${token}` } }
      });
    }

    const { data: user, error: fetchError } = await platformSupabase
      .from('users')
      .select('supabase_project_id, supabase_secret_key, supabase_access_token, supabase_db_pass')
      .eq('id', userId)
      .single();

    if (fetchError || !user?.supabase_project_id) {
      return NextResponse.json({ error: 'Failed to fetch infrastructure links.' }, { status: 404 });
    }

    const decodeSafe = (val: string) => {
      if (!val) return '';
      try {
        // Only decode if it's not a standard Supabase prefix and looks like base64
        if (!val.startsWith('sbp_') && !val.startsWith('sb_') && !val.startsWith('eyJ')) {
          return Buffer.from(val, 'base64').toString('utf-8');
        }
        return val;
      } catch (e) {
        return val;
      }
    };

    const projectId = decodeSafe(user.supabase_project_id);
    const dbPass = user.supabase_db_pass ? decodeSafe(user.supabase_db_pass) : null;
    const accessToken = user.supabase_access_token ? decodeSafe(user.supabase_access_token) : '';

    if (dbPass && accessToken) {
      const response = await fetch(`${CLOUD_RUN_URL}/api/infrastructure/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, accessToken, dbPass })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Sync Engine Error: ${errText}`);
      }

      await platformSupabase.from('users').update({ tryliate_initialized: true }).eq('id', userId);
      return NextResponse.json({ success: true, method: 'cloud_run_sync' });
    }

    return NextResponse.json({ error: 'Trymate requires DB Password for synchronization.' }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json({ error: `Critical Failure: ${err.message}` }, { status: 500 });
  }
}
