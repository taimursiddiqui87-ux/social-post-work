import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

// Phase 3: picks scheduled drafts whose time has come and posts them.
// Stubbed until OAuth is wired up. See README "Phase 2".
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("drafts")
    .select("id,platform,body,scheduled_for")
    .eq("status", "scheduled")
    .lte("scheduled_for", new Date().toISOString())
    .limit(10);

  // TODO Phase 2: dispatch by platform → Meta Graph / LinkedIn UGC API.
  return NextResponse.json({ pending: data?.length ?? 0, note: "posting not yet implemented — wire up OAuth in Phase 2" });
}
