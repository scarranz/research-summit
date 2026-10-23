# Summit Index Data — workbook contract (draft, Oct 23, 2026)

One workbook replaces the four the S&P / EPS extractors read today. **Status: contract + empty template
only. No extractor reads it yet and no `js/*-data.js` was generated from it.** Template:
`templates/Summit Index Data - TEMPLATE.xlsx` (built by `scripts/data/make_template.py`).

## Why
The CIO moved price pulls to Systems. The analyst now supplies only: index levels, weights (index,
sector, industry group, security), membership (S&P 500 / Nasdaq-100 / neither) and consensus.
Month-ends from 2016-12-31. Bloomberg query limits apply: one query per index over the whole date
range, never one per date.

## Where the data comes from today (until the new workbook is filled)
| Data | Excel (under `G:\My Drive\Summit\Docs`) | Extractor → file |
|---|---|---|
| S&P members, sector levels, SPY weights | `Extras\Team\DAA\Ad hoc info search\NASDAQ 100 RETURNS\SP500 Update for October.xlsx` | `extract_spx.py` → `js/spx-data.js` |
| S&P industry groups | `0\Equity Universe Consensus.xlsx` (SECTORS) | `extract_spx.py --groups` |
| S&P company weights | `...\NASDAQ 100 RETURNS\SP 500 2026 RETURNS.xlsx` (SPX nonBBG) | `extract_spx_holdings.py` → `js/spx-holdings-data.js` |
| Nasdaq-100 | `...\NASDAQ 100 RETURNS\NASDAQ 100 2026 RETURNS.xlsx` (NDX nonBBG) | `extract_ndx.py` → Supabase + `js/ndx-attribution-data.js` |
| EPS Attribution | `...\NASDAQ 100 RETURNS\Index EPS Contribution Analysis.xlsx` (UNIVERSE) | `extract_eps.py` → `js/eps-attribution-data.js` |

## Sheets (read by header name, never by position)
| Sheet | Layout |
|---|---|
| `RAW_SPX`, `RAW_NDX` | Bloomberg's own output. Each month-end is a **date in a header cell**; the constituents' tickers run below it and their **weight (%) in the column to the right**. New months are inserted to the left; order is irrelevant. Blocks may have different lengths. |
| `UNIVERSE` | One row per raw ticker ever seen (columns below). |
| `LEVELS` | Row 1 = Bloomberg ticker, row 2 = GICS name, then one row per month-end under `DATE`. Series: `SPX Index`, `SPY US Equity`, the 11 GICS sector indices (`S5INFT`…`S5MATR`), the 11 SPDR sector ETFs (`XLK`…`XLB`), the 25 industry-group indices (paste their tickers in row 1; row 2 is the GICS name from `scripts/spx/gics.py`). |
| `W_SECTOR` | `DATE` + the 11 GICS sectors + `Residual`: SPY weight by sector, %. |
| `W_IG` | `DATE` + the 25 GICS industry groups: SPY weight by industry group (SPY's constituents grouped by level 2), %. |
| `CONSENSUS` | Long: `date \| ticker \| metric \| period \| value`. Adding a metric adds rows, not columns. Needed from Dec 2025 only (EPS Attribution starts Jan 2, 2026). Today: EPS, period CY2027. |
| `PRICES` | **Reserved for Systems**: month-end close, security rows × date columns. Not filled by the analyst. |

## UNIVERSE columns
| Column | Meaning |
|---|---|
| `raw_ticker` | As Bloomberg returns it in RAW_* (e.g. `TRI CN Equity`). |
| `ticker` | Substitution target (`TRI US Equity`); same as `raw_ticker` when none. **Weights always sit on this ticker.** |
| `composite_id` | `composite_id_bb_global`, filled once per ticker with a Bloomberg formula. The 2-column RAW format carries no ID; this guards against reused tickers and exchange moves (see `docs/SPX_MARKET_ANALYSIS.md`, "Composite, never venue"). |
| `eps_ticker` | Ticker the consensus is pulled from when `ticker` fails (GOOG → GOOGL, BRK/B, ASML…). Blank = same as `ticker`. |
| `eps_scale` | Factor applied to that EPS to put it on the security's share (BRK/B today: Class A ÷ 1,500). Blank = 1. |
| `in_universe` | Yes / No — securities Summit tracks even when in neither index. |
| `name`, `sector`, `industry_group`, `note` | Labels. |

## Membership
No stored flag. A weight in `RAW_SPX` that month = in the S&P 500; in `RAW_NDX` = in the Nasdaq-100; neither
and `in_universe = Yes` = Summit universe only. This gives membership **per month**.

## Extractor rules (to implement)
- Find every date cell in the RAW header row; the weight is the cell to its right. Sort by date.
- Resolve `raw_ticker → ticker`. Two raw tickers resolving to one `ticker` **stop the run** (GOOG and
  GOOGL are different lines); a deliberate merge must be marked in `note`.
- Any raw ticker missing from `UNIVERSE` is listed as a to-do; nothing is guessed.
- A month-end missing from the calendar (2016-12-31 → cut-off), or SPY / sector / IG weights not
  adding to ~100, is reported before anything is written.
- Without `PRICES`, sector and industry-group results work (levels + weights); security returns,
  Top Contributors, Winners vs Losers, Stock Lookup and the price/EPS/multiple split of EPS
  Attribution need prices from Systems.

## Open
- Which consensus metrics beyond EPS CY2027 (CY2026?) — decides the `CONSENSUS` rows.
- ASML: US ticker has no estimate in the old file; decide `eps_ticker` (and currency) when filling `UNIVERSE`.
