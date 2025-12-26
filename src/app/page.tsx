"use client";

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { BuildWorkflow } from '../components/BuildWorkflow';
import Dashboard from '../components/Dashboard';
import NeuralEngine from '../components/NeuralEngine';
import { WorkplaceContainer } from '../components/ui/WorkplaceContainer';
import { LoginOverlay } from '../components/LoginOverlay';
import { UpgradeOverlay } from '../components/Pricing';
import { Tooltip } from '../components/ui/Tooltip';

export default function PlatformPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [activeView, setActiveView] = useState('studio');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: 'var(--bg-app)',
      color: 'var(--text-primary)',
      overflow: 'hidden'
    }}>
      {/* 1. Sidebar on Left */}
      <div style={{
        width: isSidebarVisible ? 'var(--sidebar-width)' : '0px',
        overflow: 'hidden',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isSidebarVisible ? 1 : 0,
        pointerEvents: isSidebarVisible ? 'auto' : 'none',
        flexShrink: 0
      }}>
        <Sidebar
          onLoginClick={() => setIsLoginOpen(true)}
          onUpgradeClick={() => setIsUpgradeOpen(true)}
          onCollapse={() => setIsSidebarVisible(false)}
          activeView={activeView}
          onViewChange={setActiveView}
        />
      </div>

      {/* 2. Main Content Area */}
      <main style={{
        flex: 1,
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <WorkplaceContainer>
          {!isSidebarVisible && (
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '24px',
              zIndex: 1000,
              animation: 'fadeIn 0.3s ease-out'
            }}>
              <Tooltip content="Open sidebar" shortcut="⌘\" side="right">
                <div
                  onClick={() => setIsSidebarVisible(true)}
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#fff',
                    opacity: 0.6,
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6'; }}
                >
                  <svg width="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px' }}>
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.35719 3H14.6428C15.7266 2.99999 16.6007 2.99998 17.3086 3.05782C18.0375 3.11737 18.6777 3.24318 19.27 3.54497C20.2108 4.02433 20.9757 4.78924 21.455 5.73005C21.7568 6.32234 21.8826 6.96253 21.9422 7.69138C22 8.39925 22 9.27339 22 10.3572V13.6428C22 14.7266 22 15.6008 21.9422 16.3086C21.8826 17.0375 21.7568 17.6777 21.455 18.27C20.9757 19.2108 20.2108 19.9757 19.27 20.455C18.6777 20.7568 18.0375 20.8826 17.3086 20.9422C16.6008 21 15.7266 21 14.6428 21H9.35717C8.27339 21 7.39925 21 6.69138 20.9422C5.96253 20.8826 5.32234 20.7568 4.73005 20.455C3.78924 19.9757 3.02433 19.2108 2.54497 18.27C2.24318 17.6777 2.11737 17.0375 2.05782 16.3086C1.99998 15.6007 1.99999 14.7266 2 13.6428V10.3572C1.99999 9.27341 1.99998 8.39926 2.05782 7.69138C2.11737 6.96253 2.24318 6.32234 2.54497 5.73005C3.02433 4.78924 3.78924 4.02433 4.73005 3.54497C5.32234 3.24318 5.96253 3.11737 6.69138 3.05782C7.39926 2.99998 8.27341 2.99999 9.35719 3ZM6.85424 5.05118C6.24907 5.10062 5.90138 5.19279 5.63803 5.32698C5.07354 5.6146 4.6146 6.07354 4.32698 6.63803C4.19279 6.90138 4.10062 7.24907 4.05118 7.85424C4.00078 8.47108 4 9.26339 4 10.4V13.6C4 14.7366 4.00078 15.5289 4.05118 16.1458C4.10062 16.7509 4.19279 17.0986 4.32698 17.362C4.6146 17.9265 5.07354 18.3854 5.63803 18.673C5.90138 18.8072 6.24907 18.8994 6.85424 18.9488C7.47108 18.9992 8.26339 19 9.4 19H14.6C15.7366 19 16.5289 18.9992 17.1458 18.9488C17.7509 18.8994 18.0986 18.8072 18.362 18.673C18.9265 18.3854 19.3854 17.9265 19.673 17.362C19.8072 17.0986 19.8994 16.7509 19.9488 16.1458C19.9992 15.5289 20 14.7366 20 13.6V10.4C20 9.26339 19.9992 8.47108 19.9488 7.85424C19.8994 7.24907 19.8072 6.90138 19.673 6.63803C19.3854 6.07354 18.9265 5.6146 18.362 5.32698C18.0986 5.19279 17.7509 5.10062 17.1458 5.05118C16.5289 5.00078 15.7366 5 14.6 5H9.4C8.26339 5 7.47108 5.00078 6.85424 5.05118ZM7 7C7.55229 7 8 7.44772 8 8V16C8 16.5523 7.55229 17 7 17C6.44772 17 6 16.5523 6 16V8C6 7.44772 6.44772 7 7 7Z" fill="currentColor" transform="scale(-1, 1) translate(-24, 0)"></path>
                  </svg>
                </div>
              </Tooltip>
            </div>
          )}
          <div style={{
            flex: 1,
            width: '100%',
            height: '100%',
            position: 'relative',
            // Only apply top padding for non-canvas views to prevent title overlap.
            // For the studio (canvas), we want the dot pattern to cover the entire container fully.
            paddingTop: activeView === 'studio' ? '0' : '12px',
            transition: 'padding-top 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            {activeView === 'dashboard' && <Dashboard />}
            {activeView === 'studio' && <BuildWorkflow />}
            {activeView === 'registry' && <NeuralEngine />}
          </div>

          <UpgradeOverlay
            isOpen={isUpgradeOpen}
            onClose={() => setIsUpgradeOpen(false)}
          />
        </WorkplaceContainer>
      </main>

      <LoginOverlay
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}
