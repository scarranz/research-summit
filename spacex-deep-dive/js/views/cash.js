/* Cash & financing — Bloomberg consensus cash flow meets the balance sheet: how much new debt the plan needs, and what it does to leverage.
   The cash flow is ONLY Bloomberg consensus (CONS, Nov 25 2026). The only inputs are the financing choices that decide how the gap is filled.
   Those inputs live in MODEL.st.f (shared with Valuation, which reads the lease and any equity raised); no scenario driver is used here. */
const CASH_DRIVERS = [
  ['minCash',  'Minimum cash kept',          5000, 60000, 1000, v => fmtB(v,0), 'Debt is raised to stay above this'],
  ['rate',     'Rate on new debt',           4, 10, 0.1,       v => num(v,1) + '%', 'June bond: 5.86% coupon; 2031s now yield ~7.2%'],
  ['saturn',   'Off-balance GPU lease, 2027', 0, 100000, 1000, v => fmtB(v,0), 'Saturn trust (Nov 20): ~$32B notes at ~8.3%, 5-yr lease'],
  ['equity',   'New equity raised, 2027',    0, 150000, 5000, v => fmtB(v,0), 'Management told J.P. Morgan it is not considering it'],
  ['cashYield','Yield on cash',              0, 6, 0.1,        v => num(v,1) + '%', 'Interest income on liquidity']
];

/* Financing on top of the consensus cash flow. Index 1 = 4Q26 only (from Sep 30 2026), 2..5 = 2027E..2030E.
   Free cash flow = consensus CFO − consensus capex (so every table foots). Interest is computed for cost and coverage only:
   consensus CFO already carries the consensus's own interest, so it is not deducted a second time. */
function cashFinance(f){
  const T = CONS.tot, oldRate = f.oldRate != null ? f.oldRate : 6.0, leaseRate = f.leaseRate != null ? f.leaseRate : 8.26;
  const r = { cfo:[], capex:[], fcf:[], liq:[], debt:[], lease:[], newDebt:[], matur:[], leaseIn:[], leaseOut:[], equityIn:[],
              intExp:[], intInc:[], netInt:[], netDebt:[], lev:[], cover:[], ebitda:T.ebitda };
  r.cfo[1] = CONS.q4_26.cfo; r.capex[1] = CONS.q4_26.capex;
  for(let i = 2; i < 6; i++){ r.cfo[i] = T.cfo[i]; r.capex[i] = T.capex[i]; }
  for(let i = 1; i < 6; i++) r.fcf[i] = r.cfo[i] - r.capex[i];
  // 4Q26: Sep 30 balances + consensus 4Q26 cash flow; debt raised only if cash would fall below the minimum
  const pre26 = DEBT.liquidity + r.fcf[1], need26 = Math.max(0, f.minCash - pre26);
  r.liq[1] = pre26 + need26; r.newDebt[1] = need26; r.debt[1] = DEBT.bsTotal + need26; r.lease[1] = 0;
  r.matur[1] = 0; r.leaseIn[1] = 0; r.leaseOut[1] = 0; r.equityIn[1] = 0;
  r.netDebt[1] = r.debt[1] - r.liq[1]; r.lev[1] = r.debt[1] / Math.max(1, T.ebitda[1]);
  let oldDebt = DEBT.bsTotal, newStock = need26;
  for(let i = 2; i < 6; i++){
    const m = DEBT.maturities[String(2025 + i)] || 0;
    const leaseIn = i === 2 ? f.saturn : 0, leaseOut = i >= 3 ? f.saturn / 5 : 0, eq = i === 2 ? f.equity : 0;
    const pre = r.liq[i-1] + r.fcf[i] - m + leaseIn - leaseOut + eq, need = Math.max(0, f.minCash - pre);
    r.liq[i] = pre + need; r.newDebt[i] = need; r.matur[i] = m; r.leaseIn[i] = leaseIn; r.leaseOut[i] = leaseOut; r.equityIn[i] = eq;
    const oldBoy = oldDebt, newBoy = newStock; oldDebt = Math.max(0, oldDebt - m); newStock += need;
    r.debt[i] = oldDebt + newStock;
    r.lease[i] = Math.max(0, r.lease[i-1] + leaseIn - leaseOut);
    r.intExp[i] = (oldBoy + oldDebt) / 2 * oldRate / 100 + (newBoy + newStock) / 2 * f.rate / 100 + (r.lease[i-1] + r.lease[i]) / 2 * leaseRate / 100;
    r.intInc[i] = (r.liq[i-1] + r.liq[i]) / 2 * f.cashYield / 100;
    r.netInt[i] = r.intExp[i] - r.intInc[i];
    r.netDebt[i] = r.debt[i] + r.lease[i] - r.liq[i];
    r.lev[i] = (r.debt[i] + r.lease[i]) / Math.max(1, T.ebitda[i]);
    r.cover[i] = T.ebitda[i] / Math.max(1, r.intExp[i]);
  }
  r.cumNewDebt = r.newDebt.slice(2).reduce((a,b) => a + b, 0);
  r.consProceeds = T.debtProceeds.slice(2).reduce((a,b) => a + b, 0);
  r.peakLev = Math.max(...r.lev.slice(2));
  r.peakYear = MYEARS[2 + r.lev.slice(2).indexOf(r.peakLev)];
  /* 2027 by quarter: the shape of the consensus quarterly CFO and capex, scaled to the annual consensus so YE27 ties to the yearly view */
  const sC = CONS.q27.cfo.reduce((a,b) => a + b, 0), sK = CONS.q27.capex.reduce((a,b) => a + b, 0);
  let pre = r.liq[1], post = r.liq[1]; r.q27 = { pre:[pre], post:[post], raise:[0] };
  for(let q = 0; q < 4; q++){
    const flow = r.cfo[2] * CONS.q27.cfo[q] / sC - r.capex[2] * CONS.q27.capex[q] / sK - (q === 3 ? r.matur[2] : 0) + (q === 0 ? r.leaseIn[2] + r.equityIn[2] : 0);
    pre += flow; post += flow; let raise = 0; if(post < f.minCash){ raise = f.minCash - post; post = f.minCash; }
    r.q27.pre.push(pre); r.q27.post.push(post); r.q27.raise.push(raise);
  }
  const L = ['YE26','1Q27','2Q27','3Q27','4Q27'], k = r.q27.pre.findIndex(x => x < 0);
  r.runOut = k < 0 ? null : L[k];
  r.q27sum = { cfo:sC, capex:sK };
  return r;
}

registerView({ id:'cash',
  css: `#v-cash .cbr{display:flex;flex-direction:column;gap:4px;max-width:900px}
#v-cash .cbr-r{display:grid;grid-template-columns:210px 1fr 80px;align-items:center;gap:12px;font-size:12px;color:var(--navy)}
#v-cash .cbr-tot{font-weight:700}
#v-cash .cbr-t{position:relative;height:20px;background:var(--pale);border-radius:4px}
#v-cash .cbr-bar{position:absolute;top:3px;bottom:3px;border-radius:3px;min-width:2px}
#v-cash .cbr-bar.up{background:#16A34A}#v-cash .cbr-bar.dn{background:#DC2626}#v-cash .cbr-bar.tot{background:#1E2733}
#v-cash .cbr-zero{position:absolute;top:0;bottom:0;width:1px;background:var(--mid)}
#v-cash .cbr-v{text-align:right;font-variant-numeric:tabular-nums}#v-cash .cbr-v.up{color:#16A34A}#v-cash .cbr-v.dn{color:#DC2626}
#v-cash .cbr-n{font-size:11.5px;color:var(--mu);margin-top:8px}
@media(max-width:700px){#v-cash .cbr-r{grid-template-columns:120px 1fr 64px}}`,
  html: `
  <div class="srow" id="cash-tiles"></div>

  ${sec({ t:'Funding the plan', s:'The cash flow is Bloomberg consensus; you choose only how the gap is filled',
    b:`<div class="calc">
      <div class="inp">${sliderHTML('cash', CASH_DRIVERS)}
        <button class="fb" id="cash-reset" style="align-self:flex-start;border:1px solid var(--bdr);border-radius:8px;padding:6px 10px">Reset financing inputs</button></div>
      <div><div class="res" id="cash-res"></div>
        <div class="ctls" style="margin-bottom:10px">${seg('cash-v','View',[['q','2027 by quarter'],['y','2026–2030 by year'],['l','Leverage']],'q')}</div>
        <div id="cash-c"></div></div>
    </div>`,
    n:'<b>Cash flow = Bloomberg consensus (Nov 25 2026); only the financing choices are inputs.</b> Start: liquidity $89.9B and debt $38.8B at Sep 30 2026 (Q3 release), plus consensus 4Q26 CFO ($14.8B) less capex ($37.5B). Free cash flow = consensus CFO − consensus capex. 2027 quarters follow the shape of the consensus quarterly CFO and capex, scaled to the annual consensus so the year end ties to the yearly view. Existing debt is charged 6.0%; the off-balance lease is treated as debt-like, drawn in 1Q27 and repaid evenly from 2028 at 8.26%. Interest is shown for cost and coverage only (consensus CFO already carries interest), so it is not deducted again. Own arithmetic, not a forecast.' })}

  ${sec({ t:'Sources and uses, year by year', s:'Consensus cash flow on top; new debt is the plug that keeps cash at the minimum; consensus debt in grey for reference',
    b:`<div id="cash-su"></div>
      <div class="ctls" style="margin:18px 0 10px">${seg('cash-by','How the cash moves in',[['1','4Q26E'],['2','2027E'],['3','2028E'],['4','2029E'],['5','2030E']],'2')}</div>
      <div class="cbr" id="cash-br"></div>
      <details class="tbl" style="margin-top:14px"><summary>Sources and uses — full table</summary><div class="tw" id="cash-t"></div></details>`,
    n:'Cash flow lines: Bloomberg consensus (BEst), "SPCX BBG CONSENSUS.xlsx", pulled Nov 25 2026. The consensus FCF line and the CFO and capex lines come from different contributor sets, so CFO − capex does not equal the FCF line; the plug uses CFO − capex. Maturities: 10-Q Q2 2026 note 9. Other references: J.P. Morgan models ~$330B of debt raised in 2026–2030 and positive FCF from 2029; Clear Street / Cestrian: ~$65B of liquidity at YE26 and ~5 quarters of runway at the trailing burn.' })}

  ${sec({ t:'The debt today', s:'On the balance sheet, $38.8B; off it, the new GPU lease',
    ctl:`<div class="ctls">${seg('cash-d','Show',[['s','Debt stack'],['f','9M 2026 sources & uses']],'s')}</div>`,
    b:`<div class="cols2"><div id="cash-dc"></div>
      <div><div class="pt">June 2026 bond, $25B in five tranches</div>
        <div class="tw">${table(['Matures','Coupon'], DEBT.tranches.map(t => ['Jul 15 ' + t[0], t[1].toFixed(3) + '%']))}</div>
        <ul class="pl" style="margin-top:12px">
          <li><strong>Weighted:</strong> ${DEBT.bondCoupon}% coupon, ${DEBT.bondEff}% effective, ${DEBT.bondWAM} years. Repaid the $20B bridge loan in full.</li>
          <li><strong>Saturn Funding Trust (Nov 20):</strong> ~$${num(DEBT.saturn.notes/1000)}B of notes (package ~$${num(DEBT.saturn.package/1000)}B) buy ~$${num(DEBT.saturn.gpus/1000,1)}B of Nvidia GPUs leased to SpaceX for ~5 years; A-3 class ~$25.2B at <strong>${DEBT.saturn.yieldA3}%</strong>; ${DEBT.saturn.rating}. SpaceX pays even if it does not use the chips.</li>
          <li><strong>Maturities</strong> are light until 2031: $2.4B in 2027, $2.9B in 2028, $3.4B in 2029, $3.6B in 2030.</li>
          <li><strong>Covenants:</strong> the bridge loan's 3.75× leverage test went with it; the bond limits liens (7.5% of assets) and mergers.</li>
        </ul></div></div>`,
    n:'10-Q Q2 2026 note 9 (Jun 30 split, maturities, tranche coupons) and note 17 (Valor); Q3 2026 release (Sep 30 total $38.8B, of which $12.9B related party). Saturn: Bloomberg (Nov 17, 20–21 2026), Moody\'s/KBRA via press; tranche sizes not confirmed against the offering memorandum. Dilution and related parties: see Management & ownership.' })}
  `,
  init(){
    wireSliders('cash', 'f', CASH_DRIVERS);
    $('#cash-reset').onclick = () => MODEL.resetFin();
    let view = 'q', blk = null, dview = 's', dblk = null, R = null;
    const Y = ['YE26','2027E','2028E','2029E','2030E'];
    const cfg = r => {
      if(view === 'q') return { labels:['YE26','1Q27','2Q27','3Q27','4Q27'], unit:'$B', fmt:v => (v < 0 ? '−' : '') + '$' + num(Math.abs(v),0) + 'B', rowHead:'Quarter end', type:'line', stacked:false,
        series:[ { key:'pre', label:'Liquidity before any new debt', color:C.neg, type:'line', dash:true, data:r.q27.pre.map(x => x/1000) },
                 { key:'post', label:'Liquidity with new debt', color:C.conn, type:'line', data:r.q27.post.map(x => x/1000) },
                 { key:'raise', label:'Debt raised in the quarter', color:C.fog, type:'bar', data:r.q27.raise.map(x => x/1000) } ],
        extra: c => { c.options.scales.y.grid = { color: ctx => ctx.tick.value === 0 ? '#1E2733' : '#EEF1F5' }; },
        tableNote:'Before new debt, cash runs out in ' + (r.runOut || 'no quarter of 2027') + '. The off-balance lease and any equity land in 1Q27; the 2027 maturity in 4Q27. Quarterly consensus as filed sums to CFO ' + fmtB(r.q27sum.cfo,1) + ' and capex ' + fmtB(r.q27sum.capex,1) + ' (annual: ' + fmtB(r.cfo[2],1) + ' and ' + fmtB(r.capex[2],1) + '); only its shape is used.' };
      if(view === 'y') return { labels:Y, unit:'$B', fmt:v => (v < 0 ? '−' : '') + '$' + num(Math.abs(v),0) + 'B', rowHead:'Year end', type:'bar', stacked:true,
        series:[ { key:'d', label:'Debt', color:C.steel, data:r.debt.slice(1).map(x => x/1000), stack:'d' },
                 { key:'l', label:'GPU lease (debt-like)', color:C.sky, data:r.lease.slice(1).map(x => x/1000), stack:'d' },
                 { key:'c', label:'Liquidity', color:C.pos, type:'line', stack:'c', data:r.liq.slice(1).map(x => x/1000) },
                 { key:'cb', label:'Consensus total debt', color:C.grey, type:'line', dash:true, stack:'cb', data:CONS.tot.debt.slice(1).map(x => x/1000) } ],
        tableNote:'Debt and liquidity: our plug on the consensus cash flow. Grey: Bloomberg consensus total debt (its own financing assumptions).' };
      return { labels:Y.slice(1), unit:'×', fmt:v => num(v,1) + '×', rowHead:'Year', type:'bar', stacked:false,
        series:[ { key:'lev', label:'Debt (incl. lease) ÷ consensus EBITDA', color:C.steel, data:r.lev.slice(2) },
                 { key:'cov', label:'Consensus EBITDA ÷ interest', color:C.sky, type:'line', data:r.cover.slice(2) } ],
        tableNote:'Rough marker: investment-grade issuers in capital-heavy sectors tend to sit below ~3× debt/EBITDA; the agencies also weigh the off-balance lease as debt. Our marker, not a covenant.' };
    };
    const reset = { stacked:false, total:false, tableNote:'', extra:null };
    pills('#cash-v', v => { view = v; blk.set({ ...reset, ...cfg(R) }); });

    const dcfg = () => dview === 's'
      ? { labels:[...DEBT.stack.map(r => r[0]), 'Saturn GPU lease (off balance)'], horizontal:true, unit:'$B', fmt:v => '$' + num(v,1) + 'B', rowHead:'Instrument',
          series:[ { key:'on', label:'On balance sheet (Jun 30)', color:C.steel, data:[...DEBT.stack.map(r => r[1]/1000), null], stack:'a' },
                   { key:'off', label:'Off balance sheet (Nov 2026)', color:C.sky, data:[null,null,null,null, DEBT.saturn.notes/1000], stack:'a' } ], stacked:true,
          tableNote:DEBT.stack.filter(r => r[2]).map(r => '<b>' + r[0] + '</b>: ' + r[2]).join(' · ') }
      : (() => { const f = FUND.slice().sort((a,b) => b[1]-a[1]); return { labels:f.map(r => r[0]), horizontal:true, unit:'$M', fmt:v => usd(v), rowHead:'Item', stacked:true,
          series:[ { key:'in', label:'Source', color:C.steel, data:f.map(r => r[1] > 0 ? r[1] : null), stack:'a' },
                   { key:'out', label:'Use', color:C.neg, data:f.map(r => r[1] < 0 ? r[1] : null), stack:'a' } ],
          tableNote:'9M 2026 cash flow statement. They bought back $4.4B of stock while issuing $8.3B and burning $35B, and paid $1.15B premium + $1.5B book loss to retire debt early.' }; })();
    dblk = chartBlock($('#cash-dc'), dcfg());
    pills('#cash-d', v => { dview = v; dblk.set({ tableNote:'', ...dcfg() }); });

    const mu = s => '<span style="color:var(--mu)">' + s + '</span>';
    let suBlk = null, brY = 2;
    /* Bridge: opening liquidity → each flow → closing liquidity, as horizontal bars on one scale */
    const drawBridge = r => {
      const i = brY, open = i === 1 ? DEBT.liquidity : r.liq[i-1], per = i === 1 ? '4Q26E' : MYEARS[i];
      const steps = [ ['Cash from operations', r.cfo[i]], ['Capex', -r.capex[i]], ['Debt maturities', -(r.matur[i] || 0)],
        ['GPU lease drawn', r.leaseIn[i] || 0], ['GPU lease repaid', -(r.leaseOut[i] || 0)], ['Equity raised', r.equityIn[i] || 0], ['New debt raised', r.newDebt[i] || 0] ]
        .filter(s => Math.abs(s[1]) >= 1);
      let run = open; const pts = [open];
      steps.forEach(s => { run += s[1]; pts.push(run); });
      const lo = Math.min(0, ...pts), hi = Math.max(...pts), span = hi - lo || 1, X = v => ((v - lo) / span * 100).toFixed(2) + '%';
      const bar = (a, b, cls) => `<div class="cbr-bar ${cls}" style="left:${X(Math.min(a,b))};width:calc(${X(Math.max(a,b))} - ${X(Math.min(a,b))})"></div>`;
      const row = (lab, val, a, b, cls, bold) => `<div class="cbr-r${bold ? ' cbr-tot' : ''}"><div class="cbr-l">${lab}</div><div class="cbr-t">${lo < 0 ? `<div class="cbr-zero" style="left:${X(0)}"></div>` : ''}${bar(a, b, cls)}</div><div class="cbr-v ${cls}">${(val < 0 ? '−' : cls === 'up' ? '+' : '') + '$' + num(Math.abs(val) / 1000, 1) + 'B'}</div></div>`;
      let h = row((i === 1 ? 'Liquidity, Sep 30 2026' : 'Liquidity, start of ' + per.slice(0,4)), open, lo < 0 ? 0 : lo, open, 'tot', true);
      run = open;
      steps.forEach(([l, v]) => { h += row(l, v, run, run + v, v >= 0 ? 'up' : 'dn'); run += v; });
      h += row('Liquidity, end of ' + per, run, lo < 0 ? 0 : lo, run, 'tot', true);
      $('#cash-br').innerHTML = h + `<div class="cbr-n">${per}: consensus free cash flow ${fmtB(r.fcf[i], 1)}; new debt needed ${fmtB(r.newDebt[i] || 0, 1)} to keep at least ${fmtB(MODEL.st.f.minCash, 0)} of cash.</div>`;
    };
    pills('#cash-by', v => { brY = +v; drawBridge(R); });
    MODEL.on((o, st) => {
      const r = R = cashFinance(st.f);
      $('#cash-tiles').innerHTML =
        tile('Liquidity · Sep 30', usd(BS.liquidity), 'Debt ' + usd(BS.debt) + ' · net cash ' + usd(BS.liquidity - BS.debt)) +
        tile('Liquidity at YE26', fmtB(r.liq[1],0), 'Consensus 4Q26 free cash flow ' + fmtB(r.fcf[1],1)) +
        tile('New debt needed 2027–30', fmtB(r.cumNewDebt,0), 'Of which 2027: ' + fmtB(r.newDebt[2],0) + ' · consensus debt proceeds ' + fmtB(r.consProceeds,0)) +
        tile('Peak debt ÷ EBITDA', num(r.peakLev,1) + '×', 'Incl. the GPU lease · ' + r.peakYear + ' · consensus EBITDA');
      $('#cash-res').innerHTML = tile('Free cash flow 2027', fmtB(r.fcf[2],0), 'Consensus CFO − capex') +
        tile('Cash runs out (no new debt)', r.runOut || 'Not in 2027', 'Quarter liquidity turns negative') +
        tile('Net interest 2027', fmtB(r.netInt[2],1), 'On this debt path; cost and coverage only');
      const c = cfg(r); if(!blk) blk = chartBlock($('#cash-c'), c); else blk.set({ ...reset, ...c });
      const B = x => x == null || isNaN(x) ? '—' : num(x/1000,1), cols = [1,2,3,4,5];
      const rows = [
        ['Cash from operations (consensus)', cols.map(i => B(r.cfo[i]))], ['Capex (consensus)', cols.map(i => B(-r.capex[i]))],
        ['<b>Free cash flow</b>', cols.map(i => '<b>' + B(r.fcf[i]) + '</b>')],
        ['Debt maturities', cols.map(i => B(-r.matur[i]))], ['GPU lease drawn / (repaid)', cols.map(i => B(r.leaseIn[i] - r.leaseOut[i]))],
        ['Equity raised', cols.map(i => B(r.equityIn[i]))], ['<b>New debt needed</b>', cols.map(i => '<b>' + B(r.newDebt[i]) + '</b>')],
        ['Interest expense', cols.map(i => i === 1 ? '—' : B(-r.intExp[i]))], ['Interest income', cols.map(i => i === 1 ? '—' : B(r.intInc[i]))],
        ['Liquidity, year end', cols.map(i => B(r.liq[i]))], ['Debt + lease, year end', cols.map(i => B(r.debt[i] + r.lease[i]))],
        ['Net debt (cash)', cols.map(i => B(r.netDebt[i]))], ['Debt ÷ consensus EBITDA', cols.map(i => num(r.lev[i],1) + '×')],
        ['Consensus EBITDA ÷ interest', cols.map(i => i === 1 ? '—' : num(r.cover[i],1) + '×')],
        [mu('Consensus: FCF line'), cols.map(i => mu(i === 1 ? '—' : B(CONS.tot.fcf[i])))],
        [mu('Consensus: debt proceeds'), cols.map(i => mu(i === 1 ? '—' : B(CONS.tot.debtProceeds[i])))],
        [mu('Consensus: total debt, year end'), cols.map(i => mu(B(CONS.tot.debt[i])))] ];
      $('#cash-t').innerHTML = table(['$B', '4Q26E', ...cols.slice(1).map(i => MYEARS[i])], rows.map(([l, a]) => [l, ...a]), new Set([1,2,3,4,5]));
      /* Visual: sources up, uses down, liquidity as a line; then a bridge for one period */
      const PL = ['4Q26E', ...cols.slice(1).map(i => MYEARS[i])], b$ = x => (x || 0) / 1000;
      const suCfg = { labels:PL, unit:'$B', fmt:v => (v < 0 ? '−' : '') + '$' + num(Math.abs(v), 0) + 'B', rowHead:'Period', type:'bar', stacked:true,
        tableNote:'Above zero: where the cash comes from. Below zero: where it goes. Line: liquidity at the end of each period. New debt is the plug that keeps liquidity at the minimum you set.',
        series:[ { key:'cfo', label:'Cash from operations', color:C.pos, data:cols.map(i => b$(r.cfo[i])), stack:'s' },
                 { key:'nd',  label:'New debt raised', color:C.steel, data:cols.map(i => b$(r.newDebt[i])), stack:'s' },
                 { key:'li',  label:'GPU lease drawn', color:C.sky, data:cols.map(i => r.leaseIn[i] ? b$(r.leaseIn[i]) : null), stack:'s' },
                 { key:'eq',  label:'Equity raised', color:C.space, data:cols.map(i => r.equityIn[i] ? b$(r.equityIn[i]) : null), stack:'s' },
                 { key:'cx',  label:'Capex', color:C.neg, data:cols.map(i => -b$(r.capex[i])), stack:'s' },
                 { key:'mt',  label:'Debt maturities', color:C.grey, data:cols.map(i => r.matur[i] ? -b$(r.matur[i]) : null), stack:'s' },
                 { key:'lo',  label:'GPU lease repaid', color:C.fog, data:cols.map(i => r.leaseOut[i] ? -b$(r.leaseOut[i]) : null), stack:'s' },
                 { key:'lq',  label:'Liquidity, period end', color:C.si, type:'line', stack:'lq', data:cols.map(i => b$(r.liq[i])) } ] };
      if(!suBlk) suBlk = chartBlock($('#cash-su'), suCfg); else suBlk.set({ ...reset, ...suCfg });
      drawBridge(r);
    });
  }
});
