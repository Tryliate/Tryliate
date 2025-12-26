import { create } from 'zustand';
import { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect, applyNodeChanges, applyEdgeChanges, addEdge, Connection } from '@xyflow/react';

export interface ProtocolNodeData extends Record<string, unknown> {
  label: string;
  type: string;
  meta: Record<string, string>;
  onEdit?: () => void;
  description?: string;
  config?: any;
}

interface WorkflowState {
  nodes: Node<ProtocolNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  currentWorkflowId: string | null;
  currentWorkflowName: string;
  aiTokens: number;

  setNodes: (nodes: Node<ProtocolNodeData>[] | ((nds: Node<ProtocolNodeData>[]) => Node<ProtocolNodeData>[])) => void;
  setEdges: (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void;
  setSelectedNodeId: (id: string | null) => void;
  setCurrentWorkflowId: (id: string | null) => void;
  setCurrentWorkflowName: (name: string) => void;
  setAiTokens: (tokens: number | ((t: number) => number)) => void;

  onNodesChange: OnNodesChange<Node<ProtocolNodeData>>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  updateNode: (id: string, data: Partial<ProtocolNodeData>) => void;
  deleteNode: (id: string) => void;
  resetWorkflow: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  currentWorkflowId: null,
  currentWorkflowName: "Neural Flow",
  aiTokens: 0,

  setNodes: (nodes) => set((state) => ({
    nodes: typeof nodes === 'function' ? nodes(state.nodes) : nodes
  })),
  setEdges: (edges) => set((state) => ({
    edges: typeof edges === 'function' ? edges(state.edges) : edges
  })),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setCurrentWorkflowId: (id) => set({ currentWorkflowId: id }),
  setCurrentWorkflowName: (name) => set({ currentWorkflowName: name }),
  setAiTokens: (tokens) => set((state) => ({
    aiTokens: typeof tokens === 'function' ? tokens(state.aiTokens) : tokens
  })),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge({
        ...connection,
        style: { stroke: '#333', strokeWidth: 3, strokeDasharray: '4,4' }
      }, get().edges),
    });
  },

  updateNode: (id, data) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, ...data }
          };
        }
        return node;
      }),
    });
  },

  deleteNode: (id) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  resetWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      currentWorkflowId: null,
      currentWorkflowName: "Neural Flow",
    });
  },
}));
