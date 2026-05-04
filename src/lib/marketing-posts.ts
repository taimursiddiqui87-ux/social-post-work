// Pre-written marketing posts for THS Post itself.
// Each post has multiple body variants; one is auto-selected per week so the
// content rotates without any cron or LLM cost.
//
// Add more variants any time — UI picks based on the current ISO-ish week.

export type MarketingPlatform = "linkedin" | "twitter" | "facebook" | "instagram";

export interface MarketingPost {
  platform: MarketingPlatform;
  variant: string;        // category label shown above each post
  bodies: string[];       // weekly-rotated variants
  hashtags?: string;
}

/** Returns a stable integer that increments every 7 days from the Unix epoch.
 *  Used to deterministically rotate content week-over-week. */
export function weekIndex(offset = 0): number {
  return Math.floor(Date.now() / (7 * 86_400_000)) + offset;
}

/** Picks one item from `arr` based on the current week (+ optional offset).
 *  Each week shows the next item in the array; cycles when exhausted. */
export function pickByWeek<T>(arr: T[], offset = 0): T {
  return arr[weekIndex(offset) % arr.length];
}

/** Human-friendly label for a week offset relative to today. */
export function weekLabel(offset: number): string {
  if (offset === 0) return "This week";
  if (offset === 1) return "Next week";
  if (offset === -1) return "Last week";
  if (offset > 1) return `In ${offset} weeks`;
  return `${Math.abs(offset)} weeks ago`;
}

/** Returns a "May 4 – 10" style date range for the given offset week. */
export function weekDateRange(offset = 0): string {
  const wkIdx = weekIndex(offset);
  const startMs = wkIdx * 7 * 86_400_000;
  const start = new Date(startMs);
  const end = new Date(startMs + 6 * 86_400_000);
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

export const MARKETING_POSTS: MarketingPost[] = [
  /* ─────────────────────── LinkedIn ─────────────────────── */
  {
    platform: "linkedin",
    variant: "Founder story",
    bodies: [
      `I was spending 3 hours a day reading AI news to write 1 post.

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

      `For years I treated content as something I'd "do tomorrow."

Tomorrow never came.

Then I realized the bottleneck wasn't motivation — it was friction. Every post required:
1. Skimming 8 newsletters
2. Picking a story
3. Writing 4 different versions for 4 platforms
4. Fixing tone for each
5. Adding hashtags

That's 2-3 hours, every time.

I built THS Post to eliminate the first 4 steps. AI watches the news, drafts the variants in my voice, surfaces trending stories. I just review and post.

Going from "I should post more" to "I posted today" was the single biggest professional unlock of this year.

If content is on your todo list and never gets done — fix the friction first.`,

      `An honest look at what AI actually changed for me this year:

Not coding (I still code).
Not strategy (I still think).
Not customer calls (those still matter).

But content? Completely transformed.

I built THS Post — a personal content engine that:
- Watches 25+ AI news sources daily
- Drafts every post in my brand voice across 4 platforms
- Spots trending stories early
- Generates LinkedIn outreach at scale
- Tracks what's working

The shift isn't "AI helps me write." It's "AI does 95% of the work; I curate the 5% that matters."

If you publish in any niche, this category is going to feel obvious in 6 months. Build now while it's still leverage.`,

      `THS Post update: 60 days in, here's what I've actually shipped using it.

→ 47 LinkedIn posts (would've been 8 without it)
→ 89 X posts
→ 31 Instagram captions
→ 200+ personalized LinkedIn outreach messages
→ 12 hours/week back

The thing nobody tells you about content tools: most save you 20%. THS Post saves me 90% because it's purpose-built for one workflow — AI news → polished platform-specific drafts.

Curious what the equivalent unlock is in your industry. Drop your hardest content task and I'll tell you whether AI can take it over yet.`,
    ],
  },

  {
    platform: "linkedin",
    variant: "Problem-solution",
    bodies: [
      `Every AI builder I know struggles with the same thing:

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

      `The cost of "I'll stay current with AI" is higher than people admit.

Every newsletter you subscribe to. Every podcast you bookmark. Every Twitter thread you save for later. Every "I'll read this tonight" that becomes "I'll read this tomorrow."

For most of us it adds up to 5-10 hours a week of attention spent and content never produced.

THS Post collapses all of it:
- One queue of curated AI news from 25+ sources
- Drafts written for you in your voice
- Click, copy, post

The right tool changes the math from "I should keep up" to "I'm always caught up."`,

      `Three years of building in AI taught me one uncomfortable truth:

Distribution beats quality.

You can ship the smartest model, the cleanest UX, the best technical writeup — and someone with half the substance and twice the posting cadence will own the conversation.

So I built distribution into my workflow.

THS Post is what came out: an AI-powered system that watches the AI industry and drafts posts for me across LinkedIn, X, Facebook, and Instagram. Fed with my voice, my niche, my hooks.

The post I would've spent an hour writing now takes 90 seconds to review and ship.

If you're a builder who's better at building than at posting — you're not alone. Fix the distribution layer.`,

      `Most "AI for content" tools fail because they're built backward.

They generate generic copy from a topic.

The real bottleneck isn't writing — it's discovery + tone-matching + multi-platform formatting.

THS Post inverts the workflow:
1. Continuously watches 25 AI news sources
2. Surfaces what's worth posting about
3. Drafts in YOUR voice (uses past posts as few-shot examples)
4. Adapts to each platform's style automatically

By the time you open it, the work is 90% done. You curate, lightly edit, ship.

Built it for myself. Letting others use it now.`,
    ],
  },

  {
    platform: "linkedin",
    variant: "Specific feature",
    bodies: [
      `Most LinkedIn outreach tools just blast templates.

I built mine differently in THS Post:

— Paste a CSV of 50 prospects (name, role, company, optional context)
— AI writes a unique 3-message sequence for each (connection + 2 follow-ups)
— Each message references the prospect's actual context — not generic compliments
— Trained on YOUR voice, not stock templates
— Export the result → upload to Salesrobot or any LinkedIn sender → done

50 personalized sequences in 5 minutes.

Personalization at scale was always a contradiction. AI fixed it.`,

      `Quick deep-dive on one feature in THS Post: the trending detector.

Problem: by the time a story hits TechCrunch, it's been on Show HN, Reddit, and 4 niche newsletters for 12-24 hours. Posting then = late.

Solution: THS Post groups every fetched article by a fuzzy title cluster. When 3+ different sources independently cover the same story within 24 hours, it bubbles to the top of the queue with a 🔥 badge.

You see what's about to be everywhere — before everyone else writes about it.

Most "trending" features just sort by recency. This one sorts by emergent consensus. Subtle distinction, big difference in post performance.`,

      `Built brand voice tuning into THS Post and it changed everything.

The flow:
1. Paste 3-5 of your best past LinkedIn posts into Settings
2. THS Post analyzes the rhythm, vocabulary, sentence shapes
3. Every new draft is generated in that voice

The before-and-after is wild. Generic AI text becomes something that genuinely sounds like me — because it's modeled on what I've written before.

If your AI content sounds robotic, the issue isn't the model. It's the lack of voice training. Five examples is enough to fix it.`,

      `Engagement tracking in THS Post is the feature I underestimated most.

Initially I thought: "I'll just remember what worked."

I did not.

So I added a simple inline form on the Posted page — log views/likes/comments/shares per post manually after a few days. THS Post computes a score, surfaces the top 3 performers, and you start to see real patterns.

Two months in, I now know:
- Stories with a specific dollar amount in the first line outperform 3x
- Question hooks beat statement hooks for me
- 7am posts beat 7pm posts in my niche

I would not have figured any of this out without the data.

Boring feature. Highest-leverage one in the app.`,
    ],
  },

  /* ─────────────────────── X / Twitter ─────────────────────── */
  {
    platform: "twitter",
    variant: "Punchy one-liner",
    bodies: [
      `spent 3hrs/day reading AI news.

built an app to do it for me.

now spend 5min reviewing what it drafts.

THS Post.`,

      `the AI news cycle was eating my week.

now an AI watches it for me, drafts the posts, and I just curate.

THS Post.`,

      `i don't write social posts anymore.

i review them.

THS Post writes them — in my voice, across 4 platforms, from AI news i'd otherwise miss.`,

      `built a tool that reads 25 AI sources a day and writes my posts.

it has more interesting things to say than i do.

THS Post.`,
    ],
  },

  {
    platform: "twitter",
    variant: "Feature stack",
    bodies: [
      `the AI app I built to survive the AI news cycle:

— 25 sources (vendor + indie)
— auto-drafts 4 platforms
— urdu + english
— trending detection
— outreach generator
— engagement tracking

THS Post.`,

      `THS Post — what's inside:

→ 25+ AI sources fetched continuously
→ drafts for LinkedIn / X / FB / IG
→ trending detection across feeds
→ bilingual EN+UR
→ ask AI about anything
→ bulk LinkedIn outreach
→ engagement tracker

one app, my whole content workflow.`,

      `every feature in THS Post earned its keep:

queue (drafts ready to copy)
ask AI (search + chat over your news)
outreach (50 personalized DMs in 5min)
brand voice (trained on your past posts)
trending (3+ sources = 🔥)
posted log (track what works)`,

      `things THS Post does so I don't have to:

watch 25 news sources daily
draft in my voice for 4 platforms
detect trending stories
generate LinkedIn DMs
translate to urdu
track engagement

I do: pick the good ones, post.`,
    ],
  },

  {
    platform: "twitter",
    variant: "Outreach hook",
    bodies: [
      `wrote 50 unique LinkedIn outreach sequences in 5 minutes.

each one referenced the prospect's actual context.

zero templates.

THS Post does this. paste a CSV, download the messages, send.`,

      `personalized LinkedIn outreach at scale was a contradiction.

then AI happened.

THS Post: paste 50 prospects → get 50 unique 3-message sequences → upload to Salesrobot → done.

5 minutes for what used to take a day.`,

      `every "personalized" outreach tool I've tried just rearranges 4 templates.

THS Post writes each message from scratch — referencing the prospect's actual context, in your voice.

50 prospects, 5 minutes. download CSV. upload to your sender. send.`,

      `PSA for anyone doing LinkedIn outbound:

stop blasting templates. seriously.

THS Post writes a unique 3-msg sequence for every prospect. each one references something specific about them.

reply rates went from 4% to 19% for me. zero exaggeration.`,
    ],
  },

  /* ─────────────────────── Facebook ─────────────────────── */
  {
    platform: "facebook",
    variant: "Conversational",
    bodies: [
      `Built something that's been changing how I work this month.

It's called THS Post — an AI-powered content engine that watches 25+ AI news sources and drafts platform-specific posts for me automatically.

Saves me 3 hours a day, easily.

Anyone else struggling with AI content overwhelm? Let me know what you'd want in a tool like this — I'm still adding features based on real feedback.`,

      `Real talk: I was burning out on the "stay current with AI" game.

Subscribed to 12 newsletters. Bookmarked everything. Read maybe 10% of it. Wrote even less.

So I built THS Post — a tool that does the discovery + drafting for me. Now I genuinely keep up because the friction is gone.

Anyone else hitting a wall with content + research overhead? What's working for you?`,

      `Question for the founders + creators here:

How much time per week do you spend writing social posts vs actually building/serving customers?

For me it was 8-12 hours. Now it's 1-2.

The shift: stopped writing from scratch, started reviewing AI drafts. Built a tool called THS Post to make that workflow seamless.

Curious where everyone else is on this — fully manual, partly AI, fully outsourced?`,

      `Three months ago I posted on LinkedIn maybe twice a month.

This week I've posted 8 times. Quality is higher, not lower.

The change: built THS Post — an AI tool that drafts content from AI news in my voice. Removed the "what should I write about today" decision entirely.

Anyone struggling with consistency? It's almost always a friction problem, not a discipline problem. Tag a builder who'd find this useful.`,
    ],
  },

  {
    platform: "facebook",
    variant: "Launch announce",
    bodies: [
      `Just shipped THS Post — my new AI-powered social media tool.

It pulls news from 25+ AI sources, drafts posts in 4 platforms (LinkedIn, X, Facebook, Instagram), supports English + Urdu, has trending detection, a LinkedIn outreach generator, and engagement tracking.

If you create AI content, this saves hours every week. Open to feedback from anyone who wants to try it 👇`,

      `Big update on THS Post — added a few things this week:

🎨 Brand voice tuning (paste your past posts, AI matches your style)
🔥 Trending detection (catches stories before they're everywhere)
🤝 LinkedIn bulk outreach (50 personalized DMs in 5 minutes)
🌐 Bilingual EN/UR drafting

Free version covers daily use; unlock code for unlimited. DM if you want a code.`,

      `Quietly launched THS Post a few weeks ago. Now battle-tested.

What it does:
- Reads 25+ AI news sources daily
- Drafts posts in your voice across 4 platforms
- Spots trending stories
- Generates LinkedIn outreach at scale
- Tracks engagement so you learn what works

For builders, founders, creators in AI. Especially helpful for the "I should post more but don't have time" crowd.

Try it, tell me what you'd add next.`,

      `THS Post is now live in beta.

Built it for one painful problem: keeping up with AI news + posting about it consistently.

Now it does both for me, in 5 minutes a day instead of 3 hours.

If that pain resonates, let me know — I'll send you an unlock code so you can try the full thing.`,
    ],
  },

  {
    platform: "facebook",
    variant: "Pakistan-focused",
    bodies: [
      `Pakistan ka AI content creators ke liye chhoti si khabar:

Maine THS Post bana liya hai — ek tool jo AI news 25+ sources se laata hai aur aap ke liye LinkedIn / X / Facebook / Instagram posts draft karta hai automatically. Urdu mein bhi.

Saves real hours every day. Especially agar aap AI ke baare mein roz post karte hain.

Pakistan-based founders ke liye built. International karne walay bhi welcome.`,

      `Karachi, Lahore, Islamabad — the AI builders here are shipping serious work but hardly any of us post about it.

Mostly because writing posts in two markets (English globally + Urdu locally) takes forever.

THS Post solves this — drafts in both EN and UR natively. Same article, two language versions, ready to post.

If you build in AI from Pakistan, your audience here deserves to hear about it. Tool's ready when you are.`,

      `Pakistani solopreneurs — sun lo:

The biggest leverage you have right now is content. Not because it's easy, because nobody else here is doing it consistently.

Built THS Post exactly for this. Drafts AI-related posts in your voice across LinkedIn, X, FB, IG. Bilingual. Free tier works for casual use.

Stop sleeping on the audience that's literally waiting for desi voices in tech.`,

      `Realization from building THS Post in Pakistan:

The "global SaaS market" doesn't care where you build. They care what you ship.

Building from Karachi. Customers in 12 countries on day 30. Tool is bilingual because Pakistani audience matters too — not as a translation, but native Urdu drafting.

If you're building from PK and worried about the market — don't be. Just ship.`,
    ],
  },

  /* ─────────────────────── Instagram ─────────────────────── */
  {
    platform: "instagram",
    variant: "Save-worthy carousel hook",
    bodies: [
      `I built THS Post — the AI tool that watches the AI industry for me.

→ 25+ AI news sources, fetched automatically
→ Drafts in your brand voice (English + Urdu)
→ Spots trending stories before they break
→ LinkedIn outreach generator
→ Engagement tracker
→ Everything in one app

5 minutes a day instead of 3 hours.

Save this if you post about AI.
Tag a builder who needs this.`,

      `The AI content workflow that gives me my evenings back:

→ THS Post pulls news from 25+ AI sources daily
→ Drafts ready-to-post versions in my voice
→ I review, tweak the hook, ship to all 4 platforms
→ Done in under 10 minutes

Saved 12+ hours weekly. Posted 5x more.

Save this for the next time you say "I should post more about AI."`,

      `If posting about AI feels overwhelming, you're not crazy — the cycle moves too fast for any one person.

Built THS Post specifically for this:
→ Curates 25+ sources into one queue
→ Drafts in your voice across 4 platforms
→ Bilingual (EN + UR)
→ Trending alerts so you catch stories early
→ Tracks what actually performs

The unfair advantage isn't AI itself. It's having AI run your content workflow.

Save this 📌`,

      `Real talk for AI content creators:

Most "AI for posts" tools generate generic slop.

THS Post does the opposite:
→ Discovery (watches 25 sources for you)
→ Voice matching (learns from YOUR past posts)
→ Multi-platform formatting (LinkedIn ≠ X ≠ IG)
→ Trending detection (3+ sources = 🔥)

Built for builders who care about quality + want their evenings back.

Save this if "I should post more" is on your todo list every week.`,
    ],
    hashtags: "#AI #BuildInPublic #Productivity #LinkedInTips #ContentCreator #AIAgents #LLM #SoloDev #Pakistan #StartupLife #AITools #ContentMarketing",
  },

  {
    platform: "instagram",
    variant: "Direct CTA",
    bodies: [
      `Stop reading AI news.

Let AI read it for you.

Built THS Post:

→ Auto-drafts your posts across 4 platforms
→ Trained on your voice
→ Trending alerts
→ Bulk LinkedIn outreach
→ EN + UR

Link in bio.`,

      `5 minutes a day.
4 platforms covered.
1 unfair advantage.

THS Post. AI news → social drafts in your voice.

Link in bio. Tag a creator who's drowning in content.`,

      `If posting about AI is your job — stop typing.

THS Post drafts your content from 25+ AI news sources daily. In your voice. Across 4 platforms. EN or UR.

You curate. AI writes.

Link in bio.`,

      `The content workflow upgrade:

Old: Read 8 newsletters → outline → write 4 versions → post → repeat tomorrow.

New: Open THS Post → review 6 drafts → copy → post → done in 10 min.

Same output. 1/30th the time.

Link in bio.`,
    ],
    hashtags: "#AITools #Productivity #LinkedIn #ContentMarketing #AIContent #BuilderJourney #StartupTools #SoloFounder #IndieDev",
  },

  {
    platform: "instagram",
    variant: "Question hook",
    bodies: [
      `Spending too much time keeping up with AI news?

Same.

So I built an app that reads it for me and drafts the posts.

THS Post. AI news → social drafts → done.

Saves 3 hours daily.

Save this for later 📌`,

      `What's your "I'll read this later" backlog look like?

Mine was 200+ saved articles, 8 unread newsletters, and 0 posts written.

Built THS Post to fix this. Now AI handles discovery + drafting; I just curate the best.

You'd be surprised how much your "stay current" anxiety drops when the workflow is solved.

Save this if you've been there 📌`,

      `Founders + creators — quick question:

Are you actually keeping up with AI news, or just feeling guilty about not keeping up?

Most of us are the second.

THS Post is the tool I built to flip that. Watches 25+ sources, drafts your posts in your voice, takes 5 min/day.

Less guilt. More output.

Save this if you needed permission to delegate this entire workflow 📌`,

      `If you posted about AI today, was it because you had something to say — or because the algorithm requires daily content?

For most creators, both are kind of true.

THS Post solves the "I have to post but don't know what about" problem. AI surfaces what's actually worth posting from 25+ sources, drafts it in your voice, you ship.

Save this and stop pretending you'll write the post manually 📌`,
    ],
    hashtags: "#AI #Productivity #ContentCreator #SocialMediaTips #LinkedIn #AIAutomation #BuildInPublic #SaaS",
  },
];
