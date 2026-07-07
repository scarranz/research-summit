---
description: Research and fill a company's standardized Overview tab from its ticker, following the Overview conventions. Non-destructive; produces a draft for review.
argument-hint: <TICKER> (e.g. AVGO, UBER)
---

You are filling the **Overview** tab for the company with ticker: **$ARGUMENTS**

Follow this procedure exactly. Do not improvise the structure — the conventions decide it.

## Step 1 — Load the contract (mandatory)
Read `docs/OVERVIEW_CONVENTIONS.md` in full. It is the single source of truth for the
Overview structure, the Key Facts set, the source hierarchy, the anti-wall/pop-up rules,
the competitor scatter spec, and the self-audit checklist. Everything below defers to it.

## Step 2 — Identify the company & data availability
- Resolve the ticker to the company (name, exchange).
- Check whether a **Summit DCF model exists** for this ticker via the Summit Financial Data
  MCP (`search_ticker` / `list_dcf_models`). 
  - **If yes:** pull segment and financial figures from the model; cite the snapshot date.
  - **If no** (e.g. AVGO today): source numbers from official sources on the web. Label
    reported vs estimated.

## Step 3 — Research (official-first)
Gather content following the **source hierarchy** in the conventions: company IR & SEC/EDGAR
filings first, then regulator/exchange, then reputable financial data, then everything else
only to corroborate. Cross-check multiple sources; on contradictions, weight the more
official and more recent, and note the discrepancy. **Never use a forum/Reddit/blog as an
authoritative source.**
- **Verify filer status on EDGAR** (domestic 10-K/8-K vs foreign 20-F/6-K) — do not infer
  from country of incorporation.
- Normalize market cap / absolute figures to **USD**; note native currency + FX date.

## Step 4 — Fill the 7 Overview blocks
Produce `js/overviews/<name>.js` exporting `{ html(company), init(company) }`, rendering the
7 blocks in order per §4 of the conventions:
- **Key Facts** — exactly 10 cells (5×2), missing ones substituted not blank.
- **Description** — tight and **NON-redundant**: the high-level "what it is", NOT a re-run of the
  segments/mix/moat shown below. No hype words.
- **4-quadrant** — each cell ≤ ~30 words.
- **How it makes money** — Segments ⇄ Geography toggle (≥2-slice rule); **define what each
  segment IS from the 10-K, not just its size**; **cross-check** that segment total == geography
  total == reported total net revenue before shipping.
- **Products** — **two tiers**: Tier-1 family cards (photo or icon fallback) → pop-up → Tier-2
  expandable list of the *specific* products, each ≤3 lines. Never dump all products at once.
- **Competitors scatter** — Multiple × Growth; EV/EBITDA⇄P/E (never P/S) + Trailing⇄Forward
  toggles (default Forward); bubble = USD market cap; legend; detail in pop-up; no-multiple/
  unlisted peers drop out (say where they appear instead).
- **Timeline** — follow the §4.7 **relevance rubric**: establish the company's genesis/lineage
  (spin-off / merger / SPAC / reverse-merger / OTC uplisting / roll-up) with **no loose ends**;
  include only genuinely relevant events (first-ever dividend, material/failed M&A, spin-offs,
  trillion-$ milestones, current-CEO & founder-CEO transitions, ≤1 defining litigation, Ch.11/7,
  material redomicile, structural name changes); **exclude** splits, sub-$T milestones, board
  noise, neutral stock dividends and non-dilutive raises. Depth goes in **Read Mores with
  sequential bullets**.

Respect **no walls of text**, **pop-ups over inline detail**, and **no fake precision**. The
**Overview** and **Deep Dive** each carry their own **source** footer (no author byline).

If the company is new, register its ticker in `js/overviews/index.js`.

## Step 5 — Two-tab structure & migration (never delete)
Set up the two top-level tabs: **Overview** (this standardized output) and **Deep Dive**.
- **Existing company (e.g. UBER):** move its current tabs/content into **Deep Dive**. Any
  existing Overview content that does **not** fit the new Overview conventions is **relocated
  to the most relevant Deep Dive section — never deleted.** Leave a code note where content
  moved from.
- **New company:** create Deep Dive as an empty scaffold (its standard is not defined yet —
  do not auto-fill it).

## Step 6 — Self-audit (double-check) & report
Run the **self-audit checklist** (§9 of the conventions). Print a **PASS/FAIL line per item**
in the terminal. Explicitly flag:
- any fact you could **not** source officially,
- any convention you had to bend,
- any figure that is an estimate vs reported.

## Step 7 — Hand off (do not publish unreviewed)
- Confirm the app still runs and show it on **localhost** for review.
- Treat the result as a **draft for human review**. Do **not** commit/push/PR automatically —
  leave that to the person, after they review. San/Oscar merge PRs.

Be honest about gaps. It is better to leave a field marked "needs review" than to fill it
from an unofficial source or invent precision.
