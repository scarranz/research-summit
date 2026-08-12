// overviews/dis-data.js — data for The Walt Disney Company (NYSE: DIS) Overview + Deep Dive.
//
// All figures are sourced from company filings unless labeled otherwise:
//   FY2025 Form 10-K (year ended Sep 27, 2025), the FY2026 10-Qs (1Q-3Q), the Q2/Q3 FY26
//   earnings releases, the FY25 Entertainment SVOD P&L supplement, and the FY Q3'25-Q3'26
//   earnings-call transcripts. See dis-context/DIS_context.md for the full source pack.
//   Forward figures (FY26E/FY27E) are company GUIDANCE, labeled as such — never fact.
//
// Data only — no DOM, no Chart.js. The render module (dis.js) imports these.

// ─── Brand palette (Disney+ blue + per-segment accents) ─────────────────────────
export var DIS_BRAND  = '#1D3FB8';   // Disney+ blue
export var DIS_BRAND2 = '#3B6FE0';
export var SEG_ENT = '#6B5AE0';      // Entertainment — purple
export var SEG_SPT = '#E0463C';      // Sports (ESPN) — red
export var SEG_EXP = '#E3A73A';      // Experiences (Parks) — gold

// ─── Key Facts — 10 cells (5x2). Filer status = domestic (CIK 1744489 files 10-K). ─────
export var DIS_FACTS = [
  ['Listing', 'NYSE: DIS'],
  ['HQ', 'Burbank, California, USA'],
  ['Incorporated', 'Delaware, USA'],
  ['SEC filer', 'Domestic (10-K/10-Q/8-K)'],
  ['Founded', '1923 (Walt & Roy Disney)'],
  ['IPO', '1957 (NYSE)'],
  ['CEO', 'Josh D’Amaro · CEO since 2026 (succeeded Iger)'],
  ['Employees', '~233,000 · FY2025'],
  ['Dividend', 'Payer · $1.50/sh for FY2026 (+50%)'],
  ['Market cap', 'live'],
];

export var DIS_LEDE = "The Walt Disney Company is a global entertainment and media business built on a century of storytelling and its own intellectual property. It operates through three segments — Entertainment (film, television and Disney+/Hulu streaming), Sports (ESPN) and Experiences (theme parks, resorts, cruise line and consumer products) — turning franchises into content, subscribers, park visits and licensed merchandise. Since 2019 the company has been reorganizing around direct-to-consumer streaming while its parks and cruise business funds and de-risks that transition.";

// ─── 2x2 quadrant (each cell <= ~30 words) ──────────────────────────────────────
export var DIS_QUAD = [
  ['What it sells', "Stories and the franchises around them — movies and shows, the Disney+/Hulu/ESPN streaming services, theme-park and cruise vacations, and licensed consumer products."],
  ['Who buys it', "Consumers worldwide (streaming subscribers, park guests, cruise passengers), advertisers on ESPN/ABC and streaming, and licensees & distributors of Disney IP."],
  ['How it earns', "FY2025: ~45% Entertainment · ~19% Sports · ~38% Experiences (of ~$94B revenue); Experiences is the largest profit pool, streaming the fastest-improving one."],
  ['The edge', "Irreplaceable IP (Disney, Pixar, Marvel, Star Wars, ESPN) monetized across a flywheel — a hit film becomes a ride, a cruise, merchandise and streaming hours."],
];

// ─── How it makes money — FY2025 segment revenue (reconciles to $94,425M w/ eliminations) ─
// Eliminations were -$1,869M in FY2025; the three segments gross to $96,294M.
export var DIS_SEG_REV = [
  ['Experiences', 38, '$36.2B', '38%', SEG_EXP],
  ['Entertainment', 45, '$42.5B', '45%', SEG_ENT],
  ['Sports', 19, '$17.7B', '19%', SEG_SPT],
];
// Geography (FY2025 revenue by source region, per 10-K): US-heavy.
export var DIS_GEO = [
  ['United States & Canada', 76, '~$71.5B', '~76%', DIS_BRAND],
  ['Europe', 12, '~$11.6B', '~12%', DIS_BRAND2],
  ['Asia Pacific', 8, '~$7.6B', '~8%', SEG_EXP],
  ['Latin America & other', 4, '~$3.7B', '~4%', SEG_SPT],
];

// Qualitative segment definitions (NO numbers here — the chart carries them).
export var DIS_SEG_DEFS = [
  { seg: 'Entertainment',
    desc: "Everything non-sports in film and television. It spans <b>Direct-to-Consumer streaming</b> (Disney+ and Hulu), <b>Content Sales/Licensing</b> (theatrical releases from Disney, Pixar, Marvel, Lucasfilm and 20th Century, plus TV/home-entertainment licensing) and the shrinking <b>Linear Networks</b> (ABC, Disney Channel, FX, National Geographic). It earns from subscriptions, advertising, box office and content licensing.",
    subs: [
      ['Direct-to-Consumer (Disney+ / Hulu)', 'Subscription video, now the growth and margin engine. Reported via the Entertainment SVOD P&L: ~$19.7B revenue in FY2025, operating income turning from loss to profit.'],
      ['Content Sales / Licensing', 'Theatrical box office and TV/home-entertainment licensing off the studio slate. ~$8.5B in FY2025.'],
      ['Linear Networks', 'ABC and the cable channels — still profitable but in structural decline (revenue -12% in FY2025) as viewing shifts to streaming.'],
    ] },
  { seg: 'Sports',
    desc: "Essentially <b>ESPN</b> — the domestic sports networks, ESPN on ABC, the new ESPN direct-to-consumer app (ESPN Unlimited / ESPN Select), and international sports channels. It earns from affiliate fees, advertising and, increasingly, streaming subscriptions. Rising sports-rights costs (NFL, NBA) are the main pressure on its margins.",
    subs: [
      ['ESPN networks & DTC', 'Affiliate fees + advertising + the ESPN flagship streaming app launched Aug 2025. Now ~72%-owned after the NFL took a 10% equity stake in exchange for NFL Network.'],
      ['Rights portfolio', 'NFL, NBA (ramping), college football/CFP, WWE Premium Live Events (exclusive from Sept 2025). Heading into ESPN’s first Super Bowl.'],
    ] },
  { seg: 'Experiences',
    desc: "The parks-and-vacations business and the licensing of Disney characters. It covers <b>domestic parks</b> (Walt Disney World, Disneyland), <b>international parks</b> (Paris, Hong Kong, Shanghai, plus royalties from Tokyo), the <b>Disney Cruise Line</b>, Disney Vacation Club, and <b>Consumer Products</b> (merchandise licensing). It is the company’s largest and most stable profit pool.",
    subs: [
      ['Domestic Parks & Experiences', 'Walt Disney World (Orlando) and Disneyland (Anaheim) plus the cruise line — the biggest earnings driver. Per-capita spending and attendance are the key levers.'],
      ['International Parks & Experiences', 'Disneyland Paris (owned), Hong Kong (48%), Shanghai (43%, consolidated), and Tokyo (licensed — royalty income only).'],
      ['Consumer Products', 'Merchandise licensing of Disney/Marvel/Star Wars/Pixar IP and Disney Store retail. Moves into the Entertainment segment starting Q1 FY2027.'],
    ] },
];

// ─── Segment topline (revenue) + bottom line (operating income), $M ──────────────
// Annual (FY24, FY25) from the 10-K; FY26 shown as quarters (1Q-3Q) from the 10-Qs.
export var SEG_ANN_LABELS = ['FY2024', 'FY2025'];
export var SEG_ANN = {
  rev: { Entertainment: [41186, 42466], Sports: [17619, 17672], Experiences: [34151, 36156] },
  oi:  { Entertainment: [3923, 4674],  Sports: [2406, 2882],   Experiences: [9272, 9995] },
};
export var SEG_Q_LABELS = ['1Q26', '2Q26', '3Q26'];
export var SEG_Q = {
  rev: { Entertainment: [11609, 11715, 11345], Sports: [4909, 4609, 4500], Experiences: [10006, 9487, 9968] },
  oi:  { Entertainment: [1100, 1336, 1680],    Sports: [191, 652, 858],    Experiences: [3309, 2615, 3017] },
};

// ─── The streaming inflection — Entertainment SVOD operating income & margin ─────
// From the FY25 SVOD P&L supplement + Q2/Q3 FY26 releases.
export var SVOD_LABELS = ['1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26'];
export var SVOD_OI     = [261, 310, 329, 402, 450, 582, 712];      // $M
export var SVOD_MARGIN = [5.4, 6.4, 6.6, 7.9, 8.4, 10.6, 12.9];    // %

// ─── Capex and the Experiences profit it funds ($B) ─────────────────────────────
// Reported: FY2024 $5.4B, FY2025 $8.0B (10-K). FY2026E ~$9B is company GUIDANCE.
export var CAPEX_LABELS = ['FY2024', 'FY2025', 'FY2026E'];
export var CAPEX_VALS   = [5.41, 8.02, 9.00];              // capex, $B (FY26E = guidance)
export var CAPEX_EXP_OI = [9.27, 10.00, null];            // Experiences segment OI, $B
export var CAPEX_CFO    = [13.97, 18.10, null];           // cash from operations, $B (FY26E >=$19B guide)
export var CAPEX_IS_EST = [false, false, true];

// ─── Products — two tiers (family card -> pop-up list) ──────────────────────────
export var DIS_PRODUCTS = [
  { ic: '📺', fam: 'Streaming', d: 'The direct-to-consumer future.', items: [
    ['Disney+', 'The flagship service for Disney, Pixar, Marvel, Star Wars and National Geographic. ~131.6M Core subscribers (FY2025); ARPU rising.'],
    ['Hulu', 'General-entertainment streaming (now 100%-owned). Being integrated into one Disney+/Hulu app; the international "Star" tile was rebranded Hulu in 2025.'],
    ['ESPN (Unlimited / Select)', 'The full ESPN flagship launched as a standalone app in Aug 2025; the $29.99 "Trio" bundles it with Disney+ and Hulu.'],
  ] },
  { ic: '🎬', fam: 'Studios & content', d: 'The IP engine.', items: [
    ['Walt Disney Studios', 'Animation and live-action Disney films — the core franchise machine (Frozen, Moana, Zootopia).'],
    ['Pixar', 'Premium animation (Toy Story, Inside Out) — acquired 2006.'],
    ['Marvel Studios', 'The Marvel Cinematic Universe — acquired 2009.'],
    ['Lucasfilm', 'Star Wars and Indiana Jones — acquired 2012.'],
    ['20th Century / Searchlight', 'Broader film and prestige slate — from the 2019 Fox acquisition.'],
  ] },
  { ic: '🏰', fam: 'Parks & resorts', d: 'The largest profit pool.', items: [
    ['Walt Disney World', 'Four theme parks + resorts in Orlando, Florida — the single biggest earnings driver.'],
    ['Disneyland Resort', 'Two parks in Anaheim, California.'],
    ['Disneyland Paris', 'Owned resort; adding World of Frozen / Disney Adventure World (2026).'],
    ['Hong Kong & Shanghai', 'Consolidated international parks (48% / 43% owned); Shanghai added Zootopia Land.'],
    ['Tokyo Disney Resort', 'Licensed to Oriental Land Co. — Disney earns royalties, invests no capital.'],
  ] },
  { ic: '🚢', fam: 'Cruise & vacations', d: 'The fastest-growing capacity.', items: [
    ['Disney Cruise Line', 'A fleet expanding from 8 ships toward 13 by 2031 — Wish, Treasure, Destiny (2025) and Adventure (2026, Singapore-homeported).'],
    ['Disney Vacation Club', 'Timeshare/membership vacation ownership.'],
    ['Adventures by Disney', 'Guided group travel and expeditions.'],
  ] },
  { ic: '📡', fam: 'Linear networks', d: 'The declining cash cow.', items: [
    ['ABC', 'Broadcast network + owned stations.'],
    ['ESPN networks', 'The cable sports channels (reported under Sports).'],
    ['FX, Nat Geo, Disney Channel', 'Cable entertainment brands — in structural decline as viewing shifts to streaming.'],
  ] },
  { ic: '🧸', fam: 'Consumer products', d: 'IP without the capital.', items: [
    ['Merchandise licensing', 'Licensing Disney/Marvel/Star Wars/Pixar characters onto toys, apparel and games — very high margin.'],
    ['Disney Store & shopDisney', 'Owned retail and e-commerce.'],
  ] },
];

// ─── Timeline — corporate lineage & business-model inflections (conventions rubric) ─
export var DIS_TIMELINE = [
  ['1923', 'Founded as the Disney Brothers Cartoon Studio', "Walt and Roy Disney start an animation studio in Los Angeles. Mickey Mouse (1928) and the first feature, Snow White (1937), establish the IP-first model that still defines the company.", null],
  ['1957', 'Goes public on the NYSE', "Walt Disney Productions lists publicly, funding the leap from studio into theme parks.", null],
  ['1955', 'Disneyland opens — the first business-model inflection', "The studio becomes an experiences company. A film library is turned into a physical, recurring-revenue destination — the template for the modern flywheel.", [
    'Disneyland (Anaheim) opens 1955',
    'Walt Disney World (Orlando) follows in 1971 — far larger, and today the biggest single profit driver',
  ]],
  ['1995', 'Acquires Capital Cities/ABC (~$19B)', "Brings ABC and, crucially, ESPN into Disney — the foundation of today’s Sports segment and the linear-TV business.", null],
  ['2006', 'Buys Pixar ($7.4B)', "Steve Jobs becomes Disney’s largest shareholder; Pixar revives Disney animation. The first of three franchise acquisitions that reshaped the IP vault.", null],
  ['2009', 'Buys Marvel ($4B)', "Acquires the Marvel character library — the Marvel Cinematic Universe becomes the highest-grossing film franchise in history.", null],
  ['2012', 'Buys Lucasfilm ($4.05B)', "Adds Star Wars and Indiana Jones — completing the franchise portfolio that feeds films, parks, merchandise and streaming.", null],
  ['2019', 'Fox deal (~$71B) + Disney+ launches — the streaming inflection', "The largest deal in company history and a pivot to direct-to-consumer. What the company fundamentally is begins to change: from selling content wholesale to owning the subscriber relationship.", [
    'Acquires 21st Century Fox film & TV assets (~$71B, 2019)',
    'Disney+ launches Nov 2019; streaming runs a ~$4B annual loss at its worst',
    'By FY2025 the streaming (SVOD) business turns profitable — ~$1.3B operating income',
  ]],
  ['2023', 'Takes full control of Hulu', "Buys out NBCUniversal’s stake (~$8.6B floor payment) — consolidating Hulu into a single Disney+/Hulu app and unifying the streaming strategy.", null],
  ['2025', 'ESPN goes direct-to-consumer + the NFL deal', "ESPN launches its full flagship streaming app (Aug 2025) and agrees to acquire NFL Network in exchange for a 10% NFL equity stake in ESPN — the sports business’s own streaming pivot.", null],
  ['2026', 'Josh D’Amaro succeeds Bob Iger as CEO', "The long-planned leadership transition completes; the parks chief takes over with streaming profitable, EPS growth guided to ~12%, and buybacks ramped toward $9B.", null],
];

// ─── Competitor scatter — seeded, labeled approximate (mid-2026). Not live multiples. ─
// x = valuation multiple, y = revenue growth %. Bubble = market cap (live where available).
export var DIS_PEERS = [
  { tk: 'DIS',   name: 'Disney',            pe: 18.5, ev: 12.5, peF: 16.0, evF: 11.0, g: 6,  gF: 6,  seed: true, self: true },
  { tk: 'NFLX',  name: 'Netflix',           pe: 38.0, ev: 28.0, peF: 32.0, evF: 24.0, g: 15, gF: 13, seed: true },
  { tk: 'CMCSA', name: 'Comcast',           pe: 9.5,  ev: 6.8,  peF: 9.0,  evF: 6.5,  g: 1,  gF: 2,  seed: true },
  { tk: 'WBD',   name: 'Warner Bros. Disc.', pe: null, ev: 7.5,  peF: 22.0, evF: 7.0,  g: -3, gF: 0,  seed: true },
  { tk: 'PARA',  name: 'Paramount',         pe: 14.0, ev: 8.5,  peF: 12.0, evF: 8.0,  g: 0,  gF: 1,  seed: true },
  { tk: 'SPOT',  name: 'Spotify',           pe: 62.0, ev: 45.0, peF: 44.0, evF: 34.0, g: 18, gF: 16, seed: true },
];

// ─── The interactive explorer — parks, cruises, streaming & the expansion pipeline ─
// Level 0 = categories; Level 1 = items (click for the detail panel). status drives the dot.
//   status: 'open' (operating) | 'launch' (opening now / next year) | 'planned' (future)
export var DIS_MAP = [
  { id: 'domestic', name: 'Domestic Parks', ic: '🏰', accent: SEG_EXP,
    tag: 'US theme parks & resorts', region: 'United States',
    desc: "Walt Disney World and Disneyland — the core of the Experiences segment and the company’s single largest profit driver. Growth here comes from per-capita spending, attendance, and new lands.",
    items: [
      { name: 'Walt Disney World', where: 'Orlando, Florida', status: 'open', tags: ['4 parks', 'largest profit driver'],
        detail: "Four theme parks plus resorts and water parks. Posted record revenue in FY2025 with domestic per-capita spending up ~8% in mid-2025. As the Universal Epic Universe headwind lapped, attendance returned to +3% growth by Q3 FY2026." },
      { name: 'Disneyland Resort', where: 'Anaheim, California', status: 'open', tags: ['2 parks'],
        detail: "Disneyland and Disney California Adventure. Home to a planned Avengers Campus expansion and new resident/evening pricing programs to fill demand." },
    ] },
  { id: 'intl', name: 'International Parks', ic: '🌏', accent: DIS_BRAND2,
    tag: 'Paris, Asia & licensed Tokyo', region: 'Global',
    desc: "Owned resorts in Paris, consolidated parks in Hong Kong and Shanghai, and a licensed (royalty-only) resort in Tokyo. Asia was a soft spot in FY2026 as the Shanghai and Hong Kong consumer weakened.",
    items: [
      { name: 'Disneyland Paris', where: 'Marne-la-Vallée, France', status: 'open', tags: ['owned', 'expanding'],
        detail: "Opening World of Frozen and the reimagined Disney Adventure World (2026), nearly doubling the size of the second gate — a major near-term international driver." },
      { name: 'Shanghai Disney Resort', where: 'Shanghai, China', status: 'open', tags: ['43% owned', 'consolidated'],
        detail: "Added Zootopia Land, a strong attendance driver. Per-capita spending was pressured by a weaker Chinese consumer in FY2026." },
      { name: 'Hong Kong Disneyland', where: 'Hong Kong', status: 'open', tags: ['48% owned'],
        detail: "Consolidated international park; part of the softer Asia consumer picture in FY2026." },
      { name: 'Tokyo Disney Resort', where: 'Tokyo, Japan', status: 'open', tags: ['licensed', 'royalty income'],
        detail: "Owned and operated by Oriental Land Co.; Disney earns royalties and invests no capital — a capital-light, high-return model. A Disney-branded cruise ship with OLC is planned around 2029." },
    ] },
  { id: 'cruise', name: 'Cruise Fleet', ic: '🚢', accent: '#1E88C7',
    tag: '8 ships today → 13 by 2031', region: 'Global',
    desc: "The Disney Cruise Line is the fastest-growing capacity in the company — expanding roughly 40% as the fleet scales from 8 ships toward 13 by 2031. New ships open with pre-opening costs but ramp to strong returns.",
    items: [
      { name: 'Existing fleet (6 ships)', where: 'Magic, Wonder, Dream, Fantasy, Wish, Treasure', status: 'open', tags: ['operating'],
        detail: "The core fleet through FY2025. The Disney Treasure (2024) and Wish anchor the newer, larger class. Cruise demand and guest satisfaction remain the highest in the company." },
      { name: 'Disney Destiny', where: 'Homeported in Florida', status: 'launch', tags: ['first sail Nov 2025'],
        detail: "Launched November 2025 to strong reviews — the seventh ship." },
      { name: 'Disney Adventure', where: 'Homeported in Singapore', status: 'launch', tags: ['first sail Mar 2026', 'largest ever'],
        detail: "The largest Disney ship ever (~200,000 tons, ~7,000 passengers) and the first homeported in Asia — opening the Southeast Asia market. First sailings in March 2026." },
      { name: 'Four more ships (to 2031)', where: 'Various', status: 'planned', tags: ['CY2027–2031'],
        detail: "Four additional ships are contracted for delivery between 2027 and 2031, taking the fleet to 13 — plus a capital-light Disney-branded ship operated by Oriental Land Co. in Japan (~2029)." },
    ] },
  { id: 'streaming', name: 'Disney+ / Streaming', ic: '📱', accent: DIS_BRAND,
    tag: 'DTC — the margin story', region: 'Global',
    desc: "The direct-to-consumer platform: Disney+, Hulu and ESPN. Streaming (SVOD) operating margin climbed from ~5% to ~13% across FY2025–FY2026 — the single most important profitability inflection in the company.",
    items: [
      { name: 'Disney+', where: '~131.6M Core subscribers', status: 'open', tags: ['flagship', 'ARPU rising'],
        detail: "The flagship service. Being turned into a “digital centerpiece” — one app that also carries Hulu, ESPN, vertical video, and (from 2027) games and merchandise, all to cut churn and lift lifetime value." },
      { name: 'Hulu', where: '~64M subscribers', status: 'open', tags: ['100% owned', 'integrating'],
        detail: "Now fully owned and being merged into the Disney+ app. Bundled subscribers churn materially less — the core of the retention strategy." },
      { name: 'ESPN DTC', where: 'Launched Aug 2025', status: 'launch', tags: ['Trio bundle $29.99'],
        detail: "The full ESPN flagship app. ~80% of new ESPN subscribers took the Trio bundle (Disney+ + Hulu + ESPN). Heading into ESPN’s first Super Bowl." },
      { name: 'New surfaces', where: 'Sora, TikTok, AVOD', status: 'planned', tags: ['engagement', 'top-of-funnel'],
        detail: "Layering on an OpenAI/Sora character-licensing deal, a TikTok distribution deal, vertical video, and an explored free ad-supported tier — all top-of-funnel to grow and retain subscribers." },
    ] },
  { id: 'pipeline', name: 'Expansion Pipeline', ic: '🚧', accent: '#8A5CF0',
    tag: 'The ~$60B / 10-year plan', region: 'Global',
    desc: "A roughly $60B, decade-long Experiences investment cycle (management framing) plus capital-light international deals. This is where much of tomorrow’s Experiences growth is being built — new lands, ships and resorts.",
    items: [
      { name: 'Villains Land', where: 'Walt Disney World, Orlando', status: 'planned', tags: ['new land'],
        detail: "A new themed land announced for Walt Disney World — part of the multi-year domestic park expansion." },
      { name: 'Avengers Campus expansion', where: 'Disneyland, Anaheim', status: 'planned', tags: ['Marvel IP'],
        detail: "Expanding the Marvel-themed land at Disney California Adventure — monetizing the Marvel franchise inside the parks." },
      { name: 'Disney Adventure World', where: 'Disneyland Paris', status: 'launch', tags: ['2026', 'World of Frozen'],
        detail: "A reimagined second gate at Paris (incl. World of Frozen) opening in 2026, nearly doubling the park’s size." },
      { name: 'Tropical Americas', where: 'Animal Kingdom, Orlando', status: 'planned', tags: ['2027'],
        detail: "Replacing DinoLand with a new Tropical Americas area (Encanto, Indiana Jones), targeted for 2027." },
      { name: 'Abu Dhabi resort', where: 'Abu Dhabi, UAE', status: 'planned', tags: ['capital-light', 'with Miral'],
        detail: "A new Disney-branded park announced in 2025 with partner Miral — Disney licenses its IP and earns fees/royalties without providing development capital." },
    ] },
];

export var DIS_MAP_LEGEND = [
  ['open', 'Operating'],
  ['launch', 'Launching now / next year'],
  ['planned', 'Planned / future'],
];

// ─── Growth & margin drivers (where tomorrow's upside comes from) ────────────────
export var DIS_DRIVERS = [
  { ic: '📈', t: 'Streaming margin ramp', tag: 'Largest swing', d: "Entertainment SVOD margin went from ~5% to ~13% in six quarters and management wants it higher “in chunks, not basis points.” Every point of margin on ~$20B+ of streaming revenue is real profit — the biggest earnings lever.", pts: ['Bundling + one Disney+/Hulu app cuts churn', 'Price increases + ad tier lift ARPU', 'Content costs held roughly flat'] },
  { ic: '🎢', t: 'Experiences capex ROIC', tag: 'Funded growth', d: "The ~$60B/decade parks-and-cruise investment adds capacity (13 ships by 2031, new lands) at returns management says are rising over time — turning today’s capex into tomorrow’s Experiences operating income.", pts: ['Cruise capacity +~40% into 2031', 'New lands at WDW, Paris, Anaheim', 'Capital-light Abu Dhabi & Tokyo deals'] },
  { ic: '🏈', t: 'ESPN / Sports monetization', tag: 'Early innings', d: "ESPN’s DTC app, the NFL equity deal and the first ESPN Super Bowl start to monetize sports directly — a business earlier in its streaming transition than Entertainment, with room to improve as rights costs are absorbed.", pts: ['ESPN Unlimited + Trio bundle', 'NFL Network + 10% ESPN equity stake', 'Sub declines improving (-7% → -4%)'] },
  { ic: '💵', t: 'Capital return + EPS', tag: 'Compounding', d: "Adjusted EPS is guided to ~12% growth in FY2026 and double digits in FY2027, amplified by a buyback ramped from $3.5B to at least $9B and a dividend up 50% — funded partly by selling non-core assets (A+E).", pts: ['Buyback $3.5B → $7B → $8B → ≥$9B', 'Dividend +50% to $1.50/share', 'Non-core asset sales fund it'] },
];

// ─── The ~$60B / 10-year Experiences expansion plan (Sept 2023; detailed at D23 Aug 2024) ─
export var DIS_PLAN_FACTS = [
  ['Total investment', '~$60B'],
  ['Horizon', '~10 yrs · FY24–FY33'],
  ['vs prior decade', '~2× (~$30B → ~$60B)'],
  ['Capacity-expanding', '~70% of the plan'],
  ['Cruise fleet', '~5 → ~13 ships by 2031'],
  ['Unveiled at D23’24', '14 new attractions'],
];
export var DIS_PLAN_THESIS = "In September 2023 Disney said it would roughly double Experiences capital investment to about $60 billion over ten years, and at D23 (August 2024) it detailed where the money goes. Roughly 70% funds capacity-expanding projects — new lands, attractions and cruise ships — that add the physical inventory Disney can sell; the rest refreshes and modernizes what is already open. Experiences is the company’s largest profit pool, so this plan is the clearest line of sight into where growth comes from over the next decade.";
export var DIS_PLAN_ALLOC = [
  { k:'Theme Parks & Resorts',    pct:50, tag:'capacity', color:SEG_EXP },
  { k:'Cruise Line & other',      pct:20, tag:'capacity', color:'#1E88C7' },
  { k:'Technology & Maintenance', pct:30, tag:'sustain',  color:'#8A93A0' },
];
export var DIS_PLAN_ALLOC_NOTE = "Disney’s own split of the ~$60B (2024 investor/proxy framing): ~50% theme parks & resorts, ~20% cruise & other, ~30% technology & maintenance. Parks + cruise (~70%) is the capacity-expanding portion; ~30% sustains existing capacity.";
export var DIS_PLAN_CAPEX_NOTE = "Experiences-segment capital expenditures (Bloomberg model). The step-up from ~$3.7B (FY24) toward ~$8B+ is the plan ramping; the ~$60B target runs roughly FY2024–FY2033, so spend continues past the forecast window. Right axis tracks cumulative spend against the $60B target.";

export var DIS_PLAN_PILLARS = [
  { name:'Domestic Parks', ic:'🏰', tag:'the core · ~50%', color:SEG_EXP, items:[
    { name:'Magic Kingdom — Villains Land + Cars', where:'Walt Disney World, FL', when:'Cars construction 2025', detail:'Disney’s largest-ever Magic Kingdom expansion: a new Villains land (two attractions, dining, retail) plus a Cars-themed area beyond Big Thunder Mountain.' },
    { name:'Tropical Americas', where:'Animal Kingdom, WDW', when:'~2027', detail:'Replaces DinoLand with Encanto and Indiana Jones attractions — a full land reimagining.' },
    { name:'Monsters, Inc. Land', where:'Hollywood Studios, WDW', when:'Construction 2025+', detail:'A new land anchored by Disney’s first-ever suspended roller coaster.' },
    { name:'Avatar · Avengers · Coco', where:'Disneyland Resort, CA', when:'Multi-year', detail:'An Avatar land at California Adventure, an Avengers Campus expansion, and the first ride-through Coco attraction — part of 14 new attractions unveiled at D23 2024.' },
  ]},
  { name:'International Parks', ic:'🌏', tag:'expand + capital-light', color:DIS_BRAND2, items:[
    { name:'Disneyland Paris — Adventure World', where:'Paris (owned)', when:'World of Frozen 2026', detail:'A reimagined second gate (World of Frozen, Avengers Campus) that nearly doubles the park.' },
    { name:'Tokyo — Fantasy Springs', where:'Tokyo (licensed)', when:'Opened 2024', detail:'Frozen / Tangled / Peter Pan expansion at Tokyo DisneySea — Disney earns royalties with no capital (capital-light, high-return).' },
    { name:'Abu Dhabi resort', where:'Abu Dhabi, UAE', when:'Announced 2025', detail:'A 7th Disney resort destination built and operated by partner Miral; Disney licenses IP for fees — no Disney development capital.' },
    { name:'Shanghai & Hong Kong', where:'China', when:'Ongoing', detail:'Zootopia Land (Shanghai, open) and Spider-Man; continued build-out of the consolidated Asian parks.' },
  ]},
  { name:'Cruise Line', ic:'🚢', tag:'~20% · fastest capacity add', color:'#1E88C7', items:[
    { name:'Fleet: ~5 → ~13 ships', where:'Global', when:'through 2031', detail:'The biggest capacity add in the plan — the fleet roughly triples, with new homeports across Asia, Australia and Europe.' },
    { name:'Treasure · Destiny · Adventure', where:'Florida & Singapore', when:'2024–2026', detail:'Disney Treasure (2024), Disney Destiny (2025) and the largest-ever Disney Adventure (2026, homeported in Singapore — Disney’s first in Asia).' },
    { name:'Four more new ships', where:'Various', when:'2027–2031', detail:'Four additional ships announced at D23 2024, plus a capital-light Disney-branded ship operated by Oriental Land Co. in Japan (~2029).' },
  ]},
  { name:'Enhance & Technology', ic:'🛠️', tag:'~30% · sustain', color:'#8A93A0', items:[
    { name:'Refresh & maintenance', where:'All parks', when:'Continuous', detail:'Refurbishing rides, hotels and infrastructure to keep existing capacity fresh and reliable.' },
    { name:'Guest technology', where:'All parks', when:'Ongoing', detail:'Lightning Lane, the Disney app, MagicBand+ and virtual queue — spend that lifts throughput and per-guest monetization without adding land.' },
  ]},
];
// Flat project list for the interactive "What" explorer (filters · timeline · map).
// bucket: parks | cruise | tech (matches the ~50/20/30 allocation). lat/lng for the map;
// cruise/tech have no single point (shown off-map). year drives the timeline (0 = ongoing).
export var DIS_PROJ_BUCKETS = [
  { k:'parks',  l:'Parks & resorts', color:'#E3A73A' },
  { k:'cruise', l:'Cruise',          color:'#1E88C7' },
  { k:'tech',   l:'Tech & maint.',   color:'#8A93A0' },
];
export var DIS_PROJ_REGIONS = ['Americas','Europe','Middle East','Asia','At sea','Global'];
export var DIS_PROJECTS = [
  { name:'Villains Land + Cars', loc:'Magic Kingdom, Orlando', bucket:'parks', region:'Americas', franchise:'Villains · Cars', year:2027, when:'Cars construction 2025', lat:28.42, lng:-81.58,
    detail:'Disney’s largest-ever Magic Kingdom expansion — a Villains land (two attractions, dining, retail) plus a Cars area beyond Big Thunder Mountain.' },
  { name:'Tropical Americas', loc:'Animal Kingdom, Orlando', bucket:'parks', region:'Americas', franchise:'Encanto · Indiana Jones', year:2027, when:'~2027', lat:28.36, lng:-81.59,
    detail:'Replaces DinoLand with Encanto and Indiana Jones attractions — a full land reimagining.' },
  { name:'Monsters, Inc. Land', loc:'Hollywood Studios, Orlando', bucket:'parks', region:'Americas', franchise:'Monsters, Inc.', year:2027, when:'Construction 2025+', lat:28.355, lng:-81.56,
    detail:'A new land anchored by Disney’s first-ever suspended roller coaster.' },
  { name:'Avatar · Avengers · Coco', loc:'Disneyland Resort, Anaheim', bucket:'parks', region:'Americas', franchise:'Avatar · Marvel · Coco', year:2027, when:'Multi-year', lat:33.81, lng:-117.92,
    detail:'An Avatar land at California Adventure, an Avengers Campus expansion and the first ride-through Coco attraction — part of 14 new attractions unveiled at D23 2024.' },
  { name:'Disneyland Paris — Adventure World', loc:'Paris (owned)', bucket:'parks', region:'Europe', franchise:'Frozen · Marvel', year:2026, when:'World of Frozen 2026', lat:48.87, lng:2.78,
    detail:'A reimagined second gate (World of Frozen, Avengers Campus) that nearly doubles the park.' },
  { name:'Tokyo — Fantasy Springs', loc:'Tokyo (licensed)', bucket:'parks', region:'Asia', franchise:'Frozen · Tangled', year:2024, when:'Opened 2024', lat:35.63, lng:139.88,
    detail:'Frozen / Tangled / Peter Pan expansion at Tokyo DisneySea — Disney earns royalties with no capital (capital-light, high-return).' },
  { name:'Abu Dhabi resort', loc:'Abu Dhabi, UAE', bucket:'parks', region:'Middle East', franchise:'—', year:2030, when:'Announced 2025', lat:24.46, lng:54.37,
    detail:'A 7th Disney resort destination built and operated by partner Miral; Disney licenses IP for fees — no Disney development capital.' },
  { name:'Shanghai & Hong Kong', loc:'China', bucket:'parks', region:'Asia', franchise:'Zootopia · Spider-Man', year:2025, when:'Ongoing', lat:31.14, lng:121.66,
    detail:'Zootopia Land (Shanghai, open) and Spider-Man; continued build-out of the consolidated Asian parks.' },
  { name:'Cruise fleet: ~5 → ~13 ships', loc:'Global (at sea)', bucket:'cruise', region:'At sea', franchise:'—', year:2031, when:'through 2031',
    detail:'The fleet roughly triples — the biggest capacity add — with new homeports across Asia, Australia and Europe.' },
  { name:'Treasure · Destiny · Adventure', loc:'Florida & Singapore', bucket:'cruise', region:'At sea', franchise:'—', year:2025, when:'2024–2026',
    detail:'Disney Treasure (2024), Disney Destiny (2025) and the largest-ever Disney Adventure (2026, homeported in Singapore — Disney’s first in Asia).' },
  { name:'Four more new ships', loc:'Various', bucket:'cruise', region:'At sea', franchise:'—', year:2029, when:'2027–2031',
    detail:'Four additional ships announced at D23 2024, plus a capital-light Disney-branded ship operated by Oriental Land Co. in Japan (~2029).' },
  { name:'Refresh & maintenance', loc:'All parks', bucket:'tech', region:'Global', franchise:'—', year:0, when:'Continuous',
    detail:'Refurbishing rides, hotels and infrastructure to keep existing capacity fresh and reliable.' },
  { name:'Guest technology', loc:'All parks', bucket:'tech', region:'Global', franchise:'—', year:0, when:'Ongoing',
    detail:'Lightning Lane, the Disney app, MagicBand+ and virtual queue — lifts throughput and per-guest monetization without adding land.' },
];

export var DIS_PLAN_GROWTH = [
  { ic:'🎢', t:'New capacity → attendance & spend', d:'~70% of the plan adds sellable inventory (lands, ships, rooms). More capacity absorbs demand and lifts attendance and per-capita spending — the two levers of Experiences revenue.' },
  { ic:'📈', t:'ROIC-accretive, per management', d:'Disney frames the incremental spend as return-accretive, pointing to the prior decade (Galaxy’s Edge, Toy Story Land, Pandora) as capacity that drove growth. Returns on Experiences investment have risen over time.' },
  { ic:'🚢', t:'Cruise is the standout', d:'The fleet roughly triples — the fastest, highest-satisfaction capacity add, extending Disney into Asia-Pacific with new homeports.' },
  { ic:'🌍', t:'Capital-light international', d:'Abu Dhabi (Miral) and Tokyo (Oriental Land) grow the footprint on partners’ balance sheets — royalties and fees with little or no Disney capital.' },
];
export var DIS_PLAN_SOURCES = "Sources — The Walt Disney Company investor announcement (Sept 2023) and FY2024 proxy for the ~$60B / 10-year plan and its ~50/20/30 allocation; D23 2024 (Disney Experiences Showcase, Aug 2024) for the specific lands, attractions and cruise ships. Experiences capex is the Bloomberg model. Project dates are Disney framing and subject to change.";

// ─── What ▸ Cruise deep-dive — fleet, capacity & the economics of a cruise ───────
export var DIS_CRUISE_INTRO = "The ~$60B plan roughly triples the fleet to 13 ships by ~2031 — the highest-return corner of Experiences. Expand a section for detail.";
export var DIS_CRUISE_STATS = [
  ['8 → 13',      'Ships (today → 2031)'],
  ['~20k → ~33k', 'Lower berths (+~65%)'],
  ['~$3.0B',      'FY25 DCL revenue · +20% YoY'],
  ['~1.4×',       'Disney per-diem vs Royal Caribbean'],
];
// pax = double-occupancy (lower berths), the industry-standard figure; paxMax = max incl. upper berths. gt = gross tonnage.
export var DIS_CRUISE_FLEET = [
  { name:'Disney Magic',     year:1998, yr:'1998', status:'service', cls:'Magic',  pax:1754, paxMax:2700, gt:83969,  port:'Seasonal — Caribbean & Europe',    cost:350000000,  note:'The original DCL ship (1998). Sails seasonal Caribbean and Europe itineraries.' },
  { name:'Disney Wonder',    year:1999, yr:'1999', status:'service', cls:'Magic',  pax:1754, paxMax:2700, gt:84130,  port:'Seasonal — Pacific, Alaska & Australia', cost:350000000, note:'Sister to Magic; a roving seasonal deployment with no fixed year-round homeport.' },
  { name:'Disney Dream',     year:2011, yr:'2011', status:'service', cls:'Dream',  pax:2500, paxMax:4000, gt:129690, port:'Fort Lauderdale, FL',              cost:900000000,  note:'First of the larger Dream class (2011).' },
  { name:'Disney Fantasy',   year:2012, yr:'2012', status:'service', cls:'Dream',  pax:2500, paxMax:4000, gt:129690, port:'Port Canaveral, FL',               cost:900000000,  note:'Sister to Dream; Port Canaveral, FL.' },
  { name:'Disney Wish',      year:2022, yr:'2022', status:'service', cls:'Wish',   pax:2508, paxMax:4000, gt:144256, port:'Port Canaveral, FL',               cost:1100000000, note:'First Wish-class ship (2022) — the template for the current newbuild wave.' },
  { name:'Disney Treasure',  year:2024, yr:'2024', status:'service', cls:'Wish',   pax:2492, paxMax:4000, gt:144256, port:'Port Canaveral, FL',               cost:1100000000, note:'Second Wish-class; maiden voyage Dec 2024.' },
  { name:'Disney Destiny',   year:2025, yr:'2025', status:'service', cls:'Wish',   pax:2500, paxMax:4116, gt:144256, port:'Fort Lauderdale, FL',              cost:1100000000, note:'Third Wish-class; Heroes & Villains theme. Maiden voyage Nov 2025.' },
  { name:'Disney Adventure', year:2026, yr:'2026', status:'service', cls:'Global', pax:4222, paxMax:6700, gt:208108, port:'Singapore (Marina Bay)',           cost:1800000000, largest:true, note:'DCL’s largest ship and first based in Asia. Built on a repurposed Global-class hull (bought cheaply from the collapsed Dream Cruises) for ~$1.8B all-in. Maiden voyage Mar 2026.' },
  { name:'Disney Believe',   year:2027, yr:'2027', status:'order',   cls:'Wish',   pax:2500, paxMax:4000, gt:144256, port:'TBA',                               cost:1100000000, note:'Fifth Wish-class; an Encanto / Frozen / Moana “believe” theme. Named Mar 2026.' },
  { name:'Oriental Land Co. ship', year:2029, yr:'~2029', status:'order', cls:'Wish', pax:2500, paxMax:4000, gt:144256, port:'Tokyo, Japan (OLC-operated)', cost:null, capLight:true, note:'CAPITAL-LIGHT: owned and operated by Oriental Land Co. under a DCL license — not on Disney’s balance sheet. Short cruises from Tokyo Bay.' },
  { name:'New-class ships ×3', year:2031, yr:'2029–31', status:'order', cls:'New class', pax:null, paxMax:3000, gt:100000, port:'TBA', cost:1000000000, est:true, note:'A new, smaller class (~100k GT, ~3,000 max) — the final ships to reach the 13-ship fleet. Double-occupancy capacity not yet disclosed; timing may cluster in 2029.' },
];
export var DIS_CRUISE_FLEET_NOTE = "Capacity = double-occupancy (lower berths); ships hold ~40–60% more at max. On-order years are Disney framing and subject to change; new-class capacities are estimates. DCL is not broken out in filings — it sits inside Experiences.";
// Full-fleet projection — RCL's FY25 per-day economics applied to Disney's lower-berth capacity, today (8 ships) vs the full 13.
export var DIS_CRUISE_BUILD = {
  tiles: [
    ['~2031',   'All 13 ships sailing'],
    ['~33,000', 'Lower berths at full fleet'],
    ['+~$1.3B', 'Incremental net revenue / yr'],
    ['+~$0.4B', 'Incremental operating income / yr'],
  ],
  // kind: '' | rev | oi
  rows: [
    { l:'Ships',                       today:'8',        full:'13',      inc:'+5' },
    { l:'Lower berths',                today:'~20,200',  full:'~33,000', inc:'+~12,800' },
    { l:'Passenger-nights / yr (APCD)',today:'~7.4M',    full:'~12.0M',  inc:'+~4.6M' },
    { l:'Net revenue · $274/night',    today:'~$2.0B',   full:'~$3.3B',  inc:'+~$1.3B', kind:'rev' },
    { l:'Adj. EBITDA · 46%',           today:'~$0.9B',   full:'~$1.5B',  inc:'+~$0.6B' },
    { l:'Operating income · 32%',      today:'~$0.65B',  full:'~$1.05B', inc:'+~$0.4B', kind:'oi' },
  ],
};
export var DIS_CRUISE_BUILD_NOTE = "Illustrative. Applies Royal Caribbean’s FY25 per-day economics ($274 net revenue/APCD; 46% EBITDA, 32% operating margins) to Disney’s lower-berth capacity — “today” = 8 ships, “full fleet” = all 13 (~2031). Disney’s ~1.4× per-diem would lift the dollars; the OLC Japan ship is a capital-light royalty deal, and new-class capacities are estimated.";
// Industry benchmarks — the three public cruise operators, latest fiscal year (FY2025). Yields use each company's
// own denominator (APCD / ALBD / Capacity Day), all double-occupancy — directionally comparable, not identical.
export var DIS_CRUISE_ECON_LEAD = "Ships sail >100% full, guests pay months ahead (interest-free float), and high-margin onboard spend layers onto the ticket — record EBITDA margins (27–39%) and mid-to-high-teens returns. Disney sits at the premium end.";
export var DIS_CRUISE_ECON = [
  { co:'Royal Caribbean', ticker:'RCL',  rev:'$17.9B', oi:'$4.9B', opm:'27.4%', ebitda:'39.1%', yield:'$274', occ:'109.7%', onboard:'30%', deposits:'$5.7B', roic:'18.0%' },
  { co:'Carnival',        ticker:'CCL',  rev:'$26.6B', oi:'$4.5B', opm:'16.9%', ebitda:'27.1%', yield:'$208', occ:'105%',   onboard:'35%', deposits:'$7.2B', roic:'>13%' },
  { co:'Norwegian',       ticker:'NCLH', rev:'$9.8B',  oi:'$1.6B', opm:'15.9%', ebitda:'27.9%', yield:'$301', occ:'103.5%', onboard:'32%', deposits:'$3.2B', roic:'n/d' },
];
export var DIS_CRUISE_ECON_NOTE = "FY2025 filings. Op. income/margin are GAAP; EBITDA margin is adjusted EBITDA / revenue. Net yield = net revenue per available passenger-day (RCL/CCL/NCLH use slightly different denominators). NCLH ROIC not disclosed. DCL is not public — shown for context.";
// Single-ship unit economics — RCL's FY2025 fleet-wide per-day metrics scaled onto one ~2,500-berth ship over a year.
export var DIS_CRUISE_SHIP_LEAD = "RCL’s FY25 per-day economics scaled onto one ~2,500-berth ship (Disney’s Wish/Dream size; RCL’s Radiance-class analog) over a year:";
export var DIS_CRUISE_SHIP = {
  tiles: [
    ['~$250M', 'Net revenue / yr'],
    ['~$115M', 'Adj. EBITDA / yr'],
    ['~$80M',  'Operating income / yr'],
    ['~9 yrs', 'Cash payback on the ship'],
  ],
  // kind: base | flow | sub (EBITDA) | oi (operating income)
  lines: [
    { l:'Available passenger-nights (APCD = 2,500 berths × 365 days)', night:'—',    year:'912,500', kind:'base' },
    { l:'Net revenue (net yield × APCD)',            night:'$274',  year:'$250M',  kind:'flow' },
    { l:'– Operating cost, ex-fuel',                 night:'–$128', year:'–$117M', kind:'flow' },
    { l:'– Fuel',                                    night:'–$20',  year:'–$18M',  kind:'flow' },
    { l:'= Adjusted EBITDA',                         night:'$126',  year:'~$115M', kind:'sub' },
    { l:'– Depreciation (~$1.05B ship ÷ 30-yr life)', night:'–$38', year:'–$35M',  kind:'flow' },
    { l:'= Operating income',                        night:'~$88',  year:'~$80M',  kind:'oi' },
  ],
};
export var DIS_CRUISE_SHIP_NOTE = "Illustrative, not a per-ship disclosure. RCL FY25 metrics ($274 net yield/APCD, ~$128 cost ex-fuel, ~$20 fuel, ~110% occupancy) on a 2,500-berth ship × 365 days; depreciation = ~$1.05B ship ÷ 30 yrs. ~$115M EBITDA on a ~$1.05B ship ≈ ~9-yr cash payback; Disney’s ~1.4× per-diem clears these.";

// ─── What ▸ Parks & resorts deep-dive — footprint (m²), and revenue per square meter ─
export var DIS_PARKS_INTRO = "Disney’s parks run essentially full on peak days, so growth needs new capacity. How much developed area exists, what it earns per m², and the revenue potential of Disney’s land bank:";
// acres = developed guest-facing footprint (approximate; Disney doesn’t disclose official figures). status: owned | licensed.
export var DIS_PARKS_FOOTPRINT = [
  { park:'Animal Kingdom',        resort:'Walt Disney World',       acres:580, sqm:2347000, status:'owned',    note:'Largest single Disney park; much is animal habitat (low guests-per-acre by design).' },
  { park:'EPCOT',                 resort:'Walt Disney World',       acres:305, sqm:1234000, status:'owned' },
  { park:'Shanghai Disneyland',   resort:'Shanghai',                acres:225, sqm:910000,  status:'owned',    note:'JV — Disney 43%, consolidated; range 225–310 acres by source.' },
  { park:'Disneyland Park',       resort:'Disneyland Paris',        acres:140, sqm:567000,  status:'owned',    note:'Disney owns ~85% of the resort.' },
  { park:'Hollywood Studios',     resort:'Walt Disney World',       acres:135, sqm:546000,  status:'owned' },
  { park:'Magic Kingdom',         resort:'Walt Disney World',       acres:107, sqm:433000,  status:'owned',    note:'Highest intensity — ~17.8M visitors on ~107 acres.' },
  { park:'Disneyland',            resort:'Disneyland Resort (CA)',  acres:85,  sqm:344000,  status:'owned' },
  { park:'California Adventure',  resort:'Disneyland Resort (CA)',  acres:72,  sqm:291000,  status:'owned' },
  { park:'Hong Kong Disneyland',  resort:'Hong Kong',               acres:68,  sqm:275000,  status:'owned',    note:'JV — Disney 47%, consolidated.' },
  { park:'Disney Adventure World',resort:'Disneyland Paris',        acres:67,  sqm:271000,  status:'owned',    note:'The former Walt Disney Studios Park — being ~doubled by a €2B rebuild.' },
  { park:'Tokyo DisneySea',       resort:'Tokyo Disney Resort',     acres:176, sqm:712000,  status:'licensed', note:'Licensed to Oriental Land Co. — Disney earns royalties, not park revenue.' },
  { park:'Tokyo Disneyland',      resort:'Tokyo Disney Resort',     acres:126, sqm:510000,  status:'licensed', note:'Licensed to Oriental Land Co. — royalties only.' },
];
export var DIS_PARKS_FOOTPRINT_NOTE = "Developed guest-facing acreage (approximate — Disney doesn’t publish official footprints; figures vary by source). Tokyo is licensed to Oriental Land Co. (Disney earns royalties, not park revenue) — excluded from the revenue model below. Shanghai (43%) and Hong Kong (47%) are majority-partner JVs that Disney consolidates.";
// Land-bank revenue projection: today's developed area vs a full build-out of Disney's ~1,000-acre land bank, at today's revenue/area.
export var DIS_PARKS_BUILD_LEAD = "The $60B plan’s disclosed <b>new</b> area is small (~85 acres — it mostly <b>densifies</b> existing parks with new attractions & throughput); the real headroom is Disney’s <b>~1,000-acre land bank</b> (“~7 new Disneylands”). At today’s revenue per acre:";
export var DIS_PARKS_BUILD = {
  tiles: [
    ['~$15M',     'Revenue per developed acre / yr'],
    ['~1,000 ac', 'Developable land bank (~7 Disneylands)'],
    ['+~$15B',    'Incremental revenue potential / yr'],
    ['+~$3.8B',   'Incremental operating income / yr'],
  ],
  // kind: '' | rev | oi
  rows: [
    { l:'Developed park area (acres)', today:'~1,784',  full:'~2,784',  inc:'+~1,000' },
    { l:'Developed park area (m²)',    today:'~7.2M',   full:'~11.3M',  inc:'+~4.0M' },
    { l:'Revenue per m² (held flat)',  today:'~$3,800', full:'~$3,800', inc:'—' },
    { l:'Parks & resorts revenue',     today:'~$27B',   full:'~$42B',   inc:'+~$15B', kind:'rev' },
    { l:'Operating income · ~25%',     today:'~$6.8B',  full:'~$10.6B', inc:'+~$3.8B', kind:'oi' },
  ],
};
export var DIS_PARKS_BUILD_NOTE = "Illustrative and long-run — a rough upper bound, not a forecast. “Today” = ~1,784 developed acres across Disney’s 10 owned parks (Tokyo excluded — licensed). Revenue = FY25 parks & resorts (Domestic + International Parks & Experiences, ex-Consumer Products and ex-Disney Cruise Line ≈ $27B); ~$15M/acre blends gate, in-park spend and on-property hotels over park-gate area. “Full build-out” develops Disney’s stated ~1,000-acre land bank — a multi-decade ceiling, not the $60B/10-yr plan alone; new parks ramp over years, and much of the near-term $60B lift comes from densification (throughput + per-capita spend), which this area model doesn’t capture.";
// Alternative lens: incremental person-capacity × in-park ARPU (the more natural driver for parks).
export var DIS_PARKS_CAP_LEAD = "The parks run full on peak days, so new land lifts the ceiling on <b>visits</b> (Magic Kingdom’s new Villains + Cars land alone adds capacity for ~9,000 guests at once). At today’s <b>~64,500 visits per developed acre</b> and <b>~$165 of in-park spend per visit</b>:";
export var DIS_PARKS_CAP = {
  tiles: [
    ['~$165',    'In-park spend per visit (ARPU)'],
    ['~115M',    'Annual visits today (owned parks)'],
    ['+~65M',    'Incremental annual visits (full build-out)'],
    ['+~$10.5B', 'Incremental in-park revenue / yr'],
  ],
  rows: [
    { l:'Annual attendance (visits)', today:'~115M',  full:'~180M',  inc:'+~65M' },
    { l:'Visits per developed acre',  today:'~64,500',full:'~64,500',inc:'—' },
    { l:'In-park ARPU / visit',       today:'~$165',  full:'~$165',  inc:'—' },
    { l:'In-park revenue',            today:'~$19B',  full:'~$29B',  inc:'+~$10.5B', kind:'rev' },
    { l:'Operating income · ~25%',    today:'~$4.8B', full:'~$7.3B', inc:'+~$2.6B',  kind:'oi' },
  ],
};
export var DIS_PARKS_CAP_NOTE = "Illustrative. Owned-park attendance ~115M/yr (2024 TEA estimate; excludes Tokyo — licensed). Visits-per-acre (~64,500) is a blended average — Magic Kingdom runs ~166,000/acre, Animal Kingdom far less — so new capacity ramps toward this only over years. In-park ARPU (~$165 blended; domestic ~$185, international lower) = ticket + food, beverage & merch in parks ÷ attendance; Disney discloses only the % change, so the $ level is an estimate. This lens counts in-park spend only — add on-property hotels and you approach the ~$15B of the revenue-per-m² view. Both exclude cruise.";

// ─── Top Line ▸ Full Buildout — an interactive sensitivity model tying every initiative together ─
export var DIS_BUILDOUT_INTRO = "One model for the whole build-out. The two segments we modelled in depth — Parks & Resorts and Disney Cruise Line — carry their Bottom Line deep-dive figures (fixed). The rest — Studio, DTC and ESPN — you can flex with the sliders. Depreciation from the ~$60B of new capex is the drag. Everything updates live.";
export var DIS_BUILDOUT_INPUTS = [
  { key:'films',      label:'Studio — theatrical films / yr',         min:6,   max:14,  step:1,    val:10,  unit:'' },
  { key:'avgGross',   label:'Studio — avg worldwide box office',      min:300, max:900, step:25,   val:525, unit:'M', fmt:'$' },
  { key:'dtcPrice',   label:'DTC — monthly subscription increase',    min:0,   max:5,   step:0.5,  val:2,   unit:'/mo', fmt:'$' },
  { key:'dtcSubs',    label:'DTC — subscriber increase',              min:0,   max:120, step:5,    val:50,  unit:'M' },
  { key:'espnSubs',   label:'ESPN — flagship app subscribers',        min:0,   max:40,  step:5,    val:15,  unit:'M' },
  { key:'life',       label:'Depreciation — avg useful life',         min:15,  max:40,  step:1,    val:25,  unit:' yr' },
  { key:'mult',       label:'Valuation — value / operating income',   min:8,   max:20,  step:1,    val:15,  unit:'×' },
];
// Fixed deep-dive results (parks, cruise) + assumptions the sliders act on. All $ in billions unless noted.
export var DIS_BUILDOUT_BASE = {
  parksRev:15,  parksOI:3.8,          // FIXED — from Parks ▸ Revenue per m² (full land bank): +$15B rev, +$3.8B OI
  cruiseRev:1.3, cruiseOI:0.4,        // FIXED — from Cruise ▸ Build-out to 13 ships: +$1.3B net rev, +$0.4B OI
  studioTake:0.35, studioMargin:0.30, // studio: rev = films × avg gross × studio take; ~30% margin
  dtcBaseSubs:126, dtcArpu:8,         // DTC: 126M Disney+ Core subs, ~$8/mo ARPU
  dtcPriceMargin:0.85, dtcSubMargin:0.30, // price rises ~pure margin; new subs at incremental margin
  espnArpu:20, espnMargin:0.20,       // ESPN flagship ~$20/mo net ARPU, ~20% margin
  capex:60, taxRate:0.25, shares:1.8, // ~$60B capex; 25% tax; ~1.8B shares
};
export var DIS_BUILDOUT_NOTE = "Illustrative sensitivity model — not a forecast. Parks & Resorts (+$15B rev / +$3.8B OI at the full land bank) and Disney Cruise Line (+$1.3B rev / +$0.4B OI at 13 ships) are fixed at the figures from their Bottom Line deep-dives. Studio, DTC and ESPN are slider-driven bases: Disney+ ~126M subs at ~$8 ARPU; studio rev = films × avg gross × ~35% studio take; ESPN app at ~$20/mo. Segments overlap via the content flywheel — a film also feeds streaming and the parks — so the total is directional, not strictly additive. ~$60B capex depreciated over the chosen life; implied value = incremental operating income × the chosen multiple; EPS after ~25% tax over ~1.8B shares.";

// ─── Returns & depreciation — how the park/cruise investments earn and depreciate ────
export var DIS_RET_THESIS = "Park and cruise assets are long-lived — 20 to 40 years, cruise ships ~30 — so the ~$60B is depreciated slowly. That shapes a J-curve: cash goes out first, then pre-opening costs and fresh depreciation drag near-term operating income, then years of run-rate revenue against a slowly-depreciating base drive the return. Reading the timing of that curve is the key to Experiences margins.";
export var DIS_USEFUL_LIVES = [
  { ic:'🚢', asset:'Cruise ships',                        life:'~30–35 yrs', note:'Industry convention, net of ~10–15% residual value. Disney reports ships inside PP&E, not as a separate line.' },
  { ic:'🏰', asset:'Attractions, buildings & improvements', life:'20–40 yrs', note:'Rides, show buildings, hotels — the bulk of park capex.' },
  { ic:'🌳', asset:'Land improvements',                   life:'20–40 yrs', note:'Infrastructure, roads, landscaping, utilities.' },
  { ic:'🎠', asset:'Furniture, fixtures & equipment',     life:'3–25 yrs',  note:'Ride vehicles, kitchens, hardware, décor.' },
  { ic:'💻', asset:'Technology & software',               life:'2–10 yrs',  note:'The Disney app, Lightning Lane, MagicBand+ systems.' },
];
export var DIS_LIVES_NOTE = "Straight-line depreciation over these estimated useful lives (Disney 10-K PP&E note). Cruise-ship life follows cruise-industry convention (~30–35 yrs, net of residual) since Disney reports ships within PP&E rather than as a separate line.";
export var DIS_DEPR_MATH = "Depreciation math: ~$60B spread over a ~25–30-year blended life adds roughly <b>$2B+ of incremental annual D&A</b> once fully deployed — on top of today’s ~$2.8B of Experiences D&A. That is why D&A climbs through the decade; the bet is that new-capacity revenue grows faster than the depreciation it creates.";
export var DIS_RET_PHASES = [
  { ph:'1 · Build',          yrs:'2–5 yrs',      drag:true,  d:'Capex is spent and sits in “projects in progress” — cash out, but no revenue and no depreciation yet.' },
  { ph:'2 · Pre-open',       yrs:'months',        drag:true,  d:'Hiring, training and marketing hit the P&L just before opening — a near-term drag on operating income.' },
  { ph:'3 · Open & ramp',    yrs:'1–3 yrs',       drag:false, d:'The asset opens, depreciation begins, and revenue ramps as attendance builds toward run-rate.' },
  { ph:'4 · Mature returns', yrs:'the long tail', drag:false, d:'Full run-rate revenue against a slowly-depreciating asset (20–40 yr life) — the years the investment pays back and compounds.' },
  { ph:'5 · Refresh',        yrs:'periodic',      drag:true,  d:'Maintenance capex and re-theming keep it fresh and extend its life — a smaller, recurring reinvestment.' },
];
export var DIS_RET_CHART_NOTE = "Experiences-segment capex (bars), depreciation & amortization and operating income (lines), FY2022–FY2028E (Bloomberg model). The read: capex steps up, D&A follows with a lag and climbs only gradually (long asset lives), while operating income grows faster — the gap between OI and D&A growth is the return on the investment showing up.";

// ─── Simple depreciation calculator — what the $60B adds to annual D&A ───────────
export var DIS_DEPR_CALC = {
  total: 60,        // $B invested
  currentDA: 2.8,   // ~today's Experiences D&A ($B)
  buckets: [
    { k:'Theme parks, resorts & attractions', pct:50, life:30, range:'20–40', color:'#E3A73A' },
    { k:'Cruise ships & other',               pct:20, life:32, range:'30–35', color:'#1E88C7' },
    { k:'Technology & maintenance',           pct:30, life:15, range:'2–40 blend', color:'#8A93A0' },
  ],
  caveat: "A simple, illustrative estimate: each bucket’s spend ÷ its useful life = the straight-line depreciation it adds once open. Edit the useful-life numbers to flex it. Caveat: maintenance capex partly replaces assets already being depreciated, so the true net increase to D&A is somewhat lower than the gross figure — and spend is phased over the decade, so the run-rate builds gradually.",
};

// ─── Disney+ / streaming overview (subs, economics, slate, strategy) ─────────────
export var DIS_DPLUS_KPIS = [
  ['~131.6M', 'Disney+ Core subs · FY25'],
  ['$7.81', 'Disney+ ARPU / month'],
  ['~64M', 'Hulu subscribers'],
  ['~$2.8B', 'Streaming op. income · FY26E'],
  ['~13%', 'SVOD margin · Q3’26'],
];
export var DIS_DPLUS_STUDIOS = [
  { k:'Marvel',    color:'#E0463C' },
  { k:'Star Wars', color:'#1D3FB8' },
  { k:'Pixar',     color:'#E3A73A' },
  { k:'Disney',    color:'#6B5AE0' },
];
export var DIS_DPLUS_SLATE = [
  { title:'VisionQuest',                     studio:'Marvel',    type:'Series', date:'Oct 2026',   why:'Concludes the WandaVision trilogy.' },
  { title:'Avengers: Doomsday',              studio:'Marvel',    type:'Film',   date:'Dec 2026',   why:'MCU Multiverse Saga tentpole — a major streaming tune-in after theaters.' },
  { title:'Star Wars Visions: The Ninth Jedi', studio:'Star Wars', type:'Series', date:'2026',      why:'Anime-style Star Wars anthology.' },
  { title:'Wonder Man',                      studio:'Marvel',    type:'Series', date:'2026',       why:'Introduces a new MCU hero.' },
  { title:'Gatto',                           studio:'Pixar',     type:'Film',   date:'Mar 2027',   why:'Original Pixar from Luca’s director.' },
  { title:'Ahsoka — Season 2',               studio:'Star Wars', type:'Series', date:'Early 2027', why:'The Mandoverse flagship returns.' },
  { title:'Star Wars: Starfighter',          studio:'Star Wars', type:'Film',   date:'May 2027',   why:'First new Star Wars film in years (Ryan Gosling).' },
  { title:'Daredevil: Born Again — S3',      studio:'Marvel',    type:'Series', date:'2027',       why:'Fan-favorite; strong retention driver.' },
  { title:'Frozen 3',                        studio:'Disney',    type:'Film',   date:'Nov 2027',   why:'Disney+’s biggest kids franchise.' },
  { title:'Avengers: Secret Wars',           studio:'Marvel',    type:'Film',   date:'Dec 2027',   why:'Caps the Multiverse Saga.' },
];
export var DIS_DPLUS_STRATEGY = [
  { t:'One app, one bundle', d:'Disney+, Hulu and ESPN in a single app — bundled subscribers churn far less.' },
  { t:'ARPU over adds',      d:'Price rises and the ad-supported tier lift revenue per user faster than raw sub growth.' },
  { t:'Paid sharing',        d:'The password-sharing crackdown converts freeloaders into paying accounts.' },
  { t:'Content flywheel',    d:'Theatrical tentpoles (Marvel, Star Wars, Pixar) drive sign-ups; the deep library retains.' },
];
export var DIS_DPLUS_NOTE = "Subscribers & ARPU are the Bloomberg model; streaming P&L is the combined DTC (Disney+/Hulu) segment. Release dates are studio-announced and subject to change.";
export var DIS_MOVIES_INTRO = "The studio slate — theatrical films (Disney, Pixar, Marvel, Lucasfilm) that drive box office, then feed Disney+ and the parks. Filter by studio.";
// Past theatrical releases FY2021–2025 (four core studios). `ww` = lifetime worldwide box office (USD, Box Office Mojo);
// `budget` = reported/estimated production budget (marketing excluded). Excludes Luca & Turning Red (Disney+ releases, no wide theatrical run).
export var DIS_MOVIES_PAST = [
  { title:'The Fantastic Four: First Steps', studio:'Marvel',    date:'Jul 2025', ww:522000000,  budget:200000000 },
  { title:'Elio',                            studio:'Pixar',     date:'Jun 2025', ww:154000000,  budget:150000000 },
  { title:'Lilo & Stitch',                   studio:'Disney',    date:'May 2025', ww:1038000000, budget:100000000 },
  { title:'Thunderbolts*',                   studio:'Marvel',    date:'May 2025', ww:382000000,  budget:180000000 },
  { title:'Snow White',                      studio:'Disney',    date:'Mar 2025', ww:206000000,  budget:270000000 },
  { title:'Captain America: Brave New World',studio:'Marvel',    date:'Feb 2025', ww:415000000,  budget:180000000 },
  { title:'Mufasa: The Lion King',           studio:'Disney',    date:'Dec 2024', ww:720000000,  budget:200000000 },
  { title:'Moana 2',                         studio:'Disney',    date:'Nov 2024', ww:1059000000, budget:150000000 },
  { title:'Deadpool & Wolverine',            studio:'Marvel',    date:'Jul 2024', ww:1338000000, budget:200000000 },
  { title:'Inside Out 2',                    studio:'Pixar',     date:'Jun 2024', ww:1699000000, budget:200000000 },
  { title:'Wish',                            studio:'Disney',    date:'Nov 2023', ww:255000000,  budget:200000000 },
  { title:'The Marvels',                     studio:'Marvel',    date:'Nov 2023', ww:206000000,  budget:270000000 },
  { title:'Haunted Mansion',                 studio:'Disney',    date:'Jul 2023', ww:118000000,  budget:150000000 },
  { title:'Indiana Jones and the Dial of Destiny', studio:'Star Wars', date:'Jun 2023', ww:384000000, budget:295000000 },
  { title:'Elemental',                       studio:'Pixar',     date:'Jun 2023', ww:496000000,  budget:200000000 },
  { title:'The Little Mermaid',              studio:'Disney',    date:'May 2023', ww:570000000,  budget:250000000 },
  { title:'Guardians of the Galaxy Vol. 3',  studio:'Marvel',    date:'May 2023', ww:846000000,  budget:250000000 },
  { title:'Ant-Man and the Wasp: Quantumania', studio:'Marvel',  date:'Feb 2023', ww:476000000,  budget:200000000 },
  { title:'Strange World',                   studio:'Disney',    date:'Nov 2022', ww:74000000,   budget:180000000 },
  { title:'Black Panther: Wakanda Forever',  studio:'Marvel',    date:'Nov 2022', ww:859000000,  budget:250000000 },
  { title:'Thor: Love and Thunder',          studio:'Marvel',    date:'Jul 2022', ww:761000000,  budget:250000000 },
  { title:'Lightyear',                       studio:'Pixar',     date:'Jun 2022', ww:226000000,  budget:200000000 },
  { title:'Doctor Strange in the Multiverse of Madness', studio:'Marvel', date:'May 2022', ww:956000000, budget:200000000 },
  { title:'Encanto',                         studio:'Disney',    date:'Nov 2021', ww:256000000,  budget:150000000 },
  { title:'Eternals',                        studio:'Marvel',    date:'Nov 2021', ww:402000000,  budget:200000000 },
  { title:'Shang-Chi and the Legend of the Ten Rings', studio:'Marvel', date:'Sep 2021', ww:432000000, budget:200000000 },
  { title:'Jungle Cruise',                   studio:'Disney',    date:'Jul 2021', ww:221000000,  budget:200000000 },
  { title:'Black Widow',                     studio:'Marvel',    date:'Jul 2021', ww:380000000,  budget:200000000 },
  { title:'Cruella',                         studio:'Disney',    date:'May 2021', ww:234000000,  budget:200000000 },
  { title:'Raya and the Last Dragon',        studio:'Disney',    date:'Mar 2021', ww:130000000,  budget:100000000 },
];
export var DIS_MOVIES_PAST_NOTE = "Lifetime worldwide box office (Box Office Mojo). The average recomputes with the studio filter. Excludes Luca and Turning Red (released to Disney+ with no wide theatrical run). Budgets exclude marketing.";
export var DIS_LINEAR_INTRO = "ABC and the cable networks (FX, National Geographic, Disney Channel) — the legacy TV business inside Entertainment, in managed decline as viewing shifts to streaming.";
export var DIS_LINEAR_POINTS = [
  { t:'The trend',      d:'Cord-cutting shrinks affiliate fees and TV advertising; Entertainment’s linear revenue falls ~10%+ a year.' },
  { t:'Still a cash cow', d:'Profitable and cash-generative — it helps fund the streaming transition even as it shrinks.' },
  { t:'The strategy',   d:'Manage the decline: cut costs, sell non-core assets (the A+E stake), and move content and spend to Disney+/Hulu.' },
];
export var DIS_LINEAR_CHART_NOTE = "Entertainment advertising revenue (Bloomberg model) — a proxy for the linear-TV trend: down from ~$8.7B (FY22) as audiences move to streaming.";

// ─── Sports (ESPN) — rights portfolio, the NFL deal, and the DTC pivot ───────────
// NOTE: figures reconciled to public reporting (league PRs, Reuters, Sportico, The Athletic) as of early 2026.
export var DIS_ESPN_INTRO = "ESPN is Disney’s Sports segment — the highest-margin, highest-affiliate-fee network in cable, now pivoting to direct-to-consumer. Its moat is live rights: multi-year, multi-billion-dollar deals with the NFL, NBA, college football and more. This is the portfolio — what ESPN owns, what it just won, and what it let walk.";
export var DIS_ESPN_KPIS = [
  ['$29.99/mo',  'ESPN flagship app · launched Aug 2025'],
  ['$17.7B',     'FY25 Sports segment revenue'],
  ['$2.9B',      'FY25 Sports operating income'],
  ['~19%',       'of Disney total revenue'],
  ['~$10.8B',    'FY26 sports-rights spend'],
  ['~66M',       'US pay-TV homes (peak ~100M in 2011)'],
];
// The NFL deal has two parts: (1) an asset-for-equity swap, (2) the existing 2023–33 media-rights deal.
export var DIS_ESPN_NFL = {
  equityPct: 10,
  impliedEv: "~$30B",
  espnGets: [
    { t:'NFL Network', d:'The 24/7 cable channel — owned & operated by ESPN, with its 7 live regular-season games (4 shifting off ESPN’s own slate).' },
    { t:'NFL RedZone (linear)', d:'The linear-TV distribution rights + the RedZone brand. Note: the NFL keeps operating, producing and streaming it.' },
    { t:'NFL Fantasy', d:'Merged into ESPN Fantasy — which becomes the official fantasy game of the NFL, feeding first-party fan data.' },
  ],
  nflGets: [
    { t:'~10% of ESPN', d:'A stake valued at ~$3B in an SEC filing at close — implying a ~$30B value for the newly independent ESPN.' },
  ],
  media: {
    annual: 2700000000, start: 2023, end: 2033, optOut: 2030,
    covers: [
      { t:'Monday Night Football', d:'The full 17-game MNF package (~10 simulcast on ABC), plus flex / simulcast windows.' },
      { t:'Two Super Bowls', d:'ABC/ESPN joins the rotation for the first time — Super Bowl LXI (Feb 2027) and LXV (2031).' },
      { t:'Playoffs & the Draft', d:'A wild-card playoff game each January, plus the Pro Bowl and the NFL Draft.' },
    ],
  },
  note: "Announced Aug 2025 and closed Jan 31, 2026 after DOJ and antitrust clearance. The stake makes the NFL a part-owner of ESPN just as ESPN goes direct-to-consumer — the league’s incentive flips from squeezing rights fees to growing the app (and ESPN’s MNF deal is protected from the NFL’s opt-out until after 2030, a year longer than other partners). The NFL keeps NFL Films, NFL+, NFL.com and the club sites out of the deal.",
};
// Rights portfolio for the Gantt timeline. `annual` = ESPN’s approx. annual fee (USD). status: held | new | losing.
// `renew` = true if the current deal expires within ~3 years (a near-term renewal decision).
export var DIS_ESPN_RIGHTS = [
  { league:'NFL',            annual:2700000000, start:2023, end:2033, status:'held',   emoji:'🏈', note:'Monday Night Football + ESPN’s first two Super Bowls (2027, 2031). NFL opt-out not until after 2030.' },
  { league:'NBA',            annual:2600000000, start:2025, end:2036, status:'new',    emoji:'🏀', note:'New 11-year deal (Disney’s fee up ~85%). ABC keeps the NBA Finals; NBC & Amazon join, TNT is out.' },
  { league:'College Football Playoff', annual:1300000000, start:2026, end:2032, status:'new', emoji:'🏆', note:'6-yr, $7.8B deal for the expanded 12-team CFP — the national title game moves to ABC in 2026.' },
  { league:'SEC',            annual:800000000,  start:2024, end:2034, status:'held',   emoji:'🐘', note:'Fully exclusive from 2024 (top package moved from CBS to ABC); includes the SEC Network.' },
  { league:'Big 12',         annual:230000000,  start:2025, end:2031, status:'held',   emoji:'🤠', note:'ESPN’s share of a six-year, $2.28B package split with Fox — ESPN holds the top football pick.' },
  { league:'ACC',            annual:240000000,  start:2016, end:2036, status:'held',   emoji:'🎓', note:'ESPN exercised its option (Jan 2025) to run the ACC Network + tier-1 rights through 2035-36.' },
  { league:'MLB',            annual:550000000,  start:2026, end:2028, status:'new',    emoji:'⚾', renew:true, note:'Reworked after both sides opted out: ESPN gains MLB.TV distribution + local streaming, but loses the postseason & Home Run Derby.' },
  { league:'NHL',            annual:400000000,  start:2021, end:2028, status:'held',   emoji:'🏒', renew:true, note:'Seven-year deal; expires after 2027-28. ~25 games on ABC/ESPN + 4 of 7 Stanley Cup Finals — a near-term renewal.' },
  { league:'Tennis Slams',   annual:250000000,  start:2015, end:2037, status:'held',   emoji:'🎾', note:'Exclusive US homes: US Open (through 2037), Wimbledon (2035) & Australian Open (2031). French Open is not ESPN.' },
  { league:'WNBA',           annual:200000000,  start:2026, end:2036, status:'new',    emoji:'⛹️', note:'Part of the new NBA-linked deal — ABC/ESPN is lead partner in the league’s fastest-growing era.' },
  { league:'LaLiga',         annual:175000000,  start:2021, end:2029, status:'held',   emoji:'⚽', note:'Exclusive US home of Spain’s top soccer league (all 380 matches) on ESPN+ — a key ESPN+ driver.' },
  { league:'Golf',           annual:100000000,  start:2020, end:2030, status:'held',   emoji:'⛳', note:'The Masters early rounds, the PGA Championship (cable) and PGA Tour Live on ESPN+.' },
  { league:'UFC',            annual:500000000,  start:2019, end:2025, status:'losing', emoji:'🥊', renew:true, note:'LOST to Paramount+ — a 7-year, $7.7B (~$1.1B/yr) deal takes UFC off ESPN from 2026. ESPN declined to match.' },
  { league:'Formula 1',      annual:85000000,   start:2018, end:2025, status:'losing', emoji:'🏎️', renew:true, note:'LOST to Apple — Apple TV takes US F1 rights from 2026 (reported >$140M/yr). ESPN declined to match.' },
];
export var DIS_ESPN_RIGHTS_NOTE = "Bars span each current deal’s first-to-last season; the dotted line marks today (2026). Annual fees are ESPN’s approximate share per public reporting — Disney does not disclose per-league figures, and several (ACC, Big 12, tennis) are estimates. “Renews soon” flags deals expiring within ~3 years.";
export var DIS_ESPN_INSIGHTS = [
  { ic:'📱', t:'The flagship gamble', d:'The standalone ESPN app finally lets cord-cutters buy ESPN without a cable bundle — $29.99/mo unlimited, $11.99 for the ESPN Select tier, or ~$36 in a Disney+/Hulu trio (which ~80% of new sign-ups choose). It cannibalises the cable affiliate fee, so the bet is that DTC subs more than replace the ~$9.42/month ESPN earns per pay-TV home.' },
  { ic:'📉', t:'Racing the cord-cutting clock', d:'ESPN’s cable reach fell from ~100M homes (2011) to ~66M. Yet the ~$9.42/sub affiliate fee — 3x any rival and ~$8B/yr — still funds the rights bill. The DTC pivot is a race: grow the app before the linear cash cow shrinks below the cost of the rights.' },
  { ic:'🎰', t:'The betting retreat', d:'ESPN Bet is dead: ESPN and Penn Entertainment mutually terminated the 10-year, ~$2B branding deal effective Dec 2025 after it stalled at ~5% market share against the FanDuel/DraftKings duopoly. ESPN exits branded sportsbooks and is expected to rethink betting as a feature inside the flagship app.' },
  { ic:'🏈', t:'Why the NFL stake matters', d:'The deal closed Jan 31, 2026: handing the NFL ~10% of ESPN (a stake valued at ~$3B, so ESPN ≈ $30B) turns the league from adversary into part-owner — the NFL now profits if the app succeeds. It also folds RedZone (linear) and NFL Network, with their own games and cord-cutter appeal, straight into ESPN.' },
  { ic:'🚪', t:'The rights they let walk', d:'ESPN passed on UFC (→ Paramount, ~$1.1B/yr), F1 (→ Apple), Top Rank boxing and the French Open. Disciplined restraint on mid-tier properties — or ceding ground to deep-pocketed tech? Amazon, Netflix, Apple and YouTube now bid up every renewal, the reason NFL/NBA fees keep climbing.' },
  { ic:'📦', t:'The bundle wars', d:'The Venu Sports JV (ESPN + Fox + WBD) was scrapped in Jan 2025 after Fubo won an antitrust injunction — Disney instead merged Hulu + Live TV into Fubo, taking majority control. Netflix now has WWE Raw and NFL Christmas games; the fight is as much about the bundle as the rights.' },
  { ic:'💰', t:'An $11B annual rights bill', d:'The NFL, NBA, CFP, SEC, Big 12 and the rest add up to ~$10.8B a year (~45% of Disney’s content budget), with ~$86B of future rights commitments on the balance sheet. That contractual floor is both the moat (rivals can’t replicate it) and the risk (it must be paid whether subs grow or not).' },
];

// ─── Leadership bench (qualitative read; Pillars ▸ Management is the synced source of record) ─
export var DIS_MGMT = [
  { ic: '🎬', name: 'Josh D’Amaro', role: 'Chief Executive Officer', since: 'CEO since 2026',
    bio: "Long-time Disney operator who ran <b>Disney Experiences</b> (parks, resorts, cruise line and consumer products) before succeeding Bob Iger as CEO in 2026. Takes over with streaming already profitable and the ~$60B Experiences investment cycle he championed underway." },
  { ic: '💵', name: 'Hugh Johnston', role: 'Senior EVP & Chief Financial Officer', since: 'CFO since 2023',
    bio: "Joined Disney as CFO in December 2023 after more than a decade as <b>PepsiCo’s CFO</b>. Owns the capital-allocation framework — the buyback ramped toward ≥$9B, the dividend raised 50%, and the cost discipline behind the EPS guide." },
  { ic: '📺', name: 'Dana Walden & Alan Bergman', role: 'Co-Chairmen, Disney Entertainment', since: 'Since 2023',
    bio: "Run film, television and streaming (Disney+, Hulu, the studios and the linear networks) — the segment carrying the streaming-margin inflection and the studio slate." },
  { ic: '🏈', name: 'Jimmy Pitaro', role: 'Chairman, ESPN', since: 'Since 2018',
    bio: "Leads ESPN through its direct-to-consumer pivot — the flagship app launch (Aug 2025), the NFL equity deal, and ESPN’s first Super Bowl." },
];
export var DIS_MGMT_NOTE = "The 2026 Iger→D’Amaro handover completed a multi-year, board-run succession that was closely watched after two earlier false starts. Ownership and insider-transaction detail (auto-synced from Fiscal.ai) lives in the profile’s Pillars ▸ Management tab — this page is the qualitative read. Roles as of mid-2026 per Disney IR / proxy statement.";

// ─── Capital return (Valuation tab) ─────────────────────────────────────────────
export var DIS_CAPRET = [
  ['Buyback', '$3.5B → ≥$9B', "Ramped through FY2026 — funded partly by selling non-core assets (the A+E Networks stake)."],
  ['Dividend', '$1.50/sh · +50%', "FY2026 dividend, raised 50% year-over-year after reinstatement."],
  ['Adj. EPS growth', '~12% (FY26E)', "Company guidance: ~12% in FY2026 and double digits in FY2027."],
];
export var DIS_VAL_READ = "Disney trades at a discount to Netflix on both P/E and EV/EBITDA despite a comparable streaming-margin trajectory <b>and</b> a large, cash-generative profit pool (Experiences) that pure streamers lack. The bull case is a re-rating as the streaming + sports profit scales; the bear case is that the market keeps valuing Disney as a linear-TV business in decline. Multiples below are seeded approximations (mid-2026), directional — not live quotes.";

export var DIS_OV_SOURCES = "Sources — Disney FY2025 Form 10-K (year ended Sep 27, 2025) for full-year revenue, segment, subscriber and balance-sheet figures; the FY2026 10-Qs (1Q–3Q) and Q2/Q3 FY26 earnings releases for quarterly segment and SVOD figures; the FY25 Entertainment SVOD P&L supplement for the streaming ramp; and the Q3’25–Q3’26 earnings-call transcripts for guidance and strategy. Market cap is live (Massive). Peer multiples & growth are seeded approximations (mid-2026), directional — not live. Forward figures (FY26E/FY27E) are company guidance, not fact.";
export var DIS_DD_SOURCES = "Sources — same filing set as the Overview (FY2025 10-K, FY2026 10-Qs, Q2/Q3 FY26 releases, FY25 SVOD P&L supplement, FY25–FY26 earnings calls). Quarter-standalone cash-flow figures are derived (YTD minus prior YTD) and labeled approximate. Expansion dates and the ~$60B/10-year investment figure are management framing from earnings calls, not a hard 10-K commitment.";
