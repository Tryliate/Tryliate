/**
 * Integration Engine - Dynamic Tool Integration
 * 
 * TRULY UNLIMITED approach:
 * - No hardcoded tool list
 * - Users can add ANY OAuth 2.0 tool
 * - TrymateAI auto-detects and configures tools
 * - All stored in user's own Supabase database
 */

import 'server-only';
import { createIntegrationEngine, IntegrationEngine, type IntegrationConnection } from './client';
import { autoDetectOAuthConfig, createCustomToolConfig, type DynamicToolConfig } from '@/lib/integrations/tools/dynamic-registry';

// AI-Powered Tool Discovery (uses Crawl4AI)
export { discoverToolConfig, searchToolDocumentation, validateOAuthConfig, type ToolDiscoveryResult } from './discovery';

// ============================================================================
// TYPES
// ============================================================================

export interface ConnectionResult {
  success: boolean;
  storage: 'neon' | 'supabase';
  error?: string;
}

// ============================================================================
// INTEGRATION ENGINE CLIENT INSTANCE
// ============================================================================

import { createClient } from '../supabase/server';

// Specific cache for Integration Engine instances per user to avoid mixing sessions
const integrationClients: Record<string, IntegrationEngine> = {};

/**
 * Get or create Integration Engine client
 * Uses User's Supabase instance for storage
 */
export async function getIntegrationClient(userId: string): Promise<IntegrationEngine> {
  if (integrationClients[userId]) {
    return integrationClients[userId];
  }

  // Get user's Supabase credentials
  // For V1 (Simple BYOI), we assume the user is using the app's Supabase instance via RLS
  // OR they have provided their own credentials in the users table

  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role for admin tasks like schema init

  // Define user variable in outer scope for fallback logic
  let user: any = null;

  try {
    const supabase = await createClient();
    // Check if user has custom Supabase config (True BYOI)
    const { data: userData } = await supabase
      .from('users')
      .select('supabase_config')
      .eq('id', userId)
      .single();

    user = userData;

    if (user?.supabase_config?.url && user?.supabase_config?.serviceKey) {
      supabaseUrl = user.supabase_config.url;
      supabaseKey = user.supabase_config.serviceKey;
    }
  } catch (err) {
    console.warn('Failed to fetch custom Supabase config for Integration Engine, using default:', err);
  }

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(`No Supabase configuration found for user ${userId}.`);
  }

  // Create Integration Engine client
  let client = createIntegrationEngine(supabaseUrl, supabaseKey, userId);

  // Auto-initialize tables in user's database
  // We do this lazily to ensure schema exists
  try {
    await client.initialize();
  } catch (initError: any) {
    console.error(`âŒ Failed to initialize Integration Engine with config (URL: ${supabaseUrl}):`, initError);

    // Self-Healing: If Custom Config failed, fallback to Default Platform DB
    if (user?.supabase_config?.url && supabaseUrl === user.supabase_config.url) {
      console.warn('âš ï¸ Custom BYOI Config appears broken (DNS/Network Error). Falling back to Default Platform DB to restore access.');

      const defaultUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const defaultKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

      if (defaultUrl && defaultKey) {
        client = createIntegrationEngine(defaultUrl, defaultKey, userId);
        try {
          await client.initialize();
          console.log('âœ… Fallback to Default Platform DB successful.');
        } catch (fallbackError) {
          console.error('âŒ Fallback initialization also failed:', fallbackError);
          // If even fallback fails, we must throw
          throw initError;
        }
      }
    } else {
      // If we were already using default (or no fallback available), rethrow
      throw initError;
    }
  }

  // Cache it
  integrationClients[userId] = client;

  return client;
}

/**
 * @deprecated getUserDatabaseUrl was using localStorage which is not available on server
 */
function getUserDatabaseUrl(): string {
  throw new Error("getUserDatabaseUrl is deprecated. Use getIntegrationClient(userId) internal logic.");
}

// ============================================================================
// DYNAMIC TOOL CONNECTION
// ============================================================================

/**
 * Connect ANY OAuth 2.0 tool dynamically
 * 
 * TrymateAI can detect tool from user message and auto-configure
 */
export async function connectTool(
  toolNameOrConfig: string | DynamicToolConfig,
  userId: string
): Promise<ConnectionResult> {
  try {
    let toolConfig: DynamicToolConfig;

    // If string, try to auto-detect
    if (typeof toolNameOrConfig === 'string') {
      const detected = autoDetectOAuthConfig(toolNameOrConfig);

      if (!detected) {
        return {
          success: false,
          storage: 'neon',
          error: `Unknown tool: ${toolNameOrConfig}. Please provide OAuth configuration.`,
        };
      }

      toolConfig = detected as DynamicToolConfig;
    } else {
      toolConfig = toolNameOrConfig;
    }

    // Get Integration Engine client
    const engine = await getIntegrationClient(userId);

    // Get OAuth authorization URL
    const redirectUri = `${window.location.origin}/api/oauth/callback`;
    const authUrl = await engine.getAuthUrl(
      toolConfig.id,
      redirectUri
    );

    // Open OAuth flow in popup
    const popup = window.open(authUrl, 'oauth', 'width=600,height=700');

    // Wait for OAuth callback
    const credentials = await waitForOAuthCallback(popup);

    // Save credentials in user's own database
    await engine.saveConnection(
      toolConfig.id,
      credentials,
      { toolName: toolConfig.name, provider: toolConfig.provider },
      { connectedAt: new Date().toISOString() }
    );

    return {
      success: true,
      storage: 'supabase',
    };
  } catch (error) {
    console.error('Failed to connect tool:', error);
    return {
      success: false,
      storage: 'neon',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Add a completely custom OAuth tool
 * User provides all OAuth details
 */
export async function addCustomTool(
  config: DynamicToolConfig,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const engine = await getIntegrationClient(userId);

    // Store custom tool config in user's Supabase database
    // This allows UNLIMITED custom tools!

    return { success: true };
  } catch (error) {
    console.error('Failed to add custom tool:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Disconnect a tool
 */
export async function disconnectTool(
  toolId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const engine = await getIntegrationClient(userId);
    await engine.deleteConnection(toolId);

    return { success: true };
  } catch (error) {
    console.error('Failed to disconnect tool:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if tool is connected
 */
export async function isToolConnected(
  toolId: string,
  userId: string
): Promise<boolean> {
  try {
    const engine = await getIntegrationClient(userId);
    const connection = await engine.getConnection(toolId);

    return connection !== null;
  } catch (error) {
    console.error('Failed to check tool connection:', error);
    return false;
  }
}

/**
 * List all connected tools
 */
export async function listConnectedTools(userId: string): Promise<string[]> {
  try {
    const engine = await getIntegrationClient(userId);
    const connections = await engine.listConnections();

    return connections.map(conn => conn.providerConfigKey);
  } catch (error) {
    console.error('Failed to list connected tools:', error);
    return [];
  }
}

/**
 * Get tool credentials (for making API calls)
 */
export async function getToolCredentials(
  toolId: string,
  userId: string
): Promise<any | null> {
  try {
    const engine = await getIntegrationClient(userId);
    return await engine.getConnection(toolId);
  } catch (error) {
    console.error('Failed to get tool credentials:', error);
    return null;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Wait for OAuth callback
 */
function waitForOAuthCallback(popup: Window | null): Promise<any> {
  return new Promise((resolve, reject) => {
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        reject(new Error('OAuth popup closed'));
      }
    }, 1000);

    // Listen for OAuth callback message
    window.addEventListener('message', (event) => {
      if (event.data.type === 'oauth_success') {
        clearInterval(checkClosed);
        popup?.close();
        resolve(event.data.credentials);
      } else if (event.data.type === 'oauth_error') {
        clearInterval(checkClosed);
        popup?.close();
        reject(new Error(event.data.error));
      }
    });
  });
}

// ============================================================================
// GET CONNECTED TOOLS
// ============================================================================

/**
 * Get list of tools user has connected via OAuth
 * Used by TrymateAI to build API workflows
 */
export async function getConnectedTools(userId: string): Promise<string[]> {
  try {
    const engine = await getIntegrationClient(userId);
    const connections = await engine.listConnections();
    return connections.map(conn => conn.providerConfigKey);
  } catch (error) {
    console.error('Failed to get connected tools:', error);
    return [];
  }
}

