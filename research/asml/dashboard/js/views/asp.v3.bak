/* ═════════════ ASP ENGINE — what ASML gets paid per machine, and what moves that price ═════════════
   All numbers frozen here (€ millions unless noted). Sources:
   - Annual units / € by technology 2015–2025: ASML 20-F Note 2 (FY2019 / FY2022 / FY2025 20-F) and segment note
     (FY2017 20-F Note 21 for 2015–2016, pre-ASC 606, M&I reclassified into system sales). Compiled in
     asml-work/data/annual.json. EUV split NXE (0.33 NA) / EXE (0.55 NA High-NA) only from 2023 (EXE = 0 in 2023).
   - Consensus 2026E–2029E: Bloomberg BEst, ASML NA Equity, as of Oct 16 2026 (asml-work/data/bbg_s1.tsv, fields
     NUMBER_OF_UNITS_SOLD / AVERAGE_SALES_PRICE / SALES_REV_TURN). Fractional units = consensus averages.
   - Quarterly Q1'22–Q3'26: ASML 6-K presentations (integer % pies × net system sales = "derived"); EUV € stated on
     the Q4'25 / Q1'26 / Q2'26 calls (asml-work/data/quarterly.json).
   - Throughput: FY2025 20-F (products pp. 18–21 and sustainability section); EXE:5000 ~110 wph from the same 20-F. */

const ASP_YRS = ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','2026E','2027E','2028E','2029E'];
const ASP_EST = 11;          // first consensus year index
const ASP_NA = 11;           // number of actual years

/* 20-F actuals 2015–2025 — units and € M by family. nxe/exe only from 2023 (null before); eu = NXE+EXE. */
const ASP_A = {
  eu:   { u:[1,4,11,18,26,31,42,40,53,44,48],               e:[70.5,324.9,1084.2,1880.1,2799.7,4463.8,6284.0,7045.3,9124.0,8321.4,11602.7] },
  nxe:  { u:[null,null,null,null,null,null,null,null,53,42,44], e:[null,null,null,null,null,null,null,null,9124.0,7856.4,10445.8] },
  exe:  { u:[null,null,null,null,null,null,null,null,0,2,4],    e:[null,null,null,null,null,null,null,null,0,465.0,1156.9] },
  arfi: { u:[67,70,76,86,82,68,81,81,125,129,131],           e:[3238.5,3518.7,4028.7,4806.9,4707.7,3917.0,4959.6,5236.5,9017.4,9667.0,10311.4] },
  arfd: { u:[9,6,13,16,22,22,22,28,32,28,16],                e:[107.5,116.9,186.4,274.3,401.2,427.0,431.9,623.7,780.2,774.4,427.0] },
  krf:  { u:[74,57,71,78,65,103,131,151,184,152,78],         e:[747.7,532.7,743.5,860.1,679.7,1012.3,1321.3,1653.7,2202.5,1991.2,1001.3] },
  il:   { u:[18,20,26,26,34,34,33,45,55,65,54],              e:[73.0,78.0,99.7,98.6,133.5,146.4,142.3,211.5,278.4,369.2,307.3] },
  mi:   { u:[45,55,95,114,115,137,196,216,151,165,208],      e:[73.2,100.8,281.9,339.1,274.4,350.1,513.7,659.6,536.1,645.5,824.6] }
};
const ASP_SYS_A = [4310.4,4672.0,6424.4,8259.1,8996.2,10316.6,13652.8,15430.3,21938.6,21768.7,24474.3];   // net system sales, 20-F

/* Bloomberg consensus Oct 16 2026, 2026E–2029E (full precision as exported). */
const ASP_B = {
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
  duvU: [417,438,480,null]                                  // BBG "DUV" units row (2029E blank in the export)
};

/* Quarterly (6-K). EUV € stated on the call for Q4'25 (€3.6B), Q1'26 ("over €4.1B", a floor) and Q2'26 (€3.8B); else pie-derived. */
const ASP_QL   = ["Q1'22","Q2'22","Q3'22","Q4'22","Q1'23","Q2'23","Q3'23","Q4'23","Q1'24","Q2'24","Q3'24","Q4'24","Q1'25","Q2'25","Q3'25","Q4'25","Q1'26","Q2'26","Q3'26"];
const ASP_QSYS = [2287.2,4140.5,4254.7,4747.9,5341.8,5606.1,5308.2,5682.5,3965.9,4760.9,5926,7115.9,5740.4,5596.1,5553.8,7584,6279.4,6564.8,8373.2];
const ASP_QEUV = [594.7,1987.4,2169.9,2326.5,2884.6,2074.3,1857.9,2273,1824.3,1475.9,2074.1,2988.7,3214.6,2686.1,2110.4,3600,4100,3800,4102.9];
const ASP_QEUV_STATED = { 15:'stated €3.6B', 16:'stated "over €4.1B" (floor)', 17:'stated €3.8B' };
const ASP_QARFI_PCT = [47,33,31,31,30,49,48,38,39,50,48,41,33,43,52,40,23,29,39];
const ASP_QU_EUV  = [3,12,12,13,17,12,11,13,11,8,11,14,14,11,9,14,16,16,17];
const ASP_QU_ARFI = [18,21,20,22,25,39,32,29,20,32,38,39,25,31,38,37,17,23,40];

/* EUV generations — throughput from the FY2025 20-F; price = that year's 20-F average (ASML does not price by model). */
const ASP_GEN = [
  { g:'NXE:3400B', na:'low',  wph:100, wphTxt:'>100 (floor)', yr:'2018', asp:1880.1/18, aspTxt:'2018 EUV avg', note:'First HVM EUV tool (shipped 2017–18). wph is a floor, so €/wph is a ceiling.' },
  { g:'NXE:3400C', na:'low',  wph:null, wphTxt:'gap',        yr:'2020', asp:4463.8/31, aspTxt:'2020 EUV avg', note:'Throughput not stated in the 20-F or our other sources — no point drawn.' },
  { g:'NXE:3600D', na:'low',  wph:160, wphTxt:'160',         yr:'2022', asp:7045.3/40, aspTxt:'2022 EUV avg (blend)', note:'2022 mix of 3400C / 3600D not disclosed.' },
  { g:'NXE:3800E', na:'low',  wph:220, wphTxt:'220',         yr:'2025', asp:10445.8/44, aspTxt:'2025 NXE avg (blend)', note:'"Strong sales of the NXE:3800E" (20-F); 3600D/3800E split not disclosed.' },
  { g:'NXE:3800E + PEP-E', na:'low', wph:230, wphTxt:'230',  yr:'2025', asp:10445.8/44, aspTxt:'2025 NXE avg (blend)', note:'PEP-E software upgrade (sold as installed-base revenue).' },
  { g:'EXE:5000', na:'high',  wph:110, wphTxt:'~110',        yr:'2024', asp:465.0/2, aspTxt:'2024 EXE avg (2 tools)', note:'Only EXE:5000 could be recognized in 2024 (EXE:5200B first shipped Apr 2025).' },
  { g:'EXE:5200B', na:'high', wph:175, wphTxt:'175',         yr:'2025', asp:1156.9/4, aspTxt:'2025 EXE avg (4 tools, blend)', note:'2025 mix of EXE:5000 / 5200B not disclosed.' }
];

const ASP_COL = { eu:'#2563EB', nxe:'#5E8BEC', exe:'#1B3F94', arfi:'#3E5A82', arfd:'#93B1F0', krf:'#1E2733', il:'#A9B4C2', mi:'#C8D7F4', litho:'#7C8694' };
const ASP_SER = [   // ASP-over-time series
  { key:'eu',    label:'EUV (all)',          grp:'euv' },
  { key:'nxe',   label:'NXE / Low-NA EUV',   grp:'euv' },
  { key:'exe',   label:'EXE / High-NA EUV',  grp:'euv' },
  { key:'arfi',  label:'ArF immersion',      grp:'duv' },
  { key:'arfd',  label:'ArF dry',            grp:'duv' },
  { key:'krf',   label:'KrF',                grp:'duv' },
  { key:'il',    label:'i-line',             grp:'duv' },
  { key:'litho', label:'Lithography average',grp:'avg' },
  { key:'mi',    label:'Metrology & Insp.',  grp:'avg' }
];

/* ── derived series ── */
const aspDiv = (e,u) => (e==null || u==null || u===0) ? null : e/u;
function aspAnnual(){
  const s = {};
  ['eu','nxe','exe','arfi','arfd','krf','il','mi'].forEach(k => { s[k] = ASP_A[k].u.map((u,i)=>aspDiv(ASP_A[k].e[i], u)); });
  s.litho = ASP_SYS_A.map((t,i)=> (t - ASP_A.mi.e[i]) / (ASP_A.eu.u[i]+ASP_A.arfi.u[i]+ASP_A.arfd.u[i]+ASP_A.krf.u[i]+ASP_A.il.u[i]));
  const bmap = { eu:'eu', nxe:'low', exe:'high', arfi:'arfi', arfd:'arfd', krf:'krf', il:'il', litho:'litho' };
  Object.entries(bmap).forEach(([k,b]) => s[k] = s[k].concat(ASP_B[b].p));
  s.mi = s.mi.concat(ASP_B.mi.r.map((r,i)=>r/ASP_B.mi.u[i]));
  return s;
}
const ASP_AN = aspAnnual();

/* Family book for the bridge (lithography only; M&I is its own bar). Each year: [{u, p}] per family. */
const ASP_BF = ['nxe','exe','arfi','arfd','krf','il'];
function aspBook(i){
  const f = {};
  if(i < ASP_NA){
    ASP_BF.forEach(k => {
      let u, e;
      if(k==='nxe'){ u = ASP_A.eu.u[i] - (ASP_A.exe.u[i]||0); e = ASP_A.eu.e[i] - (ASP_A.exe.e[i]||0); }
      else if(k==='exe'){ u = ASP_A.exe.u[i]||0; e = ASP_A.exe.e[i]||0; }
      else { u = ASP_A[k].u[i]; e = ASP_A[k].e[i]; }
      f[k] = { u, p: u ? e/u : null };
    });
    return { f, mi: ASP_A.mi.e[i], sys: ASP_SYS_A[i] };
  }
  const j = i - ASP_NA, bk = { nxe:'low', exe:'high', arfi:'arfi', arfd:'arfd', krf:'krf', il:'il' };
  ASP_BF.forEach(k => f[k] = { u:ASP_B[bk[k]].u[j], p:ASP_B[bk[k]].p[j] });
  const mi = ASP_B.mi.r[j];
  return { f, mi, sys: ASP_BF.reduce((a,k)=>a+f[k].u*f[k].p,0) + mi };
}
/* Volume = (U_t − U_t−1) × average litho ASP_t−1 · Mix = Σ U_t,f × ASP_t−1,f − U_t × average ASP_t−1 ·
   Price = Σ U_t,f × (ASP_t,f − ASP_t−1,f) · M&I = Δ metrology & inspection €. A family with no prior-year price (EXE in 2024)
   is valued at its own price, so all of its revenue lands in Mix. Volume + Mix + Price + M&I = Δ net system sales exactly. */
function aspBridge(){
  const out = [];
  for(let i=1;i<ASP_YRS.length;i++){
    const a = aspBook(i-1), b = aspBook(i);
    const Ua = ASP_BF.reduce((s,k)=>s+a.f[k].u,0), Ub = ASP_BF.reduce((s,k)=>s+b.f[k].u,0);
    const La = ASP_BF.reduce((s,k)=>s+a.f[k].u*(a.f[k].p||0),0);
    const avgA = La/Ua;
    let atOld = 0, price = 0;
    ASP_BF.forEach(k => { const base = a.f[k].p!=null ? a.f[k].p : b.f[k].p; const ub=b.f[k].u;
      if(!ub) return; atOld += ub*base; price += ub*(b.f[k].p - base); });
    const vol = (Ub-Ua)*avgA, mix = atOld - Ub*avgA, mi = b.mi - a.mi;
    out.push({ y:ASP_YRS[i], est:i>=ASP_EST, prev:a.sys, cur:b.sys, d:b.sys-a.sys, vol, price, mix, mi });
  }
  return out;
}
const ASP_BR = aspBridge();

/* ═════════════ MARKUP ═════════════ */
registerView({ id:'asp', html:`
    <div class="srow" id="asp-kpis"></div>

    <div class="card">
      <div class="ch">
        <div><div class="ct">What does each machine sell for?</div>
        <div class="cs" id="asp-t-cs"></div></div>
        <div class="ctls">
          <div><span class="ctl-l">Family</span><div class="fbg" id="asp-t-fam"><button class="fb active" data-v="eu">EUV</button><button class="fb" data-v="arfi">ArFi</button><button class="fb" data-v="arfd">ArF dry</button><button class="fb" data-v="krf">KrF</button><button class="fb" data-v="il">i-line</button></div></div>
          <div><span class="ctl-l">Period</span><div class="fbg" id="asp-t-per"><button class="fb active" data-v="a">Annual</button><button class="fb" data-v="q">Quarterly</button></div></div>
        </div>
      </div>
      <div class="cb">
        <div class="leg" id="asp-t-leg"></div>
        <div class="ch-wrap"><canvas id="asp-t-chart"></canvas></div>
      </div>
      <details class="tbl"><summary>Data table &amp; method</summary><div class="tw" id="asp-t-tbl"></div><div class="snote asp-meth" id="asp-t-meth"></div></details>
      <div class="snote" id="asp-t-note"></div>
    </div>

    <div class="card">
      <div class="ch">
        <div><div class="ct">How much of the sales growth is price?</div>
        <div class="cs">Change in net system sales vs prior year, split into volume, price, mix and M&amp;I</div></div>
        <div class="ctls"><div><span class="ctl-l">Units</span><div class="fbg" id="asp-b-mode"><button class="fb active" data-v="eur">€B</button><button class="fb" data-v="pct">% of prior year</button></div></div></div>
      </div>
      <div class="cb">
        <div class="leg" id="asp-b-leg"></div>
        <div class="ch-wrap"><canvas id="asp-b-chart"></canvas></div>
      </div>
      <details class="tbl"><summary>Data table &amp; method</summary><div class="tw" id="asp-b-tbl"></div>
        <div class="snote asp-meth">Lithography families NXE, EXE, ArFi, ArF dry, KrF, i-line. <b>Volume</b> = (units<sub>t</sub> − units<sub>t−1</sub>) × average litho ASP<sub>t−1</sub>;
        <b>Mix</b> = Σ units<sub>t,f</sub> × ASP<sub>t−1,f</sub> − units<sub>t</sub> × average ASP<sub>t−1</sub>; <b>Price</b> = Σ units<sub>t,f</sub> × (ASP<sub>t,f</sub> − ASP<sub>t−1,f</sub>);
        <b>M&amp;I</b> = Δ metrology &amp; inspection €. The four add to Δ net system sales exactly. EXE has no 2023 price, so its 2024 revenue sits in Mix.
        2017 crosses the ASC 605 → 606 change (2015–16 as presented in the FY2017 20-F). 2026E+ = consensus units × ASP, which differs from Bloomberg's own Net System line (both in the table).
        Pre-2023 EUV is treated as NXE (the 20-F shows EXE = 0 in 2023). Drag to zoom · double-click resets · a hidden legend item also leaves the table and the "sum shown" row.</div>
      </details>
      <details class="tbl"><summary>Bloomberg consensus consistency checks</summary><div class="tw" id="asp-x-tbl"></div>
        <div class="snote asp-meth">Bloomberg's "EUV" row is not Low-NA + High-NA, and its "DUV" units row is not the sum of its parts; this view uses the Low-NA / High-NA and family rows.
          "Implied Low-NA ASP" = Bloomberg Low-NA revenue ÷ units, the price that reconciles units × ASP with its revenue line. Source: Bloomberg BEst, ASML NA Equity, Oct 16 2026.</div>
      </details>
      <div class="snote">Source: ASML 20-F Note 2 (FY2017–FY2025); Bloomberg consensus, Oct 16 2026 (lighter bars). 2017 crosses the ASC 606 change.</div>
    </div>

    <div class="card">
      <div class="ch">
        <div><div class="ct">Is EUV priced on productivity?</div>
        <div class="cs">Average price (€M) against flagship throughput (wafers per hour), by EUV generation</div></div>
      </div>
      <div class="cb">
        <div class="leg" id="asp-p-leg"></div>
        <div class="ch-wrap"><canvas id="asp-p-chart"></canvas></div>
      </div>
      <details class="tbl"><summary>Data table &amp; method</summary><div class="tw" id="asp-p-tbl"></div>
        <div class="snote asp-meth">Each point pairs a generation's 20-F throughput with that year's average price, which blends whatever generations were recognized (noted per row). NXE:3400C throughput is not in our sources, so it has no point.
          3400B is "&gt;100 wph", so its € per wph is a ceiling. Throughput: FY2025 20-F products pp. 18–21 and sustainability section (PEP-E 220 → 230 wph; EXE:5000 ~110 wph). Drag to zoom · double-click resets.</div>
      </details>
      <div class="snote">Source: ASML FY2025 20-F (throughput) and Note 2 (€ ÷ units). ASML does not price by model: each price is a yearly blend.</div>
    </div>
`, css:`
  #v-asp .asp-gap{color:#7C8694;font-style:italic}
  #v-asp .asp-neg{color:#DC2626} #v-asp .asp-pos{color:#16A34A}
  #v-asp .fb:disabled{opacity:.35;cursor:not-allowed}
  #v-asp .asp-meth{margin:0;border:none;border-top:1px solid #E7EAEE;border-radius:0}
`, init(){ aspInit(); } });

/* ═════════════ KPIs ═════════════ */
function aspRenderKpis(){
  const a = ASP_AN, i25 = 10;
  const q9 = (ASP_QEUV[16]+ASP_QEUV[17]+ASP_QEUV[18])/(ASP_QU_EUV[16]+ASP_QU_EUV[17]+ASP_QU_EUV[18]);
  const k = [
    ['EUV, FY2025', '€'+a.eu[i25].toFixed(1)+'M', `Low-NA €${a.nxe[i25].toFixed(0)}M · High-NA €${a.exe[i25].toFixed(0)}M`],
    ['ArF immersion, FY2025', '€'+a.arfi[i25].toFixed(1)+'M', `${sgn(a.arfi[i25]/a.arfi[9]-1)} vs 2024 · 131 units`],
    ['EUV, 9M 2026', '≈€'+q9.toFixed(0)+'M', '49 units · partly derived'],
    ['EUV consensus, 2029E', '€'+ASP_B.eu.p[3].toFixed(0)+'M', 'Bloomberg, Oct 16 2026']
  ];
  $('#asp-kpis').innerHTML = k.map(([l,v,s]) => `<div class="sc"><div class="sl">${l}</div><div class="sv">${v}</div><div class="ss">${s}</div></div>`).join('');
}

/* ═════════════ ASP OVER TIME — one family at a time ═════════════ */
const aspT = { fam:'eu', per:'a', hidden:new Set(), x:null, y:null };
let aspTChart;
const ASP_FAMN = { eu:'EUV', arfi:'ArF immersion', arfd:'ArF dry', krf:'KrF', il:'i-line' };
const ASP_QOK = { eu:1, arfi:1 };    // quarterly only where integer-% rounding stays small vs the price
function aspTData(){
  const f = aspT.fam;
  if(aspT.per==='a'){
    const ser = f==='eu'
      ? [ { key:'eu', label:'EUV (all)', color:ASP_COL.eu }, { key:'nxe', label:'Low-NA (NXE)', color:ASP_COL.nxe }, { key:'exe', label:'High-NA (EXE)', color:ASP_COL.exe } ]
      : [ { key:f, label:ASP_FAMN[f], color:ASP_COL[f] }, { key:'litho', label:'Lithography average', color:ASP_COL.litho, ref:true } ];
    return { lbl:ASP_YRS, est:ASP_EST, ser: ser.map(s=>({ ...s, v:ASP_AN[s.key] })) };
  }
  if(f==='eu'){
    const v = ASP_QEUV.map((e,i)=>e/ASP_QU_EUV[i]);
    const band = ASP_QEUV.map((e,i)=>{
      if(i===16) return [4100/ASP_QU_EUV[i], 0.665*ASP_QSYS[i]/ASP_QU_EUV[i]];          // floor .. pie upper bound
      const h = ASP_QEUV_STATED[i] ? 50 : 0.005*ASP_QSYS[i];                             // stated to €0.1B, else ±0.5pp of the pie
      return [(e-h)/ASP_QU_EUV[i], (e+h)/ASP_QU_EUV[i]]; });
    return { lbl:ASP_QL, est:99, ser:[{ key:'qeu', label:'EUV (incl. High-NA)', color:ASP_COL.eu, v, band }] };
  }
  const v = ASP_QARFI_PCT.map((p,i)=>p/100*ASP_QSYS[i]/ASP_QU_ARFI[i]);
  const band = ASP_QARFI_PCT.map((p,i)=>[(p-0.5)/100*ASP_QSYS[i]/ASP_QU_ARFI[i], (p+0.5)/100*ASP_QSYS[i]/ASP_QU_ARFI[i]]);
  return { lbl:ASP_QL, est:99, ser:[{ key:'qarfi', label:'ArF immersion', color:ASP_COL.arfi, v, band }] };
}
function aspRenderT(){
  const d = aspTData(), q = aspT.per==='q';
  let lo = 0, hi = d.lbl.length-1;
  if(aspT.x){ lo = Math.max(0, aspT.x[0]); hi = Math.min(hi, aspT.x[1]); }
  const sl = a => a.slice(lo, hi+1), lbl = sl(d.lbl);
  const vis = d.ser.filter(s=>!aspT.hidden.has(s.key));
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
  const yr = aspT.y;
  if(aspTChart) aspTChart.destroy();
  aspTChart = new Chart($('#asp-t-chart'), { data:{ labels:lbl, datasets:ds }, options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
    plugins:{ legend:{display:false}, tooltip:{ ...TIP, filter: it => !it.dataset.$band && it.parsed.y!=null,
      callbacks:{ title: it => { const i=it[0].dataIndex+lo; return d.lbl[i] + (i>=d.est ? ' — Bloomberg consensus, Oct 16 2026' : (q ? ' — 6-K, derived' : ' — 20-F')); },
        label: it => { let t = ` ${it.dataset.label}: €${it.parsed.y.toFixed(1)}M`;
          if(q){ const s = vis.find(x=>x.label===it.dataset.label), i=it.dataIndex+lo; if(s && s.band) t += `  (range €${s.band[i][0].toFixed(0)}–${s.band[i][1].toFixed(0)}M)`;
            if(s && s.key==='qeu' && ASP_QEUV_STATED[i]) t += ' · ' + ASP_QEUV_STATED[i]; }
          return t; } } } },
    scales:{ x:{ grid:{display:false} },
      y:{ grid:{color:'#EEF1F5'}, beginAtZero:!yr, title:{display:true,text:'€ millions per system'}, ticks:{ callback: v => '€'+v+'M' },
        min: yr?yr[0]:undefined, max: yr?yr[1]:undefined } } } });
  aspTChart.$lo = lo;
  legend($('#asp-t-leg'), d.ser.map(s=>({key:s.key, label:s.label, color:s.color, line:true, dash:!!s.ref})), aspT.hidden, aspRenderT);

  const f = x => x==null ? '—' : x.toFixed(1);
  const rows = [];
  vis.forEach(s => { rows.push([s.label + ' (€M)', sl(s.v)]);
    if(s.band){ rows.push(['— band low', sl(s.band.map(b=>b[0]))]); rows.push(['— band high', sl(s.band.map(b=>b[1]))]); } });
  if(q && aspT.fam==='eu') rows.push(['EUV units', sl(ASP_QU_EUV)], ['EUV € M', sl(ASP_QEUV)]);
  if(q && aspT.fam==='arfi') rows.push(['ArFi units', sl(ASP_QU_ARFI)], ['ArFi € M (derived)', sl(ASP_QARFI_PCT.map((p,i)=>p/100*ASP_QSYS[i]))]);
  $('#asp-t-tbl').innerHTML = `<table><thead><tr><th>${q?'Quarter':'Year'}</th>${lbl.map((l,i)=>`<th class="${(i+lo)>=d.est?'est':''}">${l}</th>`).join('')}</tr></thead><tbody>` +
    rows.map(([n,a]) => `<tr><td>${n}</td>${a.map((x,i)=>`<td class="${(i+lo)>=d.est?'est':''}">${Number.isInteger(x)?x:f(x)}</td>`).join('')}</tr>`).join('') + '</tbody></table>';

  $('#asp-t-cs').textContent = q ? `${ASP_FAMN[aspT.fam]} · € millions per system · Q1'22–Q3'26, derived from 6-K pies (band = rounding)`
    : `${ASP_FAMN[aspT.fam]} · € millions per system · 2015–2025 actual, 2026E–2029E consensus (dashed)`;
  $('#asp-t-note').innerHTML = q
    ? `Source: ASML quarterly 6-K presentations; EUV € stated on the Q4'25–Q2'26 calls. Whole-percent pies → shaded rounding band.`
    : `Source: ASML 20-F Note 2 (€ ÷ units, new + used); Bloomberg consensus, Oct 16 2026. 2015–16 are pre-ASC 606.`;
  $('#asp-t-meth').innerHTML = q
    ? `Quarterly ASP = technology € ÷ units recognized. ASML prints whole-percent shares of net system sales, so each € carries ±0.5pp of system sales (the band). EUV € for Q4'25 (€3.6B) and Q2'26 (€3.8B) are stated on the call (±€50M rounding); Q1'26 is "over €4.1B" (band from that floor to the pie's upper bound). EUV includes High-NA (2 in Q4'24, 2 in Q4'25, 2 in Q1'26, 1 in Q2'26; not stated for other 2025–26 quarters). Quarterly is offered only for EUV and ArFi: for ArF dry, KrF and i-line the rounding error is 10–50% of the price.`
    : `ASP = € ÷ units recognized (new + used). EUV (all) = NXE + EXE; the split starts in 2023 (EXE = 0 that year). 2015 EUV is a single unit. 2015–16 are pre-ASC 606 as presented in the FY2017 20-F. Lithography average = (system sales − M&amp;I) ÷ litho units. 2026E+ = Bloomberg AVERAGE_SALES_PRICE (BEst); its "EUV (all)" equals its Low-NA figure in 2026E — see the consistency checks under the bridge. Drag to zoom on both axes · double-click resets · a hidden legend item also leaves this table. Sources: 20-F Note 2 of FY2017 (2015–16), FY2019 (2017–19), FY2022 (2020–22), FY2025 (2023–25).`;
}
function aspSyncPer(){
  const qb = $('#asp-t-per .fb[data-v="q"]'); qb.disabled = !ASP_QOK[aspT.fam];
  qb.title = qb.disabled ? 'Quarterly ASP only for EUV and ArFi (rounding error too large for the others)' : '';
  if(qb.disabled && aspT.per==='q'){ aspT.per='a'; $$('#asp-t-per .fb').forEach(b=>b.classList.toggle('active', b.dataset.v==='a')); }
}

/* ═════════════ BRIDGE ═════════════ */
const ASP_BS = [
  { key:'vol',   label:'Volume',  color:'#2563EB' },
  { key:'price', label:'Price',   color:'#1B3F94' },
  { key:'mix',   label:'Mix',     color:'#93B1F0' },
  { key:'mi',    label:'M&I',     color:'#A9B4C2' }
];
const aspB = { mode:'eur', hidden:new Set(), x:null, y:null };
let aspBChart;
function aspRenderB(){
  const pc = aspB.mode==='pct';
  const val = (r,k) => pc ? r[k]/r.prev*100 : r[k]/1000;
  let lo = 0, hi = ASP_BR.length-1;
  if(aspB.x){ lo = Math.max(0,aspB.x[0]); hi = Math.min(hi,aspB.x[1]); }
  const R = ASP_BR.slice(lo, hi+1);
  const vis = ASP_BS.filter(s=>!aspB.hidden.has(s.key));
  const ds = vis.map(s => ({ type:'bar', label:s.label, data:R.map(r=>val(r,s.key)), stack:'b',
    backgroundColor:R.map(r=> r.est ? s.color+'66' : s.color), borderColor:s.color, borderWidth:R.map(r=>r.est?1:0), order:2, barPercentage:.7 }));
  if(!aspB.hidden.has('d')) ds.push({ type:'line', label:'Δ net system sales', data:R.map(r=>val(r,'d')), borderColor:'#1E2733', backgroundColor:'#1E2733',
    showLine:false, pointRadius:4, pointStyle:'rectRot', pointBackgroundColor:R.map(r=>r.est?'#fff':'#1E2733'), order:1 });
  const yr = aspB.y, u = pc ? '%' : 'B';
  const fmt = y => (y>=0?'+':'−') + (pc ? Math.abs(y).toFixed(1)+'%' : '€'+Math.abs(y).toFixed(2)+'B');
  if(aspBChart) aspBChart.destroy();
  aspBChart = new Chart($('#asp-b-chart'), { data:{ labels:R.map(r=>r.y), datasets:ds }, options:{
    responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
    plugins:{ legend:{display:false}, tooltip:{ ...TIP, callbacks:{
      title: it => { const r=R[it[0].dataIndex]; return r.y + ' vs ' + (+r.y.slice(0,4)-1) + (r.est?' — Bloomberg units × ASP, Oct 16 2026':' — 20-F'); },
      label: it => ` ${it.dataset.label}: ${fmt(it.parsed.y)}`,
      footer: it => { const r=R[it[0].dataIndex]; const sh = vis.reduce((a,s)=>a+val(r,s.key),0);
        return `Sum shown: ${fmt(sh)} · system sales €${(r.prev/1000).toFixed(1)}B → €${(r.cur/1000).toFixed(1)}B`; } } } },
    scales:{ x:{ stacked:true, grid:{display:false} },
      y:{ stacked:true, grid:{color:'#EEF1F5'}, title:{display:true,text: pc ? '% of prior-year net system sales' : '€ billions'},
        ticks:{ callback: x => pc ? x+'%' : '€'+x+'B' }, min:yr?yr[0]:undefined, max:yr?yr[1]:undefined } } } });
  aspBChart.$lo = lo;
  legend($('#asp-b-leg'), ASP_BS.concat([{key:'d', label:'Δ net system sales', color:'#1E2733'}]), aspB.hidden, aspRenderB);

  const est = new Set(R.map((r,i)=>r.est?i+1:-1));
  const f = x => pc ? (x>=0?'+':'')+x.toFixed(1)+'%' : (x>=0?'+':'')+x.toFixed(2);
  const rows = [
    ['Net system sales, prior year (€B)', R.map(r=>(r.prev/1000).toFixed(2))],
    ['Net system sales (€B)', R.map(r=>(r.cur/1000).toFixed(2))],
    ...(aspB.hidden.has('d') ? [] : [['Δ net system sales', R.map(r=>f(val(r,'d')))]]),
    ...vis.map(s => [s.label, R.map(r=>f(val(r,s.key)))]),
    ['<b>Sum shown</b>', R.map(r=>'<b>'+f(vis.reduce((a,s)=>a+val(r,s.key),0))+'</b>')],
    ['Bloomberg "Net System" line (€B)', R.map(r=> r.est ? (ASP_B.sys[ASP_YRS.indexOf(r.y)-ASP_EST]/1000).toFixed(2) : '—')]
  ];
  $('#asp-b-tbl').innerHTML = table([pc?'% of prior-year sales':'€B'].concat(R.map(r=>r.y)), rows.map(([n,a])=>[n].concat(a)), est);
}

/* ═════════════ PRICE vs PRODUCTIVITY ═════════════ */
const aspP = { hidden:new Set(), x:null, y:null };
let aspPChart;
function aspRenderP(){
  const grp = [ { key:'low', label:'Low-NA (NXE, 0.33 NA)', color:'#2563EB' }, { key:'high', label:'High-NA (EXE, 0.55 NA)', color:'#1B3F94' } ];
  const vis = grp.filter(g=>!aspP.hidden.has(g.key));
  const ds = vis.map(g => { const pts = ASP_GEN.filter(r=>r.na===g.key && r.wph!=null);
    return { type:'scatter', label:g.label, data:pts.map(r=>({x:r.wph, y:r.asp, r})), backgroundColor:g.color, borderColor:g.color, pointRadius:6, pointHoverRadius:8, showLine:true, borderWidth:1, borderDash:[3,3] }; });
  const xr = aspP.x, yr = aspP.y;
  if(aspPChart) aspPChart.destroy();
  aspPChart = new Chart($('#asp-p-chart'), { data:{ datasets:ds }, options:{ responsive:true, maintainAspectRatio:false, animation:false,
    plugins:{ legend:{display:false}, tooltip:{ ...TIP, callbacks:{
      title: it => it[0].raw.r.g,
      label: it => { const r=it.raw.r; return [` ${r.wphTxt} wph · €${r.asp.toFixed(1)}M (${r.aspTxt})`, ` €${(r.asp/r.wph).toFixed(2)}M per wafer-per-hour${r.wph===100?' (ceiling)':''}`]; } } } },
    scales:{ x:{ type:'linear', min:xr?xr[0]:80, max:xr?xr[1]:250, grid:{color:'#EEF1F5'}, title:{display:true,text:'flagship throughput, wafers per hour'} },
      y:{ min:yr?yr[0]:50, max:yr?yr[1]:320, grid:{color:'#EEF1F5'}, title:{display:true,text:'average price, € millions'}, ticks:{callback:v=>'€'+v+'M'} } } } });
  aspPChart.$lo = 0;
  legend($('#asp-p-leg'), grp, aspP.hidden, aspRenderP);
  const rows = ASP_GEN.filter(r=>!aspP.hidden.has(r.na)).map(r => [ `<b>${r.g}</b>`, r.wph==null ? '<span class="asp-gap">gap</span>' : r.wphTxt,
    '€'+r.asp.toFixed(1)+'M', r.aspTxt, r.wph==null ? '<span class="asp-gap">—</span>' : (r.wph===100?'&lt; ':'') + '€'+(r.asp/r.wph).toFixed(2)+'M', `<span style="white-space:normal">${r.note}</span>` ]);
  $('#asp-p-tbl').innerHTML = table(['Generation','wph','Avg price','Price basis','€ per wph','Note'], rows);
}

/* ═════════════ BLOOMBERG INCONSISTENCIES ═════════════ */
function aspRenderX(){
  const B = ASP_B, n = [0,1,2,3];
  const blend = n.map(j => (B.low.u[j]*B.low.p[j] + B.high.u[j]*B.high.p[j]) / (B.low.u[j]+B.high.u[j]));
  const duvSum = n.map(j => B.arfi.u[j]+B.arfd.u[j]+B.krf.u[j]+B.il.u[j]);
  const uxp = n.map(j => ['low','high','arfi','arfd','krf','il'].reduce((a,k)=>a+B[k].u[j]*B[k].p[j],0) + B.mi.r[j]);
  const g = (a,d=1) => a.map(x => x==null ? '—' : x.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d}));
  const diff = (a,b,d=0) => a.map((x,i)=> b[i]==null||x==null ? '—' : `<span class="${x-b[i]>=0?'asp-pos':'asp-neg'}">${x-b[i]>=0?'+':'−'}${Math.abs(x-b[i]).toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d})}</span>`);
  const sec = t => [`<b>${t}</b>`,'','','',''];
  const rows = [
    sec('1 · "EUV" ASP vs its parts'),
    ['BBG EUV ASP', ...g(B.eu.p)], ['BBG Low-NA ASP', ...g(B.low.p)],
    ['Low + High blended ASP', ...g(blend)], ['EUV row − blend', ...diff(B.eu.p, blend, 1)],
    sec('2 · EUV units and revenue'),
    ['BBG EUV units', ...g(B.eu.u)], ['Low-NA + High-NA units', ...g(n.map(j=>B.low.u[j]+B.high.u[j]))],
    ['BBG EUV revenue', ...g(B.eu.r,0)], ['Low-NA + High-NA revenue', ...g(n.map(j=>B.low.r[j]+B.high.r[j]),0)],
    sec('3 · Low-NA: units × ASP vs revenue'),
    ['Low-NA units × ASP', ...g(n.map(j=>B.low.u[j]*B.low.p[j]),0)], ['BBG Low-NA revenue', ...g(B.low.r,0)],
    ['Implied Low-NA ASP (rev ÷ units)', ...g(n.map(j=>B.low.r[j]/B.low.u[j]))],
    sec('4 · Net system sales'),
    ['Σ units × ASP + M&I', ...g(uxp,0)], ['BBG Net System line', ...g(B.sys,0)], ['Gap', ...diff(uxp, B.sys, 0)],
    sec('5 · DUV units'),
    ['BBG DUV units row', ...g(B.duvU,0)], ['ArFi + ArF dry + KrF + i-line', ...g(duvSum,0)]
  ];
  $('#asp-x-tbl').innerHTML = table(['Bloomberg check','2026E','2027E','2028E','2029E'], rows, new Set([1,2,3,4]));
}

/* ═════════════ WIRING ═════════════ */
function aspInit(){
  aspRenderKpis(); aspSyncPer(); aspRenderT(); aspRenderB(); aspRenderP(); aspRenderX();
  attachZoom(() => aspTChart, r => { if(!r){ aspT.x=null; aspT.y=null; } else { if(r.x) aspT.x=r.x; if(r.y) aspT.y=r.y; } aspRenderT(); });
  attachZoom(() => aspBChart, r => { if(!r){ aspB.x=null; aspB.y=null; } else { if(r.x) aspB.x=r.x; if(r.y) aspB.y=r.y; } aspRenderB(); });
  attachZoom(() => aspPChart, r => { if(!r){ aspP.x=null; aspP.y=null; } else { if(r.x) aspP.x=[r.x[0],r.x[1]]; if(r.y) aspP.y=r.y; } aspRenderP(); });
}
pills('#asp-t-fam', v => { aspT.fam=v; aspT.hidden.clear(); aspT.x=null; aspT.y=null; aspSyncPer(); if(aspTChart) aspRenderT(); });
pills('#asp-t-per', v => { aspT.per=v; aspT.hidden.clear(); aspT.x=null; aspT.y=null; if(aspTChart) aspRenderT(); });
pills('#asp-b-mode', v => { aspB.mode=v; aspB.y=null; if(aspBChart) aspRenderB(); });
