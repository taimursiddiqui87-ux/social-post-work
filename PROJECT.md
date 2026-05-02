# Social Post Work — Project Reference

A complete reference for the AI-news → social-drafts pipeline. Read this when
returning to the project after a break, before adding features, or when
debugging unexpected behavior.

---

## What this app does

1. **Fetches** AI-related articles from 18 RSS feeds (vendor blogs, commentary, news aggregators).
2. **Drafts** platform-specific social posts (LinkedIn, Facebook, Instagram) using **Groq Llama 3.3 70B**.
3. **Presents** drafts in a review queue with copy-to-clipboard + mark-as-posted workflow.
4. **No auto-posting.** You manually copy/paste to each platform — by design.

The deployed app runs at your Vercel URL and is installed as a desktop PWA on Windows.

---

## Stack

| Layer | Tech | Why |
|---|---|---|
| Frontend | **Next.js 16** (App Router, React 19) | Full-stack React with server components |
| Hosting | **Vercel** (free tier) | Auto-deploy on push to `main` |
| Database | **Supabase Postgres** (free tier) | Sources, items, drafts |
| LLM | **Groq Llama 3.3 70B** (free tier) | Fast, no billing, good social-post writing |
| RSS parsing | `rss-parser` | Standard, reliable |
| Styling | **Tailwind CSS** + Inter font | Apple-style light theme |
| Desktop app | **PWA** (browser "Install app") | No Tauri/Electron — Edge/Chrome's "install" gives a native-feeling icon |

Cost: **$0/month** within free tiers.

---

## Data model

Schema lives in [`supabase/schema.sql`](supabase/schema.sql).

| Table | Purpose |
|---|---|
| `sources` | RSS feeds we crawl. Columns: `id`, `name`, `url`, `kind`, `enabled`. |
| `items` | One row per article ever discovered. Dedup by `url_hash` (sha256 of canonicalized URL). Status: `new` → `drafted` → `rejected`. |
| `drafts` | Generated social posts. Status: `pending` → `posted` / `rejected`. One item produces 3 drafts (one per platform). |
| `accounts` | Reserved for future OAuth (LinkedIn/Meta tokens). Currently unused. |

Relationships:
- `items.source_id` → `sources.id` (`on delete set null` — deleting a source orphans its items)
- `drafts.item_id` → `items.id` (`on delete cascade`)

---

## Data flow

```
[RSS feeds] ──fetch──► items.status='new'
                             │
                             ▼
              [Groq + per-platform prompts]
                             │
                             ▼
              drafts.status='pending'  ◄── shown in /queue
                             │
                       ┌─────┴──────┐
                       ▼            ▼
              status='posted'  status='rejected'
                       │
                       ▼
                  shown in /posted
```

---

## File structure

```
.
├── PROJECT.md                       ← (this file)
├── DEPLOY.md                        ← deploy + PWA install instructions
├── README.md                        ← high-level overview (older — see this file instead)
├── package.json                     ← scripts: dev, build, fetch-news, generate-drafts, sync-sources
├── tsconfig.json                    ← scripts/ excluded from Next typecheck
├── tailwind.config.ts
├── next.config.mjs
├── public/
│   ├── icon.svg                     ← PWA icon (emerald gradient)
│   └── manifest.webmanifest         ← PWA manifest (display: standalone)
├── supabase/
│   ├── schema.sql                   ← initial schema; run once on a fresh project
│   └── migrations/
│       ├── 002_better_sources.sql   ← legacy (replaced by sync-sources)
│       └── 003_google_news_feeds.sql ← legacy (replaced by sync-sources)
├── scripts/                         ← CLI tooling, NOT part of the deployed app
│   ├── fetch-news.ts                ← npm run fetch-news
│   ├── generate-drafts.ts           ← npm run generate-drafts
│   ├── sync-sources.ts              ← npm run sync-sources  (idempotent)
│   ├── audit.ts                     ← diagnostic: items + drafts per source
│   ├── cleanup-orphans.ts           ← removes drafts whose source was deleted
│   └── verify-sources.ts            ← list active sources from DB
└── src/
    ├── app/
    │   ├── layout.tsx               ← root layout, sidebar mounts here
    │   ├── globals.css              ← light theme, ambient gradients, focus rings
    │   ├── page.tsx                 ← main queue (wraps QueueView)
    │   ├── posted/page.tsx          ← posted history
    │   ├── topic/[slug]/page.tsx    ← per-topic filter (Claude, ChatGPT, etc.)
    │   ├── actions.ts               ← server actions: runFetch, runDraft, markPosted, etc.
    │   └── api/
    │       └── cron/
    │           ├── fetch/route.ts   ← future: scheduled fetch endpoint
    │           └── post/route.ts    ← future: scheduled posting endpoint (stub)
    ├── components/
    │   ├── Sidebar.tsx              ← left nav with topic links
    │   ├── QueueView.tsx            ← shared queue rendering (used by / and /topic/[slug])
    │   ├── DraftCard.tsx            ← per-platform draft card with Copy + Mark posted
    │   ├── Toolbar.tsx              ← Fetch news / Generate drafts buttons
    │   └── UnpostButton.tsx         ← move back to queue (on /posted)
    └── lib/
        ├── supabase.ts              ← supabaseAdmin() — server-only, service-role
        ├── hash.ts                  ← URL canonicalization + sha256
        ├── fetch-news.ts            ← parallel feed pulls + bulk upsert
        ├── drafter.ts               ← Groq prompts + priority-source selection
        ├── sources-config.ts        ← canonical 18-source list (edit here)
        └── topics.ts                ← 8 topic filters (label, sources, accent, icon)
```

---

## Sources currently configured (18)

Defined in [`src/lib/sources-config.ts`](src/lib/sources-config.ts).

### Vendor-direct (highest priority)
| Source | URL | What it covers |
|---|---|---|
| OpenAI Blog | openai.com/blog/rss.xml | GPT, Sora, ChatGPT, API releases |
| Google AI Blog | blog.google/technology/ai/rss/ | Gemini, Veo, DeepMind |
| Hugging Face Blog | huggingface.co/blog/feed.xml | Open-source models, ecosystem |

### Commentary & analysis
| Source | URL | What it covers |
|---|---|---|
| Simon Willison | simonwillison.net/atom/everything/ | Best Claude/GPT/Gemini analysis |
| Latent Space | latent.space/feed | AI builder commentary |
| AI News (smol) | buttondown.email/ainews/rss | Daily AI news digest |

### New tool launches
| Source | URL | What it covers |
|---|---|---|
| Show HN AI Launches | hnrss.org/show?q=AI+OR+LLM... | Hacker News "Show HN" indie launches |
| Product Hunt AI | producthunt.com/feed?category=artificial-intelligence | Product Hunt AI launches |

### Mainstream press
| Source | URL | What it covers |
|---|---|---|
| TechCrunch AI | techcrunch.com/.../feed | Funding, deals, product launches |
| The Verge AI | theverge.com/.../index.xml | Consumer-facing AI |
| VentureBeat AI | venturebeat.com/.../feed | Enterprise AI |

### Google News (vendor coverage where no official RSS exists)
| Source | What it covers |
|---|---|
| Claude / Anthropic | Anthropic + Claude news (no official RSS exists) |
| Grok / xAI | xAI + Grok news |
| Veo / Google AI Models | Veo 3, Gemini API specifically |
| AI API Updates | API changes from any vendor |

### Topic-specific Google News
| Source | What it covers |
|---|---|
| AI Agents News | Autonomous agents, agentic frameworks |
| AI Music News | Suno, Udio, music generation |
| AI Video News | Sora, Runway, Pika, video generation |

---

## Topics (sidebar filters) currently configured (8)

Defined in [`src/lib/topics.ts`](src/lib/topics.ts). Each is a saved view of the queue filtered to specific sources.

| Topic | Slug / URL | Source whitelist | Accent |
|---|---|---|---|
| Claude | `/topic/claude` | Claude / Anthropic, Simon Willison, AI News (smol) | amber |
| ChatGPT | `/topic/openai` | OpenAI Blog, Simon Willison, AI News (smol), AI API Updates | emerald |
| Google AI | `/topic/google` | Google AI Blog, Veo / Google AI Models, Simon Willison, AI News (smol), AI API Updates | sky |
| Grok | `/topic/grok` | Grok / xAI, AI News (smol) | zinc |
| New tools | `/topic/tools` | Show HN AI Launches, Product Hunt AI | fuchsia |
| AI agents | `/topic/agents` | AI Agents News, Show HN AI Launches, AI News (smol) | violet |
| AI music | `/topic/music` | AI Music News, AI News (smol) | rose |
| AI video | `/topic/video` | AI Video News, Veo / Google AI Models, AI News (smol) | orange |

---

## Drafter priority scoring

Defined in [`src/lib/drafter.ts`](src/lib/drafter.ts). When generating drafts, items are scored and sorted; ties broken by recency.

| Score | Tier | Sources |
|---|---|---|
| 10 | Vendor-direct | OpenAI Blog, Google AI Blog, Hugging Face Blog |
| 9 | Vendor news | Claude / Anthropic, Grok / xAI, Veo / Google AI Models, AI API Updates |
| 8 | Topic + indie commentary | AI Agents News, AI Music News, AI Video News, Simon Willison |
| 7 | Commentary + tool launches | Latent Space, AI News (smol), Show HN AI Launches |
| 6 | Tool launches | Product Hunt AI |
| 4 | Press | TechCrunch AI, The Verge AI, VentureBeat AI |

The drafter pulls the top 60 candidate items by recency, then re-sorts client-side by priority then recency, picks top 6, and generates 3 drafts each (18 total per run).

---

## Per-platform prompt rules

Defined in [`src/lib/drafter.ts`](src/lib/drafter.ts) `PLATFORM_RULES`.

| Platform | Length | Tone | Hashtags |
|---|---|---|---|
| LinkedIn | 1200–1800 chars | Professional, specific, no hype | 3–5 niche tags at end |
| Facebook | 400–700 chars | Conversational, asks a question | 2–3 tags + raw source link |
| Instagram | 800–1500 chars | Hook-first, → bullet style, save/tag CTA | 8–12 mixed-volume tags, no external links |

System prompt enforces: concrete facts, named entities, no generic fluff, AEO-friendly (LLM-quotable) phrasing.

---

## Environment variables

Set in `.env.local` (local) and Vercel project settings (production).

| Var | Where to get | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project settings | Public — exposed to browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project settings | Public — RLS-safe |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project settings | **SECRET** — server only, bypasses RLS |
| `GROQ_API_KEY` | console.groq.com/keys | Free tier, no billing concept |
| `GROQ_MODEL` | optional override | Default: `llama-3.3-70b-versatile` |
| `CRON_SECRET` | random string | Auths future cron endpoints |

---

## Common operations

### Open the app
- Desktop: click "Social Post" icon (Start menu / desktop shortcut)
- Or visit your Vercel URL in any browser

### Pull fresh news + generate drafts
1. Click **Fetch news** in the toolbar (5–10 sec, parallel-fetches all 18 feeds)
2. Click **Generate drafts** (60–90 sec — 18 Groq calls)
3. Review queue, edit if needed, click **Copy** → paste to platform → **Mark posted**

### Add a new source
1. Edit [`src/lib/sources-config.ts`](src/lib/sources-config.ts), append a new `SourceDef` entry
2. Run `npm run sync-sources` — idempotent, applies to DB
3. Click **Fetch news** in the app to pull articles from the new source
4. Optionally add it to a topic in [`src/lib/topics.ts`](src/lib/topics.ts)

### Add a new topic filter
Edit [`src/lib/topics.ts`](src/lib/topics.ts), append a new entry to `TOPICS`:
```ts
{
  slug: "robotics",
  label: "AI robotics",
  description: "Embodied AI, robotics, physical world models.",
  sources: ["AI News (smol)", "Show HN AI Launches"],
  accent: "text-cyan-600",
  iconPath: "M12 2v4M9 9h6M8 13a4 4 0 0 0 8 0v-4H8v4Z",
}
```
Sidebar picks it up automatically. URL becomes `/topic/robotics`.

### Tune draft tone
Edit `PLATFORM_RULES` and/or the `SYSTEM` prompt in [`src/lib/drafter.ts`](src/lib/drafter.ts). Then `git push` — Vercel redeploys in ~2 min.

### Diagnose why drafts look wrong
```bash
npm run audit             # items + drafts per source
npm run verify-sources    # list active sources
```

### Clean up after deleting a source
```bash
npx tsx --env-file=.env.local scripts/cleanup-orphans.ts
```
Removes drafts whose item.source_id is null.

### Deploy a code change
```bash
git add -A
git commit -m "What changed"
git push
```
Vercel auto-deploys in ~2 min. Desktop app picks up the new version on next open.

---

## Known limitations / future enhancements

| Limitation | Workaround / Fix |
|---|---|
| **Manual posting** — no LinkedIn/Meta OAuth | Build OAuth + posters when ready (see `src/app/api/cron/post/route.ts` stub) |
| **No scheduling** — drafts are generated on-click | Add GitHub Actions cron daily, hits `/api/cron/fetch` |
| **Groq free-tier rate limit** (12k tokens/min) | Last 1–2 drafts in a batch can hit 429. Add a 2-sec sleep between calls if needed. |
| **Llama JSON-validation occasionally fails** | One in ~20 calls fails with `json_validate_failed`. Other platforms still draft fine. Could add a single retry. |
| **Instagram needs an image** | Real auto-posting to IG requires a public-URL image. Currently out of scope. |
| **No "Sources" UI page** | To manage sources without code, you'd need a small admin page. Edit config + run `sync-sources` for now. |

---

## Troubleshooting

### "Queue is empty" but you have items in DB
- Items might be in `status='drafted'` already (check with `npm run audit`).
- Run **Generate drafts** to draft more.

### Vercel build fails with TypeScript error in `scripts/`
- `tsconfig.json` should have `"scripts"` in the `exclude` array. The CLI scripts use `tsx` which is more lenient than Next's bundled tsc.

### Groq returns 401 / unauthorized
- Check `GROQ_API_KEY` is set both in `.env.local` AND in Vercel project settings.
- Keys start with `gsk_`. If yours starts with `AIza` it's a Gemini key in the wrong slot.

### "Bad Request" on Supabase upsert
- Likely the unique constraint on `items.url_hash`. Should be handled by `ignoreDuplicates: true` in [`src/lib/fetch-news.ts`](src/lib/fetch-news.ts). If you see this, check that the schema migration ran.

### Drafts have wrong tone / too generic
- Tune the `SYSTEM` prompt and `PLATFORM_RULES` in [`src/lib/drafter.ts`](src/lib/drafter.ts).
- For better-quality posts, switch `GROQ_MODEL` to `llama-3.3-70b-versatile` (default) — don't downgrade to 8b.

### Light theme looks wrong / accent invisible
- Check the topic accent in [`src/lib/topics.ts`](src/lib/topics.ts) uses a `*-500` or `*-600` shade (not `*-300` or `*-400`, which are too light on white).

---

## Quick links

- **Live app:** your Vercel URL (open via desktop shortcut)
- **GitHub repo:** https://github.com/taimursiddiqui87-ux/social-post-work
- **Supabase project:** https://supabase.com/dashboard/project/vdssqtmovatvaxnnmcmn
- **Vercel dashboard:** https://vercel.com/dashboard
- **Groq console:** https://console.groq.com/keys
