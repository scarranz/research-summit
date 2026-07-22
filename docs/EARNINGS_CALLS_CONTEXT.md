# Earnings Calls — context & rules (ALL companies)

**What this is:** the operating system for analyzing ANY portfolio company's earnings call —
the general relevance rules, the detection protocol, the Call Prep Setup spec, and the calls
repository workflow. Per-company case studies live at the bottom; the rules live at the top and
are **company-agnostic**. Written to be **self-executing**: a fresh session (human or Claude, no
prior context) that follows §1–§2 verbatim must reach the same conclusions — including the
non-obvious ones — without being guided. §5 holds the regression tests that prove it.

**If you are Claude in a fresh session:** run the three passes of §2 **in order**, produce the
raw extraction table **before** writing a single highlight, and check your output against §5
before delivering. Skipping Pass 1 and "reading for highlights" is the documented failure mode.

Companion spec: `docs/CALL_PREP_CONVENTIONS.md` (the Call Prep tab structure & taxonomy).
Call transcripts + integrated analyses live in **`docs/calls/<TICKER>.md`** (see §4).

---

## 1. RULE 0 — the So-What rule (overrides everything)

**A number is never a highlight. A growth rate is never a highlight.** Every highlight is a
three-part chain, and all three parts are mandatory:

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

---

## 2. The detection protocol — three passes, in order

Detection and selection are two different jobs. Reading "for highlights" conflates them — you
only see what already looks important, and that is exactly how buried datos get missed
(see §5, Test #1). So:

### Pass 1 — Extraction (mechanical, exhaustive, judgment FORBIDDEN)

Build a **raw candidate table** by running ALL of these scans over the **full transcript**
(prepared remarks + Q&A, never just the release):

| Scan | What to extract |
|---|---|
| **1.1 Not-in-the-tables** | Every quantified claim in the prepared remarks that does NOT appear in the release tables. If management chose to say a number out loud that the release doesn't tabulate, that choice is itself the signal. |
| **1.2 Multiplier words** | Literal word-scan: *tripled, doubled, record, first (time/-ever), fastest, all-time, "straight up", never, only* — plus any bare % ≥ 50. Grep-able; run it literally. |
| **1.3 New proper nouns** | Products, venues, partners, geographies, regulators seen for the first time. Cheap to log; often next year's segment. |
| **1.4 Q&A-only facts** | Anything stated only under questioning and absent from the release. Weight answers-when-pushed over volunteered remarks. |
| **1.5 Diff vs prior 2–3 calls** | Metrics/topics that recurred (candidate trend) and — just as important — that **disappeared** (silences; cross-check the Promise Tracker). |
| **1.6 Guarded answers** | Q&A exchanges where the answer is notably shorter, vaguer, or more hedged than the question deserved. The gap between question and answer is data. |

No filtering at this stage. The already-in-the-DCF filter applied during extraction is how
datos get lost — it belongs in Pass 3 only.

### Pass 2 — Enrichment (the WHY, mandatory per item)

For **every** Pass-1 candidate, answer: *why did this number move (or hold)?* using the Rule-0
source hierarchy. An item without its WHY cannot proceed to Pass 3 as a highlight — it proceeds
as a **question/flag**.

### Pass 3 — Selection & ranking (judgment)

What is **relevant** vs. not, in general:

- **Relevant:** anything that changes the *forward* picture — a thesis red-line held/tripped
  **with its driver**; a strategy pivot (language change vs. prior calls); a management
  tone-shift vs. its own history; candor against interest; a 2-quarter recurring metric
  management chooses to quantify; a silence on a live project; a competitive/regulatory event
  management confirms is flowing through the numbers; a promise delivered/abandoned.
- **NOT relevant (cut without mercy):** any restatement of a released number without a driver;
  in-line results on undisputed lines; boilerplate macro color; congratulatory analyst chatter;
  routine litigation updates; anything "everyone at the meeting already has."
- **Recurrence rule:** 1 mention = candidate · **2 consecutive quarters = trend, auto-promote** ·
  disappearance = silence signal. Keep the running list across quarters (that is what
  `docs/calls/<TICKER>.md` is for).
- **No-follow-up trap:** zero analyst questions about an item does **not** demote it. The
  Street's inattention is often precisely the opportunity (`curious` tag).
- **Tone vs. history:** diff each answer against how THIS management has historically talked
  about the topic.
- **Candor against interest:** management volunteering evidence against its own bull case is
  auto-promoted — highest-credibility signal type.
- **Only now** apply the already-in-the-DCF filter to cut restatements, and tag survivors:
  `thesis` / `curious` / `dots` / `tone` / `watch` (taxonomy in `CALL_PREP_CONVENTIONS.md` §5).

---

## 3. Call Prep · Setup spec — headline + custom KPIs, and the three-way expectations view

The Setup consensus grid is standardized across companies (v2, Jul 2026):

- **4 HEADLINE metrics — mandatory, same for every company:**
  **Revenue · Operating income · EPS · EBITDA.**
- **4 CUSTOM KPIs — company-specific,** defined per ticker with Dani (e.g. for a broker:
  DARTs / accounts / client equity; for Alphabet: to be defined).
- **Every metric carries up to TWO estimates:**
  - **Street** — Bloomberg (BST) consensus, from the analyst's export ONLY (never web).
  - **Summit** — our own expectation (from the Summit DCF/MCP when the ticker is covered,
    else the analyst's hand figure). Absent → renders "to fill", never invented.
- **A visual toggle switches the grid between `Consensus` ⇄ `Summit` ⇄ `Both`** (Both shows the
  two stacked per cell, labeled). Clean, not messy — one grid, three lenses.
- **The debate** is now an *explanation of the disparity*: where Summit's numbers differ from
  the Street's, which lines diverge, and **why we see it differently** (our mechanism vs.
  theirs). It fills only once both estimate sets exist; until then the section renders enabled
  with a "to fill" state. When only consensus exists, the debate can still frame the
  qualitative disagreement, flagged as such.

Post-Results scores actuals against **both** columns: beating the Street but missing our number
(or vice versa) is exactly the kind of read this exists to catch.

---

## 4. The calls repository — `docs/calls/<TICKER>.md`

The persistent, in-repo record of every company's earnings calls — so any session, any day, has
the full call history without Dani re-pasting transcripts (until Fiscal.ai full access lands and
this can be automated via the `get-transcript` edge function, PR #54).

**Workflow, each quarter:**
1. Dani hands the **newest call** (transcript paste or file).
2. Update `docs/calls/<TICKER>.md`: append the new call (structured: date, speakers, prepared
   remarks + Q&A, kept faithful) **and** the analysis produced by §1–§2 for that quarter.
3. The file is **append-only per quarter** (like the Call Prep tab) — prior quarters are never
   rewritten, so the recurrence scan (Pass 1.5) always has its baseline.
4. The same file feeds the Call Prep `watchList` grounding and the Promise Tracker statuses.

Format per company file: a header (ticker, coverage span), then one `## Qx YYYY` section per
call, newest first, each with `### Transcript` and `### Analysis` subsections.

---

## 5. Regression tests — the system must catch these

Calibration cases: any fresh analysis that misses one of these has failed the protocol,
whatever else it found. (They are IBKR-born but the *rules they test are general*.)

**Test #1 — the buried recurring dato (IBKR overnight trading).** Q4'25: "+76% QoQ" — one line
in prepared remarks, no follow-up. Q1'26: "nearly tripled YoY to 8.1M trades," one paragraph in
the narrative script, **not in the release tables**, zero analyst questions — missed by a
selection-first read; flagged by Dani. Q2'26: 10.9M — now an obvious trend (Korea/Nextrade,
24-5 story). **Rules that catch it without guidance:** scans 1.1 + 1.2 flag it in Pass 1; the
recurrence rule auto-promotes in Pass 3; the no-follow-up trap forbids demotion.

**Test #2 — the guarded answer (IBKR margin loans +67%).** A +67% balance-sheet number answered
with "we feel comfortable" and no granularity. Caught by scan 1.6 + tone-vs-history (Peterffy
historically dislikes fast margin growth). Listing it as a positive without flagging the
answer's thinness fails Rule 0 (no WHY) and Pass 3 (tone).

**Test #3 — the bare-number restatement.** Any deliverable containing a bullet equivalent to
"DARTs grew 35%" (or "Cloud grew 48%") with no driver and no implication fails Rule 0 outright.

---

## 6. Case studies

### IBKR — Q2 2026 (call Jul 21, 2026) — conclusions under the rules

**The take:** the print was a clean beat; the call was about the pivots underneath it. Each
conclusion below is fact → why → so-what (full analysis in `docs/calls/IBKR.md`):

1. **NII +23% (~$1.06B) through a −70bps Fed move** — balances (margin loans +67%, seg-cash on
   +34% accounts) out-ran the rate drag → the rate-cut bear case is empirically dead; the thesis
   rests on balances → accounts. `thesis`
2. **Rate sensitivity ±$81M/25bps USD (±$38M non-USD), base $28.4B vs $22.8B YoY** — scales with
   balances → model both directions off the bigger base. `thesis`
3. **Margin loans +67% = the least-explained big number** — only "we feel comfortable," no
   concentration split, bad debt $1M→$10M → Rule 0.4 flag; Q3 question #1. `watch`/`tone`
4. **Prediction markets pivoted exchange → aggregator (ForecastEx+CME+Kalshi)** and volumes
   concentrate in temperature contracts; Peterffy points to hurricanes → really a
   **weather/insurance-hedging** play, not elections. `dots`
5. **Agentic AI:** clients connected ChatGPT/Claude/Grok organically pre-announcement;
   human-in-the-loop now, autonomy on the roadmap → a future volume driver. `curious`
6. **Tiger/Futu clampdown → asset transfers to IBKR** — competitor-regulation gift inside the
   +40% equity growth; sticky but not organic. `dots`
7. **Overnight ~3x again (10.9M) + Korea (Nextrade) launch** — two consecutive ~3x quarters =
   confirmed secular 24-5 international story; standing metric. `curious`→trend
8. **~1/3 of crypto trading already perpetuals** — product-market fit (perps solve
   short-selling/leverage) → size the fee stream. `curious`
9. **Excess capital $10.3B, no buyback, M&A discipline** — return pressure builds mechanically;
   a buyback would be a story change. `watch`
10. **Candor against interest:** marketing yield NOT improving; DARTs/account durability partly
    environment → growth isn't getting cheaper; don't extrapolate unit economics. `tone`
11. **Promises:** OCC charter "operational by year-end"; intro-broker mix shifted
    startups → established firms (the durable part); §31 fee = pure pass-through.

**Q3 2026 seeds:** margin concentration + bad-debt path · prediction-market revenue & the
insurance vertical's size · agentic-AI volume + autonomy timeline · capital return trigger ·
overnight/Korea trend + Tiger/Futu persistence.

### GOOGL — Q2 2026 (reports Jul 22, 2026) — staged

Call Prep staged on the profile (Setup v2: 4 headline + 4 custom KPIs + Consensus⇄Summit⇄Both).
Pending: Bloomberg export · Summit expectations · the custom-KPI definition · the calls
compendium for `docs/calls/GOOGL.md`.

---

*Maintained on `feat/call-prep-iterations` (multi-company Call Prep iteration branch). Master
copies of the IBKR analysis docs also in Dani's Downloads.*
