# LYFT — Earnings call compendium (historical)

Call records for Lyft, Inc., **newest first**, per docs/EARNINGS_CONVENTIONS.md §3. The single most
recent call lives in `LYFT-latest.md` (currently Q1 2026 · May 7, 2026).

**PROVENANCE:** prepared-remarks quotes are read directly from **Lyft's own Prepared Remarks PDFs**
(primary source — Lyft publishes them). Q&A quotes are targeted extractions from third-party
transcripts and are labelled. Figures are from each quarter's 8-K press release.

Coverage: Q4 2025 here, Q1 2026 in `LYFT-latest.md` — **both are now built out end-to-end in the
Earnings tab** (frozen setup → print → call). Older narrative threads back to Q4 2023 are held in the
`LY_THEMES` compendium inside `js/overviews/lyft.js`, which folds in under the Watch List per
EARNINGS_CONVENTIONS §6/v2.3.

---

## Earnings calendar (verified against SEC 8-K filings, CIK 0001759509)

All Lyft releases are **after market close**, so the scoreable reaction is always the NEXT trading day.

| Quarter | Report date | Accession |
|---|---|---|
| **Q2 2026** | **August 6, 2026** (upcoming) | — |
| Q1 2026 | May 7, 2026 | 0001628280-26-032102 |
| Q4 2025 | February 10, 2026 | 0001628280-26-006817 |
| Q3 2025 | November 5, 2025 | 0001628280-25-049556 |
| Q2 2025 | August 6, 2025 | 0001759509-25-000123 |
| Q1 2025 | May 8, 2025 | 0001759509-25-000084 |

## Price reaction record (next-day close; two independent sources agree to the cent)

| Quarter | Close day before | Close day of | Next-day close | **Reaction** |
|---|---|---|---|---|
| Q1 2026 | $14.23 | $14.16 | $14.35 | **+1.34%** |
| Q4 2025 | $16.61 | $16.85 | $13.99 | **−16.97%** |
| Q3 2025 | $19.42 | $20.08 | $21.25 | **+5.83%** |
| Q2 2025 | $14.51 | $13.99 | $14.21 | **+1.57%** |
| Q1 2025 | $12.59 | $13.00 | $16.65 | **+28.08%** |

⚠ **Do not use after-hours prints for this name.** The overnight tape was flatly wrong twice in five
quarters: Q2 2025 went −5.5% AH → **+1.57%** at the close, and Q1 2025 went +7% AH → **+28.08%**
(Lyft's best day since Feb 2024). Investing.com's LYFT after-hours numbers are systematically
garbled — for Q1 2026 it computed the move off the *wrong* prior close, and for Q3 2025 it labelled
a normal regular-session move as aftermarket. Use the next-day close.

## Street consensus record — COMPILED BY HAND, per print

⚠ **Lyft has no rows in `BBG_CONSENSUS.txt`** (the archive carries GOOG/GOOGL/HOOD/KKR/MA/META/UBER
only). There is no matrix to reconstruct, so every consensus figure we use is compiled from
earnings-day coverage and recorded here. **A quarter with no defensible published number stays
blank** — do not interpolate, and do not promote a single broker's model to "consensus".

| Quarter | Revenue | Adj. EBITDA | Gross Bookings | Rides / Riders | Source |
|---|---|---|---|---|---|
| **Q2 2026** (upcoming) | $1.84B | $169M | $5.31B | — | GB/EBITDA/margin = consensus reported against the guide on 7 May 2026 (**~3 months stale**); revenue = current aggregate (~40 contributors). EPS ~$0.15 (adj.) |
| Q1 2026 | $1.64B | $130.7M | $4.91B | **rides 241.5M** | Investing.com preview (+13.1% YoY); StockStory ($1.63B, EBITDA, $0.07 GAAP EPS); TIKR (GB + rides) |
| Q4 2025 | $1.76B | — | *"in line"*, no figure | — | Zacks; corroborated by coverage noting **adjusted** revenue "matched analyst expectations of $1.76 billion". EPS $0.32 (Zacks, normalised) |
| Q3 2025 | $1.70B | — | — | — | Zacks (−0.85% revenue surprise). EPS $0.30 adj. vs $0.26 |
| Q2 2025 | $1.61B | $124.4M | — | — | FactSet (revenue); StockStory (EBITDA, +4.1% beat; adj. EPS $0.28) |
| Q1 2025 | $1.47B | — | $4.15B | — | LSEG (revenue); StreetAccount (bookings) |
| Q4 2024 | $1.56B | $103.9M | $4.32B | **rides 218.65M · riders 24.41M** | StockStory (revenue + EBITDA); Zacks (bookings, rides, riders). ⚠ Zacks had revenue at $1.55B |
| Q3 2024 | $1.42B | — | — | — | Zacks (+7.0% revenue surprise). EPS $0.20 adj. vs $0.29 |
| Q2 2024 | $1.386B | — | — | — | Zacks (+3.6% revenue surprise). EPS $0.19 adj. vs $0.24 |
| Q1 2024 | — | — | — | — | **Left blank on purpose** — only a rounded "beat estimates by 10%" was published; back-solving it would invent precision |

⚠ **The column mixes houses** — Zacks, LSEG, FactSet, StreetAccount, StockStory and TIKR all appear,
and where two published the same line they disagree by up to ~0.6% (Q4 2024 revenue). **Read a
surprise inside ±1.5% as noise.**

### The regime change the record exposes

| | 2Q24 | 3Q24 | 4Q24 | 1Q25 | 2Q25 | 3Q25 | 1Q26 |
|---|---|---|---|---|---|---|---|
| Revenue vs Street | **+3.6%** | **+7.2%** | −0.6% | −1.3% | −1.4% | −0.9% | +0.6% |
| Adj. EBITDA vs Street | — | — | **+8.6%** | — | **+4.0%** | — | **+1.6%** |

Through 2024 the Street **under-modelled revenue badly** — it was slow to price Lyft's take-rate
expansion. From 4Q24 it over-corrected and has modelled revenue **slightly high** ever since, while
**consistently under-modelling profitability**. So on this name the base case is a *small revenue
miss alongside an EBITDA beat*: a sub-1.5% revenue miss is close to meaningless, and the information
lives in adjusted EBITDA and in the counts. (4Q25's −9.5% is the exception, and it is the charge.)

**The counts are where the surprises actually are, and almost nobody publishes them.** Only two
quarters carry a rides consensus. One of them, **1Q26, came in 1.9% short** — 236.9M against 241.5M,
falling sequentially, in the quarter every headline called a beat.

**Three traps recorded so they are not re-learned:**

1. **The Q4 2025 revenue "miss" was the charge.** $1,592.7M against $1.76B is −9.5%, and the gap is
   *exactly* the **$168M contra-revenue charge**. Ex-charge the quarter matched consensus. The
   $210M/$168M split was disclosed **only in Q&A** — the first wave of coverage did not have it,
   and the stock fell 17%.
2. **EPS bases are mixed in the wild.** Zacks' $0.32 for Q4 2025 and the ~$0.15 circulating for
   Q2 2026 are **adjusted/normalised**; our Results row is **GAAP diluted EPS**. Only the Q1 2026
   $0.07 is a GAAP estimate. Scoring a GAAP actual against an adjusted estimate manufactures a
   surprise out of a definition change.
3. **A stale preview can look current.** A finviz/StockStory page dated **Aug 4 2025** ("Q2
   earnings: what to expect", revenue $1.61B, "$1.45B last quarter") is the **Q2 2025** preview and
   reads as if it were 2026. Check the publication date and reconcile the prior-quarter figure
   against the actuals table before using any preview.

**Q2 2026 — where the guide sits vs the Street:** bookings guided to **$5.30–5.43B (mid $5.365B)
against a $5.31B Street**, so Lyft guided *above* consensus; adjusted EBITDA **$160–180M (mid $170M)
against $169M**, essentially on top of it. The margin: guided 3.0–3.3% against a 3.19% consensus.

## Market data (as of Jul 30–31, 2026)

Last close **$15.55** (Jul 30, +0.71%). 52-week range **$12.46** (Mar 30, 2026) – **$25.54**
(Nov 12, 2025). Market cap **$5.87B**; EV $5.47B; beta 1.81.

**Share structure — Lyft is no longer dual-class.** Per the Q1 2026 10-Q: during Q3 2025 shareholders
voluntarily converted all 8.5M Class B shares into Class A, *"no Class B common stock is outstanding
and no additional shares of Class B common stock will be issued."* Class A outstanding **379,682,532**
(10-Q cover, May 1 2026); weighted-average diluted 402.5M in Q1 2026.

⚠ **Screen-data trap:** stockanalysis shows a trailing P/E of ~2.2 on EPS of $7.04. That is the
one-time **deferred-tax valuation-allowance release** booked in Q4 2025 (~$3B GAAP benefit), not
earnings power. Forward P/E is ~9. Never quote the 2.2x unqualified.

---

## Q4 & FY2025 — February 10, 2026 (after close, call 5:00–5:45pm EST)

Participants: **David Risher (CEO)**, **Erin Brewer (CFO)**.

### The print

- **Record Q4 and full-year results**; FY2025 cash flow generation exceeded **$1.1B**.
- Q4 volume: **51.3 million riders taking 946 million rides** in the year (*"That's 30 rides a
  second"* — Risher).
- ⚠ Revenue carried a **$210M legal/tax/regulatory reserve charge, of which $168M hit revenue**
  (Brewer, in Q&A — the $210M total and its composition were NOT in the press release). Ex-charge,
  revenue would have been ~$1.8B.
- **A ~$3B GAAP income tax benefit** from releasing the tax valuation allowance.
- **Insurance reserves rose to $2.18B** at Dec 31 2025 from $1.70B in 2024.
- **New $1.0B share repurchase authorization** — *"representing roughly 15% of Lyft's market
  capitalization, as of today"* (implying a ~$6.7B market cap). FY2025 buybacks were ~$500M,
  *"which reduced our share count by mid-single digits."*

### Prepared remarks — the record (VERBATIM, primary source)

> *"Lyft is not the same company it was just a few years ago; we've transformed. We went global,
> entering nine countries in Europe through Freenow, broadened our offerings to include all members
> of the family from grandparents to grandpets, entered the luxury space, smashed financial records,
> and delivered on our commitments."*

**On the 2027 long-range plan:** *"TL;DR - we're on track."* The three goals as stated: *"~$25 billion
in Gross Bookings" / "~$1 billion Adjusted EBITDA" / "~$900 million in free cash flow, which we
updated to over $1 billion."*

**On 2026** (press release): *"2026 will be the year of the AV with deployments in the U.S. and
overseas."*

**The AV opportunity framing — and the key rebuttal to the AV-threat thesis:**
> *"We believe AVs represent a massive, trillion-dollar opportunity… In San Francisco, the global hub
> for this tech, the market added millions of new rides to the ecosystem in Q4 alone. Meanwhile, Lyft
> rides in the region grew almost 10%."*

> *"AVs are going to expand the TAM of rideshare. There's just no doubt about it."* (Q&A) — paired
> with the near-term reality check: *"AVs are not going to be material in 2026, you know, from a
> financial perspective."*

**Why hybrid, not AV-only:**
> *"Rideshare demand is inherently uneven, with peaks and troughs that can vary by 20x in San
> Francisco throughout the day and week… AVs provide consistent baseline supply across extended
> hours… Human drivers offer the flexibility to efficiently handle demand spikes."*
> And blunter, in Q&A: *"hybrid network, a hybrid network. This is so important. You cannot build an
> AV only."*

**The Flexdrive cost moat:** *"We estimate our operations can deliver additional cost efficiencies of
more than 20%, on top of the broad AVs savings, on a per mile basis."* Brewer added in Q&A that
Flexdrive's control could push that to *"24%, 25%."*

**On discipline over volume:**
> *"As the quarter evolved, we made intentional tradeoffs that influenced ride growth, prioritizing
> durable financial performance over dilutive volume. During a season of heightened competitive
> promotions, we prioritized the most durable, profitable demand in the marketplace."*

**Lyft Teen** launched Feb 9, 2026, the day before the call: *"addresses a 15 billion ride TAM of 13
to 17-year-olds, just in the U.S."*

**California insurance reform:** *"Recent legislation in California is lowering rideshare costs
statewide. While we expect this to drive increased demand over time, broad-based consumer adoption
will take time to materialize and we now anticipate this being **back-half weighted**."*
(⚠ This was **beaten** — on the Q1 call Brewer reported California outpacing other top regions
already in February/March.)

### Q&A — the roster (9 questions)

Sheridan (Goldman) product innovation → Anmuth (JPMorgan) Q1 bookings vs flat margin + **Flexdrive's
20% cost efficiency** → Blackledge (TD Cowen) promo activity into Q1 → Kelly (Oppenheimer) the taxi
opportunity's financial profile → Devnani (Bernstein) margin bridge to 2027 + **pricing/promos in
AV-heavy markets like the Bay Area** → Black (Deutsche) California insurance phasing → Morton
(MoffettNathanson) **does the lack of new Waymo partnerships signal friction?** + take rate →
Sandler (Barclays) Flexdrive locations and retrofit capex → Post (BofA) US AV supply pipeline.

**Risher on the "few AV partners" question:** reframed it as deliberate selectivity, not economic
friction — Lyft chooses *"a relatively small number of partners"* for deep engagement, and *"there
just aren't that many people who can operate at scale"* with proven safety records.

### Said on the call but NOT in the press release

The **departure of Aurélien Nolf** (VP FP&A and IR) — announced verbally only: *"Aurelien, you have
been an incredible thought partner and finance leader."* He became **CFO of Navan effective March 2,
2026**, announced the same day. **Erin Rome** succeeded him in IR. Also call-only: the $210M/$168M
charge split; Super Bowl metrics (**15% more rides at ~20% lower surge**); the Flexdrive
"24%, 25%" upside and sub-27 location count; the named future AV suppliers to watch (**Rivian,
NVIDIA, Mobileye, Zoox** — with Risher's caveat *"who the winners are, that's the thing that nobody
really knows"*); SF growth *"around 10%"* despite AV density; and Brewer's characterization of
promotional intensity as *"weighted a little bit toward the back half… primarily across the lower
end. But effects were temporary."*

### Analysis (Part I passes — feeds the Earnings build)

**Pass 1 catches:** the $210M charge and its $168M revenue hit (Q&A-only, not tabulated) · the
~15%-of-market-cap buyback authorization · SF +10% against AV densification (the single best
datapoint against the AV-threat thesis) · Super Bowl 15%/−20% surge · Flexdrive 24–25% · the 2027
plan's FCF goal being RAISED from ~$900M to over $1B · insurance reserves $1.70B → $2.18B.
**Silences:** no partner named for Dallas; no Hamburg vehicle partner; Price Lock absent entirely.

**Recurring-theme note (§2 Pass 1.5):** driver preference advantage went **31 points (Q4) → 38 points
(Q1)** — two consecutive quarters of a management-chosen metric, which auto-promotes it to a trend.

Sources: Lyft Q4 2025 Prepared Remarks PDF (primary); Q4 2025 press release and 8-K (SEC EDGAR,
accession 0001628280-26-006817); Motley Fool / stockanalysis.com / Investing.com / Insider Monkey Q4
2025 transcripts; CNBC and Reuters earnings-day coverage; StockAnalysis + Yahoo Finance chart API for
prices; Navan IR and BusinessWire for the Nolf appointment.
