"use client";

/**
 * Data-driven marketing image cards (1080×1080 SVG).
 * Each card spec maps to a renderer; each renderer is parameterised by the
 * project's `CardSpec`. Branding (name, tagline, domain) comes from the
 * project itself, so the same renderer serves every project.
 */

import { useRef, useState, useTransition, type ReactElement } from "react";
import {
  cycleIndex,
  cycleLabel,
  cycleDateRange,
  CYCLE_DAYS_LABEL,
  themeForCycle,
  type CardSpec,
  type MarketingProject,
  type Palette,
  type Theme,
} from "@/lib/marketing";

interface RenderProps {
  spec: CardSpec;
  bg: Palette;
  project: MarketingProject;
  theme: Theme;
}

export function MarketingCards({ project }: { project: MarketingProject }) {
  const [cycleOffset, setCycleOffset] = useState(0);
  const theme = themeForCycle(cycleOffset);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/60 glass px-5 py-3.5 shadow-sm">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold tracking-tight text-zinc-900">{cycleLabel(cycleOffset)}</span>
            {cycleOffset === 0 && (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700 ring-1 ring-emerald-500/30">Live</span>
            )}
            <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${theme.caption.pillBg} ${theme.caption.pillText}`}>
              {theme.emoji} {theme.name}
            </span>
          </div>
          <p className="text-[12px] text-zinc-500">
            {cycleDateRange(cycleOffset)} · 4 palettes × 6 themes per card · auto-rotates every {CYCLE_DAYS_LABEL} days (00:00 PKT)
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCycleOffset((o) => o - 1)}
            title="See the previous rotation"
            className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-semibold text-zinc-700 transition hover:bg-zinc-50 active:scale-[0.97]">
            ← Previous
          </button>
          <button
            onClick={() => setCycleOffset(0)}
            disabled={cycleOffset === 0}
            className="inline-flex items-center rounded-full bg-zinc-900 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-zinc-800 active:scale-[0.97] disabled:opacity-40 disabled:cursor-default">
            Today
          </button>
          <button
            onClick={() => setCycleOffset((o) => o + 1)}
            title="Preview the next rotation"
            className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-semibold text-zinc-700 transition hover:bg-zinc-50 active:scale-[0.97]">
            Next →
          </button>
        </div>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {project.cards.map((spec) => (
          <CardItem key={spec.id} spec={spec} project={project} cycleOffset={cycleOffset} theme={theme} />
        ))}
      </ul>
    </div>
  );
}

function CardItem({ spec, project, cycleOffset, theme }: { spec: CardSpec; project: MarketingProject; cycleOffset: number; theme: Theme }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");

  const paletteIdx = cycleIndex(cycleOffset) % spec.palettes.length;
  const bg = spec.palettes[paletteIdx];

  // PNG bg fallback color depends on theme — black for dark/bold, white for light themes
  const pngBgFill =
    theme.svg.bgMode === "solid-light" || theme.svg.bgMode === "pastel" || theme.svg.bgMode === "neutral"
      ? "#ffffff"
      : "#000000";

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
      ctx.fillStyle = pngBgFill;
      ctx.fillRect(0, 0, 1080, 1080);
      ctx.drawImage(img, 0, 0, 1080, 1080);
      URL.revokeObjectURL(url);
      const png: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/png", 0.95));
      if (!png) throw new Error("toBlob failed");
      const dl = URL.createObjectURL(png);
      const a = document.createElement("a");
      a.href = dl; a.download = `${project.id}-${spec.id}-${theme.id}.png`;
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
    a.href = url; a.download = `${project.id}-${spec.id}-${theme.id}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cardTitle = cardTitleFor(spec);

  return (
    <li className="lift overflow-hidden rounded-2xl border border-white/60 glass shadow-sm hover:shadow">
      <div ref={ref} className="aspect-square w-full">
        <CardRenderer spec={spec} bg={bg} project={project} theme={theme} />
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-black/[0.05] bg-white/60 px-4 py-3">
        <div>
          <p className="text-[12.5px] font-semibold text-zinc-900">{cardTitle}</p>
          <p className="text-[11px] text-zinc-500">
            1080 × 1080 · {theme.emoji} {theme.name} · palette {paletteIdx + 1}/{spec.palettes.length}
          </p>
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

function cardTitleFor(spec: CardSpec): string {
  switch (spec.kind) {
    case "hero":        return spec.title1;
    case "stat":        return `${spec.number} ${spec.label}`;
    case "duo":         return `${spec.top} + ${spec.bottom}`;
    case "centerpiece": return `${spec.title1} ${spec.title2}`.trim();
    case "outreach":    return `${spec.number} ${spec.label}`;
    case "stack":       return `${spec.title1} ${spec.title2}`.trim();
  }
}

function CardRenderer({ spec, bg, project, theme }: RenderProps) {
  switch (spec.kind) {
    case "hero":        return <HeroCard spec={spec} bg={bg} project={project} theme={theme} />;
    case "stat":        return <StatCard spec={spec} bg={bg} project={project} theme={theme} />;
    case "duo":         return <DuoCard spec={spec} bg={bg} project={project} theme={theme} />;
    case "centerpiece": return <CenterpieceCard spec={spec} bg={bg} project={project} theme={theme} />;
    case "outreach":    return <OutreachCard spec={spec} bg={bg} project={project} theme={theme} />;
    case "stack":       return <StackCard spec={spec} bg={bg} project={project} theme={theme} />;
  }
}

/* ──────────────────────── Card frame (shared) ──────────────────────── */

function CardFrame({
  spec, bg, project, theme, children,
}: { spec: CardSpec; bg: Palette; project: MarketingProject; theme: Theme; children: React.ReactNode }) {
  const gid = `${project.id}-${spec.id}-${theme.id}`;
  const tp = theme.svg.textPrimary;
  const ts = theme.svg.textSecondary;
  return (
    <svg viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" className="block h-full w-full">
      <defs>
        <linearGradient id={`bg-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={bg.from} />
          <stop offset="50%"  stopColor={bg.via} />
          <stop offset="100%" stopColor={bg.to} />
        </linearGradient>
        <linearGradient id={`multi-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={bg.from} />
          <stop offset="25%"  stopColor={bg.via} />
          <stop offset="50%"  stopColor={bg.to} />
          <stop offset="75%"  stopColor={bg.via} />
          <stop offset="100%" stopColor={bg.from} />
        </linearGradient>
        <linearGradient id={`neutral-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#e4e4e7" />
          <stop offset="50%"  stopColor="#fafafa" />
          <stop offset="100%" stopColor="#f4f4f5" />
        </linearGradient>
        <radialGradient id={`vignette-${gid}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
        </radialGradient>
        <filter id={`grain-${gid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 0.06 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      <BgLayer theme={theme} bg={bg} gid={gid} />
      {theme.svg.vignetteOpacity > 0 && (
        <rect width="1080" height="1080" fill={`url(#vignette-${gid})`} opacity={theme.svg.vignetteOpacity} />
      )}
      {theme.svg.grainOpacity > 0 && (
        <rect width="1080" height="1080" filter={`url(#grain-${gid})`} opacity={theme.svg.grainOpacity} />
      )}

      {children}

      {/* Footer brand strip — sourced from the project, colored by theme */}
      <g>
        <text x="60" y="1010" fontFamily="Inter, system-ui, -apple-system, sans-serif" fontSize="28" fontWeight="700" fill={tp} opacity="0.95">
          {project.name}
        </text>
        <text x="60" y="1042" fontFamily="Inter, system-ui, sans-serif" fontSize="20" fontWeight="500" fill={ts} opacity="0.75">
          {project.brandFooter}
        </text>
        <text x="1020" y="1042" textAnchor="end" fontFamily="Inter, system-ui, sans-serif" fontSize="20" fontWeight="500" fill={ts} opacity="0.75">
          {project.domain}
        </text>
      </g>
    </svg>
  );
}

/** Theme-aware background layer. */
function BgLayer({ theme, bg, gid }: { theme: Theme; bg: Palette; gid: string }) {
  switch (theme.svg.bgMode) {
    case "gradient":
      return <rect width="1080" height="1080" fill={`url(#bg-${gid})`} />;
    case "solid-light":
      return (
        <>
          <rect width="1080" height="1080" fill="#fafaf9" />
          {/* hairline accent strip */}
          <rect x="0" y="0" width="1080" height="6" fill={bg.from} opacity="0.85" />
        </>
      );
    case "solid-dark":
      return (
        <>
          <rect width="1080" height="1080" fill="#0a0a0a" />
          <circle cx="880" cy="200" r="320" fill={bg.via} opacity="0.18" />
          <circle cx="200" cy="880" r="280" fill={bg.from} opacity="0.12" />
        </>
      );
    case "pastel":
      return (
        <>
          <rect width="1080" height="1080" fill="#fdf8f3" />
          <rect width="1080" height="1080" fill={`url(#bg-${gid})`} opacity="0.22" />
        </>
      );
    case "neutral":
      return (
        <>
          <rect width="1080" height="1080" fill={`url(#neutral-${gid})`} />
          {/* tiny palette accent in corner */}
          <circle cx="980" cy="100" r="36" fill={bg.via} opacity="0.6" />
        </>
      );
    case "multi":
      return <rect width="1080" height="1080" fill={`url(#multi-${gid})`} />;
  }
}

/* ──────────────────────── Renderers ──────────────────────── */

function HeroCard({ spec, bg, project, theme }: RenderProps) {
  if (spec.kind !== "hero") return null;
  const { textPrimary: tp, textSecondary: ts, pillFill, pillFillOpacity, pillStroke, pillStrokeOpacity } = theme.svg;
  return (
    <CardFrame spec={spec} bg={bg} project={project} theme={theme}>
      <text x="60" y="200" fontFamily="Inter, system-ui, sans-serif" fontSize="48" fill={tp} opacity="0.85">{spec.emoji}</text>
      <text x="60" y="380" fontFamily="Inter, system-ui, sans-serif" fontSize="92" fontWeight="700" fill={tp} letterSpacing="-3">
        {spec.title1}
      </text>
      <text x="60" y="490" fontFamily="Inter, system-ui, sans-serif" fontSize="92" fontWeight="700" fill={tp} letterSpacing="-3" opacity="0.85">
        {spec.title2}
      </text>
      <text x="60" y="600" fontFamily="Inter, system-ui, sans-serif" fontSize="44" fontWeight="500" fill={ts} opacity="0.9">
        {spec.subtitle}
      </text>

      <g transform="translate(60, 720)">
        {spec.pills.slice(0, 4).map((p, i) => (
          <g key={p} transform={`translate(${i * 220}, 0)`}>
            <rect width="200" height="64" rx="32" fill={pillFill} fillOpacity={pillFillOpacity} stroke={pillStroke} strokeOpacity={pillStrokeOpacity} />
            <text x="100" y="42" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="22" fontWeight="600" fill={tp}>{p}</text>
          </g>
        ))}
      </g>
    </CardFrame>
  );
}

function StatCard({ spec, bg, project, theme }: RenderProps) {
  if (spec.kind !== "stat") return null;
  const { textPrimary: tp, textSecondary: ts, pillFill, pillFillOpacity, pillStroke, pillStrokeOpacity } = theme.svg;
  return (
    <CardFrame spec={spec} bg={bg} project={project} theme={theme}>
      <text x="60" y="180" fontFamily="Inter, system-ui, sans-serif" fontSize="44" fill={tp} opacity="0.85">{spec.emoji}</text>
      <text x="60" y="320" fontFamily="Inter, system-ui, sans-serif" fontSize="220" fontWeight="800" fill={tp} letterSpacing="-8">{spec.number}</text>
      <text x="60" y="430" fontFamily="Inter, system-ui, sans-serif" fontSize="64" fontWeight="700" fill={tp} opacity="0.95" letterSpacing="-1">
        {spec.label}
      </text>
      <text x="60" y="490" fontFamily="Inter, system-ui, sans-serif" fontSize="32" fontWeight="500" fill={ts} opacity="0.85">
        {spec.sublabel}
      </text>

      <g transform="translate(60, 580)">
        {spec.items.slice(0, 12).map((s, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          return (
            <g key={`${s}-${i}`} transform={`translate(${col * 320}, ${row * 70})`}>
              <rect width="300" height="54" rx="14" fill={pillFill} fillOpacity={pillFillOpacity} stroke={pillStroke} strokeOpacity={pillStrokeOpacity} />
              <circle cx="28" cy="27" r="6" fill={tp} fillOpacity="0.85" />
              <text x="50" y="36" fontFamily="Inter, system-ui, sans-serif" fontSize="22" fontWeight="600" fill={tp}>{s}</text>
            </g>
          );
        })}
      </g>
    </CardFrame>
  );
}

function DuoCard({ spec, bg, project, theme }: RenderProps) {
  if (spec.kind !== "duo") return null;
  const { textPrimary: tp, textSecondary: ts } = theme.svg;
  return (
    <CardFrame spec={spec} bg={bg} project={project} theme={theme}>
      <text x="60" y="180" fontFamily="Inter, system-ui, sans-serif" fontSize="44" fill={tp} opacity="0.9">{spec.emoji}</text>
      <text x="540" y="490" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="280" fontWeight="800" fill={tp} letterSpacing="-12">
        {spec.top}
      </text>
      <text x="540" y="540" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="80" fontWeight="700" fill={tp} opacity="0.9">
        ＋
      </text>
      <text x="540" y="780" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="280" fontWeight="800" fill={tp} letterSpacing="-12">
        {spec.bottom}
      </text>
      <text x="540" y="850" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="32" fontWeight="500" fill={ts} opacity="0.9">
        {spec.caption}
      </text>
    </CardFrame>
  );
}

function CenterpieceCard({ spec, bg, project, theme }: RenderProps) {
  if (spec.kind !== "centerpiece") return null;
  const { textPrimary: tp, textSecondary: ts } = theme.svg;
  return (
    <CardFrame spec={spec} bg={bg} project={project} theme={theme}>
      <text x="540" y="380" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="280" fill={tp}>
        {spec.emoji}
      </text>
      <text x="540" y="540" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="100" fontWeight="800" fill={tp} letterSpacing="-3">
        {spec.title1}
      </text>
      <text x="540" y="620" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="100" fontWeight="800" fill={tp} letterSpacing="-3" opacity="0.85">
        {spec.title2}
      </text>
      <text x="540" y="730" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="36" fontWeight="500" fill={ts} opacity="0.9">
        {spec.caption1}
      </text>
      <text x="540" y="780" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="36" fontWeight="500" fill={ts} opacity="0.9">
        {spec.caption2}
      </text>
    </CardFrame>
  );
}

function OutreachCard({ spec, bg, project, theme }: RenderProps) {
  if (spec.kind !== "outreach") return null;
  const { textPrimary: tp, textSecondary: ts, pillFill, pillFillOpacity, pillStroke, pillStrokeOpacity } = theme.svg;
  return (
    <CardFrame spec={spec} bg={bg} project={project} theme={theme}>
      <text x="60" y="180" fontFamily="Inter, system-ui, sans-serif" fontSize="44" fill={tp} opacity="0.9">{spec.emoji}</text>
      <text x="60" y="380" fontFamily="Inter, system-ui, sans-serif" fontSize="240" fontWeight="800" fill={tp} letterSpacing="-10">{spec.number}</text>
      <text x="60" y="460" fontFamily="Inter, system-ui, sans-serif" fontSize="64" fontWeight="700" fill={tp} letterSpacing="-1">
        {spec.label}
      </text>
      <text x="60" y="530" fontFamily="Inter, system-ui, sans-serif" fontSize="40" fontWeight="500" fill={ts} opacity="0.9">
        {spec.subtitle}
      </text>

      <g transform="translate(60, 620)">
        <rect width="960" height="280" rx="20" fill={pillFill} fillOpacity={pillFillOpacity} stroke={pillStroke} strokeOpacity={pillStrokeOpacity} />
        {spec.rows.slice(0, 3).map((r, i) => (
          <g key={i} transform={`translate(0, ${i * 90})`}>
            <text x="32" y="50" fontFamily="Inter, system-ui, sans-serif" fontSize="22" fontWeight="600" fill={ts} opacity="0.85">{r.day}</text>
            <text x="32" y="92" fontFamily="Inter, system-ui, sans-serif" fontSize="28" fontWeight="500" fill={tp}>{r.text}</text>
          </g>
        ))}
      </g>
    </CardFrame>
  );
}

function StackCard({ spec, bg, project, theme }: RenderProps) {
  if (spec.kind !== "stack") return null;
  const { textPrimary: tp, pillFill, pillFillOpacity, pillStroke, pillStrokeOpacity } = theme.svg;
  return (
    <CardFrame spec={spec} bg={bg} project={project} theme={theme}>
      <text x="60" y="180" fontFamily="Inter, system-ui, sans-serif" fontSize="44" fill={tp} opacity="0.9">{spec.emoji}</text>
      <text x="60" y="320" fontFamily="Inter, system-ui, sans-serif" fontSize="92" fontWeight="800" fill={tp} letterSpacing="-3">
        {spec.title1}
      </text>
      <text x="60" y="420" fontFamily="Inter, system-ui, sans-serif" fontSize="92" fontWeight="800" fill={tp} letterSpacing="-3" opacity="0.85">
        {spec.title2}
      </text>

      <g transform="translate(60, 540)">
        {spec.features.slice(0, 6).map((f, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          return (
            <g key={`${f.label}-${i}`} transform={`translate(${col * 480}, ${row * 130})`}>
              <rect width="460" height="110" rx="20" fill={pillFill} fillOpacity={pillFillOpacity} stroke={pillStroke} strokeOpacity={pillStrokeOpacity} />
              <text x="34" y="72" fontFamily="Inter, system-ui, sans-serif" fontSize="48" fill={tp}>{f.emoji}</text>
              <text x="120" y="68" fontFamily="Inter, system-ui, sans-serif" fontSize="34" fontWeight="700" fill={tp}>{f.label}</text>
            </g>
          );
        })}
      </g>
    </CardFrame>
  );
}
