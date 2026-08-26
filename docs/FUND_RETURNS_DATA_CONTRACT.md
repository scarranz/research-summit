# Return Analysis — data contract

What feeds the **Return Analysis** tab, who owns each piece, and the rules that
keep the numbers honest. Read this before changing anything about where the
tab's data comes from.

---

## 1. The series is two halves

The tab draws one continuous daily return series per portfolio, assembled at
page load from two sources that never overlap:

| Half | Range | Lives in | Owner |
|---|---|---|---|
| **Frozen history** | before `2026-01-01` | `js/fund-history-data.js` (committed) | closed — do not edit |
| **Live** | `2026-01-01` onward | `portfolio_daily_returns` in Supabase | the daily T-1 job |

The seam is the constant `HISTORY_CUTOFF` in `js/fund-portfolios.js`. It is a
**hard cut with no overlap zone**: the history file is authoritative strictly
before it, the database strictly on and after it. There is never a question
about which source produced a given day.

A portfolio with no history simply has no entry in the history file. Nothing to
backfill — the splice just starts at its first live day.

### The fallback

`js/fund-live-seed.js` is a temporary stand-in for the live half: the same CSV
shape, committed, read **only when the database has nothing** for that
portfolio. `js/fund-data.js` asks the database first, every time.

This is not a migration step anyone has to remember to undo. The day
`portfolio_daily_returns` is populated, the database wins on its own and the
seed stops being read. It stays afterwards as the degradation path: if the feed
is late or unreachable, the tab shows a slightly stale series instead of a blank
page.

---

## 2. What the daily job must write

Schema: `sql/021_return_analysis.sql`. Column names match the export the
portfolio system already produces, so no mapping is needed.

```
portfolio_daily_returns (portfolio_id, date, daily_return, beta)
```

- **One row per portfolio per trading day**, `date >= 2026-01-01`.
- `daily_return` as a **decimal**, not a percent (`0.0123` = +1.23%).
- `beta` is the portfolio's beta that day. It may be null; the "Beta Ante"
  metric shows a dash for days that lack it and every other figure still works.
- Upsert on `(portfolio_id, date)`. **Never plain-insert.** A duplicated day
  compounds twice and silently overstates the track record — the composite
  primary key is what prevents that, so let it do its job.
- A gap after an outage is fixed by re-running those dates. The job is
  idempotent by construction.

`portfolios.code` is the join key with the front end. It must match an entry in
`js/fund-portfolios.js` (today: `summit`) or the portal will not find the
portfolio and will quietly fall back to the seed.

### Why the front end never stores database ids

The repo is **public**. `js/fund-portfolios.js` carries only `code` and a
display label; the portfolio's real id and name live in the database and are
looked up at runtime. Keep it that way when adding portfolios.

---

## 3. The benchmark is a second feed

Easy to overlook: the benchmark has to stay current too. The frozen history
carries its benchmark column inline, so before 2026 this was one file. From 2026
it is two independent jobs, and **the tab is only as current as the older of the
two** — a day with a portfolio return but no benchmark close is dropped, because
every relative figure (alpha, capture, correlation, beta) needs both sides.

| Feed | Source | Table |
|---|---|---|
| Portfolio daily returns | the portfolio system | `portfolio_daily_returns` |
| Benchmark daily closes | Massive, `GET /v2/aggs/ticker/{sym}/range/1/day/{from}/{to}` | `benchmark_prices` |

We store **closes, not returns**, and derive returns close-to-close in
`js/fund-data.js`. Two reasons: a re-run cannot corrupt a return that depends on
its neighbour, and it is the same method that produced the frozen history's
benchmark column — verified to reproduce it to the digit over the Dec-2025 days
where the two overlap.

Two things to get right when writing that job:

- **Fetch from ~10 days before the first date you need.** A return needs the
  prior close; without an anchor the first day of the range has none.
- **Take the UTC date of the bar's timestamp.** Massive stamps daily bars at
  midnight ET, which is 04:00 or 05:00 UTC depending on daylight saving. Applying
  a fixed `-05:00` offset shifts every summer bar back a day and lands trading
  days on Sundays.

---

## 4. The 2026 basis change — read this before quoting a number

The frozen 2022–2025 history and the live series **are not computed on the same
basis**. The history is a spliced composite; the live series is one portfolio.
Over the 64 trading days where the two overlap (Oct–Dec 2025) they are 99.25%
correlated but **no single day is identical**, and the quarter compounds to
−5.39% on the live basis versus −3.31% on the frozen one — a gap of ~208bp.

**Decision: splice at 2026-01-01, do not restate the overlap.** The 2022–2025
figures have already circulated and are the ones the team knows; silently moving
them would be worse than a documented change of basis.

What that means in practice:

- The daily chain stays continuous — these are returns, so nothing jumps
  visually at the seam.
- Any figure spanning the seam (Overall, Annualized, a multi-year rolling
  window) mixes the two bases. That is acceptable and expected, but it is why
  this section exists: if someone asks why the annualized number moved, this is
  the answer.
- Do not "fix" it by regenerating the history file from the live source. That
  would change published 2025 numbers.

---

## 5. Who owns what

| Piece | Owner |
|---|---|
| `sql/021_return_analysis.sql` — run it | San / Oscar (only they run SQL) |
| Daily portfolio return load | Oscar |
| Benchmark sync job + schedule | San / Oscar (needs Supabase + secrets) |
| Front end, splice logic, calc engine | whoever is building the tab |
| `js/fund-history-data.js` | nobody — closed |

Team members without Supabase access never load data by hand; they ask for a
change and it goes through a PR.
