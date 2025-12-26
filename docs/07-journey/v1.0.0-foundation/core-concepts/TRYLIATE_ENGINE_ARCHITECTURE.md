# Tryliate Engine Architecture: The Neural Orchestrator

This document outlines the design of the **Tryliate Engine**—the brain responsible for executing MCP-to-MCP workflows drafted on the visual canvas.

## 🧠 1. The Decision: Custom vs. Inngest
To build a reliable 2025-grade agentic engine, we have two paths:
1.  **Pure Custom Engine**: Build a Node/Go worker that loops through a JSON graph, handles retries, manages DB states, and prevents double-execution. (Estimated effort: 4-6 weeks for stability).
2.  **Inngest-Powered Engine**: Use **Inngest** as the *Durable Execution Layer*. Inngest handles the "plumbing" (retries, timeouts, state snapshots) while we focus strictly on the "Neural Logic" (how Node A talks to Node B).

**Verdict**: We will use **Self-Hosted Inngest** inside our existing **GCP Cloud Run** environment. This gives us enterprise-grade reliability for free while keeping full control of the data.

---

## 🏗️ 2. High-Level Architecture

### **A. The Trigger Layer (Frontend)**
1.  User clicks **"RUN"** on the React Flow canvas.
2.  The UI compiles the current Nodes and Edges into a **Directed Acyclic Graph (DAG)**.
3.  The UI sends a POST request to `https://platform.tryliate.com/api/run` with the graph JSON.

### **B. The Orchestration Layer (Inngest)**
1.  An Inngest Event `mcp.flow.start` is triggered.
2.  **Tryliate Neural Function**: A durable Inngest function that:
    -   Loops through the DAG.
    -   For each node (Tool Call):
        -   Uses `step.run` to execute the MCP tool.
        -   Uses `step.sleep` if there's a scheduled delay.
        -   Stores the tool results in the **Durable Context** (Inngest State).
    -   Handles branching logic (e.g., if Node A results contain "error", go to Node C; otherwise, go to Node B).

### **C. The Execution Layer (Tryliate Backend)**
1.  The Inngest worker calls our **MCP Gateway**.
2.  The Gateway establishes the transport (Stdio/SSE) to the target MCP Server.
3.  The result is returned to Inngest to be passed to the next step.

---

## 🐳 3. Self-Hosting Strategy (The Infrastructure)

To keep Tryliate cost-effective and sovereign, we will follow the **Docker Cloud Run** pattern.

### **Components & Costs**
| Component | Hosting | Cost | Why? |
| :--- | :--- | :--- | :--- |
| **Inngest Server** | **GCP Cloud Run** | ~$0.00 (Free Tier) | We already use Cloud Run. It scales to zero when no flows are running. |
| **State DB** | **Neon (Postgres)** | $0.00 (Free Tier) | Inngest Server needs a Postgres backend. We can use a dedicated schema in your Neon project. |
| **Event Bus** | **Upstash Redis** | $0.00 (Free Tier) | Inngest needs Redis for the queue. Upstash provides a high-performance serverless Redis for free. |

---

## 🛠️ 4. Technical Implementation Plan

### **Step 1: Inngest SDK Setup**
```bash
bun add inngest
```

### **Step 2: The Logic Bridge**
We will create a helper function that "traverses" the React Flow JSON and turns it into Inngest steps.

```typescript
// src/inngest/orchestrator.ts
export const neuralOrchestrator = inngest.createFunction(
  { id: "neural-orchestrator" },
  { event: "flow/execute" },
  async ({ event, step }) => {
    const { nodes, edges } = event.data;
    const executionPlan = sortNodesByTopology(nodes, edges);

    for (const node of executionPlan) {
      const result = await step.run(`execute-${node.id}`, async () => {
        return await callMCPTool(node);
      });
      // Context is now available for the next node in the loop
    }
  }
);
```

### **Step 3: Self-Hosted Docker Deployment**
We will update the `Dockerfile` to launch the Inngest Server side-car or deploy it as a separate Cloud Run service:
-   `inngest/inngest-server:latest`
-   Environment Variables:
    -   `DATABASE_URL`: Your Neon string.
    -   `REDIS_URL`: Your Upstash string.

---

## 📍 5. Summary: Why this is the "Tryliate Idea"
The "Tryliate Idea" isn't about building a database or a simple UI—it's about **Reliable Neural Connections**. By using Inngest:
-   If your browser closes, the flow **keeps running**.
-   If an MCP server is down, it **automatically retries**.
-   If a flow takes 2 hours (long-running AI research), it **works perfectly**.

**Next Step**: Should I begin the `bun add inngest` and local server setup?
