-- ============================================================
-- Research Summit — Company Segments & KPIs (Fiscal.ai)
-- Run this in the Supabase SQL Editor
-- ============================================================

create table company_segments (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references companies(id) on delete restrict,
  segment_group   text not null,
  segment_name    text not null,
  kpi_id          integer,
  metric_name     text not null,
  period_type     text not null check (period_type in ('annual', 'quarterly')),
  fiscal_year     integer not null,
  fiscal_quarter  integer,
  value           decimal(20,2),
  currency        text not null default 'USD',
  sort_order      int not null default 0,
  created_at      timestamptz default now()
);

alter table company_segments enable row level security;

create policy "authenticated_read_segments" on company_segments
  for select using (auth.uid() is not null);

create policy "authenticated_insert_segments" on company_segments
  for insert with check (auth.uid() is not null);

create policy "authenticated_update_segments" on company_segments
  for update using (auth.uid() is not null);

create policy "authenticated_delete_segments" on company_segments
  for delete using (auth.uid() is not null);
