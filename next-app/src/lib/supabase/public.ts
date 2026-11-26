import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabasePublicEnv } from './env';

let cachedClient: SupabaseClient | null = null;

/**
 * Stateless, cookie-free public Supabase client using the anon/publishable key.
 * Safe inside `unstable_cache`, static generation, and ISR routes.
 * Public RLS policies enforce read-only access to published rows.
 */
export function createSupabasePublicClient(): SupabaseClient {
  if (cachedClient) return cachedClient;
  const { url, anonKey } = getSupabasePublicEnv();
  cachedClient = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return cachedClient;
}
