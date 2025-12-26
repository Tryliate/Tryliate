# Tryliate Monorepo (2025 Architecture)

Native MCP Orchestrator architected for scalability, connectivity, and maintainability.

## Technology Stack
- **Runtime**: [Bun](https://bun.sh)
- **Framework**: Next.js 16 (App Router + Turbopack)
- **Monorepo Management**: Turborepo
- **Protocol**: Model Context Protocol (MCP)

## Project Structure
```text
/root
├── apps/
│   ├── studio/          # Next.js Orchestration Foundry
│   │   ├── src/
│   │   │   ├── app/      # App Router
│   │   │   ├── components/ # Visual Canvas & Nodes
│   │   │   ├── hooks/    # Registry & Workflow hooks
│   │   │   └── types/    # Protocol definitions
│   ├── platform/        # Next.js Management Cockpit
│   └── server/          # Native Tryliate Core (MCP Server)
├── packages/            # Internal shared packages
├── package.json         # Workspace configuration
└── turbo.json           # Build pipeline configuration
```

## Getting Started
1. Install dependencies: `bun install`
2. Start development: `bun dev`
