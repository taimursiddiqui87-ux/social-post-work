// Trending detection: a "story" is trending when 3+ distinct sources cover it
// within a 24-hour window. We don't store this — recomputed at query time
// across recent items.

import { supabaseAdmin } from "./supabase";

const TREND_WINDOW_MS = 24 * 60 * 60 * 1000;
const MIN_DISTINCT_SOURCES = 3;
const STOPWORDS = new Set([
  "the","a","an","and","or","of","to","for","in","on","at","by","with",
  "is","are","was","were","be","been","being","this","that","these","those",
  "new","update","launches","launch","releases","release","reveals","reveal",
  "ai","model","api","says","said","gets","get","has","have",
]);

/** Normalize a title to a fuzzy cluster key.
 *  Keep first 6 significant words, lowercase, strip non-alphanumeric.
 */
function clusterKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w) && w.length > 2)
    .slice(0, 6)
    .sort()
    .join(" ");
}

/**
 * Returns a map of itemId → { trending: boolean; cluster_size: number }.
 * Only computes for itemIds passed in (so we don't scan the whole table).
 */
export async function computeTrending(itemIds: string[]): Promise<Map<string, number>> {
  if (itemIds.length === 0) return new Map();

  const sb = supabaseAdmin();
  // Fetch all items from the last 24h, plus titles + source_id.
  // We need *all* recent items so we can cluster the input items against the
  // wider universe — not just the input themselves.
  const since = new Date(Date.now() - TREND_WINDOW_MS).toISOString();
  const { data: recent } = await sb
    .from("items")
    .select("id,title,source_id,published_at")
    .gt("published_at", since)
    .limit(1500);

  const items = (recent ?? []) as { id: string; title: string; source_id: string | null }[];

  // Build cluster -> Set<source_id>
  const clusterToSources = new Map<string, Set<string>>();
  const itemToCluster = new Map<string, string>();
  for (const it of items) {
    if (!it.source_id) continue;
    const k = clusterKey(it.title || "");
    if (!k) continue;
    itemToCluster.set(it.id, k);
    if (!clusterToSources.has(k)) clusterToSources.set(k, new Set());
    clusterToSources.get(k)!.add(it.source_id);
  }

  // Result map: trend size for each requested item
  const result = new Map<string, number>();
  for (const id of itemIds) {
    const k = itemToCluster.get(id);
    if (!k) { result.set(id, 1); continue; }
    result.set(id, clusterToSources.get(k)?.size ?? 1);
  }
  return result;
}

export const TRENDING_THRESHOLD = MIN_DISTINCT_SOURCES;
