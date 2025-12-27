export const SCHEMA_SQL = `
-- Tryliate BYOI Schema - Auto-deployed in User's Supabase Database
-- This schema is automatically created when user connects their Supabase database
-- All OAuth credentials stored in user's own database (100% BYOI)

-- ============================================================================
-- Tryliate OAUTH CONNECTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS tryliate_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  provider_config_key TEXT NOT NULL,
  connection_id TEXT NOT NULL,
  
  -- Encrypted OAuth credentials (access_token, refresh_token, etc.)
  credentials JSONB NOT NULL,
  
  -- Provider-specific configuration
  connection_config JSONB DEFAULT '{}',
  
  -- Additional metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  
  -- Ensure unique connection per user per provider
  UNIQUE(user_id, provider_config_key, connection_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_tryliate_connections_user_provider 
  ON tryliate_connections(user_id, provider_config_key);

-- ============================================================================
-- Tryliate PROVIDER CONFIGURATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS tryliate_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_config_key TEXT UNIQUE NOT NULL,
  provider TEXT NOT NULL,
  
  -- OAuth credentials (encrypted)
  oauth_client_id TEXT NOT NULL,
  oauth_client_secret TEXT NOT NULL,
  
  -- OAuth configuration
  oauth_scopes TEXT[],
  oauth_auth_url TEXT,
  oauth_token_url TEXT,
  oauth_redirect_uri TEXT,
  
  -- Provider metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Tryliate SYNC JOBS (for data syncing)
-- ============================================================================

CREATE TABLE IF NOT EXISTS tryliate_sync_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID REFERENCES tryliate_connections(id) ON DELETE CASCADE,
  sync_name TEXT NOT NULL,
  
  -- Job status
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'success', 'error')),
  
  -- Sync metadata
  last_sync_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ,
  sync_frequency_minutes INTEGER DEFAULT 60,
  
  -- Error tracking
  error_message TEXT,
  error_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for active jobs
CREATE INDEX IF NOT EXISTS idx_tryliate_sync_jobs_status 
  ON tryliate_sync_jobs(status, next_sync_at);

-- ============================================================================
-- Tryliate SYNC DATA (synced data from providers)
-- ============================================================================

CREATE TABLE IF NOT EXISTS tryliate_sync_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID REFERENCES tryliate_connections(id) ON DELETE CASCADE,
  sync_job_id UUID REFERENCES tryliate_sync_jobs(id) ON DELETE CASCADE,
  
  -- Data model
  model TEXT NOT NULL,
  external_id TEXT NOT NULL,
  
  -- Synced data
  data JSONB NOT NULL,
  
  -- Sync metadata
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique records
  UNIQUE(connection_id, model, external_id)
);

-- Index for data lookups
CREATE INDEX IF NOT EXISTS idx_tryliate_sync_data_connection_model 
  ON tryliate_sync_data(connection_id, model);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE tryliate_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE tryliate_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tryliate_sync_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tryliate_sync_data ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own connections
DROP POLICY IF EXISTS "Users can only access their own connections" ON tryliate_connections;
CREATE POLICY "Users can only access their own connections"
  ON tryliate_connections FOR ALL
  USING (user_id = current_setting('app.current_user_id', true)::text);

-- RLS Policy: Users can access all provider configs (read-only)
DROP POLICY IF EXISTS "Users can read provider configs" ON tryliate_configs;
CREATE POLICY "Users can read provider configs"
  ON tryliate_configs FOR SELECT
  USING (true);

-- RLS Policy: Users can only access sync jobs for their connections
DROP POLICY IF EXISTS "Users can only access their own sync jobs" ON tryliate_sync_jobs;
CREATE POLICY "Users can only access their own sync jobs"
  ON tryliate_sync_jobs FOR ALL
  USING (
    connection_id IN (
      SELECT id FROM tryliate_connections 
      WHERE user_id = current_setting('app.current_user_id', true)::text
    )
  );

-- RLS Policy: Users can only access their own synced data
DROP POLICY IF EXISTS "Users can only access their own synced data" ON tryliate_sync_data;
CREATE POLICY "Users can only access their own synced data"
  ON tryliate_sync_data FOR ALL
  USING (
    connection_id IN (
      SELECT id FROM tryliate_connections 
      WHERE user_id = current_setting('app.current_user_id', true)::text
    )
  );

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_tryliate_connections_updated_at ON tryliate_connections;
CREATE TRIGGER update_tryliate_connections_updated_at
  BEFORE UPDATE ON tryliate_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tryliate_configs_updated_at ON tryliate_configs;
CREATE TRIGGER update_tryliate_configs_updated_at
  BEFORE UPDATE ON tryliate_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tryliate_sync_jobs_updated_at ON tryliate_sync_jobs;
CREATE TRIGGER update_tryliate_sync_jobs_updated_at
  BEFORE UPDATE ON tryliate_sync_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired connections
CREATE OR REPLACE FUNCTION cleanup_expired_connections()
RETURNS void AS $$
BEGIN
  DELETE FROM tryliate_connections
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SEED DATA (Pre-built Provider Configurations)
-- ============================================================================

-- Insert pre-configured OAuth providers
-- Note: Client IDs and secrets should be provided by user or Tryliate
INSERT INTO tryliate_configs (provider_config_key, provider, oauth_client_id, oauth_client_secret, oauth_scopes, oauth_auth_url, oauth_token_url)
VALUES
  -- Slack
  ('slack', 'slack', 'REPLACE_WITH_CLIENT_ID', 'REPLACE_WITH_CLIENT_SECRET', 
   ARRAY['channels:read', 'chat:write', 'users:read'], 
   'https://slack.com/oauth/v2/authorize', 
   'https://slack.com/api/oauth.v2.access'),
  
  -- Google
  ('google', 'google', 'REPLACE_WITH_CLIENT_ID', 'REPLACE_WITH_CLIENT_SECRET',
   ARRAY['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
   'https://accounts.google.com/o/oauth2/v2/auth',
   'https://oauth2.googleapis.com/token'),
  
  -- GitHub
  ('github', 'github', 'REPLACE_WITH_CLIENT_ID', 'REPLACE_WITH_CLIENT_SECRET',
   ARRAY['repo', 'user'],
   'https://github.com/login/oauth/authorize',
   'https://github.com/login/oauth/access_token'),
  
  -- Notion
  ('notion', 'notion', 'REPLACE_WITH_CLIENT_ID', 'REPLACE_WITH_CLIENT_SECRET',
   ARRAY[]::text[],
   'https://api.notion.com/v1/oauth/authorize',
   'https://api.notion.com/v1/oauth/token')
ON CONFLICT (provider_config_key) DO NOTHING;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE tryliate_connections IS 'Stores OAuth connections for each user and provider';
COMMENT ON TABLE tryliate_configs IS 'Provider OAuth configurations';
COMMENT ON TABLE tryliate_sync_jobs IS 'Background jobs for syncing data from providers';
COMMENT ON TABLE tryliate_sync_data IS 'Synced data from external providers';

-- ============================================================================
-- COMPLETION
-- ============================================================================

-- Force PostgREST schema cache reload to ensure API can see new tables immediately
NOTIFY pgrst, 'reload config';
`
