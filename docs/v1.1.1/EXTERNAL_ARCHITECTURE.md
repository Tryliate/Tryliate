# 🌐 Tryliate: External Architecture & Service Matrix (v1.1.1)

This document maps all external services, APIs, and infrastructure providers that power the Tryliate Neural Operating System.

---

## 🏗️ 1. Core Infrastructure & Storage

### 🐘 Neon DB (Central Hub)
*   **Usage**: Primary storage for the **Global MCP Registry Hub**.
*   **Where**: `server/src/db/` and `server/src/index.ts`.
*   **Role**: Acts as the "Global Knowledge Base" for all available MCP servers. It stores verified module data that is shared across all Tryliate users.
*   **Logic**: Accessed using **Drizzle ORM** for type-safe metadata queries.

### ⚡ Supabase (User & BYOI Layer)
*   **Usage**: User Authentication, Realtime Canvas Sync, and **Infrastructure Provisioning**.
*   **Where**: `server/src/index.ts` (BYOI_SCHEMA_SQL) and frontend hooks.
*   **Role**: The "Heart" of the system.
    *   **User Data**: Stores user profiles and preferences.
    *   **Realtime**: Powers the socket connection for live workflow updates.
    *   **MCP Bridge**: Used to dynamically create and manage tables in the user's private "Bring Your Own Infrastructure" (BYOI) project.
*   **Auth**: Handles Google and GitHub OAuth handshakes.

### 🔴 Upstash Redis (Execution Shield)
*   **Usage**: Distributed Rate Limiting and Workflow Tracking.
*   **Where**: `server/src/redis.ts`.
*   **Role**: Prevents API abuse and tracks active workflow executions in real-time across serverless instances.
*   **Logic**: Uses a sliding window counter to ensure fair usage of the Neural Engine.

---

## 🧠 2. Neural Intelligence & Orchestration

### 🤖 Groq (Intelligence Provider)
*   **Usage**: The "Brain" behind the AI Agents.
*   **Where**: Custom Neural Engine (upcoming) and AI Panel.
*   **Role**: Provides ultra-fast LLM inference (Llama 3 / Mixtral) for interpreting workflow nodes and making agentic decisions.
*   **Logic**: Orchestrated via the **Tryliate Native Engine (Decentralized Neural Kernel)** to handle high-frequency polling and durable execution.

---

## 🛠️ 3. Registry & Peripheral APIs

### 🎨 Logo.dev (Visual Identity)
*   **Usage**: Automated branding for MCP Modules.
*   **Where**: `src/lib/logo-dev/`.
*   **Role**: Fetches high-quality company logos and icons based on the domain of the MCP server.
*   **Logic**: Ensures the "Neural Inventory" looks premium and professional.

### 🌐 Glama & MCP Registry (Knowledge Sources)
*   **Usage**: Live fallback for MCP discovery.
*   **Where**: `server/src/index.ts` (/api/mcp/glama).
*   **Role**: Provides a real-time stream of the latest community-contributed MCP servers.

### 🐙 GitHub API
*   **Usage**: Module Ingestion.
*   **Where**: `server/src/index.ts` (/api/mcp/ingest).
*   **Role**: Scans official Anthropic and community repositories to keep the Tryliate Hub updated.

---

## 🧪 4. Tooling & Security Providers

### 🎭 Playwright
*   **Usage**: End-to-End browser testing.
*   **Where**: `tests/e2e/`.
*   **Role**: Simulates actual user behavior to ensure the canvas and provisioning engine never break.

### 🛡️ Zod & Drizzle
*   **Usage**: Data validation and query safety.
*   **Where**: Throughout the `server/` directory.
*   **Role**: Protects the system from malformed data and ensures 100% TypeScript type-safety across the stack.

---

## 🛰️ 5. Summary Flow
1.  **User Logins** via **Google/GitHub** (Supabase).
2.  **User Provisions** their private database (Supabase API).
3.  **Neural Engine** validates the request (Zod).
4.  **Workflow Executes** via the **Tryliate Native Engine** (Postgres-Native Durable Execution).
5.  **AI Reasons** (Groq).
6.  **Results Cached** & **Rate Limited** (Upstash Redis).
7.  **Logs Stored** in the user's private infra (Supabase BYOI).
