// themes-data/nvda.js — the seed of NVIDIA's Evolution ▸ Earnings ▸ Notes theme record.
//
// Contract: docs/PROFILE_PLAYBOOK.md §12 EV-NOTES and §24. Reader: the theme record in Notes (js/overviews/nvda-ce.js). Once the
// portal saves a record (Supabase, company_theme_record) that copy wins and this seed is no longer read — unless the seed's version
// (NVDA_THEMES_V, stamped on every thread as `v`) is newer than the saved one.
//
// Source (v2, 2026-11-18): the Q3 FY27 earnings call of Nov 17 2026 — the first NVIDIA call on file (docs/calls/NVDA-latest.md, a
// third-party transcript by The Singju Post; NVIDIA posts a replay, not text) — and the 8-K of the same day (press release, CFO
// commentary, supplemental financial information) plus the 8-K of Nov 12 2026 (Item 5.02, the CEO transition). Notes are
// paraphrased in English, no quotation marks; every figure is from those filings or said on the call. No SAB handwritten notes
// exist for NVIDIA yet. Quarters are NVIDIA FISCAL ('Q3 FY27' = the quarter to Oct 25 2026).
//
// Top-level themes = the axes of NVIDIA's business: Data Center as a whole, its two platforms (Hyperscale; AI Clouds, Industrial &
// Enterprise), Edge Computing, then the company-wide threads (supply, margins and capital, China, leadership). Open vs closed
// hooks (SAB, Oct 21 2026): a thread that ended on this call carries `trackUntil` and a last note saying how it ended.

export var NVDA_THEMES_V = 2;

export var NVDA_THEMES = [
  // ── Data Center ────────────────────────────────────────────────────────────────────────────
  { seg:'Data Center', theme:'FY28 revenue outlook ~75%', st:{ k:'promise', since:'Q3 FY27', last:'Q3 FY27' },
    why:'The fiscal 2028 growth outlook, raised on this call: reconcile against FY2028 revenue when it is reported.',
    updates:[
      { q:'Q3 FY27', items:['FY2028 revenue outlook raised to about <b>+75%</b> year over year, from about +70%, and off a higher FY2027 base; it allows for data center readiness, the durability of demand and customers’ access to capital.',
        'Asked about the new US export controls (released the week of the call): still being studied, but management is confident in both the demand and the additional supply behind the 75%.'] }
    ]},
  { seg:'Data Center', theme:'Vera Rubin ramp', st:{ k:'trend', since:'Q3 FY27', last:'Q3 FY27' },
    why:'How fast the Rubin generation replaces Blackwell, in revenue and in time to production.',
    updates:[
      { q:'Q3 FY27', items:['Rubin generated nearly <b>$20B</b> in its first quarter of production shipments (from August), the fastest product ramp in NVIDIA’s history.',
        'Hyperscalers brought Vera Rubin into production in about one month, half the time Grace Blackwell took; Rubin Ultra is due next year and Feynman in 2028.',
        'Gross margin dipped slightly sequentially on the initial Rubin ramp; inventory rose to <b>$39.7B</b> to support it (CFO commentary).'] }
    ]},
  { seg:'Data Center', theme:'Vera CPU', st:{ k:'promise', since:'Q3 FY27', last:'Q3 FY27' },
    why:'The standalone CPU business: management expects total CPU revenue to more than double in FY2028.',
    updates:[
      { q:'Q3 FY27', items:['Agentic AI is driving CPU demand beyond supply; CoreWeave, Meta, Nscale and OpenAI adopted Vera, joining AWS, OCI and SpaceXAI.',
        'Total CPU revenue expected to <b>more than double in FY2028</b>.'] }
    ]},
  { seg:'Data Center', theme:'Networking', st:{ k:'trend', since:'Q3 FY27', last:'Q3 FY27' },
    why:'Networking revenue is no longer split out in the 8-K; the call is where the figure comes from.',
    updates:[
      { q:'Q3 FY27', items:['Networking revenue above <b>$21B</b> in the quarter (call; not in the CFO commentary).',
        'Co-packaged optics on track, with CPO scale-out in volume production; Lambda deployed the first production Photonics CPO switches.'] }
    ]},
  { seg:'Data Center', theme:'Frontier labs and compute pricing', st:{ k:'watch', since:'Q3 FY27', last:'Q3 FY27' },
    why:'Who buys the compute and what it rents for: the labs’ share of Data Center, rental prices, and whether pricing holds across customers.',
    updates:[
      { q:'Q3 FY27', items:['Major frontier labs expected to be about <b>15%</b> of Data Center revenue this year; labs have started building their own data centers.',
        'Token prices down nearly 60% since May; Hopper recontracted at up to 2x its original price, B300 rental rates up more than 60% since launch; installed compute fully utilized.',
        'On allocation: readiness of land, power and shell and the customer’s capital come first; every customer gets the same pricing.',
        'Agreement to acquire Hugging Face signed in September.'] }
    ]},

  // ── Hyperscale ─────────────────────────────────────────────────────────────────────────────
  { seg:'Hyperscale', theme:'Hyperscale demand', st:{ k:'trend', since:'Q3 FY27', last:'Q3 FY27' },
    why:'The largest platform: hyperscalers’ own cloud growth and backlog as the lead indicator.',
    updates:[
      { q:'Q3 FY27', items:['Hyperscale <b>$60.1B</b>, +23% sequentially and +71% year over year, on the Vera Rubin ramp and Grace Blackwell.',
        'Hyperscalers’ cloud revenue growth accelerated for the sixth straight quarter; cloud industry backlog <b>$2.5T</b>, from $2T three months earlier.'] }
    ]},

  // ── AI Clouds, Industrial & Enterprise ────────────────────────────────────────────────────
  { seg:'AI Clouds, Industrial & Enterprise', theme:'Neoclouds, sovereign, enterprise and physical AI', st:{ k:'trend', since:'Q3 FY27', last:'Q3 FY27' },
    why:'The diversification beyond the hyperscalers, and the targets management set for it.',
    updates:[
      { q:'Q3 FY27', items:['ACIE <b>$47.5B</b>, +18% sequentially and nearly 3x year over year, on Rubin shipments to neoclouds and frontier labs’ own data centers.',
        'Sovereign AI revenue more than tripled year over year; enterprise revenue expected to more than double in FY2028; physical AI on track for more than <b>$25B</b> in FY2027.'] }
    ]},

  // ── Edge Computing ─────────────────────────────────────────────────────────────────────────
  { seg:'Edge Computing', theme:'Edge Computing and PC demand', st:{ k:'watch', since:'Q3 FY27', last:'Q3 FY27' },
    why:'Workstations and physical-AI edge against a consumer PC market squeezed by memory prices.',
    updates:[
      { q:'Q3 FY27', items:['Edge Computing <b>$8.2B</b>, +14% sequentially and +42% year over year, on Blackwell workstations and edge compute for physical AI; higher memory and system prices still weigh on consumer PC demand (CFO commentary).'] }
    ]},

  // ── Supply & commitments ───────────────────────────────────────────────────────────────────
  { seg:'Supply & commitments', theme:'Supply commitments', st:{ k:'trend', since:'Q3 FY27', last:'Q3 FY27' },
    why:'How much supply NVIDIA has locked in ahead of demand, and on what terms.',
    updates:[
      { q:'Q3 FY27', items:['Supply commitments <b>$390B</b>, from $279B a quarter earlier, mostly multi-year memory (CFO commentary); data center lease and cloud commitments a little over $100B.',
        'New substrate and packaging agreements announced (Kinsus, Samsung Electro-Mechanics, SPIL), after Amkor, Ibiden, KYEC and Unimicron; memory and advanced packaging described as secured.'] }
    ]},
  { seg:'Supply & commitments', theme:'Neocloud financing and guarantees', st:{ k:'watch', since:'Q3 FY27', last:'Q3 FY27' },
    why:'NVIDIA’s exposure to the customers it helps finance: guarantees, neocloud commitments, and the criteria for new ones.',
    updates:[
      { q:'Q3 FY27', items:['Guarantees <b>$118B</b>, including <b>$105B</b> of credit support for the SB Energy PORTS-Pike campus leased to OpenAI (capacity from calendar 2028); neocloud agreements $32B.',
        'The new CFO-commentary wording (commitments take effect only once the neocloud is financed and the capacity accepted) is not a change in practice, per management.',
        'Future support to be selective and led by land, power and shell; management said a lot has changed over the quarter in how it looks at which companies to help.'] }
    ]},

  // ── Margins & capital ──────────────────────────────────────────────────────────────────────
  { seg:'Margins & capital', theme:'Gross margin: Q4 bottom, FY28 72–73%', st:{ k:'promise', since:'Q3 FY27', last:'Q3 FY27' },
    why:'Management called Q4 FY27 the trough; reconcile the Q4 print and the FY2028 range.',
    updates:[
      { q:'Q3 FY27', items:['Non-GAAP gross margin <b>74.9%</b>, above the 74.0% guide on mix.',
        'Q4 guided to <b>71.0%–72.0%</b>, called the bottom (prices on purchase orders already taken), then <b>72%–73%</b> in FY2028, unchanged from the prior call.'] }
    ]},
  { seg:'Margins & capital', theme:'Capital return', st:{ k:'promise', since:'Q3 FY27', last:'Q3 FY27' },
    why:'The buyback authorization management says it will use by the end of FY2028.',
    updates:[
      { q:'Q3 FY27', items:['Record <b>$28B</b> returned in the quarter ($22B buybacks, $6B dividends); a further $150B authorized in September, <b>$227B</b> left, to be used by the end of FY2028.',
        'Intent to return all excess free cash flow net of strategic uses; among other uses, prepayments to suppliers come first.'] }
    ]},

  // ── China & export controls ────────────────────────────────────────────────────────────────
  { seg:'China & export controls', theme:'Licensed Hopper shipments to China', st:{ k:'watch', since:'Q3 FY27', last:'Q3 FY27' }, trackUntil:'Q3 FY27',
    why:'Licensed Hopper data center sales to China, which ended this quarter.',
    updates:[
      { q:'Q3 FY27', items:['Licensed Hopper data center sales to China <b>$2.4B</b> in the quarter.',
        'Closed: NVIDIA is no longer shipping licensed Hopper data center products to China, and the Q4 guide assumes no China data center compute revenue.'] }
    ]},
  { seg:'China & export controls', theme:'New US export controls', st:{ k:'watch', since:'Q3 FY27', last:'Q3 FY27' },
    why:'Rules released by the Commerce Department the week of the Q3 FY27 call; their effect on the outlook is still being assessed.',
    updates:[
      { q:'Q3 FY27', items:['New export controls released the week of the call; management expects performance to stay strong with demand far above supply, and is still studying the rules.',
        'The board created a National Security and Export Control Oversight Committee (independent directors, outside advisors, counsel).'] }
    ]},

  // ── Leadership & governance ────────────────────────────────────────────────────────────────
  { seg:'Leadership & governance', theme:'CEO transition and search', st:{ k:'watch', since:'Q3 FY27', last:'Q3 FY27' },
    why:'Who leads NVIDIA after Jensen Huang, and whether anything in the strategy, roadmap or capital plan moves with it.',
    updates:[
      { q:'Q3 FY27', items:['Jensen Huang resigned as President, CEO and director on Nov 11 2026 (8-K); the board will not reinstate him and took no questions on the circumstances or the ongoing investigation.',
        'Colette Kress is interim CEO and remains CFO; Harvey Jones became the board’s first chair; Heidrick &amp; Struggles leads the search, with internal and external candidates, and the board will not rush it.',
        'Management described the business as usual with customers, suppliers and partners; the Q4 opex guide includes transition-related costs.'] }
    ]}
];

NVDA_THEMES.forEach(function(t){ t.v = NVDA_THEMES_V; });
