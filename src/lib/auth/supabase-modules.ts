import { createClient } from '@supabase/supabase-js';

// --- Types ---
export interface SupabaseTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: any;
}

export interface EnrichedProjectData {
  projectRef: string;
  publishableKey: string;
  secretKey: string;
}

// --- Module 1: Token Exchange ---
export async function exchangeCodeForToken(
  code: string,
  redirectUri: string
): Promise<SupabaseTokenResponse> {
  const CLIENT_ID = process.env.NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID || process.env.SUPABASE_OAUTH_CLIENT_ID;
  const CLIENT_SECRET = process.env.SUPABASE_OAUTH_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Missing Supabase OAuth Credentials (CLIENT_ID or CLIENT_SECRET).');
  }

  console.log(`📡 Exchanging Auth Code with Supabase (ClientId: ${CLIENT_ID.substring(0, 5)}...)...`);

  const response = await fetch('https://api.supabase.com/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${CLIENT_ID.trim()}:${CLIENT_SECRET.trim()}`).toString('base64')}`,
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
    }),
  });

  const responseText = await response.text();
  let data: any;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    console.error('❌ Supabase returned non-JSON response:', responseText);
    throw new Error(`Supabase OAuth error: ${response.status} ${response.statusText}`);
  }

  if (!response.ok || data.error) {
    console.error('❌ Token Exchange Failed:', data);
    throw new Error(data.error_description || data.message || `Token exchange failed with status ${response.status}`);
  }

  return data as SupabaseTokenResponse;
}

// --- Module 2: Project Enrichment ---
export async function enrichUserProjectData(accessToken: string): Promise<EnrichedProjectData> {
  let projectRef = '';
  let publishableKey = '';
  let secretKey = '';

  try {
    console.log('📡 Fetching Supabase Projects for user...');
    const projectsRes = await fetch('https://api.supabase.com/v1/projects', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!projectsRes.ok) {
      throw new Error(`Failed to list projects: ${await projectsRes.text()}`);
    }

    const projects = await projectsRes.json();

    // Find valid project
    const target = projects.find((p: any) => p.status === 'ACTIVE_HEALTHY') || projects[0];

    if (target) {
      projectRef = target.id;
      console.log(`🎯 Identified Target Project: ${target.name} (${projectRef})`);

      console.log(`📡 Fetching API keys for ${projectRef}...`);
      const keysRes = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/api-keys`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (keysRes.ok) {
        const keys = await keysRes.json();
        // Strict mapping: anon -> publishable, service_role -> secret
        publishableKey = keys.find((k: any) => k.name === 'anon' || k.name === 'publishable')?.api_key || '';
        secretKey = keys.find((k: any) => k.name === 'service_role' || k.name === 'secret')?.api_key || '';
      }
    }
  } catch (err: any) {
    console.warn('⚠️ Enrichment warning (non-fatal):', err.message);
  }

  return { projectRef, publishableKey, secretKey };
}

// --- Module 3: Vault Synchronization ---
export async function syncUserToVault(
  userId: string,
  tokenData: SupabaseTokenResponse,
  projectData: EnrichedProjectData
): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  // STRICT CHANGE: Use ONLY SUPABASE_SECRET_KEY
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !secretKey) {
    console.error('❌ Server Config Error: Missing Admin Supabase Credentials (SUPABASE_SECRET_KEY).');
    // We do NOT throw here to avoid blocking login if admin sync fails, 
    // but in a strict system we might want to. For now, we log error.
    return;
  }

  const adminClient = createClient(supabaseUrl, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const { error } = await adminClient.from('users').upsert({
    id: userId,
    supabase_connected: true,
    supabase_access_token: tokenData.access_token,
    supabase_refresh_token: tokenData.refresh_token || null,
    // Project Data
    supabase_project_id: projectData.projectRef || null,
    supabase_publishable_key: projectData.publishableKey || null,
    supabase_secret_key: projectData.secretKey || null,
    // Status
    tryliate_initialized: !!projectData.projectRef,
    updated_at: new Date().toISOString()
  }, { onConflict: 'id' });

  if (error) {
    console.error('❌ Admin Vault Sync Failed:', error);
    throw new Error(`Database Sync Failed: ${error.message}`);
  } else {
    console.log(`✅ User ${userId} successfully synchronized to admin vault.`);
  }
}
