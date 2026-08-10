# Results / Estimates revamp — handoff

**Branch:** `feat/results-estimates-revamp` (pushed, **no PR** — SAB reviews first).
**Started:** Aug 7, 2026 · **Owner:** SAB · **Reference company:** UBER.
**Read `docs/RESULTS_CONVENTIONS.md` §8 first** — it is the data contract this work is built on.

This file exists so the work can be picked up on another machine. Everything needed is in the
repo; nothing important lives only in a local session.

---

## 1. Why this revamp

SAB's stated priority, in his words: *"lo más importante de todo es que se establezcan una serie de
parámetros definidos para que el rollout de estos tabs hacia nuevas empresas sea seamless"* — the
contract matters more than any single feature. The four UI changes he asked for came second.

Target data flow (all of it already exists, see §4):
* a Bloomberg workbook carrying consensus for every company, snapshotted after each report;
* the Summit MCP carrying estimates, guidance and actuals per snapshot.

## 2. State — what is done

| # | Change | State | Commit |
|---|---|---|---|
| — | Dataset contract v2: the **vintage axis** (`estMatrix`) + rollout recipe | ✅ done | `6122b4d`, `857b65a` |
| 4 | Vintage picker in Results ("Estimates as of") | ✅ **done** — consensus (13 vintages) **and Summit (5)**; pick `2026-07-31` and both sources read from the same day | `6122b4d`, `d95f429` |
| 1 | Surprise scorecard moved to the foot of **Results** + base/comparator selection | ✅ done | `e21b11b` |
| 3 | "Reported" toggle marking where each FY landed, in Estimates | ✅ done, **live on UBER** since FY2025 was added | `555c1dd`, `e1c93b0` |
| 2 | SoFi-style Actuals-vs-Guidance table in Estimates | ✅ **done** — shipped as the **Revision record** at the foot of Estimates, vintage-fed | `1c3f168` |

**All four changes are closed.** What is left is rollout: the contract in
`docs/RESULTS_CONVENTIONS.md` §8 plus the two generators in `scripts/consensus/`, applied per
ticker. The workbook now covers 32 tickers.

**Decisions SAB made, do not re-litigate:**
* **Results and Estimates keep SEPARATE data surfaces.** The hand-authored `evolution` block stays;
  only Results eats from `estMatrix`. (The unified option was offered and declined.)
* The surprise chart uses **a base select + comparator chips**, not an A-vs-B pair.
* Dani's consensus-revision chart in Earnings and our Estimates tab **coexist deliberately** — label
  each one's source on screen so they do not read as duplicates.
* Block order inside Results/Estimates is **left as is**: Top Line · Margins & Profitability ·
  Operating KPIs · Actuals vs Estimates.
* Datasets are **not** being completed until the databases are.

## 3. What is open, and the exact blocker for each

**Change 2 — the SoFi table — shipped as the "Revision record"** (`rsEvoTrack*` in `js/results.js`),
sitting **inside each Estimates block**: chart → revision record → the snapshot-by-snapshot table,
which is **collapsed behind its own title** (`rs-collap` in `css/results.css`; the overview modules'
`ov-collap` is injected inline in `js/overviews/uber.js` and is not reachable from the engine).
SoFi's version walks a full-year guide revised each quarter (`Initial → Q1 → … → Actual`); **Uber
guides one quarter ahead only**, so the saved snapshots are the revision axis instead. Per line:
first view · latest view · actual · revisions n↑/n↓ · net move · first vs actual, over five
track-record tiles. Three things to keep in mind when reading it:

* **Both tables render from `rsEvoVisible()`** — the one place that answers "what is the chart
  drawing". Hide a fiscal year or a source with a legend chip and it leaves the chart, both tables
  and the tiles together. The block's metric select and those chips are the ONLY controls; the
  record deliberately has none of its own, because two controls saying the same thing differently
  is how they get out of step.
* **It follows the mode and the Reported chip.** In % mode the values are the growth/margin the
  chart plots and moves are in percentage POINTS; with Reported off the Actual and First-vs-actual
  columns are removed rather than left blank.

* **"Net move" and "first vs actual" are different questions.** The first is the travel between
  snapshots, the second is the error against the print. They coincide on Summit (after a print the
  stored row carries the reported figure) and diverge on the Street — FY2025 drifted +0.0% while
  sitting 0.1% under the print. That gap is the part of the miss the source never corrected.
* **It is generic.** Every dataset with an `evolution` block gets it; it hides itself below two
  vintages. All six current datasets pass the shape check (keys ⊂ metrics, labelled vintages).

**Changes 3 and 4 are closed** (Aug 10, 2026). What they taught, because it generalises to every
ticker:

* **`estMatrix.summit` holds forward periods only.** A snapshot is an estimate for nothing it
  already knew. Its `projection_history` also carries frozen projections for reported quarters, but
  those belong to whatever vintage stood before *that* print — storing them under the snapshot's own
  date would date them wrong.
* **So `preprint` needs two fallbacks, both in `rsSeriesFor`.** On an already-reported period the
  dataset's flat value wins: it is the projection the model **froze at the print**, and a snapshot is
  only ever as fresh as the day it was saved (UBER 1Q26 revenue reads **14,040 frozen vs 14,014** in
  a Feb-5 file three months stale; 4Q25 EPS **0.894 vs 0.6151**). And where no vintage reaches back
  far enough — every quarter before Dec 2025, the oldest snapshot — the flat value is kept rather than
  blanked. **The matrix adds; it never silently subtracts.** Any ticker whose model snapshots start
  after its reported history needs this, which is all of them.
* **Zeros are dropped, never emitted.** A literal `0` in these models means a row nobody populated.
  That is why forward EBITDA resolves to the Jul-31 vintage: the Aug-5 file left those rows at zero.
* **Reported years hold the ACTUAL, not a forecast.** Once FY2025 printed, the model's annual row and
  the workbook's stored consensus both carry the reported figure. That is why the FY2025 line in
  Estimates goes flat after December — and it is exactly what the Reported toggle is for.
* **Model rows that do not tie to the reported basis stay null.** UBER's annual `ADJ_OPINC` reads
  7,470 against a 6,453 reported non-GAAP figure (the same ~20% spread sits in every 2025 quarter and
  closes in 2026). Publishing it against the Reported marker would invent a miss.

Reproduce with `scripts/consensus/emit_summit_matrix.py` (see §6). The 9 UBER snapshots dedupe by
`facts_hash` to 5 usable: `2026-05-06` == `2026-05-07`; `2026-07-17` / `2026-08-03` are intra-period
saves; **`2026-07-20` is unusable** (Delivery-Hero pro-forma toggle on — FY2025 revenue $67.9B against
a $52.0B standalone actual). ⚠ A pull without `metric_ids` returns ~14.7k facts; filter by
`period_keys` **and** metric UUIDs from `list_metrics`, and even then the response is large enough
that the harness writes it to a file — which is the point: parse the file with the script instead of
transcribing numbers by hand.

## 4. The data sources — and the trap that matters most

Both live in the team's Google Drive, folder `Summit/Docs/0`. **The drive letter differs per
machine** (`G:` here). The scripts take `SUMMIT_DOCS` to override it.

| Source | What it is |
|---|---|
| `BBG_CONSENSUS.txt` | The **exported archive**. Append-only in practice — it never loses a snapshot. |
| `Consensus_Portal.xlsm`, sheet `BBG_CONSENSUS` | The **live sheet**. As of Aug 7 2026: **32 tickers** (10 with 11–13 snapshots; 22 seeded that day with one each). |

⚠ **READ THE UNION OF BOTH, deduped by `data_as_of`.** The live sheet **overwrote its own most
recent row**: for UBER the archive ends at `2026-07-31` and the sheet at `2026-08-07`. The 07-31
snapshot is the **pre-print consensus for the 2Q26 quarter the tab scores** — generating from the
sheet alone silently substitutes a stale April `fq+2` and corrupts the newest surprise. Export the
`.txt` before each refresh, or that history is gone.

⚠ **Only FORWARD horizons are consensus.** `fq+1…fq+4` / `fy+1…fy+5` are estimates. `fq-3`, `fq0`
and `(Rep)`-marked `fy0` are Bloomberg's **own reported** figures, sometimes on another basis —
UBER's reported "ebitda" for 1Q24 reads 708 against a 1,382 Adjusted EBITDA print, which once
manufactured a 46% miss.

⚠ **Bloomberg's adjusted-EPS baskets are off-basis before they reconcile.** Both the `eps` column
and `kpi5` (`adj_eps`) imply ~0.8 for 2Q25 against a 0.602 print. UBER's consensus is nulled before
4Q25 via the per-metric "valid from" rule in `valid_uber.json`. Re-check per ticker.

⚠ **KPI slots are per ticker**, declared in the header's `metric_kpi1…8`. UBER: `kpi1` mobility GB,
`kpi2` delivery GB, `kpi3/4` take rates, `kpi5` adj EPS, `kpi6` trips per MAPC, `kpi7` total trips,
`kpi8` total gross bookings. Never assume slot order.

## 5. How to resume — concretely

```bash
git fetch origin && git checkout feat/results-estimates-revamp

# serve the portal (this repo's own static server; port 8000)
powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
```

The portal at `http://localhost:8000` requires a magic-link login. **To review the tabs without
logging in**, create `harness-uber.html` at the repo root (untracked on purpose — do not commit) and
open `http://localhost:8000/harness-uber.html`:

```html
<!doctype html><html><head><meta charset="utf-8"><title>UBER harness</title>
<link rel="stylesheet" href="css/base.css"><link rel="stylesheet" href="css/shared.css">
<link rel="stylesheet" href="css/companies.css"><link rel="stylesheet" href="css/overview.css">
<link rel="stylesheet" href="css/industry.css"><link rel="stylesheet" href="css/results.css">
<style>body{background:#fff;margin:0;padding:18px 24px;font-family:Inter,system-ui,sans-serif}
#harness{max-width:1180px;margin:0 auto}</style></head><body>
<div id="co-detailview"><div id="harness">Loading…</div></div>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@3.0.1/dist/chartjs-plugin-annotation.min.js"></script>
<script src="env.js"></script>
<script type="module">
  const m = await import('./js/overviews/uber.js');
  const ov = m.uberOverview, c = { id:'harness-uber', ticker:'UBER', name:'Uber Technologies' };
  const host = document.getElementById('harness');
  host.innerHTML = ov.html(c) + ov.deepDive.html(c);
  ov.init(c); ov.deepDive.init(c);
  window.__ov = ov;
</script></body></html>
```

It needs **both** `ov.html()` and `ov.deepDive.html()` (the dd-tabs are wired by the Overview's
`init`, and `deepDiveInit` looks up `#co-detailview`), and it needs `env.js` or `supabase-client.js`
replaces the body with "Configuration Error".

Then: **Deep Dive → Evolution → Results / Estimates**.

**Verification gotchas that cost real time — all still true:**
* `node` is **not installed**. `python`/`python3` are broken WindowsApps stubs; the real interpreter
  is **`py`**. So JS cannot be syntax-checked offline — import the module in the browser instead.
* **`requestAnimationFrame` is starved in a backgrounded/occluded Chrome tab**, so lazily-built
  charts read as "never built" under CDP automation. Monkey-patch it to `setTimeout` before
  concluding the wiring is broken.
* The Chrome extension **blocks `import()` with a `?v=` cache-buster** ("BLOCKED: Cookie/query
  string data"). Drop the query string.
* **Click the controls; never trust the markup.** Both bugs in `e21b11b` — a hidden duplicate block
  stealing `getElementById`, and a base select silently handled as a vintage change — rendered
  perfectly and did nothing.

## 6. Rebuilding the consensus matrix

`scripts/consensus/` — see its README. Short version:

```bash
cd scripts/consensus
# CONSENSUS side — from the Bloomberg workbook
SUMMIT_DOCS="G:/My Drive/Summit/Docs/0" py emit_matrix.py UBER map_uber.json valid_uber.json
# → out/estmatrix_uber.js ; paste over the estMatrix.cons block in js/results-data/uber.js
py verify_preprint.py UBER map_uber.json      # diff the derived pre-print vs the shipped column

# SUMMIT side — from saved Summit-MCP pulls (one get_fundamentals per snapshot, saved to a folder)
py emit_summit_matrix.py UBER map_summit_uber.json <dump-dir>
# → out/estmatrix_summit_uber.js, plus the acceptance diff against the shipped `summit` arrays
```

The summit generator prints its own verdict per metric: `N match · N uncovered (pre-snapshot
history)`, any `frozen-vs-saved` gaps, holes it fills, and — the only line that should ever make you
stop — `DIFF ON A FORWARD PERIOD`.

**The acceptance test for any ticker:** derive the `preprint` series and diff it against whatever
the dataset already ships. Every mismatch is *rounding*, *a genuine refresh*, or *a bug* — classify
each one before moving on. That diff is what exposed the overwritten snapshot in §4.

## 7. Engine map (`js/results.js`, ~1,800 lines)

| Area | Functions |
|---|---|
| Vintage axis | `rsOrdIn` `rsMatrix` `rsVintages` `rsVintDay` `rsVintLabel` `rsVintSrcs` `rsVintAsOf` `rsAsOfDates` `rsVintFor` `rsSeriesFor` **`rsApplyVintage`** `rsVintNote` `rsVintSelHtml` |
| Results pane | `rsBody` `rsBlocksHtml` `rsBuildChart` `rsRenderTable` `rsBuildAll` `wireResults` `initResults` |
| Surprise scorecard | `rsSrcArr` `rsSurpGroups` `rsSurpCmps` `rsSurpBlockHtml` `rsBuildSurp` `rsSurpTableRender` `rsRerenderSurp` `rsSurpEl` |
| Estimates pane | `resultsEvoHtml` `rsEvoBlockHtml` `rsBuildEvo` `rsRenderEvoTable` `initResultsEvo` |
| Reported marker | `rsEvoActual` `rsEvoActualPct` `rsEvoActYears` `rsEvoActHtml` `rsRerenderEvoHead` |
| Revision record | **`rsEvoVisible`** `rsEvoTrackRows` `rsRenderEvoTrack` — and `rsEvoVisible` also filters `rsRenderEvoTable`, so the two tables can never disagree about what is on screen |

**The picker offers three readings, not two** (`rsVintSelHtml`): the pre-print default, an **as of a
date** group where each source resolves to its own latest file up to that date, and the single-file
list **split by archive**. It has to: the two archives keep separate calendars — Bloomberg exports
around each print, the model is saved when the analyst saves it — and on UBER they intersect exactly
once (2026-07-31) out of 18 dates. A merged, unlabelled list silently blanked one source on 17 of
18 picks.

`rsApplyVintage` is the load-bearing one: `m.summit` / `m.cons` are read in ~40 places, so the
vintage selection is resolved into those two arrays **once** rather than threaded through every
reader. Hand-authored flats are stashed as `m._flat_<src>`.

## 8. Not to be forgotten

* **`js/overviews/amzn.js` is contested.** Dani is live on `origin/setup-revamped` with a 267-line
  rewrite that wraps the Evolution pill row in a new `.ce-evohead` and changes the `wireDD` selector.
  That is why this work moved to UBER. Coordinate before touching AMZN's Deep Dive markup.
* UBER's model **guidance rows exist and are all literal `0`** (`GB_LOW/HIGH_GUIDANCE`,
  `EBITDA_*`, `EPS_*`). Guidance is quoted from the releases. If San/Oscar populate them, the next
  refresh can read from the model instead.
* `covered-calls/` and `harness-uber.html` are untracked on purpose — leave them out of commits.
