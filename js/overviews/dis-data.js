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
