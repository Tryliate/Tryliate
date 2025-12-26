# 🗄️ Database Schema Reference - Tryliate v1.1.0

This document provides a detailed reference for the database schema used in the Tryliate platform. The architecture follows a **BYOI (Bring Your Own Infrastructure)** model, where most application data is stored in the user's private Supabase instance.

---

## 🏗️ Schema Overview

The Tryliate infrastructure consists of two primary namespaces in your Postgres database:
1.  **`public`**: Stores your workflows, nodes, edges, and application state.
2.  **`tryliate`**: The Neural Kernel namespace for job queuing, durable execution, and step-level tracing.

---

## 📋 Core Application Tables (`public` schema)

### 1. `workflows`
The parent container for visual orchestrations.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary key. |
| `name` | `TEXT` | Display name. |
| `state` | `JSONB` | Canvas viewport state. |

### 2. `nodes`
Individual elements within a workflow.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `TEXT` | React Flow Node ID. |
| `workflow_id` | `UUID` | Parent workflow reference. |
| `type` | `TEXT` | Node type (protocol, tool, etc). |
| `data` | `JSONB` | Node internal state/config. |

---

## 🤖 Neural Kernel Tables (`tryliate` schema)

These tables drive the **Tryliate Native Engine**.

### 3. `jobs`
The distributed queue for workflow execution.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary key. |
| `workflow_id` | `UUID` | Reference to target workflow. |
| `status` | `TEXT` | `pending`, `processing`, `completed`, `failed`. |
| `payload` | `JSONB` | Input parameters for the run. |
| `next_run_at`| `TIMESTAMPTZ`| Scheduling for retries or cron jobs. |

### 4. `runs`
High-level records of workflow execution sessions.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary key. |
| `workflow_id` | `UUID` | Reference to the workflow. |
| `status` | `TEXT` | Current run status. |
| `result` | `JSONB` | Final output of the workflow. |

### 5. `steps`
Granular durability tracing for every transition in a run.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary key. |
| `run_id` | `UUID` | Parent run reference. |
| `node_id` | `TEXT` | The node being executed. |
| `status` | `TEXT` | `success`, `error`. |
| `output` | `JSONB` | Result of this specific step. |

---

## 🔌 Integration Tables

### 6. `mcp_registry`
Registry of available MCP servers and tools.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `TEXT` | Unique identifier. |
| `name` | `TEXT` | Display name. |
| `url` | `TEXT` | SSE endpoint URL. |

---

## 🛡️ Security Policies (RLS)

All tables implement **Row-Level Security** to ensure data isolation. The `tryliate` schema is created with strict RLS policies allowing the infrastructure owner (authenticated via Service Role or User ID) to manage job state while preventing cross-user leakage.

---

## ⚡ Realtime Configuration

Tryliate utilizes **Supabase Realtime** for instant UI feedback. The following tables are members of the `supabase_realtime` publication:
- `public.workflows`
- `public.nodes`
- `tryliate.jobs`
- `tryliate.runs`
- `tryliate.steps`
