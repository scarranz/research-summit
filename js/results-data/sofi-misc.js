// results-data/sofi-misc.js — the two Miscellaneous datasets for the Results ENGINE (same chart standard as every other pane).
//
//   sofiRule40  — Rule of 40 = year-over-year revenue growth + adjusted EBITDA margin, BUILT AT LOAD from sofiResults (actuals, the
//                 Summit model frozen at its dated snapshot, and Bloomberg consensus), never typed. Growth is on GAAP total net
//                 revenue (SoFi presents it on adjusted net revenue; the two differ by about 1% and the analyst accepts the gap,
//                 Oct 26 2026), margin is adjusted EBITDA over the same revenue. The first year with a prior-year base is 2025.
//   sofiCapital — tangible book value, tangible book value per share and total deposits, as management stated them on the
//                 earnings calls (docs/calls/SOFI.md, SOFI-latest.md). Only figures read off a call are filled; a quarter whose
//                 number was not stated stays empty. Money in US$ millions (stated in $B on the calls), per-share in US$.
import { sofiResults } from './sofi.js';

function build(viewKey, periods, priorOf){
  var V = sofiResults.views[viewKey].metrics;
  function g(src, key, p){ var m = V[key]; var i = m.periods.indexOf(p); return i < 0 ? null : m[src][i]; }
  function growth(src, p){ var q = priorOf(p), a = g(src, 'rev', p), b = g('act', 'rev', q); if (b == null) b = g(src, 'rev', q);   // the prior-year base is the reported figure whenever there is one
    return (a == null || b == null || !b) ? null : (a / b - 1) * 100; }
  function margin(src, p){ var e = g(src, 'ebitda', p), r = g(src, 'rev', p); return (e == null || !r) ? null : e / r * 100; }
  function series(fn){ return periods.map(fn); }
  function mk(label, short, group, note, fn, parts){
    var o = { label: label, short: short, group: group, unit: 'pct', periods: periods, note: note, guideLo: periods.map(function(){ return null; }), guideHi: periods.map(function(){ return null; }) };
    ['act', 'summit', 'cons'].forEach(function(src){ o[src] = series(function(p){ if (src !== 'act' && g('act', 'rev', p) != null) return null;   // estimates only for periods not yet reported
      var v = fn(src, p); return v == null ? null : Math.round(v * 10) / 10; }); });
    return o;
  }
  var metrics = {
    r40: mk('Rule of 40', 'Rule of 40', 'Score', 'Revenue growth plus adjusted EBITDA margin, in points. 40 is the usual bar for a healthy growth company.',
      function(src, p){ var a = growth(src, p), b = margin(src, p); return (a == null || b == null) ? null : a + b; }),
    rg: mk('Revenue growth (YoY)', 'Revenue growth', 'Components', 'Year-over-year growth of total net revenue.', growth),
    em: mk('Adjusted EBITDA margin', 'EBITDA margin', 'Components', 'Adjusted EBITDA as a percentage of total net revenue.', margin)
  };
  return { label: viewKey === 'q' ? 'Quarterly' : 'Annual', note: 'Built from the Results dataset (actuals, Summit model frozen at its snapshot, Bloomberg consensus). Growth needs the prior-year period, so the series starts one year after the first period on file.',
    metrics: metrics, sections: [ { key: 'r40', label: 'Rule of 40', defaultMetric: 'r40', groups: [ { label: 'Score', keys: ['r40'] }, { label: 'Components', keys: ['rg', 'em'] } ] } ] };
}
function qPrior(p){ return p.charAt(0) + 'Q' + String(+p.slice(2) - 1).padStart(2, '0'); }
function yPrior(p){ return String(+p - 1); }
var QP = ['1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27','4Q27'];
var YP = ['2025','2026','2027','2028'];
export var sofiRule40 = {
  updated: sofiResults.updated,
  source: 'Derived from the Results dataset (js/results-data/sofi.js): SoFi 10-K / 10-Q and Bloomberg reported values for actuals, Summit DCF snapshot 2026-08-05 (frozen) and Bloomberg consensus (Oct 26 2026) for the forward periods.',
  views: { q: build('q', QP, qPrior), y: build('y', YP, yPrior) }
};

function mkc(label, short, group, unit, periods, vals, note){
  var n = periods.length, nul = function(){ return periods.map(function(){ return null; }); };
  return { label: label, short: short, group: group, unit: unit, periods: periods, act: vals, summit: nul(), cons: nul(), guideLo: nul(), guideHi: nul(), note: note };
}
var CQ = ['4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'];
var CY = ['2023','2024','2025'];
var CALLS = 'As management stated it on the earnings call; a period it did not state is left empty.';
export var sofiCapital = {
  updated: 'Oct 2026',
  source: 'SoFi earnings calls Q4 2023 to Q2 2026 (docs/calls/SOFI.md and SOFI-latest.md, verbatim). No Summit or Street series: the model projects no balance sheet and Bloomberg carries none of these lines.',
  views: {
    q: { label: 'Quarterly', note: CALLS, metrics: {
        tbv:  mkc('Tangible book value', 'Tangible book value', 'Capital', 'usdM', CQ, [3500, null, 4200, 4400, 4900, 5100, 5300, 7200, 8900, 9200, 9500], 'Consolidated tangible book value. 3Q25 includes the July 2025 common equity raise (about $1.7B); 4Q25 reflects $3.2B of new capital over the year.'),
        tbvps:mkc('Tangible book value per share', 'Tangible BV / share', 'Capital', 'eps', CQ, [null, 3.90, 3.92, null, null, 4.58, null, null, 7.01, 7.21, 7.34], 'US$ per share: 1Q24 is the prior-year comparison given on the Q1 2025 call; 4Q25 is the prior-quarter comparison given on the Q1 2026 call.'),
        dep:  mkc('Total deposits', 'Deposits', 'Funding', 'usdM', CQ, [18600, null, null, null, null, 27300, 29500, 32900, 37500, 40200, 45500], 'Period-end total deposits, mostly member deposits.')
      }, sections: [ { key: 'capq', label: 'Capital and funding', defaultMetric: 'tbv', groups: [ { label: 'Capital', keys: ['tbv', 'tbvps'] }, { label: 'Funding', keys: ['dep'] } ] } ] },
    y: { label: 'Annual', note: CALLS, metrics: {
        tbv:  mkc('Tangible book value', 'Tangible book value', 'Capital', 'usdM', CY, [3500, 4900, 8900], 'Year-end tangible book value.'),
        tbvps:mkc('Tangible book value per share', 'Tangible BV / share', 'Capital', 'eps', CY, [null, null, 7.01], 'US$ per share; only year-end 2025 was stated.'),
        dep:  mkc('Total deposits', 'Deposits', 'Funding', 'usdM', CY, [18600, null, 37500], 'Year-end total deposits.')
      }, sections: [ { key: 'capy', label: 'Capital and funding', defaultMetric: 'tbv', groups: [ { label: 'Capital', keys: ['tbv', 'tbvps'] }, { label: 'Funding', keys: ['dep'] } ] } ] }
  }
};
