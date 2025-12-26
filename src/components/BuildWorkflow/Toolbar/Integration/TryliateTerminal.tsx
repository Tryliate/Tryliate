import React, { useRef, useEffect } from 'react';
import { Terminal, Zap, ExternalLink, RefreshCw } from 'lucide-react';

interface TerminalLine {
  text: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'process';
  timestamp: string;
}

interface TryliateTerminalProps {
  logs: string[];
  isProcessing: boolean;
  version?: string;
}

export const TryliateTerminal: React.FC<TryliateTerminalProps> = ({
  logs,
  isProcessing,
  version = 'v1.1.5'
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const parseLog = (log: string): TerminalLine => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    let type: TerminalLine['type'] = 'info';
    let text = log;

    if (log.includes('❌') || log.toLowerCase().includes('error')) type = 'error';
    else if (log.includes('✅') || log.includes('🎉')) type = 'success';
    else if (log.includes('⚠️')) type = 'warning';
    else if (log.includes('🚀') || log.includes('🏗️') || log.includes('📡')) type = 'process';

    // Remove emojis for cleaner text if preferred, but user liked them
    return { text, type, timestamp };
  };

  return (
    <div style={{
      marginTop: '12px',
      background: '#0a0a0a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      fontFamily: '"JetBrains Mono", "SF Mono", "Fira Code", monospace'
    }}>
      {/* Terminal Header */}
      <div style={{
        padding: '8px 12px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          </div>
          <span style={{ fontSize: '9px', fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>
            TRYLIATE_NEURAL_BUS
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={10} color={isProcessing ? "#fff" : "#444"} className={isProcessing ? "pulse" : ""} />
          <span style={{ fontSize: '8px', color: '#444', fontWeight: 900 }}>{version}</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={scrollRef}
        className="custom-scroll"
        style={{
          padding: '12px',
          height: '140px',
          overflowY: 'auto',
          fontSize: '10px',
          lineHeight: '1.6',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          scrollbarWidth: 'none'
        }}
      >
        <style>{`.custom-scroll::-webkit-scrollbar { display: none; }`}</style>

        {logs.length === 0 && !isProcessing && (
          <div style={{ color: '#444', fontStyle: 'italic' }}>
            System idle. Awaiting neural handshake...
          </div>
        )}

        {logs.map((log, i) => {
          const line = parseLog(log);
          return (
            <div key={i} style={{ display: 'flex', gap: '8px', opacity: i === logs.length - 1 ? 1 : 0.6 }}>
              <span style={{ color: '#555', flexShrink: 0 }}>[{line.timestamp}]</span>
              <span style={{
                color: '#fff',
                wordBreak: 'break-word',
                fontWeight: line.type === 'error' ? 900 : (line.type === 'success' ? 700 : 400),
                opacity: line.type === 'error' ? 1 : 0.8
              }}>
                {line.text}
              </span>
            </div>
          );
        })}

        {isProcessing && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#fff', marginTop: '4px' }}>
            <span style={{ color: '#555' }}>[SYSTEM]</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={10} className="spin" color="#fff" />
              <span style={{ letterSpacing: '0.02em', fontWeight: 900, color: '#fff', fontSize: '9px' }}>CALIBRATING 17-TABLE SUPABASE MCP...</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .pulse { animation: pulse 1.5s ease-in-out infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 2s linear infinite; }
        .custom-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
