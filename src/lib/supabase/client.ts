import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let supabaseClient: SupabaseClient | null = null;

export const isSupabaseConfigured = () => isConfigured;

export const getSupabaseEmailRedirectUrl = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return new URL(import.meta.env.BASE_URL || '/', window.location.origin).toString();
};

export const getSupabaseClient = () => {
  if (!isConfigured) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return supabaseClient;
};
