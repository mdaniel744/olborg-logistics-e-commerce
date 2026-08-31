import { createClient } from "@supabase/supabase-js";

export const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID;

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
