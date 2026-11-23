/* Comps & the stock — how comparable store sales (and the guide for them) moved the share price, release by release. Data: js/comps-story.js */
const CS_PEAK = (() => { let i = 0; SFM_PX.sfm.forEach((v, j) => { if(v > SFM_PX.sfm[i]) i = j; }); return { v:SFM_PX.sfm[i], d:SFM_PX.d[i] }; })();
const CS_NOW = SFM_PX.sfm[SFM_PX.sfm.length - 1];
const CS_DIR = { raised:'<span class="tag ok">Raised</span>', cut:'<span class="tag open">Cut</span>', initial:'<span class="tag n">First guide</span>', narrowed:'<span class="tag wait">Narrowed</span>' };
const csDate = s => new Date(s + 'T12:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
/* FY2026 guide as it moved through the year (data.js › guidance.FY2026_history) */
const csRng = (v, f) => Array.isArray(v) ? f(v[0]) + ' to ' + f(v[1]) : (typeof v === 'number' ? '~' + f(v) : v);
const csPct = v => sgnp(v * 100);
const CS_GH = SD.guidance.FY2026_history;
const CS_GROWS = [
  ['Net sales growth', h => csRng(h.net_sales_growth, csPct)],
  ['Comps', h => csRng(h.comp, csPct)],
  ['EBIT ($M)', h => csRng(h.ebit_usd_m, v => num(v, 0))],
  ['Diluted EPS', h => csRng(h.diluted_eps, v => '$' + v.toFixed(2))],
  ['New stores', h => h.new_stores],
  ['Capex ($M)', h => csRng(h.capex_usd_m, v => num(v, 0))]
];

registerView({ id:'cst',
  css: `#cst-t th:nth-child(-n+2), #cst-t td:nth-child(-n+2), #cst-t th:nth-child(n+7), #cst-t td:nth-child(n+7){text-align:left} #cst-t td:nth-child(8){white-space:normal;min-width:140px}
    #cst-t td:last-child{white-space:normal;min-width:220px} #cst-t td{padding-left:6px;padding-right:6px} #cst-t td:nth-child(7){min-width:110px}
    .cst-ch{border-top:3px solid var(--accent);padding-top:10px} .cst-ch.neg{border-top-color:#DC2626}
    .cst-ch h4{margin:0 0 2px;font-size:13px;color:var(--ink)} .cst-ch .p{font-size:11px;color:var(--mid);margin-bottom:8px}
    .cst-ch p{margin:0;font-size:12.5px;line-height:1.55;color:var(--ink2)}
    #cst-g th:first-child, #cst-g td:first-child{text-align:left} #cst-g th:last-child, #cst-g td:last-child{background:#EAF0FD;font-weight:600}
    .cst-now{display:flex;flex-direction:column;gap:10px} .cst-k{display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid var(--line,#E5E9F0);padding:6px 0;font-size:12.5px}
    .cst-k span{color:var(--mid)} .cst-k b{color:var(--ink);font-variant-numeric:tabular-nums} .cst-now p{margin:4px 0 0;font-size:12.5px;line-height:1.55;color:var(--ink2)}
    .cst-why{margin-bottom:22px} .cst-sub{font-size:12px;font-weight:600;color:var(--ink);margin:4px 0 8px} .cst-sub span{font-weight:400;color:var(--mid);margin-left:8px;font-size:11px}
    #cst-dg table{border-collapse:collapse;width:100%;font-size:11px} #cst-dg th,#cst-dg td{text-align:center;padding:5px 2px;border-bottom:1px solid #EEF1F5;white-space:nowrap}
    #cst-dg th{font-weight:500;color:var(--mid);font-size:10px} #cst-dg td:first-child,#cst-dg th:first-child{text-align:left;color:var(--ink2);font-weight:500;padding-right:8px}
    #cst-dg .a{font-size:12px;line-height:1} #cst-dg .u{color:#15803D} #cst-dg .d{color:#B91C1C} #cst-dg .f{color:#94A3B8}
    #cst-dg small{display:block;font-size:9px;color:var(--mid);margin-top:2px} #cst-dg tr.cp td{font-weight:600;color:var(--ink)}
    .cst-out{margin-top:12px;padding:10px 12px;background:#F6F8FB;border-left:3px solid var(--accent);font-size:12.5px;line-height:1.55;color:var(--ink2)}
    #cst-dt th:first-child,#cst-dt td:first-child,#cst-dt th:nth-child(n+3),#cst-dt td:nth-child(n+3){text-align:left} #cst-dt td:last-child{white-space:normal;min-width:300px}
    #cst-dt td:nth-child(3),#cst-dt td:nth-child(4),#cst-dt td:nth-child(5){white-space:normal;min-width:90px}
    @media (max-width:900px){ #v-cst .r4{grid-template-columns:1fr 1fr} } @media (max-width:560px){ #v-cst .r4{grid-template-columns:1fr} }`,
  html: `
  <div class="srow">
    ${tile('Comps at the peak', '+11.7%', "Q1'25 · the stock had already peaked, the week before the Q4'24 print")}
    ${tile("Comps now · Q3'26", sgnp(LQ.comp_sales_growth * 100), 'Q4 guided to −2% to −4%')}
    ${tile('Stock vs its peak', sgnp((CS_NOW / CS_PEAK.v - 1) * 100, 0), '$' + CS_PEAK.v.toFixed(0) + ' (' + csDate(CS_PEAK.d) + ') → $' + CS_NOW.toFixed(2))}
    ${tile('Worst day after a print', '−26.1%', 'Oct 30 2025: first comps miss vs its own guide')}
  </div>

  ${sec({ t:'Where the guide stands now', s:'FY2026 outlook as it moved through the year, and what Sprouts expects for Q4',
    b:`<div class="r32"><div class="tw" id="cst-g"></div>
      <div class="cst-now">
        <div class="cst-k"><span>Q4'26 comps</span><b>${csRng(G26.q4_2026_comp_range.slice().reverse(), csPct)}</b></div>
        <div class="cst-k"><span>Q4'26 diluted EPS</span><b>$${G26.q4_2026_eps_range[0].toFixed(2)} to $${G26.q4_2026_eps_range[1].toFixed(2)}</b></div>
        <div class="cst-k"><span>53rd week (in Q4)</span><b>~$${G26.week_53_estimate.net_sales_usd_m}M sales · ~$${G26.week_53_estimate.diluted_eps.toFixed(2)} EPS</b></div>
        <p>Q4 and 2027 carry heavier spending on <b>affordability</b> (“broader and deeper” price cuts), technology and the supply chain. It is the first time Sprouts has guided to lower prices to win back traffic, and it costs margin: the FY EBIT guide fell from $675–685M to ~$605M.</p>
      </div></div>`,
    n:'Earnings 8-Ks, Ex. 99.1 (Feb 19, Apr 29, Jul 29 and Oct 28 2026). All FY2026 figures on a 52-week basis; FY2026 has a 53rd week in Q4, guided separately. Highlighted column = latest guide. No FY2027 guide yet (expected with the Q4 release, Feb 2027).' })}

  ${sec({ t:'The stock, print by print', s:'Weekly close; each dot is the day after an earnings release',
    ctl:`<div class="ctls">${seg('cst-v','Scale',[['px','Price ($)'],['ix','Indexed vs S&P 500']],'px')}</div>`,
    b:`<div class="leg" id="cst-pl"></div><div class="ch-wrap" style="height:320px"><canvas id="cst-pc"></canvas></div>`,
    n:'Yahoo Finance weekly closes, Nov 2021 – ' + csDate(SFM_PX.asOf) + ' (frozen). Dot colour = the next-day move: green up, red down; hover for the quarter, comps and the move. Indexed: both series = 100 on the first week.' })}

  ${sec({ t:'Comps against the company’s own guide', s:'What Sprouts said a quarter earlier, and what it reported',
    b:`<div id="cst-cc"></div>`,
    n:'Earnings 8-Ks (Ex. 99.1). Guide = midpoint of the range for that quarter given in the previous release; Q4’21 and Q3’23 had no numeric guide. Only two quarters came in below the company’s own guide: Q3’25 and Q3’26. They are the two worst days in the table below.' })}

  ${sec({ t:'Why comps moved: traffic, basket or price', s:'What management said drove each quarter — more trips, or more spent per trip',
    b:`<div class="r3 cst-why">
        <div class="cst-ch"><h4>2022 · price did the work</h4><div class="p">comps 1.6% → 2.9%</div>
          <p>Inflation raised price per item while customers dropped 1–2 items per trip and traffic hovered around flat. Comps grew only because shelf prices did.</p></div>
        <div class="cst-ch"><h4>2023 – mid 2025 · traffic did the work</h4><div class="p">comps 3% → 11.7%</div>
          <p>As inflation faded, the growth came from more customers and more trips (≈ half of the comp in 2024, ~70% in Q1’25), with items per basket flat. This is what the market paid for.</p></div>
        <div class="cst-ch neg"><h4>Late 2025 – 2026 · traffic broke</h4><div class="p">comps 5.9% → −0.9%</div>
          <p>Lapping the surge, the customers won in 2024 came less often. Traffic turned negative in Q4’25 and reached −3.3% in Q3’26; a +2.5% bigger basket could not offset it.</p></div>
      </div>
      <div class="cst-sub">Quarter by quarter <span>▲ up · ● about flat · ▼ down · blank = not disclosed; small text = share of the comp or the size, when given</span></div>
      <div class="tw" id="cst-dg"></div>
      <div class="cst-out"><b>What comes next.</b> ${CS_DRV_OUT}</div>
      <div class="tw" id="cst-dt" style="margin-top:18px"></div>`,
    n:'Earnings-call prepared remarks and Q&A (official transcripts on investors.sprouts.com) and 10-Q / 10-K MD&A. Sprouts does not disclose traffic as a number: the CFO said so in Q3’23, and only shares of the comp or directions were given until Q3’26, the first quarter with transaction count (−3.3%) and transaction size (+2.5%) in the 10-Q. Q4’21 comes from a call summary (official transcript not posted). Inflation = product inflation management cited, not CPI. Research and a source per quarter: Data pack/comp-drivers/.' })}

  ${sec({ t:'The story in four chapters', s:'What the market paid for, and when it stopped',
    b:`<div class="r4">
      <div class="cst-ch"><h4>1 · The reset works</h4><div class="p">2022 – 2023 · comps 2–4%</div>
        <p>Comps rise slowly, but each quarter beats a cautious guide and the outlook goes up. The only big drop is May 2022 (−24%), when inflation shrinks baskets and the outlook is cut.</p></div>
      <div class="cst-ch"><h4>2 · The acceleration</h4><div class="p">Feb 2024 – Oct 2024 · comps 3% → 8%</div>
        <p>Comps double the guide two quarters running (6.7% vs 3.5%, then 8.4% vs 4%). Four prints, four rallies of +8% to +13%. The market starts paying for a fast grower.</p></div>
      <div class="cst-ch neg"><h4>3 · The peak and the turn</h4><div class="p">Feb 2025 – Oct 2025 · comps 11.7% → 5.9%</div>
        <p>Comps peak at 11.7%, but every guide now points down. Beats stop working (Jul 2025: 10.2% vs ~8.1% consensus, stock −4%). In Oct 2025 comps miss the guide for the first time and Q4 is guided to 0–2%: −26%.</p></div>
      <div class="cst-ch neg"><h4>4 · Negative comps <span style="font-weight:500;color:var(--mid)">(after the video)</span></h4><div class="p">2026 · comps −1.7% to −0.9%</div>
        <p>Comps go negative, but on guide, so April and July bring relief rallies (+15%, +10%). In Oct 2026 they miss the guide again, the year is cut to ~−1.7%, and a price investment starts: −23%.</p></div>
    </div>`,
    n:'The chapter structure follows Learn to Invest’s “Is SFM a Good Investment?” video (Oct 2026), which ends before the Oct 28 2026 print. Every number here comes from the releases and the price series, not from the video.' })}

  ${sec({ t:'Release by release', s:'Comps, the guide, the outlook and the next-day move',
    b:`<div class="tw" id="cst-t"></div>`,
    n:'Earnings 8-Ks, Ex. 99.1 (accession numbers in Data pack/comps-story/releases.json). Move = release-day close to next close (Sprouts reports after the close); our arithmetic. Full-year EPS is adjusted until Feb 2025 and diluted (GAAP) from Apr 2025; FY2026 is on a 52-week basis. Consensus is from Zacks where cited; no consensus comps were found for most quarters.' })}
  `,
  init(){
    /* 0 — FY2026 guide evolution */
    $('#cst-g').innerHTML = table(['FY2026 guide'].concat(CS_GH.map(h => csDate(h.issued).replace(/, 20(\d\d)$/, ''))),
      CS_GROWS.map(([l, f]) => [l].concat(CS_GH.map(f))));

    /* 1 — price with earnings dots */
    const n = SFM_PX.d.length, wkOf = d => { const i = SFM_PX.d.findIndex(x => x >= d); return i < 0 ? n - 1 : i; };
    const dots = REL.map(e => { const i = wkOf(e.d); return { i, e }; });
    let mode = 'px'; const hidden = new Set();
    const items = [{ key:'sfm', label:'SFM', color:SC.per, type:'line' }, { key:'spx', label:'S&P 500 (indexed)', color:SC.grey, type:'line', dash:true }, { key:'ev', label:'Day after a release', color:SC.navy }];
    const sfmY = i => mode === 'px' ? SFM_PX.sfm[i] : SFM_PX.sfm[i] / SFM_PX.sfm[0] * 100;
    const dsets = () => {
      const out = [];
      if(!hidden.has('sfm')) out.push({ type:'line', label:'SFM', data:SFM_PX.sfm.map((_, i) => sfmY(i)), borderColor:SC.per, backgroundColor:SC.per, borderWidth:2, pointRadius:0, order:2 });
      if(!hidden.has('spx') && mode === 'ix') out.push({ type:'line', label:'S&P 500', data:SFM_PX.spx.map(v => v == null ? null : v / SFM_PX.spx[0] * 100), borderColor:SC.grey, borderDash:[5,4], borderWidth:1.5, pointRadius:0, spanGaps:true, order:3 });
      if(!hidden.has('ev')){ const d = new Array(n).fill(null), col = new Array(n).fill(null);
        dots.forEach(({ i, e }) => { d[i] = sfmY(i); col[i] = e.r >= 0 ? SC.pos : SC.neg; });
        out.push({ type:'line', label:'Release', data:d, showLine:false, pointRadius:d.map(v => v == null ? 0 : 5), pointHoverRadius:7, pointBackgroundColor:col, pointBorderColor:'#fff', pointBorderWidth:1.5, order:1 }); }
      return out;
    };
    const pc = new Chart($('#cst-pc'), { type:'line', data:{ labels:SFM_PX.d.map(d => d.slice(0,7)), datasets:dsets() },
      options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'nearest', intersect:false, axis:'x' },
        plugins:{ legend:{display:false}, tooltip:{ ...TIP, filter: c => c.dataset.label !== 'Release' || c.raw != null,
          callbacks:{ title: c => SFM_PX.d[c[0].dataIndex],
            label: c => { if(c.dataset.label === 'Release'){ const e = dots.find(x => x.i === c.dataIndex).e; return ' ' + e.q + ' (' + csDate(e.d) + '): comps ' + sgnp(e.comp) + ', next day ' + sgnp(e.r); }
              return ' ' + c.dataset.label + ': ' + (mode === 'px' && c.dataset.label === 'SFM' ? '$' + c.parsed.y.toFixed(2) : num(c.parsed.y, 0)); } } } },
        scales:{ x:{ grid:{display:false}, ticks:{ autoSkip:true, maxTicksLimit:11, maxRotation:0 } },
                 y:{ grid:{color:'#EEF1F5'}, ticks:{ callback: v => mode === 'px' ? '$' + v : v } } } } });
    zoomable(pc);
    const redraw = () => { pc.data.datasets = dsets(); pc.update(); legend($('#cst-pl'), items.filter(it => it.key !== 'spx' || mode === 'ix'), hidden, redraw); };
    redraw(); pills('#cst-v', v => { mode = v; redraw(); });

    /* 2 — comps vs own guide */
    chartBlock($('#cst-cc'), { labels:REL.map(e => e.q), unit:'%', fmt:v => sgnp(v), rowHead:'Quarter', height:'',
      series:[ { key:'c', label:'Reported comps', color:SC.per, data:REL.map(e => e.comp) },
               { key:'g', label:'Company guide (midpoint)', color:SC.navy, type:'line', dash:true, data:REL.map(e => e.g), span:true } ],
      extra: cfg => { cfg.data.datasets[0].backgroundColor = REL.map(e => e.g != null && e.comp < e.g ? SC.neg : SC.per); },
      tableNote:'Red bars = below the company’s own guide.' });

    /* 3 — drivers: arrow grid + quarter table */
    const arw = (v, lbl) => v == null ? '' : `<span class="a ${v > 0 ? 'u' : v < 0 ? 'd' : 'f'}">${v > 0 ? '▲' : v < 0 ? '▼' : '●'}</span>${lbl ? '<small>' + lbl + '</small>' : ''}`;
    const compOf = q => (REL.find(e => e.q === q) || {}).comp;
    $('#cst-dg').innerHTML = '<table><thead><tr><th></th>' + CS_DRV.map(d => '<th>' + d.q + '</th>').join('') + '</tr></thead><tbody>'
      + '<tr class="cp"><td>Comps</td>' + CS_DRV.map(d => `<td style="color:${compOf(d.q) < 0 ? '#B91C1C' : 'inherit'}">${sgnp(compOf(d.q))}</td>`).join('') + '</tr>'
      + [['Traffic (trips)', d => arw(d.tr, d.tl)], ['Basket (ticket)', d => arw(d.bk, d.bl)], ['Items per basket', d => arw(d.it)], ['Price per item', d => arw(d.pp)]]
        .map(([l, f]) => '<tr><td>' + l + '</td>' + CS_DRV.map(d => '<td>' + f(d) + '</td>').join('') + '</tr>').join('')
      + '</tbody></table>';
    const dTxt = (v, l) => v == null ? '<span style="color:var(--mid)">n/d</span>' : (v > 0 ? 'Up' : v < 0 ? 'Down' : 'About flat') + (l ? ' · ' + l + (/^~[0-9]+%$/.test(l) ? ' of comp' : '') : '');
    $('#cst-dt').innerHTML = table(['Quarter','Comps','Traffic','Basket','Inflation cited','E-com (growth · share)','Why comps moved'],
      CS_DRV.map(d => [d.q, '<b>' + sgnp(compOf(d.q)) + '</b>', dTxt(d.tr, d.tl), dTxt(d.bk, d.bl), d.inf,
        (d.ec == null ? '—' : '+' + d.ec + '%') + ' · ' + d.ecs + '%', d.why]).reverse());

    /* 4 — release table */
    $('#cst-t').innerHTML = table(['Quarter','Reported','Comps','Guide','Vs guide','Next day','Next-quarter guide','Full-year outlook','Vs prior','What happened'],
      REL.map(e => { const s = e.g == null ? null : e.comp - e.g, big = Math.abs(e.r) >= 15;
        const mv = `<span style="color:${e.r >= 0 ? '#15803D' : '#B91C1C'};font-weight:${big ? 700 : 500}">${sgnp(e.r)}</span><br><span style="color:var(--mid);font-size:10.5px">S&P ${sgnp(e.x)}</span>`;
        return [e.q, csDate(e.d).replace(/, 20(\d\d)$/, " ’$1"), '<b>' + sgnp(e.comp) + '</b>', e.g == null ? '—' : sgnp(e.g), s == null ? '—' : `<span style="color:${s < 0 ? '#B91C1C' : 'inherit'}">${(s >= 0 ? '+' : '−') + Math.abs(s).toFixed(1)} pt</span>`, mv, e.ng, e.fy, CS_DIR[e.dir] || e.dir, e.t]; }).reverse());
  }
});
