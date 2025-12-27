import React from 'react';
import { Database, ChevronUp, Shield } from 'lucide-react';
import { Capsule, CapsuleItem } from '../../../ui/Capsule';
import { Tooltip } from '../../../ui/Tooltip';
import { SupabaseSection } from './SupabaseSection';
import { EngineSection } from './EngineSection';
import { ProvisioningSection } from './ProvisioningSection';
import { GuardianSection } from './GuardianSection';
import { AuthManager } from '../../Auth/components/AuthManager';

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
            <AuthManager
              isSupabaseConnected={isSupabaseConnected}
              isNeuralAuthActive={isNeuralAuthActive}
              isConfigured={isConfigured}
              onOpenSmartConnect={onToggleConnection}
              onOpenMasterHandshake={() => onOpenOneClickAuth?.()}
              onProvision={onProvision}
              onReset={onReset}
            />

            {isSupabaseConnected && (isProvisioning || provisioningLogs.length > 0) && (
              <ProvisioningSection
                isConfigured={isConfigured}
                isProvisioning={isProvisioning}
                provisioningLogs={provisioningLogs}
                onProvision={onProvision}
                onReset={onReset}
              />
            )}

            <GuardianSection userId={typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('tryliate-auth') || '{}').user?.id) : null} />
          </div>
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
