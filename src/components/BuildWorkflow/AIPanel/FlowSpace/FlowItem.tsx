'use client';

import React from 'react';
import { MessageSquare, Edit3, X, Check } from 'lucide-react';

interface FlowItemProps {
  thread: {
    id: string;
    name: string;
  };
  isActive: boolean;
  isEditing: boolean;
  editValue: string;
  setEditValue: (val: string) => void;
  onSelect: () => void;
  onRenameTrigger: () => void;
  onRenameConfirm: () => void;
  onRenameCancel: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const FlowItem: React.FC<FlowItemProps> = ({
  thread,
  isActive,
  isEditing,
  editValue,
  setEditValue,
  onSelect,
  onRenameTrigger,
  onRenameConfirm,
  onRenameCancel,
  onDelete
}) => {
  return (
    <div
      onClick={onSelect}
      className="flow-item-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 10px',
        borderRadius: '10px',
        cursor: 'pointer',
        background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
        transition: 'all 0.2s',
        position: 'relative'
      }}
    >
      <style>{`
        .flow-item-row .action-btns { opacity: 0; transition: opacity 0.2s; }
        .flow-item-row:hover .action-btns { opacity: 1; }
        .flow-item-row:hover { background: rgba(255,255,255,0.02) !important; }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
        <MessageSquare size={10} color={isActive ? '#fff' : '#444'} />
        {isEditing ? (
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onRenameConfirm();
              if (e.key === 'Escape') onRenameCancel();
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '10px',
              outline: 'none',
              width: '100%',
              fontWeight: 800
            }}
          />
        ) : (
          <span style={{
            fontSize: '10px',
            color: isActive ? '#fff' : '#888',
            fontWeight: 700,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {thread.name}
          </span>
        )}
      </div>

      <div className="action-btns" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isEditing) {
              onRenameConfirm();
            } else {
              onRenameTrigger();
            }
          }}
          style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', padding: '2px' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#444'}
        >
          {isEditing ? <Check size={10} color="#00ff00" /> : <Edit3 size={10} />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isEditing) {
              onRenameCancel();
            } else {
              onDelete(e);
            }
          }}
          style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', padding: '2px' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ff4444'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#444'}
        >
          <X size={10} />
        </button>
      </div>
    </div>
  );
};
