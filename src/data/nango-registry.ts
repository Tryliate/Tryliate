export interface NangoIntegration {
  id: string;
  name: string;
  provider: string;
  icon: string;
  description: string;
  categories: string[];
  auth_mode: 'OAUTH2' | 'API_KEY' | 'BASIC' | 'OAUTH1';
  docs?: string;
  type: string;
}

export const NANGO_INTEGRATIONS: NangoIntegration[] = [
  // CRM
  {
    id: 'nango-salesforce',
    name: 'Salesforce',
    provider: 'salesforce',
    icon: 'https://img.logo.dev/salesforce.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Enterprise CRM for sales, service, and marketing automation.',
    categories: ['CRM', 'Sales'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },
  {
    id: 'nango-hubspot',
    name: 'HubSpot',
    provider: 'hubspot',
    icon: 'https://img.logo.dev/hubspot.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Inbound marketing, sales, and service software.',
    categories: ['CRM', 'Marketing'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },
  {
    id: 'nango-pipedrive',
    name: 'Pipedrive',
    provider: 'pipedrive',
    icon: 'https://img.logo.dev/pipedrive.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Sales CRM and pipeline management software.',
    categories: ['CRM', 'Sales'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },
  {
    id: 'nango-zendesk',
    name: 'Zendesk',
    provider: 'zendesk',
    icon: 'https://img.logo.dev/zendesk.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Customer service software and support ticket system.',
    categories: ['Support', 'Customer Service'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },

  // Productivity
  {
    id: 'nango-notion',
    name: 'Notion',
    provider: 'notion',
    icon: 'https://img.logo.dev/notion.so?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Connected workspace for wiki, docs, and projects.',
    categories: ['Productivity', 'Collaboration'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },
  {
    id: 'nango-asana',
    name: 'Asana',
    provider: 'asana',
    icon: 'https://img.logo.dev/asana.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Work management platform for teams.',
    categories: ['Productivity', 'Project Management'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },
  {
    id: 'nango-monday',
    name: 'Monday.com',
    provider: 'monday',
    icon: 'https://img.logo.dev/monday.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Work OS to manage any workflow.',
    categories: ['Productivity', 'Project Management'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },
  {
    id: 'nango-clickup',
    name: 'ClickUp',
    provider: 'clickup',
    icon: 'https://img.logo.dev/clickup.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'One app to replace them all.',
    categories: ['Productivity', 'Project Management'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },

  // Communication
  {
    id: 'nango-slack',
    name: 'Slack',
    provider: 'slack',
    icon: 'https://img.logo.dev/slack.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Messaging app for business.',
    categories: ['Communication', 'Collaboration'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },
  {
    id: 'nango-discord',
    name: 'Discord',
    provider: 'discord',
    icon: 'https://img.logo.dev/discord.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Voice, video, and text communication.',
    categories: ['Communication'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },
  {
    id: 'nango-ms-teams',
    name: 'Microsoft Teams',
    provider: 'microsoft-teams',
    icon: 'https://img.logo.dev/microsoft.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Hub for teamwork in Microsoft 365.',
    categories: ['Communication', 'Collaboration'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },

  // Development
  {
    id: 'nango-github',
    name: 'GitHub',
    provider: 'github',
    icon: 'https://img.logo.dev/github.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Development platform and version control.',
    categories: ['Development', 'Version Control'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },
  {
    id: 'nango-gitlab',
    name: 'GitLab',
    provider: 'gitlab',
    icon: 'https://img.logo.dev/gitlab.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Complete DevOps platform.',
    categories: ['Development', 'DevOps'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },
  {
    id: 'nango-jira',
    name: 'Jira',
    provider: 'jira',
    icon: 'https://img.logo.dev/atlassian.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Issue tracking and project management for software teams.',
    categories: ['Development', 'Project Management'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },

  // Commerce & Payments
  {
    id: 'nango-stripe',
    name: 'Stripe',
    provider: 'stripe',
    icon: 'https://img.logo.dev/stripe.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Payment processing for the internet.',
    categories: ['Payments', 'Finance'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },
  {
    id: 'nango-shopify',
    name: 'Shopify',
    provider: 'shopify',
    icon: 'https://img.logo.dev/shopify.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'E-commerce platform for online stores and retail.',
    categories: ['E-commerce', 'Sales'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },
  {
    id: 'nango-square',
    name: 'Square',
    provider: 'square',
    icon: 'https://img.logo.dev/squareup.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Payments and point-of-sale solutions.',
    categories: ['Payments', 'E-commerce'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },

  // Marketing
  {
    id: 'nango-mailchimp',
    name: 'Mailchimp',
    provider: 'mailchimp',
    icon: 'https://img.logo.dev/mailchimp.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Email marketing and automation platform.',
    categories: ['Marketing', 'Email'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },
  {
    id: 'nango-sendgrid',
    name: 'SendGrid',
    provider: 'sendgrid',
    icon: 'https://img.logo.dev/sendgrid.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Cloud-based email delivery platform.',
    categories: ['Marketing', 'Email'],
    auth_mode: 'API_KEY',
    type: 'tool'
  },

  // Cloud & Storage
  {
    id: 'nango-dropbox',
    name: 'Dropbox',
    provider: 'dropbox',
    icon: 'https://img.logo.dev/dropbox.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Cloud storage and file synchronization.',
    categories: ['Storage', 'Cloud'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },
  {
    id: 'nango-box',
    name: 'Box',
    provider: 'box',
    icon: 'https://img.logo.dev/box.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Cloud content management and file sharing.',
    categories: ['Storage', 'Collaboration'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },
  {
    id: 'nango-google-drive',
    name: 'Google Drive',
    provider: 'google-drive',
    icon: 'https://img.logo.dev/google.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Cloud storage and sync by Google.',
    categories: ['Storage', 'Google Workspace'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },

  // Data & Analytics
  {
    id: 'nango-airtable',
    name: 'Airtable',
    provider: 'airtable',
    icon: 'https://img.logo.dev/airtable.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Platform for building collaborative apps.',
    categories: ['Database', 'Productivity'],
    auth_mode: 'OAUTH2',
    type: 'tool'
  },
  {
    id: 'nango-amplitude',
    name: 'Amplitude',
    provider: 'amplitude',
    icon: 'https://img.logo.dev/amplitude.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Product analytics platform.',
    categories: ['Analytics'],
    auth_mode: 'API_KEY',
    type: 'tool'
  },
  {
    id: 'nango-mixpanel',
    name: 'Mixpanel',
    provider: 'mixpanel',
    icon: 'https://img.logo.dev/mixpanel.com?token=pk_CZ_0opokQL-e57WMnULvMQ',
    description: 'Leading product analytics software.',
    categories: ['Analytics'],
    auth_mode: 'BASIC',
    type: 'tool'
  }
];

// Dynamically generate a larger set by repeating and varying slightly to simulate 650
// In a real scenario, this would be a full static JSON or fetched from Nango API
export const FULL_NANGO_REGISTRY: NangoIntegration[] = [
  ...NANGO_INTEGRATIONS,
  // Add 600+ more virtual tools for discovery simulation
  ...Array.from({ length: 600 }).map((_, i) => ({
    id: `nango-extra-${i}`,
    name: `Tool ${i + 100}`,
    provider: `provider-${i + 100}`,
    icon: `https://avatar.vercel.sh/nango-${i}`,
    description: `Universal integration module for ${i + 100} protocol.`,
    categories: [
      ['Automations', 'ERP', 'Social', 'AI', 'Payments', 'HR', 'Support'][i % 7],
      'Universal Ad-on'
    ],
    auth_mode: ['OAUTH2', 'API_KEY', 'BASIC'][i % 3] as any,
    type: 'tool'
  }))
];
