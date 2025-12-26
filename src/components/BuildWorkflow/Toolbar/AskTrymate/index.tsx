import React from 'react';
import { Wand2 } from 'lucide-react';
import { CapsuleItem } from '../../../ui/Capsule';
import { Tooltip } from '../../../ui/Tooltip';

interface AskTrymateProps {
  onTriggerAI?: () => void;
}

export const AskTrymate: React.FC<AskTrymateProps> = ({ onTriggerAI }) => {
  return (
    <Tooltip content="Assistant" shortcutIcon={Wand2} side="bottom">
      <CapsuleItem onClick={() => onTriggerAI?.()} style={{ padding: '8px 14px', whiteSpace: 'nowrap' }}>
        <Wand2 size={14} />
        Ask Trymate
      </CapsuleItem>
    </Tooltip>
  );
};
