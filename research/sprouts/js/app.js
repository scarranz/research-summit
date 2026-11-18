/* ═════════════ APP — sidebar, top bar, routing ═════════════ */
const NAV = [
  ['Sprouts',       [['biz','The business'], ['now','Where it is today'], ['evo','How it evolved']]],
  ['The story now', [['drv','Growth engine'], ['watch','What to watch']]]
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
  $('#tb-title').textContent = 'Sprouts · ' + (label ? label[1] : '');
  document.querySelector('.scroller').scrollTop = 0;
  try { history.replaceState(null, '', '#' + id); } catch(e) {}
}
window.goView = show;

function renderTopbar(){
  $('#tb-r').innerHTML = [
    ['Net sales FY25', usd(LAST.net_sales), '+14%'],
    ["Comps Q3'26", sgnp(LQ.comp_sales_growth * 100), 'Third negative quarter'],
    ['FY26 EPS guide', '~$' + G26.diluted_eps.toFixed(2), 'Cut Oct 28 2026'],
    ['Stores', num(LQ.stores_end), 'Sep 27 2026']
  ].map(([l,v,s]) => `<div class="tb-m" title="${s}"><div class="tb-ml">${l}</div><div class="tb-mv">${v}</div></div>`).join('');
  $('#side-foot').textContent = "Frozen data from SEC filings · 10-K FY15–FY25 · 10-Qs and releases to Q3'26 (Oct 28 2026) · built Nov 18 2026";
}

renderNav();
renderTopbar();
show((location.hash || '#biz').slice(1));
