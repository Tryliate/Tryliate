"use client";

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const syncUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('📡 [Neural Sync] Authenticated. Verifying architecture footprint...');

        // Proactive Neural Upsert: Ensure the user exists in our public table
        const { error } = await supabase
          .from('users')
          .upsert({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || 'Architect',
            avatar_url: session.user.user_metadata?.avatar_url || ''
          }, { onConflict: 'id' });

        if (error) {
          console.error('❌ [Neural Sync] Footprint upsert failed. Error Details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          // Log the raw error just in case
          console.error('Raw Sync Error:', error);
        } else {
          console.log('✅ [Neural Sync] Footprint verified. Session User ID:', session.user.id);
        }

        router.push('/');
      }
    };

    syncUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (event === 'SIGNED_IN' && session) {
        syncUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div style={{
      height: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="animate-spin" style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#fff',
          borderRadius: '50%',
          margin: '0 auto 20px auto'
        }} />
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#666' }}>Synchronizing architecture credentials...</p>
      </div>
    </div>
  );
}
