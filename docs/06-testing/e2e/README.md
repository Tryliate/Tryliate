# 🌐 End-to-End (E2E) Testing

## Purpose
E2E testing replicates the actual user experience in a real browser. It treats the application as a "black box" and interacts with the UI just like a human would.

## Tools
*   **Cypress**: The industry standard for reliable E2E automation.

## Test Suites

### 1. Functional Workflow (`workflow.cy.ts`)
*   Navigates to the platform.
*   Spawns nodes from the Foundry.
*   Verifies canvas persistence.
*   Interacts with the AI Assistant.

### 2. Performance Stress Test (`performance.cy.ts`)
*   Rapidly spawns multiple nodes to test rendering lag.
*   Verifies smooth scrolling in high-density menus.

### 3. Visual Audit (`visual.cy.ts`)
*   Validates the "Premium" look (Theme, Fonts, Glassmorphism).
*   Checks for layout regressions on different viewport sizes.

## Usage
Run before any deployment to ensure no high-level user features are broken.

```bash
bun run cypress:open  # Visual Debugging
bun run cypress:run   # Headless Mode
```
