// @ts-nocheck
/**
 * AI-Powered Tool Discovery using Crawl4AI
 * 
 * TrymateAI uses this to automatically discover OAuth configurations
 * and API endpoints for ANY tool by crawling their documentation.
 * 
 * This enables TRULY UNLIMITED tool support - no hardcoding needed!
 */

import { executeIntegrationTool } from '@/lib/(frontend)/platform/trymate/ai/core/executor';

export interface ToolDiscoveryResult {
  success: boolean;
  provider: string;
  config?: {
    oauthAuthUrl: string;
    oauthTokenUrl: string;
    baseUrl: string;
    scopes?: string[];
    documentation?: string;
  };
  error?: string;
}

/**
 * Discover tool configuration by crawling documentation
 * TrymateAI calls this when user wants to connect a new tool
 * 
 * Example: User says "Connect to Asana"
 * 1. TrymateAI calls discoverToolConfig('asana')
 * 2. Crawls https://developers.asana.com/docs/oauth
 * 3. Extracts OAuth URLs, scopes, API base URL
 * 4. Returns config for addProviderConfig()
 */
export async function discoverToolConfig(
  toolName: string,
  userId: string
): Promise<ToolDiscoveryResult> {
  try {
    console.log(`ðŸ” TrymateAI discovering config for: ${toolName}`);

    // Step 1: Determine documentation URL
    const docUrl = getDocumentationUrl(toolName);

    if (!docUrl) {
      return {
        success: false,
        provider: toolName,
        error: `Could not determine documentation URL for ${toolName}. Please provide the OAuth documentation URL.`,
      };
    }

    console.log(`ðŸ“„ Crawling documentation: ${docUrl}`);

    // Step 2: Use Crawl4AI to fetch documentation
    const crawlResult = await executeIntegrationTool('crawl_web_page', { url: docUrl }, userId) as any;

    if (crawlResult.error) {
      return {
        success: false,
        provider: toolName,
        error: `Failed to crawl documentation: ${crawlResult.error}`,
      };
    }

    const documentation = crawlResult.result as string;

    // Step 3: Extract OAuth configuration using AI
    // TrymateAI will parse the markdown and extract:
    // - OAuth authorization URL
    // - OAuth token URL
    // - API base URL
    // - Required scopes
    const config = await extractOAuthConfig(documentation, toolName);

    if (!config) {
      return {
        success: false,
        provider: toolName,
        error: 'Could not extract OAuth configuration from documentation. Please provide OAuth details manually.',
      };
    }

    console.log(`âœ… TrymateAI discovered config for ${toolName}:`, config);

    return {
      success: true,
      provider: toolName,
      config: {
        ...config,
        documentation: docUrl,
      },
    };

  } catch (error: any) {
    console.error(`Failed to discover tool config for ${toolName}:`, error);
    return {
      success: false,
      provider: toolName,
      error: error.message || 'Unknown error during discovery',
    };
  }
}

/**
 * Get documentation URL for common providers
 * TrymateAI can also search for this dynamically
 */
function getDocumentationUrl(toolName: string): string | null {
  const docUrls: Record<string, string> = {
    // Common providers (TrymateAI can discover more)
    'slack': 'https://api.slack.com/authentication/oauth-v2',
    'github': 'https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps',
    'notion': 'https://developers.notion.com/docs/authorization',
    'asana': 'https://developers.asana.com/docs/oauth',
    'trello': 'https://developer.atlassian.com/cloud/trello/guides/rest-api/authorization/',
    'discord': 'https://discord.com/developers/docs/topics/oauth2',
    'twitter': 'https://developer.twitter.com/en/docs/authentication/oauth-2-0',
    'linkedin': 'https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication',
    'google': 'https://developers.google.com/identity/protocols/oauth2',
    'hubspot': 'https://developers.hubspot.com/docs/api/oauth-quickstart-guide',
    'salesforce': 'https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_web_server_flow.htm',
    'shopify': 'https://shopify.dev/docs/apps/auth/oauth',
    'stripe': 'https://stripe.com/docs/connect/oauth-reference',
    'airtable': 'https://airtable.com/developers/web/api/oauth-reference',
    'figma': 'https://www.figma.com/developers/api#oauth2',
    'dropbox': 'https://www.dropbox.com/developers/documentation/http/documentation#oauth2-authorize',
    'zoom': 'https://developers.zoom.us/docs/integrations/oauth/',
    'mailchimp': 'https://mailchimp.com/developer/marketing/guides/access-user-data-oauth-2/',
  };

  const url = docUrls[toolName.toLowerCase()];

  if (url) {
    return url;
  }

  // TrymateAI can search for documentation URL
  // Example: Google search for "{toolName} oauth documentation"
  console.warn(`âš ï¸ No predefined doc URL for ${toolName}. TrymateAI should search for it.`);
  return null;
}

/**
 * Extract OAuth configuration from documentation markdown
 * TrymateAI uses LLM to parse the documentation and extract config
 * 
 * This is where the AI magic happens - no manual parsing needed!
 */
async function extractOAuthConfig(
  documentation: string,
  toolName: string
): Promise<{
  oauthAuthUrl: string;
  oauthTokenUrl: string;
  baseUrl: string;
  scopes?: string[];
} | null> {
  // TODO: Integrate with TrymateAI LLM to extract config
  // For now, return null so TrymateAI knows to handle it

  // TrymateAI will use a prompt like:
  // "Extract OAuth configuration from this documentation:
  //  - OAuth authorization URL
  //  - OAuth token URL  
  //  - API base URL
  //  - Common scopes
  //  Return as JSON"

  console.log(`ðŸ¤– TrymateAI should extract OAuth config from documentation for ${toolName}`);

  // Placeholder - TrymateAI will implement this
  return null;
}

/**
 * Search for tool documentation URL using web search
 * TrymateAI can call this if getDocumentationUrl returns null
 */
export async function searchToolDocumentation(
  toolName: string,
  userId: string
): Promise<string | null> {
  try {
    // TrymateAI can use web search or crawl the tool's main website
    const searchQuery = `${toolName} oauth api documentation`;

    console.log(`ðŸ”Ž TrymateAI searching for: ${searchQuery}`);

    // TODO: Integrate with web search API or use Crawl4AI to find docs
    // For now, return null so TrymateAI handles it

    return null;
  } catch (error) {
    console.error(`Failed to search for ${toolName} documentation:`, error);
    return null;
  }
}

/**
 * Validate discovered OAuth configuration
 * TrymateAI calls this before saving to ensure config is valid
 */
export function validateOAuthConfig(config: any): boolean {
  const required = ['oauthAuthUrl', 'oauthTokenUrl', 'baseUrl'];

  for (const field of required) {
    if (!config[field] || typeof config[field] !== 'string') {
      console.error(`âŒ Invalid OAuth config: missing or invalid ${field}`);
      return false;
    }

    // Validate URLs
    try {
      new URL(config[field]);
    } catch {
      console.error(`âŒ Invalid URL for ${field}: ${config[field]}`);
      return false;
    }
  }

  return true;
}


