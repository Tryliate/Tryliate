# Tryliate Engine Architecture: The Neural Orchestrator

This document outlines the design of the **Tryliate Native Engine**—the brain responsible for executing MCP-to-MCP workflows drafted on the visual canvas.

## 🧠 1. The Decision: Native vs. External

To build a reliable 2025-grade agentic engine, we evaluated several paths:
1.  **Durable Execution Frameworks (Inngest/Temporal)**: Powerful but require external infrastructure, licensing, and complex sidecars.
2.  **Tryliate Native Engine (Selected)**: A lightweight, decentralized kernel built directly into the Backend that uses **Postgres as the Queue**.

**Verdict**: We use the **Native Engine**. It offers zero-latency handshakes, full data sovereignty within the user's Supabase, and horizontal scalability without external dependencies.

---

## 🏗️ 2. High-Level Architecture

### **A. The Trigger Layer (Frontend/API)**
1.  User clicks **"RUN"** on the React Flow canvas.
2.  The UI compiles the nodes/edges into a **Directed Acyclic Graph (DAG)**.
3.  The UI inserts a new row into the user's private `tryliate.jobs` table with the graph JSON.

### **B. The Orchestration Layer (Neural Kernel)**
1.  **Pollers**: The Tryliate Engine instances poll all active user infrastructures.
2.  **Atomic Locking**: Uses `FOR UPDATE SKIP LOCKED` to pick up a job and mark it as `processing`. This ensures no two workers ever process the same job.
3.  **The Executor**:
    -   Loops through the DAG.
    -   Maintains a `context` across steps.
    -   Handles retries and error branching natively.
    -   Stores state snapshots in `tryliate.runs` and `tryliate.steps`.

### **C. The Execution Layer (MCP Gateway)**
1.  The Executor calls the **MCP Gateway** for tool execution.
2.  The Gateway connects to the configured MCP servers (Local, SSE, or Remote).
3.  Results are validated and passed back to the Executor for the next transition.

---

## 🐳 3. Infrastructure Strategy (Postgres-Native)

By using Postgres as the core event loop, we eliminate the need for Redis or external cloud buses.

### **Components & Costs**
| Component | Hosting | Cost | Why? |
| :--- | :--- | :--- | :--- |
| **Tryliate Engine** | **GCP Cloud Run** | ~$0.00 (Free Tier) | Built into the existing backend service. |
| **Distributed Queue**| **Supabase (Postgres)**| $0.00 (Free Tier) | Uses the `tryliate.jobs` table. |
| **Notifications** | **Supabase Realtime** | $0.00 (Free Tier) | UI updates stream directly from table changes. |

---

## 🛠️ 4. Technical Implementation Detail

### **The Atomic Poller**
```typescript
async pollJob() {
  const job = await sql`
    UPDATE tryliate.jobs
    SET status = 'processing', updated_at = NOW()
    WHERE id = (
      SELECT id FROM tryliate.jobs
      WHERE status = 'pending' AND next_run_at <= NOW()
      ORDER BY next_run_at ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    RETURNING *;
  `;
  return job;
}
```

### **The Durable Step Loop**
```typescript
for (const node of sortedNodes) {
  const result = await this.executeStep(node);
  await this.saveStepState(node.id, result);
}
```

---

## 📍 5. Summary: Why this is the "Tryliate Idea"

The "Tryliate Idea" is about **Sovereign Neural Connections**. By building a native engine:
- **Zero Privacy Leak**: Your workflow data never leaves your private Supabase.
- **Instant Activation**: Users click "Activate Engine" and the infrastructure is provisioned in seconds.
- **Enterprise Reliability**: Postgres provides ACID guarantees for your agentic state.

**Status**: 🚀 Native Engine GA v1.0.0
