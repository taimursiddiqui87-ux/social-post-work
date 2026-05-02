import { NextResponse } from "next/server";
import { fetchAllSources } from "@/lib/fetch-news";

export const runtime = "nodejs";
export const maxDuration = 60;

// Triggered by GitHub Actions / Vercel Cron daily.
// Authenticate: caller must send `Authorization: Bearer ${CRON_SECRET}`.
//
// Multi-user mode: this endpoint only refreshes the global items cache.
// Drafts are now per-user, so each user generates them on demand from the UI
// (or via the per-user CLI: `npm run generate-drafts -- <user-id>`).
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const fetched = await fetchAllSources();
  return NextResponse.json({ fetched });
}
