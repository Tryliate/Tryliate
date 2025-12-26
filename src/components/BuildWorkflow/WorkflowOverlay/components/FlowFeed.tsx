"use client";

import React from 'react';
import { Workflow, Sparkles, BadgeCheck } from 'lucide-react';

interface FlowFeedProps {
  flowFeed: any[];
  activeFlowCategory: string;
  runStatus: string;
  isViewAll: boolean;
  setIsViewAll: (v: boolean) => void;
  activeAISidebarNode: any;
  setActiveAISidebarNode: (v: any) => void;
  handleSpawnNode: (config: any, isFlow?: boolean) => void;
  appliedFlowId?: string | null;
}

export const FlowFeed = ({
  flowFeed,
  activeFlowCategory,
  runStatus,
  isViewAll,
  setIsViewAll,
  activeAISidebarNode,
  setActiveAISidebarNode,
  handleSpawnNode,
  appliedFlowId
}: FlowFeedProps) => {
  if (flowFeed.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', color: '#444', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Workflow size={24} style={{ opacity: 0.2 }} />
        </div>
        <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>
          {runStatus === 'running' ? 'SYNCHRONIZING FEED...' : 'NO FLOW FEED DETECTED'}
        </div>
      </div>
    );
  }

  const filteredFlows = flowFeed.filter(f => f.category === activeFlowCategory);
  const topologies = Array.from(new Set(filteredFlows.map(f => f.topology)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {topologies.map(topo => {
        const subNodes = filteredFlows.filter(f => f.topology === topo);
        return (
          <div key={topo} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #111', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '4px', height: '16px', background: '#fff', borderRadius: '4px' }} />
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{topo} TOPOLOGY</span>
                <span style={{ color: '#333', fontSize: '10px', fontWeight: 800 }}>{subNodes.length} TEMPLATES</span>
              </div>
              {!isViewAll && subNodes.length > 6 && (
                <button onClick={() => setIsViewAll(true)} style={{ background: 'none', border: 'none', color: '#666', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}>VIEW ALL</button>
              )}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: activeAISidebarNode ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap: '16px'
            }}>
              {(isViewAll ? subNodes : subNodes.slice(0, 6)).map((flow) => (
                <div key={flow.id} style={{
                  background: '#020202',
                  border: '1px solid #1a1a1a',
                  borderRadius: '24px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '180px'
                }}>
                  {/* Card Header Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '24px',
                    background: 'rgba(255,255,255,0.02)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    padding: '0 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Workflow size={10} style={{ color: 'rgba(255,255,255,0.4)' }} />
                      <span style={{ fontSize: '8px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        FLOW TEMPLATE
                      </span>
                    </div>
                    <span style={{ fontSize: '7px', fontWeight: 900, background: '#fff', color: '#000', padding: '1px 6px', borderRadius: '20px', letterSpacing: '0.05em' }}>
                      {flow.topology.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ marginTop: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '12px',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000',
                      border: '1px solid #222'
                    }}>
                      <Workflow size={20} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 900, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{flow.name}</div>
                      <div style={{ fontSize: '9px', color: '#444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {flow.nodes?.length || 0} NODES • {flow.edges?.length || 0} EDGES
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6', minHeight: '52px' }}>
                    {flow.description || 'Neural sequence template for distributed orchestration.'}
                  </div>

                  <div style={{
                    marginTop: 'auto',
                    display: 'flex',
                    background: '#111',
                    borderRadius: '24px',
                    border: '1px solid #222',
                    height: '40px',
                    padding: '2px',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveAISidebarNode({
                          label: flow.name,
                          category: 'FLOW',
                          sub_category: flow.topology,
                          type: 'tool',
                          meta: {},
                          description: flow.description
                        });
                      }}
                      style={{
                        flex: 1.2,
                        height: '100%',
                        borderRadius: '20px 0 0 20px',
                        background: 'transparent',
                        border: 'none',
                        color: '#888',
                        fontSize: '10px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        transition: 'all 0.2s',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = '#1a1a1a'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Sparkles size={12} /> Ask Trymate
                    </button>
                    <div style={{ width: '1px', background: '#222', margin: '8px 0' }} />
                    <button
                      onClick={(e) => {
                        if (appliedFlowId !== flow.id) {
                          e.stopPropagation();
                          handleSpawnNode(flow, true);
                        }
                      }}
                      disabled={appliedFlowId === flow.id}
                      style={{
                        flex: 0.8,
                        height: '100%',
                        borderRadius: '0 20px 20px 0',
                        background: appliedFlowId === flow.id ? '#1a1a1a' : '#fff',
                        border: 'none',
                        color: appliedFlowId === flow.id ? '#fff' : '#000',
                        fontSize: '11px',
                        fontWeight: 900,
                        cursor: appliedFlowId === flow.id ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        if (appliedFlowId !== flow.id) e.currentTarget.style.background = '#e0e0e0';
                      }}
                      onMouseLeave={(e) => {
                        if (appliedFlowId !== flow.id) e.currentTarget.style.background = '#fff';
                      }}
                    >
                      {appliedFlowId === flow.id ? (
                        <>
                          <BadgeCheck size={12} fill="#fff" color="#000" />
                          ADDED
                        </>
                      ) : 'USE FLOW'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
