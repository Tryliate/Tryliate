import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WorkflowNode } from '../components/BuildWorkflow/WorkflowNode';
import { ReactFlowProvider } from '@xyflow/react';
import '@testing-library/jest-dom';

describe('WorkflowNode Component', () => {
  const mockData = {
    label: 'Test Node',
    description: 'A test description for the node',
    type: 'tool',
    meta: {
      status: 'ready'
    }
  };

  it('renders fixed node correctly', () => {
    render(
      <ReactFlowProvider>
        <WorkflowNode data={mockData} isPreview={false} onAdd={() => { }} onAsk={() => { }} />
      </ReactFlowProvider>
    );
    expect(screen.getByText(/Test Node/i)).toBeInTheDocument();
    expect(screen.getByText(/MCP tool/i)).toBeInTheDocument();
  });

  it('renders preview mode with ADD button', () => {
    render(
      <ReactFlowProvider>
        <WorkflowNode data={mockData} isPreview={true} onAdd={() => { }} onAsk={() => { }} />
      </ReactFlowProvider>
    );
    expect(screen.getByRole('button', { name: /ADD/i })).toBeInTheDocument();
  });

  it('calls onAdd when ADD button is clicked', () => {
    const onAdd = vi.fn();
    render(
      <ReactFlowProvider>
        <WorkflowNode data={mockData} isPreview={true} onAdd={onAdd} onAsk={() => { }} />
      </ReactFlowProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /ADD/i }));
    expect(onAdd).toHaveBeenCalledWith(mockData);
  });
});
