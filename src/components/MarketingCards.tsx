"use client";

/**
 * 6 marketing image cards (1080×1080 SVG) showcasing THS Post features.
 * Each card is downloadable as a PNG (canvas-based conversion in the browser).
 *
 * Use cases:
 *  - Instagram square posts
 *  - LinkedIn document cards
 *  - X / Facebook image attachments
 *  - Carousel slides
 */

import { useRef, useState, useTransition, type ReactElement } from "react";

type Card = {
  id: string;
  title: string;
  caption: string;
  bg: { from: string; via: string; to: string };
  emoji: string;
  highlight?: string;
  render: (p: CardRenderProps) => ReactElement;
};

interface CardRenderProps {
  card: Card;
}

const CARDS: Card[] = [
  {
    id: "hero",
    title: "AI news → social drafts",
    caption: "in 5 minutes a day",
    bg: { from: "#10b981", via: "#0ea5e9", to: "#4f46e5" },
    emoji: "✨",
    render: HeroCard,
  },
  {
    id: "sources",
    title: "25+ AI sources",
    caption: "OpenAI · DeepMind · Claude · Gemini · HuggingFace · Show HN +20 more",
    bg: { from: "#0ea5e9", via: "#4f46e5", to: "#ec4899" },
    emoji: "📡",
    highlight: "25+",
    render: SourcesCard,
  },
  {
    id: "bilingual",
    title: "EN + UR",
    caption: "Native bilingual drafting. English aur Urdu mein.",
    bg: { from: "#10b981", via: "#facc15", to: "#ec4899" },
    emoji: "🌐",
    render: BilingualCard,
  },
  {
    id: "trending",
    title: "Catch trends",
    caption: "Detected when 3+ sources cover the same story within 24h",
    bg: { from: "#fb923c", via: "#ec4899", to: "#a855f7" },
    emoji: "🔥",
    render: TrendingCard,
  },
  {
    id: "outreach",
    title: "50 LinkedIn DMs",
    caption: "personalized in 5 minutes — connection + 2 follow-ups each",
    bg: { from: "#4f46e5", via: "#0ea5e9", to: "#10b981" },
    emoji: "🤝",
    highlight: "50",
    render: OutreachCard,
  },
  {
    id: "stack",
    title: "Everything in one app",
    caption: "Queue · Ask AI · Outreach · Brand voice · Engagement",
    bg: { from: "#18181b", via: "#4f46e5", to: "#10b981" },
    emoji: "📱",
    render: StackCard,
  },
];

export function MarketingCards() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {CARDS.map((c) => (
        <CardItem key={c.id} card={c} />
      ))}
    </ul>
  );
}

function CardItem({ card }: { card: Card }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");

  const downloadPng = () => start(async () => {
    setMsg("Rendering…");
    try {
      const svg = ref.current?.querySelector("svg");
      if (!svg) throw new Error("svg not found");
      const xml = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
      const canvas = document.createElement("canvas");
      canvas.width = 1080; canvas.height = 1080;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, 1080, 1080);
      ctx.drawImage(img, 0, 0, 1080, 1080);
      URL.revokeObjectURL(url);
      const png: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/png", 0.95));
      if (!png) throw new Error("toBlob failed");
      const dl = URL.createObjectURL(png);
      const a = document.createElement("a");
      a.href = dl; a.download = `ths-post-${card.id}.png`;
      a.click();
      URL.revokeObjectURL(dl);
      setMsg("✓ Downloaded");
      setTimeout(() => setMsg(""), 1800);
    } catch (e) {
      setMsg(`Error: ${(e as Error).message}`);
    }
  });

  const downloadSvg = () => {
    const svg = ref.current?.querySelector("svg");
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `ths-post-${card.id}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <li className="lift overflow-hidden rounded-2xl border border-white/60 glass shadow-sm hover:shadow">
      <div ref={ref} className="aspect-square w-full">
        {card.render({ card })}
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-black/[0.05] bg-white/60 px-4 py-3">
        <div>
          <p className="text-[12.5px] font-semibold text-zinc-900">{card.title}</p>
          <p className="text-[11px] text-zinc-500">1080 × 1080 · square</p>
        </div>
        <div className="flex items-center gap-2">
          {msg && <span className="text-[11px] text-emerald-700">{msg}</span>}
          <button
            onClick={downloadSvg}
            className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[11.5px] font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 active:scale-[0.97]"
          >
            SVG
          </button>
          <button
            onClick={downloadPng}
            disabled={pending}
            className="rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-3.5 py-1.5 text-[11.5px] font-semibold text-white shadow shadow-emerald-500/30 ring-1 ring-emerald-600/30 transition hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.97] disabled:opacity-50"
          >
            {pending ? "…" : "Download PNG"}
          </button>
        </div>
      </div>
    </li>
  );
}

/* ──────────────────────── Card renderers ──────────────────────── */

function CardFrame({
  card, children,
}: { card: Card; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" className="block h-full w-full">
      <defs>
        <linearGradient id={`bg-${card.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={card.bg.from} />
          <stop offset="50%"  stopColor={card.bg.via} />
          <stop offset="100%" stopColor={card.bg.to} />
        </linearGradient>
        <radialGradient id={`vignette-${card.id}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
        </radialGradient>
        <filter id={`grain-${card.id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 0.06 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      <rect width="1080" height="1080" fill={`url(#bg-${card.id})`} />
      <rect width="1080" height="1080" fill={`url(#vignette-${card.id})`} />
      <rect width="1080" height="1080" filter={`url(#grain-${card.id})`} opacity="0.5" />

      {children}

      {/* Footer brand strip */}
      <g>
        <text x="60" y="1010" fontFamily="Inter, system-ui, -apple-system, sans-serif" fontSize="28" fontWeight="700" fill="white" opacity="0.95">
          THS Post
        </text>
        <text x="60" y="1042" fontFamily="Inter, system-ui, sans-serif" fontSize="20" fontWeight="500" fill="white" opacity="0.7">
          AI news → social drafts
        </text>
        <text x="1020" y="1042" textAnchor="end" fontFamily="Inter, system-ui, sans-serif" fontSize="20" fontWeight="500" fill="white" opacity="0.7">
          ths-post.app
        </text>
      </g>
    </svg>
  );
}

function HeroCard({ card }: CardRenderProps) {
  return (
    <CardFrame card={card}>
      <text x="60" y="200" fontFamily="Inter, system-ui, sans-serif" fontSize="48" fill="white" opacity="0.85">{card.emoji}</text>
      <text x="60" y="380" fontFamily="Inter, system-ui, sans-serif" fontSize="92" fontWeight="700" fill="white" letterSpacing="-3">
        AI news
      </text>
      <text x="60" y="490" fontFamily="Inter, system-ui, sans-serif" fontSize="92" fontWeight="700" fill="white" letterSpacing="-3" opacity="0.85">
        → social drafts
      </text>
      <text x="60" y="600" fontFamily="Inter, system-ui, sans-serif" fontSize="44" fontWeight="500" fill="white" opacity="0.85">
        in 5 minutes a day.
      </text>

      <g transform="translate(60, 720)">
        {["LinkedIn", "X", "Facebook", "Instagram"].map((p, i) => (
          <g key={p} transform={`translate(${i * 220}, 0)`}>
            <rect width="200" height="64" rx="32" fill="white" fillOpacity="0.18" stroke="white" strokeOpacity="0.35" />
            <text x="100" y="42" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="22" fontWeight="600" fill="white">{p}</text>
          </g>
        ))}
      </g>
    </CardFrame>
  );
}

function SourcesCard({ card }: CardRenderProps) {
  const sources = ["OpenAI", "Claude", "DeepMind", "Gemini", "HuggingFace", "Show HN", "Latent Space", "Simon Willison", "AWS ML", "MarkTechPost", "AI Business", "Rundown AI"];
  return (
    <CardFrame card={card}>
      <text x="60" y="180" fontFamily="Inter, system-ui, sans-serif" fontSize="44" fill="white" opacity="0.85">{card.emoji}</text>
      <text x="60" y="320" fontFamily="Inter, system-ui, sans-serif" fontSize="220" fontWeight="800" fill="white" letterSpacing="-8">25+</text>
      <text x="60" y="430" fontFamily="Inter, system-ui, sans-serif" fontSize="64" fontWeight="700" fill="white" opacity="0.95" letterSpacing="-1">
        AI sources
      </text>
      <text x="60" y="490" fontFamily="Inter, system-ui, sans-serif" fontSize="32" fontWeight="500" fill="white" opacity="0.75">
        watched continuously
      </text>

      <g transform="translate(60, 580)">
        {sources.slice(0, 12).map((s, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          return (
            <g key={s} transform={`translate(${col * 320}, ${row * 70})`}>
              <rect width="300" height="54" rx="14" fill="white" fillOpacity="0.16" stroke="white" strokeOpacity="0.3" />
              <circle cx="28" cy="27" r="6" fill="white" fillOpacity="0.85" />
              <text x="50" y="36" fontFamily="Inter, system-ui, sans-serif" fontSize="22" fontWeight="600" fill="white">{s}</text>
            </g>
          );
        })}
      </g>
    </CardFrame>
  );
}

function BilingualCard({ card }: CardRenderProps) {
  return (
    <CardFrame card={card}>
      <text x="60" y="180" fontFamily="Inter, system-ui, sans-serif" fontSize="44" fill="white" opacity="0.9">{card.emoji}</text>
      <text x="540" y="490" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="280" fontWeight="800" fill="white" letterSpacing="-12">
        EN
      </text>
      <text x="540" y="540" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="80" fontWeight="700" fill="white" opacity="0.9">
        ＋
      </text>
      <text x="540" y="780" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="280" fontWeight="800" fill="white" letterSpacing="-12">
        UR
      </text>
      <text x="540" y="850" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="32" fontWeight="500" fill="white" opacity="0.85">
        Native bilingual drafting. English aur Urdu.
      </text>
    </CardFrame>
  );
}

function TrendingCard({ card }: CardRenderProps) {
  return (
    <CardFrame card={card}>
      <text x="540" y="380" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="280" fill="white">
        {card.emoji}
      </text>
      <text x="540" y="540" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="100" fontWeight="800" fill="white" letterSpacing="-3">
        Catch trends
      </text>
      <text x="540" y="620" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="100" fontWeight="800" fill="white" letterSpacing="-3" opacity="0.85">
        first.
      </text>
      <text x="540" y="730" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="36" fontWeight="500" fill="white" opacity="0.85">
        Auto-detected when 3+ sources cover
      </text>
      <text x="540" y="780" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="36" fontWeight="500" fill="white" opacity="0.85">
        the same story within 24h.
      </text>
    </CardFrame>
  );
}

function OutreachCard({ card }: CardRenderProps) {
  return (
    <CardFrame card={card}>
      <text x="60" y="180" fontFamily="Inter, system-ui, sans-serif" fontSize="44" fill="white" opacity="0.9">{card.emoji}</text>
      <text x="60" y="380" fontFamily="Inter, system-ui, sans-serif" fontSize="240" fontWeight="800" fill="white" letterSpacing="-10">50</text>
      <text x="60" y="460" fontFamily="Inter, system-ui, sans-serif" fontSize="64" fontWeight="700" fill="white" letterSpacing="-1">
        LinkedIn DMs
      </text>
      <text x="60" y="530" fontFamily="Inter, system-ui, sans-serif" fontSize="40" fontWeight="500" fill="white" opacity="0.85">
        personalized in 5 minutes.
      </text>

      <g transform="translate(60, 620)">
        <rect width="960" height="280" rx="20" fill="white" fillOpacity="0.14" stroke="white" strokeOpacity="0.3" />
        <text x="32" y="50" fontFamily="Inter, system-ui, sans-serif" fontSize="22" fontWeight="600" fill="white" opacity="0.7">DAY 1</text>
        <text x="32" y="92" fontFamily="Inter, system-ui, sans-serif" fontSize="28" fontWeight="500" fill="white">→ Connection request (≤300 chars)</text>
        <text x="32" y="148" fontFamily="Inter, system-ui, sans-serif" fontSize="22" fontWeight="600" fill="white" opacity="0.7">DAY 4</text>
        <text x="32" y="190" fontFamily="Inter, system-ui, sans-serif" fontSize="28" fontWeight="500" fill="white">→ Light follow-up nudge</text>
        <text x="32" y="246" fontFamily="Inter, system-ui, sans-serif" fontSize="22" fontWeight="600" fill="white" opacity="0.7">DAY 7</text>
      </g>
    </CardFrame>
  );
}

function StackCard({ card }: CardRenderProps) {
  const features = [
    { emoji: "📰", label: "Queue" },
    { emoji: "✨", label: "Ask AI" },
    { emoji: "🤝", label: "Outreach" },
    { emoji: "🎨", label: "Brand voice" },
    { emoji: "📊", label: "Engagement" },
    { emoji: "🌐", label: "EN + UR" },
  ];
  return (
    <CardFrame card={card}>
      <text x="60" y="180" fontFamily="Inter, system-ui, sans-serif" fontSize="44" fill="white" opacity="0.9">{card.emoji}</text>
      <text x="60" y="320" fontFamily="Inter, system-ui, sans-serif" fontSize="92" fontWeight="800" fill="white" letterSpacing="-3">
        Everything
      </text>
      <text x="60" y="420" fontFamily="Inter, system-ui, sans-serif" fontSize="92" fontWeight="800" fill="white" letterSpacing="-3" opacity="0.85">
        in one app.
      </text>

      <g transform="translate(60, 540)">
        {features.map((f, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          return (
            <g key={f.label} transform={`translate(${col * 480}, ${row * 130})`}>
              <rect width="460" height="110" rx="20" fill="white" fillOpacity="0.16" stroke="white" strokeOpacity="0.32" />
              <text x="34" y="72" fontFamily="Inter, system-ui, sans-serif" fontSize="48" fill="white">{f.emoji}</text>
              <text x="120" y="68" fontFamily="Inter, system-ui, sans-serif" fontSize="34" fontWeight="700" fill="white">{f.label}</text>
            </g>
          );
        })}
      </g>
    </CardFrame>
  );
}
