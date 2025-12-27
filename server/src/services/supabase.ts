export async function initializeSupabaseMCP(projectId: string, accessToken: string): Promise<string> {
  const url = `https://mcp.supabase.com/mcp?project_ref=${projectId}`;
  const payload = {
    jsonrpc: '2.0',
    id: 0,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'Tryliate-Engine', version: '1.2.0' }
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
      'x-supabase-project': projectId
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`MCP Handshake Failed (${response.status}): ${errText}`);
  }

  const sessionId = response.headers.get('mcp-session-id');
  return sessionId || "";
}

export async function callSupabaseMCP(projectId: string, accessToken: string, tool: string, args: any, sessionId: string | null = null): Promise<any> {
  const url = `https://mcp.supabase.com/mcp?project_ref=${projectId}`;

  const payload = {
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'tools/call',
    params: {
      name: tool,
      arguments: args
    }
  };

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/event-stream',
    'x-supabase-project': projectId
  };

  if (sessionId) headers['mcp-session-id'] = sessionId;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ MCP Bridge HTTP Error [${response.status}]: ${errText}`);
      throw new Error(`MCP Bridge Offline (${response.status}): ${errText}`);
    }

    const result: any = await response.json();
    if (result.error) {
      console.error(`❌ MCP JSON-RPC Error:`, JSON.stringify(result.error));
      throw new Error(result.error.message || 'Unknown MCP RPC Error');
    }

    // Check for internal tool errors (standard MCP return format)
    if (result.result && result.result.isError) {
      const toolErr = result.result.content?.[0]?.text || 'Tool execution failed';
      console.error(`❌ MCP Tool Execution Error:`, toolErr);
      throw new Error(toolErr);
    }

    return result.result;
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('MCP Request Timeout');
    throw err;
  }
}

export async function waitForProjectActive(projectId: string, accessToken: string): Promise<any> {
  // Tryliate Limit: 60 Seconds (12 attempts * 5000ms)
  for (let i = 0; i < 12; i++) {
    const res = await fetch(`https://api.supabase.com/v1/projects/${projectId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (res.ok) {
      const data: any = await res.json();
      if (data.status === 'ACTIVE_HEALTHY' || data.status === 'ACTIVE') return data;
    }
    await new Promise(r => setTimeout(r, 5000));
  }
  throw new Error('Project failed to become active in time.');
}
