"use client";

import React, { useState, useEffect } from 'react';
import {
  Database,
  Workflow,
  Zap,
  Shield,
  Globe,
  Activity,
  ArrowUpRight,
  Fingerprint,
  Link2,
  Lock,
  RefreshCw,
  Cpu,
  Layers,
  Server
} from 'lucide-react';
import { supabase as centralSupabase } from '../../lib/supabase';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  // Sync session
  useEffect(() => {
    centralSupabase.auth.getSession().then((payload: any) => {
      setUser(payload.data?.session?.user ?? null);
    });
  }, []);

  return (
    <div
      className="no-scrollbar"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        height: '100%',
        overflowY: 'auto',
        animation: 'fadeIn 0.5s ease-out'
      }}>
      {/* 1. Header Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Architectural Dashboard</h1>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>BYOI Infrastructure Management</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px',
          background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid #111'
        }}>
          <Fingerprint size={14} color="#666" />
          <span style={{ fontSize: '11px', color: '#888', fontWeight: 600 }}>{user?.id ? `NODE-${user.id.substring(0, 8)}` : 'GUEST-NODE'}</span>
        </div>
      </div>

      {/* 2. Bento Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridAutoRows: '160px', gap: '16px'
      }}>

        {/* ROW 1: CORE INFRASTRUCTURE (Span 2 Rows) */}
        {/* 1. Infrastructure Health (4x2) */}
        <div style={{
          gridColumn: 'span 4', gridRow: 'span 2',
          background: 'rgba(255,255,255,0.02)', border: '1px solid #111',
          borderRadius: '28px', padding: '28px', display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Server size={20} color="#fff" />
              <span style={{ fontSize: '16px', fontWeight: 700 }}>Infrastructure Ecosystem</span>
            </div>
            <div style={{
              fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)', color: '#fff', border: '1px solid #222'
            }}>
              SYNCHRONIZED
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>Supabase Data Plane</span>
                <span style={{ fontSize: '18px', fontWeight: 700 }}>ACTIVE</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: '#fff', animation: 'pulse 2s infinite' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.01)', borderRadius: '14px', border: '1px solid #151515' }}>
                  <div style={{ fontSize: '9px', color: '#444', textTransform: 'uppercase', marginBottom: '4px' }}>RLS Status</div>
                  <div style={{ fontSize: '14px', fontWeight: 800 }}>Enforced</div>
                </div>
                <div style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.01)', borderRadius: '14px', border: '1px solid #151515' }}>
                  <div style={{ fontSize: '9px', color: '#444', textTransform: 'uppercase', marginBottom: '4px' }}>Auth Flow</div>
                  <div style={{ fontSize: '14px', fontWeight: 800 }}>Private</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px', borderLeft: '1px solid #111', paddingLeft: '32px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ padding: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid #111' }}>
                  <Shield size={32} color="#fff" />
                </div>
                <div style={{ position: 'absolute', top: -4, right: -4, width: '12px', height: '12px', background: '#fff', borderRadius: '50%', border: '2px solid #000', boxShadow: '0 0 10px rgba(255,255,255,0.3)' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>Zero-Cloud Trust</div>
                <div style={{ fontSize: '10px', color: '#444', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>BYOI Integrity Verified</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workflow Counter (2x2) */}
        <div style={{
          gridColumn: 'span 2', gridRow: 'span 2',
          background: 'rgba(255,255,255,0.03)', border: '1px solid #111', borderRadius: '28px', padding: '28px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Workflow size={24} color="#fff" />
            <div style={{ fontSize: '12px', fontWeight: 700, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Workflows</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '60px' }}>
              {[30, 45, 25, 100, 40, 70, 35, 55].map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    background: h === 100 ? '#fff' : 'rgba(255,255,255,0.05)',
                    borderRadius: '4px',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid #151515' }}>
            <Activity size={12} color="#fff" style={{ opacity: 0.5 }} />
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#444', textTransform: 'uppercase' }}>Syncing Registry...</span>
          </div>
        </div>

        {/* ROW 3: TELEMETRY (3 Items of Span 2) */}
        {/* 1. Neural Latency (2x1) */}
        <div style={{
          gridColumn: 'span 2', background: 'rgba(255,255,255,0.02)', border: '1px solid #111',
          borderRadius: '24px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px'
        }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#444', fontWeight: 700, textTransform: 'uppercase' }}>Neural Latency</div>
            <div style={{ fontSize: '20px', fontWeight: 700 }}>READY</div>
          </div>
        </div>

        {/* 2. Deployment Logic (2x1) */}
        <div style={{
          gridColumn: 'span 2', background: 'rgba(255,255,255,0.02)', border: '1px solid #111',
          borderRadius: '24px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px'
        }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#444', fontWeight: 700, textTransform: 'uppercase' }}>Neural Region</div>
            <div style={{ fontSize: '20px', fontWeight: 700 }}>US-EAST-1</div>
          </div>
        </div>

        {/* 3. Compute Threads (2x1) - NEWLY ADDED TO FILL THE ROW */}
        <div style={{
          gridColumn: 'span 2', background: 'rgba(255,255,255,0.02)', border: '1px solid #111',
          borderRadius: '24px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px'
        }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#444', fontWeight: 700, textTransform: 'uppercase' }}>Compute Hub</div>
            <div style={{ fontSize: '20px', fontWeight: 700 }}>OPTIMIZED</div>
          </div>
        </div>

        {/* ROW 4: LOGS & ACTIONS */}
        {/* Activity Log (4x1) */}
        <div style={{
          gridColumn: 'span 4', background: 'rgba(255,255,255,0.02)', border: '1px solid #111',
          borderRadius: '28px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px'
        }}>
          <span style={{ fontSize: '11px', color: '#444', fontWeight: 700, textTransform: 'uppercase' }}>Neural Event Bus</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', color: '#333', fontSize: '11px', fontStyle: 'italic', background: 'rgba(255,255,255,0.01)', borderRadius: '12px' }}>
            Awaiting architectural handshake events from private node...
          </div>
        </div>

        {/* Refresh Action (2x1) */}
        <div
          onClick={() => window.location.reload()}
          style={{
            gridColumn: 'span 2', background: 'rgba(255,255,255,0.03)', border: '1px solid #111',
            borderRadius: '28px', padding: '24px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
        >
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>RE-SYNC</div>
            <div style={{ fontSize: '10px', color: '#444' }}>MANUALLY HEAL PLANE</div>
          </div>
          <RefreshCw size={20} color="#fff" />
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}
