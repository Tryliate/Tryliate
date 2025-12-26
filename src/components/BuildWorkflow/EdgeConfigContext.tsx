import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EdgeConfigOverlay } from './EdgeConfigOverlay';

interface EdgeConfigContextType {
  openConfig: (edgeId: string) => void;
  closeConfig: () => void;
  activeEdgeId: string | null;
  runStatus: 'idle' | 'running' | 'success';
  setRunStatus: (status: 'idle' | 'running' | 'success') => void;
}

const EdgeConfigContext = createContext<EdgeConfigContextType | undefined>(undefined);

export const useEdgeConfig = () => {
  const context = useContext(EdgeConfigContext);
  if (!context) {
    throw new Error('useEdgeConfig must be used within an EdgeConfigProvider');
  }
  return context;
};

export const EdgeConfigProvider = ({ children }: { children: ReactNode }) => {
  const [activeEdgeId, setActiveEdgeId] = useState<string | null>(null);
  const [runStatus, setRunStatus] = useState<'idle' | 'running' | 'success'>('idle');

  const openConfig = (edgeId: string) => {
    setActiveEdgeId(edgeId);
  };

  const closeConfig = () => {
    setActiveEdgeId(null);
  };

  return (
    <EdgeConfigContext.Provider value={{ openConfig, closeConfig, activeEdgeId, runStatus, setRunStatus }}>
      {children}
      <EdgeConfigOverlay
        isOpen={!!activeEdgeId}
        edgeId={activeEdgeId}
        onClose={closeConfig}
      />
    </EdgeConfigContext.Provider>
  );
};
