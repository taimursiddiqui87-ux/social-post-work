"use client";
import { useState, useTransition } from "react";
import { runFetch, runDraft } from "@/app/actions";

export function Toolbar() {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string>("");

  const onFetch = () => startTransition(async () => {
    setMsg("Fetching feeds…");
    const r = await runFetch();
    setMsg(`+${r.inserted} new · ${r.skipped} dupes${r.errors.length ? ` · ${r.errors.length} errors` : ""}`);
  });
  const onDraft = () => startTransition(async () => {
    setMsg("Generating drafts…");
    const r = await runDraft();
    const ok = r.filter(x => !x.error).length;
    setMsg(`Drafted ${ok}/${r.length} articles`);
  });

  return (
    <div className="flex items-center gap-2">
      {msg && <span className="mr-1 text-[11.5px] text-neutral-500">{msg}</span>}
      <button
        onClick={onFetch}
        disabled={pending}
        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[12px] font-medium text-neutral-200 backdrop-blur transition hover:bg-white/[0.06] active:scale-[0.97] disabled:opacity-50"
      >
        Fetch news
      </button>
      <button
        onClick={onDraft}
        disabled={pending}
        className="rounded-full bg-gradient-to-b from-emerald-400 to-emerald-500 px-4 py-2 text-[12px] font-semibold text-white shadow shadow-emerald-500/30 ring-1 ring-emerald-400/40 transition hover:from-emerald-300 hover:to-emerald-400 active:scale-[0.97] disabled:opacity-50"
      >
        Generate drafts
      </button>
    </div>
  );
}
