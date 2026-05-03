"use client";

import { useState, useTransition } from "react";
import { searchItemsAction, askAi } from "@/app/actions";
import type { SearchHit } from "@/lib/search";

const ASK_DAILY_LIMIT = 3;
const WHATSAPP_NUMBER = "923114488938";

function timeAgo(iso: string | null) {
  if (!iso) return "—";
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.round(d / 60)}m ago`;
  if (d < 86400) return `${Math.round(d / 3600)}h ago`;
  return `${Math.round(d / 86400)}d ago`;
}
function host(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

export function SearchPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [searched, setSearched] = useState(false);
  const [pending, start] = useTransition();

  const [askQuestion, setAskQuestion] = useState("");
  const [askAnswer, setAskAnswer] = useState("");
  const [askMsg, setAskMsg] = useState("");
  const [askPending, startAsk] = useTransition();
  const [askLocked, setAskLocked] = useState(false);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    start(async () => {
      const r = await searchItemsAction(query.trim());
      setResults(r);
      setSearched(true);
      setAskAnswer("");
    });
  };

  const onAsk = () => {
    if (!askQuestion.trim()) return;
    startAsk(async () => {
      setAskAnswer("");
      setAskMsg("Thinking…");
      const r = await askAi(askQuestion.trim(), results.map((x) => x.id));
      if (!r.ok) {
        setAskMsg(r.reason === "LIMIT_REACHED" ? "Free Ask AI limit reached for today." : `Error: ${r.message}`);
        if (r.reason === "LIMIT_REACHED") setAskLocked(true);
        return;
      }
      setAskAnswer(r.data);
      setAskMsg(`${r.usage.askUsed}/${ASK_DAILY_LIMIT} used today`);
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={onSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search e.g. claude, gemini api, AI agents…"
          autoFocus
          className="flex-1 rounded-full border border-black/[0.1] bg-white px-5 py-3 text-[15px] text-zinc-900 placeholder-zinc-400 shadow-sm transition focus:border-emerald-400"
        />
        <button
          type="submit"
          disabled={pending || !query.trim()}
          className="rounded-full bg-zinc-900 px-5 py-3 text-[13.5px] font-semibold text-white transition hover:bg-zinc-800 active:scale-[0.97] disabled:opacity-50"
        >
          {pending ? "Searching…" : "Search"}
        </button>
      </form>

      {searched && results.length === 0 && (
        <div className="rounded-3xl border border-dashed border-black/[0.08] p-12 text-center text-[14px] text-zinc-500">
          No matches in your fetched articles. Try clicking <strong className="text-zinc-700">Fetch news</strong> on the queue page first.
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="space-y-2">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-zinc-500">
              {results.length} {results.length === 1 ? "result" : "results"}
            </p>
            <ul className="space-y-2">
              {results.map((r) => (
                <li key={r.id} className="rounded-2xl border border-black/[0.06] bg-white/80 p-4 shadow-sm backdrop-blur-xl transition hover:border-black/[0.1]">
                  <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-zinc-500">
                    <span>{r.source_name ?? host(r.url)}</span>
                    <span className="text-zinc-300">·</span>
                    <span>{timeAgo(r.published_at)}</span>
                  </div>
                  <a href={r.url} target="_blank" rel="noreferrer"
                    className="block text-[15px] font-semibold tracking-tight text-zinc-900 hover:text-emerald-700">
                    {r.title}
                  </a>
                  {r.summary && (
                    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-zinc-600">{r.summary}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Ask AI panel */}
          <div className="rounded-3xl border border-black/[0.06] bg-gradient-to-b from-white/90 to-emerald-50/40 p-5 shadow-sm backdrop-blur-xl">
            <div className="mb-2.5 flex items-center justify-between">
              <p className="text-[15px] font-semibold tracking-tight text-zinc-900">
                ✨ Ask AI about these results
              </p>
              <span className="text-[11.5px] text-zinc-500">
                {askMsg || `Free: ${ASK_DAILY_LIMIT}/day`}
              </span>
            </div>
            <textarea
              value={askQuestion}
              onChange={(e) => setAskQuestion(e.target.value)}
              placeholder='e.g., "What are the latest Claude features?" or "Summarize what OpenAI announced this week"'
              rows={2}
              className="w-full resize-none rounded-2xl border border-black/[0.08] bg-white p-3.5 text-[14px] leading-relaxed text-zinc-900 placeholder-zinc-400 shadow-sm transition focus:border-emerald-400"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <button
                onClick={onAsk}
                disabled={askPending || !askQuestion.trim() || askLocked}
                className="rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-5 py-2 text-[12.5px] font-semibold text-white shadow shadow-emerald-500/30 ring-1 ring-emerald-600/30 transition hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.97] disabled:opacity-50"
              >
                {askPending ? "Thinking…" : "Ask AI"}
              </button>
              {askLocked && (
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'd like an unlock code for Social Post Work.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-2 text-[11.5px] font-semibold text-white transition hover:bg-[#1faf52]"
                >
                  WhatsApp for unlimited
                </a>
              )}
            </div>
            {askAnswer && (
              <div className="mt-4 rounded-2xl border border-black/[0.05] bg-white p-4 text-[14px] leading-[1.7] text-zinc-800 whitespace-pre-wrap shadow-sm">
                {askAnswer}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
