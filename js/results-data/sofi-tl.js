// results-data/sofi-tl.js — Top Line datasets for the Results ENGINE.
//   sofiTlSegments — Top Line ▸ Segments: net revenue and contribution profit of the three SoFi reportable segments, from the
//                    10-K and 10-Q (actuals only: the Summit model does not project segment revenue).
//   sofiTlGeneral  — Top Line ▸ General: total net revenue, its revenue lines and the operating counts, re-cut from sofiResults
//                    (actuals, Summit frozen, Bloomberg consensus).
// Unique section keys keep these engine instances apart from the Results tab's canvases.
import { sofiResults } from './sofi.js';

export var sofiTlSegments = {
  forwardQuarters: 2,   // two quarters past the last print (analyst rule Oct 22 2026), same as SPOT
  updated: 'Oct 2026',
  source: 'SoFi FY2025 Form 10-K and 2Q26 Form 10-Q (SEC EDGAR), segment results; the Q4 2025 call (Jan 30 2026) for 4Q25 Financial Services and Technology Platform.',
  views: {
    q: {
      label: 'Quarterly',
      note: 'Segment figures are the reportable-segment numbers from the SoFi 10-K (FY2023–FY2025) and 10-Q (1Q25, 2Q25, 1Q26, 2Q26; the first quarters are the six-month figure less the second quarter). They are BEFORE Corporate/Other, which holds the intercompany eliminations (FY2025: segments sum to $3,841.2M against $3,613.4M of total net revenue), and Technology Platform includes intercompany fees ($85.5M in FY2025). 4Q25 Financial Services and Technology Platform come from the Q4 2025 call; 3Q25 and the Lending 4Q25 figures are not in the filings on hand and are left empty. The Summit model does not project segment revenue, so there are no forecasts.',
      metrics: {
        lend: { label: 'Lending net revenue', short: 'Lending', group: 'Segment revenue', unit: 'usdM',
          periods: ['1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26', '4Q26', '1Q27', '2Q27', '3Q27', '4Q27'],
          act:    [413.373, 443.512, 493.382, 498.682, 642.42, 724.798, null, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, 711.639, 730.811, 728.158, 789.427, null, null],
          guideLo: [null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note. Actuals: 10-K / 10-Q, and Bloomberg reported values from 2Q25; Street: Bloomberg consensus, newest snapshot; no Summit series (the model projects no segment lines).' },
        tech: { label: 'Technology Platform net revenue', short: 'Technology Platform', group: 'Segment revenue', unit: 'usdM',
          periods: ['1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26', '4Q26', '1Q27', '2Q27', '3Q27', '4Q27'],
          act:    [103.427, 109.833, 114.578, 122.373, 75.086, 84.505, null, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, 88.299, 91.421, 94.839, 99.455, null, null],
          guideLo: [null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note. Actuals: 10-K / 10-Q, and Bloomberg reported values from 2Q25; Street: Bloomberg consensus, newest snapshot; no Summit series (the model projects no segment lines).' },
        fs: { label: 'Financial Services net revenue', short: 'Financial Services', group: 'Segment revenue', unit: 'usdM',
          periods: ['1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26', '4Q26', '1Q27', '2Q27', '3Q27', '4Q27'],
          act:    [303.119, 362.533, 419.623, 456.741, 428.543, 466.278, null, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, 501.837, 536.849, 548.191, 581.729, null, null],
          guideLo: [null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note. Actuals: 10-K / 10-Q, and Bloomberg reported values from 2Q25; Street: Bloomberg consensus, newest snapshot; no Summit series (the model projects no segment lines).' },
        oth: { label: 'Corporate / Other and eliminations', short: 'Corporate / Other', group: 'Segment revenue', unit: 'usdM',
          periods: ['1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26', '4Q26', '1Q27', '2Q27', '3Q27', '4Q27'],
          act:    [-48.16, -60.934, -65.983, -52.745, -45.681, -56.905, null, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, -51.66, -49.735, -61.319, -63.633, null, null],
          guideLo: [null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note. Actuals: 10-K / 10-Q, and Bloomberg reported values from 2Q25; Street: Bloomberg consensus, newest snapshot; no Summit series (the model projects no segment lines).' },
        lcp: { label: 'Lending contribution profit', short: 'Lending', group: 'Contribution profit', unit: 'usdM', marginOf: 'lend', marginLabel: 'Lending contribution margin',
          periods: ['1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26', '4Q26', '1Q27', '2Q27', '3Q27', '4Q27'],
          act:    [238.935, 244.71, 261.6, 271.655, 382.386, 399.033, null, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, 401.567, 416.553, 435.205, 465.414, null, null],
          guideLo: [null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note. Actuals: 10-K / 10-Q, and Bloomberg reported values from 2Q25; Street: Bloomberg consensus, newest snapshot; no Summit series (the model projects no segment lines).' },
        tcp: { label: 'Technology Platform contribution profit', short: 'Technology Platform', group: 'Contribution profit', unit: 'usdM', marginOf: 'tech', marginLabel: 'Technology Platform contribution margin',
          periods: ['1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26', '4Q26', '1Q27', '2Q27', '3Q27', '4Q27'],
          act:    [30.913, 33.195, 32.371, 47.934, 11.999, 11.772, null, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, 14.857, 17.12, 19.483, 19.802, null, null],
          guideLo: [null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note. Actuals: 10-K / 10-Q, and Bloomberg reported values from 2Q25; Street: Bloomberg consensus, newest snapshot; no Summit series (the model projects no segment lines).' },
        fcp: { label: 'Financial Services contribution profit', short: 'Financial Services', group: 'Contribution profit', unit: 'usdM', marginOf: 'fs', marginLabel: 'Financial Services contribution margin',
          periods: ['1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26', '4Q26', '1Q27', '2Q27', '3Q27', '4Q27'],
          act:    [148.332, 188.232, 225.557, 230.788, 195.584, 212.676, null, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, 257.474, 285.029, 290.009, 306.156, null, null],
          guideLo: [null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note. Actuals: 10-K / 10-Q, and Bloomberg reported values from 2Q25; Street: Bloomberg consensus, newest snapshot; no Summit series (the model projects no segment lines).' },
      },
      sections: [
        { key: 'tlsrev', label: 'Segment revenue', defaultMetric: 'lend', groups: [ { label: 'Net revenue by segment', keys: ['lend', 'tech', 'fs', 'oth'] } ] }
      ]
    },
    y: {
      label: 'Annual',
      note: 'Segment figures are the reportable-segment numbers from the SoFi 10-K (FY2023–FY2025) and 10-Q (1Q25, 2Q25, 1Q26, 2Q26; the first quarters are the six-month figure less the second quarter). They are BEFORE Corporate/Other, which holds the intercompany eliminations (FY2025: segments sum to $3,841.2M against $3,613.4M of total net revenue), and Technology Platform includes intercompany fees ($85.5M in FY2025). 4Q25 Financial Services and Technology Platform come from the Q4 2025 call; 3Q25 and the Lending 4Q25 figures are not in the filings on hand and are left empty. The Summit model does not project segment revenue, so there are no forecasts.',
      metrics: {
        lend: { label: 'Lending net revenue', short: 'Lending', group: 'Segment revenue', unit: 'usdM',
          periods: ['2023', '2024', '2025', '2026', '2027', '2028'],
          act:    [1370.621, 1485.222, 1848.949, null, null, null],
          summit: [null, null, null, null, null, null],
          cons:   [null, null, null, 2696.737, 3393.229, 4068.016],
          guideLo: [null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note. Actuals: 10-K / 10-Q, and Bloomberg reported values from 2Q25; Street: Bloomberg consensus, newest snapshot; no Summit series (the model projects no segment lines).' },
        tech: { label: 'Technology Platform net revenue', short: 'Technology Platform', group: 'Segment revenue', unit: 'usdM',
          periods: ['2023', '2024', '2025', '2026', '2027', '2028'],
          act:    [352.34, 395.178, 450.211, null, null, null],
          summit: [null, null, null, null, null, null],
          cons:   [null, null, null, 315.343, 408.31, 498.164],
          guideLo: [null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note. Actuals: 10-K / 10-Q, and Bloomberg reported values from 2Q25; Street: Bloomberg consensus, newest snapshot; no Summit series (the model projects no segment lines).' },
        fs: { label: 'Financial Services net revenue', short: 'Financial Services', group: 'Segment revenue', unit: 'usdM',
          periods: ['2023', '2024', '2025', '2026', '2027', '2028'],
          act:    [436.515, 821.511, 1542.016, null, null, null],
          summit: [null, null, null, null, null, null],
          cons:   [null, null, null, 1902.241, 2528.221, 3260.117],
          guideLo: [null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note. Actuals: 10-K / 10-Q, and Bloomberg reported values from 2Q25; Street: Bloomberg consensus, newest snapshot; no Summit series (the model projects no segment lines).' },
        oth: { label: 'Corporate / Other and eliminations', short: 'Corporate / Other', group: 'Segment revenue', unit: 'usdM',
          periods: ['2023', '2024', '2025', '2026', '2027', '2028'],
          act:    [-36.687, -27.052, -227.822, null, null, null],
          summit: [null, null, null, null, null, null],
          cons:   [null, null, null, -197.571, -289.702, -366.175],
          guideLo: [null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note. Actuals: 10-K / 10-Q, and Bloomberg reported values from 2Q25; Street: Bloomberg consensus, newest snapshot; no Summit series (the model projects no segment lines).' },
        lcp: { label: 'Lending contribution profit', short: 'Lending', group: 'Contribution profit', unit: 'usdM', marginOf: 'lend', marginLabel: 'Lending contribution margin',
          periods: ['2023', '2024', '2025', '2026', '2027', '2028'],
          act:    [823.273, 890.543, 1016.9, null, null, null],
          summit: [null, null, null, null, null, null],
          cons:   [null, null, null, 1577.158, 1900.558, 2282.727],
          guideLo: [null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note. Actuals: 10-K / 10-Q, and Bloomberg reported values from 2Q25; Street: Bloomberg consensus, newest snapshot; no Summit series (the model projects no segment lines).' },
        tcp: { label: 'Technology Platform contribution profit', short: 'Technology Platform', group: 'Contribution profit', unit: 'usdM', marginOf: 'tech', marginLabel: 'Technology Platform contribution margin',
          periods: ['2023', '2024', '2025', '2026', '2027', '2028'],
          act:    [94.786, 126.955, 144.413, null, null, null],
          summit: [null, null, null, null, null, null],
          cons:   [null, null, null, 62.893, 86.865, 112.383],
          guideLo: [null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note. Actuals: 10-K / 10-Q, and Bloomberg reported values from 2Q25; Street: Bloomberg consensus, newest snapshot; no Summit series (the model projects no segment lines).' },
        fcp: { label: 'Financial Services contribution profit', short: 'Financial Services', group: 'Contribution profit', unit: 'usdM', marginOf: 'fs', marginLabel: 'Financial Services contribution margin',
          periods: ['2023', '2024', '2025', '2026', '2027', '2028'],
          act:    [-0.262, 307.007, 792.909, null, null, null],
          summit: [null, null, null, null, null, null],
          cons:   [null, null, null, 882.111, 1306.514, 1778.644],
          guideLo: [null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note. Actuals: 10-K / 10-Q, and Bloomberg reported values from 2Q25; Street: Bloomberg consensus, newest snapshot; no Summit series (the model projects no segment lines).' },
      },
      sections: [
        { key: 'tlsrev', label: 'Segment revenue', defaultMetric: 'lend', groups: [ { label: 'Net revenue by segment', keys: ['lend', 'tech', 'fs', 'oth'] } ] }
      ]
    }
  }
};

var TLG = ['rev', 'nii', 'nonint', 'lpb', 'tp', 'loss', 'other', 'members', 'plov', 'slov', 'hlov'];
function pick(view){ var out = {}; TLG.forEach(function(k){ if (view.metrics[k]) out[k] = view.metrics[k]; }); return out; }
function tlgSections(){
  return [
    { key: 'tlgrev', label: 'Revenue', defaultMetric: 'rev', groups: [
      { label: 'Totals', keys: ['rev'] },
      { label: 'Revenue lines', keys: ['nii', 'nonint', 'lpb', 'tp', 'loss', 'other'] } ] },
    { key: 'tlgops', label: 'Operating metrics', defaultMetric: 'members', groups: [
      { label: 'Members and originations', keys: ['members', 'plov', 'slov', 'hlov'] } ] }
  ];
}
export var sofiTlGeneral = {
  forwardQuarters: 2,   // two quarters past the last print (analyst rule Oct 22 2026), same as SPOT
  updated: sofiResults.updated,
  source: sofiResults.source,
  views: {
    q: { label: 'Quarterly', note: sofiResults.views.q.note, metrics: pick(sofiResults.views.q), sections: tlgSections() },
    y: { label: 'Annual', note: sofiResults.views.y.note, metrics: pick(sofiResults.views.y), sections: tlgSections() }
  }
};

// Bottom Line ▸ Segments: where each segment's revenue stops being revenue. The segment contribution profit (segment revenue
// less the costs directly attributable to it) and its margin on segment revenue, from the same 10-K / 10-Q figures as Top Line ▸
// Segments. Actuals only (the Summit model projects no segment lines). Unique section key.
function blsView(v, label){
  var m = {};
  ['lend', 'tech', 'fs', 'lcp', 'tcp', 'fcp'].forEach(function(k){ m[k] = sofiTlSegments.views[v].metrics[k]; });
  return { label: label, note: sofiTlSegments.views[v].note, metrics: m, sections: [
    { key: 'blscp', label: 'Segment profitability', defaultMetric: 'lcp', groups: [ { label: 'Contribution profit', keys: ['lcp', 'tcp', 'fcp'] } ] }
  ] };
}
export var sofiBlSegments = {
  forwardQuarters: 2,   // two quarters past the last print (analyst rule Oct 22 2026), same as SPOT
  updated: 'Oct 2026',
  source: sofiTlSegments.source,
  views: { q: blsView('q', 'Quarterly'), y: blsView('y', 'Annual') }
};
