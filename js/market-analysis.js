// market-analysis.js — extracted from summit-research-portal.html
import { ALL_STOCKS, SP500_B26, SP500_B25, SP500_B24, SP500_BMK, SP500_CUM3, SCOLS, SDATA, COMPANY_NAMES } from './portal-data.js';

let scatChart = null, tblData = [], tblData2 = [], sortCol = 5, sortAsc = false, sortCol2 = 7, sortAsc2 = false, IMAP = {}, SB_MODE = 'abs', SECTOR_RETS = {};
let SB_YEARS = {'2017':true,'2018':true,'2019':true,'2020':true,'2021':true,'2022':true,'2023':true,'2024':true,'2025':true,'2026':true};
let SB_SECTORS = {}, SS_EXCL = {};

function safeVal(id){var e=document.getElementById(id);return e?e.value:'';}

function setSBMode(m){
  SB_MODE=m;
  document.getElementById('sb-abs').classList.toggle('active',m==='abs');
  document.getElementById('sb-rel').classList.toggle('active',m==='rel');
  renderSectorBars();
}

function toggleYear(yr){
  SB_YEARS[yr]=!SB_YEARS[yr];
  var anyOn=['2017','2018','2019','2020','2021','2022','2023','2024','2025','2026'].some(function(y){return SB_YEARS[y];});
  if(!anyOn){SB_YEARS[yr]=true;return;}
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
    html+='<span class="sb-secchip'+(SB_SECTORS[sec]?' active':'')+'" onclick="toggleSBSec(\''+sec+'\')">'+sec+'</span>';
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

function cls(r,b){return r==null?'neu':r>b?'pos':r>0?'neu':'neg';}

// Shared filter logic — applies year-based positive/beat-market filters to a stock array
function filterStocks(data, filters) {
  var yearCfg = [
    { yr: '26', field: 'r26', bench: SP500_B26 },
    { yr: '25', field: 'r25', bench: SP500_B25 },
    { yr: '24', field: 'r24', bench: SP500_B24 },
    { yr: '23', field: 'r23', bench: SP500_BMK['2023'] },
    { yr: '22', field: 'r22', bench: SP500_BMK['2022'] },
  ];
  yearCfg.forEach(function(cfg) {
    if (filters['p' + cfg.yr]) data = data.filter(function(s) { return s[cfg.field] != null && s[cfg.field] > 0; });
    if (filters['b' + cfg.yr]) data = data.filter(function(s) { return s[cfg.field] != null && s[cfg.field] > cfg.bench; });
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
  tblData = filterStocks(ALL_STOCKS.slice(), filters);
  renderTbl();
}

function clearFilters(){
  document.querySelectorAll('#fc-p26 input, #fc-b26 input, #fc-p25 input, #fc-b25 input, #fc-p24 input, #fc-b24 input, #fc-p23 input, #fc-b23 input, #fc-p22 input, #fc-b22 input').forEach(function(c){c.checked=false;c.parentElement.classList.remove('active');});
  tblData=ALL_STOCKS.slice();renderTbl();
}

function renderTbl(){
  var body=document.getElementById('sec-summary-body');if(!body)return;
  var SECTORS=['Technology','Consumer Discretionary','Communication Services','Consumer Staples','Financials','Health Care','Energy','Industrials','Materials','Utilities','Real Estate'];
  // Filter out excluded sectors
  SECTORS=SECTORS.filter(function(s){return !SS_EXCL[s];});
  // Helper: is a stock excluded by a Tech subsector filter?
  function isSubExcluded(s){
    if(s.s!=='Technology')return false;
    var b;
    if(s.i==='Semiconductors & Semiconductor Equipment')b='Semiconductors';
    else if(s.i==='Software & IT Services')b='Software';
    else b='Hardware';
    return SS_EXCL[b]===true;
  }
  var matchSet={};
  tblData.forEach(function(s){if(!SS_EXCL[s.s]&&!isSubExcluded(s))matchSet[s.t]=true;});
  var rows=[];
  var totMatch=0,totSec=0;
  SECTORS.forEach(function(sec){
    var all=ALL_STOCKS.filter(function(s){return s.s===sec&&!isSubExcluded(s);});
    var matched=all.filter(function(s){return matchSet[s.t];});
    var pct=all.length?(matched.length/all.length*100):0;
    rows.push({sec:sec,m:matched.length,tot:all.length,pct:pct,matched:matched,all:all});
    totMatch+=matched.length;totSec+=all.length;
  });
  rows.sort(function(a,b){return b.m-a.m;});
  // Helper for return formatting + color
  function fmtRet(v){if(v==null||isNaN(v))return '<span style="color:var(--mu)">&mdash;</span>';var c=v>=0?'var(--pos)':'var(--neg)';var sign=v>=0?'+':'';return '<span style="color:'+c+';font-weight:600">'+sign+v.toFixed(1)+'%</span>';}
  // Tech subsector remap
  function techBucket(industry){
    if(industry==='Semiconductors & Semiconductor Equipment') return 'Semiconductors';
    if(industry==='Software & IT Services') return 'Software';
    return 'Hardware';
  }
  // Tech subsector index returns (S&P 500 industry indices)
  var TECH_SUB_RETS={'Semiconductors':38.74,'Hardware':22.76,'Software':-13.95};
  // Tech subsector official S&P 500 counts
  var TECH_SUB_TOT={'Software':28,'Semiconductors':22,'Hardware':19};
  var html='';
  rows.forEach(function(r){var cc=SCOLS[r.sec]||'#888';
    var pctClr=r.pct>=70?'var(--pos)':r.pct>=40?'var(--text)':'var(--mu)';
    var caret=window.SEC_EXPANDED&&window.SEC_EXPANDED[r.sec]?'&#x25BC;':'&#x25B6;';
    var secRet=SECTOR_RETS[r.sec]?SECTOR_RETS[r.sec].r26:null;
    html+='<tr class="sec-row" data-sec="'+r.sec+'" onclick="toggleSecExp(\''+r.sec.replace(/\'/g,"\\'")+'\')" style="cursor:pointer">';
    html+='<td><span style="display:inline-block;width:13px;color:var(--mu);font-size:9px">'+caret+'</span><span class="sch" style="background:'+cc+'22;color:'+cc+';font-weight:600;margin-left:4px">'+r.sec+'</span></td>';
    html+='<td style="text-align:right;font-weight:700;font-size:14px;color:var(--navy)">'+r.m+'</td>';
    html+='<td style="text-align:right;font-weight:600;color:'+pctClr+'">'+r.pct.toFixed(0)+'%</td>';
    html+='<td style="text-align:right;color:var(--mu)">'+r.tot+'</td>';
    html+='<td style="text-align:right">'+fmtRet(secRet)+'</td>';
    html+='</tr>';
    if(window.SEC_EXPANDED&&window.SEC_EXPANDED[r.sec]){
      var isTech=(r.sec==='Technology');
      if(isTech){
        // Tech: keep the 3-subsector breakdown
        var indMap={};
        r.all.forEach(function(s){
          if(!s.i)return;
          var key=techBucket(s.i);
          if(!indMap[key])indMap[key]={all:[],matched:[]};
          indMap[key].all.push(s);
          if(matchSet[s.t])indMap[key].matched.push(s);
        });
        var indRows=Object.keys(indMap).map(function(ind){
          var d=indMap[ind];
          var avg=TECH_SUB_RETS[ind]!=null?TECH_SUB_RETS[ind]:null;
          var tot=TECH_SUB_TOT[ind]!=null?TECH_SUB_TOT[ind]:d.all.length;
          var pct=tot?(d.matched.length/tot*100):0;
          return{ind:ind,m:d.matched.length,tot:tot,pct:pct,avg:avg};
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
            var coName=COMPANY_NAMES[co.t]||((co.n&&co.n!==co.t)?co.n:co.t);
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
  html+='<td style="text-align:right">'+fmtRet(SP500_B26)+'</td>';
  html+='</tr>';
  body.innerHTML=html;
}

function toggleSecExp(sec){
  if(!window.SEC_EXPANDED)window.SEC_EXPANDED={};
  window.SEC_EXPANDED[sec]=!window.SEC_EXPANDED[sec];
  renderTbl();
}

function applyFilters2(){
  var filters = readCheckboxFilters('fc2', ['26','25','24']);
  var sec=safeVal('sec-flt2'),ind=safeVal('ind-flt2');
  var data = filterStocks(ALL_STOCKS.slice(), filters);
  if(sec) data=data.filter(function(s){return s.s===sec;});
  if(ind) data=data.filter(function(s){return s.i===ind;});
  tblData2=data;renderTbl2();
}

function clearFilters2(){
  document.querySelectorAll('#fc2-p26 input, #fc2-b26 input, #fc2-p25 input, #fc2-b25 input, #fc2-p24 input, #fc2-b24 input').forEach(function(c){c.checked=false;c.parentElement.classList.remove('active');});
  var sf=document.getElementById('sec-flt2');if(sf)sf.value='';
  fillInd('ind-flt2','');
  tblData2=ALL_STOCKS.slice();renderTbl2();
}

function sortTbl2(col){
  if(sortCol2===col){sortAsc2=!sortAsc2;}else{sortCol2=col;sortAsc2=(col<=2);}
  document.querySelectorAll('#main-tbl2 th').forEach(function(th,i){th.classList.toggle('srt',i===col);var a=th.querySelector('.sa');if(a)a.innerHTML=i===col?(sortAsc2?'&#x25B2;':'&#x25BC;'):'&#x25BC;';});
  tblData2=tblData2.slice().sort(function(a,b){
    var va,vb;
    if(col===0){va=a.t;vb=b.t;}else if(col===1){va=a.s||'';vb=b.s||'';}else if(col===2){va=a.i||'';vb=b.i||'';}
    else if(col===3){va=a.r22!=null?a.r22:-999;vb=b.r22!=null?b.r22:-999;}
    else if(col===4){va=a.r23!=null?a.r23:-999;vb=b.r23!=null?b.r23:-999;}
    else if(col===5){va=a.r24!=null?a.r24:-999;vb=b.r24!=null?b.r24:-999;}
    else if(col===6){va=a.r25!=null?a.r25:-999;vb=b.r25!=null?b.r25:-999;}
    else if(col===7){va=a.r26!=null?a.r26:-999;vb=b.r26!=null?b.r26:-999;}
    else{va=a.c3!=null?a.c3:-999;vb=b.c3!=null?b.c3:-999;}
    if(typeof va==='string') return sortAsc2?va.localeCompare(vb):vb.localeCompare(va);
    return sortAsc2?va-vb:vb-va;
  });
  renderTbl2();
}

function renderTbl2(){
  var body=document.getElementById('tbl-body2'),cnt=document.getElementById('tbl-cnt2');if(!body)return;
  if(cnt)cnt.innerHTML='<strong>'+tblData2.length+'</strong> <span>companies shown</span>';
  var shown=tblData2.slice(0,250),rows='';
  for(var i=0;i<shown.length;i++){
    var s=shown[i],cc=SCOLS[s.s]||'#888';
    var bd22=s.r22!=null&&s.r22>SP500_BMK['2022']?'<span class="bdt"></span>':'';
    var bd23=s.r23!=null&&s.r23>SP500_BMK['2023']?'<span class="bdt"></span>':'';
    var bd24=s.r24!=null&&s.r24>SP500_B24?'<span class="bdt"></span>':'';
    var bd25=s.r25!=null&&s.r25>SP500_B25?'<span class="bdt"></span>':'';
    var bd26=s.r26!=null&&s.r26>SP500_B26?'<span class="bdt"></span>':'';
    var tipName=(s.n&&s.n!==s.t)?s.n:(s.i||s.t);
    var cumCls=s.c3==null?'neu':s.c3>100?'pos':s.c3>0?'neu':'neg';
    rows+='<tr>';
    rows+='<td><span class="tkr" title="'+tipName+'">'+s.t+'</span></td>';
    rows+='<td><span class="sch" style="background:'+cc+'22;color:'+cc+'">'+s.s+'</span></td>';
    rows+='<td style="font-size:11px;color:var(--mu);max-width:130px;overflow:hidden;text-overflow:ellipsis" title="'+s.i+'">'+s.i+'</td>';
    rows+='<td class="'+cls(s.r22,SP500_BMK['2022'])+'">'+fmt(s.r22)+bd22+'</td>';
    rows+='<td class="'+cls(s.r23,SP500_BMK['2023'])+'">'+fmt(s.r23)+bd23+'</td>';
    rows+='<td class="'+cls(s.r24,SP500_B24)+'">'+fmt(s.r24)+bd24+'</td>';
    rows+='<td class="'+cls(s.r25,SP500_B25)+'">'+fmt(s.r25)+bd25+'</td>';
    rows+='<td class="'+cls(s.r26,SP500_B26)+'">'+fmt(s.r26)+bd26+'</td>';
    rows+='<td class="'+cumCls+'" style="font-weight:600">'+fmt(s.c3)+'</td>';
    rows+='</tr>';
  }
  if(tblData2.length>250)rows+='<tr><td colspan="9" style="text-align:center;padding:11px;color:var(--mu);font-size:11px">First 250 of '+tblData2.length+'. Apply filters to narrow.</td></tr>';
  body.innerHTML=rows;
}

function renderScatter(){
  var canvas=document.getElementById('scat-c');if(!canvas)return;
  var sec=safeVal('scat-sec'),ind=safeVal('scat-ind');
  var data=ALL_STOCKS.filter(function(d){
    return d.r25!=null&&d.r26!=null&&(!sec||d.s===sec)&&(!ind||d.i===ind);
  });
  if(scatChart){scatChart.destroy();scatChart=null;}
  // Quadrant counts
  var q1=0,q2=0,q3=0,q4=0;
  data.forEach(function(d){
    if(d.r25>SP500_B25&&d.r26>SP500_B26)q1++;
    else if(d.r25<=SP500_B25&&d.r26>SP500_B26)q2++;
    else if(d.r25<=SP500_B25&&d.r26<=SP500_B26)q3++;
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
    var xl=sx.getPixelForValue(SP500_B25);
    if(xl>=ca.left&&xl<=ca.right){ctx.save();ctx.strokeStyle='rgba(74,127,181,0.75)';ctx.lineWidth=1.5;ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(xl,ca.top);ctx.lineTo(xl,ca.bottom);ctx.stroke();ctx.fillStyle='rgba(74,127,181,.9)';ctx.font='bold 10px Inter,sans-serif';ctx.fillText('S&P 2025 +15.7%',xl+4,ca.top+13);ctx.restore();}
    var yl=sy.getPixelForValue(SP500_B26);
    if(yl>=ca.top&&yl<=ca.bottom){ctx.save();ctx.strokeStyle='rgba(23,122,78,0.75)';ctx.lineWidth=1.5;ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(ca.left,yl);ctx.lineTo(ca.right,yl);ctx.stroke();ctx.fillStyle='rgba(23,122,78,.9)';ctx.font='bold 10px Inter,sans-serif';ctx.fillText('S&P 2026 +7.6%',ca.left+4,yl-4);ctx.restore();}
  }};
  var ds=[];
  sects.forEach(function(sec2){
    var pts=data.filter(function(d){return d.s===sec2;}).map(function(d){return{x:Math.max(-80,Math.min(200,d.r25)),y:Math.max(-80,Math.min(250,d.r26)),t:d.t,n:d.n||d.t,s:d.s,i:d.i,r25:d.r25,r26:d.r26};});
    ds.push({label:sec2,data:pts,backgroundColor:(SCOLS[sec2]||'#888')+'BB',pointRadius:5,pointHoverRadius:8});
  });
  scatChart=new Chart(canvas,{type:'scatter',data:{datasets:ds},options:{responsive:true,maintainAspectRatio:false,
    plugins:{legend:{display:false},tooltip:{backgroundColor:'rgba(17,30,51,.95)',callbacks:{title:function(c){return c[0].raw.t+' \u2014 '+c[0].raw.n;},label:function(c){return[c.raw.s+' | '+c.raw.i,'2025: '+(c.raw.r25>0?"+":"-")+Math.abs(c.raw.r25).toFixed(1)+'%','2026: '+(c.raw.r26>0?"+":"-")+Math.abs(c.raw.r26).toFixed(1)+'%'];}}}},
    scales:{x:{title:{display:true,text:'2025 Return (%)',color:'#5A6E83',font:{size:11}},grid:{color:'#E8EFF7'},ticks:{color:'#5A6E83',font:{size:10},callback:function(v){return v+'%';}}},y:{title:{display:true,text:'2026 YTD Return (%)',color:'#5A6E83',font:{size:11}},grid:{color:'#E8EFF7'},ticks:{color:'#5A6E83',font:{size:10},callback:function(v){return v+'%';}}}}},plugins:[shadPlugin]});
  var legEl=document.getElementById('scleg');
  if(legEl){var lh='';Object.keys(SCOLS).forEach(function(s){lh+='<span class="scli"><span class="scdt" style="background:'+SCOLS[s]+'"></span>'+s+'</span>';});legEl.innerHTML=lh;}
}

function doSearch(val){
  var res=document.getElementById('sr-res');if(!val){res.style.display='none';return;}
  var q=val.toUpperCase(),matches=[];
  ALL_STOCKS.forEach(function(s){if(matches.length<12&&(s.t.indexOf(q)===0||s.t.indexOf(q)>=0))matches.push(s);});
  if(!matches.length){res.style.display='none';return;}
  var html='';
  matches.forEach(function(s){var clr=s.r26==null?'var(--mu)':s.r26>=0?'var(--pos)':'var(--neg)';
    html+='<div class="srrow" data-tk="'+s.t+'"><span><span class="srtk">'+s.t+'</span><span class="srsec">'+s.s+'</span></span><span style="font-weight:600;color:'+clr+'">'+fmt(s.r26)+'</span></div>';});
  res.innerHTML=html;res.style.display='block';
}

function closeSrch(){var r=document.getElementById('sr-res');if(r)r.style.display='none';}

function showDetail(ticker){
  closeSrch();var inp=document.getElementById('sr-inp');if(inp)inp.value=ticker;
  var s=ALL_STOCKS.find(function(x){return x.t===ticker;});if(!s)return;
  var cum=s.c3;var cb=cum!=null&&cum>SP500_CUM3;
  function bs(r,b){return r!=null&&r>b?'<span style="color:var(--pos);font-weight:600">&#x2705; Beat</span>':'<span style="color:var(--mu)">&#x274C;</span>';}
  function cd(yr,r,bench){var c=r==null?'var(--mu)':r>0?'var(--pos)':'var(--neg)';return '<div style="background:var(--w);border:.5px solid var(--bdr);border-radius:8px;padding:10px;text-align:center"><div style="font-size:10px;color:var(--mu);text-transform:uppercase;letter-spacing:.8px;margin-bottom:3px">'+yr+'</div><div style="font-size:16px;font-weight:600;color:'+c+'">'+fmt(r)+'</div><div style="font-size:10px;margin-top:3px">'+bs(r,bench)+'</div></div>';}
  var cumBg=cb?'#E6F3EC':'var(--w)',cumBrd=cb?'1px solid #B3D9C3':'.5px solid var(--bdr)';
  var html='<div style="display:flex;align-items:center;gap:10px;margin-bottom:11px"><span style="font-family:Inter,serif;font-size:21px;font-weight:600;color:var(--navy)">'+s.t+'</span><span style="font-size:11px;color:var(--mu)">'+(s.n||s.t)+' &middot; '+s.s+'</span></div>';
  html+='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:9px">';
  html+=cd('2022',s.r22,SP500_BMK['2022'])+cd('2023',s.r23,SP500_BMK['2023'])+cd('2024',s.r24,SP500_B24)+cd('2025',s.r25,SP500_B25)+cd('2026 YTD',s.r26,SP500_B26);
  html+='<div style="background:'+cumBg+';border:'+cumBrd+';border-radius:8px;padding:10px;text-align:center"><div style="font-size:10px;color:var(--mu);text-transform:uppercase;letter-spacing:.8px;margin-bottom:3px">3yr Cumul.</div><div style="font-size:16px;font-weight:600;color:'+(cum==null?'var(--mu)':cum>0?'var(--pos)':'var(--neg)')+'">'+fmt(cum)+'</div><div style="font-size:10px;margin-top:3px;color:'+(cb?'var(--pos)':'var(--mu)')+'">'+( cum!=null?(cb?'&#x2705; Beats S&P':'vs S&P'):'N/A')+'</div></div>';
  html+='</div>';
  var det=document.getElementById('sr-det-c');if(det)det.innerHTML=html;
  var sd=document.getElementById('sr-det');if(sd)sd.style.display='block';
}

function renderRotTbl(){
  var body=document.getElementById('rot-body');if(!body)return;
  var rows=ALL_STOCKS.filter(function(d){return d.r25!=null&&d.r26!=null&&d.r25<0&&d.r26>SP500_B26;});
  rows.sort(function(a,b){return b.r26-a.r26;});rows=rows.slice(0,18);
  var html='';
  rows.forEach(function(d){var cb=d.c3!=null&&d.c3>SP500_CUM3;var cc=SCOLS[d.s]||'#888';
    html+='<tr><td><span class="tkr" title="'+(d.n||d.t)+'">'+d.t+'</span></td><td><span class="sch" style="background:'+cc+'22;color:'+cc+'">'+d.s+'</span></td>';
    html+='<td class="'+(d.r22!=null?(d.r22>0?'pos':'neg'):'neu')+'">'+fmt(d.r22)+'</td><td class="'+(d.r23!=null?(d.r23>0?'pos':'neg'):'neu')+'">'+fmt(d.r23)+'</td>';
    html+='<td class="'+(d.r24!=null?(d.r24>0?'pos':'neg'):'neu')+'">'+fmt(d.r24)+'</td><td class="neg">'+d.r25.toFixed(1)+'%</td><td class="pos">+'+d.r26.toFixed(1)+'%</td>';
    html+='<td>'+(d.c3!=null?'<span class="'+(d.c3>0?'cpos':'cneg')+'">'+fmt(d.c3)+'</span>':'&mdash;')+'</td><td>'+(d.c3!=null?(cb?'<span class="bful">&#x2705; Beats S&P</span>':'<span class="nbt">Lags S&P</span>'):'&mdash;')+'</td></tr>';
  });
  body.innerHTML=html;
}

function renderSectorBars(){
  var wrap=document.getElementById('sb-wrap');if(!wrap)return;
  var YL=['2017','2018','2019','2020','2021','2022','2023','2024','2025','2026'];
  var active=YL.filter(function(y){return SB_YEARS[y];});
  var sectors=Object.keys(SDATA).slice().sort(function(a,b){return SECTOR_RETS[b].r26-SECTOR_RETS[a].r26;}).filter(function(s){return SB_SECTORS[s];});
  function val(s,yr){var rr=SECTOR_RETS[s]['r'+yr.slice(2)];if(rr==null)return null;return SB_MODE==='abs'?rr:(rr-SP500_BMK[yr]);}
  if(SB_MODE!=='abs'){sectors.sort(function(a,b){return val(b,'2026')-val(a,'2026');});}
  var maxV=0;
  sectors.forEach(function(s){active.forEach(function(yr){var v=val(s,yr);if(v!=null&&Math.abs(v)>maxV)maxV=Math.abs(v);});});
  maxV=Math.max(maxV, SB_MODE==='abs'?30:15);
  var html='';
  sectors.forEach(function(s){var d=SDATA[s],k=d.key?' key':'';
    html+='<div class="sbr"><span class="sbn'+k+'">'+s+'</span><div class="sbbs">';
    active.forEach(function(yr){var v=val(s,yr);
      if(v==null){html+='<div class="sby"><span class="sbyl">'+yr+'</span><div class="sbtr-div"></div><span class="sbi" style="color:var(--mu);font-weight:600">n/a</span></div>';return;}
      var pct=Math.min(Math.abs(v)/maxV*50,50);var sign=v>=0?'+':'';var color=v>=0?'#1E3A5F':'#9B2A20';var left=v>=0?50:50-pct;
      html+='<div class="sby"><span class="sbyl">'+yr+'</span><div class="sbtr-div"><div class="sbfl-div" style="left:'+left+'%;width:'+pct+'%;background:'+color+'"></div></div><span class="sbi'+(yr==='2026'?k:'')+'" style="color:'+(v>=0?'var(--pos)':'var(--neg)')+';font-weight:600">'+sign+v.toFixed(1)+'%</span></div>';
    });
    html+='</div>'+(d.key?'<span class="sbtag">&#x2B06; ROTATION</span>':'<span style="min-width:68px"></span>')+'</div>';
  });
  wrap.innerHTML=html;
}

// Expose to window for inline onclick handlers
window.setSBMode = setSBMode;
window.toggleYear = toggleYear;
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
window.doSearch = doSearch;
window.closeSrch = closeSrch;
window.showDetail = showDetail;
window.toggleSecExp = toggleSecExp;

export function loadMarketAnalysisPage() {
  if (!ALL_STOCKS || !ALL_STOCKS.length) {
    var main = document.getElementById('tp-rot');
    if (main) main.innerHTML = '<div style="text-align:center;color:var(--neg);padding:34px;font-size:13px">Market data failed to load. Please refresh the page.</div>';
    return;
  }
  tblData = ALL_STOCKS.slice();
  tblData2 = ALL_STOCKS.slice();

  // Build industry map
  IMAP = {};
  for (var i = 0; i < ALL_STOCKS.length; i++) {
    var s = ALL_STOCKS[i];
    if (s.s && s.i) { if (!IMAP[s.s]) IMAP[s.s] = []; if (IMAP[s.s].indexOf(s.i) < 0) IMAP[s.s].push(s.i); }
  }
  for (var k in IMAP) IMAP[k].sort();

  // Sector returns from SPDR ETFs (actual market data)
  SECTOR_RETS = {
    "Industrials":{r17:21.62,r18:-15.73,r19:27.83,r20:8.12,r21:19.54,r22:-6.79,r23:16.07,r24:15.73,r25:17.59,r26:11.14},
    "Technology":{r17:32.24,r18:-3.99,r19:48.83,r20:42.08,r21:34.58,r22:-28.78,r23:54.68,r24:21.82,r25:22.8,r26:35.97},
    "Consumer Staples":{r17:10.02,r18:-11.11,r19:24.42,r20:6.45,r21:14.35,r22:-2.66,r23:-3.38,r24:8.8,r25:-0.88,r26:5.6},
    "Communication Services":{r17:null,r18:null,r19:29.86,r20:25.05,r21:17.67,r22:-39.08,r23:51.41,r24:33.68,r25:21.2,r26:-1.79},
    "Energy":{r17:-4.06,r18:-21.05,r19:4.65,r20:-35.98,r21:44.85,r22:58.0,r23:-4.15,r24:0.85,r25:5.76,r26:28.16},
    "Real Estate":{r17:7.12,r18:-6.07,r19:24.11,r20:-5.94,r21:43.13,r22:-28.57,r23:8.48,r24:0.72,r25:0,r26:7.24},
    "Materials":{r17:21.79,r18:-17.23,r19:21.7,r20:18.27,r21:25.1,r22:-13.89,r23:10.12,r24:-2.03,r25:8.23,r26:12.28},
    "Utilities":{r17:8.46,r18:0.28,r19:21.84,r20:-4.02,r21:15.46,r22:-1.16,r23:-10.17,r24:19.63,r25:12.7,r26:0.96},
    "Health Care":{r17:19.93,r18:3.11,r19:19.25,r20:10.43,r21:26.04,r22:-3.99,r23:0.39,r24:0.63,r25:12.8,r26:-4.5},
    "Financials":{r17:20.04,r18:-15.48,r19:30.06,r20:-5.08,r21:34.34,r22:-12.58,r23:9.94,r24:28.4,r25:13.44,r26:-6.1},
    "Consumer Discretionary":{r17:21.24,r18:-0.74,r19:27.85,r20:28.31,r21:27.53,r22:-36.97,r23:38.44,r24:26.42,r25:5.65,r26:-1.02}
  };

  // Initialize sector filter
  var allSecs = Object.keys(SECTOR_RETS).slice().sort(function(a, b) { return SECTOR_RETS[b].r26 - SECTOR_RETS[a].r26; });
  allSecs.forEach(function(s) { SB_SECTORS[s] = true; SS_EXCL[s] = false; });
  SS_EXCL['Semiconductors'] = false;
  SS_EXCL['Hardware'] = false;
  SS_EXCL['Software'] = false;

  renderSBSecChips();
  renderSSExclChips();
  renderSectorBars();
  renderTbl();
  renderTbl2();
  renderRotTbl();
  setTimeout(renderScatter, 120);

  // Search input
  var si = document.getElementById('sr-inp');
  if (si) {
    si.addEventListener('input', function() { doSearch(this.value); });
    si.addEventListener('blur', function() { setTimeout(closeSrch, 200); });
  }
}
