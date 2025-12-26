import React, { useState, useEffect } from 'react';
import { Shield, Lock, Unlock, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';

interface GuardianSectionProps {
  userId: string | null;
}

export const GuardianSection: React.FC<GuardianSectionProps> = ({ userId }) => {
  const [authorizations, setAuthorizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchAuths();
  }, [userId]);

  const fetchAuths = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('mcp_authorizations')
      .select('*')
      .eq('user_id', userId);
    if (data) setAuthorizations(data);
    setLoading(false);
  };

  const toggleStatus = async (provider: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'revoked' : 'active';
    await supabase
      .from('mcp_authorizations')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('provider', provider);
    fetchAuths();
  };

  if (!userId) return null;

  return (
    <div style={{
      marginTop: '8px',
      background: 'rgba(255,255,255,0.01)',
      border: '1px solid #111',
      borderRadius: '16px',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={12} color="#444" />
          <span style={{ fontSize: '9px', fontWeight: 900, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Neural Guardian
          </span>
        </div>
        {loading && <Activity size={10} className="spin" color="#444" />}
      </div>

      {authorizations.length === 0 ? (
        <div style={{ padding: '8px', fontSize: '10px', color: '#444', textAlign: 'center', fontStyle: 'italic' }}>
          No active neural links found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {authorizations.map((auth) => (
            <div key={auth.provider} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: auth.status === 'active' ? 'rgba(255,255,255,0.03)' : 'rgba(255,0,0,0.05)',
              padding: '6px 8px',
              borderRadius: '8px',
              border: auth.status === 'active' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {auth.status === 'active' ? <CheckCircle size={10} color="#4ade80" /> : <AlertTriangle size={10} color="#f87171" />}
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#ccc' }}>{auth.provider}</span>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); toggleStatus(auth.provider, auth.status); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {auth.status === 'active' ? <Unlock size={10} color="#666" /> : <Lock size={10} color="#f87171" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
