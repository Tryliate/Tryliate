export const BYOI_SCHEMA_SQL = `
-- 🔱 Neural Core Extension Support
CREATE EXTENSION IF NOT EXISTS vector;

-- BYOI Core Neural Infrastructure
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Untitled Workflow',
  description TEXT,
  state JSONB DEFAULT '{"viewport": {"x": 0, "y": 0, "zoom": 1}}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.nodes (
  id TEXT PRIMARY KEY,
  workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  data JSONB NOT NULL,
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  width FLOAT,
  height FLOAT,
  created_at TIMESTAMPTZ DEFAULT now()
);



CREATE TABLE IF NOT EXISTS public.edges (
  id TEXT PRIMARY KEY,
  workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  target TEXT NOT NULL,
  source_handle TEXT,
  target_handle TEXT,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mcp_registry (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT,
  type TEXT DEFAULT 'server',
  data JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);


CREATE TABLE IF NOT EXISTS public.mcp_authorizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  provider TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  scopes JSONB DEFAULT '[]', -- Neural Guardian: Granular permissions
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'verified',
  last_handshake_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, provider)
);

CREATE TABLE IF NOT EXISTS public.flow_space (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL DEFAULT 'Untitled Flow',
  messages JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workspace_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.foundry_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agent_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  user_id UUID,
  memory_type TEXT DEFAULT 'short_term',
  content TEXT,
  embedding vector(1536), -- Neural Memory: Semantic search support
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.neural_discovery_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL,
  mcp_name TEXT,
  status TEXT DEFAULT 'pending', -- pending, installing, complete, failed
  detected_by TEXT, -- Agent ID or Discovery Engine
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.neural_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_node_id TEXT,
  target_node_id TEXT,
  correlation_score FLOAT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tool_catalog (
  id TEXT PRIMARY KEY,
  mcp_server_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  input_schema JSONB,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY,
  theme TEXT DEFAULT 'dark',
  notifications_enabled BOOLEAN DEFAULT true,
  ai_model_preference TEXT DEFAULT 'gpt-4',
  metadata JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Optimization Indices
CREATE INDEX IF NOT EXISTS idx_nodes_workflow_id ON public.nodes(workflow_id);
CREATE INDEX IF NOT EXISTS idx_edges_workflow_id ON public.edges(workflow_id);
CREATE INDEX IF NOT EXISTS idx_mcp_registry_updated_at ON public.mcp_registry(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_mcp_authorizations_user_id ON public.mcp_authorizations(user_id);
CREATE INDEX IF NOT EXISTS idx_flow_space_user_id ON public.flow_space(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_memory_agent_id ON public.agent_memory(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_memory_embedding ON public.agent_memory USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_neural_discovery_status ON public.neural_discovery_queue(status);
CREATE INDEX IF NOT EXISTS idx_neural_links_nodes ON public.neural_links(source_node_id, target_node_id);
CREATE INDEX IF NOT EXISTS idx_tool_catalog_server ON public.tool_catalog(mcp_server_id);

-- Access Control
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcp_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcp_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_space ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundry_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neural_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Allow all for now as it is BYOI)
DROP POLICY IF EXISTS "Enable all for users" ON public.workflows;
CREATE POLICY "Enable all for users" ON public.workflows FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for users" ON public.nodes;
CREATE POLICY "Enable all for users" ON public.nodes FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for users" ON public.edges;
CREATE POLICY "Enable all for users" ON public.edges FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for users" ON public.mcp_registry;
CREATE POLICY "Enable all for users" ON public.mcp_registry FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for users" ON public.mcp_authorizations;
CREATE POLICY "Enable all for users" ON public.mcp_authorizations FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for users" ON public.flow_space;
CREATE POLICY "Enable all for users" ON public.flow_space FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for users" ON public.workspace_history;
CREATE POLICY "Enable all for users" ON public.workspace_history FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for users" ON public.foundry_nodes;
CREATE POLICY "Enable all for users" ON public.foundry_nodes FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for users" ON public.agent_memory;
CREATE POLICY "Enable all for users" ON public.agent_memory FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for users" ON public.neural_links;
CREATE POLICY "Enable all for users" ON public.neural_links FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for users" ON public.tool_catalog;
CREATE POLICY "Enable all for users" ON public.tool_catalog FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for users" ON public.audit_trail;
CREATE POLICY "Enable all for users" ON public.audit_trail FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for users" ON public.user_settings;
CREATE POLICY "Enable all for users" ON public.user_settings FOR ALL USING (true);

-- Realtime Neural Sync
DO $$
DECLARE
  t text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;

  FOREACH t IN ARRAY ARRAY[
    'public.workflows', 'public.nodes', 'public.edges', 
    'public.mcp_registry', 'public.mcp_authorizations', 'public.flow_space', 
    'public.workspace_history', 'public.foundry_nodes', 'public.agent_memory', 
    'public.neural_links', 'public.tool_catalog'
  ] LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %s', t);
    EXCEPTION WHEN others THEN NULL;
    END;
  END LOOP;
END $$;
`;

export const NATIVE_ENGINE_SQL = `
-- ⚡ Neural Engine Core
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE SCHEMA IF NOT EXISTS tryliate;

CREATE TABLE IF NOT EXISTS tryliate.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  workflow_id TEXT NOT NULL,
  node_id TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending', 
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 3,
  next_run_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_status_run ON tryliate.jobs (status, next_run_at);

CREATE TABLE IF NOT EXISTS tryliate.runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL,
  input JSONB,
  output JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tryliate.steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  node_id TEXT NOT NULL,
  status TEXT NOT NULL,
  input JSONB,
  output JSONB,
  error TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Realtime Neural Engine Sync (Error Tolerant)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE tryliate.jobs;
    EXCEPTION WHEN others THEN NULL;
    END;
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE tryliate.runs;
    EXCEPTION WHEN others THEN NULL;
    END;
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE tryliate.steps;
    EXCEPTION WHEN others THEN NULL;
    END;
  END IF;
EXCEPTION WHEN others THEN NULL;
END $$;
`;

export function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = '';
  let inDollarQuote = false;
  let dollarQuoteTag = null;

  const lines = sql.split('\n');
  for (let line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('--')) continue; // Skip comments

    // Enhanced Dollar Quoting Check
    if (line.includes('$$')) {
      inDollarQuote = !inDollarQuote;
    } else {
      // Check for named dollar tags like $tag$
      const tagMatch = line.match(/\$(\w+)\$/);
      if (tagMatch) {
        if (!inDollarQuote) {
          inDollarQuote = true;
          dollarQuoteTag = tagMatch[1];
        } else if (tagMatch[1] === dollarQuoteTag) {
          inDollarQuote = false;
          dollarQuoteTag = null;
        }
      }
    }

    current += line + '\n';

    if (!inDollarQuote && trimmedLine.endsWith(';')) {
      statements.push(current.trim());
      current = '';
    }
  }

  if (current.trim()) {
    statements.push(current.trim());
  }

  return statements;
}
