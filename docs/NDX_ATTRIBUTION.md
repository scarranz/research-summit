# NDX 100 Return Attribution — data, process and conventions

Market Analysis ▸ **Nasdaq-100 Analysis**. Read this before touching the data, the extractor,
the `ndx-attribution` edge function or `js/ndx-attribution.js`. It records what the analyst
(Dani) and Claude agreed while building it, so nobody has to rediscover it.

| Piece | Where |
|---|---|
| Source workbook | `G:\My Drive\Summit\Docs\Extras\Team\DAA\Ad hoc info search\NASDAQ 100 RETURNS\NASDAQ 100 2026 RETURNS.xlsx`, sheet **`NDX nonBBG`** |
| Extractor | `scripts/ndx/extract_ndx.py` |
| Stored data | Supabase table `ndx_snapshots` (`sql/025_ndx_attribution.sql`) |
| Edge function | `supabase/functions/ndx-attribution` |
| Bundled fallback | `js/ndx-attribution-data.js` (generated — never edit by hand) |
| Page | `js/ndx-attribution.js` (+ `css/ndx-attribution.css`), loaded by `js/market-analysis.js` |

---

## 1. Source: the `NDX nonBBG` sheet

Each row is one security inside one **HOC** (see §2). Rows start at **row 79**; the sheet is read
with cached values, so **the workbook must be saved after the Bloomberg refresh**.

| Col | Field | Notes |
|---|---|---|
| H | Rebalance effective date | HOC start |
| I | Prev close | the close the HOC's return is measured from |
| J | Closing HOC date | blank = the **open** HOC (still running) |
| K | Ticker | `AMGN US Equity` → `AMGN`; `… Index/Curncy/Corp/Comdty` → cash / futures line, stored with a leading `$` |
| L | Company name | |
| N | Weight for sector | the weight used everywhere (`w`) |
| O | Weight for industry | kept as `wi` |
| P | Snapshot open (prev close) price | `p0` |
| Q | Latest / close price | `p1` |
| R | Snapshot return | `r` = Q / P − 1 (decimal) |
| U | Industry sector (GICS 1) | `s` |
| V | Industry group (GICS 2) | `g`, normalised (§5.3) |

Weights come from Bloomberg's QQQ holdings (`holdings('QQQ US Equity', dates=…)`) and sum to 100 in
every HOC (cash / futures included).

## 2. HOCs and years

A **HOC** is a holdings period between two rebalances: constituents and opening weights are fixed at
`eff`; the return runs from `prev` (prev close) to `close`. The last HOC is **open** (`close` empty)
until the next rebalance.

**Year rule** (implemented in `deriveYears()`; no dates are hard-coded):

- A HOC belongs to the year of its `close`. The open HOC belongs to the year of its `prev` — or the
  next year if it starts from that year-end close (opened Dec 31, or Fri Dec 29 2028 when Dec 31 is
  a Sunday).
- Year **Y starts** with the HOC whose `prev` is the **year-end close of Y−1** = the last weekday of
  December (Dec 31 unless it falls on a weekend — 2022 closed Dec 30, 2023 closed Dec 29).
- Year **Y ends** with the HOC that closes on Y's year-end close. Until then it is **YTD**.
- A year that does not start at the previous year-end close is partial and is **left out** — that is
  the 8-day **Dec-2019 stub (HOC 1)**, which is useless for any calculation.

Resulting boundaries (as the analyst defined them, by HOC effective date):

| Year | HOC eff, first → last | HOCs |
|---|---|---|
| 2020 | 2019-12-31 → 2020-12-21 | 2–11 |
| 2021 | 2020-12-31 → 2021-12-20 | 12–18 |
| 2022 | 2021-12-31 → 2022-12-19 | 19–28 |
| 2023 | 2022-12-30 → 2023-12-18 | 29–37 |
| 2024 | 2023-12-29 → 2024-12-23 | 38–44 |
| 2025 | 2024-12-31 → 2025-12-22 | 45–54 |
| YTD 2026 | 2025-12-31 → open HOC (eff 2026-10-06) | 55–68 |

More or fewer HOCs per year make no difference (nothing counts them). Every dry run / upload of
the extractor prints the year table the page will build and flags a year that would be skipped or
left as YTD by mistake (e.g. a year-end HOC closing on Dec 30 when Dec 31 is a trading day) — read
it before uploading.

**2027 needs no code change**: when a HOC closes on the 2026 year-end close and a new one opens from
it, the next upload makes "2026" a closed year and adds "YTD 2027" to every year selector, the
returns table and every chart (tested with simulated data).

## 3. The math

- **HOC return** = Σ wᵢ·rᵢ (weights in %, so the result is in %).
- **Year return** = Π(1 + HOC return) − 1 (compounded).
- **Contributions** (sector, industry group, security) are **Carino-linked** so they add up exactly
  to the compounded year return: per HOC `kₜ = ln(1+Rₜ)/Rₜ`, overall `k = ln(1+R)/R`,
  contribution = Σₜ kₜ·cₜ / k.
- **Security return** (Ret%) = compounded return while the name was in the index during that year
  (full year for names held all year).
- **Close weight** = the last HOC's opening weights **drifted by each name's return to the HOC
  close**: wᵢ(1+rᵢ) / Σ wⱼ(1+rⱼ). The raw `w` is the weight at the *start* of the HOC; using it as
  a year-end weight left a visible gap between a year's close and the next year's open. Drifted,
  they match (IT 2020 close 44.0% = 2021 open 44.0%). For the open HOC the drift uses the latest
  prices ("Latest").
- **Simulation** (Attribution Detail): excluded sectors / groups are removed and the remaining
  weights rescaled to 100 within each HOC.

**Validation** — the yearly returns from the sheet tie to the official NDX price return:

| | 2020 | 2021 | 2022 | 2023 | 2024 |
|---|---|---|---|---|---|
| Sheet | 47.37% | 26.58% | −32.94% | 53.75% | 24.88% |
| Official NDX | 47.58% | 26.63% | −32.97% | 53.81% | 24.88% |

Re-check this after every full upload; a jump of more than a few tenths means something broke.

## 4. Pipeline (Supabase, no PR per refresh)

```
Excel (analyst) ──► scripts/ndx/extract_ndx.py --upload ──► ndx-attribution (ingest)
                                                              │ re-prices the open HOC (Massive)
                                                              ▼
                                         ndx_snapshots (one row per refresh, newest wins)
                                                              │ action 'get'
                                                              ▼
                                      js/ndx-attribution.js  (falls back to the bundled file)
```

- **Edge function `ndx-attribution`**
  - `get` — any signed-in user; returns the newest snapshot `{ meta, hocs }`.
  - `ingest` — full upload from the extractor; header `x-ndx-ingest-key` must equal the
    `NDX_INGEST_KEY` secret.
  - `refresh-prices` — same key; re-prices only the open HOC of the newest snapshot.
- **Prices**: closed HOCs keep the Excel returns (historical prices come from the analyst). The open
  HOC is re-priced at each upload / refresh: rᵢ = latest close ÷ close on the HOC's `prev` date − 1,
  both from Massive grouped daily bars (`adjusted=true`, split-safe; two calls for the whole index).
  Names Massive does not return keep their Excel return and are listed in `meta.priceMissing`.
- **Nothing changes until someone refreshes.** Older rows in `ndx_snapshots` are the history;
  rollback = delete the newer rows.
- **Fallback**: if the function fails, the page imports `js/ndx-attribution-data.js` and shows
  "bundled copy" under the title.
- **One-time setup (San / Oscar)**: run `sql/025_ndx_attribution.sql`; set the secret
  `supabase secrets set NDX_INGEST_KEY=<value> --project-ref bvflqjndivouhgwqfbrq` (same value as
  the analyst's gitignored `scripts/ndx/.ingest-key`); `supabase functions deploy ndx-attribution
  --project-ref bvflqjndivouhgwqfbrq`. Then run the first `--upload`.
- CORS follows the project rule (Netlify + `localhost:8000`); on any other local port the page
  shows the bundled copy.

## 5. Data quirks and how they are handled

### 5.1 Bloomberg dummy tickers (`<digits><letter>`, e.g. `9990294D`)

After a spin-off, merger, reverse split or ADR-ratio change, Bloomberg moves the security's old
history to a **dummy line** and re-adjusts the live ticker's history. Historical QQQ holdings can then
list **both lines in the same HOC** — the same stock twice, with identical returns but a different
price basis (e.g. SIRI 69.175 vs 9210611D 6.9175: the 2024 1:10 reverse split).

| Dummy | Real ticker | Company | Where | Why |
|---|---|---|---|---|
| `9990294D` | **LBTYA** | Liberty Global | HOC 1–2 | Liberty Global restructuring / spin-offs (class A line) |
| `9999794D` | **LBTYK** | Liberty Global | HOC 1–2 | same, class C line |
| `9210611D` | **SIRI** | Sirius XM | HOC 1–2 | pre-merger Sirius XM (2024 Liberty Media merger, 1:10 reverse split) |
| `9996651D` | **AZN** | AstraZeneca | HOC 28–30 | AstraZeneca ADR line around the 2023 ADR-ratio change |

Liberty Global (LBTYA/LBTYK) is **not** Liberty Media (FWONA/FWONK) or Liberty SiriusXM.

**Rule** (`DUMMY_TICKERS` / `resolve_dummies()` in the extractor): when a dummy and its live ticker
are in the same HOC, **keep the dummy row** (per Bloomberg, the line actually trading then), drop the
live duplicate and re-normalise that HOC's weights to 100; then **show the dummy under its real
ticker** — never the dummy code. Effect: 2020 47.24% → 47.37%, 2023 53.73% → 53.75%.
For **prices**, Bloomberg's advice stands: use the dummy line for the period it was active
(`BDH` on the dummy), do not substitute the live ticker's re-adjusted history.

A new dummy code makes the extractor print `unmapped Bloomberg dummy ticker(s)` — identify it
(BQL `cast_parent_equity_ticker`, `long_comp_name`) and add it to `DUMMY_TICKERS`.

### 5.2 Rows that are not part of a HOC

- Blocks with fewer than 50 rows are skipped with a warning (stray rows — e.g. three blank
  SIRI / LBTYA / LBTYK rows at the end of the sheet with no close, weight or price; a one-name
  block dated 2026-08-05).
- Zero-weight rows (`w = 0`) appear on the day a name leaves the index; they are kept (they carry no
  weight) and are not counted as constituents.

### 5.3 Classification

- Sector `#N/A Field Not Applicable` / blank → **Cash & Futures** (always shown last).
- Industry-group names are normalised (Bloomberg truncates at 30 characters and uses `&`):
  `Semiconductors & Semiconductor` → *Semiconductors and Semiconductor Equipment*, `Retailing` →
  *Consumer Discretionary Distribution and Retail*, etc. — see `IG_MAP`. Identity entries in the map
  matter (their prefix also catches longer labels, e.g. `Real Estate Management and Devel` →
  *Real Estate*).
- GICS names change over time (2023 reorganisation); the page uses each year's own classification.

### 5.4 Integrity checks the extractor enforces

- At most one open HOC, and it must be the last one.
- The HOC chain is continuous: every HOC's `prev` equals the previous HOC's `close`; otherwise it
  stops ("gaps/overlaps").
- Several workbooks can be merged (`--xlsx` repeatable); a HOC present in more than one file is taken
  from the last file given.

## 6. Refresh routine (when the analyst says "refresh")

1. **Only the latest prices** (no new rows in the Excel):
   `python scripts/ndx/extract_ndx.py --refresh-prices`
2. **New data in the Excel** (new HOC, corrections, more history):
   save the workbook after the Bloomberg refresh, then
   `python scripts/ndx/extract_ndx.py` (dry run: read the HOC list, warnings, dummy mapping) →
   `python scripts/ndx/extract_ndx.py --upload`.
3. **New year**: same as 2 — nothing in the code changes (§2).
4. After any upload: check the page header ("Excel extract … · open HOC priced …"), the yearly
   returns vs the official NDX (§3), and `meta.priceMissing`.
5. Regenerate the bundled fallback (`--write-js`) only when it should change in the repo; it is
   public and ~1.2 MB.

## 7. Page conventions (agreed with the analyst — keep them)

**General**
- Positive = green, negative = red, everywhere; no other colours for years.
- Contributions are always shown with **2 decimals**; never "−0.00%".
- Year selectors list every year in the data, **newest first**; a new year appears on its own.
- Sections are independent: each has its own year selector and nothing in one changes another
  (only the Detail simulation also feeds Top Contributors, Winners vs Losers, Scatter, Beeswarm).

**NDX Price Return** — a bordered table (year cells shaded), one column per year newest first, plus
a bar chart of every year in chronological order (2020 at the top, YTD at the bottom).

**Attribution by Sector / Industry Group** (chart) — one year at a time; By Sector or By Industry
Group; **one x-axis for sectors and industry groups across all years**; rows = every sector / group
that exists in any year (0 when absent), always in the **latest year's order (largest contribution
first)**, so names never move when switching year or tab.

**Attribution Detail & Simulation**
- **Table** has no Sector / IG toggle: it lists sectors, and each arrow expands that sector's
  industry groups in place. Same fixed rows and order as above for every year; absent = 0.
- The **include / exclude selection survives a year change** (to follow a simulation through
  time).
- **Chart** and **Treemap** take the Sector / Industry Group toggle. Treemap By Sector = the sector
  tiles (click → industry-group popup → click → securities); By Industry Group = industry groups
  **nested inside their sector**. Tiles have a minimum size so every one can be read and clicked
  (hover shows the true weight). Shading: positives and negatives on separate scales.

**Index Composition — Weight Change** — open (start of year) vs close (drifted, §3) weight per
sector, "Latest" for YTD; fixed axis across years and fixed row order (latest year's opening
weight); right-hand columns titled "Index weight: open → close" and "Change" (percentage points of
index weight).

**Top Contributors** — one ranked list per year: **Top / Bottom / Both** by rank regardless of sign
(a bottom is a bottom, flat or slightly positive included); N = 5 / 10 / 20 / All / custom; extra
years add columns to the right; Rank = position among all constituents of that year; optional
Sector **or** Industry Group column and Ret%; footer = listed names vs the index return.

**Winners vs Losers** — Sector Matrix: a winner is a constituent whose return is ≥ its sector's
weighted-average return; Wt Δ = sector close weight − open weight, the same numbers as Index
Composition. Return Distribution hover lists every name.

**Security Return vs Weight Scatter** — global axes across years with ~8 round ticks per axis;
y = drifted closing weight.

**Beeswarm** — years stacked newest → oldest whatever the click order; one axis title; filter by
**one** sector **or one** industry group at a time.

## 8. Open items

- The Massive grouped-daily endpoint is used for the first time here; if the plan does not include
  it, `ingest` / `refresh-prices` fail with a clear error and the function has to switch to
  per-ticker calls.
- The repo is public and `js/ndx-attribution-data.js` holds the full Bloomberg-derived history;
  once Supabase serves the data, consider shrinking or removing the bundled copy.
