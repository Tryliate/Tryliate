import React from 'react';
import { History, Layout, Plus, Database } from 'lucide-react';

interface HistoryListProps {
  user: any;
  history: any[];
  isLoadingHistory: boolean;
  onLoginClick?: () => void;
  getTimeAgo: (date: string) => string;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  user,
  history,
  isLoadingHistory,
  onLoginClick,
  getTimeAgo
}) => {
  const [showByoiAlert, setShowByoiAlert] = React.useState(false);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ padding: '0 24px', flexShrink: 0 }}>
        {/* Tryliate Workspace Header */}
        <div style={{ marginBottom: '16px', paddingLeft: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600 }}>
            <Layout size={14} /> Tryliate Workspace
          </div>
        </div>

        {/* Create Workflow Action */}
        <div
          onClick={() => {
            if (!user) {
              onLoginClick?.();
              return;
            }
            setShowByoiAlert(true);
            window.dispatchEvent(new CustomEvent('TRYLIATE_NEW_WORKFLOW'));
          }}
          style={{
            margin: '0 4px 16px 4px',
            padding: '10px 12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px dashed rgba(255,255,255,0.1)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            color: '#fff',
            transition: 'all 0.2s',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          }}
        >
          <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={12} color="#000" strokeWidth={3} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700 }}>Create Workflow</span>
        </div>

        {/* BYOI Alert Capsule */}
        {showByoiAlert && (
          <div style={{
            margin: '-12px 4px 16px 4px',
            padding: '12px 14px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '2px',
              height: '100%',
              background: '#fff',
              opacity: 0.8
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={12} color="#fff" style={{ opacity: 0.8 }} />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff', letterSpacing: '0.02em' }}>
                BYOI REQUIRED
              </span>
              <div
                onClick={() => setShowByoiAlert(false)}
                style={{ marginLeft: 'auto', cursor: 'pointer', padding: '4px', opacity: 0.4 }}
              >
                <Plus size={10} style={{ transform: 'rotate(45deg)' }} />
              </div>
            </div>

            <div style={{ fontSize: '10px', color: '#666', lineHeight: '1.4', fontWeight: 600 }}>
              To deploy and persist neural workflows, please connect your Supabase infrastructure in the Build Canvas.
            </div>

            <div
              onClick={() => {
                window.dispatchEvent(new CustomEvent('TRYLIATE_OPEN_SUPABASE_CONNECT'));
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '9px',
                fontWeight: 800,
                alignSelf: 'flex-start',
                marginTop: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#fff';
              }}
            >
              <Database size={10} />
              Connect Supabase
            </div>

            <style>{`
            @keyframes slideDown {
              from { opacity: 0; transform: translateY(-8px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          </div>
        )}

        <div style={{ marginBottom: '8px', paddingLeft: '4px', fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
          Recent History
        </div>
      </div>

      <div
        className="no-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 24px',
          margin: 0,
          minHeight: 0
        }}>
        {isLoadingHistory && (
          <div style={{ padding: '8px 12px', fontSize: '11px', color: '#444' }}>Syncing history...</div>
        )}

        {!isLoadingHistory && history.length === 0 && (
          <div style={{ padding: '12px 14px', fontSize: '11px', color: '#444', lineHeight: '1.4', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)' }}>
            <span style={{ display: 'block', marginBottom: '4px', color: '#666', fontWeight: 600 }}>Architecture Empty</span>
            Your private history is stored as you build and run neural workflows in your personal workspace.
          </div>
        )}

        {history.map((item: any) => (
          <div
            key={item.id}
            onClick={() => {
              window.dispatchEvent(new CustomEvent('TRYLIATE_LOAD_WORKFLOW', { detail: item }));
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              cursor: 'pointer',
              borderRadius: 'var(--radius-s)',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <History size={12} style={{ opacity: 0.4 }} />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '12px', fontWeight: 600 }}>{item.name}</span>
              <span style={{ fontSize: '10px', opacity: 0.4 }}>{getTimeAgo(item.last_accessed_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
