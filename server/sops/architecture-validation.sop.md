# Architecture Validation SOP

## Overview
This SOP guides the Neural Architect (Trymate) through the process of validating a React Flow canvas 
topology and node configurations before execution.

## Parameters
- **canvas_json** (required): The full JSON object representing nodes and edges.
- **strict_mode** (optional, default: true): Whether to fail on warnings.

## Steps
### 1. Structure Discovery
Examine the nodes and edges to identify the core topology.

**Constraints:**
- You MUST identify the "Sink" and "Source" nodes.
- You SHOULD verify that all node IDs are consistent.
- You MUST NOT proceed if there are circular references without explicit loops defined.

### 2. MCP Capability Check
Verify that the required tools for each node are registered in the Supabase `mcp_registry`.

**Constraints:**
- You MUST check if the server URL is reachable.
- You SHOULD warn if a node requires a parameter that isn't provided.

### 3. Safety & RLS Check
Ensure the user's Supabase RLS policies are compatible with the flow.

**Constraints:**
- You MUST NOT store sensitive tokens in the public audit logs.
- You SHOULD anonymize user data in the execution summary.
