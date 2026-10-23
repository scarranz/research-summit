/* ═════════════ CUSTOMERS & GEOGRAPHY (id: cust) ═════════════
   Who buys ASML's machines, where they are shipped, and how concentrated that is.
   Everything is frozen below (€ millions unless noted). Two bases that must never be mixed:
     · ANNUAL  = % / € of TOTAL net sales (systems + IBM) by location of the customer's fab — 20-F segment note.
     · QUARTERLY = % of NET SYSTEM SALES by ship-to, as printed (whole %) on the 6-K presentation pies.
   Quarterly € are derived = pie % × net system sales (Q_SYS, data-overview.js), so they inherit the ±0.5pp rounding. */

registerView({ id:'cust', html:`
    <div class="srow" id="cust-kpis"></div>

    <div class="card">
      <div class="ch">
        <div><div class="ct">Where ASML's sales go</div><div class="cs" id="cust-geo-s"></div></div>
        <div class="ctls">
          <div style="display:flex;align-items:center"><span class="ctl-l">Period</span><div class="fbg" id="cust-geo-b"><button class="fb active" data-v="a">Annual</button><button class="fb" data-v="q">Quarterly</button></div></div>
          <div style="display:flex;align-items:center"><span class="ctl-l">Unit</span><div class="fbg" id="cust-geo-u"><button class="fb active" data-v="eur">€B</button><button class="fb" data-v="shr">Share %</button></div></div>
        </div>
      </div>
      <div class="leg" id="cust-geo-leg"></div>
      <div class="ch-wrap"><canvas id="cust-geo-c"></canvas></div>
      <details class="tbl"><summary>Data table &amp; method</summary><div class="tw" id="cust-geo-t"></div>
        <div class="cust-m">Annual: 20-F segment note (FY2025 20-F Note 3, p. 288; earlier years from the FY2022 / FY2019 / FY2017 20-F), total net sales (systems + Installed Base Management) by location of the customer's fab. 2015–2016 pre-ASC 606. "Korea" before 2020 = South Korea. Rest = Singapore, other Asia, EMEA, Netherlands.<br>
        Quarterly: 6-K presentation pie "Net system sales breakdown" by ship-to region, whole percent as printed; systems only, no IBM. € = pie % × net system sales (derived, ±0.5pp rounding). A region absent from a pie is shown as —, not zero. Drag to zoom, double-click to reset; a hidden region leaves the table and totals.</div></details>
      <div class="snote">Source: ASML 20-F segment notes (annual) and 6-K quarterly pies. Annual = % of total sales; quarterly = % of system sales only.</div>
    </div>

    <div class="card">
      <div class="ch">
        <div><div class="ct">China share and the export-control record</div><div class="cs" id="cust-cn-s"></div></div>
        <div class="ctls"><div style="display:flex;align-items:center"><span class="ctl-l">Period</span><div class="fbg" id="cust-cn-b"><button class="fb active" data-v="a">Annual</button><button class="fb" data-v="q">Quarterly</button></div></div></div>
      </div>
      <div class="leg" id="cust-cn-leg"></div>
      <div class="ch-wrap"><canvas id="cust-cn-c"></canvas></div>
      <details class="tbl"><summary>Export-control events (numbered on the chart)</summary><div class="tw" id="cust-cn-ev"></div>
        <div class="cust-m">Sources: 20-F FY2025 p. 23 "Global geopolitics – export controls" and risk factors (China 29.1% of 2025, 36.1% of 2024 total net sales); 2019–2024 rules from The Register (Sep 6 2024) and Asia Times (Jan 2024), as compiled in asml-work overview.json. "No EUV ever shipped to China" is from press reports, not stated in those words in the 20-F. Markers show timing only; no causal claim.</div></details>
      <details class="tbl"><summary>Data table</summary><div class="tw" id="cust-cn-t"></div>
        <div class="cust-m">2026E = ASML outlook, "around 20 percent" of 2026 total net sales, in line with the China share of its system backlog (Q4 2025 call, Jan 28 2026; reaffirmed on the Q2 2026 call, Jul 15 2026). Quarterly values are % of net system sales (6-K pies), a different basis from the annual line.</div></details>
      <div class="snote">Source: 20-F segment notes, 6-K pies, 20-F FY2025 p. 23. 2026E (dashed) is ASML's outlook, not an actual.</div>
    </div>

    <div class="card">
      <div class="ch"><div><div class="ct">How concentrated the customer base is</div><div class="cs">% of total net sales · ASML does not name its customers</div></div></div>
      <div class="leg" id="cust-cc-leg"></div>
      <div class="ch-wrap"><canvas id="cust-cc-c"></canvas></div>
      <details class="tbl"><summary>Data table &amp; method</summary><div class="tw" id="cust-cc-t"></div>
        <div class="cust-m">Largest customer: 20-F risk factor "A high percentage of net sales is derived from a few customers" (FY2025 20-F p. 69) and earlier 20-Fs. Customers &gt;10%: segment note (FY2025, FY2024, FY2022, FY2021, FY2020 20-F); not disclosed 2015–2017; 2022–2025 stated only in € billions. Top two stated for 2023–2025; 2021–2022 = the two customers above 10% (only two crossed it).<br>
        Receivables of the three largest customers (FY2025 20-F credit-risk note): 64.4% (€3.7B) end-2023 · 54.1% (€2.6B) end-2024 · 35.4% (€1.3B) end-2025.</div></details>
      <div class="snote">Source: ASML 20-F risk factors and segment note. Customers &gt;10% not disclosed before 2018.</div>
    </div>

    <div class="card">
      <div class="ch">
        <div><div class="ct">Order book — bookings and backlog</div><div class="cs" id="cust-bk-s"></div></div>
        <div class="ctls"><div style="display:flex;align-items:center"><span class="ctl-l">Period</span><div class="fbg" id="cust-bk-b"><button class="fb active" data-v="a">Annual</button><button class="fb" data-v="q">Quarterly</button></div></div></div>
      </div>
      <div class="leg" id="cust-bk-leg"></div>
      <div class="ch-wrap"><canvas id="cust-bk-c"></canvas></div>
      <details class="tbl"><summary>Data table &amp; method</summary><div class="tw" id="cust-bk-t"></div>
        <div class="cust-m">Q4 results 6-Ks 2015–2025, 20-F five-year summaries and quarterly 6-K press releases Q1 2022–Q4 2025. Last quarterly print: Q4 2025 €13.2B, of which EUV €7.4B; ASML now gives only the year-end backlog (€38.8B at end-2025, 65% EUV). Bookings include inflation-related adjustments from about 2022; 2015–2017 bookings and backlog are pre-ASC 606; 2018–2020 bookings exclude High-NA. Backlog 2018–2021 not disclosed; 2022–2023 only rounded (€40.4B, €39.0B). EUV share of backlog: "about half" end-2016 (text), 46% end-2017, 62% / 65% end-2024 / 2025 (Q4'25 deck p. 12). EUV bookings Q1'22–Q3'23 rounded to €0.1B. Book-to-bill = net bookings ÷ net system sales (derived).</div></details>
      <div class="snote">Source: ASML Q4 / quarterly 6-Ks and 20-F. Bookings no longer published after Q4 2025.</div>
    </div>
`, css:`
  #v-cust .cust-m{font-size:11px;color:#5A6472;line-height:1.55;padding:10px 13px;border-top:1px solid #E7EAEE}
`, init(){ custInit(); } });

/* ═════════════ FROZEN DATA ═════════════ */
const CUST_YRS = ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'];

/* Total net sales by customer location, € millions — 20-F segment note (asml-work/data/annual.json net_sales_by_customer_location).
   Rest = Singapore + Rest of Asia + EMEA + Netherlands. Rows sum to total net sales (checked in custInit). */
const CUST_GEO_A = {
  tw:  [1551.5,2084.7,2096.7,1989.5,5357.0,4731.3,7327.9,8095.5,8074.6,4354.0,8337.9],
  kr:  [1971.7,1579.9,3031.4,3725.1,2202.1,4151.6,6223.0,6045.6,6949.2,6408.8,8159.6],
  cn:  [541.9,779.5,919.5,1842.8,1377.7,2324.4,2740.8,2916.0,7251.8,10195.1,9519.7],
  us:  [1215.9,1128.0,1418.1,1961.7,1980.2,1657.0,1583.2,1991.3,3151.4,4521.8,4089.1],
  jp:  [668.4,404.3,404.3,567.6,463.2,542.8,459.3,1008.6,613.6,1156.0,1420.9],
  rest:[338.0,818.4,1092.7,857.3,439.8,571.4,276.8,1116.4,1517.9,1627.2,1140.1]
};
const CUST_NS_A = [6287.4,6794.8,8962.7,10944.0,11820.0,13978.5,18611.0,21173.4,27558.5,28262.9,32667.3];   // total net sales (20-F)

/* % of net system sales by ship-to region, Q1'22–Q3'26 — 6-K presentation pies (asml-work/data/quarterly.json region_ship_to_pct).
   null = region not on the pie (ASML records it as absent: below rounding or no sales). Rest = EMEA + Rest of Asia. */
const CUST_GEO_Q = {
  tw:  [22,41,47,48,49,34,24,13,6,11,15,10,16,35,30,13,23,30,32],
  kr:  [29,33,24,28,26,27,20,25,19,28,15,25,40,19,18,22,45,43,31],
  cn:  [34,10,15,9,8,24,46,39,49,49,47,27,27,27,42,36,19,14,23],
  us:  [6,10,5,7,15,10,5,11,6,3,21,28,16,10,6,17,12,9,13],
  jp:  [7,3,4,3,1,2,null,3,null,3,2,10,1,5,1,10,null,4,null],
  rest:[2,3,5,5,1,3,5,9,20,6,null,null,null,4,3,2,1,null,1]
};
const CUST_NQ = 19;   // Q1'22 … Q3'26 = Q_LBL[0..18]; Q4'26E is not used here (no regional guide)

const CUST_REG = [
  { key:'tw',   label:'Taiwan',      color:'#1E2733' },
  { key:'kr',   label:'South Korea', color:'#3E5A82' },
  { key:'cn',   label:'China',       color:'#2563EB' },
  { key:'us',   label:'USA',         color:'#93B1F0' },
  { key:'jp',   label:'Japan',       color:'#A9B4C2' },
  { key:'rest', label:'Rest (EMEA, Singapore, other Asia)', color:'#C8D7F4' }
];

/* China events — 20-F FY2025 p. 23 and risk factors; earlier rules from press (asml-work/data/overview.json, overview_notes.md).
   a / q = the annual / quarterly category the marker sits on (null = outside that axis). f = future date. */
const CUST_EV = [
  { d:'2019',        a:'2019', q:null,    t:'Netherlands does not grant an EUV export licence for China; no EUV system has been shipped there (press reports).' },
  { d:'Sep 1 2023',  a:'2023', q:"Q3'23", t:'Dutch licence requirement for the most advanced immersion DUV (NXT:2000i and later) takes effect; licences for China not expected from 2024.' },
  { d:'Oct 2023',    a:'2023', q:"Q4'23", t:'US rules extend licence needs to the NXT:1970i / 1980i for certain Chinese fabs.' },
  { d:'Jan 2024',    a:'2024', q:"Q1'24", t:'Dutch government partially revokes licences for NXT:2050i / 2100i shipments to China.' },
  { d:'Sep 2024',    a:'2024', q:"Q3'24", t:'Netherlands takes over licensing of the NXT:1970i / 1980i from the US rule.' },
  { d:'Jan 15 2025', a:'2025', q:"Q1'25", t:'Dutch controls extended to certain metrology and inspection systems.' },
  { d:'Oct 1 2025',  a:'2025', q:"Q4'25", t:'US Affiliates Rule: Entity List reaches entities ≥50% owned by listed parties. Suspended to Nov 10 2026 under the US–China trade deal; China also suspends its rare-earth export restrictions to that date.' },
  { d:'Nov 2025',    a:'2025', q:"Q4'25", t:'EU adds certain Dutch national controls to the EU Control List. No change for ASML: those products already needed a Dutch licence.' },
  { d:'Nov 10 2026', a:'2026E', q:null, f:true, t:'Both one-year suspensions (Affiliates Rule, rare earths) expire unless extended.' }
];
const CUST_CN_26E = 20;   // ASML outlook: China ≈20% of 2026 total net sales (Q4'25 call Jan 28 2026; Q2'26 call Jul 15 2026)

/* Customer concentration, % of total net sales — 20-F risk factors + segment note (annual.json customer_concentration). */
const CUST_CC = {
  big:   [26.0,24.2,27.4,22.6,39.7,31.4,37.0,33.3,31.8,16.6,23.9],
  bigE:  [1633.6,1646.2,2454.4,2476.8,4688.6,4394.8,6881.1,7046.9,8772.9,4682.4,7796.7],
  two:   [null,null,null,null,null,null,67.2,55.8,53.9,30.5,38.0],     // 2021–22 = the two customers >10% (derived); 2023–25 stated
  g10:   [null,null,null,72.5,67.8,71.2,67.2,55.8,53.9,53.8,61.2],
  g10E:  [null,null,null,7931.4,8018.1,9946.5,12505.4,11800,14900,15200,20000],
  n10:   [null,null,null,4,3,3,2,2,2,4,4]
};

/* End-use, € millions of net system sales — 20-F Note 2 (annual.json end_use). 2015–16 old basis (excl. M&I, Logic = Foundry + IDM). */
const CUST_EU_A = {
  log: [2122.2,3100.6,3456.7,3713.7,6565.3,7393.0,9588.5,9977.6,15984.7,13195.1,16054.1],
  mem: [2115.0,1470.5,2967.7,4545.4,2430.9,2923.6,4064.3,5452.7,5953.9,8573.6,8420.2]
};
/* Logic % of net system sales, Q1'22–Q3'26 (6-K end-use pie); Memory = 100 − Logic. */
const CUST_EU_QL = [50,71,68,64,70,84,76,63,63,54,64,61,58,69,65,70,49,51,54];

/* Order book, € millions. Annual: Q4 6-Ks + 20-F five-year summaries (annual.json backlog_ye / net_bookings). */
const CUST_BK_A  = [4639.0,5396.3,9357.2,8180.7,11741.0,11292.2,26240,30674,20040,18899,28035];
const CUST_BL_A  = [3184.3,3961.3,6684.5,null,null,null,null,40400,39000,35938,38797];
const CUST_BLE_A = [null,'≈50 (text)',46,null,null,null,null,null,null,62,65];       // EUV % of backlog
const CUST_EUVBK_A = [null,null,null,null,null,null,null,15100,9300,7556,14500];     // EUV bookings = sum of quarters (6-K)
/* Quarterly net bookings and EUV bookings Q1'22–Q4'25 (6-K press releases; EUV Q1'22–Q3'23 rounded to €0.1B). Q1'26 on: not published. */
const CUST_BK_Q   = [6977,8461,8920,6316,3752,4500,2602,9186,3611,5567,2633,7088,3936,5541,5399,13158,null,null,null];
const CUST_EUVBK_Q= [2500,5400,3800,3400,1600,1600,500,5600,656,2500,1400,3000,1200,2300,3600,7400,null,null,null];

/* ═════════════ GENERIC CHART (zoom · legend · table) ═════════════ */
const CUST_ST = {};      // per chart: { spec, hidden, x, y, chart }

const custMarks = { id:'custMarks',
  beforeDatasetsDraw(ch){ const sp = ch.$sp; if(!sp || !sp.bands) return; const lo = ch.$lo||0, xs = ch.scales.x, a = ch.chartArea, c = ch.ctx;
    const n = ch.data.labels.length, half = n>1 ? (xs.getPixelForValue(1)-xs.getPixelForValue(0))/2 : a.width/2;
    sp.bands.forEach(b => { const i0 = Math.max(b.from-lo, 0), i1 = Math.min(b.to-lo, n-1); if(i1 < i0) return;
      const x0 = Math.max(a.left, xs.getPixelForValue(i0)-half), x1 = Math.min(a.right, xs.getPixelForValue(i1)+half);
      c.save(); c.fillStyle = '#F6F7F9'; c.fillRect(x0, a.top, x1-x0, a.bottom-a.top);
      c.fillStyle = '#8A93A0'; c.font = '500 10.5px Inter, sans-serif'; c.textAlign = 'center';
      const words = b.text.split('|'); words.forEach((w,k) => c.fillText(w, (x0+x1)/2, a.top + (a.bottom-a.top)/2 - 6 + k*13));
      c.restore(); });
  },
  afterDatasetsDraw(ch){ const sp = ch.$sp; if(!sp || !sp.marks) return; const lo = ch.$lo||0, xs = ch.scales.x, a = ch.chartArea, c = ch.ctx, n = ch.data.labels.length;
    const by = {}; sp.marks.forEach(m => { const i = m.i - lo; if(i < 0 || i >= n) return; (by[i] = by[i] || []).push(m); });
    Object.entries(by).forEach(([i, ms]) => ms.forEach((m, k) => {
      const x = xs.getPixelForValue(+i) + (k - (ms.length-1)/2) * 19, y = a.top + 9;
      c.save(); c.strokeStyle = m.f ? '#2563EB' : '#7C8694'; c.setLineDash([3,3]); c.lineWidth = 1;
      c.beginPath(); c.moveTo(x, y+9); c.lineTo(x, a.bottom); c.stroke(); c.setLineDash([]);
      c.beginPath(); c.arc(x, y, 8, 0, Math.PI*2); c.fillStyle = m.f ? '#fff' : '#1E2733'; c.fill(); if(m.f){ c.strokeStyle = '#2563EB'; c.stroke(); }
      c.fillStyle = m.f ? '#2563EB' : '#fff'; c.font = '600 9.5px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(m.n, x, y+0.5);
      c.restore(); }));
  }
};

/* spec(): { labels, series:[{key,label,color,type,data,dash?,line?}], fmt(v), yTitle, stacked, total?, totalLabel?, est:Set, light:Set,
            extra:[{name, vals, dep?}], marks?, bands?, tipTitle?(i), yMin?, yMax? } — indexes are absolute (before zoom). */
function custDraw(id){
  const st = CUST_ST[id], sp = st.spec(), n = sp.labels.length;
  let lo = 0, hi = n-1;
  if(st.x){ lo = Math.max(0, Math.min(st.x[0], st.x[1])); hi = Math.min(n-1, Math.max(st.x[0], st.x[1])); if(hi <= lo){ lo = 0; hi = n-1; } }
  const sl = a => a.slice(lo, hi+1);
  const est = sp.est || new Set(), light = sp.light || new Set();
  const vis = sp.series.filter(s => !st.hidden.has(s.key));
  const ds = vis.map(s => {
    const d = sl(s.data);
    if(s.type === 'bar') return { type:'bar', label:s.label, data:d, order:2, stack: sp.stacked ? 'bars' : s.key,
      backgroundColor: d.map((_,i) => (est.has(i+lo) || light.has(i+lo)) ? s.color + '66' : s.color),
      borderColor: s.color, borderWidth: d.map((_,i) => est.has(i+lo) ? 1 : 0), borderRadius: 2, barPercentage: sp.stacked ? .72 : .85, categoryPercentage: .8 };
    return { type:'line', label:s.label, data:d, order:1, stack:'line-' + s.key, borderColor:s.color, backgroundColor:s.color, borderWidth:2,
      showLine: s.line !== false, pointRadius: d.map((_,i) => est.has(i+lo) ? 5 : 3), pointStyle: d.map((_,i) => est.has(i+lo) ? 'rectRot' : 'circle'),
      pointBackgroundColor: d.map((_,i) => est.has(i+lo) ? '#fff' : s.color), tension:.2, spanGaps:false,
      segment:{ borderDash: c => (est.has(c.p1DataIndex+lo) || s.dash) ? [5,4] : undefined } };
  });
  const bars = vis.filter(s => s.type === 'bar');
  const totAt = i => { const v = bars.map(s => s.data[i]).filter(x => x != null); return v.length ? v.reduce((a,b) => a+b, 0) : null; };
  const yr = st.y;
  if(st.chart) st.chart.destroy();
  st.chart = new Chart($('#' + id + '-c'), { data:{ labels: sl(sp.labels), datasets: ds }, plugins:[custMarks],
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{ mode:'index', intersect:false },
      layout:{ padding:{ top: sp.marks ? 6 : 0 } },
      plugins:{ legend:{ display:false }, tooltip:{ ...TIP, callbacks:{
        title: it => it[0].label + (sp.tipTitle ? sp.tipTitle(it[0].dataIndex + lo) : ''),
        label: it => it.parsed.y == null ? null : ` ${it.dataset.label}: ${sp.fmt(it.parsed.y)}`,
        footer: it => { if(!sp.total || !bars.length) return ''; const t = totAt(it[0].dataIndex + lo); return t == null ? '' : `${sp.totalLabel || 'Total shown'}: ${sp.fmt(t)}`; } } } },
      scales:{
        x:{ stacked: !!sp.stacked, grid:{ display:false } },
        y:{ stacked: !!sp.stacked, grid:{ color:'#EEF1F5' }, beginAtZero:true, title:{ display:true, text: sp.yTitle },
            ticks:{ callback: v => sp.tick ? sp.tick(v) : v }, min: yr ? yr[0] : sp.yMin, max: yr ? yr[1] : sp.yMax }
      } } });
  st.chart.$lo = lo; st.chart.$sp = sp;
  if(sp.marks || sp.bands) st.chart.draw();   // the first (synchronous) draw ran before $sp was attached
  legend($('#' + id + '-leg'), sp.series.map(s => ({ key:s.key, label:s.label, color:s.color, line: s.type !== 'bar', dash: s.dash })), st.hidden, () => custDraw(id));

  // table: everything drawn (visible series, visible range) + total of what is shown + extra memo rows
  const L = sl(sp.labels), cls = i => (est.has(i+lo) ? 'est' : '');
  const f = v => v == null ? '—' : (typeof v === 'string' ? v : sp.fmt(v));
  let rows = vis.map(s => `<tr><td>${s.label}</td>${sl(s.data).map((v,i) => `<td class="${cls(i)}">${f(v)}</td>`).join('')}</tr>`);
  if(sp.total && bars.length > 1) rows.push(`<tr><td><b>${sp.totalLabel || 'Total shown'}</b></td>${L.map((_,i) => `<td class="${cls(i)}"><b>${f(totAt(i+lo))}</b></td>`).join('')}</tr>`);
  (sp.extra || []).filter(e => !e.dep || !st.hidden.has(e.dep)).forEach(e =>
    rows.push(`<tr><td>${e.name}</td>${sl(e.vals).map((v,i) => `<td class="${cls(i)}">${v == null ? '—' : (typeof v === 'string' ? v : (e.fmt ? e.fmt(v) : sp.fmt(v)))}</td>`).join('')}</tr>`));
  $('#' + id + '-t').innerHTML = `<table><thead><tr><th>${sp.unitHead || ''}</th>${L.map((l,i) => `<th class="${cls(i)}">${l}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table>`;
}
function custSetup(id, spec, hidden){
  CUST_ST[id] = { spec, hidden: hidden || new Set(), x:null, y:null, chart:null };
  custDraw(id);
  attachZoom(() => CUST_ST[id].chart, r => { const st = CUST_ST[id]; if(!r){ st.x = null; st.y = null; } else { if(r.x) st.x = r.x; if(r.y) st.y = r.y; } custDraw(id); });
}
const custReset = id => { const st = CUST_ST[id]; st.x = null; st.y = null; custDraw(id); };
const custEur = d => v => '€' + v.toFixed(d) + 'B';
const custPct = v => v.toFixed(1) + '%';

/* ═════════════ KPIs ═════════════ */
function custKpis(){
  const i = 10, ns = CUST_NS_A[i], p = k => (CUST_GEO_A[k][i] / ns * 100).toFixed(1) + '%', p24 = k => (CUST_GEO_A[k][9] / CUST_NS_A[9] * 100).toFixed(1) + '%';
  const tile = (l, v, s) => `<div class="sc"><div class="sl">${l}</div><div class="sv">${v}</div><div class="ss">${s}</div></div>`;
  $('#cust-kpis').innerHTML = [
    tile('China · FY2025', p('cn'), `${fmtB(CUST_GEO_A.cn[i])} · ${p24('cn')} in 2024`),
    tile('Taiwan · FY2025', p('tw'), `${fmtB(CUST_GEO_A.tw[i])} of total net sales`),
    tile('South Korea · FY2025', p('kr'), `${fmtB(CUST_GEO_A.kr[i])} of total net sales`),
    tile('Four customers >10%', CUST_CC.g10[i].toFixed(1) + '%', `€20.0B · largest alone ${CUST_CC.big[i].toFixed(1)}%`)
  ].join('');
}

/* ═════════════ GEOGRAPHY ═════════════ */
const custGeo = { b:'a', u:'eur' };
function custGeoSpec(){
  const a = custGeo.b === 'a', eur = custGeo.u === 'eur';
  const series = CUST_REG.map(r => {
    let data;
    if(a) data = CUST_GEO_A[r.key].map((v,i) => eur ? v/1000 : v / CUST_NS_A[i] * 100);
    else  data = CUST_GEO_Q[r.key].map((p,i) => p == null ? null : (eur ? p/100 * Q_SYS[i] / 1000 : p));
    return { ...r, type:'bar', data };
  });
  $('#cust-geo-s').textContent = a
    ? (eur ? '€B of total net sales, by customer fab location, 2015–2025' : '% of total net sales, by customer fab location, 2015–2025')
    : (eur ? '€B of system sales by ship-to, Q1\'22–Q3\'26 (derived from %)' : '% of system sales by ship-to, Q1\'22–Q3\'26');
  return { labels: a ? CUST_YRS : Q_LBL.slice(0, CUST_NQ), series, stacked:true, total:true,
    totalLabel: eur ? (a ? 'Total shown (€B)' : 'Total shown (€B, derived)') : 'Total shown (%)',
    fmt: eur ? custEur(a ? 1 : 2) : custPct, tick: v => eur ? '€' + v : v + '%',
    yTitle: eur ? (a ? '€B · total net sales' : '€B · net system sales (derived)') : (a ? '% of total net sales' : '% of net system sales'),
    yMax: eur ? undefined : 100, unitHead: eur ? '€B' : '%' };
}

/* ═════════════ CHINA ═════════════ */
const custCn = { b:'a' };
function custCnSpec(){
  const a = custCn.b === 'a';
  const labels = a ? [...CUST_YRS, '2026E'] : Q_LBL.slice(0, CUST_NQ);
  const data = a ? [...CUST_GEO_A.cn.map((v,i) => v / CUST_NS_A[i] * 100), CUST_CN_26E] : CUST_GEO_Q.cn.slice();
  const marks = CUST_EV.map((e, k) => ({ i: labels.indexOf(a ? e.a : e.q), n: k+1, f: e.f })).filter(m => m.i >= 0);
  $('#cust-cn-s').textContent = a ? '% of total net sales · numbered markers = events (table below)'
                                  : '% of system sales (different basis) · markers = events';
  // event list (numbers match the markers; greyed when the event is outside this axis)
  $('#cust-cn-ev').innerHTML = `<table><thead><tr><th>#</th><th style="text-align:left">Date</th><th style="text-align:left">Event</th></tr></thead><tbody>` +
    CUST_EV.map((e, k) => { const on = (a ? e.a : e.q) != null;
      return `<tr><td>${k+1}</td><td class="${e.f ? 'est' : ''}" style="text-align:left">${e.d}</td><td style="text-align:left;white-space:normal;min-width:320px">${e.t}${on ? '' : ' <i style="color:#8A93A0">(outside this axis)</i>'}</td></tr>`; }).join('') + '</tbody></table>';
  const extra = a ? [{ name:'China €B (total net sales)', vals:[...CUST_GEO_A.cn.map(v => v/1000), null], fmt: custEur(1), dep:'cn' },
                     { name:'Events (#)', vals: labels.map(l => CUST_EV.map((e,k) => e.a === l ? k+1 : null).filter(Boolean).join(', ') || null) }]
                  : [{ name:'China €B (derived, system sales)', vals: CUST_GEO_Q.cn.map((p,i) => p/100 * Q_SYS[i] / 1000), fmt: custEur(2), dep:'cn' },
                     { name:'Events (#)', vals: labels.map(l => CUST_EV.map((e,k) => e.q === l ? k+1 : null).filter(Boolean).join(', ') || null) }];
  return { labels, series:[{ key:'cn', label: a ? 'China, % of total net sales' : 'China, % of net system sales', color:'#2563EB', type:'line', data }],
    est: a ? new Set([11]) : new Set(), fmt: custPct, tick: v => v + '%', yTitle: a ? '% of total net sales' : '% of net system sales',
    yMax: a ? 45 : 55, marks, extra, unitHead:'%',
    tipTitle: i => (a && i === 11) ? ' — ASML outlook, not an actual' : '' };
}

/* ═════════════ CONCENTRATION ═════════════ */
function custCcSpec(){
  return { labels: CUST_YRS, unitHead:'% of sales', fmt: custPct, tick: v => v + '%', yTitle:'% of total net sales', yMax: 80,
    series:[
      { key:'big', label:'Largest customer', color:'#1E2733', type:'bar', data: CUST_CC.big },
      { key:'two', label:'Two largest', color:'#3E5A82', type:'bar', data: CUST_CC.two },
      { key:'g10', label:'All customers >10%, combined', color:'#93B1F0', type:'bar', data: CUST_CC.g10 }
    ],
    extra:[ { name:'Customers >10% (count)', vals: CUST_CC.n10, fmt: v => String(v), dep:'g10' },
            { name:'Largest customer €B', vals: CUST_CC.bigE.map(v => v/1000), fmt: custEur(1), dep:'big' },
            { name:'Customers >10% €B', vals: CUST_CC.g10E.map(v => v == null ? null : v/1000), fmt: custEur(1), dep:'g10' } ],
    tipTitle: i => CUST_CC.n10[i] ? ` · ${CUST_CC.n10[i]} customers >10%` : ' · count >10% not disclosed' };
}

/* ═════════════ END-USE ═════════════ */
const custEu = { b:'a', u:'eur' };
function custEuSpec(){
  const a = custEu.b === 'a', eur = custEu.u === 'eur';
  let labels, log, mem, light = new Set();
  if(a){
    labels = [...CUST_YRS, '2026 9M'];
    log = [...CUST_EU_A.log.map(v => v/1000), A_LOG[4]];         // 2026 9M from data-overview.js (Q3'26 deck p. 10)
    mem = [...CUST_EU_A.mem.map(v => v/1000), A_MEM[4]];
    light.add(11);
  } else {
    labels = Q_LBL.slice(0, CUST_NQ);
    log = CUST_EU_QL.map((p,i) => p/100 * Q_SYS[i] / 1000);
    mem = CUST_EU_QL.map((p,i) => (100-p)/100 * Q_SYS[i] / 1000);
  }
  if(!eur){ const t = log.map((v,i) => v + mem[i]); log = log.map((v,i) => v/t[i]*100); mem = mem.map((v,i) => v/t[i]*100); }
  const L = CUST_EU_A.log[10], M = CUST_EU_A.mem[10];
  const l9 = CUST_EU_QL.slice(16).reduce((s,p,k) => s + p * Q_SYS[16+k], 0), s9 = Q_SYS.slice(16,19).reduce((x,y) => x+y, 0);
  $('#cust-eu-s').textContent = `FY2025 Logic ${(L/(L+M)*100).toFixed(1)}% / Memory ${(M/(L+M)*100).toFixed(1)}% of net system sales · 9M 2026 Logic ${(l9/s9).toFixed(1)}% · ` +
    (eur ? (a ? '€ billions' : '€ billions, derived') : '% of net system sales');
  return { labels, stacked:true, total: eur, totalLabel: a ? 'Net system sales shown (€B)' : 'Net system sales shown (€B)', light,
    fmt: eur ? custEur(a ? 1 : 2) : custPct, tick: v => eur ? '€' + v : v + '%', yMax: eur ? undefined : 100,
    yTitle: eur ? (a ? '€B · net system sales' : '€B · net system sales (derived)') : '% of net system sales', unitHead: eur ? '€B' : '%',
    series:[ { key:'log', label:'Logic', color:'#2563EB', type:'bar', data: log }, { key:'mem', label:'Memory', color:'#1E2733', type:'bar', data: mem } ],
    tipTitle: i => (a && i === 11) ? ' — first nine months only' : (a && i < 2 ? ' — old basis (excl. M&I)' : '') };
}

/* ═════════════ ORDER BOOK ═════════════ */
const custBk = { b:'a' };
function custBkSpec(){
  const a = custBk.b === 'a';
  if(a){
    $('#cust-bk-s').textContent = '€B · net bookings per year and year-end backlog (gaps = not disclosed)';
    return { labels: CUST_YRS, fmt: custEur(1), tick: v => '€' + v, yTitle:'€ billions', unitHead:'€B',
      series:[ { key:'bk', label:'Net bookings (year)', color:'#3E5A82', type:'bar', data: CUST_BK_A.map(v => v/1000) },
               { key:'bl', label:'Backlog, year end', color:'#2563EB', type:'line', data: CUST_BL_A.map(v => v == null ? null : v/1000) } ],
      extra:[ { name:'of which EUV bookings', vals: CUST_EUVBK_A.map(v => v == null ? null : v/1000), fmt: custEur(1), dep:'bk' },
              { name:'EUV share of backlog', vals: CUST_BLE_A.map(v => typeof v === 'number' ? v + '%' : v), dep:'bl' },
              { name:'Book-to-bill (derived)', vals: CUST_BK_A.map((v,i) => (v / ([4310.4,4672.0,6424.4,8259.1,8996.2,10316.6,13652.8,15430.3,21938.6,21768.7,24474.3][i])).toFixed(2) + '×'), dep:'bk' } ],
      tipTitle: i => CUST_BLE_A[i] != null ? ` · EUV ${typeof CUST_BLE_A[i] === 'number' ? CUST_BLE_A[i] + '%' : 'about half'} of backlog` : '' };
  }
  $('#cust-bk-s').textContent = '€B · quarterly net bookings, EUV vs non-EUV';
  return { labels: Q_LBL.slice(0, CUST_NQ), stacked:true, total:true, totalLabel:'Net bookings shown (€B)', fmt: custEur(2), tick: v => '€' + v,
    yTitle:'€ billions', unitHead:'€B', bands:[{ from:16, to:18, text:'Not published|from Q1 2026' }],
    series:[ { key:'euv', label:'EUV bookings', color:'#2563EB', type:'bar', data: CUST_EUVBK_Q.map(v => v == null ? null : v/1000) },
             { key:'non', label:'Non-EUV bookings', color:'#3E5A82', type:'bar', data: CUST_BK_Q.map((v,i) => v == null ? null : (v - CUST_EUVBK_Q[i])/1000) } ],
    extra:[ { name:'Net system sales (€B)', vals: Q_SYS.slice(0, CUST_NQ).map(v => v/1000) },
            { name:'Book-to-bill (derived)', vals: CUST_BK_Q.map((v,i) => v == null ? null : (v / Q_SYS[i]).toFixed(2) + '×') } ] };
}

/* ═════════════ INIT ═════════════ */
function custInit(){
  // reconciliation checks (console only): annual regions sum to total net sales; quarterly pies sum to 100
  CUST_NS_A.forEach((t,i) => { const s = CUST_REG.reduce((x,r) => x + CUST_GEO_A[r.key][i], 0); if(Math.abs(s-t) > 0.6) console.warn('[cust] region sum ≠ total', CUST_YRS[i], s, t); });
  for(let i = 0; i < CUST_NQ; i++){ const s = CUST_REG.reduce((x,r) => x + (CUST_GEO_Q[r.key][i] || 0), 0); if(s !== 100) console.warn('[cust] pie ≠ 100', Q_LBL[i], s); }
  custKpis();
  custSetup('cust-geo', custGeoSpec);
  custSetup('cust-cn', custCnSpec);
  custSetup('cust-cc', custCcSpec);
  custSetup('cust-bk', custBkSpec);   // end-use (custEuSpec) no longer rendered (v3 density) — constants kept
}
pills('#cust-geo-b', v => { custGeo.b = v; CUST_ST['cust-geo'] && custReset('cust-geo'); });
pills('#cust-geo-u', v => { custGeo.u = v; CUST_ST['cust-geo'] && custReset('cust-geo'); });
pills('#cust-cn-b',  v => { custCn.b = v;  CUST_ST['cust-cn'] && custReset('cust-cn'); });
pills('#cust-bk-b',  v => { custBk.b = v;  CUST_ST['cust-bk'] && custReset('cust-bk'); });
