# THS Post — Project Audit

_Generated 2026-05-04. Single-developer Next.js 16 + Supabase + Groq social-post tool._

## 1. Top-level layout

```
.
├── src/
│   ├── app/           # Next.js App Router pages, server actions, API routes
│   ├── components/    # 14 React components (queue, sidebar, marketing, etc.)
│   └── lib/           # 11 server-side utilities (Supabase, RSS, LLM, limits)
├── scripts/           # 8 CLI scripts (fetch-news, generate-drafts, sync-sources, audits)
├── supabase/
│   ├── schema.sql     # Base tables: sources, items, drafts, accounts, usage_limits
│   └── migrations/    # 005–007 — usage tracking, Twitter, Phase 2/3 stubs
├── public/            # Static assets + PWA manifest
├── .env.example       # Documented env vars
├── DEPLOY.md          # Deployment + PWA install guide
├── PROJECT.md         # Comprehensive project reference
├── README.md          # Phase 1 overview
├── next.config.mjs    # Server actions, 2 MB body limit
├── tailwind.config.ts # Minimal — content scan only
└── tsconfig.json      # strict, ES2022, `@/*` → `src/*`
```

## 2. App routes (`src/app/**`)

| Route | Purpose |
|---|---|
| `/` | Main queue: pending drafts to review/copy/approve |
| `/topic/[slug]` | Filtered queue per topic (Claude, ChatGPT, Google AI, Grok, Tools, Agents, Music, Video) |
| `/search` | "Ask AI" — Groq-powered semantic search across stored items |
| `/outreach` | LinkedIn outreach generator (connection request + 2 follow-ups) |
| `/posted` | History view of items marked as posted |
| `/settings` | License code entry, admin toggle |
| `/admin` | Password gate (`ADMIN_SECRET`); unlocks `/marketing` |
| `/marketing` | Admin-only — 48+ pre-drafted marketing posts, weekly rotation |
| `api/cron/fetch` | Stub — future scheduled RSS fetch |
| `api/cron/post` | Stub — future scheduled posting (Phase 2) |

Server actions (`src/app/actions.ts`): `runFetch`, `runDraft`, `markPosted`, `rejectDraft`, `updateDraftBody`, `searchItems`, `generateOutreach`, `unlockWithCode`, `fetchUsage`.

## 3. Components (`src/components/**`)

| File | Purpose |
|---|---|
| [QueueView.tsx](src/components/QueueView.tsx) | Main queue layout, status grouping, topic filtering, trending detection |
| [DraftCard.tsx](src/components/DraftCard.tsx) | Per-draft card — body, hashtags, hook, copy/posted buttons |
| [Sidebar.tsx](src/components/Sidebar.tsx) | Left nav — queue, ask AI, outreach, posted, settings, topics, admin |
| [Toolbar.tsx](src/components/Toolbar.tsx) | Top bar — Fetch, Generate, usage quota, unlock input |
| [MarketingGrid.tsx](src/components/MarketingGrid.tsx) | Admin-only grid of 48+ marketing posts |
| [MarketingCards.tsx](src/components/MarketingCards.tsx) | Marketing post card with platform color + compose URL |
| [OutreachWorkspace.tsx](src/components/OutreachWorkspace.tsx) | LinkedIn outreach form → 3-message sequence |
| [SearchPanel.tsx](src/components/SearchPanel.tsx) | Ask AI input + result list |
| [BrandVoiceManager.tsx](src/components/BrandVoiceManager.tsx) | Tone/style management (light usage) |
| [EngagementEditor.tsx](src/components/EngagementEditor.tsx) | Reserved — draft editor (not fully wired) |
| [UnpostButton.tsx](src/components/UnpostButton.tsx) | Move draft from `/posted` back to queue |
| [CountUp.tsx](src/components/CountUp.tsx) | Animated number counter |
| [Spotlight.tsx](src/components/Spotlight.tsx) | Decorative hover spotlight |
| [AIBackdrop.tsx](src/components/AIBackdrop.tsx) | Animated SVG mesh backdrop |

## 4. Lib / utilities (`src/lib/**`)

| File | Purpose |
|---|---|
| [supabase.ts](src/lib/supabase.ts) | `supabaseAdmin()` — server-only service-role client |
| [fetch-news.ts](src/lib/fetch-news.ts) | Parallel RSS fetch from 18 sources, dedup by URL hash, bulk upsert |
| [drafter.ts](src/lib/drafter.ts) | Groq prompts per platform, priority scoring, generates up to 18 drafts/run |
| [sources-config.ts](src/lib/sources-config.ts) | Canonical 18 RSS sources (vendor, commentary, launches, press, Google News) |
| [topics.ts](src/lib/topics.ts) | 8 topics → sources → sidebar mapping |
| [trending.ts](src/lib/trending.ts) | Trending detection — 3+ sources within 24h, fuzzy keyword cluster |
| [search.ts](src/lib/search.ts) | Substring + Groq semantic search |
| [outreach.ts](src/lib/outreach.ts) | Groq-powered LinkedIn outreach generator |
| [limits.ts](src/lib/limits.ts) | Per-IP daily quotas (2/2/3), unlock codes, admin cookie |
| [hash.ts](src/lib/hash.ts) | URL canonicalization + SHA-256 hash for dedup |
| [marketing-posts.ts](src/lib/marketing-posts.ts) | 48+ static marketing copy variants + weekly rotation logic |

## 5. Database / Supabase

**Tables** (`supabase/schema.sql`):
- `sources` — RSS feeds (id, name, url, kind, enabled)
- `items` — discovered articles (url_hash dedup, status: new/drafted/rejected, relevance_score)
- `drafts` — generated posts (platform: fb/ig/linkedin/twitter, status: pending/approved/rejected/scheduled/posted/failed)
- `accounts` — reserved Phase 2 OAuth (platform, tokens, expires_at)
- `usage_limits` — per-IP daily quota tracking

**Migrations** (`supabase/migrations/`):
- `002_better_sources.sql`, `003_google_news_feeds.sql` — legacy source updates
- `005_usage_and_twitter.sql` — usage_limits table + Twitter as 4th platform
- `006_phase2.sql` — OAuth account-linking stub
- `007_phase3.sql` — scheduled posting stub

Indices on `items.status`, `drafts.status`, `drafts.scheduled_for`.

## 6. Scripts (`scripts/*.ts`)

| Script | Purpose |
|---|---|
| `fetch-news.ts` | Pull all 18 RSS feeds in parallel; log JSON result |
| `generate-drafts.ts` | Draft up to 6 new items via Groq; log result |
| `sync-sources.ts` | Idempotent upsert of `sources-config.ts` to DB |
| `audit.ts` | Diagnostic — items per source, by status |
| `cleanup-orphans.ts` | Remove drafts with NULL `source_id` |
| `verify-sources.ts` | List active sources from DB with counts |
| `test-feed.ts` | Ad-hoc single-feed parsing test |
| `verify-phase2.ts` | Reserved — OAuth verification placeholder |

Exposed via `npm run fetch-news`, `generate-drafts`, `sync-sources`.

## 7. Environment variables (`.env.example`)

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-side Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase admin |
| `GEMINI_API_KEY` | Documented, **but unused** — code uses Groq |
| `TAVILY_API_KEY` | Optional, currently unused |
| `META_APP_ID` / `META_APP_SECRET` / `META_PAGE_ID` / `META_PAGE_ACCESS_TOKEN` / `META_IG_USER_ID` | Phase 2 (Meta) |
| `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET` / `LINKEDIN_ACCESS_TOKEN` / `LINKEDIN_AUTHOR_URN` | Phase 2 (LinkedIn) |
| `CRON_SECRET` | Bearer token for `/api/cron/*` |
| `UNLOCK_CODE` | Lifts daily quotas |
| `ADMIN_SECRET` | Password for `/admin`, sets persistent cookie |

## 8. Existing docs

- **README.md** — Phase 1 overview, setup steps, RSS → Gemini → manual review pipeline. References Gemini, but actual code uses Groq.
- **PROJECT.md** — Comprehensive reference: data model, flow, stack (correctly says Groq Llama 3.3 70B), 18 sources, 8 topics, per-platform prompt rules, common ops, troubleshooting, known limits.
- **DEPLOY.md** — GitHub → Vercel deploy, PWA install guide (Edge/Chrome desktop app), shared Supabase notes, optional Tauri.

## 9. Tech stack & config

- **Next.js** 16.2.4 (App Router, server actions)
- **React** 19.2.5
- **Supabase** `@supabase/supabase-js` 2.45.4, `@supabase/ssr` 0.5.2
- **LLM**: `@google/generative-ai` 0.21.0 declared **but unused** — runtime uses Groq Llama 3.3 70B
- **rss-parser** 3.13.0, **zod** 3.23.8
- **TypeScript** 5.6.3 (strict, ES2022, `@/*` alias)
- **Tailwind** 3.4.15 (minimal config, custom keyframes for mesh drift / gradient text)
- **next.config.mjs**: experimental server actions, 2 MB body size

## 10. Notable observations

### Discrepancies
- **Gemini vs Groq**: README + `.env.example` reference Gemini, but `drafter.ts`, `search.ts`, `outreach.ts` all use Groq. Either remove `@google/generative-ai` + `GEMINI_API_KEY` or restore Gemini path. PROJECT.md is the only doc that gets this right.

### Security
- Admin auth = plaintext cookie comparison vs `ADMIN_SECRET`. Persistent, no expiry. OK for solo tool, fragile for shared deploys.
- Unlock code = plain string match in `limits.ts`. No rate-limit on attempts.
- Service role key in `.env.local` + Vercel env. No rotation mechanism.

### Testing & CI
- **No tests** anywhere in the repo. No test runner in `package.json`.
- **No CI workflows** under `.github/`. Deploys rely on Vercel git integration.

### Error handling & rate limits
- Server actions return `ActionResult` wrappers — good.
- No retry/circuit breaker around RSS or Groq calls. A batch draft run can blow Groq's free-tier 12k tokens/min.
- Trending detection recomputes per request; no caching.

### Architecture gaps
- Orphan drafts (after deleting a source) require manual `cleanup-orphans.ts` run.
- Cron stubs (`/api/cron/fetch`, `/api/cron/post`) return empty; no GitHub Actions or Vercel Cron wired.
- No actual LinkedIn / Meta posting implementation — tables and env vars exist, code does not.
- Marketing copy is hardcoded in `marketing-posts.ts`; no admin UI to edit.

### Code quality
- One TODO: `src/app/api/cron/post/route.ts` — Phase 2 dispatch stub.
- Consistent TS, server actions for mutations, client components only where interactivity is needed.
- All 14 components are wired into routes — no dead components observed.

### Other
- PWA manifest in `public/` is wired up.
- Responsive: sidebar hides on mobile; Tailwind grid adapts.
- Bulk RSS fetch via `Promise.all`; bulk DB upserts.
- No client state library — server state + `revalidatePath` only.

## Suggested follow-ups (priority order)

1. **Resolve Gemini-vs-Groq drift** — pick one, remove the unused dependency / env var, update README.
2. **Add a smoke-test** for `fetchAllSources()` and `generateDraftsForNewItems()` so RSS schema breaks don't go silent.
3. **Wire `/api/cron/fetch`** to Vercel Cron with `CRON_SECRET` auth — replaces manual `npm run fetch-news`.
4. **Rate-limit Groq calls** in `drafter.ts` (sequential with small delay, or token-bucket) to stay under free-tier limits.
5. **Auto-cleanup orphan drafts** in a DB trigger or in `runFetch` instead of a separate script.
6. **Replace plaintext admin cookie** with a signed/TTL token if you ever expose this beyond yourself.
