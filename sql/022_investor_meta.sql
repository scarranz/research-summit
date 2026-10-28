-- ============================================================
-- Research Summit — investor_meta (backs "Add Resources")
-- Run this in the Supabase SQL Editor AFTER 021_resource_only_fund_letters_backfill.sql
--
-- Hedge Funds -> Superinvestors -> Resources now has an "Add
-- Resources" button: type a fund or person's name, an edge function
-- (research-investor-resources, Claude + web search) looks for their
-- public letters, and the team picks which ones to add.
--
-- Whenever the researched fund/person isn't already a Superinvestor
-- card (js/portal-data.js INVESTORS) or one of the hardcoded
-- RES_ONLY_FUNDS entries in js/hedge-funds.js, this table is where its
-- display name + fund label get stored instead of hand-editing a JS
-- file every time. js/hedge-funds.js's resFundList() merges
-- INVESTORS + RES_ONLY_FUNDS + this table for the Resources tab's
-- search, grouping, and fund tags.
-- ============================================================

create table investor_meta (
  key         text primary key,
  name        text not null,
  fund        text,
  created_by  uuid references auth.users(id),
  created_at  timestamptz default now()
);

alter table investor_meta enable row level security;

create policy "authenticated_read_investor_meta" on investor_meta
  for select using (auth.uid() is not null);

create policy "authenticated_insert_investor_meta" on investor_meta
  for insert with check (auth.uid() is not null);

create policy "authenticated_update_investor_meta" on investor_meta
  for update using (auth.uid() is not null);

create policy "authenticated_delete_investor_meta" on investor_meta
  for delete using (auth.uid() is not null);
