-- Phase 2: bilingual posts + AI search quota.
-- Apply once in the Supabase SQL editor.

-- 1. Per-draft language (default English; 'ur' = Urdu).
alter table drafts
  add column if not exists language text not null default 'en'
    check (language in ('en', 'ur'));

create index if not exists drafts_language_idx on drafts(language);

-- 2. Per-IP daily quota for AI search-and-ask.
alter table usage_limits
  add column if not exists ask_count int not null default 0;
