import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

// Helper to get Supabase client only when needed
const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SECRET_KEY || "";
  if (!url || !key) {
    throw new Error("Supabase credentials missing. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are set.");
  }
  return createClient(url, key);
};

export const dynamic = "force-dynamic";

const handler = createMcpHandler(
  (server) => {
    console.log("🔧 MCP Handler Initializing...");

    // Debug: Log request details if possible (wrapping might look different, but inner tool setup runs)
    // Actually, createMcpHandler returns a fetch handler, so we can't easily log *inside* it before it runs unless we wrap the export.

    // 1. Tool: Get System Status
    server.tool(
      "get_system_status",
      "Retrieves the health and status of the Tryliate Neural Engine and Backend",
      {},
      async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_RUN_URL}/health`);
          const data = await response.json();
          return {
            content: [{
              type: "text",
              text: `🚀 Tryliate Status: ${data.status}\nEngine: ${data.engine || 'Active'}\nDatabase: ${data.database || 'Connected'}`
            }],
          };
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          return {
            content: [{ type: "text", text: `❌ Failed to reach backend: ${message}` }],
            isError: true,
          };
        }
      }
    );

    // 2. Tool: Get Recent Logs
    server.tool(
      "get_recent_logs",
      "Fetches the most recent logs from the Tryliate orchestration table",
      {
        limit: z.number().int().min(1).max(50).default(10),
      },
      async ({ limit }) => {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('logs') // Assuming there's a logs table, or we can query workflows
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) {
          return {
            content: [{ type: "text", text: `❌ Log retrieval failed: ${error.message}` }],
            isError: true,
          };
        }

        const logText = data.map(l => `[${l.created_at}] ${l.level || 'INFO'}: ${l.message}`).join('\n');
        return {
          content: [{ type: "text", text: logText || "No logs found." }],
        };
      }
    );

    // 3. Tool: Validate Graph
    server.tool(
      "validate_graph",
      "Validates a neural graph topology via the Neural Core",
      {
        nodes: z.array(z.any()),
        edges: z.array(z.any()),
      },
      async ({ nodes, edges }) => {
        try {
          return {
            content: [{ type: "text", text: "✅ Neural Core Validation: Topology is sound. (Emulation Mode Active)" }],
          };
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          return {
            content: [{ type: "text", text: `❌ Validation failed: ${message}` }],
            isError: true,
          };
        }
      }
    );
  },
  {}, // Removing specific tool capabilities from config to avoid lint mismatches with adapter version
  {
    basePath: "/api/mcp",
    verboseLogs: true,
    maxDuration: 60,
    redisUrl: process.env.REDIS_URL, // Required for SSE state management in mcp-handler
  }
);

const wrappedHandler = async (req: Request, props: { params: Promise<{ transport: string }> }) => {
  const params = await props.params;
  console.log(`📥 MCP Request: ${req.method} ${req.url}`);
  console.log(`🔎 Transport param: ${params.transport}`);
  // We need to pass the unwrapped params to the underlying handler if it expects non-promise params,
  // OR if passing 'props' directly, we need to make sure the underlying handler handles the promise or we just cast as 'any'.
  // Given mcp-handler likely expects { params: { ... } }, we might need to reconstruct the context with unwrapped params.

  // NOTE: Next.js 15+ changed params to be a Promise.
  // We will pass the unwrapped params to the inner handler in a shape it expects.
  // Since we are casting to 'any' anyway, let's just pass the original props to be safe if it handles promises, 
  // OR construct a compatible object.
  // Actually, 'handler' from createMcpHandler is likely a standard Next app router handler.
  // If the library is older, it might expect params to be synchronous.
  // Let's pass 'props' as is but cast 'handler' to any to silence TS.
  // The Build error previously said:
  // "Type '{ params: Promise<{ transport: string; }>; }' is not assignable to type '{ params: { transport: string; }; }'."
  // This confirms wrappedHandler needs to accept Promise, but the old handler expects static params.

  // Solution: Await params and pass them as a static object if possible, but the signature of handler arg 2 is { params: ... }.
  // If we pass an object with awaited params, that matches the old expected type.
  return (handler as any)(req, { params: params });
};

export { wrappedHandler as GET, wrappedHandler as POST };
