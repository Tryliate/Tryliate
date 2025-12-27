import React from 'react';

interface DropupItemProps {
  label: string;
  icon: any;
  onClick: () => void;
  style?: React.CSSProperties;
  tag?: string;
}

export const DropupItem: React.FC<DropupItemProps> = ({
  label,
  icon: Icon,
  onClick,
  style,
  tag
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'background 0.2s',
        ...style
      }}
      className="dropup-item"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', fontSize: '13px' }}>
        <Icon size={14} />
        {label}
        {tag && (
          <span style={{ 
            fontSize: '8px', 
            background: '#fff', 
            color: '#000', 
            padding: '1px 4px', 
            borderRadius: '4px', 
            fontWeight: 1000,
            letterSpacing: '0.02em',
            marginLeft: '4px'
          }}>
            {tag}
          </span>
        )}
      </div>
      <button
        style={{
          fontSize: '10px',
          padding: '4px 10px',
          borderRadius: '20px',
          background: '#111',
          border: '1px solid #222',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        VIEW
      </button>
    </div>
  );
};
