registerView({ id:"ov", html:`
    <div class="srow" id="ov-kpis"></div>

    <div class="card">
      <div class="ch">
        <div><div class="ct">Quarterly Net Sales and Margins</div>
        <div class="cs">Systems vs Installed Base Management, € billions · margins % (right axis)</div></div>
        <div class="ctls"><span class="ctl-l">Show</span>
          <div class="fbg" id="ov-q-mode"><button class="fb active" data-m="lvl">€B</button><button class="fb" data-m="yoy">YoY %</button></div>
        </div>
      </div>
      <div class="cb">
        <div class="leg" id="ov-q-leg"></div>
        <div class="ch-wrap"><canvas id="ov-q-chart"></canvas></div>
      </div>
      <details class="tbl"><summary>Show data table</summary><div class="tw" id="ov-q-tbl"></div>
        <div class="snote" style="margin:0;border:none;border-top:1px solid var(--bdr);border-radius:0">Drag to zoom on either axis · double-click resets · a hidden legend item also leaves this table.
          Q3'25–Q3'26: ASML 6-K statements of operations (Oct 14 2026). Q1'22–Q2'25: Summit DCF ASML workbook (Actuals History, Bloomberg-fed, cross-checked to ASML releases).
          Q4 operating income = full year − 9M (the workbook's Q4 columns are empty). Installed Base Management = service + field options.
          Q2'26 net system sales = total − IBM (€9,326M − €2,762M = €6,564M); the workbook carries a rounded €6.6B.</div></details>
      <div class="snote">Source: ASML quarterly 6-K results; Summit DCF workbook for Q1'22–Q2'25.<br>Q4'26E = guidance midpoint (€14.2–15.2B, IBM ~€3.7B, GM ~57%), shown faded / dashed.</div>
    </div>

    <div class="card">
      <div class="ch">
        <div><div class="ct">Where System Sales Came From</div><div class="cs" id="ov-mx-s"></div></div>
        <div class="ctls">
          <span class="ctl-l">Split</span>
          <div class="fbg" id="ov-mx-k"><button class="fb active" data-v="tech">Technology</button><button class="fb" data-v="end">End-use</button><button class="fb" data-v="reg">Region</button></div>
          <span class="ctl-l">Quarter</span>
          <div class="fbg" id="ov-mx-q"><button class="fb" data-q="Q2'26">Q2 2026</button><button class="fb active" data-q="Q3'26">Q3 2026</button></div>
        </div>
      </div>
      <div class="cb">
        <div class="leg" id="ov-mx-leg"></div>
        <div class="ch-wrap"><canvas id="ov-mx-chart"></canvas></div>
      </div>
      <details class="tbl"><summary>Show data table</summary><div class="tw" id="ov-mx-tbl"></div>
        <div class="snote" style="margin:0;border:none;border-top:1px solid var(--bdr);border-radius:0">€ = ASML's whole-percent share × net system sales (€6,564M Q2'26, €8,373M Q3'26), so each € value is derived and rounded to the pie.
          Region = ship-to location. Metrology &amp; Inspection is part of system sales. Lithography units by family are in The Machines view.
          Source: ASML Q3 2026 investor presentation, p. 9 (6-K, Oct 14 2026).</div></details>
      <div class="snote">Source: ASML Q3 2026 investor presentation, p. 9 (6-K, Oct 14 2026).<br>€ values are derived from whole-percent shares of net system sales.</div>
    </div>

    <div class="card">
      <div class="ch"><div><div class="ct">What Management Said (Q3 2026)</div><div class="cs">Results Oct 14 2026 · next print Q4 2026 in January</div></div></div>
      <div class="cb watch">
        <div class="wi"><div class="wk">Supply</div><div><strong>2027–2028 supply will not fully meet demand</strong>; Low-NA EUV and DUV immersion capacity +30% in 2027.</div></div>
        <div class="wi"><div class="wk">Guide</div><div>Q4'26 <strong>€14.2–15.2B</strong> (IBM ~€3.7B), GM ~57% · FY26 <strong>€44–45B</strong> (was €43–45B), GM ~56%.</div></div>
        <div class="wi"><div class="wk">Margin</div><div>Q3 GM 57.5% beat the 55–57% guide, mainly on high-margin installed-base components.</div></div>
        <div class="wi"><div class="wk">One-off</div><div>Q3 net income €4.96B includes ~€0.5B Mistral AI revaluation; operating margin 44.4% is the clean read.</div></div>
        <div class="wi"><div class="wk">Cash</div><div>Q3 buyback ~€4.1B · interim dividend €1.88 · Capital Markets Day June 10 2027.</div></div>
      </div>
      <div class="snote">Source: ASML Q3 2026 press release and investor presentation pp. 4, 6, 11, 13 (6-K, Oct 14 2026).</div>
    </div>
`, init(){ initOv(); } });

/* ═════════════ KPIs (4 tiles) ═════════════ */
function renderOvKpis(){
  const i = 18, py = 14;  // Q3'26 vs Q3'25
  const gm = Q_GP[i]/Q_TOT[i], gmPy = Q_GP[py]/Q_TOT[py];
  const k = [
    ['Q3\'26 net sales', fmtB(Q_TOT[i],2), `<span class="up">${sgn(Q_TOT[i]/Q_TOT[py]-1)}</span> YoY · record quarter`],
    ['Net system sales', fmtB(Q_SYS[i],1), `<span class="up">${sgn(Q_SYS[i]/Q_SYS[py]-1)}</span> YoY · 121 litho units`],
    ['Gross margin', pct(gm), `<span class="up">+${((gm-gmPy)*100).toFixed(1)}pp</span> YoY · guide 55–57%`],
    ['Q4\'26 guide', '€14.2–15.2B', `midpoint <span class="up">${sgn(14700/Q_TOT[15]-1)}</span> YoY · GM ~57%`]
  ];
  $('#ov-kpis').innerHTML = k.map(([l,v,s]) => `<div class="sc"><div class="sl">${l}</div><div class="sv">${v}</div><div class="ss">${s}</div></div>`).join('');
}

/* ═════════════ QUARTERLY CHART ═════════════ */
const qState = { mode:'lvl', hidden:new Set(), x:null, y:null };
let qChart;
const Q_SERIES = [
  { key:'sys', label:'Net system sales', color:C.blue,  type:'bar' },
  { key:'ibm', label:'Installed Base Mgmt', color:C.green, type:'bar' },
  { key:'gm',  label:'Gross margin',    color:C.navy,  type:'line' },
  { key:'om',  label:'Operating margin',color:C.orange,type:'line' }
];
function qValues(){
  const ibm = Q_TOT.map((t,i)=>t-Q_SYS[i]);
  const lvl = { sys:Q_SYS.map(v=>v/1000), ibm:ibm.map(v=>v/1000), tot:Q_TOT.map(v=>v/1000),
    gm:Q_GP.map((g,i)=>g/Q_TOT[i]*100), om:Q_OP.map((o,i)=>o/Q_TOT[i]*100) };
  if(qState.mode==='lvl') return lvl;
  const yoy = a => a.map((v,i)=> i<4 ? null : (v/a[i-4]-1)*100);
  const dpp = a => a.map((v,i)=> i<4 ? null : v - a[i-4]);
  return { sys:yoy(Q_SYS), ibm:yoy(ibm), tot:yoy(Q_TOT), gm:dpp(lvl.gm), om:dpp(lvl.om) };
}
function renderQ(){
  const v = qValues(), yoy = qState.mode==='yoy';
  let lo = 0, hi = Q_LBL.length-1;
  if(yoy) lo = 4;
  if(qState.x){ lo = Math.max(lo, qState.x[0]); hi = Math.min(hi, qState.x[1]); }
  const lbl = Q_LBL.slice(lo, hi+1);
  const sl = a => a.slice(lo, hi+1);
  const estBg = (col, i) => (i+lo) >= Q_EST ? col + '55' : col;
  const ds = Q_SERIES.filter(s=>!qState.hidden.has(s.key)).map(s => {
    if(s.type==='bar') return { type:'bar', label:s.label, data:sl(v[s.key]), backgroundColor:sl(v[s.key]).map((_,i)=>estBg(s.color,i)),
      borderColor:s.color, borderWidth:sl(v[s.key]).map((_,i)=>(i+lo)>=Q_EST?1:0), stack: yoy?s.key:'s', yAxisID:'y', order:2, barPercentage:yoy?.9:.75 };
    return { type:'line', label:s.label + (yoy?' (Δ pp YoY)':''), data:sl(v[s.key]), borderColor:s.color, backgroundColor:s.color, yAxisID: yoy?'y':'y1',
      pointRadius:2.5, borderWidth:2, tension:.25, order:1, segment:{ borderDash: c => (c.p1DataIndex+lo)>=Q_EST ? [4,3] : undefined } };
  });
  const yr = qState.y;
  const opt = {
    responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
    plugins:{ legend:{display:false}, tooltip:{ backgroundColor:C.navy, padding:9, callbacks:{
      title: it => it[0].label + ((it[0].dataIndex+lo)>=Q_EST ? ' — guidance midpoint' : ''),
      label: it => { const y=it.parsed.y; if(y==null) return null;
        if(yoy) return ` ${it.dataset.label}: ${y>=0?'+':''}${y.toFixed(1)}${it.dataset.type==='line'?'pp':'%'}`;
        return ` ${it.dataset.label}: ${it.dataset.yAxisID==='y1' ? y.toFixed(1)+'%' : '€'+y.toFixed(2)+'B'}`; },
      footer: it => { if(yoy) return ''; const i=it[0].dataIndex+lo; return 'Total net sales: €' + (Q_TOT[i]/1000).toFixed(2) + 'B'; } } } },
    scales:{
      x:{ grid:{display:false}, stacked:!yoy },
      y:{ stacked:!yoy, grid:{color:'#EEF1F5'}, title:{display:true,text: yoy?'YoY growth % (bars) · Δ pp (lines)':'€ billions'},
          ticks:{ callback: x => yoy ? x+'%' : '€'+x }, min: yr?yr[0]:undefined, max: yr?yr[1]:undefined },
      y1:{ display:!yoy, position:'right', grid:{display:false}, min:0, max:70, ticks:{callback:x=>x+'%'}, title:{display:true,text:'margin %'} }
    }
  };
  if(qChart) qChart.destroy();
  qChart = new Chart($('#ov-q-chart'), { data:{ labels:lbl, datasets:ds }, options:opt });
  qChart.$lo = lo;
  legend($('#ov-q-leg'), Q_SERIES.map(s=>({...s, line:s.type==='line', label: s.label + (yoy && s.type==='line' ? ' (Δ pp)' : '')})), qState.hidden, renderQ);

  // table mirrors what is drawn (visible range, visible series) — plus total, which every bar sums to
  const rows = [];
  if(!qState.hidden.has('sys') || !qState.hidden.has('ibm')) rows.push(['Total net sales', v.tot, yoy?'%':'€']);
  Q_SERIES.filter(s=>!qState.hidden.has(s.key)).forEach(s => rows.push([s.label, v[s.key], yoy ? (s.type==='line'?'pp':'%') : (s.type==='line'?'m%':'€')]));
  const f = (x,u) => x==null ? '—' : u==='€' ? x.toFixed(2) : u==='m%' ? x.toFixed(1)+'%' : (x>=0?'+':'')+x.toFixed(1)+(u==='pp'?'pp':'%');
  $('#ov-q-tbl').innerHTML = `<table><thead><tr><th>${yoy?'YoY':'€B / %'}</th>${lbl.map((l,i)=>`<th class="${(i+lo)>=Q_EST?'est':''}">${l}</th>`).join('')}</tr></thead><tbody>` +
    rows.map(([n,a,u]) => `<tr><td>${n}</td>${sl(a).map((x,i)=>`<td class="${(i+lo)>=Q_EST?'est':''}">${f(x,u)}</td>`).join('')}</tr>`).join('') + '</tbody></table>';
}

function initQ(){
  renderQ();
  attachZoom(() => qChart, r => { if(!r){ qState.x=null; qState.y=null; } else { if(r.x) qState.x=r.x; if(r.y) qState.y=r.y; } renderQ(); });
}
document.querySelectorAll('#ov-q-mode .fb').forEach(b => b.onclick = () => {
  document.querySelectorAll('#ov-q-mode .fb').forEach(x=>x.classList.remove('active')); b.classList.add('active');
  qState.mode = b.dataset.m; qState.x = null; qState.y = null; renderQ();
});

/* ═════════════ SYSTEM-SALES MIX (one chart, Split × Quarter) ═════════════
   Data: MIX in js/data-overview.js (ASML Q3 2026 investor presentation p. 9). € = share × net system sales (derived). */
const ovMx = { k:'tech', q:"Q3'26", hidden:new Set(), x:null, y:null };
const OV_MX_LBL = { tech:'technology', end:'end-use', reg:'region (ship-to)' };
let ovMxChart;
function ovRenderMix(){
  const m = MIX[ovMx.q], all = m[ovMx.k];
  const items = all.map(r => ({ key:r[0], label:r[0], color:COL[r[0]] || C.grey }));
  const vis = all.filter(r => !ovMx.hidden.has(r[0]));
  let lo = 0, hi = vis.length-1;
  if(ovMx.x){ lo = Math.max(0, ovMx.x[0]); hi = Math.min(hi, ovMx.x[1]); }
  const sh = vis.slice(lo, hi+1);
  const eur = p => p/100*m.sys/1000;
  $('#ov-mx-s').textContent = `By ${OV_MX_LBL[ovMx.k]} · ${ovMx.q.replace("'"," 20")} · net system sales ${fmtB(m.sys,2)} · € billions (derived)`;
  if(ovMxChart) ovMxChart.destroy();
  ovMxChart = new Chart($('#ov-mx-chart'), { type:'bar',
    data:{ labels:sh.map(r=>r[0]), datasets:[{ label:'Net system sales', data:sh.map(r=>eur(r[1])), backgroundColor:sh.map(r=>COL[r[0]]||C.grey), borderRadius:3, maxBarThickness:70 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{display:false}, tooltip:{ backgroundColor:C.navy, padding:9, callbacks:{ label: it => ` ≈€${it.parsed.y.toFixed(2)}B · ${sh[it.dataIndex][1]}% of net system sales` } } },
      scales:{ x:{ grid:{display:false} }, y:{ grid:{color:'#EEF1F5'}, beginAtZero:!ovMx.y, title:{display:true,text:'€ billions (derived)'},
        ticks:{ callback:x=>'€'+x }, min: ovMx.y?ovMx.y[0]:undefined, max: ovMx.y?ovMx.y[1]:undefined } } } });
  ovMxChart.$lo = lo;
  legend($('#ov-mx-leg'), items, ovMx.hidden, () => { ovMx.x = null; ovRenderMix(); });
  const tp = sh.reduce((a,r)=>a+r[1],0);
  $('#ov-mx-tbl').innerHTML = table(['By '+OV_MX_LBL[ovMx.k], '% of net system sales', '€B (derived)'],
    sh.map(r => [r[0], r[1]+'%', eur(r[1]).toFixed(2)]).concat([['<b>Total shown</b>', `<b>${tp}%</b>`, `<b>${eur(tp).toFixed(2)}</b>`]]));
}
function ovInitMix(){
  ovRenderMix();
  attachZoom(() => ovMxChart, r => { if(!r){ ovMx.x=null; ovMx.y=null; } else { if(r.x) ovMx.x=r.x; if(r.y) ovMx.y=r.y; } ovRenderMix(); });
}
pills('#ov-mx-k', v => { ovMx.k = v; ovMx.hidden.clear(); ovMx.x = null; ovMx.y = null; ovRenderMix(); });
pills('#ov-mx-q', v => { ovMx.q = v; ovMx.hidden.clear(); ovMx.x = null; ovMx.y = null; ovRenderMix(); });

/* Not rendered since v3 (density rules): the annual end-use chart (A_* constants stay in data-overview.js),
   the units-by-technology panel (covered by The Machines) and the TSMC read-across box (covered by the TSMC dashboard). */

function initOv(){ renderOvKpis(); initQ(); ovInitMix(); }
