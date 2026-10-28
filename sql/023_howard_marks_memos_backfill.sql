-- ============================================================
-- Research Summit — Howard Marks / Oaktree memos backfill
-- Run this in the Supabase SQL Editor AFTER 022_investor_meta.sql
--
-- Howard Marks is resources-only -- no AUM, 13F holdings, or return
-- series tracked (Oaktree is a credit shop, not a 13F equity filer in
-- the same sense as the tracked Superinvestors). Shows up in Hedge
-- Funds -> Superinvestors -> Resources only, via the RES_ONLY_FUNDS
-- entry in js/hedge-funds.js:
--   { key: 'marks', name: 'Howard Marks', fund: 'Oaktree Capital Management' }
-- Also insert that as a row in investor_meta so it survives even if
-- RES_ONLY_FUNDS is ever pruned:
--   insert into investor_meta (key, name, fund) values
--     ('marks', 'Howard Marks', 'Oaktree Capital Management');
--
-- Every memo from 2021 through the most recent one on file, sourced
-- directly from oaktreecapital.com/insights/memos (Oaktree's own
-- archive -- verified 2026-08-27). Titles/dates spot-checked against
-- the individual memo pages for the newest (Apr 2026), oldest (Jan
-- 2021), and "Sea Change" (Dec 2022, the best-known one) -- all three
-- matched exactly. Categorized as investor_message throughout: these
-- are periodic essays on an irregular schedule, not fiscal-year
-- shareholder/annual reports.
-- ============================================================

insert into investor_meta (key, name, fund) values
  ('marks', 'Howard Marks', 'Oaktree Capital Management')
on conflict (key) do nothing;

insert into investor_letters (investor_key, year, title, category, date, type, url, sort_order) values
  ('marks', 2026, 'What''s Going on in Private Credit?', 'investor_message', '2026-04-09', 'link', 'https://www.oaktreecapital.com/insights/memo/whats-going-on-in-private-credit', 1),
  ('marks', 2026, 'AI Hurtles Ahead', 'investor_message', '2026-02-26', 'link', 'https://www.oaktreecapital.com/insights/memo/ai-hurtles-ahead', 2),
  ('marks', 2025, 'Is It a Bubble?', 'investor_message', '2025-12-09', 'link', 'https://www.oaktreecapital.com/insights/memo/is-it-a-bubble', 3),
  ('marks', 2025, 'Cockroaches in the Coal Mine', 'investor_message', '2025-11-06', 'link', 'https://www.oaktreecapital.com/insights/memo/cockroaches-in-the-coal-mine', 4),
  ('marks', 2025, 'A Look Under the Hood', 'investor_message', '2025-10-28', 'link', 'https://www.oaktreecapital.com/insights/memo/a-look-under-the-hood', 5),
  ('marks', 2025, 'The Best of . . .', 'investor_message', '2025-10-12', 'link', 'https://www.oaktreecapital.com/insights/memo/the-best-of', 6),
  ('marks', 2025, 'The Calculus of Value', 'investor_message', '2025-08-14', 'link', 'https://www.oaktreecapital.com/insights/memo/the-calculus-of-value', 7),
  ('marks', 2025, 'More on Repealing the Laws of Economics', 'investor_message', '2025-06-18', 'link', 'https://www.oaktreecapital.com/insights/memo/more-on-repealing-the-laws-of-economics', 8),
  ('marks', 2025, 'Nobody Knows (Yet Again)', 'investor_message', '2025-04-09', 'link', 'https://www.oaktreecapital.com/insights/memo/nobody-knows-yet-again', 9),
  ('marks', 2025, 'Gimme Credit', 'investor_message', '2025-03-06', 'link', 'https://www.oaktreecapital.com/insights/memo/gimme-credit', 10),
  ('marks', 2025, 'On Bubble Watch', 'investor_message', '2025-01-07', 'link', 'https://www.oaktreecapital.com/insights/memo/on-bubble-watch', 11),
  ('marks', 2024, 'Ruminating on Asset Allocation', 'investor_message', '2024-10-22', 'link', 'https://www.oaktreecapital.com/insights/memo/ruminating-on-asset-allocation', 12),
  ('marks', 2024, 'Shall We Repeal the Laws of Economics?', 'investor_message', '2024-09-19', 'link', 'https://www.oaktreecapital.com/insights/memo/shall-we-repeal-the-laws-of-economics', 13),
  ('marks', 2024, 'Mr. Market Miscalculates', 'investor_message', '2024-08-22', 'link', 'https://www.oaktreecapital.com/insights/memo/mr-market-miscalculates', 14),
  ('marks', 2024, 'The Folly of Certainty', 'investor_message', '2024-07-17', 'link', 'https://www.oaktreecapital.com/insights/memo/the-folly-of-certainty', 15),
  ('marks', 2024, 'The Impact of Debt', 'investor_message', '2024-05-08', 'link', 'https://www.oaktreecapital.com/insights/memo/the-impact-of-debt', 16),
  ('marks', 2024, 'The Indispensability of Risk', 'investor_message', '2024-04-17', 'link', 'https://www.oaktreecapital.com/insights/memo/the-indispensability-of-risk', 17),
  ('marks', 2024, 'Easy Money', 'investor_message', '2024-01-09', 'link', 'https://www.oaktreecapital.com/insights/memo/easy-money', 18),
  ('marks', 2023, 'Further Thoughts on Sea Change', 'investor_message', '2023-10-11', 'link', 'https://www.oaktreecapital.com/insights/memo/further-thoughts-on-sea-change', 19),
  ('marks', 2023, 'Fewer Losers, or More Winners?', 'investor_message', '2023-09-12', 'link', 'https://www.oaktreecapital.com/insights/memo/fewer-losers-or-more-winners', 20),
  ('marks', 2023, 'Taking the Temperature', 'investor_message', '2023-07-10', 'link', 'https://www.oaktreecapital.com/insights/memo/taking-the-temperature', 21),
  ('marks', 2023, 'Lessons from Silicon Valley Bank', 'investor_message', '2023-04-17', 'link', 'https://www.oaktreecapital.com/insights/memo/lessons-from-silicon-valley-bank', 22),
  ('marks', 2022, 'Sea Change', 'investor_message', '2022-12-13', 'link', 'https://www.oaktreecapital.com/insights/memo/sea-change', 23),
  ('marks', 2022, 'What Really Matters?', 'investor_message', '2022-11-22', 'link', 'https://www.oaktreecapital.com/insights/memo/what-really-matters', 24),
  ('marks', 2022, 'The Illusion of Knowledge', 'investor_message', '2022-09-08', 'link', 'https://www.oaktreecapital.com/insights/memo/the-illusion-of-knowledge', 25),
  ('marks', 2022, 'I Beg to Differ', 'investor_message', '2022-07-26', 'link', 'https://www.oaktreecapital.com/insights/memo/i-beg-to-differ', 26),
  ('marks', 2022, 'Conversation at Panmure House', 'investor_message', '2022-06-23', 'link', 'https://www.oaktreecapital.com/insights/memo/conversation-at-panmure-house', 27),
  ('marks', 2022, 'Bull Market Rhymes', 'investor_message', '2022-05-26', 'link', 'https://www.oaktreecapital.com/insights/memo/bull-market-rhymes', 28),
  ('marks', 2022, 'The Pendulum in International Affairs', 'investor_message', '2022-03-23', 'link', 'https://www.oaktreecapital.com/insights/memo/the-pendulum-in-international-affairs', 29),
  ('marks', 2022, 'Selling Out', 'investor_message', '2022-01-13', 'link', 'https://www.oaktreecapital.com/insights/memo/selling-out', 30),
  ('marks', 2021, 'The Winds of Change', 'investor_message', '2021-11-23', 'link', 'https://www.oaktreecapital.com/insights/memo/the-winds-of-change', 31),
  ('marks', 2021, 'Thinking About Macro', 'investor_message', '2021-07-29', 'link', 'https://www.oaktreecapital.com/insights/memo/thinking-about-macro', 32),
  ('marks', 2021, '2020 in Review', 'investor_message', '2021-03-04', 'link', 'https://www.oaktreecapital.com/insights/memo/2020-in-review', 33),
  ('marks', 2021, 'Something of Value', 'investor_message', '2021-01-11', 'link', 'https://www.oaktreecapital.com/insights/memo/something-of-value', 34);
