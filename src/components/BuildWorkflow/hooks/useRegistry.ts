import { useState, useEffect } from 'react';
import { fetchMCPRegistry } from '../feeds/mcpFeed';
import { fetchFlowFeed, FlowFeedItem } from '../../../lib/flow-feed';
import { supabase } from '../../../lib/supabase';

export function useRegistry(activeHubVariant: 'Servers' | 'Tools' | 'Clients') {
  const [dynamicMCPServers, setDynamicMCPServers] = useState<any[]>([]);
  const [isFetchingMCP, setIsFetchingMCP] = useState(false);
  const [foundryNodes, setFoundryNodes] = useState<any[]>([]);
  const [flowFeed, setFlowFeed] = useState<FlowFeedItem[]>([]);

  useEffect(() => {
    const loadMCPRegistry = async () => {
      setIsFetchingMCP(true);
      const official = await fetchMCPRegistry(activeHubVariant);
      setDynamicMCPServers(official);
      setIsFetchingMCP(false);
    };
    loadMCPRegistry();
  }, [activeHubVariant]);

  useEffect(() => {
    const fetchFoundryNodes = async () => {
      try {
        const response = await fetch('/api/foundry/nodes');
        if (!response.ok) throw new Error('Failed to fetch node registry');
        const data = await response.json();
        setFoundryNodes(data || []);
      } catch (e) {
        console.warn('⚠️ [Registry] Neon Sync unreachable. Using neural fallback.', e);
        setFoundryNodes([
          { id: 'foundry-1', label: 'Neural Processor', type: 'core', category: 'AI CORE', description: 'Standard neural engine' },
          { id: 'foundry-2', label: 'Identity Vault', type: 'security', category: 'AUTH', description: 'Advanced security core' }
        ]);
      }
    };
    fetchFoundryNodes();
  }, []);

  useEffect(() => {
    const loadFlows = async () => {
      try {
        const response = await fetch('/api/foundry/flows');
        if (!response.ok) throw new Error('Failed to fetch flow feed');
        const data = await response.json();
        setFlowFeed(data);
      } catch (e) {
        console.warn('⚠️ [Registry] Flow Feed unreachable.', e);
        setFlowFeed([]);
      }
    };
    loadFlows();
  }, []);

  return { dynamicMCPServers, isFetchingMCP, foundryNodes, flowFeed };
}
