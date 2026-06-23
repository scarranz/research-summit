-- ============================================================
-- Research Summit — Fund Returns (Performance Analysis tab)
-- Run this in the Supabase SQL Editor.
--
-- Holds the daily return series that power the Fund Returns dashboard:
--   · fund_daily_returns — the strategy (portfolio) daily TWR series
--   · benchmark_prices   — daily benchmark closes (SPY, interim → Massive)
--
-- Both are gated by RLS so only authenticated portal users can read them
-- (the data is confidential and must never be a public static file).
-- The actual rows are loaded separately (see the generated load script) and
-- are NOT committed to the repo.
-- ============================================================

create table if not exists fund_daily_returns (
  portfolio      text not null default 'STRATEGY',
  date           date not null,
  period_return  numeric not null,
  total_beta     numeric,
  primary key (portfolio, date)
);

create table if not exists benchmark_prices (
  symbol  text not null default 'SPY',
  date    date not null,
  close   numeric not null,
  primary key (symbol, date)
);

alter table fund_daily_returns enable row level security;
alter table benchmark_prices  enable row level security;

drop policy if exists "authenticated_read_fund_returns" on fund_daily_returns;
create policy "authenticated_read_fund_returns" on fund_daily_returns
  for select using (auth.uid() is not null);

drop policy if exists "authenticated_read_benchmark_prices" on benchmark_prices;
create policy "authenticated_read_benchmark_prices" on benchmark_prices
  for select using (auth.uid() is not null);
