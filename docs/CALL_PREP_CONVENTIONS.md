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

A **6th Deep Dive spine tab** ("Call Prep"), leaving the five existing tabs (Top Line / Bottom Line /
Evolution / Valuation / Management) untouched. Five sub-tabs, grouped into **three phases**:

| Phase | Sub-tab | What it holds |
|---|---|---|
| **① Pre-Call** | **Setup** | Bloomberg consensus grid + "the one debate that matters" + the variant view (where we differ from the tape) |
| **① Pre-Call** | **Watch List** | 5 ranked things to hunt — each with its consensus number, red-line, provenance, and *tell* |
| **① Pre-Call** | **Promise Tracker** | what management is genuinely doing vs. what it merely floated |
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

**Post-Call (what management said + the meeting take):**
- **Tone shifts**, **contradictions vs. prior quarters**, **promise updates** (bullets).
- **Conclusion** — the money block. Written to answer the meeting question: *"what did you make of the
  call? what stood out? what did you see / hear?"* One tight paragraph a PM can read aloud: did any
  red-line trip, is the thesis intact, what's the one honest loose end.
- **newQuestions** — 1-3 items that seed next quarter's Watch List.

---

## 6. The refresh workflow

1. Analyst exports the Bloomberg workbook (one tab per company) and hands over the ticker's tab.
2. "Reintegra el consensus" → regenerate `setup.consensus` (visible values only) + bump `asOf`.
3. After the print → fill `results`. After the call (paste the transcript) → fill `call` (+ `newQuestions`).
4. Roll the quarter: set the reported quarter `status:'reported'`, add the next `upcoming` quarter with a
   fresh (frozen) Watch List — do **not** edit the prior quarter's frozen blocks.

All changes go through a PR (per the repo git workflow); only San/Oscar merge.
