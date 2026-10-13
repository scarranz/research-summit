# S&P 500 panel — data, refresh and rules

Market Analysis ▸ **S&P 500**. Read this before changing its data, `scripts/spx/extract_spx.py`
or the page. It records what the analyst (Dani) and Claude agreed in Oct 2026.

| Piece | Where |
|---|---|
| Source workbook | `G:\My Drive\Summit\Docs\Extras\Team\DAA\Ad hoc info search\NASDAQ 100 RETURNS\SP500 Update for <month>.xlsx` |
| Extractor | `scripts/spx/extract_spx.py` (GICS names checked by `scripts/spx/gics.py`) |
| Data file | `js/spx-data.js` (generated; without it the page falls back to the old `portal-data.js` constants) |
| Page | `js/market-analysis.js` · `js/spx-sector-chart.js` (Sector Performance chart) |

## The workbook (Bloomberg BQL, three sheets)

| Sheet | Content |
|---|---|
| `SPX_MEMBERS` | Current SPX members: `id().value`, `name().value`, `classification_name(gics,1)` / `(gics,2)`, and under a `DATES` header one price per year-end + the cut-off: `px_last(dates=range(2016-12-31,<cut-off>,frq=y),ca_adj=SPLITS,currency=USD,fill=prev)` on the **`US Equity`** (composite) ticker. `#N/A` = the security did not trade yet. |
| `MEMBERSHIP` | SPX members at each year-end (`members('SPX Index', dates=…)`) as **`composite_id_bb_global()`**, one column per year, plus a `TICKER` (`id().value`) · `BBG_ID` (composite) map of today's members. |
| `SECTORS` | `DATES` · `SPX Index` · the 11 S&P 500 GICS sector indices (`S5INFT`, `S5TELS`, `S5FINL`, `S5COND`, `S5INDU`, `S5HLTH`, `S5UTIL`, `S5CONS`, `S5RLST`, `S5ENRS`, `S5MATR`), `px_last(..., frq=cm)` month-ends; last row = cut-off. |
| `SECTORS` (second table) | A second `DATES` block on the same sheet: `SPY US Equity` + the 11 SPDR sector ETFs (`XLK`, `XLC`, `XLF`, `XLY`, `XLI`, `XLV`, `XLU`, `XLP`, `XLRE`, `XLE`, `XLB` `US Equity`), `px_last(..., frq=cm, ca_adj=SPLITS)`. XLC starts Jun 2018 (blank before = n/a). |
| `SECTORS_WEIGHTS` | SPY's month-end holdings grouped by GICS sector: `sum(group(id().weights, classification_name(gics,1)))` on `SPY US Equity`, one column per sector (matched by the GICS **name** in the top row; the ETF codes under it are only the analyst's lookup) + `Residual`. Feeds the SPY attribution only. |

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
- **Sectors: toggle ETF / index** (top of the panel; default ETF). It drives Sector Alpha, Sector
  Performance and the Sector Summary return column; stocks are always measured against the SPX.
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
  Sector Performance has its own ETF / index toggle. The Sector Summary return column is always the
  S5 sector index (its rows are S&P 500 members).
- **SPY Attribution by Sector / Detail & Simulation** (`js/spx-attribution.js`): the **SPY fund**, not
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
  so Sector Alpha (ETF mode), Sector Performance (ETF mode) and their months/ranges agree; years
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
