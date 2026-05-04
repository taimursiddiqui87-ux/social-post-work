// Pre-written marketing posts for THS Post itself.
// Edit here to add/refine. Each entry shows up on the /marketing page.

export type MarketingPlatform = "linkedin" | "twitter" | "facebook" | "instagram";

export interface MarketingPost {
  platform: MarketingPlatform;
  variant: string;        // short label shown above each post (e.g. "Founder story")
  body: string;
  hashtags?: string;      // shown subtly under body
}

export const MARKETING_POSTS: MarketingPost[] = [
  /* ─────────────────────── LinkedIn ─────────────────────── */
  {
    platform: "linkedin",
    variant: "Founder story",
    body: `I was spending 3 hours a day reading AI news to write 1 post.

Now it takes 5 minutes.

Built THS Post — an AI-powered tool that does the heavy lifting:

→ Pulls AI news from 25+ vendor + indie sources (OpenAI, Claude, DeepMind, HuggingFace, Show HN, and more)
→ Drafts platform-tuned posts for LinkedIn, X, Facebook, Instagram
→ Detects trending stories across multiple feeds before they're everywhere
→ Generates LinkedIn outreach in your voice (single + bulk CSV)
→ Supports English + Urdu drafting
→ Tracks engagement to learn what works for you

The unlock: I'm not writing posts anymore. I'm reviewing them.

Same output. 1/30th the time.

What's the most painful part of your content workflow?`,
  },
  {
    platform: "linkedin",
    variant: "Problem-solution",
    body: `Every AI builder I know struggles with the same thing:

Keeping up with AI news is a full-time job.

OpenAI ships. Anthropic ships. Google ships. New tools launch daily. Meanwhile you have customers, products, and a life.

I built THS Post to solve this for myself. It:

— Watches 25+ curated AI sources continuously
— Drafts your social posts automatically across 4 platforms
— Learns your brand voice from past posts you've written
— Surfaces trending stories before everyone else writes about them
— Includes a LinkedIn outreach generator with bulk CSV processing

If you post about AI, you should not be writing those posts from scratch.

Curious what other content workflows AI is collapsing for you.`,
  },
  {
    platform: "linkedin",
    variant: "Specific feature",
    body: `Most LinkedIn outreach tools just blast templates.

I built mine differently in THS Post:

— Paste a CSV of 50 prospects (name, role, company, optional context)
— AI writes a unique 3-message sequence for each (connection + 2 follow-ups)
— Each message references the prospect's actual context — not generic compliments
— Trained on YOUR voice, not stock templates
— Export the result → upload to Salesrobot or any LinkedIn sender → done

50 personalized sequences in 5 minutes.

Personalization at scale was always a contradiction. AI fixed it.`,
  },

  /* ─────────────────────── X / Twitter ─────────────────────── */
  {
    platform: "twitter",
    variant: "Punchy one-liner",
    body: `spent 3hrs/day reading AI news.

built an app to do it for me.

now spend 5min reviewing what it drafts.

THS Post.`,
  },
  {
    platform: "twitter",
    variant: "Feature stack",
    body: `the AI app I built to survive the AI news cycle:

— 25 sources (vendor + indie)
— auto-drafts 4 platforms
— urdu + english
— trending detection
— outreach generator
— engagement tracking

THS Post.`,
  },
  {
    platform: "twitter",
    variant: "Outreach hook",
    body: `wrote 50 unique LinkedIn outreach sequences in 5 minutes.

each one referenced the prospect's actual context.

zero templates.

THS Post does this. paste a CSV, download the messages, send.`,
  },

  /* ─────────────────────── Facebook ─────────────────────── */
  {
    platform: "facebook",
    variant: "Conversational",
    body: `Built something that's been changing how I work this month.

It's called THS Post — an AI-powered content engine that watches 25+ AI news sources and drafts platform-specific posts for me automatically.

Saves me 3 hours a day, easily.

Anyone else struggling with AI content overwhelm? Let me know what you'd want in a tool like this — I'm still adding features based on real feedback.`,
  },
  {
    platform: "facebook",
    variant: "Launch announce",
    body: `Just shipped THS Post — my new AI-powered social media tool.

It pulls news from 25+ AI sources, drafts posts in 4 platforms (LinkedIn, X, Facebook, Instagram), supports English + Urdu, has trending detection, a LinkedIn outreach generator, and engagement tracking.

If you create AI content, this saves hours every week. Open to feedback from anyone who wants to try it 👇`,
  },
  {
    platform: "facebook",
    variant: "Pakistan-focused",
    body: `Pakistan ka AI content creators ke liye chhoti si khabar:

Maine THS Post bana liya hai — ek tool jo AI news 25+ sources se laata hai aur aap ke liye LinkedIn / X / Facebook / Instagram posts draft karta hai automatically. Urdu mein bhi.

Saves real hours every day. Especially agar aap AI ke baare mein roz post karte hain.

Pakistan-based founders ke liye built. International karne walay bhi welcome.`,
  },

  /* ─────────────────────── Instagram ─────────────────────── */
  {
    platform: "instagram",
    variant: "Save-worthy carousel hook",
    body: `I built THS Post — the AI tool that watches the AI industry for me.

→ 25+ AI news sources, fetched automatically
→ Drafts in your brand voice (English + Urdu)
→ Spots trending stories before they break
→ LinkedIn outreach generator
→ Engagement tracker
→ Everything in one app

5 minutes a day instead of 3 hours.

Save this if you post about AI.
Tag a builder who needs this.`,
    hashtags: "#AI #BuildInPublic #Productivity #LinkedInTips #ContentCreator #AIAgents #LLM #SoloDev #Pakistan #StartupLife #AITools #ContentMarketing",
  },
  {
    platform: "instagram",
    variant: "Direct CTA",
    body: `Stop reading AI news.

Let AI read it for you.

Built THS Post:

→ Auto-drafts your posts across 4 platforms
→ Trained on your voice
→ Trending alerts
→ Bulk LinkedIn outreach
→ EN + UR

Link in bio.`,
    hashtags: "#AITools #Productivity #LinkedIn #ContentMarketing #AIContent #BuilderJourney #StartupTools #SoloFounder #IndieDev",
  },
  {
    platform: "instagram",
    variant: "Question hook",
    body: `Spending too much time keeping up with AI news?

Same.

So I built an app that reads it for me and drafts the posts.

THS Post. AI news → social drafts → done.

Saves 3 hours daily.

Save this for later 📌`,
    hashtags: "#AI #Productivity #ContentCreator #SocialMediaTips #LinkedIn #AIAutomation #BuildInPublic #SaaS",
  },
];
