"use client";

import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { AIPanel } from '../../AIPanel';

interface AIResearchPanelProps {
  activeAISidebarNode: any;
  setActiveAISidebarNode: (v: any) => void;
  graphContext: any;
  executionLogs: any[];
  isExecuting: boolean;
  aiTokens: number;
  setAiTokens: (v: number | ((prev: number) => number)) => void;
  user?: any;
}

export const AIResearchPanel = ({
  activeAISidebarNode,
  setActiveAISidebarNode,
  graphContext,
  executionLogs,
  isExecuting,
  aiTokens,
  setAiTokens,
  user
}: AIResearchPanelProps) => {
  if (!activeAISidebarNode) return null;

  return (
    <div style={{
      flex: 1,
      height: '100%',
      background: '#020202',
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      overflow: 'hidden',
      borderRadius: '0 48px 48px 0'
    }}>
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #161616',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#0a0a0a',
        minHeight: '56px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div style={{ width: '4px', height: '20px', background: '#fff', borderRadius: '4px' }} />
          <Sparkles size={18} style={{ color: '#fff' }} />
          <div>
            <h3 style={{ color: '#fff', fontSize: '13px', fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>AI INSIGHTS</h3>
            <p style={{ color: '#444', fontSize: '8px', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.02em', lineHeight: 1 }}>POWERED BY ANTHROPIC</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#161616',
            padding: '4px 6px',
            borderRadius: '24px',
            border: '1px solid #222'
          }}>
            <div
              onClick={() => setAiTokens(100)}
              style={{
                padding: '4px 10px',
                background: '#fff',
                borderRadius: '16px',
                color: '#000',
                fontSize: '9px',
                fontWeight: 900,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              TopUp
            </div>
            <div style={{
              padding: '0 8px',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Sparkles size={10} color="#666" />
              <span>{user ? aiTokens : 0}/100</span>
            </div>
            <div style={{ width: '1px', height: '12px', background: '#222', margin: '0 4px' }} />
            <button
              onClick={() => setActiveAISidebarNode(null)}
              aria-label="Close AI Insights"
              style={{
                padding: '4px',
                background: 'transparent',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#666'; }}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0' }} className="custom-scroll">
        <div style={{ marginTop: '16px', padding: '0 20px' }}>
          <AIPanel
            isOpen={true}
            isMinimal={true}
            onClose={() => setActiveAISidebarNode(null)}
            graphContext={graphContext}
            title={activeAISidebarNode.label}
            selectedNodeData={activeAISidebarNode}
            executionLogs={executionLogs}
            isExecuting={isExecuting}
            aiTokens={aiTokens}
            setAiTokens={setAiTokens}
          />
        </div>
      </div>
    </div>
  );
};
