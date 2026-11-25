/* AI & compute (SI segment) — the revenue is real, so is the concentration */
registerView({ id:'si',
  html: `
  <div class="srow">
    ${tile('SI revenue · 9M26', usd(SI.total[1]), '<span class="up">+380%</span>; 40% of group revenue')}
    ${tile('Nameplate compute', SI.gw[1] + ' GW', 'From ' + SI.gw[0] + ' GW; plan: 13 GW by end-2027')}
    ${tile('Backlog', usd(SI.backlog,0), '~' + usd(SI.backlog12m,0) + ' expected within 12 months')}
    ${tile('Largest single client', (SI.custB3Q*100).toFixed(1) + '%', 'Customer B (SI only), of 3Q26 group revenue; 19.5% in 2Q26 (10-Q)')}
  </div>

  ${sec({ t:'Revenue, spend and profit', s:'Nine months against nine months. X advertising fell; rented compute is almost all the growth',
    ctl:`<div class="ctls">${seg('si-m','Metric',[['rev','Revenue'],['capex','Capex'],['ebitda','Adj. EBITDA']],'rev')}</div>`,
    b:`<div id="si-c"></div>`,
    n:'Q3 2026 release, $M; Cursor revenue from the Q3 call. SI capex was 83% of all company capex in 9M26. Cursor (acquired Aug 2026) added $608M of revenue to Sep 30.' })}

  ${sec({ t:'What customers pay per megawatt', s:'The premium is for build speed, the most imitable of the advantages',
    b:`<div id="si-p"></div>`,
    n:'Deutsche Bank (Jul 2026), estimates: ~$31M/MW Anthropic, ~$50M/MW Google vs ~$10–11M/MW other neoclouds; DB models normalisation to ~$10M/MW after Vera Rubin. Q3 2026 call: pricing is "tracking slightly above the high end of the $30 to $50 per watt range" (CFO); short-term contracts are "renewing at higher dollars per watt, not lower" (Musk).' })}

  ${sec({ t:'If the price per megawatt normalises', s:'Contracts are cancellable on 90 days; 2027 commitments are not ($25.6B, of which ~$19.6B is the EchoStar spectrum purchase)',
    b:`<div class="calc">
      <div class="inp">
        <label><div class="rv">Capacity rented to third parties <b id="si-g-v"></b></div><input type="range" id="si-g" min="0.5" max="6.5" step="0.05" value="0.85"><span class="h">GW; today ~50% of 1.7 GW (Musk: "50/50, more or less")</span></label>
        <label><div class="rv">Price per MW per year <b id="si-p-v"></b></div><input type="range" id="si-pr" min="5" max="60" step="1" value="31"><span class="h">$M; Anthropic ~31 · Google ~50 · neoclouds ~10–11</span></label>
      </div>
      <div><div class="res" id="si-res"></div><div id="si-r"></div></div>
    </div>`,
    n:'Our arithmetic, not a forecast: GW × 1,000 × $M/MW. At the defaults it reproduces the ~$2.3B/month run-rate of the three contracts. Commitments: Q3 2026 10-Q (2027: $25.6B, incl. the EchoStar spectrum purchase, ~$19.6B in stock and debt payoff, closing expected Nov 2027 per the 424B4). The comparison uses the ~$6.0B left after spectrum (our split).' })}

  ${sec({ t:'Contract terms that matter', s:'Anthropic is in the 424B4; the Google and Reflection AI terms are not in a SpaceX filing',
    b:`<div class="cols2"><div class="tw">${table(['Client','$ / month','Capacity','Runs to','Source'], CONTRACTS.map(c => [c.k, usd(c.perMonth), c.gpus + (c.mw ? ' · ~' + c.mw + ' MW (DB est.)' : ''), c.end, c.src]))}</div>
      <ul class="pl">
        <li><strong>Either party</strong> may terminate on 90 days’ notice after an initial ramp period (10-Q). For Google the exit right starts after Dec 31 2026 (Needham).</li>
        <li><strong>Short contracts at ~spot are a choice:</strong> "our approach is to rent at effectively the spot market rate" (Musk). Revenue follows the market both ways.</li>
        <li><strong>Google had a Sep 30 2026 delivery deadline</strong>, with a right to terminate or pay less after a month’s grace (Needham, Deutsche Bank). Whether it was met is not disclosed.</li>
        <li><strong>Our read — obsolescence sits in GPUs, not buildings:</strong> Colossus I (~100k H100, ~130 MW, sell-side estimates) backs the Anthropic contract to 2029.</li>
      </ul></div>`,
    n:'424B4 (Anthropic contract); Q3 2026 10-Q (90-day termination); Needham and Deutsche Bank, Jul 2026 (Google and Reflection AI terms, Google deadline); Q3 2026 call (Musk quote; Terafab test chip "approximately May or June of next year", volume production "around Q3 of 2028" at Gibbons Creek); UBS (Terafab capex ~$225B 2026–31).' })}
  `,
  init(){
    const L = ['9M 2025','9M 2026'];
    const M = {
      rev:{ unit:'$M', fmt:v => usd(v), stacked:true, total:true, series:[
            { key:'i', label:'Solutions & infrastructure', color:C.si, data:SI.infra, stack:'a' },
            { key:'a', label:'X advertising', color:C.grey, data:SI.ads, stack:'a' } ] },
      capex:{ unit:'$M', fmt:v => usd(v), series:[ { key:'c', label:'SI capex', color:C.si, data:SI.capex }, { key:'r', label:'SI R&D', color:C.steel, data:SI.rd } ] },
      ebitda:{ unit:'$M', fmt:v => usd(v), series:[ { key:'e', label:'SI adj. EBITDA', color:C.si, data:SI.ebitda } ],
               note:'Operating income was still ' + usd(IS9M.opinc.si[1]) + ' after depreciation of GPUs and buildings.' }
    };
    const mk = k => ({ labels:L, rowHead:'Period', height:'s', ...M[k], tableNote:M[k].note || '' });
    const blk = chartBlock($('#si-c'), mk('rev'));
    pills('#si-m', v => blk.set({ stacked:false, total:false, ...mk(v) }));

    chartBlock($('#si-p'), { labels:PERMW.map(r => r[0]), horizontal:true, height:'s', unit:'$M per MW per year', fmt:v => '$' + num(v,1) + 'M', rowHead:'Contract',
      series:[ { key:'p', label:'Price per MW per year', color:C.si, data:PERMW.map(r => r[1]) } ],
      tableNote:'Anthropic check: $1.25B × 12 ÷ ~480 MW ≈ $31M/MW. Clear Street models $33M → $10M/MW by 2030 while building 13.35 GW.' });

    let blk2 = null;
    const run = () => {
      const g = +$('#si-g').value, p = +$('#si-pr').value; const rev = g * 1000 * p, fx = RUN.fixed2027 - RUN.spectrum2027;   // $M per year; fx = 2027 commitments ex-spectrum
      $('#si-g-v').textContent = num(g,2) + ' GW'; $('#si-p-v').textContent = '$' + p + 'M';
      $('#si-res').innerHTML = tile('Annual rental revenue', usd(rev), usd(rev/12) + ' a month') +
        tile('2027 commitments ex-spectrum', usd(fx), 'Of ' + usd(RUN.fixed2027) + ' non-cancellable (Q3 10-Q)') +
        tile('Cover', (rev / fx).toFixed(1) + '×', 'Revenue ÷ commitments ex-spectrum');
      const cfg = { labels:['At ~$10M/MW','At your price','2027 commitments ex-spectrum'], unit:'$M per year', fmt:v => usd(v), rowHead:'', height:'s',
        series:[ { key:'r', label:'$ per year', color:C.si, data:[g*1000*10, rev, fx] } ] };
      if(!blk2) blk2 = chartBlock($('#si-r'), cfg); else blk2.set(cfg);
    };
    $('#si-g').oninput = run; $('#si-pr').oninput = run; run();
  }
});
