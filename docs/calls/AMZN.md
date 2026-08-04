# AMZN — Earnings call compendium (historical)

Call records for Amazon.com, **newest first**, per docs/EARNINGS_CONVENTIONS.md §3. The single
most recent call lives in `AMZN-latest.md` (currently Q2 2026 · July 30, 2026).

**⚠ PROVENANCE:** these are **structured records reconstructed from transcript coverage**
(Motley Fool / earnings-day coverage), figures cross-checked against the 8-K exacts in
`js/results-data/amzn.js`. Replace with reflowed IR transcripts as Dani hands them over.

Coverage: Q4 2025 → Q1 2026 (2 quarters; deepens each cycle).

---

## Q1 2026 — April 29, 2026

Participants: Andy Jassy (CEO), Brian Olsavsky (CFO). Release AMC, call ~5:00pm ET.

### The print (8-K)

- Net sales **$181,519M (+17%; +15% ex-FX)** vs $177.3B consensus; guide was $173.5–178.5B (above top).
- Operating income **$23,852M (13.1% margin — highest ever)** vs the $16.5–21.5B guide (+$2.4B over the top).
- EPS **$2.78** vs $1.64 expected — **~$16.8B of pre-tax Anthropic valuation gains** inside it.
- AWS **$37,587M (+28%** — fastest in 15 quarters; $150B run-rate); NA $104,143M (+12%, 7.9% margin);
  International $39,789M (+11% cc, 3.6% margin); Ads $17,243M (+22%).
- Capex **$44,203M** (8-K basis; call quoted $43.2B cash capex) — "primarily AWS and generative AI".
- Guidance: **Q2 net sales $194–199B** (Prime Day in Q2 for most major geos; FX ~10bps headwind);
  **Q2 op income $20–24B** (carries the seasonal SBC step-up, ~$1B YoY of Amazon LEO costs, fuel).

### Prepared remarks — the record

**Jassy:** "It is very unusual for a business to grow this fast on a base this large." AWS AI
run-rate $15B+ in three years; Bedrock 125K+ customers (80% of the Fortune 100), spend +170%
sequentially; Q1 tokens processed exceeded all prior years combined. **Backlog $364B — "that does
not include the recent deal… with Anthropic for over $100 billion."** Custom silicon: **$20B
run-rate, ~+40% QoQ** ("$50B run-rate if sold externally"); **$225B+ of Trainium revenue
commitments**; Trainium3 30–40% over Trainium2, nearly fully subscribed; Trainium4 largely reserved
~18 months out; Graviton in 98% of the top-1,000 EC2 customers, Meta committed to tens of millions
of cores. Retail: store units +15% (highest since COVID); grocery $150B+ gross sales (second-largest
US grocer); 1B+ same/next-day items YTD. Ads: Netflix, Comcast, Samsung partnerships; CreativeAgent
in 7 more countries. LEO: 250+ satellites, commercial service **Q3 2026**, commitments from Delta,
JetBlue, AT&T, Vodafone, DIRECTV LatAm, NBN, NASA, Apple (Globalstar acquisition adds
direct-to-device). Alexa+: 2x conversations, 3x purchase completions.

**Olsavsky:** units +15% vs fulfillment expense +9% (FX-neutral); robotics in every 2026 US
large-format launch; AWS op income $14.2B; capex focus AI infrastructure; **memory component costs
"skyrocketed"**; LEO ~$1B YoY cost increase in Q2, capitalization begins Q4.

### Q&A — the record

- **Sheridan (Goldman):** capacity vs backlog. Jassy: "once-in-a-lifetime opportunity"; no new
  capex guidance but expects significant deployment; chips (Graviton+Trainium) position AWS for
  the inflection.
- **Nowak (Morgan Stanley):** backlog breadth / Rufus. Jassy: backlog broad, not concentrated;
  **Rufus MAU +115%, engagement +400%**; third-party agents mis-price and lack personalization —
  the retailer's own assistant wins.
- **Post (BofA):** OpenAI in Bedrock / Trainium racks. Jassy: GPT-5.4 live, 5.5 "next couple
  weeks"; rack sales **"very much a possibility"** over the next couple of years — current supply
  fully allocated to training.
- **Sanderson (Loop):** LEO. Jassy: 2x downlink / 6x uplink vs incumbents; 20+ launches 2026, 30+
  2027; "a very large, many-billion-dollar revenue business" with an AWS-like capex→FCF profile.
- **Khajuria (Wolfe):** memory inflation / ads in agentic commerce. Jassy: allocations locked with
  strategic suppliers mid-to-late 2025; scarcity accelerates cloud migration; "we're going to like
  this for advertising" — sponsored prompts work, multi-turn = more surfaces.
- **Sebastian (Baird):** demand segments / internal AI. Jassy: labs + enterprise production ("may
  end up the largest and most durable"); a service engine rebuilt in **65 days vs 40–50
  person-years** — "that is a very different world of operating."

### Analysis

**Pass 1 catches:** backlog $364B ex-Anthropic (prepared remarks, not tabulated) · silicon $20B RR
+40% QoQ · $225B Trainium commitments · Rufus +115%/+400% (Q&A-only) · 65-day rebuild · memory
"skyrocketed" (multiplier word) · LEO commercial Q3 2026 + Apple/Globalstar (new proper nouns) ·
tokens > all prior years combined. **Silences:** no updated capex number for FY26 (the ~$200B frame
stands); no AWS margin guide.

**Scoring vs the frozen Q1 list:** AWS acceleration HELD (+28%); capex/FCF frame HELD-but-alive
(record margin WITH the spend; memory front opened); efficiency HELD (units vs cost gap); Rufus
HELD (usage compounding); Rainier/silicon HELD emphatically ($20B RR). No red-line tripped.

**newQuestions → Q2 2026 Watch List:** AWS third acceleration (rank 1) · memory/the $200B frame
(rank 2) · margin peak-or-base (rank 3) · agentic commerce → ads dollars (rank 4) · Trainium rack
sales (rank 5).

Sources: Amazon 8-K (Apr 29, 2026, SEC EDGAR) via js/results-data/amzn.js; Motley Fool Q1 2026
call transcript coverage.

---

## Q4 2025 — February 5, 2026

Participants: Andy Jassy (CEO), Brian Olsavsky (CFO).

### The print (8-K)

- Net sales **$213,386M (+12% ex-FX)** vs $211.3B consensus; guide $206–213B (above top).
- Operating income **$25.0B** (guide $21–26B) — includes **$2.4B special charges**: Italy tax
  settlement $1.1B · severance $730M · physical-store impairments $610M. Ex-charges ~$27.4B.
- EPS **$1.95 vs $1.97** consensus — the only line under, and it is the charges.
- AWS **$35,579M (+24%** — 13-quarter high; $142B run-rate; **35% margin**, +40bps); backlog
  **$244B (+40% YoY, +22% QoQ)**. NA $127.1B (+10%, margin 9%); Intl $50.7B (+11% cc, 2.1%).
- Ads **$21,317M (+22%)**; $12B of incremental ad revenue in 2025; Prime Video ads 315M viewers.
- FY25 capex $131.8B; TTM FCF $11.2B; FY25 operating cash flow $139.5B (+20%).
- Guidance: **Q1 2026 net sales $173.5–178.5B** (FX ~180bps tailwind), **op income $16.5–21.5B**.
- **The frame: "about $200 billion in capital expenditures… predominantly in AWS, because we have
  very high demand."** Stock dipped on the print despite the beats.

### The record — highlights

**Jassy:** AWS "fastest we've seen in thirteen quarters"; >1GW of capacity added in Q4 ("more than
any other company in the world" for 2025); 3.99GW of power added in 2025 (2x 2022), doubling again
by 2027. Custom chips $10B+ run-rate; Graviton >50% growth, >90% of top-1,000 customers; Trainium
triple-digit; **Project Rainier: 500K chips** training the next Claude model ("you will see that
continuing to increase"); Trainium3 "nearly all supply committed by mid-2026". Bedrock spend +60%
QoQ. Retail: lowest-priced US retailer 9th straight year (14% below other majors); everyday
essentials 1-in-3 units; 8B+ items same/next-day (+30%); **Rufus: 300M customers in 2025, users
"60% more likely to complete a purchase"**, shops tens of millions of items in other stores. LEO:
180 satellites; 20+ launches 2026, 30+ 2027; commercial "later in 2026"; AT&T, DIRECTV LatAm,
JetBlue, NBN signed. Alexa+ free for Prime. TNF most-streamed NFL season (31.6M for Packers–Bears).

**Olsavsky:** the $2.4B charges breakdown; 1M+ robots in the network; perishables to 2,300+
cities; "as fast as we install this capacity, this AI capacity, we are monetizing it — it's just a
very unusual opportunity."

**Q&A:** Mahaney (Evercore) — ROIC/duration: AWS 35% margin "we will see how that develops."
Anmuth (JPM) — Rainier 500K → more. Sandler (Barclays) — the AI market "barbelled"; enterprise
production workloads "may end up being the largest and most durable." Morton (MoffettNathanson) —
funnel compression: the 60%-completion Rufus stat. Nowak (MS) — efficiency: regions 8 → 10, robots.
Sheridan (Goldman) — backlog "vast majority consumed by external customers."

### Analysis

**Pass 1 catches:** the ~$200B frame (the number of the call) · backlog $244B +40% · Rainier 500K ·
Trainium3 supply committed to mid-2026 · 3.99GW/doubling · Rufus 300M/60% · charges breakdown ·
1M robots. **Scoring vs the frozen list:** AWS re-acceleration HELD; the 2026 frame — the FCF
red-line **TRIPPED** (the model flipped FY26 FCF negative at the next snapshot); holiday efficiency
HELD (NA margin up in the peak quarter); silicon HELD. **newQuestions → Q1 2026 list:** AWS into
the build (1) · capex cadence/FCF (2) · efficiency off-peak (3) · Rufus → dollars (4) ·
Rainier 500K → 1M (5).

Sources: Amazon 8-K (Feb 5, 2026, SEC EDGAR) via js/results-data/amzn.js; Motley Fool Q4 2025 call
transcript coverage; CNBC earnings-day coverage.
