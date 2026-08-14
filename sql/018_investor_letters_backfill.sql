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
-- loeb (Third Point) is a special case, not a "nothing found": the
-- vehicle that used to publish Third Point's public quarterly letters,
-- Third Point Investors Limited (LSE: TPOU), completed a reverse
-- merger with Malibu Life Reinsurance in Sept 2025 and renamed itself
-- Malibu Life Holdings Limited (LSE: MLHL) — it is no longer a Third
-- Point vehicle. thirdpointlimited.com now redirects to
-- malibulifeinsurance.com. Any Third-Point-branded PDFs still showing
-- up in search results live on that same (now unrelated) infra and
-- should not be linked here as if they were Daniel Loeb's own investor
-- relations page.
-- ============================================================

insert into investor_letters (investor_key, year, title, category, date, type, url, sort_order) values
  ('altimeter', 2022, 'Time to Get Fit -- Open Letter to Meta', 'investor_message', '2022-10-24', 'link', 'https://medium.com/@alt.cap/time-to-get-fit-an-open-letter-from-altimeter-to-mark-zuckerberg-and-the-meta-board-of-392d94e80a18', 1),

  ('dorsey', 2026, 'Ten Lessons from Ten Years', 'investor_message', '2026-05-31', 'link', 'https://dorseyasset.com/wp-content/uploads/2026/06/ten-lessons-from-ten-years_pat-dorsey_good-investing_20260531.pdf', 1),
  ('dorsey', 2026, 'Competitive Advantage and Capital Allocation', 'investor_message', '2026-06-01', 'link', 'https://dorseyasset.com/wp-content/uploads/2026/06/competitive-advantage-and-capital-allocation_dorsey-asset-management_june-2026.pdf', 2),
  ('dorsey', 2026, 'Maximizing Moats: Reinvestment Runways & Capital Allocation', 'investor_message', '2026-06-01', 'link', 'https://dorseyasset.com/wp-content/uploads/2026/06/maximizing-moats_reinvestment-runways-capital-allocation_june-2026.pdf', 3);
