// themes-data/lyft.js — Lyft's theme record (Evolution ▸ Earnings ▸ Notes), the static seed.
//
// Contract: docs/PROFILE_PLAYBOOK.md section 12 EV-NOTES. Two readers: the theme record in Notes (js/overviews/lyft-ce.js) and Top Line ▸
// Segments (js/segments.js, THEME_SEG maps the Rideshare axis to the single Lyft segment; the other axes are company-wide). Once the
// portal saves a record (Supabase, company_theme_record) that copy wins and this seed is no longer read.
//
// Seed v1 (2026-11-05). Base: the earlier Lyft earnings-narrative record (10 calls, Q4 2023 -> Q1 2026, from the call transcripts)
// moved unchanged from js/overviews/lyft.js (LY_THEMES, B2 earnings-calls row) with its markup removed, regrouped under the six axes
// below, plus a Q2 2026 update per axis taken from the 2Q26 prepared remarks (the Q&A transcript is not on file). Entries from earlier
// quarters were not re-verified against the transcripts in this pass.
export var LYFT_THEMES_V = 1;
export var LYFT_THEMES = [
 {
  "seg": "Rideshare",
  "theme": "Higher-Value Rides & Mix Shift",
  "st": {
   "k": "trend",
   "since": "Q2 2024",
   "last": "Q2 2026"
  },
  "why": "The core thesis: ride-count growth is decelerating (S-curve), so Lyft needs revenue per ride to carry the growth story. If mix shift stalls or is just weather/seasonal, the thesis weakens.",
  "updates": [
   {
    "q": "Q2 2026",
    "items": [
     "Rides +11.7% year over year to 262.4M and Active Riders a record 30.5M; sequential acceleration in Rides growth.",
     "Premium modes grew double digits year over year for the twelfth quarter in a row; the XXL mode, launched recently, grew double digits quarter over quarter.",
     "Gross Bookings per ride higher on the addition of Freenow and strong growth in higher-value modes."
    ]
   },
   {
    "q": "Q1 2026",
    "items": [
     "United MileagePlus: 350M miles awarded, \"Pay with Miles\" launched. Partnership strategy shifting from acquisition to retention."
    ]
   },
   {
    "q": "Q4 2025",
    "items": [
     "Lyft Teen launched — teenagers described as \"infinitely replenishing\" cohort entirely absent from rideshare until now.",
     "Declined to chase every marginal ride — \"disciplined trade-offs\" as operating philosophy."
    ]
   },
   {
    "q": "Q3 2025",
    "items": [
     "TBR Global chauffeuring acquired — entry into the $54B executive ground transport segment, 3,000 cities globally.",
     "SB371 framed as catalyst: $6/ride savings in LA, stimulating demand."
    ]
   },
   {
    "q": "Q4 2024",
    "items": [
     "Market share highest since 2022 and rising. ETAs faster than both the main competitor and newer entrants.",
     "$500M buyback authorized — first significant shareholder-return program."
    ]
   },
   {
    "q": "Q2 2024",
    "items": [
     "Price Lock launched — \"removing rideshare’s most hated feature.\" Converts commuters into locked-in, high-frequency users.",
     "First GAAP profitability in company history."
    ]
   }
  ],
  "v": 1
 },
 {
  "seg": "Autonomous vehicles",
  "theme": "AV Strategy — Asset-Light Hybrid Network",
  "st": {
   "k": "trend",
   "since": "Q1 2024",
   "last": "Q2 2026"
  },
  "why": "Lyft’s survival argument: if AVs disintermediate the driver, the value shifts to whoever aggregates demand + manages fleets. Lyft claims both. The risk: with ~15% US rideshare share vs Uber’s ~70%, AV partners may prefer the larger demand graph.",
  "updates": [
   {
    "q": "Q2 2026",
    "items": [
     "Nashville with Waymo: fleet operations began in June; the 80,000-square-foot purpose-built depot is due in October.",
     "London: testing Baidu Apollo Go sixth-generation vehicles.",
     "San Francisco: Lyft Rides within the AV operational design domain grew about 20% year over year, the strongest among current AV markets."
    ]
   },
   {
    "q": "Q1 2026",
    "items": [
     "Gett UK acquired — 70–80% of London’s taxi fleets. (Full deal detail, including the London/AV framing, under European Expansion.)"
    ]
   },
   {
    "q": "Q4 2025",
    "items": [
     "AV cost structure disclosed: by 2030, AVs expected ~20% cheaper per mile than human-driven. FlexDrive’s fleet management adds incremental efficiency on top."
    ]
   },
   {
    "q": "Q3 2025",
    "items": [
     "Waymo partnership: integrated supply management where cars earn regardless of Waymo or Lyft dispatch. Described as the industry’s first true hybrid network model, built to scale beyond Nashville."
    ]
   },
   {
    "q": "Q2 2025",
    "items": [
     "Baidu partnership announced for European AV deployment — Baidu’s driver-out tech + Lyft’s fleet management + FreeNow’s regulatory relationships. Commercial timeline: 2026."
    ]
   },
   {
    "q": "Q3 2024",
    "items": [
     "Three simultaneous AV models: Mobileye (tech licensing), Nexar (data/learning), May Mobility (live rides in Atlanta). Not one exclusive deal — present across the supply chain."
    ]
   },
   {
    "q": "Q2 2024",
    "items": [
     "Three AV value-chain pillars formalized: demand generation (40M riders), marketplace management, and fleet operations via FlexDrive."
    ]
   },
   {
    "q": "Q1 2024",
    "items": [
     "AVs explicitly framed as opportunity, not threat. \"Building networks ≠ building AV tech — the two require different specialists.\""
    ]
   }
  ],
  "v": 1
 },
 {
  "seg": "Rideshare",
  "theme": "Partnerships as Growth Engine",
  "st": {
   "k": "trend",
   "since": "Q4 2023",
   "last": "Q2 2026"
  },
  "why": "27% of rides from partners = real demand that Lyft doesn’t pay to acquire. The Delta loss (~2% of GBs) proved partnerships can walk. The question: does the portfolio compound (more partners × deeper penetration) or plateau once the obvious deals are signed?",
  "updates": [
   {
    "q": "Q2 2026",
    "items": [
     "About 30% of North American rideshare rides were linked to a partner, a new high.",
     "DoorDash-linked rides in the U.S. grew nearly 60% year over year; after the Canada expansion, DoorDash-linked rides grew 40% month over month in June.",
     "United linked Rides grew 41% and linked riders 42% from Q1; United loyalists have paid for Lyft rides with 170 million miles."
    ]
   },
   {
    "q": "Q1 2026",
    "items": [
     "27% maintained. \"Pay with Miles\" launched (United). Partnership strategy described as compounding — each new partner reaches zero penetration on day one."
    ]
   },
   {
    "q": "Q2 2025",
    "items": [
     "Partnership rides share grew to 27%. United Airlines added as first major airline where miles earned on all rides (not just airport). Competitor’s approach called \"photocopy strategy.\""
    ]
   },
   {
    "q": "Q1 2025",
    "items": [
     "Delta partnership loss quantified: ~1% rides, ~2% gross bookings. Disclosed transparently before Q2 hit. Commitment to offset via deeper penetration of existing partners."
    ]
   },
   {
    "q": "Q3 2024",
    "items": [
     "DoorDash partnership announced — 18M DashPass members exposed to Lyft. \"Food delivery customers are naturally high-frequency riders.\""
    ]
   },
   {
    "q": "Q4 2023",
    "items": [
     "~20% of rides already partnership-linked. Delta described as evolving from points-only to full commute infrastructure."
    ]
   }
  ],
  "v": 1
 },
 {
  "seg": "Europe & new businesses",
  "theme": "European Expansion — FreeNow & Beyond",
  "st": {
   "k": "trend",
   "since": "Q1 2025",
   "last": "Q2 2026"
  },
  "why": "The biggest strategic bet since founding: Lyft went from US-only to a European footprint overnight. The bull case: FreeNow’s taxi-regulator relationships are the AV entry ticket. The bear case: integration drag, EU gig-law exposure, and capital diverted from the US fight vs Uber.",
  "updates": [
   {
    "q": "Q2 2026",
    "items": [
     "One year in: beta testing of the Lyft app is live in over a dozen European cities; one global Lyft app expected to be widely available in 2027.",
     "Freenow by Lyft saw strong quarter-over-quarter Rides growth, led by Italy, Spain and Greece; planned acquisition of Serveo’s bikeshare business in major Spanish cities."
    ]
   },
   {
    "q": "Q1 2026",
    "items": [
     "Gett UK acquired — 70–80% of London’s taxi fleets in the Lyft app. London described as critical not just for revenue but as \"the proving ground\" for European AV regulatory relationships."
    ]
   },
   {
    "q": "Q2 2025",
    "items": [
     "FreeNow closed. ~€1B annualized run-rate across ~9 European countries. Baidu partnership announced as the vehicle for European AV deployment."
    ]
   },
   {
    "q": "Q1 2025",
    "items": [
     "FreeNow acquisition announced (~€175M). Framed explicitly around its taxi-first model as a regulatory relationship asset critical for AV expansion, not just geographic diversification."
    ]
   }
  ],
  "v": 1
 },
 {
  "seg": "Costs & capital",
  "theme": "Insurance Reform & Profitability Discipline",
  "st": {
   "k": "trend",
   "since": "Q2 2024",
   "last": "Q2 2026"
  },
  "why": "Insurance is ~50% of Lyft’s cost of revenue. SB371 cuts mandatory coverage limits in California (Lyft’s largest market) starting Jan 2026 — management estimates >$6/ride savings in LA alone. If durable, this is the single largest margin lever. If reserves re-inflate, it’s a trap.",
  "updates": [
   {
    "q": "Q2 2026",
    "items": [
     "Cost of revenue fell year over year in absolute terms and per ride, on California reform, Canada and low-scale markets, and favorable developments in the insurance portfolio.",
     "Expects a productive annual insurance renewal.",
     "Repurchased about $100M of shares; full-year 2026 buybacks expected at a level similar to 2025."
    ]
   },
   {
    "q": "Q4 2025",
    "items": [
     "Competitor’s \"heightened promotional activity\" in Q4, but Lyft declined to chase every marginal ride — framing disciplined trade-offs as a differentiating philosophy."
    ]
   },
   {
    "q": "Q3 2025",
    "items": [
     "SB371 (California insurance reform, eff. Jan 2026): \"win-win-win\" that would reduce rider prices by >$6 per ride in LA, stimulate demand, and benefit drivers."
    ]
   },
   {
    "q": "Q4 2024",
    "items": [
     "Lower prices described as a new dynamic — management argues lower prices drive ride volume and margins can be protected through mix, media, and higher-value modes."
    ]
   },
   {
    "q": "Q2 2024",
    "items": [
     "First GAAP profitability in company history — presented as validation of the \"customer obsession\" thesis translating into financial discipline."
    ]
   }
  ],
  "v": 1
 },
 {
  "seg": "Platform & media",
  "theme": "Lyft Media & Platform Identity",
  "st": {
   "k": "trend",
   "since": "Q1 2024",
   "last": "Q1 2026"
  },
  "why": "At ~$100M run-rate vs Uber’s >$2B, Lyft Media is 50× smaller — but it’s near-100% margin and scales with riders, not driver cost. The “Audience Extension” move (off-platform targeting using movement data) is the pivot from ad-format inventory to a data-moat play. If it works, it’s the highest-margin dollar Lyft earns.",
  "updates": [
   {
    "q": "Q1 2026",
    "items": [
     "Lyft Ads on path to $100M run rate by end 2026. \"Audience Extension\" off-platform capability added — evolving from format inventory into a data and targeting platform leveraging first-party movement data."
    ]
   },
   {
    "q": "Q3 2024",
    "items": [
     "\"Serve and connect\" introduced as company’s formal purpose. Identity framed not as rideshare platform but as force against physical disconnection."
    ]
   },
   {
    "q": "Q1 2024",
    "items": [
     "Lyft Media positioned as future margin lever: in-app ads, tablets, car-top panels, bike panels. 10× industry click-through rates. Long-term aspiration: $500M."
    ]
   }
  ],
  "v": 1
 }
];
