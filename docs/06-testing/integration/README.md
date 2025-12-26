# 🔗 Integration Testing

## Purpose
Integration tests verify how different parts of the system work together. For example, when a user selects a node, does the Registry fetch the data and update the Canvas correctly?

## Tools
*   **Vitest**: Used with robust mocks for external services.
*   **Mocks**:
    *   **Supabase**: Simulates authentication sessions and database queries.
    *   **AI (Anthropic)**: Simulates the response from the Trymate Assistant.
    *   **Next.js Router**: Simulates browser navigation.

## Key Test Cases: `BuildWorkflow`
*   **Toolbar-Overlay Handshake**: Confirms that buttons in the Toolbar successfully trigger the Asset Inventory overlays.
*   **AI Assistant Orchestration**: Confirms that the AI Panel opens and can process messages through the simulated bridge.

## Usage
Run after meaningful refactors to ensure the "glue" between your hooks and components is still working.

```bash
bun run test
```
