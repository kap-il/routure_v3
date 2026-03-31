import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
  return url;
}

// Client-side Supabase client (uses publishable key)
export function getSupabaseClient() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set');
  return createClient(getSupabaseUrl(), key);
}

// Server-side Supabase client singleton (uses secret key for admin operations)
let _serverClient: SupabaseClient | null = null;

export function createServerClient() {
  if (_serverClient) return _serverClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
  if (!secretKey) throw new Error('SUPABASE_SECRET_KEY is not set');

  _serverClient = createClient(url, secretKey);
  return _serverClient;
}
