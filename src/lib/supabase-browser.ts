import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-only Supabase client. Lives in its own file so server-only modules
 * (next/headers etc.) don't get bundled into client components.
 */
export const supabaseBrowser = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
