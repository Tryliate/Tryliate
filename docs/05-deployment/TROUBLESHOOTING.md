# 🛠️ Troubleshooting Guide - Tryliate v1.0.0

Common issues and solutions for the Tryliate Platform.

---

## 🏗️ Infrastructure & BYOI

### ❌ Issue: "Provisioning Failed"
**Symptoms:** The progress bar stops, or an error message "Stream not supported" or "Unauthorized" appears.
- **Solution 1:** Ensure your Supabase Management Token is valid and has not expired.
- **Solution 2:** Check if you have reached the project limit on your Supabase account.
- **Solution 3:** Ensure the project name is unique within your Supabase organization.

### ❌ Issue: "Supabase Client NOT Initialized"
**Symptoms:** Warning in logs: `⚠️ Supabase Client NOT Initialized`.
- **Solution:** Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set correctly in your `.env.local`.

---

## 🔌 MCP & Connections

### ❌ Issue: "Node Connection Failed"
**Symptoms:** Red border around a node or tools not loading.
- **Solution 1:** Verify the MCP server URL is accessible via HTTPS.
- **Solution 2:** Ensure the server is currently online (Check Logs).
- **Solution 3:** Some proxy servers block SSE (Server-Sent Events). Disable VPNs or firewall restrictions.

### ❌ Issue: "Missing Tool Metadata"
**Symptoms:** Node details panel shows "No tools available".
- **Solution:** Click the **Refresh** icon on the node or re-open the node configuration to trigger a re-fetch.

---

## 🎨 Visual Canvas

### ❌ Issue: "Canvas is Blank"
**Symptoms:** Grid is visible but nodes are missing.
- **Solution 1:** Check if you have an active filter in the sidebar.
- **Solution 2:** Use the **Fit View** button in the toolbar to center the view.
- **Solution 3:** A massive graph might be rendered far from the origin.

### ❌ Issue: "Save Failed"
**Symptoms:** Notification: `Failed to save to neural history`.
- **Solution:** You must be signed in to save workflows. Check your session status in the sidebar.

---

## 🤖 AI Assistant (Trymate)

### ❌ Issue: "Trymate is not responding"
**Symptoms:** Skeleton loader spins indefinitely.
- **Solution 1:** Check your `GROQ_API_KEY` in the environment configuration.
- **Solution 2:** You may have exceeded the rate limit for Llama 3.3 70B. Wait 60 seconds and try again.

---

## 🚀 Deployment

### ❌ Issue: "Cloud Run Error: Process completed with exit code 1"
**Symptoms:** GitHub Action fails at the "Submit Cloud Build" step.
- **Solution:** This usually happens if the `public` directory is missing. Ensure `.gitkeep` is present in `public/`.
- **Fix:** `mkdir -p public && touch public/.gitkeep`

### ❌ Issue: "Invalid secret: GCP_SA_KEY"
**Symptoms:** Linter warning (Yellow) in VS Code.
- **Solution:** This is a false positive. As long as it works on GitHub, ignore it. We implement `fromJson(toJson(secrets))` to bypass it.
