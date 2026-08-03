-- ════════════════════════════════════════════════════════════════════════════
-- 011_company_themes — AMZN seed
-- ════════════════════════════════════════════════════════════════════════════
-- Migrates AMZN's hardcoded Watch List (js/overviews/amzn.js WL_ROWS, 20 rows) into the
-- shared company_themes table (created in 010). Run AFTER 010. Idempotent-ish: it
-- appends rows, so run it exactly once. The table + RLS already exist from 010.
--
-- Field mapping is 1:1 with the old WL_ROWS (same convention as the GOOGL seed in
-- 010): created_quarter = the hook-open quarter (track_since) when present, else the
-- row's home quarter q — so these historical themes are close-only, not same-quarter
-- deletable. No-op if AMZN is not (yet) in the companies table.

insert into company_themes
  (company_id, ticker, q, created_quarter, rank, theme, tags, definition, track_since, track_until, seeded_by, src, thread)
select c.id, 'AMZN', e.q, e.created_quarter, coalesce(e.rank, 0), e.theme,
       coalesce(array(select jsonb_array_elements_text(e.tags)), '{}'),
       e.definition, e.track_since, e.track_until, e.seeded_by, e.src, e.thread
from companies c,
  jsonb_to_recordset($seed$
[
  {
    "q": "Q3 2026",
    "created_quarter": "Q4 2025",
    "rank": 1,
    "theme": "AWS: conversion pace against reserved capacity",
    "tags": [
      "aws",
      "backlog",
      "ai"
    ],
    "definition": "The demand argument is settled — $496B of backlog, capacity reserved into 2028. What is unsettled is the RATE at which that book becomes recognised revenue, because installs bill 6–24 months after commitment. The tell is whether AWS holds the high-30s once the easy comps are gone.",
    "track_since": "Q4 2025",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "Conversion pace: $496B of backlog against reserved capacity — does AWS hold the high-30s?"
    },
    "src": "Q2 2026: +37% (fastest in 18 quarters), $169B run-rate, backlog $496B (~2.5x YoY); 2027 capacity \"largely reserved\", some 2028 \"already spoken for\".",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "+24% · backlog $244B (+40%)."
      },
      {
        "q": "Q1 2026",
        "n": "+28% · backlog $364B + $100B Anthropic excluded."
      },
      {
        "q": "Q2 2026",
        "n": "+37% · backlog $496B · AI business and chips business each >$25B run-rate."
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q4 2025",
    "rank": 2,
    "theme": "The ~$220B frame and the first negative-FCF year",
    "tags": [
      "capex",
      "fcf",
      "supply"
    ],
    "definition": "The bear case, now printed rather than modelled: TTM free cash flow went negative (−$7.6B) and the frame was raised to ~$220B on memory inflation, funded with $67B of new long-term debt in one half. The hook tracks the FUNDING MIX from here — more debt, a partner vehicle, or operating cash flow closing the gap.",
    "track_since": "Q4 2025",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "The funding mix under ~$220B with TTM FCF negative — more debt, or a partner vehicle?"
    },
    "src": "Q2 2026: capex $54.2B (1H26 $98.4B), frame raised ~$200B → ~$220B (\"higher cost of memory\"), TTM FCF −$7.6B, long-term debt $65.6B → $128.9B.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "\"About $200B, predominantly AWS\" · TTM FCF $11.2B."
      },
      {
        "q": "Q1 2026",
        "n": "Q1 capex $44.2B · memory \"skyrocketed\" · allocations locked mid-late 2025."
      },
      {
        "q": "Q2 2026",
        "n": "⚑ Red line TRIPPED — TTM FCF −$7.6B; frame ~$220B; debt nearly doubled in six months."
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q2 2026",
    "rank": 3,
    "theme": "AWS margin quality under the depreciation ramp",
    "tags": [
      "margins",
      "aws",
      "accounting"
    ],
    "definition": "A 39.4% AWS margin sounds like a new base — but management itself said ~130bps of the +650bps YoY was energy-derivative accounting. The clean number is ~38%, and the question is whether it survives the depreciation wave from a ~$220B build year. Q3's guide already fences the derivative line out by assumption.",
    "track_since": "Q2 2026",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "Is the clean ~38% AWS margin sustainable under the depreciation ramp?"
    },
    "src": "Q2 2026 call: Olsavsky — margins \"are not random\", ~520bps of clean expansion from silicon mix, power efficiency and utilisation; Q3 guide excludes energy-derivative remeasurements.",
    "thread": [
      {
        "q": "Q1 2026",
        "n": "Record 13.1% consolidated margin with $44B of quarterly capex."
      },
      {
        "q": "Q2 2026",
        "n": "13.7% consolidated record; AWS 39.4% (+650bps, ~+520bps clean)."
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q4 2025",
    "rank": 4,
    "theme": "Advertising through the Prime-Day flip quarter",
    "tags": [
      "ads",
      "rufus",
      "agentic"
    ],
    "definition": "Ads accelerated to +26% at a $20B quarterly scale — but Q3 is the quarter that LOSES the Prime-Day event to the comp. Holding 25%+ through it would say the growth is the agentic/sponsored-products engine rather than the event calendar.",
    "track_since": "Q4 2025",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "Does advertising hold 25%+ through the Prime-Day flip quarter?"
    },
    "src": "Q2 2026: ads $19.8B (+26%), accelerating from +22%, sponsored products the named driver.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "Ads $21.3B (+22%) · Rufus 300M users, +60% completion lift."
      },
      {
        "q": "Q1 2026",
        "n": "$17.2B (+22%) · Rufus MAU +115% · Netflix/Comcast/Samsung signed."
      },
      {
        "q": "Q2 2026",
        "n": "$19.8B (+26%) — an acceleration at scale, into the Prime-Day-in-Q2 quarter."
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q4 2025",
    "rank": 5,
    "theme": "Trainium: two frontier tenants, and the merchant question",
    "tags": [
      "silicon",
      "trainium",
      "aws"
    ],
    "definition": "The chips business passed a $25B run-rate with BOTH Anthropic and OpenAI committing multi-year, multi-gigawatt. That kills the concentration argument — and revives the bigger one: does Amazon ever SELL the racks (NVIDIA-adjacent economics) or keep silicon as an internal cost edge?",
    "track_since": "Q4 2025",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "Trainium merchant path: with OpenAI and Anthropic both multi-gigawatt, do rack sales move from \"possibility\" to plan?"
    },
    "src": "Q2 2026: chips business >$25B run-rate (triple-digit growth); Anthropic AND OpenAI multi-year multi-gigawatt commitments; Graviton5 GA; Nowak asked about third-party data-centre sales.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "$10B+ RR · Rainier 500K chips · Trainium3 supply committed to mid-2026."
      },
      {
        "q": "Q1 2026",
        "n": "$20B RR (+~40% QoQ) · $225B+ commitments · rack sales \"a possibility\"."
      },
      {
        "q": "Q2 2026",
        "n": "Chips >$25B RR · OpenAI joins Anthropic on multi-GW · Graviton5 GA."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q4 2025",
    "rank": 1,
    "theme": "AWS: the third acceleration + backlog conversion",
    "tags": [
      "aws",
      "backlog",
      "ai"
    ],
    "definition": "The whole multiple rides on AWS re-acceleration being demand-led and durable; the backlog ($364B + $100B Anthropic) is the receipt — conversion pace is the test.",
    "track_since": "Q4 2025",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "Does AWS accelerate AGAIN (Street +31%) with backlog converting?"
    },
    "src": "Q4 2025: +24% (13-q high), backlog $244B (+40%). Q1 2026: +28% (15-q high), $150B RR, backlog $364B ex-Anthropic.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "+24% · backlog $244B (+40%) · 35% margin · >1GW added in Q4."
      },
      {
        "q": "Q1 2026",
        "n": "+28% · $150B run-rate · backlog $364B + $100B Anthropic excluded · Bedrock spend +170% QoQ."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q4 2025",
    "rank": 2,
    "theme": "The ~$200B bill: memory inflation, LEO, FCF",
    "tags": [
      "capex",
      "fcf",
      "supply"
    ],
    "definition": "The bear case in one line: a ~$200B capex year against ~$11B of TTM FCF, now with memory costs \"skyrocketed\" and $1B/quarter of LEO — the bill side of the AI trade.",
    "track_since": "Q4 2025",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "What does memory inflation do to the ~$200B frame / AWS margin?"
    },
    "src": "Q4 2025 call set the frame; Q1 2026 added the memory-cost warning + supply-lock detail; Summit model FY26 FCF flipped negative at the Feb snapshot.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "\"About $200B, predominantly AWS\" · TTM FCF $11.2B."
      },
      {
        "q": "Q1 2026",
        "n": "Q1 capex $44.2B · memory \"skyrocketed\" · allocations locked mid-late 2025 · LEO +$1B YoY in Q2."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q1 2026",
    "rank": 3,
    "theme": "Margin: is 13.1% the peak or the base?",
    "tags": [
      "margins",
      "efficiency"
    ],
    "definition": "Q1 printed the highest operating margin ever WITH the capex running — the Q2 guide (SBC step-up, LEO, fuel) says management wants room; the print says whether the efficiency flywheel keeps paying for the build.",
    "track_since": "Q1 2026",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "Is 13.1% margin the peak or the base (SBC + LEO + fuel in the guide)?"
    },
    "src": "Q1 2026: 13.1% record; units +15% vs fulfillment cost +9%; robotics in all 2026 US large-format launches.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "NA margin 9% in the holiday peak; 1M+ robots."
      },
      {
        "q": "Q1 2026",
        "n": "13.1% record consolidated margin; guide midpoint set BELOW the Q1 print."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q4 2025",
    "rank": 4,
    "theme": "Agentic commerce → advertising dollars",
    "tags": [
      "ads",
      "rufus",
      "agentic"
    ],
    "definition": "The funnel question of the AI era: Rufus numbers keep compounding (300M users → +115% MAU) and management claims ads WIN in agentic commerce — the ads line is where the claim gets audited.",
    "track_since": "Q4 2025",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "Agentic commerce: do Rufus numbers keep compounding into ads?"
    },
    "src": "Q4 2025: Rufus 300M users, +60% completion. Q1 2026: MAU +115%, engagement +400%; ads $17.2B (+22%); sponsored prompts working.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "Rufus 300M · +60% completion lift · ads $21.3B (+22%)."
      },
      {
        "q": "Q1 2026",
        "n": "Rufus MAU +115% · \"we're going to like this for advertising\" · Netflix/Comcast/Samsung signed."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q4 2025",
    "rank": 5,
    "theme": "Custom silicon: from internal edge to merchant business",
    "tags": [
      "silicon",
      "trainium",
      "aws"
    ],
    "definition": "A $20B run-rate growing ~40% QoQ with $225B of commitments — and a live question of whether Trainium racks get SOLD (NVIDIA-adjacent economics) or stay an internal cost edge.",
    "track_since": "Q4 2025",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "Trainium rack sales — from \"possibility\" to plan?"
    },
    "src": "Q1 2026 Q&A (Post): rack sales \"very much a possibility\" over the next couple of years; current supply fully allocated to training.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "$10B+ RR · Rainier 500K chips · Trainium3 supply committed to mid-2026."
      },
      {
        "q": "Q1 2026",
        "n": "$20B RR (+~40% QoQ) · $225B+ commitments · Trainium4 largely reserved ~18mo out · rack sales \"a possibility\"."
      }
    ]
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2025",
    "rank": 1,
    "theme": "AWS acceleration into the $200B build",
    "tags": [
      "aws",
      "backlog"
    ],
    "definition": "The demand proof the spend needs.",
    "track_since": "Q4 2025",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Does AWS keep accelerating into the $200B build?"
    },
    "src": null,
    "thread": null
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2025",
    "rank": 2,
    "theme": "Capex cadence + FCF path under the frame",
    "tags": [
      "capex",
      "fcf"
    ],
    "definition": "The bill side; model FCF flipped negative on the frame.",
    "track_since": "Q4 2025",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "What is the capex cadence and FCF path under the frame?"
    },
    "src": null,
    "thread": null
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2025",
    "rank": 3,
    "theme": "Retail efficiency off the holiday peak",
    "tags": [
      "efficiency",
      "margins"
    ],
    "definition": "Units-vs-cost gap outside Q4 seasonality.",
    "track_since": "Q4 2025",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Does retail efficiency hold outside the holiday peak?"
    },
    "src": null,
    "thread": null
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2025",
    "rank": 4,
    "theme": "Rufus / agentic commerce → dollars",
    "tags": [
      "rufus",
      "ads"
    ],
    "definition": "Usage is proven; monetization is the hook.",
    "track_since": "Q4 2025",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Rufus/agentic commerce: usage → dollars?"
    },
    "src": null,
    "thread": null
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2025",
    "rank": 5,
    "theme": "Project Rainier: 500K chips → 1M?",
    "tags": [
      "silicon",
      "trainium"
    ],
    "definition": "The Anthropic/Trainium flywheel milestone.",
    "track_since": "Q4 2025",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Rainier: 500K chips → 1M?"
    },
    "src": null,
    "thread": null
  },
  {
    "q": "Q4 2025",
    "created_quarter": "Q3 2025",
    "rank": 1,
    "theme": "THE 2026 capex number",
    "tags": [
      "capex"
    ],
    "definition": "The single number that reprices the year.",
    "track_since": "Q3 2025",
    "track_until": "Q4 2025",
    "seeded_by": null,
    "src": null,
    "thread": null
  },
  {
    "q": "Q4 2025",
    "created_quarter": "Q3 2025",
    "rank": 2,
    "theme": "AWS re-acceleration past +24%",
    "tags": [
      "aws"
    ],
    "definition": "The acceleration narrative IS the multiple.",
    "track_since": "Q3 2025",
    "track_until": "Q4 2025",
    "seeded_by": null,
    "src": null,
    "thread": null
  },
  {
    "q": "Q4 2025",
    "created_quarter": "Q3 2025",
    "rank": 3,
    "theme": "Holiday retail: records without margin give-up",
    "tags": [
      "efficiency"
    ],
    "definition": "Units, same-day records, and the NA margin.",
    "track_since": "Q3 2025",
    "track_until": "Q4 2025",
    "seeded_by": null,
    "src": null,
    "thread": null
  },
  {
    "q": "Q4 2025",
    "created_quarter": "Q3 2025",
    "rank": 4,
    "theme": "Charges after the FTC quarter",
    "tags": [
      "charges"
    ],
    "definition": "3Q25 carried $2.5B FTC + $1.8B severance — the pattern to watch.",
    "track_since": "Q3 2025",
    "track_until": "Q4 2025",
    "seeded_by": null,
    "src": null,
    "thread": null
  },
  {
    "q": "Q4 2025",
    "created_quarter": "Q3 2025",
    "rank": 5,
    "theme": "Trainium / Rainier scale-up",
    "tags": [
      "silicon",
      "trainium"
    ],
    "definition": "Custom silicon as the margin lever under the AI build.",
    "track_since": "Q3 2025",
    "track_until": "Q4 2025",
    "seeded_by": null,
    "src": null,
    "thread": null
  }
]
$seed$::jsonb) as e(
    q text, created_quarter text, rank int, theme text, tags jsonb,
    definition text, track_since text, track_until text,
    seeded_by jsonb, src text, thread jsonb )
where c.ticker = 'AMZN';
