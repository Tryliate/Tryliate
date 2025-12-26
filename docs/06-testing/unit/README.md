# 🧩 Unit Testing

## Purpose
Unit tests verify the smallest parts of the application (functions and individual components) in total isolation. This ensures that a change in one place doesn't break the fundamental logic of a component.

## Tools
*   **Vitest**: Fast, Vite-native testing runner.
*   **Testing Library (React)**: For mounting and interacting with components.

## Key Test Cases: `WorkflowNode`
*   **Initial Render**: Confirms labels and icons display correctly based on input data.
*   **Tag Display**: Verifies that 'OFFICIAL' or 'OAUTH 2.1' badges appear when metadata is present.
*   **Action Logic**: Confirms that clicking "ADD" triggers the `onAdd` callback with the correct node configuration.

## Usage
Run during active development to ensure your component logic remains sound while you refactor.

```bash
bun run test
```
