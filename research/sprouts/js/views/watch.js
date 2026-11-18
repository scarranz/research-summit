/* What to watch — Sprouts-specific risks, open questions, data notes */
const SRISKS = [
  { t:'The price investment does not bring traffic back', w:'From Q4 2026 Sprouts invests in "broader and deeper" prices — the first time the filings show it competing on price. If comps stay negative, margin gives way without volume returning.', watch:'Q4’26 comps vs the −2% to −4% guide; FY27 margin guidance; gross margin vs shrink.' },
  { t:'New stores earn less than promised', w:'Growth depends on ~10% more stores a year. New stores start at lower margins, take some sales from nearby older stores, and need landlord contributions to hit the ~40% cash-on-cash target — which has never been reported.', watch:'Openings vs 42 net new; sales per store; any disclosure of new-store returns.' },
  { t:'Produce and food safety', w:'Fresh produce is the core. Weather, disease, grower concentration, recalls and illness claims hit directly — the 2026 cyclospora outbreak cost ~0.6 pt of Q3 comps.', watch:'Recalls and outbreaks; shrink in gross margin.' },
  { t:'Comps are volatile', w:'The 10-K flags "cycling prior year performance". Comps went from +11.7% (Q1’25) to −1.7% (Q1’26) in a year.', watch:'Two-year stacked comps, not single-year.' },
  { t:'Supplier and network concentration', w:'KeHE supplies 52% of purchases (contract to Jul 2035); UNFI 12% (contract to Jul 2026). Six DCs carry all produce and most meat and seafood.', watch:'UNFI contract renewal; any DC disruption.' },
  { t:'Geographic concentration', w:'California is 156 stores, a third of the chain: its economy, rules, weather and wildfires weigh on the whole.', watch:'California comps if ever disclosed; new-state mix.' },
  { t:'Competition and labour', w:'Whole Foods, Trader Joe’s, Kroger, Albertsons, H-E-B, Publix, Walmart, Costco and Amazon all widen natural and organic ranges. No unions today; organising and wage inflation are flagged.', watch:'Rival price moves; wage commentary.' },
  { t:'Leadership change', w:'Nick Konat takes over as CEO on Jan 4 2027; Sinclair, architect of the 2019–20 reset, stays as Executive Chairman. Merchandising and technology leaders also changed in 2026.', watch:'First guidance under the new CEO (Feb 2027).' }
];

registerView({ id:'watch',
  html: `
  ${sec({ t:'Risks specific to Sprouts', s:'From the 10-K FY25 and the Q3 2026 10-Q, not boilerplate',
    b:`<div class="rk"><div class="rk-l" id="watch-l"></div><div class="rk-d" id="watch-d"></div></div>`,
    n:'10-K FY25 Item 1A; 10-Q Q3 2026; 8-K Sep 1 2026. Ordered by how directly each touches the current story.' })}

  ${sec({ t:'Open questions', s:'What the filings do not answer',
    b:`<div>
      <div class="st"><b>New-store returns</b><span><span class="tag open">Not disclosed</span></span><span>Build cost and cash-on-cash returns vs the 2020 targets (~20% cheaper, ~40%) are never reported.</span></div>
      <div class="st"><b>Sales per store / sq ft</b><span><span class="tag open">Not disclosed</span></span><span>Only our sales ÷ average stores. No e-commerce share since two monthly points in 2020.</span></div>
      <div class="st"><b>Size of the price cut</b><span><span class="tag wait">Q4 print</span></span><span>No figure given for the price investment; Q4 implies ~$63M EBIT vs $123M a year ago.</span></div>
      <div class="st"><b>$69M "finance obligations"</b><span><span class="tag wait">Unexplained</span></span><span>New in FY25, due 2036; probably a sale-leaseback or build-to-suit. The filings do not say.</span></div>
      <div class="st"><b>One store missing in Q3’26</b><span><span class="tag n">Minor</span></span><span>490 + 15 openings = 505, but 504 reported; no closure disclosed.</span></div>
    </div>`,
    n:'SEC filings only; no Bloomberg consensus or Summit model for SFM.' })}

  ${sec({ t:'Reading the numbers', s:'Quirks that change a chart if missed',
    b:`<ul class="pl">
      <li><strong>53-week years:</strong> FY15, FY20 and FY26 (extra week in Q4’26). FY26 guidance is on a 52-week basis.</li>
      <li><strong>2018 reclassification:</strong> occupancy and buying costs moved from cost of goods to SG&A, back to FY16. FY15 gross margin is not comparable and is left out.</li>
      <li><strong>Perishables definition</strong> changed in the FY18 10-K (dairy and floral moved in, +7–8 pts).</li>
      <li><strong>Square footage</strong> basis changed twice (gross → selling → total excl. vacant).</li>
      <li><strong>Capex</strong> here is gross; the company quotes it net of landlord reimbursements (FY25 $224M net vs $248M gross).</li>
    </ul>`,
    n:'Data pack built from SEC EDGAR (CIK 1575515): 10-K FY15–FY25, 10-Qs and earnings 8-Ks Q4’23–Q3’26, leadership 8-Ks.' })}
  `,
  init(){
    $('#watch-l').innerHTML = SRISKS.map((r,i) => `<button class="rk-b" data-i="${i}"><span class="n">${i+1}</span><span>${r.t}</span></button>`).join('');
    const pick = i => { const r = SRISKS[i];
      $$('#watch-l .rk-b').forEach(b => b.classList.toggle('active', +b.dataset.i === i));
      $('#watch-d').innerHTML = `<h4>${i+1} · ${r.t}</h4><p class="lede">${r.w}</p><div class="blk"><div class="k">What to watch</div><p>${r.watch}</p></div>`; };
    $$('#watch-l .rk-b').forEach(b => b.onclick = () => pick(+b.dataset.i)); pick(0);
  }
});
