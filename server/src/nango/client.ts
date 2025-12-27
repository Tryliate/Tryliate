/**
 * Integration Engine Client
 * 
 * Implements OAuth functionality directly in user's own Supabase database
 * No external services required - 100% self-hosted
 * 
 * Features:
 * - Auto-deploys OAuth schema in user's Supabase DB
 * - Stores all OAuth credentials in user's database
 * - Supports UNLIMITED tool connections
 * - Zero cost (uses Supabase free tier)
 * 
 * Why Supabase?
 * - âœ… Already have Supabase OAuth credentials
 * - âœ… No client_id needed (Neon requires partnership)
 * - âœ… Simpler architecture (1 DB instead of 2)
 * - âœ… Lower user cost ($0-45 vs $0-64)
 * - âœ… Works immediately - no waiting for partnerships
 */

import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { encryptCredentials, decryptCredentials } from '../../lib/security/encryption';
import { SCHEMA_SQL } from './schema-const';

// ============================================================================
// TYPES
// ============================================================================

export interface IntegrationConnection {
  id: string;
  userId: string;
  providerConfigKey: string;
  connectionId: string;
  credentials: OAuthCredentials;
  connectionConfig?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface OAuthCredentials {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
  [key: string]: any;
}

export interface ProviderConfig {
  providerConfigKey: string;
  provider: string;
  oauthClientId: string;
  oauthClientSecret: string;
  oauthScopes?: string[];
  oauthAuthUrl?: string;
  oauthTokenUrl?: string;
  oauthRedirectUri?: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// INTEGRATION ENGINE CLIENT
// ============================================================================

export class IntegrationEngine {
  private supabaseUrl: string;
  private supabaseKey: string;
  private userId: string;
  private client: any;
  private isInitialized: boolean = false;

  constructor(supabaseUrl: string, supabaseKey: string, userId: string) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    this.userId = userId;
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Initialize Integration Engine in user's Supabase database
   * Auto-creates all required tables
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Read Integration Engine schema SQL (Inlined for Cloud Run compatibility)
      const schemaSql = SCHEMA_SQL;

      // Execute schema using Supabase Management API or direct SQL
      // For simplicity, we'll use RPC function if available, or direct query
      // Note: This requires the user's Supabase to have appropriate permissions

      // Split schema into individual statements
      const statements = schemaSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      // Execute each statement
      for (const statement of statements) {
        const { error } = await this.client.rpc('exec_sql', {
          sql: statement
        });

        if (error) {
          // If exec_sql RPC doesn't exist, try direct query
          // This is a fallback - ideally user should have exec_sql function
          if (error.code === 'PGRST202') {
            console.warn('âš ï¸ exec_sql RPC not found (using Direct Connection fallback)');
          } else {
            console.error('Failed to execute statement:', error);
          }
        }
      }

      this.isInitialized = true;
      console.log('âœ… Integration Engine initialized in user Supabase database');
    } catch (error) {
      console.error('âŒ Failed to initialize Integration Engine:', error);
      throw new Error('Failed to initialize Integration Engine in user Supabase database');
    }
  }

  /**
   * Execute arbitrary SQL in the user's database
   * Primary use: Bootstrapping and Schema Migration
   */
  async executeSql(sql: string): Promise<void> {
    // Split statements and execute individually
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      const { error } = await this.client.rpc('exec_sql', {
        sql: statement
      });

      if (error) {
        if (error.code === 'PGRST202') {
          console.warn('âš ï¸ exec_sql RPC not found (using Direct Connection fallback)');
        } else {
          console.error('Failed to execute statement:', error);
          throw error;
        }
      }
    }
  }

  /**
   * Get OAuth authorization URL
   * Uses Nango templates if provider config doesn't exist in database
   */
  async getAuthUrl(
    providerConfigKey: string,
    redirectUri: string,
    state?: string
  ): Promise<string> {
    let config = await this.getProviderConfig(providerConfigKey);

    // If no config in database, try Nango template
    if (!config) {
      const { getProviderTemplate } = await import('./nango-templates');
      const template = getProviderTemplate(providerConfigKey);

      if (!template || !template.authorization_url) {
        throw new Error(`Provider config not found and no Nango template available for: ${providerConfigKey}`);
      }

      // Use Nango template with user-provided client ID
      // Client ID should be in environment variable
      const clientIdEnvVar = `${providerConfigKey.toUpperCase().replace(/-/g, '_')}_CLIENT_ID`;
      const clientId = process.env[clientIdEnvVar];

      if (!clientId) {
        throw new Error(`OAuth client ID not configured. Please add ${clientIdEnvVar} to environment variables or configure provider in database.`);
      }

      // Build auth URL from Nango template
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: template.default_scopes?.join(template.scope_separator || ' ') || '',
        state: state || this.generateState(),
        ...template.authorization_params,
      });

      return `${template.authorization_url}?${params.toString()}`;
    }

    // Use database config
    const params = new URLSearchParams({
      client_id: config.oauthClientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: config.oauthScopes?.join(' ') || '',
      state: state || this.generateState(),
    });


    return `${config.oauthAuthUrl}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   * Uses Nango templates if provider config doesn't exist in database
   */
  async exchangeCodeForToken(
    providerConfigKey: string,
    code: string,
    redirectUri: string
  ): Promise<OAuthCredentials> {
    let config = await this.getProviderConfig(providerConfigKey);

    // If no config in database, try Nango template
    if (!config) {
      const { getProviderTemplate } = await import('./nango-templates');
      const template = getProviderTemplate(providerConfigKey);

      if (!template || !template.token_url) {
        throw new Error(`Provider config not found and no Nango template available for: ${providerConfigKey}`);
      }

      // Use Nango template with user-provided credentials
      const clientIdEnvVar = `${providerConfigKey.toUpperCase().replace(/-/g, '_')}_CLIENT_ID`;
      const clientSecretEnvVar = `${providerConfigKey.toUpperCase().replace(/-/g, '_')}_CLIENT_SECRET`;

      const clientId = process.env[clientIdEnvVar];
      const clientSecret = process.env[clientSecretEnvVar];

      if (!clientId || !clientSecret) {
        throw new Error(`OAuth credentials not configured. Please add ${clientIdEnvVar} and ${clientSecretEnvVar} to environment variables.`);
      }

      const response = await fetch(template.token_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
          ...template.token_params,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.statusText}`);
      }

      return await response.json();
    }

    // Use database config
    const response = await fetch(config.oauthTokenUrl!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: config.oauthClientId,
        client_secret: config.oauthClientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Save OAuth connection
   */
  async saveConnection(
    providerConfigKey: string,
    credentials: OAuthCredentials,
    connectionConfig?: Record<string, any>,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.ensureInitialized();

    try {
      // Encrypt credentials
      const encryptedCredentials = encryptCredentials(
        credentials,
        this.userId
      );

      // Calculate expiration
      const expiresAt = credentials.expires_in
        ? new Date(Date.now() + credentials.expires_in * 1000).toISOString()
        : null;

      // Use Supabase client to insert/update
      const { error } = await this.client
        .from('tryliate_connections')
        .upsert({
          user_id: this.userId,
          provider_config_key: providerConfigKey,
          connection_id: `${this.userId}-${providerConfigKey}`,
          credentials: encryptedCredentials,
          connection_config: connectionConfig || {},
          metadata: metadata || {},
          expires_at: expiresAt,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,provider_config_key,connection_id'
        });

      if (error) {
        throw error;
      }

      console.log(`âœ… Connection saved: ${providerConfigKey}`);
    } catch (error) {
      console.error('Failed to save connection:', error);
      throw error;
    }
  }

  /**
   * Get OAuth connection
   */
  async getConnection(providerConfigKey: string): Promise<OAuthCredentials | null> {
    await this.ensureInitialized();

    try {
      const { data, error } = await this.client
        .from('tryliate_connections')
        .select('credentials')
        .eq('user_id', this.userId)
        .eq('provider_config_key', providerConfigKey)
        .single();

      if (error || !data) {
        return null;
      }

      // Decrypt credentials
      const decrypted = decryptCredentials(data.credentials, this.userId);
      return decrypted;
    } catch (error) {
      console.error('Failed to get connection:', error);
      throw error;
    }
  }

  /**
   * Delete OAuth connection
   */
  async deleteConnection(providerConfigKey: string): Promise<void> {
    await this.ensureInitialized();

    try {
      const { error } = await this.client
        .from('tryliate_connections')
        .delete()
        .eq('user_id', this.userId)
        .eq('provider_config_key', providerConfigKey);

      if (error) {
        throw error;
      }

      console.log(`âœ… Connection deleted: ${providerConfigKey}`);
    } catch (error) {
      console.error('Failed to delete connection:', error);
      throw error;
    }
  }

  /**
   * List all connections for user
   */
  async listConnections(): Promise<IntegrationConnection[]> {
    await this.ensureInitialized();

    try {
      const { data, error } = await this.client
        .from('tryliate_connections')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (!data) {
        return [];
      }

      return data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        providerConfigKey: row.provider_config_key,
        connectionId: row.connection_id,
        credentials: decryptCredentials(row.credentials, this.userId),
        connectionConfig: row.connection_config,
        metadata: row.metadata,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        expiresAt: row.expires_at ? new Date(row.expires_at) : undefined,
      }));
    } catch (error) {
      console.error('Failed to list connections:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(providerConfigKey: string): Promise<OAuthCredentials> {
    const connection = await this.getConnection(providerConfigKey);

    if (!connection || !connection.refresh_token) {
      throw new Error('No refresh token available');
    }

    const config = await this.getProviderConfig(providerConfigKey);

    if (!config) {
      throw new Error(`Provider config not found: ${providerConfigKey}`);
    }

    const response = await fetch(config.oauthTokenUrl!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: connection.refresh_token,
        client_id: config.oauthClientId,
        client_secret: config.oauthClientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const newCredentials = await response.json();

    // Save refreshed credentials
    await this.saveConnection(providerConfigKey, newCredentials);

    return newCredentials;
  }

  /**
   * Make authenticated API request to provider (Proxy)
   * This is the core method that enables tool-to-tool workflows
   */
  async proxy(options: {
    providerConfigKey: string;
    connectionId: string;
    method: string;
    endpoint: string;
    data?: any;
    params?: any;
    headers?: Record<string, string>;
  }): Promise<{ data: any; status: number; headers?: any }> {
    await this.ensureInitialized();

    try {
      // 1. Get connection credentials
      const credentials = await this.getConnection(options.providerConfigKey);

      if (!credentials) {
        throw new Error(`No connection found for ${options.providerConfigKey}. Please connect this tool first.`);
      }

      // 2. Get provider base URL (now async - fetches from database)
      const baseUrl = await this.getProviderBaseUrl(options.providerConfigKey);

      if (!baseUrl) {
        throw new Error(`Unknown provider: ${options.providerConfigKey}. Please configure this provider first or let TrymateAI discover it.`);
      }

      // 3. Build full URL with query parameters
      const url = new URL(`${baseUrl}${options.endpoint}`);
      if (options.params) {
        Object.entries(options.params).forEach(([key, value]) => {
          url.searchParams.append(key, String(value));
        });
      }

      // 4. Build headers
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // 5. Make authenticated request
      let response = await fetch(url.toString(), {
        method: options.method.toUpperCase(),
        headers,
        body: options.data ? JSON.stringify(options.data) : undefined,
      });

      // 6. Handle token expiration (401) - refresh and retry
      if (response.status === 401 && credentials.refresh_token) {
        console.log(`ðŸ”„ Token expired for ${options.providerConfigKey}, refreshing...`);

        try {
          const newCredentials = await this.refreshToken(options.providerConfigKey);

          // Retry request with new token
          headers['Authorization'] = `Bearer ${newCredentials.access_token}`;
          response = await fetch(url.toString(), {
            method: options.method.toUpperCase(),
            headers,
            body: options.data ? JSON.stringify(options.data) : undefined,
          });
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          throw new Error(`Token refresh failed for ${options.providerConfigKey}. Please reconnect this tool.`);
        }
      }

      // 7. Parse response
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // 8. Return response
      return {
        data,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
      };

    } catch (error) {
      console.error(`Proxy request failed for ${options.providerConfigKey}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  private async getProviderConfig(providerConfigKey: string): Promise<ProviderConfig | null> {
    try {
      const { data, error } = await this.client
        .from('tryliate_configs')
        .select('*')
        .eq('provider_config_key', providerConfigKey)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        providerConfigKey: data.provider_config_key,
        provider: data.provider,
        oauthClientId: data.oauth_client_id,
        oauthClientSecret: data.oauth_client_secret,
        oauthScopes: data.oauth_scopes,
        oauthAuthUrl: data.oauth_auth_url,
        oauthTokenUrl: data.oauth_token_url,
        oauthRedirectUri: data.oauth_redirect_uri,
      };
    } catch (error) {
      console.error('Failed to get provider config:', error);
      throw error;
    }
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Get base API URL for provider
   * AI-DRIVEN: Fetches from database config or uses common fallbacks
   * 
   * TrymateAI Integration:
   * 1. Checks tryliate_configs table for stored base URL in metadata
   * 2. Falls back to common provider patterns if not in database
   * 3. Returns empty string if unknown (TrymateAI will handle discovery)
   */
  private async getProviderBaseUrl(providerConfigKey: string): Promise<string> {
    try {
      // First, try to get from database config
      const config = await this.getProviderConfig(providerConfigKey);

      if (config?.metadata && typeof config.metadata === 'object') {
        const metadata = config.metadata as Record<string, any>;
        if (metadata.baseUrl) {
          return metadata.baseUrl as string;
        }
      }

      // Fallback to common provider patterns (for initial setup)
      // TrymateAI can override these by adding to database
      const commonProviders: Record<string, string> = {
        'slack': 'https://slack.com/api',
        'github': 'https://api.github.com',
        'notion': 'https://api.notion.com/v1',
        'google': 'https://www.googleapis.com',
        'gmail': 'https://gmail.googleapis.com/gmail/v1',
        'discord': 'https://discord.com/api',
        'twitter': 'https://api.twitter.com/2',
      };

      const fallbackUrl = commonProviders[providerConfigKey.toLowerCase()];
      if (fallbackUrl) {
        console.log(`ðŸ“Œ Using fallback URL for ${providerConfigKey}: ${fallbackUrl}`);
        return fallbackUrl;
      }

      // If no config found, TrymateAI will handle discovery
      console.warn(`âš ï¸ No base URL found for ${providerConfigKey}. TrymateAI should discover it.`);
      return '';

    } catch (error) {
      console.error(`Failed to get base URL for ${providerConfigKey}:`, error);
      return '';
    }
  }

  /**
   * Add or update provider configuration
   * Used by TrymateAI to dynamically add new tools on-the-fly
   * 
   * Example: User says "Connect to my Asana account"
   * TrymateAI detects "Asana", looks up OAuth config, and calls this method
   */
  async addProviderConfig(config: {
    providerConfigKey: string;
    provider: string;
    oauthClientId: string;
    oauthClientSecret: string;
    oauthScopes?: string[];
    oauthAuthUrl: string;
    oauthTokenUrl: string;
    baseUrl?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    await this.ensureInitialized();

    try {
      const { error } = await this.client
        .from('tryliate_configs')
        .upsert({
          provider_config_key: config.providerConfigKey,
          provider: config.provider,
          oauth_client_id: config.oauthClientId,
          oauth_client_secret: config.oauthClientSecret,
          oauth_scopes: config.oauthScopes || [],
          oauth_auth_url: config.oauthAuthUrl,
          oauth_token_url: config.oauthTokenUrl,
          metadata: {
            baseUrl: config.baseUrl,
            ...config.metadata,
            addedBy: 'trymateai',
            addedAt: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'provider_config_key'
        });

      if (error) {
        throw error;
      }

      console.log(`âœ… TrymateAI added provider config: ${config.providerConfigKey}`);
    } catch (error) {
      console.error('Failed to add provider config:', error);
      throw error;
    }
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create Integration Engine client instance for Supabase
 */
export function createIntegrationEngine(supabaseUrl: string, supabaseKey: string, userId: string): IntegrationEngine {
  return new IntegrationEngine(supabaseUrl, supabaseKey, userId);
}

/**
 * Auto-setup Integration Engine in user's Supabase database
 */
export async function autoSetupIntegrationEngine(supabaseUrl: string, supabaseKey: string, userId: string): Promise<void> {
  const engine = new IntegrationEngine(supabaseUrl, supabaseKey, userId);
  await engine.initialize();
  console.log('âœ… Integration Engine auto-setup complete in user Supabase database');
}

