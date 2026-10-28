-- ============================================================
-- Research Summit — Superinvestor holdings-return manual overrides
-- Run this in the Supabase SQL Editor.
--
-- Lets someone click a return figure in a Superinvestor card's Then/Now
-- holdings table and correct it in place. The value is looked up by
-- (investor_key, ticker, period) and, when present, overrides whatever
-- the app would otherwise compute/display for that cell -- it does NOT
-- touch investor_yearly_holdings or any other table.
--
-- SECURITY: every logged-in user can read overrides (so a correction shows
-- up for anyone viewing the grid), same convention as
-- investor_yearly_holdings/investor_yearly_returns (014_investor_profiles.sql).
-- Writes are restricted to a single email via auth.email(), enforced here
-- in the database -- not just hidden in the UI -- so the edit control can't
-- be exercised by calling the API directly from devtools either.
-- ============================================================

create table if not exists investor_return_overrides (
  id uuid primary key default gen_random_uuid(),
  investor_key text not null,
  ticker text not null,
  period text not null check (period in ('then', 'now')),
  value_pct numeric not null,
  updated_at timestamptz not null default now(),
  unique (investor_key, ticker, period)
);

create index if not exists investor_return_overrides_key on investor_return_overrides (investor_key);

alter table investor_return_overrides enable row level security;

create policy "authenticated_read_return_overrides" on investor_return_overrides
  for select using (auth.uid() is not null);

create policy "editor_insert_return_overrides" on investor_return_overrides
  for insert with check (auth.email() = 'scarranza@summit-mgmtx.com');

create policy "editor_update_return_overrides" on investor_return_overrides
  for update using (auth.email() = 'scarranza@summit-mgmtx.com')
  with check (auth.email() = 'scarranza@summit-mgmtx.com');
