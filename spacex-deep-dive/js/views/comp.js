/* Why this operator — simultaneity, alternatives, supply chain */
registerView({ id:'comp',
  html: `
  ${sec({ t:'Four capabilities at once', s:'The case is simultaneity, not superiority on any single axis',
    b:`<div class="tw">${table(['', 'Reusable heavy launch', 'Satellites in volume', 'An operating network', 'Capital at scale'], [
      ['<b>SpaceX</b>', '<span class="tag ok">Owns</span>', '<span class="tag ok">Owns</span>', '<span class="tag ok">Owns</span>', '<span class="tag wait">Rented from markets</span>'],
      ['<b>Large tech rival</b> (Amazon Leo)', '<span class="tag open">Buys it</span>', '<span class="tag wait">Building</span>', '<span class="tag wait">Building</span>', '<span class="tag ok">Unlimited</span>'],
      ['<b>Small commercial launchers</b>', '<span class="tag wait">Small payload</span>', '<span class="tag open">No</span>', '<span class="tag open">No</span>', '<span class="tag open">No</span>'],
      ['<b>State programmes</b>', '<span class="tag wait">Growing</span>', '<span class="tag wait">Some</span>', '<span class="tag open">No retail network</span>', '<span class="tag wait">Public, not investable</span>'],
      ['<b>Legacy heavy-lift contractors</b>', '<span class="tag wait">Expendable</span>', '<span class="tag open">No</span>', '<span class="tag open">No</span>', '<span class="tag n">—</span>']
    ])}</div>`,
    n:'Our read, from the 424B4 (Business, competition), the Amazon Leo comparison in the Starlink tab and the sell-side initiations. State programmes are better read as a reason to discount the incumbent’s long-run pricing power than as alternatives to buy.' })}

  ${sec({ t:'How to test an alternative', s:'Each test uses published data',
    b:`<div>
      <div class="gl"><b>Small launchers</b><span>Payload to orbit per flight, and the demonstrated re-flight interval of the same vehicle. A few hundred kilos is a different industry from a hundred tonnes.</span></div>
      <div class="gl"><b>State programmes</b><span>Whether the programme sells connectivity to paying civilian customers outside its own territory — the step that turns capacity into a competing business.</span></div>
      <div class="gl"><b>Legacy contractors</b><span>Cost per kilogram and cadence. Relevant for second-source government work, not on the cost curve this thesis depends on.</span></div>
    </div>`,
    n:'Our framework; each test uses published company data (payload, cadence, cost per kilogram, paying customers).' })}

  ${sec({ t:'Supply chain, honestly', s:'There is no undiscovered supplier: the market has scanned the list since the June IPO',
    b:`<div class="tw">${table(['Company', 'Link to SpaceX', 'What it tells you'], [
      ['<b>Filtronic</b> (FTC:AIM)', 'E-band SSPA modules for ground stations; 5-year deal (Apr 2024), $19.7M first order. SpaceX gets warrants on up to 10% of the equity.', 'SpaceX was paid in equity to be a customer. Tranche vesting is a public gauge of the ground-station build. The market has already priced the link.'],
      ['<b>Credo</b> (CRDO)', '$537M relationship, ~28% of Credo revenue: active copper cables and optical DSPs for Colossus.', 'Direct Colossus driver, but SpaceX is one customer of a much larger business — no longer a pure play.'],
      ['<b>Tesla</b> (TSLA)', '$650M of products/services to SpaceX (6.88% of SpaceX cost of goods, Bloomberg SPLC); Terafab partner (Q3 2026 call).', 'The only other listed way into the ecosystem; independent committees are evaluating a combination, no terms agreed (Q3 2026 call).'],
      ['<b>Howmet</b> (HWM)', 'Structural components.', 'SpaceX is one piece of a diversified mix.']
    ])}</div>`,
    n:'Filtronic: company announcement (RNS) of the SpaceX strategic agreement, Apr 2024, as summarised by Cavendish (non-independent research, Filtronic’s broker). Credo, Tesla, Howmet: Bloomberg SPLC (Nov 12 2026), relationship data compiled from company disclosures. Terafab and the Tesla committees: SpaceX Q3 2026 call. No share prices are shown.' })}
  `
});
