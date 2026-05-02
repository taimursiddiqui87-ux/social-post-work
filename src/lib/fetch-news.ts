import Parser from "rss-parser";
import { supabaseAdmin } from "./supabase";
import { urlHash } from "./hash";

const parser = new Parser({ timeout: 12000, headers: { "User-Agent": "SocialPostWork/0.1 (+rss)" } });

type Source = { id: string; name: string; url: string; kind: string };

async function fetchOne(src: Source): Promise<{ src: Source; rows: Record<string, unknown>[]; error?: string }> {
  if (src.kind !== "rss") return { src, rows: [] };
  try {
    const feed = await parser.parseURL(src.url);
    const rows: Record<string, unknown>[] = [];
    for (const entry of feed.items ?? []) {
      const link = entry.link?.trim();
      if (!link) continue;
      rows.push({
        source_id: src.id,
        url: link,
        url_hash: urlHash(link),
        title: (entry.title ?? "").trim().slice(0, 500),
        summary: (entry.contentSnippet ?? entry.content ?? "").slice(0, 2000),
        published_at: entry.isoDate ? new Date(entry.isoDate).toISOString() : null,
        raw: entry as unknown as Record<string, unknown>,
      });
    }
    return { src, rows };
  } catch (e) {
    return { src, rows: [], error: (e as Error).message };
  }
}

export async function fetchAllSources() {
  const sb = supabaseAdmin();
  const { data: sources, error } = await sb
    .from("sources")
    .select("id,name,url,kind")
    .eq("enabled", true);
  if (error) throw error;

  const results = await Promise.all((sources ?? []).map((s) => fetchOne(s as Source)));

  const byHash = new Map<string, Record<string, unknown>>();
  const errors: string[] = [];
  for (const r of results) {
    if (r.error) errors.push(`${r.src.name}: ${r.error}`);
    for (const row of r.rows) byHash.set(row.url_hash as string, row);
  }
  const all = [...byHash.values()];

  let inserted = 0;
  let skipped = 0;

  // Bulk upsert with ignoreDuplicates — one round-trip per chunk.
  // The .select("id") returns only the rows that were actually inserted;
  // duplicates are silently skipped.
  for (let i = 0; i < all.length; i += 200) {
    const chunk = all.slice(i, i + 200);
    const { data, error: upErr } = await sb
      .from("items")
      .upsert(chunk, { onConflict: "url_hash", ignoreDuplicates: true })
      .select("id");
    if (upErr) {
      errors.push(`upsert: ${upErr.message}`);
      continue;
    }
    const ins = data?.length ?? 0;
    inserted += ins;
    skipped += chunk.length - ins;
  }

  return { inserted, skipped, errors };
}
