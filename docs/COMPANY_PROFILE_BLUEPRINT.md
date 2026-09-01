# The company profile blueprint — how to build the next one

**Amazon is the reference implementation.** This file is the map from that profile to any other
ticker: the tab spine, the design system, where every number comes from, the interaction contract
every pane owes the reader, and the order to build it in.

Read this **before** starting a company. It is deliberately short on things the other docs already
own, and links to them instead:

| For | Read |
|---|---|
| The standardized **Overview** tab (the 7 blocks, Key Facts, competitor scatter, timeline) | `OVERVIEW_CONVENTIONS.md` |
| **Any chart at all** — the six non-negotiables, the optional menu, the pre-ship list | `CHART_ENGINE_REFERENCE.md` §0 |
| A **metric-over-time** chart (Results / Estimates) — the dataset contract | `RESULTS_CONVENTIONS.md`, `CHART_TOOLKIT.md` |
| The **Earnings** tab machinery (Setup · Post-Results · Notes) | `EARNINGS_CONVENTIONS.md` |
| Per-print **Street consensus** compiled by hand | `docs/calls/<TICKER>.md` |

**The one sentence that matters most:** almost everything in the Amazon profile is a *shared engine
fed by a per-company data file*, not bespoke code. Before you write a pane, find out which engine
already draws it. §2 is the list.

---

## 1. The shape of a finished profile

A company profile has **two sibling top-level tabs** — Overview and Deep Dive — rendered by
`companies.js` into two `.copane`s. They are siblings, never nested (`OVERVIEW_CONVENTIONS.md` §1).
The module exports `{ html, init }` for the Overview and an optional `deepDive: { html, init }` for
the Deep Dive; the Deep Dive tab appears **only** when `deepDive` exists.

The Deep Dive spine is **six sections**, in this order. This is the spine every company gets — the
sub-tabs inside each are what vary.

| Section | The question it answers | Amazon's sub-tabs |
|---|---|---|
| **Top Line** | Where does the revenue come from, and what moves it? | General · Segments · Other · Customers |
| **Bottom Line** | Where does the revenue stop being revenue? | General · Segments · Supply Chain |
| **Evolution** | How does it do against what was expected? | Earnings · Results · Estimates |
| **Valuation** | What is it worth, and against what? | Historic Multiple · Peers · Target Multiple / PEG · Sensitivity Analysis |
| **Management** | Who runs it and what is their record? | Executives & Board · Ownership · Governance & SBC · Track Record |
| **Miscellaneous** | The things that do not fit, and matter anyway | Capex & Depreciation · M&A · Other Analysis |

**Sections are fixed; sub-tabs are earned.** A sub-tab exists because there is something to show. Do
not ship a sub-tab whose body is a sentence apologising for being empty — either fill it or leave it
out. (Amazon shipped `M&A` and `Other Analysis` as placeholders for months; both turned out to have
strong, fully-sourced content sitting in the filings.)

**The three sub-tabs that are worth arguing for on any company:**
- **Top Line ▸ Customers** — because the answer is often "the filing discloses nothing", and saying
  so with the evidence is more useful than omitting the question.
- **Miscellaneous ▸ Other Analysis** — the genre is *changes of definition or estimate that move
  reported profit while nothing happens in the business*. Almost every company has one. Amazon's is
  the useful life of a server; Danaher's was two definition changes in two quarters.
- **Miscellaneous ▸ M&A** — not a list of logos. The question is what the company does with money,
  and "it stopped buying companies" is an answer.

### Markup contract for the spine

```
.dd-tabs  > button.dd-tab[data-dd="topline"]          ← section tabs
.dd-pane[data-dd="topline"]                            ← section pane (hidden except the active one)
  .ovt-subtabs > button.ovt-subtab[data-ovst="segov"]  ← sub-tabs, scoped to their pane
  .ovt-subpane[data-ovst="segov"]                      ← sub-pane
```

Sub-tab switching is **pane-scoped** — query with `:scope >` or from the pane element, never from
`document`, or two sections' sub-tabs will drive each other.

---

## 2. The three kinds of pane — check for an engine first

Every pane is one of three things. Getting this wrong is the single most expensive mistake: writing
a bespoke canvas for something an engine already draws costs days and ships a chart that behaves
differently from every other chart in the portal.

### (a) Engine-driven — you write a **data file**, not a pane

| Engine | Lines | Draws | You write | Adopted by |
|---|---|---|---|---|
| `js/results.js` | 4,201 | Results · Estimates · the Earnings Setup chart | `js/results-data/<ticker>.js` (+ `<ticker>-setup.js`) and one registry line | amzn, bbb, googl, ibkr, lyft, meta, spot, uber |
| `js/segments.js` | 1,833 | The whole **Top Line** section — all four sub-tabs | `js/segments-data/<ticker>.js` | **amzn only** |
| `js/consensus-evolution.js` | 308 | Street revisions across BBG snapshots | a block in `js/consensus-evolution-data.js` | **amzn only** |
| `js/watchlist.js` | 463 | The Earnings Watch List (Supabase-backed) | nothing — mount it | amzn, googl, ibkr, lyft, meta, uber |
| `js/overviews/management.js` | 125 | The Executives & Board mold | a roster constant | amzn, googl, uber, … |

**`segments.js` and `consensus-evolution.js` are generic and have exactly one adopter.** The Top Line
section is not an Amazon feature — it is an unadopted engine. Feeding it a second company is the
highest-leverage thing available on the next profile, and it is a data file, not code.

### (b) Data-driven — an existing component, fed new content

A table, a KPI strip, a card deck, a collapsible. No new CSS, no new JavaScript beyond a body
function that returns a string. `Miscellaneous ▸ M&A` and `▸ Other Analysis` in `amzn.js` are the
worked examples — read them before writing a pane of this kind.

### (c) Bespoke canvas — you write the chart

Only when the thing genuinely is not a metric over time: a choropleth, a network, a waterfall, a
scenario matrix. `CHART_ENGINE_REFERENCE.md` §0.7 covers what you must reimplement by hand, and §0.2
still applies in full — a bespoke canvas owes the reader exactly what an engine chart owes them.

**The capability ladder decides what a company can even have** (verified Aug 2026):

| The data file has | The company can have |
|---|---|
| `views` + `act` | The Results block |
| two overlapping series | Actuals vs Estimates (the surprise scorecard) |
| `evolution` | The Estimates pane |
| `estMatrix` | The vintage axis + Road to the print |
| `<ticker>-setup.js` | The Earnings Setup chart |

A company with neither `evolution` nor `estMatrix` (GOOGL, IBKR) is **finished**, not deficient.
Do not fabricate a vintage axis to fill a tab.

---

## 3. The design system

### 3.1 The palette rule — a profile does not choose colours

**Chrome** — tabs, pills, active states, KPI accents — comes from the tokens in `css/base.css`
(`--navy --steel --accent --ice --bdr --pos --neg --mu`) via `--brand`, which `.ov` already defaults
to `var(--accent)`. **Do not set `--brand` on a profile root.** The company's brand appears in its
logo and nowhere else, so that a chart reads the same way on every company and orange stops meaning
Amazon.

**Chart series** come from `js/viz-palette.js` — one fixed categorical order for the whole portal,
validated with the `dataviz` validator rather than eyeballed. Read that file's header before using
it; the essentials:

- **Assign slots in fixed order and never cycle.** Colour follows the entity, not its rank: a filter
  that drops a series must not repaint the survivors. Past slot 8, fold into "Other" — never
  generate a hue.
- **Slots 3, 4 and 5 sit below 3:1 contrast on white**, so the *relief rule* applies: a chart using
  them must also ship visible labels or its data table. Every portal chart has a table by
  non-negotiable 3, so this is satisfied by construction — but a chart without one may not use them.
- **Scatter, bubble and choropleth compare every pair, not just neighbours.** Cap them at three
  slots (`SUMMIT_CAT3`) and fold the rest.
- **Categorical is not the only job.** Fiscal years, vintages and snapshots are **ordinal** and
  correctly use a single-hue ramp light→dark — the Estimates chart drawing FY2026/27/28 as three
  steps of blue is right, and converting it to the categorical palette would destroy the ordering.
  Identity gets the categorical order; magnitude gets a ramp; polarity gets two hues and a grey
  midpoint; state gets the reserved semantics, which are never reused as "series 4".

What this fixed on Amazon: the seven product lines on Top Line ▸ Other were drawn from a six-step
ramp of four blues (**a ramp encodes magnitude, not identity**) that also **cycled**, so a seventh
entity silently re-used the first one's colour. Both are categorical-colour errors.

**Still open:** `results.js` carries its own copy of the old ramp for eight companies, so converging
it is a portal-wide PR, not a per-company change.

### 3.2 The canonical components — and where they actually live

Use these. They exist in real stylesheets, so they work in any pane and change in one place.

| Component | Classes | Stylesheet |
|---|---|---|
| Section heading | `.ov-sec-h` | `css/overview.css` |
| Lede / intro paragraph | `.ov-lede` | `css/overview.css` |
| KPI strip (5 tiles) | `.ov-kpis` `.ov-kpi` `.ov-kpi-l` `.ov-kpi-v` `.ov-kpi-d` | `css/overview.css` |
| Emphasised note under a block | `.ov-fynote` | `css/overview.css` |
| Source footer | `.ov-foot` | `css/overview.css` |
| Callout | `.ov-callout` | `css/overview.css` |
| Data table | `.rs-ft-scroll` > `table.rs-ft`, cells `.rs-ft-h` `.rs-ft-nil` `.rs-ft-dim` `.rs-ft-este` `.rs-ft-s` | `css/results.css` |
| Collapsible | `.rs-collap` `.rs-collap-h` `.rs-collap-ic` `.rs-collap-sub` `.rs-collap-b` | `css/results.css` |
| Card deck | `.sg-cards` `.sg-card` | `css/results.css` |

**Do not use unicode circled digits (①②③) in `.ov-sec-h`** — Inter has no glyph for them and they
render as tofu.

### 3.3 The anti-pattern this profile is full of

Amazon's Deep Dive renders **23 `<style>` elements, of which 20 are distinct** — ~105 KB of CSS
shipped as JavaScript strings. It was 25 until the Earnings block, called by all three phase bodies,
was collapsed to one emission (~43 KB of pure duplicate). Those blocks define more than twenty class
families (`.ce-` alone is referenced 539 times in `amzn.js`), including **four separate KPI-strip
components** — `sg-cards`, `ew-kpis`, `gdd-kpis`, `acx-kpis` — that are all re-inventions of
`.ov-kpis`, which already exists in `css/overview.css`.

**Why the rest has not been lifted into a stylesheet yet, and what it will take.** Two things make
it a PR of its own rather than part of a company's work:
1. **The CSS is interpolated with JS constants** (`accent-color:'+BRAND+'`), so it cannot be moved
   statically — the interpolations have to become CSS custom properties first.
2. **Eight overviews each own a copy of the `.ce-*` Earnings machinery** (amzn 539 references, spot
   401, uber 379, lyft 368, googl and meta 361 each, bbb 81, ibkr 25). Today they never collide
   because only one profile renders at a time; the moment one copy moves to a global stylesheet it
   starts styling the other seven. The fix is one shared `css/earnings.css` for all eight at once —
   or, if it must be done per company, selectors scoped under that profile's root class.

Two consequences worth knowing before you copy anything:

1. **Inline `<style>` leaks document-wide.** A pane can appear to work only because another pane
   injected the CSS it depends on. `collapsible()` in `amzn.js` is exactly this: `.ov-collap` has no
   stylesheet entry and works because the Overview's inline block is in the same document.
2. **Both engines get this right.** `results.js` (4,201 lines) and `segments.js` (1,833 lines)
   contain **zero** inline `<style>` — their CSS is in `css/results.css`.

**The rule:** an engine keeps its CSS in a stylesheet. A per-company file that ships CSS is a
component that has not been extracted yet. **A new profile adds no inline `<style>`.** If you need
something the canonical set does not have, add it to a stylesheet and say so in the PR.

### 3.4 Writing rules

Inherited from `OVERVIEW_CONVENTIONS.md` §0 and they apply to the Deep Dive too:

- **No walls of text.** Teaser visible, depth one click down in a collapsible or a modal.
- **No fake precision.** Label estimates as estimates. If periods are mixed, say so and do not
  annualise silently — a sum of mixed periods is a floor, not a year.
- **Never delete existing content.** Non-conforming content moves to the most relevant section.
- **Every pane ends with a source footer** naming the filing, note and date. A pane with no
  `.ov-foot` is unfinished.
- **State the limitation first when the data is thin.** The Amazon SPLC customer register reaches
  under 0.2% of revenue; the lede says so before the table, so it cannot be misread as
  concentration.

---

## 4. Where the numbers come from

Apply the sourcing waterfall **field by field**, not once per company
(`OVERVIEW_CONVENTIONS.md` §3): Summit DCF → Massive / Fiscal.ai → the filing. Stop at the first
source you have *verified*, not the first that returns a number.

| Pane | Source | Lives in |
|---|---|---|
| Top Line, all four sub-tabs | 10-K segment note + earnings calls, by hand | `js/segments-data/<ticker>.js` |
| Top Line ▸ Customers, the counterparty register | Bloomberg **SPLC** export | `js/segments-data/<ticker>.js` (`customers.splc`) |
| Bottom Line, profitability & segments | Bloomberg income-statement export (actuals + forecast) | `js/overviews/<ticker>-bbg.js` |
| Bottom Line ▸ Supply Chain | Bloomberg SPLC, supplier side | in the overview module |
| Evolution ▸ Results / Estimates | Summit DCF (MCP) + Street consensus | `js/results-data/<ticker>.js` |
| Evolution ▸ Earnings Setup | the same, one quarter forward | `js/results-data/<ticker>-setup.js` |
| Evolution ▸ Earnings, the call record | transcripts, hand-authored | `CALL_EARNINGS` / `js/themes-data/<ticker>.js` |
| Evolution ▸ Earnings, Watch List | Supabase (`company_themes`) | **no seed-from-code path** — authored in-portal |
| Consensus Evolution | BBG snapshots by vintage | `js/consensus-evolution-data.js` |
| Valuation ▸ Peers, market caps | Massive, live (`api.liveQuote`) | live |
| Valuation ▸ Peers, multiples | seeded and **labelled as seeded** | in the module |
| Management ▸ Executives, Ownership | proxy (DEF 14A) + IR leadership page | in the overview module |
| Miscellaneous ▸ Capex, M&A, Other Analysis | 10-K notes, by hand | in the overview module |

### Four traps that have cost real time

- **A Summit snapshot's date does not tell you what it contains.** Check the last actual period per
  vintage. A February snapshot may still end at the prior Q3.
- **Absent data is a literal `0`, not `null`.** A zero may be missing data or a real zero.
- **Fixed history is restated between snapshots.** Never build one time series across vintages;
  only compare the same year across them.
- **The BBG export's `nonOpNet` / `otherNonOp` is signed as an EXPENSE**, so a gain is negative.
  Amazon's FY2025 Other income of **+$15.2B** is stored as `-15229`. `amzn.js` handles it
  (`gain = −otherNonOp`); a new company must handle it too, or a $53B gain draws as a $53B loss.
- **Not every ticker is in `BBG_CONSENSUS.txt`** — the rolling Bloomberg archive described in
  `EARNINGS_CONVENTIONS.md` §6a. It lives **outside the repo**, and as last recorded
  (`docs/calls/LYFT.md`) it carried only GOOG/GOOGL/HOOD/KKR/MA/META/UBER, so check it rather than
  assuming. For
  anything else, Street consensus is compiled by hand per print into `docs/calls/<TICKER>.md`, and
  the compiled column has a noise floor — state it.

---

## 5. The interaction contract

Six things that are easy to get wrong and produce silent breakage.

1. **Build charts lazily, per visible pane.** Chart.js needs a laid-out canvas, so a builder runs
   when its pane becomes visible, behind `requestAnimationFrame`. The dispatcher is `aBuildSub(root,
   dd, key)` in `amzn.js` — one branch per section.
2. **Scope every query to the pane.** The Results engine renders **up to three times** on one
   profile (Earnings Setup · Results · Estimates), so its ids are **not unique in the document**.
   `document.getElementById` silently returns the first instance. The engine resolves through
   `rsPaneEl()` for this reason; the two handlers that did not were toggling a different tab's
   table, so "show the table" on Results appeared to do nothing.
3. **Hoist modals to `#co-detailview`** — an inactive `.copane` is `display:none` and would swallow
   a modal nested inside it. **And close the modal on tab and sub-tab change**, or it floats over
   whatever the reader moved to.
4. **Fade estimate periods with a helper that parses the palette you actually use.** `acxRGBA()`
   parses `#rrggbb` only; the `ASTD_*` palette is written as `rgba(...)`, and feeding one to the
   other produced `rgba(NaN,186,NaN,0.5)` — an invalid colour that paints nothing. Every forward bar
   on both profitability charts was invisible. Use `aFadeC()`, which accepts both.
5. **Every chart carries a table**, inside a dropdown, holding at minimum everything drawn, and the
   table follows the chart's state — hide a series and the row leaves too
   (`CHART_ENGINE_REFERENCE.md` §0.2, non-negotiable 3).
6. **Missing data renders nothing, never something broken.** A metric with no denominator has no
   margin mode; a company with no vintage matrix has no vintage axis.

---

## 6. Building a new company — the order

1. **Inventory the data before writing anything.** Does a Summit DCF exist (`list_dcf_models`)? How
   many vintages? Is the ticker in `BBG_CONSENSUS.txt`? Is there a BBG income-statement export? Is
   the ticker a *subject* company in an SPLC export? Write the answers down — they decide the whole
   scope via the capability ladder in §2.
2. **Overview first**, via `/fill-overview <TICKER>` and `OVERVIEW_CONVENTIONS.md`.
3. **Scaffold the six-section spine** and relocate any existing content into it. Never delete.
4. **Top Line** — write `js/segments-data/<ticker>.js` and mount `segments.js`. Data, not code.
5. **Evolution ▸ Results + Estimates before Earnings.** A data file plus a registry line delivers
   two of the three tabs at low risk. Earnings needs the ~1,700-line v2.10 machinery ported and
   hand-authored call data.
6. **Bottom Line**, from the BBG export.
7. **Valuation · Management · Miscellaneous** — mostly data-driven panes.
8. **One company per PR.** Do not sweep a change across several tickers at once; the point is that
   each change stays visible and nothing already shipped breaks unnoticed.

When porting the Earnings machinery, extract from the canonical copy **by symbol, not by line
range** — the data constants are interleaved with the machinery. Then grep for the source company's
name: `ceIRButton` hardcodes it and will happily ship on another company's page.

---

## 7. Auditing it

The portal needs a login the session often does not have. Mount the module directly instead:
`harness-<ticker>.html` (gitignored; copy `harness-amzn.html`) loads the portal stylesheets, mounts
`html()` + `init()` into a `#co-detailview` shell, and exercises the real ES-module parse.

**Two harness gotchas that will fool you:**

- **`requestAnimationFrame` is paused in a tab that is not foreground.** Every chart builder is
  behind rAF, so an automated pass can click through the whole profile and find **zero** charts
  built. Taking a screenshot forces one frame and builds one pane's worth. For a full sweep,
  route rAF through a timer for the duration of the audit — that took Amazon from 4 charts built
  to all 25:

  ```js
  const realRAF = window.requestAnimationFrame;
  window.requestAnimationFrame = fn => setTimeout(() => fn(performance.now()), 0);
  // …click every section and sub-tab, waiting ~500ms each…
  window.requestAnimationFrame = realRAF;
  ```
- **CSS `zoom` does not reflow a Chart.js canvas.** Zooming out to fit a pane in one screenshot
  makes correct charts look broken. Audit at zoom 1 and scroll.

**What to check, and how:**

| Check | How |
|---|---|
| Duplicate DOM ids | collect `[id]`, count, expect the Results engine's three instances — verify every handler is pane-scoped |
| Charts without tables | per sub-pane, count canvases with a `Chart.getChart()` against `table` elements |
| Invalid colours | scan every chart's `backgroundColor`/`borderColor` for `NaN` |
| Panes with no source footer | per sub-pane, look for `.ov-foot, .ov-fynote, .ew-foot, .sg-src, .ave-subh-note, .rs-ft-cap`. **The source footer currently has three different class names** (`.ov-foot` in the canonical set, `.ew-foot` in the Bottom Line panes, `.sg-src` in Top Line) — a narrower selector reports four false positives on Amazon. Converging them is a design-system item; a **new** pane uses `.ov-foot` |
| Empty panes | per sub-pane, flag `innerText.length < 400` |
| Inline `<style>` count | `document.querySelectorAll('.copane style').length` — a new profile should add none |

**Click the controls, do not just check the markup renders.** Several controls in the ported
Earnings machinery rendered as live pills that did nothing because their wiring function was copied
without its call site.

---

## 8. Pre-ship checklist

Run it and report pass/fail per line.

- [ ] Six sections present, in order; no sub-tab is a placeholder
- [ ] Overview and Deep Dive are siblings, each with its own source footer
- [ ] Every chart: drag-zoom on both axes + double-click reset · legend click hides the series **and**
      removes it from every table and total · a table under it in a dropdown · metric dropdown grouped
      by family · units and estimate markers unambiguous · missing data renders nothing
- [ ] Every pane ends with a `.ov-foot` naming filing, note and date
- [ ] No new inline `<style>`; only canonical components used
- [ ] No unicode circled digits in headings
- [ ] Estimates visibly marked as estimates; no fake precision; mixed periods labelled
- [ ] Modal closes on tab and sub-tab change; modal hoisted to `#co-detailview`
- [ ] No `NaN` in any chart colour; no duplicate-id handler resolving through `document`
- [ ] Every control clicked at least once
- [ ] Registered in `js/overviews/index.js`; app loads with no console errors
- [ ] One company, one PR — and **do not open the PR until the reviewer asks**
