// overviews/sofi-ce-data.js — the DATA behind SoFi's Evolution ▸ Earnings (the rendering is ./sofi-ce.js).
//
//   SOFI_CE_CONS — the estimate grid and "The print" cards, rebuilt at load from js/results-data/sofi.js (actuals,
//     Bloomberg consensus and the estMatrix vintages; BBG_CONSENSUS.txt snapshots May 2022 → Oct 26 2026).
//   SOFI_CALL_EARNINGS — per quarter, newest first: setup (notes per line), results and the call. Transcripts:
//     docs/calls/SOFI.md (verbatim, Q4 2023 → Q2 2026, supplied by the analyst; Quartr is not used).
//
// Values are $B (the file is $M), members in millions, EPS in $. Guidance is SoFi's own (8-K Ex. 99.1 and the calls).

import { sofiResults } from '../results-data/sofi.js';

export var SOFI_CE_CONS = {
  src: 'Bloomberg (BST) · BBG_CONSENSUS.txt snapshot archive',
  asOf: [],
  q: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026','Q2 2026','Q3 2026','Q4 2026','Q1 2027','Q2 2027'],
  hz: ['4q out','3q out','2q out','1q out'],
  nHead: 9,
  m: [
    { k:'Revenue',                    u:'$B', t:'ok', code:'CB_IS_NET_REVENUE' },
    { k:'Total members',              u:'M',  t:'ok', code:'NUM_ACTIVE_ACCOUNTS' },
    { k:'Personal loan originations', u:'$B', t:'ok', code:'LOAN_PRODUCTION_ORIGINAL' },
    { k:'Student loan originations',  u:'$B', t:'ok', code:'LOAN_PRODUCTION_ORIGINAL' },
    { k:'Home loan originations',     u:'$B', t:'ok', code:'LOAN_PRODUCTION_ORIGINAL' },
    { k:'Noninterest expense',        u:'$B', t:'ok', code:'IS_OPERATING_EXPN' },
    { k:'Stock-based compensation',   u:'$B', t:'ok', code:'CF_STOCK_BASED_COMPENSATION' },
    { k:'Adjusted EBITDA',            u:'$B', t:'ok', code:'IS_COMPARABLE_EBITDA' },
    { k:'Adjusted net income',        u:'$B', t:'ok', code:'IS_COMP_NET_INCOME_ADJUST_OLD' },
    { k:'EPS (diluted)',              u:'$',  t:'ok', code:'IS_COMP_EPS_ADJUSTED_OLD' }
  ]
};

(function(){
  var M = sofiResults.views.q.metrics, MX = sofiResults.estMatrix && sofiResults.estMatrix.cons;
  function pOf(q){ return q.charAt(1)+'Q'+q.slice(-2); }                    // 'Q3 2026' → '3Q26'
  function ord(p){ var m=/^(\d)Q(\d{2})$/.exec(p); return m?(2000+(+m[2]))*4+(+m[1]):null; }
  var Q = SOFI_CE_CONS.q, QP = Q.map(pOf);
  // Round the way the archive prints: $B to 0.01 (0.1 from $10B up), EPS and members to 0.01.
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
  var RS = { 'Revenue':['rev',1000], 'Total members':['members',1000], 'Personal loan originations':['plov',1000],
             'Student loan originations':['slov',1000], 'Home loan originations':['hlov',1000], 'Noninterest expense':['nie',1000],
             'Stock-based compensation':['sbc',1000], 'Adjusted EBITDA':['ebitda',1000], 'Adjusted net income':['earnings',1000], 'EPS (diluted)':['eps',1] };
  SOFI_CE_CONS.m.forEach(function(m){ var s=RS[m.k]; if(s) fromResults(m, s[0], s[1]); });
  var nv = MX && MX.vintages[MX.vintages.length-1];
  SOFI_CE_CONS.asOf = MX ? MX.vintages.map(function(v){ return v.id; }) : [];
  SOFI_CE_CONS.src = 'Bloomberg (BST) · BBG_CONSENSUS.txt — via js/results-data/sofi.js (estMatrix'+(nv?', newest snapshot '+nv.id:'')+')';
})();

// Summit for a quarter's Setup (`setup.us`): READ from the Results dataset, where the model is frozen at its dated snapshot
// (rule 10), never typed. Only the lines the model projects by quarter; the rest stay "—". The model has no EPS row.
function ceSummitUs(p){
  var M = sofiResults.views.q.metrics, out = {};
  [['Revenue','rev',1000],['Total members','members',1000],['Personal loan originations','plov',1000],['Student loan originations','slov',1000],
   ['Home loan originations','hlov',1000],['Noninterest expense','nie',1000],['Stock-based compensation','sbc',1000],
   ['Adjusted EBITDA','ebitda',1000],['Adjusted net income','earnings',1000]].forEach(function(x){
    var r=M[x[1]], i=r?r.periods.indexOf(p):-1, v=(i>=0&&r.summit)?r.summit[i]:null;
    if(v!=null){ v=v/x[2]; out[x[0]]={ v:Math.abs(v)>=10?Math.round(v*10)/10:Math.round(v*100)/100 }; } });
  return out;
}

export var SOFI_CALL_EARNINGS = { ticker:'SOFI', quarters:[
  // ── UPCOMING: Q3 2026 (quarter ended Sep 30 2026). Consensus = the Bloomberg snapshot of Oct 26 2026 (last reported quarter
  // 2Q26, so its fq+1 is this quarter). Summit = the 2026-08-05 snapshot, frozen in js/results-data/sofi.js. Guidance: SoFi
  // gave full-year 2026 guidance on the Jul 29 2026 call (adjusted net revenue $4.75–4.85B, adjusted EBITDA about $1.6B,
  // adjusted net income about $825M, EPS about $0.60) and no discrete 3Q26 guide.
  { q:'Q3 2026', status:'upcoming', date:'quarter ended Sep 30 2026 (not yet reported in the call file)',
    setup:{
      source:'Bloomberg (BST) — BBG_CONSENSUS.txt, snapshot 2026-10-26 · Summit DCF model — snapshot 2026-08-05, frozen · guidance: Q2 2026 call (Jul 29 2026), full year only',
      asOf:'2026-10-26',
      notes:{
        'Revenue':{ t:'No discrete 3Q26 guide; FY26 adjusted revenue guided $4.75–4.85B', h:'<p>Full-year 2026 guidance on the Jul 29 call: adjusted net revenue of $4.75 billion to $4.85 billion, about 32% to 35% growth, raised from about 30%. Revenue on this grid is GAAP total net revenue, which differs from the adjusted measure SoFi guides (2Q26: GAAP $1,218.7M, adjusted $1,205.6M).</p>' },
        'Adjusted EBITDA':{ t:'FY26 guided at about $1.6B', h:'<p>The call kept adjusted EBITDA at about $1.6 billion for 2026, a margin of about 33% to 34%. Through 2Q26 the company had reported $697.7M, so the second half implies about $0.9B.</p>' },
        'Adjusted net income':{ t:'FY26 about $825M; EPS about $0.60 on a 22% tax rate', h:'<p>Adjusted net income of about $825 million (margin about 17%) and EPS of about $0.60. The EPS guide now carries a 22% tax rate, about 700 basis points above the original guide; at the original mid-teens rate it would have been $0.65.</p>' },
        'EPS (diluted)':{ t:'FY26 EPS about $0.60', h:'<p>EPS guidance of about $0.60 for 2026 includes a 22% tax rate (original guide: mid-teens).</p>' }
      },
      us: ceSummitUs('3Q26'),
      debate:{ rows:null, synth:'' }
    },
    results:null, call:null }
] };
