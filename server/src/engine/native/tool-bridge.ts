
import { Groq } from 'groq-sdk';

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

        default:
          return { success: false, error: `Unknown node type: ${nodeType}` };
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
        model: 'llama3-8b-8192',
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
    // This will eventually call the MCP Tool Bridge
    console.log(`[ToolBridge] Executing Tool: ${data.toolName}`, data);
    return {
      success: true,
      data: {
        tool: data.toolName,
        result: `Simulated result for ${data.toolName}`,
        timestamp: new Date()
      }
    };
  }
}
