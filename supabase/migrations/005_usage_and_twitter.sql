-- Phase 1: Daily usage limits per IP + Twitter/X as a 4th platform.
-- Apply once in the Supabase SQL editor.

-- ── 1. Usage limits ──
-- One row per IP. Counts reset per UTC day. `unlocked` flips to true when a
-- valid unlock code is entered, removing the limit forever for that IP.
create table if not exists usage_limits (
  ip text primary key,
  fetch_count int not null default 0,
  draft_count int not null default 0,
  unlocked boolean not null default false,
  reset_date date not null default (now() at time zone 'utc')::date,
  updated_at timestamptz not null default now()
);

create index if not exists usage_limits_unlocked_idx on usage_limits(unlocked);

-- ── 2. Add Twitter/X to allowed platforms on drafts ──
alter table drafts drop constraint if exists drafts_platform_check;
alter table drafts add constraint drafts_platform_check
  check (platform in ('facebook', 'instagram', 'linkedin', 'twitter'));
