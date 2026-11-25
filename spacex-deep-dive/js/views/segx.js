/* Segment economics — how each segment makes (or loses) money. Frozen data, nothing fetched. $ millions unless stated.
   SOURCES (SEC EDGAR, CIK 1181412; copies in SOURCES/md SOURCES):
     424B4 prospectus, Jun 12 2026 — Note 19 segments (FY2023–FY2025, 1Q25, 1Q26), statements of operations, Note 14 EPS,
       Adjusted EBITDA reconciliations by segment (share-based compensation), MD&A description of segment costs, key metrics.
     Q2 2026 Form 10-Q and earnings release (Aug 4 2026); Q3 2026 Form 10-Q and earnings release (Oct 20 2026) — segment
       operating and financial data (incl. share-based compensation by segment), statements of operations, key business metrics.
     Calls: Q2 2026 (Aug 4 2026) and Q3 2026 (Oct 20 2026), quoted verbatim from research-summit docs/calls/SPCX.md and
       SPCX-latest.md.
   Data reused from the research portal (rs-spcx): js/overviews/spcx-bl-data.js (SPCX_SEG_Y / SPCX_SEG_Q segment cost split,
   SPCX_OPEX functional lines) and js/results-data/spcx.js (segment adj. EBITDA, KPIs). 2Q25 = 9M25 less 1Q25 and 3Q25;
   4Q25 = FY2025 less the nine months. In every row rev − cor − rnd − sga − oth = oi, and segments add to the consolidated
   lines. SI FY2023 operating income is (3,973), a loss, per the 424B4 (Bloomberg shows it with the wrong sign). */
(function(){
  const SX_Q = ['1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26'];
  const SX_Y = ['FY2023','FY2024','FY2025'];
  const SX_SEGS = [ ['space','Space'], ['conn','Connectivity (Starlink)'], ['si','SI (AI & compute)'] ];

  /* Segment P&L by cost line: rev, cor (cost of revenue), rnd, sga, oth (restructuring + impairment), oi (operating income) */
  const SX_SEG = {
    q:{ space:{ rev:[865,746,1666,809,619,962,1767], cor:[297,330,477,248,281,329,435], rnd:[526,694,849,935,930,1076,1225], sga:[88,87,81,93,70,99,114], oth:[24,5,0,9,0,0,0], oi:[-70,-370,259,-476,-662,-542,-7] },
        conn: { rev:[2475,2587,3097,3228,3257,4291,5248], cor:[1214,1400,1657,1650,1651,2060,2368], rnd:[123,142,141,169,205,294,188], sga:[105,121,109,133,213,281,325], oth:[0,0,0,0,0,0,0], oi:[1033,924,1190,1276,1188,1656,2367] },
        si:   { rev:[727,738,813,923,818,2561,7560], cor:[451,552,571,604,456,1106,2675], rnd:[908,1122,1301,1733,2379,2178,3183], sga:[300,398,385,744,463,532,1268], oth:[4,190,278,15,-11,2,3], oi:[-936,-1524,-1722,-2173,-2469,-1257,431] } },
    y:{ space:{ rev:[3557,3796,4086], cor:[1669,1541,1352], rnd:[1538,1835,3004], sga:[351,375,349], oth:[0,24,38], oi:[-1,21,-657] },
        conn: { rev:[3869,7599,11387], cor:[2786,4768,5921], rnd:[381,453,575], sga:[233,333,468], oth:[0,39,0], oi:[469,2006,4423] },
        si:   { rev:[2961,2620,3201], cor:[1655,1687,2178], rnd:[186,1176,5064], sga:[1081,1105,1827], oth:[4012,213,487], oi:[-3973,-1561,-6355] } }
  };
  /* Segment adjusted EBITDA (company definition) — 424B4, Q2/Q3 releases; 4Q25 derived. Segments add to company adj. EBITDA. */
  const SX_EB = {
    q:{ space:[224,-93,674,-152,-351,-205,357], conn:[1618,1583,1923,2044,2087,2597,3499], si:[-112,-276,-428,-421,-609,1146,4953] },
    y:{ space:[997,1154,653], conn:[1602,3849,7168], si:[1222,347,-1237] }
  };
  /* Consolidated functional expense lines — 424B4 statements of operations; Q2/Q3 10-Q; 4Q25 derived. otherOpex = restructuring + impairment + other. */
  const SX_OPEX = {
    q:{ rev:[4067,4071,5576,4960,4694,7814,14575], cor:[1962,2282,2705,2502,2388,3495,5478], rnd:[1557,1958,2291,2837,3514,3548,4596], sga:[493,606,575,970,746,912,1707], oth:[28,195,278,24,-11,2,3] },
    y:{ rev:[10387,14015,18674], cor:[6110,7996,9451], rnd:[2105,3464,8643], sga:[1665,1813,2644], oth:[4012,276,525] }
  };
  /* Key business metrics — 424B4 and Q2/Q3 2026 10-Q / release. 4Q25 derived where noted; ARPU 4Q25 not disclosed. */
  const SX_KPI = {
    q:{ subs:[5.0,6.0,7.2,8.9,10.3,12.0,13.6], arpu:[86,85,83,null,66,66,69], launches:[38,46,44,42,40,38,35], cust:[12,9,15,7,7,10,12],
        mto:[450,652,525,586,556,485,476], mw:[300,400,600,800,1000,1400,1700] },
    y:{ subs:[2.3,4.4,8.9], arpu:[99,91,81], launches:[98,138,170], cust:[33,45,43], mto:[1210,1699,2213], mw:[0,300,800] }
  };
  /* Share-based compensation by segment — Adjusted EBITDA reconciliations: 424B4 (FY2023–25) and Q3 2026 release (9M).
     "acq" = share-based compensation related to acquisitions (Cursor, closed Aug 14 2026), shown separately by the company. */
  const SX_SBC = { labels:['FY2023','FY2024','FY2025','9M 2025','9M 2026'], rev:[10387,14015,18674,13714,27083],
    space:[427,472,515,383,503], conn:[249,296,369,270,398], si:[3,16,1063,391,1715], acq:[0,0,0,0,1217] };
  /* Weighted-average shares, millions — 424B4 statements of operations and Note 14; Q3 2026 release. */
  const SX_SHARES = [
    ['FY2023', 2759, 2759, 'Loss year: diluted equals basic'],
    ['FY2024', 2848, 9956, 'Profitable year: diluted adds 6,771M from the assumed conversion of the redeemable convertible preferred, plus options and RSUs (424B4 Note 14)'],
    ['FY2025', 2926, 2926, 'Loss year. Pro forma for the preferred conversion: 6,723M (424B4)'],
    ['9M 2025', 2915, 2915, 'Loss period'],
    ['9M 2026', 7274, 7274, 'xAI merger (Feb 2026) and IPO (Jun 2026) inside the period'],
    ['3Q26', 11942, 12475, 'First full quarter after the IPO; Cursor closed Aug 14 2026']
  ];

  /* Verbatim 424B4 descriptions of each segment's cost of revenue (MD&A, Description of Our Segments) */
  const SX_COSTDEF = {
    space:'Space segment’s cost of revenue includes second stages flown related to the Company’s Falcon 9 and Falcon Heavy launches, launch operations and overhead, depreciation (inclusive of booster, Merlin engine, and fairing depreciation), employee compensation costs (including salaries, benefits, and share-based compensation) for our operations teams, launch testing and overhead, engineering costs, inventory excess and obsolescence, shared costs incurred in the production of launch hardware, and ongoing product support.',
    conn:'Connectivity segment’s cost of revenue includes depreciation (inclusive of launch, satellite, and ground infrastructure costs), Starlink Kit costs, shipping and handling costs, ground operating expenses, employee compensation costs (including salaries, benefits, and share-based compensation) for our engineering and operations teams, payment processor fees, warranty expense, inventory excess and obsolescence, and customs and duties.',
    si:'AI segment’s cost of revenue includes infrastructure costs, revenue share expenses, payment processor fees, payments to creators, amortization of acquired intangible assets, and allocated labor and overhead costs.'
  };
  const SX_RNDDEF = {
    space:'Space segment’s research and development (“R&amp;D”) expenses mainly relate to the development, build, and testing of Starship.',
    conn:'Connectivity segment’s R&amp;D expenses mainly relate to the development, build, and testing of our next-generation satellites, Starlink Kits, and ground infrastructure.',
    si:'AI segment’s R&amp;D expenses mainly relate to the training of Grok, our leading frontier model, development, build, and testing of our next-generation AI-enabled products and data center costs to train AI-enabled products.'
  };

  const SEGC = { space:C.space, conn:C.conn, si:C.si };
  const pctOf = (a, b) => a.map((v, i) => (v == null || !b[i]) ? null : Math.round(v / b[i] * 1000) / 10);
  const pfmt = v => v == null ? '—' : (v < 0 ? '−' : '') + Math.abs(v).toFixed(1) + '%';
  const last = a => a[a.length - 1];

  registerView({ id:'segx',
    css: `#v-segx .txt td{white-space:normal;text-align:left;vertical-align:top;line-height:1.5}
      #v-segx .txt th{text-align:left}
      #v-segx .def{font-size:12px;line-height:1.6;color:var(--ink2);border-left:3px solid var(--steel);padding:8px 14px;background:var(--pale);border-radius:0 8px 8px 0;margin-top:14px}
      #v-segx .def b{color:var(--navy)}
      #v-segx .def .w{display:block;font-size:11px;color:var(--mu);margin-top:5px}
      #v-segx blockquote{font-size:12.5px;line-height:1.6;color:var(--ink2);border-left:3px solid var(--steel);padding:8px 14px;background:var(--pale);border-radius:0 8px 8px 0}
      #v-segx blockquote .w{display:block;font-size:11px;color:var(--mu);margin-top:6px}
      #v-segx .q{display:flex;flex-direction:column;gap:10px;margin-top:18px}`,
    html: `
    <p class="lede">Starlink earns the money. <strong>SI</strong> turned profitable in 3Q26 once its GPUs were rented out instead of used for training.
    <strong>Space</strong> spends its revenue on Starship development and books nothing for the Starlink launches that fill most of its manifest.</p>

    <div class="srow">
      ${tile('Connectivity · 3Q26', usd(last(SX_SEG.q.conn.oi)), 'Operating income, ' + pfmt(last(SX_SEG.q.conn.oi) / last(SX_SEG.q.conn.rev) * 100) + ' margin')}
      ${tile('SI · 3Q26', usd(last(SX_SEG.q.si.oi)), 'Operating income; $1.6B before $1.2B of Cursor stock pay')}
      ${tile('Space · 3Q26', usd(last(SX_SEG.q.space.oi)), 'R&amp;D (mostly Starship) ' + usd(last(SX_SEG.q.space.rnd)) + ' on ' + usd(last(SX_SEG.q.space.rev)) + ' revenue')}
      ${tile('Company · 3Q26', usd(last(SX_OPEX.q.rev) - last(SX_OPEX.q.cor) - last(SX_OPEX.q.rnd) - last(SX_OPEX.q.sga) - last(SX_OPEX.q.oth)), 'Operating income; adj. EBITDA ' + usd(8809))}
    </div>

    ${sec({ t:'Revenue and profit by segment', s:'Adjusted EBITDA leaves out depreciation and stock pay; operating income does not',
      ctl:`<div class="ctls">${seg('segx-p','Period',[['q','Quarterly'],['y','Annual']],'q')}${seg('segx-m','Metric',[['rev','Revenue'],['eb','Adj. EBITDA'],['oi','Operating income'],['ebm','EBITDA margin'],['oim','Operating margin']],'rev')}</div>`,
      b:`<div id="segx-a"></div>`,
      n:'424B4 prospectus (Jun 12 2026), Note 19 and Adjusted EBITDA reconciliations (FY2023–FY2025, 1Q25, 1Q26); Q2 and Q3 2026 10-Q and earnings releases (Aug 4 and Oct 20 2026). 2Q25 and 4Q25 are derived from year-to-date totals. Adjusted EBITDA is the company’s definition (excludes D&amp;A, share-based compensation, restructuring and impairment) and is not GAAP. SI was called “AI” until the Q3 2026 10-Q.' })}

    ${sec({ t:'Where each segment’s costs go', s:'Bars are the four cost lines; when they pass the revenue line the segment loses money',
      ctl:`<div class="ctls">${seg('segx-cs','Segment',SX_SEGS.map(s => [s[0], s[1].split(' (')[0]]),'si')}${seg('segx-cp','Period',[['q','Quarterly'],['y','Annual']],'q')}${seg('segx-cu','Show',[['usd','$'],['pct','% of revenue']],'usd')}</div>`,
      b:`<div id="segx-b"></div><div id="segx-bd"></div>`,
      n:'Segment cost split from the segment note: 424B4 Note 19 (FY2023–FY2025, 1Q25, 1Q26) and the Q3 2026 earnings release (3Q25, 2Q26, 3Q26); 2Q25 and 4Q25 derived. Other = restructuring and impairment (FY2023 SI: $3,775M impairment of X intangibles and $237M restructuring). Starlink launches earn Space no revenue; their cost is capitalised into satellites and reaches Connectivity as depreciation (424B4).' })}

    ${sec({ t:'Operating metrics by segment', s:'The volumes behind the revenue, as the company defines them',
      ctl:`<div class="ctls">${seg('segx-kk','Metric',[['subs','Starlink subscribers'],['arpu','ARPU'],['launches','Launches'],['mto','Mass to orbit'],['mw','Compute']],'subs')}${seg('segx-kp','Period',[['q','Quarterly'],['y','Annual']],'q')}</div>`,
      b:`<div id="segx-c"></div>
        <div class="tw txt" style="margin-top:18px">${table(['Metric','Segment','Company definition (verbatim)','3Q26','FY2025'], [
          ['<b>Starlink consumer subscribers</b>', 'Connectivity', '“We define a Starlink consumer subscriber as a unique service line that is directly assigned to a Starlink.com account registered to a person or entity that does not have a direct, negotiated agreement with the Starlink sales team. […] We calculate Starlink consumer subscribers for a period as the number of unique service lines at the end of the period.”', '13.6M', '8.9M'],
          ['<b>Consumer ARPU</b>', 'Connectivity', '“We calculate consumer ARPU as service revenue generated from Starlink consumer subscribers during the period divided by (i) the average number of Starlink consumer subscribers during the period and by (ii) the number of months in the period.”', '$69 a month', '$81 a month'],
          ['<b>Launches</b>', 'Space', '“Launches in a period represent the sum of all successful orbital and flight tests across our rockets, including internal Starlink deployments, development tests, and launches for our third-party customers, and excluding any cancellations or scrubs that occurred in that period.”', '35', '170'],
          ['<b>Customer launches</b>', 'Space', '“We designate a launch as a “customer launch” if an external customer payload constitutes the primary payload […]. To date, all Starship launches have been classified as internal.”', '12', '43'],
          ['<b>Mass to orbit</b>', 'Space', '“Mass to orbit is the total kilograms of payload that we deploy to orbit in a given period […]. We calculate this metric by summing verified mass, including Starlink satellites, customer payloads, and development cargo, from all successful orbital and flight tests.”', '476 t', '2,213 t'],
          ['<b>Nameplate compute</b>', 'SI', '“We calculate nameplate compute for a period as the number of GPUs installed in our data centers at the end of the period multiplied by their respective all-in power. Nameplate compute reflects installed capacity and does not represent actual power consumption or utilization.”', '1,700 MW', '800 MW']
        ])}</div>`,
      n:'Key business metrics: 424B4 (FY2023–FY2025, 1Q) and Q2 and Q3 2026 10-Q, Item 2 (definitions verbatim from the Q3 2026 10-Q). Customer launches in 2Q and 4Q and mass to orbit in 4Q25 derived from year-to-date totals; ARPU for 4Q25 not disclosed. SpaceX publishes no price per launch, no cost per subscriber and no compute utilisation. Management guides to 2.5–3 GW of compute at end-2026 (Q3 2026 call).' })}

    ${sec({ t:'Company cost lines and what drives them', s:'Training compute is R&amp;D; rented compute is cost of revenue, so the mix moves cost between the two',
      ctl:`<div class="ctls">${seg('segx-dp','Period',[['q','Quarterly'],['y','Annual']],'q')}${seg('segx-du','Show',[['usd','$'],['pct','% of revenue']],'pct')}</div>`,
      b:`<div id="segx-d"></div>
        <div class="q">
          <blockquote>“Connectivity gross profits doubled year-over-year with gross margins of 55%, including a one-time benefit of roughly 3% primarily driven by tariff refunds in the quarter.”<span class="w">Bret Johnsen, CFO · Q3 2026 call, Oct 20 2026 · cost of revenue</span></blockquote>
          <blockquote>“We also expect total company gross margins in Q4 to be more consistent with the second quarter, given some one-time benefits in customer mix that we highlighted in Q3.”<span class="w">Bret Johnsen, CFO · Q3 2026 call, Oct 20 2026 · cost of revenue</span></blockquote>
          <blockquote>“Segment costs and expenses rose $389 million year-over-year, and we continued to accelerate R&amp;D investments in our Starship program.”<span class="w">Bret Johnsen, CFO · Q2 2026 call, Aug 4 2026 · R&amp;D (Space)</span></blockquote>
        </div>`,
      n:'Consolidated statements of operations: 424B4 (FY2023–FY2025, 1Q25, 1Q26), Q2 and Q3 2026 10-Q; 4Q25 derived. Cost of revenue is reported as one total, with no split by component. Restructuring, impairment &amp; other is revenue less the three lines less operating income (FY2023: $3.8B impairment of X intangibles). SG&amp;A in 3Q26 includes Cursor (closed Aug 14 2026). Calls quoted verbatim.' })}

    ${sec({ t:'Stock-based pay and the share count', s:'Adjusted EBITDA excludes stock pay; the Cursor awards add about $23.4B over roughly three years',
      ctl:`<div class="ctls">${seg('segx-eu','Show',[['usd','$'],['pct','% of revenue']],'usd')}</div>`,
      b:`<div class="cols2">
          <div id="segx-e"></div>
          <div>
            <div class="pt">Weighted-average shares (millions)</div>
            <div class="tw txt">${table(['Period','Basic','Diluted','Why it moved'], SX_SHARES.map(r => [r[0], num(r[1]), num(r[2]), r[3]]))}</div>
          </div>
        </div>
        <div class="q">
          <blockquote>“SI segment operating income was $431 million, but excluding the $1.2 billion of stock-based compensation expense related to the Cursor acquisition, the segment delivered $1.6 billion of operating profit just in Q3.”<span class="w">Bret Johnsen, CFO · Q3 2026 call, Oct 20 2026</span></blockquote>
          <blockquote>“These equity awards will be recognized as stock-based compensation over roughly the next three-year vesting period.”<span class="w">Bret Johnsen, CFO · Q3 2026 call, Oct 20 2026</span></blockquote>
        </div>`,
      n:'Share-based compensation by segment: 424B4 Adjusted EBITDA reconciliations (FY2023–FY2025) and Q3 2026 earnings release (9M 2025, 9M 2026; acquisition awards shown separately, $1,217M in 3Q26). Value of Cursor awards attributable to post-acquisition service: $23.4B, subject to forfeitures (Q3 2026 release). Shares: 424B4 statements of operations and Note 14; Q3 2026 release. Per-share figures before 2026 are not comparable: the xAI merger (Feb 2026) and the IPO (Jun 2026) changed the share base.' })}
    `,
    init(){
      /* (a) revenue / EBITDA / operating income by segment */
      let ap = 'q', am = 'rev';
      const mkA = () => {
        const L = ap === 'q' ? SX_Q : SX_Y, S = SX_SEG[ap], E = SX_EB[ap];
        const tot = k => L.map((_, i) => SX_SEGS.reduce((a, [s]) => a + (k === 'eb' ? E[s][i] : S[s][k][i]), 0));
        const lvl = { rev:s => S[s].rev, eb:s => E[s], oi:s => S[s].oi };
        if(am === 'rev' || am === 'eb' || am === 'oi'){
          return { labels:L, rowHead:'Period', stacked: am === 'rev', total:true, unit:'$M', fmt:v => usd(v), height:'',
            series: SX_SEGS.map(([s, l]) => ({ key:s, label:l, color:SEGC[s], data:lvl[am](s), stack:'a' })),
            tableNote: am === 'rev' ? 'Total = consolidated revenue.' : am === 'eb' ? 'Total = company adjusted EBITDA (the segments add to it in every period).' : 'Total = consolidated operating income. FY2023 SI includes $3,775M of impairment of X intangibles.' };
        }
        const num_ = am === 'ebm' ? (s => E[s]) : (s => S[s].oi);
        const totN = am === 'ebm' ? tot('eb') : tot('oi'), totR = tot('rev');
        return { labels:L, rowHead:'Period', stacked:false, total:false, unit:'%', fmt:pfmt, height:'',
          series: SX_SEGS.map(([s, l]) => ({ key:s, label:l, color:SEGC[s], data:pctOf(num_(s), S[s].rev), type:'line' }))
            .concat([{ key:'tot', label:'Company', color:C.grey, data:pctOf(totN, totR), type:'line', dash:true }]),
          tableNote:'Margin = segment ' + (am === 'ebm' ? 'adjusted EBITDA' : 'operating income') + ' ÷ segment revenue. SI’s FY2023 operating margin is −134% (X impairment); Space swings around zero on a small revenue base.' };
      };
      const blkA = chartBlock($('#segx-a'), mkA());
      pills('#segx-p', v => { ap = v; blkA.set(mkA()); });
      pills('#segx-m', v => { am = v; blkA.set(mkA()); });

      /* (b) cost split by segment */
      let bs = 'si', bp = 'q', bu = 'usd';
      const mkB = () => {
        const L = bp === 'q' ? SX_Q : SX_Y, D = SX_SEG[bp][bs], pc = bu === 'pct';
        const v = a => pc ? pctOf(a, D.rev) : a;
        return { labels:L, rowHead:'Period', stacked:true, total:false, height:'', unit: pc ? '% of revenue' : '$M', fmt: pc ? pfmt : (x => usd(x)),
          series:[ { key:'cor', label:'Cost of revenue', color:C.deep, data:v(D.cor), stack:'a' },
                   { key:'rnd', label:'R&D', color:C.sky, data:v(D.rnd), stack:'a' },
                   { key:'sga', label:'SG&A', color:C.fog, data:v(D.sga), stack:'a' },
                   { key:'oth', label:'Restructuring & impairment', color:C.grey, data:v(D.oth), stack:'a' },
                   ...(pc ? [ { key:'line', label:'Operating margin', color:C.neg, data:pctOf(D.oi, D.rev), type:'line', stack:'l' } ]
                          : [ { key:'line', label:'Revenue', color:'#1E2733', data:D.rev, type:'line', stack:'l' },
                              { key:'oi', label:'Operating income', color:C.pos, data:D.oi, type:'line', dash:true, stack:'m' } ]) ],
          tableNote: pc ? 'Cost lines as % of segment revenue; above 100% in total means an operating loss. Operating margin = 100% less the four lines.'
                        : 'Revenue − cost of revenue − R&D − SG&A − restructuring & impairment = operating income, in every period.' };
      };
      const blkB = chartBlock($('#segx-b'), mkB());
      const defB = () => { $('#segx-bd').innerHTML = `<div class="def"><b>Cost of revenue:</b> “${SX_COSTDEF[bs]}”<br><b>R&amp;D:</b> “${SX_RNDDEF[bs]}”<span class="w">424B4, MD&amp;A, Description of Our Segments (verbatim; the 424B4 calls SI “AI”)</span></div>`; };
      defB();
      pills('#segx-cs', v => { bs = v; blkB.set(mkB()); defB(); });
      pills('#segx-cp', v => { bp = v; blkB.set(mkB()); });
      pills('#segx-cu', v => { bu = v; blkB.set(mkB()); });

      /* (c) KPIs */
      let kk = 'subs', kp = 'q';
      const KDEF = {
        subs:{ unit:'millions', fmt:v => v == null ? '—' : num(v, 1) + 'M', ser:[['subs','Starlink consumer subscribers (end of period)',C.conn,'bar']], note:'Connectivity. Excludes managed enterprise and government customers. 4Q25 = year-end figure.' },
        arpu:{ unit:'$ per month', fmt:v => v == null ? '—' : '$' + num(v), ser:[['arpu','Consumer ARPU',C.conn,'line']], note:'Connectivity. Falling as the base moves outside North America; 3Q26 rose 5% on customer mix (Q3 call). 4Q25 not disclosed.' },
        launches:{ unit:'launches', fmt:v => v == null ? '—' : num(v), ser:[['launches','All launches',C.fog,'bar'],['cust','Customer launches (earn Space revenue)',C.steel,'bar']], note:'Space. Internal Starlink launches earn the segment no revenue. Customer launches in 2Q and 4Q derived.' },
        mto:{ unit:'metric tons', fmt:v => v == null ? '—' : num(v) + ' t', ser:[['mto','Mass to orbit',C.space,'bar']], note:'Space. Includes Starlink satellites; 119 t of 3Q26’s 476 t were customer payloads. 4Q25 derived.' },
        mw:{ unit:'MW', fmt:v => v == null ? '—' : num(v) + ' MW', ser:[['mw','Nameplate compute (end of period)',C.si,'bar']], note:'SI. GPUs installed × all-in power; not utilisation. Guide: 2.5–3 GW at end-2026 (Q3 call).' }
      };
      const mkC = () => { const d = KDEF[kk], K = SX_KPI[kp];
        return { labels: kp === 'q' ? SX_Q : SX_Y, rowHead:'Period', height:'s', stacked:false, total:false, unit:d.unit, fmt:d.fmt,
          series:d.ser.map(([k, l, c, t]) => ({ key:k, label:l, color:c, data:K[k], type:t })), tableNote:d.note }; };
      const blkC = chartBlock($('#segx-c'), mkC());
      pills('#segx-kk', v => { kk = v; blkC.set(mkC()); });
      pills('#segx-kp', v => { kp = v; blkC.set(mkC()); });

      /* (d) consolidated functional lines */
      let dp = 'q', du = 'pct';
      const mkD = () => { const L = dp === 'q' ? SX_Q : SX_Y, D = SX_OPEX[dp], pc = du === 'pct', v = a => pc ? pctOf(a, D.rev) : a;
        const oi = D.rev.map((r, i) => r - D.cor[i] - D.rnd[i] - D.sga[i] - D.oth[i]);
        return { labels:L, rowHead:'Period', stacked:true, total:false, height:'', unit: pc ? '% of revenue' : '$M', fmt: pc ? pfmt : (x => usd(x)),
          series:[ { key:'cor', label:'Cost of revenue', color:C.deep, data:v(D.cor), stack:'a' },
                   { key:'rnd', label:'R&D', color:C.sky, data:v(D.rnd), stack:'a' },
                   { key:'sga', label:'SG&A', color:C.fog, data:v(D.sga), stack:'a' },
                   { key:'oth', label:'Restructuring, impairment & other', color:C.grey, data:v(D.oth), stack:'a' },
                   pc ? { key:'line', label:'Operating margin', color:C.neg, data:pctOf(oi, D.rev), type:'line', stack:'l' }
                      : { key:'line', label:'Revenue', color:'#1E2733', data:D.rev, type:'line', stack:'l' } ],
          tableNote: pc ? 'Gross margin = 100% less cost of revenue: 41% in FY2023, 49% in FY2025, 62% in 3Q26. R&D fell from 46% of revenue in FY2025 to 32% in 3Q26 while the dollars kept rising.'
                        : 'Revenue less the four lines = reported operating income in every period.' }; };
      const blkD = chartBlock($('#segx-d'), mkD());
      pills('#segx-dp', v => { dp = v; blkD.set(mkD()); });
      pills('#segx-du', v => { du = v; blkD.set(mkD()); });

      /* (e) stock-based pay */
      const mkE = u => { const pc = u === 'pct', v = a => pc ? pctOf(a, SX_SBC.rev) : a;
        return { labels:SX_SBC.labels, rowHead:'Period', stacked:true, total:true, height:'', unit: pc ? '% of revenue' : '$M', fmt: pc ? pfmt : (x => usd(x)),
          series:[ { key:'space', label:'Space', color:C.space, data:v(SX_SBC.space), stack:'a' },
                   { key:'conn', label:'Connectivity', color:C.conn, data:v(SX_SBC.conn), stack:'a' },
                   { key:'si', label:'SI', color:C.si, data:v(SX_SBC.si), stack:'a' },
                   { key:'acq', label:'Acquisition awards (Cursor)', color:C.grey, data:v(SX_SBC.acq), stack:'a' } ],
          tableNote:'Total = share-based compensation in the Adjusted EBITDA reconciliation: $679M, $784M, $1,947M (FY2023–FY2025); $1,044M (9M 2025); $3,833M (9M 2026, incl. $1,217M of Cursor awards).' }; };
      const blkE = chartBlock($('#segx-e'), mkE('usd'));
      pills('#segx-eu', v => blkE.set(mkE(v)));
    }
  });
})();
