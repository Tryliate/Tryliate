"use client";

import React from 'react';
import { X, Workflow, Sparkles } from 'lucide-react';

interface OverlayHeaderProps {
  activeOverlay: { category: string, subType: string } | null;
  activeFoundryCategory: string;
  setActiveFoundryCategory: (v: string) => void;
  activeHubCategory: string | null;
  setActiveHubCategory?: (v: string | null) => void;
  activeFlowCategory: string;
  setActiveFlowCategory?: (v: any) => void;
  onClose: () => void;
  notification?: string | null;
}

export const OverlayHeader = ({
  activeOverlay,
  activeFoundryCategory,
  setActiveFoundryCategory,
  activeHubCategory,
  setActiveHubCategory,
  activeFlowCategory,
  setActiveFlowCategory,
  onClose,
  notification
}: OverlayHeaderProps) => {
  if (!activeOverlay) return null;

  return (
    <div style={{
      padding: '20px 40px',
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '20px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000'
          }}>
            <Workflow size={20} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h1 style={{ color: '#fff', fontSize: '18px', fontWeight: 900, letterSpacing: '0.1em', margin: 0, textTransform: 'uppercase' }}>
                  {activeOverlay.category} <span style={{ color: '#444' }}>/</span> {activeOverlay.subType}
                </h1>

                {notification && (
                  <div style={{
                    background: 'rgba(255,255,255,0.08)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    animation: 'fadeIn 0.3s ease'
                  }}>
                    <Sparkles size={10} color="#fff" />
                    <span style={{ fontSize: '9px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                      {notification}
                    </span>
                  </div>
                )}
              </div>
              <p style={{ color: '#666', fontSize: '10px', fontWeight: 800, marginTop: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                NEURAL ASSET INVENTORY V1.1.1 • SYNC ACTIVE
              </p>
            </div>
          </div>
        </div>

        {/* Categories / Close */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Foundry / Node Feed Categories */}
          {(activeOverlay.subType === 'Foundry' || activeOverlay.subType === 'Node Feed') && (
            <div style={{ display: 'flex', alignItems: 'center', background: '#0a0a0a', borderRadius: '40px', padding: '4px', border: '1px solid #222', gap: '4px', height: '40px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666'
              }}>
                <Workflow size={14} />
              </div>
              {['AI CORE', 'DATA', 'LOGIC', 'AUTH', 'INFRA'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFoundryCategory(cat)}
                  style={{
                    padding: '0 16px',
                    height: '32px',
                    borderRadius: '20px',
                    background: activeFoundryCategory === cat ? '#fff' : 'transparent',
                    color: activeFoundryCategory === cat ? '#000' : '#666',
                    border: 'none',
                    fontSize: '10px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
              <div style={{ width: '1px', height: '16px', background: '#333', margin: '0 2px' }} />
              <CloseButton onClose={onClose} />
            </div>
          )}

          {/* MCP Hub Categories */}
          {activeOverlay.subType === 'MCP Hub' && setActiveHubCategory && (
            <div style={{ display: 'flex', alignItems: 'center', background: '#0a0a0a', borderRadius: '40px', padding: '4px', border: '1px solid #222', gap: '4px', height: '40px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666'
              }}>
                <Sparkles size={14} />
              </div>
              {['official', 'reference', 'community'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveHubCategory(activeHubCategory === cat ? null : cat)}
                  style={{
                    padding: '0 16px',
                    height: '32px',
                    borderRadius: '20px',
                    background: activeHubCategory === cat ? '#fff' : 'transparent',
                    color: activeHubCategory === cat ? '#000' : '#666',
                    border: 'none',
                    fontSize: '10px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
              <div style={{ width: '1px', height: '16px', background: '#333', margin: '0 2px' }} />
              <CloseButton onClose={onClose} />
            </div>
          )}

          {/* Nango Hub Categories */}
          {activeOverlay.subType === 'Nango Hub' && setActiveHubCategory && (
            <div style={{ display: 'flex', alignItems: 'center', background: '#0a0a0a', borderRadius: '40px', padding: '4px', border: '1px solid #222', gap: '4px', height: '40px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666'
              }}>
                <Sparkles size={14} />
              </div>
              {['CRM', 'Productivity', 'Communication', 'Development', 'Analytics', 'Payments'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveHubCategory(activeHubCategory === cat ? null : cat)}
                  style={{
                    padding: '0 16px',
                    height: '32px',
                    borderRadius: '20px',
                    background: activeHubCategory === cat ? '#fff' : 'transparent',
                    color: activeHubCategory === cat ? '#000' : '#666',
                    border: 'none',
                    fontSize: '10px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
              <div style={{ width: '1px', height: '16px', background: '#333', margin: '0 2px' }} />
              <CloseButton onClose={onClose} />
            </div>
          )}

          {/* Flow Categories */}
          {activeOverlay.category === 'FLOW' && setActiveFlowCategory && (
            <div style={{ display: 'flex', alignItems: 'center', background: '#0a0a0a', borderRadius: '40px', padding: '4px', border: '1px solid #222', gap: '4px', height: '40px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666'
              }}>
                <Workflow size={14} />
              </div>
              {['SINGLE NODE', 'MULTI NODE'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFlowCategory(cat)}
                  style={{
                    padding: '0 16px',
                    height: '32px',
                    borderRadius: '20px',
                    background: activeFlowCategory === cat ? '#fff' : 'transparent',
                    color: activeFlowCategory === cat ? '#000' : '#666',
                    border: 'none',
                    fontSize: '10px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
              <div style={{ width: '1px', height: '16px', background: '#333', margin: '0 2px' }} />
              <CloseButton onClose={onClose} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CloseButton = ({ onClose }: { onClose: () => void }) => (
  <button
    onClick={onClose}
    style={{
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'transparent',
      border: 'none',
      color: '#666',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#fff'; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#666'; }}
  >
    <X size={14} />
  </button>
);
