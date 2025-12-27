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

      {/* 2. Neural Infrastructure (Level 2) - Only shown if Supabase Cloud is connected */}
      {isSupabaseConnected && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'rgba(255,255,255,0.02)',
          padding: '12px',
          borderRadius: '16px',
          border: '1px solid #111'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Terminal size={16} color={isNeuralAuthActive ? '#fff' : '#444'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800 }}>Neural Handshake</span>
                <span style={{ color: isNeuralAuthActive ? '#fff' : '#444', fontSize: '8px', fontWeight: 800 }}>{isNeuralAuthActive ? 'ACTIVE' : 'READY'}</span>
              </div>
            </div>
            {!isNeuralAuthActive && (
              <button
                onClick={onOpenMasterHandshake}
                style={{
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '10px',
                  fontSize: '9px',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                SYNC KEYS
              </button>
            )}
            {isNeuralAuthActive && <CheckCircle2 size={14} color="#fff" />}
          </div>
        </div>
      )}

      {/* 3. Logic Engine (Level 3) - Only shown if Handshake is complete */}
      {isNeuralAuthActive && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'rgba(255,255,255,0.02)',
          padding: '12px',
          borderRadius: '16px',
          border: '1px solid #111'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={16} color={isConfigured ? '#fff' : '#444'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800 }}>Tryliate Engine</span>
                <span style={{ color: isConfigured ? '#fff' : '#444', fontSize: '8px', fontWeight: 800 }}>{isConfigured ? 'PROVISIONED' : 'IDLE'}</span>
              </div>
            </div>
            {!isConfigured && (
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
                  cursor: 'pointer'
                }}
              >
                PROVISION
              </button>
            )}
            {isConfigured && <CheckCircle2 size={14} color="#fff" />}
          </div>
        </div>
      )}
    </div>
  );
};
