// Tools ▸ Betas — the shell. Three sub-tabs:
//   • Calculator — the beta of any name, with every variable exposed; "Submit" records
//                  the chosen beta with its method and statistics (js/betas-calc.js).
//   • History    — every submitted beta, filterable by ticker, exportable to CSV
//                  (js/betas-history.js).
//   • Portfolio  — a portfolio beta from manually entered weights, using each name's
//                  latest submitted beta (js/betas-portfolio.js).
// All three run on js/betas-core.js (prices, regression, the beta history store).

import { loadBetasCalc, openTicker } from './betas-calc.js';
import { loadBetasHistory, filterHistory } from './betas-history.js';
import { loadBetasPortfolio } from './betas-portfolio.js';
import { registerCalcOpener } from './betas-core.js';

const PANES = [
  { id: 'calc',      label: 'Calculator', load: (el) => loadBetasCalc(el, goto) },
  { id: 'history',   label: 'History',    load: loadBetasHistory },
  { id: 'portfolio', label: 'Portfolio',  load: loadBetasPortfolio },
];
const _loaded = new Set();

function show(sub) {
  document.querySelectorAll('#tp-betas .bt-pill').forEach((p) => p.classList.toggle('active', p.dataset.sub === sub));
  document.querySelectorAll('#tp-betas .bt-sub').forEach((s) => s.classList.toggle('active', s.id === `bt-${sub}`));
  const pane = PANES.find((p) => p.id === sub);
  if (pane && !_loaded.has(sub)) {
    _loaded.add(sub);
    const el = document.getElementById(`bt-${sub}`);
    Promise.resolve().then(() => pane.load(el)).catch((e) => {
      console.error('[Betas] failed to load', sub, e);
      el.innerHTML = `<div class="bt-err">Could not load ${pane.label}: ${e && e.message ? e.message : e}</div>`;
    });
  }
}

// Cross-pane jump, e.g. the Calculator's "History" link filtered to its ticker.
function goto(sub, ticker) {
  show(sub);
  if (sub === 'history' && ticker) Promise.resolve().then(() => filterHistory(ticker));
}

let _inited = false;
export function loadBetasPage() {
  if (_inited) return;
  _inited = true;
  document.querySelectorAll('#tp-betas .bt-pill').forEach((p) => {
    p.addEventListener('click', () => show(p.dataset.sub));
  });
  registerCalcOpener((t, rec) => { show('calc'); openTicker(t, rec); });
  show('calc');
}
