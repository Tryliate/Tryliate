import React from 'react';
import { Workflow } from 'lucide-react';
import { DropupItem } from '../shared/DropupItem';

interface FlowFeedItemProps {
  onOpenOverlay: (category: string, subType: string) => void;
  setOpen: (open: boolean) => void;
}

export const FlowFeedItem: React.FC<FlowFeedItemProps> = ({ onOpenOverlay, setOpen }) => {
  return (
    <DropupItem
      label="Flow Feed"
      icon={Workflow}
      onClick={() => {
        onOpenOverlay('FLOW', 'Flow Feed');
        setOpen(false);
      }}
    />
  );
};
