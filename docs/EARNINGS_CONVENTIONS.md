# Earnings — THE complete convention (build + call interpretation, v2.10 · Jul 2026)

**This is the single source of truth for everything earnings-call related**: how calls are
ANALYZED (the rules, the detection protocol, the regression tests), how they are STORED (the
calls repository + rotation), and how the Earnings section is BUILT (inputs, steps, data model,
UI contract, checklist). There is no other context document — if a rule about calls exists, it
lives here.

**The contract:** Dani hands over **(a) a ticker, (b) its earnings-call transcripts, (c) the
Bloomberg numbers export, and optionally (d) SPLC / Summit expectations** — and a fresh session,
with no other context, builds everything from ONE prompt: **"arma el Earnings de \<TICKER\>"**
(or refreshes with "integra el nuevo call de \<TICKER\>"). If a step is ambiguous, fix THIS doc.

**Reference implementations:** `js/overviews/googl.js` is canonical for **v2.7** (the three-phase
tab — Post-Call dissolved, call highlights folded into Post-Results — the `WL_ROWS` Watch-List
table, §6f, and the stripped Setup); `js/overviews/ibkr.js` is canonical for **v2.4** and
still carries the nested `watchList` shape. Copy the Setup / Post-Results / Post-Call machinery from
either — they are identical there — but take the **Watch List from `googl.js`**. `ibkr.js` was
migrated from v1 (standalone Promise Tracker, single-estimate setup, no quarter selector) to the full
v2.2 machinery **and** the v2.3 fusion on 2026-07-24. Each overview file owns its own copy of the
Earnings renderers, so v2.5/v2.6 landing on GOOGL changed nothing for the other companies.

**What v2.10 changed — the AI call summary, the tag-less aside, and the Setup chart's margins + windows:**

1. **Post-Results: the black one-line "take" is replaced by an AI-generated CALL SUMMARY ("the minute").**
   `results.headline` (the dark `.ce-take` box) is gone. In its place, `results.summary` renders a
   **collapsible box whose title is always shown** ("🧠 Call summary — the minute", AI-generated tag).
   Its body is an **always-visible lede** (prose) + **nested dropdowns (dropdowns within dropdowns)** that
   let the reader open the *whys* per category (top line → drivers → segments → backlog …) — inline
   `<details>`, **not** pop-ups. An **Expand-all / Collapse-all** control toggles only the inner nodes
   (never the lede). Technical terms are wrapped `<span class="ce-gl" data-def="…">term</span>` and show
   their definition on **hover** (a styled CSS tooltip, not a pop-up). **It is a SUMMARY, not a re-run of
   the whole call** — no roll-call of every exec; no min/max length, but it summarises, it does not
   transcribe. It may restate the red-line themes (tripped/held) in prose. Renderer: `ceSummaryBlock` /
   `ceSumNodes`, data model `results.summary = { intro, nodes:[{t, body, nodes:[…]}] }` (see §6c-ii).

2. **"Also on the call" drops the tag chips.** No more `tone` / `curious` / `connects-dots` / … labels on
   each point — a point is just **the theme and its dropdown** (§6b). The `tag` still exists in the data
   for authoring, it just does not render.

3. **The Setup chart's margins and period windows are fixed (§6a-viii-bis).** Two corrections after
   review: (a) **margin lines now render on a RIGHT (second) axis.** A `%` margin plotted on the same
   axis as `$B`/`$M` is a flat invisible line at zero — the engine already puts margins on `y2`, but the
   GOOGL dataset had `marginOf` pointing at a group name instead of the revenue key, so no margin was ever
   computed. **Only PROFIT lines carry a margin** — revenue, a segment-revenue line, a backlog or a plain
   KPI have none, and the engine draws none for them (do not force one). (b) The Setup windows are now the
   agreed narrow ones: **quarterly SEASONAL** (forecast quarter across prior years + the one next quarter)
   and **annual = history + next 2 FY** — enforced in `googl-setup.js` by slicing the periods.

**What v2.9 changed — the Post-Results aside becomes a list, and Evolution adopts the Results engine:**

1. **"Also on the call" is now a single LIST box, not cards.** The supplemental aside was disliked as
   a set of banded cards. It is now **one box holding a plain list**, each point a native `<details>`
   dropdown (headline on the row, evidence behind the caret). The **`context` / `logged` band
   classification is REMOVED entirely** — no triage strip, no band colours. A thesis-mover (`lead`)
   still routes to the Watch List and is not rendered here. Renderer: `ceHighlightsBlock` → `.ce-alsobox`.

2. **Evolution adopts the shared Results engine (from `main`, PR #63 · AMZN pilot).** GOOGL's Evolution
   row is now **`Earnings · Results · Estimates · Guidance · Strategy · Timeline`** (matching Amazon,
   whose "Call Prep" = our "Earnings"). **Results** and **Estimates** are the generic engine
   `js/results.js` (see `docs/RESULTS_CONVENTIONS.md`), embedded via `resultsHtml('GOOGL')` /
   `resultsEvoHtml('GOOGL')` and init'd lazily on visibility. **`GOOGL` is registered in `RESULTS_DATA`**
   with `js/results-data/googl.js` **reconstructed from the rolling `BBG_CONSENSUS.txt` archive** (Street
   `cons` + reported `act`; **`summit` null everywhere for now — pending the Summit estimate-visibility
   work**; no guidance). So GOOGL's **Results** tab renders the full Amazon-style chart+table today;
   **Estimates** shows a pending note until a vintage/Summit block exists. **This is the go-forward
   Evolution row for every standardized company.**

3. **The Setup chart adopts the Amazon chart+table FORMAT — merged into ONE chart (§6a-viii-bis).**
   The Setup's own chart replicates Amazon's Results chart-with-integrated-table (the good one in Top
   Line): grouped metric picker, clickable legend chips, period-wise hover, range controls, and the
   Fiscal.ai-style transposed table beneath. **Amazon splits it into TWO charts (Top Line vs Margins &
   Profitability); Setup keeps ONE** — the two formats are CLUBBED so every tracked indicator lives in
   a single chart+table, with margin-type controls **disabled for lines they do not apply to** (e.g.
   revenue has no margin). Period selection is deliberately narrow (§6a-viii-bis): **quarterly is
   SEASONAL** — the same fiscal quarter across prior years (forecasting Q3 2026 → Q3 2025, Q3 2024, …)
   **plus only the ONE next quarter** (never two quarters out — only the immediately-next is
   statistically meaningful); **annual shows the next 2 FY** forward. Both Street (Bloomberg) and
   Summit series (Summit is empty for many lines, populated only where a forecast exists).

**What v2.8 changed — Post-Results grows two toggles, the aside is demoted, and the fill is ONE step:**

1. **The supplemental aside is renamed and visually demoted.** The Post-Results "Call highlights"
   block is now **"Also on the call"**, wrapped in a de-emphasized `.ce-suppl` aside (dashed border,
   muted background, a `supplemental` pill). Same formatting as the scorecard implied the same
   importance — it is not: the meeting-critical read is the **scorecard** and the **Watch List**; this
   is just colour worth a mention. The name dropped "highlights" for the same reason (it read as *the
   things to raise at the meeting*, which it is not).

2. **Post-Results gains a `vs Street ⇄ vs Summit` toggle (no "Both").** The print can now be scored
   against **either** frozen expectation — Bloomberg consensus **or** Summit's own — swapping the
   expected value, the surprise, the verdict and the verdict-filter. One basis at a time (unlike the
   Setup's three-way, Post-Results has no "Both" — you are reading an outcome, not surveying
   estimates). Summit's frozen numbers come from the quarter's `setup.us`; where Summit had none, the
   line reads `no est.` in Summit view.

3. **Post-Results gains a `Margin` toggle — expected-implied → realized (NOT YoY/QoQ).** GP / Operating
   income / EBITDA carry a margin row that is **expectation vs outcome for the quarter**: the
   **estimate-implied** margin (the estimate's metric ÷ its own revenue — Street or Summit, following
   the ev toggle) → the **realized** margin (actual ÷ actual), with the Δ in pts. Margin is the ONE
   place with no YoY/QoQ, because there is nothing to compare across time — you are comparing what was
   expected for the quarter to what the quarter did. **This REVERSES the v2.x "never show a
   consensus-implied margin" rule (§6a-iii)** — we now show it, with the basis caveat as a *disclosure*
   (a `?` pop-up) rather than a suppression, the same way we surface revenue's ~20% offset instead of
   hiding it.

4. **ONE fill per quarter, and the next quarter opens for prep but NOT for Post-Results.** The old
   two-step (fill Post-Results when the numbers land, then fill Post-Call after the transcript) is
   collapsed: there is a **single fill** that lands the **results + the call together**. The moment a
   quarter is filled, **Setup and the Watch List advance to the following quarter** (so prep can
   begin), but **Post-Results does NOT** — it only ever shows quarters that have actually been filled
   (§6a-ix). See the workflow (§8) and the gating (§6a-ix).

**What v2.7 changed — the Post-Call tab is dissolved, and highlights become talking points:** the
tab had FOUR phases (Setup · Watch List · Post-Results · Post-Call); it now has **three**. The
standalone **Post-Call phase is gone**, and the one piece of it that readers actually wanted — the
**call highlights** — moved **into Post-Results**, below the scorecard, under a *"Call highlights"*
header. Post-Results' scorecard format is **unchanged** (the reader liked it); the highlights are
simply appended to the same phase, so a reported quarter is now read in one place: the print, then
what management said. **Why kill the tab:** everything else Post-Call carried was redundant with the
Watch List — `take`, `threeMinutes` (the spoken deliverable), `notBringing` and `newQuestions` are
**no longer rendered** (they survive in the data as authoring notes; `newQuestions` still seeds the
next Watch List). The Watch List is the tracking layer; the highlights are talking points, and there
is no longer a second post-mortem tab competing with it. **The knock-on rule change (§2, Pass 3):**
because the highlights are now *talking points* and not the tracking layer, they are allowed to be
**broader** — a highlight no longer has to be the most thesis-relevant or the most trackable to earn
a slot. Some deliberately-non-trackable **call colour** (a backlog figure, a capex number, a user
count) belongs here precisely because it is worth *saying* even though it would never earn a Watch
slot. It still obeys Rule 0 — but its "so-what" may be *"worth mentioning"* rather than *"moves the
thesis."* **The flip side (v2.7.1):** the highlights render **only the `context` and `logged`
bands** — the `lead` "moves-the-thesis" band is **dropped from Post-Results entirely**. A
thesis-mover is a *tracked* item, and the tracking layer is the Watch List; showing it in Post-Results
too was the redundancy we cut. So `ceHighlightsBlock` filters `lead` out and the two surviving bands
are both non-thesis by design. Live on **GOOGL** (canonical for v2.7); other companies keep the four-phase shape until
their next cycle. `ceCallBody` is replaced by `ceHighlightsBlock(cc, qk)`, called from
`ceResultsBody`.

**What v2.6 changed:** the Watch List got cut back to the four things that are actually ours.
`why` is renamed **`definition`** — what the theme *means*, in our words — and it now renders on the
card instead of hiding in a pop-up. Three columns were **dropped entirely**: `tell` (the 🔎 standing
read), `trigger` (the validate/invalidate condition) and `cons` (the Street line). They were the
model's voice wearing our clothes; the text survives in git history and in `docs/calls/<TICKER>.md`,
which is where it came from. The cards also **stopped being numbered** — a visible 1–5 goes stale the
instant a theme is removed, and renumbering the survivors implies a re-ranking nobody did. `rank`
lives on as a pure sort key. And the table's **"refresh" button is gone**: it could never do anything
(the table already rebuilds on every edit), so it only ever read as broken. In its place is a live
counter — `20 rows · 5 open hooks · live` — which *does* move, and is the actual proof the table
tracked the edit. Knock-on: the Post-Results scorecard badge went from `WATCH #4` to `ON THE LIST`,
because the number it pointed at no longer exists on any card; which theme it was is now the tooltip.

**What v2.5 changed, and why (read §6f before touching a Watch List):** the Watch List had drifted
into being **an LLM output**, and it is the one place in the tab that must not be. Post-Results and
Post-Call are extraction — the model is good at that and keeps free rein. The hunt list is
*judgement*, and it has to be able to say **"the model missed this"** and **"that isn't actually
relevant."** So the Watch List became **our table** (§6f): a flat `WL_ROWS` array with explicit
columns, authored from the portal (add / edit / delete, tag dropdown + inline tag creation), with
`trigger` replacing "Breaks if…" as an *optional* validate/invalidate condition and a
`trackSince` / `trackUntil` hook window that defines the live list (open hooks only). Durable
persistence needs Supabase — **pending assignment**; today the loop is portal → table → COPY →
hardcode. Also retired in the **Setup**: the "in one picture" fear/consensus pair, the mechanism
chips, and the gray placeholder — the debate box alone carries what the print has to resolve.
Live on **GOOGL**; the other companies keep the v2.4 shape until their next cycle.

**What v2.4 added:** IR / Investor-Day events as a first-class entry type (§6e) — a non-earnings,
guidance-based block that gets the same Earnings treatment as a call (Watch List = themes,
Post-Results = the published materials/slides, Post-Call = the transcript), except Setup has no
Consensus/Summit toggle (nothing to forecast) and shows a disclaimer instead.

**What v2.3 added, and why — THE FUSION (read this before building any company):** the tab had TWO
places talking about the same call highlights — the standalone **Evolution ▸ Earnings Calls** tab
(the `<TICKER>_THEMES` "By theme ⇄ By quarter" compendium) and the **Earnings Watch List** (which
already tracks themes across quarters via its tag bar). That redundancy is now gone. **The Watch
List is the single home for theme-tracking.** The `<TICKER>_THEMES` compendium is not deleted —
nothing is lost — it is **folded in below the Watch List** ("The theme record") inside the Earnings
pane. The standalone **Earnings Calls sub-tab is removed** from the Evolution sub-tab row. This is
the go-forward standard: it applies to **every new company**, and to **every existing company that
already had an Earnings Calls tab** (GOOGL and IBKR were retrofitted on 2026-07-24 — same removal +
fold-in). See §6 for exactly where it renders.

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

**Two destinations — the tracking layer vs. the talking points (v2.7).** Selection now feeds **two
different lists**, and they are not the same bar:

1. **The Watch List — the tracking layer.** The trackable, thesis-weight themes, curated by us and
   followed across quarters (§6f). This is where the *`cut without mercy`* discipline bites hardest:
   only what is worth *tracking* earns a slot. **Every thesis-mover goes HERE** — an item that
   moves the thesis and is still unresolved (a `lead`-class highlight) is a Watch List hook, full
   stop; it is **not** shown in the Post-Results highlights.
2. **Post-Results ▸ "Also on the call" — the supplemental colour.** What is worth *taking into the
   conversation* but is **not** a thesis-mover and **not** meeting-critical (a demoted `.ce-suppl`
   aside, v2.8). Only the **`context`** (settled, worth mentioning)
   and **`logged`** (call colour, on the record) bands render here — **never `lead`** (that is
   tracking, → destination 1). This list is deliberately **broader** than the Watch List: a highlight
   here does **not** have to be trackable. Some **non-trackable call colour** — a backlog figure, a
   capex number, a user count management called out — belongs here *precisely because it is worth
   saying out loud*, even though it would never earn a Watch slot. It lands in **`logged`** (§6b).

**What does NOT relax: Rule 0.** A talking-point highlight still obeys the So-What chain
(fact → why → so-what) — the only thing that loosens is *what the "so-what" is allowed to be*: here
it may be **"worth mentioning"** rather than **"moves the thesis."** A bare restatement with no
driver ("DARTs +35%") is still cut everywhere — the relaxation is about thesis-weight and
trackability, **never** about skipping the WHY. The `cut without mercy` list above (boilerplate,
congratulatory chatter, "everyone already has it") still applies to both destinations.

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

**Test #6 — over-classifying `lead` (§6b).** 5 of 8 highlights tagged `lead`, including two theses
the print had *confirmed*. A confirmed thesis is settled → `context`, not `lead`. **Under v2.7 this
matters more, not less:** `lead` items are no longer rendered in Post-Results — they are **routed to
the Watch List** — so mis-tagging a settled item `lead` deletes it from the highlights AND wrongly
opens a Watch hook. Recount, and move anything settled to `context` (a rendered talking point).

---

# PART II — HOW THE EARNINGS IS BUILT

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
  the words: `ON THE LIST`, `left open by Q1 2026`, `became a Q2 2026 Watch item`.
- **Compressed jargon.** `3q open` is not a label; `unreconciled 3 quarters` is.
- **Legends buried at the bottom.** If a section uses any chip or badge, a `.ce-legend` block sits
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

**The fix, and the general form:** the cell renders **blank** (`.ce-sc-rk.blank` — no chip, no
dashed border, no tooltip), and the legend states the neutral reading explicitly: *"A blank here
just means the line was not one of those five — every line below is covered."*

**The rule, generalised — the asymmetric-badge principle:**

> A badge may assert a **positive** fact about our work (`ON THE LIST` = we flagged this as contested
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
| SPLC | Bloomberg SPLC export — feeds the DEEP DIVE, not Earnings | Downloads |

1. **Consensus = Bloomberg ONLY** (web estimates are color, never a source of record; never
   hardcoded).
2. **Hardcode only the values that render.** No hidden series committed.
3. **Summit estimates are never invented** — absent → "to fill".
4. **Append-only per quarter** — pre-call blocks freeze when the quarter opens.

## 6. UI structure

Evolution's sub-tab row (v2.3): `Earnings · Guidance · Strategy · Timeline`
(Earnings is a **sub-tab of Evolution**, never a spine tab; it is the **first/active** sub-tab).
**There is NO standalone "Earnings Calls" sub-tab** — it was dissolved in v2.3 and its theme
compendium folded into the Earnings Watch List (see "the theme record" below).

**Earnings pane** = **THE IR BUTTON (mandatory, first element)** + intro note + **QUARTER SELECTOR**

**The source buttons (IR + EDGAR):** every company's Earnings opens with TWO deliberately loud,
banner-style buttons side by side (`ceIRButton()` in the reference implementation), both
`target="_blank"`:
- **OPEN IR** (`CE_IR_URL`; GOOGL → `https://abc.xyz/investor/`) — the company's curated lens:
  release, webcast, slides, transcripts.
- **OPEN EDGAR** (`CE_EDGAR_URL`; GOOGL → `https://www.sec.gov/edgar/browse/?CIK=1652044&owner=exclude`) —
  the regulator's lens: 10-K/10-Q/8-K/DEF 14A as filed. Per company, swap the CIK in the EDGAR
  browse URL.

**Per-company URLs on file (swap these two constants per ticker):**

| Ticker | `CE_IR_URL` | `CE_EDGAR_URL` (CIK) |
|---|---|---|
| GOOGL | `https://abc.xyz/investor/` | `…?CIK=1652044&owner=exclude` |
| IBKR | `https://investors.interactivebrokers.com/en/general/about/quarterly-earnings.php` | `…?CIK=1381197&owner=exclude` |

IBKR's IR card carries IBKR's real mark from the portal logo CDN (`https://assets.parqet.com/logos/symbol/IBKR`,
CSP-allowed) and uses IBKR brand red as its accent; the EDGAR card carries the SEC seal (federal gold),
same as every company.
Purpose: on earnings day both optics must be ONE tap away — what IR curates, EDGAR certifies. The
buttons must out-compete "go google it yourself." Swap only URLs and the company name per ticker.
**Identity, not decoration (mandatory):** no emoji/generic icons on these cards. The IR card
carries the **company's real mark, transparent-background version** (GOOGL → the official Google
"G" from gstatic, CSP-allowed; per ticker prefer an official transparent mark, else
`https://assets.parqet.com/logos/symbol/<TICKER>`); the EDGAR card carries the **official SEC
eagle seal** (`img/sec-seal.png`, public domain, served locally). Both marks get the SAME
treatment: transparent emblem inside a glowing ring (no white tiles), plus the same mark repeated
as a giant low-opacity watermark bleeding off the bottom-right corner. Big banners (≥120px tall,
72px emblem). Near-black backgrounds; the EDGAR card uses the seal's federal gold (accent bar,
glow, CTA), the IR card uses the company's brand accent. Per ticker, swap only the mark and URLs. (pill per quarter, newest/upcoming first,
active by default) + **three phase tabs** (v2.7): Setup · Watch List · Post-Results. (Post-Call was
dissolved into Post-Results — see the changelog and the Post-Results row below.) Every
phase renders **per-quarter blocks** (`.ce-qblock[data-ceq]`) and the quarter pills toggle them —
one quarter visible at a time, so the page stays light as quarters accumulate. Each quarter keeps
its frozen pre-call blocks NEXT TO its post-mortem (the calibration record).

| Phase | Content per quarter |
|---|---|
| **Setup** | *Upcoming quarter:* 4 **headline** metrics (mandatory, every company: **Revenue · Operating income · EPS · EBITDA**) + 4 **custom KPIs** (per-company, agreed with Dani), each with **Street** (Bloomberg) and **Summit** estimates behind a **Consensus ⇄ Summit ⇄ Both** toggle; caveat pop-ups (`ceQ`) on numbers with a trap; then **the debate** — what it establishes going in: the Street-vs-Summit disparity rows when both estimate sets exist, and the **dark synth box** carrying *the one thing to resolve*. **(v2.5 — retired)** the "setup, in one picture" pair (*what the tape fears* / *what consensus actually models*), the mechanism chips, and the gray to-fill placeholder under the debate heading are **gone**. The previa is no longer a separate block: the debate box IS the going-in read. *Reported quarters:* the FROZEN pre-call view (what was priced in + the one-liner). |
| **Watch List** | **v2.6 — the list is OURS, and it is a table (§6f).** Post-Results and Post-Call let the model run; the Watch List does not. We decide what earns a slot and what the model failed to detect. Rows live in a flat **`WL_ROWS`** table, not nested per quarter, and each carries only what is ours: `theme` · `tags[]` · **`definition`** (required — what the theme *means*, in our words; renders on the card) · **`trackSince` / `trackUntil`** (the hook window — *empty `trackUntil` means still open*). The **live quarter's list is exactly the open hooks**; we open and close them by hand. **Cards are NOT numbered** — `rank` is sort order only, so removing a theme never leaves a stale 1–5. A **tag bar** filters **ACROSS quarters** (flat view, quarter chip per card); a **tracking-window segment** (All · Open hooks · Closed) filters by hook state. **"+ Add theme"** opens a form that picks tags from the existing vocabulary **and creates new ones inline** — a new tag is appended to the filter bar, available to every theme from then on. Cards on the live quarter carry **✎ edit / ✕ delete** (edit is how a hook gets closed: fill *Tracking until*); frozen quarters are read-only history. Below the cards sits **the table** — the storage view, with a live counter and COPY / copy-JSON (§6f). Promise-type items live here (silence is a signal). **`seededBy`** renders as `left open by Q2 2026` — or `⚑ thesis line broke in Q2 2026`. **v2.3 — the fused theme record:** below everything, the Watch List phase renders **"The theme record"** — the full `<TICKER>_THEMES` compendium (By theme ⇄ By quarter, status chips with age), under a labelled divider. This is the former standalone *Earnings Calls* tab, folded in so there is ONE home for theme-tracking (nothing lost). |
| **Post-Results** | **The print, then what management said — one phase (v2.7).** Numbers first: **the red-line check FIRST** (it is the most falsifiable thing in the tab — tripped lines sort to the top, with a `⚑ n tripped` / `✓ all held` counter in the header) + **the scorecard**, ordered **biggest-surprise first, never release order**, each row carrying an `ON THE LIST` badge when it was on the frozen Watch List, with the theme named in its tooltip (blank otherwise — Rule D; v2.6 dropped the `#n`, which pointed at a rank the cards no longer show) and a **word-chip** for surprise (Rule H) + a `.ce-legend` above it (Rule L) + "what the numbers tee up for the call". **Two toggles on the scorecard (v2.8):** `vs Street ⇄ vs Summit` re-scores the print against either frozen expectation (no "Both"); `Margin` shows the GP/OpInc/EBITDA expected-implied → realized margin (no YoY/QoQ) — see §6a-iii. **Then, below the scorecard, the *"Also on the call"* aside (v2.8 rename; was the Post-Call tab dissolved into "Call highlights" in v2.7):** a **de-emphasized `.ce-suppl` block** (dashed, muted, a `supplemental` pill — deliberately NOT the scorecard's formatting, so it never reads as equally important), holding insight-first colour in **two bands only — `context` + `logged`** (§6b), with an optional `open` chip on anything left unanswered. **The `lead` (thesis-mover) band is NOT rendered here** — a thesis-mover is tracked, and the tracking layer is the Watch List, so `lead` items are filtered out and routed there instead. This is deliberately **not** the tracking layer, so the net is **broader**: it keeps non-trackable **call colour** (a backlog figure, a capex number, a user count) that would never earn a Watch slot but is still worth saying (§2, Pass 3). Rendered by `ceHighlightsBlock(cc, qk)` — only `context` + `logged`. **Dropped from the UI (survive only as authoring data):** `take`, `threeMinutes`, `notBringing`, and `newQuestions` — `newQuestions` still seeds the next Watch List; the rest were redundant with the Watch List. |

**Dissolved (never build these as standalone tabs for any company):**
- the **Promise Tracker** tab — its discipline lives inside the Watch-List threads and the theme
  record's status chips.
- **(v2.3)** the **Earnings Calls** tab — its theme compendium is folded into the Watch List (below).
  Two tabs on the same call highlights is the redundancy v2.3 removed. Existing companies that had
  the tab (GOOGL, IBKR) were retrofitted; new companies never get it.
- **(v2.7)** the **Post-Call** phase — its **call highlights** folded into **Post-Results** (below
  the scorecard, as *talking points*). `take` / `threeMinutes` / `notBringing` / `newQuestions` are
  no longer rendered (data-only; `newQuestions` still seeds the next Watch List). GOOGL is canonical;
  other companies keep the four-phase shape until their next cycle.

**The theme record** (was **Evolution ▸ Earnings Calls**; now rendered INSIDE the Earnings Watch
List phase, §6 above) — the standard multi-company contract (ibkr/uber/lyft/cart/ma/rely/v/googl):
a `<TICKER>_THEMES` array (`{theme, st:{k,since,last,silent?}, why, updates:[{q, items:[...]}]}`)
rendered with the **By theme ⇄ By quarter** pill toggle and `lpb-acc` accordions — themes trace how
each story evolved; quarters show what mattered in a given call; entries are contemporaneous
HIGHLIGHTS (bold the key figures). **v2 enhancement:** each theme carries a status chip — `trend`
(confirmed) / `promise` (a commitment to reconcile next call) / `watch` — absorbing the Promise
Tracker. **v2.2:** the status is an object carrying its **age**, rendered in words — `Promise —
reconcile · unreconciled 3 quarters`, `Watch · silent 1 quarter`. A promise open one quarter and
one open four are not the same fact, and a silence that has run two quarters is louder than a fresh
one; the flat string could not carry that, so it was replaced. **v2.3:** the array is unchanged —
only its render location moved (from a standalone tab to under the Watch List).

## 6a. Where the consensus comes from — `BBG_CONSENSUS.txt`

**`G:\My Drive\Summit\Docs\0\BBG_CONSENSUS.txt`** is the single consensus source for Earnings.
It is never committed to the repo — we read it, hardcode what we need, and cite the snapshot date.

A tab-separated file, **152 columns**, **one row per (ticker, `data_as_of`)**. It is an **archive
that accumulates**: each export appends snapshots, so over time it holds many securities seen from
many points in time. Read it directly — it is a flat TSV of a few dozen KB, no library needed.

**It is a ROLLING consensus.** Every row is that security as it looked on one date:

- `fq0` = the most recent **reported** quarter at that date. `fy0` = the most recent reported FY.
- `fq-3`, `fq0`, `fy0` are **always historical actuals**. Everything else is estimate.
- `fq+1` = the next quarter, `fq+2` the one after, and so on. `fy+1`… likewise.
- Every period column carries its own label (`2026 Q3 (Fwd)`), and the labels roll with the row.

So a single snapshot never holds a company's full history — but **the same security across its
snapshots does**. Walk `fq0` down the rows and you have the actuals series; walk `fq+1` and you have
what the Street expected going into each of those quarters.

**Sanity-check the labels on load.** Assert `fq+N == fq0 + N quarters` and `fq-3 == fq0 − 3` for
every row before using the file. It is a two-line check and it is the difference between reading a
quarter and mis-reading one. (The GOOGL load passes: 12 snapshots × 5 period columns, 0 mismatches.)

| columns | contents |
|---|---|
| `ticker` | Bloomberg form, e.g. `GOOGL US EQUITY` |
| `metric1`…`metric4` | the **4 headline** definitions, 5 fields each: `metricN` · `codeN` (the BBG field) · `segmentN` · `unitN` · `scaleN` |
| `metric_kpi1`…`metric_kpi4` | the **4 custom KPI** definitions, same 5-field shape |
| `fq-3`…`fy+5` | the period **labels** for the 12 period columns |
| `rev_*` · `opinc_*` · `ebitda_*` · `eps_*` | the values for the 4 headline metrics × 12 periods |
| `kpi1_*`…`kpi4_*` | the values for the 4 custom KPIs × 12 periods |
| `data_as_of` · `time` · `submit` | the snapshot's vantage date, export timestamp, submit flag |

**Read `metricN` / `metric_kpiN` — the NAME — to know what a column is.** `segmentN` is a Bloomberg
lookup code (`SEG0000344781 Segment`); it is what the terminal needs to fetch the line, not
something you need to decode. The name already tells you.

**`scaleN` is authoritative**, and it is per-metric: `M` means millions (divide by 1,000 for `$B`
cells), **empty means units** — which today is EPS, and tomorrow could be a percentage or a count.
Never assume the scale from the metric name.

**`close_*` is not a metric — it is the period's END DATE.** The file carries a 14th value block
with no `metricN` definition: `close_fq0`, `close_fq+1`, … hold the calendar close of each period
(`close_fq+1` = `9/30/2026` when `fq+1` = `2026 Q3`). Two uses:

- **A second, independent integrity check.** Assert every `close_fqN` equals the quarter-end of the
  period `fqN` names. The GOOGL load passes: 12 snapshots × 6 quarter columns, 0 mismatches. Run it
  alongside the `fq+N == fq0 + N` check — they can fail independently.
- Real dates for an axis, where a chart needs them instead of `Q3 2026`.

Because dates are legitimate *here*, a date is only a missing-value marker in a **metric value**
column. Do not blanket-reject dates file-wide.

**Missing values are normal and expected — and the file says "missing" in FOUR different ways.**
All four mean the same thing: *there is no number here.* None is an error, none needs chasing, and
**none should be reported as a data problem.**

| what you see | what it is |
|---|---|
| blank | no value |
| `Error 2042` / `#N/A` | the terminal returned nothing |
| **a date** in a metric value column (`6/1/1834`, `2/17/1924`) | Excel rendered a missing number as a serial date |
| **a near-zero placeholder** (`3.3e-06`) | the metric has no forward estimate at all |

Parse all four to `null`. Concretely: in a **metric value** column reject anything containing `/`
or `:`, and — where `scaleN` is `M` — reject any magnitude below `0.001` (a line scaled in millions
cannot legitimately be a fraction of a dollar). Then **leave the cell empty**. Do not interpolate,
do not substitute a nearby period, do not flag it as corruption.

**⚠ THE CORRUPTION MOVES BETWEEN EXPORTS. Never hardcode where it is.** In the first Jul-2026 load
it sat on `capex_fq-3` in all 12 rows; in the next load capex was clean and it had moved to
`kpi4_fq-3` **and** `kpi4_fq0` — the *actuals* columns, which silently took Cloud operating income
from scoreable to unscoreable. Derive the flags on every reload; never carry them forward by hand.

A metric can therefore be missing in two distinct directions, and they mean different things:

| flag | condition | consequence |
|---|---|---|
| `nocons` | no forward estimate anywhere | actuals only — renders "—" and a **no est.** badge, no growth chip. Kept because the actual can still be the story (GOOGL Q2 2026: OCF $39.1B against $44.9B capex is the negative-FCF quarter) |
| `noact` | forward estimates exist, actuals do not | nothing to score against yet; no verdict in Post-Results until the actual returns |

**THE METRIC SET IS THE FILE'S, NOT OURS.** When the export changes shape, the Setup grid and
`CE_CONS` change with it — never the reverse. The Jul-2026 load went from 4 headline metrics to
**9 headline + 4 custom**, and three things moved that a careless reload would have silently broken:

- **capex left the KPI slots and became a headline under a DIFFERENT Bloomberg field** —
  `HEADLINE_CAPEX`, not `CF_PURCHASE_OF_FIXED_PROD_ASSETS`. The two do not agree (Q3 2026 went
  $54.6B → $54.3B; the historical mean gap vs actuals moved +4.7% → +10.2%). **A field swap is a
  break in the series, not a revision** — say so in the cell's pop-up rather than letting the
  history look continuous.
- **`kpi4` changed meaning entirely** (capex → Cloud operating income). Custom KPIs are positional;
  never assume slot N still holds what it held last quarter.
- **units are no longer uniform.** `shares outstanding` carries `unitN` = *empty* with `scaleN` = `M`
  — a **count**, not money. It must never render with a dollar sign. Read `unitN` and `scaleN`
  together, per metric, every time.

**Rules when filling from it:**
- **Cash-flow fields come through negative.** `CF_PURCHASE_OF_FIXED_PROD_ASSETS` (capex) is an
  outflow, so the archive carries it as a negative. Show the positive magnitude — that is how the
  guide is quoted — and note the flip.
- **The customs come from the archive's own `kpi1`–`kpi4`**, not from a previous draft. If the KPI
  set changed, the Setup's custom set changes with it.
- **Cross-check a segment KPI against a reported actual** before trusting it. A `segmentN` code
  silently pointing at the wrong line is the easiest error to ship here, and the name alone will not
  catch it.
- **YoY comes from `fq-3`, never from a forward column.** `fq-3` is the quarter three before `fq0`,
  i.e. exactly four before `fq+1`, and it is a **reported actual**. Never derive a YoY from rounded
  prose in a transcript ("our first-ever $100 billion quarter") — that is fake precision (§4b), and
  it is wrong: the actual was $102.3B.
- **NEVER do arithmetic across the lines of a row. This is the trap.** Every cell is a mean over a
  **different set of contributors** — some analysts submit only a total, others break the quarter out
  by segment — so the lines do not share a denominator. Consequences, all of them counter-intuitive
  the first time:
  - the total is **not** the sum of the parts (Search + Cloud need not fit inside revenue);
  - a margin computed by dividing one cell into another is **not a number anybody forecast**;
  - a quarterly line and an annual line for the same metric come from different samples too, so a
    "compounding balance that goes down" is a sampling artifact, not an error.

  None of that means the data is broken. **Dani's ruling, verbatim:** *"no se supone realmente que
  debas sumar o restar esos valores, no te dirá nada realmente."* Read each line against **its own**
  history and its own reported actual — revenue vs the revenue print, Cloud vs the Cloud print — and
  never against its siblings. A thin sample (a KPI with one or two contributors) is worth a
  **caveat pop-up** saying so; a failure to cross-foot is not, because it was never supposed to foot.
  This paragraph exists because the first build of this section got it backwards and shipped a
  scary "this does not reconcile" warning on a perfectly good revenue cell.

> **Naming (Jul 2026):** the tab is **Earnings** (was "Call Prep"). Internally the data const is
> `CALL_EARNINGS`, functions are `ce*`, CSS classes `ce-*`, the subpane `data-ovst="earnings"`.
> The former name must not appear anywhere else — label, identifier, class, or doc.

### 6a-i. What the archive is FOR — the rolling read

**USE EVERY OBSERVATION. Never sample the archive down.** The whole reason the file accumulates is
that a single pull cannot show a track record. If a chart is crowded, give the reader a **range
control** that narrows the visible window — never quietly plot a subset. A GOOGL load of 12
snapshots yields **19 quarters** (Q4 2022 → Q2 2027, of which 15 have actuals and 12 have a
1-quarter-out consensus) and **9 fiscal years** (FY2022 → FY2030). Anything less is throwing away
the evidence.

**The archive has two axes, and both are usable.**

| lens | actuals from | consensus from | what it answers |
|---|---|---|---|
| **Quarterly** | `fq0` / `fq-3` | `fq+1`…`fq+4` | how well is the next quarter modelled, and how does the estimate move as it approaches |
| **Annual** | `fy0` | `fy+1`…`fy+5` | how has the Street revised a full year over time — the long-horizon picture |

The annual view is **not** a rollup of the quarterly one. Bloomberg's FY consensus is its own mean
over its own contributor set, so four quarters do not sum to the year. Never cross-foot between
them (same rule as across the lines of a row).

**Scoring is simple: `actual / consensus − 1`.** For each quarter take the last consensus before
the print (`fq+1`) and the reported actual (a later snapshot's `fq0`), and that is the surprise.
Every metric that has both sides is scored — including revenue. There is **no basis test, no
standard-deviation gate, no "is this line allowed"** step. The snapshots already hold both numbers;
extracting the percentage is the whole job.

**Revenue runs ~20% above the forward line — and that is fine, we show it.** Across eleven quarters
the print landed persistently above the forward consensus. That is an **FX + gross-vs-net**
difference between how the Street quotes the forward line and how Alphabet reports — a level offset,
not a run of huge beats. We surface it as a real surprise (it is what the file says) with a note
explaining the offset. We do **not** suppress it, colour it amber, or withhold its growth chips. An
earlier build gated revenue out on a standard-deviation argument; that was over-engineering — the
reader is better served by the number plus one sentence of context.

**What the record actually says** — worth carrying into any GOOGL earnings prep: once a number is
**guided**, the Street converges hard on it (capex, once guided, prints within ~3%); Search is
modelled tightly; but **Cloud has been under-modelled ~10–14% for three straight quarters**, and
backlog swings wide. That asymmetry is the setup — the argument is never the guided line.

### 6a-ii. What this renders as — the Setup tab

The archive feeds **Pre-Call ▸ Setup** (the grid and the charts) and **Post-Results** (the frozen
Street number, §6a-iii). Two layers, in this order:

**1 · The per-quarter grid — BUILT FROM THE ARCHIVE, not hand-authored.** The consensus, the YoY and
the QoQ all come from `CE_CONS`, so the cells can never drift out of sync with the file. What stays
hand-authored per quarter is only `setup.us` (Summit's own number) and `setup.notes` (the caveat
pop-ups), **both keyed by metric name** — so a metric-set change never orphans a note silently.

- The grid renders **all of them**: 9 headline + 4 custom in the Jul-2026 shape. Headline and custom
  keep separate rows; the split comes from `CE_CONS.nHead`, not from a hardcoded count.
- Every quarter's `source` must name the archive and its snapshot date: *"Bloomberg (BST) —
  BBG_CONSENSUS.txt snapshot archive"* + `asOf`. No other consensus source appears in Earnings.
- A reported quarter keeps **both** its reconstructed grid *and* its frozen pre-call prose
  (`pricedIn` / `oneLiner`), under *"written before the print, never rewritten."*
- A line that fails the basis test renders **no growth chip at all**, dims, and carries a pop-up.
- A `nocons` line renders "—" plus a small **no est.** badge.

**The growth lens: YoY ⇄ QoQ ⇄ Off.** This is what `fq-3` is *for*. Both `fq-3` and `fq0` are
reported actuals, so the same consensus cell can be read against either base:

| lens | base | column |
|---|---|---|
| **YoY** | the actual four quarters earlier | `fq-3` |
| **QoQ** | the actual one quarter earlier | `fq0` |
| **Off** | — | for reading levels without the noise |

**Margins (headline EXCEPTION).** Gross profit, Operating income and EBITDA also carry a **margin**
= the metric ÷ revenue, behind a **Margin** toggle in the estimates bar (default off). No other
metric gets one.

**Layout: the margin is its OWN row inside the cell — never appended inline.** An inline chip
overflowed the box and was cut off. Instead, on Margin-on, a dedicated row shows a small **`margin`**
label and the value with the base-period margin in parentheses:

> `margin  61.5% (prev 60.1%)`

The value is the **Street (consensus) margin** (the line the growth chips are about). The `(prev …%)`
is the margin of the period the growth chip compares against, and **swaps with the lens**: YoY → the
same quarter a year ago, QoQ → the prior quarter, Off → no parens. Base margin = base-period metric
÷ base-period revenue, both reported actuals (`m.qy`/`m.qq` ÷ revenue's `qy`/`qq`). It must **fit
the box** — a compact row, tabular figures, one line.

Where a QoQ is arithmetically true but analytically useless, say so in the pop-up rather than
suppressing it: GOOGL Q3 2026 EPS reads −67% QoQ purely because Q2 carried $99B of one-off
securities gains.

**2 · The track-record chart was REMOVED (Jul 2026) — do not re-add it.** The "Street's track
record — what the archive can show" surprise chart is gone; the Setup now carries only the grid
and the annual chart (§6a-viii). `CE_CONS` stays — it is the data spine of the Post-Results print
block (§6a-iii), and still holds **every observation**:

| field | shape | contents |
|---|---|---|
| `q` | labels | 19 quarters, Q4 2022 → Q2 2027 |
| `qr` | quarter × 4 | the consensus at 4q / 3q / 2q / 1q out |
| `qa` | quarter | the print |
| `qy` / `qq` | quarter | the YoY base · the QoQ base (both actuals) |
| `nHead` | int | how many of `m[]` are headline metrics |
| `t` | flag | `ok` · `noact` · `nocons` (no `basis`/`noisy` — a scoreable line is just scored) |

| `t` | meaning (drives the Post-Results verdict) |
|---|---|
| `ok` | forward estimate + a reported actual → scored beat/miss/in-line |
| `nocons` | no forward estimate anywhere → shown as a print, no verdict |
| `noact` | forward estimate but no reported actual (came through as dates) → no verdict yet; scoreable again once the actual returns (the corruption moves between exports) |

**Flags are assigned by data availability on reload — not by hand, and not by a std-dev test.**
Charts that ever tried to gate on standard deviation, plot a revision trend, or show a convergence
table were all removed — every line with both sides is simply scored (§6a-iii).

### 6a-iii. "Frozen" — what it means, and where the archive replaces prose

**Frozen** means the expectation is the one that actually stood **going in**, and is **never
rewritten** once the print lands. That is the entire point of the three-phase split: ① Pre-Call is
sealed at call time, ② Post-Results scores against it, ③ Post-Call adds what management said. A
frozen block edited after the fact destroys the only thing the tab is for — a record of how well we
read the company.

The weak spot was *what* got frozen. `scorecard[].cons` was hand-written prose — *"high-teens growth
modeled"* — which is a **recollection**, not a record, and it drifts. The archive fixes this:

> **Post-Results is ONE block — `cePrintBlock`, the archive spine + hand-authored notes.** There is
> no longer a separate "frozen strip" and a separate hand-authored "scorecard" saying the same
> thing twice. The archive gives every number and every surprise (consensus `fq+1` → print `fq0`);
> the hand-authored layer contributes only what a number cannot — a per-metric note
> (`results.notes[metric]`) and the frozen-Watch-List rank (`results.watch[metric]`). Tiles are
> **ranked by |surprise|**, carry a verdict chip, and show growth under the shared YoY/QoQ lens.

- **`vs Street ⇄ vs Summit` — score the print against either frozen expectation (v2.8).** The default
  is Street (Bloomberg). Toggling to Summit re-scores every tile against **Summit's own frozen
  number** (`setup.us[metric]`), swapping the expected value, the surprise, the verdict **and** the
  verdict-filter (the tile carries both verdicts as `data-vdc` / `data-vdu`, and the filter is
  estimate-view-aware in pure CSS). **No "Both"** — Post-Results reads one outcome at a time, unlike
  the Setup's three-way survey. Where Summit had no number for a line, Summit view reads `no est.`
  (the frozen `setup.us` map is authored per metric; many custom KPIs legitimately have none).
- **Margin, where available (GP / Op income / EBITDA) — a toggle, expected → realized (v2.8).**
  GP / Operating income / EBITDA tiles carry a **Margin** toggle (off by default). On, each shows a
  margin row that is **expectation vs outcome for the quarter**, NOT a time comparison:
  - **Expected** = the margin *implied by the estimate* — the estimate's metric ÷ the estimate's
    **own** revenue (Street = BBG ÷ BBG, Summit = ours ÷ ours; it follows the `vs Street ⇄ vs Summit`
    toggle). Same-estimate on both sides, so it is internally consistent.
  - **Realized** = the print's own margin (actual ÷ actual). Same-basis, the honest outcome.
  - We show the two and the **Δ in pts**. **There is NO YoY/QoQ on the margin** — there is nothing to
    compare across time; you are comparing what was expected *for this quarter* against what it did.

  **This REVERSES the pre-v2.8 rule** ("never show a consensus-implied margin; realized must stand
  alone"). We now show the expected-implied margin — but the old concern is real and becomes a
  **disclosure, not a suppression**: the Street's forward revenue runs materially *below* the print
  (FX + gross-vs-net), so the Street-implied margin sits **above** realized by construction. A
  negative Δ is therefore *partly a revenue-basis offset, not a pure margin miss* — say exactly that
  in the tile's `?` pop-up (the same way we surface, never hide, revenue's ~20% offset). The Summit
  side does not have this offset when Summit's own revenue is used as the denominator.
- **Every scoreable metric shows a real surprise**, revenue included (its ~20% offset is FX /
  gross-vs-net, explained in the tile's note — not suppressed). Each tile carries a verdict chip
  (beat / miss / in-line), and a **beat / miss / in-line filter** narrows the grid.
- **Only the standardized metrics are scored.** A bespoke row that is not one of the archive metrics
  — an old "funding flip" card, a disclosure with no consensus like an app-MAU rung — is **not** a
  scored line. It belongs in the "Also on the call" aside, sourced from the transcript. `result:'beat'`
  still requires a consensus to beat (§6a-vii).
- The strip renders only for quarters the archive covers; it is silently absent otherwise.

### 6a-iv. Density — the anti-wall rules for every phase

Post-Results and Post-Call were rebuilt twice (Jul 2026) because they kept becoming walls of text.
These rules apply to **every** company, and to pop-ups everywhere in the profile:

**Structure**
- **Boxes and grids, not stacked prose.** The scorecard and the call highlights render as **cards in
  a 2-column grid** — metric / expected / printed / verdict, or tag / one line. Depth goes in the
  pop-up behind a `＋ detail` affordance.
- **Progressive disclosure by default.** Secondary blocks (thesis red-line check, "what this tees
  up", price reaction, connect-the-dots, new questions, "not bringing") are **folded**, each with a
  one-line summary in its header so the reader knows whether to open it.
- **Open a fold only when it earns it.** The thesis red-line check opens by itself **only if
  something tripped**.
- **Both highlight bands render visible (v2.7).** `context` and `logged` both start on under the
  triage strip, each with a count in its band button; the filter narrows, it does not hide by default.
  (There is no `lead` band in Post-Results — thesis-movers are routed to the Watch List; §6b.)
- Keep the lede to **one sentence**. If a table needs a legend, the table is wrong — delete both.
- **A tab switch must not scroll the page.** Hiding a tall pane and showing a shorter one makes the
  browser clamp `scrollTop`, so the page appears to jump to the top. Wrap every tab / sub-tab /
  phase-tab switch in `ceKeepPos(clickedEl, fn)`: measure the control's viewport position, run the
  change, then `scrollBy` the delta so the control stays put.

**Pop-ups — enforced in the renderer, not by asking authors nicely**
> `ceReg()` runs every pop-up body through **`ceProse()`** at registration time. First sentence
> becomes a set-apart **lead**; every remaining sentence becomes a **bullet**; a paragraph opening
> `<b>Label:</b>` keeps its label as a labelled row. Bodies that already carry `<ul>`/`<li>` are
> left exactly as authored.

This was retrofitted because an audit found **81 of 81** authored bodies were flowing `<p>` prose
with zero bullets, the worst at 136 words. After the transform: 83 of 94 carry bullets and the
longest surviving paragraph is 45 words. Doing it at registration means the next author cannot
forget the rule, and old content is fixed too. It is text-preserving — no words are dropped.

**Three minutes — the deliverable, and the part people actually read out loud**
- It renders **directly under the take, above the highlight bands**. A reader who stops after one
  screen still leaves with the thing they say.
- **Boxes, one per theme — TITLE ONLY by default.** Each item is a numbered card whose whole face
  is the claim (`<b>…</b>`, ≤12 words). The evidence lives behind a native `<details>` **“＋ ver
  más”** and is revealed on demand — never shown up front. A three-minutes list you can scan in
  three seconds; the argument is there if someone challenges a line. Copy still exports claim +
  evidence (it reads the spans, not the summary).
- Punch means the *consequence*, not the datapoint: "They chose dilution over slowing down" beats
  "Third capex raise in five months, FCF negative, $49.6B equity, buybacks zero" — which is the
  evidence line underneath it, not the claim.

### 6a-v. Controls, defaults and inputs

**Defaults must be both APPLIED and VISIBLY SELECTED.** A control whose default state is only in the
markup drifts the moment anything re-renders, and a highlighted-but-not-applied toggle reads as
broken. Set defaults in the markup *and* re-assert them when wiring:

| control | default | shows |
|---|---|---|
| Consensus ⇄ Summit ⇄ Both | **Consensus** | the Street column |
| YoY ⇄ QoQ ⇄ Off | **YoY** | growth against `fq-3` |

YoY is the default everywhere the lens appears — Setup grid *and* the Post-Results print block —
and one control drives both, so moving between phases never re-orients the reader.

**Pop-ups must be cross-checked after ANY rename or refactor — a broken pop-up is silent.** Every
expander (`＋ detail`, `why ＋`, `the ask`, the thread/background link, the Setup `?` note) works by
a `data-detail="KIND:id"` attribute that a single `resolve()` switch reads by `KIND`. Two ways
this breaks, both silent (the click just does nothing):
- **Prefix ≠ resolver kind.** A rename that rewrites the registration prefix (`ce:`) must rewrite
  the resolver's `kind===` check too — AND catch **both quote forms**: `'ce:` *and* `"ce:` (an
  attribute built inside a single-quoted string is `"ce:`). The Jul-2026 rename missed the
  double-quote form and every pop-up died; the fix was six `data-detail="cp:` → `"ce:`.
- **id not registered.** `ceReg(id,…)` must run for every id a `data-detail` points at.

Verify by rendering the profile and asserting **every** `data-detail` value resolves to a non-null
pop-up (replicate `resolve()` over the exported maps). Do this on every change that touches the
pop-up plumbing — it is a two-line test and the alternative is a dead expander nobody notices.

**One language, cross-checked.** The UI is **English**. No mixed-language strings — a Spanish
`ver más` next to English `＋ detail` is a bug. After any edit, grep the rendered output for stray
non-English UI words (`ver más`, `más`, `atrás`, `cerrar`, …) and for the pattern that let it in
(a copy-pasted label, a translated placeholder). Keep it to one language everywhere the reader looks.

**Cross-check every toggle handler against the OTHER toggles that share its styling.** Segmented
controls reuse the `.ce-gseg` pill class, so a handler that does `querySelectorAll('.ce-gseg
button')` will silently clear the active state of a *different* toggle in the same box. Scope by
the toggle's own data attribute (`.ce-gseg button[data-ceg]`, `[data-cemm]`, …), and assert each
toggle's default at wire time independently. This shipped once as a margin toggle that rendered
deselected because the growth-lens init cleared it.

**The annual chart's metric selector offers Revenue / Operating income / EBITDA only** (§6a-viii) —
the three lines wired on both the BBG and Summit sides. The Setup grid still carries all 13.

**Any field whose value is one of a known short list is a `<select>`, never free text.** The Watch
List's *Tracking since* / *Tracking until* were text inputs, so `Q3 26` / `3Q2026` / `Q3-2026` all
silently broke the open/closed filter and the cross-quarter sort. Both are now dropdowns generated
from **Q1 2024 through the quarter Earnings is currently on**, derived from `CALL_EARNINGS` so the range
advances by itself.

**A table is a VIEW of the data, never the storage.** The Watch List table is **hidden by default**
(the storage view is not what a reader wants first) and expands on *show table*. COPY works whether
it is shown or not — because COPY serialises `WL_ROWS`, not the rendered rows. Any export that reads
the DOM is a bug waiting for someone to collapse a section.

### 6a-vi. Post-Results — what each block must look like (numbers + call highlights; v2.7)

**Thesis red-lines.** One-word verdict (`TRIPPED` / `HELD`), then the red-line **itself** in plain
language, then the reasoning behind a *why ＋*. The scannable column is the verdict; the line must be
self-explanatory on its own. **No metaphors, no in-jokes** — "Another raise without proof, or FCF
negative while debt keeps rising" is a red-line; "the bill comes due" is not. If a reader needs the
pop-up to know what the line *means*, the line is written wrong.

**What this tees up for the call.** Short boxes, **visible** — never folded. Folding it was hiding
the thing you walk into the call with; the fix is to shorten it, not to bury it. Hook on the card,
the argument behind *＋ the ask*.

**Highlights: one triage strip, both bands visible (v2.7).** `Context` / `Logged` render as two
colour-coded buttons carrying a count and a one-line meaning, above a single card grid where every
card wears its band colour. Clicking a band filters its cards out. Both start **on** — the reader
triages by looking, and the filter is for narrowing, not for hiding by default. Do not give each band
its own collapsed section; that made the reader hunt. (There is **no `Lead with this` band** — a
thesis-mover is tracked, so it is routed to the Watch List, not rendered here; §6b.)

**Connect-the-dots is not a section.** Anything that connects across themes becomes a Watch item via
`newQuestions` → the next quarter's list. Saying it twice made the phase longer without making it
more useful. The field stays in the data as authoring notes.

**Never number the same list twice.** Three-minutes items are ordered by the list itself; a numbered
badge next to them was the same information rendered again.

**One-line headline and take.** `results.headline` and `call.take` are a single sentence each. The
evidence lives in the tiles above and the cards below; restating it at the top was the largest text
block in either phase.

### 6a-vii. Sourcing a scorecard row — and what "beat" is allowed to mean

Every number in `results.scorecard[]` comes from the release, the transcript in `docs/calls/`, or
the archive. **The open web is not a source for a financial metric** (§6a golden rule), and neither
is inference.

**`result:'beat'` requires a consensus to beat.** If `cons` is a question rather than a number —
*"the skipped rung: a number, or a second silence?"* — the row is `nocons`, not `beat`. This shipped
wrong once: GOOGL Q2 2026's Gemini app MAU was scored `beat` when the watch had never been a level,
only whether the company would disclose at all. The 950M itself was correctly sourced from the
transcript; the **verdict** was the error.

| `result` | means |
|---|---|
| `beat` / `miss` / `inline` | there WAS a Street number, and the print landed above / below / on it |
| `nocons` | nobody modelled it — the news is the disclosure, not the level |
| `nodisc` | management stopped giving a number it used to give |

`nocons` and `nodisc` are not soft misses. They are their own findings, and mislabelling either as a
beat inflates the scorecard.

### 6a-viii. The annual picture — a second Setup chart

Below the grid, Setup carries an **annual** chart (`ceAnnualBody` / `gBuildCeAnnual`, data in
`CE_ANNUAL`): how the full fiscal year has looked, and what the Street vs Summit expect for the
years still open. Three series per metric:

- **Reported** — FY actuals from the archive (`fy0`), the history bars/line.
- **Street (BBG)** — the consensus for the open FYs, from our `BBG_CONSENSUS.txt` (`fy+N`). We do
  **not** read the BBG row inside the DCF — the archive is our Street source.
- **Summit** — our own forecast, from the DCF (see §6a-x), plotted only on the forward years.

Rules:
- **Metrics: Revenue, Operating income, EBITDA** for now (the three wired both sides). Add a metric
  only once both its BBG and Summit numbers exist; if either is missing, leave it out.
- **Guidance is a third series when the company gives it.** If the company issues numeric FY
  guidance, add it; if not, **show the “no company guidance” disclaimer** and plot only two. GOOGL
  gives none, so the chart is Reported + BBG + Summit.
- **Bars ⇄ Lines** toggle; metric selector.
- **Annual only for now.** The quarter matters — the intended toggle is “show only the quarter being
  forecasted across prior years” (Q3 2026 → Q3 2023/24/25), to cut noise. **This is now the target
  design — see §6a-viii-bis, which supersedes this note:** the Setup chart is being rebuilt in
  Amazon's chart+table format with exactly that seasonal quarterly view.

### 6a-viii-bis. The Setup chart — replicate Amazon's chart+table, MERGED into ONE (v2.9)

**Target (superseding §6a-viii's two-series bars):** the Setup chart replicates the **Amazon Results
chart-with-integrated-table** — the good one in Deep Dive ▸ Evolution ▸ Results, Top Line block
(engine `js/results.js`, spec `docs/RESULTS_CONVENTIONS.md` §3). Same look-and-feel and the same
**conventions worked out on the Amazon tables** — they are the standard; do not reinvent them:

- **Grouped metric `<select>`** (optgroups Totals / Segments / …), **clickable legend chips** (each
  toggles its series: Actual/Reported · Summit · Consensus · Guidance band · margin line),
  **period-wise hover** (one tooltip per period, every visible series with its surprise), **range
  controls** (preset pills + drag-to-zoom + the dual-handle slider), and the **Fiscal.ai-style
  transposed table** beneath (periods as columns oldest→newest, shaded **E** columns, sticky header +
  metric column + a sticky right **"Range record"** column; row structure value → growth → surprise →
  margin). Reading is **actual-centric** (▲/green = the print beat the estimate).

**The ONE-CHART rule (the Setup-specific divergence).** Amazon splits the view into **TWO** charts —
*Top Line* (revenue, sales, segment revenues, other KPIs) and *Margins & Profitability* (op income,
EBITDA, EPS, capex, segment op income; margin % lines on a right axis). **In Setup we keep ONE
chart+table.** Club the two formats so **every tracked indicator coexists in a single chart+table**:

- One merged metric picker lists them all (Totals · Segments · Profitability · …).
- **Margin-type controls are per-metric and DISABLE where they do not apply** — a revenue/segment-
  revenue line has no margin, so the margin toggle/right-axis is greyed for it; a profit line (op
  income/EBITDA) enables the margin-over-revenue line. (This mirrors the existing per-metric
  `CE_MARGIN_ON` idea and the Post-Results margin toggle, §6a-iii.)
- Units that differ (a $B revenue line vs an EPS line vs a % margin) never share one axis silently —
  switch the axis with the metric, exactly as the Amazon engine does per block.

**Period selection — deliberately NARROW (this is the point).** Do NOT plot the whole timeline.

| lens | what shows |
|---|---|
| **Quarterly (SEASONAL)** | the **same fiscal quarter across prior years** — forecasting **Q3 2026** → **Q3 2025, Q3 2024, Q3 2023, …** (reported actuals) **plus only the ONE next quarter** being forecast (Q3 2026, Street + Summit). **Never two quarters out** (no Q3 2027 as well) — only the immediately-next quarter is statistically meaningful. |
| **Annual** | FY history **plus the next 2 FY** forward (Street + Summit). |

**Both estimate series, always: Street (Bloomberg) + Summit.** Summit is **empty for many lines** and
is populated **only where a forecast exists** (the lines we actually model) — render the Summit series
sparse, never invent it (§5 golden rules; consensus = Bloomberg only). The chart is fed from the
`CE_CONS` archive (Street + actuals) and the Summit projection export (Summit forward).

**Status: BUILT (v2.9) — it REUSES the Results engine.** The first cut was bespoke and fell short (no
period lever, no sticky Fiscal.ai table, margins as a value-swap not lines). It was replaced with the
**actual `js/results.js` engine**, rendered inside Earnings ▸ Setup via a dedicated **`GOOGL_SETUP`**
dataset (`js/results-data/googl-setup.js`) that clubs Top Line + Margins into **ONE merged section**
(section key `setup`). So the Setup chart is now IDENTICAL to the Results tab in look and behaviour —
grouped picker over every line, clickable legend chips, period-wise hover, the range **lever** (preset
pills + drag + dual-handle slider), and **margin lines** for the profit lines (revenue/segment lines
have no `marginOf`, so the engine shows none — "disabled where it does not apply") — just merged into
one chart+table instead of two.

**Multi-instance:** the engine was single-instance (`_rs`); it was made to coexist with the Results tab
by (a) a **unique section key** per instance (Setup=`setup`, Results=`top`/`margins`) so their
canvases/tables/sliders never collide, (b) scoping `wireResults`'s `#rsBlocks`/`#rsGrowMode`/`#rsViewNote`
lookups to the wrap, and (c) `initResults(wrap, ticker)` optional args to re-establish the right dataset
and wire the right wrap. Amazon's no-arg `initResults()` is unchanged. `googl.js` keeps the names
`ceAnnualBody` (returns `resultsHtml('GOOGL_SETUP')`) / `gBuildCeAnnual` (calls `initResults(setupWrap,
'GOOGL_SETUP')`) as the Setup entry points.

**Period windows — DONE (v2.10), enforced in the dataset.** `googl-setup.js` slices every metric's
parallel arrays to the agreed windows, so the engine plots exactly those periods:
- **Quarterly is SEASONAL** — the forecast quarter across prior years + the ONE next quarter
  (`seasonalIdx`: forecast quarter = first period with no revenue actual; keep every period with the same
  quarter number, e.g. `3Q23 · 3Q24 · 3Q25 · 3Q26`). Column-to-column is therefore year-over-year.
- **Annual = reported history + the next 2 FY only** (`annualIdx`: through `lastActual + 2`). Not the whole
  forward run.

**Margins — RIGHT axis, PROFIT lines only (v2.10).** A `%` margin on the same axis as `$B`/`$M` is an
invisible flat line — margins must render on a **second (right) `y2` axis**, which the engine does whenever
a metric has a `marginOf`. **Only profit lines carry a margin** (gross profit / operating income / EBITDA →
`marginOf:'rev'`; segment op income → `marginOf:'cloud'`). **Revenue, segment-revenue, a backlog, a plain
KPI carry NO margin** — leave `marginOf` unset so the engine draws none. (The first GOOGL dataset shipped a
generator off-by-one that set `marginOf` to the *group name*, so no margin ever computed and the double
axis never appeared — the fix was pointing `marginOf` at the revenue key.)

### 6a-ix. The quarter belongs to the section, not the other way round

The **three** phase tabs (v2.7) sit **above** the quarter pills (the section is chosen first, then
the quarter within it). Each phase decides which quarters it offers — not a single global selector:

| phase | quarters offered |
|---|---|
| Setup · Watch List | every quarter, incl. the upcoming one |
| Post-Results | only quarters with a `results` block |

The upcoming quarter has no results, so **it does not exist in Post-Results** — that data does not
exist yet. Each pill carries `data-ceqhas` (the phases it is valid for); switching phase hides the
invalid pills and, if the active quarter just became invalid, snaps to the most-recent valid one.
(v2.7: there is no longer a `postcall` phase — `ceQPhases` returns `['setup','watch','results']`;
the call highlights render inside the Post-Results pane, so they need no phase of their own.)

The Watch List carries a one-line hint of this cadence above the theme filter, so the rule is
visible where the prep happens.

**Adding the upcoming quarter is gated — and it is ONE fill now (v2.8).** There is a **single fill**
per quarter: the **results and the call land together** (no separate "score the numbers now, add the
transcript later" step — that two-step died with the Post-Call tab). The moment Q(n) is filled:

- **Setup and the Watch List advance to Q(n+1)** — the upcoming quarter is added to
  `CALL_EARNINGS.quarters` (status `upcoming`, no `results` block) so prep can begin.
- **Post-Results does NOT advance** — Q(n+1) has no `results`, so `ceQPhases` keeps it out of
  Post-Results. Post-Results only ever shows quarters that have actually been filled.

So the cycle is: **fill Q(n) once (results + call) → Q(n+1) opens in Setup / Watch List only.** Never
seed an upcoming quarter before the one before it is filled, and never expect a quarter in
Post-Results before its single fill has landed.

### 6a-x. Consulting a company profile when there is no MCP

Some data (Summit's own forecast) lives in the analyst's DCF, not in an API. **Eventually the team
will specify how to consult a company profile** (an MCP, most likely); until then, read the DCF
workbook directly. For GOOGL:

`G:\My Drive\Summit\Docs\Research\DCF\Technology - SAB\GOOGL\DCF GOOGL - New.xlsm`, tab
**`Projection History`** (openpyxl, `data_only=True`).

- **A1 is empty.** The header row (`Code · metric · segment · unit · scale · source · … · years …`)
  is at the top; the SAME headers **repeat lower down** (row ~70–71), and the blocks **below that
  second header are the historical snapshots** — that is what matters.
- **Read Summit's forecast from the most-recent annual snapshot** (the first block below the second
  header). Ignore its `… (BBG)` rows — the Street comes from our `.txt`. Columns are fiscal years;
  take the forward FY you are charting.
- **If a value does not exist, ignore it** — do not invent, do not substitute. GOOGL currently has
  **Revenue, EBITDA and Operating income** wired on both sides; those three are what the annual
  chart shows.
- **The quarter matters and is not wired yet.** Summit quarterly columns are empty today; when they
  are cabled, extract the quarterly forecast the same way and enable the quarter view (§6a-viii).

## 6b. The action bands — how highlights are grouped (v2.7: two rendered, one routed away)
The `tag` taxonomy (§2, Pass 3) says **what kind of signal** an item is. It does not say **what you
do with it in the meeting** — and that is the only question the reader has thirty seconds before
walking in. So `call.highlights[]` also carries `band`:

| `band` | Renders as | Means | Also carries |
|---|---|---|---|
| `lead` | **NOT rendered in Post-Results (v2.7)** — routed to the Watch List | It moves the thesis **and** something is still unanswered → it is a thesis-mover, so it is *tracked*, and the tracking layer is the Watch List, not the highlights | `open` — the unanswered thing (carry it onto the Watch item) |
| `context` | ● Context | Worth saying, but settled; there is nothing to argue | `open` (optional) |
| `logged` | ○ Logged | On the record; call colour, not meeting-critical | `open` (optional) |

**Why `lead` leaves the highlights (v2.7).** Post-Results ▸ Call highlights are **talking points**,
not the tracking layer. A `lead` item is by definition a thesis-mover that is still unresolved — that
is *exactly* what the Watch List exists to track across quarters. Rendering it a second time in
Post-Results is the redundancy we removed. So `ceHighlightsBlock` renders **only `context` and
`logged`**; a highlight classified `lead` is **filtered out** and must instead be opened (or updated)
as a **Watch List hook**. The two surviving bands are both non-thesis by construction — settled colour
worth mentioning, and call colour on the record.

**The assignment criterion — two independent axes, not one:**

> **impact on the thesis** (high / low) × **resolution** (answered / unanswered)

`lead` is the intersection of **high impact AND unanswered** → route to the Watch List. A confirmed
thesis, however good the number, is *reportable, not debatable* → `context`. An unanswered detail
with no thesis consequence → `logged`. Non-trackable call colour (a backlog figure, a capex number, a
user count) → `logged`, precisely the kind of talking point the Watch List would never carry.

**The one-line test:** *would a senior analyst interrupt to argue about this?* If yes, it is a
thesis-mover — it belongs on the **Watch List**, not in the highlights. If "no, they'd just nod," it
is `context` (settled) or `logged` (colour).

**The regression lesson (v2.1) still holds, now as a routing rule:** a first pass once put 5 of 8
Q1'26 highlights in `lead`, including *"Cloud's acceleration is contracted"* and *"Search +19%"* —
both **confirmed by the print**, so both are `context` (nothing to debate), not `lead`. Under v2.7
the genuine `lead` items (answer not matching the size of the number: TPU-sale margins dodged, 2027
capex given as an adjective, a consumer KPI gone silent) would be **Watch List hooks**, not rendered
highlights. If a quarter produces zero `context`/`logged` items, the Call highlights section is
simply absent — that is fine, it means everything worth saying was a thesis-mover already tracked.

`open` is not decoration — it is the sentence you would say next. Write the unresolved thing
itself ("Margin profile unanswered — Post pressed, got ROIC framing instead"), not a category.

## 6c-ii. `results.summary` — the AI call summary ("the minute", v2.10)

The Post-Results black one-line take is gone; in its place a **collapsible AI-generated summary of the
call**. **The summary IS THE PROSE** — several always-visible PARAGRAPHS, each landing a punch on a
specific theme — and EACH paragraph carries its own "＋ more" to go deeper. It is **NOT** one generalist
paragraph followed by a list of collapsed titles. Rendered by `ceSummaryBlock` / `ceSumMore` / `ceSumNodes`
from:

```js
results.summary = {
  paras: [
    { p: 'always-visible paragraph (HTML) — a PUNCH on one theme (top line / the bill / EPS / …)',
      moreLabel: '＋ more — …',                 // optional; default '＋ more — the detail behind this'
      more: {                                    // optional deeper detail behind the ＋more dropdown
        body: 'deeper prose (HTML)',
        nodes: [                                 // optional context-guide dropdowns WITHIN the ＋more
          { t: 'Cloud — the engine', body: '…', nodes: [ { t:'Backlog', body:'…' } ] }  // nesting ok
        ]
      } },
    { p: '…next punch paragraph…', more: '…' },  // `more` may also be a plain HTML string
    …
  ]
}
```

**Rules:**
- **The summary is written as PROSE, several paragraphs.** Each `p` is a real paragraph that makes a point
  and stands on its own — the reader gets the whole story by *reading the paragraphs*, top to bottom. The
  "＋ more" is only for the reader who wants to go deeper on that specific point.
- **The box is collapsible from outside, but its TITLE is always visible** — "🧠 Call summary — the
  minute" + an `AI-generated` tag. Default open.
- **The paragraphs (`p`) are ALWAYS visible** — Expand-all / Collapse-all toggles only the `＋ more`
  dropdowns, never the paragraphs.
- **`more` / `nodes` are nested `<details>`, NOT pop-ups.** The reader opens `＋ more` for the detail behind
  a paragraph, and can drill deeper (dropdowns within dropdowns — drivers → segments → backlog). Depth is
  colour-cued (`data-d` 0/1/2) but unlimited.
- **Glossary terms** — wrap a technical concept `<span class="ce-gl" data-def="the definition">term</span>`.
  It renders with a dashed underline and shows the definition on **hover** in a styled tooltip (CSS-only,
  not a pop-up). Use it wherever a term deserves context ("constant-currency", "RPO / backlog", "free cash
  flow", "TPU systems", "marks", …).
- **It is a SUMMARY, not a transcript.** No minimum or maximum length — but it distils; it does **not**
  re-run the whole call, and it does **not** hand out dedications to each member of management. It may
  restate the tripped/held red-line themes in prose (that overlap is fine — it is the narrative version).
- Rule 0 still applies inside it: every claim carries its *why* / *so-what*, not bare numbers.

## 6c. `threeMinutes` — the spoken deliverable (v2.7: DATA-ONLY, no longer rendered)

> **v2.7 status:** the Post-Call tab was dissolved and `threeMinutes` (with `take`, `notBringing`,
> `newQuestions`) is **no longer rendered** in the UI — Post-Results now shows the scorecard + the
> **call highlights** (the talking points) and nothing else. The field and the guidance below survive
> as **authoring notes**: still worth composing while you work the call, still the discipline behind a
> good `lead` band, but it does not paint to the screen. If a future cycle wants the spoken version
> back, it renders inside Post-Results, not in a phase of its own. The rest of this section is kept
> for that authoring discipline.

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
- A **copy button** (`.ce-3m-copy`) lifts the numbered text out of the dashboard — the one thing in
  Earnings designed to leave it.

**How to source it:** write it from the `lead` band plus the tripped red-lines, then check it
against `notBringing` — anything a reader would expect to hear and does not appear in the three
minutes belongs in one list or the other. Nothing notable may be silently absent.

## 6d. The chain — `newQuestions → seededBy`, visible from both ends

The claim that Earnings is a **calibration record** is only true if the reader can trace it. Two
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

## 6e. Investor Days & IR events — a non-earnings entry, same relevance as a call

Some companies hold **Investor Days / strategic IR events** that are not quarterly earnings calls.
When one appears in the calls record, **treat it with the same relevance and structure as a call**:
it gets its own block in the quarter selector, labelled by the event (e.g. `Investor Day 2026`, not
`Qx`). The difference is that it is **guidance-based, not a quarter close** — there is usually no
"print" to beat; instead there are long-term targets, capital-allocation frameworks and strategic
announcements. The four phases **adapt, they do not change**:

| Phase | For an IR / Investor-Day event |
|---|---|
| **Setup** | The **Consensus ⇄ Summit ⇄ Both toggle does NOT apply** — we are not forecasting a print, so there is nothing to estimate and no previa. Render the Setup body **empty except a short disclaimer** that points the reader to the other phases — e.g. *"No print to forecast — this is a strategic/guidance event. See the Watch List for the themes, Post-Results for the materials the company published, and Post-Call for the transcript."* Keep it simple; do not force estimates. |
| **Watch List** | The **themes** going in — what to listen for (new targets, segment disclosures, capital-return shifts, product/strategy pivots). Same theme cards as a call. |
| **Post-Results** | Covers **the materials the company uploaded** for the event — the slide deck / presentation / press materials — NOT a beat/miss scorecard (there is no consensus to score against). The "results" here are *what the company put out*: the headline targets and framework changes, each with its so-what. |
| **Post-Call** | The **transcript** (presentations + Q&A), analysed insight-first exactly like an earnings call — bands, `threeMinutes`, `newQuestions`. |

**Data model:** mark the block `kind:'ir'` (default is `kind:'earnings'`) and give it a `label`
(e.g. `'Investor Day 2026'`) that the quarter pill shows instead of `Qx`. In Setup, `kind:'ir'`
suppresses the estimate toggle/headline/custom/previa and renders the disclaimer; `results` is not a
scorecard but a **materials list**. Everything else — Watch List, Post-Call, and the chain
(`newQuestions → seededBy`) — works unchanged, so an IR event still seeds the next event's/quarter's
Watch List. **Do not over-engineer it:** if a company never holds one, nothing changes; the rule only
exists so an IR event slots into the same tab with the same discipline when it does appear.

---

## 6f. The Watch List is a TABLE, and it is ours (v2.5–v2.6 · Jul 2026)

The problem v2.5 fixes: the Watch List had become **too AI-dependent**. Post-Results and Post-Call
*should* give the model free rein — extracting what a print and a transcript actually said is
mechanical work with a right answer. **The hunt list is different.** It is a judgement about what
matters to *us*, and it has to be able to say *the model missed this* and *the model over-weighted
that*. So the Watch List stopped being a model output and became **our table**.

**Storage.** One flat array — `WL_ROWS` — not prose nested inside each quarter. Columns:

| column | req | meaning |
|---|---|---|
| `id` | ✓ | stable row key (the future primary key) |
| `q` | ✓ | the quarter list this row belongs to — the frozen record |
| `rank` | ✓ | **sort order only — NEVER rendered.** The cards carry no numbers, so deleting a theme cannot leave a stale 1–5 behind or imply a re-ranking nobody did. New rows take the next free slot; survivors are never renumbered. |
| `theme` | ✓ | the thing to hunt |
| `tags[]` | ✓ | kebab-case theme tags; they ARE the cross-quarter filter vocabulary |
| `definition` | ✓ | what the theme **means** — ours, in our words. Renders on the card. (Was `why`.) |
| `trackSince` | | the quarter the hook opened |
| `trackUntil` | | the quarter the hook closed. **EMPTY MEANS STILL OPEN.** |
| `seededBy` | | `{q,n,tripped}` — the prior call's open question that put it here |
| `src` | | grounding: why it earned a slot (pop-up) |
| `thread[]` | | `[{q,n}]` the quarter-by-quarter evolution (pop-up) |

**Dropped in v2.6 — do not reintroduce them:** `tell` (the 🔎 standing read), `trigger` (the
validate/invalidate condition, itself the v2.5 rename of `breaks` / "Breaks if…") and `cons` (the
Street line). Each was the model's judgement dressed as ours. What a print or a transcript actually
said belongs in **Post-Results / Post-Call**, where the model is supposed to run; the Watch List
carries only what we decided. The removed text is in git history and in `docs/calls/<TICKER>.md`.

**The hook window is the filtering system.** The Watch List is pre-call, so **the live quarter's
list is exactly the rows with a `trackSince` and no `trackUntil`**. Nothing derives it automatically
— we open and close hooks by hand, and closing one (fill `trackUntil` via ✎) drops it out of the
live list while keeping it in the record. `trackSince` / `trackUntil` are real columns, so they
filter and sort like any other.

**Tags are a growing vocabulary, not a fixed enum.** The Add/Edit form picks from the tags already
in use (multi-select chips) *and* lets a new one be created while writing the theme. A new tag is
appended to the "Filter by theme" bar immediately — from that moment it is available to every theme,
for everyone.

**The round-trip, and the pending assignment.** Editing from the portal is **session-only**: add /
edit / delete mutate `WL_ROWS` in memory, the cards and the table re-render, and a refresh discards
it. Making it durable requires **Supabase — that is a PENDING ASSIGNMENT, not built.** Until then
the loop that works is:

> edit in the portal → the table at the bottom of the Watch List updates live → **COPY** (TSV, drops
> into a sheet) or **copy JSON** (exact) → paste it back to Claude → it gets hardcoded into
> `WL_ROWS` in a commit.

There is deliberately **no "refresh" button**. The table rebuilds on every add / edit / delete, so a
refresh could never change anything — it existed only to look reassuring, and read as broken instead.
The header carries a live counter (`20 rows · 5 open hooks · live`) which actually moves; that is the
honest signal that the table tracked the edit (Rule H — never render nothing as if it were something).

Not the most efficient loop, but it lets us author and *see* the list now instead of waiting on the
database. When the Supabase work is picked up, the shape is already right: the columns above map 1:1
to a `earnings_watchlist` table (one row per theme per quarter, `id` as PK, `tags` as `text[]`,
`definition` as `text not null`, `rank` as `int` (sort only), `track_since` / `track_until` nullable), reachable through `js/api.js` like every other table — no
render changes required, only the data source.

**Scope.** v2.6 is live on **GOOGL** (`js/overviews/googl.js`). IBKR / V / MA / RELY / META still
carry the v2.4 nested `watchList` shape and keep working unchanged — each overview file owns its own
copy of the Earnings renderers. Retrofit them when their next cycle is built; do not do it blind.

## 7. Data model (essentials)

```js
var CALL_EARNINGS = { ticker:'XXXX', quarters:[
  // kind defaults to 'earnings'; an Investor Day / IR event is kind:'ir' + label (§6e) —
  // Setup shows only a disclaimer (no estimate toggle), Post-Results is a materials list.
  { q:'Qx 20xx', status:'upcoming', date:'…', /* kind:'ir', label:'Investor Day 2026', */
    setup:{ source, asOf,
      headline:[ {k:'Revenue',cons:{v,yoy,unit},us,note?}, {k:'Operating income',…},
                 {k:'EPS (diluted)',…}, {k:'EBITDA',…} ],
      custom:[ /* 4 per-company; k:null renders "to define" */ ],
      // v2.5: marketDebate (fear/real/mech) is RETIRED. The debate box alone carries the going-in
      // read — `synth` is what the print has to resolve; `rows` fill when Summit numbers exist.
      debate:{ rows:null | [{k,street,us,why}], synth } },
    results:null, call:null },
  { q:'Q(x−1)', status:'reported', date:'…',
    setup:{ source, pricedIn, oneLiner },          // FROZEN contemporaneous view
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
           notBringing:[{ item, why }],   // (see below for WL_ROWS — the Watch List no longer
                                         //  lives inside `quarters`, §6f)
           newQuestions:[{ n, landed:{q,rank}, tripped? }] } },  // closes the chain (§6d)
  // …older quarters, same shape, append-only
]};

// v2.5 — the Watch List: ONE flat table, not nested per quarter (§6f). Ours to author, editable
// from the portal in-session, copy-able back out for hardcoding. Supabase = pending assignment.
var WL_ROWS=[
  { id:'wl001', q:'Qx 20xx',
    rank:1,                       // SORT ONLY — never rendered (no numbers on the cards)
    theme:'…',                    // what we are hunting
    tags:['capex','cloud'],       // vocabulary of the filter bar; new tags can be created inline
    definition:'…',               // REQUIRED — what the theme means, in OUR words; shows on the card
    trackSince:'Qx 20xx',         // hook opened
    trackUntil:null,              // hook closed; NULL = STILL OPEN ⇒ it is on the live list
    seededBy:{ q, n, tripped? },  // optional — WHY it is on the list (§6d)
    src:'…',                      // optional — why it earned a slot (pop-up)
    thread:[{q,n},…] },           // optional — the quarter-by-quarter evolution (pop-up)
];
// v2.6 removed `tell`, `trigger` and `cons` — see §6f. Do not reintroduce them.
function wlFor(qLabel, openOnly){ /* rows for a quarter; live quarter passes openOnly=true */ }

// The theme record (rendered inside the Earnings Watch List, v2.3) — status carries its age (§6):
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

Render machinery to port verbatim from `googl.js` (swap data + brand only): `ceStyle`, `ceFmtC`,
`ceEvCell`, `ceQPills`/`ceQkey`, `ceSetupBody`, `ceWatchBody`, `ceWatchItem`, `ceResultsBody`,
`ceCallBody`, `callsBody`/`callsByQuarter`, `ceUpcoming`, `ceFill`, `ceQnum`/`ceStAge` (status
age, §6), `CE_RES` (five verdicts, §7b), `CE_HLTAG`, `CE_THST`, `CE_POP`/`ceReg`/`ceQ`,
`wireCallEarnings` (phase tabs + estimates toggle + quarter pills + the `threeMinutes` copy button,
clipboard API with a `textarea`+`execCommand` fallback) and the `lpb-acc`/`calls-pill` wiring in
`init`. Note `wireCallEarnings` is called from **`init`**, not `deepDiveInit`.

CSS classes that carry meaning (port with the functions): `.ce-legend`/`.ce-legend-i` (Rule L),
`.ce-sc-rk` + `.ce-sc-rk.blank` (Rule D), `.ce-sc-surp.hi/.md/.lo` (Rule H), `.ce-band*`,
`.ce-hl-open`, `.ce-3m*`/`.ce-nb*`, `.ce-seed`, `.ce-nq*`, `.calls-st-age`.

## 8. The build — nine steps, in order

1. **Calls repository** (§3): create/rotate `-latest.md` + compendium.
2. **Analyze** the latest call (Part I) AND diff the full record — Pass 1.5 discovers the themes
   and promise ladders.
3. **Extract consensus** from `BBG_CONSENSUS.txt` (§6a): check the label integrity, take the newest
   snapshot's `fq+1`, YoY from that same row's `fq-3`, and run the **basis test** before trusting
   any line for a YoY or a surprise.
4. **Build `CALL_EARNINGS`**: the upcoming quarter (Setup v2, per-quarter watch list of THEMES).
5. **Backfill reported quarters as worked examples** — when call history exists, build at least
   the TWO most recent reported quarters end-to-end (frozen setup + contemporaneous watch list +
   results + call), so the accumulate-over-time picture is visible and the
   `newQuestions → next watchList` chain is real. **Reconstruct their consensus grids from the
   archive** — the last snapshot before each print carries exactly the number that stood going in
   (§6a-ii). Fall back to a qualitative frozen setup ("hold high-teens") only where no snapshot
   covers the quarter; never invent precise figures.
   **Adding a grid must not delete that quarter's frozen pre-call prose** — both render.
5b. **Build the annual chart** (§6a-viii) once BBG + Summit exist for a metric: `CE_ANNUAL`
   + the two Setup charts, with the trust flags set by the basis test.
6. **The theme record** (`<TICKER>_THEMES`, §6 format) — rendered INSIDE the Earnings Watch List
   phase (fold it in below the watch content via `callsBody()`); do NOT build a standalone Earnings
   Calls sub-tab (v2.3).
7. **Port the render machinery** from `googl.js` or `ibkr.js` (§7).
8. **Wire it** (§6 placement — Earnings is the first Evolution sub-tab, no Earnings Calls tab;
   `wireCallEarnings` + calls-pill/lpb-acc in `init`).
9. **After each print/call — ONE fill (v2.8):** fill `results` **and** `call` together in a single
   step (the print and the transcript land at once; there is no separate "score now, transcript
   later"). Rule 0 throughout. Include `surprise`/`watchRank` on every scorecard row (§7b) and, on
   every `call.highlights` item, **`band` + optional `open`** (§6b) — remember the aside is only
   `context` + `logged`; a `lead` (thesis-mover) is filtered out of the render and belongs on the
   **Watch List** instead. `take` / `threeMinutes` / `notBringing` / `newQuestions` are **data-only**
   (compose if useful; not rendered — §6c). Then ROLL: **add the new upcoming quarter (it opens in
   Setup + Watch List only, never Post-Results — §6a-ix)**, and **close the chain** — every
   `newQuestion` of the quarter just filed gets a `landed:{q,rank}` or is explicitly left
   `still open`, and every new watch item gets its `seededBy` (§6d). Rotate the calls repo; update
   the themes view and bump each theme's `st.last` (and `st.since` if a status changed).

## 9. Self-audit checklist (report PASS/FAIL before finishing)

- [ ] ONE convention doc (this file) — no rules living elsewhere.
- [ ] Calls repo: `-latest` + compendium; rotation respected; append-only.
- [ ] Setup: exactly 4 headline + 4 customs; every rendered value traced to the Bloomberg export
      (`asOf`); YoY correct; Summit column renders (values or "to fill"); toggle works; caveat
      pop-ups on trap numbers; **the debate box renders the one-thing-to-resolve** (`debate.synth`);
      **NO fear/consensus pair, NO mechanism chips, NO gray placeholder** (all retired in v2.5).
- [ ] Watch List stored as the flat **`WL_ROWS`** table (§6f) — not nested inside `quarters`; every
      row has `id`+`q`+`rank`+`theme`+`tags`+`definition`; **no row carries `tell` / `trigger` /
      `cons`** (dropped in v2.6); every row has a `trackSince`, and **the live quarter renders open
      hooks only** (no `trackUntil`).
- [ ] **Cards carry NO numbers** — no rank badge anywhere; `rank` is sort order only, and a new row
      takes the next free slot without renumbering the survivors. The Post-Results badge reads
      **`ON THE LIST`**, never `WATCH #n` (the number would point at nothing).
- [ ] `definition` renders **on the card** and is NOT repeated inside the pop-up; the pop-up carries
      `seededBy` + `src` + `thread` only.
- [ ] Watch List authoring works from the portal: **"+ Add theme"** with a tag picker **and inline
      tag creation** (new tag appears in the filter bar); **✎ edit / ✕ delete on the live quarter
      only**; frozen quarters read-only; tracking-window filter (All · Open · Closed) works.
- [ ] **The table at the bottom renders every row, its live counter moves on every edit, and COPY /
      copy-JSON work** — that is the only persistence path until the Supabase assignment lands (§6f).
      **No "refresh" button** (it could only ever be a no-op).
- [ ] Tag bar still filters **across quarters** (flat view w/ quarter chips; clear/quarter-pick
      returns to per-quarter); promises embedded (no standalone tab).
- [ ] **No black slabs inside the watch cards** — no `.ce-w*` rule uses `#10141A`. The dark box
      survives only as the Setup debate box (`.ce-synth`) and the Post-Results headline take
      (`.ce-take`, `results.headline`).
- [ ] Watch List items that descend from a prior call carry **`seededBy`**, rendered in words.
- [ ] **Post-Results (numbers):** red-line check renders **above** the scorecard with its tripped
      counter; scorecard sorted **biggest-surprise first**; every row has `surprise`; `watchRank`
      present where true and **blank (never a label) where not**; `nodisc`/`nocons` used instead of
      forcing a `miss`; legend above the table.
- [ ] **Post-Results toggles (v2.8):** `vs Street ⇄ vs Summit` swaps the expected value, surprise,
      verdict **and** the verdict-filter (tiles carry `data-vdc`/`data-vdu`); **no "Both"**; Summit
      view reads `no est.` where `setup.us` has no number. `Margin` toggle shows GP/OpInc/EBITDA
      **expected-implied → realized** with a Δ in pts and **no YoY/QoQ**, and the `?` pop-up discloses
      the forward-revenue basis caveat. Defaults: `data-ev="cons"`, `data-mm="off"`.
- [ ] **Post-Results ▸ AI call summary (v2.10):** `results.summary` renders a **collapsible box, title
      always visible** ("🧠 Call summary — the minute" + `AI-generated`), an **always-visible lede** +
      **nested `<details>` dropdowns** (dropdowns within dropdowns), **Expand-all / Collapse-all** that
      toggles only the inner nodes, and **hover-definition glossary** terms (`.ce-gl[data-def]`, CSS
      tooltip, not a pop-up). It is a **summary, not a transcript** (no exec roll-call). **The old black
      one-line `.ce-take` take is gone.**
- [ ] **Post-Results ▸ "Also on the call" (v2.9 list, v2.10 tag-less):** renders **below the scorecard**
      as **one box holding a plain list** (`.ce-alsobox`), each point a native `<details>` dropdown —
      **NO band classification (context/logged) and NO tag chips** (tone/curious/…); just the theme +
      its dropdown. **`lead` items are filtered out and routed to the Watch List**. If a quarter has no
      non-`lead` items, the box is simply absent.
- [ ] **`threeMinutes` / `take` / `notBringing` / `newQuestions` are DATA-ONLY (v2.7)** — composed as
      authoring notes if useful, `newQuestions` still seeds the next Watch List, but **not rendered**;
      there is no three-minutes copy button.
- [ ] ≥2 reported quarters backfilled end-to-end; **the chain closes in BOTH directions** — every
      `newQuestion` shows where it landed or reads *still open*, and its counterpart watch item
      names it; quarter pills toggle all three phases (Setup · Watch List · Post-Results).
- [ ] **The theme record** renders **inside the Earnings Watch List** (not a standalone tab): By
      theme ⇄ By quarter toggle, `lpb-acc` accordions, status chips **with age in words**,
      contemporaneous highlights. **No "Earnings Calls" sub-tab exists** in the Evolution row (v2.3).
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
