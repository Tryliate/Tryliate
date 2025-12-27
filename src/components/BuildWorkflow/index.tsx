"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  ConnectionLineType,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './styles.css';

import { Toolbar } from './Toolbar';
import { NodePanel } from './NodePanel';
import { MCPConfigModal } from './MCPConfigModal';
import { AIPanel } from './AIPanel';
import { nodeTypes } from './constants';
import { Check } from 'lucide-react';
import { WorkflowOverlay } from './WorkflowOverlay';
import { EdgeConfigProvider, useEdgeConfig } from './EdgeConfigContext';

// Hooks
import { useWorkflowState } from './hooks/useWorkflowState';
import { useAuthSync } from './Auth/hooks/useAuthSync';
import { useInfrastructure } from './hooks/useInfrastructure';
import { useRegistry } from './hooks/useRegistry';
import { useMasterHandshake } from './Auth/hooks/useMasterHandshake';
import { CustomEdge } from './CustomEdge';

import { SmartConnectOverlay } from './Auth/components/SmartConnectOverlay';
import { MasterHandshakeOverlay } from './Auth/components/MasterHandshakeOverlay';

const edgeTypes = {
  'custom-edge': CustomEdge,
};

const BuildWorkflowInner = () => {
  const { screenToFlowPosition } = useReactFlow();
  const { activeEdgeId, runStatus, setRunStatus } = useEdgeConfig();

  // 1. All UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [activeConfigNodeId, setActiveConfigNodeId] = useState<string | null>(null);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<{ category: string, subType: string } | null>(null);
  const [isViewAll, setIsViewAll] = useState(false);
  const [activeAISidebarNode, setActiveAISidebarNode] = useState<any | null>(null);
  const [activeHubCategory, setActiveHubCategory] = useState<string | null>(null);
  const [activeHubVariant, setActiveHubVariant] = useState<'Servers' | 'Tools' | 'Clients'>('Servers');
  const [activeFoundryCategory, setActiveFoundryCategory] = useState<string>('AI CORE');
  const [activeFlowCategory, setActiveFlowCategory] = useState<'SINGLE NODE' | 'MULTI NODE'>('MULTI NODE');
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSmartConnectOpen, setIsSmartConnectOpen] = useState(false);

  // Dropdown states for Toolbar
  const [isNodeDropupOpen, setIsNodeDropupOpen] = useState(false);
  const [isToolDropupOpen, setIsToolDropupOpen] = useState(false);
  const [isIntegrationDropupOpen, setIsIntegrationDropupOpen] = useState(false);

  // 2. Logic Hooks
  const {
    nodes, edges, setNodes, setEdges, selectedNodeId, currentWorkflowId, currentWorkflowName, aiTokens, setAiTokens,
    onNodesChange, onEdgesChange, onConnect, handleSelectionChange, handleUpdateNode, handleDeleteNode, spawnNode
  } = useWorkflowState(screenToFlowPosition);

  const {
    user, isSupabaseConnected, supabaseProjectId, isConfigured, isNeuralAuthActive: isNeuralAuthPersisted,
    retryTrigger, setRetryTrigger, setIsSupabaseConnected, setIsConfigured
  } = useAuthSync();

  const { dynamicMCPServers, isFetchingMCP, foundryNodes, flowFeed } = useRegistry(activeHubVariant);

  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisioningLogs, setProvisioningLogs] = useState<string[]>([]);

  const { handleAuthorize, handleProvisionInfrastructure, handleInfrastructureReset } = useInfrastructure(
    user, setIsProvisioning, setProvisioningLogs, setNotification, setIsConfigured, setIsSmartConnectOpen, setIsSupabaseConnected
  );

  const {
    masterHandshakeStatus, setMasterHandshakeStatus, isMasterHandshakeOpen, setIsMasterHandshakeOpen,
    isNeuralAuthActive, setIsNeuralAuthActive, handleMasterAuth
  } = useMasterHandshake(user, supabaseProjectId, setNotification);

  // 3. Derived State
  const graphContext = useMemo(() => JSON.stringify({ nodes, edges }), [nodes, edges]);
  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId) || null, [nodes, selectedNodeId]);

  // 4. Local UI Handlers
  const handleSpawn = useCallback((config: any, isFlow = false) => {
    spawnNode(config, isFlow, setIsConfigModalOpen, setActiveConfigNodeId);
  }, [spawnNode]);

  // 5. Global Notification Supervisor
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // 6. External Event Listeners (Sidebar Sync)
  useEffect(() => {
    const handleNew = () => { setNodes([]); setEdges([]); };
    const handleLoad = (e: any) => {
      const item = e.detail;
      if (item) { setNodes(item.nodes || []); setEdges(item.edges || []); }
    };
    window.addEventListener('TRYLIATE_NEW_WORKFLOW', handleNew);
    window.addEventListener('TRYLIATE_LOAD_WORKFLOW', handleLoad);
    return () => {
      window.removeEventListener('TRYLIATE_NEW_WORKFLOW', handleNew);
      window.removeEventListener('TRYLIATE_LOAD_WORKFLOW', handleLoad);
    };
  }, [setNodes, setEdges]);

  // 7. Post-Auth Handlers
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === 'TRYLIATE_AUTH_SUCCESS') {
        setNotification({ type: 'success', message: 'Infrastructure Linked Successfully!' });
        setRetryTrigger(prev => prev + 1);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setRetryTrigger]);

  const isBlurringOverlayOpen = !!activeOverlay || isMasterHandshakeOpen || isSmartConnectOpen || !!activeEdgeId;

  return (
    <div style={{ width: '100%', height: '100%', background: 'transparent', overflow: 'hidden', position: 'relative' }}>

      <div style={{
        position: 'absolute',
        inset: 0,
        filter: isBlurringOverlayOpen ? 'blur(20px)' : 'none',
        transition: 'filter 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isBlurringOverlayOpen ? 'none' : 'auto',
        zIndex: 1
      }}>
        <Toolbar
          isNodeDropupOpen={isNodeDropupOpen}
          setIsNodeDropupOpen={setIsNodeDropupOpen}
          isToolDropupOpen={isToolDropupOpen}
          setIsToolDropupOpen={setIsToolDropupOpen}
          isIntegrationDropupOpen={isIntegrationDropupOpen}
          setIsIntegrationDropupOpen={setIsIntegrationDropupOpen}
          isSupabaseConnected={isSupabaseConnected}
          supabaseOrgId={null}
          onToggleConnection={() => {
            if (isSupabaseConnected) {
              handleInfrastructureReset();
            } else {
              handleAuthorize();
            }
          }}
          onOpenOverlay={(cat, sub) => setActiveOverlay({ category: cat, subType: sub })}
          onRunTest={() => {
            setRunStatus('running');
            setExecutionLogs([]);
            setIsExecuting(true);

            // Step-by-step log simulation
            const logs = [
              "🚀 Initializing Neural Core...",
              "🧠 Processing Graph Context...",
              "📡 Handshaking with MCP Servers...",
              "✅ Authentication Verified.",
              "🚀 Executing Workflow Nodes...",
              "🧠 Aggregating Results...",
              "✅ Neural Flow Complete."
            ];

            logs.forEach((log, i) => {
              setTimeout(() => {
                setExecutionLogs(prev => [...prev, log]);
                if (i === logs.length - 1) {
                  setIsExecuting(false);
                  setRunStatus('success');
                  setTimeout(() => setRunStatus('idle'), 2000);
                }
              }, (i + 1) * 600);
            });
          }}
          onTriggerAI={() => setIsAIPanelOpen(true)}
          isProvisioning={isProvisioning}
          isConfigured={isConfigured}
          provisioningLogs={provisioningLogs}
          onProvision={handleProvisionInfrastructure}
          onReset={handleInfrastructureReset}
          isNeuralAuthActive={isNeuralAuthActive}
          onOpenOneClickAuth={handleMasterAuth}
          runStatus={runStatus}
          executionLogs={executionLogs}
          isExecuting={isExecuting}
        />

        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={handleSelectionChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={{ type: 'custom-edge', style: { stroke: '#fff', strokeWidth: 2 } }}
            connectionLineStyle={{ stroke: '#444', strokeWidth: 2, strokeDasharray: '5,5' }}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
            fitViewOptions={{ padding: 0.4 }}
            maxZoom={1.2}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#444" />
          </ReactFlow>

          {notification && (
            <div style={{
              position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', color: '#000',
              padding: '4px 10px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              display: 'flex', alignItems: 'center', gap: '6px', zIndex: 10000,
              animation: 'slideUpHUD 0.3s cubic-bezier(0.16, 1, 0.3, 1)', border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ width: '16px', height: '16px', background: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={8} color="#fff" strokeWidth={5} />
              </div>
              <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{notification.message}</span>
            </div>
          )}
        </div>
      </div>

      <NodePanel
        selectedNode={selectedNode}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateNode={handleUpdateNode}
        onDeleteNode={handleDeleteNode}
      />

      <MCPConfigModal
        node={nodes.find(n => n.id === activeConfigNodeId) || null}
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={(id, config) => handleUpdateNode(id, { config })}
      />

      <WorkflowOverlay
        isOpen={!!activeOverlay}
        onClose={() => setActiveOverlay(null)}
        activeOverlay={activeOverlay}
        activeFoundryCategory={activeFoundryCategory}
        setActiveFoundryCategory={setActiveFoundryCategory}
        foundryNodes={foundryNodes}
        activeAISidebarNode={activeAISidebarNode}
        setActiveAISidebarNode={setActiveAISidebarNode}
        isViewAll={isViewAll}
        setIsViewAll={setIsViewAll}
        handleSpawnNode={handleSpawn}
        dynamicMCPServers={dynamicMCPServers}
        activeHubCategory={activeHubCategory}
        setActiveHubCategory={setActiveHubCategory}
        flowFeed={flowFeed}
        activeFlowCategory={activeFlowCategory}
        setActiveFlowCategory={setActiveFlowCategory}
        runStatus={runStatus}
        graphContext={graphContext}
        executionLogs={executionLogs}
        isExecuting={isExecuting}
        aiTokens={aiTokens}
        setAiTokens={setAiTokens}
        user={user}
        nodes={nodes}
        setNodes={setNodes}
        setEdges={setEdges}
      />

      <AIPanel
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        graphContext={graphContext}
        executionLogs={executionLogs}
        isExecuting={isExecuting}
        aiTokens={aiTokens}
        setAiTokens={setAiTokens}
        user={user}
      />
    </div>
  );
};

export const BuildWorkflow = () => (
  <ReactFlowProvider>
    <EdgeConfigProvider>
      <BuildWorkflowInner />
    </EdgeConfigProvider>
  </ReactFlowProvider>
);
