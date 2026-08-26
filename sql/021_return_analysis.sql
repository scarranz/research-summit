-- ============================================================
-- Research Summit — Return Analysis (multi-portfolio, live feed)
-- Run this in the Supabase SQL Editor.
--
-- Supersedes sql/008_fund_returns.sql, which modelled a single strategy keyed
-- by a text label. It is left in place on purpose: nothing is dropped here, so
-- this script is safe to run on a project where 008 was already applied.
--
-- What this holds: the daily total return of each portfolio from 2026-01-01
-- onward. Everything before that date is the frozen history committed in
-- js/fund-history-data.js and is NOT loaded here -- see
-- docs/FUND_RETURNS_DATA_CONTRACT.md for why the series is split that way.
--
-- No holdings, no positions, no AUM. Daily returns only.
-- Every table is RLS-gated: authenticated portal users read, nobody writes
-- through the anon key. The daily load runs with the service role.
-- ============================================================

-- ─── Portfolios ─────────────────────────────────────────────
-- One row per portfolio offered in the tab. `code` is the join key with the
-- front end (js/fund-portfolios.js): the portal looks a portfolio up by code
-- and never hardcodes an id, because the repo is public.
create table if not exists portfolios (
  id                uuid primary key default gen_random_uuid(),
  code              text not null unique,
  name              text not null,
  benchmark_ticker  text not null default 'SPY',
  currency          text not null default 'USD',
  inception_date    date,
  display_order     integer not null default 0,
  active            boolean not null default true,
  created_at        timestamptz not null default now()
);

-- ─── Daily returns ──────────────────────────────────────────
-- Column names match the export the portfolio system already produces
-- (portfolio_id, date, daily_return, beta), so the loader needs no mapping.
--
-- The composite primary key makes the daily load idempotent: re-running a day
-- upserts it instead of duplicating it. That matters because a duplicated day
-- would silently compound twice and quietly overstate the track record.
--
-- on delete restrict (never cascade) so a portfolio cannot be deleted out from
-- under its history.
create table if not exists portfolio_daily_returns (
  portfolio_id   uuid not null references portfolios(id) on delete restrict,
  date           date not null,
  daily_return   numeric not null,
  beta           numeric,
  created_at     timestamptz not null default now(),
  primary key (portfolio_id, date)
);

create index if not exists portfolio_daily_returns_date_idx
  on portfolio_daily_returns (date);

-- ─── Benchmark ──────────────────────────────────────────────
-- Daily closes, not returns: the portal derives returns close-to-close, the
-- same way the frozen history's benchmark column was built. Storing closes also
-- means a re-run cannot corrupt a return that depends on its neighbour.
-- (Same shape as sql/008_fund_returns.sql, repeated so this file stands alone.)
create table if not exists benchmark_prices (
  symbol  text not null default 'SPY',
  date    date not null,
  close   numeric not null,
  primary key (symbol, date)
);

-- ─── Row level security ─────────────────────────────────────
alter table portfolios             enable row level security;
alter table portfolio_daily_returns enable row level security;
alter table benchmark_prices        enable row level security;

drop policy if exists "authenticated_read_portfolios" on portfolios;
create policy "authenticated_read_portfolios" on portfolios
  for select using (auth.uid() is not null);

drop policy if exists "authenticated_read_portfolio_returns" on portfolio_daily_returns;
create policy "authenticated_read_portfolio_returns" on portfolio_daily_returns
  for select using (auth.uid() is not null);

drop policy if exists "authenticated_read_benchmark_prices" on benchmark_prices;
create policy "authenticated_read_benchmark_prices" on benchmark_prices
  for select using (auth.uid() is not null);

-- ─── Seed ───────────────────────────────────────────────────
-- One row per portfolio the tab should offer. `code` must match an entry in
-- js/fund-portfolios.js or the portal will not find it and will fall back to
-- the seed file.
--
-- If the portfolio system already has its own id for this portfolio, insert it
-- explicitly here (id, code, name, ...) so the daily loader can write rows
-- without a lookup.
insert into portfolios (code, name, benchmark_ticker, currency, display_order)
values ('summit', 'Summit', 'SPY', 'USD', 1)
on conflict (code) do nothing;

-- ─── Daily load (reference) ─────────────────────────────────
-- What the T-1 job should run. Idempotent: safe to re-run for a day already
-- loaded, and safe to backfill a gap after an outage.
--
--   insert into portfolio_daily_returns (portfolio_id, date, daily_return, beta)
--   values ($1, $2, $3, $4)
--   on conflict (portfolio_id, date) do update
--     set daily_return = excluded.daily_return,
--         beta         = excluded.beta;
--
-- Load only dates >= 2026-01-01. Earlier dates are ignored by the portal (the
-- frozen history wins before the cutoff), so loading them is harmless but
-- pointless.
