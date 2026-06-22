-- ============================================================
-- Research Summit — Analyst Ratings
-- Run this in the Supabase SQL Editor
-- ============================================================

create table analyst_ratings (
  id                uuid primary key default gen_random_uuid(),
  company_id        uuid not null references companies(id) on delete restrict,
  date              date not null,
  firm              text not null,
  analyst           text,
  rating            text not null,
  previous_rating   text,
  rating_action     text,
  price_target      decimal(12,2),
  previous_price_target decimal(12,2),
  price_target_action text,
  created_at        timestamptz default now()
);

alter table analyst_ratings enable row level security;

create policy "authenticated_read_ratings" on analyst_ratings
  for select using (auth.uid() is not null);

create policy "authenticated_insert_ratings" on analyst_ratings
  for insert with check (auth.uid() is not null);

create policy "authenticated_update_ratings" on analyst_ratings
  for update using (auth.uid() is not null);

create policy "authenticated_delete_ratings" on analyst_ratings
  for delete using (auth.uid() is not null);
