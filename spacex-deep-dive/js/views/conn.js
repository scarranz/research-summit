/* Starlink (Connectivity) — the only segment that funds the rest */
registerView({ id:'conn',
  html: `
  <div class="srow">
    ${tile('Consumer subscribers', num(CONN.subs[1],1) + 'M', '<span class="up">+89%</span> from ' + CONN.subs[0] + 'M a year earlier')}
    ${tile('Consumer ARPU · 9M', '$' + CONN.arpu[1] + '/mo', 'From $' + CONN.arpu[0] + '; back up to $' + CONN.arpuQ3 + ' in Q3')}
    ${tile('Segment adj. EBITDA · 9M', usd(CONN.ebitda[1]), '<span class="up">+60%</span>; op. income ' + usd(IS9M.opinc.conn[1]))}
    ${tile('Satellites in orbit', num(CONN.sats) + '+', CONN.markets + ' markets · ~1,200 consumer subscribers each')}
  </div>

  ${sec({ t:'Growth, nine months against nine months', s:'More subscribers at a lower average price: watch revenue, not one of the two',
    ctl:`<div class="ctls">${seg('conn-m','Metric',[['rev','Revenue'],['subs','Subscribers'],['arpu','ARPU'],['ebitda','Adj. EBITDA']],'rev')}</div>`,
    b:`<div id="conn-c"></div>`,
    n:'Q3 2026 release; satellites from the Q3 2026 10-Q ("over 11,100" broadband and mobile). ARPU fell because the mix moved to cheaper markets (424B4: international expansion and lower-priced plans). Developed markets falling from ~65% to ~40% of subscribers by 2031 is a Deutsche Bank projection (Jul 2026), not company guidance.' })}

  ${sec({ t:'What still caps capacity', s:'V3 satellites need Starship to fly, not to be reusable',
    b:`<ul class="pl">
      <li><strong>V3 does not fit in a Falcon 9.</strong> Flight 14 carried 26 V3 satellites, "about maybe half loaded" (Musk), and added ~10× the downlink of a Falcon 9 Starlink launch (Q3 release); the CFO expects each Starship launch to ramp toward "over 20 times the downlink capacity" of a Falcon 9 launch.</li>
      <li><strong>Users notice it after "a few hundred V3 satellites"</strong>, which Shotwell expects "by mid-next year" (mid-2027).</li>
      <li><strong>2026 capacity and 2027 revenue targets do not depend on Starship</strong> (company, via Needham). A Starship delay hits urban V3 capacity and orbital compute first.</li>
      <li><strong>The 2026 constraint was kit inventory:</strong> V5 kit production ramped in Q3 "alleviating inventory constraints" (CFO). Two of three ex-sales staff interviewed by Paragon think demand saturation comes next: opinion, not evidence.</li>
      <li><strong>Connectivity Q3 gross margin of 55%</strong> includes "a one-time benefit of roughly 3%", mainly tariff refunds; the CFO expects total-company Q4 gross margin "more consistent with the second quarter".</li>
    </ul>`,
    n:'Sources: Q3 2026 release and call transcript (Oct 20 2026); Needham (2026 capacity not dependent on Starship); Paragon/Heron (ex-staff interviews). Note: "60 V3 per launch" is the banks’ figure, not management’s.' })}

  ${sec({ t:'Amazon Leo, side by side', s:'Amazon’s edge is the balance sheet; it still buys launches, including from SpaceX',
    b:`<div class="tw">${table(['', 'Starlink', 'Amazon Leo (ex-Kuiper)'], [
      ['Satellites in orbit', '11,100+', '~330 (UBS); 180 launched in 2025'],
      ['Needed to sell in the US', '—', '578 (Barclays, company)'],
      ['Licensed broadband constellation', '—', '7,700 (12,841 incl. D2D pending)'],
      ['Launch', 'Own rockets; 122 Starlink launches in 2025', 'New Glenn flew 2 of 24 planned in 2026; buys 3 Falcon 9'],
      ['Payback (Wells Fargo model)', '~1 year', '~5 years'],
      ['Satellite broadband share 2030 (Mizuho, Wells Fargo)', '~76%', '~10%'],
      ['Spend', 'Funded by Starlink cash flow + markets', 'Opex > $1B per quarter in 2H26, from AWS cash flow'],
      ['User capacity', '~62M today', '~60M by 2030 (Barclays)']
    ])}</div>`,
    n:'UBS, Barclays (Jan 2026 Amazon note), Wells Fargo and Mizuho. Mizuho and Wells Fargo were IPO banks; their payback model is generous to both (80% margin, 7-year life vs ~64% and ~5 actual).' })}
  `,
  init(){
    const L = ['9M 2025','9M 2026'];
    const M = {
      rev:   { unit:'$M', fmt:v => usd(v), stacked:true, total:true, series:[
               { key:'c', label:'Consumer', color:C.conn, data:CONN.consumerRev, stack:'a' },
               { key:'e', label:'Enterprise & government', color:C.deep, data:CONN.entGovRev, stack:'a' } ],
               note:'Q3 2026 call: "We remain on pace for enterprise and government revenues to exceed consumer connectivity revenues in the future, each" (Shotwell). Enterprise & government revenue grew 91% y/y in Q3.' },
      subs:  { unit:'M', fmt:v => num(v,1) + 'M', series:[ { key:'s', label:'Consumer subscribers (end of period)', color:C.conn, data:CONN.subs } ],
               note:'Shotwell said "just under 14 million" on the call; the release says 13.6M, used here. Excludes enterprise and government accounts.' },
      arpu:  { unit:'$/month', fmt:v => '$' + num(v), series:[ { key:'a', label:'Consumer ARPU', color:C.conn, data:CONN.arpu } ],
               note:'Q3 2026 alone: $69, up 5% sequentially, "benefiting from a favorable customer mix dynamic in the quarter" (CFO).' },
      ebitda:{ unit:'$M', fmt:v => usd(v), series:[ { key:'b', label:'Segment adj. EBITDA', color:C.conn, data:CONN.ebitda } ],
               note:'Adj. EBITDA excludes depreciation of satellites, a real cost here (group D&A $8.9B in 9M).' }
    };
    const mk = k => ({ labels:L, rowHead:'Period', height:'s', ...M[k], tableNote:M[k].note });
    const blk = chartBlock($('#conn-c'), mk('rev'));
    pills('#conn-m', v => blk.set({ stacked:false, total:false, ...mk(v) }));
  }
});
