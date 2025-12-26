import React, { useState, useEffect } from 'react';
import { RadioReceiver, Check, X, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';

export const DiscoveryQueue: React.FC = () => {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('neural_discovery_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (data) setQueue(data);
    setLoading(false);
  };

  const handleAction = async (id: string, action: 'approved' | 'ignored') => {
    await supabase
      .from('neural_discovery_queue')
      .update({ status: action })
      .eq('id', id);

    // Optimistic update
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div style={{
      marginTop: '8px',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      paddingTop: '8px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '6px',
        padding: '0 4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RadioReceiver size={12} color="#444" />
          <span style={{ fontSize: '9px', fontWeight: 900, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Discovery Inbox
          </span>
        </div>
        {loading && <Loader2 size={10} className="spin" color="#444" />}
      </div>

      {queue.length === 0 ? (
        <div style={{
          padding: '12px',
          background: 'rgba(255,255,255,0.01)',
          borderRadius: '12px',
          border: '1px dashed rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Sparkles size={12} color="#333" />
          <span style={{ fontSize: '10px', color: '#444', fontStyle: 'italic' }}>
            No new signals detected.
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {queue.map((item) => (
            <div key={item.id} style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '8px',
              padding: '8px',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#eee' }}>
                    {item.mcp_name || 'Unknown Signal'}
                  </span>
                  <span style={{ fontSize: '9px', color: '#666', fontFamily: 'monospace', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.source_url}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAction(item.id, 'ignored'); }}
                    style={{
                      background: 'rgba(255,0,0,0.1)',
                      border: '1px solid rgba(255,0,0,0.2)',
                      borderRadius: '6px',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <X size={10} color="#f87171" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAction(item.id, 'approved'); }}
                    style={{
                      background: 'rgba(74, 222, 128, 0.1)',
                      border: '1px solid rgba(74, 222, 128, 0.2)',
                      borderRadius: '6px',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Check size={10} color="#4ade80" />
                  </button>
                </div>
              </div>

              {item.metadata?.confidence && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ flex: 1, height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                    <div style={{
                      width: `${item.metadata.confidence * 100}%`,
                      height: '100%',
                      background: item.metadata.confidence > 0.8 ? '#4ade80' : '#fbbf24',
                      borderRadius: '2px'
                    }} />
                  </div>
                  <span style={{ fontSize: '8px', color: '#666' }}>
                    {Math.round(item.metadata.confidence * 100)}% Match
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 2s linear infinite; }
      `}</style>
    </div>
  );
};
