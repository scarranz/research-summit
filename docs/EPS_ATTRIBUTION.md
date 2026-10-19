# EPS Attribution (Market Analysis tab)

Splits an index move into **forward-EPS growth** and **forward-multiple change**, by sector / industry group / security.
Code: `js/eps-engine.js` (maths, tested by `tests/eps-engine.test.mjs`), `js/eps-attribution.js` (UI), `js/eps-charts.js`, `css/eps-attribution.css`.
Data: `js/eps-attribution-data.js`, built by `python scripts/eps-attribution/extract_eps.py "<Index EPS Contribution Analysis.xlsx>" --write`.

## The identity
Forward multiple = price / forward-year EPS. **The forward year rolls**: from Oct 1 it is next year (Jan 2 2026 -> CY2026, Oct 16 2026 -> CY2027). Never trailing.
`1 + R = (1 + g)(1 + m)`; R price return, g aggregate forward-EPS growth (EPS of the year ahead now vs at the start), m forward P/E change.
When the year rolls, g splits into the growth already expected for the new year at the start and the revisions since (shown in the hero). Fixed CY2026 / CY2027 are selectable.

## Aggregate vs weighted average
- **Aggregate** (used for the identity): index earnings = sum(q x EPS), q = weight / price at the start (implied index shares). g = E1/E0 - 1.
  Each stock counts by its share of index earnings (weight x earnings yield).
- **Weighted average**: sum(index weight x stock growth), stock growth capped +-100%. Weights are the **index weights of the file (float-adjusted)**; price enters only through q.
They differ whenever growth is correlated with earnings yield; the tab shows both, plus equal-weight and median, with and without semiconductors.

## Contributions
Per security (pp of the index): price q dP / I0, EPS q dEPS / E0, multiple = price - EPS (holds the interaction). Additive over any group, so sectors, industry groups and securities all sum to the index.

## Basket and coverage
The basket is the index at the start date, followed to the end date even if a name left the index. Entrants are not in it. Names dropped from the bridge are listed in the tab (no end price: acquired/removed; no EPS: non-USD reporters ASML, PDD, CCEP, FER nulled, BRK/B, FDX, ERIE).
Exclusions (click rows; sector / group / ticker) apply to both indices and rescale the rest to 100%.

## Data caveats / open items
- Bloomberg GAAP consensus (IS_COMP_EPS_GAAP), calendarised Dec-31: GOOGL, AMZN carry investment marks. Decision pending: adjusted EPS (BEST_EPS).
- Non-USD filers dropped (no FX column).
- Snapshots: 2025-10-01, 2026-01-02, 2026-04-01, 2026-07-01, 2026-10-16.
- Merge note: Market History branch also adds the `.ma-tabs` bar in index.html; keep one bar with three buttons.
