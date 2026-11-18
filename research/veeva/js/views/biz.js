/* The business — what Veeva sells, to whom, how it gets paid */
const VC = { com:'#2563EB', rd:'#1E2733', svc:'#C8D7F4', sub:'#3E5A82', line:'#5E8BEC' };

registerView({ id:'biz',
  html: `
  <p class="lede">Veeva sells cloud software built <strong>only for life sciences</strong> — pharma, biotech and medtech — plus the data and consulting around it.
  It started as the CRM pharma sales reps use, then grew a second platform, <strong>Vault</strong>, for clinical trials, regulatory and quality work. Vault is now the bigger half.</p>

  <div class="srow">
    ${tile('Revenue · FY26', usd(LAST.total_revenue), '<span class="up">+16%</span>; year ended Jan 31 2026')}
    ${tile('Subscription share', pctf(LAST.subscription_revenue / LAST.total_revenue * 100, 0), 'The rest is implementation services')}
    ${tile('Subscription gross margin', pctf(LAST.subscription_gross_margin_pct * 100), 'Services run at ~18%')}
    ${tile('Customers · FY26', num(LAST.customers_total), 'Top 10 = 28% of revenue')}
  </div>

  ${sec({ t:'Four product clouds, reported as two areas', s:'Commercial = what pharma uses to sell; R&D & Quality = what it uses to develop and make drugs',
    b:`<div class="cols2">
      <div class="biz" style="--c:${VC.com}"><div class="k">Commercial Solutions · ${usd(LAST.product_area_new.commercial_subscription + LAST.product_area_new.commercial_services)} FY26</div>
        <div class="n">Commercial Cloud + Data Cloud</div>
        <p><strong>CRM</strong> for sales reps (legacy Veeva CRM on Salesforce → new Vault CRM), PromoMats (marketing content review), Medical, Crossix (marketing analytics).
        <strong>Data:</strong> OpenData (reference data on doctors), Link, Compass (de-identified patient and prescriber data).</p>
        <div class="w">${num(LAST.customers_commercial)} customers · subscription +13% in Q2 FY27</div></div>
      <div class="biz" style="--c:${VC.rd}"><div class="k">R&D and Quality Solutions · ${usd(LAST.product_area_new.rd_subscription + LAST.product_area_new.rd_services)} FY26</div>
        <div class="n">Development Cloud + Quality Cloud</div>
        <p><strong>Clinical</strong> (eTMF, CTMS, EDC, RTSM), <strong>safety</strong>, <strong>regulatory</strong> (RIM); <strong>quality</strong> (QMS, QualityDocs, Training, LIMS). All on Vault, Veeva's own platform.
        All top 20 biopharmas use Veeva eTMF.</p>
        <div class="w">${num(LAST.customers_rd)} customers · subscription +19% in Q2 FY27</div></div>
    </div>`,
    n:'10-K FY26 Item 1 and revenue note; Q2 FY27 release. Customers can be in both areas, so the counts sum to more than the total.' })}

  ${sec({ t:'How it gets paid', s:'Mostly annual subscriptions billed in advance; services are low-margin and exist to drive adoption',
    ctl:`<div class="ctls">${seg('biz-m','Show',[['rev','Revenue mix'],['gm','Gross margin']],'rev')}</div>`,
    b:`<div id="biz-c"></div>`,
    n:'10-K FY16–FY26. CRM is priced per user; many Vault orders are multi-year, not per user, with escalating fees. Some contracts carry an inflation uplift capped at the lower of 4% or US CPI.' })}

  ${sec({ t:'Customer concentration has halved', s:'Share of revenue from the top 10 customers',
    b:`<div id="biz-t"></div>`,
    n:'10-K risk factors, FY14–FY26. Named large customers include Bayer, Boehringer Ingelheim, Lilly, Gilead, Merck and Novartis. Veeva has been a Public Benefit Corporation since Feb 2021; one share class since Oct 2023.' })}
  `,
  init(){
    const M = {
      rev:{ unit:'$M', fmt:v => usd(v), stacked:true, total:true, rowHead:'Fiscal year', series:[
        { key:'s', label:'Subscription', color:VC.sub, data:A('subscription_revenue'), stack:'a' },
        { key:'p', label:'Professional services', color:VC.svc, data:A('professional_services_revenue'), stack:'a' } ],
        tableNote:'FY17–FY18 restated under ASC 606; FY16 is not restated.' },
      gm:{ unit:'%', fmt:v => pctf(v,0), type:'line', rowHead:'Fiscal year', series:[
        { key:'sg', label:'Subscription gross margin', color:VC.sub, type:'line', data:A('subscription_gross_margin_pct').map(v => v == null ? null : v*100) },
        { key:'pg', label:'Services gross margin', color:VC.line, type:'line', data:A('services_gross_margin_pct').map(v => v == null ? null : v*100) } ],
        tableNote:'GAAP, derived as 1 − cost ÷ revenue for each line.' }
    };
    const blk = chartBlock($('#biz-c'), { labels:FYL, ...M.rev });
    pills('#biz-m', v => blk.set({ stacked:false, total:false, type:'bar', ...M[v] }));

    const yrs = ['FY14','FY15', ...FYL];
    const sh = [VD.historical_top10_share_pre_FY2016.FY2014, VD.historical_top10_share_pre_FY2016.FY2015, ...A('top10_customers_revenue_share_pct')].map(v => v == null ? null : v*100);
    chartBlock($('#biz-t'), { labels:yrs, unit:'% of revenue', fmt:v => pctf(v,0), height:'s', rowHead:'Fiscal year', yMin:0,
      series:[ { key:'t', label:'Top 10 customers', color:VC.rd, type:'line', data:sh } ] });
  }
});
