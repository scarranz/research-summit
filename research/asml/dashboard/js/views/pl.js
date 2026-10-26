/* ═════════════ MACHINES (pl) — what ASML sells, how many, and how many it says it can build ═════════════
   v5 (Oct 23 2026): one table of families; clicking a row opens its detail (large photo, size & build facts, units over time with
   stated capacity, and what ASML has said about capacity). v3/v4 backups: pl.v3.bak, vm.v3.bak. Unit data: js/data-units.js (VM_*).
   Numbers frozen: 20-F, 6-K, Bloomberg Oct 16 2026; capacity quotes in PL_SAID (sources inline). */
registerView({ id:"pl", html:`
    <div class="srow" id="pl-kpis"></div>

    <section class="card">
      <div class="ch"><div><div class="ct">Product families</div><div class="cs">Lithography systems, FY2025 · click a row for the photo, size, units over time and capacity comments</div></div></div>
      <div class="tw" id="pl-fam-tbl"></div>
      <div class="snote">Source: FY2025 20-F Note 2 (units, €); asml.com product pages; Bloomberg consensus, Oct 16 2026. Average price = 2025 revenue ÷ units.
        Short explainer: <a href="https://www.youtube.com/watch?v=RI3lCUEzSvE" target="_blank" rel="noopener">How EUV lithography works (IBM Research, 1:37)</a>.</div>
    </section>
`, css:`
  #v-pl .pl-fam td{vertical-align:middle}
  #v-pl .pl-fam tr.pl-row{cursor:pointer}
  #v-pl .pl-fam tr.pl-row:hover td{background:var(--rowhover)}
  #v-pl .pl-fam tr.pl-row.open td{background:var(--pale);border-bottom-color:transparent}
  #v-pl .pl-fam tr.pl-tot td{font-weight:700;border-top:1px solid var(--bdr)}
  #v-pl .pl-fam img.th{width:54px;height:40px;object-fit:cover;border-radius:4px;border:1px solid var(--bdr);display:block}
  #v-pl .pl-fn{display:flex;align-items:center;gap:10px;font-weight:600}
  #v-pl .pl-chev{color:var(--mu);font-size:10px;width:10px;display:inline-block;transition:transform .15s}
  #v-pl tr.open .pl-chev{transform:rotate(90deg)}
  #v-pl .pl-use{color:var(--mu);white-space:normal;text-align:left;min-width:180px;font-size:11.5px}
  #v-pl tr.pl-det > td{position:static;background:var(--pale);white-space:normal;text-align:left;padding:4px 14px 20px;border-bottom:1px solid var(--bdr)}
  #v-pl .pl-dg{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:22px;align-items:start}
  #v-pl .pl-big{background:#fff;border:1px solid var(--bdr);border-radius:10px;overflow:hidden}
  #v-pl .pl-big img{width:100%;height:360px;object-fit:contain;display:block;cursor:zoom-in}
  #v-pl .pl-big .cap{font-size:10.5px;color:var(--mu);padding:6px 10px;border-top:1px solid var(--bdr)}
  #v-pl .pl-k{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--mu);margin:16px 0 6px}
  #v-pl .pl-br{display:grid;grid-template-columns:110px 1fr;gap:10px;padding:5px 0;border-bottom:1px solid var(--bdr);font-size:12px}
  #v-pl .pl-br b{color:var(--text)}
  #v-pl .pl-br span{color:var(--ink2)}
  #v-pl .pl-q{padding:8px 0;border-bottom:1px solid var(--bdr);font-size:12px;line-height:1.5;color:var(--ink2)}
  #v-pl .pl-q .w{font-size:10.5px;color:var(--mu);margin-bottom:2px}
  #v-pl .pl-q .w a{color:var(--steel)}
  #v-pl .pl-q .n{color:var(--mu);font-style:italic}
  #v-pl .pl-method{padding:10px 13px;font-size:11px;line-height:1.6;color:var(--mu);border-top:1px solid var(--bdr)}
  #v-pl .pl-zoom{position:fixed;inset:0;background:rgba(15,20,28,.82);display:flex;align-items:center;justify-content:center;z-index:50;cursor:zoom-out;padding:24px}
  #v-pl .pl-zoom img{max-width:min(1100px,100%);max-height:100%;object-fit:contain;border-radius:8px;background:#fff}
  @media (max-width:820px){ #v-pl .pl-dg{grid-template-columns:1fr} #v-pl .pl-big img{height:260px} }
`, init(){ initPl(); } });

/* Units / € : FY2025 20-F Note 2 (NXE = 0.33 NA, EXE = High-NA). 2026E: Bloomberg consensus Oct 16 2026 (asml-work/data/bbg_s1.tsv). */
const FAM = [
  { k:'iline', n:'i-line', c:'#A9B4C2', light:'Mercury lamp', wl:365, na:'≈0.5–0.65', res:'≈220–350 nm', resN:280, model:'XT:400M', wph:null,
    u25:54, e25:307.3, u26:60, e26:332,
    tag:'The marker pen.', txt:'The oldest and cheapest family. Light from a mercury lamp prints big, simple shapes — the thick, forgiving layers that every chip still has.',
    use:['Power & analog chips','Sensors / MEMS','Thick & implant layers','Advanced packaging'] },
  { k:'krf', n:'KrF', c:'#1E2733', light:'Krypton-fluoride laser', wl:248, na:'≈0.8–0.93', res:'≈80–110 nm', resN:95, model:'NXT:870B', wph:'400',
    u25:78, e25:1001.3, u26:143, e26:1778,
    tag:'The volume workhorse.', txt:'A deep-UV laser instead of a lamp. Very fast and cheap per wafer, so it does the many non-critical layers — and 3D NAND memory, which stacks hundreds of thick layers, buys a lot of them.',
    use:['3D NAND','Image sensors','Microcontrollers','Non-critical layers of every chip'] },
  { k:'arfd', n:'ArF dry', c:'#93B1F0', light:'Argon-fluoride laser', wl:193, na:'0.93', res:'57 nm', resN:57, model:'NXT:1470', wph:'>300',
    u25:16, e25:427.0, u26:36, e26:1034,
    tag:'Mid-critical layers.', txt:'Shorter 193 nm laser light through big lenses, in air. Covers the middle layers of a chip and the critical layers of mature nodes (28 nm and older).',
    use:['Mature logic (28 nm+)','Mid-critical layers','Automotive / IoT chips'] },
  { k:'arfi', n:'ArF immersion', c:'#3E5A82', light:'Argon-fluoride laser, through water', wl:193, wlEff:134, na:'1.35', res:'38 nm', resN:38, model:'NXT:2100i', wph:'≈295',
    u25:131, e25:10311.4, u26:132, e26:11091,
    tag:'The trick: print through water.', txt:'Same 193 nm laser, but a thin film of ultra-pure water sits between the last lens and the wafer. Water bends light more than air, so the light behaves like ~134 nm and draws finer lines. With multiple exposures per layer it reaches 7 nm-class chips — the backbone of DRAM and of China\'s fabs.',
    use:['DRAM','Logic down to 7 nm-class','Most critical layers outside EUV','China capacity build-out'] },
  { k:'euv', n:'EUV', c:'#2563EB', light:'Tin plasma, 13.5 nm', wl:13.5, na:'0.33', res:'13 nm', resN:13, model:'NXE:3800E', wph:'≈220',
    u25:44, e25:10445.8, u26:65, e26:15868,
    tag:'A different machine altogether.', txt:'Light 14× shorter than DUV, made by hitting 50,000 molten tin droplets a second with a laser. Air and glass absorb it, so everything runs in a vacuum and bounces off mirrors instead of passing through lenses. One EUV exposure replaces 3–4 DUV passes on the hardest layers. <strong>ASML is the only company in the world that makes it.</strong>',
    use:['Leading-edge logic (5, 3, 2 nm)','Leading-edge DRAM / HBM','AI accelerators & phone chips'] },
  { k:'hna', n:'High-NA EUV', c:'#1B3F94', light:'Tin plasma, 13.5 nm', wl:13.5, na:'0.55', res:'8 nm', resN:8, model:'EXE:5200B', wph:'≈175',
    u25:4, e25:1156.9, u26:5, e26:1747,
    tag:'Bigger mirrors, finer lines.', txt:'Same EUV light, but larger mirrors collect more of it (NA 0.55 vs 0.33), so it resolves 8 nm lines in one shot. Each tool costs ~€290–400M (2025 average €289M) and is still ramping: first for sub-2 nm logic, later for DRAM.',
    use:['Sub-2 nm logic (e.g. Intel 14A)','Future DRAM','R&D and pilot lines'] }
];
const HAIR_NM = 80000;
/* Size & build: sourced facts only (see the ladder footnote) */
const BUILD = {
  iline:{ cap:'TWINSCAN XT:400M', rows:[['~€5.7M','average price in 2025, the cheapest machine ASML sells'],['2 stages','still a full TWINSCAN: one wafer is measured while the other is exposed'],['Zeiss','projection lens from Carl Zeiss SMT, ASML\'s only optics supplier']] },
  krf:  { cap:'TWINSCAN NXT:870B', rows:[['400 / hour','wafers on the NXT:870B, one every 9 seconds'],['~€12.8M','average price in 2025'],['Zeiss','projection lens']] },
  arfd: { cap:'TWINSCAN NXT:1470', rows:[['>300 / hour','wafers, 50% more than ASML\'s previous fastest ArF tool'],['4×','Zeiss Starlith reduction lens shrinks the reticle image'],['0.70–0.93','variable NA, tuned per layer']] },
  arfi: { cap:'TWINSCAN NXT:2100i', rows:[['0.9 nm','overlay: each layer lands within a few atoms of the one below'],['>6,000 / day','wafers on NXT immersion tools'],['~€78.7M','average price in 2025']] },
  euv:  { cap:'TWINSCAN NXE:3800E', rows:[['~100,000','parts in one system'],['40 · 20 · 3','containers, trucks and Boeing 747 flights to ship one'],['~180–200 t','weight, as reported'],['50,000 / s','tin droplets, flying at 70 m/s, each hit twice by a laser'],['¼ nm','wafer-stage accuracy, corrected 20,000 times a second']] },
  hna:  { cap:'TWINSCAN EXE:5200B', rows:[['~150 t','weight; "bigger than a double-decker bus"'],['250 crates','plus 13 containers to ship the first one to Intel'],['€289M','average price in 2025 (4 tools)'],['4× / 8×','anamorphic mirrors shrink the image 4× one way and 8× the other']] }
};
/* Size & build sources: asml.com product pages and press releases; Intel Newsroom (High-NA shipment); CNBC (EUV shipping, weight). */

/* What chips each family makes and which end markets they ship into (Oct 26 2026). ASML does not split end-use per family: it reports
   Logic vs Memory for all systems together (20-F Note 2). The mapping is qualitative, from the FY2025 20-F (Our marketplace; product
   sections: "advanced Logic and DRAM" for EUV; "More than Moore … mature, cost-effective technologies for applications like automotive,
   consumer electronics and data centers"; "around two-thirds of components in … the latest smartphones"; EV power electronics; XT:260 for
   advanced packaging) and asml.com product pages. */
const PL_END = {
  iline: { chips:'Power chips (MOSFETs, IGBTs), analog, sensors and MEMS; the thick, simple layers of every chip; advanced-packaging layers (XT:260)',
           mkts:['Automotive and EV power electronics','Industrial','Consumer electronics and IoT','AI chip packaging'] },
  krf:   { chips:'3D NAND flash, image sensors, microcontrollers, analog / mixed-signal; the non-critical layers of advanced chips',
           mkts:['Smartphones and PCs','Data-center storage (SSDs)','Automotive and industrial','Cameras'] },
  arfd:  { chips:'Mature-node logic (28 nm and older) and the mid-critical layers of DRAM and logic',
           mkts:['Automotive','IoT and connectivity','Consumer electronics','Industrial'] },
  arfi:  { chips:'DRAM, logic down to 7 nm-class (with multiple exposures), and the critical layers that do not need EUV; most of China\'s mainstream build-out',
           mkts:['AI servers and data centers (DRAM)','Smartphones and PCs','China domestic chips: auto, industrial, consumer'] },
  euv:   { chips:'Leading-edge logic (5, 3, 2 nm: GPUs, AI accelerators, CPUs, phone processors) and leading-edge DRAM, including HBM',
           mkts:['AI data centers','Smartphones','PCs'] },
  hna:   { chips:'Next-generation logic below 2 nm (e.g. Intel 14A) and, later, DRAM; today mostly R&D and pilot lines',
           mkts:['Future AI and data-center chips','Future high-end mobile'] }
};

/* What ASML has said about capacity, per group, newest first. Verbatim quotes from ASML's own call transcripts (prepared remarks; the
   published PDFs stop before Q&A) and press releases — asml-work/data/capacity_quotes.md, checked against filings/tr_q126/q226 and
   q226/q326 press releases. Q3 2026 call Q&A not frozen (no verbatim transcript available yet). para = our summary, not a quote. */
const PL_PR326 = { when:'Q3 2026 · Oct 14 2026', src:'press release', who:'Christophe Fouquet, CEO',
  q:'“… we now expect that our supply as currently planned for both 2027 and 2028 will not fully meet the demand of our customers. Given this, we are investigating ways to increase capacity for 2028 beyond the 30% increase we previously communicated.”' };
const PL_SAID = {
  euv: [
    PL_PR326,
    { when:'Q2 2026 · Jul 15 2026', src:'press release', who:'Christophe Fouquet, CEO', q:'“… we are planning to add 30% to our 2026 low NA EUV capacity of around 65 for 2027, and we are investigating to increase capacity with another 30% for 2028.”' },
    { when:'Q2 2026 · Jul 15 2026', src:'earnings call', who:'Roger Dassen, CFO', q:'“For 2027, we are now close to being fully covered with orders for Low NA EUV … Looking ahead to 2028, we have already received a significant number of Low NA EUV orders.”' },
    { when:'Q1 2026 · Apr 15 2026', src:'earnings call', who:'Christophe Fouquet, CEO', q:'“… we are executing on an output plan of at least 60 Low-NA EUV systems … raising Low-NA EUV capacity to at least 80 systems next year.”' },
    { when:'Investor Day · Nov 2022', src:'Investor Day (6-K)', q:'Capacity plan of 90 Low-NA EUV systems a year in 2025–26.', para:true }
  ],
  hna: [
    { when:'Q2 2026 · Jul 15 2026', src:'earnings call', who:'Christophe Fouquet, CEO', q:'“… the maturity of the platform is improving towards the levels required for insertion into high-volume manufacturing.”' },
    { when:'Q4 2025 · Jan 28 2026', src:'earnings call', who:'Christophe Fouquet, CEO', q:'“We expect more systems to be released to our customers in 2026 supporting their preparations for the insertion of High NA in high-volume manufacturing.”' },
    { when:'Investor Day · Nov 2022', src:'Investor Day (6-K)', q:'Capacity of 20 High-NA EUV systems a year in 2027–28. No High-NA capacity figure has been given since.', para:true }
  ],
  arfi: [
    PL_PR326,
    { when:'Q2 2026 · Jul 15 2026', src:'press release', who:'Christophe Fouquet, CEO', q:'“… we plan to add 30% to our 2026 DUV immersion capacity of around 130 for 2027, and we are investigating to increase capacity with another 30% in 2028.”' },
    { when:'Q2 2026 · Jul 15 2026', src:'earnings call', who:'Roger Dassen, CFO', q:'“For immersion DUV, we expect about 130 shipments this year, which is similar to the output level of these systems in 2025.”' },
    { when:'Q1 2026 · Apr 15 2026', src:'earnings call', who:'Christophe Fouquet, CEO', q:'“… despite a slow start, as discussed last quarter, driving output of our immersion systems close to that in 2025.”' },
    { when:'Investor Day · Nov 2022', src:'Investor Day (6-K)', q:'600 DUV systems a year in 2025–26 (all DUV families together).', para:true }
  ],
  dry: [
    { when:'Q2 2026 · Jul 15 2026', src:'earnings call', who:'Roger Dassen, CFO', q:'“Shipments of dry DUV systems have also increased markedly this year.”' },
    { when:'Q1 2026 · Apr 15 2026', src:'earnings call', who:'Christophe Fouquet, CEO', q:'“… scaling DUV and application products in alignment.”' },
    { when:'Investor Day · Nov 2022', src:'Investor Day (6-K)', q:'600 DUV systems a year in 2025–26 (all DUV families together). No dry-DUV capacity figure has been given.', para:true }
  ],
  all: [
    PL_PR326,
    { when:'Q3 2026 · Oct 14 2026', src:'press release', who:'Christophe Fouquet, CEO', q:'“We continue to provide significant wafer capacity to our customers through our productivity upgrade portfolio.”' },
    { when:'Q2 2026 · Jul 15 2026', src:'earnings call', who:'Roger Dassen, CFO', q:'“We are continuing to have very constructive conversations with our customers to better understand their demand for our systems beyond 2026.”' },
    { when:'Investor Day · Nov 2022', src:'Investor Day (6-K)', q:'Capacity plan of 90 Low-NA EUV and 600 DUV systems a year in 2025–26; 20 High-NA a year in 2027–28.', para:true }
  ]
};
const PL_SAID_KEY = { euv:'euv', hna:'hna', arfi:'arfi', arfd:'dry', krf:'dry', il:'dry', all:'all' };

const PL_F0 = x => x == null ? '—' : Math.round(x).toLocaleString('en-US');
const plVk = k => k === 'iline' ? 'il' : k;   // FAM key → VM_* key

/* — tiles — */
function renderPlKpis(){
  const u = FAM.reduce((a,f)=>a+f.u25,0), e = FAM.reduce((a,f)=>a+f.e25,0);
  const eu = FAM.filter(f=>f.k==='euv'||f.k==='hna'), euE = eu.reduce((a,f)=>a+f.e25,0), euU = eu.reduce((a,f)=>a+f.u25,0);
  const qt = i => ['eua','arfi','arfd','krf','il'].reduce((s,k)=>s+VM_Q[k][i],0);
  const nm26 = qt(16)+qt(17)+qt(18), nm25 = qt(12)+qt(13)+qt(14);
  const c26 = VM_FAM.reduce((s,f)=>s+VM_A[f.k][11],0);
  const rec = Math.max(...VM_Q_LBL.slice(0, VM_Q_EST).map((_,i)=>qt(i)));
  const k = [
    ['Machines sold, 2025', u, 'plus 208 metrology tools'],
    ['Sold, 9M 2026', nm26, `${sgn(nm26/nm25-1)} vs 9M 2025`],
    ['Consensus, FY2026E', PL_F0(c26), `needs ~${PL_F0(c26-nm26)} in Q4 · record ${rec}`],
    ['EUV share, 2025', pct(euE/e,0) + ' of €', `${pct(euU/u,0)} of units`]
  ];
  $('#pl-kpis').innerHTML = k.map(([l,v,s]) => `<div class="sc"><div class="sl">${l}</div><div class="sv">${v}</div><div class="ss">${s}</div></div>`).join('');
}

/* — families table; one row open at a time — */
const plU = { open:'euv', per:'a', hidden:new Set(), x:null, y:null };
let plUChart;
function renderPlFam(){
  const chev = '<span class="pl-chev">▶</span>';
  const rows = FAM.slice().reverse().map(f => `<tr class="pl-row" data-k="${plVk(f.k)}">
    <td><div class="pl-fn">${chev}<img class="th" src="${IMG[f.k]}" alt="">${f.n}</div></td>
    <td>${f.wlEff ? f.wl + ' nm, in water' : f.wl + ' nm'}</td><td>${f.res}</td>
    <td>${f.u25}</td><td>€${(f.e25/f.u25).toFixed(1)}M</td><td>€${(f.e25/1000).toFixed(1)}B</td>
    <td class="est">${f.u26}</td><td class="pl-use">${f.use.slice(0,2).join(' · ')}</td></tr>`).join('');
  const u = FAM.reduce((a,f)=>a+f.u25,0), e = FAM.reduce((a,f)=>a+f.e25,0), u26 = FAM.reduce((a,f)=>a+f.u26,0);
  const tot = `<tr class="pl-row pl-tot" data-k="all"><td><div class="pl-fn">${chev}All lithography</div></td><td></td><td></td>
    <td>${u}</td><td>€${(e/u).toFixed(1)}M</td><td>€${(e/1000).toFixed(1)}B</td><td class="est">${u26}</td><td class="pl-use"></td></tr>`;
  $('#pl-fam-tbl').innerHTML = `<table class="pl-fam"><thead><tr><th>Family</th><th>Light</th><th>Finest line</th><th>Units 2025</th><th>Avg price</th><th>Revenue 2025</th><th class="est">Units 2026E</th><th style="text-align:left">Used for</th></tr></thead><tbody>${rows}${tot}</tbody></table>`;
  $$('#pl-fam-tbl tr.pl-row').forEach(tr => tr.onclick = () => { plU.open = plU.open === tr.dataset.k ? null : tr.dataset.k; plU.hidden.clear(); plU.x = null; plU.y = null; plOpen(); });
  plOpen();
}

function plOpen(){
  $$('#pl-fam-tbl tr.pl-det').forEach(r => r.remove());
  $$('#pl-fam-tbl tr.pl-row').forEach(r => r.classList.toggle('open', r.dataset.k === plU.open));
  if(plUChart){ plUChart.destroy(); plUChart = null; }
  if(!plU.open) return;
  const k = plU.open, f = FAM.find(x => plVk(x.k) === k), b = f && BUILD[f.k];
  const img = f ? IMG[f.k] : IMG.clean, cap = f ? `ASML ${b.cap}` : 'ASML cleanroom, Veldhoven';
  const facts = b ? `<div class="pl-k">Size &amp; how hard it is to build</div>` + b.rows.map(([v,t]) => `<div class="pl-br"><b>${v}</b><span>${t}</span></div>`).join('') : '';
  const end = f ? PL_END[f.k] : null;
  const endH = end
    ? `<div class="pl-k">Chips it makes and where they go</div><div class="pl-br"><b>Chips</b><span>${end.chips}</span></div>` +
      `<div class="pl-br"><b>End markets</b><span>${end.mkts.join(' · ')}</span></div>` +
      `<div class="pl-q n" style="border:none;font-size:11px">ASML does not split end markets per machine; this is a qualitative map from the FY2025 20-F and asml.com.</div>`
    : `<div class="pl-k">Chips it makes and where they go</div><div class="pl-br"><b>Logic</b><span>€16.1B of 2025 system sales (66%): processors, GPUs and AI accelerators, made by foundries and IDMs</span></div>` +
      `<div class="pl-br"><b>Memory</b><span>€8.4B (34%): DRAM (incl. HBM) and NAND flash</span></div>` +
      `<div class="pl-q n" style="border:none;font-size:11px">FY2025 20-F Note 2, net system sales by end-use (incl. metrology &amp; inspection). The only end-use split ASML discloses.</div>`;
  const said = PL_SAID[PL_SAID_KEY[k]] || [];
  const saidH = said.length ? said.map(s => `<div class="pl-q"><div class="w">${s.when} · ${s.url ? `<a href="${s.url}" target="_blank" rel="noopener">${s.src}</a>` : s.src}${s.who ? ' · ' + s.who : ''}</div>${s.q}${s.para ? ' <span class="n">(summary, not a quote)</span>' : ''}</div>`).join('')
    : '<div class="pl-q n">No capacity comment specific to this family.</div>';
  const tr = document.createElement('tr'); tr.className = 'pl-det';
  tr.innerHTML = `<td colspan="8"><div class="pl-dg">
      <div><div class="pl-big"><img id="pl-big-img" src="${img}" alt="${cap}"><div class="cap">${cap} · click to enlarge</div></div>${endH}${facts}</div>
      <div>
        <div class="ch" style="margin-bottom:6px"><div><div class="pl-k" style="margin:0">Units sold</div></div>
          <div class="ctls"><span><span class="ctl-l">Period</span><div class="fbg" id="pl-u-per"><button class="fb${plU.per==='a'?' active':''}" data-v="a">Annual</button><button class="fb${plU.per==='q'?' active':''}" data-v="q">Quarterly</button></div></span></div></div>
        <div class="leg" id="pl-u-leg"></div>
        <div class="ch-wrap s"><canvas id="pl-u-chart"></canvas></div>
        <details class="tbl"><summary>Data table &amp; method</summary><div class="tw" id="pl-u-tbl"></div><div class="pl-method" id="pl-u-more"></div></details>
        <div class="pl-k">What ASML has said about capacity</div>${saidH}
      </div></div></td>`;
  $(`#pl-fam-tbl tr.pl-row[data-k="${k}"]`).after(tr);
  $('#pl-big-img').onclick = () => { const z = document.createElement('div'); z.className = 'pl-zoom'; z.innerHTML = `<img src="${img}" alt="${cap}">`; z.onclick = () => z.remove(); $('#v-pl').appendChild(z); };
  pills('#pl-u-per', v => { plU.per = v; plU.hidden.clear(); plU.x = null; plU.y = null; renderPlUnits(); });
  renderPlUnits();
  attachZoom(() => plUChart, r => { if(!r){ plU.x = null; plU.y = null; } else { if(r.x) plU.x = r.x; if(r.y) plU.y = r.y; } renderPlUnits(); });
}

/* — units of the open family; stated capacity drawn only where ASML gave a unit figure — */
/* 2022 = Investor Day plan (VM_CAP). 2026 calls: Q1'26 "at least 60" output in 2026 and "at least 80" capacity in 2027 (Low-NA);
   Q2'26 "around 65" Low-NA and "around 130" ArFi 2026 capacity. The +30% steps are not drawn: ASML gave them as %, not units. */
const PL_CAPLINE = {
  euv: [ { k:'c22', label:'Plan stated in 2022: 90 a year', color:'#DC2626', pts:{'2025':90,'2026E':90} },
         { k:'c26', label:'Stated in 2026 calls: ~65 (2026), at least 80 (2027)', color:'#D97706', pts:{'2026E':65,'2027E':80} } ],
  hna: [ { k:'c22', label:'Plan stated in 2022: 20 a year', color:'#DC2626', pts:{'2027E':20,'2028E':20} } ],
  arfi:[ { k:'c26', label:'Stated in 2026 calls: ~130 (2026)', color:'#D97706', pts:{'2026E':130} } ]
};
function plUData(){
  const q = plU.per === 'q', L = q ? VM_Q_LBL : VM_A_LBL, EST = q ? VM_Q_EST : VM_A_EST, D = q ? VM_Q : VM_A, fam = plU.open;
  const keys = q ? ['eua','arfi','arfd','krf','il'] : VM_FAM.map(f=>f.k);
  const tot = L.map((_,i) => keys.reduce((s,k)=>s+(D[k][i]||0),0));
  let bar;
  if(fam === 'all') bar = { label:'All lithography', color:'#1E2733', data:tot };
  else if(fam === 'euv') bar = q ? { label:'EUV, incl. High-NA', color:'#2563EB', data:D.eua } : { label:'EUV (0.33 NA)', color:'#2563EB', data:D.euv };
  else if(fam === 'hna') bar = q ? { label:'High-NA (as stated)', color:'#1B3F94', data:L.map((_,i)=>i < VM_Q_HNA.length ? VM_Q_HNA[i] : null) } : { label:'High-NA EUV', color:'#1B3F94', data:D.hna };
  else { const f = VM_FAM.find(x=>x.k===fam); bar = { label:f.n, color:f.c, data:D[f.k] }; }
  const caps = q ? [] : (PL_CAPLINE[fam] || []).map(c => ({ ...c, data:L.map(y => c.pts[y] ?? null) }));
  return { q, L, EST, tot, bar, caps };
}
function renderPlUnits(){
  const { q, L, EST, tot, bar, caps } = plUData(), H = plU.hidden;
  let lo = 0, hi = L.length - 1;
  if(plU.x){ lo = Math.max(0, plU.x[0]); hi = Math.min(hi, plU.x[1]); if(hi < lo){ lo = 0; hi = L.length - 1; } }
  const idx = L.map((_,i)=>i).slice(lo, hi + 1), ds = [];
  if(!H.has('bar')) ds.push({ type:'bar', label:bar.label, data:idx.map(i=>bar.data[i]), order:2, borderRadius:2, barPercentage:.7,
    backgroundColor: idx.map(i => i >= EST ? bar.color + '55' : bar.color), borderColor:bar.color, borderWidth: idx.map(i => i >= EST ? 1 : 0) });
  caps.filter(c => !H.has(c.k)).forEach(c => ds.push({ type:'line', label:c.label, data:idx.map(i=>c.data[i]), order:1, borderColor:c.color, borderDash:[5,4], borderWidth:1.8, pointRadius:4, pointBackgroundColor:c.color, spanGaps:false }));
  if(plUChart) plUChart.destroy();
  plUChart = new Chart($('#pl-u-chart'), { data:{ labels:idx.map(i=>L[i]), datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{display:false}, tooltip:{ ...TIP, filter: it => it.parsed.y != null, callbacks:{
        title: it => { const i = idx[it[0].dataIndex]; return L[i] + (i >= EST ? ' · Bloomberg consensus, Oct 16 2026' : ' · actual'); },
        label: it => ` ${it.dataset.label}: ${PL_F0(it.parsed.y)} units` } } },
      scales:{ x:{ grid:{display:false}, ticks:{ maxRotation:0, autoSkip:true } },
        y:{ beginAtZero:true, grid:{color:'#EEF1F5'}, title:{ display:true, text:'units' }, min: plU.y ? plU.y[0] : 0, max: plU.y ? plU.y[1] : undefined } } } });
  plUChart.$lo = lo;
  legend($('#pl-u-leg'), [{ key:'bar', label:bar.label + (q ? '' : ' · lighter = consensus'), color:bar.color }].concat(caps.map(c => ({ key:c.k, label:c.label, color:c.color, line:true, dash:true }))), H, renderPlUnits);

  const est = new Set(idx.map((i,j) => i >= EST ? j + 1 : -1)), rows = [];
  if(!H.has('bar')){
    rows.push([bar.label].concat(idx.map(i => PL_F0(bar.data[i]))));
    if(plU.open !== 'all') rows.push(['All lithography'].concat(idx.map(i => PL_F0(tot[i]))),
      ['Share of all units'].concat(idx.map(i => bar.data[i] == null || !tot[i] ? '—' : pct(bar.data[i] / tot[i], 0))));
  }
  caps.filter(c => !H.has(c.k)).forEach(c => rows.push([c.label].concat(idx.map(i => c.data[i] == null ? '' : c.data[i]))));
  $('#pl-u-tbl').innerHTML = table(['Units'].concat(idx.map(i=>L[i])), rows, est);
  $('#pl-u-more').innerHTML = `<b>Method.</b> Lithography systems sold, new + used; metrology &amp; inspection excluded. Annual: 20-F Note 2 (FY2017, FY2019, FY2022, FY2025); EUV split 0.33 NA / High-NA from the FY2025 20-F; 2015–2022 EUV is all 0.33 NA. ` +
    `Quarterly: 6-K presentations; High-NA is stated only in some quarters (blank = not stated), so quarterly EUV includes it. Consensus: Bloomberg Low-NA / High-NA / family rows, Oct 16 2026 (fractions = average of contributors); Bloomberg's own "EUV", "DUV" and total rows do not add up to its family rows. ` +
    `Capacity lines: drawn only where ASML gave a unit figure — Investor Day Nov 2022 plan (Low-NA EUV 2025–26, High-NA 2027–28) and the Q1/Q2 2026 calls (Low-NA ~65 in 2026, at least 80 in 2027; ArFi ~130 in 2026). The +30% steps for 2027–28 were given as percentages and are not drawn.`;
}

let plBuilt = false;
function initPl(){
  if(plBuilt) return; plBuilt = true;
  renderPlKpis(); renderPlFam();
}
