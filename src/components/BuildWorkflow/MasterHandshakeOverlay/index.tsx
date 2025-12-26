"use client";

import React from 'react';
import { X, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

interface MasterHandshakeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthorize: () => void;
  status?: 'idle' | 'generating' | 'redirecting' | 'error';
}

export const MasterHandshakeOverlay: React.FC<MasterHandshakeOverlayProps> = ({
  isOpen,
  onClose,
  onAuthorize,
  status = 'idle'
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(12px)',
      borderRadius: '40px'
    }} onClick={onClose}>
      <div
        style={{
          width: '420px',
          background: 'rgba(10, 10, 10, 0.98)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '32px',
          padding: '32px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              background: '#fff',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
              marginBottom: '4px'
            }}>
              <ShieldCheck size={24} color="#000" strokeWidth={2.5} />
            </div>
            <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 900, letterSpacing: '-0.04em', margin: '4px 0 0 0', textTransform: 'uppercase' }}>
              Master Handshake
            </h2>
            <p style={{ color: '#444', fontSize: '11px', fontWeight: 700, margin: 0, lineHeight: 1.5, maxWidth: '280px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PROVISION OAUTH 2.1 CREDENTIALS ACROSS THE ENTIRE NEURAL FABRIC (RFC 9728)
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#444',
              marginTop: '4px',
              transition: 'all 0.2s'
            }}
          >
            <X size={14} strokeWidth={3} />
          </button>
        </div>

        {/* Protocol Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #111', borderRadius: '20px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '9px', fontWeight: 900, color: '#333', textTransform: 'uppercase' }}>Discovery Path</span>
              <span style={{ fontSize: '9px', fontWeight: 900, color: '#fff' }}>/.well-known/oauth-prm</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1, height: '2px', background: '#111', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '90%', height: '100%', background: '#fff' }} />
              </div>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#fff' }}>90% SYNC</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ color: '#fff', opacity: 0.8 }}><ShieldCheck size={18} /></div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#fff', fontSize: '12px', fontWeight: 800 }}>OAuth 2.1 PKCE Force</span>
                <span style={{ color: '#444', fontSize: '9px', fontWeight: 600 }}>S256 CHALLENGE ACTIVE</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px' }}>
              <div style={{ color: '#fff', opacity: 0.8 }}><Globe size={18} /></div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#fff', fontSize: '12px', fontWeight: 800 }}>CIMD Dynamic Registry</span>
                <span style={{ color: '#444', fontSize: '9px', fontWeight: 600 }}>RFC 7591 COMPLIANT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{ marginTop: '8px' }}>
          <button
            onClick={onAuthorize}
            disabled={status !== 'idle' && status !== 'error'}
            style={{
              width: '100%',
              background: status === 'error' ? '#ff3b30' : '#fff',
              color: '#000',
              border: 'none',
              padding: '18px',
              borderRadius: '24px',
              fontSize: '14px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: (status !== 'idle' && status !== 'error') ? 'wait' : 'pointer',
              transition: 'all 0.2s',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              opacity: (status === 'generating' || status === 'redirecting') ? 0.7 : 1
            }}
            onMouseEnter={e => {
              if (status === 'idle' || status === 'error') {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {status === 'generating' && 'Generating Keys...'}
            {status === 'redirecting' && 'Redirecting...'}
            {status === 'error' && 'Protocol Error'}
            {status === 'idle' && <>AUTHORIZE ONE-CLICK <ArrowRight size={18} strokeWidth={3} /></>}
          </button>
          <p style={{ color: '#333', fontSize: '9px', textAlign: 'center', marginTop: '20px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 900 }}>
            Unified MCP Handshake Protocol • Tryliate v1.2
          </p>
        </div>
      </div>
    </div>
  );
};
