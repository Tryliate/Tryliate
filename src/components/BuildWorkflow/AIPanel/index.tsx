'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Loader2, Plus, ChevronDown, ChevronUp, Globe, Box, LayoutPanelLeft, Activity, Edit3, Trash2 } from 'lucide-react';
import { FlowSpace } from './FlowSpace';
import { supabase } from '../../../lib/supabase';
import { askAI } from '../../../lib/ai/actions';
import { MODELS } from '../../../lib/ai/constants';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownComponents: Components = {
  table: ({ node, ...props }) => (
    <div style={{
      overflowX: 'auto',
      margin: '12px 0',
      borderRadius: '10px',
      border: '1px solid #222',
      background: '#0d0d0d',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '11px',
        color: '#aaa'
      }} {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <thead style={{ background: '#151515', borderBottom: '1px solid #222' }} {...props} />,
  th: ({ node, ...props }) => <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 800, color: '#fff', textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.05em' }} {...props} />,
  td: ({ node, ...props }) => <td style={{ padding: '10px 14px', borderBottom: '1px solid #1a1a1a' }} {...props} />,
  p: ({ node, ...props }) => <p style={{ margin: '0 0 12px 0', lineHeight: '1.6', fontSize: '13px' }} {...props} />,
  strong: ({ node, ...props }) => <strong style={{ color: '#fff', fontWeight: 800 }} {...props} />,
  ul: ({ node, ...props }) => <ul style={{ margin: '0 0 12px 20px', padding: 0, listStyleType: 'square', color: '#888' }} {...props} />,
  li: ({ node, ...props }) => <li style={{ marginBottom: '6px' }} {...props} />,
  h1: ({ node, ...props }) => <h1 style={{ fontSize: '16px', fontWeight: 900, color: '#fff', margin: '20px 0 12px 0', borderBottom: '1px solid #222', paddingBottom: '8px' }} {...props} />,
  h2: ({ node, ...props }) => <h2 style={{ fontSize: '14px', fontWeight: 900, color: '#fff', margin: '18px 0 10px 0' }} {...props} />,
  h3: ({ node, ...props }) => <h3 style={{ fontSize: '12px', fontWeight: 900, color: '#fff', margin: '16px 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }} {...props} />,
  pre: ({ node, ...props }) => (
    <div style={{
      margin: '16px 0',
      background: '#0a0a0a',
      border: '1px solid #222',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
    }}>
      <div style={{
        padding: '8px 14px',
        background: '#111',
        borderBottom: '1px solid #222',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#333' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#333' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#333' }} />
        </div>
        <span style={{ fontSize: '8px', fontWeight: 900, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Neural Source</span>
      </div>
      <pre style={{
        margin: 0,
        padding: '16px',
        overflowX: 'auto',
        fontSize: '11px',
        fontFamily: 'monospace',
        color: '#d1d1d1',
        lineHeight: '1.6'
      }} {...props} />
    </div>
  ),
  code: ({ node, inline, ...props }: any) => {
    if (inline) {
      return (
        <code
          style={{
            background: '#1a1a1a',
            padding: '2px 5px',
            borderRadius: '5px',
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#fff',
            border: '1px solid #2a2a2a'
          }}
          {...props}
        />
      );
    }
    return <code {...props} />;
  }
};

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  graphContext: string;
  isEmbedded?: boolean;
  isMinimal?: boolean;
  title?: string;
  selectedNodeData?: any;
  executionLogs?: string[];
  isExecuting?: boolean;
  aiTokens?: number;
  setAiTokens?: (v: number | ((prev: number) => number)) => void;
  user?: any;
}

const FOUNDRY_SUGGESTIONS: Record<string, string[]> = {
  'AI CORE': ['Latency Check', 'Context Window', 'Fine-Tune', 'Cost Analysis'],
  'INFRA': ['Scale Strategy', 'Region Latency', 'Cost Forecast', 'Uptime'],
  'DATA': ['Schema Map', 'Backup Policy', 'Query Opt', 'Migration'],
  'LOGIC': ['Flow Logic', 'Error Handle', 'Trigger Sync', 'Payload'],
  'AUTH': ['OAuth Scope', 'JWT Valid', 'User Sync', 'RLS Policy'],
  'default': ['Connect', 'Configure', 'Debug', 'Optimize']
};

const getSuggestionChips = (category: string) => {
  return FOUNDRY_SUGGESTIONS[category] || FOUNDRY_SUGGESTIONS['default'];
};

const TypewriterText = ({
  text,
  delay = 15,
  onComplete,
  scrollRef
}: {
  text: string,
  delay?: number,
  onComplete?: () => void,
  scrollRef?: React.RefObject<HTMLDivElement | null>
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);

        // Auto-scroll as we type
        if (scrollRef?.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, delay);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, delay, onComplete, scrollRef]);

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
      {displayedText}
    </ReactMarkdown>
  );
};

export const AIPanel: React.FC<AIPanelProps> = ({
  isOpen,
  onClose,
  graphContext,
  isEmbedded = false,
  isMinimal = false,
  title = "Trymate",
  selectedNodeData,
  executionLogs = [],
  isExecuting = false,
  aiTokens,
  setAiTokens,
  user
}) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<keyof typeof MODELS>('FREE_MATE');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<'Web' | 'Plan' | 'Build'>('Build');
  const [isPhaseDropdownOpen, setIsPhaseDropdownOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'CHAT' | 'EXECUTION'>('CHAT');
  const scrollRef = useRef<HTMLDivElement>(null);
  const logScrollRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const lastRequestRef = useRef<string>('');

  // Flow Space Management
  const [currentFlowId, setCurrentFlowId] = useState<string | null>(null);

  // Sync messages with current flow
  useEffect(() => {
    if (!currentFlowId) {
      setMessages([]);
      return;
    }

    const loadThread = async () => {
      const { data, error } = await supabase
        .from('flow_space')
        .select('messages')
        .eq('id', currentFlowId)
        .single();

      if (data) {
        setMessages(data.messages || []);
      }
    };

    loadThread();
  }, [currentFlowId]);

  const handleNewFlow = () => {
    setCurrentFlowId(null);
    setMessages([]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (logScrollRef.current) {
      logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
    }
  }, [executionLogs]);

  // Auto-switch to execution mode when execution starts
  useEffect(() => {
    if (isExecuting) {
      setActiveMode('EXECUTION');
    }
  }, [isExecuting]);

  // Reset messages when title changes to re-trigger insight
  useEffect(() => {
    if (isEmbedded || isMinimal) {
      setMessages([]);
      setShowSuggestions(false);
      lastRequestRef.current = ''; // Clear request track on node change
    }
  }, [title, isEmbedded, isMinimal]);

  // Automated Insight for Embedded Mode
  useEffect(() => {
    if ((isEmbedded || isMinimal) && messages.length === 0 && title !== "Trymate" && title !== lastRequestRef.current) {
      const triggerInitialInsight = async () => {
        const currentTitle = title;
        lastRequestRef.current = currentTitle;
        setIsLoading(true);
        setShowSuggestions(false);

        // Token consumption for auto-insights
        if (user?.id && setAiTokens && aiTokens !== undefined) {
          if (aiTokens < 10) {
            setMessages([{ role: 'assistant', content: "Neural Depletion: TopUp required for automated insights." }]);
            setIsLoading(false);
            return;
          }
          setAiTokens(prev => prev - 10);
        }

        try {
          const prompt = `Provide a technical insight for the MCP component: "${currentTitle}". 
          Format: BRIEF: [1-2 sentences] | SUGGESTIONS: [TAG1], [TAG2], [TAG3]
          Note: SUGGESTIONS must be very short, one-word or slug-like technical tags (e.g., DATA-FLOW, AUTH-LOGIC). 
          Keep it high-density and professional.`;

          const response = await askAI(prompt, MODELS[selectedModel]);

          // Only update if we are still looking at the same node
          if (lastRequestRef.current === currentTitle) {
            setMessages([{ role: 'assistant', content: response }]);
          }
        } catch (error) {
          if (lastRequestRef.current === currentTitle) {
            setMessages([{ role: 'assistant', content: "Trymate Insight: This node is part of the Neural Foundry. Connect it to orchestrate advanced logic." }]);
          }
        } finally {
          if (lastRequestRef.current === currentTitle) {
            setIsLoading(false);
            if (isMinimal && selectedNodeData) {
              // Inject Foundry Suggestions artificially if AI fails or returns plain text
              setShowSuggestions(true);
            }
          }
        }
      };
      triggerInitialInsight();
    }
  }, [isEmbedded, isMinimal, title, messages.length, selectedModel, selectedNodeData]);

  if (!isOpen) return null;

  const PHASES = [
    { label: 'Web', icon: Globe },
    { label: 'Plan', icon: LayoutPanelLeft },
    { label: 'Build', icon: Box }
  ] as const;

  const ActiveIcon = PHASES.find(p => p.label === selectedPhase)?.icon || Box;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Token consumption logic (10 tokens per response, if logged in)
    if (user?.id && setAiTokens && aiTokens !== undefined) {
      if (aiTokens < 10) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Neural Depletion: Insufficient tokens. Please TopUp to continue architectural insights." }]);
        setIsLoading(false);
        return;
      }
      setAiTokens(prev => prev - 10);
    }

    const userMessage = input.trim();
    setInput('');
    const updatedUserMessages = [...messages, { role: 'user', content: userMessage }] as any;
    setMessages(updatedUserMessages);
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const prompt = `Phase: ${selectedPhase}\nGraph Context: ${graphContext}\n\nUser Question: ${userMessage}`;
      const response = await askAI(prompt, MODELS[selectedModel]);
      const finalMessages = [...updatedUserMessages, { role: 'assistant', content: response }];
      setMessages(finalMessages);

      // Persist to Flow Space
      if (user?.id) {
        if (!currentFlowId) {
          // Create new thread
          const title = userMessage.split(' ').slice(0, 3).join(' ') || 'New Flow';
          const { data, error } = await supabase
            .from('flow_space')
            .insert({
              user_id: user.id,
              name: title,
              messages: finalMessages
            })
            .select()
            .single();

          if (data) setCurrentFlowId(data.id);
        } else {
          // Update existing
          await supabase
            .from('flow_space')
            .update({
              messages: finalMessages,
              updated_at: new Date().toISOString()
            })
            .eq('id', currentFlowId);
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Neural Interface Exception: Could not reach the core. Please check your connectivity." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: (isEmbedded || isMinimal) ? 'relative' : 'absolute',
      right: (isEmbedded || isMinimal) ? '0' : '24px',
      top: (isEmbedded || isMinimal) ? '0' : '20px',
      bottom: (isEmbedded || isMinimal) ? '0' : '85px',
      width: (isEmbedded || isMinimal) ? '100%' : '340px',
      height: (isEmbedded || isMinimal) ? '100%' : 'auto',
      background: (isEmbedded || isMinimal) ? 'transparent' : '#0a0a0a',
      border: (isEmbedded || isMinimal) ? 'none' : '1px solid #1a1a1a',
      borderRadius: (isEmbedded || isMinimal) ? '0' : '24px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 5001,
      overflow: 'hidden',
    }}>
      <style>{`
        .chat-scroll::-webkit-scrollbar { width: 3px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .chat-scroll::-webkit-scrollbar-thumb:hover { background: #333; }
        @keyframes tryliatePulse {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(200%); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-slow { animation: spin-slow 3s linear infinite; }
      `}</style>

      {/* Header Area (Hidden in Minimal) */}
      {/* Header Area (Hidden in Minimal) */}
      {!isMinimal && (
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #161616', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '6px', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Sparkles size={12} color="#000" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ color: '#fff', fontWeight: 900, fontSize: '11px', whiteSpace: 'nowrap', letterSpacing: '-0.01em', lineHeight: 1 }}>{title}</div>
                <div style={{
                  color: '#444', fontSize: '7px', fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '0.06em', whiteSpace: 'nowrap', opacity: 0.8, marginTop: '2px'
                }}>
                  {activeMode === 'EXECUTION' ? 'TRACE' : (isEmbedded ? 'ANALYST' : 'ARCHITECT')}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FlowSpace
                currentFlowId={currentFlowId}
                setCurrentFlowId={setCurrentFlowId}
                activeMode={activeMode}
                setActiveMode={setActiveMode}
                onNewFlow={handleNewFlow}
                user={user}
              />

              {!isEmbedded && (
                <div style={{ position: 'relative' }}>
                  <div onClick={() => setIsPhaseDropdownOpen(!isPhaseDropdownOpen)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 10px', borderRadius: '20px',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '10px', fontWeight: 900,
                      cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s', height: '24px', justifyContent: 'space-between'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ActiveIcon size={10} color="#666" />
                      <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>{selectedPhase}</span>
                    </div>
                    <ChevronUp size={10} style={{ transform: isPhaseDropdownOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s', opacity: 0.5 }} />
                  </div>
                  {isPhaseDropdownOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: '12px', background: '#111', border: '1px solid #222',
                      borderRadius: '10px', padding: '4px', zIndex: 30, width: '90px', boxShadow: '0 8px 16px rgba(0,0,0,0.5)'
                    }}>
                      {PHASES.map((p) => (
                        <div
                          key={p.label}
                          onClick={() => { setSelectedPhase(p.label); setIsPhaseDropdownOpen(false); }}
                          style={{
                            padding: '5px 8px', borderRadius: '6px', color: selectedPhase === p.label ? '#fff' : '#666',
                            fontSize: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                          }}
                        >
                          <p.icon size={9} />
                          {p.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <button onClick={onClose} style={{
                width: '24px', height: '24px', borderRadius: '50%', background: 'transparent',
                border: 'none', color: '#444', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
              }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}>
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Structured Content Area */}
      {
        activeMode === 'CHAT' ? (
          <div ref={scrollRef} className="chat-scroll" style={{
            flex: 1,
            overflowY: 'auto',
            padding: isMinimal ? '0' : '20px 16px 100px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            scrollBehavior: 'smooth'
          }}>
            {isLoading && messages.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
                <div style={{
                  color: '#333',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase'
                }}>
                  Synchronizing neural data
                </div>
                <div style={{
                  width: '100%', height: '1px', background: 'rgba(255,255,255,0.03)', borderRadius: '2px', overflow: 'hidden', position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, height: '100%', width: '60%',
                    background: 'linear-gradient(90deg, transparent, #fff, transparent)',
                    animation: 'tryliatePulse 1.5s infinite ease-in-out'
                  }} />
                </div>
              </div>
            )}

            {(!isLoading && messages.length === 0) && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#222', textAlign: 'center', gap: '12px' }}>
                <Sparkles size={32} opacity={0.2} style={{ alignSelf: 'center' }} />
                <div style={{ fontWeight: 800, letterSpacing: '0.1em' }}>TRYMATE NEURAL</div>
                <div style={{ fontSize: '9px', fontWeight: 600 }}>Ready to architect your flow.</div>
              </div>
            )}

            {messages.map((msg, i) => {
              const content = msg.content;
              const hasSuggestions = content.includes('SUGGESTIONS:');
              let briefPart = content.split('SUGGESTIONS:')[0].replace('BRIEF:', '').trim();

              // Foundry Suggestion Logic
              let suggestionsPart: string[] = [];
              if (content.includes('SUGGESTIONS:')) {
                suggestionsPart = content.split('SUGGESTIONS:')[1].split(',');
              }

              return (
                <div key={i} style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  width: msg.role === 'user' ? '100%' : 'auto',
                  maxWidth: msg.role === 'user' ? '70%' : '90%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{
                    padding: msg.role === 'user' ? '6px 12px' : '12px 18px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '24px 24px 24px 4px',
                    background: msg.role === 'user' ? '#fff' : '#111',
                    color: msg.role === 'user' ? '#000' : '#d1d1d1',
                    fontSize: msg.role === 'user' ? '12px' : '13px',
                    lineHeight: msg.role === 'user' ? '1.4' : '1.6',
                    border: msg.role === 'user' ? 'none' : '1px solid #1a1a1a',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    textAlign: msg.role === 'user' ? 'left' : 'justify',
                    width: '100%',
                    minWidth: '40px'
                  }}>
                    {isMinimal ? (
                      <TypewriterText
                        text={msg.role === 'user' ? content : briefPart}
                        delay={8}
                        onComplete={() => i === messages.length - 1 && setShowSuggestions(true)}
                        scrollRef={scrollRef}
                      />
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={MarkdownComponents}
                      >
                        {content}
                      </ReactMarkdown>
                    )}
                  </div>

                  {msg.role === 'assistant' && hasSuggestions && showSuggestions && i === messages.length - 1 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '0 4px 8px 4px', animation: 'fadeIn 0.5s ease-out' }}>
                      {suggestionsPart.map((s, idx) => {
                        const suggestionText = s.trim();
                        if (!suggestionText) return null;
                        return (
                          <div
                            key={idx}
                            onClick={() => { setInput(suggestionText); setTimeout(() => handleSend(), 10); }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px',
                              background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '16px',
                              fontSize: '9px', fontWeight: 700, color: '#888', cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = '#222'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888'; e.currentTarget.style.background = '#1a1a1a'; }}
                          >
                            <Plus size={10} color="#666" />
                            <span>{suggestionText}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div style={{
                    fontSize: '9px', fontWeight: 900, color: '#333', textTransform: 'uppercase',
                    letterSpacing: '0.1em', padding: '0 12px', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start'
                  }}>
                    {msg.role === 'user' ? 'Authorized Protocol' : (isMinimal ? 'Neural Analyst' : 'Neural Core')}
                  </div>
                </div>
              );
            })}
            {isLoading && messages.length > 0 && (
              <div style={{ alignSelf: 'flex-start', padding: '12px 16px', background: '#111', borderRadius: '20px 20px 20px 4px', border: '1px solid #1a1a1a', opacity: 0.5 }}>
                <Loader2 size={14} className="animate-spin" color="#fff" />
              </div>
            )}
          </div>
        ) : (
          <div ref={logScrollRef} className="chat-scroll" style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            background: '#050505',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontFamily: 'monospace',
            fontSize: '10px'
          }}>
            {(!executionLogs || executionLogs.length === 0) ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#222', textAlign: 'center', gap: '12px' }}>
                <Activity size={32} opacity={0.2} style={{ alignSelf: 'center' }} />
                <div style={{ fontWeight: 800, letterSpacing: '0.1em' }}>NO ACTIVE TRACE</div>
                <div style={{ fontSize: '9px', fontWeight: 600 }}>Execute a workflow to see live neural logs.</div>
              </div>
            ) : (
              <>
                <div style={{
                  color: '#444',
                  fontSize: '9px',
                  marginBottom: '10px',
                  borderBottom: '1px solid #111',
                  paddingBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>NEURAL FLOW v1.1.1</span>
                  <span style={{ color: '#fff', fontWeight: 900 }}>LIVE TTY</span>
                </div>
                {executionLogs.map((log: string, idx: number) => {
                  // Determine weight/opacity based on intent but strictly monochrome
                  let color = '#d1d1d1'; // Default theme text
                  let isMemoryRecall = false;

                  if (log.includes('🚀') || log.includes('✅') || log.includes('SUCCESS') || log.includes('Passing')) {
                    color = '#fff'; // Highlighted active events
                  } else if (log.includes('🧠') || log.includes('Agent')) {
                    color = '#888'; // Subdued internal processing
                  } else if (log.includes('❌') || log.includes('ERROR')) {
                    color = '#fff'; // Errors are also white but context-driven (icon/text)
                  } else if (log.includes('Accessing Neural Memory')) {
                    isMemoryRecall = true;
                    color = '#a78bfa'; // Neural purple for recall
                  }

                  return (
                    <div key={idx} style={{ display: 'flex', gap: '10px', animation: 'fadeIn 0.2s ease-out' }}>
                      <span style={{ color: '#222', minWidth: '20px', fontWeight: 700 }}>{(idx + 1).toString().padStart(2, '0')}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {isMemoryRecall ? (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(167, 139, 250, 0.1)',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid rgba(167, 139, 250, 0.2)'
                          }}>
                            <Sparkles size={10} color="#a78bfa" className="spin-slow" />
                            <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>NEURAL RECALL INITIATED</span>
                          </div>
                        ) : (
                          <span style={{ color, letterSpacing: '0.02em' }}>{log.replace(/🚀|✅|❌|🧠|📡/g, '').trim()}</span>
                        )}
                        {isMemoryRecall && (
                          <div style={{ marginLeft: '12px', marginTop: '4px', height: '20px', borderLeft: '1px solid #333', paddingLeft: '8px', display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '9px', color: '#666', fontStyle: 'italic' }}>Fetching context from vector store...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {isExecuting && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ color: '#222', minWidth: '20px' }}>{(executionLogs.length + 1).toString().padStart(2, '0')}</span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#fff', animation: 'tryliatePulse 0.8s infinite' }} />
                      <span style={{ color: '#444', fontStyle: 'italic' }}>awaiting next neural cluster...</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )
      }

      {/* Input Area (Hidden in Minimal) */}
      {
        !isMinimal && (
          <div style={{
            padding: '16px', position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'transparent', zIndex: 20
          }}>
            {isPickerOpen && (
              <div style={{
                position: 'absolute', bottom: '70px', left: '16px', right: '16px',
                background: '#0a0a0a', border: '1px solid #222', borderRadius: '20px',
                padding: '6px', display: 'flex', flexDirection: 'column', gap: '4px',
                boxShadow: '0 12px 32px rgba(0,0,0,0.6)', animation: 'fadeIn 0.2s ease-out'
              }}>
                {[
                  { id: 'FREE_MATE', label: 'Free Mate', sub: 'Standard Neural Engine' },
                  { id: 'PRO_MATE', label: 'Pro Mate', sub: 'Advanced Architectural Core' }
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => { setSelectedModel(m.id as any); setIsPickerOpen(false); }}
                    style={{
                      padding: '10px 16px', borderRadius: '14px', cursor: 'pointer',
                      background: selectedModel === m.id ? '#fff' : 'transparent',
                      color: selectedModel === m.id ? '#000' : '#888',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 900 }}>{m.label}</div>
                    <div style={{ fontSize: '9px', opacity: 0.6 }}>{m.sub}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{
              display: 'flex', alignItems: 'center', background: '#111', border: '1px solid #222',
              borderRadius: '30px', padding: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
              <button
                onClick={() => setIsPickerOpen(!isPickerOpen)}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%', background: isPickerOpen ? '#fff' : '#1a1a1a',
                  border: 'none', color: isPickerOpen ? '#000' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {isPickerOpen ? <ChevronUp size={16} /> : <Plus size={16} />}
              </button>
              <input
                type="text"
                placeholder={`Ask ${selectedModel === 'PRO_MATE' ? 'Pro' : 'Free'} Mate...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                style={{ flex: 1, background: 'none', border: 'none', padding: '0 12px', color: '#fff', fontSize: '13px', outline: 'none' }}
              />
              <button
                onClick={handleSend}
                aria-label="Send Message"
                disabled={!input.trim() || isLoading}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: input.trim() ? '#fff' : 'transparent',
                  border: 'none', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: input.trim() ? 'pointer' : 'default', transition: 'all 0.2s',
                  opacity: input.trim() ? 1 : 0
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )
      }
    </div >
  );
};
