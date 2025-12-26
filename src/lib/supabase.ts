import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabasePublishableKey)
  ? createClient(supabaseUrl, supabasePublishableKey)
  : ({
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      signInWithOAuth: async () => ({ data: {}, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => ({ data: null, error: null }),
          order: () => ({ data: [], error: null }),
        }),
        order: () => ({ data: [], error: null }),
      }),
      insert: () => ({ data: [], error: null }),
      update: () => ({ eq: () => ({ data: [], error: null }) }),
      delete: () => ({ eq: () => ({ data: [], error: null }) }),
      channel: () => ({ on: () => ({ subscribe: () => ({ unsubscribe: () => { } }) }) }),
    }),
    channel: () => ({ on: () => ({ subscribe: () => ({ unsubscribe: () => { } }) }) }),
    removeChannel: () => { },
  } as any);

/**
 * Creates a scoped client for a user's private BYOI infrastructure.
 * Used to interact with user-private tables (nodes, edges, workflows) 
 * instead of the master platform tables.
 */
export const getBYOIClient = (projectId: string, secretKey: string) => {
  const url = `https://${projectId}.supabase.co`;
  return createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
};
