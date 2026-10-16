# Market History 1995-2005 — data, method, caveats

Market Analysis ▸ second tab **Market History 1995-2005** (`js/market-history.js`, `css/market-history.css`, data
`js/market-history-data.js`). The analyst's file is called `dot com analysis.xlsx` because the hypothesis was that the
dot-com years would be reflected in it; the study itself is about **the movements and reversals of the S&P 500 in
those years**: who led, who sat still, how long it lasted, what became of them, and what that says about today.

Decisions (analyst, Oct 15 2026): the universe is the **S&P 500** only (no companies that never belonged to it); **no
multiples and no fundamentals** (not sourceable in reasonable time); macro / commodity series are public and only
context. The page leads with conclusions; tables and explorers sit below.

| Piece | Where |
|---|---|
| Source workbook | `G:\My Drive\Summit\Docs\Extras\Team\DAA\Ad hoc info search\NASDAQ 100 RETURNS\dot com analysis.xlsx` (Bloomberg BQL, pasted values) |
| Extractor | `python scripts/market-history/extract_history.py "<workbook>" [--write]` (needs `openpyxl`; the first run needs `pandas` + `xlrd` to read Shiller's .xls, then caches `macro/shiller.json`) |
| Public context series | `python scripts/market-history/fetch_macro.py` → `scripts/market-history/macro/` (FRED `fredgraph.csv`, Shiller's S&P 500 monthly level, FINRA margin statistics). Use `curl`: Python / PowerShell time out against FRED on some networks |
| Display names | `scripts/market-history/names.json` — 1990s names for the FIGIs whose Bloomberg name is the successor's (e.g. Lucent for "Nokia of America"). Written by hand: **to be checked by the analyst** |
| Brief | the CIO's `DOTCOM_CONTEXT.md` |

## The workbook
`SPX BBG`: one row per security × year-end snapshot, 11 snapshots (30-Dec-1994 … 31-Dec-2004) × 500 names. Each
window is the calendar year after its snapshot (1995 … 2005). Market cap at the snapshot → opening weight; window
prices and return (**price return**, splits adjusted); BICS sector / industry group / industry. `MEMBERSHIP`: per FIGI
the delisting type (`ACTV`, `ACQU`, `DLST`, `LIQU`, `UNLS`, `PRIV`) and date, plus today's S&P 500 members. **The key is
the FIGI, never the name or ticker**; dead names carry dummy tickers (`0111145D`) that the page never shows.

## What the page computes (everything in the text is computed from the data at load time)
- **Breadth per window**: cap-weighted (fixed-basket) return, equal-weighted, median stock, % of names up, % beating the index, dispersion (σ), best / worst tenth, top-10 weight. The same function is applied to today's SPY year-end holdings (`js/spx-holdings-data.js`, 2020 – 2026 YTD) so both eras use identical measures. Caveat: SPY weights are float-adjusted, the 1990s ones full market cap.
- **Sector and industry-group paths** after Dec 1999 (= 100): cap-weighted among the Dec-1999 members still in the index each year.
- **Cohort**: the 500 names of the Dec-1999 snapshot ranked on the chained 1995-99 price return (equal-count quintiles). **Nothing after 31-Dec-1999 is used to form the groups.** 42 names that first appear at the 1999 close have no history and sit apart. Late joiners are ranked on a partial window (flagged `*` in the explorer). Q5 is also split into Technology + Communications and everything else.
- **Persistence**: prior-year top fifth minus bottom fifth, median next-year return, for every year; the 3-year version from Dec 1997 to Dec 2003 in the cohort explorer.
- **Terminal state** per FIGI: `SPX` (in today's S&P 500) · `LIVE` (ACTV, not in the S&P 500) · `ACQ` (ACQU) · `BK` (delisted with a letters + `Q` ticker, `LIQU`, or five hand-listed: Laidlaw, Silicon Graphics, Harnischfeger, Handleman, Armstrong) · `OTH` (other delistings: mergers into a new entity, tracking stocks, privatisation). "Acquired" includes mergers of equals: the business lives on in the buyer; it counts as the name no longer existing, not as a failure. BK counts the **old equity** (Kodak, Delta, American Airlines emerged; their old shares did not).
- **Leaders and laggards explorer** (top of the page): pick a year-end and a 1- or 3-year look-back; the top fifth, the middle and the bottom fifth are bought at that date, not rebalanced, and a name that leaves the index stays at its last close. Cap-weighted, equal-weighted or median. Table and the largest names of each group below.
- **Weight change** (finding 5): the Index Composition dumbbell (`dumbbell()` in `js/ma-charts.js`, shared with Market Analysis) for BICS sectors between any two snapshots.
- **Concentration** table and **rotation / year-by-year / fate** explorers, by name.
- **Backdrop** and the macro charts: rates, curve, Baa / Aaa spreads, oil, gas, copper, IMF commodity indices, dollar, labour, inflation, capacity, housing, semiconductor PPI, margin debt (FINRA, from 1997), SLOOS, fiscal balance, productivity, GDP, investment in information-processing equipment & software (BEA via FRED). Shiller's file contributes only the S&P 500 monthly level.

## Checks (Oct 15 2026 run)
Fixed basket vs the published S&P 500 price return (workbook AP52:AQ62): within 1.2 pp every year except **2000: −7.24% vs −10.14% (+2.90 pp)**, entries and exits during the year. It is a result, shown on the page, not hidden. Names with no market cap (flat estimated weight): 27 names / 3.7% of the index in Dec 1994, 3 / 0.4% in Dec 1999, none from Dec 2000.

## Caveats the page states
1. S&P 500 members only. A name that leaves the index is carried to its **last close** (that year's return includes the exit) and nothing replaces it; the data does not follow it after that. Year-end snapshots (last trading day) are the open and close of each window, so there is no intra-year data.
2. Fixed basket per year: intra-year entries / exits and weight drift are not modelled (see the 2000 gap).
3. Peak = highest **year-end** price observed, not the March 2000 high.
4. BICS ≠ GICS (today's side of the concentration comparison uses GICS Information Technology + Communication Services, comparable not identical).
5. Market-cap weights until the 2005 float adjustment (S&P announced it in 2005; completed Sep 2005).
6. Event dates on the macro charts were checked on Oct 16 2026 against: Federal Reserve press releases / FOMC minutes (Sep 29, Oct 15, Nov 17 1998; May 16 2000; 1.00% by Jun 25 2003, CRS), S&P DJI and press reports (S&P 500 close 1,527.46 on Mar 24 2000 and 776.76 on Oct 9 2002; Nasdaq Composite 5,048.62 on Mar 10 2000), public laws (Telecom Act Feb 8 1996; Taxpayer Relief Act Aug 5 1997, top long-term rate 28% → 20% for assets held over 18 months; Gramm-Leach-Bliley Nov 12 1999, P.L. 106-102; Sarbanes-Oxley Jul 30 2002, P.L. 107-204) and the bankruptcy filings (Enron Dec 2 2001, WorldCom Jul 21 2002). Rule: no figure goes on the page unless it comes from the data or a checked source.
8. Follow the names: the best / worst of a year are ranked on that year's price return or contribution among the members at the previous year-end; the strip shows each name's return in every year of the file, "out" marks the year after its last close.
7. The file ends in 2005: nothing is said about what the rotation of 2000-05 led to.

## Refresh
Edit the workbook → dry run `python scripts/market-history/extract_history.py "<workbook>"` (read the basket-vs-published table and the cohort block) → `--write` → check the tab. Context series: `fetch_macro.py`, then re-run the extractor (delete `macro/shiller.json` to re-read the .xls). Local check without logging in: `harness-history.html` (gitignored) served from the repo root; headless Chrome works from the command line (`chrome --headless=new --screenshot=…`).
