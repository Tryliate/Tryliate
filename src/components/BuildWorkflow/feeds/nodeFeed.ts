import { Server, Box, Database } from 'lucide-react';

export const NODE_CATEGORIES = [
  { type: 'host', label: 'Compute Hosts', icon: Server },
  { type: 'tool', label: 'Logic Tools', icon: Box },
  { type: 'res', label: 'Data Resources', icon: Database }
];

export const NODE_CONTENT = [
  { label: 'GCP Cloud Host', type: 'host', domain: 'google.com', description: 'Enterprise-grade managed MCP runtime.' },
  { label: 'AWS Node Core', type: 'host', domain: 'amazon.com', description: 'High-availability compute cluster.' },
  { label: 'Vercel Edge', type: 'host', domain: 'vercel.com', description: 'Global edge function orchestrator.' },
  { label: 'Physical Server', type: 'host', domain: 'apple.com', description: 'Secure on-premise hardware node.' }
];
