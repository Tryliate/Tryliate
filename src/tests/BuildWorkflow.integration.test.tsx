import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BuildWorkflow } from '../components/BuildWorkflow';
import '@testing-library/jest-dom';

vi.mock('../lib/logo-dev', () => ({
  getBrandLogoUrl: vi.fn().mockReturnValue('mock-logo.png'),
}));

vi.mock('../lib/logo-dev/actions', () => ({
  getBrandInfo: vi.fn().mockResolvedValue({ name: 'Mock Brand' }),
}));

describe('BuildWorkflow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders and allows opening the MCP Hub overlay', async () => {
    render(<BuildWorkflow />);

    const mcpToolsButton = screen.getByText(/MCP Tools/i);
    fireEvent.click(mcpToolsButton);

    const mcpHubItem = await screen.findByText(/MCP Hub/i);
    fireEvent.click(mcpHubItem);

    // Verify WorkflowOverlay is open by checking the Asset Inventory header
    expect(await screen.findByText(/NEURAL ASSET INVENTORY/i)).toBeInTheDocument();
  });

  it('allows interacting with Trymate AI Assistant', async () => {
    render(<BuildWorkflow />);

    // Click the Ask Trymate button in the toolbar
    const askButton = screen.getByText(/Ask Trymate/i);
    fireEvent.click(askButton);

    // Verify AI Panel appears by checking the input placeholder
    const input = await screen.findByPlaceholderText(/Ask Free Mate/i);
    expect(input).toBeInTheDocument();

    // Perform a question
    fireEvent.change(input, { target: { value: 'Test question' } });

    // Press Enter to send
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Verify the question appears in the chat
    expect(await screen.findByText(/Test question/i)).toBeInTheDocument();

    // Verify the AI response appears
    expect(await screen.findByText(/Neural Insight: Test Response/i)).toBeInTheDocument();
  });
});
