import React, { useState, useEffect } from 'react';
import { X, Settings2, ArrowRight, Trash2, ChevronDown, Check } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

interface EdgeConfigOverlayProps {
  isOpen: boolean;
  edgeId: string | null;
  onClose: () => void;
}

export const EdgeConfigOverlay = ({ isOpen, edgeId, onClose }: EdgeConfigOverlayProps) => {
  const { getEdge, getNodes, deleteElements } = useReactFlow();
  const [edge, setEdge] = useState<any>(null);
  const [sourceNode, setSourceNode] = useState<any>(null);
  const [targetNode, setTargetNode] = useState<any>(null);
  const [protocol, setProtocol] = useState<'ASYNC' | 'SYNC' | 'STREAM'>('ASYNC');

  useEffect(() => {
    if (isOpen && edgeId) {
      const e = getEdge(edgeId);
      if (e) {
        setEdge(e);
        const nodes = getNodes();
        setSourceNode(nodes.find(n => n.id === e.source));
        setTargetNode(nodes.find(n => n.id === e.target));
      }
    }
  }, [isOpen, edgeId, getEdge, getNodes]);

  const handleDelete = () => {
    if (edgeId) {
      deleteElements({ edges: [{ id: edgeId }] });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(40px)',
      pointerEvents: 'all',
      cursor: 'pointer'
    }}
      onClick={onClose}
    >
      <div
        style={{
          width: '360px',
          background: 'rgba(5, 5, 5, 0.95)',
          backdropFilter: 'blur(30px)',
          border: '1px solid #1a1a1a',
          borderRadius: '32px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'all',
          cursor: 'default'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes scaleUp { from { transform: scale(0.9) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        `}</style>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1a1a1a', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings2 size={16} color="#000" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff', letterSpacing: '0.02em' }}>FLOW CONFIGURATION</span>
              <span style={{ fontSize: '10px', color: '#666', fontWeight: 500 }}>ID: {edgeId?.slice(0, 8)}...</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#111', border: '1px solid #222', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#666'; }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Visual Flow Map */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a0a0a', padding: '16px', borderRadius: '20px', border: '1px solid #1a1a1a' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '9px', color: '#555', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.05em' }}>SOURCE NODE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }}></div>
              <div style={{ fontSize: '12px', color: '#fff', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '0.02em' }}>
                {sourceNode?.data?.label || sourceNode?.id || 'Unknown'}
              </div>
            </div>
          </div>
          <div style={{ padding: '0 16px', color: '#444' }}><ArrowRight size={16} strokeWidth={3} /></div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
            <div style={{ fontSize: '9px', color: '#666', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.05em' }}>TARGET NODE</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
              <div style={{ fontSize: '12px', color: '#fff', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '0.02em' }}>
                {targetNode?.data?.label || targetNode?.id || 'Unknown'}
              </div>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#444' }}></div>
            </div>
          </div>
        </div>

        {/* Protocol Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '10px', color: '#666', fontWeight: 700, letterSpacing: '0.05em' }}>TRANSMISSION PROTOCOL</label>
          <div style={{ display: 'flex', background: '#0a0a0a', padding: '4px', borderRadius: '14px', border: '1px solid #1a1a1a' }}>
            {['ASYNC', 'SYNC', 'STREAM'].map((p) => (
              <button
                key={p}
                onClick={() => setProtocol(p as any)}
                style={{
                  flex: 1,
                  background: protocol === p ? '#fff' : 'transparent',
                  color: protocol === p ? '#000' : '#666',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  fontSize: '10px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: protocol === p ? '0 2px 10px rgba(255,255,255,0.2)' : 'none'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Disconnect Info */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'start', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <Trash2 size={14} color="#888" style={{ marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '11px', color: '#fff', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Disconnect Warning</div>
            <div style={{ fontSize: '10px', color: '#666', lineHeight: '1.5', fontWeight: 500 }}>
              Terminating this flow will immediately halt all data processing between these nodes. This action cannot be undone.
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDelete}
          style={{
            background: 'transparent',
            border: '1px solid #333',
            borderRadius: '16px',
            padding: '16px',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.color = '#000';
            e.currentTarget.style.borderColor = '#fff';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.borderColor = '#333';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          DISCONNECT PERMANENTLY
        </button>
      </div>
    </div>
  );
};
