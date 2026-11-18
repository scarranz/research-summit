/* Where it is today — 2026 reversal, guidance cut, CEO change */
registerView({ id:'now',
  html: `
  <div class="srow">
    ${tile("Comps · Q3'26", sgnp(LQ.comp_sales_growth*100), 'Negative all year; from +11.7% in Q1’25')}
    ${tile('FY26 EPS guide', '~$' + G26.diluted_eps.toFixed(2), 'Cut Oct 28 from $5.32–5.40')}
    ${tile("Q4'26 comps guide", '−2% to −4%', 'EPS $0.47–0.51 vs $0.92 a year ago')}
    ${tile('Stores opened · Q3', LQ.openings, 'A record; 42 net new in 2026 kept')}
  </div>

  ${sec({ t:'The last 12 quarters', s:'Growth came from cycling a surge: comps peaked in Q1’25 and turned negative a year later',
    ctl:`<div class="ctls">${seg('now-m','Metric',[['comp','Comps'],['s','Net sales'],['m','Margins'],['eps','EPS']],'comp')}</div>`,
    b:`<div id="now-c"></div>`,
    n:'10-Qs and earnings releases (8-K Ex. 99.1), Q4’23–Q3’26. Q3’26 comps include ~0.6 pt from a cyclospora outbreak that hit produce.' })}

  ${sec({ t:'FY26 guidance, from steady to cut', s:'52-week basis; FY26 has a 53rd week (~$190M sales, ~$0.16 EPS) on top',
    b:`<div class="cols2"><div id="now-g"></div>
      <div class="tw">${table(['Quarter','Comps guide','Comps actual','EPS guide','EPS actual'], ['Q1_2026','Q2_2026','Q3_2026'].map(k => { const g = SD.guidance.quarterly_guide_vs_actual_2026[k];
        return [k.replace('_2026',"'26"), sgnp(g.comp_guide[0]*100) + ' to ' + sgnp(g.comp_guide[1]*100), sgnp(g.comp_actual*100), '$' + g.eps_guide[0].toFixed(2) + '–' + g.eps_guide[1].toFixed(2), '$' + g.eps_actual.toFixed(2)]; }))}
      <div class="snote" style="margin-top:10px">EPS landed in or at the top of each quarterly range; comps missed in Q3. The cut is about Q4 and 2027, not the year so far.</div></div>
    </div>`,
    n:'Earnings releases Feb 19, Apr 29, Jul 29 and Oct 28 2026. Implied Q4 EBIT (13 weeks) ≈ $63M vs $123M in Q4’25 — our arithmetic ($605M − $542M nine months).' })}

  ${sec({ t:'Why, and what changes in January', s:'Read from the Q3 2026 release and 8-Ks',
    b:`<ul class="pl">
      <li><strong>Price investment:</strong> management is "increasing investments to enhance affordability", with "broader and deeper price investments", plus technology and supply chain, in Q4 2026 and into 2027. The first time the filings show Sprouts competing on price.</li>
      <li><strong>Shrink:</strong> Q3 gross margin fell 50 bp, mostly from higher shrink (+0.4 pt of sales) as comps softened.</li>
      <li><strong>CEO change:</strong> Nick Konat (President/COO since 2022) becomes CEO on <strong>Jan 4 2027</strong>; Jack Sinclair, who led the 2019–20 reset, becomes Executive Chairman. New Chief Merchandising Officer (ex-Giant Eagle, Whole Foods); the CTO left in Oct 2026.</li>
      <li><strong>Unchanged:</strong> 42 net new stores and ~$310M net capex. Balance sheet: $229M cash, undrawn $600M revolver, $299M of buybacks year to date.</li>
    </ul>`,
    n:'Q3’26 8-K and 10-Q (Oct 28 2026); 8-Ks Feb 19, Sep 1 and Oct 14 2026.' })}
  `,
  init(){
    const sales = Qv('net_sales');
    const M = {
      comp:{ unit:'% y/y', fmt:v => sgnp(v), rowHead:'Quarter', series:[ { key:'c', label:'Comparable store sales', color:SC.steel, data:Qv('comp_sales_growth').map(v => v*100) } ] },
      s:{ unit:'$M', fmt:v => usd(v), rowHead:'Quarter', series:[ { key:'s', label:'Net sales', color:SC.per, data:sales } ],
          tableNote:'Sales still grow while comps are negative because ~10% more stores open each year.' },
      m:{ unit:'% of sales', fmt:v => pctf(v), type:'line', rowHead:'Quarter', series:[
          { key:'g', label:'Gross margin', color:SC.per, type:'line', data:Qv('gross_margin').map(v => v*100) },
          { key:'o', label:'Operating margin', color:SC.navy, type:'line', data:Qv('operating_income').map((v,i) => v/sales[i]*100) } ] },
      eps:{ unit:'$ per share', fmt:v => '$' + num(v,2), rowHead:'Quarter', series:[ { key:'e', label:'Diluted EPS', color:SC.navy, data:Qv('diluted_eps') } ],
          tableNote:'Q1 is seasonally the strongest quarter. Q4’26 guide: $0.47–0.51.' }
    };
    const blk = chartBlock($('#now-c'), { labels:QL, ...M.comp });
    pills('#now-m', v => blk.set({ type:'bar', tableNote:'', ...M[v] }));

    const H = SD.guidance.FY2026_history;
    const lo = h => Array.isArray(h.diluted_eps) ? h.diluted_eps[0] : h.diluted_eps, hi = h => Array.isArray(h.diluted_eps) ? h.diluted_eps[1] : h.diluted_eps;
    chartBlock($('#now-g'), { labels:H.map(h => h.issued), unit:'$ per share', fmt:v => '$' + num(v,2), rowHead:'Guidance date', height:'s', yMin:4,
      series:[ { key:'lo', label:'EPS guide, low', color:SC.fog, data:H.map(lo) }, { key:'hi', label:'EPS guide, high', color:SC.steel, data:H.map(hi) } ],
      tableNote:'EBIT guide: ' + H.map(h => Array.isArray(h.ebit_usd_m) ? '$' + h.ebit_usd_m[0] + '–' + h.ebit_usd_m[1] + 'M' : '~$' + h.ebit_usd_m + 'M').join(' → ') + '. Comps: ' + H.map(h => Array.isArray(h.comp) ? sgnp(h.comp[0]*100,1) + ' to ' + sgnp(h.comp[1]*100,1) : '~' + sgnp(h.comp*100)).join(' → ') + '.' });
  }
});
