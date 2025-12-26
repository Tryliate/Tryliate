import React from 'react';
import { LayoutTemplate } from 'lucide-react';
import { DropupItem } from '../shared/DropupItem';

interface ExternalAPIsItemProps {
  onOpenOverlay: (category: string, subType: string) => void;
  setOpen: (open: boolean) => void;
}

export const ExternalAPIsItem: React.FC<ExternalAPIsItemProps> = ({ onOpenOverlay, setOpen }) => {
  return (
    <DropupItem
      label="External APIs"
      icon={LayoutTemplate}
      onClick={() => {
        onOpenOverlay('TOOL', 'External APIs');
        setOpen(false);
      }}
    />
  );
};
