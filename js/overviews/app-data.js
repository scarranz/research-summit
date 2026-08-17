// overviews/app-data.js — AppLovin (NASDAQ: APP) qualitative + presentation data.
//
// Everything here traces to the FY2025 Form 10-K, the 1Q26/2Q26 Forms 10-Q, or the
// Bloomberg consensus model. Numeric time series live in app-model.js.
// Sourcing discipline follows docs/OVERVIEW_CONVENTIONS.md §2: company-official first.
//
// ── ESCAPING CONTRACT (conventions §5 — never double-encode) ─────────────────────
// RAW fields are injected as HTML: they may carry <b>/<i>, must write a literal
// ampersand as &amp;, and use plain apostrophes. RAW fields are:
//     APP_QUAD values · APP_PROD_DEFS[].desc · APP_ONE_SEGMENT · APP_GEO_CAPTION
//     APP_DD_INTRO · APP_PEERS_NOTE · APP_MARGIN_DRIVERS[].d and .pts
// Every other string is PLAIN TEXT — it goes through esc(), so write a real & and a
// real apostrophe and never an HTML entity.

// ─── Palette ────────────────────────────────────────────────────────────────────
export var APP_BRAND  = '#2563EB';   // AppLovin blue
export var APP_BRAND2 = '#60A5FA';
export var C_US   = '#2563EB';       // United States
export var C_ROW  = '#7C3AED';       // Rest of world
export var C_COGS = '#64748B';       // Cost of revenue
export var C_SM   = '#F59E0B';       // Sales & marketing
export var C_RD   = '#7C3AED';       // Research & development
export var C_GA   = '#0EA5A4';       // General & administrative
export var C_APPS = '#94A3B8';       // Divested Apps business
export var C_POS  = '#2FA36B';
export var C_NEG  = '#E0463C';

// ─── 1. Key Facts — exactly 10 cells, 5x2 ───────────────────────────────────────
export var APP_FACTS = [
  ['Listing',      'NASDAQ: APP'],
  ['HQ',           'Palo Alto, California, US'],
  ['Incorporated', 'Delaware (July 2011)'],
  ['SEC filer',    'Domestic — 10-K / 10-Q / 8-K'],
  ['Founded',      '2011'],
  ['IPO',          'Apr 15, 2021 · $80.00/sh'],
  ['CEO',          'Adam Foroughi · co-founder, CEO since 2011'],
  ['Employees',    '~898 · Dec 2025'],
  ['Dividend',     'Non-payer'],
  ['Market cap',   'live'],
];

// ─── 2. Lede — one tight paragraph, non-redundant, no hype (PLAIN) ──────────────
export var APP_LEDE = "AppLovin Corporation runs an advertising platform that places ads inside mobile apps and, more recently, on the web and connected TV. Advertisers set a return-on-ad-spend target and the company's Axon recommendation system decides, in microseconds, which ad to show which user; AppLovin is paid out of the spend it places. It was founded in 2011 by mobile app developers and, until mid-2025, also built and operated its own portfolio of mobile games.";

// ─── 3. The 2x2 quadrant — RAW, each cell <= ~30 words, always visible ──────────
export var APP_QUAD = [
  ['What it sells', 'Software that buys and sells mobile ad inventory: <b>AppLovin Ads</b> for advertisers, <b>MAX</b> for publishers, plus <b>Adjust</b> (measurement) and <b>Wurl</b> (connected TV).'],
  ['Who buys it',   'Advertisers of every size — indie game studios through to the largest internet platforms, <b>Meta and Google among them</b> — plus app publishers monetising their own inventory.'],
  ['How it earns',  'Fees out of advertiser spend, priced dynamically against each campaign\'s return target. Revenue is booked <b>net of what publishers are paid</b>. One reportable segment.'],
  ['The edge',      'A closed loop: more spend gives Axon more outcome data, better targeting attracts more spend. The scale is in the data, not the payroll — <b>898 employees</b>.'],
];

// ─── 4. How it makes money ───────────────────────────────────────────────────────
// Single reportable segment, so the >=2-slice rule (conventions §4.4) is satisfied by
// GEOGRAPHY ONLY. Never draw a one-bar "segments" chart.
export var APP_ONE_SEGMENT = 'AppLovin reports a <b>single operating and reportable segment</b>. Since selling the Apps business on 30 June 2025 there is only one business to report, so there is no segment split to chart — the company\'s only revenue disaggregation is geography, by end-user location.';

export var APP_GEO = [
  // [label, % width, $ label, share label, colour]  — labels are PLAIN
  ['United States', 51.6, '$2,827M', '51.6% of revenue', C_US],
  ['Rest of world', 48.4, '$2,653M', '48.4% of revenue', C_ROW],
];
export var APP_GEO_CAPTION = 'FY2025 revenue of $5,481M split by <b>end-user location</b> — the only disaggregation AppLovin publishes. The mix is now essentially 50/50: rest-of-world briefly overtook the US in 1Q26 before the US retook the lead in 2Q26.';

// "What is X?" accordions — QUALITATIVE ONLY, no numbers (conventions §4.4).
// .desc is RAW; .subs entries are PLAIN.
export var APP_PROD_DEFS = [
  { seg: 'AppLovin Ads',
    desc: 'The advertiser-side engine, and the product that generates the vast majority of revenue. It was called <b>Axon Ads Manager</b> until the 2Q26 10-Q renamed it. An advertiser sets a campaign goal and a return-on-ad-spend target; the <b>Axon</b> recommendation system then decides which ad to show which user, matching advertiser demand against publisher supply through auctions run at microsecond speed. Pricing is dynamic — set against the advertiser\'s goal rather than a fixed rate card — so AppLovin only grows when the advertiser\'s campaign works.',
    subs: [
      ['Axon', 'The recommendation system underneath everything. It learns from the outcomes of the ads it places, so its accuracy compounds with the volume of spend flowing through the platform.'],
      ['Where it runs', 'Historically mobile gaming inventory. The company has opened it to web-based e-commerce and social media advertisers, and describes that expansion as early.'],
    ] },
  { seg: 'MAX',
    desc: 'The publisher side of the same marketplace. App publishers use MAX to sell their advertising inventory, running a live competitive auction across demand-side platforms and ad networks so each impression goes to the highest bidder rather than to a pre-agreed buyer. It earns a share of the winning auction spend, and gives publishers the reporting they need to manage their own profitability.',
    subs: [
      ['In-app bidding', 'Replaces the older waterfall model, where networks were called in a fixed order. Every buyer bids at once, which is what lets the auction find the real clearing price.'],
    ] },
  { seg: 'Adjust',
    desc: 'A measurement and analytics platform for marketers — attribution, campaign measurement and fraud prevention — so a customer can see which spend actually produced which outcome. Unlike the rest of the suite it is sold as an <b>annual software subscription</b> rather than as a share of media spend. It is run by a wholly-owned subsidiary and is deliberately walled off: the 10-K states that data generated by Adjust is not shared with AppLovin or used to optimise its recommendation engine unless the customer directs it.',
    subs: [
      ['Why the wall matters', 'Adjust measures campaigns that run on rival networks too. The separation is what lets competitors keep using it.'],
    ] },
  { seg: 'Wurl',
    desc: 'The connected-TV arm. Wurl distributes streaming video on behalf of content companies and gives them advertising and publishing tools to attract viewers and monetise the audience. It earns from content companies and streamers, typically on a usage or CPM basis, and it is the vehicle the company uses to carry Axon beyond mobile into television.',
    subs: [
      ['Why it exists', 'Management frames CTV as one of the two expansion routes out of mobile gaming, alongside web-based e-commerce.'],
    ] },
];

// ─── 5. Products — family cards -> modal. All PLAIN (esc'd). ────────────────────
export var APP_PRODUCTS = [
  { ic:'🎯', fam:'AppLovin Ads', d:'The advertiser-side engine. Vast majority of revenue.',
    items: [
      ['AppLovin Ads', 'Campaign creation, optimisation and management for user and customer acquisition. Advertisers set goals; the platform spends against their return target.'],
      ['Axon', 'The recommendation system that matches demand to supply. Its accuracy compounds with the volume of spend it sees.'],
      ['Web & e-commerce', 'The same engine opened to web-based advertisers. Management calls this expansion early, with positive results so far.'],
    ] },
  { ic:'📈', fam:'MAX', d:'Publisher-side monetisation and in-app bidding.',
    items: [
      ['MAX', 'Runs a real-time competitive auction for a publisher\'s ad inventory across ad networks and demand-side platforms.'],
      ['Analytics', 'Reporting against key performance indicators, user lifetime value and profitability for the publisher.'],
    ] },
  { ic:'📊', fam:'Adjust', d:'Measurement, attribution and analytics. Subscription-priced.',
    items: [
      ['Attribution', 'Ties an install or an action back to the campaign that produced it, across networks.'],
      ['Fraud prevention', 'Screens out invalid installs and clicks before they are paid for.'],
      ['Analytics', 'Journey and cohort reporting so marketers can compare spend across channels.'],
    ] },
  { ic:'📺', fam:'Wurl', d:'Connected-TV distribution and advertising.',
    items: [
      ['Content distribution', 'Delivers streaming video for content companies into CTV platforms and free ad-supported channels.'],
      ['CTV advertising', 'Advertising and publishing tools for streamers, priced on usage and CPM.'],
    ] },
];

// ─── 6. Competitors ─────────────────────────────────────────────────────────────
// `named` = named as a competitor in the FY2025 10-K. Everything else is analyst-selected
// and is labelled as such on the chart. Multiples are SEEDED approximations, never live.
export var APP_PEERS = [
  { tk:'APP',   name:'AppLovin',       self:true, named:false, ev:29.0, evF:21.0, pe:47.0, peF:29.0, g:70, gF:49 },
  { tk:'META',  name:'Meta Platforms',            named:true,  ev:12.5, evF:11.0, pe:24.0, peF:21.0, g:20, gF:16 },
  { tk:'GOOGL', name:'Alphabet',                  named:true,  ev:15.0, evF:13.0, pe:24.0, peF:21.5, g:14, gF:12 },
  { tk:'AMZN',  name:'Amazon',                    named:true,  ev:15.5, evF:13.0, pe:33.0, peF:27.0, g:11, gF:10 },
  { tk:'U',     name:'Unity Software',            named:true,  ev:38.0, evF:26.0, pe:null, peF:60.0, g:5,  gF:12 },
  { tk:'TTD',   name:'The Trade Desk',            named:false, ev:24.0, evF:18.0, pe:38.0, peF:28.0, g:18, gF:16 },
];
export var APP_PEERS_NOTE = 'Bubble size is <b>live market cap</b> via Massive; add or remove any ticker with the controls above. <b>Multiples and growth are seeded approximations</b> (mid-2026) shown for shape, not live quotes — never read them as precise. Meta, Alphabet, Amazon and Unity are the competitors AppLovin itself names in its FY2025 10-K; The Trade Desk is analyst-selected and marked with a dot. Meta, Alphabet and Amazon are conglomerates whose multiples reflect far more than advertising — and all three are also AppLovin customers. Unity has no meaningful trailing P/E, so it drops out of that view.';

// ─── 7. Timeline — all PLAIN (esc'd), including the read-more bullets ───────────
export var APP_TIMELINE = [
  ['2011', 'Founded in Palo Alto — and incorporated as it still is today',
   'Adam Foroughi and his co-founders, mobile app developers themselves, start AppLovin to solve their own problem: getting an app discovered and monetised in a crowded app store.',
   ['Incorporated in Delaware on 18 July 2011 — no spin-off, no reverse merger, no roll-up. The company that trades today is the one that was founded.',
    'The founders\' own experience as developers is the origin of both sides of the marketplace: tools to buy users, and tools to monetise them.',
    'Foroughi has been CEO and Chairperson throughout.']],

  ['2018', 'KKR takes a large stake, and the debt that funded a decade of M&A is put in place',
   'KKR becomes a major shareholder through KKR Denali Holdings, and the 2018 Credit Agreement — arranged with KKR Capital Markets — becomes the borrowing facility behind the acquisitions that assembled Adjust, MAX and Wurl.',
   ['The 10-K confirms KKR Denali held more than 10% of voting interests, and that KKR Capital Markets was joint lead arranger and joint bookrunner on the 2018 Credit Agreement.',
    'That facility grew to a $1.5B term loan, a $2.1B term loan and a $610M secured revolver before it was retired in December 2024.',
    'The size and terms of KKR\'s original 2018 investment are NOT stated in these filings — source separately before publishing this entry.']],

  ['Apr 2021', 'IPO on Nasdaq at $80.00 — and it broke issue on day one',
   'A conventional underwritten IPO, not a SPAC and not a direct listing. The stock closed its first day at $65.20, about 19% below the offer price.',
   ['First trading day 15 April 2021; ticker APP, Class A shares only.',
    'The 10-K performance graph is indexed off the $65.20 close rather than the $80.00 offer price.',
    'Class B (20 votes) and Class C (no votes) were never listed and still are not.']],

  ['2023', 'Advertising overtakes games, and the business quietly changes shape',
   'For the first time advertising revenue is larger than the Apps business. From here the games portfolio is the smaller half and, eventually, the disposable half.',
   ['Advertising revenue passed the Apps business during 2023, then roughly doubled again in 2024.',
    'The headline revenue line barely moved in 2022 — the mix shift underneath it is the real story of those years.',
    'This is what made a clean divestiture possible two years later.']],

  ['Dec 2024', 'The balance sheet is refinanced into $3.55B of fixed-rate senior notes',
   'Four unsecured tranches maturing between 2029 and 2054 replace the 2018 bank facility, which is repaid in full. Nothing falls due before 2029.',
   ['$1.0B at 5.125% due 2029, $1.0B at 5.375% due 2031, $1.0B at 5.500% due 2034, $550M at 5.950% due 2054.',
    '$4.2B of principal was repaid during 2024 to retire the old structure.',
    'A new $1.0B unsecured revolver was signed at the same time and is undrawn.']],

  ['2024', 'KKR exits completely',
   'KKR Denali converts its remaining Class B shares into Class A, sells the position, and ceases to be a related party at the end of the year.',
   ['AppLovin repurchased 10,466,397 shares directly from the underwriters in the March 2024 secondary at $54.46 — the same price the underwriters paid KKR.',
    'Earlier private repurchases from KKR: 15,000,000 shares at $36.85 in August 2023, and 15,952,381 shares at $21.00 in May 2023.',
    'Control never changed hands: the founder-held Class B and its voting agreement were always the control block.']],

  ['Mar 2025', 'Securities class action — the one defining legal matter',
   'Alleged stockholders sue the company, the CEO, the CFO and others, claiming materially false and misleading statements about the advertising solutions and the company\'s financial growth.',
   ['Consolidated as the Brownback Action in the Northern District of California; putative class period 7 November 2024 to 27 March 2025.',
    'Defendants: the Company, Adam Foroughi, Matthew Stumpf, Herald Chen and, added in September 2025, Basil Shikin.',
    'Motion to dismiss filed November 2025 and heard March 2026. Parallel derivative suits are consolidated and stayed behind it.',
    'The company says the allegations lack merit; it states it cannot reasonably estimate any range of loss.']],

  ['Jun 2025', 'The Apps business is sold and AppLovin becomes a single-segment ad company',
   'The mobile-games portfolio goes to Tripledot for $715.6M of total consideration. Apps moves into discontinued operations in every period, and what remains reports as one segment.',
   ['$430.6M in cash plus 596.9M Tripledot shares valued at $285.0M — roughly 20% of Tripledot fully diluted, now carried at equity method.',
    'A $188.9M goodwill impairment was taken on the Apps reporting unit in 1Q25, once the sale was in negotiation.',
    'Pre-tax gain of $106.2M after $18.3M of transaction costs; a $204.3M capital loss was fully offset by a valuation allowance.',
    'This is why revenue as originally reported for 2021-2024 is not comparable to 2025 onward.']],

  ['Oct 2025', 'Engineers are paid to chase a $300B-to-$1-trillion market cap',
   'A performance-share grant to key non-executive engineering staff vests only on market-capitalisation milestones — starting at $300 billion and running up to $1 trillion, measured over a seven-year period.',
   ['920,526 PSUs with a grant-date fair value of $410.5M, valued on a Monte Carlo model off a $620.62 share price and 70.95% expected volatility.',
    'Deloitte made this valuation the Critical Audit Matter of the FY2025 audit.',
    'Earlier grants worked the same way and all vested: the March 2023 tranches targeted $36 to $79 a share and were fully vested by the end of 2024.',
    'It is the clearest statement of management ambition in the filings — and a real future expense and source of dilution.']],
];

// ─── Deep Dive narrative ────────────────────────────────────────────────────────
export var APP_DD_INTRO = 'Everything below is <b>continuing operations</b> — the advertising business. The Apps segment sold in June 2025 sits in discontinued operations in every period, so the revenue line AppLovin printed before 2025 is not the same business; where a view needs the old basis it is labelled <i>as reported</i>. Shaded columns are <b>Bloomberg consensus (BST)</b>, not company guidance: AppLovin publishes none in its SEC filings.';

// .d and .pts are RAW (write &amp; for a literal ampersand)
export var APP_MARGIN_DRIVERS = [
  { ic:'🧮', t:'Almost nothing scales with revenue', tag:'Structural',
    d:'Total costs and expenses grew <b>1.2%</b> in 2025 while revenue grew <b>70%</b>. The only line that genuinely tracks volume is datacenter cost — and even that fell as a share of revenue.',
    pts:['Datacenter cost: 13.6% of revenue in 2023 to 9.9% in 2025.',
         'Capex was $0.5M in FY2025. The compute is rented, not owned.',
         'Operating margin went 42% to 59% to 76% across 2023-2025.'] },
  { ic:'👥', t:'898 people', tag:'Operating leverage',
    d:'The company produced <b>$5.5B of revenue and $4.2B of operating income</b> in 2025 with 898 employees, about 380 of them in research and development.',
    pts:['Roughly $6.1M of revenue and $4.6M of operating income per employee.',
         'About 60% of staff sit outside the United States.',
         'Headcount is not the growth constraint — Axon accuracy is.'] },
  { ic:'📉', t:'The expense lines are stock comp, not activity', tag:'Read carefully',
    d:'Sales &amp; marketing fell 19% and research &amp; development fell 40% in 2025. Almost all of that was <b>lower stock-based-compensation payroll cost</b>, not retrenchment — and it reverses hard in 2026.',
    pts:['FY25 declines: minus $57.1M of S&amp;M and minus $151.1M of R&amp;D personnel cost, both stock-comp driven.',
         '2Q26 R&amp;D then rose 127% year over year, $54.8M of it stock comp, as the October-2025 PSU grant began to amortise.',
         'Unrecognised stock comp was $489.0M over a 1.95-year weighted average at 31 Dec 2025 — before that grant is fully in the run rate.'] },
  { ic:'🏛️', t:'The tax rate is the soft spot', tag:'Watch',
    d:'A <b>13.1%</b> effective rate in 2025 rests on a negotiated Singapore rate, the foreign-derived intangible income deduction and a stock-comp windfall — and the mix is moving against all three.',
    pts:['Pillar 2 global minimum tax already cut the Singapore benefit by $82.7M.',
         'Pre-tax income flipped to $2,211M US against $1,742M foreign in 2025, from $88M against $1,524M in 2024.',
         'The stock-comp benefit, worth 3.4 points, only exists while the share price compounds.',
         '1H26 already runs near 15.8%.'] },
];

// PLAIN (esc'd)
export var APP_CAPRET = [
  ['Dividend', 'None, ever. The 10-K states the company does not anticipate paying one in the foreseeable future.'],
  ['Buyback', 'The only return of capital. $2.2B of stock retired in 2025 and $1.5B in 1H26, leaving $1.8B of authorisation at 30 June 2026.'],
  ['Leverage', '$3.55B of fixed-rate senior notes with nothing due before 2029, against $3.1B of cash at 30 June 2026. Consensus has the company at net cash during 2026.'],
  ['Dilution', 'Diluted share count is falling — 362.6M in 2023 to 342.0M in 2025 — but $489M of unrecognised stock comp and a 5%-of-shares annual evergreen on the 2021 Plan push the other way.'],
];

// ─── Footers — PLAIN ────────────────────────────────────────────────────────────
export var APP_OV_SOURCES = "Sources — AppLovin Corporation FY2025 Form 10-K (filed 19 Feb 2026) for the business description, products, competitors, employees, capital structure, litigation and all FY2023-FY2025 figures; the 1Q26 and 2Q26 Forms 10-Q for 2026 figures and for the AppLovin Ads renaming. Market cap is live via Massive. Competitor multiples are seeded approximations, not live quotes, and are labelled as such on the chart. KKR's 2018 investment terms are not stated in these filings and are flagged in the timeline for separate sourcing.";

export var APP_DD_SOURCES = "Sources — AppLovin Corporation FY2025 Form 10-K and the 1Q26/2Q26 Forms 10-Q for all actuals; Bloomberg (APP US Equity, estimate source BST) for 2026E-2028E consensus and for the 2021/2022 advertising-segment split, which was cross-checked line by line against the 10-K restatement. Consensus is not company guidance: AppLovin publishes none in its SEC filings. All figures are continuing operations unless labelled as reported or Apps. Derived cells are marked in the note under each table.";
