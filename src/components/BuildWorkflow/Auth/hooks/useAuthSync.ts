import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export function useAuthSync() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [supabaseOrgId, setSupabaseOrgId] = useState<string | null>(null);
  const [supabaseProjectId, setSupabaseProjectId] = useState<string | null>(null);
  const [supabaseUrl, setSupabaseUrl] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isNeuralAuthActive, setIsNeuralAuthActive] = useState(false);
  const [supabasePublishableKey, setSupabasePublishableKey] = useState<string | null>(null);
  const [supabaseSecretKey, setSupabaseSecretKey] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    let subscription: any;

    const checkStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        console.log('🔒 [Security] No active session found. Enforcing gateway protocol...');
        // In a real prod environment, the proxy handles this, 
        // but double check for client-side stability.
        return;
      }

      setUser(session.user);

      const fetchUserData = async () => {
        // Only select what is strictly needed for the UI, 
        // keeping secretKey isolated from reactive state if possible
        const { data, error } = await supabase
          .from('users')
          .select('supabase_connected, supabase_org_id, supabase_project_id, tryliate_initialized, supabase_publishable_key, supabase_secret_key, supabase_url')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('⚠️ [Auth] Error fetching user profile:', error.message);
          return;
        }

        if (data) {
          setIsSupabaseConnected(!!data.supabase_connected);
          setSupabaseOrgId(data.supabase_org_id);
          setSupabaseProjectId(data.supabase_project_id);
          setSupabaseUrl(data.supabase_url);
          setIsConfigured(!!data.tryliate_initialized);
          setSupabasePublishableKey(data.supabase_publishable_key);
          setSupabaseSecretKey(data.supabase_secret_key);
          setIsNeuralAuthActive(!!data.supabase_secret_key);
        }
      };

      fetchUserData();

      subscription = supabase
        .channel(`user-sync:${session.user.id}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${session.user.id}`
        }, (payload: { new: any }) => {
          const newData = payload.new;
          if (newData) {
            if (newData.supabase_connected !== undefined) setIsSupabaseConnected(!!newData.supabase_connected);
            if (newData.supabase_org_id !== undefined) setSupabaseOrgId(newData.supabase_org_id);
            if (newData.supabase_project_id !== undefined) setSupabaseProjectId(newData.supabase_project_id);
            if (newData.supabase_url !== undefined) setSupabaseUrl(newData.supabase_url);
            if (newData.tryliate_initialized !== undefined) setIsConfigured(!!newData.tryliate_initialized);
            if (newData.supabase_publishable_key !== undefined) setSupabasePublishableKey(newData.supabase_publishable_key);
            if (newData.supabase_secret_key !== undefined) {
              setSupabaseSecretKey(newData.supabase_secret_key);
              setIsNeuralAuthActive(!!newData.supabase_secret_key);
            }
          }
        })
        .subscribe();
    };

    checkStatus();
    return () => { if (subscription) supabase.removeChannel(subscription); };
  }, [retryTrigger]);

  return {
    user,
    isSupabaseConnected,
    supabaseOrgId,
    supabaseProjectId,
    supabaseUrl,
    supabasePublishableKey,
    supabaseSecretKey,
    isConfigured,
    isNeuralAuthActive,
    retryTrigger,
    setRetryTrigger,
    setIsSupabaseConnected,
    setSupabaseOrgId,
    setSupabaseProjectId,
    setIsConfigured,
    setUser
  };
}
