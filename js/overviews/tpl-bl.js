// tpl-bl.js — Texas Pacific Land Deep Dive ▸ Bottom Line ▸ General (BL-GEN-1…5) and Segments (BL-SEG),
// docs/PROFILE_PLAYBOOK.md §13.
//
// COPIED from js/overviews/uber-bl.js (itself googl-bl.js → meta-bl.js → tsm-bl.js → the closure of amzn.js's
// aMarginsBody · aBridgeBody · aNetBridgeBody · aSbcBody · expenseTabsBody · aBuildMargins · aBuildExpenses), then adapted
// to TPL — the chart kit (brush zoom, scaffold, legend, slider, tables) is verbatim:
//   • data: ../results-data/tpl.js (reported quarters 1Q22–2Q26 and years 2021–2025, and the Bloomberg consensus
//     estMatrix — the latest vintage is the one drawn); ./tpl-bbg.js (Bloomberg export: forward total operating expenses,
//     pretax income, tax and diluted shares, which the estMatrix does not carry); ./tpl-bl-data.js for the reported
//     expense lines (10-K / 10-Q via SEC XBRL), segment results (Note 16), SBC by line, other income and the dives.
//   • NO Summit series anywhere: there is no Summit DCF model for TPL (rule 10). Sources drawn = Actual and Consensus.
//   • expense lines = TPL's five, BY NATURE (10-K): salaries and related employee expenses · water service-related
//     expenses · general and administrative expenses · depreciation, depletion and amortization · ad valorem and other
//     taxes. TPL reports no cost of revenue and no gross profit, so the bridge has no gross-profit subtotal and nothing
//     is relabelled as COGS (playbook "COGS first" rule: not applicable, said in the note).
//   • units: US$ million everywhere (TPL is small; never $B with tiny decimals).
//   • Normalized net income: not offered. Other income is mostly interest on cash (recurring); the one-offs inside it are
//     immaterial (2024 pension gain $4.6M). Said in the caption.
//   • Bloomberg's Nov 3, 2026 snapshot carries FY2028 operating income of −$65.5M against ~$1.2B of revenue (a bad
//     cell): a consensus operating income that is negative while revenue is above $1B is treated as missing and
//     footnoted (cleanOI); the forward bridges stop at the last year with a valid operating income.
//   • Annex A fixed in the copy: years and labels derived from the data; shares axis on the right; no inline <style>
//     (styles in css/overview.css under the BL selector lists, widened to .ov-tpl-dd); no hex colours (Summit tokens);
//     DOM lookups scoped to the TPL root.
import { SUMMIT_CAT, SUMMIT_INK, SUMMIT_MUTE, SUMMIT_POS, SUMMIT_NEG, fade } from '../viz-palette.js';
import { tplBBG } from './tpl-bbg.js';
import { tplResults } from '../results-data/tpl.js';
import { TPL_OPEX_YEARS, TPL_OPEX, TPL_OPEXQ, TPL_OPEX_SRC, TPL_SBC_FN, TPL_SBC_FN_SRC, TPL_OTHINC, TPL_DILSH,
  TPL_SEG_Y, TPL_SEG_Q, TPL_SEG_SRC, TPL_SEG_TXT, TPL_EW_SRC, TPL_EW_LINES, TPL_SEG_DIVES } from './tpl-bl-data.js';

var INK=SUMMIT_INK, MUTE=SUMMIT_MUTE, POS=SUMMIT_POS, NEG=SUMMIT_NEG, ONEOFF=SUMMIT_CAT[3];
var GRID='rgba(0,0,0,0.06)';
// tpl-bbg.js keeps Bloomberg's field slugs. Alias the ones this code reads.
(function(is){ var AL={ rev:'totalRevenue', pretax:'preTaxIncome', da:'depreciationAmortization' };
  Object.keys(AL).forEach(function(k){ if(!is[k] && is[AL[k]]) is[k]=is[AL[k]]; }); })(tplBBG.is);
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
// ── DOM scope: everything is looked up inside the TPL Deep Dive root, never document-wide.
var _root=null;
function R(){ var r=_root||document; return (r.querySelector&&r.querySelector('.ov-tpl-dd'))||r; }
function $id(id){ return R().querySelector('#'+id); }
function aPane(){ return R().querySelector('.dd-pane[data-dd="bottomline"] .ovt-subpane[data-ovst="margins"]')||R().querySelector('.ovt-subpane[data-ovst="margins"]'); }
// Chart.js helpers (lazy: panes must be visible — offsetParent — before building).
var _aCharts={};
function aDestroy(id){ if(_aCharts[id]){ _aCharts[id].destroy(); _aCharts[id]=null; } }
function aChartReady(id){ var cv=$id(id); return (cv&&typeof Chart!=='undefined'&&cv.offsetParent)?cv:null; }
// ═══ Chart-standard kit (docs/CHART_ENGINE_REFERENCE.md §0.7) — copied verbatim from uber-bl.js ═══
function rsAttachBrush(el, chart, onX, onY, onReset){
  var wrap = el.parentElement;
  if (wrap && getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
  el.style.cursor = 'crosshair';
  el.onmousedown = function(ev){
    if (ev.button !== 0) return;
    var r0 = el.getBoundingClientRect(), w0 = wrap.getBoundingClientRect(), area = chart.chartArea;
    var onAxis = (ev.clientX - r0.left) < area.left || (ev.clientX - r0.left) > area.right;
    var forcedY = onAxis || !onX, vertical = forcedY ? true : null, startX = ev.clientX, startY = ev.clientY, box = null;
    function ensureBox(){ if (box) return; box = document.createElement('div'); box.className = 'rs-brush';
      if (vertical){ box.style.left = (r0.left - w0.left + area.left) + 'px'; box.style.width = (area.right - area.left) + 'px'; }
      else { box.style.top = (r0.top - w0.top) + 'px'; box.style.height = r0.height + 'px'; } wrap.appendChild(box); }
    function decide(cx, cy){ if (vertical != null) return; var dx = Math.abs(cx - startX), dy = Math.abs(cy - startY); if (Math.max(dx, dy) < 8) return; vertical = dy > dx; }
    function place(cx, cy){ if (vertical == null) return; ensureBox();
      if (vertical){ var a = Math.min(startY, cy), b = Math.max(startY, cy); box.style.top = (a - w0.top) + 'px'; box.style.height = (b - a) + 'px'; }
      else { var a2 = Math.min(startX, cx), b2 = Math.max(startX, cx); box.style.left = (a2 - w0.left) + 'px'; box.style.width = (b2 - a2) + 'px'; } }
    place(ev.clientX, ev.clientY);
    function onMove(e2){ decide(e2.clientX, e2.clientY); place(e2.clientX, e2.clientY); }
    function onUp(e2){ document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); decide(e2.clientX, e2.clientY); if (box) box.remove();
      if (vertical == null) return;
      if (vertical){ if (Math.abs(e2.clientY - startY) < 8) return;
        var v1 = chart.scales.y.getValueForPixel(Math.min(startY, e2.clientY) - r0.top), v2 = chart.scales.y.getValueForPixel(Math.max(startY, e2.clientY) - r0.top); onY(Math.min(v1, v2), Math.max(v1, v2)); }
      else { if (Math.abs(e2.clientX - startX) < 8) return;
        function idxAt(cx){ var v = chart.scales.x.getValueForPixel(cx - r0.left); return Math.max(0, Math.min(chart.data.labels.length - 1, Math.round(v))); }
        var a = idxAt(startX), b = idxAt(e2.clientX); if (a !== b) onX(Math.min(a, b), Math.max(a, b)); } }
    document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp); ev.preventDefault(); };
  el.ondblclick = onReset;
}
function aFnum(v){ if(v==null||v==='') return null; if(Array.isArray(v)) v=v[v.length-1]; if(typeof v!=='number') return String(v);
  var a=Math.abs(v), r=a<10?Math.round(v*100)/100:(a<1000?Math.round(v*10)/10:Math.round(v)); return r.toLocaleString('en-US'); }
// Auto-table from a chart's own data (rule 3), honouring hidden series (rule 2) and preserving open state.
function aBuildAutoTbl(id){
  var cv=$id(id), ch=_aCharts[id]; if(!cv||!ch) return;
  if($id(id+'-tbl')) return;   // chart supplies its own table
  var labels=(ch.data&&ch.data.labels)||[], ds=(ch.data&&ch.data.datasets)||[];
  if(!labels.length||!ds.length) return;
  var headers=['Series'].concat(labels.map(function(l){ return Array.isArray(l)?l.join(' '):String(l); }));
  var rows=[]; ds.forEach(function(d,i){ var meta=ch.getDatasetMeta?ch.getDatasetMeta(i):null; if(meta&&meta.hidden) return;   // rule 2: hidden series leaves the table
    rows.push([d.label||'series'].concat((d.data||[]).map(aFnum))); });
  var wrap=cv.parentElement, host=wrap&&wrap.parentNode; if(!host) return;
  var prev=wrap.nextElementSibling, wasOpen=false;
  if(prev&&prev.getAttribute&&prev.getAttribute('data-rstblhost')===id){ var ob=prev.querySelector('.rs-collap-b'); wasOpen=!!(ob&&!ob.hidden); host.removeChild(prev); }
  var div=document.createElement('div'); div.setAttribute('data-rstblhost',id); div.className='me-bl-tblhost';
  div.innerHTML=aTbl(id,'Data — what the chart draws',headers,rows);
  if(wasOpen){ var nb=div.querySelector('.rs-collap-b'); if(nb) nb.hidden=false; var ic=div.querySelector('.rs-collap-ic'); if(ic) ic.textContent='▾'; }
  host.insertBefore(div, wrap.nextSibling);
}
// Collapsible SECTION. data-selfwired + data-mebl: this module toggles its own headers (§23), so a global
// .rs-collap-h handler in the profile skips them and nothing flips twice.
function aCollap(title, inner, open){
  return '<div class="rs-collap me-bl-collap"><button type="button" class="rs-collap-h" data-selfwired="1" data-mebl="1">'+
    '<span class="rs-collap-ic">'+(open?'▾':'▸')+'</span> '+esc(title)+'</button>'+
    '<div class="rs-collap-b me-bl-collapb"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}
// ═══ SAB-parity chart scaffold — row1 title + metric dropdown; row2 mode pills · Range presets; legend chips; chart;
// period slider; collapsible table. A chart registers derive(state) → {labels,lastAct,series:[…],yFmt,note}. ═══
var ASTD_ACT='rgba(30,39,51,0.92)', ASTD_CONS='rgba(124,134,148,0.85)';
function aFadeC(c,a){ return fade(c,a); }
var _aStd={}, _aStdDerive={};
function aStdScaffold(cfg){
  var id=cfg.id;
  var st=_aStd[id]||(_aStd[id]={win:null,hidden:{},sel:null,modes:{}});
  if(cfg.metricSel && st.sel==null){ var on=cfg.metricSel.filter(function(o){return o.on;})[0]||cfg.metricSel[0]; st.sel=on.v; }
  (cfg.modes||[]).forEach(function(g){ if(st.modes[g.cls]==null){ var d=g.opts.filter(function(o){return o.on;})[0]||g.opts[0]; st.modes[g.cls]=d.v; } });
  // Metric dropdown grouped by family (§0.2 rule 4): options carrying `group` render inside an <optgroup>.
  function optH(o){ return '<option value="'+esc(o.v)+'"'+(o.v===st.sel?' selected':'')+'>'+esc(o.label)+'</option>'; }
  var selBody='', grpOpen=null;
  (cfg.metricSel||[]).forEach(function(o){ var g=o.group||null;
    if(g!==grpOpen){ if(grpOpen) selBody+='</optgroup>'; if(g) selBody+='<optgroup label="'+esc(g)+'">'; grpOpen=g; }
    selBody+=optH(o); });
  if(grpOpen) selBody+='</optgroup>';
  var sel=cfg.metricSel? '<select class="rs-msel" data-astdsel="'+id+'">'+selBody+'</select>':'';
  var top=(cfg.title||sel)?'<div class="rs-block-top"><div class="rs-block-h">'+esc(cfg.title||'')+'</div>'+sel+'</div>':'';
  var modes=(cfg.modes||[]).map(function(g){ return '<div class="astd-modeg me-bl-modeg" data-astdmodeg="'+id+'|'+g.cls+'">'+(g.label?'<span class="rs-quick-l">'+esc(g.label)+'</span>':'')+'<div class="rs-views">'+g.opts.map(function(o){ return '<button type="button" class="rs-view'+(o.v===st.modes[g.cls]?' active':'')+'" data-astdmode="'+id+'|'+g.cls+'|'+o.v+'">'+esc(o.label)+'</button>'; }).join('')+'</div></div>'; }).join('');
  var presets=cfg.presets||[['all','All'],['rep','Reported'],['fwd','Forward']];
  var quick='<div class="rs-quick"><span class="rs-quick-l">Range</span>'+presets.map(function(p){ return '<button type="button" class="rs-preset" data-astdrange="'+id+'|'+p[0]+'">'+esc(p[1])+'</button>'; }).join('')+'</div>';
  var row2='<div class="rs-block-modes"><div class="rs-modes">'+modes+'</div>'+quick+'</div>';
  var leg='<div class="ave-leg" data-astdleg="'+id+'"></div>';
  var chart='<div class="ov-chart-card"><div class="ov-chart-wrap ovs-tall me-bl-h'+(cfg.height||320)+'"><canvas id="astd-'+id+'"></canvas></div></div>';
  var slider='<div class="sg-controls"><div class="sg-slider"><div class="sg-track"><div class="sg-fill" data-astdfill="'+id+'"></div></div><div class="rs-ticks" data-astdticks="'+id+'"></div>'+
    '<input type="range" class="astd-r0" min="0" max="1" value="0" step="1" aria-label="Start period">'+
    '<input type="range" class="astd-r1" min="0" max="1" value="1" step="1" aria-label="End period"></div>'+
    '<div class="sg-ends"><span data-astdend0="'+id+'"></span><span data-astdend1="'+id+'"></span></div></div>';
  var tbl='<div class="rs-collap me-bl-tblhost"><button type="button" class="rs-collap-h" data-selfwired="1" data-mebl="1"><span class="rs-collap-ic">▸</span> '+esc(cfg.tblTitle||'Data — what the chart draws')+' <span class="rs-collap-sub" data-astdtblsub="'+id+'"></span></button>'+
    '<div class="rs-collap-b" hidden><div class="rs-tablewrap" data-astdtbl="'+id+'"></div></div></div>';
  return '<div class="'+(cfg.bare?'me-bl-bare':'ov-sec')+'" data-astdblock="'+id+'">'+top+row2+leg+chart+slider+tbl+'</div>';
}
function aStdBlk(id){ return R().querySelector('[data-astdblock="'+id+'"]'); }
function aStdRender(id, derive){
  if(derive) _aStdDerive[id]=derive; derive=_aStdDerive[id]; if(!derive) return;
  var cv=aChartReady('astd-'+id); if(!cv) return;
  var st=_aStd[id]||(_aStd[id]={win:null,hidden:{},sel:null,modes:{}});
  var spec=derive(st); if(!spec) return;
  var n=spec.labels.length; if(!st.win || st.win[1]>n-1 || st.win[0]>st.win[1]) st.win=[0,n-1];
  var lo=st.win[0], hi=st.win[1], la=spec.lastAct==null?n-1:spec.lastAct;
  var labels=spec.labels.slice(lo,hi+1), yFmt=spec.yFmt||function(v){return v;};
  aDestroy('astd-'+id);
  var stk=spec.stacked?'s':undefined, needY2=false;   // engine supports bars + a secondary right axis (SAB dual-axis)
  var ds=spec.series.filter(function(s){ return !st.hidden[s.k]; }).map(function(s){
    var t=s.type||spec.type||'line'; if(s.yAxisID==='y2') needY2=true;
    if(t==='bar') return { type:'bar', label:s.label, data:s.data.slice(lo,hi+1), backgroundColor:s.data.slice(lo,hi+1).map(function(_,i){ return (lo+i)>la?aFadeC(s.color,0.5):s.color; }), borderColor:'white', borderWidth:1, maxBarThickness:34, stack:stk, yAxisID:s.yAxisID||'y', order:s.order||3 };
    return { type:'line', label:s.label, data:s.data.slice(lo,hi+1), borderColor:s.color, backgroundColor:s.color, borderWidth:2.2, pointRadius:2, tension:0.2, spanGaps:false, yAxisID:s.yAxisID||'y', order:s.order||2, stack:s.stack,
      borderDash:s.dash?[5,4]:undefined, segment: s.fwdDash?{ borderDash:function(ctx){ return (lo+ctx.p1DataIndex)>la?[5,4]:undefined; } }:undefined }; });
  var anyBar=spec.series.some(function(s){ return (s.type||spec.type)==='bar'; }), y2f=spec.y2Fmt||function(v){return v;};
  var scales={ x:{ stacked:anyBar&&spec.stacked, grid:{ display:false }, ticks:{ font:{ size:11 } } },
    y:{ stacked:anyBar&&spec.stacked, position:'right', min:st.yr?st.yr[0]:spec.yMin, max:st.yr?st.yr[1]:spec.yMax, grid:{ color:GRID }, ticks:{ font:{ size:11 }, callback:function(v){ return yFmt(v); } } } };
  if(needY2) scales.y2={ position:'right', weight:1, grid:{ display:false }, ticks:{ font:{ size:11 }, callback:function(v){ return y2f(v); } } };
  _aCharts['astd-'+id]=new Chart(cv.getContext('2d'),{ type:anyBar?'bar':'line', data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(c){ var f=c.dataset.yAxisID==='y2'?y2f:yFmt; return c.dataset.label+': '+(c.parsed.y==null?'—':f(c.parsed.y))+((lo+c.dataIndex)>la?' (E)':''); } } } },
      scales:scales } });
  var blk=aStdBlk(id);
  if(blk){ var hm=spec.hideModes||[];   // contextual controls: hide groups that do not apply to the current view
    blk.querySelectorAll('[data-astdmodeg]').forEach(function(g){ var cls=g.getAttribute('data-astdmodeg').split('|')[1]; g.style.display=hm.indexOf(cls)>=0?'none':'inline-flex'; }); }
  var leg=blk&&blk.querySelector('[data-astdleg="'+id+'"]');
  if(leg){
    if(spec.paired){   // one chip per source; toggling hides its bar AND its margin line. Caption disambiguates shapes.
      var seen={}, chips=[];
      spec.series.forEach(function(s){ var g=s.grp||s.k; if(seen[g])return; seen[g]=1;
        chips.push('<button type="button" class="rs-leg'+(st.hidden[s.k]?' off':'')+'" data-astdleggrp="'+id+'|'+g+'"><span class="ave-leg-act" style="background:'+s.color+'"></span>'+esc(s.src||s.label)+'</button>'); });
      leg.innerHTML=chips.join('')+'<span class="me-bl-legcap">Bars = $ amount &nbsp;·&nbsp; lines = margin (right axis)</span>';
    } else {
      leg.innerHTML=spec.series.map(function(s){ return '<button type="button" class="rs-leg'+(st.hidden[s.k]?' off':'')+'" data-astdlegk="'+id+'|'+s.k+'"><span class="ave-leg-act" style="background:'+s.color+'"></span>'+esc(s.label)+'</button>'; }).join('')+(spec.legCap?'<span class="me-bl-legcap">'+spec.legCap+'</span>':'');
    }
    if(spec.note) leg.innerHTML+='<div class="me-bl-note">'+spec.note+'</div>';
  }
  // Collapsible data table (rule 3) — windowed + honours hidden series; the header counts the periods.
  var tblc=blk&&blk.querySelector('[data-astdtbl="'+id+'"]');
  if(tblc){ var vis=spec.series.filter(function(s){ return !st.hidden[s.k]; });
    var hd='<tr><th class="me-bl-th0">Series</th>'+labels.map(function(l){ return '<th>'+esc(l)+'</th>'; }).join('')+'</tr>';
    var bd=vis.map(function(s){ return '<tr><td class="me-bl-td0">'+esc(s.label)+'</td>'+s.data.slice(lo,hi+1).map(function(v){ var f=s.yAxisID==='y2'?y2f:yFmt; return '<td>'+(v==null?'—':esc(String(f(v))))+'</td>'; }).join('')+'</tr>'; }).join('');
    tblc.innerHTML='<table class="me-bl-tbl"><thead>'+hd+'</thead><tbody>'+bd+'</tbody></table>'; }
  var sub=blk&&blk.querySelector('[data-astdtblsub="'+id+'"]'); if(sub) sub.textContent=(spec.tblWhat?spec.tblWhat+' · ':'')+labels.length+' periods';
  aStdSyncSlider(id, spec.labels, la);
  aStdWire(id);
  // Re-attach the brush each render: x-drag windows the PERIOD, y-drag zooms the value axis, double-click resets.
  var cvv=$id('astd-'+id), chh=_aCharts['astd-'+id];
  if(cvv&&chh) rsAttachBrush(cvv, chh, function(i1,i2){ var w=_aStd[id].win, lo=w[0]; _aStd[id].win=[lo+i1, lo+i2]; aStdRender(id); },
    function(v1,v2){ _aStd[id].yr=[v1,v2]; aStdRender(id); },
    function(){ _aStd[id].win=null; _aStd[id].yr=null; aStdRender(id); });
}
function aStdSyncSlider(id, labels, la){
  var blk=aStdBlk(id); if(!blk) return; var n=labels.length, w=_aStd[id].win;
  var r0=blk.querySelector('.astd-r0'), r1=blk.querySelector('.astd-r1'), fill=blk.querySelector('[data-astdfill]'), ticks=blk.querySelector('[data-astdticks]'), e0=blk.querySelector('[data-astdend0]'), e1=blk.querySelector('[data-astdend1]');
  if(r0){ r0.max=n-1; r0.value=w[0]; } if(r1){ r1.max=n-1; r1.value=w[1]; }
  if(fill){ fill.style.left=(w[0]/(n-1)*100)+'%'; fill.style.width=((w[1]-w[0])/(n-1)*100)+'%'; }
  if(e0) e0.textContent=labels[w[0]]||''; if(e1) e1.textContent=labels[w[1]]||'';
  if(ticks){ var h=''; for(var i=0;i<n;i++){ h+='<span class="rs-tick'+(i>=w[0]&&i<=w[1]?' on':'')+(i>la?' est':'')+'" style="left:'+(i/(n-1)*100)+'%"></span>'; } ticks.innerHTML=h; }
}
function aStdPresetWin(code, n, la){ switch(code){ case 'rep': return [0,la]; case 'fwd': return [Math.max(0,la),n-1];
  case 'l3': return [Math.max(0,la-2),la]; case 'l5': return [Math.max(0,la-4),la];
  case 'l4': return [Math.max(0,la-3),la]; case 'l8': return [Math.max(0,la-7),la]; default: return [0,n-1]; } }
function aStdWire(id){
  var blk=aStdBlk(id); if(!blk || blk._astdWired) return; blk._astdWired=true; var st=_aStd[id];
  blk.addEventListener('click', function(e){
    var mode=e.target.closest&&e.target.closest('[data-astdmode]'); if(mode){ var p=mode.getAttribute('data-astdmode').split('|'); st.modes[p[1]]=p[2]; st.yr=null;   // units may change: drop the y-zoom
      if(['gran','meas','seg'].indexOf(p[1])>=0) st.win=null;   // a new period axis starts on its full range
      mode.parentNode.querySelectorAll('.rs-view').forEach(function(x){ x.classList.toggle('active',x===mode); }); aStdRender(id); return; }
    var lg=e.target.closest&&e.target.closest('[data-astdlegk]'); if(lg){ var k=lg.getAttribute('data-astdlegk').split('|')[1]; st.hidden[k]=!st.hidden[k]; aStdRender(id); return; }
    var lgg=e.target.closest&&e.target.closest('[data-astdleggrp]'); if(lgg){ var g=lgg.getAttribute('data-astdleggrp').split('|')[1], spc=_aStdDerive[id]&&_aStdDerive[id](st);
      if(spc){ var mem=spc.series.filter(function(s){ return (s.grp||s.k)===g; }), off=mem.every(function(s){ return st.hidden[s.k]; }); mem.forEach(function(s){ st.hidden[s.k]=!off; }); } aStdRender(id); return; }
    var rp=e.target.closest&&e.target.closest('[data-astdrange]'); if(rp){ var spec=_aStdDerive[id]&&_aStdDerive[id](st); var n=spec?spec.labels.length:2, la=spec&&spec.lastAct!=null?spec.lastAct:n-1;
      st.win=aStdPresetWin(rp.getAttribute('data-astdrange').split('|')[1], n, la); st.yr=null; aStdRender(id); return; }
  });
  var sel=blk.querySelector('[data-astdsel]'); if(sel) sel.onchange=function(){ st.sel=sel.value; st.yr=null; st.win=null; aStdRender(id); };
  var r0=blk.querySelector('.astd-r0'), r1=blk.querySelector('.astd-r1');
  function onSlide(){ var a=+r0.value, b=+r1.value; st.win=[Math.min(a,b),Math.max(a,b)]; aStdRender(id); }
  if(r0) r0.oninput=onSlide; if(r1) r1.oninput=onSlide;
}
function aZoom(id){ var cv=$id(id), ch=_aCharts[id]; if(!cv||!ch) return;
  if(ch.options&&ch.options.scales&&ch.options.scales.y){   // rule 1
    rsAttachBrush(cv, ch, null,
      function(v1,v2){ ch.options.scales.y.min=v1; ch.options.scales.y.max=v2; ch.update('none'); },
      function(){ ch.options.scales.y.min=undefined; ch.options.scales.y.max=undefined; ch.update('none'); }); }
  if(ch.options&&ch.options.plugins&&ch.options.plugins.legend){   // rule 2: legend hides the series AND refreshes the table
    var orig=Chart.defaults.plugins.legend.onClick;
    ch.options.plugins.legend.onClick=function(e,item,legend){ orig.call(this,e,item,legend); setTimeout(function(){ aBuildAutoTbl(id); },0); }; }
  aBuildAutoTbl(id);   // rule 3
}
// Collapsible data table under a chart (rule 3) — the portable rs-collap markup (§0.7), self-wired (§23).
function aTbl(id, title, headers, rows){
  var head='<span class="rs-collap-ic">▸</span> '+esc(title)+' <span class="rs-collap-sub">'+rows.length+' rows</span>';
  var thead='<tr>'+headers.map(function(hh,i){ return '<th'+(i===0?' class="rs-ft-h"':'')+'>'+esc(String(hh))+'</th>'; }).join('')+'</tr>';
  var tb=rows.map(function(r){ return '<tr>'+r.map(function(c,i){ return i===0?('<td class="rs-ft-h">'+esc(String(c))+'</td>'):('<td>'+(c==null||c===''?'<span class="rs-ft-nil">–</span>':esc(String(c)))+'</td>'); }).join('')+'</tr>'; }).join('');
  return '<div class="rs-collap" data-rstbl="'+id+'"><button type="button" class="rs-collap-h" data-rstblb="'+id+'" data-selfwired="1" data-mebl="1">'+head+'</button>'+
    '<div class="rs-collap-b" id="rsTB-'+id+'" hidden><div class="rs-ft-scroll"><table class="rs-ft"><thead>'+thead+'</thead><tbody>'+tb+'</tbody></table></div></div></div>';
}

// ═══ Money in US$ million (TPL is small: never $B with tiny decimals) ═══
function fM(v, dec){ if(v==null) return '—'; var a=Math.abs(v), d=dec!=null?dec:(a<10?1:0); return (v<0?'−':'')+'$'+a.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d})+'M'; }
function fMd(v){ if(v==null) return '—'; var a=Math.abs(v), d=a<10?1:0; return (v>=0?'+':'−')+'$'+a.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d})+'M'; }
function fPct(v){ return v==null?'—':(v<0?'−':'')+Math.abs(v).toFixed(1)+'%'; }
var M_FMT=function(x){ return x==null?'':(x<0?'−$':'$')+Math.abs(Math.round(x)).toLocaleString('en-US')+'M'; };

// ═══ Consensus — the LATEST vintage of the Results dataset's Bloomberg estMatrix; never typed ═══
var CM=tplResults.estMatrix.cons, CV=CM.vintages[CM.vintages.length-1], CV_ID=CV.id;
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function dLab(iso){ var p=String(iso).split('-'); return MON[(+p[1])-1]+' '+(+p[2])+', '+p[0]; }
var CONS_ASOF=dLab(CV_ID);
var CONS_SRC='Bloomberg consensus, Consensus_Portal.xlsm CONSENSUS sheet, as of '+CONS_ASOF;
function consQ(k,p){ var m=CM.q&&CM.q[k], r=m&&m[CV_ID]; return (r&&r[p]!=null)?r[p]:null; }
function consY(k,y){ var m=CM.y&&CM.y[k], r=m&&m[CV_ID]; return (r&&r[String(y)]!=null)?r[String(y)]:null; }
function consKeysQ(k){ var m=CM.q&&CM.q[k], r=m&&m[CV_ID]; return r?Object.keys(r):[]; }
function consKeysY(k){ var m=CM.y&&CM.y[k], r=m&&m[CV_ID]; return r?Object.keys(r).map(Number).sort():[]; }
// A consensus operating income that is negative while revenue is above $1B is a bad cell (FY2028 in the Nov 3, 2026
// snapshot: −$65.5M against $1,232.5M of revenue). It is treated as missing, and every view that hits it says so.
var BAD_OI={};
function cleanOI(v, rev, lab){ if(v!=null && rev!=null && v<0 && rev>1000){ BAD_OI[lab]={v:v,rev:rev}; return null; } return v; }
function badOINote(){ var ks=Object.keys(BAD_OI); if(!ks.length) return '';
  return ' '+ks.map(function(k){ return k+' consensus operating income is left blank: the snapshot carries '+fM(BAD_OI[k].v,1)+' against '+fM(BAD_OI[k].rev,1)+' of revenue (a bad cell).'; }).join(' '); }

// ═══ Reported data (Results dataset) ═══
var RQ=tplResults.views.q.metrics, RY=tplResults.views.y.metrics;
function rq(mk, p){ var m=RQ[mk]; if(!m||!m.act) return null; var i=m.periods.indexOf(p); return i>=0?m.act[i]:null; }
function ry(mk, y){ var m=RY[mk]; if(!m||!m.act) return null; var i=m.periods.indexOf(String(y)); return i>=0?m.act[i]:null; }
function qOrd(p){ var m=/(\d)Q(\d{2})/.exec(p||''); return m?(2000+(+m[2]))*10+(+m[1]):0; }
function fyLab(y){ return 'FY'+String(y).slice(2); }

// ═══ The expense lines — TPL's five, by nature, in the 10-K's order. No cost of revenue; one family. ═══
var A_LINES=[
  {k:'sal',lab:'Salaries and related employee expenses',sh:'Salaries & employee',c:SUMMIT_CAT[0]},
  {k:'water',lab:'Water service-related expenses',sh:'Water service-related',c:SUMMIT_CAT[1]},
  {k:'gAdmin',lab:'General and administrative expenses',sh:'G&A',c:SUMMIT_CAT[2]},
  {k:'da',lab:'Depreciation, depletion and amortization',sh:'DD&A',c:SUMMIT_CAT[3]},
  {k:'adval',lab:'Ad valorem and other taxes',sh:'Ad valorem & other taxes',c:SUMMIT_CAT[4]}
];
function aLine(k){ for(var i=0;i<A_LINES.length;i++) if(A_LINES[i].k===k) return A_LINES[i]; return null; }
// ═══ The bridge — revenue → each expense line → operating income ($M), margin change (bps), forward, cost structure ═══
var aBrPlugin={ id:'aBrLbl', afterDatasetsDraw:function(chart){
  var steps=chart._steps; if(!steps) return; var ctx=chart.ctx, meta=chart.getDatasetMeta(0), y=chart.scales.y, fmt=chart._fmt||{};
  ctx.save();
  ctx.strokeStyle=fade(MUTE,0.55); ctx.setLineDash([3,3]); ctx.lineWidth=1;
  for(var i=0;i<steps.length-1;i++){ if(steps[i].runAfter==null) continue; var b0=meta.data[i], b1=meta.data[i+1];
    var yy=y.getPixelForValue(steps[i].runAfter); ctx.beginPath(); ctx.moveTo(b0.x+b0.width/2, yy); ctx.lineTo(b1.x-b1.width/2, yy); ctx.stroke(); }
  ctx.setLineDash([]); ctx.textAlign='center';
  for(var j=0;j<steps.length;j++){ var s=steps[j], bar=meta.data[j], topPix=y.getPixelForValue(Math.max(s.range[0], s.range[1])), txt;
    if(s.kind==='base'||s.kind==='total'){ txt=(fmt.base||String)(s.val); ctx.fillStyle=INK; ctx.font='800 11px Inter, system-ui, sans-serif'; }
    else { txt=(fmt.delta||String)(s.val); ctx.fillStyle=s.dc||(s.val>=0?POS:NEG); ctx.font='700 10.5px Inter, system-ui, sans-serif'; }
    ctx.fillText(txt, bar.x, topPix-6); }
  ctx.restore();
} };
function aBuildBrWaterfall(id, steps, fmt){
  var cv=aChartReady(id); if(!cv) return; aDestroy(id);
  var labels=steps.map(function(s){return s.label;}), data=steps.map(function(s){return s.range;}), colors=steps.map(function(s){return s.color;});
  var ch=new Chart(cv.getContext('2d'), { type:'bar',
    data:{ labels:labels, datasets:[{ data:data, backgroundColor:colors, borderRadius:4, borderSkipped:false, maxBarThickness:56, categoryPercentage:0.74, barPercentage:0.9 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{padding:{top:24}},
      plugins:{ legend:{display:false}, tooltip:{ displayColors:false, callbacks:{ title:function(it){return it[0].label;}, label:function(ctx){
        var s=ctx.chart._steps[ctx.dataIndex];
        if(s.kind==='base'||s.kind==='total') return (fmt.base||String)(s.val);
        return (fmt.delta||String)(s.val)+(s.runAfter!=null?'   ·   running '+(fmt.base||String)(s.runAfter):''); } } } },
      scales:{ x:{ grid:{display:false}, ticks:{color:MUTE, font:{size:11}, autoSkip:false, maxRotation:45, minRotation:0} },
        y:{ position:'right', grid:{color:GRID}, ticks:{color:MUTE, font:{size:11}, callback:function(v){return (fmt.axis||String)(v);}} } } },
    plugins:[ aBrPlugin ] });
  ch._steps=steps; ch._fmt=fmt; _aCharts[id]=ch; ch.update('none'); aZoom(id);
  var tw=$id(id+'-tbl');   // rule 3: the table carries every step drawn
  if(tw){ var f=(fmt&&fmt.base)||String, fd=(fmt&&fmt.delta)||String;
    tw.innerHTML=aTbl(id, 'The waterfall — every step', ['Step','Value','Running'], steps.map(function(s){
      return [s.label, (s.kind==='base'||s.kind==='total')?f(s.val):fd(s.val), s.runAfter==null?f(s.val):f(s.runAfter)]; })); }
}
// Revenue → − each expense line → = Operating income, $M. A line the period does not present (null) draws no step.
function aBridgeBuildupSteps(r){
  var rev=r.revenue, run=rev;
  var steps=[{label:'Revenue', kind:'base', color:INK, range:[0,run], runAfter:run, val:rev}];
  function down(k,lab,c){ var v=r[k]; if(v==null) return; var hi=run; run=hi-v;
    steps.push({label:lab, kind:'down', color:c, dc:MUTE, range:[Math.min(run,hi),Math.max(run,hi)], runAfter:run, val:-v}); }
  if(r.opex!=null){ down('opex','Total operating expenses',fade(INK,0.42)); }   // forward rows: consensus gives only the total
  else A_LINES.forEach(function(it){ down(it.k, it.sh, it.c); });
  if(r.other!=null && Math.abs(r.other)>=0.5) down('other','Consensus residual',MUTE);
  steps.push({label:'Op. income', kind:'total', color:run>=0?POS:NEG, range:[0,run], runAfter:null, val:run});
  return steps;
}
function aOpm(r){ return r.oi/r.revenue*100; }
// Operating-margin change between two periods, decomposed by line. If either period does not present ad valorem and
// other taxes as its own line (before FY2021), that line is merged into G&A for both, and the step says so.
function aBridgeBpsSteps(prev, cur, labA, labB){
  var merge=(prev.adval==null||cur.adval==null), m0=aOpm(prev), run=m0;
  var steps=[{label:labA, kind:'base', color:INK, range:[0,run], runAfter:run, val:m0}];
  function v(r,k){ if(merge&&k==='gAdmin') return (r.gAdmin||0)+(r.adval||0); return r[k]||0; }
  A_LINES.forEach(function(it){ if(merge&&it.k==='adval') return;
    var c=(v(prev,it.k)/prev.revenue - v(cur,it.k)/cur.revenue)*100, lo=run; run=lo+c;
    steps.push({label:(merge&&it.k==='gAdmin')?'G&A incl. ad valorem':it.sh, kind:c>=0?'up':'down', color:c>=0?POS:NEG, range:[Math.min(lo,run),Math.max(lo,run)], runAfter:run, val:c}); });
  steps.push({label:labB, kind:'total', color:INK, range:[Math.min(0,run),Math.max(0,run)], runAfter:null, val:run});
  return steps;
}
var BR_FMT_D={ axis:function(v){ return (v<0?'−$':'$')+Math.abs(Math.round(v)).toLocaleString('en-US')+'M'; }, base:function(v){ return fM(v); }, delta:function(v){ return fMd(v); } };
var BR_FMT_BPS={ axis:function(v){return v.toFixed(0)+'%';}, base:function(v){return v.toFixed(1)+'%';}, delta:function(v){var b=Math.round(v*100); return (b>=0?'+':'−')+Math.abs(b)+' bps';} };
// ═══ Fiscal-year axis of the Bloomberg export (yearsA = reported, yearsF = consensus forward) — never typed ═══
var A_YA=tplBBG.yearsA, A_YF=tplBBG.yearsF;
function aFyVal(s,y){ if(!s) return null; var i=A_YA.indexOf(y); if(i>=0) return s.a?s.a[i]:null; i=A_YF.indexOf(y); return (i>=0&&s.f)?s.f[i]:null; }
function aIsVal(k,y){ return aFyVal(tplBBG.is[k], y); }
// Forward years with a usable consensus operating income (the bad-cell year drops out).
var A_YF_OK=A_YF.filter(function(y){ return cleanOI(aIsVal('oi',y), aIsVal('rev',y), fyLab(y)+'E')!=null; });
function aFwdBtns(attr){ return A_YF_OK.map(function(y,i){ return '<button type="button" data-'+attr+'="'+y+'"'+(i===0?' class="active"':'')+'>'+fyLab(y)+'E</button>'; }).join(''); }
// Forward row from BBG consensus: revenue, total operating expenses and operating income. `other` is the residual so
// revenue − opex − other = consensus operating income; it is held fixed, so with the slider at 0 the bridge ties to
// consensus and moving it lets operating income float.
function aFwdOpexRow(y, adj){
  var rev=aIsVal('rev',y), opex=aIsVal('totalOpex',y), oi=aIsVal('oi',y); if(rev==null||opex==null||oi==null) return null;
  return { revenue:rev, opex:opex*(1+(adj||0)/100), other:rev-opex-oi };
}
function aBridgeBody(){
  var yBtns=function(cls,sel){ return TPL_OPEX_YEARS.map(function(y){ return '<button type="button" data-'+cls+'="'+y+'"'+(y===sel?' class="active"':'')+'>'+fyLab(y)+'</button>'; }).join(''); };
  var qYears=[]; TPL_OPEXQ.forEach(function(r){ if(qYears.indexOf(r.yr)<0) qYears.push(r.yr); });
  var qLast=TPL_OPEXQ[TPL_OPEXQ.length-1], yN=TPL_OPEX_YEARS.length;
  var qyBtns=qYears.map(function(y){ return '<button type="button" data-brqy="'+y+'"'+(y===qLast.yr?' class="active"':'')+'>'+fyLab(y)+'</button>'; }).join('');
  var qqBtns=['Q1','Q2','Q3','Q4'].map(function(q){ return '<button type="button" data-brqq="'+q+'"'+(q===qLast.q?' class="active"':'')+'>'+q+'</button>'; }).join('');
  var fwd=A_YF_OK.length?'<button type="button" data-brm="fexp">Forward (total expenses)</button>':'';
  return '<div class="ov-sec"><div class="ov-sec-h">The bridge — how revenue becomes operating income</div>'+
    '<div class="mch-ctl">'+
      '<span class="acx-tog br-mode"><button type="button" data-brm="buildup" class="active">Build-up ($M)</button><button type="button" data-brm="bps">Margin change (bps)</button>'+fwd+'<button type="button" data-brm="cs">Cost structure</button></span>'+
      '<span></span>'+
    '</div>'+
    '<div class="br-ctl-bu mch-ctl me-bl-ctl">'+
      '<span></span>'+
      '<span class="me-bl-pills">'+
        '<span class="acx-tog br-gran"><button type="button" data-brg="y" class="active">Annual</button><button type="button" data-brg="q">Quarterly</button></span>'+
        '<span class="acx-tog br-yr br-sel-y">'+yBtns('bry',TPL_OPEX_YEARS[yN-1])+'</span>'+
        '<span class="acx-tog br-qy br-sel-q" hidden>'+qyBtns+'</span>'+
        '<span class="acx-tog br-qq br-sel-q" hidden>'+qqBtns+'</span>'+
      '</span>'+
    '</div>'+
    '<div class="br-ctl-bps mch-ctl me-bl-ctl" hidden><span></span>'+
      '<span class="me-bl-pills"><span class="me-bl-lbl">From</span><span class="acx-tog br-from">'+yBtns('brf',TPL_OPEX_YEARS[Math.max(0,yN-4)])+'</span>'+
      '<span class="me-bl-lbl">to</span><span class="acx-tog br-to">'+yBtns('brt',TPL_OPEX_YEARS[yN-1])+'</span></span></div>'+
    '<div class="br-ctl-fexp mch-ctl me-bl-ctl" hidden>'+
      '<span></span>'+
      '<span class="me-bl-pills"><span class="acx-tog br-fy">'+aFwdBtns('brfy')+'</span>'+
        '<button type="button" class="br-fx-reset">Reset to consensus</button></span>'+
    '</div>'+
    '<div class="br-fx-sl me-bl-sliders" hidden>'+
      '<div class="me-bl-lbl">Sensitize total operating expenses vs consensus (0% = Bloomberg consensus). Operating income floats with your change:</div>'+
      '<div class="br-sl"><span class="br-sl-l">Total opex</span><input type="range" data-brx="opex" min="-25" max="25" step="1" value="0"><span class="br-sl-v" data-brxv="opex">0%</span></div>'+
    '</div>'+
    '<div class="br-wf"><div class="me-bl-h340"><canvas id="tpBrCanvas"></canvas></div>'+
    '<div id="tpBrCanvas-tbl" class="me-bl-tblhost"></div>'+
    '<div class="me-bl-note br-wf-note" id="tpBrNote"></div></div>'+
    '<div class="br-cs" hidden>'+aStdScaffold({ id:'tp-cs', bare:true, tblTitle:'Cost structure — every line', height:320,
      modes:[{cls:'gran',label:'Period',opts:[{v:'y',label:'Annual',on:true},{v:'q',label:'Quarterly'}]}],
      presets:[['all','All'],['l5','Last 5'],['l8','Last 8']] })+'</div>'+
    '</div>';
}
function aShow(el, on){ if(el) el.hidden=!on; }
function aBridgeSync(pane){
  var mb=pane.querySelector('.br-mode .active'), mode=mb?mb.getAttribute('data-brm'):'buildup';
  aShow(pane.querySelector('.br-ctl-bu'), mode==='buildup');
  aShow(pane.querySelector('.br-ctl-bps'), mode==='bps');
  aShow(pane.querySelector('.br-ctl-fexp'), mode==='fexp');
  aShow(pane.querySelector('.br-fx-sl'), mode==='fexp');
  aShow(pane.querySelector('.br-wf'), mode!=='cs');
  aShow(pane.querySelector('.br-cs'), mode==='cs');
  var g=pane.querySelector('.br-gran .active'), q=!!(g&&g.getAttribute('data-brg')==='q');
  aShow(pane.querySelector('.br-sel-y'), !q);
  pane.querySelectorAll('.br-sel-q').forEach(function(el){ el.hidden=!q; });
  if(q){
    var yb=pane.querySelector('.br-qy .active'), yy=yb?+yb.getAttribute('data-brqy'):null;
    var avail=TPL_OPEXQ.filter(function(r){ return r.yr===yy; }).map(function(r){ return r.q; });
    var qbtns=pane.querySelectorAll('.br-qq button'), anyActive=false;
    qbtns.forEach(function(b){ var ok=avail.indexOf(b.getAttribute('data-brqq'))>=0; b.disabled=!ok; b.classList.toggle('me-bl-off',!ok); if(b.classList.contains('active')&&!ok) b.classList.remove('active'); });
    qbtns.forEach(function(b){ if(b.classList.contains('active')) anyActive=true; });
    if(!anyActive&&avail.length){ var lastQ=avail[avail.length-1]; qbtns.forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-brqq')===lastQ); }); }
  }
}
var BR_NOTE_BASE='TPL presents its expenses by nature — five lines, as in the 10-K — with no cost of revenue and no gross profit, so the bridge has no gross-profit subtotal; the closest to a direct cost is water service-related expenses (Water Services and Operations only). General and administrative expenses include legal and professional fees, shown apart through FY2023 and folded in from the FY2024 10-K.';
// Cost structure — every line as a % of revenue over time (stacked), with the operating margin on top. Reported only.
function aBuildCostStructure(){
  aStdRender('tp-cs', function(st){
    var gran=st.modes.gran||'y', rows, labels;
    if(gran==='q'){ rows=TPL_OPEXQ; labels=rows.map(function(r){ return r.p; }); }
    else { rows=TPL_OPEX_YEARS.map(function(y){ return TPL_OPEX[y]; }); labels=TPL_OPEX_YEARS.map(fyLab); }
    function pct(v,r){ return (v==null||!r.revenue)?null:Math.round(v/r.revenue*1000)/10; }
    var series=A_LINES.map(function(it){ return { k:it.k, label:it.lab+' — % of revenue', color:it.c, type:'bar', data:rows.map(function(r){ return pct(r[it.k],r); }) }; });
    series.push({ k:'om', label:'Operating margin', color:INK, type:'line', stack:'om', data:rows.map(function(r){ return pct(r.oi,r); }) });
    var first=rows.filter(function(r){ return r.adval!=null; })[0];
    var note=gran==='q'?'Legal costs of the 2023 stockholder matters lift G&amp;A in 1Q23–2Q23; depletion on the royalty interests bought from 2H24 lifts DD&amp;A.':
      'Ad valorem and other taxes are a line of their own from '+(first?fyLab(TPL_OPEX_YEARS[rows.indexOf(first)]):'FY2021')+'; before that they sit inside G&amp;A. FY2018–FY2020 are the Texas Pacific Land Trust’s figures as restated by TPL.';
    return { labels:labels, lastAct:labels.length-1, type:'bar', stacked:true, series:series, tblWhat:'% of revenue', note:note,
      yFmt:function(x){ return (x==null?'':(+x).toFixed(1))+'%'; },
      legCap:'Bars stack each expense line as a share of revenue; the line is the operating margin. Bars + line = 100%.' };
  });
}
function aBuildBridge(){
  var pane=aPane(); if(!pane) return;
  var mb=pane.querySelector('.br-mode .active'), mode=mb?mb.getAttribute('data-brm'):'buildup', r, note=pane.querySelector('#tpBrNote');
  if(mode==='cs'){ aBuildCostStructure(); return; }
  if(mode==='bps'){
    var fb=pane.querySelector('.br-from .active'), tb=pane.querySelector('.br-to .active');
    var ya=fb?+fb.getAttribute('data-brf'):TPL_OPEX_YEARS[0], yb2=tb?+tb.getAttribute('data-brt'):TPL_OPEX_YEARS[TPL_OPEX_YEARS.length-1], prev=TPL_OPEX[ya], cur=TPL_OPEX[yb2];
    if(prev&&cur) aBuildBrWaterfall('tpBrCanvas', aBridgeBpsSteps(prev,cur,fyLab(ya),fyLab(yb2)), BR_FMT_BPS);
    if(note) note.innerHTML=BR_NOTE_BASE+' Each step is the line’s change as a share of revenue, in basis points of operating margin (green = the line fell as a share of revenue).'+((prev&&cur&&(prev.adval==null||cur.adval==null))?' One of the two years does not present ad valorem and other taxes apart, so that line is merged into G&amp;A for both.':'');
    return;
  }
  if(mode==='fexp'){
    var fyb=pane.querySelector('.br-fy .active'), fy=fyb?+fyb.getAttribute('data-brfy'):A_YF_OK[0], s=pane.querySelector('.br-fx-sl input[data-brx="opex"]'), adj=s?+s.value:0;
    var v=pane.querySelector('.br-sl-v[data-brxv="opex"]'); if(v) v.textContent=(adj>0?'+':'')+adj+'%';
    r=aFwdOpexRow(fy, adj);
    if(note) note.innerHTML='Forward: Bloomberg gives total operating expenses only, not TPL’s five lines, so the forward bridge has one expense bar; a residual (shown only if ≥ $0.5M) makes it tie to consensus operating income. '+esc(CONS_SRC)+'.'+badOINote()+(Object.keys(BAD_OI).length?' The forward years therefore stop at '+fyLab(A_YF_OK[A_YF_OK.length-1])+'E.':'');
  } else {
    var g=pane.querySelector('.br-gran .active'), gran=g?g.getAttribute('data-brg'):'y';
    if(gran==='q'){ var yq=pane.querySelector('.br-qy .active'), qb=pane.querySelector('.br-qq .active');
      var yy=yq?+yq.getAttribute('data-brqy'):TPL_OPEXQ[TPL_OPEXQ.length-1].yr, qq=qb?qb.getAttribute('data-brqq'):TPL_OPEXQ[TPL_OPEXQ.length-1].q;
      r=TPL_OPEXQ.filter(function(x){ return x.yr===yy && x.q===qq; })[0]; }
    else { var yb=pane.querySelector('.br-yr .active'); r=TPL_OPEX[yb?+yb.getAttribute('data-bry'):TPL_OPEX_YEARS[TPL_OPEX_YEARS.length-1]]; }
    if(note) note.innerHTML=BR_NOTE_BASE+(r&&r.adval==null?' This year does not present ad valorem and other taxes apart (they are inside G&amp;A).':'');
  }
  if(!r) return;
  aBuildBrWaterfall('tpBrCanvas', aBridgeBuildupSteps(r), BR_FMT_D);
}
// ═══ BL-GEN-3 Operating income → net income ═══
// Reported years from the filings (TPL_OPEX, other income split by Note 11 where given); forward years from the BBG
// export: other income and interest, net = pretax − operating income; the rest (if consensus does not add up) is one
// residual step. Normalized is not offered: other income is mostly interest earned on cash, a recurring item.
var NB_YRS=TPL_OPEX_YEARS.concat(A_YF_OK);
function aNetParts(y){
  var r=TPL_OPEX[y];
  if(r) return { rep:true, oi:r.oi, intx:r.intx||0, oth:r.oth, split:TPL_OTHINC[y]||null, pt:r.pretax, tx:r.tax, net:r.ni, rev:r.revenue, rest:0 };
  var oi=aIsVal('oi',y), pt=aIsVal('pretax',y), tx=aIsVal('tax',y), net=aIsVal('netIncome',y), rev=aIsVal('rev',y);
  if(oi==null||pt==null||tx==null||net==null) return null;
  return { rep:false, oi:oi, intx:0, oth:pt-oi, split:null, pt:pt, tx:tx, net:net, rev:rev, rest:net-(pt-tx) };
}
function aNetBridgeBody(){
  var dflt=A_YF_OK.length?A_YF_OK[0]:TPL_OPEX_YEARS[TPL_OPEX_YEARS.length-1];
  var yb=NB_YRS.map(function(y){ return '<button type="button" data-nbyr="'+y+'"'+(y===dflt?' class="active"':'')+'>'+fyLab(y)+(TPL_OPEX[y]?'':'E')+'</button>'; }).join('');
  return '<div class="ov-sec"><div class="ov-sec-h">Operating income → net income — interest on cash and taxes</div>'+
    '<div class="mch-ctl">'+
      '<span class="acx-tog nb-yr">'+yb+'</span>'+
      '<span></span>'+
    '</div>'+
    '<div class="me-bl-h330"><canvas id="tpNetBr"></canvas></div>'+
    '<div id="tpNetBr-tbl" class="me-bl-tblhost"></div>'+
    '<div class="acx-cap me-bl-note" id="tpNetBrCap"></div></div>';
}
function aBuildNetBridge(){
  var pane=aPane(); if(!pane) return;
  var yb=pane.querySelector('.nb-yr .active'), y=yb?+yb.getAttribute('data-nbyr'):NB_YRS[NB_YRS.length-1];
  var p=aNetParts(y); if(!p) return;
  var run=p.oi, steps=[{label:'Op. income', kind:'base', color:INK, range:[Math.min(0,run),Math.max(0,run)], runAfter:run, val:p.oi}];
  function step(lab,d,c){ if(Math.abs(d)<0.0005) return; var lo=run; run=lo+d; steps.push({label:lab, kind:d>=0?'up':'down', color:c||MUTE, dc:c||MUTE, range:[Math.min(lo,run),Math.max(lo,run)], runAfter:run, val:d}); }
  step('Interest expense', -p.intx);
  if(p.split){ step('Interest earned on cash', p.split.int, SUMMIT_CAT[0]);
    step('Pension and other', p.split.pen+p.split.misc, MUTE);
    step('Pension curtailment / settlement gain', p.split.gain, ONEOFF); }
  else step(p.rep?'Other income, net':'Other income and interest, net (consensus)', p.oth, SUMMIT_CAT[0]);
  step('Income tax', -p.tx);
  if(Math.abs(p.rest)>=0.5) step('Consensus residual', p.rest);
  run=p.net; steps.push({label:'Net income', kind:'total', color:p.net>=0?POS:NEG, range:[Math.min(0,run),Math.max(0,run)], runAfter:null, val:p.net});
  aBuildBrWaterfall('tpNetBr', steps, BR_FMT_D);
  var cap=pane.querySelector('#tpNetBrCap');
  if(cap){ var yl=fyLab(y)+(p.rep?'':'E'), rm=p.rev?p.net/p.rev*100:null, t=p.pt?p.tx/p.pt*100:null;
    var s1='<b>'+yl+'</b> — net margin <b>'+fPct(rm)+'</b>; effective tax rate <b>'+fPct(t)+'</b>.';
    var s2=p.split?' Other income, net of '+fM(p.oth,1)+' is mostly interest earned on cash ('+fM(p.split.int,1)+')'+(p.split.gain?', plus a '+fM(p.split.gain,1)+' pension curtailment and settlement gain':'')+' — recurring or immaterial, so no normalized view is drawn.':
      ' Other income, net (interest on cash, mostly) of '+fM(p.oth,1)+(p.rep?'':', as consensus implies it (pretax − operating income)')+'; with no material non-operating gain, no normalized view is drawn.';
    var s3=' Source: '+(p.rep?'Form 10-K'+(p.split?' (Note 11, Other Income, Net)':'')+' — '+esc(TPL_OPEX_SRC.split(' (')[0]):esc(CONS_SRC)+(y===A_YF[0]?'; '+yl+' already contains the reported quarters':''))+'.'+(p.rep?'':badOINote());
    cap.innerHTML=s1+s2+s3; }
}
// ═══ BL-GEN-4 SBC & dilution — Dilution (SBC bars + diluted shares: reported, consensus) | SBC by line (employee awards
// in salaries, director awards in G&A). Both y axes on the RIGHT (§17.3). No Summit line: there is no Summit model. ═══
function aSbcBody(){
  return '<div class="ov-sec"><div class="ov-sec-h">Stock-based compensation &amp; dilution</div>'+
    '<div class="mch-ctl">'+
      '<span class="acx-tog sbcv-tog"><button type="button" data-sbcv="dilution" class="active">Dilution</button><button type="button" data-sbcv="byline">SBC by line</button></span>'+
      '<span class="acx-tog sbcu-tog"><button type="button" data-sbcu="usd" class="active">$M</button><button type="button" data-sbcu="pct">%</button></span>'+
    '</div>'+
    '<div class="ave-leg me-bl-sbcleg" data-sbcleg="1"></div>'+
    '<div class="me-bl-h320"><canvas id="tpSbcMain"></canvas></div></div>';
}
var SB_YRS=TPL_OPEX_YEARS.concat(A_YF), SB_LA=TPL_OPEX_YEARS.length-1;
var SB_LAB=SB_YRS.map(function(y,i){ return fyLab(y)+(i>SB_LA?'E':''); });
var SBC_LN=[{k:'sal',lab:'Employee awards — in salaries and related employee expenses'},{k:'gAdmin',lab:'Director awards — in general and administrative expenses'}];
function aBuildSbc(){
  var pane=aPane(); if(!pane) return;
  var uw=pane.querySelector('.sbcu-tog .active'), pct=!!(uw&&uw.getAttribute('data-sbcu')==='pct');
  var vw=pane.querySelector('.sbcv-tog .active'), view=vw?vw.getAttribute('data-sbcv'):'dilution';
  var cv=aChartReady('tpSbcMain'); if(!cv) return; aDestroy('tpSbcMain');
  var labels=SB_LAB.slice(), legEl=pane.querySelector('[data-sbcleg]');
  var SBC_BAR=fade(INK,0.42);
  if(view==='dilution'){
    var sbc=SB_YRS.map(function(y){ var r=TPL_OPEX[y]; return r?r.sbc:null; }), rv=SB_YRS.map(function(y){ var r=TPL_OPEX[y]; return r?r.revenue:null; });
    var bars=labels.map(function(_,i){ return sbc[i]==null?null:(pct?(rv[i]?Math.round(sbc[i]/rv[i]*1000)/10:null):Math.round(sbc[i]*10)/10); });
    var shAct=SB_YRS.map(function(y,i){ return (i<=SB_LA&&TPL_DILSH[y]!=null)?Math.round(TPL_DILSH[y]*100)/100:null; });
    var shCon=SB_YRS.map(function(y,i){ if(i===SB_LA) return shAct[i]; if(i<SB_LA) return null; var v=aFyVal(tplBBG.is.dilShares,y); return v==null?null:Math.round(v*100)/100; });
    _aCharts['tpSbcMain']=new Chart(cv.getContext('2d'),{ data:{ labels:labels, datasets:[
      { type:'bar', label:'SBC '+(pct?'(% of revenue)':'($M)'), data:bars, backgroundColor:SBC_BAR, borderColor:'white', borderWidth:1, maxBarThickness:46, yAxisID:'y', order:3 },
      { type:'line', label:'Diluted shares — reported', data:shAct, borderColor:ASTD_ACT, backgroundColor:ASTD_ACT, borderWidth:2.6, pointRadius:2.6, tension:0.15, yAxisID:'y1', order:1 },
      { type:'line', label:'Diluted shares — consensus (BBG)', data:shCon, borderColor:ASTD_CONS, backgroundColor:ASTD_CONS, borderWidth:2.6, pointRadius:2.6, tension:0.15, borderDash:[5,4], yAxisID:'y1', order:2 } ]},
      options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(c){ if(c.parsed.y==null) return null; return c.dataset.yAxisID==='y1'? c.dataset.label+': '+c.parsed.y.toFixed(2)+'M'+(c.dataIndex>SB_LA?' (E)':'') : c.dataset.label+': '+(pct?c.parsed.y+'%':'$'+c.parsed.y.toFixed(1)+'M'); } } } },
        scales:{ x:{ grid:{ display:false } },
          y:{ position:'right', title:{ display:true, text:pct?'SBC (% of revenue)':'SBC ($M)', font:{ size:11 } }, grid:{ color:GRID }, beginAtZero:true, ticks:{ callback:function(v){ return pct?v+'%':'$'+v+'M'; } } },
          y1:{ position:'right', weight:1, title:{ display:true, text:'Diluted shares (M, split-adjusted)', font:{ size:11 } }, grid:{ display:false }, grace:'2%', ticks:{ callback:function(v){ return (+v).toFixed(1); } } } } } });
    var s0=shAct[0], sL=shAct[SB_LA], sE=shCon[shCon.length-1], y0s=null;
    for(var i=0;i<=SB_LA;i++){ if(sbc[i]>0.01){ y0s=i; break; } }
    if(legEl) legEl.innerHTML='<span class="me-bl-legcap">Diluted shares (split-adjusted) went from '+(s0!=null?s0.toFixed(1):'—')+'M in '+labels[0]+' to '+(sL!=null?sL.toFixed(1):'—')+'M in '+labels[SB_LA]+(sE!=null?'; consensus has '+sE.toFixed(1)+'M in '+labels[labels.length-1]:'')+'. '+(y0s!=null?'Stock awards start in '+labels[y0s]+' (the Trust paid none); ':'')+'buybacks have kept the count flat. Consensus carries no SBC forecast, so forward years have shares only. Click a legend item to hide it.</span>';
  } else {
    var yrsL=SB_YRS.filter(function(y){ return !!TPL_SBC_FN[y]; }); labels=yrsL.map(fyLab);
    if(legEl) legEl.innerHTML='<span class="me-bl-legcap">'+esc(TPL_SBC_FN_SRC)+'. TPL books employee awards in salaries and related employee expenses and director awards in general and administrative expenses; there is no forecast by line.</span>';
    var ds=SBC_LN.map(function(l){ var c=aLine(l.k).c;
      var vals=yrsL.map(function(y){ var fn=TPL_SBC_FN[y], v=fn[l.k], tot=fn.sal+fn.gAdmin; if(v==null) return null; return pct?(tot?Math.round(v/tot*1000)/10:null):Math.round(v*100)/100; });
      return { label:l.lab, data:vals, backgroundColor:c, borderColor:'white', borderWidth:1, maxBarThickness:44, stack:'s' }; });
    _aCharts['tpSbcMain']=new Chart(cv.getContext('2d'),{ type:'bar', data:{ labels:labels, datasets:ds },
      options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(c){ return c.dataset.label+': '+(c.parsed.y==null?'—':(pct?c.parsed.y+'% of total SBC':'$'+c.parsed.y.toFixed(2)+'M')); }, footer:function(it){ return pct?'':'Total SBC: $'+it.reduce(function(a,x){ return a+(x.parsed.y||0); },0).toFixed(1)+'M'; } } } },
        scales:{ x:{ stacked:true, grid:{ display:false } }, y:{ position:'right', stacked:true, max:pct?100:undefined, grid:{ color:GRID }, ticks:{ callback:function(v){ return pct?v+'%':'$'+v+'M'; } } } } } });
  }
  aZoom('tpSbcMain');
  if(!pane._sbcmWired){ pane._sbcmWired=true;
    pane.querySelectorAll('.sbcv-tog button, .sbcu-tog button').forEach(function(b){ b.onclick=function(){ b.parentNode.querySelectorAll('button').forEach(function(x){ x.classList.toggle('active',x===b); }); aBuildSbc(); }; }); }
}
// ═══ BL-GEN-1 Profitability & margins — Actual (filings, Results dataset) + Consensus (latest estMatrix vintage) ═══
var MARG_MK={operating:'opinc', ebitda:'adjebitda', net:'netinc', fcf:'fcf'};
var MARG_LAB={operating:'Op. income', ebitda:'Adj. EBITDA', net:'Net income', fcf:'FCF'};
function aMarginsBody(){
  return aStdScaffold({ id:'tp-margins', title:'Profitability & margins', height:360,
    metricSel:[{v:'operating',label:'Operating income (GAAP)',on:true,group:'Profit'},{v:'ebitda',label:'Adjusted EBITDA (TPL definition)',group:'Profit'},{v:'net',label:'Net income (GAAP)',group:'Profit'},{v:'fcf',label:'Free cash flow (TPL definition)',group:'Cash'}],
    modes:[{cls:'gran',label:'Period',opts:[{v:'y',label:'Annual',on:true},{v:'q',label:'Quarterly'}]}],
    presets:[['all','All'],['rep','Reported'],['fwd','Forward'],['l5','Last 5']] });
}
function aLastActIdx(arr){ var la=0; for(var i=0;i<arr.length;i++) if(arr[i]!=null) la=i; return la; }
// Bars = $M per source, lines = margin on revenue (right y2 axis).
function uMargSeries(lab, d, D){
  function amt(v){ return v==null?null:Math.round(v*10)/10; }
  function marg(a,den){ return a.map(function(v,i){ if(v==null||!den||!den[i]) return null; return Math.round(v/den[i]*1000)/10; }); }
  var series=[
    {k:'act$',grp:'act',src:'Actual',label:lab+' — Actual',color:ASTD_ACT,type:'bar',data:d.act.map(amt)},
    {k:'con$',grp:'con',src:'Consensus',label:lab+' — Consensus',color:ASTD_CONS,type:'bar',data:d.con.map(amt)},
    {k:'actM',grp:'act',src:'Actual',label:'Margin — Actual',color:ASTD_ACT,type:'line',yAxisID:'y2',data:marg(d.act,D.act)},
    {k:'conM',grp:'con',src:'Consensus',label:'Margin — Consensus',color:ASTD_CONS,type:'line',yAxisID:'y2',dash:true,data:marg(d.con,D.con)} ];
  return series.filter(function(x){ return x.data.some(function(v){ return v!=null; }); });
}
var MARG_NOTE={
  operating:'GAAP operating income: revenue less TPL’s five expense lines.',
  ebitda:'TPL’s Adjusted EBITDA (10-K): “EBITDA plus employee share-based compensation less pension curtailment and settlement gain”; quarters also exclude the 1Q26 $20.9M seller-financed land sale (Results dataset). Consensus = Bloomberg’s comparable EBITDA, set against the company measure. Not GAAP.',
  net:(function(){ var y=TPL_OPEX_YEARS[TPL_OPEX_YEARS.length-1], r=TPL_OPEX[y]; return 'GAAP net income. TPL’s small interest expense (from 4Q25) relates to the credit facility it entered then, with no draws in 2025 (10-K); it earns interest on its cash, so net income is operating income plus other income less tax ('+fPct(r.tax/r.pretax*100)+' effective rate in '+fyLab(y)+').'; })(),
  fcf:'TPL’s free cash flow (10-K): net income adjusted for tax, DD&amp;A and employee share-based compensation, less current income tax and purchases of fixed assets. Quarterly from 1Q23, when TPL first reported it. Royalty and land acquisitions are not deducted.'
};
function aBuildMargins(){
  aStdRender('tp-margins', function(st){
    var gran=st.modes.gran||'y', metric=st.sel||'operating', mk=MARG_MK[metric], lab=MARG_LAB[metric];
    var out={ type:'bar', stacked:false, paired:true, yFmt:M_FMT, y2Fmt:function(x){ return x+'%'; } };
    var notes=[MARG_NOTE[metric]], labels, la, act, con, dA, dC;
    if(gran==='q'){
      var m=RQ[mk], per=m.periods.filter(function(p,i){ return m.act[i]!=null; });
      var fwd=consKeysQ(mk).filter(function(p){ return qOrd(p)>qOrd(per[per.length-1]); }).sort(function(a,b){ return qOrd(a)-qOrd(b); });
      labels=per.concat(fwd); la=per.length-1;
      act=labels.map(function(p,i){ return i<=la?rq(mk,p):null; });
      con=labels.map(function(p,i){ return i>la?consQ(mk,p):null; });
      if(metric==='operating') con=con.map(function(v,i){ return i>la?cleanOI(v, consQ('rev',labels[i]), labels[i]+'E'):v; });
      dA=labels.map(function(p,i){ return i<=la?rq('rev',p):null; }); dC=labels.map(function(p,i){ return i>la?consQ('rev',p):null; });
      out.labels=labels.map(function(p,i){ return i>la?p+'E':p; });
    } else {
      var my=RY[mk], yrs=my.periods.filter(function(p,i){ return my.act[i]!=null; }).map(Number);
      var fy=consKeysY(mk).filter(function(y){ return y>yrs[yrs.length-1]; });
      var all=yrs.concat(fy); la=yrs.length-1;
      act=all.map(function(y,i){ return i<=la?ry(mk,y):null; });
      con=all.map(function(y,i){ return i>la?consY(mk,y):null; });
      if(metric==='operating') con=con.map(function(v,i){ return i>la?cleanOI(v, consY('rev',all[i]), fyLab(all[i])+'E'):v; });
      dA=all.map(function(y,i){ return i<=la?ry('rev',y):null; }); dC=all.map(function(y,i){ return i>la?consY('rev',y):null; });
      out.labels=all.map(function(y,i){ return fyLab(y)+(i>la?'E':''); });
      notes.push('A forward year’s consensus already contains its reported quarters.');
    }
    out.lastAct=la; out.series=uMargSeries(lab, {act:act,con:con}, {act:dA,con:dC});
    notes.push('Margin on revenue. Consensus: '+esc(CONS_SRC)+'. No Summit line: there is no Summit model for TPL.');
    if(metric==='operating') notes.push(badOINote());
    out.note=notes.join(' ');
    return out;
  });
}
// ═══ BL-GEN-5 Expense lines — one tab per line, the dive rendered inline ═══
var EW_LAST=TPL_OPEX_YEARS[TPL_OPEX_YEARS.length-1], EW_PREV=TPL_OPEX_YEARS[TPL_OPEX_YEARS.length-2], EW_QL=TPL_OPEXQ[TPL_OPEXQ.length-1];
function ewSpark(vals, labs, onIdx){ var mx=Math.max.apply(null,vals.map(function(v){ return Math.abs(v||0); }))||1;
  return '<div class="ew-spark">'+vals.map(function(v,i){ return '<div class="ew-sb'+(i===onIdx?' on':'')+'"><div class="ew-sb-v">'+(v==null?'—':v.toFixed(1)+'%')+'</div><div class="ew-sb-bar" style="height:'+(v==null?0:Math.max(2,Math.round(Math.abs(v)/mx*72)))+'px"></div><div class="ew-sb-l">'+labs[i]+'</div></div>'; }).join('')+'</div>';
}
function ewTableRows(title, rows){ if(!rows||!rows.length) return '';
  return '<tr class="ew-tgrp"><td colspan="2">'+title+'</td></tr>'+rows.map(function(b){ return '<tr><td class="ew-tk">'+b[1]+'</td><td>'+b[2]+'</td></tr>'; }).join(''); }
function ewBase(c){
  var h='<div class="ew-h">Key figures</div><div class="ov-kpis">'+c.kpis.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-v">'+k[0]+'</div><div class="ov-kpi-d muted">'+k[1]+'</div></div>'; }).join('')+'</div>';
  if(c.def){ h+='<div class="ew-h">Definition — Form 10-K</div><div class="ew-q ew-def">“'+c.def+'”<span class="ew-att">— '+TPL_EW_SRC+', '+c.defSrc+'</span></div>'; }
  var yrs=TPL_OPEX_YEARS.filter(function(y,i){ return c.traj[i]!=null; }), tr=c.traj.filter(function(v){ return v!=null; });
  h+='<div class="ew-h">Share of revenue, FY'+yrs[0]+'–FY'+yrs[yrs.length-1]+'</div>'+ewSpark(tr, yrs.map(function(y){ return '’'+String(y).slice(2); }), tr.length-1);
  if(c.comp||c.drivers){
    h+='<div class="ew-h">Composition and drivers</div><div class="twrap ew-twrap"><table class="rt ew-tbl"><tbody>'+
       ewTableRows('What the line contains', c.comp)+ewTableRows('What has moved it', c.drivers)+'</tbody></table></div>';
    if(c.compNote) h+='<div class="ew-note ew-small">'+c.compNote+'</div>';
  }
  h+='<div class="ew-h">Effect on the operating margin</div><div class="ew-note">'+c.why+'</div>';
  if(c.unit) h+=String(c.unit).replace('class="ew-note"','class="ew-note ew-small"');
  h+='<div class="ov-foot">FY'+EW_LAST+' figures unless noted. Sources: '+TPL_EW_SRC+' (Item 7 MD&amp;A by segment; Notes 2, 4, 7, 10, 14 and 16); Form 10-K FY2024 and FY2023 (MD&amp;A) where quoted; Form 10-Q for '+esc(EW_QL.p)+' (filed Aug 5, 2026, acc. 0001811074-26-000058; MD&amp;A); expense series from SEC EDGAR XBRL (see the panel footer). Management commentary is omitted: no TPL earnings-call transcripts are on file in docs/calls.</div>';
  return h;
}
function ewShare(k,y){ var r=TPL_OPEX[y]; return (r&&r.revenue&&r[k]!=null)?r[k]/r.revenue*100:null; }
var EW_SBC_Y=Object.keys(TPL_SBC_FN).map(Number).sort().pop();
var EW_LINES=TPL_EW_LINES.map(function(l){
  var cur=TPL_OPEX[EW_LAST][l.k], sh=ewShare(l.k,EW_LAST), sp=ewShare(l.k,EW_PREV), dm=(sh!=null&&sp!=null)?-(sh-sp):null;
  var o={}; Object.keys(l).forEach(function(x){ o[x]=l[x]; });
  o.traj=TPL_OPEX_YEARS.map(function(y){ var s=ewShare(l.k,y); return s==null?null:Math.round(s*10)/10; });
  o.kpis=[[fM(cur,1),'FY'+EW_LAST+' · '+fPct(sh)+' of revenue'],
          [dm==null?'—':((Math.abs(dm)<0.05?'0.0':(dm>=0?'+':'−')+Math.abs(dm).toFixed(1))+' ppt'),'to operating margin (FY'+EW_LAST+' vs FY'+EW_PREV+')']];
  var sbcL=TPL_SBC_FN[EW_SBC_Y]&&TPL_SBC_FN[EW_SBC_Y][l.k];
  if(sbcL) o.kpis.push([fM(sbcL,1),'share-based compensation inside the line, FY'+EW_SBC_Y+' (10-K Note 10)']);
  // The distinctive figure, computed from the data.
  if(l.k==='sal'){ var hq=EW_QL; o.kpis.push([fM(hq.sal,1), esc(hq.p)+' · '+fPct(hq.sal/hq.revenue*100)+' of revenue']); }
  if(l.k==='water'){ var wr=ry('rev_wso',EW_LAST); o.kpis.push([fPct(wr?cur/wr*100:null),'of Water Services and Operations revenue, FY'+EW_LAST+' (the only segment carrying it)']); }
  if(l.k==='gAdmin'){ var mx=null; TPL_OPEX_YEARS.forEach(function(y){ var r=TPL_OPEX[y]; if(r.legal!=null&&(!mx||r.legal>TPL_OPEX[mx].legal)) mx=y; });
    if(mx) o.kpis.push([fM(TPL_OPEX[mx].legal,1),'legal and professional fees inside G&amp;A in FY'+mx+' (stockholder matters; shown apart until the FY2024 10-K)']); }
  if(l.k==='da'){ var d0=TPL_OPEX[EW_PREV].da; o.kpis.push([(d0?(cur/d0).toFixed(1):'—')+'×','FY'+EW_LAST+' vs FY'+EW_PREV+' — depletion on royalty interests acquired in 2H24 and 2H25']); }
  if(l.k==='adval'){ var fa=null; TPL_OPEX_YEARS.forEach(function(y){ if(fa==null&&TPL_OPEX[y].adval>1) fa=y; }); if(fa) o.kpis.push(['FY'+fa,'first full year TPL paid the ad valorem taxes on its historical royalty interests']); }
  return o; });
function expenseTabsBody(){
  var byk={}; EW_LINES.forEach(function(l){ byk[l.k]=l; });
  var defs=A_LINES.map(function(c){ var v=TPL_OPEX[EW_LAST][c.k], sh=ewShare(c.k,EW_LAST);
    return {k:c.k, c:c.c, n:esc(c.lab), tag:fM(v,1)+' · '+fPct(sh)+' of revenue'}; });
  function tab(d,i){ return '<button type="button" class="exp-tab'+(i===0?' active':'')+'" data-exptab="'+d.k+'"><span class="exp-dot" style="background:'+d.c+'"></span>'+d.n+' <span class="exp-tag">'+d.tag+'</span></button>'; }
  var h='<div class="exp-explorer exp-flat">';
  h+='<div class="exp-tabs">'+defs.map(tab).join('')+'</div>';
  h+='<div class="exp-panels">'+defs.map(function(d,i){ return '<div class="exp-panel exp-panel-card" data-exppanel="'+d.k+'"'+(i>0?' hidden':'')+'>'+(byk[d.k]?ewBase(byk[d.k]):'')+'</div>'; }).join('')+'</div>';
  h+='</div>';
  return h;
}
// ═══ Panel footer — every source, dates read off the data ═══
function tplBlFootGeneral(){
  var y0=TPL_OPEX_YEARS[0], y1=TPL_OPEX_YEARS[TPL_OPEX_YEARS.length-1], q0=TPL_OPEXQ[0], q1=TPL_OPEXQ[TPL_OPEXQ.length-1];
  return '<div class="ov-foot">Sources — '+esc(TPL_OPEX_SRC)+' for the five expense lines (FY'+y0+'–FY'+y1+', '+esc(q0.p)+'–'+esc(q1.p)+'; a Q4 is the year less the nine months), other income, interest, tax, net income and share-based compensation — they tie to reported operating and net income in every period; '+
    'Form 10-K FY2025 Notes 10 and 11 (and FY2024 / FY2023) for SBC by line and other income; the Results dataset (earnings releases, Form 8-K Ex. 99.1, and the Forms 10-K) for operating income, Adjusted EBITDA, net income and free cash flow; '+
    esc(CONS_SRC)+' — the latest of '+CM.vintages.length+' snapshots, through the Results dataset, plus the generated Bloomberg export (as of '+esc(tplBBG.asOf)+') for forward total operating expenses, pretax income, tax and diluted shares. '+
    'No Summit DCF model exists for TPL, so no Summit series is drawn. FY2018–FY2020 are the Texas Pacific Land Trust’s figures as restated by TPL; per-share and share counts are split-adjusted (3-for-1 in March 2024 and December 2025). Forward figures are estimates.'+badOINote()+'</div>';
}
// ═══ Wiring ═══
function aWireCollaps(pane){
  if(pane._meblCollap) return; pane._meblCollap=true;
  pane.addEventListener('click', function(e){ var h=e.target.closest?e.target.closest('.rs-collap-h[data-mebl]'):null; if(!h||!pane.contains(h)) return;
    var b=h.nextElementSibling; if(!b||!b.classList.contains('rs-collap-b')) return;
    var open=b.hidden; b.hidden=!open; var ic=h.querySelector('.rs-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; });
}
function aBuildExpenses(){
  var pane=aPane(); if(!pane) return;
  aWireCollaps(pane);
  aBridgeSync(pane);
  aBuildBridge();
  aBuildNetBridge();
  aBuildSbc();
  var tog=function(sel,after){ pane.querySelectorAll(sel+' button').forEach(function(b){ b.onclick=function(){ pane.querySelectorAll(sel+' button').forEach(function(x){ x.classList.toggle('active',x===b); }); after(); }; }); };
  if(!pane._expWired){ pane._expWired=true;
    tog('.br-mode', function(){ aBridgeSync(pane); aBuildBridge(); });
    tog('.br-gran', function(){ aBridgeSync(pane); aBuildBridge(); });
    tog('.br-yr', aBuildBridge);
    tog('.br-qy', function(){ aBridgeSync(pane); aBuildBridge(); });
    tog('.br-qq', aBuildBridge);
    tog('.br-fy', aBuildBridge);
    tog('.br-from', aBuildBridge); tog('.br-to', aBuildBridge);
    pane.querySelectorAll('.br-fx-sl input[type=range]').forEach(function(s){ s.addEventListener('input', aBuildBridge); });
    var brReset=pane.querySelector('.br-fx-reset'); if(brReset) brReset.onclick=function(){ pane.querySelectorAll('.br-fx-sl input[data-brx]').forEach(function(s){ s.value=0; }); aBuildBridge(); };
    tog('.nb-yr', aBuildNetBridge);
    var etabs=pane.querySelectorAll('.exp-tab[data-exptab]');
    etabs.forEach(function(b){ b.onclick=function(){ var k=b.getAttribute('data-exptab');
      etabs.forEach(function(x){ x.classList.toggle('active',x===b); });
      pane.querySelectorAll('.exp-panel[data-exppanel]').forEach(function(p){ p.hidden=(p.getAttribute('data-exppanel')!==k); }); }; }); }
}

// ═══ Exports — Bottom Line ▸ General, the views stacked top to bottom (no picker; playbook §13) ═══
// Mount: '<div class="ovt-subpane" data-ovst="margins">'+tplBlGeneralHtml()+'</div>' inside .ov-tpl-dd (Bottom Line pane,
// data-dd="bottomline"); build lazily once the pane is visible: tplBlGeneralBuild(root).
export function tplBlGeneralHtml(){
  return '<div class="gen-sec" data-gsec="margins">'+aMarginsBody()+'</div>'+
    '<div class="gen-sec me-bl-gap" data-gsec="bridge">'+aBridgeBody()+'</div>'+
    '<div class="gen-sec me-bl-gap" data-gsec="net">'+aNetBridgeBody()+'</div>'+
    '<div class="gen-sec me-bl-gap" data-gsec="sbc">'+aSbcBody()+'</div>'+
    aCollap('Expense lines — the '+A_LINES.length+' expense lines of the income statement (what is inside, drivers)', expenseTabsBody(), false)+tplBlFootGeneral();
}
export function tplBlGeneralBuild(root){ if(root) _root=root; aBuildMargins(); aBuildExpenses(); }

// ═══ BL-SEG Bottom Line ▸ Segments (playbook §13 BL-SEG) — copied from uber-bl.js's segment section ═══
// Stacked, no picker: Profit by segment → Revenue vs profit → The segment bridge → Segment deep dives → footer.
// TPL discloses, by segment (Note 16): every revenue line, every expense line, operating income, interest, other income,
// tax and NET INCOME — the CODM's measure. Nothing is unallocated: LRM + WSO = consolidated. Bloomberg carries no
// segment forecast for TPL, so segment views are reported-only (consensus appears for Consolidated only).
function sPane(){ return R().querySelector('.dd-pane[data-dd="bottomline"] .ovt-subpane[data-ovst="segments"]')||R().querySelector('.ovt-subpane[data-ovst="segments"]'); }
var SEG_DEF=[{k:'lrm',lab:'Land and Resource Management',sh:'LRM',c:SUMMIT_CAT[0],rk:'rev_lrm',ok:'lrmop',nk:'lrmni'},
             {k:'wso',lab:'Water Services and Operations',sh:'WSO',c:SUMMIT_CAT[1],rk:'rev_wso',ok:'wsoop',nk:'wsoni'}];
var SEG_CONS={k:'cons',lab:'Consolidated',sh:'TPL',c:INK,rk:'rev',ok:'opinc',nk:'netinc'};
function sSeg(k){ return k==='cons'?SEG_CONS:SEG_DEF.filter(function(s){ return s.k===k; })[0]||SEG_DEF[0]; }
function sLastIdx(a){ var j=-1; (a||[]).forEach(function(v,i){ if(v!=null) j=i; }); return j; }
var SEG_YRS=Object.keys(TPL_SEG_Y).map(Number).sort();
// Annual segment values: revenue and net income from the Results dataset (2021+); operating income from Note 16
// (2022+, TPL_SEG_Y), falling back to the dataset.
function segY(s, meas, y){
  if(meas==='rev') return ry(s.rk,y);
  if(meas==='oi'){ if(s.k!=='cons'&&TPL_SEG_Y[y]) return TPL_SEG_Y[y][s.k].oi; if(s.k==='cons'&&TPL_SEG_Y[y]) return TPL_SEG_Y[y].lrm.oi+TPL_SEG_Y[y].wso.oi; return ry(s.ok,y); }
  return ry(s.nk,y);
}
function segQ(s, meas, p){ return rq(meas==='rev'?s.rk:(meas==='oi'?s.ok:s.nk), p); }
var S_QP=RQ.rev_lrm.periods.slice();
var S_YA=RY.rev_lrm.periods.map(Number);

// ── 1 · Profit by segment — Actual (+ Consensus for Consolidated) ──
function sProfitBody(){
  return aStdScaffold({ id:'tp-segfc', title:'Profit by segment — Actual vs Consensus', height:340,
    modes:[{cls:'seg',label:'Segment',opts:SEG_DEF.concat([SEG_CONS]).map(function(s,i){ return {v:s.k,label:s.lab,on:i===0}; })},
           {cls:'meas',label:'Measure',opts:[{v:'ni',label:'Net income (the CODM measure)',on:true},{v:'oi',label:'Operating income'}]},
           {cls:'gran',label:'Period',opts:[{v:'y',label:'Annual',on:true},{v:'q',label:'Quarterly'}]}],
    presets:[['all','All'],['rep','Reported'],['fwd','Forward'],['l5','Last 5']] });
}
function sBuildProfit(){
  aStdRender('tp-segfc', function(st){
    var s=sSeg(st.modes.seg||'lrm'), meas=st.modes.meas||'ni', gran=st.modes.gran||'y', cons=s.k==='cons';
    var lab=(cons?'':s.sh+' ')+(meas==='oi'?'operating income':'net income');
    var labels, la, act, con=null, dA, dC=null, ck=meas==='oi'?'opinc':'netinc';
    if(gran==='q'){
      var per=S_QP.slice(); act=per.map(function(p){ return segQ(s,meas,p); }); la=aLastActIdx(act);
      labels=per.slice();
      if(cons){ var fq=consKeysQ(ck).filter(function(p){ return qOrd(p)>qOrd(per[la]); }).sort(function(a,b){ return qOrd(a)-qOrd(b); });
        labels=per.slice(0,la+1).concat(fq); act=act.slice(0,la+1).concat(fq.map(function(){ return null; }));
        con=labels.map(function(p,i){ if(i<=la) return null; var v=consQ(ck,p); return meas==='oi'?cleanOI(v,consQ('rev',p),p+'E'):v; });
        dC=labels.map(function(p,i){ return i>la?consQ('rev',p):null; }); }
      dA=labels.map(function(p){ return segQ(s,'rev',p); });
      labels=labels.map(function(p,i){ return i>la?p+'E':p; });
    } else {
      var yrs=S_YA.slice(); act=yrs.map(function(y){ return segY(s,meas,y); }); la=aLastActIdx(act);
      if(cons){ var fy=consKeysY(ck).filter(function(y){ return y>yrs[la]; });
        yrs=yrs.slice(0,la+1).concat(fy); act=act.slice(0,la+1).concat(fy.map(function(){ return null; }));
        con=yrs.map(function(y,i){ if(i<=la) return null; var v=consY(ck,y); return meas==='oi'?cleanOI(v,consY('rev',y),fyLab(y)+'E'):v; });
        dC=yrs.map(function(y,i){ return i>la?consY('rev',y):null; }); }
      dA=yrs.map(function(y){ return segY(s,'rev',y); });
      labels=yrs.map(function(y,i){ return fyLab(y)+(i>la?'E':''); });
    }
    function amt(a){ return labels.map(function(_,i){ return a&&a[i]!=null?Math.round(a[i]*10)/10:null; }); }
    function marg(a,r){ return labels.map(function(_,i){ return (a&&a[i]!=null&&r&&r[i])?Math.round(a[i]/r[i]*1000)/10:null; }); }
    var series=[
      {k:'act$',grp:'act',src:'Actual',label:lab+' — Actual',color:ASTD_ACT,type:'bar',data:amt(act)},
      {k:'con$',grp:'con',src:'Consensus',label:lab+' — Consensus',color:ASTD_CONS,type:'bar',data:amt(con)},
      {k:'actM',grp:'act',src:'Actual',label:'Margin — Actual',color:ASTD_ACT,type:'line',yAxisID:'y2',data:marg(act,dA)},
      {k:'conM',grp:'con',src:'Consensus',label:'Margin — Consensus',color:ASTD_CONS,type:'line',yAxisID:'y2',dash:true,data:marg(con,dC)}];
    series=series.filter(function(x){ return x.data.some(function(v){ return v!=null; }); });
    var first=Math.min.apply(null, series.map(function(x){ var j=x.data.findIndex(function(v){ return v!=null; }); return j<0?labels.length:j; }));
    if(first>0 && first<labels.length){ labels=labels.slice(first); series.forEach(function(x){ x.data=x.data.slice(first); }); la-=first; }
    var notes=[];
    notes.push(meas==='ni'?'Segment net income — “'+esc(TPL_SEG_TXT.codm.split('. ')[0])+'.” (10-K FY2025, Note 2) Reported by segment for every period.':
      'Segment operating income — disclosed by segment from FY2022 in the 10-K (Note 16) and quarterly from 1Q24 (Results dataset); earlier quarters were never disclosed.');
    notes.push(cons?'Consolidated = LRM + WSO (nothing is unallocated). Consensus: '+esc(CONS_SRC)+'.'+(meas==='oi'?badOINote():''):'Bloomberg carries no segment forecast for TPL, so segments show reported periods only.');
    notes.push('Margin on the segment’s revenue. No Summit line: there is no Summit model for TPL.');
    var out={ labels:labels, lastAct:la, type:'bar', stacked:false, series:series, note:notes.join(' '), paired:true, yFmt:M_FMT, y2Fmt:function(x){ return x+'%'; } };
    return out;
  });
}

// ── 2 · Revenue vs profit — common size by segment ──
function sMixBody(){
  return aStdScaffold({ id:'tp-segmix', title:'Revenue and profit — common size by segment', height:340,
    metricSel:[{v:'rev',label:'Revenue',on:true,group:'Revenue'},{v:'oi',label:'Segment operating income',group:'Profit'},{v:'ni',label:'Segment net income (the CODM measure)',group:'Profit'}],
    modes:[{cls:'show',label:'Show',opts:[{v:'amt',label:'$M',on:true},{v:'share',label:'Share'},{v:'growth',label:'Growth'}]},
           {cls:'layout',label:'Layout',opts:[{v:'stack',label:'Stacked',on:true},{v:'side',label:'Side by side'}]},
           {cls:'gran',label:'Period',opts:[{v:'y',label:'Annual',on:true},{v:'q',label:'Quarterly'}]},
           {cls:'cmp',label:'Compare',opts:[{v:'yoy',label:'YoY',on:true},{v:'qoq',label:'QoQ'}]},
           {cls:'gin',label:'Growth in',opts:[{v:'pct',label:'%',on:true},{v:'add',label:'$ added'}]}],
    presets:[['all','All'],['l5','Last 5'],['l8','Last 8']] });
}
function sBuildMix(){
  aStdRender('tp-segmix', function(st){
    var metric=st.sel||'rev', show=st.modes.show||'amt', layout=st.modes.layout||'stack', gran=st.modes.gran||'y';
    var cmp=st.modes.cmp||'yoy', gin=st.modes.gin||'pct', notes=[];
    var labels=gran==='q'?S_QP.slice():S_YA.map(fyLab), keys=gran==='q'?S_QP.slice():S_YA.slice();
    function raw(s){ return keys.map(function(k){ return gran==='q'?segQ(s,metric,k):segY(s,metric,k); }); }
    var step=gran==='q'?(cmp==='qoq'?1:4):1, addMode=(show==='growth'&&gin==='add');
    var rows=SEG_DEF.map(function(s){ return { s:s, v:raw(s) }; });
    var totals=labels.map(function(_,i){ var t=0, all=true; rows.forEach(function(r){ if(r.v[i]==null) all=false; else t+=r.v[i]; }); return all?t:null; });
    function val(v, pv, tot){ if(v==null) return null;
      if(show==='share') return tot?Math.round(v/tot*1000)/10:null;
      if(show==='growth'){ if(pv==null) return null; if(addMode) return Math.round((v-pv)*10)/10; return !pv?null:Math.round((v-pv)/Math.abs(pv)*1000)/10; }
      return Math.round(v*10)/10; }
    var series=rows.map(function(r){ return { k:r.s.k, label:r.s.lab, color:r.s.c, type:'bar',
      data:labels.map(function(_,i){ return val(r.v[i], i-step>=0?r.v[i-step]:null, totals[i]); }) }; });
    if(show==='amt') series.push({ k:'tot', label:'Consolidated', color:INK, type:'line', stack:'tot', data:totals.map(function(v){ return v==null?null:Math.round(v*10)/10; }) });
    var first=Math.min.apply(null, series.map(function(x){ var j=x.data.findIndex(function(v){ return v!=null; }); return j<0?labels.length:j; }));
    if(first>0 && first<labels.length){ labels=labels.slice(first); series.forEach(function(x){ x.data=x.data.slice(first); }); }
    if(metric==='oi') notes.push('Segment operating income: annual from FY2022 (Note 16), quarterly from 1Q24.');
    if(metric==='ni') notes.push('Segment net income, the measure TPL’s CODM uses; reported for every period.');
    if(metric==='rev') notes.push('Land and Resource Management = oil and gas royalties, its easements and land sales; Water Services and Operations = water sales, produced water royalties and its easements.');
    notes.push('The two segments add up to the consolidated figure (nothing unallocated). Reported periods only: Bloomberg carries no segment forecast for TPL.');
    var stacked=show==='share'||(show==='amt'&&layout==='stack')||(addMode&&layout==='stack');
    var yFmt=(show==='amt'||addMode)?M_FMT:function(x){ return x+'%'; };
    var hide=[]; if(!(show==='growth'&&gran==='q')) hide.push('cmp'); if(show!=='growth') hide.push('gin'); if(show==='share') hide.push('layout');
    return { labels:labels, lastAct:labels.length-1, yFmt:yFmt, type:'bar', stacked:stacked, yMax:show==='share'?100:undefined, series:series, hideModes:hide, note:notes.join(' ') };
  });
}

// ── 3 · The segment bridge — By segment (Δ segment profit) | By cost (Note 16 expense lines) — Historical only ──
var SBR_Q=TPL_SEG_Q.length>=2?TPL_SEG_Q:null;
function sBridgeBody(){
  function yB(cls, ys, sel){ return ys.map(function(y){ return '<button type="button" data-'+cls+'="'+y+'"'+(y===sel?' class="active"':'')+'>'+fyLab(y)+'</button>'; }).join(''); }
  var nY=S_YA.length, nC=SEG_YRS.length;
  return '<div class="ov-sec"><div class="ov-sec-h">The segment bridge — what moved segment profit</div>'+
    '<div class="mch-ctl"><span class="acx-tog sbr-mode"><button type="button" data-sbrm="seg" class="active">By segment</button><button type="button" data-sbrm="cost">By cost — revenue and each expense line</button></span><span></span></div>'+
    '<div class="sbr-ctl-seg mch-ctl me-bl-ctl"><span class="acx-tog sbr-meas"><button type="button" data-sbrme="ni" class="active">Net income</button><button type="button" data-sbrme="oi">Operating income</button></span><span class="me-bl-pills">'+
      '<span class="me-bl-lbl">From</span><span class="acx-tog sbr-from">'+yB('sbrf',S_YA,S_YA[Math.max(0,nY-4)])+'</span>'+
      '<span class="me-bl-lbl">to</span><span class="acx-tog sbr-to">'+yB('sbrt',S_YA,S_YA[nY-1])+'</span></span></div>'+
    '<div class="sbr-ctl-cost mch-ctl me-bl-ctl" hidden>'+
      '<span class="acx-tog sbr-seg">'+SEG_DEF.map(function(s,i){ return '<button type="button" data-sbrs="'+s.k+'"'+(i===0?' class="active"':'')+'>'+esc(s.lab)+'</button>'; }).join('')+'</span>'+
      '<span class="me-bl-pills"><span class="acx-tog sbr-gran"><button type="button" data-sbrg="y" class="active">Annual</button>'+(SBR_Q?'<button type="button" data-sbrg="q">Quarter vs a year earlier</button>':'')+'</span>'+
        '<span class="sbr-cy"><span class="me-bl-lbl">From</span><span class="acx-tog sbr-cfrom">'+yB('sbrcf',SEG_YRS,SEG_YRS[nC-2])+'</span>'+
        '<span class="me-bl-lbl">to</span><span class="acx-tog sbr-cto">'+yB('sbrct',SEG_YRS,SEG_YRS[nC-1])+'</span></span>'+
      '</span></div>'+
    '<div class="me-bl-h340"><canvas id="tpSegBr"></canvas></div>'+
    '<div id="tpSegBr-tbl" class="me-bl-tblhost"></div>'+
    '<div class="acx-cap me-bl-note" id="tpSegBrCap"></div></div>';
}
function sBridgeSync(pane){
  var mb=pane.querySelector('.sbr-mode .active'), mode=mb?mb.getAttribute('data-sbrm'):'seg';
  aShow(pane.querySelector('.sbr-ctl-seg'), mode==='seg'); aShow(pane.querySelector('.sbr-ctl-cost'), mode==='cost');
  var g=pane.querySelector('.sbr-gran .active'), q=!!(g&&g.getAttribute('data-sbrg')==='q');
  aShow(pane.querySelector('.sbr-cy'), !q);
}
var FWD_OMIT=' Historical only: a forward segment bridge needs segment consensus, which Bloomberg does not carry for TPL.';
function sBuildBridge(){
  var pane=sPane(); if(!pane) return;
  var mb=pane.querySelector('.sbr-mode .active'), mode=mb?mb.getAttribute('data-sbrm'):'seg', cap=pane.querySelector('#tpSegBrCap'), steps;
  function A(sel,attr){ var b=pane.querySelector(sel+' .active'); return b?b.getAttribute(attr):null; }
  if(mode==='seg'){
    var meas=A('.sbr-meas','data-sbrme')||'ni', y0=+A('.sbr-from','data-sbrf'), y1=+A('.sbr-to','data-sbrt'), ml=meas==='oi'?'operating income':'net income', ms=meas==='oi'?'op. income':'net income';
    if(!(y1>y0)){ aDestroy('tpSegBr'); var tw=$id('tpSegBr-tbl'); if(tw) tw.innerHTML=''; if(cap) cap.innerHTML='Pick a “to” year after the “from” year.'; return; }
    var v0=SEG_DEF.map(function(s){ return segY(s,meas,y0); }), v1=SEG_DEF.map(function(s){ return segY(s,meas,y1); });
    if(v0.concat(v1).some(function(v){ return v==null; })){ aDestroy('tpSegBr'); var tw0=$id('tpSegBr-tbl'); if(tw0) tw0.innerHTML=''; if(cap) cap.innerHTML='No segment '+ml+' for '+(v0.some(function(v){ return v==null; })?fyLab(y0):fyLab(y1))+': segment operating income starts in '+fyLab(SEG_YRS[0])+' (Note 16).'; return; }
    var t0=v0.reduce(function(a,v){ return a+v; },0), run=t0;
    steps=[{label:fyLab(y0)+' '+ms, kind:'base', color:INK, range:[0,run], runAfter:run, val:run}];
    var parts=SEG_DEF.map(function(s,i){ var d=v1[i]-v0[i], lo=run; run=lo+d;
      steps.push({label:s.sh, kind:d>=0?'up':'down', color:s.c, dc:d>=0?POS:NEG, range:[Math.min(lo,run),Math.max(lo,run)], runAfter:run, val:d}); return d; });
    steps.push({label:fyLab(y1)+' '+ms, kind:'total', color:POS, range:[0,run], runAfter:null, val:run});
    aBuildBrWaterfall('tpSegBr', steps, BR_FMT_D);
    if(cap) cap.innerHTML='TPL '+ml+' went from <b>'+fM(t0)+'</b> in '+fyLab(y0)+' to <b>'+fM(run)+'</b> in '+fyLab(y1)+': '+
      SEG_DEF.map(function(s,i){ return esc(s.lab)+' '+(parts[i]>=0?'added':'took')+' <b>'+fM(Math.abs(parts[i]))+'</b>'; }).join(', ')+'.'+FWD_OMIT+' Source: '+esc(TPL_SEG_SRC)+'.';
    return;
  }
  var k=A('.sbr-seg','data-sbrs')||'lrm', s=sSeg(k), gq=A('.sbr-gran','data-sbrg')==='q', a, b, la, lb;
  if(gq&&SBR_Q){ a=SBR_Q[SBR_Q.length-2][k]; b=SBR_Q[SBR_Q.length-1][k]; la=SBR_Q[SBR_Q.length-2].p; lb=SBR_Q[SBR_Q.length-1].p; }
  else { var c0=+A('.sbr-cfrom','data-sbrcf'), c1=+A('.sbr-cto','data-sbrct');
    if(!(c1>c0)){ aDestroy('tpSegBr'); var tw2=$id('tpSegBr-tbl'); if(tw2) tw2.innerHTML=''; if(cap) cap.innerHTML='Pick a “to” year after the “from” year.'; return; }
    a=TPL_SEG_Y[c0][k]; b=TPL_SEG_Y[c1][k]; la=fyLab(c0); lb=fyLab(c1); }
  var run2=a.oi;
  steps=[{label:la+' op. income', kind:'base', color:a.oi>=0?INK:NEG, range:[Math.min(0,run2),Math.max(0,run2)], runAfter:run2, val:a.oi}];
  function st2(lab, d){ if(Math.abs(d)<0.0005) return; var lo=run2; run2=lo+d; steps.push({label:lab, kind:d>=0?'up':'down', color:d>=0?POS:NEG, range:[Math.min(lo,run2),Math.max(lo,run2)], runAfter:run2, val:d}); }
  st2('Revenue', b.rev-a.rev);
  A_LINES.forEach(function(it){ st2(it.sh, -(b[it.k]-a[it.k])); });
  steps.push({label:lb+' op. income', kind:'total', color:b.oi>=0?POS:NEG, range:[Math.min(0,run2),Math.max(0,run2)], runAfter:null, val:run2});
  aBuildBrWaterfall('tpSegBr', steps, BR_FMT_D);
  if(cap){ var mA=a.rev?a.oi/a.rev*100:null, mB=b.rev?b.oi/b.rev*100:null, big=null;
    A_LINES.forEach(function(it){ var d=b[it.k]-a[it.k]; if(big==null||Math.abs(d)>Math.abs(big.d)) big={lab:it.lab, d:d}; });
    cap.innerHTML='<b>'+esc(s.lab)+'</b>, '+la+' → '+lb+' (segment operating income): revenue '+(b.rev>=a.rev?'added':'took')+' <b>'+fM(Math.abs(b.rev-a.rev))+'</b>; the largest cost move was '+esc(big.lab.toLowerCase())+' ('+fMd(big.d)+') — margin on revenue '+fPct(mA)+' → '+fPct(mB)+'.'+
      (gq?' The quarter is compared with the same quarter a year earlier (Form 10-Q 2Q26 segment note).':' Years from Note 16 (FY2022 from the FY2024 10-K).')+FWD_OMIT+' Source: '+esc(TPL_SEG_SRC)+'.'; }
}

// ── 4 · Segment deep dives (collapsible) — one tab per segment, same formal layout as the Expense lines ──
function sSpark(vals, labs, fmt){ var mx=Math.max.apply(null,vals.map(function(v){ return Math.abs(v||0); }))||1;
  return '<div class="ew-spark">'+vals.map(function(v,i){ return '<div class="ew-sb'+(i===vals.length-1?' on':'')+'"><div class="ew-sb-v">'+fmt(v)+'</div><div class="ew-sb-bar" style="height:'+(v==null?0:Math.max(2,Math.round(Math.abs(v)/mx*72)))+'px"></div><div class="ew-sb-l">'+labs[i]+'</div></div>'; }).join('')+'</div>'; }
function sCostTable(k){
  var rows=SEG_YRS.map(function(y){ return [fyLab(y), TPL_SEG_Y[y][k]]; });
  TPL_SEG_Q.forEach(function(r){ rows.push([r.p, r[k]]); });
  var hd='<th>Period</th><th>Revenue</th>'+A_LINES.map(function(it){ return '<th>'+esc(it.sh)+'</th>'; }).join('')+'<th>Operating income</th><th>Net income</th><th>Op. margin</th>';
  return '<div class="twrap ew-twrap"><table class="rt ew-tbl"><thead><tr>'+hd+'</tr></thead><tbody>'+
    rows.map(function(r){ var d=r[1], m=d.rev?d.oi/d.rev*100:null;
      return '<tr><td class="ew-tk">'+r[0]+'</td><td>'+fM(d.rev,1)+'</td>'+A_LINES.map(function(it){ return '<td>'+(d[it.k]?fM(d[it.k],1):'—')+'</td>'; }).join('')+'<td>'+fM(d.oi,1)+'</td><td>'+fM(d.ni,1)+'</td><td>'+fPct(m)+'</td></tr>'; }).join('')+
    '</tbody></table></div>';
}
function sDive(d){
  var k=d.k, s=sSeg(k), yL=SEG_YRS[SEG_YRS.length-1], ey=TPL_SEG_Y[yL][k], totRev=TPL_OPEX[yL]?TPL_OPEX[yL].revenue:null;
  var qL=TPL_SEG_Q[TPL_SEG_Q.length-1], qP=TPL_SEG_Q[TPL_SEG_Q.length-2];
  var costs=A_LINES.map(function(it){ return {lab:it.lab, v:ey[it.k]||0}; }).sort(function(a,b){ return b.v-a.v; }), totC=costs.reduce(function(a,c){ return a+c.v; },0);
  var kp=[[fM(ey.rev,1), fyLab(yL)+' revenue · '+fPct(totRev?ey.rev/totRev*100:null)+' of TPL'],
    [fM(ey.ni,1), fyLab(yL)+' segment net income · '+fPct(ey.ni/ey.rev*100)+' of revenue'],
    [fM(qL[k].oi,1), qL.p+' segment operating income · '+fPct(qL[k].oi/qL[k].rev*100)+' margin ('+fPct(qP[k].oi/qP[k].rev*100)+' in '+qP.p+')'],
    [fPct(totC?costs[0].v/totC*100:null), 'of '+fyLab(yL)+' segment expenses are '+esc(costs[0].lab.toLowerCase())]];
  var h='<div class="ew-h">Key figures</div><div class="ov-kpis">'+kp.map(function(x){ return '<div class="ov-kpi"><div class="ov-kpi-v">'+x[0]+'</div><div class="ov-kpi-d muted">'+x[1]+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ew-h">Definition — Form 10-K</div><div class="ew-q ew-def">“'+d.def+'”<span class="ew-att">— TPL Form 10-K for FY'+yL+', Note 16</span></div>';
  h+='<div class="ew-h">The business</div><div class="ew-note">'+d.business+'</div>';
  var qs=S_QP.filter(function(p){ return segQ(s,'ni',p)!=null&&segQ(s,'rev',p); }), mv=qs.map(function(p){ return segQ(s,'ni',p)/segQ(s,'rev',p)*100; });
  h+='<div class="ew-h">Segment net income, % of segment revenue, '+qs[0]+'–'+qs[qs.length-1]+'</div>'+
    sSpark(mv, qs, function(v){ return v==null?'—':v.toFixed(0)+'%'; });
  h+='<div class="ew-h">Cost structure — what Note 16 breaks out by segment</div>'+sCostTable(k);
  h+='<div class="ew-note ew-small">US$ million. Annual from Note 16 (FY2022 from the FY2024 10-K); '+esc(qP.p)+' and '+esc(qL.p)+' from the Form 10-Q 2Q26 segment note. “'+esc(TPL_SEG_TXT.intinc)+'”</div>';
  h+='<div class="ew-h">What drives it</div><div class="twrap ew-twrap"><table class="rt ew-tbl"><tbody>'+d.moves.map(function(m){ return '<tr><td class="ew-tk">'+m[0]+'</td><td>'+m[1]+'</td></tr>'; }).join('')+'</tbody></table></div>';
  h+='<div class="ew-h">What the segment note discloses — and what it does not</div><div class="twrap ew-twrap"><table class="rt ew-tbl"><tbody>'+
    ewTableRows('Disclosed by segment', [['','Income statement','Every revenue line and every expense line, operating income, interest expense, other income, income tax and net income (Note 16; quarterly in the Forms 10-Q).'],
      ['','Capital','Purchases of fixed assets, total assets and property, plant and equipment, net (Note 16).']])+
    ewTableRows('Not disclosed by segment', [['','Operating income before FY2022','Segment net income is reported for every period; segment operating income only from FY2022 (annual) and 1Q24 (quarterly).'],
      ['','A forecast','Bloomberg carries no segment consensus for TPL, so no forward view is drawn.']])+
    ewTableRows('What is not allocated', [['','Nothing','“'+esc(TPL_SEG_TXT.elim)+'” The two segments add up to the consolidated statements.']])+
    '</tbody></table></div>';
  h+='<div class="ov-foot">Sources: '+esc(TPL_SEG_SRC)+'; MD&amp;A drivers verbatim from the Form 10-K FY2025. Management commentary is omitted: no TPL earnings-call transcripts are on file in docs/calls.</div>';
  return h;
}
function sDivesBody(){
  var yL=SEG_YRS[SEG_YRS.length-1];
  var tabs=TPL_SEG_DIVES.map(function(d,i){ var s=sSeg(d.k), e=TPL_SEG_Y[yL][d.k];
    return '<button type="button" class="exp-tab'+(i===0?' active':'')+'" data-segtab="'+d.k+'"><span class="exp-dot" style="background:'+s.c+'"></span>'+esc(d.name)+' <span class="exp-tag">'+fM(e.ni,1)+' net income · '+fyLab(yL)+'</span></button>'; }).join('');
  return '<div class="exp-explorer exp-flat"><div class="exp-tabs">'+tabs+'</div><div class="exp-panels">'+
    TPL_SEG_DIVES.map(function(d,i){ return '<div class="exp-panel exp-panel-card" data-segpanel="'+d.k+'"'+(i>0?' hidden':'')+'>'+sDive(d)+'</div>'; }).join('')+'</div></div>';
}
function tplBlFootSegments(){
  return '<div class="ov-foot">Sources — '+esc(TPL_SEG_SRC)+': segment revenue and net income '+fyLab(S_YA[0])+'–'+fyLab(S_YA[S_YA.length-1])+' and '+esc(S_QP[0])+'–'+esc(S_QP[S_QP.length-1])+', segment operating income and every expense line by segment '+fyLab(SEG_YRS[0])+'–'+fyLab(SEG_YRS[SEG_YRS.length-1])+' (quarterly operating income from 1Q24); '+
    esc(CONS_SRC)+', through the Results dataset, for the consolidated forward years only — Bloomberg carries no segment forecast for TPL. No Summit DCF model exists for TPL, so no Summit series is drawn. Forward figures are estimates.'+badOINote()+'</div>';
}
function sBuildSegments(){
  var pane=sPane(); if(!pane) return;
  aWireCollaps(pane);
  sBuildProfit(); sBuildMix(); sBridgeSync(pane); sBuildBridge();
  if(pane._segWired) return; pane._segWired=true;
  var tog=function(sel,after){ pane.querySelectorAll(sel+' button').forEach(function(b){ b.onclick=function(){ pane.querySelectorAll(sel+' button').forEach(function(x){ x.classList.toggle('active',x===b); }); after(); }; }); };
  ['.sbr-mode','.sbr-gran'].forEach(function(s){ tog(s, function(){ sBridgeSync(pane); sBuildBridge(); }); });
  ['.sbr-meas','.sbr-from','.sbr-to','.sbr-seg','.sbr-cfrom','.sbr-cto'].forEach(function(s){ tog(s, sBuildBridge); });
  var stabs=pane.querySelectorAll('.exp-tab[data-segtab]');
  stabs.forEach(function(b){ b.onclick=function(){ var key=b.getAttribute('data-segtab');
    stabs.forEach(function(x){ x.classList.toggle('active',x===b); });
    pane.querySelectorAll('.exp-panel[data-segpanel]').forEach(function(p){ p.hidden=(p.getAttribute('data-segpanel')!==key); }); }; });
}
// Mount: '<div class="ovt-subpane" data-ovst="segments">'+tplBlSegmentsHtml()+'</div>' in the Bottom Line pane;
// build lazily once visible: tplBlSegmentsBuild(root).
export function tplBlSegmentsHtml(){
  return '<div class="seg-gsec" data-sgsec="oimargin">'+sProfitBody()+'</div>'+
    '<div class="seg-gsec me-bl-gap" data-sgsec="mix">'+sMixBody()+'</div>'+
    '<div class="seg-gsec me-bl-gap" data-sgsec="bridge">'+sBridgeBody()+'</div>'+
    aCollap('Segment deep dives — Land and Resource Management and Water Services and Operations (key figures, cost structure, drivers, what is disclosed)', sDivesBody(), false)+tplBlFootSegments();
}
export function tplBlSegmentsBuild(root){ if(root) _root=root; sBuildSegments(); }
