// overviews/tpl-misc-data.js — data for Texas Pacific Land Deep Dive ▸ Miscellaneous (MISC-comp, MISC-nextgen). Playbook §15b.
// Every figure is copied from a filing (SEC EDGAR) or a call transcript, with the document named beside it; nothing is
// estimated. Amounts in US$ M unless a field says otherwise. Read Nov 4 2026 (TPL 3Q26 release filed that day; the 3Q26
// 10-Q and the Nov 5 call were not out yet).

// ── MISC-comp: the challenges to the moat (evidence on both sides; no verdict) ─────────────────────────────────────
export var TPL_CHALLENGES = [
  { c:'One basin, and other companies\' drilling',
    real:'Royalties were 52% of FY2025 revenue and depend on "decisions made by the owners and operators" of the wells; about 40% of revenue came from three customers. TPL is fully unhedged (1Q26 call). In 2Q26 water sales volumes fell 19% from 1Q26 as operators "shifted some development away from the Delaware Basin" on weak local gas prices (2Q26 call).',
    holds:'The royalties "require no capital expenditures or operating expense burden" from TPL; its share of production rose from 26.8 (FY2024) to 34.6 (FY2025) and a record 42.3 thousand Boe/d (3Q26), with 16.8 net wells permitted, drilled or completed but not yet producing at Sep 30 2026. The three largest customers are investment-grade.',
    src:'10-K FY2025, Item 1; 3Q26 release (Nov 4 2026); calls of May 7 and Aug 6 2026' },
  { c:'Water: a competitive, price-sensitive business',
    real:'The 10-K calls the water market "highly competitive", with "numerous companies capable of competing effectively on a local basis". Water sales revenue fell from $39.7M (2Q26) to $28.4M (3Q26) on lower pricing while volumes rose: $0.46 a barrel in 3Q26 against $0.66 in 2Q26 (revenue ÷ volume).',
    holds:'Produced-water royalty volumes keep rising — 4.3M bbl/d in FY2025, a record 5.5M bbl/d in 3Q26 — and TPL holds that owning the land gives it "a distinct advantage over our competitors who must negotiate with existing landowners to source water and then for the right of way to deliver the water".',
    src:'10-K FY2025, Item 1 (Water Services and Operations); 3Q26 release, water table' },
  { c:'LandBridge, a direct competitor in surface and water',
    real:'LandBridge owns or manages more than 315,000 surface acres in the Delaware Basin; its revenue grew 81% to $199.1M in 2025 and its brackish water sales 30% to 44.6M barrels. Its sponsor Five Point also owns a majority of WaterBridge, which handles about 2.5M bbl/d of produced water, and LandBridge has its own data-center agreements on Reeves County land (PowLan, about 2,000 acres; a PowerBridge option on up to about 3,400 acres).',
    holds:'TPL\'s surface is 2.8 times larger (882,000 acres) and its FY2025 revenue four times LandBridge\'s ($798.2M), of which $411.7M were oil and gas royalties — LandBridge earned $12.6M from about 4,400 gross mineral acres. The two also cooperate: an area of mutual interest of about 64,000 acres with reciprocal crossing rights and royalty and revenue sharing.',
    src:'LandBridge 10-K FY2025 (Items 1 and 7) and 10-Q 2Q26; TPL 10-K FY2025' },
  { c:'Data centers and power: announced, not yet earning',
    real:'One land sale has reached revenue: $20.9M recognized in 1Q26 of a $42.5M price, the rest paid yearly through 2046, with a put for the developer and a call for TPL if milestones are missed. Bolt "is currently pursuing commercial partnerships and anchor customers"; no new definitive agreement was reported in 3Q26, after management said it "would be disappointed" without one "in the near term" (2Q26 call).',
    holds:'The buyer was named as Chevron (Project Kilby, Reeves County), with an exclusive right for TPL to source aquifer-derived water for it; TPL bought $122.7M of land in 2026, Shackelford and Jones counties included, for its data-center and power efforts; management cites "advanced conversations" on 25GW of projects (2Q26 call).',
    src:'10-Q 1Q26 and 2Q26 (Note 4); 10-K FY2025, Item 1; 3Q26 release; call of Aug 6 2026' },
  { c:'Governance: one large holder, a history of disputes',
    real:'Horizon Kinetics manages 14.7% of the stock for clients and has a director on the board. TPL sued it and SoftVest in Delaware in 2022 over voting commitments, and 2023 legal fees reached $31.5M, "principally related to legal expenses associated with stockholder matters". Horizon Kinetics invested about $47.5M in Bolt beside TPL\'s $50.0M, and held a 22.2% voting position in LandBridge.',
    holds:'One class of stock, one vote a share. The May 5 2026 Board Representative Agreement with Horizon Kinetics carries mutual non-disparagement and a standstill while its designee serves; the Audit Committee reviewed the Bolt co-investment; the CEO\'s, CFO\'s and General Counsel\'s contracts were extended to Dec 31 2029.',
    src:'Schedule 13D/A (May 7 2026); 2026 proxy; 10-K FY2023 and FY2025; 8-Ks of May 6 and Sep 25 2026' },
];

// ── MISC-comp: the business side by side (FY2025, each company's own 10-K). null = not disclosed → "—". ──────────
// surface = surface acres owned (LB: owned or managed). nra = net royalty acres as the company reports them.
// boed = royalty production, Boe per day, FY2025 average. water = what the company discloses, in its own unit.
// rev / opi = FY2025 total revenues and operating income, US$ M (op. margin = opi ÷ rev). nd = debt drawn − cash at
// Dec 31 2025, US$ M (the same denominators as Valuation ▸ Peers).
export var TPL_PEER_OPS = [
  { tk:'VNOM', n:'Viper Energy', surface:null, nra:96003, nraNote:'Viper basis: net mineral acres × the average royalty, not normalized to 1/8',
    boed:95126, boedNote:'about 134,000 in 4Q25, after the Sitio acquisition', water:null, rev:1395.0, opi:-140.0, opiNote:'after $768M of non-cash ceiling-test impairments', nd:2173.0,
    src:'Viper 10-K FY2025 (filed Feb 25 2026)' },
  { tk:'TPL', n:'Texas Pacific Land', me:true, surface:882000, nra:224000, nraNote:'normalized to 1/8',
    boed:34600, water:'763K bbl/d sold · 4.29M bbl/d under produced-water royalties', rev:798.2, opi:592.2, nd:-144.8, ndNote:'no debt drawn',
    src:'TPL 10-K FY2025 (filed Feb 18 2026), Item 1 and income statement' },
  { tk:'BSM', n:'Black Stone Minerals', surface:null, nra:null, nraNote:'reports mineral interests in about 16.9M gross acres (43.4% average ownership)',
    boed:34600, boedNote:'excludes NGL volumes, which it cannot determine', water:null, rev:469.9, revNote:'includes a $47.6M gain on derivatives', opi:308.4, nd:152.5,
    src:'Black Stone 10-K FY2025 (filed Feb 24 2026)' },
  { tk:'KRP', n:'Kimbell Royalty Partners', surface:null, nra:null, nraNote:'reports about 12.3M gross acres of mineral and royalty interests plus 4.7M of overriding royalties',
    boed:25760, water:null, rev:333.8, revNote:'includes a $12.1M gain on derivatives', opi:132.8, nd:397.5,
    src:'Kimbell 10-K FY2025 (filed Feb 26 2026)' },
  { tk:'LB', n:'LandBridge', surface:315000, surfaceNote:'more than 315,000, owned or managed', nra:null, nraNote:'about 4,400 gross mineral acres; no royalty-acre figure',
    boed:null, water:'44.6M bbl of brackish water sold in the year · produced-water royalty volumes not disclosed', rev:199.1, opi:118.5, nd:540.0,
    src:'LandBridge 10-K FY2025 (filed Feb 26 2026)' },
  { tk:'DMLP', n:'Dorchester Minerals', surface:null, nra:null, nraNote:'reports 473,000 net mineral acres; net royalty acreage "not determinable"',
    boed:null, boedNote:'reports oil and gas volumes separately, no Boe total', water:null, rev:152.8, opi:57.4, opiNote:'operating revenues less costs and expenses', nd:-41.9, ndNote:'no debt',
    src:'Dorchester 10-K FY2025 (filed Feb 24 2026)' },
];

// ── MISC-nextgen: every project or transaction TPL has disclosed. amt = US$ M as disclosed (null = not disclosed). ──
// Grouped by type in the pane. The Kilby land sale is the 1Q26 sale to an unnamed "developer of a power generation plant
// to support data center operations" (10-Q 1Q26); the 10-Q 2Q26 names the buyer as Chevron — one transaction, not two.
export var TPL_NEXTGEN = [
  { type:'Acquisition', p:'Land for data-center and power projects', who:'Sellers not named', where:'Shackelford and Jones; also Winkler and Reeves', amt:122.7,
    date:'1Q26–3Q26', status:'Acquired',
    note:'9M26 aggregate, which also includes the Winkler and Reeves tracts; $110.2M by Jun 30 2026. On the Aug 6 call: "over 10,000 acres" in Shackelford and Jones "for approximately $100 million", a project being developed with Bolt.',
    src:'10-Q 2Q26, Note 4; 3Q26 release; call of Aug 6 2026' },
  { type:'Own facility', p:'Orla Phase 2B produced-water desalination', who:'TPL (Texas Pacific Water Resources)', where:'Orla, Texas', amt:55.8,
    date:'2024–2026', status:'Built; commissioning since 2Q26',
    note:'Spent through Jun 30 2026 ($48.1M capitalized); capacity 10,000 inlet barrels a day. About $20M of co-location equipment (waste-heat capture, data-center cooling) planned for 2026 (Feb 19 call).',
    src:'10-Q 2Q26 (Liquidity); 3Q26 release; call of Feb 19 2026' },
  { type:'Equity investment', p:'Bolt Data & Energy', who:'Bolt Data & Energy, Inc. (chaired by Eric Schmidt)', where:'TPL land (sites not named)', amt:50.0,
    date:'Dec 2025', status:'Invested; Bolt seeking partners and anchor customers',
    note:'Minority stake with warrants, part of a $150.0M raise; TPL may contribute land for more Bolt equity by mutual agreement.',
    src:'10-K FY2025, Item 1 (Recent Developments)' },
  { type:'Land sale', p:'Project Kilby — land', who:'Chevron U.S.A. Inc.', where:'Reeves', amt:42.5,
    date:'1Q26', status:'Closed; $20.9M recognized',
    note:'Nominal cash at closing, annual payments through 2046 ($42.4M contractual, recorded at $20.9M at 7.5%); put option for the developer and call option for TPL if development milestones are not met. Chevron is developing a large-scale power generation facility to support a customer data center.',
    src:'10-Q 1Q26 and 2Q26, Note 4' },
  { type:'Water supply', p:'Project Kilby — water', who:'Chevron U.S.A. Inc.', where:'Reeves', amt:null,
    date:'1Q26', status:'Agreed; no revenue disclosed',
    note:'Exclusive right to source aquifer-derived water for the power plant and associated parts of the project, under a separate supply agreement; "likely" brackish water to start (May 7 call).',
    src:'10-Q 2Q26, Note 4; call of May 7 2026' },
  { type:'Water supply', p:'Bolt-affiliated projects — water', who:'Bolt Data & Energy, Inc.', where:'—', amt:null,
    date:'Dec 2025', status:'Right of first refusal',
    note:'Right of first refusal to supply water to Bolt-affiliated projects and related infrastructure, received with the equity investment.',
    src:'10-K FY2025, Item 1' },
  { type:'Lease', p:'Renewables and "next generation" agreements', who:'Third parties (not named)', where:'—', amt:null,
    date:'Since the FY2023 10-K', status:'Evaluation; multi-year terms',
    note:'Agreements covering the evaluation of data centers, power generation, grid-connected batteries and carbon capture and sequestration (FY2025 10-K; the FY2023 and FY2024 10-Ks also list bitcoin mining facilities); paid as royalty, fee, profit sharing, lease or rent. Wind and solar leases are booked within easements and other surface-related income, not shown separately.',
    src:'10-K FY2025, FY2024 and FY2023, Item 1 and revenue-recognition note' },
];

// What has reached the income statement so far — figures the filings give.
export var TPL_NG_REVENUE = [
  ['Land sale to Chevron (Project Kilby), recognized at closing', '$20.9M', '1Q26', '10-Q 1Q26, Note 4'],
  ['Interest income on the Kilby financing receivable (other income, net)', '$0.5M', '1H26', '10-Q 2Q26, Note 4'],
  ['All land sales, nine months', '$21.1M of $756.3M total revenues (2.8%)', '9M26', '3Q26 release'],
  ['Water supply (Kilby, Bolt), Bolt equity, desalination output, renewables', 'None disclosed', '—', '10-Q 2Q26; 3Q26 release'],
];

// Management commentary — verbatim from the call transcripts (and one release quote, marked as such).
export var TPL_NG_QUOTES = [
  { q:'For TPL, we can provide unrivaled access to land, conventional and renewable energy, and water.', who:'Tyler Glover, CEO', when:'4Q25 call, Feb 19 2026' },
  { q:'Obviously, we\'ve got the right of first refusal on the water, which we think could be substantial. And then, you know, the equity return on Bolt could be very material for our business.', who:'Tyler Glover, CEO', when:'4Q25 call, Feb 19 2026' },
  { q:'I would add that it is important to not overextrapolate deal structure and terms from any one deal.', who:'Tyler Glover, CEO', when:'1Q26 call, May 7 2026' },
  { q:'We want to be as involved in the project as we can while still being really capital-light.', who:'Tyler Glover, CEO', when:'2Q26 call, Aug 6 2026' },
  { q:'I would be disappointed if we don\'t announce at least one or more major definitive agreements in the near term.', who:'Tyler Glover, CEO', when:'2Q26 call, Aug 6 2026' },
  { q:'The eventual goal is to get produced water into data center usage.', who:'Tyler Glover, CEO', when:'2Q26 call, Aug 6 2026' },
  { q:'our efforts towards data centers, power generation, and produced water desalination and beneficial reuse continue to progress, and we are steadfastly working to advance those into meaningful commercial outcomes.', who:'Tyler Glover, CEO', when:'3Q26 earnings release, Nov 4 2026' },
];
