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

### 4.2 Company description — tight and NON-redundant
One tight paragraph (2–4 sentences), from the 10-K / 20-F "Business" section or IR. It gives the
**highest-level "what this company is and does"** — the elevator pitch — and deliberately does
**NOT** enumerate the segments, the revenue mix, the customer types or the moat: each of those has
its **own block right below** (4-quadrant, How it makes money w/ segment definitions). Do not say
the same thing twice across blocks — if the reader will meet a fact lower down, don't spend it
here. Plain, neutral, **no hype, no thesis** (banned: "disciplined", "industry-leading",
"best-in-class", "mission-critical", "world-class").

### 4.3 The 4-quadrant (What it sells · Who buys it · How it earns · The edge)
A 2×2 box. **Each cell ≤ ~30 words.** This is the "understand any business at a glance"
block — keep it razor-tight.
- **What it sells** — the actual product/platform.
- **Who buys it** — the customer types.
- **How it earns** — revenue mix in one line (e.g. "~90% Data Center").
- **The edge** — the durable moat in one line.

### 4.4 How it makes money (visual + what each segment IS)
A visual/diagram of the revenue engine, tied to **segments** and **geography**.
- Provide **both** views with a **toggle (Segments ⇄ Geography)** when both have ≥2 slices.
- **≥2-slice rule:** a breakdown view renders only if it has ≥2 slices. If a company has a
  single reportable segment or a single geography, **do not draw a one-bar chart** — state it
  in one line ("single reportable segment" / "~X% domestic") and show only the view that
  qualifies. If neither qualifies, omit the visual.
- **Define each segment, don't just size it.** Every segment slice carries a **one-line plain
  definition of what that segment actually is** — pulled from the latest 10-K's segment
  description — not merely its % and $. This is where the reader learns *what* each segment
  sells; the breakdown alone is not enough.
- **Revenue cross-check (mandatory guardrail).** The Segments view and the Geography view are the
  **same total revenue seen two ways** — they MUST reconcile. Enforce
  `sum(segments) == sum(geographies) == reported total net revenue` (allow only stated rounding).
  If they don't tie, it's a data error — fix it before shipping; **never publish two views that
  disagree on the total.**

### 4.5 Products — two tiers (family → specific product)
Put a face to what the company sells. For big multi-product companies (e.g. Broadcom) full
granularity can't fit on one screen, so **tier it**:
- **Tier 1 — a card per product *family*.** Photo (`img/products/<ticker>-*.jpg`); if none, a
  representative **icon/emoji**. A missing image must degrade gracefully (hide, not break). Short
  visible copy only.
- **Tier 2 — inside each card's pop-up, a second level:** an **expandable/collapsible list**
  ("Ver más" / disclosure) of the *specific products* within that family, each with a **punctual
  1–3 line** description of what it does and what it's for. **Never show all specific products at
  once** (overwhelming) — the reader drills into a family, then expands the one item they care
  about. Keep every leaf to ≤3 lines; no walls.

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

### 4.7 Timeline — the corporate lineage, not a news feed
At the very bottom. Every entry answers ONE question: **"why does this matter to what the
company is today?"** If an event doesn't move that needle, it does not belong. A timeline is
**not** a press-release log.

**Genesis first — never take the first origin story you see.** Before writing any entry,
establish *how the company actually came to exist in its current form.* Almost no large company
is a single "founded-as-is" vanilla entity. Determine which it is, and say so plainly:
- Founded and organically the same company today (rare at scale).
- **Spin-off / divestiture** of a parent (Broadcom traces to HP → Agilent → the Semiconductor
  Products Group divested to KKR/Silver Lake → **Avago**, which only *later* merged with the
  separate original Broadcom Corp and took its name).
- **SPAC** merger; **reverse merger**; **uplisting / transfer of listing** from OTC (no true IPO).
- **Roll-up** of many entities via serial M&A and restructurings (e.g. the Liberty Global /
  SiriusXM family — a maze of reorganizations that must be untangled, not glossed).
Trace the lineage to today with **no loose ends or ambiguity**. Don't leave an orphan fact
("Avago IPO'd") with no explanation of where Avago came from or how it became Broadcom. Where the
story is layered, push the depth into a **Read More** (below).

**Read More (per-entry depth):** don't fear them, don't force them — **any, all, or none** of the
entries may carry one, per need. Inside a Read More use **bullet points, sequential**
(what happened → then → then), NEVER a wall of prose. Keep it tight.

**What IS timeline-worthy (include):**
- **Genesis / going-public** — founding (year, founders, as what) **and the *mechanism* of going
  public** (IPO vs direct listing vs SPAC vs reverse merger vs OTC uplisting). The structural
  "how did this become the public company it is."
- **First-ever dividend** — the declaration of the company's *first* dividend ever (a
  coming-of-age signal). NOT subsequent dividends.
- **Spin-offs** (spinning a unit out) and **material divestitures** (selling a business line).
- **Material M&A** — material if ANY of: the target was **listed/public**; the target visibly
  contributed a **current product/service/segment**. Exclude bolt-ons absorbed into
  SG&A/internal tooling. **Failed or blocked deals, and closed deals that became fiascos, ARE
  includable** (e.g. Broadcom's blocked ~$117B Qualcomm bid).
- **Segment evolution** (judgment call) — the strongest segment and/or the fastest-growing *once
  it has become material*. A segment growing +50% but still a tiny slice of revenue is NOT yet
  timeline-worthy — UNLESS it has a story (a new product line, or an M&A'd business restructured
  and relaunched) AND it grew from a small % into a **relevant chunk** (note the launch year and
  when it overtook the prior leader / hit a milestone). **Exception:** a *tiny* secondary segment
  that genuinely "made noise" for a giant (e.g. META's Reality Labs) may be included — but
  **ALWAYS state the scale/magnitude** so the reader isn't misled (Reality Labs is a rounding
  error next to Family of Apps; never imply parity).
- **CEO transitions — only the load-bearing ones:** when the **current CEO** took over, and, if
  the **founder was CEO**, when they stepped down. NOT every CEO change. NOT chairmen/board.
- **Only the LATEST trillion-dollar market-cap milestone** — a single entry for the highest
  trillion threshold reached (e.g. $2T), **NOT** one entry per threshold crossed ($1T *then* $2T
  *then* $3T). Sub-trillion milestones ($1B, $100B…) are noise; drop them entirely.
- **Highly-dilutive capital events only** — a rights issue or offering is NOT relevant *unless
  highly dilutive*; a **private placement** only if highly dilutive AND the placee is another
  large/renowned **industry** company (a fund does not count). **Significant capital reductions**
  ARE relevant.
- **One defining legal / SEC matter — at most ONE, only if truly material** — either the single
  biggest legal battle in the company's history (the most damaging, or a landmark victory), OR a
  **grave SEC / accounting-integrity issue** (a consequential enforcement action, or potential
  creative accounting / a major restatement — e.g. Super Micro; Broadcom's *predecessor*
  options-backdating case). Ordinary litigation does NOT qualify — every company is always in
  some lawsuit — and neither do **filing delays / late filings**. Reserve this slot for the one
  genuinely defining matter, or omit it.
- **Bankruptcy** — Chapter 11 / Chapter 7 filings (and emergence from them).
- **Redomicile / reincorporation** — when it materially changed the company (tax domicile,
  ability to do M&A), e.g. Broadcom Singapore → Delaware (2018), which unlocked large US deals.
- **Name / ticker change** — only when it reflects a structural change (Avago → Broadcom), not a
  cosmetic rebrand.

**What is NOT timeline-worthy (exclude):**
- **Stock splits** (in themselves).
- **Neutral stock dividends** (distinct from in-kind dividends).
- Non-dilutive rights issues / follow-on offerings.
- Sub-trillion market-cap milestones.
- Chairmen / board appointments.
- Routine litigation, minor bolt-on M&A, ordinary product refreshes.
- **Dividend cuts / suspensions and routine capital-allocation choices** (buybacks, dividend
  changes) — discretionary, not structural. (The *first-ever* dividend is the only dividend event
  that qualifies.)
- **Filing delays / late 10-K/10-Q filings** — not timeline-worthy on their own.

Keep each *visible* entry to a short line; push depth into a Read More with sequential bullets.

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
- **Two separate footers.** The **Overview** and the **Deep Dive** each carry their **own**
  source footer (filings/IR, model snapshot date, as-of) — never share one footer across both
  tabs. Footers are for **sources**, not authorship — **do not add analyst/author bylines.**
- **Recency:** prefer the most recent official figures and note the as-of date. Absent an
  official source, use a **reputable, recent** secondary source — never a forum, random article
  or third-party speculation. (Data feeds / APIs will replace manual web-sourcing later; until
  then, label web-sourced peer figures as approximate.)

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
- [ ] Description sourced from filings/IR; neutral; one paragraph; **NON-redundant** (does not
      pre-spend the segments / revenue mix / moat shown in the blocks below); no banned hype words.
- [ ] 4-quadrant cells each ≤ ~30 words.
- [ ] How-it-makes-money respects the **≥2-slice rule** (no one-bar charts); **each segment is
      DEFINED (from the 10-K), not just sized**; **revenue cross-check passes**
      (sum segments == sum geographies == reported total net revenue).
- [ ] Products are **two-tier**: family card → pop-up → expandable list of specific products
      (≤3 lines each); not all specific products shown at once.
- [ ] Competitor scatter: multiple = **EV/EBITDA ⇄ P/E toggle (never P/S)**, Trailing⇄Forward
      basis, **USD bubble size**, detail in pop-up; no-multiple/unlisted peers drop out; peer
      set **consistent** with the Deep Overview's competitive map.
- [ ] Timeline: **genesis established** (how the company came to exist — spin-off/merger/SPAC/
      reverse-merger/uplisting/roll-up — no loose ends); entries pass the **relevance rubric**
      (no splits, only the **latest** $T milestone, no board/chairman noise, ≤1 material litigation, only
      material/failed M&A, only first-ever dividend, only highly-dilutive capital events);
      short visible lines with depth in **Read Mores that use sequential bullets**.
- [ ] Overview and Deep Dive have **separate source footers** (no author/analyst byline).
- [ ] **No walls of text** anywhere in the Overview.
- [ ] **No fake precision** — estimates labeled; illustrative flagged.
- [ ] Sources followed the **official-first hierarchy**; contradictions noted; no
      forum/Reddit used as authority.
- [ ] For migrations: **nothing deleted** — non-conforming content moved to Deep Dive.

If any item FAILS or a fact could not be officially sourced, **say so explicitly** and mark
it for human review before commit/push/PR.
