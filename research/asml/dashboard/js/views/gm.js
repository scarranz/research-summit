/* ═════════════ GM BRIDGE & OPEX (gm) — what moves the gross margin, how far it can go, and what opex does ═════════════
   Every number frozen here (€ millions, % of total net sales). Sources:
   - Quarterly actuals Q1'22–Q3'26: 6-K results (asml-work/data/quarterly.json): net sales, gross margin %, R&D, SG&A.
   - Guidance one quarter earlier: Outlook slide of each results presentation (quarterly.json guidance_next_quarter).
   - Annual actuals 2020–2025 and consensus 2026E–2029E: Bloomberg BST, Oct 16 2026 (bbg_s1.tsv; actual columns = reported).
   - Quarterly consensus Q4'26E–Q4'27E: Bloomberg BST, Oct 16 2026 (bbg_s2.tsv).
   - 2030 targets: Investor Day Nov 14 2024 (6-K 0000937966-24-000026 Ex.99.7; targets.json): GM 56–60%, R&D €6.0–6.6B, SG&A €1.7–1.9B, sales €44–60B.
   - Management explanations: asml-work/data/gm_opex_research.md (verbatim, checked against filings). */

const GM_QL = ["Q1'22","Q2'22","Q3'22","Q4'22","Q1'23","Q2'23","Q3'23","Q4'23","Q1'24","Q2'24","Q3'24","Q4'24","Q1'25","Q2'25","Q3'25","Q4'25","Q1'26","Q2'26","Q3'26",
               "Q4'26E","Q1'27E","Q2'27E","Q3'27E","Q4'27E"];
const GM_QA = 19;   // first estimate index
const GM_Q = {
  sales:[3534.4,5430.5,5778.3,6430.2,6746.2,6902.3,6673.0,7237.0,5290.0,6242.8,7467.3,9262.8,7741.5,7691.7,7516.0,9718.1,8766.9,9326.5,11662.0, 14599.6,13075.6,13972.9,15143.6,16152.2],
  gm:   [49.0,49.1,51.8,51.5,50.6,51.3,51.9,51.4,51.0,51.5,50.8,51.7,54.0,53.7,51.6,52.2,53.0,54.0,57.5,                       57.03,56.49,56.82,57.30,57.48],
  rnd:  [738.7,789.1,819.4,906.3,947.9,999.9,991.4,1041.3,1031.9,1100.6,1055.2,1116.0,1161.1,1166.7,1108.7,1262.3,1184.9,1276.6,1174.4, 1250.4,1324.9,1380.7,1416.9,1473.6],
  sga:  [207.7,222.0,235.8,280.4,260.3,281.1,287.8,284.1,273.3,277.0,297.0,318.4,280.7,298.7,303.2,375.2,302.3,302.7,352.6,      403.0,391.5,408.0,425.1,444.0]
};
/* guidance for each quarter, given one quarter earlier (Q1'22 none in our set); last = Q4'26 (given Oct 14 2026) */
const GM_G = {
  gmHi:[null,50,50,49,50,51,50,51,49,51,51,50,53,53,52,53,53,52,57,57],
  gmLo:[null,49,49,49,49,50,50,50,48,50,50,49,52,50,50,51,51,51,55,57],
  rnd: [null,790,810,880,965,990,1000,1030,1070,1070,1100,1090,1140,1200,1200,1200,1200,1200,1200,1200],
  sga: [null,220,235,265,285,275,285,285,300,295,295,300,290,300,310,320,300,300,400,400],
  sales:[null,5200,5250,6350,6300,6750,6750,6900,5250,5950,7000,9000,7750,7450,7650,9500,8550,8700,11500,14700]   // midpoints, for % of sales of the guide
};
/* annual: 2020–2025 reported, 2026E–2029E Bloomberg consensus */
const GM_AL = ['2020','2021','2022','2023','2024','2025','2026E','2027E','2028E','2029E','2030'];
const GM_AE = 6;
const GM_A = {
  sales:[13978.5,18611.0,21173.0,27559.0,28262.9,32667.0, 44444.1,57736.2,72319.9,79739.7],
  gm:   [48.6,52.7,50.5,51.3,51.3,52.8,                  55.54,57.06,58.22,59.40],
  rnd:  [2200.8,2547.0,3253.5,3980.6,4303.7,4698.8,      4986.6,5736.8,6556.5,7179.1],
  sga:  [544.9,725.6,945.9,1113.2,1165.7,1257.8,         1380.1,1624.8,1826.1,2036.9]
};
/* 2026 guide-implied: 9M actual + Q4 guide (our sum). GM: FY guide "around 56%" (Q3'26 release). */
const GM_26 = { gm:56, rnd:1184.9+1276.6+1174.4+1200, sga:302.3+302.7+352.6+400, sales:8766.9+9326.5+11662.0+14700 };
const GM_2030 = { gm:[56,60], rnd:[6000,6600], sga:[1700,1900], sales:[44000,60000] };
/* full-year GM guidance history (CEO statement, each quarterly release) */
const GM_FY = [
  ['Q3\'26 · Oct 2026','2026','around 56%'], ['Q2\'26 · Jul 2026','2026','54–56%'], ['Q1\'26 · Apr 2026','2026','51–53%'], ['Q4\'25 · Jan 2026','2026','51–53%'],
  ['Q3\'25 · Oct 2025','2025','around 52%'], ['Q2\'25 · Jul 2025','2025','around 52%'], ['Q1\'25 · Apr 2025','2025','51–53%'], ['Q4\'24 · Jan 2025','2025','51–53%']
];
/* filled from gm_opex_research.md: per-quarter explanation and the Investor Day 2030 bridge */
const GM_WHY = {
  "Q1'22":[{ q:'“The gross margin of 49.0%, is as guided.” No driver stated.', src:'press release, Apr 20 2022' }],
  "Q2'22":[{ q:'In line with guidance; for the year: “… this delayed revenue recognition, the extra costs related to the planned increase in output capacity and certain inflationary trends …”', src:'press release, Jul 20 2022' }],
  "Q3'22":[{ q:'“… gross margin of 51.8% — above our guidance.” No driver stated.', src:'press release, Oct 19 2022' }],
  "Q4'22":[{ q:'“The gross margin of 51.5% was above our guidance due to additional upgrades and insurance settlement for last year\'s ASML Berlin fire.”', src:'press release, Jan 25 2023' }],
  "Q1'23":[{ q:'“… above our guidance due to higher than expected EUV and DUV revenue from faster installation and earlier acceptance of systems in the quarter.”', src:'press release, Apr 19 2023' }],
  "Q2'23":[{ q:'“… higher than guided, primarily driven by additional DUV immersion revenue in the quarter.”', src:'press release, Jul 19 2023' }],
  "Q3'23":[{ q:'“… higher than guided, primarily driven by the DUV product mix and some one-off costs effects.”', src:'press release, Oct 18 2023' }],
  "Q4'23":[{ q:'“… a gross margin of 51.4%, both slightly above our guidance.” No driver stated; 2024 framed as a “transition year”.', src:'press release, Jan 24 2024' }],
  "Q1'24":[{ q:'“… above guidance, primarily driven by product mix and one-offs.”', src:'press release, Apr 17 2024' }],
  "Q2'24":[{ q:'“… above guidance, both primarily driven by more immersion systems sales.”', src:'press release, Jul 17 2024' }],
  "Q3'24":[{ q:'“The gross margin came in at 50.8%, within guidance.”', src:'press release, Oct 15 2024' },
           { q:'On the Q4 guide: “We expect a dilutive impact of that revenue recognition [two High NA systems] on the gross margin for the quarter of approximately 3.5%.”', src:'Roger Dassen, CFO, video interview, Oct 15 2024' }],
  "Q4'24":[{ q:'“… both above our guidance. This was primarily driven by additional upgrades.”', src:'press release, Jan 29 2025' }],
  "Q1'25":[{ q:'“… above guidance at 54.0 percent, driven by achieving customer productivity milestones on already installed EUV systems as well as a favorable EUV product mix …”', src:'Roger Dassen, CFO, call, Apr 16 2025' },
           { q:'On the wide Q2 guide (50–53%): “… given the uncertainty around the scope and size of the tariffs …”', src:'same call' }],
  "Q2'25":[{ q:'“… above guidance, primarily driven by higher upgrade business and one-offs resulting in lower costs.”', src:'press release, Jul 16 2025' },
           { q:'H2 lower “… primarily due to the margin-dilutive effect of the revenue recognition of a greater number of High NA systems …, lower upgrade revenue and a number of one-offs …”', src:'Roger Dassen, CFO, call, Jul 16 2025' }],
  "Q3'25":[{ q:'“… gross margin of 51.6% were in line with our guidance …”', src:'press release, Oct 15 2025' }],
  "Q4'25":[{ q:'“Gross margin for the quarter was also within guidance at 52.2 percent.” The quarter included 2 High NA systems.', src:'Roger Dassen, CFO, call, Jan 28 2026' }],
  "Q1'26":[{ q:'“… at the high end of our guidance at 53.0 percent primarily due to the contribution of very high margin components within our installed base business.”', src:'Roger Dassen, CFO, call, Apr 15 2026' }],
  "Q2'26":[{ q:'“… above our guidance at 54.0 percent primarily due to the contribution of very high margin components within our Installed Base Management business.”', src:'Roger Dassen, CFO, call, Jul 15 2026' }],
  "Q3'26":[{ q:'“Installed Base Management sales came in above guidance at €3.3 billion as a result of the continued strong demand for productivity upgrades. This drove the gross margin above guidance at 57.5%.”', src:'Christophe Fouquet, CEO, press release, Oct 14 2026' },
           { q:'No reason stated for the Q4 guide of ~57% (Q3 call transcript not yet available).', src:'—', para:true }]
};
/* Investor Day Nov 14 2024, CFO deck Ex.99.7 p.17 "ASML 2025 – 2030 Gross margin bridge (mid-point to mid-point guidance)" */
const GM_BRIDGE = {
  steps:[ { n:'2025 (guide midpoint)', v:52, total:true }, { n:'EUV', v:4 }, { n:'Non-EUV', v:1 }, { n:'IBM', v:1 }, { n:'2030 (range midpoint)', v:58, total:true } ],
  note:'<b>What drives each step (slide wording).</b> EUV: “volume growth and increased productivity in 0.33 NA systems positively impacting the overall GM. The volume growth in the 0.55 NA systems has a small dilutive effect on the overall GM.” ' +
    'Non-EUV: “GM increase is predominantly driven by the increase in volume. This positive GM impact is partly offset by a change in product mix (more DUV dry systems).” ' +
    'IBM: “GM increase due to growth in installed base and move towards more value-based services and upgrades.” ' +
    '<b>Where it stands:</b> 2025 came in at 52.8%; the 2026 guide is ~56% (9M 2026: 55.0%), so about two-thirds of the +6 pts is already in 2026. ASML repeated the 56–60% range in January 2026 and will update its long-term view at the Capital Markets Day on June 10, 2027. No gross margin per scenario is given.'
};

registerView({ id:'gm', html:`
    <div class="srow" id="gm-kpis"></div>

    <section class="card">
      <div class="ch">
        <div><div class="ct">Gross margin against guidance</div><div class="cs">Per quarter · grey box = guidance range given a quarter earlier · axis starts at 40% · click a bar for ASML's explanation</div></div>
      </div>
      <div class="leg" id="gm-q-leg"></div>
      <div class="ch-wrap"><canvas id="gm-q-cv"></canvas></div>
      <div class="gm-why" id="gm-why"></div>
      <details class="tbl"><summary>Data table &amp; method</summary><div class="tw" id="gm-q-tbl"></div><div class="gm-m">Gross margin = gross profit ÷ total net sales (6-K). Guidance band = low–high of the next-quarter GM guide on the Outlook slide; "around X%" is drawn as a line at X. Q4'26: guide ~57% (Oct 14 2026). Consensus = Bloomberg BST quarterly, Oct 16 2026.</div></details>
      <div class="snote">Source: ASML 6-K quarterly results and Outlook slides; Bloomberg consensus, Oct 16 2026.</div>
    </section>

    <section class="card">
      <div class="ch">
        <div><div class="ct">Path to the 2030 gross margin</div><div class="cs" id="gm-p-s"></div></div>
        <div class="ctls"><span><span class="ctl-l">View</span><div class="fbg" id="gm-p-view"><button class="fb active" data-v="path">By year</button><button class="fb" data-v="br">ASML's 2030 bridge</button></div></span></div>
      </div>
      <div class="leg" id="gm-p-leg"></div>
      <div class="ch-wrap"><canvas id="gm-p-cv"></canvas></div>
      <details class="tbl"><summary>Data table, guidance history &amp; method</summary><div class="tw" id="gm-p-tbl"></div><div class="gm-m" id="gm-p-m"></div></details>
      <div class="snote">Source: 20-F / Bloomberg (reported 2020–25); Q3 2026 release (2026 guide); Bloomberg consensus, Oct 16 2026; Investor Day Nov 2024 (2030 range and bridge).</div>
    </section>

    <section class="card">
      <div class="ch">
        <div><div class="ct">Operating expenses</div><div class="cs" id="gm-o-s"></div></div>
        <div class="ctls"><span><span class="ctl-l">Period</span><div class="fbg" id="gm-o-per"><button class="fb active" data-v="a">Annual</button><button class="fb" data-v="q">Quarterly</button></div></span>
          <span><span class="ctl-l">Metric</span><div class="fbg" id="gm-o-met"><button class="fb active" data-v="rnd">R&amp;D €</button><button class="fb" data-v="rndp">R&amp;D % sales</button><button class="fb" data-v="sga">SG&amp;A €</button><button class="fb" data-v="sgap">SG&amp;A % sales</button></div></span></div>
      </div>
      <div class="leg" id="gm-o-leg"></div>
      <div class="ch-wrap"><canvas id="gm-o-cv"></canvas></div>
      <details class="tbl"><summary>Data table &amp; method</summary><div class="tw" id="gm-o-tbl"></div><div class="gm-m" id="gm-o-m"></div></details>
      <div class="snote" id="gm-o-note"></div>
    </section>
`, css:`
  #v-gm .gm-m{padding:10px 13px;font-size:11px;line-height:1.6;color:var(--mu);border-top:1px solid var(--bdr)}
  #v-gm .gm-why{margin-top:12px;padding:10px 14px;border-left:3px solid var(--navy);background:var(--pale);border-radius:0 8px 8px 0;font-size:12.5px;line-height:1.55;color:var(--ink2);min-height:44px}
  #v-gm .gm-why .w{font-size:10.5px;color:var(--mu);margin-bottom:3px}
  #v-gm .gm-why .n{color:var(--mu);font-style:italic}
  #v-gm .gm-why p{margin:4px 0 0}
`, init(){ gmInit(); } });

const gmF1 = x => x == null ? '—' : x.toFixed(1) + '%';
const gmFM = x => x == null ? '—' : '€' + Math.round(x).toLocaleString('en-US') + 'M';
const gmRange = (st, n) => { let lo = 0, hi = n - 1; if(st.x){ lo = Math.max(0, st.x[0]); hi = Math.min(hi, st.x[1]); if(hi < lo){ lo = 0; hi = n - 1; } } return [lo, hi]; };
const gmZoom = (st, render) => attachZoom(() => st.chart, r => { if(!r){ st.x = null; st.y = null; } else { if(r.x) st.x = r.x; if(r.y) st.y = r.y; } render(); });

/* ═════════════ tiles ═════════════ */
function gmKpis(){
  const s = (a, i0, i1) => a.slice(i0, i1 + 1).reduce((x, y) => x + y, 0);
  const ox26 = (s(GM_Q.rnd,16,18) + s(GM_Q.sga,16,18)) / s(GM_Q.sales,16,18), ox25 = (s(GM_Q.rnd,12,14) + s(GM_Q.sga,12,14)) / s(GM_Q.sales,12,14);
  const k = [
    ["Gross margin, Q3'26", gmF1(GM_Q.gm[18]), `guide was ${GM_G.gmLo[18]}–${GM_G.gmHi[18]}%`],
    ['Gross margin, FY2026 guide', '~56%', 'January guide: 51–53%'],
    ['R&D + SG&A, 9M 2026', pct(ox26, 1) + ' of sales', `9M 2025: ${pct(ox25, 1)}`],
    ['2030 target (Nov 2024)', '56–60%', `consensus 2029E: ${gmF1(GM_A.gm[9])}`]
  ];
  $('#gm-kpis').innerHTML = k.map(([l,v,t]) => `<div class="sc"><div class="sl">${l}</div><div class="sv">${v}</div><div class="ss">${t}</div></div>`).join('');
}

/* ═════════════ 1 · GM vs guidance, quarterly ═════════════ */
const gmQ = { hidden:new Set(), x:null, y:null, chart:null, sel:18 };
function gmQRender(){
  const n = GM_QL.length, [lo, hi] = gmRange(gmQ, n), idx = GM_QL.map((_,i)=>i).slice(lo, hi + 1), H = gmQ.hidden;
  const band = i => i < GM_G.gmHi.length && GM_G.gmHi[i] != null ? [GM_G.gmLo[i] - (GM_G.gmLo[i] === GM_G.gmHi[i] ? .15 : 0), GM_G.gmHi[i] + (GM_G.gmLo[i] === GM_G.gmHi[i] ? .15 : 0)] : null;
  const ser = [
    { key:'g',   label:'Guidance range (a quarter earlier)', color:'#A9B4C2' },
    { key:'act', label:'Reported', color:'#3E5A82' },
    { key:'con', label:'Bloomberg consensus', color:'#3E5A82', est:true }
  ];
  const ds = [];
  if(!H.has('act')) ds.push({ type:'bar', label:ser[1].label, data:idx.map(i => i < GM_QA ? GM_Q.gm[i] : null), grouped:false, barPercentage:.55, borderRadius:2, order:2,
    backgroundColor: idx.map(i => i === gmQ.sel ? '#2563EB' : '#3E5A82') });
  if(!H.has('con')) ds.push({ type:'bar', label:ser[2].label, data:idx.map(i => i >= GM_QA ? GM_Q.gm[i] : null), grouped:false, barPercentage:.55, borderRadius:2, order:2,
    backgroundColor:'#3E5A8255', borderColor:'#3E5A82', borderWidth:1 });
  if(!H.has('g'))   ds.push({ type:'bar', label:ser[0].label, data:idx.map(band), grouped:false, barPercentage:.9, order:1,
    backgroundColor:'rgba(169,180,194,.45)', borderColor:'#7C8694', borderWidth:{ top:2, bottom:2, left:0, right:0 }, borderSkipped:false });
  if(gmQ.chart) gmQ.chart.destroy();
  gmQ.chart = new Chart($('#gm-q-cv'), { data:{ labels:idx.map(i => GM_QL[i]), datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{ mode:'index', intersect:false },
      onClick:(e, els) => { if(!els.length) return; const i = idx[els[0].index]; if(i < GM_QA){ gmQ.sel = i; gmQRender(); } },
      plugins:{ legend:{display:false}, tooltip:{ ...TIP, filter: it => it.raw != null, callbacks:{
        title: it => GM_QL[idx[it[0].dataIndex]] + (idx[it[0].dataIndex] >= GM_QA ? ' · Bloomberg consensus, Oct 16 2026' : ''),
        label: it => { const r = it.raw; return ' ' + it.dataset.label + ': ' + (Array.isArray(r) ? (GM_G.gmLo[idx[it.dataIndex]] === GM_G.gmHi[idx[it.dataIndex]] ? `around ${GM_G.gmLo[idx[it.dataIndex]]}%` : `${GM_G.gmLo[idx[it.dataIndex]]}–${GM_G.gmHi[idx[it.dataIndex]]}%`) : gmF1(r)); } } } },
      scales:{ x:{ grid:{display:false}, ticks:{ maxRotation:0, autoSkip:true } },
        y:{ grid:{color:'#EEF1F5'}, title:{ display:true, text:'gross margin, % of sales' }, min: gmQ.y ? gmQ.y[0] : 40, max: gmQ.y ? gmQ.y[1] : 60 } } } });
  gmQ.chart.$lo = lo;
  legend($('#gm-q-leg'), ser.map(s => ({ key:s.key, label:s.label, color:s.est ? '#3E5A8266' : s.color })), H, gmQRender);
  const rows = [];
  if(!H.has('act')) rows.push(['Reported'].concat(idx.map(i => i < GM_QA ? gmF1(GM_Q.gm[i]) : '')));
  if(!H.has('g')) rows.push(['Guide, high'].concat(idx.map(i => GM_G.gmHi[i] == null ? '' : GM_G.gmHi[i] + '%')), ['Guide, low'].concat(idx.map(i => GM_G.gmLo[i] == null ? '' : GM_G.gmLo[i] + '%')));
  if(!H.has('act') && !H.has('g')) rows.push(['Reported − guide midpoint'].concat(idx.map(i => i < GM_QA && GM_G.gmHi[i] != null ? sgnPp(GM_Q.gm[i] - (GM_G.gmHi[i] + GM_G.gmLo[i]) / 2) : '')));
  if(!H.has('con')) rows.push(['Bloomberg consensus'].concat(idx.map(i => i >= GM_QA ? gmF1(GM_Q.gm[i]) : '')));
  $('#gm-q-tbl').innerHTML = table(['Gross margin'].concat(idx.map(i => GM_QL[i])), rows, new Set(idx.map((i,j) => i >= GM_QA ? j + 1 : -1)));
  gmWhy();
}
const sgnPp = x => (x >= 0 ? '+' : '') + x.toFixed(1) + 'pp';
function gmWhy(){
  const i = gmQ.sel, q = GM_QL[i], w = GM_WHY[q], g = GM_G.gmHi[i] != null ? (GM_G.gmLo[i] === GM_G.gmHi[i] ? `around ${GM_G.gmLo[i]}%` : `${GM_G.gmLo[i]}–${GM_G.gmHi[i]}%`) : 'n/a';
  const head = `<div class="w">${q} · reported ${gmF1(GM_Q.gm[i])} · guide ${g}</div>`;
  $('#gm-why').innerHTML = head + (w ? w.map(x => `<p>${x.q}${x.para ? ' <span class="n">(summary, not a quote)</span>' : ''} <span class="n">— ${x.src}</span></p>`).join('') : '<p class="n">No explanation stated by ASML for this quarter.</p>');
}

/* ═════════════ 2 · path to 2030 ═════════════ */
const gmP = { view:'path', hidden:new Set(), x:null, y:null, chart:null };
function gmPRender(){
  const H = gmP.hidden;
  if(gmP.chart) gmP.chart.destroy();
  if(gmP.view === 'br'){
    $('#gm-p-s').textContent = 'Investor Day Nov 2024: gross-margin bridge from 2025 to 2030 (moderate scenario), percentage points';
    if(!GM_BRIDGE){ $('#gm-p-leg').innerHTML = ''; $('#gm-p-tbl').innerHTML = ''; return; }
    const B = GM_BRIDGE.steps; let run = 0;
    const data = B.map(s => { if(s.total){ run = s.v; return [0, s.v]; } const a = run; run += s.v; return [a, run]; });
    gmP.chart = new Chart($('#gm-p-cv'), { type:'bar', data:{ labels:B.map(s => s.n), datasets:[{ label:'Gross margin bridge', data,
        backgroundColor:B.map(s => s.total ? '#3E5A82' : s.v >= 0 ? '#93B1F0' : '#DC2626'), borderRadius:2, barPercentage:.6 }] },
      options:{ responsive:true, maintainAspectRatio:false, animation:false,
        plugins:{ legend:{display:false}, tooltip:{ ...TIP, callbacks:{ label: it => { const s = B[it.dataIndex]; return s.total ? ` ${s.v}%` : ` ${s.v >= 0 ? '+' : ''}${s.v}pp`; } } } },
        scales:{ x:{ grid:{display:false} }, y:{ min:45, max:62, grid:{color:'#EEF1F5'}, title:{ display:true, text:'gross margin, %' } } } } });
    $('#gm-p-leg').innerHTML = '';
    $('#gm-p-tbl').innerHTML = table(['Step', 'Value'], B.map(s => [s.n, s.total ? s.v + '%' : (s.v >= 0 ? '+' : '') + s.v + 'pp']));
    $('#gm-p-m').innerHTML = GM_BRIDGE.note;
    return;
  }
  $('#gm-p-s').textContent = 'Per year · % of total net sales · 2026 = ASML full-year guide · 2030 = Investor Day range';
  const L = GM_AL, n = L.length, [lo, hi] = gmRange(gmP, n), idx = L.map((_,i)=>i).slice(lo, hi + 1);
  const ser = [
    { key:'act', label:'Reported', color:'#3E5A82' },
    { key:'gd',  label:'2026 guide (around 56%)', color:'#1E2733', pt:true },
    { key:'con', label:'Bloomberg consensus', color:'#3E5A82', est:true },
    { key:'tgt', label:'2030 range, Investor Day Nov 2024', color:'#A9B4C2' }
  ];
  const ds = [];
  if(!H.has('act')) ds.push({ type:'bar', label:ser[0].label, data:idx.map(i => i < GM_AE ? GM_A.gm[i] : null), backgroundColor:'#3E5A82', borderRadius:2, grouped:false, barPercentage:.6, order:2 });
  if(!H.has('con')) ds.push({ type:'bar', label:ser[2].label, data:idx.map(i => i >= GM_AE && i < 10 ? GM_A.gm[i] : null), backgroundColor:'#3E5A8255', borderColor:'#3E5A82', borderWidth:1, borderRadius:2, grouped:false, barPercentage:.6, order:2 });
  if(!H.has('tgt')) ds.push({ type:'bar', label:ser[3].label, data:idx.map(i => i === 10 ? GM_2030.gm : null), backgroundColor:'rgba(169,180,194,.45)', borderColor:'#A9B4C2', borderWidth:1, grouped:false, barPercentage:.6, order:2 });
  if(!H.has('gd'))  ds.push({ type:'line', label:ser[1].label, data:idx.map(i => i === GM_AE ? GM_26.gm : null), showLine:false, pointStyle:'rectRot', pointRadius:7, backgroundColor:'#1E2733', borderColor:'#fff', order:0 });
  gmP.chart = new Chart($('#gm-p-cv'), { data:{ labels:idx.map(i => L[i]), datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{display:false}, tooltip:{ ...TIP, filter: it => it.raw != null, callbacks:{ label: it => ' ' + it.dataset.label + ': ' + (Array.isArray(it.raw) ? `${it.raw[0]}–${it.raw[1]}%` : gmF1(it.raw)) } } },
      scales:{ x:{ grid:{display:false} }, y:{ grid:{color:'#EEF1F5'}, title:{ display:true, text:'gross margin, % of sales' }, min: gmP.y ? gmP.y[0] : 45, max: gmP.y ? gmP.y[1] : 62 } } } });
  gmP.chart.$lo = lo;
  legend($('#gm-p-leg'), ser.map(s => ({ key:s.key, label:s.label, color:s.est ? '#3E5A8266' : s.color, line:!!s.pt })), H, gmPRender);
  const rows = [];
  if(!H.has('act')) rows.push(['Reported'].concat(idx.map(i => i < GM_AE ? gmF1(GM_A.gm[i]) : '')));
  if(!H.has('gd'))  rows.push(['ASML FY2026 guide'].concat(idx.map(i => i === GM_AE ? '~56%' : '')));
  if(!H.has('con')) rows.push(['Bloomberg consensus'].concat(idx.map(i => i >= GM_AE && i < 10 ? gmF1(GM_A.gm[i]) : '')));
  if(!H.has('tgt')) rows.push(['2030 range (Nov 2024)'].concat(idx.map(i => i === 10 ? '56–60%' : '')));
  $('#gm-p-tbl').innerHTML = table(['Gross margin'].concat(idx.map(i => L[i])), rows, new Set(idx.map((i,j) => i >= GM_AE ? j + 1 : -1))) +
    '<div class="gm-m"><b>Full-year guidance as it moved.</b></div>' + table(['Given with', 'For year', 'Gross margin guide'], GM_FY);
  $('#gm-p-m').innerHTML = `<b>Method.</b> Reported 2020–2025 = Bloomberg actual columns (match the 20-F). 2026 = ASML full-year guide "around 56%" (Q3 2026 release); Q1–Q3 2026 averaged ${pct(( 4645 + 5035.4 + 6699.8) / (8766.9 + 9326.5 + 11662), 1)}. ` +
    `2030 = Investor Day Nov 2024 scenario range 56–60% on sales of €44–60B (same range as the Nov 2022 Investor Day). Earlier targets for 2025: 54–56% (2021 and 2022 Investor Days); 2025 came in at 52.8%.`;
}

/* ═════════════ 3 · opex ═════════════ */
const gmO = { per:'a', met:'rnd', hidden:new Set(), x:null, y:null, chart:null };
function gmOData(){
  const m = gmO.met.replace('p',''), shr = gmO.met.endsWith('p'), nm = m === 'rnd' ? 'R&D' : 'SG&A';
  const v = (x, s) => x == null ? null : shr ? x / s * 100 : x;
  if(gmO.per === 'a'){
    const L = GM_AL, act = L.map((_,i) => i < GM_AE ? v(GM_A[m][i], GM_A.sales[i]) : null);
    const con = L.map((_,i) => i >= GM_AE && i < 10 ? v(GM_A[m][i], GM_A.sales[i]) : null);
    const gd = L.map((_,i) => i === GM_AE ? v(GM_26[m], GM_26.sales) : null);
    const tgt = L.map((_,i) => i === 10 && !shr ? GM_2030[m] : null);
    return { L, E:GM_AE, shr, nm, ser:[ { key:'act', label:'Reported', color:'#1E2733', kind:'bar', data:act }, { key:'con', label:'Bloomberg consensus', color:'#1E2733', kind:'bar', est:true, data:con },
      { key:'gd', label:'2026: 9M actual + Q4 guide', color:'#2563EB', kind:'pt', data:gd }, ...(shr ? [] : [{ key:'tgt', label:'2030 range, Investor Day Nov 2024', color:'#A9B4C2', kind:'bar', data:tgt }]) ] };
  }
  const L = GM_QL, act = L.map((_,i) => i < GM_QA ? v(GM_Q[m][i], GM_Q.sales[i]) : null);
  const con = L.map((_,i) => i >= GM_QA ? v(GM_Q[m][i], GM_Q.sales[i]) : null);
  const gd = L.map((_,i) => i < GM_G[m].length && GM_G[m][i] != null ? v(GM_G[m][i], GM_G.sales[i]) : null);
  return { L, E:GM_QA, shr, nm, ser:[ { key:'act', label:'Reported', color:'#1E2733', kind:'bar', data:act }, { key:'con', label:'Bloomberg consensus', color:'#1E2733', kind:'bar', est:true, data:con },
    { key:'gd', label:'ASML guide, a quarter earlier' + (shr ? ' (÷ sales guide midpoint)' : ''), color:'#2563EB', kind:'pt', data:gd } ] };
}
function gmORender(){
  const { L, E, shr, nm, ser } = gmOData(), H = gmO.hidden, [lo, hi] = gmRange(gmO, L.length), idx = L.map((_,i)=>i).slice(lo, hi + 1), vis = ser.filter(s => !H.has(s.key));
  const fv = x => shr ? gmF1(x) : gmFM(x);
  const ds = vis.map(s => s.kind === 'pt'
    ? { type:'line', label:s.label, data:idx.map(i => s.data[i]), showLine:false, pointStyle:'rectRot', pointRadius:6, backgroundColor:s.color, borderColor:'#fff', order:0 }
    : { type:'bar', label:s.label, data:idx.map(i => s.data[i]), grouped:false, barPercentage:.65, borderRadius:2, order:2,
        backgroundColor: s.est ? s.color + '55' : s.key === 'tgt' ? 'rgba(169,180,194,.45)' : s.color, borderColor:s.color, borderWidth: s.est || s.key === 'tgt' ? 1 : 0 });
  if(gmO.chart) gmO.chart.destroy();
  gmO.chart = new Chart($('#gm-o-cv'), { data:{ labels:idx.map(i => L[i]), datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{display:false}, tooltip:{ ...TIP, filter: it => it.raw != null, callbacks:{
        title: it => L[idx[it[0].dataIndex]] + (idx[it[0].dataIndex] >= E ? ' · estimate' : ''),
        label: it => ' ' + it.dataset.label + ': ' + (Array.isArray(it.raw) ? `€${(it.raw[0]/1000).toFixed(1)}–${(it.raw[1]/1000).toFixed(1)}B` : fv(it.raw)) } } },
      scales:{ x:{ grid:{display:false}, ticks:{ maxRotation:0, autoSkip:true } },
        y:{ beginAtZero:true, grid:{color:'#EEF1F5'}, title:{ display:true, text: shr ? `${nm}, % of total net sales` : `${nm}, € millions` }, min: gmO.y ? gmO.y[0] : 0, max: gmO.y ? gmO.y[1] : undefined } } } });
  gmO.chart.$lo = lo;
  legend($('#gm-o-leg'), ser.map(s => ({ key:s.key, label:s.label, color: s.est ? s.color + '66' : s.color, line: s.kind === 'pt' })), H, gmORender);
  $('#gm-o-s').textContent = `${nm} · ${gmO.per === 'a' ? 'per year, 2020–2029E and the 2030 range' : "per quarter, Q1'22–Q4'27E"} · ${shr ? '% of total net sales' : '€ millions'}`;
  const cell = (s, i) => { const r = s.data[i]; return r == null ? '' : Array.isArray(r) ? `€${(r[0]/1000).toFixed(1)}–${(r[1]/1000).toFixed(1)}B` : fv(r); };
  $('#gm-o-tbl').innerHTML = table([nm].concat(idx.map(i => L[i])), vis.map(s => [s.label].concat(idx.map(i => cell(s, i)))), new Set(idx.map((i,j) => i >= E ? j + 1 : -1)));
  $('#gm-o-m').innerHTML = `<b>Method.</b> R&amp;D and SG&amp;A as reported (6-K, 20-F; annual 2020–25 = Bloomberg actual columns). Guide = "around €X" on the previous quarter's Outlook slide; as % of sales it is divided by the midpoint of that quarter's sales guide. ` +
    `2026 = Q1–Q3 actual + Q4 guide (R&amp;D ~€1.2B, SG&amp;A ~€0.4B) = R&amp;D ${gmFM(GM_26.rnd)}, SG&amp;A ${gmFM(GM_26.sga)}; our sum. 2030 = Investor Day Nov 2024: R&amp;D €6.0–6.6B, SG&amp;A €1.7–1.9B, on sales of €44–60B (R&amp;D 11–14%, SG&amp;A ~3–4% of sales); not drawn in % mode. ` +
    `Bloomberg's "Total Operating Expenses" row does not equal R&amp;D + SG&amp;A, so the two are shown separately.<br><br>` +
    `<b>What management said.</b> Q4'25 (Dassen, Jan 28 2026): R&amp;D “slightly higher than expected … mainly due to higher non-recurring personnel cost and the recognition of a grant that shifted into 2026”; SG&amp;A higher on “mainly non-recurring, salary-related costs, the sale of receivables and pull-in of certain IT spending.” ` +
    `Q2'26 (Dassen, Jul 15 2026): opex “higher than guided due to the recognition of estimated costs related to the Technology and IT transformation in Q2, primarily in R&amp;D” (amount not stated). ` +
    `Jan 2026: streamlining Technology and IT “could result in a net reduction of 1,700 positions” (FY2025 20-F, Fouquet); more than 44,000 FTE. FY2025: R&amp;D “about 14 percent of sales”, SG&amp;A “about 4 percent” (Dassen, Jan 28 2026).`;
  $('#gm-o-note').innerHTML = 'Source: 6-K quarterly results and Outlook slides; Bloomberg consensus, Oct 16 2026; Investor Day Nov 2024.' + (gmO.met === 'rndp' ? ' At 2029E sales, each 1 pt of R&amp;D/sales is about €0.8B of operating income.' : '');
}

pills('#gm-p-view', v => { gmP.view = v; gmP.hidden.clear(); gmP.x = null; gmP.y = null; gmPRender(); });
pills('#gm-o-per', v => { gmO.per = v; gmO.hidden.clear(); gmO.x = null; gmO.y = null; gmORender(); });
pills('#gm-o-met', v => { gmO.met = v; gmO.hidden.clear(); gmO.y = null; gmORender(); });

let gmBuilt = false;
function gmInit(){
  if(gmBuilt) return; gmBuilt = true;
  gmKpis();
  gmQRender(); gmZoom(gmQ, gmQRender);
  gmPRender(); gmZoom(gmP, gmPRender);
  gmORender(); gmZoom(gmO, gmORender);
}
