# The chart toolkit — how the Results / Estimates charts are built, and how to reuse them

**What this is.** `js/results.js` grew into a general-purpose engine for "a metric over time,
against expectations". It is currently embedded twice (Results and Estimates, inside each
company's Deep Dive ▸ Evolution) plus a third time as the Earnings *Setup* chart — but nothing
in it is Uber-specific or even Results-specific. **If you are adding a chart anywhere in the
portal, read this before writing one from scratch:** you probably want a dataset, not a canvas.

Written Aug 10, 2026, after the revamp on `feat/results-estimates-revamp`. Companions:
`docs/RESULTS_CONVENTIONS.md` (the data contract, §8 the vintage axis) and
`docs/RESULTS_ESTIMATES_HANDOFF.md` (project state).

---

## 1. What you get for free

Drop in a dataset and you inherit, with no extra code:

| | |
|---|---|
| **Four series per metric** | reported actual · Summit model · Street consensus · company guidance (as a band or a point) |
| **Two period axes** | quarterly and annual, switchable per block |
| **Three reading modes** | the level · growth · margin — each with its own axis, ticks, tooltip and table rows |
| **Two growth units** | percent, or the amount added over the base period |
| **Windowing** | range presets, a two-handle slider, drag-to-zoom on the chart, double-click to reset |
| **A vintage axis** | read every estimate as of a chosen snapshot, or as of a date, or "closest before each print" |
| **Two tables** | a period table and (in Estimates) a per-fiscal-year revision record, both collapsible and both filtered to exactly what the chart is drawing |
| **A surprise scorecard** | every print scored against any base and any set of comparators |
| **Chrome** | legend chips that hide series, a forecast zone, muted forward labels, beat/miss colouring, "no guidance" flags, unit-aware formatting ($M/$B/EPS/counts/percent) |

## 2. The anatomy of a block

A *block* is one section of a pane (Top Line, Margins & Profitability, KPIs). Every block is
self-contained and holds its own state — one block can be annual growth in dollars while the
next is quarterly levels.

```
┃ Top Line   [ Mobility Gross Bookings ▼ ]          ← row 1: WHAT am I looking at
  [Quarterly|Annual] [$B|Growth] [YoY|QoQ] [%|Amount]      Range  Last 4Q · Last 8Q · …
                                                     ← row 2: HOW (left) · WINDOW (right)
  ■ Actual  ■ Summit model  ■ Consensus  ■ Guidance range   ← legend chips, click to hide
  ┌───────────────────────────────────────────────┐
  │  chart                                        │  ← drag to zoom · double-click resets
  └───────────────────────────────────────────────┘
  ●────────────────────────────────────●            ← period slider (two handles)
  ▸ Period detail    show · Mobility GB, 18 periods in the selected range
```

**Row 1 is identity, row 2 is treatment.** That split is deliberate: the metric select answers
"which line", everything on row 2 answers "how do I want to read it", and Range answers "over
what window". Controls that change what a number MEANS live on the left; controls that change
which numbers are on screen live on the right.

## 3. Periods

**Period keys are strings and they are fiscal.** Quarterly is `'3Q22'`, annual is `'2026'`.
There is no date arithmetic anywhere in the engine — ordering comes from `rsOrdIn`, which turns
`3Q22` into `y*4+q`. A company with an off-calendar fiscal year needs no special handling: its
`3Q26` is whatever the company says it is.

**Every array is parallel to `periods`.** `act`, `summit`, `cons`, `guideLo`, `guideHi` all have
the same length, and `null` means "not available". There is no sparse form and no dates.

**`act: null` is what makes a period FORWARD.** That single rule drives the forecast shading, the
muted axis labels, the "E" marks in the table, and which periods the surprise scorecard can
score. You never declare a period to be an estimate — you leave its actual empty.

**Forward horizons are trimmed on render, not on disk** (`rsTrimData`). Quarterly keeps forward
quarters only within the current fiscal year; annual keeps the current FY + 2. Datasets stay
complete on disk; the rendered copy is cut, and the rule re-derives itself as prints land. ⚠ This
means `getResultsData()` returns a **trimmed copy** — `_rs.data` is never the dataset module, so
asserting against the imported object in a console test shows "nothing changed" while the engine
works fine. This has cost real debugging time twice.

**Windows** are three independent mechanisms over the same axis:
* **Range presets** — `Last 4Q` / `Last 8Q` / `Reported` / `Forward` / `All` (annual: `Last 3Y` /
  `Last 5Y`). They follow the block's own view, so an annual block offers years.
* **The slider** — two handles, ticks per period, live labels at both ends.
* **Drag-to-zoom** — a horizontal drag narrows the period window, a vertical drag narrows the
  y-range, a double-click resets both (`rsAttachBrush`). The axis a drag applies to is decided by
  the drag's own shape, not by where it started.

## 4. The three reading modes

This is the part most worth reusing, because it is where charts usually go wrong.

### Level

The reported number, scaled and formatted by the metric's `unit`:

| `unit` | Renders as | Axis label |
|---|---|---|
| `usdM` | `$1,234M` or `$1.2B` (auto, per metric's magnitude) | `US$M` / `US$B` |
| `eps` | `$0.81`, never scaled | `US$` |
| `count` | integers with the metric's own `unitLabel` ("millions of trips") | `Units` |
| `pct` | `12.3%` | `%` |

The button carries the unit itself (`$B`, `$M`, `US$`, `Units`) rather than a generic word,
because a block knows its own metric. Do not label it "Levels" — that was tried and it says
nothing.

### Growth

Growth of every series at once, over a lag that is **1 period for annual, and 4 (YoY) or 1 (QoQ)
for quarterly**. Two units:

* **`%`** — the percentage change. Comparable across metrics of any size.
* **`Amount`** — the units added over the base period. This is the half people forget, and often
  the more honest one: a percentage flatters a small base and hides a large one. "FY2026 revenue
  was expected to add $9.6B in December and $7.1B by August" is the sentence a model argues about.

**The base rule, which every part of the system shares:** a series is measured against the
**reported** period one lag back wherever one exists, falling back to the same series otherwise.
So a forward estimate reads as "growth vs last year's actual", the way an analyst quotes it —
not "growth vs our own estimate of last year". The chart, the table's growth rows and the
revision record all use this same rule; none of them invents a second one.

**The guidance band is transformed too.** In growth mode the band stops being a range of dollars
and becomes *the growth the company itself signed up for* — 2Q26 guided +20.3% to +23.5% against
a +24.1% print. That comparison is the one an analyst makes mentally before every print, and it
is free once the transform exists.

**Margin lines are suppressed while growth is on.** The left axis is already a percentage, and
two unrelated percentages sharing one chart is how a reader mistakes one for the other.

### Margin

Only offered where the metric declares `marginOf` (a denominator metric key **in the same view**).
Numerator and denominator always come from the **same series** — a consensus margin is
cons/cons, a Summit margin is summit/summit. Never mix bases; a consensus numerator over Summit
revenue is a meaningless hybrid wearing a real label. The denominator falls back act → summit so
forward margins use projected revenue.

### Units in the tables

A move means different things per mode, and the tables say which:

| Mode | A value is | A move between two values is |
|---|---|---|
| Level | the level | a **percent** change |
| Growth % | a percentage | **percentage points** (`pp`) |
| Growth Amount | a currency delta | a **currency** difference |
| Margin | a percentage | **percentage points** (`pp`) |

A move below ±0.05 renders neutral ("0.0 pp") rather than red — colouring a rounding artifact
claims a line fell when it did not move.

## 5. The vintage axis (estimates as of …)

Estimates have a *when*. `estMatrix` stores, per source and per view, one **period-keyed** row per
snapshot, so the same chart can be read as of any point in history. Full contract:
`docs/RESULTS_CONVENTIONS.md` §8. What matters for reuse:

* **Three readings.** *Closest snapshot before each print* (the default, and what a hand-built
  column used to be); *as of a date* — each source resolved to its own latest file up to that day;
  *one file* — read exactly as archived, split by archive.
* **Sources keep separate calendars.** The Bloomberg workbook exports around each print; the
  Summit model is saved when the analyst saves it. On UBER they intersect **once** out of 18
  dates, which is why every option in the picker names its owner and why the as-of reading exists
  at all.
* **`preprint` falls back to the dataset's own value** on an already-reported period (the model's
  frozen projection is sharper than any snapshot saved weeks earlier) and wherever no vintage
  reaches back far enough. **The matrix adds; it never silently subtracts.**
* **A snapshot is an estimate for nothing it already knew** — rows carry forward periods only.

## 6. Tables

Two shapes, both collapsible, both **rendered from exactly what the chart is drawing**.

**Period table** (`rsRenderTable`) — periods across the top, one group of rows per series: the
value, its growth, its margin, and for estimate series the surprise against the actual. The right
column summarises the selected window (CAGR, average growth, beat/miss record).

**Revision record** (`rsEvoTrackRows`, Estimates only) — one row per line ON THE CHART: first
view, latest view, actual, revisions n↑/n↓, net move, and how far the first view sat from where
the year landed. It is SoFi's guidance table with the axis swapped: where SoFi walks a full-year
guide revised each quarter, this walks the model's saved snapshots, because Uber guides one
quarter ahead only.

**Both filter through one function** (`rsEvoVisible` in Estimates): hide a fiscal year or a source
with a legend chip and it leaves the chart, both tables and the aggregates in the same click.
There is no second place where "what is on screen" is decided — which is the only way two tables
under one chart stay honest.

**Everything starts collapsed.** The header is not a mystery bar: it carries the caret, show/hide,
and what is inside ("Mobility GB, 18 periods in the selected range"), and those counts follow the
controls above them.

## 7. The surprise scorecard

At the foot of Results: how each print landed. Pick a **base** (usually the actual) and any set of
**comparators** (Summit, Street, guidance mid) and every period becomes a bar — green when the
base came in above, red below, outlined by which series it is measured against. Percent or amount.

Two things in it are worth stealing for any bar chart with labels:

* **Labels stack per period, not per bar.** Drawing series-by-series let a second label print over
  the first bar. Drawing period-by-period, stacking from the **outermost** bar in that period,
  means nothing ever overlaps a bar or another label.
* **Labels thin themselves.** The widest label is measured against the slot a period actually
  owns; if it does not fit, only every Nth period is labelled. At 940px nothing is dropped; at
  260px it falls to every other period instead of becoming a smear. The tooltip always has
  everything.

## 8. Adding a chart — the short version

1. **Write a dataset** at `js/results-data/<ticker>.js` following §2 of the conventions. The
   minimum is one view, one section, one metric with `periods` + `act`.
2. **Register it** in the `RESULTS_DATA` map at the top of `js/results.js`.
3. **Embed it**:
   ```js
   import { resultsHtml, initResults, resultsEvoHtml, initResultsEvo } from '../results.js';
   '<div class="ovt-subpane" data-ovst="results" hidden>' + resultsHtml('UBER') + '</div>'
   // when the pane becomes visible:
   requestAnimationFrame(function(){ initResults(wrap, 'UBER'); });
   ```
   Both `*Html` helpers return `''` when the dataset (or its `evolution` block) is missing, so an
   unfinished ticker renders nothing rather than breaking.
4. **Group the metric dropdown by FAMILY, segments inside** — `Gross Bookings ▸ Total · Mobility ·
   Delivery · Freight`, not the transpose. Every company has a few families with segments beneath
   them, so this shape homogenises across tickers; segment-first does not. The option text stays
   the metric's full name (a closed `<select>` shows only the option, never its group header).
5. **Add `evolution` and/or `estMatrix`** only when you have the data. Everything degrades: no
   `evolution` ⇒ no Estimates pane; no `estMatrix` ⇒ no vintage picker; no `guideLo/Hi` ⇒ a "no
   company guidance" flag instead of a broken band.

## 9. Gotchas that have each cost an hour

* **Charts build lazily** and Chart.js needs a laid-out canvas, so every init runs under
  `requestAnimationFrame` when its pane becomes visible. In an unfocused or occluded tab rAF is
  starved and the charts read as "never built" — monkey-patch it to `setTimeout` before concluding
  the wiring is broken. But **do not leave that patch on in the full portal**: it fires two builds
  in one tick and throws `Canvas is already in use`.
* **The engine renders more than once per page** (Results + the Earnings Setup chart), so ids are
  duplicated. Scope every lookup to the pane. A `document.getElementById` will silently find the
  other instance's element — this has produced two bugs that rendered perfectly and did nothing,
  and one false bug report during testing.
* **`getResultsData()` returns a trimmed copy.** See §3.
* **Click the controls; never trust the markup.** Both bugs in `e21b11b` looked right in the DOM
  and did nothing.
* **Curly quotes are fatal.** A `’` used as a JS string delimiter took down `js/results.js` for
  every company once. Typographic quotes inside prose are fine; delimiters and HTML attributes
  must be straight.
* **No `node` on the Windows box** — JS cannot be syntax-checked offline. Import the module in the
  browser instead. `py` is the Python interpreter (`python` is a broken stub), and a heredoc into
  `py -` hangs.

## 10. Where the code is

| Area | Functions |
|---|---|
| Pane shells | `resultsHtml` `rsBody` `rsTopRowHtml` `rsBlocksHtml` · `resultsEvoHtml` `rsEvoBlockHtml` |
| Per-block controls | `rsBlockModesHtml` `rsLevelLabel` `rsSelectHtml` `rsOptLabel` |
| Reading modes | `rsIsGrow` `rsGrowAmt` `rsGrowBase` `rsGrowArr` `rsLook` `rsGrowLabel` `rsMarginArr` |
| Chart | `rsBuildChart` `rsFwdZone` `rsAttachBrush` `rsWireBrush` `wireSliders` |
| Tables | `rsRenderTable` `rsTableHeadHtml` · `rsEvoVisible` `rsEvoTrackRows` `rsRenderEvoTrack` `rsRenderEvoTable` |
| Vintage axis | `rsMatrix` `rsVintages` `rsVintSrcs` `rsVintAsOf` `rsAsOfDates` `rsVintFor` `rsSeriesFor` **`rsApplyVintage`** `rsVintNote` `rsVintSelHtml` |
| Surprise scorecard | `rsSurpBlockHtml` `rsBuildSurp` `rsSurpLabels` `rsSurpTableRender` `rsRerenderSurp` |
| Estimates extras | `rsEvoActual` `rsEvoActYears` `rsEvoActHtml` (the Reported marker) `rsEvoPct` `rsEvoBasis` |
| Data prep (offline) | `scripts/consensus/emit_matrix.py` (Street) · `emit_summit_matrix.py` (model) · `emit_evolution.py` (the Estimates block) · `verify_preprint.py` |

Styles are in `css/results.css`; the collapsible (`rs-collap`) and the toggle row (`rs-modes`,
`rs-block-modes`) live there rather than in the overview modules, because the engine is generic
and `js/overviews/*.js` inject their own CSS inline.
