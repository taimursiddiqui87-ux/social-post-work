"use client";
import { useState, useTransition, useEffect } from "react";
import { runFetch, runDraft, fetchUsage, unlockWithCode } from "@/app/actions";
import type { UsageState } from "@/lib/limits";

const FETCH_DAILY_LIMIT = 2;
const DRAFT_DAILY_LIMIT = 2;
const WHATSAPP_NUMBER = "923114488938";

export function Toolbar() {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string>("");
  const [usage, setUsage] = useState<UsageState | null>(null);
  const [showUnlock, setShowUnlock] = useState(false);
  const [code, setCode] = useState("");
  const [unlockMsg, setUnlockMsg] = useState<string>("");

  // Load usage state on mount.
  useEffect(() => { fetchUsage().then(setUsage); }, []);

  const onFetch = () => startTransition(async () => {
    setMsg("Fetching feeds…");
    const r = await runFetch();
    setUsage(r.usage);
    if (!r.ok) {
      setMsg(r.reason === "LIMIT_REACHED" ? "Free fetch limit reached for today." : `Error: ${r.message}`);
      if (r.reason === "LIMIT_REACHED") setShowUnlock(true);
      return;
    }
    const data = r.data;
    setMsg(`+${data.inserted} new · ${data.skipped} dupes${data.errors.length ? ` · ${data.errors.length} errors` : ""}`);
  });

  const onDraft = () => startTransition(async () => {
    setMsg("Generating drafts…");
    const r = await runDraft();
    setUsage(r.usage);
    if (!r.ok) {
      setMsg(r.reason === "LIMIT_REACHED" ? "Free draft limit reached for today." : `Error: ${r.message}`);
      if (r.reason === "LIMIT_REACHED") setShowUnlock(true);
      return;
    }
    const arr = r.data;
    const ok = arr.filter(x => !x.error).length;
    setMsg(`Drafted ${ok}/${arr.length} articles`);
  });

  const onUnlock = () => startTransition(async () => {
    setUnlockMsg("");
    const r = await unlockWithCode(code);
    setUsage(r);
    if (r.ok) {
      setUnlockMsg("✓ Unlocked! Unlimited access activated.");
      setCode("");
      setTimeout(() => setShowUnlock(false), 1200);
    } else {
      setUnlockMsg("Invalid code. Double-check what we sent on WhatsApp.");
    }
  });

  const fetchDisabled = pending || (usage && !usage.fetchAllowed);
  const draftDisabled = pending || (usage && !usage.draftAllowed);
  const isUnlocked = usage?.unlocked === true;

  return (
    <div className="flex flex-col items-end gap-2.5">
      <div className="flex items-center gap-2">
        {msg && <span className="mr-1 text-[12.5px] text-zinc-600">{msg}</span>}
        <button
          onClick={onFetch}
          disabled={!!fetchDisabled}
          className="rounded-full border border-black/[0.08] bg-white px-4 py-2 text-[13px] font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 active:scale-[0.97] disabled:opacity-50"
        >
          Fetch news
        </button>
        <button
          onClick={onDraft}
          disabled={!!draftDisabled}
          className="rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-2 text-[13px] font-semibold text-white shadow shadow-emerald-500/30 ring-1 ring-emerald-600/30 transition hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.97] disabled:opacity-50"
        >
          Generate drafts
        </button>
      </div>

      {/* Usage indicator */}
      {usage && !isUnlocked && (
        <div className="flex items-center gap-3 text-[11.5px] text-zinc-500">
          <UsagePip label="Fetches" used={usage.fetchUsed} limit={FETCH_DAILY_LIMIT} />
          <span className="text-zinc-300">·</span>
          <UsagePip label="Drafts" used={usage.draftUsed} limit={DRAFT_DAILY_LIMIT} />
          {!showUnlock && (usage.fetchUsed > 0 || usage.draftUsed > 0) && (
            <button
              onClick={() => setShowUnlock(true)}
              className="text-[11.5px] font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Unlock unlimited →
            </button>
          )}
        </div>
      )}

      {usage && isUnlocked && (
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Unlimited access
        </div>
      )}

      {/* Unlock prompt */}
      {showUnlock && !isUnlocked && (
        <div className="mt-1 w-[300px] rounded-2xl border border-black/[0.08] bg-white p-4 shadow-lg">
          <p className="text-[13px] font-semibold text-zinc-900">Free daily limit reached</p>
          <p className="mt-1 text-[12px] leading-relaxed text-zinc-600">
            Need more fetches and drafts? Get an unlock code via WhatsApp.
          </p>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'd like an unlock code for Social Post Work.")}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-3 py-2 text-[12.5px] font-semibold text-white shadow-sm transition hover:bg-[#1faf52] active:scale-[0.98]"
          >
            <WhatsAppIcon /> WhatsApp +92 311 4488938
          </a>

          <div className="mt-3">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-zinc-500">
              Have a code?
            </label>
            <div className="mt-1 flex gap-1.5">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="paste code"
                className="flex-1 rounded-lg border border-black/[0.1] bg-white px-2.5 py-1.5 text-[12.5px] text-zinc-900 shadow-sm focus:border-emerald-400"
              />
              <button
                onClick={onUnlock}
                disabled={pending || !code}
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-zinc-800 active:scale-[0.97] disabled:opacity-50"
              >Unlock</button>
            </div>
            {unlockMsg && (
              <p className={`mt-1.5 text-[11.5px] ${unlockMsg.startsWith("✓") ? "text-emerald-700" : "text-red-600"}`}>
                {unlockMsg}
              </p>
            )}
          </div>

          <button
            onClick={() => { setShowUnlock(false); setUnlockMsg(""); }}
            className="mt-2 w-full text-[11.5px] text-zinc-500 hover:text-zinc-700"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

function UsagePip({ label, used, limit }: { label: string; used: number; limit: number }) {
  const isOver = used >= limit;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-medium text-zinc-700">{label}</span>
      <span className={`tabular-nums ${isOver ? "text-amber-700" : "text-zinc-500"}`}>
        {used}/{limit}
      </span>
    </span>
  );
}

function WhatsAppIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z"/></svg>;
}
