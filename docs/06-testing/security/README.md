# 🛡️ Security Audit & Testing

## Purpose
Ensures the platform adheres to "Military Grade" security standards, specifically focusing on data isolation and session enforcement.

## Architecture: Layer 6 Protection
*   **Proxy**: Intercepts every request to verify authentication before allowing access to the `/build` workspace.
*   **HTTP Hardening**: Injects headers like `X-Frame-Options: DENY` and strict `CSP` to prevent clickjacking and XSS.
*   **Identity Isolation**: Hooks are configured to NEVER expose the `service_role_key` to the global UI state.

## Key Test Cases (`security.cy.ts`)
*   **Unauthorized Redirects**: Confirms that non-logged-in users are kicked to `/login`.
*   **Header Verification**: Confirms that the server is sending all required security flags.
*   **Secret Masking**: Scans the DOM to ensure no sensitive Supabase keys or JWTs are accidentally leaked.

## Usage
Run whenever changes are made to the `proxy.ts` or Authentication hooks.

```bash
bun run cypress:run --spec cypress/e2e/security.cy.ts
```
