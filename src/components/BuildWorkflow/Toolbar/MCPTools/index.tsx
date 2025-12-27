import React from 'react';
import { LayoutTemplate, ChevronUp } from 'lucide-react';
import { Capsule, CapsuleItem } from '../../../ui/Capsule';
import { Tooltip } from '../../../ui/Tooltip';
import { DropupContent } from '../shared/DropupContent';
import { MCPHubItem } from './MCPHubItem';
import { DiscoveryQueue } from './DiscoveryQueue';

import { NangoHubItem } from './NangoHubItem';

interface MCPToolsProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onOpenOverlay: (category: string, subType: string) => void;
  closeOthers: () => void;
  noCapsule?: boolean;
}

export const MCPTools: React.FC<MCPToolsProps> = ({ isOpen, setIsOpen, onOpenOverlay, closeOthers, noCapsule }) => {
  const content = (
    <CapsuleItem
      onClick={() => {
        closeOthers();
        setIsOpen(!isOpen);
      }}
      style={{ padding: '8px 14px', whiteSpace: 'nowrap', gap: '8px' }}
      active={isOpen}
    >
      <LayoutTemplate size={14} />
      MCP Tools
      <ChevronUp size={10} style={{ opacity: 0.4, transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
    </CapsuleItem>
  );

  return (
    <div style={{ position: 'relative' }}>
      <DropupContent
        open={isOpen}
        setOpen={setIsOpen}
        category="TOOL"
      >
        <MCPHubItem onOpenOverlay={onOpenOverlay} setOpen={setIsOpen} />
        <NangoHubItem onOpenOverlay={onOpenOverlay} setOpen={setIsOpen} />
        <DiscoveryQueue />
      </DropupContent>
      {noCapsule ? (
        content
      ) : (
        <Tooltip content="Marketplace" shortcutIcon={LayoutTemplate} side="top">
          <Capsule variant="secondary" style={{ border: '1px solid #222', padding: 0 }}>
            {content}
          </Capsule>
        </Tooltip>
      )}
    </div>
  );
};
