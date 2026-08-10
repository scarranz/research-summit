// hedge-funds.js — extracted from summit-research-portal.html
import { INVESTORS, SP500_REF, SP500_B26, HF_FUNDS, HF_BMK, HF_AYEARS, YEARS, SP500, IMGS } from './portal-data.js';
import { fetchInvestorReturns, fetchInvestorHoldings, fetchInvestorLetters, replaceInvestorHoldings, fetchAllInvestorReturns, fetchAllInvestorHoldings, getFileUrl } from './api.js';
import { LOCAL_INVESTOR_RETURNS, LOCAL_INVESTOR_HOLDINGS, LOCAL_INVESTOR_LETTERS } from './investor-local-seed.js';
import { parse13FFile } from './investor-13f-parser.js';

let alphaChart = null, ALPHA_MODE = 'cum', HF_SEL = {}, HF_START = '2015';

function hfList(){return HF_FUNDS.concat([{name:'S&P 500 (SPY)',color:'#94A3B8',r:HF_BMK,bench:true}]);}

function renderFundChips(){
  var row=document.getElementById('fund-chips');if(!row)return;
  var html='<span class="sb-secrow-lbl">Funds</span>';
  hfList().forEach(function(f){
    var on=HF_SEL[f.name]!==false;
    var style=on?('background:'+f.color+';color:#fff;border-color:'+f.color):'';
    html+='<span class="sb-secchip'+(on?' active':'')+'" style="'+style+'" onclick="toggleFund(\''+f.name.replace(/'/g,"\\'")+'\')">'+f.name+'</span>';
  });
  html+='<span class="sb-secchip-all" onclick="allFunds(true)">All</span><span class="sb-secchip-all" style="margin-left:6px" onclick="allFunds(false)">None</span>';
  row.innerHTML=html;
}

function toggleFund(n){HF_SEL[n]=(HF_SEL[n]===false);renderFundChips();renderAlphaChart();}

function allFunds(on){hfList().forEach(function(f){HF_SEL[f.name]=on;});renderFundChips();renderAlphaChart();}

function setAlphaStart(v){HF_START=v;renderAlphaChart();}

function setAlphaMode(m){ALPHA_MODE=m;document.querySelectorAll('#alpha-toggle .sb-tbtn').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-am')===m);});renderAlphaChart();}

function alphaSt(msg){var s=document.getElementById('alphaStatus');if(s){s.textContent=msg||'';s.style.display=msg?'flex':'none';}}

function renderAlphaChart(_tries){
  var cv=document.getElementById('alphaChart');if(!cv)return;
  if(typeof Chart==='undefined'){alphaSt('Chart library did not load in this browser.');return;}
  var box=cv.parentNode;
  if(box&&box.clientHeight<10){if((_tries||0)<30){requestAnimationFrame(function(){renderAlphaChart((_tries||0)+1);});}else{alphaSt('Chart area has no height (clientHeight=0).');}return;}
  if(alphaChart){alphaChart.destroy();alphaChart=null;}
  alphaSt('');
  var series=hfList().filter(function(f){return HF_SEL[f.name]!==false;});
  var si=HF_AYEARS.indexOf(HF_START);if(si<0)si=0;
  var sliceYears=HF_AYEARS.slice(si);
  var isCum=(ALPHA_MODE!=='annual');
  var baseYear=String(parseInt(HF_START,10)-1);
  var labels=isCum?[baseYear].concat(sliceYears):sliceYears;
  var datasets=series.map(function(f){
    var rs=f.r.slice(si);
    var n=rs.length, fi=-1;
    for(var j=0;j<n;j++){if(rs[j]!=null){fi=j;break;}}
    var data,annualData,cumData,anchor;
    if(isCum){
      // labels prepend a base year at index 0; fund arrays align to labels (length n+1)
      data=new Array(n+1).fill(null);annualData=new Array(n+1).fill(null);cumData=new Array(n+1).fill(null);
      anchor=(fi<0)?0:fi;             // labels index of this fund's 0-baseline (year before its first data)
      if(fi>=0){
        data[anchor]=0;annualData[anchor]=0;cumData[anchor]=0;
        var c=1;
        for(var k=fi;k<n;k++){
          if(rs[k]==null){continue;}
          c*=(1+rs[k]/100);var v=+(((c-1))*100).toFixed(2);
          data[k+1]=v;cumData[k+1]=v;annualData[k+1]=+rs[k].toFixed(2);
        }
      }
    } else {
      data=rs.map(function(rv){return rv==null?null:+rv.toFixed(2);});
      annualData=data;
      cumData=new Array(n).fill(null);
      anchor=(fi<0)?0:fi;
      if(fi>=0){var c2=1;for(var k2=fi;k2<n;k2++){if(rs[k2]==null)continue;c2*=(1+rs[k2]/100);cumData[k2]=+(((c2-1))*100).toFixed(2);}}
    }
    return {label:f.name,data:data,annualData:annualData,cumData:cumData,_anchor:anchor,_cum:isCum,spanGaps:false,
      borderColor:f.color,backgroundColor:f.color,
      borderWidth:f.bench?2.5:2,borderDash:f.bench?[6,4]:[],pointRadius:f.bench?0:2.5,pointHoverRadius:5,tension:.25,fill:false};
  });
  alphaChart=new Chart(cv.getContext('2d'),{type:'line',data:{labels:labels,datasets:datasets},
    options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'nearest',intersect:false},
      plugins:{legend:{position:'top',labels:{usePointStyle:true,boxWidth:8,padding:16,font:{size:11},color:'#1E2733'}},
        tooltip:{mode:'nearest',intersect:false,
          callbacks:{
            title:function(items){return items.length?items[0].dataset.label:'';},
            label:function(c){
              var ds=c.dataset,pf=function(v){return (v>=0?'+':'')+v.toFixed(1)+'%';};
              if(ds._cum && c.dataIndex===ds._anchor) return ['Baseline: 0.0%'];
              if(ds.cumData[c.dataIndex]==null) return [];
              var lines=[c.label+' return: '+pf(ds.annualData[c.dataIndex]),'Cumulative: '+pf(ds.cumData[c.dataIndex])];
              var ye=ds._cum?(c.dataIndex-ds._anchor):(c.dataIndex-ds._anchor+1);
              if(ye>0){var ann=(Math.pow(1+ds.cumData[c.dataIndex]/100,1/ye)-1)*100;lines.push('Annualized: '+pf(ann));}
              return lines;
            }
          }}},
      scales:{
        y:{title:{display:true,text:(ALPHA_MODE==='annual'?'Annual return (%)':'Cumulative return (%)'),font:{size:11},color:'#8A93A0'},
           grid:{color:function(c){return c.tick.value===0?'#B8C0CC':'#EEF2F7';}},ticks:{color:'#8A93A0',font:{size:10},callback:function(v){return v+'%';}}},
        x:{grid:{display:false},ticks:{color:'#8A93A0',font:{size:10}}}}}});
  requestAnimationFrame(function(){if(alphaChart){alphaChart.resize();}});
}

function renderBenchmark(){
  var el=document.getElementById('inv-bench');if(!el||!SP500_REF)return;
  var rets=SP500_REF.returns;
  var annualized=Math.pow(1+SP500_REF.cum/100,1/7)-1;
  var annStr=(annualized*100).toFixed(1)+'%';
  var html='<div class="inv-bench-left"><div class="inv-bench-title">S&amp;P 500 Benchmark</div><div class="inv-bench-sub">All managers measured against this</div></div>';
  html+='<div class="inv-bench-mets">';
  html+='<div class="inv-bench-m"><div class="inv-bench-ml">Cumul. 2019&ndash;Q1 2026</div><div class="inv-bench-mv">+'+SP500_REF.cum.toFixed(1)+'%</div></div>';
  html+='<div class="inv-bench-m"><div class="inv-bench-ml">Annualized (7yr)</div><div class="inv-bench-mv">+'+annStr+'</div></div>';
  html+='<div class="inv-bench-m"><div class="inv-bench-ml">2026 YTD</div><div class="inv-bench-mv">+10.0%</div></div>';
  html+='<div class="inv-bench-bars">';
  rets.forEach(function(r,i){var pp=r>=0?Math.min(r/80*100,100):0;var np=r<0?Math.min(Math.abs(r)/40*100,100):0;
    html+='<div class="ibb-col"><div class="ibb-wrap"><div class="ibb-pos" style="height:'+pp+'%"></div><div class="ibb-neg" style="height:'+np+'%"></div></div><div class="ibb-lbl">'+YEARS[i].slice(2)+'</div></div>';});
  html+='</div></div>';
  el.innerHTML=html;
}

function renderInvGrid(){
  var grid=document.getElementById('inv-grid');if(!grid)return;
  if (COMPARE_PERIOD != null && COMPARE_DATA) {
    grid.innerHTML = INVESTORS.map(function(inv){ return investorPeriodCardHtml(inv, COMPARE_PERIOD, COMPARE_DATA); }).join('');
    return;
  }
  var html='';
  INVESTORS.forEach(function(inv){
    var isSummit=inv.key==='summit';
    var photo=inv.photo?(IMGS[inv.photo]||''):'';
    var hasPerf=inv.cum!=null;var cumClr=hasPerf?(inv.cum>=300?'gold':inv.cum>=171?'gp':''):'';
    var q1html=inv.q1!=null
      ?'<div class="icard-mv '+(inv.q1>=0?'gp':'rn')+'">'+(inv.q1>0?'+':'')+inv.q1.toFixed(2)+'%</div>'
      :'<div class="icard-mv" style="color:var(--mu);font-size:11px">n/a</div>';
    var cumLbl=inv.q1!=null?'Cumul. 2019&ndash;Q1 26':'Cumul. 2019&ndash;2025';
    html+='<div class="icard'+(isSummit?' summit':'')+'" onclick="openInvestorModal(\''+inv.key+'\')">';
    // Header
    html+='<div class="icard-hdr"><div class="icard-left">';
    if(photo){html+='<img class="icard-photo'+(isSummit?' sp':'')+'" src="'+photo+'" alt="" onerror="this.style.opacity=0.3">';}
    else{var ini=inv.name.split(' ').slice(0,2).map(function(n){return n[0];}).join('');html+='<div class="icard-ini">'+ini+'</div>';}
    html+='<div><div class="icard-name">'+inv.name+'</div><div class="icard-fund">'+inv.fund+'</div></div>';
    html+='</div><div><div class="icard-aum-lbl">Portfolio</div><div class="icard-aum-val">'+inv.aum+'</div></div></div>';
    // Metrics
    var annualized=hasPerf?Math.pow(1+inv.cum/100,1/7)-1:null;
    var annStr=hasPerf?(annualized*100).toFixed(1)+'%':'n/a';
    var ytd2026=inv.ytd2026!=null?inv.ytd2026:null;
    var ytdStr=ytd2026!=null?((ytd2026>=0?'+':'')+ytd2026.toFixed(1)+'%'):'n/a';
    html+='<div class="icard-mets">';
    html+='<div class="icard-met"><div class="icard-ml">Cumul. 2019&ndash;Q1 26</div><div class="icard-mv">'+(hasPerf?((inv.cum>0?'+':'')+inv.cum.toFixed(1)+'%'+(inv.est?' <span style="font-size:9px;color:var(--mu)">est</span>':'')):'<span style="color:var(--mu);font-size:11px">n/a</span>')+'</div></div>';
    html+='<div class="icard-met"><div class="icard-ml">Annualized (7yr)</div><div class="icard-mv">'+(hasPerf?((annualized>=0?'+':'')+annStr):'<span style="color:var(--mu);font-size:11px">n/a</span>')+'</div></div>';
    html+='<div class="icard-met"><div class="icard-ml">2026 YTD</div><div class="icard-mv">'+ytdStr+(inv.ytdEst?' <span style="font-size:9px;color:var(--mu)">est</span>':'')+'</div>'+(ytd2026!=null&&ytd2026<SP500_B26?'<div style="font-size:8px;color:var(--neg);font-weight:700;letter-spacing:.5px;text-transform:uppercase;margin-top:2px">Underperforming</div>':'')+'</div>';
    html+='</div>';
    // Holdings
    html+='<table class="icard-tbl"><thead><tr><th>Ticker</th><th>Company</th><th class="nr">% Port</th><th class="nr">YTD</th></tr></thead><tbody>';
    inv.holdings.forEach(function(h){var pc=h.ytd>=0?'rp':'rn';var ys=(h.ytd>=0?'+':'')+h.ytd.toFixed(2)+'%';var nb=h.nw?' <span style="font-size:8px;font-weight:700;letter-spacing:.5px;color:#2563EB;border:1px solid #2563EB;border-radius:3px;padding:0 3px;vertical-align:middle">NEW</span>':'';
      html+='<tr><td><span class="iticker">'+h.t+'</span></td><td><span class="ico">'+h.co+'</span>'+nb+'</td><td class="nr" style="color:var(--mu)">'+h.w.toFixed(2)+'%</td><td class="nr"><span class="rpill '+pc+'">'+ys+'</span></td></tr>';});
    html+='</tbody></table>';
    if(inv.est)html+='<div class="est-note">&#x26A0; Annual returns estimated from portfolio data.</div>';
    html+='</div>';
  });
  grid.innerHTML=html;
}

// ─── Compare by Period ──────────────────────────────────────────
// Lets you switch the whole grid from each investor's default cumulative
// view to one specific year's return + that year's 13F holdings, so you
// can line everyone up side by side for the same period. Pulls all
// investors' data in 2 bulk queries (not one per card).

var COMPARE_PERIOD = null;  // null = default cumulative view, otherwise a year
var COMPARE_DATA = null;    // { returns: [...], holdings: [...] } across all investors
var COMPARE_OPEN = false;

async function ensureCompareData() {
  if (COMPARE_DATA) return COMPARE_DATA;
  var results = await Promise.all([fetchAllInvestorReturns(), fetchAllInvestorHoldings()]);
  var returns = results[0].success ? results[0].data : [];
  var holdings = results[1].success ? results[1].data : [];
  if (location.hostname === 'localhost' && !returns.length && !holdings.length) {
    returns = LOCAL_INVESTOR_RETURNS;
    holdings = LOCAL_INVESTOR_HOLDINGS;
  }
  COMPARE_DATA = { returns: returns, holdings: holdings };
  return COMPARE_DATA;
}

function compareYearList(data) {
  var years = {};
  data.returns.forEach(function(r) { years[r.year] = true; });
  data.holdings.forEach(function(h) { years[h.year] = true; });
  return Object.keys(years).map(Number).sort(function(a, b) { return b - a; });
}

// Same "pick the latest quarter on file for that year" rule the pop-up
// uses, applied per investor so each card shows its own most recent
// snapshot even if funds filed on different schedules.
function periodHoldingsForInvestor(holdings, investorKey, year) {
  var rows = holdings.filter(function(h) { return h.investor_key === investorKey && h.year === year; });
  if (!rows.length) return [];
  var quarters = {};
  rows.forEach(function(h) { quarters[h.quarter == null ? 'none' : h.quarter] = true; });
  var qList = Object.keys(quarters).map(function(k) { return k === 'none' ? null : parseInt(k, 10); }).sort(function(a, b) { return (a || 0) - (b || 0); });
  var selQ = qList[qList.length - 1];
  return rows.filter(function(h) { return selQ == null ? h.quarter == null : h.quarter === selQ; })
    .sort(function(a, b) { return (a.rank || 0) - (b.rank || 0); });
}

function investorPeriodCardHtml(inv, year, data) {
  var isSummit = inv.key === 'summit';
  var photo = inv.photo ? (IMGS[inv.photo] || '') : '';
  var retRow = data.returns.filter(function(r) { return r.investor_key === inv.key && r.year === year; })[0];
  var retPct = retRow ? retRow.return_pct : null;
  var holdRows = periodHoldingsForInvestor(data.holdings, inv.key, year);

  var html = '<div class="icard' + (isSummit ? ' summit' : '') + '" onclick="openInvestorModal(\'' + inv.key + '\')">';
  html += '<div class="icard-hdr"><div class="icard-left">';
  if (photo) { html += '<img class="icard-photo' + (isSummit ? ' sp' : '') + '" src="' + photo + '" alt="" onerror="this.style.opacity=0.3">'; }
  else { var ini = inv.name.split(' ').slice(0,2).map(function(n){ return n[0]; }).join(''); html += '<div class="icard-ini">' + esc(ini) + '</div>'; }
  html += '<div><div class="icard-name">' + esc(inv.name) + '</div><div class="icard-fund">' + esc(inv.fund) + '</div></div>';
  html += '</div><div><div class="icard-aum-lbl">Portfolio</div><div class="icard-aum-val">' + esc(inv.aum) + '</div></div></div>';

  html += '<div class="icard-mets"><div class="icard-met"><div class="icard-ml">Return in ' + year + '</div><div class="icard-mv' + (retPct == null ? '' : (retPct >= 0 ? ' gp' : ' rn')) + '">' + imPct(retPct) + '</div></div></div>';

  if (holdRows.length) {
    html += '<table class="icard-tbl"><thead><tr><th>Ticker</th><th>Company</th><th class="nr">% Port</th></tr></thead><tbody>';
    holdRows.forEach(function(h) {
      html += '<tr><td><span class="iticker">' + esc(h.ticker || '?') + '</span></td><td><span class="ico">' + esc(h.company_name) + '</span></td><td class="nr" style="color:var(--mu)">' + Number(h.weight_pct).toFixed(2) + '%</td></tr>';
    });
    html += '</tbody></table>';
  } else {
    html += '<div class="im-empty">No holdings on file for ' + year + '.</div>';
  }
  return html + '</div>';
}

function renderCompareBar() {
  var el = document.getElementById('compare-bar');
  if (!el) return;
  var label = 'Compare by Period' + (COMPARE_PERIOD != null ? ' — ' + COMPARE_PERIOD : '') + (COMPARE_OPEN ? ' ▴' : ' ▾');
  var html = '<button type="button" class="im-upload-btn" id="compareToggleBtn">' + esc(label) + '</button>';
  if (COMPARE_OPEN) {
    if (!COMPARE_DATA) {
      html += '<span class="im-loading" style="margin-left:10px">Loading…</span>';
    } else {
      var years = compareYearList(COMPARE_DATA);
      html += '<div class="im-years" style="margin-top:10px">';
      html += '<button type="button" class="im-yr' + (COMPARE_PERIOD == null ? ' active' : '') + '" data-cmp-year="">Current</button>';
      years.forEach(function(y) {
        html += '<button type="button" class="im-yr' + (COMPARE_PERIOD === y ? ' active' : '') + '" data-cmp-year="' + y + '">' + y + '</button>';
      });
      html += '</div>';
      if (!years.length) html += '<div class="im-empty" style="margin-top:6px">No investor data on file yet to compare.</div>';
    }
  }
  el.innerHTML = html;

  document.getElementById('compareToggleBtn').addEventListener('click', async function() {
    COMPARE_OPEN = !COMPARE_OPEN;
    renderCompareBar();
    if (COMPARE_OPEN && !COMPARE_DATA) { await ensureCompareData(); renderCompareBar(); }
  });
  el.querySelectorAll('[data-cmp-year]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var v = btn.getAttribute('data-cmp-year');
      COMPARE_PERIOD = v === '' ? null : parseInt(v, 10);
      renderCompareBar();
      renderInvGrid();
    });
  });
}

// ─── Investor Detail Modal ─────────────────────────────────────
// Click an investor card → yearly returns (last 5yr), that year's top
// holdings, and investor letters. Data lives in Supabase (see
// sql/014_investor_profiles.sql); on localhost, falls back to
// investor-local-seed.js if the migration hasn't been run yet.

function esc(str) { if (!str) return ''; return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function imPct(v){ return v==null ? 'n/a' : (v>=0?'+':'')+v.toFixed(1)+'%'; }

var CAT_LABELS = { annual_letter: 'Annual Letters', investor_message: 'Investor Messages' };

// Official fund website, shown small under the fund name in the pop-up.
// Only add an entry once the URL is verified — better to show nothing
// than a guessed link. Ackman/Pershing Square Holdings confirmed 2026-08.
var INVESTOR_WEBSITES = {
  ackman: 'https://www.pershingsquareholdings.com',
};

async function loadInvestorProfileData(key) {
  var results = await Promise.all([fetchInvestorReturns(key), fetchInvestorHoldings(key), fetchInvestorLetters(key)]);
  var returns = results[0].success ? results[0].data : [];
  var holdings = results[1].success ? results[1].data : [];
  var letters = results[2].success ? results[2].data : [];
  if (location.hostname === 'localhost' && !returns.length && !holdings.length && !letters.length) {
    returns = LOCAL_INVESTOR_RETURNS.filter(function(r){ return r.investor_key === key; });
    holdings = LOCAL_INVESTOR_HOLDINGS.filter(function(r){ return r.investor_key === key; });
    letters = LOCAL_INVESTOR_LETTERS.filter(function(r){ return r.investor_key === key; });
  }
  return { returns: returns, holdings: holdings, letters: letters };
}

// Years shown as pills are the union of years with a return on file and
// years with holdings on file — a 13F upload can add a year before its
// full-year return is known.
function invYearList(data) {
  var years = {};
  data.returns.forEach(function(r) { years[r.year] = years[r.year] || {}; years[r.year].return_pct = r.return_pct; });
  data.holdings.forEach(function(h) { years[h.year] = years[h.year] || {}; });
  return Object.keys(years).map(Number).sort(function(a, b) { return a - b; })
    .map(function(y) { return { year: y, return_pct: years[y].return_pct != null ? years[y].return_pct : null }; });
}

function invYearPillsHtml(yearList, selYear) {
  if (!yearList.length) return '<div class="im-empty">No data on file yet — upload a 13F to get started.</div>';
  return '<div class="im-years">' + yearList.map(function(r) {
    var perfCls = r.return_pct == null ? '' : (r.return_pct >= 0 ? ' pos' : ' neg');
    var cls = 'im-yr' + (r.year === selYear ? ' active' : '') + perfCls;
    return '<button type="button" class="' + cls + '" data-year="' + r.year + '"><span class="im-yr-y">' + r.year + '</span><span class="im-yr-v">' + imPct(r.return_pct) + '</span></button>';
  }).join('') + '</div>';
}

// A year can have several 13F snapshots (one per quarter). Holdings with
// quarter === null are "manual/undated" entries (e.g. the current-holdings
// seed) and are grouped under their own bucket.
function invHoldingsQuarters(holdings, year) {
  var seen = {};
  holdings.filter(function(h) { return h.year === year; }).forEach(function(h) { seen[h.quarter == null ? 'none' : h.quarter] = true; });
  return Object.keys(seen).map(function(k) { return k === 'none' ? null : parseInt(k, 10); })
    .sort(function(a, b) { return (a || 0) - (b || 0); });
}

function invHoldingsHtml(holdings, year, quarter) {
  var rows = holdings.filter(function(h) { return h.year === year && (quarter == null ? h.quarter == null : h.quarter === quarter); })
    .sort(function(a, b) { return (a.rank || 0) - (b.rank || 0); });
  if (!rows.length) return '<div class="im-empty">No holdings on file for ' + year + (quarter ? ' Q' + quarter : '') + '.</div>';
  var html = '<table class="icard-tbl"><thead><tr><th>Ticker</th><th>Company</th><th class="nr">% Port</th></tr></thead><tbody>';
  rows.forEach(function(h) {
    html += '<tr><td><span class="iticker">' + esc(h.ticker || '?') + '</span></td><td><span class="ico">' + esc(h.company_name) + '</span></td><td class="nr" style="color:var(--mu)">' + Number(h.weight_pct).toFixed(2) + '%</td></tr>';
  });
  return html + '</tbody></table>';
}

function invLettersHtml(letters) {
  if (!letters.length) return '<div class="im-empty">No letters on file yet.</div>';
  var byCat = {};
  letters.forEach(function(l) { (byCat[l.category] = byCat[l.category] || []).push(l); });
  var html = '';
  Object.keys(CAT_LABELS).forEach(function(cat) {
    var items = byCat[cat];
    if (!items || !items.length) return;
    html += '<div class="im-let-group"><div class="im-let-cat">' + CAT_LABELS[cat] + '</div>';
    items.forEach(function(l) {
      var isFile = l.type === 'file';
      var inner = '<span class="im-let-title">' + esc(l.title) + '</span>' +
        (l.date ? '<span class="im-let-date">' + esc(l.date) + '</span>' : '') +
        '<span class="im-let-go">' + (isFile ? 'Download' : 'Open ↗') + '</span>';
      html += isFile
        ? '<button type="button" class="im-let-row im-let-file" data-path="' + esc(l.url||'') + '">' + inner + '</button>'
        : '<a class="im-let-row" href="' + esc(l.url||'#') + '" target="_blank" rel="noopener noreferrer">' + inner + '</a>';
    });
    html += '</div>';
  });
  return html || '<div class="im-empty">No letters on file yet.</div>';
}

function renderInvYears(id, data, selYear) {
  var yearsEl = document.getElementById(id + '_years');
  if (!yearsEl) return;
  var yearList = invYearList(data);
  yearsEl.innerHTML = invYearPillsHtml(yearList, selYear);
  renderInvHoldingsForYear(id, data, selYear);
  yearsEl.querySelectorAll('.im-yr').forEach(function(btn) {
    btn.addEventListener('click', function() { renderInvYears(id, data, parseInt(btn.getAttribute('data-year'), 10)); });
  });
}

function renderInvHoldingsForYear(id, data, year) {
  var lblEl = document.getElementById(id + '_hold-lbl');
  if (lblEl) lblEl.textContent = year ? ('Top Holdings — ' + year) : 'Top Holdings';
  if (!year) {
    var holdEl0 = document.getElementById(id + '_holdings');
    if (holdEl0) holdEl0.innerHTML = '<div class="im-empty">No data on file yet.</div>';
    return;
  }
  var quarters = invHoldingsQuarters(data.holdings, year);
  var selQuarter = quarters.length ? quarters[quarters.length - 1] : null;
  renderInvHoldingsQuarter(id, data, year, selQuarter, quarters);
}

function renderInvHoldingsQuarter(id, data, year, quarter, quarters) {
  var holdEl = document.getElementById(id + '_holdings');
  if (!holdEl) return;
  var qHtml = '';
  if (quarters.length > 1) {
    qHtml = '<div class="im-quarters">' + quarters.map(function(q) {
      var on = q === quarter;
      return '<button type="button" class="im-q' + (on ? ' active' : '') + '" data-q="' + (q == null ? '' : q) + '">' + (q ? 'Q' + q : '—') + '</button>';
    }).join('') + '</div>';
  }
  holdEl.innerHTML = qHtml + invHoldingsHtml(data.holdings, year, quarter);
  holdEl.querySelectorAll('.im-q').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var qv = btn.getAttribute('data-q');
      renderInvHoldingsQuarter(id, data, year, qv === '' ? null : parseInt(qv, 10), quarters);
    });
  });
}

function renderInvLetters(id, letters) {
  var el = document.getElementById(id + '_letters');
  if (!el) return;
  el.innerHTML = invLettersHtml(letters);
  el.querySelectorAll('.im-let-file').forEach(function(btn) {
    btn.addEventListener('click', async function() {
      var result = await getFileUrl(btn.getAttribute('data-path'));
      if (result.success && result.data && result.data.signedUrl) window.open(result.data.signedUrl, '_blank');
      else alert('Could not generate download link.');
    });
  });
}

function openInvestorModal(key) {
  var inv = INVESTORS.filter(function(i){ return i.key === key; })[0];
  if (!inv) return;
  document.querySelectorAll('.im-overlay').forEach(function(el){ el.remove(); });

  var id = 'invModal_' + Date.now();
  var photo = inv.photo ? (IMGS[inv.photo] || '') : '';
  var ini = inv.name.split(' ').slice(0,2).map(function(n){ return n[0]; }).join('');
  var website = INVESTOR_WEBSITES[key];
  var websiteHtml = website
    ? '<a class="im-fund-link" href="' + esc(website) + '" target="_blank" rel="noopener noreferrer">' + esc(website.replace(/^https?:\/\//, '').replace(/\/$/, '')) + ' ↗</a>'
    : '';

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay im-overlay open';
  overlay.id = id;
  overlay.innerHTML =
    '<div class="modal-card im-card" onclick="event.stopPropagation()">' +
      '<div class="modal-header im-header">' +
        '<div style="display:flex;align-items:center;gap:12px">' +
          (photo
            ? '<img class="icard-photo" src="' + photo + '" alt="" style="width:44px;height:44px" onerror="this.style.opacity=0.3">'
            : '<div class="icard-ini" style="width:44px;height:44px;font-size:13px">' + esc(ini) + '</div>') +
          '<div><div class="modal-title" style="font-size:16px">' + esc(inv.name) + '</div><div class="icard-fund" style="font-size:11px">' + esc(inv.fund) + '</div>' + websiteHtml + '</div>' +
        '</div>' +
        '<button class="modal-close" id="' + id + '_close">&times;</button>' +
      '</div>' +
      '<div class="im-body">' +
        '<div class="im-section-lbl">Yearly Returns</div>' +
        '<div id="' + id + '_years"><div class="im-loading">Loading…</div></div>' +
        '<div class="im-hold-row">' +
          '<div class="im-section-lbl" id="' + id + '_hold-lbl">Top Holdings</div>' +
          '<button type="button" class="im-upload-btn" id="' + id + '_upload13f">Upload 13F</button>' +
        '</div>' +
        '<div id="' + id + '_holdings"></div>' +
        '<div class="im-section-lbl" style="margin-top:18px">Investor Letters</div>' +
        '<div id="' + id + '_letters"><div class="im-loading">Loading…</div></div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);

  overlay.addEventListener('click', function(e){ if (e.target === overlay) overlay.remove(); });
  document.addEventListener('keydown', function handler(e){ if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', handler); } });
  document.getElementById(id + '_close').addEventListener('click', function(){ overlay.remove(); });

  function refresh(selYear) {
    loadInvestorProfileData(key).then(function(data) {
      if (!document.getElementById(id)) return; // modal already closed
      var yearList = invYearList(data);
      var year = selYear != null ? selYear : (yearList.length ? yearList[yearList.length - 1].year : null);
      renderInvYears(id, data, year);
      renderInvLetters(id, data.letters);
    });
  }

  document.getElementById(id + '_upload13f').addEventListener('click', function() {
    var activeBtn = document.querySelector('#' + id + '_years .im-yr.active');
    var year = activeBtn ? parseInt(activeBtn.getAttribute('data-year'), 10) : new Date().getFullYear();
    openUpload13FPanel(key, year, function(savedYear) { refresh(savedYear); });
  });

  refresh(null);
}

// ─── Upload 13F panel ──────────────────────────────────────────
// Parses the file entirely client-side (js/investor-13f-parser.js), shows
// an editable preview (which rows to keep, ticker overrides), and only
// writes to Supabase once the user hits Apply.

function u13fPreviewHtml(format, rows) {
  var note = format === 'sec_xml'
    ? 'Parsed ' + rows.length + ' positions from the SEC information table. Top 15 by value are pre-selected — fill in any missing tickers below.'
    : 'Parsed ' + rows.length + ' positions from the CSV. Top 15 by weight are pre-selected.';
  var html = '<div class="im-empty" style="margin:10px 0">' + esc(note) + '</div>' +
    '<div class="u13f-preview-wrap"><table class="icard-tbl u13f-tbl"><thead><tr><th></th><th>Ticker</th><th>Company</th><th class="nr">% Port</th></tr></thead><tbody>';
  rows.forEach(function(r, i) {
    html += '<tr>' +
      '<td><input type="checkbox" class="u13f-inc" data-i="' + i + '"' + (r.include ? ' checked' : '') + '></td>' +
      '<td><input type="text" class="u13f-ticker-in" data-i="' + i + '" value="' + esc(r.ticker || '') + '" placeholder="?"></td>' +
      '<td><span class="ico">' + esc(r.companyName) + '</span></td>' +
      '<td class="nr" style="color:var(--mu)">' + r.weightPct.toFixed(2) + '%</td>' +
    '</tr>';
  });
  return html + '</tbody></table></div>';
}

function wireU13fPreview(rootId, rows) {
  document.querySelectorAll('#' + rootId + ' .u13f-inc').forEach(function(cb) {
    cb.addEventListener('change', function() { rows[parseInt(cb.getAttribute('data-i'), 10)].include = cb.checked; });
  });
  document.querySelectorAll('#' + rootId + ' .u13f-ticker-in').forEach(function(inp) {
    inp.addEventListener('input', function() { rows[parseInt(inp.getAttribute('data-i'), 10)].ticker = inp.value.trim().toUpperCase(); });
  });
}

function openUpload13FPanel(investorKey, defaultYear, onSaved) {
  var id = 'u13f_' + Date.now();
  var nowYear = new Date().getFullYear();
  var defaultQuarter = Math.floor(new Date().getMonth() / 3) + 1;
  var years = [];
  for (var y = nowYear + 1; y >= nowYear - 6; y--) years.push(y);

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay im-overlay open';
  overlay.id = id;
  overlay.innerHTML =
    '<div class="modal-card im-card u13f-card" onclick="event.stopPropagation()">' +
      '<div class="modal-header im-header">' +
        '<div class="modal-title" style="font-size:15px">Upload 13F</div>' +
        '<button class="modal-close" id="' + id + '_close">&times;</button>' +
      '</div>' +
      '<div class="im-body">' +
        '<div class="modal-row">' +
          '<div class="modal-field"><label class="modal-label">Year</label><select class="modal-input" id="' + id + '_year">' +
            years.map(function(yy){ return '<option value="' + yy + '"' + (yy === defaultYear ? ' selected' : '') + '>' + yy + '</option>'; }).join('') +
          '</select></div>' +
          '<div class="modal-field"><label class="modal-label">Quarter</label><select class="modal-input" id="' + id + '_q">' +
            [1,2,3,4].map(function(q){ return '<option value="' + q + '"' + (q === defaultQuarter ? ' selected' : '') + '>Q' + q + '</option>'; }).join('') +
          '</select></div>' +
        '</div>' +
        '<div class="modal-field">' +
          '<label class="modal-label">13F file — SEC EDGAR XML, or CSV from WhaleWisdom / Fintel / Dataroma</label>' +
          '<input type="file" id="' + id + '_file" accept=".xml,.csv,.txt">' +
        '</div>' +
        '<div class="modal-msg" id="' + id + '_msg"></div>' +
        '<div id="' + id + '_preview"></div>' +
        '<div class="modal-actions" id="' + id + '_actions" style="display:none">' +
          '<button class="modal-btn modal-btn--cancel" id="' + id + '_cancel">Cancel</button>' +
          '<button class="modal-btn modal-btn--save" id="' + id + '_apply">Apply</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) overlay.remove(); });
  document.getElementById(id + '_close').addEventListener('click', function(){ overlay.remove(); });
  document.getElementById(id + '_cancel').addEventListener('click', function(){ overlay.remove(); });

  var parsedRows = null, parsedFormat = null;

  document.getElementById(id + '_file').addEventListener('change', function(e) {
    var file = e.target.files[0];
    var msgEl = document.getElementById(id + '_msg');
    var previewEl = document.getElementById(id + '_preview');
    var actionsEl = document.getElementById(id + '_actions');
    msgEl.textContent = ''; msgEl.className = 'modal-msg';
    previewEl.innerHTML = ''; actionsEl.style.display = 'none';
    parsedRows = null; parsedFormat = null;
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function() {
      try {
        var result = parse13FFile(file.name, String(reader.result));
        parsedFormat = result.format;
        parsedRows = result.rows.map(function(r, i) { return { ticker: r.ticker || '', companyName: r.companyName, cusip: r.cusip || '', valueUsd: r.valueUsd || 0, weightPct: r.weightPct, include: i < 15 }; });
        previewEl.innerHTML = u13fPreviewHtml(parsedFormat, parsedRows);
        wireU13fPreview(id + '_preview', parsedRows);
        actionsEl.style.display = 'flex';
      } catch (err) {
        msgEl.textContent = err.message || 'Could not read this file.';
        msgEl.className = 'modal-msg error';
      }
    };
    reader.onerror = function() { msgEl.textContent = 'Could not read this file.'; msgEl.className = 'modal-msg error'; };
    reader.readAsText(file);
  });

  document.getElementById(id + '_apply').addEventListener('click', async function() {
    if (!parsedRows) return;
    var year = parseInt(document.getElementById(id + '_year').value, 10);
    var quarter = parseInt(document.getElementById(id + '_q').value, 10);
    var included = parsedRows.filter(function(r){ return r.include; });
    if (!included.length) { alert('Select at least one holding to save.'); return; }
    if (included.some(function(r){ return !r.ticker; })) { alert('Fill in the ticker for every selected row before applying.'); return; }
    var btn = document.getElementById(id + '_apply');
    btn.disabled = true; btn.textContent = 'Saving…';
    var rows = included.map(function(r, i) {
      return {
        investor_key: investorKey, year: year, quarter: quarter,
        ticker: r.ticker, company_name: r.companyName, cusip: r.cusip || null,
        value_usd: r.valueUsd || null, weight_pct: r.weightPct, rank: i + 1,
        source_type: parsedFormat,
      };
    });
    var result = await replaceInvestorHoldings(investorKey, year, quarter, rows);
    if (result.success) {
      overlay.remove();
      if (onSaved) onSaved(year);
    } else {
      btn.disabled = false; btn.textContent = 'Apply';
      alert('Could not save: ' + (result.error && result.error.message));
    }
  });
}

// Expose to window for inline onclick handlers
window.toggleFund = toggleFund;
window.allFunds = allFunds;
window.setAlphaStart = setAlphaStart;
window.setAlphaMode = setAlphaMode;
window.openInvestorModal = openInvestorModal;

export function loadHedgeFundsPage() {
  if (!HF_FUNDS || !HF_FUNDS.length || !INVESTORS || !INVESTORS.length) {
    var main = document.getElementById('tp-inv');
    if (main) main.innerHTML = '<div style="text-align:center;color:var(--neg);padding:34px;font-size:13px">Hedge fund data failed to load. Please refresh the page.</div>';
    return;
  }
  renderFundChips();
  renderAlphaChart();
  renderBenchmark();
  renderCompareBar();
  renderInvGrid();
}
