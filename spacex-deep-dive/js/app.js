/* ═════════════ APP — sidebar, top bar, routing ═════════════ */
const NAV = [
  ['The company', [['ov','Overview'], ['fin','Financials'], ['cash','Cash & financing'], ['cust','Customers'], ['own','Management & ownership']]],
  ['Segments',    [['segx','Segment economics'], ['conn','Starlink'], ['ship','Starship & launch'], ['si','AI & compute'], ['def','Defense']]],
  ['The thesis',  [['orb','Orbital compute'], ['comp','Why this operator'], ['risk','What can go wrong']]],
  ['Reference',   [['tgt','Stated targets'], ['src','Sources & open questions']]],
  ['Valuation',   [['val','Valuation']]]
];

function renderNav(){
  $('#snav').innerHTML = NAV.map(([sec, items]) => `<div class="snav-lbl">${sec}</div><div class="snav">` +
    items.map(([id, label]) => VIEWS[id]
      ? `<button class="ntb" data-view="${id}"><span class="dot"></span>${label}</button>`
      : `<button class="ntb soon" disabled><span class="dot"></span>${label}</button>`).join('') + '</div>').join('');
  $$('.ntb[data-view]').forEach(b => b.onclick = () => show(b.dataset.view));
}

function show(id){
  if(!VIEWS[id]) id = 'ov';
  $$('.ntb[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === id));
  Object.values(VIEWS).forEach(v => v.el.classList.toggle('active', v.id === id));
  const v = VIEWS[id];
  if(!v.built){ v.built = true; try { v.init && v.init(); } catch(e){ console.error('[view ' + id + ']', e); } }
  const label = NAV.flatMap(n => n[1]).find(n => n[0] === id);
  $('#tb-title').textContent = 'SpaceX · ' + (label ? label[1] : '');
  document.querySelector('.scroller').scrollTop = 0;
  try { history.replaceState(null, '', '#' + id); } catch(e) {}
}
window.goView = show;

function renderTopbar(){
  $('#tb-r').innerHTML = [
    ['Revenue 9M26', usd(IS9M.rev.total[1]), '+97% vs 9M25'],
    ['Net income 9M26', usd(IS9M.net[1]), 'Q3 alone: +$4.4B'],
    ['Free cash flow 9M26', usd(IS9M.fcf[1]), 'Capex $48.1B'],
    ['Liquidity', usd(BS.liquidity), 'Cash + securities, ' + ASOF],
    ['Price', '$' + PRICE.px, PRICE.date + ' close']
  ].map(([l,v,s]) => `<div class="tb-m" title="${s}"><div class="tb-ml">${l}</div><div class="tb-mv">${v}</div></div>`).join('');
}

renderNav();
renderTopbar();
show((location.hash || '#ov').slice(1));
