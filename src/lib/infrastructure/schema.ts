export const BYOI_SCHEMA_SQL = `
-- Tryliate Neural Schema Calibration
-- Target: BYOI Infrastructure (Tryliate Studio)

-- 1. Infrastructure Tables
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

-- 2. Neural Sync (Realtime)
-- Enable Realtime for the architectural triad
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.workflows, public.nodes, public.edges;

-- 3. Security Protocols (RLS)
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edges ENABLE ROW LEVEL SECURITY;

-- In a BYOI environment, we assume the authorized user has full control.
-- We grant full access to the 'authenticated' role which the platform uses.
DROP POLICY IF EXISTS "Architect Full Access" ON public.workflows;
CREATE POLICY "Architect Full Access" ON public.workflows FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Architect Full Access" ON public.nodes;
CREATE POLICY "Architect Full Access" ON public.nodes FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Architect Full Access" ON public.edges;
CREATE POLICY "Architect Full Access" ON public.edges FOR ALL TO authenticated USING (true);
`;
