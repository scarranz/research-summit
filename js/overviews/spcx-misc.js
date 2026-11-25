// overviews/spcx-misc.js — SpaceX ▸ Deep Dive ▸ Miscellaneous (MISC-*), the research model.
// Ported from SAB's standalone SpaceX dashboard (Drive: Team/SAB/Company Analisys/SpaceX/SpaceX Dashboard, revamp of
// Nov 25 2026): the same data, engine and views, run inside the portal. Styles: css/spcx.css (scoped to .spx).
//
// What is in a file and why (golden rule 10): filings (424B4, 10-Q, Q3 release), Bloomberg consensus (SPCX BBG
// CONSENSUS.xlsx, pulled Nov 25 2026) and sell-side figures (J.P. Morgan Oct 21 2026 and others, named in each footer)
// are frozen here with source and date. The share PRICE is live: it arrives from spcx.js (api.liveQuote, Massive)
// through spcxMiscWire; until then the valuation shows "live price pending". No Summit model exists for SPCX.
//
// Layout of this file: portal shim → shared helpers (from the dashboard core.js) → data (data.js, data-model.js) →
// model engine (model.js) → one registerView per sub-tab → the exports the profile uses.

let R = document;                       // query root, set to #co-detailview when the Deep Dive mounts
const VIEWS = {};
function registerView(v){ VIEWS[v.id] = { ...v, built:false }; }
const $ = s => R.querySelector(s);
const $$ = s => Array.from(R.querySelectorAll(s));
const usd = (m, d=1) => m == null || isNaN(m) ? '—' : (Math.abs(m) >= 1000 ? (m<0?'−':'') + '$' + (Math.abs(m)/1000).toFixed(d) + 'B' : (m<0?'−':'') + '$' + Math.abs(m).toLocaleString('en-US') + 'M');
const num = (x, d=0) => x == null || !isFinite(x) ? '—' : (x<0?'−':'') + Math.abs(x).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const chg = (a, b) => (a==null||b==null||b===0) ? '—' : ((a/b-1)*100 >= 0 ? '+' : '−') + Math.abs((a/b-1)*100).toFixed(0) + '%';
const C = { conn:'#2563EB', si:'#1E2733', space:'#93B1F0', steel:'#3E5A82', sky:'#5E8BEC', fog:'#C8D7F4', grey:'#A9B4C2', deep:'#1B3F94', pos:'#16A34A', neg:'#DC2626' };
const TIP = { backgroundColor:'#1E2733', padding:9, titleFont:{weight:600}, bodyFont:{size:11} };

/* ───── helpers (dashboard core.js) ───── */
/* Segmented control: <div class="fbg" id="x"><button class="fb active" data-v="a">A</button>…</div> */
function pills(sel, onChange){
  $$(sel + ' .fb').forEach(b => b.onclick = () => {
    $$(sel + ' .fb').forEach(x => x.classList.remove('active')); b.classList.add('active'); onChange(b.dataset.v);
  });
}

/* Drag-to-zoom on both axes + double-click reset. Works on category (index) and linear/log scales. */
function zoomable(chart){
  const cv = chart.canvas, wrap = cv.parentElement; let p0 = null, box = null;
  const orig = {}; Object.keys(chart.options.scales||{}).forEach(k => orig[k] = { min:chart.options.scales[k].min, max:chart.options.scales[k].max });
  const rel = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener('mousedown', e => { p0 = rel(e); box = document.createElement('div');
    box.style.cssText = 'position:absolute;border:1px solid #2563EB;background:rgba(37,99,235,.08);pointer-events:none'; wrap.appendChild(box); });
  window.addEventListener('mousemove', e => { if(!p0) return; const [x,y] = rel(e);
    Object.assign(box.style, { left:Math.min(x,p0[0])+'px', top:Math.min(y,p0[1])+'px', width:Math.abs(x-p0[0])+'px', height:Math.abs(y-p0[1])+'px' }); });
  window.addEventListener('mouseup', e => { if(!p0) return; const [x1,y1] = rel(e), [x0,y0] = p0; p0 = null; box.remove();
    const dx = Math.abs(x1-x0), dy = Math.abs(y1-y0); if(dx < 8 && dy < 8) return;
    Object.values(chart.scales).forEach(s => {
      const horiz = s.isHorizontal(); if((horiz && dx < 8) || (!horiz && dy < 8)) return;
      let a = s.getValueForPixel(horiz ? Math.min(x0,x1) : Math.max(y0,y1)), b = s.getValueForPixel(horiz ? Math.max(x0,x1) : Math.min(y0,y1));
      if(a > b) [a,b] = [b,a];
      if(s.type === 'category'){ a = Math.max(0, Math.round(a)); b = Math.round(b); if(b < a) b = a; }
      chart.options.scales[s.id].min = a; chart.options.scales[s.id].max = b;
    });
    chart.update();
  });
  cv.addEventListener('dblclick', () => { Object.keys(orig).forEach(k => { chart.options.scales[k].min = orig[k].min; chart.options.scales[k].max = orig[k].max; }); chart.update(); });
  cv.title = 'Drag to zoom · double-click to reset';
}

/* One chart block = legend + canvas + data table in a dropdown.
   cfg = { labels, series:[{key,label,color,data,type?,dash?,est?}], unit, fmt(v), stacked, horizontal, total, log,
           height:'s'|'d'|'', tableTitle, tableNote, yTitle, extra(chartCfg) }
   Clicking a legend item hides the series, drops it from the table and from the Total column. Nulls draw nothing. */
function chartBlock(root, cfg){
  const hidden = new Set(cfg.hidden || []);
  root.innerHTML = `<div class="leg"></div><div class="ch-wrap ${cfg.height||''}"><canvas></canvas></div>
    <details class="tbl"><summary>${cfg.tableTitle || 'Data table'}</summary><div class="tw"></div><div class="tn"></div></details>`;
  const leg = root.querySelector('.leg'), tw = root.querySelector('.tw'), tn = root.querySelector('.tn'), cv = root.querySelector('canvas');
  const fmt = v => (cfg.fmt || (x => num(x)))(v);
  const vis = () => cfg.series.filter(s => !hidden.has(s.key));
  const hz = !!cfg.horizontal;
  const valAxis = { stacked:!!cfg.stacked, type: cfg.log ? 'logarithmic' : 'linear', grid:{color:'#EEF1F5'},
    ticks:{ callback: v => fmt(v) }, title: cfg.yTitle ? { display:true, text:cfg.yTitle, color:'#8A93A0', font:{size:10.5, weight:600} } : undefined };
  if(cfg.yMin != null) valAxis.min = cfg.yMin;
  const catAxis = { stacked:!!cfg.stacked, grid:{display:false}, ticks:{ autoSkip:false, maxRotation:0 } };
  const ds = () => vis().map(s => ({
    label:s.label, data:s.data, type:s.type || cfg.type || 'bar', borderColor:s.color,
    backgroundColor: s.type === 'line' ? s.color : (s.est ? s.color + '66' : s.color),
    borderWidth: s.type === 'line' ? 2 : 0, borderDash: s.dash ? [5,4] : [], pointRadius: s.type === 'line' ? 3 : 0,
    borderRadius: (s.type||cfg.type||'bar') === 'bar' ? 3 : 0, maxBarThickness: 46, spanGaps:false, stack: s.stack, order: s.type === 'line' ? 0 : 1
  }));
  const chartCfg = { type: cfg.type || 'bar', data:{ labels:cfg.labels, datasets:ds() },
    options:{ responsive:true, maintainAspectRatio:false, indexAxis: hz ? 'y' : 'x', interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{display:false}, tooltip:{ ...TIP, callbacks:{ label: c => ' ' + c.dataset.label + ': ' + fmt(hz ? c.parsed.x : c.parsed.y) } } },
      scales: hz ? { x:valAxis, y:catAxis } : { x:catAxis, y:valAxis } } };
  if(cfg.extra) cfg.extra(chartCfg);
  const chart = new Chart(cv, chartCfg); zoomable(chart);
  const drawTable = () => {
    const ss = vis(); const cols = [cfg.rowHead || '', ...ss.map(s => s.label + (cfg.unit ? ` <span style="text-transform:none;letter-spacing:0">(${cfg.unit})</span>` : ''))];
    if(cfg.total && ss.length > 1) cols.push('Total');
    const rows = cfg.labels.map((l, i) => { const vals = ss.map(s => s.data[i]); const r = [l, ...vals.map(v => fmt(v))];
      if(cfg.total && ss.length > 1){ const ok = vals.filter(v => v != null); r.push(ok.length ? '<b>' + fmt(ok.reduce((a,b) => a+b, 0)) + '</b>' : '—'); } return r; });
    tw.innerHTML = table(cols, rows, new Set(ss.map((s,i) => s.est ? i+1 : -1)));
    tn.innerHTML = cfg.tableNote ? `<div class="snote" style="margin:0;border:none;border-top:1px solid var(--bdr);border-radius:0">${cfg.tableNote}</div>` : '';
  };
  const redraw = () => { chart.data.datasets = ds(); chart.update(); drawTable(); legend(leg, cfg.series, hidden, redraw); };
  legend(leg, cfg.series, hidden, redraw); drawTable();
  return { chart, set(newCfg){ Object.assign(cfg, newCfg); chart.data.labels = cfg.labels; Object.values(chart.options.scales).forEach(s => s.stacked = !!cfg.stacked); redraw(); } };
}

function legend(el, items, hidden, onToggle){
  el.innerHTML = items.map(it => `<span class="li${hidden.has(it.key)?' off':''}" data-k="${it.key}"><span class="${it.type==='line'?'ll':'ls'}" style="background:${it.dash ? 'repeating-linear-gradient(90deg,'+it.color+' 0 4px,transparent 4px 7px)' : (it.est ? it.color+'66' : it.color)}"></span>${it.label}</span>`).join('');
  el.querySelectorAll('.li').forEach(n => n.onclick = () => { const k = n.dataset.k; hidden.has(k) ? hidden.delete(k) : hidden.add(k); onToggle(); });
}

function table(cols, rows, est){
  est = est || new Set();
  return `<table><thead><tr>${cols.map((c,i)=>`<th class="${est.has(i)?'est':''}">${c}</th>`).join('')}</tr></thead><tbody>` +
    rows.map(r => `<tr>${r.map((c,i)=>`<td class="${est.has(i)?'est':''}">${c}</td>`).join('')}</tr>`).join('') + '</tbody></table>';
}

/* Section shell: title, one-line subtitle, optional controls, body, source note */
const sec = (o) => `<section class="card"${o.id ? ` id="${o.id}"` : ''}><div class="ch"><div><div class="ct">${o.t}</div>${o.s ? `<div class="cs">${o.s}</div>` : ''}</div>${o.ctl || ''}</div><div class="cb">${o.b}</div>${o.n ? `<div class="snote">${o.n}</div>` : ''}</section>`;
const tile = (l, v, s) => `<div class="sc"><div class="sl">${l}</div><div class="sv">${v}</div><div class="ss">${s}</div></div>`;
const seg = (id, label, opts, active) => `<div><span class="ctl-l">${label}</span><div class="fbg" id="${id}">${opts.map(([v,t]) => `<button class="fb${v===active?' active':''}" data-v="${v}">${t}</button>`).join('')}</div></div>`;

/* ───── data (dashboard data.js) ───── */
/* ═════════════ DATA — frozen, nothing is fetched ═════════════
   Every number below comes from SPCX_DeepDive.md (DAA folder), which cites the primary documents:
   SpaceX Q3 2026 earnings release (Oct 20 2026), Q3 2026 10-Q, 424B4 prospectus (Jun 12 2026), the Q3 call
   transcript (Oct 20 2026) and the sell-side notes named in each source line. $ millions unless stated. */

const ASOF = 'Sep 30 2026';

/* Income statement, nine months to Sep 30 (Q3 2026 release) */
const IS9M = {
  rev:    { conn:[8159, 12796], si:[2278, 10939], space:[3277, 3348], total:[13714, 27083] },
  opinc:  { conn:[3147, 5211],  si:[-4182, -3295], space:[-181, -1211], total:[-1216, 705] },
  net:[-2590, -413], netAttrib:[-2590, -1084],
  cfo:[4120, 13097], capex:[-13846, -48069], fcf:[-9726, -34972],
  da:[4784, 8934], sbc:[1044, 3833], sharesAvg:[2915, 7274]          // sbc incl. acquisitions; shares = basic average, M
};

/* Q3 2026 alone — what the headline hid */
const Q3 = { net:4404, otherIncome:1025, interestIncome:873, taxCredit:390, relatedPartyOther:561 };

/* Balance sheet, Sep 30 2026 */
const BS = { cash:51294, securities:38561, liquidity:89855, debt:38844, debtRelated:12897, goodwill:48423, deficit:-37448, deferredRev:17520,
             interest9M:1968, interestRelated9M:864 };

/* Sources and uses of cash, 9M 2026 */
const FUND = [
  ['IPO (Jun 2026, net)', 85675], ['New debt', 51834], ['Operating cash flow', 13097], ['Share issuance', 8319],
  ['Debt repaid', -39845], ['Capex', -48069], ['Buybacks', -4426], ['Early-repayment premium', -1153]
];

/* Runway inputs [rev. 17-nov]: 4Q26 capex guide midpoint (company), liquidity left at YE26 (Clear Street),
   TTM FCF (Cestrian), 2027 non-cancellable AI/cloud capacity obligations (prospectus note 17) */
const RUN = { capex4Q:37500, liqYE26:65000, fcfTTM:-39200, netCashQ3:51000, netCashDropQ3:9600, fixed2027:21500, turbines:805,
              gwYE26:[2.5, 3], gwAdd27:10, ubsCostPerGW:27000 };

/* Connectivity (Starlink), 9M */
const CONN = { subs:[7.2, 13.6], arpu:[84, 67], arpuQ3:69, consumerRev:[5198, 7754], entGovRev:[2961, 5042], ebitda:[5123, 8183],
               sats:11100, markets:174, planesEquipped:3800, planesContracted:12000, backlogEntGov:24000, gmQ3:0.55, tariffPts:3 };

/* Space segment */
const SPACE = { launches:[128, 113], customer:[36, 29], internal:[92, 84], massT:[1627, 1517], ebitda:[803, -199], ebitdaQ3:357,
                starshipRD:[2069, 3231], faaCap:[5, 25], q3Launches:35, q3LaunchesCS:46 };

/* Starship cost ladder — Deutsche Bank estimates, Jul 2026 (not disclosures) */
const LADDER = [
  { k:'Expendable ship',        cost:52, t:65,  kg:4421 },
  { k:'Partial reuse',          cost:30, t:85,  kg:359 },
  { k:'Full reuse',             cost:16, t:100, kg:154 },
  { k:'Full & rapid reuse',     cost:7,  t:150, kg:53 }
];
const F9_KG = [['UBS', 1000], ['Barclays', 3182]];   // Falcon 9 today, $/kg — sources disagree
const ORBIT_KG_NEEDED = 100;                          // prospectus: orbital compute needs ~$100/kg

/* Orbital vs terrestrial cost of 1 GW — Deutsche Bank, Jul 2026 */
const ORB = [
  { k:'Today (Falcon 9)',        kg:1429, orbital:115, terr:20 },
  { k:'~2029 · partial reuse',   kg:359,  orbital:26,  terr:23 },
  { k:'~2032 · full reuse',      kg:154,  orbital:15,  terr:25 },
  { k:'Later · rapid reuse',     kg:53,   orbital:9,   terr:25 }
];
/* Other terrestrial cost views, $B per GW */
const TERR = { db:null, ubs:40, barclays:55, huang:100 };   // Barclays $50–60B → midpoint; Huang ~$100B (cited in DB footnote)

/* SI (AI / compute), 9M */
const SI = { gw:[0.6, 1.7], ads:[1323, 1248], infra:[955, 9691], total:[2278, 10939], rd:[3331, 7740], capex:[8077, 39995], ebitda:[-813, 5490],
             backlog:63000, backlog12m:42000, rpoJun:47500, topClientShareQ2:0.195, guide1Q27:[33000, 37000] };
const CONTRACTS = [
  { k:'Anthropic',     perMonth:1250, mw:480,  gpus:'325k GPUs',  end:'2029' },
  { k:'Google',        perMonth:920,  mw:null, gpus:'110k GB300', end:'2029' },
  { k:'Reflection AI', perMonth:150,  mw:null, gpus:'18k GB300',  end:'2029' }
];
/* $M per MW per year */
const PERMW = [['SpaceX · Anthropic', 31], ['SpaceX · Google', 50], ['Other neoclouds', 10.5], ['DB normalised (post-Vera Rubin)', 10]];

/* Defense */
const DEF = { obligFY25:1800, oblig9M26:5900 };
const DEF_CONTRACTS = [
  ['Starshield IDIQ', 13000, 'Pre-approved ceiling, not a purchase commitment'],
  ['Space-Based AMTI', 4160, 'Air moving-target tracking'],
  ['Golden Dome space interceptor', 3200, 'With partners'],
  ['Space Data Network Backbone', 2290, 'Secure LEO data transport for Golden Dome; prototype by end-2027'],
  ['NRO classified constellation', 1800, 'Approximate; limited detail'],
  ['NSSL Phase 3 Lane 1', 1600, '18 Falcon 9 launches']
];

/* Sell-side */
const STREET = [
  { b:'J.P. Morgan',  d:'Jul 7 → Oct 21 2026', r:'Overweight',  pt:500, prev:240, m:'~20× 2028E GAAP EPS (~$25); $225 Jul → $240 Aug → $500 Oct', c:'IPO manager/co-manager; investment-banking client' },
  { b:'UBS',          d:'Jul 7 2026',          r:'Buy',         pt:210, bull:275, bear:120, m:'SOTP 2028E: Space 24× rev, Connectivity 30× EBITDA, AI 28× EBITDA', c:'IPO co-manager' },
  { b:'Needham',      d:'Jul 7 2026',          r:'Buy',         pt:200, m:'SOTP 2028E ≈ 15× EV/sales on $164B; $1T revenue in 2031', c:'IPO co-manager' },
  { b:'Clear Street', d:'Jul 7 → Oct 21 2026', r:'Buy',         pt:248, prev:217, m:'SOTP 2030E: Connectivity 20× EBITDA, SI 15× rev, Space 10× rev', c:'Banker to SpaceX (and ASTS)' },
  { b:'Wells Fargo',  d:'Aug 30 / Sep 28 2026',r:'Overweight',  pt:212, prev:230, m:'30× 2028E EPS (~$7.1)', c:'IPO co-manager, "significant financial interest"' },
  { b:'Deutsche Bank',d:'Jul 7 2026',          r:'—',           pt:255, m:'Orbital compute economics, Starship cost ladder', c:'Same-day initiation (Jul 7)' },
  { b:'Mizuho',       d:'Jul 7 2026',          r:'—',           pt:200, bear:122, m:'Starlink ~76% of satellite broadband in 2030', c:'Same-day initiation (Jul 7)' }
];

/* ═════════════ DATA FOR THE MODEL TABS (Financials · Cash & financing · Valuation) ═════════════
   Frozen. Nothing is fetched. $ millions unless stated. Years are calendar (FYE Dec).
   CONS = Bloomberg consensus (BEst), file "SPCX BBG CONSENSUS.xlsx", Annual sheet, pulled Nov 25 2026.
   JPM  = J.P. Morgan, "Super Intelligence Singularity; Raising PT to $500" (Oct 21 2026), Figure 2 (new estimates).
   Index 0 = 2025A, 1..5 = 2026E..2030E. */

const MYEARS = ['2025A','2026E','2027E','2028E','2029E','2030E'];

const PRICE = { px:null, date:null, src:'live (Massive)', sharesOut:13580 };   // filled by spcxMiscWire from the live quote; sharesOut = market cap ÷ price once live

const CONS = {
  asof:'Nov 25 2026',
  space: { rev:[4086,4926.4,7147.6,8224.2,10827.5,17962.6], ebitda:[653,-158.1,1810.0,3130.3,3745.4,6728.0],
           capex:[3832,5842.9,12902.7,11462.8,13517.5,10824.5], da:[757,767.1,1197.5,1922.1,2731.1,3316.0],
           launches:[170,154,201,264,701,1103], starship:[5,4.7,48.7,101.2,522.5,1134.7] },
  conn:  { consumer:[7208,11046.8,16680.3,25580.3,37297.6,51256.7], entgov:[4179,7866.4,14031.2,26305.2,46910.2,75126.6],
           revField:[11387,18756.8,29655.1,50818.8,84300.7,132315.1],
           ebitda:[7168,11913.3,18408.3,32188.3,52029.7,80390.4], capex:[4178,6434.1,19013.1,23736.0,31894.2,39126.5],
           da:[2376,3684.9,5315.7,7101.0,9769.0,13489.6], subs:[8.9,16.02,27.85,46.43,71.46,104.56], arpu:[81,66.68,59.44,53.40,49.31,46.13] },
  si:    { ads:[1844,1997.8,3374.7,5443.6,8608.5,13694.7], infra:[1357,24013.3,156315.3,293574.9,383194.2,497679.9],
           revField:[3201,25643.2,153931.2,317640.8,443387.0,578849.8],
           ebitda:[-1237,14449.8,103890.9,206150.5,282379.9,389319.2], capexField:[12727,75405.4,254219.4,261100.7,268864.0,334972.4],
           da:[3568,9601.5,37015.0,66747.9,88573.0,122755.4], gw:[0.8,2.702,9.547,15.756,22.265,33.756] },
  /* Headline (company-level) fields — a different set of contributors from the segment fields, so segments do not add up to these */
  tot:   { rev:[18674,49399.4,187354.8,340943.0,510344.6,683326.3], ebitda:[6584,25580.7,119658.4,238436.2,350817.9,486023.3],
           cfo:[6785,27418.7,120360.6,235882.3,343237.3,443392.2], capex:[20737,82425.0,263353.5,269456.9,307641.2,378429.7],
           fcf:[-13952,-58272.8,-140369.9,-58300.0,20545.3,70615.5], da:[6701,13983.6,40433.1,74835.0,101752.7,140583.0],
           sbc:[1947,5941.2,12322.8,15401.2,15104.7,16384.6], netInt:[1453,862.7,6362.5,12417.6,15832.7,16763.6],
           tax:[718,-235.4,3076.9,1852.1,16171.1,47397.9], pretax:[-4219,4466.9,65186.5,138618.7,225387.9,316479.4],
           shares:[2926,9388.7,12959.9,13143.8,13326.0,13444.9], epsAdj:[-1.69,0.409,4.407,9.542,14.579,18.388], epsGaap:[-1.69,0.275,4.22,8.528,13.189,18.006],
           debtProceeds:[16055,67406.5,156110.8,73075.3,19166.3,-6250.5], debt:[22896,41795.0,187860.5,280916.2,376654.4,420511.1] },
  /* 2027 by quarter (Quarterly sheet) — used only to shape the intra-year cash path */
  q27: { cfo:[19304.7,28542.3,36394.2,46505.5], capex:[47526.5,64821.3,78322.6,99680.4] },
  q4_26: { cfo:14788.8, capex:37511.4 }
};

/* J.P. Morgan, Oct 21 2026 (new estimates). Index 1..5 = 2026E..2030E; index 0 = 2025A from the same table where given. */
const JPM = {
  date:'Oct 21 2026', pt:500, ptBasis:'~20× 2028E GAAP EPS, Dec-2027 target',
  ptHistory:[['Jul 7 2026',225,'~41× 2028E GAAP EPS of $5.50'],['Aug 5 2026',240,''],['Oct 21 2026',500,'~20× 2028E GAAP EPS of ~$25']],
  rev:[18674,51057,254127,616492,822552,1127693], ebitda:[6585,27023,167992,410215,567321,836411],
  capex:[null,87192,294566,389119,286800,400011], fcf:[null,-48228,-81609,-31072,276742,355990],
  cfo:[6786,38965,212957,358047,null,null], epsGaap:[null,0.68,8.24,25.41,30.82,37.71],
  space:{ rev:[4086,5128,7591,7819,8054,8456], ebitda:[653,-64,2861,3117,2961,3674], capex:[3832,5592,11364,5372,6322,6799] },
  conn: { rev:[11387,19083,28576,49244,81706,140208], ebitda:[7168,12134,18070,29450,47124,78126], capex:[4178,5814,22823,25712,38657,50552],
          subs:[8.9,15.8,27.3,42.3,64.3,94.3], arpu:[81,67,55,48,42,38] },
  si:   { rev:[3201,26846,217960,559429,732792,979028], ebitda:[-1237,14953,147061,377648,517235,754610], capex:[12727,75786,260379,358035,241821,342660],
          gw:[0.8,2.8,10.1,20.2,29.3,48.3] },
  arrGrid:{ gw:[7,8,9,10,11,12,13], perW:[20,30,40,50,60] },   // FAQ deck, "Illustrative YE27 ARR potential" = GW × $/W
  launches:{ yrs:['2027E','2028E','2029E','2030E','2031E'], supply:[60,300,1000,2250,5000] },
  /* Illustrative neocloud model per 1 GW (initiation, Jul 2026, Figure 9 / 93) */
  perGW:{ dcBuild:10.0, dcBuildTrad:13.5, itEquip:22.8, itEquipHigh:35, opex:1.73,
          cases:[['$15/W',15,87.2,23.3],['$20/W',20,90.4,40.6],['$50/W',50,96.2,129.9]], highCost15:{ irr:7.2, npv:-5.6 } },
  anthropicBlended:29, anthropicHopper:13, blackwell:50
};

/* Debt stack. On balance sheet: 10-Q Q2 2026 note 9 (Jun 30) and Q3 release total (Sep 30). Saturn: press (Bloomberg, Nov 20–21 2026). */
const DEBT = {
  bsTotal:38844, related:12897, liquidity:89855,
  tranches:[ ['2031',5.350],['2033',5.650],['2036',5.875],['2046',6.600],['2056',6.650] ],
  bondTotal:25000, bondCoupon:5.855, bondEff:6.03, bondWAM:11.7,
  stack:[ ['SpaceX Notes (Jun 2026 bond)',25000,'Unsecured, investment grade, 5 tranches 2031–2056, 5.855% avg coupon'],
          ['Valor sale-leasebacks (related party)',13329,'Colossus equipment sold and leased back; booked as debt (Nov 2025, Jan & Apr 2026)'],
          ['Finance leases',1079,''], ['X notes remnant',27,'2027 and 2030 notes'] ],
  maturities:{ '2026':944, '2027':2402, '2028':2867, '2029':3422, '2030':3597, later:25201 },
  saturn:{ notes:32000, package:44000, gpus:47300, yieldA3:8.259, rating:'Moody\'s A3 / KBRA A- (prelim.)', term:'~5-year lease, hell-or-high-water',
           tranches:[['Class A-3 (Apr 2033)',25200],['Class A-2 (Apr 2031)',4400],['Class B (subordinated)',2400]] },
  bond2031Yield:7.2
};

/* ───── engine (dashboard model.js) ───── */
/* ═════════════ MODEL — one engine shared by Financials, Cash & financing and Valuation ═════════════
   How it works
   · A "base" is a full set of yearly paths taken from a source: Bloomberg consensus (CONS) or J.P. Morgan (JPM).
   · The sliders move the 2027 level of a few drivers; every later year moves with it, so the default
     settings of the Consensus scenario reproduce the consensus segment fields.
   · Financials → cash flow from operations and capex → Cash & financing (how much debt is needed, interest)
     → interest feeds back into net income and cash flow (solved by iteration) → Valuation.
   Everything is in $ millions unless a label says otherwise. Index 0 = 2025A, 1..5 = 2026E..2030E. */

const MODEL = (() => {
  const N = 6, FY = [1,2,3,4,5];
  const avgOf = gw => gw.map((g,i) => i ? (gw[i-1] + g) / 2 : null);
  const sum = (...a) => a.reduce((x,y) => x + (y || 0), 0);

  /* ---------- bases ---------- */
  function consBase(){
    const c = CONS, gw = c.si.gw.slice(), avg = avgOf(gw);
    const siCapex = c.tot.capex.map((t,i) => t - c.space.capex[i] - c.conn.capex[i]);           // residual, so FCF matches the consensus FCF field
    const segE = c.tot.rev.map((_,i) => c.space.ebitda[i] + c.conn.ebitda[i] + c.si.ebitda[i]);
    return {
      key:'cons', gw, perW: c.si.infra.map((x,i) => i ? x / (avg[i]*1000) : null),
      ads: c.si.ads.slice(), siMargin: c.si.ebitda.map((e,i) => e / (c.si.ads[i] + c.si.infra[i])),
      capGW: siCapex.map((x,i) => i ? x / Math.max(0.05, gw[i] - gw[i-1]) : null), siCapex,
      subs: c.conn.subs.slice(), arpu: c.conn.arpu.slice(),
      consumer: c.conn.consumer.slice(), entgov: c.conn.entgov.slice(),
      connMargin: c.conn.ebitda.map((e,i) => e / (c.conn.consumer[i] + c.conn.entgov[i])), connCapex: c.conn.capex.slice(),
      spaceRev: c.space.rev.slice(), spaceEbitda: c.space.ebitda.slice(), spaceCapex: c.space.capex.slice(),
      wc: c.tot.cfo.map((x,i) => x - (segE[i] - c.tot.netInt[i] - c.tot.tax[i])),
      taxRate: c.tot.tax.map((t,i) => c.tot.pretax[i] > 0 ? Math.max(0, t / c.tot.pretax[i]) : 0)
    };
  }
  function jpmBase(){
    const j = JPM, c = CONS, cb = consBase(), gw = j.si.gw.slice(), avg = avgOf(gw);
    const infra = j.si.rev.map((r,i) => r - c.si.ads[i]);
    const share = c.conn.consumer.map((x,i) => x / (x + c.conn.entgov[i]));
    return { ...cb, key:'jpm', gw,
      perW: infra.map((x,i) => i ? x / (avg[i]*1000) : null), ads: c.si.ads.slice(),
      siMargin: j.si.ebitda.map((e,i) => e / j.si.rev[i]),
      capGW: j.si.capex.map((x,i) => i ? x / Math.max(0.05, gw[i] - gw[i-1]) : null), siCapex: j.si.capex.slice(),
      subs: j.conn.subs.slice(), arpu: j.conn.arpu.slice(),
      consumer: j.conn.rev.map((r,i) => r * share[i]), entgov: j.conn.rev.map((r,i) => r * (1 - share[i])),
      connMargin: j.conn.ebitda.map((e,i) => e / j.conn.rev[i]), connCapex: j.conn.capex.slice(),
      spaceRev: j.space.rev.slice(), spaceEbitda: j.space.ebitda.slice(), spaceCapex: j.space.capex.slice() };
  }
  const BASES = { cons: consBase(), jpm: jpmBase() };
  const consSegRev = CONS.tot.rev.map((_,i) => CONS.space.rev[i] + CONS.conn.consumer[i] + CONS.conn.entgov[i] + CONS.si.ads[i] + CONS.si.infra[i]);
  const consAvgGW = avgOf(CONS.si.gw);

  /* default driver values read off a base (2027 = index 2) */
  /* exact base values, so the preset reproduces its source; sliders only round what they display */
  const driversOf = b => ({ base:b.key, gw27:b.gw[2], addMult:100, perW27:b.perW[2], dPerW:0, siM:0,
                            capGW27:b.capGW[2]/1000, subs27:b.subs[2], arpu27:b.arpu[2] });
  const FIN0 = { rate:6.0, saturn:32000, minCash:20000, equity:0, cashYield:4.0, oldRate:6.0, leaseRate:8.26 };

  const PRESETS = {
    bear: { label:'Bear', note:'Slower build (7 GW at YE27), rental price normalising toward $10–15/W by 2030, lower SI margin, costlier GW, softer Starlink',
            a:{ ...driversOf(BASES.cons), gw27:7, addMult:70, perW27:20, dPerW:-8, siM:-10, capGW27:40, subs27:24, arpu27:56 },
            v:{ pe:15, evx:10, ke:11, wacc:10.5, exitX:10, g:2.5 } },
    cons: { label:'Consensus', note:'Bloomberg consensus segment estimates, unchanged',
            a:driversOf(BASES.cons), v:{ pe:20, evx:14, ke:10, wacc:9.5, exitX:14, g:3 } },
    jpm:  { label:'J.P. Morgan', note:'J.P. Morgan Oct 21 2026 estimates run through our engine (their PT: 20× 2028E GAAP EPS)',
            a:driversOf(BASES.jpm), v:{ pe:20, evx:14, ke:10, wacc:9.5, exitX:14, g:3 } },
    bull: { label:'Bull', note:'Musk\'s own targets: 13 GW at YE27 (Q3 call) earning ~$38/W, so ~$500B exit ARR, his "best guess" (Baron, Nov 6); build at ~60% of industry cost (TomorrowX, Nov 18); stronger Starlink',
            a:{ ...driversOf(BASES.cons), gw27:13, addMult:120, perW27:38, dPerW:0, siM:5, capGW27:30, subs27:29.5, arpu27:61 },
            v:{ pe:25, evx:18, ke:9.5, wacc:9, exitX:18, g:3.5 } }
  };

  /* ---------- the engine ---------- */
  function run(a, f, vIn){
    const b = BASES[a.base];
    const o = { gw:[], avg:[], perW:[], infra:[], ads:[], siRev:[], siEbitda:[], siMargin:[], siCapex:[], siDA:[],
                subs:[], arpu:[], consumer:[], entgov:[], connRev:[], connEbitda:[], connCapex:[], connDA:[],
                spaceRev:[], spaceEbitda:[], spaceCapex:[], spaceDA:[],
                rev:[], ebitda:[], da:[], sbc:[], netInt:[], intExp:[], intInc:[], pretax:[], tax:[], ni:[], shares:[], eps:[],
                wc:[], cfo:[], capex:[], fcf:[], ufcf:[] };
    for(let i = 0; i < N; i++){
      const fx = i >= 2;                                    // driver years: 2027E onward
      o.gw[i] = i < 2 ? b.gw[i] : i === 2 ? a.gw27 : o.gw[i-1] + Math.max(0, b.gw[i] - b.gw[i-1]) * a.addMult / 100;
      o.avg[i] = i ? (o.gw[i-1] + o.gw[i]) / 2 : null;
      o.perW[i] = i ? (fx ? b.perW[i] * (a.perW27 / b.perW[2]) * Math.pow(1 + a.dPerW/100, i - 2) : b.perW[i]) : null;
      o.ads[i] = b.ads[i];
      o.infra[i] = i ? o.perW[i] * o.avg[i] * 1000 : CONS.si.infra[0];
      o.siRev[i] = o.ads[i] + o.infra[i];
      o.siMargin[i] = b.siMargin[i] + (fx ? a.siM / 100 : 0);
      o.siEbitda[i] = o.siRev[i] * o.siMargin[i];
      const capGW = i ? b.capGW[i] * (fx ? (a.capGW27 * 1000) / b.capGW[2] : 1) : null;
      o.siCapex[i] = i ? (i < 2 ? b.siCapex[i] : Math.max(0, o.gw[i] - o.gw[i-1]) * capGW) : b.siCapex[0];
      o.siDA[i] = i ? CONS.si.da[i] * o.avg[i] / consAvgGW[i] : CONS.si.da[0];

      o.subs[i] = fx ? b.subs[i] * a.subs27 / b.subs[2] : b.subs[i];
      o.arpu[i] = fx ? b.arpu[i] * a.arpu27 / b.arpu[2] : b.arpu[i];
      const kb = i ? ((b.subs[i-1] + b.subs[i]) / 2) * b.arpu[i] : 1, km = i ? ((o.subs[i-1] + o.subs[i]) / 2) * o.arpu[i] : 1;
      o.consumer[i] = b.consumer[i] * km / kb; o.entgov[i] = b.entgov[i];
      o.connRev[i] = o.consumer[i] + o.entgov[i]; o.connEbitda[i] = o.connRev[i] * b.connMargin[i];
      o.connCapex[i] = b.connCapex[i]; o.connDA[i] = CONS.conn.da[i];

      o.spaceRev[i] = b.spaceRev[i]; o.spaceEbitda[i] = b.spaceEbitda[i]; o.spaceCapex[i] = b.spaceCapex[i]; o.spaceDA[i] = CONS.space.da[i];

      o.rev[i] = o.spaceRev[i] + o.connRev[i] + o.siRev[i];
      o.ebitda[i] = o.spaceEbitda[i] + o.connEbitda[i] + o.siEbitda[i];
      o.da[i] = o.spaceDA[i] + o.connDA[i] + o.siDA[i];
      o.sbc[i] = CONS.tot.sbc[i];
      o.capex[i] = o.spaceCapex[i] + o.connCapex[i] + o.siCapex[i];
      o.wc[i] = b.wc[i] * o.rev[i] / consSegRev[i];
    }
    /* financing ↔ interest, solved by iteration (interest uses average balances) */
    let netInt = CONS.tot.netInt.slice(), fin = null;
    for(let it = 0; it < 6; it++){
      for(let i = 0; i < N; i++){
        o.netInt[i] = netInt[i];
        o.pretax[i] = o.ebitda[i] - o.da[i] - o.sbc[i] - o.netInt[i];
        o.tax[i] = Math.max(0, o.pretax[i] * b.taxRate[i]);
        o.ni[i] = o.pretax[i] - o.tax[i];
        o.cfo[i] = o.ebitda[i] - o.netInt[i] - o.tax[i] + o.wc[i];
        o.fcf[i] = o.cfo[i] - o.capex[i];
      }
      fin = finance(o, f);
      netInt = o.netInt.map((x,i) => i >= 2 ? fin.netInt[i] : x);
    }
    for(let i = 0; i < N; i++){
      o.shares[i] = CONS.tot.shares[i] + (i >= 2 ? fin.newShares : 0);
      o.eps[i] = o.ni[i] / o.shares[i];
      o.ufcf[i] = o.fcf[i] + o.netInt[i] * (1 - b.taxRate[i]);
    }
    /* 2025 is reported: show the actual lines below EBITDA rather than the engine's reconstruction */
    const t = CONS.tot;
    o.netInt[0] = t.netInt[0]; o.pretax[0] = t.pretax[0]; o.tax[0] = t.tax[0]; o.ni[0] = t.pretax[0] - t.tax[0];
    o.cfo[0] = t.cfo[0]; o.capex[0] = t.capex[0]; o.fcf[0] = t.fcf[0]; o.shares[0] = t.shares[0]; o.eps[0] = t.epsGaap[0];
    o.intExp = fin.intExp; o.intInc = fin.intInc;
    o.fin = fin; o.a = a; o.f = f;
    if(vIn) o.val = value(o, vIn);
    return o;
  }

  /* Cash & financing, annual from Sep 30 2026. Saturn-type lease drawn in 2027 and amortised over 5 years from 2028. */
  function finance(o, f){
    const Y = ['2026','2027','2028','2029','2030'];
    const r = { liq:[], debt:[], lease:[], newDebt:[], matur:[], leaseIn:[], leaseOut:[], equityIn:[], netInt:[], intExp:[], intInc:[],
                netDebt:[], lev:[], cover:[], liqPre:[], newShares:0 };
    const fcf9M = IS9M.fcf[1];
    // 2026: Sep 30 balances + 4Q26 free cash flow (model year minus 9M actual); no new debt assumed
    const q4 = o.fcf[1] - fcf9M;
    r.liq[1] = DEBT.liquidity + q4; r.debt[1] = DEBT.bsTotal; r.lease[1] = 0; r.newDebt[1] = 0; r.liqPre[1] = r.liq[1];
    r.netInt[1] = o.netInt[1]; r.intExp[1] = null; r.intInc[1] = null;
    r.netDebt[1] = r.debt[1] - r.liq[1];
    r.newShares = f.equity > 0 ? f.equity / (f.eqPrice || PRICE.px || 135) : 0;   // IPO price if no live quote yet
    let oldDebt = DEBT.bsTotal, newDebtStock = 0;
    for(let i = 2; i < 6; i++){
      const y = Y[i-1], m = DEBT.maturities[y] || 0;
      const leaseIn = i === 2 ? f.saturn : 0, leaseOut = i >= 3 ? f.saturn / 5 : 0, eq = i === 2 ? f.equity : 0;
      const pre = r.liq[i-1] + o.fcf[i] - m + leaseIn - leaseOut + eq;
      const need = Math.max(0, f.minCash - pre);
      r.liqPre[i] = pre;
      r.liq[i] = pre + need; r.newDebt[i] = need; r.matur[i] = m; r.leaseIn[i] = leaseIn; r.leaseOut[i] = leaseOut; r.equityIn[i] = eq;
      const oldBoy = oldDebt; oldDebt = Math.max(0, oldDebt - m);
      const newBoy = newDebtStock; newDebtStock += need;
      r.debt[i] = oldDebt + newDebtStock;
      r.lease[i] = Math.max(0, (r.lease[i-1] || 0) + leaseIn - leaseOut);
      const leaseAvg = ((r.lease[i-1] || 0) + r.lease[i]) / 2;
      r.intExp[i] = (oldBoy + oldDebt) / 2 * f.oldRate / 100 + (newBoy + newDebtStock) / 2 * f.rate / 100 + leaseAvg * f.leaseRate / 100;
      r.intInc[i] = (r.liq[i-1] + r.liq[i]) / 2 * f.cashYield / 100;
      r.netInt[i] = r.intExp[i] - r.intInc[i];
      r.netDebt[i] = r.debt[i] + r.lease[i] - r.liq[i];
      r.lev[i] = (r.debt[i] + r.lease[i]) / Math.max(1, o.ebitda[i]);
      r.cover[i] = o.ebitda[i] / Math.max(1, r.intExp[i]);
    }
    r.lev[1] = r.debt[1] / Math.max(1, o.ebitda[1]);
    r.cumNewDebt = r.newDebt.slice(2).reduce((x,y) => x + y, 0);
    r.peakLev = Math.max(...r.lev.slice(2));
    /* 2027 by quarter, consensus shape: cash before any new financing vs with it */
    const wC = CONS.q27.cfo.map(x => x / CONS.q27.cfo.reduce((p,q) => p+q, 0)), wK = CONS.q27.capex.map(x => x / CONS.q27.capex.reduce((p,q) => p+q, 0));
    let pre = r.liq[1], post = r.liq[1]; r.q27 = { pre:[pre], post:[post], raise:[0] };
    for(let q = 0; q < 4; q++){
      const flow = o.cfo[2] * wC[q] - o.capex[2] * wK[q] - (q === 3 ? r.matur[2] : 0) + (q === 0 ? r.leaseIn[2] + r.equityIn[2] : 0);
      pre += flow; post += flow; let raise = 0; if(post < f.minCash){ raise = f.minCash - post; post = f.minCash; }
      r.q27.pre.push(pre); r.q27.post.push(post); r.q27.raise.push(raise);
    }
    r.runOut = (() => { const L = ['YE26','1Q27','2Q27','3Q27','4Q27']; const k = r.q27.pre.findIndex(x => x < 0); return k < 0 ? null : L[k]; })();
    return r;
  }

  /* Valuation. Target year index ty (2..5). PT dated Dec 31 of the year before the target year, then discounted to today. */
  function value(o, v){
    const ty = v.ty, yrs = ty - 2 + 0.1;                // Nov 25 2026 → Dec 31 of (target year − 1)
    const sh = o.shares[ty];
    const pe = { eps:o.eps[ty], pt:o.eps[ty] * v.pe }; pe.pv = pe.pt / Math.pow(1 + v.ke/100, yrs);
    const nd = o.fin.netDebt[ty-1];
    const ev = { ebitda:o.ebitda[ty], ev:o.ebitda[ty] * v.evx, netDebt:nd }; ev.eq = ev.ev - nd; ev.pt = ev.eq / sh; ev.pv = ev.pt / Math.pow(1 + v.ke/100, yrs);
    const w = v.wacc / 100, rows = [];
    let pvSum = 0;
    for(let i = 2; i <= 5; i++){ const t = (i - 2) + 0.5 + 0.1, df = 1 / Math.pow(1 + w, t); rows.push({ y:MYEARS[i], ufcf:o.ufcf[i], df, pv:o.ufcf[i]*df }); pvSum += o.ufcf[i]*df; }
    const tv = v.tv === 'g' ? (w > v.g/100 ? o.ufcf[5] * (1 + v.g/100) / (w - v.g/100) : NaN) : o.ebitda[5] * v.exitX;
    const tvPV = tv / Math.pow(1 + w, 4.1);
    const dcf = { rows, pvSum, tv, tvPV, ev:pvSum + tvPV, netDebt:o.fin.netDebt[1] }; dcf.eq = dcf.ev - dcf.netDebt; dcf.pv = dcf.eq / o.shares[2]; dcf.pt = dcf.pv;
    const pick = v.m === 'ev' ? ev : v.m === 'dcf' ? dcf : pe;
    return { pe, ev, dcf, pick, pv:pick.pv, pt:pick.pt, yrs, up: PRICE.px ? pick.pv / PRICE.px - 1 : null };
  }

  /* ---------- state + subscribers ---------- */
  const st = { scen:'cons', a:{ ...PRESETS.cons.a }, f:{ ...FIN0, eqPrice:PRICE.px },
               v:{ m:'pe', ty:3, tv:'exit', ...PRESETS.cons.v } };
  const subs = [];
  let out = run(st.a, st.f, st.v);
  const notify = () => { out = run(st.a, st.f, st.v); subs.forEach(fn => { try { fn(out, st); } catch(e){ console.error('[model]', e); } }); };
  return {
    BASES, PRESETS, FIN0, st,
    get out(){ return out; },
    on(fn){ subs.push(fn); fn(out, st); },
    clear(){ subs.length = 0; },   // portal: drop the previous mount's listeners when the Deep Dive is rebuilt
    setScenario(k){ const p = PRESETS[k]; st.scen = k; st.a = { ...p.a }; Object.assign(st.v, p.v); notify(); },
    set(group, patch, keepScen){ Object.assign(st[group], patch); if(group !== 'f' && !keepScen) st.scen = 'custom'; notify(); },
    resetFin(){ st.f = { ...FIN0, eqPrice:PRICE.px }; notify(); },
    runPreset(k, vOver){ const p = PRESETS[k]; return run({ ...p.a }, st.f, { ...st.v, ...p.v, ...(vOver||{}) }); },
    run
  };
})();

/* Shared UI bits for the three model tabs */
const fmtB = (m, d=1) => m == null || !isFinite(m) ? '—' : (m < 0 ? '−' : '') + '$' + num(Math.abs(m)/1000, d) + 'B';
const pctS = (x, d=0) => x == null || !isFinite(x) ? '—' : (x < 0 ? '−' : x > 0 ? '+' : '') + Math.abs(x*100).toFixed(d) + '%';
function scenPills(id){
  const opts = [['bear','Bear'],['cons','Consensus'],['jpm','J.P. Morgan'],['bull','Bull']];
  return `<div><span class="ctl-l">Scenario</span><div class="fbg scen-pills" id="${id}">${opts.map(([v,t]) => `<button class="fb" data-v="${v}">${t}</button>`).join('')}<button class="fb cust" data-v="custom" disabled>Custom</button></div></div>`;
}
function wireScenPills(id){
  $$('#' + id + ' .fb[data-v]').forEach(b => { if(b.dataset.v !== 'custom') b.onclick = () => MODEL.setScenario(b.dataset.v); });
  MODEL.on((o, st) => $$('#' + id + ' .fb').forEach(b => b.classList.toggle('active', b.dataset.v === st.scen)));
}
/* slider row: [key, label, min, max, step, fmt, hint] → binds to MODEL.st[group][key] */
function sliderHTML(prefix, defs){
  return defs.map(([k, l, mn, mx, stp, , h]) => `<label><div class="rv">${l} <b id="${prefix}-${k}-v"></b></div><input type="range" id="${prefix}-${k}" min="${mn}" max="${mx}" step="${stp}"><span class="h" id="${prefix}-${k}-h">${h||''}</span></label>`).join('');
}
function wireSliders(prefix, group, defs){
  defs.forEach(([k, , , , , f]) => { const el = $('#' + prefix + '-' + k); el.oninput = () => MODEL.set(group, { [k]: +el.value }); });
  MODEL.on((o, st) => defs.forEach(([k, , , , , f]) => { const el = $('#' + prefix + '-' + k); if(+el.value !== st[group][k]) el.value = st[group][k]; $('#' + prefix + '-' + k + '-v').textContent = f(st[group][k]); }));
}

/* ───── view: fin ───── */
/* Financials — Bloomberg consensus as the base, J.P. Morgan as the reference, a few drivers you can move */
const FIN_DRIVERS = [
  ['gw27',   'Compute at end-2027',        4, 16, 0.1, v => num(v,1) + ' GW'],
  ['addMult','GW added 2028–30',           0, 200, 5,  v => v + '% of base'],
  ['perW27', 'Revenue per watt, 2027',     8, 45, 0.5, v => '$' + num(v,1) + '/W'],
  ['dPerW',  'Extra price change, 2028–30',-20, 10, 1, v => (v>0?'+':'') + v + '% / yr'],
  ['siM',    'Compute EBITDA margin',     -25, 15, 1,  v => (v>0?'+':'') + v + ' pp vs base'],
  ['capGW27','Capex per GW added, 2027',   20, 60, 0.5, v => '$' + num(v,1) + 'B'],
  ['subs27', 'Starlink subscribers, end-2027', 15, 35, 0.1, v => num(v,1) + 'M'],
  ['arpu27', 'Starlink ARPU, 2027',        40, 75, 0.5, v => '$' + num(v,1) + '/mo']
];

registerView({ id:'fin',
  html: `
  <div class="srow" id="fin-tiles"></div>

  ${sec({ t:'The forecast and what drives it', s:'Defaults are the Bloomberg consensus. Move a driver and every later year moves with it; the Funding and Scenario Valuation tabs follow',
    ctl:`<div class="ctls">${scenPills('fin-sc')}</div>`,
    b:`<div class="calc">
      <div class="inp">
        <div class="pt" style="margin:0">Compute (SI)</div>
        ${sliderHTML('fin', FIN_DRIVERS.slice(0,6))}
        <div class="pt" style="margin:6px 0 0">Starlink</div>
        ${sliderHTML('fin', FIN_DRIVERS.slice(6))}
      </div>
      <div>
        <div class="ctls" style="margin-bottom:10px">${seg('fin-m','Show',[['rev','Revenue'],['ebitda','Adj. EBITDA'],['fcf','Free cash flow'],['eps','EPS']],'rev')}</div>
        <div id="fin-c"></div>
        <div class="snote" id="fin-scnote" style="margin-top:12px"></div>
      </div>
    </div>`,
    n:'Base = Bloomberg consensus (BEst) segment fields, pulled Nov 25 2026. "Revenue per watt" is blended revenue per watt of average installed compute (third-party rentals plus Grok/Cursor), the way J.P. Morgan frames the $500B–1T ARR target. Space is held at the base. Interest comes back from the Funding tab.' })}

  ${sec({ t:'Income statement to EPS, and cash flow', s:'2025 actual, 2026–2030 estimates. Switch the source to compare',
    ctl:`<div class="ctls">${seg('fin-src','Source',[['m','Our model'],['c','Bloomberg consensus'],['j','J.P. Morgan (published)']],'m')}</div>`,
    b:`<div class="tw" id="fin-t"></div>`,
    n:'<b>Reading the consensus.</b> Each Bloomberg field averages a different set of analysts, so the segments do not add up to the headline fields (2028 segment revenue is ~$36B above the total-revenue field). Our model builds from the segments; for capex it uses the total field and treats compute as the residual, so its free cash flow matches the consensus FCF field. J.P. Morgan columns are their published Oct 21 2026 figures; blank where they do not publish the line.' })}

  ${sec({ t:'What a gigawatt earns', s:'The compute business is a price-per-watt business. The number to watch is $/W, not GW',
    b:`<div class="cols2">
      <div><div class="pt">Year-end 2027 ARR = GW × $ per watt (J.P. Morgan grid)</div><div class="tw" id="fin-arr"></div>
        <div class="pt" style="margin-top:16px">Payback on one GW in our model</div><div id="fin-pb"></div></div>
      <div><div class="pt">One GW, J.P. Morgan illustrative model</div>
        <div class="tw">${table(['Rental price','Adj. EBITDA margin','IRR'], JPM.perGW.cases.map(r => [r[0], r[2].toFixed(1) + '%', r[3].toFixed(1) + '%']))}</div>
        <ul class="pl" style="margin-top:12px">
          <li><strong>Cost to build:</strong> ~$${JPM.perGW.dcBuild}M/MW for the data center (vs $${JPM.perGW.dcBuildTrad}M for a traditional developer) plus ~$${JPM.perGW.itEquip}B of GPUs → ~$33B per GW. Management: "mid-$30s B" vs $50B+ for others.</li>
          <li><strong>What breaks it:</strong> with GPUs at ~$${JPM.perGW.itEquipHigh}B per GW and $15/W, the IRR falls to <strong>${JPM.perGW.highCost15.irr}%</strong> and NPV turns negative. Normalisation toward $10–15/W (Deutsche Bank, Clear Street) is the case to stress.</li>
          <li><strong>Price today:</strong> Anthropic pays a blended ~$${JPM.anthropicBlended}/W (Hopper ~$${JPM.anthropicHopper}, Blackwell ~$${JPM.blackwell}); Google ~$50; new deals "slightly above" $50; Vera Rubin expected ~40% above GB300 (SemiAnalysis via J.P. Morgan).</li>
        </ul></div>
    </div>`,
    n:'J.P. Morgan initiation (Jul 7 2026, Figures 9, 93 and the Anthropic/Google contract pages), Key Investor FAQs (Nov 2026) and the Oct 21 note. Payback = capex per GW ÷ annual EBITDA per GW at the model\'s 2027 price and margin.' })}
  `,
  init(){
    wireScenPills('fin-sc');
    wireSliders('fin', 'a', FIN_DRIVERS);
    let metric = 'rev', src = 'm', blk = null;
    const L = MYEARS;
    const hints = { gw27:b => b.gw[2], perW27:b => b.perW[2], capGW27:b => b.capGW[2]/1000, subs27:b => b.subs[2], arpu27:b => b.arpu[2] };
    const BC = MODEL.BASES.cons, BJ = MODEL.BASES.jpm;
    Object.entries(hints).forEach(([k, g]) => { const d = FIN_DRIVERS.find(x => x[0] === k); $('#fin-' + k + '-h').textContent = 'Consensus ' + d[5](+g(BC).toFixed(1)) + ' · J.P. Morgan ' + d[5](+g(BJ).toFixed(1)); });
    $('#fin-addMult-h').textContent = 'Base adds ' + [3,4,5].map(i => num(BC.gw[i]-BC.gw[i-1],1)).join(' / ') + ' GW (cons.)';
    $('#fin-dPerW-h').textContent = 'On top of the base path (cons. $/W falls ~11%/yr)';
    $('#fin-siM-h').textContent = 'Cons. 2027 margin ' + (BC.siMargin[2]*100).toFixed(0) + '% · J.P. Morgan ' + (BJ.siMargin[2]*100).toFixed(0) + '%';

    const chartCfg = o => {
      const est = i => i > 0;
      if(metric === 'rev') return { labels:L, unit:'$B', fmt:v => '$' + num(v,0) + 'B', type:'bar', stacked:true, rowHead:'Year', total:false,
        series:[ { key:'sp', label:'Space', color:C.space, data:o.spaceRev.map(x => x/1000), stack:'m' },
                 { key:'co', label:'Starlink', color:C.conn, data:o.connRev.map(x => x/1000), stack:'m' },
                 { key:'si', label:'Compute (SI)', color:C.si, data:o.siRev.map(x => x/1000), stack:'m' },
                 { key:'cb', label:'Consensus total field', color:C.grey, type:'line', dash:true, stack:'cb', data:CONS.tot.rev.map(x => x/1000) },
                 { key:'jp', label:'J.P. Morgan', color:'#B45309', type:'line', dash:true, stack:'jp', data:JPM.rev.map(x => x/1000) } ],
        tableNote:'Bars: our model by segment. Lines: the Bloomberg total-revenue field and J.P. Morgan\'s published total.' };
      const line = (k, lab, cons, jpm, f, u) => ({ labels:L, unit:u, fmt:f, rowHead:'Year', type:'bar', stacked:false,
        series:[ { key:'m', label:'Our model · ' + lab, color:C.conn, data:o[k].map(x => k === 'eps' ? x : x/1000) },
                 { key:'c', label:'Bloomberg consensus', color:C.grey, type:'line', dash:true, data:cons },
                 { key:'j', label:'J.P. Morgan', color:'#B45309', type:'line', dash:true, data:jpm } ] });
      if(metric === 'ebitda') return line('ebitda', 'Adj. EBITDA', CONS.tot.ebitda.map(x => x/1000), JPM.ebitda.map(x => x/1000), v => '$' + num(v,0) + 'B', '$B');
      if(metric === 'fcf') return line('fcf', 'FCF', CONS.tot.fcf.map(x => x/1000), JPM.fcf.map(x => x == null ? null : x/1000), v => '$' + num(v,0) + 'B', '$B');
      return line('eps', 'diluted EPS (GAAP-like)', CONS.tot.epsGaap, JPM.epsGaap, v => '$' + num(v,2), '$/share');
    };
    pills('#fin-m', v => { metric = v; blk.set({ stacked:false, total:false, tableNote:'', ...chartCfg(MODEL.out) }); });
    pills('#fin-src', v => { src = v; drawTable(MODEL.out); });

    const B = x => x == null || isNaN(x) ? '—' : num(x/1000, 1);
    const P = x => x == null || isNaN(x) ? '—' : (x*100).toFixed(0) + '%';
    const rowsModel = o => [
      ['<b>Revenue</b>', o.rev.map(B)], ['  Space', o.spaceRev.map(B)], ['  Starlink', o.connRev.map(B)], ['  Compute (SI)', o.siRev.map(B)],
      ['<b>Adj. EBITDA</b>', o.ebitda.map(B)], ['  margin', o.ebitda.map((e,i) => P(e/o.rev[i]))],
      ['  Space', o.spaceEbitda.map(B)], ['  Starlink', o.connEbitda.map(B)], ['  Compute (SI)', o.siEbitda.map(B)],
      ['D&A', o.da.map(x => B(-x))], ['Stock-based pay', o.sbc.map(x => B(-x))], ['Net interest', o.netInt.map(x => B(-x))],
      ['Pre-tax income', o.pretax.map(B)], ['Tax', o.tax.map(x => B(-x))], ['<b>Net income</b>', o.ni.map(B)],
      ['Diluted shares (B)', o.shares.map(x => num(x/1000,2))], ['<b>EPS ($)</b>', o.eps.map(x => num(x,2))],
      ['<b>Cash from operations</b>', o.cfo.map(B)], ['Capex', o.capex.map(x => B(-x))], ['<b>Free cash flow</b>', o.fcf.map(B)],
      ['Compute, year-end (GW)', o.gw.map(x => num(x,1))], ['Revenue per watt ($/W)', o.perW.map(x => x == null ? '—' : num(x,1))],
      ['Starlink subscribers (M)', o.subs.map(x => num(x,1))], ['Starlink ARPU ($/mo)', o.arpu.map(x => num(x,1))] ];
    const rowsCons = () => { const c = CONS, t = c.tot; return [
      ['<b>Revenue</b> (total field)', t.rev.map(B)], ['  Space', c.space.rev.map(B)], ['  Starlink', c.conn.revField.map(B)], ['  Compute (SI)', c.si.revField.map(B)],
      ['<b>Adj. EBITDA</b> (total field)', t.ebitda.map(B)], ['  margin', t.ebitda.map((e,i) => P(e/t.rev[i]))],
      ['  Space', c.space.ebitda.map(B)], ['  Starlink', c.conn.ebitda.map(B)], ['  Compute (SI)', c.si.ebitda.map(B)],
      ['D&A', t.da.map(x => B(-x))], ['Stock-based pay', t.sbc.map(x => B(-x))], ['Net interest', t.netInt.map(x => B(-x))],
      ['Pre-tax income', t.pretax.map(B)], ['Tax', t.tax.map(x => B(-x))], ['<b>Net income</b>', '—'.repeat(6).split('')],
      ['Diluted shares (B)', t.shares.map(x => num(x/1000,2))], ['<b>EPS ($)</b> GAAP / adj.', t.epsGaap.map((x,i) => num(x,2) + ' / ' + num(t.epsAdj[i],2))],
      ['<b>Cash from operations</b>', t.cfo.map(B)], ['Capex', t.capex.map(x => B(-x))], ['<b>Free cash flow</b>', t.fcf.map(B)],
      ['Compute, year-end (GW)', c.si.gw.map(x => num(x,1))], ['Revenue per watt ($/W)', BC.perW.map(x => x == null ? '—' : num(x,1))],
      ['Starlink subscribers (M)', c.conn.subs.map(x => num(x,1))], ['Starlink ARPU ($/mo)', c.conn.arpu.map(x => num(x,1))] ]; };
    const rowsJpm = () => { const j = JPM, d = '—'; return [
      ['<b>Revenue</b>', j.rev.map(B)], ['  Space', j.space.rev.map(B)], ['  Starlink', j.conn.rev.map(B)], ['  Compute (SI)', j.si.rev.map(B)],
      ['<b>Adj. EBITDA</b>', j.ebitda.map(B)], ['  margin', j.ebitda.map((e,i) => P(e/j.rev[i]))],
      ['  Space', j.space.ebitda.map(B)], ['  Starlink', j.conn.ebitda.map(B)], ['  Compute (SI)', j.si.ebitda.map(B)],
      ['D&A', Array(6).fill(d)], ['Stock-based pay', Array(6).fill(d)], ['Net interest', Array(6).fill(d)],
      ['Pre-tax income', Array(6).fill(d)], ['Tax', Array(6).fill(d)], ['<b>Net income</b>', Array(6).fill(d)],
      ['Diluted shares (B)', Array(6).fill(d)], ['<b>EPS ($)</b> GAAP', j.epsGaap.map(x => x == null ? d : num(x,2))],
      ['<b>Cash from operations</b>', j.cfo.map(B)], ['Capex', j.capex.map(x => x == null ? d : B(-x))], ['<b>Free cash flow</b>', j.fcf.map(B)],
      ['Compute, year-end (GW)', j.si.gw.map(x => num(x,1))], ['Revenue per watt ($/W)', BJ.perW.map(x => x == null ? '—' : num(x,1))],
      ['Starlink subscribers (M)', j.conn.subs.map(x => num(x,1))], ['Starlink ARPU ($/mo)', j.conn.arpu.map(x => num(x,1))] ]; };
    const drawTable = o => {
      const rows = (src === 'c' ? rowsCons() : src === 'j' ? rowsJpm() : rowsModel(o)).map(([l, a]) => [l.replace(/^  /, '&nbsp;&nbsp;&nbsp;'), ...a]);
      $('#fin-t').innerHTML = table(['$B unless stated', ...MYEARS], rows, new Set([2,3,4,5,6]));
    };

    MODEL.on(o => {
      const c = CONS.tot, i = 2;
      $('#fin-tiles').innerHTML =
        tile('Revenue 2027E', fmtB(o.rev[i],0), 'Consensus ' + fmtB(c.rev[i],0) + ' · JPM ' + fmtB(JPM.rev[i],0)) +
        tile('Adj. EBITDA 2027E', fmtB(o.ebitda[i],0), (o.ebitda[i]/o.rev[i]*100).toFixed(0) + '% margin · cons. ' + fmtB(c.ebitda[i],0)) +
        tile('Free cash flow 2027E', fmtB(o.fcf[i],0), 'CFO ' + fmtB(o.cfo[i],0) + ' − capex ' + fmtB(o.capex[i],0)) +
        tile('EPS 2027E / 2028E', '$' + num(o.eps[2],2) + ' / $' + num(o.eps[3],2), 'Cons. $' + num(c.epsGaap[2],2) + ' / $' + num(c.epsGaap[3],2) + ' GAAP');
      const st = MODEL.st, p = MODEL.PRESETS[st.scen];
      $('#fin-scnote').innerHTML = '<b>' + (p ? p.label : 'Custom') + ':</b> ' + (p ? p.note : 'drivers moved from a preset; the base paths are ' + (st.a.base === 'jpm' ? 'J.P. Morgan' : 'consensus') + '.');
      if(!blk) blk = chartBlock($('#fin-c'), chartCfg(o)); else blk.set({ stacked:false, total:false, tableNote:'', ...chartCfg(o) });
      drawTable(o);
      /* ARR grid with the model's point marked */
      const g = JPM.arrGrid, gwM = o.gw[2], pwM = o.perW[2];
      $('#fin-arr').innerHTML = table(['GW \\ $/W', ...g.perW.map(x => '$' + x)], g.gw.map(G => [G + ' GW', ...g.perW.map(W => { const hit = Math.abs(G - gwM) < 0.5 && Math.abs(W - pwM) < 5; return (hit ? '<b style="color:var(--accent)">' : '') + '$' + num(G*W) + 'B' + (hit ? '</b>' : ''); })]))
        + `<div class="snote" style="margin:0;border:none;border-top:1px solid var(--bdr);border-radius:0">Our model: ${num(gwM,1)} GW × $${num(pwM,1)}/W ≈ <b>$${num(gwM*pwM,0)}B</b> exit ARR on installed capacity. Management target $500B–1T; J.P. Morgan ~$400B.</div>`;
      const capGW = o.siCapex[2] / Math.max(0.05, o.gw[2] - o.gw[1]) / 1000, ebGW = o.perW[2] * o.siMargin[2];
      $('#fin-pb').innerHTML = `<div class="res" style="grid-template-columns:repeat(3,1fr);margin:6px 0 0">${tile('Capex per GW', '$' + num(capGW,1) + 'B', '2027, model')}${tile('EBITDA per GW-year', '$' + num(ebGW,1) + 'B', '$' + num(o.perW[2],1) + '/W × ' + (o.siMargin[2]*100).toFixed(0) + '%')}${tile('Payback', num(capGW/ebGW,1) + ' yrs', 'Musk: "less than a year" on revenue')}</div>`;
    });
  }
});

/* ───── view: cash ───── */
/* Cash & financing — the cash flow from Financials meets the balance sheet: how much new debt the plan needs, and what it does to leverage */
const CASH_DRIVERS = [
  ['minCash',  'Minimum cash kept',          5000, 60000, 1000, v => fmtB(v,0), 'Debt is raised to stay above this'],
  ['rate',     'Rate on new debt',           4, 10, 0.1,       v => num(v,1) + '%', 'June bond: 5.86% coupon; 2031s now yield ~7.2%'],
  ['saturn',   'Off-balance GPU lease, 2027', 0, 100000, 1000, v => fmtB(v,0), 'Saturn trust (Nov 20): ~$32B notes at ~8.3%, 5-yr lease'],
  ['equity',   'New equity raised, 2027',    0, 150000, 5000, v => fmtB(v,0), 'Management told J.P. Morgan it is not considering it'],
  ['cashYield','Yield on cash',              0, 6, 0.1,        v => num(v,1) + '%', 'Interest income on liquidity']
];

registerView({ id:'cash',
  html: `
  <div class="srow" id="cash-tiles"></div>

  ${sec({ t:'Funding the plan', s:'Cash flow comes from the Financial Model tab; here you choose how the gap is filled',
    ctl:`<div class="ctls">${scenPills('cash-sc')}</div>`,
    b:`<div class="calc">
      <div class="inp">${sliderHTML('cash', CASH_DRIVERS)}
        <button class="fb" id="cash-reset" style="align-self:flex-start;border:1px solid var(--bdr);border-radius:8px;padding:6px 10px">Reset financing inputs</button></div>
      <div><div class="res" id="cash-res"></div>
        <div class="ctls" style="margin-bottom:10px">${seg('cash-v','View',[['q','2027 by quarter'],['y','2026–2030 by year'],['l','Leverage']],'q')}</div>
        <div id="cash-c"></div></div>
    </div>`,
    n:'Start: liquidity $89.9B and debt $38.8B at Sep 30 2026 (Q3 release), plus 4Q26 free cash flow from the model (no new debt assumed in 4Q). 2027 quarters follow the shape of the consensus quarterly CFO and capex. The off-balance lease is treated as debt-like: drawn in 2027, repaid evenly 2028–32, at 8.26%. Existing debt costs 6.0%. Own arithmetic, not a forecast.' })}

  ${sec({ t:'Sources and uses, year by year', s:'Every line ties to the model; new debt is the plug that keeps cash at the minimum',
    b:`<div class="tw" id="cash-t"></div>`,
    n:'References: Bloomberg consensus has $156B of debt proceeds in 2027 and total debt of $188B at YE27; J.P. Morgan models ~$330B of debt raised in 2026–2030 and positive FCF from 2029. Earlier rule of thumb (Clear Street / Cestrian): ~$65B of liquidity at YE26 and ~5 quarters of runway at the trailing burn.' })}

  ${sec({ t:'The debt today', s:'On the balance sheet, $38.8B; off it, the new GPU lease',
    ctl:`<div class="ctls">${seg('cash-d','Show',[['s','Debt stack'],['f','9M 2026 sources & uses']],'s')}</div>`,
    b:`<div class="cols2"><div id="cash-dc"></div>
      <div><div class="pt">June 2026 bond, $25B in five tranches</div>
        <div class="tw">${table(['Matures','Coupon'], DEBT.tranches.map(t => ['Jul 15 ' + t[0], t[1].toFixed(3) + '%']))}</div>
        <ul class="pl" style="margin-top:12px">
          <li><strong>Weighted:</strong> ${DEBT.bondCoupon}% coupon, ${DEBT.bondEff}% effective, ${DEBT.bondWAM} years. Repaid the $20B bridge loan in full.</li>
          <li><strong>Saturn Funding Trust (Nov 20):</strong> ~$${num(DEBT.saturn.notes/1000)}B of notes (package ~$${num(DEBT.saturn.package/1000)}B) buy ~$${num(DEBT.saturn.gpus/1000,1)}B of Nvidia GPUs leased to SpaceX for ~5 years; A-3 class ~$25.2B at <strong>${DEBT.saturn.yieldA3}%</strong>; ${DEBT.saturn.rating}. SpaceX pays even if it does not use the chips.</li>
          <li><strong>Maturities</strong> are light until 2031: $2.4B in 2027, $2.9B in 2028, $3.4B in 2029, $3.6B in 2030.</li>
          <li><strong>Covenants:</strong> the bridge loan's 3.75× leverage test went with it; the bond limits liens (7.5% of assets) and mergers.</li>
        </ul></div></div>`,
    n:'10-Q Q2 2026 note 9 (Jun 30 split, maturities, tranche coupons) and note 17 (Valor); Q3 2026 release (Sep 30 total $38.8B, of which $12.9B related party). Saturn: Bloomberg (Nov 17, 20–21 2026), Moody\'s/KBRA via press; tranche sizes not confirmed against the offering memorandum.' })}

  ${sec({ t:'Dilution and related parties', s:'Measured, not asserted',
    b:`<div class="cols2"><div id="cash-s"></div>
      <ul class="pl">
        <li><strong>Average basic shares</strong> rose from ${num(IS9M.sharesAvg[0])}M to ${num(IS9M.sharesAvg[1])}M (+150%) in a year.</li>
        <li><strong>Stock-based pay</strong> was ${usd(IS9M.sbc[1])} in 9M, <strong>14% of revenue</strong> (incl. acquisitions; Cursor adds $23.4B of unvested awards).</li>
        <li><strong>${usd(BS.debtRelated)} of ${usd(BS.debt)} debt</strong> is owed to related parties; ${usd(BS.interestRelated9M)} of ${usd(BS.interest9M)} interest went to them.</li>
        <li><strong>Lock-ups:</strong> ~1.3B shares (~18% of Class A) freed after Q3; Musk's ~6.4B Class A shares free on <strong>Jun 12 2027</strong>.</li>
      </ul></div>`,
    n:'10-Q Q3 2026 (share count, SBC, related-party debt and interest); lock-up dates from UBS and the prospectus.' })}
  `,
  init(){
    wireScenPills('cash-sc');
    wireSliders('cash', 'f', CASH_DRIVERS);
    $('#cash-reset').onclick = () => MODEL.resetFin();
    let view = 'q', blk = null, dview = 's', dblk = null;
    const Y = ['YE26','2027E','2028E','2029E','2030E'];
    const cfg = o => {
      const r = o.fin;
      if(view === 'q') return { labels:['YE26','1Q27','2Q27','3Q27','4Q27'], unit:'$B', fmt:v => '$' + num(v,0) + 'B', rowHead:'Quarter end', type:'line', stacked:false,
        series:[ { key:'pre', label:'Liquidity before any new debt', color:C.neg, type:'line', dash:true, data:r.q27.pre.map(x => x/1000) },
                 { key:'post', label:'Liquidity with new debt', color:C.conn, type:'line', data:r.q27.post.map(x => x/1000) },
                 { key:'raise', label:'Debt raised in the quarter', color:C.fog, type:'bar', data:r.q27.raise.map(x => x/1000) } ],
        extra: c => { c.options.scales.y.grid = { color: ctx => ctx.tick.value === 0 ? '#1E2733' : '#EEF1F5' }; },
        tableNote:'Before new debt, cash runs out in ' + (r.runOut || 'no quarter of 2027') + '. The off-balance lease and any equity land in 1Q27.' };
      if(view === 'y') return { labels:Y, unit:'$B', fmt:v => '$' + num(v,0) + 'B', rowHead:'Year end', type:'bar', stacked:true,
        series:[ { key:'d', label:'Debt', color:C.steel, data:r.debt.slice(1).map(x => x/1000), stack:'d' },
                 { key:'l', label:'GPU lease (debt-like)', color:C.sky, data:r.lease.slice(1).map(x => (x||0)/1000), stack:'d' },
                 { key:'c', label:'Liquidity', color:C.pos, type:'line', stack:'c', data:r.liq.slice(1).map(x => x/1000) },
                 { key:'cb', label:'Consensus total debt', color:C.grey, type:'line', dash:true, stack:'cb', data:CONS.tot.debt.slice(1).map(x => x/1000) } ] };
      return { labels:Y.slice(1), unit:'×', fmt:v => num(v,1) + '×', rowHead:'Year', type:'bar', stacked:false,
        series:[ { key:'lev', label:'Debt (incl. lease) ÷ EBITDA', color:C.steel, data:r.lev.slice(2) },
                 { key:'cov', label:'EBITDA ÷ interest', color:C.sky, type:'line', data:r.cover.slice(2) } ],
        tableNote:'Rough marker: investment-grade issuers in capital-heavy sectors tend to sit below ~3× debt/EBITDA; the agencies also weigh the off-balance lease as debt. Our marker, not a covenant.' };
    };
    pills('#cash-v', v => { view = v; blk.set({ stacked:false, total:false, tableNote:'', extra:null, ...cfg(MODEL.out) }); });

    const dcfg = () => dview === 's'
      ? { labels:[...DEBT.stack.map(r => r[0]), 'Saturn GPU lease (off balance)'], horizontal:true, unit:'$B', fmt:v => '$' + num(v,1) + 'B', rowHead:'Instrument',
          series:[ { key:'on', label:'On balance sheet (Jun 30)', color:C.steel, data:[...DEBT.stack.map(r => r[1]/1000), null], stack:'a' },
                   { key:'off', label:'Off balance sheet (Nov 2026)', color:C.sky, data:[null,null,null,null, DEBT.saturn.notes/1000], stack:'a' } ], stacked:true,
          tableNote:DEBT.stack.filter(r => r[2]).map(r => '<b>' + r[0] + '</b>: ' + r[2]).join(' · ') }
      : (() => { const f = FUND.slice().sort((a,b) => b[1]-a[1]); return { labels:f.map(r => r[0]), horizontal:true, unit:'$M', fmt:v => usd(v), rowHead:'Item', stacked:true,
          series:[ { key:'in', label:'Source', color:C.steel, data:f.map(r => r[1] > 0 ? r[1] : null), stack:'a' },
                   { key:'out', label:'Use', color:C.neg, data:f.map(r => r[1] < 0 ? r[1] : null), stack:'a' } ],
          tableNote:'9M 2026 cash flow statement. They bought back $4.4B of stock while issuing $8.3B and burning $35B, and paid $1.15B premium + $1.5B book loss to retire debt early.' }; })();
    dblk = chartBlock($('#cash-dc'), dcfg());
    pills('#cash-d', v => { dview = v; dblk.set({ tableNote:'', ...dcfg() }); });

    chartBlock($('#cash-s'), { labels:['9M 2025','9M 2026'], unit:'M shares', fmt:v => num(v), rowHead:'Period', height:'s',
      series:[ { key:'sh', label:'Average basic shares', color:C.steel, data:IS9M.sharesAvg } ] });

    MODEL.on(o => {
      const r = o.fin;
      $('#cash-tiles').innerHTML =
        tile('Liquidity · Sep 30', usd(BS.liquidity), 'Debt ' + usd(BS.debt) + ' · net cash ' + usd(BS.liquidity - BS.debt)) +
        tile('Liquidity at YE26', fmtB(r.liq[1],0), '4Q26 free cash flow ' + fmtB(o.fcf[1] - IS9M.fcf[1],0)) +
        tile('New debt needed 2027–30', fmtB(r.cumNewDebt,0), 'Of which 2027: ' + fmtB(r.newDebt[2],0)) +
        tile('Peak debt ÷ EBITDA', num(r.peakLev,1) + '×', 'Incl. the GPU lease');
      $('#cash-res').innerHTML = tile('Free cash flow 2027', fmtB(o.fcf[2],0), 'From Financials') +
        tile('Cash runs out (no new debt)', r.runOut || 'Not in 2027', 'Quarter liquidity turns negative') +
        tile('Net interest 2027', fmtB(r.netInt[2],1), 'Feeds back into EPS');
      const c = cfg(o); if(!blk) blk = chartBlock($('#cash-c'), c); else blk.set({ stacked:false, total:false, tableNote:'', extra:null, ...c });
      const B = x => x == null || isNaN(x) ? '—' : num(x/1000,1), cols = [2,3,4,5];
      const rows = [
        ['Cash from operations', cols.map(i => B(o.cfo[i]))], ['Capex', cols.map(i => B(-o.capex[i]))], ['<b>Free cash flow</b>', cols.map(i => '<b>' + B(o.fcf[i]) + '</b>')],
        ['Debt maturities', cols.map(i => B(-r.matur[i]))], ['GPU lease drawn / (repaid)', cols.map(i => B((r.leaseIn[i]||0) - (r.leaseOut[i]||0)))],
        ['Equity raised', cols.map(i => B(r.equityIn[i]||0))], ['<b>New debt needed</b>', cols.map(i => '<b>' + B(r.newDebt[i]) + '</b>')],
        ['Interest expense', cols.map(i => B(-r.intExp[i]))], ['Interest income', cols.map(i => B(r.intInc[i]))],
        ['Liquidity, year end', cols.map(i => B(r.liq[i]))], ['Debt + lease, year end', cols.map(i => B(r.debt[i] + r.lease[i]))],
        ['Net debt (cash)', cols.map(i => B(r.netDebt[i]))], ['Debt ÷ EBITDA', cols.map(i => num(r.lev[i],1) + '×')], ['EBITDA ÷ interest', cols.map(i => num(r.cover[i],1) + '×')],
        ['<span style="color:var(--mu)">Consensus: debt proceeds</span>', cols.map(i => '<span style="color:var(--mu)">' + B(CONS.tot.debtProceeds[i]) + '</span>')],
        ['<span style="color:var(--mu)">Consensus: total debt</span>', cols.map(i => '<span style="color:var(--mu)">' + B(CONS.tot.debt[i]) + '</span>')] ];
      $('#cash-t').innerHTML = table(['$B', ...cols.map(i => MYEARS[i])], rows.map(([l, a]) => [l, ...a]), new Set([1,2,3,4]));
    });
  }
});

/* ───── view: val ───── */
/* Valuation — scenarios on top of the Financials projections. Every number comes from MODEL.run() */
const VAL_DRIVERS = [
  ['pe',   'P/E multiple',          8, 45, 0.5, v => num(v,1) + '×', 'Mega-cap peers (Mag7 + PLTR) ~19.5× 2028E (J.P. Morgan)'],
  ['evx',  'EV / EBITDA multiple',  5, 30, 0.5, v => num(v,1) + '×', 'Also used as the DCF exit multiple when chosen'],
  ['ke',   'Cost of equity',        7, 15, 0.25, v => num(v,2) + '%', 'Discounts a future price back to today'],
  ['wacc', 'WACC (DCF)',            6, 14, 0.25, v => num(v,2) + '%', ''],
  ['g',    'Perpetual growth (DCF)', 0, 6, 0.25, v => num(v,2) + '%', 'Only when the terminal value is perpetual growth']
];

registerView({ id:'val',
  html: `
  <div class="srow" id="val-tiles"></div>

  ${sec({ t:'What the scenarios are worth today', s:'Pick a method and a year; each scenario carries its own multiples. The dashed line is today\'s price',
    ctl:`<div class="ctls">${scenPills('val-sc')}</div>`,
    b:`<div class="calc">
      <div class="inp">
        ${seg('val-m','Method',[['pe','P/E'],['ev','EV/EBITDA'],['dcf','DCF']],'pe')}
        ${seg('val-y','Earnings year',[['2','2027'],['3','2028'],['4','2029'],['5','2030']],'3')}
        ${seg('val-tv','DCF terminal value',[['exit','Exit multiple'],['g','Perpetual growth']],'exit')}
        ${sliderHTML('val', VAL_DRIVERS)}
      </div>
      <div><div id="val-c"></div><div class="snote" id="val-note" style="margin-top:12px"></div></div>
    </div>`,
    n:'P/E and EV/EBITDA give a price at Dec 31 of the year before the earnings year (2028 earnings → a YE27 price, as J.P. Morgan does), discounted to today at the cost of equity. DCF: unlevered free cash flow 2027–30 at mid-year plus a terminal value at 2030, minus YE26 net debt from the Funding tab. The bars for the other scenarios use their own drivers and multiples with the method and year chosen here.' })}

  ${sec({ t:'How the number is built', s:'The bridge for the scenario and method selected, and what today\'s price already assumes',
    b:`<div class="cols2"><div id="val-b"></div><div><div class="pt">What today's price implies on our model</div><div class="tw" id="val-imp"></div></div></div>`,
    n:'Shares: Bloomberg consensus diluted count (13.0B in 2027) plus any equity raised in the Funding tab. Net debt includes the off-balance GPU lease.' })}

  ${sec({ t:'Sensitivity: the price per watt decides it', s:'Value today for the selected scenario and method as revenue per watt (2027) and the multiple change',
    b:`<div class="tw" id="val-s"></div>`,
    n:'Each row reruns the whole model with a different 2027 $/W (later years move with it); everything else is the selected scenario.' })}

  ${sec({ t:'Street price targets', s:'All from banks that took part in, or bid for, the IPO; use them for mechanics, not as a price',
    b:`<div class="tw" id="val-st"></div>`,
    n:'J.P. Morgan Oct 21 2026 ($225 Jul 7 → $240 Aug 5 → $500); other banks from their initiation and update notes (Jul–Oct 2026). Price: live (Massive).' })}
  `,
  init(){
    wireScenPills('val-sc');
    wireSliders('val', 'v', VAL_DRIVERS);
    pills('#val-m', v => MODEL.set('v', { m:v }, true));
    pills('#val-y', v => MODEL.set('v', { ty:+v }, true));
    pills('#val-tv', v => MODEL.set('v', { tv:v }, true));
    const syncPills = (id, val) => $$('#' + id + ' .fb').forEach(b => b.classList.toggle('active', b.dataset.v === String(val)));
    let blk = null;
    const mName = { pe:'P/E', ev:'EV/EBITDA', dcf:'DCF' };
    const priceLine = { id:'pxline', afterDraw(ch){ const px = PRICE.px, x = ch.scales.x, a = ch.chartArea; if(!x || !px) return; const xp = x.getPixelForValue(px); const g = ch.ctx;
      g.save(); g.strokeStyle = '#1E2733'; g.setLineDash([5,4]); g.lineWidth = 1.5; g.beginPath(); g.moveTo(xp, a.top); g.lineTo(xp, a.bottom); g.stroke();
      g.setLineDash([]); g.fillStyle = '#1E2733'; g.font = '600 10.5px Inter'; g.fillText('Price $' + px, xp + 4, a.top + 10); g.restore(); } };

    MODEL.on((o, st) => {
      const v = st.v, val = o.val, px = PRICE.px, pxT = px ? '$' + num(px,2) : 'live price pending';
      syncPills('val-m', v.m); syncPills('val-y', v.ty); syncPills('val-tv', v.tv);
      const keys = ['bear','cons','jpm','bull'];
      const res = keys.map(k => MODEL.runPreset(k, { m:v.m, ty:v.ty, tv:v.tv }).val);
      const labels = keys.map(k => MODEL.PRESETS[k].label).concat(st.scen === 'custom' ? ['Your settings'] : []);
      const today = res.map(r => r.pv).concat(st.scen === 'custom' ? [val.pv] : []);
      const fwd = res.map(r => r.pt).concat(st.scen === 'custom' ? [val.pt] : []);
      const yLab = v.m === 'dcf' ? 'DCF' : 'YE' + (2026 + v.ty - 2) + ' price';
      const cfg = { labels, horizontal:true, unit:'$/share', fmt:x => '$' + num(x,0), rowHead:'Scenario', type:'bar', stacked:false,
        series:[ { key:'t', label:'Value today', color:C.conn, data:today },
                 ...(v.m === 'dcf' ? [] : [{ key:'f', label:yLab + ' (undiscounted)', color:C.fog, data:fwd }]) ],
        extra: c => { c.plugins = [priceLine]; },
        tableNote:'Method: ' + mName[v.m] + (v.m === 'dcf' ? ' (' + (v.tv === 'g' ? 'perpetual growth' : 'exit multiple') + ')' : ' on ' + MYEARS[v.ty] + ' earnings') + '. Today\'s price: ' + pxT + (px ? ' (live, ' + PRICE.date + ')' : '') + '.' };
      if(!blk) blk = chartBlock($('#val-c'), cfg); else blk.set(cfg);
      const p = MODEL.PRESETS[st.scen];
      $('#val-note').innerHTML = '<b>' + (p ? p.label : 'Your settings') + ':</b> ' + (p ? p.note : 'a preset with drivers or multiples moved.');

      $('#val-tiles').innerHTML =
        tile('Price' + (px ? ' · live, ' + PRICE.date : ''), px ? '$' + num(px,2) : '—', px ? 'Market cap ~' + fmtB(px * PRICE.sharesOut, 0) : 'Live price pending (Massive)') +
        tile('Value today · ' + (p ? p.label : 'custom'), '$' + num(val.pv,0), mName[v.m] + (v.m === 'dcf' ? '' : ' · ' + MYEARS[v.ty])) +
        tile('Upside / downside', pctS(val.up), v.m === 'dcf' ? 'DCF value vs price' : 'Target $' + num(val.pt,0) + ' before discounting') +
        tile('P/E at today\'s price', px ? num(px / o.eps[3],1) + '× 2028E' : '—', px ? num(px / o.eps[4],1) + '× 2029E on our model' : 'Needs the live price');

      /* bridge */
      let rows;
      if(v.m === 'pe') rows = [['EPS ' + MYEARS[v.ty], '$' + num(val.pe.eps,2)], ['× P/E', num(v.pe,1) + '×'], ['= Price at YE' + (2026 + v.ty - 2), '<b>$' + num(val.pe.pt,0) + '</b>'],
        ['Discount ' + num(val.yrs,1) + ' yrs at ' + num(v.ke,2) + '%', '÷ ' + num(Math.pow(1 + v.ke/100, val.yrs),3)], ['= Value today', '<b>$' + num(val.pe.pv,0) + '</b>']];
      else if(v.m === 'ev') rows = [['Adj. EBITDA ' + MYEARS[v.ty], fmtB(val.ev.ebitda,0)], ['× EV/EBITDA', num(v.evx,1) + '×'], ['= Enterprise value', fmtB(val.ev.ev,0)],
        ['− Net debt at YE' + (2026 + v.ty - 2) + ' (incl. lease)', fmtB(-val.ev.netDebt,0)], ['= Equity value', fmtB(val.ev.eq,0)], ['÷ Shares', num(o.shares[v.ty]/1000,2) + 'B'],
        ['= Price at YE' + (2026 + v.ty - 2), '<b>$' + num(val.ev.pt,0) + '</b>'], ['= Value today (' + num(v.ke,2) + '%)', '<b>$' + num(val.ev.pv,0) + '</b>']];
      else rows = [...val.dcf.rows.map(r => ['Unlevered FCF ' + r.y + ' (PV)', fmtB(r.ufcf,0) + ' → ' + fmtB(r.pv,0)]),
        ['Terminal value 2030 ' + (v.tv === 'g' ? '(' + num(v.g,2) + '% growth)' : '(' + num(v.evx,1) + '× EBITDA)'), fmtB(val.dcf.tv,0) + ' → ' + fmtB(val.dcf.tvPV,0)],
        ['= Enterprise value', fmtB(val.dcf.ev,0)], ['− Net debt at YE26', fmtB(-val.dcf.netDebt,0)], ['= Equity value', fmtB(val.dcf.eq,0)],
        ['Terminal value share of EV', (val.dcf.tvPV / val.dcf.ev * 100).toFixed(0) + '%'], ['= Value per share', '<b>$' + num(val.dcf.pv,0) + '</b>']];
      if(v.m === 'pe' && o.fin.newShares > 0) rows.splice(1, 0, ['(new shares from equity raise)', num(o.fin.newShares,0) + 'M']);
      $('#val-b').innerHTML = `<div class="tw">${table(['Step','Value'], rows)}</div>`;

      const mc = px * PRICE.sharesOut, ndNow = o.fin.netDebt[1];
      $('#val-imp').innerHTML = px ? table(['Year','P/E','EV/EBITDA','FCF yield'], [2,3,4,5].map(i => [MYEARS[i], num(px / o.eps[i],1) + '×', num((mc + ndNow) / o.ebitda[i],1) + '×', pctS(o.fcf[i] / mc, 1)]))
        : '<div class="snote" style="margin:0">⚑ Live data pending — the live share price (Massive) is needed to compute these multiples.</div>';

      /* sensitivity */
      const perWs = [12, 16, 20, 25, 30, 35, 40];
      const mults = v.m === 'pe' ? [12,16,20,25,30] : v.m === 'ev' ? [8,11,14,18,22] : [8,9,10,11,12];
      const head = v.m === 'pe' ? 'P/E' : v.m === 'ev' ? 'EV/EBITDA' : 'WACC %';
      const a0 = st.a;
      const sRows = perWs.map(w => {
        return ['$' + w + '/W' + (Math.abs(w - a0.perW27) < 2.5 ? ' ◂' : ''), ...mults.map(m => { const vv = { ...v, ...(v.m === 'pe' ? { pe:m } : v.m === 'ev' ? { evx:m } : { wacc:m }) };
          const r = MODEL.run({ ...a0, perW27:w }, st.f, vv).val.pv; const c = !px ? 'var(--navy)' : r >= px ? 'var(--pos)' : 'var(--neg)'; return `<span style="color:${c};font-weight:600">$${num(r,0)}</span>`; })]; });
      $('#val-s').innerHTML = table(['2027 $/W ↓ · ' + head + ' →', ...mults.map(m => v.m === 'dcf' ? m + '%' : m + '×')], sRows);

      /* street */
      const street = STREET.map(s => ({ b:s.b, d:s.d, r:s.r, pt:s.pt, m:s.m }))
        .sort((x,y) => y.pt - x.pt);
      $('#val-st').innerHTML = table(['Bank','Date','Rating','Target','vs price','Method'], street.map(s => [s.b, s.d, s.r, '$' + s.pt, pctS(s.pt/px - 1), s.m]));
    });
  }
});

/* ───── view: si ───── */
/* AI & compute (SI segment) — the revenue is real, so is the concentration */
registerView({ id:'si',
  html: `
  <div class="srow">
    ${tile('SI revenue · 9M26', usd(SI.total[1]), '<span class="up">+380%</span>; 40% of group revenue')}
    ${tile('Nameplate compute', SI.gw[1] + ' GW', 'From ' + SI.gw[0] + ' GW; plan: 13 GW by end-2027')}
    ${tile('Backlog', usd(SI.backlog,0), '~' + usd(SI.backlog12m,0) + ' expected within 12 months')}
    ${tile('Largest single client', '19.5%', 'Of group revenue in Q2 (10-Q)')}
  </div>

  ${sec({ t:'Revenue, spend and profit', s:'Nine months against nine months. X advertising fell; rented compute is almost all the growth',
    ctl:`<div class="ctls">${seg('si-m','Metric',[['rev','Revenue'],['capex','Capex'],['ebitda','Adj. EBITDA']],'rev')}</div>`,
    b:`<div id="si-c"></div>`,
    n:'Q3 2026 release, $M. SI capex was 83% of all company capex in 9M26. Cursor (acquired Aug 14 2026) added $608M of revenue to Sep 30.' })}

  ${sec({ t:'What customers pay per megawatt', s:'The premium is for build speed, the most imitable of the advantages',
    b:`<div id="si-p"></div>`,
    n:'Deutsche Bank (Jul 2026): ~$31M/MW Anthropic, ~$50M/MW Google vs ~$10–11M/MW other neoclouds; DB models normalisation to ~$10M/MW after Vera Rubin. On the Q3 call, new deals priced "slightly above the high end" and "renewals are repricing higher".' })}

  ${sec({ t:'If the price per megawatt normalises', s:'Contracts are cancellable on 90 days; ~$21.5B of 2027 capacity obligations are not',
    b:`<div class="calc">
      <div class="inp">
        <label><div class="rv">Capacity rented to third parties <b id="si-g-v"></b></div><input type="range" id="si-g" min="0.5" max="6.5" step="0.05" value="0.85"><span class="h">GW; today ~50% of 1.7 GW (Musk: "50/50, more or less")</span></label>
        <label><div class="rv">Price per MW per year <b id="si-p-v"></b></div><input type="range" id="si-pr" min="5" max="60" step="1" value="31"><span class="h">$M; Anthropic ~31 · Google ~50 · neoclouds ~10–11</span></label>
      </div>
      <div><div class="res" id="si-res"></div><div id="si-r"></div></div>
    </div>`,
    n:'Own arithmetic: GW × 1,000 × $M/MW. At the defaults it reproduces the ~$2.3B/month run-rate of the three contracts. Obligations: prospectus note 17. Not a forecast.' })}

  ${sec({ t:'Contract terms that matter', s:'Verified in the 10-Q',
    b:`<div class="cols2"><div class="tw">${table(['Client','$ / month','Capacity','Runs to'], CONTRACTS.map(c => [c.k, usd(c.perMonth), c.gpus + (c.mw ? ' · ~' + c.mw + ' MW' : ''), c.end]))}</div>
      <ul class="pl">
        <li><strong>Either party</strong> may terminate on 90 days’ notice after an initial ramp period. Google cannot use it before Dec 31 2026.</li>
        <li><strong>Short contracts at ~spot are a choice:</strong> "our approach is to rent at effectively the spot market rate" (Musk). Revenue follows the market both ways.</li>
        <li><strong>Google had a Sep 30 2026 delivery deadline</strong>, with a right to terminate or pay less after a month’s grace. Whether it was met is not disclosed.</li>
        <li><strong>Obsolescence sits in GPUs, not buildings:</strong> Colossus I (~100k H100, ~130 MW) backs the Anthropic contract to 2029.</li>
      </ul></div>`,
    n:'10-Q Q3 2026; Needham (deadlines); Q3 call. Terafab (chip fab JV with Tesla, Intel 14A): test chip May–Jun 2027, volume 3Q28 at Gibbons Creek; UBS puts its capex at ~$225B 2026–31.' })}
  `,
  init(){
    const L = ['9M 2025','9M 2026'];
    const M = {
      rev:{ unit:'$M', fmt:v => usd(v), stacked:true, total:true, series:[
            { key:'i', label:'Solutions & infrastructure', color:C.si, data:SI.infra, stack:'a' },
            { key:'a', label:'X advertising', color:C.grey, data:SI.ads, stack:'a' } ] },
      capex:{ unit:'$M', fmt:v => usd(v), series:[ { key:'c', label:'SI capex', color:C.si, data:SI.capex }, { key:'r', label:'SI R&D', color:C.steel, data:SI.rd } ] },
      ebitda:{ unit:'$M', fmt:v => usd(v), series:[ { key:'e', label:'SI adj. EBITDA', color:C.si, data:SI.ebitda } ],
               note:'Operating income was still ' + usd(IS9M.opinc.si[1]) + ' after depreciation of GPUs and buildings.' }
    };
    const mk = k => ({ labels:L, rowHead:'Period', height:'s', ...M[k], tableNote:M[k].note || '' });
    const blk = chartBlock($('#si-c'), mk('rev'));
    pills('#si-m', v => blk.set({ stacked:false, total:false, ...mk(v) }));

    chartBlock($('#si-p'), { labels:PERMW.map(r => r[0]), horizontal:true, height:'s', unit:'$M per MW per year', fmt:v => '$' + num(v,1) + 'M', rowHead:'Contract',
      series:[ { key:'p', label:'Price per MW per year', color:C.si, data:PERMW.map(r => r[1]) } ],
      tableNote:'Anthropic check: $1.25B × 12 ÷ ~480 MW ≈ $31M/MW. Clear Street models $33M → $10M/MW by 2030 while building 13.35 GW.' });

    let blk2 = null;
    const run = () => {
      const g = +$('#si-g').value, p = +$('#si-pr').value; const rev = g * 1000 * p;   // $M per year
      $('#si-g-v').textContent = num(g,2) + ' GW'; $('#si-p-v').textContent = '$' + p + 'M';
      $('#si-res').innerHTML = tile('Annual rental revenue', usd(rev), usd(rev/12) + ' a month') +
        tile('2027 fixed obligations', usd(RUN.fixed2027), 'Non-cancellable capacity') +
        tile('Cover', (rev / RUN.fixed2027).toFixed(1) + '×', 'Revenue ÷ obligations');
      const cfg = { labels:['At ~$10M/MW','At your price','Fixed 2027 obligations'], unit:'$M per year', fmt:v => usd(v), rowHead:'', height:'s',
        series:[ { key:'r', label:'$ per year', color:C.si, data:[g*1000*10, rev, RUN.fixed2027] } ] };
      if(!blk2) blk2 = chartBlock($('#si-r'), cfg); else blk2.set(cfg);
    };
    $('#si-g').oninput = run; $('#si-pr').oninput = run; run();
  }
});

/* ───── view: ship ───── */
/* Starship & launch — the variable that decides everything */
registerView({ id:'ship',
  html: `
  <div class="srow">
    ${tile('Launches · 9M26', SPACE.launches[1], '<span class="dn">−12%</span> vs ' + SPACE.launches[0] + ' in 9M25')}
    ${tile('Mass to orbit · 9M26', num(SPACE.massT[1]) + ' t', '<span class="dn">−7%</span> vs ' + num(SPACE.massT[0]) + ' t')}
    ${tile('Space adj. EBITDA · 9M26', usd(SPACE.ebitda[1]), 'From +' + usd(SPACE.ebitda[0]) + '; Starship R&D up')}
    ${tile('Starship reached orbit', 'Flight 14', 'Sep 2026 · 26 V3 · first revenue flight')}
  </div>

  ${sec({ t:'Where Starship stands', s:'The cost estimates assume steps 2–4. None is done yet',
    b:`<div>
      <div class="st"><b>1 · Reach orbit</b><span><span class="tag ok">Done</span></span><span>Flight 14, Sep 2026, 26 V3 satellites. One RVac engine failed on ascent (Wells Fargo).</span></div>
      <div class="st"><b>2 · Recover the booster</b><span><span class="tag open">Lost on Flight 15</span></span><span>Super Heavy had been caught three times before, but on Flight 15 (Nov 13–14 2026) Booster 22 called off the catch, diverted to the Gulf and was destroyed. Musk: the engines slightly underperformed, leaving too little propellant (NASASpaceFlight, Aviation Week).</span></div>
      <div class="st"><b>3 · Recover the ship</b><span><span class="tag ok">Done</span></span><span><strong>Caught on Flight 15, Nov 14 2026</strong> (J.P. Morgan, Key Investor FAQs) — the first ship catch. Next: re-fly the same ship by early 2027, then cut turnaround time and cost.</span></div>
      <div class="st"><b>4 · Rapid re-flight</b><span><span class="tag wait">Pending</span></span><span>Target: weekly in 1H27, twice weekly or more in 2H27 (Musk). Actual gap Flight 13 → 14: ~9 weeks.</span></div>
    </div>`,
    n:'Q3 2026 call transcript (Oct 20 2026); Wells Fargo. FAA raised the Starship cap from 5 to 25 launches a year (prospectus, Clear Street). Launches are public and FAA-licensed, so this is verifiable without the company.' })}

  ${sec({ t:'Cost per kilogram to orbit', s:'Each rung is a reuse milestone, so delay postpones the case in jumps, not gradually',
    b:`<div id="ship-k"></div>`,
    n:'Starship rungs: Deutsche Bank estimates (Jul 2026), not disclosures. Falcon 9 today: sources disagree — cite the range and who gives it. Dashed line: the prospectus says orbital compute needs ~$100/kg.' })}

  ${sec({ t:'Spending more, flying less', s:'Nine months against nine months',
    ctl:`<div class="ctls">${seg('ship-m','Metric',[['n','Launches'],['t','Mass to orbit'],['e','Space EBITDA & R&D']],'n')}</div>`,
    b:`<div id="ship-c"></div>`,
    n:'Q3 2026 release. Q3 alone had 35 launches vs 46 that Clear Street estimated. Space segment Q3 adj. EBITDA was +$357M, which hid the nine-month swing.' })}

  ${sec({ t:'Falcon is being retired on a schedule', s:'If Starship slips materially, there is a launch-supply gap',
    b:`<ul class="pl">
      <li><strong>SpaceX is turning away</strong> dedicated Falcon 9 customers beyond 2028 and stopped making some non-reusable parts.</li>
      <li><strong>The dates vary by source:</strong> Needham — rideshare acceptance slows from 2029, possible Falcon 9 retirement; UBS — Falcon off around 2031, no new boosters.</li>
      <li><strong>UBS's Starship model</strong> assumes 4 → 32 → 141 → 1,558 flights between 2026 and 2031.</li>
    </ul>`,
    n:'Needham and UBS initiations (Jul 7 2026). Same gap, different opening dates.' })}
  `,
  init(){
    const L = ['Falcon 9 · Barclays', 'Falcon 9 · UBS', ...LADDER.map(r => 'Starship · ' + r.k)];
    const line100 = { id:'ship100', afterDatasetsDraw(c){ const x = c.scales.x.getPixelForValue(ORBIT_KG_NEEDED), a = c.chartArea, g = c.ctx;
      if(x < a.left || x > a.right) return; g.save(); g.strokeStyle = '#DC2626'; g.setLineDash([4,4]); g.beginPath(); g.moveTo(x, a.top); g.lineTo(x, a.bottom); g.stroke();
      g.setLineDash([]); g.fillStyle = '#DC2626'; g.font = '600 10.5px Inter'; g.fillText('~$100/kg needed', x + 5, a.top + 10); g.restore(); } };
    chartBlock($('#ship-k'), { labels:L, horizontal:true, log:true, unit:'$/kg', fmt:v => '$' + num(v), rowHead:'Vehicle / scenario',
      series:[ { key:'f9', label:'Falcon 9 today', color:C.grey, data:[F9_KG[1][1], F9_KG[0][1], null, null, null, null] },
               { key:'ss', label:'Starship (Deutsche Bank)', color:C.conn, data:[null, null, ...LADDER.map(r => r.kg)] } ],
      tableNote:'Starship cost per flight / payload: ' + LADDER.map(r => r.k + ' ~$' + r.cost + 'M / ' + r.t + 't').join(' · ') + '. The prospectus’s ~$2,700/kg is Falcon 9’s first launch in 2010, not today (UBS p.21). Falcon Heavy: $1,520/kg (Barclays).',
      extra: c => { c.plugins = [line100]; c.options.datasets = { bar:{ skipNull:true } }; c.options.scales.x.ticks = { callback: v => [10,100,1000,10000].includes(v) ? '$' + num(v) : '' }; } });

    const L2 = ['9M 2025','9M 2026'];
    const M = {
      n:{ unit:'launches', fmt:v => num(v), stacked:true, total:true, series:[
          { key:'i', label:'Internal (Starlink)', color:C.conn, data:SPACE.internal, stack:'a' },
          { key:'c', label:'Customer', color:C.space, data:SPACE.customer, stack:'a' } ] },
      t:{ unit:'tonnes', fmt:v => num(v) + ' t', series:[ { key:'m', label:'Mass to orbit', color:C.conn, data:SPACE.massT } ] },
      e:{ unit:'$M', fmt:v => usd(v), series:[
          { key:'e', label:'Space adj. EBITDA', color:C.space, data:SPACE.ebitda },
          { key:'r', label:'Starship R&D', color:C.si, data:SPACE.starshipRD } ] }
    };
    const blk = chartBlock($('#ship-c'), { labels:L2, rowHead:'Period', height:'s', ...M.n });
    pills('#ship-m', v => blk.set({ stacked:false, total:false, ...M[v] }));
  }
});

/* ───── view: conn ───── */
/* Starlink (Connectivity) — the only segment that funds the rest */
registerView({ id:'conn',
  html: `
  <div class="srow">
    ${tile('Consumer subscribers', num(CONN.subs[1],1) + 'M', '<span class="up">+89%</span> from ' + CONN.subs[0] + 'M a year earlier')}
    ${tile('Consumer ARPU · 9M', '$' + CONN.arpu[1] + '/mo', 'From $' + CONN.arpu[0] + '; back up to $' + CONN.arpuQ3 + ' in Q3')}
    ${tile('Segment adj. EBITDA · 9M', usd(CONN.ebitda[1]), '<span class="up">+60%</span>; op. income ' + usd(IS9M.opinc.conn[1]))}
    ${tile('Satellites in orbit', num(CONN.sats) + '+', CONN.markets + ' markets · ~1,200 subscribers each')}
  </div>

  ${sec({ t:'Growth, nine months against nine months', s:'More subscribers at a lower average price: watch revenue, not one of the two',
    ctl:`<div class="ctls">${seg('conn-m','Metric',[['rev','Revenue'],['subs','Subscribers'],['arpu','ARPU'],['ebitda','Adj. EBITDA']],'rev')}</div>`,
    b:`<div id="conn-c"></div>`,
    n:'Q3 2026 release. ARPU fell because the mix moved to cheaper markets (US ARPU is well above the blend); the company expects developed markets to fall from 65% to 40% of subscribers by 2031.' })}

  ${sec({ t:'What still caps capacity', s:'V3 satellites need Starship to fly, not to be reusable',
    b:`<ul class="pl">
      <li><strong>V3 carries ~10× the downlink of a V2</strong> per satellite and does not fit in a Falcon 9. Flight 14 (26 V3, "maybe half loaded") added ~10× a Falcon 9 launch; fully loaded, management talks of "over 20×".</li>
      <li><strong>Users notice it after "a few hundred V3 satellites"</strong>, which management expects by mid-2027.</li>
      <li><strong>2026 capacity and 2027 revenue targets do not depend on Starship</strong> (company, via Needham). A Starship delay hits urban V3 capacity and orbital compute first.</li>
      <li><strong>The 2026 bottleneck was antenna kits</strong> (management). Two of three ex-sales staff interviewed by Paragon think demand saturation comes next: opinion, not evidence.</li>
      <li><strong>Q3 gross margin of 55%</strong> includes ~3 pts of one-off tariff refunds; the CFO expects 4Q back at the Q2 level.</li>
    </ul>`,
    n:'Q3 2026 release and call (Oct 20 2026); Needham, Wells Fargo and Paragon/Heron notes. "60 V3 per launch" is the banks’ figure, not management’s.' })}

  ${sec({ t:'Amazon Leo, side by side', s:'Amazon’s edge is the balance sheet; it still buys launches, including from SpaceX',
    b:`<div class="tw">${table(['', 'Starlink', 'Amazon Leo (ex-Kuiper)'], [
      ['Satellites in orbit', '11,100+', '~330 (UBS); 180 launched in 2025'],
      ['Needed to sell in the US', '—', '578 (Barclays, company)'],
      ['Licensed broadband constellation', '—', '7,700 (12,841 incl. D2D pending)'],
      ['Launch', 'Own rockets; 122 Starlink launches in 2025', 'New Glenn flew 2 of 24 planned in 2026; buys 3 Falcon 9'],
      ['Payback (Wells Fargo model)', '~1 year', '~5 years'],
      ['Satellite broadband share 2030 (Mizuho, Wells Fargo)', '~76%', '~10%'],
      ['Spend', 'Funded by Starlink cash flow + markets', 'Opex > $1B per quarter in 2H26, from AWS cash flow'],
      ['User capacity', '~62M today', '~60M by 2030 (Barclays)']
    ])}</div>`,
    n:'UBS, Barclays (Jan 2026 Amazon note), Wells Fargo and Mizuho. Mizuho and Wells Fargo were IPO banks; their payback model is generous to both (80% margin, 7-year life vs ~64% and ~5 actual).' })}
  `,
  init(){
    const L = ['9M 2025','9M 2026'];
    const M = {
      rev:   { unit:'$M', fmt:v => usd(v), stacked:true, total:true, series:[
               { key:'c', label:'Consumer', color:C.conn, data:CONN.consumerRev, stack:'a' },
               { key:'e', label:'Enterprise & government', color:C.deep, data:CONN.entGovRev, stack:'a' } ],
               note:'Enterprise and government are each on track to pass consumer revenue (Q3 call). Enterprise + government backlog: $24B for 2026–28.' },
      subs:  { unit:'M', fmt:v => num(v,1) + 'M', series:[ { key:'s', label:'Consumer subscribers (end of period)', color:C.conn, data:CONN.subs } ],
               note:'Shotwell said "just under 14 million" on the call; the release says 13.6M, used here. Excludes enterprise and government accounts.' },
      arpu:  { unit:'$/month', fmt:v => '$' + num(v), series:[ { key:'a', label:'Consumer ARPU', color:C.conn, data:CONN.arpu } ],
               note:'Q3 2026 alone: $69, up sequentially after the 2026 price increases.' },
      ebitda:{ unit:'$M', fmt:v => usd(v), series:[ { key:'b', label:'Segment adj. EBITDA', color:C.conn, data:CONN.ebitda } ],
               note:'Adj. EBITDA excludes depreciation of satellites, a real cost here (group D&A $8.9B in 9M).' }
    };
    const mk = k => ({ labels:L, rowHead:'Period', height:'s', ...M[k], tableNote:M[k].note });
    const blk = chartBlock($('#conn-c'), mk('rev'));
    pills('#conn-m', v => blk.set({ stacked:false, total:false, ...mk(v) }));
  }
});

/* ───── view: orb ───── */
/* Orbital compute — physics sound, economics hang on one variable */
registerView({ id:'orb',
  html: `
  <div class="srow">
    ${tile('Orbital revenue today', '$0', 'All $10.9B of SI comes from Memphis')}
    ${tile('Launch cost needed', '~$100/kg', 'Prospectus threshold for orbital compute')}
    ${tile('Deutsche Bank crossover', '$154/kg', 'Full Starship reuse, ~2032')}
    ${tile('One satellite ≈ one rack', '120–150 kW', '110 m² radiator; ~550 km orbit')}
  </div>

  ${sec({ t:'Cost of one gigawatt: in orbit or in a building', s:'The rocket is neither column; its $/kg is an input to the orbital one',
    ctl:`<div class="ctls">${seg('orb-t','Terrestrial $/GW',[['db','DB table'],['ubs','UBS ~40'],['bar','Barclays 50–60'],['hu','Huang ~100']],'db')}</div>`,
    b:`<div id="orb-c"></div>`,
    n:'Orbital column and launch scenarios: Deutsche Bank (Jul 2026). DB’s own terrestrial column ($20–25B/GW) contradicts its footnote (Huang ~$100B/GW); a higher terrestrial cost brings the crossover earlier.' })}

  ${sec({ t:'The dependency chain', s:'The launch moat becomes a compute moat only if compute goes to orbit',
    b:`<div class="chain">
      <div class="lnk weak"><div class="k">Unproven</div><div class="v">Ship reuse at high rate</div><p>Heat shield survives orbital re-entry repeatedly</p></div><div class="arr">→</div>
      <div class="lnk"><div class="k">Follows</div><div class="v">$/kg falls below ~$150</div><p>Each reuse milestone is a step down</p></div><div class="arr">→</div>
      <div class="lnk"><div class="k">Follows</div><div class="v">Orbit beats a building</div><p>Only if satellite cost is ~$900K or less (UBS)</p></div><div class="arr">→</div>
      <div class="lnk"><div class="k">Payoff</div><div class="v">Cost moat in compute</div><p>Today the edge in Memphis is build speed, not cost</p></div>
    </div>
    <div class="ins" style="margin-top:16px"><strong>Read it backwards:</strong> orbital compute is not a side bet on top of renting GPUs. It is the only route by which the launch cost advantage ever becomes a compute cost advantage. That is why Starship timing dominates everything.</div>`,
    n:'Deutsche Bank, UBS and Barclays notes (Jul–Nov 2026); 424B4 for the ~$100/kg orbital-compute threshold. UBS break-even sits between the V2 mini (~$600K) and V3 (~$1.2M) satellite cost.' })}

  ${sec({ t:'What is settled and what is not', s:'The physics is not in doubt; engineering at scale is',
    b:`<div class="cols2">
      <div><div class="pt"><i style="background:${C.pos}"></i>Four quantities that can be checked</div><ul class="pl">
        <li><strong>Sunlight:</strong> on a dawn–dusk orbit a panel gets ~40% more energy than on the ground, almost continuously.</li>
        <li><strong>Cooling:</strong> heat radiates to vacuum at a rate physics fixes; the published design dissipates ~1,400 W/m².</li>
        <li><strong>Radiation:</strong> the planned altitude is below the belts that damage electronics.</li>
        <li><strong>Latency:</strong> a few milliseconds round trip at 550 km. Small, not an obstacle.</li></ul></div>
      <div><div class="pt"><i style="background:${C.neg}"></i>Open at scale</div><ul class="pl">
        <li><strong>Heat</strong> is "the single most binding constraint"; radiators weigh ~80% of the satellite (UBS expert).</li>
        <li><strong>Radiation shielding</strong> for commercial accelerators is "unsolved at scale" (Needham).</li>
        <li><strong>No repair:</strong> UBS assumes 5% of GPUs in orbit fail each year.</li>
        <li><strong>Barclays scorecard:</strong> ground wins on upfront cost, life, repair and data speed; orbit only on running cost and scale.</li></ul></div>
    </div>`,
    n:'UBS and Needham initiations, Barclays. With a 5-year life matched to NVIDIA chips, Starcloud’s $0.002/kWh becomes $0.048/kWh (Barclays).' })}

  ${sec({ t:'The obstacle that may bind before cost', s:'Open question 2 — no filing or analyst note addresses it',
    b:`<p class="lede" style="font-size:13px">Data-protection regimes are written in terms of territory. A US-registered satellite processing a European bank’s records while over a third country fits none of their categories. If regulated customers cannot legally use orbital compute, the market shrinks to workloads with <strong>no residency obligations</strong> — a fraction of what the case assumes.</p>`,
    n:'Our own work, not yet done: GDPR transfer rules, national data-localisation laws, and how the Outer Space Treaty’s state-of-registry jurisdiction interacts with them.' })}
  `,
  init(){
    const T = { db:null, ubs:TERR.ubs, bar:TERR.barclays, hu:TERR.huang };
    const mk = k => ({ labels:ORB.map(r => r.k + ' · $' + num(r.kg) + '/kg'), unit:'$B per GW', fmt:v => '$' + num(v) + 'B', rowHead:'Launch scenario',
      series:[ { key:'o', label:'In orbit', color:C.conn, data:ORB.map(r => r.orbital) },
               { key:'t', label:'In a building' + (k === 'db' ? ' (DB)' : ''), color:C.si, data:ORB.map(r => T[k] == null ? r.terr : T[k]) } ],
      tableNote:'Orbit ÷ building: ' + ORB.map(r => r.k + ' ' + (r.orbital / (T[k] == null ? r.terr : T[k])).toFixed(1) + '×').join(' · ') +
        '. Other frames: UBS 1 GW with 140 Starship launches at $250/kg — $40.4B orbit vs $46.2B ground; Google Suncatcher ~$810/kW/yr in orbit below $200/kg vs $570–3,000 on the ground.' });
    const blk = chartBlock($('#orb-c'), mk('db'));
    pills('#orb-t', v => blk.set(mk(v)));
  }
});

/* ───── view: def ───── */
/* Defense — the revenue that keeps growing, and the rules of the road */
registerView({ id:'def',
  html: `
  <div class="srow">
    ${tile('Defense obligations · 9M26', usd(DEF.oblig9M26), 'vs ' + usd(DEF.obligFY25) + ' in all of 2025')}
    ${tile('Federal share of 2025 revenue', '~20%', 'Needham')}
    ${tile('Government share, Q4 2026', '< 10%', 'Musk, Nov 6; < 5% within a year')}
    ${tile('Golden Dome, total', '> $175B', 'UBS; $25B initial funding')}
  </div>

  ${sec({ t:'The contracts', s:'Headline values are ceilings and programme totals, not committed revenue',
    b:`<div id="def-c"></div>`,
    n:'Bloomberg Government (Nov 2026), Space Command and Space Force award releases, Bloomberg; Deutsche Bank and Cavendish notes. The Space pipeline added 18 NSSL, 3 crewed and 3 Starfall missions (Cestrian). UBS counts > $20B of US government contracts.' })}

  ${sec({ t:'A falling government share is a trade, not a win', s:'The mix swaps political exposure for exposure to the AI capital cycle',
    b:`<div class="cols2">
      <ul class="pl">
        <li><strong>Government work</strong> is sticky, good-margin and proven in conflict (Ukraine changed the DoD’s stance). It also concentrates revenue in a buyer that sets terms.</li>
        <li><strong>What replaces it</strong> is rented compute: 40% of revenue, cancellable on 90 days, from a handful of AI developers — more correlated with the rest of a portfolio.</li></ul>
      <ul class="pl">
        <li><strong>Golden Dome sets the architectural precedent.</strong> Once a defence constellation is designed around SpaceX hardware and protocols, switching costs for the DoD are very large, and allies tend to follow the standard.</li>
        <li><strong>Dual use is the same fact as risk #7:</strong> defence growth and exposure to jamming, spoofing and escalation cannot be judged separately.</li></ul>
    </div>`,
    n:'Bloomberg Government (Nov 2026); Musk remarks of Nov 6 2026.' })}

  ${sec({ t:'Owning the ship, not the sea', s:'The company owns its satellites but cannot own the orbits they occupy',
    b:`<div class="cols3">
      <div class="biz" style="--c:${C.pos}"><div class="k">Owned outright</div><p>Satellites, ground stations, rockets, patents. Ordinary property.</p></div>
      <div class="biz" style="--c:#B45309"><div class="k">Licensed, not owned</div><p>Spectrum and orbital positions. Granted nationally, with deployment deadlines. <strong>Revocable — use it or lose it.</strong></p></div>
      <div class="biz" style="--c:${C.neg}"><div class="k">Nobody can own</div><p>Orbital shells, the Moon, any volume of space. No legal mechanism transfers title.</p></div>
    </div>
    <details class="tbl"><summary>Outer Space Treaty (1967) — what binds SpaceX</summary><div class="tw">${table(['Provision','Effect','Consequence'],[
      ['No national appropriation','Space cannot be claimed by sovereignty, use or occupation','No title over an orbit for any company or state'],
      ['State responsibility for private operators','Each state authorises and supervises its companies','The US answers for SpaceX in orbit — the basis of its licensing lever'],
      ['Launching-state liability','Damage liability falls on the launching state','Collision and debris liability reaches the government'],
      ['State-of-registry jurisdiction','Objects stay under the registering state','Private property under US jurisdiction wherever it flies'],
      ['Weapons restriction','WMD banned in orbit; conventional military activity is not','Nothing bans a conventional attack on a satellite']
    ])}</div><div class="snote" style="margin:0;border:none;border-top:1px solid var(--bdr);border-radius:0">Ratified by well over a hundred states including every significant launcher; core provisions are widely treated as general international law.</div></details>`,
    n:'The position is secured by occupation, de facto not de jure — the natural-monopoly pattern that historically ends in regulated access (risk #3). 173 small approvals are an operating cost; a withdrawal by the home regulator would be existential.' })}
  `,
  init(){
    chartBlock($('#def-c'), { labels:DEF_CONTRACTS.map(r => r[0]), horizontal:true, unit:'$M', fmt:v => usd(v,1), rowHead:'Contract',
      series:[ { key:'v', label:'Headline value', color:C.steel, data:DEF_CONTRACTS.map(r => r[1]) } ],
      tableNote: DEF_CONTRACTS.map(r => '<b>' + r[0] + '</b>: ' + r[2]).join(' · ') });
  }
});

/* ───── view: comp ───── */
/* Why this operator — simultaneity, alternatives, supply chain */
registerView({ id:'comp',
  html: `
  ${sec({ t:'Four capabilities at once', s:'The case is simultaneity, not superiority on any single axis',
    b:`<div class="tw">${table(['', 'Reusable heavy launch', 'Satellites in volume', 'An operating network', 'Capital at scale'], [
      ['<b>SpaceX</b>', '<span class="tag ok">Owns</span>', '<span class="tag ok">Owns</span>', '<span class="tag ok">Owns</span>', '<span class="tag wait">Rented from markets</span>'],
      ['<b>Large tech rival</b> (Amazon Leo)', '<span class="tag open">Buys it</span>', '<span class="tag wait">Building</span>', '<span class="tag wait">Building</span>', '<span class="tag ok">Unlimited</span>'],
      ['<b>Small commercial launchers</b>', '<span class="tag wait">Small payload</span>', '<span class="tag open">No</span>', '<span class="tag open">No</span>', '<span class="tag open">No</span>'],
      ['<b>State programmes</b>', '<span class="tag wait">Growing</span>', '<span class="tag wait">Some</span>', '<span class="tag open">No retail network</span>', '<span class="tag wait">Public, not investable</span>'],
      ['<b>Legacy heavy-lift contractors</b>', '<span class="tag wait">Expendable</span>', '<span class="tag open">No</span>', '<span class="tag open">No</span>', '<span class="tag n">—</span>']
    ])}</div>`,
    n:'Sell-side notes (Jul–Nov 2026) and company filings. State programmes are better read as a reason to discount the incumbent’s long-run pricing power than as alternatives to buy.' })}

  ${sec({ t:'How to test an alternative', s:'Each test uses published data',
    b:`<div>
      <div class="gl"><b>Small launchers</b><span>Payload to orbit per flight, and the demonstrated re-flight interval of the same vehicle. A few hundred kilos is a different industry from a hundred tonnes.</span></div>
      <div class="gl"><b>State programmes</b><span>Whether the programme sells connectivity to paying civilian customers outside its own territory — the step that turns capacity into a competing business.</span></div>
      <div class="gl"><b>Legacy contractors</b><span>Cost per kilogram and cadence. Relevant for second-source government work, not on the cost curve this thesis depends on.</span></div>
    </div>`,
    n:'Sell-side notes (Jul–Nov 2026) and company filings.' })}

  ${sec({ t:'Supply chain, honestly', s:'There is no undiscovered supplier: the market has scanned the list since the June IPO',
    b:`<div class="tw">${table(['Company', 'Link to SpaceX', 'What it tells you'], [
      ['<b>Filtronic</b> (FTC:AIM)', 'E-band SSPA modules for ground stations; 5-year deal (Apr 2024), $19.7M first order. SpaceX gets warrants on up to 10% of the equity.', 'SpaceX was paid in equity to be a customer. Tranche vesting is a public gauge of the ground-station build. Stock ~33p → ~286p (Oct 16 2026): already re-rated ~9×.'],
      ['<b>Credo</b> (CRDO)', '$537M relationship, ~28% of Credo revenue: active copper cables and optical DSPs for Colossus.', 'Direct Colossus driver, but a ~$26.5B company — no longer a pure play.'],
      ['<b>Tesla</b> (TSLA)', '$650M of products/services to SpaceX (6.88% of SpaceX COGS, SPLC); Terafab JV partner.', 'The only other listed way into the ecosystem; a combination is being evaluated.'],
      ['<b>Howmet</b> (HWM)', 'Structural components.', 'SpaceX is one piece of a diversified mix.']
    ])}</div>`,
    n:'Bloomberg SPLC (Nov 12 2026); Cavendish on Filtronic (Apr 2024, non-independent research); Filtronic prices from Sharecast / stockanalysis.com, mid-Oct 2026, not live — check the LSE RNS before acting.' })}
  `
});

/* ───── view: risk ───── */
/* What can go wrong — ranked by how much each would change the conclusion */
const RISKS = [
  { t:'The rocket programme runs late', k:'timing',
    w:'Everything beyond today’s Starlink — V3 urban capacity, orbital compute, the launch-to-compute moat — sits behind one unsolved problem: surviving orbital re-entry repeatedly without rebuilding the heat shield. Delay postpones the case rather than destroying it, but postponing while spending ~$48B a year changes its value.',
    seen:'Launches 113 vs 128 (−12%), mass to orbit −7%, Space EBITDA from +$803M to −$199M as R&D rose. Q3: 35 launches vs 46 expected by Clear Street.',
    watch:'FAA licences and investigations, flights and mass per quarter, and above all whether one vehicle re-flies in quick succession.',
    mit:'2026 Starlink capacity and 2027 revenue targets do not depend on Starship (company, via Needham).' },
  { t:'Licences turn out to be political instruments', k:'answer?',
    w:'Orbital slots and spectrum are licensed, not owned: granted nationally, with deployment deadlines, and revocable. The founder is unusually exposed politically. A government that is also the largest single customer has two levers, not one.',
    watch:'Any proceeding to review existing authorisations, changes to deployment milestones, competitive re-bidding of work now awarded directly.' },
  { t:'The network is forced open to competitors', k:'changes the answer',
    w:'Telecoms that built dominant fixed networks were made to lease capacity to rivals at regulated prices. The same logic applies with unusual force: orbital shells and spectrum are finite public resources. Starlink would go from retail ISP with subscription margins to infrastructure landlord with regulated rents — a different business.',
    watch:'Competition probes framed around access to orbital capacity, any national regulator conditioning market access on wholesale terms, competitor lobbying.',
    mit:'Clear Street: Ku/Ka spectrum is "comparatively abundant", the barrier is economic. Against: governments distrust "a U.S.-controlled satellite monopoly", and the move into mobile and suburban retail widens the regulatory surface. Clear Street’s bear case (10×) halves its ~$94/share Connectivity value — the closest reference anyone gives. Open question 3.' },
  { t:'The AI spending cycle turns', k:'timing',
    w:'Rented compute was 40% of nine-month revenue and almost all the growth, on contracts either side can end on 90 days. Same chips at the same prices, same small group of buyers, same oversupply if it comes.',
    seen:'~$21.5B of non-cancellable 2027 capacity obligations against cancellable revenue; one client was 19.5% of group revenue in Q2.',
    watch:'Renewal terms, the price per MW on new deals, any large client announcing its own facilities.',
    mit:'The fallback is reallocating capacity to Grok (company). Today pricing is rising, not falling.' },
  { t:'Promised timelines are not met', k:'timing',
    w:'The case needs a reusable rocket, a satellite generation, a compute build-out and a chip fab to all work, on time, under one person’s attention. Announced programmes are not commitments. There is no succession plan in the filings.',
    watch:'Starship weekly in 1H27, twice weekly in 2H27; 13 GW by end-2027; mobile Gen-2 service early 2028; Terafab volume 3Q28; "$500B–1T ARR by end-2027" vs a $33–37B 1Q27 revenue guide.' },
  { t:'The rival with an unlimited balance sheet closes the gap', k:'timing',
    w:'Amazon is behind and missed its own targets, but it can fund Leo indefinitely from AWS without returning to capital markets — exactly what SpaceX cannot do.',
    watch:'Leo satellites in orbit vs the 578 needed to sell in the US; New Glenn cadence; Leo opex (> $1B a quarter in 2H26).' },
  { t:'Dual-use status invites consequences', k:'timing',
    w:'The network serves defence customers and a military constellation shares its hardware, which blurs the civil–commercial line. The practical threat is electronic — jamming, spoofing, cyber — not satellites destroyed. Defence revenue growth and this exposure are the same fact.',
    watch:'Wording and attribution of the 2022 Russian UN statement still to be verified before relying on it.' },
  { t:'Minority shareholders have little recourse', k:'governance',
    w:'Dual-class shares give the founder ~82% of the vote. Controlled-company exemptions apply; capital allocation (a $60B acquisition, affiliate deals) needs no minority approval. $12.9B of $38.8B debt is related-party.',
    seen:'Independent committees at SpaceX and Tesla are evaluating a combination, no terms agreed; Tesla needs 50% of all shares. Q3 other income included $561M from a related party.',
    watch:'Musk’s ~6.4B Class A shares unlock Jun 12 2027; S&P 500 entry expected around Aug 2027 (UBS).' },
  { t:'An orbital debris cascade is uninsurable', k:'tail',
    w:'Under the treaty, liability falls on the launching state. Commercial insurance for constellation-scale collision risk is thin and a cascade has no financial backstop. The loss would be the operating environment, not individual assets.',
    seen:'Starlink has de-orbited 1,446 satellites (Barclays) — end-of-life discipline exists.',
    watch:'Open question 7 — no source covers insurance. Our own work.' }
];

registerView({ id:'risk',
  html: `
  <div class="ins a"><strong>What the bad cases share:</strong> most postpone the case rather than refute it. Two are exceptions that change the answer, not just the timing —
  <strong>forced network sharing</strong> (#3) and <strong>data-residency rules blocking orbital compute</strong> (Orbital compute tab). Neither is modelled by any bank.</div>
  ${sec({ t:'Ranked by how much each would change the conclusion', s:'None requires a disaster; most are ordinary commercial outcomes',
    b:`<div class="rk"><div class="rk-l" id="risk-l"></div><div class="rk-d" id="risk-d"></div></div>`,
    n:'424B4 risk factors, Q3 2026 10-Q and earnings call (Oct 20 2026), sell-side notes (Jul–Nov 2026).' })}
  `,
  init(){
    const tagOf = k => k === 'changes the answer' ? '<span class="tag open">Changes the answer</span>' : k === 'governance' ? '<span class="tag n">Governance</span>' : k === 'tail' ? '<span class="tag n">Tail</span>' : k === 'answer?' ? '<span class="tag wait">Could change it</span>' : '<span class="tag n">Timing</span>';
    $('#risk-l').innerHTML = RISKS.map((r,i) => `<button class="rk-b" data-i="${i}"><span class="n">${i+1}</span><span>${r.t}</span></button>`).join('');
    const pick = i => { const r = RISKS[i];
      $$('#risk-l .rk-b').forEach(b => b.classList.toggle('active', +b.dataset.i === i));
      $('#risk-d').innerHTML = `<h4>${i+1} · ${r.t}</h4><div style="margin-bottom:10px">${tagOf(r.k)}</div><p class="lede">${r.w}</p>` +
        (r.seen ? `<div class="blk"><div class="k">Already visible</div><p>${r.seen}</p></div>` : '') +
        (r.mit ? `<div class="blk"><div class="k">What the sources add</div><p>${r.mit}</p></div>` : '') +
        `<div class="blk"><div class="k">What to watch</div><p>${r.watch}</p></div>`; };
    $$('#risk-l .rk-b').forEach(b => b.onclick = () => pick(+b.dataset.i)); pick(0);
  }
});

/* ───── view: src ───── */
/* Sources & open questions — who said what, what it implies, what is still open */
const QUESTIONS = [
  ['1 · Colossus renewals', 'wait', 'Advanced', 'Renewals price higher and new deals above $50/W; backlog $63B. Exit is open to either party and SpaceX can absorb capacity. The question is the price when supply catches up.'],
  ['2 · Law for data processed in orbit', 'open', 'Our work', 'No source touches it. Could bind before physics or cost.'],
  ['3 · Forced network sharing, quantified', 'open', 'Our work', 'Pieces exist (Clear Street Connectivity margins high-70s to mid-80s, its 10× bear case halves Connectivity value). Nobody models a regulated-utility case.'],
  ['4 · Compute obsolete before orbit', 'wait', 'Bounded', 'The risk is GPUs, not buildings. Clearest exposure: Colossus I (~100k H100) backing Anthropic to 2029. No bank models obsolescence.'],
  ['5 · Terafab EUV from ASML', 'wait', 'Unanswered', 'Asked directly on the Q3 call; Musk gave the schedule and thanked ASML but did not confirm an order. Look for the answer on ASML’s side.'],
  ['6 · Mobile: what it costs to enter as a carrier', 'wait', 'Reframed', '~79 MHz with EchoStar and 800 MHz deals; US carriers refused wholesale access; UBS assumes ~$200B of Connectivity capex to 2031.'],
  ['7 · Who insures a mega-constellation', 'open', 'Our work', 'No source covers it. Only data point: 1,446 satellites de-orbited.'],
  ['8 · Did Google get its capacity by Sep 30', 'wait', 'Ask IR', 'Not in the Q3 release or call. Termination / price-cut right after a month’s grace.'],
  ['9 · A Tesla combination for SPCX minorities', 'wait', 'Watching', 'Independent committees, no terms. Tesla needs 50% of all shares; Musk holds ~82% of the SpaceX vote.']
];
const GLOSSARY = [
  ['Falcon 9 / Starship','Rockets. Falcon 9 flies weekly and lands its booster (up to 34 flights); Starship carries ~100 t and is in testing.'],
  ['Starlink · V2 mini / V3','The satellite internet service and its satellite generations. V3 only fits in Starship.'],
  ['Colossus','The Memphis data centres. Buildings with chips, not in space.'],
  ['Nameplate compute','Installed power of those data centres, in gigawatts. Today 1.7 GW.'],
  ['Starshield','The military version of the network: same hardware, government-grade encryption.'],
  ['IDIQ','Government contract that pre-approves a supplier up to a ceiling without committing to buy.'],
  ['Cost parity','Where orbital and terrestrial compute cost the same. Not zero cost.'],
  ['Adj. EBITDA','Excludes depreciation of satellites and chips — a real cost here ($8.9B in 9M).'],
  ['Data residency','Rules on where data may be processed. Satellites have no fixed place.'],
  ['Wholesale access','A duty to lease network capacity to rivals at regulated prices.'],
  ['De facto / de jure','In practice / in law. SpaceX’s orbital position is the first, never the second.']
];

registerView({ id:'src',
  html: `
  ${sec({ t:'Who said what', s:'Every bank that initiated helped sell the listing. Read them for mechanics, not for the price',
    b:`<div id="src-c"></div>`,
    n:'Not cited as targets. Cestrian (Accumulate, no PT, "valuation meaningless" at 61× EV/sales) and Paragon/Heron (3 ex-sales staff) carry no target. Barclays’ note is on Amazon, not SpaceX.' })}

  ${sec({ t:'What those targets require', s:'Own arithmetic on the banks’ own numbers',
    b:`<ul class="pl">
      <li><strong>Wells Fargo:</strong> 30× $7.1 on ~13.2B shares implies <strong>~$93B of 2028 net income</strong>, against −$413M in 9M26.</li>
      <li><strong>UBS</strong> is already behind reality: it modelled $49.9B capex and −$10.9B FCF for all of 2026; nine months show $48.1B and −$35.0B.</li>
      <li><strong>Clear Street</strong> calls its model conservative and still sits 54% above FY27 revenue consensus.</li>
      <li><strong>No bank</strong> models compute obsolescence, forced network sharing or data residency.</li>
    </ul>`,
    n:'Sell-side notes (Jul–Nov 2026), reviewed Nov 17 2026. Source inconsistencies (UBS net cash shown three ways, Needham naming Meta for Google, aircraft counts from 1,400 to ~12,000) are logged there.' })}

  ${sec({ t:'Open questions', s:'Status after the Nov 17 2026 source review and Q3 call',
    ctl:`<div class="ctls">${seg('src-f','Show',[['all','All'],['open','Our own work'],['wait','In progress']],'all')}</div>`,
    b:`<div id="src-q"></div>`,
    n:'Questions 2 and 3 are the two outcomes that would change the answer rather than the timing.' })}

  ${sec({ t:'Reference', s:'Corrections made in the review and a plain-English glossary',
    b:`<details class="tbl"><summary>Corrected on Nov 17 2026 (9)</summary><div class="tw" style="padding:4px 13px"><ul class="pl">
        <li>90-day cancellation is open to <strong>either party</strong>, after a ramp period (10-Q).</li>
        <li>Falcon 9 at $2,700/kg is the <strong>2010</strong> cost.</li>
        <li>Ground stations: ~400, not ~150.</li>
        <li>"Blasting ahead of LEO" was Barclays on <strong>Amazon Leo</strong>, in an Amazon note.</li>
        <li>The ship was <strong>caught on Flight 15 (Nov 14 2026)</strong>; re-flying the same ship (target early 2027) is the next test.</li>
        <li>Runway is <strong>~5 quarters</strong>, not ~two years.</li>
        <li>"Not about feasibility": engineering at scale (heat, radiation) is still open.</li>
        <li>SpaceX does not pay spot for third-party capacity: it <strong>rents its compute out</strong> at ~spot on short contracts.</li>
        <li>"Internal use could eventually consume most" was a Clear Street paraphrase, not a Musk quote.</li></ul></div></details>
      <details class="tbl"><summary>Glossary (${GLOSSARY.length} terms)</summary><div class="tw" style="padding:4px 13px">${GLOSSARY.map(g => `<div class="gl"><b>${g[0]}</b><span>${g[1]}</span></div>`).join('')}</div></details>`,
    n:'Primary: SpaceX Q3 2026 release and 10-Q, 424B4 (Jun 12 2026), Q3 call transcript (Oct 20 2026). Sell-side: UBS, Needham, Clear Street ×2, Wells Fargo ×2, Deutsche Bank, Mizuho, Cestrian, Paragon/Heron, Barclays. Bloomberg SPLC (Nov 12 2026).' })}
  `,
  init(){
    const S = STREET;
    chartBlock($('#src-c'), { labels:S.map(s => s.b), unit:'$ per share', fmt:v => '$' + num(v), rowHead:'Bank', height:'s',
      series:[ { key:'bear', label:'Bear case', color:C.fog, data:S.map(s => s.bear ?? null) },
               { key:'pt', label:'Price target', color:C.steel, data:S.map(s => s.pt) },
               { key:'bull', label:'Bull case', color:C.conn, data:S.map(s => s.bull ?? null) } ],
      tableNote: S.map(s => `<b>${s.b}</b> (${s.d}, ${s.r}${s.prev ? ', from $' + s.prev : ''}): ${s.m}. <i>${s.c}</i>`).join('<br>') });
    const draw = f => { $('#src-q').innerHTML = QUESTIONS.filter(q => f === 'all' || q[1] === f)
      .map(q => `<div class="st"><b>${q[0]}</b><span><span class="tag ${q[1]}">${q[2]}</span></span><span>${q[3]}</span></div>`).join(''); };
    draw('all'); pills('#src-f', draw);
  }
});

/* ───── view: tgt ───── */
/* Stated targets — what Musk and SpaceX management have promised in public, and what has happened since.
   Built from SOURCES/ELON_MEDIA_GUIDE.md (Nov 25 2026). Every row was re-checked on Nov 25 2026 against the source named
   in "Evidence" unless it says "not re-checked". Status as of Nov 25 2026. */
const TGT_EV = {
  call:  'Company call transcript',
  off:   'Official transcript',
  third: 'Third-party transcript',
  press: 'Press report of the talk',
  nrc:   'Not re-checked'
};
const TGT = [
  // topic, target, stated (date · venue), evidence key, status key, status note
  ['rev',  'Annualised revenue above $100B in December 2026', 'Nov 6 2026 · Baron conference (also Q2, Q3 calls)', 'third', 'open', 'Q4 2026 print settles it. Q3 was $14.6B (~$58B annualised); Musk expects ~70% q/q growth in Q4.'],
  ['rev',  '~$500B annualised revenue in December 2027 — "my best guess"', 'Nov 6 2026 · Baron conference', 'third', 'open', 'Consensus 2027 revenue $187B; J.P. Morgan ~$400B exit ARR.'],
  ['rev',  '$1T annualised revenue by end-2027 — about 2% likely, in his words', 'Nov 6 2026 · Baron conference', 'third', 'open', 'Stated as a low-probability case, not a target.'],
  ['rev',  '10 GW online by end-2027 → $300–500B a year of revenue (≈ $30–50 per watt)', 'Aug 11 2026 · SpaceX all-hands', 'press', 'open', '1.4 GW was running at the time.'],
  ['gw',   'Compute: a little over 2 GW at end-2026 and 5–10 GW by 2027 (CFO)', 'Sep 10 2026 · Goldman Sachs conference', 'press', 'raised', 'Raised on Oct 20 to 2.5–3 GW at YE26 and +10 GW during 2027.'],
  ['gw',   'Adding ~0.5 GW a month now; more than 1 GW a month by end-2027', 'Nov 18 2026 · TomorrowX Summit', 'press', 'open', 'Implies ~3 GW at YE26 if the pace holds.'],
  ['gw',   'Build cost ~60% of industry estimates ("off by a factor of two")', 'Nov 18 2026 · TomorrowX Summit', 'press', 'open', 'J.P. Morgan models ~$33B per GW; management cited "mid-$30s B" vs $50B+ for others.'],
  ['ship', 'Catch the ship on the next flight, "end of this month" (August)', 'Aug 4 2026 · Q2 call', 'call', 'slipped', 'Caught on Flight 15, Nov 14 — about three months later. The booster was lost on that flight.'],
  ['ship', 'At least one Starship flight a day, "probably a year from now"', 'Aug 4 2026 · Q2 call', 'call', 'walked', 'Oct 20: weekly in 1H27, twice weekly or more in 2H27.'],
  ['ship', 'Weekly flights in 1H27, twice weekly or more by end-2027; re-fly the ship early 2027', 'Oct 20 2026 · Q3 call', 'call', 'open', 'Flight 13 → 14 gap was ~9 weeks.'],
  ['ship', 'Full reusability is the 2026 breakthrough', 'Jan 22 2026 · Davos', 'nrc', 'partly', 'Ship caught (Nov 14) but booster lost and no stage re-flown; reflight now early 2027.'],
  ['ship', 'Under $100 per kg to orbit', 'Nov 6 2026 · Baron conference', 'third', 'open', 'No date attached. The prospectus says orbital compute needs ~$100/kg.'],
  ['ship', '~1 million tons to orbit in three or four years', 'Feb 5 2026 · Dwarkesh Podcast', 'off', 'open', '2025: ~2,200 tons in total (Bloomberg).'],
  ['ship', 'Uncrewed Starships to Mars in the late-2026 window', 'May 2025 · Starbase update', 'nrc', 'walked', 'Dropped in Feb 2026 for a Moon-first plan; Mars work resumes in 5–7 years.'],
  ['orb',  'Space becomes the cheapest place to put AI within 36 months, "maybe 30"', 'Feb 5 2026 · Dwarkesh Podcast', 'off', 'open', 'Implies ~2028–29. Bank models put cost parity in the 2030s.'],
  ['orb',  'Full AI-1 compute satellites launch late 2027', 'Jun 12 2026 · Shotwell on CNBC', 'off', 'open', 'Dates have held since June.'],
  ['orb',  'Starmind compute satellites: first launch Q3 2027, large volume 2028, very large 2029 ("I\'m just guessing")', 'Nov 6 2026 · Baron conference', 'third', 'open', 'Q3 call: Starmind satellites begin flying in 2027.'],
  ['orb',  'Terafab test chip around June 2027', 'Nov 18 2026 · TomorrowX Summit', 'press', 'open', 'No cost or construction schedule given at the March launch event.'],
  ['conn', 'Starlink Mobile U.S. service in early 2028, after Mobile V2 satellites fly in 2027', 'Oct 20 2026 · Q3 call', 'call', 'open', 'J.P. Morgan expects 2029.'],
  ['conn', 'Direct-to-cell V2 in 2027; 800 MHz micro-cells in production in 2027', 'Nov 18 2026 · NYT DealBook', 'nrc', 'open', ''],
  ['conn', 'Starlink V3 → ~100× today\'s bandwidth in two to three years', 'Nov 6 2026 · Baron conference', 'nrc', 'open', 'First V3s flew on Starship (26 per flight vs 60 planned).'],
  ['other','Long-run margins ~70% gross, ~45% net', 'Jun 4 2026 · IPO roadshow', 'nrc', 'open', '2025: 49% gross, −26% net.'],
  ['other','AI will be ~99% of SpaceX\'s value in four or five years', 'Aug 11 2026 · SpaceX all-hands', 'press', 'open', 'Not testable near term.'],
  ['other','Capex lower than peers ("not quite as much")', 'Jun 12 2026 · Shotwell on CNBC', 'off', 'open', 'Capex was $48B in 9M 2026; ~$300B implied for 2027.']
];
const TGT_ST = { open:['Open','n'], raised:['Raised','ok'], slipped:['Slipped','wait'], walked:['Walked back','open'], partly:['Partly met','wait'] };
const TGT_TOPIC = [['all','All'],['rev','Revenue'],['gw','Compute build'],['ship','Starship'],['orb','Orbital & chips'],['conn','Starlink'],['other','Other']];

registerView({ id:'tgt',
  html: `
  <div class="srow" id="tgt-tiles"></div>

  ${sec({ t:'What was promised, and what happened', s:'Public targets from Musk, Shotwell and the CFO, each checked against the source named',
    ctl:`<div class="ctls">${seg('tgt-f','Topic',TGT_TOPIC,'all')}</div>`,
    b:`<div class="tw" id="tgt-t"></div>`,
    n:'Evidence: <b>company call</b> = SpaceX earnings-call transcript; <b>official transcript</b> = published by the host (Dwarkesh, CNBC); <b>third-party transcript</b> = TeslaNorth\'s transcript of the Baron talk, not checked word for word by its publisher; <b>press report</b> = Teslarati, Dealroom or BGR write-ups of the talk; <b>not re-checked</b> = from the media guide only. Status as of Nov 25 2026.' })}

  ${sec({ t:'How to read Musk\'s timelines', s:'His own rule, and the 2026 record',
    b:`<ul class="pl">
      <li><strong>He sets deadlines at about 50% odds</strong> and expects to be late half the time (Dwarkesh, Feb 2026). Treat a date as a median, not a commitment.</li>
      <li><strong>Hardware slips one to two quarters:</strong> the ship catch came ~3 months after the Q2-call promise; full reuse and orbital refuelling moved from 2026 to early 2027.</li>
      <li><strong>Cadence promises get walked back within a quarter:</strong> "a flight a day within a year" (Aug) became weekly → twice weekly in 2027 (Oct).</li>
      <li><strong>Compute guidance has been raised, not cut</strong> (CFO 5–10 GW in Sep → +10 GW in Oct), and the build rate he cites (0.5 GW a month) supports it. Compute is the part the market pays for.</li>
      <li><strong>Revenue targets come with his own odds:</strong> ~$500B exit ARR in 2027 is a "best guess"; $1T about 2%. The Bull scenario uses the first, never the second.</li>
    </ul>`,
    n:'Dwarkesh Podcast official transcript (Feb 5 2026); SpaceX Q2 and Q3 2026 call transcripts; Baron conference transcript (TeslaNorth, Nov 7 2026).' })}

  ${sec({ t:'Where to hear it', s:'The five sources worth the time, in order',
    b:`<ul class="pl">
      <li><strong>Baron Investment Conference, Nov 6 2026</strong> — ARR path and his own odds; Starmind dates. Third-party transcript: <a href="https://teslanorth.com/2026/11/07/elon-musks-full-ron-baron-interview-2026-tesla-spacex-starship-ai-and-more/" target="_blank" rel="noopener">TeslaNorth</a>.</li>
      <li><strong>TomorrowX Summit with Gavin Baker, Nov 18 2026</strong> — build rate, cost per GW, Terafab. <a href="https://www.youtube.com/watch?v=DY8clym2-jQ" target="_blank" rel="noopener">YouTube</a>.</li>
      <li><strong>Dwarkesh Podcast, Feb 5 2026</strong> — the orbital-compute case and his deadline rule. <a href="https://www.dwarkesh.com/p/elon-musk" target="_blank" rel="noopener">Official transcript</a>.</li>
      <li><strong>Shotwell on CNBC, Jun 12 2026</strong> — AI-1 satellites, capex discipline. <a href="https://pressroom.versantmedia.com/cnbc/press-releases/cnbc-exclusive-transcript-spacex-president-and-coo-gwynne-shotwell-speaks-cnbcs" target="_blank" rel="noopener">Official transcript</a>.</li>
      <li><strong>SpaceX all-hands, Aug 11 2026</strong> — 10 GW → $300–500B; AI as ~99% of value. <a href="https://www.teslarati.com/spacexs-next-trillion-dollar-bet-has-nothing-to-do-with-rockets-musk-tells-staff/" target="_blank" rel="noopener">Teslarati report</a>.</li>
    </ul>`,
    n:'Full catalogue (29 items, links, what each covers): SOURCES/ELON_MEDIA_GUIDE.md in the SpaceX research folder.' })}
  `,
  init(){
    let f = 'all';
    const draw = () => {
      const rows = TGT.filter(r => f === 'all' || r[0] === f);
      $('#tgt-t').innerHTML = table(['Target','Stated','Evidence','Status','Since then'],
        rows.map(r => [`<span style="white-space:normal;display:inline-block;max-width:340px;text-align:left">${r[1]}</span>`, r[2], `<span class="tag ${r[3]==='nrc'?'n':'e'}">${TGT_EV[r[3]]}</span>`,
          `<span class="tag ${TGT_ST[r[4]][1]}">${TGT_ST[r[4]][0]}</span>`, `<span style="white-space:normal;display:inline-block;max-width:300px;text-align:left">${r[5]}</span>`]));
    };
    pills('#tgt-f', v => { f = v; draw(); });
    const n = k => TGT.filter(r => r[4] === k).length;
    $('#tgt-tiles').innerHTML = tile('Targets tracked', TGT.length, 'Musk, Shotwell, CFO · Jan–Nov 2026') +
      tile('Still open', n('open'), 'Most fall due in 2027') +
      tile('Slipped or walked back', n('slipped') + n('walked') + n('partly'), 'All on Starship and Mars') +
      tile('Raised', n('raised'), 'Compute build guidance');
    draw();
  }
});

/* ═════════════ PORTAL EXPORTS ═════════════
   Order and labels of the Miscellaneous sub-tabs (MISC-<key> in docs/profiles/SPCX.md). */
export const SPCX_MISC_TABS = [
  { k:'fin',  l:'Financial Model' },
  { k:'cash', l:'Funding' },
  { k:'val',  l:'Scenario Valuation' },
  { k:'si',   l:'AI & Compute' },
  { k:'ship', l:'Starship & Launch' },
  { k:'conn', l:'Starlink' },
  { k:'orb',  l:'Orbital Compute' },
  { k:'def',  l:'Defense' },
  { k:'comp', l:'Competitive Position' },
  { k:'risk', l:'Risks' },
  { k:'tgt',  l:'Stated Targets' },
  { k:'src',  l:'Sources & Open Questions' }
];
export function spcxMiscHtml(k){ const v = VIEWS[k]; return v ? '<div class="spx" id="spx-' + k + '">' + v.html + '</div>' : ''; }
/* Build one sub-tab the first time it becomes visible (Chart.js needs a laid-out canvas). */
export function spcxMiscBuild(root, k){
  R = root; const v = VIEWS[k]; if(!v || v.built) return; v.built = true;
  try { v.init && v.init(); } catch(e){ console.error('[spcx misc ' + k + ']', e); }
}
/* Called once per Deep Dive mount: fresh DOM, so every view rebuilds and old model listeners go. The live quote
   (spcx.js → api.liveQuote) sets the price the valuation reads and re-runs the model. */
export function spcxMiscWire(root, onPrice){
  R = root; MODEL.clear(); Object.values(VIEWS).forEach(v => { v.built = false; });
  if(onPrice) onPrice(q => {
    if(!q || !q.price) return;
    PRICE.px = q.price; PRICE.date = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
    if(q.marketCap) PRICE.sharesOut = q.marketCap / q.price / 1e6;
    MODEL.set('f', {});
  });
}
