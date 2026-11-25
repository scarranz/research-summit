/* Valuation — deliberately simple (SAB, Nov 25 2026): pick a year, set revenue, net margin and a P/E.
   Net income = revenue × net margin · market cap = net income × P/E · price = market cap ÷ consensus diluted shares of that year.
   Defaults = Bloomberg consensus for the year picked (CONS.tot, pulled Nov 25 2026). One chart: your case vs consensus. */
const VAL_YEARS = [1,2,3,4,5];   // MYEARS index: 2026E…2030E
const VAL_PE0 = 20;              // default multiple — J.P. Morgan values SpaceX at ~20× 2028E GAAP EPS (Oct 21 2026)

registerView({ id:'val',
  css: `#v-val .vbig{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:0 0 14px}
#v-val .vbig .sc .sv{font-size:22px}
#v-val .veq{font-size:12.5px;color:var(--mid);background:var(--pale);border:1px solid var(--bdr);border-radius:8px;padding:10px 12px;margin:0 0 14px;line-height:1.7}
#v-val .veq b{color:var(--navy)}
@media(max-width:900px){#v-val .vbig{grid-template-columns:repeat(2,1fr)}}`,
  html: `
  ${sec({ t:'What is it worth?', s:'Pick the year, then set three numbers: revenue, net margin and the P/E the market pays. Starts at the Bloomberg consensus',
    ctl:`<div class="ctls">${seg('val-y','Valuation year', VAL_YEARS.map(i => [String(i), MYEARS[i]]), '3')}</div>`,
    b:`<div class="calc">
      <div class="inp">
        <label><div class="rv">Revenue <b id="val-rev-v"></b></div><input type="range" id="val-rev" step="1"><span class="h" id="val-rev-h"></span></label>
        <label><div class="rv">Net margin <b id="val-nm-v"></b></div><input type="range" id="val-nm" min="-10" max="60" step="0.1"><span class="h" id="val-nm-h"></span></label>
        <label><div class="rv">P/E multiple <b id="val-pe-v"></b></div><input type="range" id="val-pe" min="5" max="80" step="1"><span class="h" id="val-pe-h"></span></label>
        <button class="fb" id="val-reset" style="align-self:flex-start;border:1px solid var(--bdr);border-radius:8px;padding:6px 10px">Reset to consensus</button>
      </div>
      <div>
        <div class="vbig" id="val-tiles"></div>
        <div class="veq" id="val-eq"></div>
        <div id="val-c"></div>
      </div>
    </div>`,
    n:'Defaults: Bloomberg consensus (BEst) for the year picked — total revenue, net income ÷ revenue, and diluted shares — "SPCX BBG CONSENSUS.xlsx", pulled Nov 25 2026. The default P/E is 20×, the multiple J.P. Morgan applies to 2028E GAAP EPS (Oct 21 2026); Wells Fargo uses 30× 2028E EPS. Price ' + PRICE.date + ' close. The value is at the end of the year picked, not discounted to today; the annual return shows what it implies from today’s price. Own arithmetic, not a forecast.' })}

  ${sec({ t:'Street price targets', s:'All from banks that took part in, or bid for, the IPO; use them for mechanics, not as a price',
    b:`<div class="tw" id="val-st"></div>`,
    n:'J.P. Morgan Oct 21 2026 ($225 Jul 7 → $240 Aug 5 → $500); other banks from their own initiation and update notes (dates in the table). Price ' + PRICE.date + ' close, ' + PRICE.src + '.' })}
  `,
  init(){
    const T = CONS.tot, px = PRICE.px, mcapNow = px * PRICE.sharesOut;   // $M
    const st = { y:3, rev:0, nm:0, pe:VAL_PE0 };
    const consAt = y => ({ rev:T.rev[y], nm:T.ni[y] / T.rev[y] * 100, ni:T.ni[y], sh:T.shares[y] });
    const setYear = y => { const c = consAt(y); st.y = y; st.rev = Math.round(c.rev / 1000); st.nm = Math.round(c.nm * 10) / 10;
      const r = $('#val-rev'); r.min = Math.max(10, Math.round(c.rev / 1000 * 0.3)); r.max = Math.round(c.rev / 1000 * 2); r.step = 1; };
    const T$ = m => Math.abs(m) >= 1e6 ? (m < 0 ? '−' : '') + '$' + num(Math.abs(m) / 1e6, 2) + 'T' : fmtB(m, 0);
    let blk = null;
    const draw = () => {
      const y = st.y, c = consAt(y), yr = MYEARS[y], yrs = (2025 + y) + 1 - (2026 + 11/12);   // late Nov 2026 → end of the year picked
      const ni = st.rev * 1000 * st.nm / 100, mcap = ni * st.pe, price = mcap / c.sh;
      const consMcap = c.ni * st.pe, consPx = consMcap / c.sh;
      const ret = price > 0 ? price / px - 1 : null, cagr = price > 0 && yrs > 0.1 ? Math.pow(price / px, 1 / yrs) - 1 : null;
      $('#val-rev-v').textContent = '$' + num(st.rev) + 'B';
      $('#val-nm-v').textContent = num(st.nm, 1) + '%';
      $('#val-pe-v').textContent = num(st.pe) + '×';
      const dRev = st.rev * 1000 / c.rev - 1;
      $('#val-rev-h').textContent = 'Consensus ' + yr + ': ' + fmtB(c.rev, 0) + (Math.abs(dRev) > 0.004 ? ' · yours ' + pctS(dRev) : '');
      $('#val-nm-h').textContent = 'Consensus ' + yr + ': ' + num(c.nm, 1) + '% (net income ' + fmtB(c.ni, 0) + ')';
      $('#val-pe-h').textContent = 'Today’s market cap is ' + num(mcapNow / c.ni, 1) + '× consensus ' + yr + ' net income';
      ['rev','nm','pe'].forEach(k => { const el = $('#val-' + k); if(+el.value !== st[k]) el.value = st[k]; });
      $('#val-tiles').innerHTML =
        tile('Net income ' + yr, fmtB(ni, 0), 'Revenue × ' + num(st.nm, 1) + '% margin') +
        tile('Market cap', T$(mcap), 'Net income × ' + num(st.pe) + '× P/E') +
        tile('Price per share', price > 0 ? '$' + num(price, 0) : '—', '÷ ' + num(c.sh / 1000, 2) + 'B diluted shares (consensus)') +
        tile('vs today’s $' + num(px, 2), ret == null ? '—' : pctS(ret), cagr == null ? 'Value at the end of ' + yr.slice(0,4) : num(cagr * 100, 1) + '% a year to Dec ' + yr.slice(0,4));
      $('#val-eq').innerHTML = `<b>$${num(st.rev)}B</b> revenue × <b>${num(st.nm,1)}%</b> net margin = <b>${fmtB(ni,0)}</b> net income × <b>${num(st.pe)}×</b> = <b>${T$(mcap)}</b> market cap ÷ <b>${num(c.sh/1000,2)}B</b> shares = <b>${price > 0 ? '$' + num(price,0) : '—'}</b> per share.<br>
        Consensus at the same ${num(st.pe)}×: ${fmtB(c.ni,0)} net income → ${T$(consMcap)} → <b>$${num(consPx,0)}</b> per share. Today: ${T$(mcapNow)} market cap at $${num(px,2)}.`;
      const L = MYEARS, at = (v, i) => i === y ? v : null;
      const cfg = { labels:L, unit:'$B', fmt:v => (v < 0 ? '−' : '') + '$' + num(Math.abs(v), 0) + 'B', rowHead:'Year', type:'bar', stacked:false,
        tableNote:'Grey: Bloomberg consensus for every year (2025 reported). Blue: your case, in the year picked (' + yr + ').',
        extra: ch => { ch.options.datasets = { bar:{ skipNull:true } }; },
        series:[ { key:'cr', label:'Revenue — consensus', color:C.grey, data:T.rev.map(v => v / 1000) },
                 { key:'yr', label:'Revenue — your case', color:C.deep, data:L.map((_, i) => at(st.rev, i)) },
                 { key:'cn', label:'Net income — consensus', color:C.fog, data:T.ni.map(v => v / 1000) },
                 { key:'yn', label:'Net income — your case', color:C.sky, data:L.map((_, i) => at(ni / 1000, i)) } ] };
      if(!blk) blk = chartBlock($('#val-c'), cfg); else blk.set(cfg);
    };
    setYear(st.y);
    pills('#val-y', v => { setYear(+v); draw(); });
    $('#val-rev').oninput = e => { st.rev = +e.target.value; draw(); };
    $('#val-nm').oninput = e => { st.nm = +e.target.value; draw(); };
    $('#val-pe').oninput = e => { st.pe = +e.target.value; draw(); };
    $('#val-reset').onclick = () => { setYear(st.y); st.pe = VAL_PE0; draw(); };
    draw();
    const street = STREET.map(s => ({ b:s.b, d:s.d, r:s.r, pt:s.pt, m:s.m })).sort((a, b) => b.pt - a.pt);
    $('#val-st').innerHTML = table(['Bank','Date','Rating','Target','vs price','Method'], street.map(s => [s.b, s.d, s.r, '$' + s.pt, pctS(s.pt / px - 1), s.m]));
  }
});
