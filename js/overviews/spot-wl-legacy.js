// overviews/spot-wl-legacy.js — the Watch List rows (WL_ROWS) as they stood in js/overviews/spot.js before the
// Oct 2026 move to the canonical Earnings machinery. KEPT VERBATIM (golden rule 1: nothing is deleted): the
// 11 rows over Q4 2023–Q3 2026, with their definitions, sources, tags and threads. The live seed for the Notes tab
// is js/themes-data/spot.js (one theme per hook, a hook and the earlier hook it continued merged); this file is
// the frozen record of how each hook was originally asked. Not imported by the portal.
export var SPOT_WL_ROWS_LEGACY=[
  // ── Q3 2026 — each one continues a Q2 thread ───────────────────────────────────────
  { id:'wl007', q:'Q3 2026', rank:1, theme:'“Pulling the monetization lever” — does subscriber growth survive it?',
    tags:['users','guidance','pricing'], trackSince:'Q2 2026', trackUntil:null,
    seededBy:{ q:'Q2 2026', tripped:true, n:'MAU came in 1M light and Q3 was then guided to 11M adds — 5.6M below consensus' },
    definition:'Spotify is deliberately slowing its free base to convert it better, and says this “will not affect subs growth in the near term”. <b>Q3 is the test:</b> 305M subs with ARPU still growing confirms it; both slowing together does not.',
    src:'Q2 2026: 777M MAU vs 778M guided (16M adds vs 17M); subs 300M vs 299M. Q3 guide: 788M MAU (~11M adds, vs ~793.6M consensus — Visible Alpha) and 305M subs. Call: Norström — “sometimes we pull the growth lever, and sometimes we pull the monetization lever. Here we\'re starting to pull the monetization lever”; measures are “tweaking the sign-up”, deprecating “lower-end Android device support”, and “friction in both ad load and some limitations in our free tier”. Luiga: “growth rates in developed markets remain stable.”',
    thread:[
      { q:'Q2 2026', n:'MAU missed for the first time in this record — 777M vs 778M guided, 16M adds against 17M — while subscribers beat (300M vs 299M), helped by the 20th-anniversary promotion driving Spotify\'s <b>biggest single day of subscriber intake ever</b>. The two lines diverged, which is why the guide mattered more than the print.' },
      { q:'Q2 2026', n:'<b>The call reframed it from a miss into a choice.</b> Norström: “here we\'re starting to pull the <b>monetization lever</b>” — sign-up friction, deprecating lower-end Android, ad-load and free-tier limits, all in emerging markets, with developed markets “stable”. Pressed on labels reporting an industry-wide premium slowdown, he said he is “very confident”, optimizing “for a healthy funnel… <b>not slowing it down</b>”.' },
      { q:'Q3 2026', n:'<b>Now the central question on the name</b>, and the only one the call could not settle. Watch: subs landing at 305M, ARPU holding near +7% cc, and whether ad-supported MAU (494M) stalls — that last one decides whether the advertising inflection has an audience to sell.' }
    ] },
  { id:'wl008', q:'Q3 2026', rank:2, theme:'The advertising “inflection to double-digit growth in H2 2026”',
    tags:['advertising','sax','guidance'], trackSince:'Q2 2025', trackUntil:null,
    seededBy:{ q:'Q2 2026', tripped:true, n:'The clean comp produced the same +3% cc — and management then committed to double-digit H2' },
    definition:'Two years of rebuilding have produced +3% constant-currency twice running. Management has now committed to <b>double-digit growth in H2 2026</b> — so this stops being a question and becomes <b>the most checkable promise on the name</b>.',
    src:'Q2 2026: Ad-Supported €446M, +1% reported / +3% cc (restated basis), gross margin 19.1% (+179bp). Call: Luiga — “we continue to expect our ads business to inflect towards double-digit growth in the second half of 2026”, margin moving “from the 20% range we have today towards 40% over time”. Norström — “99% of all the impressions [are] now on our own ad stack”; automated channels ~40% of ad revenue, up from 30%; “33,000 active advertisers… 60% up from last year”. Summit carries €496M for Q3 (~+11%).',
    thread:[
      { q:'Q2 2025', n:'<b>Spotify Ad Exchange launched 1 Apr 2025</b> — programmatic real-time auctions replacing insertion-order selling. The deliberate trade: advertising VOLUME for advertising MARGIN.' },
      { q:'Q4 2025', n:'The margin half works — Ad-Supported gross margin roughly <b>doubled</b> YoY (11.2% → 17.4% restated) on revenue that was flat to down.' },
      { q:'Q1 2026', n:'€385M, <b>+3% cc</b>. Management called the dip a transition effect that would annualize out once the launch comp cleared.' },
      { q:'Q2 2026', n:'⚑ <b>The clean comp failed.</b> €446M, +1% reported and <b>+3% cc — identical to Q1</b>, in the first quarter not distorted by the rebuild. The dip did not annualize out on its own. Margin kept improving (19.1%, +179bp), so the fair summary became: Spotify converted a low-margin growing business into a higher-margin flat one.' },
      { q:'Q2 2026', n:'<b>On the call it became a commitment.</b> Luiga: “inflect towards <b>double-digit growth in the second half of 2026</b>.” Norström declared the migration finished — 99% of impressions on Spotify\'s own stack, automated channels ~40% of ad revenue, advertisers +60% YoY to 33,000.' },
      { q:'Q3 2026', n:'<b>First of the two quarters that must deliver it.</b> Also resolves Summit\'s €496M (~+11%), which looked heroic against the deck and looks like guidance against the call. Watch pricing per impression — Q2 growth was impressions sold “partially offset by softness in pricing”, and volume-only growth caps where this can go.' }
    ] },
  { id:'wl009', q:'Q3 2026', rank:3, theme:'The €200M investment year — does opex actually moderate?',
    tags:['costs','guidance'], trackSince:'Q2 2026', trackUntil:null,
    seededBy:{ q:'Q2 2026', tripped:false, n:'Opex grew 3% reported but 19% excluding FX and social charges' },
    definition:'Reported opex grew 3%; the real number is <b>+19% ex-FX and social charges</b>. Management has sized it at ~€200M for the year and calls it controllable, not capital. This tracks whether the promised moderation actually arrives.',
    src:'Q2 2026: opex €941M (+3% reported, +4% ex-FX, +19% excluding FX AND social charges). R&D €403M, S&M €390M, G&A €148M. Call: Luiga — “approximately €200 million in incremental operating expense for the full year”, personnel flat. Söderström — “compute and marketing… within our control… not long-term CapEx”; “over the last three years, we have not increased headcount while revenue per employee is on track to double”. Q3 operating income guided €670M vs ~€677.8M consensus (Visible Alpha).',
    thread:[
      { q:'Q2 2026', n:'Operating income beat the guide for a fifth straight quarter (€655M vs €630M) — but <b>€9M of the €25M was a social-charges windfall from a FALLING share price</b>, not operations. Underneath, opex grew <b>19% ex-FX and social charges</b> on marketing plus cloud and AI.' },
      { q:'Q2 2026', n:'<b>The call sized it and framed it.</b> ~<b>€200M incremental for the FULL YEAR</b> (not the quarter), personnel flat. Söderström: the year “started… by investing” and is “now focusing on <b>cost and efficiency</b>”. The structural defence: headcount flat for three years while revenue per employee is “on track to double”.' },
      { q:'Q3 2026', n:'The original question — conservatism or the end of margin expansion — is answered: <b>neither, it is a sized investment year</b>. What is left is sequencing. Watch for the peak quarter and for Q4 moderation; Summit sits 4.3% above the €670M guide, betting the conservatism holds.' }
    ] },
  { id:'wl006', q:'Q3 2026', rank:4, theme:'Gross margin vs the 35–40% promise — verify the Q3 regulatory charge',
    tags:['margin','investor-day'], trackSince:'Q2 2026', trackUntil:null,
    seededBy:{ q:'Q2 2026', tripped:false, n:'A record 33.4% and then a guide 50bp lower — explained on the call as an annual Q3 charge' },
    definition:'<b>Demoted by the call, not resolved by it.</b> The 32.9% guide is blamed on an annual Q3 regulatory-fee charge — a satisfying answer that is so far unverified. If it is genuinely annual it should be visible in 3Q25 and 3Q24 too.',
    src:'Q2 2026: gross margin 33.4% vs 33.1% guided, +193bp YoY; Premium 34.9%, Ad-Supported 19.1%. Q3 guide 32.9%, described by Luiga as “approximately 130 basis points above the prior year” and as including “a typical charge we take in the third quarter to account for our annual exposure to regulatory fees in one of our markets”. Investor Day (21 May 2026): 35–40% gross margin and 20%+ operating margin by 2030, against 32.0% in FY2025. Summit\'s segment lines imply ~33.6% for Q3.',
    thread:[
      { q:'Q4 2025', n:'33.1%, a record at the time; FY2025 closed at <b>32.0%</b> against 30.1% in FY2024.' },
      { q:'Q1 2026', n:'33.0%, ~+140bp YoY — but the Q2 guide added only <b>ten basis points</b>, the first quarter where the guided path looked slower than the promised one.' },
      { q:'Q2 2026', n:'<b>33.4% — an all-time record</b>, beating the guide by 30bp, +193bp YoY, both segments contributing. Then Q3 was guided to <b>32.9%</b>, a 50bp step DOWN, unexplained in the deck. For a few hours this read as the first guided move away from the 2030 commitment.' },
      { q:'Q2 2026', n:'<b>The call defused it.</b> Luiga: reinvestment plus “a typical charge we take in the third quarter to account for our <b>annual exposure to regulatory fees</b> in one of our markets”, and the guide is still <b>~130bp ABOVE the prior year</b>. Hook demoted from #1 to #4 and reframed from alarm to verification.' },
      { q:'Q3 2026', n:'<b>Check the claim, do not accept it:</b> pull 3Q25 and 3Q24 gross margin against their own guides and look for the same seasonal step. Note the model is not carrying the charge (~33.6% implied), so a clean 32.9% print is a small Summit miss with a benign cause.' }
    ] },
  { id:'wl010', q:'Q3 2026', rank:5, theme:'Does the buyback lean into the drawdown?',
    tags:['capital-allocation'], trackSince:'Q2 2026', trackUntil:null,
    seededBy:{ q:'Q2 2026', tripped:false, n:'Nobody asked about capital allocation on the call, and management did not volunteer it' },
    definition:'€9.4B of cash, €3.3B of LTM free cash flow, and a stock that fell on a guide rather than on a quarter. The Q3 repurchase pace is the one signal here that <b>needs no interpretation</b> — and it earns a slot precisely because it went unasked.',
    src:'Q2 2026 deck: $662M repurchased year to date through Aug 3 2026, ~30% ahead of 2025; ~2.2M shares (≈1% of shares outstanding) since repurchases resumed in 2025, €232M in the quarter itself. Cash, restricted cash and short-term investments €9.4B; the €1.46B of Exchangeable Notes outstanding at Dec 31 2025 were repaid in Q1 2026. Capital allocation sits with Daniel Ek as executive chairman, not with the co-CEOs.',
    thread:[
      { q:'Q2 2026', n:'Record Q2 free cash flow of <b>€797M</b> on €21M of capex; LTM €3.3B, cash €9.4B. Buybacks running <b>~30% ahead of 2025</b> at $662M year to date.' },
      { q:'Q2 2026', n:'<b>Not one of the thirteen analyst questions touched capital allocation</b> — the call went to AI products, ticketing, engagement and pricing. Plausibly because it sits with Ek as executive chairman rather than with the co-CEOs on the line.' },
      { q:'Q3 2026', n:'The shares fell on the guide, so Q3 repurchase disclosure is a direct read on how management values the stock at this level. Cheap to check, and it either confirms conviction or it does not.' }
    ] },
  { id:'wl011', q:'Q3 2026', rank:6, theme:'MLC litigation — the audiobook bundle\'s royalty tail',
    tags:['legal','royalties'], trackSince:'Q4 2023', trackUntil:null,
    seededBy:{ q:'Q2 2026', tripped:false, n:'Quiet quarter — no development disclosed, while the bundle mechanism kept expanding' },
    definition:'A live claim against the exact mechanism that lifted Premium gross margin to a record 34.9%. Nothing moved in Q2 — <b>and Spotify kept expanding the bundle anyway</b>.',
    src:'FY2025 20-F: if the MLC ultimately succeeds, ~€358M for Mar 2024–Dec 2025 plus penalties and interest. Dismissed with prejudice Jan 2025 (the court held the Premium Service IS a bundle); amended complaint filed Oct 2025 attacking how the bundle\'s components were valued. No change to the provision or any mention in the Q2 2026 deck.',
    thread:[
      { q:'Q4 2023', n:'Audiobooks folded into Premium, reclassifying the subscription as a <b>bundle</b> and lowering the mechanical royalty owed to music publishers.' },
      { q:'Q1 2025', n:'The MLC\'s suit <b>dismissed with prejudice</b> — the court held the Premium Service IS a bundle.' },
      { q:'Q1 2026', n:'<b>Amended complaint</b> (filed Oct 2025) attacks how the bundle\'s components were valued. Exposure if it succeeds: <b>~€358M</b> for Mar 2024–Dec 2025 plus penalties and interest.' },
      { q:'Q2 2026', n:'<b>No development disclosed</b> — no change to the provision, no mention in the deck. But the mechanism was <b>expanded</b>: Audiobooks+ tiers announced, Family and Student to follow, Prompted Playlist extending to audiobooks, and <b>Narrated Articles</b> launched inside the Premium audiobook allowance. On the call, Audiobooks+ was disclosed as past <b>€100M ARR</b> with penetration “more than doubled this year”.' },
      { q:'Q3 2026', n:'Stays open by design — so a quiet quarter is <b>recorded as quiet rather than forgotten</b>. The larger the add-on business gets, the larger the tail on an adverse ruling.' }
    ] },

  // ── Q2 2026 — the frozen record, as the list stood going into the print.
  // ⚠ ONLY ONE OF THESE IS ACTUALLY CLOSED. wl003 (pricing) was answered, so it carries
  // `trackUntil` and renders "closed". The other four are STILL LIVE and merely handed to a
  // Q3 successor, so they carry `continuedBy` and render "carried forward ↗" — marking them
  // `trackUntil:'Q2 2026'` would have claimed we stopped watching four questions we are
  // still watching. Both states drop out of the open count so a question is never counted twice.
  { id:'wl001', q:'Q2 2026', rank:1, theme:'The operating-income guide: conservatism or the end of margin expansion?',
    tags:['margin','guidance'], trackSince:'Q2 2026', trackUntil:null, continuedBy:'wl009',
    definition:'Spotify guided Q2 operating income BELOW the quarter it had just printed and ~8% under the Street. Either conservatism explains it, or the 2025 margin story has run its course.',
    src:'Q1 2026 deck (28 Apr 2026): Q2 guide €630M vs €715M printed in Q1; Street was carrying ~€684M. The stock fell on the guide despite a clean Q1 beat.',
    thread:[
      { q:'Q2 2026', n:'<b>Conservatism won — with an asterisk.</b> €655M vs €630M, a fifth straight beat, but €9M of the €25M was a social-charges windfall from a falling share price. Strip it and the beat is ~€16M against opex growing 19% ex-FX.' },
      { q:'Q2 2026', n:'<b>The binary is answered:</b> it is neither conservatism nor the end of expansion — it is a <b>sized investment year</b> (~€200M incremental, personnel flat). What is <i>not</i> answered is whether the spend moderates, so the hook <b>carries forward as Q3 #3</b> rather than closing.' }
    ] },
  { id:'wl002', q:'Q2 2026', rank:2, theme:'Has the SAX rebuild stopped shrinking advertising?',
    tags:['advertising','sax'], trackSince:'Q2 2026', trackUntil:null, continuedBy:'wl008',
    definition:'Spotify traded advertising volume for advertising margin. Q2 is the first clean comp against the April 2025 SAX launch — the first honest read on whether the trade is working.',
    src:'Q1 2026: Ad-Supported revenue €385M, +3% constant-currency. FY2025: ad gross margin 18.0% (restated 17.4%) vs 11.2% in FY2024, on revenue that was flat to down.',
    thread:[
      { q:'Q2 2026', n:'<b>It stopped shrinking but did not start growing:</b> €446M, +3% cc — the SAME as Q1, in the quarter that was supposed to settle it. The transition-dip explanation failed its own test. Margin half worked (19.1%, +179bp).' },
      { q:'Q2 2026', n:'<b>The call turned the question into a commitment</b> — “inflect towards double-digit growth in H2 2026”, migration declared finished at 99% of impressions. Still very much live: <b>carries forward as Q3 #2</b>, restated as a promise to check rather than a question to ask.' }
    ] },
  { id:'wl003', q:'Q2 2026', rank:3, theme:'Do the price increases compound, or was 2025 a one-off step?',
    tags:['pricing','arpu'], trackSince:'Q2 2026', trackUntil:'Q2 2026',
    definition:'Fifteen years at $9.99, then three increases in under three years. Q2 is when the July/August 2025 rises LAP — separating a real pricing cadence from a one-off re-rate. <b>→ Resolved; no successor needed.</b>',
    src:'Q1 2026: Premium ARPU €4.76, +5.7% constant-currency, on the Jan 2026 US move and increases across 150+ markets.',
    thread:[
      { q:'Q2 2026', n:'<b>✔ ANSWERED, bullishly — the most informative line of the print.</b> ARPU €4.89, <b>+7.4% cc</b>, an ACCELERATION from Q1\'s +5.7%, delivered in the very quarter the 2025 increases lapped. Pricing behaves like a cadence, not a re-rate. <b>Closed with no successor;</b> the ongoing product/market mix drag belongs with the MAU hook.' }
    ] },
  { id:'wl004', q:'Q2 2026', rank:4, theme:'Gross margin against the 35–40% promise',
    tags:['margin','investor-day'], trackSince:'Q2 2026', trackUntil:null, continuedBy:'wl006',
    definition:'Management committed to 35–40% gross margin by 2030 against 32.0% in FY2025, then guided Q2 up only ten basis points. Tracks the gap between the guided trajectory and the required one.',
    src:'Investor Day, 21 May 2026: mid-teens revenue CAGR, 35–40% gross margin, 20%+ operating margin by 2030. Q2 2026 gross-margin guide: 33.1% vs 33.0% printed in Q1.',
    thread:[
      { q:'Q2 2026', n:'<b>The print helped, the guide alarmed, the call defused it.</b> 33.4% — a record, 30bp above guide, +193bp YoY. Then Q3 guided to 32.9%, unexplained in the deck; on the call Luiga attributed it to reinvestment plus an <b>annual Q3 regulatory-fee charge</b>, still ~130bp above the prior year.' },
      { q:'Q2 2026', n:'<b>Demoted, not resolved.</b> Q3 #4 carries it, reframed from “is the trajectory breaking?” to “verify the charge is genuinely annual against 3Q25 and 3Q24”.' }
    ] },
  { id:'wl005', q:'Q2 2026', rank:5, theme:'MLC litigation — the audiobook bundle\'s royalty tail',
    tags:['legal','royalties'], trackSince:'Q4 2023', trackUntil:null, continuedBy:'wl011',
    definition:'Bundling audiobooks lowered the mechanical royalty Spotify owes publishers. A court agreed it IS a bundle; the MLC still attacks how it was valued. A live claim against the mechanism that lifted gross margin.',
    src:'FY2025 20-F: if the MLC ultimately succeeds, ~€358M for Mar 2024–Dec 2025 plus penalties and interest. Dismissed with prejudice Jan 2025; amended complaint filed Oct 2025.',
    thread:[
      { q:'Q2 2026', n:'<b>Quiet quarter — recorded as quiet.</b> No development disclosed, no change to the provision. Meanwhile the mechanism was <b>expanded</b> (Audiobooks+ tiers, Narrated Articles), and Premium gross margin hit a record 34.9%. Nothing is resolved — it <b>carries forward as Q3 #6</b> with the full thread from Q4 2023.' }
    ] }
];