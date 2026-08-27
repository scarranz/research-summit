// results-data/dhr.js — Danaher. Contract in docs/RESULTS_CONVENTIONS.md §2.
//
// ⚠ ACTUALS ONLY, for now. `summit` and `cons` are present and empty on every metric: the Summit
// DCF snapshot and the BBG consensus that lives inside it have not been pulled for DHR yet. That
// is deliberate rather than missing — the engine renders a reported-only series correctly, and a
// fabricated model line would be worse than none. When the snapshot arrives, fill `summit`/`cons`
// and the Evolution ▸ Results and Estimates panes light up with no other change.
//
// This dataset exists first because **Top Line ▸ Segments reads through it**: segment revenue and
// operating income keep exactly one home, and `js/segments-data/dhr.js` points at these keys with
// `from: 'results:<key>'` rather than copying them.
//
// SOURCES. Every figure is from Danaher's own filings, taken from the rendered segment-note
// R-files of each 10-K and 10-Q on EDGAR (CIK 0000313616), newest filing per period so
// restatements are picked up. Segment figures are DIMENSIONAL XBRL facts, which the
// `companyconcept` API does not return at all — the R-files are the route.
//
// TWO THINGS THAT WOULD OTHERWISE BE GOT WRONG:
//   1. The annual view starts at FY2021 because that is as far back as Danaher restated when
//      Veralto left continuing operations in FY2023. FY2020 exists only including Veralto, so
//      putting it on this axis would mix two companies in one series. The pre-Veralto years are
//      carried instead as their own cut in the segments dataset, where they are labelled as such.
//   2. Fourth quarters are never tagged on their own. Each is the fiscal year less the three
//      published quarters. Two of them (4Q23 revenue $6,405M, gross profit $3,779M) Danaher did
//      tag, and the derivation reproduces both exactly; the rest inherit that check.

export var dhrResults = {
  updated: 'Aug 2026',
  intro: 'Danaher reports three segments — Biotechnology, Life Sciences and Diagnostics — plus an unallocated corporate line it calls Other, which carries no revenue. Segment operating profit here is GAAP, as the segment note gives it; the adjusted segment margins management discusses on calls are higher and exist only for the periods a press release covers.',
  source: 'Segment and consolidated figures: Danaher 10-K and 10-Q segment notes via SEC EDGAR (CIK 0000313616), newest filing per period. Fourth quarters are derived as the fiscal year less the three published quarters — Danaher never tags Q4 on its own. No Summit or Street series yet.',

  views: {
    q: {
      label: 'Quarterly',
      note: 'Continuing operations throughout. 1Q23 is as far back as the Veralto restatement reaches, so the whole series sits on one company.',
      sections: [
        { key: 'top', label: 'Top line', defaultMetric: 'rev',
          groups: [{ label: 'Revenue', keys: ['rev', 'bio', 'ls', 'dx'] },
                   { label: 'Operating profit', keys: ['opinc', 'bioopinc', 'lsopinc', 'dxopinc', 'corpopinc'] }] }
      ],
      metrics: {
        rev: { label: 'Revenue', short: 'Revenue', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:  [5949, 5912, 5624, 6405, 5796, 5743, 5798, 6538, 5741, 5936, 6053, 6838, 5951, 6265],
          summit: [], cons: [],
          note: 'Fourth quarters are the fiscal year less the three published quarters.' },
        opinc: { label: 'Operating profit', short: 'Op. profit', unit: 'usdM', marginOf: 'rev', marginLabel: 'Operating margin',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:  [1517, 1163, 1185, 1337, 1312, 1168,  958, 1425, 1274,  760, 1154, 1502, 1344, 1127],
          summit: [], cons: [],
          note: 'GAAP. The 2Q25 trough is a $432M trade-name impairment in Life Sciences, not trading.' },

        bio: { label: 'Biotechnology — revenue', short: 'Biotech', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:  [1864, 1885, 1664, 1759, 1524, 1713, 1653, 1869, 1612, 1850, 1798, 2033, 1797, 1920],
          summit: [], cons: [], note: '' },
        bioopinc: { label: 'Biotechnology — operating profit', short: 'Biotech op.', unit: 'usdM', marginOf: 'bio', marginLabel: 'Segment operating margin',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:  [ 596,  480,  417,  416,  325,  462,  390,  508,  441,  531,  352,  540,  534,  556],
          summit: [], cons: [], note: '' },

        ls: { label: 'Life Sciences — revenue', short: 'Life Sci', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:  [1709, 1796, 1706, 1930, 1745, 1770, 1782, 2032, 1680, 1777, 1792, 2085, 1737, 1879],
          summit: [], cons: [], note: '' },
        lsopinc: { label: 'Life Sciences — operating profit', short: 'Life Sci op.', unit: 'usdM', marginOf: 'ls', marginLabel: 'Segment operating margin',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:  [ 321,  340,  313,  235,  235,  233,   35,  376,  201, -239,  222,  336,  225,  244],
          summit: [], cons: [],
          note: 'The 2Q25 loss is the $432M trade-name impairment; 3Q24 carries a smaller one.' },

        dx: { label: 'Diagnostics — revenue', short: 'Diagnostics', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:  [2376, 2231, 2254, 2716, 2527, 2260, 2363, 2637, 2449, 2309, 2463, 2720, 2417, 2466],
          summit: [], cons: [],
          note: 'Masimo joins from 2Q26 — it added 4.0pp of the segment\'s reported growth that quarter.' },
        dxopinc: { label: 'Diagnostics — operating profit', short: 'Diagnostics op.', unit: 'usdM', marginOf: 'dx', marginLabel: 'Segment operating margin',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:  [ 677,  424,  539,  766,  830,  556,  615,  624,  718,  554,  665,  713,  674,  416],
          summit: [], cons: [],
          note: '2Q26 carries $108M of pretax Masimo acquisition items.' },

        corpopinc: { label: 'Corporate ("Other") — operating profit', short: 'Corporate', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:  [ -77,  -81,  -84,  -80,  -78,  -83,  -82,  -83,  -86,  -86,  -85,  -87,  -89,  -89],
          summit: [], cons: [],
          note: 'Unallocated corporate cost. It carries no revenue, so it has no margin.' }
      }
    },

    y: {
      label: 'Annual',
      note: 'FY2021 onward only: that is as far back as Danaher restated for the Veralto separation, so every year here is on today\'s continuing-operations basis.',
      sections: [
        { key: 'top', label: 'Top line', defaultMetric: 'rev',
          groups: [{ label: 'Revenue', keys: ['rev', 'bio', 'ls', 'dx'] },
                   { label: 'Operating profit', keys: ['opinc', 'bioopinc', 'lsopinc', 'dxopinc', 'corpopinc'] }] }
      ],
      metrics: {
        rev: { label: 'Revenue', short: 'Revenue', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025'],
          act: [24802, 26643, 23890, 23875, 24568], summit: [], cons: [], note: '' },
        opinc: { label: 'Operating profit', short: 'Op. profit', unit: 'usdM', marginOf: 'rev', marginLabel: 'Operating margin',
          periods: ['2021','2022','2023','2024','2025'],
          act: [6377, 7536, 5202, 4863, 4690], summit: [], cons: [],
          note: 'Falls every year after FY2022 — and almost all of the fall is Life Sciences.' },

        bio: { label: 'Biotechnology — revenue', short: 'Biotech', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025'],
          act: [8570, 8758, 7172, 6759, 7293], summit: [], cons: [], note: '' },
        bioopinc: { label: 'Biotechnology — operating profit', short: 'Biotech op.', unit: 'usdM', marginOf: 'bio', marginLabel: 'Segment operating margin',
          periods: ['2021','2022','2023','2024','2025'],
          act: [3074, 3008, 1909, 1685, 1864], summit: [], cons: [], note: '' },

        ls: { label: 'Life Sciences — revenue', short: 'Life Sci', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025'],
          act: [6388, 7036, 7141, 7329, 7334], summit: [], cons: [], note: '' },
        lsopinc: { label: 'Life Sciences — operating profit', short: 'Life Sci op.', unit: 'usdM', marginOf: 'ls', marginLabel: 'Segment operating margin',
          periods: ['2021','2022','2023','2024','2025'],
          act: [1293, 1414, 1209, 879, 520], summit: [], cons: [],
          note: 'Impairment charges of $0M, $222M and $446M across FY2023–FY2025 sit inside this line.' },

        dx: { label: 'Diagnostics — revenue', short: 'Diagnostics', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025'],
          act: [9844, 10849, 9577, 9787, 9941], summit: [], cons: [], note: '' },
        dxopinc: { label: 'Diagnostics — operating profit', short: 'Diagnostics op.', unit: 'usdM', marginOf: 'dx', marginLabel: 'Segment operating margin',
          periods: ['2021','2022','2023','2024','2025'],
          act: [2313, 3436, 2406, 2625, 2650], summit: [], cons: [], note: '' },

        corpopinc: { label: 'Corporate ("Other") — operating profit', short: 'Corporate', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025'],
          act: [-303, -322, -322, -326, -344], summit: [], cons: [], note: '' }
      }
    }
  }
};
