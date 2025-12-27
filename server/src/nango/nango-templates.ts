/**
 * Nango Provider Templates (Open Source)
 * 
 * Pre-configured OAuth settings for 250+ providers
 * Source: https://github.com/NangoHQ/nango/tree/master/packages/shared/providers
 * 
 * This gives us OAuth URLs, scopes, and auth types for popular tools
 * WITHOUT needing Nango Cloud service (pure BYOI)
 */

export interface NangoProviderTemplate {
  auth_mode: 'OAUTH2' | 'OAUTH1' | 'API_KEY' | 'BASIC';
  authorization_url?: string;
  token_url?: string;
  scope_separator?: string;
  default_scopes?: string[];
  token_params?: Record<string, string>;
  authorization_params?: Record<string, string>;
  docs?: string;
  categories?: string[];
}

/**
 * Pre-configured OAuth templates from Nango's open-source providers
 * Users still need to provide their own client ID/secret
 */
export const NANGO_PROVIDER_TEMPLATES: Record<string, NangoProviderTemplate> = {
  // Communication
  'slack': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://slack.com/oauth/v2/authorize',
    token_url: 'https://slack.com/api/oauth.v2.access',
    default_scopes: ['channels:read', 'chat:write', 'users:read'],
    docs: 'https://api.slack.com/authentication/oauth-v2',
    categories: ['Communication', 'Collaboration'],
  },
  'discord': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://discord.com/api/oauth2/authorize',
    token_url: 'https://discord.com/api/oauth2/token',
    default_scopes: ['identify', 'guilds', 'messages.read'],
    docs: 'https://discord.com/developers/docs/topics/oauth2',
    categories: ['Communication'],
  },
  'microsoft-teams': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    token_url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    default_scopes: ['https://graph.microsoft.com/.default'],
    docs: 'https://learn.microsoft.com/en-us/graph/auth-v2-user',
    categories: ['Communication', 'Collaboration'],
  },

  // Development
  'github': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://github.com/login/oauth/authorize',
    token_url: 'https://github.com/login/oauth/access_token',
    default_scopes: ['repo', 'user'],
    docs: 'https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps',
    categories: ['Development', 'Version Control'],
  },
  'gitlab': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://gitlab.com/oauth/authorize',
    token_url: 'https://gitlab.com/oauth/token',
    default_scopes: ['api', 'read_user'],
    docs: 'https://docs.gitlab.com/ee/api/oauth2.html',
    categories: ['Development', 'Version Control'],
  },
  'bitbucket': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://bitbucket.org/site/oauth2/authorize',
    token_url: 'https://bitbucket.org/site/oauth2/access_token',
    default_scopes: ['repository', 'account'],
    docs: 'https://developer.atlassian.com/cloud/bitbucket/oauth-2/',
    categories: ['Development', 'Version Control'],
  },

  // Productivity
  'notion': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://api.notion.com/v1/oauth/authorize',
    token_url: 'https://api.notion.com/v1/oauth/token',
    default_scopes: [],
    authorization_params: { owner: 'user' },
    docs: 'https://developers.notion.com/docs/authorization',
    categories: ['Productivity', 'Notes'],
  },
  'google': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://accounts.google.com/o/oauth2/v2/auth',
    token_url: 'https://oauth2.googleapis.com/token',
    default_scopes: ['https://www.googleapis.com/auth/userinfo.email'],
    scope_separator: ' ',
    docs: 'https://developers.google.com/identity/protocols/oauth2',
    categories: ['Productivity', 'Google Workspace'],
  },
  'gmail': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://accounts.google.com/o/oauth2/v2/auth',
    token_url: 'https://oauth2.googleapis.com/token',
    default_scopes: ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly'],
    scope_separator: ' ',
    docs: 'https://developers.google.com/gmail/api/auth/about-auth',
    categories: ['Email', 'Google Workspace'],
  },
  'google-drive': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://accounts.google.com/o/oauth2/v2/auth',
    token_url: 'https://oauth2.googleapis.com/token',
    default_scopes: ['https://www.googleapis.com/auth/drive.file'],
    scope_separator: ' ',
    docs: 'https://developers.google.com/drive/api/guides/about-auth',
    categories: ['Storage', 'Google Workspace'],
  },
  'google-calendar': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://accounts.google.com/o/oauth2/v2/auth',
    token_url: 'https://oauth2.googleapis.com/token',
    default_scopes: ['https://www.googleapis.com/auth/calendar'],
    scope_separator: ' ',
    docs: 'https://developers.google.com/calendar/api/guides/auth',
    categories: ['Calendar', 'Google Workspace'],
  },
  'google-sheets': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://accounts.google.com/o/oauth2/v2/auth',
    token_url: 'https://oauth2.googleapis.com/token',
    default_scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    scope_separator: ' ',
    docs: 'https://developers.google.com/sheets/api/guides/authorizing',
    categories: ['Spreadsheets', 'Google Workspace'],
  },

  // Social
  'twitter': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://twitter.com/i/oauth2/authorize',
    token_url: 'https://api.twitter.com/2/oauth2/token',
    default_scopes: ['tweet.read', 'tweet.write', 'users.read'],
    scope_separator: ' ',
    docs: 'https://developer.twitter.com/en/docs/authentication/oauth-2-0',
    categories: ['Social Media'],
  },
  'linkedin': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://www.linkedin.com/oauth/v2/authorization',
    token_url: 'https://www.linkedin.com/oauth/v2/accessToken',
    default_scopes: ['r_liteprofile', 'w_member_social'],
    docs: 'https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication',
    categories: ['Social Media', 'Professional Network'],
  },
  'facebook': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://www.facebook.com/v18.0/dialog/oauth',
    token_url: 'https://graph.facebook.com/v18.0/oauth/access_token',
    default_scopes: ['public_profile', 'email'],
    docs: 'https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow',
    categories: ['Social Media'],
  },

  // CRM & Sales
  'salesforce': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://login.salesforce.com/services/oauth2/authorize',
    token_url: 'https://login.salesforce.com/services/oauth2/token',
    default_scopes: ['api', 'refresh_token'],
    docs: 'https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_web_server_flow.htm',
    categories: ['CRM', 'Sales'],
  },
  'hubspot': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://app.hubspot.com/oauth/authorize',
    token_url: 'https://api.hubapi.com/oauth/v1/token',
    default_scopes: ['crm.objects.contacts.read', 'crm.objects.contacts.write'],
    docs: 'https://developers.hubspot.com/docs/api/oauth-quickstart-guide',
    categories: ['CRM', 'Marketing'],
  },
  'pipedrive': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://oauth.pipedrive.com/oauth/authorize',
    token_url: 'https://oauth.pipedrive.com/oauth/token',
    default_scopes: [],
    docs: 'https://pipedrive.readme.io/docs/marketplace-oauth-authorization',
    categories: ['CRM', 'Sales'],
  },
  'zendesk': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://{subdomain}.zendesk.com/oauth/authorizations/new',
    token_url: 'https://{subdomain}.zendesk.com/oauth/tokens',
    default_scopes: ['read', 'write'],
    docs: 'https://developer.zendesk.com/api-reference/ticketing/oauth/oauth_tokens/',
    categories: ['Support', 'Customer Service'],
  },

  // E-commerce
  'shopify': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://{shop}.myshopify.com/admin/oauth/authorize',
    token_url: 'https://{shop}.myshopify.com/admin/oauth/access_token',
    default_scopes: ['read_products', 'write_products'],
    docs: 'https://shopify.dev/docs/apps/auth/oauth',
    categories: ['E-commerce'],
  },
  'stripe': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://connect.stripe.com/oauth/authorize',
    token_url: 'https://connect.stripe.com/oauth/token',
    default_scopes: ['read_write'],
    docs: 'https://stripe.com/docs/connect/oauth-reference',
    categories: ['Payments', 'E-commerce'],
  },
  'square': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://connect.squareup.com/oauth2/authorize',
    token_url: 'https://connect.squareup.com/oauth2/token',
    default_scopes: ['MERCHANT_PROFILE_READ', 'PAYMENTS_WRITE'],
    docs: 'https://developer.squareup.com/docs/oauth-api/overview',
    categories: ['Payments', 'E-commerce'],
  },

  // Marketing
  'mailchimp': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://login.mailchimp.com/oauth2/authorize',
    token_url: 'https://login.mailchimp.com/oauth2/token',
    default_scopes: [],
    docs: 'https://mailchimp.com/developer/marketing/guides/access-user-data-oauth-2/',
    categories: ['Email Marketing', 'Marketing'],
  },
  'sendgrid': {
    auth_mode: 'API_KEY',
    docs: 'https://docs.sendgrid.com/ui/account-and-settings/api-keys',
    categories: ['Email', 'Marketing'],
  },

  // Project Management
  'asana': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://app.asana.com/-/oauth_authorize',
    token_url: 'https://app.asana.com/-/oauth_token',
    default_scopes: ['default'],
    docs: 'https://developers.asana.com/docs/oauth',
    categories: ['Project Management', 'Productivity'],
  },
  'trello': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://trello.com/1/authorize',
    token_url: 'https://trello.com/1/OAuthGetAccessToken',
    default_scopes: ['read', 'write'],
    docs: 'https://developer.atlassian.com/cloud/trello/guides/rest-api/authorization/',
    categories: ['Project Management', 'Collaboration'],
  },
  'jira': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://auth.atlassian.com/authorize',
    token_url: 'https://auth.atlassian.com/oauth/token',
    default_scopes: ['read:jira-work', 'write:jira-work'],
    docs: 'https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/',
    categories: ['Project Management', 'Development'],
  },
  'clickup': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://app.clickup.com/api',
    token_url: 'https://api.clickup.com/api/v2/oauth/token',
    default_scopes: [],
    docs: 'https://clickup.com/api/developer-portal/authentication/',
    categories: ['Project Management', 'Productivity'],
  },
  'monday': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://auth.monday.com/oauth2/authorize',
    token_url: 'https://auth.monday.com/oauth2/token',
    default_scopes: ['boards:read', 'boards:write'],
    docs: 'https://developer.monday.com/apps/docs/oauth',
    categories: ['Project Management', 'Collaboration'],
  },

  // Storage
  'dropbox': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://www.dropbox.com/oauth2/authorize',
    token_url: 'https://api.dropboxapi.com/oauth2/token',
    default_scopes: ['files.content.read', 'files.content.write'],
    docs: 'https://www.dropbox.com/developers/documentation/http/documentation#oauth2-authorize',
    categories: ['Storage', 'File Sharing'],
  },
  'box': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://account.box.com/api/oauth2/authorize',
    token_url: 'https://api.box.com/oauth2/token',
    default_scopes: ['root_readwrite'],
    docs: 'https://developer.box.com/guides/authentication/oauth2/',
    categories: ['Storage', 'File Sharing'],
  },
  'onedrive': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    token_url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    default_scopes: ['Files.ReadWrite'],
    docs: 'https://learn.microsoft.com/en-us/onedrive/developer/rest-api/getting-started/authentication',
    categories: ['Storage', 'Microsoft 365'],
  },

  // Analytics
  'google-analytics': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://accounts.google.com/o/oauth2/v2/auth',
    token_url: 'https://oauth2.googleapis.com/token',
    default_scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    scope_separator: ' ',
    docs: 'https://developers.google.com/analytics/devguides/reporting/core/v4/authorization',
    categories: ['Analytics', 'Google Workspace'],
  },

  // Design
  'figma': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://www.figma.com/oauth',
    token_url: 'https://www.figma.com/api/oauth/token',
    default_scopes: ['file_read'],
    docs: 'https://www.figma.com/developers/api#oauth2',
    categories: ['Design', 'Collaboration'],
  },

  // Communication (Additional)
  'zoom': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://zoom.us/oauth/authorize',
    token_url: 'https://zoom.us/oauth/token',
    default_scopes: ['meeting:write', 'meeting:read'],
    docs: 'https://developers.zoom.us/docs/integrations/oauth/',
    categories: ['Communication', 'Video Conferencing'],
  },
  'twilio': {
    auth_mode: 'BASIC',
    docs: 'https://www.twilio.com/docs/iam/api-keys',
    categories: ['Communication', 'SMS'],
  },

  // HR & Recruiting
  'bamboohr': {
    auth_mode: 'API_KEY',
    docs: 'https://documentation.bamboohr.com/docs/getting-started',
    categories: ['HR', 'Human Resources'],
  },
  'greenhouse': {
    auth_mode: 'BASIC',
    docs: 'https://developers.greenhouse.io/harvest.html#authentication',
    categories: ['Recruiting', 'HR'],
  },

  // Accounting
  'quickbooks': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://appcenter.intuit.com/connect/oauth2',
    token_url: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
    default_scopes: ['com.intuit.quickbooks.accounting'],
    docs: 'https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0',
    categories: ['Accounting', 'Finance'],
  },
  'xero': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://login.xero.com/identity/connect/authorize',
    token_url: 'https://identity.xero.com/connect/token',
    default_scopes: ['accounting.transactions', 'accounting.contacts'],
    docs: 'https://developer.xero.com/documentation/guides/oauth2/overview/',
    categories: ['Accounting', 'Finance'],
  },

  // Data & Databases
  'airtable': {
    auth_mode: 'OAUTH2',
    authorization_url: 'https://airtable.com/oauth2/v1/authorize',
    token_url: 'https://airtable.com/oauth2/v1/token',
    default_scopes: ['data.records:read', 'data.records:write'],
    docs: 'https://airtable.com/developers/web/api/oauth-reference',
    categories: ['Database', 'Productivity'],
  },
};

/**
 * Get provider template by key
 */
export function getProviderTemplate(providerKey: string): NangoProviderTemplate | null {
  return NANGO_PROVIDER_TEMPLATES[providerKey.toLowerCase()] || null;
}

/**
 * Get all available provider keys
 */
export function getAllProviderKeys(): string[] {
  return Object.keys(NANGO_PROVIDER_TEMPLATES);
}

/**
 * Search providers by category
 */
export function getProvidersByCategory(category: string): string[] {
  return Object.entries(NANGO_PROVIDER_TEMPLATES)
    .filter(([_, template]) => template.categories?.includes(category))
    .map(([key]) => key);
}

/**
 * Get API base URL for provider (for proxy calls)
 */
export function getProviderApiBaseUrl(providerKey: string): string {
  const baseUrls: Record<string, string> = {
    'slack': 'https://slack.com/api',
    'github': 'https://api.github.com',
    'notion': 'https://api.notion.com/v1',
    'google': 'https://www.googleapis.com',
    'gmail': 'https://gmail.googleapis.com/gmail/v1',
    'google-drive': 'https://www.googleapis.com/drive/v3',
    'google-calendar': 'https://www.googleapis.com/calendar/v3',
    'google-sheets': 'https://sheets.googleapis.com/v4',
    'discord': 'https://discord.com/api',
    'twitter': 'https://api.twitter.com/2',
    'linkedin': 'https://api.linkedin.com/v2',
    'salesforce': 'https://login.salesforce.com/services/data/v58.0',
    'hubspot': 'https://api.hubapi.com',
    'shopify': 'https://admin.shopify.com/admin/api/2024-01',
    'stripe': 'https://api.stripe.com/v1',
    'asana': 'https://app.asana.com/api/1.0',
    'trello': 'https://api.trello.com/1',
    'jira': 'https://api.atlassian.com',
    'dropbox': 'https://api.dropboxapi.com/2',
    'figma': 'https://api.figma.com/v1',
  };

  return baseUrls[providerKey.toLowerCase()] || '';
}
