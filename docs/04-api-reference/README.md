# 🔌 API Reference - Tryliate v1.0.0

This document outlines the REST API endpoints provided by the Tryliate backend.

---

## 🏛️ Infrastructure Endpoints

### `POST /api/infrastructure/provision`
Initializes a new Supabase project with the Tryliate schema.

- **Request Body:**
  ```json
  {
    "userId": "UUID",
    "accessToken": "Supabase Management Token"
  }
  ```
- **Response:** Streaming JSON logs.
- **Example Flow:**
  1. Validates Management Token.
  2. Creates project via Supabase CLI/API.
  3. Injects `BYOI_SCHEMA_SQL`.
  4. Returns `success` status.

### `POST /api/infrastructure/reset`
Clears Tryliate configurations and infrastructure links for a user.

- **Request Body:**
  ```json
  {
    "userId": "UUID"
  }
  ```
- **Response:** `{ status: "success" }`

---

## 🔌 MCP Registry Endpoints

### `GET /api/mcp/official`
Fetches a list of official reference MCP servers from the central registry.

- **Response Header:** `Cache-Control: public, s-maxage=3600`
- **Response Body:**
  ```json
  [
    {
      "id": "fetch-server",
      "name": "Fetch",
      "url": "https://mcp-server-fetch.vercel.app/sse",
      "type": "server",
      "meta": { "author": "Anthropic" }
    }
  ]
  ```

---

## 🧠 Native Engine Orchestration

### `POST /api/engine/run`
Triggers an asynchronous workflow execution on the user's private infrastructure.

- **Request Body:**
  ```json
  {
    "workflowId": "UUID",
    "userId": "UUID",
    "input": { "any": "data" }
  }
  ```
- **Response:** `{ success: true, runId: "UUID", message: "Workflow initialized on Native Engine." }`

---

## 🤖 AI Inference

### `POST /api/ai/analyze`
Submits workflow context for AI analysis (Powered by Llama 3.3).

- **Request Body:**
  ```json
  {
    "prompt": "Analyze this connection...",
    "context": { "nodes": [], "edges": [] }
  }
  ```
- **Response:** Markdown-formatted string with insights.

---

## 🧪 Health & Monitoring

### `GET /health`
Returns the operational status of the backend and core dependencies.

- **Response Body:**
  ```json
  {
    "status": "OK",
    "timestamp": "ISO-TIMESTAMP",
    "services": {
      "supabase": "healthy",
      "neon": "healthy",
      "redis": "healthy"
    }
  }
  ```
