/**
 * Tryliate OAuth Proxy Integration (Supports Cloud & Self-Hosted)
 * 
 * Uses an OAuth proxy to access 500+ pre-built integrations.
 * Supports both Cloud (via Secret Key) and Self-Hosted (via Server URL).
 * 
 * The Proxy handles:
 * - OAuth flows for 500+ APIs
 * - Token refresh
 * - Rate limiting
 * - Webhooks
 */

import { Nango } from '@nangohq/node';

// Initialize Proxy client (Nango compatibility layer)
const proxySecretKey = process.env.TRYLIATE_PROXY_SECRET_KEY || process.env.NANGO_SECRET_KEY;
const proxyServerUrl = process.env.TRYLIATE_PROXY_SERVER_URL || process.env.NANGO_SERVER_URL; // e.g. http://localhost:3003

if (!proxySecretKey) {
  console.warn('⚠️ OAuth Proxy secret key not found. Proxy features will be disabled.');
}

// Initialize with optional host for self-hosted
export const oauthProxy = proxySecretKey ? new Nango({
  secretKey: proxySecretKey,
  host: proxyServerUrl // Optional: for self-hosted instances
}) : null;

/**
 * Get OAuth authorization URL via Proxy
 * Works for 500+ providers without needing individual client IDs!
 */
export async function getOAuthProxyUrl(
  providerConfigKey: string,
  connectionId: string,
  redirectUri?: string
): Promise<string> {
  if (!oauthProxy) {
    throw new Error('OAuth Proxy is not initialized. Please add TRYLIATE_PROXY_SECRET_KEY to .env');
  }

  try {
    // Construct the connect URL manually to be safe across SDK versions
    const serverUrl = (oauthProxy as any)?.host || 'https://api.nango.dev';
    const callbackUrl = redirectUri || `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/oauth-flow/callback`;

    return `${serverUrl}/oauth/connect/${providerConfigKey}?connection_id=${connectionId}&redirect_uri=${encodeURIComponent(callbackUrl)}`;
  } catch (error: any) {
    console.error(`Failed to get OAuth Proxy auth URL for ${providerConfigKey}:`, error);
    throw error;
  }
}

/**
 * Exchange OAuth code for token using Proxy
 */
export async function proxyExchangeCode(
  providerConfigKey: string,
  connectionId: string,
  code: string
): Promise<any> {
  // For now, we will just return success. 
  // The connection should have been established by Proxy callback.
  return { success: true };
}

/**
 * Make authenticated API call using OAuth Proxy
 * Proxy handles authentication, rate limiting, and retries
 */
export async function proxyOAuthRequest(
  providerConfigKey: string,
  connectionId: string,
  options: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    endpoint: string;
    data?: any;
    params?: Record<string, string>;
    headers?: Record<string, string>;
  }
): Promise<any> {
  if (!oauthProxy) {
    throw new Error('OAuth Proxy is not initialized.');
  }

  try {
    // Using object signature which is correct for v0.69+
    const response = await oauthProxy.proxy({
      providerConfigKey,
      connectionId,
      method: options.method,
      endpoint: options.endpoint,
      params: options.params,
      data: options.data,
      headers: options.headers,
    });

    return response.data;
  } catch (error: any) {
    console.error(`OAuth proxy request failed for ${providerConfigKey}:`, error);
    throw error;
  }
}

/**
 * Get connection details from Proxy
 */
export async function getProxyConnection(
  providerConfigKey: string,
  connectionId: string
): Promise<any> {
  if (!oauthProxy) {
    throw new Error('OAuth Proxy is not initialized.');
  }

  try {
    const connection = await oauthProxy.getConnection(
      providerConfigKey,
      connectionId
    );
    return connection;
  } catch (error: any) {
    console.error(`Failed to get Proxy connection for ${providerConfigKey}:`, error);
    return null;
  }
}

/**
 * Delete Proxy connection
 */
export async function deleteProxyConnection(
  providerConfigKey: string,
  connectionId: string
): Promise<void> {
  if (!oauthProxy) {
    throw new Error('OAuth Proxy is not initialized.');
  }

  try {
    await oauthProxy.deleteConnection(
      providerConfigKey,
      connectionId
    );
  } catch (error: any) {
    console.error(`Failed to delete Proxy connection for ${providerConfigKey}:`, error);
    throw error;
  }
}

/**
 * List all Proxy connections for a user
 */
export async function listProxyConnections(connectionId: string): Promise<any[]> {
  if (!oauthProxy) {
    throw new Error('OAuth Proxy is not initialized.');
  }

  try {
    const result = await oauthProxy.listConnections();

    // Check various possible return shapes
    let connections: any[] = [];
    if (result && Array.isArray(result)) {
      connections = result;
    } else if (result && (result as any).connections) {
      connections = (result as any).connections;
    }

    // Filter by connectionId if necessary
    return connections.filter((c: any) => c.connection_id === connectionId);
  } catch (error: any) {
    console.error('Failed to list Proxy connections:', error);
    return [];
  }
}

/**
 * Check if OAuth Proxy is available
 */
export function isOAuthProxyAvailable(): boolean {
  return oauthProxy !== null;
}

/**
 * Proxy supported providers (500+)
 */
export const PROXY_SUPPORTED_PROVIDERS = [
  'slack', 'github', 'google', 'notion', 'asana', 'trello', 'jira',
  'hubspot', 'salesforce', 'shopify', 'stripe', 'twitter', 'linkedin',
  'facebook', 'instagram', 'youtube', 'gmail', 'google-drive', 'google-calendar',
  'google-sheets', 'dropbox', 'box', 'onedrive', 'zoom', 'discord',
  'twilio', 'sendgrid', 'mailchimp', 'intercom', 'zendesk', 'freshdesk',
  'pipedrive', 'airtable', 'monday', 'clickup', 'basecamp', 'figma',
  'gitlab', 'bitbucket', 'linear', 'notion', 'miro', 'canva',
];
