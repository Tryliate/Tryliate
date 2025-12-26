import React from 'react';
import { Box } from 'lucide-react';
import { DropupItem } from '../shared/DropupItem';

interface NodeFeedItemProps {
  onOpenOverlay: (category: string, subType: string) => void;
  setOpen: (open: boolean) => void;
}

export const NodeFeedItem: React.FC<NodeFeedItemProps> = ({ onOpenOverlay, setOpen }) => {
  return (
    <DropupItem
      label="Node Feed"
      icon={Box}
      onClick={() => {
        onOpenOverlay('NODE', 'Node Feed');
        setOpen(false);
      }}
    />
  );
};
