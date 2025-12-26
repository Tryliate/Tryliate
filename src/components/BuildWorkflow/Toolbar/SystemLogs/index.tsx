import React from 'react';
import { ScrollText, Activity, Workflow, Zap } from 'lucide-react';
import { Tooltip } from '../../../ui/Tooltip';
import { CapsuleItem } from '../../../ui/Capsule';

interface SystemLogsProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  stats: { nodes: number; edges: number };
  executionLogs?: string[];
  isExecuting?: boolean;
}

export const SystemLogs: React.FC<SystemLogsProps> = ({ isOpen, setIsOpen, stats, executionLogs = [], isExecuting }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [executionLogs]);
  return (
    <Tooltip content="Activity" shortcutIcon={ScrollText} side="bottom">
      <CapsuleItem
        onClick={() => setIsOpen(!isOpen)}
        style={{ padding: '8px 10px', whiteSpace: 'nowrap', opacity: isOpen ? 1 : 0.7, position: 'relative' }}
      >
        <ScrollText size={14} />
        {isOpen && (
          <div style={{
            position: 'absolute',
            bottom: '140%',
            left: '-100px',
            width: '260px',
            background: 'rgba(5, 5, 5, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid #1a1a1a',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 1000,
            cursor: 'default'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1a1a1a', paddingBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>SYSTEM LOGS</span>
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#ccc', display: 'flex', alignItems: 'center', gap: '4px', background: '#222', padding: '2px 6px', borderRadius: '4px', border: '1px solid #333' }}>
                <Activity size={10} color="#fff" /> REALTIME
              </span>
            </div>

            {/* Workflow Health */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <Workflow size={14} color={stats.nodes > 0 ? "#4caf50" : "#888"} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#eee' }}>Workflow Health</div>
                <div style={{ fontSize: '10px', color: '#666' }}>
                  {stats.nodes > 0 ? 'System active' : 'System Idle'}
                </div>
              </div>
            </div>

            {/* Agent Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <Zap size={14} color={stats.nodes > 0 ? "#ff9800" : "#888"} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#eee' }}>Active Components</div>
                <div style={{ fontSize: '10px', color: '#666' }}>
                  {stats.nodes === 0 ? 'No running processes' : `${stats.nodes} active nodes`}
                </div>
              </div>
            </div>

            {/* Terminal View */}
            <div
              ref={scrollRef}
              style={{
                marginTop: '8px',
                background: '#0a0a0a',
                border: '1px solid #222',
                borderRadius: '8px',
                padding: '8px',
                height: '80px',
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '9px',
                color: '#aaa',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }} className="custom-scroll">
              {executionLogs.length === 0 ? (
                <span style={{ color: '#444', fontStyle: 'italic' }}>// terminal empty...</span>
              ) : (
                <>
                  {executionLogs.map((log, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', color: log.includes('✅') || log.includes('SUCCESS') ? '#fff' : '#888' }}>
                      <span style={{ color: '#222', fontWeight: 700 }}>{(idx + 1).toString().padStart(2, '0')}</span>
                      <span>{log.replace(/🚀|✅|❌|🧠|📡/g, '').trim()}</span>
                    </div>
                  ))}
                  {isExecuting && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', opacity: 0.5 }}>
                      <span style={{ color: '#222' }}>{(executionLogs.length + 1).toString().padStart(2, '0')}</span>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#fff', animation: 'tryliatePulse 0.8s infinite' }} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </CapsuleItem>
    </Tooltip>
  );
};
