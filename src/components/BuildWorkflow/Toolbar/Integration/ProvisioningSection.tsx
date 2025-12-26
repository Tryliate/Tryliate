import React from 'react';
import { Database, RefreshCw, Box, MousePointer2, Search, Check, Zap, Minus } from 'lucide-react';
import { AIPanelMini } from './AIPanelMini';

interface ProvisioningSectionProps {
  isConfigured: boolean;
  isProvisioning: boolean;
  provisioningLogs: string[];
  onProvision: () => void;
  onReset: () => void;
}

export const ProvisioningSection: React.FC<ProvisioningSectionProps> = ({
  isConfigured,
  isProvisioning,
  provisioningLogs,
  onProvision,
  onReset
}) => {
  return (
    <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
      {isConfigured ? (
        <div style={{ padding: '8px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,0.8)' }} />
              MCP ACTIVE
            </span>
            <span style={{ fontSize: '8px', color: '#555', fontFamily: 'monospace' }}>BRIDGE READY</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Are you sure you want to disconnect/reset Supabase MCP? This action is irreversible.')) {
                if (onReset) onReset();
              }
            }}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              padding: '6px',
              borderRadius: '6px',
              fontSize: '9px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#fff';
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            }}
          >
            Reset Infrastructure
          </button>

          <AIPanelMini
            onAction={(action) => {
              if (action === 'RESET ENGINE') onReset();
              // Other actions can be wired to existing platform logic
            }}
          />
        </div>
      ) : (
        <div>
          {!isProvisioning && (
            <>
              <div style={{ marginBottom: '6px', fontSize: '9px', color: '#444', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Storage Linkage
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isProvisioning && onProvision) onProvision();
                }}
                style={{
                  width: '100%',
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  letterSpacing: '0.02em'
                }}
              >
                <Database size={10} />
                <span>CONNECT SUPABASE MCP</span>
              </button>
            </>
          )}

          {(isProvisioning || provisioningLogs.length > 0) && (
            <div className="custom-scroll"
              ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}
              style={{
                marginTop: isProvisioning ? '0px' : '8px',
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '12px',
                height: '140px',
                overflowY: 'auto',
                fontSize: '9px',
                fontFamily: '"SF Mono", "Fira Code", monospace',
                color: '#888',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}>
              <style>{`.custom-scroll::-webkit-scrollbar { display: none; }`}</style>
              <div style={{
                color: '#fff',
                fontSize: '8px',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '6px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                alignItems: 'center',
                fontWeight: 900
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={10} className={isProvisioning ? "spin-fast" : ""} color="#fff" />
                  <span>{isProvisioning ? 'NEURAL BRIDGE INITIALIZING' : 'INTELLIGENCE STREAM'}</span>
                </div>
                <span style={{ opacity: 0.3 }}>v1.1.1</span>
              </div>
              {provisioningLogs.map((log, i) => {
                const isError = log.includes('Error') || log.includes('Failed');
                const isSuccess = log.includes('Success') || log.includes('Complete') || log.includes('Ready');

                return (
                  <div key={i} style={{
                    wordBreak: 'break-word',
                    lineHeight: '1.4',
                    opacity: 0.8,
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'flex-start'
                  }}>
                    <span style={{
                      color: isError ? '#ff4444' : (isSuccess ? '#fff' : '#888'),
                      fontWeight: (isSuccess || isError) ? 900 : 500
                    }}>
                      {log.replace(/🚀|🤖|✅|🔐|⚠️|✨|🛡️|💾|💉|🟢|🎉|❌|ℹ️|🔑|🏗️/g, '').trim()}
                    </span>
                  </div>
                );
              })}
              {isProvisioning && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#fff',
                  fontSize: '8px',
                  fontWeight: 900,
                  marginTop: '4px',
                  opacity: 0.5
                }}>
                  <RefreshCw size={8} className="spin" />
                  ANALYZING ARCHITECTURE...
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 2s linear infinite; }
        @keyframes spin-fast { 100% { transform: rotate(360deg); } }
        .spin-fast { animation: spin-fast 0.8s linear infinite; }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
};
