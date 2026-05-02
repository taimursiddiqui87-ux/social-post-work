import { createClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * Server-only client that BYPASSES Row Level Security.
 * Used by CLI scripts and admin operations (sync-sources, fetch-news, drafter).
 */
export const supabaseAdmin = () =>
  createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });

/**
 * Server-component / server-action client. Reads the auth cookie set by
 * middleware so RLS sees `auth.uid()`.
 */
export const supabaseServer = async () => {
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Setting cookies from a Server Component throws; middleware
          // refreshes them, so this is safe to ignore.
        }
      },
    },
  });
};
