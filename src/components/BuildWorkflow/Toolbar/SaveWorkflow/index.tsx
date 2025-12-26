import React, { useState } from 'react';
import { Save, X, Loader2, FolderPlus, ChevronUp, LayoutTemplate } from 'lucide-react';
import { Tooltip } from '../../../ui/Tooltip';
import { WorkflowButton } from '../../../ui/WorkflowButton';
import { useReactFlow } from '@xyflow/react';

export const SaveWorkflow: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getNodes, getEdges } = useReactFlow();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    topology: 'Single',
    category: 'SINGLE NODE'
  });

  const handleSave = async () => {
    if (!formData.name) return;
    setLoading(true);

    try {
      const nodes = getNodes();
      const edges = getEdges();

      const response = await fetch('/api/foundry/flows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          nodes,
          edges
        })
      });

      if (response.ok) {
        setIsOpen(false);
        setFormData({ name: '', description: '', topology: 'Single', category: 'SINGLE NODE' });
        // Optional: Trigger global refresh or notification
      } else {
        console.error('Failed to save');
      }
    } catch (error) {
      console.error('Save error', error);
    } finally {
      setLoading(false);
    }
  };

  /* Custom Select Component for Modern Styling */
  const CustomSelect = ({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (val: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
        <label style={{ fontSize: '9px', color: '#666', fontWeight: 700, letterSpacing: '0.05em' }}>{label}</label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: '#111',
            border: isOpen ? '1px solid #444' : '1px solid #222',
            borderRadius: '12px',
            padding: '8px 12px',
            color: '#fff',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '100%'
          }}
        >
          {value}
          <ChevronUp size={12} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: '#666' }} />
        </button>

        {isOpen && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 100 }}
              onClick={() => setIsOpen(false)}
            />
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              zIndex: 101,
              boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
              animation: 'fadeIn 0.1s ease-out'
            }}>
              {options.map(opt => (
                <button
                  key={opt}
                  onClick={() => { onChange(opt); setIsOpen(false); }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    color: value === opt ? '#fff' : '#888',
                    fontSize: '11px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.1s',
                    fontWeight: value === opt ? 600 : 400
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = value === opt ? '#fff' : '#888'; }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <Tooltip content="Save as Template" shortcutIcon={FolderPlus} side="bottom">
        <WorkflowButton
          onClick={() => setIsOpen(!isOpen)}
          icon={<FolderPlus size={16} color={isOpen ? '#000' : '#fff'} />}
          style={{
            height: '32px',
            padding: '0 10px',
            width: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isOpen ? '#fff' : 'transparent',
            color: isOpen ? '#000' : '#fff',
            border: 'none',
            borderRadius: '12px',
            opacity: isOpen ? 1 : 0.8,
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {null}
        </WorkflowButton>
      </Tooltip>

      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '340px',
          background: 'rgba(5, 5, 5, 0.98)',
          backdropFilter: 'blur(30px)',
          borderRadius: '24px',
          border: '1px solid #1a1a1a',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          zIndex: 1000,
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }} onClick={e => e.stopPropagation()}>
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); }
              to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
            }
          `}</style>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a1a1a', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '10px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LayoutTemplate size={14} color="#000" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 900, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Save Template</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: '#111', border: '1px solid #222', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#666'; }}
            >
              <X size={12} />
            </button>
          </div>

          {/* Form Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '9px', color: '#666', fontWeight: 700, letterSpacing: '0.05em' }}>TEMPLATE META</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Template Name..."
                style={{
                  background: '#0a0a0a',
                  border: '1px solid #1a1a1a',
                  borderRadius: '12px',
                  padding: '12px',
                  color: '#fff',
                  fontSize: '11px',
                  outline: 'none',
                  width: '100%',
                  fontFamily: 'inherit'
                }}
              />
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description..."
                style={{
                  background: '#0a0a0a',
                  border: '1px solid #1a1a1a',
                  borderRadius: '12px',
                  padding: '12px',
                  color: '#fff',
                  fontSize: '11px',
                  outline: 'none',
                  minHeight: '60px',
                  resize: 'none',
                  width: '100%',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Custom Dropdowns */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <CustomSelect
                  label="TOPOLOGY"
                  value={formData.topology}
                  options={['Single', 'Star', 'Bus', 'Mesh', 'Hybrid']}
                  onChange={(val) => setFormData({ ...formData, topology: val })}
                />
              </div>
              <div style={{ flex: 1 }}>
                <CustomSelect
                  label="CATEGORY"
                  value={formData.category}
                  options={['Agentic', 'Data', 'Standard', 'Foundry']}
                  onChange={(val) => setFormData({ ...formData, category: val })}
                />
              </div>
            </div>
          </div>

          {/* Recent/Saved List */}
          <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '16px' }}>
            <div style={{ fontSize: '9px', color: '#666', fontWeight: 800, marginBottom: '10px', letterSpacing: '0.05em' }}>SAVED TEMPLATES</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '6px 14px', fontSize: '10px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 800 }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }}></div>
                QUICK SEARCH
              </div>
              <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '6px 14px', fontSize: '10px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 800 }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#444' }}></div>
                DATA PIPELINE
              </div>
              <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '6px 14px', fontSize: '10px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700 }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#222' }}></div>
                AUTO-REPLY
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSave}
            disabled={loading || !formData.name}
            style={{
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '16px',
              padding: '16px',
              fontSize: '11px',
              fontWeight: 900,
              cursor: loading || !formData.name ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s',
              letterSpacing: '0.05em'
            }}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            SAVE CONFIGURATION
          </button>
        </div>
      )}
    </div>
  );
};
