/* Competitors — who sells what, and Sprouts against the field on margins, stores and comps. Data: js/peers.js */
const PUB = PEERS.filter(p => p.pub);
const ME = PEERS.find(p => p.me);
const last = a => a ? a[a.length - 1] : null;
const rankOf = (key, v) => 1 + PUB.filter(p => last(p[key]) > v).length;
const GRP_C = { nat:SC.sky, lim:SC.grey, conv:SC.steel };
const k = v => v == null ? '—' : num(v, 1) + 'k';

registerView({ id:'comp',
  css: `#v-comp td b{color:var(--ink)} #comp-t td:nth-child(3){min-width:260px;white-space:normal}
    #comp-t th:nth-child(-n+5), #comp-t td:nth-child(-n+5), #comp-q th:nth-child(-n+2), #comp-q td:nth-child(-n+2), #comp-q th:nth-child(5), #comp-q td:nth-child(5){text-align:left}
    #comp-q td:nth-child(5){white-space:normal;min-width:300px}`,
  html: `
  <div class="srow">
    ${tile('Gross margin · latest FY', pctf(last(ME.gm)), '#' + rankOf('gm', last(ME.gm)) + ' of 9 public grocers; Natural Grocers 29.6%')}
    ${tile('Operating margin · latest FY', pctf(last(ME.om)), '#' + rankOf('om', last(ME.om)) + ' of 9; Publix 7.4%, Kroger 1.3%')}
    ${tile('Store growth · latest FY', sgnp(last(ME.sg)), '#' + rankOf('sg', last(ME.sg)) + ' of 9 public; Aldi ~+9%, Trader Joe’s ~+7% (est.)')}
    ${tile("Comps · Q3'26", sgnp(ME.lq.comp), 'Was #' + rankOf('comp', last(ME.comp)) + ' of 9 in FY25; now among the weakest')}
  </div>

  ${sec({ t:'Who sells what', s:'Format, range and own brand, by type of competitor',
    ctl:`<div class="ctls">${seg('comp-g','Type',[['all','All'],['nat','Natural & specialty'],['lim','Limited assortment & clubs'],['conv','Conventional & mass']],'all')}</div>`,
    b:`<div class="tw" id="comp-t"></div>`,
    n:'Competitors are the ones Sprouts names in its FY25 10-K (Item 1), plus Natural Grocers, Erewhon, The Fresh Market, Aldi and Lidl. Items per store are rarely disclosed: only Costco and Natural Grocers give them in a 10-K; Walmart’s is a 2019 CFO quote and Lidl’s a 2025 CEO quote. The Aldi and Trader Joe’s figures that circulate conflict, so they are shown as ranges, not numbers. Average size is gross sq ft from filings (Natural Grocers: selling sq ft). *Kroger widened its own-brand definition in FY25. Est. = third-party panel estimate (Numerator).' })}

  ${sec({ t:'Sprouts against the field', s:'One metric at a time; three fiscal years where the filings give them',
    ctl:`<div class="ctls">${seg('comp-m','Metric',[['gm','Gross margin'],['om','Operating margin'],['comp','Comps'],['sg','Store growth'],['stores','Stores'],['sps','Sales per store'],['items','Items per store']],'gm')}</div>`,
    b:`<div id="comp-c"></div>`,
    n:'10-K / 10-Q and earnings releases of each company (full source map in Data pack/peers/public.json). Each company is on its own fiscal year: ' + PUB.map(p => p.name + ' ' + p.fy).join(' · ') + '. Not like for like: gross margin bases differ (Sprouts and Kroger leave occupancy out of cost of sales; Natural Grocers puts it in; Costco excludes membership fees). Comps definitions differ (Kroger, Albertsons, Weis exclude fuel; Costco includes gas and FX; Natural Grocers uses daily averages). Walmart is the Walmart U.S. segment; Costco is US.' })}

  ${sec({ t:'Growth against profitability', s:'Store growth on the horizontal axis; bubble size = net sales',
    ctl:`<div class="ctls">${seg('comp-y','Vertical axis',[['om','Operating margin'],['comp','Comps'],['gm','Gross margin']],'om')}</div>`,
    b:`<div class="leg" id="comp-sl"></div><div class="ch-wrap" style="height:380px"><canvas id="comp-sc"></canvas></div>
       <details class="tbl"><summary>Data table</summary><div class="tw" id="comp-st"></div></details>`,
    n:'Latest fiscal year of each of the nine public grocers. Bubble area is proportional to net sales (Walmart U.S. and Kroger dominate; drag to zoom into the small ones, double-click to reset). Private chains are left out because none discloses margins.' })}

  ${sec({ t:'Where each one is now', s:'Latest quarter and what they are guiding to or doing',
    b:`<div class="tw" id="comp-q"></div>`,
    n:'Latest 10-Q or earnings release of each public company (to Nov 19 2026). The Fresh Market from its owner Cencosud’s 3Q26 results via trade press (to be checked against the Cencosud release). Private chains: company statements and trade press, dated in Data pack/peers/private.json.' })}
  `,
  init(){
    /* 1 — Who sells what */
    const drawT = g => {
      const rows = PEERS.filter(p => g === 'all' || p.grp === g).map(p => {
        const b = s => p.me ? '<b>' + s + '</b>' : s;
        return [b(p.name), `<span class="tag">${PEER_GROUPS[p.grp]}</span>`, p.sells, b(p.itemsTxt), p.own,
          b(p.storesTxt || num(p.stores)), p.sqft ? k(p.sqft) : '—'];
      });
      $('#comp-t').innerHTML = table(['Company','Type','What they sell','Items per store','Own brand','US stores','Avg size (sq ft)'], rows);
    };
    drawT('all'); pills('#comp-g', drawT);

    /* 2 — One metric at a time */
    const sortBy = (list, f) => list.slice().sort((a, b) => (f(b) ?? -1e9) - (f(a) ?? -1e9));
    const y3 = (key, unit, fmt) => {
      const L = sortBy(PUB, p => last(p[key]));
      return { labels:L.map(p => p.name), unit, fmt, rowHead:'Company', log:false, height:'d', yMin:undefined,
        series:[ { key:'a', label:'Two years earlier', color:SC.fog, data:L.map(p => p[key][0]) },
                 { key:'b', label:'Prior year', color:SC.sky, data:L.map(p => p[key][1]) },
                 { key:'c', label:'Latest fiscal year', color:SC.per, data:L.map(p => p[key][2]) } ] };
    };
    const one = (list, f, label, unit, fmt, log) => {
      const L = sortBy(list.filter(p => f(p) != null), f);
      return { labels:L.map(p => p.name), unit, fmt, rowHead:'Company', log:!!log, height:'d', yMin: log ? undefined : 0,
        series:[ { key:'v', label, color:SC.per, data:L.map(f) } ], _me:L.findIndex(p => p.me) };
    };
    const M = {
      gm:   () => ({ ...y3('gm', '% of sales', v => pctf(v)), tableNote:'Sprouts leads by ~9 points, partly because occupancy sits outside its cost of sales.' }),
      om:   () => ({ ...y3('om', '% of sales', v => pctf(v)), tableNote:'Kroger FY25 includes a $2.5B write-down of its automated fulfilment network.' }),
      comp: () => ({ ...y3('comp', '%', v => sgnp(v)), tableNote:"Latest quarter: " + PUB.map(p => p.name + ' ' + sgnp(p.lq.comp) + ' (' + p.lq.p + ')').join(' · ') + '. Costco excluding gas and FX: +6.6% (FY26).' }),
      sg:   () => ({ ...y3('sg', '% change in stores', v => sgnp(v)), tableNote:'Year-end over year-end store count (our arithmetic). Private chains, latest year (estimates): Trader Joe’s +43 stores in 2025 (~+7%), Aldi ~+9%, Erewhon 10 → 14 since Jan 2025.' }),
      stores: () => ({ ...one(PEERS, p => p.stores, 'US stores', 'count', v => num(v), true), tableNote:'Log scale. Private chains are latest press or company figures; H-E-B includes Mexico; Aldi end-2025 is a single secondary report.' }),
      sps:  () => ({ ...one(PUB, p => p.sales / p.stores, 'Net sales per year-end store', '$M', v => '$' + num(v, 1) + 'M', true), tableNote:'Our arithmetic: latest-FY net sales ÷ year-end stores. Log scale. Box sizes range from ~11k (Natural Grocers) to ~150k sq ft (Costco, Walmart).' }),
      items:() => ({ ...one(PEERS, p => p.items, 'Items per store', 'items', v => num(v), true), tableNote:'Only four credible figures exist. Sprouts does not disclose its range (trade press says ~18–20k, unverified).' })
    };
    let cur = 'gm';
    const blk = chartBlock($('#comp-c'), { horizontal:true, ...M.gm() });
    const paint = () => { const c = M[cur](); const ds = blk.chart.data.datasets;
      if(c._me != null && ds.length === 1){ ds[0].backgroundColor = c.labels.map((_, i) => i === c._me ? SC.per : SC.fog); blk.chart.update(); } };
    pills('#comp-m', v => { cur = v; const c = M[v](); blk.set({ tableNote:'', ...c });
      const ax = blk.chart.options.scales.x; ax.type = c.log ? 'logarithmic' : 'linear'; ax.min = c.log ? undefined : c.yMin; ax.max = undefined;
      ax.ticks.callback = c.log ? (t => { const e = Math.log10(t); return Math.abs(e - Math.round(e)) < 1e-9 || Math.abs(Math.log10(t / 3) - Math.round(Math.log10(t / 3))) < 1e-9 ? c.fmt(t) : ''; }) : (t => c.fmt(t));
      blk.chart.canvas.parentElement.style.height = Math.max(300, c.labels.length * 26 + 60) + 'px'; blk.chart.resize(); blk.chart.update(); paint(); });
    $('#comp-c .leg').addEventListener('click', () => setTimeout(paint, 0));

    /* 3 — Growth vs profitability (bubble) */
    const YL = { om:'Operating margin', comp:'Comps', gm:'Gross margin' };
    let yk = 'om'; const hidden = new Set();
    const items = [{ key:'me', label:'Sprouts', color:SC.per }, ...Object.keys(PEER_GROUPS).map(g => ({ key:g, label:PEER_GROUPS[g], color:GRP_C[g] }))];
    const maxS = Math.max(...PUB.map(p => p.sales));
    const pts = list => list.map(p => ({ x:last(p.sg), y:last(p[yk]), r:4 + 26 * Math.sqrt(p.sales / maxS), n:p.name }));
    const dsets = () => items.filter(it => !hidden.has(it.key)).map(it => {
      const list = PUB.filter(p => it.key === 'me' ? p.me : (!p.me && p.grp === it.key));
      return { label:it.label, data:pts(list), backgroundColor:it.color + (it.key === 'me' ? 'DD' : '99'), borderColor:it.color, borderWidth:1 };
    }).filter(d => d.data.length);
    const names = { id:'names', afterDatasetsDraw(ch){ const x = ch.ctx; x.save(); x.font = '600 10.5px Inter, sans-serif'; x.fillStyle = '#3B4452'; x.textBaseline = 'middle';
      ch.data.datasets.forEach((d, i) => ch.getDatasetMeta(i).data.forEach((el, j) => { if(el.skip) return; x.fillText(d.data[j].n, el.x + d.data[j].r + 4, el.y); })); x.restore(); } };
    const sc = new Chart($('#comp-sc'), { type:'bubble', data:{ datasets:dsets() }, plugins:[names],
      options:{ responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{display:false}, tooltip:{ ...TIP, callbacks:{ label: c => ' ' + c.raw.n + ': store growth ' + sgnp(c.raw.x) + ', ' + YL[yk].toLowerCase() + ' ' + (yk === 'comp' ? sgnp(c.raw.y) : pctf(c.raw.y)) } } },
        scales:{ x:{ type:'linear', title:{display:true, text:'Store growth, latest FY (%)', color:'#8A93A0', font:{size:10.5, weight:600}}, ticks:{ callback:v => sgnp(v,0) }, grid:{color:'#EEF1F5'} },
                 y:{ type:'linear', title:{display:true, text:YL.om + ' (%)', color:'#8A93A0', font:{size:10.5, weight:600}}, ticks:{ callback:v => num(v,0) + '%' }, grid:{color:'#EEF1F5'} } } } });
    zoomable(sc);
    const drawS = () => {
      sc.data.datasets = dsets(); sc.options.scales.y.title.text = YL[yk] + ' (%)'; sc.update();
      const vis = PUB.filter(p => !hidden.has(p.me ? 'me' : p.grp));
      $('#comp-st').innerHTML = table(['Company','Store growth','Operating margin','Comps','Gross margin','Net sales'],
        sortBy(vis, p => p.sales).map(p => [p.me ? '<b>' + p.name + '</b>' : p.name, sgnp(last(p.sg)), pctf(last(p.om)), sgnp(last(p.comp)), pctf(last(p.gm)), usd(p.sales)]));
      legend($('#comp-sl'), items, hidden, drawS);
    };
    drawS(); pills('#comp-y', v => { yk = v; drawS(); });

    /* 4 — Where each one is now */
    $('#comp-q').innerHTML = table(['Company','Period','Comps','Stores','Guiding to / doing'],
      PEERS.map(p => { const b = s => p.me ? '<b>' + s + '</b>' : s;
        return [b(p.name), p.lq.p, p.lq.comp == null ? '—' : b(sgnp(p.lq.comp)), p.lq.stores == null ? '—' : num(p.lq.stores), p.lq.txt]; }));
  }
});
