# Tryliate Studio: Dual-Database Neural Architecture

This document outlines the specialized roles and data synchronization between the **Tryliate Master Supabase** and the **Neon Operational Brain**.

---

## 🏛️ Architecture Overview
Tryliate Studio utilizes a **Triple-Vault Architecture** to balance identity security, operational performance, and user privacy (BYOI).

1.  **Master Supabase Project (The Gateway)**: Handles global identity and project-mapping keys.
2.  **Neon Database (The Neural Brain)**: Handles real-time platform logic, registry, and memory.
3.  **Private BYOI Project (The Infrastructure)**: Hosted on the user's specific Supabase project for private workflow execution.

---

## 🛡️ 1. Master Supabase Project
**Location**: `edtfhsblomgamobizkbo.supabase.co`
**Role**: The **Identity Gateway**.

This project acts as the high-security vault for user credentials and integration status.

### Core Tables
*   **`users`**: Stores the connection status for each user without storing their private workflow data.
    *   *Neural Keys (V2)*: `supabase_url`, `supabase_publishable_key`, `supabase_secret_key`.
    *   *Identity*: `email`, `full_name`, `avatar_url`.
*   **`history`**: Audit trail of major account-level events (Auth, Connection, etc.).
*   **`migrations`**: Internal tracking of master schema versions.

---

## 🧠 2. Neon Operational Database
**Location**: `ep-sweet-dawn-a4cj3s5d` (AWS East)
**Role**: The **High-Speed Brain**.

Neon handles the "heavy lifting" of the platform—registry scanning, memory storage, and visual design layout.

### Intelligence Layers (16 Tables)
| Layer | Tables | Purpose |
| :--- | :--- | :--- |
| **Engine** | `mcp_registry`, `foundry_nodes`, `flow_feed` | Core MCP server registry and signal processing. |
| **Architect** | `workflows`, `nodes`, `edges`, `flow_space` | Visual canvas layout and architectural design storage. |
| **Identity** | `users`, `mcp_authorizations`, `user_settings` | Fast local cache for user state and API permissions. |
| **Memory** | `agent_memory`, `workspace_history`, `audit_trail` | Long-term memory and autonomous agent logs. |
| **Discovery** | `neural_discovery_queue`, `tool_catalog`, `neural_links` | Background scanning of new tools and relationships. |

### Security & Realtime
*   **RLS (Row Level Security)**: Enabled on all 16 tables to ensure data isolation.
*   **Realtime**: All 16 tables are enrolled in the `supabase_realtime` publication, allowing the frontend to listen for live architectural changes.

---

## 🔄 Data Logic & Synchronization

### The Handshake Flow
1.  **Identity**: User logs in via Master Supabase.
2.  **Vaulting**: Supabase OAuth keys are saved into the Master `users` table.
3.  **Sync**: The backend mirrors the user ID and connection state into the **Neon `users` table** to anchor workflows.
4.  **Provisioning**:
    *   The backend probes **Supabase Vault** for `supabase_secret_key`.
    *   If missing, it falls back to the **Neon Vault**.
    *   Once authorized, it deploys a **17-table Neural Architecture** inside the user's private project.

### Why two `users` tables?
*   **Supabase `users`**: Handles Global Auth and Management API handshakes.
*   **Neon `users`**: Serves as the **Foreign Key Anchor** for all workflows and memory stored in Neon, ensuring ultra-fast RLS checks and data integrity.

---

## 🛡️ Neural Auth & Runtime Security

The **Neural Auth** (Identity Handshake) is a runtime permission layer that sits on top of the Infrastructure Bridge.

### The Handshake Mechanism
1.  **Initiation**: User clicks "Connect Neural Auth" in the Platform.
2.  **Exchange**: Platform initiates an OAuth flow with the **User's Private Supabase**.
3.  **Callback**: Handshake completes at `/auth/callback/neural`.
4.  **Identity Storage**:
    *   **Master Supabase**: Stores the persistent OAuth Access/Refresh tokens for management tasks.
    *   **Neon `mcp_authorizations`**: Stores the granular **Scopes** (e.g., `["read_file"]`) and the `verified` status.
5.  **Enforcement**: The **Neural Guardian** proxy on the backend intercepts all tool calls and validates them against the Neon `mcp_authorizations` cache before allowing execution.

---

## 🔑 Key Structure (V2)
The platform has migrated away from Personal Access Tokens (PAT) to **Project-Level Neural Keys**:
*   **Old**: `supabase_access_token` (High Risk, Global Account Access).
*   **New**: `supabase_secret_key` (Low Risk, Project-Only Access).
*   **Status**: Migration Complete. V2 keys are now enforced across both vaults.

---

**Tryliate Technical Directive: V1.1.0-Production Ready**
