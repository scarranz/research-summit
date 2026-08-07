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
| 4 | Vintage picker in Results ("Estimates as of") | ⚠️ **half** — consensus matrix live (13 vintages); **`estMatrix.summit` NOT populated** | `6122b4d` |
| 1 | Surprise scorecard moved to the foot of **Results** + base/comparator selection | ✅ done | `e21b11b` |
| 3 | "Reported" toggle marking where each FY landed, in Estimates | ✅ done, **inert on UBER** (see §3) | `555c1dd` |
| 2 | SoFi-style Actuals-vs-Guidance table in Estimates | ❌ not started | — |

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

**Change 2 — the SoFi table.** ⚠ **It cannot be fed by UBER's guidance.** SoFi's Actuals-vs-Guidance
walks a full-year guide revised each quarter (`Initial → Q1 revision → … → Actual`). **Uber guides
one quarter ahead only** (Gross Bookings, Adj. EBITDA, and Non-GAAP EPS since 1Q26), so there is no
annual guide to walk. On UBER the same table shape must use **the vintages as the revision axis**:
row per FY = first vintage · latest vintage · actual · revisions n↑/n↓ · vs latest · vs first, plus
SoFi's track-record tiles. Source to port from: `js/overviews/sofi.js` → `guidanceBody()`,
`renderGuidTable()`, `renderGuidAnnual()`, `renderGuidStatsAnnual()`, data shape `GUID_ANNUAL`.

**Change 3 is built but draws nothing on UBER.** The Estimates block covers FY2026–2028 and **all
three are still open**; annual actuals stop at 2025. The pill renders disabled with the reason in
its tooltip — that is correct behaviour, not a bug. To make it live, add **FY2025** to
`evolution.years` and to each evolution metric's `summit`/`cons` rows. One real data point is
already in hand: the **2025-12-15 vintage estimated FY2025 revenue at 52,113** against a **52,017**
actual (0.2% over); FY2025 EBITDA 8,760.2 vs 8,730 actual; `REV_BBG_EST` 51,952.4,
`EBITDA_BBG_EST` 8,718. `OP_INCOME` for 2025 reads a literal `0` — the annual op-income rows are
known-broken (already on the model-audit list). The other four vintages need one MCP pull each.

**Change 4 — `estMatrix.summit`.** Needs one `get_fundamentals` pull per Summit snapshot. UBER has
**9 snapshots**, but **dedupe by `facts_hash`, not by date** — `2026-05-06` and `2026-05-07` are the
same model state. Skip intra-period saves; **`2026-07-20` is unusable** (its Delivery-Hero pro-forma
toggle was on, inflating FY2025 revenue to $67.9B against a $52.0B standalone actual). ⚠ A pull
without `metric_ids` returns ~14.7k facts; filter by `period_keys` (one period ≈ 58 rows) or by
metric UUIDs from `list_metrics`.

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
SUMMIT_DOCS="G:/My Drive/Summit/Docs/0" py emit_matrix.py UBER map_uber.json valid_uber.json
# → out/estmatrix_uber.js ; paste over the estMatrix block in js/results-data/uber.js
py verify_preprint.py UBER map_uber.json      # diff the derived pre-print vs the shipped column
```

**The acceptance test for any ticker:** derive the `preprint` series and diff it against whatever
the dataset already ships. Every mismatch is *rounding*, *a genuine refresh*, or *a bug* — classify
each one before moving on. That diff is what exposed the overwritten snapshot in §4.

## 7. Engine map (`js/results.js`, ~1,800 lines)

| Area | Functions |
|---|---|
| Vintage axis | `rsOrdIn` `rsMatrix` `rsVintages` `rsVintLabel` `rsSeriesFor` **`rsApplyVintage`** `rsVintNote` `rsVintSelHtml` |
| Results pane | `rsBody` `rsBlocksHtml` `rsBuildChart` `rsRenderTable` `rsBuildAll` `wireResults` `initResults` |
| Surprise scorecard | `rsSrcArr` `rsSurpGroups` `rsSurpCmps` `rsSurpBlockHtml` `rsBuildSurp` `rsSurpTableRender` `rsRerenderSurp` `rsSurpEl` |
| Estimates pane | `resultsEvoHtml` `rsEvoBlockHtml` `rsBuildEvo` `rsRenderEvoTable` `initResultsEvo` |
| Reported marker | `rsEvoActual` `rsEvoActualPct` `rsEvoActYears` `rsEvoActHtml` `rsRerenderEvoHead` |

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
