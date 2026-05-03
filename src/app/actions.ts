"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { fetchAllSources } from "@/lib/fetch-news";
import { generateDraftsForNewItems } from "@/lib/drafter";
import {
  consumeQuota,
  getUsage,
  applyUnlockCode as applyCode,
  type UsageState,
} from "@/lib/limits";
import { searchItems as doSearchItems, askGroq, type SearchHit } from "@/lib/search";

export type ActionResult<T> = {
  ok: true;
  data: T;
  usage: UsageState;
} | {
  ok: false;
  reason: "LIMIT_REACHED" | "ERROR";
  message: string;
  usage: UsageState;
};

export async function fetchUsage(): Promise<UsageState> {
  return getUsage();
}

export async function unlockWithCode(code: string) {
  return applyCode(code);
}

export async function runFetch(): Promise<ActionResult<Awaited<ReturnType<typeof fetchAllSources>>>> {
  try {
    await consumeQuota("fetch");
  } catch (e) {
    const usage = await getUsage();
    if ((e as { code?: string }).code === "LIMIT_REACHED") {
      return { ok: false, reason: "LIMIT_REACHED", message: "Free daily limit reached.", usage };
    }
    return { ok: false, reason: "ERROR", message: (e as Error).message, usage };
  }
  try {
    const data = await fetchAllSources();
    revalidatePath("/");
    const usage = await getUsage();
    return { ok: true, data, usage };
  } catch (e) {
    const usage = await getUsage();
    return { ok: false, reason: "ERROR", message: (e as Error).message, usage };
  }
}

export async function runDraft(language: "en" | "ur" = "en"): Promise<ActionResult<Awaited<ReturnType<typeof generateDraftsForNewItems>>>> {
  try {
    await consumeQuota("draft");
  } catch (e) {
    const usage = await getUsage();
    if ((e as { code?: string }).code === "LIMIT_REACHED") {
      return { ok: false, reason: "LIMIT_REACHED", message: "Free daily limit reached.", usage };
    }
    return { ok: false, reason: "ERROR", message: (e as Error).message, usage };
  }
  try {
    const data = await generateDraftsForNewItems({ limit: 6, language });
    revalidatePath("/");
    const usage = await getUsage();
    return { ok: true, data, usage };
  } catch (e) {
    const usage = await getUsage();
    return { ok: false, reason: "ERROR", message: (e as Error).message, usage };
  }
}

export async function searchItemsAction(query: string): Promise<SearchHit[]> {
  return doSearchItems(query);
}

/**
 * One-shot: search the article cache for relevant matches AND ask AI in one call.
 * AI uses matched articles when relevant; otherwise answers from general knowledge.
 * Counts as 1 "ask" quota.
 */
export async function askAndSearch(question: string): Promise<ActionResult<{ answer: string; articles: SearchHit[] }>> {
  try {
    await consumeQuota("ask");
  } catch (e) {
    const usage = await getUsage();
    if ((e as { code?: string }).code === "LIMIT_REACHED") {
      return { ok: false, reason: "LIMIT_REACHED", message: "Free daily Ask AI limit reached.", usage };
    }
    return { ok: false, reason: "ERROR", message: (e as Error).message, usage };
  }
  try {
    // Pull related articles by topic-ish substring; fine if zero match.
    const articles = await doSearchItems(question);
    const answer = await askGroq(question, articles.slice(0, 8));
    const usage = await getUsage();
    return { ok: true, data: { answer, articles }, usage };
  } catch (e) {
    const usage = await getUsage();
    return { ok: false, reason: "ERROR", message: (e as Error).message, usage };
  }
}

export async function askAi(question: string, articleIds: string[]): Promise<ActionResult<string>> {
  try {
    await consumeQuota("ask");
  } catch (e) {
    const usage = await getUsage();
    if ((e as { code?: string }).code === "LIMIT_REACHED") {
      return { ok: false, reason: "LIMIT_REACHED", message: "Free daily Ask AI limit reached.", usage };
    }
    return { ok: false, reason: "ERROR", message: (e as Error).message, usage };
  }
  try {
    const sb = supabaseAdmin();
    const { data } = await sb
      .from("items")
      .select("id,title,summary,url,published_at,sources(name)")
      .in("id", articleIds.slice(0, 12));
    type Row = { id: string; title: string; summary: string | null; url: string; published_at: string | null; sources: { name: string } | null };
    const articles: SearchHit[] = ((data ?? []) as unknown as Row[]).map((r) => ({
      id: r.id, title: r.title, summary: r.summary, url: r.url,
      published_at: r.published_at, source_name: r.sources?.name ?? null,
    }));
    const answer = await askGroq(question, articles);
    const usage = await getUsage();
    return { ok: true, data: answer, usage };
  } catch (e) {
    const usage = await getUsage();
    return { ok: false, reason: "ERROR", message: (e as Error).message, usage };
  }
}

export async function updateDraftBody(id: string, body: string) {
  const sb = supabaseAdmin();
  await sb.from("drafts").update({ body, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/");
}

export async function markPosted(id: string) {
  const sb = supabaseAdmin();
  await sb.from("drafts").update({
    status: "posted",
    posted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/posted");
}

export async function unmarkPosted(id: string) {
  const sb = supabaseAdmin();
  await sb.from("drafts").update({
    status: "pending",
    posted_at: null,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/posted");
}

export async function rejectDraft(id: string) {
  const sb = supabaseAdmin();
  await sb.from("drafts").update({ status: "rejected", updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/");
}

// ── Brand voice examples ──
type Platform = "facebook" | "instagram" | "linkedin" | "twitter";

export async function addVoiceExample(platform: Platform, body: string, label: string | null) {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("brand_voice_examples")
    .insert({ platform, body, label })
    .select("id,platform,body,label,created_at")
    .single();
  if (error) throw error;
  revalidatePath("/settings");
  return data as { id: string; platform: Platform; body: string; label: string | null; created_at: string };
}

export async function deleteVoiceExample(id: string) {
  const sb = supabaseAdmin();
  await sb.from("brand_voice_examples").delete().eq("id", id);
  revalidatePath("/settings");
}

// ── Engagement log ──
export async function updateEngagement(
  id: string,
  stats: { views?: number; likes?: number; comments?: number; shares?: number; engagement_notes?: string }
) {
  const sb = supabaseAdmin();
  const clean: Record<string, number | string> = {};
  for (const [k, v] of Object.entries(stats)) {
    if (v === undefined) continue;
    if (typeof v === "number") clean[k] = Math.max(0, Math.floor(v));
    else clean[k] = v;
  }
  clean.updated_at = new Date().toISOString();
  await sb.from("drafts").update(clean).eq("id", id);
  revalidatePath("/posted");
}
