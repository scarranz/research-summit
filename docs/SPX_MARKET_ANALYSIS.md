# S&P 500 side of Market Analysis — data, refresh and rules

Market Analysis is **one list of functions, each with its own index toggle** (S&P 500 · Nasdaq-100 ·
Both where it makes sense) since Oct 14, 2026; the S&P 500 always comes first and is selected by default — there is no S&P / Nasdaq page switch any more. This
file covers the S&P 500 data and rules; the Nasdaq-100 side is `docs/NDX_ATTRIBUTION.md`. Read it
before changing the data, `scripts/spx/extract_spx.py` or the page.

| Section | S&P 500 | Nasdaq-100 | Module |
|---|---|---|---|
| Sector Return / Contribution | one or the other | | `js/spx-sector-alpha.js` · `js/ndx-sector-returns.js` |
| Attribution Detail & Simulation | ONE table: S&P, Nasdaq or both side by side | | `js/ma-detail.js` (engines: `spx-attribution.js` · `ndx-attribution.js`) |
| Sector Summary — Market Beaters | one or the other (same table) | | `js/market-analysis.js` |
| Index Composition — Weight Change | one or the other, sectors | | `js/market-analysis.js` · `js/ndx-attribution.js` |
| Top Contributors | one or the other | | `js/spx-securities.js` · `js/ndx-attribution.js` |
| Winners vs Losers (return distribution, click a bar for the names) | one or the other | | `js/ma-charts.js` |
| Stock Lookup (one card per year: return, beat S&P? beat Nasdaq?) | both | | `js/market-analysis.js` |

Agreed details (Oct 14, 2026): one year selector and one Sector / Industry Group column in the
attribution table, each index with weight open → close and contribution (no return column, no
company counts: the S&P data has today's members only); excluding a row removes it from both indices;
"Cash & other" is the same row for both (SPY's residual / QQQ's cash & futures). Sector Summary: same
sector order, same Exclude chips (sectors by YTD + the three IT groups, dashed) and an industry
group's % = its matches as a share of the SECTOR (the groups add up to the sector's %). Year buttons
the Nasdaq data does not have (2017-2019) show disabled so switching index never moves them. Sector
Return: each year's months sit right under that year. Scatter: Return / Contribution toggle,
sectors / groups listed by index weight (largest first = the default), axes fixed for the year.
Year-end weights: S&P close of Y = open of Y+1 by construction (same month-end); Nasdaq within 0.05 pp.

Removed (Oct 23, 2026): Index Price Return and Security Return vs Weight (sections, `js/ma-price.js`, the S&P scatter, `ndxPriceData()`).
Removed (CIO, Oct 14, 2026): the S&P 500 Companies Explorer, Return Scatter 2025 vs 2026, Rotation
Winners and "Negative 2025 → beating 2026", the Sector Performance chart, the top-level "SPY
Attribution by Sector" chart, and the Chart / Treemap views of the attribution detail.

| Piece | Where |
|---|---|
| Source workbook | `G:\My Drive\Summit\Docs\Extras\Team\DAA\Ad hoc info search\NASDAQ 100 RETURNS\SP500 Update for <month>.xlsx` |
| Extractor | `scripts/spx/extract_spx.py` (GICS names checked by `scripts/spx/gics.py`) |
| Data file | `js/spx-data.js` (generated; without it the page falls back to the old `portal-data.js` constants) |
| Industry groups | `G:\My Drive\Summit\Docs\0\Equity Universe Consensus.xlsx`, tab **SECTORS** (`--groups`) |
| Page | `js/market-analysis.js` (coordinator) + the modules above |

## The workbook (Bloomberg BQL, three sheets)

| Sheet | Content |
|---|---|
| `SPX_MEMBERS` | Current SPX members: `id().value`, `name().value`, `classification_name(gics,1)` / `(gics,2)`, and under a `DATES` header one price per year-end + the cut-off: `px_last(dates=range(2016-12-31,<cut-off>,frq=y),ca_adj=SPLITS,currency=USD,fill=prev)` on the **`US Equity`** (composite) ticker. `#N/A` = the security did not trade yet. |
| `MEMBERSHIP` | SPX members at each year-end (`members('SPX Index', dates=…)`) as **`composite_id_bb_global()`**, one column per year, plus a `TICKER` (`id().value`) · `BBG_ID` (composite) map of today's members. |
| `SECTORS` | `DATES` · `SPX Index` · the 11 S&P 500 GICS sector indices (`S5INFT`, `S5TELS`, `S5FINL`, `S5COND`, `S5INDU`, `S5HLTH`, `S5UTIL`, `S5CONS`, `S5RLST`, `S5ENRS`, `S5MATR`), `px_last(..., frq=cm)` month-ends; last row = cut-off. |
| `SECTORS` (second table) | A second `DATES` block on the same sheet: `SPY US Equity` + the 11 SPDR sector ETFs (`XLK`, `XLC`, `XLF`, `XLY`, `XLI`, `XLV`, `XLU`, `XLP`, `XLRE`, `XLE`, `XLB` `US Equity`), `px_last(..., frq=cm, ca_adj=SPLITS)`. XLC starts Jun 2018 (blank before = n/a). |
| `SECTORS_WEIGHTS` | SPY's month-end holdings grouped by GICS sector: `sum(group(id().weights, classification_name(gics,1)))` on `SPY US Equity`, one column per sector (matched by the GICS **name** in the top row; the ETF codes under it are only the analyst's lookup) + `Residual`. Feeds the SPY attribution only. |

**Industry groups (`--groups`, the analyst's `Equity Universe Consensus.xlsx` ▸ SECTORS).** Four
`DATES` blocks side by side: S5 sector levels, the 25 **S5 industry-group index** levels (Bloomberg
codes, mapped to names through the name | code table on the right of the sheet), SPY's month-end
weights by sector and by **industry group** (`SPY`'s holdings grouped by GICS level 2 — the index's
own constituents at each date). The extractor finds the weight blocks by their first column (SPY's
total ≈ 100 = the sum of the groups; the IG weights block is titled "…Levels" in the sheet) and
aligns rows to the panel's month-ends by month. Both workbooks must be refreshed to the **same
close**: on Oct 14 the groups ran to Oct 14 and SPY to Oct 12, and the 2026 residual showed +1.47 pp
(the S&P fell 1.22% in those two days); 2024 / 2025 reconcile to −3…+5 bp. Run:
`python scripts/spx/extract_spx.py "<SP500 Update>.xlsx" --groups "<Equity Universe Consensus>.xlsx" --write`.
With the groups, the S&P attribution is computed per industry group (a sector = the sum of its
groups), Sector Return / Contribution and Sector Summary have industry-group returns, and the
detail table opens each sector onto its groups.

**S&P company weights (`scripts/spx/extract_spx_holdings.py` → `js/spx-holdings-data.js`).** From the
analyst's `SP 500 2026 RETURNS.xlsx` ▸ `SPX nonBBG` (the Nasdaq layout, ONE snapshot per year: SPY's
year-end holdings and weights, each name's price at that year-end and the next). A year is a
buy-and-hold of its opening holdings: contribution = weight × return; the rest vs SPY is the residual
(joiners, delisted names without a price, cash). No intra-year snapshots: Bloomberg query limits.
Cleaning the extractor does (and prints): 2020 had a second snapshot (the Dec 2020 weights) pasted
under the same date → the first block is kept; isolated duplicate rows (NEM, BAC in 2025) → first
kept; 2024 closed Dec 23 → re-priced to Dec 31 with 2025's opening prices; the "MMED / MiniMed Group"
rows before MiniMed existed are Medtronic (MDT never appears) → MDT and its member returns; truncated
industry groups expanded; GICS of former members from other years, the Nasdaq data, or by hand in
`scripts/spx/former_members_gics.json` (to check). Checks (Oct 14 data): Σ weight × return vs SPY
2021 +15 bp, 2022 −36, 2023 +15, 2024 +34, 2025 −16, 2026 −3; sector weights vs the SECTORS tab ≤0.23 pp
from 2022 (0.6–0.8 pp 2020-21); sector contributions vs the SPY attribution ≤0.21 pp; returns vs
`SP500 Update` differ only for special-dividend payers (PGR, PCAR, TDG, WRB, CME, COST…): the sheet
adjusts abnormal cash dividends (`CshAdjAbnormal = Y`), as the index does.

Lessons that cost a day:
- **Composite, never venue.** `UN`/`UW` tickers and the venue-level `id_bb_global` break when a stock
  changes exchange: `fill=prev` repeats a stale price (FISV, SMCI showed 0.00% years) and the ID
  changes so the history doesn't match (KHC, FITB looked "new in 2026"). Use `US Equity` and
  `composite_id_bb_global`.
- **`ca_adj=SPLITS` is the right adjustment.** Verified on the data: splits adjusted (NVDA 2024
  +171.2%), spin-offs adjusted (MMM, GE year-end 2021 prices are scaled), dividends **not** (AAPL,
  KO, VZ 2021 closes are the real closes). That is price return, consistent with SPX and the S5
  indices. Yahoo's "Close" matches except around spin-offs; its "Adj Close" includes dividends.
- **Fixed cut-off, after the close.** `today()` moves on every recalc; intraday pulls are not closes.
- The workbook's own Ticker/Sector lookup next to the sector levels was once shifted by a row; the
  extractor maps S5 tickers itself and ignores it.

## Rules

- **Every return is price return**, computed by the extractor from prices/levels.
- **Sectors: toggle ETF / index** (top of the panel; default ETF). It drives Sector Alpha's returns
  (hidden in Attribution); stocks are always measured against the SPX.
  ETF mode = XL* funds vs **SPY** (fund vs fund); index mode = S5 indices vs **SPX**. They differ where
  the ETFs cap their largest holdings (XLK, XLC, XLY): e.g. 2026 YTD to Oct 12, XLC −5.3% vs S5TELS
  +5.6% (GOOGL/META ~+12% dominate the index, XLC caps them). Not a calculation error.
- **Full-year rule.** A stock's return for year Y counts in the Positive / Beat filters, the sector
  counts, the scatter and Rotation Winners only if it was in the SPX at the end of Y−1 **and** at the
  end of Y (current year: end of Y−1 and today), matched on the composite ID. The return is still
  shown, grey italic, and labelled "not in the index" (not a member at either year-end, `m<yy>` = 0)
  or "not in the index all year" (joined or left, `m<yy>` = 1). The 3yr cumulative needs all three
  years in full. Former members are not in the data (accepted: current members only).
- Sector Summary drills sector → industry group → companies; a sector with a single industry group
  (Energy, Materials, Utilities) opens straight onto its companies.
- **Toggles.** "Sectors measured with" (ETF vs SPY / S5 index vs SPX) drives **Sector Alpha only**.
  The Sector Summary return column is always the
  S5 sector index (its rows are S&P 500 members).
- **Sector Alpha is a series of questions** (Oct 14, 2026, CIO feedback): 1 · How many sectors (One /
  Multiple) → 2 · Period (Yearly / Monthly) → 3 · Show (Returns / Attribution to SPY, Yearly only).
  One dates box: Years (at least one on, the current year alone by default, labelled "2026" not YTD);
  Monthly adds the months (they belong to the latest year selected), Single month / Cumulative YTD
  and a **Custom period** button whose from/to dropdowns show only while it is on. Absolute /
  Relative for Returns (Relative in pp). **Attribution** = the yearly SPY attribution below
  (`spyAttributionYears`), no ETF tickers and no source toggle (it is SPY's own holdings), SPY row on
  top, residual row when every sector is on, and the "SPY is not the sector ETFs" note. The separate
  "SPY Attribution by Sector" chart and the Sector Performance chart were removed.
- **SPY attribution — Sector Alpha ▸ Attribution and Detail & Simulation** (`js/spx-attribution.js`): the **SPY fund**, not
  the index. Monthly contribution = SPY's sector weight at the prior month-end (from SPY's holdings)
  × the S5 sector index return; years Carino-linked; Residual = SPY's own price return − sum of
  sectors (cash, timing), so sectors + residual = SPY exactly. Simulation rescales the remaining
  weights monthly. **Complete years from 2024 only** (`FIRST_YEAR`): the weights use today's GICS and
  the S5 levels the GICS of the time, so before the March 2023 GICS change they do not add up
  (residual 2017 +331 bp, 2020 +199, 2023 +104; 2024 −1, 2025 −5, 2026 YTD +4). SPDR ETF returns
  were tested and rejected (2024 residual +530 bp: the ETFs cap weights). Bloomberg's SPX sector
  weight estimates and a B500 rebuild (86% overlap) were rejected earlier.
- **⚠ INTERNAL — temporary ETF YTD override (Oct 13, 2026).** The 2026 YTD of the 11 SPDR sector
  ETFs is forced to the figures of the Summit portal list (`scripts/spx/etf_ytd_overrides.json`),
  which measures YTD from a different base than the Dec 31 close (Bloomberg/Yahoo agree with each
  other; e.g. XLK +36.39% on closes vs +34.78% forced). The extractor rescales each ETF's last level,
  so Sector Alpha (ETF mode) and its months/ranges agree; years
  before 2026 are untouched; SPY is not overridden. **Nothing on the page says so, on purpose.** The
  extractor prints "ETF YTD OVERRIDE ACTIVE" on every run and stores the real Bloomberg last levels
  in `SPX_DATA.etf._ytdOverrides`. To undo: delete the json (or let the cut-off move past its asOf).
- GICS: the current classification only (Bloomberg has no history without an S&P licence); full
  official names, never truncated.

## Refresh routine

1. Refresh the workbook in Bloomberg **after the close**, cut-off date fixed in the formulas, save.
2. Dry run: `python scripts/spx/extract_spx.py "<workbook>.xlsx"` — read the summary (members,
   eligible per year, names that joined this year) and the warnings (stale prices, unmatched IDs,
   truncated GICS).
3. `... --write` → `js/spx-data.js`; check the page on localhost; commit through a PR.
