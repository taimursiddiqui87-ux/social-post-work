-- Multi-tenant: drafts become per-user, RLS enforces isolation.
-- Run this in the Supabase SQL editor.

-- 1. Add user_id to drafts. Existing rows get NULL (will be visible to no one).
alter table drafts
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

create index if not exists drafts_user_id_idx on drafts(user_id);

-- 2. Enable RLS on drafts. Without policies, even the owner can't read.
alter table drafts enable row level security;

drop policy if exists "drafts_select_own" on drafts;
drop policy if exists "drafts_insert_own" on drafts;
drop policy if exists "drafts_update_own" on drafts;
drop policy if exists "drafts_delete_own" on drafts;

create policy "drafts_select_own"
  on drafts for select
  using (auth.uid() = user_id);

create policy "drafts_insert_own"
  on drafts for insert
  with check (auth.uid() = user_id);

create policy "drafts_update_own"
  on drafts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "drafts_delete_own"
  on drafts for delete
  using (auth.uid() = user_id);

-- 3. accounts: per-user (was missing user_id)
alter table accounts
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- A given user can only have one row per platform. Drop the old global unique
-- and replace with a composite (user_id, platform).
alter table accounts drop constraint if exists accounts_platform_key;
create unique index if not exists accounts_user_platform_uidx
  on accounts(user_id, platform) where user_id is not null;

alter table accounts enable row level security;

drop policy if exists "accounts_select_own" on accounts;
drop policy if exists "accounts_insert_own" on accounts;
drop policy if exists "accounts_update_own" on accounts;
drop policy if exists "accounts_delete_own" on accounts;

create policy "accounts_select_own"
  on accounts for select using (auth.uid() = user_id);
create policy "accounts_insert_own"
  on accounts for insert with check (auth.uid() = user_id);
create policy "accounts_update_own"
  on accounts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "accounts_delete_own"
  on accounts for delete using (auth.uid() = user_id);

-- 4. sources + items stay global. Make them readable to all authenticated users.
alter table sources enable row level security;
alter table items enable row level security;

drop policy if exists "sources_select_all" on sources;
drop policy if exists "items_select_all" on items;

-- Authenticated read; mutations only via service-role (server actions).
create policy "sources_select_all" on sources for select to authenticated using (true);
create policy "items_select_all"   on items   for select to authenticated using (true);

-- 5. Optional: clean up legacy NULL-user drafts left over from pre-auth use.
delete from drafts where user_id is null;
