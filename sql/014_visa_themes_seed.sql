-- ════════════════════════════════════════════════════════════════════════════
-- 014_company_themes — VISA (V) seed (synthesized)
-- ════════════════════════════════════════════════════════════════════════════
-- Migrates Visa's hardcoded Watch List (CALL_PREP.quarters[].watchList in js/overviews/visa.js)
-- into company_themes, so the Watch List becomes the shared, persistent, Supabase-backed engine
-- (js/watchlist.js) instead of in-file rows. Mirrors sql/013 (IBKR).
--   definition = the interpretation: the `why` + `🔎 The tell:` (the row's `pista`) + `⛔ Red-line:`
--                (the row's `breaks`) — never truncated (per EARNINGS_CONVENTIONS watch-list rule).
--   created_quarter = track_since (the quarter the theme was first opened).
--   Live/upcoming quarter (Q3 FY2026) → track_until NULL (open hooks). Reported quarters →
--                track_until = that quarter (closed / frozen history).
-- Run AFTER 010, once. No-op if V is not in `companies` (Visa's ticker in the portal is 'V').

insert into company_themes
  (company_id, ticker, q, created_quarter, rank, theme, tags, definition, track_since, track_until, seeded_by, src, thread)
select c.id, 'V', e.q, e.created_quarter, coalesce(e.rank, 0), e.theme,
       coalesce(array(select jsonb_array_elements_text(e.tags)), '{}'),
       e.definition, e.track_since, e.track_until, e.seeded_by, e.src, e.thread
from companies c,
  jsonb_to_recordset($seed$
[
  {
    "q": "Q3 FY2026",
    "created_quarter": "Q2 FY2026",
    "rank": 1,
    "theme": "VAS + CMS — structural or event-inflated?",
    "tags": ["vas", "cms", "marketing-services"],
    "definition": "VAS+CMS is the whole re-rating case: structurally mid-20s makes Visa a faster-growth company than the Investor-Day framed; event-inflated leaves the multiple exposed.  🔎 The tell: Combined VAS+CMS growth ex-FIFA/Olympics — does it hold the mid-20s, or fade toward the Investor-Day 16–18% frame as the events lap?  ⛔ Red-line: Combined growth decelerates toward low-teens once event-driven marketing services lap — revealing the mid-20s as cyclical, not the new structural rate.",
    "track_since": "Q2 FY2026",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 FY2026",
      "n": "Kupferberg pushed on VAS+CMS running mid-20s vs the ~16–18% Investor-Day frame; Suh declined to guide to pillars and flagged CMS one-time adjustments / deal timing that \"won't reoccur\"."
    },
    "src": "Q2 FY2026: VAS +27% cc (30% of net revenue); CMS +24% cc (highest in recent quarters) — but partly one-time.",
    "thread": [
      { "q": "Q1 FY2026", "n": "VAS +18% cc; new-flows/CMS +19% cc." },
      { "q": "Q2 FY2026", "n": "VAS +27% cc; CMS +24% cc — both accelerated, but partly one-time/event." }
    ]
  },
  {
    "q": "Q3 FY2026",
    "created_quarter": "Q2 FY2026",
    "rank": 2,
    "theme": "Volatility / FX as an earnings crutch",
    "tags": ["volatility", "cross-border", "fx"],
    "definition": "FX/volatility is the least predictable, lowest-quality part of the revenue algorithm — leaning on it flatters the print and reverses without warning.  🔎 The tell: International-transaction revenue vs cross-border volume growth — how much of the revenue beat is volatility management itself says normalizes?  ⛔ Red-line: A normalized-volatility quarter exposes core net-revenue growth materially below the reported trend.",
    "track_since": "Q2 FY2026",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 FY2026",
      "n": "Suh named volatility the #1 driver of the Q2 upside (still a YoY drag but better than feared); Q3 assumes volatility back to the original October guide — a tougher comp."
    },
    "src": "Q2 FY2026: net revenue +17% \"largely driven by higher-than-expected volatility\"; intl-transaction revenue +10% vs +11% cross-border volume.",
    "thread": [
      { "q": "Q1 FY2026", "n": "Intl-transaction revenue better than expected on higher volatility; +14% vs +16% cross-border volume." },
      { "q": "Q2 FY2026", "n": "Volatility again the top beat driver; guided lower into Q3." }
    ]
  },
  {
    "q": "Q3 FY2026",
    "created_quarter": "Q2 FY2026",
    "rank": 3,
    "theme": "Stablecoin & agentic — the first real economics",
    "tags": ["stablecoin", "agentic", "new-flows"],
    "definition": "The bull case treats agentic/stablecoin as pure TAM expansion; if the unit economics are dilutive, a rising volume mix could pressure yield rather than lift it.  🔎 The tell: Any quantification at all — take rate, revenue, or margin — on stablecoin rails / agentic transactions, vs the current \"similar economics to today's products\" assertion.  ⛔ Red-line: First disclosed economics show a take rate structurally below card economics — the volume is real but dilutive.",
    "track_since": "Q2 FY2026",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 FY2026",
      "n": "Matt O'Neill asked directly whether stablecoin/agentic transactions are accretive/dilutive; Ryan only asserted \"very similar economics to the products we have today\" — no numbers."
    },
    "src": "Q2 FY2026: stablecoin card volume +~200% YoY; $7B stablecoin settlement run-rate (+50% QoQ, 9 blockchains); Visa CLI / Intelligent Commerce Connect launched — all narrative, no economics.",
    "thread": [
      { "q": "Q1 FY2026", "n": "X Money on Visa Direct; A2A/stablecoin framed as opportunity, not threat." },
      { "q": "Q2 FY2026", "n": "Economics asked, deflected; 160+ stablecoin card programs." }
    ]
  },
  {
    "q": "Q3 FY2026",
    "created_quarter": "Q2 FY2026",
    "rank": 4,
    "theme": "Incentive trajectory (net-yield pressure)",
    "tags": ["incentives", "renewals"],
    "definition": "Incentives are the contra-revenue competitive renewals drive — a persistent step-up signals pricing given away to keep portfolios.  🔎 The tell: Client-incentive growth vs the guided \"step-up\" — does it run hotter than framed, pressuring net-revenue yield?  ⛔ Red-line: Incentive growth materially exceeds the guided step-up, compressing net yield beyond what pricing offsets.",
    "track_since": "Q2 FY2026",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 FY2026",
      "n": "Incentives grew 14% in Q2 — BELOW plan (deal timing / performance adjustments); Suh guided a step-up into Q3 as it laps the Q3'25 low point."
    },
    "src": "Q2 FY2026: client incentives +14%, \"lower than expectations\"; Q3 flagged as the step-up quarter.",
    "thread": [
      { "q": "Q1 FY2026", "n": "Incentives +13%, a strong renewal quarter." },
      { "q": "Q2 FY2026", "n": "Incentives +14%, below plan; Q3 step-up guided." }
    ]
  },
  {
    "q": "Q3 FY2026",
    "created_quarter": "Q2 FY2026",
    "rank": 5,
    "theme": "US consumer + cross-border into FIFA",
    "tags": ["consumer", "cross-border", "travel"],
    "definition": "Cross-border ex-Europe is the highest-yield line; the H2 guide leans on an event-driven inbound recovery that has to show up in the numbers.  🔎 The tell: Does the FIFA World Cup actually lift US + LatAm inbound travel as guided, offsetting the Middle-East / CEMEA drag?  ⛔ Red-line: Inbound travel doesn't materialize and cross-border decelerates below ~9–10% cc.",
    "track_since": "Q2 FY2026",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 FY2026",
      "n": "Management built the H2 cross-border guide on FIFA-driven US + LatAm inbound travel and lapping low prior-year US inbound — an assumption, not yet a result."
    },
    "src": "Q2 FY2026: CEMEA payments volume −2.5pts on the Middle-East conflict; April cross-border +9% (Ramadan-distorted); FIFA <45 days out.",
    "thread": [
      { "q": "Q1 FY2026", "n": "Cross-border +16% cc, strong holiday + travel." },
      { "q": "Q2 FY2026", "n": "Cross-border +11% cc; Middle-East drag; FIFA recovery assumed for H2." }
    ]
  },
  {
    "q": "Q2 FY2026",
    "created_quarter": "Q1 FY2026",
    "rank": 1,
    "theme": "VAS growth durability",
    "tags": ["vas", "marketing-services"],
    "definition": "The diversifier and the multiple support.  🔎 The tell: Can VAS sustain high-teens+ cc, and how much is event-driven (Olympics/FIFA)?  ⛔ Red-line: VAS decelerates toward mid-teens with no offsetting acceleration in core payments.",
    "track_since": "Q1 FY2026",
    "track_until": "Q2 FY2026",
    "seeded_by": {
      "q": "Q1 FY2026",
      "n": "Sakhrani asked whether VAS (28% growth cited) can sustain; Ryan walked the three buckets but gave no durability number."
    },
    "src": "Q1 FY2026: VAS +18% cc, ~30% of net revenue.",
    "thread": [
      { "q": "Q1 FY2026", "n": "VAS +18% cc, ~30% of net revenue." },
      { "q": "Q2 FY2026", "n": "VAS +27% cc — accelerated and beat; now 30% of net revenue." }
    ]
  },
  {
    "q": "Q2 FY2026",
    "created_quarter": "Q1 FY2026",
    "rank": 2,
    "theme": "Cross-border resilience vs macro/geopolitics",
    "tags": ["cross-border", "travel", "consumer"],
    "definition": "Highest-yield revenue line and the consumer-health pulse.  🔎 The tell: Does cross-border ex-Europe hold double digits despite the Middle-East and FX?  ⛔ Red-line: Cross-border volume growth drops below ~10% cc on travel weakness.",
    "track_since": "Q1 FY2026",
    "track_until": "Q2 FY2026",
    "seeded_by": {
      "q": "Q1 FY2026",
      "n": "Q1 cross-border ran +16% cc on holiday + strong dollar; the question into Q2 was whether that pace holds as those tailwinds fade."
    },
    "src": "Q1 FY2026: cross-border +16% cc, 3pts above Q4.",
    "thread": [
      { "q": "Q1 FY2026", "n": "Cross-border +16% cc, 3pts above Q4." },
      { "q": "Q2 FY2026", "n": "Cross-border +11% cc; held double digits despite the Middle-East drag." }
    ]
  },
  {
    "q": "Q2 FY2026",
    "created_quarter": "Q1 FY2026",
    "rank": 3,
    "theme": "US consumer health / spend bands",
    "tags": ["consumer"],
    "definition": "The demand base under the whole model.  🔎 The tell: Any sign the lower-spend consumer is weakening?  ⛔ Red-line: Management flags softening in lower spend bands or discretionary categories.",
    "track_since": "Q1 FY2026",
    "track_until": "Q2 FY2026",
    "seeded_by": {
      "q": "Q1 FY2026",
      "n": "Q1 leaned on a strong holiday season; the standing question is whether the consumer holds as the comp normalizes."
    },
    "src": "Q1 FY2026: US payments volume +7%, strong holiday season.",
    "thread": [
      { "q": "Q1 FY2026", "n": "US payments volume +7%, strong holiday season." },
      { "q": "Q2 FY2026", "n": "US payments volume +8%; \"no signs of the lower-spend consumer weakening\"; highest band grew fastest." }
    ]
  },
  {
    "q": "Q2 FY2026",
    "created_quarter": "Q1 FY2026",
    "rank": 4,
    "theme": "Incentives / renewal intensity",
    "tags": ["incentives", "renewals"],
    "definition": "Contra-revenue that competitive dynamics drive.  🔎 The tell: Does incentive growth stay contained relative to net revenue?  ⛔ Red-line: Incentives grow well ahead of net revenue, compressing yield.",
    "track_since": "Q1 FY2026",
    "track_until": "Q2 FY2026",
    "seeded_by": {
      "q": "Q1 FY2026",
      "n": "Q1 incentives +13% on a strong renewal quarter; watch whether the renewal cycle keeps contra-revenue contained."
    },
    "src": "Q1 FY2026: incentives +13% on a strong renewal quarter.",
    "thread": [
      { "q": "Q1 FY2026", "n": "Incentives +13% on a strong renewal quarter." },
      { "q": "Q2 FY2026", "n": "Incentives +14%, below plan — contained this quarter, but a Q3 step-up is guided." }
    ]
  },
  {
    "q": "Q2 FY2026",
    "created_quarter": "Q1 FY2026",
    "rank": 5,
    "theme": "CMS / new-flows momentum",
    "tags": ["cms", "new-flows"],
    "definition": "The ~$200T greenfield the growth story leans on.  🔎 The tell: Does Visa Direct + commercial keep compounding well ahead of the network?  ⛔ Red-line: New-flows revenue growth decelerates toward the network rate.",
    "track_since": "Q1 FY2026",
    "track_until": "Q2 FY2026",
    "seeded_by": {
      "q": "Q1 FY2026",
      "n": "Q1 new-flows +19% cc with Visa Direct +34%; the question into Q2 was whether the greenfield keeps compounding."
    },
    "src": "Q1 FY2026: new-flows +19% cc; Visa Direct transactions +34%.",
    "thread": [
      { "q": "Q1 FY2026", "n": "New-flows +19% cc; Visa Direct transactions +34%." },
      { "q": "Q2 FY2026", "n": "CMS +24% cc — highest in recent quarters; Visa Direct 3.7B transactions (+23%)." }
    ]
  },
  {
    "q": "Q1 FY2026",
    "created_quarter": "Q4 FY2025",
    "rank": 1,
    "theme": "VAS sustainability (can high-teens hold?)",
    "tags": ["vas"],
    "definition": "The fastest-growing, least-regulated revenue line.  🔎 The tell: Does VAS hold high-teens cc as it laps tougher comps?  ⛔ Red-line: VAS decelerates below mid-teens.",
    "track_since": "Q4 FY2025",
    "track_until": "Q1 FY2026",
    "seeded_by": null,
    "src": "Q4 FY2025: VAS growth in the high-teens/20s cc.",
    "thread": [
      { "q": "Q4 FY2025", "n": "VAS growth in the high-teens/20s cc." },
      { "q": "Q1 FY2026", "n": "VAS +18% cc — held." }
    ]
  },
  {
    "q": "Q1 FY2026",
    "created_quarter": "Q4 FY2025",
    "rank": 2,
    "theme": "Cross-border ex-Europe trend",
    "tags": ["cross-border", "travel"],
    "definition": "Highest-yield line; consumer pulse.  🔎 The tell: Does cross-border re-accelerate on holiday travel + e-commerce?  ⛔ Red-line: Cross-border volume growth slips below low-double-digits cc.",
    "track_since": "Q4 FY2025",
    "track_until": "Q1 FY2026",
    "seeded_by": null,
    "src": "Q4 FY2025: cross-border in the low-teens cc.",
    "thread": [
      { "q": "Q4 FY2025", "n": "Cross-border in the low-teens cc." },
      { "q": "Q1 FY2026", "n": "Cross-border +16% cc, 3pts above Q4 on holiday + strong dollar." }
    ]
  },
  {
    "q": "Q1 FY2026",
    "created_quarter": "Q4 FY2025",
    "rank": 3,
    "theme": "Commercial / new-flows growth",
    "tags": ["cms", "new-flows"],
    "definition": "The new-flows greenfield.  🔎 The tell: Does commercial volume growth improve off a soft Q4?  ⛔ Red-line: Commercial volume growth stalls in low-single-digits.",
    "track_since": "Q4 FY2025",
    "track_until": "Q1 FY2026",
    "seeded_by": null,
    "src": "Q4 FY2025: commercial ~5% with a days-mix headwind.",
    "thread": [
      { "q": "Q4 FY2025", "n": "Commercial ~5% with a days-mix headwind." },
      { "q": "Q1 FY2026", "n": "Commercial +6% cc, +1pt from Q4 on favorable days mix — held (modestly)." }
    ]
  },
  {
    "q": "Q1 FY2026",
    "created_quarter": "Q4 FY2025",
    "rank": 4,
    "theme": "US consumer / holiday spend",
    "tags": ["consumer"],
    "definition": "The base of the model.  🔎 The tell: How strong is the Nov–Dec holiday season?  ⛔ Red-line: Holiday spend growth decelerates vs last year.",
    "track_since": "Q4 FY2025",
    "track_until": "Q1 FY2026",
    "seeded_by": null,
    "src": "Q4 FY2025: US payments volume ~5%.",
    "thread": [
      { "q": "Q4 FY2025", "n": "US payments volume ~5%." },
      { "q": "Q1 FY2026", "n": "US payments volume +7%, up 2pts from Q4 on a strong holiday season." }
    ]
  },
  {
    "q": "Q1 FY2026",
    "created_quarter": "Q4 FY2025",
    "rank": 5,
    "theme": "Investor-Day setup / FY guide",
    "tags": ["guidance"],
    "definition": "The medium-term multiple depends on the Investor-Day framework.  🔎 The tell: Does the FY26 framing and February Investor Day reset the growth algorithm?  ⛔ Red-line: Guide cut or framework walked back.",
    "track_since": "Q4 FY2025",
    "track_until": "Q1 FY2026",
    "seeded_by": null,
    "src": "FY26 initial guide: net revenue high-single/low-double digits.",
    "thread": [
      { "q": "Q4 FY2025", "n": "FY26 initial guide: net revenue high-single/low-double digits." },
      { "q": "Q1 FY2026", "n": "FY revenue guide nudged to low-double-digits; EPS growth to low-teens on a lower tax rate; Feb 2025 Investor Day set." }
    ]
  }
]
$seed$::jsonb) as e(
    q text, created_quarter text, rank int, theme text, tags jsonb,
    definition text, track_since text, track_until text,
    seeded_by jsonb, src text, thread jsonb )
where c.ticker = 'V';
