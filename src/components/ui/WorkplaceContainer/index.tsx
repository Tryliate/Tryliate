import React from 'react';

interface WorkplaceContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const WorkplaceContainer: React.FC<WorkplaceContainerProps> = ({ children, style }) => {
  return (
    <div style={{
      flex: 1,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-container)',
      border: 'var(--border-thick)',
      borderRadius: 'var(--radius-container)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 0 0 1px #333',
      ...style
    }}>
      {children}
    </div>
  );
};
