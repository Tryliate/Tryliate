import React, { useState } from 'react';
import { Shield, Link, Database, Terminal, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { SupabaseSection } from '../../Toolbar/Integration/SupabaseSection';

interface AuthManagerProps {
  isSupabaseConnected: boolean;
  isNeuralAuthActive: boolean;
  isConfigured: boolean;
  onOpenSmartConnect: () => void;
  onOpenMasterHandshake: () => void;
  onProvision: () => void;
  onReset: () => void;
}

export const AuthManager: React.FC<AuthManagerProps> = ({
  isSupabaseConnected,
  isNeuralAuthActive,
  isConfigured,
  onOpenSmartConnect,
  onOpenMasterHandshake,
  onProvision,
  onReset
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* 1. Supabase Cloud Connection (Level 1) */}
      <SupabaseSection
        isSupabaseConnected={isSupabaseConnected}
        onToggleConnection={isSupabaseConnected ? onReset : onOpenSmartConnect}
      />

      {/* 2. Neural Infrastructure (Level 2) - Neural Auth 2.1 */}
      <div
        onClick={isSupabaseConnected ? onOpenMasterHandshake : undefined}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'rgba(255,255,255,0.02)',
          padding: '12px',
          borderRadius: '16px',
          border: '1px solid #111',
          opacity: isSupabaseConnected ? 1 : 0.4,
          filter: isSupabaseConnected ? 'none' : 'grayscale(1)',
          pointerEvents: isSupabaseConnected ? 'auto' : 'none',
          position: 'relative',
          overflow: 'hidden',
          cursor: isSupabaseConnected ? 'pointer' : 'default',
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => {
          if (isSupabaseConnected) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          }
        }}
        onMouseLeave={e => {
          if (isSupabaseConnected) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
            e.currentTarget.style.borderColor = '#111';
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal size={16} color={isNeuralAuthActive ? '#fff' : '#444'} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800 }}>Neural Auth (2.1)</span>
                {isNeuralAuthActive && <span style={{ fontSize: '7px', background: '#fff', color: '#000', padding: '1px 4px', borderRadius: '4px', fontWeight: 900 }}>VERIFIED</span>}
              </div>
              <span style={{ color: isNeuralAuthActive ? '#fff' : '#444', fontSize: '8px', fontWeight: 800 }}>
                {isSupabaseConnected ? (isNeuralAuthActive ? 'ACTIVE PROTOCOL' : 'READY') : 'LOCKED'}
              </span>
            </div>
          </div>
          {isSupabaseConnected && (
            <button
              style={{
                background: '#fff',
                color: '#000',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '10px',
                fontSize: '9px',
                fontWeight: 900,
                cursor: 'pointer',
                zIndex: 1
              }}
            >
              {isNeuralAuthActive ? 'RE-SYNC' : 'CONNECT'}
            </button>
          )}
        </div>
        <div style={{ position: 'absolute', top: '4px', right: '8px', fontSize: '10px', fontWeight: 900, color: '#111', zIndex: 0, opacity: 0.5 }}>LEVEL 2</div>
      </div>

      {/* 3. Logic Engine (Level 3) - Tryliate Engine 3.0 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        background: 'rgba(255,255,255,0.02)',
        padding: '12px',
        borderRadius: '16px',
        border: '1px solid #111',
        opacity: isNeuralAuthActive ? 1 : 0.4,
        filter: isNeuralAuthActive ? 'none' : 'grayscale(1)',
        pointerEvents: isNeuralAuthActive ? 'auto' : 'none',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={16} color={isConfigured ? '#fff' : '#444'} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800 }}>Tryliate Engine (3.0)</span>
                {isConfigured && <span style={{ fontSize: '7px', background: '#fff', color: '#000', padding: '1px 4px', borderRadius: '4px', fontWeight: 900 }}>STABLE</span>}
              </div>
              <span style={{ color: isConfigured ? '#fff' : '#444', fontSize: '8px', fontWeight: 800 }}>
                {isNeuralAuthActive ? (isConfigured ? 'PROVISIONED' : 'IDLE') : 'LOCKED'}
              </span>
            </div>
          </div>
          {isNeuralAuthActive && (
            <button
              onClick={onProvision}
              style={{
                background: '#fff',
                color: '#000',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '10px',
                fontSize: '9px',
                fontWeight: 900,
                cursor: 'pointer',
                zIndex: 1
              }}
            >
              {isConfigured ? 'RE-CALIBRATE' : 'CALIBRATE'}
            </button>
          )}
        </div>
        <div style={{ position: 'absolute', top: '4px', right: '8px', fontSize: '10px', fontWeight: 900, color: '#111', zIndex: 0, opacity: 0.5 }}>LEVEL 3</div>
      </div>
    </div>
  );
};
