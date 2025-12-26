import { useCallback } from 'react';
import { Node, OnNodesChange, OnEdgesChange, OnConnect, OnSelectionChangeParams } from '@xyflow/react';
import { useWorkflowStore, ProtocolNodeData } from '@/store/useWorkflowStore';

export type { ProtocolNodeData };

export function useWorkflowState(screenToFlowPosition: (pos: { x: number, y: number }) => { x: number, y: number }) {
  const {
    nodes, edges, setNodes, setEdges,
    selectedNodeId, setSelectedNodeId,
    currentWorkflowId, setCurrentWorkflowId,
    currentWorkflowName, setCurrentWorkflowName,
    aiTokens, setAiTokens,
    onNodesChange, onEdgesChange, onConnect,
    updateNode, deleteNode
  } = useWorkflowStore();

  const handleSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    setSelectedNodeId(params.nodes[0]?.id || null);
  }, [setSelectedNodeId]);

  const handleUpdateNode = useCallback((id: string, data: Partial<ProtocolNodeData>) => {
    updateNode(id, data);
  }, [updateNode]);

  const handleDeleteNode = useCallback((id: string) => {
    deleteNode(id);
  }, [deleteNode]);

  const spawnNode = useCallback((config: any, isFlow = false, setIsConfigModalOpen: any, setActiveConfigNodeId: any) => {
    if (isFlow && config.nodes && config.edges) {
      const offset = { x: Math.random() * 50, y: Math.random() * 50 };
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const flowNodes = config.nodes.map((n: any) => ({
        ...n,
        id: `${n.id}-${Date.now()}`,
        position: screenToFlowPosition({ x: n.position.x + centerX - 400 + offset.x, y: n.position.y + centerY - 300 + offset.y }),
        data: { ...n.data, onEdit: () => { setActiveConfigNodeId(`${n.id}-${Date.now()}`); setIsConfigModalOpen(true); } }
      }));

      const idMap: Record<string, string> = {};
      config.nodes.forEach((n: any, i: number) => { idMap[n.id] = flowNodes[i].id; });

      const flowEdges = config.edges.map((e: any) => ({
        ...e,
        id: `${e.id}-${Date.now()}`,
        source: idMap[e.source],
        target: idMap[e.target]
      }));

      setNodes((nds) => nds.concat(flowNodes));
      setEdges((eds) => eds.concat(flowEdges));
    } else {
      const id = `node-${Date.now()}`;

      const offset = { x: Math.random() * 80 - 40, y: Math.random() * 80 - 40 };
      const position = {
        x: (window.innerWidth / 2) - 100 + offset.x,
        y: (window.innerHeight / 2) - 100 + offset.y
      };

      const newNode: Node<ProtocolNodeData> = {
        id,
        type: 'protocol',
        position,
        data: {
          ...config,
          meta: config.meta || { status: 'ready', ver: '0.1.0' },
          onEdit: () => {
            setActiveConfigNodeId(id);
            setIsConfigModalOpen(true);
          }
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedNodeId(id);
    }
  }, [screenToFlowPosition, setNodes, setEdges, setSelectedNodeId]);

  return {
    nodes, edges, setNodes, setEdges,
    selectedNodeId, setSelectedNodeId,
    currentWorkflowId, setCurrentWorkflowId,
    currentWorkflowName, setCurrentWorkflowName,
    aiTokens, setAiTokens,
    onNodesChange, onEdgesChange, onConnect,
    handleSelectionChange, handleUpdateNode, handleDeleteNode, spawnNode
  };
}
