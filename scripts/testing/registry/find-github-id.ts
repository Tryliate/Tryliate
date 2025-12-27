
import { db, ilike } from "../../../server/src/db/index";
import { mcpRegistry } from "../../../server/src/db/schema";

async function listGithubServers() {
  console.log("🔍 Searching for GitHub MCP servers in registry...");
  const results = await db.select({ id: mcpRegistry.id, name: mcpRegistry.name })
    .from(mcpRegistry)
    .where(ilike(mcpRegistry.id, "%github%"));
  
  console.log("Results:", JSON.stringify(results, null, 2));
}

listGithubServers().catch(console.error);
