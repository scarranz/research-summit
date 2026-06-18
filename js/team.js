// ═══ Portfolio Table ══════════════════════════════════════════
const PORT_LS_KEY = 'summit-portfolio-pts';
const PORT_PEOPLE = ['daa', 'sab', 'pvg'];
const PORT_FIELDS = ['apr', 'aug', 'dec-ret', 'dec-rr'];

function initPortfolioTable() {
  const saved = JSON.parse(localStorage.getItem(PORT_LS_KEY) || '{}');
  document.querySelectorAll('.port-input').forEach(input => {
    const key = input.dataset.key;
    if (saved[key] !== undefined && saved[key] !== '') input.value = saved[key];
    input.addEventListener('input', () => {
      saved[key] = input.value;
      localStorage.setItem(PORT_LS_KEY, JSON.stringify(saved));
      updatePortTotal(key.split('-')[0], saved);
    });
  });
  PORT_PEOPLE.forEach(p => updatePortTotal(p, saved));
}

function updatePortTotal(person, saved) {
  let total = 0, hasAny = false;
  PORT_FIELDS.forEach(f => {
    const val = parseFloat(saved[`${person}-${f}`]);
    if (!isNaN(val)) { total += val; hasAny = true; }
  });
  const el = document.getElementById(`pt-${person}`);
  if (el) el.textContent = hasAny ? (Number.isInteger(total) ? total : total.toFixed(1)) : '—';
}

// ═══ Investment Ideas ═════════════════════════════════════════
const II_CATS = ['Thesis', 'Valuation', 'Risk', 'Conviction', 'Presentation'];
const II_SECTORS = ['Fintech', 'Tech', 'Consumer', 'Industrials', 'Healthcare', 'Energy', 'Other'];
const II_ALL_ANALYSTS = ['DA', 'DG', 'LC', 'PV', 'SA'];

let iiCurSession = 0;
let iiExpandedCard = null, iiExpandedAnalyst = null;
let iiInactiveAnalysts = new Set();
let iiNewSessionAnalysts = new Set(['DA', 'LC', 'PV', 'SA']);
let iiNewCompanyPresenter = null;
let iiNewCompanySector = 'Fintech';
let iiEditingSessionIdx = null;

const II_SESSIONS = [
  {
    id: 's1', label: 'Feb 2026', date: 'Feb 18, 2026',
    analysts: ['DA', 'DG', 'LC', 'PV', 'SA'],
    companies: [
      {
        ticker: 'ARCO', name: 'Arcos Dorados Holdings', sector: 'Consumer', presenters: ['DG', 'PV'],
        desc: 'Exclusive master franchisee of McDonald\'s in Latin America. Operates more than 2,300 restaurants across 20 countries.',
        price0: 8.94, priceN: 8.07,
        votes: { DA: { Thesis: 1, Valuation: 1, Risk: 0, Conviction: 1, Presentation: 2, comment: '' }, DG: null, LC: { Thesis: 1, Valuation: 1, Risk: 2, Conviction: 0, Presentation: 2, comment: '' }, PV: null, SA: { Thesis: 0, Valuation: 1, Risk: 1, Conviction: 0, Presentation: 2, comment: '' } }
      },
      {
        ticker: 'SEZL', name: 'Sezzle Inc.', sector: 'Fintech', presenters: ['LC', 'SA'],
        desc: 'BNPL platform in the U.S. and Canada connecting consumers and merchants with point-of-sale credit.',
        price0: 84.70, priceN: 66.15,
        votes: { DA: { Thesis: 1, Valuation: 1, Risk: 1, Conviction: 1, Presentation: 2, comment: '' }, DG: { Thesis: 1, Valuation: 1, Risk: 1, Conviction: 2, Presentation: 3, comment: '' }, LC: null, PV: { Thesis: 1, Valuation: 1, Risk: -1, Conviction: 2, Presentation: 2, comment: '' }, SA: null }
      },
      {
        ticker: 'RELY', name: 'Remitly Global Inc.', sector: 'Fintech', presenters: ['DA'],
        desc: 'Digital international remittance platform serving more than 170 countries with competitive rates.',
        price0: 13.27, priceN: 20.80,
        votes: { DA: null, DG: { Thesis: 3, Valuation: 3, Risk: 1, Conviction: 3, Presentation: 3, comment: '' }, LC: { Thesis: 2, Valuation: 2, Risk: 1, Conviction: 2, Presentation: 2, comment: '' }, PV: { Thesis: 2, Valuation: 3, Risk: 2, Conviction: 3, Presentation: 3, comment: '' }, SA: { Thesis: 2, Valuation: 3, Risk: 0, Conviction: 1, Presentation: 3, comment: '' } }
      },
    ]
  },
  {
    id: 's2', label: 'Mar 2026', date: 'Mar 31, 2026',
    analysts: ['DA', 'LC', 'PV', 'SA'],
    companies: [
      {
        ticker: 'PAYS', name: 'Paysign Inc.', sector: 'Fintech', presenters: ['DA'],
        desc: 'Prepaid payment solutions for the biopharmaceutical, casino, and corporate benefits sectors in the U.S.',
        price0: null, priceN: null,
        votes: { DA: null, LC: { Thesis: 2, Valuation: 2, Risk: 1, Conviction: 2, Presentation: 1, comment: 'Really likes it; sees added value in the integration with insurance companies.' }, PV: { Thesis: 1, Valuation: 2, Risk: -1, Conviction: 2, Presentation: 1, comment: 'Not convinced by the business model. Sees few barriers to entry.' }, SA: { Thesis: 1, Valuation: 1, Risk: -1, Conviction: 2, Presentation: 2, comment: 'Couldn\'t fully land the idea. High risk in the insurance and plasma segments.' } }
      },
      {
        ticker: 'TOST', name: 'Toast Inc.', sector: 'Tech', presenters: ['LC'],
        desc: 'Comprehensive management platform for restaurants: POS, payments, payroll, and analytics.',
        price0: null, priceN: null,
        votes: { DA: { Thesis: 1, Valuation: 1, Risk: 1, Conviction: 1, Presentation: 2, comment: 'Missing TAM context and multiple support. Concerned about competitors.' }, LC: null, PV: { Thesis: 1, Valuation: 1, Risk: 1, Conviction: 2, Presentation: 2, comment: 'Needs to better understand the DCF. Risk 1 due to many alternatives.' }, SA: { Thesis: 2, Valuation: 2, Risk: 1, Conviction: 2, Presentation: 2, comment: 'Wants to better understand the TAM and top-line growth.' } }
      },
      {
        ticker: 'SE', name: 'Sea Limited', sector: 'Tech', presenters: ['PV'],
        desc: 'Leading technology conglomerate in Southeast Asia: Garena, Shopee, and SeaMoney.',
        price0: null, priceN: null,
        votes: { DA: { Thesis: 1, Valuation: 2, Risk: 1, Conviction: 1, Presentation: 2, comment: 'Attractive valuation given expansion potential and growth.' }, LC: { Thesis: 2, Valuation: 2, Risk: 0, Conviction: 2, Presentation: 2, comment: 'Considers it cheap vs. peers. Generally likes it.' }, PV: null, SA: { Thesis: 1, Valuation: 3, Risk: 1, Conviction: 0, Presentation: 2, comment: 'Really likes Southeast Asia. Thesis needs more support.' } }
      },
      {
        ticker: 'APH', name: 'Amphenol Corporation', sector: 'Industrials', presenters: ['SA'],
        desc: 'Leading manufacturer of electrical and fiber optic connectors for defense, automotive, and datacenters.',
        price0: null, priceN: null,
        votes: { DA: { Thesis: 2, Valuation: 1, Risk: 1, Conviction: 2, Presentation: 3, comment: 'Good management but sees risk of another capital allocator entering the space.' }, LC: { Thesis: 3, Valuation: 2, Risk: 1, Conviction: 2, Presentation: 3, comment: 'Sees risk in product specialization vs. competition.' }, PV: { Thesis: 2, Valuation: 1, Risk: 1, Conviction: 2, Presentation: 3, comment: 'Needs to better understand M&A strategy and acquisition risk.' }, SA: null }
      },
    ]
  }
];

// ── Helpers ───────────────────────────────────────────────────
function iiGetSub(c, a) {
  if (!c.votes[a]) return 0;
  return II_CATS.reduce((s, cat) => s + (c.votes[a][cat] || 0), 0);
}
function iiGetTotal(c, sess) {
  return sess.analysts
    .filter(a => !iiInactiveAnalysts.has(a) && !c.presenters.includes(a) && c.votes[a])
    .reduce((s, a) => s + iiGetSub(c, a), 0);
}
function iiCatAvg(c, cat, sess) {
  const voters = sess.analysts.filter(a => !iiInactiveAnalysts.has(a) && !c.presenters.includes(a) && c.votes[a]);
  if (!voters.length) return 0;
  return voters.reduce((s, a) => s + (c.votes[a][cat] || 0), 0) / voters.length;
}
function iiHasVotes(c, sess) {
  return sess.analysts.some(a => !c.presenters.includes(a) && c.votes[a]);
}

// ── Global functions (called from onclick in generated HTML) ──
window.iiTab = function (pane) {
  document.querySelectorAll('.ii-tab').forEach(t => t.classList.toggle('active', t.dataset.pane === pane));
  document.querySelectorAll('.ii-pane').forEach(p => { p.style.display = p.dataset.pane === pane ? '' : 'none'; });
  if (pane === 'analysts') iiRenderAnalysts();
};

window.iiSetVote = function (sessId, ticker, analyst, cat, score) {
  const sess = II_SESSIONS.find(s => s.id === sessId);
  const c = sess.companies.find(x => x.ticker === ticker);
  if (!c.votes[analyst]) c.votes[analyst] = { Thesis: 0, Valuation: 0, Risk: 0, Conviction: 0, Presentation: 0, comment: '' };
  c.votes[analyst][cat] = score;
  iiExpandedCard = sess.companies.indexOf(c);
  iiCurSession = II_SESSIONS.indexOf(sess);
  iiRenderCompanies();
};

window.iiSetComment = function (sessId, ticker, analyst, val) {
  const sess = II_SESSIONS.find(s => s.id === sessId);
  const c = sess.companies.find(x => x.ticker === ticker);
  if (!c.votes[analyst]) c.votes[analyst] = { Thesis: 0, Valuation: 0, Risk: 0, Conviction: 0, Presentation: 0, comment: '' };
  c.votes[analyst].comment = val;
};

window.iiCollapseCard = function () { iiExpandedCard = null; iiRenderCompanies(); };
window.iiToggleAnalystExpand = function (a) { iiExpandedAnalyst = iiExpandedAnalyst === a ? null : a; iiRenderAnalysts(); };

window.iiToggleAnalyst = function (a) {
  if (iiInactiveAnalysts.has(a)) iiInactiveAnalysts.delete(a);
  else iiInactiveAnalysts.add(a);
  iiRenderAnalysts();
  iiRenderCompanies();
  iiRenderSb();
};

window.iiCloseModal = function (id) {
  document.getElementById(id).style.display = 'none';
};

window.iiOpenNewSession = function () {
  iiEditingSessionIdx = null;
  iiNewSessionAnalysts = new Set(['DA', 'LC', 'PV', 'SA']);
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('ii-newSessionDate').value = today;
  document.getElementById('ii-sessionModalTitle').textContent = 'New session';
  document.getElementById('ii-sessionModalSave').textContent = 'Create session';
  iiRenderSessionAnalystPills();
  document.getElementById('ii-newSessionModal').style.display = 'flex';
};

window.iiOpenEditSession = function (i) {
  iiEditingSessionIdx = i;
  const sess = II_SESSIONS[i];
  iiNewSessionAnalysts = new Set(sess.analysts);
  // Parse date back to YYYY-MM-DD
  const months = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11 };
  const parts = sess.date.toLowerCase().replace('.','').split(' ');
  let dateVal = '';
  if (parts.length === 3) {
    const d = parts[0].padStart(2,'0');
    const m = String((months[parts[1]] ?? 0) + 1).padStart(2,'0');
    const y = parts[2];
    dateVal = `${y}-${m}-${d}`;
  }
  document.getElementById('ii-newSessionDate').value = dateVal;
  document.getElementById('ii-sessionModalTitle').textContent = 'Edit session';
  document.getElementById('ii-sessionModalSave').textContent = 'Save changes';
  iiRenderSessionAnalystPills();
  document.getElementById('ii-newSessionModal').style.display = 'flex';
};

window.iiDeleteSession = function (i) {
  if (II_SESSIONS.length === 1) { alert('You cannot delete the only session.'); return; }
  if (!confirm(`Delete session "${II_SESSIONS[i].label}"? This action cannot be undone.`)) return;
  II_SESSIONS.splice(i, 1);
  if (iiCurSession >= II_SESSIONS.length) iiCurSession = II_SESSIONS.length - 1;
  iiExpandedCard = null;
  iiRenderSessionNav();
  iiRenderCompanies();
};

function iiRenderSessionAnalystPills() {
  const pills = document.getElementById('ii-newSessionAnalysts');
  pills.innerHTML = '';
  II_ALL_ANALYSTS.forEach(a => {
    const b = document.createElement('button');
    b.className = 'ii-pill-sel' + (iiNewSessionAnalysts.has(a) ? ' on' : '');
    b.textContent = a;
    b.onclick = () => {
      if (iiNewSessionAnalysts.has(a)) iiNewSessionAnalysts.delete(a);
      else iiNewSessionAnalysts.add(a);
      b.className = 'ii-pill-sel' + (iiNewSessionAnalysts.has(a) ? ' on' : '');
    };
    pills.appendChild(b);
  });
}

window.iiConfirmNewSession = function () {
  const d = document.getElementById('ii-newSessionDate').value;
  if (!d || !iiNewSessionAnalysts.size) return;
  const dt = new Date(d + 'T12:00:00');
  const label = dt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const dateStr = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  if (iiEditingSessionIdx !== null) {
    const sess = II_SESSIONS[iiEditingSessionIdx];
    sess.label = label;
    sess.date = dateStr;
    sess.analysts = [...iiNewSessionAnalysts];
  } else {
    II_SESSIONS.push({ id: 's' + Date.now(), label, date: dateStr, analysts: [...iiNewSessionAnalysts], companies: [] });
    iiCurSession = II_SESSIONS.length - 1;
  }
  window.iiCloseModal('ii-newSessionModal');
  iiRenderSessionNav();
  iiRenderCompanies();
};

window.iiOpenNewCompany = function () {
  iiNewCompanyPresenter = null; iiNewCompanySector = 'Fintech';
  ['ii-newTicker', 'ii-newName', 'ii-newDesc', 'ii-newPrice'].forEach(id => { document.getElementById(id).value = ''; });
  const sess = II_SESSIONS[iiCurSession];
  const pPills = document.getElementById('ii-presenterPills');
  pPills.innerHTML = '';
  sess.analysts.forEach(a => {
    const b = document.createElement('button');
    b.className = 'ii-pill-sel' + (iiNewCompanyPresenter === a ? ' on' : '');
    b.textContent = a;
    b.onclick = () => {
      iiNewCompanyPresenter = a;
      pPills.querySelectorAll('.ii-pill-sel').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
    };
    pPills.appendChild(b);
  });
  const sPills = document.getElementById('ii-sectorPills');
  sPills.innerHTML = '';
  II_SECTORS.forEach(s => {
    const b = document.createElement('button');
    b.className = 'ii-pill-sel' + (iiNewCompanySector === s ? ' on' : '');
    b.textContent = s;
    b.onclick = () => {
      iiNewCompanySector = s;
      sPills.querySelectorAll('.ii-pill-sel').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
    };
    sPills.appendChild(b);
  });
  document.getElementById('ii-newCompanyModal').style.display = 'flex';
};

window.iiConfirmNewCompany = function () {
  const ticker = document.getElementById('ii-newTicker').value.toUpperCase().trim();
  const name = document.getElementById('ii-newName').value.trim();
  if (!ticker || !name || !iiNewCompanyPresenter) return;
  const sess = II_SESSIONS[iiCurSession];
  const votes = {};
  sess.analysts.forEach(a => { votes[a] = null; });
  const price0 = parseFloat(document.getElementById('ii-newPrice').value) || null;
  sess.companies.push({
    ticker, name, sector: iiNewCompanySector, presenters: [iiNewCompanyPresenter],
    desc: document.getElementById('ii-newDesc').value.trim(), price0, priceN: price0, votes
  });
  window.iiCloseModal('ii-newCompanyModal');
  iiRenderCompanies();
};

// ── Render: Session nav ───────────────────────────────────────
function iiRenderSessionNav() {
  const nav = document.getElementById('ii-sessionNav');
  if (!nav) return;
  nav.innerHTML = '';
  II_SESSIONS.forEach((s, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'ii-pill-wrap';
    const b = document.createElement('button');
    b.className = 'ii-pill' + (i === iiCurSession ? ' active' : '');
    b.textContent = s.label;
    b.onclick = () => { iiCurSession = i; iiExpandedCard = null; iiRenderSessionNav(); iiRenderCompanies(); };
    const actions = document.createElement('div');
    actions.className = 'ii-pill-actions';
    const editBtn = document.createElement('button');
    editBtn.className = 'ii-pill-action';
    editBtn.title = 'Edit session';
    editBtn.textContent = '✎';
    editBtn.onclick = (e) => { e.stopPropagation(); window.iiOpenEditSession(i); };
    const delBtn = document.createElement('button');
    delBtn.className = 'ii-pill-action del';
    delBtn.title = 'Delete session';
    delBtn.textContent = '×';
    delBtn.onclick = (e) => { e.stopPropagation(); window.iiDeleteSession(i); };
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    wrap.appendChild(b);
    wrap.appendChild(actions);
    nav.appendChild(wrap);
  });
  const nb = document.createElement('button');
  nb.className = 'ii-pill ii-pill-new';
  nb.textContent = '+ New session';
  nb.onclick = () => window.iiOpenNewSession();
  nav.appendChild(nb);
}

// ── Render: Companies grid ────────────────────────────────────
function iiRenderCompanies() {
  const sess = II_SESSIONS[iiCurSession];
  const lbl = document.getElementById('ii-sessionLabel');
  if (lbl) lbl.textContent = 'Session — ' + sess.date;
  const grid = document.getElementById('ii-companiesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  sess.companies.forEach((c, ci) => {
    const isExp = iiExpandedCard === ci;
    const hv = iiHasVotes(c, sess);
    const total = iiGetTotal(c, sess);
    const pending = sess.analysts.filter(a => !iiInactiveAnalysts.has(a) && !c.presenters.includes(a) && !c.votes[a]);

    const div = document.createElement('div');
    div.className = 'ii-co-card' + (isExp ? ' expanded' : ' clickable');
    if (!isExp) div.onclick = () => { iiExpandedCard = ci; iiRenderCompanies(); };

    const miniBars = hv ? II_CATS.map(cat => {
      const avg = iiCatAvg(c, cat, sess);
      const w = avg <= 0 ? 0 : Math.min(100, (avg / 3) * 100);
      return `<div class="ii-mb-row"><span class="ii-mb-lbl">${cat}</span><div class="ii-mb-wrap"><div class="ii-mb-fill ii-mb-${cat}" style="width:${w}%"></div></div><span class="ii-mb-val">${avg.toFixed(1)}</span></div>`;
    }).join('') : '<span style="font-size:10px;color:var(--mu)">No votes yet</span>';

    let detailHtml = '';
    if (isExp) {
      const voteRows = sess.analysts.map(a => {
        const isP = c.presenters.includes(a);
        const off = iiInactiveAnalysts.has(a);
        const v = c.votes[a];
        if (isP) return `<tr style="${off ? 'opacity:.4' : ''}"><td class="ii-name-cell">${a}</td><td colspan="5" style="font-size:10px;color:var(--steel);font-style:italic;padding:5px 6px">presenter</td><td></td></tr>`;
        const catCells = II_CATS.map(cat => {
          const cur = v ? v[cat] : null;
          const btns = [-1, 0, 1, 2, 3].map(sc => {
            let cls = 'ii-sb';
            if (cur === sc) cls += sc < 0 ? ' s-neg' : sc === 0 ? ' s-0' : ' s-pos';
            return `<button class="${cls}" onclick="event.stopPropagation();iiSetVote('${sess.id}','${c.ticker}','${a}','${cat}',${sc})"${off ? ' disabled' : ''} style="${off ? 'opacity:.4' : ''}">${sc}</button>`;
          }).join('');
          return `<td style="padding:4px 6px"><div class="ii-score-btns">${btns}</div></td>`;
        }).join('');
        const rowTotal = v ? II_CATS.reduce((s, cat) => s + (v[cat] || 0), 0) : null;
        return `<tr style="${off ? 'opacity:.4' : ''}"><td class="ii-name-cell">${a}</td>${catCells}<td style="font-weight:600;color:var(--steel);padding:4px 6px;text-align:right">${rowTotal !== null ? rowTotal : '—'}</td></tr>`;
      }).join('');

      const commentRows = sess.analysts.filter(a => !c.presenters.includes(a)).map(a => {
        const off = iiInactiveAnalysts.has(a);
        const txt = c.votes[a]?.comment || '';
        return `<div style="${off ? 'opacity:.4' : ''}">
          <div style="font-size:9px;font-weight:600;color:var(--mu);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">${a}</div>
          <textarea class="ii-comment" placeholder="Comment from ${a}..." onchange="iiSetComment('${sess.id}','${c.ticker}','${a}',this.value)" onclick="event.stopPropagation()"${off ? ' disabled' : ''}>${txt}</textarea>
        </div>`;
      }).join('');

      let priceHtml = '';
      if (c.price0) {
        const diff = ((c.priceN - c.price0) / c.price0 * 100).toFixed(1);
        const pos = parseFloat(diff) >= 0;
        priceHtml = `<div>
          <div class="ii-sub-lbl">price</div>
          <div style="display:flex;gap:20px;font-size:11px;color:var(--mu);flex-wrap:wrap;margin-top:6px">
            <span>At presentation: <strong style="color:var(--text)">$${c.price0.toFixed(2)}</strong></span>
            <span>Today: <strong style="color:var(--text)">$${c.priceN.toFixed(2)}</strong> <span class="ii-pct ${pos ? 'pos' : 'neg'}">${pos ? '+' : ''}${diff}%</span></span>
          </div>
        </div>`;
      }

      detailHtml = `<div class="ii-co-detail" onclick="event.stopPropagation()">
        <p style="font-size:11px;color:var(--mu);line-height:1.65">${c.desc}</p>
        <div>
          <div class="ii-sub-lbl">voting</div>
          <div style="overflow-x:auto;margin-top:8px">
            <table class="rt ii-vote-table">
              <thead><tr><th></th>${II_CATS.map(cat => `<th>${cat}</th>`).join('')}<th style="text-align:right">Total</th></tr></thead>
              <tbody>${voteRows}</tbody>
            </table>
          </div>
        </div>
        <div>
          <div class="ii-sub-lbl">comments</div>
          <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">${commentRows}</div>
        </div>
        ${priceHtml}
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px">
          ${pending.length ? `<span style="font-size:10px;color:var(--mu)">Pending: ${pending.join(', ')}</span>` : '<span></span>'}
          <button class="ii-btn-sm" onclick="event.stopPropagation();iiCollapseCard()">Cerrar</button>
        </div>
      </div>`;
    }

    div.innerHTML = `
      <div class="ii-co-header">
        <div>
          <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap">
            <span class="ii-ticker">${c.ticker}</span>
            <span class="ii-pres-badge">${c.presenters.join(' & ')}</span>
            ${pending.length && !isExp ? `<span class="ii-pending-badge">${pending.length} pendiente${pending.length > 1 ? 's' : ''}</span>` : ''}
          </div>
          <div class="ii-co-name">${c.name}</div>
        </div>
        <span class="ii-sector-pill ii-sp-${c.sector}">${c.sector}</span>
      </div>
      <div class="ii-co-scores">
        <div class="ii-score-big">${hv ? total : '—'}</div>
        <div class="ii-mini-bars">${miniBars}</div>
      </div>
      ${detailHtml}`;
    grid.appendChild(div);
  });

  const addBtn = document.createElement('div');
  addBtn.className = 'ii-add-card';
  addBtn.textContent = '+ Add company';
  addBtn.onclick = () => window.iiOpenNewCompany();
  grid.appendChild(addBtn);
}

// ── Render: Analysts ──────────────────────────────────────────
function iiRenderAnalysts() {
  const allA = [...new Set(II_SESSIONS.flatMap(s => s.analysts))];
  const el = document.getElementById('ii-analystCards');
  if (!el) return;
  el.innerHTML = '';
  allA.forEach(a => {
    const off = iiInactiveAnalysts.has(a);
    const isExp = iiExpandedAnalyst === a;
    const presented = [], voted = [];
    II_SESSIONS.forEach(s => s.companies.forEach(c => {
      if (c.presenters.includes(a)) presented.push({ ticker: c.ticker, name: c.name, total: iiGetTotal(c, s), session: s.label });
      else if (c.votes[a]) voted.push({ ticker: c.ticker, name: c.name, score: iiGetSub(c, a), session: s.label });
    }));
    const div = document.createElement('div');
    div.className = 'ii-analyst-card' + (off ? ' off' : '');
    const bodyHtml = `<div class="ii-ac-body${isExp ? ' open' : ''}">
      ${presented.length ? `<div>
        <div class="ii-sub-lbl" style="margin-bottom:6px">ideas presented</div>
        ${presented.map(x => `<div class="ii-hist-row">
          <div><div style="font-size:11px;font-weight:600">${x.ticker} <span style="font-size:9px;color:var(--mu)">${x.session}</span></div><div style="font-size:10px;color:var(--mu)">${x.name}</div></div>
          <div style="font-size:11px;color:var(--mu)">Group score: <span style="font-weight:600;color:var(--steel)">${x.total}</span></div>
        </div>`).join('')}
      </div>` : ''}
      ${voted.length ? `<div>
        <div class="ii-sub-lbl" style="margin-bottom:6px">ratings given</div>
        ${voted.map(x => `<div class="ii-hist-row">
          <div><div style="font-size:11px;font-weight:600">${x.ticker} <span style="font-size:9px;color:var(--mu)">${x.session}</span></div><div style="font-size:10px;color:var(--mu)">${x.name}</div></div>
          <span style="font-weight:600;color:var(--steel)">${x.score}</span>
        </div>`).join('')}
      </div>` : ''}
      ${!presented.length && !voted.length ? '<div style="font-size:11px;color:var(--mu)">No activity recorded</div>' : ''}
    </div>`;
    div.innerHTML = `
      <div class="ii-ac-header" onclick="iiToggleAnalystExpand('${a}')">
        <div class="ii-avatar ii-ava-${a}">${a}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:600;color:var(--text)">${a}</div>
          <div style="font-size:10px;color:var(--mu)">${presented.length} presented · ${voted.length} rated</div>
        </div>
        <button class="ii-btn-sm" onclick="event.stopPropagation();iiToggleAnalyst('${a}')">${off ? 'Show' : 'Hide'}</button>
        <span class="ii-chevron${isExp ? ' open' : ''}" style="margin-left:8px">▾</span>
      </div>
      ${bodyHtml}`;
    el.appendChild(div);
  });
}

// ── Init ──────────────────────────────────────────────────────
export function loadTeamPage() {
  initPortfolioTable();
  iiRenderSessionNav();
  iiRenderCompanies();
}
