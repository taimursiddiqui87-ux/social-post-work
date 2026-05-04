"use client";

import { useState } from "react";
import { MARKETING_POSTS, pickByWeek, weekIndex, type MarketingPlatform, type MarketingPost } from "@/lib/marketing-posts";

const PLATFORM_LABEL: Record<MarketingPlatform, string> = {
  linkedin: "LinkedIn",
  twitter: "X / Twitter",
  facebook: "Facebook",
  instagram: "Instagram",
};

const PLATFORM_TONE: Record<MarketingPlatform, { bg: string; text: string; ring: string }> = {
  linkedin:  { bg: "bg-sky-50",   text: "text-sky-700",   ring: "ring-sky-200/70" },
  twitter:   { bg: "bg-zinc-900", text: "text-white",     ring: "ring-zinc-800" },
  facebook:  { bg: "bg-blue-50",  text: "text-blue-700",  ring: "ring-blue-200/70" },
  instagram: { bg: "bg-pink-50",  text: "text-pink-700",  ring: "ring-pink-200/70" },
};

const COMPOSE_URL: Record<MarketingPlatform, string> = {
  linkedin:  "https://www.linkedin.com/feed/?shareActive=true",
  twitter:   "https://twitter.com/intent/tweet",
  facebook:  "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
};

const ALL_PLATFORMS: MarketingPlatform[] = ["linkedin", "twitter", "facebook", "instagram"];

export function MarketingGrid() {
  const [filter, setFilter] = useState<"all" | MarketingPlatform>("all");
  const [weekOffset, setWeekOffset] = useState(0);

  const filtered = filter === "all"
    ? MARKETING_POSTS
    : MARKETING_POSTS.filter((p) => p.platform === filter);

  const counts: Record<"all" | MarketingPlatform, number> = {
    all: MARKETING_POSTS.length,
    linkedin:  MARKETING_POSTS.filter((p) => p.platform === "linkedin").length,
    twitter:   MARKETING_POSTS.filter((p) => p.platform === "twitter").length,
    facebook:  MARKETING_POSTS.filter((p) => p.platform === "facebook").length,
    instagram: MARKETING_POSTS.filter((p) => p.platform === "instagram").length,
  };

  const wk = weekIndex(weekOffset);
  const totalVariants = MARKETING_POSTS.reduce((s, p) => s + p.bodies.length, 0);

  return (
    <div className="space-y-5">
      {/* Header: week indicator + navigator */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/60 glass px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3 text-[12.5px]">
          <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-[11px] font-semibold text-white">
            Week {wk}
          </span>
          <span className="text-zinc-600">
            {weekOffset === 0 ? "this week's rotation" : weekOffset > 0 ? `+${weekOffset} week preview` : `${weekOffset} week back`}
          </span>
          <span className="text-zinc-400">·</span>
          <span className="text-zinc-500">{totalVariants} total variants across {MARKETING_POSTS.length} posts</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setWeekOffset((o) => o - 1)}
            className="rounded-full border border-black/[0.08] bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50">← Prev</button>
          <button onClick={() => setWeekOffset(0)}
            className="rounded-full border border-black/[0.08] bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50">Now</button>
          <button onClick={() => setWeekOffset((o) => o + 1)}
            className="rounded-full border border-black/[0.08] bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50">Next →</button>
        </div>
      </div>

      {/* Platform filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterPill label={`All · ${counts.all}`} active={filter === "all"} onClick={() => setFilter("all")} />
        {ALL_PLATFORMS.map((p) => (
          <FilterPill
            key={p}
            label={`${PLATFORM_LABEL[p]} · ${counts[p]}`}
            active={filter === p}
            onClick={() => setFilter(p)}
          />
        ))}
      </div>

      <ul className="stagger space-y-3">
        {filtered.map((post, i) => (
          <PostCard key={`${post.platform}-${post.variant}-${i}`} post={post} weekOffset={weekOffset} />
        ))}
      </ul>
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition active:scale-[0.97] ${
        active
          ? "bg-zinc-900 text-white shadow-sm"
          : "bg-white/80 text-zinc-700 ring-1 ring-black/[0.08] hover:bg-white"
      }`}
    >
      {label}
    </button>
  );
}

function PostCard({ post, weekOffset }: { post: MarketingPost; weekOffset: number }) {
  const [copied, setCopied] = useState(false);
  const tone = PLATFORM_TONE[post.platform];

  const body = pickByWeek(post.bodies, weekOffset);
  const variantNumber = (weekIndex(weekOffset) % post.bodies.length) + 1;
  const fullText = post.hashtags ? `${body}\n\n${post.hashtags}` : body;

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <li className="lift overflow-hidden rounded-2xl border border-white/60 glass shadow-sm hover:shadow">
      <div className="flex items-center justify-between border-b border-black/[0.05] bg-gradient-to-r px-5 py-3 from-white/60 to-white/30">
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] ring-1 ${tone.bg} ${tone.text} ${tone.ring}`}>
            {PLATFORM_LABEL[post.platform]}
          </span>
          <span className="text-[12px] font-medium text-zinc-700">{post.variant}</span>
          <span className="text-[10.5px] text-zinc-400">v{variantNumber}/{post.bodies.length}</span>
        </div>
        <span className="text-[11.5px] tabular-nums text-zinc-500">
          {fullText.length} chars
        </span>
      </div>

      <div className="px-5 py-4">
        <p className="whitespace-pre-wrap text-[14px] leading-[1.7] text-zinc-800">
          {body}
        </p>
        {post.hashtags && (
          <p className="mt-3 text-[12.5px] leading-relaxed text-zinc-500">{post.hashtags}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={onCopy}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold ring-1 transition active:scale-[0.97] ${
              copied
                ? "bg-emerald-50 text-emerald-700 ring-emerald-300"
                : `${tone.bg} ${tone.text} ${tone.ring} hover:opacity-90`
            }`}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
          <a
            href={COMPOSE_URL[post.platform]}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3.5 py-1.5 text-[11.5px] font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 active:scale-[0.97]"
          >
            Open {PLATFORM_LABEL[post.platform]} ↗
          </a>
        </div>
      </div>
    </li>
  );
}
