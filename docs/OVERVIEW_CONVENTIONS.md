# Overview Conventions — the single source of truth for filling a company Overview

**Read this in full before creating or editing any company Overview.** Anyone (or any
Claude) filling an Overview must follow these rules exactly. The goal is that a new
company can be filled from a ticker and come out **consistent, sourced, and reader-friendly**,
no matter who runs it.

If you were invoked via `/fill-overview <TICKER>`, this file is your contract.

---

## 0. Golden rules (never break these)

1. **Never delete existing content.** When migrating a company that already has an
   Overview, anything that does **not** fit these Overview conventions is **moved into the
   most relevant section of the Deep Dive**, never removed. Preserve the work.
2. **Sources decide, not Claude.** You do not invent facts. Every claim traces to a
   source, and the source hierarchy below is mandatory.
3. **No walls of text.** The Overview is a hook, not a report. Teasers are visible;
   depth lives behind pop-ups / collapsibles. If a reader sees a wall, you failed.
4. **No fake precision.** Do not present illustrative/one-pager assumptions as reported
   figures. Label estimates as estimates. (This rule exists because a real reviewer, San,
   flagged per-cent breakdowns being read as fact.)
5. **Self-audit before finishing.** Run the checklist in §9 and report pass/fail per rule
   in the terminal. Flag anything you could not source or that breaks a convention.

---

## 1. Macro structure — two tabs

Every company profile has exactly two top-level tabs:

- **Overview** — the standardized hook. Its structure is fixed (see §4). This is what
  `/fill-overview` produces automatically.
- **Deep Dive** — everything deeper. Its internal standard is **not yet defined**; for now
  it is a **container**. For an existing company (e.g. UBER) it holds the migrated tabs
  (Company Offer, Financials, Management, History). For a brand-new company it starts as an
  empty scaffold that Summit fills later by hand.

---

## 2. Source hierarchy (mandatory)

Fill qualitative and factual content **in this priority order**:

1. **Company-official** — investor relations site, SEC/EDGAR filings (10-K, 20-F, 10-Q,
   8-K, 6-K, proxy/DEF 14A), earnings releases and prepared remarks, the company's own
   press releases. **This is the primary and preferred source.**
2. **Regulator / exchange** — EDGAR facts (filer status, incorporation), exchange listing data.
3. **Reputable financial data** — Summit DCF (when available), Fiscal.ai / Massive when
   wired, established data vendors and major financial press.
4. **Everything else** — only to corroborate, never as the sole basis. **Never** treat a
   forum/Reddit/blog post as authoritative.

**Noise handling:** cross-check **multiple** sources. When they contradict, give more
weight to the **more official** and **more recent** source, and note the discrepancy rather
than silently picking one. When unsure, say so and mark it for review.

---

## 3. Data lanes — how a field gets its number

- **DCF available (Summit model via the Summit Financial Data MCP):** pull the real
  figures from the model (segments, financial series). Cite the snapshot date.
- **No DCF (e.g. Broadcom / AVGO today):** source the numbers from official sources on the
  web (filings/IR). Label clearly what is reported vs estimated.
- Always distinguish **firm (reported)** vs **estimate (model/derived)** in the copy or a
  footnote. Forward years are estimates, not guidance.
- **Currency:** store and show market cap and any absolute figure normalized to **USD**,
  and keep the native currency + FX date noted. Never compare a EUR company to a GBP/CNY/JPY
  one without USD-normalizing (this matters for international names).

---

## 4. The Overview — the 7 blocks, top to bottom

Fixed order. A block that has no data is **omitted cleanly** (never shown as "N/A").

### 4.1 Key Facts (top strip of cells)
**Exactly 10 cells, laid out 5 columns × 2 rows.** Clean look — **white cells with thin
dividers, no gray shading**. **Hide any cell whose data is missing** — do not print blanks;
if one of the ten cannot be sourced, substitute the next most relevant fact rather than
leaving a hole.

The canonical 10:
- **Listing** — `Exchange: TICKER` (e.g. `NYSE: UBER`)
- **HQ** — city, country
- **Country of incorporation** — for tax context (may differ from HQ)
- **SEC filer** — `Domestic (10-K/10-Q/8-K)` or `Foreign (20-F/6-K)`.
  ⚠️ **Verify on EDGAR** — do not infer from incorporation. Some foreign-HQ companies elect
  to file as domestic (10-K). Check what they actually file.
- **Founded** — year
- **IPO** — date
- **CEO** — name **plus tenure**: when they joined the company and/or since when they've
  been CEO. Rule: if both are available, show both; if only one, show that one; but always
  show something (e.g. "Dara Khosrowshahi · since 2017").
- **Employees** — approximate headcount, with as-of
- **Dividend** — **payer vs non-payer** only (do NOT show dividend yield — too noisy).
- **Market cap** — USD, **with an as-of date** (e.g. "~$195B · Jul 2026").

**Dropped on purpose:** Segments (the Overview already explains how it makes money), S&P 500
membership (useless for small caps), a live scorecard of revenue/margins/PE (too much).
**Considered but excluded by default:** Share Structure (dual vs single class — too complex
to standardize now) and a red-flag/scandal history (fraud, Chapter 11, major controversy) —
may be swapped in as the 10th cell for a company where it is genuinely material, but is not a
default field.

### 4.2 Company description
One tight paragraph. Sourced from the 10-K / 20-F "Business" section or IR. Plain,
neutral, what-the-company-is. No hype, no thesis.

### 4.3 The 4-quadrant (What it sells · Who buys it · How it earns · The edge)
A 2×2 box. **Each cell ≤ ~30 words.** This is the "understand any business at a glance"
block — keep it razor-tight.
- **What it sells** — the actual product/platform.
- **Who buys it** — the customer types.
- **How it earns** — revenue mix in one line (e.g. "~90% Data Center").
- **The edge** — the durable moat in one line.

### 4.4 How it makes money (visual)
A visual/diagram of the revenue engine, tied to **segments** and **geography**.
- Provide **both** views with a **toggle (Segments ⇄ Geography)** when both have ≥2 slices.
- **≥2-slice rule:** a breakdown view renders only if it has ≥2 slices. If a company has a
  single reportable segment or a single geography, **do not draw a one-bar chart** — state it
  in one line ("single reportable segment" / "~X% domestic") and show only the view that
  qualifies. If neither qualifies, omit the visual.

### 4.5 Products
Put a face to what the company sells.
- Card per product: **photo** (`img/products/<ticker>-*.jpg`); if no photo, fall back to a
  representative **icon/emoji**. A missing image must degrade gracefully (hide, not break).
- **Short copy visible; the long explanation lives in a pop-up** (tap to open). Text is more
  tolerated here, but still gated behind the pop-up to not disincentivize reading.

### 4.6 Competitors (scatter)
The peer map — **X = valuation multiple, Y = revenue growth**.
- **Multiple toggle: EV/EBITDA ⇄ P/E.** **Never P/S** — it is not a valuation multiple and
  says nothing useful. Provide both EV/EBITDA and P/E so the analyst picks per company.
- **Basis toggle: Trailing ⇄ Forward** (applies to both axes). Default to Forward.
- **Bubble size = market cap, USD-normalized** (so international peers aren't distorted by
  currency; a $195B name must dwarf a $5B one).
- **Axis labels:** x-axis reads **"cheaper ← … → more expensive"** (a low multiple is cheap,
  a high multiple is expensive — NOT "richer", which describes the company, not the valuation).
  y-axis reads **"slow … fast growth"**.
- **Short labels on the dots; detail (the one-line read) in a hover/tap pop-up.**
- **Only listed peers with a public multiple appear here.** A peer with no meaningful
  multiple **drops out of that view** — e.g. an unprofitable company has no meaningful P/E,
  and an unlisted/private rival (Waymo, Bolt, DiDi…) has no market multiple at all. Say so in
  a caption and point to where those rivals do appear (the qualitative competitive map).
- **Peer-set consistency:** the valuation scatter and any qualitative competitive map in the
  Deep Dive must tell the *same story* — use the same core listed names. Divergences are
  allowed only for a principled reason (a private/unlisted rival has no multiple), and that
  reason must be stated. Do not silently show a different peer set in each.
- Data source: web/official now; **Fiscal.ai API later** when access lands. Label figures as
  approximate until the Fiscal.ai feed replaces them.

### 4.7 Timeline
At the very bottom. Company history / milestones. **Keep text volume low per entry**
(a short line); deeper detail behind a "read more" pop-up where warranted.

---

## 5. Visual & interaction conventions

- **Pop-ups over walls:** any explanation longer than ~1–2 lines goes in a pop-up/modal,
  reachable by a clear affordance ("More ›", "read the full case ›", "terms ›").
- **Collapsibles:** deeper sub-sections start collapsed ("▸") and expand on the reader's
  choice. Never hide everything — hide the *depth*, keep the *hook* visible.
- **Do not put a chart inside a collapsed container** unless it builds on expand (Chart.js
  will not render while hidden).
- **Color:** any color that encodes meaning must have a legend. Reuse the app's palette
  (Inter font, navy/steel) and per-company brand accents; do not invent new patterns.

---

## 6. Deep Dive (container, for now)

Do **not** auto-fill Deep Dive content for new companies — its standard is undefined.
For migrations, create the Deep Dive tab and **move any non-conforming existing Overview
content into the most relevant Deep Dive section** (Golden Rule #1). Leave a short note in
the code where content was relocated from.

- When a company's **old bespoke Overview** is migrated, it lands as a Deep Dive section
  named **"Deep Overview"** (not "Extras") — it reads like a richer, more complex overview,
  so name it accordingly.
- Any competitive/peer visual that lives in the Deep Overview must stay **consistent** with
  the standardized Overview's competitor scatter (same core listed names — see §4.6).

---

## 7. Sourcing & attribution in the copy

- Cite sources in a footer per section or per profile (filings, IR, model snapshot date).
- Attribute contested claims to their source ("Cedar Street argues…"), never as fact.
- Mark illustrative assumptions explicitly as illustrative.

---

## 8. Registration (making the company appear)

1. Create `js/overviews/<name>.js` exporting `{ html(company), init(company) }`.
2. Register its ticker in `js/overviews/index.js` (`OVERVIEWS` map).
3. The company must have a row in the `companies` table (via the portal "Add Company"
   flow) for the profile to open. New/auto-filled content should be treated as a **draft
   for review**, not published unreviewed.

---

## 9. Self-audit checklist (run before finishing; report in the terminal)

Print a PASS/FAIL line for each, and list any gaps:

- [ ] Key Facts = **exactly 10 cells (5×2)**, clean/no-gray; missing ones substituted, not blank.
- [ ] CEO cell carries **tenure**; Market cap carries an **as-of date**; Dividend is **payer/non-payer** (no yield).
- [ ] Filer status was **verified on EDGAR**, not inferred from incorporation.
- [ ] Market cap (and any absolute figure) is **USD-normalized**; native currency noted.
- [ ] Description sourced from filings/IR; neutral; one paragraph.
- [ ] 4-quadrant cells each ≤ ~30 words.
- [ ] How-it-makes-money respects the **≥2-slice rule** (no one-bar charts).
- [ ] Products: photo or icon fallback; long copy in pop-up, not inline.
- [ ] Competitor scatter: multiple = **EV/EBITDA ⇄ P/E toggle (never P/S)**, Trailing⇄Forward
      basis, **USD bubble size**, detail in pop-up; no-multiple/unlisted peers drop out; peer
      set **consistent** with the Deep Overview's competitive map.
- [ ] Timeline entries are short; depth behind pop-ups.
- [ ] **No walls of text** anywhere in the Overview.
- [ ] **No fake precision** — estimates labeled; illustrative flagged.
- [ ] Sources followed the **official-first hierarchy**; contradictions noted; no
      forum/Reddit used as authority.
- [ ] For migrations: **nothing deleted** — non-conforming content moved to Deep Dive.

If any item FAILS or a fact could not be officially sourced, **say so explicitly** and mark
it for human review before commit/push/PR.
