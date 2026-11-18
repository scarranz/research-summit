/* Growth engine — the levers and the 2020 targets against what happened */
const SPL = FY.map(k => SD.annual[k].private_label_pct_sales);
const UNIT = FY.map((k,i) => i === 0 ? null : (SD.annual[k].stores_end / SD.annual[FY[i-1]].stores_end - 1) * 100);

registerView({ id:'drv',
  html: `
  <div class="srow">
    ${tile('Unit growth · FY25', pctf(UNIT[UNIT.length-1]), 'Target ~10% a year; 42 net new in 2026')}
    ${tile('Sales per store · FY25', '$' + SD.derived_ratios.sales_per_avg_store_usd_m.FY2025.toFixed(1) + 'M', 'Per average store (ours)')}
    ${tile('Sprouts Brand', '>25%', 'Of sales; higher margin than brands')}
    ${tile('Stores within 250 mi of a DC', '~80%', 'Goal: all fresh DCs within 250 miles')}
  </div>

  ${sec({ t:'The levers over time', s:'One lever per view',
    ctl:`<div class="ctls">${seg('drv-m','Lever',[['u','Unit growth'],['p','Sprouts Brand'],['s','Sales per store'],['a','Advertising']],'u')}</div>`,
    b:`<div id="drv-c"></div>`,
    n:'10-K FY15–FY25. Sales per store is our measure (sales ÷ average store count); the company does not disclose it. Sprouts Brand percentages are the filings’ rounded "approximately / just over" figures.' })}

  ${sec({ t:'The May 2020 targets against what happened', s:'Set in the Q1 2020 release; reiterated in later 10-Ks',
    b:`<div class="tw">${table(['Target (2020)','What happened','Read'], [
      ['10%+ unit growth a year', 'Start pushed from 2022 to 2023 (equipment delays). Growth 5.4% (FY23, net of 11 closures), 8.1% (FY24), 8.4% (FY25)', '<span class="tag wait">Below</span>'],
      ['Low single-digit comps', '+3.4% (FY23), +7.6% (FY24), +7.3% (FY25); then ~−1.7% guided for FY26', '<span class="tag ok">Above, then below</span>'],
      ['Stable to expanding EBIT margin', '5.1% (FY23) → 7.8% (FY25); FY26 guide ~6.6% (our arithmetic: $605M on ~+4.3% sales)', '<span class="tag wait">Up, now falling</span>'],
      ['Low double-digit EPS growth', 'EPS $2.43 (FY20) → $5.31 (FY25), ~17% a year; FY26 guide ~$4.80 (−10%)', '<span class="tag ok">Above to FY25</span>'],
      ['New-store cost ~20% lower; ~40% cash-on-cash returns', 'Not disclosed in any filing', '<span class="tag n">No data</span>']
    ])}</div>`,
    n:'8-K May 5 2020 (Ex. 99.1), 10-K FY20–FY25, Q3 2026 release. Unit growth = change in year-end store count.' })}

  ${sec({ t:'What management says drives the next leg', s:'10-K FY25 and the Q3 2026 release',
    b:`<div class="cols2"><ul class="pl">
        <li><strong>Stores:</strong> ~10% unit growth in smaller boxes, denser entry into new markets; management says recent vintages perform strongly.</li>
        <li><strong>Target customers:</strong> innovation, Sprouts Brand, personalisation through Sprouts Rewards, delivery via Instacart, DoorDash and Uber Eats.</li></ul>
      <ul class="pl">
        <li><strong>Supply chain:</strong> meat & seafood self-distribution to ~95% of stores in 2026; fresher product, less shrink.</li>
        <li><strong>Affordability (new):</strong> price investment from Q4 2026 to bring traffic back — the lever that costs margin.</li></ul></div>`,
    n:'Capital return: a $1B buyback authorised in Q3 2025.' })}
  `,
  init(){
    const M = {
      u:{ unit:'% change in stores', fmt:v => pctf(v), rowHead:'Fiscal year', series:[ { key:'u', label:'Unit growth', color:SC.steel, data:UNIT } ],
          extra:null, tableNote:'Openings: ' + FY.map(k => 'FY' + k.slice(4) + ' ' + SD.annual[k].stores_opened).join(' · ') + '.' },
      p:{ unit:'% of sales', fmt:v => pctf(v,0), rowHead:'Fiscal year', series:[ { key:'p', label:'Sprouts Brand (private label)', color:SC.per, data:SPL.map(v => v == null ? null : v*100) } ],
          tableNote:'Renamed "Sprouts Brand" in the FY22 10-K, when the share jumped from ~16% to "just over 19%"; the definition may have widened. FY15: not given as a %.' },
      s:{ unit:'$M per store', fmt:v => '$' + num(v,1) + 'M', rowHead:'Fiscal year', series:[ { key:'s', label:'Sales per average store', color:SC.navy, data:FY.map(k => SD.derived_ratios.sales_per_avg_store_usd_m[k]) } ], yMin:0,
          tableNote:'FY15 and FY20 have 53 weeks. New boxes are smaller (21–25k sq ft vs ~27k average).' },
      a:{ unit:'$M', fmt:v => usd(v,1), rowHead:'Fiscal year', series:[ { key:'a', label:'Net advertising spend', color:SC.grey, data:A('advertising_expense_net') } ],
          tableNote:'As % of sales: ' + FY.map(k => 'FY' + k.slice(4) + ' ' + (SD.annual[k].advertising_expense_net / SD.annual[k].net_sales * 100).toFixed(2) + '%').join(' · ') + '.' }
    };
    const blk = chartBlock($('#drv-c'), { labels:FYL, ...M.u });
    pills('#drv-m', v => blk.set({ tableNote:'', ...M[v] }));
  }
});
