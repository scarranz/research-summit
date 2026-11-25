/* Management & ownership — who runs SpaceX, who controls it, what it pays them in stock, and when shares unlock.
   Data constants below are frozen from primary documents (pulled Nov 25 2026). $ millions and millions of shares unless stated.
   424B4 = final prospectus, Jun 11 2026 (filed Jun 12 2026). 10-Q Q2 = quarter to Jun 30 2026. 10-Q Q3 = quarter to Sep 30 2026. */

/* 424B4 "Management" (ages as of May 1 2026), "Composition of Our Board", "Director Independence", "Board Committees" */
const OWN_BOARD = [
  // name, age, role, since, board seat, independent, background
  ['Elon Musk', 54, 'Chief Executive Officer, Chief Technical Officer and Chairman', 'May 2002 (founder)', 'Class B director', false,
   'Also CEO of Tesla (since Oct 2008), Neuralink and The Boring Company; co-founded PayPal and Zip2'],
  ['Gwynne Shotwell', 62, 'President, Chief Operating Officer and Director', 'President & COO since 2008; board since Mar 2009', 'Class B director', false,
   'Joined in 2002 as VP Business Development; earlier Microcosm and The Aerospace Corporation; Polaris board'],
  ['Bret Johnsen', 57, 'Chief Financial Officer', '2011', '—', null,
   'CFO of Mindspeed Technologies 2008–11; Broadcom 1999–2008 (incl. VP and Corporate Controller); CPA'],
  ['Ira Ehrenpreis', 57, 'Director', 'Feb 2026', 'Common Stock director', true,
   'Founder and managing member of DBL Partners (venture capital); Tesla board member'],
  ['Randy Glein', 60, 'Director · audit committee chair', 'Feb 2026 (board observer since 2009)', 'Common Stock director', true,
   'Co-founder and managing partner of DFJ Growth; former CFO of FeedBurner'],
  ['Antonio J. Gracias', 55, 'Director', 'Oct 2010', 'Class B director', false,
   'CEO and CIO of Valor (over $55B AUM), counterparty to the GPU sale-leasebacks; Tesla director 2007–21'],
  ['Donald Harrison', 54, 'Director', 'Feb 2015', 'Class B director', true,
   'President, Global Partnerships and Corporate Development at Google since 2017'],
  ['Steve Jurvetson', 59, 'Director · audit committee', 'Mar 2009', 'Common Stock director', true,
   'Co-founder of Future Ventures; co-founded Draper Fisher Jurvetson; Tesla director 2009–20'],
  ['Luke Nosek', 50, 'Director', 'Jul 2008', 'Class B director', true,
   'Co-founder of Gigafund; co-founded Founders Fund and PayPal']
];

/* 424B4 cover, "Controlled Company Exemption", security-ownership table (after the offering, no over-allotment) and
   "Description of Capital Stock" (as adjusted: 7,380,196,910 Class A + 5,695,668,265 Class B outstanding) */
const OWN_CTRL = {
  shA:7380.2, shB:5695.7,                    // as adjusted after the IPO
  muskA:849.5, muskB:5569.1, muskOpt:350.0,  // beneficial: Class B incl. 350M shares under options exercisable within 60 days of May 1 2026
  muskRestricted:1302.1,                     // restricted Class B (CEO awards), outstanding, voted by Mr. Musk, unvested
  voteCover:82.4, voteCoverShoe:82.3, voteViaB:81.1, classBShare:91.6, voteTable:84.4, classATable:11.3, classBTable:93.6,
  teslaHolds:18.99                           // Tesla’s Class A shares, May 1 2026
};

/* Stock-based pay. FY: 424B4 cash flow statement (SBC) and income statement (revenue). 9M: 10-Q Q3 note 14 and the Q3 release */
const OWN_SBC = {
  labels:['FY2023','FY2024','FY2025','9M 2025','9M 2026'],
  sbc:[679, 784, 1947, 1044, 3833],
  rev:[10387, 14015, 18674, 13714, 27083],
  acq9M26:1217,          // 9M 2026 SBC tied to the Cursor and Mesh Optical acquisitions: $6M cost of revenue + $1,022M R&D + $189M SG&A
  q3:2363, cursorUnvested:23400, perfExcluded:1333
};

/* Mr. Musk’s performance awards — 424B4 "2026 Compensation Developments" and note 15 */
const OWN_AWARDS = [
  ['SpaceX CEO Award', 'Jan 13 2026', '1,000M restricted Class B shares, 15 equal tranches',
   'Market value from $500B to $7.5T in $500B steps <b>and</b> a permanent human colony on Mars with at least one million inhabitants', '$90.40–$95.92'],
  ['AI CEO Award', 'Mar 23 2026 (replaced the Nov 2025 xAI award)', '302.1M restricted Class B shares, 12 equal tranches',
   'Market value from $1.065T to $6.565T in $500B steps <b>and</b> non-Earth-based data centers delivering 100 terawatts of compute per year', '$91.47–$95.92']
];

/* Share count. 424B4 (as adjusted), 10-Q Q2 cover (Jul 28 2026), 10-Q Q3 cover (Oct 15 2026) */
const OWN_SHARES = [
  ['IPO as adj. · Jun 2026', 7380.2, 5695.7],
  ['Jul 28 2026 · 10-Q Q2', 7696.3, 5485.5],
  ['Oct 15 2026 · 10-Q Q3', 8246.5, 5334.5]
];

/* Lock-up releases — 424B4 "Shares Eligible for Future Sale". Amounts are Class A shares, "up to". */
const OWN_LOCK = [
  ['2nd trading day after the first earnings release (2Q26)', 'Up to 911.5M (excludes affiliates)', 'Done'],
  ['Same date, only if the stock closed ≥30% above $135 on 5 of the 10 trading days to that release', 'Up to 455.8M more (the “Additional Release Shares”)', 'If triggered'],
  ['Aug 20 2026 (day 70)', 'Up to 319.0M (7% of the 180-day pool; excludes affiliates)', 'Done'],
  ['Sep 9 2026 (day 90)', 'Up to 319.0M (7%; excludes affiliates)', 'Done'],
  ['Sep 10 2026 (day 91)', 'Up to 59.1M (affiliates)', 'Done'],
  ['Sep 24, Oct 9 and Oct 24 2026 (days 105, 120, 135)', 'Up to 328.4M each (7% each)', 'Done'],
  ['2nd trading day after the 3Q26 release (Oct 20 2026)', 'Up to 1.3B (28% of the 180-day pool)', 'Done'],
  ['Dec 8 2026 (day 180)', 'Up to 328.4M, or up to 797.6M if the Additional Release Shares were not released', 'Next'],
  ['2nd trading day after the 4Q26 release', 'Up to 351.9M (20% of the extended pool, other than Mr. Musk)', 'Ahead'],
  ['Mar 18 2027 (day 280)', 'Up to 176.0M (10% of the extended pool)', 'Ahead'],
  ['2nd trading day after the 1Q27 release', 'Up to 351.9M (20%)', 'Ahead'],
  ['May 17 2027 (day 340)', 'Up to 176.0M (10%)', 'Ahead'],
  ['Jun 12 2027 (day 366)', 'Up to 351.9M (20%) <b>plus all of Mr. Musk’s shares, ~6.4B</b> (incl. Class B convertible to A and 350M under options)', 'Ahead'],
  ['2nd trading day after the 2Q27 release', 'Up to 351.9M (the rest of the extended pool)', 'Ahead']
];

registerView({ id:'own',
  html: `
  <div class="srow" id="own-tiles"></div>

  ${sec({ t:'Leadership', s:'Three executive officers and eight directors; the founder chairs the board and runs the company',
    b:`<div class="tw" id="own-lead"></div>
      <ul class="pl" style="margin-top:12px">
        <li><strong>Board seats:</strong> Class B shareholders alone elect 51% of the board (the five Class B directors); Class A and B together elect the rest. Mr. Musk can only be removed as director, CEO or Chairman by a majority of the Class B vote.</li>
        <li><strong>Independent</strong> (board determination): Ehrenpreis, Glein, Harrison, Jurvetson and Nosek. Audit committee: Glein (chair, financial expert) and Jurvetson; a third member to be named within one year of listing.</li>
        <li><strong>Other links:</strong> Ehrenpreis sits on Tesla’s board; Harrison is a Google executive (Google is a pre-IPO investor); Gracias runs Valor, the sale-leaseback counterparty.</li>
        <li><strong>Disclosed proceedings involving the CEO:</strong> the 2018 SEC settlement over the Tesla “take private” posts, and an Apr 3 2026 partial judgment against Mr. Musk personally (Pampena v. Musk, Twitter shares), which he is challenging.</li>
      </ul>`,
    n:'424B4 (Jun 11 2026), “Management”: names, ages and positions as of May 1 2026, biographies, board composition, director independence, board committees and “Additional Information”.' })}

  ${sec({ t:'Control', s:'Two voting classes; the founder holds about 46% of the shares and about 82% of the vote',
    b:`<div class="cols2"><div id="own-vc"></div>
      <div><div class="pt">Share classes after the IPO</div><div class="tw" id="own-cls"></div>
        <div class="pt" style="margin-top:14px">Controlled company: what it exempts</div>
        <ul class="pl">
          <li>A board with a <strong>majority of independent directors</strong>.</li>
          <li>A <strong>nominating committee</strong> made up entirely of independent directors.</li>
          <li>A <strong>compensation committee</strong> made up entirely of independent directors.</li>
          <li><strong>Annual evaluations</strong> of those committees. SpaceX says it intends to use certain of these exemptions: its compensation and nominating committee will not be fully independent.</li>
        </ul></div></div>`,
    n:'424B4 cover (82.4% of the vote, 82.3% with the over-allotment; 81.1% via Class B), “Controlled Company Exemption” (91.6% of Class B), the security-ownership table (beneficial, after the offering) and “Description of Capital Stock” (votes per share, conversion, Class B class votes; 7,380.2M A + 5,695.7M B as adjusted). Economic stake: our arithmetic on those counts.' })}

  ${sec({ t:'Related parties and the Tesla question', s:'Business with companies tied to the CEO and directors, and the special committees on a possible combination',
    b:`<div class="tw" id="own-rp"></div>
      <div class="pt" style="margin-top:18px">A possible combination with Tesla</div>
      <div class="cols2">
        <div class="ins"><strong>10-Q Q3 2026, verbatim:</strong> “As announced on our earnings call on October 20, 2026, our board of directors has formed a special committee to evaluate a potential combination between SpaceX and Tesla, Inc. ("Tesla"). The board of directors of Tesla has also formed a special committee. No determination by our special committee has been made regarding any potential combination, and any potential combination would be subject to further approval by our special committee, our board of directors and our controlling shareholder. There can be no assurance that any agreement will be reached or that any transaction will be consummated, and the special committee may determine not to proceed with recommending any transaction it does not believe to be in the best interests of our shareholders.”</div>
        <div class="ins a"><strong>Elon Musk, Q3 call (Oct 20 2026), verbatim:</strong> “Both SpaceX and Tesla have formed special committees to discuss this idea, at the request of shareholders. These special committees consist of independent directors. Because I am a conflicted party, I cannot actually be in the discussions of the special committees. […] I can just say that at this point that the special committees have not reached agreement on the terms of any transaction. Obviously, there is no guarantee that they will.” On Tesla’s side: “we will need a 50% vote of all shares, not just those who vote, but of all shareholders.”</div>
      </div>
      <ul class="pl" style="margin-top:12px">
        <li><strong>Press (FT via Reuters, Nov 24 2026):</strong> SpaceX’s negotiating directors are reported to be Roelof Botha and Randy Glein; Morgan Stanley and Goldman Sachs are reported to be advising SpaceX; the deal is reported as all-stock; no terms are agreed. Mr. Botha is not among the directors listed in the 424B4, and we have not seen his appointment in a filing.</li>
        <li><strong>Market:</strong> the stock fell 5.65% to $125.81 on Nov 24 2026 on the reports.</li>
        <li><strong>Already disclosed links:</strong> Tesla held ${num(OWN_CTRL.teslaHolds,2)}M SpaceX Class A shares (May 1 2026, &lt;1%); Mr. Musk owned ~20% of Tesla (Nov 10 2025). The charter gives Class B a separate vote on certain combinations, mergers or sales.</li>
      </ul>`,
    n:'10-Q Q3 2026 (MD&A “Evaluation of Potential Combination with Tesla, Inc.”; note 17, related-party transactions); Q3 2026 earnings call transcript (Oct 20 2026); 424B4 “Certain Relationships and Related Person Transactions” and “Description of Capital Stock”. Press items are reports, not company disclosures.' })}

  ${sec({ t:'Dilution and related parties', s:'Measured, not asserted',
    b:`<div class="cols2"><div id="own-s"></div>
      <ul class="pl">
        <li><strong>Average basic shares</strong> rose from ${num(IS9M.sharesAvg[0])}M to ${num(IS9M.sharesAvg[1])}M (+150%) in a year.</li>
        <li><strong>Stock-based pay</strong> was ${usd(IS9M.sbc[1])} in 9M, <strong>14% of revenue</strong> (incl. acquisitions; Cursor adds $23.4B of unvested awards).</li>
        <li><strong>${usd(BS.debtRelated)} of ${usd(BS.debt)} debt</strong> is owed to related parties; ${usd(BS.interestRelated9M)} of ${usd(BS.interest9M)} interest went to them.</li>
        <li><strong>Lock-ups:</strong> ~1.3B shares (~18% of Class A) freed after Q3; Musk's ~6.4B Class A shares free on <strong>Jun 12 2027</strong>.</li>
      </ul></div>`,
    n:'10-Q Q3 2026 (share count, SBC, related-party debt and interest); lock-up dates from UBS and the prospectus.' })}

  ${sec({ t:'Stock-based pay', s:'Up sharply in 2026, mostly from the acquisitions; the CEO awards are not yet expensed',
    ctl:`<div class="ctls">${seg('own-sv','Show',[['d','$ millions'],['p','% of revenue']],'d')}</div>`,
    b:`<div class="cols2"><div id="own-sbc"></div>
      <ul class="pl">
        <li><strong>9M 2026:</strong> ${usd(OWN_SBC.sbc[4])}, of which ${usd(OWN_SBC.acq9M26)} tied to the Cursor and Mesh Optical acquisitions; ${usd(OWN_SBC.q3)} in Q3 alone.</li>
        <li><strong>Cursor:</strong> equity awards worth <strong>$23.4B</strong> attributable to post-acquisition service, expensed over time (subject to forfeitures); 65M options, 28M RSUs and 96M RSAs were granted for the acquisitions, over a weighted 2.8 years.</li>
        <li><strong>Executives (FY2025):</strong> Mr. Musk’s salary $54,080, no equity grant; Ms. Shotwell $85.8M total (mostly options, incl. a 3.5M-option special grant); Mr. Johnsen $9.8M. No cash bonus plan.</li>
        <li><strong>CFO award:</strong> 4M performance options; 371,125 vest for each $10B of adjusted EBITDA earned in 2025–2029 (none earned on 2025).</li>
      </ul></div>
      <div class="pt" style="margin-top:18px">Mr. Musk’s performance awards (restricted Class B shares he already votes)</div>
      <div class="tw" id="own-aw"></div>
      <div class="snote" id="own-aw-n" style="margin-top:10px"></div>`,
    n:'424B4: cash flow statement (SBC FY2023–25), income statement (revenue), Executive Compensation (2025 Summary Compensation Table, 2026 Compensation Developments) and note 15 (CEO awards, grant-date fair values, not expensed while the performance conditions are improbable). 10-Q Q3 2026 note 14 (9M SBC, acquisition awards) and EPS note (1,333M performance awards excluded); Q3 2026 release ($23.4B Cursor awards).' })}

  ${sec({ t:'Lock-ups and the share count', s:'Shares outstanding are up 3.9% since the IPO; the largest unlock, the founder’s, is Jun 12 2027',
    b:`<div class="cols2"><div id="own-sh"></div><div class="tw" id="own-lk"></div></div>`,
    n:'424B4 “Description of Capital Stock” (as adjusted after the offering), “Shares Eligible for Future Sale” and “Lock-Up and Market Standoff Agreements” (7.8B shares, ~60% of the total, locked for over a year incl. 100% of Mr. Musk’s; Goldman Sachs may release early, but not Mr. Musk’s shares); 10-Q Q2 2026 cover (Jul 28 2026); 10-Q Q3 2026 cover (Oct 15 2026). Status column: our reading of dates against today (Nov 25 2026); whether the conditional 455.8M release was triggered is not stated in our sources.' })}
  `,
  init(){
    const K = OWN_CTRL, totSh = K.shA + K.shB, muskOut = K.muskA + K.muskB - K.muskOpt;
    const econ = muskOut / totSh, econVested = (muskOut - K.muskRestricted) / totSh;
    const votes = K.muskA + (K.muskB - K.muskOpt) * 10, totVotes = K.shA + K.shB * 10;
    const sh = OWN_SHARES.map(r => r[1] + r[2]);
    const sbcPct = OWN_SBC.sbc.map((v,i) => v / OWN_SBC.rev[i] * 100);
    /* text cells wrap and sit left (the shared td style is nowrap, right-aligned) */
    const W = (s, w) => '<div style="white-space:normal;text-align:left;min-width:' + (w || 120) + 'px">' + s + '</div>';

    $('#own-tiles').innerHTML =
      tile('Musk · voting power', num(K.voteCover,1) + '%', 'After the IPO (424B4); ' + num(K.voteViaB,1) + '% via Class B') +
      tile('Musk · share of shares', num(econ*100,1) + '%', 'Our arithmetic; ' + num(econVested*100,1) + '% excl. unvested award shares') +
      tile('Stock-based pay · 9M26', usd(OWN_SBC.sbc[4]), num(sbcPct[4],0) + '% of revenue · 9M25: ' + num(sbcPct[3],0) + '%') +
      tile('Shares outstanding', num(sh[2],0) + 'M', 'Oct 15 2026 · +' + num((sh[2]/sh[0]-1)*100,1) + '% vs IPO as adjusted');

    $('#own-lead').innerHTML = table(['Name','Role','Since','Board seat','Independent','Background'],
      OWN_BOARD.map(r => [W('<b>' + r[0] + '</b> <span style="color:var(--mu)">' + r[1] + '</span>', 110), W(r[2], 170), W(r[3], 110), W(r[4], 90),
        r[5] == null ? '—' : r[5] ? '<span class="tag ok">Yes</span>' : '<span class="tag n">No</span>', W(r[6], 240)]));

    chartBlock($('#own-vc'), { labels:['Share of shares outstanding','Share of votes','Share of Class B'], horizontal:true, unit:'%', fmt:v => num(v,1) + '%', rowHead:'Measure', height:'s',
      series:[ { key:'m', label:'Elon Musk, after the IPO', color:C.steel, data:[econ*100, K.voteCover, K.classBShare] } ],
      extra: c => { c.options.scales.x.max = 100; c.options.scales.x.min = 0; },
      tableNote:'Shares: ' + num(muskOut,1) + 'M of ' + num(totSh,1) + 'M (Class A ' + num(K.muskA,1) + 'M + Class B ' + num(K.muskB - K.muskOpt,1) + 'M outstanding, incl. ' + num(K.muskRestricted,1) + 'M unvested award shares he votes; excl. ' + num(K.muskOpt,0) + 'M under options). Votes: our recount at 1 and 10 votes per share gives ' + num(votes/totVotes*100,1) + '%, matching the 424B4’s 82.4%. The ownership table shows ' + num(K.voteTable,1) + '% because SEC rules count the options as exercised. No update to these figures in the 10-Qs.' });

    $('#own-cls').innerHTML = table(['Class','Votes / share','Outstanding (as adj.)','Key terms'], [
      ['<b>Class A</b>', '1', num(K.shA,1) + 'M', 'Listed (SPCX). Mr. Musk: ' + num(K.muskA,1) + 'M (' + num(K.classATable,1) + '%)'],
      ['<b>Class B</b>', '10', num(K.shB,1) + 'M', 'Elects 51% of the board as a class; class vote on changes to its rights and on certain mergers or sales; converts 1:1 into A, automatically on sale. Mr. Musk: ' + num(K.classBShare,1) + '%'],
      ['Class C', '0', '—', 'Reclassified into Class A at the IPO']].map(r => [r[0], r[1], r[2], W(r[3], 200)]));

    $('#own-rp').innerHTML = table(['Counterparty','Link','What','Amounts'], [
      ['<b>Valor</b>', 'Director A. Gracias is founder, CEO and CIO', 'GPU and computing equipment sold and leased back (failed sale-leaseback, booked as debt)', 'Debt $' + num(BS.debtRelated/1000,1) + 'B at Sep 30 2026 ($2,181M current + $10,716M non-current); interest $864M in 9M26; three leases with $20.2B of aggregate payments (424B4)'],
      ['<b>xAI / X</b>', 'Mr. Musk was stockholder, director and officer', 'Acquired by SpaceX on Feb 2 2026 (xAI includes X)', 'Pre-merger agreements still running are reported as related-party'],
      ['<b>Tesla</b>', 'Mr. Musk is CEO (~20% holder, Nov 2025)', 'Megapack batteries, Cybertrucks, aircraft use, X advertising', 'Megapacks $480M in 9M26; xAI bought $506M of goods and services in 2025'],
      ['<b>The Boring Company</b>', 'Mr. Musk has a controlling vote', 'Equity stake at fair value; office lease; tunnels in Bastrop', 'Unrealized gain $561M in Q3 2026 (in other income)'],
      ['<b>Musk-owned firms</b>', 'Owned by Mr. Musk', 'Personal security services; xAI property lease (Musk Industries)', 'Security $4M in 2025; lease $2M in 2025']].map(r => [W(r[0], 100), W(r[1], 150), W(r[2], 190), W(r[3], 230)]));

    chartBlock($('#own-s'), { labels:['9M 2025','9M 2026'], unit:'M shares', fmt:v => num(v), rowHead:'Period', height:'s',
      series:[ { key:'sh', label:'Average basic shares', color:C.steel, data:IS9M.sharesAvg } ] });

    let sblk = null;
    const scfg = v => v === 'd'
      ? { unit:'$M', fmt:x => usd(x), series:[ { key:'s', label:'Stock-based compensation', color:C.steel, data:OWN_SBC.sbc } ],
          tableNote:'9M 2026 includes ' + usd(OWN_SBC.acq9M26) + ' tied to the acquisitions. FY figures from the 424B4 cash flow statement.' }
      : { unit:'%', fmt:x => num(x,1) + '%', series:[ { key:'p', label:'Stock-based pay ÷ revenue', color:C.sky, data:sbcPct } ],
          tableNote:'Revenue: FY ' + OWN_SBC.rev.slice(0,3).map(x => usd(x)).join(' / ') + '; 9M25 ' + usd(OWN_SBC.rev[3]) + '; 9M26 ' + usd(OWN_SBC.rev[4]) + '.' };
    sblk = chartBlock($('#own-sbc'), { labels:OWN_SBC.labels, rowHead:'Period', ...scfg('d') });
    pills('#own-sv', v => sblk.set({ tableNote:'', ...scfg(v) }));

    $('#own-aw').innerHTML = table(['Award','Granted','Size','Vests only if (both)','Grant-date value / share'], OWN_AWARDS.map(r => [W('<b>' + r[0] + '</b>', 90), W(r[1], 110), W(r[2], 140), W(r[3], 260), r[4]]));
    const mcap = sh[2] * PRICE.px / 1e6;   // $T, Oct 15 share count × last close
    $('#own-aw-n').innerHTML = 'Both awards need a market-value milestone <b>and</b> an operating milestone for any tranche to vest, and Mr. Musk must still be employed. As of Mar 31 2026 both operating milestones were judged improbable, so <b>no expense has been recognised</b> for either award; the Q3 10-Q still excludes ' + num(OWN_SBC.perfExcluded) + 'M performance-conditioned awards from diluted EPS. For scale (our arithmetic): ' + num(sh[2],0) + 'M shares × $' + PRICE.px + ' (' + PRICE.date + ') ≈ $' + num(mcap,2) + 'T; the awards’ own measurement rules are in the award agreements.';

    chartBlock($('#own-sh'), { labels:OWN_SHARES.map(r => r[0]), unit:'M shares', fmt:v => num(v,1), rowHead:'Date', stacked:true, total:true,
      series:[ { key:'a', label:'Class A', color:C.steel, data:OWN_SHARES.map(r => r[1]) },
               { key:'b', label:'Class B', color:C.sky, data:OWN_SHARES.map(r => r[2]) } ],
      tableNote:'Total ' + num(sh[0],1) + 'M → ' + num(sh[1],1) + 'M → ' + num(sh[2],1) + 'M. Class B falls as holders convert to A (automatic on sale).' });

    const st = s => '<span class="tag ' + (s === 'Next' ? 'wait' : s === 'Done' ? 'ok' : 'n') + '">' + s + '</span>';
    $('#own-lk').innerHTML = table(['When','Class A shares released','Status'], OWN_LOCK.map(r => [W(r[0], 160), W(r[1], 170), st(r[2])]));
  }
});
