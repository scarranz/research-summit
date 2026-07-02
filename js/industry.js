// Industry Analysis tab — a portal-level hub for cross-company, industry-wide
// supply-chain maps. The map itself (semi-industry.js) is rendered inside an
// isolated <iframe> (industry-embed.html) so its module-level state never collides
// with the same map embedded inside a company profile (e.g. NVIDIA's Industry tab).
//
// Structure is built to grow: an industry selector sits above the frame; today only
// Semiconductors exists. Adding another industry = a new option here + its dataset,
// then point the frame at industry-embed.html?industry=<name>.

const INDUSTRIES = [
  { id: 'semiconductors', label: 'Semiconductors', ready: true },
  // Add the next industry here once its map/dataset exists, e.g.:
  // { id: 'payments', label: 'Payments', ready: false },
];

let _wired = false;

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
        '<p class="ind-sub">Interactive supply-chain maps — explore who supplies whom across an industry, ' +
          'segment by segment, with company-level drill-downs. The same map appears inside individual ' +
          'company profiles, pre-focused to that company.</p>' +
        '<div class="ind-pills">' + pills +
          '<span class="ind-soon">More industries coming soon</span>' +
        '</div>' +
      '</div>' +
      '<iframe id="ind-frame" class="ind-frame" title="Industry supply-chain map" ' +
        'src="industry-embed.html?industry=semiconductors"></iframe>' +
    '</div>';

  if (_wired) return;
  _wired = true;
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('.ind-pill');
    if (!btn || btn.disabled) return;
    root.querySelectorAll('.ind-pill').forEach((b) => b.classList.toggle('active', b === btn));
    const frame = document.getElementById('ind-frame');
    if (frame) frame.src = 'industry-embed.html?industry=' + encodeURIComponent(btn.dataset.ind);
  });
}
