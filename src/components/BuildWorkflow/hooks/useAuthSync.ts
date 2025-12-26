import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export function useAuthSync() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [supabaseOrgId, setSupabaseOrgId] = useState<string | null>(null);
  const [supabaseProjectId, setSupabaseProjectId] = useState<string | null>(null);
  const [supabaseServiceRoleKey, setSupabaseServiceRoleKey] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isNeuralAuthActive, setIsNeuralAuthActive] = useState(false);
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
        // keeping serviceRoleKey isolated from reactive state if possible
        const { data, error } = await supabase
          .from('users')
          .select('supabase_connected, supabase_org_id, supabase_project_id, tryliate_initialized')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('⚠️ [Security] Identity verification failed:', error.message);
          return;
        }

        if (data) {
          setIsSupabaseConnected(!!data.supabase_connected);
          setSupabaseOrgId(data.supabase_org_id);
          setSupabaseProjectId(data.supabase_project_id);
          setIsConfigured(!!data.tryliate_initialized);

          // Verify Neural Connectivity without sticking the key into global UI state
          // if (data.supabase_project_id && data.supabase_service_role_key) { ... }
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
            if (newData.tryliate_initialized !== undefined) setIsConfigured(!!newData.tryliate_initialized);
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
