// results-data/sofi-misc.js — Miscellaneous ▸ Loan Platform Business, the dataset for the Results ENGINE.
//
// Two lines, neither drawn anywhere else in the profile (the loan platform FEES are already a revenue line in Top Line ▸ General):
//   plpbo — personal loan originations through the Loan Platform Business (US$ millions)
//   take  — loan platform fees as a percentage of those originations, BUILT AT LOAD from sofiResults (fees) and plpbo (volume)
//
// plpbo comes from the Summit model, frozen at its dated snapshot (rule 10; DCF SOFI.xlsm snapshot 2026-08-05, Summit MCP metric PLPBO):
//   act    the model's own actuals_history; the reported quarters tie to what SoFi said on its calls ($1.6B, $2.4B, $3.4B, $3.7B in 2025,
//          $3.0B in 1Q26, $3.1B in 2Q26)
//   summit the model's projection_history: for the reported quarters that is its PRE-PRINT projection ($4.0B in 4Q25, 1Q26 and 2Q26, all
//          above what was reported), for 3Q26 onward its forecast.
//   The model also stores annual cells for 2026 ($22.0B), 2027 ($16.0B) and 2028 ($19.0B) that do not tie to its own quarters; the annual
//   view therefore sums the quarters (reported where reported, Summit after), and the discrepancy is an open question for the model author.
// No Street series: Bloomberg carries no Loan Platform Business volume.
import { sofiResults } from './sofi.js';

var QP = ['1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27','4Q27'];
var ACT_Q = [1600, 2450, 3400, 3656, 2963, 3100, null, null, null, null, null, null];
var SUM_Q = [null, 1800, 2450, 4000, 4000, 4000, 3400, 3600, 3500, 3500, 3500, 3500];

function nul(a){ return a.map(function(){ return null; }); }
function yearSum(arr, y){   // a year is filled only when its four quarters are
  var v = 0; for (var i = 1; i <= 4; i++){ var x = arr[QP.indexOf(i + 'Q' + y.slice(2))]; if (x == null) return null; v += x; } return v; }
var YP = ['2025','2026','2027'];
var mixQ = QP.map(function(p, i){ return ACT_Q[i] != null ? ACT_Q[i] : SUM_Q[i]; });   // reported where reported, Summit after
var ACT_Y = YP.map(function(y){ return yearSum(ACT_Q, y); });
var SUM_Y = YP.map(function(y, i){ return ACT_Y[i] == null ? yearSum(mixQ, y) : null; });

function take(key, periods, vol, srcKey){
  var f = sofiResults.views[key].metrics.lpb;
  return periods.map(function(p, i){
    var j = f.periods.indexOf(p), fee = j < 0 ? null : f[srcKey][j], v = vol[i];
    return (fee == null || !v) ? null : Math.round(fee / v * 1000) / 10;
  });
}
function mk(label, short, unit, periods, act, summit, note){
  return { label: label, short: short, group: 'Loan Platform Business', unit: unit, periods: periods, act: act, summit: summit, cons: nul(periods), guideLo: nul(periods), guideHi: nul(periods), note: note };
}
var VNOTE = 'Personal loans originated for third-party partners, US$ millions. Actuals are the model\'s and tie to the calls. The Summit series is the model\'s pre-print projection for reported quarters and its forecast after.';
var TNOTE = 'Loan platform fees divided by Loan Platform Business originations. Fees are the Bloomberg line "Loan Platform Fees"; for 2Q25 that is $127M against the $131M of adjusted net revenue SoFi cites, so read it as a level, not a contract rate.';
function view(label, key, periods, act, summit){
  var tAct = take(key, periods, act, 'act');
  // the model's annual loan platform fees (2026: $1,100M) do not tie to its quarters ($625M), so no annual Summit fee rate is drawn
  var tSum = key === 'y' ? nul(periods) : take(key, periods, periods.map(function(p, i){ return act[i] != null ? null : summit[i]; }), 'summit');
  return { label: label, note: 'Frozen Summit model (snapshot 2026-08-05) and reported figures; see the file header for the open question on the model\'s annual cells.',
    metrics: {
      plpbo: mk('LPB originations', 'LPB originations', 'usdM', periods, act, summit, VNOTE),
      take:  mk('Loan platform fees on originations', 'Fee on originations', 'pct', periods, tAct, tSum, TNOTE)
    }, sections: [ { key: 'lpbvol', label: 'Loan Platform Business', defaultMetric: 'plpbo', groups: [ { label: 'Volume', keys: ['plpbo'] }, { label: 'Monetization', keys: ['take'] } ] } ] };
}
export var sofiLpb = {
  updated: 'Oct 2026',
  source: 'Summit DCF model, snapshot 2026-08-05 (metric PLPBO, frozen; reported quarters tie to the earnings calls Q1 2025 to Q2 2026); Bloomberg reported loan platform fees (BBG_CONSENSUS.txt). No Street series on volume.',
  views: { q: view('Quarterly', 'q', QP, ACT_Q, SUM_Q), y: view('Annual', 'y', YP, ACT_Y, SUM_Y) }
};
