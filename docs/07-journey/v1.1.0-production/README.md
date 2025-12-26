# 🚀 Tryliate - Neural Operating System for MCP-to-MCP Orchestration

<div align="center">

![Tryliate Banner](https://img.shields.io/badge/Tryliate-v1.1.0--PRODUCTION-success?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript)
![Bun](https://img.shields.io/badge/Bun-1.3.5-000000?style=for-the-badge&logo=bun)

**A visual platform for building, orchestrating, and executing MCP (Model Context Protocol) workflows**

[🌐 Live Demo](https://frontend-374665986758.us-central1.run.app) | [📚 Documentation](./docs/v1.0.0/) | [🐛 Report Bug](https://github.com/your-repo/issues) | [✨ Request Feature](https://github.com/your-repo/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Deployment](#-deployment)
- [Usage Guide](#-usage-guide)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Tryliate** is a next-generation neural operating system that enables visual orchestration of MCP (Model Context Protocol) servers. Built on a foundation of **Next.js 16**, **React 19**, and **Bun**, Tryliate provides a drag-and-drop canvas for building complex AI workflows that connect multiple MCP servers, databases, and APIs.

### Why Tryliate?

- **Visual Workflow Builder**: Drag-and-drop interface powered by React Flow
- **MCP-to-MCP Connectivity**: Execute tools across multiple MCP servers seamlessly
- **Durable Execution**: Powered by Inngest for reliable, resumable workflows
- **BYOI (Bring Your Own Infrastructure)**: Automatic Supabase project provisioning
- **Real-time Collaboration**: Built-in Supabase Realtime for live updates
- **AI-Powered Validation**: Multi-agent system for architecture validation

---

## ✨ Features

### 🎨 **Visual Canvas**
- **Drag-and-Drop Nodes**: Build workflows visually with 27+ pre-built templates
- **Smart Connect**: Intelligent connection suggestions between nodes
- **Flow Templates**: Single-node, Star, Bus, Mesh, Ring, Tree, and Hybrid topologies
- **Real-time Sync**: Automatic persistence to Supabase

### 🔌 **MCP Integration**
- **Registry Aggregation**: Access 500+ MCP servers from official and community sources
- **Dynamic Connections**: SSE-based transport for real-time communication
- **Tool Execution**: Execute tools across multiple MCP servers in a single workflow
- **Execution Logging**: Complete audit trail of all tool calls

### 🤖 **AI Orchestration**
- **Multi-Agent System**: Validator and Implementer agents powered by Llama 3.3 70B
- **SOP-Guided Workflows**: Standard Operating Procedures for consistent execution
- **Inngest Integration**: Durable, resumable workflows with automatic retries

### 🏗️ **Infrastructure**
- **BYOI Provisioning**: One-click Supabase project creation
- **Credential Vault**: Secure storage of API keys and database passwords
- **Schema Injection**: Automatic database schema setup
- **Reset/Recovery**: Built-in infrastructure reset mechanisms

---

## 🏛️ Architecture

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

---

## 🚀 Quick Start

### Prerequisites

- **Bun** 1.3.5 or higher ([Install Bun](https://bun.sh))
- **Node.js** 18+ (for compatibility)
- **Supabase Account** (for BYOI)
- **Google Cloud Account** (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/tryliate.git
   cd tryliate
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your credentials:
   ```env
   # Supabase (Admin Instance)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # Backend URLs
   NEXT_PUBLIC_CLOUD_RUN_URL=http://localhost:8080
   NEXT_PUBLIC_ENGINE_URL=http://localhost:3001

   # AI (Groq)
   GROQ_API_KEY=your-groq-api-key

   # OAuth
   NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID=your-oauth-client-id
   NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY=your-logo-dev-key
   ```

4. **Apply database migrations**
   ```bash
   # Navigate to your Supabase project dashboard
   # Go to SQL Editor and run:
   cat supabase/migrations/insert_flow_feed.sql
   cat supabase/migrations/002_mcp_infrastructure.sql
   ```

5. **Start the development servers**

   **Terminal 1 (Frontend):**
   ```bash
   bun run dev
   ```

   **Terminal 2 (Backend):**
   ```bash
   cd server
   bun run index.js
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 📦 Deployment

### Google Cloud Run (Recommended)

#### 1. **Deploy Frontend**

```bash
gcloud builds submit --config=deploy/cloud/google-cloud/build-configs/cloudbuild.frontend.yaml
```

#### 2. **Deploy Backend**

```bash
gcloud builds submit --config=deploy/cloud/google-cloud/build-configs/cloudbuild.backend.yaml
```

#### 3. **Configure Environment Variables**

Update `deploy/cloud/google-cloud/env/cloud_run_env.yaml` with your production credentials, then apply:

```bash
gcloud run services update frontend \
  --region=us-central1 \
  --update-env-vars-file=deploy/cloud/google-cloud/env/cloud_run_env.yaml
```

### Environment Variables (Production)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `NEXT_PUBLIC_CLOUD_RUN_URL` | Backend API URL | ✅ |
| `NEXT_PUBLIC_ENGINE_URL` | Inngest engine URL | ✅ |
| `GROQ_API_KEY` | Groq AI API key | ✅ |
| `NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID` | Supabase OAuth client ID | ✅ |
| `NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY` | Logo.dev API key | ⚠️ Optional |
| `REDIS_URL` | Redis connection string | ⚠️ Optional |

---

## 📖 Usage Guide

### 1. **Connect Your Infrastructure**

1. Click the **Integration** button in the toolbar
2. Click **CONNECT** on the Supabase card
3. Authorize Tryliate to access your Supabase account
4. Click **PROVISION DATABASE** to create your infrastructure

### 2. **Build a Workflow**

1. Click **Add Node** in the toolbar
2. Select **Flow Feed** to browse templates or **Node Feed** for individual nodes
3. Drag nodes onto the canvas
4. Connect nodes by dragging from one node's handle to another
5. Click a node to edit its properties in the right panel

### 3. **Execute Your Workflow**

1. Click **Run Once** in the toolbar
2. Monitor execution in the **Logs** dropdown
3. View results in the **Schedule** dropdown

### 4. **Use the AI Assistant**

1. Click **Ask Trymate** to open the AI panel
2. Ask questions about your workflow
3. Get suggestions for optimization and validation

---

## 🔌 API Reference

### Backend Endpoints

#### **Infrastructure Management**

```http
POST /api/infrastructure/provision
Content-Type: application/json

{
  "userId": "uuid",
  "accessToken": "supabase-management-token"
}
```

**Response:** Streaming JSON logs

---

#### **MCP Registry**

```http
GET /api/mcp/official
```

**Response:**
```json
{
  "servers": [
    {
      "name": "Official Server",
      "url": "https://...",
      "description": "..."
    }
  ]
}
```

---

#### **Inngest Execution**

```http
POST /api/inngest
Content-Type: application/json

{
  "name": "neural/validate-architecture",
  "data": {
    "canvasJson": { "nodes": [], "edges": [] },
    "userId": "uuid"
  }
}
```

**Response:**
```json
{
  "executionId": "uuid",
  "status": "success"
}
```

---

## 🗄️ Database Schema

### Core Tables

#### **workflows**
```sql
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Untitled Workflow',
  description TEXT,
  state JSONB DEFAULT '{"viewport": {"x": 0, "y": 0, "zoom": 1}}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### **nodes**
```sql
CREATE TABLE nodes (
  id TEXT PRIMARY KEY,
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  data JSONB NOT NULL,
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### **mcp_registry**
```sql
CREATE TABLE mcp_registry (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT,
  type TEXT DEFAULT 'server',
  data JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### **execution_logs**
```sql
CREATE TABLE execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id TEXT NOT NULL,
  step_name TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 🛠️ Development

### Project Structure

```
tryliate/
├── src/                          # Frontend source
│   ├── app/                      # Next.js app router
│   ├── components/               # React components
│   │   └── BuildWorkflow/        # Main canvas UI
│   └── lib/                      # Shared libraries
│       ├── mcp/                  # MCP client & registry
│       ├── inngest/              # Orchestration functions
│       └── sops/                 # Standard Operating Procedures
├── server/                       # Backend (Express + Inngest)
│   ├── index.js                  # Main server
│   ├── inngest-engine.js         # Inngest functions
│   └── sops/                     # Backend SOPs
├── supabase/migrations/          # Database migrations
├── deploy/cloud/google-cloud/    # Deployment configs
├── docs/v1.0.0/                  # Documentation
└── scripts/                      # Utility scripts
```

### Scripts

```bash
# Development
bun run dev              # Start frontend dev server
bun run dev-server       # Start frontend only
cd server && bun run index.js  # Start backend

# Build
bun run build            # Build frontend for production
bun run typecheck        # Run TypeScript type checking
bun run lint             # Run ESLint

# Testing
bun run test             # Run tests (not implemented yet)
```

### Code Quality

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended config
- **Prettier**: (Add configuration as needed)
- **Husky**: (Add pre-commit hooks as needed)

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Anthropic** for the Model Context Protocol specification
- **Vercel** for Next.js
- **Supabase** for the backend infrastructure
- **Inngest** for durable workflow orchestration
- **React Flow** for the visual canvas
- **Groq** for AI inference

---

## 📞 Support

- **Documentation**: [docs/v1.0.0/](./docs/v1.0.0/)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@tryliate.com

---

## 🗺️ Roadmap

### v1.1.0 (Production Release)
- [x] Visual workflow builder
- [x] MCP registry integration
- [x] BYOI infrastructure
- [x] Basic execution engine
- [x] Production deployment
- [x] Documentation site
- [x] Stable v1.1.0 Production Badge
- [x] Real-time execution logs
- [x] Sticky wire icons

### v1.2.0 (Next Phase)
- [ ] Real-time collaboration
- [ ] Workflow versioning
- [ ] Advanced analytics dashboard
- [ ] Custom MCP server creation
- [ ] Workflow marketplace

### v1.2.0 (Q2 2025)
- [ ] Multi-user workspaces
- [ ] Role-based access control
- [ ] Workflow templates library
- [ ] API rate limiting
- [ ] Cost tracking

---

<div align="center">

**Built with ❤️ by the Tryliate Team**

[![GitHub Stars](https://img.shields.io/github/stars/your-repo/tryliate?style=social)](https://github.com/your-repo/tryliate)
[![Twitter Follow](https://img.shields.io/twitter/follow/tryliate?style=social)](https://twitter.com/tryliate)

</div>
