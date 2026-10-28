// themes-data/tsm.js — TSMC's theme record (Evolution ▸ Earnings ▸ Notes), the static seed.
//
// Contract: docs/PROFILE_PLAYBOOK.md §12 EV-NOTES and §24. Two readers: the Notes tab (js/overviews/tsm-ce.js),
// where it is edited, and Top Line ▸ Segments ▸ "What management has said" (js/segments.js, THEME_SEG maps
// 'AI & HPC demand' → HPC and 'Consumer & smartphone' → Smartphone). Once the portal has saved a record
// (Supabase table company_theme_record) that copy wins and this seed is no longer read.
//
// Only REAL notes from calls that have happened, each with its quarter: the record starts with the 3Q26 call
// (Oct 15, 2026 — docs/calls/TSM-latest.md); earlier TSMC calls were not in the repo when it was seeded.
// Quotes are verbatim from the transcript; everything else is paraphrase without quotation marks.
export var TSM_THEMES = [
  // ── AI & HPC demand ───────────────────────────────────────────────────────────────────────────
  { seg:'AI & HPC demand', theme:'AI accelerator growth', st:{ k:'watch', since:'Q3 2026', last:'Q3 2026' },
    why:'TSMC\'s own narrow AI-accelerator CAGR (mid-to-high 50s, 2024–2029) is the yardstick for the AI share of its revenue.',
    updates:[
      { q:'Q3 2026', items:['Guide still mid-to-high 50s CAGR (2024–2029); C.C. Wei: "Whether it is a high 50 CAGR, it does not matter. <b>It probably will be higher.</b>"',
                            'Demand "still far above our capability today to supply"; agentic AI CPUs growing but <b>not included</b> in the AI-accelerator definition.'] },
    ]},
  { seg:'AI & HPC demand', theme:'HPC share of revenue', st:{ k:'trend', since:'Q3 2026', last:'Q3 2026' },
    why:'HPC (AI accelerators, CPUs, networking) is the platform that sets TSMC\'s growth.',
    updates:[
      { q:'Q3 2026', items:['HPC <b>+22% QoQ</b> to <b>68%</b> of revenue.'] },
    ]},
  { seg:'AI & HPC demand', theme:'Full-year growth', st:{ k:'promise', since:'Q3 2026', last:'Q3 2026' },
    why:'Management\'s full-year revenue view in US$, to reconcile against the 4Q26 print.',
    updates:[
      { q:'Q3 2026', items:['FY2026 revenue growth now expected "to be <b>around 44%</b> year-over-year in U.S. dollar term"; 4Q26 guide <b>$52.3–54.3B</b>.'] },
    ]},
  // ── Leading-edge technology ───────────────────────────────────────────────────────────────────
  { seg:'Leading-edge technology', theme:'N2 ramp', st:{ k:'trend', since:'Q3 2026', last:'Q3 2026' },
    why:'The node that carries the next two years of leading-edge revenue — and the current margin dilution.',
    updates:[
      { q:'Q3 2026', items:['2nm <b>8%</b> of wafer revenue in its third quarter of volume production; N2 family annual capacity to "<b>more than double in 2027</b>".'] },
    ]},
  { seg:'Leading-edge technology', theme:'A14', st:{ k:'promise', since:'Q3 2026', last:'Q3 2026' },
    why:'Dated milestones management committed to.',
    updates:[
      { q:'Q3 2026', items:['Risk production <b>2027</b>, volume production <b>2028</b>; "We expect that the A14 will be a bigger node than our current N2 technologies."'] },
    ]},
  { seg:'Leading-edge technology', theme:'High NA EUV', st:{ k:'watch', since:'Q3 2026', last:'Q3 2026' },
    why:'TSMC adopts High NA after some competitors; the claim is that maturity and cost matter more than timing.',
    updates:[
      { q:'Q3 2026', items:['High NA into mass production from <b>2030</b>; a 12-inch photomask with ASML planned by 2031.'] },
    ]},
  // ── Margins & overseas fabs ───────────────────────────────────────────────────────────────────
  { seg:'Margins & overseas fabs', theme:'Overseas-fab dilution', st:{ k:'promise', since:'Q3 2026', last:'Q3 2026' },
    why:'Management sized the gross-margin cost of fabs outside Taiwan with a range and a time frame.',
    updates:[
      { q:'Q3 2026', items:['Dilution now "closer to 2%", widening to <b>3–4 points</b> in the latter part of the five-year period as more US fabs ramp.'] },
    ]},
  { seg:'Margins & overseas fabs', theme:'2nm margin dilution', st:{ k:'watch', since:'Q3 2026', last:'Q3 2026' },
    why:'Each new node dilutes gross margin while it ramps; N2 is steeper than usual.',
    updates:[
      { q:'Q3 2026', items:['Gross margin <b>66.4%</b> (−1.3 pts) on the 2nm ramp; 4Q26 guided to <b>66%</b> at the midpoint (−40bp).'] },
    ]},
  { seg:'Margins & overseas fabs', theme:'Pricing', st:{ k:'watch', since:'Q3 2026', last:'Q3 2026' },
    why:'The offset to dilution: how TSMC prices by node and by location.',
    updates:[
      { q:'Q3 2026', items:['Pricing "depends on the market segment, depends on the location, and depends on the technology"; US-made wafers are priced differently from Taiwan.'] },
    ]},
  // ── Capacity & capex ──────────────────────────────────────────────────────────────────────────
  { seg:'Capacity & capex', theme:'Capex', st:{ k:'promise', since:'Q3 2026', last:'Q3 2026' },
    why:'The budget TSMC committed to, and the step-up it promised for 2026–2028.',
    updates:[
      { q:'Q3 2026', items:['2026 budget <b>$60–64B</b> reiterated; 2026–2028 "significantly higher than the past three years"; "The tool price inflation is real."'] },
    ]},
  { seg:'Capacity & capex', theme:'US expansion', st:{ k:'watch', since:'Q3 2026', last:'Q3 2026' },
    why:'Where the overseas dilution comes from, and whether the US footprint grows beyond Arizona.',
    updates:[
      { q:'Q3 2026', items:['Arizona second fab to volume in <b>3Q27</b>, slightly ahead of schedule; Texas evaluated; Terafab under discussion, and any fab "has to be run by TSMC".'] },
    ]},
  { seg:'Capacity & capex', theme:'Advanced packaging', st:{ k:'trend', since:'Q3 2026', last:'Q3 2026' },
    why:'CoWoS-class packaging is the other bottleneck of AI supply.',
    updates:[
      { q:'Q3 2026', items:['<b>5x reticle</b> in volume production, 9x and 14x next; back-end capacity short — silicon interposers sourced from GlobalFoundries.'] },
    ]},
  // ── Consumer & smartphone ─────────────────────────────────────────────────────────────────────
  { seg:'Consumer & smartphone', theme:'Consumer softness', st:{ k:'watch', since:'Q3 2026', last:'Q3 2026' },
    why:'Management flagged consumer and price-sensitive end markets as challenged going into 2027.',
    updates:[
      { q:'Q3 2026', items:['"Consumer and price-sensitive end market segment are being challenged due to the impact of rising component prices"; TSMC "prudent" in planning for 2027. Smartphone <b>21%</b> of revenue.'] },
    ]},
];
