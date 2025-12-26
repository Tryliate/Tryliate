# Tryliate Neural OS: Decentralized Agentic Architecture

This document defines the second-generation architecture of **Tryliate**, a truly decentralized, sovereign AI orchestration platform. By utilizing the **Tryliate Native Engine (Decentralized Neural Kernel)**, we ensure that 1,000 or 100,000 users can run complex workflows with **zero Tryliate middleman** and **zero external dependencies** like Inngest or Redis.

---

## 🏗️ 1. The "Zero-Middleman" Stack

Your data and execution never touch Tryliate's servers. You own the entire vertical stack, integrated directly into your infrastructure.

| Component | Technology | Role | Cost Profile |
| :--- | :--- | :--- | :--- |
| **Engine** | **Tryliate Native Engine** | Decentralized, Postgres-backed durable execution. | **Free** (Built into Backend) |
| **Execution** | **Google Cloud Run** | Serverless compute for the engine and MCP tools. | **Scale-to-Zero** (Pay for usage) |
| **State/DB/Queue**| **Supabase (BYOI)** | Postgres tables (`tryliate.jobs`, `runs`) for all states. | **Free Tier** (Built-in) |
| **Event Bus** | **Supabase Realtime** | Instant UI updates directly from Postgres changes. | **Built-in** |
| **Intelligence**| **Neural Protocol SOPs** | Standardized markdown instructions for kernels. | **Open Source** |

---

## 🗄️ 2. Supabase Data Schema (The Native Queue)

Since Tryliate is decentralized, we provision a dedicated `tryliate` schema directly into your **personal Supabase** instance.

### **Core Schema (`tryliate` schema)**
1.  **`jobs`**: The distributed queue. Uses `FOR UPDATE SKIP LOCKED` for atomic, high-performance job polling.
2.  **`runs`**: Tracks the overall workflow execution state and outputs.
3.  **`steps`**: Granular tracking of every tool call, AI prompt, and logic branch.
4.  **`registry`**: Stores your configured MCP server credentials and tool definitions.

---

## 🧠 3. The Neural Kernel: Native durable execution

We have replaced external orchestrators with a native TypeScript kernel that runs within the Tryliate Backend.

### **How it Works (The Decentralized Loop)**
1.  **Provisioning**: One click deploys the `tryliate` schema to your Supabase.
2.  **Trigger**: A workflow start event inserts a row into your `tryliate.jobs` table.
3.  **Polling**: The Tryliate Engine (running on Cloud Run) continuously monitors active user infrastructures using high-frequency, low-latency Postgres polling.
4.  **Execution**: When a job is picked up, the `NativeExecutor` traverses the workflow DAG, executing tools and steps in isolation.
5.  **Durable State**: Every state transition is committed to your Postgres instance, ensuring workflows survive service restarts.

---

## ⚡ 4. Scalability & Cost Analysis

### **"Can it handle 1 Lakh (100k) Users?"**
**Yes.** Because the architecture is decentralized:
- **Compute**: Each user (or the platform owner) runs their own backend instances. A single backend instance can manage thousands of user connections dynamically.
- **Storage**: Data is distributed across individual user **Supabase** instances. No single point of failure or bottleneck exists.
- **Zero Overhead**: There are no external licensing fees or "seats" required. You are only limited by your Postgres performance.

### **Cost Summary**
- **Tryliate Engine**: $0 (Integrated into the backend).
- **GCP Cloud Run**: ~$0 for most users due to scale-to-zero capabilities.
- **Supabase**: $0 (Standard Postgres usage).
- **Redis/External Queues**: $0 (Completely eliminated).

---

## 📍 5. The User Flow (Real-time)

1.  **Canvas**: User drafts a workflow on the React Flow canvas.
2.  **Dispatch**: The UI inserts a job into the user's private Supabase `jobs` table.
3.  **Engine**: The Native Engine picks up the job, locks it using `SKIP LOCKED`, and begins processing.
4.  **Real-time Streaming**: Status updates stream directly from Supabase tables to the UI via Supabase Realtime.
5.  **Completion**: Results are stored in the user's `runs` and `steps` tables for historical audit.

**Current Status**: 🟢 Native Engine v1.0.0 Deployed | 🟢 Decentralized Handshake Active | 🟢 Postgres Queuing Finalized.

**Tryliate is now a Sovereign Neural Operating System.**
