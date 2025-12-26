'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, MessageSquare, Activity, Plus, Edit3, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { FlowItem } from './FlowItem';

interface FlowThread {
  id: string;
  name: string;
  messages: any[];
  updated_at: string;
}

interface FlowSpaceProps {
  currentFlowId: string | null;
  setCurrentFlowId: (id: string | null) => void;
  activeMode: 'CHAT' | 'EXECUTION';
  setActiveMode: (mode: 'CHAT' | 'EXECUTION') => void;
  onNewFlow: () => void;
  user: any;
}

export const FlowSpace: React.FC<FlowSpaceProps> = ({
  currentFlowId,
  setCurrentFlowId,
  activeMode,
  setActiveMode,
  onNewFlow,
  user
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [threads, setThreads] = useState<FlowThread[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (!user?.id) return;

    const fetchThreads = async () => {
      const { data, error } = await supabase
        .from('flow_space')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (data) setThreads(data);
    };

    fetchThreads();

    // Subscribe to realtime
    const channel = supabase
      .channel('flow_space_sync')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'flow_space',
        filter: `user_id=eq.${user.id}`
      }, (payload: any) => {
        if (payload.eventType === 'INSERT') {
          setThreads(prev => [payload.new as FlowThread, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setThreads(prev => prev.map(t => t.id === payload.new.id ? payload.new as FlowThread : t));
        } else if (payload.eventType === 'DELETE') {
          setThreads(prev => prev.filter(t => t.id === payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleRename = async (id: string) => {
    if (!editValue.trim()) return;
    const { error } = await supabase
      .from('flow_space')
      .update({ name: editValue })
      .eq('id', id);

    if (!error) {
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Permanent deletion of this Flow Thread?')) return;

    const { error } = await supabase
      .from('flow_space')
      .delete()
      .eq('id', id);

    if (!error && currentFlowId === id) {
      setCurrentFlowId(null);
      onNewFlow();
    }
  };

  const currentThread = threads.find(t => t.id === currentFlowId);

  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '2px 10px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.08)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          userSelect: 'none',
          height: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Activity size={10} color="#fff" />
          <span style={{ color: '#fff', fontSize: '10px', fontWeight: 900, letterSpacing: '-0.01em' }}>
            {currentThread?.name || 'Flow Space'}
          </span>
        </div>
        <ChevronDown size={10} color="#666" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '56px',
          left: '50%',
          width: '260px',
          background: '#0d0d0d',
          border: '1px solid #1a1a1a',
          borderRadius: '16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          zIndex: 1000,
          padding: '8px',
          animation: 'dropdownReveal 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          transformOrigin: 'top center',
          transform: 'translateX(-50%)'
        }}>
          <style>{`
            @keyframes dropdownReveal {
              from { 
                opacity: 0; 
                transform: translateX(-50%) translateY(-10px) scale(0.95); 
              }
              to { 
                opacity: 1; 
                transform: translateX(-50%) translateY(0) scale(1); 
              }
            }
          `}</style>
          {/* Top Header/Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '9px', fontWeight: 900, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Flow Space</span>
              <span style={{ fontSize: '7px', fontWeight: 700, color: '#222', textTransform: 'uppercase', marginTop: '1px' }}>
                {threads.length} ACTIVE THREADS • {threads[0]?.updated_at ? new Date(threads[0].updated_at).toLocaleDateString() : 'SYNCED'}
              </span>
            </div>

            <div style={{ display: 'flex', background: '#050505', padding: '2px', borderRadius: '8px', border: '1px solid #111' }}>
              <button
                onClick={() => setActiveMode('CHAT')}
                style={{
                  padding: '3px 8px', borderRadius: '6px', border: 'none',
                  background: activeMode === 'CHAT' ? '#fff' : 'transparent',
                  color: activeMode === 'CHAT' ? '#000' : '#444',
                  fontSize: '8px', fontWeight: 900, cursor: 'pointer'
                }}
              >
                CHAT
              </button>
              <button
                onClick={() => setActiveMode('EXECUTION')}
                style={{
                  padding: '3px 8px', borderRadius: '6px', border: 'none',
                  background: activeMode === 'EXECUTION' ? '#fff' : 'transparent',
                  color: activeMode === 'EXECUTION' ? '#000' : '#444',
                  fontSize: '8px', fontWeight: 900, cursor: 'pointer'
                }}
              >
                LOGS
              </button>
            </div>
          </div>

          {/* Thread List */}
          <div className="custom-scroll" style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div
              onClick={() => { onNewFlow(); setIsOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '10px',
                color: '#fff', fontSize: '10px', fontWeight: 800, cursor: 'pointer', background: 'rgba(255,255,255,0.02)'
              }}
            >
              <Plus size={12} />
              New Flow Thread
            </div>

            {threads.length > 0 && (
              <div style={{ height: '1px', background: '#1a1a1a', margin: '8px 0 4px 0' }} />
            )}

            {threads.map(thread => (
              <FlowItem
                key={thread.id}
                thread={thread}
                isActive={currentFlowId === thread.id}
                isEditing={editingId === thread.id}
                editValue={editValue}
                setEditValue={setEditValue}
                onSelect={() => { setCurrentFlowId(thread.id); setIsOpen(false); }}
                onRenameTrigger={() => {
                  setEditingId(thread.id);
                  setEditValue(thread.name);
                }}
                onRenameConfirm={() => handleRename(thread.id)}
                onRenameCancel={() => setEditingId(null)}
                onDelete={(e) => handleDelete(thread.id, e)}
              />
            ))}

            <div style={{ height: '1px', background: '#1a1a1a', margin: '8px 0 8px 0', opacity: 0.5 }} />

            <div style={{ padding: '4px' }}>
              <div style={{ fontSize: '8px', fontWeight: 900, color: '#333', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Neural Orchestration Space
              </div>
              <div style={{ fontSize: '7px', fontWeight: 600, color: '#222', marginTop: '4px', lineHeight: '1.4' }}>
                All threads are cryptographically synced. State and context remain persistent across distributed nodes.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
