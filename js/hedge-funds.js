// hedge-funds.js — extracted from summit-research-portal.html
import { INVESTORS, SP500_REF, SP500_B26, HF_FUNDS, HF_BMK, HF_AYEARS, YEARS, SP500, IMGS, ALL_STOCKS } from './portal-data.js';
import { fetchInvestorReturns, fetchInvestorHoldings, fetchInvestorLetters, replaceInvestorHoldings, syncLatest13F, getFileUrl } from './api.js';
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

function toggleChartVisibility(show){
  var card=document.getElementById('hf-chart-card');if(!card)return;
  card.style.display=show?'':'none';
  if(show&&alphaChart){requestAnimationFrame(function(){alphaChart.resize();});}
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

// ─── Hide / Show all (main grid) ──────────────────────────────
// Per-card "hide" so a crowded grid can be trimmed to just the
// investors someone actually tracks; persisted in localStorage so it
// stays trimmed across visits. "Show all" (in the section header)
// brings everything back.

var HF_HIDDEN_LS_KEY = 'hf_hidden_investors';

function getHiddenInvestors() {
  try { return JSON.parse(localStorage.getItem(HF_HIDDEN_LS_KEY) || '[]'); } catch (e) { return []; }
}

function hideInvestor(key, ev) {
  if (ev) ev.stopPropagation();
  var hidden = getHiddenInvestors();
  if (hidden.indexOf(key) === -1) {
    hidden.push(key);
    localStorage.setItem(HF_HIDDEN_LS_KEY, JSON.stringify(hidden));
  }
  renderInvGrid();
}

function showAllInvestors() {
  localStorage.removeItem(HF_HIDDEN_LS_KEY);
  renderInvGrid();
}

function renderShowAllControl(hiddenCount) {
  var btn = document.getElementById('hf-showall');
  if (!btn) return;
  if (hiddenCount > 0) {
    btn.textContent = 'Show all (' + hiddenCount + ' hidden)';
    btn.style.display = '';
  } else {
    btn.style.display = 'none';
  }
}

function renderInvGrid(){
  var grid=document.getElementById('inv-grid');if(!grid)return;
  var hidden=getHiddenInvestors();
  renderShowAllControl(hidden.length);
  var html='';
  INVESTORS.filter(function(inv){ return hidden.indexOf(inv.key)===-1; }).forEach(function(inv){
    var isSummit=inv.key==='summit';
    var photo=inv.photo?(IMGS[inv.photo]||''):'';
    var hasPerf=inv.cum!=null;var cumClr=hasPerf?(inv.cum>=300?'gold':inv.cum>=171?'gp':''):'';
    var q1html=inv.q1!=null
      ?'<div class="icard-mv '+(inv.q1>=0?'gp':'rn')+'">'+(inv.q1>0?'+':'')+inv.q1.toFixed(2)+'%</div>'
      :'<div class="icard-mv" style="color:var(--mu);font-size:11px">n/a</div>';
    var cumLbl=inv.q1!=null?'Cumul. 2019&ndash;Q1 26':'Cumul. 2019&ndash;2025';
    html+='<div class="icard'+(isSummit?' summit':'')+'" onclick="openInvestorDetail(\''+inv.key+'\')">';
    html+='<button type="button" class="icard-hide-btn" title="Hide this card" onclick="hideInvestor(\''+inv.key+'\', event)">&times;</button>';
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

// ─── Investor Detail page — shared data + rendering helpers ──
// Click an investor card → a full-page profile (see openInvestorDetail
// near the bottom): yearly returns, the holdings comparison across
// quarters, and investor letters. Data lives in Supabase (see
// sql/014_investor_profiles.sql); on localhost, falls back to
// investor-local-seed.js if the migration hasn't been run yet.

function esc(str) { if (!str) return ''; return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function imPct(v){ return v==null ? 'n/a' : (v>=0?'+':'')+v.toFixed(1)+'%'; }

var CAT_LABELS = { annual_letter: 'Annual Letters', investor_message: 'Investor Messages' };

// Official fund website, shown small under the fund name on the detail page.
// Only add an entry once the URL is verified — better to show nothing
// than a guessed link. Ackman/Pershing Square Holdings confirmed 2026-08.
var INVESTOR_WEBSITES = {
  ackman: 'https://www.pershingsquareholdings.com',
};

// SEC EDGAR CIK per investor's 13F-filing entity — only set once verified,
// same rule as INVESTOR_WEBSITES. Drives the "Sync latest 13F" button:
// investors without a CIK on file just don't get the button (Upload 13F
// still works for everyone). Ackman/Pershing Square Capital Management
// LP confirmed 2026-08 (sql/014_investor_profiles.sql).
var INVESTOR_CIK = {
  ackman: '0001336528',
  buffett: '0001067983',  // Berkshire Hathaway Inc
  tepper: '0001656456',   // Appaloosa LP
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

// ─── Holdings Comparison (buys / sells / new positions) ──────
// A "period" is one 13F snapshot: {year, quarter}. quarter===null is the
// legacy/manual "current holdings" bucket (e.g. the initial seed) and
// sorts as if it were after Q4 of that year, so it reads as the freshest
// thing on file until real quarterly uploads replace it.

function periodSortKey(p) { return p.year * 10 + (p.quarter == null ? 5 : p.quarter); }
function periodKeyEq(a, b) { return a.year === b.year && a.quarter === b.quarter; }
function periodLabel(p) { return p.quarter ? ('Q' + p.quarter + ' ' + p.year) : (p.year + ' (latest)'); }
function periodOptionValue(p) { return p.year + '-' + (p.quarter == null ? '' : p.quarter); }
function rowKey(h) { return h.ticker ? h.ticker : '~' + h.company_name; }

function investorPeriods(holdings, investorKey) {
  var seen = {};
  holdings.filter(function(h) { return h.investor_key === investorKey; }).forEach(function(h) {
    seen[periodOptionValue({ year: h.year, quarter: h.quarter })] = { year: h.year, quarter: h.quarter };
  });
  return Object.keys(seen).map(function(k) { return seen[k]; }).sort(function(a, b) { return periodSortKey(a) - periodSortKey(b); });
}

function periodWeightMap(holdings, investorKey, p) {
  var map = {};
  holdings.filter(function(h) {
    return h.investor_key === investorKey && h.year === p.year && (p.quarter == null ? h.quarter == null : h.quarter === p.quarter);
  }).forEach(function(h) { map[rowKey(h)] = h; });
  return map;
}

function computeHoldingsComparison(holdings, investorKey, periods) {
  var maps = periods.map(function(p) { return periodWeightMap(holdings, investorKey, p); });
  var allKeys = {};
  maps.forEach(function(m) { Object.keys(m).forEach(function(k) { allKeys[k] = true; }); });
  var rows = Object.keys(allKeys).map(function(k) {
    var cells = maps.map(function(m) { return m[k] ? m[k].weight_pct : null; });
    var name = '', ticker = k.charAt(0) === '~' ? '' : k;
    for (var i = maps.length - 1; i >= 0; i--) { if (maps[i][k]) { name = maps[i][k].company_name; break; } }
    return { key: k, ticker: ticker, companyName: name, cells: cells };
  });
  rows.sort(function(a, b) {
    var la = a.cells[a.cells.length - 1], lb = b.cells[b.cells.length - 1];
    var pa = a.cells[a.cells.length - 2], pb = b.cells[b.cells.length - 2];
    var va = la != null ? la : (pa != null ? -1 : -2);
    var vb = lb != null ? lb : (pb != null ? -1 : -2);
    if (vb !== va) return vb - va;
    return (pb != null ? pb : -1) - (pa != null ? pa : -1);
  });
  return rows;
}

function classifyMove(prev, curr) {
  if (prev == null && curr == null) return null;
  if (prev == null) return 'new';
  if (curr == null) return 'sold';
  var delta = curr - prev;
  if (Math.abs(delta) < 0.15) return 'flat';
  return delta > 0 ? 'up' : 'down';
}

function moveBadgeHtml(prev, curr) {
  var move = classifyMove(prev, curr);
  if (move === 'new') return '<span class="ivd-badge new">NEW</span>';
  if (move === 'sold') return '<span class="ivd-badge sold">SOLD</span>';
  if (move === 'up') return '<span class="ivd-badge up">▲ +' + (curr - prev).toFixed(2) + 'pp</span>';
  if (move === 'down') return '<span class="ivd-badge down">▼ ' + (curr - prev).toFixed(2) + 'pp</span>';
  if (move === 'flat') return '<span class="ivd-badge flat">flat</span>';
  return '';
}

function weightCellHtml(w, isCur) {
  return '<td class="nr' + (isCur ? ' ivd-cmp-current' : '') + '">' + (w == null ? '—' : w.toFixed(2) + '%') + '</td>';
}

// Ticker → current-year YTD stock return, for the YTD column. Sourced
// from ALL_STOCKS (r26) first, falling back to any investor card's
// hardcoded holding YTD (covers a few tickers, like BN, not in
// ALL_STOCKS). Historical/delisted tickers with neither on file show n/a
// rather than a guessed number.
var TICKER_YTD_MAP = null;
function tickerYtdMap() {
  if (TICKER_YTD_MAP) return TICKER_YTD_MAP;
  var map = {};
  ALL_STOCKS.forEach(function(s) { if (s.r26 != null) map[s.t] = s.r26; });
  INVESTORS.forEach(function(inv) { (inv.holdings || []).forEach(function(h) { if (h.ytd != null && map[h.t] == null) map[h.t] = h.ytd; }); });
  TICKER_YTD_MAP = map;
  return map;
}
function tickerYtd(ticker) { return ticker ? (tickerYtdMap()[ticker] != null ? tickerYtdMap()[ticker] : null) : null; }

function ytdCellHtml(ytd) {
  if (ytd == null) return '<td class="nr" style="color:var(--mu);font-size:11px">n/a</td>';
  var cls = ytd >= 0 ? 'rp' : 'rn';
  return '<td class="nr"><span class="rpill ' + cls + '">' + (ytd >= 0 ? '+' : '') + ytd.toFixed(1) + '%</span></td>';
}

function renderHoldingsCompareTable(rows, periods) {
  if (!rows.length) return '<div class="im-empty">No holdings on file yet — upload a 13F to get started.</div>';
  var curIdx = periods.length - 1;
  var html = '<div class="ivd-cmp-wrap"><table class="icard-tbl ivd-cmp-tbl"><thead><tr><th>Ticker</th><th>Company</th>';
  periods.forEach(function(p, i) {
    var isCur = i === curIdx;
    html += '<th class="nr' + (isCur ? ' ivd-cmp-current' : '') + '">' + esc(periodLabel(p)) + (isCur ? ' <span class="ivd-cmp-current-tag">Current</span>' : '') + '</th>';
  });
  if (periods.length > 1) html += '<th class="nr">Move</th>';
  html += '<th class="nr" title="The stock\'s YTD return today — not tied to the period shown">Current YTD</th>';
  html += '</tr></thead><tbody>';
  rows.forEach(function(r) {
    html += '<tr><td><span class="iticker">' + esc(r.ticker || '?') + '</span></td><td><span class="ico">' + esc(r.companyName) + '</span></td>';
    r.cells.forEach(function(w, i) { html += weightCellHtml(w, i === curIdx); });
    if (periods.length > 1) html += '<td class="nr">' + moveBadgeHtml(r.cells[r.cells.length - 2], r.cells[r.cells.length - 1]) + '</td>';
    html += ytdCellHtml(tickerYtd(r.ticker));
    html += '</tr>';
  });
  return html + '</tbody></table></div>';
}

function generateMovesSummary(rows, periods) {
  if (periods.length < 2) return '';
  var newPos = [], sold = [], up = [], down = [];
  rows.forEach(function(r) {
    var prev = r.cells[r.cells.length - 2], curr = r.cells[r.cells.length - 1];
    var move = classifyMove(prev, curr);
    if (move === 'new') newPos.push(r);
    else if (move === 'sold') sold.push(r);
    else if (move === 'up') up.push({ row: r, delta: curr - prev });
    else if (move === 'down') down.push({ row: r, delta: curr - prev });
  });
  up.sort(function(a, b) { return b.delta - a.delta; });
  down.sort(function(a, b) { return a.delta - b.delta; });

  var lines = [];
  newPos.forEach(function(r) {
    var curr = r.cells[r.cells.length - 1];
    lines.push('<b>New position: ' + esc(r.ticker || r.companyName) + '</b> — enters at ' + curr.toFixed(2) + '% of the portfolio.');
  });
  sold.forEach(function(r) {
    var prev = r.cells[r.cells.length - 2];
    lines.push('<b>Exited: ' + esc(r.ticker || r.companyName) + '</b> — was ' + prev.toFixed(2) + '%, no longer held.');
  });
  up.slice(0, 3).forEach(function(o) {
    var prev = o.row.cells[o.row.cells.length - 2], curr = o.row.cells[o.row.cells.length - 1];
    lines.push('<b>Increased ' + esc(o.row.ticker || o.row.companyName) + '</b> from ' + prev.toFixed(2) + '% to ' + curr.toFixed(2) + '% (+' + o.delta.toFixed(2) + 'pp).');
  });
  down.slice(0, 3).forEach(function(o) {
    var prev = o.row.cells[o.row.cells.length - 2], curr = o.row.cells[o.row.cells.length - 1];
    lines.push('<b>Trimmed ' + esc(o.row.ticker || o.row.companyName) + '</b> from ' + prev.toFixed(2) + '% to ' + curr.toFixed(2) + '% (' + o.delta.toFixed(2) + 'pp).');
  });

  var hdr = '<div class="ivd-summary-hdr">' + esc(periodLabel(periods[periods.length - 2])) + ' &rarr; ' + esc(periodLabel(periods[periods.length - 1])) + '</div>';
  if (!lines.length) return hdr + '<div class="im-empty">No notable changes between these two periods.</div>';
  return hdr + '<ul class="ivd-summary-list"><li>' + lines.join('</li><li>') + '</li></ul>';
}

// Single "reference period" selector — the table shows the reference
// period plus N periods before it (chronologically), where N is
// adjustable with the +/- stepper below. Two pools to pick the reference
// period from: every quarter on file ("Quarterly"), or just each year's
// Q4 close ("Year-end"), for a clean year-over-year read.
var HOLDINGS_DEFAULT_COUNT = 4; // reference period + 3 before it, to start

function yearEndPeriods(allPeriods) {
  return allPeriods.filter(function(p) { return p.quarter === 4; });
}

function periodsUpTo(pool, refPeriod, count) {
  var idx = pool.length - 1;
  for (var i = 0; i < pool.length; i++) { if (periodKeyEq(pool[i], refPeriod)) { idx = i; break; } }
  var start = Math.max(0, idx - (count - 1));
  return pool.slice(start, idx + 1);
}

function periodTotalValue(holdings, investorKey, p) {
  var rows = holdings.filter(function(h) {
    return h.investor_key === investorKey && h.year === p.year && (p.quarter == null ? h.quarter == null : h.quarter === p.quarter);
  });
  return { total: rows.reduce(function(s, h) { return s + (Number(h.value_usd) || 0); }, 0), count: rows.length };
}

function fmtUsdCompact(v) {
  if (!v) return 'n/a';
  if (v >= 1e9) return '$' + (v / 1e9).toFixed(2) + 'B';
  if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M';
  return '$' + Math.round(v).toLocaleString();
}

function renderStatStrip(holdings, investorKey, refPeriod, rows, curIdx) {
  var pv = periodTotalValue(holdings, investorKey, refPeriod);
  var refWeights = rows.map(function(r) { return r.cells[curIdx]; }).filter(function(w) { return w != null; }).sort(function(a, b) { return b - a; });
  var top3 = refWeights.slice(0, 3).reduce(function(s, w) { return s + w; }, 0);
  return '<div class="ivd-stats">' +
    '<div class="ivd-stat"><div class="ivd-stat-lbl">Positions</div><div class="ivd-stat-val">' + (pv.count || refWeights.length) + '</div></div>' +
    '<div class="ivd-stat"><div class="ivd-stat-lbl">Portfolio Value</div><div class="ivd-stat-val">' + fmtUsdCompact(pv.total) + '</div></div>' +
    '<div class="ivd-stat"><div class="ivd-stat-lbl">Top 3 Concentration</div><div class="ivd-stat-val">' + (top3 ? top3.toFixed(1) + '%' : 'n/a') + '</div></div>' +
    '</div>';
}

function renderPeriodPicker(allPeriods, pool, refPeriod, mode, count, maxCount) {
  if (allPeriods.length <= 1) return '';
  var displayList = pool.slice().reverse(); // most recent first
  var yearEndCount = yearEndPeriods(allPeriods).length;
  var html = '<div class="ivd-period-pickers">';
  html += '<div class="ivd-pp"><label class="modal-label">Reference period</label><select class="modal-input ivd-pp-sel">' +
    displayList.map(function(ap) {
      return '<option value="' + periodOptionValue(ap) + '"' + (periodKeyEq(ap, refPeriod) ? ' selected' : '') + '>' + esc(periodLabel(ap)) + '</option>';
    }).join('') + '</select></div>';
  html += '<div class="sb-toggle ivd-mode-toggle">' +
    '<button type="button" class="sb-tbtn' + (mode === 'quarterly' ? ' active' : '') + '" data-mode="quarterly">Quarterly</button>' +
    '<button type="button" class="sb-tbtn' + (mode === 'yearend' ? ' active' : '') + '"' + (yearEndCount < 2 ? ' disabled title="Not enough Q4 closes on file"' : '') + ' data-mode="yearend">Year-end (Q4)</button>' +
    '</div>';
  html += '<div class="ivd-pp-stepper">' +
    '<button type="button" class="ivd-step-btn ivd-step-minus"' + (count <= 2 ? ' disabled' : '') + ' title="Fewer periods">&minus;</button>' +
    '<span class="ivd-pp-count">' + count + ' period' + (count === 1 ? '' : 's') + '</span>' +
    '<button type="button" class="ivd-step-btn ivd-step-plus"' + (count >= maxCount ? ' disabled' : '') + ' title="More periods">+</button>' +
    '</div>';
  html += '</div>';
  return html;
}

// ─── Holdings Composition chart ───────────────────────────────
// A 100%-stacked bar (or area) showing how the portfolio's makeup
// shifted quarter to quarter — same "selected" periods as the table
// below it, so the two always agree. Top N holdings get their own
// band (max 8 — the validated categorical palette's limit); everything
// else folds into a single "Other" band rather than generating more
// hues. Colors are assigned per-ticker the first time it's seen and
// then reused, so a filter/period change never repaints a holding
// that's still on screen.

var HOLDINGS_CHART_COLORS = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'];
var HOLDINGS_CHART_OTHER_COLOR = '#898781';
var holdingsChartColorMap = {};
var holdingsChartNextSlot = 0;
function tickerChartColor(key) {
  if (!holdingsChartColorMap[key]) {
    holdingsChartColorMap[key] = HOLDINGS_CHART_COLORS[holdingsChartNextSlot % HOLDINGS_CHART_COLORS.length];
    holdingsChartNextSlot++;
  }
  return holdingsChartColorMap[key];
}

var ivdChartInstance = null;
function destroyIvdChart() { if (ivdChartInstance) { ivdChartInstance.destroy(); ivdChartInstance = null; } }

function buildHoldingsChartData(rows, periods, topN) {
  var ranked = rows.map(function(r) {
    var maxW = 0;
    r.cells.forEach(function(w) { if (w != null && w > maxW) maxW = w; });
    return { key: r.ticker || ('~' + r.companyName), ticker: r.ticker, companyName: r.companyName, cells: r.cells, maxW: maxW };
  }).sort(function(a, b) { return b.maxW - a.maxW; });

  var top = ranked.slice(0, topN);
  var rest = ranked.slice(topN);

  var datasets = top.map(function(r) {
    return {
      label: r.ticker || r.companyName,
      companyName: r.companyName,
      data: r.cells.map(function(w) { return w == null ? 0 : w; }),
      backgroundColor: tickerChartColor(r.key),
      stack: 'holdings',
    };
  });
  if (rest.length) {
    var otherData = periods.map(function(p, i) { return +rest.reduce(function(s, r) { return s + (r.cells[i] || 0); }, 0).toFixed(2); });
    datasets.push({ label: 'Other (' + rest.length + ')', companyName: '', data: otherData, backgroundColor: HOLDINGS_CHART_OTHER_COLOR, stack: 'holdings' });
  }
  return { labels: periods.map(periodLabel), datasets: datasets };
}

function renderHoldingsChart(canvasEl, rows, periods, state) {
  destroyIvdChart();
  if (!canvasEl || typeof Chart === 'undefined' || !rows.length) return;
  var chartData = buildHoldingsChartData(rows, periods, state.chartTopN);
  var isArea = state.chartMode === 'area';
  var datasets = chartData.datasets.map(function(ds) {
    var base = { label: ds.label, data: ds.data, stack: ds.stack, backgroundColor: ds.backgroundColor };
    return isArea
      ? Object.assign(base, { fill: true, borderColor: '#fff', borderWidth: 1, pointRadius: 0, pointHoverRadius: 4, tension: 0.15 })
      : Object.assign(base, { borderColor: '#fff', borderWidth: 2 });
  });
  ivdChartInstance = new Chart(canvasEl.getContext('2d'), {
    type: isArea ? 'line' : 'bar',
    data: { labels: chartData.labels, datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 10, font: { size: 10 }, color: '#1E2733' } },
        tooltip: {
          mode: 'index', intersect: false,
          filter: function(item) { return item.raw > 0; },
          callbacks: { label: function(c) { return c.dataset.label + ': ' + c.raw.toFixed(2) + '%'; } },
        },
      },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { color: '#8A93A0', font: { size: 10 } } },
        y: { stacked: true, min: 0, max: 100, grid: { color: '#EEF2F7' }, ticks: { color: '#8A93A0', font: { size: 10 }, callback: function(v) { return v + '%'; } } },
      },
    },
  });
}

function renderHoldingsChartSection(state) {
  var visible = state.chartVisible !== false;
  var html = '<div class="ivd-chart-hdr">' +
    '<div class="im-section-lbl" style="margin-bottom:0">Holdings Composition</div>' +
    '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">';
  if (visible) {
    html += '<div class="sb-toggle ivd-chart-format-toggle">' +
        '<button type="button" class="sb-tbtn' + (state.chartMode !== 'area' ? ' active' : '') + '" data-chart-mode="bar">Bars</button>' +
        '<button type="button" class="sb-tbtn' + (state.chartMode === 'area' ? ' active' : '') + '" data-chart-mode="area">Area</button>' +
      '</div>' +
      '<div class="ivd-pp-stepper">' +
        '<button type="button" class="ivd-step-btn ivd-chart-n-minus"' + (state.chartTopN <= 2 ? ' disabled' : '') + ' title="Fewer holdings">&minus;</button>' +
        '<span class="ivd-pp-count">Top ' + state.chartTopN + '</span>' +
        '<button type="button" class="ivd-step-btn ivd-chart-n-plus"' + (state.chartTopN >= 8 ? ' disabled' : '') + ' title="More holdings">+</button>' +
      '</div>';
  }
  html += '<label class="hf-chart-toggle" title="Show or hide the chart">' +
      '<input type="checkbox" class="ivd-chart-toggle-input"' + (visible ? ' checked' : '') + '>' +
      '<span class="hf-chart-toggle-track"><span class="hf-chart-toggle-thumb"></span></span>' +
      '<span class="hf-chart-toggle-txt">Chart</span>' +
    '</label>' +
    '</div></div>';
  if (visible) html += '<div class="ivd-chart-wrap"><canvas class="ivd-chart-canvas"></canvas></div>';
  return html;
}

function renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state) {
  var el = document.getElementById(rootId + '_cmp');
  var sumEl = document.getElementById(rootId + '_summary');
  var sharedEl = document.getElementById(rootId + '_shared');
  if (!el) return;

  var pool = state.mode === 'yearend' ? yearEndPeriods(allPeriods) : allPeriods;
  if (!pool.length) pool = allPeriods;
  if (!pool.some(function(p) { return periodKeyEq(p, state.refPeriod); })) state.refPeriod = pool[pool.length - 1];
  var maxCount = pool.length;
  if (state.count > maxCount) state.count = maxCount;
  if (state.count < 1) state.count = 1;

  var selected = periodsUpTo(pool, state.refPeriod, state.count);
  var rows = computeHoldingsComparison(holdings, investorKey, selected);
  var curIdx = selected.length - 1;

  var html = renderStatStrip(holdings, investorKey, selected[curIdx], rows, curIdx);
  html += renderPeriodPicker(allPeriods, pool, state.refPeriod, state.mode, state.count, maxCount);
  html += renderHoldingsChartSection(state);
  html += renderHoldingsCompareTable(rows, selected);
  destroyIvdChart();
  el.innerHTML = html;

  var sel = el.querySelector('.ivd-pp-sel');
  if (sel) {
    sel.addEventListener('change', function() {
      var parts = sel.value.split('-');
      state.refPeriod = { year: parseInt(parts[0], 10), quarter: parts[1] === '' ? null : parseInt(parts[1], 10) };
      renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state);
    });
  }
  el.querySelectorAll('.ivd-mode-toggle [data-mode]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (btn.disabled) return;
      state.mode = btn.getAttribute('data-mode');
      renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state);
    });
  });
  var minusBtn = el.querySelector('.ivd-step-minus');
  if (minusBtn) minusBtn.addEventListener('click', function() { state.count = Math.max(1, state.count - 1); renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state); });
  var plusBtn = el.querySelector('.ivd-step-plus');
  if (plusBtn) plusBtn.addEventListener('click', function() { state.count = Math.min(maxCount, state.count + 1); renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state); });

  var chartToggle = el.querySelector('.ivd-chart-toggle-input');
  if (chartToggle) chartToggle.addEventListener('change', function() { state.chartVisible = chartToggle.checked; renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state); });
  el.querySelectorAll('.ivd-chart-format-toggle [data-chart-mode]').forEach(function(btn) {
    btn.addEventListener('click', function() { state.chartMode = btn.getAttribute('data-chart-mode'); renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state); });
  });
  var nMinus = el.querySelector('.ivd-chart-n-minus');
  if (nMinus) nMinus.addEventListener('click', function() { state.chartTopN = Math.max(2, state.chartTopN - 1); renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state); });
  var nPlus = el.querySelector('.ivd-chart-n-plus');
  if (nPlus) nPlus.addEventListener('click', function() { state.chartTopN = Math.min(8, state.chartTopN + 1); renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state); });
  var chartCanvas = el.querySelector('.ivd-chart-canvas');
  if (chartCanvas) renderHoldingsChart(chartCanvas, rows, selected, state);

  if (sumEl) sumEl.innerHTML = selected.length >= 2 ? generateMovesSummary(rows, selected)
    : '<div class="im-empty">Add another period to see period-over-period changes.</div>';
  if (sharedEl) sharedEl.innerHTML = renderSharedWithSummit(investorKey, rows, selected, curIdx);
}

function renderHoldingsSection(rootId, investorKey, holdings) {
  var el = document.getElementById(rootId + '_cmp');
  if (!el) return;
  var allPeriods = investorPeriods(holdings, investorKey);
  if (!allPeriods.length) {
    el.innerHTML = '<div class="im-empty">No holdings on file yet — upload a 13F to get started.</div>';
    var sumEl = document.getElementById(rootId + '_summary'); if (sumEl) sumEl.innerHTML = '';
    var sharedEl = document.getElementById(rootId + '_shared'); if (sharedEl) sharedEl.innerHTML = '';
    return;
  }
  var state = { refPeriod: allPeriods[allPeriods.length - 1], mode: 'quarterly', count: Math.min(HOLDINGS_DEFAULT_COUNT, allPeriods.length), chartVisible: true, chartMode: 'bar', chartTopN: 6 };
  renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state);
}

// ─── Shared with Summit ───────────────────────────────────────
// Positions Summit's own book (INVESTORS[key='summit']) has in common
// with this investor's reference-period holdings, with both allocations
// side by side.

function renderSharedWithSummit(investorKey, rows, periods, curIdx) {
  if (investorKey === 'summit') return '<div class="im-empty">This is Summit&rsquo;s own portfolio.</div>';
  var summitInv = INVESTORS.filter(function(i) { return i.key === 'summit'; })[0];
  if (!summitInv) return '';
  var invRow = INVESTORS.filter(function(i) { return i.key === investorKey; })[0];
  var invName = invRow ? invRow.name.split(' ').pop() : 'Investor';
  var summitMap = {};
  summitInv.holdings.forEach(function(h) { summitMap[h.t] = h; });
  var shared = rows
    .filter(function(r) { return r.ticker && summitMap[r.ticker] && r.cells[curIdx] != null; })
    .map(function(r) { return { ticker: r.ticker, investorW: r.cells[curIdx], summitW: summitMap[r.ticker].w }; })
    .sort(function(a, b) { return b.investorW - a.investorW; });
  if (!shared.length) return '<div class="im-empty">No overlapping positions with Summit&rsquo;s own portfolio in ' + esc(periodLabel(periods[curIdx])) + '.</div>';
  var html = '<ul class="ivd-shared-list">';
  shared.forEach(function(s) {
    html += '<li><span class="iticker">' + esc(s.ticker) + '</span> &mdash; Summit <b>' + s.summitW.toFixed(2) + '%</b>, ' + esc(invName) + ' <b>' + s.investorW.toFixed(2) + '%</b></li>';
  });
  return html + '</ul>';
}

// ─── Investor Detail page ─────────────────────────────────────
// Replaces the old pop-up: clicking a card swaps the Hedge Funds tab from
// the grid to a full page for that investor — returns always visible up
// top, the holdings comparison + auto-written summary of the biggest
// moves, and Letters & Resources below.

function openInvestorDetail(key) {
  var inv = INVESTORS.filter(function(i){ return i.key === key; })[0];
  var root = document.getElementById('inv-detailview');
  if (!inv || !root) return;
  destroyIvdChart();

  var photo = inv.photo ? (IMGS[inv.photo] || '') : '';
  var ini = inv.name.split(' ').slice(0,2).map(function(n){ return n[0]; }).join('');
  var website = INVESTOR_WEBSITES[key];
  var websiteHtml = website
    ? '<a class="im-fund-link" href="' + esc(website) + '" target="_blank" rel="noopener noreferrer">' + esc(website.replace(/^https?:\/\//, '').replace(/\/$/, '')) + ' ↗</a>'
    : '';

  root.innerHTML =
    '<button type="button" class="ivd-back" id="ivd-back">&larr; Back to Superinvestors</button>' +
    '<div class="ivd-header">' +
      (photo
        ? '<img class="icard-photo" src="' + photo + '" alt="" style="width:56px;height:56px" onerror="this.style.opacity=0.3">'
        : '<div class="icard-ini" style="width:56px;height:56px;font-size:16px">' + esc(ini) + '</div>') +
      '<div><div class="ivd-name">' + esc(inv.name) + '</div><div class="icard-fund">' + esc(inv.fund) + '</div>' + websiteHtml + '</div>' +
      '<div style="flex:1"></div>' +
      '<div style="text-align:right"><div class="icard-aum-lbl">Portfolio</div><div class="icard-aum-val">' + esc(inv.aum) + '</div></div>' +
    '</div>' +
    '<div class="im-section-lbl">Yearly Returns</div>' +
    '<div id="ivd_years"><div class="im-loading">Loading…</div></div>' +
    '<div class="im-hold-row">' +
      '<div class="im-section-lbl">Holdings Comparison</div>' +
      '<div style="display:flex;gap:8px">' +
        (INVESTOR_CIK[key] ? '<button type="button" class="im-upload-btn" id="ivd_sync13f">&#x21bb; Sync latest 13F</button>' : '') +
        '<button type="button" class="im-upload-btn" id="ivd_upload13f">Upload 13F</button>' +
      '</div>' +
    '</div>' +
    '<div id="ivd_cmp"><div class="im-loading">Loading…</div></div>' +
    '<div class="ivd-below-row">' +
      '<div id="ivd_summary" class="ivd-below-col"></div>' +
      '<div class="ivd-below-col">' +
        '<div class="im-section-lbl">Shared with Summit</div>' +
        '<div id="ivd_shared"><div class="im-loading">Loading…</div></div>' +
      '</div>' +
    '</div>' +
    '<div class="im-section-lbl" style="margin-top:22px">Letters &amp; Resources</div>' +
    '<div id="ivd_letters"><div class="im-loading">Loading…</div></div>';

  document.getElementById('inv-gridview').style.display = 'none';
  root.style.display = 'block';
  window.scrollTo(0, 0);

  var lastData = null;

  function loadDetail() {
    loadInvestorProfileData(key).then(function(data) {
      if (root.style.display === 'none') return; // navigated back before this resolved
      lastData = data;
      document.getElementById('ivd_years').innerHTML = invYearPillsHtml(invYearList(data), null);
      renderHoldingsSection('ivd', key, data.holdings);
      renderInvLetters('ivd', data.letters);
    });
  }

  document.getElementById('ivd-back').addEventListener('click', closeInvestorDetail);
  document.getElementById('ivd_upload13f').addEventListener('click', function() {
    var allPeriods = investorPeriods(lastData ? lastData.holdings : [], key);
    var latest = allPeriods.length ? allPeriods[allPeriods.length - 1] : null;
    openUpload13FPanel(key, latest ? latest.year : new Date().getFullYear(), function() { loadDetail(); });
  });
  var syncBtn = document.getElementById('ivd_sync13f');
  if (syncBtn) syncBtn.addEventListener('click', function() { openSync13FPanel(key, INVESTOR_CIK[key], function() { loadDetail(); }); });

  loadDetail();
}

function closeInvestorDetail() {
  destroyIvdChart();
  var root = document.getElementById('inv-detailview');
  if (root) root.style.display = 'none';
  var grid = document.getElementById('inv-gridview');
  if (grid) grid.style.display = 'block';
  window.scrollTo(0, 0);
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

// ─── Sync latest 13F (SEC EDGAR) ──────────────────────────────
// Same preview-then-Apply flow as Upload 13F, except the file comes
// from sync-13f (server-side, since the browser can't fetch sec.gov
// directly — see that function's comments) instead of a local file.
// Year/quarter are whatever SEC reports for that filing, so they're
// shown read-only rather than picked by the user.

function openSync13FPanel(investorKey, cik, onSaved) {
  var id = 'u13f_' + Date.now();
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay im-overlay open';
  overlay.id = id;
  overlay.innerHTML =
    '<div class="modal-card im-card u13f-card" onclick="event.stopPropagation()">' +
      '<div class="modal-header im-header">' +
        '<div class="modal-title" style="font-size:15px">Sync latest 13F</div>' +
        '<button class="modal-close" id="' + id + '_close">&times;</button>' +
      '</div>' +
      '<div class="im-body">' +
        '<div class="modal-msg" id="' + id + '_msg">Fetching the latest filing from SEC EDGAR…</div>' +
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

  var parsedRows = null, parsedFormat = null, filingYear = null, filingQuarter = null;

  syncLatest13F(cik).then(function(result) {
    var msgEl = document.getElementById(id + '_msg');
    if (!msgEl) return; // modal was closed before this resolved
    if (!result.success) {
      msgEl.textContent = 'Could not fetch from SEC EDGAR: ' + (result.error && result.error.message);
      msgEl.className = 'modal-msg error';
      return;
    }
    var data = result.data;
    try {
      var parsed = parse13FFile('sec-edgar-sync.xml', data.xml);
      parsedFormat = parsed.format;
      parsedRows = parsed.rows.map(function(r, i) { return { ticker: r.ticker || '', companyName: r.companyName, cusip: r.cusip || '', valueUsd: r.valueUsd || 0, weightPct: r.weightPct, include: i < 15 }; });
      filingYear = data.year; filingQuarter = data.quarter;
    } catch (err) {
      msgEl.textContent = err.message || 'Could not parse the filing SEC returned.';
      msgEl.className = 'modal-msg error';
      return;
    }
    msgEl.textContent = 'Fetched Q' + filingQuarter + ' ' + filingYear + ' — filed ' + data.filedDate + ' (accession ' + data.accessionNumber + '). Review below, then Apply to save.';
    msgEl.className = 'modal-msg';
    document.getElementById(id + '_preview').innerHTML = u13fPreviewHtml(parsedFormat, parsedRows);
    wireU13fPreview(id + '_preview', parsedRows);
    document.getElementById(id + '_actions').style.display = 'flex';
  });

  document.getElementById(id + '_apply').addEventListener('click', async function() {
    if (!parsedRows) return;
    var included = parsedRows.filter(function(r){ return r.include; });
    if (!included.length) { alert('Select at least one holding to save.'); return; }
    if (included.some(function(r){ return !r.ticker; })) { alert('Fill in the ticker for every selected row before applying.'); return; }
    var btn = document.getElementById(id + '_apply');
    btn.disabled = true; btn.textContent = 'Saving…';
    var rows = included.map(function(r, i) {
      return {
        investor_key: investorKey, year: filingYear, quarter: filingQuarter,
        ticker: r.ticker, company_name: r.companyName, cusip: r.cusip || null,
        value_usd: r.valueUsd || null, weight_pct: r.weightPct, rank: i + 1,
        source_type: parsedFormat,
      };
    });
    var result = await replaceInvestorHoldings(investorKey, filingYear, filingQuarter, rows);
    if (result.success) {
      overlay.remove();
      if (onSaved) onSaved(filingYear);
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
window.openInvestorDetail = openInvestorDetail;
window.toggleChartVisibility = toggleChartVisibility;
window.hideInvestor = hideInvestor;
window.showAllInvestors = showAllInvestors;

export function loadHedgeFundsPage() {
  if (!HF_FUNDS || !HF_FUNDS.length || !INVESTORS || !INVESTORS.length) {
    var main = document.getElementById('tp-inv');
    if (main) main.innerHTML = '<div style="text-align:center;color:var(--neg);padding:34px;font-size:13px">Hedge fund data failed to load. Please refresh the page.</div>';
    return;
  }
  renderFundChips();
  renderAlphaChart();
  renderBenchmark();
  renderInvGrid();
}
