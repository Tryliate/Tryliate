"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Node } from '@xyflow/react';
import { X, ChevronDown, Check, Trash2, Sparkles, Server, Box, Database, Shield, Zap } from 'lucide-react';

interface ProtocolNodeData extends Record<string, any> {
  label: string;
  type: string;
  meta: Record<string, string>;
  onEdit?: () => void;
}

interface NodePanelProps {
  selectedNode: Node<ProtocolNodeData> | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNode: (id: string, data: Partial<ProtocolNodeData>) => void;
  onDeleteNode: (id: string) => void;
}

export const NodePanel: React.FC<NodePanelProps> = ({
  selectedNode,
  isOpen,
  onClose,
  onUpdateNode,
  onDeleteNode
}) => {
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (name: keyof ProtocolNodeData, value: string) => {
    if (!selectedNode) return;
    onUpdateNode(selectedNode.id, { ...selectedNode.data, [name]: value });
  };

  const handleMetaChange = (key: string, value: string) => {
    if (!selectedNode) return;
    const newMeta = { ...(selectedNode.data.meta || {}), [key]: value };
    onUpdateNode(selectedNode.id, { ...selectedNode.data, meta: newMeta });
  };

  const nodeTypes = [
    { id: 'host', label: 'Host', icon: <Server size={14} /> },
    { id: 'tool', label: 'Tool', icon: <Box size={14} /> },
    { id: 'res', label: 'Resource', icon: <Database size={14} /> }
  ];

  const currentType = selectedNode
    ? (nodeTypes.find(t => t.id === selectedNode.data.type) || nodeTypes[0])
    : nodeTypes[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as any)) {
        setIsTypeOpen(false);
      }
    };
    if (isTypeOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isTypeOpen]);

  if (!selectedNode || !isOpen) return null;

  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease'
      }} />

      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '900px', height: '600px', background: 'rgba(5,5,5,0.98)', border: '1px solid #1a1a1a',
        borderRadius: '40px', overflow: 'hidden', zIndex: 1001, color: '#fff',
        fontFamily: 'Inter, sans-serif', animation: 'workshopIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 40px 120px rgba(0,0,0,0.9)'
      }}>
        {/* Header Strip */}
        <div style={{
          padding: '24px 40px', borderBottom: '1px solid #161616', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              padding: '6px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Sparkles size={14} />
              <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em' }}>NODE CONFIGURATION</span>
            </div>
            <span style={{ color: '#444', fontSize: '12px' }}>/</span>
            <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>{selectedNode.data.label}</span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.3)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content Area - 70/30 Split */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Main Config Area (70%) */}
          <div style={{ flex: 7, padding: '40px', overflowY: 'auto', borderRight: '1px solid #161616' }} className="custom-scroll">
            <section style={{ marginBottom: '40px' }}>
              <h4 style={{ fontSize: '10px', color: '#444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>Primary Identification</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', color: '#666', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Active Label</label>
                  <input
                    value={selectedNode.data.label}
                    onChange={(e) => handleChange('label', e.target.value)}
                    style={{
                      width: '100%', background: '#0a0a0a', border: '1px solid #1a1a1a',
                      borderRadius: '16px', padding: '16px 20px', color: '#fff', fontSize: '14px',
                      outline: 'none', transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#333'}
                    onBlur={(e) => e.target.style.borderColor = '#1a1a1a'}
                  />
                </div>

                <div style={{ position: 'relative' }} ref={dropdownRef}>
                  <label style={{ fontSize: '11px', color: '#666', marginBottom: '8px', display: 'block', fontWeight: 600 }}>MCP Architecture Type</label>
                  <div
                    onClick={() => setIsTypeOpen(!isTypeOpen)}
                    style={{
                      width: '100%', background: '#0a0a0a', border: '1px solid #1a1a1a',
                      borderRadius: '16px', padding: '16px 20px', color: '#fff', fontSize: '14px',
                      cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#444' }}>{currentType.icon}</span>
                      <span>{currentType.label}</span>
                    </div>
                    <ChevronDown size={16} color="#444" style={{ transform: isTypeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>

                  {isTypeOpen && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                      background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '16px',
                      padding: '8px', zIndex: 110, boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
                    }}>
                      {nodeTypes.map((type) => (
                        <div
                          key={type.id}
                          onClick={() => { handleChange('type', type.id); setIsTypeOpen(false); }}
                          style={{
                            padding: '12px 16px', borderRadius: '12px', fontSize: '13px',
                            cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', color: type.id === selectedNode.data.type ? '#fff' : '#666',
                            background: type.id === selectedNode.data.type ? '#1a1a1a' : 'transparent'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {type.icon}
                            <span>{type.label}</span>
                          </div>
                          {type.id === selectedNode.data.type && <Check size={14} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h4 style={{ fontSize: '10px', color: '#444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>Deep Configuration (Metadata)</h4>
              <div style={{
                background: 'rgba(255,255,255,0.01)', borderRadius: '24px', padding: '32px',
                border: '1px solid #161616', display: 'flex', flexDirection: 'column', gap: '20px'
              }}>
                {Object.entries(selectedNode.data.meta || {}).map(([key, value]) => (
                  <div key={key} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '24px' }}>
                    <span style={{ fontSize: '11px', color: '#333', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{key}</span>
                    <input
                      value={value as string}
                      onChange={(e) => handleMetaChange(key, e.target.value)}
                      style={{
                        background: '#050505', border: '1px solid #161616', borderRadius: '12px',
                        padding: '12px 20px', color: '#888', fontSize: '13px', outline: 'none'
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Blueprint Sidebar (30%) */}
          <div style={{ flex: 3, background: 'rgba(255,255,255,0.01)', padding: '40px' }}>
            <h4 style={{ fontSize: '10px', color: '#444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '32px' }}>Blueprint Summary</h4>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{
                width: '100px', height: '100px', borderRadius: '24px', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                border: '1px solid #1a1a1a', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}>
                <Box size={40} color="#000" />
              </div>
              <h5 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>{selectedNode.data.label}</h5>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <div style={{
                  padding: '4px 10px', background: '#111', borderRadius: '20px', border: '1px solid #222',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>MCP v1.0</span>
                </div>
                <div style={{
                  padding: '4px 10px', background: '#111', borderRadius: '20px', border: '1px solid #222',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <Shield size={10} color="#444" />
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>Verified</span>
                </div>
              </div>
            </div>

            <div style={{ height: '1px', background: '#161616', margin: '32px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={{
                width: '100%', height: '48px', background: '#fff', color: '#000',
                borderRadius: '16px', fontSize: '13px', fontWeight: 900, border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'not-allowed', opacity: 0.5
              }}>
                <Zap size={14} />
                RUN TEST
              </button>

              <button
                onClick={() => {
                  if (confirm('Permanently discard this protocol node?')) {
                    onDeleteNode(selectedNode.id);
                    onClose();
                  }
                }}
                style={{
                  width: '100%', height: '48px', background: 'transparent', color: '#444',
                  borderRadius: '16px', fontSize: '11px', fontWeight: 800, border: '1px solid #161616',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer'
                }}
              >
                <Trash2 size={12} />
                DISCARD NODE
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes workshopIn { 
            from { 
              opacity: 0; 
              transform: translate(-50%, -48%) scale(0.96); 
            } 
            to { 
              opacity: 1; 
              transform: translate(-50%, -50%) scale(1); 
            } 
          }
          .custom-scroll::-webkit-scrollbar { width: 4px; }
          .custom-scroll::-webkit-scrollbar-track { background: transparent; }
          .custom-scroll::-webkit-scrollbar-thumb { background: #222; borderRadius: 4px; }
        `}</style>
      </div>
    </>
  );
};
