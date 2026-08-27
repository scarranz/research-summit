// hedge-funds.js — extracted from summit-research-portal.html
import { INVESTORS, HF_FUNDS, HF_BMK, HF_AYEARS, YEARS, SP500, IMGS, ALL_STOCKS } from './portal-data.js';
import { fetchInvestorReturns, fetchInvestorHoldings, fetchHoldingsByTicker, fetchInvestorLetters, fetchAllInvestorLetters, insertInvestorLetter, fetchInvestorMeta, insertInvestorMeta, replaceInvestorHoldings, syncLatest13F, getFileUrl, uploadFile } from './api.js';
import { LOCAL_INVESTOR_RETURNS, LOCAL_INVESTOR_HOLDINGS, LOCAL_INVESTOR_LETTERS, NO_PUBLIC_LETTERS_NOTE } from './investor-local-seed.js';
import { parse13FFile } from './investor-13f-parser.js';

let alphaChart = null, ALPHA_MODE = 'cum', HF_SEL = {}, HF_START = '2015';

// ─── Top-N concentration toggle (Superinvestors grid) ──────────
// One global setting applied to every card at once: which
// concentration figure the card shows — the combined % of portfolio
// held in the top 3 vs. top 5 positions from the latest 13F on file.
// The mini-table itself always lists all disclosed holdings; N only
// changes how many of them are summed into that concentration stat.
var HF_TOPN = 5;

function hfSetTopN(n){
  HF_TOPN = n;
  document.querySelectorAll('#hf-topn-toggle .sb-tbtn').forEach(function(b){ b.classList.toggle('active', parseInt(b.getAttribute('data-topn'),10)===n); });
  renderInvGrid();
}
window.hfSetTopN = hfSetTopN;

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
    var hasPerf=inv.cum!=null;
    var cumLbl=inv.q1!=null?'Cumul. 2019&ndash;Q2 26':'Cumul. 2019&ndash;2025';
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
    var ytd=inv.ytdNow!=null?inv.ytdNow:(inv.ytd2026!=null?inv.ytd2026:null);
    var ytdIsEst=inv.ytdNow!=null?inv.ytdNowEst:inv.ytdEst;
    var estTag=' <span style="font-size:9px;color:var(--mu)">est</span>';
    var ytdVal=ytd!=null?((ytd>=0?'+':'')+ytd.toFixed(1)+'%'+(ytdIsEst?estTag:'')):'n/a';
    html+='<div class="icard-mets">';
    html+='<div class="icard-mets-row">';
    html+='<div class="icard-met"><div class="icard-ml">'+cumLbl+'</div><div class="icard-mv">'+(hasPerf?((inv.cum>0?'+':'')+inv.cum.toFixed(1)+'%'+(inv.est?' <span style="font-size:9px;color:var(--mu)">est</span>':'')):'<span style="color:var(--mu);font-size:11px">n/a</span>')+'</div></div>';
    html+='<div class="icard-met"><div class="icard-ml">Annualized (7yr)</div><div class="icard-mv">'+(hasPerf?((annualized>=0?'+':'')+annStr):'<span style="color:var(--mu);font-size:11px">n/a</span>')+'</div></div>';
    html+='</div>';
    // Concentration: combined % of portfolio held in the top-N positions
    // from the latest 13F on file (Q2 2026), N set by the global toggle
    // above the grid — holdings are already ordered by weight descending.
    var allHoldings=inv.holdings||[];
    var conc=allHoldings.slice(0,HF_TOPN).reduce(function(s,h){return s+(h.w||0);},0);
    html+='<div class="icard-mets-row">';
    html+='<div class="icard-met"><div class="icard-ml">2026 YTD</div><div class="icard-mv">'+ytdVal+'</div></div>';
    html+='<div class="icard-met"><div class="icard-ml">Top '+HF_TOPN+' Concentration</div><div class="icard-mv">'+(allHoldings.length?conc.toFixed(1)+'%':'<span style="color:var(--mu);font-size:11px">n/a</span>')+'</div></div>';
    html+='</div>';
    html+='</div>';
    // Holdings: every disclosed position from the latest 13F on file
    // (Q2 2026) — the toggle above the grid controls the concentration
    // stat above, not how many rows this table lists.
    html+='<table class="icard-tbl"><thead><tr><th>Ticker</th><th>Company</th><th class="nr">% Port</th><th class="nr">YTD</th></tr></thead><tbody>';
    allHoldings.forEach(function(h){var pc=h.ytd>=0?'rp':'rn';var ys=(h.ytd>=0?'+':'')+h.ytd.toFixed(2)+'%';var nb=h.nw?' <span style="font-size:8px;font-weight:700;letter-spacing:.5px;color:#2563EB;border:1px solid #2563EB;border-radius:3px;padding:0 3px;vertical-align:middle">NEW</span>':'';
      html+='<tr><td><span class="iticker">'+h.t+'</span></td><td><span class="ico">'+h.co+'</span>'+nb+'</td><td class="nr" style="color:var(--mu)">'+h.w.toFixed(2)+'%</td><td class="nr"><span class="rpill '+pc+'">'+ys+'</span></td></tr>';});
    html+='</tbody></table>';
    if(inv.est)html+='<div class="est-note">&#x26A0; Annual returns estimated from portfolio data.</div>';
    html+='</div>';
  });
  grid.innerHTML=html;
}

// ─── Sector Exposure mosaic (Overall sub-tab) ──────────────────
// Rolls up every superinvestor's disclosed top holdings (the same
// hardcoded top-5 shown on their card — no Supabase round trip needed,
// so this renders immediately for everyone) by GICS sector, aggregated
// across all tracked funds into one number per sector — "how crowded is
// the whole tracked book into this trade," not broken out per-investor
// (that per-fund matrix got too busy; the per-fund breakdown still lives
// on each investor's own detail page). Reuses the steel->navy sequential
// ramp from the by-position pie chart, so a more "lit up" tile always
// means more concentrated the same way it does there. Summit's own book
// is excluded — this is about the tracked superinvestors, not our own
// portfolio.

function computeSectorHeatmapData() {
  var investors = INVESTORS.filter(function(inv) { return inv.key !== 'summit'; });
  var sectorTotals = {};
  var sectorTickers = {}; // sector -> ticker -> { company, ytd, weight, holders: [{key, name, fund, w}] }
  investors.forEach(function(inv) {
    (inv.holdings || []).forEach(function(h) {
      var sector = tickerSector(h.t) || 'Other / Unclassified';
      sectorTotals[sector] = (sectorTotals[sector] || 0) + (h.w || 0);
      sectorTickers[sector] = sectorTickers[sector] || {};
      sectorTickers[sector][h.t] = sectorTickers[sector][h.t] || { company: h.co, ytd: h.ytd, weight: 0, holders: [] };
      sectorTickers[sector][h.t].weight += (h.w || 0);
      sectorTickers[sector][h.t].holders.push({ key: inv.key, name: inv.name, fund: inv.fund, w: h.w });
    });
  });
  // Average YTD return across the *distinct companies* on file in each
  // sector (not weighted by position size, and not double-counted when
  // several funds hold the same name) — this is what drives the
  // red/green coloring, like a market-monitor sector heatmap.
  var sectorAvgYtd = {};
  Object.keys(sectorTickers).forEach(function(sector) {
    var tickers = sectorTickers[sector];
    var vals = Object.keys(tickers).map(function(t) { return tickers[t].ytd; }).filter(function(v) { return v != null; });
    sectorAvgYtd[sector] = vals.length ? vals.reduce(function(s, v) { return s + v; }, 0) / vals.length : null;
  });
  var sectors = Object.keys(sectorTotals).sort(function(a, b) { return sectorTotals[b] - sectorTotals[a]; });
  var grandTotal = sectors.reduce(function(sum, s) { return sum + sectorTotals[s]; }, 0);
  var maxSector = sectors.length ? sectorTotals[sectors[0]] : 0;
  return { investors: investors, sectors: sectors, sectorTotals: sectorTotals, sectorTickers: sectorTickers, sectorAvgYtd: sectorAvgYtd, grandTotal: grandTotal, maxSector: maxSector };
}

// Red/green diverging fill for a %, like a market-monitor stock heatmap
// -- green above 0, red below, saturating by PERF_RAMP_CAP so a +40% and
// a +90% sector don't look identical but a +25% one is already clearly
// "strong green."
var PERF_RAMP_CAP = 20;
var PERF_NEG = [200, 45, 45];
var PERF_ZERO = [238, 241, 245];
var PERF_POS = [21, 128, 61];
function perfRamp(pct) {
  if (pct == null) return 'var(--surface)';
  var t = Math.max(-1, Math.min(1, pct / PERF_RAMP_CAP));
  var from = t < 0 ? PERF_NEG : PERF_POS;
  var at = Math.abs(t);
  var r = Math.round(PERF_ZERO[0] + (from[0] - PERF_ZERO[0]) * at);
  var g = Math.round(PERF_ZERO[1] + (from[1] - PERF_ZERO[1]) * at);
  var b = Math.round(PERF_ZERO[2] + (from[2] - PERF_ZERO[2]) * at);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

var _hfHeatmapData = null;
var _hfHeatmapShowPerf = true;

function hfHeatmapTogglePerf(checked) {
  _hfHeatmapShowPerf = checked;
  renderSectorHeatmap();
}

// Squarified treemap layout (Bruls/Huizing/van Wijk): given items with a
// .value and a target rect, returns them with .x/.y/.w/.h filling that
// rect edge-to-edge -- no leftover whitespace, unlike flex-wrap sizing
// (which only ever grows/shrinks along one axis at a time). Used twice:
// once for the sector regions across the whole canvas, once more for
// each sector's own tickers inside the region it was given.
function squarify(items, x, y, w, h) {
  var total = items.reduce(function(s, i) { return s + i.value; }, 0);
  if (!total || !items.length || w <= 0 || h <= 0) { items.forEach(function(i) { i.x = x; i.y = y; i.w = 0; i.h = 0; }); return items; }
  var area = w * h;
  items.forEach(function(i) { i._area = i.value / total * area; });
  function worst(row, side) {
    var sum = 0, max = -Infinity, min = Infinity;
    row.forEach(function(i) { sum += i._area; if (i._area > max) max = i._area; if (i._area < min) min = i._area; });
    var s2 = sum * sum, side2 = side * side;
    return Math.max((side2 * max) / s2, s2 / (side2 * min));
  }
  var remaining = items.slice(), rx = x, ry = y, rw = w, rh = h, out = [];
  while (remaining.length) {
    var shortSide = Math.min(rw, rh);
    var row = [remaining[0]], idx = 1;
    while (idx < remaining.length) {
      var candidate = row.concat([remaining[idx]]);
      if (worst(candidate, shortSide) <= worst(row, shortSide)) { row = candidate; idx++; } else break;
    }
    var rowArea = row.reduce(function(s, i) { return s + i._area; }, 0);
    if (rw >= rh) {
      var stripW = rowArea / rh, cy = ry;
      row.forEach(function(item) { var ih = item._area / stripW; item.x = rx; item.y = cy; item.w = stripW; item.h = ih; cy += ih; });
      rx += stripW; rw -= stripW;
    } else {
      var stripH = rowArea / rw, cx = rx;
      row.forEach(function(item) { var iw = item._area / stripH; item.x = cx; item.y = ry; item.w = iw; item.h = stripH; cx += iw; });
      ry += stripH; rh -= stripH;
    }
    out = out.concat(row);
    remaining = remaining.slice(row.length);
  }
  return out;
}

var HF_TM_W = 1000, HF_TM_H = 520, HF_TM_HDR = 34;

// True two-level treemap, like a market-monitor sector map: sector
// regions sized by how much of the tracked book sits there, each
// containing one tile per company (ticker) sized by that company's own
// aggregate weight across funds and colored by that company's own YTD
// return -- so "how big" and "how it's doing" are two separate signals,
// same as the reference S&P 500 heatmap. Laid out with squarify() so the
// whole canvas is filled, no whitespace. The Performance toggle swaps
// the color signal off (neutral tiles, size-only) without re-fetching
// anything, since this is all built from data already on the page.
function renderSectorHeatmap() {
  var el = document.getElementById('hf-sector-heatmap');
  if (!el) return;
  var data = _hfHeatmapData = computeSectorHeatmapData();
  if (!data.sectors.length) { el.innerHTML = '<div class="hf-secmosaic-empty">No holdings on file yet.</div>'; return; }
  var showPerf = _hfHeatmapShowPerf;
  var html = '<div class="hf-secmonitor"><div class="hf-secmonitor-hd">' +
    '<span class="hf-secmonitor-title">Sized by position weight &middot; colored by each company&rsquo;s own YTD return</span>' +
    '<span style="display:flex;align-items:center;gap:14px">' +
    '<span class="hf-secmonitor-legend">' + (showPerf ? '<span class="hf-secmonitor-sw" style="background:' + perfRamp(-PERF_RAMP_CAP) + '"></span>Down<span class="hf-secmonitor-sw" style="background:' + perfRamp(0) + '"></span>Flat<span class="hf-secmonitor-sw" style="background:' + perfRamp(PERF_RAMP_CAP) + '"></span>Up' : '') + '</span>' +
    '<label class="hf-chart-toggle" title="Show or hide YTD color coding"><input type="checkbox" ' + (showPerf ? 'checked' : '') + ' onchange="hfHeatmapTogglePerf(this.checked)"><span class="hf-chart-toggle-track"><span class="hf-chart-toggle-thumb"></span></span><span class="hf-chart-toggle-txt">Performance</span></label>' +
    '</span></div><div class="hf-treemap">';

  var sectorItems = data.sectors.map(function(sector) { return { sector: sector, value: Math.max(data.sectorTotals[sector], 0.01) }; });
  squarify(sectorItems, 0, 0, HF_TM_W, HF_TM_H);

  sectorItems.forEach(function(si) {
    var sector = si.sector, i = data.sectors.indexOf(sector);
    var avgYtd = data.sectorAvgYtd[sector];
    var avgStr = avgYtd == null ? 'n/a' : (avgYtd >= 0 ? '+' : '') + avgYtd.toFixed(1) + '%';
    var avgCls = avgYtd == null ? '' : (avgYtd >= 0 ? 'hf-tm-pos' : 'hf-tm-neg');
    var pctBox = { left: si.x / HF_TM_W * 100, top: si.y / HF_TM_H * 100, width: si.w / HF_TM_W * 100, height: si.h / HF_TM_H * 100 };
    var hdrH = Math.min(HF_TM_HDR, si.h * 0.4);

    html += '<div class="hf-tm-sector" style="left:' + pctBox.left + '%;top:' + pctBox.top + '%;width:' + pctBox.width + '%;height:' + pctBox.height + '%">' +
      '<div class="hf-tm-sector-hd" style="height:' + hdrH + 'px" onclick="hfSectorClick(' + i + ')" title="Click for the full ' + esc(sector) + ' breakdown"><span class="hf-tm-sector-name">' + esc(sector) + '</span>' + (showPerf ? '<span class="hf-tm-sector-avg ' + avgCls + '">' + avgStr + '</span>' : '') + '</div>' +
      '<div class="hf-tm-tickers" style="top:' + hdrH + 'px">';

    var tickers = data.sectorTickers[sector];
    var tickerItems = Object.keys(tickers).map(function(t) { return { t: t, value: Math.max(tickers[t].weight, 0.01) }; });
    var tickerAreaW = si.w, tickerAreaH = Math.max(si.h - hdrH, 0);
    squarify(tickerItems, 0, 0, tickerAreaW, tickerAreaH);

    tickerItems.forEach(function(ti) {
      var entry = tickers[ti.t];
      var bg = showPerf ? perfRamp(entry.ytd) : 'var(--surface)';
      var tt = showPerf && entry.ytd != null ? Math.abs(entry.ytd) / PERF_RAMP_CAP : 0;
      var textCls = showPerf && tt > 0.45 ? 'hf-secmosaic-text-lt' : 'hf-secmosaic-text-dk';
      var tLeft = ti.x / tickerAreaW * 100, tTop = ti.y / tickerAreaH * 100, tW = ti.w / tickerAreaW * 100, tH = ti.h / tickerAreaH * 100;
      var showYtd = showPerf && entry.ytd != null && ti.w >= 30 && ti.h >= 34;
      html += '<div class="hf-tm-tile ' + textCls + '" style="left:' + tLeft + '%;top:' + tTop + '%;width:' + tW + '%;height:' + tH + '%;background:' + bg + '" onclick="hfTickerClick(\'' + esc(sector).replace(/'/g, "\\'") + '\',\'' + esc(ti.t) + '\')" title="' + esc(entry.company) + '">' +
        '<div class="hf-tm-ticker">' + esc(ti.t) + '</div>' +
        (showYtd ? '<div class="hf-tm-ytd">' + (entry.ytd >= 0 ? '+' : '') + entry.ytd.toFixed(1) + '%</div>' : '') +
      '</div>';
    });
    html += '</div></div>';
  });
  html += '</div></div>';
  el.innerHTML = html;
}

function hfSectorClick(i) {
  if (!_hfHeatmapData) return;
  var sector = _hfHeatmapData.sectors[i];
  if (!sector) return;
  var tickers = _hfHeatmapData.sectorTickers[sector] || {};
  var tks = Object.keys(tickers).sort(function(a, b) {
    var sa = tickers[a].holders.reduce(function(s, h) { return s + h.w; }, 0);
    var sb = tickers[b].holders.reduce(function(s, h) { return s + h.w; }, 0);
    return sb - sa;
  });

  var id = 'hfsec_' + Date.now();
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = id;
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var body = '<div class="hf-secpop-list">';
  if (!tks.length) {
    body += '<div class="hf-stocklookup-empty">No holdings on file for this sector.</div>';
  } else {
    tks.forEach(function(t) {
      var entry = tickers[t];
      var holders = entry.holders.slice().sort(function(a, b) { return b.w - a.w; });
      var ytdBadge = entry.ytd != null ? '<span class="hf-secpop-ytd ' + (entry.ytd >= 0 ? 'pos' : 'neg') + '">' + (entry.ytd >= 0 ? '+' : '') + entry.ytd.toFixed(1) + '%</span>' : '';
      body += '<div class="hf-secpop-row">' +
        '<div class="hf-secpop-co">' + ivdLogo(t, 'hf-secpop-logo') + '<div><div class="hf-secpop-ticker">' + esc(t) + ytdBadge + '</div><div class="hf-secpop-name">' + esc(entry.company) + '</div></div></div>' +
        '<div class="hf-secpop-holders">' + holders.map(function(h) {
          return '<span class="hf-secpop-holder" title="' + esc(h.fund) + '">' + esc(h.name) + ' <b>' + h.w.toFixed(1) + '%</b></span>';
        }).join('') + '</div>' +
      '</div>';
    });
  }
  body += '</div>';

  overlay.innerHTML =
    '<div class="modal-card hf-secpop-card" onclick="event.stopPropagation()">' +
      '<div class="modal-header">' +
        '<div class="modal-title">' + esc(sector) + '</div>' +
        '<button class="modal-close" id="' + id + '_close">&times;</button>' +
      '</div>' +
      '<div class="hf-secpop-body">' + body + '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  document.getElementById(id + '_close').addEventListener('click', function() { overlay.remove(); });
}

// Click one tile in the treemap — a compact popup with just that
// company: who holds it and how big each fund's position is.
function hfTickerClick(sector, ticker) {
  if (!_hfHeatmapData) return;
  var entry = (_hfHeatmapData.sectorTickers[sector] || {})[ticker];
  if (!entry) return;
  var holders = entry.holders.slice().sort(function(a, b) { return b.w - a.w; });

  var id = 'hftk_' + Date.now();
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = id;
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var ytdBadge = entry.ytd != null ? '<span class="hf-secpop-ytd ' + (entry.ytd >= 0 ? 'pos' : 'neg') + '">' + (entry.ytd >= 0 ? '+' : '') + entry.ytd.toFixed(1) + '% YTD</span>' : '';
  var body = '<div class="hf-tkpop-holders">' + holders.map(function(h) {
    return '<div class="hf-tkpop-row"><span class="hf-tkpop-name" title="' + esc(h.fund) + '">' + esc(h.name) + '</span><span class="hf-tkpop-w">' + h.w.toFixed(2) + '%</span></div>';
  }).join('') + '</div>';

  overlay.innerHTML =
    '<div class="modal-card hf-tkpop-card" onclick="event.stopPropagation()">' +
      '<div class="modal-header">' +
        '<div>' + ivdLogo(ticker, 'hf-secpop-logo') + '</div>' +
        '<div style="flex:1;margin-left:10px"><div class="modal-title" style="font-size:15px">' + esc(ticker) + ytdBadge + '</div><div style="font-size:11px;color:var(--mu)">' + esc(entry.company) + '</div></div>' +
        '<button class="modal-close" id="' + id + '_close">&times;</button>' +
      '</div>' +
      '<div class="hf-secpop-body">' + body + '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  document.getElementById(id + '_close').addEventListener('click', function() { overlay.remove(); });
}

// ─── Stock lookup (Overall sub-tab) ────────────────────────────
// "Of the names Summit covers, who else owns this, and is their
// conviction growing or shrinking" — a fixed, curated ticker list (not
// tied to Summit's live position sizing, which changes), then a
// per-investor row across a FIXED window of the 12 most recent
// quarters (bump HF_LATEST_PERIOD forward each time a new quarter's
// 13Fs get backfilled) — the columns never move as data fills in, only
// the % cells do.

var HF_STOCKLOOKUP_TICKERS = [
  { t: 'AMZN', co: 'Amazon.com, Inc.' },
  { t: 'GOOGL', co: 'Alphabet Inc.' },
  { t: 'LYFT', co: 'Lyft, Inc.' },
  { t: 'MA', co: 'Mastercard Incorporated' },
  { t: 'META', co: 'Meta Platforms, Inc.' },
  { t: 'NVDA', co: 'NVIDIA Corporation' },
  { t: 'SOFI', co: 'SoFi Technologies, Inc.' },
  { t: 'SPOT', co: 'Spotify Technology S.A.' },
  { t: 'TBBB', co: 'BBB Foods Inc.' },
  { t: 'TSM', co: 'Taiwan Semiconductor Manufacturing Company' },
  { t: 'UBER', co: 'Uber Technologies, Inc.' },
].sort(function(a, b) { return a.t < b.t ? -1 : a.t > b.t ? 1 : 0; });

var HF_LATEST_PERIOD = { year: 2026, quarter: 2 };
var HF_STOCKLOOKUP_PERIODS = lastNPeriods(HF_LATEST_PERIOD, 12);
var _hfStockLookupShowPerf = true;

function lastNPeriods(latest, n) {
  var periods = [], y = latest.year, q = latest.quarter;
  for (var i = 0; i < n; i++) {
    periods.unshift({ year: y, quarter: q });
    q--; if (q < 1) { q = 4; y--; }
  }
  return periods;
}

function populateStockLookupSelect() {
  var sel = document.getElementById('hf-stocklookup-sel');
  if (!sel) return;
  sel.innerHTML = HF_STOCKLOOKUP_TICKERS.map(function(h) { return '<option value="' + esc(h.t) + '">' + esc(h.t) + ' — ' + esc(h.co) + '</option>'; }).join('');
  hfStockLookupSelect(sel.value);
}

function hfStockLookupTogglePerf(checked) {
  _hfStockLookupShowPerf = checked;
  var wrap = document.getElementById('hf-stocklookup-body');
  if (wrap) wrap.classList.toggle('hf-stocklookup-noperf', !checked);
}

async function hfStockLookupSelect(ticker) {
  var body = document.getElementById('hf-stocklookup-body');
  if (!body) return;
  if (!ticker) { body.innerHTML = ''; return; }
  body.innerHTML = '<div class="hf-stocklookup-empty">Loading&hellip;</div>';
  var result = await fetchHoldingsByTicker(ticker);
  var rows = result.success ? result.data : [];
  if (location.hostname === 'localhost' && !rows.length) {
    rows = LOCAL_INVESTOR_HOLDINGS.filter(function(r) { return r.ticker === ticker; });
  }
  renderStockLookupTable(ticker, rows);
}

function renderStockLookupTable(ticker, rows) {
  var body = document.getElementById('hf-stocklookup-body');
  if (!body) return;
  rows = rows.filter(function(r) { return r.investor_key !== 'summit'; });

  var periods = HF_STOCKLOOKUP_PERIODS;
  var periodKeys = periods.map(periodOptionValue);
  var latestKey = periodKeys[periodKeys.length - 1];

  var byInv = {};
  rows.forEach(function(r) {
    var pk = periodOptionValue({ year: r.year, quarter: r.quarter });
    if (periodKeys.indexOf(pk) === -1) return;
    byInv[r.investor_key] = byInv[r.investor_key] || {};
    byInv[r.investor_key][pk] = r.weight_pct;
  });
  // Rows are every tracked superinvestor, always, not just the ones with
  // a position on file -- someone with no position on this ticker still
  // shows up, just blank across the row, so the list never reflows as
  // you switch tickers.
  var invKeys = INVESTORS.filter(function(i) { return i.key !== 'summit'; }).map(function(i) { return i.key; });
  invKeys.sort(function(a, b) {
    var wa = byInv[a] ? byInv[a][latestKey] : null, wb = byInv[b] ? byInv[b][latestKey] : null;
    if (wa == null && wb == null) return 0;
    if (wa == null) return 1;
    if (wb == null) return -1;
    return wb - wa;
  });

  var html = '<div class="hf-heat-wrap"><table class="hf-stocklookup-tbl"><thead><tr><th>Superinvestor</th>';
  periods.forEach(function(p, i) {
    var isCur = i === periods.length - 1;
    html += '<th class="nr' + (isCur ? ' ivd-cmp-current' : '') + '">' + esc(periodLabel(p)) + (isCur ? ' <span class="ivd-cmp-current-tag">Current</span>' : '') + '</th>';
  });
  html += '</tr></thead><tbody>';
  invKeys.forEach(function(key) {
    var inv = INVESTORS.filter(function(i) { return i.key === key; })[0];
    var photo = inv && inv.photo ? (IMGS[inv.photo] || '') : '';
    var avatar = photo
      ? '<img class="hf-stocklookup-logo" src="' + esc(photo) + '" alt="" onerror="this.style.opacity=0.3">'
      : '<div class="hf-stocklookup-logo hf-stocklookup-ini">' + esc((inv ? inv.name : key).split(' ').slice(0, 2).map(function(n) { return n[0]; }).join('')) + '</div>';
    html += '<tr><td><div class="hf-stocklookup-inv">' + avatar + '<span>' + esc(inv ? inv.name : key) + '<span class="hf-stocklookup-fund">' + esc(inv ? inv.fund : '') + '</span></span></div></td>';
    var invData = byInv[key] || {};
    // Performance color only marks the CURRENT quarter (up/down/new vs.
    // whatever the last non-null quarter before it was) -- earlier
    // quarters show as plain numbers, since coloring every column at once
    // read as "how did the stock do that quarter," which isn't what this
    // signals (it's whether the fund's position grew or shrank).
    var lastNonNull = null;
    periodKeys.forEach(function(pk, i) {
      var w = invData[pk];
      var isCur = i === periodKeys.length - 1;
      var moveCls = '';
      if (isCur && w != null) {
        moveCls = lastNonNull == null ? 'hf-slk-new' : w > lastNonNull ? 'hf-slk-up' : w < lastNonNull ? 'hf-slk-down' : 'hf-slk-flat';
      }
      if (w != null) lastNonNull = w;
      html += '<td class="nr hf-stocklookup-w ' + moveCls + (isCur ? ' ivd-cmp-current' : '') + '">' + (w != null ? w.toFixed(2) + '%' : '<span class="hf-stocklookup-dash">&mdash;</span>') + '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  body.innerHTML = html;
  body.classList.toggle('hf-stocklookup-noperf', !_hfStockLookupShowPerf);
}

// ─── Overall / Superinvestors sub-tabs ─────────────────────────

function hfMainTab(pane) {
  document.querySelectorAll('.hf-maintab').forEach(function(b) { b.classList.toggle('active', b.getAttribute('data-pane') === pane); });
  document.querySelectorAll('.hf-mainpane').forEach(function(p) { p.classList.toggle('active', p.getAttribute('data-pane') === pane); });
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
function ivdLogo(ticker, cls, name) {
  var mono = ticker ? ticker.slice(0, 2).toUpperCase() : (name ? name.slice(0, 2).toUpperCase() : '—');
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

// One row per (year, quarter, cusip) — first occurrence wins. CUSIP, not
// ticker, is the real unique key: a common-stock position and a warrant
// or note in the same company legitimately share the same display ticker
// (e.g. FLYX common vs. FLYX warrant) but always have distinct CUSIPs, so
// keying on ticker would wrongly drop one of them. Guards against
// duplicate holdings showing up in a fund's detail page, whether the
// dupe comes from Supabase itself (e.g. a migration re-run that inserted
// the same quarter twice server-side) or from double-adding the same
// period during the local-seed merge below.
function dedupeHoldingRows(rows) {
  var seen = {}, out = [];
  rows.forEach(function(r) {
    var k = r.year + '-' + r.quarter + '-' + (r.cusip || r.ticker || r.company_name);
    if (seen[k]) return;
    seen[k] = true;
    out.push(r);
  });
  return out;
}

async function loadInvestorProfileData(key) {
  var results = await Promise.all([fetchInvestorReturns(key), fetchInvestorHoldings(key), fetchInvestorLetters(key)]);
  var returns = results[0].success ? results[0].data : [];
  var holdings = dedupeHoldingRows(results[1].success ? results[1].data : []);
  var letters = results[2].success ? results[2].data : [];
  // Supplement (don't just fall back wholesale) with local-seed rows on
  // localhost: Supabase may already have SOME quarters for an investor
  // (e.g. everything through Q1 2026) while the local seed has newer ones
  // (e.g. Q2 2026) that haven't been migrated into Supabase yet. An
  // all-or-nothing check here would silently hide those newer quarters
  // just because Supabase wasn't empty. Merge per (year, quarter/id)
  // instead, letting Supabase win when both have the same row.
  if (location.hostname === 'localhost') {
    var localReturns = LOCAL_INVESTOR_RETURNS.filter(function(r){ return r.investor_key === key; });
    var haveReturnYear = {}; returns.forEach(function(r){ haveReturnYear[r.year] = true; });
    localReturns.forEach(function(r){ if (!haveReturnYear[r.year]) returns.push(r); });

    var localHoldings = LOCAL_INVESTOR_HOLDINGS.filter(function(r){ return r.investor_key === key; });
    var haveHoldingPeriod = {}; holdings.forEach(function(r){ haveHoldingPeriod[periodOptionValue(r)] = true; });
    localHoldings.forEach(function(r){ if (!haveHoldingPeriod[periodOptionValue(r)]) holdings.push(r); });
    holdings = dedupeHoldingRows(holdings);

    if (!letters.length) letters = LOCAL_INVESTOR_LETTERS.filter(function(r){ return r.investor_key === key; });
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

function invLettersHtml(letters, key) {
  if (!letters.length) {
    var note = key && NO_PUBLIC_LETTERS_NOTE[key];
    if (note) return '<div class="im-empty im-no-public">' + esc(note) + '</div>';
    return '<div class="im-empty">No letters on file yet.</div>';
  }
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

function renderInvLetters(id, letters, key) {
  var el = document.getElementById(id + '_letters');
  if (!el) return;
  el.innerHTML = invLettersHtml(letters, key);
  el.querySelectorAll('.im-let-file').forEach(function(btn) {
    btn.addEventListener('click', async function() {
      var result = await getFileUrl(btn.getAttribute('data-path'));
      if (result.success && result.data && result.data.signedUrl) window.open(result.data.signedUrl, '_blank');
      else alert('Could not generate download link.');
    });
  });
}

// ─── Superinvestor Resources tab (Superinvestors sub-tab) ────
// Rolls up every fund's investor_letters into one browsable pool —
// same underlying rows as each card's own "Letters & Resources"
// section above, just aggregated so there's one place to see
// everything at once, viewable by release date or grouped by fund.
// Summit is excluded (this is about the tracked superinvestors, not
// our own book), same as the sector mosaic.

var HF_RES_MODE = 'fund'; // 'date' | 'fund'
var HF_RES_FILTER_KEY = null; // investor_key to narrow to, or null for every fund
var HF_RES_LETTERS = null; // null until first load completes

// Funds with resources on file but no Superinvestor card (no AUM, 13F
// holdings, or return series tracked for them — just letters). Kept
// separate from INVESTORS/portal-data.js on purpose: that file is
// static reference data for the grid and isn't touched for a
// resources-only addition. Add an entry here whenever a new letter
// comes in for a fund that isn't already a superinvestor card.
var RES_ONLY_FUNDS = [
  { key: 'abrams', name: 'Gavin M. Abrams', fund: 'Abrams Bison Investments' },
  { key: 'bristlemoon', name: 'Bristlemoon Capital', fund: 'Bristlemoon Global Fund' },
  { key: 'marks', name: 'Howard Marks', fund: 'Oaktree Capital Management' },
];

// Same idea as RES_ONLY_FUNDS above, but populated at runtime from the
// investor_meta table (sql/022_investor_meta.sql) — one row per
// fund/person added through "Add Resources" that wasn't already
// covered by INVESTORS or the hardcoded list above. Filled in by
// loadHfResources() on load.
var HF_RES_META = [];

function resFundList() {
  return INVESTORS.filter(function(inv) { return inv.key !== 'summit'; }).concat(RES_ONLY_FUNDS).concat(HF_RES_META);
}

// Search-as-you-type over the fixed, local investor list (only ~10
// funds — no need for a remote lookup like the company search).
function hfResSearchInput(q) {
  var box = document.getElementById('hf-res-search-results'); if (!box) return;
  q = (q || '').trim().toLowerCase();
  if (!q) { box.classList.remove('open'); box.innerHTML = ''; return; }
  var matches = resFundList().filter(function(inv) {
    return inv.name.toLowerCase().indexOf(q) !== -1 || (inv.fund || '').toLowerCase().indexOf(q) !== -1;
  }).slice(0, 8);
  box.innerHTML = matches.length
    ? matches.map(function(inv) {
        return '<div class="hf-res-search-item" data-key="' + esc(inv.key) + '"><span class="hf-res-search-name">' + esc(inv.name) + '</span><span class="hf-res-search-fund">' + esc(inv.fund) + '</span></div>';
      }).join('')
    : '<div class="hf-res-search-empty">No match</div>';
  box.classList.add('open');
  box.querySelectorAll('.hf-res-search-item').forEach(function(el) {
    el.addEventListener('mousedown', function(e) { e.preventDefault(); hfResSelectFund(el.getAttribute('data-key')); });
  });
}
window.hfResSearchInput = hfResSearchInput;

function hfResSelectFund(key) {
  HF_RES_FILTER_KEY = key;
  var input = document.getElementById('hf-res-search'); if (input) input.value = '';
  var box = document.getElementById('hf-res-search-results'); if (box) { box.classList.remove('open'); box.innerHTML = ''; }
  renderResFilterPill();
  renderHfResources();
}
window.hfResSelectFund = hfResSelectFund;

function hfResClearFilter() {
  HF_RES_FILTER_KEY = null;
  renderResFilterPill();
  renderHfResources();
}
window.hfResClearFilter = hfResClearFilter;

function renderResFilterPill() {
  var el = document.getElementById('hf-res-filter-pill'); if (!el) return;
  if (!HF_RES_FILTER_KEY) { el.innerHTML = ''; return; }
  var inv = resFundList().filter(function(i) { return i.key === HF_RES_FILTER_KEY; })[0];
  el.innerHTML = '<span class="hf-res-filter-pill">' + esc(inv ? inv.name : HF_RES_FILTER_KEY) + '<button type="button" onclick="hfResClearFilter()" title="Clear filter">&times;</button></span>';
}

// Close the suggestions dropdown on outside click — mirrors the
// Add Company search in companies.js. Bound once at module load since
// the search box itself is never re-rendered.
document.addEventListener('click', function(e) {
  var box = document.getElementById('hf-res-search-results');
  var wrap = document.querySelector('.hf-res-search-wrap');
  if (box && wrap && !wrap.contains(e.target)) box.classList.remove('open');
});

function hfResSetMode(m) {
  HF_RES_MODE = m;
  document.querySelectorAll('#hf-res-mode-toggle .sb-tbtn').forEach(function(b) { b.classList.toggle('active', b.getAttribute('data-mode') === m); });
  renderHfResources();
}
window.hfResSetMode = hfResSetMode;

async function loadHfResources() {
  var results = await Promise.all([fetchAllInvestorLetters(), fetchInvestorMeta()]);
  var letters = results[0].success ? results[0].data : [];
  HF_RES_META = results[1].success ? results[1].data : [];
  // Same "supplement, don't replace" rule as loadInvestorProfileData:
  // only fall back to the local seed for a fund Supabase returned
  // nothing for, so migrated funds aren't clobbered by stale local rows.
  if (location.hostname === 'localhost') {
    var haveKey = {};
    letters.forEach(function(l) { haveKey[l.investor_key] = true; });
    LOCAL_INVESTOR_LETTERS.forEach(function(l) { if (!haveKey[l.investor_key]) letters.push(l); });
  }
  HF_RES_LETTERS = letters;
  renderHfResources();
}

function hfResLetterRow(l, showFund) {
  var isFile = l.type === 'file';
  var inv = showFund ? resFundList().filter(function(i) { return i.key === l.investor_key; })[0] : null;
  var fundTag = inv ? '<span class="im-let-fund">' + esc(inv.name) + '</span>' : '';
  var inner = fundTag + '<span class="im-let-title">' + esc(l.title) + '</span>' +
    (l.date ? '<span class="im-let-date">' + esc(l.date) + '</span>' : '') +
    '<span class="im-let-go">' + (isFile ? 'Download' : 'Open ↗') + '</span>';
  return isFile
    ? '<button type="button" class="im-let-row im-let-file" data-path="' + esc(l.url || '') + '">' + inner + '</button>'
    : '<a class="im-let-row" href="' + esc(l.url || '#') + '" target="_blank" rel="noopener noreferrer">' + inner + '</a>';
}

function byDateDesc(a, b) { return (b.date || '').localeCompare(a.date || ''); }

function renderHfResources() {
  var body = document.getElementById('hf-res-body'); if (!body) return;
  if (HF_RES_LETTERS == null) { body.innerHTML = '<div class="im-loading">Loading&hellip;</div>'; return; }
  var funds = HF_RES_FILTER_KEY ? resFundList().filter(function(inv) { return inv.key === HF_RES_FILTER_KEY; }) : resFundList();
  var filtered = HF_RES_LETTERS.filter(function(l) { return !HF_RES_FILTER_KEY || l.investor_key === HF_RES_FILTER_KEY; });

  var html = '';
  if (HF_RES_MODE === 'date') {
    var sorted = filtered.slice().sort(byDateDesc);
    html = sorted.length ? sorted.map(function(l) { return hfResLetterRow(l, true); }).join('') : '<div class="im-empty">No resources' + (HF_RES_FILTER_KEY ? ' for this fund.' : ' on file yet.') + '</div>';
  } else {
    // Only funds with at least one resource on file get a group — a
    // superinvestor with nothing yet (or a confirmed "no public
    // letters" fund) just doesn't show up here — sorted alphabetically
    // by name rather than the grid's AUM-descending order.
    var groups = funds.map(function(inv) {
      return { inv: inv, items: filtered.filter(function(l) { return l.investor_key === inv.key; }).sort(byDateDesc) };
    }).filter(function(g) { return g.items.length > 0; });
    groups.sort(function(a, b) { return a.inv.name.localeCompare(b.inv.name); });
    if (!groups.length) {
      html = '<div class="im-empty">No resources' + (HF_RES_FILTER_KEY ? ' for this fund.' : ' on file yet.') + '</div>';
    } else {
      groups.forEach(function(g) {
        html += '<div class="im-let-group"><div class="im-let-cat">' + esc(g.inv.name) + ' <span class="hf-res-fundsub">' + esc(g.inv.fund) + '</span></div>';
        g.items.forEach(function(l) { html += hfResLetterRow(l, false); });
        html += '</div>';
      });
    }
  }
  body.innerHTML = html || '<div class="im-empty">No resources on file yet.</div>';
  body.querySelectorAll('.im-let-file').forEach(function(btn) {
    btn.addEventListener('click', async function() {
      var result = await getFileUrl(btn.getAttribute('data-path'));
      if (result.success && result.data && result.data.signedUrl) window.open(result.data.signedUrl, '_blank');
      else alert('Could not generate download link.');
    });
  });
}

// ─── Add Resources (upload a file, confirm date + fund, then save) ──
// Pick a file → a popup asks who it's from and its release date →
// only on "Add" does the upload + DB insert actually happen. Mirrors
// the Companies "Add Resource" file flow (js/companies.js: uploadFile
// into the 'company-files' Storage bucket, then a matching DB row).

var HF_ADDRES_FILE = null; // selected File, while the modal is open

function hfResModalMsg(text, type) {
  var el = document.getElementById('hfres-msg'); if (!el) return;
  el.textContent = text || '';
  el.className = 'modal-msg' + (type ? ' ' + type : '');
}

// Title-cases a filename into a default title, e.g.
// "q2-2026-letter.pdf" -> "Q2 2026 Letter" — just a starting point,
// the field stays editable.
function hfResTitleFromFilename(filename) {
  var base = (filename || '').replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
  return base.replace(/\w\S*/g, function(w) { return /^\d/.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1); });
}

function openHfAddResourcesModal() {
  HF_ADDRES_FILE = null;
  var id = 'hfres_' + Date.now();
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = id;
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  overlay.innerHTML =
    '<div class="modal-card" style="max-width:480px" onclick="event.stopPropagation()">' +
      '<div class="modal-header">' +
        '<div class="modal-title">Add Resources</div>' +
        '<button class="modal-close" id="' + id + '_close">&times;</button>' +
      '</div>' +
      '<div style="padding:18px 22px 22px">' +
        '<div class="res-dropzone" id="hfres-dropzone">' +
          '<div class="res-dropzone-text">Drop file here or <span class="res-browse">browse</span></div>' +
          '<input type="file" id="hfres-file" accept=".pdf,.doc,.docx,.ppt,.pptx" style="display:none">' +
        '</div>' +
        '<div class="res-file-preview" id="hfres-preview" style="display:none">' +
          '<span class="res-file-icon">&#x1F4C4;</span>' +
          '<span class="res-file-name" id="hfres-fileName"></span>' +
          '<button type="button" class="res-file-remove" id="hfres-fileRemove">&times;</button>' +
        '</div>' +
        '<div id="hfres-fields" style="display:none">' +
          '<div class="modal-field">' +
            '<label class="modal-label">Title <span class="modal-req">*</span></label>' +
            '<input class="modal-input" type="text" id="hfres-title" placeholder="e.g. Q2 2026 Investor Letter">' +
          '</div>' +
          '<div class="modal-field">' +
            '<label class="modal-label">Fund or superinvestor <span class="modal-req">*</span></label>' +
            '<div class="hf-res-search-wrap" style="width:100%">' +
              '<input class="modal-input" type="text" id="hfres-fund" placeholder="e.g. Michael Burry, Scion Asset Management" autocomplete="off" oninput="hfAddResFundInput(this.value)" onfocus="hfAddResFundInput(this.value)">' +
              '<div class="hf-res-search-results" id="hfres-fund-results"></div>' +
            '</div>' +
          '</div>' +
          '<div class="modal-row">' +
            '<div class="modal-field">' +
              '<label class="modal-label">Release date <span class="modal-req">*</span></label>' +
              '<input class="modal-input" type="date" id="hfres-date">' +
            '</div>' +
            '<div class="modal-field">' +
              '<label class="modal-label">Category</label>' +
              '<select class="modal-input" id="hfres-category">' +
                '<option value="investor_message">Investor Message</option>' +
                '<option value="annual_letter">Annual Letter</option>' +
              '</select>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="modal-msg" id="hfres-msg"></div>' +
        '<div class="modal-actions">' +
          '<button type="button" class="modal-btn modal-btn--cancel" id="' + id + '_cancel">Cancel</button>' +
          '<button type="button" class="modal-btn modal-btn--save" id="hfres-action-btn" onclick="hfAddResSave()" disabled>Add</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  document.getElementById(id + '_close').addEventListener('click', function() { overlay.remove(); });
  document.getElementById(id + '_cancel').addEventListener('click', function() { overlay.remove(); });

  var dropzone = document.getElementById('hfres-dropzone');
  var fileInput = document.getElementById('hfres-file');
  dropzone.addEventListener('click', function() { fileInput.click(); });
  fileInput.addEventListener('change', function() { if (fileInput.files && fileInput.files[0]) hfResSelectFile(fileInput.files[0]); });
  dropzone.addEventListener('dragover', function(e) { e.preventDefault(); dropzone.classList.add('drag-over'); });
  dropzone.addEventListener('dragleave', function() { dropzone.classList.remove('drag-over'); });
  dropzone.addEventListener('drop', function(e) {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) hfResSelectFile(e.dataTransfer.files[0]);
  });
  document.getElementById('hfres-fileRemove').addEventListener('click', function() {
    HF_ADDRES_FILE = null;
    fileInput.value = '';
    document.getElementById('hfres-dropzone').style.display = '';
    document.getElementById('hfres-preview').style.display = 'none';
    document.getElementById('hfres-fields').style.display = 'none';
    hfAddResValidate();
  });
  ['hfres-title', 'hfres-fund', 'hfres-date'].forEach(function(fid) {
    document.getElementById(fid).addEventListener('input', hfAddResValidate);
  });
}
window.openHfAddResourcesModal = openHfAddResourcesModal;

function hfResSelectFile(file) {
  HF_ADDRES_FILE = file;
  document.getElementById('hfres-dropzone').style.display = 'none';
  document.getElementById('hfres-preview').style.display = '';
  document.getElementById('hfres-fileName').textContent = file.name;
  document.getElementById('hfres-fields').style.display = '';
  document.getElementById('hfres-title').value = hfResTitleFromFilename(file.name);
  hfAddResValidate();
}

// Suggestions dropdown for the fund field — same idea as the
// Resources tab's own search box (hfResSearchInput), scoped to this
// modal's elements so picking an existing fund reuses its key exactly.
function hfAddResFundInput(q) {
  var box = document.getElementById('hfres-fund-results'); if (!box) return;
  q = (q || '').trim().toLowerCase();
  if (!q) { box.classList.remove('open'); box.innerHTML = ''; return; }
  var matches = resFundList().filter(function(inv) {
    return inv.name.toLowerCase().indexOf(q) !== -1 || (inv.fund || '').toLowerCase().indexOf(q) !== -1;
  }).slice(0, 8);
  if (!matches.length) { box.classList.remove('open'); box.innerHTML = ''; return; }
  box.innerHTML = matches.map(function(inv) {
    return '<div class="hf-res-search-item" data-key="' + esc(inv.key) + '" data-name="' + esc(inv.name) + '"><span class="hf-res-search-name">' + esc(inv.name) + '</span><span class="hf-res-search-fund">' + esc(inv.fund) + '</span></div>';
  }).join('');
  box.classList.add('open');
  box.querySelectorAll('.hf-res-search-item').forEach(function(el) {
    el.addEventListener('mousedown', function(e) {
      e.preventDefault();
      document.getElementById('hfres-fund').value = el.getAttribute('data-name');
      document.getElementById('hfres-fund').setAttribute('data-matched-key', el.getAttribute('data-key'));
      box.classList.remove('open');
      box.innerHTML = '';
      hfAddResValidate();
    });
  });
}
window.hfAddResFundInput = hfAddResFundInput;

document.addEventListener('click', function(e) {
  var box = document.getElementById('hfres-fund-results');
  var wrap = box ? box.closest('.hf-res-search-wrap') : null;
  if (box && wrap && !wrap.contains(e.target)) box.classList.remove('open');
});

function hfAddResValidate() {
  var btn = document.getElementById('hfres-action-btn'); if (!btn) return;
  var title = document.getElementById('hfres-title').value.trim();
  var fund = document.getElementById('hfres-fund').value.trim();
  var date = document.getElementById('hfres-date').value;
  btn.disabled = !(HF_ADDRES_FILE && title && fund && date);
}

// Best-effort de-dupe: reuse an existing fund's key when the typed
// text plausibly matches one we already track, instead of registering
// a near-duplicate fund under a new key.
function hfResMatchExistingKey(nameText) {
  var fundInput = document.getElementById('hfres-fund');
  var matchedKey = fundInput ? fundInput.getAttribute('data-matched-key') : null;
  if (matchedKey) return matchedKey;
  var q = (nameText || '').toLowerCase();
  var match = resFundList().filter(function(inv) {
    var n = (inv.name || '').toLowerCase(), f = (inv.fund || '').toLowerCase();
    return (q && n && (n.indexOf(q) !== -1 || q.indexOf(n) !== -1)) || (q && f && (f.indexOf(q) !== -1 || q.indexOf(f) !== -1));
  })[0];
  return match ? match.key : null;
}

function hfResSlugKey(nameText) {
  var words = (nameText || 'fund').trim().split(/\s+/);
  var base = (words[words.length - 1] || nameText).toLowerCase().replace(/[^a-z0-9]/g, '') || 'fund';
  var existing = {}; resFundList().forEach(function(inv) { existing[inv.key] = true; });
  var key = base, n = 2;
  while (existing[key]) { key = base + n; n++; }
  return key;
}

async function hfAddResSave() {
  var title = document.getElementById('hfres-title').value.trim();
  var fundText = document.getElementById('hfres-fund').value.trim();
  var date = document.getElementById('hfres-date').value;
  var category = document.getElementById('hfres-category').value;
  if (!HF_ADDRES_FILE || !title || !fundText || !date) { hfAddResValidate(); return; }

  var btn = document.getElementById('hfres-action-btn');
  btn.disabled = true;
  btn.textContent = 'Adding…';
  hfResModalMsg('', '');

  var key = hfResMatchExistingKey(fundText) || hfResSlugKey(fundText);
  var isNewFund = !resFundList().some(function(inv) { return inv.key === key; });

  if (isNewFund) {
    var metaResult = await insertInvestorMeta({ key: key, name: fundText, fund: fundText });
    if (!metaResult.success) {
      btn.disabled = false; btn.textContent = 'Add';
      hfResModalMsg('Could not save fund: ' + metaResult.error.message, 'error');
      return;
    }
  }

  var filePath = 'investors/' + key + '/' + Date.now() + '-' + HF_ADDRES_FILE.name;
  var uploadResult = await uploadFile(filePath, HF_ADDRES_FILE);
  if (!uploadResult.success) {
    btn.disabled = false; btn.textContent = 'Add';
    hfResModalMsg('Upload failed: ' + uploadResult.error.message, 'error');
    return;
  }

  var letterResult = await insertInvestorLetter({
    investor_key: key,
    year: parseInt(date.slice(0, 4), 10),
    title: title,
    category: category,
    date: date,
    type: 'file',
    url: filePath,
    sort_order: 0,
  });

  if (!letterResult.success) {
    btn.disabled = false; btn.textContent = 'Add';
    hfResModalMsg('Could not save resource: ' + letterResult.error.message, 'error');
    return;
  }

  await loadHfResources();
  var overlay = document.getElementById('hfres-action-btn').closest('.modal-overlay');
  if (overlay) overlay.remove();
}
window.hfAddResSave = hfAddResSave;

// ─── Holdings Comparison (buys / sells / new positions) ──────
// A "period" is one 13F snapshot: {year, quarter}. quarter===null is the
// legacy/manual "current holdings" bucket (e.g. the initial seed) and
// sorts as if it were after Q4 of that year, so it reads as the freshest
// thing on file until real quarterly uploads replace it.

function periodSortKey(p) { return p.year * 10 + (p.quarter == null ? 5 : p.quarter); }
function periodKeyEq(a, b) { return a.year === b.year && a.quarter === b.quarter; }
function periodLabel(p) { return p.quarter ? ('Q' + p.quarter + ' ' + p.year) : (p.year + ' (latest)'); }
function periodOptionValue(p) { return p.year + '-' + (p.quarter == null ? '' : p.quarter); }
// CUSIP is the stable identity across periods — a ticker can be resolved
// in one quarter's row and still null in another (e.g. only some
// quarters have been ticker-backfilled), and keying on ticker would then
// split the SAME security into two rows: one that only has data in the
// resolved-ticker periods, another ('~Company Name') that only has data
// in the unresolved periods. Fall back to ticker, then company name,
// only when cusip itself is missing.
function rowKey(h) { return h.cusip ? h.cusip : (h.ticker ? h.ticker : '~' + h.company_name); }

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
    // Backfill name/ticker from whichever period has them — not just the
    // latest one, since the most recent quarter's row is sometimes the
    // one still missing a resolved ticker.
    var name = '', ticker = '';
    for (var i = maps.length - 1; i >= 0; i--) {
      if (!maps[i][k]) continue;
      if (!name) name = maps[i][k].company_name;
      if (!ticker && maps[i][k].ticker) ticker = maps[i][k].ticker;
      if (name && ticker) break;
    }
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
    html += '<tr data-key="' + esc(r.key) + '"><td><span class="iticker">' + esc(r.ticker || '—') +
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

// Every move type (new / sold / up / down) competes on the same axis — the
// absolute size of the change — so a brand-new 4% position and a 3.5pp trim
// are ranked against each other honestly instead of new/sold always
// crowding out the biggest actual re-weightings. Capped at the 8 largest.
var IVD_MOVES_CAP = 8;

function generateMovesSummary(rows, periods) {
  if (periods.length < 2) return '';
  var moves = [];
  rows.forEach(function(r) {
    var prev = r.cells[r.cells.length - 2], curr = r.cells[r.cells.length - 1];
    var move = classifyMove(prev, curr);
    if (move === 'new') moves.push({ row: r, type: 'new', prev: prev, curr: curr, mag: curr });
    else if (move === 'sold') moves.push({ row: r, type: 'sold', prev: prev, curr: curr, mag: prev });
    else if (move === 'up') moves.push({ row: r, type: 'up', prev: prev, curr: curr, mag: Math.abs(curr - prev) });
    else if (move === 'down') moves.push({ row: r, type: 'down', prev: prev, curr: curr, mag: Math.abs(curr - prev) });
  });
  moves.sort(function(a, b) { return b.mag - a.mag; });
  moves = moves.slice(0, IVD_MOVES_CAP);

  function moveLine(o, text) {
    return '<li class="ivd-move-item ' + o.type + '">' + ivdLogo(o.row.ticker, 'ivd-move-logo', o.row.companyName) + '<span class="ivd-move-txt">' + text + '</span></li>';
  }

  var lines = moves.map(function(o) {
    var r = o.row, ticker = esc(r.ticker || r.companyName);
    if (o.type === 'new') return moveLine(o, '<b>New position: ' + ticker + '</b> — enters at ' + o.curr.toFixed(2) + '% of the portfolio.');
    if (o.type === 'sold') return moveLine(o, '<b>Exited: ' + ticker + '</b> — was ' + o.prev.toFixed(2) + '%, no longer held.');
    if (o.type === 'up') return moveLine(o, '<b>Increased ' + ticker + '</b> from ' + o.prev.toFixed(2) + '% to ' + o.curr.toFixed(2) + '% (+' + (o.curr - o.prev).toFixed(2) + 'pp).');
    return moveLine(o, '<b>Trimmed ' + ticker + '</b> from ' + o.prev.toFixed(2) + '% to ' + o.curr.toFixed(2) + '% (' + (o.curr - o.prev).toFixed(2) + 'pp).');
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
    var logo = it.isOther ? '' : ivdLogo(it.ticker, 'ivd-pie-logo', it.label);
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
    var allocEl = document.getElementById(rootId + '_alloc'); if (allocEl) allocEl.innerHTML = '';
    return;
  }
  var state = { refPeriod: allPeriods[allPeriods.length - 1], mode: 'quarterly', count: Math.min(HOLDINGS_DEFAULT_COUNT, allPeriods.length), chartVisible: true, chartTopN: 8, chartMode: 'position', tableExpanded: false };
  renderHoldingsSectionBody(rootId, investorKey, holdings, allPeriods, state, photoUrl, initials);
  renderAllocationSection(rootId, investorKey, holdings, allPeriods);
}

// ─── Holdings Allocation Over Time ─────────────────────────────
// A user-picked set of tickers, plotted as % of portfolio across this
// investor's own quarterly 13F history (separate from the single-period
// composition pie above). Chips work like the Alpha chart's fund chips:
// add a ticker from the dropdown, click a chip to dim/undim it (dimming
// pulls it from the chart AND the table under it in the same step, since
// "is this chip active" is the one predicate both render from), × to drop
// it entirely. Colors are assigned in first-added order from a fixed,
// CVD-validated 7-hue set — slot "blue" is deliberately left out of that
// set and reserved for the Summit overlay, so a ticker's own line and its
// Summit comparison are never the same hue.
var IVD_ALLOC_COLORS = ['#eb6834','#1baf7a','#eda100','#e87ba4','#008300','#4a3aa7','#e34948'];
var IVD_ALLOC_SUMMIT_COLOR = '#2a78d6';
var IVD_ALLOC_CAP = IVD_ALLOC_COLORS.length;

var IVD_ALLOC_STATE = {};
var IVD_ALLOC_CHARTS = {};
var IVD_ALLOC_SUMMIT_PROMISE = null;

function ivdAllocState(key, allPeriods) {
  if (!IVD_ALLOC_STATE[key]) {
    IVD_ALLOC_STATE[key] = { quarters: Math.min(8, allPeriods.length), added: [], hidden: {}, showSummit: false, yZoom: null };
  }
  return IVD_ALLOC_STATE[key];
}

function destroyIvdAllocChart(key) {
  if (IVD_ALLOC_CHARTS[key]) { IVD_ALLOC_CHARTS[key].destroy(); delete IVD_ALLOC_CHARTS[key]; }
}

// Ticker -> periodKey -> weight_pct, for one investor across every period
// on file — keyed on ticker (not cusip) since the add/remove picker is
// itself ticker-based.
function tickerWeightSeries(holdings, investorKey) {
  var map = {};
  holdings.filter(function(h) { return h.investor_key === investorKey && h.ticker; }).forEach(function(h) {
    var pk = periodOptionValue({ year: h.year, quarter: h.quarter });
    map[h.ticker] = map[h.ticker] || {};
    // Sum rather than overwrite -- a ticker can legitimately have more than
    // one row in the same quarter (e.g. common stock + warrant sharing a
    // display ticker but distinct CUSIPs, same case rowKey() above guards
    // against), and this picker is ticker-based rather than cusip-based.
    map[h.ticker][pk] = (map[h.ticker][pk] || 0) + (Number(h.weight_pct) || 0);
  });
  return map;
}

function ivdAllocFetchSummit() {
  if (!IVD_ALLOC_SUMMIT_PROMISE) IVD_ALLOC_SUMMIT_PROMISE = loadInvestorProfileData('summit');
  return IVD_ALLOC_SUMMIT_PROMISE;
}

function ivdAllocToggle(key, ticker) {
  var state = IVD_ALLOC_STATE[key]; if (!state) return;
  state.hidden[ticker] = !state.hidden[ticker];
  ivdAllocRerender(key);
}
window.ivdAllocToggle = ivdAllocToggle;

function ivdAllocRemove(key, ticker) {
  var state = IVD_ALLOC_STATE[key]; if (!state) return;
  state.added = state.added.filter(function(t) { return t !== ticker; });
  delete state.hidden[ticker];
  ivdAllocRerender(key);
}
window.ivdAllocRemove = ivdAllocRemove;

var IVD_ALLOC_CTX = {}; // key -> { rootId, holdings, allPeriods }
function ivdAllocRerender(key) {
  var ctx = IVD_ALLOC_CTX[key]; if (!ctx) return;
  renderAllocationSection(ctx.rootId, key, ctx.holdings, ctx.allPeriods);
}

// x is a categorical quarter axis (not continuous), so per the portal's
// chart standard (docs/CHART_ENGINE_REFERENCE.md §0.2 item 1: "pass
// onX=null when the x-axis is categorical and unwindowable"), only the
// y-axis is draggable here. Listeners are scoped to the canvas itself
// (not window) so they're garbage-collected along with it on re-render,
// rather than accumulating across renders.
function ivdAllocAttachZoom(wrapEl, canvas, state, rerender) {
  var band = document.createElement('div');
  band.className = 'ivd-alloc-zoomband';
  var dragging = false, startPx = 0;
  function chart() { return IVD_ALLOC_CHARTS[wrapEl.getAttribute('data-invkey')]; }
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    if (band.parentNode) band.parentNode.removeChild(band);
    var ch = chart(); if (!ch || !ch.scales.y) return;
    var rect = canvas.getBoundingClientRect();
    var y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    if (Math.abs(y - startPx) < 6) return; // a click, not a drag
    var v1 = ch.scales.y.getValueForPixel(startPx), v2 = ch.scales.y.getValueForPixel(y);
    state.yZoom = [Math.min(v1, v2), Math.max(v1, v2)];
    rerender();
  }
  canvas.addEventListener('mousedown', function(e) {
    var ch = chart(); if (!ch || !ch.scales.y) return;
    var rect = canvas.getBoundingClientRect();
    var area = ch.chartArea;
    var y = e.clientY - rect.top;
    if (y < area.top || y > area.bottom) return;
    dragging = true; startPx = y;
    band.style.top = y + 'px'; band.style.height = '0px'; band.style.left = area.left + 'px'; band.style.width = (area.right - area.left) + 'px';
    wrapEl.appendChild(band);
  });
  canvas.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    var rect = canvas.getBoundingClientRect();
    var y = e.clientY - rect.top;
    var top = Math.min(startPx, y), h = Math.abs(y - startPx);
    band.style.top = top + 'px'; band.style.height = h + 'px';
  });
  canvas.addEventListener('mouseup', endDrag);
  canvas.addEventListener('mouseleave', function(e) { if (dragging) endDrag(e); });
  canvas.addEventListener('dblclick', function() {
    if (!state.yZoom) return;
    state.yZoom = null;
    rerender();
  });
}

function ivdAllocTable(rows, periods) {
  if (!rows.length) return '';
  var html = '<div class="ivd-cmp-wrap"><table class="icard-tbl ivd-cmp-tbl"><thead><tr><th>Ticker</th>';
  periods.forEach(function(p) { html += '<th class="nr">' + esc(periodLabel(p)) + '</th>'; });
  html += '</tr></thead><tbody>';
  rows.forEach(function(r) {
    html += '<tr><td><span class="iticker" style="color:' + r.color + '">' + esc(r.ticker) + (r.isSummit ? ' <span style="font-size:9px;color:' + IVD_ALLOC_SUMMIT_COLOR + '">(Summit)</span>' : '') + '</span></td>';
    r.values.forEach(function(v) { html += '<td class="nr">' + (v == null ? '&mdash;' : v.toFixed(2) + '%') + '</td>'; });
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  return html;
}

function renderAllocationSection(rootId, investorKey, holdings, allPeriods) {
  var el = document.getElementById(rootId + '_alloc');
  if (!el) return;
  IVD_ALLOC_CTX[investorKey] = { rootId: rootId, holdings: holdings, allPeriods: allPeriods };
  destroyIvdAllocChart(investorKey);
  if (allPeriods.length < 2) {
    el.innerHTML = '<div class="im-section-lbl">Holdings Allocation Over Time</div><div class="im-empty">Need at least two quarters on file to chart allocation over time.</div>';
    return;
  }

  var state = ivdAllocState(investorKey, allPeriods);
  if (state.quarters > allPeriods.length) state.quarters = allPeriods.length;
  if (state.quarters < 2) state.quarters = Math.min(2, allPeriods.length);

  var series = tickerWeightSeries(holdings, investorKey);
  var allTickers = Object.keys(series).sort();

  if (!state.added.length) {
    // Default to the current top 3 holdings so the chart isn't empty on open.
    var latest = allPeriods[allPeriods.length - 1];
    var latestMap = periodWeightMap(holdings, investorKey, latest);
    state.added = Object.keys(latestMap).map(function(k) { return latestMap[k]; })
      .filter(function(h) { return h.ticker; })
      .sort(function(a, b) { return b.weight_pct - a.weight_pct; })
      .slice(0, 3).map(function(h) { return h.ticker; });
  }

  var periods = allPeriods.slice(Math.max(0, allPeriods.length - state.quarters));
  var shared = investorKey === 'summit' ? {} : summitTickerSet();
  var canShowSummit = investorKey !== 'summit' && state.added.some(function(t) { return !state.hidden[t] && shared[t]; });
  if (!canShowSummit) state.showSummit = false;

  var html = '<div class="ivd-chart-hdr"><div class="im-section-lbl" style="margin-bottom:0">Holdings Allocation Over Time</div>' +
    '<div class="ivd-pp-stepper">' +
      '<button type="button" class="ivd-step-btn ivd-alloc-q-minus"' + (state.quarters <= 2 ? ' disabled' : '') + ' title="Fewer quarters">&minus;</button>' +
      '<span class="ivd-pp-count">' + state.quarters + ' quarter' + (state.quarters === 1 ? '' : 's') + '</span>' +
      '<button type="button" class="ivd-step-btn ivd-alloc-q-plus"' + (state.quarters >= allPeriods.length ? ' disabled' : '') + ' title="More quarters">+</button>' +
    '</div></div>';

  html += '<div class="sb-secrow" style="margin:10px 0">';
  html += '<span class="sb-secrow-lbl">Holdings</span>';
  state.added.forEach(function(t, i) {
    var color = IVD_ALLOC_COLORS[i % IVD_ALLOC_COLORS.length];
    var on = !state.hidden[t];
    html += '<span class="sb-secchip' + (on ? ' active' : '') + '" style="' + (on ? 'background:' + color + ';color:#fff;border-color:' + color : '') + '" onclick="ivdAllocToggle(\'' + esc(investorKey) + '\',\'' + esc(t) + '\')" title="Click to show/hide &middot; the &times; removes it">' + esc(t) +
      '<span class="ivd-alloc-x" onclick="event.stopPropagation();ivdAllocRemove(\'' + esc(investorKey) + '\',\'' + esc(t) + '\')">&times;</span></span>';
  });
  if (state.added.length < IVD_ALLOC_CAP) {
    var avail = allTickers.filter(function(t) { return state.added.indexOf(t) === -1; });
    if (avail.length) {
      html += '<select class="fsel ivd-alloc-add"><option value="">+ Add holding&hellip;</option>' +
        avail.map(function(t) { return '<option value="' + esc(t) + '">' + esc(t) + '</option>'; }).join('') + '</select>';
    }
  } else {
    html += '<span style="font-size:11px;color:var(--mu)">Remove a holding to add another (max ' + IVD_ALLOC_CAP + ')</span>';
  }
  html += '</div>';

  if (canShowSummit) {
    html += '<label class="hf-chart-toggle" style="margin-bottom:10px" title="Overlay Summit’s own allocation for shared holdings, as a dashed blue line">' +
      '<input type="checkbox" class="ivd-alloc-summit-toggle"' + (state.showSummit ? ' checked' : '') + '>' +
      '<span class="hf-chart-toggle-track"><span class="hf-chart-toggle-thumb"></span></span>' +
      '<span class="hf-chart-toggle-txt">Summit&rsquo;s allocation (dashed blue)</span></label>';
  }

  var activeTickers = state.added.filter(function(t) { return !state.hidden[t]; });
  if (!activeTickers.length) {
    html += '<div class="im-empty">Add a holding above to chart its allocation over time.</div>';
    el.innerHTML = html;
    wireAllocControls(rootId, investorKey, allPeriods);
    return;
  }

  html += '<div class="ivd-alloc-wrap" data-invkey="' + esc(investorKey) + '" style="position:relative;height:320px;margin-top:4px"><canvas class="ivd-alloc-canvas"></canvas></div>';
  html += '<div class="ivd-alloc-tbl-holder"></div>';
  el.innerHTML = html;

  // Build the row data once — the chart and the table under it both read
  // from this exact array, so hiding a chip removes a ticker from both at
  // the same time (§0.2 item 2).
  var tableRows = [];
  var datasets = [];
  state.added.forEach(function(t, i) {
    if (state.hidden[t]) return;
    var color = IVD_ALLOC_COLORS[i % IVD_ALLOC_COLORS.length];
    var vals = periods.map(function(p) { var s = series[t]; return s ? (s[periodOptionValue(p)] != null ? s[periodOptionValue(p)] : null) : null; });
    tableRows.push({ ticker: t, color: color, values: vals, isSummit: false });
    datasets.push({ label: t, data: vals, borderColor: color, backgroundColor: color, borderWidth: 2, pointRadius: 3, pointHoverRadius: 6, spanGaps: false, tension: .2 });
  });

  el.querySelector('.ivd-alloc-tbl-holder').innerHTML = ivdAllocTable(tableRows, periods);

  function buildChart(extraDatasets) {
    var canvas = el.querySelector('.ivd-alloc-canvas');
    if (!canvas || typeof Chart === 'undefined') return;
    destroyIvdAllocChart(investorKey);
    var all = datasets.concat(extraDatasets || []);
    var chart = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: { labels: periods.map(periodLabel), datasets: all },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'nearest', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function(c) { return c.dataset.label + ': ' + (c.raw == null ? 'n/a' : (c.raw >= 0 ? '+' : '') + c.raw.toFixed(2) + '%'); } } },
        },
        scales: {
          y: {
            title: { display: true, text: 'Portfolio weight (%)', font: { size: 11 }, color: '#8A93A0' },
            min: state.yZoom ? state.yZoom[0] : undefined,
            max: state.yZoom ? state.yZoom[1] : undefined,
            ticks: { color: '#8A93A0', font: { size: 10 }, callback: function(v) { return v + '%'; } },
            grid: { color: '#EEF2F7' },
          },
          x: { grid: { display: false }, ticks: { color: '#8A93A0', font: { size: 10 } } },
        },
      },
    });
    IVD_ALLOC_CHARTS[investorKey] = chart;
    var wrap = el.querySelector('.ivd-alloc-wrap');
    ivdAllocAttachZoom(wrap, canvas, state, function() { renderAllocationSection(rootId, investorKey, holdings, allPeriods); });
  }

  if (canShowSummit && state.showSummit) {
    ivdAllocFetchSummit().then(function(summitData) {
      if (!IVD_ALLOC_CTX[investorKey] || document.getElementById(rootId + '_alloc') !== el) return; // navigated away
      var summitSeries = tickerWeightSeries(summitData.holdings, 'summit');
      var extra = [];
      state.added.forEach(function(t) {
        if (state.hidden[t] || !shared[t] || !summitSeries[t]) return;
        var vals = periods.map(function(p) { var v = summitSeries[t][periodOptionValue(p)]; return v != null ? v : null; });
        tableRows.push({ ticker: t, color: IVD_ALLOC_SUMMIT_COLOR, values: vals, isSummit: true });
        extra.push({ label: t + ' (Summit)', data: vals, borderColor: IVD_ALLOC_SUMMIT_COLOR, backgroundColor: IVD_ALLOC_SUMMIT_COLOR, borderWidth: 2, borderDash: [6, 4], pointRadius: 2.5, pointHoverRadius: 5, spanGaps: false, tension: .2 });
      });
      el.querySelector('.ivd-alloc-tbl-holder').innerHTML = ivdAllocTable(tableRows, periods);
      buildChart(extra);
    });
  } else {
    buildChart([]);
  }

  wireAllocControls(rootId, investorKey, allPeriods);
}

function wireAllocControls(rootId, investorKey, allPeriods) {
  var el = document.getElementById(rootId + '_alloc');
  if (!el) return;
  var state = ivdAllocState(investorKey, allPeriods);
  function rerender() { renderAllocationSection(rootId, investorKey, IVD_ALLOC_CTX[investorKey].holdings, allPeriods); }
  var qMinus = el.querySelector('.ivd-alloc-q-minus');
  if (qMinus) qMinus.addEventListener('click', function() { state.quarters = Math.max(2, state.quarters - 1); rerender(); });
  var qPlus = el.querySelector('.ivd-alloc-q-plus');
  if (qPlus) qPlus.addEventListener('click', function() { state.quarters = Math.min(allPeriods.length, state.quarters + 1); rerender(); });
  var addSel = el.querySelector('.ivd-alloc-add');
  if (addSel) addSel.addEventListener('change', function() {
    if (!addSel.value || state.added.length >= IVD_ALLOC_CAP) return;
    state.added.push(addSel.value);
    delete state.hidden[addSel.value];
    rerender();
  });
  var summitToggle = el.querySelector('.ivd-alloc-summit-toggle');
  if (summitToggle) summitToggle.addEventListener('change', function() { state.showSummit = summitToggle.checked; rerender(); });
}

// ─── Investor Detail page ─────────────────────────────────────
// Replaces the old pop-up: clicking a card swaps the Hedge Funds tab from
// the grid to a full page for that investor — returns always visible up
// top, the holdings comparison + auto-written summary of the biggest
// moves, and Letters & Resources below.

function destroyAllIvdAllocCharts() { Object.keys(IVD_ALLOC_CHARTS).forEach(destroyIvdAllocChart); }

function openInvestorDetail(key) {
  var inv = INVESTORS.filter(function(i){ return i.key === key; })[0];
  var root = document.getElementById('inv-detailview');
  if (!inv || !root) return;
  destroyIvdChart();
  destroyAllIvdAllocCharts();

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
      '<div id="ivd_alloc" style="margin-top:18px"></div>' +
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
      renderInvLetters('ivd', data.letters, key);
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
  destroyAllIvdAllocCharts();
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
window.hfMainTab = hfMainTab;
window.hfStockLookupSelect = hfStockLookupSelect;
window.hfStockLookupTogglePerf = hfStockLookupTogglePerf;
window.hfSectorClick = hfSectorClick;
window.hfHeatmapTogglePerf = hfHeatmapTogglePerf;
window.hfTickerClick = hfTickerClick;

export function loadHedgeFundsPage() {
  if (!HF_FUNDS || !HF_FUNDS.length || !INVESTORS || !INVESTORS.length) {
    var main = document.getElementById('tp-inv');
    if (main) main.innerHTML = '<div style="text-align:center;color:var(--neg);padding:34px;font-size:13px">Hedge fund data failed to load. Please refresh the page.</div>';
    return;
  }
  renderFundChips();
  renderAlphaChart();
  renderInvGrid();
  renderSectorHeatmap();
  populateStockLookupSelect();
  loadHfResources();
}
