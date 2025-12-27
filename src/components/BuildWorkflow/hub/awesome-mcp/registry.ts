import {
  Puzzle,
  Palette,
  Database,
  Terminal,
  Code,
  Globe,
  Cpu,
  ShieldCheck,
  MessagesSquare,
  Zap,
  HardDrive,
  Coins,
  Gamepad2,
  BrainCircuit,
  Scale,
  MapPin,
  Target,
  FlaskConical,
  Search,
  Users,
  Briefcase,
  Star,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const AWESOME_MCP_CATEGORIES = [
  { id: 'official', label: 'Official Registry', icon: ShieldCheck, description: 'Verified servers from the GitHub Official MCP Registry (github.com/mcp).' },
  { id: 'reference', label: 'Anthropic Official', icon: BookOpen, description: 'Reference implementations from the core Anthropic MCP team.' },
];

export const AWESOME_MCP_SERVERS = [];

// Backend Proxy Configuration (Unified Official Registry)
const BACKEND_URL = process.env.NEXT_PUBLIC_REGISTRY_URL || 'https://tryliate-registry-374665986758.us-central1.run.app';

// Unified Official API (Neon Hub Backed)
export const fetchMCPRegistry = async (variant: 'Servers' | 'Tools' | 'Clients' = 'Servers') => {
  try {
    const typeMap: Record<string, string> = { 'Servers': 'server', 'Tools': 'tool', 'Clients': 'client' };
    const queryType = typeMap[variant] || 'server';

    // Fetch from our unified official-first backend via local proxy to verify headers/CORS
    const targetUrl = `${BACKEND_URL}/api/mcp/glama?first=100&type=${queryType}`;
    const response = await fetch(`/api/proxy?target=${encodeURIComponent(targetUrl)}`);

    if (!response.ok) throw new Error('Registry Hub proxy unreachable');

    const data = await response.json();
    const servers = data.servers || [];

    return servers.map((s: any) => {
      const isAnthropic = s.source === 'anthropic-official' ||
        (s.slug || '').includes('modelcontextprotocol/') ||
        (s.label || '').toLowerCase().includes('anthropic');

      return {
        label: s.name,
        id: s.slug,
        category: isAnthropic ? 'reference' : 'official',
        type: 'tool',
        domain: (() => {
          try {
            return s.homepage ? new URL(s.homepage).hostname : 'github.com';
          } catch {
            return 'github.com';
          }
        })(),
        description: s.description,
        meta: {
          // Attempt to find version in top-level fields or parse from tags/description
          version: s.version ||
            s.latest_version ||
            (s.tags && s.tags.find((t: any) => /v?\d+\.\d+\.\d+/.test(t))) ||
            (s.description && s.description.match(/v(\d+\.\d+\.\d+)/)?.[1]) ||
            '0.1.0',
          source: isAnthropic ? 'Anthropic Official' :
            s.source === 'github-registry' ? 'GitHub Marketplace' :
              s.source === 'mcp-registry-live' ? 'Official Registry' :
                'Community Root',
          verified: (isAnthropic || s.verified || (s.tags && s.tags.includes('verified'))) ? 'true' : 'false',
          logo: `https://github.com/${s.slug.split('/')[0]}.png`, // Fallback to author avatar
          author: s.slug.split('/')[0] || 'mcp',
          tags: s.tags && s.tags.length > 0 ? s.tags.join(', ') : 'mcp-server, utility',
          homepage: s.homepage,
          downloadCount: s.downloadCount
        }
      };
    });
  } catch (error) {
    console.error('Failed to fetch Unified registry:', error);
    return [];
  }
};

// Legacy fetchers kept as stubs to prevent import breakages, but now return empty
export const fetchSeedRegistry = async () => [];
export const fetchAwesomeMCPRegistry = async () => [];
export const fetchOfficialReferenceRegistry = async () => [];

