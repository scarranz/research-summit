-- ============================================================
-- Research Summit -- Tools > Betas: beta history
-- DRAFT — not run yet. The Betas tab currently keeps this history in the browser
-- (localStorage key betas-history-v1) with exactly these column names; once this
-- table exists, only the store functions in js/betas-core.js move to api.js.
-- Run in the Supabase SQL Editor AFTER schema.sql (San / Oscar).
-- ============================================================

create table beta_history (
  id                uuid primary key default gen_random_uuid(),
  ticker            text not null,
  index_ticker      text not null,
  frequency         text not null check (frequency in ('daily', 'weekly', 'monthly')),
  window_amount     int  not null,
  window_unit       text not null check (window_unit in ('months', 'years')),
  window_start      date not null,
  end_date          date not null,
  observations      int  not null,
  beta_type         text not null check (beta_type in ('raw', 'adj', 'rlast', 'ravg', 'rmed', 'manual')),
  beta_type_label   text,
  beta              numeric not null,          -- the submitted number
  raw_beta          numeric,
  adjusted_beta     numeric,
  blume_alpha       numeric,
  blume_anchor      numeric,
  std_error         numeric,
  ci_low            numeric,
  ci_high           numeric,
  correlation       numeric,
  r_squared         numeric,
  alpha_annual_pct  numeric,
  stock_vol_pct     numeric,
  index_vol_pct     numeric,
  rolling_amount    int,
  rolling_unit      text check (rolling_unit in ('months', 'years')),
  rolling_last      numeric,
  rolling_avg       numeric,
  rolling_median    numeric,
  rolling_min       numeric,
  rolling_max       numeric,
  price_source      text,                      -- portal | massive | mixed
  data_as_of        date,
  note              text,
  submitted_by      text,                      -- email
  created_by        uuid references auth.users(id),
  submitted_at      timestamptz not null default now()
);

create index beta_history_ticker_idx on beta_history (ticker, submitted_at desc);

alter table beta_history enable row level security;

create policy "authenticated_read_beta_history" on beta_history
  for select using (auth.uid() is not null);

create policy "authenticated_insert_beta_history" on beta_history
  for insert with check (auth.uid() is not null);

create policy "authenticated_delete_beta_history" on beta_history
  for delete using (auth.uid() is not null);
