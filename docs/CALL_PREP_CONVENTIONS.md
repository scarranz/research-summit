# Call Prep — conventions

How to build the **Call Prep** tab for any company. This is the earnings-season decision layer:
walk into the call already knowing what to hunt, and walk out ready to tell the fund meeting what
mattered. It is portable — the render code is written once and copied; only the content changes.

When asked to **"arma el Call Prep para \<TICKER\>"**, follow this document. It assumes the company
already has an Overview/Deep Dive profile (see `docs/OVERVIEW_CONVENTIONS.md`).

---

## 0. The golden rule on data — provenance

- **Consensus comes from Bloomberg only** (BST estimates), handed over by the analyst as an export.
  **Never** scrape Street consensus from Zacks / Barchart / Motley Fool / StockTitan / etc. — those
  are directional color, not a source of record.
- **Hardcode only the values that actually render in the portal.** Do not commit the full Bloomberg
  workbook or a long hidden series — only the specific numbers shown on screen. (Confirm it is
  compliant to surface Bloomberg figures before publishing.)
- Every number carries an implicit **`source` + `asOf`** stamp shown in the UI, so the dashboard never
  presents a stale figure as current.
- **Actuals** (reported quarters) also come from Bloomberg (or the company release), not the web.
- If a figure isn't from one of those trusted sources, leave the field empty (it renders as "to fill")
  rather than inventing it.

---

## 1. Structure

A **"Call Prep" sub-tab inside the Evolution tab** (team decision Jul 2026 — it is part of the
company's evolution record, not a standalone spine tab; the spine keeps its five tabs: Top Line /
Bottom Line / Evolution / Valuation / Management). Evolution's sub-tab row becomes
`Earnings Calls · Guidance · Strategy · Timeline · Call Prep`; inside Call Prep, an **inner
phase-tab row** (its own classes, wired independently of the pane-scoped sub-tab machinery — see
`wireCallPrep` in `ibkr.js`) holds five panes, grouped into **three phases**:

| Phase | Sub-tab | What it holds |
|---|---|---|
| **① Pre-Call** | **Setup** | v2 (Jul 2026): **4 headline metrics** (mandatory, every company: Revenue · Operating income · EPS · EBITDA) + **4 custom KPIs** (per-company), each carrying a **Street** (Bloomberg) and a **Summit** (our own) estimate with a **Consensus ⇄ Summit ⇄ Both** toggle; plus **the debate** = the explained disparity between the two sets (spec: `EARNINGS_CALLS_CONTEXT.md` §3) |
| **① Pre-Call** | **Watch List** | v2 (Jul 2026): 5 ranked **THEMES tracked over time** — each with `since` + a quarter-by-quarter `thread` (from the calls repository), its consensus number, red-line, provenance, and *tell*. Promise-type items live here (project/pipeline/musing discipline; silence is a signal) |
| **① Pre-Call** | ~~Promise Tracker~~ | **DISSOLVED (Jul 2026)** — its content migrated into the Watch-List threads and Evolution ▸ Earnings Calls (themes view). Do not build it as a standalone tab for new companies |
| **② Post-Results** | **Post-Results** | the numbers scorecard vs. consensus (beat/miss) + thesis red-line check — filled when the print lands, *before* the call |
| **③ Post-Call** | **Post-Call** | tone / contradictions / promise updates + the **Conclusion** (the meeting take) |

Why the results/call split: results are released first (~4pm), the call is later (30 min → next day).
Post-Results reacts to the **numbers**; Post-Call reacts to what **management said**.

**Append-only:** a quarter's Pre-Call blocks freeze when the quarter opens and are never overwritten —
they sit beside that quarter's Post-Results/Post-Call so, over time, the tab is a record of how well we
read the company (calibration). `call.newQuestions` seeds the *next* quarter's Watch List.

---

## 2. Data model (`CALL_PREP`, hardcoded in the company's overview JS)

```js
var CALL_PREP = {
  ticker: 'IBKR',
  quarters: [
    { q:'Q2 2026', status:'upcoming', date:'…',
      setup:{
        source:'Bloomberg (BST consensus)', asOf:'YYYY-MM-DD',
        consensus:{ adjEps:{v,yoy,unit:'$'}, adjNetRevUsdM:{v,yoy,unit:'$M'}, /* …only visible lines */ },
        pricedIn:'…the one debate…', oneLiner:'…where we differ from the tape…'
      },
      watchList:[ /* 5 items — see §3 */ ],
      results:null, call:null            // filled after the print / after the call
    },
    { q:'Q1 2026', status:'reported', date:'…',
      setup:{…}, watchList:[…],          // FROZEN
      results:{ headline:'…', scorecard:[{metric,cons,actual,result:'beat|miss|inline'}], thesisCheck:[{line,tripped,note}], priceReaction:'…' },
      call:{ toneShifts:[], contradictions:[], promiseUpdates:[], newQuestions:[], conclusion:'…the meeting take…' }
    }
  ],
  promises:[ { item, kind:'project|pipeline|musing', origin, status:'delivered|pending|silent|abandoned', lastMentioned, note } ]
};
```

The render functions (`cpSetupBody`, `cpWatchBody`, `cpPromisesBody`, `cpResultsBody`, `cpCallBody`)
plus `cpStyle`, `CP_STAT`, `CP_KIND`, `CP_RES` are generic — copy them verbatim, change only `CALL_PREP`.

---

## 3. Watch List — the criteria (the heart of the tab)

**Exactly 5 items, ranked.** Not 20. The rank is not gut feel — it is:

> **how much the line moves the stock  ×  how debated / uncertain it is.**

Each item must be **grounded**, and the grounding is shown in the UI (📌). A metric earns a spot only if
it is one or more of:

- a **Bloomberg "Highlight"** line (the vendor's own pick of what matters for this company), and/or
- a **recurring theme** across the last several earnings calls (management leads with it, or analysts
  keep pressing it), and/or
- repeatedly emphasized in **filings / press releases**.

Do **not** include a metric just because it sounds fundamental. Example: for IBKR, *pre-tax margin* was
dropped from the Watch List — Bloomberg highlights pre-tax **income**, not the margin ratio, and the
margin is a lagging *output/proof* of the automation thesis, not a debated variable. If you can't state
*why* a metric is on the list in one grounded sentence, it doesn't belong.

Each item carries:

- **metric** — the exact line, precise (e.g. "commission **per DART**", not "commissions").
- **bbg** — the Bloomberg consensus number for it.
- **breaks** — the falsifiable **red-line**: the specific number/condition that would break the thesis
  (e.g. "NII falls YoY while credit balances still grow"). Every item must have one — this is what makes
  the tool testable.
- **src (📌)** — the one-sentence grounding (why it earned its rank).
- **pista (🔎)** — **the tell**, *not a question.* A standing read that holds regardless of what the call
  says, telling you what to hunt for. Example: *"commission per cleared trade has held ~$2.65–2.83 for
  two years — that stability IS the pricing-power proof; the only thing that changes the story is that
  number cracking."* Avoid improbable questions no exec answers on a call ("at what balance-growth rate
  does NII still grow?"). A genuinely answerable question can be embedded in a tell, but frame it as a
  read, not a Q&A wish-list.
- **why** — a short line on why it matters to the thesis.

---

## 4. Promise Tracker — the discipline

Separate **what management is genuinely doing** from **what it merely floated.** Tag every item:

- **`project`** — a committed, funded, active initiative (e.g. a filed charter application). Held to account.
- **`pipeline`** — a stated expectation / number management put out there (e.g. "~two dozen firms in
  progress"). Held to account, and reconcile it to actuals.
- **`musing`** — "we're open to the possibility." **Not a promise.** Show it, but explicitly flag that it
  is not to be held against management unless they re-commit.

`status`: `delivered` / `pending` / `silent` / `abandoned`. **Silence is a signal** — a real project that
quietly stops being mentioned (→ `silent`, amber) is often the cheapest tell nobody tracks.

Do **not** promote a musing into a promise. (E.g. "eventual European bank license" mentioned once = a
musing, not a project.) Regulatory changes that help the company (e.g. a rule elimination) are **not**
management promises — they belong in the Watch List, not here.

---

## 5. Post-Results & Post-Call

**Post-Results (numbers, before the call):**
- A **scorecard**: each Watch-List line — consensus vs. actual → **beat / miss / in line** chip.
- A **thesis red-line check**: for each Watch-List `breaks` condition, did it **trip** or **hold**?
- The print-day price reaction (from a trusted source, not web) — leave to fill if unavailable.

**Post-Call — insight-first, NOT a restatement of the numbers.** This is the most important discipline
in the whole tool. Everyone at the meeting already has the metrics (they're in the DCF / the data).
Restating "commissions crossed $600M" is **useless** — it adds nothing. The job of Post-Call is to
surface **what a number can't tell you on its own**: *why* it came out that way, what it *implies for
the thesis*, and the non-obvious details that — connected — tell the story.

Structure (each rendered as a scannable list, depth in a pop-up — never a wall of text):
- **`take`** — a one-line meeting take (the punch: is the thesis intact, what's the one thing that matters).
- **`highlights[]`** — theme-by-theme insight bullets (see the taxonomy below). Each: a `tag`, a short
  insight `head` (the takeaway, *not* the fact), and a `detail` pop-up with the depth + why.
- **`dots`** — the connect-the-dots line: how the highlights, together, tell one story.
- **`newQuestions`** — 1-3 items that seed next quarter's Watch List.

### Rule 0 — the So-What rule (overrides everything)

**A number is never a highlight; a growth rate is never a highlight.** Every highlight is a
mandatory three-part chain: **FACT** (what the number did) → **WHY** (the qualitative driver —
why it grew, fell, or held, sourced from management's words, weighted highest when said under
analyst pressure; inference allowed but labeled) → **SO WHAT** (what it implies for the thesis /
model). "DARTs grew 35%" is banned; "DARTs +35% because accounts +34% (per-account activity flat)
and management credits the environment → intensity not proven structural" is the standard. If no
WHY exists in the transcript, the item becomes a next-quarter question — **a big move management
didn't explain is a flag, not a gap.**

**Detection ≠ selection — two passes.** First an exhaustive mechanical extraction over the full
transcript (quantified claims NOT in the release tables; multiplier words — tripled/doubled/
record/first; new proper nouns; Q&A-only facts; diff vs prior 2-3 calls; guarded answers), with
judgment forbidden. Only then filter and rank. Applying the already-in-the-DCF filter *during*
extraction is how buried datos get lost (see the overnight-trading regression test in
`EARNINGS_CALLS_CONTEXT.md` §5). Zero analyst follow-up never demotes an item; two consecutive
quarters of mention auto-promotes it to trend.

### What counts as a highlight — the taxonomy (company-agnostic)

A bullet earns a spot only if it is one of these. If it just restates a metric, **cut it.**

| `tag` | What it captures | The test |
|---|---|---|
| **`thesis`** | A result that *confirms or threatens the core thesis* — the **why**, not the number. | "Does this make the bull/bear case stronger or weaker, and why?" |
| **`curious`** | A **buried, low-emphasis detail** — mentioned once, in passing — that hints at a bigger/structural shift. | "Was this said almost off-hand, and could it be the story in 2 years?" (e.g. a product volume quietly tripling) |
| **`dots`** | Two+ individually-unremarkable facts that **only mean something together.** | "Do these connect into a narrative the standalone numbers hide?" (e.g. headline miss + strong operating lines = 'the business beat, the print missed') |
| **`tone`** | Management gets **notably more/less confident or hedged** on a topic vs. prior quarters. | "Did the *language* change even if the facts didn't?" |
| **`watch`** | A **silence / omission** (something expected that wasn't said) or a new risk to track next quarter. | "What *didn't* they mention that they used to?" |

### How to actually find them (the method — use this for any company)

1. **Read the full transcript, not the press release.** The insights live in the unscripted Q&A, not the
   prepared remarks. Weight what management says when *pushed* over what they volunteer.
2. **Compare against prior quarters.** A highlight is usually a *change* — in a trajectory, in emphasis,
   or in tone. Diff this call against the last two or three.
3. **Apply the "already-in-the-DCF" filter.** For every candidate bullet ask: *"would someone who already
   has the numbers learn anything from this?"* If no → it's a restatement → cut it.
4. **Hunt the one-mention details.** Scan for things said briefly, once, with no follow-up — a new venue,
   a product volume, a regulatory nuance, a customer type. Then ask whether it connects to a longer arc.
5. **Connect the dots.** Look for 2-3 facts that are boring alone but tell a story together. That synthesis
   is the `dots` line — and often the single most valuable thing in the whole tab.
6. **Note the silences.** A project/topic that dropped off the script is a signal (cross-check the Promise
   Tracker). What management *stopped* saying can matter as much as what they said.

The bar: a PM reads the `take` + skims the highlight heads in 30 seconds and knows *what to say in the
meeting*; taps a pop-up only when they want the depth. Punchy, synthesized, visual — never paragraphs.

---

## 6. The refresh workflow

1. Analyst exports the Bloomberg workbook (one tab per company) and hands over the ticker's tab.
2. "Reintegra el consensus" → regenerate `setup.consensus` (visible values only) + bump `asOf`.
3. After the print → fill `results`. After the call (paste the transcript) → fill `call` (+ `newQuestions`).
4. Roll the quarter: set the reported quarter `status:'reported'`, add the next `upcoming` quarter with a
   fresh (frozen) Watch List — do **not** edit the prior quarter's frozen blocks.

All changes go through a PR (per the repo git workflow); only San/Oscar merge.
