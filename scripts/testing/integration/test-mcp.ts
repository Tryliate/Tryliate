import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

async function testMcp() {
  console.log("🧪 Testing Tryliate MCP Handler...");

  // Allow passing URL as argument, default to Cloud Run if not provided
  const baseUrl = process.argv[2] || "https://frontend-nh767yfnoq-uc.a.run.app";
  console.log(`🔗 Target URL: ${baseUrl}`);
  const transport = new SSEClientTransport(new URL(`${baseUrl}/api/mcp/sse`));

  const client = new Client(
    {
      name: "tryliate-tester",
      version: "0.1.0"
    },
    {
      capabilities: {}
    }
  );

  try {
    console.log("📡 Connecting to MCP SSE endpoint...");
    await client.connect(transport);
    console.log("✅ Connected!");

    console.log("🛠️ Listing available tools...");
    const tools = await client.listTools();
    console.log("📦 Tools found:", JSON.stringify(tools.tools.map((t: any) => t.name), null, 2));

    if (tools.tools.some((t: any) => t.name === "get_system_status")) {
      console.log("🧪 Executing 'get_system_status'...");
      const result = await client.callTool({
        name: "get_system_status",
        arguments: {}
      });
      console.log("📝 System Status Result:", JSON.stringify(result, null, 2));
    }

    await client.close();
    console.log("✅ MCP Test Completed Successfully!");
  } catch (error) {
    console.error("❌ MCP Test Failed:");
    console.error(error);
    // Note: This failure is expected if the local dev server is not running
    console.log("💡 Reminder: Ensure 'bun run dev' is running to pass local connectivity tests.");
    process.exit(1);
  }
}

testMcp();
