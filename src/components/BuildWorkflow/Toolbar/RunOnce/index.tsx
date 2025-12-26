import React from 'react';
import { Play } from 'lucide-react';
import { Tooltip } from '../../../ui/Tooltip';
import { WorkflowButton } from '../../../ui/WorkflowButton';

interface RunOnceProps {
  onRunTest?: () => void;
}

export const RunOnce: React.FC<RunOnceProps> = ({ onRunTest }) => {
  return (
    <Tooltip content="Launch" shortcutIcon={Play} side="bottom">
      <WorkflowButton
        onClick={() => onRunTest?.()}
        icon={<Play size={14} fill="currentColor" />}
        style={{ height: '32px', padding: '0 16px', whiteSpace: 'nowrap', width: '100%' }}
      >
        Run Once
      </WorkflowButton>
    </Tooltip>
  );
};
