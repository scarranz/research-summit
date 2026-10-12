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
- **Sectors = S&P 500 GICS sector indices**, not SPDR ETFs (the ETFs cap single-name weights:
  XLK 2024 +21.8% vs S5INFT +35.7%).
- **Full-year rule.** A stock's return for year Y counts in the Positive / Beat filters, the sector
  counts, the scatter and Rotation Winners only if it was in the SPX at the end of Y−1 **and** at the
  end of Y (current year: end of Y−1 and today), matched on the composite ID. The return is still
  shown, grey italic. Former members are not in the data (accepted: current members only).
- GICS: the current classification only (Bloomberg has no history without an S&P licence); full
  official names, never truncated.

## Refresh routine

1. Refresh the workbook in Bloomberg **after the close**, cut-off date fixed in the formulas, save.
2. Dry run: `python scripts/spx/extract_spx.py "<workbook>.xlsx"` — read the summary (members,
   eligible per year, names that joined this year) and the warnings (stale prices, unmatched IDs,
   truncated GICS).
3. `... --write` → `js/spx-data.js`; check the page on localhost; commit through a PR.
