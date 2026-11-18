/* Where it is today — latest quarters and the FY27 guidance path */
registerView({ id:'now',
  html: `
  <div class="srow">
    ${tile('Revenue · Q2 FY27', usd(LQ.total_revenue), '<span class="up">+18%</span>; guide was $902–905M')}
    ${tile('Non-GAAP op. margin · Q2', pctf(LQ.non_gaap_operating_income / LQ.total_revenue * 100), 'GAAP ' + pctf(LQ.operating_income / LQ.total_revenue * 100))}
    ${tile('FY27 revenue guide', '$3.68–3.69B', '~+15%; raised twice this year')}
    ${tile('Cash & investments', usd(LQ.cash_and_short_term_investments), 'No debt · $2B buyback running')}
  </div>

  ${sec({ t:'The last 14 quarters', s:'Compare quarters year over year: billing is annual, so cash and deferred revenue are seasonal',
    ctl:`<div class="ctls">${seg('now-m','Metric',[['rev','Revenue by area'],['g','Growth y/y'],['oi','Operating income']],'rev')}</div>`,
    b:`<div id="now-c"></div>`,
    n:'Quarterly earnings releases (8-K Ex. 99.1), Q1 FY24–Q2 FY27. Q3 FY27 (to Oct 31 2026) is not reported yet; at the Nov 5 Investor Day Veeva said it expects to "meet or exceed" guidance.' })}

  ${sec({ t:'FY27 guidance, raised at every print', s:'Company non-GAAP; Veeva gives no GAAP guidance',
    b:`<div class="cols2"><div id="now-g"></div>
      <div><div class="tw">${table(['Q2 FY27','Guide (Jun 3)','Actual','Beat'], [
        ['Revenue', '$902–905M', usd(LQ.total_revenue), '+' + usd(LQ.total_revenue - 905)],
        ['Non-GAAP op. income', '$392–395M', usd(LQ.non_gaap_operating_income), '+' + usd(LQ.non_gaap_operating_income - 395)],
        ['Non-GAAP EPS', '$2.21–2.22', '$' + LQ.non_gaap_eps_diluted.toFixed(2), '+$' + (LQ.non_gaap_eps_diluted - 2.22).toFixed(2)]
      ])}</div>
      <div class="pt" style="margin-top:18px">Next print · Q3 FY27 guide</div>
      <div class="tw">${table(['Revenue','Subscription','Non-GAAP op. income','Non-GAAP EPS'], [['$932–935M','~$782M','$417–420M','$2.33–2.34']])}</div></div>
    </div>`,
    n:'Q4 FY26 (Mar 4), Q1 FY27 (Jun 3) and Q2 FY27 (Aug 26 2026) releases. FY27 subscription guidance is only in the IR deck and is not captured here.' })}

  ${sec({ t:'Two things moving inside the quarter', s:'Read from the Q2 FY27 release',
    b:`<ul class="pl">
      <li><strong>R&D & Quality grows faster than Commercial:</strong> subscription +19% vs +13%. R&D passed Commercial in Q1 FY25 and is now 55% of subscription revenue.</li>
      <li><strong>Services jumped 24%</strong> to ${usd(LQ.services_revenue)} after being flat for two years. The release gives no driver; Vault CRM migration work is a plausible one — our inference, not the company's.</li>
      <li><strong>AI:</strong> Veeva AI agents across the apps, Vault AI in every Vault app from Aug 2026, and Falcon ("agentic labor") with 5 early adopters. No revenue disclosed yet.</li>
    </ul>`,
    n:'Q1 and Q2 FY27 releases. Acquisitions in the period: Ostro (Mar 2026, ~$90M, AI chat for brands) and Copli (Q2 FY27).' })}
  `,
  init(){
    const M = {
      rev:{ unit:'$M', fmt:v => usd(v), stacked:true, total:true, rowHead:'Quarter', series:[
        { key:'rd', label:'R&D & Quality subscription', color:VC.rd, data:Qv('rd_subscription'), stack:'a' },
        { key:'co', label:'Commercial subscription', color:VC.com, data:Qv('commercial_subscription'), stack:'a' },
        { key:'sv', label:'Services', color:VC.svc, data:Qv('services_revenue'), stack:'a' } ] },
      g:{ unit:'% y/y', fmt:v => pctf(v), type:'line', rowHead:'Quarter', series:[
        { key:'t', label:'Total revenue', color:VC.sub, type:'line', data:yoy(Qv('total_revenue')) },
        { key:'rd', label:'R&D & Quality subscription', color:VC.rd, type:'line', data:yoy(Qv('rd_subscription')) },
        { key:'co', label:'Commercial subscription', color:VC.com, type:'line', data:yoy(Qv('commercial_subscription')) } ],
        tableNote:'Growth needs the same quarter a year earlier, so FY24 quarters are blank.' },
      oi:{ unit:'$M', fmt:v => usd(v), rowHead:'Quarter', series:[
        { key:'ng', label:'Non-GAAP operating income', color:VC.sub, data:Qv('non_gaap_operating_income') },
        { key:'ga', label:'GAAP operating income', color:VC.svc, data:Qv('operating_income') } ],
        tableNote:'The gap is mostly stock-based pay. Q1 FY24 GAAP was hit by the contract-terms change; Q2 FY26 by IQVIA settlement costs.' }
    };
    const blk = chartBlock($('#now-c'), { labels:QL, ...M.rev });
    pills('#now-m', v => blk.set({ stacked:false, total:false, type:'bar', tableNote:'', ...M[v] }));

    const H = VD.guidance.FY2027.history;
    chartBlock($('#now-g'), { labels:H.map(h => h.date), unit:'$M', fmt:v => usd(v), rowHead:'Guidance date', height:'s', yMin:3500,
      series:[ { key:'lo', label:'Revenue guide, low', color:VC.svc, data:H.map(h => h.total_revenue_low) },
               { key:'hi', label:'Revenue guide, high', color:VC.sub, data:H.map(h => h.total_revenue_high) } ],
      tableNote:'Non-GAAP operating income guide: ' + H.map(h => '$' + num(h.non_gaap_operating_income) + 'M').join(' → ') + '. Non-GAAP EPS: ' + H.map(h => '$' + h.non_gaap_eps_diluted.toFixed(2)).join(' → ') + '.' });
  }
});
