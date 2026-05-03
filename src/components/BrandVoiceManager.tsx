"use client";

import { useState, useTransition } from "react";
import { addVoiceExample, deleteVoiceExample } from "@/app/actions";

type Platform = "linkedin" | "twitter" | "facebook" | "instagram";

interface VoiceExample {
  id: string;
  platform: Platform;
  body: string;
  label: string | null;
  created_at: string;
}

const PLATFORM_LABEL: Record<Platform, string> = {
  linkedin: "LinkedIn",
  twitter: "X / Twitter",
  facebook: "Facebook",
  instagram: "Instagram",
};

const PLATFORM_TONE: Record<Platform, { bg: string; text: string; ring: string }> = {
  linkedin:  { bg: "bg-sky-50",   text: "text-sky-700",   ring: "ring-sky-200/70" },
  twitter:   { bg: "bg-zinc-900", text: "text-white",     ring: "ring-zinc-800" },
  facebook:  { bg: "bg-blue-50",  text: "text-blue-700",  ring: "ring-blue-200/70" },
  instagram: { bg: "bg-pink-50",  text: "text-pink-700",  ring: "ring-pink-200/70" },
};

export function BrandVoiceManager({ initial }: { initial: VoiceExample[] }) {
  const [examples, setExamples] = useState<VoiceExample[]>(initial);
  const [platform, setPlatform] = useState<Platform>("linkedin");
  const [body, setBody] = useState("");
  const [label, setLabel] = useState("");
  const [pending, start] = useTransition();

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    start(async () => {
      const created = await addVoiceExample(platform, body.trim(), label.trim() || null);
      setExamples([created, ...examples]);
      setBody("");
      setLabel("");
    });
  };

  const onDelete = (id: string) => {
    start(async () => {
      await deleteVoiceExample(id);
      setExamples(examples.filter((e) => e.id !== id));
    });
  };

  const grouped: Record<Platform, VoiceExample[]> = {
    linkedin: [], twitter: [], facebook: [], instagram: [],
  };
  for (const ex of examples) grouped[ex.platform].push(ex);

  return (
    <div className="space-y-6">
      {/* Add form */}
      <form onSubmit={onAdd} className="rounded-2xl border border-black/[0.06] bg-white/80 p-5 shadow-sm backdrop-blur-xl">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[13px] font-semibold text-zinc-700">Platform:</span>
          <div className="flex rounded-full bg-zinc-100 p-0.5 ring-1 ring-black/[0.04]">
            {(["linkedin", "twitter", "facebook", "instagram"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`rounded-full px-3 py-1 text-[12px] font-semibold transition ${
                  platform === p ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {PLATFORM_LABEL[p]}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          placeholder="Paste an example post you wrote (or a post whose tone you'd like to match)…"
          className="w-full resize-none rounded-2xl border border-black/[0.08] bg-white p-3.5 text-[14px] leading-[1.65] text-zinc-900 placeholder-zinc-400 shadow-sm transition focus:border-emerald-400"
        />
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Optional label (e.g., 'good hook')"
            className="flex-1 rounded-full border border-black/[0.1] bg-white px-3.5 py-2 text-[12.5px] text-zinc-900 placeholder-zinc-400 shadow-sm transition focus:border-emerald-400"
          />
          <button
            type="submit"
            disabled={pending || !body.trim()}
            className="rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-2 text-[12.5px] font-semibold text-white shadow shadow-emerald-500/30 ring-1 ring-emerald-600/30 transition hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.97] disabled:opacity-50"
          >
            {pending ? "Saving…" : "Add example"}
          </button>
        </div>
      </form>

      {/* List grouped by platform */}
      {(Object.keys(grouped) as Platform[]).map((p) => {
        const items = grouped[p];
        if (items.length === 0) return null;
        const tone = PLATFORM_TONE[p];
        return (
          <div key={p}>
            <div className="mb-2 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] ring-1 ${tone.bg} ${tone.text} ${tone.ring}`}>
                {PLATFORM_LABEL[p]}
              </span>
              <span className="text-[12px] text-zinc-500">{items.length} {items.length === 1 ? "example" : "examples"} · top 3 used</span>
            </div>
            <ul className="space-y-2">
              {items.map((ex, i) => {
                const inUse = i < 3;
                return (
                  <li key={ex.id} className={`rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur-xl ${inUse ? "border-emerald-200" : "border-black/[0.06] opacity-70"}`}>
                    <div className="mb-2 flex items-center justify-between">
                      {ex.label && <span className="text-[12px] font-medium text-zinc-700">{ex.label}</span>}
                      {!ex.label && <span className="text-[11.5px] text-zinc-400">Example #{i + 1}</span>}
                      <div className="flex items-center gap-3">
                        {inUse && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            in use
                          </span>
                        )}
                        <button
                          onClick={() => onDelete(ex.id)}
                          className="text-[11.5px] font-medium text-zinc-500 transition hover:text-red-600"
                        >Delete</button>
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-zinc-700 line-clamp-6">
                      {ex.body}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {examples.length === 0 && (
        <div className="rounded-3xl border border-dashed border-black/[0.08] p-10 text-center text-[14px] text-zinc-500">
          No voice examples yet. Add your first one above to start training the drafter on your style.
        </div>
      )}
    </div>
  );
}
