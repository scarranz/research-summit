// themes-data/spot.js — Spotify's theme record (Evolution ▸ Earnings ▸ Notes), the static seed.
//
// Contract: docs/PROFILE_PLAYBOOK.md §12 EV-NOTES and §24. Two readers: the Notes tab (js/overviews/spot-ce.js)
// and, when Top Line is rebuilt on the segments engine, Top Line ▸ Segments ▸ "What management has said".
// Once the portal has saved a record (Supabase table company_theme_record) that copy wins and this seed
// is no longer read.
//
// Moved Oct 2026 from js/overviews/spot.js (the SPOT_THEMES record, 8 themes over Q3 2023–Q2 2026); each theme gained a
// `seg` (the canonical Notes groups themes under a segment).
// The old Watch List rows (WL_ROWS, wl001–wl011) only restated these themes quarter by quarter and were retired;
// they live in git history (commit f52d20d). Two themes were added from the 4 Aug 2026
// transcript (Add-ons lift ARPU structurally; Reserved ticketing) and one from the 22 Oct 2026 transcript (Agents are
// distribution, not displacement); every other theme gained its Q3 2026 update.
// Sources of the original record, as written there:
// var SRC_CALLS='Spotify FY2025 Form 20-F, the Q1 2026 and Q2 2026 6-Ks and shareholder updates (the Q2 2026 Update is Exhibit 99.1 to the Form 6-K of 4 Aug 2026), the May 2026 Investor Day remarks, the Q2 2026 earnings call of 4 Aug 2026 (Bryan Goldberg IR; Alex Norström and Gustav Söderström, Co-CEOs; Christian Luiga, CFO), and earnings-day coverage. ⚠ A per-call record (docs/calls/SPOT*.md) has still NOT been written — the Q2 2026 call is quoted here from the published transcript, but the earlier threads are compiled from filings and decks rather than from transcripts. Building the calls repository back through 2024 is the next step.';
export var SPOT_THEMES = [
  { seg:'Margins & investment', theme:'The gross-margin climb — and the 2030 promise', st:{ k:'promise', since:'Q1 2025', last:'Q3 2026' },
    why:'The entire equity story: 32.0% in FY2025 against a 35–40% commitment by 2030. Every lever is a different negotiation with a rights holder — and the guided path has just pointed down for the first time.',
    updates:[
      { q:'Q4 2025', items:[
        'Consolidated gross margin <b>33.1%</b>, a record at the time; FY2025 closed at <b>32.0%</b> against 30.1% in FY2024.'
      ] },
      { q:'Q1 2026', items:[
        '<b>33.0%</b>, roughly +140bps YoY. Guidance for Q2 adds only <b>ten basis points</b> (33.1%) — the first quarter where the guided trajectory looks slower than the promised one.'
      ] },
      { q:'Q2 2026 · Investor Day', items:[
        '<b>The framework to 2030</b> (Norström; Luiga on the numbers): “a mid-teens revenue CAGR, a gross margin of 35%-40%, an operating margin above 20%, and strong growth in free cash flow”, with the “North Stars” of “1 billion subscribers, $100 billion in revenue, and over 40% in gross margin”. The base it starts from: an 18% currency-neutral revenue CAGR since 2022 to €17B in 2025, a 32% gross margin (25% in 2022, against a 30% goal), an operating margin of almost 13% (from about −6%), and free cash flow from close to zero to nearly €3B.',
        '<b>Where the gross margin is meant to come from:</b> in Premium, “music has further room to run, supported by Marketplace and add-ons” plus higher-margin non-music offerings in more markets; in Ad-Supported, “automation at scale” and music margins improving, “particularly in emerging markets”. Podcasting went from deeply negative in 2021 to “more than 20% in 2026”, with “a path for 40%”.',
        'Free cash flow per share becomes part of the scorecard (Luiga: from around zero in 2021 to about €15 per share). Normalized P&L tax rate about 22%, a full taxpayer by 2027, cash tax about 90% of the P&L rate.'
      ] },
      { q:'Q2 2026', items:[
        '<b>33.4% — an all-time record</b>, +193bps YoY and 30bps ABOVE the guide. Premium <b>34.9%</b> (+174bps, revenue outpacing music costs net of marketplace programs, audiobooks and video podcasts); Ad-Supported <b>19.1%</b> (+179bps, favourable podcast and tax impacts).',
        '⚑ <b>And then the guide stepped DOWN.</b> Q3 2026 is guided to <b>32.9%</b> — 50bps below the record just set, with no explanation in the deck. Ten weeks after the Investor Day put 35–40% by 2030 on the record, this is the first guided move in the wrong direction. Summit\'s segment lines imply ~33.6%, so the model does not accept it.'
      ] },
      { q:'Q3 2026', items:[
        '<b>33.0% against a 32.9% guide</b>, +136bps YoY and the highest Q3 on record (the all-time high is still 33.4% from Q2). Premium <b>34.5%</b> (+130bps), Ad-Supported <b>18.7%</b> (+105bps), both below their Q2 levels. The regulatory-fee explanation for the Q3 step down was <b>not repeated on this call</b>.',
        '<b>The Q4 guide is 33.8%</b>, +70bps YoY, and with the first nine months implies about <b>+130bps for the full year</b> — the path back up after the guided step down, with the first audiobook (180+ markets) and Partner Program (50+ markets) rollout costs inside it. Management points to the Investor Day targets and does not guide 2027.'
      ] },
    ]},
  { seg:'Advertising', theme:'Advertising rebuilt around the exchange (SAX)', st:{ k:'watch', since:'Q2 2025', last:'Q3 2026' },
    why:'Spotify deliberately traded advertising VOLUME for advertising MARGIN. The trade is visible in the margin; two years in, the growth has still not come back.',
    updates:[
      { q:'Q2 2025', items:[
        '<b>Spotify Ad Exchange launched 1 Apr 2025</b> — programmatic, real-time biddable auctions, replacing insertion-order selling.'
      ] },
      { q:'Q4 2025', items:[
        'Ad-Supported gross margin roughly <b>doubled</b> year over year (11.2% → 17.4% restated) while ad revenue was flat to down.'
      ] },
      { q:'Q1 2026', items:[
        'Ad revenue <b>€385M, +3% constant-currency</b> — automated channels described as the largest contributor to what growth there was. Q2 is the first clean comp against the launch.'
      ] },
      { q:'Q2 2026 · Investor Day', items:[
        '<b>The dated commitment starts here:</b> “we also expect our advertising business to re-accelerate growth into the double-digit range. We expect that to start ramping towards these levels in the second half of 2026” (Luiga). The Q2 call then declared the migration to the in-house ad server complete.'
      ] },
      { q:'Q2 2026', items:[
        '⚑ <b>The clean comp came and went: €446M, +1% reported and +3% constant-currency — identical to Q1.</b> 2Q25 was the first quarter fully after the SAX launch, so this was the honest read, and the transition-dip explanation did not survive it.',
        'Management attributes what growth there is to <b>impressions sold, partially offset by pricing softness</b>, with podcast sponsorship in the Owned &amp; Licensed portfolio leading.',
        'The margin half of the trade keeps working — <b>19.1% gross margin, +179bps</b>. Luiga put a destination on it: from “the 20% range we have today <b>towards 40% over time</b>”.',
        '<b>On the call the migration was declared finished and a dated commitment made.</b> Norström: “<b>99% of all the impressions</b> [are] now on our own ad stack”; automated channels ~<b>40% of ad revenue, up from 30%</b>; <b>33,000 active advertisers, +60% YoY</b>, 7,000 using the AI audio asset-creation tool. Luiga: “we continue to expect our ads business to <b>inflect towards double-digit growth in the second half of 2026</b>.” Q3 is the first of the two quarters that must deliver it.'
      ] },
      { q:'Q3 2026', items:[
        '<b>€482M, +10% reported and +9% constant-currency</b> against two quarters at +3%: the first step up since the exchange launch. Credited to automated channels (the CFO: biddable “up to 40%”) and podcast sponsorship; music advertising grew on impressions sold with softer pricing. Summit had carried €511.6M.',
        '<b>Why double digits was the expectation:</b> on the Q2 call management said the migration of the ad inventory to the in-house ad server was complete (“99% of all the impressions” on Spotify’s own stack). ⚑ <b>The Q2 commitment to “inflect towards double-digit growth” in the second half landed one point short in constant currency, and the Q4 wording is softer</b>: “we expect to continue our progress towards double-digit growth”. Ad-Supported gross margin 18.7% (+105bps YoY, down from 19.1% in Q2).'
      ] },
    ]},
  { seg:'Pricing & ARPU', theme:'Pricing power, discovered late and used repeatedly', st:{ k:'trend', since:'Q3 2023', last:'Q3 2026' },
    why:'Fifteen years at $9.99, then three increases in under three years. Q2 2026 was the quarter that tested whether that is a cadence — and it passed.',
    updates:[
      { q:'Q3 2023', items:[
        'The <b>first broad Premium price increase</b>, across 50+ markets.'
      ] },
      { q:'Q3 2025', items:[
        'A further multi-market increase (Aug 2025) across South Asia, the Middle East, Africa, Europe, Latin America and Asia-Pacific.'
      ] },
      { q:'Q1 2026', items:[
        'US individual moved to <b>$12.99</b>; ARPU <b>€4.76, +5.7% cc</b>. The July/August 2025 increases lap in Q2 — the test of whether pricing compounds.'
      ] },
      { q:'Q2 2026', items:[
        '✔ <b>RESOLVED, bullishly.</b> Premium ARPU <b>€4.89, +7% reported and +7.4% constant-currency</b> — an acceleration from Q1\'s +5.7% cc, delivered in the quarter the 2025 increases lapped. Price-increase benefits partially offset by product/market mix.',
        'Premium revenue <b>€4,331M, +15% (+16% cc)</b> on 9% subscriber growth — so roughly half the segment\'s growth is now price rather than volume.'
      ] },
      { q:'Q3 2026', items:[
        '<b>ARPU €4.95, +9.3% and +7.5% constant-currency</b> (Q2: +7.4% cc), so the lap of the 2025 increases held for a second quarter; the deck credits price increases, partly offset by product and market mix.',
        '⚑ <b>The Q4 guide ties the €5.2B to ARPU growth of 4.5% to 5%</b>, “driven by recent pricing actions and the performance of our Audiobooks+ add-ons”, partly offset by “the lapping of prior year pricing actions across more than 150 markets”. On the 4Q25 base that is about €4.91–4.94 against a Street of €5.03.',
        'On 2027 pricing, Norström: it is “premature”; the recipe is value first (free tier, then Premium), then monetization by “advertising sales or price increases, add-ons, more subscriptions”.'
      ] },
    ]},
  { seg:'Users & subscribers', theme:'The user funnel is decelerating', st:{ k:'watch', since:'Q2 2026', last:'Q3 2026' },
    why:'MAU feeds both the subscription business and the advertising business. Two consecutive quarters of user growth being marked lower is the leading indicator for both — and it is what the stock reacted to.',
    updates:[
      { q:'Q2 2026 · Investor Day', items:[
        '<b>1 billion:</b> “nearly 340 million people” added since 2022 “puts us well on the path to 1 billion users”; in the 2030 framework “we believe we’re on our way to 1 billion MAU”, and the North Star is 1 billion subscribers, “not a top-down time exercise” but built from the markets where the model has run longest. Base then: 293M subscribers, over 760M MAU.',
        '<b>India</b> (the regional section): less than 10% of Indian users are on Premium, “not a challenge” but “our runway”; subscribers are seven times higher than at the last Investor Day and net adds in 2025 were three times those of 2022; “with 1.4 billion people… we can imagine a future with more than 150 million subscribers in India”. It is an aspiration with no date, not a target. Also: Brazil revenue to grow more than 30% in 2026.'
      ] },
      { q:'Q2 2026', items:[
        '<b>777M MAU against a 778M guide</b> — 16M net adds versus 17M guided, +12% YoY, with growth in every region. Ad-Supported MAUs 494M.',
        '<b>Premium subscribers crossed 300M</b> — 7M net adds against 6M guided, +9% YoY, growth in every region. Helped by a one-off: the 20th-anniversary in-app experience drew ~100M users in six days and drove <b>Spotify\'s biggest single day of subscriber intake ever</b>.',
        '⚑ <b>Q3 is then guided to 788M MAU (~11M adds) and 305M subscribers (~5M adds)</b> — the slowest additions on both lines in this dataset. The MAU guide is ~<b>5.6M below the ~793.6M consensus</b> (Visible Alpha), and is the main reason the shares fell ~4% pre-market.',
        '<b>Management says the deceleration is deliberate.</b> Norström: “sometimes we pull the growth lever, and sometimes we pull the monetization lever. <b>Here we\'re starting to pull the monetization lever</b>” — via “tweaking the sign-up to get a higher quality MAU throughput”, deprecating “lower-end Android device support”, and “friction in both <b>ad load</b> and some limitations in our <b>free tier</b>”, all in emerging markets. Luiga: “growth rates in developed markets remain stable.”',
        'The falsifiable part: it “will not affect subs growth in the near term”. Pressed on labels reporting an industry-wide premium slowdown, Norström said he is “<b>very confident</b>”, optimizing “for a healthy funnel… <b>not slowing it down</b>”. Q3 is the first test of that.'
      ] },
      { q:'Q3 2026', items:[
        '<b>MAU 788M, exactly on the guide</b> (+11M, +11% YoY); subscribers <b>306M, one million above the guide</b> (+6M, growth in every region). The test set a quarter ago passed: the funnel changes (sign-up hygiene, ad load, migration off lower-end clients) did not cost subscribers. The CEO calls it “optimizing our MAU growth across markets”.',
        'The <b>Q4 guide is 818M MAU (+30M, against +38M a year ago)</b> and 316M subscribers (+10M); the CEO’s durability frame is 25M or more net subscriber adds in every year since 2018, and 2026 is on track for 26M.',
        '<b>India</b> (Norström, answering on the free-tier friction in India and Indonesia): “it is a market where we have 1.4 billion users. We see GDP growth of 7%-8% several years in a row. What better market is there for us to work on to improve our business growth?” The Investor Day framed the same number as 1.4 billion people, with less than 10% of Indian users on Premium and an aspiration of more than 150M subscribers.'
      ] },
    ]},
  { seg:'Product & AI', theme:'AI as an efficiency programme, not just a product line', st:{ k:'promise', since:'Q2 2026', last:'Q3 2026' },
    why:'The AI spend is the main reason operating expenses grew 19% ex-FX — and management\'s defence is that it is compute and marketing, controllable and temporary, against a cost base that has not added people in three years.',
    updates:[
      { q:'Q2 2026 · Investor Day', items:[
        '<b>The investment, sized on the day</b> (Luiga): “a temporary increase of roughly EUR 200 million on marketing and R&D”, with operating expenses stepping up in Q2 and Q3 “before moderating into quarter 4 and 2027”. Marketing is “opportunistic” spend to drive conversion and LTV (acquisition cost is upfront, the payoff is higher lifetime value); AI R&D has two pieces, the large taste model (front-loaded) and recurring developer use of AI such as Claude Code (shorter build and ship cycles).',
        'The framework still points to an operating margin of at least 20% in 2030; US customer lifetime value is up more than 70% since 2022.'
      ] },
      { q:'Q2 2026', items:[
        '<b>Internal tooling led the presentation, not features.</b> <b>“Honk”</b> lets engineers fix bugs from Slack; <b>“Chirp”</b> is a model-agnostic inference engine that “seamlessly switch[es] between… paid models and a hosted open-source model”. The Large Taste Model uses “continuous pre-training” on an open-source base.',
        '<b>The efficiency claim:</b> “over the last three years, we have <b>not increased headcount</b> while revenue per employee is <b>on track to double</b>.” Luiga sized the investment at ~<b>€200M of incremental operating expense for the full year</b>, with personnel flat.',
        'Söderström on the shape: the year “started… by investing… leading in this wave of using AI” and is “now focusing on <b>cost and efficiency</b>”; the spend is “compute and marketing… within our control… <b>not long-term CapEx</b>”.',
        '<b>Reach so far:</b> AI experiences touch ~<b>25% of active users</b>; Prompted Playlists 14M of 100M actives; Song DNA past 100M users. Söderström says the Large Taste Model is “moving some of the metrics that are absolutely the hardest to move, which are <b>active days</b>”.',
        '<b>Licensing:</b> a <b>Merlin</b> agreement (~30,000 labels) joins the existing UMG deal, governed by “the three Cs” — consent, credit, compensation. Products are for “real artists, not fake artists”, and Spotify “do[es] not need a deal with all the majors” before a “research preview”.',
        '<b>Chirp</b> (Söderström): the engine under Honk, Spotify’s coding agent, used instead of Claude Code or Codex directly. It lets engineers “switch models mid-task and route every job to the best available price-performance, including open source models that we host ourselves, so that we are never locked in”; it “shares the context across not just different models and different developers, but across the company” (“we don’t pay for the same reasoning twice”) and shows inference spend down to the individual developer.',
        '<b>Chirp is offered outside:</b> “we’ve built this internal product called Chirp that we will also offer to other companies actually, because they’re asking for the same thing”, switching between a paid model and a hosted open-source one while keeping the project context.'
      ] },
      { q:'Q3 2026', items:[
        '<b>Operating expenses +26% reported, +19% ex-FX and social charges</b>, led by marketing and cloud/AI. The CFO: growth is “coming down meaningfully” and “we expect that moderation to continue into 2027”; Söderström: “they’re moderating in Q4 and into next year, just as we said”.',
        'Söderström on return: the large taste model shows “double-digit growth in discoveries”, “billions of listening hours per year”; token costs from the labs are down and Spotify routes between agents, including open-source models; after two six-month cycles, “significant acceleration” in shipped features. “You should expect us to remain at these investment levels.” Selling the internal developer tools to other companies is “mostly option value”.',
        '<b>The €200M, one quarter on:</b> the temporary step-up of about €200M of marketing and R&D (sized at the Investor Day and repeated on the Q2 call) is what shows in Q3 operating expenses, +26% reported and +19% ex-FX and social charges, led by marketing and cloud and AI; growth peaked in Q3 and moderates from Q4 into 2027. Selling the internal developer tools to other companies is described as “mostly option value” (Söderström); the Q3 call does not name Chirp.'
      ] },
    ]},
  { seg:'Cash & capital returns', theme:'Capital-light cash generation, now being returned', st:{ k:'trend', since:'Q1 2025', last:'Q3 2026' },
    why:'The quiet compounder underneath the debate: royalty-accrual timing plus deferred subscription revenue give Spotify a structurally favourable working-capital cycle, and almost no capex to fund.',
    updates:[
      { q:'Q2 2026 · Investor Day', items:[
        '<b>The ranking of capital use</b> (Luiga): invest organically first (R&D, content, marketing, new verticals) where returns are above the cost of capital; second, “we will allocate capital to acquisitions when they can accelerate our strategy. The bar is consistent, returns comfortably above our cost of capital with a clear path to cash flow accretion”; third, buy back the equity compensation granted each year (below 1 million shares) and, “even with M&A”, “return excess cash to shareholders” over and above that. Cash and short-term investments were €8.8B; “capital is not a constraint”. Norström: “we will also continue to explore inorganic investments, like we always have”.'
      ] },
      { q:'Q2 2026', items:[
        '<b>Free cash flow €797M</b>, a record second quarter — €816M of operating cash flow less <b>€21M of capex</b>. LTM free cash flow <b>€3.3B</b>; cumulative since 2016, €8.8B.',
        'Cash, restricted cash and short-term investments <b>€9.4B</b>. The €1.46B of Exchangeable Notes on the balance sheet at Dec 31 2025 were repaid in Q1 2026 and the line is now nil.',
        '<b>$662M of buybacks year to date through Aug 3 2026</b>, ~30% ahead of 2025; ~2.2M shares (≈1% of the count) since repurchases resumed. €232M repurchased in the quarter itself. Capital allocation stays with Daniel Ek as executive chairman.'
      ] },
      { q:'Q3 2026', items:[
        '<b>Free cash flow €735M, −9% YoY and 14% under the Street</b>, on working-capital and cash-tax timing; LTM €3.2B. Cash, restricted cash and short term investments <b>€9.9B with no debt other than leases</b> (the Exchangeable Notes are gone).',
        '<b>The return became explicit: $1.1B repurchased year to date through Oct 21</b> (2.2M shares), neutralizing this year’s dilution, with about 3M shares (~1.5%) since August 2025. The CFO: “we will start to return excess cash to shareholders, which we’ve proven this quarter”. No cadence or target.',
        '<b>M&A stays on the table</b> (Norström): inorganic opportunities “we will do those too, but there’s no real change there”, citing WhoSampled (the data behind About the Song, used by almost 100 million people), Findaway (audiobooks) and Sonantic (AI DJ). The buyback is the new part: 2.2 million shares for $1.1B year to date, with the CFO saying the company will “start to return excess cash to shareholders, which we’ve proven this quarter”.'
      ] },
    ]},
  { seg:'Royalties & legal', theme:'The audiobook bundle and the royalty it changed', st:{ k:'watch', since:'Q4 2023', last:'Q3 2026' },
    why:'The most consequential product decision in Spotify\'s history in profit terms — and the one being litigated.',
    updates:[
      { q:'Q4 2023', items:[
        'Audiobooks folded into Premium — which reclassified the subscription as a <b>bundle</b>, lowering the mechanical royalty owed to music publishers.'
      ] },
      { q:'Q1 2025', items:[
        'The MLC\'s suit <b>dismissed with prejudice</b> — the court held the Premium Service IS a bundle.'
      ] },
      { q:'Q1 2026', items:[
        'The MLC\'s <b>amended complaint</b> (filed Oct 2025) attacks how the bundle\'s components were valued. Quantified exposure if it succeeds: <b>~€358M</b> for Mar 2024–Dec 2025, plus penalties and interest.'
      ] },
      { q:'Q2 2026 · Investor Day', items:[
        '<b>Remixes and covers become a licensed product.</b> Norström on the “Wild West” of covers and remixes: “landmark licensing agreements with Universal Music Group and Universal Music Publishing Group. For the first time, fans will be able to legally create covers and remixes from participating artists’ and songwriters’ catalogs with both the original artist and the songwriter sharing in the value created.” It launches as a paid add-on, Premium users first, “consent, credit, and compensation by design”.',
        '<b>Audiobooks:</b> “roughly 20% of the audiobooks market in the U.S.” captured in a couple of years; the catalog is in over 20 markets, and Audiobooks+ is the first add-on (see the add-ons theme).'
      ] },
      { q:'Q2 2026', items:[
        '<b>No litigation development disclosed</b> in the Q2 deck — no change to the provision, no mention in the shareholder update.',
        'The mechanism is being <b>expanded, not wound back</b>: Audiobooks+ add-on tiers announced with higher-hour plans, Family and Student plans to follow later in 2026, Prompted Playlist extending to audiobooks, and <b>Narrated Articles</b> launched — long-form magazine stories included within Premium users\' monthly audiobook allowance.',
        'Context for the exposure: Premium gross margin reached a record <b>34.9%</b> this quarter, driven partly by audiobook costs growing slower than revenue — the same economics the claim attacks.'
      ] },
      { q:'Q3 2026', items:[
        '<b>Audiobooks go global: 22 to more than 180 markets by year-end</b>, inside the Q4 gross-margin guide. Listenership +40% before the global launch and “early but very strong indications on add-ons”.',
        '<b>The UMG and WMG agreements reach their two-year mark in Q1 2027.</b> Asked whether the renewals will be structured like the current deals, Norström: “we don’t speak to the specific of agreements with our partners”, a “reoccurring two-year rhythm”, “our interests are aligned”.',
        '<b>Sweden is the proof of scale</b> (Norström): “in Sweden, audiobooks are almost as big as music”, in the first and most established market, where nearly 50% of the population pays for Spotify. Audiobooks expand from 22 to more than 180 markets by year-end; listenership is up 40% before the global launch.'
      ] },
    ]},
  { seg:'Management & governance', theme:'Founder succession and the new management view', st:{ k:'watch', since:'Q3 2025', last:'Q1 2026' },
    why:'The first CEO change in twenty years — and the new leadership\'s first act was to redraw the segments.',
    updates:[
      { q:'Q3 2025', items:[
        'Announced 30 Sep 2025: <b>co-CEOs Norström and Söderström</b> from 1 Jan 2026, Daniel Ek to <b>executive chairman</b>. The co-CEOs <b>report to Ek</b>, who retains <b>capital allocation</b>.'
      ] },
      { q:'Q1 2026', items:[
        'First accounting act of the new leadership: effective 1 Jan 2026 revenue moved from <b>Ad-Supported into Premium</b> (2023–25 restated) to match what the new joint chief operating decision makers see.'
      ] },
      { q:'Q1 2026', items:[
        '<b>Investor Day, 21 May 2026</b> — the first public long-term framework: mid-teens revenue CAGR, <b>35–40% gross margin</b>, 20%+ operating margin by 2030.'
      ] },
    ]},
  { seg:'Pricing & ARPU', theme:'Add-ons lift ARPU structurally', st:{ k:'watch', since:'Q2 2026', last:'Q3 2026' },
    why:'Add-on tiers change ARPU by quantity rather than by list price. The test is whether add-ons become a visible ARPU driver in FY2027 once more verticals launch.',
    updates:[
      { q:'Q2 2026 · Investor Day', items:[
        '<b>The demand-curve argument</b> (Norström): “there is no such thing as an average user”; usage and willingness to pay follow a power law. The free tier captures “the very long tail”, Premium the middle, and add-ons are meant to “capture the full head of that curve”, the super users.',
        '<b>What it means for ARPU:</b> “a platform for a diverse set of higher ARPU products, each with a smaller individual TAM, but much higher ARPUs”. ARPU “will become a more meaningful growth driver, supported by thoughtful price adjustments, more defined product tiers, and an expanding mix of add-ons and à la carte offerings”.',
        '<b>The proof point is Audiobooks+:</b> “in less than a year, more than 1 million users are already paying” on top of their subscription, with “lifetime values that are multiples of Premium-only users”. The UMG remix and cover product is also framed as an add-on that “unlocks fan spending amongst our super users that doesn’t exist today”.'
      ] },
      { q:'Q2 2026', items:[
        'Alex Norström: Audiobooks+ “since we last shared a number on that has now <b>doubled</b>”; in his prepared remarks it “has passed <b>EUR 100 million in annual recurring revenue</b>” and audiobooks penetration among Premium has “more than doubled this year”.',
        'On timing and ARPU impact: “We don\'t comment on timing for launches, we don\'t give guidance on ARPU either.” An add-on “will structurally increase ARPU in a different way… in the price to quantity equation”.',
        'Pricing doctrine (management): “the more value we deliver, the more pricing power we will have. As of right now, <b>we\'re happy to be the price leader in our category</b>.” No comment on Apple Music\'s July increase.'
      ] },
      { q:'Q3 2026', items:[
        'Audiobooks+ add-ons are now named in the Q4 ARPU guide as a driver. Norström says add-ons show “early but very strong indications”; no add-on revenue figure was given on this call.'
      ] },
    ]},
  { seg:'Product & AI', theme:'Reserved ticketing', st:{ k:'watch', since:'Q2 2026', last:'Q2 2026' },
    why:'A Premium-only feature with Live Nation. Management positions it as value-to-price for Premium, not a revenue line.',
    updates:[
      { q:'Q2 2026', items:[
        'Alex Norström (prepared remarks): since the June US launch, “nearly <b>100,000 tickets</b> reserved through Spotify”; some allocations sold through 100% and Live Nation upsized them mid-run. On the Q&A: “<b>U.S. only for premium right now</b>… currently about increasing the value to price ratio on premium.”'
      ] },
    ]},
  { seg:'Product & AI', theme:'Agents are distribution, not displacement', st:{ k:'watch', since:'Q3 2026', last:'Q3 2026' },
    why:'Spotify’s answer to the agent risk is that the listening and the data stay inside Spotify while agents become one more integration, the way connected speakers did. The test is whether it shows up as growth or as an intermediary that can compare prices and cancel.',
    updates:[
      { q:'Q3 2026', items:[
        'Söderström: Spotify is now “an agent that you can not only click on in our app, but talk to”, integrated into ChatGPT first, then Meta Ray-Bans, OpenAI’s Dots and, at launch, Meta’s Muse. “Listening is actually not shifting. All the listening is happening through Spotify.”',
        'On the data: “We are not sending the data to these partners… We do the reasoning over everything we know about you.” On churn, asked about agents that cancel unused subscriptions: “we will never bet on you forgetting about your subscription”; over 100 million users use Spotify 28 days a month.',
        '⚑ <b>Open:</b> no number was given for listening that starts inside an agent, and nothing on whether any agent partner asks for a revenue share or for data.'
      ] },
    ]},
];
