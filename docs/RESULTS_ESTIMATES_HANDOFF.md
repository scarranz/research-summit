# Results / Estimates — handoff

**Branch:** `feat/amzn-results-estimates` (local, **not pushed** — SAB reviews first).
**Updated:** Aug 17, 2026 · **Owner:** SAB · **Reference companies:** UBER, now **AMZN**.
**Read `docs/RESULTS_CONVENTIONS.md` §8 first** — it is the data contract this work is built on.

This file exists so the work can be picked up on another machine. Everything needed is in the
repo; nothing important lives only in a local session.

---

## 1. Where this stands

The four UI changes SAB asked for in August closed on UBER. This pass did the thing he said
mattered more — *"que se establezcan una serie de parámetros definidos para que el rollout de
estos tabs hacia nuevas empresas sea seamless"* — by taking the second company through the
contract end to end and fixing everything that broke on the way.

| # | Change | State |
|---|---|---|
| — | Dataset contract v2: the vintage axis (`estMatrix`) | ✅ done, and now **proven on a second ticker** |
| 1 | Surprise scorecard at the foot of Results + base/comparator | ✅ done |
| 2 | Actuals-vs-guidance table → shipped as the **Revision record** | ✅ done |
| 3 | "Reported" toggle in Estimates | ✅ done |
| 4 | Vintage picker ("Estimates as of") | ✅ done — **live on AMZN: 30 Street snapshots, 7 Summit** |

**AMZN is now on the axis, with all four series and the Estimates block regenerated.**
The Results and Estimates panes needed **zero engine changes** — everything came from the
dataset, which is the strongest evidence the contract is right.

## 2. What the AMZN migration actually cost, and where the time went

Almost none of it was the dataset. It was that **the Bloomberg export had changed shape** since
the UBER work, and the generators were silently half-blind against it.

1. **The workbook is now self-describing** (`metric1..50` / `code1..50` / `segment1..50` /
   `scale1..50`, values in `<slot>_<horizon>`). The old generator addressed fixed column names
   (`rev_fq+1`, `ebitda_fq0`) that no longer exist. It did not fail — it produced a nearly empty
   matrix. `emit_matrix.py` now binds by **Bloomberg code + segment id** and prints a resolution
   report naming every metric it could not bind.
2. **`Consensus_Portal.xlsm`'s sheet was renamed** `BBG_CONSENSUS` → `CONSENSUS`. The generator
   takes either.
3. **Coverage collapsed from 32 tickers to 4** (AMZN, GOOGL, LYFT, UBER) in both sources. This is
   now the binding constraint on the rollout, and it is a Bloomberg-terminal job, not a code one.
4. **The archive lost its old snapshot dates.** UBER's committed `estMatrix` carries vintages
   (2023-10-26 … 2026-08-07) that no longer exist in either source; the current file holds 13
   UBER snapshots on different dates. **Do not regenerate UBER expecting the committed block
   back** — the README's old "reproduces byte for byte" claim is void. The committed block is now
   the only copy of that history.
5. **A blank `scale` means whole units.** AMZN's NA operating income arrives as `9123000000` next
   to siblings at `1717`. One column read wrong is a 10⁶ error that looks plausible on a chart.
6. **One Bloomberg cell is dead and had to be caught.** See §3.

## 3. The two guard rails that now exist, and why

**The resolution report.** Every configured metric prints the slot it bound to, or `UNRESOLVED`.
Without it a wrong code is indistinguishable from a metric Bloomberg does not carry. Smoke-tested
on LYFT: it immediately flagged `IS_COMPARABLE_EBIT` as unresolved — LYFT uses
`IS_EBIT_AS_REPORTED`.

**The frozen-series check.** A real consensus almost never reprints a value to four decimals.
When a BQL cell dies the export keeps emitting its last result and *relabels it a year forward at
each print*, which reads as a beautifully smooth estimate series and is entirely fictional.

> **AMZN's ANNUAL North-America revenue consensus is dead data.** 473,099 / 517,634 / 561,728 at
> every snapshot since 2021-05-04 — 27 distinct values across 90 cells — labelled FY21–23, then
> FY22–24, … now FY26–28. Today's labelling happens to look plausible. Its history is fiction.
> It is excluded via `"drop": { "y": ["usrev"] }` and the metric note says so on screen. **Its
> QUARTERLY twin moves normally and is used**, so this is one dead cell, not a bad ticker.
> ⚠ **Raise this with San/Oscar** — it is a workbook fix, and the same check should be run on the
> other three tickers (it also fires on LYFT's quarterly EPS: 2 distinct values across 40 cells).

## 3b. Block C came along for the ride — and had a standard violation

Adding `estMatrix` **switches on block C, "Road to the print", by itself** (one period, every
snapshot that was still forecasting it). It appeared on AMZN with no UI work and reads well: for
2Q26 it draws 9 snapshots interleaving both archives, the Street walking 184.1 → 194.8 into a
200.6 print while Summit sat at 199.8 from May onward.

Running `CHART_ENGINE_REFERENCE.md` §0.5 against it — which San's Aug-13 merge makes the standard
— turned up a real gap in **engine** code, not in the dataset:

> **`rsConvTableRender` ignored `st.hidden`.** Hiding a legend chip removed the line from the chart
> but left its rows in the table underneath. §0.2 rule 2 calls that out by name: *"a legend that
> hides a line from the chart while the table keeps totalling it is worse than no legend, because
> the reader now trusts a number that is not on screen."*

Fixed in `js/results.js` — all four chips (Summit, Consensus, Guidance, Reported) now drop their
rows and restore them, and the `gptShown()` guidance-pill latch still migrates the pills to
whichever row survives. **This is pre-existing and also affects UBER**, which is the only other
ticker with the block; call it out in the PR body so the UBER diff is not a surprise.

⚠ **Not verified: the ~380px item of §0.5.** The harness would not give a real narrow viewport, and
the markup is identical to UBER's shipped version, so it is untested rather than passing.

## 4. Two open flags this pass closed, and two it opened

**Closed:**
* *"MCP-vs-file EBITDA reconciliation"* (old §4) — **it was a date mismatch, not a data conflict.**
  The file was the 2026-05-05 vintage and the MCP pull was 2026-05-13. At the same date the two
  agree to the dollar (both $208,443M for FY2026). The model genuinely re-cut EBITDA in between.
* *"2028 total capex $150.8B vs a ~$245B segment sum"* — the model closed it itself: the
  2026-08-03 save took FY2028 capex to $346.0B.

**Opened:**
* ⚠ **FY2028 EBITDA.** The 2026-08-04 file lifts it from $311.1B to $430.1B (and FY2029 $375.7B →
  $531.7B) on a <2% revenue change — a 39% implied margin against 29% a day earlier, and 21%
  *above* a consensus the model had been below in every prior file. Flagged in the metric note and
  visible in Estimates. **Ask the model owner before quoting an out-year margin.**
* ⚠ **FY2029 capex is empty** from the 2026-08-03 save onward, so FY2029 capex and free cash flow
  stop after Jul 30.

### On the merged chart standard (PR #90)

`CHART_ENGINE_REFERENCE.md` §0 is now the build manual and this work was re-checked against it.
Nothing in the dataset or the generators had to change. Two doc corrections were made, both
invited by §0.6's own rule (*"where this section and Amazon disagree, Amazon is right"*):

* the capability table said `estMatrix` was **UBER only** — it is now AMZN · UBER;
* added that Bloomberg coverage (four tickers) is the ceiling, and that `estMatrix` switches on
  block C by itself.

`RESULTS_CONVENTIONS.md` §9 no longer restates a verification checklist; it points at §0.5 and
keeps only the matrix-specific traps.

## 5. How to resume — concretely

```bash
git fetch origin && git checkout feat/amzn-results-estimates
node -e "1"                       # node IS installed (v24) — the old doc said otherwise
```

The portal at `http://localhost:8000` requires a magic-link login. To review the tabs without
logging in, create `harness-amzn.html` at the repo root (untracked on purpose — do not commit)
and serve the directory:

```html
<!doctype html><html><head><meta charset="utf-8"><title>AMZN harness</title>
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
  window.requestAnimationFrame = fn => setTimeout(fn, 0);   // starved in a backgrounded tab
  window.__errs = [];
  window.addEventListener('error', e => window.__errs.push(String(e.message)));
  window.addEventListener('unhandledrejection', e => window.__errs.push('rej: ' + e.reason));
  const m = await import('./js/overviews/amzn.js');
  const ov = m.amznOverview, c = { id:'harness-amzn', ticker:'AMZN', name:'Amazon.com' };
  const host = document.getElementById('harness');
  host.innerHTML = ov.html(c) + ov.deepDive.html(c);
  ov.init(c); ov.deepDive.init(c);
  window.__ov = ov; window.__ready = true;
</script></body></html>
```

It needs **both** `ov.html()` and `ov.deepDive.html()`, and it needs `env.js` (gitignored — copy
it from another worktree) or `supabase-client.js` replaces the body with "Configuration Error".

Then: **Deep Dive → Evolution → Results / Estimates.**

**Verification gotchas — the current list:**
* `node` **is** installed (v24). `python`/`python3` are still broken WindowsApps stubs; use `py`.
  Import a dataset in node to catch a syntax error in one second.
* **Charts build lazily on visibility, and a hidden PARENT counts.** Clicking the `Results`
  sub-tab while the Deep Dive `Evolution` tab is not selected leaves `offsetParent` null and
  reports zero charts — it looks broken and is fine. Click the `.dd-tab` first.
* **Reset the vintage picker between checks.** A single-file mode left over from a previous step
  makes every later reading look empty. That is the mode working, not a regression.
* **`requestAnimationFrame` is starved in a backgrounded/occluded tab** — patch it as above.
* Long `await`-driven loops over chart rebuilds time out CDP at 45s. Drive the selects
  synchronously and read `Chart.getChart(canvas)` back.
* **Click the controls; never trust the markup.**

## 6. Rebuilding the data

See `scripts/consensus/README.md` — it now carries the full per-ticker recipe. Short version:

```bash
cd scripts/consensus
export SUMMIT_DOCS="G:/My Drive/Summit/Docs/0"
py inspect_matrix.py AMZN                                   # step 1: what does the workbook carry
py emit_matrix.py AMZN map_amzn.json                        # read BOTH reports it prints
py emit_summit_matrix.py AMZN map_summit_amzn.json dumps_amzn
py emit_evolution.py     AMZN map_summit_amzn.json dumps_amzn
py apply_matrix.py AMZN                                     # splice both halves in
py verify_preprint.py AMZN cons                             # acceptance: blanked MUST be 0
```

`dumps_amzn/` holds one saved Summit-MCP `get_fundamentals` response per snapshot (7 files, ~1.1MB,
untracked). Re-pull with `sheet_sources=['projection_history']`, explicit `metric_ids`, and every
period on the dataset's axis — the harness writes large responses to disk, so copy the file it names.

**AMZN acceptance result (Aug 17):** `same=82 · changed=51 · filled=110 · blanked=0`. All 51
changes are forward periods moving to the post-2Q26-print snapshot; all 110 fills are Street
history the segment lines never had.

## 7. Engine map (`js/results.js`)

Unchanged this pass — listed here because nothing in it needed touching.

| Area | Functions |
|---|---|
| Vintage axis | `rsOrdIn` `rsMatrix` `rsVintages` `rsVintDay` `rsVintLabel` `rsVintSrcs` `rsVintAsOf` `rsAsOfDates` `rsVintFor` `rsSeriesFor` **`rsApplyVintage`** `rsVintNote` `rsVintSelHtml` |
| Results pane | `rsBody` `rsBlocksHtml` `rsBuildChart` `rsRenderTable` `rsBuildAll` `wireResults` `initResults` |
| Surprise scorecard | `rsSrcArr` `rsSurpGroups` `rsSurpCmps` `rsSurpBlockHtml` `rsBuildSurp` `rsSurpTableRender` `rsRerenderSurp` `rsSurpEl` |
| Estimates pane | `resultsEvoHtml` `rsEvoBlockHtml` `rsBuildEvo` `rsRenderEvoTable` `initResultsEvo` |
| Reported marker | `rsEvoActual` `rsEvoActualPct` `rsEvoActYears` `rsEvoActHtml` `rsRerenderEvoHead` |
| Revision record | **`rsEvoVisible`** `rsEvoTrackRows` `rsRenderEvoTrack` |

The picker offers three readings, not two (`rsVintSelHtml`): the pre-print default, an **as of a
date** group where each source resolves to its own latest file up to that date, and the
single-file list **split by archive**. On AMZN the two archives intersect on exactly 2 of 35
dates (2026-02-10 and 2026-08-04, labelled "· in both"), which is why the split is not optional.

## 8. Decisions SAB made — do not re-litigate

* Results and Estimates keep **separate data surfaces**. Only Results eats from `estMatrix`.
* The surprise chart uses **a base select + comparator chips**, not an A-vs-B pair.
* Dani's consensus-revision chart in Earnings and our Estimates tab **coexist deliberately**.
* Block order inside Results/Estimates is **left as is**.
* **Estimates stays ANNUAL** (Aug 10, 2026) — asked and answered with the data.
* Datasets are **not** being completed until the databases are.

## 9. Not to be forgotten

* **UBER's committed `estMatrix` is now the only copy of its own history** — see §2.4. Before any
  refresh of it, export `BBG_CONSENSUS.txt` and diff the vintage list.
* The other five datasets (GOOGL, META, IBKR, SPOT, LYFT, TBBB) are still on v1 flat arrays and
  render correctly — the picker simply does not appear. GOOGL and LYFT are in the workbook and
  could be moved next; META/IBKR/SPOT/TBBB cannot until Bloomberg coverage returns.
* `covered-calls/`, `harness-*.html`, `env.js` and `scripts/consensus/dumps_*/` are untracked on
  purpose — leave them out of commits.
