// Canonical RSS source list. Edit here, then run `npm run sync-sources`
// to apply changes to the Supabase DB. Idempotent — safe to run any time.

export interface SourceDef {
  name: string;
  url: string;
  kind: "rss";
}

export const SOURCES: SourceDef[] = [
  // ── Vendor-direct ──
  { name: "OpenAI Blog",         url: "https://openai.com/blog/rss.xml", kind: "rss" },
  { name: "Google AI Blog",      url: "https://blog.google/technology/ai/rss/", kind: "rss" },
  { name: "Hugging Face Blog",   url: "https://huggingface.co/blog/feed.xml", kind: "rss" },

  // ── Commentary & deep analysis ──
  { name: "Simon Willison",      url: "https://simonwillison.net/atom/everything/", kind: "rss" },
  { name: "Latent Space",        url: "https://www.latent.space/feed", kind: "rss" },
  { name: "AI News (smol)",      url: "https://buttondown.email/ainews/rss", kind: "rss" },

  // ── New tool launches ──
  { name: "Show HN AI Launches", url: "https://hnrss.org/show?q=AI+OR+LLM+OR+%22AI+tool%22+OR+%22AI+agent%22&points=20", kind: "rss" },
  { name: "Product Hunt AI",     url: "https://www.producthunt.com/feed?category=artificial-intelligence", kind: "rss" },

  // ── Vendor research labs ──
  { name: "Google DeepMind",     url: "https://deepmind.google/blog/rss.xml", kind: "rss" },
  { name: "Meta AI Research",    url: "https://research.facebook.com/feed.xml", kind: "rss" },
  { name: "AWS Machine Learning",url: "https://aws.amazon.com/blogs/machine-learning/feed/", kind: "rss" },

  // ── Mainstream press ──
  { name: "TechCrunch AI",       url: "https://techcrunch.com/category/artificial-intelligence/feed/", kind: "rss" },
  { name: "The Verge AI",        url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", kind: "rss" },
  { name: "VentureBeat AI",      url: "https://venturebeat.com/category/ai/feed/", kind: "rss" },
  { name: "AI Business",         url: "https://www.aibusiness.com/rss.xml", kind: "rss" },
  { name: "MIT Tech Review AI",  url: "https://www.technologyreview.com/topic/artificial-intelligence/feed", kind: "rss" },
  { name: "MarkTechPost",        url: "https://www.marktechpost.com/feed/", kind: "rss" },
  { name: "The Rundown AI",
    url: "https://news.google.com/rss/search?q=%22The+Rundown+AI%22+OR+%22therundown.ai%22&hl=en-US&gl=US&ceid=US:en",
    kind: "rss" },

  // ── Vendor coverage via Google News (for vendors without official RSS) ──
  { name: "Claude / Anthropic",
    url: "https://news.google.com/rss/search?q=Anthropic+Claude+OR+%22Claude+API%22&hl=en-US&gl=US&ceid=US:en",
    kind: "rss" },
  { name: "Grok / xAI",
    url: "https://news.google.com/rss/search?q=Grok+xAI&hl=en-US&gl=US&ceid=US:en",
    kind: "rss" },
  { name: "Veo / Google AI Models",
    url: "https://news.google.com/rss/search?q=%22Veo+3%22+OR+%22Google+Gemini+API%22&hl=en-US&gl=US&ceid=US:en",
    kind: "rss" },
  { name: "AI API Updates",
    url: "https://news.google.com/rss/search?q=%22API+update%22+AI+OpenAI+OR+Anthropic+OR+Google&hl=en-US&gl=US&ceid=US:en",
    kind: "rss" },

  // ── Topic-specific via Google News ──
  { name: "AI Agents News",
    url: "https://news.google.com/rss/search?q=%22AI+agent%22+OR+%22autonomous+agent%22+OR+agentic+AI&hl=en-US&gl=US&ceid=US:en",
    kind: "rss" },
  { name: "AI Music News",
    url: "https://news.google.com/rss/search?q=Suno+OR+Udio+OR+%22AI+music+generation%22&hl=en-US&gl=US&ceid=US:en",
    kind: "rss" },
  { name: "AI Video News",
    url: "https://news.google.com/rss/search?q=Sora+OR+%22Runway+ML%22+OR+%22Pika+Labs%22+OR+%22AI+video+generation%22&hl=en-US&gl=US&ceid=US:en",
    kind: "rss" },
];

export const SOURCE_NAMES = new Set(SOURCES.map((s) => s.name));
