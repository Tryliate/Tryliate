"use client";

import React, { useState } from 'react';
import { X, Zap, ArrowRight, ShieldCheck, Globe, Database, BadgeCheck } from 'lucide-react';

interface SmartConnectOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthorize: () => void;
}

export const SmartConnectOverlay: React.FC<SmartConnectOverlayProps> = ({ isOpen, onClose, onAuthorize }) => {
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
      background: 'rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(8px)',
      borderRadius: '40px'
    }} onClick={onClose}>
      <div
        style={{
          width: '420px',
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '32px',
          padding: '24px 32px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
        onClick={e => e.stopPropagation()}
      >
        // Header
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#fff',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
              marginBottom: '4px',
              padding: '6px'
            }}>
              <img
                src="https://img.logo.dev/supabase.com?token=pk_CZ_0opokQL-e57WMnULvMQ&format=png&theme=dark&retina=true"
                alt="Supabase"
                style={{ width: '100%', height: '100%', borderRadius: '4px' }}
              />
            </div>
            <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 900, letterSpacing: '-0.04em', margin: '4px 0 0 0', textTransform: 'uppercase' }}>
              Supabase Link
            </h2>
            <p style={{ color: '#666', fontSize: '11px', fontWeight: 800, margin: 0, lineHeight: 1.5, maxWidth: '320px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SECURELY HANDSHAKE WITH YOUR PRIVATE INFRASTRUCTURE USING PUBLISHABLE AND SECRET KEYS.
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
            onMouseEnter={e => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#444';
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            }}
          >
            <X size={14} strokeWidth={3} />
          </button>
        </div>

        {/* Benefits/Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { icon: <Database size={16} />, title: 'BYOI Isolation', desc: 'Secure Secret Key Management' },
            { icon: <Zap size={16} />, title: 'Realtime Neural Sync', desc: 'Encrypted Publishable Handshake' },
            { icon: <BadgeCheck size={16} />, title: 'Automated RLS Enforcer', desc: 'Identity-first Protocol' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ color: '#fff' }}>{item.icon}</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#fff', fontSize: '12px', fontWeight: 800 }}>{item.title}</span>
                <span style={{ color: '#444', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{ marginTop: '4px' }}>
          <button
            onClick={onAuthorize}
            style={{
              width: '100%',
              background: '#fff',
              color: '#000',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '24px',
              fontSize: '11px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            AUTHORIZE PROTOCOL <ArrowRight size={18} strokeWidth={3} />
          </button>
          <p style={{ color: '#222', fontSize: '9px', textAlign: 'center', marginTop: '20px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 900 }}>
            Official Supabase Smart Bridge • Tryliate Engine v1.2
          </p>
        </div>

      </div>
    </div>
  );
};
