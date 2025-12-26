"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ShieldCheck, Info, Check, X, ArrowRight, Zap, Globe, BrainCircuit } from 'lucide-react';

export const dynamic = "force-dynamic";

// Use environment variables for client-side supa
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null as any;

const AuthorizeContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [authId, setAuthId] = useState<string | null>(null);
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // If not logged in, redirect to login but preserve the current URL for return
        const returnUrl = encodeURIComponent(window.location.href);
        router.push(`/login?redirectTo=${returnUrl}`);
        return;
      }
      setUser(session.user);
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    const fetchDetails = async () => {
      const id = searchParams.get('auth_id');
      if (!id) {
        setError('Missing auth_id. This page should be reached via a Supabase OAuth flow.');
        setLoading(false);
        return;
      }
      setAuthId(id);

      try {
        // @ts-ignore - Beta method might not be in latest @types yet
        const { data, error: fetchErr } = await supabase.auth.getAuthorizationDetails(id);

        if (fetchErr) throw fetchErr;
        setDetails(data);
      } catch (err: any) {
        console.error('Fetch Auth Details Error:', err);
        setError(err.message || 'Failed to retrieve authorization details.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDetails();
    }
  }, [searchParams, user]);

  const handleAuthorize = async (approved: boolean) => {
    if (!authId) return;
    setApproving(true);

    try {
      // @ts-ignore - Beta method
      const { data, error: authErr } = await supabase.auth.approveAuthorization({
        authId,
        approved
      });

      if (authErr) throw authErr;

      // Supabase handles the redirect back to the client automatically
      if (data?.redirect_uri) {
        window.location.href = data.redirect_uri;
      }
    } catch (err: any) {
      console.error('Authorization action failed:', err);
      setError(err.message || 'Failed to process authorization.');
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card loading">
          <Zap className="spin-fast" size={40} color="#fff" />
          <span>Synchronizing Neural Authorization...</span>
        </div>
        <style jsx>{`
          .auth-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; color: #fff; font-family: Inter, sans-serif; }
          .auth-card { display: flex; flex-direction: column; align-items: center; gap: 20px; text-transform: uppercase; font-weight: 900; letter-spacing: 0.1em; font-size: 10px; }
          .spin-fast { animation: spin 0.8s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-card error">
          <div className="icon-box error"><X size={24} /></div>
          <h3>Protocol Error</h3>
          <p>{error}</p>
          <button onClick={() => router.push('/')}>Return to Core</button>
        </div>
        <style jsx>{`
          .auth-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; color: #fff; }
          .auth-card { width: 380px; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 32px; padding: 40px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; }
          .icon-box.error { width: 48px; height: 48px; background: rgba(255,0,0,0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #ff4444; }
          h3 { margin: 0; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 900; }
          p { margin: 0; color: #666; font-size: 12px; line-height: 1.5; }
          button { margin-top: 10px; background: #fff; color: #000; border: none; padding: 12px 24px; borderRadius: 12px; font-weight: 900; text-transform: uppercase; font-size: 11px; cursor: pointer; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card main">
        <div className="header">
          <div className="client-badge">
            <div className="client-icon">
              {details?.client_icon_url ? (
                <img src={details.client_icon_url} alt={details.client_name} />
              ) : (
                <BrainCircuit size={24} color="#000" />
              )}
            </div>
          </div>
          <div className="title-group">
            <h2>Neural Authorization</h2>
            <p className="subtitle">Permission Request from {details?.client_name || 'Third Party App'}</p>
          </div>
        </div>

        <div className="content">
          <div className="app-info">
            <span className="client-name">{details?.client_name}</span>
            <span className="client-desc">{details?.client_description || 'No description provided.'}</span>
          </div>

          <div className="scope-list">
            <div className="scope-header">Requested Neural Handshakes:</div>
            {(details?.scopes || ['openid', 'email', 'profile']).map((scope: string) => (
              <div key={scope} className="scope-item">
                <Check size={12} className="check-icon" />
                <span>{scope.toUpperCase()}</span>
              </div>
            ))}
          </div>

          <div className="security-notice">
            <ShieldCheck size={14} />
            <span>Authenticated via Tryliate Identity Protocol</span>
          </div>
        </div>

        <div className="actions">
          <button
            className="btn-approve"
            disabled={approving}
            onClick={() => handleAuthorize(true)}
          >
            {approving ? 'STABILIZING...' : 'APPROVE ACCESS'}
            {!approving && <ArrowRight size={18} />}
          </button>
          <button
            className="btn-deny"
            disabled={approving}
            onClick={() => handleAuthorize(false)}
          >
            DENY
          </button>
        </div>

        <div className="footer">
          Logged in as <strong>{user?.email}</strong>
          <div className="protocol-version">OAUTH 2.1 • PKCE ENABLED</div>
        </div>
      </div>

      <style jsx>{`
        .auth-container { 
          height: 100vh; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background: radial-gradient(circle at center, #0a0a0a 0%, #000 100%);
          color: #fff; 
          font-family: 'Outfit', sans-serif;
        }
        .auth-card { 
          width: 440px; 
          background: rgba(10, 10, 10, 0.8); 
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.1); 
          border-radius: 40px; 
          padding: 40px; 
          display: flex; 
          flex-direction: column; 
          gap: 32px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.8);
        }
        .header { display: flex; align-items: center; gap: 20px; }
        .client-badge { 
          width: 56px; 
          height: 56px; 
          background: #fff; 
          border-radius: 18px; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          box-shadow: 0 8px 16px rgba(0,0,0,0.4);
        }
        .client-icon img { width: 100%; height: 100%; border-radius: 18px; object-fit: cover; }
        .title-group h2 { margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.03em; text-transform: uppercase; }
        .subtitle { margin: 4px 0 0 0; color: #444; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
        
        .app-info { display: flex; flex-direction: column; gap: 8px; }
        .client-name { font-size: 16px; font-weight: 800; color: #fff; }
        .client-desc { font-size: 12px; color: #666; line-height: 1.5; }

        .scope-list { background: rgba(255,255,255,0.02); border: 1px solid #111; border-radius: 20px; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
        .scope-header { font-size: 9px; font-weight: 900; color: #333; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .scope-item { display: flex; align-items: center; gap: 10px; font-size: 10px; font-weight: 800; color: #fff; letter-spacing: 0.05em; }
        .check-icon { color: #fff; }

        .security-notice { display: flex; align-items: center; gap: 8px; color: #444; font-size: 9px; font-weight: 800; text-transform: uppercase; }

        .actions { display: flex; flex-direction: column; gap: 12px; }
        .btn-approve { 
          width: 100%; background: #fff; color: #000; border: none; padding: 18px; border-radius: 20px; 
          font-size: 13px; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 12px; 
          cursor: pointer; transition: all 0.2s; text-transform: uppercase; 
        }
        .btn-approve:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(255,255,255,0.2); }
        .btn-deny { 
          width: 100%; background: transparent; color: #333; border: 1px solid #111; padding: 14px; border-radius: 16px; 
          font-size: 11px; font-weight: 900; cursor: pointer; transition: all 0.2s; text-transform: uppercase; 
        }
        .btn-deny:hover:not(:disabled) { color: #fff; border-color: #333; }

        .footer { 
          margin-top: 10px; border-top: 1px solid #111; padding-top: 20px; 
          font-size: 10px; color: #444; display: flex; justify-content: space-between; align-items: center;
        }
        .protocol-version { font-weight: 950; font-size: 8px; opacity: 0.5; }
      `}</style>
    </div>
  );
};

export default function AuthorizePage() {
  return (
    <Suspense fallback={<div>Loading Protocol...</div>}>
      <AuthorizeContent />
    </Suspense>
  );
}
