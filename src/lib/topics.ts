// Topic = a saved view of the queue filtered to a set of source names.
// Each topic gets its own sidebar entry and URL: /topic/<slug>
//
// To add a new topic: append an entry here. The sidebar and route pick it up
// automatically.

export interface Topic {
  slug: string;
  label: string;
  description: string;
  /** Source names that should appear in this topic. */
  sources: string[];
  /** Tailwind text-color class for the active sidebar icon. */
  accent: string;
  /** Inline SVG path data for a 24×24 stroke icon. */
  iconPath: string;
}

export const TOPICS: Topic[] = [
  {
    slug: "claude",
    label: "Claude",
    description: "Anthropic + Claude updates only.",
    sources: ["Claude / Anthropic", "Simon Willison", "AI News (smol)"],
    accent: "text-amber-400",
    // Stylized "C"
    iconPath: "M16.5 7.5a6 6 0 1 0 0 9",
  },
  {
    slug: "openai",
    label: "ChatGPT",
    description: "OpenAI announcements — GPT, Sora, ChatGPT, API changes.",
    sources: ["OpenAI Blog", "Simon Willison", "AI News (smol)", "AI API Updates"],
    accent: "text-emerald-400",
    // Open spiral / "G" hint
    iconPath: "M12 4a8 8 0 1 1-8 8h4a4 4 0 1 0 4-4Z",
  },
  {
    slug: "google",
    label: "Google AI",
    description: "Gemini, Veo, Google AI products + API updates.",
    sources: ["Google AI Blog", "Veo / Google AI Models", "Simon Willison", "AI News (smol)", "AI API Updates"],
    accent: "text-sky-400",
    // 4-petal star (Gemini-ish)
    iconPath: "M12 2v6M12 16v6M2 12h6M16 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M5.6 18.4l4.2-4.2M14.2 9.8l4.2-4.2",
  },
  {
    slug: "grok",
    label: "Grok",
    description: "xAI / Grok updates and product launches.",
    sources: ["Grok / xAI", "AI News (smol)"],
    accent: "text-neutral-200",
    // Bold X
    iconPath: "M5 5l14 14M19 5L5 19",
  },
  {
    slug: "tools",
    label: "New tools",
    description: "AI tool launches — Show HN, Product Hunt, indie products.",
    sources: ["Show HN AI Launches", "Product Hunt AI"],
    accent: "text-fuchsia-400",
    // Spark/burst
    iconPath: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
  },
];

export const topicBySlug = (slug: string) => TOPICS.find((t) => t.slug === slug);
