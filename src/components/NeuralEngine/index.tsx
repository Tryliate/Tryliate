
"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Server, Zap, Shield, History, Terminal } from 'lucide-react';
import { useAuthSync } from '../BuildWorkflow/Auth/hooks/useAuthSync';
import { supabase } from '@/lib/supabase';

export default function NeuralEngine() {
  const { user, isConfigured } = useAuthSync();
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [logs, setLogs] = useState<{ message: string, status: string }[]>([]);
  const [activeJobs, setActiveJobs] = useState(0);
  const [latency, setLatency] = useState<number | null>(null);

  // Poll for job count if configured
  useEffect(() => {
    if (!isConfigured || !user) return;

    const interval = setInterval(async () => {
      // Mocked for now, but in a real scenario we'd query the tryliate.jobs table via the server or direct
      // For now we simulate heartbeat
      setLatency(Math.floor(Math.random() * 40) + 10);
    }, 5000);

    return () => clearInterval(interval);
  }, [isConfigured, user]);

  const handleActivateKernels = async () => {
    if (!user) return;
    setIsProvisioning(true);
    setLogs([]);

    try {
      const response = await fetch('/api/infrastructure/provision-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.replace('data: ', ''));
              setLogs(prev => [...prev.slice(-4), data]);
            } catch (e) { }
          }
        }
      }
    } catch (err: any) {
      setLogs(prev => [...prev, { message: `Error: ${err.message}`, status: 'error' }]);
    } finally {
      setIsProvisioning(false);
    }
  };

  return (
    <div style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      height: '100%',
      overflowY: 'auto',
      animation: 'fadeIn 0.5s ease-out',
      color: '#fff'
    }}>
      {/* Header Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Neural Engine</h1>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Custom Neural Core Orchestrator (Native Supabase)</p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '20px',
          border: '1px solid #111'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isConfigured ? '#4caf50' : '#ff9800',
            boxShadow: `0 0 10px ${isConfigured ? '#4caf50' : '#ff9800'}`
          }}></div>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isConfigured ? 'Kernels Active' : 'Kernels Standby'}
          </span>
        </div>
      </div>

      {/* Bento Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridAutoRows: '180px',
        gap: '16px'
      }}>

        {/* Large Primary Card - Real-time Activity */}
        <div style={{
          gridColumn: 'span 2',
          gridRow: 'span 2',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid #111',
          borderRadius: '24px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={18} color="#fff" />
              <span style={{ fontSize: '14px', fontWeight: 700 }}>Neural Handshake Feed</span>
            </div>
            <span style={{ fontSize: '10px', color: '#444', fontWeight: 700, textTransform: 'uppercase' }}>
              {isConfigured ? 'Streaming Live' : 'Waiting for activation...'}
            </span>
          </div>

          <div style={{ flex: 1, marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <div key={i} style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: log.status === 'error' ? '#ff5252' : log.status === 'success' ? '#4caf50' : '#888',
                  padding: '4px 8px',
                  background: 'rgba(255,255,255,0.01)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Terminal size={10} />
                  {log.message}
                </div>
              ))
            ) : (
              [1, 2, 3, 4].map((_, i) => (
                <div key={i} style={{
                  height: '32px',
                  background: 'rgba(255,255,255,0.01)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  gap: '12px'
                }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#222' }}></div>
                  <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', width: (Math.random() * 40 + 30) + '%' }}></div>
                </div>
              ))
            )}
          </div>
          <div style={{
            marginTop: 'auto',
            textAlign: 'center',
            fontSize: '11px',
            color: '#333',
            fontStyle: 'italic'
          }}>
            {isProvisioning ? 'Injecting neural kernels...' : 'Kernel injection point ready.'}
          </div>
        </div>

        {/* Tall Card - Transport Stats */}
        <div style={{
          gridRow: 'span 2',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid #111',
          borderRadius: '24px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={18} color="#fff" />
            <span style={{ fontSize: '14px', fontWeight: 700 }}>Latency Arc</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '6px', paddingBottom: '10px' }}>
            {[10, 15, 12, 18, 14, 16, 11, 13].map((h, i) => (
              <div key={i} style={{
                flex: 1,
                height: (latency ? latency / 2 : h) + '%',
                background: isConfigured ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255,255,255,0.05)',
                borderRadius: '4px',
                transition: 'height 0.3s ease'
              }}></div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #111', paddingTop: '16px' }}>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{latency ? `${latency} ms` : '-- ms'}</div>
            <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {latency ? 'Neural Sync Active' : 'Not Connected'}
            </div>
          </div>
        </div>

        {/* Square Card - Active Workers */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid #111',
          borderRadius: '24px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <Cpu size={18} color="#fff" />
          <div>
            <div style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1 }}>{activeJobs.toString().padStart(2, '0')}</div>
            <div style={{ fontSize: '10px', color: '#666', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>Neural Threads</div>
          </div>
        </div>

        {/* Square Card - Success Rate */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid #111',
          borderRadius: '24px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <Shield size={18} color="#fff" />
          <div>
            <div style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1 }}>{isConfigured ? '99' : '--'}<span style={{ fontSize: '16px', color: '#444' }}>%</span></div>
            <div style={{ fontSize: '10px', color: '#666', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>Protocol Uptime</div>
          </div>
        </div>

        {/* Wide Card - Resource Utilization */}
        <div style={{
          gridColumn: 'span 2',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid #111',
          borderRadius: '24px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Server size={14} color="#666" />
              <span style={{ fontSize: '11px', color: '#666', fontWeight: 700, textTransform: 'uppercase' }}>CPU Load</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: isConfigured ? '12%' : '0%',
                background: '#fff',
                transition: 'width 1s ease-in-out'
              }}></div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <History size={14} color="#666" />
              <span style={{ fontSize: '11px', color: '#666', fontWeight: 700, textTransform: 'uppercase' }}>Memory Sync</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: isConfigured ? '8%' : '0%',
                background: '#fff',
                transition: 'width 1s ease-in-out'
              }}></div>
            </div>
          </div>
        </div>

        {/* CTA Card - Build Engine */}
        <button
          onClick={handleActivateKernels}
          disabled={isProvisioning || isConfigured}
          style={{
            gridColumn: 'span 2',
            background: isConfigured ? 'rgba(255,255,255,0.05)' : '#fff',
            borderRadius: '24px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: isConfigured ? 'default' : 'pointer',
            border: 'none',
            outline: 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isProvisioning ? 'scale(0.98)' : 'scale(1)',
          }}
          onMouseEnter={(e) => !isConfigured && (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => !isConfigured && (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: isConfigured ? '#666' : '#000', fontSize: '16px', fontWeight: 900 }}>
              {isConfigured ? 'ENGINE ACTIVE' : (isProvisioning ? 'ACTIVATING...' : 'ACTIVATE ENGINE')}
            </div>
            <div style={{ color: isConfigured ? '#444' : '#666', fontSize: '11px', fontWeight: 600 }}>
              {isConfigured
                ? 'Neural Core stabilized on Supabase'
                : (isProvisioning ? 'Injecting kernels into your infrastructure...' : 'Initialize Native Supabase Neural Engine')}
            </div>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: isConfigured ? 'rgba(76, 175, 80, 0.1)' : '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: isProvisioning ? 'pulse 1s infinite' : 'none'
          }}>
            <Zap size={20} color={isConfigured ? '#4caf50' : '#fff'} fill={isConfigured ? '#4caf50' : 'none'} />
          </div>
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
