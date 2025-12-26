import React from 'react';
import { Plus, ChevronUp } from 'lucide-react';
import { Capsule, CapsuleItem } from '../../../ui/Capsule';
import { Tooltip } from '../../../ui/Tooltip';
import { DropupContent } from '../shared/DropupContent';
import { NodeFeedItem } from './NodeFeedItem';
import { FlowFeedItem } from './FlowFeedItem';

interface AddNodeProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onOpenOverlay: (category: string, subType: string) => void;
  closeOthers: () => void;
  noCapsule?: boolean;
}

export const AddNode: React.FC<AddNodeProps> = ({ isOpen, setIsOpen, onOpenOverlay, closeOthers, noCapsule }) => {
  const content = (
    <CapsuleItem
      onClick={() => {
        closeOthers();
        setIsOpen(!isOpen);
      }}
      style={{ padding: '8px 14px', whiteSpace: 'nowrap', gap: '8px' }}
      active={isOpen}
    >
      <Plus size={14} />
      Add Node
      <ChevronUp size={10} style={{ opacity: 0.4, transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
    </CapsuleItem>
  );

  return (
    <div style={{ position: 'relative' }}>
      <DropupContent
        open={isOpen}
        setOpen={setIsOpen}
        category="NODE"
      >
        <NodeFeedItem onOpenOverlay={onOpenOverlay} setOpen={setIsOpen} />
        <FlowFeedItem onOpenOverlay={onOpenOverlay} setOpen={setIsOpen} />
      </DropupContent>
      {noCapsule ? (
        content
      ) : (
        <Tooltip content="Elements" shortcutIcon={Plus} side="top">
          <Capsule variant="secondary" style={{ border: '1px solid #222', padding: 0 }}>
            {content}
          </Capsule>
        </Tooltip>
      )}
    </div>
  );
};
