# Call Prep — THE complete convention (build + call interpretation, v2 · Jul 2026)

**This is the single source of truth for everything earnings-call related**: how calls are
ANALYZED (the rules, the detection protocol, the regression tests), how they are STORED (the
calls repository + rotation), and how the Call Prep section is BUILT (inputs, steps, data model,
UI contract, checklist). There is no other context document — if a rule about calls exists, it
lives here.

**The contract:** Dani hands over **(a) a ticker, (b) its earnings-call transcripts, (c) the
Bloomberg numbers export, and optionally (d) SPLC / Summit expectations** — and a fresh session,
with no other context, builds everything from ONE prompt: **"arma el Call Prep de \<TICKER\>"**
(or refreshes with "integra el nuevo call de \<TICKER\>"). If a step is ambiguous, fix THIS doc.

**Reference implementation: `js/overviews/googl.js`** (v2 — canonical). `ibkr.js` is v1 (legacy:
standalone Promise Tracker, single-estimate setup, no quarter selector) pending migration — do
NOT copy from it for new companies.

---

# PART I — HOW CALLS ARE ANALYZED

## 1. RULE 0 — the So-What rule (overrides everything)

**A number is never a highlight. A growth rate is never a highlight.** Every highlight is a
three-part chain, all three mandatory:

> **FACT** (what the number did) → **WHY** (the qualitative driver — why it grew, fell, or held) →
> **SO WHAT** (what it implies for the thesis / the model going forward)

The test, verbatim: *"no sirve ir al call y decir que los DARTs crecieron 35% — so what???"*

- ❌ **Banned:** "DARTs +35% YoY." / "Cloud grew 48%." (restatements — everyone has the release)
- ✅ **Required:** "DARTs +35% — but almost all of it is *more accounts* (+34%), not more activity
  per account, and management itself flagged the strong environment as part of the reason → the
  growth is real but its per-account intensity is **not proven structural**; the tell is
  DARTs/account when volatility normalizes."

**Where the WHY comes from, in order of weight:**
1. Management's explanation **under analyst pressure** (Q&A, pushed) — highest weight.
2. Management's volunteered explanation (prepared remarks).
3. A mechanism you infer from disclosed facts — allowed, but **label it as inference**.
4. **No explanation found** → the item does not die; it converts into a next-quarter question, and
   the absence itself is a signal: *a big move management didn't explain is a flag, not a gap.*

## 2. The detection protocol — three passes, in order

Detection and selection are two different jobs. Reading "for highlights" conflates them — you
only see what already looks important, and that is exactly how buried datos get missed (see the
regression tests, §4).

### Pass 1 — Extraction (mechanical, exhaustive, judgment FORBIDDEN)

Build a **raw candidate table** by running ALL of these scans over the **full transcript**
(prepared remarks + Q&A, never just the release):

| Scan | What to extract |
|---|---|
| **1.1 Not-in-the-tables** | Every quantified claim in the prepared remarks that does NOT appear in the release tables. Management choosing to say a number out loud that the release doesn't tabulate is itself the signal. |
| **1.2 Multiplier words** | Literal word-scan: *tripled, doubled, record, first (time/-ever), fastest, all-time, "straight up", never, only* — plus any bare % ≥ 50. Grep-able; run it literally. |
| **1.3 New proper nouns** | Products, venues, partners, geographies, regulators seen for the first time. Cheap to log; often next year's segment. |
| **1.4 Q&A-only facts** | Anything stated only under questioning and absent from the release. Weight answers-when-pushed over volunteered remarks. |
| **1.5 Diff vs prior 2–3 calls** | Metrics/topics that recurred (candidate trend) and — just as important — that **disappeared** (silences). |
| **1.6 Guarded answers** | Q&A exchanges where the answer is notably shorter, vaguer, or more hedged than the question deserved. The gap between question and answer is data. |

No filtering at this stage. The already-in-the-DCF filter applied during extraction is how datos
get lost — it belongs in Pass 3 only.

### Pass 2 — Enrichment (the WHY, mandatory per item)

For **every** Pass-1 candidate, answer: *why did this number move (or hold)?* using the Rule-0
source hierarchy. No WHY → the item proceeds as a **question/flag**, not a highlight.

### Pass 3 — Selection & ranking (judgment)

- **Relevant:** anything that changes the *forward* picture — a red-line held/tripped WITH its
  driver; a strategy pivot (language change vs prior calls); a tone-shift vs management's own
  history; candor against interest; a 2-quarter recurring metric management chooses to quantify;
  a silence on a live project; a competitive/regulatory event confirmed flowing through the
  numbers; a promise delivered/abandoned.
- **NOT relevant (cut without mercy):** restatements without a driver; in-line results on
  undisputed lines; boilerplate macro color; congratulatory chatter; routine litigation; anything
  "everyone at the meeting already has."
- **Recurrence rule:** 1 mention = candidate · **2 consecutive quarters = trend, auto-promote** ·
  disappearance = silence signal (the calls repository is the running list).
- **No-follow-up trap:** zero analyst questions never demotes an item — the Street's inattention
  is often the opportunity (`curious`).
- **Tone vs. history:** diff each answer against how THIS management historically talks about it.
- **Candor against interest:** management volunteering evidence against its own bull case is
  auto-promoted — highest-credibility signal.
- **Only now** apply the already-in-the-DCF filter, and tag survivors:

| `tag` | Captures | The test |
|---|---|---|
| **`thesis`** | Confirms/threatens the core thesis — the WHY, not the number | "Bull/bear case stronger or weaker — and why?" |
| **`curious`** | A buried, one-mention detail hinting at something structural | "Said off-hand — could it be the story in 2 years?" |
| **`dots`** | 2+ individually-unremarkable facts that only mean something together | "Do these connect into a narrative the numbers hide?" |
| **`tone`** | Management notably more/less confident vs prior quarters | "Did the LANGUAGE change even if the facts didn't?" |
| **`watch`** | A silence/omission, or a new risk to track | "What didn't they mention that they used to?" |

## 3. The calls repository — historicals + THE LATEST, with rotation

Two files per company in `docs/calls/`:

- **`<TICKER>-latest.md`** — ONLY the most recent call: full transcript + its analysis. The
  working file for the current cycle.
- **`<TICKER>.md`** — the historical compendium, newest first. Append-only; prior quarters are
  never rewritten (Pass 1.5 needs its baseline).

**The rotation, when a new call lands:** (1) append the current latest to the TOP of the
compendium; (2) put the new transcript in `-latest.md` and analyze it there; (3) refresh the Call
Prep (roll the quarter — §8 step 9).

## 4. Regression tests — any fresh analysis must catch these

**Test #1 — the buried recurring dato (IBKR overnight trading).** Q4'25: "+76% QoQ," one line, no
follow-up. Q1'26: "nearly tripled to 8.1M trades" — narrative script only, not in the release
tables, zero questions; missed by a selection-first read, flagged by Dani. Q2'26: 10.9M, an
obvious trend. Scans 1.1 + 1.2 catch it in Pass 1; recurrence auto-promotes; no-follow-up never
demotes.

**Test #2 — the guarded answer (IBKR margin loans +67%).** Answered with "we feel comfortable,"
no granularity. Caught by 1.6 + tone-vs-history. Listing it as a positive without flagging the
answer's thinness fails Rule 0.

**Test #3 — the bare-number restatement.** Any bullet equivalent to "DARTs grew 35%" (or "Cloud
grew 48%") with no driver and no implication fails Rule 0 outright.

---

# PART II — HOW THE CALL PREP IS BUILT

## 5. Inputs & golden data rules

| Input | Form | Where |
|---|---|---|
| Ticker / company | in the prompt | — |
| Earnings calls | transcripts (~10 quarters) | → stored by YOU per §3 |
| Numbers / consensus | Bloomberg export, e.g. `FA_<TICKER>_US_*.xlsx` — sheet "Multiple Periods": rows = line items, columns = quarters, last column(s) = `(Fwd)` estimates | Dani's **Downloads** |
| Summit expectations | Summit DCF/MCP (`search_ticker` first) or analyst hand figures | MCP / Dani |
| SPLC | Bloomberg SPLC export — feeds the DEEP DIVE, not Call Prep | Downloads |

1. **Consensus = Bloomberg ONLY** (web estimates are color, never a source of record; never
   hardcoded).
2. **Hardcode only the values that render.** No hidden series committed.
3. **Summit estimates are never invented** — absent → "to fill".
4. **Append-only per quarter** — pre-call blocks freeze when the quarter opens.

## 6. UI structure

Evolution's sub-tab row: `Earnings Calls · Guidance · Strategy · Timeline · Call Prep`
(Call Prep is a **sub-tab of Evolution**, never a spine tab).

**Call Prep pane** = intro note + **QUARTER SELECTOR** (pill per quarter, newest/upcoming first,
active by default) + **four phase tabs**: Setup · Watch List · Post-Results · Post-Call. Every
phase renders **per-quarter blocks** (`.cp-qblock[data-cpq]`) and the quarter pills toggle them —
one quarter visible at a time, so the page stays light as quarters accumulate. Each quarter keeps
its frozen pre-call blocks NEXT TO its post-mortem (the calibration record).

| Phase | Content per quarter |
|---|---|
| **Setup** | *Upcoming quarter:* 4 **headline** metrics (mandatory, every company: **Revenue · Operating income · EPS · EBITDA**) + 4 **custom KPIs** (per-company, agreed with Dani), each with **Street** (Bloomberg) and **Summit** estimates behind a **Consensus ⇄ Summit ⇄ Both** toggle; caveat pop-ups (`cpQ`) on numbers with a trap; **the debate** = the explained Street-vs-Summit disparity (enabled, to-fill until both sets exist). *Reported quarters:* the FROZEN pre-call view (what was priced in + the one-liner). |
| **Watch List** | 5 ranked items **per quarter** — the hunting list for THAT quarter, seeded when the prior quarter closed. The upcoming quarter's items are **themes with time**: `since` + `thread` (quarter-by-quarter evolution from the calls repo). Reported quarters keep their contemporaneous lists, frozen. Promise-type items live here (project/pipeline/musing; silence is a signal). |
| **Post-Results** | scorecard vs the frozen expectations (beat/miss/in-line, notes via `cpQ`) + **thesis red-line check vs that quarter's frozen Watch List** + "what the numbers tee up for the call" + price reaction. |
| **Post-Call** | take + insight-first highlights (Rule 0 + the §2 taxonomy, depth in pop-ups) + the connect-the-dots line + `newQuestions` (which seed the NEXT quarter's Watch List — the chain must be visible). |

**Dissolved:** the standalone Promise Tracker tab — its discipline lives inside the Watch-List
threads and the Earnings Calls themes' status chips. Never build it for new companies.

**Evolution ▸ Earnings Calls** — the standard multi-company contract (ibkr/uber/lyft/cart/ma/
rely/v): a `<TICKER>_THEMES` array (`{theme, why, updates:[{q, items:[...]}]}`) rendered with the
**By theme ⇄ By quarter** pill toggle and `lpb-acc` accordions — themes trace how each story
evolved; quarters show what mattered in a given call; entries are contemporaneous HIGHLIGHTS
(bold the key figures). **v2 enhancement:** each theme carries a status chip — `trend` (confirmed)
/ `promise` (a commitment to reconcile next call) / `watch` — absorbing the Promise Tracker.

## 7. Data model (essentials)

```js
var CALL_PREP = { ticker:'XXXX', quarters:[
  { q:'Qx 20xx', status:'upcoming', date:'…',
    setup:{ source, asOf,
      headline:[ {k:'Revenue',cons:{v,yoy,unit},us,note?}, {k:'Operating income',…},
                 {k:'EPS (diluted)',…}, {k:'EBITDA',…} ],
      custom:[ /* 4 per-company; k:null renders "to define" */ ],
      debate:null | { rows:[{k,street,us,why}], synth } },
    watchList:[ { rank, metric, since, bbg, breaks, pista, why, src,
                  thread:[{q,n},…] } /* ×5 */ ],
    results:null, call:null },
  { q:'Q(x−1)', status:'reported', date:'…',
    setup:{ source, pricedIn, oneLiner },          // FROZEN contemporaneous view
    watchList:[ /* the list as seeded at prior close — FROZEN */ ],
    results:{ headline, scorecard:[{metric,cons,actual,result,note?}],
              thesisCheck:[{line,tripped,note}], intoCall:[…], priceReaction },
    call:{ take, highlights:[{tag,head,detail}], dots, newQuestions:[…] } },
  // …older quarters, same shape, append-only
]};
```

Render machinery to port verbatim from `googl.js` (swap data + brand only): `cpStyle`, `cpFmtC`,
`cpEvCell`, `cpQPills`/`cpQkey`, `cpSetupBody`, `cpWatchBody`, `cpResultsBody`, `cpCallBody`,
`callsBody`/`callsByQuarter`, `cpUpcoming`, `cpFill`, `CP_RES`, `CP_HLTAG`, `CP_THST`,
`CP_POP`/`cpReg`/`cpQ`, `wireCallPrep` (phase tabs + estimates toggle + quarter pills) and the
`lpb-acc`/`calls-pill` wiring in `init`.

## 8. The build — nine steps, in order

1. **Calls repository** (§3): create/rotate `-latest.md` + compendium.
2. **Analyze** the latest call (Part I) AND diff the full record — Pass 1.5 discovers the themes
   and promise ladders.
3. **Extract consensus** from the Bloomberg export (python/openpyxl, `data_only=True`; last
   `(Fwd)` column; YoY vs the same reported quarter).
4. **Build `CALL_PREP`**: the upcoming quarter (Setup v2, per-quarter watch list of THEMES).
5. **Backfill reported quarters as worked examples** — when call history exists, build at least
   the TWO most recent reported quarters end-to-end (frozen setup + contemporaneous watch list +
   results + call), so the accumulate-over-time picture is visible and the
   `newQuestions → next watchList` chain is real. Frozen consensus for old quarters may be
   qualitative ("hold high-teens") where the archived Bloomberg number isn't at hand — never
   invent precise figures.
6. **Earnings Calls themes view** (`<TICKER>_THEMES`, §6 format).
7. **Port the render machinery** from `googl.js` (§7).
8. **Wire it** (§6 placement; `wireCallPrep` + calls-pill/lpb-acc in `init`).
9. **After each print/call**: fill `results` then `call` (Rule 0); ROLL — new upcoming quarter
   whose Watch List comes from `newQuestions` + updated threads; rotate the calls repo; update
   the themes view.

## 9. Self-audit checklist (report PASS/FAIL before finishing)

- [ ] ONE convention doc (this file) — no rules living elsewhere.
- [ ] Calls repo: `-latest` + compendium; rotation respected; append-only.
- [ ] Setup: exactly 4 headline + 4 customs; every rendered value traced to the Bloomberg export
      (`asOf`); YoY correct; Summit column renders (values or "to fill"); toggle works; caveat
      pop-ups on trap numbers; debate enabled.
- [ ] Watch List: per quarter; upcoming = 5 themes with `since`+`thread`+falsifiable `breaks`+a
      tell-that-is-a-read; reported quarters frozen contemporaneous; promises embedded (no
      standalone tab).
- [ ] ≥2 reported quarters backfilled end-to-end; `newQuestions → next watchList` chain visible;
      quarter pills toggle all four phases.
- [ ] Earnings Calls: By theme ⇄ By quarter toggle, `lpb-acc` accordions, status chips,
      contemporaneous highlights.
- [ ] Rule 0 everywhere; §4 regression tests pass.
- [ ] `node --check` clean · `&amp;` = 0 · no orphan identifiers · localhost renders.
- [ ] Committed on a feature branch; Dani opens PRs; San/Oscar merge. Flag anything unsourced.
