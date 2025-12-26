# 🧠 Core Concepts

Understanding Tryliate's philosophy, architecture, and vision.

---

## 📚 Table of Contents

1. [Philosophy](#philosophy) - The MCP-first approach
2. [Vision](#vision) - Neural Operating System
3. [Architecture](#architecture) - System design
4. [Engine](#engine) - Orchestration engine

---

## 🎯 Philosophy

**[Read Full Philosophy →](./PHILOSOPHY.md)**

Tryliate is built on a radical departure from traditional software integration:

### Zero SDK. Zero Libraries. Zero Proprietary Code.

**Traditional Integration:**
```javascript
npm install @proprietary-company/sdk
import { Wrapper } from 'sdk'
wrapper.call()
```

**Tryliate Integration:**
```
mcp://tryliate.io/orchestrator
→ Connect [server: postgres, server: slack]
→ Execute Workflow
```

### Why "Connectivity First"?

1. **Immortality** - Code written against MCP lives as long as the protocol exists
2. **Universal Orchestration** - Connect Claude Desktop, Cursor, and databases instantly
3. **Zero Dependency Bloat** - You don't "install" Tryliate, you "connect" to it

---

## 🚀 Vision

**[Read Full Vision →](./TRYLIATE_VISION.md)**

### Tryliate as a Neural Operating System

Tryliate is not just a tool; it is the **Switchboard of the AI Economy**.

#### Key Principles

1. **Pure Protocol Orchestration**
   - Every capability exposed as Standard MCP JSON-RPC
   - UI as visual orchestration plane
   - Backend as high-performance registry

2. **AI-Orchestrated**
   - Groq-powered Llama 3.3 engine
   - Smart handshakes between tools
   - Automatic data transformation

3. **Native Connectivity**
   - Standard MCP workflows
   - Native transports (SSE, Stdio)
   - No proprietary dependencies

---

## 🏗️ Architecture

**[Read Full Architecture →](./TRYLIATE_ENGINE_ARCHITECTURE.md)**

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 16)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Build Workflow Canvas (React Flow)                   │  │
│  │  - Drag-and-drop nodes                                │  │
│  │  - Smart Connect overlay                              │  │
│  │  - AI Panel                                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/SSE
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Express + Bun)                    │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  REST API        │  │  Inngest Engine  │                │
│  │  - MCP Proxy     │  │  - Validator     │                │
│  │  - BYOI          │  │  - Implementer   │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                            ↕ SQL/Realtime
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (Supabase)                        │
│  - workflows, nodes, edges                                  │
│  - mcp_registry, execution_logs                             │
│  - users (BYOI credentials)                                 │
└─────────────────────────────────────────────────────────────┘
                            ↕ SSE
┌─────────────────────────────────────────────────────────────┐
│                   MCP SERVERS (External)                     │
│  - Official Anthropic servers                               │
│  - Community servers (Glama.ai)                             │
│  - Custom MCP implementations                               │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend
- **Framework:** Next.js 16.1.1
- **Runtime:** React 19.2.3
- **Language:** TypeScript 5.9.3
- **Canvas:** React Flow 12.10.0
- **Styling:** Tailwind CSS 4.1.18

#### Backend
- **Runtime:** Bun (Express.js)
- **Orchestration:** Inngest 3.48.1
- **AI:** Groq SDK (Llama 3.3 70B)
- **Database:** PostgreSQL (pg 8.16.3)

#### Infrastructure
- **Database:** Supabase
- **Deployment:** Google Cloud Run
- **CI/CD:** GitHub Actions
- **Auth:** Supabase Auth + OAuth 2.0

---

## ⚙️ Engine

**[Read Full Engine Docs →](./TRYLIATE_NEURAL_OPERATING_SYSTEM.md)**

### Orchestration Engine

The Tryliate Engine is a multi-agent system powered by AI:

#### Components

1. **Validator Agent**
   - Model: Llama 3.3 70B (via Groq)
   - Purpose: Validates workflow architecture
   - Output: Validation report with suggestions

2. **Implementer Agent**
   - Model: Llama 3.3 70B (via Groq)
   - Purpose: Executes validated workflows
   - Output: Execution results and logs

3. **Inngest Functions**
   - `neural/validate-architecture` - Workflow validation
   - `neural/execute-workflow` - Workflow execution
   - `neural/provision-infrastructure` - BYOI setup

#### Workflow Execution

```
User Creates Workflow
    ↓
Validator Agent Analyzes
    ↓
Architecture Validated
    ↓
Implementer Agent Executes
    ↓
Results Logged
```

---

## 🎨 Design Principles

### 1. MCP-First
Everything is built around the Model Context Protocol standard.

### 2. Visual-First
Drag-and-drop canvas for intuitive workflow building.

### 3. AI-Powered
Llama 3.3 70B for intelligent orchestration and validation.

### 4. Zero Lock-In
Standard protocols, no proprietary SDKs.

### 5. Production-Ready
Enterprise-grade security, scalability, and reliability.

---

## 📊 Key Metrics

- **500+ MCP Servers** integrated
- **27+ Flow Templates** pre-built
- **60 FPS** canvas rendering
- **<100ms** API response time
- **960+ concurrent users** supported

---

## 🔗 Related Documentation

- **[Getting Started](../01-getting-started/README.md)** - Installation and setup
- **[User Guides](../03-user-guides/README.md)** - How to use Tryliate
- **[API Reference](../04-api-reference/README.md)** - Technical API docs
- **[Journey](../07-journey/README.md)** - Version history

---

**The protocol is the language. Tryliate is the engine.** 🚀
