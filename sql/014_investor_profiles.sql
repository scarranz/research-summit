-- ============================================================
-- Research Summit — Hedge Funds tab: Investor profile detail
-- Run this in the Supabase SQL Editor AFTER schema.sql
--
-- Adds per-year depth to each investor in the Hedge Funds tab (yearly
-- returns, that year's top holdings, and annual letters / investor
-- messages), shown in a pop-up when a user clicks an investor card.
--
-- `investor_key` matches INVESTORS[].key in js/portal-data.js (e.g.
-- 'ackman' for Bill Ackman / Pershing Square) — there is no separate
-- investors table since js/portal-data.js is the source of truth for
-- investor identity (name, fund, photo); these tables only add the
-- historical depth on top of it.
-- ============================================================

-- ─── 1. investor_yearly_returns ───────────────────────────────

create table investor_yearly_returns (
  id           uuid primary key default gen_random_uuid(),
  investor_key text not null,
  year         int not null,
  return_pct   numeric not null,
  created_by   uuid references auth.users(id),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  unique (investor_key, year)
);

create trigger investor_yearly_returns_updated_at
  before update on investor_yearly_returns
  for each row
  execute function set_updated_at();

alter table investor_yearly_returns enable row level security;

create policy "authenticated_read_investor_returns" on investor_yearly_returns
  for select using (auth.uid() is not null);

create policy "authenticated_insert_investor_returns" on investor_yearly_returns
  for insert with check (auth.uid() is not null);

create policy "authenticated_update_investor_returns" on investor_yearly_returns
  for update using (auth.uid() is not null);

create policy "authenticated_delete_investor_returns" on investor_yearly_returns
  for delete using (auth.uid() is not null);


-- ─── 2. investor_yearly_holdings ──────────────────────────────
-- Top holdings for one investor in one specific year/quarter (several
-- rows per period). Updated quarterly from 13F filings via the "Upload
-- 13F" button in the investor pop-up (js/investor-13f-parser.js parses
-- either the raw SEC EDGAR XML or a CSV export from an aggregator like
-- WhaleWisdom/Fintel/Dataroma — see that file for details). `ticker`
-- is nullable because the raw SEC XML only carries CUSIP; the upload
-- preview lets the user fill in the ticker by hand when we can't
-- auto-match it. Not FK'd to investor_yearly_returns — a period can
-- get its holdings filled in before or after its return is on file.

create table investor_yearly_holdings (
  id           uuid primary key default gen_random_uuid(),
  investor_key text not null,
  year         int not null,
  quarter      int check (quarter between 1 and 4),
  ticker       text,
  company_name text not null,
  cusip        text,
  value_usd    numeric,
  weight_pct   numeric not null,
  rank         int not null default 0,
  source_type  text not null default 'manual' check (source_type in ('manual', 'sec_xml', 'aggregator_csv')),
  created_by   uuid references auth.users(id),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index investor_yearly_holdings_key_year on investor_yearly_holdings (investor_key, year, quarter);

create trigger investor_yearly_holdings_updated_at
  before update on investor_yearly_holdings
  for each row
  execute function set_updated_at();

alter table investor_yearly_holdings enable row level security;

create policy "authenticated_read_investor_holdings" on investor_yearly_holdings
  for select using (auth.uid() is not null);

create policy "authenticated_insert_investor_holdings" on investor_yearly_holdings
  for insert with check (auth.uid() is not null);

create policy "authenticated_update_investor_holdings" on investor_yearly_holdings
  for update using (auth.uid() is not null);

create policy "authenticated_delete_investor_holdings" on investor_yearly_holdings
  for delete using (auth.uid() is not null);


-- ─── 3. investor_letters ───────────────────────────────────────
-- Annual letters and investor messages. Mirrors company_resources:
-- either a link or an uploaded file (Storage bucket 'company-files',
-- reused here under an 'investors/{key}/...' path — no new bucket).

create table investor_letters (
  id           uuid primary key default gen_random_uuid(),
  investor_key text not null,
  year         int,
  title        text not null,
  category     text not null check (category in ('annual_letter', 'investor_message')),
  date         date,
  type         text not null check (type in ('link', 'file')),
  url          text,
  sort_order   int not null default 0,
  created_by   uuid references auth.users(id),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create trigger investor_letters_updated_at
  before update on investor_letters
  for each row
  execute function set_updated_at();

alter table investor_letters enable row level security;

create policy "authenticated_read_investor_letters" on investor_letters
  for select using (auth.uid() is not null);

create policy "authenticated_insert_investor_letters" on investor_letters
  for insert with check (auth.uid() is not null);

create policy "authenticated_update_investor_letters" on investor_letters
  for update using (auth.uid() is not null);

create policy "authenticated_delete_investor_letters" on investor_letters
  for delete using (auth.uid() is not null);


-- ─── 4. Seed: Bill Ackman / Pershing Square ───────────────────
-- First investor built out end-to-end (design reference for the rest).

-- Yearly returns 2021-2025 — same figures already shown on the Ackman
-- card today (INVESTORS['ackman'].returns in js/portal-data.js, which
-- covers 2019-2025; this seed takes just the last 5 years).
insert into investor_yearly_returns (investor_key, year, return_pct) values
  ('ackman', 2021, 22.9),
  ('ackman', 2022, -7.8),
  ('ackman', 2023, 20.8),
  ('ackman', 2024, 8.2),
  ('ackman', 2025, 18.3);

-- Top holdings — only 2025 is seeded (matches INVESTORS['ackman'].holdings,
-- i.e. real, current data). 2021-2024 are intentionally left empty: we
-- don't have Pershing Square's actual historical 13F top holdings on
-- file, and the UI shows "no holdings on file" for those years rather
-- than invented numbers. Fill them in from real 13F filings later.
insert into investor_yearly_holdings (investor_key, year, ticker, company_name, weight_pct, rank) values
  ('ackman', 2025, 'BN',   'Brookfield Corp',      18.15, 1),
  ('ackman', 2025, 'UBER', 'Uber Technologies',    15.9,  2),
  ('ackman', 2025, 'AMZN', 'Amazon.com',           14.28, 3),
  ('ackman', 2025, 'GOOG', 'Alphabet Cl C',        12.46, 4),
  ('ackman', 2025, 'META', 'Meta Platforms',       11.37, 5);

-- Investor letters — real, verified links from pershingsquareholdings.com
-- (Pershing Square Holdings, Ltd. is Bill Ackman's publicly-listed fund).
insert into investor_letters (investor_key, year, title, category, date, type, url, sort_order) values
  ('ackman', 2025, '2025 Annual Report',       'annual_letter',    '2026-02-18', 'link', 'https://assets.pershingsquareholdings.com/wp-content/uploads/2026/02/18175039/Pershing-Square-Holdings-Ltd.-2025-Annual-Report.pdf', 1),
  ('ackman', 2024, '2024 Annual Report',       'annual_letter',    '2025-03-14', 'link', 'https://assets.pershingsquareholdings.com/2025/03/14183709/Pershing-Square-Holdings-Ltd.-2024-Annual-Report-1.pdf', 2),
  ('ackman', 2023, '2023 Annual Report',       'annual_letter',    '2024-03-22', 'link', 'https://assets.pershingsquareholdings.com/2024/03/22201541/Pershing-Square-Holdings-Ltd.-2023-Annual-Report.pdf', 3),
  ('ackman', 2022, '2022 Annual Report',       'annual_letter',    '2023-03-29', 'link', 'https://assets.pershingsquareholdings.com/2023/03/29160536/Pershing-Square-Holdings-Ltd.-2022-Annual-Report.pdf', 4),
  ('ackman', 2021, '2021 Annual Report',       'annual_letter',    '2022-03-29', 'link', 'https://assets.pershingsquareholdings.com/2022/03/29140526/Pershing-Square-Holdings-Ltd.-2021-Annual-Report.pdf', 5),
  ('ackman', 2025, 'June 2025 Interim Report', 'investor_message', '2025-06-30', 'link', 'https://assets.pershingsquareholdings.com/wp-content/uploads/2025/08/20192925/Pershing-Square-Holdings-Ltd.-June-2025-Interim.pdf', 10);
