# Call Prep — THE complete convention (build + call interpretation, v2.2 · Jul 2026)

**This is the single source of truth for everything earnings-call related**: how calls are
ANALYZED (the rules, the detection protocol, the regression tests), how they are STORED (the
calls repository + rotation), and how the Call Prep section is BUILT (inputs, steps, data model,
UI contract, checklist). There is no other context document — if a rule about calls exists, it
lives here.

**The contract:** Dani hands over **(a) a ticker, (b) its earnings-call transcripts, (c) the
Bloomberg numbers export, and optionally (d) SPLC / Summit expectations** — and a fresh session,
with no other context, builds everything from ONE prompt: **"arma el Call Prep de \<TICKER\>"**
(or refreshes with "integra el nuevo call de \<TICKER\>"). If a step is ambiguous, fix THIS doc.

**Reference implementation: `js/overviews/googl.js`** (v2.2 — canonical). `ibkr.js` is v1 (legacy:
standalone Promise Tracker, single-estimate setup, no quarter selector) pending migration — do
NOT copy from it for new companies.

**What v2.2 added, and why (read §4b and §6b–§6d before building):** the tab produced a good
record but not a usable brief. Four gaps were closed — the `newQuestions → seededBy` chain was
asserted in a footer but never visible; the scorecard rendered a guide reset and an in-line revenue
beat as visual equals; highlights were a flat list of nine when only three were meeting material;
and nothing in the tab produced the thing the whole workflow exists for — *what you say out loud*.
Three cross-cutting rules (**L**egibility, **H**onesty of encoding, **D**eficiency-labelling) were
added after each was violated in the first build; they outrank layout preference.

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

*Tests #4–#6 are BUILD-phase failures (Part II rules), listed here so the whole regression suite
lives in one place. Run them against the rendered tab, not the analysis.*

**Test #4 — the deficiency label (Rule D).** A scorecard row for **Operating income** or **EPS**
must never render a chip implying it was unwatched. Those lines are always covered; they are
simply not among the five most *contested* items. Empty state = blank + a neutral legend line.
Any build that ships a `not watched`-style label on a fundamental line has failed, whatever else
it got right.

**Test #5 — judgement dressed as measurement (Rule H).** A hand-assigned `surprise` value rendered
as a filled progress bar labelled `HIGH`. Any bar, gauge or percentage sitting on a value no
formula produced fails — render the word and disclose the editorialism in the legend.

**Test #6 — the crowded `lead` band (§6b).** 5 of 8 highlights tagged `lead`, including two
theses the print had *confirmed*. A band holding most of the list is not a ranking: recount, and
move anything settled to `context`.

---

# PART II — HOW THE CALL PREP IS BUILT

## 4b. Three rules that outrank layout taste

These govern every render decision in Part II. All three were violated in the first v2.1 build and
had to be fixed after review — they are not stylistic preferences, they are the difference between
a brief a desk can hand over and one it cannot.

### Rule L — Legibility: the screen explains itself, or it is broken

**The test:** a colleague who has never seen this dashboard opens the tab cold, with no
explanation from you, and understands every mark on it. If they need you to narrate, the design
failed — you will not be standing next to the person reading it.

Concretely, this bans:

- **Bare symbols.** A circled `①`, a `↩`, a `→`, a lone `⚑` communicates nothing on arrival. Write
  the words: `WATCH #1`, `left open by Q1 2026`, `became Q2 2026 Watch item #4`.
- **Compressed jargon.** `3q open` is not a label; `unreconciled 3 quarters` is.
- **Legends buried at the bottom.** If a section uses any chip or badge, a `.cp-legend` block sits
  ABOVE the content, not in the footnote. The first time a mark appears, its meaning is already on
  screen.
- **Precision the number does not have** — see Rule H.

### Rule H — Honesty of encoding: never render judgement as measurement

A progress bar, a percentage, a 0–100 scale all say *this was computed*. If the underlying value
was typed by an analyst, the visual is a lie about the data's provenance, and it will be believed.

**The failure case, verbatim:** v2.1 shipped `surprise:95` as a filled bar labelled `HIGH`. Nothing
computed it — it was a hand judgement about how far the capex guide landed from expectations. The
bar made it look derived. It was replaced with a plain text chip (`big surprise` / `some surprise`
/ `as expected`) and a legend that says, in the UI itself, *our judgement, not a calculation*.

**The rule:** an editorial value renders as a **word**, never as a bar, gauge, sparkline or
percentage — and the legend discloses that it is editorial. Only values traceable to the Bloomberg
export or the release may render as precise figures.

### Rule D — Never label the desk with a deficiency it does not have

The deliverable is read by people who can fire you. Every label is a claim about the team, not
just about the data — and the absence of a mark gets read as a claim too.

**The failure case, verbatim:** the Post-Results scorecard tagged any line that was not among the
five frozen Watch-List items as `not watched`, with the tooltip *"nobody was watching for it."*
Operating income and EPS therefore rendered as **not watched**. That is false and it is
career-ending in a meeting: those lines are always covered — they simply are not among the five
most *contested* items, which is what the Watch List ranks. Dani's verdict: *"es peligrosísimo
llevar y entregar eso, nos despiden mañana mismo."*

**The fix, and the general form:** the cell renders **blank** (`.cp-sc-rk.blank` — no chip, no
dashed border, no tooltip), and the legend states the neutral reading explicitly: *"A blank here
just means the line was not one of those five — every line below is covered."*

**The rule, generalised — the asymmetric-badge principle:**

> A badge may assert a **positive** fact about our work (`WATCH #1` = we flagged this as contested
> before the print). Its **absence must never assert a negative** one. If a reader could construe
> the empty state as "the desk missed this," "nobody covered it," or "we had no view," the empty
> state renders blank and the legend defuses it in words.

**Apply this test to every new badge, in any company's file.** Before shipping any chip, ask: *if
this mark is absent, what does a partner conclude about the desk?* If the answer is anything worse
than "not applicable here," redesign the empty state.

The same test catches, for example: a `no consensus` chip that implies we failed to source an
estimate (it means the Street published none — say so), or a coverage/completeness meter that
implies gaps in work rather than in disclosure.

---


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
| **Setup** | *Upcoming quarter:* 4 **headline** metrics (mandatory, every company: **Revenue · Operating income · EPS · EBITDA**) + 4 **custom KPIs** (per-company, agreed with Dani), each with **Street** (Bloomberg) and **Summit** estimates behind a **Consensus ⇄ Summit ⇄ Both** toggle; caveat pop-ups (`cpQ`) on numbers with a trap; **the PREVIA — MANDATORY** (`marketDebate`): the one-picture read going into the print — *what the tape fears* vs *what consensus actually models* cards + mechanism chips + the **dark synth box** with "the one thing to resolve" (IBKR-style; it does NOT need Summit numbers — it frames the market's own tension); plus **the debate** = the Street-vs-Summit disparity (enabled, to-fill until Summit numbers exist). *Reported quarters:* the FROZEN pre-call view (what was priced in + the one-liner). |
| **Watch List** | 5 ranked items **per quarter** (hunting list seeded when the prior quarter closed; upcoming = themes with `since`+`thread`; reported = frozen contemporaneous). **Every item carries `tags`** (kebab-case themes: capex, cloud, search, monetization, promises, …). A **tag bar** at the top filters **ACROSS quarters**: selecting tags switches to a flat cross-quarter view (each card shows its quarter chip) — how the same hunt evolved print to print; clearing tags (or picking a quarter) returns to the per-quarter view. An **"+ Add theme"** control appends a new item in the same card format to the active quarter (session-only — persisting it = committing it into `CALL_PREP`). Promise-type items live here (silence is a signal). **Every item that exists because the prior call left it open carries `seededBy`**, rendered as `left open by Q1 2026` — or `⚑ red-line tripped in Q1 2026` when it descends from a broken thesis line. |
| **Post-Results** | **the red-line check FIRST** (it is the most falsifiable thing in the tab — tripped lines sort to the top, with a `⚑ n tripped` / `✓ all held` counter in the header) + **the scorecard**, ordered **biggest-surprise first, never release order**, each row carrying a `WATCH #n` badge when it was on the frozen list (blank otherwise — Rule D) and a **word-chip** for surprise (Rule H) + a `.cp-legend` above it (Rule L) + "what the numbers tee up for the call" + price reaction. |
| **Post-Call** | take + insight-first highlights **grouped into three action bands** (§6b) with an `open` chip on anything management left unanswered + the connect-the-dots line + **`threeMinutes` — the spoken deliverable** (§6c) with `notBringing` + `newQuestions` rendered with **where each one landed** (`became Q2 2026 Watch item #4`), closing the chain. |

**Dissolved:** the standalone Promise Tracker tab — its discipline lives inside the Watch-List
threads and the Earnings Calls themes' status chips. Never build it for new companies.

**Evolution ▸ Earnings Calls** — the standard multi-company contract (ibkr/uber/lyft/cart/ma/
rely/v): a `<TICKER>_THEMES` array (`{theme, why, updates:[{q, items:[...]}]}`) rendered with the
**By theme ⇄ By quarter** pill toggle and `lpb-acc` accordions — themes trace how each story
evolved; quarters show what mattered in a given call; entries are contemporaneous HIGHLIGHTS
(bold the key figures). **v2 enhancement:** each theme carries a status chip — `trend` (confirmed)
/ `promise` (a commitment to reconcile next call) / `watch` — absorbing the Promise Tracker.
**v2.2:** the status is an object carrying its **age**, rendered in words — `Promise — reconcile ·
unreconciled 3 quarters`, `Watch · silent 1 quarter`. A promise open one quarter and one open four
are not the same fact, and a silence that has run two quarters is louder than a fresh one; the
flat string could not carry that, so it was replaced.

## 6b. The three action bands — how highlights are grouped

The `tag` taxonomy (§2, Pass 3) says **what kind of signal** an item is. It does not say **what you
do with it in the meeting** — and that is the only question the reader has thirty seconds before
walking in. So `call.highlights[]` also carries `band`:

| `band` | Renders as | Means | Also carries |
|---|---|---|---|
| `lead` | ▲ Lead with this | Open with it: it moves the thesis **and** something is still unanswered | `open` — the specific unanswered thing |
| `context` | ● Context | Worth saying, but settled; there is nothing to argue | — |
| `logged` | ○ Logged | On the record for later; not meeting material | — |

**The assignment criterion — two independent axes, not one:**

> **impact on the thesis** (high / low) × **resolution** (answered / unanswered)

`lead` is the intersection of **high impact AND unanswered**. That conjunction is the whole point:
a confirmed thesis, however good the number, is *reportable, not debatable* — it goes to `context`.
An unanswered detail with no thesis consequence goes to `logged`.

**The scarcity rule — enforced, not advisory.** A band holding most of the items is not a ranking.
Target roughly **2–3 `lead` out of 8–9 highlights**; if `lead` exceeds ~⅓ of the list, the
assignment is wrong and must be redone.

**The regression case (v2.1, caught in review):** the first pass put 5 of 8 Q1'26 highlights in
`lead`, including *"Cloud's acceleration is contracted"* (+63%, backlog 2×) and *"Search +19% and
a new coverage claim."* Both were **confirmed by the print** — there is nothing to debate about a
thesis line that held — so both moved to `context`, leaving 3/4/1. The surviving `lead` items were
the ones where **management's answer did not match the size of the number**: TPU-sale margins
dodged, 2027 capex given as an adjective, a consumer KPI gone silent.

**The one-line test for `lead`:** *would a senior analyst interrupt to argue about this?* If the
answer is "no, they'd just nod," it is `context`.

`open` is not decoration — it is the sentence you would say next. Write the unresolved thing
itself ("Margin profile unanswered — Post pressed, got ROIC framing instead"), not a category.

## 6c. `threeMinutes` — the deliverable the whole tab exists to produce

Everything upstream is input. This is the output: **what you actually say out loud** if you get
one slot in the meeting.

- **3–4 bullets, spoken register.** Full sentences a person can read aloud without rewriting.
  Lead each with the conclusion in bold, then the evidence — never the reverse.
- **Every bullet must survive Rule 0**: fact → why → so-what. A bullet that restates a number is
  cut.
- **It is a synthesis of the `lead` band, not a copy of it.** If a bullet maps 1:1 onto a highlight
  headline, the work of composing the take has not been done.
- **`notBringing` is mandatory when anything notable was excluded** — `{item, why}`. It answers the
  question that actually gets asked in the room ("what about Waymo?") and proves the omission was
  a decision, not an oversight. Two to three entries.
- A **copy button** (`.cp-3m-copy`) lifts the numbered text out of the dashboard — the one thing in
  Call Prep designed to leave it.

**How to source it:** write it from the `lead` band plus the tripped red-lines, then check it
against `notBringing` — anything a reader would expect to hear and does not appear in the three
minutes belongs in one list or the other. Nothing notable may be silently absent.

## 6d. The chain — `newQuestions → seededBy`, visible from both ends

The claim that Call Prep is a **calibration record** is only true if the reader can trace it. Two
fields make it navigable, and both are mandatory once ≥2 quarters exist:

- On the **watch item**: `seededBy:{q, n, tripped?}` → renders `left open by Q1 2026`, or
  `⚑ red-line tripped in Q1 2026` when it descends from a broken thesis line. The full original
  question sits in the tooltip and at the top of the `why ›` pop-up.
- On the **prior quarter's `newQuestions`**: `{n, landed:{q, rank}, tripped?}` → renders
  `became Q2 2026 Watch item #4`, or `still open — not yet on a list` when nothing picked it up.

**The build criterion:** when rolling a quarter (§8 step 9), every `newQuestion` must be resolved
to exactly one of: it became a ranked watch item (record `landed`), or it is deliberately parked
(render `still open`). **A question that silently disappears is the same failure the Promise
Tracker existed to prevent** — the chain is the audit trail for our own attention, not just
management's.

A tripped red-line is the strongest possible seed: it did not merely go unanswered, it *broke*.
It carries `tripped:true` at both ends and should rank in the top half of the next Watch List.

---

## 7. Data model (essentials)

```js
var CALL_PREP = { ticker:'XXXX', quarters:[
  { q:'Qx 20xx', status:'upcoming', date:'…',
    setup:{ source, asOf,
      headline:[ {k:'Revenue',cons:{v,yoy,unit},us,note?}, {k:'Operating income',…},
                 {k:'EPS (diluted)',…}, {k:'EBITDA',…} ],
      custom:[ /* 4 per-company; k:null renders "to define" */ ],
      marketDebate:{ fear, real, mech:[{k,v,dir}], synth },  // the PREVIA — mandatory
      debate:null | { rows:[{k,street,us,why}], synth } },   // Summit-vs-Street, when it exists
    watchList:[ { rank, metric, since, tags:['capex','cloud',…], bbg, breaks, pista, why, src,
                  seededBy:{ q, n, tripped? },      // WHY this item is on the list (§6d)
                  thread:[{q,n},…] } /* ×5 */ ],
    results:null, call:null },
  { q:'Q(x−1)', status:'reported', date:'…',
    setup:{ source, pricedIn, oneLiner },          // FROZEN contemporaneous view
    watchList:[ /* the list as seeded at prior close — FROZEN */ ],
    results:{ headline,
              scorecard:[{ metric, cons, actual,
                           result,        // beat | miss | inline | nodisc | nocons  (§7b)
                           surprise,      // 0–100 EDITORIAL; sorts rows, renders as a WORD (Rule H)
                           watchRank?,    // n = it was item #n on the frozen list; omit ⇒ blank (Rule D)
                           note? }],
              thesisCheck:[{line,tripped,note}], intoCall:[…], priceReaction },
    call:{ take,
           highlights:[{ tag, band, open?, head, detail }],   // band: lead|context|logged (§6b)
           dots,
           threeMinutes:[ '…', '…', '…' ],                    // the spoken deliverable (§6c)
           notBringing:[{ item, why }],
           newQuestions:[{ n, landed:{q,rank}, tripped? }] } },  // closes the chain (§6d)
  // …older quarters, same shape, append-only
]};

// Evolution ▸ Earnings Calls — status now carries its age (§6, v2.2):
var <TICKER>_THEMES=[ { theme, why, st:{ k:'promise'|'trend'|'watch', since, last, silent? },
                        updates:[{q, items:[…]}] } ];
```

### 7b. Scorecard verdicts — five, not three

`beat` / `miss` / `inline` score a number against a published expectation. Two more exist because
forcing everything into those three destroys the most interesting rows:

| `result` | When | Why it is not a miss |
|---|---|---|
| `nodisc` | Management **stopped disclosing** a metric it used to give | Nothing was measured against consensus — the *silence* is the finding (§2, Pass 1.5) |
| `nocons` | The Street published **no estimate** for this line | An unmodelled number is an opportunity, not a failure — and never a comment on our coverage (Rule D) |

**The regression case:** v2.1 scored *"Gemini app MAU — NOT DISCLOSED"* as `miss`. It missed
nothing; management withheld a KPI after four straight quarters of giving it. Mislabelling it
`miss` buries the single most tradeable signal in the print under a routine verdict. Likewise a
capex guide that was **raised** did not "miss" a number — it reset the framework.

**The `surprise` field is editorial and must stay editorial.** It orders the rows and renders as
`big surprise` / `some surprise` / `as expected`. It never renders as a bar, a gauge or a
percentage (Rule H), and the legend says so on screen.

Render machinery to port verbatim from `googl.js` (swap data + brand only): `cpStyle`, `cpFmtC`,
`cpEvCell`, `cpQPills`/`cpQkey`, `cpSetupBody`, `cpWatchBody`, `cpWatchItem`, `cpResultsBody`,
`cpCallBody`, `callsBody`/`callsByQuarter`, `cpUpcoming`, `cpFill`, `cpQnum`/`cpStAge` (status
age, §6), `CP_RES` (five verdicts, §7b), `CP_HLTAG`, `CP_THST`, `CP_POP`/`cpReg`/`cpQ`,
`wireCallPrep` (phase tabs + estimates toggle + quarter pills + the `threeMinutes` copy button,
clipboard API with a `textarea`+`execCommand` fallback) and the `lpb-acc`/`calls-pill` wiring in
`init`. Note `wireCallPrep` is called from **`init`**, not `deepDiveInit`.

CSS classes that carry meaning (port with the functions): `.cp-legend`/`.cp-legend-i` (Rule L),
`.cp-sc-rk` + `.cp-sc-rk.blank` (Rule D), `.cp-sc-surp.hi/.md/.lo` (Rule H), `.cp-band*`,
`.cp-hl-open`, `.cp-3m*`/`.cp-nb*`, `.cp-seed`, `.cp-nq*`, `.calls-st-age`.

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
9. **After each print/call**: fill `results` then `call` (Rule 0), including **`band`+`open` on
   every highlight** (§6b), **`threeMinutes`+`notBringing`** (§6c), and `surprise`/`watchRank` on
   every scorecard row (§7b). Then ROLL: build the new upcoming quarter, and **close the chain** —
   every `newQuestion` of the quarter just filed gets a `landed:{q,rank}` or is explicitly left
   `still open`, and every new watch item gets its `seededBy` (§6d). Rotate the calls repo; update
   the themes view and bump each theme's `st.last` (and `st.since` if a status changed).

## 9. Self-audit checklist (report PASS/FAIL before finishing)

- [ ] ONE convention doc (this file) — no rules living elsewhere.
- [ ] Calls repo: `-latest` + compendium; rotation respected; append-only.
- [ ] Setup: exactly 4 headline + 4 customs; every rendered value traced to the Bloomberg export
      (`asOf`); YoY correct; Summit column renders (values or "to fill"); toggle works; caveat
      pop-ups on trap numbers; **the previa (`marketDebate`) rendered — fear/real cards, mech
      chips, dark synth box with the one-thing-to-resolve**; Summit debate enabled.
- [ ] Watch List: per quarter; upcoming = 5 themes with `since`+`tags`+`thread`+falsifiable
      `breaks`+a tell-that-is-a-read; reported quarters frozen contemporaneous; **tag bar filters
      across quarters** (flat view w/ quarter chips; clear/quarter-pick returns to per-quarter);
      **"+ Add theme" appends in the same format** (session-only); promises embedded (no
      standalone tab).
- [ ] Watch List items that descend from a prior call carry **`seededBy`**, rendered in words.
- [ ] **Post-Results:** red-line check renders **above** the scorecard with its tripped counter;
      scorecard sorted **biggest-surprise first**; every row has `surprise`; `watchRank` present
      where true and **blank (never a label) where not**; `nodisc`/`nocons` used instead of forcing
      a `miss`; legend above the table.
- [ ] **Post-Call:** every highlight has a `band`; **`lead` ≤ ~⅓ of the list** (recount if not);
      every `lead` item has an `open` that names the unresolved thing; band legend above.
- [ ] **`threeMinutes` written** (3–4 spoken bullets, Rule 0, synthesised not copied) +
      **`notBringing`** for anything notable excluded; copy button wired.
- [ ] ≥2 reported quarters backfilled end-to-end; **the chain closes in BOTH directions** — every
      `newQuestion` shows where it landed or reads *still open*, and its counterpart watch item
      names it; quarter pills toggle all four phases.
- [ ] Earnings Calls: By theme ⇄ By quarter toggle, `lpb-acc` accordions, status chips **with age
      in words**, contemporaneous highlights.
- [ ] Rule 0 everywhere; §4 regression tests pass.
- [ ] **Rule L — the cold-open test:** re-read every rendered chip, badge and abbreviation as
      someone seeing the tab for the first time with no explanation. Any bare symbol, any
      compressed token (`3q open`), any legend below the fold → FAIL.
- [ ] **Rule H:** no editorial value rendered as a bar/gauge/percentage; each one renders as a word
      and its legend discloses that it is our judgement.
- [ ] **Rule D — the empty-state test:** for every badge, state aloud what a partner concludes when
      it is ABSENT. Anything worse than "not applicable" → redesign the empty state as blank +
      a neutral legend line.
- [ ] `node --check` clean · `&amp;` = 0 · no orphan identifiers · localhost renders.
- [ ] Committed on a feature branch; Dani opens PRs; San/Oscar merge. Flag anything unsourced.
