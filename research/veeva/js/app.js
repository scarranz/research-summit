/* ═════════════ APP — sidebar, top bar, routing ═════════════ */
const NAV = [
  ['Veeva',         [['biz','The business'], ['now','Where it is today'], ['evo','How it evolved']]],
  ['The story now', [['crm','Vault CRM & growth'], ['watch','What to watch']]]
];

function renderNav(){
  $('#snav').innerHTML = NAV.map(([sec, items]) => `<div class="snav-lbl">${sec}</div><div class="snav">` +
    items.map(([id, label]) => VIEWS[id]
      ? `<button class="ntb" data-view="${id}"><span class="dot"></span>${label}</button>`
      : `<button class="ntb soon" disabled><span class="dot"></span>${label}</button>`).join('') + '</div>').join('');
  $$('.ntb[data-view]').forEach(b => b.onclick = () => show(b.dataset.view));
}

function show(id){
  if(!VIEWS[id]) id = 'biz';
  $$('.ntb[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === id));
  Object.values(VIEWS).forEach(v => v.el.classList.toggle('active', v.id === id));
  const v = VIEWS[id];
  if(!v.built){ v.built = true; try { v.init && v.init(); } catch(e){ console.error('[view ' + id + ']', e); } }
  const label = NAV.flatMap(n => n[1]).find(n => n[0] === id);
  $('#tb-title').textContent = 'Veeva · ' + (label ? label[1] : '');
  document.querySelector('.scroller').scrollTop = 0;
  try { history.replaceState(null, '', '#' + id); } catch(e) {}
}
window.goView = show;

function renderTopbar(){
  $('#tb-r').innerHTML = [
    ['Revenue FY26', usd(LAST.total_revenue), '+16%'],
    ['Revenue Q2 FY27', usd(LQ.total_revenue), '+18% y/y'],
    ['Non-GAAP op. margin FY26', pctf(LAST.non_gaap_operating_income / LAST.total_revenue * 100, 0), 'Company non-GAAP'],
    ['FY27 revenue guide', '$3.68–3.69B', 'Aug 26 2026']
  ].map(([l,v,s]) => `<div class="tb-m" title="${s}"><div class="tb-ml">${l}</div><div class="tb-mv">${v}</div></div>`).join('');
  $('#side-foot').textContent = 'Frozen data from SEC filings · 10-K FY16–FY26 · releases to Q2 FY27 (Aug 26 2026) · built Nov 18 2026';
}

renderNav();
renderTopbar();
show((location.hash || '#biz').slice(1));
