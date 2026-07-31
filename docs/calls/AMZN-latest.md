# AMZN — Latest earnings call · Q2 2026 (July 30, 2026)

The working file for the current cycle per docs/EARNINGS_CONVENTIONS.md §3. When the Q3 2026 call
lands (~late October 2026), this rotates to the TOP of AMZN.md and the new call takes this slot.

**⚠ PROVENANCE / TO UPGRADE:** the **print figures below are 8-K exacts** — Exhibit 99.1 filed
2026-07-30, accession `0001018724-26-000024` (SEC EDGAR), verified directly. The **call record is
reconstructed from transcript coverage** (Investing.com / Seeking Alpha / GuruFocus transcript
articles); the verbatim IR transcript was not on hand at build time (2026-07-31). **Drop in the
reflowed IR transcript when Dani hands it over.**

---

## Q2 2026 — July 30, 2026

Participants: Andy Jassy (CEO), Brian Olsavsky (CFO), Dave Fildes (IR). Release AMC, call 2:00pm PT
/ 5:00pm ET.

### The print (8-K Ex. 99.1)

- Net sales **$200,606M (+20%; +20% ex-FX, FX +$0.1B favorable)** vs $196.4B consensus (LSEG) and a
  **$194–199B guide — above the top**.
- Operating income **$27,461M (13.7% margin — the highest ever)** vs a **$20–24B guide** (+$3.5B over
  the top) and $23.7B modelled.
- Net income **$62,647M**; diluted EPS **$5.75** vs $1.82 expected — ⚠ includes **$53,415M of pre-tax
  other income, primarily the Anthropic investment mark** (vs $1,117M a year ago). Tax provision
  $18,199M of which **$17,691M deferred**.
- AWS **$42,232M (+37%** — fastest in **18 quarters**; **$169B annualized run-rate**); segment op
  income **$16,621M (+64%, 39.4% margin)**.
- North America **$116,177M (+16%)**, op income $9,123M (7.9%). International **$42,197M (+15%)**,
  op income $1,717M (4.1%) — the one line under the Street ($42.7B) and under Summit ($43.4B).
- Revenue lines: Online stores **$70,432M (+15%)** · Physical stores **$5,794M (+4%)** · 3P seller
  services **$46,780M (+16%)** · **Advertising $19,809M (+26%)** · Subscriptions **$13,730M (+12%)** ·
  Other $1,829M (+22%). WW paid units **+17%**; shipping costs $27,873M (+19%); SBC $6,038M;
  employees 1,595,000.
- Cash: TTM operating cash flow **$161,403M (+33%)**; **TTM free cash flow −$7,604M** (from +$18,184M
  a year ago) — "driven primarily by a year-over-year increase of $66.1 billion in purchases of
  property and equipment… primarily reflects investments in artificial intelligence."
- Capex: **$54,208M gross** in the quarter ($53,076M net of $1,132M proceeds); 1H26 gross $98,411M;
  TTM net capex $169,007M (+64%). Long-term debt **$65,648M (Dec-2025) → $128,894M** — $66,998M
  raised in the half. Total assets $1,095,689M (Other assets $284,132M on the Anthropic mark).
- Release business highlights: **AWS AI business >$25B annualized run-rate** and **chips business
  >$25B run-rate**, each growing triple-digit; Anthropic and OpenAI both making "multi-year,
  multi-gigawatt" Trainium commitments; **Graviton5 GA**. Jassy: "AWS is booming, growing 36.7%
  year-over-year in Q2 — our fastest growth in 18 quarters — and our AI and Chips businesses each
  eclipsed run rates of more than $25 billion."
- **Guidance (Q3 2026): net sales $197.0–202.0B (+9–12%)**, with ~80bps unfavorable FX assumed and
  the note that **ex-Prime-Day timing (Q3 2025 vs Q2 2026) growth would be nearly 400bps higher**;
  **operating income $22.5–26.5B** (vs $17.4B in Q3 2025, which carried $4.3B of charges). New
  assumption language: **no impact from energy derivative contract remeasurements**.

### The call — the record

**Capex frame raised:** FY2026 cash capex guidance increased to **~$220B from ~$200B**; Olsavsky
attributed part of the increase to the **"higher cost of memory"** — the same input Jassy said had
"skyrocketed" in Q1.

**Backlog and capacity:** AWS backlog **$496B**, growing triple-digit (Gawrelski put it at ~2.5x the
prior year). **2027 capacity "largely reserved"**, some **2028 capacity "already spoken for"**;
constraints expected to persist into 2027–2028.

**Margin quality, disclosed against interest:** AWS margin 39.4%, **+650bps YoY but ~+520bps
excluding energy-derivative accounting gains** (Olsavsky). Margins "aren't random" — attributed to
disciplined efficiency gains (silicon mix, power efficiency, utilisation).

**Jassy on returns:** "We have clear line of sight to strong financial returns"; reiterated AWS can
become "a trillion-dollar annual revenue business."

**Consumer / other:** ~**$600M of tariff-related refunds** received in Q2 (the majority of expected
refunds); same-day perishables customers **+50%** since the start of the year; same-day orders
average **3x more units** per order; grocery and everyday essentials growing faster than the rest of
the business. Advertising +26%, sponsored products the driver.

### Q&A — the record

- **Doug Anmuth (J.P. Morgan):** AWS margin sustainability under AI investment; whether Amazon needs
  its own frontier model.
- **Justin Post (Bank of America):** AWS acceleration drivers; 2027 capacity additions.
- **Brian Nowak (Morgan Stanley):** 2027 data-centre investment timelines; **Trainium sales to
  third-party data centres** (the merchant question, still unanswered as a plan).
- **Colin Sebastian (Baird):** application-layer expansion (Kiro, Transform); how the capital is
  sourced.
- **Ken Gawrelski (Wells Fargo):** backlog at ~2.5x YoY vs capacity planning; AWS pricing amid cost
  inflation.
- **Eric Sheridan (Goldman Sachs):** fast-commerce / grocery adoption across geographies.

### Analysis (Part I passes — feeds the Earnings tab in js/overviews/amzn.js)

**Pass 1 catches:** backlog $496B (prepared remarks, not tabulated) · "2027 largely reserved / some
2028 already spoken for" (the capacity-reservation language, new this call) · AI business AND chips
business each >$25B run-rate (in the RELEASE, a first) · **OpenAI joining Anthropic on multi-GW
Trainium commitments** (new proper noun in the commitment list) · the ~130bps energy-derivative
adjustment volunteered by the CFO (candor against interest) · ~$600M tariff refunds · same-day
perishables +50%, 3x units per same-day order · "trillion-dollar annual revenue business"
(multiplier language) · TTM FCF negative for the first time in the build.

**Silences:** no partner/co-investment vehicle announced despite the funding gap (contrast Meta's
BlackRock JV); no megawatt numbers behind the "reserved" capacity language; no AWS margin guide.

**Scoring vs the frozen Q2 list:** AWS acceleration **HELD emphatically** (+37%, backlog $496B);
the capex/FCF red line **TRIPPED** (TTM FCF −$7.6B, frame to ~$220B, debt nearly doubled) — it fired
in reported actuals, not just in the model; margin peak-or-base **HELD** (13.7% record); agentic →
ads **HELD** (+26%, an acceleration); silicon **HELD** (chips >$25B RR, two frontier tenants).

**newQuestions → Q3 2026 Watch List:** conversion pace vs reserved capacity (rank 1) · the funding
mix under ~$220B with FCF negative (rank 2) · clean ~38% AWS margin under the depreciation ramp
(rank 3) · advertising through the Prime-Day flip quarter (rank 4) · Trainium merchant path
(rank 5).

**Price reaction:** Jul 30 close **$235.50 (+3.90%)** — the move happened BEFORE the print, as the
tape rotated into AI winners. After hours **+9.1% (~$257)**; Jul 31 pre-market **$265.01 (+12.5%)**.
Jul 31 official close not yet available at build time — fill it in `CALLS` before quoting a settled
number.

Sources: Amazon 8-K Ex. 99.1 (Jul 30, 2026, SEC EDGAR accession 0001018724-26-000024); prior-quarter
8-K Ex. 99.1 (accession 0001018724-26-000012) for the Q2 guide; CNBC earnings-day coverage for LSEG
consensus and StreetAccount for AWS/ads/capex consensus; Investing.com / Seeking Alpha / GuruFocus
Q2 2026 call transcript coverage; stockanalysis.com for prices.
