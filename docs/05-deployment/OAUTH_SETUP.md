# 🔐 Supabase OAuth 2.1 Server Setup (BETA)

To enable the native **Neural Auth** (OAuth 2.1 Server) and allow AI Agents to authenticate securely with Tryliate, you must perform the following manual steps in your Supabase Dashboard.

## 1. Enable OAuth 2.1 Server
1. Go to your **Supabase Dashboard**.
2. Navigate to **Authentication** > **OAuth Server** in the left sidebar.
3. Click the **Enable OAuth 2.1 Server** toggle.
4. Set the **Authorization URL Path** to: `/auth/authorize`
   *(This points to the premium Consent UI we just built).*

## 2. Register Your First Client (Example: Trymate Agent)
If you want to test the flow with a third-party agent or your own tool:
1. In the **OAuth Server** page, click **Add Client**.
2. **Client Name**: `Trymate AI Agent`
3. **Description**: `Neural workflow assistant for Tryliate platform.`
4. **Redirect URIs**: `https://frontend-374665986758.us-central1.run.app/api/auth/callback`
5. **Client Type**: `public` (recommended for browser/mobile) or `confidential`.

## 3. Row Level Security (RLS)
Tokens issued by this server contain a `client_id` claim. You can secure your data specifically for AI agents:

```sql
-- Example: Allow specific AI Agent to read flows
CREATE POLICY "Allow Trymate to read flows" 
ON public.workflow_flows
FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'client_id' = 'YOUR-CLIENT-ID-HERE'
);
```

---
*Tryliate v1.5 • Neural Protocol Specification*
