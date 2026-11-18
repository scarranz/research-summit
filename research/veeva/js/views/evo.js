/* How it evolved — ten years, FY16 → FY26 */
registerView({ id:'evo',
  html: `
  <div class="srow">
    ${tile('Revenue, FY16 → FY26', (LAST.total_revenue / VD.annual.FY2016.total_revenue).toFixed(1) + '×', usd(VD.annual.FY2016.total_revenue) + ' → ' + usd(LAST.total_revenue))}
    ${tile('Non-GAAP op. margin', '27% → 45%', 'GAAP 19% → 29%')}
    ${tile('Free cash flow · FY26', usd(LAST.fcf), 'Capex is tiny: ' + usd(LAST.capex))}
    ${tile('R&D passed Commercial', 'Q1 FY25', 'Now 53% of FY26 subscription')}
  </div>

  ${sec({ t:'Revenue over ten years', s:'From a CRM company to a Vault company',
    ctl:`<div class="ctls">${seg('evo-m','Split',[['area','By product area'],['g','Growth y/y']],'area')}</div>`,
    b:`<div id="evo-c"></div>`,
    n:'10-K revenue notes. Two product-area definitions exist: Commercial Cloud / Vault (FY17–21) and Commercial / R&D Solutions (FY20–26, PromoMats and MedComms moved into Commercial). The chart uses the second only; they must not be spliced.' })}

  ${sec({ t:'Margins and cash', s:'Growth slowed from 25–35% a year to ~15–18% while margins widened',
    ctl:`<div class="ctls">${seg('evo-p','Metric',[['m','Operating margin'],['c','Cash generation']],'m')}</div>`,
    b:`<div id="evo-p-c"></div>`,
    n:'10-K and Q4 releases. Non-GAAP is the company’s (excludes stock pay, intangibles amortisation and, in FY25–26, litigation settlement costs). FY24 was depressed by ~$90M from the contract-terms change.' })}

  ${sec({ t:'The milestones', s:'What changed the shape of the business',
    b:`<div>
      <div class="st"><b>Sep 2015</b><span><span class="tag n">Acquisition</span></span><span>Zinc Ahead (marketing content). In FY16 ~79% of subscription revenue was still CRM; Vault exited the year at a $100M run rate.</span></div>
      <div class="st"><b>Jan 2017</b><span><span class="tag open">Dispute</span></span><span>IQVIA sues over data use; Veeva counter-sues on antitrust grounds. Runs until a no-damages settlement and partnership on Aug 13 2025.</span></div>
      <div class="st"><b>FY20</b><span><span class="tag ok">Goal met</span></span><span>$1B revenue reached ($1,104M). Crossix acquired (~$448M).</span></div>
      <div class="st"><b>Feb 2021</b><span><span class="tag n">Governance</span></span><span>Becomes a Public Benefit Corporation. Dual-class shares end Oct 2023.</span></div>
      <div class="st"><b>Late 2022</b><span><span class="tag open">Strategy</span></span><span>Announces CRM moves off Salesforce onto Vault; the Salesforce agreement is not renewed (see Vault CRM tab).</span></div>
      <div class="st"><b>Feb 2023</b><span><span class="tag wait">Contracts</span></span><span>Multi-year contracts become cancellable for convenience; ~$90M hit to FY24 and backlog (RPO) disclosure stops.</span></div>
      <div class="st"><b>Q1 FY26</b><span><span class="tag ok">Goal met</span></span><span>$3B revenue run rate reached. Next goal: <strong>$6B run rate by 2030</strong>.</span></div>
      <div class="st"><b>Jan 2026</b><span><span class="tag n">Capital</span></span><span>First buyback, $2B. $467M bought in the first half of FY27.</span></div>
    </div>`,
    n:'10-K FY16–FY26, earnings releases and Investor Day 8-Ks. The exact date of the Salesforce announcement is not in the filings reviewed (commonly reported as Dec 2022). 2030 margin/mix targets reported by third parties were not verified.' })}

  ${sec({ t:'Customers', s:'Counts are disclosed only at fiscal year end',
    b:`<div id="evo-k"></div>`,
    n:'10-K Item 1 / MD&A. Customers by area overlap (a company can buy both), so they sum to more than the total.' })}
  `,
  init(){
    const M = {
      area:{ unit:'$M', fmt:v => usd(v), stacked:true, total:true, rowHead:'Fiscal year', series:[
        { key:'rd', label:'R&D & Quality', color:VC.rd, data:FY.map(k => { const p = VD.annual[k].product_area_new; return p ? p.rd_subscription + p.rd_services : null; }), stack:'a' },
        { key:'co', label:'Commercial', color:VC.com, data:FY.map(k => { const p = VD.annual[k].product_area_new; return p ? p.commercial_subscription + p.commercial_services : null; }), stack:'a' },
        { key:'un', label:'Not split (FY16–19)', color:VC.svc, data:FY.map(k => VD.annual[k].product_area_new ? null : VD.annual[k].total_revenue), stack:'a' } ],
        tableNote:'Subscription + services in each area. FY16–FY19 have no split on the current definition.' },
      g:{ unit:'% y/y', fmt:v => pctf(v), type:'line', rowHead:'Fiscal year', series:[
        { key:'t', label:'Total revenue', color:VC.sub, type:'line', data:yoyA(A('total_revenue')) },
        { key:'s', label:'Subscription revenue', color:VC.line, type:'line', data:yoyA(A('subscription_revenue')) } ],
        tableNote:'FY17 growth compares restated FY17 (ASC 606) with unrestated FY16 (ASC 605).' }
    };
    const blk = chartBlock($('#evo-c'), { labels:FYL, ...M.area });
    pills('#evo-m', v => blk.set({ stacked:false, total:false, type:'bar', tableNote:'', ...M[v] }));

    const rev = A('total_revenue');
    const P = {
      m:{ unit:'% of revenue', fmt:v => pctf(v,0), type:'line', rowHead:'Fiscal year', yMin:0, series:[
        { key:'ng', label:'Non-GAAP operating margin', color:VC.sub, type:'line', data:A('non_gaap_operating_income').map((v,i) => v == null ? null : v/rev[i]*100) },
        { key:'ga', label:'GAAP operating margin', color:VC.line, type:'line', data:A('operating_income').map((v,i) => v/rev[i]*100) },
        { key:'sb', label:'Stock-based pay', color:VC.svc, type:'line', data:A('stock_based_comp').map((v,i) => v/rev[i]*100) } ] },
      c:{ unit:'$M', fmt:v => usd(v), rowHead:'Fiscal year', series:[
        { key:'f', label:'Free cash flow (CFO − capex)', color:VC.sub, data:A('fcf') },
        { key:'n', label:'Net income (GAAP)', color:VC.svc, data:A('net_income') } ],
        tableNote:'Cash and short-term investments: ' + usd(VD.annual.FY2016.cash_and_short_term_investments) + ' (FY16) → ' + usd(LAST.cash_and_short_term_investments) + ' (FY26). No debt. Capex definition changed in FY21.' }
    };
    const blk2 = chartBlock($('#evo-p-c'), { labels:FYL, ...P.m });
    pills('#evo-p', v => blk2.set({ yMin:undefined, tableNote:'', ...P[v] }));

    chartBlock($('#evo-k'), { labels:FYL, unit:'customers', fmt:v => num(v), rowHead:'Fiscal year', height:'s',
      series:[ { key:'t', label:'Total customers', color:VC.sub, data:A('customers_total') },
               { key:'r', label:'R&D & Quality', color:VC.rd, type:'line', data:A('customers_rd') },
               { key:'c', label:'Commercial', color:VC.com, type:'line', data:A('customers_commercial') } ],
      tableNote:'Before FY16: 198 (FY14), 276 (FY15). Employees: ' + num(VD.annual.FY2016.employees) + ' (FY16) → ' + num(LAST.employees) + ' (FY26).' });
  }
});
