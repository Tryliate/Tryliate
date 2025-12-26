import { useCallback } from 'react';
import { supabase } from '../../../lib/supabase';

export function useInfrastructure(
  user: any,
  setIsProvisioning: (v: boolean) => void,
  setProvisioningLogs: (v: any) => void,
  setNotification: (v: any) => void,
  setIsConfigured: (v: boolean) => void,
  setIsSmartConnectOpen: (v: boolean) => void
) {
  const handleAuthorize = useCallback(() => {
    if (!user?.id) return;
    const CLIENT_ID = process.env.NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID || '';
    const REDIRECT_URI = window.location.origin + '/auth/callback/supabase';
    const NEXT_PATH = window.location.pathname;
    const STATE = `user_id=${user.id},next=${NEXT_PATH}`;
    const authUrl = `https://api.supabase.com/v1/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&state=${encodeURIComponent(STATE)}`;

    const width = 500;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    window.open(authUrl, 'Tryliate Auth', `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`);
  }, [user?.id]);

  const handleProvisionInfrastructure = useCallback(async () => {
    if (!user?.id) return;
    setIsProvisioning(true);
    setProvisioningLogs(['🚀 Initializing Supabase MCP Link...']);
    setNotification({ type: 'info', message: 'Connecting Supabase MCP...' });

    try {
      const { data: userData } = await supabase.from('users').select('supabase_access_token').eq('id', user.id).single();
      const accessToken = userData?.supabase_access_token;
      if (!accessToken) {
        setIsProvisioning(false);
        setIsSmartConnectOpen(true);
        setNotification({ type: 'info', message: 'Handshake required to proceed.' });
        return;
      }

      const backendUrl = process.env.NEXT_PUBLIC_CLOUD_RUN_URL || 'https://tryliate-backend-374665986758.us-east1.run.app';
      const response = await fetch(`${backendUrl}/api/infrastructure/provision?t=${Date.now()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, accessToken }),
        signal: AbortSignal.timeout(120000)
      });

      if (!response.ok) throw new Error(`Provisioning failed (${response.status})`);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('Stream not supported');

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (value) buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            setProvisioningLogs((prev: any) => [...prev, data.message]);
            if (data.type === 'success') {
              setIsConfigured(true);
              setIsProvisioning(false);
              setNotification({ type: 'success', message: 'Neural Infrastructure Synchronized!' });
              setTimeout(() => window.location.reload(), 1500);
            }
            if (data.type === 'error') throw new Error(data.message);
          } catch (e) { }
        }
        if (done) break;
      }
    } catch (err: any) {
      setProvisioningLogs((prev: any) => [...prev, `❌ Error: ${err.message}`]);
      setIsProvisioning(false);
    }
  }, [user?.id, setIsProvisioning, setProvisioningLogs, setNotification, setIsConfigured, setIsSmartConnectOpen]);

  const handleInfrastructureReset = useCallback(async () => {
    if (!user?.id) return;
    try {
      setNotification({ type: 'info', message: 'Resetting Supabase MCP...' });
      const backendUrl = process.env.NEXT_PUBLIC_CLOUD_RUN_URL || 'https://tryliate-backend-374665986758.us-east1.run.app';
      const res = await fetch(`${backendUrl}/api/infrastructure/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (!res.ok) throw new Error('Reset failed');
      setIsConfigured(false);
      setNotification({ type: 'success', message: 'Reset Complete' });
    } catch (err: any) {
      setNotification({ type: 'error', message: `Reset Failed: ${err.message}` });
    }
  }, [user?.id, setIsConfigured, setNotification]);

  return { handleAuthorize, handleProvisionInfrastructure, handleInfrastructureReset };
}
