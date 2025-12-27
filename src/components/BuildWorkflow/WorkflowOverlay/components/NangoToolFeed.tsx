"use client";

import React from 'react';
import { WorkflowNode } from '../../WorkflowNode';
import { NangoIntegration } from '../../../../data/nango-registry';

interface NangoToolFeedProps {
  integrations: NangoIntegration[];
  activeCategory: string | null;
  isViewAll: boolean;
  setIsViewAll: (v: boolean) => void;
  activeAISidebarNode: any;
  setActiveAISidebarNode: (v: any) => void;
  handleSpawnNode: (config: any, isFlow?: boolean) => void;
}

export const NangoToolFeed = ({
  integrations,
  activeCategory,
  isViewAll,
  setIsViewAll,
  activeAISidebarNode,
  setActiveAISidebarNode,
  handleSpawnNode
}: NangoToolFeedProps) => {
  const groups: Record<string, NangoIntegration[]> = {};
  
  const filtered = integrations.filter(it => {
    if (!activeCategory || activeCategory === 'ALL MODELS') return true;
    return it.categories.includes(activeCategory);
  });

  filtered.forEach(it => {
    const key = it.categories[0] || 'Uncategorized';
    if (!groups[key]) groups[key] = [];
    groups[key].push(it);
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
                <span style={{ color: '#333', fontSize: '10px', fontWeight: 800 }}>{subNodes.length} PLUGINS</span>
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
                  data={{
                    label: item.name,
                    description: item.description,
                    type: 'tool',
                    category: subCat,
                    meta: {
                      logo: item.icon,
                      auth_mode: item.auth_mode,
                      is_nango: true
                    }
                  }}
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
