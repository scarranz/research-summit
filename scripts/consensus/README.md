# scripts/consensus — standing a ticker up on the vintage axis

Data-prep tooling for the `estMatrix` block and the `evolution` block in
`js/results-data/<ticker>.js`.
Contract: `docs/RESULTS_CONVENTIONS.md` §8 · Current state: `docs/RESULTS_ESTIMATES_HANDOFF.md`.

**This is not part of the site build.** The portal stays a zero-build static site; these scripts
run by hand, on demand, and their only output is a block of JavaScript spliced into a dataset.

## Requirements

`py` (Python 3.12 on this machine — **not** `python`, which is a broken WindowsApps stub) and
`openpyxl`. `node` **is** installed (v24) and is the fastest way to syntax-check a dataset:

```bash
node --input-type=module -e "const m=await import('./js/results-data/amzn.js'); console.log('ok')"
```

## The sources

| Source | What it is |
|---|---|
| `BBG_CONSENSUS.txt` | The exported archive. One row per (ticker, snapshot). |
| `Consensus_Portal.xlsm`, sheet **`CONSENSUS`** | The live sheet. Same columns; can hold a row the archive lacks. |
| Summit MCP `get_fundamentals` | The model's own projections, one pull per snapshot. |

Both files live in the team's Google Drive under `Summit/Docs/0`. The drive letter differs per
machine, so every script honours `SUMMIT_DOCS`:

```bash
SUMMIT_DOCS="G:/My Drive/Summit/Docs/0" py emit_matrix.py AMZN map_amzn.json
```

⚠ **Read the union of both.** `emit_matrix.py` does, and prints which snapshots came from only
one of them. Export the `.txt` before each refresh or a sheet-only row is lost.

⚠ **Coverage is the binding constraint, not the tooling.** As of Aug 2026 both sources carry
**four tickers — AMZN, GOOGL, LYFT, UBER.** An earlier note claimed 32; that is no longer true.
`inspect_matrix.py <TK>` on anything else exits telling you what is actually there. Adding a
ticker to the workbook is a Bloomberg-terminal job for San/Oscar, and nothing here can work
around it.

## The schema changed in Aug 2026 — address metrics by CODE

The workbook is now **self-describing**. Each row declares its own slots:

```
metric1..50      code1..50      segment1..50      unit1..50      scale1..50
metric_kpi1..50  code_kpi1..50  segment_kpi1..50  unit_kpi1..50  scale_kpi1..50
```

and carries values in `<slot>_<horizon>` columns (`metric12_fq+1`, `kpi3_fy+2`) over
`fq-4..fq+4` and `fy-2..fy+3`. Each horizon column names its period: `2026 Q3 (Fwd)`,
`2025 A (Rep)`.

So a metric is addressed by its **Bloomberg code (+ segment id)**, never by slot number. Slot
numbering is a property of the export; the codes differ per ticker too — AMZN's operating income
is `IS_COMPARABLE_EBIT`, LYFT's is `IS_EBIT_AS_REPORTED`. The pre-v2 configs named fixed columns
(`rev_fq+1`, `ebitda_fq0`) that no longer exist, which is why a stale config yields an
almost-empty matrix instead of an error.

⚠ **Read the `scale` column.** A blank scale on a money row means whole units, not millions.
AMZN's North-America operating income arrives as `9123000000` next to siblings at `1717`. Declare
the target `unit` (`usdM` / `eps`) and the generator normalizes; get it wrong and one series is
off by 10⁶ while looking perfectly plausible on a log-ish axis.

## The scripts

| Script | What it does |
|---|---|
| **`inspect_matrix.py`** | **Step 1.** Every slot with its code, segment, scale and populated horizons; the snapshot list with each file's last reported period; whether the layout drifts. Write `map_<tk>.json` off its CODE column. |
| **`emit_matrix.py`** | The consensus generator → `out/estmatrix_<tk>.js` + a `.json` sidecar. Prints a **resolution report** (every configured metric, the slot it bound to, how many snapshots carry it) and a **frozen-series check**. |
| **`verify_preprint.py`** | **The acceptance test.** Replays the ENGINE's own `preprint` rule over the emitted sidecar and diffs it against the flat arrays the dataset ships. |
| **`emit_summit_matrix.py`** | The Summit side of `estMatrix`, from saved MCP dumps, with its own acceptance diff. |
| **`emit_evolution.py`** | The Estimates pane's `evolution` block, from the same dumps — the opposite read (all years, not just forward). |
| **`apply_matrix.py`** | Splices both halves into the dataset as one `estMatrix` block. Re-running replaces it wholesale. |

### The two guard rails, and why they exist

**The resolution report.** Every configured metric prints the slot it resolved to, or
`UNRESOLVED`. A wrong code is otherwise indistinguishable from a metric Bloomberg does not carry.

**The frozen-series check.** A real consensus is a fresh survey every quarter; it essentially
never reprints a value to four decimals. When a BQL cell dies the export keeps emitting its last
result and *relabels it a year forward at each print* — which reads as a beautifully smooth
estimate series and is entirely fictional. AMZN's ANNUAL North-America revenue does exactly this:
473,099 / 517,634 / 561,728 at every snapshot since May 2021 (27 distinct values across 90
cells), labelled FY21–23, then FY22–24, … now FY26–28. Its quarterly twin is fine, so this is one
dead cell, not a bad ticker. Anything flagged goes in `drop` until Bloomberg is fixed:

```json
"drop": { "y": ["usrev"] }
```

## Adding a ticker — the whole recipe

```bash
cd scripts/consensus
export SUMMIT_DOCS="G:/My Drive/Summit/Docs/0"

# 1. what does the workbook actually carry?
py inspect_matrix.py <TK>

# 2. write map_<TK>.json off the CODE column (+ valid_<TK>.json for off-basis lines)
# 3. generate, and READ BOTH REPORTS
py emit_matrix.py <TK> map_<TK>.json valid_<TK>.json

# 4. the acceptance test — classify every difference before moving on
py apply_matrix.py <TK> && py verify_preprint.py <TK> cons
```

`verify_preprint.py` prints four counts per metric:

| Count | Means |
|---|---|
| `same` | the matrix reproduces what the dataset already shipped |
| `filled` | the matrix has a value where the dataset had `null` — the win |
| `changed` | a genuine refresh, a rounding difference, or a bug. **Classify each one.** A change on a REPORTED period means the frozen flat value lost, which should not happen |
| `blanked` | **must be 0.** The matrix ADDS; it never subtracts |

For the Summit side, save one `get_fundamentals` response per snapshot into a folder (the
harness writes large ones to disk already, so copy the file it names) and:

```bash
py emit_summit_matrix.py <TK> map_summit_<TK>.json <dump-dir>
py emit_evolution.py     <TK> map_summit_<TK>.json <dump-dir>
py apply_matrix.py <TK>
```

Pull `sheet_sources=['projection_history']` with explicit `metric_ids`, over every period on the
dataset's axis. `emit_summit_matrix.py` enforces forward-only itself, and `emit_evolution.py`
needs the reported years too, so one pull per snapshot serves both.

Read the Summit emitter's verdict per metric: `N match · N uncovered (pre-snapshot history)` is
healthy, `frozen-vs-saved` is expected and explained in the contract, and only
`DIFF ON A FORWARD PERIOD` means look — normally it just means a newer snapshot moved.

### `map_<tk>.json` (consensus)

```json
{ "segments": { "na": "SEG0000227430", "aws": "SEG0000227465" },
  "drop": { "y": ["usrev"] },
  "q": { "rev":   { "code": "SALES_REV_TURN", "unit": "usdM" },
         "aws":   { "code": "SALES_REV_TURN", "unit": "usdM", "segment": "aws" },
         "eps":   { "code": "IS_COMP_EPS_GAAP", "unit": "eps" },
         "capex": { "code": "HEADLINE_CAPEX", "unit": "usdM", "sign": -1 } },
  "y": { "…": "…" } }
```

Identify a segment id by tying its `fq0` value to the last printed quarter — that is how AMZN's
three were pinned (NA 116,177 / Intl 42,197 / AWS 42,232 for 2Q26).

`valid_<tk>.json` carries per-metric "consensus is only valid from this period on", for lines
where Bloomberg's basket sits on another basis until it reconciles.

### `map_summit_<tk>.json` (Summit + evolution)

Beyond the metric map it carries `derived` (per view — quarterly totals are often the sum of
segment rows because the model zeroes its own total; annual is usually read straight), `sign`,
the `vintages` register with each file's `lastActual`, the dataset's period `axis`, and an
`evolution` block with `cons_metrics` (the BBG figures the model stores inside its own snapshot —
best provenance, same save date) and `cons_map` (the workbook mapped onto the model's calendar,
up to three months stale — say so in the note).

**Establish `lastActual` from the DATA, not the calendar.** AMZN's 2026-07-30 and 2026-08-03
files are dated after the 2Q26 print but still carry the May projection for 2Q26, so both are
pre-print saves; 2026-08-04 is the re-cut that ingested it.

`emit_evolution.py` carries existing prose across a refresh and then tells you to re-read it —
a note written against three snapshots is wrong the moment there is a fourth.
