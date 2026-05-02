-- Run this in Supabase SQL editor.

create extension if not exists "pgcrypto";

-- RSS / search sources we crawl
create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  kind text not null check (kind in ('rss','search')),
  query text,
  enabled boolean default true,
  created_at timestamptz default now()
);

-- One row per discovered article / item
create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references sources(id) on delete set null,
  url text not null,
  url_hash text not null unique,        -- sha256 of canonical url
  title text not null,
  summary text,
  published_at timestamptz,
  raw jsonb,                            -- original feed entry
  relevance_score int,                  -- 0..100 from LLM
  status text not null default 'new'    -- new | drafted | rejected
    check (status in ('new','drafted','rejected')),
  created_at timestamptz default now()
);
create index if not exists items_status_idx on items(status, created_at desc);

-- Generated drafts. One item -> up to 3 drafts (one per platform).
create table if not exists drafts (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references items(id) on delete cascade,
  platform text not null check (platform in ('facebook','instagram','linkedin')),
  body text not null,
  hashtags text[],
  hook text,
  cta text,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','scheduled','posted','failed')),
  scheduled_for timestamptz,
  posted_at timestamptz,
  external_post_id text,
  error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists drafts_status_idx on drafts(status, scheduled_for);

-- Connected social accounts (tokens). Service-role access only.
create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  platform text not null unique check (platform in ('facebook','instagram','linkedin')),
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  meta jsonb,                           -- page id, ig user id, urn etc
  updated_at timestamptz default now()
);

-- Default seeds: curated for AI vendor announcements + new tool launches
insert into sources (name, url, kind) values
  -- Vendor direct (OpenAI, Google, HF, etc — official announcements)
  ('OpenAI Blog',           'https://openai.com/blog/rss.xml', 'rss'),
  ('Google AI Blog',        'https://blog.google/technology/ai/rss/', 'rss'),
  ('Hugging Face Blog',     'https://huggingface.co/blog/feed.xml', 'rss'),
  -- AI commentary & deep analysis (Simon Willison covers Claude/GPT/Gemini in detail)
  ('Simon Willison',        'https://simonwillison.net/atom/everything/', 'rss'),
  ('Latent Space',          'https://www.latent.space/feed', 'rss'),
  ('AI News (smol)',        'https://buttondown.email/ainews/rss', 'rss'),
  -- New AI tool launches
  ('Show HN AI Launches',   'https://hnrss.org/show?q=AI+OR+LLM+OR+%22AI+tool%22+OR+%22AI+agent%22&points=20', 'rss'),
  ('Product Hunt AI',       'https://www.producthunt.com/feed?category=artificial-intelligence', 'rss'),
  -- Mainstream AI press
  ('TechCrunch AI',         'https://techcrunch.com/category/artificial-intelligence/feed/', 'rss'),
  ('The Verge AI',          'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', 'rss'),
  ('VentureBeat AI',        'https://venturebeat.com/category/ai/feed/', 'rss')
on conflict do nothing;
