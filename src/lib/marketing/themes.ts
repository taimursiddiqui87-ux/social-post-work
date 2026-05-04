// Visual themes that rotate alongside content variants (every 2 days at 00:00 PKT).
// Each theme defines styling for BOTH the SVG image cards and the caption text cards,
// so a rotation refreshes the design surface, not just the words.

import { cycleIndex } from "./helpers";

export type ThemeId =
  | "minimal"
  | "pastel"
  | "bold"
  | "dark"
  | "gradient"
  | "neutral";

export interface SvgTheme {
  /** How to render the 1080×1080 background:
   *  - gradient    : project palette as a 3-stop linear gradient (vivid)
   *  - solid-light : flat off-white card with subtle accent
   *  - solid-dark  : near-black with palette colors as soft glows
   *  - pastel      : white base + palette gradient at low opacity
   *  - neutral     : zinc/stone gradient (palette ignored)
   *  - multi       : 5-stop multi-hue gradient (more colorful than gradient)
   */
  bgMode: "gradient" | "solid-light" | "solid-dark" | "pastel" | "neutral" | "multi";
  /** Hex for primary headlines / numbers */
  textPrimary: string;
  /** Hex for subtitle / footer text */
  textSecondary: string;
  /** Pill / chip styling */
  pillFill: string;
  pillFillOpacity: number;
  pillStroke: string;
  pillStrokeOpacity: number;
  /** Decorative effects — set to 0 to disable for flat themes */
  vignetteOpacity: number;
  grainOpacity: number;
}

export interface CaptionTheme {
  /** Tailwind classes for the <li> wrapper */
  li: string;
  /** Header bar */
  header: string;
  /** Body <p> */
  body: string;
  /** Hashtag <p> */
  hashtag: string;
  /** Char count + variant counter */
  chars: string;
  /** Variant label (e.g. "Founder story") */
  variant: string;
  /** Theme pill background color (used in the navigator) */
  pillBg: string;
  /** Theme pill text color */
  pillText: string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  emoji: string;
  svg: SvgTheme;
  caption: CaptionTheme;
}

export const THEMES: Theme[] = [
  /* ─────────────────────── 1. Minimal ─────────────────────── */
  {
    id: "minimal",
    name: "Minimal",
    emoji: "○",
    svg: {
      bgMode: "solid-light",
      textPrimary: "#0f172a",
      textSecondary: "#52525b",
      pillFill: "#0f172a",
      pillFillOpacity: 0.05,
      pillStroke: "#0f172a",
      pillStrokeOpacity: 0.18,
      vignetteOpacity: 0,
      grainOpacity: 0,
    },
    caption: {
      li: "lift overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-sm hover:shadow",
      header: "flex items-center justify-between border-b border-black/[0.05] bg-white px-5 py-3",
      body: "whitespace-pre-wrap text-[14px] leading-[1.7] text-zinc-800",
      hashtag: "mt-3 text-[12.5px] leading-relaxed text-zinc-500",
      chars: "text-[11.5px] tabular-nums text-zinc-400",
      variant: "text-[12px] font-medium text-zinc-700",
      pillBg: "bg-zinc-100",
      pillText: "text-zinc-700",
    },
  },

  /* ─────────────────────── 2. Pastel ─────────────────────── */
  {
    id: "pastel",
    name: "Pastel",
    emoji: "🌸",
    svg: {
      bgMode: "pastel",
      textPrimary: "#1e1b4b",
      textSecondary: "#3730a3",
      pillFill: "#1e1b4b",
      pillFillOpacity: 0.07,
      pillStroke: "#1e1b4b",
      pillStrokeOpacity: 0.18,
      vignetteOpacity: 0,
      grainOpacity: 0,
    },
    caption: {
      li: "lift overflow-hidden rounded-2xl border border-pink-200/60 bg-gradient-to-br from-pink-50/80 via-white to-sky-50/60 shadow-sm hover:shadow",
      header: "flex items-center justify-between border-b border-pink-200/40 bg-white/40 px-5 py-3",
      body: "whitespace-pre-wrap text-[14px] leading-[1.7] text-indigo-950/90",
      hashtag: "mt-3 text-[12.5px] leading-relaxed text-indigo-700/70",
      chars: "text-[11.5px] tabular-nums text-indigo-700/60",
      variant: "text-[12px] font-medium text-indigo-800",
      pillBg: "bg-pink-100",
      pillText: "text-pink-800",
    },
  },

  /* ─────────────────────── 3. Bold ─────────────────────── */
  {
    id: "bold",
    name: "Bold",
    emoji: "🔥",
    svg: {
      bgMode: "gradient",
      textPrimary: "#ffffff",
      textSecondary: "#ffffff",
      pillFill: "#ffffff",
      pillFillOpacity: 0.18,
      pillStroke: "#ffffff",
      pillStrokeOpacity: 0.35,
      vignetteOpacity: 0.35,
      grainOpacity: 0.5,
    },
    caption: {
      li: "lift overflow-hidden rounded-2xl border border-fuchsia-300/40 bg-gradient-to-br from-fuchsia-600 via-pink-500 to-orange-400 text-white shadow-md hover:shadow-lg",
      header: "flex items-center justify-between border-b border-white/20 bg-white/10 px-5 py-3",
      body: "whitespace-pre-wrap text-[14px] leading-[1.7] text-white",
      hashtag: "mt-3 text-[12.5px] leading-relaxed text-white/85",
      chars: "text-[11.5px] tabular-nums text-white/70",
      variant: "text-[12px] font-medium text-white/95",
      pillBg: "bg-fuchsia-500",
      pillText: "text-white",
    },
  },

  /* ─────────────────────── 4. Dark mode ─────────────────────── */
  {
    id: "dark",
    name: "Dark mode",
    emoji: "🌙",
    svg: {
      bgMode: "solid-dark",
      textPrimary: "#f4f4f5",
      textSecondary: "#a1a1aa",
      pillFill: "#ffffff",
      pillFillOpacity: 0.08,
      pillStroke: "#ffffff",
      pillStrokeOpacity: 0.18,
      vignetteOpacity: 0.45,
      grainOpacity: 0.4,
    },
    caption: {
      li: "lift overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-100 shadow-md hover:shadow-lg",
      header: "flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-5 py-3",
      body: "whitespace-pre-wrap text-[14px] leading-[1.7] text-zinc-100",
      hashtag: "mt-3 text-[12.5px] leading-relaxed text-zinc-400",
      chars: "text-[11.5px] tabular-nums text-zinc-500",
      variant: "text-[12px] font-medium text-zinc-200",
      pillBg: "bg-zinc-800",
      pillText: "text-zinc-100",
    },
  },

  /* ─────────────────────── 5. Gradient ─────────────────────── */
  {
    id: "gradient",
    name: "Gradient",
    emoji: "🌈",
    svg: {
      bgMode: "multi",
      textPrimary: "#ffffff",
      textSecondary: "#ffffff",
      pillFill: "#ffffff",
      pillFillOpacity: 0.2,
      pillStroke: "#ffffff",
      pillStrokeOpacity: 0.4,
      vignetteOpacity: 0.3,
      grainOpacity: 0.5,
    },
    caption: {
      li: "lift overflow-hidden rounded-2xl border border-white/40 bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-amber-400 text-white shadow-md hover:shadow-lg",
      header: "flex items-center justify-between border-b border-white/20 bg-white/10 px-5 py-3",
      body: "whitespace-pre-wrap text-[14px] leading-[1.7] text-white",
      hashtag: "mt-3 text-[12.5px] leading-relaxed text-white/85",
      chars: "text-[11.5px] tabular-nums text-white/70",
      variant: "text-[12px] font-medium text-white/95",
      pillBg: "bg-indigo-500",
      pillText: "text-white",
    },
  },

  /* ─────────────────────── 6. Neutral ─────────────────────── */
  {
    id: "neutral",
    name: "Neutral",
    emoji: "⚪",
    svg: {
      bgMode: "neutral",
      textPrimary: "#27272a",
      textSecondary: "#52525b",
      pillFill: "#27272a",
      pillFillOpacity: 0.06,
      pillStroke: "#27272a",
      pillStrokeOpacity: 0.18,
      vignetteOpacity: 0.1,
      grainOpacity: 0.2,
    },
    caption: {
      li: "lift overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm hover:shadow",
      header: "flex items-center justify-between border-b border-zinc-200 bg-white/60 px-5 py-3",
      body: "whitespace-pre-wrap text-[14px] leading-[1.7] text-zinc-800",
      hashtag: "mt-3 text-[12.5px] leading-relaxed text-zinc-500",
      chars: "text-[11.5px] tabular-nums text-zinc-500",
      variant: "text-[12px] font-medium text-zinc-700",
      pillBg: "bg-zinc-200",
      pillText: "text-zinc-700",
    },
  },
];

/** Picks the active theme for the given cycle offset.
 *  Theme cycles every 6 rotations (= 12 days) regardless of content variant count. */
export function themeForCycle(offset = 0): Theme {
  const i = cycleIndex(offset);
  const n = THEMES.length;
  return THEMES[((i % n) + n) % n];
}
