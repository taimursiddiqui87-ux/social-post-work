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
    accent: "text-amber-600",
    // Stylized "C"
    iconPath: "M16.5 7.5a6 6 0 1 0 0 9",
  },
  {
    slug: "openai",
    label: "ChatGPT",
    description: "OpenAI announcements — GPT, Sora, ChatGPT, API changes.",
    sources: ["OpenAI Blog", "Simon Willison", "AI News (smol)", "AI API Updates"],
    accent: "text-emerald-600",
    // Open spiral / "G" hint
    iconPath: "M12 4a8 8 0 1 1-8 8h4a4 4 0 1 0 4-4Z",
  },
  {
    slug: "google",
    label: "Google AI",
    description: "Gemini, Veo, Google AI products + API updates.",
    sources: ["Google AI Blog", "Veo / Google AI Models", "Simon Willison", "AI News (smol)", "AI API Updates"],
    accent: "text-sky-600",
    // 4-petal star (Gemini-ish)
    iconPath: "M12 2v6M12 16v6M2 12h6M16 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M5.6 18.4l4.2-4.2M14.2 9.8l4.2-4.2",
  },
  {
    slug: "grok",
    label: "Grok",
    description: "xAI / Grok updates and product launches.",
    sources: ["Grok / xAI", "AI News (smol)"],
    accent: "text-zinc-900",
    // Bold X
    iconPath: "M5 5l14 14M19 5L5 19",
  },
  {
    slug: "tools",
    label: "New tools",
    description: "AI tool launches — Show HN, Product Hunt, indie products.",
    sources: ["Show HN AI Launches", "Product Hunt AI"],
    accent: "text-fuchsia-500",
    // Spark/burst
    iconPath: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
  },
  {
    slug: "agents",
    label: "AI agents",
    description: "Autonomous agents, agentic frameworks, agent launches.",
    sources: ["AI Agents News", "Show HN AI Launches", "AI News (smol)"],
    accent: "text-violet-500",
    // Bot/face
    iconPath: "M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4Z M9 13h.01 M15 13h.01",
  },
  {
    slug: "music",
    label: "AI music",
    description: "Suno, Udio, music generation models and updates.",
    sources: ["AI Music News", "AI News (smol)"],
    accent: "text-rose-500",
    // Music note
    iconPath: "M9 18V5l12-2v13 M9 18a3 3 0 1 1-3-3 M21 16a3 3 0 1 1-3-3",
  },
  {
    slug: "video",
    label: "AI video",
    description: "Sora, Veo, Runway, Pika — AI video generation news.",
    sources: ["AI Video News", "Veo / Google AI Models", "AI News (smol)"],
    accent: "text-orange-500",
    // Play in frame
    iconPath: "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z M10 9l5 3-5 3V9Z",
  },
];

export const topicBySlug = (slug: string) => TOPICS.find((t) => t.slug === slug);
