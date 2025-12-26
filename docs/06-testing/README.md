# 🧪 Tryliate Test Suite: Master Overview

Welcome to the Tryliate "Military Grade" testing ecosystem. This directory contains detailed documentation for every layer of protection and verification implemented in the platform.

## 🏗️ Technical Stack (v1.5.0-GA)
*   **Engine**: Next.js 16.1.1 (Turbocharged Orchestration with **Turbopack**)
*   **Kernel**: React 19.2.3 (Concurrent Rendering)
*   **Canvas**: @xyflow/react 12.10.0 (High-Density Flow)
*   **Security**: Military Grade Layer 6 Middleware

We follow a **Multi-Tier Testing Pyramid** to ensure 100% stability, security, and performance on this cutting-edge stack.

### 1. [Unit Testing](./unit/README.md)
*   **Tool**: Vitest
*   **Focus**: Isolated component logic and utility functions.
*   **Key Asset**: `WorkflowNode` validation.

### 2. [Integration Testing](./integration/README.md)
*   **Tool**: Vitest
*   **Focus**: Handshakes between components (Auth -> Registry -> Canvas).
*   **Key Asset**: `BuildWorkflow` synchronization.

### 3. [Component Testing](./component/README.md)
*   **Tool**: Cypress Component Testing
*   **Focus**: Visual isolation of complex UI elements.
*   **Key Asset**: `WorkflowNode` sandbox.

### 4. [End-to-End (E2E) Testing](./e2e/README.md)
*   **Tool**: Cypress
*   **Focus**: Full user journeys, performance, and visual fidelity.
*   **Key Asset**: `workflow.cy.ts`, `performance.cy.ts`.

### 5. [Security Audit](./security/README.md)
*   **Tool**: Cypress + Next.js Middleware
*   **Focus**: Session enforcement, Layer 6 Headers, and Secret masking.
*   **Key Asset**: `security.cy.ts`.

### 6. [Smoke Testing](./smoke/README.md)
*   **Tool**: Cypress + Heartbeat API
*   **Focus**: Rapid production health checks.
*   **Key Asset**: `smoke.cy.ts`.

### 7. [CI/CD Automation](./ci-cd/README.md)
*   **Tool**: GitHub Actions
*   **Focus**: Automated verification on push/PR.
*   **Key Asset**: `ci.yml`.

---

## 🚀 Quick Run Commands

| Command | Usage |
| :--- | :--- |
| `bun run test` | Run all Unit & Integration tests (Vitest). |
| `bun run cypress:open` | Open interactive E2E/Component test runner. |
| `bun run cypress:run` | Run E2E tests headlessly. |
| `bun run smoke-test` | Run production health checks. |
| `bun run test:ci` | Run the complete multi-tier suite in sequence. |
