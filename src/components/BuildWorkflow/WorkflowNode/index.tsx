"use client";

import { memo, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Pencil, Globe, Database, Server, Box, Sparkles, BadgeCheck, ShieldCheck } from 'lucide-react';
import { getBrandLogoUrl } from '../../../lib/logo-dev';
import { getBrandInfo } from '../../../lib/logo-dev/actions';

interface ProtocolNodeData {
  domain?: string;
  type?: string;
  meta?: {
    status?: string;
    source?: string;
    platform?: string;
    language?: string;
    version?: string;
    tags?: string;
    author?: string;
    homepage?: string;
    bugs?: string;
    logo?: string;
    verified?: string;
    license?: string;
    capabilities?: string;
    stats?: string;
  };
  label?: string;
  description?: string;
  onEdit?: () => void;
}

interface WorkflowNodeProps {
  data: ProtocolNodeData;
  selected?: boolean;
  isPreview?: boolean;
  showActions?: boolean;
  onAdd?: (data: ProtocolNodeData) => void;
  onAsk?: (data: ProtocolNodeData) => void;
}

export const WorkflowNode = memo(({
  data,
  selected = false,
  isPreview = false,
  onAdd,
  onAsk
}: WorkflowNodeProps) => {
  const logoUrl = data.domain ? getBrandLogoUrl(data.domain) : null;
  const [brandName, setBrandName] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const getFallbackIcon = () => {
    const label = (data.label || '').toLowerCase();
    const desc = (data.description || '').toLowerCase();

    if (label.includes('search') || desc.includes('search') || label.includes('browse')) return <Globe size={18} />;
    if (label.includes('db') || label.includes('sql') || desc.includes('database') || label.includes('data')) return <Database size={18} />;
    if (label.includes('git') || label.includes('code') || label.includes('dev') || label.includes('analyze')) return <Server size={18} />;
    if (label.includes('npm') || label.includes('pkg') || label.includes('res')) return <Box size={18} />;
    if (label.includes('memory') || label.includes('brain') || label.includes('thread')) return <Box size={18} />;
    return <Sparkles size={18} />;
  };

  useEffect(() => {
    if (data.domain && !data.domain.includes('github.com')) {
      getBrandInfo(data.domain)
        .then((info) => {
          if (info?.name && info.name.length > 2) setBrandName(info.name);
        })
        .catch(console.error);
    }
  }, [data.domain]);

  return (
    <div style={{
      background: '#020202',
      border: `1px solid ${selected ? '#333' : '#1a1a1a'}`,
      borderRadius: isPreview ? '24px' : '16px',
      width: isPreview ? '100%' : '210px',
      minHeight: isPreview ? '180px' : '90px',
      height: '100%',
      overflow: 'hidden',
      color: '#fff',
      fontFamily: '"Inter", sans-serif',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Node Header */}
      <div style={{
        position: 'relative',
        height: isPreview ? '24px' : '22px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
        padding: '0 12px',
        fontSize: isPreview ? '9px' : '8px',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {data.type === 'host' && <Server size={10} />}
          {data.type === 'tool' && <Box size={10} />}
          {data.type === 'res' && <Database size={10} />}
          <span style={{ textTransform: 'uppercase' }}>MCP {data.type || 'NODE'}</span>
          {(data as any).config?.authMode === 'CIMD' && (
            <span style={{
              fontSize: '7px',
              fontWeight: 900,
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              padding: '1px 6px',
              borderRadius: '20px',
              marginLeft: '6px',
              letterSpacing: '0.02em',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ShieldCheck size={8} />
              OAUTH 2.1
            </span>
          )}
          {(data.meta?.tags?.includes('official') || data.meta?.tags?.includes('Official')) && (
            <span style={{
              fontSize: '7px',
              fontWeight: 900,
              background: '#fff',
              color: '#000',
              padding: '1px 6px',
              borderRadius: '20px',
              marginLeft: '6px',
              letterSpacing: '0.02em'
            }}>OFFICIAL</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isPreview && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                data.onEdit?.();
              }}
              style={{
                cursor: 'pointer',
                padding: '4px',
                marginRight: '-4px',
                color: 'rgba(255,255,255,0.2)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
            >
              <Pencil size={10} />
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: isPreview ? '16px' : '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: isPreview ? '12px' : '8px', marginBottom: isPreview ? '12px' : '8px' }}>
          {/* Logo */}
          <div style={{
            width: isPreview ? '36px' : '28px',
            height: isPreview ? '36px' : '28px',
            borderRadius: isPreview ? '12px' : '8px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid #222'
          }}>
            {(!imgError && (data.meta?.logo || logoUrl)) ? (
              <img
                src={data.meta?.logo || logoUrl || ''}
                alt="logo"
                onError={() => setImgError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '3px', borderRadius: '12px' }}
              />
            ) : (
              <div style={{ color: '#000' }}>{getFallbackIcon()}</div>
            )}
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: isPreview ? '14px' : '12px', fontWeight: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {data.label}
              {data.meta?.verified === 'true' && (
                <BadgeCheck size={isPreview ? 12 : 10} fill="#fff" color="#000" />
              )}
            </div>
            <div style={{ fontSize: isPreview ? '10px' : '9px', color: '#444', fontFamily: 'monospace' }}>
              {brandName || data.domain || 'mcp.integration'}
            </div>
          </div>
        </div>

        {/* Metabolic Metadata for Bento */}
        {isPreview && data.meta && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {data.meta.tags && (
              Array.isArray(data.meta.tags) ? data.meta.tags : (typeof data.meta.tags === 'string' ? data.meta.tags.split(', ') : [])
            ).filter(t => !['official', 'verified', 'Official', 'Verified'].includes(t)).slice(0, 4).map((tag: string, i: number) => (
              <div key={i} style={{ fontSize: '9px', background: '#111', padding: '3px 10px', borderRadius: '20px', color: '#666', border: '1px solid #222', textTransform: 'uppercase', fontWeight: 700 }}>
                {tag}
              </div>
            ))}
            {data.meta.license && (
              <div style={{ fontSize: '9px', background: '#111', padding: '3px 10px', borderRadius: '20px', color: '#666', border: '1px solid #222', textTransform: 'uppercase' }}>
                {data.meta.license}
              </div>
            )}
            {data.meta.stats && (
              <div style={{ fontSize: '9px', background: '#111', padding: '3px 10px', borderRadius: '20px', color: '#666', border: '1px solid #222' }}>
                {data.meta.stats}
              </div>
            )}
          </div>
        )}

        <div style={{
          fontSize: isPreview ? '11px' : '10px',
          color: '#666',
          lineHeight: '1.5',
          marginBottom: isPreview ? '16px' : '12px',
          display: '-webkit-box',
          WebkitLineClamp: isPreview ? 3 : 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {data.description || 'Verified MCP implementation for neural orchestration.'}
        </div>

        {!isPreview && (
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-start' }}>
            <div
              onClick={() => onAsk?.(data)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#444',
                fontSize: '8.5px',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '2px 0',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                opacity: 0.5
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#444';
                e.currentTarget.style.opacity = '0.5';
              }}
            >
              <Sparkles size={10} />
              <span>Neural Insight</span>
            </div>
          </div>
        )}

        {isPreview && (
          <div style={{
            marginTop: 'auto',
            display: 'flex',
            background: '#111',
            borderRadius: '24px',
            border: '1px solid #222',
            height: '40px',
            padding: '2px',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => onAsk?.(data)}
              style={{
                flex: 1.2,
                height: '100%',
                borderRadius: '20px 0 0 20px',
                background: 'transparent',
                border: 'none',
                color: '#888',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#888';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Sparkles size={12} />
              Ask Trymate
            </button>
            <div style={{ width: '1px', background: '#222', margin: '8px 0' }} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isAdded) {
                  onAdd?.(data);
                  setIsAdded(true);
                  setTimeout(() => setIsAdded(false), 3000);
                }
              }}
              style={{
                flex: 0.8,
                height: '100%',
                borderRadius: '0 20px 20px 0',
                background: isAdded ? '#1a1a1a' : '#fff',
                border: 'none',
                color: isAdded ? '#fff' : '#000',
                fontSize: '11px',
                fontWeight: 900,
                cursor: isAdded ? 'default' : 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                if (!isAdded) e.currentTarget.style.background = '#e0e0e0';
              }}
              onMouseLeave={(e) => {
                if (!isAdded) e.currentTarget.style.background = '#fff';
              }}
            >
              {isAdded ? (
                <>
                  <BadgeCheck size={12} />
                  ADDED
                </>
              ) : 'ADD'}
            </button>
          </div>
        )}
      </div>

      {!isPreview && (
        <>
          <Handle type="target" position={Position.Left} style={{ background: '#333' }} />
          <Handle type="source" position={Position.Right} id="s1" style={{ top: 'auto', bottom: '12px', background: '#333' }} />
          <Handle type="source" position={Position.Right} id="s2" style={{ top: 'auto', bottom: '26px', background: '#333' }} />
        </>
      )}
    </div>
  );
});

WorkflowNode.displayName = 'WorkflowNode';
