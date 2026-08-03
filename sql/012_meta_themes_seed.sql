-- ════════════════════════════════════════════════════════════════════════════
-- 012_company_themes — META seed
-- ════════════════════════════════════════════════════════════════════════════
-- Migrates META's hardcoded Watch List (js/overviews/meta.js WL_ROWS, 20 rows)
-- into the shared company_themes table (created in 010). Run AFTER 010, exactly once
-- (it appends). Table + RLS already exist from 010. Same 1:1 field convention as the
-- GOOGL seed in 010: created_quarter = the hook-open quarter (track_since) when
-- present, else the row's home quarter q. No-op if META is not in companies.

insert into company_themes
  (company_id, ticker, q, created_quarter, rank, theme, tags, definition, track_since, track_until, seeded_by, src, thread)
select c.id, 'META', e.q, e.created_quarter, coalesce(e.rank, 0), e.theme,
       coalesce(array(select jsonb_array_elements_text(e.tags)), '{}'),
       e.definition, e.track_since, e.track_until, e.seeded_by, e.src, e.thread
from companies c,
  jsonb_to_recordset($seed$
[
  {
    "q": "Q3 2026",
    "created_quarter": "Q4 2025",
    "rank": 1,
    "theme": "The capex ladder — the $130B floor, 2027, and the funding doctrine",
    "tags": [
      "capex",
      "commitments",
      "roic"
    ],
    "definition": "The bear case is now explicitly doctrine-funded (cash flow → \"a greater mix of debt\" → partners); every floor-raise re-tests it while 2027 stays an adjective.",
    "track_since": "Q4 2025",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "2027 capex: a number or a fourth adjective — and does the $130B floor hold?",
      "tripped": true
    },
    "src": "Ladder tracked since Q4 2025; the 2027 question has been asked and adjectived three times (Q1, Q2 ×2 analysts).",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "Initial FY26 guide $115–135B; Meta Compute announced."
      },
      {
        "q": "Q1 2026",
        "n": "Raised to $125–145B; $107B commitments step-up; no 2027 figure."
      },
      {
        "q": "Q2 2026",
        "n": "Floor raised — narrowed to $130–145B · record $31.1B quarter (1H $50.9B) · FCF $784M · debt $83.7B · BlackRock 1GW El Paso JV · doctrine stated: cash flow → debt mix → partners · 2027 still \"highly dynamic\" (third ask)."
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q4 2025",
    "rank": 2,
    "theme": "Monetization surfaces → dollars (API · Meta One · Business Agents · compute)",
    "tags": [
      "ai",
      "monetization",
      "msl"
    ],
    "definition": "The surfaces shipped in Q2; the hook is now the first DISCLOSED dollar — API pricing/volume, Meta One subs, Business Agent economics, or a compute transaction.",
    "track_since": "Q4 2025",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "Do the monetization surfaces get dollars attached (Model API pricing/volume, Meta One subs, Business Agent economics, a compute deal)?"
    },
    "src": "Q2 2026: Business Agents global, 1M+ businesses/week (Movida 85% resolution); Model API on OpenRouter; Meta One launched; compute offers \"at a significant premium.\"",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "MSL rebuilt; models \"shipping over coming months.\""
      },
      {
        "q": "Q1 2026",
        "n": "Muse Spark shipped — engagement gains, no revenue; ROIC framed in milestones."
      },
      {
        "q": "Q2 2026",
        "n": "The surfaces shipped: Business Agents 1M/wk · Model API · Meta One · \"higher margin on selling intelligence than selling compute\" · dollars still undisclosed."
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q4 2025",
    "rank": 3,
    "theme": "Ad engine through the FX flip + comp lap",
    "tags": [
      "ads",
      "price-per-ad",
      "impressions"
    ],
    "definition": "The ad engine funds everything; Q3 is its hardest optics quarter (~1% FX headwind + the toughest comp) — constant-currency is the honest read.",
    "track_since": "Q4 2025",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "Does the ad engine hold mid/high-20s through the FX flip (~1% headwind) and the comp lap?"
    },
    "src": "Q2 2026: ad rev +27% (+26% cc); impressions +14%, price/ad +12%; Generative Recommender +8.3% clicks / +15.7% conversions; Advantage+ $75B run-rate. Q3 guided $61–64B.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "Ad rev +24%; price/ad +6%, impressions +18%."
      },
      {
        "q": "Q1 2026",
        "n": "Ad rev +33%; price/ad +12%, impressions +19% — acceleration on AI ranking."
      },
      {
        "q": "Q2 2026",
        "n": "Ad rev +27% (+26% cc); price/ad held +12%, impressions +14%; first system-level AI attribution (Generative Recommender)."
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q1 2026",
    "rank": 4,
    "theme": "Legal / regulatory — after the $2.4B charge",
    "tags": [
      "regulatory",
      "legal"
    ],
    "definition": "The flagged tail risk became a booked charge in Q2; the hook is whether $2.4B is the extent or the first installment, with the US youth trials still live.",
    "track_since": "Q1 2026",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "Is $2.4B the extent of the legal exposure — or the first installment, with the youth trials still live?",
      "tripped": true
    },
    "src": "Q2 2026: $2.4B legal-proceedings charges booked; FY expense floor raised to absorb them; youth-trial \"material loss\" language repeated verbatim.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "Legal expense growth (accruals + charges); EU DMA overhang."
      },
      {
        "q": "Q1 2026",
        "n": "US youth trials scheduled; \"may ultimately result in a material loss.\""
      },
      {
        "q": "Q2 2026",
        "n": "⚑ $2.4B charge LANDED; same forward language kept — exposure not closed."
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q3 2026",
    "rank": 5,
    "theme": "The model ladder: larger Muse models + the open-source return",
    "tags": [
      "ai",
      "msl",
      "promises"
    ],
    "definition": "Two dated promises from the Q2 call — larger models \"in the process of scaling\" and open-source releases \"at some point soon\" — both shippable, both scoreable.",
    "track_since": "Q3 2026",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "Do the two model promises ship: larger Muse models + the open-source return, both \"soon\"?"
    },
    "src": "Q2 2026 Q&A (Sandler, Gawrelski): mixed open/closed reaffirmed; \"we expect that we will get back to releasing some open source models at some point soon\"; Muse Spark 1.1 + Muse Image shipped, Meta AI interactions +60%.",
    "thread": [
      {
        "q": "Q2 2026",
        "n": "Muse Spark 1.1 + Muse Image shipped · Meta AI daily interactions +60% · larger models scaling · open-source return promised \"soon\"."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q4 2025",
    "rank": 1,
    "theme": "Capex escalation + 2027 signposts",
    "tags": [
      "capex",
      "commitments",
      "roic"
    ],
    "definition": "The capex trajectory is the whole bear case on FCF/returns — if it keeps rising without a monetization signpost, the multiple is exposed.",
    "track_since": "Q4 2025",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "How much higher does capex go — any 2027 framework or ROIC signpost?",
      "tripped": true
    },
    "src": "Q1 2026: capex guide $125–145B; $107B commitment step-up (multi-year cloud + infra); FY expenses $162–169B.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "Initial FY26 capex guide $115–135B; Meta Compute announced."
      },
      {
        "q": "Q1 2026",
        "n": "Raised to $125–145B; $107B commitments; no 2027 figure."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q4 2025",
    "rank": 2,
    "theme": "Muse / MSL monetization",
    "tags": [
      "ai",
      "muse",
      "msl"
    ],
    "definition": "The capex is justified by the AI product bet — the bet needs to convert engagement into revenue to underwrite the spend.",
    "track_since": "Q4 2025",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "Does Muse Spark / MSL have a monetization path, or engagement-only?"
    },
    "src": "Q1 2026: Muse Spark powering Meta AI; MSL \"on track to be a leading lab\"; next models in training.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "MSL rebuilt in 2025; first models \"shipping over coming months.\""
      },
      {
        "q": "Q1 2026",
        "n": "Muse Spark shipped; +double-digit Meta AI sessions/user; monetization TBD."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q4 2025",
    "rank": 3,
    "theme": "Ad-engine durability into tougher comps",
    "tags": [
      "ads",
      "price-per-ad",
      "impressions"
    ],
    "definition": "The ad engine funds everything; any crack in it pulls the rug from the AI-capex thesis.",
    "track_since": "Q4 2025",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "How durable is the ad-engine acceleration into tougher comps?"
    },
    "src": "Q1 2026: FoA ad revenue $55.0B (+33%); price/ad +12%; impressions +19%; Q2 revenue guided $58–61B.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "Ad rev +24%, price/ad +6%, impressions +18%; record holiday demand."
      },
      {
        "q": "Q1 2026",
        "n": "Ad rev +33%, price/ad +12% — acceleration on AI ranking."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q4 2025",
    "rank": 4,
    "theme": "Reality Labs loss trajectory",
    "tags": [
      "reality-labs",
      "glasses"
    ],
    "definition": "RL is the persistent drag; the glasses pivot + loss peak is the turn the bulls need.",
    "track_since": "Q4 2025",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "Do Reality Labs losses actually peak and start declining?"
    },
    "src": "Q1 2026: RL revenue $402M (−2%) — Quest down, glasses up; losses framed as peaking.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "RL rev $955M (−12%); losses \"peak\" this year; glasses tripled."
      },
      {
        "q": "Q1 2026",
        "n": "RL rev $402M (−2%); glasses growth offsetting Quest."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q1 2026",
    "rank": 5,
    "theme": "Regulatory / legal (EU + US youth trials)",
    "tags": [
      "regulatory",
      "legal"
    ],
    "definition": "A tail risk that can hit both the P&L (fines/accruals) and the ad model (consent/targeting).",
    "track_since": "Q1 2026",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "How do the US youth trials / EU headwinds resolve?"
    },
    "src": "Q1 2026: legal expense elevated; youth-related US trials scheduled; EU DMA/regulatory overhang.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "Legal expense growth (accruals + charges); EU DMA overhang."
      },
      {
        "q": "Q1 2026",
        "n": "US youth trials this year; possible material loss flagged."
      }
    ]
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2025",
    "rank": 1,
    "theme": "Capex FY26 guide trajectory",
    "tags": [
      "capex"
    ],
    "definition": "The core FCF/returns debate.",
    "track_since": "Q4 2025",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "How big does the 2026 capex ramp get from the $115–135B frame?"
    },
    "src": null,
    "thread": null
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2025",
    "rank": 2,
    "theme": "AI product roadmap / first MSL models",
    "tags": [
      "ai",
      "msl"
    ],
    "definition": "Justifies the capex.",
    "track_since": "Q4 2025",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Do the first MSL models ship credibly?"
    },
    "src": null,
    "thread": null
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2025",
    "rank": 3,
    "theme": "Ad-engine strength into comps",
    "tags": [
      "ads"
    ],
    "definition": "Funds everything.",
    "track_since": "Q4 2025",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Does the ad engine hold as holiday comps roll off?"
    },
    "src": null,
    "thread": null
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2025",
    "rank": 4,
    "theme": "Reality Labs losses (peak?)",
    "tags": [
      "reality-labs"
    ],
    "definition": "The persistent drag turning.",
    "track_since": "Q4 2025",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Is the Reality Labs loss peak real?"
    },
    "src": null,
    "thread": null
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2025",
    "rank": 5,
    "theme": "Efficiency / headcount",
    "tags": [
      "efficiency",
      "headcount"
    ],
    "definition": "The offset to the capex ramp.",
    "track_since": "Q4 2025",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Does the \"leaner, AI-native\" model show up in headcount/opex?"
    },
    "src": null,
    "thread": null
  },
  {
    "q": "Q4 2025",
    "created_quarter": "Q3 2025",
    "rank": 1,
    "theme": "FY26 capex / infra step-up",
    "tags": [
      "capex"
    ],
    "definition": "The core spend debate — the single number that frames 2026.",
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
    "theme": "AI roadmap / superintelligence",
    "tags": [
      "ai",
      "msl"
    ],
    "definition": "Justifies the spend.",
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
    "theme": "Ad-engine holiday strength",
    "tags": [
      "ads"
    ],
    "definition": "Funds everything.",
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
    "theme": "Reality Labs losses",
    "tags": [
      "reality-labs"
    ],
    "definition": "The persistent drag.",
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
    "theme": "Tax / one-time noise",
    "tags": [
      "tax"
    ],
    "definition": "EPS optics — the Q3'25 $15.93B charge flowing through.",
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
where c.ticker = 'META';
