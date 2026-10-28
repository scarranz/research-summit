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

## Changing constituents (v9)
The period is walked one snapshot at a time (Jan 2 -> Apr 1 -> Jul 1 -> Oct 16). In each step the basket is the index at the START of the step; weights are rescaled to the names with a price and a CY2027 estimate at both ends of the step. A name that joined counts from the snapshot where it joined; a name that left counts until its last snapshot (the file keeps its price and estimate on the snapshot after it left). Steps are linked by the index's own growth (contribution = sum over steps of index value at the step start x the step's contribution), so securities, groups, sectors and index add up exactly to the index return. Check against the index quotes (Yahoo ^GSPC / ^NDX, price return Jan 2 -> Oct 16): S&P 500 +11.68% vs +11.78% here, Nasdaq-100 +15.80% vs +15.30%; a fixed Jan 2 basket gave +12.1% / +17.8%. Steps match within 0.5 pp (S&P -4.2/13.9/2.4 vs -4.1/13.8/2.4; NDX -5.0/23.8/-2.0 vs -4.7/24.1/-2.1).
A stock's own change (EPS, P/E, price) is its steps chained over the time it was held; a group's own change is its steps chained, each step the weight-average of its stocks. A name with no price/estimate in the file for a step is n/a for that step (0 pp). A name with EPS <= 0 at the start of a step has no % change: EPS effect 0, price move all multiple. Row weights shown: start = weight in the first step (0 if it joined later), end = weight at the end date (0 if it left).
AZN left the Nasdaq-100 after Mar 2026 and the saved xlsx has no AZN row after Jan 2: its closes (NYSE, USD) come from Yahoo Finance and its EPS is held at the last estimate (SUPPLEMENT in extract_eps.py, noted in Data & method). Drop SUPPLEMENT when the file carries the rows.


## Basket, coverage, exclusions
Basket = the index on the start date, followed to the end date even if a name left. Names with no end price (acquired/removed) or no estimate in the file are listed in the tab (Data & method) with their weight and price return; the price return of the whole basket vs the bridge is shown.
EPS of PDD (CNY), CCEP/FER (EUR) is used as the file gives it, no FX (growth unaffected). ASML, BRK/B have no estimate in the file; FDX has none at the early dates.
Corporate-action check: names whose weight moved far more than their price (spin-offs, mergers, float) are listed; no split pattern exists in any period.
Exclusions (click rows in the detail table; sector / group / ticker) apply to every section and both indices, the rest rescale to 100%.

## UI rules
The first section shows both indices (no toggle); the others have an S&P / Nasdaq toggle and an end date. Only exclusions are shared. Axes are fixed per level so bars keep their length. Who moved the index: What (EPS estimate | Multiple | Price) x Measured as (contribution in pp | own change in %). One-stock lookup: its CY2027 estimate over the 5 snapshots plus its own EPS x P/E = price and what it added to each index. Concentration: expected CY2027 earnings only (value concentration lives in Index Analysis), pick any dates, hover = the names.

## Open items
- GAAP consensus (IS_COMP_EPS_GAAP): GOOGL, AMZN carry investment marks. Adjusted EPS (BEST_EPS) pull is a decision.
- Merge note: Market History branch also adds the `.ma-tabs` bar in index.html; keep one bar with three buttons.

## Data rules (v5)
- Removed by decision: FDX, MBGL (Mobility Global), MMED. A missing estimate takes the first one available LATER in time (flat, not guessed).
- BRK/B: the file carries Class A EPS; divided by 1,500 in the extractor. GOOG uses its own EPS (GOOGL only as fallback).
- Detail table order is fixed by the whole index at the latest date; exclusions never reorder rows. Total contribution = weight x price return; From EPS = share of the change in index earnings; From multiple = Total - From EPS.
