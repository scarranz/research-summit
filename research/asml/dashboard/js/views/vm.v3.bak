/* ═════════════ VOLUME MODEL (vm) — how many machines, of which kind, and how many can ASML ship? ═════════════
   Every number is frozen here. Sources:
   - Annual litho units by technology 2015–2025: 20-F Note 2 / segment note (FY2017, FY2019, FY2022, FY2025 20-F), via asml-work/data/annual.json.
     EUV split NXE (0.33 NA) / EXE (High-NA) from the FY2025 20-F (2023 EXE = 0). 2015–2022 are reported as "EUV" only; High-NA did not exist
     yet (first EXE revenue Q4 2024), so they sit in the 0.33 NA series and High-NA is left empty (null), not zero.
   - Quarterly litho units by technology Q1'22–Q3'26: 6-K presentations "Net system sales breakdown (Quarterly)", via asml-work/data/quarterly.json.
   - New / used litho units: Q4 results 6-Ks (annual) and quarterly press releases. Logic / memory units: 20-F Note 2 (systems incl. M&I).
   - Consensus: Bloomberg BST, Oct 16 2026 (asml-work/data/bbg_s1.tsv annual, bbg_s2.tsv quarterly). Low-NA / High-NA rows, not BBG's "EUV" row.
   - Investor Day unit grids and capacity: asml-work/data/targets.json (6-Ks listed there). Q3'26 capacity wording: Q3 2026 press release (6-K, Oct 14 2026). */

/* ── families (colours = BRIEF palette) ── */
const VM_FAM = [
  { k:'hna',  n:'High-NA EUV',     c:'#1B3F94' },
  { k:'euv',  n:'EUV (0.33 NA)',   c:'#2563EB' },
  { k:'arfi', n:'ArFi',            c:'#3E5A82' },
  { k:'arfd', n:'ArF dry',         c:'#93B1F0' },
  { k:'krf',  n:'KrF',             c:'#1E2733' },
  { k:'il',   n:'i-line',          c:'#A9B4C2' }
];
const VM_FAM_Q = [ { k:'eua', n:'EUV (all NA)', c:'#2563EB' }, ...VM_FAM.slice(2) ];   // quarterly: High-NA not stated every quarter → EUV combined

/* ── annual, litho units (new + used), 20-F; 2026E–2029E Bloomberg consensus Oct 16 2026 (fractional = average of contributors) ── */
const VM_A_LBL = ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','2026E','2027E','2028E','2029E'];
const VM_A_EST = 11;   // index of first consensus year
const VM_A = {
  hna:  [null,null,null,null,null,null,null,null,0,2,4,            4.9393,5.3536,7.8135,12.3636],
  euv:  [1,4,11,18,26,31,42,40,53,42,44,                            65.1369,88.0317,112.0727,111.1667],
  arfi: [67,70,76,86,82,68,81,81,125,129,131,                       132.1944,167.0632,206.0513,207.6],
  arfd: [9,6,13,16,22,22,22,28,32,28,16,                            35.6667,44.4667,48.6429,47.375],
  krf:  [74,57,71,78,65,103,131,151,184,152,78,                     142.6121,151.7455,162.7143,164.495],
  il:   [18,20,26,26,34,34,33,45,55,65,54,                          59.8571,69.4267,75.564,73.22]
};
/* Bloomberg's own aggregate rows (bbg_s1.tsv rows 33, 36, 54, 41) — shown as memo lines because they do not add up to the family rows */
const VM_BBG_ROW = { euv:[69.0833,92.2817,117.8974,122], duv:[417,438,480,null], tot:[435.4667,515.0854,590.2601,592.44], mi:[221.7539,266.8288,366.5575,349.1246] };

/* ── quarterly, litho units by technology (6-K) + Bloomberg quarterly consensus Q4'26E–Q4'27E (bbg_s2.tsv; EUV = Low-NA + High-NA rows) ── */
const VM_Q_LBL = ["Q1'22","Q2'22","Q3'22","Q4'22","Q1'23","Q2'23","Q3'23","Q4'23","Q1'24","Q2'24","Q3'24","Q4'24","Q1'25","Q2'25","Q3'25","Q4'25","Q1'26","Q2'26","Q3'26",
                  "Q4'26E","Q1'27E","Q2'27E","Q3'27E","Q4'27E"];
const VM_Q_EST = 19;
const VM_Q = {
  eua:  [3,12,12,13,17,12,11,13,11,8,11,14,14,11,9,14,16,16,17,       20.8611,20.5,22.7111,25.1,25.5],
  arfi: [18,21,20,22,25,39,32,29,20,32,38,39,25,31,38,37,17,23,40,     51.6875,39.25,40.75,42.6759,46.0833],
  arfd: [6,8,6,8,7,6,9,10,4,11,7,6,3,4,4,5,5,8,10,                    13.2667,11.75,11,11.3333,12.75],
  krf:  [26,38,38,49,43,43,44,54,25,33,42,52,22,16,11,29,30,35,35,     42.2,35.8333,36.5833,38.0152,42.1667],
  il:   [9,12,10,14,8,13,16,18,10,16,18,21,13,14,10,17,11,9,19,       22.2857,15.6364,17.0909,16.4545,18.4]
};
/* High-NA (EXE) systems recognised, as stated by ASML (quarterly_notes.md); null = not stated (Q1–Q3'25 sum to 2 from the FY total of 4) */
const VM_Q_HNA = [0,0,0,0,0,0,0,0,0,0,0,2,null,null,null,2,2,1,null];
const VM_Q_NEW  = [59,83,80,95,96,107,105,113,66,89,106,119,73,67,66,94,67,86,113];
const VM_Q_USED = [3,8,6,11,4,6,7,11,4,11,10,13,4,9,6,8,12,5,8];

/* ── new vs used (litho units, Q4 6-Ks) and logic vs memory (systems incl. M&I, 20-F Note 2) ── */
const VM_NU_LBL  = ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','2026 9M'];
const VM_NU_NEW  = [144,139,173,207,203,236,286,317,421,380,300,266];
const VM_NU_USED = [25,18,24,17,26,22,23,28,28,38,27,25];
const VM_LM_LOG  = [null,null,145,125,238,260,327,357,439,399,364,null];   // 2015–16 split as Foundry/IDM in € only; 2026 not disclosed in units
const VM_LM_MEM  = [null,null,147,213,106,135,178,204,161,184,171,null];

/* ── capacity: Investor Day grids (ASML litho units) + 2022 capacity plan; groups ── */
const VM_GRP = [
  { k:'lna', n:'Low-NA EUV',  fam:['euv'] },
  { k:'hna', n:'High-NA EUV', fam:['hna'] },
  { k:'arfi',n:'ArFi',        fam:['arfi'] },
  { k:'dry', n:'Dry DUV',     fam:['arfd','krf','il'] },
  { k:'duv', n:'All DUV',     fam:['arfi','arfd','krf','il'] },
  { k:'tot', n:'Total litho', fam:['hna','euv','arfi','arfd','krf','il'] }
];
// Investor Day 2022 (6-K 0001193125-22-283523 Ex.99.3): ASML units, low / high market. Dry = ArF dry + KrF + i-line.
const VM_CMD22 = { 2025:{ low:{hna:5,lna:65,arfi:75,dry:180,tot:325}, high:{hna:5,lna:80,arfi:105,dry:385,tot:575} },
                   2030:{ low:{hna:15,lna:65,arfi:85,dry:250,tot:415}, high:{hna:30,lna:80,arfi:115,dry:425,tot:650} } };
// Investor Day 2021 2025 grid, restated as ASML units in the 2022 CFO deck
const VM_CMD21 = { low:{hna:5,lna:48,arfi:63,dry:124,tot:240}, high:{hna:5,lna:70,arfi:78,dry:189,tot:342} };
// Investor Day 2018 2025 grid — WORLDWIDE litho units (not ASML), four modeled points; quadrant labels garbled in the source
const VM_CMD18 = [ {hna:9,lna:55,arfi:60,dry:200,tot:324}, {hna:7,lna:43,arfi:40,dry:150,tot:240}, {hna:5,lna:32,arfi:35,dry:140,tot:212}, {hna:3,lna:45,arfi:40,dry:150,tot:238} ];
// Investor Day 2022 capacity plan: 90 low-NA EUV + 600 DUV a year (2025–26), High-NA 20 a year (2027–28). Not restated at the 2024 Investor Day.
const VM_CAP = { lna:{v:90, yrs:['2025','2026']}, duv:{v:600, yrs:['2025','2026']}, hna:{v:20, yrs:['2027','2028']} };

/* ── helpers ── */
const vmSum = a => a.reduce((s,x)=>s+(x||0),0);
const vmF = (x, d=0) => x==null ? '—' : (Math.abs(x-Math.round(x))<1e-9 ? Math.round(x).toLocaleString('en-US') : x.toFixed(d===0?1:d));
const vmTip = (extra) => ({ ...TIP, ...extra });
const vmPills = (sel, fn) => $$(sel + ' .fb').forEach(b => b.onclick = () => { $$(sel + ' .fb').forEach(x=>x.classList.remove('active')); b.classList.add('active'); fn(b.dataset.v); });


/* ═════════════ v3 layout (BRIEF "DENSITY RULES"): 4 tiles · 4 sections · one family at a time ═════════════ */
const VM_SEL = [ {k:'all',n:'All litho'}, {k:'euv',n:'EUV'}, {k:'arfi',n:'ArFi'}, {k:'arfd',n:'ArF dry'}, {k:'krf',n:'KrF'}, {k:'il',n:'i-line'} ];
const vmSeg = (id, label, opts, act) => `<span class="ctl-l">${label}</span><div class="fbg" id="${id}">${opts.map(o=>`<button class="fb${o.k===act?' active':''}" data-v="${o.k}">${o.n}</button>`).join('')}</div>`;
const vmMore = (id) => `<div id="${id}" style="padding:10px 13px;font-size:11px;line-height:1.6;color:var(--mu);border-top:1px solid var(--bdr)"></div>`;

registerView({ id:'vm', html:`
    <div class="srow" id="vm-kpis"></div>

    <div class="card">
      <div class="ch">
        <div><div class="ct">How many machines of each kind does ASML ship?</div><div class="cs" id="vm-u-s"></div></div>
        <div class="ctls"><div>${vmSeg('vm-u-per','Period',[{k:'a',n:'Annual'},{k:'q',n:'Quarterly'}],'a')}</div><div>${vmSeg('vm-u-fam','Family',VM_SEL,'all')}</div></div>
      </div>
      <div class="cb"><div class="leg" id="vm-u-leg"></div><div class="ch-wrap"><canvas id="vm-u-chart"></canvas></div></div>
      <details class="tbl"><summary>Data table &amp; method</summary><div class="tw" id="vm-u-tbl"></div>${vmMore('vm-u-more')}</details>
      <div class="snote">Source: ASML 20-F Note 2 and 6-K quarterly presentations; consensus = Bloomberg BST, Oct 16 2026. Lithography systems only, new + used.</div>
    </div>

    <div class="card">
      <div class="ch"><div><div class="ct">What does the 2026 consensus need in Q4?</div><div class="cs">Units in one quarter · Q4 implied = Bloomberg FY2026E − 9M26 actual (291)</div></div></div>
      <div class="cb"><div class="leg" id="vm-q4-leg"></div><div class="ch-wrap"><canvas id="vm-q4-chart"></canvas></div></div>
      <details class="tbl"><summary>Data table &amp; method</summary><div class="tw" id="vm-q4-tbl"></div>${vmMore('vm-q4-more')}</details>
      <div class="snote">Source: 6-K Q1–Q3 2026; Bloomberg BST, Oct 16 2026. Bloomberg's own total row implies 144, not 149 (see dropdown).</div>
    </div>

    <div class="card">
      <div class="ch">
        <div><div class="ct">New or used, logic or memory?</div><div class="cs" id="vm-mx-s"></div></div>
        <div class="ctls"><div>${vmSeg('vm-mx-mode','Split',[{k:'nu',n:'New vs used'},{k:'lm',n:'Logic vs memory'}],'nu')}</div></div>
      </div>
      <div class="cb"><div class="leg" id="vm-mx-leg"></div><div class="ch-wrap"><canvas id="vm-mx-chart"></canvas></div></div>
      <details class="tbl"><summary>Data table &amp; method</summary><div class="tw" id="vm-mx-tbl"></div>${vmMore('vm-mx-more')}</details>
      <div class="snote" id="vm-mx-note"></div>
    </div>

    <div class="card">
      <div class="ch">
        <div><div class="ct">How many can ASML ship?</div><div class="cs">Q3'26: 2027–28 supply "will not fully meet the demand"; Low-NA and ArFi capacity +30% in 2027</div></div>
        <div class="ctls"><div>${vmSeg('vm-cap-g','Group',VM_GRP.filter(g=>g.k!=='tot'),'lna')}</div></div>
      </div>
      <div class="cb"><div class="leg" id="vm-cap-leg"></div><div class="ch-wrap"><canvas id="vm-cap-chart"></canvas></div></div>
      <details class="tbl"><summary>Data table, what management said &amp; method</summary><div class="tw" id="vm-cap-tbl"></div>${vmMore('vm-cap-more')}</details>
      <div class="snote">Source: Investor Day 2022 (ranges, capacity plan); Q2/Q3 2026 press releases; Bloomberg BST, Oct 16 2026. Ranges are scenarios, not guidance.</div>
    </div>
`, init(){ vmInit(); } });

/* ═════════════ KPIs (4) ═════════════ */
function vmQTot(i){ return ['eua','arfi','arfd','krf','il'].reduce((s,k)=>s+VM_Q[k][i],0); }
function vmRenderKpis(){
  const nm26 = vmQTot(16)+vmQTot(17)+vmQTot(18), nm25 = vmQTot(12)+vmQTot(13)+vmQTot(14);
  const eu26 = VM_Q.eua[16]+VM_Q.eua[17]+VM_Q.eua[18];
  const c26 = VM_FAM.reduce((s,f)=>s+VM_A[f.k][11],0);
  const k = [
    ['Litho units, FY2025', '327', 'EUV 48 = NXE 44 + EXE 4'],
    ['Litho units, 9M26', nm26, `${sgn(nm26/nm25-1)} vs 9M25 (${nm25})`],
    ['Consensus FY2026E', c26.toFixed(0), `needs ~${(c26-nm26).toFixed(0)} in Q4; record 132`],
    ['EUV share of units', pct(48/327,0), `FY2025 · 9M26 ${pct(eu26/nm26,0)}`]
  ];
  $('#vm-kpis').innerHTML = k.map(([l,v,s]) => `<div class="sc"><div class="sl">${l}</div><div class="sv">${v}</div><div class="ss">${s}</div></div>`).join('');
}

/* ═════════════ 1 · UNITS, ONE FAMILY AT A TIME ═════════════ */
const vmU = { per:'a', fam:'all', hidden:new Set(), x:null, y:null };
let vmUChart;
function vmUSeries(){
  const q = vmU.per==='q', D = q ? VM_Q : VM_A, fk = q ? ['eua','arfi','arfd','krf','il'] : VM_FAM.map(f=>f.k);
  const tot = D[fk[0]].map((_,i)=>fk.reduce((s,k)=>s+(D[k][i]||0),0));
  if(vmU.fam==='all') return { ser:[{ key:'all', label:'All lithography units', color:'#1E2733', data:tot }], tot };
  if(vmU.fam==='euv') return q ? { ser:[{ key:'eua', label:'EUV (all NA)', color:'#2563EB', data:D.eua }], tot }
    : { ser:[{ key:'hna', label:'High-NA EUV', color:'#1B3F94', data:D.hna }, { key:'euv', label:'EUV (0.33 NA)', color:'#2563EB', data:D.euv }], tot };
  const f = VM_FAM.find(x=>x.k===vmU.fam);
  return { ser:[{ key:f.k, label:f.n, color:f.c, data:D[f.k] }], tot };
}
function vmRenderU(){
  const q = vmU.per==='q', L = q ? VM_Q_LBL : VM_A_LBL, EST = q ? VM_Q_EST : VM_A_EST;
  const { ser, tot } = vmUSeries(), vis = ser.filter(s=>!vmU.hidden.has(s.key));
  let lo = 0, hi = L.length-1;
  if(vmU.x){ lo = Math.max(0, vmU.x[0]); hi = Math.min(hi, vmU.x[1]); if(hi<lo){ lo=0; hi=L.length-1; } }
  const idx = L.map((_,i)=>i).slice(lo, hi+1);
  const selTot = idx.map(i => vis.length ? vis.reduce((s,x)=>s+(x.data[i]||0),0) : null);
  if(vmUChart) vmUChart.destroy();
  vmUChart = new Chart($('#vm-u-chart'), { type:'bar',
    data:{ labels:idx.map(i=>L[i]), datasets: vis.map(s=>({ label:s.label, data:idx.map(i=>s.data[i]), stack:'s',
      backgroundColor: idx.map(i=> i>=EST ? s.color+'59' : s.color), borderColor:s.color, borderWidth: idx.map(i=> i>=EST ? 1 : 0), borderRadius:2, barPercentage:.75 })) },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{display:false}, tooltip: vmTip({ callbacks:{
        title: it => { const i = idx[it[0].dataIndex]; return L[i] + (i>=EST ? ' — Bloomberg consensus, Oct 16 2026' : ' — actual'); },
        label: it => it.parsed.y==null ? null : ` ${it.dataset.label}: ${vmF(it.parsed.y)} units`,
        footer: it => { const j = it[0].dataIndex, i = idx[j]; return vmU.fam==='all' ? '' : `${vmF(selTot[j])} of ${vmF(tot[i])} litho units (${(selTot[j]/tot[i]*100).toFixed(0)}%)`; } } }) },
      scales:{ x:{ stacked:true, grid:{display:false} }, y:{ stacked:true, grid:{color:'#EEF1F5'}, title:{display:true,text:'lithography units'}, min: vmU.y?vmU.y[0]:0, max: vmU.y?vmU.y[1]:undefined } } } });
  vmUChart.$lo = lo;
  legend($('#vm-u-leg'), ser.map(s=>({key:s.key,label:s.label,color:s.color})), vmU.hidden, vmRenderU);
  $('#vm-u-s').textContent = (q ? 'Quarterly, Q1\'22–Q4\'27E' : 'Annual, 2015–2029E') + ' · units · lighter bars = Bloomberg consensus';

  const td = (v,i,b) => `<td class="${i>=EST?'est':''}">${b?'<b>':''}${v}${b?'</b>':''}</td>`;
  let rows = vis.map(s => `<tr><td>${s.label}</td>${idx.map(i=>td(vmF(s.data[i]),i)).join('')}</tr>`).join('');
  if(vis.length>1) rows += `<tr><td><b>EUV total shown</b></td>${idx.map((i,j)=>td(vmF(selTot[j]),i,true)).join('')}</tr>`;
  if(vmU.fam!=='all') rows += `<tr><td>All lithography units</td>${idx.map(i=>td(vmF(tot[i]),i)).join('')}</tr>` +
    `<tr><td>Share of all litho units</td>${idx.map((i,j)=>td(vis.length&&tot[i] ? (selTot[j]/tot[i]*100).toFixed(1)+'%' : '—',i)).join('')}</tr>`;
  if(q && vmU.fam==='euv' && vis.length) rows += `<tr><td>of which High-NA recognised (stated)</td>${idx.map(i=>td(i<VM_Q_HNA.length ? (VM_Q_HNA[i]==null?'n.s.':VM_Q_HNA[i]) : '—',i)).join('')}</tr>`;
  if(!q && idx.some(i=>i>=EST)){
    const memo = ({ all:[['BBG "Units Shipped" row (≠ sum of its families)',VM_BBG_ROW.tot],['BBG M&amp;I units (excluded)',VM_BBG_ROW.mi]], euv:[['BBG "EUV" row (≠ Low-NA + High-NA)',VM_BBG_ROW.euv]] })[vmU.fam] || [];
    if(['arfi','arfd','krf','il'].includes(vmU.fam)) memo.push(['BBG "DUV" row (≠ its parts)',VM_BBG_ROW.duv]);
    rows += memo.map(([n,a]) => `<tr><td>Memo: ${n}</td>${idx.map(i=>td(i>=EST ? vmF(a[i-EST]) : '',i)).join('')}</tr>`).join('');
  }
  $('#vm-u-tbl').innerHTML = `<table><thead><tr><th>Units</th>${idx.map(i=>`<th class="${i>=EST?'est':''}">${L[i]}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>`;
  $('#vm-u-more').innerHTML = `<b>Method.</b> Annual: 20-F Note 2 / segment note (FY2017, FY2019, FY2022, FY2025); EUV split NXE (0.33 NA) / EXE (High-NA) from the FY2025 20-F. 2015–2022 are reported as "EUV" only; all are 0.33 NA (first High-NA revenue Q4 2024), so High-NA is left empty there. 2016–2017 are pre-ASC 606 (restated: 154 and 197). Quarterly: 6-K presentations, "Net system sales breakdown (Quarterly)"; EUV is shown combined because ASML did not state High-NA units for Q1–Q3'25 or Q3'26. Consensus: Bloomberg BST Oct 16 2026, averages of contributors (hence decimals); EUV = Low-NA + High-NA rows, not BBG's "EUV" row. BBG's own aggregate rows do not add up to its family rows (memo lines).`;
}

/* ═════════════ 2 · Q4'26 IMPLIED ═════════════ */
const VM_Q4_FAM = VM_FAM_Q.map(f => {
  const a = VM_Q[f.k].slice(0, VM_Q_EST);
  const fy = f.k==='eua' ? VM_A.hna[11]+VM_A.euv[11] : VM_A[f.k][11];
  const nm = a[16]+a[17]+a[18], best = Math.max(...a);
  return { ...f, n: f.k==='eua' ? 'EUV' : f.n, nm, fy, imp: fy-nm, best, bestAt: a.map((v,i)=>v===best?VM_Q_LBL[i]:null).filter(Boolean).join(', '), q3: a[18], bbgQ: VM_Q[f.k][VM_Q_EST] };
});
const VM_Q4_SER = [
  { key:'best', label:'Best quarter so far', color:'#A9B4C2', get:f=>f.best },
  { key:'q3',   label:'Q3\'26 actual',        color:'#3E5A82', get:f=>f.q3 },
  { key:'imp',  label:'Q4\'26 implied (consensus)', color:'#2563EB', get:f=>f.imp, est:true }
];
const vmQ4 = { hidden:new Set(), x:null, y:null };
let vmQ4Chart;
function vmRenderQ4(){
  let lo = 0, hi = VM_Q4_FAM.length-1;
  if(vmQ4.x){ lo = Math.max(0, vmQ4.x[0]); hi = Math.min(hi, vmQ4.x[1]); if(hi<lo){ lo=0; hi=VM_Q4_FAM.length-1; } }
  const fams = VM_Q4_FAM.slice(lo, hi+1), vis = VM_Q4_SER.filter(s=>!vmQ4.hidden.has(s.key));
  if(vmQ4Chart) vmQ4Chart.destroy();
  vmQ4Chart = new Chart($('#vm-q4-chart'), { type:'bar',
    data:{ labels:fams.map(f=>f.n), datasets: vis.map(s=>({ label:s.label, data:fams.map(s.get), backgroundColor: s.est ? s.color+'59' : s.color, borderColor:s.color, borderWidth: s.est?1:0, borderRadius:2 })) },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{display:false}, tooltip: vmTip({ callbacks:{
        label: it => ` ${it.dataset.label}: ${vmF(it.parsed.y)} units`,
        footer: it => { const f = fams[it[0].dataIndex]; return `9M26 ${f.nm} · FY26E ${vmF(f.fy)} · best ${f.bestAt}`; } } }) },
      scales:{ x:{grid:{display:false}}, y:{ grid:{color:'#EEF1F5'}, title:{display:true,text:'units in the quarter'}, min: vmQ4.y?vmQ4.y[0]:0, max: vmQ4.y?vmQ4.y[1]:undefined } } } });
  vmQ4Chart.$lo = lo;
  legend($('#vm-q4-leg'), VM_Q4_SER.map(s=>({key:s.key,label:s.label,color:s.color})), vmQ4.hidden, vmRenderQ4);
  const sum = g => fams.reduce((s,f)=>s+g(f),0);
  const rows = [['9M26 actual', f=>f.nm, false], ['FY2026E (BBG)', f=>f.fy, true], ...vis.map(s=>[s.label, s.get, !!s.est]), ['BBG Q4\'26E, quarterly column', f=>f.bbgQ, true]];
  $('#vm-q4-tbl').innerHTML = `<table><thead><tr><th>Units</th>${fams.map(f=>`<th>${f.n}</th>`).join('')}<th>Sum shown</th></tr></thead><tbody>` +
    rows.map(([n,g,e]) => `<tr><td class="${e?'est':''}">${n}</td>${fams.map(f=>`<td class="${e?'est':''}">${vmF(g(f))}</td>`).join('')}<td class="${e?'est':''}"><b>${n.startsWith('Best') ? '—' : vmF(sum(g))}</b></td></tr>`).join('') + '</tbody></table>';
  $('#vm-q4-more').innerHTML = `<b>Reconciliation.</b> Q4 implied by family = Bloomberg FY2026E family rows (Low-NA + High-NA for EUV) − 9M26 actual: total 149.4. Bloomberg's own "Units Shipped" row (435.5) implies 144.5, and its "EUV" row (69.1) implies EUV 20.1. The quarterly consensus column gives 150.3 by family but 147.4 in its own total row; the annual and quarterly consensus come from different contributor sets. Best quarter = highest of Q1'22–Q3'26 (total record 132, Q4'24). Q4'26 guide: net system sales ≈ €11.0B at the midpoint (€14.2–15.2B total − IBM ~€3.7B) vs €8.37B in Q3. Sources: 6-K Q1–Q3 2026; Bloomberg BST Oct 16 2026 (bbg_s1 annual, bbg_s2 quarterly); Q3 2026 press release.`;
}

/* ═════════════ 3 · NEW vs USED · LOGIC vs MEMORY ═════════════ */
const vmMx = { mode:'nu', hidden:new Set(), x:null, y:null };
let vmMxChart;
const VM_MX = {
  nu: { s:'Lithography units per year · 2026 = first nine months',
        ser:[ {key:'new',label:'New',color:'#2563EB',data:VM_NU_NEW}, {key:'used',label:'Used (refurbished)',color:'#93B1F0',data:VM_NU_USED} ],
        note:'Source: ASML Q4 results 6-Ks 2015–2025; Q1–Q3 2026 press releases. ASML does not split new / used by technology.',
        more:'<b>Method.</b> Lithography units only (metrology &amp; inspection excluded). 2017 uses the ASC 606 count (173 new + 24 used = 197; 198 as originally reported).' },
  lm: { s:'Systems per year incl. metrology &amp; inspection · 2017–2025',
        ser:[ {key:'log',label:'Logic',color:'#2563EB',data:VM_LM_LOG}, {key:'mem',label:'Memory',color:'#1E2733',data:VM_LM_MEM} ],
        note:'Source: ASML 20-F Note 2 (FY2019, FY2022, FY2025). Includes M&amp;I tools, so totals exceed litho units.',
        more:'<b>Method.</b> Units include metrology &amp; inspection (535 systems in 2025 = 327 litho + 208 M&amp;I). Not disclosed in units for 2015–2016 (Foundry / IDM / Memory in € only) or for 2026 (quarterly end-use is given only as % of system sales), so those years are left empty.' }
};
function vmRenderMx(){
  const M = VM_MX[vmMx.mode];
  let lo = vmMx.mode==='lm' ? 2 : 0, hi = vmMx.mode==='lm' ? 10 : VM_NU_LBL.length-1;
  if(vmMx.x){ lo = Math.max(lo, vmMx.x[0]); hi = Math.min(hi, vmMx.x[1]); }
  const idx = VM_NU_LBL.map((_,i)=>i).slice(lo, hi+1), vis = M.ser.filter(s=>!vmMx.hidden.has(s.key));
  const tot = idx.map(i => vis.reduce((s,x)=>s+(x.data[i]||0),0));
  if(vmMxChart) vmMxChart.destroy();
  vmMxChart = new Chart($('#vm-mx-chart'), { type:'bar',
    data:{ labels:idx.map(i=>VM_NU_LBL[i]), datasets: vis.map(s=>({ label:s.label, data:idx.map(i=>s.data[i]), backgroundColor:s.color, borderRadius:2, stack:'s', barPercentage:.7 })) },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{display:false}, tooltip: vmTip({ callbacks:{
        label: it => it.parsed.y==null ? null : ` ${it.dataset.label}: ${it.parsed.y} units (${(it.parsed.y/tot[it.dataIndex]*100).toFixed(0)}%)`,
        footer: it => `Total shown: ${tot[it[0].dataIndex]} units` } }) },
      scales:{ x:{stacked:true, grid:{display:false}}, y:{ stacked:true, grid:{color:'#EEF1F5'}, title:{display:true,text:'units'}, min: vmMx.y?vmMx.y[0]:0, max: vmMx.y?vmMx.y[1]:undefined } } } });
  vmMxChart.$lo = lo;
  legend($('#vm-mx-leg'), M.ser, vmMx.hidden, vmRenderMx);
  $('#vm-mx-s').innerHTML = M.s; $('#vm-mx-note').innerHTML = M.note; $('#vm-mx-more').innerHTML = M.more;
  const first = vis[0];
  $('#vm-mx-tbl').innerHTML = `<table><thead><tr><th>Units</th>${idx.map(i=>`<th>${VM_NU_LBL[i]}</th>`).join('')}</tr></thead><tbody>` +
    vis.map(s=>`<tr><td>${s.label}</td>${idx.map(i=>`<td>${vmF(s.data[i])}</td>`).join('')}</tr>`).join('') +
    `<tr><td><b>Total shown</b></td>${tot.map(t=>`<td><b>${t||'—'}</b></td>`).join('')}</tr>` +
    (vis.length===2 ? `<tr><td>${first.label} share</td>${idx.map((i,j)=>`<td>${tot[j] && first.data[i]!=null ? (first.data[i]/tot[j]*100).toFixed(1)+'%' : '—'}</td>`).join('')}</tr>` : '') + '</tbody></table>';
}

/* ═════════════ 4 · CAPACITY & INVESTOR DAY GRIDS ═════════════ */
const VM_CAP_YRS = ['2025','2026','2027','2028','2029','2030'];
const vmCap = { g:'lna', hidden:new Set(), x:null, y:null };
let vmCapChart;
function vmGrpVal(g, ai){ return g.fam.reduce((s,k)=>s+(VM_A[k][ai]||0),0); }
function vmCmdVal(o, gk){ return gk==='duv' ? o.arfi + o.dry : o[gk]; }
function vmRenderCap(){
  const g = VM_GRP.find(x=>x.k===vmCap.g), gk = g.k;
  const act = VM_CAP_YRS.map(y => y==='2025' ? vmGrpVal(g,10) : null);
  const con = VM_CAP_YRS.map(y => { const i = VM_A_LBL.indexOf(y+'E'); return i<0 ? null : vmGrpVal(g,i); });
  const rng = VM_CAP_YRS.map(y => VM_CMD22[y] ? [vmCmdVal(VM_CMD22[y].low,gk), vmCmdVal(VM_CMD22[y].high,gk)] : null);
  const capDef = VM_CAP[gk], cap = VM_CAP_YRS.map(y => capDef && capDef.yrs.includes(y) ? capDef.v : null);
  const SER = [
    { key:'rng', label:'Investor Day 2022 range', color:'#C8D7F4' },
    { key:'act', label:'Actual', color:'#1E2733' },
    { key:'con', label:'Bloomberg consensus', color:'#2563EB' },
    ...(capDef ? [{ key:'cap', label:`2022 capacity plan (${capDef.v}/yr)`, color:'#7C8694', line:true, dash:true }] : [])
  ];
  let lo = 0, hi = VM_CAP_YRS.length-1;
  if(vmCap.x){ lo = Math.max(0, vmCap.x[0]); hi = Math.min(hi, vmCap.x[1]); if(hi<lo){ lo=0; hi=VM_CAP_YRS.length-1; } }
  const sl = a => a.slice(lo, hi+1), H = vmCap.hidden, ds = [];
  if(!H.has('rng')) ds.push({ type:'bar', label:SER[0].label, data:sl(rng), backgroundColor:'rgba(200,215,244,.55)', borderColor:'#93B1F0', borderWidth:1, grouped:false, barPercentage:.95, categoryPercentage:.8, order:3 });
  if(!H.has('act')) ds.push({ type:'bar', label:SER[1].label, data:sl(act), backgroundColor:'#1E2733', grouped:false, barPercentage:.42, categoryPercentage:.8, order:2 });
  if(!H.has('con')) ds.push({ type:'bar', label:SER[2].label, data:sl(con), backgroundColor:'#2563EB59', borderColor:'#2563EB', borderWidth:1, grouped:false, barPercentage:.42, categoryPercentage:.8, order:2 });
  if(capDef && !H.has('cap')) ds.push({ type:'line', label:SER[3].label, data:sl(cap), borderColor:'#7C8694', borderDash:[5,4], borderWidth:2, pointRadius:3, pointBackgroundColor:'#7C8694', spanGaps:false, order:1 });
  if(vmCapChart) vmCapChart.destroy();
  vmCapChart = new Chart($('#vm-cap-chart'), { data:{ labels:sl(VM_CAP_YRS).map(y=> (+y>=2026 && +y<=2029) ? y+'E' : y), datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{display:false}, tooltip: vmTip({ callbacks:{
        label: it => { const r = it.raw; if(r==null) return null; return Array.isArray(r) ? ` ${it.dataset.label}: ${r[0]}–${r[1]} units` : ` ${it.dataset.label}: ${vmF(r)} units`; } } }) },
      scales:{ x:{grid:{display:false}}, y:{ grid:{color:'#EEF1F5'}, title:{display:true,text:`${g.n} units per year`}, min: vmCap.y?vmCap.y[0]:0, max: vmCap.y?vmCap.y[1]:undefined } } } });
  vmCapChart.$lo = lo;
  legend($('#vm-cap-leg'), SER, H, vmRenderCap);
  const yrs = sl(VM_CAP_YRS), yi = y => VM_CAP_YRS.indexOf(y), est = y => +y>=2026 && +y<=2029;
  const row = (lab, f) => `<tr><td>${lab}</td>${yrs.map(y=>`<td class="${est(y)?'est':''}">${f(y)}</td>`).join('')}</tr>`;
  let rows = '';
  if(!H.has('act')) rows += row('Actual (20-F)', y => act[yi(y)]==null ? '' : vmF(act[yi(y)]));
  if(!H.has('con')) rows += row('Bloomberg consensus', y => con[yi(y)]==null ? '' : vmF(con[yi(y)])) +
    row('Consensus YoY', y => { const i=yi(y), p = i===1 ? act[0] : con[i-1]; return con[i]==null||p==null ? '' : sgn(con[i]/p-1); });
  if(!H.has('rng')) rows += row('Investor Day 2022 low–high', y => rng[yi(y)] ? rng[yi(y)].join('–') : '');
  rows += row('Investor Day 2021 low–high (ASML units, restated)', y => y==='2025' ? vmCmdVal(VM_CMD21.low,gk)+'–'+vmCmdVal(VM_CMD21.high,gk) : '');
  rows += row('Investor Day 2018 points (worldwide units)', y => y==='2025' ? VM_CMD18.map(o=>vmCmdVal(o,gk)).join(' / ') : '');
  if(capDef && !H.has('cap')) rows += row('2022 capacity plan', y => cap[yi(y)]==null ? '' : cap[yi(y)]);
  if(gk==='lna' || gk==='arfi') rows += row('Stated capacity step (Q2/Q3\'26)', y => y==='2027' ? '+30% vs 2026' : y==='2028' ? 'further +30% (investigating)' : '');
  $('#vm-cap-tbl').innerHTML = `<table><thead><tr><th>Units</th>${yrs.map(y=>`<th class="${est(y)?'est':''}">${est(y)?y+'E':y}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>`;
  $('#vm-cap-more').innerHTML = `<b>What management said.</b> Q3'26 (Oct 14 2026): "our supply as currently planned for both 2027 and 2028 will not fully meet the demand of our customers"; ASML is investigating ways to raise 2028 capacity beyond the 30% previously communicated, and some customers want to order for 2029 and even 2030. Q2'26: increase 2026 Low-NA EUV and DUV immersion capacity by 30% in 2027, a further 30% for both in 2028 under investigation. Investor Day 2022: 90 EUV + 600 DUV a year (2025–26), 20 High-NA a year (2027–28); not restated in 2024. FY2025 20-F: Carl Zeiss SMT, sole optics supplier, limits how many systems ASML can build.<br>
    <b>Method.</b> ASML has not given its 2026 capacity in units, so the +30% steps are not drawn. Dry DUV = ArF dry + KrF + i-line, as in ASML's grids. The 2021 grid is restated to ASML units in the 2022 CFO deck; the 2018 grid is worldwide units (four modeled points; quadrant labels garbled in the source). The 2024 Investor Day gave € scenarios only. Sources: Investor Day 6-Ks (targets.json); Q2/Q3 2026 press releases; FY2025 20-F; Bloomberg BST Oct 16 2026.`;
}

/* ═════════════ wiring ═════════════ */
function vmZoom(getChart, st, render){ attachZoom(getChart, r => { if(!r){ st.x=null; st.y=null; } else { if(r.x) st.x=r.x; if(r.y) st.y=r.y; } render(); }); }
vmPills('#vm-u-per',  v => { vmU.per = v; vmU.hidden.clear(); vmU.x = null; vmU.y = null; vmRenderU(); });
vmPills('#vm-u-fam',  v => { vmU.fam = v; vmU.hidden.clear(); vmU.y = null; vmRenderU(); });
vmPills('#vm-mx-mode',v => { vmMx.mode = v; vmMx.hidden.clear(); vmMx.x = null; vmMx.y = null; vmRenderMx(); });
vmPills('#vm-cap-g',  v => { vmCap.g = v; vmCap.y = null; vmRenderCap(); });

let vmBuilt = false;
function vmInit(){
  if(vmBuilt) return; vmBuilt = true;
  vmRenderKpis();
  vmRenderU();   vmZoom(() => vmUChart,  vmU,  vmRenderU);
  vmRenderQ4();  vmZoom(() => vmQ4Chart, vmQ4, vmRenderQ4);
  vmRenderMx();  vmZoom(() => vmMxChart, vmMx, vmRenderMx);
  vmRenderCap(); vmZoom(() => vmCapChart,vmCap,vmRenderCap);
}
