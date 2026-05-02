"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase";
import { fetchAllSources } from "@/lib/fetch-news";
import { generateDraftsForUser } from "@/lib/drafter";

async function requireUser() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error("not authenticated");
  return { sb, user };
}

export async function runFetch() {
  await requireUser();
  // Fetcher writes to the global items table — uses admin client.
  const r = await fetchAllSources();
  revalidatePath("/");
  return r;
}

export async function runDraft() {
  const { user } = await requireUser();
  // Drafter writes per-user drafts.
  const r = await generateDraftsForUser(user.id, { limit: 6 });
  revalidatePath("/");
  return r;
}

export async function updateDraftBody(id: string, body: string) {
  const { sb } = await requireUser();
  // RLS ensures we can only update our own drafts.
  await sb.from("drafts").update({ body, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/");
}

export async function markPosted(id: string) {
  const { sb } = await requireUser();
  await sb.from("drafts").update({
    status: "posted",
    posted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/posted");
}

export async function unmarkPosted(id: string) {
  const { sb } = await requireUser();
  await sb.from("drafts").update({
    status: "pending",
    posted_at: null,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/posted");
}

export async function rejectDraft(id: string) {
  const { sb } = await requireUser();
  await sb.from("drafts").update({ status: "rejected", updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/");
}

export async function signOut() {
  const sb = await supabaseServer();
  await sb.auth.signOut();
  redirect("/login");
}
