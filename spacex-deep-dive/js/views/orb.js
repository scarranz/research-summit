/* Orbital compute — physics sound, economics hang on one variable */
registerView({ id:'orb',
  html: `
  <div class="srow">
    ${tile('Orbital revenue today', '$0', 'All $10.9B of 9M SI revenue is earned on the ground')}
    ${tile('Launch cost needed', '~$100/kg', 'Threshold in the S-1, per Clear Street')}
    ${tile('Deutsche Bank crossover', '$154/kg', 'Full Starship reuse, ~2032')}
    ${tile('One satellite ≈ one rack', '120–150 kW', '110 m² radiator; ~550 km orbit')}
  </div>

  ${sec({ t:'Cost of one gigawatt: in orbit or in a building', s:'The rocket is neither column; its $/kg is an input to the orbital one',
    ctl:`<div class="ctls">${seg('orb-t','Terrestrial $/GW',[['db','DB table'],['ubs','UBS ~40'],['bar','Barclays 50–60'],['hu','Huang ~100']],'db')}</div>`,
    b:`<div id="orb-c"></div>`,
    n:'Orbital column and launch scenarios: Deutsche Bank (Jul 2026); other terrestrial views: UBS, Barclays, and Jensen Huang as cited in DB. Our note: DB’s own terrestrial column ($20–25B/GW) contradicts its footnote (Huang ~$100B/GW); a higher terrestrial cost brings the crossover earlier.' })}

  ${sec({ t:'The dependency chain', s:'The launch moat becomes a compute moat only if compute goes to orbit',
    b:`<div class="chain">
      <div class="lnk weak"><div class="k">Unproven</div><div class="v">Ship reuse at high rate</div><p>Heat shield survives orbital re-entry repeatedly</p></div><div class="arr">→</div>
      <div class="lnk"><div class="k">Follows</div><div class="v">$/kg falls below ~$150</div><p>Each reuse milestone is a step down</p></div><div class="arr">→</div>
      <div class="lnk"><div class="k">Follows</div><div class="v">Orbit beats a building</div><p>Only if satellite cost is ~$900K or less (UBS)</p></div><div class="arr">→</div>
      <div class="lnk"><div class="k">Payoff</div><div class="v">Cost moat in compute</div><p>Today the edge in Memphis is build speed, not cost</p></div>
    </div>
    <div class="ins" style="margin-top:16px"><strong>Read it backwards:</strong> orbital compute is not a side bet on top of renting GPUs. It is the only route by which the launch cost advantage ever becomes a compute cost advantage. That is why Starship timing dominates everything.</div>`,
    n:'The chain is our read. Inputs: Deutsche Bank ($/kg path, Jul 2026) and UBS (satellite break-even ~$900K, between the V2 mini at ~$600K and V3 at ~$1.2M, Jul 2026).' })}

  ${sec({ t:'What is settled and what is not', s:'The physics is not in doubt; engineering at scale is',
    b:`<div class="cols2">
      <div><div class="pt"><i style="background:${C.pos}"></i>Four quantities that can be checked</div><ul class="pl">
        <li><strong>Sunlight:</strong> on a dawn–dusk orbit a panel gets ~40% more energy than on the ground, almost continuously.</li>
        <li><strong>Cooling:</strong> heat radiates to vacuum at a rate physics fixes; the published design dissipates ~1,400 W/m².</li>
        <li><strong>Radiation:</strong> the planned altitude is below the belts that damage electronics.</li>
        <li><strong>Latency:</strong> a few milliseconds round trip at 550 km. Small, not an obstacle.</li></ul></div>
      <div><div class="pt"><i style="background:${C.neg}"></i>Open at scale</div><ul class="pl">
        <li><strong>Heat</strong> is "the single most binding constraint"; radiators weigh ~80% of the satellite (UBS expert).</li>
        <li><strong>Radiation shielding</strong> for commercial accelerators is "unsolved at scale" (Needham).</li>
        <li><strong>No repair:</strong> UBS assumes 5% of GPUs in orbit fail each year.</li>
        <li><strong>Barclays scorecard:</strong> ground wins on upfront cost, life, repair and data speed; orbit only on running cost and scale.</li></ul></div>
    </div>`,
    n:'UBS and Needham initiations, Barclays. With a 5-year life matched to NVIDIA chips, Starcloud’s $0.002/kWh becomes $0.048/kWh (Barclays).' })}

  ${sec({ t:'The obstacle that may bind before cost', s:'Open question 2 — no filing or analyst note addresses it',
    b:`<p class="lede" style="font-size:13px">Data-protection regimes are written in terms of territory. A US-registered satellite processing a European bank’s records while over a third country fits none of their categories. If regulated customers cannot legally use orbital compute, the market shrinks to workloads with <strong>no residency obligations</strong> — a fraction of what the case assumes.</p>`,
    n:'Our own work, not yet done: GDPR transfer rules, national data-localisation laws, and how the Outer Space Treaty’s state-of-registry jurisdiction interacts with them.' })}
  `,
  init(){
    const T = { db:null, ubs:TERR.ubs, bar:TERR.barclays, hu:TERR.huang };
    const mk = k => ({ labels:ORB.map(r => r.k + ' · $' + num(r.kg) + '/kg'), unit:'$B per GW', fmt:v => '$' + num(v) + 'B', rowHead:'Launch scenario',
      series:[ { key:'o', label:'In orbit', color:C.conn, data:ORB.map(r => r.orbital) },
               { key:'t', label:'In a building' + (k === 'db' ? ' (DB)' : ''), color:C.si, data:ORB.map(r => T[k] == null ? r.terr : T[k]) } ],
      tableNote:'Orbit ÷ building: ' + ORB.map(r => r.k + ' ' + (r.orbital / (T[k] == null ? r.terr : T[k])).toFixed(1) + '×').join(' · ') +
        '. Other frames: UBS 1 GW with 140 Starship launches at $250/kg — $40.4B orbit vs $46.2B ground; Google Suncatcher ~$810/kW/yr in orbit below $200/kg vs $570–3,000 on the ground.' });
    const blk = chartBlock($('#orb-c'), mk('db'));
    pills('#orb-t', v => blk.set(mk(v)));
  }
});
