/* ═════════════ REVENUE BUILD (id: rb) — units × price by product line, plus M&I and Installed Base Management ═════════════
   Oct 26 2026: replaces the ASP Engine (asp.js) and Revenue Model (rev.js) views, rebuilt to the v3 density rules.
   Kept: revenue by line (now 2015–2029E in one chart, the old History card folded in), price per system, the volume/price/mix
   bridge, the scenario builder. Dropped: EUV price vs throughput scatter (five blended points), Bloomberg checks moved into a dropdown.
   Every number is frozen here (€ millions unless noted). Sources:
   - Annual units / € by technology 2015–2025: ASML 20-F Note 2 (FY2017 / FY2019 / FY2022 / FY2025 20-F), asml-work/data/annual.json.
     2015–2016 pre-ASC 606 as presented in the FY2017 20-F (M&I moved into system sales). EUV split NXE / EXE from 2023 (EXE = 0 in 2023).
   - IBM (net service and field option sales) 2015–2025: 20-F statements of operations.
   - Consensus 2026E–2029E: Bloomberg BEst, ASML NA Equity, Oct 16 2026 (bbg_s1.tsv: NUMBER_OF_UNITS_SOLD / AVERAGE_SALES_PRICE /
     SALES_REV_TURN; IS_COMP_SALES; IS_COMP_GROSS_MARGIN_PERCENTAGE). Fractional units = averages of contributors.
   - Quarterly Q1'22–Q3'26: 6-K presentations (integer % pies × net system sales = "derived"); EUV € stated on the Q4'25–Q2'26 calls.
   - Scenarios: Projection sheet of ASML_DCF_inputs.xlsx (generator asml-work/data/add_projection.ps1), Investor Day Nov 14 2024. */

const RB_YRS = ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','2026E','2027E','2028E','2029E'];
const RB_NA = 11;    // number of actual years = index of the first consensus year

/* 20-F actuals 2015–2025 — units and € M by family. nxe/exe only from 2023 (null before); eu = NXE + EXE. */
const RB_A = {
  eu:   { u:[1,4,11,18,26,31,42,40,53,44,48],               e:[70.5,324.9,1084.2,1880.1,2799.7,4463.8,6284.0,7045.3,9124.0,8321.4,11602.7] },
  nxe:  { u:[null,null,null,null,null,null,null,null,53,42,44], e:[null,null,null,null,null,null,null,null,9124.0,7856.4,10445.8] },
  exe:  { u:[null,null,null,null,null,null,null,null,0,2,4],    e:[null,null,null,null,null,null,null,null,0,465.0,1156.9] },
  arfi: { u:[67,70,76,86,82,68,81,81,125,129,131],           e:[3238.5,3518.7,4028.7,4806.9,4707.7,3917.0,4959.6,5236.5,9017.4,9667.0,10311.4] },
  arfd: { u:[9,6,13,16,22,22,22,28,32,28,16],                e:[107.5,116.9,186.4,274.3,401.2,427.0,431.9,623.7,780.2,774.4,427.0] },
  krf:  { u:[74,57,71,78,65,103,131,151,184,152,78],         e:[747.7,532.7,743.5,860.1,679.7,1012.3,1321.3,1653.7,2202.5,1991.2,1001.3] },
  il:   { u:[18,20,26,26,34,34,33,45,55,65,54],              e:[73.0,78.0,99.7,98.6,133.5,146.4,142.3,211.5,278.4,369.2,307.3] },
  mi:   { u:[45,55,95,114,115,137,196,216,151,165,208],      e:[73.2,100.8,281.9,339.1,274.4,350.1,513.7,659.6,536.1,645.5,824.6] }
};
const RB_SYS_A = [4310.4,4672.0,6424.4,8259.1,8996.2,10316.6,13652.8,15430.3,21938.6,21768.7,24474.3];   // net system sales, 20-F (= Σ families + M&I)
const RB_IBM_A = [1977.0,2122.8,2538.3,2684.9,2823.8,3661.9,4958.2,5743.1,5619.9,6494.2,8193.0];          // net service and field option sales, 20-F
const RB_26 = { tot:8767 + 9326 + 11662 + 14700, ibm:8538 + 3700 };   // 2026 guide-implied: Q1–Q3 actual (6-K) + Q4 guide midpoint €14.7B (IBM ~€3.7B); our sum

/* Bloomberg consensus Oct 16 2026, 2026E–2029E (full precision as exported). */
const RB_B = {
  low:  { u:[65.1369,88.0317,112.0727,111.1667], p:[240.7068,255.3237,277.8857,300.1381], r:[15868.2741,22548.8125,30590.4729,31981.0401] },
  high: { u:[4.9393,5.3536,7.8135,12.3636],      p:[355.9738,400.2747,399.0227,420.3417], r:[1746.85,1939.9488,2978.3776,4879.1137] },
  eu:   { u:[69.0833,92.2817,117.8974,122],      p:[240.7091,254.9281,271.2619,290.2194], r:[16905.2876,23893.9178,33509.2546,38068.6771] },
  arfi: { u:[132.1944,167.0632,206.0513,207.6],  p:[84.0865,86.432,88.5145,92.0516],     r:[11090.6109,14429.7907,18268.4271,19179.3514] },
  arfd: { u:[35.6667,44.4667,48.6429,47.375],    p:[29.3377,29.7028,30.361,31.6928],     r:[1033.5939,1277.9681,1442.4728,1493.0757] },
  krf:  { u:[142.6121,151.7455,162.7143,164.495],p:[12.5484,13.3102,13.3239,13.5684],    r:[1777.9251,2008.4373,2138.2779,2235.7757] },
  il:   { u:[59.8571,69.4267,75.564,73.22],      p:[5.3823,5.425,5.518,5.8169],          r:[331.7533,375.3942,391.1259,435.2798] },
  mi:   { u:[221.7539,266.8288,366.5575,349.1246], r:[986.9221,1308.3317,1463.1094,1599.3187] },
  litho:{ u:[435.4667,515.0854,590.2601,592.44], p:[72.5435,82.1484,92.5356,99.6802],    r:[31574.1349,41785.9779,54459.169,60957.1734] },
  sys:  [32496.5877,43360.2579,56014.0337,60992.9268],      // "Net System" SALES_REV_TURN
  ibm:  [11949.5496,14368.7988,16597.6863,17683.2799],      // "Installed Base Management" SALES_REV_TURN
  tot:  [44444.0889,57736.1628,72319.8889,79739.7273],      // IS_COMP_SALES
  gm:   [55.5396,57.0583,58.2241,59.3962],                  // IS_COMP_GROSS_MARGIN_PERCENTAGE
  duvU: [417,438,480,null]                                  // BBG "DUV" units row (2029E blank in the export)
};
const RB_SRC_BBG = 'Bloomberg consensus, Oct 16 2026';

/* Quarterly (6-K). EUV € stated on the call for Q4'25 (€3.6B), Q1'26 ("over €4.1B", a floor) and Q2'26 (€3.8B); else pie-derived. */
const RB_QL   = ["Q1'22","Q2'22","Q3'22","Q4'22","Q1'23","Q2'23","Q3'23","Q4'23","Q1'24","Q2'24","Q3'24","Q4'24","Q1'25","Q2'25","Q3'25","Q4'25","Q1'26","Q2'26","Q3'26"];
const RB_QSYS = [2287.2,4140.5,4254.7,4747.9,5341.8,5606.1,5308.2,5682.5,3965.9,4760.9,5926,7115.9,5740.4,5596.1,5553.8,7584,6279.4,6564.8,8373.2];
const RB_QEUV = [594.7,1987.4,2169.9,2326.5,2884.6,2074.3,1857.9,2273,1824.3,1475.9,2074.1,2988.7,3214.6,2686.1,2110.4,3600,4100,3800,4102.9];
const RB_QEUV_STATED = { 15:'stated €3.6B', 16:'stated "over €4.1B" (floor)', 17:'stated €3.8B' };
const RB_QARFI_PCT = [47,33,31,31,30,49,48,38,39,50,48,41,33,43,52,40,23,29,39];
const RB_QU_EUV  = [3,12,12,13,17,12,11,13,11,8,11,14,14,11,9,14,16,16,17];
const RB_QU_ARFI = [18,21,20,22,25,39,32,29,20,32,38,39,25,31,38,37,17,23,40];

const RB_COL = { eu:'#2563EB', nxe:'#5E8BEC', exe:'#1B3F94', arfi:'#3E5A82', arfd:'#93B1F0', krf:'#1E2733', il:'#A9B4C2', mi:'#C8D7F4', ibm:'#5E8BEC', litho:'#7C8694' };

/* ── derived: ASP per family per year (actual € ÷ units, then Bloomberg ASP) ── */
const rbDiv = (e,u) => (e==null || u==null || u===0) ? null : e/u;
const RB_AN = (() => {
  const s = {};
  ['eu','nxe','exe','arfi','arfd','krf','il','mi'].forEach(k => { s[k] = RB_A[k].u.map((u,i)=>rbDiv(RB_A[k].e[i], u)); });
  s.litho = RB_SYS_A.map((t,i)=> (t - RB_A.mi.e[i]) / (RB_A.eu.u[i]+RB_A.arfi.u[i]+RB_A.arfd.u[i]+RB_A.krf.u[i]+RB_A.il.u[i]));
  const bmap = { eu:'eu', nxe:'low', exe:'high', arfi:'arfi', arfd:'arfd', krf:'krf', il:'il', litho:'litho' };
  Object.entries(bmap).forEach(([k,b]) => s[k] = s[k].concat(RB_B[b].p));
  s.mi = s.mi.concat(RB_B.mi.r.map((r,i)=>r/RB_B.mi.u[i]));
  return s;
})();

/* ── derived: revenue by line per year, € M. Estimates = Bloomberg units × ASP (Low-NA / High-NA rows, not its "EUV" row). ── */
const RB_DUVK = ['arfi','arfd','krf','il'];
const rbEst = (k, j) => RB_B[k].u[j] * RB_B[k].p[j];
const RB_LINES = (() => {
  const at = (fa, fe) => RB_YRS.map((_,i) => i < RB_NA ? fa(i) : fe(i - RB_NA));
  return {
    euv: at(i => RB_A.eu.e[i], j => rbEst('low',j) + rbEst('high',j)),
    duv: at(i => RB_DUVK.reduce((a,k)=>a+RB_A[k].e[i],0), j => RB_DUVK.reduce((a,k)=>a+rbEst(k,j),0)),
    mi:  at(i => RB_A.mi.e[i], j => RB_B.mi.r[j]),
    ibm: at(i => RB_IBM_A[i], j => RB_B.ibm[j])
  };
})();

/* ═════════════ MARKUP ═════════════ */
registerView({ id:'rb', html:`
    <div class="srow" id="rb-kpis"></div>

    <section class="card">
      <div class="ch">
        <div><div class="ct">Revenue by product line</div><div class="cs" id="rb-l-s"></div></div>
        <div class="ctls"><span><span class="ctl-l">Metric</span><div class="fbg" id="rb-l-met"><button class="fb active" data-v="eur">€B</button><button class="fb" data-v="shr">% of sales</button></div></span></div>
      </div>
      <div class="leg" id="rb-l-leg"></div>
      <div class="ch-wrap"><canvas id="rb-l-cv"></canvas></div>
      <details class="tbl"><summary>Data table, units × price by family &amp; method</summary><div class="tw" id="rb-l-tbl"></div><div class="tw" id="rb-l-fam"></div><div class="rb-m" id="rb-l-m"></div></details>
      <details class="tbl"><summary>Reconciliation — Bloomberg revenue rows vs units × price</summary><div class="tw" id="rb-r-tbl"></div>
        <div class="rb-m">Bloomberg's own "EUV" row is not Low-NA + High-NA, so the build uses the Low-NA / High-NA rows; its "DUV" units row does not equal its parts either.
        Units × price runs above Bloomberg's rows in 2028–29 (net system sales +€2.0B / +€2.4B), almost all Low-NA (the Low-NA price that would close it: ~€273M in 2028, ~€288M in 2029).</div></details>
      <div class="snote">Source: ASML 20-F FY2015–25 (Note 2 and statements of operations); Bloomberg consensus, Oct 16 2026. 2015–16 are pre-ASC 606.</div>
    </section>

    <section class="card">
      <div class="ch">
        <div><div class="ct">Average price per system</div><div class="cs" id="rb-p-s"></div></div>
        <div class="ctls">
          <span><span class="ctl-l">Family</span><div class="fbg" id="rb-p-fam"><button class="fb active" data-v="eu">EUV</button><button class="fb" data-v="arfi">ArFi</button><button class="fb" data-v="arfd">ArF dry</button><button class="fb" data-v="krf">KrF</button><button class="fb" data-v="il">i-line</button></div></span>
          <span><span class="ctl-l">Period</span><div class="fbg" id="rb-p-per"><button class="fb active" data-v="a">Annual</button><button class="fb" data-v="q">Quarterly</button></div></span>
        </div>
      </div>
      <div class="leg" id="rb-p-leg"></div>
      <div class="ch-wrap"><canvas id="rb-p-cv"></canvas></div>
      <details class="tbl"><summary>Data table &amp; method</summary><div class="tw" id="rb-p-tbl"></div><div class="rb-m" id="rb-p-m"></div></details>
      <div class="snote" id="rb-p-note"></div>
    </section>

    <section class="card">
      <div class="ch">
        <div><div class="ct">System sales growth: volume, price, mix</div><div class="cs">Change in net system sales vs the prior year</div></div>
        <div class="ctls"><span><span class="ctl-l">Metric</span><div class="fbg" id="rb-b-met"><button class="fb active" data-v="eur">€B</button><button class="fb" data-v="pct">% of prior year</button></div></span></div>
      </div>
      <div class="leg" id="rb-b-leg"></div>
      <div class="ch-wrap"><canvas id="rb-b-cv"></canvas></div>
      <details class="tbl"><summary>Data table &amp; method</summary><div class="tw" id="rb-b-tbl"></div>
        <div class="rb-m">Lithography families NXE, EXE, ArFi, ArF dry, KrF, i-line. <b>Volume</b> = (units<sub>t</sub> − units<sub>t−1</sub>) × average litho price<sub>t−1</sub>;
        <b>Mix</b> = Σ units<sub>t,f</sub> × price<sub>t−1,f</sub> − units<sub>t</sub> × average price<sub>t−1</sub>; <b>Price</b> = Σ units<sub>t,f</sub> × (price<sub>t,f</sub> − price<sub>t−1,f</sub>);
        <b>M&amp;I</b> = Δ metrology &amp; inspection €. The four add to Δ net system sales exactly. EXE has no 2023 price, so its 2024 revenue sits in Mix.
        Pre-2023 EUV is treated as NXE. 2017 crosses the ASC 605 → 606 change. 2026E+ = consensus units × price, which differs from Bloomberg's own Net System line (both in the table).</div></details>
      <details class="tbl"><summary>Bloomberg consensus consistency checks</summary><div class="tw" id="rb-x-tbl"></div>
        <div class="rb-m">"Implied Low-NA ASP" = Bloomberg Low-NA revenue ÷ units, the price that reconciles its units × ASP with its revenue line. Source: Bloomberg BEst, ASML NA Equity, Oct 16 2026.</div></details>
      <div class="snote">Source: ASML 20-F Note 2 (FY2017–FY2025); Bloomberg consensus units × ASP, Oct 16 2026 (lighter bars).</div>
    </section>

    <section class="card">
      <div class="ch">
        <div><div class="ct">Scenarios to 2030</div><div class="cs" id="rb-s-s"></div></div>
        <div class="ctls"><span><span class="ctl-l">Line</span><div class="fbg" id="rb-s-line"><button class="fb active" data-v="tot">Total</button><button class="fb" data-v="euv">EUV</button><button class="fb" data-v="non">Non-EUV + M&amp;I</button><button class="fb" data-v="ibm">IBM</button></div></span>
          <span><span class="ctl-l">Preset</span><div class="fbg" id="rb-s-pre">
          <button class="fb" data-v="bbg">Consensus</button><button class="fb" data-v="Bear">Bear</button><button class="fb active" data-v="Base">Base</button><button class="fb" data-v="Bull">Bull</button>
        </div></span></div>
      </div>
      <div class="leg" id="rb-s-leg"></div>
      <div class="ch-wrap"><canvas id="rb-s-cv"></canvas></div>
      <details class="tbl"><summary>Edit the drivers — units, price (€M per system), M&amp;I and IBM growth</summary><div class="rb-m rb-top" id="rb-s-long"></div><div class="tw rb-in" id="rb-s-in"></div></details>
      <details class="tbl"><summary>Data table — your scenario vs references</summary><div class="tw" id="rb-s-tbl"></div></details>
      <details class="tbl"><summary>Investor Day Nov 2024 targets, vs consensus &amp; assumptions per driver</summary><div class="tw" id="rb-tg-tbl"></div><div class="tw" id="rb-s-notes"></div><div class="tw" id="rb-cmd-tbl"></div><div class="rb-m" id="rb-cmd-note"></div></details>
      <div class="snote">Source: Projection sheet (ASML_DCF_inputs.xlsx); Bloomberg consensus, Oct 16 2026; Investor Day, Nov 14 2024 (2030 range = low–high scenario, mark = moderate). Reference lines are the presets before your edits.</div>
    </section>
`, css:`
  #v-rb .rb-m{padding:10px 13px;font-size:11px;line-height:1.6;color:var(--mu);border-top:1px solid var(--bdr)}
  #v-rb .rb-m.rb-top{border-top:none;border-bottom:1px solid var(--bdr)}
  #v-rb .rb-neg{color:var(--neg)} #v-rb .rb-pos{color:var(--pos)}
  #v-rb .fb:disabled{opacity:.35;cursor:not-allowed}
  #v-rb #rb-l-fam table,#v-rb #rb-cmd-tbl table{border-top:1px solid var(--bdr)}
  #v-rb tr.tot td{font-weight:600;border-top:1px solid var(--bdr)}
  #v-rb td.neg{color:var(--neg)} #v-rb td.pos{color:var(--pos)}
  #v-rb .rb-in table{font-size:11.5px}
  #v-rb .rb-in td,#v-rb .rb-in th{padding:3px 8px}
  #v-rb .rb-in td.g{background:var(--pale);font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.06em;padding-top:7px}
  #v-rb .rb-in input{width:70px;font:inherit;font-size:11.5px;text-align:right;border:1px solid var(--bdr);border-radius:6px;padding:3px 5px;color:var(--accent);background:#fff;font-variant-numeric:tabular-nums}
  #v-rb .rb-in input:focus{outline:none;border-color:var(--accent)}
  #v-rb .rb-in input.ed{background:#EAF0FD;border-color:#93B1F0}
  #v-rb .rb-in .u{color:var(--mu);font-size:10px}
  #v-rb .rb-in tr.out td{font-weight:600;border-top:1px solid var(--bdr)}
`, init(){ rbInit(); } });

const rbRange = (st, n) => { let lo = 0, hi = n - 1; if(st.x){ lo = Math.max(0, st.x[0]); hi = Math.min(hi, st.x[1]); if(hi < lo){ lo = 0; hi = n - 1; } } return [lo, hi]; };
const rbZoom = (st, render) => attachZoom(() => st.chart, r => { if(!r){ st.x = null; st.y = null; } else { if(r.x) st.x = r.x; if(r.y) st.y = r.y; } render(); });

/* ═════════════ tiles ═════════════ */
function rbKpis(){
  const i25 = 10;
  const k = [
    ['Net sales, FY2025', fmtB(RB_SYS_A[i25] + RB_IBM_A[i25]), `systems ${fmtB(RB_SYS_A[i25])} · IBM ${fmtB(RB_IBM_A[i25])}`],
    ['FY2026 guide', '€44–45B', `9M actual + Q4 guide · ${sgn(RB_26.tot/(RB_SYS_A[i25]+RB_IBM_A[i25])-1)} y/y`],
    ['EUV average price, 2025', '€' + RB_AN.eu[i25].toFixed(0) + 'M', `Low-NA €${RB_AN.nxe[i25].toFixed(0)}M · High-NA €${RB_AN.exe[i25].toFixed(0)}M`],
    ['Consensus, 2029E', fmtB(RB_B.tot[3]), 'Investor Day 2030: €44–60B']
  ];
  $('#rb-kpis').innerHTML = k.map(([l,v,s]) => `<div class="sc"><div class="sl">${l}</div><div class="sv">${v}</div><div class="ss">${s}</div></div>`).join('');
}

/* ═════════════ 1 · revenue by product line ═════════════ */
const RB_L_SER = [
  { key:'euv', label:'EUV (Low-NA + High-NA)', color:'#2563EB', fams:['nxe','exe'] },
  { key:'duv', label:'DUV (ArFi, ArF dry, KrF, i-line)', color:'#3E5A82', fams:['arfi','arfd','krf','il'] },
  { key:'mi',  label:'Metrology & Inspection', color:'#C8D7F4' },
  { key:'ibm', label:'Installed Base Mgmt', color:'#5E8BEC' }
];
const rbL = { met:'eur', hidden:new Set(), x:null, y:null, chart:null };
function rbLRender(){
  // € mode adds a 2030 column (index NY) for the Investor Day Nov 2024 range; % mode stops at 2029E
  const shr = rbL.met === 'shr', H = rbL.hidden, NY = RB_YRS.length, n = NY + (shr ? 0 : 1), [lo, hi] = rbRange(rbL, n), idx = Array.from({length:n}, (_,i)=>i).slice(lo, hi + 1);
  const YL = i => i < NY ? RB_YRS[i] : '2030', ok = i => i < NY, cmdOn = !shr && !H.has('cmd');
  const vis = RB_L_SER.filter(s => !H.has(s.key));
  const tot = RB_YRS.map((_,i) => vis.reduce((a,s)=>a+RB_LINES[s.key][i],0));
  const full = RB_YRS.map((_,i) => RB_L_SER.reduce((a,s)=>a+RB_LINES[s.key][i],0));
  const val = (s,i) => !ok(i) ? null : shr ? (tot[i] ? RB_LINES[s.key][i]/tot[i]*100 : null) : RB_LINES[s.key][i]/1000;
  const est = i => i >= RB_NA;
  const ds = vis.map(s => ({ type:'bar', label:s.label, data:idx.map(i=>val(s,i)), stack:'s', order:2, barPercentage:.7,
    backgroundColor: idx.map(i => est(i) ? s.color + '88' : s.color), borderColor:s.color, borderWidth: idx.map(i => est(i) ? 1 : 0) }));
  if(!shr && !H.has('bbg')) ds.push({ type:'line', label:'Bloomberg revenue row', data:idx.map(i => est(i) && ok(i) ? RB_B.tot[i-RB_NA]/1000 : null),
    borderColor:'#1E2733', backgroundColor:'#1E2733', borderDash:[5,4], borderWidth:1.5, pointRadius:2.5, order:1, spanGaps:false, stack:'bbg' });
  if(!shr && !H.has('gd')) ds.push({ type:'line', label:'2026: 9M actual + Q4 guide', data:idx.map(i => i === RB_NA ? RB_26.tot/1000 : null),
    showLine:false, pointStyle:'rectRot', pointRadius:7, backgroundColor:'#1E2733', borderColor:'#fff', order:0, stack:'gd' });
  if(cmdOn){
    ds.push({ type:'bar', label:'Investor Day 2030 range', data:idx.map(i => ok(i) ? null : [RB_CMD.low.tot, RB_CMD.high.tot]), stack:'cmd', order:3, barPercentage:.7,
      backgroundColor:'#C8D7F4cc', borderColor:'#93B1F0', borderWidth:1 });
    ds.push({ type:'line', label:'Investor Day 2030 moderate', data:idx.map(i => ok(i) ? null : RB_CMD.mod.tot), stack:'cmdm', showLine:false,
      pointStyle:'line', pointRadius:14, pointBorderWidth:2, borderColor:'#1B3F94', backgroundColor:'#1B3F94', order:0 });
  }
  if(rbL.chart) rbL.chart.destroy();
  rbL.chart = new Chart($('#rb-l-cv'), { data:{ labels:idx.map(YL), datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{display:false}, tooltip:{ ...TIP, filter: it => it.raw != null, callbacks:{
        title: it => { const i = idx[it[0].dataIndex]; return YL(i) + (!ok(i) ? ' · ASML Investor Day, Nov 14 2024' : est(i) ? ' · Bloomberg units × ASP, Oct 16 2026' : ' · 20-F'); },
        label: it => Array.isArray(it.raw) ? ` ${it.dataset.label}: €${it.raw[0]}–${it.raw[1]}B (EUV €22–32B · non-EUV + M&I €11–15B · IBM €11–13B)` : ` ${it.dataset.label}: ${shr ? it.raw.toFixed(1)+'%' : '€'+it.raw.toFixed(2)+'B'}`,
        footer: it => { const i = idx[it[0].dataIndex]; return shr || !ok(i) ? '' : 'Sum shown: €' + (tot[i]/1000).toFixed(1) + 'B'; } } } },
      scales:{ x:{ stacked:true, grid:{display:false}, ticks:{ maxRotation:0, autoSkip:true } },
        y:{ stacked:true, grid:{color:'#EEF1F5'}, title:{ display:true, text: shr ? '% of sales shown' : '€ billions' }, ticks:{ callback: v => shr ? v+'%' : '€'+v },
          min: rbL.y ? rbL.y[0] : 0, max: rbL.y ? rbL.y[1] : (shr ? 100 : undefined) } } } });
  rbL.chart.$lo = lo;
  const items = RB_L_SER.map(s => ({ key:s.key, label:s.label, color:s.color }));
  if(!shr) items.push({ key:'bbg', label:'Bloomberg revenue row', color:'#1E2733', line:true, dash:true }, { key:'gd', label:'2026: 9M actual + Q4 guide', color:'#1E2733', line:true },
    { key:'cmd', label:'Investor Day 2030 (€44–60B, mark = €52B)', color:'#93B1F0' });
  legend($('#rb-l-leg'), items, H, rbLRender);
  $('#rb-l-s').textContent = 'Per year · 2015–2025 reported, 2026E–2029E consensus rebuilt as units × price · ' + (shr ? '% of sales' : '€ billions');

  // tables: the year columns shown, plus a 2030 Investor Day column (low / moderate / high) when that range is drawn
  const ID = cmdOn && idx.some(i => !ok(i)), TI = idx.filter(ok);
  const L = TI.map(i=>RB_YRS[i]).concat(ID ? ['2030 Investor Day'] : []), estCols = new Set(TI.map((i,j) => est(i) ? j + 1 : -1).concat(ID ? [TI.length + 1] : []));
  const ID_CELL = { euv:'22 / 26 / 32', duv:'11 / 14 / 15 (with M&amp;I)', mi:'in the row above', ibm:'11 / 12 / 13' };
  const idc = c => ID ? [c] : [];
  const f = v => v == null ? '' : shr ? v.toFixed(1) + '%' : v.toFixed(2);
  const rows = vis.map(s => [s.label].concat(TI.map(i => f(val(s,i))), idc(ID_CELL[s.key])));
  rows.push(['<b>Sum shown</b>'].concat(TI.map(i => `<b>${shr ? '100.0%' : (tot[i]/1000).toFixed(2)}</b>`), idc(vis.length === RB_L_SER.length ? '<b>44 / 52 / 60</b>' : '—')));
  if(!shr){
    rows.push(['YoY, all lines'].concat(TI.map(i => i === 0 ? '' : sgn(full[i]/full[i-1]-1, 1)), idc('')));
    if(!H.has('bbg')) rows.push(['Bloomberg revenue row'].concat(TI.map(i => est(i) ? (RB_B.tot[i-RB_NA]/1000).toFixed(2) : ''), idc('')),
      ['Gap: units × price − Bloomberg row'].concat(TI.map(i => !est(i) ? '' : vis.length < RB_L_SER.length ? '—' : ((full[i]-RB_B.tot[i-RB_NA])/1000).toFixed(2)), idc('')));
    if(!H.has('gd')) rows.push(['2026: 9M actual + Q4 guide'].concat(TI.map(i => i === RB_NA ? (RB_26.tot/1000).toFixed(2) : ''), idc('')));
  }
  $('#rb-l-tbl').innerHTML = table([shr ? '% of sales' : '€B'].concat(L), rows, estCols);

  // by family (units, price, €) behind the visible system groups
  const fu = (k,i) => { if(i < RB_NA){ if(k === 'nxe') return RB_A.eu.u[i] - (RB_A.exe.u[i]||0); if(k === 'exe') return RB_A.exe.u[i]; return RB_A[k].u[i]; }
    return RB_B[{ nxe:'low', exe:'high' }[k] || k].u[i-RB_NA]; };
  const fe = (k,i) => { if(i < RB_NA){ if(k === 'nxe') return RB_A.eu.e[i] - (RB_A.exe.e[i]||0); if(k === 'exe') return RB_A.exe.e[i]; return RB_A[k].e[i]; }
    return rbEst({ nxe:'low', exe:'high' }[k] || k, i-RB_NA); };
  const FN = { nxe:'Low-NA EUV (NXE)', exe:'High-NA EUV (EXE)', arfi:'ArFi', arfd:'ArF dry', krf:'KrF', il:'i-line' };
  const fr = [];
  vis.filter(s => s.fams).forEach(s => s.fams.forEach(k => {
    const u = TI.map(i => fu(k,i)), e = TI.map(i => fe(k,i));
    fr.push([`${FN[k]} — units`].concat(u.map(v => v == null ? '' : Number.isInteger(v) ? v : v.toFixed(1))));
    fr.push([`${FN[k]} — price (€M)`].concat(u.map((v,j) => v ? (e[j]/v).toFixed(1) : '')));
    fr.push([`${FN[k]} — €B`].concat(e.map(v => v == null ? '' : (v/1000).toFixed(2))));
  }));
  $('#rb-l-fam').innerHTML = fr.length ? table(['By family'].concat(TI.map(i=>RB_YRS[i])), fr, new Set(TI.map((i,j) => est(i) ? j + 1 : -1))) : '';
  $('#rb-l-m').innerHTML = `<b>Method.</b> 2015–2025: 20-F. EUV and DUV = Σ family € (Note 2); M&amp;I and IBM as reported; EUV + DUV + M&amp;I = net system sales, + IBM = total net sales. ` +
    `Low-NA / High-NA split from 2023; before that all EUV is shown as Low-NA. 2026E–2029E = Bloomberg units × ASP per family (Low-NA and High-NA rows), Bloomberg M&amp;I and IBM rows. ` +
    `2026 point = Q1–Q3 actual €29.76B + Q4 guide midpoint €14.7B = €${(RB_26.tot/1000).toFixed(2)}B (our sum; the FY guide is €44–45B). ` +
    `2030 = Investor Day Nov 14 2024 scenarios, total €44 / 52 / 60B (low / moderate / high); ASML groups DUV with M&amp;I there, so it is drawn as a total range only. Bloomberg's 2028E total is already above the top of that range.`;
}
function rbRecon(){
  const fmt = v => v == null ? '—' : Math.round(v).toLocaleString('en-US');
  const gap = (a,b) => { const g = a-b; return `<td class="${Math.abs(g)<1?'':g>0?'pos':'neg'}">${g>=0?'+':''}${Math.round(g).toLocaleString('en-US')}</td>`; };
  const Y = RB_YRS.slice(RB_NA);
  const hdr = `<tr><th>€M</th>${Y.map(y=>`<th class="est" colspan="3">${y}</th>`).join('')}</tr><tr><th></th>${Y.map(()=>'<th class="est">BBG row</th><th class="est">u × ASP</th><th class="est">gap</th>').join('')}</tr>`;
  const line = (n, bbg, calc, cls) => `<tr${cls ? ` class="${cls}"` : ''}><td>${n}</td>${bbg.map((b,i)=>`<td class="est">${fmt(b)}</td><td class="est">${fmt(calc[i])}</td>${gap(calc[i],b)}`).join('')}</tr>`;
  const FAM = [['High-NA EUV','high'],['Low-NA EUV','low'],['ArFi','arfi'],['ArF dry','arfd'],['KrF','krf'],['i-line','il']];
  const J = [0,1,2,3];
  let body = FAM.map(([n,k]) => line(n, RB_B[k].r, J.map(j=>rbEst(k,j)))).join('');
  body += line('Metrology & Inspection', RB_B.mi.r, RB_B.mi.r);
  const sysC = J.map(j => FAM.reduce((a,[,k])=>a+rbEst(k,j),0) + RB_B.mi.r[j]);
  body += line('Net system sales', RB_B.sys, sysC, 'tot');
  body += line('Installed Base Mgmt', RB_B.ibm, RB_B.ibm);
  body += line('Total net sales', RB_B.tot, sysC.map((s,j)=>s+RB_B.ibm[j]), 'tot');
  body += `<tr><td style="color:var(--mu)">Memo: BBG "EUV" row vs Low + High-NA rows</td>${J.map(j=>{ const s = RB_B.low.r[j]+RB_B.high.r[j]; return `<td class="est">${fmt(RB_B.eu.r[j])}</td><td class="est">${fmt(s)}</td>${gap(s,RB_B.eu.r[j])}`; }).join('')}</tr>`;
  $('#rb-r-tbl').innerHTML = `<table><thead>${hdr}</thead><tbody>${body}</tbody></table>`;
}

/* ═════════════ 2 · average price per system — one family at a time ═════════════ */
const rbP = { fam:'eu', per:'a', hidden:new Set(), x:null, y:null, chart:null };
const RB_FAMN = { eu:'EUV', arfi:'ArF immersion', arfd:'ArF dry', krf:'KrF', il:'i-line' };
const RB_QOK = { eu:1, arfi:1 };    // quarterly only where integer-% rounding stays small vs the price
function rbPData(){
  const f = rbP.fam;
  if(rbP.per === 'a'){
    const ser = f === 'eu'
      ? [ { key:'eu', label:'EUV (all)', color:RB_COL.eu }, { key:'nxe', label:'Low-NA (NXE)', color:RB_COL.nxe }, { key:'exe', label:'High-NA (EXE)', color:RB_COL.exe } ]
      : [ { key:f, label:RB_FAMN[f], color:RB_COL[f] }, { key:'litho', label:'Lithography average', color:RB_COL.litho, ref:true } ];
    return { lbl:RB_YRS, est:RB_NA, ser: ser.map(s => ({ ...s, v:RB_AN[s.key] })) };
  }
  if(f === 'eu'){
    const v = RB_QEUV.map((e,i)=>e/RB_QU_EUV[i]);
    const band = RB_QEUV.map((e,i)=>{
      if(i === 16) return [4100/RB_QU_EUV[i], 0.665*RB_QSYS[i]/RB_QU_EUV[i]];          // floor .. pie upper bound
      const h = RB_QEUV_STATED[i] ? 50 : 0.005*RB_QSYS[i];                             // stated to €0.1B, else ±0.5pp of the pie
      return [(e-h)/RB_QU_EUV[i], (e+h)/RB_QU_EUV[i]]; });
    return { lbl:RB_QL, est:99, ser:[{ key:'qeu', label:'EUV (incl. High-NA)', color:RB_COL.eu, v, band }] };
  }
  const v = RB_QARFI_PCT.map((p,i)=>p/100*RB_QSYS[i]/RB_QU_ARFI[i]);
  const band = RB_QARFI_PCT.map((p,i)=>[(p-0.5)/100*RB_QSYS[i]/RB_QU_ARFI[i], (p+0.5)/100*RB_QSYS[i]/RB_QU_ARFI[i]]);
  return { lbl:RB_QL, est:99, ser:[{ key:'qarfi', label:'ArF immersion', color:RB_COL.arfi, v, band }] };
}
function rbPRender(){
  const d = rbPData(), q = rbP.per === 'q', [lo, hi] = rbRange(rbP, d.lbl.length);
  const sl = a => a.slice(lo, hi+1), lbl = sl(d.lbl);
  const vis = d.ser.filter(s => !rbP.hidden.has(s.key));
  const ds = [];
  vis.forEach(s => {
    if(s.band){
      ds.push({ type:'line', label:s.label+' low', data:sl(s.band.map(b=>b[0])), borderWidth:0, pointRadius:0, fill:false, $band:true });
      ds.push({ type:'line', label:s.label+' high', data:sl(s.band.map(b=>b[1])), borderWidth:0, pointRadius:0, backgroundColor:s.color+'26', fill:'-1', $band:true });
    }
    ds.push({ type:'line', label:s.label, data:sl(s.v), borderColor:s.color, backgroundColor:s.color, borderWidth:s.ref?1.5:2.25,
      pointRadius: s.ref ? 0 : 3, pointBackgroundColor: sl(s.v).map((_,i)=> (i+lo)>=d.est ? '#fff' : s.color), spanGaps:false, tension:.2,
      borderDash: s.ref ? [2,3] : undefined,
      segment:{ borderDash: c => s.ref ? [2,3] : ((c.p1DataIndex+lo)>=d.est ? [5,4] : undefined) } });
  });
  const yr = rbP.y;
  if(rbP.chart) rbP.chart.destroy();
  rbP.chart = new Chart($('#rb-p-cv'), { data:{ labels:lbl, datasets:ds }, options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
    plugins:{ legend:{display:false}, tooltip:{ ...TIP, filter: it => !it.dataset.$band && it.parsed.y!=null,
      callbacks:{ title: it => { const i=it[0].dataIndex+lo; return d.lbl[i] + (i>=d.est ? ' · ' + RB_SRC_BBG : (q ? ' · 6-K, derived' : ' · 20-F')); },
        label: it => { let t = ` ${it.dataset.label}: €${it.parsed.y.toFixed(1)}M`;
          if(q){ const s = vis.find(x=>x.label===it.dataset.label), i=it.dataIndex+lo; if(s && s.band) t += `  (range €${s.band[i][0].toFixed(0)}–${s.band[i][1].toFixed(0)}M)`;
            if(s && s.key==='qeu' && RB_QEUV_STATED[i]) t += ' · ' + RB_QEUV_STATED[i]; }
          return t; } } } },
    scales:{ x:{ grid:{display:false}, ticks:{ maxRotation:0, autoSkip:true } },
      y:{ grid:{color:'#EEF1F5'}, beginAtZero:!yr, title:{display:true,text:'€ millions per system'}, ticks:{ callback: v => '€'+v+'M' },
        min: yr?yr[0]:undefined, max: yr?yr[1]:undefined } } } });
  rbP.chart.$lo = lo;
  legend($('#rb-p-leg'), d.ser.map(s=>({key:s.key, label:s.label, color:s.color, line:true, dash:!!s.ref})), rbP.hidden, rbPRender);

  const f = x => x==null ? '' : Number.isInteger(x) ? x : x.toFixed(1);
  const rows = [];
  vis.forEach(s => { rows.push([s.label + ' (€M)', sl(s.v)]);
    if(s.band){ rows.push(['— range low', sl(s.band.map(b=>b[0]))]); rows.push(['— range high', sl(s.band.map(b=>b[1]))]); } });
  if(q && rbP.fam==='eu') rows.push(['EUV units', sl(RB_QU_EUV)], ['EUV € M', sl(RB_QEUV)]);
  if(q && rbP.fam==='arfi') rows.push(['ArFi units', sl(RB_QU_ARFI)], ['ArFi € M (derived)', sl(RB_QARFI_PCT.map((p,i)=>p/100*RB_QSYS[i]))]);
  $('#rb-p-tbl').innerHTML = table([q ? 'Quarter' : 'Year'].concat(lbl), rows.map(([n,a]) => [n].concat(a.map(f))), new Set(lbl.map((_,i)=>(i+lo)>=d.est ? i+1 : -1)));

  $('#rb-p-s').textContent = q ? `${RB_FAMN[rbP.fam]} · € millions per system · Q1'22–Q3'26, derived from 6-K pies (shaded = rounding range)`
    : `${RB_FAMN[rbP.fam]} · € millions per system · 2015–2025 reported, 2026E–2029E consensus (dashed)`;
  $('#rb-p-note').innerHTML = q
    ? `Source: ASML quarterly 6-K presentations; EUV € stated on the Q4'25–Q2'26 calls. Whole-percent pies, hence the shaded range.`
    : `Source: ASML 20-F Note 2 (€ ÷ units, new + used); ${RB_SRC_BBG}. 2015–16 are pre-ASC 606.`;
  $('#rb-p-m').innerHTML = q
    ? `<b>Method.</b> Quarterly price = technology € ÷ units recognized. ASML prints whole-percent shares of net system sales, so each € carries ±0.5pp of system sales (the shaded range). EUV € for Q4'25 (€3.6B) and Q2'26 (€3.8B) are stated on the call (±€50M rounding); Q1'26 is "over €4.1B" (range from that floor to the pie's upper bound). EUV includes High-NA (2 in Q4'24, 2 in Q4'25, 2 in Q1'26, 1 in Q2'26; not stated for other 2025–26 quarters). Quarterly is offered only for EUV and ArFi: for ArF dry, KrF and i-line the rounding error is 10–50% of the price.`
    : `<b>Method.</b> Price = € ÷ units recognized (new + used). EUV (all) = NXE + EXE; the split starts in 2023 (EXE = 0 that year). 2015 EUV is a single unit. Lithography average = (system sales − M&amp;I) ÷ litho units. 2026E+ = Bloomberg AVERAGE_SALES_PRICE; its "EUV (all)" equals its Low-NA figure in 2026E (see the consistency checks under the next chart). ASML does not price by model: each figure is a yearly blend. Sources: 20-F Note 2 of FY2017 (2015–16), FY2019 (2017–19), FY2022 (2020–22), FY2025 (2023–25).`;
}
function rbPSyncPer(){
  const qb = $('#rb-p-per .fb[data-v="q"]'); qb.disabled = !RB_QOK[rbP.fam];
  qb.title = qb.disabled ? 'Quarterly price only for EUV and ArFi (rounding error too large for the others)' : '';
  if(qb.disabled && rbP.per === 'q'){ rbP.per = 'a'; $$('#rb-p-per .fb').forEach(b=>b.classList.toggle('active', b.dataset.v==='a')); }
}

/* ═════════════ 3 · volume / price / mix bridge ═════════════ */
const RB_BF = ['nxe','exe','arfi','arfd','krf','il'];
function rbBook(i){
  const f = {};
  if(i < RB_NA){
    RB_BF.forEach(k => {
      let u, e;
      if(k==='nxe'){ u = RB_A.eu.u[i] - (RB_A.exe.u[i]||0); e = RB_A.eu.e[i] - (RB_A.exe.e[i]||0); }
      else if(k==='exe'){ u = RB_A.exe.u[i]||0; e = RB_A.exe.e[i]||0; }
      else { u = RB_A[k].u[i]; e = RB_A[k].e[i]; }
      f[k] = { u, p: u ? e/u : null };
    });
    return { f, mi: RB_A.mi.e[i], sys: RB_SYS_A[i] };
  }
  const j = i - RB_NA, bk = { nxe:'low', exe:'high', arfi:'arfi', arfd:'arfd', krf:'krf', il:'il' };
  RB_BF.forEach(k => f[k] = { u:RB_B[bk[k]].u[j], p:RB_B[bk[k]].p[j] });
  const mi = RB_B.mi.r[j];
  return { f, mi, sys: RB_BF.reduce((a,k)=>a+f[k].u*f[k].p,0) + mi };
}
/* A family with no prior-year price (EXE in 2024) is valued at its own price, so all of its revenue lands in Mix.
   Volume + Mix + Price + M&I = Δ net system sales exactly. */
const RB_BR = (() => {
  const out = [];
  for(let i=1;i<RB_YRS.length;i++){
    const a = rbBook(i-1), b = rbBook(i);
    const Ua = RB_BF.reduce((s,k)=>s+a.f[k].u,0), Ub = RB_BF.reduce((s,k)=>s+b.f[k].u,0);
    const avgA = RB_BF.reduce((s,k)=>s+a.f[k].u*(a.f[k].p||0),0) / Ua;
    let atOld = 0, price = 0;
    RB_BF.forEach(k => { const base = a.f[k].p!=null ? a.f[k].p : b.f[k].p, ub = b.f[k].u;
      if(!ub) return; atOld += ub*base; price += ub*(b.f[k].p - base); });
    out.push({ y:RB_YRS[i], est:i>=RB_NA, prev:a.sys, cur:b.sys, d:b.sys-a.sys, vol:(Ub-Ua)*avgA, price, mix:atOld - Ub*avgA, mi:b.mi - a.mi });
  }
  return out;
})();
const RB_BS = [
  { key:'vol',   label:'Volume', color:'#2563EB' },
  { key:'price', label:'Price',  color:'#1B3F94' },
  { key:'mix',   label:'Mix',    color:'#93B1F0' },
  { key:'mi',    label:'M&I',    color:'#A9B4C2' }
];
const rbB = { met:'eur', hidden:new Set(), x:null, y:null, chart:null };
function rbBRender(){
  const pc = rbB.met === 'pct', val = (r,k) => pc ? r[k]/r.prev*100 : r[k]/1000;
  const [lo, hi] = rbRange(rbB, RB_BR.length), R = RB_BR.slice(lo, hi+1);
  const vis = RB_BS.filter(s => !rbB.hidden.has(s.key));
  const ds = vis.map(s => ({ type:'bar', label:s.label, data:R.map(r=>val(r,s.key)), stack:'b',
    backgroundColor:R.map(r=> r.est ? s.color+'66' : s.color), borderColor:s.color, borderWidth:R.map(r=>r.est?1:0), order:2, barPercentage:.7 }));
  if(!rbB.hidden.has('d')) ds.push({ type:'line', label:'Δ net system sales', data:R.map(r=>val(r,'d')), borderColor:'#1E2733', backgroundColor:'#1E2733',
    showLine:false, pointRadius:4, pointStyle:'rectRot', pointBackgroundColor:R.map(r=>r.est?'#fff':'#1E2733'), order:1 });
  const yr = rbB.y;
  const fmt = y => (y>=0?'+':'−') + (pc ? Math.abs(y).toFixed(1)+'%' : '€'+Math.abs(y).toFixed(2)+'B');
  if(rbB.chart) rbB.chart.destroy();
  rbB.chart = new Chart($('#rb-b-cv'), { data:{ labels:R.map(r=>r.y), datasets:ds }, options:{
    responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
    plugins:{ legend:{display:false}, tooltip:{ ...TIP, callbacks:{
      title: it => { const r=R[it[0].dataIndex]; return r.y + ' vs ' + (+r.y.slice(0,4)-1) + (r.est ? ' · Bloomberg units × ASP, Oct 16 2026' : ' · 20-F'); },
      label: it => ` ${it.dataset.label}: ${fmt(it.parsed.y)}`,
      footer: it => { const r=R[it[0].dataIndex]; const sh = vis.reduce((a,s)=>a+val(r,s.key),0);
        return `Sum shown: ${fmt(sh)} · system sales €${(r.prev/1000).toFixed(1)}B → €${(r.cur/1000).toFixed(1)}B`; } } } },
    scales:{ x:{ stacked:true, grid:{display:false}, ticks:{ maxRotation:0, autoSkip:true } },
      y:{ stacked:true, grid:{color:'#EEF1F5'}, title:{display:true,text: pc ? '% of prior-year net system sales' : '€ billions'},
        ticks:{ callback: x => pc ? x+'%' : '€'+x+'B' }, min:yr?yr[0]:undefined, max:yr?yr[1]:undefined } } } });
  rbB.chart.$lo = lo;
  legend($('#rb-b-leg'), RB_BS.concat([{key:'d', label:'Δ net system sales', color:'#1E2733', line:true}]), rbB.hidden, rbBRender);

  const est = new Set(R.map((r,i)=>r.est?i+1:-1));
  const f = x => pc ? (x>=0?'+':'')+x.toFixed(1)+'%' : (x>=0?'+':'')+x.toFixed(2);
  const rows = [
    ['Net system sales, prior year (€B)', R.map(r=>(r.prev/1000).toFixed(2))],
    ['Net system sales (€B)', R.map(r=>(r.cur/1000).toFixed(2))],
    ...(rbB.hidden.has('d') ? [] : [['Δ net system sales', R.map(r=>f(val(r,'d')))]]),
    ...vis.map(s => [s.label, R.map(r=>f(val(r,s.key)))]),
    ['<b>Sum shown</b>', R.map(r=>'<b>'+f(vis.reduce((a,s)=>a+val(r,s.key),0))+'</b>')],
    ['Bloomberg "Net System" line (€B)', R.map(r=> r.est ? (RB_B.sys[RB_YRS.indexOf(r.y)-RB_NA]/1000).toFixed(2) : '')]
  ];
  $('#rb-b-tbl').innerHTML = table([pc?'% of prior-year sales':'€B'].concat(R.map(r=>r.y)), rows.map(([n,a])=>[n].concat(a)), est);
}
function rbChecks(){
  const B = RB_B, n = [0,1,2,3];
  const blend = n.map(j => (B.low.u[j]*B.low.p[j] + B.high.u[j]*B.high.p[j]) / (B.low.u[j]+B.high.u[j]));
  const duvSum = n.map(j => B.arfi.u[j]+B.arfd.u[j]+B.krf.u[j]+B.il.u[j]);
  const uxp = n.map(j => ['low','high','arfi','arfd','krf','il'].reduce((a,k)=>a+rbEst(k,j),0) + B.mi.r[j]);
  const g = (a,d=1) => a.map(x => x==null ? '—' : x.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d}));
  const diff = (a,b,d=0) => a.map((x,i)=> b[i]==null||x==null ? '—' : `<span class="${x-b[i]>=0?'rb-pos':'rb-neg'}">${x-b[i]>=0?'+':'−'}${Math.abs(x-b[i]).toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d})}</span>`);
  const sec = t => [`<b>${t}</b>`,'','','',''];
  const rows = [
    sec('1 · "EUV" ASP vs its parts'),
    ['BBG EUV ASP', ...g(B.eu.p)], ['BBG Low-NA ASP', ...g(B.low.p)],
    ['Low + High blended ASP', ...g(blend)], ['EUV row − blend', ...diff(B.eu.p, blend, 1)],
    sec('2 · EUV units and revenue'),
    ['BBG EUV units', ...g(B.eu.u)], ['Low-NA + High-NA units', ...g(n.map(j=>B.low.u[j]+B.high.u[j]))],
    ['BBG EUV revenue', ...g(B.eu.r,0)], ['Low-NA + High-NA revenue', ...g(n.map(j=>B.low.r[j]+B.high.r[j]),0)],
    sec('3 · Low-NA: units × ASP vs revenue'),
    ['Low-NA units × ASP', ...g(n.map(j=>rbEst('low',j)),0)], ['BBG Low-NA revenue', ...g(B.low.r,0)],
    ['Implied Low-NA ASP (rev ÷ units)', ...g(n.map(j=>B.low.r[j]/B.low.u[j]))],
    sec('4 · Net system sales'),
    ['Σ units × ASP + M&I', ...g(uxp,0)], ['BBG Net System line', ...g(B.sys,0)], ['Gap', ...diff(uxp, B.sys, 0)],
    sec('5 · DUV units'),
    ['BBG DUV units row', ...g(B.duvU,0)], ['ArFi + ArF dry + KrF + i-line', ...g(duvSum,0)]
  ];
  $('#rb-x-tbl').innerHTML = table(['Bloomberg check','2026E','2027E','2028E','2029E'], rows, new Set([1,2,3,4]));
}

/* ═════════════ 4 · scenarios to 2030 ═════════════ */
/* Families for the scenario engine; u/asp/bbgE 2026E–2029E = Bloomberg, a25 = FY2025 20-F [units, €M]. */
const RB_FAM = [
  { k:'hna',   n:'High-NA EUV',  b:'high', a25:[4,1156.9] },
  { k:'euv',   n:'EUV (0.33 NA)',b:'low',  a25:[44,10445.8] },
  { k:'arfi',  n:'ArFi',         b:'arfi', a25:[131,10311.4] },
  { k:'dry',   n:'ArF dry',      b:'arfd', a25:[16,427.0] },
  { k:'krf',   n:'KrF',          b:'krf',  a25:[78,1001.3] },
  { k:'iline', n:'i-line',       b:'il',   a25:[54,307.3] }
].map(f => ({ ...f, u:RB_B[f.b].u, asp:RB_B[f.b].p, bbgE:RB_B[f.b].r }));
const RB_TOT25 = 32667;   // FY2025 total net sales, € M (20-F 32,667.3)
const RB_CMD = { low:{euv:22,non:11,ibm:11,tot:44}, mod:{euv:26,non:14,ibm:12,tot:52}, high:{euv:32,non:15,ibm:13,tot:60}, gm:[56,60] };   // Investor Day Nov 14 2024, € B

/* Drivers 2026–2030, copied from add_projection.ps1 ($DRV). mi/ibm: [2026 level €M, then % YoY ×4].
   2026 M&I = 9M (125.6 + 196.9 + 251.2) + 350 = 924; IBM = 9M (2,487.5 + 2,761.7 + 3,288.8) + 3,700 = 12,238. */
const RB_DRV = [
  { k:'lowna_u', g:'euv', l:'Low-NA EUV units', unit:'units', fam:'euv', p:'u',
    n:'Base = ASML capacity (Q3 26 call: ~65 in 2026, +30% for 2027 = ~85, a further ~+30% under study for 2028 = ~110), haircut on 2028; Bull = BBG units; Bear = AI capex pause',
    Bear:[65,72,65,65,70], Base:[65,85,100,105,110], Bull:[66,88,112,120,125] },
  { k:'lowna_asp', l:'Low-NA EUV price', unit:'€M', fam:'euv', p:'asp', n:'9M26 EUV ASP 245 incl. High-NA; NXE:3800E mix, then NXE:4000F. BBG low-NA ASP 241/255/278/300',
    Bear:[237,248,252,256,260], Base:[239,255,268,280,290], Bull:[241,258,278,300,310] },
  { k:'hna_u', l:'High-NA units', unit:'units', fam:'hna', p:'u', n:'Intel now; Samsung HVM 2028; TSMC HVM 2030 (Q3 26 call). Capacity 20/yr set in 2022 for 2027-28. BBG 4.9/5.4/7.8/12.4',
    Bear:[5,5,6,8,10], Base:[5,6,9,14,20], Bull:[5,7,10,16,22] },
  { k:'hna_asp', l:'High-NA price', unit:'€M', fam:'hna', p:'asp', n:'EXE:5200B; BBG 356/400/399/420',
    Bear:[355,360,370,380,390], Base:[360,380,390,400,410], Bull:[365,400,400,420,430] },
  { k:'arfi_u', g:'duv', l:'ArFi units', unit:'units', fam:'arfi', p:'u', n:'9M26 = 80; +30% ArFi capacity for 2027 (Q3 26 call). Bear = China normalisation. BBG 132/167/206/208',
    Bear:[131,120,105,110,120], Base:[132,160,175,180,185], Bull:[134,167,206,208,210] },
  { k:'arfi_asp', l:'ArFi price', unit:'€M', fam:'arfi', p:'asp', n:'9M26 82.7; BBG 84/86/89/92',
    Bear:[83,84,85,86,87], Base:[83.2,86,88,90,92], Bull:[83.5,87,89,92,94] },
  { k:'dry_u', l:'ArF dry units', unit:'units', fam:'dry', p:'u', n:'9M26 = 23. BBG 36/44/49/47',
    Bear:[32,28,24,24,26], Base:[33,38,42,44,45], Bull:[34,44,49,48,50] },
  { k:'dry_asp', l:'ArF dry price', unit:'€M', fam:'dry', p:'asp', n:'9M26 27.8; BBG 29/30/30/32',
    Bear:[27.6,28,28.5,29,29.5], Base:[27.8,29.5,30,30.5,31], Bull:[28,30,30.5,31.5,32] },
  { k:'krf_u', l:'KrF units', unit:'units', fam:'krf', p:'u', n:'9M26 = 100; most China-exposed line. BBG 143/152/163/164',
    Bear:[138,110,95,95,100], Base:[140,145,150,150,155], Bull:[142,152,163,165,170] },
  { k:'krf_asp', l:'KrF price', unit:'€M', fam:'krf', p:'asp', n:'9M26 11.9; BBG 12.5/13.3/13.3/13.6',
    Bear:[11.9,12.5,12.5,12.7,12.9], Base:[11.9,13,13.2,13.4,13.6], Bull:[12,13.3,13.5,13.8,14] },
  { k:'iline_u', l:'i-line units', unit:'units', fam:'iline', p:'u', n:'9M26 = 39. BBG 60/69/76/73',
    Bear:[53,48,42,42,45], Base:[54,60,62,62,64], Bull:[55,69,76,73,75] },
  { k:'iline_asp', l:'i-line price', unit:'€M', fam:'iline', p:'asp', n:'9M26 5.4; BBG 5.4/5.4/5.5/5.8',
    Bear:[5.4,5.3,5.3,5.4,5.5], Base:[5.4,5.4,5.5,5.6,5.7], Bull:[5.4,5.5,5.6,5.8,6.0] },
  { k:'mi_g', g:'oth', l:'M&I', unit:'€M → %', n:'2026 = 9M actual + ~€350m Q4. Investor Day: holistic litho >15% CAGR. BBG +33%/+12%/+9%',
    Bear:[924,5,0,5,8], Base:[924,20,15,15,15], Bull:[924,32,12,12,15] },
  { k:'ibm_g', l:'Installed Base Mgmt', unit:'€M → %', n:'2026 = 9M actual + Q4 guide ~€3.7bn. Investor Day 2030: €11-13bn (already reached). BBG 14.4/16.6/17.7bn',
    Bear:[12238,5,2,4,5], Base:[12238,15,12,10,8], Bull:[12238,18,15,8,8] }
];
/* Consensus preset: units/price straight from Bloomberg, M&I / IBM growth implied by its rows; no 2030 (null). */
RB_DRV.forEach(d => {
  const g = a => [a[0], (a[1]/a[0]-1)*100, (a[2]/a[1]-1)*100, (a[3]/a[2]-1)*100, null];
  if(d.fam){ const f = RB_FAM.find(x=>x.k===d.fam); d.bbg = [...f[d.p], null]; }
  else d.bbg = g(d.k==='mi_g' ? RB_B.mi.r : RB_B.ibm);
});
const RB_PRE_DESC = {
  bbg:'<b>Bloomberg consensus (Oct 16 2026).</b> Consensus units and price per family for 2026–2029; M&amp;I and IBM grow at the rates implied by Bloomberg\'s own rows (IBM 2026 €11.95B, below the 9M actual + Q4 guide of ~€12.2B). No 2030 column in the consensus.',
  Bear:'<b>Bear (Projection sheet).</b> Low-NA EUV = "AI capex pause": 65 / 72 / 65 / 65 / 70 units. ArFi = "China normalisation": 131 → 105 units in 2028. KrF 138 → 95, i-line 53 → 42. Price a little below consensus. M&amp;I +5 / 0 / +5 / +8%, IBM +5 / +2 / +4 / +5% a year.',
  Base:'<b>Base (Projection sheet).</b> Low-NA EUV = ASML capacity (Q3\'26 call: ~65 in 2026, +30% for 2027 = ~85, a further ~+30% under study for 2028 = ~110), with a haircut on 2028: 65 / 85 / 100 / 105 / 110. High-NA 5 → 20 (Samsung HVM 2028, TSMC HVM 2030). ArFi 132 → 185. M&amp;I +20 / +15 / +15 / +15%, IBM +15 / +12 / +10 / +8%.',
  Bull:'<b>Bull (Projection sheet).</b> Low-NA EUV = "BBG units": 66 / 88 / 112 / 120 / 125. Other families at or near consensus units (ArFi 134 → 210), price at or above consensus (Low-NA €310M by 2030). M&amp;I +32 / +12 / +12 / +15%, IBM +18 / +15 / +8 / +8%.'
};
const RB_PRE_SHORT = {
  bbg:'Consensus units × price to 2029 · total net sales, €B',
  Bear:'Bear: AI capex pause, China normalisation · total net sales, €B',
  Base:'Base: ASML capacity path, 2028 haircut · total net sales, €B',
  Bull:'Bull: consensus units, price above consensus · total net sales, €B'
};
const RB_SCOL = { Bear:'#A9B4C2', Base:'#3E5A82', Bull:'#1B3F94', bbg:'#1E2733', mine:'#2563EB', cmd:'#C8D7F4' };
const RB_S_YRS = ['2025A','2026E','2027E','2028E','2029E','2030E'];
/* Lines of ASML's Investor Day 2030 table (Nov 14 2024): EUV · non-EUV litho + M&I · IBM · total. */
const RB_S_LINES = { tot:'Total net sales', euv:'EUV', non:'Non-EUV litho + M&I', ibm:'Installed Base Mgmt' };
const RB_S25 = { tot:RB_TOT25, euv:RB_A.eu.e[10], non:RB_DUVK.reduce((a,k)=>a+RB_A[k].e[10],0) + RB_A.mi.e[10], ibm:RB_IBM_A[10] };   // FY2025 20-F
const RB_SBBG = {   // Bloomberg revenue rows 2026E–2029E (Low-NA + High-NA rows, not its "EUV" row)
  tot: RB_B.tot,
  euv: [0,1,2,3].map(j => RB_B.low.r[j] + RB_B.high.r[j]),
  non: [0,1,2,3].map(j => RB_DUVK.reduce((a,k)=>a+RB_B[k].r[j],0) + RB_B.mi.r[j]),
  ibm: RB_B.ibm
};
function rbSPick(o, ln){   // a rbCompute() output → that line's 5 values (2026–2030), null where an input is missing
  const n = a => a.some(x => x == null);
  if(ln === 'tot') return o.tot;
  if(ln === 'ibm') return o.ibm;
  return [0,1,2,3,4].map(i => {
    const p = ln === 'euv' ? [o.fam.euv[i], o.fam.hna[i]] : [o.fam.arfi[i], o.fam.dry[i], o.fam.krf[i], o.fam.iline[i], o.mi[i]];
    return n(p) ? null : p.reduce((a,b)=>a+b,0); });
}
/* Investor Day Nov 14 2024 — every 2030 target (targets.json cmd_2024_11_14; 6-K 0000937966-24-000026, CFO deck Ex.99.7 pp.16–18). */
const RB_TG = [
  ['Total net sales', '€44B / €52B / €60B', 'low / moderate / high scenario'],
  ['· EUV', '€22B / €26B / €32B', ''],
  ['· Non-EUV litho + M&I', '€11B / €14B / €15B', ''],
  ['· Installed Base Mgmt', '€11B / €12B / €13B', ''],
  ['Net system sales', '€33–47B', ''],
  ['Gross margin', '56–60%', 'see GM Bridge & OpEx'],
  ['R&D', '€6.0–6.6B', 'see GM Bridge & OpEx'],
  ['SG&A', '€1.7–1.9B', 'see GM Bridge & OpEx'],
  ['Capex', '~€2.5B', ''],
  ['Effective tax rate', '~17%', ''],
  ['Cash conversion cycle', '<200 days', ''],
  ['Semiconductor market 2030', '>US$1 trillion', '9% CAGR 2025–30'],
  ['EUV litho spend CAGR 2025–30', 'Logic 10–20% · DRAM 15–25%', 'as restated in the FY2025 20-F'],
  ['Holistic lithography CAGR 2025–30', '>15%', ''],
  ['Applications TAM (metrology, inspection, computational litho)', '€11B in 2030', '€5.4B in 2023, €7.6B in 2026']
];

// vals = { key: [5 numbers 2026..2030] } → per-year build (€M), null where any input is missing
function rbCompute(vals){
  const out = { fam:{}, mi:[], ibm:[], sys:[], tot:[], units:[] };
  const fk = { euv:['lowna_u','lowna_asp'], hna:['hna_u','hna_asp'], arfi:['arfi_u','arfi_asp'], dry:['dry_u','dry_asp'], krf:['krf_u','krf_asp'], iline:['iline_u','iline_asp'] };
  Object.entries(fk).forEach(([f,[u,a]]) => out.fam[f] = vals[u].map((x,i)=> x==null||vals[a][i]==null ? null : x*vals[a][i]));
  const lvl = a => { const r=[a[0]]; for(let i=1;i<5;i++) r.push(r[i-1]==null||a[i]==null ? null : r[i-1]*(1+a[i]/100)); return r; };
  out.mi = lvl(vals.mi_g); out.ibm = lvl(vals.ibm_g);
  for(let i=0;i<5;i++){
    const parts = [...Object.values(out.fam).map(a=>a[i]), out.mi[i]];
    out.sys[i] = parts.some(x=>x==null) ? null : parts.reduce((a,b)=>a+b,0);
    out.tot[i] = out.sys[i]==null||out.ibm[i]==null ? null : out.sys[i]+out.ibm[i];
    const us = Object.values(fk).map(([u])=>vals[u][i]);
    out.units[i] = us.some(x=>x==null) ? null : us.reduce((a,b)=>a+b,0);
  }
  return out;
}
const rbPresetVals = p => Object.fromEntries(RB_DRV.map(d => [d.k, (p==='bbg' ? d.bbg : d[p]).slice()]));
const RB_REF = Object.fromEntries(['bbg','Bear','Base','Bull'].map(p => [p, rbCompute(rbPresetVals(p))]));

const rbS = { line:'tot', pre:'Base', vals:rbPresetVals('Base'), hidden:new Set(), x:null, y:null, chart:null };
function rbFmtIn(d, v, i){ if(v==null) return ''; if(d.k.endsWith('_g') && i===0) return Math.round(v); return +v.toFixed(1); }
function rbSInputs(){
  const grp = { euv:'EUV', duv:'DUV', oth:'Metrology & Inspection · Installed Base' };
  const out = rbCompute(rbS.vals);
  let h = `<table><thead><tr><th>Driver</th><th></th>${RB_S_YRS.slice(1).map(y=>`<th class="est">${y}</th>`).join('')}</tr></thead><tbody>`;
  RB_DRV.forEach(d => {
    if(d.g) h += `<tr><td class="g" colspan="7">${grp[d.g]}</td></tr>`;
    const ref = rbS.pre==='bbg' ? d.bbg : d[rbS.pre];
    h += `<tr><td title="${d.n.replace(/"/g,'&quot;')}">${d.l}</td><td class="u">${d.k.endsWith('_g') ? '€M · %' : d.unit}</td>` +
      rbS.vals[d.k].map((v,i)=>{ const ed = (v??null)!==(ref[i]??null);
        return `<td><input type="number" step="any" data-k="${d.k}" data-i="${i}" value="${rbFmtIn(d,v,i)}" class="${ed?'ed':''}" aria-label="${d.l} ${2026+i}"></td>`; }).join('') + '</tr>';
  });
  const f = v => v==null ? '—' : '€'+(v/1000).toFixed(1)+'B';
  h += `<tr class="out"><td>Total net sales</td><td class="u">€B</td>${out.tot.map(v=>`<td>${f(v)}</td>`).join('')}</tr>`;
  $('#rb-s-in').innerHTML = h + '</tbody></table>';
  $$('#rb-s-in input').forEach(inp => inp.onchange = () => {
    const t = inp.value.trim(); rbS.vals[inp.dataset.k][+inp.dataset.i] = t==='' ? null : +t;
    rbSInputs(); rbSRender();
  });
}
function rbSRender(){
  const mine = rbCompute(rbS.vals), H = rbS.hidden;
  const edited = RB_DRV.some(d => rbS.vals[d.k].some((v,i)=> (v??null) !== ((rbS.pre==='bbg'?d.bbg:d[rbS.pre])[i]??null)));
  const preName = rbS.pre==='bbg' ? 'Consensus' : rbS.pre;
  const mineLbl = edited ? `Your scenario (edited from ${preName})` : `Your scenario (= ${preName})`;
  const ln = rbS.line, a25 = RB_S25[ln];
  const path = t => [a25, ...t].map(v => v==null ? null : v/1000);
  const SER = [
    { key:'mine', label:mineLbl, color:RB_SCOL.mine, data:path(rbSPick(mine, ln)), w:3 },
    { key:'bbgrow', label: ln === 'tot' ? 'Bloomberg revenue row' : 'Bloomberg revenue rows', color:RB_SCOL.bbg, data:[a25/1000, ...RB_SBBG[ln].map(v=>v/1000), null], w:2 },
    { key:'Bear', label:'Bear', color:RB_SCOL.Bear, data:path(rbSPick(RB_REF.Bear, ln)), w:1.5 },
    { key:'Base', label:'Base', color:RB_SCOL.Base, data:path(rbSPick(RB_REF.Base, ln)), w:1.5 },
    { key:'Bull', label:'Bull', color:RB_SCOL.Bull, data:path(rbSPick(RB_REF.Bull, ln)), w:1.5 }
  ];
  const cmd = { lo:RB_CMD.low[ln], mid:RB_CMD.mod[ln], hi:RB_CMD.high[ln] };
  const [lo, hi] = rbRange(rbS, RB_S_YRS.length), sl = a => a.slice(lo,hi+1), lbl = sl(RB_S_YRS);
  const ds = SER.filter(s=>!H.has(s.key)).map(s => ({ type:'line', label:s.label, data:sl(s.data), borderColor:s.color, backgroundColor:s.color,
    borderWidth:s.w, pointRadius:s.key==='mine'?3.5:2, tension:.2, spanGaps:false, order:1,
    segment:{ borderDash: c => (c.p1DataIndex+lo)>=1 ? (s.key==='mine'?[6,3]:[4,4]) : undefined } }));
  if(!H.has('cmd')){
    ds.push({ type:'bar', label:'Investor Day 2030 range', data:sl(RB_S_YRS.map(y=> y==='2030E' ? [cmd.lo, cmd.hi] : null)), backgroundColor:RB_SCOL.cmd+'cc', borderColor:'#93B1F0', borderWidth:1, barPercentage:.35, order:3 });
    ds.push({ type:'line', label:'Investor Day 2030 moderate', data:sl(RB_S_YRS.map(y=>y==='2030E'?cmd.mid:null)), showLine:false,
      pointStyle:'line', pointRadius:14, pointBorderWidth:2, borderColor:'#1B3F94', backgroundColor:'#1B3F94', order:0 });
  }
  const yr = rbS.y;
  if(rbS.chart) rbS.chart.destroy();
  rbS.chart = new Chart($('#rb-s-cv'), { data:{ labels:lbl, datasets:ds }, options:{ responsive:true, maintainAspectRatio:false, animation:false,
    interaction:{mode:'index',intersect:false},
    plugins:{ legend:{display:false}, tooltip:{ ...TIP, filter: it => it.raw != null, callbacks:{
      title: it => it[0].label + (it[0].dataIndex+lo===0 ? ' · 20-F' : ' · estimate'),
      label: it => { const r = it.raw; if(Array.isArray(r)) return ` ${it.dataset.label}: €${r[0]}–${r[1]}B`; return ` ${it.dataset.label}: €${(+r).toFixed(1)}B`; } } } },
    scales:{ x:{grid:{display:false}}, y:{ grid:{color:'#EEF1F5'}, title:{display:true,text:RB_S_LINES[ln] + ', € billions'}, ticks:{callback:x=>'€'+x},
      min:yr?yr[0]:(ln==='tot'?20:0), max:yr?yr[1]:undefined } } } });
  rbS.chart.$lo = lo;
  legend($('#rb-s-leg'), [...SER.map(s=>({key:s.key,label:s.label,color:s.color,line:true,dash:s.key!=='mine'})), {key:'cmd',label:`Investor Day 2030 (€${cmd.lo}–${cmd.hi}B, mark = €${cmd.mid}B)`,color:'#93B1F0'}], H, rbSRender);
  $('#rb-s-s').textContent = RB_PRE_SHORT[rbS.pre].replace('total net sales', RB_S_LINES[ln]);

  const f = v => v==null ? '—' : (v/1000).toFixed(2), yv = a => sl([RB_TOT25, ...a]);
  const rows = [];
  if(!H.has('mine')){
    const fam = mine.fam, a = k => RB_FAM.find(x=>x.k===k).a25[1];
    const r = (n, a25, arr) => rows.push([n, ...sl([a25, ...arr]).map(f)]);
    r('Low-NA EUV', a('euv'), fam.euv); r('High-NA EUV', a('hna'), fam.hna);
    const duv = [0,1,2,3,4].map(i => ['arfi','dry','krf','iline'].some(k=>fam[k][i]==null) ? null : fam.arfi[i]+fam.dry[i]+fam.krf[i]+fam.iline[i]);
    r('DUV (ArFi + dry + KrF + i-line)', a('arfi')+a('dry')+a('krf')+a('iline'), duv);
    r('Metrology & Inspection', RB_A.mi.e[10], mine.mi); r('Net system sales', RB_SYS_A[10], mine.sys); r('Installed Base Mgmt', RB_IBM_A[10], mine.ibm);
    rows.push(['<b>'+mineLbl+' — total</b>', ...yv(mine.tot).map(v=>`<b>${f(v)}</b>`)]);
    const t = [RB_TOT25, ...mine.tot];
    rows.push(['  YoY', ...sl(t.map((v,i)=> i===0||v==null||t[i-1]==null ? '—' : sgn(v/t[i-1]-1,1)))]);
    rows.push(['  vs Bloomberg revenue row', ...sl(t.map((v,i)=> i===0||i>4||v==null ? '—' : sgn(v/RB_B.tot[i-1]-1,1)))]);
    rows.push(['  Lithography units (systems)', ...sl([327, ...mine.units].map(v=>v==null?'—':Math.round(v)))]);
  }
  const lnN = RB_S_LINES[ln];
  if(!H.has('mine') && ln !== 'tot') rows.push([`<b>${mineLbl} — ${lnN}</b>`, ...sl([a25, ...rbSPick(mine, ln)]).map(v=>`<b>${f(v)}</b>`)]);
  if(!H.has('bbgrow')) rows.push([`Bloomberg — ${lnN}`, ...sl([a25, ...RB_SBBG[ln], null].map(f))]);
  ['Bear','Base','Bull'].filter(k=>!H.has(k)).forEach(k => rows.push([`${k} — ${lnN}`, ...sl([a25, ...rbSPick(RB_REF[k], ln)]).map(f)]));
  if(!H.has('cmd')) rows.push([`Investor Day 2030 low / moderate / high — ${lnN}`, ...sl(RB_S_YRS.map(y=>y==='2030E'?`${cmd.lo} / ${cmd.mid} / ${cmd.hi}`:'—'))]);
  $('#rb-s-tbl').innerHTML = table(['€B', ...lbl], rows, new Set(lbl.map((_,i)=>i+1).filter(i=>i-1+lo>=1)));
  rbCmd(mine);
}
function rbCmd(mine){
  const j = 3, bb = { euv:(RB_B.low.r[j]+RB_B.high.r[j])/1000, non:(['arfi','arfd','krf','il'].reduce((a,k)=>a+RB_B[k].r[j],0)+RB_B.mi.r[j])/1000, ibm:RB_B.ibm[j]/1000, tot:RB_B.tot[j]/1000 };
  const m = mine.tot[4]==null ? null : { euv:(mine.fam.euv[4]+mine.fam.hna[4])/1000, non:(mine.fam.arfi[4]+mine.fam.dry[4]+mine.fam.krf[4]+mine.fam.iline[4]+mine.mi[4])/1000, ibm:mine.ibm[4]/1000, tot:mine.tot[4]/1000 };
  const f = v => v==null ? '—' : v.toFixed(1);
  const rows = [['EUV','euv'],['Non-EUV litho + M&I','non'],['Installed Base Mgmt','ibm'],['<b>Total</b>','tot']].map(([n,k]) =>
    [n, f(RB_CMD.low[k]), f(RB_CMD.mod[k]), f(RB_CMD.high[k]), f(bb[k]), m ? f(m[k]) : '—']);
  $('#rb-cmd-tbl').innerHTML = table(['€B','2030 low','2030 moderate','2030 high','Bloomberg 2029E','Yours 2030E'], rows, new Set([4,5]));
  $('#rb-cmd-note').innerHTML = `Bloomberg's 2029E total (€${bb.tot.toFixed(1)}B) is €${(bb.tot-RB_CMD.high.tot).toFixed(1)}B above the top of ASML's 2030 range; its 2028E (€${(RB_B.tot[2]/1000).toFixed(1)}B) is already above it. ` +
    `IBM 2026 (9M actual + Q4 guide ≈ €${(RB_26.ibm/1000).toFixed(1)}B) is inside the €11–13B 2030 band. Gross margin: Investor Day 2030 56–60% vs Bloomberg ${RB_B.gm[3].toFixed(1)}% in 2029E. ` +
    `Non-EUV = DUV lithography + M&amp;I, as ASML groups it. Bear / Base / Bull = the Projection sheet of ASML_DCF_inputs.xlsx (generator <code>asml-work/data/add_projection.ps1</code>).` +
    (m ? '' : ' Your scenario has no 2030 value: the Consensus preset stops at 2029.');
}
function rbTargets(){
  $('#rb-tg-tbl').innerHTML = table(['Investor Day Nov 14 2024 — 2030 target', 'Value', 'Note'], RB_TG);
}
function rbSNotes(){
  $('#rb-s-notes').innerHTML = table(['Driver','Unit','Bear 2026–30','Base 2026–30','Bull 2026–30','Source / reasoning (Projection sheet, verbatim)'],
    RB_DRV.map(d => [d.l, d.k.endsWith('_g')?'€M, then %':d.unit, d.Bear.join(' / '), d.Base.join(' / '), d.Bull.join(' / '), `<span style="white-space:normal;display:block;min-width:320px;text-align:left">${d.n}</span>`]));
}
function rbSPreset(p){
  rbS.pre = p; rbS.vals = rbPresetVals(p); rbS.x = null; rbS.y = null;
  $('#rb-s-s').textContent = RB_PRE_SHORT[p]; $('#rb-s-long').innerHTML = RB_PRE_DESC[p];
  rbSInputs(); rbSRender();
}

/* ═════════════ wiring ═════════════ */
pills('#rb-l-met', v => { rbL.met = v; rbL.y = null; if(rbL.chart) rbLRender(); });
pills('#rb-p-fam', v => { rbP.fam = v; rbP.hidden.clear(); rbP.x = null; rbP.y = null; rbPSyncPer(); if(rbP.chart) rbPRender(); });
pills('#rb-p-per', v => { rbP.per = v; rbP.hidden.clear(); rbP.x = null; rbP.y = null; if(rbP.chart) rbPRender(); });
pills('#rb-b-met', v => { rbB.met = v; rbB.y = null; if(rbB.chart) rbBRender(); });
pills('#rb-s-pre', p => rbSPreset(p));
pills('#rb-s-line', v => { rbS.line = v; rbS.hidden.clear(); rbS.x = null; rbS.y = null; if(rbS.chart) rbSRender(); });

let rbBuilt = false;
function rbInit(){
  if(rbBuilt) return; rbBuilt = true;
  rbKpis();
  rbLRender(); rbRecon(); rbZoom(rbL, rbLRender);
  rbPSyncPer(); rbPRender(); rbZoom(rbP, rbPRender);
  rbBRender(); rbChecks(); rbZoom(rbB, rbBRender);
  rbSNotes(); rbTargets(); rbSPreset('Base'); rbZoom(rbS, rbSRender);
}
