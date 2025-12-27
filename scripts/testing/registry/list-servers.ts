
import { db } from "../../../server/src/db/index";
import { mcpRegistry } from "../../../server/src/db/schema";


async function listServers() {
  console.log("🔍 Fetching a sample of available MCP servers...");
  const results = await db.select({ id: mcpRegistry.id, name: mcpRegistry.name })
    .from(mcpRegistry)
    .limit(20);
  
  console.log("Available Servers:", JSON.stringify(results, null, 2));
}

listServers().catch(console.error);
