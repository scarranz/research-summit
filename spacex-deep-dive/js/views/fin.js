/* Financials — Bloomberg consensus as the base, J.P. Morgan as the reference, a few drivers you can move */
const FIN_DRIVERS = [
  ['gw27',   'Compute at end-2027',        4, 16, 0.1, v => num(v,1) + ' GW'],
  ['addMult','GW added 2028–30',           0, 200, 5,  v => v + '% of base'],
  ['perW27', 'Revenue per watt, 2027',     8, 45, 0.5, v => '$' + num(v,1) + '/W'],
  ['dPerW',  'Extra price change, 2028–30',-20, 10, 1, v => (v>0?'+':'') + v + '% / yr'],
  ['siM',    'Compute EBITDA margin',     -25, 15, 1,  v => (v>0?'+':'') + v + ' pp vs base'],
  ['capGW27','Capex per GW added, 2027',   20, 60, 0.5, v => '$' + num(v,1) + 'B'],
  ['subs27', 'Starlink subscribers, end-2027', 15, 35, 0.1, v => num(v,1) + 'M'],
  ['arpu27', 'Starlink ARPU, 2027',        40, 75, 0.5, v => '$' + num(v,1) + '/mo']
];

registerView({ id:'fin',
  css: `#v-fin table.isx{font-size:11.5px;table-layout:fixed}#v-fin table.isx td,#v-fin table.isx th{padding:5px 8px}#v-fin table.isx th:first-child{width:230px}#v-fin table.isx td:first-child{white-space:normal}
#v-fin tr.isx-s td{background:var(--ice);color:var(--navy);font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;padding:9px 10px 6px;border-top:10px solid var(--w)}
#v-fin tr.isx-m td{font-weight:700;color:var(--navy);border-top:1px solid var(--bdr)}
#v-fin tr.isx-i td:first-child{padding-left:22px}
#v-fin tr.isx-g td{color:var(--mu);font-size:11px;font-style:italic;padding-top:0}
#v-fin tr.isx-g td:first-child{padding-left:22px}
#v-fin tr.isx-r td{color:var(--mu);font-size:11px}
#v-fin td.isx-cut,#v-fin th.isx-cut{border-left:2px solid var(--bdr)}`,
  html: `
  <div class="srow" id="fin-tiles"></div>

  ${sec({ t:'The forecast and what drives it', s:'Defaults are the Bloomberg consensus. Move a driver and every later year moves with it; Cash & financing and Valuation follow',
    ctl:`<div class="ctls">${scenPills('fin-sc')}</div>`,
    b:`<div class="calc">
      <div class="inp">
        <div class="pt" style="margin:0">Compute (SI)</div>
        ${sliderHTML('fin', FIN_DRIVERS.slice(0,6))}
        <div class="pt" style="margin:6px 0 0">Starlink</div>
        ${sliderHTML('fin', FIN_DRIVERS.slice(6))}
      </div>
      <div>
        <div class="ctls" style="margin-bottom:10px">${seg('fin-m','Show',[['rev','Revenue'],['ebitda','Adj. EBITDA'],['fcf','Free cash flow'],['eps','EPS']],'rev')}</div>
        <div id="fin-c"></div>
        <div class="snote" id="fin-scnote" style="margin-top:12px"></div>
      </div>
    </div>`,
    n:'Base = Bloomberg consensus (BEst) segment fields, pulled Nov 25 2026. "Revenue per watt" is blended revenue per watt of average installed compute (third-party rentals plus Grok/Cursor), the way J.P. Morgan frames the $500B–1T ARR target. Space is held at the base. Interest comes back from Cash & financing.' })}

  ${sec({ t:'Income statement — Bloomberg consensus', s:'2023–2025 reported, 2026–2030 consensus. $B unless stated; growth, margins and % of revenue sit under each line',
    ctl:`<div class="ctls">${seg('fin-isv','Show',[['full','Lines + growth & margins'],['main','Lines only']],'full')}</div>`,
    b:`<div class="tw" id="fin-t"></div>`,
    n:'Reported years: SpaceX 424B4 prospectus (FY2023–FY2025) as carried in the Bloomberg export; segment actuals from the 424B4 segment note. Estimates: Bloomberg consensus (BEst), "SPCX BBG CONSENSUS.xlsx", pulled Nov 25 2026. <b>Reading the consensus:</b> each Bloomberg field averages a different set of analysts, so the lines do not always add up. The grey "reconciling" rows show that gap instead of hiding it (for example segment revenue vs the total-revenue field, or pre-tax income less tax vs net income). In reported years those rows are real items: restructuring and impairment, other income, minority interests.' })}

  ${sec({ t:'What a gigawatt earns', s:'The compute business is a price-per-watt business. The number to watch is $/W, not GW',
    b:`<div class="cols2">
      <div><div class="pt">Year-end 2027 ARR = GW × $ per watt (J.P. Morgan grid)</div><div class="tw" id="fin-arr"></div>
        <div class="pt" style="margin-top:16px">Payback on one GW in our model</div><div id="fin-pb"></div></div>
      <div><div class="pt">One GW, J.P. Morgan illustrative model</div>
        <div class="tw">${table(['Rental price','Adj. EBITDA margin','IRR'], JPM.perGW.cases.map(r => [r[0], r[2].toFixed(1) + '%', r[3].toFixed(1) + '%']))}</div>
        <ul class="pl" style="margin-top:12px">
          <li><strong>Cost to build:</strong> ~$${JPM.perGW.dcBuild}M/MW for the data center (vs $${JPM.perGW.dcBuildTrad}M for a traditional developer) plus ~$${JPM.perGW.itEquip}B of GPUs → ~$33B per GW. Management, per J.P. Morgan (Oct 21 2026): a cost per GW "in the mid-$30’sB range, potentially well below the costs of others".</li>
          <li><strong>What breaks it:</strong> with GPUs at ~$${JPM.perGW.itEquipHigh}B per GW and $15/W, the IRR falls to <strong>${JPM.perGW.highCost15.irr}%</strong> and NPV turns negative. Normalisation toward $10–15/W (Deutsche Bank, Clear Street) is the case to stress.</li>
          <li><strong>Price today:</strong> Anthropic pays a blended ~$${JPM.anthropicBlended}/W (Hopper ~$${JPM.anthropicHopper}, Blackwell ~$${JPM.blackwell}); Google ~$50; pricing "slightly above the high end of the $30 to $50 per watt range" (CFO, Q3 call); Vera Rubin expected ~40% above GB300 (SemiAnalysis via J.P. Morgan).</li>
        </ul></div>
    </div>`,
    n:'J.P. Morgan initiation (Jul 7 2026, Figures 9, 93 and the Anthropic/Google contract pages), Key Investor FAQs (Nov 2026) and the Oct 21 note. Payback = capex per GW ÷ annual EBITDA per GW at the model\'s 2027 price and margin.' })}
  `,
  init(){
    wireScenPills('fin-sc');
    wireSliders('fin', 'a', FIN_DRIVERS);
    let metric = 'rev', isView = 'full', blk = null;
    const L = MYEARS;
    const hints = { gw27:b => b.gw[2], perW27:b => b.perW[2], capGW27:b => b.capGW[2]/1000, subs27:b => b.subs[2], arpu27:b => b.arpu[2] };
    const BC = MODEL.BASES.cons, BJ = MODEL.BASES.jpm;
    Object.entries(hints).forEach(([k, g]) => { const d = FIN_DRIVERS.find(x => x[0] === k); $('#fin-' + k + '-h').textContent = 'Consensus ' + d[5](+g(BC).toFixed(1)) + ' · J.P. Morgan ' + d[5](+g(BJ).toFixed(1)); });
    $('#fin-addMult-h').textContent = 'Base adds ' + [3,4,5].map(i => num(BC.gw[i]-BC.gw[i-1],1)).join(' / ') + ' GW (cons.)';
    $('#fin-dPerW-h').textContent = 'On top of the base path (cons. $/W falls ~11%/yr)';
    $('#fin-siM-h').textContent = 'Cons. 2027 margin ' + (BC.siMargin[2]*100).toFixed(0) + '% · J.P. Morgan ' + (BJ.siMargin[2]*100).toFixed(0) + '%';

    const chartCfg = o => {
      const est = i => i > 0;
      if(metric === 'rev') return { labels:L, unit:'$B', fmt:v => '$' + num(v,0) + 'B', type:'bar', stacked:true, rowHead:'Year', total:false,
        series:[ { key:'sp', label:'Space', color:C.space, data:o.spaceRev.map(x => x/1000), stack:'m' },
                 { key:'co', label:'Starlink', color:C.conn, data:o.connRev.map(x => x/1000), stack:'m' },
                 { key:'si', label:'Compute (SI)', color:C.si, data:o.siRev.map(x => x/1000), stack:'m' },
                 { key:'cb', label:'Consensus total field', color:C.grey, type:'line', dash:true, stack:'cb', data:CONS.tot.rev.map(x => x/1000) },
                 { key:'jp', label:'J.P. Morgan', color:'#B45309', type:'line', dash:true, stack:'jp', data:JPM.rev.map(x => x/1000) } ],
        tableNote:'Bars: our model by segment. Lines: the Bloomberg total-revenue field and J.P. Morgan\'s published total.' };
      const line = (k, lab, cons, jpm, f, u) => ({ labels:L, unit:u, fmt:f, rowHead:'Year', type:'bar', stacked:false,
        series:[ { key:'m', label:'Our model · ' + lab, color:C.conn, data:o[k].map(x => k === 'eps' ? x : x/1000) },
                 { key:'c', label:'Bloomberg consensus', color:C.grey, type:'line', dash:true, data:cons },
                 { key:'j', label:'J.P. Morgan', color:'#B45309', type:'line', dash:true, data:jpm } ] });
      if(metric === 'ebitda') return line('ebitda', 'Adj. EBITDA', CONS.tot.ebitda.map(x => x/1000), JPM.ebitda.map(x => x/1000), v => '$' + num(v,0) + 'B', '$B');
      if(metric === 'fcf') return line('fcf', 'FCF', CONS.tot.fcf.map(x => x/1000), JPM.fcf.map(x => x == null ? null : x/1000), v => '$' + num(v,0) + 'B', '$B');
      return line('eps', 'diluted EPS (GAAP-like)', CONS.tot.epsGaap, JPM.epsGaap, v => '$' + num(v,2), '$/share');
    };
    pills('#fin-m', v => { metric = v; blk.set({ stacked:false, total:false, tableNote:'', ...chartCfg(MODEL.out) }); });
    pills('#fin-isv', v => { isView = v; drawTable(); });

    /* ── Income statement: Bloomberg consensus only (no model). 8 columns: 2023A–2025A reported, 2026E–2030E consensus.
          Consolidated lines: Bloomberg export (reported columns = 424B4). Segment actuals: 424B4 segment note. $M in, $B out. */
    const ISY = ['2023A','2024A','2025A','2026E','2027E','2028E','2029E','2030E'], NA = 3;
    const IS = {
      rev:[10387,14015,18674,49399.4,187354.8,340943.0,510344.6,683326.3], cogs:[6110,7996,9451,20798.9,71516.3,134950.7,184445.5,248610.7],
      gp:[4277,6019,9223,28228.8,114350.3,230355.6,336279.4,463355.7], rnd:[2105,3464,8643,18107.7,44196.4,59500.9,74154.8,94000.8],
      sga:[1665,1813,2644,5224.2,13378.6,20760.9,25631.0,33249.6], oi:[-3505,466,-2589,5900.7,77775.4,197254.8,290980.3,405811.2],
      da:[1897,2977,5915,13983.6,40433.1,74835.0,101752.7,140583.0], ebitda:[3821,5350,6584,25580.7,119658.4,238436.2,350817.9,486023.3],
      sbc:[679,784,1947,5941.2,12322.8,15401.2,15104.7,16384.6], netInt:[1444,1209,1453,862.7,6362.5,12417.6,15832.7,16763.6],
      pretax:[-4991,242,-4219,4466.9,65186.5,138618.7,225387.9,316479.4], tax:[-363,-549,718,-235.4,3076.9,1852.1,16171.1,47397.9],
      ni:[-4628,791,-4937,2542.2,49482.4,139237.4,217472.1,264255.8], sh:[2759,9956,2926,9388.7,12959.9,13143.8,13326.0,13444.9],
      eps:[-1.68,0.079,-1.69,0.275,4.22,8.528,13.189,18.006], epsAdj:[null,null,null,0.409,4.407,9.542,14.579,18.388],
      cfo:[4520,5776,6785,27418.7,120360.6,235882.3,343237.3,443392.2], capex:[4415,11163,20737,82425.0,263353.5,269456.9,307641.2,378429.7],
      fcf:[105,-5387,-13952,-58272.8,-140369.9,-58300.0,20545.3,70615.5],
      seg:{ space:{ n:'Space', rev:[3557,3796,4086,...CONS.space.rev.slice(1)], eb:[997,1154,653,...CONS.space.ebitda.slice(1)] },
            conn: { n:'Starlink (Connectivity)', rev:[3869,7599,11387,...CONS.conn.revField.slice(1)], eb:[1602,3849,7168,...CONS.conn.ebitda.slice(1)] },
            si:   { n:'SI — AI & compute', rev:[2961,2620,3201,...CONS.si.revField.slice(1)], eb:[1222,347,-1237,...CONS.si.ebitda.slice(1)] } },
      gw:[0,0.3,0.8,...CONS.si.gw.slice(1)], subs:[2.3,4.4,8.9,...CONS.conn.subs.slice(1)], arpu:[99,91,81,...CONS.conn.arpu.slice(1)]
    };
    const nb = x => x == null || isNaN(x) ? '—' : (x <= -50 ? '−' : '') + num(Math.abs(x) < 50 ? 0 : Math.abs(x)/1000, 1);
    const pc = x => x == null || !isFinite(x) ? '—' : (x < 0 ? '−' : '') + Math.abs(x*100).toFixed(1) + '%';
    const yoy = a => a.map((v,i) => (i === 0 || a[i-1] == null || v == null || a[i-1] <= 0 || v <= 0) ? null : v/a[i-1] - 1);
    const of = (a, b) => a.map((v,i) => v == null || !b[i] ? null : v/b[i]);
    const neg = a => a.map(v => v == null ? null : -v);
    const segSum = k => IS.rev.map((_,i) => IS.seg.space[k][i] + IS.seg.conn[k][i] + IS.seg.si[k][i]);
    /* row kinds: s = section header · m = main line (bold) · l = line · i = indented line · g = growth/margin (muted) · r = reconciling (grey) */
    const buildIS = () => {
      const R = [], S = t => R.push(['s', t]), M = (l, a) => R.push(['m', l, a.map(nb)]), L = (l, a, k) => R.push([k || 'l', l, a.map(nb)]),
            G = (l, a) => R.push(['g', l, a.map(pc)]);
      S('Revenue');
      M('Revenue', IS.rev); G('growth', yoy(IS.rev));
      Object.values(IS.seg).forEach(s => { L(s.n, s.rev, 'i'); G('growth', yoy(s.rev)); G('% of revenue', of(s.rev, IS.rev)); });
      L('Reconciling: segments vs total field', segSum('rev').map((v,i) => i < NA ? null : IS.rev[i] - v), 'r');
      S('Gross profit and operating costs');
      L('Cost of revenue', neg(IS.cogs)); G('% of revenue', of(IS.cogs, IS.rev));
      M('Gross profit', IS.gp); G('gross margin', of(IS.gp, IS.rev));
      L('Research & development', neg(IS.rnd)); G('% of revenue', of(IS.rnd, IS.rev));
      L('Selling, general & administrative', neg(IS.sga)); G('% of revenue', of(IS.sga, IS.rev));
      L('Restructuring, impairment & other · reconciling (est.)', IS.gp.map((g,i) => IS.oi[i] - (g - IS.rnd[i] - IS.sga[i])), 'r');
      M('Operating income', IS.oi); G('operating margin', of(IS.oi, IS.rev));
      S('Adjusted EBITDA (company definition)');
      L('Depreciation & amortization', IS.da); G('% of revenue', of(IS.da, IS.rev));
      L('Stock-based compensation', IS.sbc); G('% of revenue', of(IS.sbc, IS.rev));
      M('Adj. EBITDA', IS.ebitda); G('margin', of(IS.ebitda, IS.rev)); G('growth', yoy(IS.ebitda));
      Object.values(IS.seg).forEach(s => { L(s.n, s.eb, 'i'); G('segment margin', of(s.eb, s.rev)); });
      L('Reconciling: segments vs total field', segSum('eb').map((v,i) => i < NA ? null : IS.ebitda[i] - v), 'r');
      S('Operating income to EPS');
      L('Net interest', neg(IS.netInt));
      L('Other non-operating · reconciling (est.)', IS.pretax.map((p,i) => p - (IS.oi[i] - IS.netInt[i])), 'r');
      M('Pre-tax income', IS.pretax); G('pre-tax margin', of(IS.pretax, IS.rev));
      L('Income tax', neg(IS.tax)); G('effective tax rate', IS.tax.map((t,i) => IS.pretax[i] > 0 ? t/IS.pretax[i] : null));
      L('Minority interests · reconciling (est.)', IS.ni.map((n,i) => n - (IS.pretax[i] - IS.tax[i])), 'r');
      M('Net income', IS.ni); G('net margin', of(IS.ni, IS.rev));
      R.push(['l', 'Diluted shares (M)', IS.sh.map(x => num(x))]);
      R.push(['m', 'Diluted EPS, GAAP ($)', IS.eps.map(x => x < 0 ? '−' + num(-x,2) : num(x,2))]); G('growth', yoy(IS.eps));
      R.push(['i', 'Adjusted EPS, consensus ($)', IS.epsAdj.map(x => x == null ? '—' : num(x,2))]);
      S('Cash flow');
      L('Cash from operations', IS.cfo); G('% of revenue', of(IS.cfo, IS.rev));
      L('Capital expenditures', neg(IS.capex)); G('% of revenue', of(IS.capex, IS.rev));
      M('Free cash flow', IS.fcf); G('FCF margin', of(IS.fcf, IS.rev));
      S('Operating drivers');
      R.push(['l', 'Compute online, year-end (GW)', IS.gw.map(x => num(x,1))]);
      R.push(['l', 'Starlink subscribers, year-end (M)', IS.subs.map(x => num(x,1))]);
      R.push(['l', 'Starlink ARPU ($ / month)', IS.arpu.map(x => num(x,0))]);
      return R;
    };
    const drawTable = () => {
      const rows = buildIS().filter(r => isView === 'full' || (r[0] !== 'g'));
      const est = i => i >= NA ? ' est' : '', first = i => i === NA ? ' isx-cut' : '';
      $('#fin-t').innerHTML = '<table class="isx"><thead><tr><th>$B unless stated</th>' + ISY.map((y,i) => `<th class="${(est(i)+first(i)).trim()}">${y}</th>`).join('') + '</tr></thead><tbody>' +
        rows.map(r => r[0] === 's'
          ? `<tr class="isx-s"><td colspan="${ISY.length + 1}">${r[1]}</td></tr>`
          : `<tr class="isx-${r[0]}"><td>${r[1]}</td>${r[2].map((v,i) => `<td class="${(est(i)+first(i)).trim()}">${v}</td>`).join('')}</tr>`).join('') + '</tbody></table>';
    };

    MODEL.on(o => {
      const c = CONS.tot, i = 2;
      $('#fin-tiles').innerHTML =
        tile('Revenue 2027E', fmtB(o.rev[i],0), 'Consensus ' + fmtB(c.rev[i],0) + ' · JPM ' + fmtB(JPM.rev[i],0)) +
        tile('Adj. EBITDA 2027E', fmtB(o.ebitda[i],0), (o.ebitda[i]/o.rev[i]*100).toFixed(0) + '% margin · cons. ' + fmtB(c.ebitda[i],0)) +
        tile('Free cash flow 2027E', fmtB(o.fcf[i],0), 'CFO ' + fmtB(o.cfo[i],0) + ' − capex ' + fmtB(o.capex[i],0)) +
        tile('EPS 2027E / 2028E', '$' + num(o.eps[2],2) + ' / $' + num(o.eps[3],2), 'Cons. $' + num(c.epsGaap[2],2) + ' / $' + num(c.epsGaap[3],2) + ' GAAP');
      const st = MODEL.st, p = MODEL.PRESETS[st.scen];
      $('#fin-scnote').innerHTML = '<b>' + (p ? p.label : 'Custom') + ':</b> ' + (p ? p.note : 'drivers moved from a preset; the base paths are ' + (st.a.base === 'jpm' ? 'J.P. Morgan' : 'consensus') + '.');
      if(!blk) blk = chartBlock($('#fin-c'), chartCfg(o)); else blk.set({ stacked:false, total:false, tableNote:'', ...chartCfg(o) });
      drawTable();
      /* ARR grid with the model's point marked */
      const g = JPM.arrGrid, gwM = o.gw[2], pwM = o.perW[2];
      $('#fin-arr').innerHTML = table(['GW \\ $/W', ...g.perW.map(x => '$' + x)], g.gw.map(G => [G + ' GW', ...g.perW.map(W => { const hit = Math.abs(G - gwM) < 0.5 && Math.abs(W - pwM) < 5; return (hit ? '<b style="color:var(--accent)">' : '') + '$' + num(G*W) + 'B' + (hit ? '</b>' : ''); })]))
        + `<div class="snote" style="margin:0;border:none;border-top:1px solid var(--bdr);border-radius:0">Our model: ${num(gwM,1)} GW × $${num(pwM,1)}/W ≈ <b>$${num(gwM*pwM,0)}B</b> exit ARR on installed capacity. Management target $500B–1T; J.P. Morgan ~$400B.</div>`;
      const capGW = o.siCapex[2] / Math.max(0.05, o.gw[2] - o.gw[1]) / 1000, ebGW = o.perW[2] * o.siMargin[2];
      $('#fin-pb').innerHTML = `<div class="res" style="grid-template-columns:repeat(3,1fr);margin:6px 0 0">${tile('Capex per GW', '$' + num(capGW,1) + 'B', '2027, model')}${tile('EBITDA per GW-year', '$' + num(ebGW,1) + 'B', '$' + num(o.perW[2],1) + '/W × ' + (o.siMargin[2]*100).toFixed(0) + '%')}${tile('Payback', num(capGW/ebGW,1) + ' yrs', 'CFO: "payback of less than a year" at current pricing (Q3 call)')}</div>`;
    });
  }
});
