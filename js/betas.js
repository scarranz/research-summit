// Tools ▸ Betas — the shell. Two sub-tabs:
//   • Calculadora — the beta of any name, with every variable exposed; the chosen
//                   beta is saved per name for the portfolio (js/betas-calc.js).
//   • Portafolio  — load a portfolio's beta-contribution export and play with
//                   allocations, option exposure and each name's beta
//                   (js/betas-portfolio.js).
// Both run on js/betas-core.js (prices, regression, the saved-beta store).

import { loadBetasCalc, openTicker } from './betas-calc.js';
import { loadBetasPortfolio } from './betas-portfolio.js';
import { registerCalcOpener } from './betas-core.js';

const PANES = [
  { id: 'calc',      label: 'Calculadora', load: loadBetasCalc },
  { id: 'portfolio', label: 'Portafolio',  load: loadBetasPortfolio },
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
      el.innerHTML = `<div class="bt-err">No se pudo cargar ${pane.label}: ${e && e.message ? e.message : e}</div>`;
    });
  }
}

let _inited = false;
export function loadBetasPage() {
  if (_inited) return;
  _inited = true;
  document.querySelectorAll('#tp-betas .bt-pill').forEach((p) => {
    p.addEventListener('click', () => show(p.dataset.sub));
  });
  registerCalcOpener((t) => { show('calc'); openTicker(t, true); });
  show('calc');
}
