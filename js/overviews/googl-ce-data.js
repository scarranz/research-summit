// overviews/googl-ce-data.js — the DATA behind Alphabet's Evolution ▸ Earnings.
//
// The rendering is Amazon's machinery, extracted into ./googl-ce.js (a copy of ./meta-ce.js, the guide-built TSM copy);
// this file is the only part that is Alphabet's. Two objects, the same shape amzn.js inlines:
//   GOOGL_CE_CONS — the estimate grid and "The print" cards: DOAA351's BBG_CONSENSUS.txt archive parse (Jul 2026,
//     12 snapshots to 2026-07-28), rebuilt at load from js/results-data/googl.js for every line Results carries.
//   GOOGL_CALL_EARNINGS — per quarter, newest first: setup (notes, Summit `us`), results and the call.
//     Call summaries (Q4 2025, Q1 2026, Q2 2026): every management quote is verbatim from Alphabet's official IR transcripts
//     (s206.q4cdn.com …/2025_Q4_Earnings_Transcript.pdf, 2026_Q1_…, 2026_Q2_…; downloaded Oct 26 2026), checked quote by quote
//     and speaker by speaker against those PDFs. docs/calls/GOOGL*.md is an unlabelled, unedited copy and is not quoted.

import { googlResults } from '../results-data/googl.js';

// ── CE_CONS — the consensus archive spine (DOAA351, Jul 2026; moved here from googl.js unchanged) ─────────
export var GOOGL_CE_CONS = {
  src:'Bloomberg (BST) · BBG_CONSENSUS.txt snapshot archive',
  asOf:['2023-10-26','2024-02-01','2024-04-27','2024-07-25','2024-10-31','2025-02-06','2025-04-26','2025-07-25','2025-10-31','2026-02-06','2026-05-01','2026-07-28'],
  q:['Q4 2022','Q1 2023','Q2 2023','Q3 2023','Q4 2023','Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026','Q2 2026','Q3 2026','Q4 2026','Q1 2027','Q2 2027'],
  hz:['4q out','3q out','2q out','1q out'],
  nHead:9,
  m:[
    { k:'Revenue', u:'$B', t:'ok', code:'SALES_REV_TURN',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,72.1],[null,null,67.2,66.4],[null,71.1,70.4,71.4],[73.6,72.4,73.5,72.8],[81.4,82.4,81.9,82.4],[75.1,76.8,76.9,75.5],[80.9,81.6,80.5,79.4],[84.2,84.1,82.6,85.1],[92.1,90.6,92.8,94.6],[84.5,86.2,88.2,91.1],[91.6,93.8,96.7,99.7],[99.4,102.5,105.6,110],[112.7,116.3,121.9,null],[111.2,119.7,null,null],[129.1,null,null,null]],
      qa:[76,69.8,74.6,76.7,86.3,80.5,84.7,88.3,96.5,90.2,96.4,102.3,113.8,109.9,119.8,null,null,null,null],
      qy:[null,null,null,null,76,69.8,74.6,76.7,86.3,80.5,84.7,88.3,96.5,90.2,96.4,102.3,113.8,109.9,119.8],
      qq:[null,76,69.8,74.6,76.7,86.3,80.5,84.7,88.3,96.5,90.2,96.4,102.3,113.8,109.9,119.8,null,null,null] },
    { k:'Gross profit', u:'$B', t:'ok', code:'GROSS_PROFIT',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,47],[null,null,44.1,44.7],[null,47.1,47.5,48.3],[48.2,48.5,49.1,49.5],[53.6,54.4,54.7,55.5],[50.9,51.6,52.1,51.8],[54.3,54.8,54.6,54.7],[57,57,56.8,58.2],[62.1,61.9,62.9,64.6],[58.7,59.4,61.4,63.2],[62.9,64.9,66.9,70],[67.8,70.5,73.5,76.1],[77.6,81,84.2,null],[78.2,81.8,null,null],[86.7,null,null,null]],
      qa:[40.7,39.2,42.7,43.5,48.7,46.8,49.2,51.8,55.9,53.9,57.4,61,68.1,68.6,73.9,76.2,null,null,null],
      qy:[null,null,null,null,40.7,39.2,42.7,43.5,48.7,46.8,49.2,51.8,55.9,53.9,57.4,61,68.1,68.6,73.9],
      qq:[null,40.7,39.2,42.7,43.5,48.7,46.8,49.2,51.8,55.9,53.9,57.4,61,68.1,68.6,73.9,null,null,null] },
    { k:'Operating income', u:'$B', t:'ok', code:'IS_COMPARABLE_EBIT',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,23.3],[null,null,21.9,22],[null,24.2,24.4,26.1],[24.3,24.5,25.9,26.4],[27.6,28.7,29.6,30.4],[28.2,28.9,29.1,28.8],[31.1,31.1,30.8,30.8],[32.1,32.1,31.7,32.7],[35.3,34.8,35.6,36.7],[33.1,33.9,35.1,35.8],[35.9,37.3,37.8,40],[39,39.6,41.7,42.7],[44.2,45.7,47.5,null],[46.3,49.2,null,null],[51.4,null,null,null]],
      qa:[18.2,17.4,21.8,21.3,23.7,25.5,27.4,28.5,31,30.6,31.3,31.2,35.9,39.7,40.8,null,null,null,null],
      qy:[null,null,null,null,18.2,17.4,21.8,21.3,23.7,25.5,27.4,28.5,31,30.6,31.3,31.2,35.9,39.7,40.8],
      qq:[null,18.2,17.4,21.8,21.3,23.7,25.5,27.4,28.5,31,30.6,31.3,31.2,35.9,39.7,40.8,null,null,null] },
    { k:'EBITDA', u:'$B', t:'ok', code:'IS_COMPARABLE_EBITDA',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,33.9],[null,null,31.5,31.5],[null,34.2,34.1,35.7],[34.3,34.5,35.6,36],[37.9,38.8,39,40],[37.5,38.3,38.9,39.1],[41.2,41.7,41.4,41.6],[42.9,43.4,43,44.7],[46.5,49.7,50.4,49.6],[41.9,43.6,46.1,49.4],[48.5,50.4,55.1,54.7],[52.3,55.2,57.6,58.6],[61,63.1,64.4,null],[65.1,67,null,null],[71.6,null,null,null]],
      qa:[27.5,25.9,31,30.9,32.7,34.1,37,38.4,35.2,40.6,42.3,43.2,49,46.2,55.8,57.6,null,null,null],
      qy:[null,null,null,null,27.5,25.9,31,30.9,32.7,34.1,37,38.4,35.2,40.6,42.3,43.2,49,46.2,55.8],
      qq:[null,27.5,25.9,31,30.9,32.7,34.1,37,38.4,35.2,40.6,42.3,43.2,49,46.2,55.8,null,null,null] },
    { k:'EPS (diluted)', u:'$', t:'ok', code:'IS_COMP_EPS_GAAP',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,1.61],[null,null,1.49,1.52],[null,1.67,1.68,1.81],[1.67,1.7,1.82,1.83],[1.91,2.02,2.04,2.12],[2.03,2.03,2.04,2.02],[2.18,2.19,2.17,2.16],[2.27,2.26,2.24,2.32],[2.47,2.47,2.54,2.62],[2.37,2.44,2.54,2.61],[2.59,2.7,2.76,2.86],[2.82,2.88,2.97,3.02],[3.2,3.26,3.36,null],[3.32,3.47,null,null],[3.6,null,null,null]],
      qa:[1.05,1.17,1.44,1.55,1.64,1.89,1.89,2.12,2.15,2.81,2.31,2.87,2.82,5.11,9.11,null,null,null,null],
      qy:[null,null,null,null,1.05,1.17,1.44,1.55,1.64,1.89,1.89,2.12,2.15,2.81,2.31,2.87,2.82,5.11,9.11],
      qq:[null,1.05,1.17,1.44,1.55,1.64,1.89,1.89,2.12,2.15,2.81,2.31,2.87,2.82,5.11,9.11,null,null,null] },
    { k:'Operating cash flow', u:'$B', t:'ok', code:'CB_CF_NET_CASH_OPERATING_ACT',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,24.7],[null,null,28.5,31.1],[null,32.1,31.9,35.4],[31.3,31.1,32.9,36.5],[30.1,31.4,33.2,40.4],[33.3,35.1,35.8,36.7],[35.2,36,35.7,35.1],[38.9,38.2,37.7,42],[42,41.4,45.5,45.7],[41.6,42.9,45,47.6],[38.4,41.4,44.3,46.2],[53.2,56.4,57.9,53.9],[60.5,62.2,57.7,null],[61,62.1,null,null],[66,null,null,null]],
      qa:[null,null,null,30.7,18.9,28.8,26.6,30.7,39.1,36.1,27.7,48.4,52.4,45.8,39.1,42.3,null,null,null],
      qy:[null,null,null,null,null,null,null,30.7,18.9,28.8,26.6,30.7,39.1,36.1,27.7,48.4,52.4,45.8,39.1],
      qq:[null,null,null,null,30.7,18.9,28.8,26.6,30.7,39.1,36.1,27.7,48.4,52.4,45.8,39.1,null,null,null] },
    { k:'Capex', u:'$B', t:'ok', code:'CF_PURCHASE_OF_FIXED_PROD_ASSETS',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,9.2],[null,null,8.7,10.1],[null,8.8,10.5,11.8],[9.2,10.7,12.1,12.8],[11.3,12.4,13,13.1],[12.3,13.4,13.9,16.8],[13.9,14.5,17.9,18.2],[14.9,18.6,19.1,21.9],[20,20.4,22.7,27.8],[18.9,21.7,27.2,35.9],[23.6,29.1,41.7,43.6],[30.5,46.9,49.6,54.6],[53,56.6,63.5,null],[53.6,64.2,null,null],[70.1,null,null,null]],
      qa:[7.6,6.3,6.9,8.1,11,12,13.2,13.1,14.3,17.2,22.4,24,27.9,35.7,44.9,null,null,null,null],
      qy:[null,null,null,null,7.6,6.3,6.9,8.1,11,12,13.2,13.1,14.3,17.2,22.4,24,27.9,35.7,44.9],
      qq:[null,7.6,6.3,6.9,8.1,11,12,13.2,13.1,14.3,17.2,22.4,24,27.9,35.7,44.9,null,null,null] },
    { k:'D&A', u:'$B', t:'ok', code:'CF_DEPR_AMORT',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,4.1],[null,null,3.9,3.7],[null,4,3.9,3.8],[4.3,4.1,4.1,4.2],[4.3,4.3,4.4,4.3],[4.2,4.5,4.5,4.6],[4.8,4.8,5,5],[5.1,5.4,5.4,5.6],[5.7,5.9,6.1,6.2],[6.1,6.2,6.4,7],[6.7,7.2,8.4,8.4],[8,9.9,10.1,8.3],[11.8,12.1,9.5,null],[10.5,11.1,null,null],[11.8,null,null,null]],
      qa:[4.2,3.2,3.4,3.8,3.3,3.4,3.7,4,4.2,4.5,5,5.6,6,6.5,7.1,8.4,null,null,null],
      qy:[null,null,null,null,4.2,3.2,3.4,3.8,3.3,3.4,3.7,4,4.2,4.5,5,5.6,6,6.5,7.1],
      qq:[null,4.2,3.2,3.4,3.8,3.3,3.4,3.7,4,4.2,4.5,5,5.6,6,6.5,7.1,null,null,null] },
    { k:'Diluted shares', u:'B', t:'ok', code:'IS_SH_FOR_DILUTED_EPS',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,12.67],[null,null,12.59,12.54],[null,12.52,12.48,12.48],[12.46,12.42,12.42,12.43],[12.37,12.37,12.38,12.36],[12.31,12.33,12.32,12.3],[12.28,12.27,12.26,12.23],[12.23,12.22,12.18,12.14],[12.18,12.13,12.09,12.15],[12.1,12.03,12.11,12.19],[11.97,12.07,12.16,12.22],[12.02,12.14,12.21,12.32],[12.11,12.19,12.34,null],[12.15,12.31,null,null],[12.32,null,null,null]],
      qa:[12.95,13.71,13.64,12.7,12.6,12.53,12.49,12.42,12.35,12.29,12.2,12.2,12.23,12.24,12.31,12.37,null,null,null],
      qy:[null,null,null,null,12.95,13.71,13.64,12.7,12.6,12.53,12.49,12.42,12.35,12.29,12.2,12.2,12.23,12.24,12.31],
      qq:[null,12.95,13.71,13.64,12.7,12.6,12.53,12.49,12.42,12.35,12.29,12.2,12.2,12.23,12.24,12.31,null,null,null] },
    { k:'Google Cloud', u:'$B', t:'ok', code:'SALES_REV_TURN',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,9],[null,null,9.1,9.4],[null,9.8,10,10.2],[10.3,10.5,10.7,10.8],[11.3,11.5,11.7,12.1],[11.8,12,12.4,12.3],[12.9,13.2,13.2,13.1],[14.3,14.4,14.3,14.7],[15.3,15.2,15.5,16.1],[15.3,15.7,16.4,18.2],[17.3,18,19.9,21.7],[19.8,21.9,24.2,27.8],[24.5,27.3,32.3,null],[29.2,33.9,null,null],[38.1,null,null,null]],
      qa:[7.3,7.5,8,8.4,9.2,9.6,10.3,11.4,12,12.3,13.6,15.2,17.7,20,24.8,null,null,null,null],
      qy:[null,null,null,null,7.3,7.5,8,8.4,9.2,9.6,10.3,11.4,12,12.3,13.6,15.2,17.7,20,24.8],
      qq:[null,7.3,7.5,8,8.4,9.2,9.6,10.3,11.4,12,12.3,13.6,15.2,17.7,20,24.8,null,null,null] },
    { k:'Search & other', u:'$B', t:'ok', code:'SALES_REV_TURN',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,47.8],[null,null,44.8,44.9],[null,46.9,46.9,47.5],[48.4,48.1,48.3,47.7],[52.2,52.5,51.6,52],[49.8,50.4,50.6,50.5],[50.4,53.1,53.1,52.8],[54,54.1,53.5,54.6],[59.1,58.7,59.6,61],[55.2,55.9,57,58.9],[58.9,60.2,62,63],[61.9,63.8,64.7,64.9],[70.2,71.3,71.4,null],[67.1,67.9,null,null],[71.1,null,null,null]],
      qa:[42.6,40.4,42.6,44,48,46.2,48.5,49.4,54,50.7,54.2,56.6,63.1,60.4,63.3,null,null,null,null],
      qy:[null,null,null,null,42.6,40.4,42.6,44,48,46.2,48.5,49.4,54,50.7,54.2,56.6,63.1,60.4,63.3],
      qq:[null,42.6,40.4,42.6,44,48,46.2,48.5,49.4,54,50.7,54.2,56.6,63.1,60.4,63.3,null,null,null] },
    { k:'Revenue backlog (RPO)', u:'$B', t:'ok', code:'BS_REMAINING_PERFORMANCE_OBLIG',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,74.6],[null,null,null,74.9],[null,null,77.1,77],[null,80.8,81,83.3],[96.1,96,98.6,90.2],[97,100,99.3,94.2],[102.2,101.3,96.2,96.2],[104.3,99.2,99.2,111.2],[115.2,115.2,127.2,136.4],[null,null,null,190],[null,null,129.5,318],[null,110.2,330.6,530.9],[192,457.3,552.6,null],[519.6,572.7,null,null],[602.5,null,null,null]],
      qa:[64.3,61.7,60.6,64.9,74.1,72.5,78.8,86.8,93.2,92.4,108.2,157.7,242.8,467.6,519.5,567.7,null,null,null],
      qy:[null,null,null,null,64.3,61.7,60.6,64.9,74.1,72.5,78.8,86.8,93.2,92.4,108.2,157.7,242.8,467.6,519.5],
      qq:[null,64.3,61.7,60.6,64.9,74.1,72.5,78.8,86.8,93.2,92.4,108.2,157.7,242.8,467.6,519.5,null,null,null] },
    { k:'Cloud operating income', u:'$B', t:'ok', code:'IS_OPER_INC',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,0.4],[null,null,0.5,0.6],[null,0.6,0.8,0.8],[0.7,0.8,0.8,1.1],[1.2,1.2,1.4,1.9],[1.2,1.5,1.9,1.9],[1.7,2.2,2.2,2.2],[2.6,2.6,2.6,2.9],[2.8,2.8,3.2,3.6],[2.9,3.1,3.5,4.8],[3.7,4.1,5.8,6.7],[4.8,6.2,7.5,9.2],[7.6,8.7,10.6,null],[9.7,11.5,null,null],[13.3,null,null,null]],
      qa:[-0.5,0.2,0.4,0.3,0.9,0.9,1.2,1.9,2.1,2.2,2.8,3.6,5.3,6.6,8.8,null,null,null,null],
      qy:[null,null,null,null,-0.5,0.2,0.4,0.3,0.9,0.9,1.2,1.9,2.1,2.2,2.8,3.6,5.3,6.6,8.8],
      qq:[null,-0.5,0.2,0.4,0.3,0.9,0.9,1.2,1.9,2.1,2.2,2.8,3.6,5.3,6.6,8.8,null,null,null] },
  ]
};

// ── EV-SET (playbook §EV-SET; the META pattern, meta-ce-data.js): the grid is REBUILT AT LOAD from the Results
// dataset for every line it carries, so Earnings and Results can never disagree:
//   • `1q out` = the dataset's flat `cons` (Bloomberg pre-print, synced to its estMatrix); `4q/3q/2q out` = the
//     estMatrix vintage whose last reported quarter sits that many quarters before; `qa` = the reported actual.
//   • REVENUE is the sum of Bloomberg's segment lines (SAB, 2026-10-26): the archive's SALES_REV_TURN forward column
//     mixes gross and net-of-TAC forecasts (3Q26: $110.2B headline vs $126.5B segment sum), so it is replaced.
//   • the other lines (gross profit, EBITDA, cash flow, D&A, shares, the backlog) keep the archive above. Their
//     Q3 2026 actual (qa) comes from the 3Q26 release and 10-Q (Oct 28–29 2026): gross profit = revenue − cost
//     of revenues; EBITDA = operating income + depreciation + SBC ($40.6B + $8.4B + $8.6B); D&A = depreciation of
//     property and equipment; RPO $567.7B (10-Q).
// Six lines are added to the custom KPIs from Results: Services revenue, YouTube ads, Network, subscriptions,
// Services operating income and TAC.
(function(){
  var M=googlResults.views.q.metrics, MX=googlResults.estMatrix&&googlResults.estMatrix.cons;
  function pOf(q){ return q.charAt(1)+'Q'+q.slice(-2); }                    // 'Q3 2026' → '3Q26'
  function ord(p){ var m=/^(\d)Q(\d{2})$/.exec(p); return m?(2000+(+m[2]))*4+(+m[1]):null; }
  var Q=GOOGL_CE_CONS.q, QP=Q.map(pOf);
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
  var RS={ 'Revenue':['rev',1000], 'Operating income':['opinc',1000], 'EPS (diluted)':['eps',1], 'Capex':['capex',1000],
           'Google Cloud':['cloud',1000], 'Search & other':['search',1000], 'Cloud operating income':['cloudop',1000] };
  GOOGL_CE_CONS.m.forEach(function(m){ if(RS[m.k]){ m.code=(m.k==='Revenue')?'SALES_REV_TURN (segment sum)':m.code; fromResults(m, RS[m.k][0], RS[m.k][1]); } });
  var at=GOOGL_CE_CONS.m.map(function(x){ return x.k; }).indexOf('Google Cloud');
  GOOGL_CE_CONS.m.splice(at, 0, fromResults({ k:'Google Services revenue', u:'$B', t:'ok', code:'SALES_REV_TURN' }, 'svc', 1000));
  var as=GOOGL_CE_CONS.m.map(function(x){ return x.k; }).indexOf('Search & other')+1;
  GOOGL_CE_CONS.m.splice(as, 0,
    fromResults({ k:'YouTube ads', u:'$B', t:'ok', code:'SALES_REV_TURN' }, 'yt', 1000),
    fromResults({ k:'Google Network', u:'$B', t:'ok', code:'SALES_REV_TURN' }, 'net', 1000),
    fromResults({ k:'Subscriptions, platforms & devices', u:'$B', t:'ok', code:'SALES_REV_TURN' }, 'subs', 1000));
  GOOGL_CE_CONS.m.push(
    fromResults({ k:'Services operating income', u:'$B', t:'ok', code:'IS_OPER_INC' }, 'svcop', 1000),
    fromResults({ k:'TAC', u:'$B', t:'ok', code:'INTERNET_TRAFFIC_ACQ_COSTS' }, 'tac', 1000));
  var nv=MX&&MX.vintages[MX.vintages.length-1];
  GOOGL_CE_CONS.src='Bloomberg (BST) · BBG_CONSENSUS.txt — via js/results-data/googl.js (estMatrix'+(nv?', newest snapshot '+nv.id:'')+'; revenue = sum of the segment lines); other lines from the archive parse above (to 2026-07-28)';
})();
// Summit for a quarter's Setup (`setup.us`): READ from the Results dataset, where the model is frozen at its dated
// snapshot (rule 10) — never typed. Only the lines the model projects by quarter (3Q26–4Q26); the rest stay "—".
function ceSummitUs(p){
  var M=googlResults.views.q.metrics, out={};
  [['Revenue','rev',1000],['Operating income','opinc',1000],['Capex','capex',1000],['Google Services revenue','svc',1000],
   ['Google Cloud','cloud',1000],['Search & other','search',1000],['YouTube ads','yt',1000],['Google Network','net',1000],
   ['Subscriptions, platforms & devices','subs',1000],['TAC','tac',1000]].forEach(function(x){
    var r=M[x[1]], i=r?r.periods.indexOf(p):-1, v=(i>=0&&r.summit)?r.summit[i]:null;
    if(v!=null){ v=v/x[2]; out[x[0]]={ v:Math.abs(v)>=10?Math.round(v*10)/10:Math.round(v*100)/100 }; } });
  return out;
}

var SRC_Q3='Bloomberg (BST) — BBG_CONSENSUS.txt, snapshot 2026-09-08 (the newest before the print; revenue = sum of the segment lines) · Summit DCF model — snapshot 2026-08-06, frozen (quarterly projections of revenue, segments, operating income, capex and TAC) · outlook: Q2 2026 earnings call (Jul 22 2026), CFO prepared remarks';
export var GOOGL_CALL_EARNINGS = { ticker:'GOOGL', quarters:[
  // ── REPORTED: Q3 2026 (quarter ended Sep 30 2026; reported Wed Oct 28 2026 after close; 10-Q filed Oct 29).
  // The Setup stays frozen as it stood before the print: Alphabet gives no revenue or EPS guidance; the notes
  // quote the CFO's outlook from the 2Q26 call, verbatim. call:null until Alphabet IR posts the official
  // transcript PDF (quotes come only from it — SAB, Oct 26 2026).
  { q:'Q3 2026', status:'reported', date:'Wed Oct 28, 2026 · after close (call 1:30pm PT / 4:30pm ET)',
    setup:{
      source:SRC_Q3, asOf:'2026-09-08',
      notes:{
        'Revenue':{ t:'No guide; FX turns to a slight headwind', h:'<p>Alphabet does not guide revenue. CFO, 2Q26 call: “at the current spot rates, we would expect a slight FX headwind to our consolidated revenue in Q3 compared to a one percentage point FX tailwind in Q2.”</p><p>The Street line is the sum of Bloomberg\'s segment lines. Bloomberg\'s own headline for this quarter ($110.2B) mixes analysts who forecast gross revenue with analysts who forecast it net of TAC, so it is not used.</p>' },
        'Search & other':{ t:'Laps its own acceleration', h:'<p>CFO, 2Q26 call: “in Q3, we will begin lapping an acceleration in Search performance that began in the third quarter last year.” 2Q26 was +17% (paid clicks +13%, cost-per-click +3%).</p>' },
        'Google Cloud':{ t:'Bridge capacity in Q3; TPU sales small this year', h:'<p>CFO, 2Q26 call: “we plan to expand the use of third-party capacity in Q3 as a bridging strategy while we build out more internal capacity. However, it will create modest margin pressure in the near term as we utilize this capacity.”</p><p>“We continue to expect to recognize a relatively small portion of the revenues from our existing TPU system sales agreements this year, ramping as we exit 2026.”</p>' },
        'Cloud operating income':{ t:'Margin pressure from bridge capacity', h:'<p>2Q26 Cloud margin 35.6%. CFO: the third-party capacity “will put some pressure on operating margins for Cloud.”</p>' },
        'Operating income':{ t:'Depreciation keeps rising', h:'<p>CFO, 2Q26 call: “the significant increase in our investments in technical infrastructure will continue to put pressure on the P&L in the form of higher depreciation expense and related data center operations costs such as energy.”</p>' },
        'Capex':{ t:'FY26 guided $195–205B: about $114–124B left for 2H', h:'<p>CFO, 2Q26 call: “we are updating our full-year 2026 CapEx guidance range to $195 billion-$205 billion, up from our previous estimate of $180 billion-$190 billion.” 1H26 capex was $80.6B ($35.7B + $44.9B).</p><p>“We continue to expect our CapEx to increase significantly in 2027 and will provide more details at a later date.”</p>' },
        'EPS (diluted)':{ t:'GAAP: gains on equity stakes move it', h:'<p>GAAP EPS includes gains and losses on equity securities: in 2Q26 they added $6.26 (other income +$98.0B). The Street\'s GAAP EPS cannot anticipate those marks.</p>' },
        'Revenue backlog (RPO)':{ t:'$519.5B at Jun 30', h:'<p>10-Q 2Q26: “We expect to recognize just over 50% of the revenue backlog as revenues over the next 24 months with the remainder to be recognized thereafter.” $513.9B of it relates to Google Cloud.</p>' },
      },
      us:ceSummitUs('3Q26'),
      debate:{ rows:null, synth:'' },
    },
    results:{ basisNote:'<b>Basis.</b> Net income and EPS include an <b>$8.2B</b> other expense, mostly an <b>$8.7B</b> loss on equity securities (−$0.55 of EPS, per the release). EPS is on net income available to common stockholders, after <b>$298M</b> of preferred dividends.' },
    call:null },

  // ── REPORTED. The print is scored from the grid above (Results dataset + archive). The call summaries carry only
  // verbatim quotes from the official transcript (SAB, Oct 26 2026: no generated text).
  { q:'Q2 2026', status:'reported', date:'Wed Jul 22, 2026 · after close (call 4:30pm ET)',
    setup:{ source:'Bloomberg (BST) — the last snapshot before the print · no Summit snapshot predates this print', asOf:'2026-05-04', notes:{}, us:{}, debate:{ rows:null, synth:'' } },
    results:{ basisNote:'<b>Basis.</b> Net income and EPS include <b>$98.0B</b> of other income, mostly gains on equity securities (+$6.26 of EPS, per the release).' },
    call:{
      prepared:[
        { topic:'Revenue $119.8B, up 24%; operating income $40.8B', theme:'Results',
          body:'<b>Anat Ashkenazi:</b> "We had an outstanding second quarter, delivering our <b>12th consecutive quarter of double-digit revenue growth</b>. Consolidated revenues were <b>$119.8 billion, up 24%</b> with 23% in constant currency." … "Operating income increased <b>30% to $40.8 billion</b>, and operating margin was 34%."' },
        { topic:'Search & other +17% to $63.3B; AI Mode passes one billion monthly users', theme:'Search',
          body:'<b>Anat Ashkenazi:</b> "Google Search and other advertising revenues increased by <b>17% to $63.3 billion</b>, with retail and finance driving the largest contributions."<br><b>Sundar Pichai:</b> "Since expanding AI Mode globally last October, we\'ve <b>surpassed one billion monthly active users</b>. And just like AI Overviews, AI Mode is driving an incremental increase in Search queries overall"<br><b>Philipp Schindler:</b> "We continue to be encouraged with monetization performance on queries that show AI Overviews, even as we\'ve expanded AI Overviews to more commercial queries."' },
        { topic:'YouTube ads +13% to $11.1B; subscriptions +15% to $12.9B', theme:'YouTube',
          body:'<b>Anat Ashkenazi:</b> "YouTube advertising revenues increased <b>13% to $11.1 billion</b>, driven by Direct Response advertising as well as Brand, with strength in the Living Room" … "Subscriptions, Platforms & Devices revenues increased <b>15% this quarter to $12.9 billion</b> due to strong growth in both YouTube subscriptions, particularly YouTube Music and Premium, and Google One, which was driven by demand for AI plans."<br><b>Philipp Schindler:</b> "YouTube\'s Subscription business, which thrives across living room screens, is <b>growing faster than Ads</b>, particularly driven by YouTube Music and Premium."' },
        { topic:'Cloud +82% to $24.8B; margin 35.6%; backlog $514B', theme:'Cloud',
          body:'<b>Anat Ashkenazi:</b> "Cloud revenues were <b>up 82% to $24.8 billion</b>, driven primarily by GCP, which grew faster than Cloud overall." … "operating margin increased from 20.7% in the second quarter last year to <b>35.6%</b>. Google Cloud\'s backlog increased by more than $50 billion sequentially, reaching <b>$514 billion</b> in the second quarter." … "we expect to recognize <b>just over 50% of the total backlog</b> as revenue over the next 24 months."' },
        { topic:'First TPU system sales delivered in Q2', theme:'Cloud',
          body:'<b>Anat Ashkenazi:</b> "We also began to recognize revenues from TPU system sales, which we delivered to customer data centers <b>for the first time in Q2</b>. Cloud revenue growth accelerated meaningfully, even after excluding the impact of TPU system sales." … "We anticipate the <b>vast majority of the revenues from these agreements will be realized in 2027</b>."' },
        { topic:'API tokens 22 billion per minute; Gemini 4 pre-training started', theme:'AI & compute',
          body:'<b>Sundar Pichai:</b> "We have started our <b>most ambitious pre-training run yet for Gemini 4</b> and are excited by the progress we are seeing at the frontier. Demand for our models is translating to strong token usage across developers and enterprise customers, and <b>we continue to be supply constrained</b>, a sign of momentum and rapid adoption." … "Our model APIs are now processing approximately <b>22 billion tokens per minute</b>. That\'s up from 16 billion just a quarter ago."' },
        { topic:'Other Bets revenue $382M, operating loss $1.8B', theme:'Other Bets',
          body:'<b>Anat Ashkenazi:</b> "In Other Bets, revenues were <b>$382 million</b>, and operating loss was <b>$1.8 billion</b> as we continue to expand Waymo\'s business and invest in key Other Bets."<br><b>Sundar Pichai:</b> "Waymo introduced its newest vehicle, Ojai, to public riders. This is the first vehicle powered by the <b>sixth-generation Waymo Driver</b> and will welcome more riders in the coming months."' },
        { topic:'Q2 capex $44.9B; free cash flow negative $5.9B', theme:'Costs',
          body:'<b>Anat Ashkenazi:</b> "CapEx was <b>$44.9 billion</b> in the second quarter, with the vast majority of the spend in technical infrastructure to support our investments in AI." … "We had <b>negative free cash flow of $5.9 billion</b> in the second quarter, driven by our investments in CapEx." … "the significant increase in our investments and technical infrastructure will continue to put pressure on the P&L in the form of <b>higher depreciation expense</b> and related data center operations costs, such as energy."' },
        { topic:'FY2026 capex guide raised to $195-205B', theme:'Capex',
          body:'<b>Anat Ashkenazi:</b> "we are updating our full year 2026 CapEx guidance range to <b>$195-205 billion</b>, up from our previous estimate of $180-190 billion. The increase in the range is primarily due to an acceleration in the delivery of capacity to meet growing demand." … "we continue to expect our <b>CapEx to increase significantly in 2027</b>, and we\'ll provide more details at a later date."' },
      ],
      qanda:[
        { q:'GenAI return view versus a year ago; 2027 capex budgeting', analyst:'Brian Nowak · Morgan Stanley', theme:'Capex',
          qFull:'How has your view on the size of the overall gen AI ROIC opportunity and the timing of the ROIC changed versus one year ago? And on forward CapEx: how are your budgeting philosophy and the constraints you\'re putting on forward spend changing as you think about the right amount to spend in 2027 to close this capacity constraint?',
          a:'<b>Sundar Pichai:</b> "So it feels like, if anything, over the past year, we have gotten <b>more bullish</b> on the opportunities ahead."<br><b>Anat Ashkenazi:</b> "And our goal is to invest as long as we see an attractive return on that investment, as Sundar mentioned earlier." … "while we have increased our capacity quite significantly over the past three years, <b>the demand still outpaces that investment</b>."' },
        { q:'Staying at the frontier, the coding gap, capital structure', analyst:'Doug Anmuth · JP Morgan', theme:'AI & compute',
          qFull:'How confident are you that the Gemini models can remain at the frontier, and what are your plans for coding and to close the gap in that part of enterprise? And following the recent equity and debt raises, how do you think about optimal capital structure and the cost of debt versus equity?',
          a:'<b>Sundar Pichai:</b> "There are areas where we have acknowledged we need to improve. <b>Coding and agentic coding</b> is an example of that, and I think the teams are very, very focused on it."<br><b>Anat Ashkenazi:</b> "If you\'ve seen a year ago, we were at about <b>$16 billion</b>; and we went to about <b>$100 billion</b> across multiple currencies and geographies." … "At this point, <b>we\'re not planning to go back to the equity markets</b>"' },
        { q:'TPU allocation internal vs external; TPUs in backlog', analyst:'Eric Sheridan · Goldman Sachs', theme:'Cloud',
          qFull:'What are your key learnings as you scale TPUs, and how do you balance external demand for TPUs against internal demand for custom silicon over the next couple of years? How large are TPUs as a part of the revenue backlog, and how should we think about revenue recognition and the potential margin impact from TPUs in the years ahead?',
          a:'<b>Sundar Pichai:</b> "our first priority is making sure we are allocating what we need to compete at the frontier in terms of AGI development."<br><b>Anat Ashkenazi:</b> "Now, the vast majority of the $514 billion of cloud backlog is the GCP agreements. But <b>the TPU system sales are reflected in that backlog</b>." … "This quarter was a small amount of that total agreement."' },
        { q:'Pace of model releases; is Flash the right segment?', analyst:'Ross Sandler · Barclays', theme:'AI & compute',
          qFull:'How can Gemini speed up the cadence of model releases, beyond the third-party compute deal with SpaceX? And given how crowded the lower-cost end of the model space has become, is Flash the right end of the market to be in?',
          a:'<b>Sundar Pichai:</b> "We want to make sure for our customers we are offering our best models at various price points." … "And so picking up pace and releasing models <b>almost at a monthly cadence</b> is part of our roadmap as we are building Gemini 4 as well."' },
        { q:'Moats if models converge; TPU margin versus core Cloud', analyst:'Michael Nathanson · MoffetNathanson', theme:'Cloud',
          qFull:'What are the moats in this new model war: even with the same type of model capabilities, what gives you the edge to keep growing? And on TPUs, is it incremental margin to the core cloud margin, or a lower margin coming through?',
          a:'<b>Sundar Pichai:</b> "And so the model is just an ingredient in those solutions"<br><b>Anat Ashkenazi:</b> "And on the TPU margins, <b>we don\'t break out margins</b> for any specific products or infrastructure component" … "That capacity, given the cost of that capacity, will put some pressure on operating margins for Cloud. And then the last item we mentioned in the past was the integration of Wiz does create some headwind here in the near-term in 2026 related to the acquisition."' },
        { q:'Where capacity is tightest; compute allocation across businesses', analyst:'Mark Shmulik · Bernstein', theme:'AI & compute',
          qFull:'Anat, on the third-party deals and the bridge in capacity, are the constraints most severe in a particular area, or broad-based? Has capacity allocation across the businesses changed, and how do you think about the tradeoffs between allocating compute to Search versus model training versus the GCP business?',
          a:'<b>Sundar Pichai:</b> "the baseline with which we start is what it takes to continue AGI development at the frontier." … "And the incremental opportunities they are bringing to us, while a <b>short-term cost over a few months may be very high</b>, in the lifetime of the deal, as we bring more capacity on, is highly ROI-positive."' },
        { q:'What drives 17% Search growth; AI targeting for advertisers', analyst:'Ron Josey · Citi', theme:'Search',
          qFull:'Philipp, how are advertisers leveraging the greater signal from AI searches and Google\'s personalization and targeting to drive ROAS on Search and YouTube? At Google\'s size and scale, what is driving 17% growth and the all-time high on Searches?',
          a:'<b>Philipp Schindler:</b> "our 17% year-over-year growth rate in the Q2 Search and Other revenues was really driven by many parts of our business working well together and very, very deep Gemini integration." … "And AI Max continues to unlock -- we mentioned this -- <b>billions of net new searches that weren\'t really monetizable before</b>."' },
        { q:'Returns on 2027 compute vs prior years; Waymo outside Alphabet?', analyst:'Ken Gawrelski · Wells Fargo', theme:'Other Bets',
          qFull:'How do the forecasted returns on compute capacity investments in \'27 compare with \'25 and \'26, given supply chain constraints and supply chain inflation? And what are the key factors in evaluating a change in corporate structure for Waymo; under what conditions would it make sense for Waymo to live outside of Alphabet?',
          a:'<b>Sundar Pichai:</b> "Obviously, to the extent that our input costs going up to us, we reflect that in our ability to price our solutions and see returns there." … "And so, I think, if anything, <b>the dynamics look healthier than where we were about a year ago</b>." … "We\'re really focused on scaling the business right now and executing to that extraordinary potential, and that\'s what we are focused on."' },
        { q:'TPU merchant silicon business; what could accelerate YouTube', analyst:'Shweta Khajuria · Wolfe Research', theme:'YouTube',
          qFull:'Longer term, as TPU sales scale, is it fair to think you\'d build a merchant silicon business with a software stack that goes with it? And given how strong engagement is, what factors could drive an accelerating growth rate at YouTube?',
          a:'<b>Sundar Pichai:</b> "So I don\'t want to project out too far into the future there. But I do think we are -- obviously, we will scale up based on the opportunities we see and the demand we see"<br><b>Philipp Schindler:</b> "We see opportunities in Direct Response, particularly with Demand Gen and Shorts, which I mentioned remain a really interesting opportunity here to expand our base to more small and medium advertisers across more verticals"' },
      ],
      highlights:[
        { tag:'watch', band:'lead', open:'How much did third-party capacity weigh on the Cloud operating margin in Q3?',
          head:'Third-party capacity in Q3 as a bridging strategy, with modest near-term margin pressure',
          detail:'<p><b>Anat Ashkenazi:</b> "And given the supply constraint environment, we plan to expand the use of third-party capacity in Q3 as a bridging strategy while we build out more internal capacity. This strategy allows us to keep growing our customer base and capture greater overall value. However, it will create <b>modest margin pressure in the near-term</b> as we utilize this capacity."</p>' },
        { tag:'watch', band:'lead', open:'What was Search & other growth in Q3 against the lapped acceleration and the FX headwind?',
          head:'Q3 laps the Search acceleration that began in the third quarter last year; a slight FX headwind after a one percentage point tailwind in Q2',
          detail:'<p><b>Anat Ashkenazi:</b> "at the current spot rates, we would expect a <b>slight FX headwind</b> to our consolidated revenue in Q3, compared to a one percentage point FX tailwind in Q2. This impact will be seen primarily in Search and YouTube Ads." … "in Q3, we will begin <b>lapping an acceleration in Search performance</b> that began in the third quarter last year."</p>' },
        { tag:'thesis', band:'context',
          head:'Gemini App at 950 million monthly active users',
          detail:'<p><b>Sundar Pichai:</b> "Next, the Gemini App, which now has <b>950 million monthly active users</b>, with daily active users tripling in the last year."</p>' },
        { tag:'curious', band:'context',
          head:'Cost of AI Mode responses at its lowest level since launch',
          detail:'<p><b>Sundar Pichai:</b> "Thanks to our engineering and hardware optimizations, this quarter we reduced the <b>cost of AI Mode responses to its lowest level since launch</b>, even as we have brought more advanced AI capabilities."</p>' },
        { tag:'curious', band:'context',
          head:'Other income and expenses of $98 billion, mainly unrealized gains on equity securities',
          detail:'<p><b>Anat Ashkenazi:</b> "Other income and expenses was <b>$98 billion</b>, representing a substantial increase from the prior year, primarily due to <b>unrealized gains in our equity securities portfolio</b>. Net income and earnings per share increased significantly, primarily due to the unrealized gains in OI&E I just mentioned."</p>' },
        { tag:'logged', band:'logged',
          head:'Network advertising revenues $7.3B, down 1%',
          detail:'<p><b>Anat Ashkenazi:</b> "Network advertising revenues of <b>$7.3 billion were down 1%</b>."</p>' },
        { tag:'logged', band:'logged',
          head:'Balance sheet: $242.5B cash and marketable securities; long-term debt $98.2B; dividend 22 cents',
          detail:'<p><b>Anat Ashkenazi:</b> "We ended the quarter with <b>$242.5 billion</b> in cash and marketable securities" … "Long-term debt was <b>$98.2 billion</b>." … "our Board of Directors declared a quarterly cash dividend on our common stock of 22-cents per share, which is payable in September."</p>' },
      ],
      newQuestions:[
        { n:'What was Search & other growth in Q3, the first quarter lapping the acceleration that began in the third quarter of 2025?', theme:'Search growth with AI Overviews and AI Mode' },
        { n:'How much did third-party capacity and the Wiz integration weigh on the Cloud operating margin?', theme:'Cloud margin: what drives it and what weighs on it' },
        { n:'How much TPU system revenue was recognized in Q3, and is any margin detail disclosed?', theme:'TPU system sales — "vast majority" of revenue in 2027' },
        { n:'Is a 2027 capex figure or range given, and is the FY2026 range of $195-205 billion kept?', theme:'2027 capex — "increase significantly"' },
        { n:'Has Gemini 4 been released or dated, and has the release cadence moved toward monthly?', theme:'Full stack: TPUs, models and the cost to serve' },
      ],
    } },
  { q:'Q1 2026', status:'reported', date:'Wed Apr 29, 2026 · after close',
    setup:{ source:'Bloomberg (BST) — the last snapshot before the print', asOf:'2026-02-09', notes:{}, us:{}, debate:{ rows:null, synth:'' } },
    results:{ basisNote:'<b>Basis.</b> Net income and EPS include <b>$37.7B</b> of other income from unrealized gains on equity securities.' },
    call:{
      newQuestions:[
        { n:'Is FY2026 capex still guided at $180 to $190 billion, or was the range changed again?', theme:'FY2026 capex' },
        { n:'Was a figure or range given for 2027 capex?', theme:'2027 capex — "increase significantly"' },
        { n:'Did TPU hardware revenue start to be recognized, and was the TPU share of the backlog disclosed?', theme:'TPU system sales — "vast majority" of revenue in 2027' },
        { n:'Where did Cloud operating margin land with Wiz included, and how large was the Wiz headwind?', theme:'Cloud margin: what drives it and what weighs on it' },
        { n:'Was there any change to the stance on ads in the Gemini app?', theme:'Gemini app: subscriptions first, ads later' },
      ],
      prepared:[
        { topic:'Revenue $109.9B, +22%; operating margin 36.1%', theme:'Results',
          body:'<b>Anat Ashkenazi:</b> "We had an outstanding first quarter, delivering our 11th consecutive quarter of double digit revenue growth. Consolidated revenue reached <b>$109.9 billion, up 22%</b>, or 19% in constant currency." … "Operating income increased 30% to $39.7 billion, and <b>operating margin was 36.1%</b>." … "Net income increased 81% to $62.6 billion, and earnings per share increased 82% to $5.11."' },
        { topic:'Search & Other +19% to $60.4B; queries at an all time high', theme:'Search',
          body:'<b>Sundar Pichai:</b> "AI continues to drive Search usage, and <b>queries are at an all time high</b>. We continue to invest in improvements to AI Overviews, which are driving overall Search growth, and we are also seeing strong growth in both users and usage of AI Mode globally."<br><b>Anat Ashkenazi:</b> "Google Search and other advertising revenues <b>increased by 19% to $60.4 billion</b>, driven by growth in the retail and financial services verticals."' },
        { topic:'YouTube ads +11%; 350 million paid subscriptions', theme:'YouTube',
          body:'<b>Anat Ashkenazi:</b> "YouTube advertising revenues <b>increased 11% to $9.9 billion</b>, driven by Direct Response advertising as well as Brand." … "Subscriptions, Platforms & Devices revenues increased 19% this quarter to $12.4 billion due to strong growth in both YouTube subscriptions, particularly in YouTube Music and Premium, and Google One subscriptions, which benefited from increased demand for AI plans."<br><b>Sundar Pichai:</b> "Overall, the number of paid subscriptions has now reached <b>350 million</b>, with YouTube and Google One being the key drivers."' },
        { topic:'Cloud +63% to $20B; operating margin 32.9%', theme:'Cloud',
          body:'<b>Anat Ashkenazi:</b> "Cloud revenues accelerated across all key areas and were <b>up 63% to $20 billion</b>." … "Cloud operating income was $6.6 billion, tripling year over year, and operating margin increased from 17.8% in the first quarter of last year to <b>32.9%</b>."<br><b>Sundar Pichai:</b> "Our Enterprise AI solutions have become our <b>primary growth driver for Cloud for the first time</b>."' },
        { topic:'Cloud backlog $462B; TPU hardware revenue mostly in 2027', theme:'Cloud',
          body:'<b>Anat Ashkenazi:</b> "Google Cloud\'s backlog <b>nearly doubled sequentially, reaching $462 billion</b> at the end of the first quarter. The increase was driven by strong demand for our enterprise AI offerings and the inclusion of TPU hardware sales that Sundar referenced earlier." … "we expect to recognize <b>just over 50% of the backlog</b> as revenue over the next 24 months." … "We expect to begin recognizing a small percent of the revenues from these agreements later this year, with the <b>vast majority of revenues to be realized in 2027</b>."' },
        { topic:'16 billion tokens per minute; eighth generation TPUs', theme:'AI & compute',
          body:'<b>Sundar Pichai:</b> "Our first party models now process <b>more than 16 billion tokens per minute</b> via direct API use by our customers, up from 10 billion last quarter." … "At Cloud Next, we introduced our <b>eighth generation TPUs</b>, individually specialized for training and serving, and able to take on the most demanding agentic workloads."' },
        { topic:'Waymo 500,000+ rides per week; Other Bets loss $2.1B', theme:'Other Bets',
          body:'<b>Sundar Pichai:</b> "Waymo also surpassed <b>500,000 fully autonomous rides per week</b>, doubling in less than a year."<br><b>Anat Ashkenazi:</b> "In Other Bets, revenues were $411 million, and <b>operating loss was $2.1 billion</b>." … "In Q1 of this year, Verily completed an external capital raise that resulted in its deconsolidation from Alphabet."' },
        { topic:'Depreciation and data-center costs keep pressing the P&L', theme:'Costs',
          body:'<b>Anat Ashkenazi:</b> "Other Cost of Revenues was $26 billion, up 15%, primarily driven by increases in depreciation, content acquisition costs largely, for YouTube, and compensation." … "the significant increase in our investments in technical infrastructure will continue to <b>put pressure on the P&L in the form of higher depreciation expense</b> and related data center operations costs, such as energy."' },
        { topic:'FY26 capex $180 to $190B; 2027 to significantly increase', theme:'Capex',
          body:'<b>Anat Ashkenazi:</b> "CapEx was $35.7 billion in the first quarter, with the overwhelming majority of this spend in technical infrastructure to support the AI opportunities we see across the company." … "we are updating our <b>full year 2026 CapEx guidance range to $180 to $190 billion</b>, up from our previous estimate of $175 to $185 billion, to now include investment related to the acquisition of Intersect, which closed in March." … "we expect our <b>2027 CapEx to significantly increase</b> compared to 2026."' },
      ],
      qanda:[
        { q:'Next compute for Search; pricing TPU sales to third parties', analyst:'Brian Nowak · Morgan Stanley', theme:'AI & compute',
          qFull:'In Search, what are the areas you are most excited about applying next generation compute toward, to generate an ROIC in the next 12 months? And on the sale of TPUs to third parties, what is the strategy around pricing them, given the high ROIC of using TPUs to power multiyear Google Cloud workloads?',
          a:'<b>Sundar Pichai:</b> "I think bringing agentic workflows to consumers in a way that it\'s easy for them to do, including in the context of Search, I see as a huge opportunity ahead" … "At times, it is <b>direct sales of TPU hardware to a select group of customers</b>." … "we do take ROIC approach, and some of it helps us get more economies of scale, scale in our overall compute environment as well."' },
        { q:'2027 capex vs the backlog; ad coverage above 20% of queries', analyst:'Doug Anmuth · JP Morgan', theme:'Capex',
          qFull:'How do you think about the current capex trajectory\'s ability to service the backlog built up in the last quarter, given 2027 capex will increase significantly? And what drives Search queries at an all time high, and how much room is there to show ads against a higher percentage of queries than the 20% you\'ve been at historically?',
          a:'<b>Anat Ashkenazi:</b> "and increasing CapEx to meet that demand" … "provide <b>more clarity in a future earnings call</b> about what that number will be."<br><b>Philipp Schindler:</b> "You specifically asked about the 20% on the coverage side, and as I said before, I think with the ability of AI to better understand intent and a lot of other vectors around it, I think <b>there is upside in that coverage number</b>."' },
        { q:'Where the AI stack sits competitively; what UCP means', analyst:'Eric Sheridan · Goldman Sachs', theme:'Cloud',
          qFull:'Given the backlog, how does your AI infrastructure approach position you to build capacity and scale compute effectively from a margin standpoint as well as a compute standpoint, relative to others? And what does UCP mean for the Services business as agentic commerce scales?',
          a:'<b>Sundar Pichai:</b> "And I think we are the <b>only provider on the market that offers all of these in a vertical stack</b>."<br><b>Philipp Schindler:</b> "We see agentic experiences as additive, and it will really transform how we shop, from discovery to decisions, while helping, obviously, brands differentiate themselves."' },
        { q:'AdWords price and volume trends under agentic shopping', analyst:'Ross Sandler · Barclays', theme:'Search',
          qFull:'As you carry the AdWords business from the old way of doing things to agentic, frictionless shopping, how do you see the price and volume growth trends for core AdWords evolving as you implement more agentic workflows in Search?',
          a:'<b>Philipp Schindler:</b> "Look, our number one focus is obviously on the user experience here" … "And the second you have the space, you obviously have the ability for interesting advertising models." … "We focus on the user experience here, and then I think all else will follow if we pay attention to the points I mentioned."' },
        { q:'How constrained compute is allocated; ads in the Gemini app', analyst:'Michael Nathanson · MoffettNathanson', theme:'AI & compute',
          qFull:'How are you allocating which divisions and projects get capacity while you are constrained, how do you decide between internal and external projects, and what screens decide who gets capacity? And what is guiding your decision on adding ads to the Gemini app?',
          a:'<b>Sundar Pichai:</b> "Obviously, we are <b>compute constrained in the near term</b>. And as an example, <b>our Cloud revenue would have been higher</b> if we were able to meet the demand."<br><b>Philipp Schindler:</b> "specifically on monetization in the Gemini app, our focus right now is on AI Mode." … "At the right moment, we\'ll share any plans, as we have said, but <b>we\'re not rushing anything here</b>."' },
        { q:'Search strength: shorter purchase journeys or new advertiser tools?', analyst:'Mark Shmulik · AllianceBernstein', theme:'Search',
          qFull:'Besides higher query volume, are consumers using AI tools to shrink their purchasing journeys and convert at higher rates? Is there a way to dimensionalize how much of the strength of Search is driven by that behavioral change, against the newer advertiser AI tools?',
          a:'<b>Philipp Schindler:</b> "I think the way to think about it is really to think about the <b>expansionary moment</b> we see here for Search. This is the key part." … "Search Live is now available to all countries and languages that support AI Mode."' },
        { q:'What is driving Cloud margin expansion', analyst:'Ron Josey · Citi', theme:'Cloud',
          qFull:'Can you break down the drivers of margin expansion, particularly in Cloud, given the thesis that AI revenues are lower margin, yet margins are improving? Demand, maybe pricing?',
          a:'<b>Anat Ashkenazi:</b> "When we see this robust, strong revenue growth, both in Cloud and Google Services, it does provide <b>leverage all the way down to the bottom line</b> within the income statement." … "We\'re going to continue to push for more efficiency, knowing that we\'re going to have the <b>headwind associated with the depreciation</b> coming with a higher CapEx level."' },
        { q:'Supply-chain inflation in capex; subscriptions for Search use cases', analyst:'Ken Gawrelski · Wells Fargo', theme:'Capex',
          qFull:'How do your verticalized capabilities help navigate a supply chain with inflation and constraints, and are you factoring supply chain price inflation into \'26 and \'27 capex commentary? Could you update the allocation of compute capacity, internal versus external Cloud? And will some Search use cases be more effectively monetized via subscriptions?',
          a:'<b>Sundar Pichai:</b> "Obviously, we are working through a complicated supply chain environment, as you point out, and <b>we\'re factoring that into any commentary we give</b>." … "And we are already providing various tiers of our subscription plans in which you can get access to more powerful models, and that applies across your Google user experience, including in Search."' },
        { q:'TPU opportunity, backlog split, margins on big AI deals', analyst:'Justin Post · Bank of America', theme:'Cloud',
          qFull:'How are you thinking about the TPU sales opportunity, and can you break down the backlog growth between TPUs and Cloud? And what are the margins on the big generative AI Cloud deals; can they be similar to your Cloud business as it is?',
          a:'<b>Anat Ashkenazi:</b> "So the backlog, the TPU hardware agreements that Sundar referenced in his prepared remarks are reflected in our Cloud backlog, the $462 billion, although <b>the majority of the backlog is still GCP agreements</b>."<br><b>Sundar Pichai:</b> "I think <b>nothing to comment on any specific contracts</b>, but overall, earlier, there were a lot of questions about how do we allocate."' },
      ],
      highlights:[
        { tag:'watch', band:'lead', open:'How many points did Wiz take off Cloud operating margin in Q2?',
          head:'Wiz: a low single digit point headwind to Cloud operating margin for the rest of 2026',
          detail:'<p><b>Anat Ashkenazi:</b> "First, Wiz will be reporting in the Google Cloud segment. And second, we expect a <b>low single digit percentage point headwind to Cloud\'s operating margin</b> for the remainder of 2026"</p>' },
        { tag:'thesis', band:'lead',
          head:'Cost of core AI responses down more than 30% since the move to Gemini 3',
          detail:'<p><b>Sundar Pichai:</b> "Even as we have brought new AI features into our results page, we have reduced Search latency by more than 35% over the past five years. And since upgrading AI Overviews and AI Mode to Gemini 3, we have <b>reduced the cost of core AI responses by more than 30%</b>, thanks to continued hardware and engineering breakthroughs."</p>' },
        { tag:'curious', band:'context',
          head:'Cloud figures disclosed: gen AI model products revenue up nearly 800%; customers 45% above initial commitments',
          detail:'<p><b>Sundar Pichai:</b> "In Q1, revenue from products built on our gen AI models <b>grew nearly 800% year over year</b>. We are winning new customers faster, with new customer acquisition doubling compared to the same period last year." … "Customers outpaced their initial commitments by 45%, accelerating over last quarter." … "In Q1, Gemini Enterprise paid monthly active users grew 40% quarter over quarter."</p>' },
        { tag:'watch', band:'context', open:'How much FX tailwind was in Q2 revenue growth, against the one point guided?',
          head:'FX tailwind of about one point expected in Q2, against three points in Q1',
          detail:'<p><b>Anat Ashkenazi:</b> "At current spot rates, we would expect to see an <b>FX tailwind of approximately one percentage point</b> toward consolidated revenue in Q2, compared to three percentage points FX tailwinds in the first quarter."</p>' },
        { tag:'watch', band:'context', open:'Was there another unrealized gain in other income in Q2, and how large?',
          head:'Other income $37.7B, mainly unrealized gains on nonmarketable equity securities',
          detail:'<p><b>Anat Ashkenazi:</b> "Other income and expenses was <b>$37.7 billion</b>, representing a meaningful increase from the prior year, primarily due to <b>unrealized gains in our nonmarketable equity securities portfolio</b>."</p>' },
        { tag:'logged', band:'logged',
          head:'Free cash flow $10.1B in the quarter; long-term debt $77.5B; dividend raised 5%',
          detail:'<p><b>Anat Ashkenazi:</b> "Free cash flow was $10.1 billion in the first quarter and $64.4 billion for the trailing 12 months. We ended the quarter with $126.8 billion in cash and marketable securities and $77.5 billion in long-term debt. And as we announced today, our Board of Directors declared a 5% increase in the quarterly dividend."</p>' },
        { tag:'logged', band:'logged',
          head:'Token milestones: 330 Cloud customers each processed over one trillion tokens in 12 months',
          detail:'<p><b>Sundar Pichai:</b> "Over the past 12 months, 330 Google Cloud customers each processed over one trillion tokens. 35 reached the ten trillion token milestone."</p>' },
      ],
    } },
  { q:'Q4 2025', status:'reported', date:'Wed Feb 4, 2026 · after close',
    setup:{ source:'Bloomberg (BST) — the last snapshot before the print', asOf:'2025-11-03', notes:{}, us:{}, debate:{ rows:null, synth:'' } },
    results:{ basisNote:'<b>Basis.</b> Operating income includes a <b>$2.1B</b> stock-based compensation charge related to Waymo (R&D).' },
    call:{
      prepared:[
        { topic:'Revenue $113.8 billion, up 18%; FY2025 $403 billion', theme:'Results',
          body:'<b>Anat Ashkenazi:</b> "For the full-year 2025, Alphabet consolidated revenues were <b>$403 billion</b>, up 15% on a reported and constant currency basis." … "Consolidated revenues reached <b>$113.8 billion, up 18%</b>, or 17% in constant currency, and was driven by an acceleration in Search and Cloud revenues." … "Net income increased 30% to $34.5 billion, and earnings per share increased 31% to <b>$2.82</b>."' },
        { topic:'Search and Other +17% to $63.1 billion', theme:'Search',
          body:'<b>Sundar Pichai:</b> "Search saw <b>more usage in Q4 than ever before</b>, as AI continues to drive an expansionary moment." … "In the U.S., we saw <b>daily AI Mode queries per user double since launch</b> and AI Overviews continue to perform very well."<br><b>Anat Ashkenazi:</b> "Google Search and Other advertising revenues increased by <b>17% to $63.1 billion</b>, representing another strong quarter with continued growth across all major verticals, with the largest contribution from Retail."' },
        { topic:'YouTube ads +9% to $11.4 billion', theme:'YouTube',
          body:'<b>Anat Ashkenazi:</b> "YouTube advertising revenues increased <b>9% to $11.4 billion</b>, driven by direct response advertising. Results were negatively affected from the <b>lapping of the strong spend on U.S. election</b> in the fourth quarter of 2024 that we\'ve mentioned on previous earnings calls."<br><b>Sundar Pichai:</b> "YouTube\'s annual revenues surpassed <b>$60 billion</b> across Ads and Subscriptions."' },
        { topic:'Subscriptions, Platforms and Devices +17% to $13.6 billion', theme:'Subscriptions',
          body:'<b>Anat Ashkenazi:</b> "Subscriptions, Platforms and Devices revenues increased <b>17%</b> this quarter to <b>$13.6 billion</b>, due to strong growth in YouTube Subscriptions, particularly YouTube Music and Premium, and growth in Google One, which benefited from increased demand for AI plans."<br><b>Sundar Pichai:</b> "We have over <b>325 million paid subscriptions</b> across consumer services, with strong adoption for Google One and YouTube Premium."' },
        { topic:'Cloud +48% to $17.7 billion; backlog $240 billion', theme:'Cloud',
          body:'<b>Anat Ashkenazi:</b> "Cloud revenue accelerated meaningfully and was up <b>48% to $17.7 billion</b>." … "Cloud operating income was $5.3 billion, more than doubling year-over-year. And operating margin increased from 17.5% in the fourth quarter of last year, to <b>30.1%</b>." … "Google Cloud\'s backlog increased 55% sequentially and more than doubled year-over-year, reaching <b>$240 billion</b> at the end of the fourth quarter."' },
        { topic:'Gemini serving unit costs down 78% over 2025', theme:'AI & compute',
          body:'<b>Sundar Pichai:</b> "We were able to <b>lower Gemini serving unit costs by 78% over 2025</b> through model optimizations, efficiency and utilization improvements." … "And our Gemini App now has over <b>750 million monthly active users</b>." … "Our first-party models, like Gemini, now process over <b>10 billion tokens per minute</b> via direct API use by our customers, up from 7 billion last quarter."' },
        { topic:'Other Bets loss $3.6 billion, incl. $2.1 billion Waymo charge', theme:'Other Bets',
          body:'<b>Anat Ashkenazi:</b> "In Other Bets, revenues were $370 million, and operating loss was <b>$3.6 billion</b>, reflecting the $2.1 billion Waymo charge I mentioned earlier." … "Alphabet funded a significant portion of the <b>$16 billion investment round</b> that Waymo announced on Monday, which will allow the business to accelerate its global expansion."<br><b>Sundar Pichai:</b> "In December, we surpassed 20 million fully autonomous trips and are now providing <b>more than 400,000 rides every week</b>."' },
        { topic:'Depreciation $21.1 billion in 2025, up 38%', theme:'Costs',
          body:'<b>Anat Ashkenazi:</b> "In 2025, depreciation increased by nearly $6 billion, or <b>38%</b>, from $15.3 billion in 2024, to <b>$21.1 billion</b> in 2025. Given the increase in our CapEx investments in recent years, we expect the <b>growth rate in 2026 depreciation to accelerate in Q1, and meaningfully increase for the full year</b>."' },
        { topic:'2026 capex $175 billion to $185 billion; 2025 $91.4 billion', theme:'Capex',
          body:'<b>Anat Ashkenazi:</b> "CapEx was $27.9 billion for the fourth quarter, and <b>$91.4 billion for the full year</b>, in line with our expectation." … "For the full year 2026, we expect CapEx to be in the range of <b>$175 billion to $185 billion</b>, with investments ramping over the course of the year."' },
      ],
      qanda:[
        { q:'Agentic commerce progress; Genie and YouTube', analyst:'Brian Nowak · Morgan Stanley', theme:'Search',
          qFull:'Looking back at 2025, where did you make the most progress on new types of agentic commerce products, and where are you most optimistic for 2026? And what is the long-term vision for how Genie and other content-creation tools could be integrated into YouTube?',
          a:'<b>Sundar Pichai:</b> "I definitely think \'25 was more about laying the foundation, getting the models to start being more robust in agentic use cases." … "So I think <b>this is the year where you will see consumers actually being able to use all of this</b>, and I\'m excited about the opportunity ahead." … "But we do want to put creators at the center of the experience, and that\'s very, very important to us."' },
        { q:'Closing the compute gap; efficiencies to fund the spend', analyst:'Eric Sheridan · Goldman Sachs', theme:'AI & compute',
          qFull:'With the step-function change in capital dollars for 2026, what is the pathway to closing the gap between demand and capacity for compute, internally and externally? And against that level of spend, how do you keep finding operating efficiencies to fund the growth investments?',
          a:'<b>Sundar Pichai:</b> "we\'ve been <b>supply-constrained, even as we\'ve been ramping up our capacity</b>." … "And so I do expect to go through the year in a supply-constrained way."<br><b>Anat Ashkenazi:</b> "About 50% of our codes are written by agents, coding agents, which are then reviewed by our own engineers."' },
        { q:'Gemini position amid LLM leapfrogging; TPUs outside Google Cloud', analyst:'Doug Anmuth · JP Morgan', theme:'AI & compute',
          qFull:'With considerable large language model leapfrogging, how can Google build and maintain its Gemini position around data, distribution and product integration? And how should we think about TPUs moving outside of Google Cloud into external data centers as an incremental revenue stream?',
          a:'<b>Sundar Pichai:</b> "We\'re obviously improving these models across many paradigms, on pre-training, post-training, test time compute, and so on." … "In terms of TPUs, I would think about it as it\'s reflected in our overall part of what makes Google Cloud an attractive choice is the <b>wide choice of accelerators</b> we bring to bear here"' },
        { q:'YouTube ads +9% despite strong retail; AI and SaaS customers', analyst:'Mark Mahaney · Evercore', theme:'YouTube',
          qFull:'Why did YouTube ad revenue grow only 9% when direct response and Retail were strong? And with a market belief that software companies are losing seat and pricing power, why would AI not undermine the economics of your large SaaS customer base?',
          a:'<b>Philipp Schindler:</b> "the largest factor negatively impacting the year-over-year growth rate was <b>lapping the strong spend on U.S. elections</b>." … "when a user shifts from being an Ads-supported user to a YouTube Music and Premium customer, it has a slightly negative impact on YouTube Ads revenues but a positive impact on our business."<br><b>Sundar Pichai:</b> "If I look at it in terms of their tokens usage, et cetera, the growth has been very robust in Q4."' },
        { q:'Investment framework; what keeps you up at night', analyst:'Mark Shmulik · AllianceBernstein', theme:'Capex',
          qFull:'What is the relationship between investment levels and core performance: is there an operating income or free cash flow objective you solve towards, and how do you greenlight projects? And what keeps each of you up at night?',
          a:'<b>Anat Ashkenazi:</b> "We have a highly rigorous framework that we use internally where we look at all the needs for investment" … "We then also look at just the cash flow, cash flow generation, the health of our financials and the balance sheet."<br><b>Sundar Pichai:</b> "maybe the <b>top question is definitely around compute capacity</b>, all the constraints, be it power, land, supply chain constraints, how you ramp up to meet this extraordinary demand for this moment."' },
        { q:'Universal Commerce Protocol rationale; capex by asset duration', analyst:'Michael Nathanson · MoffettNathanson', theme:'Capex',
          qFull:'What is the rationale for developing the Universal Commerce Protocol and what does it mean for the product discovery funnel? And how does the capex guide split between longer-duration assets, like buildings, and shorter-cycle technical equipment?',
          a:'<b>Anat Ashkenazi:</b> "Approximately 60% of our investment in 2025, and it\'s going to be fairly similar in 2026, went towards machines; so, the servers. And then 40% is what you would refer to as long duration assets, which is our data centers and networking equipment." … "And for 2026, <b>just over half of our ML compute is expected to go towards the Cloud business</b>."' },
        { q:'Gemini 750 million MAU: usage, retention, right metric?', analyst:'Ross Sandler · Barclays', theme:'AI & compute',
          qFull:'Gemini added 100 million MAUs in the fourth quarter. What do usage and retention look like, and is 750 million the right way to measure progress against companies like ChatGPT, or is there another cohort of users to consider?',
          a:'<b>Sundar Pichai:</b> "It\'s not just a growth in monthly active users, but there was a <b>sharp increase in engagement per user</b> on the app." … "So all the metrics, be it active usage, the intensity of usage, retention, all showed distinct progress across iOS, web, Android, et cetera, and geographically globally."' },
        { q:'Monetizing AI search; aligning with partners like Apple', analyst:'Ken Gawrelski · Wells Fargo', theme:'Search',
          qFull:'How are your views evolving on monetizing AI search activity, as utility is increasingly driven by on-platform results rather than link-outs, and is this where premium subscriptions play? And with partnerships such as the new Apple partnership on Siri, how do you align for success when it was previously a revenue share relationship?',
          a:'<b>Philipp Schindler:</b> "the acceleration we saw in Search was <b>not due to a single driver</b>, but was really the result of many different parts of our business showing strength and working well together." … "AI Max, for example, is already used by <b>hundreds of thousands of advertisers</b> and continues to unlock billions of net new queries in that sense."' },
        { q:'Gemini App cannibalizing Search? Monetization', analyst:'Justin Post · Bank of America', theme:'Search',
          qFull:'Are you seeing any cannibalization of Search activity as people use the Gemini App more? And where are you on monetization, and could agentic and other ads be incremental to growth over the next few years?',
          a:'<b>Sundar Pichai:</b> "So overall, some of it is what we see as a growth opportunity, and we <b>haven\'t seen any evidence of cannibalization</b> there."<br><b>Philipp Schindler:</b> "In terms of the Gemini App, today, we are focused on the free tier and subscriptions" … "But Ads have always been part of scaling products to reach billions of people" … "As we\'ve said, <b>we\'re not rushing anything here</b>."' },
      ],
      highlights:[
        { tag:'watch', band:'lead', open:'Is any revenue or capacity figure disclosed for the Apple collaboration?',
          head:'Apple: Google is "preferred Cloud provider" and will help develop Apple Foundation Models based on Gemini',
          detail:'<p><b>Sundar Pichai:</b> "Before moving on, I\'m pleased that we are collaborating with Apple as their <b>preferred Cloud provider</b> and to develop the next generation of Apple Foundation Models, based on Gemini technology."</p>' },
        { tag:'thesis', band:'lead', open:'Does the Cloud supply constraint ease during 2026?',
          head:'Q1 outlook: Cloud demand strong in a tight supply environment',
          detail:'<p><b>Anat Ashkenazi:</b> "In Google Cloud, we\'re seeing significant demand for our products and services, which we expect to continue to drive strong growth, <b>despite the tight supply environment we\'re operating in</b>."</p>' },
        { tag:'thesis', band:'context',
          head:'Gemini Enterprise: more than 8 million paid seats at more than 2,800 companies',
          detail:'<p><b>Sundar Pichai:</b> "We have sold more than <b>8 million paid seats</b> of Gemini Enterprise, our enterprise AI platform, to more than 2,800 companies, including BNY and Virgin Voyages, to streamline knowledge management and automate processes."</p>' },
        { tag:'curious', band:'context',
          head:'Revenue from products built on generative AI models grew nearly 400% in Q4',
          detail:'<p><b>Sundar Pichai:</b> "In Q4, revenue from products built on our generative AI models <b>grew nearly 400% year-over-year</b>, significantly accelerating from the prior quarter." … "The number of deals in 2025 over $1 billion surpassed the previous three years combined."</p>' },
        { tag:'watch', band:'context', open:'Is there an update on ads in AI Mode and the Direct Offers pilot?',
          head:'AI Mode monetization in early stages, testing ads below the AI response',
          detail:'<p><b>Philipp Schindler:</b> "We have significantly increased our focus on AI Mode and are in the <b>early stages of experimenting with AI Mode monetization</b>, like testing ads below the AI response, with more underway. For example, we announced Direct Offers, a new Google Ads pilot, which will allow advertisers to show exclusive offers for shoppers who are ready to buy, directly in AI Mode."</p>' },
        { tag:'logged', band:'logged',
          head:'Network advertising $7.8 billion, down 2%',
          detail:'<p><b>Anat Ashkenazi:</b> "Network advertising revenues of $7.8 billion were down 2%."</p>' },
        { tag:'logged', band:'logged',
          head:'Q4 capital return: $5.5 billion buybacks, $2.5 billion dividends',
          detail:'<p><b>Anat Ashkenazi:</b> "In Q4, we returned capital to shareholders through $5.5 billion of share repurchase and $2.5 billion of dividend payments." … "We ended the quarter with $126.8 billion in cash and marketable securities, and $46.5 billion in long-term debts."</p>' },
      ],
      newQuestions:[
        { n:'Does the FY2026 capex range of $175 billion to $185 billion hold?', theme:'FY2026 capex' },
        { n:'Does the Cloud backlog keep growing from $240 billion, and is Cloud still supply-constrained?', theme:'Cloud growth and the revenue backlog' },
        { n:'How fast is depreciation growing in 2026, against 38% in 2025?', theme:'Depreciation and data-center costs' },
        { n:'Is there an update on ads in AI Mode, Direct Offers and checkout in AI Mode and Gemini?', theme:'New ad surfaces: AI Mode ads, Direct Offers, agentic commerce' },
        { n:'What is the latest Gemini App monthly active user count, against 750 million in Q4?', theme:'Gemini app users and paid subscriptions' },
      ],
    } },
]};
