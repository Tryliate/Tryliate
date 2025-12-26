import React from 'react';

interface DropupItem {
  label: string;
  icon: any;
  category?: string;
}

interface DropupContentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  category: string;
  items?: DropupItem[];
  onOpenOverlay?: (category: string, subType: string) => void;
  isIntegrationDropupOpen?: boolean;
  children?: React.ReactNode;
}

export const DropupContent: React.FC<DropupContentProps> = ({
  open,
  setOpen,
  category,
  items,
  onOpenOverlay,
  isIntegrationDropupOpen,
  children
}) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute',
      bottom: '120%',
      left: '0',
      width: isIntegrationDropupOpen ? '360px' : '240px',
      background: 'rgba(5, 5, 5, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid #1a1a1a',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      maxHeight: '260px',
      overflowY: 'auto',
      zIndex: 1000
    }} className="custom-scroll">
      <div style={{ padding: '8px 12px', fontSize: '11px', color: '#444', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Select {category}
      </div>
      {children ? children : items?.map((item) => (
        <div key={item.label} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 12px',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'background 0.2s'
        }} className="dropup-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', fontSize: '13px' }}>
            <item.icon size={14} />
            {item.label}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenOverlay?.(item.category || category, item.label);
              setOpen(false);
            }}
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
      ))}
    </div>
  );
};
