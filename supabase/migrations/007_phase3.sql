-- Phase 3: Brand voice examples + engagement log.

-- ── 1. Brand voice examples ──
-- User pastes their best past posts here; drafter uses them as few-shot
-- examples so generated drafts mimic the user's actual voice.
create table if not exists brand_voice_examples (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('facebook','instagram','linkedin','twitter')),
  body text not null,
  label text,
  created_at timestamptz default now()
);

create index if not exists brand_voice_examples_platform_idx
  on brand_voice_examples(platform, created_at desc);

-- ── 2. Engagement log on drafts ──
alter table drafts
  add column if not exists views    int default 0,
  add column if not exists likes    int default 0,
  add column if not exists comments int default 0,
  add column if not exists shares   int default 0,
  add column if not exists engagement_notes text;
