// themes-data/tpl.js — Texas Pacific Land's theme record (Evolution ▸ Earnings ▸ Notes), the static seed.
//
// Contract: docs/PROFILE_PLAYBOOK.md §12 EV-NOTES and §24. Two readers: the theme record in Notes
// (js/overviews/tpl-ce.js) and Top Line ▸ Segments (js/segments.js, THEME_SEG maps the two segment themes to
// 'lrm' / 'wso'; the other axes are company-wide). Once the portal saves a record (Supabase, company_theme_record)
// that copy wins and this seed is no longer read.
//
// Seed v1 (2026-11-04). Primary source: SAB's handwritten call notes (TPL.pdf, 11 pages, transcribed 2026-11-04;
// calls Q2 2023 → Q3 2026). The threads he returns to are the sub-themes; each note is an English paraphrase with
// the quarter of the call. Context where his notes are thin: TPL's own earnings releases (8-K Ex. 99.1) and 10-Qs,
// each quarter tagged by the release it comes from. Every figure kept was checked against the release or 10-Q;
// figures that appear only on the call (and so could not be checked) were left out and the statement kept without
// them (list in docs/profiles/TPL.md). Not used: the competitor / valuation pages (pp. 4–5) and the analyst's own
// Bolt numbers he marked as not the company's. Per-share amounts before the Dec 22 2025 3-for-1 split say "pre-split".
// Every thread is stamped with v = TPL_THEMES_V (below) so the hydrate step can tell a saved record of this seed apart.
export var TPL_THEMES_V = 1;
export var TPL_THEMES = [
  // ── Land and Resource Management ─────────────────────────────────────────────────────────────
  { seg:'Land and Resource Management', theme:'Royalty production & operator activity', st:{ k:'trend', since:'Q2 2023', last:'Q3 2026' },
    why:'Royalty volumes on TPL acreage are set by operators’ development, not by TPL; the well inventory is the lead indicator',
    updates:[
      { q:'Q3 2026', items:['Record royalty production of <b>42.3K Boe/d</b> (39.7K in Q2) on robust development; 16.8 net wells in permits, DUCs and CUPs at Sep 30 (release).'] },
      { q:'Q2 2026', items:['Record <b>39.7K Boe/d</b>; 18.4 net wells in the inventory and 131.9 net producing wells at Jun 30 (release).', 'Substantial new gas pipeline capacity enters service over the next few quarters.'] },
      { q:'Q4 2025', items:['Fewer rigs but higher production: record <b>37.5K Boe/d</b> in Q4, 34.6K Boe/d for FY2025 (26.8K in FY2024).'] },
      { q:'Q2 2025', items:['Still a lot of undeveloped inventory with low breakevens; activity in 2H depends on commodity prices.'] },
      { q:'Q2 2024', items:['Production stable QoQ at <b>24.9K Boe/d</b>.'] },
      { q:'Q3 2023', items:['Operators reported infrastructure problems in the summer heat, which may have hit volumes; a high count of completed wells can turn to sales soon.'] },
      { q:'Q2 2023', items:['Record royalty production: <b>24.9K Boe/d</b> against 19.8K a year earlier (+26%).'] }
    ]},
  { seg:'Land and Resource Management', theme:'Commodity prices & realizations', st:{ k:'watch', since:'Q2 2023', last:'Q3 2026' },
    why:'TPL is unhedged, so the realized price per Boe passes straight into royalty revenue',
    updates:[
      { q:'Q3 2026', items:['Record oil and gas royalty revenue of <b>$167.3M</b>, mainly on higher prices and better gas realizations; realized <b>$44.97/Boe</b> ($42.17 in Q2).'] },
      { q:'Q2 2026', items:['Unhedged position captured the full upside of elevated oil prices; realized <b>$42.17/Boe</b> ($37.06 in Q1).'] },
      { q:'Q4 2025', items:['Realized <b>$29.33/Boe</b> ($34.10 in Q3); FY2025 $34.18 against $39.87 in FY2024.'] },
      { q:'Q3 2025', items:['Expect mid-cycle prices to sit above the current spot; the model does not need hedging to work through the cycle.'] },
      { q:'Q2 2025', items:['Low oil prices, tariff uncertainty and OPEC actions weighed on prices and production; free cash flow still <b>$130.1M</b>.'] },
      { q:'Q2 2024', items:['Natural gas prices very weak.'] },
      { q:'Q2 2023', items:['Royalty revenue fell on lower prices: realized price <b>−45.9%</b> YoY to $38.04/Boe; six-month net income −13.8%.', 'An <b>$8.7M</b> recovery from an arbitration with an operator over post-production deductions sits in 1H23 royalty revenue.'] }
    ]},
  { seg:'Land and Resource Management', theme:'Easements & surface (SLEM)', st:{ k:'watch', since:'Q2 2025', last:'Q3 2026' },
    why:'Pipeline, power-line and wellbore easements and materials follow midstream build-out and are lumpy',
    updates:[
      { q:'Q3 2026', items:['Easements and other surface income <b>+$12.5M</b> QoQ to $36.2M as operators expanded midstream infrastructure (release).'] },
      { q:'Q2 2026', items:['Easements and other surface income <b>+$6.3M</b> QoQ to $23.7M (release).'] },
      { q:'Q4 2025', items:['FY2025 easements up on <b>+$10.0M</b> pipeline easements, +$3.8M wellbore easements and +$2.5M lease bonuses (10-K).'] },
      { q:'Q2 2025', items:['Record SLEM revenue of <b>$36.2M</b> (release).'] }
    ]},
  // ── Water Services and Operations ────────────────────────────────────────────────────────────
  { seg:'Water Services and Operations', theme:'Water sales', st:{ k:'watch', since:'Q2 2023', last:'Q3 2026' },
    why:'Sourced and treated water for completions moves with operators’ completion schedules',
    updates:[
      { q:'Q3 2026', items:['Water sales <b>−$11.3M</b> QoQ to $28.4M on lower realized pricing, partly offset by higher volumes (672K bbl/d).'] },
      { q:'Q2 2026', items:['Water sales <b>−$7.1M</b> QoQ on lower volumes (663K bbl/d), partly offset by higher pricing (release).', 'Water contracts carry price escalators.'] },
      { q:'Q4 2025', items:['Record water sales of <b>$60.7M</b> on volumes of 1.0M bbl/d (release).'] },
      { q:'Q2 2024', items:['Record water sales of <b>$40.7M</b>; 1H24 water sales volumes +25.5% YoY. The second half can be a little softer than the first.', 'Top water customers include Exxon, ConocoPhillips, Oxy, EOG and BP.'] },
      { q:'Q3 2023', items:['Higher water service activity pushed expenses up considerably more than revenue.'] },
      { q:'Q2 2023', items:['Record source water revenues and volumes; much of the water sold goes off TPL acreage. Aim to manage water holistically across the area.'] }
    ]},
  { seg:'Water Services and Operations', theme:'Produced water royalties', st:{ k:'trend', since:'Q2 2023', last:'Q3 2026' },
    why:'Royalties on produced water crossing or injected into TPL land grow with Permian oil output',
    updates:[
      { q:'Q3 2026', items:['Record produced water royalties of <b>$41.4M</b> on record volumes of 5.5M bbl/d (release).'] },
      { q:'Q2 2026', items:['Record <b>$37.1M</b> on 4.9M bbl/d (release).'] },
      { q:'Q4 2025', items:['No near-term water limit for data centers: the Permian produces over 20M bbl/d of produced water.'] },
      { q:'Q2 2025', items:['Record <b>$30.7M</b>; TPL is procuring out-of-basin pore space for disposal and advancing beneficial reuse (release).'] },
      { q:'Q2 2024', items:['Water segment revenue <b>+15%</b> YoY to $68.3M; segment net margin 50.5% (53% in Q1).'] }
    ]},
  { seg:'Water Services and Operations', theme:'Produced water desalination', st:{ k:'promise', since:'Q2 2025', last:'Q3 2026' },
    why:'The Orla test plant decides whether desalination becomes a commercial outlet for produced water',
    updates:[
      { q:'Q3 2026', items:['Phase 2B in Orla still commissioning at 10,000 inlet bbl/d of planned capacity (release).'] },
      { q:'Q2 2026', items:['Construction complete and commissioning begun on Phase 2B in Orla, ~<b>10K bbl/d</b>; $55.8M spent on the process to date, $48.1M capitalized (10-Q).'] },
      { q:'Q1 2026', items:['The Orla R&D test plant is evaluating whether the process works; first inlet barrels expected within weeks (release).'] },
      { q:'Q4 2025', items:['The 10K bbl/d plant to start receiving produced water in the coming months.'] },
      { q:'Q3 2025', items:['Plant under construction since July 2025, service date estimated by the end of 2025 (release).'] },
      { q:'Q2 2025', items:['Began building the 10K bbl/d desalination plant in Orla in July, service estimated in late 2025 (release).'] }
    ]},
  // ── Next-gen land use ────────────────────────────────────────────────────────────────────────
  { seg:'Next-gen land use', theme:'Data centers & power generation', st:{ k:'watch', since:'Q2 2025', last:'Q3 2026' },
    why:'Land, water and power for data centers is the new revenue line management keeps pointing to',
    updates:[
      { q:'Q3 2026', items:['<b>$122.7M</b> of land bought in 2026 in Shackelford, Jones, Winkler and Reeves counties for the data center and power push (release).'] },
      { q:'Q2 2026', items:['Project Kilby: TPL provides land and brackish water to Chevron for a large power plant serving a customer data center in Reeves County.', 'Bought land in Shackelford and Jones counties, possibly for a compute user; projects in progress with hyperscalers and AI labs.'] },
      { q:'Q1 2026', items:['Sold land to a gas-power and data center developer (not Bolt) for <b>$42.5M</b>: $20.9M recognized, the rest a financing receivable; TPL will also supply water.', 'Urgency among hyperscalers to develop in West Texas has noticeably increased.'] },
      { q:'Q4 2025', items:['Data centers and desalination are the next-gen opportunities; TPL plans to keep deploying resources to commercialize them.'] },
      { q:'Q2 2025', items:['Power generation makes sense for the Permian: TPL has all the ingredients.'] }
    ]},
  { seg:'Next-gen land use', theme:'Bolt Data & Energy', st:{ k:'watch', since:'Q4 2025', last:'Q4 2025' },
    why:'TPL’s equity stake in a data-infrastructure partner developing campuses on its land',
    updates:[
      { q:'Q4 2025', items:['Invested <b>$50.0M</b> in Bolt Data & Energy under an agreement to develop data center campuses on TPL land.', 'The equity return on Bolt could be very material.'] }
    ]},
  // ── Capital allocation ───────────────────────────────────────────────────────────────────────
  { seg:'Capital allocation', theme:'Cash target, dividends & buybacks', st:{ k:'promise', since:'Q2 2024', last:'Q3 2026' },
    why:'Above a ~$700M cash target most free cash flow goes back to holders',
    updates:[
      { q:'Q3 2026', items:['Quarterly dividend held at <b>$0.60</b>, payable Dec 15 2026 (release).'] },
      { q:'Q2 2026', items:['Cash of <b>$248.6M</b> at Jun 30 against the ~$700M target; no buybacks in 1H26 (10-Q).'] },
      { q:'Q4 2025', items:['Regular dividend raised <b>12.5%</b> to $0.60; $8.4M of buybacks in 2025 (release).'] },
      { q:'Q2 2024', items:['Set a target cash balance of ~<b>$700M</b>; above it, free cash flow goes to buybacks and dividends.', 'Special dividend of $10.00 (pre-split; $3.33 after the Dec 2025 split) paid in July; quarterly $1.17 (pre-split) in September. Returns of buybacks, dividends and M&A will be compared.'] },
      { q:'Q2 2023', items:['<b>$19.5M</b> of share repurchases in the quarter (release).'] }
    ]},
  { seg:'Capital allocation', theme:'Royalty & land acquisitions', st:{ k:'trend', since:'Q3 2025', last:'Q3 2026' },
    why:'Countercyclical buying of royalties, surface and water assets in the Permian',
    updates:[
      { q:'Q3 2026', items:['<b>$122.7M</b> of land acquisitions in the first nine months of 2026 (release).'] },
      { q:'Q4 2025', items:['Acquired <b>17,306</b> net royalty acres, mostly Midland Basin, for $450.7M in cash; $500M credit facility undrawn, still net cash.'] },
      { q:'Q3 2025', items:['Agreed the Midland royalty purchase and bought ~8,147 surface acres in Martin County: <b>$505M</b> combined, all cash (release).'] }
    ]},
  { seg:'Capital allocation', theme:'Stock split 2025', st:{ k:'promise', since:'Q3 2025', last:'Q4 2025' }, trackUntil:'Q4 2025',
    why:'The second 3-for-1 split in two years',
    updates:[
      { q:'Q4 2025', items:['Closed: the 3-for-1 split took effect on Dec 22 2025 (release).'] },
      { q:'Q3 2025', items:['Board approved a 3-for-1 split on Nov 3 2025, date to be set (release).'] }
    ]},
  // ── Governance ───────────────────────────────────────────────────────────────────────────────
  { seg:'Governance', theme:'Board & largest shareholder', st:{ k:'watch', since:'Q2 2023', last:'Q2 2026' },
    why:'Horizon Kinetics, the largest holder, has a seat on the board',
    updates:[
      { q:'Q2 2026', items:['Peter Doyle, co-CEO of Horizon Kinetics, joined the board on May 5 2026 (release).'] },
      { q:'Q1 2026', items:['Doyle appointed after Murray Stahl, Horizon Kinetics’ co-founder and a director, died on Apr 7 2026 (10-Q).'] },
      { q:'Q2 2023', items:['The stockholders’ agreement case against Horizon Kinetics and SoftVest went to trial in April 2023; ruling pending, with legal and professional fees (10-Q).'] }
    ]}
];
TPL_THEMES.forEach(function(t){ t.v = TPL_THEMES_V; });
