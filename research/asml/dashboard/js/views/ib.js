/* ═════════════ INSTALLED BASE (id: ib) ═════════════
   Question: how big is the fleet of ASML machines already in fabs, and how much recurring revenue does it generate?
   Every number is frozen here (€ millions unless noted). Sources next to each constant. */

/* ── Annual, 20-F (asml-work/data/annual.json) ──
   IBM = "net service and field option sales". 2015–2016 are as presented in the FY2017 20-F (ASC 605, M&I moved from service to
   systems; the FY2015/16 20-Fs themselves show 2015 service of 2,050.2). 2017 = ASC 606 as adjusted (FY2019 20-F). */
const IB_A_LBL = ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'];
const IB_A_IBM = [1977.0,2122.8,2538.3,2684.9,2823.8,3661.9,4958.2,5743.1,5619.9,6494.2,8193.0];
const IB_A_SYS = [4310.4,4672.0,6424.4,8259.1,8996.2,10316.6,13652.8,15430.3,21938.6,21768.7,24474.3];
const IB_A_TOT = [6287.4,6794.8,8962.7,10944.0,11820.0,13978.5,18611.0,21173.4,27558.5,28262.9,32667.3];
/* Lithography units shipped by technology (new + used), 20-F Note 2; 2026 9M = Q1–Q3'26 6-K presentation units (new + used). */
const IB_U_LBL = [...IB_A_LBL, '2026 9M'];
const IB_U = {
  EUV:    [1,4,11,18,26,31,42,40,53,44,48, 49],
  ArFi:   [67,70,76,86,82,68,81,81,125,129,131, 80],
  ArFdry: [9,6,13,16,22,22,22,28,32,28,16, 23],
  KrF:    [74,57,71,78,65,103,131,151,184,152,78, 100],
  iline:  [18,20,26,26,34,34,33,45,55,65,54, 39]
};
const IB_U_USED = [25,18,24,17,26,22,23,28,28,38,27, 25];        // used (refurbished) litho units resold; Q4 releases / 6-K press releases
const IB_USED_EUR = [127.7,71.8,91.5,143.5,189.1,155.8,206.7,278.0,316.2,629.0,575.7];   // used-system sales €M (20-F segment note, incl. M&I)
const IB_IBM_9M26 = 8538.0;    // Q1–Q3'26 IBM (6-K): 2,487.5 + 2,761.7 + 3,288.8
const IB_IBM_9M25 = 6058.9;    // Q1–Q3'25 IBM (6-K): 2,001.1 + 2,095.6 + 1,962.2
const IB_Q4_GUIDE = 3700;      // Q4'26 IBM "around €3.7B" (Q3'26 investor presentation, Oct 14 2026)

/* ── Bloomberg consensus, Oct 16 2026 (bbg_s1.tsv / bbg_s2.tsv, row "Installed Base Management", SALES_REV_TURN; total = IS_COMP_SALES) ── */
const IB_BBG_A = { lbl:['2026E','2027E','2028E','2029E'], ibm:[11949.5,14368.8,16597.7,17683.3], tot:[44444.1,57736.2,72319.9,79739.7] };
const IB_BBG_Q = { lbl:["Q4'26E","Q1'27E","Q2'27E","Q3'27E","Q4'27E"], ibm:[3579.0,3462.4,3595.1,3801.9,4007.6], tot:[14599.6,13075.6,13972.9,15143.6,16152.2] };

/* ── IBM guidance given one quarter earlier ("around"), aligned to Q_LBL (quarterly.json guidance_next_quarter.ibm_approx) ── */
const IB_Q_GUIDE = [null,1200,1400,1600,1500,1300,1400,1400,1300,1400,1400,1900,2100,2000,2000,2100,2400,2500,2900,3700];

const IB_COL = { ibm:'#5E8BEC', sys:'#1E2733', tot:'#A9B4C2', euv:'#2563EB', duv:'#3E5A82', navy:'#1E2733', steel:'#3E5A82' };
const IB_SRC_BBG = 'Bloomberg consensus, Oct 16 2026';

/* ═════════════ v4 (Oct 23 2026): what IBM is, how it has grown, how far it can go, what management says. Old charts in ib.v3.bak. ═════════════
   Research and verbatim checks: asml-work/data/ibm_research.md (quotes checked against filings tr_q426..q226 transcripts, quarterly press releases, 20f_split.txt).
   Q3 2026 call Q&A is NOT used: no verbatim transcript available yet. */
const IB_FY26_IMP = IB_IBM_9M26 + IB_Q4_GUIDE;                 // derived: Q1–Q3'26 actual + Q4'26 guide (~€3.7B)
const IB_FY26_TOT = 8767 + 9326 + 11662 + 14700;               // derived: Q1–Q3'26 actual total sales + Q4'26 guide midpoint (€14.2–15.2B)
const IB_2030 = { lo:11000, mid:12000, hi:13000 };              // Investor Day Nov 14 2024 (6-K 0000937966-24-000026, Ex.99.7 p.16); reprinted in FY2025 20-F
const IB_QI = Q_LBL.map((_,i) => i < 19 ? Q_TOT[i] - Q_SYS[i] : null);   // quarterly IBM = total − systems (6-K); Q4'26 handled as guide

registerView({ id:'ib', html:`
    <div class="srow" id="ib-kpis"></div>

    <section class="card">
      <div class="ch"><div><div class="ct">What is in IBM and what drives it</div><div class="cs">Installed Base Management = net service and field option sales</div></div></div>
      <div class="tw"><table class="ib-def"><thead><tr><th>Item</th><th style="text-align:left">What it is</th><th style="text-align:left">What is disclosed</th></tr></thead><tbody>
        <tr class="ib-grp"><td colspan="3">What is in it</td></tr>
        <tr><td>Service</td><td>Full-service, manpower and parts agreements on installed tools; mostly fixed-price, some tied to system performance</td><td>Not split from upgrades in €</td></tr>
        <tr><td>Field upgrades &amp; options</td><td>Packages that raise output or extend the node of tools already in fabs (NXE:3800E throughput packs; NXT PEP / SNEP)</td><td>2025: NXE:3800E upgrades moved “a substantial portion of EUV system revenue” into IBM</td></tr>
        <tr><td>Parts, labour, relocation</td><td>Billable parts and labour, relocations, extended warranties, software licences</td><td>Not split</td></tr>
        <tr><td class="ib-out">Not in IBM</td><td>Used / refurbished systems resold — booked in <b>system</b> sales</td><td>2025: 27 units, €576M; more than 600 resold to date</td></tr>
        <tr class="ib-grp"><td colspan="3">What drives it</td></tr>
        <tr><td>Size of the fleet</td><td>More than 6,000 systems shipped; 95% of those sold in the last 30 years still active</td><td>No yearly count; EUV count not disclosed</td></tr>
        <tr><td>EUV in the field</td><td>“Service revenue from our expanding EUV installed base” — the first driver named in the Q1 and Q2 2026 calls</td><td>EUV units sold 2015–9M26: <span id="ib-euvcum"></span> (our sum, incl. High-NA)</td></tr>
        <tr><td>Productivity upgrades</td><td>Customers short of capacity buy wafers-per-hour on tools they own</td><td>NXE:3800E 220 → 230 WPH pack (Apr 2026); IBM beat its guide by €88M, €262M, €389M in Q1–Q3'26</td></tr>
        <tr><td>Utilisation</td><td>Higher use of the tools for some customers</td><td>Named by ASML as a 2025 driver, not quantified</td></tr>
      </tbody></table></div>
      <div class="snote">Source: FY2025 20-F (revenue note, CFO letter, product-lifetime section); Q1–Q3 2026 results; Investor Day Nov 2024 (DUV deck). Beats = actual − guide one quarter earlier.</div>
    </section>

    <section class="card">
      <div class="ch">
        <div><div class="ct">IBM over time, and how far it can go</div><div class="cs" id="ib-s-s"></div></div>
        <div class="ctls"><span><span class="ctl-l">Period</span><div class="fbg" id="ib-s-per"><button class="fb active" data-v="a">Annual</button><button class="fb" data-v="q">Quarterly</button></div></span>
          <span><span class="ctl-l">Metric</span><div class="fbg" id="ib-s-met"><button class="fb active" data-v="lvl">€B</button><button class="fb" data-v="shr">% of sales</button></div></span></div>
      </div>
      <div class="leg" id="ib-s-leg"></div>
      <div class="ch-wrap"><canvas id="ib-s-cv"></canvas></div>
      <details class="tbl"><summary>Data table &amp; method</summary><div class="tw" id="ib-s-tbl"></div><div class="ib-m" id="ib-s-m"></div></details>
      <div class="snote">Source: 20-F FY2015–25; 6-K Q1'22–Q3'26; Investor Day Nov 2024; Bloomberg consensus, Oct 16 2026. The 2030 range has not been updated since Nov 2024.</div>
    </section>

    <section class="card">
      <div class="ch">
        <div><div class="ct">What management has said</div><div class="cs">Verbatim, newest first · call quotes are prepared remarks</div></div>
        <div class="ctls"><span><span class="ctl-l">Topic</span><div class="fbg" id="ib-q-top">
          <button class="fb active" data-v="out">Outlook</button><button class="fb" data-v="upg">Upgrades</button><button class="fb" data-v="ref">Refurbish &amp; repurpose</button><button class="fb" data-v="gm">Margin</button></div></span></div>
      </div>
      <div id="ib-q-list"></div>
      <div class="snote">Source: ASML call transcripts (prepared remarks; Q&amp;A not published), quarterly press releases, FY2025 20-F, Investor Day Nov 2024. The Q3 2026 call Q&amp;A is not included until a verbatim transcript is available.</div>
    </section>
`, css:`
  #v-ib .ib-def td{white-space:normal;text-align:left;vertical-align:top;font-size:12px}
  #v-ib .ib-def td:first-child{font-weight:600;white-space:nowrap}
  #v-ib .ib-def td:nth-child(3){color:var(--mu)}
  #v-ib .ib-def tr.ib-grp td{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--mu);background:var(--pale);position:static}
  #v-ib .ib-def td.ib-out{color:var(--mu)}
  #v-ib .ib-m{padding:10px 13px;font-size:11px;line-height:1.6;color:var(--mu);border-top:1px solid var(--bdr)}
  #v-ib .ib-q{padding:10px 0;border-bottom:1px solid var(--bdr);font-size:12.5px;line-height:1.55;color:var(--ink2);max-width:860px}
  #v-ib .ib-q .w{font-size:10.5px;color:var(--mu);margin-bottom:2px}
  #v-ib .ib-q .n{color:var(--mu);font-style:italic}
`, init(){ ibInit(); } });

/* ═════════════ tiles ═════════════ */
function ibKpis(){
  const k = [
    ['IBM, 2025', fmtB(IB_A_IBM[10]), `${pct(IB_A_IBM[10]/IB_A_TOT[10],0)} of net sales`],
    ['IBM, 9M 2026', fmtB(IB_IBM_9M26), `${sgn(IB_IBM_9M26/IB_IBM_9M25-1)} vs 9M 2025`],
    ['FY2026, guide-implied', fmtB(IB_FY26_IMP), `9M + Q4 guide · ${sgn(IB_FY26_IMP/IB_A_IBM[10]-1)} y/y`],
    ['2030 target (Nov 2024)', '€11–13B', 'Investor Day; not updated since']
  ];
  $('#ib-kpis').innerHTML = k.map(([l,v,s]) => `<div class="sc"><div class="sl">${l}</div><div class="sv">${v}</div><div class="ss">${s}</div></div>`).join('');
  $('#ib-euvcum').textContent = IB_U.EUV.reduce((a,b)=>a+b,0);
}

/* ═════════════ IBM over time ═════════════ */
const ibS = { per:'a', met:'lvl', hidden:new Set(), x:null, y:null, chart:null };
function ibSData(){
  const shr = ibS.met === 'shr';
  if(ibS.per === 'a'){
    const L = [...IB_A_LBL, ...IB_BBG_A.lbl, '2030'], n = L.length, nA = IB_A_LBL.length;
    const v = (ibm, tot) => ibm == null ? null : shr ? ibm / tot * 100 : ibm / 1000;
    const act = L.map((_,i) => i < nA ? v(IB_A_IBM[i], IB_A_TOT[i]) : null);
    const con = L.map((_,i) => i >= nA && i < nA + 4 ? v(IB_BBG_A.ibm[i-nA], IB_BBG_A.tot[i-nA]) : null);
    const imp = L.map((_,i) => i === nA ? v(IB_FY26_IMP, IB_FY26_TOT) : null);
    const tgt = L.map((_,i) => i === n-1 && !shr ? [IB_2030.lo/1000, IB_2030.hi/1000] : null);
    return { L, est:i => i >= nA, ser:[
      { key:'act', label:'Reported', color:'#5E8BEC', kind:'bar', data:act },
      { key:'con', label:'Bloomberg consensus', color:'#5E8BEC', kind:'bar', est:true, data:con },
      { key:'imp', label:'2026: 9M actual + Q4 guide', color:'#1E2733', kind:'pt', data:imp },
      ...(shr ? [] : [{ key:'tgt', label:'2030 range, Investor Day Nov 2024', color:'#A9B4C2', kind:'bar', data:tgt }])
    ] };
  }
  const L = [...Q_LBL, ...IB_BBG_Q.lbl.slice(1)], nA = 19;
  const qt = i => i < Q_TOT.length ? Q_TOT[i] : IB_BBG_Q.tot[i - Q_LBL.length + 1];
  const v = (ibm, i) => ibm == null ? null : shr ? ibm / qt(i) * 100 : ibm / 1000;
  const act = L.map((_,i) => i < nA ? v(IB_QI[i], i) : null);
  const con = L.map((_,i) => i >= nA ? (shr ? IB_BBG_Q.ibm[i - nA] / IB_BBG_Q.tot[i - nA] * 100 : IB_BBG_Q.ibm[i - nA] / 1000) : null);
  const gd  = L.map((_,i) => i < IB_Q_GUIDE.length && IB_Q_GUIDE[i] != null && !shr ? IB_Q_GUIDE[i] / 1000 : null);
  return { L, est:i => i >= nA, ser:[
    { key:'act', label:'Reported', color:'#5E8BEC', kind:'bar', data:act },
    { key:'con', label:'Bloomberg consensus', color:'#5E8BEC', kind:'bar', est:true, data:con },
    ...(shr ? [] : [{ key:'gd', label:'ASML guide, one quarter earlier', color:'#1E2733', kind:'pt', data:gd }])
  ] };
}
function ibSRender(){
  const { L, est, ser } = ibSData(), shr = ibS.met === 'shr', H = ibS.hidden;
  let lo = 0, hi = L.length - 1;
  if(ibS.x){ lo = Math.max(0, ibS.x[0]); hi = Math.min(hi, ibS.x[1]); if(hi < lo){ lo = 0; hi = L.length - 1; } }
  const idx = L.map((_,i)=>i).slice(lo, hi + 1), vis = ser.filter(s => !H.has(s.key));
  const ds = vis.map(s => s.kind === 'pt'
    ? { type:'line', label:s.label, data:idx.map(i=>s.data[i]), showLine:false, pointStyle:'rectRot', pointRadius:6, pointHoverRadius:7, backgroundColor:s.color, borderColor:'#fff', borderWidth:1, order:0 }
    : { type:'bar', label:s.label, data:idx.map(i=>s.data[i]), grouped:false, skipNull:true, order:2, borderRadius:2, barPercentage:.7,
        backgroundColor: s.est ? s.color + '55' : s.color, borderColor:s.color, borderWidth: s.est ? 1 : 0, borderDash: s.key === 'tgt' ? [4,3] : undefined });
  const fv = y => shr ? y.toFixed(1) + '%' : '€' + y.toFixed(2) + 'B';
  if(ibS.chart) ibS.chart.destroy();
  ibS.chart = new Chart($('#ib-s-cv'), { data:{ labels:idx.map(i=>L[i]), datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{display:false}, tooltip:{ ...TIP, filter: it => it.raw != null, callbacks:{
        title: it => { const i = idx[it[0].dataIndex]; return L[i] + (L[i] === '2030' ? ' · ASML scenario range' : est(i) ? ' · estimate' : ' · reported'); },
        label: it => { const r = it.raw; return ' ' + it.dataset.label + ': ' + (Array.isArray(r) ? `€${r[0]}–${r[1]}B (mid €${IB_2030.mid/1000}B)` : fv(r)); } } } },
      scales:{ x:{ grid:{display:false}, ticks:{ maxRotation:0, autoSkip:true } },
        y:{ beginAtZero:true, grid:{color:'#EEF1F5'}, title:{ display:true, text: shr ? '% of total net sales' : '€ billions' }, min: ibS.y ? ibS.y[0] : 0, max: ibS.y ? ibS.y[1] : undefined } } } });
  ibS.chart.$lo = lo;
  legend($('#ib-s-leg'), ser.map(s => ({ key:s.key, label:s.label, color:s.color, line:s.kind === 'pt' })), H, ibSRender);
  $('#ib-s-s').textContent = (ibS.per === 'a' ? 'Per year, 2015–2029E and the 2030 range' : "Per quarter, Q1'22–Q4'27E") + (shr ? ' · % of total net sales' : ' · € billions');

  const cell = (s, i) => { const r = s.data[i]; return r == null ? '' : Array.isArray(r) ? `€${r[0]}–${r[1]}B` : fv(r); };
  const rows = vis.map(s => [s.label].concat(idx.map(i => cell(s, i))));
  $('#ib-s-tbl').innerHTML = table([shr ? '% of sales' : '€B'].concat(idx.map(i => L[i])), rows, new Set(idx.map((i,j) => est(i) ? j + 1 : -1)));
  $('#ib-s-m').innerHTML = `<b>Method.</b> IBM = net service and field option sales. Annual: 20-F (2015–16 as re-presented in the FY2017 20-F; 2017 restated for ASC 606). Quarterly: total − system sales (6-K). ` +
    `2026 guide-implied = Q1–Q3 actual (€8.54B) + Q4 guide (~€3.7B) = €${(IB_FY26_IMP/1000).toFixed(2)}B; as % of sales it uses total sales 9M actual + Q4 guide midpoint (€14.7B). This is our sum, not an ASML figure. ` +
    `Guide = the "around €X billion" IBM figure on the previous quarter's Outlook slide. 2030 = Investor Day Nov 2024 scenarios: low €11B / moderate €12B / high €13B, inside total sales of €44–60B (about 22–25% of sales); not drawn in % mode. ` +
    `Consensus: Bloomberg "Installed Base Management" row and total sales, Oct 16 2026. Earlier targets for 2025: €5–6B (2018), €6–7B (2021), €7–8B (2022); 2025 came in at €8.19B.`;
}

/* ═════════════ what management has said ═════════════ */
const IB_SAID = {
  out: [
    { when:'Q3 2026 · Oct 14 2026', src:'investor presentation, Outlook slide', q:'Q4 2026 IBM guided at around €3.7 billion; with Q1–Q3 that is about €12.2 billion for 2026 (+49%).', para:true },
    { when:'Q2 2026 · Jul 15 2026', src:'earnings call', who:'Roger Dassen, CFO', q:'“Installed Base Management sales are expected to grow over 30 percent this year, driven by service revenue from our expanding EUV installed base, and customer demand for performance and productivity upgrades …”' },
    { when:'Q1 2026 · Apr 15 2026', src:'earnings call', who:'Christophe Fouquet, CEO', q:'“We also expect Installed Base Management revenue to grow significantly this year, driven by service revenue from our expanding EUV installed base and customer demand for performance upgrades …”' },
    { when:'Q4 2025 · Jan 28 2026', src:'earnings call', who:'Christophe Fouquet, CEO', q:'“For Installed Base Management we expect another year of revenue growth.”' },
    { when:'Investor Day · Nov 14 2024', src:'CFO presentation', who:'Roger Dassen, CFO', q:'“Installed Base Management growing installed base provides opportunity for double digit growth in service and upgrades.” 2030 scenarios: €11 / 12 / 13 billion (about 13% a year from 2024).' }
  ],
  upg: [
    { when:'Q3 2026 · Oct 14 2026', src:'press release', who:'Christophe Fouquet, CEO', q:'“Installed Base Management sales came in above guidance at €3.3 billion as a result of the continued strong demand for productivity upgrades.”' },
    { when:'Q3 2026 · Oct 14 2026', src:'press release', who:'Christophe Fouquet, CEO', q:'“In addition, we continue to provide significant wafer capacity to our customers through our productivity upgrade portfolio.” (right after saying planned 2027–28 supply will not fully meet demand)' },
    { when:'Q2 2026 · Jul 15 2026', src:'press release', who:'Christophe Fouquet, CEO', q:'“In addition, we are continuing to significantly expand our upgrade portfolio.”' },
    { when:'Q2 2026 · Jul 15 2026', src:'earnings call', who:'Roger Dassen, CFO', q:'IBM of €2.8 billion was “almost 300 million euros above our guidance, a result driven primarily by additional upgrade business.”' },
    { when:'Q1 2026 · Apr 15 2026', src:'earnings call', who:'Christophe Fouquet, CEO', q:'“… all NXE:3800E systems can benefit from an upgrade that provides an increase of 10 wafers per hour, with 230 wafers per hour available immediately to all customers.”' },
    { when:'Q1 2026 · Apr 15 2026', src:'earnings call', who:'Christophe Fouquet, CEO', q:'“At the same time, we offer customers productivity upgrades for [their] installed base to increase their short-term output requirements.”' },
    { when:'FY2025 20-F · Feb 2026', src:'annual report, CFO letter', who:'Roger Dassen, CFO', q:'“We also carried out a significant number of TWINSCAN NXE:3800E field upgrades, which resulted in a substantial portion of EUV system revenue being shifted to installed base revenue.”' }
  ],
  ref: [
    { when:'FY2025 20-F · Feb 2026', src:'annual report', q:'“Extending a product\'s lifetime is also possible by refurbishing systems after their use, and repurposing them for other customers and semiconductor environments.”' },
    { when:'FY2025 20-F · Feb 2026', src:'annual report', q:'“To date, we have refurbished and resold over 600 such systems.” “In 2025, we sold 27 refurbished lithography systems.” (booked in system sales, €576M — not in IBM)' },
    { when:'FY2025 20-F · Feb 2026', src:'annual report', q:'“Our field upgrade packages enable customers to optimize their cost of ownership over a system\'s lifetime by upgrading older systems to improved models.”' },
    { when:'Investor Day · Nov 14 2024', src:'DUV presentation', who:'Herman Boom, EVP DUV', q:'“We are optimizing our installed base of >6,000 systems by extending the product lifetime to >20 years and improving productivity with a diversified service and upgrades portfolio.”' }
  ],
  gm: [
    { when:'Q3 2026 · Oct 14 2026', src:'press release', who:'Christophe Fouquet, CEO', q:'IBM above guidance on productivity upgrades: “This drove the gross margin above guidance at 57.5%.”' },
    { when:'Q2 2026 · Jul 15 2026', src:'earnings call', who:'Roger Dassen, CFO', q:'“Gross margin for the quarter was above our guidance at 54.0 percent primarily due to the contribution of very high margin components within our Installed Base Management business.”' },
    { when:'Q1 2026 · Apr 15 2026', src:'earnings call', who:'Roger Dassen, CFO', q:'Gross margin at the high end of guidance due to “very high margin components within our installed base business.”' },
    { when:'Investor Day · Nov 14 2024', src:'CFO presentation', q:'In the 2025 → 2030 gross-margin bridge (about 52% → 58%), IBM adds about 1 point; EUV adds about 4.', para:true }
  ]
};
function ibQRender(t){
  $('#ib-q-list').innerHTML = IB_SAID[t].map(s => `<div class="ib-q"><div class="w">${s.when} · ${s.src}${s.who ? ' · ' + s.who : ''}</div>${s.q}${s.para ? ' <span class="n">(summary, not a quote)</span>' : ''}</div>`).join('');
}

pills('#ib-s-per', v => { ibS.per = v; ibS.hidden.clear(); ibS.x = null; ibS.y = null; ibSRender(); });
pills('#ib-s-met', v => { ibS.met = v; ibS.hidden.clear(); ibS.y = null; ibSRender(); });
pills('#ib-q-top', v => ibQRender(v));

let ibBuilt = false;
function ibInit(){
  if(ibBuilt) return; ibBuilt = true;
  ibKpis(); ibSRender(); ibQRender('out');
  attachZoom(() => ibS.chart, r => { if(!r){ ibS.x = null; ibS.y = null; } else { if(r.x) ibS.x = r.x; if(r.y) ibS.y = r.y; } ibSRender(); });
}
