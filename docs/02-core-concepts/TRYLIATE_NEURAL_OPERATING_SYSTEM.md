# Tryliate Neural Operating System (TN-OS)

This document defines the unified architecture of Tryliate, integrating **Durable Execution (Inngest)**, **Sovereign Infrastructure (Supabase BYOI)**, and **Standardized AI Workflows (Agent SOPs)**.

---

## 🏗️ 1. Infrastructure Stack (The Neural Grid)

### **A. Durable Execution: Self-Hosted Inngest**
To ensure architecture deployments are reliable and can run for hours (or days) without failure, we use **Inngest** as our durable execution layer.
- **Server**: Hosted as a Docker container on **Google Cloud Run**.
- **Mode**: Self-hosted (Community Edition).
- **Transport**: Standardized HTTP event bus.

### **B. Data Layer: Supabase BYOI**
Tryliate utilizes the user's existing Supabase infrastructure for privacy and data sovereignty.
- **Database**: PostgreSQL (Supabase) serves as the primary state store for Inngest and User Workflows.
- **Schema Management**: Tables like `flow_feed`, `user_flows`, and `mcp_registry` are managed directly in the user's Supabase instance.
- **Auth**: Native Supabase Auth is integrated for multi-tenant isolation.

### **C. Event Bus: Upstash Redis**
For the high-performance queue required by Inngest.
- **Provider**: Upstash Serverless Redis.
- **URL**: `upstash_redis_url_placeholder` (To be configured in `.env`).

---

## 🤖 2. Trymate Intelligence: Strands Agent SOPs

"Trymate" is not just a chatbot; it is a **Neural Architect** that follows **Standard Operating Procedures (SOPs)**. Using the **Strands Agents** format, we ensure that every action Trymate takes is consistent and reliable.

### **What is a Tryliate SOP?**
An SOP is a markdown instruction set that directs the AI through complex multi-step tasks using **RFC 2119 constraints** (MUST, SHOULD, MAY).

### **Example: The `architecture-validation.sop.md`**
```markdown
# Architecture Validation

## Overview
Guides Trymate through the process of validating a React Flow graph before execution.

## Parameters
- **flow_graph** (required): The JSON structure of the current canvas.

## Steps
### 1. Topology Check
Analyze the connections to ensure they match the selected Topology (Star, Mesh, etc.).

**Constraints:**
- You MUST ensure every node has at least one edge (except in Single Node mode).
- You SHOULD check for circular dependencies that might cause infinite loops.
- You MUST NOT proceed if the graph contains disconnected components.
```

---

## 🔄 3. The Orchestration Workflow (The Core Engine)

The synergy between Inngest and SOPs allows Tryliate to handle complex, long-running agentic tasks.

1.  **Trigger**: User clicks "RUN" on the canvas.
2.  **Event Entry**: The UI sends a `flow/initiated` event to the Inngest Server.
3.  **SOP Engagement**: The Inngest function triggers **Trymate** using a specific SOP (e.g., `code-assist.sop` or `infra-deploy.sop`).
4.  **Durable Steps**:
    -   `step.run("validate-sop")`: Trymate checks if the plan is sound.
    -   `step.run("mcp-execution")`: The engine calls the target MCP servers.
    -   `step.sleep("wait-for-result")`: If an external API is slow, the engine pauses and resumes automatically.
5.  **Telemetry**: Real-time logs are pushed back to the **Tryliate Terminal** via WebSockets linked to the Inngest execution ID.

---

## 🛠️ 4. Deployment & Setup

### **1. Installing Dependencies**
```bash
bun add inngest strands-agents-sops
```

### **2. Directory Structure**
```text
tryliate/
├── .cursor/commands/      # Generated SOP commands for IDE interaction
├── src/
│   ├── inngest/           # Inngest Client & Durable Functions
│   │   ├── client.ts
│   │   └── flow-engine.ts
│   ├── sops/              # Natural Language SOP instructions
│   │   └── code-assist.sop.md
│   │   └── trymate-main.sop.md
```

### **3. Environment Config**
Ensure the following are set in your `.env.local`:
- `INNGEST_EVENT_KEY`: Generated key for self-hosted Inngest.
- `INNGEST_SIGNING_KEY`: For secure communication.
- `UPSTASH_REDIS_REST_URL`: For the event queue.
- `NEXT_PUBLIC_SUPABASE_URL`: Your BYOI project URL.

---

## 🌍 5. Summary: Why this works
By combining **Inngest** (The Engine) with **Strands SOPs** (The Wisdom) and **Supabase** (The Body), Tryliate transforms from a drawing tool into a **Robust Autonomous Architect**.

**Current Status**: 🟢 Architecture Defined | 🟡 Inngest Integration Pending | 🟡 SOP Library Construction.
