"use client";

import React from 'react';

interface WorkflowButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
}

export const WorkflowButton: React.FC<WorkflowButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  style,
  icon
}) => {
  const getStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: '#fff',
          color: '#000',
        };
      case 'secondary':
        return {
          background: '#111',
          color: '#444',
          border: '1px solid #222'
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: '#444',
        };
      default:
        return {};
    }
  };

  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 700,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        border: 'none',
        transition: 'all 0.2s ease',
        ...getStyles(),
        ...style
      }}
      onMouseEnter={(e) => {
        if (variant !== 'primary') {
          e.currentTarget.style.color = '#fff';
          if (variant === 'secondary') e.currentTarget.style.background = '#1a1a1a';
        }
      }}
      onMouseLeave={(e) => {
        if (variant !== 'primary') {
          e.currentTarget.style.color = '#444';
          if (variant === 'secondary') e.currentTarget.style.background = '#111';
        }
      }}
    >
      {icon}
      {children}
    </button>
  );
};
