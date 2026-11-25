/* Customers — who pays SpaceX. Frozen data, nothing fetched. $ millions unless stated.
   SOURCES (SEC EDGAR, CIK 1181412; copies in SOURCES/md SOURCES):
     424B4 prospectus, Jun 12 2026 (acc. 0001628280-26-042639) — Note 3 concentration of risk (FY2023–25), Note 3 revenue by
       type (FY2023–25), Business (customer classes, Anthropic Cloud Services Agreements), Note on subsequent events (May 3 2026).
     Q2 2026 Form 10-Q (acc. 0001628280-26-052535) — Note 3 concentration of risk (2Q26/2Q25, 6M), Item 1A risk factor.
     Q3 2026 Form 10-Q (acc. 0001628280-26-066880) — Note 3 concentration of risk (3Q26/3Q25, 9M), accounts receivable,
       Note 2 cloud services arrangements, MD&A (SI revenue).
     Q3 2026 earnings release and call (Oct 20 2026); Q2 2026 call (Aug 4 2026) — calls quoted verbatim from
       research-summit docs/calls/SPCX-latest.md and SPCX.md.
     Needham, "Launch King Secures Its Rule in Orbital Infrastructure" (Jul 7 2026) — Google and Reflection AI terms (not in
       any SpaceX filing we hold). MT Newswires, Nov 6 2026 — Musk on X about the government share of revenue (press).
   Numbers reused from the research portal (rs-spcx: js/segments-data/spcx.js, js/results-data/spcx.js), re-checked against
   the filings on Nov 25 2026. Who Customer A and Customer B are is OUR inference; the filings do not name them. */
(function(){
  /* Concentration of risk — % of consolidated revenue (filings, verbatim figures). null = below 10% ("*" in the filing). */
  const CUST_Q = { labels:['2Q25','3Q25','2Q26','3Q26'], rev:[4071, 5576, 7814, 14575],      // revenue: 10-Qs / Q3 release
                   a:[16.7, 23.9, 18.3, 16.6], b:[null, null, 19.5, 34.5] };                  // Q2 10-Q · Q3 10-Q Note 3
  const CUST_Y = { labels:['FY2023','FY2024','FY2025'], rev:[10387, 14015, 18674],          // 424B4
                   a:[25.2, 24.2, 20.9], b:[null, null, null] };                              // 424B4 Note 3 (only Customer A > 10%)
  const CUST_YTD = { '6M 2025':[19.9, null], '6M 2026':[17.9, 12.2], '9M 2025':[21.6, null], '9M 2026':[17.3, 24.2] };   // [A, B]

  /* Revenue by line — 424B4 Note 3 (FY2025) and Q1 prospectus + Q2/Q3 10-Q (9M 2026 = 1Q26 + 2Q26 + 3Q26). Both add to total revenue. */
  const CUST_LINES = [
    ['Starlink consumer',                  7208, 7754],
    ['Starlink enterprise & government',   4179, 5042],
    ['Launch services',                    2576, 2108],
    ['Launch & development',               1510, 1240],
    ['Advertising (X)',                    1844, 1248],
    ['SI solutions & infrastructure',      1357, 9691]
  ];
  const CUST_TOT = [18674, 27083];

  const pct1 = v => v == null ? 'below 10%' : v.toFixed(1) + '%';
  const tagF = '<span class="tag ok">Filing</span>', tagI = '<span class="tag wait">Our inference</span>',
        tagS = '<span class="tag n">Sell-side</span>', tagP = '<span class="tag open">Press</span>', tagC = '<span class="tag n">Call</span>';

  registerView({ id:'cust',
    css: `#v-cust .txt td{white-space:normal;text-align:left;vertical-align:top;line-height:1.5}
      #v-cust .txt td:first-child{min-width:150px}
      #v-cust .txt th{text-align:left}
      #v-cust blockquote{font-size:12.5px;line-height:1.6;color:var(--ink2);border-left:3px solid var(--steel);padding:8px 14px;background:var(--pale);border-radius:0 8px 8px 0}
      #v-cust blockquote .w{display:block;font-size:11px;color:var(--mu);margin-top:6px}
      #v-cust .q{display:flex;flex-direction:column;gap:10px}`,
    html: `
    <p class="lede">Two unnamed customers paid <strong>more than half of 3Q26 revenue</strong>. One of them, a single compute customer,
    paid <strong>34.5%</strong> on contracts either side can end on 90 days’ notice. Below them sits a broad base of Starlink subscribers,
    enterprises, governments and launch customers.</p>

    <div class="srow">
      ${tile('Customer B · 3Q26', '34.5%', 'Of group revenue, SI only (Q3 10-Q). 19.5% in 2Q26')}
      ${tile('Customer A · 3Q26', '16.6%', 'All three segments. 20.9% of FY2025 (424B4)')}
      ${tile('Two customers · 3Q26', '51.1%', 'A + B; no other customer above 10%')}
      ${tile('Receivables', '27.7%', 'Owed by one customer at Sep 30 2026 (Q3 10-Q)')}
    </div>

    ${sec({ t:'Concentration: two customers, neither named', s:'The filing gives shares; who they are is our inference',
      ctl:`<div class="ctls">${seg('cust-p','Period',[['q','Quarters'],['y','Full years']],'q')}${seg('cust-u','Show',[['pct','% of revenue'],['usd','Implied $']],'pct')}</div>`,
      b:`<div id="cust-c"></div>
        <div class="cols2" style="margin-top:22px">
          <div>
            <div class="pt">What the 10-Q says <span class="tag ok">Filing · verbatim</span></div>
            <blockquote>“Revenue from Customer A relates to all three segments and revenue from Customer B relates to the SI segment.
            No other customers represented more than 10% of consolidated revenue during the three and nine months ended September 30, 2026 and 2025.
            As of September 30, 2026, one customer represented 27.7% of Accounts receivable, net. No customer represented 10% or more
            of Accounts receivable, net as of December 31, 2025.”<span class="w">Q3 2026 Form 10-Q, Note 3, Concentration of risk</span></blockquote>
            <blockquote style="margin-top:10px">“In addition, a significant portion of our AI infrastructure revenue is concentrated in a small number of customers.
            Our cloud services agreements generally provide for monthly fees and, after an initial period inclusive of capacity ramp
            (generally, a number of months), may be terminated by either party upon 90 days’ notice.”<span class="w">Q2 2026 Form 10-Q, Item 1A, Risk factors</span></blockquote>
          </div>
          <div>
            <div class="pt">Who they probably are ${tagI}</div>
            <ul class="pl">
              <li><strong>Customer A fits the U.S. government.</strong> It buys from all three segments (launches, Starlink and Starshield, SI), and its share has fallen from 25.2% (FY2023) to 16.6% (3Q26) as compute revenue grew. Musk said on X that government will be <strong>under 10% of revenue in 4Q26</strong> and under 5% a year later (MT Newswires, Nov 6 2026, press).</li>
              <li><strong>Customer B fits Anthropic.</strong> It is SI only, it first crossed 10% in 2Q26 when the Anthropic agreements began ramping, and no other named compute contract is large enough.</li>
              <li><strong>One check does not close.</strong> 34.5% of 3Q26 revenue is about $5.0B, more than three months of Anthropic’s $1.25B monthly fee ($3.75B). The Q3 10-Q cites “signing additional contracts during the period”. Either Anthropic’s contracts grew after the prospectus, or Customer B is someone else. The filings do not say.</li>
            </ul>
          </div>
        </div>`,
      n:'Shares: 424B4 Note 3 (FY2023–FY2025), Q2 2026 10-Q and Q3 2026 10-Q Note 3. Year-to-date: Customer A 19.9% (6M25), 17.9% (6M26), 21.6% (9M25), 17.3% (9M26); Customer B 12.2% (6M26), 24.2% (9M26). First and fourth quarters are not disclosed. "Implied $" is our arithmetic (share × reported revenue). Identities are our inference, not disclosures.' })}

    ${sec({ t:'What each top customer buys', s:'The two the filings size, then the compute customers named anywhere',
      b:`<div class="tw txt">${table(['Customer','What it buys','Share / size','Source','Basis'], [
        ['<b>Customer A</b><br><span style="color:var(--mu)">inferred: U.S. government</span>', 'Launches, Starlink and Starshield, and SI. All three segments (filing).', '20.9% of FY2025 (~$3.9B)<br>16.6% of 3Q26 (~$2.4B)', '424B4 Note 3; Q3 2026 10-Q Note 3', tagF + ' share<br>' + tagI + ' identity'],
        ['<b>Customer B</b><br><span style="color:var(--mu)">inferred: Anthropic</span>', 'SI only. By size, reserved GPU capacity at Colossus.', '19.5% of 2Q26 (~$1.5B)<br>34.5% of 3Q26 (~$5.0B)', 'Q2 and Q3 2026 10-Q Note 3', tagF + ' share<br>' + tagI + ' identity'],
        ['<b>Anthropic</b>', '~325,000 NVIDIA GPUs at Colossus and Colossus II', '$1.25B a month through May 2029', '424B4, Business', tagF],
        ['<b>Google</b>', '~110,000 NVIDIA GPUs plus CPUs, memory and infrastructure', '$920M a month, Oct 2026 to Jun 2029', 'Needham (Jul 7 2026); named on the Q2 2026 call', tagS + ' terms<br>' + tagC + ' name'],
        ['<b>Reflection AI</b>', 'NVIDIA GB300 capacity at Colossus 2', '$150M a month from Jul 1 2026', 'Needham (Jul 7 2026), press reports', tagP],
        ['<b>Named enterprises</b>', 'Starlink for fleets: United Airlines, Carnival, Maersk, John Deere', 'Not disclosed', '424B4, Business', tagF],
        ['<b>Mobile carriers</b>', 'Starlink Mobile: T-Mobile, One NZ, Optus, Telstra, Rogers, KDDI and others', 'Not disclosed', '424B4, Business', tagF]
      ])}</div>`,
      n:'Shares are the filings’; dollar sizes in brackets are our arithmetic on reported revenue. The Google and Reflection AI terms come from Needham’s initiation (Jul 7 2026), which cites SpaceX filings we have not been able to match. They are not in the 424B4 or the two 10-Qs. Google is named as a compute customer on the Q2 2026 call (Aug 4 2026).' })}

    ${sec({ t:'Customer classes and the revenue they pay', s:'FY2025 was before the compute contracts; nine months of 2026 are not',
      ctl:`<div class="ctls">${seg('cust-cu','Show',[['usd','$'],['pct','% of revenue']],'usd')}</div>`,
      b:`<div id="cust-l"></div>
        <div class="tw txt" style="margin-top:18px">${table(['Class','Who (named in the filings)','How they pay','Revenue line'], [
          ['<b>Consumers</b>', 'Residential and Roam subscribers: 13.6M at Sep 30 2026', '“a monthly subscription fee, which varies based on geographic market and download speed, plus typically a one-time upfront terminal cost”', 'Starlink consumer'],
          ['<b>Enterprises, airlines and ships</b>', 'United Airlines, Carnival, Maersk, John Deere. About 12,000 planes contracted (Q3 call)', '“a combination of subscriptions, data consumption, capacity, or other pricing models”', 'Starlink enterprise & government'],
          ['<b>Governments and defense</b>', 'U.S. government (Starshield, national-security launches, NASA); FEMA, NOAA and several foreign governments', '“long term contracts for Starshield”; fixed-price launch contracts', 'Starlink enterprise & government; Launch lines'],
          ['<b>Mobile carriers</b>', 'T-Mobile, One NZ, Optus, Telstra, Rogers, KDDI, Salt, Entel, Kyivstar, VMO2', '“either a fixed fee or a per-mobile user fee-based amount”', 'Starlink enterprise & government'],
          ['<b>Launch customers</b>', 'NASA, the NRO, Axiom Space, SES, Eutelsat, OneWeb', '“based on the type of rocket, mass to orbit, size of payload, and type of service”', 'Launch services; Launch & development'],
          ['<b>AI labs</b>', 'Anthropic (424B4), Google (Q2 call), Reflection AI (press)', 'Fixed monthly fees for reserved compute capacity (Q3 10-Q, Note 2)', 'SI solutions & infrastructure'],
          ['<b>Advertisers</b>', 'Advertisers on X', 'Ad products displayed on X', 'Advertising (X)'],
          ['<b>Grok, X and Cursor users</b>', 'Consumers and enterprises; Cursor from Aug 14 2026 ($608M in 3Q26)', 'Subscriptions; license-, consumption- or outcome-based pricing for Grok Enterprise', 'SI solutions & infrastructure']
        ])}</div>`,
      n:'Revenue lines: 424B4 Note 3 (FY2025, adds to $18,674M) and the 1Q26 interim statements, Q2 and Q3 2026 10-Q (9M 2026, adds to $27,083M). Enterprise, airline, maritime, government and carrier revenue share one line; SpaceX does not split it. Quoted pricing text: 424B4, Business. Customer names: 424B4, except Google (Q2 2026 call), Reflection AI (press) and the planes figure (Q3 2026 call, Oct 20 2026).' })}

    ${sec({ t:'The compute contracts', s:'Large, short and cancellable by either side. Only Anthropic’s terms are in a filing',
      b:`<div class="tw txt">${table(['Customer','Signed','Fee','Capacity','Term and exit','Source'], [
          ['<b>Anthropic</b>', 'May 3 2026', '$1.25B a month', '~325,000 NVIDIA GPUs, Colossus and Colossus II', 'Through May 2029; ramp in May and June 2026 at a reduced fee. “After the initial three-month period, the agreements may be terminated by either party upon 90 days’ notice.”', '424B4, Business and subsequent events ' + tagF],
          ['<b>Google</b>', 'Jun 5 2026', '$920M a month (~$29.7B headline)', '~110,000 NVIDIA GPUs', 'Oct 2026 to Jun 2029. Delivery deadline Sep 30 2026, then a one-month grace before Google may terminate or take less capacity at a lower fee. Either side may exit on 90 days’ notice after Dec 31 2026.', 'Needham, Jul 7 2026 ' + tagS],
          ['<b>Reflection AI</b>', 'Jun 22 2026', '$150M a month (~$6.3B to 2029)', 'NVIDIA GB300, Colossus 2', 'From Jul 1 2026. 90 days’ notice by either side after an initial three months.', 'Needham, Jul 7 2026; press ' + tagP]
        ])}</div>
        <div class="srow" style="margin-top:18px">
          ${tile('Three contracts, per month', '$2.3B', '~$27.8B a year at full fee (our sum; Google and Reflection unverified)')}
          ${tile('Backlog · Sep 30 2026', '$63B', '$17.5B already deferred revenue; ~$42B within a year')}
          ${tile('Backlog · Dec 31 2025', '$28.4B', 'Before any compute contract (424B4)')}
        </div>
        <div class="q" style="margin-top:18px">
          <blockquote>“Certainly, as you know, we’ve already announced some previous deals with Google and Anthropic that start to ramp either later this quarter or in October.”<span class="w">Bret Johnsen, CFO · Q2 2026 call, Aug 4 2026</span></blockquote>
          <blockquote>“And obviously, our approach is to rent at effectively the spot market rate as opposed to sign these long-term deals. […] We see them renewing at higher dollars per watt, not lower dollars per watt.”<span class="w">Elon Musk, CEO · Q3 2026 call, Oct 20 2026</span></blockquote>
          <blockquote>“We ended the quarter with substantial backlog totaling $63 billion as of September 30, of which $17.5 billion was recognized as deferred revenue. Approximately $42 billion of this backlog is expected to be recognized within the next year.”<span class="w">Bret Johnsen, CFO · Q3 2026 call, Oct 20 2026</span></blockquote>
        </div>`,
      n:'Anthropic: 424B4 (Jun 12 2026), Business and the subsequent-events note. Google and Reflection AI: Needham initiation (Jul 7 2026), not in the 424B4 or the Q2 and Q3 2026 10-Qs. Whether Google’s Sep 30 2026 delivery deadline was met is not disclosed. Cloud services are recognised as fixed monthly fees over time (Q3 2026 10-Q, Note 2). Backlog: Q3 2026 call and 424B4 Note 3. Calls quoted verbatim.' })}
    `,
    init(){
      /* (a) concentration chart */
      let per = 'q', unit = 'pct';
      const mkA = () => {
        const d = per === 'q' ? CUST_Q : CUST_Y;
        const val = arr => unit === 'pct' ? arr : arr.map((v, i) => v == null ? null : Math.round(v / 100 * d.rev[i]));
        return { labels:d.labels, rowHead:'Period', height:'s', stacked:true, total:true,
          unit: unit === 'pct' ? '% of revenue' : '$M, implied',
          fmt: unit === 'pct' ? (v => v == null ? 'below 10%' : num(v, 1) + '%') : (v => v == null ? 'below 10%' : usd(v)),
          series:[ { key:'a', label:'Customer A (all segments)', color:C.steel, data:val(d.a), stack:'s' },
                   { key:'b', label:'Customer B (SI only)', color:C.si, data:val(d.b), stack:'s' } ],
          tableNote: per === 'q'
            ? '1Q and 4Q shares are not disclosed. Year-to-date: ' + Object.entries(CUST_YTD).map(([k, v]) => k + ' A ' + pct1(v[0]) + ', B ' + pct1(v[1])).join(' · ') + '.'
            : 'In FY2023–FY2025 only Customer A crossed 10% of revenue (424B4 Note 3).' };
      };
      const blkA = chartBlock($('#cust-c'), mkA());
      pills('#cust-p', v => { per = v; blkA.set(mkA()); });
      pills('#cust-u', v => { unit = v; blkA.set(mkA()); });

      /* (c) revenue by line */
      const mkL = u => ({ labels:CUST_LINES.map(r => r[0]), horizontal:true, height:'', rowHead:'Revenue line',
        unit: u === 'pct' ? '% of revenue' : '$M',
        fmt: u === 'pct' ? (v => num(v, 1) + '%') : (v => usd(v)),
        series:[ { key:'y', label:'FY2025', color:C.fog, data:CUST_LINES.map(r => u === 'pct' ? +(r[1] / CUST_TOT[0] * 100).toFixed(1) : r[1]) },
                 { key:'n', label:'9M 2026', color:C.deep, data:CUST_LINES.map(r => u === 'pct' ? +(r[2] / CUST_TOT[1] * 100).toFixed(1) : r[2]) } ],
        tableNote:'Total revenue: FY2025 $18,674M; 9M 2026 $27,083M. SI solutions & infrastructure in 9M 2026 includes compute rental, Grok and X subscriptions, data licensing and $608M from Cursor.' });
      const blkL = chartBlock($('#cust-l'), mkL('usd'));
      pills('#cust-cu', v => blkL.set(mkL(v)));
    }
  });
})();
