// themes-data/googl.js — Alphabet's theme record (Evolution ▸ Earnings ▸ Notes), the static seed.
//
// Contract: docs/PROFILE_PLAYBOOK.md §12 EV-NOTES and §24. Two readers: the theme record in Notes
// (js/overviews/googl-ce.js) and Top Line ▸ Segments ▸ "What management has said" (js/segments.js, THEME_SEG maps
// 'Google Services' → svc, 'Google Cloud' → cloud and 'Other Bets' → bets; the other themes are company-wide). Once
// the portal saves a record (Supabase, company_theme_record) that copy wins and this seed is no longer read.
//
// Sources (decision "Ambos", SAB, Oct 26 2026):
//   1. Base — SAB's handwritten call notes, Q3 2022 → Q2 2026 (GoodNotes export "GOOGL (2).pdf", Oct 26 2026): 15
//      earnings calls plus four events (GS Communacopia Sep 2025 and Sep 2026, Morgan Stanley TMT Mar 2026, Google
//      I/O May 2026), each filed under the calendar quarter in which it was held and named in the note. Paraphrased,
//      no quotation marks. Not used: the Sep 2024 review (our own multiples), the Jun 2024 Gemini primer, the ad-tech
//      diagrams and the DV360 / Ad Manager primers (background, not a call), and the META notes on the same pages.
//   2. DOAA351's theme record (Jul 2026, Q4 2023 → Q2 2026, from the transcripts in docs/calls/GOOGL*.md) for what
//      SAB's notes do not cover; its quoted text is in quotation marks.
//   3. Q3 2026 (seed v4, Oct 29 2026): base = SAB's handwritten notes of the Oct 28 call (shared Oct 29), paraphrased;
//      every figure checked against the earnings release and the 10-Q (accession 0001652044-26-000084), which add the
//      detail marked "(10-Q)" / "(release)". The Anthropic attribution of the equity loss is SAB's (the 10-Q names only
//      SpaceX and "a private company"). "Where the chain breaks" marks a metric Alphabet stopped disclosing.
//   Every figure in a note was checked against the 10-K / 10-Q actuals in js/results-data/googl.js; where the
//   handwriting and the filing disagree the filing wins (Cloud +30% in Q4 2024, +32% in Q2 2025; backlog +38% in
//   Q2 2025; the $24.8B free cash flow is Q4 2024, not Q1 2025).
//
// Open vs closed hooks (SAB, Oct 21 2026): a thread with a beginning and an end — a full-year capex guide, a dated
// promise — is its own sub-theme with `trackUntil` = the quarter it was settled, and its last note says how it landed
// ("Reconciled: …", figures from the 10-K via js/results-data/googl.js).
// Seed version: bump it when the seed is restructured (every thread carries it as `v`; a saved record older than
// this is replaced by the seed).
export var GOOGL_THEMES_V = 4;
export var GOOGL_THEMES = [
  // ── Google Services ──────────────────────────────────────────────────────────────────────────
  { seg:'Google Services', theme:'Ad demand pullback and recovery', st:{ k:'trend', since:'Q3 2022', last:'Q4 2023' }, trackUntil:'Q4 2023',
    why:'The 2022 advertiser pullback, tracked until ad growth was back.',
    updates:[
      { q:'Q3 2022', items:['Advertisers pulled back spend, on YouTube as well as Search; tough comps in ads ahead.'] },
      { q:'Q4 2022', items:['Weak advertising demand; Services down on FX conversion.', 'FY2022 revenue <b>+10%</b>, with FX a drag.'] },
      { q:'Q3 2023', items:['Signs of stabilization in consumer ad spending; Search & other <b>+11%</b>, led by retail.'] },
      { q:'Q4 2023', items:['Strong YoY growth, but softness in ad growth; Network revenue down.', 'Reconciled: FY2023 Google Services revenue <b>+7.5%</b> ($253.5B to $272.5B).'] },
    ]},
  { seg:'Google Services', theme:'Search growth with AI Overviews and AI Mode', st:{ k:'trend', since:'Q4 2023', last:'Q3 2026' },
    why:'Whether generative answers inside Search grow or shrink the core: tracked through Search growth, usage and cost per query.',
    updates:[
      { q:'Q4 2023', items:['Investing in AI for Search (Gemini, generative AI); Search Generative Experience in Labs, latency down about 40%.'] },
      { q:'Q1 2024', items:['Search revenue growth and margin much better than expected.', 'Machine cost of generative answers down <b>80%</b> since introduction.'] },
      { q:'Q3 2024', items:['Strong ad growth on AI enhancements; Search benefits from the new AI features and management sees a long runway for growth.'] },
      { q:'Q4 2024', items:['AI Overviews in 100+ countries and over <b>1B users</b>; AI gives advertisers a higher return on marketing spend.'] },
      { q:'Q1 2025', items:['Search & other <b>+10%</b>, broad-based across ad verticals; AI Overviews at <b>1.5B users a month</b>.', 'AI queries are on average twice as long as traditional Search queries.'] },
      { q:'Q2 2025', items:['Search & other <b>+12%</b>; AI Overviews above <b>2B</b> monthly users; AI Mode <b>100M</b> users in the US and India.'] },
      { q:'Q3 2025', items:['Search & other <b>+15%</b> to $56.6B; AI Mode above <b>75M</b> daily users.'] },
      { q:'Q4 2025', items:['Search & other <b>+17%</b>; Gemini 3 in AI Mode and AI Overviews; AI Mode queries per user doubled.'] },
      { q:'Q1 2026', items:['Search & other <b>+19%</b>, led by retail and finance as Gemini rolls out; AI raised ad relevance about 10%.', 'More than 30% of Search ad spend runs through AI Max and Performance Max.'] },
      { q:'Q2 2026', items:['Search & other <b>+17%</b> to $63.3B; AI Mode above <b>1B MAU</b>.', 'At Google I/O (May 2026): AI Overviews at <b>2.5B</b> monthly users; five products with 3B+ users (Search, Gmail, Android, Chrome, YouTube).'] },
      { q:'Q3 2026', items:['Search & other <b>+12%</b> (Services +11%); Search query growth the highest in five years.', 'Paid clicks <b>+8%</b>, cost-per-click <b>+4%</b> (10-Q).'] },
    ]},
  { seg:'Google Services', theme:'AI Overviews monetize "at approximately the same rate"', st:{ k:'promise', since:'Q4 2024', last:'Q2 2026' }, trackUntil:'Q2 2026',
    why:'The standing monetization claim for AI Overviews, repeated call after call until it was replaced.',
    updates:[
      { q:'Q4 2024', items:['AI Overviews monetize "at approximately the same rate" as traditional Search results.'] },
      { q:'Q1 2025', items:['Monetization of AI Overviews around the same level as Search.'] },
      { q:'Q3 2025', items:['Same claim, repeated.'] },
      { q:'Q2 2026', items:['Reconciled: the phrase was replaced by "continue to be encouraged with monetization performance… even as we\'ve expanded AI Overviews to more commercial queries."'] },
    ]},
  { seg:'Google Services', theme:'New ad surfaces: AI Mode ads, Direct Offers, agentic commerce', st:{ k:'promise', since:'Q4 2023', last:'Q3 2026' },
    why:'The steps from test to revenue for ads and checkout inside AI answers.',
    updates:[
      { q:'Q4 2023', items:['Ads will be part of the new Search experiences, but the format is not figured out yet.'] },
      { q:'Q3 2025', items:['"Testing ads in AI Mode… will continue to test and learn before we expand."'] },
      { q:'Q4 2025', items:['Direct Offers pilot announced (exclusive offers in AI Mode); Universal Commerce Protocol launched with retail partners.'] },
      { q:'Q1 2026', items:['Universal Commerce Protocol, an open standard for agentic commerce, powers a new checkout experience; Direct Offers signed Gap, L\'Oréal and Chewy.'] },
      { q:'Q2 2026', items:['Highlighted Answers (sponsored links inside AI answers) and Universal Cart launched; UCP live at Target and Steve Madden.', 'AI Max out of beta: <b>500K advertisers</b>, +15% conversions.'] },
      { q:'Q3 2026', items:['Ads in AI Mode expanding to international markets, with multi-turn ads in AI Mode in the US.', 'AI Mode is monetizing at a lower rate than Search for now.'] },
    ]},
  { seg:'Google Services', theme:'Gemini app: subscriptions first, ads later', st:{ k:'watch', since:'Q4 2024', last:'Q2 2026' },
    why:'Management\'s stance on putting ads in the Gemini app.',
    updates:[
      { q:'Q4 2024', items:['Gemini monetization focused on the free tier and subscriptions in the short term; advertising will come, always protecting the user experience.'] },
      { q:'Q2 2025', items:['Still focused on the organic experience in Gemini, but other products can be monetized sooner; subscriptions and ads remain a two-tier strategy.'] },
      { q:'Q4 2025', items:['App ads: "not rushing."'] },
      { q:'Q1 2026', items:['"Not rushing", for the third time.'] },
      { q:'Q2 2026', items:['Not mentioned on the call, by management or by analysts.'] },
    ]},
  { seg:'Google Services', theme:'Gemini app users and paid subscriptions', st:{ k:'trend', since:'Q1 2025', last:'Q3 2026' },
    why:'The consumer scale of Gemini and the subscription line it feeds.',
    updates:[
      { q:'Q1 2025', items:['Gemini app about <b>35M</b> daily active users; <b>270M</b> paid subscriptions.'] },
      { q:'Q2 2025', items:['Gemini app above <b>450M</b> users (400M a few weeks earlier); daily requests +50% vs Q1.'] },
      { q:'Q3 2025', items:['<b>650M</b> monthly active users; paid subscriptions above <b>300M</b>.'] },
      { q:'Q4 2025', items:['<b>750M</b> monthly active users, 100M added in the quarter; <b>325M</b> paid subscriptions.'] },
      { q:'Q1 2026', items:['No MAU figure given; <b>350M</b> paid subscriptions; strongest quarter ever for consumer AI plans.'] },
      { q:'Q2 2026', items:['At Google I/O (May 2026): <b>900M</b> monthly users, twice the level of I/O 2025.', '<b>950M MAU</b> on the Q2 call.'] },
      { q:'Q3 2026', items:['Gemini app reached <b>1B</b> users.', 'Where the chain breaks: no company-wide paid-subscriptions count since <b>350M</b> in Q1 2026 (none in Q2 or Q3); the only figure now is YouTube\'s (below), which is not comparable.'] },
    ]},
  { seg:'Google Services', theme:'YouTube: Shorts, subscriptions and watch time', st:{ k:'trend', since:'Q3 2022', last:'Q3 2026' },
    why:'YouTube\'s two revenue streams (ads and subscriptions) and the Shorts monetization gap.',
    updates:[
      { q:'Q3 2022', items:['Lower ad spend on YouTube; solid growth in subscriptions; Made on YouTube event focused on creator monetization and shopping.'] },
      { q:'Q4 2022', items:['Strong momentum in YouTube subscriptions; Shorts revenue sharing with creators, Shorts at <b>50B</b> daily views.'] },
      { q:'Q3 2023', items:['YouTube ads <b>+12%</b>, brand and direct response; subscriptions lift the "other" revenue line.'] },
      { q:'Q4 2023', items:['Subscription revenue reached <b>$15B</b> in 2023 (5x 2019); Google One at <b>100M</b> subscribers.', 'Strong commitment to YouTube, which could become the core of ad revenue.'] },
      { q:'Q2 2024', items:['Healthy watch-time growth and strong subscription growth; Q3 laps a strong quarter.'] },
      { q:'Q4 2024', items:['YouTube is the most-used podcast platform in the US; Shorts closing the monetization gap with long-form.'] },
      { q:'Q2 2025', items:['Shorts now earn as much revenue per watch hour as traditional content in the US; YouTube first in TV viewing time (Nielsen, June 2025).'] },
      { q:'Q3 2025', items:['Tough Q4 comp for Services, particularly YouTube.'] },
      { q:'Q1 2026', items:['At Morgan Stanley TMT (Mar 2026): YouTube ads plus subscriptions above <b>$60B</b> in 2025; a subscriber is more profitable than an ad viewer.', 'YouTube ads <b>+11%</b>; YouTube Music and Premium had their best non-trial subscriber growth; subscription revenue growing faster than ads.'] },
      { q:'Q2 2026', items:['YouTube ads <b>+13%</b>; subscriptions, platforms & devices <b>+15%</b>; <b>140M</b> users of Ask on YouTube.'] },
      { q:'Q3 2026', items:['Surpassed <b>150M</b> YouTube Music and Premium subscribers globally (including trials, per the release); subscriptions help fund the creator ecosystem.', 'YouTube ads <b>+9%</b>, brand ahead of direct response; subscriptions, platforms & devices <b>+11%</b> on YouTube and Google One subscriptions plus Pixel (10-Q).'] },
    ]},
  { seg:'Google Services', theme:'Google Network decline', st:{ k:'watch', since:'Q4 2023', last:'Q3 2026' },
    why:'The ad line on partner sites, which has shrunk in most quarters.',
    updates:[
      { q:'Q4 2023', items:['Network revenue down YoY.'] },
      { q:'Q3 2025', items:['Network <b>−3%</b>.'] },
      { q:'Q4 2025', items:['Network −2%.'] },
      { q:'Q1 2026', items:['Network −4%.'] },
      { q:'Q2 2026', items:['Network −1%, the smallest decline in two years.'] },
      { q:'Q3 2026', items:['Network <b>+1%</b>, its first rise after at least ten straight quarterly declines: AdMob up, AdSense down; impressions <b>−14%</b>, cost per impression <b>+14%</b> (10-Q).'] },
    ]},
  // ── Google Cloud ─────────────────────────────────────────────────────────────────────────────
  { seg:'Google Cloud', theme:'Cloud growth and the revenue backlog', st:{ k:'trend', since:'Q3 2023', last:'Q3 2026' },
    why:'Growth and backlog of Google Cloud, which management says has been supply-constrained since 2025.',
    updates:[
      { q:'Q3 2023', items:['Cloud <b>+22%</b> against about 28% expected, as clients optimized costs; signs of stabilization. 60% of the 1,000 largest companies use it.'] },
      { q:'Q4 2023', items:['Strong momentum; more products live and in development.'] },
      { q:'Q3 2024', items:['Cloud <b>+35%</b>, beating on growth and profitability.'] },
      { q:'Q4 2024', items:['Cloud <b>+30%</b> to $12B; "exited the year with more demand than we had available capacity."'] },
      { q:'Q1 2025', items:['Cloud <b>+28%</b>, driven by core products and AI infrastructure; growth will vary with the rollout of capacity.'] },
      { q:'Q2 2025', items:['Cloud <b>+32%</b>; backlog <b>$106B</b> (+38% YoY); deals above $250M doubled; supply will stay constrained into 2026.'] },
      { q:'Q3 2025', items:['Cloud <b>+34%</b> to $15.2B; backlog <b>$155B</b>; new customers +34%; more $1B+ deals than in the previous two years combined.', 'At GS Communacopia (Sep 2025): demand from AI labs (9 of the 10 largest are clients), enterprises, capital markets and HPC; about half the backlog recognized within two years.'] },
      { q:'Q4 2025', items:['Cloud <b>+48%</b> to $17.7B; backlog <b>$240B</b> (+55% QoQ, 2x YoY); existing clients signing commitments about 30% above their earlier ones.', 'Still capacity-constrained through 2026.'] },
      { q:'Q1 2026', items:['Cloud <b>+63%</b> to $20.0B; backlog <b>$462B</b>, about half recognized in the next 24 months; customers exceed their initial commitments by 45%.', 'Gemini Enterprise adoption 9x YoY, in seats and new partners.'] },
      { q:'Q2 2026', items:['Cloud <b>+82%</b> to $24.8B, across AI solutions and enterprise AI infrastructure; "accelerated meaningfully even after excluding the impact of TPU system sales."', 'Backlog <b>$514B</b> (+$50B QoQ); 90% of the Fortune 100 use the Gemini Enterprise platform.'] },
      { q:'Q3 2026', items:['Cloud <b>+103%</b> to $30.7B: strong growth in GCP across enterprise AI infrastructure and AI solutions, with TPU system sales a meaningful contributor.', 'Cloud backlog <b>$560.8B</b> (+$47B QoQ), just over 55% recognized within 24 months (just over 50% at Jun 30).', 'At GS Communacopia (Sep 2026): <b>17</b> product lines above $1B of run-rate; TPU business more than twice the size of the next hyperscaler\'s.'] },
    ]},
  { seg:'Google Cloud', theme:'Cloud reaches profitability', st:{ k:'promise', since:'Q4 2022', last:'Q4 2023' }, trackUntil:'Q4 2023',
    why:'The 2022 commitment to take Cloud to profit.',
    updates:[
      { q:'Q4 2022', items:['Cloud focused on its path to profitability, prioritizing investments.'] },
      { q:'Q4 2023', items:['Cloud operating margin <b>9.4%</b> in Q4.', 'Reconciled: FY2023 Cloud operating income <b>$1.7B</b>, from a $1.9B loss in 2022.'] },
    ]},
  { seg:'Google Cloud', theme:'Cloud margin: what drives it and what weighs on it', st:{ k:'trend', since:'Q4 2023', last:'Q3 2026' },
    why:'Cloud operating margin, the levers management names and the investments it says will weigh on it.',
    updates:[
      { q:'Q4 2023', items:['Cloud to keep healthy profitability while it keeps investing.'] },
      { q:'Q2 2024', items:['Slight headcount increase in Q3; margin expected to hold.'] },
      { q:'Q3 2024', items:['Margin <b>17%</b>; expansion from scale, headcount discipline and AI efficiencies; the investments behind it will be headwinds that vary over time.'] },
      { q:'Q4 2024', items:['Margin <b>17.5%</b>.'] },
      { q:'Q1 2025', items:['Margin <b>17.8%</b>.'] },
      { q:'Q3 2025', items:['Margin <b>23.7%</b>.', 'At GS Communacopia (Sep 2025): three margin levers — fleet and machine efficiency, the go-to-market organization, a broader product suite.'] },
      { q:'Q4 2025', items:['Margin <b>30.1%</b>.'] },
      { q:'Q1 2026', items:['Margin <b>32.9%</b>; Wiz consolidated into Cloud, about a one-point drag on operating income.'] },
      { q:'Q2 2026', items:['Margin <b>35.6%</b>; third-party capacity in Q3 as a bridge, with "modest margin pressure."'] },
      { q:'Q3 2026', items:['Margin <b>36.2%</b>, from 35.6% in Q2.', 'The third-party bridge capacity came online late in Q3, so no margin impact yet; open question for Q4.'] },
    ]},
  { seg:'Google Cloud', theme:'TPU system sales — "vast majority" of revenue in 2027', st:{ k:'promise', since:'Q1 2026', last:'Q3 2026' },
    why:'A dated promise: TPU systems sold into customers\' data centers, small in 2026 and mostly recognized in 2027.',
    updates:[
      { q:'Q1 2026', items:['First TPU sales into customers\' own data centers, tied to Google Cloud (a hybrid of on-premise and cloud), to a select group of customers and priced on return on invested capital.', 'Small revenue in late 2026, the vast majority in 2027; already inside the $462B backlog.'] },
      { q:'Q2 2026', items:['Revenue recognition began with the first deliveries; the agreements are recognized mainly in 2027.', 'Margins on TPU sales not broken out; TPU inventory now in cost of revenue.'] },
      { q:'Q3 2026', items:['Nearly <b>100</b> customers use TPUs today; TPU system sales a meaningful contributor to Cloud growth in Q3, against the Q2 expectation of a relatively small portion of the revenue this year.', 'TPU systems to keep scaling in Q4, followed by a meaningful ramp in 2027.', 'Inventory <b>$13.3B</b> at Sep 30, from $2.4B at Dec 31, mostly TPU systems; the build-up weighed on operating cash flow.'] },
    ]},
  { seg:'Google Cloud', theme:'Customers and partnerships', st:{ k:'trend', since:'Q1 2024', last:'Q3 2026' },
    why:'Who is choosing Google Cloud and Gemini, as named on the calls.',
    updates:[
      { q:'Q1 2024', items:['Offers an industry-leading portfolio of Nvidia GPUs, Blackwell included.'] },
      { q:'Q2 2024', items:['Uber uses Gemini 1.5 in customer experience and marketing; Blackwell platform early 2025.'] },
      { q:'Q4 2024', items:['Delivered Nvidia H200 to customers; usage of partner models up 5x.'] },
      { q:'Q1 2025', items:['First cloud provider to offer Blackwell, on track to offer Rubin.'] },
      { q:'Q2 2025', items:['OpenAI begins using Google Cloud; PayPal multi-product deal.'] },
      { q:'Q3 2025', items:['9 of the top 10 AI labs on Google Cloud; Anthropic plans up to 1M TPUs; Nvidia GB300 offered to Cloud customers.'] },
      { q:'Q4 2025', items:['Apple: Google as a preferred cloud provider, with next-generation Apple foundation models built on Gemini.', '<b>8M</b> Gemini Enterprise seats one quarter after launch.'] },
      { q:'Q1 2026', items:['American Express and Vodafone wins; first to offer Nvidia Vera Rubin.'] },
      { q:'Q2 2026', items:['Booking Holdings multi-year expansion; Pfizer, Roche and Deutsche Börse on infrastructure; PepsiCo, Intel and HSBC on Gemini Enterprise.'] },
      { q:'Q3 2026', items:['Customers using Gemini Enterprise grew their spend 4x YoY.', 'At GS Communacopia (Sep 2026): partnerships along three lines — eight focus industries, scale through the services community, specific data providers.'] },
    ]},
  // ── Other Bets ───────────────────────────────────────────────────────────────────────────────
  { seg:'Other Bets', theme:'Waymo ramp and portfolio pruning', st:{ k:'trend', since:'Q3 2024', last:'Q3 2026' },
    why:'Waymo\'s paid rides, its go-to-market model, and the narrowing of the rest of the portfolio.',
    updates:[
      { q:'Q3 2024', items:['Waymo looks for partnerships (Uber) as its go-to-market strategy.'] },
      { q:'Q4 2024', items:['<b>4M</b> trips in 2024, about <b>150K</b> a week; Austin and Atlanta in 2025, Miami in 2026, also Tokyo; the 6th-generation Driver cuts hardware cost significantly.'] },
      { q:'Q1 2025', items:['<b>250K</b> paid rides a week; expanding alone and with partners such as Uber.'] },
      { q:'Q3 2025', items:['Gemini integration into Waymo to show in 2026.'] },
      { q:'Q4 2025', items:['<b>20M</b> fully autonomous rides by December, <b>400K+</b> a week; Miami launched; more US cities, the UK and Japan next.', 'Waymo raised <b>$16B</b>, mostly from Alphabet, with a $2.1B stock-based compensation charge.'] },
      { q:'Q1 2026', items:['At Morgan Stanley TMT (Mar 2026): launched in five cities this year; both asset-heavy and asset-light models depending on the city.', '<b>500K+</b> rides a week; Wing progressing with DoorDash and Walmart; Verily deconsolidated.'] },
      { q:'Q2 2026', items:['Waymo Ojai vehicle on the 6th-generation Driver; Wing past 1M deliveries; Isomorphic Labs raised $2B+.'] },
      { q:'Q3 2026', items:['Where the chain breaks: no weekly-rides figure since <b>500K+</b> in Q1 2026 (none in Q2 or Q3).', 'Waymo took a <b>$5.0B</b> secured term loan in October 2026 (SOFR + 5.25%, due 2032), not guaranteed by Alphabet; Other Bets loss <b>$2.0B</b> (+$621M YoY) on $372M of revenue (10-Q).', 'GFiber\'s move into a new entity (agreed Mar 2026: $1.5B cash, a $2.0B note, a 49.99% stake) expected to close in late 2026.'] },
    ]},
  // ── AI & compute ─────────────────────────────────────────────────────────────────────────────
  { seg:'AI & compute', theme:'Full stack: TPUs, models and the cost to serve', st:{ k:'trend', since:'Q3 2022', last:'Q3 2026' },
    why:'Alphabet\'s own chips and models, and what they do to usage and to the cost of each AI answer.',
    updates:[
      { q:'Q3 2022', items:['AI investment depends on its return; AI already powers recommendations and ads.'] },
      { q:'Q4 2022', items:['Large language models (LaMDA) opened to developers and partners through new tools and APIs.'] },
      { q:'Q4 2023', items:['Gemini launched: generative AI reaching large audiences and taking shape in products; big AI investments to continue.'] },
      { q:'Q3 2024', items:['Trillium (6th-generation TPU); Gemini API usage up <b>14x</b> in a few months.'] },
      { q:'Q4 2024', items:['Full-stack approach: own hardware and software in Google\'s data centers; Gemini aims to be a universal assistant (Astra, Mariner); <b>4.4M</b> developers on Gemini.'] },
      { q:'Q1 2025', items:['Ironwood (7th generation), the first TPU designed for inference; Gemini inside all the largest products.'] },
      { q:'Q2 2025', items:['<b>980 trillion</b> monthly tokens processed, from 480 trillion a few months earlier; serving GPUs and TPUs to clients is the main focus.'] },
      { q:'Q3 2025', items:['Models process <b>7B</b> tokens a minute; 150 customers processed over 1 trillion tokens each in 12 months; Gemini 3 later in 2025.'] },
      { q:'Q4 2025', items:['Gemini serving unit cost down 78% over 2025.'] },
      { q:'Q1 2026', items:['At Morgan Stanley TMT (Mar 2026): AI infrastructure is the base of every business, Waymo included; about half of ML compute goes to Cloud; TPUs mostly used inside Alphabet.', '8th-generation TPUs (8t, 8i); APIs at 16B tokens a minute.'] },
      { q:'Q2 2026', items:['Model APIs at about <b>22B tokens a minute</b>; Gemini 4 pre-training started; at I/O, Gemini Omni (any output from any input).'] },
      { q:'Q3 2026', items:['First-party model APIs at nearly <b>32B tokens a minute</b>, more than 4x YoY; Gemini 4 Argon and Carbon released.'] },
    ]},
  // ── Costs & capital ──────────────────────────────────────────────────────────────────────────
  { seg:'Costs & capital', theme:'2023–24 cost reset and margin expansion', st:{ k:'promise', since:'Q4 2022', last:'Q4 2024' }, trackUntil:'Q4 2024',
    why:'The 2023 layoffs and team mergers, and the promised operating-margin expansion they were meant to deliver.',
    updates:[
      { q:'Q4 2022', items:['Investing for growth but focused on profitability: slower opex growth, about <b>12,000</b> roles cut, severance of <b>$1.9–2.3B</b>.'] },
      { q:'Q3 2023', items:['Opex growth driven by R&D and G&A.'] },
      { q:'Q1 2024', items:['Teams merged (ML infrastructure and developers, all of Search under one leader, Platforms & Devices) to improve margins; operating margin to expand in 2024 vs 2023.'] },
      { q:'Q4 2024', items:['Reconciled: operating margin <b>32.1%</b> in 2024, against 27.4% in 2023; Services margin 39.0% in Q4.'] },
    ]},
  { seg:'Costs & capital', theme:'FY2023 capex', st:{ k:'promise', since:'Q3 2022', last:'Q4 2023' }, trackUntil:'Q4 2023',
    why:'The FY2023 capex guide.',
    updates:[
      { q:'Q3 2022', items:['Significant investment in servers to continue; data-center costs keep weighing on margins.'] },
      { q:'Q4 2022', items:['2023 capex in line with 2022.'] },
      { q:'Q3 2023', items:['Capex and investments to keep growing.'] },
      { q:'Q4 2023', items:['Reconciled: FY2023 capex <b>$32.3B</b>, against $31.5B in 2022.'] },
    ]},
  { seg:'Costs & capital', theme:'FY2024 capex', st:{ k:'promise', since:'Q4 2023', last:'Q4 2024' }, trackUntil:'Q4 2024',
    why:'The FY2024 capex guide.',
    updates:[
      { q:'Q4 2023', items:['2024 capex "notably larger" than 2023.'] },
      { q:'Q2 2024', items:['Pichai: "the risk of underinvesting is dramatically greater than the risk of overinvesting."'] },
      { q:'Q3 2024', items:['Q3 capex <b>$13.1B</b> vs $8.1B a year earlier, about 60% servers; Q4 at a similar level; capex up again in 2025.'] },
      { q:'Q4 2024', items:['Reconciled: FY2024 capex <b>$52.5B</b>, against $32.3B in 2023.'] },
    ]},
  { seg:'Costs & capital', theme:'FY2025 capex', st:{ k:'promise', since:'Q4 2024', last:'Q4 2025' }, trackUntil:'Q4 2025',
    why:'The FY2025 capex guide and its raises.',
    updates:[
      { q:'Q4 2024', items:['FY2025 guided at <b>$75B</b>, about 50% above 2024; Q1 2025 at $16–18B.'] },
      { q:'Q1 2025', items:['About <b>$75B</b> reiterated; Q1 capex <b>$17.2B</b> (+43% YoY) in servers and data centers for Services, Cloud and DeepMind.'] },
      { q:'Q2 2025', items:['Raised to about <b>$85B</b>; 2026 capex to be higher.'] },
      { q:'Q3 2025', items:['Raised to <b>$91–93B</b>.'] },
      { q:'Q4 2025', items:['Reconciled: FY2025 capex <b>$91.4B</b>, inside the $91–93B guide; about 60% servers, 40% data centers and networking.'] },
    ]},
  { seg:'Costs & capital', theme:'FY2026 capex', st:{ k:'promise', since:'Q3 2025', last:'Q3 2026' },
    why:'The FY2026 capex guide: raised twice in 2026 so far.',
    updates:[
      { q:'Q3 2025', items:['2026 capex to expand significantly; detail on the Q4 call.'] },
      { q:'Q4 2025', items:['FY2026 guided at <b>$175–185B</b>, about twice FY2025.'] },
      { q:'Q1 2026', items:['Raised to <b>$180–190B</b>; Q1 capex <b>$35.7B</b>, about 60% servers.'] },
      { q:'Q2 2026', items:['"Updating our full-year 2026 CapEx guidance range to $195 billion-$205 billion", to deliver capacity faster; Q2 capex $44.9B.'] },
      { q:'Q3 2026', items:['FY2026 capex to land as guided (<b>$195–205B</b>); Q3 capex <b>$51.4B</b>, nine months $132.0B, which leaves $63–73B for Q4.', 'About 65% servers and networking equipment, 35% data centers; useful lives of 7 to 40 years.'] },
    ]},
  { seg:'Costs & capital', theme:'2027 capex — "increase significantly"', st:{ k:'promise', since:'Q1 2026', last:'Q3 2026' },
    why:'The 2027 capex direction, given so far without a figure.',
    updates:[
      { q:'Q1 2026', items:['At Morgan Stanley TMT (Mar 2026): capex starts from demand (Cloud customers and internal), then the return by allocation; building faster can pull capex up, and the reverse.', '2027 capex to increase significantly, sized by the backlog.'] },
      { q:'Q2 2026', items:['"We continue to expect our CapEx to increase significantly in 2027 and will provide more details at a later date."'] },
      { q:'Q3 2026', items:['Still to increase meaningfully in 2027; no figure yet.'] },
    ]},
  { seg:'Costs & capital', theme:'Depreciation and data-center costs', st:{ k:'trend', since:'Q4 2024', last:'Q3 2026' },
    why:'The capex reaching the income statement.',
    updates:[
      { q:'Q4 2024', items:['Investments will pressure margins through higher depreciation.'] },
      { q:'Q1 2025', items:['Depreciation <b>+31%</b> and accelerating through the year; operating margins will be hit, to be offset with efficiencies (slower compensation growth, smaller real-estate footprint).'] },
      { q:'Q3 2025', items:['Depreciation and energy costs <b>+41%</b> YoY; growth to tick up in Q4.'] },
      { q:'Q4 2025', items:['FY2025 depreciation +38% ($15.3B to $21.1B); growth to accelerate meaningfully in Q1 and in 2026.'] },
      { q:'Q1 2026', items:['R&D <b>+26%</b> on AI talent; sales & marketing <b>+23%</b> behind the Gemini app and Search.'] },
      { q:'Q2 2026', items:['Cost of revenue up on depreciation, TPU inventory and YouTube content; pressure on the P&L "in the form of higher depreciation expense and related data center operations costs such as energy."'] },
      { q:'Q3 2026', items:['Cost of revenue other than TAC <b>+32%</b>, against about 15% expected: TPU system hardware, depreciation, YouTube content and infrastructure operations. It shows mostly in Alphabet-level activities, a $7.7B loss, <b>+71%</b> YoY, driven by shared AI expenses.', 'Opex in line overall: R&D above (<b>+36%</b> against about 27% expected, on AI-talent compensation and depreciation), G&A below (<b>−17%</b>, lapping a one-time legal charge in Q3 2025). Depreciation $8.4B, +49%.', 'Services margin <b>40.7%</b>, from 38.5% a year earlier.'] },
    ]},
  { seg:'Costs & capital', theme:'Funding the build: cash flow, debt, equity, buybacks', st:{ k:'watch', since:'Q4 2022', last:'Q3 2026' },
    why:'How the capex is paid for once it exceeds operating cash flow.',
    updates:[
      { q:'Q4 2022', items:['FY2022 free cash flow <b>$60B</b>.'] },
      { q:'Q4 2023', items:['FY2023 free cash flow <b>$69B</b>; <b>$62B</b> of Class A and C buybacks; <b>$111B</b> of cash and marketable securities.'] },
      { q:'Q2 2024', items:['Free cash flow fell sharply ($13.5B vs $21.8B), on lower operating cash flow and much higher capex.'] },
      { q:'Q3 2024', items:['Cash down $17B to <b>$93B</b>; lower free-cash-flow margin on higher capex.'] },
      { q:'Q1 2025', items:['Operating cash flow <b>+25%</b>, free cash flow up far less as capex rose 43%.'] },
      { q:'Q2 2025', items:['2Q25 free cash flow $5.3B (capex and tax timing).'] },
      { q:'Q4 2025', items:['FY2025 free cash flow <b>$73B</b> on operating cash flow above $160B, similar in 2026.'] },
      { q:'Q1 2026', items:['Long-term debt from $46.5B to $77.5B in one quarter; quarterly free cash flow $10.1B.'] },
      { q:'Q2 2026', items:['Free cash flow <b>−$5.9B</b>, the first negative quarter, with free cash flow to stay under pressure; buybacks $0; $49.6B of equity raised.'] },
      { q:'Q3 2026', items:['Free cash flow <b>−$9.1B</b>: operating cash flow $42.3B (hit by the TPU inventory build) against capex $51.4B; the second negative quarter in a row.', 'Long-term debt <b>$125.1B</b>, from $46.5B at Dec 31: $28.7B of notes in Q3, plus $12.4B from the at-the-market program; buybacks $0 again.', 'Future purchase commitments <b>$924.4B</b>, plus $152B of leases not yet commenced ($130.5B) and equity-funding commitments ($21.9B), a coming margin headwind (10-Q).'] },
    ]},
  { seg:'Costs & capital', theme:'One-off items in the print', st:{ k:'watch', since:'Q3 2024', last:'Q3 2026' },
    why:'Items that move a reported line without changing the operations.',
    updates:[
      { q:'Q3 2024', items:['Alphabet-level losses <b>$3.2B</b> (+90% YoY), including $607M of office-space charges.'] },
      { q:'Q3 2025', items:['European Commission fine <b>$3.5B</b> in G&A: operating margin 30.5% reported vs 33.9% without it; operating income +9% reported vs +22% without it.'] },
      { q:'Q4 2025', items:['Waymo-related <b>$2.1B</b> stock-based compensation charge in Other Bets; Alphabet-level costs $5.9B vs $2.8B a year earlier.'] },
      { q:'Q1 2026', items:['Other income <b>$37.7B</b> from unrealized gains on equity securities; FX tailwind of about 3 points to Services growth.'] },
      { q:'Q2 2026', items:['Other income <b>+$98.0B</b> from equity securities (+$6.26 of EPS, per the release); FX expected to turn into a slight headwind in Q3.'] },
      { q:'Q3 2026', items:['Other loss <b>$8.2B</b> on equity stakes: SpaceX marked down, and lower gains on a private company (Anthropic, per SAB\'s notes; the 10-Q does not name it); −$0.55 of EPS (release). $298M of preferred dividends now sit between net income and EPS.', 'FX headwind expected in Q4, especially in advertising.'] },
    ]},
];
GOOGL_THEMES.forEach(function(t){ t.v = GOOGL_THEMES_V; });
