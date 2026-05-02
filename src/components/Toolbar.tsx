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
      {msg && <span className="mr-1 text-xs text-neutral-500">{msg}</span>}
      <button onClick={onFetch} disabled={pending}
        className="rounded-lg border border-neutral-800 bg-neutral-900/60 px-3.5 py-2 text-xs font-medium text-neutral-200 transition hover:bg-neutral-900 disabled:opacity-50">
        Fetch news
      </button>
      <button onClick={onDraft} disabled={pending}
        className="rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-medium text-white shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:opacity-50">
        Generate drafts
      </button>
    </div>
  );
}
