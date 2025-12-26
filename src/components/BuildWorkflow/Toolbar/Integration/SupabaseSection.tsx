import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface SupabaseSectionProps {
  isSupabaseConnected: boolean;
  onToggleConnection: () => void;
}

export const SupabaseSection: React.FC<SupabaseSectionProps> = ({
  isSupabaseConnected,
  onToggleConnection
}) => {
  const [isConnectHovered, setIsConnectHovered] = useState(false);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(255,255,255,0.02)',
      padding: '10px',
      borderRadius: '16px',
      border: '1px solid #111'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '28px',
          height: '28px',
          background: '#fff',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          border: 'none',
          overflow: 'hidden',
          padding: '3px'
        }}>
          <img
            src="https://img.logo.dev/supabase.com?token=pk_CZ_0opokQL-e57WMnULvMQ&format=png&theme=dark&retina=true"
            alt="Supabase"
            style={{ width: '100%', height: '100%', borderRadius: '3px' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
          <span style={{ color: '#fff', fontSize: '12px', fontWeight: 800, letterSpacing: '-0.02em' }}>Supabase Auth</span>
          <span style={{
            color: isSupabaseConnected ? '#fff' : '#444',
            fontSize: '8px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {isSupabaseConnected ? 'ACTIVE' : 'IDLE'}
          </span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleConnection();
        }}
        onMouseEnter={() => setIsConnectHovered(true)}
        onMouseLeave={() => setIsConnectHovered(false)}
        style={{
          background: isSupabaseConnected
            ? (isConnectHovered ? '#fff' : 'rgba(255, 255, 255, 0.05)')
            : '#fff',
          color: isSupabaseConnected
            ? (isConnectHovered ? '#000' : '#fff')
            : '#000',
          border: isSupabaseConnected
            ? `1px solid ${isConnectHovered ? '#fff' : 'rgba(255, 255, 255, 0.2)'}`
            : 'none',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '9px',
          fontWeight: 900,
          cursor: 'pointer',
          transition: 'all 0.2s',
          minWidth: '70px',
          backdropFilter: isSupabaseConnected ? 'blur(10px)' : 'none'
        }}
      >
        {isSupabaseConnected ? (isConnectHovered ? 'DISCONNECT' : 'CONNECTED') : 'CONNECT'}
      </button>
    </div>
  );
};
