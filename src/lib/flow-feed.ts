
import { supabase } from './supabase';
import { Edge, Node } from '@xyflow/react';

// Topology Types
export type FlowTopology = 'Star' | 'Bus' | 'Mesh' | 'Ring' | 'Tree' | 'Hybrid' | 'Single';

export interface FlowFeedItem {
  id: string;
  name: string;
  description: string;
  topology: FlowTopology;
  category: 'SINGLE NODE' | 'MULTI NODE';
  nodes: Node[];
  edges: Edge[];
}

export const fetchFlowFeed = async (): Promise<FlowFeedItem[]> => {
  try {
    const { data, error } = await supabase
      .from('flow_feed')
      .select('*');

    if (error) {
      console.error('Error fetching flow feed:', error);
      return [];
    }

    return (data || []) as FlowFeedItem[];
  } catch (err) {
    console.error('Unexpected error fetching flow feed:', err);
    return [];
  }
};
