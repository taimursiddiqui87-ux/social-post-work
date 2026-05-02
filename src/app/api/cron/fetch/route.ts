import { NextResponse } from "next/server";
import { fetchAllSources } from "@/lib/fetch-news";
import { generateDraftsForNewItems } from "@/lib/drafter";

export const runtime = "nodejs";
export const maxDuration = 60;

// Triggered by GitHub Actions / Vercel Cron daily.
// Authenticate: caller must send `Authorization: Bearer ${CRON_SECRET}`.
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const fetched = await fetchAllSources();
  const drafted = await generateDraftsForNewItems({ limit: 6 });
  return NextResponse.json({ fetched, drafted });
}
