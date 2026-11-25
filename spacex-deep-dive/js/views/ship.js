/* Starship & launch — the variable that decides everything */
registerView({ id:'ship',
  html: `
  <div class="srow">
    ${tile('Launches · 9M26', SPACE.launches[1], '<span class="dn">−12%</span> vs ' + SPACE.launches[0] + ' in 9M25')}
    ${tile('Mass to orbit · 9M26', num(SPACE.massT[1]) + ' t', '<span class="dn">−7%</span> vs ' + num(SPACE.massT[0]) + ' t')}
    ${tile('Space adj. EBITDA · 9M26', usd(SPACE.ebitda[1]), 'From +' + usd(SPACE.ebitda[0]) + '; Starship R&D up')}
    ${tile('Starship reached orbit', 'Flight 14', 'Sep 2026 · 26 V3 Starlink satellites')}
  </div>

  ${sec({ t:'Where Starship stands', s:'The cost estimates assume steps 2–4. None is done yet',
    b:`<div>
      <div class="st"><b>1 · Reach orbit</b><span><span class="tag ok">Done</span></span><span>Flight 14, Sep 2026, 26 V3 satellites (Q3 release). One RVac engine failed on ascent (Wells Fargo).</span></div>
      <div class="st"><b>2 · Recover the booster</b><span><span class="tag open">Lost on Flight 15</span></span><span>Super Heavy had been caught three times before, but on Flight 15 (Nov 13–14 2026) Booster 22 called off the catch, diverted to the Gulf and was destroyed. Musk: the engines slightly underperformed, leaving too little propellant. <span class="tag n">Press</span> NASASpaceFlight, Aviation Week; not a company disclosure.</span></div>
      <div class="st"><b>3 · Recover the ship</b><span><span class="tag ok">Done</span></span><span><strong>Caught on Flight 15, Nov 14 2026</strong> — the first ship catch. Management wants to re-fly the same ship by early 2027, then cut turnaround time and cost. <span class="tag n">Sell-side</span> J.P. Morgan Key Investor FAQs (Nov 2026); not yet in a company filing or call.</span></div>
      <div class="st"><b>4 · Rapid re-flight</b><span><span class="tag wait">Pending</span></span><span>Target: "weekly at some point in the first half of next year", then "twice weekly or maybe even more frequently" (Musk, Q3 call). Actual gap Flight 13 → 14: ~9 weeks.</span></div>
    </div>`,
    n:'Sources: Q3 2026 release and call transcript (Oct 20 2026); Wells Fargo (Flight 14); J.P. Morgan Key Investor FAQs, Nov 2026 (ship catch, re-flight target); NASASpaceFlight and Aviation Week (booster loss, press). FAA raised the Starship cap from 5 to 25 launches a year (424B4, Clear Street). Our note: launches are public and FAA-licensed, so progress can be checked without the company.' })}

  ${sec({ t:'Cost per kilogram to orbit', s:'Each rung is a reuse milestone, so delay postpones the case in jumps, not gradually',
    b:`<div id="ship-k"></div>`,
    n:'Starship rungs: Deutsche Bank estimates (Jul 2026), not disclosures. Falcon 9 today: the banks disagree (UBS ~$1,000/kg, Barclays ~$3,182/kg). Dashed line: ~$100/kg, the level Clear Street reads in the S-1 as needed for orbital compute.' })}

  ${sec({ t:'Spending more, flying less', s:'Nine months against nine months',
    ctl:`<div class="ctls">${seg('ship-m','Metric',[['n','Launches'],['t','Mass to orbit'],['e','Space EBITDA & R&D']],'n')}</div>`,
    b:`<div id="ship-c"></div>`,
    n:'Q3 2026 release. Q3 alone had 35 launches vs 46 that Clear Street estimated. Space segment Q3 adj. EBITDA was +$357M, which hid the nine-month swing.' })}

  ${sec({ t:'Falcon is being retired on a schedule', s:'If Starship slips materially, there is a launch-supply gap',
    b:`<ul class="pl">
      <li><strong>SpaceX is turning away</strong> dedicated Falcon 9 customers beyond 2028 and stopped making some non-reusable parts (Bloomberg report, press).</li>
      <li><strong>The dates vary by source:</strong> Needham — rideshare acceptance slows from 2029, possible Falcon 9 retirement; UBS — Falcon off around 2031, no new boosters.</li>
      <li><strong>UBS's Starship model</strong> assumes 4 → 32 → 141 → 1,558 flights between 2026 and 2031.</li>
    </ul>`,
    n:'Needham and UBS initiations (Jul 7 2026); Bloomberg ("SpaceX Turns Away Falcon Customers in Major Bet on Starship"). Same gap, different opening dates.' })}
  `,
  init(){
    const L = ['Falcon 9 · Barclays', 'Falcon 9 · UBS', ...LADDER.map(r => 'Starship · ' + r.k)];
    const line100 = { id:'ship100', afterDatasetsDraw(c){ const x = c.scales.x.getPixelForValue(ORBIT_KG_NEEDED), a = c.chartArea, g = c.ctx;
      if(x < a.left || x > a.right) return; g.save(); g.strokeStyle = '#DC2626'; g.setLineDash([4,4]); g.beginPath(); g.moveTo(x, a.top); g.lineTo(x, a.bottom); g.stroke();
      g.setLineDash([]); g.fillStyle = '#DC2626'; g.font = '600 10.5px Inter'; g.fillText('~$100/kg needed', x + 5, a.top + 10); g.restore(); } };
    chartBlock($('#ship-k'), { labels:L, horizontal:true, log:true, unit:'$/kg', fmt:v => '$' + num(v), rowHead:'Vehicle / scenario',
      series:[ { key:'f9', label:'Falcon 9 today', color:C.grey, data:[F9_KG[1][1], F9_KG[0][1], null, null, null, null] },
               { key:'ss', label:'Starship (Deutsche Bank)', color:C.conn, data:[null, null, ...LADDER.map(r => r.kg)] } ],
      tableNote:'Starship cost per flight / payload: ' + LADDER.map(r => r.k + ' ~$' + r.cost + 'M / ' + r.t + 't').join(' · ') + '. The 424B4’s ~$2,700/kg (citing NASA) is Falcon 9’s first version in 2010, not today (UBS p.21). Falcon Heavy: $1,520/kg (Barclays).',
      extra: c => { c.plugins = [line100]; c.options.datasets = { bar:{ skipNull:true } }; c.options.scales.x.ticks = { callback: v => [10,100,1000,10000].includes(v) ? '$' + num(v) : '' }; } });

    const L2 = ['9M 2025','9M 2026'];
    const M = {
      n:{ unit:'launches', fmt:v => num(v), stacked:true, total:true, series:[
          { key:'i', label:'Internal (Starlink)', color:C.conn, data:SPACE.internal, stack:'a' },
          { key:'c', label:'Customer', color:C.space, data:SPACE.customer, stack:'a' } ] },
      t:{ unit:'tonnes', fmt:v => num(v) + ' t', series:[ { key:'m', label:'Mass to orbit', color:C.conn, data:SPACE.massT } ] },
      e:{ unit:'$M', fmt:v => usd(v), series:[
          { key:'e', label:'Space adj. EBITDA', color:C.space, data:SPACE.ebitda },
          { key:'r', label:'Starship R&D', color:C.si, data:SPACE.starshipRD } ] }
    };
    const blk = chartBlock($('#ship-c'), { labels:L2, rowHead:'Period', height:'s', ...M.n });
    pills('#ship-m', v => blk.set({ stacked:false, total:false, ...M[v] }));
  }
});
