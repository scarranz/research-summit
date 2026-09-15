// segments-data/dhr.js — the Segments dataset for Danaher. Same contract as
// js/segments-data/amzn.js; rendered by the generic js/segments.js, which builds Deep Dive ▸
// Top Line's four sub-tabs (Overview · Segments · Other · Customers).
//
// HAND-BUILT, not emitted: scripts/segments/emit_segments.py is wired to Amazon's source JSONs.
// Everything here is traceable to Danaher's FY2025 10-K, the 10-K/10-Q segment notes, or the
// Q2 2026 press release and earnings presentation (21-Jul-2026), and each block says which.
//
// Drivers marked `from: 'results:<key>'` are POINTERS into js/results-data/dhr.js — segment
// revenue and operating profit keep exactly one home and are never copied here.
//
// ── Where the numbers came from, because it is not the obvious place ──────────────────────────
// Segment figures are DIMENSIONAL XBRL facts. The `companyconcept` API does not return them, which
// is why they look unavailable. They are in the rendered "Segment Information (Segment Data)
// (Details)" R-files of every 10-K and 10-Q on EDGAR: walk the submissions JSON for the filing
// list, read each FilingSummary.xml for the report id, fetch that R<n>.htm. Six 10-Ks and eight
// 10-Qs give FY2020–FY2025 annually and 1Q23–2Q26 quarterly.
//
// ── The two structural breaks ─────────────────────────────────────────────────────────────────
//   FY2022 — Danaher split the old single "Life Sciences" segment into Biotechnology and Life
//            Sciences, restating back to FY2020 and no further. Before FY2020 the split does not
//            exist in anything filed.
//   FY2023 — Environmental & Applied Solutions left continuing operations, spun off as Veralto on
//            30-Sep-2023, restating FY2021 and FY2022 only.
// The main axis therefore starts at FY2021, where everything is on one basis. The pre-Veralto
// company is carried as its own cut in `other`, labelled as what it is, so a reader can see
// Veralto leave rather than wonder why the total drops 24% between two years.

export var dhrSegments = {
  company: 'Danaher',
  updated: 'Aug 2026',
  source: 'Segment revenue and operating profit are read from the Results dataset (js/results-data/dhr.js), which sources them from Danaher\'s 10-K and 10-Q segment notes via SEC EDGAR (CIK 0000313616). Segment depreciation and amortisation, capital expenditure, impairment charges and identifiable assets are from the annual 10-K segment note. Recurring / non-recurring revenue and revenue by region are from Note 5 of the FY2025 10-K, in dollars per segment for three years. The growth bridges are from the FY2025 annual report segment pages and the Q2 2026 press release and earnings presentation, 21-Jul-2026. Fourth quarters are derived as the fiscal year less the three published quarters.',

  axis: {
    q: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
    y: ['2021','2022','2023','2024','2025']
  },

  // ── Company-scope series, shared across segments and used by the `other` cuts ───────────────
  shared: {
    geo_us: { label: 'United States', short: 'United States', unit: 'usdM', src: '10-K segment note, sales by country', scope: 'company',
      y: { act: { '2021': 9411, '2022': 11289, '2023': 9579, '2024': 9927, '2025': 9981 }, summit: {} } },
    geo_cn: { label: 'China', short: 'China', unit: 'usdM', src: '10-K segment note, sales by country', scope: 'company',
      y: { act: { '2021': 3565, '2022': 3611, '2023': 3143, '2024': 2805, '2025': 2631 }, summit: {} } },
    geo_other: { label: 'All other countries', short: 'All other', unit: 'usdM', src: '10-K segment note, sales by country', scope: 'company',
      y: { act: { '2021': 11826, '2022': 11743, '2023': 11168, '2024': 11143, '2025': 11956 }, summit: {} } },

    // ── Note 5, "Revenue" — the disaggregation, IN DOLLARS, three years ────────────────────────
    // This note is the one that is easy to miss and easy to get wrong. The SEGMENT note gives
    // sales by COUNTRY for the countries above 5% (the geo_* series above). Note 5 gives a
    // different cut entirely: sales by REGION and by REVENUE TYPE, per segment, in dollars.
    // Danaher's annual report also states the recurring mix as round percentages, which is what
    // most write-ups quote — but the dollars exist, and they say more than the percentages do.
    rec:    { label: 'Recurring revenue', short: 'Recurring', unit: 'usdM', src: '10-K Note 5 — revenue by type', scope: 'company',
      y: { act: { '2023': 18682, '2024': 19366, '2025': 20127 }, summit: {} } },
    nonrec: { label: 'Non-recurring revenue', short: 'Non-recurring', unit: 'usdM', src: '10-K Note 5 — revenue by type', scope: 'company',
      y: { act: { '2023': 5208, '2024': 4509, '2025': 4441 }, summit: {} } },
    reg_na: { label: 'North America', short: 'North America', unit: 'usdM', src: '10-K Note 5 — revenue by region', scope: 'company',
      y: { act: { '2023': 9961, '2024': 10295, '2025': 10356 }, summit: {} } },
    reg_we: { label: 'Western Europe', short: 'Western Europe', unit: 'usdM', src: '10-K Note 5 — revenue by region', scope: 'company',
      y: { act: { '2023': 5468, '2024': 5457, '2025': 5938 }, summit: {} } },
    reg_hg: { label: 'High-growth markets', short: 'High-growth', unit: 'usdM', src: '10-K Note 5 — revenue by region', scope: 'company',
      y: { act: { '2023': 7191, '2024': 6870, '2025': 7022 }, summit: {} } },
    reg_od: { label: 'Other developed markets', short: 'Other developed', unit: 'usdM', src: '10-K Note 5 — revenue by region', scope: 'company',
      y: { act: { '2023': 1270, '2024': 1253, '2025': 1252 }, summit: {} } },

    // The company as it was constituted before Veralto — FY2020–FY2022 only, on purpose.
    leg_bio: { label: 'Biotechnology', short: 'Biotechnology', unit: 'usdM', src: 'FY2022 10-K segment note', scope: 'company',
      y: { act: { '2020': 5276, '2021': 8570, '2022': 8758 }, summit: {} } },
    leg_ls: { label: 'Life Sciences', short: 'Life Sciences', unit: 'usdM', src: 'FY2022 10-K segment note', scope: 'company',
      y: { act: { '2020': 5300, '2021': 6388, '2022': 7036 }, summit: {} } },
    leg_dx: { label: 'Diagnostics', short: 'Diagnostics', unit: 'usdM', src: 'FY2022 10-K segment note', scope: 'company',
      y: { act: { '2020': 7403, '2021': 9844, '2022': 10849 }, summit: {} } },
    leg_ea: { label: 'Environmental & Applied Solutions', short: 'Env. & Applied', unit: 'usdM', src: 'FY2022 10-K segment note', scope: 'company',
      y: { act: { '2020': 4305, '2021': 4651, '2022': 4828 }, summit: {} } }
  },

  derived: {
    opMgn:     { label: 'Segment operating margin', short: 'Op. margin', unit: 'pct', num: 'opinc', den: 'rev' },
    capexInt:  { label: 'Capital expenditure as % of revenue', short: 'Capex %', unit: 'pct', num: 'capex', den: 'rev' },
    daInt:     { label: 'Depreciation & amortisation as % of revenue', short: 'D&A %', unit: 'pct', num: 'da', den: 'rev' },
    assetTurn: { label: 'Revenue per $ of identifiable assets', short: 'Asset turn', unit: 'x', num: 'rev', den: 'assets' },
    roa:       { label: 'Operating profit per $ of identifiable assets', short: 'Return on assets', unit: 'pct', num: 'opinc', den: 'assets' },
    impInt:    { label: 'Impairment charges as % of revenue', short: 'Impairment %', unit: 'pct', num: 'impair', den: 'rev' },
    recShare:  { label: 'Recurring share of revenue', short: 'Recurring %', unit: 'pct', num: 'rec', den: 'rev' }
  },

  overview: {
    lede: '',
    tenK: { text: 'The Company operates and reports its results in three business segments consisting of the Biotechnology, Life Sciences and Diagnostics segments. In addition, the Company reports the corporate function as "Other."', where: 'Note — Segment Information' },
    interactions: [
      { name: 'One margin problem, one segment',
        what: 'The group\'s operating margin fell from 28.3% in FY2022 to 19.1% in FY2025, and reading that off the consolidated line suggests a company in decline. It is not distributed. Life Sciences went from a 20.1% operating margin to 7.1% while its revenue barely moved; Biotechnology settled around 25% and Diagnostics never left 27%. Any thesis about "Danaher\'s margins" is a thesis about one third of the company.',
        evidence: 'Life Sciences operating profit $1,414M in FY2022 → $520M in FY2025, on revenue of $7,036M → $7,334M. Impairment charges inside that line: $0M FY2023, $222M FY2024, $446M FY2025.' },
      { name: 'The same instrument model, three different clocks',
        what: 'All three sell placed instruments and live off the consumables that follow, but they are bought out of different budgets — Biotechnology out of drug makers\' manufacturing capex, Life Sciences out of research budgets, Diagnostics out of hospital operating budgets and reimbursement. That is why they do not move together, and why the group\'s core growth is a blend that describes none of them.',
        evidence: 'Recurring share of FY2025 sales: Biotechnology 88%, Life Sciences 66%, Diagnostics 89%. In 1Q26 core growth was Biotechnology +7.0%, Life Sciences +0.5%, Diagnostics −4.0%.' },
      { name: 'Two things inside Diagnostics that are not the business',
        what: 'Diagnostics carries a respiratory-testing tail that is still shrinking and a China volume-based-procurement headwind, and both are large enough to invert the segment\'s reported growth. Danaher now publishes a core-growth-ex-respiratory line precisely because the headline stopped describing the business — and from Q3\'26 it will also exclude tariff refunds.',
        evidence: 'Respiratory ~$1,900M in FY2025 falling to ~$1,600M expected in FY2026. In 1H26 it was a 5.0pp headwind to Diagnostics core growth: −1.0% reported core became +4.0% ex-respiratory.' },
      { name: 'Acquisitions arrive inside a segment, never as one',
        what: 'Danaher has bought and separated its way through four decades and has never created a segment for an acquisition. Masimo landed inside Diagnostics in June 2026; Cytiva landed inside what is now Biotechnology in 2020. The consequence is that a segment\'s reported growth mixes the business with whatever was just bought, and only the core line separates them.',
        evidence: 'Masimo added 4.0pp to Diagnostics\' reported growth in 2Q26 and carried $108M of pretax acquisition items in the quarter; the segment\'s core growth was 2.0%.' }
    ]
  },

  // ── Alternative cuts of the same revenue ────────────────────────────────────────────────────
  other: [
    {
      key: 'geo', label: 'Geography', sub: 'sales by country of destination',
      lede: 'The same total revenue cut by country. Danaher names only the countries that clear 5% of sales — the United States and China — and buckets the rest, so this is a concentration disclosure rather than a map. The finding it does carry is China: $3,565M in FY2021 and $2,631M in FY2025, from 14.4% of sales to 10.7%, a fall of a quarter in dollars while the company grew.',
      caveat: 'The 5% threshold is Danaher\'s own accounting policy, which is why the United Kingdom and Sweden appear in the property table but never in the sales one. Sales are attributed by geographic destination — where the final sale to the unaffiliated customer is made — so this is not a map of where demand or manufacturing physically sits. The series starts at FY2021 because that is as far back as the Veralto restatement reaches.',
      note: 'Annual only. The country table appears in the 10-K segment note and not in the quarterly reports.',
      tenK: { text: 'Sales by geographic destination are based on where the final sale to an unaffiliated customer is made.', where: 'Note — Segment Information' },
      axis: { y: ['2021','2022','2023','2024','2025'] },
      views: ['y'],
      cite: { form: '10-K', period: '2025-12-31', accession: '0000313616-26-000062',
              url: 'https://www.sec.gov/Archives/edgar/data/313616/000031361626000062/' },
      spans: 'Assembled from two 10-K filings — each carries three fiscal years, so reaching back to FY2021 means reading more than one.',
      series: [
        { key: 'geo_us', ref: 'shared:geo_us', label: 'United States' },
        { key: 'geo_cn', ref: 'shared:geo_cn', label: 'China' },
        { key: 'geo_other', ref: 'shared:geo_other', label: 'All other countries' }
      ]
    },
    {
      key: 'type', label: 'Recurring vs one-off', sub: 'revenue by type, in dollars',
      lede: 'The cut that explains why a flat revenue line is not a flat business. Danaher\'s total went $23,890M → $23,875M → $24,568M and looks like nothing happened. Underneath, <b>recurring revenue compounded about 4% a year</b> — $18,682M to $20,127M — while <b>non-recurring fell 15% in two years</b>, from $5,208M to $4,441M. The whole instrument-cycle downturn is in the second line, and it is fully disclosed.',
      caveat: 'Most write-ups quote the annual report\'s round percentages (82% recurring; 88 / 66 / 89 by segment) because that is what the segment pages show. The dollars are in <b>Note 5 of the 10-K</b>, per segment, and they say more: the percentages are stable while the two halves move in opposite directions. Recurring is consumables, reagents and service; non-recurring is instruments and equipment. Annual only — Note 5 does not appear in the 10-Qs — and the note reaches back three years, so FY2023 is the earliest.',
      note: 'Danaher gives this per segment as well. The company total is charted; the segment split is in the KPI section of each segment.',
      tenK: { text: 'The following table presents the Company\'s revenues disaggregated by geographical region and revenue type.', where: 'Note 5 — Revenue' },
      axis: { y: ['2023','2024','2025'] },
      views: ['y'],
      cite: { form: '10-K', period: '2025-12-31', accession: '0000313616-26-000062',
              url: 'https://www.sec.gov/Archives/edgar/data/313616/000031361626000062/' },
      series: [
        { key: 'rec', ref: 'shared:rec', label: 'Recurring' },
        { key: 'nonrec', ref: 'shared:nonrec', label: 'Non-recurring' }
      ]
    },
    {
      key: 'regions', label: 'Regions', sub: 'revenue by region, in dollars',
      lede: 'Danaher\'s own regional grouping, in dollars — a different cut from the country table, which names only the countries above 5% of sales. The flat line here is <b>high-growth markets</b>: $7,191M in FY2023 and $7,022M in FY2025, no growth over two years for the bucket that is supposed to be the growth. China, inside it, went from $3,143M to $2,631M over the same period.',
      caveat: 'The definitions are Danaher\'s and are not the obvious ones: <b>North America</b> is the US and Canada; <b>high-growth markets</b> are Eastern Europe, the Middle East, Africa, Latin America including Mexico, and Asia except Japan, Australia and New Zealand; <b>developed markets</b> is everything else. So Japan and Australia sit in "other developed", not in Asia. Revenue is attributed by destination — where the final sale to the unaffiliated customer is made — not by where anything is manufactured.',
      note: 'Annual only, from Note 5, which carries three fiscal years. Danaher gives this per segment too.',
      tenK: { text: 'The Company defines high-growth markets as Eastern Europe, the Middle East, Africa, Latin America (including Mexico) and Asia (with the exception of Japan, Australia and New Zealand). The Company defines developed markets as all markets of the world that are not high-growth markets.', where: 'Note 5 — Revenue' },
      axis: { y: ['2023','2024','2025'] },
      views: ['y'],
      cite: { form: '10-K', period: '2025-12-31', accession: '0000313616-26-000062',
              url: 'https://www.sec.gov/Archives/edgar/data/313616/000031361626000062/' },
      series: [
        { key: 'reg_na', ref: 'shared:reg_na', label: 'North America' },
        { key: 'reg_we', ref: 'shared:reg_we', label: 'Western Europe' },
        { key: 'reg_hg', ref: 'shared:reg_hg', label: 'High-growth markets' },
        { key: 'reg_od', ref: 'shared:reg_od', label: 'Other developed markets' }
      ]
    },
    {
      key: 'legacy', label: 'Before Veralto', sub: 'the four-segment company, FY2020–FY2022',
      lede: 'What Danaher looked like while it still owned Environmental & Applied Solutions — water quality and product identification, spun off as Veralto on 30 September 2023. This cut exists so the FY2023 drop in the headline total reads as what it is. Revenue went from $31,471M as reported for FY2022 to $23,890M for FY2023, and none of that is the business shrinking.',
      caveat: 'These are the figures AS REPORTED AT THE TIME and they are not comparable with anything on the main axis: FY2021 is $29,453M here and $24,802M everywhere else, the same year on two bases. Danaher restated FY2021 and FY2022 for the separation and stopped there, so FY2020 has never been put on today\'s basis at all — which is also why the Biotechnology/Life Sciences split, introduced in FY2022 and restated back to FY2020, reaches exactly that far and no further.',
      note: 'Annual only, and it ends where it ends on purpose: FY2023 is the first year Danaher reported without this segment.',
      axis: { y: ['2020','2021','2022'] },
      views: ['y'],
      cite: { form: '10-K', period: '2022-12-31', accession: '0000313616-23-000087',
              url: 'https://www.sec.gov/Archives/edgar/data/313616/000031361623000087/' },
      series: [
        { key: 'leg_bio', ref: 'shared:leg_bio', label: 'Biotechnology' },
        { key: 'leg_ls', ref: 'shared:leg_ls', label: 'Life Sciences' },
        { key: 'leg_dx', ref: 'shared:leg_dx', label: 'Diagnostics' },
        { key: 'leg_ea', ref: 'shared:leg_ea', label: 'Environmental & Applied Solutions' }
      ]
    }
  ],

  // ── Customers ───────────────────────────────────────────────────────────────────────────────
  customers: {
    classes: [
      { key: 'pharma', label: 'Pharma, biopharma and their manufacturers',
        text: 'The Biotechnology segment\'s customers include pharmaceutical and biopharmaceutical companies, contract manufacturers, biotechnology companies and translational medicine institutions, as well as universities and research institutes.',
        where: 'Item 1 — Business' },
      { key: 'research', label: 'Researchers and applied laboratories',
        text: 'The Life Sciences segment sells to researchers in pharmaceutical and biotechnology companies, academic and government institutions, and to quality assurance and quality control technicians and industrial manufacturers, including semiconductor, aerospace, refining, food and beverage customers for filtration.',
        where: 'Item 1 — Business' },
      { key: 'clinical', label: 'Hospitals, laboratories and critical care',
        text: 'The Diagnostics segment sells to hospitals, physicians\' offices, reference laboratories, blood banks and critical care settings.',
        where: 'Item 1 — Business' }
    ],
    concentration: {
      disclosed: false,
      note: 'The FY2025 10-K carries no customer-concentration disclosure at all — there is no "Major Customers" heading, no "no single customer accounted for 10% of sales" sentence, and no customer is named anywhere in the filing. The only such language ever verified for Danaher is from FY2019, and it came from a search snippet rather than the filing itself, so it is six years stale and is not carried forward here. Any named top-customer list for Danaher is inference. What the filing does describe is the channel: Danaher sells primarily through a direct sales force, with most non-US sales made by non-US subsidiaries; it also sells from the US into non-US markets through representatives and distributors and, in countries with low sales volumes, generally through representatives and distributors. Diagnostics uses both direct sales personnel and independent distributors.'
    },
    cite: { form: '10-K', period: '2025-12-31', accession: '0000313616-26-000062',
            url: 'https://www.sec.gov/Archives/edgar/data/313616/000031361626000062/' },
    splc: null
  },

  // ── The three segments ──────────────────────────────────────────────────────────────────────
  segments: [
    {
      key: 'bio', label: 'Biotechnology', short: 'Biotech',
      lede: 'The tools that make a biologic drug. Danaher sells the resins, media, filters and single-use hardware a manufacturing suite runs on — and often designs and installs the suite itself. 88% of the revenue is recurring, so the honest read is installed capacity against how hard it is being run, not price × units.',
      sells: [
        { name: 'Bioprocessing', what: 'Cell-line and media development, cell culture media, process liquids and buffers, chromatography resins, filtration, aseptic fill-finish, single-use hardware and consumables, and whole manufacturing-suite design and installation.' },
        { name: 'Discovery & medical', what: 'Lab filtration and purification, protein purification and bio-molecular analysis, reagents and membranes for assay development, and healthcare filtration.' }
      ],
      summary: 'Biotechnology sells the instruments and consumables used to develop and manufacture biological medicines — monoclonal antibodies, recombinant proteins, insulin, vaccines, and cell, gene, mRNA and other nucleic-acid therapies. Brands are Cytiva and Pall. It is the segment that gave back the most after the 2021–22 biopharma build-out and the one that has recovered first.',
      brief: 'Sells the picks and shovels for making biologic drugs. A customer builds a manufacturing line once and then buys resins, filters and media from Danaher for as long as that line runs — which is why 88% of the revenue comes back every year without a new sale, and why a pause in customers\' capital spending shows up as a revenue decline two years later rather than immediately.',
      tenK: { text: 'The Biotechnology segment provides the tools used in the development and manufacture of biological medicines, including monoclonal antibodies, recombinant proteins, insulin and vaccines, as well as cell, gene, mRNA and other nucleic acid-based therapies.', verbatim: true, cite: 'DANAHER CORP, 10-K (period 2025-12-31, accession 0000313616-26-000062)', url: 'https://www.sec.gov/Archives/edgar/data/313616/000031361626000062/', where: 'Item 1 — Business', needs: null },
      products: [
        { name: 'Bioprocessing', what: 'Chromatography resins, filtration, cell culture media, process liquids, single-use hardware and consumables, aseptic fill-finish, and manufacturing-suite design and installation.',
          customers: {
            archetype: { text: 'Pharmaceutical and biopharmaceutical companies, contract manufacturers, biotechnology companies and translational medicine institutions.', where: 'Item 1 — Business' },
            named: [],
            note: 'Danaher does not disaggregate bioprocessing revenue anywhere. The ~$4–5B figure that circulates is a back-solve from two numbers spoken on a call ($50–60M of pushed-out resin worth ~500bps of segment growth) — it is not a disclosure and is not used here.',
            concentration: 'No customer concentration is disclosed. The FY2025 10-K names no customer and carries no 10% sentence.'
          },
          management: [
            { q: 'Q2 2026', text: 'Consumables and equipment each grew low-single digit, with orders in both up mid-teens; upstream consumables specifically grew strong double-digit.' },
            { q: 'Q2 2026', text: 'A resin shipment push-out of roughly $50–60M — about 500bps of segment growth — moved into later periods; management flagged more than $100M shifting into 2027.' }
          ] },
        { name: 'Discovery & medical', what: 'Lab filtration and purification, protein purification and bio-molecular analysis tools, reagents and membranes for assay development, healthcare filtration.',
          customers: {
            archetype: { text: 'Pharmaceutical and biopharmaceutical companies, contract manufacturers, biotechnology companies and translational medicine institutions.', where: 'Item 1 — Business' },
            named: [],
            note: 'No disclosed split between the two businesses inside the segment.',
            concentration: 'No customer concentration is disclosed.'
          },
          management: [] }
      ],
      kpis: [
        { name: 'Segment revenue', definition: 'Biotechnology net sales as reported in the segment note. The only volume figure Danaher publishes for this segment.', filing: 'The segment note gives sales, operating profit, depreciation, amortisation, impairment charges, identifiable assets and gross capital expenditure for each reportable segment.', unit: 'usdM', periodicity: 'Quarterly and annual', source: '10-Q / 10-K segment note', series: 'results:bio', needs: null },
        { name: 'Segment operating profit', definition: 'Segment revenue less the segment\'s own operating expenses, on a GAAP basis. Excludes unallocated corporate cost, which Danaher reports separately as "Other".', filing: 'Operating profit represents total revenues less operating expenses, excluding the corporate function reported in Other.', unit: 'usdM', periodicity: 'Quarterly and annual', source: '10-Q / 10-K segment note', series: 'results:bioopinc', needs: null },
        { name: 'Recurring and non-recurring revenue', definition: 'Consumables, reagents and service versus instruments and equipment. Note 5 of the 10-K gives this per segment IN DOLLARS for three years — most write-ups quote the annual report\'s round 88% because that is what the segment pages show, but the dollars say more.', filing: 'The following table presents the Company\'s revenues disaggregated by geographical region and revenue type.', unit: 'usdM', periodicity: 'Annual', source: '10-K Note 5', series: 'rec', needs: 'Three years only — Note 5 does not appear in the 10-Qs and each 10-K carries three fiscal years. The whole shape of this segment is in the second line: non-recurring revenue fell from $1,275M in FY2023 to $869M in FY2025, down 32%, while recurring grew 9%.' },
        { name: 'Identifiable assets', definition: 'The assets the segment carries — for an acquisition-built segment this is mostly goodwill and acquired intangibles, which is why it is large relative to revenue.', filing: 'Identifiable assets by segment, disclosed annually.', unit: 'usdM', periodicity: 'Annual', source: '10-K segment note', series: null, needs: null }
      ],
      kpiNote: 'Danaher publishes no operating KPI for this segment — no order book, no backlog, no capacity, no consumable volume, no customer count. What it does publish, and what most write-ups miss, is the recurring / non-recurring split in DOLLARS in Note 5 of the 10-K. That is the closest thing to a volume signal the segment has: non-recurring revenue is the instrument line, and it fell 32% between FY2023 and FY2025 while recurring grew 9%. There is still no published quantity, which is why the relation below is built on the asset base rather than on price times units.',
      interactions: [
        { name: 'Assets × turn', relation: 'revenue = identifiable assets × revenue per $ of assets', bridge: 'assets',
          lines: ['Bioprocessing', 'Discovery & medical'],
          why: 'This segment was assembled by acquisition — Pall in 2015, Cytiva in 2020 — so its asset base is largely the price paid for those businesses. Splitting revenue into how much asset is carried and how hard it is worked is therefore closer to a return on what was bought than any margin is.',
          data: 'Both terms are annual and reported: identifiable assets from the 10-K segment note, revenue from the Results dataset. FY2021 through FY2025.' },
        { name: 'Installed base × reorder', relation: 'revenue = installed capacity at customers × consumables reordered per unit of capacity', bridge: null,
          lines: ['Bioprocessing'],
          why: 'The real economics of bioprocessing: a customer qualifies a resin and a filter into a manufacturing process and then reorders for as long as that process runs. 88% of segment revenue is that reorder stream. It is why a pause in customers\' capital spending shows up as a revenue decline two years later rather than immediately, and why the FY2022–FY2024 decline reversed without a new product cycle.',
          data: 'NOT CHARTED — Danaher discloses neither term. No installed base, no consumable volume, no utilisation. Management sizes it only in words on calls.' },
        { name: 'Orders × conversion', relation: 'revenue = orders taken × the share converted in the period', bridge: null,
          lines: ['Bioprocessing'],
          why: 'Management talks about orders because they lead revenue, and in 2Q26 the two diverged sharply: consumables and equipment each grew low-single digit while orders in both grew mid-teens. A gap that size between orders and revenue is either a timing effect or the start of a recovery, and only the next two prints separate them.',
          data: 'NOT CHARTED — Danaher publishes no order or backlog figure of any kind. The growth rates above are management\'s, given on the Q2 2026 call.' },
      ],
      bridges: [
        { key: 'assets', label: 'Assets × turn', view: 'y', target: 'rev', kind: 'decomposition',
          terms: ['assets', 'assetTurn'],
          identity: 'revenue = identifiable assets x revenue per $ of assets',
          note: 'A decomposition, not an independent build: revenue per $ of assets IS revenue divided by assets, so the terms multiply back by construction. What it buys is the split — how much of the revenue line is a bigger asset base and how much is working it harder. For a segment assembled by acquisition, the asset base is largely the price paid for the businesses, so the turn is the closest thing to a return on what was bought.' }
      ],
      drivers: {
        rev: { from: 'results:bio' },
        opinc: { from: 'results:bioopinc' },
        da: { label: 'Depreciation & amortisation', short: 'D&A', unit: 'usdM', src: '10-K segment note',
          y: { act: { '2021': 1059, '2022': 1002, '2023': 1026, '2024': 1014, '2025': 1051 }, summit: {} } },
        capex: { label: 'Capital expenditure, gross', short: 'Capex', unit: 'usdM', src: '10-K segment note',
          y: { act: { '2021': 385, '2022': 405, '2023': 417, '2024': 447, '2025': 370 }, summit: {} } },
        assets: { label: 'Identifiable assets', short: 'Assets', unit: 'usdM', src: '10-K segment note',
          y: { act: { '2021': 38118, '2022': 37536, '2023': 37421, '2024': 34605, '2025': 37337 }, summit: {} } },
        impair: { label: 'Impairment charges', short: 'Impairments', unit: 'usdM', src: '10-K segment note',
          y: { act: { '2023': 54, '2024': 0, '2025': 101 }, summit: {} } }
,
        rec: { label: 'Recurring revenue', short: 'Recurring', unit: 'usdM', src: '10-K Note 5 — revenue by type',
          y: { act: { '2023': 5897, '2024': 5758, '2025': 6424 }, summit: {} } },
        nonrec: { label: 'Non-recurring revenue', short: 'Non-recurring', unit: 'usdM', src: '10-K Note 5 — revenue by type',
          y: { act: { '2023': 1275, '2024': 1001, '2025': 869 }, summit: {} } }
      },
      highlights: ['opMgn', 'recShare', 'assetTurn', 'roa', 'capexInt']
    },

    {
      key: 'ls', label: 'Life Sciences', short: 'Life Sci',
      lede: 'The bench, not the plant. Mass spectrometers, microscopes, flow cytometers and the reagents that feed them — sold out of research budgets, which makes this the most discretionary and most instrument-weighted of the three at 66% recurring. It is also where the group\'s margin went: $1,414M of operating profit in FY2022 and $520M in FY2025, on revenue that rose.',
      sells: [
        { name: 'Instruments', what: 'Mass spectrometry (SCIEX), microscopy (Leica Microsystems), flow cytometry, centrifugation and liquid-handling automation (Beckman Coulter Life Sciences, Molecular Devices).' },
        { name: 'Reagents and genomic consumables', what: 'Custom DNA/RNA oligonucleotides and gene fragments (IDT), validated antibodies and assays (Abcam), plasmid DNA and proteins for cell and gene therapy (Aldevron), chromatography consumables (Phenomenex).' },
        { name: 'Industrial filtration', what: 'Pall filtration for semiconductor fabs, aerospace, refineries, turbines, petrochemicals and food and beverage — a genuinely different end market sitting inside a life-science segment.' }
      ],
      summary: 'Life Sciences sells the instruments and consumables used to study DNA, RNA, proteins, metabolites and cells — upstream of any manufacturing — plus Pall\'s industrial filtration business. Brands are SCIEX, Leica Microsystems, Beckman Coulter Life Sciences, IDT, Abcam, Aldevron, Molecular Devices, Phenomenex and Genedata.',
      brief: 'Sells the equipment researchers use to find out what is in a sample. Because a third of its revenue is the instrument itself rather than what feeds it, this segment moves with customers\' capital budgets — it is the first thing cut when research funding tightens, and the last to recover.',
      tenK: { text: 'The Life Sciences segment offers a broad range of research tools that scientists use to study the basic building blocks of life, including genes, proteins, metabolites and cells, in order to understand the causes of disease, identify new therapies and test new drugs and vaccines.', verbatim: true, cite: 'DANAHER CORP, 10-K (period 2025-12-31, accession 0000313616-26-000062)', url: 'https://www.sec.gov/Archives/edgar/data/313616/000031361626000062/', where: 'Item 1 — Business', needs: null },
      products: [
        { name: 'Instruments', what: 'Mass spectrometry, microscopy, flow cytometry, centrifugation and liquid-handling automation.',
          customers: {
            archetype: { text: 'Researchers in pharmaceutical and biotechnology companies, academic and government institutions, and quality assurance and quality control technicians.', where: 'Item 1 — Business' },
            named: [],
            note: 'No revenue split by brand or instrument line is disclosed anywhere.',
            concentration: 'No customer concentration is disclosed. Academic and government customers are less than 5% of company revenue, per management on the Q2\'26 call — the only sizing of any customer type Danaher has given.'
          },
          management: [{ q: 'Q2 2026', text: 'Life Sciences core growth turned positive at +5.5% after five quarters of decline; management attributed part of the rate to Pall project timing and guided the next quarter lower on that basis.' }] },
        { name: 'Reagents and genomic consumables', what: 'Custom oligonucleotides and gene fragments, validated antibodies and assays, plasmid DNA and proteins for cell and gene therapy.',
          customers: {
            archetype: { text: 'Researchers in pharmaceutical and biotechnology companies, academic and government institutions.', where: 'Item 1 — Business' },
            named: [],
            note: 'The recurring two-thirds of the segment sits mostly here. No dollar figure is published.',
            concentration: 'No customer concentration is disclosed.'
          },
          management: [] },
        { name: 'Industrial filtration (Pall)', what: 'Filtration for semiconductor fabs, aerospace, refineries, turbines, petrochemicals, food and beverage.',
          customers: {
            archetype: { text: 'Industrial manufacturers, including semiconductor, aerospace, refining and food and beverage customers.', where: 'Item 1 — Business' },
            named: [],
            note: 'Pall industrial sits inside Life Sciences and is not sized separately, so a reader cannot tell how much of this "life science" segment is semiconductors and refineries.',
            concentration: 'No customer concentration is disclosed.'
          },
          management: [{ q: 'Q2 2026', text: 'Pall grew roughly 10%; project timing cited as the reason Q3\'26 growth moderates from the Q2 rate.' }] }
      ],
      kpis: [
        { name: 'Segment revenue', definition: 'Life Sciences net sales as reported in the segment note.', filing: 'The segment note gives sales, operating profit, depreciation, amortisation, impairment charges, identifiable assets and gross capital expenditure for each reportable segment.', unit: 'usdM', periodicity: 'Quarterly and annual', source: '10-Q / 10-K segment note', series: 'results:ls', needs: null },
        { name: 'Segment operating profit', definition: 'Segment revenue less its own operating expenses, GAAP. This is the line the impairments run through — it is not a trading number in FY2024 and FY2025.', filing: 'Operating profit represents total revenues less operating expenses, excluding the corporate function reported in Other.', unit: 'usdM', periodicity: 'Quarterly and annual', source: '10-Q / 10-K segment note', series: 'results:lsopinc', needs: null },
        { name: 'Impairment charges', definition: 'Write-downs of goodwill, trade names and other assets carried in the segment. Disclosed by segment annually from FY2023, when Danaher adopted the current segment-note format.', filing: 'Impairment charges are presented as a separate line within the segment note.', unit: 'usdM', periodicity: 'Annual', source: '10-K segment note', series: null, needs: 'Quarterly impairments are not broken out by segment; the $432M Q2\'25 trade-name charge is known from the press release, not the segment note.' },
        { name: 'Recurring and non-recurring revenue', definition: 'Consumables, reagents and service versus instruments — 66% recurring in FY2025, the lowest of the three. Note 5 gives both halves in dollars, and they move in opposite directions: recurring $4,360M → $4,844M while non-recurring $2,781M → $2,490M across FY2023–FY2025.', filing: 'The following table presents the Company\'s revenues disaggregated by geographical region and revenue type.', unit: 'usdM', periodicity: 'Annual', source: '10-K Note 5', series: 'rec', needs: 'Three years only. The reason this segment\'s revenue looks flat is that the two halves offset — it is not a business standing still, it is an instrument business shrinking under a consumables business growing.' }
      ],
      kpiNote: 'As with the other segments, no operating KPI is published — no instrument placements, no consumable volume, no customer count. What is unusual here is that the segment note carries a line that is not an operating figure at all: impairment charges, which in FY2024 and FY2025 are the difference between this segment looking flat and looking broken.',
      interactions: [
        { name: 'Assets × turn', relation: 'revenue = identifiable assets × revenue per $ of assets', bridge: 'assets',
          lines: ['Instruments', 'Reagents and genomic consumables', 'Industrial filtration (Pall)'],
          why: 'The relation to read for this segment. Identifiable assets jumped from $17.6B to $23.7B between FY2022 and FY2023 — Abcam — and revenue did not follow. The turn falling is the arithmetic of paying for growth that has not arrived; the impairments that follow are the accounting catching up with it.',
          data: 'Both terms are annual and reported. FY2021 through FY2025.' },
        { name: 'Instrument cycle × consumable pull-through', relation: 'revenue = instruments placed × consumables and service pulled through each', bridge: null,
          lines: ['Instruments', 'Reagents and genomic consumables'],
          why: 'At 66% recurring this is the least annuity-like of the three, and the third that is not recurring is the instrument itself. That share is why the segment turns down first when research budgets tighten and recovers last: the consumable stream only grows once new instruments have been placed.',
          data: 'PARTLY CHARTED — the instrument count and the pull-through per instrument are not disclosed, but the SPLIT is: Note 5 gives recurring and non-recurring revenue in dollars for three years, and it is in the KPI section above. Recurring $4,360M → $4,844M while non-recurring $2,781M → $2,490M across FY2023–FY2025 — the two halves offsetting is why the segment looks flat.' },
        { name: 'Two businesses, one segment', relation: 'segment revenue = life-science tools + Pall industrial filtration', bridge: null,
          lines: ['Industrial filtration (Pall)'],
          why: 'Pall\'s industrial filtration — semiconductor fabs, aerospace, refineries, food and beverage — sits inside a segment named Life Sciences and is not sized separately anywhere. A reader cannot tell how much of this life-science segment is semiconductors, which matters because the two halves answer to completely different cycles.',
          data: 'NOT CHARTED — no split is disclosed. Management gave a growth rate for Pall on the Q2 2026 call (roughly +10%) and no revenue base to apply it to.' },
      ],
      bridges: [
        { key: 'assets', label: 'Assets × turn', view: 'y', target: 'rev', kind: 'decomposition',
          terms: ['assets', 'assetTurn'],
          identity: 'revenue = identifiable assets x revenue per $ of assets',
          note: 'Worth reading here more than anywhere: identifiable assets jumped from $17.6B to $23.7B between FY2022 and FY2023 — the Abcam acquisition — and revenue did not follow. The turn falling is the arithmetic of paying for growth that has not arrived, and the impairments that follow are the accounting catching up with it.' }
      ],
      drivers: {
        rev: { from: 'results:ls' },
        opinc: { from: 'results:lsopinc' },
        da: { label: 'Depreciation & amortisation', short: 'D&A', unit: 'usdM', src: '10-K segment note',
          y: { act: { '2021': 382, '2022': 531, '2023': 558, '2024': 743, '2025': 789 }, summit: {} } },
        capex: { label: 'Capital expenditure, gross', short: 'Capex', unit: 'usdM', src: '10-K segment note',
          y: { act: { '2021': 210, '2022': 325, '2023': 320, '2024': 391, '2025': 186 }, summit: {} } },
        assets: { label: 'Identifiable assets', short: 'Assets', unit: 'usdM', src: '10-K segment note',
          y: { act: { '2021': 19768, '2022': 17572, '2023': 23730, '2024': 23211, '2025': 23112 }, summit: {} } },
        impair: { label: 'Impairment charges', short: 'Impairments', unit: 'usdM', src: '10-K segment note',
          y: { act: { '2023': 0, '2024': 222, '2025': 446 }, summit: {} } }
,
        rec: { label: 'Recurring revenue', short: 'Recurring', unit: 'usdM', src: '10-K Note 5 — revenue by type',
          y: { act: { '2023': 4360, '2024': 4889, '2025': 4844 }, summit: {} } },
        nonrec: { label: 'Non-recurring revenue', short: 'Non-recurring', unit: 'usdM', src: '10-K Note 5 — revenue by type',
          y: { act: { '2023': 2781, '2024': 2440, '2025': 2490 }, summit: {} } }
      },
      highlights: ['opMgn', 'impInt', 'recShare', 'assetTurn', 'roa']
    },

    {
      key: 'dx', label: 'Diagnostics', short: 'Diagnostics',
      lede: 'The largest segment and the steadiest: instruments placed in hospitals and labs, and a consumable stream that follows for the life of the platform. 89% recurring, the highest of the three — and the reason it carries more than double Biotechnology\'s depreciation on about a third more revenue. Two things inside it are not the business: the respiratory tail and China procurement.',
      sells: [
        { name: 'Molecular', what: 'Cepheid GeneXpert cartridge testing for healthcare-associated infections, respiratory, sexual health and virology.' },
        { name: 'Clinical chemistry and immunoassay', what: 'Beckman Coulter Diagnostics high-volume analysers and the DxA 5000 lab-automation line.' },
        { name: 'Acute and point of care', what: 'Radiometer and HemoCue blood gas, electrolytes, metabolites, cardiac markers, anemia and glucose — plus Masimo patient monitoring from June 2026.' },
        { name: 'Pathology', what: 'Leica Biosystems and Mammotome anatomical pathology workflow and Aperio digital pathology.' }
      ],
      summary: 'Diagnostics sells clinical instruments, consumables, software and services to hospitals, physicians\' offices, reference laboratories and critical-care settings. Brands are Cepheid, Beckman Coulter Diagnostics, Radiometer, HemoCue, Leica Biosystems, Mammotome and — from June 2026 — Masimo.',
      brief: 'Places an analyser in a hospital and sells the tests that run on it. The instrument is close to a cost of acquiring the consumable stream, which is why nearly nine tenths of the revenue recurs and why the segment\'s depreciation is so large relative to its size. It moves with healthcare utilisation and reimbursement rather than anyone\'s capital cycle.',
      tenK: { text: 'The Diagnostics segment offers analytical instruments, reagents, consumables, software and services that hospitals, physicians\' offices, reference laboratories and other critical care settings use to diagnose disease and make treatment decisions.', verbatim: true, cite: 'DANAHER CORP, 10-K (period 2025-12-31, accession 0000313616-26-000062)', url: 'https://www.sec.gov/Archives/edgar/data/313616/000031361626000062/', where: 'Item 1 — Business', needs: null },
      products: [
        { name: 'Molecular (Cepheid)', what: 'GeneXpert cartridge testing across healthcare-associated infections, respiratory, sexual health and virology.',
          customers: {
            archetype: { text: 'Hospitals, physicians\' offices, reference laboratories, blood banks and critical care settings.', where: 'Item 1 — Business' },
            named: [],
            note: 'This is where the respiratory tail sits — roughly $1,900M in FY2025 falling to about $1,600M expected in FY2026. GeneXpert placements, cartridge volumes and utilisation are not disclosed.',
            concentration: 'No customer concentration is disclosed.'
          },
          management: [{ q: 'Q2 2026', text: 'Respiratory revenue was about $250M against about $300M a year earlier — a 3.0pp headwind to segment core growth in the quarter and 5.0pp in the half.' }] },
        { name: 'Clinical chemistry and immunoassay', what: 'Beckman Coulter high-volume analysers, DxI 9000 immunoassay and DxA 5000 lab automation.',
          customers: {
            archetype: { text: 'Hospitals and reference laboratories.', where: 'Item 1 — Business' },
            named: [],
            note: 'The China volume-based-procurement headwind lands mostly here. Danaher has never disclosed the revenue base it applies to.',
            concentration: 'No customer concentration is disclosed.'
          },
          management: [{ q: 'Q2 2026', text: 'China volume-based procurement and reimbursement headwinds "starting to lessen", with lower drag expected in Q3 and Q4. No figure given.' }] },
        { name: 'Acute and point of care', what: 'Radiometer and HemoCue blood gas and point-of-care testing; Masimo patient monitoring from June 2026.',
          customers: {
            archetype: { text: 'Critical care settings, hospitals and physicians\' offices.', where: 'Item 1 — Business' },
            named: [],
            note: 'Masimo was acquired into this segment in June 2026. Danaher has not published a purchase price in anything held here, and no separate Masimo revenue line exists.',
            concentration: 'No customer concentration is disclosed.'
          },
          management: [{ q: 'Q2 2026', text: 'Masimo added 4.0pp to Diagnostics\' reported growth and carried $108M pretax / $95M after-tax of acquisition items in the quarter. The first operating review applied the Danaher Business System Launch Excellence tool.' }] },
        { name: 'Pathology', what: 'Leica Biosystems and Mammotome anatomical pathology workflow, Aperio digital pathology.',
          customers: {
            archetype: { text: 'Hospitals and reference laboratories.', where: 'Item 1 — Business' },
            named: [],
            note: 'StatLab, announced July 2026, will be acquired by Leica Biosystems — about $250M of FY2025 revenue, more than 85% recurring. Price not disclosed.',
            concentration: 'No customer concentration is disclosed.'
          },
          management: [] }
      ],
      kpis: [
        { name: 'Segment revenue', definition: 'Diagnostics net sales as reported in the segment note.', filing: 'The segment note gives sales, operating profit, depreciation, amortisation, impairment charges, identifiable assets and gross capital expenditure for each reportable segment.', unit: 'usdM', periodicity: 'Quarterly and annual', source: '10-Q / 10-K segment note', series: 'results:dx', needs: null },
        { name: 'Segment operating profit', definition: 'Segment revenue less its own operating expenses, GAAP.', filing: 'Operating profit represents total revenues less operating expenses, excluding the corporate function reported in Other.', unit: 'usdM', periodicity: 'Quarterly and annual', source: '10-Q / 10-K segment note', series: 'results:dxopinc', needs: null },
        { name: 'Core growth excluding respiratory', definition: 'Danaher\'s own adjusted growth line, introduced because the respiratory tail was large enough to invert the headline. From the Q3\'26 10-Q it will also exclude tariff refunds — a second definition change in two quarters.', filing: null, unit: 'pct', periodicity: 'Quarterly', source: 'Press release', series: null, needs: 'Published as a percentage per quarter, not as a dollar series. 1H26: −1.0% core became +4.0% ex-respiratory.' },
        { name: 'Depreciation', definition: 'The placed-instrument model made visible: Diagnostics runs more than double Biotechnology\'s depreciation on about a third more revenue, because the analysers sit on Danaher\'s balance sheet rather than the customer\'s.', filing: 'Depreciation is disclosed by segment in the annual segment note.', unit: 'usdM', periodicity: 'Annual', source: '10-K segment note', series: null, needs: null }
      ],
      kpiNote: 'No operating KPI is published here either — no GeneXpert placements, no cartridge volumes, no utilisation, no test counts. What Danaher does publish, uniquely for this segment, is an adjusted growth line: core growth excluding respiratory testing, introduced because the tail was large enough to invert the headline. From the Q3 2026 10-Q it will also exclude tariff refunds, a second definition change in two quarters.',
      interactions: [
        { name: 'Assets × turn', relation: 'revenue = identifiable assets × revenue per $ of assets', bridge: 'assets',
          lines: ['Molecular (Cepheid)', 'Clinical chemistry and immunoassay', 'Acute and point of care', 'Pathology'],
          why: 'The mirror image of Life Sciences, and the clearest evidence that these segments are not the same business. Diagnostics turns roughly twice the revenue per dollar of assets, on an asset base that has barely moved in five years — a segment that was built and then left to compound rather than bought recently.',
          data: 'Both terms are annual and reported. FY2021 through FY2025; FY2025 does not yet reflect a full year of Masimo.' },
        { name: 'Placed instruments × tests run', relation: 'revenue = analysers placed × tests run on each', bridge: null,
          lines: ['Molecular (Cepheid)', 'Clinical chemistry and immunoassay'],
          why: 'The canonical razor-and-blade, and the reason this segment is 89% recurring. The analyser is close to a cost of acquiring the test stream, which is why Diagnostics carries more than double Biotechnology\'s depreciation on about a third more revenue — the instruments sit on Danaher\'s balance sheet, not the customer\'s.',
          data: 'NOT CHARTED — neither term is disclosed. The depreciation asymmetry is the only place the model is visible in a reported number, and it is in the segment note under D&A.' },
        { name: 'Respiratory tail × everything else', relation: 'reported core growth = underlying core growth − the respiratory decline', bridge: null,
          lines: ['Molecular (Cepheid)'],
          why: 'Two consecutive periods where the sign of the segment flips on this one line: in 1H26 reported core growth was −1.0% and core ex-respiratory was +4.0%. Reading the headline without the adjustment gives exactly the wrong conclusion about the underlying business.',
          data: 'PARTLY CHARTED — the two growth rates are published per quarter as percentages, but the respiratory revenue base is given only as round approximations on calls (~$1,900M FY2025, ~$1,600M expected FY2026), so no dollar series exists.' },
      ],
      bridges: [
        { key: 'assets', label: 'Assets × turn', view: 'y', target: 'rev', kind: 'decomposition',
          terms: ['assets', 'assetTurn'],
          identity: 'revenue = identifiable assets x revenue per $ of assets',
          note: 'The mirror image of Life Sciences. Diagnostics turns about $0.67 of revenue per dollar of assets against roughly $0.32 in Life Sciences, on an asset base that has barely moved in five years — a segment that was built rather than bought recently, and earns like it.' }
      ],
      drivers: {
        rev: { from: 'results:dx' },
        opinc: { from: 'results:dxopinc' },
        da: { label: 'Depreciation & amortisation', short: 'D&A', unit: 'usdM', src: '10-K segment note',
          y: { act: { '2021': 614, '2022': 590, '2023': 577, '2024': 586, '2025': 598 }, summit: {} } },
        capex: { label: 'Capital expenditure, gross', short: 'Capex', unit: 'usdM', src: '10-K segment note',
          y: { act: { '2021': 644, '2022': 382, '2023': 546, '2024': 550, '2025': 592 }, summit: {} } },
        assets: { label: 'Identifiable assets', short: 'Assets', unit: 'usdM', src: '10-K segment note',
          y: { act: { '2021': 15054, '2022': 14722, '2023': 14552, '2024': 14204, '2025': 14748 }, summit: {} } },
        impair: { label: 'Impairment charges', short: 'Impairments', unit: 'usdM', src: '10-K segment note',
          y: { act: { '2023': 23, '2024': 43, '2025': 15 }, summit: {} } }
,
        rec: { label: 'Recurring revenue', short: 'Recurring', unit: 'usdM', src: '10-K Note 5 — revenue by type',
          y: { act: { '2023': 8425, '2024': 8719, '2025': 8859 }, summit: {} } },
        nonrec: { label: 'Non-recurring revenue', short: 'Non-recurring', unit: 'usdM', src: '10-K Note 5 — revenue by type',
          y: { act: { '2023': 1152, '2024': 1068, '2025': 1082 }, summit: {} } }
      },
      highlights: ['opMgn', 'recShare', 'assetTurn', 'roa', 'daInt']
    }
  ]
};
