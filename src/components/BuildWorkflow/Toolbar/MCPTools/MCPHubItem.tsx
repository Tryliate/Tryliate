import React from 'react';
import { Globe } from 'lucide-react';
import { DropupItem } from '../shared/DropupItem';

interface MCPHubItemProps {
  onOpenOverlay: (category: string, subType: string) => void;
  setOpen: (open: boolean) => void;
}

export const MCPHubItem: React.FC<MCPHubItemProps> = ({ onOpenOverlay, setOpen }) => {
  return (
    <DropupItem
      label="MCP Hub"
      icon={Globe}
      onClick={() => {
        onOpenOverlay('TOOL', 'MCP Hub');
        setOpen(false);
      }}
    />
  );
};
