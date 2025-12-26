import { Sparkles, LayoutTemplate, Database, Globe } from 'lucide-react';
import { AWESOME_MCP_CATEGORIES, AWESOME_MCP_SERVERS, fetchMCPRegistry, fetchAwesomeMCPRegistry, fetchSeedRegistry, fetchOfficialReferenceRegistry } from '../hub/awesome-mcp/registry';




export const MCP_CATEGORIES = [
  { type: 'ai', label: 'AI Models', icon: Sparkles },
  { type: 'api', label: 'External APIs', icon: LayoutTemplate },
  { type: 'db', label: 'Managed DBs', icon: Database },
  { type: 'hub', label: 'MCP Hub', icon: Globe }
];

export const MCP_CONTENT = [
  { label: 'OpenAI GPT-4o', type: 'tool', domain: 'openai.com', description: 'Advanced reasoning and code generation.' },
  { label: 'Github Search', type: 'tool', domain: 'github.com', description: 'Recursive repository exploration tool.' },
  { label: 'Supabase Postgres', type: 'res', domain: 'supabase.com', description: 'Relational data store with real-time sync.' },
  { label: 'Clerk Auth', type: 'tool', domain: 'clerk.com', description: 'Unified identity and session management.' },
  { label: 'Firebase Stats', type: 'res', domain: 'firebase.google.com', description: 'Real-time analytics and event streaming.' },
  { label: 'Stripe Billing', type: 'tool', domain: 'stripe.com', description: 'Global financial infrastructure gateway.' }
];

export const MCP_HUB_DATA = {
  awesome: {
    categories: AWESOME_MCP_CATEGORIES,
    servers: AWESOME_MCP_SERVERS
  }
};

export { fetchMCPRegistry, fetchAwesomeMCPRegistry, fetchSeedRegistry, fetchOfficialReferenceRegistry };




