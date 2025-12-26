import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (!supabase) {
  console.warn("⚠️ Supabase Client NOT Initialized. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
} else {
  console.log("✅ Supabase Client Initialized.");
}

/**
 * 🛠️ Registry Helper
 * Fetches MCP server details from the user's private Supabase instance
 */
export const getMCPServer = async (serverName: string) => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('mcp_registry')
    .select('*')
    .eq('name', serverName)
    .single();

  if (error) {
    console.error(`Error fetching MCP server ${serverName}:`, error);
    return null;
  }
  return data;
};

