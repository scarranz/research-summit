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
//   groups feed the grouped <select> — GROUP BY METRIC FAMILY, SEGMENTS INSIDE (see below)
// metric: { label, short, seg?, unit:'usdM'|'eps', marginOf?:<metricKey>, marginLabel?,
//   periods:[...], act:[], summit:[], cons:[], guideLo:[], guideHi:[], note }
//   All arrays parallel to periods; null = not available; act:null ⇒ forward ("E") period.
//   marginOf points at the revenue metric IN THE SAME VIEW used as margin denominator
//   (denominator falls back act → summit so forward margins use projected revenue).
```

AMZN quarterly periods run `1Q23 … 2Q28` (13 reported + 9 forward); annual `2020 … 2028`.

### Grouping rule — by metric family, segments inside (SAB, Aug 10 2026)

A dropdown group is a **metric family**; its options are the **segments** of that family:

```js
{ label: 'Gross Bookings', keys: ['gb', 'mobgb', 'delgb', 'frgb'] },   //  Total · Mobility · Delivery · Freight
{ label: 'Revenue',        keys: ['rev', 'mobrev', 'delrev'] }        //  Total · Mobility · Delivery
```

**Not** the transpose (`Mobility ▸ GB · revenue`), which is how UBER started. The reason is the
rollout: every company has a handful of families and a few segments beneath them, so this shape
carries across tickers, while a segment-first grouping is different for every business.

The option TEXT is the segment, because the group header already carries the family. Declare it
as `seg` on the metric (`seg: 'Mobility'`); `rsOptLabel` falls back to the full `label`, so a
metric with no segments — or a dataset not yet regrouped — still reads correctly and nothing has
to be migrated in one go. Everything else (chart title, table row headers, tooltips) keeps using
the full `label`, so "Mobility Gross Bookings" is still what the chart says it is.

Sections whose metrics are not segmented (Margins & Profitability, KPIs) keep a plain group —
there is no family to fold them into and inventing one would be noise.

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
2b. **Growth-basis toggle** (SAB, Jul 28) — beside the Quarterly/Annual toggle, VISIBLE ONLY in
   Quarterly: **YoY** (vs the same quarter last year, default) ⇄ **QoQ** (vs the previous
   reported quarter). Flips every growth row/summary label and lag; CAGR annualization always
   uses the view's periods-per-year, never the growth lag. Annual is always YoY.
3. **Legend chips** are clickable — each toggles its series (Actual / Summit / Consensus /
   Guidance range / margin line). Guidance renders as a translucent floating band.
   **Hover is period-wise** (Chart.js `interaction: {mode:'index', intersect:false}`): one
   tooltip per period listing every visible series — guidance range, actual, each estimate
   with its surprise, margin lines.
4. **Range controls** (added drag/presets Jul 28 per SAB — three equivalent ways to window):
   (a) **quick-range preset pills** in the block header row beside the metric select — no
   how-to hint text on the page (SAB) — (Quarterly: Last 4Q · Last 8Q · Reported · Forward ·
   All; Annual: Last 3Y · Last 5Y · …), anchored to the last reported
   period; (b) **drag across the chart** to zoom to a stretch, and **drag starting on the
   y-axis strip** to set the y-range (a translucent brush box tracks either drag; double-click
   resets both — on the Estimates charts, with only 3 x-points, ANY drag adjusts the y-axis;
   y-ranges reset on metric/mode change since the units change); (c) the **dual-handle period
   slider** below, with
6b. **Actuals vs Estimates — generic surprise history** (bottom of the Estimates pane, any
   ticker; added Jul 28 per SAB): fed ONLY from the Results dataset — every quarterly metric
   with at least one actual + frozen-Summit-estimate pair (revenue, segments, op income,
   EBITDA…). Diverging surprise bars over the reported range (▲ green = beat, ▼ red = miss;
   value printed on each bar), a **Surprise % ⇄ $ amount** toggle, the tick-dot slider, and
   the transposed table (Actual → YoY growth → Summit estimate → YoY growth → surprise +
   Range record). Growth here is always YoY — independent of the Results pane's toggle. A
   dataset opts out with **`surprise: false`** (SoFi does: its bespoke block in sofi.js is
   richer — KPIs, expense lines with flipped favorability).
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

8. **Forward horizon (SAB, Jul 29, 2026)** — estimates render only as far as the DCF
   actually models them, derived IN THE ENGINE per dataset from its own last reported
   period (no per-company config; fiscal-aligned since period labels are fiscal):
   **Quarterly** — forward quarters only within the CURRENT fiscal year (the FY of the
   next print). **Annual** — forward years capped at current FY + 2. **Estimate
   Evolution** — same annual cap. Datasets stay complete on disk (keep building the
   full arrays — nothing is deleted); `getResultsData()` serves a trimmed copy, and the
   window re-derives automatically as each print's actuals are filled in.

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
- **Guidance is a third basis you must GO SOURCE (per metric, per period).** `guideLo`/`guideHi` come
  from the company's OWN guide, given in the PRIOR quarter's release / 8-K, for the metrics it actually
  guides — score the actual against it (below / meets / above), and render the translucent band. **Not
  every company or metric has guidance** (Amazon: net sales + GAAP op income only; Alphabet: none). A
  `null` must mean *checked, none given*, never *did not look*; where none exists, **say so** (a `note`
  / the "no company guidance" disclaimer) — never fabricate a guide. (Full rule: `EARNINGS_CONVENTIONS.md`
  §5.5.)

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

- **GOOGL (Jul 29):** the Evolution **Results + Estimates sub-tabs are wired** in `js/overviews/googl.js`
  (row: `Earnings · Results · Estimates · Guidance · Strategy · Timeline`) and **`GOOGL` is registered
  in `RESULTS_DATA`**. The dataset `js/results-data/googl.js` was **reconstructed from the rolling
  `BBG_CONSENSUS.txt` archive** (`G:\My Drive\Summit\Docs\0\`) — not the two Excel exports Amazon used:
  - `act` = reported actuals (archive `fq0`/`fq-3`/`fy0`, freshest snapshot);
  - `cons` = the Street number that stood going in (`fq+1` before the print; forward = latest `fq+N`);
  - `summit` = **null everywhere for now** — Summit's per-line estimates are **pending the estimate-
    visibility work** (see below); this is expected, not a gap;
  - `guideLo/Hi` = null (Alphabet issues no numeric guidance).

  So GOOGL's **Results** tab renders the full Amazon-style chart+table today (Street vs actuals).
  **Estimates** stays on a pending note until an `evolution` (vintage) block exists — that needs the
  Summit projection history, which is the same blocker as the Summit column. **When Summit visibility
  is solved, populate `summit` (and add the `evolution` block) — the dataset shape already carries the
  null slots.** Generator used: a one-off `openpyxl`-free `csv` parser over the TSV (kept in the
  session scratchpad; the dataset header documents the reconstruction).

  GOOGL's Setup chart is also being rebuilt in this format, MERGED into ONE chart — see
  `docs/EARNINGS_CONVENTIONS.md` §6a-viii-bis.

**A NEW SOURCE PATH (add to §4):** a per-ticker Results dataset can be reconstructed **entirely from
`BBG_CONSENSUS.txt`** when the two Excel exports are not on hand — Street consensus (`fq+1`/`fy+N`) and
reported actuals (`fq0`/`fq-3`/`fy0`) come straight from the rolling archive; `summit`/`guide` are left
null. This is the GOOGL recipe and is the fastest way to stand up the Results chart for any covered
ticker, with Summit/guidance filled in later.

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

---

# 8. The rollout contract — `estMatrix`, the vintage axis (v2 · Aug 7, 2026)

**Why this exists.** Through v1 each dataset shipped `summit` and `cons` as flat arrays with
the pre-print snapshot already chosen *by hand*, and the choice justified in a 20-line file
comment. That made two things impossible: reading what the model or the Street said about
every period **as of one date**, and refreshing a company without re-doing the judgement. v2
stores the whole matrix and **derives** the flat series. Adding a company stops being an
authoring job and becomes a generator run.

## 8.1 Shape

```js
export var <tk>Results = {
  updated, intro, source, views: { q, y },      // unchanged — hand-curated
  estMatrix: {                                  // GENERATED — overwrite wholesale, never hand-edit
    cons:   { vintages: [ … ], q: { <metric>: { '<vintageId>': { '<period>': value, … } } }, y: { … } },
    summit: { … same shape … }
  },
  evolution: { … }                              // unchanged (Estimates tab keeps its own block)
}
// vintage: { id:'2026-08-07', label, lastActual: { q:'2Q26', y:'2025' } }
```

Rules that matter:

* **Period-keyed, not positional.** A row is `{'3Q26': 14821}`, not a 19-slot array. It survives
  the forward-horizon trim (§3.8) and any change to a metric's period axis, and a snapshot
  covering six periods costs six numbers instead of thirteen nulls.
* **At the ROOT, beside `views`** — machine-generated numbers stay out of the hand-curated metric
  blocks (labels, `act`, `guideLo/Hi`, notes). A refresh replaces one block and touches nothing
  anyone wrote. This separation is the whole point; do not push the matrix down into the metrics.
* **`lastActual` per view is the only date logic needed.** A vintage is an *estimate* for every
  period after its own last reported period — so "pre-print" is computable and no per-period
  report dates are required anywhere.
* **Back-compatible.** A metric with no matrix row keeps its flat `summit`/`cons`. The picker only
  renders when a dataset has an `estMatrix`, so the other seven tickers are untouched.

## 8.2 The two reading modes (engine)

| Mode | Meaning |
|---|---|
| `preprint` (default) | Per period, the latest snapshot whose `lastActual` is still *before* it — the shortest forward horizon, ties broken by the later snapshot. Reproduces the v1 hand-picked columns. |
| `<vintageId>` | That one snapshot's row read straight across. Periods it never covered stay **null** — blank, not zero, and never a silent fallback to an older snapshot. |

**`preprint` has two fallbacks to the dataset's own flat array, and both matter.**

1. **On an ALREADY-REPORTED period the flat value wins.** It is the projection the model *froze at
   that print*; a snapshot is only ever as fresh as the day it was saved. UBER 1Q26 revenue reads
   **14,040 frozen against 14,014** in the last file saved before it (Feb-5, three months stale),
   and 4Q25 EPS **0.894 against 0.6151**. Neither number is wrong — that is the model moving between
   its last save and the print.
2. **Where no vintage reaches back far enough, the flat value is kept, not blanked.** Model snapshots
   typically begin long after the reported history does (UBER's oldest is Dec 2025 against a history
   opening in 3Q22).

Stated the other way: **the matrix ADDS to a dataset and never silently subtracts from it.** Where it
has a value the dataset lacked it fills the hole (UBER: 1Q26 trips, FY2025 across the annual view).
Single-vintage mode is unaffected by both rules — blanks stay blank there.

`rsApplyVintage()` resolves the selection into `m.summit` / `m.cons` once. Those arrays are read
in ~40 places; resolving centrally means no reader changes. The flat arrays are stashed as
`m._flat_<src>` on first use, so switching modes never compounds.

**Sparseness is a property of the source, not a bug.** A Bloomberg snapshot carries 4 forward
quarters and 6 forward years, so single-vintage mode is rich annually and inherently thin
quarterly. The Summit model projects every quarter, so its matrix will fill the quarterly axis.
State this rather than padding it.

## 8.3 Where the numbers come from

| Column | Source | Rule |
|---|---|---|
| `estMatrix.cons` | **`Consensus_Portal.xlsm` → sheet `BBG_CONSENSUS`** ∪ **`BBG_CONSENSUS.txt`** (`G:\My Drive\Summit\Docs\0\`), deduped by `data_as_of` | ⚠ **Read the UNION.** The `.txt` is the exported archive; the sheet is live and **overwrites its most recent row**. On UBER the archive holds `2026-07-31` and the sheet holds `2026-08-07` — and 07-31 is the pre-print consensus for the very quarter the tab scores. Reading either alone silently loses a snapshot. Export the `.txt` before each refresh. |
| `estMatrix.summit` | Summit MCP `get_fundamentals(snapshot_date=…, sheet_sources=['projection_history'])`, one pull per snapshot, through `scripts/consensus/emit_summit_matrix.py` | **Dedupe by `facts_hash`, not by date** — UBER's `2026-05-06` and `2026-05-07` are the same model state (LYFT had the same duplication). Skip intra-period saves; `2026-07-20` is unusable (its Delivery-Hero pro-forma toggle was on). Pull **only the periods forward of that snapshot's `lastActual`** (see below). **Drop literal zeros** — in these models a `0` is a row nobody populated, not a forecast of nothing. Where a row exists twice under different `source` tags (UBER's annual FCF: DEFAULT 11,338 vs SEGM 10,665), decide in the config and let the generator report every conflict it resolves. |
| `act` | Summit MCP `actuals_history`, cross-checked against the release | Unchanged from v1. Bloomberg's own `(Rep)` columns are **not** a substitute — see below. |
| `guideLo/Hi` | The company's release, or the model's guidance rows where populated | UBER's `*_GUIDANCE` rows exist and are all literal `0`; ask San/Oscar to fill them and the next refresh reads from the model. |

**A snapshot is an estimate for nothing it already knew.** Its `projection_history` also carries
frozen projections for quarters already reported, but those belong to whatever vintage stood before
*that* print — filing them under the snapshot's own date would date them wrong. Hence forward-only
rows, and hence the `preprint` fallbacks in §8.2.

**A reported year holds the ACTUAL, not a forecast.** Once FY2025 printed, the model's annual row and
the workbook's stored consensus both carry the reported figure. Estimate lines therefore go *flat*
after the print rather than continuing to move — say so on screen; it is what the Reported toggle is
for, not a bug to hide.

**A model row that does not tie to the reported basis stays null.** UBER's annual `ADJ_OPINC` reads
7,470 against a 6,453 reported non-GAAP operating income, the same ~20% spread that sits in every
2025 quarter and closes in 2026. Charting it against the Reported marker publishes a miss the model
never made. Same rule as `act`: never fill with a number you cannot stand behind.

**Only FORWARD horizons are consensus.** `fq+1…fq+4` / `fy+1…fy+5` are estimates. `fq-3`, `fq0`
and `(Rep)`-marked `fy0` are Bloomberg's *own reported* figures and belong to no estimate series —
they can also sit on a different basis than the company's measure (UBER's reported "ebitda" for
1Q24 reads 708 against a 1,382 Adjusted EBITDA print, which once manufactured a 46% miss).

**Bloomberg's adjusted-EPS baskets are off-basis before they reconcile.** For UBER both the `eps`
column and `kpi5` (`adj_eps`) imply ~0.8 for 2Q25 against a 0.602 print; consensus is therefore
kept null before 4Q25 via a per-metric "valid from" rule in the generator. Check this per ticker
rather than trusting the column name.

**KPI slots are per-ticker and declared in the file** (`metric_kpi1…8`). UBER: `kpi1`
mobility GB, `kpi2` delivery GB, `kpi3/4` take rates, `kpi5` adj EPS, `kpi6` trips per MAPC,
`kpi7` total trips, `kpi8` total gross bookings. Read the header row; never assume the slot order.

## 8.4 Adding a company — the short version

1. Confirm coverage: is the ticker in the workbook's `BBG_CONSENSUS` sheet, and how many
   snapshots does it have? (As of Aug 7 2026: **32 tickers**, 10 with 11–13 snapshots and 22
   seeded that day with one each — a single snapshot still gives a usable forward column, just no
   revision history.) Confirm the Summit MCP has snapshots via `list_snapshots`.
2. Write the metric → BBG-column map and the per-metric "valid from" exceptions.
3. Generate `estMatrix`, then **verify the derived `preprint` series against whatever the file
   already shipped.** Every mismatch is either a rounding difference, a genuine refresh, or a bug —
   identify which before moving on. This check is what caught the overwritten snapshot above.
4. Hand-curate only what a machine cannot: labels, groups/sections, `act` reconciliation, guidance,
   and the basis notes.
