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

// ─── Sector Exposure heatmap (main tab) ────────────────────────
// Rolls up every superinvestor's disclosed top holdings (the same
// hardcoded top-5 shown on their card — no Supabase round trip needed,
// so this renders immediately for everyone) by GICS sector, sector x
// investor, to answer "is everyone crowded into the same trade." Reuses
// the steel->navy sequential ramp from the by-position pie chart so a
// darker cell always means "more concentrated" the same way it does
// there. Summit's own book is excluded — this is about the tracked
// superinvestors, not our own portfolio.

function computeSectorHeatmapData() {
  var investors = INVESTORS.filter(function(inv) { return inv.key !== 'summit'; });
  var matrix = {}, sectorTotals = {};
  investors.forEach(function(inv) {
    (inv.holdings || []).forEach(function(h) {
      var sector = tickerSector(h.t) || 'Other / Unclassified';
      matrix[sector] = matrix[sector] || {};
      matrix[sector][inv.key] = (matrix[sector][inv.key] || 0) + (h.w || 0);
      sectorTotals[sector] = (sectorTotals[sector] || 0) + (h.w || 0);
    });
  });
  var sectors = Object.keys(matrix).sort(function(a, b) { return (sectorTotals[b] || 0) - (sectorTotals[a] || 0); });
  var maxCell = 0;
  sectors.forEach(function(s) {
    investors.forEach(function(inv) { var v = matrix[s][inv.key]; if (v && v > maxCell) maxCell = v; });
  });
  return { investors: investors, sectors: sectors, matrix: matrix, sectorTotals: sectorTotals, maxCell: maxCell };
}

function heatCellHtml(v, maxCell, invName, sector) {
  if (!v) return '<td class="hf-heat-cell hf-heat-empty" title="' + esc(invName) + ': no ' + esc(sector) + ' exposure in top holdings">&middot;</td>';
  var t = maxCell > 0 ? v / maxCell : 0;
  var textCls = t > 0.55 ? 'hf-heat-text-lt' : 'hf-heat-text-dk';
  return '<td class="hf-heat-cell ' + textCls + '" style="background:' + ivdRamp(t) + '" title="' + esc(invName) + ': ' + v.toFixed(1) + '% in ' + esc(sector) + ' (top holdings)">' + v.toFixed(1) + '%</td>';
}

function renderSectorHeatmap() {
  var el = document.getElementById('hf-sector-heatmap');
  if (!el) return;
  var data = computeSectorHeatmapData();
  if (!data.sectors.length) { el.innerHTML = '<div class="im-empty">No holdings on file yet.</div>'; return; }
  var html = '<div class="hf-heat-wrap"><table class="hf-heat-tbl"><thead><tr><th class="hf-heat-sector-h">Sector</th>';
  data.investors.forEach(function(inv) {
    var ini = inv.name.split(' ').slice(0, 2).map(function(n) { return n[0]; }).join('');
    html += '<th class="hf-heat-inv-h" title="' + esc(inv.name) + '">' + esc(ini) + '</th>';
  });
  html += '<th class="hf-heat-total-h">Total</th></tr></thead><tbody>';
  data.sectors.forEach(function(sector) {
    html += '<tr><td class="hf-heat-sector-lbl">' + esc(sector) + '</td>';
    data.investors.forEach(function(inv) { html += heatCellHtml(data.matrix[sector][inv.key], data.maxCell, inv.name, sector); });
    html += '<td class="hf-heat-total-cell">' + (data.sectorTotals[sector] || 0).toFixed(1) + '%</td></tr>';
  });
  html += '</tbody></table></div>';
  el.innerHTML = html;
}

// ─── Investor Detail page — shared data + rendering helpers ──
// Click an investor card → a full-page profile (see openInvestorDetail
// near the bottom): yearly returns, the holdings comparison across
// quarters, and investor letters. Data lives in Supabase (see
// sql/014_investor_profiles.sql); on localhost, falls back to
// investor-local-seed.js if the migration hasn't been run yet.

function esc(str) { if (!str) return ''; return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function imPct(v){ return v==null ? 'n/a' : (v>=0?'+':'')+v.toFixed(1)+'%'; }

// Ticker logo box — same visual + fallback chain as Companies' coLogo()
// (js/companies.js), reimplemented locally since that module doesn't
// export it. No logo_domain is on file for 13F holdings, so the Google-
// favicon fallback step is skipped (empty data-domain) and a bad Parqet
// fetch falls straight through to the ticker-initials monogram.
function ivdLogo(ticker, cls) {
  var mono = ticker ? ticker.slice(0, 2).toUpperCase() : '?';
  return '<div class="cologo' + (cls ? ' ' + cls : '') + '" data-mono="' + esc(mono) + '">' +
    (ticker ? '<img src="https://assets.parqet.com/logos/symbol/' + esc(ticker) + '" alt="" data-step="0" data-domain="" onerror="logoFallback(this)">' : esc(mono)) +
  '</div>';
}

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
  buffett: '0001067983',       // Berkshire Hathaway Inc
  tepper: '0001656456',        // Appaloosa LP
  druckenmiller: '0001536411', // Duquesne Family Office LLC
  coleman: '0001167483',       // Tiger Global Management LLC
  hohn: '0001647251',          // TCI Fund Management Ltd
  altimeter: '0001541617',     // Altimeter Capital Management, LP
  dorsey: '0001671657',        // Dorsey Asset Management, LLC
  loeb: '0001040273',          // Third Point LLC
  klarman: '0001061768',       // Baupost Group LLC/MA
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

// Tickers in Summit's own book (INVESTORS[key='summit']), for the "*"
// marker in the comparison table — replaces the old standalone "Shared
// with Summit" panel.
function summitTickerSet() {
  var summitInv = INVESTORS.filter(function(i) { return i.key === 'summit'; })[0];
  var set = {};
  if (summitInv) (summitInv.holdings || []).forEach(function(h) { if (h.t) set[h.t] = true; });
  return set;
}

// Rows already come sorted current-weight-desc (computeHoldingsComparison).
// A fund with 30+ disclosed positions makes for an unreadable wall of rows,
// so past this cap the table shows only the top holdings until the user
// asks for the rest.
var IVD_TABLE_CAP = 15;

function renderHoldingsCompareTable(rows, periods, investorKey, expanded) {
  if (!rows.length) return '<div class="im-empty">No holdings on file yet — upload a 13F to get started.</div>';
  var curIdx = periods.length - 1;
  var shared = investorKey === 'summit' ? {} : summitTickerSet();
  var anyShared = false;
  var displayRows = expanded ? rows : rows.slice(0, IVD_TABLE_CAP);
  var hiddenCount = rows.length - displayRows.length;
  var html = '<div class="ivd-cmp-wrap"><table class="icard-tbl ivd-cmp-tbl"><thead><tr><th>Ticker</th><th>Company</th>';
  periods.forEach(function(p, i) {
    var isCur = i === curIdx;
    html += '<th class="nr' + (isCur ? ' ivd-cmp-current' : '') + '">' + esc(periodLabel(p)) + (isCur ? ' <span class="ivd-cmp-current-tag">Current</span>' : '') + '</th>';
  });
  if (periods.length > 1) html += '<th class="nr">Move</th>';
  html += '<th class="nr" title="The stock\'s YTD return today — not tied to the period shown">Current YTD</th>';
  html += '</tr></thead><tbody>';
  displayRows.forEach(function(r) {
    var isShared = !!(r.ticker && shared[r.ticker]);
    if (isShared) anyShared = true;
    html += '<tr data-key="' + esc(r.key) + '"><td><span class="iticker">' + esc(r.ticker || '?') +
      (isShared ? '<span class="ivd-shared-mark" title="Also held by Summit">*</span>' : '') + '</span></td>' +
      '<td><span class="ico">' + esc(r.companyName) + '</span></td>';
    r.cells.forEach(function(w, i) { html += weightCellHtml(w, i === curIdx); });
    if (periods.length > 1) html += '<td class="nr">' + moveBadgeHtml(r.cells[r.cells.length - 2], r.cells[r.cells.length - 1]) + '</td>';
    html += ytdCellHtml(tickerYtd(r.ticker));
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  if (hiddenCount > 0) {
    html += '<button type="button" class="im-upload-btn ivd-cmp-showmore">Show ' + hiddenCount + ' more holding' + (hiddenCount === 1 ? '' : 's') + '</button>';
  } else if (expanded && rows.length > IVD_TABLE_CAP) {
    html += '<button type="button" class="im-upload-btn ivd-cmp-showmore" data-collapse="1">Show fewer</button>';
  }
  if (anyShared) html += '<div class="ivd-cmp-footnote">* also held in Summit&rsquo;s own portfolio</div>';
  return html;
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

  function moveLine(r, cls, text) {
    return '<li class="ivd-move-item ' + cls + '">' + ivdLogo(r.ticker, 'ivd-move-logo') + '<span class="ivd-move-txt">' + text + '</span></li>';
  }

  var lines = [];
  newPos.forEach(function(r) {
    var curr = r.cells[r.cells.length - 1];
    lines.push(moveLine(r, 'new', '<b>New position: ' + esc(r.ticker || r.companyName) + '</b> — enters at ' + curr.toFixed(2) + '% of the portfolio.'));
  });
  sold.forEach(function(r) {
    var prev = r.cells[r.cells.length - 2];
    lines.push(moveLine(r, 'sold', '<b>Exited: ' + esc(r.ticker || r.companyName) + '</b> — was ' + prev.toFixed(2) + '%, no longer held.'));
  });
  up.slice(0, 3).forEach(function(o) {
    var prev = o.row.cells[o.row.cells.length - 2], curr = o.row.cells[o.row.cells.length - 1];
    lines.push(moveLine(o.row, 'up', '<b>Increased ' + esc(o.row.ticker || o.row.companyName) + '</b> from ' + prev.toFixed(2) + '% to ' + curr.toFixed(2) + '% (+' + o.delta.toFixed(2) + 'pp).'));
  });
  down.slice(0, 3).forEach(function(o) {
    var prev = o.row.cells[o.row.cells.length - 2], curr = o.row.cells[o.row.cells.length - 1];
    lines.push(moveLine(o.row, 'down', '<b>Trimmed ' + esc(o.row.ticker || o.row.companyName) + '</b> from ' + prev.toFixed(2) + '% to ' + curr.toFixed(2) + '% (' + o.delta.toFixed(2) + 'pp).'));
  });

  var hdr = '<div class="ivd-summary-hdr">' + esc(periodLabel(periods[periods.length - 2])) + ' &rarr; ' + esc(periodLabel(periods[periods.length - 1])) + '</div>';
  if (!lines.length) return hdr + '<div class="im-empty">No notable changes between these two periods.</div>';
  return hdr + '<ul class="ivd-summary-list">' + lines.join('') + '</ul>';
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

// ─── Holdings Composition — Pie ────────────────────────────────
// A single donut chart of the CURRENT reference period (same period as
// the table's "Current" column), the investor's photo in the hole, and
// each slice labeled outside the ring with the ticker's logo — modeled
// after the carbonfinance-style "stock portfolio" social graphic.
// Renders AFTER the comparison table. Slices are shaded by rank along
// the Summit steel -> navy ramp (largest holding darkest) rather than a
// categorical palette — identity is carried by the logo, not the hue.

var IVD_RAMP_LO = [238, 241, 245]; // --ice
var IVD_RAMP_HI = [30, 39, 51];    // --navy

var ivdSmCharts = [];
function destroyIvdChart() { ivdSmCharts.forEach(function(c) { c.destroy(); }); ivdSmCharts = []; }

var IVD_TOPN_BOUNDS = { min: 3, max: 15 };

// Aggregates every row past the Top-N cut into one "Other" pseudo-row,
// per period, and re-sorts everything (top rows + Other) by current-period
// weight so Other lands wherever its combined size actually places it,
// rather than always trailing.
function topAndOtherRows(rows, periods, topN) {
  var top = rows.slice(0, topN);
  var rest = rows.slice(topN);
  var out = top.slice();
  if (rest.length) {
    var cells = periods.map(function(_, i) {
      var sum = 0, any = false;
      rest.forEach(function(r) { if (r.cells[i] != null) { sum += r.cells[i]; any = true; } });
      return any ? +sum.toFixed(2) : null;
    });
    out.push({ key: '__other__', ticker: '', companyName: 'Other', isOther: true, restCount: rest.length, cells: cells });
  }
  var curIdx = periods.length - 1;
  out.sort(function(a, b) {
    var va = a.cells[curIdx], vb = b.cells[curIdx];
    return (vb == null ? -1 : vb) - (va == null ? -1 : va);
  });
  return out;
}

function ivdRowLabel(row) { return row.isOther ? ('Other (' + row.restCount + ')') : (row.ticker || row.companyName); }

// ─── Holdings Composition — by GICS sector ─────────────────────
// Alternate donut view: same reference period, but every position
// rolled up into its GICS sector (via ALL_STOCKS) instead of shown as an
// individual ticker. A fixed sector -> color mapping (identity, not rank
// -- unlike the by-ticker view there's no logo to carry identity, so
// color + a direct label do that job here) rather than the steel->navy
// rank ramp used for individual positions.
var SECTOR_COLORS = {
  'Technology': '#2A78D6',
  'Consumer Discretionary': '#EB6834',
  'Financials': '#1BAF7A',
  'Communication Services': '#EDA100',
  'Health Care': '#E87BA4',
  'Industrials': '#4A3AA7',
  'Consumer Staples': '#4C8C4A',
  'Energy': '#C2554F',
  'Materials': '#7C8694',
  'Real Estate': '#A9784F',
  'Utilities': '#5B7B94',
};
var SECTOR_OTHER_COLOR = '#C3C2B7';

var TICKER_SECTOR_MAP = null;
function tickerSectorMap() {
  if (TICKER_SECTOR_MAP) return TICKER_SECTOR_MAP;
  var map = {};
  ALL_STOCKS.forEach(function(s) { if (s.s) map[s.t] = s.s; });
  TICKER_SECTOR_MAP = map;
  return map;
}
function tickerSector(ticker) { return ticker ? (tickerSectorMap()[ticker] || null) : null; }

// Aggregates every position in a single period into its sector, sorted
// by combined weight descending. Uses the raw holdings rows (not the
// multi-period comparison rows) since only the current period matters here.
function computeSectorBreakdown(holdings, investorKey, period) {
  var map = periodWeightMap(holdings, investorKey, period);
  var bySector = {}, unresolvedCount = 0;
  Object.keys(map).forEach(function(k) {
    var h = map[k];
    var sector = tickerSector(h.ticker);
    if (!sector) unresolvedCount++;
    var key = sector || 'Other / Unclassified';
    bySector[key] = (bySector[key] || 0) + (Number(h.weight_pct) || 0);
  });
  var out = Object.keys(bySector).map(function(sector) {
    return { sector: sector, weight: +bySector[sector].toFixed(2), color: SECTOR_COLORS[sector] || SECTOR_OTHER_COLOR };
  });
  out.sort(function(a, b) { return b.weight - a.weight; });
  return { rows: out, unresolvedCount: unresolvedCount };
}

function renderSectorPieChart(wrapEl, breakdown, photoUrl, initials) {
  if (!wrapEl) return;
  var items = breakdown.rows.filter(function(r) { return r.weight > 0; });
  if (!items.length || typeof Chart === 'undefined') {
    wrapEl.innerHTML = '<div class="im-empty">No holdings on file for this period.</div>';
    return;
  }
  var SIZE = Math.max(260, Math.min(400, (wrapEl.clientWidth || 460) - 210));
  wrapEl.innerHTML =
    '<div class="ivd-pie-inner" style="width:' + SIZE + 'px;height:' + SIZE + 'px">' +
      '<canvas class="ivd-pie-canvas" width="' + SIZE + '" height="' + SIZE + '"></canvas>' +
      (photoUrl
        ? '<img class="ivd-pie-photo" src="' + esc(photoUrl) + '" alt="" onerror="this.style.opacity=0.3">'
        : '<div class="ivd-pie-photo ivd-pie-photo-ini">' + esc(initials || '') + '</div>') +
      '<div class="ivd-pie-labels"></div>' +
    '</div>';
  var canvas = wrapEl.querySelector('.ivd-pie-canvas');
  var chart = new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: items.map(function(it) { return it.sector; }),
      datasets: [{ data: items.map(function(it) { return it.weight; }), backgroundColor: items.map(function(it) { return it.color; }), borderColor: '#fff', borderWidth: 2 }],
    },
    options: {
      responsive: false,
      animation: false,
      cutout: '58%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: function(c) { return c.label + ': ' + c.raw.toFixed(2) + '%'; } } },
      },
    },
  });
  ivdSmCharts.push(chart);

  var labelsEl = wrapEl.querySelector('.ivd-pie-labels');
  var meta = chart.getDatasetMeta(0);
  labelsEl.innerHTML = items.map(function(it, i) {
    var arc = meta.data[i];
    var mid = (arc.startAngle + arc.endAngle) / 2;
    var r = arc.outerRadius + 24 + (i % 2) * 38;
    var x = arc.x + r * Math.cos(mid);
    var y = arc.y + r * Math.sin(mid);
    return '<div class="ivd-pie-label" style="left:' + x.toFixed(1) + 'px;top:' + y.toFixed(1) + 'px">' +
      '<span class="ivd-pie-sector-dot" style="background:' + it.color + '"></span>' +
      '<div class="ivd-pie-label-txt"><span class="ivd-pie-label-t">' + esc(it.sector) + '</span>' +
      '<span class="ivd-pie-label-p">' + it.weight.toFixed(1) + '%</span></div>' +
    '</div>';
  }).join('');
}

// A single steel -> navy ramp, shaded by rank (largest holding darkest)
// — one "professional" color story instead of a categorical palette.
function ivdRamp(t) {
  t = Math.max(0, Math.min(1, t));
  var r = Math.round(IVD_RAMP_LO[0] + (IVD_RAMP_HI[0] - IVD_RAMP_LO[0]) * t);
  var g = Math.round(IVD_RAMP_LO[1] + (IVD_RAMP_HI[1] - IVD_RAMP_LO[1]) * t);
  var b = Math.round(IVD_RAMP_LO[2] + (IVD_RAMP_HI[2] - IVD_RAMP_LO[2]) * t);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function renderPieChart(wrapEl, chartRows, curIdx, photoUrl, initials) {
  if (!wrapEl) return;
  var items = chartRows
    .map(function(r) { return { ticker: r.ticker, isOther: r.isOther, label: ivdRowLabel(r), value: r.cells[curIdx], prev: curIdx > 0 ? r.cells[curIdx - 1] : null }; })
    .filter(function(it) { return it.value != null && it.value > 0; });
  if (!items.length || typeof Chart === 'undefined') {
    wrapEl.innerHTML = '<div class="im-empty">No holdings on file for this period.</div>';
    return;
  }
  var SIZE = Math.max(260, Math.min(400, (wrapEl.clientWidth || 460) - 210));
  wrapEl.innerHTML =
    '<div class="ivd-pie-inner" style="width:' + SIZE + 'px;height:' + SIZE + 'px">' +
      '<canvas class="ivd-pie-canvas" width="' + SIZE + '" height="' + SIZE + '"></canvas>' +
      (photoUrl
        ? '<img class="ivd-pie-photo" src="' + esc(photoUrl) + '" alt="" onerror="this.style.opacity=0.3">'
        : '<div class="ivd-pie-photo ivd-pie-photo-ini">' + esc(initials || '') + '</div>') +
      '<div class="ivd-pie-labels"></div>' +
    '</div>';
  var canvas = wrapEl.querySelector('.ivd-pie-canvas');
  var n = items.length;
  var colors = items.map(function(it, i) { return ivdRamp(n > 1 ? 1 - i / (n - 1) : 1); });
  var chart = new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: items.map(function(it) { return it.label; }),
      datasets: [{ data: items.map(function(it) { return it.value; }), backgroundColor: colors, borderColor: '#fff', borderWidth: 2 }],
    },
    options: {
      responsive: false,
      animation: false, // arc geometry must be final synchronously — see label positioning below
      cutout: '58%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: function(c) { return c.label + ': ' + c.raw.toFixed(2) + '%'; } } },
      },
    },
  });
  ivdSmCharts.push(chart);

  // Position ticker/logo labels around the ring from the rendered arc
  // geometry (chart.getDatasetMeta) rather than recomputing angles by
  // hand, so they line up exactly with Chart.js's own slice boundaries.
  // Requires animation:false above — mid-animation arc angles are not
  // the final ones, which is why labels landed on the wrong slices.
  // Small adjacent slices put their label midpoints only a few degrees
  // apart — at any single fixed radius those labels physically collide.
  // Alternating a near/far radius "tier" per slice index (== angular
  // order, since Chart.js draws in dataset order) gives every other
  // label extra breathing room without needing real collision detection.
  var labelsEl = wrapEl.querySelector('.ivd-pie-labels');
  var meta = chart.getDatasetMeta(0);
  labelsEl.innerHTML = items.map(function(it, i) {
    var arc = meta.data[i];
    var mid = (arc.startAngle + arc.endAngle) / 2;
    var r = arc.outerRadius + 24 + (i % 2) * 38;
    var x = arc.x + r * Math.cos(mid);
    var y = arc.y + r * Math.sin(mid);
    var logo = it.isOther ? '' : ivdLogo(it.ticker, 'ivd-pie-logo');
    var prevTxt = it.prev == null ? 'NEW' : it.prev.toFixed(1) + '%';
    var moveCls = it.prev == null ? 'new' : (it.value > it.prev ? 'up' : it.value < it.prev ? 'down' : 'flat');
    return '<div class="ivd-pie-label" style="left:' + x.toFixed(1) + 'px;top:' + y.toFixed(1) + 'px">' +
      logo +
      '<div class="ivd-pie-label-txt"><span class="ivd-pie-label-t">' + esc(it.isOther ? it.label : (it.ticker || it.label)) + '</span>' +
      '<span class="ivd-pie-label-p ivd-pie-label-move ' + moveCls + '">' + prevTxt + ' → ' + it.value.toFixed(1) + '%</span></div>' +
    '</div>';
  }).join('');
}

function renderHoldingsChartSection(state) {
  var visible = state.chartVisible !== false;
  var byPosition = state.chartMode !== 'sector';
  var html = '<div class="ivd-chart-hdr">' +
    '<div class="im-section-lbl" style="margin-bottom:0">Holdings Composition</div>' +
    '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">';
  if (visible) {
    html += '<div class="sb-toggle ivd-chartmode-toggle">' +
      '<button type="button" class="sb-tbtn' + (byPosition ? ' active' : '') + '" data-chartmode="position">By Position</button>' +
      '<button type="button" class="sb-tbtn' + (!byPosition ? ' active' : '') + '" data-chartmode="sector">By Sector</button>' +
      '</div>';
  }
  if (visible && byPosition) {
    html += '<div class="ivd-pp-stepper">' +
        '<button type="button" class="ivd-step-btn ivd-chart-n-minus"' + (state.chartTopN <= IVD_TOPN_BOUNDS.min ? ' disabled' : '') + ' title="Fewer holdings">&minus;</button>' +
        '<span class="ivd-pp-count">Top ' + state.chartTopN + '</span>' +
        '<button type="button" class="ivd-step-btn ivd-chart-n-plus"' + (state.chartTopN >= IVD_TOPN_BOUNDS.max ? ' disabled' : '') + ' title="More holdings">+</button>' +
      '</div>';
  }
  html += '<label class="hf-chart-toggle" title="Show or hide the chart">' +
      '<input type="checkbox" class="ivd-chart-toggle-input"' + (visible ? ' checked' : '') + '>' +
      '<span class="hf-chart-toggle-track"><span class="hf-chart-toggle-thumb"></span></span>' +
      '<span class="hf-chart-toggle-txt">Chart</span>' +
    '</label>' +
    '</div></div>';
  if (visible) html += '<div class="ivd-pie-wrap"></div>';
  return html;
}

function renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state, photoUrl, initials) {
  var el = document.getElementById(rootId + '_cmp');
  var sumEl = document.getElementById(rootId + '_summary');
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

  if (state.chartTopN > IVD_TOPN_BOUNDS.max) state.chartTopN = IVD_TOPN_BOUNDS.max;
  if (state.chartTopN < IVD_TOPN_BOUNDS.min) state.chartTopN = IVD_TOPN_BOUNDS.min;

  var html = renderStatStrip(holdings, investorKey, selected[curIdx], rows, curIdx);
  html += renderPeriodPicker(allPeriods, pool, state.refPeriod, state.mode, state.count, maxCount);
  html += renderHoldingsCompareTable(rows, selected, investorKey, state.tableExpanded);
  html += renderHoldingsChartSection(state);
  destroyIvdChart();
  el.innerHTML = html;

  var sel = el.querySelector('.ivd-pp-sel');
  if (sel) {
    sel.addEventListener('change', function() {
      var parts = sel.value.split('-');
      state.refPeriod = { year: parseInt(parts[0], 10), quarter: parts[1] === '' ? null : parseInt(parts[1], 10) };
      renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state, photoUrl, initials);
    });
  }
  el.querySelectorAll('.ivd-mode-toggle [data-mode]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (btn.disabled) return;
      state.mode = btn.getAttribute('data-mode');
      renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state, photoUrl, initials);
    });
  });
  var showMoreBtn = el.querySelector('.ivd-cmp-showmore');
  if (showMoreBtn) showMoreBtn.addEventListener('click', function() { state.tableExpanded = !showMoreBtn.hasAttribute('data-collapse'); renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state, photoUrl, initials); });
  var minusBtn = el.querySelector('.ivd-step-minus');
  if (minusBtn) minusBtn.addEventListener('click', function() { state.count = Math.max(1, state.count - 1); renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state, photoUrl, initials); });
  var plusBtn = el.querySelector('.ivd-step-plus');
  if (plusBtn) plusBtn.addEventListener('click', function() { state.count = Math.min(maxCount, state.count + 1); renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state, photoUrl, initials); });

  var chartToggle = el.querySelector('.ivd-chart-toggle-input');
  if (chartToggle) chartToggle.addEventListener('change', function() { state.chartVisible = chartToggle.checked; renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state, photoUrl, initials); });
  el.querySelectorAll('.ivd-chartmode-toggle [data-chartmode]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      state.chartMode = btn.getAttribute('data-chartmode');
      renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state, photoUrl, initials);
    });
  });
  var nMinus = el.querySelector('.ivd-chart-n-minus');
  if (nMinus) nMinus.addEventListener('click', function() { state.chartTopN = Math.max(IVD_TOPN_BOUNDS.min, state.chartTopN - 1); renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state, photoUrl, initials); });
  var nPlus = el.querySelector('.ivd-chart-n-plus');
  if (nPlus) nPlus.addEventListener('click', function() { state.chartTopN = Math.min(IVD_TOPN_BOUNDS.max, state.chartTopN + 1); renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state, photoUrl, initials); });

  if (state.chartVisible !== false) {
    if (state.chartMode === 'sector') {
      var breakdown = computeSectorBreakdown(holdings, investorKey, selected[curIdx]);
      renderSectorPieChart(el.querySelector('.ivd-pie-wrap'), breakdown, photoUrl, initials);
    } else {
      var chartRows = topAndOtherRows(rows, selected, state.chartTopN);
      renderPieChart(el.querySelector('.ivd-pie-wrap'), chartRows, curIdx, photoUrl, initials);
    }
  }

  if (sumEl) sumEl.innerHTML = selected.length >= 2 ? generateMovesSummary(rows, selected)
    : '<div class="im-empty">Add another period to see period-over-period changes.</div>';
}

function renderHoldingsSection(rootId, investorKey, holdings, photoUrl, initials) {
  var el = document.getElementById(rootId + '_cmp');
  if (!el) return;
  var allPeriods = investorPeriods(holdings, investorKey);
  if (!allPeriods.length) {
    el.innerHTML = '<div class="im-empty">No holdings on file yet — upload a 13F to get started.</div>';
    var sumEl = document.getElementById(rootId + '_summary'); if (sumEl) sumEl.innerHTML = '';
    return;
  }
  var state = { refPeriod: allPeriods[allPeriods.length - 1], mode: 'quarterly', count: Math.min(HOLDINGS_DEFAULT_COUNT, allPeriods.length), chartVisible: true, chartTopN: 8, chartMode: 'position', tableExpanded: false };
  renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state, photoUrl, initials);
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
    '<div class="ivdtabs">' +
      '<button type="button" class="ivdtab active" data-pane="holdings" onclick="ivdTab(\'holdings\')">Holdings</button>' +
      '<button type="button" class="ivdtab" data-pane="resources" onclick="ivdTab(\'resources\')">Resources</button>' +
    '</div>' +
    '<div class="ivdpane active" data-pane="holdings">' +
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
      '<div class="im-section-lbl" style="margin-top:18px">Recent Moves</div>' +
      '<div id="ivd_summary"></div>' +
    '</div>' +
    '<div class="ivdpane" data-pane="resources">' +
      '<div class="im-section-lbl">Letters &amp; Resources</div>' +
      '<div id="ivd_letters"><div class="im-loading">Loading…</div></div>' +
    '</div>';

  document.getElementById('inv-gridview').style.display = 'none';
  root.style.display = 'block';
  window.scrollTo(0, 0);

  var lastData = null;

  function loadDetail() {
    loadInvestorProfileData(key).then(function(data) {
      if (root.style.display === 'none') return; // navigated back before this resolved
      lastData = data;
      document.getElementById('ivd_years').innerHTML = invYearPillsHtml(invYearList(data), null);
      renderHoldingsSection('ivd', key, data.holdings, photo, ini);
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

function ivdTab(pane) {
  document.querySelectorAll('#inv-detailview .ivdtab').forEach(function(b) { b.classList.toggle('active', b.getAttribute('data-pane') === pane); });
  document.querySelectorAll('#inv-detailview .ivdpane').forEach(function(p) { p.classList.toggle('active', p.getAttribute('data-pane') === pane); });
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

// ─── Check for new 13Fs (all investors, one click) ────────────
// A portal-wide version of "Sync latest 13F": checks every investor with
// a CIK on file against SEC EDGAR, shows which ones have a filing newer
// than what's saved in Supabase, and applies all the new ones in one go.
// Runs at most a few times a year (13F deadlines are ~45 days after each
// quarter end), so this is a manual button rather than a schedule —
// someone clicks it, reviews the list, applies.

function check13fRowHtml(row) {
  var cls = row.error ? 'c13f-row-err' : row.isNew ? 'c13f-row-new' : 'c13f-row-ok';
  var onFile = row.onFilePeriod ? esc(periodLabel(row.onFilePeriod)) : 'none on file';
  var status = row.error
    ? 'Could not check: ' + esc(row.error)
    : row.isNew
      ? '<b>New: ' + esc(periodLabel(row.secPeriod)) + '</b> (filed ' + esc(row.filedDate) + ')'
      : 'Up to date (' + esc(periodLabel(row.secPeriod)) + ')';
  return '<tr class="' + cls + '" data-key="' + esc(row.key) + '">' +
    '<td>' + (row.isNew && !row.error ? '<input type="checkbox" class="c13f-inc" checked>' : '') + '</td>' +
    '<td><span class="ico">' + esc(row.name) + '</span></td>' +
    '<td class="nr" style="color:var(--mu)">' + onFile + '</td>' +
    '<td>' + status + '</td>' +
  '</tr>';
}

async function openCheck13FPanel() {
  var id = 'c13f_' + Date.now();
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay im-overlay open';
  overlay.id = id;
  overlay.innerHTML =
    '<div class="modal-card im-card u13f-card" onclick="event.stopPropagation()">' +
      '<div class="modal-header im-header">' +
        '<div class="modal-title" style="font-size:15px">Check for new 13Fs</div>' +
        '<button class="modal-close" id="' + id + '_close">&times;</button>' +
      '</div>' +
      '<div class="im-body">' +
        '<div class="modal-msg" id="' + id + '_msg">Checking SEC EDGAR for ' + Object.keys(INVESTOR_CIK).length + ' investors&hellip;</div>' +
        '<div id="' + id + '_preview"></div>' +
        '<div class="modal-actions" id="' + id + '_actions" style="display:none">' +
          '<button class="modal-btn modal-btn--cancel" id="' + id + '_cancel">Close</button>' +
          '<button class="modal-btn modal-btn--save" id="' + id + '_apply">Apply new filings</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) overlay.remove(); });
  document.getElementById(id + '_close').addEventListener('click', function(){ overlay.remove(); });

  var keys = Object.keys(INVESTOR_CIK);
  var rows = await Promise.all(keys.map(async function(key) {
    var inv = INVESTORS.filter(function(i){ return i.key === key; })[0];
    var name = inv ? inv.name : key;
    try {
      var holdingsResult = await fetchInvestorHoldings(key);
      var onFilePeriods = investorPeriods(holdingsResult.success ? holdingsResult.data : [], key);
      var onFilePeriod = onFilePeriods.length ? onFilePeriods[onFilePeriods.length - 1] : null;
      var syncResult = await syncLatest13F(INVESTOR_CIK[key]);
      if (!syncResult.success) return { key: key, name: name, onFilePeriod: onFilePeriod, error: (syncResult.error && syncResult.error.message) || 'sync failed' };
      var data = syncResult.data;
      var secPeriod = { year: data.year, quarter: data.quarter };
      var isNew = !onFilePeriod || periodSortKey(secPeriod) > periodSortKey(onFilePeriod);
      return { key: key, name: name, onFilePeriod: onFilePeriod, secPeriod: secPeriod, isNew: isNew, xml: data.xml, filedDate: data.filedDate };
    } catch (err) {
      return { key: key, name: name, onFilePeriod: null, error: (err && err.message) || String(err) };
    }
  }));

  if (!document.getElementById(id)) return; // closed before this resolved
  var newCount = rows.filter(function(r){ return r.isNew && !r.error; }).length;
  var msgEl = document.getElementById(id + '_msg');
  msgEl.textContent = newCount
    ? newCount + ' investor' + (newCount === 1 ? '' : 's') + ' with a new 13F on file. Review below, then Apply.'
    : 'Everyone is up to date — no new 13Fs since the last check.';
  document.getElementById(id + '_preview').innerHTML =
    '<div class="u13f-preview-wrap"><table class="icard-tbl u13f-tbl"><thead><tr><th></th><th>Investor</th><th class="nr">On file</th><th>SEC EDGAR</th></tr></thead><tbody>' +
    rows.map(check13fRowHtml).join('') + '</tbody></table></div>';
  document.getElementById(id + '_actions').style.display = 'flex';
  document.getElementById(id + '_cancel').addEventListener('click', function(){ overlay.remove(); });
  if (!newCount) { document.getElementById(id + '_apply').style.display = 'none'; return; }

  document.getElementById(id + '_apply').addEventListener('click', async function() {
    var btn = document.getElementById(id + '_apply');
    btn.disabled = true;
    var toApply = rows.filter(function(r) {
      var cb = overlay.querySelector('tr[data-key="' + r.key + '"] .c13f-inc');
      return r.isNew && !r.error && cb && cb.checked;
    });
    var done = 0;
    for (var i = 0; i < toApply.length; i++) {
      var row = toApply[i];
      btn.textContent = 'Applying ' + row.name + '… (' + (i + 1) + '/' + toApply.length + ')';
      var rowEl = overlay.querySelector('tr[data-key="' + row.key + '"]');
      try {
        var parsed = parse13FFile('sec-edgar-sync.xml', row.xml);
        var included = parsed.rows.slice(0, 15).filter(function(r){ return r.ticker; });
        var dbRows = included.map(function(r, j) {
          return {
            investor_key: row.key, year: row.secPeriod.year, quarter: row.secPeriod.quarter,
            ticker: r.ticker, company_name: r.companyName, cusip: r.cusip || null,
            value_usd: r.valueUsd || null, weight_pct: r.weightPct, rank: j + 1,
            source_type: parsed.format,
          };
        });
        var saveResult = await replaceInvestorHoldings(row.key, row.secPeriod.year, row.secPeriod.quarter, dbRows);
        if (!saveResult.success) throw new Error(saveResult.error && saveResult.error.message);
        done++;
        if (rowEl) rowEl.querySelector('td:last-child').innerHTML = '<span style="color:var(--pos)">&#x2713; Applied ' + esc(periodLabel(row.secPeriod)) + '</span>';
      } catch (err) {
        if (rowEl) rowEl.querySelector('td:last-child').innerHTML = '<span style="color:var(--neg)">Failed: ' + esc(err.message || 'unknown error') + '</span>';
      }
    }
    btn.textContent = 'Done (' + done + '/' + toApply.length + ' applied)';
  });
}

window.openCheck13FPanel = openCheck13FPanel;

// Expose to window for inline onclick handlers
window.toggleFund = toggleFund;
window.allFunds = allFunds;
window.setAlphaStart = setAlphaStart;
window.setAlphaMode = setAlphaMode;
window.openInvestorDetail = openInvestorDetail;
window.ivdTab = ivdTab;
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
  renderSectorHeatmap();
}
