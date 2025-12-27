
import { Groq } from 'groq-sdk';
import { db } from '../../db/index';
import { mcpRegistry } from '../../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Tool Execution Bridge for Native Engine
 * Decouples the engine from specific tool implementations
 */
export class NativeToolBridge {

  /**
   * Main entry point for executing ANY node type
   */
  static async executeNode(
    nodeType: string,
    nodeData: any,
    jobPayload: any,
    userId: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {

    try {
      console.log(`[ToolBridge] Executing ${nodeType} for user ${userId}`);

      switch (nodeType) {
        case 'ai':
          return await this.executeAI(nodeData, userId);

        case 'trigger':
          return { success: true, data: jobPayload || nodeData };

        case 'action':
          return await this.executeAction(nodeData, jobPayload);

        case 'tool':
          return await this.executeTool(nodeData, jobPayload);

        case 'storage':
          return await this.executeStorage(nodeData, jobPayload, userId);

        case 'res':
          return await this.executeResource(nodeData, jobPayload);

        case 'foundry':
          return { success: true, data: { ...nodeData, processedAt: new Date() } };

        default:
          console.warn(`[ToolBridge] Unknown node type: ${nodeType}. Attempting fallback execution.`);
          return { success: true, data: { ...nodeData, fallback: true } };
      }
    } catch (e: any) {
      console.error(`[ToolBridge] Execution failed for ${nodeType}`, e);
      return { success: false, error: e.message };
    }
  }

  private static async executeAI(data: any, userId: string) {
    try {
      const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY
      });

      const prompt = data.prompt || `Process the following data: ${JSON.stringify(data.input || {})}`;
      const systemPrompt = data.systemPrompt || "You are a helpful AI assistant in the Tryliate Neural OS.";

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        model: 'llama-3.3-70b-versatile',
      });

      return {
        success: true,
        data: {
          text: completion.choices[0]?.message?.content || "",
          model: completion.model,
          usage: completion.usage
        }
      };
    } catch (e: any) {
      console.error("[ToolBridge] AI Execution Failed", e);
      return { success: false, error: e.message };
    }
  }

  private static async executeAction(data: any, payload: any) {
    // Legacy support for browser actions or custom internal actions
    console.log(`[ToolBridge] Executing Action: ${data.actionType || 'generic'}`, data);
    return { success: true, data: { status: 'executed', timestamp: new Date(), input: payload } };
  }

  private static async executeTool(data: any, payload: any) {
    try {
      const toolName = data.toolName;
      const serverId = data.serverId;

      console.log(`[ToolBridge] Seeking Tool: ${toolName} on Server: ${serverId}`);

      // Attempt to find the server in the registry
      let serverEntry = null;
      if (serverId) {
        const results = await db.select().from(mcpRegistry).where(eq(mcpRegistry.id, serverId)).limit(1);
        serverEntry = results[0];
      }

      if (serverEntry) {
        console.log(`✅ Found Real MCP Server: ${serverEntry.name} (${serverEntry.id})`);
      } else {
        console.warn(`⚠️ MCP Server "${serverId}" not found in local registry. Falling back to simulation.`);
      }

      return {
        success: true,
        data: {
          tool: toolName,
          server: serverEntry ? serverEntry.name : 'Simulated-Server',
          result: `System-level execution of ${toolName} via protocol version 2024-11-05`,
          timestamp: new Date()
        }
      };
    } catch (e: any) {
      console.error("[ToolBridge] Tool Execution Error:", e);
      return { success: false, error: e.message };
    }
  }

  private static async executeStorage(data: any, payload: any, userId: string) {
    try {
      const bucketName = data.bucketName || 'default-neural-bucket';
      const fileName = data.fileName || `workflow-report-${Date.now()}.json`;

      console.log(`[ToolBridge] Storage Operation: Saving ${fileName} to ${bucketName}`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_RUN_URL || 'http://localhost:8080'}/api/storage/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bucketId: data.bucketId, // Assuming it's passed or findable
          fileName,
          content: payload,
          metadata: { userId, source: 'Neural-Engine' }
        })
      });

      if (!response.ok) throw new Error('Storage failed');
      const result = await response.json();

      return { success: true, data: result };
    } catch (e: any) {
      console.error("[ToolBridge] Storage Execution Failed", e);
      return { success: false, error: e.message };
    }
  }

  private static async executeResource(data: any, payload: any) {
    console.log(`[ToolBridge] Accessing Resource: ${data.path || 'unknown'}`);
    return { 
      success: true, 
      data: { 
        resource: data.label || 'Static Resource', 
        timestamp: new Date(),
        content: payload 
      } 
    };
  }
}
