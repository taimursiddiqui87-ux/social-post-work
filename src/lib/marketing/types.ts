// Shared types for the multi-project marketing system.

export type MarketingPlatform = "linkedin" | "twitter" | "facebook" | "instagram";

export interface MarketingPost {
  platform: MarketingPlatform;
  variant: string;        // category label shown above each post
  bodies: string[];       // weekly-rotated variants
  hashtags?: string;
}

export type Palette = { from: string; via: string; to: string };

/** A card spec is rendered by MarketingCards.tsx. Each `kind` maps to a layout. */
export type CardSpec =
  | {
      kind: "hero";
      id: string;
      emoji: string;
      title1: string;       // first big headline line
      title2: string;       // second big headline line
      subtitle: string;     // smaller line under headline
      pills: string[];      // up to 4 pill labels at bottom
      palettes: Palette[];
    }
  | {
      kind: "stat";
      id: string;
      emoji: string;
      number: string;       // e.g. "25+"
      label: string;        // e.g. "AI sources"
      sublabel: string;     // small line under label
      items: string[];      // up to 12 chips shown in a 3-col grid
      palettes: Palette[];
    }
  | {
      kind: "duo";
      id: string;
      emoji: string;
      top: string;          // big stacked word, e.g. "EN"
      bottom: string;       // big stacked word, e.g. "UR"
      caption: string;      // single caption line
      palettes: Palette[];
    }
  | {
      kind: "centerpiece";
      id: string;
      emoji: string;        // huge emoji centered
      title1: string;
      title2: string;
      caption1: string;
      caption2: string;
      palettes: Palette[];
    }
  | {
      kind: "outreach";
      id: string;
      emoji: string;
      number: string;       // e.g. "50"
      label: string;        // e.g. "LinkedIn DMs"
      subtitle: string;
      rows: { day: string; text: string }[]; // up to 3 day/text rows
      palettes: Palette[];
    }
  | {
      kind: "stack";
      id: string;
      emoji: string;
      title1: string;
      title2: string;
      features: { emoji: string; label: string }[]; // up to 6 features
      palettes: Palette[];
    };

export interface MarketingProject {
  id: string;            // slug, used in URL: /marketing/<id>
  name: string;          // brand name shown everywhere
  tagline: string;       // hero subtitle on per-project page
  domain: string;        // displayed bottom-right of every card
  brandFooter: string;   // small line below brand name on cards
  accent: string;        // tailwind text color class for sidebar icon
  pickerEmoji: string;   // emoji shown on /marketing picker tile
  pickerSummary: string; // 1-line summary on the picker page
  pickerGradient: string; // tailwind gradient classes for picker tile
  posts: MarketingPost[];
  cards: CardSpec[];
}
