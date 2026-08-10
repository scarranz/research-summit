# scripts/consensus — rebuilding the per-vintage consensus matrix

Data-prep tooling for the `estMatrix` block in `js/results-data/<ticker>.js`.
Contract: `docs/RESULTS_CONVENTIONS.md` §8 · Current state: `docs/RESULTS_ESTIMATES_HANDOFF.md`.

**This is not part of the site build.** The portal stays a zero-build static site; these scripts
run by hand, on demand, and their only output is a block of JavaScript you paste into a dataset.

## Requirements

`py` (Python 3.14 on this machine — **not** `python`, which is a broken WindowsApps stub) and
`openpyxl`. No other dependencies.

## The sources

Both live in the team's Google Drive under `Summit/Docs/0`. **The drive letter differs per machine**,
so every script honours `SUMMIT_DOCS`:

```bash
SUMMIT_DOCS="G:/My Drive/Summit/Docs/0" py emit_matrix.py UBER map_uber.json valid_uber.json
```

⚠ **The two sources are not interchangeable — read the union.** `BBG_CONSENSUS.txt` is the exported
archive; the `BBG_CONSENSUS` sheet inside `Consensus_Portal.xlsm` is live and **overwrites its own
most recent row**. On UBER the archive holds `2026-07-31` and the sheet holds `2026-08-07`; the 07-31
snapshot is the pre-print consensus for the 2Q26 quarter the tab scores. Losing it silently swaps in
a stale `fq+2`. Export the `.txt` before each refresh.

## The scripts

| Script | What it does | Reads |
|---|---|---|
| **`emit_matrix.py`** | **The generator.** Emits the `estMatrix.cons` block to `out/estmatrix_<tk>.js`. | the **union** of both sources |
| `verify_preprint.py` | Diagnostic: derives the pre-print series and diffs it against the `cons` column the dataset already ships. | the **workbook only** — so forward periods legitimately differ from the union |
| `inspect_matrix.py` | Prints the snapshot × period matrix per metric, plus each snapshot's last reported period and KPI slot names. | the `.txt` only |
| **`emit_summit_matrix.py`** | **The other generator** — the `estMatrix.summit` block, plus its own acceptance diff against the shipped `summit` arrays. | saved **Summit-MCP** pulls, not the workbook |

`emit_summit_matrix.py` is the odd one out: its input is not a file in the team's Drive but one saved
`get_fundamentals` response per model snapshot, pulled Claude-side through the Summit MCP. Save each
response into a folder (the harness already writes the big ones to disk) and point the script at it —
rows are grouped by the `snapshot_date` they carry, so file names do not matter:

```bash
py emit_summit_matrix.py UBER map_summit_uber.json <dump-dir>
```

Pull **only the periods forward of each snapshot's `lastActual`**, with `sheet_sources=
['projection_history']` and explicit `metric_ids` — an unfiltered pull is ~14.7k facts. Its config
(`map_summit_<tk>.json`) carries the metric map, derived sums, the vintage register with each
snapshot's `lastActual`, the dataset's period axis, and a `prefer_source` order for rows that exist
twice. Read the output's verdict line per metric: `N match · N uncovered (pre-snapshot history)` is
healthy, `frozen-vs-saved` is expected and explained in the contract, and only `DIFF ON A FORWARD
PERIOD` means stop.

The read-scope difference between `emit_matrix` and `verify_preprint` is deliberate but easy to trip
over: a `DIFF` on forward periods from `verify_preprint` is expected, because it cannot see the
archive-only snapshot. Reported quarters are the ones that must match.

## Per-ticker config

`map_<tk>.json` — the metric → Bloomberg-column map, per view:

```json
{ "q": { "rev":"rev", "gb":"kpi8", "mobgb":"kpi1", "opinc":"opinc", "ebitda":"ebitda", "eps":"eps" },
  "y": { "rev":"rev", "gb":"kpi8", "ebitda":"ebitda" } }
```

Column names are the header prefixes: `rev`, `opinc`, `ebitda`, `eps`, `nos`, `cfo`, `capex`, `d&a`,
`gross`, and `kpi1`–`kpi8`. ⚠ **The KPI slots are per ticker** — read the header's `metric_kpi1…8`
rather than assuming an order. UBER: `kpi1` mobility GB · `kpi2` delivery GB · `kpi3/4` take rates ·
`kpi5` adj EPS · `kpi6` trips per MAPC · `kpi7` total trips · `kpi8` total gross bookings.

`valid_<tk>.json` — per-metric "consensus is only valid from this period on", for lines where
Bloomberg's basket sits on another basis before it reconciles:

```json
{ "q": { "eps": "4Q25" } }
```

## Adding a ticker

1. `py inspect_matrix.py <TK>` — how many snapshots, which metrics carry data, what the KPI slots
   are, and each snapshot's last reported period.
2. Write `map_<TK>.json`, and `valid_<TK>.json` for any off-basis line.
3. `py emit_matrix.py <TK> map_<TK>.json valid_<TK>.json`.
4. `py verify_preprint.py <TK> map_<TK>.json` — **the acceptance test.** Classify every mismatch as
   rounding, a genuine refresh, or a bug before you move on. Do not skip this: it is what caught the
   overwritten snapshot above.
5. Paste `out/estmatrix_<TK>.js` over the dataset's `estMatrix` block, keeping it at the dataset
   ROOT beside `views` — generated numbers must not mix into the hand-curated metric blocks.

Regenerating UBER today reproduces the committed block byte for byte; that is the reproducibility
check if you suspect drift.
