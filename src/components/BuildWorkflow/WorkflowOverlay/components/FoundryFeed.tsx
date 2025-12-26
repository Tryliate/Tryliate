"use client";

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { WorkflowNode } from '../../WorkflowNode';

interface FoundryFeedProps {
  foundryNodes: any[];
  activeFoundryCategory: string;
  isViewAll: boolean;
  setIsViewAll: (v: boolean) => void;
  activeAISidebarNode: any;
  setActiveAISidebarNode: (v: any) => void;
  handleSpawnNode: (config: any, isFlow?: boolean) => void;
}

export const FoundryFeed = ({
  foundryNodes,
  activeFoundryCategory,
  isViewAll,
  setIsViewAll,
  activeAISidebarNode,
  setActiveAISidebarNode,
  handleSpawnNode
}: FoundryFeedProps) => {
  const filteredFoundry = foundryNodes.filter(n => n.category === activeFoundryCategory);
  const subCats = Array.from(new Set(filteredFoundry.map(n => n.sub_category)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {subCats.map(subCat => {
        const subNodes = filteredFoundry.filter(n => n.sub_category === subCat);
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
              {isViewAll && (
                <button
                  onClick={() => setIsViewAll(false)}
                  style={{ background: 'none', border: 'none', color: '#666', fontSize: '10px', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ArrowLeft size={10} /> BACK TO NORMAL
                </button>
              )}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: activeAISidebarNode ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap: '16px'
            }}>
              {(isViewAll ? subNodes : subNodes.slice(0, 3)).map((item) => (
                <WorkflowNode
                  key={item.id}
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
