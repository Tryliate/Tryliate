"use client";

import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Trash2, RefreshCcw, Database } from 'lucide-react';

interface AIPanelMiniProps {
  onAction?: (action: string) => void;
}

export const AIPanelMini: React.FC<AIPanelMiniProps> = ({ onAction }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setIsProcessing(true);
    setStatus(`Executing: ${action}...`);

    // Simulation of neural action
    await new Promise(r => setTimeout(r, 1500));

    if (onAction) onAction(action);

    setIsProcessing(false);
    setStatus(`Success: ${action} complete.`);
    setTimeout(() => setStatus(null), 3000);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    handleAction(input);
    setInput('');
  };

  return (
    <div style={{
      marginTop: '10px',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.01)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={10} color="#000" />
          </div>
          <span style={{ fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Neural Analyst</span>
        </div>
        {status && (
          <span style={{ fontSize: '8px', fontWeight: 800, color: '#666', textTransform: 'uppercase' }}>{status}</span>
        )}
      </div>

      {/* Action Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {[
          { label: 'CLEAR TABLES', icon: Trash2 },
          { label: 'SYNC SCHEMA', icon: RefreshCcw },
          { label: 'RESET ENGINE', icon: Database }
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={() => handleAction(btn.label)}
            disabled={isProcessing}
            style={{
              padding: '4px 10px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '20px',
              color: '#444',
              fontSize: '8px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#444';
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            }}
          >
            <btn.icon size={8} />
            {btn.label}
          </button>
        ))}
      </div>

      {/* Mini Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: '#080808',
        borderRadius: '20px',
        padding: '2px 4px',
        border: '1px solid #1a1a1a'
      }}>
        <input
          type="text"
          placeholder="Neural Command..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            padding: '4px 8px',
            color: '#fff',
            fontSize: '10px',
            outline: 'none',
            fontWeight: 800
          }}
        />
        <button
          onClick={handleSend}
          disabled={isProcessing || !input.trim()}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: input.trim() ? '#fff' : 'transparent',
            border: 'none',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'default',
            transition: 'all 0.2s'
          }}
        >
          {isProcessing ? <Loader2 size={12} className="spin" /> : <Send size={10} />}
        </button>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 2s linear infinite; }
      `}</style>
    </div>
  );
};
