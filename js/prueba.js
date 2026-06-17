import { ALL_STOCKS } from './portal-data.js';

const SECTORS = [
  'Communication Services','Consumer Discretionary','Consumer Staples',
  'Energy','Financials','Health Care','Industrials','Materials',
  'Real Estate','Technology','Utilities',
];

const RETURN_COLS = [
  { key: 'r22', label: '2022' },
  { key: 'r23', label: '2023' },
  { key: 'r24', label: '2024' },
  { key: 'r25', label: '2025' },
  { key: 'r26', label: '2026 YTD' },
  { key: 'c3',  label: '3yr Cumul.' },
];

let _sortCol = 'r26';
let _sortDir = -1; // -1 = desc
let _filtered = [];

export function loadPruebaPage() {
  const el = document.getElementById('tp-prueba');
  el.innerHTML = buildHTML();
  bindEvents();
  applyFilters();
}

function buildHTML() {
  return `
<div class="prueba-wrap">
  <h1 class="co-h1">S&P 500 Screener</h1>
  <p class="co-sub">Filter 500+ index companies by sector, subsector, and returns. Multiples, price, and volatility will be connected via Summit Financial Data.</p>

  <!-- ── Filter panel ── -->
  <div class="card" style="margin-bottom:18px;padding:18px 20px">
    <div class="prueba-filters">

      <!-- Sector -->
      <div class="prueba-fg">
        <label class="prueba-lbl">Sector</label>
        <select class="fsel" id="pr-sector" style="width:100%">
          <option value="">All</option>
          ${SECTORS.map(s => `<option>${s}</option>`).join('')}
        </select>
      </div>

      <!-- Subsector -->
      <div class="prueba-fg">
        <label class="prueba-lbl">Subsector</label>
        <select class="fsel" id="pr-sub" style="width:100%">
          <option value="">All</option>
        </select>
      </div>

      <!-- Return year -->
      <div class="prueba-fg">
        <label class="prueba-lbl">Return Year</label>
        <select class="fsel" id="pr-ryear" style="width:100%">
          <option value="">Any year</option>
          <option value="r26">2026 YTD</option>
          <option value="r25">2025</option>
          <option value="r24">2024</option>
          <option value="r23">2023</option>
          <option value="r22">2022</option>
          <option value="c3">3yr Cumulative</option>
        </select>
      </div>

      <!-- Return min -->
      <div class="prueba-fg prueba-fg--sm">
        <label class="prueba-lbl">Min Return (%)</label>
        <input class="prueba-inp" type="number" id="pr-rmin" placeholder="e.g. 10">
      </div>

      <!-- Return max -->
      <div class="prueba-fg prueba-fg--sm">
        <label class="prueba-lbl">Max Return (%)</label>
        <input class="prueba-inp" type="number" id="pr-rmax" placeholder="e.g. 100">
      </div>

      <!-- Buttons -->
      <div class="prueba-fg prueba-fg--btn">
        <button class="prueba-clear" id="pr-clear">Clear</button>
      </div>
    </div>

    <!-- Placeholder filters (coming soon) -->
    <div class="prueba-coming">
      <span class="prueba-chip prueba-chip--soon">P/E</span>
      <span class="prueba-chip prueba-chip--soon">EV/EBITDA</span>
      <span class="prueba-chip prueba-chip--soon">P/S</span>
      <span class="prueba-chip prueba-chip--soon">Price</span>
      <span class="prueba-chip prueba-chip--soon">Volatility</span>
      <span class="prueba-chip prueba-chip--soon">DCF Upside</span>
      <span class="prueba-soon-lbl">Coming soon — Summit Financial Data</span>
    </div>
  </div>

  <!-- ── Results ── -->
  <div class="sechdr" style="margin-bottom:10px">
    <span class="sect">Results</span>
    <span class="secn" id="pr-count">—</span>
  </div>
  <div class="card" style="padding:0">
    <div class="twrap">
      <table class="dt" id="pr-tbl">
        <thead><tr>
          <th class="pr-th" data-col="t">Ticker</th>
          <th class="pr-th" data-col="n">Company</th>
          <th class="pr-th" data-col="s">Sector</th>
          <th class="pr-th" data-col="i">Subsector</th>
          <th class="pr-th pr-num" data-col="r22">2022</th>
          <th class="pr-th pr-num" data-col="r23">2023</th>
          <th class="pr-th pr-num" data-col="r24">2024</th>
          <th class="pr-th pr-num" data-col="r25">2025</th>
          <th class="pr-th pr-num" data-col="r26">2026 YTD</th>
          <th class="pr-th pr-num" data-col="c3">3yr Cumul.</th>
          <th class="pr-th pr-num pr-soon" title="Coming soon">P/E</th>
          <th class="pr-th pr-num pr-soon" title="Coming soon">EV/EBITDA</th>
          <th class="pr-th pr-num pr-soon" title="Coming soon">Price</th>
          <th class="pr-th pr-num pr-soon" title="Coming soon">Volatility</th>
        </tr></thead>
        <tbody id="pr-body"></tbody>
      </table>
    </div>
  </div>
</div>`;
}

function bindEvents() {
  document.getElementById('pr-sector').addEventListener('change', onSectorChange);
  document.getElementById('pr-sub').addEventListener('change', applyFilters);
  document.getElementById('pr-ryear').addEventListener('change', applyFilters);
  document.getElementById('pr-rmin').addEventListener('input', applyFilters);
  document.getElementById('pr-rmax').addEventListener('input', applyFilters);
  document.getElementById('pr-clear').addEventListener('click', clearFilters);

  document.getElementById('pr-tbl').querySelector('thead').addEventListener('click', e => {
    const th = e.target.closest('.pr-th');
    if (!th || !th.dataset.col) return;
    const col = th.dataset.col;
    if (_sortCol === col) _sortDir *= -1;
    else { _sortCol = col; _sortDir = -1; }
    renderTable();
  });
}

function onSectorChange() {
  const sec = document.getElementById('pr-sector').value;
  const subEl = document.getElementById('pr-sub');
  const subs = sec
    ? [...new Set(ALL_STOCKS.filter(s => s.s === sec).map(s => s.i))].sort()
    : [];
  subEl.innerHTML = '<option value="">Todos</option>' + subs.map(s => `<option>${s}</option>`).join('');
  applyFilters();
}

function applyFilters() {
  const sec   = document.getElementById('pr-sector').value;
  const sub   = document.getElementById('pr-sub').value;
  const ryear = document.getElementById('pr-ryear').value;
  const rmin  = parseFloat(document.getElementById('pr-rmin').value);
  const rmax  = parseFloat(document.getElementById('pr-rmax').value);

  _filtered = ALL_STOCKS.filter(s => {
    if (sec && s.s !== sec) return false;
    if (sub && s.i !== sub) return false;
    if (ryear) {
      const v = s[ryear];
      if (!isNaN(rmin) && v < rmin) return false;
      if (!isNaN(rmax) && v > rmax) return false;
    }
    return true;
  });

  renderTable();
}

function clearFilters() {
  document.getElementById('pr-sector').value = '';
  document.getElementById('pr-sub').innerHTML = '<option value="">Todos</option>';
  document.getElementById('pr-ryear').value = '';
  document.getElementById('pr-rmin').value = '';
  document.getElementById('pr-rmax').value = '';
  applyFilters();
}

function renderTable() {
  const numCols = new Set(['r22','r23','r24','r25','r26','c3']);
  const sorted = [..._filtered].sort((a, b) => {
    const av = a[_sortCol] ?? '';
    const bv = b[_sortCol] ?? '';
    if (typeof av === 'number') return (av - bv) * _sortDir;
    return String(av).localeCompare(String(bv)) * _sortDir;
  });

  const count = sorted.length;
  document.getElementById('pr-count').textContent =
    `${count} ${count !== 1 ? 'companies' : 'company'} found`;

  // Update sort indicators
  document.querySelectorAll('.pr-th').forEach(th => {
    const col = th.dataset.col;
    const arrow = col === _sortCol ? (_sortDir === -1 ? ' ▼' : ' ▲') : '';
    th.textContent = th.textContent.replace(/ [▼▲]$/, '') + arrow;
  });

  const body = document.getElementById('pr-body');
  if (!sorted.length) {
    body.innerHTML = `<tr><td colspan="14" style="text-align:center;padding:32px;color:var(--mu);font-size:13px">No companies match the selected filters</td></tr>`;
    return;
  }

  body.innerHTML = sorted.map(s => {
    const fmt = v => v == null ? '—' : (v > 0 ? `+${v.toFixed(1)}%` : `${v.toFixed(1)}%`);
    const cls = v => v == null ? '' : v > 0 ? 'pos' : v < 0 ? 'neg' : '';
    return `<tr>
      <td><strong>${s.t}</strong></td>
      <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.n}</td>
      <td>${s.s}</td>
      <td style="color:var(--mu);font-size:11.5px">${s.i}</td>
      <td class="pr-num ${cls(s.r22)}">${fmt(s.r22)}</td>
      <td class="pr-num ${cls(s.r23)}">${fmt(s.r23)}</td>
      <td class="pr-num ${cls(s.r24)}">${fmt(s.r24)}</td>
      <td class="pr-num ${cls(s.r25)}">${fmt(s.r25)}</td>
      <td class="pr-num ${cls(s.r26)}">${fmt(s.r26)}</td>
      <td class="pr-num ${cls(s.c3)}">${fmt(s.c3)}</td>
      <td class="pr-num pr-soon">—</td>
      <td class="pr-num pr-soon">—</td>
      <td class="pr-num pr-soon">—</td>
      <td class="pr-num pr-soon">—</td>
    </tr>`;
  }).join('');
}
