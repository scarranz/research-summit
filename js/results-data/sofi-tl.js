// results-data/sofi-tl.js — Top Line datasets for the Results ENGINE.
//   sofiTlSegments — Top Line ▸ Segments: net revenue and contribution profit of the three SoFi reportable segments, from the
//                    10-K and 10-Q (actuals only: the Summit model does not project segment revenue).
//   sofiTlGeneral  — Top Line ▸ General: total net revenue, its revenue lines and the operating counts, re-cut from sofiResults
//                    (actuals, Summit frozen, Bloomberg consensus).
// Unique section keys keep these engine instances apart from the Results tab's canvases.
import { sofiResults } from './sofi.js';

export var sofiTlSegments = {
  updated: 'Oct 2026',
  source: 'SoFi FY2025 Form 10-K and 2Q26 Form 10-Q (SEC EDGAR), segment results; the Q4 2025 call (Jan 30 2026) for 4Q25 Financial Services and Technology Platform.',
  views: {
    q: {
      label: 'Quarterly',
      note: 'Segment figures are the reportable-segment numbers from the SoFi 10-K (FY2023–FY2025) and 10-Q (1Q25, 2Q25, 1Q26, 2Q26; the first quarters are the six-month figure less the second quarter). They are BEFORE Corporate/Other, which holds the intercompany eliminations (FY2025: segments sum to $3,841.2M against $3,613.4M of total net revenue), and Technology Platform includes intercompany fees ($85.5M in FY2025). 4Q25 Financial Services and Technology Platform come from the Q4 2025 call; 3Q25 and the Lending 4Q25 figures are not in the filings on hand and are left empty. The Summit model does not project segment revenue, so there are no forecasts.',
      metrics: {
        lend: { label: 'Lending net revenue', short: 'Lending', group: 'Segment revenue', unit: 'usdM',
          periods: ['1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26'],
          act:    [413.373, 443.512, null, null, 642.42, 724.798],
          summit: [null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null],
          guideLo: [null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note.' },
        tech: { label: 'Technology Platform net revenue', short: 'Technology Platform', group: 'Segment revenue', unit: 'usdM',
          periods: ['1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26'],
          act:    [103.427, 109.833, null, 122, 75.086, 84.505],
          summit: [null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null],
          guideLo: [null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note.' },
        fs: { label: 'Financial Services net revenue', short: 'Financial Services', group: 'Segment revenue', unit: 'usdM',
          periods: ['1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26'],
          act:    [303.119, 362.533, null, 457, 428.543, 466.278],
          summit: [null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null],
          guideLo: [null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note.' },
        lcp: { label: 'Lending contribution profit', short: 'Lending', group: 'Contribution profit', unit: 'usdM', marginOf: 'lend', marginLabel: 'Lending contribution margin',
          periods: ['1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26'],
          act:    [238.935, 244.71, null, null, 382.386, 399.033],
          summit: [null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null],
          guideLo: [null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note.' },
        tcp: { label: 'Technology Platform contribution profit', short: 'Technology Platform', group: 'Contribution profit', unit: 'usdM', marginOf: 'tech', marginLabel: 'Technology Platform contribution margin',
          periods: ['1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26'],
          act:    [30.913, 33.195, null, null, 11.999, 11.772],
          summit: [null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null],
          guideLo: [null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note.' },
        fcp: { label: 'Financial Services contribution profit', short: 'Financial Services', group: 'Contribution profit', unit: 'usdM', marginOf: 'fs', marginLabel: 'Financial Services contribution margin',
          periods: ['1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26'],
          act:    [148.332, 188.232, null, 231, 195.584, 212.676],
          summit: [null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null],
          guideLo: [null, null, null, null, null, null],
          guideHi: [null, null, null, null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note.' },
      },
      sections: [
        { key: 'tlsrev', label: 'Segment revenue', defaultMetric: 'lend', groups: [ { label: 'Net revenue by segment', keys: ['lend', 'tech', 'fs'] } ] },
        { key: 'tlscp', label: 'Segment profitability', defaultMetric: 'lcp', groups: [ { label: 'Contribution profit', keys: ['lcp', 'tcp', 'fcp'] } ] }
      ]
    },
    y: {
      label: 'Annual',
      note: 'Segment figures are the reportable-segment numbers from the SoFi 10-K (FY2023–FY2025) and 10-Q (1Q25, 2Q25, 1Q26, 2Q26; the first quarters are the six-month figure less the second quarter). They are BEFORE Corporate/Other, which holds the intercompany eliminations (FY2025: segments sum to $3,841.2M against $3,613.4M of total net revenue), and Technology Platform includes intercompany fees ($85.5M in FY2025). 4Q25 Financial Services and Technology Platform come from the Q4 2025 call; 3Q25 and the Lending 4Q25 figures are not in the filings on hand and are left empty. The Summit model does not project segment revenue, so there are no forecasts.',
      metrics: {
        lend: { label: 'Lending net revenue', short: 'Lending', group: 'Segment revenue', unit: 'usdM',
          periods: ['2023', '2024', '2025'],
          act:    [1370.621, 1485.222, 1848.949],
          summit: [null, null, null],
          cons:   [null, null, null],
          guideLo: [null, null, null],
          guideHi: [null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note.' },
        tech: { label: 'Technology Platform net revenue', short: 'Technology Platform', group: 'Segment revenue', unit: 'usdM',
          periods: ['2023', '2024', '2025'],
          act:    [352.34, 395.178, 450.211],
          summit: [null, null, null],
          cons:   [null, null, null],
          guideLo: [null, null, null],
          guideHi: [null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note.' },
        fs: { label: 'Financial Services net revenue', short: 'Financial Services', group: 'Segment revenue', unit: 'usdM',
          periods: ['2023', '2024', '2025'],
          act:    [436.515, 821.511, 1542.016],
          summit: [null, null, null],
          cons:   [null, null, null],
          guideLo: [null, null, null],
          guideHi: [null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note.' },
        lcp: { label: 'Lending contribution profit', short: 'Lending', group: 'Contribution profit', unit: 'usdM', marginOf: 'lend', marginLabel: 'Lending contribution margin',
          periods: ['2023', '2024', '2025'],
          act:    [823.273, 890.543, 1016.9],
          summit: [null, null, null],
          cons:   [null, null, null],
          guideLo: [null, null, null],
          guideHi: [null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note.' },
        tcp: { label: 'Technology Platform contribution profit', short: 'Technology Platform', group: 'Contribution profit', unit: 'usdM', marginOf: 'tech', marginLabel: 'Technology Platform contribution margin',
          periods: ['2023', '2024', '2025'],
          act:    [94.786, 126.955, 144.413],
          summit: [null, null, null],
          cons:   [null, null, null],
          guideLo: [null, null, null],
          guideHi: [null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note.' },
        fcp: { label: 'Financial Services contribution profit', short: 'Financial Services', group: 'Contribution profit', unit: 'usdM', marginOf: 'fs', marginLabel: 'Financial Services contribution margin',
          periods: ['2023', '2024', '2025'],
          act:    [-0.262, 307.007, 792.909],
          summit: [null, null, null],
          cons:   [null, null, null],
          guideLo: [null, null, null],
          guideHi: [null, null, null],
          note: 'Reportable segment, GAAP basis. See the view note.' },
      },
      sections: [
        { key: 'tlsrev', label: 'Segment revenue', defaultMetric: 'lend', groups: [ { label: 'Net revenue by segment', keys: ['lend', 'tech', 'fs'] } ] },
        { key: 'tlscp', label: 'Segment profitability', defaultMetric: 'lcp', groups: [ { label: 'Contribution profit', keys: ['lcp', 'tcp', 'fcp'] } ] }
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
  updated: sofiResults.updated,
  source: sofiResults.source,
  views: {
    q: { label: 'Quarterly', note: sofiResults.views.q.note, metrics: pick(sofiResults.views.q), sections: tlgSections() },
    y: { label: 'Annual', note: sofiResults.views.y.note, metrics: pick(sofiResults.views.y), sections: tlgSections() }
  }
};
