-- ============================================================
-- Research Summit — Management Data
-- Run this in the Supabase SQL Editor AFTER schema.sql
-- ============================================================

-- ─── 1. Add shares columns to company_executives ────────────

alter table company_executives
  add column if not exists shares bigint,
  add column if not exists ownership_pct decimal(5,2);


-- ─── 2. insider_transactions table ──────────────────────────

create table insider_transactions (
  id                uuid primary key default gen_random_uuid(),
  company_id        uuid not null references companies(id) on delete restrict,
  person_name       text not null,
  transaction_type  text not null check (transaction_type in ('buy', 'sell')),
  transaction_date  date not null,
  shares            bigint not null,
  price_per_share   decimal(12,2),
  sort_order        int not null default 0,
  created_at        timestamptz default now()
);

alter table insider_transactions enable row level security;

create policy "authenticated_read_insider_tx" on insider_transactions
  for select using (auth.uid() is not null);

create policy "authenticated_insert_insider_tx" on insider_transactions
  for insert with check (auth.uid() is not null);

create policy "authenticated_update_insider_tx" on insider_transactions
  for update using (auth.uid() is not null);

create policy "authenticated_delete_insider_tx" on insider_transactions
  for delete using (auth.uid() is not null);
