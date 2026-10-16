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
- **Terminal state** per FIGI: `SPX` (in today's S&P 500) · `LIVE` (ACTV, not in the S&P 500) · `ACQ` (ACQU) · `BK` (delisted with a letters + `Q` ticker, `LIQU`, or five hand-listed: Laidlaw, Silicon Graphics, Harnischfeger, Handleman, Armstrong) · `OTH` (other delistings: mergers into a new entity, tracking stocks, privatisation). "Acquired" includes mergers of equals: the business lives on in the buyer; it counts as the name no longer existing, not as a failure. BK counts the **old equity** (Kodak, Delta, American Airlines emerged; their old shares did not).
- **Four stages** (cards + S&P 500 and rates charts): published index return compounded over 1995-97, 1998-99, 2000-02, 2003-05; median stock (mean of the yearly medians), % of names up, top-10 weight at the start of the stage, Fed funds Dec to Dec (FRED), the verified events of those years.
- **Who led, and what became of them**: pick a year; the 10 best (or worst) by contribution (weight x return) among the members at the previous year-end; their return the year before, that year, the year after, from the end of that year to Dec 2005, and today's fate with the year it left (`x`, Bloomberg delisting date). Years after 2005 are greyed: most 'acquired' names left after the study window (a dropdown counts them).
- **Where the weight sat**: the Index Composition dumbbell (`dumbbell()` in `js/ma-charts.js`), build-up (Dec 1994 to Dec 1999) and break (Dec 1999 to Dec 2002).
- **Names added to the index**: members at the start of a year that were not members one year-end earlier vs the others, median return that year and the next. Only post-inclusion returns exist in the data. No SPAC-type vehicles were looked for beyond a name scan; the universe is S&P 500 members only.
- **Then and now**: the same measures for 1998-2000 and the last three years of the SPY holdings already in the portal (float-adjusted weights; weighting methods differ).
- Removed on Oct 16 2026 after review (too many toggles, charts without a conclusion): cohort explorer, concentration table, rotation / year-by-year / fate explorers, macro chart gallery, sector/industry paths, persistence tables, price-path and scatter views of the tracker. They remain in git history (commit 725e63c).

## Checks (Oct 15 2026 run)
Fixed basket vs the published S&P 500 price return (workbook AP52:AQ62): within 1.2 pp every year except **2000: −7.24% vs −10.14% (+2.90 pp)**, entries and exits during the year. It is a result, shown on the page, not hidden. Names with no market cap (flat estimated weight): 27 names / 3.7% of the index in Dec 1994, 3 / 0.4% in Dec 1999, none from Dec 2000.

## Caveats the page states
1. S&P 500 members only. A name that leaves the index is carried to its **last close** (that year's return includes the exit) and nothing replaces it; the data does not follow it after that. Year-end snapshots (last trading day) are the open and close of each window, so there is no intra-year data.
2. Fixed basket per year: intra-year entries / exits and weight drift are not modelled (see the 2000 gap).
3. Peak = highest **year-end** price observed, not the March 2000 high.
4. BICS ≠ GICS (today's side of the concentration comparison uses GICS Information Technology + Communication Services, comparable not identical).
5. Market-cap weights until the 2005 float adjustment (S&P announced it in 2005; completed Sep 2005).
6. Event dates on the macro charts were checked on Oct 16 2026 against: Federal Reserve press releases / FOMC minutes (Sep 29, Oct 15, Nov 17 1998; May 16 2000; 1.00% by Jun 25 2003, CRS), S&P DJI and press reports (S&P 500 close 1,527.46 on Mar 24 2000 and 776.76 on Oct 9 2002; Nasdaq Composite 5,048.62 on Mar 10 2000), public laws (Telecom Act Feb 8 1996; Taxpayer Relief Act Aug 5 1997, top long-term rate 28% → 20% for assets held over 18 months; Gramm-Leach-Bliley Nov 12 1999, P.L. 106-102; Sarbanes-Oxley Jul 30 2002, P.L. 107-204) and the bankruptcy filings (Enron Dec 2 2001, WorldCom Jul 21 2002). Rule: no figure goes on the page unless it comes from the data or a checked source.
   Added Oct 16 2026: NATO air campaign in Kosovo 24 Mar - 10 Jun 1999 (nato.int), US operations in Afghanistan from 7 Oct 2001 and the Iraq invasion from 20 Mar 2003 (US DoD casualty site; some sources date Iraq 19 Mar by time zone). The Gulf War (1991) is outside the window; no US war with Iran or Pakistan in it.
7. The file ends in 2005: nothing is said about what the rotation of 2000-05 led to.

## Refresh
Edit the workbook → dry run `python scripts/market-history/extract_history.py "<workbook>"` (read the basket-vs-published table and the cohort block) → `--write` → check the tab. Context series: `fetch_macro.py`, then re-run the extractor (delete `macro/shiller.json` to re-read the .xls). Local check without logging in: `harness-history.html` (gitignored) served from the repo root; headless Chrome works from the command line (`chrome --headless=new --screenshot=…`).
