/* ═════════════ CORE — shared by every view ═════════════
   Load order (index.html): Chart.js → core.js → data.js → views/*.js → app.js
   A view file calls registerView({...}) once; its html is inserted immediately. init() runs the first time
   the view is opened (Chart.js needs a visible canvas). Everything a view owns is prefixed with its id. */

const VIEWS = {};
function registerView(v){
  const el = document.createElement('div');
  el.className = 'view'; el.id = 'v-' + v.id; el.innerHTML = v.html;
  document.getElementById('content').appendChild(el);
  if(v.css){ const st = document.createElement('style'); st.textContent = v.css; document.head.appendChild(st); }
  VIEWS[v.id] = { ...v, el, built:false };
}

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
/* $ millions → "$27.1B" / "$705M" */
const usd = (m, d=1) => m == null ? '—' : (Math.abs(m) >= 1000 ? (m<0?'−':'') + '$' + (Math.abs(m)/1000).toFixed(d) + 'B' : (m<0?'−':'') + '$' + Math.abs(m).toLocaleString('en-US',{maximumFractionDigits:0}) + 'M');
const num = (x, d=0) => x == null ? '—' : (x<0?'−':'') + Math.abs(x).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const chg = (a, b) => (a==null||b==null||b===0) ? '—' : ((a/b-1)*100 >= 0 ? '+' : '−') + Math.abs((a/b-1)*100).toFixed(0) + '%';

/* Palette — Summit blue ramp (same as the ASML deep dive). Segments keep one colour everywhere. */
const C = { conn:'#2563EB', si:'#1E2733', space:'#93B1F0', steel:'#3E5A82', sky:'#5E8BEC', fog:'#C8D7F4', grey:'#A9B4C2', deep:'#1B3F94', pos:'#16A34A', neg:'#DC2626' };

Chart.defaults.font.family = "Inter, -apple-system, system-ui, sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.color = '#7C8694';
Chart.defaults.borderColor = '#EEF1F5';
Chart.defaults.animation = false;
const TIP = { backgroundColor:'#1E2733', padding:9, titleFont:{weight:600}, bodyFont:{size:11} };

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
    borderRadius: (s.type||cfg.type||'bar') === 'bar' ? 3 : 0, maxBarThickness: 46, spanGaps: !!s.span, stack: s.stack, yAxisID: s.axis, order: s.type === 'line' ? 0 : 1
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
