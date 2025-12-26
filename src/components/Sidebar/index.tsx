"use client";

import { useState, useEffect } from 'react';
import { User, ChevronRight } from 'lucide-react';
import { Capsule, CapsuleItem } from '../ui/Capsule';
import { supabase } from '../../lib/supabase';
import { Navigation } from './Navigation';
import { HistoryList } from './HistoryList';
import { UserMenuDropup } from './UserMenuDropup';
import { UpgradeDropup } from './UpgradeDropup';

interface SidebarProps {
  onLoginClick?: () => void;
  onUpgradeClick?: () => void;
  onCollapse?: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ onLoginClick, onUpgradeClick, onCollapse, activeView, onViewChange }: SidebarProps) {
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 172800) return 'Yesterday';
    return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    const verifyUserLiveness = async (sessionUser: any, event?: string) => {
      if (!sessionUser) {
        setUser(null);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, avatar_url')
        .eq('id', sessionUser.id)
        .single();

      if (error || !data) {
        if (event !== 'SIGNED_IN' && event !== 'INITIAL_SESSION') {
          await supabase.auth.signOut();
          setUser(null);
        } else {
          setUser(sessionUser);
        }
      } else {
        setUser({ ...sessionUser, ...data });
      }
    };

    supabase.auth.getSession().then((payload: any) => {
      verifyUserLiveness(payload.data?.session?.user ?? null, 'INITIAL_SESSION');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      verifyUserLiveness(session?.user ?? null, event);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.id) {
      const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
          const { data, error } = await supabase
            .from('workspace_history')
            .select('*')
            .eq('user_id', user.id)
            .order('last_accessed_at', { ascending: false })
            .limit(10);

          if (data) {
            setHistory(data);
          }
        } catch (err) {
          console.error('Failed to fetch workspace history:', err);
        } finally {
          setIsLoadingHistory(false);
        }
      };
      fetchHistory();

      const channel = supabase
        .channel('workspace-history-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'workspace_history',
          filter: `user_id=eq.${user.id}`
        }, (payload: any) => {
          fetchHistory();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setHistory([]);
    }
  }, [user?.id]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) console.error('❌ Logout Error:', error);
      else console.log('✅ Signed out successfully');
    } catch (err) {
      console.error('❌ Logout Exception:', err);
    }
  };

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      background: 'var(--bg-sidebar)',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid transparent',
      color: 'var(--text-secondary)',
      fontSize: '13px',
      overflow: 'hidden'
    }}>
      <Navigation activeView={activeView} onViewChange={onViewChange} onCollapse={onCollapse} />

      <HistoryList
        user={user}
        history={history}
        isLoadingHistory={isLoadingHistory}
        onLoginClick={onLoginClick}
        getTimeAgo={getTimeAgo}
      />

      {/* Fixed Bottom Section */}
      <div style={{ padding: '0 24px 16px 24px', flexShrink: 0 }}>
        <div style={{ paddingTop: '8px', position: 'relative', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
          <Capsule style={{ border: '1px solid #222' }}>
            {user ? (
              <CapsuleItem
                active
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{ flex: 1, padding: '4px 8px', gap: '8px', background: isUserMenuOpen ? 'rgba(255,255,255,0.05)' : '#0a0a0a', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {user.avatar_url || user.user_metadata?.avatar_url ? (
                  <img
                    src={user.avatar_url || user.user_metadata.avatar_url}
                    alt="profile"
                    style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <User size={14} />
                )}
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '120px'
                }}>
                  {user.full_name || user.user_metadata?.full_name || 'Architect'}
                </span>

                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', opacity: 0.3 }}>
                  <ChevronRight size={10} style={{ transform: isUserMenuOpen ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </div>
              </CapsuleItem>
            ) : (
              <>
                <CapsuleItem
                  active
                  onClick={onLoginClick}
                  style={{ flex: 1, background: '#161616', textAlign: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  Log in
                </CapsuleItem>
                <div
                  onClick={() => setIsUpgradeOpen(!isUpgradeOpen)}
                  style={{
                    padding: '0 12px',
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: isUpgradeOpen ? '#fff' : '#fff',
                    opacity: isUpgradeOpen ? 1 : 0.6,
                    background: isUpgradeOpen ? 'rgba(255,255,255,0.05)' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  Upgrade
                </div>
              </>
            )}
          </Capsule>

          {isUserMenuOpen && user && (
            <UserMenuDropup
              user={user}
              onLogout={() => {
                setUser(null);
                handleLogout();
              }}
              onClose={() => setIsUserMenuOpen(false)}
            />
          )}

          {isUpgradeOpen && (
            <UpgradeDropup
              onUpgradeClick={onUpgradeClick}
              onClose={() => setIsUpgradeOpen(false)}
            />
          )}
        </div>
      </div>
    </aside>
  );
}
