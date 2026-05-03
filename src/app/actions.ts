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

export async function runDraft(): Promise<ActionResult<Awaited<ReturnType<typeof generateDraftsForNewItems>>>> {
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
    const data = await generateDraftsForNewItems({ limit: 6 });
    revalidatePath("/");
    const usage = await getUsage();
    return { ok: true, data, usage };
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
