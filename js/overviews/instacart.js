// overviews/instacart.js — custom Overview for Instacart / Maplebear Inc. (NASDAQ: CART)
// Built individually per the portal's per-company Overview model (see CLAUDE.md).
// Hybrid structure: SEA-style chapters (sub-tabs) + Visa/Mastercard-style transaction
// dynamics (a multi-sided model + a "walk an order" flow showing who earns when).
// Four chapters: Overview · Marketplace · Advertising · Enterprise.
// Headline figures are approximate FY2024 and marked to refresh; time-series charts
// are placeholders pending the team's data. CART has a Summit DCF model — financials
// can be wired in later the same way as Mastercard's Financials tab.

import { makeValuation } from './valuation.js';

// Interactive "Scenario → price target" calculator (Valuation tab). Fundamentals from
// the Summit DCF (FY2025 actuals; FY2026E estimate). GTV is one shared volume with two
// take rates (transaction fees + advertising attach). Net cash & price are editable
// (Summit model carries no balance sheet/quote); defaults reproduce the DCF FY2026E.
var CART_VAL = makeValuation({
  brand:'#0AAD0A', sharesM:279.621,
  netCashDefaultM:731, netCashNote:'Dec 2025: cash $637M + short/long-term investments $131M − debt $37M ≈ +$0.73B net cash.',
  priceDefault:44.02, priceAsOf:'Jul 1 2026',
  priceHint:"$44.02 on Jul 1 2026; Street average PT ~$50. Editable — verify live.",
  volLabel:'GTV', sharedVolume:true, sharedBaseM:37225, sharedGrowthDefaultPct:12,
  volHint:{ growth:"'22 +15.7% · '23 +11.0% · '24 +5.2% · '25 +10.6%", guide:"Instacart guides GTV + Adj. EBITDA each quarter (see the Financials tab)." },
  segments:[
    { key:'txn', label:'Transaction', sub:'retailer + consumer fees', take2025Pct:7.19,
      hint:{ take:"'22 6.7% · '23 7.0% · '24 7.2% · '25 7.2%" } },
    { key:'ads', label:'Advertising', sub:'ad attach rate', take2025Pct:2.86,
      hint:{ take:"'22 2.6% · '23 2.7% · '24 2.8% · '25 2.9%", guide:"The profit engine — the attach rate is the lever to model." } },
  ],
  marginBasePct:29.0, marginDefaultPct:30.6,
  marginHint:"History: '22 7.7% · '23 20.6% · '24 26.2% · '25 29.0%. Instacart guides an Adj. EBITDA $ range each quarter.",
  dcf:{ fy:'FY2026E', revM:4170.7, ebitdaM:1275.8 },
  mult:{ evebitda:{min:5,max:18,def:9.1}, marginMin:20, marginMax:38 },
});

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Snapshot & narrative ────────────────────────────────────────────────────
var SNAPSHOT = [
  ['Listing', 'NASDAQ: CART'],
  ['Legal name', 'Maplebear Inc.'],
  ['Founded', '2012'],
  ['IPO', 'Sep 2023 · $30.00'],
  ['HQ', 'San Francisco, CA'],
  ['CEO', 'Chris Rogers (2025–)'],
];
var DESC = 'Instacart (legally Maplebear Inc.) is <b>North America\'s leading grocery-technology platform</b>. It runs two connected motions: a consumer <b>Marketplace</b> — an app to order groceries from <b>~1,800 retail banners / 85,000+ stores</b>, fulfilled by a gig <b>shopper</b> network — and <b>Instacart Platform (Enterprise)</b>, the white-label e-commerce, fulfillment, ads and insights tech that powers retailers\' <i>own</i> websites and apps. Riding on top is a large, fast-growing and <b>high-margin Advertising</b> business, where <b>CPG brands</b> pay to be discovered at the point of purchase. Instacart does not own inventory or stores — it sits in the middle of a <b>multi-sided network</b> (consumers, retailers, shoppers, advertisers) and earns <b>transaction fees</b> on the volume it enables plus <b>advertising</b> on the demand it creates.';

var KPIS = [
  { l:'GTV (FY25)',          v:'$37.2B', d:'+11% YoY',                   dir:'up' },
  { l:'Orders (FY25)',       v:'339M',   d:'+12% YoY',                   dir:'up' },
  { l:'Advertising & other', v:'$1.08B', d:'~2.9% of GTV · high-margin', dir:'up' },
  { l:'Adj. EBITDA (FY25)',  v:'$1.09B', d:'profitable & scaling',       dir:'up' },
];
var AS_OF = 'Headline figures are <b>FY2025</b> actuals (fiscal year = calendar year), from the Summit DCF model. <b>GTV</b> = Gross Transaction Value (the dollar value of orders + fees flowing through the marketplace). Instacart reports revenue in two lines — <b>Transaction revenue</b> and <b>Advertising &amp; other revenue</b>; the three "motions" below (Marketplace / Advertising / Enterprise) are the strategic view. See the <b>Financials</b> tab for the historical KPI charts.';

var HOW_MONEY = [
  '<b>Not a grocer:</b> Instacart owns <b>no inventory and no stores</b>. It provides the technology, demand and fulfillment that connect shoppers, retailers and brands — and never takes grocery inventory risk.',
  '<b>Transaction revenue (the base):</b> fees from <b>retailers</b> (for the orders and tech it provides) and from <b>consumers</b> (service &amp; delivery fees), earned as a take of GTV. Includes both the Marketplace and the Enterprise platform.',
  '<b>Advertising &amp; other (the margin engine):</b> <b>CPG brands</b> pay for sponsored products, displays and premium placement at the moment of purchase — high-margin and growing faster than transactions. ~30% of revenue on ~3-4% of GTV.',
  '<b>Walk an order:</b> tap a party in the network below to see its role, then press Play to follow a single grocery order and see who earns at each step.',
];

// ─── Multi-sided network (hub) — parties & roles ─────────────────────────────
var PARTIES = [
  { k:'cust',  ic:'🛒', l:'Consumer',      s:'orders & pays fees' },
  { k:'shop',  ic:'🚗', l:'Shopper',       s:'picks & delivers' },
  { k:'ret',   ic:'🏬', l:'Retailer',      s:'sells the groceries' },
  { k:'brand', ic:'🏷️', l:'CPG brand',     s:'pays for ads' },
];
var PARTY_DETAIL = {
  cust:  { t:'Consumer', h:'The household placing the order. Pays for the groceries plus a <b>service fee</b>, <b>delivery fee</b> and <b>tip</b> (the tip passes through to the shopper). <b>Instacart+</b> members pay an annual fee to waive delivery on eligible orders — they order more often and with larger baskets.' },
  shop:  { t:'Shopper — the gig fulfillment network', h:'An independent contractor who shops the items in-store and delivers them. <b>Paid by Instacart</b> (a cost of fulfillment) plus the customer\'s tip. The shopper network is what lets Instacart serve tens of thousands of stores without owning logistics.' },
  ret:   { t:'Retailer', h:'The grocery banner (Kroger, Costco, Sprouts, etc.). Sells its own inventory and keeps the grocery margin. On the <b>Marketplace</b> it pays Instacart a fee for the demand &amp; fulfillment; on <b>Enterprise</b> it pays Instacart to power its own e-commerce. ~1,800 banners across 85,000+ stores.' },
  brand: { t:'CPG brand — the advertiser', h:'Consumer-packaged-goods brands (and increasingly others) that pay Instacart to be <b>discovered at the point of purchase</b> — sponsored products, displays, coupons. The highest-margin revenue and the main reason a unit of GTV is worth more over time. 6,000+ active advertisers.' },
  ic:    { t:'Instacart — the platform', h:'Sits in the middle of all four. Earns <b>transaction fees</b> (from retailers &amp; consumers) and <b>advertising</b> (from brands), and <b>pays the shopper</b>. Owns no inventory, no stores, no trucks — it monetizes the <b>data and demand</b> created when these parties interact.' },
};

var FLOW_NODES = [
  { k:'cust', ic:'🛒', l:'Consumer' }, { k:'brand', ic:'🏷️', l:'CPG brand' }, { k:'ic', ic:'🥕', l:'Instacart' }, { k:'ret', ic:'🏬', l:'Retailer' }, { k:'shop', ic:'🚗', l:'Shopper' },
];
var FLOW_STEPS = [
  { t:'Setup', on:[], cap:'A ~$110 grocery order on Instacart. Press <b>Play</b> to follow the order and see where each party earns (or pays).', earn:'', earnType:'none' },
  { t:'1 · Browse + discovery', on:['cust','ic','brand'], cap:'The consumer opens the app and sees a retailer\'s catalog — interleaved with <b>sponsored products</b> from CPG brands.', earn:'Advertising meters start: a <b>brand</b> pays Instacart when its sponsored product is shown / clicked / bought. <b>High-margin ad revenue → INSTACART.</b>', earnType:'ad' },
  { t:'2 · Order placed', on:['cust','ic'], cap:'The consumer checks out: items + <b>service fee</b> + <b>delivery fee</b> + <b>tip</b> (Instacart+ may waive delivery).', earn:'Instacart books <b>consumer fees</b> (service / delivery) → part of transaction revenue. The <b>tip</b> is earmarked for the shopper.', earnType:'ic' },
  { t:'3 · Shop & deliver', on:['ic','shop','ret'], cap:'A <b>shopper</b> picks the items in the retailer\'s store and delivers them to the door.', earn:'Instacart <b>PAYS the shopper</b> (a fulfillment cost) and passes through the tip. This is the main cost of an order.', earnType:'cost' },
  { t:'4 · Retailer fulfilled', on:['ret','ic'], cap:'The <b>retailer</b> sells its groceries for the order; it pays Instacart for the demand &amp; fulfillment (Marketplace) or for the tech (Enterprise).', earn:'Instacart books the <b>retailer fee</b> → the other half of transaction revenue. The retailer keeps its <b>grocery margin</b>.', earnType:'ic' },
  { t:'5 · Who got what', on:['cust','brand','ic','ret','shop'], cap:'The consumer got delivery; the retailer sold groceries; the shopper got paid + tip.', earn:'<b>Instacart earns transaction revenue (consumer + retailer fees) + high-margin advertising</b>, minus what it pays the shopper. Thin per-order economics × scale + a rich ad layer = the model.', earnType:'split' },
];
var FLOW_NOTE = 'Instacart earns most when an order carries <b>advertising</b> on top of the transaction — a brand paying to be discovered is far higher-margin than the delivery fee itself. That is why <b>more orders → more shopper/retailer/consumer data → a more valuable ad network</b>, which is the real profit engine (see Advertising).';

// ─── Revenue structure: the three motions ────────────────────────────────────
var SEGMENTS = [
  { k:'mkt', n:'Marketplace', accent:'#0AAD0A', rev:'consumer app', margin:'the demand engine',
    subs:[
      { k:'mkt-tx', n:'Transaction fees', rev:'% of GTV',
        what:'Fees from <b>retailers</b> (for demand &amp; fulfillment) and <b>consumers</b> (service &amp; delivery) on orders placed in the Instacart app.',
        monetizes:'A take of <b>GTV</b>; grows with orders × basket size. Instacart owns the customer relationship here.',
        products:[{n:'Retailer fees', d:'Paid by the grocery banner for orders Instacart drives & fulfills.'},{n:'Consumer fees', d:'Service + delivery fees (Instacart+ waives the delivery fee on eligible orders; service fees still apply).'}],
        competition:'DoorDash, Uber Eats, Amazon Fresh, Walmart, retailer-direct.' },
      { k:'mkt-plus', n:'Instacart+ membership', rev:'subscription',
        what:'A paid annual membership that waives delivery on eligible orders and adds perks.',
        monetizes:'Recurring subscription + <b>higher frequency &amp; larger baskets</b> from members (more GTV and ad inventory).',
        products:[{n:'Membership fee', d:'Annual/-monthly recurring revenue.'},{n:'Loyalty lift', d:'Members order more often → more GTV & ads.'}],
        competition:'Amazon Prime, Walmart+.' },
    ] },
  { k:'ads', n:'Advertising & Other', accent:'#FF7009', rev:'~30% of revenue', margin:'the margin engine',
    subs:[
      { k:'ads-sp', n:'Sponsored products', rev:'highest-margin',
        what:'CPG brands pay to appear when shoppers search/browse — <b>discovery at the point of purchase</b>, with closed-loop attribution (the ad and the sale are the same session).',
        monetizes:'Auction-based ad spend; very <b>high gross margin</b> and growing faster than transactions. The single biggest profit driver.',
        products:[{n:'Sponsored product', d:'Promoted items in search & browse.'},{n:'Displays & coupons', d:'Banners, featured deals, digital coupons.'}],
        competition:'Amazon Ads, retail-media networks (Walmart Connect, Kroger).' },
      { k:'ads-other', n:'Insights & other', rev:'data products',
        what:'Selling brands and retailers <b>data, measurement and insights</b> on what sells and why.',
        monetizes:'Subscriptions / managed services; deepens advertiser stickiness.',
        products:[{n:'Measurement', d:'Closed-loop ad attribution & analytics.'},{n:'Audience tools', d:'Targeting and campaign optimization.'}],
        competition:'Retail-media measurement vendors.' },
    ] },
  { k:'ent', n:'Enterprise — Instacart Platform', accent:'#3A7BD5', rev:'embedded in transactions', margin:'strategic / sticky',
    subs:[
      { k:'ent-store', n:'White-label storefront', rev:'tech fees',
        what:'Instacart powers the <b>retailer\'s own</b> website/app e-commerce — the retailer (not Instacart) owns the customer.',
        monetizes:'Platform/usage fees; lower take than Marketplace but <b>strategically sticky</b> and defends against retailers leaving.',
        products:[{n:'Storefront / Storefront Pro', d:'Retailer-branded e-commerce.'},{n:'Fulfillment as a service', d:'Picking & delivery on the retailer\'s own orders.'}],
        competition:'DoorDash Drive, Uber Direct, in-house builds.' },
      { k:'ent-tech', n:'In-store & ads tech (Carrot)', rev:'tech suite',
        what:'The "Carrot" technology suite: <b>smart carts (Caper)</b>, electronic shelf labels, in-store fulfillment and the retailer\'s own ad tools.',
        monetizes:'Hardware + software fees; extends Instacart from online into the <b>physical store</b>.',
        products:[{n:'Caper Carts', d:'AI smart shopping carts.'},{n:'Carrot Ads / Tags', d:'Retailer-run ads + e-shelf labels.'}],
        competition:'Amazon (Just Walk Out), Shopic, in-house.' },
    ] },
];

// ─── Unit economics of one order ─────────────────────────────────────────────
var UE_STATS = [
  { v:'~$110', l:'GTV per order', s:'items + fees in a typical basket' },
  { v:'~7-8%', l:'Transaction take', s:'retailer + consumer fees ÷ GTV' },
  { v:'~3-4%', l:'Ad take (of GTV)', s:'highest-margin layer, on top' },
];
var UE_BULLETS = [
  '<b>Transaction revenue</b> ≈ a single-digit % of the ~$110 order — split between the <b>retailer fee</b> and <b>consumer fees</b> (service/delivery).',
  '<b>The big cost</b> is paying the <b>shopper</b> to pick and deliver; that, plus payment and support, is most of the cost of an order.',
  '<b>Advertising is where the margin is.</b> A few % of GTV in ad spend carries very high gross margin and turns a thin-margin delivery into a profitable order — so the <b>ad attach rate</b> is the metric that matters most.',
  '<b>Larger baskets help everything</b>: fixed fulfillment cost is spread over more items, take rate holds, and there is more to advertise against — why Instacart+ members (bigger, more frequent baskets) are so valuable.',
];

// ─── Customer types (who pays Instacart) ─────────────────────────────────────
var CUSTOMERS = [
  ['Consumers', 'Households ordering groceries — especially <b>larger-basket, suburban</b> and <b>Instacart+</b> members who order weekly. They pay fees (and tips to shoppers).'],
  ['Retailers', '~<b>1,800 banners / 85,000+ stores</b>. Pay for marketplace demand & fulfillment, or for the Enterprise tech to run their own e-commerce.'],
  ['CPG advertisers', '<b>6,000+ brands</b> paying to be discovered at the point of purchase — the highest-margin customer and the fastest-growing.'],
  ['Shoppers', 'Not a payer but the <b>fulfillment supply</b>: the gig network Instacart pays to shop and deliver. Their density & reliability is a core asset.'],
];

// ─── Advertising flywheel ────────────────────────────────────────────────────
var AD_FLY = [
  ['1','More consumers & orders','Every order generates first-party purchase data — what people buy, search and substitute.'],
  ['2','A richer ad network','That data makes Instacart\'s ads more targetable and measurable (closed-loop: the ad and the sale are the same session).'],
  ['3','More brand spend','CPG brands shift budget to where it converts at the shelf → high-margin ad revenue.'],
  ['4','Subsidize the marketplace','Ad profit funds better prices, perks and selection → more consumers and orders, and the loop compounds.'],
];

// ─── Enterprise deep dive ────────────────────────────────────────────────────
var ENTERPRISE = [
  '<b>What it is:</b> the same technology that runs Instacart\'s own app, sold to retailers to power <b>their own</b> e-commerce, fulfillment, ads and in-store tech — the retailer keeps the customer relationship.',
  '<b>Why it matters:</b> it turns a potential competitor (a retailer wanting its own online channel) into a <b>customer</b>, and embeds Instacart deep in the retailer\'s operations — a defensive, sticky moat even if Marketplace economics are lower.',
  '<b>From online to the aisle:</b> via the <b>Carrot</b> suite (Caper smart carts, electronic shelf labels, in-store fulfillment) Instacart now reaches the <b>physical store</b>, not just delivery — expanding the addressable market well beyond online grocery.',
];

// ─── Tailwinds / Headwinds ───────────────────────────────────────────────────
var TAILWINDS = [
  '<b>Low online-grocery penetration.</b> Online is still a low-teens % of US grocery — <i>mechanism:</i> a long runway as more of a huge, frequent, non-discretionary category moves online.',
  '<b>Advertising compounding.</b> Retail media is one of the fastest-growing ad pools, and Instacart has closed-loop, point-of-purchase data — <i>mechanism:</i> high-margin ad revenue grows faster than transactions and lifts whole-company margins.',
  '<b>Enterprise + in-store (Carrot).</b> Powering retailers\' own channels and physical stores — <i>mechanism:</i> widens the moat and the addressable market beyond Instacart\'s own app.',
];
var HEADWINDS = [
  '<b>Intense competition.</b> DoorDash, Uber Eats, and especially <b>Amazon and Walmart</b> (own logistics + scale) — <i>mechanism:</i> pressure on take rate, consumer fees and retailer loyalty.',
  '<b>Gig-labor regulation.</b> Worker-classification rules can raise shopper costs — <i>mechanism:</i> the largest cost line is fulfillment, so reclassification risk hits unit economics directly.',
  '<b>Thin grocery economics & retailer concentration.</b> Low category margins and dependence on a few large banners — <i>mechanism:</i> a big retailer leaving (or building in-house) can move volume materially.',
];

// ─── Peers / Competitive Landscape ──────────────────────────────────────────
var PEERS = [
  { n:'DoorDash', k:'DASH', angle:'Grocery as an <b>extension of restaurant delivery</b>. Small-basket, high-frequency convenience model. Largest US last-mile network but grocery baskets are ~3\u00d7 smaller than Instacart\u2019s.',
    edge:'Last-mile density, brand recognition with younger/urban consumers, DashPass cross-sell.',
    gap:'No enterprise platform for retailers, no in-store tech, no closed-loop ad network at Instacart\u2019s scale.' },
  { n:'Amazon Fresh / Whole Foods', k:'AMZN', angle:'Full vertical: <b>owns stores, warehouses, logistics, and Prime</b>. The existential competitor \u2014 the reason independent retailers partner with Instacart in the first place.',
    edge:'Prime 200M+ members, owned fulfillment, unlimited capital, Whole Foods + Amazon Fresh physical footprint.',
    gap:'Retailers view Amazon as the threat, not a partner. Amazon\u2019s ad network is massive but not grocery-specific. Fresh/Whole Foods market share still small vs traditional grocery.' },
  { n:'Walmart', k:'WMT', angle:'<b>Largest US grocer</b> with owned stores, pickup infrastructure, and Walmart+ membership. Does not need a third-party marketplace.',
    edge:'Unmatched physical footprint, price leadership, $100B+ grocery revenue, Walmart Connect ads.',
    gap:'Closed ecosystem \u2014 only Walmart stores. No multi-retailer platform, no enterprise offering for other grocers.' },
  { n:'Uber Eats', k:'UBER', angle:'Restaurant-first platform expanding into grocery/convenience. <b>Instacart partner</b> (powers restaurant delivery on the Instacart app) and competitor simultaneously.',
    edge:'Global footprint, massive driver network, Uber One cross-sell with rides.',
    gap:'Grocery baskets smaller, no retailer enterprise suite, no in-store tech. The Instacart partnership suggests Uber sees more value partnering than competing head-on in large-basket grocery.' },
];

// ─── Strategy — the self-reinforcing flywheel (ads fund the pivot) ──────
var STRATEGY = {
  thesis:'From a delivery app to <b>the technology and enablement partner for the grocery industry</b> — Instacart is wiring itself into how retailers sell, how brands advertise and how people discover food, online and in the physical store. The engine that pays for the whole pivot: <b>advertising</b>.',
  loop:[
    { k:'mkt',  ic:'🛒', n:'Marketplace demand',
      so:'The consumer app generates orders — and the first-party data no one else has.',
      detail:'The consumer Marketplace is the top of the funnel — ~1,800 banners, 85,000+ stores, 339M orders a year. Every order is <b>first-party purchase data</b> (what households buy, search and substitute), the raw material the rest of the strategy runs on. Critically, Instacart <b>owns this customer relationship</b>, unlike Enterprise.' },
    { k:'ads',  ic:'🎯', n:'Advertising profit',
      so:'That data powers closed-loop ads — ~100% margin, ≈ the whole company’s profit.',
      detail:'CPG brands pay to be discovered <b>at the point of purchase</b>, with <b>closed-loop attribution</b> — the ad and the sale are the same session. ~29% of revenue on ~3% of GTV at near-100% gross margin, so it is ≈ the entire company Adj. EBITDA. This is the <b>profit that funds every other stage.</b>' },
    { k:'ent',  ic:'🏬', n:'Enterprise · Carrot',
      so:'Ad profit funds tech that turns rival retailers into customers.',
      detail:'The same technology that runs Instacart’s own app, sold to retailers to power <b>their own</b> e-commerce, fulfillment, ads and in-store hardware — Storefront, Caper Carts, Connected Stores, FoodStorm, Carrot Ads. It <b>turns a would-be competitor into a customer</b> and embeds Instacart in the retailer’s operations. Lower take than Marketplace, far stickier — management’s stated identity.' },
    { k:'moat', ic:'⚙️', n:'Density & affordability',
      so:'Denser batching makes the $10 basket profitable only here — the moat compounds.',
      detail:'Affordability (the $10 minimum basket, price parity with in-store) is profitable <b>only at Instacart’s order density</b> — small orders batch onto already-dense routes, so what a competitor loses money on, Instacart can serve. More retailers and orders deepen that density; the price-sensitive cohorts it wins <b>retain better than average.</b> The moat compounds with scale.' },
    { k:'intl', ic:'🌍', n:'International · Instaleap',
      so:'Export the enterprise tech abroad on Instaleap’s base — no marketplace to rebuild.',
      detail:'Instacart’s consumer Marketplace is US/Canada-only and brutally expensive to rebuild abroad. The Apr-2026 <b>Instaleap</b> acquisition (a Colombia-born grocery-fulfillment software firm powering ~100 retailers across ~30 countries) is an <b>instant international base of retailer relationships</b> to layer the high-margin Enterprise tech onto — no marketplace, shopper network or brand to build. Asset-light land-and-expand.' },
    { k:'ai',   ic:'🤖', n:'AI & agentic commerce',
      so:'Operational data + native ChatGPT checkout — own the next interface early.',
      detail:'Two edges. <b>(1) Data compounding</b> — shoppers physically picking and scanning shelves generate operational grocery data (replacements, found/fill rates) a purely digital rival cannot get. <b>(2) Agentic commerce</b> — native Instant Checkout inside <b>ChatGPT</b> across 1,800+ retailers, and a Cart Assistant live with ~25% of US customers, positioning Instacart <b>inside the AI interface</b> before shopping patterns there calcify.' },
  ],
};

// ─── History & Milestones (sourced; dates verified on the load-bearing ones) ──
var TIMELINE = [
  { y:'2012', t:'<b>Founded</b> in San Francisco by <b>Apoorva Mehta</b> (ex-Amazon) with Max Mullen &amp; Brandon Leonardo; joins Y Combinator (S12).',
    d:'Mehta, a former Amazon supply-chain engineer, built an asset-light grocery-delivery marketplace — customers order from partner retailers and a gig "shopper" picks and delivers. Instacart owned <b>no stores or inventory</b> from day one — the economics that still define it. He famously got into Y Combinator late by using the app to deliver a six-pack to a partner.' },
  { y:'2014', t:'<b>Whole Foods</b> becomes the first national retail partner; Series B ($44M, Andreessen Horowitz) scales one-hour delivery.' },
  { y:'2015', t:'Reaches a <b>$2B valuation</b> (Series C, Kleiner Perkins) — the unicorn moment; the partner-retailer model becomes the path to scale.' },
  { y:'2017', t:'<b>Amazon buys Whole Foods</b> — rival grocers rush to Instacart; Kroger &amp; Albertsons deals drive the <b>platform pivot</b>.',
    d:'Amazon\'s $13.7B Whole Foods acquisition (Aug 2017) spooked every other grocer, who rushed to Instacart to power their own delivery (Kroger, Albertsons, Costco). This is when Instacart\'s identity shifted from a consumer app toward a <b>B2B platform</b> powering retailers\' e-commerce — the seed of today\'s Enterprise motion. (Whole Foods itself ended its Instacart partnership in 2019.)' },
  { y:'2020', t:'<b>COVID-19 demand explosion</b> — orders surge ~150%+ YoY; first profitability; <b>self-serve advertising</b> launches.',
    d:'The pandemic pulled forward years of online-grocery adoption almost overnight; Instacart hit its first profitable month around April 2020 and scaled toward ~750,000 shoppers. Critically, it launched a <b>self-serve ad platform</b> (sponsored products) in May 2020 — seeding the high-margin advertising business that is now the profit engine.' },
  { y:'Mar 2021', t:'<b>Valuation peaks at $39B</b> — the all-time high and last major private round.' },
  { y:'Aug 2021', t:'<b>Fidji Simo</b> (ex-Facebook, architect of FB\'s mobile-ads business) becomes <b>CEO</b>; founder Mehta moves to Executive Chairman.',
    d:'Bringing in Simo — who built Facebook\'s mobile advertising and monetization machine — was an explicit signal of the strategy: pivot from pure delivery toward high-margin <b>advertising</b> and <b>enterprise software</b> ahead of an eventual IPO. That pivot defines the company\'s margin story today.' },
  { y:'2021–22', t:'Acquisition spree builds the platform: <b>Caper AI</b> (~$350M, smart carts), FoodStorm, Eversight, Rosie; launches <b>Instacart Platform / Carrot</b>.',
    d:'Caper AI (computer-vision smart carts) pushed Instacart into the <b>physical store</b> and on-cart retail media; FoodStorm (catering / order-ahead), Eversight (AI pricing) and Rosie (e-commerce for independent grocers) rounded out the retailer-tech suite. All were folded under "Instacart Platform" and the <b>Carrot</b> brand (Carrot Ads, Warehouses, Insights) in Mar 2022 — the Enterprise motion made explicit.' },
  { y:'Sep 2023', t:'<b>IPO</b> on Nasdaq at <b>$30.00</b> (ticker CART) — ~$10B valuation, ~75% below the $39B peak; profitable &amp; FCF-positive going in.',
    d:'A rare profitable 2023 tech IPO (PepsiCo took a $175M concurrent stake). The ~$10B valuation was a stark "down round" vs the 2021 $39B peak — emblematic of the broader tech-valuation reset. Shares opened ~$42, faded to close ~+12%, and slipped below the $30 IPO price within about a week.' },
  { y:'2024', t:'<b>Advertising tops $1B</b>; <b>Uber Eats</b> powers restaurant delivery on Instacart; shoppable YouTube ads; first share buybacks.' },
  { y:'2025', t:'<b>CEO transition:</b> Fidji Simo leaves to lead applications at <b>OpenAI</b>; <b>Chris Rogers</b> (ex-Apple, P&amp;G; CBO) becomes CEO (Aug 15); Simo stays Chair.',
    d:'OpenAI hired Simo as "CEO of Applications" (May 2025). The board promoted <b>Chris Rogers</b> — Chief Business Officer through the growth years, earlier ~11 years at Apple and before that P&amp;G — to CEO effective Aug 15, 2025, with Simo remaining Chair of the board. The ads/enterprise strategy continues unchanged.' },
  { y:'Dec 2025', t:'Launches inside <b>OpenAI\'s ChatGPT</b> with Instant Checkout — first grocery partner with embedded end-to-end shopping across 1,800+ retailers.' },
];
var TL_NOTE = 'Milestones from Instacart press releases and public reporting; load-bearing dates (IPO, CEO changes, the $39B peak, acquisitions) verified against primary sources.';

var SOURCES = 'Sources: Instacart (Maplebear Inc., NASDAQ: CART) \u2014 KPI & financial charts are historical actuals from the Summit DCF model (annual FY2021\u20132025, quarterly 1Q22\u20131Q26). Qualitative content from public filings & investor materials. Earnings call highlights from Quartr transcripts. Stock-price changes from Investing.com (close-to-close). Competitor profiles from public information. Forecast years excluded by design.';

// ─── Earnings Calls (10 calls, Q3 2023 → Q1 2026, most recent first) ────────
// Price changes: close on call day → close next trading day (Investing.com).
// Highlights: qualitative only, as of that point in time. Source: Quartr transcripts.
var CALLS = [
  { q:'Q1 2026', date:'May 6, 2026', chg:-8.2,
    hl:[
      'Cart Assistant live with a quarter of U.S. customers — removing friction from <b>recipe discovery, meal planning, basket assembly</b>. Management frames this as accelerating total online grocery adoption, not just Instacart share.',
      'Price parity with in-store no longer a negotiation talking point — <b>consistent data on faster growth and retention</b> when retailers adopt it. Challenge reframed as retailer short-term margin vs long-term share.',
      '<b>Instaleap acquisition</b> moves international from concept to execution; existing fulfillment platform with retailer relationships in Europe and Latin America fits land-and-expand model.',
    ]},
  { q:'Q4 2025', date:'Feb 12, 2026', chg:+9.2,
    hl:[
      'Competition reframed as <b>tailwind for enterprise adoption</b> — Amazon\u2019s grocery expansion creates urgency for independent retailers to partner, and Instacart is the only player with both marketplace and enterprise.',
      'AI reframed as a <b>data compounding</b> story: physical operations (shoppers making replacements, scanning shelves) generate operational grocery data purely digital companies cannot acquire.',
      'Agentic commerce framing — native checkout integrations with <b>ChatGPT</b> "urgent to co-create what grocery looks like inside AI platforms."',
    ]},
  { q:'Q3 2025', date:'Nov 10, 2025', chg:+5.0,
    hl:[
      'Identity formally redefined: <b>"technology and enablement partner for the grocery industry"</b> not just marketplace. Enterprise platform with five pillars becomes the narrative center.',
      'Advertising Q4 guide flagged as <b>unsatisfactory</b>; double-digit return committed for next year with specific building blocks: on-platform formats, Carrot Ads expansion, Caper in-store ads, off-platform partnerships.',
      'International expansion concrete and near-term — taking existing enterprise products into markets with same retailer problems; commitment to <b>no marketplace buildout</b>, lean capital profile.',
    ]},
  { q:'Q2 2025', date:'Aug 7, 2025', chg:+3.7,
    hl:[
      'Instacart dominant by sales share among digital-first platforms <b>across basket sizes</b>; non-exclusive retailers plateau while Instacart grows.',
      'Single large brand pullback absorbed with healthy ad growth — <b>multi-year diversification effort validated</b>; same shock a year prior would have caused several-point deceleration.',
      'Large CPG pressure is <b>structural</b> — portfolio repositioning toward high-protein and away from sugar/alcohol — making brands systematically more cautious advertisers regardless of macro.',
    ]},
  { q:'Q1 2025', date:'May 1, 2025', chg:+13.6,
    hl:[
      'Macro and regulatory uncertainty (tariffs, SNAP cuts, ingredient regulations) creating advertiser caution, but <b>no platform behavior changes observed</b>.',
      'Small basket program captures genuinely <b>additive midweek fill-in orders</b> without pulling down large-basket weekly shop behavior.',
      'Carrot Ads network <b>self-reinforcing</b>: existing CPG demand validates the technology before pitching new retailers, unlike pure-play retail media vendors.',
    ]},
  { q:'Q4 2024', date:'Feb 25, 2025', chg:-12.3,
    hl:[
      '$10 minimum basket economical <b>only at Instacart\u2019s order density</b> — small orders batch on top of existing dense networks, making what competitors find unprofitable entirely viable.',
      'Affordability infrastructure reached coverage threshold; <b>recent cohort quality improvement now visible in data</b>, linking customer engagement directly to cumulative investment.',
      'AI moved from experimentation to operational infrastructure — continuous decade-long improvement in <b>replacements and found/fill rates</b> reflects proprietary operational data competitors cannot access.',
    ]},
  { q:'Q3 2024', date:'Nov 12, 2024', chg:-11.0,
    hl:[
      'Affordability programs convert price-sensitive users who show <b>better retention than average</b>, making price removal a customer quality tool not just market expansion.',
      '<b>Caper Carts reaching meaningful in-store penetration in months</b> rather than years, positioning the physical store as Instacart\u2019s next frontier.',
      'Restaurant and grocery treated as <b>one integrated platform</b> intentionally; separating them would misrepresent how restaurants drive value back into grocery.',
    ]},
  { q:'Q2 2024', date:'Aug 6, 2024', chg:+2.8,
    hl:[
      'Restaurant customers return more frequently for grocery and spend more; restaurant baskets <b>exceed Uber\u2019s platform average</b>, attributed to the family-skewed user base.',
      'Enterprise storefronts improve in-store order density \u2192 better batching \u2192 affordability reinvestment — a <b>flywheel marketplace competitors cannot replicate</b>.',
      'Emerging brands growing faster than platform and offsetting large brand pullback; the work is as much a <b>product problem</b> (self-serve tooling, ROI clarity) as a sales problem.',
    ]},
  { q:'Q1 2024', date:'May 8, 2024', chg:-3.7,
    hl:[
      '<b>Uber Eats restaurant partnership</b> creates habitual app usage; financial benefit shows up indirectly through grocery frequency and subscription adoption, not restaurant revenue.',
      'Large brand advertising pullback <b>concentrated in alcohol</b>; diversifying away from that concentration became the top strategic priority.',
      'Enterprise platform evolved into an <b>integrated suite</b> where retailers could access storefront, Caper Carts, FoodStorm, and Carrot Ads simultaneously.',
    ]},
  { q:'Q3 2023', date:'Nov 8, 2023', chg:-10.1,
    hl:[
      'Large basket grocery <b>defensible against restaurant delivery entrants</b> — converting small baskets into large ones is uniquely difficult and structural to who owns the category.',
      'Non-exclusive retailers actually <b>deepen their relationship</b> through enterprise products and higher-fee structures — exclusivity was never the strategy.',
      'Advertising growth softening was <b>mechanical</b> (lapping 2022 launches) not structural, with four long-term levers outlined to sustain growth.',
    ]},
];

// ─── KPIs & Financials (HISTORICAL ONLY, from the Summit DCF model) ──────────
// Annual; $ in USD millions, orders in millions. We deliberately use ACTUALS
// ONLY (FY2021–2025): the stored Summit DCF doesn't carry complete/reliable
// forecasts (several series leave future years blank), so we treat the DCF as a
// source of history, not projections. Source: Summit DCF for CART
// (GTV / ORD / TRANSACTION_REVENUE / ADVERTISING_REVENUE / EBITDA_ADJ).
var fB = function(v){ return v==null ? '—' : '$'+(v/1000).toFixed(1)+'B'; };
var fM = function(v){ return v==null ? '—' : Math.round(v)+'M'; };
// Chart metadata; the actual numbers live in FIN_DATA per period (annual / quarterly).
var FIN_META = {
  finGTV:    { label:'GTV',             unit:'$B', fmt:fB, type:'bar',   color:'#0AAD0A' },
  finORD:    { label:'Orders',          unit:'M',  fmt:fM, type:'bar',   color:'#3A7BD5' },
  finMix:    { label:'Revenue mix',     unit:'$B', fmt:fB, type:'stack', stackColors:{ Transaction:'#0AAD0A', Advertising:'#FF7009' } },
  finEbitda: { label:'Adjusted EBITDA', unit:'$B', fmt:fB, type:'bar',   color:'#7A8699' },
};
// Historical actuals from the Summit DCF (no forecasts). Annual FY21–25; quarterly 1Q22–1Q26.
var FIN_DATA = {
  annual: {
    labels:['2021','2022','2023','2024','2025'],
    finGTV:[24909,28826,31986,33646,37225],
    finORD:[223,263,295,302,339],
    finMix:{ Transaction:[1262,1935,2239,2420,2677], Advertising:[572,740,871,958,1079] },
    finEbitda:[null,207,641,885,1087],
  },
  quarterly: {
    labels:['1Q22','2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
    finGTV:[7391,7079,7080,7390,8092,7804,7832,8257,8319,8237,8303,8817,9122,9081,9170,9852,10288],
    finORD:[68,64,64,69,76,72,72,75,75,74,74,79,83,83,83,90,93],
    finMix:{ Transaction:[517,453,482,530,566,546,548,578,603,595,606,617,650,659,670,698,739], Advertising:[156,171,186,227,200,206,222,250,220,228,246,267,247,260,276,304,286] },
    finEbitda:[null,null,74,133,169,110,163,199,198,208,227,252,244,262,278,303,300],
  },
};
var FIN_PERIOD = 'annual';
var FIN_INTRO = 'Instacart\'s KPIs &amp; financials — <b>historical actuals</b> from the <b>Summit DCF model</b>. Toggle <b>Annual</b> (FY2021–2025) or <b>Quarterly</b> (1Q22–1Q26). Forecast years are excluded (the stored model\'s projections aren\'t complete/reliable), so this is reported history only.';
var FIN_NOTE  = 'GTV &amp; revenue in USD billions; orders in millions. Source: Summit DCF for CART (actuals). The <b>Transaction vs Advertising</b> split shows the high-margin ad engine rising as a share of revenue. Adj. EBITDA starts in 2022 (2021 pre-profitability). Reads from the model, not hand-typed.';
var C_AXIS='#8A93A0', C_GRID='#EEF2F7', _finCharts={};

// ─── Render helpers ──────────────────────────────────────────────────────────
function sec(title, inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function kpis(arr){ return '<div class="ov-kpis">'+arr.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>'; }).join('')+'</div>'; }
function snap(arr){ return '<div class="ov-snap">'+arr.map(function(p){ return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>'; }).join('')+'</div>'; }
function finCard(id, title, sub){
  return '<div class="ov-chart-card"><div class="ov-chart-t">'+esc(title)+' <span>'+esc(sub)+'</span></div>'+
    '<div class="ov-chart-wrap"><canvas id="'+id+'"></canvas></div><div class="ov-statline" id="stat-'+id+'"></div></div>';
}
function makeFin(id){
  var m=FIN_META[id]; var cv=document.getElementById(id); if(!cv) return;
  var D=FIN_DATA[FIN_PERIOD], labels=D.labels, datasets;
  if(m.type==='stack'){
    var st=D[id];
    datasets=Object.keys(st).map(function(name){ return { label:name, data:st[name], backgroundColor:m.stackColors[name], borderRadius:4, stack:'s', maxBarThickness:46 }; });
  } else {
    datasets=[{ data:D[id], backgroundColor:m.color, borderRadius:5, maxBarThickness:46 }];
  }
  _finCharts[id]=new Chart(cv.getContext('2d'), { type:'bar', data:{labels:labels, datasets:datasets},
    options:{ responsive:true, maintainAspectRatio:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{ display:m.type==='stack', position:'bottom', labels:{boxWidth:10,font:{size:10},color:C_AXIS} },
        tooltip:{ callbacks:{
          label:function(ctx){ return ' '+(m.type==='stack'?ctx.dataset.label+': ':'')+m.fmt(ctx.parsed.y); },
          footer:(m.type==='stack' ? function(items){ var t=0; items.forEach(function(i){ t+=i.parsed.y; }); return 'Total: '+m.fmt(t); } : undefined) } } },
      scales:{ x:{ stacked:m.type==='stack', grid:{display:false}, ticks:{color:C_AXIS,font:{size:10},maxRotation:0,autoSkip:true} },
               y:{ stacked:m.type==='stack', grid:{color:C_GRID}, ticks:{color:C_AXIS,font:{size:10},callback:m.fmt} } } }
  });
  var el=document.getElementById('stat-'+id); if(!el) return;
  var vals = m.type==='stack' ? labels.map(function(_,i){ var st=D[id]; return Object.keys(st).reduce(function(a,k){ return a+(st[k][i]||0); },0); }) : D[id];
  var idxs=[]; for(var i=0;i<vals.length;i++) if(vals[i]!=null && vals[i]!==0) idxs.push(i);
  if(idxs.length>=2){ var fi=idxs[0],li=idxs[idxs.length-1],a=vals[fi],z=vals[li], chg=(z/a-1)*100;
    el.innerHTML='<b>'+labels[fi]+'</b> '+m.fmt(a)+' &rarr; <b>'+labels[li]+'</b> '+m.fmt(z)+' &middot; <span class="'+(chg>=0?'pos':'neg')+'">'+(chg>=0?'+':'')+chg.toFixed(0)+'%</span>'; }
}
function renderFin(){ if (typeof Chart==='undefined') return; Object.keys(_finCharts).forEach(function(id){ try{_finCharts[id].destroy();}catch(e){} }); _finCharts={}; Object.keys(FIN_META).forEach(makeFin); }
function subDetailHtml(s){
  return '<div class="ov-sub-line"><b>What it is.</b> '+s.what+'</div>'+
    '<div class="ov-sub-mon"><b>How it monetizes:</b> '+s.monetizes+'</div>'+
    (s.products && s.products.length ? '<div class="ov-subh" style="margin-top:14px">Inside it</div><div class="ov-prod">'+s.products.map(function(p){ return '<div class="ov-prod-tile"><div class="ov-prod-n">'+esc(p.n)+'</div><div class="ov-prod-d">'+p.d+'</div></div>'; }).join('')+'</div>' : '')+
    (s.competition ? '<div class="ov-sub-comp"><b>Competition:</b> '+s.competition+'</div>' : '');
}
function pillarCards(segKey){
  var seg = SEGMENTS.filter(function(s){ return s.k===segKey; })[0]; if(!seg) return '';
  return '<div class="ov-cards ov-cards-2">'+seg.subs.map(function(s){
    return '<div class="ov-card ov-clickable" data-detail="sub:'+esc(s.k)+'">'+
      '<div class="ov-card-h"><span class="ov-card-n">'+esc(s.n)+'</span><span class="ov-chip">'+esc(s.rev)+'</span></div>'+
      '<div class="ov-card-s">'+s.what+'</div><div class="ov-more">How it monetizes ›</div></div>';
  }).join('')+'</div>';
}
function peersHtml(){
  return '<div class="ov-cards ov-cards-2">'+PEERS.map(function(p){
    return '<div class="ov-card ov-clickable" data-detail="peer:'+esc(p.k)+'">'+
      '<div class="ov-card-h"><span class="ov-card-n">'+esc(p.n)+'</span><span class="ov-chip">'+esc(p.k)+'</span></div>'+
      '<div class="ov-card-s">'+p.angle+'</div><div class="ov-more">Edge & gap ›</div></div>';
  }).join('')+'</div>';
}
function stratFlywheel(){
  var S=STRATEGY;
  var h='<style>'+
    '.stfw-thesis{background:linear-gradient(180deg,rgba(18,53,107,0.05),rgba(18,53,107,0.01));border:1px solid rgba(18,53,107,0.18);border-left:3px solid #12356B;border-radius:10px;padding:12px 15px;font-size:13px;line-height:1.55;color:var(--navy);margin:0 0 16px}.stfw-thesis b{font-weight:800}'+
    '.stfw-loop{display:flex;flex-wrap:wrap;align-items:stretch;gap:0}'+
    '.stfw-node{flex:1 1 150px;min-width:148px;background:#fff;border:1px solid var(--bdr);border-radius:10px;padding:11px 12px 10px;cursor:pointer;transition:.15s;position:relative;margin-top:9px}'+
    '.stfw-node:hover{border-color:#12356B;box-shadow:0 3px 12px rgba(18,53,107,0.10);transform:translateY(-2px)}'+
    '.stfw-n{position:absolute;top:-9px;left:11px;width:19px;height:19px;border-radius:50%;background:#12356B;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center}'+
    '.stfw-ic{font-size:19px;line-height:1;margin-bottom:5px}'+
    '.stfw-nm{font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:4px;line-height:1.2}'+
    '.stfw-so{font-size:11px;color:var(--mu);line-height:1.45}'+
    '.stfw-more{font-size:10.5px;font-weight:700;color:#12356B;margin-top:6px}'+
    '.stfw-arr{display:flex;align-items:center;justify-content:center;color:#C4CCD6;font-size:15px;font-weight:800;flex:0 0 18px}'+
    '.stfw-back{font-size:11.5px;color:var(--mu);text-align:center;margin-top:13px;font-style:italic}.stfw-back b{color:#0AAD0A;font-style:normal;font-weight:800}'+
  '</style>';
  h+='<div class="stfw-thesis">'+S.thesis+'</div><div class="stfw-loop">';
  S.loop.forEach(function(n,i){
    h+='<div class="stfw-node ov-clickable" data-detail="strat:'+n.k+'"><div class="stfw-n">'+(i+1)+'</div>'+
      '<div class="stfw-ic">'+n.ic+'</div><div class="stfw-nm">'+esc(n.n)+'</div>'+
      '<div class="stfw-so">'+n.so+'</div><div class="stfw-more">detail ›</div></div>';
    if(i<S.loop.length-1) h+='<div class="stfw-arr">→</div>';
  });
  h+='</div><div class="stfw-back">↺ The loop compounds: AI-driven demand and agentic checkout feed <b>more orders and data</b> back into step 1 — more ads, more enterprise reach, a wider moat.</div>';
  return h;
}
function hubHtml(){
  return '<div class="ov-hub"><div class="ov-hub-center">'+
    '<div class="ov-hub-box ov-clickable" data-detail="party:ic">🥕 Instacart</div><div class="ov-hub-stem"></div></div>'+
    '<div class="ov-hub-nodes">'+PARTIES.map(function(p){
      return '<div class="ov-hub-node ov-clickable" data-detail="party:'+p.k+'"><div class="ov-hub-ic">'+p.ic+'</div><div class="ov-hub-l">'+esc(p.l)+'</div><div class="ov-hub-s">'+esc(p.s)+'</div></div>';
    }).join('')+'</div></div>';
}
function flowHtml(){
  return '<div class="ov-flow" id="ovFlow">'+
    '<div class="ov-flow-nodes">'+FLOW_NODES.map(function(n){ return '<div class="ov-flow-node" data-node="'+n.k+'"><div class="ov-flow-ic">'+n.ic+'</div><div class="ov-flow-l">'+esc(n.l)+'</div></div>'; }).join('<span class="ov-flow-link">→</span>')+'</div>'+
    '<div class="ov-flow-stage"><span class="ov-flow-step" id="ovFlowStep">Setup</span><div class="ov-flow-cap" id="ovFlowCap">'+FLOW_STEPS[0].cap+'</div>'+
      '<div class="ov-flow-earn" id="ovFlowEarn" hidden></div></div>'+
    '<div class="ov-flow-ctrl">'+
      '<button class="ov-flow-btn" id="ovFlowPlay">▶ Play</button>'+
      '<button class="ov-flow-btn ov-flow-sec" id="ovFlowPrev">‹ Prev</button>'+
      '<button class="ov-flow-btn ov-flow-sec" id="ovFlowNext">Next ›</button>'+
      '<div class="ov-flow-dots" id="ovFlowDots">'+FLOW_STEPS.map(function(s,i){ return '<span class="ov-flow-dot'+(i===0?' on':'')+'" data-i="'+i+'"></span>'; }).join('')+'</div>'+
    '</div><div class="ov-flow-note">'+FLOW_NOTE+'</div></div>';
}

// ─── Earnings narrative: theme-based across 11 calls (Q3 2023 -> Q1 2026) ────
var CART_THEMES=[
  { theme:'Advertising — the margin engine, through its cycles',
    why:'The profit driver and the most-scrutinized line. Trace how the 2022-launch lapping and the CPG pullbacks got absorbed.',
    updates:[
      { q:'Q3 2023', items:['Ad-growth softening was <b>mechanical</b> (lapping the 2022 launches), not structural — four long-term levers outlined to sustain it.'] },
      { q:'Q1 2024', items:['The large-brand ad pullback was <b>concentrated in alcohol</b>; diversifying away from that concentration became the top priority.'] },
      { q:'Q2 2024', items:['<b>Emerging brands</b> grew faster than the platform, offsetting the large-brand pullback — as much a <b>product problem</b> (self-serve tooling, ROI clarity) as a sales one.'] },
      { q:'Q1 2025', items:['The <b>Carrot Ads</b> network is self-reinforcing: existing CPG demand validates the tech before pitching new retailers, unlike pure-play retail-media vendors.'] },
      { q:'Q2 2025', items:['A single large-brand pullback was <b>absorbed</b> with healthy ad growth — the multi-year diversification validated. Large-CPG caution is <b>structural</b> (repositioning toward protein, away from sugar/alcohol).'] },
      { q:'Q3 2025', items:['The Q4 ad guide was flagged <b>unsatisfactory</b>; a return to double-digit growth committed, with building blocks (on-platform formats, Carrot Ads, Caper in-store ads, off-platform partnerships).'] },
    ]},
  { theme:'Enterprise (Carrot) — from marketplace to platform',
    why:'The identity shift — turning retailers from potential competitors into customers, and reaching into the physical store.',
    updates:[
      { q:'Q3 2023', items:['Non-exclusive retailers actually <b>deepen</b> the relationship through enterprise products and higher-fee structures — exclusivity was never the strategy.'] },
      { q:'Q1 2024', items:['Enterprise evolved into an <b>integrated suite</b> — storefront, Caper Carts, FoodStorm and Carrot Ads accessible simultaneously.'] },
      { q:'Q3 2024', items:['<b>Caper Carts</b> reaching meaningful in-store penetration in months, not years — the physical store as the next frontier.'] },
      { q:'Q3 2025', items:['Identity formally redefined: a <b>“technology and enablement partner for the grocery industry,”</b> not just a marketplace. The enterprise platform (five pillars) becomes the narrative center.'] },
      { q:'Q4 2025', items:['Competition reframed as a <b>tailwind for enterprise adoption</b> — Amazon’s push creates urgency for independents to partner, and Instacart is the only player with both marketplace and enterprise.'] },
    ]},
  { theme:'Affordability & the density moat',
    why:'Removing price barriers is profitable only at Instacart’s order density — something competitors cannot replicate.',
    updates:[
      { q:'Q3 2024', items:['Affordability programs convert price-sensitive users who show <b>better-than-average retention</b> — a customer-quality tool, not just market expansion.'] },
      { q:'Q4 2024', items:['The <b>$10-minimum basket</b> is economical <b>only at Instacart’s order density</b> (small orders batch onto dense networks); cohort-quality improvement now visible in the data.'] },
      { q:'Q1 2025', items:['The small-basket program captures <b>additive midweek fill-in</b> orders without pulling down the large weekly-shop behavior.'] },
    ]},
  { theme:'AI & data compounding',
    why:'Physical operations generate grocery data a pure-digital rival cannot acquire — now moving into the product itself.',
    updates:[
      { q:'Q4 2024', items:['AI moved from experimentation to <b>operational infrastructure</b> — a decade of gains in replacements and found/fill rates from proprietary operational data.'] },
      { q:'Q4 2025', items:['AI reframed as a <b>data-compounding</b> story (shoppers scanning shelves generate data pure-digital firms cannot get); agentic commerce — native <b>ChatGPT</b> checkout integrations.'] },
      { q:'Q1 2026', items:['<b>Cart Assistant</b> live with ~a quarter of US customers — removing friction from discovery, meal planning and basket assembly; framed as growing <b>total online grocery</b>, not just Instacart share.'] },
    ]},
  { theme:'Restaurants & cross-category',
    why:'Restaurants drive frequency and spend back into the core grocery business.',
    updates:[
      { q:'Q1 2024', items:['The <b>Uber Eats</b> restaurant partnership creates habitual app usage; the benefit shows up through grocery frequency and subscription adoption, not restaurant revenue.'] },
      { q:'Q2 2024', items:['Restaurant customers return more frequently for grocery and spend more — restaurant baskets <b>exceed Uber’s platform average</b>, attributed to the family-skewed base.'] },
      { q:'Q3 2024', items:['Restaurant and grocery run as <b>one integrated platform</b> intentionally; separating them would misrepresent how restaurants drive value back into grocery.'] },
    ]},
  { theme:'The grocery moat, competition & international',
    why:'Why the large-basket category is defensible — and how Instacart exports the model abroad, capital-light.',
    updates:[
      { q:'Q3 2023', items:['<b>Large-basket grocery is defensible</b> against restaurant-delivery entrants — converting small baskets into large ones is uniquely difficult, and structural to who owns the category.'] },
      { q:'Q2 2025', items:['Instacart is <b>dominant by sales share</b> among digital-first platforms across basket sizes; non-exclusive retailers plateau while Instacart grows.'] },
      { q:'Q3 2025', items:['International expansion is concrete and near-term — taking existing enterprise products into markets with the same retailer problems, with <b>no marketplace buildout</b> (lean capital).'] },
      { q:'Q1 2026', items:['The <b>Instaleap acquisition</b> moves international from concept to execution — a fulfillment platform with retailer relationships in Europe and Latin America.'] },
    ]},
];

// ─── Supply Chain (Bloomberg SPLC, 29-Jun-2026) ─────────────────────────────
// The point: a company's suppliers reveal what it is BUILDING. Instacart serves
// grocers but spends on ad-tech + AI -> it is becoming an ad/data company. The tab
// teaches that one idea: the pivot is visible in who it does business with.
function supplyBody(){
  var groc=[['Kroger','KR','kroger.com'],['Albertsons','ACI','albertsons.com'],['HEB','','heb.com'],['Meijer','','meijer.com'],['Hy-Vee','','hy-vee.com'],['Wegmans','','wegmans.com'],['BJ\u2019s','BJ','bjs.com'],['Aldi','','aldi.us']];
  var tech=[['Roku','ROKU','roku.com'],['The Trade Desk','TTD','thetradedesk.com'],['PubMatic','PUBM','pubmatic.com'],['Snowflake','SNOW','snowflake.com'],['NVIDIA','NVDA','nvidia.com'],['Confluent','CFLT','confluent.io'],['Marqeta','MQ','marqeta.com'],['Twilio','TWLO','twilio.com']];
  var L=function(a){ return a.map(function(l){ return cartLogo(l[0],l[1],l[2]); }).join(''); };
  var h='<style>'+
    '.scx-thesis{font-size:14px;line-height:1.6;color:var(--navy);border-left:3px solid #12356B;padding:2px 0 2px 14px;margin:0 0 16px}.scx-thesis b{font-weight:800}'+
    '.scx-flow{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center;border:1px solid var(--bdr);border-radius:12px;padding:15px;background:#fff}@media(max-width:640px){.scx-flow{grid-template-columns:1fr}}'+
    '.scx-col-t{font-size:12px;font-weight:800;margin-bottom:2px}.scx-col-s{font-size:10.5px;color:var(--mu);margin-bottom:9px}'+
    '.scx-logos{display:flex;flex-wrap:wrap;gap:5px}'+
    '.csc-logo{width:36px;height:36px;border:1px solid var(--bdr);border-radius:8px;background:#fff;display:flex;align-items:center;justify-content:center;padding:5px}.csc-logo img{max-width:100%;max-height:100%;object-fit:contain}'+
    '.scx-col-tag{font-size:11px;color:var(--navy);font-weight:700;margin-top:9px;font-style:italic}'+
    '.scx-mid{text-align:center;padding:0 4px}.scx-mid-ic{font-size:26px;line-height:1}.scx-mid-t{font-size:12px;font-weight:800;color:var(--navy);margin-top:3px}.scx-mid-s{font-size:10px;color:var(--mu);line-height:1.3;margin-top:2px}'+
    '.scx-flow-cap{font-size:12px;color:var(--navy);line-height:1.55;margin:11px 2px 20px}.scx-flow-cap b{font-weight:800}'+
    '.scx-tbl-h{font-size:13px;font-weight:800;color:var(--navy);margin:0 0 7px}'+
    '.scx-tbl{width:100%;border-collapse:collapse;font-size:11.5px}'+
    '.scx-tbl th{text-align:left;font-size:9.5px;text-transform:uppercase;letter-spacing:.4px;color:var(--mu);padding:6px 8px;border-bottom:1px solid var(--bdr)}'+
    '.scx-tbl td{padding:7px 8px;border-bottom:1px solid var(--bdr);color:var(--navy)}.scx-tbl td:first-child{font-weight:800}'+
    '.scx-cap{font-size:11.5px;color:var(--navy);line-height:1.55;margin:9px 2px 4px}.scx-cap b{font-weight:800}'+
    '.scx-arc{margin:20px 0 6px}'+
    '.scx-arc-i{font-size:12.5px;color:var(--navy);line-height:1.5;padding:9px 0;border-bottom:1px solid var(--bdr)}'+
    '.scx-arc-k{display:inline-block;min-width:74px;font-weight:800;color:#12356B}'+
    '.scx-risk{font-size:12px;color:var(--navy);line-height:1.55;background:rgba(192,57,43,0.05);border-left:3px solid #C0392B;border-radius:8px;padding:10px 13px;margin-top:10px}.scx-risk b{font-weight:800}'+
  '</style>';
  h+='<div class="scx-thesis">A company\u2019s suppliers reveal what it is <b>building</b>. Instacart\u2019s <b>customers are grocers</b> \u2014 but it spends its money on <b>ad-tech and AI</b>. Read the two sides together and the story is one line: Instacart is becoming an <b>advertising-and-data company that happens to move groceries.</b></div>';
  h+='<div class="scx-flow">'+
    '<div><div class="scx-col-t" style="color:#0AAD0A">Customers \u2014 revenue in</div><div class="scx-col-s">The grocery industry \u00b7 ~90 banners</div><div class="scx-logos">'+L(groc)+'</div><div class="scx-col-tag">the old economy it serves</div></div>'+
    '<div class="scx-mid"><div class="scx-mid-ic">\ud83e\udd55</div><div class="scx-mid-t">Instacart</div><div class="scx-mid-s">owns nothing<br>in between</div></div>'+
    '<div><div class="scx-col-t" style="color:#3A7BD5">Suppliers \u2014 spend out</div><div class="scx-col-s">Ad-tech, cloud &amp; AI</div><div class="scx-logos">'+L(tech)+'</div><div class="scx-col-tag">the new economy it is building</div></div>'+
  '</div>';
  h+='<div class="scx-flow-cap">Its customers are grocers; its suppliers are <b>Roku, The Trade Desk, Snowflake and NVIDIA.</b> The pivot from delivery app to ad-and-data platform is not in the press release \u2014 <b>it is in who it does business with.</b></div>';
  h+='<div class="scx-tbl-h">Anchored to no one</div>';
  h+='<table class="scx-tbl"><thead><tr><th>Partner</th><th>Side</th><th>Rel. size</th><th>% of Instacart</th><th>% of them</th></tr></thead><tbody>'+
    '<tr><td>Sprouts</td><td>Customer</td><td>$4.27M</td><td>0.12% of revenue</td><td>0.08% of their cost</td></tr>'+
    '<tr><td>Roku</td><td>Supplier</td><td>$4.09M</td><td>0.36% of cost</td><td>0.08% of their revenue</td></tr>'+
    '<tr><td>L\u2019Or\u00e9al</td><td>Supplier</td><td>$2.62M</td><td>0.27% of cost</td><td>&lt;0.01% of their revenue</td></tr>'+
    '<tr><td>Scotts Miracle-Gro</td><td>Supplier</td><td>$0.60M</td><td>0.05% of cost</td><td>0.04% of their revenue</td></tr>'+
  '</tbody></table>';
  h+='<div class="scx-cap">In every relationship that can be measured, Instacart is a rounding error \u2014 <b>and so is the partner.</b> Connective tissue for the whole industry, dependent on nobody. The strength: no single customer can sink it. The weakness: <b>no pricing power</b> \u2014 which is precisely why it must earn its money on <b>ads and data</b>, not the delivery fee.</div>';
  h+='<div class="scx-arc">'+
    '<div class="scx-arc-i"><span class="scx-arc-k">Was</span>a fragile middleman \u2014 when <b>Whole Foods left in 2019</b>, it hurt.</div>'+
    '<div class="scx-arc-i"><span class="scx-arc-k">Now</span>spread across ~90 banners, material to none \u2014 that single-customer dependency is largely gone.</div>'+
    '<div class="scx-arc-i"><span class="scx-arc-k">Becoming</span>an <b>ad &amp; data platform</b> \u2014 the supplier side is where it invests, and where the value now accrues.</div>'+
  '</div>';
  h+='<div class="scx-risk">The one risk the map still holds: a <b>top-5 banner exit</b> would be material volume \u2014 the Whole-Foods scenario at larger scale. It is the tail the grocery side never fully sheds. (That GTV concentration is inference from retailer scale, not a Bloomberg figure.)</div>';
  h+='<div class="ov-fynote" style="margin-top:10px"><span class="ave-subh-note">Source: Bloomberg SPLC, 29-Jun-2026 \u2014 138 named relationships; sizes are the four Bloomberg discloses.</span></div>';
  return h;
}

// Logo chip — CSP-safe chain: parqet-by-ticker -> Clearbit-by-domain -> Google favicon.
function cartLogo(name, ticker, domain){
  var primary = ticker ? 'https://assets.parqet.com/logos/symbol/'+ticker : 'https://logo.clearbit.com/'+domain;
  var clear = 'https://logo.clearbit.com/'+domain;
  var fav = 'https://www.google.com/s2/favicons?domain='+domain+'&sz=64';
  var onerr = "this.onerror=function(){this.onerror=null;this.src='"+fav+"'};this.src='"+clear+"'";
  return '<div class="csc-logo" title="'+esc(name)+'"><img src="'+primary+'" alt="'+esc(name)+'" loading="lazy" onerror="'+onerr+'"></div>';
}

function callsBody(){
  var h='<p class="ov-lede">The narrative threads across <b>11 earnings calls</b> (Q3 2023 → Q1 2026) — organized by <b>theme</b>, chronological within each, so you can trace how each story evolved. Tap any theme.</p>';
  h+='<div class="lpb-acc" id="caCallsAcc">';
  CART_THEMES.forEach(function(ct,i){
    h+='<div class="lpb-acc-item">'+
      '<button type="button" class="lpb-acc-h"><span>'+esc(ct.theme)+'</span><span class="lpb-acc-ic">+</span></button>'+
      '<div class="lpb-acc-body"><p style="font-size:12px;color:var(--mu);margin:0 0 10px;font-style:italic">'+esc(ct.why)+'</p>'+
      ct.updates.map(function(u){ return '<div style="margin-bottom:10px"><span class="ov-chip" style="margin-right:6px">'+esc(u.q)+'</span><ul class="ov-bullets" style="margin-top:4px">'+u.items.map(function(it){return '<li>'+it+'</li>';}).join('')+'</ul></div>'; }).join('')+
      '</div></div>';
  });
  h+='</div>';
  h+='<div class="ov-fynote" style="margin-top:12px">Sources: Instacart Q3 2023–Q1 2026 earnings calls & shareholder letters via Quartr. Highlights are qualitative and contemporaneous.</div>';
  return h;
}

// The profit truth: advertising revenue is ~the size of the entire company Adj. EBITDA.
function driverHero(){
  var h='<style>'+
    '.dvh{background:linear-gradient(180deg,rgba(255,112,9,0.05),rgba(255,112,9,0.015));border:1px solid rgba(255,112,9,0.28);border-radius:12px;padding:16px 18px;margin:2px 0 16px}'+
    '.dvh-eqrow{display:flex;align-items:stretch;gap:12px;flex-wrap:wrap}'+
    '.dvh-tile{flex:1 1 200px;border:1px solid var(--bdr);border-radius:10px;padding:12px 14px;background:#fff}'+
    '.dvh-tile.ad{border-top:3px solid #FF7009}.dvh-tile.eb{border-top:3px solid #12356B}'+
    '.dvh-big{font-size:26px;font-weight:800;line-height:1;margin-bottom:5px}'+
    '.dvh-tile.ad .dvh-big{color:#FF7009}.dvh-tile.eb .dvh-big{color:#12356B}'+
    '.dvh-lbl{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.dvh-sm{font-size:11px;color:var(--mu);margin-top:3px;line-height:1.4}'+
    '.dvh-approx{display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;color:#8A93A0;flex:0 0 24px}'+
    '.dvh-say{font-size:12.5px;color:var(--navy);line-height:1.55;margin:13px 0 13px}.dvh-say b{font-weight:800}'+
    '.dvh-barlbl{font-size:11px;font-weight:700;color:var(--mu);margin-bottom:5px}'+
    '.dvh-bar{height:27px;border-radius:6px;overflow:hidden;display:flex}'+
    '.dvh-seg{display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;white-space:nowrap}'+
    '.dvh-tx{background:#0AAD0A;opacity:.9}.dvh-ad2{background:#FF7009}'+
    '.dvh-arrow{font-size:11px;font-weight:800;color:#FF7009;text-align:right;margin-top:5px}'+
  '</style>';
  h+='<div class="dvh">'+
    '<div class="dvh-eqrow">'+
      '<div class="dvh-tile ad"><div class="dvh-big">$1.08B</div><div class="dvh-lbl">Advertising revenue</div><div class="dvh-sm">~29% of revenue · earned on ~3% of GTV · ~100% gross margin</div></div>'+
      '<div class="dvh-approx">≈</div>'+
      '<div class="dvh-tile eb"><div class="dvh-big">$1.09B</div><div class="dvh-lbl">Adjusted EBITDA</div><div class="dvh-sm">the entire company’s annual profit · FY2025</div></div>'+
    '</div>'+
    '<div class="dvh-say">Instacart’s <b>advertising line is about the size of its entire profit.</b> The delivery/transaction business roughly covers its own cost to run — so the high-margin ad layer drops through as, in effect, <b>the whole company’s profit.</b> The number to watch is the <b>ad attach rate</b>, not GTV.</div>'+
    '<div class="dvh-barlbl">Where every $1 of revenue comes from</div>'+
    '<div class="dvh-bar"><div class="dvh-seg dvh-tx" style="width:71%">Transaction 71¢</div><div class="dvh-seg dvh-ad2" style="width:29%">Advertising 29¢</div></div>'+
    '<div class="dvh-arrow">↑ that 29¢ of advertising ≈ the entire company’s profit</div>'+
  '</div>';
  return h;
}
// Instacart+ membership (real perks, verified) — the loyalty layer that feeds the flywheel.
function membershipViz(){
  var perks=[
    { ic:'🚚', h:'$0 delivery fee', d:'On grocery & retail orders $10+ (Costco $35+, eligible restaurants $25+). Service fees still apply.' },
    { ic:'📺', h:'Peacock Premium', d:'A full Peacock Premium streaming plan bundled in at no extra cost.' },
    { ic:'💵', h:'2% Credit Back', d:'On eligible orders over $250 — rewards the large weekly shop.' },
    { ic:'👪', h:'Shared with 4', d:'Add up to four household members to one membership (Family Carts).' },
    { ic:'📖', h:'NYT Cooking', d:'One year of NYT Cooking free (annual members).' },
  ];
  var h='<style>'+
    '.mem{border:1px solid var(--bdr);border-radius:12px;overflow:hidden}'+
    '.mem-hd{display:flex;align-items:center;gap:14px;flex-wrap:wrap;background:linear-gradient(135deg,#0AAD0A,#0a8f0a);color:#fff;padding:14px 18px}'+
    '.mem-badge{font-size:16px;font-weight:800;letter-spacing:-.2px}'+
    '.mem-price{font-size:13px;font-weight:700;opacity:.96}.mem-price b{font-size:15px}'+
    '.mem-snap{font-size:11px;opacity:.9;margin-left:auto}'+
    '.mem-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1px;background:var(--bdr)}'+
    '.mem-cell{background:#fff;padding:12px 13px}'+
    '.mem-ic{font-size:17px;margin-bottom:5px}'+
    '.mem-h{font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:3px}'+
    '.mem-d{font-size:11px;color:var(--mu);line-height:1.45}'+
    '.mem-why{background:rgba(10,173,10,0.05);border-top:1px solid var(--bdr);padding:11px 15px;font-size:12px;color:var(--navy);line-height:1.55}.mem-why b{font-weight:800}'+
  '</style>';
  h+='<div class="mem"><div class="mem-hd"><span class="mem-badge">Instacart+</span>'+
    '<span class="mem-price"><b>$99</b>/yr &nbsp;·&nbsp; or <b>$9.99</b>/mo</span>'+
    '<span class="mem-snap">SNAP participants: $4.99/mo (50% off)</span></div>'+
    '<div class="mem-grid">'+perks.map(function(pk){ return '<div class="mem-cell"><div class="mem-ic">'+pk.ic+'</div><div class="mem-h">'+esc(pk.h)+'</div><div class="mem-d">'+pk.d+'</div></div>'; }).join('')+'</div>'+
    '<div class="mem-why"><b>Why it matters:</b> members order <b>more often and with larger baskets</b> — more GTV, and more ad inventory per household. Instacart+ is the loyalty layer that deepens the flywheel; the Chase and Mastercard co-brand bundles quietly widen the funnel. <i>(Note: the old Instacart+ service-fee discount was removed on 1 Mar 2025 — the value prop is now delivery + perks, not lower service fees.)</i></div></div>';
  return h;
}
// The density moat: affordability is profitable ONLY at Instacart's order density.
function densityMoat(){
  var steps=[
    { ic:'🛒', h:'Many small, fill-in orders', d:'The $10-minimum basket and midweek top-ups — orders rivals treat as unprofitable.' },
    { ic:'🧺', h:'Batched onto dense routes', d:'They ride on top of an already-dense delivery network, so incremental cost per order is tiny.' },
    { ic:'✅', h:'Profitable only here', d:'What competitors lose money on, Instacart can serve — and price-sensitive cohorts retain better than average.' },
  ];
  var h='<style>'+
    '.dmo{display:flex;flex-wrap:wrap;align-items:stretch;gap:0}'+
    '.dmo-s{flex:1 1 170px;min-width:160px;background:#fff;border:1px solid var(--bdr);border-radius:10px;padding:12px 13px}'+
    '.dmo-ic{font-size:19px;margin-bottom:5px}'+
    '.dmo-h{font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:4px}'+
    '.dmo-d{font-size:11px;color:var(--mu);line-height:1.45}'+
    '.dmo-a{display:flex;align-items:center;justify-content:center;color:#C4CCD6;font-size:16px;font-weight:800;flex:0 0 20px}'+
    '.dmo-cap{font-size:11.5px;color:var(--mu);margin-top:11px;line-height:1.5;font-style:italic}.dmo-cap b{color:#0AAD0A;font-style:normal;font-weight:800}'+
  '</style><div class="dmo">';
  steps.forEach(function(st,i){ h+='<div class="dmo-s"><div class="dmo-ic">'+st.ic+'</div><div class="dmo-h">'+esc(st.h)+'</div><div class="dmo-d">'+st.d+'</div></div>'; if(i<steps.length-1) h+='<div class="dmo-a">→</div>'; });
  h+='</div><div class="dmo-cap">Affordability is not a giveaway — it is a <b>weapon that only Instacart can afford to wield</b>, because density is the one thing a new entrant cannot buy.</div>';
  return h;
}
// ── Advertising: growth+margin chart, closed-loop, resilience, competitive pos ──
function adGrowthChart(){
  return '<div class="ov-chart-wrap ovt-vs-wrap"><canvas id="adChart"></canvas></div><div class="ov-statline" id="adStat"></div>';
}
function buildAdChart(){
  var cv=document.getElementById('adChart'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  var ex=Chart.getChart?Chart.getChart(cv):null; if(ex){ ex.destroy(); }
  var Q=FIN_DATA.quarterly, labels=Q.labels, ad=Q.finMix.Advertising, tx=Q.finMix.Transaction;
  var pct=ad.map(function(a,i){ return +(a/(a+tx[i])*100).toFixed(1); });
  _finCharts.ad=new Chart(cv.getContext('2d'),{ data:{ labels:labels, datasets:[
    { type:'bar', label:'Advertising revenue ($M)', data:ad, backgroundColor:'#FF7009', borderRadius:4, maxBarThickness:24, yAxisID:'y', order:2 },
    { type:'line', label:'Ads % of revenue', data:pct, borderColor:'#12356B', backgroundColor:'#12356B', borderWidth:2, tension:.3, pointRadius:0, yAxisID:'y1', order:1 } ]},
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{display:true,position:'bottom',labels:{boxWidth:10,font:{size:10},color:C_AXIS}},
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.yAxisID==='y1' ? ' Ads % of revenue: '+ctx.parsed.y+'%' : ' Advertising: $'+ctx.parsed.y+'M'; } } } },
      scales:{ x:{grid:{display:false},ticks:{color:C_AXIS,font:{size:9},maxRotation:0,autoSkip:true}},
        y:{position:'left',grid:{color:C_GRID},ticks:{color:C_AXIS,font:{size:10},callback:function(v){return '$'+v+'M';}}},
        y1:{position:'right',grid:{display:false},min:0,max:40,ticks:{color:'#12356B',font:{size:10},callback:function(v){return v+'%';}}} } }
  });
  var st=document.getElementById('adStat');
  if(st){ st.innerHTML='<b>1Q22</b> $'+ad[0]+'M ('+pct[0]+'% of revenue) &rarr; <b>1Q26</b> $'+ad[ad.length-1]+'M ('+pct[pct.length-1]+'%) &middot; advertising has climbed from <b>~23%</b> toward <b>~30%</b> of revenue at ~100% gross margin — the mix shift that turned Instacart profitable.'; }
}
function closedLoop(){
  return '<style>'+
    '.cl-wrap{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:560px){.cl-wrap{grid-template-columns:1fr}}'+
    '.cl-col{border:1px solid var(--bdr);border-radius:11px;padding:13px 14px}'+
    '.cl-col.win{border-color:rgba(255,112,9,0.4);background:rgba(255,112,9,0.04)}'+
    '.cl-t{font-size:12.5px;font-weight:800;margin-bottom:9px}.cl-col .cl-t{color:var(--mu)}.cl-col.win .cl-t{color:#FF7009}'+
    '.cl-step{display:flex;gap:8px;align-items:flex-start;font-size:11.5px;color:var(--navy);line-height:1.45;margin:7px 0}'+
    '.cl-num{flex:0 0 17px;height:17px;border-radius:50%;background:var(--bg-soft,#EEF2F7);color:var(--mu);font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;margin-top:1px}'+
    '.cl-col.win .cl-num{background:#FF7009;color:#fff}'+
    '.cl-cap{font-size:11.5px;color:var(--mu);margin-top:11px;line-height:1.55}.cl-cap b{color:var(--navy);font-weight:800}'+
  '</style><div class="cl-wrap">'+
    '<div class="cl-col"><div class="cl-t">Open-web / display ad</div>'+
      '<div class="cl-step"><span class="cl-num">1</span>A shopper sees a banner on some website or app.</div>'+
      '<div class="cl-step"><span class="cl-num">2</span>Maybe they buy — later, on another device, in a physical store.</div>'+
      '<div class="cl-step"><span class="cl-num">3</span>Attribution is <b>modeled guesswork</b> (cookies, panels) — and cookies are dying.</div></div>'+
    '<div class="cl-col win"><div class="cl-t">Instacart retail media</div>'+
      '<div class="cl-step"><span class="cl-num">1</span>A sponsored product appears <b>while the shopper is buying groceries</b>.</div>'+
      '<div class="cl-step"><span class="cl-num">2</span>They add it to cart and check out — <b>the same session</b>.</div>'+
      '<div class="cl-step"><span class="cl-num">3</span>Attribution is <b>exact</b>: the ad and the sale are one closed loop.</div></div>'+
  '</div><div class="cl-cap">Because the ad and the purchase are the <b>same event</b>, a brand can prove return-on-ad-spend to the cent. That is why CPG budgets migrate here — and why every order makes the network measurably more valuable.</div>';
}
function adResilience(){
  var levers=['On-platform ad formats','Carrot Ads (off Instacart)','Caper in-store ads','Off-platform partnerships'];
  return '<div class="ov-callout" style="border-left:3px solid #FF7009">'+
    '<div style="font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:6px">The resilience test — Q2 2025</div>'+
    '<div style="font-size:12px;color:var(--navy);line-height:1.6">A single <b>large CPG brand cut its ad spend</b>. A year earlier that shock would have knocked several points off ad growth; this time it was <b>fully absorbed</b> — emerging brands now grow faster than the platform, so the multi-year push to <b>diversify away from a handful of big advertisers</b> (and away from alcohol concentration) had done its job. Large-CPG caution is <b>structural</b> — portfolios repositioning toward protein, away from sugar and alcohol — not a passing macro dip.</div>'+
    '<div style="font-size:11.5px;color:var(--mu);margin:11px 0 5px">After flagging the Q4-2025 ad guide as <b>unsatisfactory</b>, management committed to a return to double-digit growth via four levers:</div>'+
    '<div>'+levers.map(function(l){ return '<span class="ov-chip" style="margin:3px 5px 0 0;background:rgba(255,112,9,0.10);color:#FF7009">'+esc(l)+'</span>'; }).join('')+'</div></div>';
}
function adCompete(){
  var rows=[
    { n:'Instacart', reach:'Point-of-purchase · 1,800+ banners', gro:'✓', cl:'✓', xr:'✓ Carrot Ads', win:true },
    { n:'Amazon Ads', reach:'Massive · general merchandise', gro:'~', cl:'✓', xr:'✗ Amazon only', win:false },
    { n:'Walmart Connect', reach:'Huge · own stores', gro:'~', cl:'✓', xr:'✗ Walmart only', win:false },
    { n:'Kroger Precision Mktg', reach:'Large grocer', gro:'✓', cl:'✓', xr:'✗ Kroger only', win:false },
  ];
  var h='<style>'+
    '.adc{width:100%;border-collapse:collapse;font-size:11.5px}'+
    '.adc th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.4px;color:var(--mu);padding:6px 8px;border-bottom:1px solid var(--bdr)}'+
    '.adc td{padding:8px;border-bottom:1px solid var(--bdr);color:var(--navy)}'+
    '.adc tr.win td{background:rgba(255,112,9,0.05)}.adc tr.win td:first-child{font-weight:800;color:#FF7009}'+
    '.adc-c{text-align:center;font-weight:800}'+
  '</style><table class="adc"><thead><tr><th>Network</th><th>Reach</th><th class="adc-c">Grocery-native</th><th class="adc-c">Closed-loop</th><th>Cross-retailer</th></tr></thead><tbody>';
  rows.forEach(function(r){ h+='<tr class="'+(r.win?'win':'')+'"><td>'+esc(r.n)+'</td><td>'+esc(r.reach)+'</td><td class="adc-c">'+r.gro+'</td><td class="adc-c">'+r.cl+'</td><td>'+r.xr+'</td></tr>'; });
  h+='</tbody></table><div class="ov-fynote" style="margin-top:9px">Instacart is the only grocery-native, closed-loop network that spans <b>many</b> retailers — and via <b>Carrot Ads</b> it powers rivals’ own retail-media too, taking a cut of the whole category’s growth, not just its own app.</div>';
  return h;
}
// ── Enterprise: the competitor->customer flip + the Carrot five-pillar platform ──
function entFlip(){
  return '<style>'+
    '.flip-prem{background:rgba(58,123,213,0.06);border:1px solid rgba(58,123,213,0.22);border-radius:10px;padding:11px 14px;font-size:12.5px;color:var(--navy);line-height:1.5;margin-bottom:12px;text-align:center}.flip-prem b{font-weight:800}'+
    '.flip-two{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:560px){.flip-two{grid-template-columns:1fr}}'+
    '.flip-c{border:1px solid var(--bdr);border-radius:11px;padding:13px 14px}'+
    '.flip-c.bad{border-color:rgba(192,57,43,0.35);background:rgba(192,57,43,0.035)}'+
    '.flip-c.win{border-color:rgba(58,123,213,0.4);background:rgba(58,123,213,0.05)}'+
    '.flip-h{font-size:12px;font-weight:800;margin-bottom:7px}.flip-c.bad .flip-h{color:#C0392B}.flip-c.win .flip-h{color:#3A7BD5}'+
    '.flip-p{font-size:11.5px;color:var(--navy);line-height:1.5}'+
    '.flip-res{margin-top:12px;font-size:12.5px;color:var(--navy);line-height:1.55;text-align:center;font-weight:700}.flip-res b{color:#3A7BD5;font-weight:800}'+
  '</style>'+
    '<div class="flip-prem">Every large retailer wants <b>its own</b> online store, fulfillment, ads and in-store tech — but few can build it well.</div>'+
    '<div class="flip-two">'+
      '<div class="flip-c bad"><div class="flip-h">Without Instacart — the threat</div><div class="flip-p">The retailer builds it in-house or leaves the marketplace for a rival. Instacart <b>loses the volume</b> and inherits a <b>competitor</b> it helped create.</div></div>'+
      '<div class="flip-c win"><div class="flip-h">With Instacart Platform — the flip</div><div class="flip-p">Instacart powers the whole thing <b>white-label</b>. The retailer keeps its customer; Instacart <b>earns tech fees</b> and embeds itself in the retailer’s daily operations.</div></div>'+
    '</div>'+
    '<div class="flip-res">→ A would-be competitor becomes a <b>paying, sticky customer.</b> Lower take than the Marketplace, but it <b>defends the entire base.</b></div>';
}
function carrotPillars(){
  var pill=[
    { ic:'🛍️', n:'Storefront', d:'A white-label e-commerce site & app the retailer brands as its own.' },
    { ic:'🚚', n:'Fulfillment', d:'Picking & delivery as a service on the retailer’s own orders.' },
    { ic:'🎯', n:'Carrot Ads', d:'The retailer runs its own retail-media network on Instacart’s ad tech.' },
    { ic:'📊', n:'Insights & Data', d:'Measurement and analytics on what sells, and why.' },
    { ic:'🛒', n:'Connected Stores', d:'In-store tech: Caper smart carts, e-shelf labels, scan-and-pay.' },
  ];
  var h='<style>'+
    '.cpl{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}'+
    '.cpl-c{border:1px solid var(--bdr);border-top:2px solid #3A7BD5;border-radius:10px;padding:11px 12px}'+
    '.cpl-ic{font-size:18px;margin-bottom:5px}'+
    '.cpl-n{font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:4px}'+
    '.cpl-d{font-size:11px;color:var(--mu);line-height:1.45}'+
  '</style><div class="cpl">'+pill.map(function(pk){ return '<div class="cpl-c"><div class="cpl-ic">'+pk.ic+'</div><div class="cpl-n">'+esc(pk.n)+'</div><div class="cpl-d">'+pk.d+'</div></div>'; }).join('')+'</div>';
  return h;
}
// Anatomy of one order — a visual, not a text wall.
function orderAnatomy(){
  var h='<style>'+
    '.oa-lbl{font-size:11px;font-weight:700;color:var(--mu);margin-bottom:5px}'+
    '.oa-bar{height:30px;border-radius:6px;overflow:hidden;display:flex}'+
    '.oa-seg{display:flex;align-items:center;justify-content:center;font-size:10.5px;font-weight:800;color:#fff;white-space:nowrap;overflow:hidden;padding:0 5px}'+
    '.oa-groc{background:#B8C0CA}.oa-take{background:#0AAD0A}'+
    '.oa-two{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}@media(max-width:520px){.oa-two{grid-template-columns:1fr}}'+
    '.oa-c{border:1px solid var(--bdr);border-radius:9px;padding:10px 12px;font-size:11.5px;line-height:1.5;color:var(--navy)}.oa-c b{font-weight:800}'+
    '.oa-plus{border-left:3px solid #FF7009}.oa-minus{border-left:3px solid #C0392B}'+
    '.oa-say{font-size:12px;color:var(--navy);margin-top:12px;line-height:1.5;font-weight:700}.oa-say b{font-weight:800}'+
  '</style>'+
    '<div class="oa-lbl">One ~$110 order (its GTV), and where Instacart’s cut sits</div>'+
    '<div class="oa-bar"><div class="oa-seg oa-groc" style="width:92%">Groceries — the retailer keeps its margin</div><div class="oa-seg oa-take" style="width:8%">Take ~8%</div></div>'+
    '<div class="oa-two">'+
      '<div class="oa-c oa-plus"><b>+ Ad layer</b> — a few % of GTV, sitting on top at ~100% margin. This is the <b>profit</b>.</div>'+
      '<div class="oa-c oa-minus"><b>− Shopper pay</b> — the largest cost of the order (fulfillment), plus payments &amp; support.</div>'+
    '</div>'+
    '<div class="oa-say">Thin per order — <b>scale, the ad layer, and bigger member baskets</b> are what make it work.</div>';
  return h;
}
// Who pays Instacart — compact, one line each.
function whoPays(){
  var w=[
    { ic:'🛒', n:'Consumers', d:'Households — especially larger-basket, weekly and Instacart+ shoppers. Pay fees + tips.' },
    { ic:'🏬', n:'Retailers', d:'~1,800 banners / 85,000+ stores. Pay for demand & fulfillment, or for Enterprise tech.' },
    { ic:'🏷️', n:'CPG advertisers', d:'6,000+ brands paying to be found at the shelf — the highest-margin customer.' },
    { ic:'🚗', n:'Shoppers', d:'Not a payer — the gig supply Instacart pays to shop & deliver. Density is the asset.' },
  ];
  var h='<style>'+
    '.wp{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}'+
    '.wp-c{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--bdr);border-radius:9px;padding:10px 12px}'+
    '.wp-ic{font-size:18px;line-height:1;flex:none;margin-top:1px}'+
    '.wp-n{font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:2px}'+
    '.wp-d{font-size:11px;color:var(--mu);line-height:1.45}'+
  '</style><div class="wp">'+w.map(function(x){ return '<div class="wp-c"><div class="wp-ic">'+x.ic+'</div><div><div class="wp-n">'+esc(x.n)+'</div><div class="wp-d">'+esc(x.d)+'</div></div></div>'; }).join('')+'</div>';
  return h;
}
function html(c){
  var h = '<div class="ov ov-cart" data-brand="CART">';

  h += '<div class="ov-subtabs">'+
    '<button class="ov-subtab active" data-catab="overview">Overview</button>'+
    '<button class="ov-subtab" data-catab="marketplace">Marketplace</button>'+
    '<button class="ov-subtab" data-catab="advertising">Advertising</button>'+
    '<button class="ov-subtab" data-catab="enterprise">Enterprise</button>'+
    '<button class="ov-subtab" data-catab="supply">Supply Chain</button>'+
    '<button class="ov-subtab" data-catab="fin">Financials</button>'+
    '<button class="ov-subtab" data-catab="valuation">Valuation</button>'+
    '<button class="ov-subtab" data-catab="calls">Earnings Calls</button>'+
  '</div>';

  // ══ PANE 1 — Overview ══
  h += '<div class="ov-pane active" data-capane="overview">';
  h += snap(SNAPSHOT);
  h += '<p class="ov-lede">'+DESC+'</p>';
  h += kpis(KPIS);
  h += '<div class="ov-asof">'+AS_OF+'</div>';
  h += driverHero();
  h += sec('How Instacart Makes Money',
    bullets(HOW_MONEY)+
    '<div class="ov-diagram-cap" style="margin:4px 0 10px"><b>The multi-sided network.</b> Tap any party for its role.</div>'+hubHtml()+flowHtml());
  h += sec('Revenue Structure — Three Motions',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">Reported as <b>Transaction</b> + <b>Advertising &amp; other</b> revenue; shown here as the three strategic motions. <b>Tap any line</b> for detail.</div>'+
    '<div class="ov-segmap">'+SEGMENTS.map(function(seg){
      return '<div class="ov-segpanel" style="border-top-color:'+seg.accent+'">'+
        '<div class="ov-segpanel-h"><div class="ov-segpanel-n">'+esc(seg.n)+'</div><div class="ov-segpanel-m">'+esc(seg.rev)+' · '+esc(seg.margin)+'</div></div>'+
        '<div class="ov-segnodes">'+seg.subs.map(function(s){ return '<div class="ov-segnode ov-clickable" data-detail="sub:'+esc(s.k)+'"><span class="ov-segnode-n">'+esc(s.n)+'</span><span class="ov-segnode-r">'+esc(s.rev)+'</span></div>'; }).join('')+'</div></div>';
    }).join('')+'</div>');
  h += sec('Competitive Landscape',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">Instacart competes on <b>three fronts</b>: marketplace delivery (DoorDash, Uber), full-vertical grocery (Amazon, Walmart), and enterprise tech. <b>Tap any competitor</b> for its edge and gap vs Instacart.</div>'+
    peersHtml());
  h += sec('Strategy — the flywheel',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">Not a list of projects — a <b>self-reinforcing loop</b>: advertising profit funds the pivot from delivery app to grocery-industry tech platform, and each stage feeds the next. <b>Tap any stage.</b></div>'+
    stratFlywheel());
  h += sec('History & Milestones',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">From a 2012 grocery-delivery app to a multi-sided platform with advertising and enterprise software. <b>Tap any milestone</b> with "Read more" for detail.</div>'+
    '<div class="ov-timeline">'+TIMELINE.map(function(t,i){
      var more=t.d?'<div class="ov-tl-more">Read more ›</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':'';
      return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>';
    }).join('')+'</div>'+
    '<div class="ov-fynote" style="margin-top:6px">'+esc(TL_NOTE)+'</div>');
  h += '</div>'; // end overview

  // ══ PANE 2 — Marketplace ══
  h += '<div class="ov-pane" data-capane="marketplace">';
  h += '<p class="ov-lede">The <b>Marketplace</b> is the <b>demand + data engine</b> — Instacart owns the customer here, and that ownership is exactly what powers advertising and enterprise. It earns a take of <b>GTV</b> plus the <b>Instacart+</b> membership.</p>';
  h += sec('Instacart+ — the membership', membershipViz());
  h += sec('Anatomy of an order',
    '<div class="ov-corr-stats">'+UE_STATS.map(function(s){ return '<div class="ov-corr-stat"><div class="ov-corr-v">'+esc(s.v)+'</div><div class="ov-corr-l">'+esc(s.l)+'<br><span style="font-weight:400">'+esc(s.s)+'</span></div></div>'; }).join('')+'</div>'+
    '<div style="margin-top:14px">'+orderAnatomy()+'</div>');
  h += sec('The Density Moat — why affordability is a weapon here', densityMoat());
  h += sec('Who pays Instacart', whoPays());
  h += '</div>'; // end marketplace

  // ══ PANE 3 — Advertising ══
  h += '<div class="ov-pane" data-capane="advertising">';
  h += '<p class="ov-lede"><b>Advertising is the reason Instacart is profitable.</b> CPG brands pay to be discovered at the <b>point of purchase</b> — ~100% gross margin, and, as the Overview showed, roughly the size of the entire company\'s profit. Below: how big it has grown, why it converts, whether it is durable, and who it competes with.</p>';
  h += sec('The mix shift that made Instacart profitable',
    '<div class="ov-diagram-cap" style="margin:0 0 10px">Quarterly <b>advertising revenue</b> (orange bars) and <b>ads as a share of total revenue</b> (navy line). The share, not just the dollars, is the story.</div>'+
    adGrowthChart());
  h += sec('Why it converts — closed-loop attribution', closedLoop());
  h += sec('Is it durable? The resilience test', adResilience());
  h += sec('Where Instacart sits in retail media', adCompete());
  h += sec('The advertising flywheel',
    '<div class="ov-fly">'+AD_FLY.map(function(f){ return '<div class="ov-fly-item"><div class="ov-fly-num" style="background:#FF70091A;color:#FF7009">'+esc(f[0])+'</div><div class="ov-fly-h">'+esc(f[1])+'</div><div class="ov-fly-p">'+esc(f[2])+'</div></div>'; }).join('')+'</div>');
  h += sec('The ad products', pillarCards('ads'));
  h += '</div>'; // end advertising

  // ══ PANE 4 — Enterprise ══
  h += '<div class="ov-pane" data-capane="enterprise">';
  h += '<p class="ov-lede"><b>Instacart Platform (Enterprise)</b> is the pivot from a delivery app to <b>the grocery industry’s tech vendor</b>. Instacart sells the same technology that runs its own app to retailers, to power <b>their</b> e-commerce, fulfillment, ads and in-store tech — the retailer keeps the customer. Lower take than the Marketplace, but it is how Instacart makes itself indispensable.</p>';
  h += sec('The flip — turning a competitor into a customer', entFlip());
  h += sec('Carrot — the platform management frames as five pillars', carrotPillars());
  h += sec('From online to the aisle — Connected Stores',
    '<div class="ov-callout"><b>Caper smart carts</b> reached meaningful in-store penetration in <b>months, not years</b>. With electronic shelf labels and scan-and-pay, Instacart reaches into the <b>physical aisle</b> — not just delivery — and the store itself becomes new <b>ad inventory</b>. This is how the addressable market extends far beyond online grocery, where penetration is still only low-teens %.</div>');
  h += sec('The international arm — Instaleap',
    '<div class="ov-callout" style="border-left:3px solid #3A7BD5"><b>Enterprise, exported.</b> Instacart’s consumer Marketplace is US/Canada-only and brutally expensive to rebuild abroad. The Apr-2026 <b>Instaleap</b> acquisition gives it an instant base of ~100 retailers across ~30 countries to sell the enterprise tech into — <b>no marketplace, shopper network or brand to build</b>. Asset-light land-and-expand. (See the Strategy flywheel on the Overview.)</div>');
  h += '<div class="ov-fynote">Marketplace vs Enterprise, in one line: in the <b>Marketplace</b> Instacart owns the consumer and earns a full take + ads; in <b>Enterprise</b> the retailer owns the consumer and Instacart earns a smaller tech fee — <b>trading take rate for reach and stickiness.</b></div>';
  h += '</div>'; // end enterprise

  // ══ PANE 5 — Supply Chain (Bloomberg SPLC) ══
  h += '<div class="ov-pane" data-capane="supply">';
  h += supplyBody();
  h += '</div>'; // end supply pane

  // ══ PANE 6 — Financials (historical KPIs from the DCF) ══
  h += '<div class="ov-pane" data-capane="fin">';
  h += '<p class="ov-lede">'+FIN_INTRO+'</p>';
  h += '<div class="ov-fintog" id="ovFinTog"><button class="on" data-period="annual">Annual</button><button data-period="quarterly">Quarterly</button></div>';
  h += '<div class="ov-charts ov-charts-2">'+
    finCard('finGTV','GTV','$B')+
    finCard('finORD','Orders','M')+
    finCard('finMix','Revenue mix','Transaction vs Advertising · $B')+
    finCard('finEbitda','Adjusted EBITDA','$B')+
  '</div>';
  h += '<div class="ov-diagram-cap" style="margin-top:10px">'+FIN_NOTE+'</div>';
  h += '<div style="border-top:1px solid var(--bdr);margin:26px 0 0"></div>';
  h += '<div class="ov-sec-h ovt-store-h" style="margin-top:14px">Guidance vs. Reality — does Instacart beat its own guide?</div>';
  h += '<p class="ov-lede" style="margin:2px 0 12px">Instacart guides only two numbers each quarter — <b>GTV</b> (its top-line volume; a marketplace guides volume, not revenue) and <b>Adjusted EBITDA</b>. Each bar is the <b>range it guided</b>; the dot is what it <b>reported</b> (green = above the range). The pattern is a systematic <b>under-promise, over-deliver</b> — most extreme on profit.</p>';
  h += '<div class="guid-pills">'+['gtv','ebitda'].map(function(k){ return '<button type="button" class="cg-pill guid-pill'+(k===_cgMetric?' active':'')+'" data-cgm="'+k+'">'+esc(CGUIDE[k].label)+'</button>'; }).join('')+'</div>';
  h += '<div class="ov-chart-wrap ovt-vs-wrap"><canvas id="cgChart"></canvas></div>';
  h += '<div class="ave-subh-note" id="cgNote" style="margin:8px 2px 12px"></div>';
  h += '<div class="guid-tbl-wrap" id="cgTbl"></div>';
  h += '<div class="ov-foot">Guidance = the range issued for the upcoming quarter on the prior earnings call (Instacart shareholder letters / 8-K); reported = Summit actuals. The series <b>starts at Q4 2023</b> because that was Instacart’s first guidance as a public company — it <b>IPO’d in Sept 2023</b>, so no public guidance exists for 1Q–3Q23 (this is why it cannot reach back to 1Q23 like Uber/Lyft, public since 2019). That first Q4 2023 GTV was given as a <b>growth %</b>, not a $ range. 2Q26 is the current outstanding guide.</div>';
  h += '</div>'; // end fin pane

  // ══ PANE 6 — Earnings Calls ══
  h += '<div class="ov-pane" data-capane="valuation">'+CART_VAL.body()+'</div>';
  h += '<div class="ov-pane" data-capane="calls">';
  h += callsBody();
  h += '</div>'; // end calls pane

  h += '<div class="ov-foot">'+esc(SOURCES)+'</div>';
  h += '<div class="ov-modal-back" id="ovModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="ovModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="ovModalT"></div><div class="ov-modal-b" id="ovModalB"></div></div></div>';
  h += '</div>';
  return h;
}

// ─── Guidance vs. Reality: does Instacart beat its own guide? ────────────────
// Guided GTV ($M) + Adj. EBITDA ($M) ranges issued for the upcoming quarter, vs
// reported actuals (Summit dataset). Q4 2023 GTV was a growth-% guide only.
var CG_Q=['4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'];
var CGUIDE={
  gtv:{ label:'GTV', unit:'B',
    glo:[null,8000,8000,8100,8500,9000,8850,9000,9450,10250,10100],
    ghi:[null,8200,8150,8250,8650,9150,9000,9150,9600,10275,10250],
    act:[8257,8319,8237,8303,8817,9122,9081,9170,9852,10288,null],
    note:'Instacart under-promises the top line: reported GTV has cleared the <b>top</b> of the guided range in almost every quarter (Q4 2023 was a growth-% guide only). Modest guides, steady beats.' },
  ebitda:{ label:'Adj. EBITDA', unit:'M',
    glo:[165,150,180,205,230,220,240,260,285,280,290],
    ghi:[175,160,190,215,240,230,250,270,295,290,300],
    act:[199,198,208,227,252,244,262,278,303,300,null],
    note:'Here the sandbag is blatant: reported Adj. EBITDA has beaten the <b>TOP</b> of the guided range in <b>every quarter since the IPO</b> — the profitability ramp runs consistently ahead of what management guides.' },
};
var _cgMetric='gtv';
function cgFmt(u,v){ if(v==null) return '—'; return u==='B' ? '$'+(v/1000).toFixed(2)+'B' : '$'+Math.round(v)+'M'; }
function cgColor(a,lo,hi){ if(a==null) return '#B8C0CA'; if(lo==null) return '#8A93A0'; if(a>=hi) return '#16A34A'; if(a>=lo-(lo+hi)/2*0.004) return '#8A93A0'; return '#C0392B'; }
function cgLand(a,lo,hi){ if(a==null) return {t:'current guide',c:'guid-mut'}; if(lo==null) return {t:'growth-% guide',c:'guid-mut'}; var mid=(lo+hi)/2; if(a>=hi) return {t:'above range',c:'guid-up'}; if(a>=mid) return {t:'upper half',c:''}; if(a>=lo-mid*0.004) return {t:'in range',c:''}; return {t:'below range',c:'guid-dn'}; }
function buildCartGuide(){
  var cv=document.getElementById('cgChart'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  var _ex=Chart.getChart?Chart.getChart(cv):null; if(_ex){ _ex.destroy(); } _finCharts.cg=null;
  var g=CGUIDE[_cgMetric];
  var ds=[
    { type:'bar', label:'Guided range', order:2, maxBarThickness:30, borderSkipped:false, borderRadius:3, borderWidth:1,
      data:g.glo.map(function(lo,i){ return (lo==null||g.ghi[i]==null)?null:[lo,g.ghi[i]]; }),
      backgroundColor:'rgba(10,173,10,0.12)', borderColor:'rgba(10,173,10,0.32)' },
    { type:'line', label:'Reported', data:g.act, borderColor:'#0AAD0A', borderWidth:2, tension:0, spanGaps:false, fill:false, order:1,
      pointRadius:g.act.map(function(v){ return v==null?0:5; }),
      pointBackgroundColor:g.act.map(function(v,i){ return cgColor(v,g.glo[i],g.ghi[i]); }),
      pointBorderColor:'#fff', pointBorderWidth:1.5 },
  ];
  _finCharts.cg=new Chart(cv.getContext('2d'),{ type:'bar', data:{ labels:CG_Q, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{padding:{top:14,bottom:2}},
      interaction:{mode:'index',intersect:false},
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(ctx){ var dl=ctx.dataset.label,i=ctx.dataIndex; if(dl==='Guided range'){ return g.glo[i]==null?'Growth-% guide only':'Guided: '+cgFmt(g.unit,g.glo[i])+' – '+cgFmt(g.unit,g.ghi[i]); } return g.act[i]==null?'Reported: pending':'Reported: '+cgFmt(g.unit,g.act[i]); } } } },
      scales:{ y:{grace:'8%',grid:{color:C_GRID},ticks:{color:C_AXIS,font:{size:10},callback:function(v){ return cgFmt(g.unit,v); }}}, x:{grid:{display:false},ticks:{color:C_AXIS,font:{size:10.5}}} } }
  });
  var note=document.getElementById('cgNote'); if(note) note.innerHTML=g.note;
  var tbl=document.getElementById('cgTbl');
  if(tbl){ var rows=CG_Q.map(function(q,i){ var lo=g.glo[i],hi=g.ghi[i],a=g.act[i],land=cgLand(a,lo,hi);
      var range=(lo==null)?'<span class="guid-mut">growth % only</span>':cgFmt(g.unit,lo)+' – '+cgFmt(g.unit,hi);
      var rep=(a==null)?'<span class="guid-mut">pending</span>':'<b>'+cgFmt(g.unit,a)+'</b>';
      return '<tr><td>'+esc(q)+'</td><td>'+range+'</td><td>'+rep+'</td><td class="'+land.c+'">'+land.t+'</td></tr>'; }).join('');
    tbl.innerHTML='<table class="guid-tbl"><thead><tr><th>Quarter</th><th>Guided range</th><th>Reported</th><th>Landing</th></tr></thead><tbody>'+rows+'</tbody></table>'; }
}
function switchCartGuide(root,k){ if(!CGUIDE[k])return; _cgMetric=k; root.querySelectorAll('.cg-pill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-cgm')===k); }); buildCartGuide(); }

function init(c){
  var root = document.querySelector('.ov-cart'); if (!root) return;

  // Sub-tab switching
  root.querySelectorAll('.ov-subtab').forEach(function(b){
    b.onclick = function(){
      root.querySelectorAll('.ov-subtab').forEach(function(x){ x.classList.toggle('active', x===b); });
      var tab = b.getAttribute('data-catab');
      root.querySelectorAll('.ov-pane').forEach(function(p){ p.classList.toggle('active', p.getAttribute('data-capane')===tab); });
      if (tab==='fin') requestAnimationFrame(function(){ renderFin(); buildCartGuide(); }); // charts need a visible (sized) canvas
      if (tab==='advertising') requestAnimationFrame(buildAdChart);
      if (tab==='valuation') requestAnimationFrame(function(){ CART_VAL.init(root); });
    };
  });

  // Financials period toggle (Annual / Quarterly)
  var tog = root.querySelector('#ovFinTog');
  if (tog) tog.querySelectorAll('button').forEach(function(b){
    b.onclick = function(){ FIN_PERIOD = b.getAttribute('data-period');
      tog.querySelectorAll('button').forEach(function(x){ x.classList.toggle('on', x===b); }); renderFin(); };
  });

  root.querySelectorAll('.cg-pill').forEach(function(b){ b.onclick=function(){ switchCartGuide(root, b.getAttribute('data-cgm')); }; });

  // Modal
  var back = root.querySelector('#ovModalBack'), mT = root.querySelector('#ovModalT'), mB = root.querySelector('#ovModalB');
  function openModal(t, b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeModal(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  function onEsc(e){ if (e.key==='Escape') closeModal(); }
  root.querySelector('#ovModalX').onclick = closeModal;
  back.onclick = function(e){ if (e.target===back) closeModal(); };
  function findSub(id){ var hit=null; SEGMENTS.forEach(function(seg){ seg.subs.forEach(function(s){ if(s.k===id) hit=s; }); }); return hit; }
  function resolve(key){
    var parts=key.split(':'), kind=parts[0], id=parts.slice(1).join(':');
    if (kind==='party'){ var p=PARTY_DETAIL[id]; return p && { t:p.t, h:p.h }; }
    if (kind==='sub'){ var s=findSub(id); return s && { t:s.n+' <span class="ov-modal-sub">'+esc(s.rev)+'</span>', h:subDetailHtml(s) }; }
    if (kind==='hist'){ var ht=TIMELINE[+id]; return ht && ht.d ? { t:ht.y, h:ht.d } : null; }
    if (kind==='strat'){ var sn=STRATEGY.loop.filter(function(n){return n.k===id;})[0]; return sn ? { t:sn.ic+' '+sn.n, h:'<div class="ov-sub-line">'+sn.detail+'</div>' } : null; }
    if (kind==='peer'){ var pe=PEERS.filter(function(p){return p.k===id;})[0]; return pe ? { t:pe.n, h:'<div class="ov-sub-line"><b>Angle:</b> '+pe.angle+'</div><div class="ov-sub-mon" style="margin-top:12px"><b>Their edge:</b> '+pe.edge+'</div><div class="ov-sub-comp" style="margin-top:12px"><b>Their gap vs Instacart:</b> '+pe.gap+'</div>' } : null; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){
    el.addEventListener('click', function(){ var d=resolve(el.getAttribute('data-detail')); if (d) openModal(d.t, d.h); });
  });

  // Earnings calls accordion
  root.querySelectorAll('#caCallsAcc .lpb-acc-h').forEach(function(btn){ btn.onclick=function(){ var item=btn.parentElement; var open=item.classList.toggle('open'); var ic=btn.querySelector('.lpb-acc-ic'); if(ic) ic.textContent=open?'\u2013':'+'; }; });

  // Flow animation
  var flow = root.querySelector('#ovFlow');
  if (flow){
    var idx=0, timer=null;
    var nodes=flow.querySelectorAll('.ov-flow-node');
    var stepEl=flow.querySelector('#ovFlowStep'), capEl=flow.querySelector('#ovFlowCap'), earnEl=flow.querySelector('#ovFlowEarn');
    var dots=flow.querySelectorAll('.ov-flow-dot'), playBtn=flow.querySelector('#ovFlowPlay');
    function apply(i){
      idx=i; var s=FLOW_STEPS[i];
      nodes.forEach(function(n){ n.classList.toggle('on', s.on.indexOf(n.getAttribute('data-node'))!==-1); });
      stepEl.textContent=s.t; capEl.innerHTML=s.cap;
      if (s.earn){ earnEl.hidden=false; earnEl.className='ov-flow-earn earn-'+s.earnType; earnEl.innerHTML=s.earn; } else { earnEl.hidden=true; }
      dots.forEach(function(d, di){ d.classList.toggle('on', di===i); });
    }
    function stop(){ if (timer){ clearInterval(timer); timer=null; } playBtn.textContent='▶ Play'; }
    function play(){ if (timer){ stop(); return; } if (idx>=FLOW_STEPS.length-1) apply(0); playBtn.textContent='❚❚ Pause'; timer=setInterval(function(){ if (idx>=FLOW_STEPS.length-1){ stop(); return; } apply(idx+1); }, 2600); }
    playBtn.onclick=play;
    flow.querySelector('#ovFlowPrev').onclick=function(){ stop(); apply(Math.max(0, idx-1)); };
    flow.querySelector('#ovFlowNext').onclick=function(){ stop(); apply(Math.min(FLOW_STEPS.length-1, idx+1)); };
    dots.forEach(function(d){ d.onclick=function(){ stop(); apply(parseInt(d.getAttribute('data-i'),10)); }; });
    apply(0);
  }
}

export var instacartOverview = { html: html, init: init };
