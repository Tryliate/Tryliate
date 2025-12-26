"use client";

import React, { useState } from 'react';
import { X, Shield, Settings, Database, Server, Key, Zap, Check, Cloud, Box } from 'lucide-react';
import { Node } from '@xyflow/react';

interface MCPConfigModalProps {
  node: Node<any> | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, config: any) => void;
}

type ConfigTab = 'AUTHORIZATION' | 'INSTALLATION' | 'METADATA';

export const MCPConfigModal: React.FC<MCPConfigModalProps> = ({
  node,
  isOpen,
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<ConfigTab>('AUTHORIZATION');
  const [config, setConfig] = useState<any>(node?.data?.config || {
    authMode: 'CIMD', // Client ID Metadata Document (2025 Default)
    clientId: 'https://tryliate.com/mcp-client.json',
    authServer: '',
    resourceId: node?.data?.domain ? `https://${node.data.domain}` : '',
    scopes: 'openid, mcp:full_access',
    pkce: true,
    installMethod: 'npm'
  });

  if (!node || !isOpen) return null;

  const tabs = [
    { id: 'AUTHORIZATION', label: 'OAuth 2.1 standard', icon: Shield },
    { id: 'INSTALLATION', label: 'Deployment', icon: Server },
    { id: 'METADATA', label: 'Registry Info', icon: Database }
  ];

  const handleSave = () => {
    onSave(node.id, config);
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease'
      }} />

      {/* Modal Container - COMPACT VERSION */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '900px',
          height: '600px',
          background: 'rgba(5,5,5,0.95)',
          backdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid #1a1a1a',
          borderRadius: '32px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1001,
          overflow: 'hidden',
          color: '#fff',
          fontFamily: 'Inter, sans-serif',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
          animation: 'modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >

        {/* Header Strip - NOW CONSOLIDATED */}
        <div style={{
          padding: '10px 24px', // Refined padding
          borderBottom: '1px solid #111',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(to right, rgba(255,255,255,0.02), transparent)',
          minHeight: '60px' // Ensure stable height
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                flexShrink: 0
              }}>
                <Box size={16} color="#000" strokeWidth={2.5} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px', lineHeight: 1.2 }}>{node.data.label}</div>
                <div style={{ fontSize: '7px', color: '#444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px', lineHeight: 1 }}>CONFIG</div>
              </div>
            </div>

            {/* In-Header Tabs - Perfectly Centered */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '20px',
              border: '1px solid #111',
              height: '30px' // Fixed height for consistent alignment
            }}>
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ConfigTab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0 12px',
                    height: '24px', // Inner height to match container minus padding
                    borderRadius: '16px',
                    fontSize: '8px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: activeTab === tab.id ? 'rgba(255,255,255,0.04)' : 'transparent',
                    color: activeTab === tab.id ? '#fff' : '#444',
                    border: activeTab === tab.id ? '1px solid #222' : '1px solid transparent',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <tab.icon size={10} strokeWidth={activeTab === tab.id ? 2.5 : 2} color={activeTab === tab.id ? '#fff' : '#444'} />
                  {tab.label}
                </div>
              ))}
            </div>
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
              transition: 'all 0.2s',
              marginLeft: '12px'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>


        {/* Content Area */}
        <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }} className="custom-scroll">
          {activeTab === 'AUTHORIZATION' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.3s ease' }}>
              {/* Protocol Header Card */}
              <div style={{
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Shield size={16} color="#444" />
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: '#fff' }}>OAUTH 2.1 • 2025-11-25 REVISION</div>
                    <div style={{ fontSize: '9px', color: '#444', fontWeight: 600 }}>Authorization-at-Transport Layer (RFC 9728)</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ background: '#111', color: '#fff', fontSize: '8px', fontWeight: 900, padding: '4px 8px', borderRadius: '6px', border: '1px solid #222' }}>PKCE S256</div>
                  <div style={{ background: '#fff', color: '#000', fontSize: '8px', fontWeight: 900, padding: '4px 8px', borderRadius: '6px' }}>TLS 1.3</div>
                </div>
              </div>

              {/* Client ID Strategy */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '9px', fontWeight: 900, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Client Identification</label>
                  <div style={{ display: 'flex', gap: '4px', background: '#0a0a0a', padding: '2px', borderRadius: '8px', border: '1px solid #111' }}>
                    <button
                      onClick={() => setConfig({ ...config, authMode: 'CIMD' })}
                      style={{ padding: '3px 8px', borderRadius: '6px', border: 'none', background: config.authMode === 'CIMD' ? '#222' : 'transparent', color: config.authMode === 'CIMD' ? '#fff' : '#444', fontSize: '8px', fontWeight: 900, cursor: 'pointer' }}
                    >CIMD (URL)</button>
                    <button
                      onClick={() => setConfig({ ...config, authMode: 'STATIC' })}
                      style={{ padding: '3px 8px', borderRadius: '6px', border: 'none', background: config.authMode === 'STATIC' ? '#222' : 'transparent', color: config.authMode === 'STATIC' ? '#fff' : '#444', fontSize: '8px', fontWeight: 900, cursor: 'pointer' }}
                    >STATIC ID</button>
                  </div>
                </div>
                <input
                  placeholder={config.authMode === 'CIMD' ? "https://your-domain.com/mcp-id.json" : "client_id_..."}
                  value={config.clientId}
                  onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid #161616', borderRadius: '12px', padding: '10px 14px', color: '#fff', fontSize: '11px', outline: 'none', fontFamily: 'monospace' }}
                />
                <div style={{ fontSize: '8px', color: '#333', fontStyle: 'italic' }}>
                  {config.authMode === 'CIMD' ? "Agent will fetch this JSON to verify your identity. (RFC 7591)" : "Traditional pre-registered Client ID."}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '9px', fontWeight: 900, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'block' }}>Auth Server (Manual Fallback)</label>
                  <input
                    placeholder="https://auth.example.com"
                    value={config.authServer}
                    onChange={(e) => setConfig({ ...config, authServer: e.target.value })}
                    style={{ width: '100%', background: '#0a0a0a', border: '1px solid #161616', borderRadius: '12px', padding: '10px 14px', color: '#fff', fontSize: '11px', outline: 'none', fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '9px', fontWeight: 900, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'block' }}>Canonical Resource URI (RFC 8707)</label>
                  <input
                    placeholder="https://service.domain/mcp"
                    value={config.resourceId}
                    onChange={(e) => setConfig({ ...config, resourceId: e.target.value })}
                    style={{ width: '100%', background: '#0a0a0a', border: '1px solid #161616', borderRadius: '12px', padding: '10px 14px', color: '#fff', fontSize: '11px', outline: 'none', fontFamily: 'monospace' }}
                  />
                  <div style={{ fontSize: '8px', color: '#333', marginTop: '4px' }}>Passed as the "resource" parameter to prevent token misuse.</div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '9px', fontWeight: 900, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'block' }}>Permission Scopes</label>
                <input
                  placeholder="openid, mcp:read, mcp:write"
                  value={config.scopes}
                  onChange={(e) => setConfig({ ...config, scopes: e.target.value })}
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid #161616', borderRadius: '12px', padding: '10px 14px', color: '#fff', fontSize: '11px', outline: 'none' }}
                />
              </div>

              {/* 2025 Compliance Checklist */}
              <div style={{
                marginTop: '10px',
                padding: '12px',
                background: 'rgba(255,255,255,0.01)',
                borderRadius: '12px',
                border: '1px solid #111'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '8px', fontWeight: 900, color: '#333', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OAUTH 2.1 Handshake (401 Process)</div>
                  <div style={{ fontSize: '8px', color: '#555', cursor: 'help', borderBottom: '1px dotted #333' }}>Discovery: /.well-known/oauth-protected-resource</div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[
                    { label: 'CIMD', status: config.authMode === 'CIMD' ? 'ACTIVE' : 'OFF' },
                    { label: 'RFC 8707', status: config.resourceId ? 'BOUND' : 'PENDING' },
                    { label: 'PKCE', status: 'S256' }
                  ].map((req, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: req.status === 'OFF' ? '#333' : '#fff' }} />
                      <span style={{ fontSize: '8px', color: '#666', fontWeight: 700 }}>{req.label}:</span>
                      <span style={{ fontSize: '8px', color: req.status === 'OFF' ? '#333' : '#fff', fontWeight: 900 }}>{req.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'INSTALLATION' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {[
                  { id: 'npm', icon: Zap, label: 'NPM' },
                  { id: 'docker', icon: Cloud, label: 'DOCKER' },
                  { id: 'native', icon: Server, label: 'NATIVE' },
                  { id: 'cloud', icon: Zap, label: 'CLOUD' }
                ].map(method => (
                  <div
                    key={method.id}
                    onClick={() => setConfig({ ...config, installMethod: method.id })}
                    style={{
                      height: '80px',
                      background: '#0a0a0a',
                      border: '1px solid',
                      borderColor: config.installMethod === method.id ? '#333' : '#161616',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <method.icon size={18} color={config.installMethod === method.id ? '#fff' : '#222'} strokeWidth={2.5} />
                    <span style={{ fontSize: '10px', fontWeight: 900, color: config.installMethod === method.id ? '#fff' : '#444' }}>{method.label}</span>
                  </div>
                ))}
              </div>

              <div>
                <label style={{ fontSize: '9px', fontWeight: 900, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'block' }}>Install Command</label>
                <div style={{
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid #111',
                  borderRadius: '14px',
                  padding: '16px',
                  color: '#444',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  cursor: 'text',
                  fontWeight: 600
                }}>
                  {config.installMethod === 'npm' && `npx -y @mcp/server-${node.data.label.toLowerCase().replace(/\s+/g, '-')}`}
                  {config.installMethod === 'docker' && `docker pull mcp/${node.data.label.toLowerCase().replace(/\s+/g, '-')}`}
                  {config.installMethod === 'native' && `./bin/${node.data.label.toLowerCase().replace(/\s+/g, '-')}`}
                  {config.installMethod === 'cloud' && `Deployment via Engine`}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'METADATA' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', animation: 'fadeIn 0.3s ease' }}>
              {Object.entries(node.data.meta || {}).map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.01)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.02)'
                }}>
                  <span style={{ fontSize: '9px', fontWeight: 900, color: '#333', textTransform: 'uppercase' }}>{k}</span>
                  <div style={{ fontSize: '11px', color: '#666', fontWeight: 700 }}>{String(v)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div style={{
          padding: '12px 24px', // Compact padding
          background: 'rgba(255,255,255,0.005)',
          borderTop: '1px solid #111',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '24px',
              border: '1px solid #161616',
              background: '#0a0a0a',
              color: '#333',
              fontSize: '10px',
              fontWeight: 900,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.2s'
            }}
          >
            DISCARD
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '10px 20px',
              borderRadius: '24px',
              border: 'none',
              background: '#fff',
              color: '#000',
              fontSize: '10px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textTransform: 'uppercase',
            }}
          >
            SAVE CHANGES
            <Check size={14} strokeWidth={3} />
          </button>
        </div>

        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes modalSlideIn { 
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
          .custom-scroll::-webkit-scrollbar-thumb { background: #111; borderRadius: 4px; }
        `}</style>
      </div>
    </>
  );
};
