/* How it evolved — FY15 → FY25 */
registerView({ id:'evo',
  html: `
  <div class="srow">
    ${tile('Stores, FY15 → FY25', SD.annual.FY2015.stores_end + ' → ' + LAST.stores_end, '13 states (FY16) → 24')}
    ${tile('Operating margin', '3.9% → 7.8%', 'FY19 low → FY25 high')}
    ${tile('Diluted EPS', '$0.83 → $' + LAST.diluted_eps.toFixed(2), 'FY15 → FY25')}
    ${tile('Diluted shares', num(SD.annual.FY2015.diluted_shares) + 'M → ' + num(LAST.diluted_shares) + 'M', '−37%, mostly through buybacks')}
  </div>

  ${sec({ t:'Growth: stores, comps and sales', s:'Fast unit growth with fading comps until 2019; the reset, COVID, then a two-year surge',
    ctl:`<div class="ctls">${seg('evo-m','Metric',[['s','Net sales'],['st','Stores'],['c','Comps']],'s')}</div>`,
    b:`<div id="evo-c"></div>`,
    n:'10-K "Other operating data" and MD&A. FY15 and FY20 are 53-week years, which inflates their sales and growth.' })}

  ${sec({ t:'Margins: the reset worked', s:'Fewer promotions from Q4 2019, less shrink, more Sprouts Brand',
    b:`<div id="evo-p"></div>`,
    n:'10-K income statements; ratios are ours. Gross margin before FY16 is not comparable (2018 change in cost classification). FY23 operating income includes $30.5M of impairments from closing 11 stores.' })}

  ${sec({ t:'The milestones', s:'Four phases in ten years',
    b:`<div>
      <div class="st"><b>2015–2018</b><span><span class="tag wait">Growth</span></span><span>27–36 openings a year, a 14% unit-growth target. Comps slid from 5.8% to 2.1% and operating margin from 6.4% to 4.3% amid a "competitive environment".</span></div>
      <div class="st"><b>Dec 2018–Jun 2019</b><span><span class="tag open">Gap</span></span><span>CEO Amin Maredia resigns; interim co-CEOs; one takes medical leave.</span></div>
      <div class="st"><b>Jun 2019 – May 2020</b><span><span class="tag ok">Reset</span></span><span>Jack Sinclair (ex-99 Cents Only, Walmart US Grocery) becomes CEO. Promotions cut from Q4 2019; May 2020 strategy: target customers, smaller boxes, DCs within 250 miles, less broad advertising, 10%+ unit growth.</span></div>
      <div class="st"><b>2020–2021</b><span><span class="tag n">COVID</span></span><span>FY20 gross margin +3.2 pts; e-commerce 13% of sales in April 2020. FY21 comps −6.7% cycling the surge; equipment delays cut openings to 12.</span></div>
      <div class="st"><b>2021–2023</b><span><span class="tag n">Network</span></span><span>CO and FL DCs open; GA DC closes; 15 under-performing stores closed in 2022–23.</span></div>
      <div class="st"><b>2024–2025</b><span><span class="tag ok">Payoff</span></span><span>Comps +7.6% and +7.3%, 33 and 37 openings, EPS $2.50 → $5.31. Sprouts Rewards loyalty launched nationwide.</span></div>
      <div class="st"><b>2026</b><span><span class="tag open">Reversal</span></span><span>Comps negative all year, guidance cut, price investment; CEO handover on Jan 4 2027.</span></div>
    </div>`,
    n:'10-K FY15–FY25, earnings 8-Ks and 8-K Item 5.02 filings.' })}

  ${sec({ t:'Where the cash went', s:'Free cash flow mostly returned through buybacks',
    b:`<div id="evo-k"></div>`,
    n:'Cash-flow statements. FCF = operating cash flow − gross capex (our measure; the company quotes capex net of landlord reimbursements). Revolver undrawn since mid-2024.' })}
  `,
  init(){
    const M = {
      s:{ unit:'$M', fmt:v => usd(v), rowHead:'Fiscal year', series:[ { key:'s', label:'Net sales', color:SC.per, data:A('net_sales') } ],
          tableNote:'Sales per average store (ours): ' + FY.map(k => 'FY' + k.slice(4) + ' $' + SD.derived_ratios.sales_per_avg_store_usd_m[k].toFixed(1) + 'M').join(' · ') + '.' },
      st:{ unit:'stores', fmt:v => num(v), rowHead:'Fiscal year', series:[
          { key:'o', label:'Opened', color:SC.pos, data:A('stores_opened') },
          { key:'c', label:'Closed', color:SC.neg, data:A('stores_closed') } ],
          tableNote:'Stores at year end: ' + FY.map(k => 'FY' + k.slice(4) + ' ' + SD.annual[k].stores_end).join(' · ') + '. Two stores were acquired in FY23.' },
      c:{ unit:'% y/y', fmt:v => sgnp(v), rowHead:'Fiscal year', series:[ { key:'c', label:'Comparable store sales', color:SC.navy, data:A('comparable_store_sales_growth').map(v => v*100) } ] }
    };
    const blk = chartBlock($('#evo-c'), { labels:FYL, ...M.s });
    pills('#evo-m', v => blk.set({ tableNote:'', ...M[v] }));

    chartBlock($('#evo-p'), { labels:FYL, unit:'% of sales', fmt:v => pctf(v), type:'line', rowHead:'Fiscal year',
      series:[ { key:'g', label:'Gross margin', color:SC.per, type:'line', data:R('gross_margin').map(v => v == null ? null : v*100) },
               { key:'o', label:'Operating margin', color:SC.navy, type:'line', data:R('operating_margin').map(v => v*100) },
               { key:'n', label:'Net margin', color:SC.sky, type:'line', data:R('net_margin').map(v => v*100) } ],
      tableNote:'Net advertising spend: $57.2M (FY19) → $45.9M (FY21) while sales grew — part of the reset.' });

    chartBlock($('#evo-k'), { labels:FYL, unit:'$M', fmt:v => usd(v), rowHead:'Fiscal year', height:'s',
      series:[ { key:'f', label:'Free cash flow', color:SC.steel, data:A('fcf') },
               { key:'b', label:'Share buybacks', color:SC.fog, data:A('share_repurchases') } ],
      tableNote:'Revolver debt: ' + FY.map(k => 'FY' + k.slice(4) + ' ' + usd(SD.annual[k].total_debt)).join(' · ') + '. Operating leases ($1.86B at FY25) excluded.' });
  }
});
