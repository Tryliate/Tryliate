import React from 'react';
import { Database, ChevronUp, Shield } from 'lucide-react';
import { Capsule, CapsuleItem } from '../../../ui/Capsule';
import { Tooltip } from '../../../ui/Tooltip';
import { SupabaseSection } from './SupabaseSection';
import { EngineSection } from './EngineSection';
import { ProvisioningSection } from './ProvisioningSection';
import { GuardianSection } from './GuardianSection';

interface IntegrationProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isSupabaseConnected: boolean;
  onToggleConnection: () => void;
  isEngineConnected: boolean;
  isEngineProvisioning: boolean;
  onProvisionEngine: () => void;
  isNeuralAuthActive: boolean;
  isProvisioning: boolean;
  isConfigured: boolean;
  provisioningLogs: string[];
  onProvision: () => void;
  onReset: () => void;
  onOpenOneClickAuth?: () => void;
  closeOthers: () => void;
  noCapsule?: boolean;
}

export const Integration: React.FC<IntegrationProps> = ({
  isOpen,
  setIsOpen,
  isSupabaseConnected,
  onToggleConnection,
  isEngineConnected,
  isEngineProvisioning,
  onProvisionEngine,
  isNeuralAuthActive,
  isProvisioning,
  isConfigured,
  provisioningLogs,
  onProvision,
  onReset,
  onOpenOneClickAuth,
  closeOthers,
  noCapsule
}) => {
  const content = (
    <CapsuleItem
      onClick={() => {
        closeOthers();
        setIsOpen(!isOpen);
      }}
      style={{ padding: '8px 14px', whiteSpace: 'nowrap', gap: '8px' }}
      active={isOpen}
    >
      <Database size={14} />
      Integration
      <ChevronUp size={10} style={{ opacity: 0.4, transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
    </CapsuleItem>
  );

  return (
    <div style={{ position: 'relative' }}>
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '120%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '320px',
          background: 'rgba(5, 5, 5, 0.95)',
          backdropFilter: 'blur(30px)',
          borderRadius: '24px',
          border: '1px solid #1a1a1a',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 1000,
          boxShadow: 'none'
        }}>
          <div style={{ paddingLeft: '4px', fontSize: '9px', color: '#444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2px' }}>
            Infrastructure
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SupabaseSection
              isSupabaseConnected={isSupabaseConnected}
              onToggleConnection={onToggleConnection}
            />

            <div style={{ paddingLeft: '4px', fontSize: '9px', color: '#222', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
              Add-ons & Protocols
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.02)',
              padding: '8px 10px',
              borderRadius: '16px',
              border: '1px solid #111'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={14} color="#fff" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: 800 }}>Neural Auth</span>
                    {isNeuralAuthActive && (
                      <span style={{
                        fontSize: '7px',
                        fontWeight: 950,
                        padding: '1.5px 5px',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        borderRadius: '4px',
                        border: '1px solid #1a1a1a',
                        letterSpacing: '0.05em'
                      }}>
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <span style={{ color: '#444', fontSize: '7px', fontWeight: 800, textTransform: 'uppercase' }}>PKCE READY</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenOneClickAuth?.();
                }}
                style={{
                  background: isNeuralAuthActive
                    ? 'rgba(255, 255, 255, 0.05)'
                    : '#fff',
                  color: isNeuralAuthActive
                    ? '#fff'
                    : '#000',
                  border: isNeuralAuthActive
                    ? '1px solid rgba(255, 255, 255, 0.2)'
                    : 'none',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '9px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backdropFilter: isNeuralAuthActive ? 'blur(10px)' : 'none'
                }}
              >
                {isNeuralAuthActive ? 'CONNECTED' : 'CONNECT'}
              </button>
            </div>

            <EngineSection
              isSupabaseConnected={isSupabaseConnected}
              isActive={isEngineConnected}
              onToggle={onProvisionEngine}
              onOpenOneClickAuth={onOpenOneClickAuth}
            />

            <GuardianSection userId={typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('tryliate-auth') || '{}').user?.id) : null} />
          </div>

          {isSupabaseConnected && (
            <ProvisioningSection
              isConfigured={isConfigured}
              isProvisioning={isProvisioning}
              provisioningLogs={provisioningLogs}
              onProvision={onProvision}
              onReset={onReset}
            />
          )}
        </div>
      )}
      {noCapsule ? (
        content
      ) : (
        <Tooltip content="Infrastructure" shortcutIcon={Database} side="top">
          <Capsule variant="secondary" style={{ border: '1px solid #222', padding: 0 }}>
            {content}
          </Capsule>
        </Tooltip>
      )}
    </div>
  );
};
