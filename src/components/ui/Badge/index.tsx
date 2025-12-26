import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'alpha' | 'live' | 'new' | 'version' | 'default';
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', style }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'alpha':
        return { color: '#888', background: '#1a1a1a' };
      case 'live':
        return { color: '#666', background: '#111' };
      case 'new':
        return { color: '#fff', background: '#1a1a1a' };
      case 'version':
        return { color: '#444', background: '#111', padding: '2px 6px' };
      default:
        return { color: '#555', background: '#161616' };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <span style={{
      fontSize: '10px',
      fontWeight: 500,
      padding: '2px 6px',
      borderRadius: '4px',
      display: 'inline-flex',
      alignItems: 'center',
      ...variantStyles,
      ...style
    }}>
      {children}
    </span>
  );
};
