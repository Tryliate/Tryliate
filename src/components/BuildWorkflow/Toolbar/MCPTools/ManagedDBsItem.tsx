import React from 'react';
import { Database } from 'lucide-react';
import { DropupItem } from '../shared/DropupItem';

interface ManagedDBsItemProps {
  onOpenOverlay: (category: string, subType: string) => void;
  setOpen: (open: boolean) => void;
}

export const ManagedDBsItem: React.FC<ManagedDBsItemProps> = ({ onOpenOverlay, setOpen }) => {
  return (
    <DropupItem
      label="Managed DBs"
      icon={Database}
      onClick={() => {
        onOpenOverlay('TOOL', 'Managed DBs');
        setOpen(false);
      }}
    />
  );
};
