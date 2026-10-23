/* ═════════════ CORE — shared by every view ═════════════
   Load order (index.html): Chart.js → core.js → data-overview.js → img.js → views/*.js → app.js
   A view file calls registerView({...}) once; its html is inserted immediately, so the rest of the
   file can bind events to its own elements. init() runs the first time the view is opened
   (Chart.js needs a visible canvas). Everything a view owns is prefixed with its id (ids, classes, globals). */

const VIEWS = {};
function registerView(v){
  // v = { id, html, init(), css? }  — css is an optional string, scoped by the view to #v-<id>
  const el = document.createElement('div');
  el.className = 'view'; el.id = 'v-' + v.id; el.innerHTML = v.html;
  document.getElementById('content').appendChild(el);
  if(v.css){ const st = document.createElement('style'); st.textContent = v.css; document.head.appendChild(st); }
  VIEWS[v.id] = { ...v, el, built:false };
}

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const fmtB = (m, d=1) => '€' + (m/1000).toFixed(d) + 'B';
const pct = (x, d=1) => (x*100).toFixed(d) + '%';
const sgn = (x, d=0) => (x>=0?'+':'') + (x*100).toFixed(d) + '%';

Chart.defaults.font.family = "Inter, -apple-system, system-ui, sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.color = '#7C8694';
Chart.defaults.borderColor = '#EEF1F5';
const TIP = { backgroundColor:'#1E2733', padding:9, titleFont:{weight:600}, bodyFont:{size:11} };   // tooltip base for every chart

/* Pill toggle group: <div class="fbg" id="x"><button class="fb active" data-v="a">A</button>…</div> */
function pills(sel, onChange){
  $$(sel + ' .fb').forEach(b => b.onclick = () => {
    $$(sel + ' .fb').forEach(x => x.classList.remove('active')); b.classList.add('active'); onChange(b.dataset.v ?? b.dataset.m ?? b.dataset.y ?? b.dataset.q);
  });
}

/* Drag-to-zoom on both axes + double-click reset (no plugin: rebuilds the visible window).
   getChart() returns the live chart; set chart.$lo = index of the first visible category after each rebuild. */
function attachZoom(getChart, onRange){
  const cv = getChart().canvas; let x0=null, y0=null, box=null;
  const wrap = cv.parentElement;
  cv.addEventListener('mousedown', e => { const r=cv.getBoundingClientRect(); x0=e.clientX-r.left; y0=e.clientY-r.top;
    box=document.createElement('div'); box.style.cssText='position:absolute;border:1px solid #2563EB;background:rgba(37,99,235,.08);pointer-events:none';
    wrap.appendChild(box); });
  window.addEventListener('mousemove', e => { if(x0===null) return; const r=cv.getBoundingClientRect(); const x=e.clientX-r.left, y=e.clientY-r.top;
    Object.assign(box.style,{left:Math.min(x,x0)+'px',top:Math.min(y,y0)+'px',width:Math.abs(x-x0)+'px',height:Math.abs(y-y0)+'px'}); });
  window.addEventListener('mouseup', e => { if(x0===null) return; const r=cv.getBoundingClientRect(); const x1=e.clientX-r.left, y1=e.clientY-r.top;
    box.remove(); const dx=Math.abs(x1-x0), dy=Math.abs(y1-y0);
    if(dx>8 || dy>25){ const chart=getChart(), xs=chart.scales.x, ys=chart.scales.y;
      const range = {};
      if(dx>8){ const a=Math.round(xs.getValueForPixel(Math.min(x0,x1))), b=Math.round(xs.getValueForPixel(Math.max(x0,x1)));
        range.x=[a+(chart.$lo||0), b+(chart.$lo||0)]; }
      if(dy>25){ range.y=[ys.getValueForPixel(Math.max(y0,y1)), ys.getValueForPixel(Math.min(y0,y1))]; }
      onRange(range); }
    x0=null; });
  cv.addEventListener('dblclick', () => onRange(null));
}

/* Clickable legend: items = [{key,label,color,line?,dash?}], hidden = Set of keys. Hidden series must also leave tables and totals. */
function legend(el, items, hidden, onToggle){
  el.innerHTML = items.map(it => `<span class="li${hidden.has(it.key)?' off':''}" data-k="${it.key}"><span class="${it.line?'ll':'ls'}" style="background:${it.color}${it.dash?';background:repeating-linear-gradient(90deg,'+it.color+' 0 4px,transparent 4px 7px)':''}"></span>${it.label}</span>`).join('');
  el.querySelectorAll('.li').forEach(n => n.onclick = () => { const k=n.dataset.k; hidden.has(k)?hidden.delete(k):hidden.add(k); onToggle(); });
}

/* Simple table from rows: cols = header labels, rows = arrays of cells (strings). est = Set of column indexes rendered as estimates */
function table(cols, rows, est){
  est = est || new Set();
  return `<table><thead><tr>${cols.map((c,i)=>`<th class="${est.has(i)?'est':''}">${c}</th>`).join('')}</tr></thead><tbody>` +
    rows.map(r => `<tr>${r.map((c,i)=>`<td class="${est.has(i)?'est':''}">${c}</td>`).join('')}</tr>`).join('') + '</tbody></table>';
}
