"use client";

import React from 'react';

interface CapsuleProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  style?: React.CSSProperties;
  className?: string;
}

export const Capsule: React.FC<CapsuleProps> = ({
  children,
  variant = 'primary',
  style,
  className
}) => {
  const baseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    background: variant === 'primary' ? '#000' : '#0a0a0a',
    border: '1px solid #1a1a1a',
    borderRadius: '999px',
    padding: '4px',
    transition: 'all 0.2s ease',
    ...style
  };

  return (
    <div style={baseStyle} className={className}>
      {children}
    </div>
  );
};

interface CapsuleItemProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
}

export const CapsuleItem: React.FC<CapsuleItemProps> = ({
  children,
  active,
  onClick,
  style,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        padding: '8px 16px',
        borderRadius: '999px',
        background: active ? '#1a1a1a' : 'transparent',
        color: active ? '#fff' : '#444',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11px',
        fontWeight: 600,
        transition: 'all 0.2s',
        border: active ? '1px solid #222' : '1px solid transparent',
        ...style
      }}
    >
      {children}
    </div>
  );
};
