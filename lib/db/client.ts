import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient as createSSRBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

// Singleton instance for browser client
let browserClientInstance: SupabaseClient<Database> | null = null;

// Client-side Supabase client (uses publishable key with SSR support)
export const createBrowserClient = (): SupabaseClient<Database> => {
  if (browserClientInstance) {
    return browserClientInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  browserClientInstance = createSSRBrowserClient<Database>(supabaseUrl, supabaseKey);
  return browserClientInstance;
};

// Server-side Supabase client (uses secret key)
export const createServerClient = (): SupabaseClient<Database> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient<Database>(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

// Singleton instance for server-side usage
let serverClientInstance: SupabaseClient<Database> | null = null;

export const getServerClient = (): SupabaseClient<Database> => {
  if (!serverClientInstance) {
    serverClientInstance = createServerClient();
  }
  return serverClientInstance;
};
