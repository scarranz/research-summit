-- ============================================================
-- Research Summit — Superinvestor Resources backfill (Altimeter, Dorsey)
-- Run this in the Supabase SQL Editor AFTER 017_klarman_13f_backfill.sql
--
-- Researched 2026-08-14: of the 8 investors added in 014/015 who still
-- had no Resources on their detail page (tepper, druckenmiller, coleman,
-- hohn, altimeter, dorsey), only two turned out to have anything real,
-- public, and stably hosted to link to:
--
--   - altimeter (Brad Gerstner): no LP-letter cadence, but his October
--     2022 open letter to Meta/Zuckerberg is public and posted by
--     Gerstner himself on his own Medium account (@alt.cap).
--   - dorsey (Pat Dorsey): no LP letters either, but dorseyasset.com
--     runs a real "Publications & Commentary" page with PDFs hosted
--     directly on their own domain.
--
-- Everyone else was checked and deliberately left out:
--   - tepper (Appaloosa), druckenmiller (Duquesne), coleman (Tiger
--     Global): no official public-facing letters exist at all — these
--     firms don't publish; what circulates is third-party leaks/
--     aggregator reposts, not something to link from here.
--   - hohn (TCI): does send public activist letters (e.g. to Alphabet's
--     Sundar Pichai, Nov 2022), but tcifund.com blocks automated
--     fetches and no stable first-party PDF host was found in the time
--     budgeted for this — worth revisiting by hand later.
--   - klarman (Baupost): explicitly confidential, LP-only by Baupost's
--     own distribution terms. What's on Scribd/etc. are leaks — do not
--     link these here regardless of how easy they are to find.
--
-- UPDATE 2026-08-21: the note above (that the Third Point vehicle "is no
-- longer a Third Point vehicle" post-merger) turned out to be incomplete.
-- Re-verified today: Malibu Life Holdings Limited (LSE: MLHL, formerly
-- Third Point Investors Limited) still allocates to Third Point Offshore
-- Fund and still publishes Daniel Loeb's real quarterly investor letters
-- -- Q1 2026 and Q2 2026 letters were fetched directly and confirmed live
-- (assets-malibu-life.s3.us-west-2.amazonaws.com, PDF metadata dated
-- 2026-04-10), and a separate Malibu Life RNS ("Third Point Master Fund
-- February 2026 Performance") corroborates the fund is still reporting
-- Third Point performance under the MLHL banner. thirdpointlimited.com
-- itself is stale/redirects, but malibu-life's own asset host is not --
-- see the loeb rows below.
-- ============================================================

insert into investor_letters (investor_key, year, title, category, date, type, url, sort_order) values
  ('altimeter', 2022, 'Time to Get Fit -- Open Letter to Meta', 'investor_message', '2022-10-24', 'link', 'https://medium.com/@alt.cap/time-to-get-fit-an-open-letter-from-altimeter-to-mark-zuckerberg-and-the-meta-board-of-392d94e80a18', 1),

  ('dorsey', 2026, 'Ten Lessons from Ten Years', 'investor_message', '2026-05-31', 'link', 'https://dorseyasset.com/wp-content/uploads/2026/06/ten-lessons-from-ten-years_pat-dorsey_good-investing_20260531.pdf', 1),
  ('dorsey', 2026, 'Competitive Advantage and Capital Allocation', 'investor_message', '2026-06-01', 'link', 'https://dorseyasset.com/wp-content/uploads/2026/06/competitive-advantage-and-capital-allocation_dorsey-asset-management_june-2026.pdf', 2),
  ('dorsey', 2026, 'Maximizing Moats: Reinvestment Runways & Capital Allocation', 'investor_message', '2026-06-01', 'link', 'https://dorseyasset.com/wp-content/uploads/2026/06/maximizing-moats_reinvestment-runways-capital-allocation_june-2026.pdf', 3),

  ('loeb', 2026, 'Q2 2026 Investor Letter', 'investor_message', '2026-07-31', 'link', 'https://assets-malibu-life.s3.us-west-2.amazonaws.com/system/uploads/fae/file/asset/1713/Third_Point_Q2_2026_Investor_Letter_MLHL.pdf', 1),
  ('loeb', 2026, 'Q1 2026 Investor Letter', 'investor_message', '2026-04-10', 'link', 'https://assets-malibu-life.s3.us-west-2.amazonaws.com/system/uploads/fae/file/asset/1696/Third_Point_Q1_2026_Investor_Letter_MLHL.pdf', 2),
  ('loeb', 2025, 'Q4 2025 Investor Letter', 'investor_message', '2026-02-24', 'link', 'https://assets-malibu-life.s3.us-west-2.amazonaws.com/system/uploads/fae/file/asset/1689/Third_Point_Q4_2025_Investor_Letter_TPIL.pdf', 3),
  ('loeb', 2025, 'Q3 2025 Investor Letter', 'investor_message', '2025-11-03', 'link', 'https://assets-malibu-life.s3.us-west-2.amazonaws.com/system/uploads/fae/file/asset/1673/Third_Point_Q3_2025_Investor_Letter_TPIL.pdf', 4),
  ('loeb', 2024, '2024 Annual Report and Audited Financial Statements', 'annual_letter', '2025-04-01', 'link', 'https://assets.thirdpointlimited.com/f/166217/x/1453295197/third-point-investors-limited-2024-annual-report-and-audited-financial-statements.pdf', 5),
  ('loeb', 2023, '2023 Annual Report and Audited Financial Statements', 'annual_letter', '2024-04-01', 'link', 'https://assets.thirdpointlimited.com/f/166217/x/2cd31da5fc/tpil-annual-afs-31-12-2023-final.pdf', 6);
