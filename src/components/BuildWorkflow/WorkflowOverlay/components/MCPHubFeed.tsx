"use client";

import React from 'react';
import { WorkflowNode } from '../../WorkflowNode';

interface MCPHubFeedProps {
  dynamicMCPServers: any[];
  activeHubCategory: string | null;
  isViewAll: boolean;
  setIsViewAll: (v: boolean) => void;
  activeAISidebarNode: any;
  setActiveAISidebarNode: (v: any) => void;
  handleSpawnNode: (config: any, isFlow?: boolean) => void;
}

export const MCPHubFeed = ({
  dynamicMCPServers,
  activeHubCategory,
  isViewAll,
  setIsViewAll,
  activeAISidebarNode,
  setActiveAISidebarNode,
  handleSpawnNode
}: MCPHubFeedProps) => {
  const groups: Record<string, any[]> = {};
  const nodesToRender = dynamicMCPServers.filter(s => {
    if (activeHubCategory === 'official' || activeHubCategory === 'reference') return s.category === activeHubCategory;
    return true;
  });

  nodesToRender.forEach(node => {
    const key = node.meta?.source || 'Community';
    if (!groups[key]) groups[key] = [];
    groups[key].push(node);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {Object.keys(groups).map(subCat => {
        const subNodes = groups[subCat];
        if (subNodes.length === 0) return null;
        return (
          <div key={subCat} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #111', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '4px', height: '16px', background: '#fff', borderRadius: '4px' }} />
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{subCat}</span>
                <span style={{ color: '#333', fontSize: '10px', fontWeight: 800 }}>{subNodes.length} MODULES</span>
              </div>
              {!isViewAll && subNodes.length > 3 && (
                <button
                  onClick={() => setIsViewAll(true)}
                  style={{ background: 'none', border: 'none', color: '#666', fontSize: '10px', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                >
                  VIEW ALL
                </button>
              )}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: activeAISidebarNode ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap: '16px'
            }}>
              {(isViewAll ? subNodes : subNodes.slice(0, 3)).map((item, idx) => (
                <WorkflowNode
                  key={idx}
                  data={item}
                  isPreview={true}
                  onAdd={handleSpawnNode}
                  onAsk={(data) => setActiveAISidebarNode(data)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
