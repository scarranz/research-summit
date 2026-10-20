// themes-data/spot.js — Spotify's theme record (Evolution ▸ Earnings ▸ Notes), the static seed.
//
// Contract: docs/PROFILE_PLAYBOOK.md §12 EV-NOTES and §24. Two readers: the Notes tab (js/overviews/spot-ce.js)
// and, when Top Line is rebuilt on the segments engine, Top Line ▸ Segments ▸ "What management has said".
// Once the portal has saved a record (Supabase table company_theme_record) that copy wins and this seed
// is no longer read.
//
// Moved Oct 2026 from js/overviews/spot.js (the SPOT_THEMES record, 8 themes over Q3 2023–Q2 2026) with two
// change: each theme gained a `seg` (the canonical Notes groups themes under a segment). The Watch List hooks (WL_ROWS,
// wl001–wl011) restate these themes quarter by quarter; they are preserved verbatim in js/overviews/spot-wl-legacy.js
// and are not merged here. Two themes were added from the 4 Aug 2026
// transcript (Add-ons lift ARPU structurally; Reserved ticketing). The original Watch List rows are preserved
// verbatim in js/overviews/spot-wl-legacy.js, including the Q3 2026 previews, which are not call notes.
// Sources of the original record, as written there:
// var SRC_CALLS='Spotify FY2025 Form 20-F, the Q1 2026 and Q2 2026 6-Ks and shareholder updates (the Q2 2026 Update is Exhibit 99.1 to the Form 6-K of 4 Aug 2026), the May 2026 Investor Day remarks, the Q2 2026 earnings call of 4 Aug 2026 (Bryan Goldberg IR; Alex Norström and Gustav Söderström, Co-CEOs; Christian Luiga, CFO), and earnings-day coverage. ⚠ A per-call record (docs/calls/SPOT*.md) has still NOT been written — the Q2 2026 call is quoted here from the published transcript, but the earlier threads are compiled from filings and decks rather than from transcripts. Building the calls repository back through 2024 is the next step.';
export var SPOT_THEMES = [
  { seg:'Margins & investment', theme:'The gross-margin climb — and the 2030 promise', st:{ k:'promise', since:'Q1 2025', last:'Q2 2026' },
    why:'The entire equity story: 32.0% in FY2025 against a 35–40% commitment by 2030. Every lever is a different negotiation with a rights holder — and the guided path has just pointed down for the first time.',
    updates:[
      { q:'Q4 2025', items:[
        'Consolidated gross margin <b>33.1%</b>, a record at the time; FY2025 closed at <b>32.0%</b> against 30.1% in FY2024.'
      ] },
      { q:'Q1 2026', items:[
        '<b>33.0%</b>, roughly +140bps YoY. Guidance for Q2 adds only <b>ten basis points</b> (33.1%) — the first quarter where the guided trajectory looks slower than the promised one.'
      ] },
      { q:'Q2 2026', items:[
        '<b>33.4% — an all-time record</b>, +193bps YoY and 30bps ABOVE the guide. Premium <b>34.9%</b> (+174bps, revenue outpacing music costs net of marketplace programs, audiobooks and video podcasts); Ad-Supported <b>19.1%</b> (+179bps, favourable podcast and tax impacts).',
        '⚑ <b>And then the guide stepped DOWN.</b> Q3 2026 is guided to <b>32.9%</b> — 50bps below the record just set, with no explanation in the deck. Ten weeks after the Investor Day put 35–40% by 2030 on the record, this is the first guided move in the wrong direction. Summit\'s segment lines imply ~33.6%, so the model does not accept it.'
      ] },
    ]},
  { seg:'Advertising', theme:'Advertising rebuilt around the exchange (SAX)', st:{ k:'watch', since:'Q2 2025', last:'Q2 2026' },
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
      { q:'Q2 2026', items:[
        '⚑ <b>The clean comp came and went: €446M, +1% reported and +3% constant-currency — identical to Q1.</b> 2Q25 was the first quarter fully after the SAX launch, so this was the honest read, and the transition-dip explanation did not survive it.',
        'Management attributes what growth there is to <b>impressions sold, partially offset by pricing softness</b>, with podcast sponsorship in the Owned &amp; Licensed portfolio leading.',
        'The margin half of the trade keeps working — <b>19.1% gross margin, +179bps</b>. Luiga put a destination on it: from “the 20% range we have today <b>towards 40% over time</b>”.',
        '<b>On the call the migration was declared finished and a dated commitment made.</b> Norström: “<b>99% of all the impressions</b> [are] now on our own ad stack”; automated channels ~<b>40% of ad revenue, up from 30%</b>; <b>33,000 active advertisers, +60% YoY</b>, 7,000 using the AI audio asset-creation tool. Luiga: “we continue to expect our ads business to <b>inflect towards double-digit growth in the second half of 2026</b>.” Q3 is the first of the two quarters that must deliver it.'
      ] },
    ]},
  { seg:'Pricing & ARPU', theme:'Pricing power, discovered late and used repeatedly', st:{ k:'trend', since:'Q3 2023', last:'Q2 2026' },
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
    ]},
  { seg:'Users & subscribers', theme:'The user funnel is decelerating', st:{ k:'watch', since:'Q2 2026', last:'Q2 2026' },
    why:'MAU feeds both the subscription business and the advertising business. Two consecutive quarters of user growth being marked lower is the leading indicator for both — and it is what the stock reacted to.',
    updates:[
      { q:'Q2 2026', items:[
        '<b>777M MAU against a 778M guide</b> — 16M net adds versus 17M guided, +12% YoY, with growth in every region. Ad-Supported MAUs 494M.',
        '<b>Premium subscribers crossed 300M</b> — 7M net adds against 6M guided, +9% YoY, growth in every region. Helped by a one-off: the 20th-anniversary in-app experience drew ~100M users in six days and drove <b>Spotify\'s biggest single day of subscriber intake ever</b>.',
        '⚑ <b>Q3 is then guided to 788M MAU (~11M adds) and 305M subscribers (~5M adds)</b> — the slowest additions on both lines in this dataset. The MAU guide is ~<b>5.6M below the ~793.6M consensus</b> (Visible Alpha), and is the main reason the shares fell ~4% pre-market.',
        '<b>Management says the deceleration is deliberate.</b> Norström: “sometimes we pull the growth lever, and sometimes we pull the monetization lever. <b>Here we\'re starting to pull the monetization lever</b>” — via “tweaking the sign-up to get a higher quality MAU throughput”, deprecating “lower-end Android device support”, and “friction in both <b>ad load</b> and some limitations in our <b>free tier</b>”, all in emerging markets. Luiga: “growth rates in developed markets remain stable.”',
        'The falsifiable part: it “will not affect subs growth in the near term”. Pressed on labels reporting an industry-wide premium slowdown, Norström said he is “<b>very confident</b>”, optimizing “for a healthy funnel… <b>not slowing it down</b>”. Q3 is the first test of that.'
      ] },
    ]},
  { seg:'Product & AI', theme:'AI as an efficiency programme, not just a product line', st:{ k:'promise', since:'Q2 2026', last:'Q2 2026' },
    why:'The AI spend is the main reason operating expenses grew 19% ex-FX — and management\'s defence is that it is compute and marketing, controllable and temporary, against a cost base that has not added people in three years.',
    updates:[
      { q:'Q2 2026', items:[
        '<b>Internal tooling led the presentation, not features.</b> <b>“Honk”</b> lets engineers fix bugs from Slack; <b>“Chirp”</b> is a model-agnostic inference engine that “seamlessly switch[es] between… paid models and a hosted open-source model”. The Large Taste Model uses “continuous pre-training” on an open-source base.',
        '<b>The efficiency claim:</b> “over the last three years, we have <b>not increased headcount</b> while revenue per employee is <b>on track to double</b>.” Luiga sized the investment at ~<b>€200M of incremental operating expense for the full year</b>, with personnel flat.',
        'Söderström on the shape: the year “started… by investing… leading in this wave of using AI” and is “now focusing on <b>cost and efficiency</b>”; the spend is “compute and marketing… within our control… <b>not long-term CapEx</b>”.',
        '<b>Reach so far:</b> AI experiences touch ~<b>25% of active users</b>; Prompted Playlists 14M of 100M actives; Song DNA past 100M users. Söderström says the Large Taste Model is “moving some of the metrics that are absolutely the hardest to move, which are <b>active days</b>”.',
        '<b>Licensing:</b> a <b>Merlin</b> agreement (~30,000 labels) joins the existing UMG deal, governed by “the three Cs” — consent, credit, compensation. Products are for “real artists, not fake artists”, and Spotify “do[es] not need a deal with all the majors” before a “research preview”.'
      ] },
    ]},
  { seg:'Cash & capital returns', theme:'Capital-light cash generation, now being returned', st:{ k:'trend', since:'Q1 2025', last:'Q2 2026' },
    why:'The quiet compounder underneath the debate: royalty-accrual timing plus deferred subscription revenue give Spotify a structurally favourable working-capital cycle, and almost no capex to fund.',
    updates:[
      { q:'Q2 2026', items:[
        '<b>Free cash flow €797M</b>, a record second quarter — €816M of operating cash flow less <b>€21M of capex</b>. LTM free cash flow <b>€3.3B</b>; cumulative since 2016, €8.8B.',
        'Cash, restricted cash and short-term investments <b>€9.4B</b>. The €1.46B of Exchangeable Notes on the balance sheet at Dec 31 2025 were repaid in Q1 2026 and the line is now nil.',
        '<b>$662M of buybacks year to date through Aug 3 2026</b>, ~30% ahead of 2025; ~2.2M shares (≈1% of the count) since repurchases resumed. €232M repurchased in the quarter itself. Capital allocation stays with Daniel Ek as executive chairman.'
      ] },
    ]},
  { seg:'Royalties & legal', theme:'The audiobook bundle and the royalty it changed', st:{ k:'watch', since:'Q4 2023', last:'Q2 2026' },
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
      { q:'Q2 2026', items:[
        '<b>No litigation development disclosed</b> in the Q2 deck — no change to the provision, no mention in the shareholder update.',
        'The mechanism is being <b>expanded, not wound back</b>: Audiobooks+ add-on tiers announced with higher-hour plans, Family and Student plans to follow later in 2026, Prompted Playlist extending to audiobooks, and <b>Narrated Articles</b> launched — long-form magazine stories included within Premium users\' monthly audiobook allowance.',
        'Context for the exposure: Premium gross margin reached a record <b>34.9%</b> this quarter, driven partly by audiobook costs growing slower than revenue — the same economics the claim attacks.'
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
  { seg:'Pricing & ARPU', theme:'Add-ons lift ARPU structurally', st:{ k:'watch', since:'Q2 2026', last:'Q2 2026' },
    why:'Add-on tiers change ARPU by quantity rather than by list price. The test is whether add-ons become a visible ARPU driver in FY2027 once more verticals launch.',
    updates:[
      { q:'Q2 2026', items:[
        'Alex Norström: Audiobooks+ “since we last shared a number on that has now <b>doubled</b>”; in his prepared remarks it “has passed <b>EUR 100 million in annual recurring revenue</b>” and audiobooks penetration among Premium has “more than doubled this year”.',
        'On timing and ARPU impact: “We don\'t comment on timing for launches, we don\'t give guidance on ARPU either.” An add-on “will structurally increase ARPU in a different way… in the price to quantity equation”.',
        'Pricing doctrine (management): “the more value we deliver, the more pricing power we will have. As of right now, <b>we\'re happy to be the price leader in our category</b>.” No comment on Apple Music\'s July increase.'
      ] },
    ]},
  { seg:'Product & AI', theme:'Reserved ticketing', st:{ k:'watch', since:'Q2 2026', last:'Q2 2026' },
    why:'A Premium-only feature with Live Nation. Management positions it as value-to-price for Premium, not a revenue line.',
    updates:[
      { q:'Q2 2026', items:[
        'Alex Norström (prepared remarks): since the June US launch, “nearly <b>100,000 tickets</b> reserved through Spotify”; some allocations sold through 100% and Live Nation upsized them mid-run. On the Q&A: “<b>U.S. only for premium right now</b>… currently about increasing the value to price ratio on premium.”'
      ] },
    ]},
];
