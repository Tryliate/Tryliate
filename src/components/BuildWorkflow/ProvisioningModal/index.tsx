import React, { useState, useEffect, useRef } from 'react';
import { Bot, Check, AlertCircle, Loader2, Database, Server, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProvisioningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
  isLoading: boolean;
  logs: string[];
  isConfigured?: boolean;
  onReset?: () => void;
  onContinue: () => void;
}

const MOCK_TABLES = ['workflows', 'nodes', 'edges', 'users'];

export const ProvisioningModal: React.FC<ProvisioningModalProps> = ({
  isOpen,
  onClose,
  onAllow,
  isLoading,
  logs,
  isConfigured = false,
  onReset,
  onContinue
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedTables, setSelectedTables] = useState<string[]>(MOCK_TABLES);
  const [isDeleting, setIsDeleting] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  const toggleTable = (table: string) => {
    setSelectedTables(prev =>
      prev.includes(table) ? prev.filter(t => t !== table) : [...prev, table]
    );
  };

  const handleAllowClick = () => {
    onAllow();
    // Show "Initializing" for 5 seconds, then show "Click to Continue"
    setTimeout(() => {
      setCanContinue(true);
    }, 5000);
  };

  const handleReset = async () => {
    if (!onReset) return;
    setIsDeleting(true);
    await onReset();
    setIsDeleting(false);
  };

  // Auto-scroll logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(10px)',
      zIndex: 11000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          width: '500px',
          background: '#0a0a0a',
          border: '1px solid #222',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 40px 80px rgba(0,0,0,0.8)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glow Element */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px', height: '64px', background: '#111', borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
            border: '1px solid #222', boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
          }}>
            {isConfigured ? <Check size={32} color="#fff" /> : <Bot size={32} color="#fff" />}
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            {isConfigured ? 'Everything is configured! Thank you.' : 'Trymate Infrastructure'}
          </h2>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
            {isConfigured
              ? 'Your neural infrastructure is active and synced.'
              : 'I will provision a dedicated Postgres database and inject the Neural Schema for your project via Supabase.'}
          </p>
        </div>

        {isConfigured ? (
          <div style={{
            background: '#050505',
            borderRadius: '16px',
            border: '1px solid #1a1a1a',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: '#fff', fontWeight: 700 }}>Active Tables</span>
              <span style={{ fontSize: '11px', color: '#444' }}>Select to purge</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {MOCK_TABLES.map(table => (
                <div
                  key={table}
                  onClick={() => toggleTable(table)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    border: selectedTables.includes(table) ? '1px solid #333' : '1px solid transparent'
                  }}
                >
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '4px',
                    border: '1px solid #444',
                    background: selectedTables.includes(table) ? '#fff' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {selectedTables.includes(table) && <Check size={10} color="#000" strokeWidth={4} />}
                  </div>
                  <span style={{ fontSize: '13px', color: '#ccc', fontFamily: 'monospace' }}>public.{table}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleReset}
              disabled={isDeleting || selectedTables.length === 0}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                background: '#200505',
                border: '1px solid #4a1010',
                color: '#ff4444',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <AlertCircle size={14} />}
              {selectedTables.length === MOCK_TABLES.length ? 'Delete Entire Infrastructure' : `Delete Selected (${selectedTables.length})`}
            </button>
          </div>
        ) : (
          <div style={{
            background: '#050505',
            borderRadius: '16px',
            border: '1px solid #1a1a1a',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Server size={16} color="#444" />
              <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>Action Plan</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#888' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#333' }} />
                Analyze account quotas
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#888' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#333' }} />
                Provision 'Tryliate Studio' database
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#888' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#333' }} />
                Inject Neural Schema (Tables & RLS)
              </li>
            </ul>
          </div>
        )}

        {/* Progress Display */}
        {isLoading && !isConfigured && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              height: '4px',
              background: '#222',
              borderRadius: '2px',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '12px'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: canContinue ? '100%' : '40%',
                background: canContinue ? '#4f4' : '#fff',
                borderRadius: '2px',
                animation: canContinue ? 'none' : 'indeterminate 1.5s ease-in-out infinite',
                transition: 'all 0.5s'
              }} />
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: canContinue ? '#4f4' : '#666',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {canContinue ? <Check size={12} /> : <Loader2 size={12} className="animate-spin" />}
                <span>{canContinue ? 'Infrastructure Ready' : 'Initializing Neural Infrastructure...'}</span>
              </div>
              <span style={{ opacity: 0.5 }}>{canContinue ? '100%' : '...'}</span>
            </div>
          </div>
        )}
        <style>{`
          @keyframes indeterminate {
            0% { left: -40%; }
            100% { left: 100%; }
          }
        `}</style>

        {canContinue ? (
          <button
            onClick={onContinue}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '16px',
              background: '#fff',
              border: 'none',
              color: '#000',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 0 20px rgba(255,255,255,0.2)'
            }}
          >
            Click to Continue <ArrowRight size={18} />
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              disabled={isLoading || isDeleting}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '16px',
                background: 'transparent',
                border: '1px solid #333',
                color: '#888',
                fontWeight: 600,
                cursor: (isLoading || isDeleting) ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                opacity: isLoading ? 0.3 : 1
              }}
            >
              {isConfigured ? 'Close' : 'Cancel'}
            </button>

            {!isConfigured && (
              <button
                onClick={handleAllowClick}
                disabled={isLoading}
                style={{
                  flex: 2,
                  padding: '14px',
                  borderRadius: '16px',
                  background: isLoading ? '#222' : '#fff',
                  border: 'none',
                  color: '#000',
                  fontWeight: 800,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Provisioning...
                  </>
                ) : (
                  <>
                    Allow & Provision
                    <Check size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        <style>{`
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </motion.div>
    </div>
  );
};
