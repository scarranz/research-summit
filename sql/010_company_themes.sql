-- ============================================================
-- Research Summit — Company Themes (Earnings ▸ Evolution ▸ Watch List)
-- Run this in the Supabase SQL Editor AFTER schema.sql.
--
-- Durable persistence for the Watch List / Themes machinery that until now
-- lived only in the in-memory WL_ROWS array in js/overviews/googl.js and was
-- lost on refresh (the "pending assignment" in docs/EARNINGS_CONVENTIONS.md §6f).
-- One shared table for every company, scoped by company_id (ticker denormalized
-- for readability). Any authenticated team member can read/write, so a theme
-- added, closed or removed in the portal is instantly visible to everyone —
-- no git commit / push needed (same pattern as company_resources).
-- ============================================================

-- ─── 1. company_themes table ─────────────────────────────────

create table company_themes (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references companies(id) on delete restrict,
  ticker          text not null,               -- denormalized scope (mirror of the company's ticker)
  q               text not null,               -- the quarter this hook currently rides under (advances each cycle)
  created_quarter text not null,               -- IMMUTABLE — the quarter the theme was created; powers the delete rule
  rank            int  not null default 0,     -- sort order within the quarter (not rendered on cards)
  theme           text not null,
  tags            text[] not null default '{}',
  definition      text,
  track_since     text,                         -- quarter the hook opened
  track_until     text,                         -- quarter the hook closed; NULL = still open
  seeded_by       jsonb,                        -- {q, n, tripped?}
  src             text,                         -- grounding: why it earned a slot
  thread          jsonb,                        -- [{q, n}, ...] the quarter-by-quarter evolution
  created_by      uuid references auth.users(id),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index company_themes_company_idx on company_themes(company_id);

create trigger company_themes_updated_at
  before update on company_themes
  for each row
  execute function set_updated_at();

alter table company_themes enable row level security;

create policy "authenticated_read_themes" on company_themes
  for select using (auth.uid() is not null);

create policy "authenticated_insert_themes" on company_themes
  for insert with check (auth.uid() is not null);

create policy "authenticated_update_themes" on company_themes
  for update using (auth.uid() is not null);

create policy "authenticated_delete_themes" on company_themes
  for delete using (auth.uid() is not null);


-- ─── 2. Seed: migrate GOOGL's hardcoded WL_ROWS ──────────────
-- Generated 1:1 from js/overviews/googl.js WL_ROWS (20 rows). created_quarter is
-- seeded as the hook-open quarter (track_since) when present, else the row's home
-- quarter q — so these historical themes are close-only, not same-quarter deletable.
-- No-op if GOOGL is not (yet) in the companies table.

insert into company_themes
  (company_id, ticker, q, created_quarter, rank, theme, tags, definition, track_since, track_until, seeded_by, src, thread)
select c.id, 'GOOGL', e.q, e.created_quarter, coalesce(e.rank, 0), e.theme,
       coalesce(array(select jsonb_array_elements_text(e.tags)), '{}'),
       e.definition, e.track_since, e.track_until, e.seeded_by, e.src, e.thread
from companies c,
  jsonb_to_recordset($seed$
[
  {
    "q": "Q3 2026",
    "created_quarter": "Q4 2024",
    "rank": 1,
    "theme": "The capex ladder — and now, the funding doctrine",
    "tags": [
      "capex"
    ],
    "definition": "The bear case is now explicitly policy-funded (ops cash → $100B debt → equity done); every raise re-tests the doctrine.",
    "track_since": "Q4 2024",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "2027 capex: a number or a framework? (third ask)"
    },
    "src": "Ladder tracked since Q4 2024; the 2027 question has been asked and adjectived twice (Q1, Q2).",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "FY26 guided $175–185B (~2x FY25)"
      },
      {
        "q": "Q1 2026",
        "n": "Raised to $180–190B (Intersect) · 2027 \"significantly increase\" · debt $46.5→$77.5B · FCF $10.1B"
      },
      {
        "q": "Q2 2026",
        "n": "Raised AGAIN to $195–205B · FCF −$5.9B (first negative) · $49.6B equity + debt to $98.2B · buybacks $0 · doctrine stated: \"not planning to go back to the equity markets\" (ex-ATM) · FCF \"will remain under pressure\""
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q2 2024",
    "rank": 2,
    "theme": "Cloud: the services engine × the TPU ramp × the bridge margin",
    "tags": [
      "cloud",
      "tpu",
      "capex"
    ],
    "definition": "The acceleration is proven organic (\"accelerated meaningfully even excluding TPU sales\"); the open economics are the hardware line and the bridge dent.",
    "track_since": "Q2 2024",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "TPU-sale margins + share of backlog — dodged twice"
    },
    "src": "The #1 theme six calls running; TPU rev-rec began in Q2 (first deliveries into customer DCs, incl. the Blackstone project).",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "+48% · backlog $240B"
      },
      {
        "q": "Q1 2026",
        "n": "+63% · backlog $462B (incl. first TPU deals) · \"revenue would have been higher\""
      },
      {
        "q": "Q2 2026",
        "n": "+82% — \"accelerated meaningfully even AFTER excluding TPU system sales\" · backlog $514B (+$52B while converting $24.8B) · margin 35.6% · rev-rec began; small → ramp exiting 2026 → majority 2027 · commitments exceeded by >50% (accel)"
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q2 2024",
    "rank": 3,
    "theme": "Search through the comp lap — scoring the NEW language",
    "tags": [
      "search",
      "monetization"
    ],
    "definition": "~53% of revenue; the language IS the thesis (our own rule) — and it just upgraded for the first time in the AI transition.",
    "track_since": "Q2 2024",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "Does the retired phrase's replacement survive a decel-optics quarter?"
    },
    "src": "Phrase tracked verbatim across six calls; retirement caught by the Pass-1.5 recurrence scan on this call.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "+17% · Gemini 3 into Search · phrase intact"
      },
      {
        "q": "Q1 2026",
        "n": "+19% · coverage-above-20% \"upside\" claim · phrase intact"
      },
      {
        "q": "Q2 2026",
        "n": "+17% · PHRASE RETIRED → \"encouraged… even as expanded to more commercial queries\" · AI Mode >1B MAU · \"billions of clicks to websites every week\" · AI-Mode response cost at lowest since launch · Q3 comp-lap warning volunteered"
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q3 2025",
    "rank": 4,
    "theme": "The monetization ladder: Highlighted Answers · Universal Cart · the app silence",
    "tags": [
      "monetization",
      "promises",
      "ai-consumer"
    ],
    "definition": "The bridge from AI engagement to ads revenue is now BUILT in production; volume is the question. The app remains the un-modeled option.",
    "track_since": "Q3 2025",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "App monetization: \"not rushing\" retired too — or just unasked?"
    },
    "src": "Promise-ladder discipline (ex-Promise-Tracker); the \"not rushing\" phrase had run three consecutive calls.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "Direct Offers pilot · UCP launched · \"not rushing\" (2nd)"
      },
      {
        "q": "Q1 2026",
        "n": "Direct Offers traction (Gap/L'Oréal/Chewy) · UCP +Amazon/Meta/Microsoft/Salesforce/Stripe · \"not rushing\" (3rd) · app-MAU silence"
      },
      {
        "q": "Q2 2026",
        "n": "Highlighted Answers debut · Universal Cart · Target & Steve Madden live on UCP · IHG on Direct Offers · AI Max 500K advertisers · app-ads stance: total silence (no question, no phrase)"
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q2 2026",
    "rank": 5,
    "theme": "The frontier race: Gemini 4 & the monthly cadence",
    "tags": [
      "frontier",
      "ai-consumer"
    ],
    "definition": "Model leadership is the input to every other thesis line — and for the first time management put a cadence on record.",
    "track_since": "Q2 2026",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "Gemini 4 ship window + does the near-monthly cadence materialize?"
    },
    "src": "New theme opened this quarter: Doug Anmuth and Ross Sandler both pressed the frontier question; answers carried commitments.",
    "thread": [
      {
        "q": "Q2 2026",
        "n": "Coding/agentic-coding gap ADMITTED (\"areas where we've acknowledged we need to improve\") · 3.6 Flash +10pts DeepSuite in 6 weeks · Gemini 4 pre-training started, \"most ambitious yet\" · \"releasing models almost at a monthly cadence is part of our roadmap\" · tokens 22B/min (from 16B)"
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q2 2024",
    "rank": 1,
    "theme": "Google Cloud — growth × backlog × capacity",
    "tags": [
      "cloud",
      "capex"
    ],
    "definition": "Cloud is the acceleration story of the whole company and the justification for the capex; its op margin went 9% → 33% in eight quarters while growth sped up.",
    "track_since": "Q2 2024",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "Backlog conversion pace vs the 24-month claim"
    },
    "src": "The #1 recurring theme of the last 6 calls; backlog/RPO is a tracked Bloomberg line; management leads with it every quarter.",
    "thread": [
      {
        "q": "Q2 2025",
        "n": "+32% · backlog $106B · first warning: \"tight demand-supply into 2026\""
      },
      {
        "q": "Q3 2025",
        "n": "+34% · backlog $155B (+46% QoQ) · Anthropic plans up to 1M TPUs"
      },
      {
        "q": "Q4 2025",
        "n": "+48% · backlog $240B (+55% QoQ) · Apple names Google its preferred cloud provider"
      },
      {
        "q": "Q1 2026",
        "n": "+63% to $20B · backlog $462B (~2x QoQ, incl. first TPU hardware deals) · \"revenue would have been higher if we could meet demand\""
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q4 2024",
    "rank": 2,
    "theme": "The capex ladder → depreciation → free-cash-flow squeeze",
    "tags": [
      "capex"
    ],
    "definition": "This is the bear case in one line: AI capex swallowing the cash machine. Consensus already models a near-zero-FCF quarter — the print will show whether the offsets (efficiency, revenue) keep pace.",
    "track_since": "Q4 2024",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "2027 capex: a number or a framework?"
    },
    "src": "Management flags accelerating depreciation EVERY call, unprompted (candor against interest); the Street asks about it every call.",
    "thread": [
      {
        "q": "Q4 2024",
        "n": "FY25 guide $75B — \"notably larger than 2023\""
      },
      {
        "q": "Q2 2025",
        "n": "Raised to ~$85B; \"further increase in 2026\""
      },
      {
        "q": "Q3 2025",
        "n": "Raised to $91–93B; depreciation +41% YoY"
      },
      {
        "q": "Q4 2025",
        "n": "FY26 guided $175–185B (~2x); depreciation +38% in FY25; Waymo $16B round"
      },
      {
        "q": "Q1 2026",
        "n": "Raised to $180–190B (Intersect); 2027 \"significantly increase\"; LT debt $46.5B→$77.5B; FCF $10.1B"
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q2 2024",
    "rank": 3,
    "theme": "Search through the AI transition — and the standing phrase",
    "tags": [
      "search",
      "monetization"
    ],
    "definition": "~56% of revenue, and the existential AI question is settling empirically: Search ACCELERATED 10→12→12→15→17→19% while AI Overviews and AI Mode rolled into the core product.",
    "track_since": "Q2 2024",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "Coverage-above-20%: follow-through evidence"
    },
    "src": "The recurring analyst question on every call since SGE launched; the standing phrase repeats verbatim across calls, which makes it trackable.",
    "thread": [
      {
        "q": "Q1 2025",
        "n": "+10% · AI Overviews 1.5B users/mo · \"monetization at approximately the same rate\""
      },
      {
        "q": "Q2 2025",
        "n": "+12% · AI Mode 100M MAU (US+India) · Lens queries +70%"
      },
      {
        "q": "Q3 2025",
        "n": "+15% · AI Mode 75M DAU, ads-in-AI-Mode testing begins · paid clicks +7%, CPC +7%"
      },
      {
        "q": "Q4 2025",
        "n": "+17% · Gemini 3 integrated into AI Mode & AI Overviews · queries at all-time high"
      },
      {
        "q": "Q1 2026",
        "n": "+19% (retail/finance; FX aid flagged) · NEW: coverage-above-20% upside claim · AI-response cost −30% since Gemini 3"
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q3 2025",
    "rank": 4,
    "theme": "New-surface monetization promises: AI Mode ads · Direct Offers · Gemini app",
    "tags": [
      "monetization",
      "promises",
      "ai-consumer"
    ],
    "definition": "This is where the next leg of ads growth comes from as the surface shifts — and app monetization is entirely un-modeled by the Street.",
    "track_since": "Q3 2025",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "Gemini app MAU (or a second silence)",
      "tripped": true
    },
    "src": "Direct on-call commitments tracked quarter-over-quarter (Promise-Tracker discipline, now embedded here); silence is a signal.",
    "thread": [
      {
        "q": "Q3 2025",
        "n": "\"Testing ads in AI Mode… will continue to test before expanding\""
      },
      {
        "q": "Q4 2025",
        "n": "Direct Offers pilot announced · UCP protocol launched with retail partners · Gemini-app ads: \"not rushing\""
      },
      {
        "q": "Q1 2026",
        "n": "Direct Offers \"resonating\" (Gap, L'Oréal, Chewy) · new retail ad format in test · UCP adds Amazon/Meta/Microsoft/Salesforce/Stripe; Ulta live · app ads still \"not rushing\" · no app-MAU update (silence)"
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q3 2025",
    "rank": 5,
    "theme": "TPUs go external — silicon becomes a business",
    "tags": [
      "tpu",
      "cloud"
    ],
    "definition": "A genuine business-model extension (hardware vendor economics) and the hardest proof of the full-stack differentiation claim — 8th-gen TPUs shipping while rivals buy GPUs.",
    "track_since": "Q3 2025",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "TPU-sale margins + share of backlog"
    },
    "src": "New disclosure in Q1 2026 with explicit forward guidance to reconcile; multiple analysts pressed it (Nowak, Post) and got partial answers.",
    "thread": [
      {
        "q": "Q3 2025",
        "n": "Anthropic plans access to up to 1M TPUs · Ironwood (7th gen) GA soon"
      },
      {
        "q": "Q4 2025",
        "n": "TPU accelerators serving frontier labs, capital-markets firms, governments"
      },
      {
        "q": "Q1 2026",
        "n": "8th-gen TPU 8t/8i unveiled · first hardware sales into customer data centers · \"small % of revenue later this year, vast majority 2027\""
      }
    ]
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2024",
    "rank": 1,
    "theme": "FY26 capex — does $175–185B hold?",
    "tags": [
      "capex"
    ],
    "definition": "The bear case is capex swallowing the cash machine; every raise re-tests it.",
    "track_since": "Q4 2024",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Does FY26 $175–185B hold at Q1, and what is the 2027 shape?"
    },
    "src": null,
    "thread": null
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q2 2024",
    "rank": 2,
    "theme": "Cloud — backlog conversion & a 5th acceleration",
    "tags": [
      "cloud",
      "capex"
    ],
    "definition": "Cloud is the acceleration story and the capex justification.",
    "track_since": "Q2 2024",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Backlog conversion: does $240B start showing in revenue acceleration again?"
    },
    "src": null,
    "thread": null
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q2 2024",
    "rank": 3,
    "theme": "Gemini 3 in Search — the standing phrase + monetization ladder",
    "tags": [
      "search",
      "monetization"
    ],
    "definition": "~56% of revenue; the existential question.",
    "track_since": "Q2 2024",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Gemini 3 in Search: does the standing phrase survive the integration?"
    },
    "src": null,
    "thread": null
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q1 2025",
    "rank": 4,
    "theme": "Gemini app ladder post-750M",
    "tags": [
      "ai-consumer"
    ],
    "definition": "The consumer-AI race scoreboard, and the un-modeled ads option.",
    "track_since": "Q1 2025",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Gemini app: next MAU rung after 750M?"
    },
    "src": null,
    "thread": null
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2025",
    "rank": 5,
    "theme": "Wiz close + UCP rollout (agentic commerce)",
    "tags": [
      "monetization",
      "promises",
      "cloud"
    ],
    "definition": "Cloud security pillar + the rails for agentic-era ads.",
    "track_since": "Q4 2025",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Wiz close timing + UCP: members beyond the founders?"
    },
    "src": null,
    "thread": null
  },
  {
    "q": "Q4 2025",
    "created_quarter": "Q4 2024",
    "rank": 1,
    "theme": "THE FY2026 capex number",
    "tags": [
      "capex"
    ],
    "definition": "The single number that repriced the stock at every prior guide.",
    "track_since": "Q4 2024",
    "track_until": "Q4 2025",
    "seeded_by": null,
    "src": null,
    "thread": null
  },
  {
    "q": "Q4 2025",
    "created_quarter": "Q2 2024",
    "rank": 2,
    "theme": "Cloud past +34% — and the Anthropic TPU flow-through",
    "tags": [
      "cloud",
      "tpu"
    ],
    "definition": "The acceleration narrative IS the multiple.",
    "track_since": "Q2 2024",
    "track_until": "Q4 2025",
    "seeded_by": null,
    "src": null,
    "thread": null
  },
  {
    "q": "Q4 2025",
    "created_quarter": "Q3 2025",
    "rank": 3,
    "theme": "Gemini 3 — the \"later this year\" promise, delivered?",
    "tags": [
      "search",
      "promises"
    ],
    "definition": "Model leadership is the input to every other thesis line.",
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
    "theme": "Ads in AI Mode: test → product?",
    "tags": [
      "monetization",
      "promises"
    ],
    "definition": "The bridge from AI engagement to ads revenue.",
    "track_since": "Q3 2025",
    "track_until": "Q4 2025",
    "seeded_by": null,
    "src": null,
    "thread": null
  },
  {
    "q": "Q4 2025",
    "created_quarter": "Q4 2025",
    "rank": 5,
    "theme": "YouTube election-lap depth",
    "tags": [
      "youtube"
    ],
    "definition": "Separates a comp effect from a YouTube-ads problem.",
    "track_since": "Q4 2025",
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
where c.ticker = 'GOOGL';
