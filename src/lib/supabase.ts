import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Browser-safe client (anon key, RLS-enforced — currently no RLS so reads anything).
export const supabaseAnon = () =>
  createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// Server-only — bypasses RLS. Never import from client components.
export const supabaseAdmin = () =>
  createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
