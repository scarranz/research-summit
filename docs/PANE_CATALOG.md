# The pane catalog — every Deep Dive pane, its data contract, its metrics

**Companion to `COMPANY_PROFILE_BLUEPRINT.md`.** That file explains the *system* — the tab spine,
the three kinds of pane, the palette, the interaction contract, the build order. This file is the
*inventory*: for **every single sub-tab** in AMZN's Deep Dive (the reference implementation, now
finished), it names the exact function that renders it, whether it is engine-driven or bespoke,
the exact metric/field list it needs, and — the part that decides how much work a new company
actually is — **what you would have to hand-author to stand up that same sub-tab for a new
ticker.**

Read `COMPANY_PROFILE_BLUEPRINT.md` first. Come here when you're about to build a specific
sub-tab and need to know exactly what data shape to write.

**How this was compiled (Sep 8, 2026):** read directly from the current `js/overviews/amzn.js`
(and its companion files `amzn-histmult.js`, `amzn-sensitivity.js`, `amzn-target-multiple.js`,
`management.js`, `js/segments.js`, `js/segments-data/amzn.js`) — not from memory, not from older
docs. `docs/AMZN_BOTTOM_LINE.md` is **stale** (dated Aug 11, 2026 — it still shows "Capex &
Depreciation" as a Bottom Line sub-tab; it moved to Miscellaneous since) and should not be trusted
over this file or the code itself.

---

## 0. The master skeleton — exact wiring, so you know where to plug in

This is the literal HTML-building code in `js/overviews/amzn.js` (the function that returns the
Deep Dive's outer shell), reduced to its skeleton. Every `data-dd`/`data-ovst` pair and every
function name below is copy-paste-real — grep for it if you want the full body.

```
.dd-tabs
  data-dd="topline"      Top Line
  data-dd="bottomline"   Bottom Line
  data-dd="evolution"    Evolution
  data-dd="valuation"    Valuation
  data-dd="mgmt"         Management
  data-dd="misc"         Miscellaneous

.dd-pane[data-dd="topline"]
  .ovt-subpane[data-ovst="segov"]  (active) → segmentsOverviewHtml('AMZN')      [engine: segments.js]
  .ovt-subpane[data-ovst="segdrv"]           segmentsHtml('AMZN')              [engine: segments.js]
  .ovt-subpane[data-ovst="segoth"]           segmentsOtherHtml('AMZN')         [engine: segments.js]
  .ovt-subpane[data-ovst="segcus"]           segmentsCustomersHtml('AMZN')     [engine: segments.js]

.dd-pane[data-dd="bottomline"]
  .ovt-subpane[data-ovst="margins"]  (active, labeled "General")
    aGeneralPicker()                              — the 4-way view switch below
    .gen-sec[data-gsec="margins"]  aMarginsBody()      — gross/operating/EBITDA/net/FCF, one metric at a time
    .gen-sec[data-gsec="bridge"]   aBridgeBody()        (hidden) — revenue → op. income waterfall, by FY
    .gen-sec[data-gsec="net"]      aNetBridgeBody()     (hidden) — op. income → net income, Normalized toggle
    .gen-sec[data-gsec="sbc"]      aSbcBody()           (hidden) — SBC $ + dilution
    collapsible: expenseTabsBody()                 — the 6 functional expense line full-dives
  .ovt-subpane[data-ovst="segments"]   segmentsBody()        — segment op. income/margin + capex/D&A by segment
  .ovt-subpane[data-ovst="supplychain"] aSplcBody(c)         — Bloomberg SPLC supplier register

.dd-pane[data-dd="evolution"]
  .ovt-subpane[data-ovst="earnings"] (active, labeled "Earnings")
    .ce-phtabs: Setup / Post-Results / Notes
      ceSetupBody(c) / ceResultsBody(c) / ceWatchBody(c)      [[Earnings tab machinery — see EARNINGS_CONVENTIONS.md]]
  .ovt-subpane[data-ovst="results"]   resultsHtml('AMZN')     [engine: results.js — see RESULTS_CONVENTIONS.md]
  .ovt-subpane[data-ovst="estevo"]    resultsEvoHtml('AMZN')  [engine: results.js — see RESULTS_CONVENTIONS.md §3.6a]

.dd-pane[data-dd="valuation"]
  .ovt-subpane[data-ovst="histmult"]   (active) valuationHistBody()      [bespoke — §4 below]
  .ovt-subpane[data-ovst="peers"]                valuationPeersBody()    [bespoke — §4 below]
  .ovt-subpane[data-ovst="targetmult"]           amznTargetMult.body()   [bespoke module — §4 below]
  .ovt-subpane[data-ovst="sensitivity"]          amznSens.body()         [bespoke module — §4 below]

.dd-pane[data-dd="mgmt"]
  .ovt-subpane[data-ovst="team"]        (active, "Executives & Board")  AMZN_MGMT.body()  [engine: management.js]
  .ovt-subpane[data-ovst="ownership"]                                    amznOwnBody()     [bespoke — §5 below]
  .ovt-subpane[data-ovst="governance"]  ("Governance & SBC")             amznGovBody()     [bespoke — §5 below]
  .ovt-subpane[data-ovst="track"]       ("Track Record")                 amznTrackBody()   [bespoke — §5 below]

.dd-pane[data-dd="misc"]
  .ovt-subpane[data-ovst="capex"]  (active, "Capex & Depreciation")
    bottomlineCapexBody() + segCapDaBody() + aLeasesBody()               [bespoke, 3 functions — §6 below]
  .ovt-subpane[data-ovst="manda"]   ("M&A")     aMandaBody()             [data-driven — §6 below]
  .ovt-subpane[data-ovst="other"]   ("Other Analysis") aOtherAnalysisBody() [data-driven — §6 below]
```

**The lazy-init dispatcher** (`function aBuildSub(root, dd, key)`) is the other half of this — it
decides, per `dd`/`key`, which builder(s) to run behind `requestAnimationFrame` when that sub-tab
becomes visible (blueprint §5 rule 1). One branch per pane that owns a Chart.js canvas:

```js
if (dd==='topline')    { /* one of 4 init*(root,'AMZN') calls, keyed by `key` */ }
if (dd==='bottomline')  { key==='supplychain' → aBuildSplc
                           key==='segments'    → aBuildSegments
                           else (margins)      → aBuildMargins() + aBuildExpenses() }
if (dd==='misc')        { key==='capex'||null  → aBuildCapex(root) + aBuildSegCapDa() + aBuildLeases() }
if (dd==='valuation')   { histmult → amznHistMult.init(root)
                           sensitivity → amznSens.init(root)
                           targetmult  → amznTargetMult.init(root)
                           peers       → wireScatters(root)   /* idempotent, keeps peer list as-left */ }
if (dd==='evolution')   { earnings → gBuildCeAnnual (only if the Setup phase is active)
                           results  → initResults(wrap, 'AMZN')
                           estevo   → initResultsEvo('AMZN')  /* MUST pass the ticker — see §7 */ }
```

**`dd==='mgmt'` has no branch at all** — none of Management's four sub-tabs own a Chart.js canvas
(pure HTML: cards, tables, a KPI strip), so nothing needs lazy building. If your new company's
Management tab ever needs a real chart, it's the first one and needs its own branch here.

---

## 1. Top Line — engine: `js/segments.js` (one adopter today: AMZN)

All four sub-tabs are drawn by ONE engine fed by ONE data file, `js/segments-data/<ticker>.js`.
You write data, not code. The full contract, verified field-by-field against the engine's own
reading code (not just copied from AMZN's file):

```js
export var <ticker>Segments = {
  updated: string,                 // "Aug 2026" — freshness label, cosmetic only
  source: string,                  // one sentence naming every provenance mixed on this tab;
                                    // rendered verbatim as the tab's closing .ov-fynote.sg-src footer
  axis: { q: [period...], y: [period...] },   // DEFAULT axis for segment charts, unless a
                                                // segment/cut declares its own `axis`

  shared: {                        // company-wide series, NOT specific to one segment
    <key>: {
      label: string, short?: string,          // short falls back to label
      unit: 'usdM' | 'days' | 'pct' | ...,     // used verbatim in axis/number formatting
      src: string,                              // provenance shown inline, e.g. "BBG kpi4"
      q?: { act: { <period>: number }, summit: { <period>: number } },
      y?: { act: { <period>: number }, summit: { <period>: number } },
      // `summit` is the literal key for the ESTIMATE side — not `est`. A period simply absent
      // from `act`/`summit` renders as no data point, not zero.
    }
  },

  derived: {                        // a ratio of two `shared`/`drivers` series, resolved live
    <key>: {
      label: string, short?: string, unit: 'x' | 'pct',
      num: <key>, den: <key>,        // must resolve inside the ACTIVE segment's `drivers` or `shared`
      annualiseDen?: true,           // multiplies the denominator by periods/year first
                                      // (e.g. "years of backlog coverage" from a quarterly run-rate)
    }
  },

  overview: {
    lede?: string,                   // shown only if `tenK` is absent
    tenK?: { text: string, where: string },   // preferred: the filing's OWN description, verbatim
    // `interactions` here is DEAD CODE (parsed, never rendered, since Sep 2026) — don't author it.
  },

  customers: {                        // OMIT the whole key if there's nothing to say —
                                       // the pane shows "not assembled yet," not an error
    classes: [ { key, label, text, where } ],   // the filing's own named counterparty TYPES
    concentration: { disclosed: boolean, note: string },  // note shows even when disclosed:false —
                                                            // that's usually the whole finding
    cite: { form, period, accession, url },
    splc?: {                          // Bloomberg SPLC counterparty census — OPTIONAL; omit if not
                                       // sourced (renders "not loaded yet" with the loader command)
      revBaseM: number, revBaseLabel: string,
      named: number, sized: number, sizedSumM: number,
      source: string, file?: string,
      customers: [ { name, ticker?, amtM: number|null, period: string,
                      theirPct: number|null,   // SPLC "cost %" — the informative column
                      basis?: string, what: string } ],
    },
  },

  other: [                            // alternative revenue CUTS (product line, geography, …) —
                                       // NOT additive with `segments`, each is the SAME total sliced
                                       // a different way. Rendered as pills in Top Line ▸ Other.
    { key, label, sub, lede,
      caveat?: string,                              // shown as a ⚑ flag, e.g. "no margin exists for this cut"
      note?, tenK?: { text, where }, cite: { form, period, accession, url },
      spans?: string,                                // e.g. "assembled from 3 filings"
      axis?: { q?: [...], y?: [...] },
      views?: ['q','y'] | ['y'] | ['q'],              // ⚠ DEFAULTS TO BOTH IF OMITTED — a q-only or
                                                        // y-only cut MUST declare `views` or the engine
                                                        // tries the missing axis and draws nothing
      series: [ { key, ref: 'shared:<key>' | { q: 'results:<key>'|'shared:<key>', y: '...' },
                  label, tenK?: { text, where } } ],
    }
  ],

  segments: [                         // the REPORTABLE segments — array order IS display order
    {
      key, label, short, lede,                        // Segments-tab "What it is" intro
      summary?: string,                                 // Overview-tab teaser (falls back to `lede`)
      brief?: string,                                    // plain-language paragraph for the Overview flip-card
      sells: [ { name, what } ],                          // SHORT list — Overview card bullets
      products?: [                                         // FULL list — feeds "What it sells". Falls
                                                             // back to `sells` if omitted, but you lose
                                                             // the customers/management detail below
        { name, what, tenK?: { text, where, verbatim?: true },
          customers?: { archetype: { text, where },          // the filing's buyer-TYPE description
                         named: [ { name, q, what } ],         // named on a CALL — q like 'Q2 2026', newest first
                         note?, concentration: string },        // repeat the company-wide finding verbatim
          management?: [ { q, text } ] },                       // dated quotes from calls, newest first
      ],
      tenK?: { text, where, verbatim?: true, cite?, url?, needs?: string },  // needs → ⚑ flag
      kpis: [ { name, definition, filing: string|null,           // null = "not disclosed" (shown as such)
                unit, periodicity: string, source,
                series: <ref-string>|null,                        // 'results:<key>' or 'shared:<key>';
                                                                    // null = no chartable series yet
                needs?: string } ],
      kpiNote?: string,                                           // good place to say WHY the bridge
                                                                     // below is shaped the way it is
      interactions: [                                              // "Revenue interactions" cards —
                                                                      // LIVE (unlike overview.interactions)
        { name, relation: string,                                    // prose identity, e.g. "revenue = a × b"
          bridge: <bridges[].key>|null,                                // null = intentionally NOT CHARTED
          lines: [ <product name> ], why, data: string } ],            // `data` should literally say
                                                                          // "NOT CHARTED" when true
      adjacencies: [ { name, why, series: <ref-string>|null, needs?: string } ],  // "around the edges"

      drivers: {                          // segment-specific series feeding `derived`/`bridges`
        rev: { from: 'results:<key>' },   // REQUIRED shape for rev/opinc — a POINTER, never inline data —
        opinc: { from: 'results:<key>' }, // and the key MUST already exist in this ticker's
                                            // results-data/<ticker>.js (unmatched → silently null, rule 6)
        <otherKey>: { label, short, unit, src,
                       q?: { act, summit }, y?: { act, summit } },
      },
      bridges: [
        { key: string,                     // matched against interactions[].bridge
          label, view: 'q'|'y', target: <drivers key>,
          kind: 'decomposition' | 'independent',  // 'independent' earns a ✓-styled "verified" badge —
                                                    // reserve it for two terms that are genuinely SEPARATE
                                                    // data multiplying to the target; 'decomposition' (the
                                                    // common case) is one term literally derived FROM the
                                                    // target, so the reconciliation is definitional, and the
                                                    // badge must not overclaim otherwise
          terms: [ <derived-or-drivers key>, <derived-or-drivers key> ],
          identity: string, note: string },
      ],
      highlights: [ <derived key> ],        // which `derived` ratios get extra table rows on the segment
    }
  ],
};
```

**Cross-file dependency, not obvious from this file alone:** every `drivers.*.from` / any
`'results:<key>'` ref must name a metric key that already exists in this ticker's
`js/results-data/<ticker>.js`. Unmatched → resolves to `null`, series renders empty. **This means
Top Line is not fully "free" from a finished `results-data` file — most of its interesting bridges
and KPIs pull from it, so build Results/Estimates first (blueprint §6 already says this).**

**Gotchas (verified against the reading code, not guessed):**
1. `overview.interactions` is dead — parsed, never rendered. Don't spend sourcing time on it.
2. `shared`/`drivers` use the key **`summit`**, never `est`, for the estimate side.
3. `scope` on a `shared`/`drivers` entry is captured but never read — skip it.
4. `other[].views` defaults to `['q','y']` — an annual-only cut (geography, e.g.) MUST set
   `views: ['y']` or the engine silently draws nothing for the missing quarterly axis.
5. `sells` is the short Overview bullet list; `products` is the full detail and falls back to
   `sells` — a product needing real customer/management color needs `products`, not just `sells`.
6. `ref` accepts a bare string (applies to all views) or `{q, y}` for per-view sources.

---

## 2. Bottom Line — data-generated, view-bespoke (per company, own functions)

Unlike Top Line, **Bottom Line's rendering functions are not a shared engine** — `aMarginsBody`,
`aBridgeBody`, `aNetBridgeBody`, `aSbcBody`, `expenseTabsBody`, `segmentsBody`, `aSplcBody` are all
local to `amzn.js` and read `amznBBG`/`A_CAPEX`/`A_OPEX`/`amznResults` by name. A new company needs
its OWN versions of these functions (port and adapt, don't import) — but the **data file they
consume is mechanically generated**, which is most of the real work removed.

### General ▸ 4 nested views + the expense-line collapsible
- `aMarginsBody()` — one metric at a time (gross profit / operating income (GAAP) / EBITDA / net
  income (GAAP) / free cash flow) via `aStdScaffold()` — AMZN's own internal "standard chart +
  table" helper (not a portal-wide engine; a new company copies the pattern or, better, someone
  eventually promotes it). Reads `amznBBG.is.*` for actuals+forward and `amznResults` for the
  Summit line.
- `aBridgeBody()` — revenue → op. income waterfall for one fiscal year at a time (year pills),
  reading `amznBBG.is` cost lines (`cogs`, `fulfillment`, `techInfra`, `marketing`, `gAdmin`,
  `otherOpex`) plus a "consensus residual, held fixed" fallback when a line isn't broken out.
- `aNetBridgeBody()` — op. income → net income, with a **Normalized** toggle that strips
  non-operating gains/losses *after tax*, at the period's own effective rate (⚠ documented
  landmine: `amznBBG.is.otherNonOp` is signed as an EXPENSE, so a real gain is stored negative —
  see `RESULTS_CONVENTIONS.md`/blueprint §4's "four traps," this is the same one).
- `aSbcBody()` — SBC $ (BBG-only; Summit does not forecast an SBC dollar line, so don't fabricate
  one) + a dilution overlay using a hand-transcribed Summit diluted-share snapshot
  (`A_SUMMIT_SHARES`, flat from the last actual year forward, since Summit holds shares flat and
  assumes SBC dilution is offset).
- `expenseTabsBody()` — the six functional expense lines (cost of sales, fulfillment, tech &
  infra, marketing, G&A, other) as an inline tab strip; each tab's full dive (composition, unit
  economics, drivers, calls) comes from three parallel constants keyed by line: `EW_CALLS`,
  `EW_UNIT`, `EW_DEF`.

### Segments (`segmentsBody()`)
Segment operating income & margin, plus capex/D&A by segment, with a view toggle. Reads the same
`amznBBG.seg.<segId>.{rev,oi,da,ppe}` per-segment series (see the data-contract note below) and
`amznResults` for the Summit-model comparison.

### Supply Chain (`aSplcBody(c)`)
A `ddStat()` KPI strip (supplier count, facility count, geographic concentration %, largest single
relationship $) + a supplier list table + a geography chart (`A_SPLC_GEO`, country → % of supplier
facilities), all sourced from a Bloomberg SPLC export naming the company as a **subject** (the
buyer side, mirroring Top Line ▸ Customers which is the SELLER side of the same kind of export).

### The data file — `js/overviews/<ticker>-bbg.js`, GENERATED, do not hand-edit
This is the one part of Bottom Line that is genuinely mechanical. AMZN's file header says it all —
copy this contract verbatim for a new ticker:

```
// GENERATED by scripts/bbg_extract.py from BBG_CONSENSUS.txt. Full <TICKER> row, nothing omitted.
// All $M (EPS $/sh, shares in M). a/f=[FY..] actual/fwd years; qA/qF = actual/fwd quarters;
// q = qA+qF. Each series {a:[3], f:[3], qA:[5], qF:[4], q:[9]}. null = no data.
export var <ticker>BBG = {
  asOf: "8/4/2026", yearsA: [2023,2024,2025], yearsF: [2026,2027,2028],
  qtrs: ["2Q25", ... 9 quarters ...],
  segIds: { "<bbgSegmentId>": "<yourSegmentKey>", ... },
  is: {   // consolidated income statement — one entry per line item, ~30 lines on AMZN:
    rev, cogs, grossProfit, totalOpex, gAdmin, marketing, advertising, techInfra, fulfillment,
    otherOpex, oi, ebitda, nonOpNet, netInterest, intExp, intInc, otherNonOp, pretax, tax,
    equityMethod, netIncome, dilShares, dilEps, depr, amort, sbc, sbcCogs, sbcGA, sbcMktg,
    sbcTech, sbcFulfill, capex, cfo, fcf, rpo, buyback, shipping, invTurn, dpo
    // each of the above is { a:[...], f:[...], qA:[...], qF:[...], q:[...] } as described above
  },
  seg: { <segKey>: { rev, oi, da, ppe } }   // same {a,f,qA,qF,q} shape, per reportable segment
};
```

**New company's actual job here:** run `scripts/bbg_extract.py` against `BBG_CONSENSUS.txt` for
the ticker (see blueprint §6a's caveat — check the ticker is actually IN that archive first), then
port `aMarginsBody`/`aBridgeBody`/`aNetBridgeBody`/`aSbcBody`/`expenseTabsBody`/`segmentsBody` from
`amzn.js`, swapping `amznBBG` for `<ticker>BBG` and adjusting the segment keys/labels. Skip
Supply Chain entirely if the ticker isn't a subject company in an SPLC export (blueprint §6a's
inventory step already tells you to check this before starting).

---

## 3. Evolution — fully covered elsewhere; this is just the map

Evolution's three sub-tabs are the most thoroughly documented panes in the whole portal already —
don't duplicate that work here, use these directly:

| Sub-tab | Function | Read |
|---|---|---|
| Earnings (Setup · Post-Results · Notes) | `ceSetupBody`/`ceResultsBody`/`ceWatchBody` | `EARNINGS_CONVENTIONS.md` |
| Results | `resultsHtml('<TICKER>')` [engine] | `RESULTS_CONVENTIONS.md` §1-2 (the `views`/`act` dataset contract) |
| Estimates | `resultsEvoHtml('<TICKER>')` [engine] | `RESULTS_CONVENTIONS.md` §2 (the `evolution` block contract), §3.6a |

**One thing worth restating because it just cost a debugging session (Sep 8, 2026):** the
Estimates sub-tab's lazy-init call **must** pass the ticker explicitly —
`requestAnimationFrame(function(){ initResultsEvo('<TICKER>'); })` — never bare
`requestAnimationFrame(initResultsEvo)`. Without the ticker, `initResultsEvo` can't re-target the
Results engine's shared `_rs.data` state, and if the page's Setup chart already swapped it to a
`*_SETUP` dataset first, the Estimates tab's Growth/detail toggles silently stop responding for the
rest of the page's life. `amzn.js`, `googl.js` and `meta.js` all had this bug; fixed. Copy the
correct pattern (`js/overviews/amzn.js`'s `estevo` branch), not the buggy one, if you're porting
from an older overview file.

Also worth knowing before you write a new `evolution` block: `prior` (the FY-before-`years[0]`
base a metric's first tracked year needs for its own implied growth) is required for **any**
metric with a Growth toggle, not just Top-Line-style metrics — see `RESULTS_CONVENTIONS.md` §2's
corrected note (Sep 8, 2026).

---

## 4. Valuation — one engine-adjacent chart, three fully bespoke panes

### Historic Multiple (`valuationHistBody()` / `js/overviews/amzn-histmult.js`)
Bespoke §0-compliant chart. Fully documented in the file's own header — read it, don't re-derive:
P/E and EV/EBITDA, forward/trailing, five horizons (NTM/Current FY/FY+1/FY+2/FY+3/LTM/Last FY),
three densities (Daily/Quarterly/Annual), a two-handle date slider + range presets + drag-zoom.

**Data it needs, and where it comes from:**
- **PX** (daily close) and **SHARES**/**NETDEBT** (quarterly, derived from `market_cap`/
  `enterprise_value`/`price`) — via `js/api.js`'s `fetchPriceHistory`/`fetchRatiosHistory`, which
  call the **`get-market-history` Supabase edge function** — ⚠ not deployed as of Sep 8, 2026
  (San/Oscar only can deploy it). Until then the pane shows an honest "live data unavailable"
  state, not a broken chart — this is correct, deliberate degradation, not a bug to route around.
- **EST** (consensus EPS/EBITDA per fiscal year, with revision dates) — reads straight off this
  ticker's OWN `results-data/<ticker>.js` (`estMatrix.cons`), so **this part is free once Results
  is built** — no new data-authoring for a new company beyond having a Results dataset with an
  `estMatrix`.
- **ACT** (trailing LTM EPS/EBITDA) — from the same Results dataset's real quarterly actuals.

**To eyeball this pane's design before an edge function is deployed** (a real, recurring need —
this is exactly how AMZN's was verified): `harness-<ticker>.html?mockmarket=1` patches in
synthetic-but-correctly-shaped price/ratios data so the chart renders end-to-end against the
ticker's REAL EST/ACT data. Two non-obvious things if you build this into a new harness: (1)
`supabase.functions` is a GETTER — a fresh client every access — so patch the shared
**prototype's** `.invoke`, not the instance's, or the mock silently no-ops; (2) the patch must
land BEFORE the overview module is imported, or the pane's own lazy loader can fire a real
(failing) request first and cache that failure permanently for the page's life. See
`harness-amzn.html`'s own `?mockmarket=1` block for the working pattern — copy it.

### Peers (`valuationPeersBody()` / `stdPeerScatter`)
Bespoke inline-SVG scatter (not Chart.js — a scatter compares every pair, so it's capped at 3
categorical slots per `viz-palette.js`, and this one doesn't even use the categorical palette,
it's one bubble per peer). Has an equivalent table (open by default) instead of drag-zoom.

**Data — one array, hand-seeded and dated:**
```js
var A_PEERS = [
  { tk: 'AMZN', n: 'Amazon.com', peT, peF, evT, evF, gt, gf, mc, hl: true,  why: '...' },
  { tk: '<PEER>', n: '...',       peT, peF, evT, evF, gt, gf, mc, hl: false, why: '...' },
  // peT/peF = P/E trailing/forward; evT/evF = EV/EBITDA trailing/forward (evF is a derived
  // approximation, not quoted); gt/gf = revenue growth trailing/forward, %; mc = market cap $B
  // (overwritten LIVE per ticker via api.liveQuote — do not hand-maintain this one field);
  // hl = true only for the subject company; why = one-sentence tooltip.
];
```
Multiples/growth are **hand-researched and explicitly labeled as seeded, dated** (never presented
as live) — confirmed still true in code. Controls: Multiple (P/E ⇄ EV/EBITDA) and Basis
(Forward ⇄ Trailing) toggles redraw the X-axis; a chip row lets the reader remove/add peers by
ticker (market cap resolves live once a valid ticker is entered; multiples don't — an added peer
shows an em-dash until you seed one).

**New company needs:** the same `A_PEERS`-shaped array, one entry per real peer including itself.
No dependency on the Results engine.

### Target Multiple / PEG (`amznTargetMult.body()` / `js/overviews/amzn-target-multiple.js`)
Two stacked bespoke §0-compliant charts (own `rsAttachBrush` per the §0.7 kit; Y-axis zoom only,
since the X-axis is model **snapshots**, not calendar periods).

- **Revision log** — one metric at a time (year-end price target $; the EV/EBITDA-vs-P/E implied
  spread %; or the underlying FY(N+1) revenue/EBITDA/earnings/EPS the target is built on), one
  column per Summit DCF snapshot, each column flagged real-revision-vs-mere-reparse by diffing
  against the prior column.
- **PEG** — the PEG ratio, its multiple input, and its growth input (earnings growth for a P/E
  basis, EBITDA growth for an EV/EBITDA basis — toggle switches both); growth is read from the
  SAME vintage's own prior-year figure, never a separate consensus source; negative/zero growth is
  flagged "PEG meaningless," never computed into a nonsense ratio.

**Data:** a hand-transcribed, snapshot-by-snapshot table of FY(N+1) `rev`/`ebitda`/`earn`/`eps` (+
diluted shares) off the Summit DCF's saved snapshots — the SAME transcription Sensitivity needs
(see below), so if you build one, reuse it for the other.

### Sensitivity Analysis (`amznSens.body()` / `js/overviews/amzn-sensitivity.js`)
Bespoke **non-chart** interactive — a driver × driver implied-price grid, not a metric-over-time,
so CHART_ENGINE_REFERENCE §0 doesn't apply as written (it has its own equivalent contract: named
axes, a reset per axis, an assumptions strip, per-year receipt cards).

**Data — hand-transcribed from ONE Summit DCF snapshot** (not the full vintage archive):
```js
var M = { /* per year (base year + 4 forward), per segment: rev, op (operating income), eb (EBITDA);
             corp (unallocated corporate EBITDA); earn (consolidated earnings); tax (effective rate) */ };
var SHARES = <flat share count, millions>;
var DRIVERS = [ /* revenue growth % and operating margin % per segment, PLUS `mult` — the reader's
                   own exit multiple (EV/EBITDA or P/E), which has no consensus so it's an input,
                   not a data point */ ];
var CONS = { /* same driver keys, one value per year — "what the Street assumes," shown beside the
                grid. On AMZN this is CURRENTLY PLACEHOLDER data pending a real workbook wire-up —
                check whether that's been fixed before copying it as if it were real */ };
```
Segment D&A is derived as `eb − op`, not stored separately. Controls: X/Y driver pickers (any 2 of
`DRIVERS`), year pills, a Model ⇄ Consensus base toggle, an EV/EBITDA ⇄ P/E exit-multiple-basis
toggle, and a per-axis reset.

**Cross-cutting finding for both of these last two panes:** neither reads `results-data/<ticker>.js`
or the Results engine at all — both are self-contained, hand-transcribed from ONE DCF snapshot.
**Do not assume Target Multiple/PEG or Sensitivity come "for free" once Results is built** — they
are always separate, additional manual data entry, however complete the Results dataset is.

---

## 5. Management — one real engine (Executives & Board), three data-driven panes

### Executives & Board — engine: `js/overviews/management.js`, `makeManagement(cfg)`
Shared engine (also used by UBER/LYFT/CART today). Config contract, every field verified against
the engine's own reading code:

```js
var <TICKER>_MGMT = makeManagement({
  brand: '#<hex>',                    // accent color for the cards
  lede: '<p>...</p>',                  // intro paragraph, HTML
  execs: [ { id, name, title, since?, line, bio?, lead?: true, img? } ],
  // lead:true → full-width card (use once, for the CEO). img optional — falls back to colored
  // initials. bio shown in the tap-to-expand modal; falls back to `line` if absent.
  board: [ { name, chair?: true, dual?: true, independent: boolean, role } ],
  // dual:true = also an exec (dims the card, appends "also management"). independent drives the
  // Independent/Insider tag.
  boardNote: '...',                    // shown beside the "Board of Directors" heading
  gov: [ { k, v, d? } ],                // a small KPI-like grid: k=label, v=value, d=optional detail
  foot: '...',                          // rendered into .ov-foot
});
```
UI: a responsive card grid, each card opens a modal with the full bio (keyboard-accessible —
Enter/Space opens, Escape closes); a board strip below; a governance mini-grid at the bottom.
**Call `<TICKER>_MGMT.init(root)` once on mount** to wire the modal.

**New company needs:** the `execs`/`board`/`gov` arrays, sourced from the company's official
leadership page (execs) and its latest proxy/DEF 14A equivalent (board, governance facts). No
chart, no new CSS.

### Ownership (`amznOwnBody()`) — data-driven, no engine
`.ov-kpis` 4-tile strip (founder/largest-holder stake %, share-class count, SBC $ for the FY,
buyback/dividend status) + two `ewBoxes()` info cards (Founder, Institutions) + one `.ov-fynote`
about capital return + a `<div id="dd-mgmt-slot"></div>` that **auto-populates live** with the
same Fiscal.ai-sourced executive/insider-activity table used in Pillars ▸ Management — you do not
author this table per company, it wires itself once the company exists in that pillar.

**New company needs:** 4 KPI facts, 2 `ewBoxes` paragraphs, the boilerplate slot div, `.ov-foot`.

### Governance & SBC (`amznGovBody()`) — data-driven, no engine
Same pattern: `.ov-kpis` 4-tile strip (voting structure, board independence, SBC $ + % of revenue,
buyback/dividend status — confirms these are the exact classes: `.ov-kpis`/`.ov-kpi`/`.ov-kpi-v`/
`.ov-kpi-d.muted`) + `ewBoxes()` 4-card grid (share class, board independence, committees, SBC vs
buybacks) + one `.ov-fynote` pointing to the FULL SBC-vs-consensus chart, which lives in **Bottom
Line ▸ General** (`aSbcBody()`) — **SBC is summarized here, not re-charted.**

**New company needs:** the same 4 KPI facts + 4 governance `ewBoxes` items, from the proxy + the
10-K's SBC note.

### Track Record (`amznTrackBody()`) — bespoke card deck, own modal
```js
var <TICKER>_TRACK = [ { id, n, role, since, rate, <ticker-lower>: '<what they built here>',
                          prior: '<outside/background context>', detail: '<full HTML>' } ];
var <TICKER>_TRK_RATE = { green: {c,bg,bd,l}, amber: {c,bg,bd,l} };  // only 2 tiers defined on
                                                                       // AMZN; add a 3rd the same way
```
A color-coded legend + a 2-column clickable card grid (`.ov-clickable`, `data-detail="exec:<id>"`)
opening the SAME shared detail-modal mechanism the rest of `amzn.js` uses (not `management.js`'s
own modal) + a synthesis `.ov-callout` + `.ov-foot`.

**New company needs:** one entry per rated leader (typically the same people as Executives &
Board, re-authored with a performance judgment) + the rating legend if a 3rd tier is wanted.

---

## 6. Miscellaneous — the highest hand-authoring cost per sub-tab, and the most optional

### Capex & Depreciation — 3 bespoke functions concatenated
`bottomlineCapexBody() + segCapDaBody() + aLeasesBody()`. The single most complex Miscellaneous
sub-tab — treat it as a *shape* to mirror, not a template to fill field-for-field:
- `bottomlineCapexBody()` reads a per-year object (`A_CAPEX`, keyed by `A_CAPEX_YEARS`) with
  ~25 fields/year: total capex; gross PP&E by asset class (`grossLB`/`Servers`/`Heavy`/`OtherEq`/
  `OtherAssets`/`CIP`); matching depreciation by class; useful-life assumptions per class; plus
  `cogs`/`revenue`/`grossProfit`/`grossMargin` for context. This is a hand-copy of the Summit DCF
  model's own D&A tab.
- `segCapDaBody()` reads a per-year functional-opex object (`A_OPEX`: `costOfSales`/
  `fulfillment`/`techInfra`/`marketing`/`gAdmin`/`otherOpex`/`shipping` + segment revenue/opex/op
  income) — the segment-level capex/D&A breakdown.
- `aLeasesBody()` is a bespoke "leases explorer" — 4 KPI tiles (lease obligation, ROU assets,
  signed-not-started, weighted term) + a tabbed mini-chart.

**New company needs (minimum viable):** skip the leases explorer unless the 10-K's lease note is
unusually rich; build just a capex/D&A trend from the PP&E note + the Summit model's own capex/D&A
tab if one exists. **Do not invent asset-class-level granularity the company doesn't disclose.**

### M&A (`aMandaBody()`) — data-driven, explicitly the reference example for a new pane
Documented in its own header as the worked example of zero-inline-CSS, canonical-components-only
construction (blueprint §1 already points here). Two arrays:
```js
var <TICKER>_MNA = [ { date, name, price, what, seg, note } ];
// price is $M NET OF CASH ACQUIRED (not the press-reported headline number — call out where they
// diverge, e.g. Whole Foods: $13.7B reported vs $13.2B filed).
var <TICKER>_MNA_AGG = [ { yr, amt, txt } ];   // aggregate UNNAMED acquisition spend per year;
                                                 // amt: null renders "immaterial"
```
Plus 3 hand-written tables inline (not separate constants): a goodwill-by-segment table, a
"cash deployed" comparison (capex vs M&A vs goodwill created, 2 years), and a `collapsible()` on
any name-worthy minority stake or terminated deal.

**New company needs:** the two arrays above from the 10-K's business-combinations note, going back
as many years as material. **If the company genuinely has no M&A story, this sub-tab may not
exist** (blueprint's "sub-tabs are earned" rule) — but check first: "it stopped buying companies"
was itself AMZN's finding, not an absence of content.

### Other Analysis (`aOtherAnalysisBody()`) — data-driven
```js
var <TICKER>_LIVES = [ { eff, asset, chg, dir: 'up'|'down', effect, per, src } ];
// one row per useful-life/estimate change the company has ITSELF QUANTIFIED in a filing.
// dir drives a ▲/▼ arrow colored var(--pos)/var(--neg).
```
The rest (severance/settlement breakdown, non-operating income swings) is hand-written prose + one
more inline table (item, amount, where booked, segment hit) — not a separate named constant.

**New company needs:** the company's OWN quantified accounting-estimate changes — useful-life
revisions are the most common genre; check the PP&E note across several years' 10-Ks. **This only
works if the company has actually disclosed a dollar effect — do not estimate one yourself.** A
company with no such disclosure may not have this sub-tab.

---

## 7. Quick-reference table — every sub-tab, one row each

| Section | Sub-tab | Type | Function(s) | New-company effort |
|---|---|---|---|---|
| Top Line | General/Segments/Other/Customers | Engine (`segments.js`) | `segmentsOverviewHtml` etc. | Write `segments-data/<t>.js` — §1 |
| Bottom Line | General | Data-generated, bespoke views | `aMarginsBody`, `aBridgeBody`, `aNetBridgeBody`, `aSbcBody`, `expenseTabsBody` | Run BBG extractor + port 5 functions — §2 |
| Bottom Line | Segments | Data-generated, bespoke | `segmentsBody` | Same BBG file, port 1 function |
| Bottom Line | Supply Chain | Data-driven | `aSplcBody` | Only if a subject company in an SPLC export |
| Evolution | Earnings/Results/Estimates | Engine (`results.js`) + hand-authored calls | see §3 | `RESULTS_CONVENTIONS.md` + `EARNINGS_CONVENTIONS.md` |
| Valuation | Historic Multiple | Bespoke chart, edge-fn-backed | `amznHistMult` | Free once Results/estMatrix exists — §4 |
| Valuation | Peers | Bespoke scatter | `valuationPeersBody` | One hand-seeded `A_PEERS` array |
| Valuation | Target Multiple/PEG | Bespoke charts | `amznTargetMult` | Hand-transcribe 1 DCF snapshot's FY+1 figures |
| Valuation | Sensitivity Analysis | Bespoke interactive | `amznSens` | Hand-transcribe 1 DCF snapshot's per-segment P&L |
| Management | Executives & Board | Engine (`management.js`) | `makeManagement` | One roster config object |
| Management | Ownership/Governance & SBC | Data-driven | `amznOwnBody`/`amznGovBody` | 4 KPI facts + 2-4 boxes each |
| Management | Track Record | Bespoke card deck | `amznTrackBody` | One rated-leader array |
| Miscellaneous | Capex & Depreciation | Bespoke, highest effort | 3 functions — §6 | Minimum-viable version only, unless disclosure is rich |
| Miscellaneous | M&A | Data-driven, reference example | `aMandaBody` | 2 arrays from the business-combinations note |
| Miscellaneous | Other Analysis | Data-driven | `aOtherAnalysisBody` | Only if the company quantified its own estimate changes |
