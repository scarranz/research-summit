// overviews/meta-ce-data.js — the DATA behind META's Evolution ▸ Earnings.
//
// The rendering is Amazon's machinery, extracted into ./meta-ce.js (via the guide-built TSM copy); this file is the
// only part that is Meta's. Two objects, the same shape amzn.js inlines:
//   META_CE_CONS — the estimate grid and "The print" cards: the BBG_CONSENSUS.txt archive spine, rebuilt at load
//     from js/results-data/meta.js and ./meta-bbg.js (EV-SET, SAB 2026-10-21).
//   META_CALL_EARNINGS — per quarter, newest first: setup (notes, Summit `us`), results and the call (prepared,
//     qanda, highlights, newQuestions). Transcripts: docs/calls/META.md (verbatim, Q4 2023 → Q1 2026) and
//     docs/calls/META-latest.md (Q2 2026, reconstructed from earnings-day coverage until the IR verbatim lands).

import { metaResults } from '../results-data/meta.js';
import { metaBBG } from './meta-bbg.js';

// ── CE_CONS — the consensus archive spine (EARNINGS_CONVENTIONS §6a) ─────────
// Parsed 2026-07-30 from G:\My Drive\Summit\Docs\0\BBG_CONSENSUS.txt (12 META
// snapshots). Label integrity: 60 fq-label checks + 72 close-date checks, 0
// mismatches. Corruption this load: OCF fq-3/fq+2 cells in the four 2023–24
// snapshots came through as Excel dates → null (the corruption MOVES between
// exports — derived on every reload, never carried forward by hand).
// Values $B (file is $M, scale per metric); EPS $; shares/DAP B; the two ad
// KPIs are ALREADY YoY-% lines (see their notes). Capex is the file's
// CF_PURCHASE_OF_FIXED_PROD_ASSETS — purchases of PP&E, sign-flipped to the
// positive magnitude. ⚠ Meta STATES capex incl. principal payments on finance
// leases, ~2–4% higher (2Q26: $31.1B stated vs $30.1B on this line) — a basis
// difference, not an error; noted on the cells where it matters.
export var META_CE_CONS = {
  src:'Bloomberg (BST) · BBG_CONSENSUS.txt snapshot archive',
  asOf:['2023-10-27','2024-02-03','2024-04-26','2024-08-02','2024-11-01','2025-01-31','2025-05-02','2025-08-01','2025-10-31','2026-01-30','2026-05-01','2026-07-29'],
  q:['Q4 2022','Q1 2023','Q2 2023','Q3 2023','Q4 2023','Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026','Q2 2026','Q3 2026','Q4 2026','Q1 2027','Q2 2027'],
  hz:['4q out','3q out','2q out','1q out'],
  nHead:9,
  m:[
    { k:'Revenue', u:'$B', t:'ok', code:'SALES_REV_TURN',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,38.7],[null,null,33.5,35.5],[null,36.2,37.7,38.1],[37.6,38.7,39,40],[44.7,45.1,45.9,46.8],[40.9,41.4,41.8,41.5],[44.4,44.8,44.9,44.5],[46.4,46.7,45.8,49],[55.1,54.3,57,58.1],[47.7,50.1,51,54.9],[54.7,56,59.2,60],[59.5,62.5,63.1,63.2],[72.7,73.2,73.4,null],[66.8,67.6,null,null],[72.1,null,null,null]],
      qa:[32.2,28.6,32,34.1,40.1,36.5,39.1,40.6,48.4,42.3,47.5,51.2,59.9,56.3,60.8,null,null,null,null],
      qy:[null,null,null,null,32.2,28.6,32,34.1,40.1,36.5,39.1,40.6,48.4,42.3,47.5,51.2,59.9,56.3,60.8],
      qq:[null,32.2,28.6,32,34.1,40.1,36.5,39.1,40.6,48.4,42.3,47.5,51.2,59.9,56.3,60.8,null,null,null] },
    { k:'Gross profit', u:'$B', t:'ok', code:'GROSS_PROFIT',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,31.2],[null,null,26.8,28.4],[null,29.1,30.4,30.9],[30.4,31.5,31.8,32.3],[36,36.4,36.9,37.8],[33.6,33.4,33.8,33.6],[35.6,36.1,36.2,35.8],[37.4,37.9,37,39.7],[44.2,43.8,46,46.9],[38.2,40.6,40.9,44.3],[44.2,44.8,47.5,47.9],[47.5,50,50,50.4],[57.4,57.8,58.3,null],[52.7,53.9,null,null],[56.4,null,null,null]],
      qa:[23.8,22.5,26.1,27.9,32.4,29.8,31.8,33.2,39.5,34.7,39,42,49,46.1,null,null,null,null,null],
      qy:[null,null,null,null,23.8,22.5,26.1,27.9,32.4,29.8,31.8,33.2,39.5,34.7,39,42,49,46.1,null],
      qq:[null,23.8,22.5,26.1,27.9,32.4,29.8,31.8,33.2,39.5,34.7,39,42,49,46.1,null,null,null,null] },
    { k:'Operating income', u:'$B', t:'ok', code:'IS_COMPARABLE_EBIT',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,15.2],[null,null,11.4,13],[null,13.1,14.2,14.4],[13.9,15.1,15.2,15.8],[18.6,18.7,19,19.8],[16.1,16.1,16.3,15.6],[18.2,18.1,17.4,17],[19.5,18.4,17.4,19.1],[23.3,21.9,23.2,23.9],[18.8,19,18.5,19.3],[21,20.7,20.8,21.3],[21.3,21,20.8,21],[25.4,25.1,25.3,null],[24.3,25,null,null],[25.2,null,null,null]],
      qa:[6.4,7.2,9.4,13.7,16.4,13.8,14.8,17.4,23.4,17.6,20.4,20.5,24.7,22.9,18.8,null,null,null,null],
      qy:[null,null,null,null,6.4,7.2,9.4,13.7,16.4,13.8,14.8,17.4,23.4,17.6,20.4,20.5,24.7,22.9,18.8],
      qq:[null,6.4,7.2,9.4,13.7,16.4,13.8,14.8,17.4,23.4,17.6,20.4,20.5,24.7,22.9,18.8,null,null,null] },
    { k:'EBITDA', u:'$B', t:'ok', code:'IS_COMPARABLE_EBITDA',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,21.9],[null,null,17.9,19.9],[null,20.4,21.2,21.4],[20.6,21.9,22,22.2],[25.5,25.8,25.5,26.3],[22.5,21.5,22.6,23.2],[23.5,24.7,25.7,23.3],[26.3,26.9,23.7,25.4],[31.8,29,30.3,30.9],[24.2,25,25.3,26.7],[28,29.3,29.4,29.7],[30.8,30.1,29.8,29.5],[35.5,34.8,34.4,null],[32.8,34,null,null],[36,null,null,null]],
      qa:[8.8,9.8,12,16.6,19.6,17.2,18.5,21.4,27.8,21.5,24.8,25.5,30.2,28.9,null,null,null,null,null],
      qy:[null,null,null,null,8.8,9.8,12,16.6,19.6,17.2,18.5,21.4,27.8,21.5,24.8,25.5,30.2,28.9,null],
      qq:[null,8.8,9.8,12,16.6,19.6,17.2,18.5,21.4,27.8,21.5,24.8,25.5,30.2,28.9,null,null,null,null] },
    { k:'EPS (diluted)', u:'$', t:'ok', code:'IS_COMP_EPS_GAAP',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,4.83],[null,null,3.56,4.15],[null,4.09,4.61,4.67],[4.41,4.83,4.83,5.14],[6,5.99,6.28,6.71],[5.11,5.22,5.46,5.3],[5.8,5.96,5.89,5.81],[6.37,6.23,5.93,6.62],[7.86,7.47,8.05,8.19],[6.4,6.63,6.49,6.56],[7.31,7.21,7.1,7.16],[7.47,7.18,7,6.96],[8.65,8.46,8.4,null],[8.24,8.39,null,null],[8.48,null,null,null]],
      qa:[1.76,2.2,2.98,4.39,5.33,4.71,5.16,6.03,8.02,6.43,7.14,1.05,8.88,10.44,6.18,null,null,null,null],
      qy:[null,null,null,null,1.76,2.2,2.98,4.39,5.33,4.71,5.16,6.03,8.02,6.43,7.14,1.05,8.88,10.44,6.18],
      qq:[null,1.76,2.2,2.98,4.39,5.33,4.71,5.16,6.03,8.02,6.43,7.14,1.05,8.88,10.44,6.18,null,null,null] },
    { k:'Operating cash flow', u:'$B', t:'ok', code:'CB_CF_NET_CASH_OPERATING_ACT',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,17.9],[null,null,null,18.4],[null,18.9,null,20.2],[18.9,20.9,null,22.1],[23.5,23.8,null,26.4],[23.1,22.6,null,22.9],[23.6,25,null,22.5],[29.8,28.1,26.5,28.4],[30.3,30,31.5,34.2],[26.5,27.7,28.2,29.2],[29.6,30.4,31.7,33.3],[30.9,32.3,35.4,34.7],[39.8,44.5,43.7,null],[39.6,38,null,null],[40.9,null,null,null]],
      qa:[null,null,null,20.4,19.4,19.2,19.4,24.7,28,24,25.6,30,36.2,32.2,31.9,null,null,null,null],
      qy:[null,null,null,null,null,null,null,20.4,19.4,19.2,19.4,24.7,28,24,25.6,30,36.2,32.2,31.9],
      qq:[null,null,null,null,20.4,19.4,19.2,19.4,24.7,28,24,25.6,30,36.2,32.2,31.9,null,null,null] },
    { k:'Capex', u:'$B', t:'ok', code:'CF_PURCHASE_OF_FIXED_PROD_ASSETS',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,8.5],[null,null,null,7.3],[null,null,7.9,8],[null,8.1,9.2,9.8],[9.2,11.2,11.6,13.4],[8.1,9.8,12.4,10.5],[11.5,13.2,11.3,15.7],[12.4,11.6,16.9,18.3],[10.8,19,20.9,21.2],[16.5,17,21.9,16.8],[16.5,25.7,19.7,25.4],[28.1,23.3,28.7,37.8],[26.2,32.7,45.5,null],[17.6,37.9,null,null],[43.7,null,null,null]],
      qa:[9,6.8,6.2,6.5,7.7,6.4,8.2,8.3,14.4,12.9,16.5,18.8,21.4,19,30.1,null,null,null,null],
      qy:[null,null,null,null,9,6.8,6.2,6.5,7.7,6.4,8.2,8.3,14.4,12.9,16.5,18.8,21.4,19,30.1],
      qq:[null,9,6.8,6.2,6.5,7.7,6.4,8.2,8.3,14.4,12.9,16.5,18.8,21.4,19,30.1,null,null,null] },
    { k:'D&A', u:'$B', t:'ok', code:'CF_DEPR_AMORT',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,3],[null,null,3.3,3.5],[null,3.4,3.6,3.6],[3.6,3.9,3.9,3.9],[4.1,4.1,4.2,4.6],[4.4,4.4,4.6,4.7],[4.6,5,5.1,4.7],[5.5,5.5,5.2,5.1],[5.9,5.8,5.7,5.7],[5.8,6.1,6.3,6.3],[6.5,6.9,7.1,7.2],[7.6,8,8.3,8.3],[9,9.7,9.6,null],[9.9,10,null,null],[11.6,null,null,null]],
      qa:[2.4,2.5,2.6,2.9,3.2,3.4,3.6,4,4.5,3.9,4.3,5,5.4,6,6.4,null,null,null,null],
      qy:[null,null,null,null,2.4,2.5,2.6,2.9,3.2,3.4,3.6,4,4.5,3.9,4.3,5,5.4,6,6.4],
      qq:[null,2.4,2.5,2.6,2.9,3.2,3.4,3.6,4,4.5,3.9,4.3,5,5.4,6,6.4,null,null,null] },
    { k:'Diluted shares', u:'B', t:'ok', code:'IS_SH_FOR_DILUTED_EPS',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,2.62],[null,null,2.62,2.62],[null,2.61,2.61,2.61],[2.6,2.61,2.6,2.59],[2.59,2.59,2.58,2.58],[2.59,2.57,2.58,2.58],[2.56,2.57,2.58,2.57],[2.56,2.57,2.57,2.56],[2.57,2.56,2.56,2.56],[2.55,2.55,2.55,2.56],[2.54,2.55,2.56,2.56],[2.54,2.56,2.56,2.57],[2.57,2.57,2.57,null],[2.57,2.57,null,null],[2.57,null,null,null]],
      qa:[2.64,2.6,2.61,2.64,2.63,2.62,2.61,2.6,2.6,2.59,2.57,2.57,2.56,2.56,2.57,null,null,null,null],
      qy:[null,null,null,null,2.64,2.6,2.61,2.64,2.63,2.62,2.61,2.6,2.6,2.59,2.57,2.57,2.56,2.56,2.57],
      qq:[null,2.64,2.6,2.61,2.64,2.63,2.62,2.61,2.6,2.6,2.59,2.57,2.57,2.56,2.56,2.57,null,null,null] },
    { k:'Family of Apps revenue', u:'$B', t:'ok', code:'SALES_REV_TURN',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,38.1],[null,null,33.3,35],[null,35.9,37.1,37.8],[37.2,38.2,38.6,39.7],[43.4,43.8,44.9,45.8],[40.4,41.1,41.4,41],[44,44.4,44.4,44.1],[46.1,46.2,45.4,48.3],[53.8,53.2,55.4,57.2],[47.2,49.2,50.5,54.4],[53.7,55.6,58.7,59.6],[59.1,61.9,62.4,62.5],[71.4,72,72.2,null],[66.4,67,null,null],[71.6,null,null,null]],
      qa:[31.4,28.3,31.7,33.9,39,36,38.7,40.3,47.3,41.9,47.1,50.8,58.9,55.9,60.4,null,null,null,null],
      qy:[null,null,null,null,31.4,28.3,31.7,33.9,39,36,38.7,40.3,47.3,41.9,47.1,50.8,58.9,55.9,60.4],
      qq:[null,31.4,28.3,31.7,33.9,39,36,38.7,40.3,47.3,41.9,47.1,50.8,58.9,55.9,60.4,null,null,null] },
    { k:'Daily Active People (DAP)', u:'B', t:'ok', code:'DAILY_ACTIVE_USERS',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,3.12],[null,null,3.16,3.19],[null,3.2,3.23,3.27],[3.24,3.26,3.31,3.32],[3.29,3.35,3.36,3.31],[3.35,3.37,3.36,3.37],[3.4,3.39,3.4,3.44],[3.41,3.42,3.46,3.48],[3.46,3.51,3.53,3.55],[3.54,3.57,3.6,3.61],[3.6,3.64,3.65,3.62],[3.69,3.69,3.68,3.67],[3.74,3.72,3.71,null],[3.71,3.7,null,null],[3.74,null,null,null]],
      qa:[2.96,3.02,3.07,3.14,3.19,3.24,3.27,3.29,3.35,3.43,3.48,3.54,3.58,3.56,3.6,null,null,null,null],
      qy:[null,null,null,null,2.96,3.02,3.07,3.14,3.19,3.24,3.27,3.29,3.35,3.43,3.48,3.54,3.58,3.56,3.6],
      qq:[null,2.96,3.02,3.07,3.14,3.19,3.24,3.27,3.29,3.35,3.43,3.48,3.54,3.58,3.56,3.6,null,null,null] },
    { k:'Ad impressions growth (YoY)', u:'%', t:'ok', code:'NUMBER_OF_ADS_DELIVERED_YOY_PCT',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,22],[null,null,14.6,17.4],[null,12,13.5,14.7],[11.2,10.8,11.7,10.3],[9.9,11.9,12.2,9.7],[10.9,11.6,9.2,7.1],[11.1,9.5,8,6.4],[9.2,7.8,6.5,10],[7.7,6.4,9.4,11.5],[5.9,8.2,10.8,15.8],[7.4,9.1,12.7,13.2],[8.5,11.2,11.8,12.9],[10.5,10.9,11.8,null],[10.3,11.1,null,null],[11,null,null,null]],
      qa:[23,26,34,31,21,20,10,7,6,5,11,14,18,19,14,null,null,null,null],
      qy:[null,null,null,null,23,26,34,31,21,20,10,7,6,5,11,14,18,19,14],
      qq:[null,23,26,34,31,21,20,10,7,6,5,11,14,18,19,14,null,null,null] },
    { k:'Avg price per ad (YoY)', u:'%', t:'ok', code:'PRICE_PER_AD_YOY_PERCENTAGE',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,-1.4],[null,null,2,5.9],[null,0.7,4.2,4.8],[-1.1,2.8,3.6,7.2],[3.7,0,3.6,7.5],[1.3,4.2,5.5,6.7],[4.6,5.1,6.7,7.2],[4.8,6.7,5.8,9.8],[6.2,5.4,8,8.9],[6.9,9.4,9.5,12.2],[8.8,8.5,10.9,11.5],[8,9.7,9.7,10],[10.4,11,11.3,null],[8.8,9,null,null],[9,null,null,null]],
      qa:[-22,-17,-16,-6,2,6,10,11,14,10,9,10,6,12,12,null,null,null,null],
      qy:[null,null,null,null,-22,-17,-16,-6,2,6,10,11,14,10,9,10,6,12,12],
      qq:[null,-22,-17,-16,-6,2,6,10,11,14,10,9,10,6,12,12,null,null,null] },
  ]
};

// ── EV-SET (playbook §EV-SET; SAB 2026-10-21): the grid is REBUILT AT LOAD from the data files, so
// Earnings, Results and the Bottom Line can never disagree (the SN pattern, sharkninja-ce-data.js):
//   • lines the Results dataset carries (revenue, operating income, EPS, capex, FoA / advertising / RL
//     revenue) — `1q out` = the dataset's flat `cons` (the Bloomberg pre-print, synced to its estMatrix),
//     `4q/3q/2q out` = the estMatrix vintage whose last reported quarter sits that many quarters before,
//     `qa` = the reported actual. The archive's values for these lines are replaced.
//   • the other lines (gross profit, EBITDA, cash flow, D&A, shares, DAP, the two ad-rate KPIs) keep the
//     archive above for their history; the quarters in ./meta-bbg.js (generated from the newest snapshot)
//     overwrite their actuals and their `1q out`.
// Two lines are added to the custom KPIs: Advertising revenue and Reality Labs revenue.
(function(){
  var M=metaResults.views.q.metrics, MX=metaResults.estMatrix&&metaResults.estMatrix.cons;
  function pOf(q){ return q.charAt(1)+'Q'+q.slice(-2); }                    // 'Q3 2026' → '3Q26'
  function ord(p){ var m=/^(\d)Q(\d{2})$/.exec(p); return m?(2000+(+m[2]))*4+(+m[1]):null; }
  var Q=META_CE_CONS.q, QP=Q.map(pOf);
  // Round the way the archive prints: $B to 0.1 (0.01 under $10B), EPS and counts in B to 0.01, % rates to 0.1.
  function rnd(v,u){ if(v==null) return null; var d=((u==='$B'&&Math.abs(v)>=10)||u==='%')?10:100; return Math.round(v*d)/d; }
  function growth(m){
    m.qa=m.qa.map(function(v){ return rnd(v,m.u); }); m.qr=m.qr.map(function(r){ return r.map(function(v){ return rnd(v,m.u); }); });
    m.qy=Q.map(function(q,i){ return i>=4?m.qa[i-4]:null; }); m.qq=Q.map(function(q,i){ return i>=1?m.qa[i-1]:null; }); }
  function fromResults(m, key, scale){
    var r=M[key]; if(!r) return m;
    function at(arr,p){ var i=r.periods.indexOf(p); return (i<0||!arr||arr[i]==null)?null:arr[i]/scale; }
    m.qa=QP.map(function(p){ return at(r.act,p); });
    m.qr=QP.map(function(p){
      var row=[null,null,null,at(r.cons,p)], op=ord(p), rows=MX&&MX.q&&MX.q[key];
      if(rows) MX.vintages.forEach(function(v){   // oldest → newest, so the latest vintage at each horizon wins
        var h=op-ord(v.lastActual.q); if(h<2||h>4) return;
        var x=rows[v.id]&&rows[v.id][p]; if(x!=null) row[4-h]=x/scale; });
      return row; });
    growth(m); return m; }
  var RS={ 'Revenue':['rev',1000], 'Operating income':['opinc',1000], 'EPS (diluted)':['eps',1], 'Capex':['capex',1000], 'Family of Apps revenue':['foa',1000] };
  var BB={ 'Gross profit':['grossProfit',1000], 'EBITDA':['ebitda',1000], 'Operating cash flow':['cfo',1000], 'D&A':['depreciationAmortization',1000],
           'Diluted shares':['dilShares',1000], 'Daily Active People (DAP)':['familyDailyActivePeopleDap',1000],
           'Ad impressions growth (YoY)':['avgImpressionsGrowthChangeYoy',1], 'Avg price per ad (YoY)':['avgPricePerAdChangeYoy',1] };
  var bq=metaBBG.qtrs.map(function(p){ return p.replace(/E$/,''); });          // '3Q26E' → '3Q26'
  META_CE_CONS.m.forEach(function(m){
    if(RS[m.k]){ fromResults(m, RS[m.k][0], RS[m.k][1]); return; }
    var b=BB[m.k], s=b&&metaBBG.is[b[0]]; if(!s) return;
    bq.forEach(function(p,j){ var i=QP.indexOf(p), v=s.q[j]; if(i<0||v==null) return; v=(b[1]===1?v:Math.abs(v)/b[1]);
      if(j<s.qA.length) m.qa[i]=v; else m.qr[i]=[m.qr[i][0],m.qr[i][1],m.qr[i][2],v]; });
    growth(m); });
  // Reported actuals the Bloomberg export does not carry yet (it is a pre-print snapshot): typed from the 8-K
  // Ex. 99.1 of the print. Gross profit = revenue − cost of revenue; EBITDA = operating income + D&A (both GAAP,
  // so they INCLUDE any one-time charge); capex is not here (it comes from Results, Meta-stated basis).
  var ACT_8K={
    '3Q26':{ 'Gross profit':51.2, 'EBITDA':20.1, 'Operating cash flow':32.8, 'D&A':7.15, 'Diluted shares':2.57,
             'Daily Active People (DAP)':3.64, 'Ad impressions growth (YoY)':10, 'Avg price per ad (YoY)':14 }   // 8-K Oct 21 2026
  };
  Object.keys(ACT_8K).forEach(function(p){ var i=QP.indexOf(p); if(i<0) return;
    META_CE_CONS.m.forEach(function(m){ var v=ACT_8K[p][m.k]; if(v==null) return; m.qa[i]=v; growth(m); }); });
  var at=META_CE_CONS.m.map(function(x){ return x.k; }).indexOf('Family of Apps revenue')+1;
  META_CE_CONS.m.splice(at, 0,
    fromResults({ k:'Advertising revenue', u:'$B', t:'ok', code:'SALES_REV_TURN' }, 'adv', 1000),
    fromResults({ k:'Reality Labs revenue', u:'$B', t:'ok', code:'SALES_REV_TURN' }, 'rl', 1000));
  var nv=MX&&MX.vintages[MX.vintages.length-1];
  META_CE_CONS.src='Bloomberg (BST) · BBG_CONSENSUS.txt — via js/results-data/meta.js (estMatrix'+(nv?', newest snapshot '+nv.id:'')+') and js/overviews/meta-bbg.js (as of '+metaBBG.asOf+'); older history of the other lines from the archive parse above';
})();
// Summit for a quarter's Setup (`setup.us`): READ from the Results dataset, where the model is frozen at its
// dated snapshot (rule 10) — never typed. Only the lines the model projects by quarter; the rest stay "—".
function ceSummitUs(p){
  var M=metaResults.views.q.metrics, out={};
  [['Revenue','rev',1000],['Operating income','opinc',1000],['EPS (diluted)','eps',1],['Capex','capex',1000],
   ['Family of Apps revenue','foa',1000],['Advertising revenue','adv',1000],['Reality Labs revenue','rl',1000]].forEach(function(x){
    var r=M[x[1]], i=r?r.periods.indexOf(p):-1, v=(i>=0&&r.summit)?r.summit[i]:null;
    if(v!=null){ v=v/x[2]; out[x[0]]={ v:Math.abs(v)>=10?Math.round(v*10)/10:Math.round(v*100)/100 }; } });
  return out;
}

export var META_CALL_EARNINGS = { ticker:'META', quarters:[
  // ── UPCOMING: Q3 2026 (quarter ended Sep 2026; reports Oct 21, 2026 after close, call 4:30pm ET —
  // Meta IR release of Oct 12, 2026). Setup rebuilt with the playbook (EV-SET, SAB 2026-10-21).
  //
  // CONSENSUS — BBG_CONSENSUS.txt snapshot 2026-10-21 (added by SAB the morning of the print; its last
  // reported quarter is 2Q26, so its fq+1 IS this quarter), read through CE_CONS above. SUMMIT — the
  // 2026-08-04 snapshot, frozen in js/results-data/meta.js (ceSummitUs): it predates the Aug 26 settlement.
  // GUIDANCE — Q2 2026 press release, 8-K Ex. 99.1 (Jul 29, 2026), "CFO Outlook Commentary".
  // ── UPCOMING: Q4 2026 (quarter ends Dec 31, 2026; Meta reports late January 2027) ──
  // Street = the Bloomberg snapshot of Oct 21 2026, taken BEFORE the 3Q26 print and the 4Q26 guide (said in the
  // notes until the next export). Guidance = the 3Q26 release (8-K Ex. 99.1, Oct 21 2026).
  { q:'Q4 2026', status:'upcoming', date:'reports late January 2027',
    setup:{
      source:'Bloomberg (BST) — BBG_CONSENSUS.txt, snapshot 2026-10-21 (before the 3Q26 print and the 4Q26 guide) · Summit DCF model — snapshot 2026-08-04, frozen · guidance: 3Q26 press release (8-K Ex. 99.1, Oct 21 2026)', asOf:'2026-10-21',
      notes:{
        'Revenue':{ t:'Guided $73–76B; the Street on file predates the guide', h:'<p>Guide: “We expect fourth quarter 2026 total revenue to be in the range of $73-76 billion. Our guidance assumes foreign currency is an approximately 1% headwind to year-over-year total revenue growth.” The Bloomberg snapshot on file ($73.6B) is from before the print, so it sits inside the range by chance, not by revision.</p>' },
        'Operating income':{ t:'FY26 expenses raised to $175–179B for the $9.9B charge', h:'<p>“We now expect full year 2026 total expenses to be in the range of $175-179 billion.” And: “Excluding the third quarter legal charge, we continue to expect 2026 operating income to be above 2025 operating income.” 2025 operating income was $83.3B; 1Q–3Q26 add up to $54.6B with the charge, $64.5B without it.</p>' },
        'Capex':{ t:'FY26 narrowed to $135–145B: about $49–59B left for Q4', h:'<p>“We anticipate 2026 capital expenditures, including principal payments on finance leases, to be in the range of $135-145 billion, narrowed from our prior outlook of $130-145 billion.” 1Q–3Q26 were $85.8B on that basis, which leaves about <b>$49–59B</b> for the fourth quarter. The Street line here is purchases of property and equipment only.</p>' },
        'EPS (diluted)':{ t:'Tax guided 15–17% for Q4', h:'<p>“Absent any changes to our tax landscape, we expect our fourth quarter 2026 tax rate to be between 15-17%.” The new Class C shares are paid as a stock dividend after January 19, 2027, so Q4 per-share figures are on today’s share count.</p>' },
        'Diluted shares':{ t:'Class C stock dividend in January 2027', h:'<p>The Board declared a one-time dividend of one non-voting Class C share for each Class A and Class B share, effective January 19, 2027; Meta expects the Class A price to “reflect the effect of a two-for-one stock split.” Share counts double from the 1Q27 report on.</p>' },
        'Reality Labs revenue':{ t:'RL losses guided to $18–19B for 2026, about $15B in 2027', h:'<p>“We now expect Reality Labs losses to decline compared to 2025 to a range of $18-19 billion.” 1Q–3Q26 losses were $12.8B, so Q4 implies $5.2–6.2B. For 2027: losses “to narrow next year to around $15 billion as we reallocate investment toward other priority areas, primarily AI.”</p>' },
      },
      us:ceSummitUs('4Q26'),
      debate:{ rows:null, synth:'' },
    },
    results:null, call:null },

  { q:'Q3 2026', status:'reported', date:'October 21, 2026 · after close (call 4:30pm ET)',
    setup:{
      source:'Bloomberg (BST) — BBG_CONSENSUS.txt, snapshot 2026-10-21 (the last before the print) · Summit DCF model — snapshot 2026-08-04, frozen (quarterly projections of revenue, operating income, capex and segment revenue) · guidance: Q2 2026 press release, 8-K Ex. 99.1', asOf:'2026-10-21',
      notes:{
        'Revenue':{ t:'Guided $61–64B; the Street sits in the top half, Summit above the top', h:'<p>Guide: “We expect third quarter 2026 total revenue to be in the range of $61-64 billion. Our guidance assumes foreign currency is an approximately 1% headwind to year-over-year total revenue growth” (8-K Ex. 99.1, Jul 29, 2026).</p><p>Street $63.3B is +24% on 3Q25 ($51.2B). Summit $64.7B (snapshot 2026-08-04) is above the top of the range.</p>' },
        'Gross profit':{ t:'No guide; cost of revenue carries the infrastructure ramp', h:'<p>Meta does not guide gross profit. Depreciation, data-center operating costs and third-party cloud run through cost of revenue, so the gross margin is where the capex build shows first. No Summit quarterly projection.</p>' },
        'Operating income':{ t:'The $10B legal charge: neither number here includes it', h:'<p>On Aug 26, 2026 Meta settled with state attorneys general over youth social-media claims (up to about $18B over ten years, pending court approval) and said it expects about <b>$10B of legal expense in Q3 2026</b>. It was not in the July expense guide of $165–169B. Source: press coverage of Meta’s announcement; there is no 8-K for it on EDGAR.</p><p>The Bloomberg operating-income consensus ($20.8B, above 3Q25’s $20.5B) does not move with it, so it reads as ex-charge; Summit ($22.1B) predates the settlement. If Meta books the charge in operating expenses, as it did with the $2.4B of legal charges in Q2, GAAP operating income lands near $10–11B. Score the print ex-charge as well as reported.</p>' },
        'EBITDA':{ t:'Bloomberg comparable basis', h:'<p>Bloomberg’s comparable EBITDA, which strips one-time items; on that basis the legal charge should be excluded. No Summit quarterly projection.</p>' },
        'EPS (diluted)':{ t:'A mixed consensus: $3.62 includes the charge, the operating line does not', h:'<p>The snapshot’s net income ($9.6B) does not tie to its own pre-tax income ($19.6B) less tax ($2.2B): the EPS consensus of $3.62 carries the legal charge for at least part of the brokers, while the operating-income line does not. It also shows a $10.0B restructuring estimate for the quarter. Compare the print with both a with-charge and an ex-charge EPS.</p><p>Tax guide: “we expect our tax rate for the remaining quarters of 2026 to be between 15-17%” (8-K Ex. 99.1).</p>' },
        'Operating cash flow':{ t:'Mostly unaffected by the charge this quarter', h:'<p>The settlement is paid over ten years, so the Q3 accrual is mostly non-cash in the quarter. No Summit quarterly projection.</p>' },
        'Capex':{ t:'Guided $130–145B for the year; this line is property and equipment only', h:'<p>Guide: “We anticipate 2026 capital expenditures, including principal payments on finance leases, to be in the range of $130-145 billion, narrowed from our prior outlook of $125-145 billion” (8-K Ex. 99.1). The Bloomberg line excludes finance-lease principal, so it runs a few percent below Meta’s stated figure. Street $41.0B; Summit $43.5B.</p>' },
        'D&A':{ t:'The build reaching the income statement', h:'<p>Street $8.1B against $6.4B in 2Q26: the servers and data centers placed in service in 2026 start depreciating. No Summit quarterly projection.</p>' },
        'Diluted shares':{ t:'Flat', h:'<p>About 2.57B. Buybacks have slowed as capex absorbs the cash flow.</p>' },
        'Family of Apps revenue':{ t:'Advertising plus other revenue', h:'<p>Family of Apps = advertising plus other revenue (WhatsApp paid messaging, Meta Verified and subscriptions). Street $62.8B; Summit $64.2B.</p>' },
        'Advertising revenue':{ t:'About 97% of revenue', h:'<p>Impressions × average price per ad (the two lines below). Street $61.9B; Summit $63.0B.</p>' },
        'Reality Labs revenue':{ t:'Small and seasonal', h:'<p>Street $0.52B against $0.47B in 3Q25; the holiday quarter (Q4) carries most of the year. Summit $0.47B. Management expects Reality Labs’ 2026 operating loss to be similar to 2025’s (Q4 2025 call).</p>' },
        'Daily Active People (DAP)':{ t:'Family-wide daily actives, in billions', h:'<p>Daily active people across Facebook, Instagram, Messenger, WhatsApp and Threads, period average. Street 3.66B against 3.60B in 2Q26.</p>' },
        'Ad impressions growth (YoY)':{ t:'This line is already a YoY rate', h:'<p>The cell shows the growth rate itself, so the growth chips do not apply. Street +12.3%, after +19% in 1Q26 and +14% in 2Q26.</p>' },
        'Avg price per ad (YoY)':{ t:'This line is already a YoY rate', h:'<p>The cell shows the growth rate itself. Street +11.2%, after +12% in each of 1Q26 and 2Q26. Price and impressions together decompose any revenue surprise.</p>' }
      },
      us:ceSummitUs('3Q26'),
      debate:{ rows:null, synth:'The one thing to resolve: <b>what the business earned ex the $10B legal charge</b>, against a consensus that mixes both bases — and whether the 2027 capex number finally arrives as a figure, with the cash flow and the debt to carry it.' }
    },
    // The print (8-K Ex. 99.1, Oct 21 2026).
    results:{
      basisNote:'<b>Basis.</b> Reported figures include the <b>$9.89B</b> charge for the state attorneys general agreement (general and administrative). Without it, operating income was <b>$22.9B</b> and diluted EPS <b>$7.40</b>. The Street’s operating income and EBITDA excluded the charge; its EPS ($3.62) included it.'
    },
    // The call (Oct 21 2026, 4:30pm ET). Quotes are verbatim from the call transcript (Quartr was unavailable; text
    // read from the published transcript and checked against the 8-K Ex. 99.1 for every figure). SAB's own notes
    // from the call are in js/themes-data/meta.js (Q3 2026 entries).
    call:{
      prepared:[
        { topic:'Revenue +26%; a $9.89B legal charge in the costs', theme:'Results',
          body:'Revenue <b>$64.6B (+26%)</b>, the same in constant currency; ad revenue <b>$63.1B (+26%)</b> on ad impressions <b>+10%</b> and average price per ad <b>+14%</b>. Total expenses <b>$51.6B (+68%)</b> include a <b>$9.89B</b> charge for the August 2026 agreement with the state attorneys general. Operating income <b>$13.0B</b> (20% margin); Li: without the charge it "would have increased 11% year over year." Tax rate <b>24%</b>, "primarily driven by the nondeductible portion of legal expenses." EPS <b>$3.83</b> ($7.40 without the charge). Capex <b>$34.9B</b>; free cash flow <b>−$2.1B</b>; cash <b>$82.4B</b>, debt <b>$83.7B</b>.' },
        { topic:'Muse: 10M people in six weeks, shopping the top use', theme:'Meta AI',
          body:'Zuckerberg: "In just a month and a half, <b>more than 10 million people</b> in the US and Canada have set up Muse personal agents." "About <b>25%</b> of people who have set up Muse use it on any given day." Shopping is the most common use, "with more than 25% of people who are using Muse engaging in this with an <b>average purchase size of over $200</b>." Next most common: personal productivity, connecting Muse to email and calendar.' },
        { topic:'How Muse will make money', theme:'Monetization',
          body:'Zuckerberg: "For most people, the product should be free, and we will build commerce tools so we get paid <b>a fee based on the transactions</b> that we help facilitate." People who want the most advanced models or extra tokens, and businesses that want more features, "subscribe directly and pay." On revenue per user: the Family of Apps revenue of today\'s Muse users "is <b>several hundreds of dollars annually</b>, and we expect that Muse will reach an even higher level over time."' },
        { topic:'Compute: more than 10x cheaper to serve within a year', theme:'Compute',
          body:'Zuckerberg: "we expect to improve its cost efficiency by <b>more than 10x in the next year</b>, which will enable it to be profitable once the revenue lines are at scale." Capacity is being built "to serve more than a billion people over the next few years." Spare inference goes to a new <b>Meta Enterprise</b> platform (model API, Muse Code), led by CJ Desai. Li: Muse serving costs will rise in total while unit cost falls.' },
        { topic:'Models: Muse Wonder and two open-weights releases', theme:'Meta AI',
          body:'Shipped <b>Muse Wonder</b>, the first frontier model, plus Muse Spark 1.2 and 1.3, Muse Code, Muse Voice and two open-weights models, <b>Muse Glimmer and Muse Spark Open</b>. Engagement per person in Meta AI "has more than doubled since April." Content-understanding models moved onto the Muse family, cutting per-unit processing cost "by more than 80%."' },
        { topic:'Reality Labs: priced for the software; losses to about $15B in 2027', theme:'Reality Labs',
          body:'RL revenue <b>$443M (−6%)</b>: lower Quest sales, partly offset by AI glasses. Zuckerberg: "we have priced our devices not to make a large profit on the hardware, but to build a large <b>software and superintelligence business</b> on top of them." New VR devices only "when we have major breakthroughs." RL "operating loss coming down to approximately <b>$15 billion next year</b> and trending towards profitability from there."' },
        { topic:'Engagement and the ad system', theme:'Ads',
          body:'Family daily active people <b>3.64B</b>; Instagram time per user at an all-time high, up double digits; Threads time per user <b>+20%</b>. Generative retrieval on Facebook Feed lifted conversions "nearly 2%"; GEM on more surfaces <b>+1.7%</b> off-site and <b>+9.6%</b> app-ad conversions; Andromeda <b>+1.4%</b>. Partnership ads "grew over 97% year over year and surpassed <b>$15 billion</b> in annual revenue run rate." About 10M advertisers used the gen-AI creative tools.' },
        { topic:'Other revenue and Meta One', theme:'Messaging',
          body:'FoA other revenue <b>$1.1B (+59%)</b>, "driven primarily by WhatsApp paid messaging and subscriptions revenue." Meta One, the single subscription for consumers, creators and businesses, "has surpassed <b>15 million subscriptions and trials</b> to date."' },
        { topic:'Guide: Q4 $73–76B; FY26 expenses $175–179B; capex $135–145B', theme:'Guidance',
          body:'Q4 revenue <b>$73–76B</b> (about 1% FX headwind). FY2026 expenses raised to <b>$175–179B</b> for the legal charge; "Excluding the Q3 legal charge, we continue to expect 2026 operating income to be above 2025 operating income." RL losses <b>$18–19B</b>. Capex <b>$135–145B</b>, "narrowed from our prior outlook of $130 billion to $145 billion." Q4 tax 15–17%. 2027: no revenue outlook, but the AI investments "position us to sustain <b>strong overall revenue growth throughout 2027</b>." Youth-related trials are "scheduled in the coming months in the United States."' },
        { topic:'New non-voting Class C stock', theme:'Capital',
          body:'Li: "For each existing share held, stockholders will receive 1 share of the new nonvoting stock. Effectively resulting in a <b>2-for-1 stock split</b>. We expect trading to begin in late January 2027."' },
      ],
      qanda:[
        { q:'What limits Muse growth; the enterprise offering', analyst:'Brian Nowak · Morgan Stanley', theme:'Meta AI',
          qFull:'What are the constraints on Muse user growth (capabilities, model efficiency, capacity), and what is the vision for the Meta Enterprise offering?',
          a:'<b>Mark Zuckerberg:</b> "because this is a <b>compute intensive service</b> to run, we have not launched it globally yet." Near-term enterprise offering: "the model API and Muse code, and we have business agents."<br><b>Susan Li:</b> the hope is "a new <b>diversified recurring revenue stream</b>" across subscriptions, usage-based API and messaging.' },
        { q:'Agentic commerce friction; the Class C stock and capital', analyst:'Eric Sheridan · Goldman Sachs', theme:'Capital',
          qFull:'How does Meta handle businesses and aggregators that do not want agents on their platforms, and how does the new share class fit its sources of capital?',
          a:'<b>Mark Zuckerberg:</b> "we have been very positively surprised by how quickly I think a huge amount of businesses have wanted to know... how to make it so that Muse can use their services."<br><b>Susan Li:</b> the market moves toward "more <b>permissioned structured interactions</b>"; a personal agent protocol with Sierra, Walmart, Stripe and Shopify. The Class C stock is "usable for, you know, capital raising employee compensation acquisitions"; "<b>We do not have any specific financing plans</b> to announce at this time."' },
        { q:'Agent-to-agent; any frame for 2027 expenses and capex', analyst:'Douglas Anmuth · J.P. Morgan', theme:'Capex',
          qFull:'What do permissioned, agent-to-agent transactions unlock, and can any of the past frameworks be applied to 2027 expenses and capex?',
          a:'<b>Susan Li:</b> "we are <b>quite early in developing our budget</b> and capacity plans for next year"; "we do not have anything more specific or quantitative to share until we get to the <b>Q4 call</b>, which is typically when we share guidance for the next year."' },
        { q:'Room left in the ad system; what drives 2027 revenue', analyst:'Justin Post · Bank of America', theme:'Ads',
          qFull:'How much can the new models still improve the ad business, and does the strong 2027 revenue growth include new AI revenue?',
          a:'<b>Susan Li:</b> three levers: the ranking and recommendations pipeline, LLM research bets, and gen-AI tools for advertisers — "<b>meaningful runway</b> to grow our core business throughout 2027." New AI businesses "can begin contributing <b>incremental revenue in 2027</b>, but more importantly, can scale meaningfully over time."' },
        { q:'Is Muse now the center of the company; Muse for small business', analyst:'Mark Shmulik · Bernstein', theme:'Meta AI',
          qFull:'After Connect, is the business reorienting around Muse, and what does it take to serve small businesses?',
          a:'<b>Mark Zuckerberg:</b> personal superintelligence has been the North Star for more than a year; "these are long term bets."<br><b>Susan Li:</b> Muse for small business launched in late September as "a set of new skills and connectors inside the existing Muse app" (Shopify, QuickBooks, Canva); Meta counts "<b>500 million</b> self identified small businesses."' },
        { q:'What Muse costs per user, and how the cost comes down', analyst:'Ross Sandler · Barclays', theme:'Compute',
          qFull:'What does Muse cost to serve per user today, and what brings the cost curve down?',
          a:'<b>Susan Li:</b> "we do not have sort of <b>specific numbers to share</b> around the cost structure of Muse today, but, of course, it is, as Mark said, pretty compute expensive." Levers: off-peak or spare capacity, smaller models, inference efficiency; longer term, fewer tokens per task.' },
        { q:'Monetize Muse sooner than usual? Does commerce include travel?', analyst:'Mark Mahaney · Evercore ISI', theme:'Monetization',
          qFull:'Given the cost, does Muse follow the usual playbook (users first, monetization later) or move faster, and does the commerce data point include travel?',
          a:'<b>Mark Zuckerberg:</b> "I think that we are going to work on <b>monetization somewhat sooner</b> on this than our normal playbook"; the commerce figure "does include travel too." On cost: the same intelligence "at a <b>fraction of the cost</b> in a smaller model a year from today."' },
      ],
      highlights:[
        { tag:'watch', band:'lead', open:'The 2027 capex and expense guide, promised for the Q4 call.',
          head:'2027 capex: no number again — "quite early", guidance on the Q4 call',
          detail:'<p>Anmuth asked for any frame for 2027 (maximizing compute in 2026–27, a larger dollar increase, growing operating income). Li: "we are quite early in developing our budget and capacity plans for next year"; guidance comes on the Q4 call. The 2026 range narrowed to $135–145B.</p>' },
        { tag:'thesis', band:'lead', open:'First disclosed Muse revenue (commerce fees, subscriptions, enterprise) and evidence of the 10x cost target.',
          head:'Muse has a business model on paper: commerce fees, subscriptions, enterprise — and monetization "somewhat sooner" than the usual playbook',
          detail:'<p>No revenue disclosed. Li: new AI businesses "can begin contributing incremental revenue in 2027." Meta One at 15M subscriptions and trials is the only paid figure given.</p>' },
        { tag:'watch', band:'context', open:'The rest of the up-to-$18.59B agreement, and the youth trials scheduled in the coming months.',
          head:'The legal charge: $9.89B booked in Q3 for an agreement of up to about $18.59B',
          detail:'<p>The agreement with 52 attorneys general (teen mental health and social media) provides for payments of up to about $18.59B (8-K). The nondeductible part pushed the tax rate to 24% (17% without it). Li: "we continue to see scrutiny on youth related issues in several markets, and have a number of youth related trials scheduled in the coming months in the United States."</p>' },
        { tag:'curious', band:'context',
          head:'The Class C stock is a funding tool, not only a split',
          detail:'<p>Li to Sheridan: the non-voting class is "usable for, you know, capital raising employee compensation acquisitions, other general corporate purposes while preserving the voting power of existing class a and b shareholders." No financing plans announced.</p>' },
        { tag:'logged', band:'context',
          head:'The open-source return shipped: Muse Glimmer and Muse Spark Open',
          detail:'<p>The Q2 call promised a return to open models "at some point soon"; two open-weights models shipped in the quarter, alongside Muse Wonder (the first frontier model). Larger models are already in the works.</p>' },
        { tag:'thesis', band:'context',
          head:'Muse models now run Meta\'s own content understanding, at over 80% lower unit cost',
          detail:'<p>Li: the content-understanding models moved onto the Muse family "are outperforming our prior production models and are reducing per unit content processing costs by more than 80% across Instagram threads, Facebook, and ads."</p>' },
        { tag:'logged', band:'context',
          head:'Headcount 66,775: −12% QoQ, −15% YoY after the May reduction',
          detail:'<p>Headcount figure from the 8-K. Also on the call: Threads passed X in monthly actives (Zuckerberg); Edits passed 50M actives; the Muse Charm device went from concept to shipping in under a year.</p>' },
      ],
      newQuestions:[
        { n:'2027 capex and expenses on the Q4 call: how big, and how is it funded (cash flow, debt, the new Class C stock)?', theme:'2027 capex', landed:{ q:'Q4 2026', rank:1 } },
        { n:'Muse: first disclosed revenue (commerce fees, subscriptions, enterprise) — and does the >10x compute-efficiency target show up?', theme:'Muse personal agent', landed:{ q:'Q4 2026', rank:2 } },
        { n:'Does the ad engine land the $73–76B Q4 guide with impressions slowing to +10%?', theme:'Ad impressions and price per ad', landed:{ q:'Q4 2026', rank:3 } },
        { n:'Legal: is the $9.89B the extent of it, with the youth trials scheduled in the coming months?', theme:'Youth litigation and the AG settlement', landed:{ q:'Q4 2026', rank:4 } },
        { n:'Reality Labs: do FY2026 losses land at $18–19B, and does Muse on the glasses lift paid subscriptions toward the ~$15B 2027 loss?', theme:'RL losses in 2026', landed:{ q:'Q4 2026', rank:5 } },
      ],
    } },

  // ── REPORTED: Q2 2026 (quarter ended Jun 2026; reported Jul 29, 2026 AMC) ──
  //
  // CONSENSUS PROVENANCE — BBG_CONSENSUS.txt, `data_as_of` 2026-05-01: the last
  // snapshot before the print, so its `fq+1` ("2026 Q2 (Fwd)") IS this quarter.
  // YoY = that row's `fq-3` (Q2 2025, a reported actual). Summit = the model's
  // frozen per-quarter projections (2026-05-22 vintage, js/results-data/meta.js).
  { q:'Q2 2026', status:'reported', date:'July 29, 2026 · after close (call 4:30pm ET)',
    setup:{
      source:'Bloomberg (BST) — BBG_CONSENSUS.txt snapshot archive · Summit — frozen 2026-05-22 vintage', asOf:'2026-05-01',
      notes:{
        'Revenue':{ t:'Guided $58–61B — and the Street sits at the top of it', h:'<p>Management guided Q2 2026 total revenue to <b>$58–61B</b> with FX an ~2% tailwind; consensus ($60.0B) sits at the top of the range. Meta has landed in the top half of its guide (or above it) in nearly every print since 1Q23.</p><p>Comps toughen vs Q2 2025 (+22%); the drivers to watch are price-per-ad and impressions, both already YoY lines in the custom KPIs below.</p>' },
        'Operating income':{ t:'Not guided directly — read it through the expense guide', h:'<p>Meta guides FY total expenses (<b>$162–169B</b> for 2026), not operating income. Management reiterated FY26 operating income <b>above 2025</b> — the swing factors are the capex-driven depreciation ramp and AI-talent comp.</p><p>⚠ The Summit number here ($29.4B) is the <b>2026-05-22 re-rated vintage</b>, which lifted FY26 op income $92→$117B with no print in between — flagged for the model owner; treat it as the model\'s live view, not a calibrated forecast.</p>' },
        'EPS (diluted)':{ t:'Read EPS ex the tax items', h:'<p>Recent EPS is distorted by discrete tax items: 3Q25 carried a <b>−$15.93B</b> non-cash OBBBA deferred-tax charge (GAAP EPS $1.05), and 1Q26 the mirror-image <b>+$8.03B</b> benefit (GAAP $10.44, ex-benefit ~$7.31). Guided tax rate 13–16% for the rest of 2026 — read the line ex the discrete items, and expect the YoY chip to be noisy for two more quarters.</p>' },
        'Capex':{ t:'Basis note — this line is PP&E-only', h:'<p>The archive line is <code>CF_PURCHASE_OF_FIXED_PROD_ASSETS</code> — purchases of property & equipment, sign-flipped positive. <b>Meta states capex including principal payments on finance leases</b>, ~2–4% higher; the FY26 guide (<b>$125–145B</b>, raised from $115–135B at the Q1 print) is on Meta\'s stated basis. Same basis gap in the Summit model\'s capex line.</p>' },
        'Family of Apps revenue':{ t:'Advertising + other revenue', h:'<p>FoA = advertising (~98%) + WhatsApp Business paid messaging / Meta Verified. The custom KPI set is the file\'s own (kpi1–kpi4): FoA revenue · DAP · impressions growth · price-per-ad growth.</p>' },
        'Daily Active People (DAP)':{ t:'Family-wide daily actives, in billions', h:'<p>Daily Active People across the Family of Apps (Facebook, Instagram, WhatsApp, Messenger, Threads), period average. ~3.6B — approaching half of humanity; the growth left is engagement depth and monetization per person, not user count.</p>' },
        'Ad impressions growth (YoY)':{ t:'This line IS a YoY rate', h:'<p>The file carries ad impressions delivered as a <b>YoY % change</b>, not a level — so the cell shows the rate itself and the growth lens does not apply (a growth of a growth means nothing). Impressions + price-per-ad together decompose ad revenue growth.</p>' },
        'Avg price per ad (YoY)':{ t:'This line IS a YoY rate', h:'<p>Average price per ad as a <b>YoY % change</b>. The ad engine\'s quality lever: +12% in 1Q26 (from +6% in 4Q25) on AI ranking gains (GEM, Lattice, Adaptive Ranking). The growth lens does not apply to a rate line.</p>' }
      },
      us:{ 'Revenue':{v:59.5}, 'Operating income':{v:29.4}, 'Capex':{v:36.4}, 'Family of Apps revenue':{v:59.1} },
      debate:{ rows:null, synth:'The one thing to resolve: does the AI investment start showing <b>monetization / ROIC signposts</b> — or does another capex raise (plus the hinted 2027 step-up) arrive with the payoff still described in adjectives?' }
    },
    // ── SINGLE FILL (v2.8): results + call landed together, 2026-07-30, from the Jul 29 8-K
    // (Ex. 99.1) + the earnings-call transcript (5:00pm ET; see docs/calls/META-latest.md).
    results:{
      headline:'The engine beat and the optics missed: +28% revenue against an EPS bar that $3.6B of charges made unbeatable — while the capex floor rose again and quarterly FCF went to ~zero.',
      summary:{
        paras:[
          { p:'<b>Q2 2026 was a clean beat wearing a dirty print.</b> Revenue accelerated to <b>$60.8B (+28%)</b>, grazing the top of the $58–61B guide — but EPS printed <b>$6.18 against a ~$7.17 bar</b> and operating income FELL 8%, entirely because the quarter swallowed <b>$2.4B of legal-proceedings charges and $1.2B of severance</b> from the May headcount reduction. Ex those items, operating income grew ~9%. The tape sold the optics (~−9% <span class="ce-gl" data-def="Trading after the 4pm ET close, on lower volume — moves often partially retrace by the next regular session.">after hours</span>), but the miss was manufactured by charges the desk already had flagged as a live risk — the legal red-line fired, the operating engine did not.',
            more:'The reading order for this print: score revenue and the ad KPIs against the frozen numbers (clean beat), score EPS/op income only ex-charges (roughly in line), and treat the legal charge itself as the resolution of Watch theme #5 — the "may result in a material loss" language stopped being hypothetical this quarter.' },
          { p:'<b>The ad engine got its clearest AI attribution yet.</b> Ad revenue grew +27% (+26% <span class="ce-gl" data-def="Growth stripped of currency swings — last year re-priced at this year\'s exchange rates, so the number reflects real volume and price.">constant-currency</span>) on impressions +14% and price-per-ad +12% — and for the first time management put system-level numbers on the AI stack: the new <b>Meta Generative Recommender</b> (LLMs reasoning about ad content and user preferences together, replacing per-ad scoring) drove <b>+8.3% ad clicks and +15.7% conversions on Facebook</b>, and Advantage+ end-to-end reached a <b>$75B annual <span class="ce-gl" data-def="The current quarter\'s (or month\'s) pace annualized — not trailing-twelve-month revenue.">run-rate</span></b>.',
            moreLabel:'＋ more — the attribution chain, engagement included',
            more:{ body:'The engagement side compounds the same way: the inventory the ads auction sells is itself increasingly AI-manufactured.',
              nodes:[
                { t:'Recommendations — the LLM turn', body:'Every public Instagram Reels/feed post now runs through an LLM; the largest single Reels ranking release to date (+15bps Instagram sessions); over half of recommended content is now <b>less than a day old</b> (2x a year ago). Instagram time spent grew double digits; Facebook video +9% global / +10% US.' },
                { t:'Disclosure cluster', body:'<b>Instagram passed 2B daily actives</b> (announced on this call), Threads 500M+ monthly, DAP 3.6B. User-control surfaces (Your Algo, Shape Your Feed) show 80%+ retention among users who touch them — recommendations as a product, not just a ranking.' } ] } },
          { p:'<b>The monetization question finally got surfaces with numbers attached.</b> Four quarters of "milestones, not dollars" gave way to shipped product: <b>Meta Business Agents</b> went global on WhatsApp/Messenger with <b>1M+ businesses using them weekly</b> (Movida resolves 85% of booking conversations with no human), a <b>high-intelligence Model API</b> launched (Muse Spark on OpenRouter), <b>Meta One</b> subscriptions rolled out, and Mark said Meta is fielding <b>compute offers "at a significant premium"</b> — with the doctrine that "there will continue to be a significantly higher margin on selling intelligence rather than selling compute." Still no AI revenue line — but the answer moved from adjectives to products.',
            more:'Zuckerberg\'s framing of the end state: business agents evolve toward "a business-in-a-box service," priced like the ad system — "businesses only pay us when we achieve results." That is the first coherent description of how the AI spend becomes a revenue MODEL rather than a cost line; what it still lacks is a disclosed dollar figure, which is exactly what next quarter\'s Watch List hunts.' },
          { p:'<b>The bill kept rising — and the funding doctrine is now explicit.</b> A record <b>$31.1B of capex in one quarter</b> (1H26: $50.9B) took quarterly <span class="ce-gl" data-def="Operating cash flow minus capital expenditure — the cash the business keeps after paying for its own growth.">free cash flow</span> to <b>$784M</b>; the FY26 capex guide <b>narrowed upward to $130–145B</b> (the floor rose $5B); total debt stands at $83.7B; and a <b>1GW El Paso data-center venture with BlackRock</b> was announced the day before the print. Susan, on capital: "a greater mix of debt as we work to bring down our cost of capital." And 2027 capex remains — for the third consecutive ask — an adjective: planning is "highly dynamic," near-term capacity "more valuable than long-term."',
            more:{ body:'The demand-side defense was more specific than prior quarters: "we are today and expect to be in the foreseeable future demand-constrained — that includes our core business, where we still have numerous ROI-positive places we would put compute toward if we had it." The 2028+ stance is flexibility: land and power now, chip decisions later.',
              nodes:[ { t:'Why the floor moved', body:'The low end rose $125→$130B with the range top unchanged — a narrowing that signals the year is landing in the upper half of the old range, not a re-basing like Q1\'s $10B raise. The severance and legal charges also pushed the FY expense guide floor up ($165–169B).' } ] } },
          { p:'<b>Reality Labs actually turned.</b> RL revenue grew <b>+16%</b> (first meaningful growth since the glasses pivot) on AI-glasses strength that management called "exceeding our expectations" — the new Meta-brand line with EssilorLuxottica ships with Muse Spark onboard — while the operating loss of <b>$4.6B came in ~$450M smaller than the Street modeled</b>. Loss-peak framing intact, next catalyst Connect (Sep 23).' }
        ]
      },
      notes:{
        'Revenue':{ t:'Top of the guide, past the Street', h:'<p><b>$60.8B (+28%)</b> vs $60.0B modeled — grazing the top of the $58–61B guide, the eleventh straight print in the guide\'s upper half. FoA ad revenue $59.4B (+27%; +26% cc) on impressions +14% and price/ad +12%; FoA <b>other</b> revenue crossed $1B for the first time (+73%) on paid messaging + Meta Verified.</p>' },
        'Operating income':{ t:'⚠ The dirtiest print in the window — read it ex-charges', h:'<p>$18.8B (−8%, 31% margin) vs $21.3B modeled — but the quarter carries <b>$2.4B of legal-proceedings charges + $1.18B of severance</b> (May headcount reduction). Ex those items ~$22.4B (<b>+9%</b>) — roughly on the Street\'s line. Total expenses $42.0B (+55%, +43% ex-items). FY26 expense guide floor raised to <b>$165–169B</b> to absorb the charges.</p>' },
        'EPS (diluted)':{ t:'⚠ The miss is the charges', h:'<p>$6.18 vs $7.16 modeled (LSEG had $7.17) — the third straight quarter where the EPS optics are one-time items: after 3Q25\'s tax charge and 1Q26\'s benefit, 2Q26 carries $3.58B pre-tax of legal + severance. Ex-charges, roughly in line (derived). Tax rate normalized at 16%; guided <b>15–17%</b> for the rest of 2026 (raised from 13–16%).</p>' },
        'Capex':{ t:'Record quarter — and the floor moved up', h:'<p>$30.1B on this (PP&E-only) line; <b>$31.1B as Meta states it</b> (incl. finance leases) — a record, vs $17.0B a year ago; 1H26 $50.9B. FY26 guide <b>narrowed to $130–145B</b> (floor +$5B). Funding: quarterly FCF $784M, total debt $83.7B, and the <b>BlackRock 1GW El Paso venture</b> under Meta Compute.</p>' },
        'Operating cash flow':{ t:'The squeeze in one line', h:'<p>OCF $31.9B against $31.1B of stated capex → quarterly FCF <b>$784M</b>. The cash machine still covers the build — barely; the funding mix (debt + partnerships) is now doing the rest by explicit doctrine.</p>' },
        'Family of Apps revenue':{ t:'$60.4B (+28%)', h:'<p>FoA revenue $60.4B vs $59.6B modeled; segment op income $23.4B carries the legal charges (they land in FoA). The other-revenue line crossing $1B (+73%) is the quiet compounder.</p>' },
        'EBITDA':{ t:'No Q2 actual in the archive yet', h:'<p>The 2026-07-29 export carries no reported Q2 actual for this line (normal load lag, not corruption) — scoreable when the actual returns in the next snapshot.</p>' },
        'Gross profit':{ t:'No Q2 actual in the archive yet', h:'<p>Same as EBITDA — the 07-29 export had not loaded this actual yet; nothing to score until the next snapshot.</p>' },
        'Ad impressions growth (YoY)':{ t:'+14% — the volume lever', h:'<p>Printed +14% vs +13.2% modeled (this line is itself a YoY rate). Volume decelerating gently from Q1\'s +19% as comps toughen — while the price lever holds.</p>' },
        'Avg price per ad (YoY)':{ t:'+12% — the quality lever held', h:'<p>+12% vs +11.5% modeled, flat with Q1\'s +12% despite tougher comps — the Generative Recommender / GEM attribution (+8.3% FB clicks, +15.7% conversions) says the pricing power is model-driven, not auction-scarcity-driven.</p>' }
      },
      watch:{ 'Capex':1, 'Revenue':3, 'Ad impressions growth (YoY)':3, 'Avg price per ad (YoY)':3, 'Operating income':5, 'EPS (diluted)':5 },
      thesisCheck:[
        { line:'Another capex raise with 2027 still unquantified and no monetization signpost', tripped:false, note:'Two clauses fired — the floor rose to $130–145B and 2027 stayed an adjective (third ask: "highly dynamic") — but the monetization-signpost clause finally got answered with shipped surfaces (Model API, Meta One, Business Agents at 1M businesses/week, compute offers at a premium). Dollars still undisclosed; the rank-1 hook stays open, but the red-line as written did not fully trip.' },
        { line:'A trial or regulatory action lands as a material loss', tripped:true, note:'⚑ $2.4B of legal-proceedings charges LANDED in the quarter — the "may ultimately result in a material loss" language stopped being hypothetical. Youth-related US trials remain scheduled, same language repeated; the FY expense floor absorbed the hit.' },
        { line:'Ad revenue decelerates sharply below ~20% as comps toughen', tripped:false, note:'+27% ad revenue (+26% cc) against the cycle\'s toughest comp; price/ad held at +12% with the first system-level AI attribution (Generative Recommender +8.3% clicks / +15.7% conversions).' },
        { line:'Muse / MSL stays engagement-only with no monetization path', tripped:false, note:'The path shipped: Model API (Muse Spark on OpenRouter), Meta One subscriptions, Business Agents global with 1M+ businesses weekly, Meta AI daily interactions +60% since the Muse Spark integration. Revenue disclosure: still none.' },
        { line:'RL losses grow rather than peak, or the glasses ramp stalls', tripped:false, note:'The opposite: RL revenue +16% (glasses "exceeding our expectations", new Meta-brand line with Muse Spark onboard), loss $4.6B ~$450M smaller than the Street\'s $5.1B. Peak framing intact; Connect Sep 23.' },
      ],
      intoCall:[
        '💸 <b>The charges</b> — is $2.4B the extent of the legal exposure, or the first installment? (The release absorbed it into the expense guide floor.)',
        '🏗️ <b>The floor</b> — $130–145B: landing in the upper half, or re-basing again? And does 2027 finally get a number? (Watch #1, third ask.)',
        '🤖 <b>The surfaces</b> — Business Agents / Model API / Meta One: any dollar disclosure, pricing, or adoption curve? (Watch #2.)',
        '🥽 <b>The RL turn</b> — +16% with a smaller loss: is the glasses ramp finally big enough to bend the segment? (Watch #4.)',
      ],
      priceReaction:'−7.95% next-day close (Jul 30: $539.03 vs $585.61) — the tape sold the EPS optics + the higher capex floor; the after-hours ~−9% move mostly held into the close.' },
    call:{
      // Q2 2026: quotes as reproduced by the earnings-day transcript coverage (docs/calls/META-latest.md); swap for the
      // IR verbatim when it lands.
      prepared:[
        { topic:'Revenue +28% at the top of the guide; charges sink EPS', theme:'Results',
          body:'Revenue <b>$60.8B (+28%)</b>, at the top of the $58–61B guide. Operating income <b>$18.8B (−8%, 31% margin)</b> carried <b>$2.40B</b> of legal-proceedings charges and <b>$1.18B</b> of severance from the May headcount reduction; EPS <b>$6.18</b>. Capex a record <b>$31.1B</b>, leaving quarterly free cash flow of <b>$784M</b>.' },
        { topic:'AI now lifts every part of the core business', theme:'Ads',
          body:'Zuckerberg: "We are now at a point where our investments in AI are <b>accelerating every major part of our core business</b>." On ads: "On a dollar basis, our ads business is reporting faster year-over-year revenue growth than any other company\'s reported ad business."' },
        { topic:'Generative Recommender: +8.3% clicks, +15.7% conversions', theme:'Ads',
          body:'Li: Meta Generative Recommender is "a paradigm shift in how our ad system works… using LLMs to reason about ad content and user preferences together"; with GEM and sequence learning, "an <b>8.3% increase in ad clicks</b> and a <b>15.7% uplift in conversions</b> on Facebook." Advantage+ end-to-end passed a <b>$75B</b> annual run-rate.' },
        { topic:'Engagement: Instagram 2B daily actives, fresher content', theme:'Engagement',
          body:'Instagram crossed <b>2B daily actives</b> and Threads <b>500M+</b> monthly. Facebook video time +9% globally. "Over half of all recommended content is now <b>less than one day old</b>, more than double from a year ago."' },
        { topic:'Muse Spark 1.1, Muse Image and Meta AI usage', theme:'Meta AI',
          body:'Shipped Muse Spark 1.1 ("a strong agentic coding model") and Muse Image; since Meta AI moved to Muse Spark, "a <b>60% increase</b> in the number of people interacting with the assistant each day." New surfaces: Meta One subscriptions and a model API (Muse Spark on OpenRouter).' },
        { topic:'Business Agents go global', theme:'Messaging',
          body:'Business Agents on WhatsApp and Messenger: "more than <b>1 million businesses</b> using them to talk to their customers or complete sales every week"; monetized like ads — "businesses only pay us when we achieve results."' },
        { topic:'Glasses sales exceed expectations; RL revenue +16%', theme:'Reality Labs',
          body:'Glasses are "one of the fastest-growing consumer electronics of all time"; the new Meta-brand line with EssilorLuxottica is the first to ship with Muse Spark, and "early sales have been strong, <b>exceeding our expectations</b>." RL revenue <b>$431M (+16%)</b>, operating loss <b>$4.6B</b>.' },
        { topic:'Guide: Q3 $61–64B; capex floor raised to $130–145B', theme:'Guidance',
          body:'Q3 revenue <b>$61–64B</b> (about 1% FX headwind); FY26 expenses <b>$165–169B</b> (floor raised for the charges); FY26 capex <b>$130–145B</b>; tax <b>15–17%</b>. Funding: "a greater mix of debt as we work to bring down our cost of capital," plus partners (BlackRock 1GW El Paso venture).' },
      ],
      qanda:[
        { q:'Which AI revenue line scales first, and 2027 capex', analyst:'Brian Nowak · Morgan Stanley', theme:'Capex',
          qFull:'Which of the new AI revenue lines scales first, and what is the early view on 2027 capex?',
          a:'<b>Mark Zuckerberg:</b> "there will continue to be a <b>significantly higher margin on selling intelligence</b> rather than selling compute directly."<br><b>Susan Li:</b> "infrastructure planning remains highly dynamic… we\'re still working through what our capacity needs are going to be"; "<b>near-term capacity is more valuable</b> than long-term capacity."' },
        { q:'Enterprise go-to-market and how capital is sourced', analyst:'Eric Sheridan · Goldman Sachs', theme:'Capital',
          qFull:'Does Meta have the enterprise muscle to sell business agents, and how will it source capital for the build-out?',
          a:'<b>Mark Zuckerberg:</b> "we will get paid when we deliver results"; "a <b>somewhat different muscle</b> than we have historically had… will share more soon."<br><b>Susan Li:</b> operating cash flow first, then the debt mix — "<b>cost-efficient, long-duration sources of capital</b>."' },
        { q:'Will consumers adopt personal agents?', analyst:'Mark Shmulik · Bernstein', theme:'Meta AI',
          qFull:'How quickly will consumers adopt personal agents, and what has to be true for it?',
          a:'<b>Mark Zuckerberg:</b> "it\'s extremely unlikely… five years from now that you don\'t have <b>billions of people with a personal agent</b>"; "it needs to just work."' },
        { q:'Headroom in LLM-based recommendations; selling compute', analyst:'Doug Anmuth · J.P. Morgan', theme:'Ads',
          qFull:'How much headroom is left in LLM-based recommendations, and would Meta sell compute given the premiums offered?',
          a:'<b>Susan Li:</b> "further headroom to continue improving recommendations over the rest of the year and into 2027."<br><b>Mark Zuckerberg:</b> "there\'s just <b>nowhere near enough compute</b> for all the demand"; "it would be foolish to basically just sell all of the compute and take a short-term profit."' },
        { q:'The lab, a year in', analyst:'Justin Post · Bank of America', theme:'Meta AI',
          qFull:'A year after setting up the superintelligence lab, how is the model trajectory?',
          a:'<b>Mark Zuckerberg:</b> "quite happy with the trajectory"; larger, more advanced models are "in the process of scaling."' },
        { q:'Why compete at the efficient end, and open source', analyst:'Ross Sandler · Barclays', theme:'Meta AI',
          qFull:'Why build smaller, efficient models, and will Meta release open-source models again?',
          a:'<b>Mark Zuckerberg:</b> serve "the vast majority of prompts from simpler and more efficient models"; "<b>we expect that we will get back to releasing some open source models at some point soon</b>."' },
        { q:'Relying on open-weight models; what "maximize 2026–27 capacity" means', analyst:'Ken Gawrelski · Wells Fargo', theme:'Capex',
          qFull:'Could Meta rely on open-weight models, and what does "maximizing 2026 and 2027 capacity" mean for spending?',
          a:'<b>Mark Zuckerberg:</b> "right now, the open-source models are not as strong as the frontier models, so no"; "I get that this is a big investment and it\'s a big bet… my personal bet is that the people who invest in this are going to be rewarded."<br><b>Susan Li:</b> "we are today and expect to be in the foreseeable future <b>demand-constrained</b> — that includes our core business."' },
      ],
      take:'The monetization answer finally moved from adjectives to shipped products — while the bill\'s funding doctrine (debt + partners, 2027 TBD) was said out loud for the first time.',
      highlights:[
        { tag:'watch', band:'lead', open:'2027 capex: a number or a fourth adjective? And does the $130B floor hold?',
          head:'The capex floor rose again ($130–145B) with a stated funding doctrine — debt mix + partnerships (BlackRock 1GW) — and 2027 still "highly dynamic"',
          detail:'<p>Nowak and Sheridan both pressed 2027: Susan gave process ("infrastructure planning remains highly dynamic… near-term capacity is more valuable than long-term capacity"), not a number — the third consecutive quarter. The new content was the <b>funding doctrine</b>: strong operating cash flow first, then "a greater mix of debt as we work to bring down our cost of capital," now broadened to partnerships — the <b>BlackRock 1GW El Paso venture</b> announced the day before, under Meta Compute.</p><p><b>Demand defense, more specific than before:</b> "we are today and expect to be in the foreseeable future <b>demand-constrained</b> — that includes our core business, where we still have numerous ROI-positive places we would put compute toward if we had it." 2028+: land + power now, chip decisions later.</p>' },
        { tag:'thesis', band:'lead', open:'Do the surfaces get dollars attached — API pricing/volume, Meta One subs, Business Agent economics?',
          head:'The ROIC answer became products: Business Agents (1M businesses/week) · Model API · Meta One · compute at a premium — "higher margin on selling intelligence rather than selling compute"',
          detail:'<p>Nowak\'s which-scales-first question got Mark\'s doctrine: <b>"there will continue to be a significantly higher margin on selling intelligence rather than selling compute directly"</b> — plus "meaningful growth in all of these areas" and "more to share soon."</p><p>The shipped stack: <b>Business Agents</b> global on WhatsApp/Messenger, <b>1M+ businesses weekly</b> (Movida: 85% of booking conversations resolved with no human), an enterprise <b>Business Agent Platform</b>, the <b>Model API</b> (Muse Spark on OpenRouter, "competitive price"), and <b>Meta One</b> subscriptions. End state per Mark: "a business-in-a-box service," paid like ads — "businesses only pay us when we achieve results."</p><p><b>Open:</b> not one of these carries a disclosed dollar figure yet.</p>' },
        { tag:'tone', band:'context',
          head:'The candor pair: charges absorbed into the guide without spin, and the compute trade-off argued from first principles',
          detail:'<p>Susan walked the $2.4B legal + $1.2B severance through the P&L unprompted and raised the expense floor to absorb them — no adjusted-EPS theater in the release. Mark, on selling compute: "it would be foolish to basically just sell all of the compute and take a short-term profit… when you have the opportunity to build intelligence on top of it" — an argument against the easy near-term revenue his own bulls keep asking for.</p>' },
        { tag:'thesis', band:'context',
          head:'The ad-AI attribution cluster: Generative Recommender +8.3% clicks / +15.7% conversions · Advantage+ $75B run-rate · price/ad +12% into the toughest comp',
          detail:'<p>The first quarter where the AI→ads chain is quantified end-to-end: LLM-based ad retrieval (the "paradigm shift" from per-ad scoring), GEM + sequence learning, 9M small businesses on AI creative tools (image-gen adoption doubled in the quarter). Settled strength — the cash engine\'s AI story no longer needs asserting.</p>' },
        { tag:'thesis', band:'context',
          head:'Reality Labs turned: +16% revenue, loss ~$450M smaller than the Street, glasses "exceeding our expectations"',
          detail:'<p>The new Meta-brand glasses line with EssilorLuxottica (incl. the Kylie Jenner style) is the first to ship with Muse Spark onboard. Quest still shrinking; the wearables pivot is carrying the segment. Loss-peak framing intact; next catalyst Connect, Sep 23.</p>' },
        { tag:'curious', band:'context',
          head:'Instagram crossed 2B daily actives; Threads 500M+ monthly — the engagement disclosure cluster',
          detail:'<p>New rungs on the inventory machine: Instagram <b>2B DAU</b> (announced on this call), Threads <b>500M+ MAU</b>, DAP 3.6B, Facebook video +9% global / +10% US, over half of recommended content now <1 day old (2x YoY). User-control surfaces (Your Algo, Shape Your Feed) retain 80%+ of users who touch them.</p>' },
        { tag:'watch', band:'logged', open:'A dated promise: open-source models return "at some point soon" — score it next call.',
          head:'The open-source stance softened: "we expect that we will get back to releasing some open source models at some point soon"',
          detail:'<p>Sandler and Gawrelski both probed the closed pivot; Mark reframed it as sequencing, not doctrine ("I just wanted to make sure the MSL team was uninhibited") and committed to a mixed open/closed future. Alongside: larger Muse models "in the process of scaling." Two shippable promises on the record.</p>' },
        { tag:'curious', band:'logged',
          head:'Meta is fielding compute offers "at a significant premium over what we paid for it"',
          detail:'<p>Said twice, unprompted and in Q&A (Anmuth). The scarcity said out loud: "there\'s just nowhere near enough compute for all the demand." Read with Susan\'s demand-constrained framing, it is the first market-price evidence for the infrastructure\'s option value — without a single disclosed transaction.</p>' },
        { tag:'logged', band:'logged',
          head:'Call colour: WhatsApp peaked at 30M messages/second in the World Cup final · incognito mode shipped · headcount 75K (−3% QoQ)',
          detail:'<p>The World Cup stat is the scale flex; incognito mode (assistant conversations "even Meta can\'t see") is the trust play for personal agents; headcount down ~8,000 from the May reduction — the "leaner, AI-native" promise showing up in the denominator.</p>' },
      ],
      dots:'The three big threads braided on this call: the <b>spend</b> (floor up, FCF ~zero, debt + BlackRock), the <b>proof</b> (Business Agents / API / Meta One — surfaces shipped, dollars withheld), and the <b>engine</b> (ads +27% with the first quantified AI attribution). The print\'s message is that the engine now visibly funds the spend while the proof layer ships product — what is still missing, for the fourth straight quarter, is a NUMBER on either the 2027 bill or the AI revenue. Both sides of the trade are still adjectives.',
      threeMinutes:[
        '<b>The miss is manufactured; the engine beat.</b> Revenue +28% at the top of the guide; EPS "missed" only because $3.6B of legal + severance charges landed in one quarter — ex-charges, operating income grew ~9%. Score the quarter ex-items and it is the same accelerating ad story as Q1.',
        '<b>The monetization answer finally shipped.</b> Business Agents at 1M businesses/week, a Model API on OpenRouter, Meta One subscriptions, and compute bids at a premium — "higher margin selling intelligence than selling compute." The adjectives became products; the products still lack dollars. That is next quarter\'s hunt.',
        '<b>The bill\'s funding doctrine is now explicit.</b> Record $31.1B capex quarter, FCF $784M, floor raised to $130B — funded by cash flow, then "a greater mix of debt," then partners (BlackRock 1GW). 2027 is still an adjective after a third direct ask.',
        '<b>Reality Labs quietly turned.</b> +16% revenue on glasses "exceeding expectations," loss ~$450M better than the Street. The bet\'s worst segment is inflecting exactly as guided — watch Connect (Sep 23) for the next leg.',
      ],
      notBringing:[
        { item:'The −9% after-hours move', why:'An optics-driven reaction to a charges-manufactured miss; quoting it as verdict misreads the print. The next-day close is the scoreable number.' },
        { item:'WhatsApp World Cup records / Kylie Jenner glasses', why:'Great colour, already in every recap; logged in the aside — nothing to argue.' },
        { item:'Muse Spark 1.1 benchmark positioning', why:'The lab debate (efficient-small vs frontier-large) matters, but the tradeable items are the shipped surfaces and the open-source promise — both tracked.' },
      ],
      newQuestions:[
        { n:'2027 capex: a number or a fourth adjective — and does the $130B floor hold?', landed:{ q:'Q3 2026', rank:1 }, tripped:true },
        { n:'Do the monetization surfaces get dollars attached (Model API pricing/volume, Meta One subs, Business Agent economics, a compute deal)?', landed:{ q:'Q3 2026', rank:2 } },
        { n:'Does the ad engine hold mid/high-20s through the FX flip (~1% headwind) and the comp lap?', landed:{ q:'Q3 2026', rank:3 } },
        { n:'Is $2.4B the extent of the legal exposure — or the first installment, with the youth trials still live?', landed:{ q:'Q3 2026', rank:4 }, tripped:true },
        { n:'Do the two model promises ship: larger Muse models + the open-source return, both "soon"?', landed:{ q:'Q3 2026', rank:5 } },
      ],
    } },

  // ── REPORTED: Q1 2026 (quarter ended Mar 2026; reported Apr 29, 2026) ──
  { q:'Q1 2026', status:'reported', date:'April 29, 2026',
    setup:{
      // Grid RECONSTRUCTED 2026-07-30 from BBG_CONSENSUS.txt, snapshot `data_as_of`
      // 2026-01-30 — the last pull before this quarter printed, so its `fq+1` IS the
      // consensus that stood going in. Contemporaneous, recovered — not a retro-fit.
      source:'Bloomberg (BST) — BBG_CONSENSUS.txt snapshot archive · reconstructed from the 2026-01-30 pull', asOf:'2026-01-30',
      notes:{
        'EPS (diluted)':{ t:'The tax-noise quarter', h:'<p>Consensus $6.56 against a print of <b>$10.44</b> — but the beat is the <b>+$8.03B tax benefit</b> (the partial reversal of 3Q25\'s OBBBA charge), not operations. Ex-benefit ~$7.31. Score the operating lines, not this one.</p>' },
        'Capex':{ t:'The real capex news was the guide', h:'<p>The quarterly print ($19.8B vs $16.8B modeled) was the small news. The big news: the FY26 guide was <b>raised to $125–145B</b> (from $115–135B) on memory/component costs, plus a <b>$107B step-up in contractual commitments</b>.</p>' }
      },
      us:{ 'Revenue':{v:52.9}, 'Operating income':{v:25.0}, 'Capex':{v:28.5}, 'Family of Apps revenue':{v:52.3} },
      debate:{ rows:null, synth:'Going in, the bar was "ad engine keeps humming + the first MSL model lands." The risk the tape was pricing: how much higher capex goes, and whether the AI investment shows any ROIC signpost.' },
      pricedIn:'Strong ad growth (high-20s/low-30s), 40%+ op margin, and the first model from Meta Superintelligence Labs. The open questions: how much higher does capex go, and does the AI investment show any ROIC signpost?',
      oneLiner:'The bar was "ad engine keeps humming + first AI model lands" — Meta beat on revenue but raised capex AGAIN and gave no ROIC framework, so the debate stayed spend-vs-proof.' },
    results:{
      headline:'A strong ad print overshadowed by the spend: revenue $56.3B (+33%), op income $22.9B (41% margin) — but capex was RAISED again to $125–145B, contractual commitments stepped up $107B, and EPS ($10.44) was flattered by an $8.03B tax benefit (ex-benefit $7.31).',
      notes:{
        'Revenue':{ t:'The ad engine accelerated', h:'<p>$56.3B (+33%) vs $54.9B modeled. FoA ad revenue <b>$55.0B (+33%; +29% cc)</b>; price/ad +12% (from +6% in Q4); impressions +19% — acceleration on AI ranking (GEM, Lattice, Adaptive Ranking Model; value-optimization run-rate >$20B).</p>' },
        'Operating income':{ t:'41% margin', h:'<p>$22.9B vs $19.3B modeled (+18.6%) — the margin held at 41% while total expenses grew; the FY26 expense guide was held at $162–169B with a headcount reduction planned for May.</p>' },
        'EPS (diluted)':{ t:'⚠ Tax-flattered', h:'<p>$10.44 vs $6.56 modeled — an <b>$8.03B tax benefit</b> (partial reversal of the 3Q25 OBBBA charge) drove the optics; tax rate −23% (14% absent the benefit), guided 13–16% for the rest of 2026. Ex-benefit ~$7.31: a real but ordinary beat.</p>' },
        'Capex':{ t:'The guide moved, again', h:'<p>$19.8B printed vs $16.8B modeled (+18%) — and the FY26 guide went to <b>$125–145B</b> with a <b>$107B</b> contractual-commitment step-up. Susan declined a 2027 number ("dynamic planning"); Brian Nowak pushed on ROIC signposts and got qualitative milestones.</p>' },
        'Avg price per ad (YoY)':{ t:'+12% — accelerating', h:'<p>Up from +6% in Q4 on ad-performance improvements, better macro, and FX; partially offset by lower-monetizing-region impression mix. The quality lever of the ad engine\'s acceleration.</p>' }
      },
      watch:{ 'Capex':1, 'Revenue':3, 'Avg price per ad (YoY)':3 },
      thesisCheck:[
        {line:'Ad engine strong into comps', tripped:false, note:'Ad rev +33%, price/ad +12%, impressions +19% — accelerated on AI ranking; held strongly.'},
        {line:'Capex FY26 guide holds ($115–135B)', tripped:true, note:'⚑ RAISED to $125–145B on memory/component costs; +$107B contractual commitments — the guide did not hold.'},
        {line:'First MSL model ships credibly', tripped:false, note:'Muse Spark shipped; double-digit Meta-AI session gains; "leading lab on track" — held (engagement, not revenue yet).'},
        {line:'RL losses peaking; glasses offset', tripped:false, note:'RL rev $402M (−2%); glasses up, Quest down — consistent with the peak framing; held.'},
      ],
      intoCall:[
        'How much higher does capex go — any 2027 framework or ROIC signpost?',
        'Does Muse Spark / MSL have any monetization path, or is it engagement-only?',
        'How durable is the ad-engine acceleration (price/ad +12%) into tougher comps?',
      ],
      priceReaction:'Next trading day: −8.6% (approximate move, per the calls record).' },
    call:{
      prepared:[
        { topic:'Revenue up 33%; tax benefit inflates reported EPS', theme:'Results',
          body:'"Q1 total revenue was <b>$56.3 billion, up 33%</b> or 29% on a constant currency basis", with total expenses up 35% on infrastructure costs and AI-talent compensation. Operating income was <b>$22.9 billion, a 41% operating margin</b>. An <b>$8.03 billion</b> tax benefit (a partial reversal of the 3Q25 non-cash charge) took EPS to <b>$10.44</b>; "Absent the tax benefit, our net income and EPS would have been <b>$18.7 billion and $7.31</b>, respectively."' },
        { topic:'Recommendation gains drive record video engagement', theme:'Engagement',
          body:'Family daily actives were <b>3.56 billion</b>, down slightly from December on "internet disruptions in Iran and a restriction on access to WhatsApp in Russia". Ranking improvements "drove a <b>10% lift in Reels time spent</b>" on Instagram, and Facebook video time rose more than 8%, "the largest quarter-over quarter gain in four years". Doubling the training sequence length and faster indexing mean "same-day posts now representing <b>more than 30% of recommended Reels</b> on both Instagram and Facebook, more than double the levels one year ago."' },
        { topic:'Impressions +19%, price per ad +12%; bigger ad models pay off', theme:'Ads',
          body:'Ad revenue was <b>$55.0 billion, up 33%</b>, with ad impressions up <b>19%</b> and average price per ad up <b>12%</b>. Lattice and GEM advances "drove a more than <b>6% increase in conversion rate</b> for landing page view ads", and extending the LLM-scale Adaptive Ranking Model to offsite conversions added a <b>1.6%</b> lift. The value optimization suite run-rate is "now <b>over $20B</b>, more than doubling year-over-year", and partnership ads reached a <b>$10 billion</b> run-rate.' },
        { topic:'Muse Spark lands; Meta AI usage jumps', theme:'Meta AI',
          body:'Zuckerberg called Muse Spark, the first model from Meta Superintelligence Labs, proof "that our work is on track to build a leading lab": "Spark is just one step on that scaling ladder and we are <b>already training even more advanced models</b>." Li reported "<b>double-digit percent increases in Meta AI sessions per user</b>" after the rollout. The goal is "personal and business agents to billions of people", with AI that will "amplify people\'s ability to do what you want" rather than replace people.' },
        { topic:'Business AI conversations up 10x; Status ads scaling', theme:'Messaging',
          body:'"We now have <b>more than 10 million conversations each week</b> being facilitated through Business AIs, up from 1 million at the start of the year", after expanding to SMBs in Latin America, Indonesia and Asia-Pacific. Ads in WhatsApp Status are rolling out "with <b>hundreds of millions of people</b> now viewing them daily". Family of Apps other revenue was <b>$885 million, up 74%</b>, on WhatsApp paid messaging and subscriptions.' },
        { topic:'Glasses users triple while VR is reined in', theme:'Reality Labs',
          body:'Reality Labs revenue was <b>$402 million, down 2%</b>, as lower Quest sales offset "continued strong growth in AI glasses revenue". Zuckerberg said AI glasses usage is up sharply, "with the number of people using them daily <b>tripling year-over-year</b>", and launched Ray-Ban Meta Optics for all-day wear. On VR: "We remain the biggest investor in the VR space across the industry, but we are focused on <b>making our VR business sustainable</b>."' },
        { topic:'2026 capex raised to $125-145B on memory prices', theme:'Capex',
          body:'2026 capex is now "<b>$125-145 billion</b>, increased from our prior range of $115-135 billion", reflecting "higher component pricing this year and, to a lesser extent, additional data center costs". Zuckerberg: "Most of that is due to higher component costs, <b>particularly memory pricing</b>", while Meta rolls out "<b>more than 1GW of our own custom silicon</b>" with Broadcom alongside AMD and Nvidia. Cloud deals and purchase agreements "drove a <b>$107 billion step up</b> in our contractual commitments this quarter".' },
        { topic:'2Q26 guide $58-61B; expense range held despite layoffs', theme:'Guidance',
          body:'Q2 revenue is guided to "<b>$58-61 billion</b>", with FX an approximately 2% tailwind. Full-year expenses stay at "<b>$162-169 billion, unchanged</b> from our prior outlook", and Meta still expects 2026 operating income above 2025. Li said "we plan to <b>reduce the size of our employee base in May</b>" to offset the infrastructure spend, and warned that youth-related trials this year "may ultimately result in a <b>material loss</b>."' }
      ],
      qanda:[
        { q:'What signposts show the AI investment will earn a return?', analyst:'Brian Nowak · Morgan Stanley', theme:'Capex',
          qFull:'Given the level of investment behind Muse and other products, what key factors over the next 12 to 24 months (Meta AI, Muse advances, core algorithms) is Mark watching to make sure the capex and infrastructure spend generates a healthy ROIC?',
          a:'<b>Mark Zuckerberg:</b> "The formula for our company has always been <b>build experiences that can get to billions of people and focus on monetizing them once you get to scale</b>… the basic milestones that I look at are around, first, technically, are we delivering the quality to enable a great product; then second, when you have the product, how is it scaling; and then third, you look at the monetization and then you drive up the efficiency of it towards increasing profitability… I\'m quite comfortable that, A, the lab that we\'re building is <b>on track to be a leading lab in the world</b>."' },
        { q:'After Muse Spark: more model training or more product launches?', analyst:'Mark Shmulik · Bernstein', theme:'Meta AI',
          qFull:'Now that Muse Spark has launched, how is the team\'s focus divided between further model training runs and specialization toward personal superintelligence versus shipping more products?',
          a:'<b>Mark Zuckerberg:</b> "We have our <b>next set of more advanced models in training now</b>… Then we have our product team, and that team is now really unlocked to be able to build things on top of our models because we now have a very strong model… And then as we get to product market fit, we\'re also going to increasingly focus on building the businesses around them and decreasing the costs."' },
        { q:'How should 2027 capex be framed?', analyst:'Mark Shmulik · Bernstein', theme:'Capex',
          qFull:'With peers flagging a potential significant step-up in 2027 spend, how should investors think about this year\'s returns and traction shaping 2027 capex?',
          a:'<b>Susan Li:</b> "We aren\'t providing a specific outlook for 2027 CapEx… Our experience so far has been that <b>we have continued to underestimate our compute needs</b> even as we have been ramping capacity significantly… And if we end up not needing as much as we anticipate, <b>we can choose to bring it online more slowly or reduce our spending in future years</b> as we grow into the capacity that we\'re building now."' },
        { q:'The agentic opportunity across consumers, SMBs and enterprises', analyst:'Eric Sheridan · Goldman Sachs', theme:'Messaging',
          qFull:'How does Meta think about making its media-engagement and commerce models more agentic, and what is the opportunity with SMBs and enterprises, where it has historically had less product velocity?',
          a:'<b>Susan Li:</b> "The focus is on building personal superintelligence, building a consumer agent that can work for you and help you get things done… we think there will be clear monetization opportunities over time. You can imagine <b>commission structures or a premium offering</b>… business AIs today are <b>currently free for most businesses</b> on our messaging apps. But as we make more progress, we expect that we will also work towards establishing a longer-term monetization model."' },
        { q:'What gates more EssilorLuxottica glasses brands, and what is a good 2026?', analyst:'Youssef Squali · Truist Securities', theme:'Reality Labs',
          qFull:'Ray-Ban and Oakley AI glasses are doing well; what gates launches under EssilorLuxottica\'s other brands this year, and what would a successful 2026 look like, for example in units sold?',
          a:'<b>Susan Li:</b> "We\'re continuing to see <b>strong growth</b> in, obviously the AI glasses sales over the course of Q1… we\'re seeing sales shift now from the prior generation of Ray-Ban Metas to the latest generation… We see <b>strong interest now in the Meta Ray-Ban Displays</b> with the Meta Neural Band. So that\'s an encouraging sign that there is consumer appetite for display glasses."' },
        { q:'Is the 10% RIF about AI efficiency, and how will headcount grow?', analyst:'Youssef Squali · Truist Securities', theme:'Expenses',
          qFull:'How much of the roughly 10% reduction in force reflects AI-driven efficiency versus staying lean, and how should headcount grow relative to revenue over time?',
          a:'<b>Susan Li:</b> "<b>We don\'t really know what the optimal size of the company will be in the future.</b> I think there\'s a lot of change right now with AI capabilities advancing rapidly. We\'re very focused on leveraging AI tools to substantially increase our productivity… At the same time we\'re making very significant investments in infrastructure, and we are very focused on continuing to operate efficiently."' },
        { q:'What does Muse Spark unlock, and what is the product cadence?', analyst:'Justin Post · Bank of America', theme:'Meta AI',
          qFull:'Muse Spark took about 10 months to ship; what does it unlock for new products, and what will the cadence of consumer and business products built on it be over the next nine months?',
          a:'<b>Mark Zuckerberg:</b> "I think the lab that has gone the fastest from standing up the lab to having a very kind of widely accepted as strong model… In terms of what exactly the cadence is going to be. It\'s tough for me to say… <b>we are more focused on quality than hitting a specific date</b>… There\'s a lot of agents out there… And <b>there aren\'t that many that I would want to give to my mother</b>."' },
        { q:'Do new consumer agents (OpenClaw, Poke, Dreamer) change the strategy?', analyst:'Ross Sandler · Barclays', theme:'Meta AI',
          qFull:'With new consumer agent apps cropping up, from OpenClaw to Poke and Dreamer (which Meta acquired), how do they change Meta\'s view of where Meta AI and its agentic strategy need to go?',
          a:'<b>Mark Zuckerberg:</b> "They give you a very exciting glimpse of what types of things should be possible. Now <b>they\'re pretty rough systems today</b>… So how do you make a version of that experience that is a lot more polished and dialed and easy… people are going to also be <b>willing to pay a lot of money to have premium or high compute versions</b> of it."' },
        { q:'Stay in the consumer lane, or pursue coding and self-improvement?', analyst:'Ross Sandler · Barclays', theme:'Meta AI',
          qFull:'Will the lab stay focused on consumer products, or also pursue code-writing and the recursive self-improvement loop that other labs are chasing?',
          a:'<b>Mark Zuckerberg:</b> "<b>You\'re not going to have leading models in the future if your models can\'t improve themselves</b>, right?… So I think that is a table stakes thing that we are focused on. Now does that make us a developer tools company? Not necessarily… people conflate coding with self improvement more than they should. <b>Coding is one ingredient</b> for the model self improving."' },
        { q:'Is the personal agent a short-, medium- or long-term goal?', analyst:'Ron Josey · Citi', theme:'Meta AI',
          qFull:'With Muse Spark live and more models in development, is a personal agent product a short-, medium- or long-term goal?',
          a:'<b>Mark Zuckerberg:</b> "I think of the agents as the <b>product vehicle</b> for delivering that capability to people. And we certainly -- I think <b>this year is going to be a key period</b> for establishing that as the vehicle for how people are going to use this, but then the model improvement, I think, is going to be something that\'s going to go on for a very long time."' },
        { q:'How much room is left in ranking and recommendation gains?', analyst:'Ron Josey · Citi', theme:'Engagement',
          qFull:'How does doubling the length of user interaction sequences drive usage, and is there more runway given the view that recommendation improvements are long in the tooth?',
          a:'<b>Susan Li:</b> "<b>There is still a lot of room to continue improving recommendations</b> over the rest of the year, and we expect we\'ll be able to do that to drive additional engagement on both Facebook and Instagram… the sequence length which is the thing that you called out is one of really many improvements we made in Q1, and <b>there is a big roadmap of further improvements</b> going forward."' },
        { q:'What do larger models unlock in the ad business?', analyst:'Doug Anmuth · JPMorgan', theme:'Ads',
          qFull:'Going from smaller models in the ad business to Muse Spark and future LLMs, what are the key unlocks for engagement and monetization?',
          a:'<b>Susan Li:</b> "Historically, we haven\'t used larger model architectures like GEM for inference because their size and complexity would make them too cost prohibitive… But in the second half of last year, we introduced a new adaptive ranking model which enables us to leverage <b>LLM scale model complexity of a trillion parameters</b>… that lets us drive both <b>better performance and increased inference ROI</b>."' },
        { q:'Manus: strategic role and deal status', analyst:'Doug Anmuth · JPMorgan', theme:'Meta AI',
          qFull:'What is the strategic importance of Manus for Meta\'s agentic products, and what is the current status of the technology and the deal?',
          a:'<b>Susan Li:</b> "On Manus, <b>we\'re still working through the details</b>. So we don\'t have an update right now."' },
        { q:'Shopping in Meta AI and lessons from the 2021-22 commerce push', analyst:'Ken Gawrelski · Wells Fargo', theme:'Meta AI',
          qFull:'Can Mark expand on shopping as a Muse Spark vertical, lessons from Meta\'s 2021-22 commerce push on Instagram and Facebook, and whether there is room for a next-generation marketplace business?',
          a:'<b>Mark Zuckerberg:</b> "AI agents get better when you fully optimize the stack. That\'s why we believe that <b>we need to be a company that builds frontier models in addition to building the agents</b>… I don\'t hear any other labs out there talking about how they\'re <b>building an AI that\'s really good at shopping</b>… These are all elements of the personal super intelligence vision."' },
        { q:'How much visibility is there into core ad growth?', analyst:'Ken Gawrelski · Wells Fargo', theme:'Ads',
          qFull:'Given model and recommendation improvements, how much visibility does Meta have into the core business continuing to grow at roughly double the industry\'s pace?',
          a:'<b>Susan Li:</b> "I\'ve mentioned on a couple of calls, the budgeting process in which we run a very sort of <b>ROI-based process</b> to make sure that we are funding all of the ads initiatives that we think will drive growth in future years… as we have line of sight, <b>we feel good about the investment opportunities ahead of us</b>."' },
        { q:'Threads and WhatsApp: engagement and monetization ramp', analyst:'Mark Mahaney · Evercore', theme:'Messaging',
          qFull:'What more can Meta say about the monetization ramp on Threads and WhatsApp, and which new products or features have driven engagement there?',
          a:'<b>Susan Li:</b> "We are now at <b>over 150 million daily actives</b>… We continued expanding ads on Threads to over 200 countries… We don\'t expect it to be a meaningful driver of overall impression or revenue growth this year… Status ads are now being viewed by hundreds of millions of people each day… But <b>we don\'t expect ads in Status to be a meaningful contributor</b> to total impressions or revenue growth for the next few years."' },
        { q:'Less-personalized ads in the EU and youth litigation', analyst:'Shweta Khajuria · Wolfe Research', theme:'Guidance',
          qFull:'How large a headwind could the EU less-personalized ads option be, and after the L.A. court ruling on youth-related issues, has Meta set budget aside for potential back-half costs?',
          a:'<b>Chad Heaton:</b> "We believe that the <b>revenue impact from the updated user flows will be larger in Q2 than it was in Q1</b> since we were rolling out the updated offering through Q1… And that expected impact is <b>factored into our Q2 \'26 outlook</b>… we will defend our record here vigorously. And I think it\'s premature to comment on any ultimate litigation outcomes."' },
        { q:'Durability of ad growth and the role of ad load', analyst:'Shweta Khajuria · Wolfe Research', theme:'Ads',
          qFull:'Which drivers (recommendations, ad load, performance, creative, business messaging) offer the most runway and durability for ad growth?',
          a:'<b>Chad Heaton:</b> "We continue to optimize ad load across our apps by determining the best time, place, and person to show an ad… ad load increases on Instagram Feed and Reels contributed to year over-year impression growth in Q1, but <b>the larger driver of impression growth continues to be growth in users and engagement</b>."' },
        { q:'Any macro weakness in 1Q or baked into the 2Q guide?', analyst:'Deepak Mathivanan · Cantor Fitzgerald', theme:'Guidance',
          qFull:'Were there signs of macro weakness in 1Q, by vertical or otherwise, and what is factored into the 2Q guide?',
          a:'<b>Chad Heaton:</b> "We did see <b>reduction in advertiser spend coinciding with the beginning of the conflict in Iran</b> at the end of February, and that continued through the quarter… we also saw some softer trends in markets outside the Middle East, including in the U.S. and Western Europe… we\'ve begun to see <b>some signs of improvement in demand</b>… as we\'ve progressed into April."' },
        { q:'How will first-party and third-party cloud compute be used?', analyst:'Deepak Mathivanan · Cantor Fitzgerald', theme:'Capex',
          qFull:'Beyond near-term availability, how is Meta using third-party cloud capacity versus its own data centers, particularly as the third-party deals come online over the next few quarters?',
          a:'<b>Chad Heaton:</b> "These are <b>multi-year contracts that will come online progressively over the course of 2026 and 2027</b>, and the capacity will primarily support AI workloads. We still anticipate investing significantly in our owned and leased data center capacity. However, a lot of that is going to be for capacity that comes online in future years."' },
        { q:'Why is the expense guide unchanged despite the layoffs?', analyst:'Michael Nathanson · MoffettNathanson', theme:'Expenses',
          qFull:'Given the headcount reduction, why was the 2026 opex outlook left unchanged, and what costs are offsetting the savings?',
          a:'<b>Susan Li:</b> "We do expect lower going forward employee compensation expense… but that is <b>offset within this year by restructuring costs</b> that we expect to incur as part of the layoffs… A big one, frankly, is <b>the timing of cloud deals coming online</b> and when the capacity gets delivered."' },
        { q:'Has underestimating compute hurt revenue growth?', analyst:'Michael Nathanson · MoffettNathanson', theme:'Capex',
          qFull:'Given the continual underestimation of compute needs, has it affected revenue growth, and what have been the biggest impacts on the business?',
          a:'<b>Susan Li:</b> "We generally expect to make <b>good progress alleviating our current compute constraints</b> through the year as we bring more capacity online… we\'re pretty disciplined through that process about making sure that we are funding the engagement and revenue initiatives that are critical… Having said that, <b>I\'m not sure there\'s a team at the company that wouldn\'t like to get a little more compute</b> right now."' },
        { q:'What is the guardrail on capex versus free cash flow?', analyst:'Barton Crockett · Rosenblatt', theme:'Capital',
          qFull:'If capex keeps growing at this pace for a couple of years, Meta could need to borrow or turn free cash flow negative; how far would it push capex, and what is the guardrail?',
          a:'<b>Susan Li:</b> "We really believe that we have <b>very compelling investment opportunities ahead of us</b> and that we think we really need to pursue them… And so, <b>we aren\'t really optimizing for a specific cash flow level this year</b>. Having said that, we continue to be very focused on operating the business efficiently to help offset our investments."' },
        { q:'How are advertisers using gen AI creative tools?', analyst:'Ross Walthall · Cleveland Research', theme:'Ads',
          qFull:'Can Meta give examples of how advertisers use its generative AI creative tools and how the performance gains are playing out?',
          a:'<b>Susan Li:</b> "Over <b>8 million advertisers</b> are now using at least one of our AI ad creative tools. That\'s up from 4 million at the end of 2024. <b>The vast majority</b> of advertisers using our AI ad creative tools <b>are SMBs</b>… In a large-scale test that we ran, advertisers who used our video generation feature drove a <b>3% gain in conversion rates</b> compared to advertisers not using the product."' },
        { q:'Milestones for shopping within Meta AI', analyst:'Josh Beck · Raymond James', theme:'Meta AI',
          qFull:'Meta\'s shopping is mostly impulse buying while Meta AI shopping is more of a discovery process; what are the obstacles to conversion and the key milestones?',
          a:'<b>Susan Li:</b> "So far, we\'ve made it available in the standalone app and website within the U.S., and while it\'s early, we\'re seeing people use it for <b>product inspiration, browsing, product comparisons</b>… personalization is going to be a big angle… commerce has always been a significant area of focus for our teams and, of course, <b>our largest ads vertical</b>."' },
        { q:'With Manus unwinding, more M&A to fill the gap?', analyst:'Nick Jones · BNP Paribas', theme:'Meta AI',
          qFull:'With the Manus acquisition being undone, should investors expect more M&A, or how will Meta fill that part of its product roadmap?',
          a:'<b>Susan Li:</b> "We have a lot of <b>confidence in sort of our agentic roadmap</b>, I think, period. Obviously, we don\'t have a lot more to share on Manus… I think the two pillars of <b>personalization and greater agentic capabilities</b> are going to be a big feature in all of the AI tools and experiences that we build going forward."' },
        { q:'When will Meta AI use context from across the family of apps?', analyst:'Rich Greenfield · LightShed Partners', theme:'Meta AI',
          qFull:'The new model was said to integrate everything across the family of apps but does not yet; what is the roadmap for using Instagram and Facebook context, and why do existing integrations like Gmail look rudimentary?',
          a:'<b>Susan Li:</b> "We are <b>very early on this journey</b>… released a model that has sort of <b>caught us up to being in the pack in record time</b>. But that is all to say that the vast majority of the journey is ahead of us… our social graph and first party signals are going to allow us to ground agents… messaging is a natural action, or interaction, surface for agents… our hardware investments and Ray-Ban Meta Glasses provide what we believe is the best form factor for agentic interactions."' },
        { q:'Progress on AI content creation as a revenue pillar', analyst:'Stephen Ju · UBS', theme:'Ads',
          qFull:'With more prominent prompts to create AI-generated content in Instagram, how far along is Meta in using its own models to help creators and users generate content, and is the Midjourney partnership still in place?',
          a:'<b>Susan Li:</b> "I think some of the most straightforward versions of this, for example, are the <b>Gen AI ad-creative tools</b>… as we improve performance, that should accrue to revenue… these are things that I think <b>don\'t even really require that you unlock something meaningfully different</b> from what is driving today\'s core business to be very valuable to our platform."' }
      ],
      take:'A strong ad print whose <b>story is the spend</b>: revenue +33% and a 41% op margin, but capex was raised AGAIN to $125–145B with a $107B step-up in contractual commitments — and management framed the AI payoff (Muse Spark / MSL) in <b>milestones, not dollars</b>. The ad engine is funding a bet whose ROIC is still asserted, not shown; EPS optics ($10.44) were tax-flattered.',
      highlights:[
        { tag:'watch', band:'lead', head:'Capex raised AGAIN to <b>$125–145B</b> + a <b>$107B</b> step-up in contractual commitments — with no 2027 number.',
          open:'Where is the ROIC framework? Brian Nowak asked for signposts; Mark gave qualitative milestones (model quality → product scale → monetization), and Susan declined a 2027 figure ("dynamic planning").',
          detail:'<p>The FY26 capex guide went from $115–135B (Q4) to <b>$125–145B</b> on higher memory/component pricing plus additional data-center costs. On top, multi-year cloud deals + infrastructure purchase agreements drove a <b>$107B step-up in contractual commitments</b> this quarter — spend that lands over 2026–2027.</p><p>Peers flagged a big 2027 step-up on their own calls; Susan would not quantify Meta\'s, citing a "very dynamic planning process." So the spend keeps climbing while the return remains a <b>trajectory, not a number</b> — the core tension of the print.</p>' },
        { tag:'thesis', band:'lead', head:'Muse Spark / MSL: the first model landed, but the payoff is <b>engagement, not revenue</b>.',
          open:'What monetizes it? Double-digit Meta-AI session gains are promising, but there is no revenue signal or product-to-revenue timeline — the thing the $125–145B is meant to earn.',
          detail:'<p>Muse Spark — the first model from Meta Superintelligence Labs — now powers Meta AI across the Family of Apps, driving <b>double-digit percent increases in Meta-AI sessions per user</b> and a top-of-app-store ranking. Mark: the lab is "on track to be a leading lab," with more advanced models in training.</p><p>His ROIC formula ("build leading models → leading products → monetize at scale") is the same one Meta has run for 20 years — but for now the AI bet is validated on <b>usage and model quality</b>, not dollars. That is the gap the next few prints have to close.</p>' },
        { tag:'thesis', band:'context', head:'The ad engine <b>accelerated</b> — revenue +33%, price/ad +12%, impressions +19%.',
          detail:'<p>FoA ad revenue $55.0B (+33%); price/ad +12% (up from +6% in Q4); impressions +19%. Driven by AI ranking (GEM, Lattice, Adaptive Ranking Model), value-optimization run-rate now >$20B (2x YoY), partnership-ads run-rate $10B (2x). This is the cash engine underwriting the AI build — settled strength.</p>' },
        { tag:'thesis', band:'context', head:'Business AIs scaling — <b>10M conversations/week</b>, up from 1M at the start of the year.',
          detail:'<p>Business AIs expanded on WhatsApp (LatAm, Indonesia) and Messenger (APAC); the Meta AI business assistant fully rolled out to eligible advertisers (20% higher issue-resolution rate). 8M+ advertisers using gen-AI creative tools. Early monetization surface for the AI stack.</p>' },
        { tag:'thesis', band:'context', head:'Leaner operating model — headcount reduction planned for <b>May</b>; opex guide unchanged.',
          detail:'<p>77,900 employees (−1% QoQ); a further reduction announced internally for May. FY26 total-expense guide held at $162–169B. The "AI-native, flatter teams" framing as the offset to the capex ramp.</p>' },
        { tag:'watch', band:'logged', head:'EPS $10.44 <b>tax-flattered</b> — $8.03B benefit vs the Q3\'25 $15.93B charge.',
          detail:'<p>Q1 tax rate −23% on an $8.03B benefit partially relieving the prior R&D-capitalization charge; ex-benefit EPS would be $7.31 and tax rate 14%. Guided 13–16% for the rest of 2026. Read the EPS line ex the discrete items.</p>' },
        { tag:'watch', band:'logged', head:'Regulatory: US <b>youth trials</b> this year — "may result in a material loss"; EU headwinds.',
          detail:'<p>Legal expense elevated; management flagged additional US youth-related trials in 2026 and continued EU/US scrutiny that "could significantly impact our business and financial results."</p>' },
        { tag:'watch', band:'logged', head:'Custom silicon + Reality Labs pivot — Broadcom 1GW, AMD, Nvidia; glasses tripling.',
          detail:'<p>Rolling out >1GW of Meta\'s own Broadcom-developed silicon + AMD to complement Nvidia ("Meta Compute" efficiency edge). RL revenue $402M (−2%): Quest down, AI glasses tripling YoY; losses framed as peaking this year.</p>' },
      ],
      dots:'The two lead items are the same trade from both sides: the <b>capex keeps rising</b> (now $125–145B + $107B commitments) precisely because the <b>AI products are working on engagement</b> (Muse Spark) — but neither the spend nor the payoff has a number attached (no 2027 capex, no AI revenue). The ad engine (+33%, price +12%) is the only fully-quantified part of the story, and it is funding a bet the market is asked to take on trajectory. The next print\'s job: put a number on either side.',
      threeMinutes:[
        '<b>The print is about the spend, not the beat.</b> Revenue +33% and a 41% margin are great, but capex was raised AGAIN to $125–145B with a $107B step-up in contractual commitments — and management gave no 2027 figure and no ROIC framework (Brian Nowak asked; Mark gave qualitative milestones). The debate stays spend-vs-proof.',
        '<b>Muse Spark landed — the AI bet is validated on engagement, not revenue.</b> The first Meta-Superintelligence-Labs model drove double-digit Meta-AI session gains, but there\'s no monetization path yet. That\'s the gap the capex is meant to close, and the next prints have to start closing it.',
        '<b>The ad engine is the only fully-quantified part of the story — and it\'s accelerating.</b> Ad revenue +33%, price/ad +12% (from +6%), impressions +19% on AI ranking; value-optimization run-rate >$20B. It\'s funding everything; watch it as the tell if the AI spend is ever going to be underwritten.',
      ],
      notBringing:[
        {item:'EPS $10.44 headline', why:'Tax-flattered by an $8.03B benefit; the clean number is ~$7.31 — leading with the headline EPS misreads the quarter.'},
        {item:'Reality Labs quarterly revenue', why:'$402M (−2%) is noise; the signal is the loss-peak framing + glasses pivot, not the print.'},
        {item:'Individual ad-product features', why:'GEM/Lattice/Adaptive Ranking are real but everyone has the release; the debate is capex ROIC, not feature lists.'},
      ],
      newQuestions:[
        {n:'How much higher does capex go — any 2027 framework or ROIC signpost?', landed:{q:'Q2 2026', rank:1}, tripped:true},
        {n:'Does Muse Spark / MSL have a monetization path, or engagement-only?', landed:{q:'Q2 2026', rank:2}},
        {n:'How durable is the ad-engine acceleration into tougher comps?', landed:{q:'Q2 2026', rank:3}},
        {n:'Do Reality Labs losses actually peak and start declining?', landed:{q:'Q2 2026', rank:4}},
        {n:'How do the US youth trials / EU headwinds resolve?', landed:{q:'Q2 2026', rank:5}},
      ] } },

  // ── REPORTED: Q4 2025 (quarter ended Dec 2025; reported Jan 28, 2026) ──
  { q:'Q4 2025', status:'reported', date:'January 28, 2026',
    setup:{
      // Grid RECONSTRUCTED 2026-07-30 from BBG_CONSENSUS.txt, snapshot `data_as_of`
      // 2025-10-31 — the last pull before this quarter printed.
      source:'Bloomberg (BST) — BBG_CONSENSUS.txt snapshot archive · reconstructed from the 2025-10-31 pull', asOf:'2025-10-31',
      notes:{
        'EPS (diluted)':{ t:'A clean tax quarter between two noisy ones', h:'<p>Tax rate 10% (below the 12–15% outlook) on settlements — contrast with 3Q25\'s −$15.93B OBBBA charge and 1Q26\'s +$8.03B partial reversal. This is the cleanest EPS print in the window.</p>' }
      },
      us:{ 'Revenue':{v:59.3}, 'Operating income':{v:24.4}, 'Family of Apps revenue':{v:58.3} },
      debate:{ rows:null, synth:'The bar was "finish 2025 strong and set a credible FY26 spend frame" — the open question was how big the 2026 AI-infra step-up would be, and whether the AI product roadmap was credible.' },
      pricedIn:'A record holiday quarter: mid-20s ad growth, 40%+ margin, and the initial FY26 capex/expense frame. The open question was how big the 2026 AI-infra step-up would be and whether the AI product roadmap was credible.',
      oneLiner:'The bar was "finish 2025 strong and set a credible FY26 spend frame" — Meta beat (+24%, 41% margin) and set FY26 capex at $115–135B, framing 2026 as the year AI changes how it works.' },
    results:{
      headline:'A record close to 2025: revenue $59.9B (+24%), op income $24.7B (41% margin), EPS $8.88 — with the initial FY26 capex frame ($115–135B) and "2026 is the year AI changes how we work" as the setup.',
      notes:{
        'Revenue':{ t:'Record holiday demand', h:'<p>$59.9B (+24%; +23% cc) vs $58.1B modeled. FoA ad revenue $58.1B (+24%); price/ad +6%; impressions +18% — record-breaking holiday demand + AI-ranking gains (Reels watch-time +30% YoY US).</p>' },
        'Operating income':{ t:'Margin held on revenue speed', h:'<p>$24.7B (41% margin) vs $23.9B modeled. Total expenses $35.1B (<b>+40%</b>) on AI-talent comp, legal expense, and infrastructure (depreciation + cloud) — the margin held only because revenue grew +24%. The cost ramp is the dynamic to watch as growth normalizes.</p>' },
        'EPS (diluted)':{ t:'Tax rate 10%', h:'<p>$8.88 vs $8.19 modeled — helped by a 10% tax rate (below the 12–15% outlook) on settlements. A cleaner quarter than the tax-noisy 3Q25/1Q26 on either side of it.</p>' },
        'Capex':{ t:'The real news: the FY26 frame', h:'<p>$22.1B printed vs $21.2B modeled. The news was the guide: initial FY26 capex at <b>$115–135B</b>, <b>Meta Compute</b> announced (efficiency-as-strategy), and Dina Powell McCormick joining to lead sovereign / strategic-capital partnerships for capacity.</p>' }
      },
      watch:{ 'Capex':1, 'Revenue':3, 'EPS (diluted)':5 },
      thesisCheck:[
        {line:'Ad engine record holiday strength', tripped:false, note:'Ad rev +24% on record holiday demand + AI ranking; held.'},
        {line:'Credible FY26 capex frame', tripped:false, note:'Set at $115–135B with Meta Compute; framed but large — held (and later raised in Q1).'},
        {line:'AI roadmap credible', tripped:false, note:'First models "shipping over coming months"; MSL rebuilt — held (execution TBD).'},
        {line:'RL losses framed to peak', tripped:false, note:'Losses ~flat this year and "likely the peak"; glasses pivot — held.'},
      ],
      intoCall:[
        'How big does the 2026 capex ramp get, and is the AI roadmap specific?',
        'Does the ad engine hold as holiday comps roll off?',
        'Is the Reality Labs loss peak real, and how fast do glasses scale?',
      ],
      priceReaction:'Next trading day: +10.4% (approximate move, per the calls record).' },
    call:{
prepared:[
  { topic:'Revenue up 24% on record holiday demand', theme:'Results',
    body:'Total revenue was <b>$59.9 billion</b>, up <b>24%</b> (23% constant currency); Mark said the business "performed very well thanks to <b>record-breaking holiday demand</b> and AI-driven performance gains". Operating income was <b>$24.7 billion</b>, a <b>41%</b> operating margin, and net income <b>$22.8 billion</b> or <b>$8.88</b> per share. Total expenses rose <b>40%</b>, driven by employee compensation (AI talent), legal and infrastructure costs.' },
  { topic:'3.5 billion daily people; ranking gains lift video time', theme:'Engagement',
    body:'More than <b>3.5 billion</b> people used at least one app daily, with Facebook and WhatsApp each above 2 billion. Instagram Reels watch time grew <b>more than 30%</b> in the US, and Q4 optimizations "drove a <b>7% lift</b> in views of organic Feed and video posts on Facebook, resulting in the largest quarterly revenue impact from Facebook product launches in the past two years". Threads time spent rose <b>20%</b> from recommendation improvements.' },
  { topic:'Impressions +18%, price +6%; GEM drives conversions', theme:'Ads',
    body:'Ad impressions grew <b>18%</b> and average price per ad <b>6%</b>. Meta doubled the GPUs used to train its GEM ads-ranking model, and "the GEM and sequence learning improvements together drove a <b>3.5% lift in ad clicks</b> on Facebook and a <b>more than 1% gain in conversions</b> on Instagram in Q4". Video generation tools reached a <b>$10 billion</b> combined revenue run-rate, and incremental attribution "has already achieved a <b>multi-billion dollar annual run-rate</b> just seven months since launching".' },
  { topic:'WhatsApp paid messaging passes $2B run-rate', theme:'Messaging',
    body:'Family of Apps other revenue rose <b>54%</b> to $801 million on WhatsApp paid messaging and Meta Verified. Click-to-message ads grew more than <b>50%</b> in the US, and "Paid messaging within WhatsApp continues to scale as well, crossing a <b>$2 billion annual run-rate</b> in Q4." Business AIs in Mexico and the Philippines now handle "over <b>1 million weekly conversations</b>", with more markets coming in 2026.' },
  { topic:'New models coming; vision is personal superintelligence', theme:'Meta AI',
    body:'Mark said "In \'25 we rebuilt the foundations of our AI program. Over the coming months we\'re going to start shipping our new models and products," adding "I expect our first models will be good but, more importantly, will show the <b>rapid trajectory</b> that we\'re on." Meta is "working on merging LLMs with the recommendation systems" behind its feeds and ads, and agentic shopping tools are planned. Internally, output per engineer is up <b>30%</b> since early 2025, mostly from agentic coding.' },
  { topic:'Glasses sales tripled; Reality Labs losses to peak in 2026', theme:'Reality Labs',
    body:'"Sales of our glasses <b>more than tripled</b> last year," and Reality Labs investment will shift mostly toward glasses and wearables. Mark said "I expect Reality Labs losses this year to be <b>similar to last year</b>, and this will likely be the <b>peak</b> as we start to gradually reduce our losses going forward." Q4 Reality Labs revenue was <b>$955 million</b>, down <b>12%</b>, as it lapped the Quest 3S launch.' },
  { topic:'2026 capex $115–135B; Meta Compute targets cheaper gigawatts', theme:'Capex',
    body:'Q4 capital expenditures were <b>$22.1 billion</b> and free cash flow <b>$14.1 billion</b>; 2026 capex is guided to <b>$115–135 billion</b>, driven by Meta Superintelligence Labs and the core business. Through Meta Compute, "we expect the <b>cost per gigawatt to decrease significantly</b> over time", and MTIA will extend to ranking and recommendation training in Q1. Meta may supplement cash flow with external financing, "which may lead us to eventually maintain a <b>positive net debt</b> balance".' },
  { topic:'Q1 guide implies acceleration; 2026 operating income above 2025', theme:'Guidance',
    body:'First-quarter revenue is guided to <b>$53.5–56.5 billion</b>, with FX an approximately <b>4%</b> tailwind. Full-year 2026 total expenses are <b>$162–169 billion</b>, led by infrastructure and then compensation, and the tax rate <b>13–16%</b>. "Despite the meaningful step up in infrastructure investment, in 2026 we expect to deliver <b>operating income that is above 2025</b> operating income." Susan also flagged EU less-personalized-ads changes and US youth trials "which may ultimately result in a <b>material loss</b>".' }
],
qanda:[
  { q:'Largest long-term returns on the AI and compute investment', analyst:'Brian Nowak · Morgan Stanley', theme:'Meta AI',
    qFull:'Over the next 3, 5 and 10 years, what are the largest revenue or ROIC opportunities Meta is trying to unlock with the ramp in investment behind personal superintelligence and Meta Compute?',
    a:'<b>Mark Zuckerberg:</b> "there are several major business opportunities that we\'re focused on. I think that -- one is just going to be <b>improving the core products and accelerating the current business</b>." … "We think that there are going to be opportunities, both in terms of <b>subscriptions and advertising</b> and all of the different things that you see on that." … "there\'s a number of things on <b>shopping and commerce</b> that I\'m quite excited about"' },
  { q:'Biggest drivers of the 2026 revenue inflection', analyst:'Brian Nowak · Morgan Stanley', theme:'Guidance',
    qFull:'The Q1 guide implies the fastest growth in almost five years; what are the two or three biggest drivers of the revenue inflection in 2026?',
    a:'<b>Susan Li:</b> "The range embeds an outlook for <b>accelerated growth</b>, and that\'s really underpinned by the strong demand that we saw through the end of Q4 and continuing into the start of 2026. Now I will say we also expect foreign currency to be a <b>four-point benefit</b> to year-over-year growth." … "overall, we see that advertisers are responding to <b>ad performance improvements</b> that we made. They\'re driving strong conversion growth."' },
  { q:'Is Meta still capacity constrained on compute?', analyst:'Eric Sheridan · Goldman Sachs', theme:'Capex',
    qFull:'Meta has previously said it lacked enough compute for its product roadmap; how does it now view its internal compute needs against that roadmap?',
    a:'<b>Susan Li:</b> "we do continue to be <b>capacity constrained</b>." … "demands for compute resources across the company have increased even faster than our supply." … "we\'ll likely still be <b>constrained through much of 2026</b> until additional capacity from our own facilities comes online later in the year."' },
  { q:'Relationship between more compute and ads outcomes', analyst:'Eric Sheridan · Goldman Sachs', theme:'Ads',
    qFull:'As the ads business scales, has Meta seen the full first-order effect of applying more compute, and how should investors think about compute versus monetization outcomes?',
    a:'<b>Susan Li:</b> "I don\'t have an extremely precise answer to this question." … "the way that we drive performance from those models is by using them to <b>transfer knowledge to smaller lightweight models</b> used at run time. But I would say that we think that there is <b>room for our larger models to benefit from having more compute</b>."' },
  { q:'When should new AI products show meaningful adoption?', analyst:'Mark Shmulik · Bernstein', theme:'Meta AI',
    qFull:'Would Mark be surprised if, by year-end, there was little meaningful progress and adoption of the new products and ways of working, or should investors be more patient on timing?',
    a:'<b>Mark Zuckerberg:</b> "we\'re starting off early enough in the year that I would expect that we\'ll see <b>some successes by the end of the year</b>" … "the fact that <b>agents are really starting to work now is quite profound</b>." … "Now how to predict exactly the timeframe for adopting that is somewhat hard, right? I\'m not going to predict a specific quarter or something like that."' },
  { q:'How firm is the operating income commitment?', analyst:'Mark Shmulik · Bernstein', theme:'Guidance',
    qFull:'If Meta later needs more AI investment while macro weakens, how hard a line is there between investment levels and the operating income outlook?',
    a:'<b>Susan Li:</b> "In 2026, we expect to deliver operating income above 2025 operating income. So this is <b>comparing absolute dollars, not year-over-year growth</b>." … "We\'re really taking advantage of the current business strength to <b>reinvest a lot of the revenue</b> into what we see as very attractive investment opportunities in AI infrastructure and talent."' },
  { q:'Progress of Meta Superintelligence Labs and a frontier model', analyst:'Doug Anmuth · JPMorgan', theme:'Meta AI',
    qFull:'Several months in, how is the MSL team progressing, and what is the path to a frontier model this year?',
    a:'<b>Mark Zuckerberg:</b> "We\'re about six months into building MSL. I\'m very pleased with the quality of the team. I think we have the <b>most talent-dense research effort in the industry</b> and some of the early indicators look positive." … "the first set of things that we put out, I think, are going to be more about <b>showing the trajectory</b> that we\'re on rather than being a single moment in time."' },
  { q:'Positive free cash flow in 2026 and data center JVs', analyst:'Doug Anmuth · JPMorgan', theme:'Capital',
    qFull:'Alongside growing operating income in 2026, does Meta expect positive free cash flow, and how should investors think about current and future data center JVs?',
    a:'<b>Susan Li:</b> "we are making very significant investments in infrastructure capacity this year to support our AI efforts. And we believe we\'re in a <b>strong position to support them with the cash generation</b> of the -- of our business this year." … "So we <b>don\'t have anything additional to announce</b> at this point."' },
  { q:'Revenue opportunities beyond ads', analyst:'Justin Post · Bank of America', theme:'Meta AI',
    qFull:'With so much capacity coming, how does Meta think about expanding beyond ads, for example subscriptions or licensing its cloud models?',
    a:'<b>Mark Zuckerberg:</b> "So yes, we are focused on things beyond ads, I think the numbers make it so that for the next couple of years, <b>ads are going to be, by far, the most important driver of growth</b> in our business." … "all these things, even if they scale very quickly, are going to take some time to be meaningful at the scale of what the ads business is."' },
  { q:'Where is the ex-FX ad acceleration coming from?', analyst:'Justin Post · Bank of America', theme:'Ads',
    qFull:'Is the advertising acceleration a sign of broader e-commerce acceleration, and which advertisers are driving the dollars?',
    a:'<b>Susan Li:</b> "we saw healthy year-over-year growth across all verticals in Q4 with the exception of politics as we lapped the U.S. presidential election last year. The <b>online commerce vertical was the largest contributor</b> to year-over-year growth." … "That was followed by <b>professional services and technology</b>."' },
  { q:'Plan for Horizon on mobile', analyst:'Ross Sandler · Barclays', theme:'Reality Labs',
    qFull:'Mark mentioned bringing Horizon to mobile; with AI, could this open new areas in gaming or communication, and what is the plan?',
    a:'<b>Mark Zuckerberg:</b> "I don\'t think that <b>video is the ultimate kind of final format</b>." … "you can imagine people being able to, easily through a prompt, <b>create a world or create a game</b> and be able to share that with people who they care about and you see it in your feed and you can jump right into it" … "Horizon, I think, fits very well with the kind of immersive 3D version of that."' },
  { q:'Roadmap for ranking and recommendation models', analyst:'Ron Josey · Citi', theme:'Engagement',
    qFull:'Given gains from GEM, Andromeda, Lattice and model consolidation, where does Meta stand on the ranking and recommendation roadmap, and is it waiting on newer models?',
    a:'<b>Susan Li:</b> "we see a lot of <b>headroom to improve recommendations in 2026</b> which we expect will drive additional engagement growth on both apps." … "in 2026, we\'re expecting to meaningfully <b>scale up GEM training to an even larger cluster</b>" … "This is the first time we have found a <b>recommendation model architecture that can scale with similar efficiency as LLMs</b>."' },
  { q:'Does Meta need a leading general-purpose model?', analyst:'Ken Gawrelski · Wells Fargo', theme:'Meta AI',
    qFull:'How critical is it for Meta to have a leading general-purpose model, versus a model that excels at specific use cases?',
    a:'<b>Mark Zuckerberg:</b> "The way that I think about Meta is we\'re a <b>deep technology company</b>." … "my guess is that <b>Frontier AI</b> for many reasons, some competitive, some safety oriented, are <b>not going to always be available through an API</b> to everyone." … "But yes, I mean I think it\'s quite important. Otherwise, we wouldn\'t be so focused on this."' },
  { q:'Any diminishing returns on ranking and ads investments?', analyst:'Ken Gawrelski · Wells Fargo', theme:'Guidance',
    qFull:'Is Meta seeing signs of diminishing returns on its engagement and ad-relevance investments, and does it have visibility into opportunities beyond 2026?',
    a:'<b>Susan Li:</b> "those investments have <b>generally paid off</b>" … "we\'ve just finished running our 2026 budgeting process, and we have funded a similar set of investments which we expect will enable us to continue delivering strong revenue growth in 2026." … "I expect both full year reported and constant currency revenue growth to be <b>below the levels in Q1</b> for a few reasons."' },
  { q:'Meta AI engagement and usage', analyst:'Mark Mahaney · Evercore', theme:'Meta AI',
    qFull:'What is Meta seeing in Meta AI engagement and usage, and is it only now starting to apply improvements to it?',
    a:'<b>Susan Li:</b> "it\'s now available in <b>over 200 markets</b>." … "it\'s primarily WhatsApp driven, for example, India or Indonesia, in the U.S., Facebook is a stronger driver of engagement." … "we\'re focused on making Meta AI the <b>most personalized assistant</b>"' },
  { q:'No buybacks in the quarter', analyst:'Mark Mahaney · Evercore', theme:'Capital',
    qFull:'Meta did not repurchase stock in the quarter; should investors expect no buybacks for a while?',
    a:'<b>Susan Li:</b> "Right now we think the <b>highest order priority</b> for the company is <b>investing our resources to position ourselves as a leader in AI</b>. And so that\'s kind of the first order of use of capital, but we\'ll continue to be <b>opportunistic</b> and evaluate repurchases versus other uses of cash."' },
  { q:'EU less personalized ads: changes and impact', analyst:'Youssef Squali · Truist Securities', theme:'Ads',
    qFull:'After the EU found the consent-or-pay model in breach of the DMA, what is the new compliant framework (product, timing, pricing), and what is the 2026 revenue and expense impact?',
    a:'<b>Susan Li:</b> "in the coming days, users in Europe will see the changes to the less personalized ads user flow." … "it\'s possible that those changes could result in a <b>materially worse user experience</b> in the European Economic Area in Switzerland." … "The expected impact from the updated user flows that we will be rolling out this quarter is <b>factored into our outlook</b>."' },
  { q:'Is there a minimum operating margin?', analyst:'Youssef Squali · Truist Securities', theme:'Guidance',
    qFull:'Flat operating income on ~20% revenue growth would imply a mid-30s margin versus 41% in 2025; could margins compress that much, or is there a floor?',
    a:'<b>Susan Li:</b> "we <b>don\'t manage to a target margin</b>." … "Over the fullness of time, merely growing operating profit would not make us a very attractive investment opportunity relative to other equity investments. But we believe we have historically delivered above that, and we believe we will over the long run, but that <b>it will be lumpy</b>"' },
  { q:'How durable is the 2026 growth into 2027?', analyst:'Stephen Ju · UBS', theme:'Guidance',
    qFull:'The implied 2026 range suggests roughly $50 billion of revenue dollar growth; what drives it, and how durable is that growth into 2027 and beyond?',
    a:'<b>Susan Li:</b> "we are <b>not giving full-year 2026 revenue guidance</b>." … "sometimes it\'s hard to know for certain where you are on the <b>marginal return curve</b> of how these different initiatives add up." … "there is certainly a <b>wide range of uncertainty</b> through \'26 and even more so, obviously, as you go into 2027."' },
  { q:'What drives Reality Labs losses lower after 2026?', analyst:'Benjamin Black · Deutsche Bank', theme:'Reality Labs',
    qFull:'Reality Labs losses are expected to be stable in 2026 and moderate afterwards; is that from the narrower focus on wearables, faster revenue growth, or something else?',
    a:'<b>Chad Heaton:</b> "consumer adoption of VR has generally been on a <b>slower growth path than wearables</b>, and we are rebalancing our Reality Labs portfolio to reflect this." … "So, we are <b>meaningfully reducing our investment in VR and Horizon</b> this year, but we\'re growing our investment in wearables" … "our expectation is for Reality Labs losses to <b>trend down from 2026 levels</b>, but it\'s hard to characterize the exact shape of that line."' },
  { q:'Cost per action trends for advertisers', analyst:'Benjamin Black · Deutsche Bank', theme:'Ads',
    qFull:'How is cost per action for Meta\'s advertising partners trending?',
    a:'<b>Chad Heaton:</b> "we\'re seeing very strong year-over year growth with <b>conversions growing faster than impressions</b>. In fact, we saw <b>meaningful acceleration</b> in year-over-year conversions growth through Q4" … "we also saw <b>healthy cost per action trends</b> for advertisers in Q4 as well."' },
  { q:'Meta Compute and future capital intensity', analyst:'Shweta Khajuria · Wolfe Research', theme:'Capex',
    qFull:'Given talk of tens of gigawatts of capacity over the decade, is it fair to assume a similar level of capital intensity going forward?',
    a:'<b>Susan Li:</b> "It is <b>somewhat premature to say with certainty</b> what those levels are." … "our focus is on giving ourselves the ability to scale compute up, and to do so in a way that will be at <b>better prices than we\'re able to do today</b>." … "we\'re also continuing to expand our <b>MTIA custom silicon</b> program to support our core ranking and recommendation inference and training workloads."' },
  { q:'Drivers and durability of impression growth', analyst:'Shweta Khajuria · Wolfe Research', theme:'Ads',
    qFull:'What are the key drivers of the healthy impression growth, and how durable is it?',
    a:'<b>Chad Heaton:</b> "worldwide impressions grew <b>18%</b> year-over-year in Q4. That was driven mainly by <b>growth in users and engagement per user</b>. Ad load increases were also a tailwind, although they contributed a minority of the year-over-year growth." … "Reels time grew <b>more than 30%</b> year over-year globally"' },
  { q:'Does AI efficiency mean flat headcount?', analyst:'Barton Crockett · Rosenblatt', theme:'Expenses',
    qFull:'Do Mark\'s comments on flatter teams and fewer people doing more imply headcount growth will slow or reverse, and if so what drives the large 2026 expense growth?',
    a:'<b>Susan Li:</b> "we are currently expecting to <b>continue growing headcount in 2026</b>." … "we expect <b>compensation expenses will continue to grow faster than headcount</b> in 2026." … "depending on how those improvements play out, we may want to add more people if, for example, each engineer can deliver greater impacts than they would have previously."' },
  { q:'Is third-party cloud a temporary bridge?', analyst:'Deepak Mathivanan · Cantor Fitzgerald', theme:'Capex',
    qFull:'Is reliance on third-party cloud temporary until Prometheus and other sites come online, or a lasting part of the compute strategy beyond 2026?',
    a:'<b>Susan Li:</b> "a lot of that CapEx is for capacity that <b>doesn\'t come online until 2027 or beyond</b>. So, we have been <b>signing cloud deals</b> to enable us to bring capacity online more quickly this year to alleviate our current capacity constraints." … "investing in our own data centers gives us greater customization and efficiency and, of course, secures long-term supply."' },
  { q:'Why such a wide capex range?', analyst:'Deepak Mathivanan · Cantor Fitzgerald', theme:'Capex',
    qFull:'The 2026 capex guide is wider than usual; is the uncertainty from cost inflation (data centers, memory, components) or from forecasting compute early in the year?',
    a:'<b>Susan Li:</b> "We are <b>four weeks in</b>, and the infra capacity process was very dynamic last year" … "there are a lot of variables that are fluctuating that will influence where we land in the range, including things like the <b>availability and pricing of different components</b>, servers obviously, but other components too, such as <b>memory and storage</b>, as well as the timing, and magnitude of leases that we sign this year for future capacity."' },
  { q:'Is owned capacity margin-enhancing at steady state?', analyst:'Michael Nathanson · MoffettNathanson', theme:'Capex',
    qFull:'Once capacity is fully built and more demand moves to Meta\'s own data centers instead of leased capacity, would that be margin-enhancing?',
    a:'<b>Chad Heaton:</b> "I chuckled a little bit when you said steady state world. I think we are, if nothing, <b>not in a steady state world</b>, we\'re in a remarkably dynamic one." … "Over the longer term, we believe that having <b>owned and operated capacity</b> gives us, again, more flexibility to configure the capacity exactly to our needs."' },
  { q:'How will agentic commerce tools be monetized?', analyst:'Michael Nathanson · MoffettNathanson', theme:'Messaging',
    qFull:'As people adopt agentic commerce products, will Meta charge commerce partners a fee or offer them free, and how will it monetize these tools?',
    a:'<b>Chad Heaton:</b> "this is just an area we\'re going to be exploring. We\'re going to be looking at <b>subscriptions for high-value AI features</b>. One feature of that will be <b>Manus</b>, as we\'ve talked about." … "The other thread here is <b>business messaging</b>, where we\'re starting to see traction with the business AIs we\'ve made available in Mexico and the Philippines."' },
  { q:'How close is the ceiling on engineer productivity?', analyst:'Justin Patterson · KeyBanc', theme:'Expenses',
    qFull:'How close is Meta to a ceiling on productivity gains per engineer, and how is that affecting product velocity?',
    a:'<b>Susan Li:</b> "The big change that we saw in the second half of 2025, particularly in Q4, has been the increased effectiveness of <b>agentic coding tools</b>" … "the percentages we cited are really talking about the <b>number of code changes landed per engineer</b>" … "our engineers will also, are probably <b>early in the life cycle</b> of kind of learning how to use them with maximum effectiveness."' },
  { q:'Reels on TV: time spent and ad opportunity', analyst:'Justin Patterson · KeyBanc', theme:'Engagement',
    qFull:'Reels launched on TV in Q4; how does Meta think about the time-spent and advertising opportunity there?',
    a:'<b>Chad Heaton:</b> "that\'s a fairly recent launch of IGTV with select partners. And we are in the <b>early stages of evaluating the results</b>." … "I think it\'d probably be <b>premature to talk about impacts</b> on things like time spent or advertising opportunities."' },
  { q:'OBBBA impact on the 2026 capex guide', analyst:'Tom Champion · Piper Sandler', theme:'Capital',
    qFull:'Did the new US tax law (OBBBA) have any impact on the 2026 capex guide?',
    a:'<b>Susan Li:</b> "we expect <b>substantial cash tax savings</b> from the new U.S. tax laws given the significant investments that we\'re making in infrastructure and R&D. So, we expect that that will <b>benefit our cash taxes paid in 2026</b>."' },
  { q:'What is strategically unique about Manus?', analyst:'Tom Champion · Piper Sandler', theme:'Meta AI',
    qFull:'Could management give a simple explanation of Manus and what makes the asset unique and strategically important?',
    a:'<b>Susan Li:</b> "we\'ll both keep sort of the existing Manus business running as is, but we\'re planning to leverage the technologies that Manus is building to help <b>power the business agent work</b> that we are building, which is a big driver of sort of <b>new revenue opportunities</b> for us." … "we think that <b>general purpose agents</b> will be a very important part of the overall consumer and business product experience"' }
],
      take:'A record close to 2025 (revenue +24%, 41% margin, EPS $8.88) that set the frame for the year to come: FY26 capex at <b>$115–135B</b>, Meta Compute as an efficiency thesis, and "2026 is the year AI changes how we work." Strong ad engine, but the story is the setup for a very large spend year.',
      highlights:[
        { tag:'thesis', band:'lead', head:'FY26 capex framed at <b>$115–135B</b> + Meta Compute — the spend year is set.',
          open:'How much does it climb from here, and what returns? The frame is large and explicitly a starting point; the ROIC question was left for execution.',
          detail:'<p>Management set the initial FY26 capex guide at $115–135B and introduced <b>Meta Compute</b> — the thesis that being the most efficient at building infrastructure becomes a strategic advantage. <b>Dina Powell McCormick</b> joined as President & Vice Chairman to lead sovereign / strategic-capital partnerships for long-term capacity. The setup for a very large, AI-driven spend year.</p>' },
        { tag:'thesis', band:'context', head:'Ad engine record holiday strength — revenue +24%, price/ad +6%, impressions +18%.',
          detail:'<p>Record-breaking holiday demand + AI-ranking gains (Reels watch-time +30% YoY US; Facebook video double-digit). The cash engine funding the AI build.</p>' },
        { tag:'thesis', band:'context', head:'"2026 is the year AI changes how we work" — leaner, AI-native, flatter teams.',
          detail:'<p>Mark: investing in AI-native tooling, elevating ICs, flattening teams; "projects that used to require big teams now done by a single talented person." The efficiency offset to the capex ramp — to show up in 2026.</p>' },
        { tag:'thesis', band:'context', head:'Reality Labs — losses "likely the peak" this year; investment pivots to glasses.',
          detail:'<p>RL rev $955M (−12%) on Quest lapping; losses ~flat this year and "likely the peak," then gradually declining. Investment redirected to glasses/wearables (tripled sales) + making Horizon/VR sustainable.</p>' },
        { tag:'watch', band:'logged', head:'Expenses +40% — the cost ramp is real; margin held only on revenue speed.',
          detail:'<p>Total expenses $35.1B (+40%) on AI-talent comp, legal expense, and infrastructure (depreciation + cloud). The 41% margin held because revenue grew +24% — a dynamic to watch as growth normalizes.</p>' },
        { tag:'watch', band:'logged', head:'Tax rate 10% — a clean quarter between the tax-noisy Q3\'25 and Q1\'26.',
          detail:'<p>Tax rate 10% (below the 12–15% outlook) on settlements. Contrast with the Q3\'25 $15.93B non-cash R&D-capitalization charge and the Q1\'26 $8.03B partial reversal.</p>' },
      ],
      dots:'The Q4 print planted the two tensions that dominate 2026: the <b>capex frame</b> ($115–135B, explicitly a floor) and the <b>AI roadmap</b> (models "shipping soon"). Both resolved toward "bigger and later" in Q1 2026 — capex raised to $125–145B and the first model (Muse Spark) shipping on engagement, not revenue — which is exactly the spend-vs-proof debate that carried forward.',
      threeMinutes:[
        '<b>Record close to 2025, but the story is the setup for a huge spend year.</b> Revenue +24%, 41% margin, EPS $8.88 — and FY26 capex framed at $115–135B (a floor) with Meta Compute as the efficiency thesis. Watch how much higher it climbs.',
        '<b>The ad engine delivered a record holiday</b> (+24%, price/ad +6%) on AI ranking — the cash engine that has to fund the AI build. Durability into 2026 comps is the tell.',
        '<b>Two forward tensions planted:</b> the capex frame (explicitly a starting point) and the AI roadmap (models "shipping soon"). Both are the spend-vs-proof debate that defines the year — and 2026 is framed as when AI changes how Meta itself works (leaner, flatter).',
      ],
      notBringing:[
        {item:'Reality Labs quarterly revenue', why:'$955M (−12%) is Quest-lapping noise; the signal is the loss-peak framing.'},
        {item:'Tax rate 10%', why:'A clean quarter, but tax is noise across these prints — not thesis-moving.'},
        {item:'Individual engagement stats', why:'Reels/video gains are real but everyone has the release; the debate is the capex frame.'},
      ],
      newQuestions:[
        {n:'How big does the 2026 capex ramp get from the $115–135B frame?', landed:{q:'Q1 2026', rank:1}},
        {n:'Do the first MSL models ship credibly?', landed:{q:'Q1 2026', rank:2}},
        {n:'Does the ad engine hold as holiday comps roll off?', landed:{q:'Q1 2026', rank:3}},
        {n:'Is the Reality Labs loss peak real?', landed:{q:'Q1 2026', rank:4}},
        {n:'Does the "leaner, AI-native" model show up in headcount/opex?', landed:{q:'Q1 2026', rank:5}},
      ] } },
]};
