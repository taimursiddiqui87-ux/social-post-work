import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { supabaseServer } from "@/lib/supabase";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  return (
    <div className="flex min-h-screen">
      <Sidebar email={user?.email ?? null} />
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-4xl px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
