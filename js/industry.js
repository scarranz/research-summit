// Industry Analysis tab — a portal-level hub for industry-wide analyses.
//
// Each industry can present differently:
//   • Semiconductors — the interactive supply-chain map (semi-industry.js), rendered
//     inside an isolated <iframe> (industry-embed.html) so its module state can't
//     collide with the same map embedded in a company profile (e.g. NVIDIA).
//   • Payments — the Visa/Mastercard moat & threat analysis (payments-industry.js),
//     pure presentation + Chart.js, rendered in-document (no isolation needed).
//
// The pill selector switches between them; adding another industry = a new option
// here + its renderer.

const INDUSTRIES = [
  { id: 'semiconductors', label: 'Semiconductors', ready: true },
  { id: 'payments',       label: 'Payments',       ready: true },
  { id: 'robotics',       label: 'Robotics',        ready: true },
  { id: 'hyperscalers',   label: 'Hyperscalers',    ready: true },
];

// iframe-isolated industries → their standalone host page. Everything listed in
// INLINE below renders in-document instead (see showIndustry).
const IFRAME_SRC = {
  semiconductors: 'industry-embed.html?industry=semiconductors',
  robotics: 'robotics-industry.html',
};

// In-document industries: pure presentation + Chart.js, no module state that can
// collide with a company profile, so they need no iframe. Each lazily imports its
// module and mounts it into its own pane.
const INLINE = {
  payments:     { pane: 'ind-payments',     load: () => import('./overviews/payments-industry.js').then(m => m.paymentsIndustry) },
  hyperscalers: { pane: 'ind-hyperscalers', load: () => import('./overviews/hyperscalers-industry.js').then(m => m.hyperscalersIndustry) },
};

let _wired = false;
const _loaded = {};

export function loadIndustryPage() {
  const root = document.getElementById('ind-root');
  if (!root) return;

  const pills = INDUSTRIES.map((ind, i) =>
    '<button type="button" class="ind-pill' + (i === 0 ? ' active' : '') + '"' +
      (ind.ready ? '' : ' disabled') + ' data-ind="' + ind.id + '">' +
      ind.label + (ind.ready ? '' : ' · soon') + '</button>'
  ).join('');

  root.innerHTML =
    '<div class="ind-wrap">' +
      '<div class="ind-head">' +
        '<h2 class="ind-title">Industry Analysis</h2>' +
        '<p class="ind-sub">Interactive, industry-wide analyses — supply-chain maps, competitive ' +
          'structure and threat frameworks. Some maps also appear inside individual company ' +
          'profiles, pre-focused to that company.</p>' +
        '<div class="ind-pills">' + pills +
          '<span class="ind-soon">More industries coming soon</span>' +
        '</div>' +
      '</div>' +
      '<div id="ind-content">' +
        '<iframe id="ind-frame" class="ind-frame" title="Industry supply-chain map" ' +
          'src="industry-embed.html?industry=semiconductors"></iframe>' +
        Object.keys(INLINE).map((k) => '<div id="' + INLINE[k].pane + '" hidden></div>').join('') +
      '</div>' +
    '</div>';

  if (_wired) return;
  _wired = true;
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('.ind-pill');
    if (!btn || btn.disabled) return;
    root.querySelectorAll('.ind-pill').forEach((b) => b.classList.toggle('active', b === btn));
    showIndustry(btn.dataset.ind);
  });
}

async function showIndustry(id) {
  const frame = document.getElementById('ind-frame');
  // Hide every inline pane first, then reveal the selected one (if any).
  Object.keys(INLINE).forEach((k) => {
    const el = document.getElementById(INLINE[k].pane);
    if (el) el.hidden = k !== id;
  });

  if (INLINE[id]) {
    if (frame) frame.hidden = true;
    const el = document.getElementById(INLINE[id].pane);
    if (el && !_loaded[id]) {
      _loaded[id] = true;
      const mod = await INLINE[id].load();
      el.innerHTML = mod.html();
      // Charts need a laid-out, visible canvas (offsetParent non-null) before build.
      requestAnimationFrame(() => mod.init());
    }
    return;
  }

  // iframe-isolated industries (semiconductors, robotics) share one <iframe>;
  // swap its src lazily, only when the selection actually changes.
  if (frame) {
    const src = IFRAME_SRC[id];
    if (src && !frame.getAttribute('src').includes(src)) frame.setAttribute('src', src);
    frame.hidden = false;
  }
}
