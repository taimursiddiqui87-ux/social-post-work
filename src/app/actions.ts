"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { fetchAllSources } from "@/lib/fetch-news";
import { generateDraftsForNewItems } from "@/lib/drafter";

export async function runFetch() {
  const r = await fetchAllSources();
  revalidatePath("/");
  return r;
}

export async function runDraft() {
  const r = await generateDraftsForNewItems({ limit: 6 });
  revalidatePath("/");
  return r;
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
