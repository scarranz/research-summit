/* ═════════════ TSMC LINK (id: tsmc) ═════════════
   Question: how much of ASML's business depends on TSMC's spending, and how do TSMC's capex and node ramps
   translate into ASML machines?
   Every number is frozen here. Two kinds of source, never mixed without a label:
     • ASML filings — FY2015–FY2025 20-F (Note 3 segment / customer location, customer concentration; Note 2 units)
       and 6-K quarterly presentations Q1'22–Q3'26 (region % of net system sales, EUV units). From
       asml-work/data/annual.json + quarterly.json (built Oct 19 2026).
     • SAB's TSMC dashboard v7 (tsmc_dashboard_v7.html, Oct 16 2026) — TSMC capex (TSMC 20-F, US$), the
       largest-customer → TSMC identification, every "to TSMC" figure, the EUV ceiling and the 2026E spend.
       Those are SAB's estimates and are labelled "v7" on screen.
     • Bloomberg consensus (bbg_s1.tsv, Oct 16 2026) — Low-NA / High-NA EUV units 2026–2029. */

/* ── ASML annual, € millions (20-F) ── index 11 = 2026E */
const TSMC_AY   = ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','2026E'];
const TSMC_AEST = 11;
// total net sales; 2026E = FY26 guide midpoint (€44–45B, Q3'26 6-K Oct 14 2026)
const TSMC_A_NET = [6287.4,6794.8,8962.7,10944.0,11820.0,13978.5,18611.0,21173.4,27558.5,28262.9,32667.3,44500];
// total net sales (systems + IBM) to customers located in Taiwan — 20-F Note 21 (FY2017) / Note 3 (FY2019, FY2022, FY2025)
const TSMC_A_TW  = [1551.5,2084.7,2096.7,1989.5,5357.0,4731.3,7327.9,8095.5,8074.6,4354.0,8337.9,null];
// sales to ASML's largest customer (ASML does not name it; v7 identifies it as TSMC). 2026E = v7 CONC_DATA estimate (29% × €44.5B)
const TSMC_A_TOP = [1633.6,1646.2,2454.4,2476.8,4688.6,4394.8,6881.1,7046.9,8772.9,4682.4,7796.7,12900];
// v7 CX array (US$B): TSMC capex (TSMC 20-F; 2026E = guide midpoint of $60–64B) and v7's TSMC→ASML spend converted to US$
const TSMC_A_CX  = [null,null,null,null,14.9,17.2,30.0,36.3,30.4,29.8,40.9,62];
const TSMC_A_SP  = [null,null,null,null,5.2,5.4,7.7,7.3,9.4,5.0,8.4,13.9];

/* ── ASML quarterly — Taiwan % of net system sales (ship-to pie, 6-K presentations), Q1'22–Q3'26 ── */
const TSMC_Q_TWP = [22,41,47,48,49,34,24,13,6,11,15,10,16,35,30,13,23,30,32];
const TSMC_QN = TSMC_Q_TWP.length;   // 19 actual quarters; net system sales come from Q_SYS (data-overview.js)

/* ── EUV units ── */
const TSMC_EY = ['2019','2020','2021','2022','2023','2024','2025','2026E','2027E','2028E','2029E','2030E'];
const TSMC_EEST = 7;
const TSMC_E_NXE  = [26,31,42,40,53,42,44,null,null,null,null,null];          // 20-F Note 2: EUV (0.33 NA); NXE/EXE split from FY2023
const TSMC_E_EXE  = [null,null,null,null,0,2,4,null,null,null,null,null];      // 20-F Note 2: High-NA EXE
const TSMC_E_9M   = [null,null,null,null,null,null,null,49,null,null,null,null]; // 6-K Q1–Q3'26 EUV units 16+16+17 (NXE+EXE not split)
const TSMC_E_TSMC = [10,12,17,16,21,18,19,26,34,36,38,40];                     // v7 EUVC (2019–2028E) + ASML_CEIL (2029E–30E) — ESTIMATE
const TSMC_E_CEIL = [null,null,null,null,null,65,65,65,85,90,100,100];         // v7 ASML_CEIL.max (2024 from tsm-asml-data.js) — v7 assumption
const TSMC_E_PLAN = [null,null,null,null,null,null,null,65,85,90,95,100];      // v7 ASML_CEIL.del 2026E+ — v7 assumption
const TSMC_E_BBGL = [null,null,null,null,null,null,null,65.1,88.0,112.1,111.2,null]; // BBG Low NA EUV NUMBER_OF_UNITS_SOLD, Oct 16 2026
const TSMC_E_BBGH = [null,null,null,null,null,null,null,4.9,5.4,7.8,12.4,null];      // BBG High NA EUV units (table only)

/* ── capex → ASML spend (v7 assumptions, nothing new) ── */
const TSMC_FX = 47.9/44.5;          // v7's implied US$/€ for 2026E (CX.arev $47.9B ÷ €44.5B guide) ≈ 1.076
const TSMC_GUIDE = 44500;           // FY26 guide midpoint, € millions
const TSMC_SHARES = (() => {
  const r = [4,5,6,7,8,9,10].map(i => TSMC_A_SP[i]/TSMC_A_CX[i]);
  return {
    v7:  { v: 13.9/62, l: 'v7 2026E', s: 'v7: $13.9B TSMC→ASML on $62B capex' },
    avg: { v: r.reduce((a,b)=>a+b,0)/r.length, l: '2019–25 average', s: 'mean of v7\'s yearly ratios 2019–2025' },
    lo:  { v: 5.0/29.8, l: '2024 low', s: 'v7: $5.0B on $29.8B (N3→N2 gap)' },
    hi:  { v: 5.2/14.9, l: '2019 high', s: 'v7: $5.2B on $14.9B (N5 EUV ramp)' }
  };
})();

const TSMC_K = { navy:'#1E2733', steel:'#3E5A82', accent:'#2563EB', deep:'#1B3F94', sky:'#5E8BEC', mist:'#93B1F0', fog:'#C8D7F4', grey:'#7C8694', lgrey:'#A9B4C2' };

registerView({ id:'tsmc', html:`
  <div class="srow" id="tsmc-kpis"></div>

  <div class="card">
    <div class="ch">
      <div><div class="ct">How much of ASML is Taiwan, and how it tracks TSMC capex</div>
      <div class="cs" id="tsmc-a-sub"></div></div>
      <div class="ctls"><div class="tsmc-cg"><span class="ctl-l">View</span><div class="fbg" id="tsmc-a-mode"><button class="fb active" data-m="eur">€B · US$B</button><button class="fb" data-m="pct">% shares</button></div></div></div>
    </div>
    <div class="cb"><div class="leg" id="tsmc-a-leg"></div><div class="ch-wrap"><canvas id="tsmc-a-chart"></canvas></div></div>
    <details class="tbl"><summary>Show data table</summary><div class="tw" id="tsmc-a-tbl"></div></details>
    <details class="tbl"><summary>Method, and where v7 disagrees with ASML's filings</summary>
      <div class="tsmc-md">Taiwan = total net sales (systems + IBM) by location of the customer's fab; largest customer = ASML's own disclosure, unnamed (v7 identifies it as TSMC). Both € from the ASML 20-F (Note 21 FY2017; Note 3 FY2019, FY2022, FY2025). TSMC capex is US$ (TSMC 20-F, via SAB's TSMC dashboard v7); 2026E = midpoint of the $60–64B guide. 2026E largest customer = v7 estimate (~29% × €44.5B guide), not a filing. Drag to zoom either axis, double-click resets, click a legend item to hide it from chart and table.</div>
      <div class="tw" id="tsmc-rec"></div>
      <div class="tsmc-md">Sources: ASML 20-F FY2017–FY2025 (Notes 2, 3), 6-K Q1 2022–Q3 2026; v7 = tsmc_dashboard_v7.html arrays CONC_DATA, ASML_STK_*, EUVC, ASML_CEIL, CX, CXD_HIST, CXD_T_*; BBG = bbg_s1.tsv (Oct 16 2026).</div>
    </details>
    <div class="snote">Source: ASML 20-F (€); TSMC capex from TSMC 20-F via v7 (US$). 2026E = guide / v7 estimate.<br>Caveat: in 2017–18 and 2023–24 the largest customer exceeds all Taiwan sales — not cleanly TSMC.</div>
  </div>

  <div class="card">
    <div class="ch"><div><div class="ct">Taiwan in ASML's quarterly system sales</div>
      <div class="cs">€B (bars, derived) · Taiwan % of net system sales (line, right axis)</div></div></div>
    <div class="cb"><div class="leg" id="tsmc-q-leg"></div><div class="ch-wrap"><canvas id="tsmc-q-chart"></canvas></div></div>
    <details class="tbl"><summary>Show data table</summary><div class="tw" id="tsmc-q-tbl"></div>
      <div class="tsmc-md">Taiwan € = ASML's integer ship-to % × net system sales, so it is derived (±0.5pt ≈ ±€30–40M). Basis differs from the annual chart: system sales only, no IBM, ship-to location. Net system sales Q2'26 = total − IBM (€6,564M).</div></details>
    <div class="snote">Source: ASML 6-K investor presentations, "Net system sales by region", Q1'22–Q3'26.<br>Caveat: € are derived from whole-percent pies.</div>
  </div>

  <div class="card">
    <div class="ch"><div><div class="ct">EUV: ASML shipments, its ceiling, and TSMC's take</div>
      <div class="cs">Units per year · solid = ASML reported · faded / dashed = estimate</div></div></div>
    <div class="cb"><div class="leg" id="tsmc-e-leg"></div><div class="ch-wrap"><canvas id="tsmc-e-chart"></canvas></div></div>
    <details class="tbl"><summary>Show data table</summary><div class="tw" id="tsmc-e-tbl"></div>
      <div class="tsmc-md">ASML shipments: 20-F Note 2 (NXE = 0.33 NA, EXE = High-NA, split from FY2023); 2026 bar = Q1–Q3 actual (6-K, 16 + 16 + 17, NA not split). Ceiling and plan = v7 (ASML ~65 Low-NA in 2026; Low-NA EUV and DUVi capacity +30% in 2027, "a further 30% for 2028 under investigation" — Q3'26 results, Oct 14 2026). v7's 2028E ceiling (90) sits below both that study (≈110 on 85) and BBG (112). To TSMC = v7 estimate (~40%); ASML reports no units by customer. BBG = Bloomberg consensus, Oct 16 2026.</div></details>
    <div class="snote">Source: ASML 20-F Note 2, 6-K Q1–Q3'26; ceiling and TSMC units = v7; Bloomberg consensus Oct 16 2026.<br>Caveat: ASML reports no units by customer — TSMC counts are v7 estimates.</div>
  </div>

  <div class="card">
    <div class="ch">
      <div><div class="ct">TSMC capex → implied ASML spend, 2026</div>
      <div class="cs">Capex × a share of capex taken from v7 — no new assumptions</div></div>
      <div class="ctls"><div class="tsmc-cg"><span class="ctl-l">Share</span><div class="fbg" id="tsmc-sh"></div></div></div>
    </div>
    <div class="cb">
      <div class="tsmc-sl"><span class="ctl-l">Capex</span><input type="range" id="tsmc-cx" min="40" max="80" step="0.5" value="62"><b id="tsmc-cx-v"></b><span class="tsmc-shs" id="tsmc-sh-s"></span></div>
      <div class="tsmc-out" id="tsmc-out"></div>
    </div>
    <details class="tbl"><summary>Show sensitivity table</summary><div class="tw" id="tsmc-i-tbl"></div>
      <div class="tsmc-md">ASML spend = capex × share; € = US$ ÷ <span id="tsmc-fx"></span> (v7's implied 2026 rate, $47.9B ÷ €44.5B). Shares are v7's TSMC→ASML ÷ TSMC capex (both US$): 2026E $13.9B ÷ $62B; average, low (2024) and high (2019) of 2019–2025. v7's 2026E bottom-up: ~24 EUV × $248M + ~63 ArFi × $82M + services = $13.9B. % of guide uses the FY26 midpoint €44.5B (Q3'26 6-K).</div></details>
    <div class="snote">Source: ratios and FX from SAB's TSMC dashboard v7; FY26 guide from the Q3'26 6-K.<br>Caveat: a scenario, not a forecast — every input is shown.</div>
  </div>
`,
css:`
  #v-tsmc .tsmc-cg{display:flex;align-items:center}
  #v-tsmc .tsmc-sl{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:16px}
  #v-tsmc .tsmc-sl input[type=range]{flex:0 1 320px;accent-color:#2563EB}
  #v-tsmc .tsmc-sl b{font-size:14px;color:var(--navy);min-width:60px}
  #v-tsmc .tsmc-shs{font-size:11px;color:var(--mu)}
  #v-tsmc .tsmc-out{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
  #v-tsmc .tsmc-o .k{font-size:11px;font-weight:700;color:var(--mu)}
  #v-tsmc .tsmc-o .v{font-size:22px;font-weight:700;color:var(--accent);margin:3px 0 2px;letter-spacing:-.02em}
  #v-tsmc .tsmc-o .p{font-size:11px;color:var(--mu)}
  #v-tsmc .tsmc-md{font-size:11px;color:var(--mu);line-height:1.55;padding:10px 4px}
  #v-tsmc #tsmc-rec td{white-space:normal;text-align:left;vertical-align:top;font-size:11.5px;line-height:1.45}
  #v-tsmc #tsmc-rec th{text-align:left}
  #v-tsmc #tsmc-rec td:first-child{font-weight:600;min-width:150px}
  @media(max-width:800px){#v-tsmc .tsmc-out{grid-template-columns:1fr 1fr}}
`,
init(){ tsmcInit(); } });

/* ═════════════ helpers ═════════════ */
const tsmcF = (x, d=1) => x==null ? '—' : x.toFixed(d);
function tsmcWin(st, n, lo0){ let lo = lo0||0, hi = n-1; if(st.x){ lo = Math.max(lo, st.x[0]); hi = Math.min(hi, st.x[1]); } if(hi<lo) hi = lo; return [lo, hi]; }
function tsmcZoom(st, get, render){
  attachZoom(get, r => { if(!r){ st.x=null; st.y=null; } else { if(r.x) st.x=r.x; if(r.y) st.y=r.y; } render(); });
}
function tsmcTbl(head, labels, rows, isEst, lo){
  // rows = [label, values[], fmt(v)] ; isEst(i) on absolute index
  return `<table><thead><tr><th>${head}</th>${labels.map((l,i)=>`<th class="${isEst(i+lo)?'est':''}">${l}</th>`).join('')}</tr></thead><tbody>` +
    rows.map(([n,a,f]) => `<tr><td>${n}</td>${a.map((x,i)=>`<td class="${isEst(i+lo)?'est':''}">${x==null?'—':f(x)}</td>`).join('')}</tr>`).join('') + '</tbody></table>';
}

/* ═════════════ KPIs ═════════════ */
function tsmcKpis(){
  const twQ3 = TSMC_Q_TWP[18]/100*Q_SYS[18];
  const tw9m = [16,17,18].reduce((a,i)=>a+TSMC_Q_TWP[i]/100*Q_SYS[i],0);
  const k = [
    ['Taiwan share · FY2025', pct(TSMC_A_TW[10]/TSMC_A_NET[10]), `${fmtB(TSMC_A_TW[10],2)} of ASML net sales`],
    ['Taiwan share · Q3\'26', TSMC_Q_TWP[18]+'%', `of system sales, ≈ ${fmtB(twQ3,1)}`],
    ['TSMC capex 2026', '$60–64B', 'guide · v7 base $62B'],
    ['TSMC→ASML 2026E', '~€12.9B', 'v7 estimate · ~29% of FY26 guide']
  ];
  $('#tsmc-kpis').innerHTML = k.map(([l,v,s]) => `<div class="sc"><div class="sl">${l}</div><div class="sv">${v}</div><div class="ss">${s}</div></div>`).join('');
}

/* ═════════════ ANNUAL CHART ═════════════ */
const TSMC_AS = { mode:'eur', hidden:new Set(), x:null, y:null };
let tsmcAChart;
function tsmcASeries(){
  const pm = TSMC_AS.mode==='pct';
  const r = (a,b) => a.map((x,i)=> x==null||b[i]==null ? null : x/b[i]*100);
  return pm ? [
    { key:'tw',  label:'Taiwan, % of ASML net sales', color:TSMC_K.navy,  type:'bar',  data:r(TSMC_A_TW,TSMC_A_NET), u:'%' },
    { key:'top', label:'Largest customer, % of ASML net sales', color:TSMC_K.steel, type:'bar', data:r(TSMC_A_TOP,TSMC_A_NET), u:'%' },
    { key:'cx',  label:'v7 TSMC→ASML ÷ TSMC capex (US$/US$)', color:TSMC_K.sky, type:'line', data:r(TSMC_A_SP,TSMC_A_CX), u:'%', ax:'y' }
  ] : [
    { key:'tw',  label:'ASML sales to Taiwan (€B)', color:TSMC_K.navy, type:'bar', data:TSMC_A_TW.map(x=>x==null?null:x/1000), u:'€' },
    { key:'top', label:'ASML largest customer (€B)', color:TSMC_K.steel, type:'bar', data:TSMC_A_TOP.map(x=>x/1000), u:'€' },
    { key:'cx',  label:'TSMC capex (US$B, right axis)', color:TSMC_K.sky, type:'line', data:TSMC_A_CX, u:'$', ax:'y1' }
  ];
}
function tsmcRenderA(){
  const st = TSMC_AS, pm = st.mode==='pct';
  const [lo, hi] = tsmcWin(st, TSMC_AY.length);
  const sl = a => a.slice(lo, hi+1), lbl = sl(TSMC_AY);
  const all = tsmcASeries(), vis = all.filter(s=>!st.hidden.has(s.key));
  const est = i => i >= TSMC_AEST;
  const ds = vis.map(s => s.type==='bar'
    ? { type:'bar', label:s.label, data:sl(s.data), yAxisID:'y', order:2, borderRadius:2,
        backgroundColor:sl(s.data).map((_,i)=>est(i+lo)? s.color+'55' : s.color), borderColor:s.color, borderWidth:sl(s.data).map((_,i)=>est(i+lo)?1:0) }
    : { type:'line', label:s.label, data:sl(s.data), yAxisID:s.ax, order:1, borderColor:s.color, backgroundColor:s.color, borderWidth:2, pointRadius:3, tension:.2, spanGaps:false,
        segment:{ borderDash: c => est(c.p1DataIndex+lo) ? [4,3] : undefined } });
  const fmt = (s,y) => s.u==='%' ? y.toFixed(1)+'%' : (s.u==='$' ? '$' : '€') + y.toFixed(2)+'B';
  if(tsmcAChart) tsmcAChart.destroy();
  tsmcAChart = new Chart($('#tsmc-a-chart'), { data:{ labels:lbl, datasets:ds }, options:{
    responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
    plugins:{ legend:{display:false}, tooltip:{ ...TIP, callbacks:{
      title: it => it[0].label + (est(it[0].dataIndex+lo) ? ' — estimate / guide' : ''),
      label: it => { if(it.parsed.y==null) return null; const s = vis[it.datasetIndex]; return ` ${s.label}: ${fmt(s,it.parsed.y)}` + (s.key==='top' && est(it.dataIndex+lo) ? ' (v7 est. TSMC)' : ''); },
      footer: it => 'ASML total net sales: ' + fmtB(TSMC_A_NET[it[0].dataIndex+lo],1) + (est(it[0].dataIndex+lo)?' (guide mid)':'') } } },
    scales:{ x:{ grid:{display:false} },
      y:{ beginAtZero:true, grid:{color:'#EEF1F5'}, title:{display:true,text: pm?'% share':'€ billions'}, ticks:{callback:x=> pm ? x+'%' : '€'+x},
          min: st.y?st.y[0]:undefined, max: st.y?st.y[1]:undefined },
      y1:{ display:!pm && vis.some(s=>s.ax==='y1'), position:'right', beginAtZero:true, grid:{display:false}, title:{display:true,text:'TSMC capex, US$ billions'}, ticks:{callback:x=>'$'+x} } } } });
  tsmcAChart.$lo = lo;
  legend($('#tsmc-a-leg'), all.map(s=>({key:s.key,label:s.label,color:s.color,line:s.type==='line'})), st.hidden, tsmcRenderA);
  $('#tsmc-a-sub').textContent = pm ? '% of ASML net sales (bars) · v7 ASML spend as % of TSMC capex (line)'
                                    : 'ASML sales, €B (bars) · TSMC capex, US$B (line, right axis)';
  const rows = [['ASML total net sales (€B)', sl(TSMC_A_NET).map(x=>x/1000), x=>x.toFixed(1)]];
  vis.forEach(s => rows.push([s.label + (s.key==='top'?' — 2026E = v7 est.':''), sl(s.data), x => s.u==='%' ? x.toFixed(1)+'%' : x.toFixed(2)]));
  if(!pm && !st.hidden.has('cx')) rows.push(['v7 TSMC→ASML (US$B, converted)', sl(TSMC_A_SP), x=>x.toFixed(1)]);
  $('#tsmc-a-tbl').innerHTML = tsmcTbl(pm?'%':'€B / US$B', lbl, rows, est, lo);
}

/* ═════════════ QUARTERLY CHART ═════════════ */
const TSMC_QS = { hidden:new Set(), x:null, y:null };
let tsmcQChart;
function tsmcQSeries(){
  const sys = Q_SYS.slice(0, TSMC_QN);
  const tw = sys.map((s,i)=> TSMC_Q_TWP[i]/100*s/1000);
  return [
    { key:'tw',   label:'Taiwan (€B, derived)', color:TSMC_K.navy, type:'bar', data:tw },
    { key:'rest', label:'Other regions (€B)', color:TSMC_K.fog, type:'bar', data:sys.map((s,i)=>s/1000 - tw[i]) },
    { key:'twp',  label:'Taiwan % of system sales', color:TSMC_K.accent, type:'line', data:TSMC_Q_TWP.slice() }
  ];
}
function tsmcRenderQ(){
  const st = TSMC_QS;
  const [lo, hi] = tsmcWin(st, TSMC_QN);
  const sl = a => a.slice(lo, hi+1), lbl = sl(Q_LBL.slice(0, TSMC_QN));
  const all = tsmcQSeries(), vis = all.filter(s=>!st.hidden.has(s.key));
  const ds = vis.map(s => s.type==='bar'
    ? { type:'bar', label:s.label, data:sl(s.data), backgroundColor:s.color, stack:'s', yAxisID:'y', order:2, barPercentage:.75 }
    : { type:'line', label:s.label, data:sl(s.data), borderColor:s.color, backgroundColor:s.color, yAxisID:'y1', order:1, borderWidth:2, pointRadius:2.5, tension:.25 });
  if(tsmcQChart) tsmcQChart.destroy();
  tsmcQChart = new Chart($('#tsmc-q-chart'), { data:{ labels:lbl, datasets:ds }, options:{
    responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
    plugins:{ legend:{display:false}, tooltip:{ ...TIP, callbacks:{
      label: it => { const y = it.parsed.y; if(y==null) return null; return it.dataset.yAxisID==='y1' ? ` ${it.dataset.label}: ${y}%` : ` ${it.dataset.label}: €${y.toFixed(2)}B`; },
      footer: it => 'Net system sales: ' + fmtB(Q_SYS[it[0].dataIndex+lo],2) } } },
    scales:{ x:{ stacked:true, grid:{display:false} },
      y:{ stacked:true, beginAtZero:true, grid:{color:'#EEF1F5'}, title:{display:true,text:'€ billions'}, ticks:{callback:x=>'€'+x},
          min: st.y?st.y[0]:undefined, max: st.y?st.y[1]:undefined },
      y1:{ display:!st.hidden.has('twp'), position:'right', min:0, max:60, grid:{display:false}, ticks:{callback:x=>x+'%'}, title:{display:true,text:'Taiwan %'} } } } });
  tsmcQChart.$lo = lo;
  legend($('#tsmc-q-leg'), all.map(s=>({key:s.key,label:s.label,color:s.color,line:s.type==='line'})), st.hidden, tsmcRenderQ);
  const bars = vis.filter(s=>s.type==='bar');
  const rows = vis.map(s => [s.label, sl(s.data), s.type==='line' ? (x=>x+'%') : (x=>x.toFixed(2))]);
  if(bars.length) rows.push(['<b>Total shown (€B)</b>', sl(bars[0].data).map((_,i)=>bars.reduce((a,s)=>a+s.data[i+lo],0)), x=>'<b>'+x.toFixed(2)+'</b>']);
  $('#tsmc-q-tbl').innerHTML = tsmcTbl('€B / %', lbl, rows, ()=>false, lo);
}

/* ═════════════ EUV CHART ═════════════ */
const TSMC_ES = { hidden:new Set(), x:null, y:null };
let tsmcEChart;
const TSMC_E_SERIES = [
  { key:'nxe',  label:'ASML Low-NA EUV shipped (NXE)', color:TSMC_K.accent, type:'bar', stack:'a', data:TSMC_E_NXE },
  { key:'exe',  label:'ASML High-NA shipped (EXE)', color:TSMC_K.deep, type:'bar', stack:'a', data:TSMC_E_EXE },
  { key:'ytd',  label:'ASML EUV Q1–Q3\'26 actual', color:TSMC_K.sky, type:'bar', stack:'a', data:TSMC_E_9M },
  { key:'tsmc', label:'To TSMC (v7 est.)', color:TSMC_K.navy, type:'bar', stack:'t', data:TSMC_E_TSMC, est:true },
  { key:'ceil', label:'Low-NA ceiling (v7)', color:TSMC_K.grey, type:'line', data:TSMC_E_CEIL, dash:[2,3], step:true },
  { key:'bbg',  label:'Low-NA, BBG consensus', color:TSMC_K.deep, type:'line', data:TSMC_E_BBGL, dash:[5,4] }
];
function tsmcRenderE(){
  const st = TSMC_ES;
  const [lo, hi] = tsmcWin(st, TSMC_EY.length);
  const sl = a => a.slice(lo, hi+1), lbl = sl(TSMC_EY);
  const vis = TSMC_E_SERIES.filter(s=>!st.hidden.has(s.key));
  const ds = vis.map(s => s.type==='bar'
    ? { type:'bar', label:s.label, data:sl(s.data), stack:s.stack, order:2, borderRadius:2, barPercentage:.85, categoryPercentage:.75,
        backgroundColor: s.est ? s.color+'B3' : (s.key==='ytd' ? s.color+'AA' : s.color), borderColor:s.color, borderWidth: s.est||s.key==='ytd' ? 1 : 0 }
    : { type:'line', label:s.label, data:sl(s.data), order:1, stack:'l_'+s.key, borderColor:s.color, backgroundColor:s.color, borderDash:s.dash, borderWidth:2, pointRadius:2.5, stepped: s.step ? 'middle' : false, spanGaps:false });
  if(tsmcEChart) tsmcEChart.destroy();
  tsmcEChart = new Chart($('#tsmc-e-chart'), { data:{ labels:lbl, datasets:ds }, options:{
    responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
    plugins:{ legend:{display:false}, tooltip:{ ...TIP, callbacks:{
      title: it => it[0].label + ((it[0].dataIndex+lo) >= TSMC_EEST ? ' — estimates (2026: Q1–Q3 actual bar)' : ''),
      label: it => it.parsed.y==null ? null : ` ${it.dataset.label}: ${Number.isInteger(it.parsed.y) ? it.parsed.y : it.parsed.y.toFixed(1)} units` } } },
    scales:{ x:{ stacked:true, grid:{display:false} },
      y:{ stacked:true, beginAtZero:true, grid:{color:'#EEF1F5'}, title:{display:true,text:'EUV systems (units)'},
          min: st.y?st.y[0]:undefined, max: st.y?st.y[1]:undefined } } } });
  tsmcEChart.$lo = lo;
  legend($('#tsmc-e-leg'), TSMC_E_SERIES.map(s=>({key:s.key,label:s.label,color:s.color,line:s.type==='line',dash:!!s.dash})), st.hidden, tsmcRenderE);
  const isEst = i => i >= TSMC_EEST;
  const f0 = x => Number.isInteger(x) ? String(x) : x.toFixed(1);
  const rows = vis.map(s => [s.label, sl(s.data), f0]);
  const shipped = TSMC_EY.map((_,i)=> TSMC_E_NXE[i]!=null ? TSMC_E_NXE[i] + (TSMC_E_EXE[i]||0) : null);
  if(!st.hidden.has('tsmc')) rows.push(['TSMC share of ASML EUV (v7 ÷ shipped ≤2025, ÷ v7 plan 2026E+)',
    sl(TSMC_EY.map((_,i)=>{ const d = i<TSMC_EEST ? shipped[i] : TSMC_E_PLAN[i]; return d ? TSMC_E_TSMC[i]/d*100 : null; })), x=>x.toFixed(0)+'%']);
  rows.push(['Low-NA shipments, v7 plan (not drawn)', sl(TSMC_E_PLAN), f0]);
  if(!st.hidden.has('bbg')) rows.push(['High-NA, BBG consensus (not drawn)', sl(TSMC_E_BBGH), f0]);
  $('#tsmc-e-tbl').innerHTML = tsmcTbl('Units', lbl, rows, isEst, lo);
}

/* ═════════════ CAPEX → ASML SPEND ═════════════ */
const TSMC_IS = { cx:62, sh:'v7' };
function tsmcRenderI(){
  const s = TSMC_SHARES[TSMC_IS.sh], cx = TSMC_IS.cx;
  const usd = cx * s.v, eur = usd / TSMC_FX;
  $('#tsmc-cx-v').textContent = '$' + cx.toFixed(1) + 'B';
  $('#tsmc-sh-s').textContent = (s.v*100).toFixed(1) + '% — ' + s.s;
  $('#tsmc-fx').textContent = TSMC_FX.toFixed(3) + ' $/€';
  const vsBase = eur*1000 - 12900;
  $('#tsmc-out').innerHTML = [
    ['TSMC → ASML', '$' + usd.toFixed(1) + 'B', `= $${cx.toFixed(1)}B × ${(s.v*100).toFixed(1)}%`],
    ['In euros', '€' + eur.toFixed(1) + 'B', Math.abs(vsBase)<50 ? '= v7 base (~€12.9B)' : `vs v7 base ~€12.9B: ${vsBase>=0?'+':'−'}€${Math.abs(vsBase/1000).toFixed(1)}B`],
    ['% of ASML FY26 guide', pct(eur*1000/TSMC_GUIDE), 'midpoint €44.5B (Q3\'26 6-K)'],
    ['vs FY2025 actual', sgn(eur*1000/TSMC_A_TOP[10]-1), 'largest customer €7.80B (20-F)']
  ].map(([k,v,p]) => `<div class="tsmc-o"><div class="k">${k}</div><div class="v">${v}</div><div class="p">${p}</div></div>`).join('');
  const caps = [50,56,60,62,64,70,76];
  const keys = Object.keys(TSMC_SHARES);
  $('#tsmc-i-tbl').innerHTML = `<table><thead><tr><th>ASML spend, €B · share ↓ / capex →</th>${caps.map(c=>`<th class="est">$${c}B</th>`).join('')}</tr></thead><tbody>` +
    keys.map(k => `<tr><td>${TSMC_SHARES[k].l} (${(TSMC_SHARES[k].v*100).toFixed(1)}%)</td>${caps.map(c=>`<td class="est">${(c*TSMC_SHARES[k].v/TSMC_FX).toFixed(1)}</td>`).join('')}</tr>`).join('') + '</tbody></table>';
}

/* ═════════════ RECONCILIATION ═════════════ */
function tsmcRenderRec(){
  const r = [
    ['EUV shipped 2025', 'ASML_CEIL / EUVC: 48 delivered, "High-NA excluded"', '20-F: 44 NXE (Low-NA) + 4 EXE (High-NA) = 48', 'v7\'s 48 includes High-NA; its own note compares 2026\'s ~65 with "44 in 2025". The 2025 → 2026 jump is +21 Low-NA, not +17.'],
    ['EUV shipped 2019', 'EUVC split 10 + 6 + 6 = 22', '20-F: 26 EUV systems', 'v7 customer split misses 4 units.'],
    ['Largest customer = TSMC', 'Every year 2017–2025 treated as TSMC', 'Largest > all Taiwan sales in 2017 (€2.45B vs €2.10B), 2018 (€2.48B vs €1.99B), 2023 (€8.77B vs €8.07B), 2024 (€4.68B vs €4.35B)', '2017–18: South Korea (€3.0B, €3.7B) was bigger than Taiwan → likely Samsung. 2023–24: possible only with TSMC buying for Arizona / Japan / Nanjing.'],
    ['TSMC→ASML 2026E', 'KPI + CONC_DATA: ~€12.9B, 29%', 'ASML_STK_C1 chart: €12.6B, 28.4%', 'Two v7 figures for the same estimate; this view uses €12.9B.'],
    ['EUV to TSMC 2026E', 'EUVC / ASML_CEIL: 26', 'Tool-mix chart + capex note: 24 · CapEx view: 20 Low-NA + 4 High-NA', 'Three v7 counts; this view uses 26.'],
    ['Low-NA ceiling 2028', 'ASML_CEIL: 90', 'ASML: further +30% for 2028 under study (≈110 on 85) · BBG consensus 112 units', 'v7 ceiling predates the Q3\'26 statement.'],
    ['TSMC capex 2025', 'CX: $40.9B', 'CXD_HIST (v7 CapEx view): $40.538B', 'Two v7 values; this view uses CX ($40.9B).'],
    ['Taiwan basis', 'Annual: total net sales (incl. IBM) by customer location', 'Quarterly: % of net system sales, ship-to', 'Not additive: 9M\'26 system-basis Taiwan (~€6.1B) is not comparable with FY2025 €8.34B.']
  ];
  $('#tsmc-rec').innerHTML = `<table><thead><tr><th>Item</th><th>v7 says</th><th>ASML filing / other v7 view</th><th>Read</th></tr></thead><tbody>` +
    r.map(x=>`<tr>${x.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('') + '</tbody></table>';
}

/* ═════════════ INIT ═════════════ */
pills('#tsmc-a-mode', m => { TSMC_AS.mode = m; TSMC_AS.x = null; TSMC_AS.y = null; tsmcRenderA(); });
$('#tsmc-sh').innerHTML = Object.entries(TSMC_SHARES).map(([k,s]) => `<button class="fb${k==='v7'?' active':''}" data-v="${k}">${s.l}</button>`).join('');
pills('#tsmc-sh', k => { TSMC_IS.sh = k; tsmcRenderI(); });
$('#tsmc-cx').addEventListener('input', e => { TSMC_IS.cx = +e.target.value; tsmcRenderI(); });

function tsmcInit(){
  tsmcKpis();
  tsmcRenderA(); tsmcZoom(TSMC_AS, () => tsmcAChart, tsmcRenderA);
  tsmcRenderQ(); tsmcZoom(TSMC_QS, () => tsmcQChart, tsmcRenderQ);
  tsmcRenderE(); tsmcZoom(TSMC_ES, () => tsmcEChart, tsmcRenderE);
  tsmcRenderI(); tsmcRenderRec();
}
