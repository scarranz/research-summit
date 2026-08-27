-- ============================================================
-- Research Summit — Resources-only fund letters backfill
-- Run this in the Supabase SQL Editor AFTER 020_return_overrides_add_editor.sql
--
-- These two funds (Abrams Bison, Bristlemoon) are NOT Superinvestor
-- cards -- no AUM, 13F holdings, or return series is tracked for them.
-- They only show up in Hedge Funds -> Superinvestors -> Resources,
-- via the RES_ONLY_FUNDS list in js/hedge-funds.js (kept out of
-- js/portal-data.js on purpose -- that file is static reference data
-- for the grid and isn't touched for a resources-only addition).
--
-- BEFORE RUNNING THIS: the source PDFs were supplied directly by the
-- team (in the local "Hedge Funds Resources" folder, not committed to
-- git), not fetched from a public URL, so each needs to be uploaded to
-- Supabase Storage first (bucket 'company-files', reused from
-- company_resources per sql/014_investor_profiles.sql's convention),
-- renamed to the exact path referenced below -- e.g. via the Supabase
-- dashboard's Storage UI. These rows resolve to a working "Download"
-- link only once the file exists at that path.
--
--   local file                                              -> Storage path
--   abrams-bison-2008-q4-shareholder-letter.pdf              -> investors/abrams/abrams-bison-2008-q4-shareholder-letter.pdf (same name)
--   abrams-bison-2009-q4-shareholder-letter.pdf              -> investors/abrams/abrams-bison-2009-q4-shareholder-letter.pdf (same name)
--   Bristlemoon+Global+Fund+March+2026+Quarterly+Report+vF.pdf -> investors/bristlemoon/bristlemoon-global-fund-2026-q1-quarterly-report.pdf (renamed)
--
-- Gavin M. Abrams / Abrams Bison Investments: signed "Gavin M. Abrams"
-- in both letters -- not to be confused with David Abrams (Abrams
-- Capital Management), a different manager/fund.
--
-- Bristlemoon Capital / Bristlemoon Global Fund: no individual
-- manager's name appears anywhere in the report (signed "Kind regards,
-- Bristlemoon Capital"), so the firm name is used for both `name` (in
-- RES_ONLY_FUNDS) and here rather than guessing a person. The date
-- below is the quarter-end printed on the report (31 Mar 2026) -- the
-- document states no separate publish date.
-- ============================================================

insert into investor_letters (investor_key, year, title, category, date, type, url, sort_order) values
  ('abrams', 2008, '2008 Q4 Shareholder Letter', 'annual_letter', '2009-02-04', 'file', 'investors/abrams/abrams-bison-2008-q4-shareholder-letter.pdf', 1),
  ('abrams', 2009, '2009 Q4 Shareholder Letter', 'annual_letter', '2010-01-20', 'file', 'investors/abrams/abrams-bison-2009-q4-shareholder-letter.pdf', 2),

  ('bristlemoon', 2026, 'Q1 2026 Quarterly Report', 'investor_message', '2026-03-31', 'file', 'investors/bristlemoon/bristlemoon-global-fund-2026-q1-quarterly-report.pdf', 1);
