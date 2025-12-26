# 💨 Smoke Testing

## Purpose
A smoke test is a shallow but broad set of checks to ensure the application "doesn't catch fire" once it is built for production.

## Infrastructure
*   **Heartbeat API**: A dedicated endpoint (`/api/heartbeat`) that reports system health, version, and middleware status.

## Key Test Cases (`smoke.cy.ts`)
*   **Landing Check**: Verifies the root route loads.
*   **API Health**: Confirms the heartbeat returns `operational`.
*   **Asset Load**: Checks that the CSS bundle and primary icons (Lucide) are reachable.

## Usage
Run immediately after `bun run build` to verify the production binary is healthy.

```bash
bun run smoke-test
```
