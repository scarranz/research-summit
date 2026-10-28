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

-- Yearly returns 2021-2025 — same figures already shown on each investor's
-- card today (INVESTORS[key].returns in js/portal-data.js, which covers
-- 2019-2025; this seed takes just the last 5 years, mirroring
-- js/investor-local-seed.js's LOCAL_INVESTOR_RETURNS). Dorsey Asset
-- Management has no annual return series on file (fund doesn't disclose),
-- so it has no rows here — its year pills correctly show "n/a".
insert into investor_yearly_returns (investor_key, year, return_pct) values
  ('ackman', 2021, 22.9),
  ('ackman', 2022, -7.8),
  ('ackman', 2023, 20.8),
  ('ackman', 2024, 8.2),
  ('ackman', 2025, 18.3),
  ('buffett', 2021, 29.6),
  ('buffett', 2022, 4.0),
  ('buffett', 2023, 15.8),
  ('buffett', 2024, 27.21),
  ('buffett', 2025, 10.89),
  ('tepper', 2021, 14.0),
  ('tepper', 2022, -6.0),
  ('tepper', 2023, 25.0),
  ('tepper', 2024, 11.0),
  ('tepper', 2025, 6.0),
  ('druckenmiller', 2021, 22.0),
  ('druckenmiller', 2022, -6.0),
  ('druckenmiller', 2023, 25.0),
  ('druckenmiller', 2024, 21.0),
  ('druckenmiller', 2025, 17.0),
  ('coleman', 2021, 15.0),
  ('coleman', 2022, -58.0),
  ('coleman', 2023, 40.0),
  ('coleman', 2024, 21.0),
  ('coleman', 2025, 16.5),
  ('hohn', 2021, 35.0),
  ('hohn', 2022, -20.0),
  ('hohn', 2023, 33.0),
  ('hohn', 2024, 30.0),
  ('hohn', 2025, 24.0),
  ('altimeter', 2021, 30.0),
  ('altimeter', 2022, -58.0),
  ('altimeter', 2023, 65.0),
  ('altimeter', 2024, 25.0),
  ('altimeter', 2025, 18.0),
  ('loeb', 2021, 22.5),
  ('loeb', 2022, -21.9),
  ('loeb', 2023, 3.3),
  ('loeb', 2024, 24.2),
  ('loeb', 2025, 8.9),
  ('klarman', 2021, 12.0),
  ('klarman', 2022, -3.0),
  ('klarman', 2023, 4.0),
  ('klarman', 2024, 10.0),
  ('klarman', 2025, 6.0)
on conflict do nothing;

-- Top holdings — real Pershing Square Capital Management 13F-HR filings
-- (SEC EDGAR CIK 0001336528), pulled and parsed straight from each
-- quarter's infotable.xml (same format the "Upload 13F" flow accepts):
--   Q2 2025 (as of 2025-06-30, filed 2025-08-14) — accession 0001172661-25-003509
--   Q3 2025 (as of 2025-09-30, filed 2025-11-14) — accession 0001172661-25-005039
--   Q4 2025 (as of 2025-12-31, filed 2026-02-17) — accession 0001172661-26-001091
--   Q1 2026 (as of 2026-03-31, filed 2026-05-15) — accession 0001172661-26-002336
-- Four consecutive real quarters, so the Holdings Comparison view shows
-- genuine buy/sell/new/exit activity (e.g. META entering in Q4 2025,
-- MSFT entering and GOOG/GOOGL nearly fully exited in Q1 2026).
insert into investor_yearly_holdings (investor_key, year, quarter, ticker, company_name, cusip, value_usd, weight_pct, rank, source_type) values
  ('ackman', 2025, 2, 'UBER',  'Uber Technologies Inc',      '90353T100', 2827098321, 20.59, 1,  'sec_xml'),
  ('ackman', 2025, 2, 'BN',    'Brookfield Corp',            '11271J107', 2545770554, 18.54, 2,  'sec_xml'),
  ('ackman', 2025, 2, 'QSR',   'Restaurant Brands Intl Inc', '76131D103', 1524730589, 11.11, 3,  'sec_xml'),
  ('ackman', 2025, 2, 'AMZN',  'Amazon Com Inc',              '023135106', 1277577297, 9.31,  4,  'sec_xml'),
  ('ackman', 2025, 2, 'HHH',   'Howard Hughes Holdings Inc', '44267T102', 1272514320, 9.27,  5,  'sec_xml'),
  ('ackman', 2025, 2, 'CMG',   'Chipotle Mexican Grill Inc', '169656105', 1209537089, 8.81,  6,  'sec_xml'),
  ('ackman', 2025, 2, 'GOOG',  'Alphabet Inc',                '02079K107', 1121819859, 8.17,  7,  'sec_xml'),
  ('ackman', 2025, 2, 'GOOGL', 'Alphabet Inc',                '02079K305', 945117965,  6.88,  8,  'sec_xml'),
  ('ackman', 2025, 2, 'HLT',   'Hilton Worldwide Hldgs Inc',  '43300A203', 807164145,  5.88,  9,  'sec_xml'),
  ('ackman', 2025, 2, 'HTZ',   'Hertz Global Hldgs Inc',      '42806J700', 104096897,  0.76,  10, 'sec_xml'),
  ('ackman', 2025, 2, 'SEG',   'Seaport Entmt Group Inc',     '812215200', 93693497,   0.68,  11, 'sec_xml'),

  ('ackman', 2025, 3, 'UBER',  'Uber Technologies Inc',       '90353T100', 2965602648, 20.25, 1,  'sec_xml'),
  ('ackman', 2025, 3, 'BN',    'Brookfield Corp',             '11271J107', 2813167442, 19.21, 2,  'sec_xml'),
  ('ackman', 2025, 3, 'HHH',   'Howard Hughes Holdings Inc',  '44267T102', 1549074099, 10.58, 3,  'sec_xml'),
  ('ackman', 2025, 3, 'GOOG',  'Alphabet Inc',                '02079K107', 1540217750, 10.52, 4,  'sec_xml'),
  ('ackman', 2025, 3, 'QSR',   'Restaurant Brands Intl Inc',  '76131D103', 1469799913, 10.04, 5,  'sec_xml'),
  ('ackman', 2025, 3, 'AMZN',  'Amazon Com Inc',              '023135106', 1278625494, 8.73,  6,  'sec_xml'),
  ('ackman', 2025, 3, 'GOOGL', 'Alphabet Inc',                '02079K305', 1177569836, 8.04,  7,  'sec_xml'),
  ('ackman', 2025, 3, 'CMG',   'Chipotle Mexican Grill Inc',  '169656105', 844198727,  5.77,  8,  'sec_xml'),
  ('ackman', 2025, 3, 'HLT',   'Hilton Worldwide Hldgs Inc',  '43300A203', 786253156,  5.37,  9,  'sec_xml'),
  ('ackman', 2025, 3, 'SEG',   'Seaport Entmt Group Inc',     '812215200', 115145038,  0.79,  10, 'sec_xml'),
  ('ackman', 2025, 3, 'HTZ',   'Hertz Global Hldgs Inc',      '42806J700', 103639664,  0.71,  11, 'sec_xml'),

  ('ackman', 2025, 4, 'BN',    'Brookfield Corp',             '11271J107', 2817787754, 18.15, 1,  'sec_xml'),
  ('ackman', 2025, 4, 'UBER',  'Uber Technologies Inc',       '90353T100', 2468273945, 15.9,  2,  'sec_xml'),
  ('ackman', 2025, 4, 'AMZN',  'Amazon Com Inc',              '023135106', 2217677936, 14.28, 3,  'sec_xml'),
  ('ackman', 2025, 4, 'GOOG',  'Alphabet Inc',                '02079K107', 1934222720, 12.46, 4,  'sec_xml'),
  ('ackman', 2025, 4, 'META',  'Meta Platforms Inc',          '30303M102', 1764796161, 11.37, 5,  'sec_xml'),
  ('ackman', 2025, 4, 'QSR',   'Restaurant Brands Intl Inc',  '76131D103', 1560199922, 10.05, 6,  'sec_xml'),
  ('ackman', 2025, 4, 'HHH',   'Howard Hughes Holdings Inc',  '44267T102', 1503829145, 9.69,  7,  'sec_xml'),
  ('ackman', 2025, 4, 'HLT',   'Hilton Worldwide Hldgs Inc',  '43300A203', 869983734,  5.6,   8,  'sec_xml'),
  ('ackman', 2025, 4, 'GOOGL', 'Alphabet Inc',                '02079K305', 212306961,  1.37,  9,  'sec_xml'),
  ('ackman', 2025, 4, 'SEG',   'Seaport Entmt Group Inc',     '812215200', 99320131,   0.64,  10, 'sec_xml'),
  ('ackman', 2025, 4, 'HTZ',   'Hertz Global Hldgs Inc',      '42806J700', 78339393,   0.5,   11, 'sec_xml'),

  ('ackman', 2026, 1, 'BN',    'Brookfield Corp',             '11271J107', 2415946008, 17.62, 1,  'sec_xml'),
  ('ackman', 2026, 1, 'AMZN',  'Amazon Com Inc',              '023135106', 2385104083, 17.39, 2,  'sec_xml'),
  ('ackman', 2026, 1, 'UBER',  'Uber Technologies Inc',       '90353T100', 2154934398, 15.71, 3,  'sec_xml'),
  ('ackman', 2026, 1, 'MSFT',  'Microsoft Corp',              '594918104', 2092970053, 15.26, 4,  'sec_xml'),
  ('ackman', 2026, 1, 'QSR',   'Restaurant Brands Intl Inc',  '76131D103', 1673501194, 12.2,  5,  'sec_xml'),
  ('ackman', 2026, 1, 'META',  'Meta Platforms Inc',          '30303M102', 1522358404, 11.1,  6,  'sec_xml'),
  ('ackman', 2026, 1, 'HHH',   'Howard Hughes Holdings Inc',  '44267T102', 1192581569, 8.7,   7,  'sec_xml'),
  ('ackman', 2026, 1, 'SEG',   'Seaport Entmt Group Inc',     '812215200', 107910794,  0.79,  8,  'sec_xml'),
  ('ackman', 2026, 1, 'GOOG',  'Alphabet Inc',                '02079K107', 89421720,   0.65,  9,  'sec_xml'),
  ('ackman', 2026, 1, 'HTZ',   'Hertz Global Hldgs Inc',      '42806J700', 70261595,   0.51,  10, 'sec_xml'),
  ('ackman', 2026, 1, 'GOOGL', 'Alphabet Inc',                '02079K305', 9310043,    0.07,  11, 'sec_xml');

-- Investor letters — real, verified links from pershingsquareholdings.com
-- (Pershing Square Holdings, Ltd. is Bill Ackman's publicly-listed fund).
insert into investor_letters (investor_key, year, title, category, date, type, url, sort_order) values
  ('ackman', 2025, '2025 Annual Report',       'annual_letter',    '2026-02-18', 'link', 'https://assets.pershingsquareholdings.com/wp-content/uploads/2026/02/18175039/Pershing-Square-Holdings-Ltd.-2025-Annual-Report.pdf', 1),
  ('ackman', 2024, '2024 Annual Report',       'annual_letter',    '2025-03-14', 'link', 'https://assets.pershingsquareholdings.com/2025/03/14183709/Pershing-Square-Holdings-Ltd.-2024-Annual-Report-1.pdf', 2),
  ('ackman', 2023, '2023 Annual Report',       'annual_letter',    '2024-03-22', 'link', 'https://assets.pershingsquareholdings.com/2024/03/22201541/Pershing-Square-Holdings-Ltd.-2023-Annual-Report.pdf', 3),
  ('ackman', 2022, '2022 Annual Report',       'annual_letter',    '2023-03-29', 'link', 'https://assets.pershingsquareholdings.com/2023/03/29160536/Pershing-Square-Holdings-Ltd.-2022-Annual-Report.pdf', 4),
  ('ackman', 2021, '2021 Annual Report',       'annual_letter',    '2022-03-29', 'link', 'https://assets.pershingsquareholdings.com/2022/03/29140526/Pershing-Square-Holdings-Ltd.-2021-Annual-Report.pdf', 5),
  ('ackman', 2025, 'June 2025 Interim Report', 'investor_message', '2025-06-30', 'link', 'https://assets.pershingsquareholdings.com/wp-content/uploads/2025/08/20192925/Pershing-Square-Holdings-Ltd.-June-2025-Interim.pdf', 10);
