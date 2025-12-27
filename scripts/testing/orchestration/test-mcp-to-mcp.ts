
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

async function testMcpToMcp() {
  console.log("🧪 Testing Tryliate MCP-to-MCP Connectivity...");

  // Target the Tryliate MCP endpoint
  const baseUrl = process.argv[2] || "https://frontend-nh767yfnoq-uc.a.run.app";
  console.log(`🔗 Target URL: ${baseUrl}`);
  
  const transport = new SSEClientTransport(new URL(`${baseUrl}/api/mcp/sse`));
  const client = new Client(
    { name: "tryliate-chain-tester", version: "1.0.0" },
    { capabilities: {} }
  );

  try {
    console.log("📡 Connecting to Tryliate MCP Hub...");
    await client.connect(transport);
    console.log("✅ Connected!");

    // STEP 1: Call first MCP Tool (Get System Status)
    console.log("\n🔄 STEP 1: Calling 'get_system_status'...");
    const statusResult = await client.callTool({
      name: "get_system_status",
      arguments: {}
    });
    
    const statusText = (statusResult.content as any)[0].text;
    console.log("📝 System Status received:", statusText);

    // STEP 2: Call second MCP Tool (Validate Graph) using info from the first call
    // This demonstrates the "connection" where output of one tool feeds into another logic
    console.log("\n🔄 STEP 2: Calling 'validate_graph' (Chained Operation)...");
    const validateResult = await client.callTool({
      name: "validate_graph",
      arguments: {
        nodes: [{ id: "status-node", data: { status: statusText } }],
        edges: []
      }
    });

    console.log("📝 Validation Result:", (validateResult.content as any)[0].text);

    console.log("\n🚀 MCP-to-MCP Chaining Logic Verified!");
    console.log("💡 Tryliate's Native Engine uses this pattern to link independent MCP tools into a single neural workflow.");

    await client.close();
  } catch (error) {
    console.error("❌ Test Failed:");
    console.error(error);
    process.exit(1);
  }
}

testMcpToMcp();
