import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from '@xyflow/react';
import { Pencil } from 'lucide-react';
import { useEdgeConfig } from './EdgeConfigContext';

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const { openConfig, runStatus } = useEdgeConfig();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (evt: React.MouseEvent, id: string) => {
    evt.stopPropagation();
    openConfig(id);
  };

  const isRunning = runStatus === 'running';

  return (
    <>
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .edge-running {
          animation: dash 0.5s linear infinite;
          stroke: #fff !important;
          stroke-width: 5px !important;
          opacity: 1 !important;
        }
      `}</style>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeDasharray: isRunning ? '10,10' : '10,6',
          strokeLinecap: 'round',
          opacity: isRunning ? 1 : 0.8,
          strokeWidth: isRunning ? 5 : 4.5,
        }}
        className={isRunning ? 'edge-running' : ''}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            zIndex: 100,
            willChange: 'transform',
          }}
          className="nodrag nopan"
        >
          <button
            onClick={(e) => onEdgeClick(e, id)}
            style={{
              width: '18px',
              height: '18px',
              background: '#0a0a0a',
              color: '#fff',
              border: '2px solid #333',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.8)',
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#fff';
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.transform = 'scale(1.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.background = '#0a0a0a';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Pencil size={10} />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
