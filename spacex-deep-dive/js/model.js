/* ═════════════ MODEL — one engine shared by Financials, Cash & financing and Valuation ═════════════
   How it works
   · A "base" is a full set of yearly paths taken from a source: Bloomberg consensus (CONS) or J.P. Morgan (JPM).
   · The sliders move the 2027 level of a few drivers; every later year moves with it, so the default
     settings of the Consensus scenario reproduce the consensus segment fields.
   · Financials → cash flow from operations and capex → Cash & financing (how much debt is needed, interest)
     → interest feeds back into net income and cash flow (solved by iteration) → Valuation.
   Everything is in $ millions unless a label says otherwise. Index 0 = 2025A, 1..5 = 2026E..2030E. */

const MODEL = (() => {
  const N = 6, FY = [1,2,3,4,5];
  const avgOf = gw => gw.map((g,i) => i ? (gw[i-1] + g) / 2 : null);
  const sum = (...a) => a.reduce((x,y) => x + (y || 0), 0);

  /* ---------- bases ---------- */
  function consBase(){
    const c = CONS, gw = c.si.gw.slice(), avg = avgOf(gw);
    const siCapex = c.tot.capex.map((t,i) => t - c.space.capex[i] - c.conn.capex[i]);           // residual, so FCF matches the consensus FCF field
    const segE = c.tot.rev.map((_,i) => c.space.ebitda[i] + c.conn.ebitda[i] + c.si.ebitda[i]);
    return {
      key:'cons', gw, perW: c.si.infra.map((x,i) => i ? x / (avg[i]*1000) : null),
      ads: c.si.ads.slice(), siMargin: c.si.ebitda.map((e,i) => e / (c.si.ads[i] + c.si.infra[i])),
      capGW: siCapex.map((x,i) => i ? x / Math.max(0.05, gw[i] - gw[i-1]) : null), siCapex,
      subs: c.conn.subs.slice(), arpu: c.conn.arpu.slice(),
      consumer: c.conn.consumer.slice(), entgov: c.conn.entgov.slice(),
      connMargin: c.conn.ebitda.map((e,i) => e / (c.conn.consumer[i] + c.conn.entgov[i])), connCapex: c.conn.capex.slice(),
      spaceRev: c.space.rev.slice(), spaceEbitda: c.space.ebitda.slice(), spaceCapex: c.space.capex.slice(),
      wc: c.tot.cfo.map((x,i) => x - (segE[i] - c.tot.netInt[i] - c.tot.tax[i])),
      taxRate: c.tot.tax.map((t,i) => c.tot.pretax[i] > 0 ? Math.max(0, t / c.tot.pretax[i]) : 0)
    };
  }
  function jpmBase(){
    const j = JPM, c = CONS, cb = consBase(), gw = j.si.gw.slice(), avg = avgOf(gw);
    const infra = j.si.rev.map((r,i) => r - c.si.ads[i]);
    const share = c.conn.consumer.map((x,i) => x / (x + c.conn.entgov[i]));
    return { ...cb, key:'jpm', gw,
      perW: infra.map((x,i) => i ? x / (avg[i]*1000) : null), ads: c.si.ads.slice(),
      siMargin: j.si.ebitda.map((e,i) => e / j.si.rev[i]),
      capGW: j.si.capex.map((x,i) => i ? x / Math.max(0.05, gw[i] - gw[i-1]) : null), siCapex: j.si.capex.slice(),
      subs: j.conn.subs.slice(), arpu: j.conn.arpu.slice(),
      consumer: j.conn.rev.map((r,i) => r * share[i]), entgov: j.conn.rev.map((r,i) => r * (1 - share[i])),
      connMargin: j.conn.ebitda.map((e,i) => e / j.conn.rev[i]), connCapex: j.conn.capex.slice(),
      spaceRev: j.space.rev.slice(), spaceEbitda: j.space.ebitda.slice(), spaceCapex: j.space.capex.slice() };
  }
  const BASES = { cons: consBase(), jpm: jpmBase() };
  const consSegRev = CONS.tot.rev.map((_,i) => CONS.space.rev[i] + CONS.conn.consumer[i] + CONS.conn.entgov[i] + CONS.si.ads[i] + CONS.si.infra[i]);
  const consAvgGW = avgOf(CONS.si.gw);

  /* default driver values read off a base (2027 = index 2) */
  /* exact base values, so the preset reproduces its source; sliders only round what they display */
  const driversOf = b => ({ base:b.key, gw27:b.gw[2], addMult:100, perW27:b.perW[2], dPerW:0, siM:0,
                            capGW27:b.capGW[2]/1000, subs27:b.subs[2], arpu27:b.arpu[2] });
  const FIN0 = { rate:6.0, saturn:32000, minCash:20000, equity:0, cashYield:4.0, oldRate:6.0, leaseRate:8.26 };

  const PRESETS = {
    bear: { label:'Bear', note:'Slower build (7 GW at YE27), rental price normalising toward $10–15/W by 2030, lower SI margin, costlier GW, softer Starlink',
            a:{ ...driversOf(BASES.cons), gw27:7, addMult:70, perW27:20, dPerW:-8, siM:-10, capGW27:40, subs27:24, arpu27:56 },
            v:{ pe:15, evx:10, ke:11, wacc:10.5, exitX:10, g:2.5 } },
    cons: { label:'Consensus', note:'Bloomberg consensus segment estimates, unchanged',
            a:driversOf(BASES.cons), v:{ pe:20, evx:14, ke:10, wacc:9.5, exitX:14, g:3 } },
    jpm:  { label:'J.P. Morgan', note:'J.P. Morgan Oct 21 2026 estimates run through our engine (their PT: 20× 2028E GAAP EPS)',
            a:driversOf(BASES.jpm), v:{ pe:20, evx:14, ke:10, wacc:9.5, exitX:14, g:3 } },
    bull: { label:'Bull', note:'Musk\'s own targets: 13 GW at YE27 (Q3 call) earning ~$38/W, so ~$500B exit ARR, his "best guess" (Baron, Nov 6); build at ~60% of industry cost (TomorrowX, Nov 18); stronger Starlink',
            a:{ ...driversOf(BASES.cons), gw27:13, addMult:120, perW27:38, dPerW:0, siM:5, capGW27:30, subs27:29.5, arpu27:61 },
            v:{ pe:25, evx:18, ke:9.5, wacc:9, exitX:18, g:3.5 } }
  };

  /* ---------- the engine ---------- */
  function run(a, f, vIn){
    const b = BASES[a.base];
    const o = { gw:[], avg:[], perW:[], infra:[], ads:[], siRev:[], siEbitda:[], siMargin:[], siCapex:[], siDA:[],
                subs:[], arpu:[], consumer:[], entgov:[], connRev:[], connEbitda:[], connCapex:[], connDA:[],
                spaceRev:[], spaceEbitda:[], spaceCapex:[], spaceDA:[],
                rev:[], ebitda:[], da:[], sbc:[], netInt:[], intExp:[], intInc:[], pretax:[], tax:[], ni:[], shares:[], eps:[],
                wc:[], cfo:[], capex:[], fcf:[], ufcf:[] };
    for(let i = 0; i < N; i++){
      const fx = i >= 2;                                    // driver years: 2027E onward
      o.gw[i] = i < 2 ? b.gw[i] : i === 2 ? a.gw27 : o.gw[i-1] + Math.max(0, b.gw[i] - b.gw[i-1]) * a.addMult / 100;
      o.avg[i] = i ? (o.gw[i-1] + o.gw[i]) / 2 : null;
      o.perW[i] = i ? (fx ? b.perW[i] * (a.perW27 / b.perW[2]) * Math.pow(1 + a.dPerW/100, i - 2) : b.perW[i]) : null;
      o.ads[i] = b.ads[i];
      o.infra[i] = i ? o.perW[i] * o.avg[i] * 1000 : CONS.si.infra[0];
      o.siRev[i] = o.ads[i] + o.infra[i];
      o.siMargin[i] = b.siMargin[i] + (fx ? a.siM / 100 : 0);
      o.siEbitda[i] = o.siRev[i] * o.siMargin[i];
      const capGW = i ? b.capGW[i] * (fx ? (a.capGW27 * 1000) / b.capGW[2] : 1) : null;
      o.siCapex[i] = i ? (i < 2 ? b.siCapex[i] : Math.max(0, o.gw[i] - o.gw[i-1]) * capGW) : b.siCapex[0];
      o.siDA[i] = i ? CONS.si.da[i] * o.avg[i] / consAvgGW[i] : CONS.si.da[0];

      o.subs[i] = fx ? b.subs[i] * a.subs27 / b.subs[2] : b.subs[i];
      o.arpu[i] = fx ? b.arpu[i] * a.arpu27 / b.arpu[2] : b.arpu[i];
      const kb = i ? ((b.subs[i-1] + b.subs[i]) / 2) * b.arpu[i] : 1, km = i ? ((o.subs[i-1] + o.subs[i]) / 2) * o.arpu[i] : 1;
      o.consumer[i] = b.consumer[i] * km / kb; o.entgov[i] = b.entgov[i];
      o.connRev[i] = o.consumer[i] + o.entgov[i]; o.connEbitda[i] = o.connRev[i] * b.connMargin[i];
      o.connCapex[i] = b.connCapex[i]; o.connDA[i] = CONS.conn.da[i];

      o.spaceRev[i] = b.spaceRev[i]; o.spaceEbitda[i] = b.spaceEbitda[i]; o.spaceCapex[i] = b.spaceCapex[i]; o.spaceDA[i] = CONS.space.da[i];

      o.rev[i] = o.spaceRev[i] + o.connRev[i] + o.siRev[i];
      o.ebitda[i] = o.spaceEbitda[i] + o.connEbitda[i] + o.siEbitda[i];
      o.da[i] = o.spaceDA[i] + o.connDA[i] + o.siDA[i];
      o.sbc[i] = CONS.tot.sbc[i];
      o.capex[i] = o.spaceCapex[i] + o.connCapex[i] + o.siCapex[i];
      o.wc[i] = b.wc[i] * o.rev[i] / consSegRev[i];
    }
    /* financing ↔ interest, solved by iteration (interest uses average balances) */
    let netInt = CONS.tot.netInt.slice(), fin = null;
    for(let it = 0; it < 6; it++){
      for(let i = 0; i < N; i++){
        o.netInt[i] = netInt[i];
        o.pretax[i] = o.ebitda[i] - o.da[i] - o.sbc[i] - o.netInt[i];
        o.tax[i] = Math.max(0, o.pretax[i] * b.taxRate[i]);
        o.ni[i] = o.pretax[i] - o.tax[i];
        o.cfo[i] = o.ebitda[i] - o.netInt[i] - o.tax[i] + o.wc[i];
        o.fcf[i] = o.cfo[i] - o.capex[i];
      }
      fin = finance(o, f);
      netInt = o.netInt.map((x,i) => i >= 2 ? fin.netInt[i] : x);
    }
    for(let i = 0; i < N; i++){
      o.shares[i] = CONS.tot.shares[i] + (i >= 2 ? fin.newShares : 0);
      o.eps[i] = o.ni[i] / o.shares[i];
      o.ufcf[i] = o.fcf[i] + o.netInt[i] * (1 - b.taxRate[i]);
    }
    /* 2025 is reported: show the actual lines below EBITDA rather than the engine's reconstruction */
    const t = CONS.tot;
    o.netInt[0] = t.netInt[0]; o.pretax[0] = t.pretax[0]; o.tax[0] = t.tax[0]; o.ni[0] = t.pretax[0] - t.tax[0];
    o.cfo[0] = t.cfo[0]; o.capex[0] = t.capex[0]; o.fcf[0] = t.fcf[0]; o.shares[0] = t.shares[0]; o.eps[0] = t.epsGaap[0];
    o.intExp = fin.intExp; o.intInc = fin.intInc;
    o.fin = fin; o.a = a; o.f = f;
    if(vIn) o.val = value(o, vIn);
    return o;
  }

  /* Cash & financing, annual from Sep 30 2026. Saturn-type lease drawn in 2027 and amortised over 5 years from 2028. */
  function finance(o, f){
    const Y = ['2026','2027','2028','2029','2030'];
    const r = { liq:[], debt:[], lease:[], newDebt:[], matur:[], leaseIn:[], leaseOut:[], equityIn:[], netInt:[], intExp:[], intInc:[],
                netDebt:[], lev:[], cover:[], liqPre:[], newShares:0 };
    const fcf9M = IS9M.fcf[1];
    // 2026: Sep 30 balances + 4Q26 free cash flow (model year minus 9M actual); no new debt assumed
    const q4 = o.fcf[1] - fcf9M;
    r.liq[1] = DEBT.liquidity + q4; r.debt[1] = DEBT.bsTotal; r.lease[1] = 0; r.newDebt[1] = 0; r.liqPre[1] = r.liq[1];
    r.netInt[1] = o.netInt[1]; r.intExp[1] = null; r.intInc[1] = null;
    r.netDebt[1] = r.debt[1] - r.liq[1];
    r.newShares = f.equity > 0 ? f.equity / (f.eqPrice || PRICE.px) : 0;
    let oldDebt = DEBT.bsTotal, newDebtStock = 0;
    for(let i = 2; i < 6; i++){
      const y = Y[i-1], m = DEBT.maturities[y] || 0;
      const leaseIn = i === 2 ? f.saturn : 0, leaseOut = i >= 3 ? f.saturn / 5 : 0, eq = i === 2 ? f.equity : 0;
      const pre = r.liq[i-1] + o.fcf[i] - m + leaseIn - leaseOut + eq;
      const need = Math.max(0, f.minCash - pre);
      r.liqPre[i] = pre;
      r.liq[i] = pre + need; r.newDebt[i] = need; r.matur[i] = m; r.leaseIn[i] = leaseIn; r.leaseOut[i] = leaseOut; r.equityIn[i] = eq;
      const oldBoy = oldDebt; oldDebt = Math.max(0, oldDebt - m);
      const newBoy = newDebtStock; newDebtStock += need;
      r.debt[i] = oldDebt + newDebtStock;
      r.lease[i] = Math.max(0, (r.lease[i-1] || 0) + leaseIn - leaseOut);
      const leaseAvg = ((r.lease[i-1] || 0) + r.lease[i]) / 2;
      r.intExp[i] = (oldBoy + oldDebt) / 2 * f.oldRate / 100 + (newBoy + newDebtStock) / 2 * f.rate / 100 + leaseAvg * f.leaseRate / 100;
      r.intInc[i] = (r.liq[i-1] + r.liq[i]) / 2 * f.cashYield / 100;
      r.netInt[i] = r.intExp[i] - r.intInc[i];
      r.netDebt[i] = r.debt[i] + r.lease[i] - r.liq[i];
      r.lev[i] = (r.debt[i] + r.lease[i]) / Math.max(1, o.ebitda[i]);
      r.cover[i] = o.ebitda[i] / Math.max(1, r.intExp[i]);
    }
    r.lev[1] = r.debt[1] / Math.max(1, o.ebitda[1]);
    r.cumNewDebt = r.newDebt.slice(2).reduce((x,y) => x + y, 0);
    r.peakLev = Math.max(...r.lev.slice(2));
    /* 2027 by quarter, consensus shape: cash before any new financing vs with it */
    const wC = CONS.q27.cfo.map(x => x / CONS.q27.cfo.reduce((p,q) => p+q, 0)), wK = CONS.q27.capex.map(x => x / CONS.q27.capex.reduce((p,q) => p+q, 0));
    let pre = r.liq[1], post = r.liq[1]; r.q27 = { pre:[pre], post:[post], raise:[0] };
    for(let q = 0; q < 4; q++){
      const flow = o.cfo[2] * wC[q] - o.capex[2] * wK[q] - (q === 3 ? r.matur[2] : 0) + (q === 0 ? r.leaseIn[2] + r.equityIn[2] : 0);
      pre += flow; post += flow; let raise = 0; if(post < f.minCash){ raise = f.minCash - post; post = f.minCash; }
      r.q27.pre.push(pre); r.q27.post.push(post); r.q27.raise.push(raise);
    }
    r.runOut = (() => { const L = ['YE26','1Q27','2Q27','3Q27','4Q27']; const k = r.q27.pre.findIndex(x => x < 0); return k < 0 ? null : L[k]; })();
    return r;
  }

  /* Valuation. Target year index ty (2..5). PT dated Dec 31 of the year before the target year, then discounted to today. */
  function value(o, v){
    const ty = v.ty, yrs = ty - 2 + 0.1;                // Nov 25 2026 → Dec 31 of (target year − 1)
    const sh = o.shares[ty];
    const pe = { eps:o.eps[ty], pt:o.eps[ty] * v.pe }; pe.pv = pe.pt / Math.pow(1 + v.ke/100, yrs);
    const nd = o.fin.netDebt[ty-1];
    const ev = { ebitda:o.ebitda[ty], ev:o.ebitda[ty] * v.evx, netDebt:nd }; ev.eq = ev.ev - nd; ev.pt = ev.eq / sh; ev.pv = ev.pt / Math.pow(1 + v.ke/100, yrs);
    const w = v.wacc / 100, rows = [];
    let pvSum = 0;
    for(let i = 2; i <= 5; i++){ const t = (i - 2) + 0.5 + 0.1, df = 1 / Math.pow(1 + w, t); rows.push({ y:MYEARS[i], ufcf:o.ufcf[i], df, pv:o.ufcf[i]*df }); pvSum += o.ufcf[i]*df; }
    const tv = v.tv === 'g' ? (w > v.g/100 ? o.ufcf[5] * (1 + v.g/100) / (w - v.g/100) : NaN) : o.ebitda[5] * v.exitX;
    const tvPV = tv / Math.pow(1 + w, 4.1);
    const dcf = { rows, pvSum, tv, tvPV, ev:pvSum + tvPV, netDebt:o.fin.netDebt[1] }; dcf.eq = dcf.ev - dcf.netDebt; dcf.pv = dcf.eq / o.shares[2]; dcf.pt = dcf.pv;
    const pick = v.m === 'ev' ? ev : v.m === 'dcf' ? dcf : pe;
    return { pe, ev, dcf, pick, pv:pick.pv, pt:pick.pt, yrs, up: pick.pv / PRICE.px - 1 };
  }

  /* ---------- state + subscribers ---------- */
  const st = { scen:'cons', a:{ ...PRESETS.cons.a }, f:{ ...FIN0, eqPrice:PRICE.px },
               v:{ m:'pe', ty:3, tv:'exit', ...PRESETS.cons.v } };
  const subs = [];
  let out = run(st.a, st.f, st.v);
  const notify = () => { out = run(st.a, st.f, st.v); subs.forEach(fn => { try { fn(out, st); } catch(e){ console.error('[model]', e); } }); };
  return {
    BASES, PRESETS, FIN0, st,
    get out(){ return out; },
    on(fn){ subs.push(fn); fn(out, st); },
    setScenario(k){ const p = PRESETS[k]; st.scen = k; st.a = { ...p.a }; Object.assign(st.v, p.v); notify(); },
    set(group, patch, keepScen){ Object.assign(st[group], patch); if(group !== 'f' && !keepScen) st.scen = 'custom'; notify(); },
    resetFin(){ st.f = { ...FIN0, eqPrice:PRICE.px }; notify(); },
    runPreset(k, vOver){ const p = PRESETS[k]; return run({ ...p.a }, st.f, { ...st.v, ...p.v, ...(vOver||{}) }); },
    run
  };
})();

/* Shared UI bits for the three model tabs */
const fmtB = (m, d=1) => m == null || isNaN(m) ? '—' : (m < 0 ? '−' : '') + '$' + num(Math.abs(m)/1000, d) + 'B';
const pctS = (x, d=0) => x == null || isNaN(x) ? '—' : (x < 0 ? '−' : x > 0 ? '+' : '') + Math.abs(x*100).toFixed(d) + '%';
function scenPills(id){
  const opts = [['bear','Bear'],['cons','Consensus'],['jpm','J.P. Morgan'],['bull','Bull']];
  return `<div><span class="ctl-l">Scenario</span><div class="fbg scen-pills" id="${id}">${opts.map(([v,t]) => `<button class="fb" data-v="${v}">${t}</button>`).join('')}<button class="fb cust" data-v="custom" disabled>Custom</button></div></div>`;
}
function wireScenPills(id){
  $$('#' + id + ' .fb[data-v]').forEach(b => { if(b.dataset.v !== 'custom') b.onclick = () => MODEL.setScenario(b.dataset.v); });
  MODEL.on((o, st) => $$('#' + id + ' .fb').forEach(b => b.classList.toggle('active', b.dataset.v === st.scen)));
}
/* slider row: [key, label, min, max, step, fmt, hint] → binds to MODEL.st[group][key] */
function sliderHTML(prefix, defs){
  return defs.map(([k, l, mn, mx, stp, , h]) => `<label><div class="rv">${l} <b id="${prefix}-${k}-v"></b></div><input type="range" id="${prefix}-${k}" min="${mn}" max="${mx}" step="${stp}"><span class="h" id="${prefix}-${k}-h">${h||''}</span></label>`).join('');
}
function wireSliders(prefix, group, defs){
  defs.forEach(([k, , , , , f]) => { const el = $('#' + prefix + '-' + k); el.oninput = () => MODEL.set(group, { [k]: +el.value }); });
  MODEL.on((o, st) => defs.forEach(([k, , , , , f]) => { const el = $('#' + prefix + '-' + k); if(+el.value !== st[group][k]) el.value = st[group][k]; $('#' + prefix + '-' + k + '-v').textContent = f(st[group][k]); }));
}
