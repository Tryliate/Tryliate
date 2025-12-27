"use client";

import React from 'react';
import { OverlayHeader } from './components/OverlayHeader';
import { FoundryFeed } from './components/FoundryFeed';
import { MCPHubFeed } from './components/MCPHubFeed';
import { FlowFeed } from './components/FlowFeed';
import { AIResearchPanel } from './components/AIResearchPanel';
import { NangoToolFeed } from './components/NangoToolFeed';
import { FULL_NANGO_REGISTRY } from '../../../data/nango-registry';

interface WorkflowOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeOverlay: { category: string, subType: string } | null;
  activeFoundryCategory: string;
  setActiveFoundryCategory: (v: string) => void;
  foundryNodes: any[];
  activeAISidebarNode: any;
  setActiveAISidebarNode: (v: any) => void;
  isViewAll: boolean;
  setIsViewAll: (v: boolean) => void;
  handleSpawnNode: (config: any, isFlow?: boolean) => void;
  dynamicMCPServers: any[];
  activeHubCategory: string | null;
  setActiveHubCategory?: (v: string | null) => void;
  flowFeed: any[];
  activeFlowCategory: string;
  setActiveFlowCategory: (v: any) => void;
  runStatus: string;
  graphContext: string;
  executionLogs: any[];
  isExecuting: boolean;
  aiTokens: number;
  setAiTokens: (v: number | ((prev: number) => number)) => void;
  user?: any;
  nodes: any[];
  setNodes: (nodes: any[]) => void;
  setEdges: (edges: any[]) => void;
}

export const WorkflowOverlay = ({
  isOpen, onClose, activeOverlay,
  activeFoundryCategory, setActiveFoundryCategory,
  foundryNodes, activeAISidebarNode, setActiveAISidebarNode,
  isViewAll, setIsViewAll, handleSpawnNode,
  dynamicMCPServers, activeHubCategory, setActiveHubCategory,
  flowFeed, activeFlowCategory, setActiveFlowCategory,
  runStatus, graphContext, executionLogs, isExecuting,
  aiTokens, setAiTokens,
  user,
  nodes, setNodes, setEdges
}: WorkflowOverlayProps) => {
  const [localNotification, setLocalNotification] = React.useState<string | null>(null);
  const [appliedFlowId, setAppliedFlowId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (localNotification) {
      const timer = setTimeout(() => setLocalNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [localNotification]);

  if (!isOpen || !activeOverlay) return null;

  const handleFlowClick = (flow: any) => {
    const requiredNodes = flow.nodes?.length || 0;
    const currentNodes = nodes.length;

    // 1. Validation: Ensure Canvas has enough nodes
    if (currentNodes === 0) {
      setLocalNotification("Canvas is empty: Add nodes or MCP tools to build a flow");
      return;
    }

    if (currentNodes < requiredNodes) {
      setLocalNotification(`Insufficient Nodes: ${currentNodes}/${requiredNodes} available. Add more nodes.`);
      return;
    }

    // 2. Apply Topology
    const centerX = 400;
    const centerY = 300;
    const spacing = 240;

    // Detect topology from field or name
    const topology = flow.topology?.toUpperCase() || '';
    const name = flow.name?.toUpperCase() || '';

    const isBus = topology === 'BUS' || name.includes('BUS');
    const isStar = topology === 'STAR' || name.includes('STAR');
    const isMesh = topology === 'MESH' || name.includes('MESH');

    const newNodes = [...nodes].map((node, index) => {
      let x = node.position.x;
      let y = node.position.y;

      if (isBus) {
        // Linear chain
        x = centerX + (index - (nodes.length - 1) / 2) * spacing;
        y = centerY;
      } else if (isStar) {
        // Radial
        if (index === 0) {
          x = centerX;
          y = centerY;
        } else {
          // Distribute remaining nodes in a circle
          const totalSatellites = nodes.length - 1;
          const angle = ((index - 1) / totalSatellites) * (Math.PI * 2);
          x = centerX + Math.cos(angle) * (spacing * 1.2);
          y = centerY + Math.sin(angle) * (spacing * 1.2);
        }
      } else if (isMesh) {
        // Grid / Matrix
        const cols = Math.ceil(Math.sqrt(nodes.length));
        const row = Math.floor(index / cols);
        const col = index % cols;
        x = centerX + (col - (cols - 1) / 2) * spacing;
        y = centerY + (row - (cols - 1) / 2) * spacing;
      }

      return { ...node, position: { x, y } };
    });

    // 3. Auto-Wire Edges based on Topology
    const newEdges: any[] = [];

    if (isBus) {
      for (let i = 0; i < newNodes.length - 1; i++) {
        newEdges.push({
          id: `e-bus-${newNodes[i].id}-${newNodes[i + 1].id}-${Date.now()}`,
          source: newNodes[i].id,
          target: newNodes[i + 1].id,
          animated: false,
          style: { stroke: '#fff', strokeWidth: 2 }
        });
      }
    } else if (isStar) {
      const centerNodeId = newNodes[0].id;
      for (let i = 1; i < newNodes.length; i++) {
        newEdges.push({
          id: `e-star-${centerNodeId}-${newNodes[i].id}-${Date.now()}`,
          source: centerNodeId,
          target: newNodes[i].id,
          animated: false,
          style: { stroke: '#fff', strokeWidth: 2 }
        });
      }
    } else if (isMesh) {
      // Connect to neighbors (or full mesh if small)
      for (let i = 0; i < newNodes.length; i++) {
        for (let j = i + 1; j < newNodes.length; j++) {
          newEdges.push({
            id: `e-mesh-${newNodes[i].id}-${newNodes[j].id}-${Date.now()}`,
            source: newNodes[i].id,
            target: newNodes[j].id,
            style: { stroke: '#fff', strokeWidth: 1 }
          });
        }
      }
    }

    setNodes(newNodes);
    setEdges(newEdges); // Replaces existing edges with new topology wiring
    setAppliedFlowId(flow.id);
    setLocalNotification(`Applied ${flow.name} (${requiredNodes}N) successfully!`);
  };

  return (
    <div style={{
      position: 'absolute',
      top: '48px',
      left: '80px',
      right: '80px',
      bottom: '48px',
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(32px) saturate(180%)',
      borderRadius: '48px',
      border: '1px solid #222',
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeInOverlay 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      fontFamily: 'inherit'
    }}>
      <style>{`
        @keyframes fadeInOverlay {
          from { opacity: 0; transform: scale(1.02); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #111; border-radius: 10px; }
      `}</style>

      <OverlayHeader
        activeOverlay={activeOverlay}
        activeFoundryCategory={activeFoundryCategory}
        setActiveFoundryCategory={setActiveFoundryCategory}
        activeHubCategory={activeHubCategory}
        setActiveHubCategory={setActiveHubCategory}
        activeFlowCategory={activeFlowCategory}
        setActiveFlowCategory={setActiveFlowCategory}
        onClose={onClose}
        notification={localNotification}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{
          flex: activeAISidebarNode ? '0 0 65%' : 1,
          maxWidth: activeAISidebarNode ? '65%' : '100%',
          padding: activeAISidebarNode ? '24px' : '24px 48px 48px 48px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
          borderRight: activeAISidebarNode ? '1px solid rgba(255,255,255,0.05)' : 'none',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }} className="custom-scroll">

          {(activeOverlay.subType === 'Foundry' || activeOverlay.subType === 'Node Feed') ? (
            <FoundryFeed
              foundryNodes={foundryNodes}
              activeFoundryCategory={activeFoundryCategory}
              isViewAll={isViewAll}
              setIsViewAll={setIsViewAll}
              activeAISidebarNode={activeAISidebarNode}
              setActiveAISidebarNode={setActiveAISidebarNode}
              handleSpawnNode={handleSpawnNode}
            />
          ) : activeOverlay.subType === 'MCP Hub' ? (
            <MCPHubFeed
              dynamicMCPServers={dynamicMCPServers}
              activeHubCategory={activeHubCategory}
              isViewAll={isViewAll}
              setIsViewAll={setIsViewAll}
              activeAISidebarNode={activeAISidebarNode}
              setActiveAISidebarNode={setActiveAISidebarNode}
              handleSpawnNode={handleSpawnNode}
            />
          ) : activeOverlay.subType === 'Nango Hub' ? (
            <NangoToolFeed
              integrations={FULL_NANGO_REGISTRY}
              activeCategory={activeHubCategory}
              isViewAll={isViewAll}
              setIsViewAll={setIsViewAll}
              activeAISidebarNode={activeAISidebarNode}
              setActiveAISidebarNode={setActiveAISidebarNode}
              handleSpawnNode={handleSpawnNode}
            />
          ) : activeOverlay.category === 'FLOW' ? (
            <FlowFeed
              flowFeed={flowFeed}
              activeFlowCategory={activeFlowCategory}
              runStatus={runStatus}
              isViewAll={isViewAll}
              setIsViewAll={setIsViewAll}
              activeAISidebarNode={activeAISidebarNode}
              setActiveAISidebarNode={setActiveAISidebarNode}
              handleSpawnNode={(flow) => handleFlowClick(flow)}
              appliedFlowId={appliedFlowId}
            />
          ) : null}
        </div>

        <AIResearchPanel
          activeAISidebarNode={activeAISidebarNode}
          setActiveAISidebarNode={setActiveAISidebarNode}
          graphContext={graphContext}
          executionLogs={executionLogs}
          isExecuting={isExecuting}
          aiTokens={aiTokens}
          setAiTokens={setAiTokens}
          user={user}
        />
      </div>
    </div>
  );
};
