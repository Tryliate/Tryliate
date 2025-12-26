import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { getMCPServer } from "./registry";

/**
 * 🚀 MCP Client Manager
 * Handles connecting to remote MCP servers and executing tools.
 */
export class MCPClientManager {
  private clients: Map<string, Client> = new Map();

  /**
   * Connect to an MCP server by its name in the registry
   */
  async getClient(serverName: string): Promise<Client | null> {
    if (this.clients.has(serverName)) {
      return this.clients.get(serverName)!;
    }

    const serverInfo = await getMCPServer(serverName);
    if (!serverInfo || !serverInfo.url) {
      console.error(`❌ MCP Server "${serverName}" not found or has no URL.`);
      return null;
    }

    try {
      console.log(`📡 Connecting to MCP Server: ${serverName} at ${serverInfo.url}`);
      const transport = new SSEClientTransport(new URL(serverInfo.url));
      const client = new Client(
        {
          name: "tryliate-orchestrator",
          version: "1.0.0",
        },
        {
          capabilities: {},
        }
      );

      await client.connect(transport);
      this.clients.set(serverName, client);
      console.log(`✅ Connected to ${serverName}`);
      return client;
    } catch (error) {
      console.error(`❌ Failed to connect to MCP Server "${serverName}":`, error);
      return null;
    }
  }

  /**
   * Execute a tool on a specific MCP server
   */
  async callTool(executionId: string, serverName: string, toolName: string, args: any) {
    const client = await this.getClient(serverName);
    if (!client) throw new Error(`MCP Client for ${serverName} not available.`);


    try {
      const result = await client.callTool({
        name: toolName,
        arguments: args,
      });

      return result;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Disconnect all clients
   */
  async closeAll() {
    for (const [name, client] of this.clients.entries()) {
      try {
        await client.close();
        console.log(`🔌 Disconnected from ${name}`);
      } catch (err) {
        console.warn(`⚠️ Error closing client ${name}:`, err);
      }
    }
    this.clients.clear();
  }
}

export const mcpManager = new MCPClientManager();
