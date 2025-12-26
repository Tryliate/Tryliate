"use client";

import { useEffect } from 'react';

export default function AuthSuccessPage() {
  useEffect(() => {
    // 1. Signal the opener (The main Tryliate Canvas)
    if (window.opener) {
      window.opener.postMessage({ type: 'TRYLIATE_AUTH_SUCCESS' }, window.location.origin);
    }

    // 2. Self-destruct sequence (Close the popup)
    const timer = setTimeout(() => {
      window.close();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#050505',
      color: '#fff',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h1 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px 0' }}>Neural Link Secured</h1>
      <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>This window will close automatically.</p>
    </div>
  );
}
