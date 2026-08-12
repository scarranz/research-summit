# The chart engine — full reference

Every chart in Results and Estimates lives in one file, `js/results.js` (~3,970 lines). This
document is the **map**: which blocks exist, which functions they share, which are theirs alone,
how each one feeds the table under it, and what every toggle actually changes.

Companions, and when to read which:

| Doc | Read it for |
|---|---|
| `docs/CHART_TOOLKIT.md` | **why** the engine is shaped this way, and how to reuse it for a new chart |
| `docs/RESULTS_CONVENTIONS.md` | the **data contract** — what a dataset must contain (§8 = the vintage matrix) |
| **this file** | **what** every function and control does, in detail — and **§0, the standard every chart in the portal owes its reader** |

**If you are about to build a chart, start at §0.** It is the checklist: what every chart must do
regardless of what it plots, what the engine will hand you for free, and the exact call for each
piece. Everything after §0 is the detail behind those calls.

Written Aug 11, 2026 on `feat/results-estimates-v2` (merged as PR #83). Completed Aug 12, 2026 —
the summary columns, the brush internals, the slider wiring and the two invariants they imply.

---

## 0. The standard — what every chart owes its reader

Read this section before you write a chart. It is short on purpose.

**Starting a whole company rather than one chart? Jump to §0.6** — the selection steps: inventory
the data first (it decides what is even possible), take the tab spine from Amazon, then pick charts
per tab. Come back here for each chart you end up building.

### 0.1 Which path are you on

| Your chart is | Path | Start at |
|---|---|---|
| a **metric over time, against expectations** — actuals, our model, the Street, guidance | **Reuse the engine.** Write a dataset, not a canvas | `CHART_TOOLKIT.md` §8 + `RESULTS_CONVENTIONS.md` |
| a **snapshot axis** — how a forecast moved across model saves | Reuse the engine (blocks C / D / E) | §6, §7, §8 of this file |
| **anything else** — waterfall, choropleth, scatter, network, org chart, bridge | **You write the canvas.** The engine has nothing to plot for you | §0.2 below, then §0.5 |

Path 3 is the common case outside Results (TBBB's sensitivity matrix, the AMZN margin bridge, the
robotics supply map). **The rules in §0.2 still apply to it.** They are not engine features — they
are what makes twelve charts built by five people read as one product.

### 0.2 The six non-negotiables

Every chart in the portal does these six things. If yours cannot, that is a finding to raise, not a
default to skip.

| # | The rule | You get it from | Verify by |
|---|---|---|---|
| 1 | **Both axes zoom, double-click resets** | `rsAttachBrush(el, chart, onX, onY, onReset)` | drag sideways, drag down, drag on the axis strip, double-click |
| 2 | **Clicking a series hides it** — and everything downstream follows | legend chips + a `hidden{}` map in state | hide a series; the table and the summary column must lose it too |
| 3 | **A table under the chart, inside a dropdown, carrying at minimum everything drawn** | `.rs-collap` markup + a delegated `…tblb` handler | collapse it; the header still says what is inside |
| 4 | **The metric dropdown is grouped by family** | `<optgroup>` per family, segments as options | open it: `Gross Bookings ▸ Total · Mobility · Delivery` |
| 5 | **Every number carries its unit, every estimate is marked as one** | `rsFmt` / `rsModeFmt`, `act: null` → `rsFwdZone` | a forward column is shaded and marked `E`; the axis says `$B`, not `1234` |
| 6 | **Missing data renders nothing, never broken** | return `''` from the `*Html`; badge the absence | load a ticker with no guidance: an amber badge, not an empty band |

#### 1 · Zoom on both axes

One call, on every chart in the engine, and it is four lines in a new one:

```js
rsAttachBrush(canvasEl, chart,
  function(a, b){ st.win = [lo + a, lo + b]; rebuild(); },  // x-drag → period window (null if x is not windowable)
  function(v1, v2){ st.yr = [v1, v2]; rebuild(); },         // y-drag → value range
  function(){ st.win = null; st.yr = null; rebuild(); });    // double-click → reset both
```

Then honour `st.yr` where you build the scales — this half is easy to forget, and without it the
drag paints a rectangle and does nothing:

```js
min: st.yr ? st.yr[0] : undefined,
max: st.yr ? st.yr[1] : undefined
```

⚠ **Drop the zoom whenever the axis units change.** Every mode toggle in the engine sets
`st.yr = null` before rebuilding (`js/results.js:3141, 3985, 4037`, …). A y-range of `[40, 60]`
captured on a `$B` axis, re-applied to a `%` axis, silently crops the chart to nothing.

Pass `onX = null` when the x-axis is categorical and unwindowable (D and E do this) — the brush
then treats every drag as a y-drag instead of dying.

#### 2 · Click a series to hide it

Two halves. The chip:

```js
'<button type="button" class="rs-leg' + (st.hidden[key] ? ' off' : '') +
  '" data-rsleg="' + key + '" title="Show / hide">' +
  '<span class="ave-leg-act" style="background:' + color + '"></span>' + esc(label) + '</button>'
```

…and the rule that makes it honest: **the same predicate that hides the series must feed the
table.** In D this is enforced by having exactly one function — `rsEvoVisible(k, m)` — that answers
"what is the chart drawing", with the chart, both tables and the aggregates all rendering from it
(§7). Copy that shape. A legend that hides a line from the chart while the table keeps totalling it
is worse than no legend, because the reader now trusts a number that is not on screen.

Use `<span class="rs-leg-line">` instead of the swatch when the series is drawn as a line, so the
chip looks like the mark it controls.

#### 3 · The table under the chart

**Minimum bar: the table contains everything the chart draws.** It may contain more — A's table
shows level, growth and margin at once regardless of the chart's mode (§4) — but never less.

```js
'<div class="rs-collap" data-rstbl="' + k + '">' +
  '<button type="button" class="rs-collap-h" data-rstblb="' + k + '">' + headHtml + '</button>' +
  '<div class="rs-collap-b" id="rsTableBody-' + k + '"' + (st.tbl === false ? ' hidden' : '') + '>' +
    '<div class="rs-tablewrap" id="rsTable-' + k + '"></div>' +
  '</div></div>'
```

The header is generated, not static: it carries the caret, `show`/`hide`, **the metric, and the
count of what is inside** — *"Total GB, 18 periods in the selected range"* — and it is re-rendered
on every toggle so those counts follow the controls above. See §9.13 for which blocks default open
and the `=== false` / `=== true` trap that decides it.

#### 4 · Dropdowns grouped by metric family

```js
'<optgroup label="' + esc(group.label) + '">' + options + '</optgroup>'
```

**Family first, segments inside** — `Gross Bookings ▸ Total · Mobility · Delivery · Freight`, never
the transpose. Every company has a handful of families with segments beneath them, so this shape
homogenises across tickers while segment-first does not. The option text stays the metric's full
name: a closed `<select>` shows the option alone, never its group header, so an option that reads
`Total` out of context is a bug.

Validate the stored key against the group's keys on every render (`rsMetric(k)` does this) — a
metric key surviving a view or ticker switch is the classic "chart renders empty" cause.

#### 5 · Units and estimates are never ambiguous

* The level button carries **the unit itself** (`$B`, `US$`, `Units`), not the word "Levels".
* `act: null` is the **only** declaration that a period is forward. It drives the forecast shading,
  the muted axis labels, the `E` marks and what can be scored (§3.3). Never add an `isEstimate`
  flag; leave the actual empty.
* A difference in a percentage mode is in **percentage points**, and says `pp`. §10 has the full
  units-per-mode table — it is the rule every table in the portal obeys.
* Below ±0.05 a move renders neutral, not red. Colouring a rounding artifact claims a line fell.

#### 6 · Degrade to nothing, never to broken

`resultsHtml` / `resultsEvoHtml` return `''` when the dataset or its `evolution` block is missing,
so an unfinished ticker renders **no section** rather than a broken one. Do the same, and make
absences that a reader might mistake for a bug **loud**: the amber `⚑ No company guidance` badge
exists precisely so nobody wonders why the band is missing.

⚠ One exception worth knowing: `rsRerenderSurp` assigns to `host.outerHTML`, so returning `''`
there **deletes the block** and leaves nothing to render back into. `rsSurpEmptyHtml(reason)`
exists for that case (invariant 3, §12).

### 0.3 The menu — offer these when the data supports them

Not mandatory. Each is worth one line of thought, and the answer is often yes.

| Capability | Offer it when | The call | §|
|---|---|---|---|
| Range presets + slider | the x-axis is periods | `rsPresetWin`, `rsSyncSlider`, `wireSliders` | 9.5 |
| Level ⇄ Growth ⇄ Margin | the metric has a denominator (`marginOf`) | `rsModeArr` — **one transform for all three** | 9.2 |
| Growth in % **or** amount | you offer growth at all | `rsGrowArr(sk, m, series, amt)` | 9.4 |
| YoY / QoQ | the view is quarterly | `rsLook(k)` | 9.3 |
| Quarterly ⇄ Annual | the dataset has both views | `data-rsview`, per block | 9.1 |
| A vintage axis | you have snapshots (`estMatrix`) | `rsSeriesFor`, `rsVintSelHtml` | 3.4 |
| Guidance Low/Mid/High | the company guides a genuine **range** | `rsGuideAt`, `rsGptMiniHtml` | 9.8 |
| A surprise scorecard | two series overlap on reported periods | block B | 5 |
| A summary column | the chart has a window | the `sum*` family — **compute over the window** | 4 |
| Column highlight | the table is transposed and wide | `colCells` + `.colhl` | 10 |

**Growth in amount is the one people skip**, and it is often the more honest half: a percentage
flatters a small base and hides a large one.

### 0.4 The layout contract

```
┃ Section name   [ metric ▾ ]                          ← row 1: WHAT (identity)
  [Quarterly|Annual] [$B|Growth|Margin %] [YoY|QoQ]        Range  Last 4Q · …
                                                        ← row 2: HOW (left) · WINDOW (right)
  ■ Actual  ■ Summit  ■ Street  ■ Guidance              ← legend chips, click to hide
  ┌────────────────────────────────────────┐
  │  chart                                  │           ← drag to zoom · double-click resets
  └────────────────────────────────────────┘
  ●──────────────────────────────●                      ← slider, when x is periods
  ▸ Period detail   show · Total GB, 18 periods         ← the table, collapsed behind its own summary
```

**Row 1 is identity, row 2 is treatment.** Controls that change what a number *means* go left;
controls that change *which numbers are on screen* go right. And **a control lives where the thing
it changes lives** — that is why A's guidance pills sit inside the guidance row rather than in the
control row (§9.8), and why C suppresses the second copy (§6, `gptShown`).

Both y-axes go **on the right**, stacked by `weight`: primary inboard, margin outboard.

### 0.5 Before you ship

- [ ] Drag sideways, drag down, **drag on the axis strip**, double-click to reset
- [ ] Switch every mode with a zoom active — the zoom drops instead of cropping
- [ ] Click every legend chip: the series leaves the chart **and every table and total**
- [ ] Collapse the table: the header still names the metric and counts what is inside
- [ ] Open the dropdown: families with segments inside, and every option reads standalone
- [ ] A forward period is shaded, muted and marked `E`; the axis shows units
- [ ] Load a ticker with no data for this chart: nothing renders, nothing throws
- [ ] Resize to ~380px: labels thin out, the table scrolls, nothing smears
- [ ] Scope every DOM lookup to the pane (§12, invariant 2) and `esc()` every interpolated string
- [ ] **Click the controls in the browser.** Two bugs in `e21b11b` looked right in the DOM and did
      nothing (§12, invariant 6)

### 0.6 Starting a new company — the selection steps

§0.1–0.5 are per chart. This is per **company**: what to build, in what order, and what to skip.

**AMZN is the reference implementation.** The plan is one company finished end to end, then
replicated — so when you start a new ticker, the first move is to open Amazon and copy its shape,
not to design one. Where this section and Amazon disagree, Amazon is right and this section is
stale: fix it.

#### Step 1 — inventory the data. It decides what is even possible.

Do this before choosing a single chart. The capabilities are a ladder, and you cannot skip a rung:

| You have | You get | Who has it today |
|---|---|---|
| nothing | **no Results section at all** — the profile still works | most tickers |
| `views` + `periods` + `act` | block **A** (per-section charts + period tables) | every ticker with a dataset |
| …and any two series overlapping on reported periods | block **B**, the surprise scorecard | most of the above |
| …and `evolution` | the whole **Estimates pane** (D + E) | AMZN · LYFT · META · SPOT · TBBB |
| …and `estMatrix` | the **vintage axis** ("estimates as of …") + **C**, Road to the print | **UBER only** |
| a `js/results-data/<ticker>-setup.js` | the Earnings **Setup** chart (a 2nd engine instance) | AMZN · GOOGL · IBKR · LYFT · META · SPOT · TBBB |

Two things this table is telling you:

* **GOOGL and IBKR have datasets with neither `evolution` nor `estMatrix`.** They render A and B and
  nothing else, and that is a finished state, not a broken one. Do not build an Estimates pane for a
  ticker with no snapshot archive — there is nothing to put in it.
* **`estMatrix` is expensive** (it is an archive of Bloomberg pulls and model saves, assembled by
  `scripts/consensus/emit_matrix.py`). One ticker has it. Treat C and the vintage picker as advanced
  capabilities you earn, not defaults you owe.

#### Step 2 — take the tab spine from Amazon

AMZN's Deep Dive is `Top Line · Bottom Line · Evolution · Valuation · Management`, with nested
`.ovt-subtab`s inside each — Evolution holds `Call Prep · Earnings · Results · Estimates`. Read
`js/overviews/amzn.js` (`deepDiveHtml`) and mirror the structure; the nested sub-tab machinery is
documented in CLAUDE.md under the TBBB handoff and is shared.

The other conventions docs own their own tabs and this file does not restate them: Overview →
`OVERVIEW_CONVENTIONS.md`, Earnings → `EARNINGS_CONVENTIONS.md`, the dataset →
`RESULTS_CONVENTIONS.md`.

#### Step 3 — per tab, choose charts by the question the tab asks

| The tab asks | The chart shape | Path (§0.1) |
|---|---|---|
| how big was each period, and who was right | periods on x, a series per source | reuse the engine — block A |
| how did each print land vs expectations | diverging surprise bars | block B, free with the data |
| how did our view of FY27 move | **snapshots** on x, a line per year | block D — needs `evolution` |
| what did one saved file project | periods on x, one snapshot | block E — free once D exists |
| how did the forecast for one period get there | snapshots on x, one period | block C — needs `estMatrix` |
| what is the cost structure / what moved the margin | waterfall or contribution bars | **your own canvas** — §0.2 still applies |
| how sensitive is the value to two drivers | matrix / heatmap | your own canvas |
| where does this sit against peers | scatter | your own canvas |

**When the question is "a metric over time against expectations", writing a canvas is the wrong
answer** — you are re-implementing four series, three modes, a vintage axis and two tables, and it
will drift from every other company. Write the dataset.

#### Step 4 — order of operations

1. **Dataset first** (`js/results-data/<ticker>.js`) — it unblocks A and B, which are the highest
   value per hour of work in the whole profile.
2. **Overview and the bespoke Deep Dive charts** — these are per company and do not depend on the
   engine.
3. **`evolution`** when the model snapshots exist → the Estimates pane appears with no UI work.
4. **`estMatrix`** last, and only if the archive justifies it.
5. **Earnings Setup** (`<ticker>-setup.js`) alongside the Earnings tab.

Steps 1 and 2 are independent — they can run in parallel across two people, which is how AMZN is
being built right now (Results/Estimates on one branch, the Deep Dive tabs on another).

#### Step 5 — the rollout rule

**The standard applies to new work. Existing charts are upgraded company by company, never in a
sweep.** Most charts built before Aug 2026 — TBBB's, SoFi's, the bespoke Deep Dive canvases — do
not meet §0.2 yet. That is expected.

* **One company per PR.** A branch that touches four tickers' charts cannot be reviewed for
  regressions by anyone, and the whole point of going company by company is that each change is
  visible.
* **Say what changed visually** in the PR body. The reviewer is usually not going to open every tab.
* **Never silently restyle a chart someone else built** while doing something else — an unexplained
  visual diff in an unrelated PR is how a regression ships unnoticed.
* When you do upgrade one, run the §0.5 checklist against it as if it were new.

---

## 1. The map — five block types, two panes, three instances

A **block** is one self-contained section: its own controls, its own chart, its own table, its own
slice of state. Blocks never talk to each other.

```
Deep Dive ▸ Evolution ▸ RESULTS            (resultsHtml / initResults)
  ├── vintage picker                        ← pane-wide, governs A only
  ├── A. Section block  · Top Line
  ├── A. Section block  · Margins & Profitability      A repeats once per
  ├── A. Section block  · KPIs                         views[v].sections[]
  ├── B. Actuals vs Estimates      (the surprise scorecard)
  └── C. Road to the print         (one period, every snapshot)

Deep Dive ▸ Evolution ▸ ESTIMATES           (resultsEvoHtml / initResultsEvo)
  ├── D. Evolution block · Top Line                    D repeats once per
  ├── D. Evolution block · Profitability               evolution.sections[]
  └── E. Projection by snapshot    (one snapshot, every period)

Deep Dive ▸ Evolution ▸ EARNINGS ▸ Setup
  └── a SECOND instance of the whole Results pane, on a `*_SETUP` dataset
```

### The two orientations

This is the single most useful thing to hold in your head. Every block is one of two shapes:

| | x-axis | a series is | asks |
|---|---|---|---|
| **A** Section block | periods | a source (actual/Summit/Street/guidance) | how big was each period, and who was right |
| **B** Actuals vs Estimates | periods | a comparator, as a surprise bar | how did each print land against expectations |
| **C** Road to the print | **snapshots** | a source, for ONE fixed period | how did the forecast for 2Q26 get to where it landed |
| **D** Evolution block | **snapshots** | a fiscal year × source | how did our view of FY2027 move over time |
| **E** Projection by snapshot | periods | a source, for ONE fixed snapshot | what did the May file think the whole horizon looked like |

C and E are transposes of B and D respectively. That is deliberate and it is why they were built:
a track record has two axes and you cannot read both off one chart.

### What data each block eats

| Block | Source | Degrades to nothing when |
|---|---|---|
| A | `views.q` / `views.y` — the hand-curated metric blocks | no dataset |
| B | same, **plus** `estMatrix` for its own vintage resolution | `surprise: false`, or no metric has two overlapping series |
| C | **`estMatrix` only** (period-keyed rows per snapshot) | no `estMatrix` |
| D | `evolution` — hand-authored, `metrics[k][src][yearIdx][vintageIdx]` | no `evolution` (kills the whole pane) |
| E | `evolution`, same block as D | fewer than 2 vintages |

**Results and Estimates keep separate data surfaces** (SAB's decision, `RESULTS_ESTIMATES_HANDOFF`
§2). A/B/C eat `views` + `estMatrix`; D/E eat `evolution`. E was fed from `evolution` rather than
`estMatrix` precisely so it can never disagree with D, which sits directly above it.

---

## 2. State

One module-level object. Each block owns a branch and nothing reaches across.

```js
var _rs = {
  data:   null,          // the TRIMMED dataset (see §3.1) — never the imported module
  view:   'q',           // default view a fresh block starts from; pane-level fallback
  growth: 'yoy',         // legacy pane-level default
  vint:   'preprint',    // A's vintage selection
  vsrc:   null,          // A's vintage: which archive the second select is browsing
  sec:    {},            // A — keyed by section key: 'top', 'margins', 'kpis'
  surp:   null,          // B
  conv:   null,          // C
  evo:    { sec: {} },   // D — keyed by section key
  curve:  null,          // E
  wrap:   null,          // the .rs-wrap that initResults last wired — scopes DOM lookups
  _active: null          // which ticker _rs.data currently holds
};
```

Per-block state, exactly as initialised:

| Block | Accessor | Fields |
|---|---|---|
| A | `rsSt(k)` | `metric, win, yr, chart, view, mode, growth, growUnit, gpt, tbl, hidden{act,summit,cons,guide,margin}` |
| B | `rsSurpSt()` | `metric, win, yr, tbl, mode, chart, view, vint, vsrc, gpt, base, cmp{summit,cons,guide}` |
| C | `rsConvSt()` | `metric, view, period, mode, base, unit, gpt, yr, chart, tbl, hidden{}` |
| D | `rsEvoSt(k)` | `metric, mode, growUnit, yr, chart, hidden{}, act, rec, det` |
| E | `rsCurveSt()` | `metric, vi, vi2, cmp, mode, growUnit, hidden{}, yr, chart, tbl` |

**Reset points.** `resultsHtml()` clears `sec / evo / surp / conv`; `resultsEvoHtml()` clears
`evo / surp / curve`; `initResults(wrap, ticker)` clears everything when `_rs._active` changes.
A stale `metric` key surviving into another ticker's view is the failure these prevent.

---

## 3. The shared core

Everything in this section is used by two or more blocks. Anything here is where a change ripples.

### 3.1 Dataset access and the forward-horizon trim

| Function | Does |
|---|---|
| `getResultsData(ticker)` | returns the **trimmed copy**, memoised in `_rsTrimCache` |
| `rsTrimData(raw)` | builds that copy: quarterly keeps forward quarters only inside the current FY; annual and `evolution` cap at current FY + 2. The two rules are the predicates `keepQ` (`rsParseQ(p).y <= fy`) and `keepY` (`+p <= fy + 2`), and **both keep anything they cannot parse** — a period label the engine does not recognise is never silently dropped |
| `rsTrimMetric(m, keep)` | filters one metric's parallel arrays by a period predicate |
| `rsCurrentFY(data)` | derives the current fiscal year from the dataset's own last reported period |
| `rsParseQ('3Q22')` | `{y:2022, q:3}` or null |

⚠ `_rs.data` is **never** the imported dataset module. Asserting against the import in a console
test shows "nothing changed" while the engine works fine. This has cost real debugging time twice.

### 3.2 Formatting and scale

| Function | Does |
|---|---|
| `rsCur(m)` / `rsCurName(m)` | currency symbol / name — per-metric `cur`, then dataset `currency`, then `$` / `US$` |
| `rsScaleOf(m)` | display divisor for a **flat** metric: 1000 (→ $B) when any value ≥ 10,000, else 1 |
| `rsEvoScaleOf(m)` | the same, for `evolution`'s nested `[year][vintage]` arrays |
| `rsFmt(m, v)` | a level: `$1,234M` / `$1.2B` / `$0.81` / `12.3%` / integers with `unitLabel` |
| `rsFmtD(m, v, dec)` | a **signed difference** in the same units |
| `rsTick(v, unit, div, cur, ticks)` | an axis tick |
| `rsTickDec(ticks)` | decimals derived from the tick **step**, not the value — whole dollars on $10B→$60B, one decimal on $55B→$58B |
| `rsPctHtml(s, dec)` | a green/red signed percent |
| `rsSurp(act, ref)` | `(act − ref) / |ref| × 100` |
| `rsRevHtml(m, prev, cur)` | a revision: currency delta, plus percent when the base is non-zero and the sign holds |
| `rsRevPp(prev, cur)` | a revision in percentage points |
| `esc(s)` | HTML escape. Used on **every** interpolated string |

### 3.3 Periods and windows

| Function | Does |
|---|---|
| `rsOrdIn(view, p)` | orders a period: quarterly `y*4+q`, annual `+p`. **The only period arithmetic in the engine** |
| `rsNextPeriod(view, p)` | the period after `p` — how a snapshot gets labelled "before 2Q26" |
| `rsLastAct(m)` | index of the LAST period with a reported actual. Everything after it is forward |
| `rsLastReportedOrd(view)` | the same, dataset-wide, as an ordinal |
| `rsWin(k, m)` | A's period window, clamped |
| `rsPresetWin(m, key)` | the Range presets, anchored to the last reported period |

**`act: null` is what makes a period forward.** That one rule drives the forecast shading, the
muted axis labels, the `E` marks in every table, and which periods B can score. You never declare
a period to be an estimate — you leave its actual empty.

### 3.4 The vintage axis

`estMatrix` stores, per source (`summit` | `cons`) and per view, one **period-keyed** row per
snapshot. Full contract in `RESULTS_CONVENTIONS.md` §8.

| Function | Does |
|---|---|
| `rsMatrix(src)` | the matrix for one source, or null |
| `rsVintages()` | every vintage across both sources, **newest first**, deduped |
| `rsAllVints()` | the same, **oldest first** (C walks forward in time) |
| `rsVintDay(id)` / `rsVintDayShort(id)` | `Jul 31, 2026` / `Jul 31` |
| `rsVintBefore(v)` | the period this file was the last read **before** — derived, not stored |
| `rsVintLabel(v)` | `Jul 31, 2026 · before 2Q26` |
| `rsVintSrcs(id)` | which archives hold this date |
| `rsVintAsOf(src, date)` | a source's latest file on or before a date |
| `rsAsOfDates()` | dates where both sources have something — the "as of" list |
| `rsVintFor(src, mode)` | the vintage a source resolves to, for any reading |
| **`rsSeriesFor(view, m, mkey, src, mode)`** | **the load-bearing one** — one source's series for one metric under one reading |
| `rsApplyVintage()` | rewrites every metric's `summit`/`cons` in place for A; stashes the hand-authored arrays as `_flat_<src>` |
| `rsVintNote()` | the sentence under A's picker: what each source actually resolved to |
| `rsVintParse(val, vsrc)` | a stored value → `{mode, id}` |
| `rsVintList(src)` | one archive's files, newest first |
| `rsVintScoreable(v, view)` | is this file still a forecast of something now known? |
| `rsVintPick` / `rsVintDefault(mode, view)` | the newest **scoreable** file — see the trap below |
| `rsVintSelHtml(val, scope, label, vsrc)` | renders the two-select picker; `scope` is `'pane'` or `'surp'` |
| `rsVintSrcLabel(src)` | `Summit model` / `Street (Bloomberg)` |

**Three readings** (`rsVintSelHtml`, select 1):

1. **Latest file before each print** (default) — per period, the estimate that stood going *into*
   that print. Two fallbacks in `rsSeriesFor` keep it exact: on an already-reported period the
   dataset's own value wins (it is the projection the model **froze** at that print, sharper than
   any snapshot saved weeks earlier), and where no vintage reaches back far enough the flat value
   is kept rather than blanked. **The matrix adds; it never silently subtracts.**
2. **As of a date** — each source resolved to its own latest file up to that day. A source is
   named in the option only when its file is *older* than the date picked.
3. **One Summit / One Street file** — read exactly as archived. Select 2 lists that one archive.

⚠ **The two archives keep separate calendars.** Bloomberg exports around each print; the model is
saved when the analyst saves it. On UBER they intersect **once out of 18 dates**. That is why the
readings are split by archive and why the as-of reading exists at all.

⚠ **The newest file is the wrong default.** It is always saved just *after* the latest print, so
it holds forward periods only and every surface scoring estimates against actuals renders empty on
it. `rsVintDefault` lands on the newest **scoreable** file instead.

### 3.5 Guidance

| Function | Does |
|---|---|
| `RS_GPTS` | `[['lo','Low'],['mid','Mid'],['hi','High']]` |
| `rsGuideMid(m, i)` | the midpoint |
| `rsGuideRanged(m)` | does this metric have a genuine **range** anywhere? (a single guided number gets no toggle) |
| `rsGuideAt(m, i, gpt)` | the guided figure at the chosen end |
| `rsGptName(gpt)` | `low` / `mid` / `high` |
| `rsGptHtml(attr, cur, ranged, label)` | the pill group, for a **control row** |
| `rsGptMiniHtml(attr, cur)` | the same choice sized to live **inside a table row's label cell** |

### 3.6 Growth and margin — the Results side

| Function | Does |
|---|---|
| `rsLook(k)` | the lag: quarterly YoY = 4, quarterly QoQ = 1, annual = 1 |
| `rsGrowLabel(k)` | `YoY growth` / `QoQ growth` |
| `rsGrowBase(sk, m, series, i)` | **the base rule**: the *reported* period one lag back wherever one exists, falling back to the same series |
| `rsGrowArr(sk, m, series, amt)` | a whole series as growth, in percent or in amount |
| `rsMarginArr(sk, m, series)` | a whole series as a margin over `marginOf` — **same series both sides** |
| `rsIsGrow(k)` / `rsGrowAmt(k)` / `rsIsMargin(k)` / `rsHasMargin(k, m)` | mode predicates |
| **`rsModeArr(k, m, name)`** | **the one transform** — level, growth or margin, per the block's mode |
| `rsIsPctMode(k)` | is the plotted number a percentage? (everything derived except growth-as-amount) |
| `rsModeFmt(k, m, v)` | a value, in the current mode |
| `rsModeDiff(k, m, v)` | a **difference**, in the current mode — percentages differ in **points** |
| `rsActGrowthPct` / `rsActGrowthDollar` | the actual's growth in a table cell, in percent and in amount |
| `rsRefGrowthPct` / `rsRefGrowthDollar` | the same for a reference series (Summit / Street / guidance) |

**The base rule matters and every part of the system shares it.** A forward estimate reads as
"growth vs last year's actual", the way an analyst quotes it — not "growth vs our own estimate of
last year". The chart, the table's growth rows and D's revision record all use this one rule.

**Margins never mix bases.** A consensus margin is cons/cons, a Summit margin is summit/summit. A
consensus numerator over Summit revenue is a meaningless hybrid wearing a real label.

### 3.7 Growth and margin — the Estimates side

`evolution` is nested `[yearIdx][vintageIdx]`, so it needs its own pair.

| Function | Does |
|---|---|
| **`rsEvoPctAt(m, src, yi, basis, amt)`** | growth or margin for one fiscal year, **across vintages**. Basis passed **in** |
| `rsEvoPct(k, m, src, yi)` | thin wrapper reading D's block state |
| `rsEvoActual(mkey, m, year)` | the annual reported figure, from `views.y` (honours `actKey`) |
| **`rsEvoActualPctAt(mkey, m, year, basis, amt)`** | the same figure in the current mode, computed **actual-on-actual** |
| `rsEvoActualPct(k, ...)` | thin wrapper for D |
| `rsEvoBasis(k)` / `rsEvoGrowUnit(k)` / `rsEvoIsAmt(k)` | D's mode predicates |
| `rsEvoPctLabel(k, m)` | `implied YoY growth` / the metric's `marginLabel` |

The `…At` split exists because **E needs the same math with its own mode**. One set of rules, two
orientations — E cannot drift from D.

### 3.8 Chart chrome, shared

| Thing | Does |
|---|---|
| `rsFwdZone` (plugin) | shades forward periods, dashes the boundary, draws a `FORECAST` pill, and re-draws the forward x-labels inside blue bubbles (the scale hides them). Reads `options.plugins.rsFwdZone = {from}`. Used by **A** and **E** |
| `rsRR(ctx,…)` | rounded-rect path, for every canvas pill |
| **`rsAttachBrush(el, chart, onX, onY, onReset)`** | drag-to-zoom on **every** chart. Horizontal drag → period window, vertical → y-range, double-click resets. Pass `onX = null` for charts with no x-windowing |
| `rsWireBrush(k, el, chart, lo)` | A's binding of the above |
| `rsPaneEl(id)` / `rsSurpEl(id)` | **scoped** `getElementById` — see the invariant in §8 |
| `RS_ACT / RS_SUMMIT / RS_CONS / RS_GUIDE / RS_GREEN / RS_RED / RS_FWD / EVO_RAMP / RS_CURVE_DIM` | the palette |

**The brush decides its axis from the drag's own shape**, not from where it started — plus either
**axis strip** forces a y-drag. Testing only the left strip left the gesture dead exactly where the
scale now is (the axes moved right in Aug 2026).

Inside `rsAttachBrush`, five closures over one `mousedown`:

| Closure | Does |
|---|---|
| `decide(cx, cy)` | locks the axis once the pointer has travelled **8px** — `vertical = dy > dx`. Until then `vertical` is `null`, meaning *undecided* |
| `ensureBox()` | creates the `.rs-brush` rectangle **lazily**, on first `place()` — a click that never moves paints nothing |
| `place(cx, cy)` | sizes the box: a y-drag spans the full plot width, an x-drag the full height, so the selection reads as a band across the axis being cut |
| `onMove(e)` | `decide` then `place` |
| `onUp(e)` | tears the listeners down, then converts pixels → values: y via `chart.scales.y.getValueForPixel`, x via the local `idxAt(clientX)` |

`idxAt` rounds the x-scale's pixel value to the nearest **period index** and clamps it into
`[0, labels.length − 1]`, so a drag that runs off the edge of the canvas selects to the end instead
of producing an out-of-range window.

**Three separate guards keep a click from being read as a zoom**: `decide` needs 8px before it
commits to an axis, `onUp` returns early when `vertical` is still `null`, and each branch re-checks
its own 8px travel. A one-pixel tremor on a mousedown would otherwise collapse the window to a
single period — which renders a chart that is technically correct and completely useless.

Listeners are attached to **`document`**, not the canvas, so a drag that leaves the chart still
tracks and still releases. `rsWireBrush(k, el, chart, lo)` is A's binding: it offsets the returned
indices by the window's own `lo` (the brush sees the *visible* slice, the state stores absolute
indices) and repaints. `onReset` is bound to `ondblclick` and clears **both** `win` and `yr`.

### 3.9 Entry points and pane shells

The five exports are the entire public surface. Everything else is module-private.

| Export | Called by | Does |
|---|---|---|
| `getResultsData(ticker)` | overview modules, Earnings | the trimmed dataset, or null |
| `resultsHtml(ticker)` | pane markup | the whole Results pane as a string; `''` when the ticker has no dataset |
| `initResults(wrap, ticker)` | when the pane becomes visible | resolves the vintage, wires the pane, builds A + B + C |
| `resultsEvoHtml(ticker)` | pane markup | the Estimates pane; `''` when the dataset has no `evolution` |
| `initResultsEvo(ticker)` | when the pane becomes visible | wires the pane, builds every D then E |

Both `*Html` helpers return `''` rather than throwing, so an unfinished ticker renders nothing
instead of breaking the profile.

| Private shell | Does |
|---|---|
| `rsBody()` | assembles Results: top row → vintage note → `#rsBlocks` → B → `#rsConvHost` → view note → source line |
| `rsTopRowHtml()` | the pane-wide vintage picker row, extracted so it can be re-rendered when select 2 appears or disappears |
| `rsBuildAll()` | `rsBuildChart` for every section, then `rsBuildSurp()`, then `rsBuildConv()` |
| `rsEvoRecHeadHtml(k)` / `rsEvoDetHeadHtml(k)` | D's two collapsible headers — each counts the lines `rsEvoVisible` currently returns, so both follow the legend chips |

⚠ `initResults` takes `(wrap, ticker)` so a **second instance** can live on the same page — the
Earnings *Setup* chart runs the same `rsBody` on a `*_SETUP` dataset. `_rs.wrap` is set here and is
what `rsPaneEl` scopes to. See invariant 2 in §12.

---

## 4. Block A — the Results section blocks

Repeated once per `views[view].sections[]`. On UBER: `top`, `margins`, `kpis`.

### Layout

```
┃ Top Line   [ Gross Bookings (Total) ▾ ]                      ← row 1: WHAT
  [Quarterly|Annual] [$B|Growth|Margin %] [YoY|QoQ] [%|Amount]      Range  Last 4Q · …
                                                                ← row 2: HOW (left) · WINDOW (right)
  ■ Actual  ■ Summit model  ■ Consensus  ■ Guidance range      ← legend chips, click to hide
  ┌──────────────────────────────────────────────┐
  │  grouped bars + guidance band + margin lines  │  ← drag to zoom · double-click resets
  └──────────────────────────────────────────────┘
  ●────────────────────────────────────●            ← two-handle period slider
  ▸ Period detail    show · Total GB, 18 periods in the selected range
```

**Row 1 is identity, row 2 is treatment.** Controls that change what a number MEANS go left;
controls that change which numbers are on screen go right.

### Functions

| Function | Role |
|---|---|
| `rsView(k)` / `rsViewName(k)` | this block's view object / name |
| `rsDefaultView(data)` | quarterly when present, else annual |
| `rsSecCfg(k)` / `rsSecGroups(cfg)` / `rsSecKeys(cfg)` | the section's config and its metric groups |
| `rsSt(k)` | state |
| `rsMetric(k)` | the current metric, validated against the section's keys |
| `rsBlocksHtml()` | all blocks, stacked |
| `rsBlockModesHtml(k, m)` | row 2's toggle groups |
| `rsLevelLabel(m)` | the level button's own unit — `$B`, `$M`, `US$`, `Units`, `%` |
| `rsSelectHtml(k)` / `rsOptLabel(m)` | the grouped metric dropdown |
| `rsLegendHtml(k, m)` | legend chips + the amber "no guidance" / "guidance is not a margin" badges |
| `rsRefsFor(m)` | which of summit/cons/guide have any data |
| **`rsBuildChart(k)`** | the chart |
| `rsSyncSlider(k, m)` | slider handles, fill, and one tick dot per period |
| `rsTableHeadHtml(k, m)` | the collapsible header — carries the metric and the window count |
| **`rsRenderTable(k, m)`** | the Period detail table |

### The chart

* **Bars**: Actual (navy) · Summit (blue) · Street (grey), grouped.
* **Guidance**: a translucent **band** for a range, a horizontal **tick** for a single guided
  number (a floating bar of zero height is invisible — Spotify guides one figure per metric).
  `isPoint(i)` is the test — `guideLo[i] === guideHi[i]`, both non-null — and it runs **per period**,
  not per metric: a company that guides a range one quarter and a single number the next gets the
  right mark on each bar. The band's own data map excludes point periods, so the two marks never
  draw over each other.
* **Margin lines** on a second axis (`y2`), only in level mode, only outside Top Line.
* **Both y-axes on the right**, stacked by `weight` — primary inboard, margin outboard.
* Suppressions: margin lines are off in growth mode (two unrelated percentages on one chart is how
  a reader mistakes one for the other) and in margin mode (there the margin *is* the bars).
  Guidance is off in margin mode entirely — see the toggle catalogue.

### The table

`rsRenderTable` is **transposed**: periods across the top, one group of rows per series.

```
Actual          value → YoY/QoQ growth → margin
Summit model    value → YoY growth → surprise → margin
Consensus       value → YoY growth → surprise → margin
Guidance        range → actual vs range   [Low|Mid|High]
                                          ← the pills live HERE
```

Right-hand sticky **Range record** column: CAGR of the reported series, average growth, beat/miss
record (`11▲ · 5▼`, actual avg). Forward columns are shaded and marked `E`.

The table shows **all three readings at once** (value, growth, margin) regardless of the chart's
mode — it is the block's detail, not a mirror of the chart.

### The Range record — one summary per row

The sticky right-hand column is not one calculation but **five**, picked per row type. All of them
run over `idx` — the *selected window*, not the whole series — so narrowing the slider or brushing
the chart re-states the record over what is on screen.

| Function | Fills the row | Returns |
|---|---|---|
| `sumCagr()` | the Actual row | `CAGR +18.4%` — the reported series only |
| `sumGrowth(fn)` | any growth row | `avg +12.1%` — the mean of the cells actually present |
| `sumSurprise(arr)` | a Summit / Street value row | `11▲ · 5▼` + `actual avg +2.5% · +$1.2B` |
| `sumMargin(arr)` | a margin row | `avg 34.2%` |
| `sumGuide()` | the Guidance row | `9▲ · 5⊙ · 2▼` + `avg vs mid +0.9%` |

Three shared primitives sit under them: `avg(a)` (plain mean), `sgn(v, dec, suf)` (a signed figure
with an explicit `+`/`−` — the minus is a real `−`, not a hyphen), and `pctDollar(p, d)`, which
renders a percentage with its currency delta dimmed beside it (`+2.4% · +$1.2B`). `pctDollar` is
why every difference cell in the engine reads in **both** units without a toggle.

Four rules are baked into these five functions, and each one exists because the naive version lied:

* **`sumSurprise` is actual-centric.** It computes `actual − estimate`, so **▲ always means the
  company beat that line** — the same direction as the surprise cells and the beat/miss legend.
  Written the other way round (estimate vs actual) the arrows in the column would point opposite to
  the arrows in the cells above them.
* **`sumCagr` annualises on the *view*, never on the growth lag** — 4 periods per year in
  quarterly, 1 in annual. Reading the YoY/QoQ pill here would make a CAGR change when a user
  switched to QoQ, which is a different question entirely.
* **`sumCagr` refuses to compute on a sign flip.** It bails when the first or last value is ≤ 0
  (`first <= 0 || last <= 0`), because a compound rate through zero is not a number anybody should
  read. The cell goes empty rather than printing a fabricated rate.
* **`sumGuide`'s ▲⊙▼ verdict describes the whole band, always.** Only the `avg vs <end>` line
  underneath follows the Low/Mid/High pills (§9.8). Letting the verdict follow the toggle would
  turn a *within* into a *below* on the low setting — inventing a miss the company never had.

⚠ `sumSurprise` skips a period when the reference is **zero** (`!arr[i]`), not just when it is
null. A percentage over a zero base is infinity wearing a number's clothes.

---

## 5. Block B — Actuals vs Estimates (the surprise scorecard)

One per Results pane, at the foot. Diverging bars: how each print landed.

### Layout

```
┃ Actuals vs Estimates  [ metric ▾ ]  [Quarterly|Annual]  [Surprise %|Amount]
  Estimates as of  [ reading ▾ ]  [ which file ▾ ]        ← ITS OWN, not the pane's
  Compare [ Actual ▾ ] against  ■Summit ■Consensus □Guidance (mid)  at [Low|Mid|High]
  ■ came in above   ■ came in below
  ┌──────────────────────────────────────────────┐
  │  diverging bars, labelled, zero baseline      │
  └──────────────────────────────────────────────┘
  ●────────────────────────────────●
  ▸ Period detail
```

### Functions

| Function | Role |
|---|---|
| `RS_SRCS / RS_SRC_LABEL / RS_SRC_SHORT / RS_SRC_COLOR` | the four comparable series |
| `rsSurpViewName()` / `rsSurpView()` | **its own** period axis |
| `rsSurpLag()` | 4 quarterly, 1 annual — never follows a block's YoY/QoQ pill |
| `rsSrcLabel(s)` / `rsSrcShort(s)` | labels; `guide` relabels itself `Guidance (low)` etc. |
| **`rsSrcArr(m, key, mkey)`** | a series resolved through **its own** vintage — see below |
| `rsSrcHas` / `rsSurpPairOk` | availability, per metric and per pair |
| `rsSurpGroups()` | metrics where **any two** series overlap |
| `rsSurpSt()` / `rsSurpM()` / `rsSurpCmps(m)` | state, metric, active comparators |
| `rsSurpLr(m)` / `rsSurpWin(m)` | the window, following the **base** series |
| `rsSurpLabels` (plugin) | zero baseline + a label on every bar |
| `rsSurpTableHeadHtml()` / `rsSurpBlockHtml()` / `rsSurpEmptyHtml(reason)` | markup |
| **`rsBuildSurp()`** | the chart |
| `rsSurpTableRender(m, lo, hi, div)` | the table |
| `rsRerenderSurp(pane)` / `wireSurpSlider()` | full re-render (controls depend on the selection) |

⚠ **Why `rsSrcArr` needs the metric KEY.** The pane-wide picker works by *rewriting* `m.summit` /
`m.cons` in place (`rsApplyVintage`). If B read those arrays it would silently inherit the upstairs
pick. It resolves through `rsSeriesFor` instead, which mutates nothing — and that needs the metric
key, because the matrix is keyed by metric, not by object.

### The label plugin, worth stealing

* **Labels stack per period, not per bar.** Drawing series-by-series let a second label print over
  the first bar. Drawing period-by-period, stacking from the **outermost** bar, means nothing ever
  overlaps.
* **Labels thin themselves.** The widest label is measured against the slot a period actually owns;
  if it does not fit, only every Nth period is labelled. At 940px nothing is dropped; at 260px it
  falls to every other period instead of becoming a smear. The tooltip always has everything.

### The table

Base row → per comparator: value row, YoY growth row, `vs <comparator>` difference row. Growth rows
measure against the **actual** a year back and are skipped when the base is not the actual — an
estimate's growth is only meaningful off a reported base.

`row(label, cellFn, cls, sum)` builds every line: a label cell, one cell per period in `idx`, and
the Range record. `lbl(s)` supplies the label and is where the guidance row grows its Low/Mid/High
pills (`rsGptMiniHtml`), but only when the metric is genuinely ranged.

**B re-declares its own summary family**, and the names being identical to A's hides a real
difference:

| Function | A's version | B's version |
|---|---|---|
| `sumSurprise` | takes an **array** — always `actual` vs that reference | takes a **source key** — the *selected base* vs that comparator, resolved through `rsSrcArr` |
| `sumCagr` | annualises by `_rs.view` | annualises by `rsSurpLag()` — B owns its period axis (§9.1) |
| `sumGrowth` | shared shape | same, over B's own `idx` |
| `g(arr, base, i)` / `gd(...)` | — | growth in **percent** and in **amount**, over `rsSurpLag()`; `gd` skips the zero-base guard because a difference over zero is still a difference |

The consequence: **change B's base from Actual to Summit and every ▲ in the Range record re-points
at the new base.** The column answers "how did the base come in against this comparator", not "how
did the company do" — those are the same sentence only while the base is the actual.

⚠ These helpers are re-declared inside each table renderer on purpose. `avg`, `sgn`, `num` and
`pctDollar` close over that renderer's `m`, `div` and `dec` — hoisting them to module scope would
mean passing three arguments to every call, at every cell, in five tables.

---

## 6. Block C — Road to the print

One period, every snapshot. Fed **only** by `estMatrix`, so it hides itself on datasets without one.

### Layout

```
┃ Road to the print  [ metric ▾ ]  [Quarterly|Annual]  [ 2Q26 · reported ▾ ]
  [$B|Distance]   (Distance opens:) [vs Actual|vs Guidance]  [%|Amount]  [Guide at Low|Mid|High]
  ─ Summit model   ─ Consensus   ┄ Reported (2Q26)   ┄ Guidance range
  ┌──────────────────────────────────────────────┐
  │  two walking lines · flat reference lines     │
  │  "Reported · $58.0B" pill (left)              │
  │  "last read before the print" marker (right)  │
  └──────────────────────────────────────────────┘
  ▸ Snapshot detail
```

### Functions

| Function | Role |
|---|---|
| `rsConvSt()` / `rsConvViewName()` / `rsConvView()` | state and **its own** period axis |
| `rsConvCells(src, view, mkey)` | one metric's matrix rows for one source |
| `rsConvHasM` / `rsConvGroups()` / `rsConvM()` | metrics that any archive covers |
| `rsConvPeriodIdx(m, mkey)` | periods some snapshot actually forecast |
| `rsConvPi(m, mkey)` | the selected period — defaults to the most recent that has **printed** |
| **`rsConvVints(pi, m, mkey)`** | the x-axis: snapshots that were still forecasting it, plus `knew` |
| `rsConvSeries(src, mkey, m, pi, vints)` | one source's walk |
| `rsConvIsDist` / `rsConvIsPct` / `rsConvBase` / `rsConvDist` | the Distance mode |
| `rsConvRef` (plugin) | the outcome line's value, in a pill at the **left** end |
| `rsConvLast` (plugin) | the dashed marker on the last pre-print snapshot, at the **bottom** |
| `rsConvHeadHtml` / `rsConvBlockHtml` / `rsConvLegendHtml` | markup |
| **`rsBuildConv()`** / `rsConvTableRender(...)` / `rsRerenderConv(pane)` | chart, table, re-render |

### Three rules that make it honest

1. **Only snapshots that were still forecasting it.** A file taken after the print is a
   transcription of the result, not a forecast of it; plotting it draws a convergence that never
   happened. The first file that *did* know it is named in the footnote instead.
2. **Leading empties are trimmed.** Bloomberg carries four forward quarters, so the 2023 files are
   silent about 2Q26 — keeping them stretched the axis across three blank years. Only the *leading*
   run is cut: a hole in the middle is a real gap in an archive and stays visible as one.
3. ⚠ **The last read is not the day before.** The archives export around each print, so the
   right-most point is the last *file* — Jul 31 against an Aug 5 print. The gap is drawn and named
   rather than papered over. **A day-before BBG pull drops in as one more vintage with no code
   change.**

### The table

Snapshots across the top; per source a value row plus `vs actual` and `vs <guide end>` rows, then
flat `Guidance` and `Reported` rows so a column reads straight down. The last column is flagged
*last before print*.

**`gptShown()` — one guidance control per screen.** C can show two `vs guide` rows (one per source)
and the block's control row can *also* carry the Low/Mid/High pills whenever the chart is zeroed on
the guide. Three copies of one control is three chances to think they are three settings. The
function is a latch that answers *"has this already been drawn, or does it live upstairs?"*:

```js
var shown = false;
function gptShown(){ var was = shown; shown = true; return was || (rsConvIsDist() && st.base === 'guide'); }
```

It returns **true when the pills should be suppressed** — either something already rendered them
(`was`), or the control row owns them because Distance is zeroed on guidance. The first `vs guide`
row therefore gets the pills, the second gets none, and neither gets them when the row above
already has them. It is also **called for its side effect**, so the call order across rows is what
decides which row wins.

`ranged` (`guideLo !== guideHi` at the selected period) gates the whole thing: on a point guide the
label reads plain `vs guide` and no pills exist to place.

---

## 7. Block D — the Evolution blocks

Repeated once per `evolution.sections[]`. On UBER: `top`, `prof`. **Annual by decision** — see
`RESULTS_ESTIMATES_HANDOFF` §2 for the data that closed that question.

### Layout

```
┃ Top Line  [ metric ▾ ]  [US$B|Growth|Margin %]  [%|Amount]  [Reported]
  ■FY2025 ■FY2026 ■FY2027 ■FY2028  ─Summit (solid)  ┄Consensus (dashed)
  ┌──────────────────────────────────────────────┐
  │  one line per fiscal year, x = snapshots      │
  └──────────────────────────────────────────────┘
  ▸ Revision record       ← the reading
  ▸ Snapshot by snapshot  ← the audit trail
```

### Functions

| Function | Role |
|---|---|
| `rsEvo()` / `rsEvoSecCfg(k)` / `rsEvoKeys(cfg)` / `rsEvoSt(k)` / `rsEvoMetric(k)` | block plumbing |
| `rsEvoBlockHtml(k)` / `rsEvoModeHtml(k, m)` / `rsEvoActHtml(k)` / `rsEvoSelectHtml(k)` / `rsEvoLegendHtml(k, m)` | markup |
| `rsEvoActYears(k)` | which fiscal years can be marked (drives the Reported toggle's availability **and** its on-screen reason) |
| `rsRerenderEvoHead(wrap, k)` | repaints toggle + legend in place |
| **`rsBuildEvo(k)`** | the chart |
| **`rsEvoVisible(k, m)`** | **the one place** that answers "what is the chart drawing" |
| `rsEvoTrackRows(k, m)` / `rsRenderEvoTrack(k, m)` | the Revision record |
| `rsRenderEvoTable(k, m)` | the Snapshot-by-snapshot table |

### The two tables

**Both render from `rsEvoVisible()`.** Hide a fiscal year or a source with a legend chip and it
leaves the chart, both tables and the aggregates in the same click. There is no second place where
"what is on screen" is decided — which is the only way two tables under one chart stay honest.

**Revision record** — one row per line on the chart: first view · latest view · actual · revisions
`n↑/n↓` · net move · first vs actual.

⚠ **"Net move" and "first vs actual" are different questions.** The first is the travel between
snapshots; the second is the error against the print. They coincide on Summit (after a print the
stored row carries the reported figure) and diverge on the Street — UBER's FY2025 drifted +0.0%
while sitting 0.1% under the print. **That gap is the part of the miss the source never corrected.**

**Snapshot by snapshot** — every vintage as its own column, three rows per line (value, revision,
the % basis), with a cumulative-revision column.

---

## 8. Block E — Projection by snapshot

One snapshot, every period. The transpose of D, fed by the **same** `evolution` block.

### Layout

```
┃ Projection by snapshot  [ metric ▾ ]  [ Aug 5, 2026 · post-2Q26 ▾ ]  [⇄ Compare]
                                                     vs [ Dec 15, 2025 · pre-4Q25 ▾ ]
  [US$B|Growth|Margin %]  (Growth opens:) [%|Amount]
  ■ Reported  ■ Summit  ■ Street
  ┌──────────────────────────────────────────────┐
  │  grouped columns per fiscal year + FORECAST   │
  └──────────────────────────────────────────────┘
  ▸ Projection detail
```

### Functions

| Function | Role |
|---|---|
| `rsCurveSt()` | state |
| `rsCurveVi()` | the selected snapshot — defaults to the **newest** (see below) |
| `rsCurveVi2()` / `rsCurveCmp()` | the comparison snapshot, defaulting to the save immediately before |
| `RS_CURVE_SER` / `RS_CURVE_DIM` / `rsCurveHas(m, key)` | the three bars and their faded twins |
| `rsCurveGroups()` / `rsCurveM()` | all metrics across every evolution section, in one grouped select |
| `rsCurveBasis` / `rsCurveAmt` / `rsCurveIsPct` | mode predicates |
| **`rsCurveSeries(m, src, vi)`** | one file's projection for one source, in the current mode |
| `rsCurveActYears(m)` | fiscal years that have landed |
| `rsCurveVselHtml(cls, sel, exclude)` | a snapshot dropdown, **newest first**, excluding the other pick |
| `rsCurveHeadHtml` / `rsCurveBlockHtml` / `rsCurveLegendHtml` | markup |
| **`rsBuildCurve()`** / `rsCurveTableRender(m, raw, raw2, div)` / `rsRerenderCurve()` | chart, table, re-render |

**Here the newest snapshot IS the right default** — unlike §3.4's trap. This block is not scoring
anything against a print; it is reading what a file says.

### Compare

* One faded bar per estimate series, in a **washed-out version of that series' own colour**. The
  reader is comparing two snapshots of the same line, so the line stays recognisable and only its
  age changes.
* The **older file sits on the left** of each pair, so a group reads left-to-right in time.
* **Reported stays a single bar** — it belongs to the fiscal year, not to any snapshot, and
  doubling it would invent a revision that cannot exist.
* The **move** is on the newer bar's tooltip *and* has its own table row, summarised to the biggest
  single-year move with the year named (`+$10.1B · most of it in FY2028`).
* The second dropdown excludes the file already picked — a comparison can never be against itself.

**`pushOne(a, isOld, ord)`** is the one place a bar is appended, and the `ord` it is handed is the
whole chronology rule:

```js
if (vi2 < vi){ pushOne(old, true,  i*2+1); pushOne(arr, false, i*2+2); }   // older pick is genuinely older
else         { pushOne(arr, false, i*2+1); pushOne(old, true,  i*2+2); }   // the user picked a NEWER file to compare
```

`order` decides left-to-right position inside a fiscal-year group, and `i*2` reserves two slots per
series so the pairs never interleave. The comparison snapshot is **not assumed to be the older
one** — the second dropdown lists every other file, so a user can compare backwards. The `vi2 < vi`
test reads the actual dates and puts whichever file is genuinely older on the left, which means a
group reads left-to-right in time no matter which order the two were picked in.

Three more things `pushOne` carries: `_key` and `_old` (how the tooltip and the legend chips find
their bars again), the faded colour from `RS_CURVE_DIM` for the older bar, and the vintage date
appended to the label — but only for estimate series under Compare, since the actual has no date to
append. A series is skipped entirely (`any(arr) || any(old)`) when neither file says anything about
it: an empty legend chip invites a click that does nothing.

### The table

Fiscal years across the top. Per source: the selected file's row, (under Compare) the older file's
row, `the move`, and `vs reported`. Both snapshot rows carry their date in the label —
`Summit · Aug 5, 2026` over `Summit · Dec 15, 2025` — because labelling one plain "Summit" hid the
fact that it was a snapshot too, and the pair stopped reading as a pair.

---

## 9. Toggle catalogue

Every control, what it changes, and what it deliberately does not.

### 9.1 Quarterly / Annual

| Where | Attribute | Scope |
|---|---|---|
| A, per block | `data-rsview` | that block only. Resets its metric and window (both are per view) |
| B | `data-rssurpview` | B only. Also swaps its growth lag (4 ⇄ 1) |
| C | `data-rsconvview` | C only. Resets its metric and period |
| D, E | — | **not offered**: both are annual by decision |

One block can read revenue quarterly in dollars while the next reads EBITDA annually as growth.
That is how the questions actually get asked.

### 9.2 Level ⇄ Growth ⇄ Margin (A)

`data-rsmode` = `level` | `grow` | `margin`. All three flow through **`rsModeArr`**.

| Mode | Bars are | Axis | A difference is | Guidance |
|---|---|---|---|---|
| **Level** | the reported level | `$B`/`$M`/`US$`/`Units` | a **percent** change | band or point |
| **Growth** | growth over the lag | `%` or the metric's units | **percentage points** (%) / currency (Amount) | **transformed** — the growth the company's own guide implies |
| **Margin %** | the margin over `marginOf` | `%` | **percentage points** | **suppressed**, with an amber badge |

* The level button carries the **unit itself** (`$B`, `US$`, `Units`), not the word "Levels" —
  a block knows its own metric.
* Margin is offered only where the metric declares `marginOf` and is not EPS. Switching to a
  metric without one silently drops the block back to level.
* **Why guidance is suppressed in margin mode:** the company guides the line in dollars, not the
  ratio. `guideLo / denominator.guideLo` is a *corner* of a two-dimensional band, not the low end
  of a guided margin. The badge says so rather than the chip quietly vanishing.
* **Why margin lines vanish in growth mode:** the main axis is already a percentage, and two
  unrelated percentages sharing one chart is how a reader mistakes one for the other.

### 9.3 YoY / QoQ (A, quarterly only)

`data-rsgrow`. Sets the lag to 4 or 1 (`rsLook`). Annual blocks never show it — there is no
quarter to compare against.

### 9.4 % / Amount (A, D, E — only while Growth is on)

`data-rsgunit` / `data-rsevgunit` / `data-rscurvegunit`.

**Amount is the half people forget, and often the more honest one.** A percentage flatters a small
base and hides a large one. *"FY2026 revenue was expected to add $9.6B in December and $7.1B by
August"* is the sentence a model argues about.

### 9.5 Range presets + slider + drag-to-zoom (A, B)

Three independent mechanisms over the same axis:

* **Presets** (`data-rsrange`) — `Last 4Q · Last 8Q · Reported · Forward · All`, anchored to the
  last reported period. Annual blocks offer `Last 3Y · Last 5Y` instead.
* **Slider** — two handles, one tick dot per period, hollow dots for forward periods.
* **Drag-to-zoom** — horizontal narrows the window, vertical narrows the y-range, double-click
  resets both. Either **axis strip** forces a y-drag.

### 9.6 Legend chips

| Block | Attribute | Hides |
|---|---|---|
| A | `data-rsleg` | a series, or the margin line |
| C | `data-rsconvleg` | a source, the reported line, the guidance band |
| D | `data-rsevleg` | a **fiscal year** or a **source** — and it leaves both tables too |
| E | `data-rscurveleg` | a series (both its bars, under Compare) |

### 9.7 The vintage picker — two selects

`data-vscope` = `pane` (A) or `surp` (B); `data-vpart` = `mode` or `file`. One handler serves both.

```
Estimates as of  [ how to read it ▾ ]  [ which one ▾ ]
```

Select 2 appears **only when the reading needs an argument**. Reading a single archived file is the
forensic case, not the daily one, so its ~13 dates per source no longer sit permanently in the list
everyone opens. Options are labelled by the print they stand in front of — `Jul 31, 2026 · before
2Q26` — not by what they already knew.

**A's picker and B's are fully independent.** A's rewrites the arrays; B's resolves without
mutating. Moving one never moves the other.

### 9.8 Guidance Low / Mid / High

`data-rsgpt` (A) · `data-rsconvgpt` (C) · `data-rssurpgpt` (B). State field `gpt` on each block.

| Where | Moves | Control lives |
|---|---|---|
| **A** | the `actual vs range` row and its Range record — **not the chart**, where the band stays a band | inside that row's own label cell |
| **C** | the `vs …` table row; and under `Distance ▸ vs Guidance`, the **zero line** | the row's label, or the control row when it sets the zero line |
| **B** | **the bars**, their labels, the tooltip and the Range record | the Compare row *and* the table's guidance row |

**A control goes where the thing it changes is.** A's version spent one commit in the block's
control row and was wrong there twice over: that row is for controls that change the *chart*, and
it stood permanently even on metrics the company never guides. Living on the row makes it
self-limiting — it exists only where a guidance row exists.

Two rules keep it honest:

* **The ▲⊙▼ verdict never moves.** Above/within/below describes the whole band; letting it follow
  the toggle would turn a "within" into a "below" — inventing a miss.
* **Hidden unless the company gave a genuine range.** Spotify guides one number per metric, where
  three pills that all do the same thing are worse than no control.

The read it unlocks, on UBER Gross Bookings over 16 prints: **+2.5% vs the low end, +0.9% vs the
mid, −0.7% vs the high.** Three sentences about the same record.

### 9.9 The surprise comparison (B)

* **Base select** (`.rs-bsel`) — what gets judged. Default the actual.
* **Comparator chips** (`data-rssurpcmp`) — any subset of the other three. A chip with no
  overlapping period on this line is struck through and disabled, with the reason in its title.
* **Surprise % / Amount** (`data-rssurpmode`).

Deliberately a base + chips, not an A-vs-B pair (SAB). Metric availability is independent of the
current selection, so changing the comparison never makes a metric disappear mid-session.

### 9.10 Distance (C)

`data-rsconvmode` = `level` | `dist`, then `data-rsconvbase` = `act` | `guide` and
`data-rsconvunit` = `pct` | `amt`.

Level is the walk itself; Distance re-bases every point on the outcome, with a zero line where it
landed. Under `vs Guidance` the guided end (§9.8) *is* the zero line.

### 9.11 Reported (D)

`data-rsevact`. Draws a flat dotted reference at the figure each closed fiscal year actually
landed on. **Disabled with the reason in its tooltip** when no year in the block has closed — an
empty toggle must never read as broken. It also removes the Actual and First-vs-actual columns
from the revision record rather than leaving them blank.

### 9.12 Compare (E)

`data-rscurvecmp`. See §8. The button carries its own state in its label (`⇄ Compare` /
`✕ Comparing`) so the row says what it is doing without a second look.

### 9.13 Collapsibles

`data-rstblb` (A) · `data-rssurptblb` (B) · `data-rsconvtblb` (C) · `data-rsevrecb` /
`data-rsevdetb` (D) · `data-rscurvetblb` (E).

**The header is never a mystery bar.** It carries the caret, show/hide, and what is inside —
*"Total GB, 18 periods in the selected range"* — and those counts follow the controls above them.

Defaults split on one question: **is this table the block's own detail, or an audit trail behind
it?**

| Table | Starts | Because |
|---|---|---|
| A · Period detail | **open** (`tbl === false ? hidden`) | one table per block, and it *is* the block's detail |
| B · Period detail | **open** | same — the scorecard's numbers are the point |
| C · Snapshot detail | closed (`tbl === true ? '' : hidden`) | the walk is the read; the columns are the receipts |
| D · Revision record | closed | the chart already says it |
| D · Snapshot by snapshot | closed, always — the markup hardcodes `hidden` | a pure audit trail |
| E · Projection detail | closed | same as C |

Note the two idioms are **not** interchangeable: `tbl === false` defaults *open* (undefined is not
false), `tbl === true` defaults *closed*. Copying the wrong one into a new block flips its default
and nothing else complains.

---

## 10. Tables — how each hangs off its chart

| Block | Table(s) | Rendered from | Follows the chart's mode? |
|---|---|---|---|
| A | Period detail | `rsRenderTable(k, m)` | **No** — shows level, growth and margin rows at once |
| B | Period detail | `rsSurpTableRender` | Yes — base, comparators and window all shared |
| C | Snapshot detail | `rsConvTableRender` | Partly — always absolute; both `vs actual` and `vs guide` rows |
| D | Revision record **+** Snapshot by snapshot | `rsEvoTrackRows` / `rsRenderEvoTable`, **both via `rsEvoVisible`** | Yes — values and moves are in the chart's basis |
| E | Projection detail | `rsCurveTableRender` | Yes |

### Units, per mode — the rule every table obeys

| Mode | A value is | A move between two values is |
|---|---|---|
| Level | the level | a **percent** change |
| Growth % | a percentage | **percentage points** (`pp`) |
| Growth Amount | a currency delta | a **currency** difference |
| Margin | a percentage | **percentage points** (`pp`) |

A move below ±0.05 renders neutral (`0.0 pp`) rather than red — colouring a rounding artifact
claims a line fell when it did not move.

### Column highlight — A and B only

Both period tables are transposed and wide, so reading *down* a period means tracking a column
across a dozen rows. `colCells(ci)` returns every cell in one column
(`tr > *:nth-child(ci+1)`) and a delegated `onmouseover` on the table paints them `.colhl`
(`css/results.css:168`), clearing the previous column first and wiping on `onmouseleave`.

`lastCol > 0` guards every call: **column 0 is the row-label column**, which must never highlight —
it is sticky, so it would light up while the reader hovers somewhere else entirely.

The lookup is `tb.querySelectorAll`, scoped to that one table, so the two copies of this code (A's
renderer and B's) cannot reach into each other's rows. C, D and E have no column highlight: their
columns are snapshots, and both D tables already carry per-column revision rows that do the same
work in ink.

---

## 11. Event wiring

Two delegated handlers per pane, one `onclick` and one `onchange`. No per-element listeners
anywhere, so re-rendering a block's markup never needs re-binding.

| Pane | Wired by | Handles |
|---|---|---|
| Results | `wireResults(pane)` + `wireSliders(pane)` + `wireSurpSlider()` | A, B, C |
| Estimates | `initResultsEvo(ticker)` sets `wrap.onclick` / `wrap.onchange` | D, E |

**Click attributes**

```
A   data-rsview  data-rsmode  data-rsgrow  data-rsgunit  data-rsgpt  data-rsrange  data-rsleg  data-rstblb
B   data-rssurpview  data-rssurpmode  data-rssurpcmp  data-rssurpgpt  data-rssurptblb
C   data-rsconvview  data-rsconvmode  data-rsconvbase  data-rsconvunit  data-rsconvgpt  data-rsconvleg  data-rsconvtblb
D   data-rsevmode  data-rsevgunit  data-rsevact  data-rsevleg  data-rsevrecb  data-rsevdetb
E   data-rscurvemode  data-rscurvegunit  data-rscurvecmp  data-rscurveleg  data-rscurvetblb
```

**Change classes**

```
A   .rs-msel (metric)   .rs-vsel / .rs-vsel2 with data-vscope="pane"
B   .rs-ssel (metric)   .rs-bsel (base)   .rs-vsel / .rs-vsel2 with data-vscope="surp"
C   .rs-csel (metric)   .rs-cpsel (period)
D   .rs-esel (metric)
E   .rs-curvesel (metric)   .rs-curvevsel / .rs-curvevsel2 (snapshots)
```

⚠ Ordering matters: `.rs-csel`, `.rs-cpsel`, `.rs-ssel`, `.rs-curvesel` all also carry `.rs-msel`,
so each returns early before the generic `.rs-msel` branch is reached.

**Markers, not hooks.** These attributes are never listened to — they exist so a handler can walk
up from a clicked control and learn which block it is in (`e.target.closest('[data-rsblock]')`), or
so a re-render can find its host:

```
data-rsblock="<key>"   the A block a control belongs to     data-rsevo="<key>"   the same, for D
data-rssurp            B's host, replaced wholesale by rsRerenderSurp
data-rsconv            C's host          data-rscurve         E's host
data-rstbl / data-rsconvtbl / data-rscurvetbl / data-rsevrec / data-rsevdet
                       the collapsible WRAPPERS; the buttons inside them are the `…b` variants
```

**Repaint granularity** — chosen per control, because a full rebuild costs a chart teardown and any
brushed zoom:

| Control | Repaints |
|---|---|
| A guidance end | **the table only** (`rsRenderTable`) |
| A anything else | that block's chart (`rsBuildChart`), which re-renders its own table |
| B anything | the whole block (`rsRerenderSurp`) — chips, base and legend all depend on the selection |
| C anything | the whole block (`rsRerenderConv`) — which toggles exist depends on the period |
| D chip / mode | `rsBuildEvo(k)`, which rebuilds both tables and both headers |
| E anything | the whole block (`rsRerenderCurve`) |
| A vintage picker | the top row, the note, **all** blocks, then everything |

### The sliders — the one place that is not delegated

Range inputs fire `input`, not `click`, and there is no useful delegation for a drag, so the two
handles are the engine's only directly-bound listeners.

| Wirer | Binds | Handler |
|---|---|---|
| `wireSliders(pane)` | `#rsMin-<key>` / `#rsMax-<key>`, once per A section | a local `onSlide` → `rsSt(k).win` → `rsBuildChart(k)` |
| `wireSurpSlider()` | `rsSurpMin` / `rsSurpMax` via `rsSurpEl` | a local `onSlide` → `rsSurpSt().win` → `rsBuildSurp()` |

Both `onSlide` closures do the same three things: read both handles, **sort them**
(`[Math.min(a,b), Math.max(a,b)]` — either handle can be dragged past the other), and rebuild. They
assign to `.oninput` rather than `addEventListener`, so re-wiring after a re-render replaces the
handler instead of stacking a second one.

⚠ **`wireSliders` looks its inputs up with a bare `document.getElementById`** — the one deliberate
exception to invariant 2 (§12). It is safe *only* because the id carries the section key and
section keys are unique across every dataset that can share a page: the Earnings **Setup** instance
runs on a `*_SETUP` dataset whose sections are named differently. Give a setup dataset a section
called `top` and its slider silently drives the Results block instead. `wireSurpSlider` has no such
escape hatch — B's ids are fixed strings — which is exactly why it goes through `rsSurpEl`.

### `secOf(el)` — which D block did that come from

The Estimates pane wires **one** handler for every D block plus E. `secOf` walks up from the
clicked element to the nearest `[data-rsevo]` and returns its key, which is how a chip in the
Profitability block never repaints Top Line. E needs no equivalent: it is a singleton, so its
branches (`[data-rscurve…]`) are tested **first** and return early, before any `secOf` lookup runs.

---

## 12. Invariants — break these and something renders perfectly while doing nothing

1. **`getResultsData()` returns a trimmed copy.** `_rs.data` is never the dataset module.
2. **The engine renders more than once per page** (Results + the Earnings Setup chart), so ids are
   duplicated. **Scope every lookup to the pane** — `rsPaneEl`, or `pane.querySelector`. A bare
   `document.getElementById` silently finds the *other* instance's element, which is the hidden
   one, so the chart never builds. This has produced two bugs that rendered perfectly and did
   nothing, and one false bug report during testing.
3. **`rsRerenderSurp` assigns to `host.outerHTML`.** Returning `''` **deletes** the block with no
   host to render back into. `rsSurpEmptyHtml` exists for exactly this.
4. **Charts build lazily** — every init runs under `requestAnimationFrame` when its pane becomes
   visible, because Chart.js needs a laid-out canvas. In an unfocused or occluded tab rAF is
   starved and charts read as "never built"; monkey-patch it to `setTimeout` before concluding the
   wiring is broken. **Do not leave that patch on in the full portal** — it fires two builds in one
   tick and throws `Canvas is already in use`.
5. **Curly quotes are fatal.** A `’` used as a JS string delimiter took the whole file down for
   every company once. Typographic quotes inside *prose* are fine; delimiters and HTML attributes
   must be straight.
6. **Click the controls; never trust the markup.** Two bugs in `e21b11b` looked right in the DOM
   and did nothing.
7. **No `node` on the Windows box**, so JS cannot be syntax-checked offline — import the module in
   the browser. `py` is the Python interpreter (`python` is a broken stub), and **a heredoc into
   `py -` hangs the shell.**
8. **Section keys must be unique across every dataset that can share a page.** A block's slider ids
   are `rsMin-<key>` / `rsMax-<key>` and are resolved unscoped (§11). Two datasets on one page with
   a section called `top` — the Results pane and an Earnings `*_SETUP` — hand one slider to the
   wrong chart. The convention is what makes the lookup safe; it is not enforced in code.
9. **A summary column is computed over the window, not the series.** Every `sum*` helper iterates
   `idx`. Compute one over the full array and the Range record stops agreeing with the chart the
   moment anyone touches the slider — while still looking entirely plausible.
