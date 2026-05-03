import { headers } from "next/headers";
import { supabaseAdmin } from "./supabase";

export const FETCH_DAILY_LIMIT = 2;
export const DRAFT_DAILY_LIMIT = 2;
export const WHATSAPP_NUMBER = "923114488938"; // for wa.me link

export type UsageAction = "fetch" | "draft";

export interface UsageState {
  fetchUsed: number;
  draftUsed: number;
  unlocked: boolean;
  fetchAllowed: boolean;
  draftAllowed: boolean;
}

/**
 * Reads the client IP from request headers. Vercel always sets x-forwarded-for.
 * Returns "anonymous" as a stable fallback so the limiter still works locally.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = h.get("x-real-ip");
  if (real) return real.trim();
  return "anonymous";
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Read-only usage snapshot for the current IP. Used by the UI. */
export async function getUsage(): Promise<UsageState> {
  const ip = await getClientIp();
  const sb = supabaseAdmin();
  const { data } = await sb.from("usage_limits").select("*").eq("ip", ip).maybeSingle();

  const today = todayUtc();
  const sameDay = data?.reset_date === today;

  const unlocked = !!data?.unlocked;
  const fetchUsed = sameDay ? (data?.fetch_count ?? 0) : 0;
  const draftUsed = sameDay ? (data?.draft_count ?? 0) : 0;

  return {
    fetchUsed,
    draftUsed,
    unlocked,
    fetchAllowed: unlocked || fetchUsed < FETCH_DAILY_LIMIT,
    draftAllowed: unlocked || draftUsed < DRAFT_DAILY_LIMIT,
  };
}

/**
 * Checks the limit and atomically increments the counter for the given action.
 * Throws a `LIMIT_REACHED` error if the IP is over-quota and not unlocked.
 */
export async function consumeQuota(action: UsageAction): Promise<UsageState> {
  const ip = await getClientIp();
  const sb = supabaseAdmin();
  const today = todayUtc();

  // Upsert row + reset counters if it's a new day.
  const { data: row } = await sb.from("usage_limits").select("*").eq("ip", ip).maybeSingle();

  let fetchCount = row?.fetch_count ?? 0;
  let draftCount = row?.draft_count ?? 0;
  const unlocked = !!row?.unlocked;

  if (row?.reset_date !== today) {
    fetchCount = 0;
    draftCount = 0;
  }

  if (!unlocked) {
    if (action === "fetch" && fetchCount >= FETCH_DAILY_LIMIT) {
      throw Object.assign(new Error("LIMIT_REACHED"), { code: "LIMIT_REACHED", action });
    }
    if (action === "draft" && draftCount >= DRAFT_DAILY_LIMIT) {
      throw Object.assign(new Error("LIMIT_REACHED"), { code: "LIMIT_REACHED", action });
    }
  }

  if (action === "fetch") fetchCount += 1;
  else draftCount += 1;

  await sb.from("usage_limits").upsert({
    ip,
    fetch_count: fetchCount,
    draft_count: draftCount,
    unlocked,
    reset_date: today,
    updated_at: new Date().toISOString(),
  }, { onConflict: "ip" });

  return {
    fetchUsed: fetchCount,
    draftUsed: draftCount,
    unlocked,
    fetchAllowed: unlocked || fetchCount < FETCH_DAILY_LIMIT,
    draftAllowed: unlocked || draftCount < DRAFT_DAILY_LIMIT,
  };
}

/**
 * Validates the unlock code against UNLOCK_CODE env var. On match, marks the
 * caller's IP as unlocked. Returns updated UsageState.
 */
export async function applyUnlockCode(code: string): Promise<UsageState & { ok: boolean }> {
  const expected = process.env.UNLOCK_CODE?.trim();
  const ip = await getClientIp();

  if (!expected || code.trim() !== expected) {
    const u = await getUsage();
    return { ...u, ok: false };
  }

  const sb = supabaseAdmin();
  const today = todayUtc();
  await sb.from("usage_limits").upsert({
    ip,
    unlocked: true,
    reset_date: today,
    updated_at: new Date().toISOString(),
  }, { onConflict: "ip" });

  const u = await getUsage();
  return { ...u, ok: true };
}
