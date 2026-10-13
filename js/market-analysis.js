// market-analysis.js — extracted from summit-research-portal.html
import { ALL_STOCKS, SP500_TODAY26, SP500_B25, SP500_B24, SP500_BMK, SCOLS, COMPANY_NAMES } from './portal-data.js';
import { loadNdxAttribution } from './ndx-attribution.js';
import { initSectorPerfChart } from './spx-sector-chart.js';
import { initSpxAttribution } from './spx-attribution.js';

// ─── Data source ───────────────────────────────────────────────
// js/spx-data.js is generated from the analyst's Bloomberg workbook by
// scripts/spx/extract_spx.py: current SPX members (GICS sector + industry
// group, YTD return) and month-end levels of SPX and the 11 S&P 500 GICS
// sector indices (S5xxxx), from which every sector return is computed. When
// it is missing the page falls back to the legacy constants in portal-data.js.
// Either way every benchmark below comes from ONE place (BMK), so the
// cards, filters, scatter lines and 3yr comparison can't disagree.
var SPX = null;          // SPX_DATA when js/spx-data.js is present
var STOCKS = [];         // {t,n,s,i,r22..r26,c3}; i = GICS industry group with SPX data
var BMK = {};            // S&P 500 price return: {'2017':..,'2025':..,ytd:..}
var CUM3 = null;
var IT = 'Information Technology';
// IT industry groups behind the Semiconductors / Software / Hardware chips
var TECH_SUBS = [['Semiconductors','Semiconductors & Semiconductor Equipment'],['Software','Software & Services'],['Hardware','Technology Hardware & Equipment']];

// portal-data.js still keys sector colours by the old
// "Technology" label — look them up through here instead of renaming there.
function legacySec(s){ return s===IT?'Technology':s; }
function secColor(s){ return SCOLS[s]||SCOLS[legacySec(s)]||'#888'; }
function pctTxt(v){ return v==null?'n/a':(v>=0?'+':'')+v.toFixed(1)+'%'; }
function asOfTxt(iso){
  var d=new Date(iso+'T12:00:00Z');
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getUTCMonth()]+' '+d.getUTCDate()+', '+d.getUTCFullYear();
}

// ─── Sector source: S&P 500 sector indices or SPDR sector ETFs ──
// This toggle drives SECTOR ALPHA only. Sector Performance has its own toggle
// (inside js/spx-sector-chart.js), the Sector Summary return column is always the
// S&P 500 sector index (its rows are S&P 500 members), and the SPY attribution is
// SPY-only. Stocks are always compared with the SPX.
// Index mode: S5 indices vs SPX. ETF mode: XL* funds vs SPY (fund vs fund).
var SEC_SRC = 'etf';
function src(){
  if (SPX && SEC_SRC === 'etf' && SPX.etf)
    return { kind:'etf', levels:SPX.etf.levels, annual:SPX.etf.annual, bench:'SPY', benchLabel:'SPY', label:'SPDR sector ETFs' };
  return { kind:'index', levels:SPX?SPX.levels:null, annual:SPX?SPX.annual:null, bench:'SPX', benchLabel:'S&P 500', label:'S&P 500 GICS sector indices' };
}
// Benchmark return for a Sector Alpha year ('2024' … or 'ytd') in the current source
function secBench(key){
  if (!SPX) return key==='ytd' ? BMK.ytd : BMK[key];
  var a = src().annual[src().bench] || {};
  return a[key==='ytd' ? String(SPX.year) : key];
}
// Ticker shown after each sector name, so every number can be checked against
// its Bloomberg line: the SPDR ETF in ETF mode, the S5 index in index mode.
var SEC_TICKER = {
  etf:   {'Information Technology':'XLK','Communication Services':'XLC','Financials':'XLF','Consumer Discretionary':'XLY','Industrials':'XLI','Health Care':'XLV','Utilities':'XLU','Consumer Staples':'XLP','Real Estate':'XLRE','Energy':'XLE','Materials':'XLB'},
  index: {'Information Technology':'S5INFT','Communication Services':'S5TELS','Financials':'S5FINL','Consumer Discretionary':'S5COND','Industrials':'S5INDU','Health Care':'S5HLTH','Utilities':'S5UTIL','Consumer Staples':'S5CONS','Real Estate':'S5RLST','Energy':'S5ENRS','Materials':'S5MATR'}
};
function secTicker(s){ return SPX ? (SEC_TICKER[src().kind]||{})[s] : null; }
function secLabel(s){ var t=secTicker(s); return t ? s+' ('+t+')' : s; }

function buildSectorRets(){
  var a = src().annual;
  SECTOR_RETS = {};
  Object.keys(a).forEach(function(sec){
    if (sec === 'SPX' || sec === 'SPY') return;
    var o = {}; Object.keys(a[sec]).forEach(function(y){ o['r' + y.slice(2)] = a[sec][y]; });
    SECTOR_RETS[sec] = o;
  });
}
// Sector Summary's return column: always the S&P 500 sector index (whatever the
// Sector Alpha toggle shows), because the rows are S&P 500 members.
function idxSectorYtd(sec){
  if (!SPX) return getSectorYtd(sec);
  var a = SPX.annual[sec]; return a ? a[String(SPX.year)] : null;
}

function setSecSrc(k){
  if (!SPX || (k === 'etf' && !SPX.etf)) return;
  SEC_SRC = k;
  buildSectorRets();
  renderSecSrcToggle();
  renderAsOf();
  renderSectorBars();
  renderSBSecChips();
}
window.setSecSrc = setSecSrc;
function renderSecSrcToggle(){
  var el = document.getElementById('spx-src-toggle'); if (!el) return;
  if (!SPX || !SPX.etf){ el.style.display = 'none'; return; }
  el.style.display = '';
  el.innerHTML = '<span class="sb-secrow-lbl" style="margin-right:8px">Sectors measured with</span>' +
    '<span class="sb-toggle" style="display:inline-flex">' +
    '<button class="sb-tbtn' + (SEC_SRC==='etf'?' active':'') + '" onclick="setSecSrc(\'etf\')">SPDR sector ETFs (XLK, XLF…) vs SPY</button>' +
    '<button class="sb-tbtn' + (SEC_SRC==='index'?' active':'') + '" onclick="setSecSrc(\'index\')">S&amp;P 500 sector indices vs S&amp;P 500</button></span>' +
    '<span style="font-size:11px;color:var(--mu);margin-left:10px">ETFs cap their largest holdings, so XLK, XLC and XLY can differ a lot from their sector index</span>';
}

function setupData(D) {
  SPX = D && D.members && D.members.length ? D : null;
  var k;
  if (SPX) {
    STOCKS = SPX.members.map(function(m){ var o={}; for(k in m)o[k]=m[k]; o.i=m.ig; return o; });
    BMK = {}; var a=SPX.annual.SPX||{}; for(k in a)BMK[k]=a[k];
    BMK.ytd = a[String(SPX.year)];
  } else {
    STOCKS = ALL_STOCKS.map(function(s){ var o={}; for(k in s)o[k]=s[k]; if(o.s==='Technology')o.s=IT; return o; });
    BMK = {}; for(k in SP500_BMK)BMK[k]=SP500_BMK[k];
    BMK['2024']=SP500_B24; BMK['2025']=SP500_B25; BMK.ytd=SP500_TODAY26;
  }
  // 3yr cumulative = the same three periods as each stock's c3 (2024 x 2025 x YTD)
  CUM3 = (BMK['2024']!=null&&BMK['2025']!=null&&BMK.ytd!=null) ? ((1+BMK['2024']/100)*(1+BMK['2025']/100)*(1+BMK.ytd/100)-1)*100 : null;
}

// Levels are month-end (the last one is the cut-off). A window of months
// 'YYYY-MM'..'YYYY-MM' runs from the level at the end of the month BEFORE
// `from` to the level at the end of `to`, so one month = that month's return.
function levelIdx(ym){
  var D=src().levels.dates;
  for(var i=0;i<D.length;i++){ if(D[i].slice(0,7)===ym) return i; }
  return -1;
}
function windowRet(key, from, to){
  if(!SPX||!src().levels.series[key])return null;
  var C=src().levels.series[key], i0=levelIdx(from)-1, i1=levelIdx(to);
  if(i0<0||i1<0||i1<=i0||C[i0]==null||C[i1]==null)return null;
  return (C[i1]/C[i0]-1)*100;
}
function ymLabel(ym){ return CUR_MONTH_NAMES[+ym.slice(5,7)-1]+" '"+ym.slice(2,4); }

// Sector Alpha's YTD bar reads through here rather than touching
// SECTOR_RETS directly — one seam for live data later, just
// scoped to one sector at a time.
function getSectorYtd(sector) {
  var s = SECTOR_RETS[sector];
  return s ? s.r26 : null;
}

// As-of stamps come from the data, never typed into the HTML
function renderAsOf() {
  if (!SPX) return;
  function set(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; }
  set('ma-sb-asof', src().label + ' · price return through ' + asOfTxt(SPX.asOf) + ' · relative = vs ' + src().benchLabel + ' · mix any years, months and a date range in the same view');
  set('ma-exp-asof', SPX.year + ' YTD through ' + asOfTxt(SPX.asOf) + ' · price return · GICS sector & industry group');
  set('ma-exp-ind', 'Industry Group');
}

let scatChart = null, tblData = [], tblData2 = [], sortCol = 5, sortAsc = false, IMAP = {}, SB_MODE = 'abs', SECTOR_RETS = {};

// Sector Alpha's current-year slot is always YTD-through-today now (no more
// "last meeting" vs "today" split) — 'ytd' reads SECTOR_RETS[s].r26, the
// same live-ready figure the market snapshot above is built from.
let SB_YEARS = {'2017':false,'2018':false,'2019':false,'2020':false,'2021':false,'2022':true,'2023':true,'2024':true,'2025':true,'ytd':true};
let SB_SECTORS = {}, SS_EXCL = {};

function safeVal(id){var e=document.getElementById(id);return e?e.value:'';}

function setSBMode(m){
  SB_MODE=m;
  document.getElementById('sb-abs').classList.toggle('active',m==='abs');
  document.getElementById('sb-rel').classList.toggle('active',m==='rel');
  renderSectorBars();
}

function toggleYear(yr){
  // Years and months are one pool of periods: any chip can be switched off,
  // including the last one (renderSectorBars shows an empty-state hint).
  SB_YEARS[yr]=!SB_YEARS[yr];
  var btn=document.querySelector('#sb-yearfilter [data-yr="'+yr+'"]');
  if(btn)btn.classList.toggle('active',SB_YEARS[yr]);
  renderSectorBars();
}

function toggleSBSec(sec){
  SB_SECTORS[sec]=!SB_SECTORS[sec];
  // Don't allow all off
  var anyOn=Object.keys(SB_SECTORS).some(function(k){return SB_SECTORS[k];});
  if(!anyOn){SB_SECTORS[sec]=true;return;}
  renderSBSecChips();
  renderSectorBars();
}

function sbSecAll(on){
  Object.keys(SB_SECTORS).forEach(function(k){SB_SECTORS[k]=on;});
  if(!on){var first=Object.keys(SB_SECTORS)[0];SB_SECTORS[first]=true;}
  renderSBSecChips();
  renderSectorBars();
}

function renderSBSecChips(){
  var row=document.getElementById('sb-secrow');if(!row)return;
  var html='<span class="sb-secrow-lbl">Sectors:</span>';
  Object.keys(SB_SECTORS).forEach(function(sec){
    html+='<span class="sb-secchip'+(SB_SECTORS[sec]?' active':'')+'" onclick="toggleSBSec(\''+sec+'\')">'+secLabel(sec)+'</span>';
  });
  html+='<button class="sb-secchip-all" onclick="sbSecAll(true)">All</button>';
  html+='<button class="sb-secchip-all" onclick="sbSecAll(false)" style="margin-left:0">None</button>';
  row.innerHTML=html;
}

function renderSSExclChips(){
  var row=document.getElementById('sec-excl-row');if(!row)return;
  var html='<span class="sb-secrow-lbl">Exclude:</span>';
  Object.keys(SS_EXCL).forEach(function(sec){
    if(sec==='Semiconductors'||sec==='Hardware'||sec==='Software')return; // render at end
    var excluded=SS_EXCL[sec];
    html+='<span class="sb-secchip'+(excluded?' active':'')+'" style="'+(excluded?'background:#9B2A20;border-color:#9B2A20':'')+'" onclick="toggleSSExcl(\''+sec+'\')">'+sec+'</span>';
  });
  // Tech subsector chips (dashed border to indicate subsector-level)
  ['Semiconductors','Hardware','Software'].forEach(function(sub){
    var ex=SS_EXCL[sub];
    html+='<span class="sb-secchip'+(ex?' active':'')+'" style="'+(ex?'background:#9B2A20;border-color:#9B2A20':'border-style:dashed')+'" onclick="toggleSSExcl(\''+sub+'\')">'+sub+'</span>';
  });
  html+='<button class="sb-secchip-all" onclick="ssExclClear()">Clear</button>';
  row.innerHTML=html;
}

function toggleSSExcl(sec){
  SS_EXCL[sec]=!SS_EXCL[sec];
  renderSSExclChips();
  renderTbl();
}

function ssExclClear(){
  Object.keys(SS_EXCL).forEach(function(k){SS_EXCL[k]=false;});
  renderSSExclChips();
  renderTbl();
}

function fillInd(dropId, secVal){
  var el=document.getElementById(dropId);if(!el)return;
  var prev=el.value;
  el.innerHTML='<option value="">All Subsectors</option>';
  var arr=secVal&&IMAP[secVal]?IMAP[secVal]:Object.values(IMAP).reduce(function(a,b){b.forEach(function(x){if(a.indexOf(x)<0)a.push(x);});return a;},[]).sort();
  arr.forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent=v;el.appendChild(o);});
  if(prev&&el.querySelector('option[value="'+prev+'"]'))el.value=prev;
}

function onSecChange(which){
  if(which==='tbl'){fillInd('ind-flt',safeVal('sec-flt'));applyFilters();}
  else if(which==='tbl2'){fillInd('ind-flt2',safeVal('sec-flt2'));applyFilters2();}
  else{fillInd('scat-ind',safeVal('scat-sec'));renderScatter();}
}

function fmt(v){return v==null?'&mdash;':(v>0?'+':'')+v.toFixed(1)+'%';}

// Full-year rule: a stock's return for a year counts (filters, sector
// counts, scatter, rotation) only if it was in the S&P 500 the whole year —
// a member at the end of the prior year and at the end of that year
// (e22..e26 from the extractor, matched on Bloomberg ID). The return is still
// shown, greyed. Without spx-data.js there is no membership: everything counts.
function elig(s,yy){ return !SPX || s['e'+yy]===1; }
var NOT_FULL_YEAR='Not in the S&P 500 for the whole year: shown, but left out of filters and counts';
var NOT_IN_INDEX='Not in the S&P 500 that year: shown, but left out of filters and counts';
// m<yy> from the extractor: 2 = whole year, 1 = part of the year, 0 = not in the index
function memberNote(s,yy){ return s['m'+yy]===0?NOT_IN_INDEX:NOT_FULL_YEAR; }
// 3yr cumulative (2024 x 2025 x YTD) follows the same rule: all three years in full
function c3ok(s){ return elig(s,'24')&&elig(s,'25')&&elig(s,'26'); }
var C3_NOTE='Not in the S&P 500 for all of the last three years: shown, but not compared with the index';
function memberShort(s,yy){ return s['m'+yy]===0?'not in the index':'not in the index all year'; }
var ACTIVE_YRS=[];

function cls(r,b){return r==null?'neu':r>b?'pos':r>0?'neu':'neg';}

// Shared filter logic — applies year-based positive/beat-market filters to a stock array
function filterStocks(data, filters) {
  var yearCfg = [
    { yr: '26', field: 'r26', bench: BMK.ytd },
    { yr: '25', field: 'r25', bench: BMK['2025'] },
    { yr: '24', field: 'r24', bench: BMK['2024'] },
    { yr: '23', field: 'r23', bench: BMK['2023'] },
    { yr: '22', field: 'r22', bench: BMK['2022'] },
  ];
  yearCfg.forEach(function(cfg) {
    if (filters['p' + cfg.yr]) data = data.filter(function(s) { return elig(s, cfg.yr) && s[cfg.field] != null && s[cfg.field] > 0; });
    if (filters['b' + cfg.yr]) data = data.filter(function(s) { return elig(s, cfg.yr) && s[cfg.field] != null && s[cfg.field] > cfg.bench; });
  });
  return data;
}

function readCheckboxFilters(prefix, years) {
  var filters = {};
  years.forEach(function(yr) {
    var pEl = document.querySelector('#' + prefix + '-p' + yr + ' input');
    var bEl = document.querySelector('#' + prefix + '-b' + yr + ' input');
    if (pEl) { filters['p' + yr] = pEl.checked; pEl.parentElement.classList.toggle('active', pEl.checked); }
    if (bEl) { filters['b' + yr] = bEl.checked; bEl.parentElement.classList.toggle('active', bEl.checked); }
  });
  return filters;
}

function applyFilters(){
  var filters = readCheckboxFilters('fc', ['26','25','24','23','22']);
  // the sector denominators only count stocks eligible for every filtered year
  ACTIVE_YRS = ['26','25','24','23','22'].filter(function(y){ return filters['p'+y] || filters['b'+y]; });
  tblData = filterStocks(STOCKS.slice(), filters);
  renderTbl();
}

function clearFilters(){
  document.querySelectorAll('#fc-p26 input, #fc-b26 input, #fc-p25 input, #fc-b25 input, #fc-p24 input, #fc-b24 input, #fc-p23 input, #fc-b23 input, #fc-p22 input, #fc-b22 input').forEach(function(c){c.checked=false;c.parentElement.classList.remove('active');});
  ACTIVE_YRS=[];
  tblData=STOCKS.slice();renderTbl();
}

// Which IT bucket a stock falls in: by GICS industry group with SPX data,
// by the legacy vendor industry tag otherwise.
function techBucket(s){
  for(var j=0;j<TECH_SUBS.length;j++){ if(s.i===TECH_SUBS[j][1]) return TECH_SUBS[j][0]; }
  if(!SPX && s.i==='Software & IT Services') return 'Software';
  return 'Hardware';
}
function techSubLabel(b){
  if(!SPX)return b;
  for(var j=0;j<TECH_SUBS.length;j++){ if(TECH_SUBS[j][0]===b) return TECH_SUBS[j][1]; }
  return b;
}
// YTD of an IT industry group: from its S&P 500 industry-group index when the
// workbook carries one (header "... [4530]"), else n/a. Legacy figures only
// without SPX data, so today's page keeps what it showed.
var LEGACY_TECH_SUB_RETS={'Semiconductors':38.74,'Hardware':22.76,'Software':-13.95};
var LEGACY_TECH_SUB_TOT={'Software':28,'Semiconductors':22,'Hardware':19};
function techSubYtd(b){
  if(!SPX)return LEGACY_TECH_SUB_RETS[b]!=null?LEGACY_TECH_SUB_RETS[b]:null;
  var key=SPX.igSeries&&SPX.igSeries[techSubLabel(b)];
  return key&&SPX.annual[key]?SPX.annual[key][String(SPX.year)]:null;
}

function renderTbl(){
  var body=document.getElementById('sec-summary-body');if(!body)return;
  var SECTORS=[IT,'Consumer Discretionary','Communication Services','Consumer Staples','Financials','Health Care','Energy','Industrials','Materials','Utilities','Real Estate'];
  // Filter out excluded sectors
  SECTORS=SECTORS.filter(function(s){return !SS_EXCL[s];});
  // Helper: is a stock excluded by a Tech subsector filter?
  function isSubExcluded(s){
    if(s.s!==IT)return false;
    return SS_EXCL[techBucket(s)]===true;
  }
  var matchSet={};
  tblData.forEach(function(s){if(!SS_EXCL[s.s]&&!isSubExcluded(s))matchSet[s.t]=true;});
  var rows=[];
  var totMatch=0,totSec=0;
  SECTORS.forEach(function(sec){
    var all=STOCKS.filter(function(s){return s.s===sec&&!isSubExcluded(s)&&ACTIVE_YRS.every(function(y){return elig(s,y);});});
    var matched=all.filter(function(s){return matchSet[s.t];});
    var pct=all.length?(matched.length/all.length*100):0;
    rows.push({sec:sec,m:matched.length,tot:all.length,pct:pct,matched:matched,all:all});
    totMatch+=matched.length;totSec+=all.length;
  });
  rows.sort(function(a,b){return b.m-a.m;});
  // Helper for return formatting + color
  function fmtRet(v){if(v==null||isNaN(v))return '<span style="color:var(--mu)">&mdash;</span>';var c=v>=0?'var(--pos)':'var(--neg)';var sign=v>=0?'+':'';return '<span style="color:'+c+';font-weight:600">'+sign+v.toFixed(2)+'%</span>';}
  var html='';
  rows.forEach(function(r){var cc=secColor(r.sec);
    var pctClr=r.pct>=70?'var(--pos)':r.pct>=40?'var(--text)':'var(--mu)';
    var caret=window.SEC_EXPANDED&&window.SEC_EXPANDED[r.sec]?'&#x25BC;':'&#x25B6;';
    var secRet=idxSectorYtd(r.sec);
    html+='<tr class="sec-row" data-sec="'+r.sec+'" onclick="toggleSecExp(\''+r.sec.replace(/\'/g,"\\'")+'\')" style="cursor:pointer">';
    html+='<td><span style="display:inline-block;width:13px;color:var(--mu);font-size:9px">'+caret+'</span><span class="sch" style="background:'+cc+'22;color:'+cc+';font-weight:600;margin-left:4px">'+r.sec+'</span></td>';
    html+='<td style="text-align:right;font-weight:700;font-size:14px;color:var(--navy)">'+r.m+'</td>';
    html+='<td style="text-align:right;font-weight:600;color:'+pctClr+'">'+r.pct.toFixed(0)+'%</td>';
    html+='<td style="text-align:right;color:var(--mu)">'+r.tot+'</td>';
    html+='<td style="text-align:right">'+fmtRet(secRet)+'</td>';
    html+='</tr>';
    if(window.SEC_EXPANDED&&window.SEC_EXPANDED[r.sec]&&SPX){
      // Sector → industry group → companies. A sector with a single industry
      // group (Energy, Materials, Utilities) opens straight onto its companies.
      var igMap={};
      r.all.forEach(function(s){ var g=s.i||'Unclassified'; if(!igMap[g])igMap[g]={all:[],matched:[]}; igMap[g].all.push(s); if(matchSet[s.t])igMap[g].matched.push(s); });
      var igs=Object.keys(igMap);
      if(igs.length<2){
        html+=companiesBlock(r.matched,32);
      } else {
        igs.map(function(g){ var d=igMap[g]; return {g:g,m:d.matched.length,tot:d.all.length,pct:d.all.length?d.matched.length/d.all.length*100:0,matched:d.matched}; })
          .sort(function(a,b){ return b.m-a.m || b.tot-a.tot; })
          .forEach(function(ir){
            var key=r.sec+'|'+ir.g, open=window.IG_EXPANDED&&window.IG_EXPANDED[key];
            var ipctClr=ir.pct>=70?'var(--pos)':ir.pct>=40?'var(--text)':'var(--mu)';
            html+='<tr class="ig-row" onclick="toggleIgExp(\''+key.replace(/\'/g,"\\'")+'\')" style="cursor:pointer;background:#FAFCFE">';
            html+='<td style="padding-left:32px"><span style="display:inline-block;width:13px;color:var(--mu);font-size:9px">'+(open?'&#x25BC;':'&#x25B6;')+'</span><span style="color:var(--text);font-weight:500;margin-left:4px">'+ir.g+'</span></td>';
            html+='<td style="text-align:right;font-weight:600;color:var(--navy)">'+ir.m+'</td>';
            html+='<td style="text-align:right;font-weight:500;color:'+ipctClr+'">'+ir.pct.toFixed(0)+'%</td>';
            html+='<td style="text-align:right;color:var(--mu)">'+ir.tot+'</td>';
            html+='<td style="text-align:right"><span style="color:var(--mu)" title="No S&amp;P 500 industry-group index in this update">&mdash;</span></td>';
            html+='</tr>';
            if(open) html+=companiesBlock(ir.matched,58);
          });
      }
    } else if(window.SEC_EXPANDED&&window.SEC_EXPANDED[r.sec]){
      var isTech=(r.sec===IT);
      if(isTech){
        // Tech: keep the 3-subsector breakdown
        var indMap={};
        r.all.forEach(function(s){
          if(!s.i)return;
          var key=techBucket(s);
          if(!indMap[key])indMap[key]={all:[],matched:[]};
          indMap[key].all.push(s);
          if(matchSet[s.t])indMap[key].matched.push(s);
        });
        var indRows=Object.keys(indMap).map(function(ind){
          var d=indMap[ind];
          var avg=techSubYtd(ind);
          var tot=SPX?d.all.length:(LEGACY_TECH_SUB_TOT[ind]!=null?LEGACY_TECH_SUB_TOT[ind]:d.all.length);
          var pct=tot?(d.matched.length/tot*100):0;
          return{ind:techSubLabel(ind),m:d.matched.length,tot:tot,pct:pct,avg:avg};
        });
        indRows.sort(function(a,b){return b.m-a.m;});
        html+='<tr><td colspan="5" style="padding:0;background:#FAFCFE"><div style="padding:8px 14px 12px 32px"><div style="font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--mu);font-weight:600;margin-bottom:6px">Subsector breakdown</div>';
        html+='<table style="width:100%;border-collapse:collapse;font-size:11.5px">';
        indRows.forEach(function(ir){
          var ipctClr=ir.pct>=70?'var(--pos)':ir.pct>=40?'var(--text)':'var(--mu)';
          html+='<tr style="border-bottom:.5px solid #EEF2F7"><td style="padding:5px 8px;color:var(--text)">'+ir.ind+'</td>';
          html+='<td style="padding:5px 8px;text-align:right;font-weight:600;color:var(--navy);width:90px">'+ir.m+'</td>';
          html+='<td style="padding:5px 8px;text-align:right;font-weight:500;color:'+ipctClr+';width:90px">'+ir.pct.toFixed(0)+'%</td>';
          html+='<td style="padding:5px 8px;text-align:right;color:var(--mu);width:90px">'+ir.tot+'</td>';
          html+='<td style="padding:5px 8px;text-align:right;width:90px">'+fmtRet(ir.avg)+'</td></tr>';
        });
        html+='</table></div></td></tr>';
      } else {
        // Non-Tech: show list of matched companies
        var matched=r.matched.slice().sort(function(a,b){return (b.r26!=null?b.r26:-999)-(a.r26!=null?a.r26:-999);});
        html+='<tr><td colspan="5" style="padding:0;background:#FAFCFE"><div style="padding:8px 14px 12px 32px"><div style="font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--mu);font-weight:600;margin-bottom:6px">Matched Companies ('+matched.length+')</div>';
        if(matched.length===0){
          html+='<div style="font-size:11px;color:var(--mu);font-style:italic;padding:4px 0">No companies match the current filters.</div>';
        } else {
          html+='<table style="width:100%;border-collapse:collapse;font-size:11.5px">';
          html+='<thead><tr style="border-bottom:1px solid var(--bdr)"><th style="text-align:left;padding:4px 8px;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--mu);font-weight:500">Ticker</th><th style="text-align:left;padding:4px 8px;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--mu);font-weight:500">Company</th><th style="text-align:right;padding:4px 8px;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--mu);font-weight:500">2024</th><th style="text-align:right;padding:4px 8px;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--mu);font-weight:500">2025</th><th style="text-align:right;padding:4px 8px;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--mu);font-weight:500">2026 YTD</th></tr></thead>';
          matched.forEach(function(co){
            var coName=SPX?co.n:(COMPANY_NAMES[co.t]||((co.n&&co.n!==co.t)?co.n:co.t));
            html+='<tr style="border-bottom:.5px solid #EEF2F7"><td style="padding:5px 8px;font-weight:600;color:var(--navy);font-family:Inter,monospace;font-size:11px">'+co.t+'</td>';
            html+='<td style="padding:5px 8px;color:var(--text)">'+coName+'</td>';
            html+='<td style="padding:5px 8px;text-align:right">'+fmtRet(co.r24)+'</td>';
            html+='<td style="padding:5px 8px;text-align:right">'+fmtRet(co.r25)+'</td>';
            html+='<td style="padding:5px 8px;text-align:right">'+fmtRet(co.r26)+'</td></tr>';
          });
          html+='</table>';
        }
        html+='</div></td></tr>';
      }
    }
  });
  var totPct=totSec?(totMatch/totSec*100):0;
  html+='<tr style="border-top:2px solid var(--navy);background:var(--surface)">';
  html+='<td style="font-weight:700;color:var(--navy);text-transform:uppercase;font-size:11px;letter-spacing:.5px;padding-left:25px">Total</td>';
  html+='<td style="text-align:right;font-weight:700;font-size:14px;color:var(--navy)">'+totMatch+'</td>';
  html+='<td style="text-align:right;font-weight:700;color:var(--navy)">'+totPct.toFixed(0)+'%</td>';
  html+='<td style="text-align:right;color:var(--mu);font-weight:600">'+totSec+'</td>';
  html+='<td style="text-align:right" title="S&amp;P 500 YTD">'+fmtRet(BMK.ytd)+'</td>';
  html+='</tr>';
  body.innerHTML=html;
}

// Matched companies of a sector or industry group, under its row. Returns of
// years the stock was not in the index the whole year are greyed, as in the Explorer.
function companiesBlock(list, indent){
  var matched=list.slice().sort(function(a,b){return (b.r26!=null?b.r26:-999)-(a.r26!=null?a.r26:-999);});
  var th='padding:4px 8px;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--mu);font-weight:500';
  var h='<tr><td colspan="5" style="padding:0;background:#FAFCFE"><div style="padding:8px 14px 12px '+indent+'px"><div style="font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--mu);font-weight:600;margin-bottom:6px">Matched Companies ('+matched.length+')</div>';
  if(!matched.length) return h+'<div style="font-size:11px;color:var(--mu);font-style:italic;padding:4px 0">No companies match the current filters.</div></div></td></tr>';
  h+='<table style="width:100%;border-collapse:collapse;font-size:11.5px"><thead><tr style="border-bottom:1px solid var(--bdr)"><th style="text-align:left;'+th+'">Ticker</th><th style="text-align:left;'+th+'">Company</th><th style="text-align:right;'+th+'">2024</th><th style="text-align:right;'+th+'">2025</th><th style="text-align:right;'+th+'">'+SPX.year+' YTD</th></tr></thead>';
  function rc(co,yy){
    var v=co['r'+yy];
    if(v==null)return '<td style="padding:5px 8px;text-align:right;color:var(--mu)">&mdash;</td>';
    if(!elig(co,yy))return '<td style="padding:5px 8px;text-align:right;color:var(--mu);font-style:italic;opacity:.6" title="'+memberNote(co,yy)+'">'+(v>=0?'+':'')+v.toFixed(1)+'%</td>';
    return '<td style="padding:5px 8px;text-align:right"><span style="color:'+(v>=0?'var(--pos)':'var(--neg)')+';font-weight:600">'+(v>=0?'+':'')+v.toFixed(1)+'%</span></td>';
  }
  matched.forEach(function(co){
    h+='<tr style="border-bottom:.5px solid #EEF2F7"><td style="padding:5px 8px;font-weight:600;color:var(--navy);font-family:Inter,monospace;font-size:11px">'+co.t+'</td>';
    h+='<td style="padding:5px 8px;color:var(--text)">'+co.n+'</td>'+rc(co,'24')+rc(co,'25')+rc(co,'26')+'</tr>';
  });
  return h+'</table></div></td></tr>';
}

function toggleIgExp(key){
  if(!window.IG_EXPANDED)window.IG_EXPANDED={};
  window.IG_EXPANDED[key]=!window.IG_EXPANDED[key];
  renderTbl();
}
window.toggleIgExp = toggleIgExp;

function toggleSecExp(sec){
  if(!window.SEC_EXPANDED)window.SEC_EXPANDED={};
  window.SEC_EXPANDED[sec]=!window.SEC_EXPANDED[sec];
  renderTbl();
}

function applyFilters2(){
  var filters = readCheckboxFilters('fc2', ['26','25','24']);
  var sec=safeVal('sec-flt2'),ind=safeVal('ind-flt2');
  var data = filterStocks(STOCKS.slice(), filters);
  if(sec) data=data.filter(function(s){return s.s===sec;});
  if(ind) data=data.filter(function(s){return s.i===ind;});
  tblData2=data;sortRows2();renderTbl2();
}

function clearFilters2(){
  document.querySelectorAll('#fc2-p26 input, #fc2-b26 input, #fc2-p25 input, #fc2-b25 input, #fc2-p24 input, #fc2-b24 input').forEach(function(c){c.checked=false;c.parentElement.classList.remove('active');});
  var sf=document.getElementById('sec-flt2');if(sf)sf.value='';
  fillInd('ind-flt2','');
  tblData2=STOCKS.slice();sortRows2();renderTbl2();
}

// Explorer columns. 2022 onward by default; "Show 2017–2021" adds the older
// years (spx-data.js only — the legacy constants stop at 2022).
var EXP_HIST=false, HIST_YRS=['17','18','19','20','21'], BASE_YRS=['22','23','24','25','26'];
function expYears(){ return (EXP_HIST&&SPX?HIST_YRS:[]).concat(BASE_YRS); }
function yrLabel(yy){ return yy===String(SPX?SPX.year:2026).slice(2)?'20'+yy+' YTD':'20'+yy; }
function benchFor(yy){ return yy===String(SPX?SPX.year:2026).slice(2)?BMK.ytd:BMK['20'+yy]; }
function expCols(){
  return [{k:'t',l:'Ticker'},{k:'s',l:'Sector'},{k:'i',l:SPX?'Industry Group':'Industry'}]
    .concat(expYears().map(function(yy){ return {k:'r'+yy,l:yrLabel(yy)}; }))
    .concat([{k:'c3',l:'3yr Cumul.'}]);
}
function renderTbl2Head(){
  var h=document.getElementById('tbl2-head');if(!h)return;
  h.innerHTML='<tr>'+expCols().map(function(c){
    var on=c.k===SORT2.k;
    return '<th class="'+(on?'srt':'')+'" onclick="sortTbl2(\''+c.k+'\')" style="white-space:nowrap">'+c.l+'<span class="sa">'+(on&&SORT2.asc?'&#x25B2;':'&#x25BC;')+'</span></th>';
  }).join('')+'</tr>';
}
var SORT2={k:'r26',asc:false};
function sortTbl2(k){
  if(SORT2.k===k)SORT2.asc=!SORT2.asc; else {SORT2.k=k; SORT2.asc=(k==='t'||k==='s'||k==='i');}
  sortRows2();
  renderTbl2();
}
function sortRows2(){
  var k=SORT2.k, asc=SORT2.asc, txt=(k==='t'||k==='s'||k==='i');
  tblData2=tblData2.slice().sort(function(a,b){
    if(txt){ var va=a[k]||'', vb=b[k]||''; return asc?va.localeCompare(vb):vb.localeCompare(va); }
    var x=a[k]!=null?a[k]:-999, y=b[k]!=null?b[k]:-999; return asc?x-y:y-x;
  });
}
function toggleExpHist(){ EXP_HIST=!EXP_HIST; renderTbl2(); }
window.toggleExpHist = toggleExpHist;

function renderTbl2(){
  var body=document.getElementById('tbl-body2'),cnt=document.getElementById('tbl-cnt2');if(!body)return;
  renderTbl2Head();
  if(cnt)cnt.innerHTML='<strong>'+tblData2.length+'</strong> <span>companies shown</span>'+
    (SPX?'<button class="sb-secchip-all" style="margin-left:12px" onclick="toggleExpHist()">'+(EXP_HIST?'Hide 2017–2021':'Show 2017–2021')+'</button>':'')+(SPX?'<span style="margin-left:12px;font-style:italic;opacity:.7">Grey numbers: the company was not in the S&amp;P 500 for that whole year, so it is not counted in the filters or totals</span>':'');
  var shown=tblData2.slice(0,250),rows='';
  for(var i=0;i<shown.length;i++){
    var s=shown[i],cc=secColor(s.s);
    // a return from a year the stock was not in the index all year: grey, no beat dot
    function yc(yy,bench){
      var r=s['r'+yy];
      if(r!=null&&!elig(s,yy)) return '<td class="neu" style="font-style:italic;opacity:.55" title="'+memberNote(s,yy)+'">'+fmt(r)+'</td>';
      return '<td class="'+cls(r,bench)+'">'+fmt(r)+(r!=null&&r>bench?'<span class="bdt"></span>':'')+'</td>';
    }
    var tipName=(s.n&&s.n!==s.t)?s.n:(s.i||s.t);
    var cumCls=s.c3==null?'neu':s.c3>100?'pos':s.c3>0?'neu':'neg';
    rows+='<tr>';
    rows+='<td><span class="tkr" title="'+tipName+'">'+s.t+'</span></td>';
    rows+='<td><span class="sch" style="background:'+cc+'22;color:'+cc+'">'+s.s+'</span></td>';
    rows+='<td style="font-size:11px;color:var(--mu);min-width:180px" title="'+s.i+'">'+s.i+'</td>';
    rows+=expYears().map(function(yy){ return yc(yy,benchFor(yy)); }).join('');
    rows+=(s.c3!=null&&!c3ok(s))?'<td class="neu" style="font-style:italic;opacity:.55" title="'+C3_NOTE+'">'+fmt(s.c3)+'</td>':'<td class="'+cumCls+'" style="font-weight:600">'+fmt(s.c3)+'</td>';
    rows+='</tr>';
  }
  if(tblData2.length>250)rows+='<tr><td colspan="'+expCols().length+'" style="text-align:center;padding:11px;color:var(--mu);font-size:11px">First 250 of '+tblData2.length+'. Apply filters to narrow.</td></tr>';
  body.innerHTML=rows;
}

function renderScatter(){
  var canvas=document.getElementById('scat-c');if(!canvas)return;
  var sec=safeVal('scat-sec'),ind=safeVal('scat-ind');
  var data=STOCKS.filter(function(d){
    return d.r25!=null&&d.r26!=null&&elig(d,'25')&&elig(d,'26')&&(!sec||d.s===sec)&&(!ind||d.i===ind);
  });
  if(scatChart){scatChart.destroy();scatChart=null;}
  var q1=0,q2=0,q3=0,q4=0;
  data.forEach(function(d){
    if(d.r25>BMK['2025']&&d.r26>BMK.ytd)q1++;
    else if(d.r25<=BMK['2025']&&d.r26>BMK.ytd)q2++;
    else if(d.r25<=BMK['2025']&&d.r26<=BMK.ytd)q3++;
    else q4++;
  });
  var qEl=document.getElementById('quad-counts');
  if(qEl)qEl.innerHTML='<span class="qc q1">&#x2197; Beat both: <strong>'+q1+'</strong></span><span class="qc">&#x2196; Beat 2026 only: <strong>'+q2+'</strong></span><span class="qc q3">&#x2199; Lag both: <strong>'+q3+'</strong></span><span class="qc">&#x2198; Beat 2025 only: <strong>'+q4+'</strong></span><span class="qc" style="background:rgba(74,127,181,.07)">Total shown: <strong>'+data.length+'</strong></span>';
  var sects=[];
  data.forEach(function(d){if(sects.indexOf(d.s)<0)sects.push(d.s);});
  sects.sort();
  var shadPlugin={id:'sh',beforeDraw:function(ch){
    var ctx=ch.ctx,sx=ch.scales.x,sy=ch.scales.y,ca=ch.chartArea;
    ctx.save();ctx.fillStyle='rgba(180,30,30,0.07)';
    ctx.fillRect(ca.left,sy.getPixelForValue(0),Math.min(sx.getPixelForValue(0),ca.right)-ca.left,ca.bottom-sy.getPixelForValue(0));ctx.restore();
    var xl=sx.getPixelForValue(BMK['2025']);
    if(xl>=ca.left&&xl<=ca.right){ctx.save();ctx.strokeStyle='rgba(74,127,181,0.75)';ctx.lineWidth=1.5;ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(xl,ca.top);ctx.lineTo(xl,ca.bottom);ctx.stroke();ctx.fillStyle='rgba(74,127,181,.9)';ctx.font='bold 10px Inter,sans-serif';ctx.fillText('S&P 2025 '+pctTxt(BMK['2025']),xl+4,ca.top+13);ctx.restore();}
    var yl=sy.getPixelForValue(BMK.ytd);
    if(yl>=ca.top&&yl<=ca.bottom){ctx.save();ctx.strokeStyle='rgba(23,122,78,0.75)';ctx.lineWidth=1.5;ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(ca.left,yl);ctx.lineTo(ca.right,yl);ctx.stroke();ctx.fillStyle='rgba(23,122,78,.9)';ctx.font='bold 10px Inter,sans-serif';ctx.fillText('S&P 2026 YTD '+pctTxt(BMK.ytd),ca.left+4,yl-4);ctx.restore();}
  }};
  var ds=[];
  sects.forEach(function(sec2){
    var pts=data.filter(function(d){return d.s===sec2;}).map(function(d){return{x:Math.max(-80,Math.min(200,d.r25)),y:Math.max(-80,Math.min(250,d.r26)),t:d.t,n:d.n||d.t,s:d.s,i:d.i,r25:d.r25,r26:d.r26};});
    ds.push({label:sec2,data:pts,backgroundColor:(secColor(sec2))+'BB',pointRadius:5,pointHoverRadius:8});
  });
  scatChart=new Chart(canvas,{type:'scatter',data:{datasets:ds},options:{responsive:true,maintainAspectRatio:false,
    plugins:{legend:{display:false},tooltip:{backgroundColor:'rgba(17,30,51,.95)',callbacks:{title:function(c){return c[0].raw.t+' — '+c[0].raw.n;},label:function(c){return[c.raw.s+' | '+c.raw.i,'2025: '+(c.raw.r25>0?"+":"-")+Math.abs(c.raw.r25).toFixed(1)+'%','2026: '+(c.raw.r26>0?"+":"-")+Math.abs(c.raw.r26).toFixed(1)+'%'];}}}},
    scales:{x:{title:{display:true,text:'2025 Return (%)',color:'#5A6E83',font:{size:11}},grid:{color:'#E8EFF7'},ticks:{color:'#5A6E83',font:{size:10},callback:function(v){return v+'%';}}},y:{title:{display:true,text:'2026 YTD Return (%)',color:'#5A6E83',font:{size:11}},grid:{color:'#E8EFF7'},ticks:{color:'#5A6E83',font:{size:10},callback:function(v){return v+'%';}}}}},plugins:[shadPlugin]});
  var l25=document.getElementById('scl-25');if(l25)l25.textContent='S&P 2025 ('+pctTxt(BMK['2025'])+')';
  var l26=document.getElementById('scl-26');if(l26)l26.textContent='S&P 2026 YTD ('+pctTxt(BMK.ytd)+')';
  var legEl=document.getElementById('scleg');
  if(legEl){var lh='';Object.keys(SCOLS).forEach(function(s){lh+='<span class="scli"><span class="scdt" style="background:'+SCOLS[s]+'"></span>'+(s==='Technology'?IT:s)+'</span>';});legEl.innerHTML=lh;}
}

function doSearch(val){
  var res=document.getElementById('sr-res');if(!val){res.style.display='none';return;}
  var q=val.toUpperCase(),matches=[];
  STOCKS.forEach(function(s){if(matches.length<12&&(s.t.indexOf(q)===0||s.t.indexOf(q)>=0))matches.push(s);});
  if(!matches.length){res.style.display='none';return;}
  var html='';
  matches.forEach(function(s){var clr=s.r26==null?'var(--mu)':s.r26>=0?'var(--pos)':'var(--neg)';
    html+='<div class="srrow" data-tk="'+s.t+'" onclick="showDetail(\''+s.t+'\')"><span><span class="srtk">'+s.t+'</span><span class="srsec">'+s.s+'</span></span><span style="font-weight:600;color:'+clr+'">'+fmt(s.r26)+'</span></div>';});
  res.innerHTML=html;res.style.display='block';
}

function closeSrch(){var r=document.getElementById('sr-res');if(r)r.style.display='none';}

var LK_HIST=false, LK_TICKER=null;
function toggleLkHist(){ LK_HIST=!LK_HIST; if(LK_TICKER)showDetail(LK_TICKER); }
window.toggleLkHist = toggleLkHist;

function showDetail(ticker){
  closeSrch();var inp=document.getElementById('sr-inp');if(inp)inp.value=ticker;
  var s=STOCKS.find(function(x){return x.t===ticker;});if(!s)return;
  LK_TICKER=ticker;
  var cum=s.c3, c3in=c3ok(s);var cb=c3in&&cum!=null&&cum>CUM3;
  function bs(r,b){return r!=null&&r>b?'<span style="color:var(--pos);font-weight:600">&#x2705; Beat</span>':'<span style="color:var(--mu)">&#x274C;</span>';}
  function cd(yy){
    var r=s['r'+yy], bench=benchFor(yy), ok=elig(s,yy), c=r==null||!ok?'var(--mu)':r>0?'var(--pos)':'var(--neg)';
    var foot=r==null?'<span style="color:var(--mu)">&nbsp;</span>':ok?bs(r,bench):'<span style="color:var(--mu)">'+memberShort(s,yy)+'</span>';
    return '<div style="background:var(--w);border:.5px solid var(--bdr);border-radius:8px;padding:10px;text-align:center"'+(ok||r==null?'':' title="'+memberNote(s,yy)+'"')+'><div style="font-size:10px;color:var(--mu);text-transform:uppercase;letter-spacing:.8px;margin-bottom:3px">'+yrLabel(yy)+'</div><div style="font-size:16px;font-weight:600;color:'+c+(ok?'':';font-style:italic')+'">'+fmt(r)+'</div><div style="font-size:10px;margin-top:3px">'+foot+'</div></div>';
  }
  var cumBg=cb?'#E6F3EC':'var(--w)',cumBrd=cb?'1px solid #B3D9C3':'.5px solid var(--bdr)';
  var html='<div style="display:flex;align-items:center;gap:10px;margin-bottom:11px"><span style="font-family:Inter,serif;font-size:21px;font-weight:600;color:var(--navy)">'+s.t+'</span><span style="font-size:11px;color:var(--mu)">'+(s.n||s.t)+' &middot; '+s.s+'</span>'+
    (SPX?'<button class="sb-secchip-all" style="margin-left:auto" onclick="toggleLkHist()">'+(LK_HIST?'Hide 2017–2021':'Show 2017–2021')+'</button>':'')+'</div>';
  html+='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:9px">';
  html+=((LK_HIST&&SPX?HIST_YRS:[]).concat(BASE_YRS)).map(cd).join('');
  html+='<div style="background:'+cumBg+';border:'+cumBrd+';border-radius:8px;padding:10px;text-align:center"><div style="font-size:10px;color:var(--mu);text-transform:uppercase;letter-spacing:.8px;margin-bottom:3px">3yr Cumul.</div><div style="font-size:16px;font-weight:600;color:'+(cum==null||!c3in?'var(--mu)':cum>0?'var(--pos)':'var(--neg)')+(c3in?'':';font-style:italic')+'"'+(c3in||cum==null?'':' title="'+C3_NOTE+'"')+'>'+fmt(cum)+'</div><div style="font-size:10px;margin-top:3px;color:'+(cb?'var(--pos)':'var(--mu)')+'">'+( cum==null?'N/A':!c3in?'not in the index all 3 years':cb?'&#x2705; Beats S&P':'vs S&P')+'</div></div>';
  html+='</div>';
  var det=document.getElementById('sr-det-c');if(det)det.innerHTML=html;
  var sd=document.getElementById('sr-det');if(sd)sd.style.display='block';
}

function renderRotTbl(){
  var body=document.getElementById('rot-body');if(!body)return;
  var rows=STOCKS.filter(function(d){return d.r25!=null&&d.r26!=null&&elig(d,'25')&&elig(d,'26')&&d.r25<0&&d.r26>BMK.ytd;});
  rows.sort(function(a,b){return b.r26-a.r26;});rows=rows.slice(0,18);
  var html='';
  rows.forEach(function(d){var cb=d.c3!=null&&d.c3>CUM3;var cc=secColor(d.s);
    html+='<tr><td><span class="tkr" title="'+(d.n||d.t)+'">'+d.t+'</span></td><td><span class="sch" style="background:'+cc+'22;color:'+cc+'">'+d.s+'</span></td>';
    function rc(yy){ var v=d['r'+yy]; if(v!=null&&!elig(d,yy))return '<td class="neu" style="font-style:italic;opacity:.55" title="'+memberNote(d,yy)+'">'+fmt(v)+'</td>'; return '<td class="'+(v!=null?(v>0?'pos':'neg'):'neu')+'">'+fmt(v)+'</td>'; }
    html+=rc('22')+rc('23');
    html+=rc('24')+'<td class="neg">'+d.r25.toFixed(1)+'%</td><td class="pos">+'+d.r26.toFixed(1)+'%</td>';
    html+='<td>'+(d.c3!=null?'<span class="'+(d.c3>0?'cpos':'cneg')+'">'+fmt(d.c3)+'</span>':'&mdash;')+'</td><td>'+(d.c3!=null?(cb?'<span class="bful">&#x2705; Beats S&P</span>':'<span class="nbt">Lags S&P</span>'):'&mdash;')+'</td></tr>';
  });
  body.innerHTML=html;
}

function sbBar(label,v,maxV,hlClass,keyClass){
  if(v==null)return '<div class="sby'+hlClass+'"><span class="sbyl">'+label+'</span><div class="sbtr-div"></div><span class="sbi" style="color:var(--mu);font-weight:600">n/a</span></div>';
  var pct=Math.min(Math.abs(v)/maxV*50,50);var sign=v>=0?'+':'';var color=v>=0?'#1E3A5F':'#9B2A20';var left=v>=0?50:50-pct;
  return '<div class="sby'+hlClass+'"><span class="sbyl">'+label+'</span><div class="sbtr-div"><div class="sbfl-div" style="left:'+left+'%;width:'+pct+'%;background:'+color+'"></div></div><span class="sbi'+keyClass+'" style="color:'+(v>=0?'var(--pos)':'var(--neg)')+';font-weight:600">'+sign+v.toFixed(2)+'%</span></div>';
}

// Years, months and a date range are independent filters that render
// TOGETHER in the same row per sector — pick any mix (e.g. "2025 vs YTD vs
// Mar '26" or "YTD vs Jan '25–Jun '25") and they all show up side by side.
var CUR_MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
// Months are keyed 'YYYY-MM' (any year in the data). The year picker only
// changes which year's chips are on screen; picked months from other years
// stay picked and keep their bars.
let SB_MONTHS = {}, SB_MONTH_YEAR = null;
// Date range, in months: from the end of the month before `from` to the end
// of `to` (the last month is month-to-date). Defaults to YTD.
let SB_RANGE = {on:false, from:null, to:null};

function dataMonths(){
  if(!SPX) return [];
  return SPX.levels.dates.slice(1).map(function(d){ return d.slice(0,7); });
}
function monthIsMTD(ym){
  if(!SPX||ym!==SPX.asOf.slice(0,7))return false;
  var d=new Date(SPX.asOf+'T12:00:00Z'), nx=new Date(d.getTime()+86400000*4);
  return nx.getUTCMonth()===d.getUTCMonth();
}
function monthLabel(ym){ return ymLabel(ym)+(monthIsMTD(ym)?' MTD':''); }

// One combined, ordered list of active periods — years (in the
// sb-yearfilter order, "ytd" last among them), then picked months in date
// order, then the range — each entry carrying enough to compute and label its bar.
function sbActivePeriods(){
  var YL=['2017','2018','2019','2020','2021','2022','2023','2024','2025','ytd'];
  var periods=YL.filter(function(y){return SB_YEARS[y];}).map(function(y){
    return {type:'year', key:y, label: y==='ytd'?'YTD':y};
  });
  var months=Object.keys(SB_MONTHS).filter(function(m){return SB_MONTHS[m];}).sort();
  periods=periods.concat(months.map(function(m){ return {type:'month', key:m, label:monthLabel(m)}; }));
  if(SPX&&SB_RANGE.on) periods.push({type:'range', key:'range', label:ymLabel(SB_RANGE.from)+'–'+ymLabel(SB_RANGE.to)});
  return periods;
}

function sbPeriodVal(sector,p){
  if(p.type==='year'){
    var rr = p.key==='ytd' ? getSectorYtd(sector) : SECTOR_RETS[sector]['r'+p.key.slice(2)];
    if(rr==null)return null;
    var bench = secBench(p.key);
    if(SB_MODE==='rel'&&bench==null)return null;
    return SB_MODE==='abs'?rr:(rr-bench);
  }
  var from=p.type==='range'?SB_RANGE.from:p.key, to=p.type==='range'?SB_RANGE.to:p.key;
  var w=windowRet(sector,from,to);
  if(w==null||SB_MODE==='abs')return w;
  var wb=windowRet(src().bench,from,to);
  return wb==null?null:w-wb;
}

function renderSectorBars(){
  var wrap=document.getElementById('sb-wrap');if(!wrap)return;
  var sectors=Object.keys(SECTOR_RETS).slice().filter(function(s){return SB_SECTORS[s];}).sort(function(a,b){return (getSectorYtd(b)||0)-(getSectorYtd(a)||0);});
  var periods=sbActivePeriods();
  if(!periods.length){ wrap.innerHTML='<div class="im-empty">Select at least one year, month or range.</div>'; return; }
  var lastMonth=SPX?SPX.asOf.slice(0,7):null;
  var maxV=0;
  sectors.forEach(function(s){
    periods.forEach(function(p){
      var v=sbPeriodVal(s,p);
      if(v!=null&&Math.abs(v)>maxV)maxV=Math.abs(v);
    });
  });
  maxV=Math.max(maxV, SB_MODE==='abs'?30:15);
  var html='';
  sectors.forEach(function(s){
    html+='<div class="sbr"><span class="sbn">'+secLabel(s)+'</span><div class="sbbs">';
    periods.forEach(function(p){
      var v=sbPeriodVal(s,p);
      var isCur=(p.key==='ytd'||p.key===lastMonth||p.key==='range');
      html+=sbBar(p.label,v,maxV,isCur?' sby-hl':'','');
    });
    html+='</div></div>';
  });
  wrap.innerHTML=html;
}

function toggleSBMonth(m){
  SB_MONTHS[m]=!SB_MONTHS[m];
  renderSBMonthChips();
  renderSectorBars();
}

function setSBMonthYear(y){
  SB_MONTH_YEAR=y;
  renderSBMonthChips();
}

function clearSBMonths(){
  SB_MONTHS={};
  renderSBMonthChips();
  renderSectorBars();
}

// Months row: a year picker + that year's month chips on the left, the date
// range on the right. Without js/spx-data.js there is no monthly data, so
// the row says so instead of offering chips that can only show n/a.
function renderSBMonthChips(){
  var row=document.getElementById('sb-monthfilter');if(!row)return;
  if(!SPX){ row.innerHTML='<span class="sb-secrow-lbl">Months</span><span style="font-size:11px;color:var(--mu)">Monthly returns arrive with the next data update.</span>'; return; }
  var ms=dataMonths(), years=[];
  ms.forEach(function(m){ var y=m.slice(0,4); if(years.indexOf(y)<0)years.push(y); });
  if(!SB_MONTH_YEAR||years.indexOf(SB_MONTH_YEAR)<0)SB_MONTH_YEAR=years[years.length-1];
  var sel='padding:3px 6px;border:1px solid var(--bdr);border-radius:6px;font:inherit;font-size:11px;color:var(--text);background:var(--w)';
  var html='<span class="sb-secrow-lbl">Months</span><select onchange="setSBMonthYear(this.value)" style="'+sel+'">'+
    years.slice().reverse().map(function(y){ return '<option'+(y===SB_MONTH_YEAR?' selected':'')+'>'+y+'</option>'; }).join('')+'</select>';
  html+=CUR_MONTH_NAMES.map(function(n,i){
    var ym=SB_MONTH_YEAR+'-'+(i<9?'0':'')+(i+1);
    if(ms.indexOf(ym)<0) return '<span class="sb-secchip" style="opacity:.35;cursor:default">'+n+'</span>';
    return '<span class="sb-secchip'+(SB_MONTHS[ym]?' active':'')+'" onclick="toggleSBMonth(\''+ym+'\')">'+n+(monthIsMTD(ym)?' MTD':'')+'</span>';
  }).join('');
  var picked=Object.keys(SB_MONTHS).filter(function(m){return SB_MONTHS[m];}).length;
  if(picked)html+='<button class="sb-secchip-all" onclick="clearSBMonths()">Clear ('+picked+')</button>';
  // Range, pushed to the right of the same row
  var first=ms[0], last=ms[ms.length-1];
  html+='<span style="margin-left:auto;display:inline-flex;align-items:center;gap:6px">'+
    '<span class="sb-secrow-lbl">Range</span>'+
    ymPicker('sb-range-from',SB_RANGE.from,first,last,sel)+
    '<span style="font-size:11px;color:var(--mu)">to</span>'+
    ymPicker('sb-range-to',SB_RANGE.to,first,last,sel)+
    '<span class="sb-secchip'+(SB_RANGE.on?' active':'')+'" onclick="toggleSBRange()">'+(SB_RANGE.on?'Shown':'Show')+'</span></span>';
  row.innerHTML=html;
}

function toggleSBRange(){
  SB_RANGE.on=!SB_RANGE.on;
  renderSBMonthChips();
  renderSectorBars();
}

// Month + year as two short dropdowns (the native month calendar makes you
// scroll through years). Value 'YYYY-MM', clamped to the data's first/last month.
function ymPicker(id, val, first, last, style){
  var y0=+first.slice(0,4), y1=+last.slice(0,4), html='<span style="display:inline-flex;gap:4px">';
  html+='<select id="'+id+'-m" onchange="setSBRange()" style="'+style+'">'+CUR_MONTH_NAMES.map(function(n,i){ var mm=(i<9?'0':'')+(i+1); return '<option value="'+mm+'"'+(val.slice(5,7)===mm?' selected':'')+'>'+n+'</option>'; }).join('')+'</select>';
  html+='<select id="'+id+'-y" onchange="setSBRange()" style="'+style+'">';
  for(var y=y1;y>=y0;y--) html+='<option'+(String(y)===val.slice(0,4)?' selected':'')+'>'+y+'</option>';
  return html+'</select></span>';
}
function ymRead(id, first, last){
  var v=safeVal(id+'-y')+'-'+safeVal(id+'-m');
  return v<first?first:v>last?last:v;
}

function setSBRange(){
  var ms=dataMonths(), first=ms[0], last=ms[ms.length-1];
  var f=ymRead('sb-range-from',first,last), t=ymRead('sb-range-to',first,last);
  if(f&&t&&f>t){var x=f;f=t;t=x;}
  if(f)SB_RANGE.from=f;
  if(t)SB_RANGE.to=t;
  SB_RANGE.on=true;
  renderSBMonthChips();
  renderSectorBars();
}

// ── Sub-nav panel switcher ────────────────────────────────────
var _ndxLoaded = false;
function switchMAPanel(panel) {
  document.querySelectorAll('#ma-subnav .ma-pill').forEach(function(p) {
    p.classList.toggle('active', p.dataset.mpanel === panel);
  });
  document.querySelectorAll('.ma-panel').forEach(function(p) { p.style.display = 'none'; });
  var el = document.getElementById('ma-panel-' + panel);
  if (el) el.style.display = '';
  if (panel === 'ndx' && !_ndxLoaded) {
    _ndxLoaded = true;
    loadNdxAttribution(el);
  }
}
window.switchMAPanel = switchMAPanel;

// Expose to window for inline onclick handlers
window.setSBMode = setSBMode;
window.toggleYear = toggleYear;
window.toggleSBMonth = toggleSBMonth;
window.toggleSBRange = toggleSBRange;
window.setSBRange = setSBRange;
window.setSBMonthYear = setSBMonthYear;
window.clearSBMonths = clearSBMonths;
window.toggleSBSec = toggleSBSec;
window.sbSecAll = sbSecAll;
window.toggleSSExcl = toggleSSExcl;
window.ssExclClear = ssExclClear;
window.fillInd = fillInd;
window.onSecChange = onSecChange;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.applyFilters2 = applyFilters2;
window.clearFilters2 = clearFilters2;
window.sortTbl2 = sortTbl2;
window.renderScatter = renderScatter;
window.doSearch = doSearch;
window.closeSrch = closeSrch;
window.showDetail = showDetail;
window.toggleSecExp = toggleSecExp;

export function loadMarketAnalysisPage() {
  // js/spx-data.js is optional: a missing file (404) just means fallback data.
  return import('./spx-data.js').then(function(m){ return m.SPX_DATA; }, function(){ return null; }).then(initMarketAnalysis);
}

function initMarketAnalysis(D) {
  setupData(D);
  if (!STOCKS.length) {
    var main = document.getElementById('tp-rot');
    if (main) main.innerHTML = '<div style="text-align:center;color:var(--neg);padding:34px;font-size:13px">Market data failed to load. Please refresh the page.</div>';
    return;
  }
  tblData = STOCKS.slice();
  // Explorer opens ranked by YTD (SORT2 = r26, descending)
  tblData2 = STOCKS.slice(); sortRows2();

  // Build industry map
  IMAP = {};
  for (var i = 0; i < STOCKS.length; i++) {
    var s = STOCKS[i];
    if (s.s && s.i) { if (!IMAP[s.s]) IMAP[s.s] = []; if (IMAP[s.s].indexOf(s.i) < 0) IMAP[s.s].push(s.i); }
  }
  for (var k in IMAP) IMAP[k].sort();

  // Sector returns from the S&P 500 sector indices' month-end levels in
  // spx-data.js (r17..r25 = calendar years, r26 = YTD), else the legacy figures below.
  if (SPX) {
    buildSectorRets();
    var ms = dataMonths();
    SB_RANGE = {on:false, from:SPX.year + '-01', to:ms[ms.length-1]};
  } else {
  SECTOR_RETS = {
    "Industrials":{r17:21.62,r18:-15.73,r19:27.83,r20:8.12,r21:19.54,r22:-6.79,r23:16.07,r24:15.73,r25:17.59,r26a:11.14,r26:16.2},
    "Information Technology":{r17:32.24,r18:-3.99,r19:48.83,r20:42.08,r21:34.58,r22:-28.78,r23:54.68,r24:21.82,r25:22.8,r26a:35.97,r26:27.32},
    "Consumer Staples":{r17:10.02,r18:-11.11,r19:24.42,r20:6.45,r21:14.35,r22:-2.66,r23:-3.38,r24:8.8,r25:-0.88,r26a:5.6,r26:10.7},
    "Communication Services":{r17:null,r18:null,r19:29.86,r20:25.05,r21:17.67,r22:-39.08,r23:51.41,r24:33.68,r25:21.2,r26a:-1.79,r26:-5.37},
    "Energy":{r17:-4.06,r18:-21.05,r19:4.65,r20:-35.98,r21:44.85,r22:58.0,r23:-4.15,r24:0.85,r25:5.76,r26a:28.16,r26:42.34},
    "Real Estate":{r17:7.12,r18:-6.07,r19:24.11,r20:-5.94,r21:43.13,r22:-28.57,r23:8.48,r24:0.72,r25:0,r26a:7.24,r26:11.72},
    "Materials":{r17:21.79,r18:-17.23,r19:21.7,r20:18.27,r21:25.1,r22:-13.89,r23:10.12,r24:-2.03,r25:8.23,r26a:12.28,r26:18.06},
    "Utilities":{r17:8.46,r18:0.28,r19:21.84,r20:-4.02,r21:15.46,r22:-1.16,r23:-10.17,r24:19.63,r25:12.7,r26a:0.96,r26:0.19},
    "Health Care":{r17:19.93,r18:3.11,r19:19.25,r20:10.43,r21:26.04,r22:-3.99,r23:0.39,r24:0.63,r25:12.8,r26a:-4.5,r26:12.8},
    "Financials":{r17:20.04,r18:-15.48,r19:30.06,r20:-5.08,r21:34.34,r22:-12.58,r23:9.94,r24:28.4,r25:13.44,r26a:-6.1,r26:4.95},
    "Consumer Discretionary":{r17:21.24,r18:-0.74,r19:27.85,r20:28.31,r21:27.53,r22:-36.97,r23:38.44,r24:26.42,r25:5.65,r26a:-1.02,r26:-1.16}
  };
  }

  // Initialize sector filter
  var allSecs = Object.keys(SECTOR_RETS).slice().sort(function(a, b) { return getSectorYtd(b) - getSectorYtd(a); });
  allSecs.forEach(function(s) { SB_SECTORS[s] = true; SS_EXCL[s] = false; });
  SS_EXCL['Semiconductors'] = false;
  SS_EXCL['Hardware'] = false;
  SS_EXCL['Software'] = false;
  // Years and months start unchecked — the user picks what to compare
  // rather than seeing every year at once.

  renderAsOf();
  renderSecSrcToggle();
  renderSBSecChips();
  renderSSExclChips();
  renderSBMonthChips();
  renderSectorBars();
  initSectorPerfChart(document.getElementById('sp-chart'), SPX, secColor, SPX ? {
    etf:   SPX.etf ? { levels:SPX.etf.levels, bench:'SPY', benchLabel:'SPY', label:'SPDR sector ETFs', tickers:SEC_TICKER.etf } : null,
    index: { levels:SPX.levels, bench:'SPX', benchLabel:'S&P 500', label:'S&P 500 GICS sector indices', tickers:SEC_TICKER.index }
  } : null);
  initSpxAttribution(document.getElementById('spx-attr-host'), SPX);
  renderTbl();
  renderTbl2();
  renderRotTbl();
  setTimeout(renderScatter, 120);

  var si = document.getElementById('sr-inp');
  if (si) {
    si.addEventListener('input', function() { doSearch(this.value); });
    si.addEventListener('blur', function() { setTimeout(closeSrch, 200); });
  }
  switchMAPanel('sp500');
}
