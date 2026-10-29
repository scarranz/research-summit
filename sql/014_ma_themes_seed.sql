-- ════════════════════════════════════════════════════════════════════════════
-- 014_company_themes — MA (Mastercard) seed
-- ════════════════════════════════════════════════════════════════════════════
-- Migrates Mastercard's hardcoded Watch List (WL_ROWS in js/overviews/mastercard.js,
-- 20 rows) into company_themes, 1:1. Mirrors the canonical GOOGL seed in 010: each row's
-- created_quarter is the hook-open quarter (track_since) when present, else the row's home
-- quarter q — so these historical themes are close-only, not same-quarter deletable.
-- definition folds the row's why/tell/red-line prose as authored (HTML tags kept verbatim).
-- Resolves the docs/EARNINGS_CONVENTIONS.md §6f persistence assignment for MA. Run AFTER 010,
-- once. No-op if MA is not in the companies table.

insert into company_themes
  (company_id, ticker, q, created_quarter, rank, theme, tags, definition, track_since, track_until, seeded_by, src, thread)
select c.id, 'MA', e.q, e.created_quarter, coalesce(e.rank, 0), e.theme,
       coalesce(array(select jsonb_array_elements_text(e.tags)), '{}'),
       e.definition, e.track_since, e.track_until, e.seeded_by, e.src, e.thread
from companies c,
  jsonb_to_recordset($seed$
[
  {
    "q": "Q3 2026",
    "created_quarter": "Q2 2026",
    "rank": 1,
    "theme": "First guide/quarter under new CFO Ling Hai",
    "tags": [
      "cfo",
      "guidance",
      "tone"
    ],
    "definition": "The one genuinely new variable is leadership — Q3 is the first guide under a new CFO, and continuity vs a change of framing is the tell. <b>Tell:</b> does Ling Hai keep Sachin's disclosure cadence and guidance construct, or shift tone/detail? <b>Red-line:</b> a framing or disclosure change that reduces comparability or signals a strategy shift.",
    "track_since": "Q2 2026",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "Sachin Mehra's last call as CFO; he moves to Chief Business Officer and Ling Hai becomes CFO effective Aug 3, 2026. Continuity messaged heavily \"from a position of strength.\""
    },
    "src": "Q2 2026: CFO transition announced (part of the June 2 C-suite reshuffle); Ling Hai to lead the next earnings call.",
    "thread": [
      {
        "q": "Q2 2026",
        "n": "Mehra to Chief Business Officer; Ling Hai to CFO effective Aug 3."
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q2 2026",
    "rank": 2,
    "theme": "BVNK close + day-one stablecoin economics",
    "tags": [
      "stablecoin",
      "bvnk",
      "new-flows"
    ],
    "definition": "The strategic pivot into owning stablecoin infrastructure — the size of the accretion is still unproven and the close keeps slipping. <b>Tell:</b> does BVNK actually close in Q3, and is there any day-one take-rate / volume / margin disclosure beyond \"bps on volume\"? <b>Red-line:</b> the close slips again, or the disclosed bps economics prove immaterial vs card/network economics.",
    "track_since": "Q2 2026",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "Management said BVNK is now expected to close in Q3 (was Q1's \"planned\"); economics still framed as bps on volume in a market MA doesn't touch today."
    },
    "src": "Q2 2026: BVNK close moved to Q3; minimal net-revenue impact, some opex, contemplated in the reconciliations. OpenUSD (140-co consortium) to go live later this year; crypto co-brand volume >3x in two years.",
    "thread": [
      {
        "q": "Q1 2026",
        "n": "BVNK announced; economics = bps on volume; CLARITY Act \"doesn't hold us back.\""
      },
      {
        "q": "Q2 2026",
        "n": "Close slips to Q3; Agent Pay for Machines (M2M) launched with 30+ partners."
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q2 2026",
    "rank": 3,
    "theme": "Venezuela cross-border surge — persist or fade?",
    "tags": [
      "cross-border",
      "venezuela",
      "mix"
    ],
    "definition": "An idiosyncratic, non-repeatable driver flattered the Q2 CNP ex-travel line — the tell is whether it is durable or a one-off now in the base. <b>Tell:</b> does the Venezuela-driven CNP ex-travel strength persist as USD availability normalizes, or fade into a tougher comp? <b>Red-line:</b> the surge reverses sharply, exposing a weaker underlying cross-border run-rate.",
    "track_since": "Q2 2026",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "Increased USD availability in Venezuela drove a cross-border CNP ex-travel uptick where MA is market leader (primarily a debit market); Sachin flagged it as holding up \"pretty well\" but idiosyncratic."
    },
    "src": "Q2 2026: cross-border volume +12%; CNP ex-travel +20% on Venezuela USD availability + retail-promo timing; MA deconsolidated Venezuela in 2018.",
    "thread": [
      {
        "q": "Q2 2026",
        "n": "Venezuela USD availability surged into Q2; MA is market leader; shows up in CNP ex-travel debit."
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q2 2026",
    "rank": 4,
    "theme": "Middle East — does it stay moderated?",
    "tags": [
      "cross-border",
      "travel",
      "geopolitics"
    ],
    "definition": "The Q1 fear resolved better than the base case, but the region is dynamic — the tell is whether the moderation holds at the assumed level. <b>Tell:</b> do Middle-East cross-border impacts stay near the end-of-Q2 level management now assumes for H2, or re-escalate? <b>Red-line:</b> the conflict re-escalates and cross-border travel weakens again.",
    "track_since": "Q2 2026",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "Impacts moderated through Q2 and were less severe than anticipated; management estimates H2 impacts stay at similar levels to the end of Q2, noting the environment \"remains dynamic.\""
    },
    "src": "Q2 2026: better outbound spend from impacted GCC countries; cross-border travel improved sequentially vs April on lower Middle-East impact and holiday timing.",
    "thread": [
      {
        "q": "Q1 2026",
        "n": "Conflict cut Q2 travel to 2%; \"ends in Q2\" assumed; ~6% of cross-border exposed."
      },
      {
        "q": "Q2 2026",
        "n": "Hit lighter than feared; assumed to stay at end-of-Q2 levels through H2."
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q2 2026",
    "rank": 5,
    "theme": "VAS durability (holds ~18%?)",
    "tags": [
      "vas",
      "services"
    ],
    "definition": "VAS is the differentiator and the multiple support — the durable engine that carries the model when the macro/idiosyncratic helpers fade. <b>Tell:</b> does organic VAS hold ~18% cn with ~60% network-linked, led by security demand? <b>Red-line:</b> organic VAS decelerates below mid-teens with no offsetting network acceleration.",
    "track_since": "Q2 2026",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "VAS +18% cn again, ~60% network-linked; strong security demand (Threat Intelligence, Recorded Future). The standing question is whether the ~18% engine holds."
    },
    "src": "Q2 2026: VAS +18% cn; Threat Intelligence 7M+ card-testing txns across 192 countries, ~$172M fraud prevented; Partner Advantage Program 200+ partners.",
    "thread": [
      {
        "q": "Q1 2026",
        "n": "VAS +18% cc organic; Recorded Future lapped."
      },
      {
        "q": "Q2 2026",
        "n": "VAS +18% cn; ~60% network-linked; security demand strong."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q1 2026",
    "rank": 1,
    "theme": "Middle-East conflict vs the \"ends in Q2\" base case",
    "tags": [
      "cross-border",
      "travel",
      "geopolitics"
    ],
    "definition": "The entire Q2 and H2 guide was predicated on one uncontrollable assumption. <b>Resolved in Q2:</b> the conflict moderated through the quarter and hit less severely than anticipated — net revenue beat at +12% cn, and management now assumes Middle-East impacts stay near the end-of-Q2 level through H2. The Q1 guide-down risk did not materialize. <b>Red-line (was):</b> the conflict extends past Q2 and cross-border travel stays depressed.",
    "track_since": "Q1 2026",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "Sachin explicitly built guidance on the conflict ENDING in Q2 and refused (to Adam Frisch) to model any alternative scenario; sized GCC+Israel at ~6% of cross-border volume."
    },
    "src": "Q1 2026: cross-border travel growth fell from 8% (Q1) to 2% (first 4 weeks of April) on conflict + portfolio shifts + Ramadan/Easter timing; Q2 guided to the low end of low-double-digits.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "Consumer healthy; no conflict in the guide; FY26 set at high-end of low-double-digits cc."
      },
      {
        "q": "Q1 2026",
        "n": "Conflict from late Feb; Q2 cut; \"ends in Q2\" assumed; ~6% of cross-border exposed."
      },
      {
        "q": "Q2 2026",
        "n": "Moderated / less severe than feared; net rev beat +12%; H2 assumed at end-of-Q2 level."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q1 2026",
    "rank": 2,
    "theme": "BVNK / stablecoin economics",
    "tags": [
      "stablecoin",
      "bvnk",
      "new-flows"
    ],
    "definition": "The strategic pivot from crypto co-brands (card economics) into owning stablecoin infrastructure — the size of the accretion is unproven. <b>Carried into Q3:</b> BVNK is now expected to close in Q3 (slipped from the Q1 \"planned\"); the model is still framed as bps on volume in a market MA doesn't touch today, with no day-one take-rate/margin numbers yet. <b>Red-line (was):</b> the disclosed bps economics prove immaterial or dilutive.",
    "track_since": "Q1 2026",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "Matt O'Neill pushed on stablecoin economics; Sachin said BVNK's model is \"basis points on volume\" in \"an addressable market we don't participate in today\" — accretive, but no numbers."
    },
    "src": "Q1 2026: planned BVNK acquisition (interoperability/licensing/compliance layer for send/receive/convert/hold stablecoins); use cases payouts, remittances, me-to-me, B2B cross-border.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "Stablecoins framed as \"another currency\" on the network; MetaMask/Gemini co-brands; Ripple settlement."
      },
      {
        "q": "Q1 2026",
        "n": "BVNK announced; economics = bps on volume; CLARITY Act \"doesn't hold us back.\""
      },
      {
        "q": "Q2 2026",
        "n": "Close moved to Q3; OpenUSD (140-co) live later this year; Agent Pay for Machines launched."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q1 2026",
    "rank": 3,
    "theme": "Switched-transaction growth trajectory",
    "tags": [
      "switched-transactions",
      "mix"
    ],
    "definition": "Switched transactions are the data engine that feeds VAS — a persistent decel would quietly cap the whole virtuous-cycle algorithm. <b>Resolved (leaning transitory):</b> switched +9%, generally in line with Q1; ex-Capital One US switched volume +10% (+2 PPT sequentially) on higher fuel spend — mix-driven, not a demand problem. <b>Red-line (was):</b> switched growth decelerates further on a structural mix drag.",
    "track_since": "Q1 2026",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "Harshita Rawat pushed on switched growth decelerating to 9% (10% ex-Cap One) vs historical low-double/low-teens; Sachin attributed it to geographic/average-ticket mix (Russia exit, adding Japan/Mexico)."
    },
    "src": "Q1 2026: switched transactions +9% (+10% ex-Capital One debit migration); >70% of Mastercard transactions now switched (vs 60% in 2020).",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "Switched +10%; contactless 77%; Cap One debit migration a drag."
      },
      {
        "q": "Q1 2026",
        "n": "Switched +9% (+10% ex-Cap One); mix explanation; migration \"basically complete.\""
      },
      {
        "q": "Q2 2026",
        "n": "Switched +9%; ex-CapOne US +10% (+2 PPT seq) on fuel; tokens >40%, contactless 80%."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q1 2026",
    "rank": 4,
    "theme": "VAS durability at ~40% of revenue",
    "tags": [
      "vas",
      "services"
    ],
    "definition": "VAS is the differentiator and the multiple support — the virtuous cycle only works if it keeps compounding faster than the network. <b>Confirmed in Q2:</b> VAS +18% cn again, ~60% network-linked, led by strong security demand (Threat Intelligence 7M+ card-testing txns across 192 countries, ~$172M fraud prevented). <b>Red-line (was):</b> organic VAS decelerates below mid-teens with no offsetting network acceleration.",
    "track_since": "Q1 2026",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "Jason Kupferberg clarified the 18% VAS growth was organic (Recorded Future lapped); the durability of the ~40%-of-revenue engine is the standing question."
    },
    "src": "Q1 2026: VAS +18% cc (no acquisition impact); ~40% of company revenue; broad-based (security, digital/authentication, insights, consumer engagement).",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "VAS +22% cc (+19% ex-acq); FY25 +21%/+18% ex-acq; ~60% network-linked."
      },
      {
        "q": "Q1 2026",
        "n": "VAS +18% cc organic; Recorded Future/Threat Intelligence 500+ customers; Ethoca +25%."
      },
      {
        "q": "Q2 2026",
        "n": "VAS +18% cn; ~60% network-linked; security demand strong."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q1 2026",
    "rank": 5,
    "theme": "Rebates & incentives / net revenue yield",
    "tags": [
      "incentives",
      "pricing",
      "renewals"
    ],
    "definition": "R&I is the contra-revenue competitive renewals drive — the tell on whether Mastercard is buying volume or being paid for value. <b>Held in Q2:</b> R&I came in essentially in line with expectations; management guided it slightly higher as a % of payment-network assessments into Q3 on deal timing, with cross-border and domestic pricing still lifting net yield. <b>Red-line (was):</b> renewal competition forces R&I up, compressing net yield.",
    "track_since": "Q1 2026",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "Andrew Schmidt asked on R&I trending; Sachin guided R&I as a % of payment-network assessments slightly lower sequentially into Q2, and noted net revenue yield is rising."
    },
    "src": "Q1 2026: net revenue yield increasing; R&I guided slightly lower sequentially into Q2.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "R&I flat-to-slightly-down sequentially; disciplined \"win the right deals.\""
      },
      {
        "q": "Q1 2026",
        "n": "R&I guided slightly lower into Q2; net yield rising."
      },
      {
        "q": "Q2 2026",
        "n": "R&I in line in Q2; guided slightly higher into Q3 on deal timing."
      }
    ]
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2025",
    "rank": 1,
    "theme": "VAS durability (can high-teens hold as acq laps?)",
    "tags": [
      "vas"
    ],
    "definition": "The engine and the multiple support. <b>Tell:</b> does organic VAS hold high-teens once Recorded Future is lapped? <b>Red-line:</b> organic VAS decelerates below mid-teens.",
    "track_since": "Q4 2025",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Q4 VAS was +22% cc but +19% ex-acq; the question into Q1 was the clean organic rate as acquisitions lap."
    },
    "src": "Q4 2025: VAS +22% cc (+19% ex-acq); FY25 +21%/+18% ex-acq.",
    "thread": null
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2025",
    "rank": 2,
    "theme": "Consumer / cross-border resilience",
    "tags": [
      "cross-border",
      "consumer",
      "travel"
    ],
    "definition": "The demand pulse and the highest-yield line. <b>Tell:</b> does the healthy consumer + cross-border hold into 2026? <b>Red-line:</b> cross-border volume growth slips below low-double-digits cc or the consumer softens.",
    "track_since": "Q4 2025",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Q4 framed a \"savvy, intentional\" but healthy consumer; the standing question was whether it holds through 2026 macro/geopolitics."
    },
    "src": "Q4 2025: cross-border +14%; consumer spend healthy and unchanged QoQ.",
    "thread": null
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2025",
    "rank": 3,
    "theme": "Switched-transaction growth off the Cap-One drag",
    "tags": [
      "switched-transactions"
    ],
    "definition": "The data engine feeding VAS. <b>Tell:</b> does switched growth re-accelerate as the Capital One debit migration completes? <b>Red-line:</b> switched growth stays depressed after the migration laps.",
    "track_since": "Q4 2025",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Q4 switched +10% with the Cap-One debit migration a drag; the question was the underlying rate once it completes."
    },
    "src": "Q4 2025: switched transactions +10%; Cap-One debit migration ongoing.",
    "thread": null
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2025",
    "rank": 4,
    "theme": "Capital One credit volume retention",
    "tags": [
      "capital-one",
      "renewals"
    ],
    "definition": "A known overhang the renewal partly flips. <b>Tell:</b> how much Capital One credit volume actually stays given its Discover ownership? <b>Red-line:</b> Cap-One credit volume migrates away despite the renewal.",
    "track_since": "Q4 2025",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Q4 announced the Cap-One CREDIT renewal (+ new accounts); Will Nance pushed on how much volume stays given Cap-One owns Discover — management wouldn't quantify."
    },
    "src": "Q4 2025: Capital One credit portfolio renewed; network for a large portion of newly acquired credit accounts.",
    "thread": null
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2025",
    "rank": 5,
    "theme": "FY26 guide shape (H1<H2 on FX comps)",
    "tags": [
      "guidance",
      "fx"
    ],
    "definition": "The shape drives the quarterly setups all year. <b>Tell:</b> does the H1<H2 cadence play out as the FX-volatility comps normalize? <b>Red-line:</b> H1 undershoots even the FX-comp-adjusted framing.",
    "track_since": "Q4 2025",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Q4 set FY26 at the high end of low-double-digits cc, with H1 lower than H2 on tougher FX-volatility comps; the question was whether the shape holds."
    },
    "src": "Q4 2025: FY26 net revenue guide high-end of low-double-digits cc; H1<H2 on FX-volatility comps.",
    "thread": null
  },
  {
    "q": "Q4 2025",
    "created_quarter": "Q3 2025",
    "rank": 1,
    "theme": "VAS growth durability",
    "tags": [
      "vas"
    ],
    "definition": "The engine and the differentiator. <b>Tell:</b> does VAS hold ~20% cc, and what is the clean organic rate ex-acquisitions? <b>Red-line:</b> organic VAS decelerates toward mid-teens.",
    "track_since": "Q3 2025",
    "track_until": "Q4 2025",
    "seeded_by": null,
    "src": "Q3 2025: VAS growth ~20%+ cc.",
    "thread": null
  },
  {
    "q": "Q4 2025",
    "created_quarter": "Q3 2025",
    "rank": 2,
    "theme": "Capital One debit loss / network share",
    "tags": [
      "capital-one",
      "switched-transactions"
    ],
    "definition": "The single biggest client overhang. <b>Tell:</b> how much does the Capital One debit migration to Discover drag switched volume, and is credit at risk? <b>Red-line:</b> credit also migrates, compounding the debit loss.",
    "track_since": "Q3 2025",
    "track_until": "Q4 2025",
    "seeded_by": null,
    "src": "Q3 2025: Capital One debit migration to Discover underway, a switched-volume drag.",
    "thread": null
  },
  {
    "q": "Q4 2025",
    "created_quarter": "Q3 2025",
    "rank": 3,
    "theme": "Cross-border & consumer health",
    "tags": [
      "cross-border",
      "consumer"
    ],
    "definition": "The demand pulse. <b>Tell:</b> does cross-border stay double digits and the consumer stay healthy into year-end? <b>Red-line:</b> cross-border slips below low-double-digits or consumer softens.",
    "track_since": "Q3 2025",
    "track_until": "Q4 2025",
    "seeded_by": null,
    "src": "Q3 2025: cross-border healthy; consumer resilient.",
    "thread": null
  },
  {
    "q": "Q4 2025",
    "created_quarter": "Q3 2025",
    "rank": 4,
    "theme": "FY26 guide / FX-volatility comps",
    "tags": [
      "guidance",
      "fx"
    ],
    "definition": "Sets the whole year's setup. <b>Tell:</b> where does FY26 land, and how do the 2025 FX-volatility comps shape the cadence? <b>Red-line:</b> FY26 guide comes in below low-double-digits cc.",
    "track_since": "Q3 2025",
    "track_until": "Q4 2025",
    "seeded_by": null,
    "src": "Q3 2025: elevated FX-volatility revenue in H1 2025 flagged as a future comp.",
    "thread": null
  },
  {
    "q": "Q4 2025",
    "created_quarter": "Q3 2025",
    "rank": 5,
    "theme": "Stablecoin / agentic positioning",
    "tags": [
      "stablecoin",
      "agentic"
    ],
    "definition": "The emerging-rails optionality. <b>Tell:</b> how is Mastercard positioning in stablecoins and agentic commerce as the space accelerates? <b>Red-line:</b> Mastercard is left behind on standards/economics.",
    "track_since": "Q3 2025",
    "track_until": "Q4 2025",
    "seeded_by": null,
    "src": "Q3 2025: Agent Pay launched; stablecoin settlement expanding.",
    "thread": null
  }
]
$seed$::jsonb) as e(
    q text, created_quarter text, rank int, theme text, tags jsonb,
    definition text, track_since text, track_until text,
    seeded_by jsonb, src text, thread jsonb )
where c.ticker = 'MA';
