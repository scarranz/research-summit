// ═══════════════════════════════════════════════════════════════════════════════════════════════
//  Consensus Estimate Evolution — how the Street's forward estimate for a metric has been REVISED
//  over time, snapshot by snapshot (BBG_CONSENSUS.txt quarterly snapshots; §6a). Two lenses:
//
//    • FIXED  — one line per fiscal year, that year's estimate tracked across every snapshot (the
//               "revision trend"). A point turns solid once the year is REPORTED (estimate → actual).
//               HORIZON CAP: only fiscal years up to the still-open FY and the ONE next (open+1);
//               DEFAULT shows the latest 3 qualifying FYs — the FY pills add/drop the rest.
//    • ROLLING — next-twelve-months. For revenue / op income it overlays the 3 segments (AWS · North
//               America · International); any other metric draws its single NTM line. Summing metrics
//               = Σ next 4 forecast quarters; non-summing (shares) = the 4-quarters-out point.
//
//  Snapshots are QUARTERLY, so lines step between print dates (consistent with the source). Metric
//  data (AMZN, 15 metrics, grouped headline / seg_rev / seg_oi) lives in consensus-evolution-data.js.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
import { CONSENSUS_EVO } from './consensus-evolution-data.js';

// The 3-segment overlays used by Rolling for the two segmented families.
var SEG = { seg_rev:['aws_rev','na_rev','intl_rev'], seg_oi:['aws_oi','na_oi','intl_oi'] };
function rollingKeys(d, mkey){
  var g=(d.metrics[mkey]||{}).group;
  if(mkey==='rev'   || g==='seg_rev') return SEG.seg_rev;
  if(mkey==='opinc' || g==='seg_oi')  return SEG.seg_oi;
  return [mkey];
}
// Dropdown grouping (order shown).
var GROUPS = [ ['headline','Headline'], ['seg_rev','Revenue by segment'], ['seg_oi','Op income by segment'] ];

var FY_COLORS  = { 2023:'#B4BECC', 2024:'#64748B', 2025:'#2563EB', 2026:'#F97316', 2027:'#7C3AED', 2028:'#059669', 2029:'#DB2777', 2030:'#0891B2' };
var SEG_COLORS = { aws_rev:'#F97316', na_rev:'#2563EB', intl_rev:'#059669', aws_oi:'#F97316', na_oi:'#2563EB', intl_oi:'#059669' };
var SEG_SHORT  = { aws_rev:'AWS', na_rev:'North America', intl_rev:'International', aws_oi:'AWS', na_oi:'North America', intl_oi:'International' };
var DEFAULT_FY = 3;

function fmtAsof(d){ var M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; var p=d.split('-'); return M[+p[1]-1]+" '"+p[0].slice(2); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

// Fiscal-year horizon cap: the smallest still-forecast FY in the LATEST snapshot is the open year;
// we allow up to open+1. Returns { cap, qualifying:[fy…] }.
function fyHorizon(m){
  var open=Infinity;
  Object.keys(m.fixed).forEach(function(fy){
    var kinds=m.fixedKind[fy], vals=m.fixed[fy];
    for(var i=kinds.length-1;i>=0;i--){ if(vals[i]!=null){ if(kinds[i]==='E' && +fy<open) open=+fy; break; } }
  });
  if(open===Infinity) open=Math.max.apply(null,Object.keys(m.fixed).map(Number));
  var cap=open+1;
  return { cap:cap, qualifying:Object.keys(m.fixed).map(Number).filter(function(fy){ return fy<=cap; }).sort(function(a,b){ return a-b; }) };
}

// ── Markup ───────────────────────────────────────────────────────────────────────────────────────
export function consensusEvoHtml(ticker, metric){
  ticker=ticker||'AMZN'; metric=metric||'rev';
  var d=CONSENSUS_EVO[ticker]||{}, ms=d.metrics||{};
  var opts=GROUPS.map(function(g){
    var inner=Object.keys(ms).filter(function(k){ return ms[k].group===g[0]; })
      .map(function(k){ return '<option value="'+k+'"'+(k===metric?' selected':'')+'>'+esc(ms[k].short||ms[k].label)+'</option>'; }).join('');
    return inner?'<optgroup label="'+esc(g[1])+'">'+inner+'</optgroup>':'';
  }).join('');
  return '<style>'+
    '.cev{font-family:Inter,system-ui,sans-serif}'+
    '.cev-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 14px;margin:0 0 6px}'+
    '.cev-l{display:flex;align-items:center;gap:10px;flex-wrap:wrap}'+
    '.cev-title{font-size:15px;font-weight:800;color:var(--navy,#1F2A44);letter-spacing:.01em}'+
    '.cev-title span{color:var(--mu,#6B7684);font-weight:600;font-size:12px}'+
    '.cev-sel{font-family:inherit;font-size:12px;font-weight:700;color:var(--navy,#1F2A44);background:#fff;border:1px solid var(--bdr,#E2E8F0);border-radius:8px;padding:6px 10px;cursor:pointer}'+
    '.cev-seg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr,#E2E8F0);border-radius:999px;padding:3px}'+
    '.cev-seg button{background:none;border:none;font-family:inherit;font-size:12px;font-weight:700;letter-spacing:.03em;color:var(--mu,#6B7684);padding:6px 15px;border-radius:999px;cursor:pointer;transition:.15s}'+
    '.cev-seg button.active{background:#1F2A44;color:#fff}'+
    '.cev-fys{display:flex;flex-wrap:wrap;gap:6px;margin:2px 0 8px}'+
    '.cev-fys button{font-family:inherit;font-size:11px;font-weight:800;letter-spacing:.02em;border:1px solid var(--bdr,#E2E8F0);background:#fff;color:var(--mu,#6B7684);border-radius:999px;padding:4px 11px;cursor:pointer;transition:.13s}'+
    '.cev-canvas-wrap{position:relative;height:330px}'+
    '.cev-sub{font-size:11.5px;color:var(--mu,#6B7684);font-weight:600;margin:8px 0 0}.cev-sub b{color:var(--navy,#1F2A44)}'+
  '</style>'+
  '<div class="cev" data-cev="'+ticker+':'+metric+'">'+
    '<div class="cev-head">'+
      '<div class="cev-l">'+
        '<span class="cev-title">Consensus Evolution <span>— Street revisions across BBG snapshots</span></span>'+
        '<select class="cev-sel" data-cevmetric>'+opts+'</select>'+
      '</div>'+
      '<div class="cev-seg">'+
        '<button type="button" class="active" data-cevmode="fixed">Fixed FY</button>'+
        '<button type="button" data-cevmode="rolling">Rolling NTM</button>'+
      '</div>'+
    '</div>'+
    '<div class="cev-fys" data-cevfys></div>'+
    '<div class="cev-canvas-wrap"><canvas class="cev-canvas"></canvas></div>'+
    '<div class="cev-sub" data-cevsub></div>'+
  '</div>';
}

// ── Chart ────────────────────────────────────────────────────────────────────────────────────────
export function consensusEvoInit(root, ticker, metric){
  ticker=ticker||'AMZN'; metric=metric||'rev';
  var host=root.querySelector('.cev'); if(!host||typeof Chart==='undefined') return;
  var d=CONSENSUS_EVO[ticker]; if(!d) return;
  var labels=d.asof.map(fmtAsof);
  var canvas=host.querySelector('.cev-canvas'), sub=host.querySelector('[data-cevsub]'),
      fysBar=host.querySelector('[data-cevfys]'), sel=host.querySelector('[data-cevmetric]');
  var chart=null, mode='fixed', mkey=metric, onFY={};

  function toV(m,v){ return v==null?null:+(v/(m.scale||1)).toFixed(m.scale===1?2:1); }
  function unitTip(m,y){ if(m.unit==='$') return '$'+y; if(m.unit==='$B') return '$'+y+'B'; return y+' '+m.unit; }

  function resetFYs(){
    var m=d.metrics[mkey], q=fyHorizon(m).qualifying;
    onFY={}; q.forEach(function(fy,i){ onFY[fy]=(i>=q.length-DEFAULT_FY); });
    fysBar.innerHTML=q.map(function(fy){ return '<button type="button" data-fy="'+fy+'">FY'+fy+'</button>'; }).join('');
    fysBar.querySelectorAll('[data-fy]').forEach(function(b){
      var fy=b.getAttribute('data-fy');
      function paint(){ var on=onFY[fy]; b.style.background=on?(FY_COLORS[fy]||'#334155'):'#fff'; b.style.color=on?'#fff':'var(--mu,#6B7684)'; b.style.borderColor=on?(FY_COLORS[fy]||'#334155'):'var(--bdr,#E2E8F0)'; }
      paint(); b.onclick=function(){ onFY[fy]=!onFY[fy]; paint(); build(); };
    });
  }

  function fixedSets(){
    var m=d.metrics[mkey];
    return Object.keys(m.fixed).filter(function(fy){ return onFY[fy]; }).map(function(fy){
      var kinds=m.fixedKind[fy];
      return { label:'FY'+fy, data:m.fixed[fy].map(function(v){ return toV(m,v); }), borderColor:FY_COLORS[fy]||'#888',
        backgroundColor:FY_COLORS[fy]||'#888', borderWidth:2, tension:.25, spanGaps:false,
        pointRadius:function(c){ return kinds[c.dataIndex]==='A'?4.5:2.6; },
        pointStyle:function(c){ return kinds[c.dataIndex]==='A'?'rectRot':'circle'; },
        pointBorderColor:'#fff', pointBorderWidth:function(c){ return kinds[c.dataIndex]==='A'?1.5:0; } };
    });
  }
  function rollingSets(){
    var keys=rollingKeys(d, mkey), single=(keys.length===1);
    return keys.map(function(k){ var m=d.metrics[k];
      return { label: single?(m.label+' · NTM'):SEG_SHORT[k], data:m.rolling.map(function(v){ return toV(m,v); }),
        borderColor:single?'#FF9900':(SEG_COLORS[k]||'#888'), backgroundColor:single?'rgba(255,153,0,.12)':(SEG_COLORS[k]||'#888'),
        borderWidth:2.4, tension:.25, fill:single, pointRadius:3.1, pointStyle:'circle', pointBorderColor:'#fff', pointBorderWidth:1.3 }; });
  }

  function build(){
    var m=d.metrics[mkey], multi=(mode==='fixed');
    if(chart) chart.destroy();
    chart=new Chart(canvas.getContext('2d'),{ type:'line',
      data:{ labels:labels, datasets: multi?fixedSets():rollingSets() },
      options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'nearest', intersect:false },
        plugins:{
          legend:{ display:true, position:'bottom', labels:{ font:{ family:'Inter', size:11, weight:'600' }, color:'#475569', boxWidth:14, usePointStyle:true, pointStyle:'line' } },
          tooltip:{ callbacks:{ label:function(c){ return c.dataset.label+': '+unitTip(m,c.parsed.y); } } } },
        scales:{ x:{ grid:{ display:false }, ticks:{ font:{ family:'Inter', size:10.5 }, color:'#94A3B8' } },
          y:{ grid:{ color:'rgba(148,163,184,.18)' }, ticks:{ font:{ family:'Inter', size:10.5 }, color:'#94A3B8', callback:function(v){ return unitTip(m,v); } } } } }
    });
    fysBar.style.display=multi?'':'none';
    var seg=(rollingKeys(d,mkey).length>1);
    sub.innerHTML = multi
      ? 'Each line is <b>one fiscal year</b>, revised across quarterly Bloomberg snapshots. Capped at the open year and the next (<b>≤ FY'+fyHorizon(m).cap+'</b>); newest '+DEFAULT_FY+' shown by default — tap the FY pills to add or drop years. A <b>solid</b> point = the year is reported.'
      : ((seg?'Three <b>NTM</b> segment lines (AWS · North America · International)':'A single <b>next-twelve-months</b> line')+' — '+(m.sums?'Σ of the next four forecast quarters':'the four-quarters-out estimate')+' as of each snapshot, rolling forward on its own.');
  }

  sel.onchange=function(){ mkey=sel.value; resetFYs(); build(); };
  host.querySelectorAll('[data-cevmode]').forEach(function(btn){ btn.onclick=function(){
    mode=btn.getAttribute('data-cevmode');
    host.querySelectorAll('[data-cevmode]').forEach(function(b){ b.classList.toggle('active', b===btn); });
    build();
  }; });
  resetFYs(); build();
}

export var consensusEvo = { html: consensusEvoHtml, init: consensusEvoInit };
