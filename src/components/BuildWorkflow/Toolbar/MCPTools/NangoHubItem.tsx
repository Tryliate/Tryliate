import React from 'react';
import { Layers } from 'lucide-react';
import { DropupItem } from '../shared/DropupItem';

interface NangoHubItemProps {
  onOpenOverlay: (category: string, subType: string) => void;
  setOpen: (open: boolean) => void;
}

export const NangoHubItem: React.FC<NangoHubItemProps> = ({ onOpenOverlay, setOpen }) => {
  return (
    <DropupItem
      label="Addon Tools Hub"
      icon={Layers}
      tag="650+"
      onClick={() => {
        onOpenOverlay('TOOL', 'Nango Hub');
        setOpen(false);
      }}
    />
  );
};
