import { Cpu, Zap } from 'lucide-react';

interface EngineSectionProps {
  isSupabaseConnected: boolean;
  isActive: boolean;
  onToggle: () => void;
  onOpenOneClickAuth?: () => void;
}

export const EngineSection: React.FC<EngineSectionProps> = ({
  isSupabaseConnected,
  isActive,
  onToggle,
  onOpenOneClickAuth
}) => {

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(255,255,255,0.02)',
      padding: '10px',
      borderRadius: '16px',
      border: '1px solid #111',
      opacity: 1,
      transition: 'opacity 0.3s'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            background: '#000',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #222',
            overflow: 'hidden'
          }}>
            <Cpu size={14} color="#fff" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#fff', fontSize: '12px', fontWeight: 900, letterSpacing: '-0.02em' }}>Neural Engine</span>
              <div style={{ display: 'flex', gap: '3px' }}>
                <span style={{ fontSize: '6px', background: '#111', color: '#444', padding: '1px 3px', borderRadius: '3px', border: '1px solid #222', fontWeight: 900 }}>ENGINE</span>
                <span style={{
                  fontSize: '6px',
                  background: isActive ? '#fff' : '#111',
                  color: isActive ? '#000' : '#333',
                  padding: '1px 4px',
                  borderRadius: '3px',
                  border: '1px solid #222',
                  fontWeight: 900
                }}>
                  {isActive ? 'ACTIVE' : 'IDLE'}
                </span>
              </div>
            </div>
            <div style={{ fontSize: '8px', color: '#444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '-1px' }}>
              Tryliate Engine
            </div>
          </div>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (isSupabaseConnected) onToggle();
          }}
          style={{
            width: '32px',
            height: '18px',
            background: isActive ? '#fff' : '#161616',
            borderRadius: '18px',
            position: 'relative',
            cursor: isSupabaseConnected ? 'pointer' : 'not-allowed',
            border: '1px solid #222',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <div style={{
            position: 'absolute',
            top: '1px',
            left: isActive ? '15px' : '1px',
            width: '14px',
            height: '14px',
            background: isActive ? '#000' : '#444',
            borderRadius: '50%',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.4)' : 'none'
          }} />
        </div>
      </div>

    </div>
  );
};
