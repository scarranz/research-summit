# IBKR — Q2 2026 Call · Context & Highlight-Detection Rules

**What this is:** the operating system for analyzing IBKR earnings calls, plus the Q2 2026
conclusions produced by applying it. Written to be **self-executing**: a fresh session (human or
Claude, no prior context) that follows §1 verbatim must reach the same conclusions — including the
non-obvious ones — without being guided. §3 is the regression test that proves it.

**If you are Claude in a fresh session:** run the three passes of §1 **in order**, produce the raw
extraction table **before** writing a single highlight, and check your output against §3 before
delivering. Skipping Pass 1 and "reading for highlights" is the documented failure mode.

---

## 1. THE RULE SYSTEM

### Rule 0 — the So-What rule (overrides everything)

**A number is never a highlight. A growth rate is never a highlight.** Every highlight is a
three-part chain, and all three parts are mandatory:

> **FACT** (what the number did) → **WHY** (the qualitative driver — why it grew, fell, or held) →
> **SO WHAT** (what it implies for the thesis / the model going forward)

The test, verbatim: *"no sirve ir al call y decir que los DARTs crecieron 35% — so what???"*

- ❌ **Banned:** "DARTs +35% YoY." (a restatement — everyone at the meeting has the release)
- ✅ **Required:** "DARTs +35% — but almost all of it is *more accounts* (+34%), not more activity
  per account (DARTs/account ~flat), and management itself flagged the strong environment
  (volatility, SpaceX IPO) as part of the reason there's no dilution → the growth is real but its
  per-account intensity is **not proven structural**; the tell is DARTs/account when volatility
  normalizes."

**Where the WHY comes from, in order of weight:**
1. Management's explanation **under analyst pressure** (Q&A, pushed) — highest weight.
2. Management's volunteered explanation (prepared remarks).
3. A mechanism you infer from disclosed facts — allowed, but **label it as inference**.
4. **No explanation found** → the item does not die; it converts into a next-quarter question, and
   the absence itself is a signal: *a big move management didn't explain is a flag, not a gap.*
   (Q2's example: margin loans +67% got only "we feel comfortable" — that thinness IS the finding.)

### Pass 1 — Extraction (mechanical, exhaustive, judgment FORBIDDEN)

Detection and selection are two different passes. Reading "for highlights" conflates them — you
only see what already looks important, and that is exactly how the overnight-trading dato was
missed. So first, build a **raw candidate table** by running ALL of these scans over the **full
transcript** (prepared remarks + Q&A, never just the release):

| Scan | What to extract |
|---|---|
| **1.1 Not-in-the-tables** | Every quantified claim in the prepared remarks that does NOT appear in the release tables. If management chose to say a number out loud that the release doesn't tabulate, that choice is itself the signal. |
| **1.2 Multiplier words** | Literal word-scan: *tripled, doubled, record, first (time/-ever), fastest, all-time, "straight up", never, only* — plus any bare % ≥ 50. Grep-able; run it literally. |
| **1.3 New proper nouns** | Products, venues, partners, geographies, regulators seen for the first time (this quarter: Nextrade, Kalshi routing, IBKR Connector, Coinbase perps). Cheap to log; often next year's segment. |
| **1.4 Q&A-only facts** | Anything stated only under questioning and absent from the release (this quarter: Tiger/Futu inflows, marketing-yield admission, temperature-contract concentration). |
| **1.5 Diff vs prior 2–3 calls** | Metrics/topics that recurred (candidate trend) and — just as important — that **disappeared** (silences; cross-check the Promise Tracker). |
| **1.6 Guarded answers** | Q&A exchanges where the answer is notably shorter, vaguer, or more hedged than the question deserved. The gap between question and answer is data. |

No filtering at this stage. The already-in-the-DCF filter applied during extraction is how datos
get lost — it belongs in Pass 3 only.

### Pass 2 — Enrichment (the WHY, mandatory per item)

For **every** Pass-1 candidate, answer: *why did this number move (or hold)?* Hunt the transcript
for the driver using the Rule-0 source hierarchy. An item without its WHY cannot proceed to
Pass 3 as a highlight — it proceeds as a **question/flag**.

### Pass 3 — Selection & ranking (judgment, taxonomy per `CALL_PREP_CONVENTIONS.md` §5)

- **Recurrence rule:** 1 mention = candidate · **2 consecutive quarters = trend, auto-promote** ·
  disappearance = silence signal. Keep the running list across quarters — this rule alone catches
  the overnight-trading class of dato.
- **No-follow-up trap:** zero analyst questions about an item does **not** demote it. The Street's
  inattention is often precisely the opportunity (`curious` tag).
- **Tone vs. history:** diff each answer against how THIS management has historically talked about
  the topic (Peterffy guarded on margin growth ≠ neutral — he has a record of disliking it).
- **Candor against interest:** management volunteering evidence against its own bull case is
  auto-promoted — highest-credibility signal type.
- **Only now** apply the already-in-the-DCF filter to cut restatements.
- Tag survivors with the taxonomy: `thesis` / `curious` / `dots` / `tone` / `watch`.

---

## 2. Q2 2026 — conclusions (the rules applied)

Every bullet below follows Rule 0: **fact → why → so-what.** The take:

> **The print was a clean beat; the call was about the pivots underneath it.** NII proved the
> balance-offset thesis empirically; three optionality bets got reshaped; one big number went
> under-explained.

1. **NII +23% YoY (~$1.06B) while avg Fed funds fell ~70bps.**
   **Why:** balance growth swamped the rate drag — margin-loan *balances* +67% drove margin
   interest +39%, and segregated cash grew with +34% account growth (cash arrives attached to new
   accounts), holding seg interest +7% even at lower rates.
   **So what:** the core bear case ("rate cuts kill NII") is empirically dead this quarter. The
   thesis now rests on balances → which rest on account growth. `thesis`

2. **Rate sensitivity updated: ±$81M annual NII per 25bps USD move (±$38M non-USD); fully
   rate-sensitive balances $28.4B vs $22.8B YoY.**
   **Why disclosed:** the Street kept asking; why it *grew*: sensitivity scales mechanically with
   balances (+25% YoY).
   **So what:** every quarter of balance growth makes cuts hurt more in dollars — and hikes help
   more. Model both directions off $28.4B, not last year's base. `thesis`

3. **Margin loans +67% ($108.5B) — the least-explained big number of the call.**
   **Why (thin):** Brody: "risk-on environment"; Peterffy: "we feel comfortable." No concentration
   breakdown (few large levered accounts vs. broad-based). Bad debt $1M → $10M.
   **So what:** the biggest NII driver rests on the thinnest explanation — per Rule 0.4, an
   unexplained big move is a flag, not a gap. Concentration is question #1 for Q3. `watch` / `tone`

4. **Prediction markets pivoted: exchange → multi-venue aggregator (ForecastEx + CME + Kalshi,
   routed to best net price); and the real vector is weather/insurance, not elections.**
   **Why:** Milan, explicit — "our job is connectivity and access… no reason to limit clients to
   ForecastEx… increase available liquidity… easier to attract institutions" (the exchange-only
   route was capping liquidity). The weather read: Budish extracted that ForecastEx volume is
   concentrated in a couple of *temperature* contracts; Peterffy's expansion example was hurricane
   landfalls — "which implies insurance risk." No sports/entertainment, reaffirmed.
   **So what:** the headline narrative (election markets) is not what's being built. A
   broker/router economic model over a weather-hedging vertical = smaller near-term, more durable,
   institution-friendly. Re-rate the bet accordingly. `dots`

5. **Agentic AI: clients connected ChatGPT/Claude/Grok to their accounts *before any
   announcement*; human-in-the-loop today; fully autonomous trading on the roadmap.**
   **Why it matters as evidence:** the adoption was organic demand-pull (IBKR shows up in the
   chatbots' own drop-downs) — not an IBKR marketing push.
   **So what:** this is the concrete version of Peterffy's "AI raises trading velocity" thesis — a
   potential future *volume driver*, not a cost story. Autonomy is gated on a client test of
   "benefits and dangers." `curious`

6. **China clampdown (Tiger/Futu, May) → "clear uptick in broker transfers," assets especially.**
   **Why IBKR wins it:** it stayed compliant where competitors didn't (no mainland advertising,
   verifies non-mainland residence), so it can legally receive the fleeing assets.
   **So what:** part of the +40% client equity is a competitor-regulation gift, not organic — don't
   extrapolate it as marketing efficiency. But transferred assets are sticky. `dots`

7. **Overnight trading nearly tripled YoY again (10.9M trades vs 3.8M) + Korea launch is a hit
   ("a line that goes straight up," semis-led, first e-broker on Korea Exchange + Nextrade).**
   **Why:** overnight US-market hours are Asia/Europe's *waking hours* (Milan, Q&A) — the volume is
   international clients trading their day; Korea adds an overnight ATS (Nextrade) plus
   semiconductor demand.
   **So what:** two consecutive quarters of ~3x = a confirmed secular trend (Pass-3 recurrence
   rule), and with Korea it forms **one 24-5 international story** — arguably the most
   under-appreciated commission driver. Standing metric from now on. `curious` → `trend`

8. **~1/3 of crypto trading is already perpetuals, months after launch.**
   **Why:** perps solve crypto's two structural user problems — short-selling and leverage (Milan).
   **So what:** genuine product-market fit, not a promo bump; more venues coming → a growing fee
   stream to size. `curious`

9. **Excess capital ~$10.3B (+~$1.1B QoQ); still no buyback; M&A pitches up "dramatically,"
   nothing bought.**
   **Why it keeps growing:** 77% pre-tax margin compounding into retained earnings, zero
   repurchases ever (public float grows via up-C conversions), and M&A discipline intact ("a lot
   offered," nothing worth pursuing).
   **So what:** the capital-return question builds mechanically every quarter; any buyback or
   special dividend would be a story change, not a routine announcement. `watch`

10. **Management volunteered two thesis-temperers: marketing yield is NOT improving ("roughly the
    same… not more than proportionally higher" — Peterffy) and the no-dilution in DARTs/account is
    partly the strong environment (Milan).**
    **Why they said it:** pressed on whether >30% account growth reflects structurally better
    acquisition — they declined the easy yes.
    **So what:** growth is not getting *cheaper*, and per-account intensity is not proven
    structural. Candor-against-interest (auto-promoted per Pass 3): credibility-positive,
    model-negative — don't extrapolate current unit economics. `tone`

11. **Promise updates:** OCC national trust bank charter → preliminary conditional approval,
    "operational by year-end" (**why it matters:** enables direct custody of mutual fund/ETF
    assets; resolves the Q1 silence). Intro-broker pipeline → 4th–5th straight quarter of
    double-digit integrations, and the **mix shifted from startups to established firms**
    broadening their offering (**so what:** the durable part is the mix, not the count). Section 31
    fee → confirmed pure pass-through, +$19M grossing up both revenue and cost, no profit impact
    (**so what:** strip it from margin noise; ex-fee execution/clearing +7%).

**The dots, connected:** NII proved the balance-offset works even as the Fed eases; underneath,
the "broaden the box" bets became specific (weather/insurance aggregator, autonomous-trading
roadmap, a 24-5 international story), while a regulatory clampdown hands IBKR Chinese-diaspora
assets. Keep honest: margin +67% under-explained, and growth that isn't getting cheaper to buy.

---

## 3. Regression tests — the system must catch these

Calibration cases: any fresh analysis that misses one of these has failed the protocol, whatever
else it found.

**Test #1 — overnight trading (the founding case).** Lineage: Q4'25 call — "+76% QoQ, +130% YoY,"
one line in prepared remarks, no follow-up. Q1'26 — "nearly tripled YoY to 8.1M trades," one
paragraph in the narrative script, **not in the release tables**, zero analyst questions. It was
missed in the original Q1 analysis precisely because the reading was selection-first. Q2'26 —
10.9M, now obviously a trend tied to Korea/Nextrade.
**Which rules catch it without guidance:** scan 1.1 (quantified claim not in release tables) AND
1.2 ("tripled") flag it in Pass 1; the recurrence rule auto-promotes it in Pass 3; the
no-follow-up trap forbids demoting it for analyst silence. If the doc's rules are followed, this
dato cannot escape.

**Test #2 — the guarded margin answer.** A +67% balance-sheet number answered with "we feel
comfortable" and no granularity. Caught by scan 1.6 (guarded answers) + tone-vs-history (Peterffy
historically dislikes fast margin growth). A pass that lists margin +67% as a positive without
flagging the answer's thinness has failed Rule 0 (no WHY) and Pass 3 (tone).

**Test #3 — the DARTs restatement.** Any deliverable containing a bullet equivalent to "DARTs grew
35%" with no driver and no implication fails Rule 0 outright.

---

## 4. Open questions → Q3 2026 Watch List seeds

1. **Margin +67% concentration:** few large levered accounts or broad-based? Bad-debt trajectory
   after $1M → $10M? (Rule 0.4 flag — the unexplained big move.)
2. **Prediction markets:** any revenue disclosure; realistic size of the weather/insurance-hedging
   vertical?
3. **Agentic AI:** incremental volume from chatbot-connected accounts; timeline to autonomy.
4. **Capital:** $10.3B and rising, no buyback — when does capital return step up?
5. **Overnight / Korea (standing metric):** does the 24-5 trend hold a third quarter; does the
   Tiger/Futu transfer tailwind persist?

---

*Companion docs: `IBKR-Q2-2026-Call-Context.md` (this doc's master copy, Dani's Downloads) ·
`IBKR-Q2-2026-Call-Analysis.md` (the full insight-first analysis, Downloads) ·
`IBKR-earnings-calls-Q4-2023-to-Q1-2026.md` (transcript compendium, Downloads) ·
`docs/CALL_PREP_CONVENTIONS.md` (company-agnostic taxonomy & Call Prep spec).*
