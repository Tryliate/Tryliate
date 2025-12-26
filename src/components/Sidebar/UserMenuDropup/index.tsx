import React from 'react';
import { Settings, Users, Check, Plus, Layout, HelpCircle, ChevronRight, LogOut } from 'lucide-react';

interface UserMenuDropupProps {
  user: any;
  onLogout: () => void;
  onClose: () => void;
}

export const UserMenuDropup: React.FC<UserMenuDropupProps> = ({ user, onLogout, onClose }) => {
  const displayEmail = user.email || 'architect@tryliate.com';

  return (
    <div style={{
      position: 'absolute',
      bottom: '100%',
      left: '0',
      right: '0',
      marginBottom: '10px',
      background: '#0d0d0d',
      border: '1px solid #1a1a1a',
      borderRadius: '20px',
      padding: '4px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
      zIndex: 110,
      animation: 'fadeInUp 0.1s ease-out',
      display: 'flex',
      flexDirection: 'column',
      gap: '1px'
    }}>
      {/* 1. Header Section - Ultra Compact */}
      <div style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', margin: '2px' }}>
        <div style={{
          width: '24px', height: '24px', background: '#000', borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #1a1a1a', flexShrink: 0, overflow: 'hidden'
        }}>
          <img src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${displayEmail}`} style={{ width: '16px', height: '16px', opacity: 0.8 }} alt="ws" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.2' }}>Personal Projects</div>
          <div style={{ fontSize: '9px', color: '#444', fontWeight: 600, lineHeight: '1' }}>Free Plan · 1 member</div>
        </div>
      </div>

      {/* 2. Action Grid - Minimal Height */}
      <div style={{ display: 'flex', gap: '2px', padding: '1px 2px' }}>
        <div style={{
          flex: 1, background: '#161616', borderRadius: '8px', padding: '4px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', border: '1px solid transparent'
        }}>
          <Settings size={9} color="#888" />
          <span style={{ fontSize: '9px', fontWeight: 800, color: '#fff' }}>Settings</span>
        </div>
        <div style={{
          flex: 1, background: 'transparent', borderRadius: '8px', padding: '4px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', opacity: 0.5
        }}>
          <Users size={9} color="#666" />
          <span style={{ fontSize: '9px', fontWeight: 800, color: '#999' }}>Invite members</span>
        </div>
      </div>

      <div style={{ height: '1px', background: '#1a1a1a', margin: '2px 8px' }} />

      {/* 3. Identity & Switcher - Streamlined */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', padding: '1px 2px' }}>
        <div style={{ fontSize: '8px', color: '#333', fontWeight: 900, paddingLeft: '8px', marginBottom: '1px', opacity: 0.8 }}>{displayEmail}</div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 10px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)'
        }}>
          <div style={{
            width: '22px', height: '22px', background: '#000', borderRadius: '6px', border: '1px solid #1a1a1a',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden'
          }}>
            <img src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${displayEmail}`} style={{ width: '14px', height: '14px', opacity: 0.8 }} alt="emoji" />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#eee', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Personal Projects</span>
            <span style={{ fontSize: '8px', fontWeight: 800, color: '#444', textTransform: 'uppercase' }}>Owner</span>
          </div>
          <Check size={12} color="#fff" style={{ flexShrink: 0, opacity: 0.8 }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 8px', borderRadius: '10px', cursor: 'pointer', opacity: 0.2 }}>
          <div style={{ width: '20px', height: '20px', background: 'transparent', border: '1px solid #1a1a1a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={8} color="#444" />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#444' }}>New team</span>
        </div>
      </div>

      <div style={{ height: '1px', background: '#1a1a1a', margin: '2px 8px' }} />

      {/* 4. Sub-Navigation - Tight Padding */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', padding: '1px 2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 8px', borderRadius: '8px', cursor: 'pointer' }}>
          <HelpCircle size={11} color="#444" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#888', flex: 1 }}>Help</span>
          <ChevronRight size={10} color="#161616" />
        </div>
      </div>

      <div style={{ height: '1px', background: '#1a1a1a', margin: '2px 8px' }} />

      {/* 5. Logout */}
      <div style={{ padding: '1px 2px' }}>
        <div
          onClick={(e) => { e.stopPropagation(); onLogout(); onClose(); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 8px', borderRadius: '8px', cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={11} color="#333" />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#555' }}>Log out</span>
        </div>
      </div>
    </div>
  );
};
