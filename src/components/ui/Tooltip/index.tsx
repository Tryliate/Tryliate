"use client";

import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  shortcut?: string;
  shortcutIcon?: any;
  children: React.ReactNode;
  align?: 'center' | 'left' | 'right';
  side?: 'top' | 'bottom' | 'left' | 'right';
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  shortcut,
  shortcutIcon,
  children,
  align = 'center',
  side = 'bottom',
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Reset visibility if disabled
  React.useEffect(() => {
    if (disabled) setIsVisible(false);
  }, [disabled]);

  const getPosStyles = () => {
    switch (side) {
      case 'top':
        return {
          bottom: '130%',
          left: align === 'left' ? '0' : align === 'right' ? 'auto' : '50%',
          right: align === 'right' ? '0' : 'auto',
          transform: align === 'center' ? 'translateX(-50%)' : 'none',
        };
      case 'right':
        return {
          left: '130%',
          top: '50%',
          transform: 'translateY(-50%)',
        };
      case 'left':
        return {
          right: '130%',
          top: '50%',
          transform: 'translateY(-50%)',
        };
      case 'bottom':
      default:
        return {
          top: '130%',
          left: align === 'left' ? '0' : align === 'right' ? 'auto' : '50%',
          right: align === 'right' ? '0' : 'auto',
          transform: align === 'center' ? 'translateX(-50%)' : 'none',
        };
    }
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div style={{
          position: 'absolute',
          ...getPosStyles(),
          background: '#0a0a0a',
          border: '1px solid #1a1a1a',
          borderRadius: '10px',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1000,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          animation: 'tooltipIn 0.15s cubic-bezier(0, 0, 0.2, 1)',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#fff' }}>{content}</span>
          {(shortcutIcon || shortcut) && (
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '5px',
              padding: '1.5px 5px',
              border: '1px solid #222',
              fontSize: '9px',
              fontWeight: 800,
              color: '#555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {shortcutIcon ? React.createElement(shortcutIcon, { size: 10 }) : shortcut}
            </div>
          )}

          <style>{`
            @keyframes tooltipIn {
              from { opacity: 0; scale: 0.98; }
              to { opacity: 1; scale: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};
