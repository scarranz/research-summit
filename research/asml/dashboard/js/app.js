/* ═════════════ APP — sidebar, top bar, routing ═════════════
   NAV fixes the sidebar order. A view that has not registered (file missing or not built yet) shows as "soon". */
const NAV = [
  ['Business',  [['pl','Machines'], ['ib','Installed Base'], ['ov','Overview']]],
  ['Revenue',   [['rb','Revenue build']]],
  ['Customers', [['cust','Customers & Geography'], ['tsmc','TSMC Link']]],
  ['Margins',   [['gm','GM Bridge & OpEx']]],
  ['Summary',   [['pnl','P&L & Multiples']]]
];

function renderNav(){
  $('#snav').innerHTML = NAV.map(([sec, items]) => `<div class="snav-lbl">${sec}</div><div class="snav">` +
    items.map(([id, label]) => VIEWS[id]
      ? `<button class="ntb" data-view="${id}"><span class="dot"></span>${label}</button>`
      : `<button class="ntb soon" disabled><span class="dot"></span>${label}</button>`).join('') + '</div>').join('');
  $$('.ntb[data-view]').forEach(b => b.onclick = () => show(b.dataset.view));
}

function show(id){
  if(!VIEWS[id]) id = 'pl';
  $$('.ntb[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === id));
  Object.values(VIEWS).forEach(v => v.el.classList.toggle('active', v.id === id));
  const v = VIEWS[id];
  if(!v.built){ v.built = true; try { v.init && v.init(); } catch(e){ console.error('[view ' + id + ']', e); } }
  Object.values(VIEWS).forEach(o => o.id !== id && o.onHide && o.onHide());
  const label = NAV.flatMap(n => n[1]).find(n => n[0] === id);
  $('#tb-title').textContent = 'ASML · ' + (label ? label[1] : '');
  document.querySelector('.scroller').scrollTop = 0;
  try { history.replaceState(null, '', '#' + id); } catch(e) {}
}

function renderTopbar(){
  const mcap = MKT.px * MKT.sharesM;          // € millions
  const pe = MKT.px / ttmEps;
  $('#tb-r').innerHTML = [
    ['Price (Euronext)', '€' + MKT.px.toLocaleString('en-US',{minimumFractionDigits:2}), MKT.pxDate],
    ['Market cap', '€' + (mcap/1000).toFixed(0) + 'B', MKT.sharesM.toFixed(0) + 'M shares'],
    ['P/E (TTM)', pe.toFixed(1) + '×', 'EPS €' + ttmEps.toFixed(2) + ' Q4\'25–Q3\'26'],
    ['FY26 guide', '€44–45B', 'GM ~56%']
  ].map(([l,v,s]) => `<div class="tb-m" title="${s}"><div class="tb-ml">${l}</div><div class="tb-mv">${v}</div></div>`).join('');
}

renderNav();
renderTopbar();
show((location.hash || '#pl').slice(1));
