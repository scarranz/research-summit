# Results — the actuals-vs-expectations section (v1 · Jul 27, 2026 · AMZN pilot)

**What this is:** the standardized **Results** section — how each earnings print landed against
(1) the **Summit model**, (2) **Street consensus** and (3) the **company's own guidance**, per
metric, quarterly and annual, with growth and margins. Built with SAB through ~10 live
iterations on AMZN; this doc is the contract to replicate it for any ticker.

**Where it lives:** Deep Dive ▸ Evolution ▸ **Results** (a sub-tab BESIDE Call Prep — same row:
`Call Prep · Results · Estimates · Guidance · Strategy · Timeline`). It is NOT a top-level
profile tab (it was one briefly; SAB moved it here). **Estimates** (pill label; internally the
estimate-evolution pane, `data-ovst="estevo"`) is its own sub-tab at the same level (it was
briefly a stacked block inside Results; SAB split it out and later shortened the label, Jul 28).
See `js/overviews/amzn.js` → `deepDiveHtml()` + `wireDD()` for the embedding pattern.

---

## 1. Architecture

| File | Role |
|---|---|
| `js/results.js` | Generic engine. Exports `resultsHtml(ticker)` / `initResults()` (the Results pane) and `resultsEvoHtml(ticker)` / `initResultsEvo()` (the Estimate Evolution pane) — embed strings return `''` when the dataset (or its `evolution` block) is missing; call each init via `requestAnimationFrame` when its pane becomes visible. Registry `RESULTS_DATA` at the top maps ticker → dataset. |
| `js/results-data/<ticker>.js` | Hand-built per-ticker dataset (see §2). AMZN: `js/results-data/amzn.js`. |
| `css/results.css` | Styles. Note `.rs-wrap { --brand: var(--navy) }` (the AVE pill styles need it outside overview scope). |
| `docs/references/fiscal-ai/` | Source documents dropped by the team: Fiscal.ai UI screenshots, `FA_AMZN_US.xlsx` (BBG consensus export), `AMZN Summit Projections.xlsm` (model export). |

**Embedding (per company deep-dive module):**
```js
import { resultsHtml, initResults, resultsEvoHtml, initResultsEvo } from '../results.js';
// Evolution pane:
//   '<div class="ovt-subpane" data-ovst="results" hidden>' + resultsHtml('AMZN') + '</div>'
//   '<div class="ovt-subpane" data-ovst="estevo" hidden>' + resultsEvoHtml('AMZN') + '</div>'
// on sub-tab switch: results → requestAnimationFrame(initResults)
//                    estevo  → requestAnimationFrame(initResultsEvo)
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

**Optional `evolution` block** (top level, beside `views`) — feeds the *Estimate evolution*
section (added Jul 28): how the ANNUAL forecast for each fiscal year moved across the model's
saved snapshots (vintages).

```js
evolution: {
  intro, note,                                // strings
  vintages: [{ label:'Dec 18, 2025', event:'pre-4Q25 print' }, ...],
  years: ['2026','2027','2028','2029'],
  sections: [                                 // stacked blocks, mirroring Results
    { key:'top',  label:'Top Line',      defaultMetric, groups:[{label, keys}] },
    { key:'prof', label:'Profitability', defaultMetric, groups:[{label, keys}] }
  ],
  metrics: { <key>: { label, unit:'usdM',
    summit: [[v per vintage] per year],       // rows parallel to years
    cons:   [[...]] | null,                   // BBG stored IN the model at each snapshot
    prior:  { summit:[...], cons:[...] },     // Top Line only: the fiscal year BEFORE
                                              // years[0], per vintage, for implied-growth —
                                              // ALWAYS the value stored in that vintage block
                                              // (frozen projection for segments), never the
                                              // reported actual (provenance rule, §3.6a)
    marginOf, marginLabel,                    // Profitability only: margin denominator key
    note } }
}
```

## 3. UI contract (what the engine renders, per section block — sections are STACKED, not toggled)

1. **Two blocks**: *Top Line* (revenue + segments + revenue lines — growth lives in the
   TABLE's YoY rows; the chart's amber growth line was removed Jul 28 per SAB) and *Margins &
   Profitability* (op income / EPS / capex / segment op income; **margin % lines** on right
   axis: actual solid, Summit dashed, consensus dotted).
2. **Metric picker** = grouped `<select>` (optgroups from `sections[].groups`) — NOT pill walls.
3. **Legend chips** are clickable — each toggles its series (Actual / Summit / Consensus /
   Guidance range / margin line). Guidance renders as a translucent floating band.
   **Hover is period-wise** (Chart.js `interaction: {mode:'index', intersect:false}`): one
   tooltip per period listing every visible series — guidance range, actual, each estimate
   with its surprise, margin lines.
4. **Range controls** (added drag/presets Jul 28 per SAB — three equivalent ways to window):
   (a) **quick-range preset pills** between chart and slider (Quarterly: Last 4Q · Last 8Q ·
   Reported · Forward · All; Annual: Last 3Y · Last 5Y · …) — anchored to the last reported
   period; (b) **drag across the chart** to zoom to a stretch, and **drag starting on the
   y-axis strip** to set the y-range (a translucent brush box tracks either drag; double-click
   resets both — on the Estimates charts, with only 3 x-points, ANY drag adjusts the y-axis;
   y-ranges reset on metric/mode change since the units change); (c) the **dual-handle period
   slider** below, with
   **one tick dot per period** (filled navy = reported in window; light blue = estimate in
   window; hollow dashed = outside window). Everything below recomputes for the window.
5. ~~Range analytics tiles~~ — REMOVED (SAB, Jul 28): the KPI tiles that sat between the
   slider and the table duplicated what the table's sticky **"Range record"** column already
   says. Their reading conventions (actual's point of view, ▲/green = beat, reported
   observations only) live on in that column — see item 7.
6a. **Estimate Evolution** — its OWN sub-tab beside Results (no Quarterly/Annual toggle —
   the vintage data is annual by nature): one line per fiscal year across the model's saved
   snapshots, in TWO stacked blocks mirroring Results — **Top Line** (revenue + segments) and
   **Profitability** (capex/FCF/EBITDA/earnings + segment op income).
   **PROVENANCE RULE (SAB, Jul 28): this tab is fed EXCLUSIVELY by the Summit Research
   database** — which itself is populated from the DCF's Projection History tab, the only
   place vintages are referenced. Nothing from 8-Ks, actuals history, CNBC or any other
   source goes in. That includes: the BBG consensus (only because it is stored inside the
   same vintage blocks; null where Summit holds none), derived totals (sums of Summit's own
   segment rows), and `prior` for implied growth (the prior-year value stored in the same
   vintage block — for segment lines that is the model's frozen projection, NOT the reported
   actual).
   *Current state (stopgap):* the AMZN dataset was hand-parsed from the model export
   ("AMZN Summit Projections.xlsm" — a direct copy of the same Projection History) so we
   could design the representation. *Target state:* the per-ticker `evolution` dataset is
   fetched through the Summit connection (Summit DB → API/edge function), replacing the
   hand-built arrays; the dataset shape in §2 is the contract that connection must fill. Colors are an ordered
   one-hue ramp of the portal blue (`EVO_RAMP` in results.js, darkest = nearest year; validated
   with the dataviz palette checker). Solid = Summit, dashed = the BBG consensus stored in the
   model at the same snapshot (so both columns are as-of the same date). Each block has a
   **US$B / % display toggle**: Top Line's % = the IMPLIED YoY GROWTH each snapshot carries
   (first year chains to `prior` — own estimate while the year was open, reported actual once
   closed; later years chain within the same snapshot); Profitability's % = the margin over
   `marginOf`, numerator and denominator ALWAYS from the same vintage and source. Legend chips
   toggle per-year and per-source. Table: columns = vintages, rows = FY × source with
   "revision" (change vs prior snapshot) and growth/margin sub-rows, plus a sticky "Cumulative
   revision" right column (pp for the % rows). **Sign-flip rule:** a revision across zero (FCF
   flipping negative) shows dollars only — no percent.
7. **Fiscal.ai-style transposed table**: periods as columns (oldest → newest), bare numbers
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
6. In the company's deep-dive module, add the Evolution sub-tab row with **Results and Estimate
   Evolution beside Call Prep** and wire `initResults` / `initResultsEvo` on visibility (copy
   from `amzn.js`).
7. Verify: segment sums tie; every note states its source; beat/miss coloring is actual-centric;
   sliders/ticks/dropdown/legend chips work; no console errors.

## 7. Open items / next iterations (as of Jul 28, 2026)

- ~~Estimate-EVOLUTION view across vintages~~ — SHIPPED Jul 28 as the *Estimate evolution*
  block (§3.6a): annual forecasts per vintage, Summit + stored-BBG, revision table.
- **Wire Estimate Evolution to the Summit connection**: the tab's data should come from the
  Summit Research DB (fed from the DCF's Projection History) instead of the hand-parsed
  export arrays in `results-data/<ticker>.js` — likely an edge function against the Summit
  API once the portal has that connection (today the Summit DB is reachable only via the
  Claude MCP, not from the portal).
- Quarterly estimate evolution (each vintage's live forward quarters differ for SEGM metrics)
  — data exists in the export, not yet surfaced.
- MCP-vs-file EBITDA / 2028-revenue reconciliation (ask San/Oscar which is current).
- Model flag to raise: 2028 total capex ($150.8B) vs the model's own segment capex sum (~$245B).
- Fiscal look-and-feel: density toggle (hide sub-rows), value labels on bars (needs the
  datalabels plugin — not added to keep zero-build).
- Segment-EBITDA metrics were REMOVED (mixed-basis bug); a true EBITDA-by-segment comparison
  needs consistent definitions first.
- AMZN Overview/Deep Dive: Deep Dive sections still scaffolded (fill via the Call Prep flow /
  by hand); Call Prep phases pending "arma el Call Prep de AMZN".
