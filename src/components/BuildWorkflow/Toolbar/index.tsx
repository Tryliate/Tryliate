"use client";

import React, { useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Capsule, CapsuleItem } from '../../ui/Capsule';
import { Plus, Database, LayoutTemplate, ChevronUp } from 'lucide-react';
import { Tooltip } from '../../ui/Tooltip';

// Modular Sub-components (Sub-folder structure)
import { AddNode } from './AddNode';
import { Integration } from './Integration';
import { MCPTools } from './MCPTools';
import { AskTrymate } from './AskTrymate';
import { RunOnce } from './RunOnce';
import { SystemLogs } from './SystemLogs';
import { Schedule } from './Schedule';
import { CanvasControls } from './CanvasControls';
import { SaveWorkflow } from './SaveWorkflow';

interface ToolbarProps {
  isNodeDropupOpen: boolean;
  setIsNodeDropupOpen: (open: boolean) => void;
  isToolDropupOpen: boolean;
  setIsToolDropupOpen: (open: boolean) => void;
  isIntegrationDropupOpen: boolean;
  setIsIntegrationDropupOpen: (open: boolean) => void;
  isSupabaseConnected: boolean;
  supabaseOrgId: string | null;
  onToggleConnection: () => void;
  onOpenOverlay: (category: string, subType: string) => void;
  onRunTest?: () => void;
  onBuildServer?: () => void;
  onTriggerAI?: () => void;
  isProvisioning: boolean;
  isConfigured: boolean;
  provisioningLogs: string[];
  onProvision: () => void;
  onReset: () => void;
  isEngineConnected?: boolean;
  isEngineProvisioning?: boolean;
  engineProvisioningLogs?: string[];
  onProvisionEngine?: () => void;
  stats?: {
    nodes: number;
    edges: number;
  };
  runStatus?: 'idle' | 'running' | 'success';
  isNeuralAuthActive?: boolean;
  onOpenOneClickAuth?: () => void;
  executionLogs?: string[];
  isExecuting?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  isNodeDropupOpen,
  setIsNodeDropupOpen,
  isToolDropupOpen,
  setIsToolDropupOpen,
  isIntegrationDropupOpen,
  setIsIntegrationDropupOpen,
  isSupabaseConnected,
  onToggleConnection,
  onOpenOverlay,
  onRunTest,
  onTriggerAI,
  isProvisioning,
  isConfigured,
  provisioningLogs,
  onProvision,
  onReset,
  onProvisionEngine = () => { },
  onOpenOneClickAuth = () => { },
  isEngineConnected = false,
  isEngineProvisioning = false,
  stats = { nodes: 0, edges: 0 },
  runStatus = 'idle',
  isNeuralAuthActive = false,
  executionLogs = [],
  isExecuting = false
}) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const [isLogsDropupOpen, setIsLogsDropupOpen] = useState(false);
  const [isScheduleDropupOpen, setIsScheduleDropupOpen] = useState(false);

  const closeOthers = () => {
    setIsNodeDropupOpen(false);
    setIsToolDropupOpen(false);
    setIsIntegrationDropupOpen(false);
    setIsLogsDropupOpen(false);
    setIsScheduleDropupOpen(false);
  };

  return (
    <Capsule style={{
      position: 'absolute',
      bottom: '32px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      padding: '4px',
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(10px)'
    }}>
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .dropup-item:hover { background: rgba(255,255,255,0.03); }
      `}</style>

      {/* 1. Core Tools Capsule (Grouped Hardware Look) */}
      <Capsule variant="secondary" style={{
        padding: '2px',
        gap: '2px',
        border: '1px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        background: '#0a0a0a'
      }}>
        {/* Add Node */}
        <Tooltip content="Add Node" shortcutIcon={Plus} side="bottom" disabled={isNodeDropupOpen}>
          <div>
            <AddNode
              isOpen={isNodeDropupOpen}
              setIsOpen={setIsNodeDropupOpen}
              onOpenOverlay={onOpenOverlay}
              closeOthers={closeOthers}
              noCapsule
            />
          </div>
        </Tooltip>

        <div style={{ width: '1px', height: '16px', background: '#222' }} />

        {/* Integration */}
        <Tooltip content="Integrations" shortcutIcon={Database} side="bottom" disabled={isIntegrationDropupOpen}>
          <div>
            <Integration
              isOpen={isIntegrationDropupOpen}
              setIsOpen={setIsIntegrationDropupOpen}
              isSupabaseConnected={isSupabaseConnected}
              onToggleConnection={onToggleConnection}
              isProvisioning={isProvisioning}
              isConfigured={isConfigured}
              provisioningLogs={provisioningLogs}
              onProvision={onProvision}
              onReset={onReset}
              isEngineConnected={isEngineConnected}
              isEngineProvisioning={isEngineProvisioning}
              onProvisionEngine={onProvisionEngine}
              onOpenOneClickAuth={onOpenOneClickAuth}
              isNeuralAuthActive={isNeuralAuthActive}
              closeOthers={closeOthers}
              noCapsule
            />
          </div>
        </Tooltip>

        <div style={{ width: '1px', height: '16px', background: '#222' }} />

        {/* MCP Tools */}
        <Tooltip content="MCP Marketplace" shortcutIcon={LayoutTemplate} side="bottom" disabled={isToolDropupOpen}>
          <div>
            <MCPTools
              isOpen={isToolDropupOpen}
              setIsOpen={setIsToolDropupOpen}
              onOpenOverlay={onOpenOverlay}
              closeOthers={closeOthers}
              noCapsule
            />
          </div>
        </Tooltip>
      </Capsule>

      <div style={{ width: '1px', height: '20px', background: '#222', margin: '0 8px' }} />

      {/* Secondary Controls Group */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
        <AskTrymate onTriggerAI={onTriggerAI} />

        <div style={{ width: '1px', height: '20px', background: '#222', margin: '0 4px' }} />

        <SaveWorkflow />

        <div style={{ width: '1px', height: '20px', background: '#222', margin: '0 4px' }} />

        <RunOnce onRunTest={onRunTest} />

        <SystemLogs
          isOpen={isLogsDropupOpen}
          setIsOpen={setIsLogsDropupOpen}
          stats={stats}
          executionLogs={executionLogs}
          isExecuting={isExecuting}
        />

        <div style={{ width: '1px', height: '20px', background: '#222', margin: '0 4px' }} />

        <Schedule
          isOpen={isScheduleDropupOpen}
          setIsOpen={setIsScheduleDropupOpen}
          runStatus={runStatus}
        />
      </div>

      <div style={{ width: '1px', height: '20px', background: '#222', margin: '0 8px' }} />

      {/* Canvas Controls */}
      <CanvasControls
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        fitView={fitView}
      />
    </Capsule>
  );
};
