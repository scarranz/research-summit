# Results — the actuals-vs-expectations section (v1 · Jul 27, 2026 · AMZN pilot)

**What this is:** the standardized **Results** section — how each earnings print landed against
(1) the **Summit model**, (2) **Street consensus** and (3) the **company's own guidance**, per
metric, quarterly and annual, with growth and margins. Built with SAB through ~10 live
iterations on AMZN; this doc is the contract to replicate it for any ticker.

**Where it lives:** Deep Dive ▸ Evolution ▸ **Results** (a sub-tab BESIDE Call Prep — same row:
`Call Prep · Results · Guidance · Strategy · Timeline`). It is NOT a top-level profile tab
(it was one briefly; SAB moved it here). See `js/overviews/amzn.js` → `deepDiveHtml()` +
`wireDD()` for the embedding pattern.

---

## 1. Architecture

| File | Role |
|---|---|
| `js/results.js` | Generic engine. Exports `resultsHtml(ticker)` (embed string; `''` if no dataset) and `initResults()` (wire + lazy chart build — call via `requestAnimationFrame` when the pane becomes visible). Registry `RESULTS_DATA` at the top maps ticker → dataset. |
| `js/results-data/<ticker>.js` | Hand-built per-ticker dataset (see §2). AMZN: `js/results-data/amzn.js`. |
| `css/results.css` | Styles. Note `.rs-wrap { --brand: var(--navy) }` (the AVE pill styles need it outside overview scope). |
| `docs/references/fiscal-ai/` | Source documents dropped by the team: Fiscal.ai UI screenshots, `FA_AMZN_US.xlsx` (BBG consensus export), `AMZN Summit Projections.xlsm` (model export). |

**Embedding (per company deep-dive module):**
```js
import { resultsHtml, initResults } from '../results.js';
// Evolution pane: '<div class="ovt-subpane" data-ovst="results" hidden>' + resultsHtml('AMZN') + '</div>'
// on sub-tab switch to results: requestAnimationFrame(initResults)
```

## 2. Dataset shape (`js/results-data/<ticker>.js`)

```js
export var <tk>Results = {
  updated, intro, source,                    // strings
  views: {
    q: { label:'Quarterly', note, sections:[...], metrics:{...} },
    y: { label:'Annual',    note, sections:[...], metrics:{...} }
  }
}
// section: { key:'top'|'margins', label, defaultMetric, groups:[{label, keys:[metricKey]}] }
//   groups feed the grouped <select> (Totals / Segments / Revenue lines / …)
// metric: { label, short, unit:'usdM'|'eps', marginOf?:<metricKey>, marginLabel?,
//   periods:[...], act:[], summit:[], cons:[], guideLo:[], guideHi:[], note }
//   All arrays parallel to periods; null = not available; act:null ⇒ forward ("E") period.
//   marginOf points at the revenue metric IN THE SAME VIEW used as margin denominator
//   (denominator falls back act → summit so forward margins use projected revenue).
```

AMZN quarterly periods run `1Q23 … 2Q28` (13 reported + 9 forward); annual `2020 … 2028`.

## 3. UI contract (what the engine renders, per section block — sections are STACKED, not toggled)

1. **Two blocks**: *Top Line* (revenue + segments + revenue lines; amber **YoY-growth line** on
   right axis) and *Margins & Profitability* (op income / EPS / capex / segment op income;
   **margin % lines** on right axis: actual solid, Summit dashed, consensus dotted).
2. **Metric picker** = grouped `<select>` (optgroups from `sections[].groups`) — NOT pill walls.
3. **Legend chips** are clickable — each toggles its series (Actual / Summit / Consensus /
   Guidance range / growth-or-margin line). Guidance renders as a translucent floating band.
4. **Dual-handle period slider** below the chart with **one tick dot per period** (filled navy =
   reported in window; light blue = estimate in window; hollow dashed = outside window).
   Everything below recomputes for the window.
5. **Range analytics tiles** — ALWAYS read from the ACTUAL's point of view ("Actual vs Summit:
   8 above · 5 below · actual avg +0.5% · +$0.9B vs estimate"; ▲/green = actual above estimate =
   beat). Guidance tile: above/within/below the range + avg vs midpoint. Top Line adds a growth
   tile (avg YoY + Fiscal-style range headline: total change + CAGR — **reported observations
   only**). Margins adds avg margin (actual vs Summit vs consensus).
6. **Fiscal.ai-style transposed table**: periods as columns (oldest → newest), bare numbers
   (unit stated once in the caption), shaded **E** columns, sticky header + sticky metric column
   + sticky right **"Range record"** column, row+column hover crosshair. Row structure per
   reference: **value → YoY growth → surprise (→ margin)**. Actual's YoY-growth row computes
   ONLY between reported observations (estimates are not observations — no growth in E columns);
   Summit/Consensus growth rows measure their estimate vs the reported base a year back. The
   "Range record" column answers "how close has each source tracked the reported numbers":
   nAbove▲ · nBelow▼ + actual avg dev in % and $, avg margins, CAGR, guidance hit-rate.

## 4. Data sources — where every column comes from (AMZN recipe)

| Column | Source | Notes |
|---|---|---|
| `act` (quarterly & annual) | Company 8-K press releases (SEC EDGAR, exact figures) + the model's **Actuals History** sheet | Cross-check sums: segments must tie to totals to the dollar. |
| `summit` (quarterly, per segment) | **`AMZN Summit Projections.xlsm` → "Projection History" sheet** | ⚠ KEY LESSON: the model keeps **frozen per-quarter projections back to 1Q22 for SEGM-source metrics** (USREV/INTREV/AWS revenue; OPINC/OPINC2/OPINC3 = GAAP segment op income), identical across vintages — frozen at print time, SoFi-style. The total-revenue metric (`REV`, DEFAULT source) IS zeroed for past quarters — do not conclude from it that no history exists (we did, wrongly, at first). **Totals = sum of the segment projections** (ties within $1M). |
| `summit` (annual forward) | Same file, latest vintage block (blocks stack vertically; col 135 = Snapshot Date; annual cols 9–36 = 2018–2045; quarterly cols 38–133 = Q1'22–Q4'45) | Vintages found: 2025-12-18 / 2026-02-10 / 2026-05-05. Also: frozen ANNUAL segment projections survive for closed years. CapEx is projected ANNUALLY only. |
| `cons` (quarterly, pre-print, reported quarters) | Earnings-day press coverage (CNBC citing Refinitiv → 2Q23, LSEG after; AWS per StreetAccount) — compiled by a web-research agent against the articles + 8-Ks | Accuracy > completeness; null what can't be verified. |
| `cons` (quarterly forward) | **`FA_AMZN_US.xlsx`** (BBG BEst export, sheets "Multiple Periods …"): cols = quarters (Rep/Fwd), rows = Revenue, EPS, product lines (Online/Physical/3P/Ads/Subs/AWS/Other), NA/Intl revenue, **NA/Intl operating MARGIN in %** (not $ — multiply by consensus revenue to get $), total op income, op margin, capex | AWS op income consensus is DERIVED: total − NA − Intl (BBG has no direct line); sanity-check the implied margin. |
| `cons` (annual) | BBG estimates stored in the Summit model (`*_BBG_EST` metrics, `actuals_history` row = the pre-print consensus for closed years 2020-2025; `projection_history` = forward) + sums of the quarterly export for capex/segments (label "blended" when mixing a reported quarter) | |
| `guideLo/Hi` | The company's guidance in the PRIOR quarter's 8-K (Amazon guides net sales + GAAP op income only) | |

**MCP vs file:** the Summit MCP (`get_fundamentals`, sheets `projection_history` /
`actuals_history`, `snapshot_date` for vintages) mirrors the file but (a) the metric LABELS can
mislead — AMZN's "US_EBITDA/AWS_EBITDA…" MCP values are actually the **GAAP segment op-income
projections** (we briefly shipped a bogus "+44% modeling gap" by comparing them against EBITDA
actuals), and (b) MCP snapshot 2026-05-13 disagrees with the file's 2026-05-05 vintage on annual
EBITDA (238/302/310 vs 208/261/292 $B) and 2028 revenue — **open reconciliation with San/Oscar;
the file was treated as authoritative per SAB.**

**Parsing the Excels:** `py` + `openpyxl` (`data_only=True`). Print raw cell values before
trusting rounded output (the BBG margin rows carry full precision).

## 5. Reading conventions (hard rules learned in review)

- **Everything reads from the ACTUAL's point of view**: "the actual came in +X% above what
  [Summit/consensus] estimated". ▲/green = beat, everywhere (cells, tiles, Range record).
- **Estimates are not observations**: the Actual row/tile/CAGR never shows growth into E periods.
- **No mixed bases**: never compare an op-income projection to an EBITDA actual (see §4); when a
  consensus line is on a different basis (BBG "comparable" EPS vs GAAP), note it.
- Derived/blended figures are labeled as such in the metric `note`.

## 6. Replicating for a new ticker — checklist

1. Ask the team for the two exports into `docs/references/fiscal-ai/` (or a per-ticker folder):
   the **model export** (Projection History / Actuals History) and the **BBG consensus export**.
2. Parse both with openpyxl; map the vintage blocks; verify frozen-quarter behavior and that
   segment sums tie to totals.
3. Compile guidance + pre-print consensus per quarter with a web-research agent (SEC 8-Ks +
   earnings-day coverage). Amazon-style prompt: see the AMZN session (guidance ranges, LSEG/
   Refinitiv revenue+EPS, StreetAccount segments, per print).
4. Build `js/results-data/<ticker>.js` (shape §2): quarterly + annual views, sections/groups
   tailored to the company (e.g. UBER: Totals / Mobility / Delivery / Freight), `marginOf` links.
5. Register the ticker in `RESULTS_DATA` (`js/results.js`).
6. In the company's deep-dive module, add the Evolution sub-tab row with **Results beside Call
   Prep** and wire `initResults` on visibility (copy from `amzn.js`).
7. Verify: segment sums tie; every note states its source; beat/miss coloring is actual-centric;
   sliders/ticks/dropdown/legend chips work; no console errors.

## 7. Open items / next iterations (as of Jul 27, 2026)

- Estimate-EVOLUTION view across vintages (dic → feb → may): e.g. FY26 capex was re-rated
  **$151B → $205B** after the 4Q25 print — the vintage data is already parsed, chart not built.
- MCP-vs-file EBITDA / 2028-revenue reconciliation (ask San/Oscar which is current).
- Model flag to raise: 2028 total capex ($150.8B) vs the model's own segment capex sum (~$245B).
- Fiscal look-and-feel: density toggle (hide sub-rows), value labels on bars (needs the
  datalabels plugin — not added to keep zero-build).
- Segment-EBITDA metrics were REMOVED (mixed-basis bug); a true EBITDA-by-segment comparison
  needs consistent definitions first.
- AMZN Overview/Deep Dive: Deep Dive sections still scaffolded (fill via the Call Prep flow /
  by hand); Call Prep phases pending "arma el Call Prep de AMZN".
