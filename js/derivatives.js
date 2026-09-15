// Derivatives tab — the shell that holds the four option strategies.
//
// They are two questions crossed: is this stock one we OWN or one we WANT, and are
// we being PAID the premium or PAYING it?
//
//                          paid the premium        paying the premium
//   stock you own          Covered Calls           Protective Put
//   stock you want         Short Puts              Buy Calls
//
// Each pane is its own module with its own live chain, and each is built the first
// time it is opened — four option chains on a tab nobody has scrolled to would be
// four wasted round trips through the Massive proxy. They all read the same
// forward estimates (js/options-data.js) through the same engine
// (js/options-core.js), so a multiple means the same thing in all four.

import { loadCoveredCallsPage } from './covered-calls.js';
import { loadProtectivePutPage } from './protective-put.js';
import { loadBuyCallsPage } from './buy-calls.js';
import { loadShortPutsPage } from './short-puts.js';

const PANES = [
  { id: 'covered-calls',  label: 'Covered Calls',  load: loadCoveredCallsPage },
  { id: 'protective-put', label: 'Protective Put', load: loadProtectivePutPage },
  { id: 'buy-calls',      label: 'Buy Calls',      load: loadBuyCallsPage },
  { id: 'short-puts',     label: 'Short Puts',     load: loadShortPutsPage },
];

const _loaded = new Set();

function show(sub) {
  document.querySelectorAll('#tp-der .der-pill').forEach((p) => p.classList.toggle('active', p.dataset.sub === sub));
  document.querySelectorAll('#tp-der .der-sub').forEach((s) => s.classList.toggle('active', s.id === `der-${sub}`));
  const pane = PANES.find((p) => p.id === sub);
  if (pane && !_loaded.has(sub)) {
    _loaded.add(sub);
    // The loaders fetch live chains; a rejection must not take the tab down with it.
    Promise.resolve().then(pane.load).catch((e) => {
      console.error('[Derivatives] failed to load', sub, e);
      const el = document.getElementById(`der-${sub}`);
      if (el) el.innerHTML = `<div class="der-err">Could not load ${pane.label}: ${e && e.message ? e.message : e}</div>`;
    });
  }
}

let _inited = false;
export function loadDerivativesPage() {
  if (_inited) return;
  _inited = true;
  document.querySelectorAll('#tp-der .der-pill').forEach((p) => {
    p.addEventListener('click', () => show(p.dataset.sub));
  });
  show('covered-calls');
}
