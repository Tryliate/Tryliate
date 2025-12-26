import React from 'react';
import { Sparkles } from 'lucide-react';

interface UpgradeDropupProps {
  onUpgradeClick?: () => void;
  onClose: () => void;
}

export const UpgradeDropup: React.FC<UpgradeDropupProps> = ({ onUpgradeClick, onClose }) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '100%',
      left: '4px',
      right: '4px',
      marginBottom: '10px',
      background: '#0a0a0a',
      border: '1px solid #1a1a1a',
      borderRadius: '20px',
      padding: '12px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
      zIndex: 100,
      animation: 'fadeInUp 0.2s ease-out'
    }}>
      <div style={{ fontSize: '9px', fontWeight: 800, color: '#333', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', paddingLeft: '2px' }}>
        Architecture Tier
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Free Mate */}
        <div style={{
          padding: '8px 10px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid #151515',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', opacity: 0.2 }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Free Mate</span>
          </div>
          <div style={{ fontSize: '8px', fontWeight: 900, background: 'rgba(255,255,255,0.05)', padding: '3px 6px', borderRadius: '6px', color: '#444' }}>
            ACTIVE
          </div>
        </div>

        {/* Pro Mate */}
        <div
          onClick={() => {
            onClose();
            onUpgradeClick?.();
          }}
          style={{
            padding: '8px 10px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid #222',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#444'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#222'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={12} color="#fff" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Pro Mate</span>
          </div>
          <div style={{ fontSize: '8px', fontWeight: 900, background: '#fff', color: '#000', padding: '3px 6px', borderRadius: '6px' }}>
            UPGRADE
          </div>
        </div>
      </div>

      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <p style={{ fontSize: '8px', color: '#222', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Unified BYOI Orchestration
        </p>
      </div>
    </div>
  );
};
