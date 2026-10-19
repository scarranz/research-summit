# EPS Attribution (Market Analysis tab)

Splits an index move into the change in **forward EPS** and the change in the **forward multiple**, by sector / industry group / security.
Code: `js/eps-engine.js` (maths, `node tests/eps-engine.test.mjs`), `js/eps-attribution.js` (UI), `js/eps-charts.js`, `css/eps-attribution.css`.
Data: `js/eps-attribution-data.js`, from `python scripts/eps-attribution/extract_eps.py "<Index EPS Contribution Analysis.xlsx>" --write`.

## Identity
Forward P/E = price / **CY2027** EPS (Bloomberg consensus calendarised to December). Always CY2027, base date Jan 2 2026 -> each later snapshot. No rolling / NTM: the file only has annual estimates.
`1 + R = (1 + g)(1 + m)` — R price return, g change in the index's aggregate CY2027 EPS, m forward P/E change. The hero shows these three as returns, no weights.

## Index earnings, aggregate vs weighted average
- Index earnings = sum(weight x EPS/price): each stock's earnings yield weighted by its **index weight** (float-adjusted, from the file); price and EPS are taken at the same date, so a split cannot enter within a date.
  Equivalent to EPS x implied shares (weight/price). g = its change between the two dates (start weights held).
- Weighted average = sum(start weight x stock EPS change), no cap. Shown as a footer line of the detail table with the aggregate and the median.

## Contributions
Per security (pp of the index): price q dP / I0, EPS q dEPS / E0, multiple = price - EPS (holds the interaction). Additive over any group.

## Basket, coverage, exclusions
Basket = the index on the start date, followed to the end date even if a name left. Names with no end price (acquired/removed) or no estimate in the file are listed in the tab (Data & method) with their weight and price return; the price return of the whole basket vs the bridge is shown.
EPS of PDD (CNY), CCEP/FER (EUR) is used as the file gives it, no FX (growth unaffected). ASML, BRK/B have no estimate in the file; FDX has none at the early dates.
Corporate-action check: names whose weight moved far more than their price (spin-offs, mergers, float) are listed; no split pattern exists in any period.
Exclusions (click rows in the detail table; sector / group / ticker) apply to every section and both indices, the rest rescale to 100%.

## UI rules
The first section shows both indices (no toggle); the others have an S&P / Nasdaq toggle and an end date. Only exclusions are shared. Axes are fixed per level so bars keep their length. Who moved the index shows either contribution (pp, weights) or own return (%), never both.

## Open items
- GAAP consensus (IS_COMP_EPS_GAAP): GOOGL, AMZN carry investment marks. Adjusted EPS (BEST_EPS) pull is a decision.
- Merge note: Market History branch also adds the `.ma-tabs` bar in index.html; keep one bar with three buttons.
