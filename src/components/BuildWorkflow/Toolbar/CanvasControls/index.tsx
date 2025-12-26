import React from 'react';
import { Minus, Maximize, Plus } from 'lucide-react';
import { Tooltip } from '../../../ui/Tooltip';
import { CapsuleItem } from '../../../ui/Capsule';

interface CanvasControlsProps {
  zoomIn: (options?: { duration?: number }) => void;
  zoomOut: (options?: { duration?: number }) => void;
  fitView: (options?: { duration?: number }) => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({ zoomIn, zoomOut, fitView }) => {
  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center', paddingRight: '4px' }}>
      <Tooltip content="Shrink" shortcutIcon={Minus} side="bottom">
        <CapsuleItem onClick={() => zoomOut({ duration: 300 })} style={{ padding: '6px', height: '32px', width: '32px', justifyContent: 'center' }}>
          <Minus size={14} />
        </CapsuleItem>
      </Tooltip>
      <Tooltip content="Focus" shortcutIcon={Maximize} side="bottom">
        <CapsuleItem onClick={() => fitView({ duration: 300 })} style={{ padding: '6px', height: '32px', width: '32px', justifyContent: 'center' }}>
          <Maximize size={12} />
        </CapsuleItem>
      </Tooltip>
      <Tooltip content="Enlarge" shortcutIcon={Plus} side="bottom">
        <CapsuleItem onClick={() => zoomIn({ duration: 300 })} style={{ padding: '6px', height: '32px', width: '32px', justifyContent: 'center' }}>
          <Plus size={14} />
        </CapsuleItem>
      </Tooltip>
    </div>
  );
};
