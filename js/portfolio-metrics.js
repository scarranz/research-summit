// Portfolio Metrics tab — work in progress. Two sub-tabs:
//   • Portfolio — the fixed 14-name book, split into Passive and Single Stock.
//                 Metric values (EBITDA / Earnings / CFO / FCF) come live from
//                 the Summit DCF model (js/portfolio-metrics-summit.js) for the
//                 9 covered names; growth computes from them. A year selector
//                 (NTM · current · +1 · +2) picks the right-hand period; the
//                 column before it is the prior period (NTM↔LTM are calendar
//                 blends). Price / Market Cap / Net Debt / EV are live from
//                 Massive (api.liveQuote). The forward multiple is computed live
//                 for USD Summit names — EV/EBITDA = EV ÷ EBITDA, the rest =
//                 Market Cap ÷ metric; SPOT/TBBB (EUR/MXN) keep a hand-typed
//                 multiple to avoid mixing currencies. PEG = multiple ÷ growth.
//                 Names Summit doesn't cover (GOOGL, TSMC, ETFs) show the live
//                 quote columns only.
//   • Paper     — same structure, rows added manually (+ Add), weight % typed.
// Manual entries persist in localStorage.
import { SUMMIT_FUND } from './portfolio-metrics-summit.js';
import { liveQuote } from './api.js';

// ── Portfolio subtab: the fixed book ─────────────────────────────────────────
const PORTFOLIO = {
  passive: [
    { ticker: 'QQQ', label: 'QQQ' },
    { ticker: 'XLG', label: 'XLG' },
    { ticker: 'SMH', label: 'SMH' },
  ],
  single: [
    { ticker: 'UBER',  label: 'Uber' },
    { ticker: 'AMZN',  label: 'Amzn' },
    { ticker: 'META',  label: 'Meta' },
    { ticker: 'LYFT',  label: 'Lyft' },
    { ticker: 'TBBB',  label: 'TBBB' },
    { ticker: 'SOFI',  label: 'Sofi' },
    { ticker: 'SPOT',  label: 'Spot' },
    { ticker: 'GOOGL', label: 'Googl' },
    { ticker: 'NVDA',  label: 'Nvda' },
    { ticker: 'TSMC',  label: 'Tsmc' },
    { ticker: 'MA',    label: 'MA' },
  ],
};

const DASH = '<td class="num muted">&mdash;</td>';

// Metric config. `mult` is the header label for the forward multiple column.
const METRICS = {
  ebitda:   { label: 'EBITDA',   mult: 'EV/EBITDA fwd' },
  earnings: { label: 'Earnings', mult: 'P/E fwd' },
  cfo:      { label: 'CFO',      mult: 'P/CFO fwd' },
  fcf:      { label: 'FCF',      mult: 'P/FCF fwd' },
};
// Year selector: NTM + current calendar year + next two.
const CY = new Date().getFullYear();
const YEARS = ['NTM', String(CY), String(CY + 1), String(CY + 2)];
// Massive symbol overrides for the live quote (label ticker → quote ticker).
const QUOTE_TICKER = { TSMC: 'TSM' };

let metricSel = null;                 // active metric key, or null (base view)
let yearSel = String(CY + 1);         // selected "last" period; default = current+1
const quotes = {};                    // ticker → { price, marketCap, ev, netDebt } | null

function periodInfo() {
  if (yearSel === 'NTM') return { prevKey: 'LTM', prevLabel: 'LTM', currKey: 'NTM', currLabel: 'NTM' };
  const y = parseInt(yearSel, 10);
  return { prevKey: String(y - 1), prevLabel: String(y - 1), currKey: String(y), currLabel: String(y) };
}

// ── State (manual entries, for names Summit doesn't cover + manual multiples) ─
const METRIC_KEY = 'pm-metric-v2';
const PAPER_KEY  = 'pm-paper-v1';

function loadJSON(key, fallback) {
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); }
  catch (e) { /* ignore corrupt storage */ }
  return fallback;
}
function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ }
}

let metricData = loadJSON(METRIC_KEY, {});
let paper = (() => { const p = loadJSON(PAPER_KEY, {}); return { passive: p.passive || [], single: p.single || [] }; })();

const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : null; };
const esc = (s) => String(s ?? '').replace(/"/g, '&quot;');

// Millions → compact string (company-currency, no symbol).
function fmtMM(v) {
  if (v === null || v === undefined || !Number.isFinite(v)) return '&mdash;';
  return v.toLocaleString('en-US', { maximumFractionDigits: Math.abs(v) >= 100 ? 0 : 1 });
}
// USD millions → -$X.XB / $XM.
function fmtUSDmm(v) {
  if (v === null || v === undefined || !Number.isFinite(v)) return '&mdash;';
  const a = Math.abs(v), sign = v < 0 ? '-' : '';
  return a >= 1000
    ? sign + '$' + (a / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 }) + 'B'
    : sign + '$' + a.toLocaleString('en-US', { maximumFractionDigits: 0 }) + 'M';
}

// ── Summit value access (with NTM/LTM calendar blending) ─────────────────────
const isCovered = (t) => !!SUMMIT_FUND[t];
const manualRec = (t) => (metricData[t] && metricData[t][metricSel]) || {};

function fracElapsed() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear() + 1, 0, 1);
  return (now - start) / (end - start);
}
function blend(a, b, key, wa, wb) {
  if (!a || !b) return null;
  const va = a[key], vb = b[key];
  if (va === null || va === undefined || vb === null || vb === undefined) return null;
  return wa * va + wb * vb;
}
function summitVal(t, key, periodKey) {
  const rec = SUMMIT_FUND[t];
  if (!rec) return undefined;
  const ys = rec.years;
  if (periodKey === 'NTM') { const f = fracElapsed(); return blend(ys[String(CY)], ys[String(CY + 1)], key, 1 - f, f); }
  if (periodKey === 'LTM') { const f = fracElapsed(); return blend(ys[String(CY - 1)], ys[String(CY)], key, 1 - f, f); }
  const y = ys[periodKey];
  return y ? y[key] : undefined;
}

// Metric value: Summit for covered names, manual entry otherwise.
function valueFor(t, periodKey) {
  if (isCovered(t)) return num(summitVal(t, metricSel, periodKey));
  return num((manualRec(t).byYear || {})[periodKey]);
}
const priceOf     = (t) => (quotes[t] ? quotes[t].price : null);
const marketCapOf = (t) => (quotes[t] ? quotes[t].marketCap : null);
const evOf        = (t) => (quotes[t] ? quotes[t].ev : null);
const netDebtOf   = (t) => (quotes[t] ? quotes[t].netDebt : null);

// Live forward multiple for USD Summit names: EV/EBITDA = EV ÷ EBITDA, the rest
// = Market Cap ÷ metric. SPOT/TBBB are skipped (metric in EUR/MXN vs USD quote).
function autoMultFor(t) {
  if (!metricSel) return null;
  const rec = SUMMIT_FUND[t];
  if (!rec || rec.currency !== 'USD') return null;
  const mv = num(summitVal(t, metricSel, periodInfo().currKey));
  if (mv === null || mv <= 0) return null;
  const numer = metricSel === 'ebitda' ? evOf(t) : marketCapOf(t);
  if (numer === null) return null;
  return numer / mv;
}
function multFor(t) {
  const a = autoMultFor(t);
  return a !== null ? a : num(manualRec(t).mult);
}
function growthFor(t) {
  const p = periodInfo();
  const a = valueFor(t, p.prevKey), b = valueFor(t, p.currKey);
  if (a === null || b === null || a === 0) return null;
  return ((b - a) / Math.abs(a)) * 100;
}
function pegFor(t, g) {
  const m = multFor(t);
  if (m === null || g === null || g === 0) return null;
  return m / g;
}

// ── Portfolio rendering ──────────────────────────────────────────────────────
function baseCells(item) {
  const t = item.ticker;
  const price = priceOf(t);
  const priceTd = `<td class="num">${price != null ? '$' + price.toFixed(2) : '&mdash;'}</td>`;
  const mcTd = `<td class="num pm-sv">${fmtUSDmm(marketCapOf(t))}</td>`;
  // Weight, Price, Market Cap; Net Debt + EV only when no metric active.
  const tail = metricSel ? '' :
    `<td class="num pm-sv">${fmtUSDmm(netDebtOf(t))}</td><td class="num pm-sv">${fmtUSDmm(evOf(t))}</td>`;
  return DASH + priceTd + mcTd + tail;
}

function metricCells(ticker) {
  if (!metricSel) return '';
  const p = periodInfo();
  const covered = isCovered(ticker);
  const g = growthFor(ticker);
  const peg = pegFor(ticker, g);
  const gCls = g === null ? '' : (g >= 0 ? 'up' : 'dn');

  const auto = autoMultFor(ticker);
  const multTd = auto !== null
    ? `<td class="msep pm-sv">${auto.toFixed(1)}</td>`
    : `<td class="msep"><input class="pm-minp" data-field="mult" value="${esc(manualRec(ticker).mult)}" placeholder="—"></td>`;

  let prevTd, currTd;
  if (covered) {
    prevTd = `<td class="pm-sv">${fmtMM(valueFor(ticker, p.prevKey))}</td>`;
    currTd = `<td class="pm-sv">${fmtMM(valueFor(ticker, p.currKey))}</td>`;
  } else {
    const by = manualRec(ticker).byYear || {};
    prevTd = `<td><input class="pm-minp" data-period="${p.prevKey}" value="${esc(by[p.prevKey])}" placeholder="—"></td>`;
    currTd = `<td><input class="pm-minp" data-period="${p.currKey}" value="${esc(by[p.currKey])}" placeholder="—"></td>`;
  }
  return `
    ${multTd}
    ${prevTd}
    ${currTd}
    <td class="pm-growth ${gCls}">${g === null ? '&mdash;' : g.toFixed(1) + '%'}</td>
    <td class="pm-peg">${peg === null ? '&mdash;' : peg.toFixed(2)}</td>`;
}

function portRow(item) {
  return `<tr data-ticker="${item.ticker}">
    <td class="tk">${item.label}</td>
    ${baseCells(item)}
    ${metricCells(item.ticker)}
  </tr>`;
}

function portGroup(label, items, span) {
  return `<tr class="grp"><td colspan="${span}">${label}</td></tr>` +
    items.map(portRow).join('');
}

function metricNote() {
  if (!metricSel) return '';
  const m = METRICS[metricSel];
  const formula = metricSel === 'ebitda' ? 'EV ÷ Summit EBITDA' : `Market Cap ÷ Summit ${m.label}`;
  return `<p class="pm-note">
    Metric values = Summit DCF model (millions of each company's reporting currency; SPOT in EUR, TBBB in MXN).
    Forward years are projections, 2025 is the last actual; NTM/LTM are calendar-weighted blends.
    ${m.mult} is computed live = ${formula} for USD names; SPOT/TBBB use a hand-typed multiple (metric is in EUR/MXN, quote in USD).
    GOOGL, TSMC and the ETFs aren't in Summit — type those by hand. PEG = multiple ÷ growth.
  </p>`;
}

function portfolioTable() {
  const span = metricSel ? 9 : 6;
  const p = periodInfo();
  const m = metricSel ? METRICS[metricSel] : null;
  const metricHead = m ? `
    <th class="msep">${m.mult}</th>
    <th>${m.label} ${p.prevLabel}</th>
    <th>${m.label} ${p.currLabel}</th>
    <th>Growth ${p.prevLabel}&rarr;${p.currLabel}</th>
    <th>PEG</th>` : '';
  const baseTail = metricSel ? '' : '<th>Net Debt</th><th>EV</th>';
  return `
    <div class="pm-metricbar">
      <span class="lbl">Metric</span>
      <div class="pm-seg">
        ${Object.keys(METRICS).map(k =>
          `<button data-metric="${k}" class="${metricSel === k ? 'on' : ''}">${METRICS[k].label}</button>`
        ).join('')}
      </div>
      <span class="lbl" style="margin-left:8px">Year</span>
      <div class="pm-seg">
        ${YEARS.map(y =>
          `<button data-year="${y}" class="${yearSel === y ? 'on' : ''}">${y}</button>`
        ).join('')}
      </div>
    </div>
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Ticker</th><th>Weight %</th><th>Price</th><th>Market Cap</th>
            ${baseTail}
            ${metricHead}
          </tr>
        </thead>
        <tbody>
          ${portGroup('Passive', PORTFOLIO.passive, span)}
          ${portGroup('Single Stock', PORTFOLIO.single, span)}
        </tbody>
      </table>
    </div>
    <p class="pm-note">Price · Market Cap · Net Debt · EV = live via Massive (api.liveQuote). Net Debt = EV − Market Cap (negative = net cash).</p>
    ${metricNote()}`;
}

function renderPortfolio() {
  const el = document.getElementById('pm-sub-portfolio');
  if (el) el.innerHTML = portfolioTable();
}

// Recompute the growth + PEG cells of one row in place (keeps input focus).
function refreshComputed(tr) {
  const t = tr.dataset.ticker;
  const g = growthFor(t);
  const peg = pegFor(t, g);
  const gEl = tr.querySelector('.pm-growth');
  const pEl = tr.querySelector('.pm-peg');
  if (gEl) {
    gEl.textContent = g === null ? '—' : g.toFixed(1) + '%';
    gEl.classList.toggle('up', g !== null && g >= 0);
    gEl.classList.toggle('dn', g !== null && g < 0);
  }
  if (pEl) pEl.textContent = peg === null ? '—' : peg.toFixed(2);
}

// ── Live quotes ──────────────────────────────────────────────────────────────
function pLimit(n) {
  let active = 0; const q = [];
  const next = () => {
    if (active >= n || !q.length) return;
    active++; const { fn, res, rej } = q.shift();
    fn().then(res, rej).finally(() => { active--; next(); });
  };
  return (fn) => new Promise((res, rej) => { q.push({ fn, res, rej }); next(); });
}

let _rerenderTimer = null;
function scheduleRerender() {
  if (_rerenderTimer) return;
  _rerenderTimer = setTimeout(() => {
    _rerenderTimer = null;
    const ae = document.activeElement;
    if (ae && ae.classList && ae.classList.contains('pm-minp')) { scheduleRerender(); return; }
    renderPortfolio();
  }, 120);
}

function fetchQuotes() {
  const limit = pLimit(3);
  const tickers = [...PORTFOLIO.passive, ...PORTFOLIO.single].map(x => x.ticker);
  tickers.forEach(t => {
    limit(() => liveQuote(QUOTE_TICKER[t] || t)
      .then(r => { quotes[t] = (r && r.success) ? r.data : null; scheduleRerender(); })
      .catch(() => {}));
  });
}

// ── Paper subtab: manually-built book ────────────────────────────────────────
function savePaper() { saveJSON(PAPER_KEY, paper); }

function paperRow(group, item, idx) {
  return `<tr data-group="${group}" data-idx="${idx}">
    <td><input class="pm-inp pm-tk" data-field="ticker" value="${esc(item.ticker)}" placeholder="Ticker"></td>
    <td><input class="pm-inp pm-wt" data-field="weight" value="${esc(item.weight)}" placeholder="0.0"> <span class="muted">%</span></td>
    ${DASH}${DASH}${DASH}${DASH}
    <td class="pm-actions"><button class="pm-del" title="Remove">&times;</button></td>
  </tr>`;
}

function paperGroup(label, group) {
  const items = paper[group];
  const rows = items.length
    ? items.map((it, i) => paperRow(group, it, i)).join('')
    : `<tr><td colspan="7" class="pm-empty">No positions yet &mdash; use + Add below.</td></tr>`;
  return `<tr class="grp"><td colspan="7">${label}</td></tr>` + rows +
    `<tr><td colspan="7"><button class="pm-add" data-add="${group}">+ Add</button></td></tr>`;
}

function paperTable() {
  return `
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Ticker</th><th>Weight %</th><th>Price</th>
            <th>Market Cap</th><th>Net Debt</th><th>EV</th><th></th>
          </tr>
        </thead>
        <tbody id="pm-paper-body">
          ${paperGroup('Passive', 'passive')}
          ${paperGroup('Single Stock', 'single')}
        </tbody>
      </table>
    </div>`;
}

function renderPaperBody() {
  const body = document.getElementById('pm-paper-body');
  if (!body) return;
  body.innerHTML = paperGroup('Passive', 'passive') + paperGroup('Single Stock', 'single');
}

// ── Shell + wiring ───────────────────────────────────────────────────────────
export function loadPortfolioMetricsPage() {
  const root = document.getElementById('pm-root');
  if (!root) return;

  root.innerHTML = `
  <div class="pm-wrap">
    <div class="topbar"><h2>Portfolio Metrics</h2></div>
    <p class="sub">Portfolio holdings across passive and single-stock positions.</p>

    <div class="pm-subnav">
      <button class="pm-pill active" data-sub="portfolio">Portfolio</button>
      <button class="pm-pill" data-sub="paper">Paper</button>
    </div>

    <div class="pm-sub active" id="pm-sub-portfolio">${portfolioTable()}</div>
    <div class="pm-sub" id="pm-sub-paper">${paperTable()}</div>
  </div>`;

  wire(root);
  fetchQuotes();
}

function wire(root) {
  root.addEventListener('click', (e) => {
    // Sub-tab switch (Portfolio / Paper)
    const pill = e.target.closest('.pm-pill');
    if (pill) {
      const sub = pill.dataset.sub;
      root.querySelectorAll('.pm-pill').forEach(p => p.classList.toggle('active', p === pill));
      root.querySelectorAll('.pm-sub').forEach(s => s.classList.toggle('active', s.id === 'pm-sub-' + sub));
      return;
    }
    // Metric selector — click active one again to turn it off
    const mbtn = e.target.closest('.pm-seg button[data-metric]');
    if (mbtn) {
      const k = mbtn.dataset.metric;
      metricSel = (metricSel === k) ? null : k;
      renderPortfolio();
      return;
    }
    // Year selector
    const ybtn = e.target.closest('.pm-seg button[data-year]');
    if (ybtn) {
      yearSel = ybtn.dataset.year;
      renderPortfolio();
      return;
    }
    // Paper: add row
    const add = e.target.closest('.pm-add');
    if (add) {
      paper[add.dataset.add].push({ ticker: '', weight: '' });
      savePaper();
      renderPaperBody();
      return;
    }
    // Paper: remove row
    const del = e.target.closest('.pm-del');
    if (del) {
      const tr = del.closest('tr');
      paper[tr.dataset.group].splice(Number(tr.dataset.idx), 1);
      savePaper();
      renderPaperBody();
      return;
    }
  });

  root.addEventListener('input', (e) => {
    // Portfolio metric inputs (manual value or manual multiple) → save + recompute
    const minp = e.target.closest('.pm-minp');
    if (minp) {
      const tr = minp.closest('tr');
      const t = tr.dataset.ticker;
      (metricData[t] ||= {});
      const rec = (metricData[t][metricSel] ||= {});
      if (minp.dataset.field === 'mult') {
        rec.mult = minp.value;
      } else {
        (rec.byYear ||= {});
        rec.byYear[minp.dataset.period] = minp.value;
      }
      saveJSON(METRIC_KEY, metricData);
      refreshComputed(tr);
      return;
    }
    // Paper ticker / weight
    const inp = e.target.closest('.pm-inp');
    if (inp) {
      const tr = inp.closest('tr');
      const item = paper[tr.dataset.group][Number(tr.dataset.idx)];
      if (item) { item[inp.dataset.field] = inp.value; savePaper(); }
    }
  });
}
