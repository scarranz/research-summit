# AMZN — Bottom Line deep-dive tab

**Branch:** `feat/amzn-bottom-line` (worktree `research-summit-bottomline`, remote `origin` = `scarranz/research-summit`)
**File:** `js/overviews/amzn.js` — everything below is in this single module (no new files, no build step).
**Last major work:** 2026-08-11.

> Purpose of this doc: full context of what the Bottom Line tab **is**, where its data comes
> from, how the depreciation engine works, and the complete record of what was discussed and
> built. Written so anyone (or a future session) can pick it up without re-deriving.

---

## 1. What this is and why

The **Bottom Line** section of Amazon's Deep Dive answers one question with more depth than the
DCF shows: **how Amazon actually earns its operating income — cost structure, margins, segment
profitability, and the capex → depreciation cycle that is currently pressuring the margin.**

Design rules the user set (and enforced hard through several rounds):
- **No walls of text, no condescending AI-generated prose, no metaphors** ("the profit engine"
  is the *only* sanctioned flourish, as a section title). Lead with the analytical implication.
- **Visual depth over generic charts** — diagrams, flows, arrows, click-to-deep "worlds."
- **Every number must tie to a filing** — 10-K / 10-Q / 8-K / earnings calls / Bloomberg
  consensus. No invented figures. (We got burned on this — see §8.)
- **Go deeper than the DCF**: reproduce its mechanics, then sensitize beyond its single scenario.
- UI content in **English**; working discussion in Spanish.

---

## 2. Tab architecture

Deep Dive spine → **Bottom Line** dd-pane → nested `.ovt-subtab` / `.ovt-subpane[data-ovst]`:

| Subtab (`data-ovst`) | What it covers |
|---|---|
| **Margins & Expenses** (`margins`) | *(merged 2026-08-11)* Gross & operating margin, quality-of-earnings, what-moved-the-margin bridge, cost structure, SBC, leases, + the 6 expense full-dives |
| **Segments** (`segments`) | Operating income & margin by segment, capital deployed by segment (incl. capex intensity), + the 3 segment full-dives |
| **Capex & Depreciation** (`capex`) | The reproduced DCF engine + sliders + scenarios + sensitivity + consensus evolution |

Lazy chart builds via `aChartReady(id)` (checks `cv.offsetParent`), `aDestroy(id)`, `_aCharts`
registry. Dispatcher: `aBuildSub(root, dd, key)` (~line 3817) — for `bottomline`, `capex` →
`aBuildCapex`, `segments` → `aBuildSegments`, else (`margins`) → `aBuildBottomline()` **and**
`aBuildExpenses()` (both target the merged pane).

**Drill-down pattern:** `data-detail="kind:id"` on `.ov-clickable` elements → delegated click →
`resolve(key)` dispatcher → `openM(t,h)` into `#amznModalB`. Kinds: `exp:` (expense worlds),
`seg:` (segment worlds), plus `hist`/`prod`/`ce`.

---

## 3. Data sources (authoritative — never "from the internet")

| Data | Source | Constant in file |
|---|---|---|
| Gross PP&E by class, dep, capex, revenue, margins (FY19–28) | Local Summit `.xlsm` DCF (Projection History) | `A_CAPEX`, `A_QTR` |
| Functional expenses + segment rev/opInc (FY18–25) | 10-K MD&A | `A_OPEX`, `A_OPEX_FN` |
| Quarterly functional expenses (Q1'24–Q2'26) | 8-K earnings releases | `A_OPEXQ` |
| Segment capex / PP&E, SBC by function, lease cost/liability | 10-K Notes 3, 4, 10 | `A_TENK` |
| Consensus capex/D&A evolution (12 snapshots) | Bloomberg consensus snapshots | `A_CONS` |
| Gigawatts + seasonality | Summit model / disclosures | `A_GW`, `A_QSEAS` |
| Management commentary timelines | Amazon earnings calls (summarized) | `EW_CALLS`, `SEG_CALLS` |

**Important correction (validated against 10-K):** the DCF stores "Other operating expense"
negated. We negate it back to positive (expense) so operating margin = reported **11.2%** (was
inflated to 12.4%). 10-K tie: "$763M and $4.6B during 2024 and 2025."

> The Capex/D&A engine is wired from the **local `.xlsm` Projection History**, NOT the MCP
> snapshot — the 2026-07-20 MCP snapshot is toggled to a Delivery-Hero pro-forma and would
> mis-state Delivery/Revenue. (See memory `uber-dcf-dher-toggle`, same class of trap.)

---

## 4. The Capex → Depreciation engine (the "beyond the DCF" core)

Reproduces the DCF's D&A build to **±0.017%** per year. Core relation, per asset class:

```
depClass = (priorGross / life) × adjFactor  +  (additions / life) × deployFactor
```

- **Classes & lives:** Servers 5.7y, Buildings/L&B 40y, Heavy equipment 11.5y, Other 6.5y.
  CIP (15%) and land (5% of L&B) are **non-depreciable**; CIP flows into L&B at 0.40/yr.
- **`deployFactor`** — a time-weighting on the current-year additions (assets deployed mid-year
  depreciate partially). Calibrated per year against the DCF; default ≈ 0.59.
- **`adjFactor`** (≈ 0.955) — a small calibration on the prior-year stock.
- Functions: `aCxRun(st)` runs the build for a state object; `aCxState(root)` reads the sliders;
  `aCxAnnual` / `aCxKPIs` / `aCxReadout` surface the outputs.

### What the Capex & Depreciation subtab contains
- **Sliders** for every driver (capex growth by year, class mix, useful lives, deploy/adj
  factors) with a live Σ-check on the mix (must ≈ 100%).
- **Named scenarios** (2026-08-11): **Base / AI supercycle / Deceleration** buttons that set the
  sliders instantly. FY28 D&A range: **$109B (decel) · $145B (base) · $198B (AI)**.
- **Cycle chart** (dual-thumb range slider), **gigawatts**, **deployment cadence** (Capex⇄D&A
  seasonality toggle), **class mix** (% ⇄ $B), **effective depreciation rate**.
- **Sensitivity tornado** — which driver moves D&A most, with **FY26/27/28 toggle** (2026-08-11).
  Base D&A $86B → $112B → $145B; **capex growth and server useful life dominate the swing** in
  all three years — that is where the forecast risk sits.
- **Consensus capex & D&A evolution** — 12 Bloomberg snapshots; each estimate line **truncates
  at its report date** (`spanGaps:false`), with a **dashed horizontal line at the actual** once
  reported (`acxActuals` plugin) and **per-FY chips**. (This is the focused capex/D&A chart —
  NOT the full Setup metric-selector, which was tried and rejected.)

---

## 5. Margins & Expenses subtab (merged)

Flow, top to bottom — a single narrative "here is the margin → what moved it → each cost line":

1. **Operating margin** chart, toggle **Gross & operating ⇄ By segment** (default shows the
   **gross margin** line + operating margin line) and **Annual ⇄ Quarterly**.
2. **Operating income by segment** ($B ⇄ margin-contribution toggle).
3. **Reported vs underlying operating margin** (quality of earnings, 2026-08-11): Reported
   $80.0B / 11.2% **+ FTC $2.5B + severance $2.7B → underlying ~$85.2B / 11.9%**. Note: AWS's
   Q2'26 margin carried ~130bps of energy-derivative gains pulling the other way.
4. **What moved the operating margin** (bridge) — each functional line's change in its share of
   revenue (green = fell/added to margin, red = rose/compressed), FY23/24/25 toggle. The sum bar
   is labeled **"Operating margin change"** (was mislabeled "Net margin change" — fixed
   2026-08-11; the calc always included cost of sales, so it captures gross-margin movement too).
5. **Functional cost as % of revenue** (common-size), **Annual default** (FY2018–2025 clean;
   quarterly via toggle — this fixed the "2025 en blanco" complaint).
6. **Stock-based comp by function** and **Lease cost** (operating vs finance amort/interest vs
   variable). *Lease caption corrected:* finance leases ($55.6B) **are** in PP&E; operating
   leases ($86B RoU) are separate — earlier "capacity never in owned PP&E" was wrong.
7. **Six expense full-dive cards** → click → the "world."

---

## 6. The full-dive "worlds" (expense & segment)

Built by `ewBase(cfg)` (expenses) and inline (segments), sharing `EW_CSS` / `ewSpark` /
`ewBoxes`. Each world has: KPI tiles → what sits inside the line → share-of-revenue sparkline →
why it matters → the drivers → where it's headed → (techInfra/AWS: an extra flow diagram + quote)
→ **the call-commentary timeline** → sourced footer.

### Call-commentary timelines (2026-08-11 — the biggest addition)
The user's ask: *"like the Earnings feature, but instead of general themes, the theme = a
specific expense or margin — hunt and group the call commentary over time and embed it inside
each box, to explain WHY the line moved and what's expected."*

Implemented as **"What management has said — over time"** — a vertical timeline
(`ewCallTimeline`) inside all **9 worlds**, each item tagged **driver / forward / context**.
Data in `EW_CALLS` (6 expenses) and `SEG_CALLS` (3 segments), grounded in the real call record:

- **Fulfillment:** COVID over-build (2022) → **regionalization** (2023, one national → 8 regions)
  → robotics (Sequoia, Proteus, Shreveport) → flat-to-down forward.
- **Technology & infrastructure:** 18k role cuts (Jan'23) → **custom silicon** (Trainium /
  Inferentia / Graviton) → **AWS demand outstripping capacity** (Q3'25) → 14k corporate cuts
  (Oct'25) → still rising because depreciation of the build outruns the payroll saving.
- **Cost of sales:** regionalization → cost-to-serve down YoY first time since 2018 → mix shift
  to AWS/ads/3P as the structural lever.
- **G&A:** the **27,000** layoffs (2023), "fewer managers, more builders," the 14k of Oct'25.
- **Sales & marketing:** pullback 2022 → monetizing own ad surface → Prime maturity leverage.
- **Other opex:** the **$2.5B FTC** settlement (Q3'25), Italy tax, store impairments — one-offs.
- **AWS:** decel→reaccel, RPO backlog step-up, energy-derivatives +130bps / ~520bps clean, FY26
  capex frame ~$220B. **NA:** 2022 trough → advertising as the margin lever → FTC charge in 3Q25.
  **Intl:** crossed into profit in 2024; FX +$903M can swing the print as much as operations.

### Segments — capital intensity lens (2026-08-11)
Capital-deployed chart gained a **$B ⇄ % of segment revenue** toggle. The tell: **AWS reinvests
~75% of its own revenue in capex** (2025), up from ~27% (2023); retail segments <10%. That is
the AI build in one number, and why depreciation concentrates in AWS.

---

## 7. Session record — 2026-08-11

### Earlier in the day (autonomous "prosigue" run)
1. **Quality of earnings** tile strip in Margins (reported → underlying op margin).
2. **Named scenarios** in the Capex engine (Base / AI / Deceleration).
3. **Capex-intensity toggle** in Segments (AWS 75% of revenue).

### The five-thread feedback and resolutions
The user then gave consolidated feedback; all five were executed and harness-verified:

| # | Feedback | Resolution |
|---|---|---|
| 1 | "should be **operating** margin change, not net" | Relabeled bridge sum bar + caption to "Operating margin change." |
| 2 | "why not **merge Margins and Expenses**? I can't see margins apart from expenses" | Merged into one **Margins & Expenses** subtab; coherent margin→drivers→lines flow. |
| 3 | "I don't see **gross margin** either" | Gross margin is the default line in the top chart of the merged tab. |
| 4 | "integrate something like **Earnings but keyed to a specific expense/margin** — hunt call comments over time, embed in each box" | `EW_CALLS` / `SEG_CALLS` timelines in all 9 worlds, tagged driver/forward/context. |
| 5 | "sensitivity should toggle **FY2026 → FY2028**, not one year" | Tornado FY26/27/28 chips; base $86B/$112B/$145B. |

### Prior corrections worth remembering (don't regress)
- **otherOpex sign** — stored negated in the DCF; negate back (op margin 11.2%, not 12.4%).
- **Consensus chart** — the focused capex/D&A chart with the dashed actual-line plugin is the
  *desired* one; the full Setup metric-selector was explicitly rejected.
- **Leases** — finance leases ARE in PP&E; operating-lease RoU is separate.
- **Segments/margins overlap** — segment op income/margin appears in both Margins and Segments;
  the user deferred the placement decision ("luego definimos dónde va cada cosa") — left as is.
- **No editorial prose / no obvious permission-asking** (memories `dani-no-editorial-prose`,
  `dani-no-obvious-questions`).

---

## 8. How this is verified (no render access)

This session cannot see the rendered charts. Everything is verified by:
1. `node --check` on the module (syntax).
2. A **Node vm harness** that stubs `document` / `Chart` / `amznResults`, `runInContext`s the
   module, then calls the body/build functions and asserts on the returned HTML strings and on
   `aCxRun` numeric outputs (e.g. FY28 D&A per scenario, capex-intensity %, timeline item counts).
3. Numeric ties to reported figures (op margin 11.2%, AWS capex 75% of revenue, D&A base years).
4. `curl` the local server (`http://127.0.0.1:8001/js/overviews/amzn.js`) → HTTP 200.

**The user does the visual judgment pass at the end** — layout, color, density, whether a chart
is redundant. Those require eyes on the render and are the open feedback loop.

---

## 9. Running locally

Local dev server on port 8001 (the worktree is what the browser serves — earlier a whole session
was lost editing the wrong `research-summit` dir instead of `research-summit-bottomline`).
`env.js` must exist in the worktree (copied from the sibling). Hard-refresh (Ctrl+F5) after each
change — the module is cached aggressively.

---

## 10. Open items / next candidates

- Visual review pass by the user (the real open loop): trim any redundant chart, color/density.
- Decide final placement of the segment op-income/margin content (Margins vs Segments overlap).
- Segments still felt "incomplete" to the user before the call timelines — reassess after review.
- Eventually: confirm branch/PR strategy vs `feat/earnings-followup` (separate worktree, same
  base commit) before merge. Push target is always **`origin` = scarranz**, never the DOAA351 fork.
