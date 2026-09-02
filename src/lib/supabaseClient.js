import { createClient } from "@supabase/supabase-js";

export const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(STORE_ID && SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      // Next.js caches fetch() by default even inside dynamically-rendered routes, so a
      // dashboard product added after the last deploy would silently stay invisible until
      // the next build. This store's catalog needs to reflect the dashboard immediately.
      global: {
        fetch: (url, options = {}) => fetch(url, { ...options, cache: "no-store" }),
      },
    })
  : null;
