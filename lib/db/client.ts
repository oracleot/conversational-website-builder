import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient as createSSRBrowserClient, createServerClient as createSSRServerClient } from '@supabase/ssr';
import type { Database } from './types';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

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

// Server-side Supabase client with cookie handling for App Router
export async function createServerClient(
  cookieStore: ReturnType<typeof import('next/headers').cookies> | ReadonlyRequestCookies
): Promise<SupabaseClient<Database>> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  // Await the cookie store if it's a promise
  const cookies = 'then' in cookieStore ? await cookieStore : cookieStore;

  return createSSRServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookies.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookies.set(name, value, options);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  });
}

// Admin client for server-side usage without auth (uses secret key)
export const createAdminClient = (): SupabaseClient<Database> => {
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

// Singleton instance for admin server-side usage
let adminClientInstance: SupabaseClient<Database> | null = null;

export const getAdminClient = (): SupabaseClient<Database> => {
  if (!adminClientInstance) {
    adminClientInstance = createAdminClient();
  }
  return adminClientInstance;
};
