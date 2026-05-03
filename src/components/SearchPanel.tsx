"use client";

import { useState, useTransition } from "react";
import { askAndSearch } from "@/app/actions";
import type { SearchHit } from "@/lib/search";

const ASK_DAILY_LIMIT = 3;
const WHATSAPP_NUMBER = "923114488938";

const EXAMPLES = [
  "What did OpenAI announce this week?",
  "Summarize the latest Claude updates",
  "Compare Sora and Veo for video generation",
  "What's new with AI agents?",
  "Tell me about manus.im and similar new tools",
];

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
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [articles, setArticles] = useState<SearchHit[]>([]);
  const [showArticles, setShowArticles] = useState(false);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");
  const [locked, setLocked] = useState(false);

  const submit = (q?: string) => {
    const finalQ = (q ?? question).trim();
    if (!finalQ) return;
    setQuestion(finalQ);
    start(async () => {
      setAnswer("");
      setArticles([]);
      setMsg("Thinking…");
      const r = await askAndSearch(finalQ);
      if (!r.ok) {
        setMsg(r.reason === "LIMIT_REACHED" ? "Free daily Ask AI limit reached." : `Error: ${r.message}`);
        if (r.reason === "LIMIT_REACHED") setLocked(true);
        return;
      }
      setAnswer(r.data.answer);
      setArticles(r.data.articles);
      setMsg(`${r.usage.askUsed}/${ASK_DAILY_LIMIT} used today`);
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <div className="space-y-6">
      {/* Ask box */}
      <form onSubmit={onSubmit} className="rounded-3xl border border-black/[0.06] bg-gradient-to-b from-white/95 to-emerald-50/20 p-5 shadow-sm backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[13px] font-semibold tracking-tight text-zinc-900">
            ✨ Ask anything about AI
          </p>
          <span className="text-[11.5px] text-zinc-500">
            {msg || `Free: ${ASK_DAILY_LIMIT}/day`}
          </span>
        </div>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSubmit(e as unknown as React.FormEvent);
          }}
          placeholder='e.g., "What are the latest Claude features?" or "Compare Sora and Veo"'
          rows={3}
          className="w-full resize-none rounded-2xl border border-black/[0.08] bg-white p-4 text-[15px] leading-[1.6] text-zinc-900 placeholder-zinc-400 shadow-sm transition focus:border-emerald-400"
        />
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="submit"
            disabled={pending || !question.trim() || locked}
            className="rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-5 py-2 text-[13px] font-semibold text-white shadow shadow-emerald-500/30 ring-1 ring-emerald-600/30 transition hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.97] disabled:opacity-50"
          >
            {pending ? "Thinking…" : "Ask AI"}
          </button>
          <span className="text-[11px] text-zinc-400">⌘ + Enter to submit</span>
        </div>
        {locked && (
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'd like an unlock code for Social Post Work.")}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[#1faf52]"
          >
            WhatsApp +92 311 4488938 for unlimited
          </a>
        )}
      </form>

      {/* Quick examples (when nothing asked yet) */}
      {!answer && !pending && (
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => submit(ex)}
              disabled={locked}
              className="rounded-full border border-black/[0.08] bg-white px-3.5 py-1.5 text-[12px] font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-900 active:scale-[0.97] disabled:opacity-50"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {/* AI answer */}
      {answer && (
        <div className="rounded-3xl border border-black/[0.06] bg-white/90 p-6 shadow-sm backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-emerald-700">
              ✨ Answer
            </p>
            <span className="text-[11px] text-zinc-400">Llama 3.3 70B via Groq</span>
          </div>
          <div className="text-[14.5px] leading-[1.75] text-zinc-800 whitespace-pre-wrap">
            {answer}
          </div>
        </div>
      )}

      {/* Related articles */}
      {articles.length > 0 && (
        <div>
          <button
            onClick={() => setShowArticles(!showArticles)}
            className="mb-3 inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-zinc-500 hover:text-zinc-800"
          >
            <span className={`inline-block transition-transform ${showArticles ? "rotate-90" : ""}`}>▸</span>
            Related from your feeds · {articles.length}
          </button>
          {showArticles && (
            <ul className="space-y-2">
              {articles.slice(0, 20).map((r) => (
                <li key={r.id} className="rounded-2xl border border-black/[0.06] bg-white/80 p-4 shadow-sm backdrop-blur-xl transition hover:border-black/[0.1]">
                  <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-zinc-500">
                    <span>{r.source_name ?? host(r.url)}</span>
                    <span className="text-zinc-300">·</span>
                    <span>{timeAgo(r.published_at)}</span>
                  </div>
                  <a href={r.url} target="_blank" rel="noreferrer"
                    className="block text-[14.5px] font-semibold tracking-tight text-zinc-900 hover:text-emerald-700">
                    {r.title}
                  </a>
                  {r.summary && (
                    <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-zinc-600">{r.summary}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
