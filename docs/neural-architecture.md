# 🔱 Tryliate Neural Architecture (v1.2.0)

This architectural breakdown explains the various layers of storage across your environment. While the **17 tables** mentioned earlier are provisioned into your *private* infrastructure (BYOI), there is also a set of **Administrative Tables** that manage the platform itself.

## 🏛️ Platform Administrative Tables (Master Vault)
These tables typically live in the "Master" Supabase (the one Tryliate uses to track its users and settings) and are used for orchestration.

| Table | Purpose |
| :--- | :--- |
| **`users`** | The central identity vault. Stores your profile, connected project IDs, and encrypted access tokens to manage your private BYOI instance. |
| **`history`** | A global audit log of system-wide events, such as infrastructure provisioning, successful deployments, and critical error probes. |
| **`_migrations`** (or `migrations`) | Tracks the version and health of the database schema itself. It ensures that whenever we update Tryliate, your database is safely migrated to the latest structure without data loss. |

---

## 🏗️ Core Neural Infrastructure (14 Tables in Private BYOI)
These tables reside in your private `public` schema. This is where your actual workflow data lives.

| Table | Purpose |
| :--- | :--- |
| **`workflows`** | Stores the parent definition of your visual logic canvases. |
| **`nodes`** | Stores individual functional blocks (React Flow nodes) within a workflow. |
| **`edges`** | Manages the connections and data-flow paths between nodes. |
| **`mcp_registry`** | A local cache of verified MCP servers discovered or installed by your agents. |
| **`mcp_authorizations`** | Securely stores OAuth tokens and scopes for third-party MCP tool access. |
| **`flow_space`** | Manages the multi-user collaborative state of the Tryliate canvas. |
| **`workspace_history`** | An immutable log of all architectural changes and UI actions. |
| **`foundry_nodes`** | Specialized storage for "Foundry" (pre-built) components and templates. |
| **`agent_memory`** | Long-term and short-term memory for agents, including **Vector Embeddings**. |
| **`neural_discovery_queue`** | A staging area for the Discovery Engine to analyze new MCP servers before installation. |
| **`neural_links`** | Stores semantic correlations between disparate data nodes (Correlation Scores). |
| **`tool_catalog`** | An indexed manifest of all available functions/tools across your MCP fleet. |
| **`audit_trail`** | Security logging for all data access and infrastructure modifications. |
| **`user_settings`** | Personalization data, AI model preferences, and UI theme states. |

---

## ⚡ Native Execution Engine (The `tryliate` Schema)
The Native Engine is a state-aware runtime that replaces Inngest. It requires these 3 specific tables to handle the lifecycle of an autonomous agent execution. They are separated into a dedicated `tryliate` schema to keep your `public` data clean and isolated.

### 1. `tryliate.jobs` (The Heartbeat)
*   **Why it exists**: Every node in your workflow (e.g., "Get Weather", "Send Slack Message") becomes a **Job**.
*   **How it works**: When a workflow is triggered, the engine creates job entries for the starting nodes. Our backend workers "poll" this table constantly.
*   **Key Data**: It tracks `attempts` (for auto-retry), `next_run_at` (for delayed jobs), and the `payload` (input data from the previous node).

### 2. `tryliate.runs` (The Global Trace)
*   **Why it exists**: To group individual jobs into a single "session". 
*   **How it works**: When you click "Run" or a webhook triggers your workflow, a new entry is created here.
*   **Key Data**: It stores the top-level `input` (what triggered it) and the final `output`. It allows you to see the history of whole workflow executions over time.

### 3. `tryliate.steps` (The Logic Log)
*   **Why it exists**: For debugging and observability of individual node performance.
*   **How it works**: Unlike `jobs` (which are about *queueing*), `steps` are about **recording history**.
*   **Key Data**: Every time a node starts, a step is created. It records the exact `input`, the `output` produced, and any `error` messages if the node failed. This powers the "Execution History" view in the Studio.

---

## 🛡️ Security & Performance
- **Vector Support**: `agent_memory` utilizes the `pgvector` extension for semantic search.
- **RLS Enforced**: Every table has Row Level Security (RLS) enabled by default.
- **Indices**: All tables are optimized with B-Tree and HNSW (for vectors) indices for sub-millisecond lookups.
- **Realtime**: All 17 tables are added to the `supabase_realtime` publication, allowing the UI to react instantly to backend changes.
