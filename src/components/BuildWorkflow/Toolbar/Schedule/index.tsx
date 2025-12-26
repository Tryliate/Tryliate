import React from 'react';
import { Calendar, Check, Box } from 'lucide-react';
import { Tooltip } from '../../../ui/Tooltip';
import { CapsuleItem } from '../../../ui/Capsule';

interface ScheduleProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  runStatus: 'idle' | 'running' | 'success';
}

export const Schedule: React.FC<ScheduleProps> = ({ isOpen, setIsOpen, runStatus }) => {
  return (
    <Tooltip content="Planning" shortcutIcon={Calendar} side="bottom">
      <CapsuleItem
        onClick={() => setIsOpen(!isOpen)}
        style={{ padding: '8px 10px', height: '32px', whiteSpace: 'nowrap', opacity: isOpen ? 1 : 0.7, position: 'relative' }}
      >
        <Calendar size={14} />
        {isOpen && (
          <div style={{
            position: 'absolute',
            bottom: '140%',
            left: '-80px',
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
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>DEPLOYMENT SCHEDULE</span>
            </div>

            {runStatus === 'success' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '8px', border: '1px solid rgba(76, 175, 80, 0.2)' }}>
                  <Check size={14} color="#4caf50" />
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>Agent Workflow Validated</div>
                    <div style={{ fontSize: '9px', color: '#aaa' }}>Build v1.0.2 ready for release</div>
                  </div>
                </div>
                <div style={{ fontSize: '10px', color: '#888', fontStyle: 'italic' }}>
                  Scheduled for immediate deployment on next run cycle.
                </div>
                <button style={{
                  width: '100%', padding: '6px', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 800, cursor: 'pointer'
                }}>
                  INITIATE DEPLOYMENT
                </button>
              </div>
            ) : (
              <div style={{ padding: '12px 0', textAlign: 'center', color: '#666', fontSize: '10px' }}>
                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}><Box size={20} style={{ opacity: 0.3 }} /></div>
                No active build artifacts.<br />
                Click <b>Run Once</b> to generate a valid agent build.
              </div>
            )}
          </div>
        )}
      </CapsuleItem>
    </Tooltip>
  );
};
