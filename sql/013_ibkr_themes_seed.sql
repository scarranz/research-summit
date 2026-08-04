-- ════════════════════════════════════════════════════════════════════════════
-- 013_company_themes — IBKR seed (synthesized)
-- ════════════════════════════════════════════════════════════════════════════
-- Migrates IBKR's hardcoded Watch List (CALL_PREP.quarters[].watchList, 13 rows) into
-- company_themes. definition = the concise rationale ('why') only — one line, like the canonical
-- companies (NOT the old why+tell+breaks wall of text). created_quarter = track_since. Consensus
-- ('bbg') dropped. Run AFTER 010, once. No-op if IBKR is not in companies.

insert into company_themes
  (company_id, ticker, q, created_quarter, rank, theme, tags, definition, track_since, track_until, seeded_by, src, thread)
select c.id, 'IBKR', e.q, e.created_quarter, coalesce(e.rank, 0), e.theme,
       coalesce(array(select jsonb_array_elements_text(e.tags)), '{}'),
       e.definition, e.track_since, e.track_until, e.seeded_by, e.src, e.thread
from companies c,
  jsonb_to_recordset($seed$
[
  {
    "q": "Q3 2026",
    "created_quarter": "Q2 2026",
    "rank": 1,
    "theme": "Margin loans +67% — durability & concentration",
    "tags": [
      "margin-loans",
      "credit-risk",
      "nii"
    ],
    "definition": "Margin-loan interest was the single biggest driver of the +23% NII beat. If the growth is a few levered accounts, the NII quality — and the multiple — is worse than the headline.  🔎 The tell: The +67% powers NII, but Peterffy has historically DISLIKED fast margin growth and gave only \"we're comfortable.\" The tell: any concentration granularity + the bad-debt line ($10M in Q2). Broad & organic = the engine got bigger; concentrated = the engine got riskier.",
    "track_since": "Q2 2026",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "Margin loans +67%: concentration — a few large levered accounts vs. broad? (bad debt $1M→$10M)"
    },
    "src": "The #1 newQuestion out of the Q2 call; Chubak pressed it and got a guarded answer (regression Test #2). Bad debt $1M → $10M is the corroborating flag.",
    "thread": [
      {
        "q": "Q2 2025",
        "n": "Margin loans a record ~$55B."
      },
      {
        "q": "Q1 2026",
        "n": "Margin loans $86.6B (+35%)."
      },
      {
        "q": "Q2 2026",
        "n": "$96.6B avg / $108.5B EOP (+67%) — accelerated; only \"we're comfortable.\""
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q4 2023",
    "rank": 2,
    "theme": "NII through deeper Fed cuts — the balance-offset",
    "tags": [
      "nii",
      "rates",
      "balances"
    ],
    "definition": "NII is IBKR's largest revenue line and the entire rate-cut-discount debate. NII up while rates fall = the offset works and the discount is a mispricing.  🔎 The tell: Q2 gave the number the Street wanted: ±$81M per 25bps USD, ±$38M non-USD, and balance growth increases the impact both ways. The tell stays simple — does NII grow YoY as the Fed eases? Six straight quarters say yes; a break is the whole thesis.",
    "track_since": "Q4 2023",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "NIM 1.93% still compressing YoY — how much more as the Fed eases, and does balance growth keep out-running it?"
    },
    "src": "The recurring #1 theme across 11 calls; management discloses rate sensitivity every quarter (now ±$81M/25bps).",
    "thread": [
      {
        "q": "Q3 2025",
        "n": "NII $967M; −25bps = −$77M."
      },
      {
        "q": "Q1 2026",
        "n": "NII $904M (+17%); −25bps = −$82M."
      },
      {
        "q": "Q2 2026",
        "n": "NII $1,057M (+23%) through a −70bps move; sensitivity ±$81M/25bps."
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q4 2025",
    "rank": 3,
    "theme": "Capital return — $10.3B excess and rising, still no buyback",
    "tags": [
      "capital",
      "buyback",
      "dividend"
    ],
    "definition": "A ballooning capital base at ~77% margins is a good problem, but un-returned capital drags ROE and is the clearest un-pulled lever on the stock.  🔎 The tell: Excess capital ~$10.3B (+$1.1B QoQ), up from ~$8B a few months ago; dividend raised to $0.35/yr but no buyback. The tell: any language shift on a buyback, or M&A discipline breaking. Peterffy admitted marketing yield is NOT improving — so capital can't all be redeployed into cheap growth.",
    "track_since": "Q4 2025",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "Excess capital $10.3B and rising, no buyback — when does capital return step up?"
    },
    "src": "Q2 call: Galik put excess capital at ~$10.3B; banks pitching \"dramatically\" more M&A, nothing worth buying; still no buyback.",
    "thread": [
      {
        "q": "Q2 2025",
        "n": "~$6–7B excess after the 4-for-1 split."
      },
      {
        "q": "Q1 2026",
        "n": "Dividend policy ~0.5–1% of price; no buyback."
      },
      {
        "q": "Q2 2026",
        "n": "~$10.3B excess (+$1.1B QoQ); dividend → $0.35/yr; still no buyback."
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q3 2024",
    "rank": 4,
    "theme": "Prediction markets → the weather/insurance vertical",
    "tags": [
      "prediction-markets",
      "optionality",
      "new-products"
    ],
    "definition": "Cheap to monitor and asymmetric; not a needle-mover yet, but the aggregator + insurance-hedging framing is a genuinely new TAM if it converts.  🔎 The tell: Q2 reframed it: IBKR Prediction Markets now ROUTES across ForecastEx + CME + Kalshi, and the real vision is hurricane/temperature contracts — \"which implies insurance risk.\" Option value, ranked mid on purpose. The tell: a first revenue disclosure (never given) or how big the weather/insurance vertical gets. NO sports, reaffirmed.",
    "track_since": "Q3 2024",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "Prediction markets: any revenue, and how big can the weather/insurance-hedging vertical get?"
    },
    "src": "Recurring \"new products\" theme; Q2 pivot from exchange to router. No dedicated Bloomberg line — the qualitative, lower-weight item.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "ForecastX 286M contract pairs (from 15M)."
      },
      {
        "q": "Q1 2026",
        "n": "Election Board for the midterms."
      },
      {
        "q": "Q2 2026",
        "n": "IBKR Prediction Markets aggregator (ForecastEx+CME+Kalshi); weather/insurance vision."
      }
    ]
  },
  {
    "q": "Q3 2026",
    "created_quarter": "Q4 2024",
    "rank": 5,
    "theme": "Agentic AI + the 24-5 international engine (Korea · overnight · Tiger/Futu)",
    "tags": [
      "ai",
      "volume",
      "international"
    ],
    "definition": "Both are slow-burn volume drivers, not this-quarter needle-movers — but 24-5 trading + agentic AI is the clearest path to Peterffy's \"AI raises trading velocity\" thesis becoming revenue.  🔎 The tell: Two threads that are really one \"when & where a single account trades\" story: (a) IBKR Connector — clients wired ChatGPT/Claude/Grok to accounts organically; autonomous trading on the roadmap = a future volume lever; (b) overnight nearly tripled to 10.9M, Korea \"a line straight up,\" and the Tiger/Futu clampdown is shifting diaspora assets to IBKR. Tell: incremental volume from AI accounts + whether overnight keeps compounding.",
    "track_since": "Q4 2024",
    "track_until": null,
    "seeded_by": {
      "q": "Q2 2026",
      "n": "Agentic AI incremental volume + timeline to autonomous trading; is the 24-5 / Tiger-Futu tailwind persisting?"
    },
    "src": "Q2 call: IBKR Connector (OpenAI/Anthropic/xAI); overnight 10.9M (from 3.8M); Korea/Nextrade; Tiger/Futu asset transfers.",
    "thread": [
      {
        "q": "Q1 2026",
        "n": "Overnight nearly tripled (2.8M → 8.1M); AI should raise trading velocity long-term."
      },
      {
        "q": "Q2 2026",
        "n": "Overnight 10.9M; IBKR Connector; Korea; Tiger/Futu transfers."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q4 2023",
    "rank": 1,
    "theme": "Net interest income & the NIM crossover",
    "tags": [
      "nii",
      "rates",
      "balances"
    ],
    "definition": "NII is IBKR's largest revenue line and the entire valuation debate. NII up while rates fall = the offset works; NII down while balances still climb = the offset broke.  🔎 The tell: Consensus already had NII rising ($904M→$980M) while NIM slips 1.88%→1.85% — the Street is not betting on rates, it's betting on balances. The tell: does NII grow YoY? If it does while the Fed eases, the rate-cut discount is the mispricing.",
    "track_since": "Q4 2023",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "Does NII stay resilient as the Fed keeps easing — is it balances, not rates?"
    },
    "src": "A Bloomberg \"Highlight\" line + rate-sensitivity is the #1 recurring theme across the last 11 calls.",
    "thread": [
      {
        "q": "Q1 2026",
        "n": "NII $904M (+17%); −25bps = −$82M."
      },
      {
        "q": "Q2 2026",
        "n": "NII $1,057M (+23%); NIM 1.93% BEAT the 1.85% cons."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q4 2023",
    "rank": 2,
    "theme": "The earning-asset engine: credit balances · margin loans · customer equity",
    "tags": [
      "balances",
      "margin-loans",
      "nii"
    ],
    "definition": "The offset in #1 is literally these three lines. If they stall, NII rolls over next.  🔎 The tell: These three ARE the NII engine — what makes NII grow while NIM compresses. The answerable question: how much growth is organic vs. rate/market-driven. If they dodge it, assume some is fragile.",
    "track_since": "Q4 2023",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "Do credit balances / margin loans / equity keep compounding above +30%?"
    },
    "src": "Three separate Bloomberg \"Highlight\" lines — the vendor treats them as core drivers.",
    "thread": [
      {
        "q": "Q1 2026",
        "n": "Credit $169B (+35%), margin $86.6B (+35%), equity $789B (+38%)."
      },
      {
        "q": "Q2 2026",
        "n": "Credit +27%, margin +67%, equity +40% — accelerated."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q4 2023",
    "rank": 3,
    "theme": "Customer account growth",
    "tags": [
      "accounts",
      "pdt-rule",
      "international"
    ],
    "definition": "Accounts are the top of the flywheel — every downstream line depends on it. A sharp decel is the earliest crack.  🔎 The tell: Q2 is the first quarter after the PDT-rule change (eff. Jun 4), so a spike in small active accounts is expected. Don't be fooled by the headline — the durable tell is the international mix; a US-only PDT bump that fades is a false positive.",
    "track_since": "Q4 2023",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "How much of account growth is PDT-rule pull-forward vs. organic?"
    },
    "src": "A Bloomberg \"Highlight\" line + management's lead metric on every call; PDT (eff. Jun 4) makes Q2 the first read.",
    "thread": [
      {
        "q": "Q1 2026",
        "n": "4.75M accounts (+31%)."
      },
      {
        "q": "Q2 2026",
        "n": "5.19M (+34%) — PDT tailwind showed, growth stayed above the line."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q4 2023",
    "rank": 4,
    "theme": "DARTs → commissions (and commission per cleared order)",
    "tags": [
      "darts",
      "commissions",
      "pricing-power"
    ],
    "definition": "DARTs are the activity engine; commissions lever to them. The clean test of pricing power is per-order, not raw DARTs.  🔎 The tell: Commission per cleared order has held ~$2.65–2.83 for two straight years — that stability IS the pricing-power proof. Ignore the DART headline (it'll be up); only commission-PER-order cracking changes the story.",
    "track_since": "Q4 2023",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "Does commission-per-order hold as DARTs surge (pricing power intact)?"
    },
    "src": "Bloomberg tracks Avg Commission per DART explicitly; two-year stability is the actual evidence on the \"pricing pressure\" worry.",
    "thread": [
      {
        "q": "Q1 2026",
        "n": "DARTs 4.37M (+24%); per-order held ~$2.69."
      },
      {
        "q": "Q2 2026",
        "n": "DARTs 4.82M (+36%); per-order $2.64 — flat, moat intact."
      }
    ]
  },
  {
    "q": "Q2 2026",
    "created_quarter": "Q3 2024",
    "rank": 5,
    "theme": "New-product optionality: ForecastEx · crypto · overnight",
    "tags": [
      "new-products",
      "prediction-markets",
      "optionality"
    ],
    "definition": "Cheap to monitor and asymmetric, but not a needle-mover yet.  🔎 The tell: This won't move the quarter — it is option value, ranked last on purpose. The only things that change the story: a first ForecastEx revenue disclosure (never given) or a CFTC/sports ruling. Note it, don't trade on it.",
    "track_since": "Q3 2024",
    "track_until": "Q2 2026",
    "seeded_by": {
      "q": "Q1 2026",
      "n": "Did ForecastEx-institutional inquiries convert; any revenue tease?"
    },
    "src": "Recurring \"new products\" theme; no dedicated Bloomberg line, so the qualitative lower-weight item.",
    "thread": [
      {
        "q": "Q1 2026",
        "n": "Overnight tripled (2.8M→8.1M); ForecastEx \"biggest in a century\" (Peterffy)."
      },
      {
        "q": "Q2 2026",
        "n": "Prediction-markets aggregator; overnight 10.9M; crypto ⅓ perps."
      }
    ]
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2023",
    "rank": 1,
    "theme": "Net interest income",
    "tags": [
      "nii",
      "rates",
      "balances"
    ],
    "definition": "The rate-sensitivity crux; the whole valuation debate.",
    "track_since": "Q4 2023",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Can NII hold record as the first Fed cuts land?"
    },
    "src": "The #1 recurring theme; management discloses rate sensitivity each quarter.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "NII $966M; FY25 $3.6B."
      },
      {
        "q": "Q1 2026",
        "n": "NII $904M (+17%) — offset working."
      }
    ]
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2023",
    "rank": 2,
    "theme": "DARTs / commissions",
    "tags": [
      "darts",
      "commissions",
      "pricing-power"
    ],
    "definition": "Monetization vs. raw activity.  🔎 The tell: Watch per-order economics, not raw DARTs — stability there is the pricing-power proof.",
    "track_since": "Q4 2023",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Does per-order pricing hold as volumes rise?"
    },
    "src": "Bloomberg tracks Avg Commission per DART; its stability is the evidence.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": "Commissions record; per-order stable."
      },
      {
        "q": "Q1 2026",
        "n": "Commissions $613M (+19%); per-order ~$2.69."
      }
    ]
  },
  {
    "q": "Q1 2026",
    "created_quarter": "Q4 2023",
    "rank": 3,
    "theme": "Net-new accounts",
    "tags": [
      "accounts",
      "international",
      "pdt-rule"
    ],
    "definition": "Top of the flywheel.  🔎 The tell: International mix is the durable part; watch for PDT-rule pull-forward starting next quarter.",
    "track_since": "Q4 2023",
    "track_until": "Q1 2026",
    "seeded_by": {
      "q": "Q4 2025",
      "n": "Does record account growth continue above +30%?"
    },
    "src": "Management's lead metric on every call.",
    "thread": [
      {
        "q": "Q4 2025",
        "n": ">1M net-new accounts in FY25 (record)."
      },
      {
        "q": "Q1 2026",
        "n": "4.75M accounts (+31%)."
      }
    ]
  }
]
$seed$::jsonb) as e(
    q text, created_quarter text, rank int, theme text, tags jsonb,
    definition text, track_since text, track_until text,
    seeded_by jsonb, src text, thread jsonb )
where c.ticker = 'IBKR';
