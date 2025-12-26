# Tryliate Neural OS: Decentralized Agentic Architecture

This document defines the second-generation architecture of **Tryliate**, a truly decentralized, sovereign AI orchestration platform. By combining **Inngest AgentKit**, **Strands SOPs**, and **Supabase BYOI**, we ensure that 1,000 or 100,000 users can run complex workflows with **zero Tryliate middleman** and **zero licensing costs**.

---

## 🏗️ 1. The "Zero-Middleman" Stack

Your data and execution never touch Tryliate's servers. You own the entire vertical stack.

| Component | Technology | Role | Cost Profile |
| :--- | :--- | :--- | :--- |
| **Engine** | **Inngest + AgentKit** | Durable multi-agent orchestration. | **Free** (Self-hosted Docker) |
| **Execution** | **Google Cloud Run** | Serverless compute for Inngest & Agents. | **Scale-to-Zero** (Pay for usage) |
| **State/DB** | **Supabase (BYOI)** | Workflow history, JSON graphs, and RLS. | **Free Tier** (Up to 500MB) |
| **Event Bus** | **Upstash Redis** | Low-latency queue for Inngest steps. | **User-Provided** |
| **Intelligence**| **Strands Agent SOPs** | Standardized markdown instructions. | **Open Source** |

---

## 🗄️ 2. Supabase Data Schema (The Source of Truth)

Since Tryliate is decentralized, we inject these tables into your **personal Supabase** instance.

### **Core Tables**
1.  **`flow_feed`**: (Already Created) The library of 25+ architectural templates.
2.  **`user_flows`**: Stores your saved canvases and private blueprints.
3.  **`execution_logs`**: Real-time audit trail of every Inngest step and AgentKit decision.
4.  **`mcp_registry`**: Stores your configured Smithery/MCP server URLs and keys.
5.  **`agent_sops`**: Stores the markdown instructions for different Trymate roles.

### **AgentKit Network State**
When using `@inngest/agent-kit`, the state is persisted in the **Inngest Snapshot**. However, we map final results to:
- **`network_state`**: A table that tracks collaborative data between "Navigator", "Executor", and "Verifier" agents.

---

## 🧠 3. Intelligence Tier: Trymate + AgentKit + SOPs

We use **AgentKit** to build a **Multi-Agent Network** where each agent is governed by a **Strands SOP**.

### **The Trymate Network Structure**
```typescript
import { createAgent, createNetwork } from "@inngest/agent-kit";
import { code_assist_sop } from "./sops/code-assist.sop"; // Strands SOP

// 1. Specialized Agent for implementation
const implementationAgent = createAgent({
  name: "Neural Implementer",
  system: code_assist_sop, // The SOP is the system prompt
  model: anthropic("claude-3-5-sonnet-latest"),
});

// 2. Specialized Agent for security/validation
const securityAgent = createAgent({
  name: "Gatekeeper",
  description: "Validates security constraints of the neural flow",
  system: "# Security SOP ... MUST check for token leaks ...",
});

// 3. The Orchestration Network
export const trymateNetwork = createNetwork({
  agents: [implementationAgent, securityAgent],
  defaultModel: openai("gpt-4o"),
});
```

---

## ⚡ 4. Scalability & Cost Analysis

### **"Can it handle 1 Lakh (100k) Users?"**
**Yes.** Because the architecture is decentralized:
- **Compute**: Each user (or the platform owner) runs their own Cloud Run instances. Cloud Run automatically scales to accommodate 100k requests intermittently. 
- **Storage**: Since every user has their own **Supabase**, the data is distributed across 100k databases. No single database ever hits its size limit because of other users.
- **Inngest Community Edition**: There is **no limit** on the number of users or workflows you can run on a self-hosted instance. It is limited only by your Postgres (Supabase) hardware.

### **Cost Summary**
- **Inngest Server**: $0 (Docker image is free).
- **GCP Cloud Run**: ~$0 for most users because it only charges when a flow is actively crunching.
- **Supabase**: $0 (Standard Postgres usage).
- **Upstash**: Free for small usage; paid tier for high-volume networks.

---

## 🔌 5. Smithery Integration (Universal Tooling)

Tryliate connects directly to **Smithery** to give your Agents instant access to 2,000+ tools (SEO, GitHub, Neon DB, etc.).

```typescript
const smitheryUrl = createSmitheryUrl("https://server.smithery.ai/github/ws", {
  githubToken: process.env.GITHUB_TOKEN,
});

const githubAgent = createAgent({
  name: "GitHub Agent",
  mcpServers: [{
    name: "github",
    transport: { type: "ws", url: smitheryUrl.toString() },
  }],
});
```

---

## 📍 6. The User Flow (Real-time)

1.  **Canvas**: User drags an "SEO Agent" and a "Deep Research Agent" into a Star Topology.
2.  **Inngest**: A durable `network.run()` is started on your Cloud Run.
3.  **Real-time Streaming**: AgentKit streams the "Thinking" and "Tool Calls" directly to your **Tryliate Terminal** using Supabase Realtime or direct UI Streaming.
4.  **Completion**: The final architecture results are stored in your **Supabase `execution_logs`**.

**Current Status**: 🟢 Decentralized Design Finalized | 🟡 Inngest AgentKit Bootstrapping | 🟡 Strands SOP Implementation.

**Tryliate is now a Sovereign Neural Operating System.**
