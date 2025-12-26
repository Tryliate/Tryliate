import React from 'react';
import { Sparkles } from 'lucide-react';
import { DropupItem } from '../shared/DropupItem';

interface AIModelsItemProps {
  onOpenOverlay: (category: string, subType: string) => void;
  setOpen: (open: boolean) => void;
}

export const AIModelsItem: React.FC<AIModelsItemProps> = ({ onOpenOverlay, setOpen }) => {
  return (
    <DropupItem
      label="AI Models"
      icon={Sparkles}
      onClick={() => {
        onOpenOverlay('TOOL', 'AI Models');
        setOpen(false);
      }}
    />
  );
};
