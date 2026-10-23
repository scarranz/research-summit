/* ═════════════ REVENUE MODEL (rev) ═════════════
   How units × ASP by family + Metrology & Inspection + Installed Base Management add up to ASML's revenue,
   and what the scenarios imply to 2030. Every number is frozen here; sources next to each constant. */

registerView({ id:'rev', html:`
    <div class="srow" id="rev-kpis"></div>

    <div class="card">
      <div class="ch">
        <div><div class="ct">How the revenue adds up</div>
        <div class="cs">EUV + DUV (units × ASP) + Metrology &amp; Inspection + Installed Base Mgmt · €B · 2026E–2029E = Bloomberg consensus</div></div>
        <div class="ctls"><span><span class="ctl-l">Show</span><div class="fbg" id="rev-b-mode"><button class="fb active" data-m="eur">€B</button><button class="fb" data-m="shr">% of total</button></div></span></div>
      </div>
      <div class="leg" id="rev-b-leg"></div>
      <div class="ch-wrap"><canvas id="rev-b-chart"></canvas></div>
      <details class="tbl"><summary>Data table — by group and by family</summary><div class="tw" id="rev-b-tbl"></div><div class="tw" id="rev-b-fam"></div></details>
      <details class="tbl"><summary>Reconciliation — Bloomberg revenue rows vs units × ASP</summary><div class="tw" id="rev-r-tbl"></div>
        <div class="rev-dn">Bloomberg's own "EUV" row is not Low-NA + High-NA, so the build uses the Low-NA / High-NA rows; its "DUV" unit row does not equal its parts either.
        Units × ASP runs above Bloomberg's rows in 2028–29 (net system sales +€2.0B / +€2.4B), almost all Low-NA (Low-NA ASP that would close it: ~€273M in 2028, ~€288M in 2029).
        Bloomberg fields: Revenue Breakdown ▸ Shipment Value, Units Shipped, Shipment ASP; Net Service &amp; Field Option; IS_COMP_SALES.</div></details>
      <div class="snote">Source: ASML FY2025 20-F Note 2 (2025A); Bloomberg consensus, Oct 16 2026 (estimates, rebuilt as units × ASP).<br>The dashed line is Bloomberg's revenue row; the gap to the bars is in the reconciliation.</div>
    </div>

    <div class="card">
      <div class="ch">
        <div><div class="ct">Scenarios to 2030</div>
        <div class="cs" id="rev-s-desc"></div></div>
        <div class="ctls"><span><span class="ctl-l">Preset</span><div class="fbg" id="rev-s-pre">
          <button class="fb" data-v="bbg">Consensus</button><button class="fb" data-v="Bear">Bear</button><button class="fb active" data-v="Base">Base</button><button class="fb" data-v="Bull">Bull</button>
        </div></span></div>
      </div>
      <div class="leg" id="rev-s-leg"></div>
      <div class="ch-wrap"><canvas id="rev-s-chart"></canvas></div>
      <details class="tbl"><summary>Edit the drivers — units, ASP (€M per system), M&amp;I and IBM growth</summary><div class="rev-dn" id="rev-s-long" style="border-top:none;border-bottom:1px solid var(--bdr)"></div><div class="tw rev-in" id="rev-s-in"></div></details>
      <details class="tbl"><summary>Data table — your scenario vs references</summary><div class="tw" id="rev-s-tbl"></div></details>
      <details class="tbl"><summary>Investor Day 2030 model vs consensus</summary><div class="tw" id="rev-cmd-tbl"></div><div class="rev-dn" id="rev-cmd-note"></div></details>
      <details class="tbl"><summary>Assumption notes for each driver (Projection sheet, verbatim)</summary><div class="tw" id="rev-s-notes"></div>
        <div class="rev-dn">Bear / Base / Bull = the three scenarios of the <b>Projection</b> sheet in ASML_DCF_inputs.xlsx (generator <code>asml-work/data/add_projection.ps1</code>). 2026 is anchored to 9M actuals (6-K) + the Q4'26 guide: M&amp;I €924M = 9M €574M + ~€350M; IBM €12,238M = 9M €8,538M + ~€3.7B.
        The Consensus preset = Bloomberg units and ASP (Oct 16 2026), with M&amp;I and IBM growth implied by its rows; it has no 2030. Investor Day 2030 = Nov 14 2024 (low €44B / moderate €52B / high €60B; GM 56–60%).
        Non-EUV in the Investor Day table = DUV lithography + M&amp;I, as ASML groups it; Bloomberg 2029E parts (Low-NA + High-NA rows) sum to €79.5B vs its €79.7B revenue row.</div></details>
      <div class="snote">Source: Projection sheet (ASML_DCF_inputs.xlsx); Bloomberg consensus, Oct 16 2026; ASML Investor Day, Nov 14 2024.<br>Comparison lines are the presets as defined, before your edits.</div>
    </div>

    <div class="card">
      <div class="ch">
        <div><div class="ct">History — systems vs Installed Base Mgmt</div>
        <div class="cs">€B (bars) · IBM % of sales (line) · 2026E = 9M actual + Q4 guide midpoint</div></div>
      </div>
      <div class="leg" id="rev-h-leg"></div>
      <div class="ch-wrap"><canvas id="rev-h-chart"></canvas></div>
      <details class="tbl"><summary>Data table</summary><div class="tw" id="rev-h-tbl"></div>
        <div class="rev-dn">2015–2016 are pre-ASC 606, as restated in the FY2017 20-F (M&amp;I moved from service into system sales; totals unchanged). 2026E = Q1–Q3 2026 6-K (€29.76B, IBM €8.54B) + Q4'26 guide midpoint €14.7B (IBM ~€3.7B).</div></details>
      <div class="snote">Source: ASML 20-F FY2015–FY2025 statements of operations; Q3'26 6-K and Q4'26 guide (Oct 14 2026).</div>
    </div>
`, css:`
#v-rev .rev-dn{font-size:11px;color:var(--mu);line-height:1.55;padding:10px 13px;background:var(--w);border-top:1px solid var(--bdr)}
#v-rev .rev-in table{font-size:11.5px}
#v-rev .rev-in td,#v-rev .rev-in th{padding:3px 8px}
#v-rev .rev-in td.g{background:var(--pale);font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.06em;padding-top:7px}
#v-rev .rev-in input{width:70px;font:inherit;font-size:11.5px;text-align:right;border:1px solid var(--bdr);border-radius:6px;padding:3px 5px;color:var(--accent);background:#fff;font-variant-numeric:tabular-nums}
#v-rev .rev-in input:focus{outline:none;border-color:var(--accent)}
#v-rev .rev-in input.ed{background:#EAF0FD;border-color:#93B1F0}
#v-rev .rev-in .u{color:var(--mu);font-size:10px}
#v-rev .rev-in tr.out td{font-weight:600;border-top:1px solid var(--bdr)}
#v-rev tr.tot td{font-weight:600;border-top:1px solid var(--bdr)}
#v-rev td.neg{color:var(--neg)} #v-rev td.pos{color:var(--pos)}
#v-rev #rev-b-fam table{border-top:1px solid var(--bdr)}
`, init(){ revInit(); } });

/* ═════════════ DATA (frozen) ═════════════ */
const REV_YRS = ['2025A','2026E','2027E','2028E','2029E'];
/* Families. u/asp 2026E–2029E: Bloomberg consensus Oct 16 2026 (asml-work/data/bbg_s1.tsv, Revenue Breakdown ▸ Units Shipped / Shipment ASP).
   bbgE = Bloomberg Shipment Value row (€M). a25 = FY2025 20-F Note 2 (units, €M; EUV 0.33 NA = NXE, High-NA = EXE). */
const REV_FAM = [
  { k:'hna',  n:'High-NA EUV', c:'#1B3F94', a25:[4,1156.9],     u:[4.9393,5.3536,7.8135,12.3636],      asp:[355.9738,400.2747,399.0227,420.3417], bbgE:[1746.85,1939.9488,2978.3776,4879.1137] },
  { k:'euv',  n:'EUV (0.33 NA)',c:'#2563EB', a25:[44,10445.8],   u:[65.1369,88.0317,112.0727,111.1667], asp:[240.7068,255.3237,277.8857,300.1381], bbgE:[15868.2741,22548.8125,30590.4729,31981.0401] },
  { k:'arfi', n:'ArFi',        c:'#3E5A82', a25:[131,10311.4],  u:[132.1944,167.0632,206.0513,207.6],  asp:[84.0865,86.432,88.5145,92.0516],     bbgE:[11090.6109,14429.7907,18268.4271,19179.3514] },
  { k:'dry',  n:'ArF dry',     c:'#93B1F0', a25:[16,427.0],     u:[35.6667,44.4667,48.6429,47.375],    asp:[29.3377,29.7028,30.361,31.6928],     bbgE:[1033.5939,1277.9681,1442.4728,1493.0757] },
  { k:'krf',  n:'KrF',         c:'#1E2733', a25:[78,1001.3],    u:[142.6121,151.7455,162.7143,164.495],asp:[12.5484,13.3102,13.3239,13.5684],    bbgE:[1777.9251,2008.4373,2138.2779,2235.7757] },
  { k:'iline',n:'i-line',      c:'#A9B4C2', a25:[54,307.3],     u:[59.8571,69.4267,75.564,73.22],      asp:[5.3823,5.425,5.518,5.8169],          bbgE:[331.7533,375.3942,391.1259,435.2798] }
];
const REV_MI  = { c:'#C8D7F4', a25:824.6,  bbg:[986.9221,1308.3317,1463.1094,1599.3187] };      // M&I: 20-F Note 2 / BBG Shipment Value
const REV_IBM = { c:'#5E8BEC', a25:8193.0, bbg:[11949.5496,14368.7988,16597.6863,17683.2799] };  // Net Service & Field Option
const REV_BBG_SYS = [24474.3,32496.5877,43360.2579,56014.0337,60992.9268];   // BBG Net System Shipment Value (2025 = actual)
const REV_BBG_TOT = [32667,44444.0889,57736.1628,72319.8889,79739.7273];      // BBG IS_COMP_SALES (2025 = actual)
const REV_BBG_GM  = [52.8,55.5396,57.0583,58.2241,59.3962];                   // BBG IS_COMP_GROSS_MARGIN_PERCENTAGE

/* History: 20-F consolidated statements of operations (asml-work/data/annual.json), € millions. 2026 = 9M 6-K + Q4 guide midpoint. */
const REV_H_LBL = ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','2026E'];
const REV_H_TOT = [6287.4,6794.8,8962.7,10944.0,11820.0,13978.5,18611.0,21173.4,27558.5,28262.9,32667.3,44455.0];
const REV_H_IBM = [1977.0,2122.8,2538.3,2684.9,2823.8,3661.9,4958.2,5743.1,5619.9,6494.2,8193.0,12238.0];
// 2026E: Q1–Q3 total 8,767 + 9,326 + 11,662 = 29,755 (+ Q4 mid 14,700); IBM 2,487.5 + 2,761.7 + 3,288.8 = 8,538 (+ ~3,700)

/* Investor Day Nov 14 2024 (targets.json cmd_2024_11_14) — 2030 scenarios, € billions */
const REV_CMD = { low:{euv:22,non:11,ibm:11,tot:44}, mod:{euv:26,non:14,ibm:12,tot:52}, high:{euv:32,non:15,ibm:13,tot:60}, gm:[56,60] };

/* Scenario drivers 2026–2030 — copied from add_projection.ps1 ($DRV). mi/ibm: [2026 level €M, then % YoY ×4].
   2026 M&I = 9M (125.6 + 196.9 + 251.2) + 350 = 924; IBM = 9M (2,487.5 + 2,761.7 + 3,288.8) + 3,700 = 12,238. */
const REV_DRV = [
  { k:'lowna_u', g:'euv', l:'Low-NA EUV units', unit:'units', d:1, fam:'euv', p:'u',
    n:'Base = ASML capacity (Q3 26 call: ~65 in 2026, +30% for 2027 = ~85, a further ~+30% under study for 2028 = ~110), haircut on 2028; Bull = BBG units; Bear = AI capex pause',
    Bear:[65,72,65,65,70], Base:[65,85,100,105,110], Bull:[66,88,112,120,125] },
  { k:'lowna_asp', l:'Low-NA EUV ASP', unit:'€M', d:1, fam:'euv', p:'asp', n:'9M26 EUV ASP 245 incl. High-NA; NXE:3800E mix, then NXE:4000F. BBG low-NA ASP 241/255/278/300',
    Bear:[237,248,252,256,260], Base:[239,255,268,280,290], Bull:[241,258,278,300,310] },
  { k:'hna_u', l:'High-NA units', unit:'units', d:1, fam:'hna', p:'u', n:'Intel now; Samsung HVM 2028; TSMC HVM 2030 (Q3 26 call). Capacity 20/yr set in 2022 for 2027-28. BBG 4.9/5.4/7.8/12.4',
    Bear:[5,5,6,8,10], Base:[5,6,9,14,20], Bull:[5,7,10,16,22] },
  { k:'hna_asp', l:'High-NA ASP', unit:'€M', d:1, fam:'hna', p:'asp', n:'EXE:5200B; BBG 356/400/399/420',
    Bear:[355,360,370,380,390], Base:[360,380,390,400,410], Bull:[365,400,400,420,430] },
  { k:'arfi_u', g:'duv', l:'ArFi units', unit:'units', d:1, fam:'arfi', p:'u', n:'9M26 = 80; +30% ArFi capacity for 2027 (Q3 26 call). Bear = China normalisation. BBG 132/167/206/208',
    Bear:[131,120,105,110,120], Base:[132,160,175,180,185], Bull:[134,167,206,208,210] },
  { k:'arfi_asp', l:'ArFi ASP', unit:'€M', d:1, fam:'arfi', p:'asp', n:'9M26 82.7; BBG 84/86/89/92',
    Bear:[83,84,85,86,87], Base:[83.2,86,88,90,92], Bull:[83.5,87,89,92,94] },
  { k:'dry_u', l:'ArF dry units', unit:'units', d:1, fam:'dry', p:'u', n:'9M26 = 23. BBG 36/44/49/47',
    Bear:[32,28,24,24,26], Base:[33,38,42,44,45], Bull:[34,44,49,48,50] },
  { k:'dry_asp', l:'ArF dry ASP', unit:'€M', d:1, fam:'dry', p:'asp', n:'9M26 27.8; BBG 29/30/30/32',
    Bear:[27.6,28,28.5,29,29.5], Base:[27.8,29.5,30,30.5,31], Bull:[28,30,30.5,31.5,32] },
  { k:'krf_u', l:'KrF units', unit:'units', d:1, fam:'krf', p:'u', n:'9M26 = 100; most China-exposed line. BBG 143/152/163/164',
    Bear:[138,110,95,95,100], Base:[140,145,150,150,155], Bull:[142,152,163,165,170] },
  { k:'krf_asp', l:'KrF ASP', unit:'€M', d:1, fam:'krf', p:'asp', n:'9M26 11.9; BBG 12.5/13.3/13.3/13.6',
    Bear:[11.9,12.5,12.5,12.7,12.9], Base:[11.9,13,13.2,13.4,13.6], Bull:[12,13.3,13.5,13.8,14] },
  { k:'iline_u', l:'i-line units', unit:'units', d:1, fam:'iline', p:'u', n:'9M26 = 39. BBG 60/69/76/73',
    Bear:[53,48,42,42,45], Base:[54,60,62,62,64], Bull:[55,69,76,73,75] },
  { k:'iline_asp', l:'i-line ASP', unit:'€M', d:1, fam:'iline', p:'asp', n:'9M26 5.4; BBG 5.4/5.4/5.5/5.8',
    Bear:[5.4,5.3,5.3,5.4,5.5], Base:[5.4,5.4,5.5,5.6,5.7], Bull:[5.4,5.5,5.6,5.8,6.0] },
  { k:'mi_g', g:'oth', l:'M&I', unit:'€M → %', d:1, n:'2026 = 9M actual + ~€350m Q4. Investor Day: holistic litho >15% CAGR. BBG +33%/+12%/+9%',
    Bear:[924,5,0,5,8], Base:[924,20,15,15,15], Bull:[924,32,12,12,15] },
  { k:'ibm_g', l:'Installed Base Mgmt', unit:'€M → %', d:1, n:'2026 = 9M actual + Q4 guide ~€3.7bn. Investor Day 2030: €11-13bn (already reached). BBG 14.4/16.6/17.7bn',
    Bear:[12238,5,2,4,5], Base:[12238,15,12,10,8], Bull:[12238,18,15,8,8] }
];
/* Bloomberg preset: units/ASP straight from consensus, M&I / IBM growth implied by its rows; no 2030 (null). */
(function revBbgPreset(){
  const g = a => [a[0], (a[1]/a[0]-1)*100, (a[2]/a[1]-1)*100, (a[3]/a[2]-1)*100, null];
  REV_DRV.forEach(d => {
    if(d.fam){ const f = REV_FAM.find(x=>x.k===d.fam); d.bbg = [...f[d.p], null]; }
    else d.bbg = g(d.k==='mi_g' ? REV_MI.bbg : REV_IBM.bbg);
  });
})();
const REV_PRE_DESC = {
  bbg:'<b>Bloomberg consensus (Oct 16 2026).</b> Consensus units and ASP per family for 2026–2029; M&amp;I and IBM grow at the rates implied by Bloomberg\'s own rows (IBM 2026 €11.95B, below the 9M actual + Q4 guide of ~€12.2B). No 2030 column in the consensus.',
  Bear:'<b>Bear (Projection sheet).</b> Low-NA EUV = "AI capex pause": 65 / 72 / 65 / 65 / 70 units. ArFi = "China normalisation": 131 → 105 units in 2028. KrF 138 → 95, i-line 53 → 42. ASP a little below consensus. M&amp;I +5 / 0 / +5 / +8%, IBM +5 / +2 / +4 / +5% a year.',
  Base:'<b>Base (Projection sheet).</b> Low-NA EUV = ASML capacity (Q3\'26 call: ~65 in 2026, +30% for 2027 = ~85, a further ~+30% under study for 2028 = ~110), with a haircut on 2028: 65 / 85 / 100 / 105 / 110. High-NA 5 → 20 (Samsung HVM 2028, TSMC HVM 2030). ArFi 132 → 185. M&amp;I +20 / +15 / +15 / +15%, IBM +15 / +12 / +10 / +8%.',
  Bull:'<b>Bull (Projection sheet).</b> Low-NA EUV = "BBG units": 66 / 88 / 112 / 120 / 125. Other families at or near consensus units (ArFi 134 → 210), ASP at or above consensus (Low-NA €310M by 2030). M&amp;I +32 / +12 / +12 / +15%, IBM +18 / +15 / +8 / +8%.'
};
const REV_PRE_SHORT = {
  bbg:'Bloomberg units × ASP to 2029 · total net sales, €B',
  Bear:'Bear: AI capex pause, China normalisation · total net sales, €B',
  Base:'Base: ASML capacity path, 2028 haircut · total net sales, €B',
  Bull:'Bull: Bloomberg units, ASP above consensus · total net sales, €B'
};
const REV_SCEN_COL = { Bear:'#A9B4C2', Base:'#3E5A82', Bull:'#1B3F94', bbg:'#1E2733', mine:'#2563EB', cmd:'#C8D7F4' };

/* ═════════════ ENGINE ═════════════ */
// vals = { key: [5 numbers 2026..2030] } → per-year build (€M), null where any input is missing
function revCompute(vals){
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
const revPresetVals = p => Object.fromEntries(REV_DRV.map(d => [d.k, (p==='bbg' ? d.bbg : d[p]).slice()]));
const REV_REF = Object.fromEntries(['bbg','Bear','Base','Bull'].map(p => [p, revCompute(revPresetVals(p))]));

/* ═════════════ KPIs ═════════════ */
function revKpis(){
  const k = [
    ['FY2025 net sales', '€32.7B', '20-F actual'],
    ['FY2026 guide', '€44–45B', 'consensus €44.4B'],
    ['2029E consensus', fmtB(REV_BBG_TOT[4]), `Bloomberg, GM ${REV_BBG_GM[4].toFixed(1)}%`],
    ['Investor Day 2030', '€44–60B', 'GM 56–60% (Nov 2024)']
  ];
  $('#rev-kpis').innerHTML = k.map(([l,v,s]) => `<div class="sc"><div class="sl">${l}</div><div class="sv">${v}</div><div class="ss">${s}</div></div>`).join('');
}

/* ═════════════ THE BUILD ═════════════ */
const revB = { mode:'eur', hidden:new Set(), x:null, y:null };
let revBChart;
const revFamE = f => [f.a25[1], ...f.u.map((u,i)=>u*f.asp[i])];          // €M per year, 2025A + units × ASP
const revSumFam = keys => REV_YRS.map((_,i)=>REV_FAM.filter(f=>keys.includes(f.k)).reduce((a,f)=>a+revFamE(f)[i],0));
const REV_B_SER = [   // grouped (v3: never all six families in one chart)
  { key:'euv', label:'EUV (Low-NA + High-NA)',          color:'#2563EB', fams:['euv','hna'],              data:revSumFam(['euv','hna']) },
  { key:'duv', label:'DUV (ArFi, ArF dry, KrF, i-line)', color:'#3E5A82', fams:['arfi','dry','krf','iline'], data:revSumFam(['arfi','dry','krf','iline']) },
  { key:'mi',  label:'Metrology & Inspection', color:REV_MI.c,  data:[REV_MI.a25, ...REV_MI.bbg] },
  { key:'ibm', label:'Installed Base Mgmt',    color:REV_IBM.c, data:[REV_IBM.a25, ...REV_IBM.bbg] }
];
function revRenderB(){
  const shr = revB.mode==='shr';
  const vis = REV_B_SER.filter(s=>!revB.hidden.has(s.key));
  const tot = REV_YRS.map((_,i)=>vis.reduce((a,s)=>a+s.data[i],0));
  const full = REV_YRS.map((_,i)=>REV_B_SER.reduce((a,s)=>a+s.data[i],0));
  let lo=0, hi=REV_YRS.length-1; if(revB.x){ lo=Math.max(0,revB.x[0]); hi=Math.min(hi,revB.x[1]); }
  const sl = a => a.slice(lo,hi+1), lbl = sl(REV_YRS);
  const val = (s,i) => shr ? (tot[i] ? s.data[i]/tot[i]*100 : null) : s.data[i]/1000;
  const ds = vis.map(s => ({ type:'bar', label:s.label, data:sl(REV_YRS.map((_,i)=>val(s,i))), stack:'s', order:2,
    backgroundColor: sl(REV_YRS.map((_,i)=> i>0 ? s.color+'99' : s.color)), borderColor:s.color, borderWidth:sl(REV_YRS.map((_,i)=>i>0?1:0)), barPercentage:.6 }));
  if(!shr && !revB.hidden.has('bbg')) ds.push({ type:'line', label:'Bloomberg revenue row', data:sl(REV_BBG_TOT.map(v=>v/1000)), borderColor:'#1E2733', backgroundColor:'#1E2733',
    borderDash:[5,4], borderWidth:2, pointRadius:3, order:1, showLine:true });
  const yr = revB.y;
  if(revBChart) revBChart.destroy();
  revBChart = new Chart($('#rev-b-chart'), { data:{ labels:lbl, datasets:ds }, options:{ responsive:true, maintainAspectRatio:false, animation:false,
    interaction:{mode:'index',intersect:false},
    plugins:{ legend:{display:false}, tooltip:{ ...TIP, callbacks:{
      title: it => it[0].label + (it[0].dataIndex+lo>0 ? ' — Bloomberg consensus, Oct 16 2026 (units × ASP)' : ' — 20-F actual'),
      label: it => it.parsed.y==null ? null : ` ${it.dataset.label}: ${shr ? it.parsed.y.toFixed(1)+'%' : '€'+it.parsed.y.toFixed(2)+'B'}`,
      footer: it => shr ? '' : 'Σ shown: €' + (tot[it[0].dataIndex+lo]/1000).toFixed(2) + 'B' } } },
    scales:{ x:{stacked:true, grid:{display:false}},
      y:{ stacked:true, grid:{color:'#EEF1F5'}, title:{display:true,text: shr?'% of shown total':'€ billions'}, ticks:{callback:x=>shr?x+'%':'€'+x},
        min:yr?yr[0]:(shr?0:undefined), max:yr?yr[1]:(shr?100:undefined) } } } });
  revBChart.$lo = lo;
  const items = REV_B_SER.map(s=>({key:s.key,label:s.label,color:s.color}));
  if(!shr) items.push({ key:'bbg', label:'Bloomberg revenue row', color:'#1E2733', line:true, dash:true });
  legend($('#rev-b-leg'), items, revB.hidden, revRenderB);

  const est = new Set(lbl.map((_,j)=>j+1).filter(j => j-1+lo >= 1));
  const f = (v) => v==null ? '—' : shr ? v.toFixed(1)+'%' : (v).toFixed(2);
  const rows = vis.map(s => [s.label, ...sl(REV_YRS.map((_,i)=>f(val(s,i))))]);
  rows.push(['<b>Σ shown</b>', ...sl(tot.map(t=>`<b>${shr?'100.0%':(t/1000).toFixed(2)}</b>`))]);
  if(!shr && !revB.hidden.has('bbg')){
    rows.push(['Bloomberg revenue row', ...sl(REV_BBG_TOT.map(v=>(v/1000).toFixed(2)))]);
    const allVis = vis.length===REV_B_SER.length;
    rows.push(['Gap: units × ASP − BBG row', ...sl(REV_YRS.map((_,i)=> !allVis ? '—' : i===0 ? '0.00' : ((full[i]-REV_BBG_TOT[i])/1000).toFixed(2)))]);
  }
  $('#rev-b-tbl').innerHTML = table([shr?'% of shown':'€B', ...lbl], rows, est);
  // by family (units, ASP, €) for the visible groups — the units × ASP detail behind the bars
  const fr = [];
  vis.filter(s=>s.fams).forEach(s => s.fams.forEach(k => { const f = REV_FAM.find(x=>x.k===k);
    const u = [f.a25[0], ...f.u], e = revFamE(f);
    fr.push([`${f.n} — units`, ...sl(u.map(v=>v.toFixed(Number.isInteger(v)?0:1)))]);
    fr.push([`${f.n} — ASP (€M)`, ...sl(e.map((v,i)=>(v/u[i]).toFixed(1)))]);
    fr.push([`${f.n} — €B`, ...sl(e.map(v=>(v/1000).toFixed(2)))]); }));
  $('#rev-b-fam').innerHTML = fr.length ? table(['By family', ...lbl], fr, est) : '';
}
function revRenderRecon(){
  const fmt = v => v==null ? '—' : Math.round(v).toLocaleString('en-US');
  const gap = (a,b) => { const g=a-b; return `<td class="${Math.abs(g)<1?'':g>0?'pos':'neg'}">${g>=0?'+':''}${Math.round(g).toLocaleString('en-US')}</td>`; };
  const hdr = `<tr><th>€M</th>${REV_YRS.slice(1).map(y=>`<th class="est" colspan="3">${y}</th>`).join('')}</tr><tr><th></th>${REV_YRS.slice(1).map(()=>'<th class="est">BBG row</th><th class="est">u × ASP</th><th class="est">gap</th>').join('')}</tr>`;
  const line = (n, bbg, calc) => `<tr><td>${n}</td>${bbg.map((b,i)=>`<td class="est">${fmt(b)}</td><td class="est">${fmt(calc[i])}</td>${gap(calc[i],b)}`).join('')}</tr>`;
  let body = REV_FAM.map(f => line(f.n, f.bbgE, f.u.map((u,i)=>u*f.asp[i]))).join('');
  body += line('Metrology & Inspection', REV_MI.bbg, REV_MI.bbg);
  const sysC = [0,1,2,3].map(i => REV_FAM.reduce((a,f)=>a+f.u[i]*f.asp[i],0) + REV_MI.bbg[i]);
  body += `<tr class="tot">${line('Net system sales', REV_BBG_SYS.slice(1), sysC).slice(4)}`;
  body += line('Installed Base Mgmt', REV_IBM.bbg, REV_IBM.bbg);
  body += `<tr class="tot">${line('Total net sales', REV_BBG_TOT.slice(1), sysC.map((s,i)=>s+REV_IBM.bbg[i])).slice(4)}`;
  const euvRow = [16905.2876,23893.9178,33509.2546,38068.6771];
  body += `<tr><td style="color:var(--mu)">Memo: BBG "EUV" row vs Low + High-NA rows</td>${euvRow.map((e,i)=>{ const s=REV_FAM[0].bbgE[i]+REV_FAM[1].bbgE[i]; return `<td class="est">${fmt(e)}</td><td class="est">${fmt(s)}</td>${gap(s,e)}`; }).join('')}</tr>`;
  $('#rev-r-tbl').innerHTML = `<table><thead>${hdr}</thead><tbody>${body}</tbody></table>`;
}

/* ═════════════ SCENARIO BUILDER ═════════════ */
const revS = { pre:'Base', vals:revPresetVals('Base'), hidden:new Set(), x:null, y:null };
let revSChart;
const REV_S_YRS = ['2025A','2026E','2027E','2028E','2029E','2030E'];
function revFmtIn(d, v, i){ if(v==null) return ''; if((d.k==='mi_g'||d.k==='ibm_g') && i===0) return Math.round(v); return +v.toFixed(d.unit==='units'?1:1); }
function revRenderInputs(){
  const base = revS.pre==='bbg' ? null : revS.pre;
  const grp = { euv:'EUV', duv:'DUV', oth:'Metrology & Inspection · Installed Base' };
  const out = revCompute(revS.vals);
  let h = `<table><thead><tr><th>Driver</th><th></th>${REV_S_YRS.slice(1).map(y=>`<th class="est">${y}</th>`).join('')}</tr></thead><tbody>`;
  REV_DRV.forEach(d => {
    if(d.g) h += `<tr><td class="g" colspan="7">${grp[d.g]}</td></tr>`;
    const ref = revS.pre==='bbg' ? d.bbg : d[revS.pre];
    h += `<tr><td title="${d.n.replace(/"/g,'&quot;')}">${d.l}</td><td class="u">${d.k.endsWith('_g') ? '€M · %' : d.unit}</td>` +
      revS.vals[d.k].map((v,i)=>{ const ed = (v??null)!==(ref[i]??null);
        return `<td><input type="number" step="any" data-k="${d.k}" data-i="${i}" value="${revFmtIn(d,v,i)}" class="${ed?'ed':''}" aria-label="${d.l} ${2026+i}"></td>`; }).join('') + '</tr>';
  });
  const f = v => v==null ? '—' : '€'+(v/1000).toFixed(1)+'B';
  h += `<tr class="out"><td>Total net sales</td><td class="u">€B</td>${out.tot.map(v=>`<td>${f(v)}</td>`).join('')}</tr>`;
  $('#rev-s-in').innerHTML = h + '</tbody></table>';
  $$('#rev-s-in input').forEach(inp => inp.onchange = () => {
    const t = inp.value.trim(); revS.vals[inp.dataset.k][+inp.dataset.i] = t==='' ? null : +t;
    revRenderInputs(); revRenderS();
  });
}
function revRenderS(){
  const mine = revCompute(revS.vals);
  const edited = REV_DRV.some(d => revS.vals[d.k].some((v,i)=> (v??null) !== ((revS.pre==='bbg'?d.bbg:d[revS.pre])[i]??null)));
  const preName = revS.pre==='bbg' ? 'Bloomberg' : revS.pre;
  const mineLbl = edited ? `Your scenario (edited from ${preName})` : `Your scenario (= ${preName})`;
  const A25 = REV_BBG_TOT[0];
  const path = t => [A25, ...t].map(v => v==null ? null : v/1000);
  const SER = [
    { key:'mine', label:mineLbl, color:REV_SCEN_COL.mine, data:path(mine.tot), w:3 },
    { key:'bbgrow', label:'Bloomberg revenue row', color:REV_SCEN_COL.bbg, data:[...REV_BBG_TOT.map(v=>v/1000), null], w:2 },
    { key:'Bear', label:'Bear (as defined)', color:REV_SCEN_COL.Bear, data:path(REV_REF.Bear.tot), w:1.5 },
    { key:'Base', label:'Base (as defined)', color:REV_SCEN_COL.Base, data:path(REV_REF.Base.tot), w:1.5 },
    { key:'Bull', label:'Bull (as defined)', color:REV_SCEN_COL.Bull, data:path(REV_REF.Bull.tot), w:1.5 }
  ];
  let lo=0, hi=REV_S_YRS.length-1; if(revS.x){ lo=Math.max(0,revS.x[0]); hi=Math.min(hi,revS.x[1]); }
  const sl = a => a.slice(lo,hi+1), lbl = sl(REV_S_YRS);
  const ds = SER.filter(s=>!revS.hidden.has(s.key)).map(s => ({ type:'line', label:s.label, data:sl(s.data), borderColor:s.color, backgroundColor:s.color,
    borderWidth:s.w, pointRadius:s.key==='mine'?3.5:2, tension:.2, spanGaps:false, order:1,
    segment:{ borderDash: c => (c.p1DataIndex+lo)>=1 ? (s.key==='mine'?[6,3]:[4,4]) : undefined } }));
  if(!revS.hidden.has('cmd')){
    const cmd = REV_S_YRS.map((y,i)=> y==='2030E' ? [REV_CMD.low.tot, REV_CMD.high.tot] : null);
    ds.push({ type:'bar', label:'Investor Day 2030 range', data:sl(cmd), backgroundColor:REV_SCEN_COL.cmd+'cc', borderColor:'#93B1F0', borderWidth:1, barPercentage:.35, order:3 });
    ds.push({ type:'line', label:'Investor Day 2030 moderate', data:sl(REV_S_YRS.map(y=>y==='2030E'?REV_CMD.mod.tot:null)), showLine:false,
      pointStyle:'line', pointRadius:14, pointBorderWidth:2, borderColor:'#1B3F94', backgroundColor:'#1B3F94', order:0 });
  }
  const yr = revS.y;
  if(revSChart) revSChart.destroy();
  revSChart = new Chart($('#rev-s-chart'), { data:{ labels:lbl, datasets:ds }, options:{ responsive:true, maintainAspectRatio:false, animation:false,
    interaction:{mode:'index',intersect:false},
    plugins:{ legend:{display:false}, tooltip:{ ...TIP, callbacks:{
      title: it => it[0].label + (it[0].dataIndex+lo===0 ? ' — 20-F actual' : ' — estimate'),
      label: it => { const r = it.raw; if(r==null) return null;
        if(Array.isArray(r)) return ` ${it.dataset.label}: €${r[0]}–${r[1]}B`; return ` ${it.dataset.label}: €${(+r).toFixed(1)}B`; } } } },
    scales:{ x:{grid:{display:false}}, y:{ grid:{color:'#EEF1F5'}, title:{display:true,text:'total net sales, € billions'}, ticks:{callback:x=>'€'+x},
      min:yr?yr[0]:20, max:yr?yr[1]:undefined } } } });
  revSChart.$lo = lo;
  legend($('#rev-s-leg'), [...SER.map(s=>({key:s.key,label:s.label,color:s.color,line:true,dash:s.key!=='mine'})), {key:'cmd',label:'Investor Day 2030 (€44–60B, mark = €52B)',color:'#93B1F0'}], revS.hidden, revRenderS);

  // table: your scenario's build + the reference lines that are visible
  const f = v => v==null ? '—' : (v/1000).toFixed(2);
  const yv = a => sl([A25, ...a]);
  const rows = [];
  if(!revS.hidden.has('mine')){
    const fam = mine.fam, s25 = { euv:REV_FAM[1].a25[1], hna:REV_FAM[0].a25[1], arfi:REV_FAM[2].a25[1], dry:REV_FAM[3].a25[1], krf:REV_FAM[4].a25[1], iline:REV_FAM[5].a25[1] };
    const r = (n, a25, a) => rows.push([n, ...sl([a25, ...a]).map(f)]);
    r('Low-NA EUV', s25.euv, fam.euv); r('High-NA EUV', s25.hna, fam.hna);
    const duv = [0,1,2,3,4].map(i => ['arfi','dry','krf','iline'].some(k=>fam[k][i]==null) ? null : fam.arfi[i]+fam.dry[i]+fam.krf[i]+fam.iline[i]);
    r('DUV (ArFi + dry + KrF + i-line)', s25.arfi+s25.dry+s25.krf+s25.iline, duv);
    r('Metrology & Inspection', REV_MI.a25, mine.mi); r('Net system sales', REV_BBG_SYS[0], mine.sys); r('Installed Base Mgmt', REV_IBM.a25, mine.ibm);
    rows.push(['<b>'+mineLbl+' — total</b>', ...yv(mine.tot).map(v=>`<b>${f(v)}</b>`)]);
    const t = [A25, ...mine.tot];
    rows.push(['  YoY', ...sl(t.map((v,i)=> i===0||v==null||t[i-1]==null ? '—' : sgn(v/t[i-1]-1,1)))]);
    rows.push(['  vs Bloomberg revenue row', ...sl(t.map((v,i)=> i===0||i>4||v==null ? '—' : sgn(v/REV_BBG_TOT[i]-1,1)))]);
    rows.push(['  Lithography units (systems)', ...sl([327, ...mine.units].map(v=>v==null?'—':Math.round(v)))]);
  }
  if(!revS.hidden.has('bbgrow')) rows.push(['Bloomberg revenue row', ...sl([...REV_BBG_TOT.map(f), '—'])]);
  ['Bear','Base','Bull'].filter(k=>!revS.hidden.has(k)).forEach(k => rows.push([k+' (as defined) — total', ...yv(REV_REF[k].tot).map(f)]));
  if(!revS.hidden.has('cmd')) rows.push(['Investor Day 2030 low / moderate / high', ...sl(REV_S_YRS.map(y=>y==='2030E'?'44 / 52 / 60':'—'))]);
  $('#rev-s-tbl').innerHTML = table(['€B', ...lbl], rows, new Set(lbl.map((_,i)=>i+1).filter(i=>i-1+lo>=1)));
  revRenderCmd(mine);
}
function revRenderNotes(){
  $('#rev-s-notes').innerHTML = table(['Driver','Unit','Bear 2026–30','Base 2026–30','Bull 2026–30','Source / reasoning (verbatim)'],
    REV_DRV.map(d => [d.l, d.k.endsWith('_g')?'€M, then %':d.unit, d.Bear.join(' / '), d.Base.join(' / '), d.Bull.join(' / '), `<span style="white-space:normal;display:block;min-width:320px;text-align:left">${d.n}</span>`]));
}
function revSetPreset(p){
  revS.pre = p; revS.vals = revPresetVals(p); revS.x = null; revS.y = null;
  $('#rev-s-desc').innerHTML = REV_PRE_SHORT[p]; $('#rev-s-long').innerHTML = REV_PRE_DESC[p];
  revRenderInputs(); revRenderS();
}

/* ═════════════ INVESTOR DAY vs CONSENSUS ═════════════ */
function revRenderCmd(mine){
  const b = i => ({ euv:(REV_FAM[0].bbgE[i]+REV_FAM[1].bbgE[i])/1000, non:(REV_FAM.slice(2).reduce((a,f)=>a+f.bbgE[i],0)+REV_MI.bbg[i])/1000, ibm:REV_IBM.bbg[i]/1000, tot:REV_BBG_TOT[i+1]/1000 });
  const bb = b(3);
  const m = mine.tot[4]==null ? null : { euv:(mine.fam.euv[4]+mine.fam.hna[4])/1000, non:(mine.fam.arfi[4]+mine.fam.dry[4]+mine.fam.krf[4]+mine.fam.iline[4]+mine.mi[4])/1000, ibm:mine.ibm[4]/1000, tot:mine.tot[4]/1000 };
  const f = v => v==null ? '—' : v.toFixed(1);
  const rows = [['EUV','euv'],['Non-EUV litho + M&I','non'],['Installed Base Mgmt','ibm'],['<b>Total</b>','tot']].map(([n,k]) =>
    [n, f(REV_CMD.low[k]), f(REV_CMD.mod[k]), f(REV_CMD.high[k]), f(bb[k]), m ? f(m[k]) : '—']);
  $('#rev-cmd-tbl').innerHTML = table(['€B','2030 low','2030 mod.','2030 high','BBG 2029E','Yours 2030E'], rows, new Set([4,5]));
  const ibm26 = 12.238;
  $('#rev-cmd-note').innerHTML = `Bloomberg's 2029E total (€${bb.tot.toFixed(1)}B) is <b>€${(bb.tot-REV_CMD.high.tot).toFixed(1)}B above</b> the top of ASML's 2030 range; its 2028E (€${(REV_BBG_TOT[3]/1000).toFixed(1)}B) is already above it. IBM 2026 (9M actual + Q4 guide ≈ €${ibm26.toFixed(1)}B) is inside the €11–13B 2030 band. Gross margin: Investor Day 2030 56–60% vs Bloomberg ${REV_BBG_GM[4].toFixed(1)}% in 2029E.` +
    (m ? '' : ' <span style="color:var(--mu)">(Your scenario has no 2030 value — the Bloomberg preset stops at 2029.)</span>');
}

/* ═════════════ HISTORY ═════════════ */
const revH = { hidden:new Set(), x:null, y:null };
let revHChart;
function revRenderH(){
  const sys = REV_H_TOT.map((t,i)=>t-REV_H_IBM[i]);
  const E = REV_H_LBL.length-1;
  const SER = [ {key:'sys',label:'Net system sales',color:'#2563EB',data:sys}, {key:'ibm',label:'Installed Base Mgmt',color:'#5E8BEC',data:REV_H_IBM} ];
  const vis = SER.filter(s=>!revH.hidden.has(s.key));
  let lo=0, hi=E; if(revH.x){ lo=Math.max(0,revH.x[0]); hi=Math.min(E,revH.x[1]); }
  const sl = a => a.slice(lo,hi+1);
  const ds = vis.map(s => ({ type:'bar', label:s.label, data:sl(s.data.map(v=>v/1000)), stack:'s', yAxisID:'y', order:2,
    backgroundColor:sl(s.data.map((_,i)=>i===E?s.color+'77':s.color)), borderColor:s.color, borderWidth:sl(s.data.map((_,i)=>i===E?1:0)), barPercentage:.7 }));
  const share = REV_H_IBM.map((v,i)=>v/REV_H_TOT[i]*100);
  if(!revH.hidden.has('shr')) ds.push({ type:'line', label:'IBM % of total', data:sl(share), yAxisID:'y1', borderColor:'#1E2733', backgroundColor:'#1E2733', borderWidth:1.5, pointRadius:2, order:1,
    segment:{ borderDash: c => (c.p1DataIndex+lo)>=E ? [4,3] : undefined } });
  const yr = revH.y;
  if(revHChart) revHChart.destroy();
  revHChart = new Chart($('#rev-h-chart'), { data:{ labels:sl(REV_H_LBL), datasets:ds }, options:{ responsive:true, maintainAspectRatio:false, animation:false,
    interaction:{mode:'index',intersect:false},
    plugins:{ legend:{display:false}, tooltip:{ ...TIP, callbacks:{
      title: it => it[0].label + ((it[0].dataIndex+lo)===E ? ' — 9M actual + Q4 guide midpoint' : ''),
      label: it => it.parsed.y==null ? null : ` ${it.dataset.label}: ${it.dataset.yAxisID==='y1' ? it.parsed.y.toFixed(1)+'%' : '€'+it.parsed.y.toFixed(2)+'B'}`,
      footer: it => { const i=it[0].dataIndex+lo; return 'Σ shown: €' + (vis.reduce((a,s)=>a+s.data[i],0)/1000).toFixed(2) + 'B'; } } } },
    scales:{ x:{stacked:true,grid:{display:false}}, y:{stacked:true,grid:{color:'#EEF1F5'},ticks:{callback:x=>'€'+x}, title:{display:true,text:'€ billions'}, min:yr?yr[0]:undefined, max:yr?yr[1]:undefined},
      y1:{ position:'right', grid:{display:false}, min:0, max:40, ticks:{callback:x=>x+'%'}, display:!revH.hidden.has('shr') } } } });
  revHChart.$lo = lo;
  legend($('#rev-h-leg'), [...SER, {key:'shr',label:'IBM % of total',color:'#1E2733',line:true}], revH.hidden, revRenderH);
  const lbl = sl(REV_H_LBL), est = new Set(lbl.map((l,i)=>l==='2026E'?i+1:-1).filter(i=>i>0));
  const rows = vis.map(s => [s.label, ...sl(s.data).map(v=>(v/1000).toFixed(2))]);
  rows.push(['<b>Σ shown</b>', ...sl(REV_H_LBL.map((_,i)=>`<b>${(vis.reduce((a,s)=>a+s.data[i],0)/1000).toFixed(2)}</b>`))]);
  const tot = REV_H_TOT; rows.push(['  YoY (total net sales)', ...sl(tot.map((v,i)=>i===0?'—':sgn(v/tot[i-1]-1,1)))]);
  if(!revH.hidden.has('shr')) rows.push(['IBM % of total', ...sl(share).map(v=>v.toFixed(1)+'%')]);
  $('#rev-h-tbl').innerHTML = table(['€B', ...lbl], rows, est);
}

/* ═════════════ WIRING ═════════════ */
pills('#rev-b-mode', m => { revB.mode = m; revB.x = null; revB.y = null; revRenderB(); });
pills('#rev-s-pre', p => revSetPreset(p));
function revInit(){
  revKpis();
  revRenderB(); revRenderRecon();
  attachZoom(() => revBChart, r => { if(!r){ revB.x=null; revB.y=null; } else { if(r.x) revB.x=r.x; if(r.y) revB.y=r.y; } revRenderB(); });
  revRenderNotes(); revSetPreset('Base');
  attachZoom(() => revSChart, r => { if(!r){ revS.x=null; revS.y=null; } else { if(r.x) revS.x=r.x; if(r.y) revS.y=r.y; } revRenderS(); });
  revRenderH();
  attachZoom(() => revHChart, r => { if(!r){ revH.x=null; revH.y=null; } else { if(r.x) revH.x=r.x; if(r.y) revH.y=r.y; } revRenderH(); });
}
