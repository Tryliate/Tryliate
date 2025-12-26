import { useState, useCallback } from 'react';

export function useMasterHandshake(user: any, supabaseProjectId: string | null, setNotification: any) {
  const [masterHandshakeStatus, setMasterHandshakeStatus] = useState<'idle' | 'generating' | 'redirecting' | 'error'>('idle');
  const [isMasterHandshakeOpen, setIsMasterHandshakeOpen] = useState(false);
  const [isNeuralAuthActive, setIsNeuralAuthActive] = useState(false);

  const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  };

  const generateCodeChallenge = async (verifier: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  };

  const handleMasterAuth = useCallback(async () => {
    if (!user?.id || !supabaseProjectId) {
      setNotification({ type: 'error', message: 'Neural infrastructure and project identity required.' });
      return;
    }
    setMasterHandshakeStatus('generating');
    try {
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      document.cookie = `mcp_code_verifier=${codeVerifier}; Path=/; SameSite=Lax; Max-Age=3600${window.location.protocol === 'https:' ? '; Secure' : ''}`;
      const userProjectUrl = `https://${supabaseProjectId}.supabase.co`;
      const clientId = 'a9d07a52-e377-4656-8149-802194c03bdb';
      const redirectUri = `${window.location.origin}//auth/callback/neural`;
      const state = btoa(crypto.randomUUID()).substring(0, 16);
      setMasterHandshakeStatus('redirecting');
      const authUrl = `${userProjectUrl}/auth/v1/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid+email+profile&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`;

      const width = 500;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      const popup = window.open(authUrl, 'NeuralHandshake', `width=${width},height=${height},left=${left},top=${top},status=yes,scrollbars=yes`);

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type === 'NEURAL_HANDSHAKE_SUCCESS') {
          setMasterHandshakeStatus('idle');
          setIsMasterHandshakeOpen(false);
          setIsNeuralAuthActive(true);
          setNotification({ type: 'success', message: 'Neural Handshake Complete.' });
          if (popup) popup.close();
          window.removeEventListener('message', handleMessage);
        }
      };
      window.addEventListener('message', handleMessage);
    } catch (err) {
      setMasterHandshakeStatus('error');
      setNotification({ type: 'error', message: 'Protocol Generation Failed.' });
    }
  }, [user, supabaseProjectId, setNotification]);

  return { masterHandshakeStatus, setMasterHandshakeStatus, isMasterHandshakeOpen, setIsMasterHandshakeOpen, isNeuralAuthActive, setIsNeuralAuthActive, handleMasterAuth };
}
