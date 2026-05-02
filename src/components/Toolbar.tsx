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
      {msg && <span className="mr-1 text-[12.5px] text-zinc-600">{msg}</span>}
      <button
        onClick={onFetch}
        disabled={pending}
        className="rounded-full border border-black/[0.08] bg-white px-4 py-2 text-[13px] font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 active:scale-[0.97] disabled:opacity-50"
      >
        Fetch news
      </button>
      <button
        onClick={onDraft}
        disabled={pending}
        className="rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-2 text-[13px] font-semibold text-white shadow shadow-emerald-500/30 ring-1 ring-emerald-600/30 transition hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.97] disabled:opacity-50"
      >
        Generate drafts
      </button>
    </div>
  );
}
