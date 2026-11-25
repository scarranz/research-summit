# EPS Attribution (Market Analysis tab)

Splits an index move into the change in **forward EPS** and the change in the **forward multiple**, by sector / industry group / security.
Code: `js/eps-engine.js` (maths, `node tests/eps-engine.test.mjs`), `js/eps-attribution.js` (UI), `js/eps-charts.js`, `css/eps-attribution.css`.
Data: `js/eps-attribution-data.js`, from `python scripts/eps-attribution/extract_eps.py "<Index EPS Contribution Analysis.xlsx>" --write`.

## Method (v7): contribution by index weight
Forward P/E = price / **CY2027** EPS (Bloomberg consensus calendarised to December). Always CY2027, base date Jan 2 2026 -> each later snapshot. No rolling / NTM.
Per security, with w = its start index weight (float-adjusted, from the file; renormalised only when something is excluded):
- price contribution = w x its price return
- EPS effect = w x its own CY2027 EPS change (no cap)
- multiple effect = price - EPS effect (= w x (1+g) x its P/E change; the cross term sits here)
Everything adds up: securities -> industry groups -> sectors -> index. A group's own change = weight-average of its stocks (so (1+g)(1+m) = 1+ret holds on every row).
A small weight dilutes any change: 0.01% x +500% = 0.05 pp. This is what the CIO reads; it replaced the earlier "aggregate" attribution (shares x EPS, which counts a stock by the earnings it brings: MU 0.6% weight but 1.6% of index earnings) because that overstated low-P/E names (MU 5.9 pp of S&P EPS, 22 pp of Nasdaq-100) and is not how an index contribution table works.
Memo only (Data & method): the index-level forward P/E (index price / earnings of everything it holds) and the aggregate EPS change; the engine keeps them as `gAgg`, `m`, `pe0`, `pe1`.
Earnings concentration uses a company's earnings inside the index = weight / forward P/E.

## One set of numbers with Index Analysis (analyst, Nov 25, 2026) — replaces the method above where they differ

- **Price, weights, price contributions** come from Index Analysis (`js/eps-index-link.js`): S&P 500 = SPY
  (Attribution Detail; companies as in Top Contributors), Nasdaq-100 = QQQ holding periods (`ndxLink`).
  Never re-price in this tab.
- **EPS growth** = the index's forward EPS built from its companies, each adding (weight / price) x EPS
  (`engine.earnings`). Company contributions add up to it.
- **Multiple change** = (1 + price) / (1 + EPS growth) - 1 at every level. It is not split into contributions.
- Dates: YTD to Mar 31, Jun 30, Oct 16 and the latest. Mar 31 / Jun 30 pair the SPY month-end with the next day's EPS
  snapshot. Oct 16 (both indices) and the Nasdaq-100 at Mar 31 / Jun 30 have no Index Analysis figure, so the price is
  built from the companies and the page says so.
- Headline and One stock: three cards (EPS growth, multiple change, price return) whose second line runs on a base of 100
  (the multiple starts where the EPS ended). No x or = signs, no equation. One stock has a table by date, no charts.
- Excluding a single company (or, for the S&P, an industry group) is an estimate and says so.
