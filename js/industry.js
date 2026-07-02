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
];

let _wired = false;
let _payLoaded = false;

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
        '<div id="ind-payments" hidden></div>' +
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
  const pay = document.getElementById('ind-payments');
  if (id === 'payments') {
    if (frame) frame.hidden = true;
    if (pay) {
      pay.hidden = false;
      if (!_payLoaded) {
        _payLoaded = true;
        const m = await import('./overviews/payments-industry.js');
        pay.innerHTML = m.paymentsIndustry.html();
        requestAnimationFrame(() => m.paymentsIndustry.init());
      }
    }
  } else {
    if (pay) pay.hidden = true;
    if (frame) frame.hidden = false;
  }
}
