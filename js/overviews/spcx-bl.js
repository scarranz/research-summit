// spcx-bl.js — SpaceX Deep Dive ▸ Bottom Line ▸ General (BL-GEN-1…5) and Segments (BL-SEG), docs/PROFILE_PLAYBOOK.md §13.
//
// COPIED from js/overviews/googl-bl.js (meta-bl.js → tsm-bl.js → the dependency closure of amzn.js), then adapted to
// SpaceX — never reimplemented:
//   • data: ./spcx-bbg.js (SAB's Bloomberg export, same shape as the generated *-bbg.js files) for the income statement,
//     SBC, diluted shares and consensus; ./spcx-bl-data.js for the reported functional expense lines (424B4 / 10-Q), the
//     segment cost split, basic shares and the expense-line and segment dives; ../results-data/spcx.js for the quarterly
//     segment series and segment adjusted EBITDA.
//   • expense lines = SpaceX's own: cost of revenue · R&D · SG&A · restructuring, impairment & other. Cost of revenue goes
//     FIRST and apart in every bridge view, with a Gross profit subtotal; the 424B4 gives it as one total, so one bar.
//   • NO Summit model for SpaceX (search_ticker('SPCX') → no match, Nov 25 2026): every chart is Actual + Consensus only.
//   • EPS / net income basis: GAAP (SAB). Quarterly consensus is shown through 4Q27 only (SAB): Q_LAST below.
//   • EBITDA = the company's Adjusted EBITDA (Q3 2026 release, Note 1); Bloomberg's EBITDA field equals it in every
//     reported period, so the label says "Adj. EBITDA (company definition)".
//   • Normalized net income = GAAP − other income (expense), net, after tax at the period's effective rate; where that
//     rate is not meaningful (a loss year or a tax benefit) the item is removed with no tax effect, and the note says so.
//   • Segments: Space · Connectivity · SI (AI in the 424B4). Reported segment years come from SPCX_SEG_Y (424B4 Note 19),
//     not the Results dataset, whose SI FY2023 operating income has the wrong sign (+3,973 vs the filing's (3,973)).
//   • Annex A: no typed years (derived from the data); shares axis on the right; no inline <style> (css/overview.css);
//     no hex colours (Summit tokens from js/viz-palette.js); DOM lookups scoped to the SpaceX root, not document.
import { SUMMIT_CAT, SUMMIT_INK, SUMMIT_MUTE, SUMMIT_POS, SUMMIT_NEG, fade } from '../viz-palette.js';
import { spcxBBG } from './spcx-bbg.js';
import { spcxResults } from '../results-data/spcx.js';
import { SPCX_OPEX_YEARS, SPCX_OPEX, SPCX_OPEXQ, SPCX_SHARES_BASIC, SPCX_SHARES_NOTE, SPCX_EW_LINES, SPCX_EW_SRC,
  SPCX_SEG_Y, SPCX_SEG_Q, SPCX_SEG_SRC, SPCX_SEG_NOTE, SPCX_SEG_DIVES } from './spcx-bl-data.js';

var INK=SUMMIT_INK, MUTE=SUMMIT_MUTE, POS=SUMMIT_POS, NEG=SUMMIT_NEG, ONEOFF=SUMMIT_CAT[3];
var GRID='rgba(0,0,0,0.06)';
// spcx-bbg.js keeps Bloomberg's field slugs; alias the ones this copied code reads, so the functions run unchanged.
(function(is){ var AL={ sbc:'stockBasedCompensation', pretax:'preTaxIncome' };
  Object.keys(AL).forEach(function(k){ if(!is[k] && is[AL[k]]) is[k]=is[AL[k]]; }); })(spcxBBG.is);
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
// ── DOM scope: everything is looked up inside the SpaceX Deep Dive root (set by the build functions), never document-wide.
var _root=null;
function R(){ return _root||document.querySelector('.ov-spcx-dd')||document; }
function $id(id){ return R().querySelector('#'+id); }
function aPane(){ return R().querySelector('.dd-pane[data-dd="bottomline"] .ovt-subpane[data-ovst="margins"]'); }
// Chart.js helpers (lazy: panes must be visible — offsetParent — before building).
var _aCharts={};
function aDestroy(id){ if(_aCharts[id]){ _aCharts[id].destroy(); _aCharts[id]=null; } }
function aChartReady(id){ var cv=$id(id); return (cv&&typeof Chart!=='undefined'&&cv.offsetParent)?cv:null; }
// ═══ Chart-standard kit (docs/CHART_ENGINE_REFERENCE.md §0.7) — copied verbatim from googl-bl.js ═══
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
// ═══ SAB-parity chart scaffold (docs/AMZN_BOTTOM_LINE §9b) — row1 title + metric dropdown; row2 mode pills ·
// Range presets; legend chips; chart; period slider; collapsible table. A chart registers derive(state) →
// {labels,lastAct,series:[{k,label,color,data,type,yAxisID,stack}],yFmt,note}. ═══
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
    var bd=vis.map(function(s){ return '<tr><td class="me-bl-td0">'+esc(s.label)+'</td>'+s.data.slice(lo,hi+1).map(function(v){ return '<td>'+(v==null?'—':esc(String(yFmt(v))))+'</td>'; }).join('')+'</tr>'; }).join('');
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
  var blk=aStdBlk(id); if(!blk) return; var n=labels.length, w=_aStd[id].win, d=Math.max(1,n-1);
  var r0=blk.querySelector('.astd-r0'), r1=blk.querySelector('.astd-r1'), fill=blk.querySelector('[data-astdfill]'), ticks=blk.querySelector('[data-astdticks]'), e0=blk.querySelector('[data-astdend0]'), e1=blk.querySelector('[data-astdend1]');
  if(r0){ r0.max=n-1; r0.value=w[0]; } if(r1){ r1.max=n-1; r1.value=w[1]; }
  if(fill){ fill.style.left=(w[0]/d*100)+'%'; fill.style.width=((w[1]-w[0])/d*100)+'%'; }
  if(e0) e0.textContent=labels[w[0]]||''; if(e1) e1.textContent=labels[w[1]]||'';
  if(ticks){ var h=''; for(var i=0;i<n;i++){ h+='<span class="rs-tick'+(i>=w[0]&&i<=w[1]?' on':'')+(i>la?' est':'')+'" style="left:'+(i/d*100)+'%"></span>'; } ticks.innerHTML=h; }
}
function aStdPresetWin(code, n, la){ switch(code){ case 'rep': return [0,la]; case 'fwd': return [Math.max(0,la),n-1];
  case 'l3': return [Math.max(0,la-2),la]; case 'l5': return [Math.max(0,la-4),la];
  case 'l4': return [Math.max(0,la-3),la]; case 'l8': return [Math.max(0,la-7),la]; default: return [0,n-1]; } }
function aStdWire(id){
  var blk=aStdBlk(id); if(!blk || blk._astdWired) return; blk._astdWired=true; var st=_aStd[id];
  blk.addEventListener('click', function(e){
    var mode=e.target.closest&&e.target.closest('[data-astdmode]'); if(mode){ var p=mode.getAttribute('data-astdmode').split('|'); st.modes[p[1]]=p[2]; st.yr=null;   // units may change: drop the y-zoom
      if(p[1]==='gran') st.win=null;   // a new period axis (annual ⇄ quarterly) starts on its full range
      mode.parentNode.querySelectorAll('.rs-view').forEach(function(x){ x.classList.toggle('active',x===mode); }); aStdRender(id); return; }
    var lg=e.target.closest&&e.target.closest('[data-astdlegk]'); if(lg){ var k=lg.getAttribute('data-astdlegk').split('|')[1]; st.hidden[k]=!st.hidden[k]; aStdRender(id); return; }
    var lgg=e.target.closest&&e.target.closest('[data-astdleggrp]'); if(lgg){ var g=lgg.getAttribute('data-astdleggrp').split('|')[1], spc=_aStdDerive[id]&&_aStdDerive[id](st);
      if(spc){ var mem=spc.series.filter(function(s){ return (s.grp||s.k)===g; }), off=mem.every(function(s){ return st.hidden[s.k]; }); mem.forEach(function(s){ st.hidden[s.k]=!off; }); } aStdRender(id); return; }
    var rp=e.target.closest&&e.target.closest('[data-astdrange]'); if(rp){ var spec=_aStdDerive[id]&&_aStdDerive[id](st); var n=spec?spec.labels.length:2, la=spec&&spec.lastAct!=null?spec.lastAct:n-1;
      st.win=aStdPresetWin(rp.getAttribute('data-astdrange').split('|')[1], n, la); st.yr=null; aStdRender(id); return; }
  });
  var sel=blk.querySelector('[data-astdsel]'); if(sel) sel.onchange=function(){ st.sel=sel.value; st.yr=null; aStdRender(id); };
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
// ═══ The functional lines — SpaceX's (424B4 MD&A). Cost of revenue is FIRST and apart (one hue, orange); the operating
// expenses share another (blue, three steps), so "producing" and "operating" read apart. ═══
var A_MB_COST=[
  {k:'costOfSales',lab:'Cost of revenue',c:SUMMIT_CAT[1],cogs:true},
  {k:'rnd',lab:'Research & development',c:SUMMIT_CAT[0]},
  {k:'sga',lab:'Selling, general & administrative',c:fade(SUMMIT_CAT[0],0.62)},
  {k:'otherOpex',lab:'Restructuring, impairment & other',c:fade(SUMMIT_CAT[0],0.36)}
];
var A_OPX=A_MB_COST.filter(function(it){ return !it.cogs; }), A_COGS=A_MB_COST.filter(function(it){ return it.cogs; });
var A_BR_SHORT={ costOfSales:'Cost of revenue', rnd:'R&D', sga:'SG&A', otherOpex:'Restructuring & other', other:'Consensus residual' };
// ═══ The bridge — revenue → gross profit → operating income ($B), margin change (bps), forward, cost structure ═══
// Ported from dis.js (boBridgePlugin/buildBoBridge) via amzn.js: floating bars + dashed connectors + delta labels.
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
        y:{ position:'right', beginAtZero:true, grid:{color:GRID}, ticks:{color:MUTE, font:{size:11}, callback:function(v){return (fmt.axis||String)(v);}} } } },
    plugins:[ aBrPlugin ] });
  ch._steps=steps; ch._fmt=fmt; _aCharts[id]=ch; ch.update('none'); aZoom(id);
  var tw=$id(id+'-tbl');   // rule 3: the table carries every step drawn
  if(tw){ var f=(fmt&&fmt.base)||String, fd=(fmt&&fmt.delta)||String;
    tw.innerHTML=aTbl(id, 'The waterfall — every step', ['Step','Value','Running'], steps.map(function(s){
      return [s.label, (s.kind==='base'||s.kind==='total')?f(s.val):fd(s.val), s.runAfter==null?f(s.val):f(s.runAfter)]; })); }
}
var GP_COL=fade(POS,0.55);   // the Gross profit subtotal: a lighter shade of the operating-income total
// Revenue → − cost of revenue → = Gross profit → − each operating expense → = Operating income, $B, one period row.
// A line that is null (a forward year: consensus has no restructuring line) is skipped, not drawn as zero.
function aBridgeBuildupSteps(r){
  var rev=r.revenue/1000, run=rev;
  var steps=[{label:'Revenue', kind:'base', color:INK, range:[0,run], runAfter:run, val:rev}];
  function down(k,lab,c){ if(r[k]==null) return; var v=r[k]/1000, hi=run; run=hi-v;
    steps.push({label:lab, kind:'down', color:c, dc:MUTE, range:[Math.min(run,hi),Math.max(run,hi)], runAfter:run, val:-v}); }
  A_COGS.forEach(function(it){ down(it.k, A_BR_SHORT[it.k]||it.lab, it.c); });
  steps.push({label:'Gross profit', kind:'total', color:GP_COL, range:[0,run], runAfter:run, val:run});
  A_OPX.forEach(function(it){ down(it.k, A_BR_SHORT[it.k]||it.lab, it.c); });
  if(r.other!=null && Math.abs(r.other)>=50) down('other', A_BR_SHORT.other, MUTE);   // forward rows only: consensus does not tie line by line
  steps.push({label:'Op. income', kind:'total', color:run>=0?POS:NEG, range:[0,run], runAfter:null, val:run});
  return steps;
}
// Operating-margin change between two years, decomposed by line: cost of revenue first, then a subtotal, then opex.
function aBridgeBpsSteps(prev, cur, labA, labB){
  var rev=cur.revenue, prevRev=prev.revenue;
  var m0=(prevRev - A_MB_COST.reduce(function(a,it){return a+prev[it.k];},0))/prevRev*100, run=m0;
  var steps=[{label:labA, kind:'base', color:INK, range:[0,run], runAfter:run, val:m0}];
  function contrib(it){ var c=(prev[it.k]/prevRev - cur[it.k]/rev)*100, lo=run; run=lo+c;
    steps.push({label:A_BR_SHORT[it.k]||it.lab, kind:c>=0?'up':'down', color:c>=0?POS:NEG, range:[Math.min(lo,run),Math.max(lo,run)], runAfter:run, val:c}); }
  A_COGS.forEach(contrib);
  steps.push({label:'After cost of revenue', kind:'total', color:GP_COL, range:[0,run], runAfter:run, val:run});
  A_OPX.forEach(contrib);
  steps.push({label:labB, kind:'total', color:INK, range:[0,run], runAfter:null, val:run});
  return steps;
}
function sgn$(v,d){ return (v<0?'−$':'$')+Math.abs(v).toFixed(d); }
var BR_FMT_D={ axis:function(v){return sgn$(v,0)+'B';}, base:function(v){return sgn$(v,1)+'B';}, delta:function(v){return (v>=0?'+$':'−$')+Math.abs(v).toFixed(1)+'B';} };
var BR_FMT_BPS={ axis:function(v){return v.toFixed(0)+'%';}, base:function(v){return v.toFixed(1)+'%';}, delta:function(v){var b=Math.round(v*100); return (b>=0?'+':'−')+Math.abs(b)+' bps';} };
// Synthetic row for a forward year (fi = index into the export's forward years) built from BBG consensus, shaped like a
// SPCX_OPEX row. Each Bloomberg field is its own analyst set, so revenue − cost of revenue − R&D − SG&A ≠ consensus
// operating income: the gap is `other`, the "Consensus residual", held fixed — with every slider at 0 the bridge ties to
// consensus operating income and moving a slider lets operating income float. Consensus has no restructuring line.
var FX_LINES=[{k:'costOfSales',lab:'Cost of revenue'},{k:'rnd',lab:'R&amp;D'},{k:'sga',lab:'SG&amp;A'}];
function aFwdOpexRow(fi, adj){
  function f(k){ var s=spcxBBG.is[k]; return s?s.f[fi]:null; }
  var rev=f('rev'), oi=f('oi'); if(rev==null||oi==null) return null;
  var cogs=f('cogs'); if(cogs==null){ var gp=f('grossProfit'); cogs=(gp!=null)?(rev-gp):0; }
  var rnd=f('rnd')||0, sga=f('sga')||0;
  adj=adj||{}; function A(v,k){ return v*(1+((adj[k]||0)/100)); }
  return { p:A_FYLAB[A_YA.length+fi], revenue:rev, costOfSales:A(cogs,'costOfSales'), rnd:A(rnd,'rnd'), sga:A(sga,'sga'), otherOpex:null,
    other:rev-cogs-rnd-sga-oi };
}
function fyLab(y){ return 'FY'+String(y).slice(2); }
function aBridgeBody(){
  var yBtns=function(cls,sel){ return SPCX_OPEX_YEARS.map(function(y){ return '<button type="button" data-'+cls+'="'+y+'"'+(y===sel?' class="active"':'')+'>'+fyLab(y)+'</button>'; }).join(''); };
  var qYears=[]; SPCX_OPEXQ.forEach(function(r){ if(qYears.indexOf(r.yr)<0) qYears.push(r.yr); });
  var qLast=SPCX_OPEXQ[SPCX_OPEXQ.length-1], yN=SPCX_OPEX_YEARS.length;
  var qyBtns=qYears.map(function(y){ return '<button type="button" data-brqy="'+y+'"'+(y===qLast.yr?' class="active"':'')+'>'+fyLab(y)+'</button>'; }).join('');
  var qqBtns=['Q1','Q2','Q3','Q4'].map(function(q){ return '<button type="button" data-brqq="'+q+'"'+(q===qLast.q?' class="active"':'')+'>'+q+'</button>'; }).join('');
  return '<div class="ov-sec"><div class="ov-sec-h">The bridge — how revenue becomes operating income</div>'+
    '<div class="mch-ctl">'+   /* §0.4 row 2: mode (left) */
      '<span class="acx-tog br-mode"><button type="button" data-brm="buildup" class="active">Build-up ($B)</button><button type="button" data-brm="bps">Margin change (bps)</button><button type="button" data-brm="fexp">Forward (expenses)</button><button type="button" data-brm="cs">Cost structure</button></span>'+
      '<span></span>'+
    '</div>'+
    '<div class="br-ctl-bu mch-ctl me-bl-ctl">'+   /* build-up window (right) */
      '<span></span>'+
      '<span class="me-bl-pills">'+
        '<span class="acx-tog br-gran"><button type="button" data-brg="y" class="active">Annual</button><button type="button" data-brg="q">Quarterly</button></span>'+
        '<span class="acx-tog br-yr br-sel-y">'+yBtns('bry',SPCX_OPEX_YEARS[yN-1])+'</span>'+
        '<span class="acx-tog br-qy br-sel-q" hidden>'+qyBtns+'</span>'+
        '<span class="acx-tog br-qq br-sel-q" hidden>'+qqBtns+'</span>'+
      '</span>'+
    '</div>'+
    '<div class="br-ctl-bps mch-ctl me-bl-ctl" hidden><span></span>'+   /* margin-change from → to */
      '<span class="me-bl-pills"><span class="me-bl-lbl">From</span><span class="acx-tog br-from">'+yBtns('brf',SPCX_OPEX_YEARS[Math.max(0,yN-4)])+'</span>'+
      '<span class="me-bl-lbl">to</span><span class="acx-tog br-to">'+yBtns('brt',SPCX_OPEX_YEARS[yN-1])+'</span></span></div>'+
    '<div class="br-ctl-fexp mch-ctl me-bl-ctl" hidden>'+   /* forward year (right) */
      '<span></span>'+
      '<span class="me-bl-pills"><span class="acx-tog br-fy">'+aFwdBtns('brfy')+'</span>'+
        '<button type="button" class="br-fx-reset">Reset to consensus</button></span>'+
    '</div>'+
    '<div class="br-fx-sl me-bl-sliders" hidden>'+
      '<div class="me-bl-lbl">Sensitize each cost line vs consensus (0% = BBG consensus). Operating income floats with your changes:</div>'+
      FX_LINES.map(function(l){ return '<div class="br-sl"><span class="br-sl-l">'+l.lab+'</span><input type="range" data-brx="'+l.k+'" min="-25" max="25" step="1" value="0"><span class="br-sl-v" data-brxv="'+l.k+'">0%</span></div>'; }).join('')+
    '</div>'+
    '<div class="br-wf"><div class="me-bl-h340"><canvas id="sxBrCanvas"></canvas></div>'+
    '<div id="sxBrCanvas-tbl" class="me-bl-tblhost"></div>'+
    '<div class="me-bl-note br-wf-note">The 424B4 and the Forms 10-Q disclose cost of revenue only as a total, so it is one bar, then Gross profit, then the operating expenses — R&amp;D, SG&amp;A, and restructuring, impairment &amp; other. Forward years: each Bloomberg field is its own analyst set, so revenue less the consensus cost lines does not equal consensus operating income; the grey Consensus residual bar is that gap, held fixed while the sliders move (consensus has no restructuring line).</div></div>'+
    '<div class="br-cs" hidden>'+aStdScaffold({ id:'sx-cs', bare:true, tblTitle:'Cost structure — every line', height:320,
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
  if(q){   // grey out quarters not yet reported for the picked year; snap the active pill onto an available quarter
    var yb=pane.querySelector('.br-qy .active'), yy=yb?+yb.getAttribute('data-brqy'):null;
    var avail=SPCX_OPEXQ.filter(function(r){ return r.yr===yy; }).map(function(r){ return r.q; });
    var qbtns=pane.querySelectorAll('.br-qq button'), anyActive=false;
    qbtns.forEach(function(b){ var ok=avail.indexOf(b.getAttribute('data-brqq'))>=0; b.disabled=!ok; b.classList.toggle('me-bl-off',!ok); if(b.classList.contains('active')&&!ok) b.classList.remove('active'); });
    qbtns.forEach(function(b){ if(b.classList.contains('active')) anyActive=true; });
    if(!anyActive&&avail.length){ var lastQ=avail[avail.length-1]; qbtns.forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-brqq')===lastQ); }); }
  }
}
// Cost structure — every line as a % of revenue over time (stacked), with the gross and operating margins on top.
// Answers "did the cost of producing move, or the cost of operating?". Reported periods only. No 0–100 clamp: in FY2023
// the costs were 134% of revenue (the X impairment), so the operating margin line goes below zero.
var CS_GM=SUMMIT_MUTE, CS_OM=SUMMIT_INK;
function aBuildCostStructure(){
  aStdRender('sx-cs', function(st){
    var gran=st.modes.gran||'y', rows, labels;
    if(gran==='q'){ rows=SPCX_OPEXQ; labels=rows.map(function(r){ return r.p; }); }
    else { rows=SPCX_OPEX_YEARS.map(function(y){ return SPCX_OPEX[y]; }); labels=SPCX_OPEX_YEARS.map(fyLab); }
    function pct(v,r){ return (v==null||!r.revenue)?null:Math.round(v/r.revenue*1000)/10; }
    var series=A_MB_COST.map(function(it){ return { k:it.k, label:it.lab+' — % of revenue', color:it.c, type:'bar', data:rows.map(function(r){ return pct(r[it.k],r); }) }; });
    series.push({ k:'gm', label:'Gross margin', color:CS_GM, type:'line', stack:'gm', dash:true, data:rows.map(function(r){ return pct(r.revenue-r.costOfSales,r); }) });
    series.push({ k:'om', label:'Operating margin', color:CS_OM, type:'line', stack:'om', data:rows.map(function(r){ return pct(r.revenue-A_MB_COST.reduce(function(a,it){ return a+r[it.k]; },0),r); }) });
    return { labels:labels, lastAct:labels.length-1, type:'bar', stacked:true, series:series, tblWhat:'% of revenue',
      yFmt:function(x){ return (x==null?'':(+x).toFixed(1))+'%'; },
      legCap:'Bars stack each cost as a share of revenue (cost of revenue first, then the operating expenses); lines = margins.' };
  });
}
function aBuildBridge(){
  var pane=aPane(); if(!pane) return;
  var mb=pane.querySelector('.br-mode .active'), mode=mb?mb.getAttribute('data-brm'):'buildup', r;
  if(mode==='cs'){ aBuildCostStructure(); return; }
  if(mode==='bps'){   // margin change between two years, decomposed by line
    var fb=pane.querySelector('.br-from .active'), tb=pane.querySelector('.br-to .active');
    var ya=fb?+fb.getAttribute('data-brf'):SPCX_OPEX_YEARS[0], yb2=tb?+tb.getAttribute('data-brt'):SPCX_OPEX_YEARS[SPCX_OPEX_YEARS.length-1], prev=SPCX_OPEX[ya], cur=SPCX_OPEX[yb2];
    if(prev&&cur) aBuildBrWaterfall('sxBrCanvas', aBridgeBpsSteps(prev,cur,fyLab(ya),fyLab(yb2)), BR_FMT_BPS);
    return;
  }
  if(mode==='fexp'){   // forward expense build-up — BBG consensus year, sensitizable per cost line
    var fyb=pane.querySelector('.br-fy .active'), fi=fyb?+fyb.getAttribute('data-brfy'):0, adj={};
    pane.querySelectorAll('.br-fx-sl input[data-brx]').forEach(function(s){ adj[s.getAttribute('data-brx')]=+s.value;
      var v=pane.querySelector('.br-sl-v[data-brxv="'+s.getAttribute('data-brx')+'"]'); if(v) v.textContent=((+s.value)>0?'+':'')+s.value+'%'; });
    r=aFwdOpexRow(fi, adj);
  } else {             // build-up — reported year or quarter
    var g=pane.querySelector('.br-gran .active'), gran=g?g.getAttribute('data-brg'):'y';
    if(gran==='q'){ var yq=pane.querySelector('.br-qy .active'), qb=pane.querySelector('.br-qq .active');
      var yy=yq?+yq.getAttribute('data-brqy'):SPCX_OPEXQ[SPCX_OPEXQ.length-1].yr, qq=qb?qb.getAttribute('data-brqq'):SPCX_OPEXQ[SPCX_OPEXQ.length-1].q;
      r=SPCX_OPEXQ.filter(function(x){ return x.yr===yy && x.q===qq; })[0]; }
    else { var yb=pane.querySelector('.br-yr .active'); r=SPCX_OPEX[yb?+yb.getAttribute('data-bry'):SPCX_OPEX_YEARS[SPCX_OPEX_YEARS.length-1]]; }
  }
  if(!r) return;
  aBuildBrWaterfall('sxBrCanvas', aBridgeBuildupSteps(r), BR_FMT_D);
}
// ═══ Fiscal-year axis DERIVED from the BBG export (yearsA = reported, yearsF = consensus forward) — never typed ═══
var A_YA=spcxBBG.yearsA, A_YF=spcxBBG.yearsF, A_YRS=A_YA.concat(A_YF), A_LA=A_YA.length-1;
var A_FYLAB=A_YA.map(fyLab).concat(A_YF.map(function(y){ return fyLab(y)+'E'; }));
function aFyVal(s,y){ if(!s) return null; var i=A_YA.indexOf(y); if(i>=0) return s.a?s.a[i]:null; i=A_YF.indexOf(y); return (i>=0&&s.f)?s.f[i]:null; }
function aIsVal(k,y){ return aFyVal(spcxBBG.is[k], y); }
// Forward-year pills generated from the BBG export's forward years.
function aFwdBtns(attr){ return A_YF.map(function(y,i){ return '<button type="button" data-'+attr+'="'+i+'"'+(i===0?' class="active"':'')+'>'+fyLab(y)+'E</button>'; }).join(''); }
// Quarterly consensus is shown through 4Q27 only (SAB): the last quarterly label kept.
var Q_LAST='4Q27';
function qEnd(labels){ for(var i=0;i<labels.length;i++){ if(String(labels[i]).replace(/E$/,'')===Q_LAST) return i; } return labels.length-1; }
// Normalization: other income (expense), net — OI&E = pretax income − operating income − net interest (Bloomberg's
// netInterest is interest expense less interest income, so net interest on income is its negative) — taken out after
// tax at the period's effective rate. SpaceX's rate is not meaningful in most years (loss years, tax benefits): outside
// 0–50% the item comes out with no tax effect. Returns US$ million.
function aNetInt(y){ var n=aIsVal('netInterest',y); return n==null?0:-n; }
function aOie(y){ var oi=aIsVal('oi',y), pt=aIsVal('pretax',y); return (oi==null||pt==null)?null:pt-oi-aNetInt(y); }
function aEtrRaw(y){ var pt=aIsVal('pretax',y), tx=aIsVal('tax',y); return (pt&&tx!=null)?tx/pt:null; }
function aEtr(y){ var t=aEtrRaw(y), pt=aIsVal('pretax',y); return (t!=null&&pt>0&&t>=0&&t<=0.5)?t:0; }
function aEtrOk(y){ var t=aEtrRaw(y), pt=aIsVal('pretax',y); return t!=null&&pt>0&&t>=0&&t<=0.5; }
function aNormSubY(y){ var o=aOie(y); return o==null?0:o*(1-aEtr(y)); }
function aB(v){ return '$'+(Math.abs(v)/1000).toFixed(2)+'B'; }
// ── BL-GEN-3 Operating income → net income, with the OI&E normalization. Consolidated from BBG (spcxBBG.is), actuals +
// consensus. Net interest is its own step; other income (expense), net is the amber step; Normalized removes it and
// shows the tax without its effect (tax − rate × OI&E). ──
function aNetBridgeBody(){
  var yb=A_YRS.map(function(y){ return '<button type="button" data-nbyr="'+y+'"'+(y===A_YF[0]?' class="active"':'')+'>'+fyLab(y)+(A_YF.indexOf(y)>=0?'E':'')+'</button>'; }).join('');
  return '<div class="ov-sec"><div class="ov-sec-h">Operating income → net income — and the OI&amp;E normalization</div>'+
    '<div class="mch-ctl">'+   /* §0.4 row 2: treatment (left) · window (right) */
      '<span class="acx-tog nb-norm"><button type="button" data-nbnorm="rep" class="active">Reported</button><button type="button" data-nbnorm="norm">Normalized</button></span>'+
      '<span class="acx-tog nb-yr">'+yb+'</span>'+
    '</div>'+
    '<div class="me-bl-h330"><canvas id="sxNetBr"></canvas></div>'+
    '<div id="sxNetBr-tbl" class="me-bl-tblhost"></div>'+
    '<div class="acx-cap me-bl-note" id="sxNetBrCap"></div></div>';
}
function aBuildNetBridge(){
  var pane=aPane(); if(!pane) return;
  var yb=pane.querySelector('.nb-yr .active'), y=yb?+yb.getAttribute('data-nbyr'):A_YF[0];
  var nt=pane.querySelector('.nb-norm .active'), norm=!!(nt&&nt.getAttribute('data-nbnorm')==='norm');
  var oi=aIsVal('oi',y), tax=aIsVal('tax',y), pretax=aIsVal('pretax',y), net=aIsVal('netIncome',y), rev=aIsVal('rev',y);
  if(oi==null||net==null||tax==null||pretax==null) return;
  function B(x){ return x==null?0:x/1000; }
  var I=aNetInt(y), O=pretax-oi-I, t=aEtr(y), tOk=aEtrOk(y);   // net interest, OI&E (ties to pretax), usable tax rate
  var plug=net-(pretax-tax);                                    // consensus components do not always add up (reported years tie)
  var run=B(oi), steps=[{label:'Op. income', kind:'base', color:INK, range:[0,run], runAfter:run, val:B(oi)}];
  function step(lab,d,c){ var lo=run; run=lo+d; steps.push({label:lab, kind:d>=0?'up':'down', color:c||MUTE, dc:c||MUTE, range:[Math.min(lo,run),Math.max(lo,run)], runAfter:run, val:d}); }
  step('Net interest', B(I));
  if(!norm){ step('Other income (expense), net', B(O), ONEOFF); step('Income tax', B(-tax)); }
  else step('Income tax (ex OI&E)', B(-(tax-t*O)));
  if(Math.abs(plug)>=50) step('Consensus residual', B(plug));   // consensus components that do not add up to its net income
  var nNet=net-O*(1-t), endNet=norm?nNet:net;
  run=B(endNet); steps.push({label:(norm?'Net income (norm.)':'Net income'), kind:'total', color:endNet>=0?POS:NEG, range:[0,run], runAfter:null, val:B(endNet)});
  aBuildBrWaterfall('sxNetBr', steps, BR_FMT_D);
  var cap=pane.querySelector('#sxNetBrCap');
  if(cap){ var est=A_YF.indexOf(y)>=0, yl=fyLab(y)+(est?'E':''), rm=rev?net/rev*100:null, nm=rev?nNet/rev*100:null, tr=aEtrRaw(y);
    var s1='<b>'+yl+'</b> — net margin <b>'+(rm==null?'—':rm.toFixed(1)+'%')+'</b> reported, <b>'+(nm==null?'—':nm.toFixed(1)+'%')+'</b> normalized; net interest '+(I>=0?'+':'−')+aB(I)+', effective tax rate '+(tOk?'<b>'+(t*100).toFixed(0)+'%</b>':'not meaningful ('+(tr==null?'—':(tr*100).toFixed(0)+'%')+(pretax<0?' on a pretax loss':(tr<0?', a tax benefit':', above 50%'))+')')+'.';
    var s2=' The <span class="me-bl-amber"><span class="me-bl-swatch" style="background:'+ONEOFF+'"></span>amber bar</span> is other income (expense), net, of '+(O>=0?'+':'−')+aB(O)+'; Normalized removes it '+(tOk?'after tax ('+(O*(1-t)>=0?'−':'+')+aB(O*(1-t))+')':'with no tax effect, as the rate is not meaningful')+'.';
    var s3=' Source: Bloomberg consensus export (as of '+esc(spcxBBG.asOf)+'), GAAP basis'+(est?'; '+yl+' is an estimate'+(y===A_YF[0]?' that already contains the reported quarters':''):'')+'.';
    cap.innerHTML=s1+s2+s3; }
}
// ── BL-GEN-4 SBC & dilution (amzn.js aSbcBody / aBuildSbc via googl-bl.js). SBC bars + diluted shares (reported, then
// consensus) + basic shares (reported, 424B4). No Summit share series. SpaceX discloses SBC by segment, not by
// income-statement line, so the "SBC by line" view is not offered. Both y axes on the RIGHT (§17.3; Annex A9). ──
function aSbcBody(){
  return '<div class="ov-sec"><div class="ov-sec-h">Stock-based compensation &amp; dilution</div>'+
    '<div class="mch-ctl">'+
      '<span></span>'+
      '<span class="acx-tog sbcu-tog"><button type="button" data-sbcu="usd" class="active">$B</button><button type="button" data-sbcu="pct">%</button></span>'+
    '</div>'+
    '<div class="ave-leg me-bl-sbcleg" data-sbcleg="1"></div>'+
    '<div class="me-bl-h320"><canvas id="sxSbcMain"></canvas></div></div>';
}
function aSbcSer(k){ var s=spcxBBG.is[k]; return s?s.a.concat(s.f):A_YRS.map(function(){ return null; }); }
function aBuildSbc(){
  var pane=aPane(); if(!pane) return;
  var uw=pane.querySelector('.sbcu-tog .active'), pct=!!(uw&&uw.getAttribute('data-sbcu')==='pct');   // $B vs % of revenue
  var cv=aChartReady('sxSbcMain'); if(!cv) return; aDestroy('sxSbcMain');
  var labels=A_FYLAB.slice(), legEl=pane.querySelector('[data-sbcleg]');
  var SBC_BAR=fade(INK,0.42), SBC_BAR_E=fade(INK,0.2);
  var sbc=aSbcSer('sbc'), sh=aSbcSer('dilShares'), rvS=aSbcSer('rev');
  var bars=labels.map(function(_,i){ return sbc[i]==null?null:(pct?(rvS[i]?Math.round(sbc[i]/rvS[i]*1000)/10:null):Math.round(sbc[i]/100)/10); });
  var shAct=labels.map(function(_,i){ return (i<=A_LA&&sh[i]!=null)?Math.round(sh[i]):null; });
  var shCon=labels.map(function(_,i){ return (i>=A_LA&&sh[i]!=null)?Math.round(sh[i]):null; });   // starts at the last reported year so the line connects
  var shBas=A_YRS.map(function(y){ return SPCX_SHARES_BASIC[y]!=null?SPCX_SHARES_BASIC[y]:null; });
  _aCharts['sxSbcMain']=new Chart(cv.getContext('2d'),{ data:{ labels:labels, datasets:[
    { type:'bar', label:'SBC '+(pct?'(% of revenue)':'($B)'), data:bars, backgroundColor:bars.map(function(_,i){ return i<=A_LA?SBC_BAR:SBC_BAR_E; }), borderColor:'white', borderWidth:1, maxBarThickness:46, yAxisID:'y', order:3 },
    { type:'line', label:'Diluted shares — reported', data:shAct, borderColor:ASTD_ACT, backgroundColor:ASTD_ACT, borderWidth:2.6, pointRadius:2.6, tension:0.15, yAxisID:'y1', order:1 },
    { type:'line', label:'Basic shares — reported (424B4)', data:shBas, borderColor:SUMMIT_CAT[0], backgroundColor:SUMMIT_CAT[0], borderWidth:2, pointRadius:2.4, tension:0.15, borderDash:[2,3], yAxisID:'y1', order:1 },
    { type:'line', label:'Diluted shares — consensus (BBG)', data:shCon, borderColor:ASTD_CONS, backgroundColor:ASTD_CONS, borderWidth:2.6, pointRadius:2.6, tension:0.15, borderDash:[5,4], yAxisID:'y1', order:2 } ]},
    options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(c){ if(c.parsed.y==null) return null; return c.dataset.yAxisID==='y1'? c.dataset.label+': '+c.parsed.y.toLocaleString('en-US')+'M'+(c.dataIndex>A_LA?' (E)':'') : c.dataset.label+': '+(pct?c.parsed.y+'%':'$'+c.parsed.y.toFixed(1)+'B')+(c.dataIndex>A_LA?' (E)':''); } } } },
      scales:{ x:{ grid:{ display:false } },
        y:{ position:'right', title:{ display:true, text:pct?'SBC (% of revenue)':'SBC ($B)', font:{ size:11 } }, grid:{ color:GRID }, beginAtZero:true, ticks:{ callback:function(v){ return pct?v+'%':'$'+v+'B'; } } },
        y1:{ position:'right', weight:1, title:{ display:true, text:'Shares (M)', font:{ size:11 } }, grid:{ display:false }, beginAtZero:true, grace:'10%', ticks:{ callback:function(v){ return v.toLocaleString('en-US'); } } } } } });
  var N=SPCX_SHARES_NOTE, fm=function(v){ return Math.round(v).toLocaleString('en-US')+'M'; }, yF=A_YA[0], yL=A_YA[A_LA];
  var iP=-1; A_YA.forEach(function(y,i){ var b=SPCX_SHARES_BASIC[y]; if(iP<0&&b&&sh[i]!=null&&sh[i]>b*1.5) iP=i; });   // the year diluted ≫ basic
  if(legEl) legEl.innerHTML='<span class="me-bl-legcap">The share base changes meaning across the period: before the xAI merger (Feb 2026) and the IPO (Jun 2026) SpaceX had '+fm(SPCX_SHARES_BASIC[yF])+'–'+fm(SPCX_SHARES_BASIC[yL])+' basic shares ('+fyLab(yF)+'–'+fyLab(yL)+'); 3Q26 diluted was '+fm(N.q3_26diluted)+' (Q3 2026 release), and consensus has '+fm(sh[sh.length-1])+' in '+labels[labels.length-1]+'. '+
    (iP>=0?labels[iP]+'’s '+fm(sh[iP])+' diluted is the 424B4’s own figure, not an error: in a profit year the diluted count adds '+fm(N.prefConv2024)+' from converting the preferred stock; in the loss years diluted = basic. ':'')+
    'Pro forma for that conversion, '+fyLab(yL)+' shares were '+fm(N.proForma2025)+'. SBC by income-statement line is not disclosed (only by segment). Click a legend item to hide it.</span>';
  aZoom('sxSbcMain');
  if(!pane._sbcmWired){ pane._sbcmWired=true;
    pane.querySelectorAll('.sbcu-tog button').forEach(function(b){ b.onclick=function(){ b.parentNode.querySelectorAll('button').forEach(function(x){ x.classList.toggle('active',x===b); }); aBuildSbc(); }; }); }
}
// ═══ BL-GEN-1 Profitability & margins ═══
function aMarginsBody(){
  return aStdScaffold({ id:'sx-margins', title:'Profitability & margins', height:360,
    metricSel:[{v:'gross',label:'Gross profit',group:'Profit'},{v:'operating',label:'Operating income (GAAP)',on:true,group:'Profit'},{v:'ebitda',label:'Adj. EBITDA (company definition)',group:'Profit'},{v:'net',label:'Net income (GAAP)',group:'Profit'},{v:'fcf',label:'Free cash flow',group:'Cash'}],
    modes:[{cls:'gran',label:'Period',opts:[{v:'y',label:'Annual',on:true},{v:'q',label:'Quarterly'}]},
           {cls:'norm',label:'Net',opts:[{v:'rep',label:'Reported',on:true},{v:'norm',label:'Normalized'}]}],
    presets:[['all','All'],['rep','Reported'],['fwd','Forward'],['l5','Last 5']] });
}
function aLastActIdx(arr){ var la=0; for(var i=0;i<arr.length;i++) if(arr[i]!=null) la=i; return la; }
var MARG_LAB2={gross:'Gross profit',operating:'Op. income',ebitda:'Adj. EBITDA',net:'Net income',fcf:'FCF'};
// Dual-axis: the $ amount as bars (Actual / Consensus) + the margin % as lines on the right y2 axis.
// normSub[i] = the amount to SUBTRACT for the normalized value (OI&E after tax at the period's usable rate).
function aMargDual(lab, actNum, conNum, rev, normOn, normSub){
  function amt(v,i){ if(v==null) return null; if(normOn&&normSub) v=v-(normSub[i]||0); return Math.round(v/100)/10; }
  function marg(v,i){ if(v==null||!rev[i]) return null; if(normOn&&normSub) v=v-(normSub[i]||0); return Math.round(v/rev[i]*1000)/10; }
  var series=[
    {k:'act$',grp:'act',src:'Actual',label:lab+' — Actual',color:ASTD_ACT,type:'bar',data:actNum.map(amt)},
    {k:'con$',grp:'con',src:'Consensus',label:lab+' — Consensus',color:ASTD_CONS,type:'bar',data:conNum.map(amt)},
    {k:'actM',grp:'act',src:'Actual',label:'Margin — Actual',color:ASTD_ACT,type:'line',yAxisID:'y2',data:actNum.map(marg)},
    {k:'conM',grp:'con',src:'Consensus',label:'Margin — Consensus',color:ASTD_CONS,type:'line',yAxisID:'y2',dash:true,data:conNum.map(marg)} ];
  return series.filter(function(x){ return x.data.some(function(v){ return v!=null; }); });   // a series with no value anywhere is not drawn
}
function aNormNote(){
  return 'Normalized takes out other income (expense), net — the non-operating items other than net interest — after tax at each year’s effective rate (Bloomberg export); where that rate is not meaningful (a pretax loss or a tax benefit, as in most SpaceX years) it comes out with no tax effect. In forward years OI&amp;E is derived — consensus pretax income − operating income − net interest, three separate Bloomberg fields — so it also carries the gap between those analyst sets'+(function(){ var w=null; A_YF.forEach(function(y){ var o=aOie(y); if(o!=null&&(w==null||Math.abs(o)>Math.abs(w.o))) w={y:y,o:o}; }); return w?' (largest: '+fyLab(w.y)+'E, '+(w.o<0?'−':'+')+aB(w.o)+')':''; })()+'; read the forward Normalized line with that in mind. A forward year’s consensus already contains its reported quarters.';
}
function aMetricNote(metric){
  var s=SPCX_OPEX[SPCX_OPEX_YEARS[0]], y0=SPCX_OPEX_YEARS[0];
  if(metric==='gross') return 'Gross profit = revenue − cost of revenue, which the 424B4 and the 10-Qs give as one total. 3Q26 includes about 3 points of one-off tariff refunds in Connectivity; the CFO expects 4Q26 total-company gross margin “to be more consistent with the second quarter” (Q3 2026 call).';
  if(metric==='operating'){ var adj=s.revenue-s.costOfSales-s.rnd-s.sga-s.otherOpex+s.otherOpex;
    return 'One-offs inside reported operating income: '+fyLab(y0)+' carries $3.8B of impairment of X’s intangible assets plus $0.2B of restructuring (operating margin '+((s.revenue-s.costOfSales-s.rnd-s.sga-s.otherOpex)/s.revenue*100).toFixed(1)+'% reported, '+(adj/s.revenue*100).toFixed(1)+'% without the line); 3Q26 carries $1.2B of stock-based compensation tied to the Cursor acquisition (SI).'; }
  if(metric==='ebitda') return 'Adj. EBITDA (company definition) = net income excluding depreciation and amortization, share-based compensation (including acquisition-related awards), acquisition-related costs, restructuring, impairments, interest, other income (expense) and income taxes (Q3 2026 release, Note 1). Bloomberg’s EBITDA field equals it in every reported period. Not GAAP.';
  if(metric==='fcf') return 'Free cash flow = cash from operations − capital expenditure (Bloomberg). Negative while the compute and Starship build-out runs; consensus turns positive in '+(function(){ var f=spcxBBG.is.fcf; if(!f) return '—'; for(var i=0;i<f.f.length;i++) if(f.f[i]>0) return fyLab(A_YF[i])+'E'; return 'no forecast year'; })()+'.';
  return '';
}
function aBuildMargins(){
  aStdRender('sx-margins', function(st){
    var gran=st.modes.gran||'y', metric=st.sel||'operating', lab=MARG_LAB2[metric];
    var normVis=(metric==='net'&&gran==='y'), normOn=normVis&&st.modes.norm==='norm';   // Normalized only for annual net income (§13)
    var out={ type:'bar', stacked:false, hideModes:normVis?[]:['norm'], paired:true,
      yFmt:function(x){ return (x<0?'−$':'$')+(x==null?'':Math.abs(x).toFixed(1))+'B'; }, y2Fmt:function(x){ return x+'%'; } };
    var MET={gross:'grossProfit',operating:'oi',ebitda:'ebitda',net:'netIncome',fcf:'fcf'};
    var num=spcxBBG.is[MET[metric]], rvb=spcxBBG.is.rev; if(!num||!rvb) return null;
    if(gran==='q'){   // quarterly — BBG (Actual + Consensus), consensus through 4Q27 only
      var qe=qEnd(spcxBBG.qtrs), ql=spcxBBG.qtrs.slice(0,qe+1), nq=num.q, rq=rvb.q, laq=(num.qA?num.qA.length-1:aLastActIdx(nq));
      var actQ=ql.map(function(_,i){ return i<=laq?nq[i]:null; }), conQ=ql.map(function(_,i){ return i>laq?nq[i]:null; });
      out.labels=ql; out.lastAct=laq; out.series=aMargDual(lab, actQ, conQ, rq, false, null);
      out.note=aMetricNote(metric)+(metric==='net'?' Normalized is annual only.':'')+' Quarterly consensus is shown through '+Q_LAST+'.';
      return out;
    }
    var labelsY=A_FYLAB.slice(), laY=A_LA;
    var na=num.a.concat(num.f), rvY=rvb.a.concat(rvb.f);
    var normSub=metric==='net'?A_YRS.map(aNormSubY):null;
    var actN=labelsY.map(function(_,i){ return i<=laY?na[i]:null; }), conN=labelsY.map(function(_,i){ return i>laY?na[i]:null; });
    out.labels=labelsY; out.lastAct=laY; out.series=aMargDual(lab, actN, conN, rvY, normOn, normSub);
    out.note=normVis?aNormNote():aMetricNote(metric);
    return out;
  });
}
// ═══ BL-GEN-5 Expense lines — one tab per line (cost of revenue first, apart), the dive rendered inline ═══
var EW_LABS=SPCX_OPEX_YEARS.map(function(y){ return '’'+String(y).slice(2); });
function ewSpark(vals,onIdx){ var mx=Math.max.apply(null,vals.map(Math.abs))||1;
  return '<div class="ew-spark">'+vals.map(function(v,i){ return '<div class="ew-sb'+(i===onIdx?' on':'')+'"><div class="ew-sb-v">'+v+'%</div><div class="ew-sb-bar" style="height:'+Math.max(2,Math.round(Math.abs(v)/mx*72))+'px"></div><div class="ew-sb-l">'+EW_LABS[i]+'</div></div>'; }).join('')+'</div>';
}
// Sort key for a call label — '3Q25' (house format) or 'Q3 2025'.
function ewQord(q){ var m=/(\d)Q(\d{2})/.exec(q||''); if(m) return (2000+(+m[2]))*10+(+m[1]); m=/Q(\d)\s*(\d{4})/.exec(q||''); if(m) return (+m[2])*10+(+m[1]); var y=/(\d{4})/.exec(q||''); return y?(+y[1])*10:0; }
var EW_LAST=SPCX_OPEX_YEARS[SPCX_OPEX_YEARS.length-1], EW_PREV=SPCX_OPEX_YEARS[SPCX_OPEX_YEARS.length-2], EW_QL=SPCX_OPEXQ[SPCX_OPEXQ.length-1];
// Formal layout (SAB, Oct 20 2026: no emoji, fewer distinct parts): key figures · definition · share of revenue ·
// one composition-and-drivers table · effect on the margin · management commentary as a table. The icon field of the
// comp / drivers rows (b[0]) is ignored.
function ewTableRows(title, rows){ if(!rows||!rows.length) return '';
  return '<tr class="ew-tgrp"><td colspan="2">'+title+'</td></tr>'+rows.map(function(b){ return '<tr><td class="ew-tk">'+b[1]+'</td><td>'+b[2]+'</td></tr>'; }).join(''); }
function ewCallsTable(calls){ if(!calls||!calls.length) return '';
  var sorted=calls.slice().sort(function(a,b){ return ewQord(a.q)-ewQord(b.q); });   // oldest → newest
  return '<div class="ew-h">Management commentary</div><div class="twrap ew-twrap"><table class="rt ew-tbl"><thead><tr><th>Call</th><th>Remark</th><th>Speaker</th></tr></thead><tbody>'+
    sorted.map(function(c){ return '<tr><td class="ew-tk">'+esc(c.q)+'</td><td>'+c.txt+'</td><td class="ew-who">'+(c.who&&c.who!=='—'?esc(c.who):'')+'</td></tr>'; }).join('')+'</tbody></table></div>';
}
function ewBase(c){
  var h='<div class="ew-h">Key figures</div><div class="ov-kpis">'+c.kpis.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-v">'+k[0]+'</div><div class="ov-kpi-d muted">'+k[1]+'</div></div>'; }).join('')+'</div>';
  if(c.def){ h+='<div class="ew-h">Definition — 424B4 prospectus</div><div class="ew-q ew-def">“'+c.def+'”<span class="ew-att">'+SPCX_EW_SRC+'</span></div>'; }
  h+='<div class="ew-h">Share of revenue, FY'+SPCX_OPEX_YEARS[0]+'–FY'+EW_LAST+'</div>'+ewSpark(c.traj,c.traj.length-1);
  if(c.comp||c.drivers){
    h+='<div class="ew-h">Composition and drivers</div><div class="twrap ew-twrap"><table class="rt ew-tbl"><tbody>'+
       ewTableRows('What the line contains', c.comp)+ewTableRows('What has moved it', c.drivers)+'</tbody></table></div>';
    if(c.compNote) h+='<div class="ew-note ew-small">'+c.compNote+'</div>';
  }
  h+='<div class="ew-h">Effect on the operating margin</div><div class="ew-note">'+c.why+'</div>';
  if(c.unit) h+=String(c.unit).replace('class="ew-note"','class="ew-note ew-small"');
  if(c.calls){ h+=ewCallsTable(c.calls); }
  h+='<div class="ov-foot">FY'+EW_LAST+' figures unless noted. Sources: SpaceX 424B4 prospectus (MD&amp;A, Components of Results of Operations) and Forms 10-Q through '+esc(EW_QL.p)+'; SpaceX’s earnings webcasts (docs/calls/SPCX-latest.md, SPCX.md) for management commentary.</div>';
  return h;
}
// One dive per line: the text is SPCX_EW_LINES (spcx-bl-data.js, verbatim quotes); the KPIs and the share-of-revenue
// bars are computed here from the reported series, so nothing numeric is typed twice.
function ewPct(x){ var a=Math.abs(x); return a<0.05?'~0%':(x<0?'−':'')+a.toFixed(1)+'%'; }
function ewShare(k,y){ var r=SPCX_OPEX[y]; return (r&&r.revenue)?r[k]/r.revenue*100:null; }
function ewAmt(v){ var a=Math.abs(v), sg=v<0?'−':''; return sg+'$'+(a>=1000?(a/1000).toFixed(1)+'B':a.toFixed(0)+'M'); }   // US$ million in
var EW_LINES=SPCX_EW_LINES.map(function(l){
  var cur=SPCX_OPEX[EW_LAST][l.k], sh=ewShare(l.k,EW_LAST), dm=-(sh-ewShare(l.k,EW_PREV));   // cost share down = margin up
  var qv=EW_QL[l.k], qs=EW_QL.revenue?qv/EW_QL.revenue*100:null;
  var o={}; Object.keys(l).forEach(function(x){ o[x]=l[x]; });
  o.traj=SPCX_OPEX_YEARS.map(function(y){ return Math.round(ewShare(l.k,y)*10)/10; });
  o.kpis=[[ewAmt(cur),'FY'+EW_LAST+' · '+ewPct(sh)+' of revenue'],
          [(Math.abs(dm)<0.05?'0.0':(dm>=0?'+':'−')+Math.abs(dm).toFixed(1))+' ppt','to operating margin (FY'+EW_LAST+' vs FY'+EW_PREV+')'],
          [ewAmt(qv), esc(EW_QL.p)+' · '+(qs==null?'—':ewPct(qs))+' of revenue']];
  if(l.kpiExtra) o.kpis.push(l.kpiExtra);
  return o; });
function expenseTabsBody(){
  var defs=A_MB_COST.map(function(c){ var v=SPCX_OPEX[EW_LAST][c.k], sh=ewShare(c.k,EW_LAST);
    return {k:c.k, c:c.c, cogs:!!c.cogs, n:esc(c.lab), tag:ewAmt(v)+' · '+ewPct(sh)}; });
  var byk={}; EW_LINES.forEach(function(l){ byk[l.k]=l; });
  function tab(d,i){ return '<button type="button" class="exp-tab'+(i===0?' active':'')+'" data-exptab="'+d.k+'"><span class="exp-dot" style="background:'+d.c+'"></span>'+d.n+' <span class="exp-tag">'+d.tag+'</span></button>'; }
  // No inner title or framed box: the collapsible header above already says this (SAB, Oct 20 2026).
  var h='<div class="exp-explorer exp-flat">';
  h+='<div class="exp-tabs">'+defs.filter(function(d){ return d.cogs; }).map(tab).join('')+
     '<span class="exp-sep">Operating expenses</span>'+defs.filter(function(d){ return !d.cogs; }).map(function(d,i){ return tab(d,i+1); }).join('')+'</div>';
  h+='<div class="exp-panels">'+defs.map(function(d,i){ return '<div class="exp-panel exp-panel-card" data-exppanel="'+d.k+'"'+(i>0?' hidden':'')+'>'+(byk[d.k]?ewBase(byk[d.k]):'')+'</div>'; }).join('')+'</div>';
  h+='</div>';
  return h;
}
// ═══ Panel footer — every source, dates read off the data (Annex A12) ═══
function spcxBlFootGeneral(){
  var y0=SPCX_OPEX_YEARS[0], y1=SPCX_OPEX_YEARS[SPCX_OPEX_YEARS.length-1], q0=SPCX_OPEXQ[0], q1=SPCX_OPEXQ[SPCX_OPEXQ.length-1];
  return '<div class="ov-foot">Sources — Bloomberg consensus export (SPCX BBG CONSENSUS, as of '+esc(spcxBBG.asOf)+'): reported '+A_FYLAB[0]+'–'+A_FYLAB[A_LA]+
    ' and consensus '+A_FYLAB[A_LA+1]+'–'+A_FYLAB[A_FYLAB.length-1]+' income statement (GAAP), quarterly '+esc(spcxBBG.qtrs[0])+'–'+Q_LAST+'E, SBC and diluted shares — each consensus field is its own analyst set, so the forward bridges carry a residual; '+
    'SpaceX 424B4 prospectus and Forms 10-Q for the functional cost lines (FY'+y0+'–FY'+y1+', '+esc(q0.p)+'–'+esc(q1.p)+'; 4Q25 is the year less the nine months) — they tie to reported income from operations in every period — and for basic and diluted shares (Note 14); '+
    'Q3 2026 earnings release for the Adj. EBITDA definition; '+SPCX_EW_SRC.replace(/^— /,'')+' for line definitions. There is no Summit model for SpaceX. Forward figures are estimates.</div>';
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
    tog('.br-qy', function(){ aBridgeSync(pane); aBuildBridge(); });   // year change re-derives which quarters exist
    tog('.br-qq', aBuildBridge);
    tog('.br-fy', aBuildBridge);
    tog('.br-from', aBuildBridge); tog('.br-to', aBuildBridge);
    pane.querySelectorAll('.br-fx-sl input[type=range]').forEach(function(s){ s.addEventListener('input', aBuildBridge); });
    var brReset=pane.querySelector('.br-fx-reset'); if(brReset) brReset.onclick=function(){ pane.querySelectorAll('.br-fx-sl input[data-brx]').forEach(function(s){ s.value=0; }); aBuildBridge(); };
    tog('.nb-yr', aBuildNetBridge);
    tog('.nb-norm', aBuildNetBridge);
    var etabs=pane.querySelectorAll('.exp-tab');
    etabs.forEach(function(b){ b.onclick=function(){ var k=b.getAttribute('data-exptab');
      etabs.forEach(function(x){ x.classList.toggle('active',x===b); });
      pane.querySelectorAll('.exp-panel').forEach(function(p){ p.hidden=(p.getAttribute('data-exppanel')!==k); }); }; }); }
}

// ═══ Exports — Bottom Line ▸ General, the views stacked top to bottom (no picker; playbook §13) ═══
// Mount: subtab 'margins' of the Bottom Line pane in spcx.js; build lazily once visible: spcxBlGeneralBuild(root?).
export function spcxBlGeneralHtml(){
  return '<div class="gen-sec" data-gsec="margins">'+aMarginsBody()+'</div>'+
    '<div class="gen-sec me-bl-gap" data-gsec="bridge">'+aBridgeBody()+'</div>'+
    '<div class="gen-sec me-bl-gap" data-gsec="net">'+aNetBridgeBody()+'</div>'+
    '<div class="gen-sec me-bl-gap" data-gsec="sbc">'+aSbcBody()+'</div>'+
    aCollap('Expense lines — the '+A_MB_COST.length+' cost lines of the income statement (what is inside, drivers, calls)', expenseTabsBody(), false)+spcxBlFootGeneral();
}
export function spcxBlGeneralBuild(root){ if(root) _root=root; aBuildMargins(); aBuildExpenses(); }

// ═══ BL-SEG Bottom Line ▸ Segments (playbook §13 BL-SEG) — copied from googl-bl.js's segment section ═══
// Stacked, no picker: Profit by segment → Revenue vs profit → The segment bridge → Segment deep dives → footer.
// SpaceX reports three segments — Space, Connectivity, SI (AI in the 424B4) — with revenue, every cost line, operating
// income and adjusted EBITDA, and they add up to the consolidated figures (no unallocated line). Bloomberg carries
// consensus revenue, operating income and EBITDA for every segment (./spcx-bbg.js `seg`). No Summit model.
function sPane(){ return R().querySelector('.dd-pane[data-dd="bottomline"] .ovt-subpane[data-ovst="segments"]'); }
var SEG_DEF=[{k:'conn',lab:'Connectivity (Starlink)',c:SUMMIT_CAT[0],rk:'conn',ok:'connopinc',ek:'connebitda',bbg:'seg6407842016'},
             {k:'si',lab:'SI (Super Intelligence)',c:SUMMIT_CAT[1],rk:'si',ok:'siopinc',ek:'siebitda',bbg:'seg5185647327'},
             {k:'space',lab:'Space',c:SUMMIT_CAT[2],rk:'space',ok:'spaceopinc',ek:'spaceebitda',bbg:'seg1296744675'}];
var SEG_CONS={k:'cons',lab:'Consolidated',c:INK,rk:'rev',ok:'opinc',ek:'ebitda'};
function sSeg(k){ return k==='cons'?SEG_CONS:SEG_DEF.filter(function(s){ return s.k===k; })[0]||SEG_DEF[0]; }
// Annual axis: the reported years of the segment note, then the BBG forward years.
var S_YA=Object.keys(SPCX_SEG_Y).map(Number).sort();
var S_LA=S_YA.length-1;
var S_YRS=S_YA.concat(A_YF.filter(function(y){ return y>S_YA[S_LA]; }));
var S_LAB=S_YRS.map(function(y,i){ return fyLab(y)+(i>S_LA?'E':''); });
// Reported segment revenue and operating income come from the 424B4 segment note (SPCX_SEG_Y); everything else from the
// Results dataset. (The dataset's SI FY2023 operating income has the wrong sign — see the file header.)
var SEG_FROM_NOTE={ space:['space','rev'], conn:['conn','rev'], si:['si','rev'], spaceopinc:['space','oi'], connopinc:['conn','oi'], siopinc:['si','oi'] };
function rY(mk, src){
  if(src==='act' && SEG_FROM_NOTE[mk]){ var sf=SEG_FROM_NOTE[mk]; return S_YRS.map(function(y){ var r=SPCX_SEG_Y[y]; return r?r[sf[0]][sf[1]]:null; }); }
  var m=mk&&spcxResults.views.y.metrics[mk];
  return S_YRS.map(function(y){ if(!m||!m[src]) return null; var i=m.periods.indexOf(String(y)); return i>=0?m[src][i]:null; }); }
function bbgF(s){ return S_YRS.map(function(y,i){ if(i<=S_LA||!s||!s.f) return null; var j=A_YF.indexOf(y); return j>=0?s.f[j]:null; }); }
function consRevY(k){ return k==='cons'?bbgF(spcxBBG.is.rev):bbgF((spcxBBG.seg[sSeg(k).bbg]||{}).rev); }
function consProfY(k, met){ var f=met==='ebitda'?'ebitda':'oi'; return bbgF(k==='cons'?spcxBBG.is[f]:(spcxBBG.seg[sSeg(k).bbg]||{})[f]); }
function sB(v){ return v==null?'—':(v<0?'−':'')+'$'+(Math.abs(v)/1000).toFixed(1)+'B'; }
function sPct(v){ return v==null||!isFinite(v)?'—':(v<0?'−':'')+Math.abs(v).toFixed(1)+'%'; }
function sLastIdx(a){ var j=-1; (a||[]).forEach(function(v,i){ if(v!=null) j=i; }); return j; }

// ── 1 · Profit by segment — Actual vs Consensus (operating income or adjusted EBITDA) ──
function sProfitBody(){
  return aStdScaffold({ id:'sx-segfc', title:'Profit by segment — Actual vs Consensus', height:340,
    modes:[{cls:'seg',label:'Segment',opts:SEG_DEF.concat([SEG_CONS]).map(function(s,i){ return {v:s.k,label:s.lab,on:i===0}; })},
           {cls:'met',label:'Measure',opts:[{v:'oi',label:'Op. income',on:true},{v:'ebitda',label:'Adj. EBITDA'}]},
           {cls:'gran',label:'Period',opts:[{v:'y',label:'Annual',on:true},{v:'q',label:'Quarterly'}]}],
    presets:[['all','All'],['rep','Reported'],['fwd','Forward'],['l5','Last 5']] });
}
function sBuildProfit(){
  aStdRender('sx-segfc', function(st){
    var s=sSeg(st.modes.seg||'conn'), met=st.modes.met||'oi', gran=st.modes.gran||'y', mk=met==='ebitda'?s.ek:s.ok;
    var lab=met==='ebitda'?'Adj. EBITDA':'Op. income', labels, la, act, con, rA, rC;
    if(gran==='q'){ var Q=spcxResults.views.q.metrics, o=Q[mk], r=Q[s.rk];
      labels=o.periods.slice(0, qEnd(o.periods)+1); la=aLastActIdx(o.act); act=o.act; con=o.cons; rA=r.act; rC=r.cons; }
    else { labels=S_LAB.slice(); la=S_LA;
      act=rY(mk,'act').map(function(v,i){ return i<=la?v:null; });
      con=consProfY(s.k, met); rA=rY(s.rk,'act'); rC=consRevY(s.k); }
    function amt(a){ return labels.map(function(_,i){ return a&&a[i]!=null?Math.round(a[i]/100)/10:null; }); }
    function marg(a,r){ return labels.map(function(_,i){ return (a&&a[i]!=null&&r&&r[i])?Math.round(a[i]/r[i]*1000)/10:null; }); }
    var series=[
      {k:'act$',grp:'act',src:'Actual',label:lab+' — Actual',color:ASTD_ACT,type:'bar',data:amt(act)},
      {k:'con$',grp:'con',src:'Consensus',label:lab+' — Consensus',color:ASTD_CONS,type:'bar',data:amt(con)},
      {k:'actM',grp:'act',src:'Actual',label:'Margin — Actual',color:ASTD_ACT,type:'line',yAxisID:'y2',data:marg(act,rA)},
      {k:'conM',grp:'con',src:'Consensus',label:'Margin — Consensus',color:ASTD_CONS,type:'line',yAxisID:'y2',dash:true,data:marg(con,rC)}];
    series=series.filter(function(x){ return x.data.some(function(v){ return v!=null; }); });
    var notes=[];
    if(s.k==='space') notes.push('Starship development is expensed in the Space segment, so its margin swings around zero on a small revenue base (2Q26: −$542M of operating income on $962M of revenue); it says little about the launch business itself. Starlink launches earn Space no revenue — their cost is capitalised in Connectivity (424B4).');
    if(s.k==='si') notes.push('SI (AI in the 424B4) turned profitable when the compute rental contracts started in 2Q26. 3Q26 operating income carries $1.2B of stock-based compensation tied to the Cursor acquisition; adjusted EBITDA excludes it. FY2023 includes the $3.8B impairment of X’s intangible assets.');
    if(s.k==='conn') notes.push('3Q26 Connectivity gross margin includes about 3 points of one-off tariff refunds (Q3 2026 call).');
    if(s.k==='cons') notes.push('Consolidated = the three segments (SpaceX has no unallocated line).');
    if(met==='ebitda') notes.push('Adj. EBITDA = the company’s segment definition (operating income excluding D&amp;A, share-based compensation, acquisition-related costs, restructuring and impairments). Not GAAP.');
    notes.push('Consensus = Bloomberg segment fields (as of '+esc(spcxBBG.asOf)+'); each is its own analyst set, so the segments need not add to the consolidated consensus.'+(gran==='q'?' Quarterly consensus is shown through '+Q_LAST+'.':'')+' There is no Summit model for SpaceX.');
    return { labels:labels, lastAct:la, type:'bar', stacked:false, series:series, note:notes.join(' '), paired:true,
      yFmt:function(x){ return (x<0?'−$':'$')+(x==null?'':Math.abs(x).toFixed(1))+'B'; }, y2Fmt:function(x){ return x+'%'; } };
  });
}

// ── 2 · Revenue vs profit — common size by segment ──
function sMixBody(){
  return aStdScaffold({ id:'sx-segmix', title:'Revenue vs profit — common size by segment', height:340,
    metricSel:[{v:'rev',label:'Revenue',on:true,group:'Revenue'},{v:'oi',label:'Operating income',group:'Profit'},{v:'ebitda',label:'Adj. EBITDA',group:'Profit'}],
    modes:[{cls:'show',label:'Show',opts:[{v:'amt',label:'$B',on:true},{v:'share',label:'Share'},{v:'growth',label:'Growth'}]},
           {cls:'layout',label:'Layout',opts:[{v:'stack',label:'Stacked',on:true},{v:'side',label:'Side by side'}]},
           {cls:'gran',label:'Period',opts:[{v:'y',label:'Annual',on:true},{v:'q',label:'Quarterly'}]},
           {cls:'cmp',label:'Compare',opts:[{v:'yoy',label:'YoY',on:true},{v:'qoq',label:'QoQ'}]},
           {cls:'gin',label:'Growth in',opts:[{v:'pct',label:'%',on:true},{v:'add',label:'$ added'}]}],
    presets:[['all','All'],['rep','Reported'],['fwd','Forward']] });
}
function sBuildMix(){
  aStdRender('sx-segmix', function(st){
    var metric=st.sel||'rev', show=st.modes.show||'amt', layout=st.modes.layout||'stack', gran=st.modes.gran||'y';
    var cmp=st.modes.cmp||'yoy', gin=st.modes.gin||'pct', notes=[];
    if(metric!=='rev'){
      if(show==='share') notes.push('Share = each segment over the consolidated figure. A loss-making segment has a share below zero, and the others then add up to more than 100%.');
      notes.push('Forward = Bloomberg consensus by segment. The line is the consolidated total of the three segments.'); }
    else notes.push('Revenue = the three segments, which add up to consolidated revenue in every reported period.');
    var Q=spcxResults.views.q.metrics, labels, la;
    if(gran==='q'){ labels=Q.conn.periods.slice(0, qEnd(Q.conn.periods)+1); la=aLastActIdx(Q.conn.act); notes.push('Quarterly consensus is shown through '+Q_LAST+'.'); }
    else { labels=S_LAB.slice(); la=S_LA; }
    function raw(s){ var mk=metric==='rev'?s.rk:(metric==='oi'?s.ok:s.ek);
      if(gran==='q'){ var m=Q[mk]; return labels.map(function(_,i){ return i<=la?m.act[i]:(m.cons?m.cons[i]:null); }); }
      var ac=rY(mk,'act'), fw=metric==='rev'?consRevY(s.k):consProfY(s.k, metric);
      return labels.map(function(_,i){ return i<=la?ac[i]:fw[i]; }); }
    var step=gran==='q'?(cmp==='qoq'?1:4):1, addMode=(show==='growth'&&gin==='add');
    var rows=SEG_DEF.map(function(s){ return { s:s, v:raw(s) }; });
    var totals=labels.map(function(_,i){ var t=0, any=false; rows.forEach(function(r){ if(r.v[i]!=null){ t+=r.v[i]; any=true; } }); return any?t:null; });
    function val(v, pv, tot){ if(v==null) return null;
      if(show==='share') return tot?Math.round(v/tot*1000)/10:null;
      if(show==='growth'){ if(pv==null) return null; if(addMode) return Math.round((v-pv)/100)/10; return !pv?null:Math.round((v-pv)/Math.abs(pv)*1000)/10; }
      return Math.round(v/100)/10; }
    var series=rows.map(function(r){ return { k:r.s.k, label:r.s.lab, color:r.s.c, type:'bar',
      data:labels.map(function(_,i){ return val(r.v[i], r.v[i-step], totals[i]); }) }; });
    if(metric!=='rev'&&show==='amt') series.push({ k:'tot', label:'Consolidated', color:INK, type:'line', stack:'tot',
      data:totals.map(function(v){ return v==null?null:Math.round(v/100)/10; }) });
    if(metric!=='rev'&&show==='growth'&&!addMode) notes.push('Growth off a loss reads oddly; use $ added for the segments that crossed zero (SI in 2026).');
    var stacked=show==='share'||(show==='amt'&&layout==='stack')||(addMode&&layout==='stack');
    var yFmt=(show==='amt'||addMode)?function(x){ return (x<0?'−$':'$')+(x==null?'':Math.abs(x).toFixed(1))+'B'; }:function(x){ return x+'%'; };
    var hide=[]; if(!(show==='growth'&&gran==='q')) hide.push('cmp'); if(show!=='growth') hide.push('gin'); if(show==='share') hide.push('layout');
    return { labels:labels, lastAct:la, yFmt:yFmt, type:'bar', stacked:stacked, yMax:(show==='share'&&metric==='rev')?100:undefined, series:series, hideModes:hide, note:notes.join(' ') };
  });
}

// ── 3 · The segment bridge — Historical (Δ operating income per segment between two reported years) | Forward vs
// consensus (last reported year → a consensus year, with a slider per segment) | By cost (one segment's cost lines). ──
var SBR_QS=SPCX_SEG_Q.filter(function(r,i){ return i>=4; });   // quarters with a same-quarter-last-year row
var SEG_LINES=[{k:'cor',lab:'Cost of revenue'},{k:'rnd',lab:'R&D'},{k:'sga',lab:'SG&A'},{k:'oth',lab:'Restructuring & impairment'}];
function sBridgeBody(){
  function yB(cls, ys, sel){ return ys.map(function(y){ return '<button type="button" data-'+cls+'="'+y+'"'+(y===sel?' class="active"':'')+'>'+fyLab(y)+'</button>'; }).join(''); }
  var nS=S_YA.length, qL=SBR_QS[SBR_QS.length-1].p;
  return '<div class="ov-sec"><div class="ov-sec-h">The segment bridge — what moved operating income</div>'+
    '<div class="mch-ctl"><span class="acx-tog sbr-mode"><button type="button" data-sbrm="hist" class="active">Historical</button><button type="button" data-sbrm="fwd">Forward vs consensus</button><button type="button" data-sbrm="cost">By cost — one segment</button></span><span></span></div>'+
    '<div class="sbr-ctl-hist mch-ctl me-bl-ctl"><span></span><span class="me-bl-pills">'+
      '<span class="me-bl-lbl">From</span><span class="acx-tog sbr-from">'+yB('sbrf',S_YA,S_YA[0])+'</span>'+
      '<span class="me-bl-lbl">to</span><span class="acx-tog sbr-to">'+yB('sbrt',S_YA,S_YA[nS-1])+'</span></span></div>'+
    '<div class="sbr-ctl-fwd mch-ctl me-bl-ctl" hidden><span class="me-bl-lbl">From '+fyLab(S_YA[S_LA])+' (reported) to</span><span class="me-bl-pills"><span class="acx-tog sbr-fy">'+aFwdBtns('sbrfy')+'</span>'+
      '<button type="button" class="br-fx-reset sbr-reset">Reset to consensus</button></span></div>'+
    '<div class="sbr-sl me-bl-sliders" hidden>'+
      '<div class="me-bl-lbl">Move each segment’s operating income vs consensus (0% = BBG consensus; + = more profit, as a share of the consensus figure):</div>'+
      SEG_DEF.map(function(s){ return '<div class="br-sl"><span class="br-sl-l">'+esc(s.lab)+'</span><input type="range" data-sbrx="'+s.k+'" min="-40" max="40" step="1" value="0"><span class="br-sl-v" data-sbrxv="'+s.k+'">0%</span></div>'; }).join('')+
    '</div>'+
    '<div class="sbr-ctl-cost mch-ctl me-bl-ctl" hidden>'+
      '<span class="acx-tog sbr-seg">'+SEG_DEF.map(function(s,i){ return '<button type="button" data-sbrs="'+s.k+'"'+(i===0?' class="active"':'')+'>'+esc(s.lab)+'</button>'; }).join('')+'</span>'+
      '<span class="me-bl-pills"><span class="acx-tog sbr-gran"><button type="button" data-sbrg="y" class="active">Annual</button><button type="button" data-sbrg="q">Quarterly</button></span>'+
        '<span class="sbr-cy"><span class="me-bl-lbl">From</span><span class="acx-tog sbr-cfrom">'+yB('sbrcf',S_YA,S_YA[nS-2])+'</span>'+
        '<span class="me-bl-lbl">to</span><span class="acx-tog sbr-cto">'+yB('sbrct',S_YA,S_YA[nS-1])+'</span></span>'+
        '<span class="acx-tog sbr-cq" hidden>'+SBR_QS.map(function(r){ return '<button type="button" data-sbrq="'+r.p+'"'+(r.p===qL?' class="active"':'')+'>'+r.p+'</button>'; }).join('')+'</span>'+
      '</span></div>'+
    '<div class="me-bl-h340"><canvas id="sxSegBr"></canvas></div>'+
    '<div id="sxSegBr-tbl" class="me-bl-tblhost"></div>'+
    '<div class="acx-cap me-bl-note" id="sxSegBrCap"></div></div>';
}
function sBridgeSync(pane){
  var mb=pane.querySelector('.sbr-mode .active'), mode=mb?mb.getAttribute('data-sbrm'):'hist';
  aShow(pane.querySelector('.sbr-ctl-hist'), mode==='hist'); aShow(pane.querySelector('.sbr-ctl-fwd'), mode==='fwd');
  aShow(pane.querySelector('.sbr-sl'), mode==='fwd'); aShow(pane.querySelector('.sbr-ctl-cost'), mode==='cost');
  var g=pane.querySelector('.sbr-gran .active'), q=!!(g&&g.getAttribute('data-sbrg')==='q');
  aShow(pane.querySelector('.sbr-cy'), !q); aShow(pane.querySelector('.sbr-cq'), q);
}
function sClear(cap, msg){ aDestroy('sxSegBr'); var tw=$id('sxSegBr-tbl'); if(tw) tw.innerHTML=''; if(cap) cap.innerHTML=msg; }
function sBuildBridge(){
  var pane=sPane(); if(!pane) return;
  var mb=pane.querySelector('.sbr-mode .active'), mode=mb?mb.getAttribute('data-sbrm'):'hist', cap=pane.querySelector('#sxSegBrCap'), steps;
  function A(sel,attr){ var b=pane.querySelector(sel+' .active'); return b?b.getAttribute(attr):null; }
  if(mode==='hist'||mode==='fwd'){
    var y0, y1, v0, v1, est=mode==='fwd', fi=0, adj={};
    if(!est){ y0=+A('.sbr-from','data-sbrf'); y1=+A('.sbr-to','data-sbrt');
      if(!(y1>y0)){ sClear(cap, 'Pick a “to” year after the “from” year.'); return; }
      v0=SEG_DEF.map(function(s){ return SPCX_SEG_Y[y0][s.k].oi; }); v1=SEG_DEF.map(function(s){ return SPCX_SEG_Y[y1][s.k].oi; }); }
    else { fi=+(A('.sbr-fy','data-sbrfy')||0); y0=S_YA[S_LA]; y1=A_YF[fi];
      pane.querySelectorAll('.sbr-sl input[data-sbrx]').forEach(function(sl){ var k=sl.getAttribute('data-sbrx'); adj[k]=+sl.value;
        var v=pane.querySelector('.br-sl-v[data-sbrxv="'+k+'"]'); if(v) v.textContent=((+sl.value)>0?'+':'')+sl.value+'%'; });
      v0=SEG_DEF.map(function(s){ return SPCX_SEG_Y[y0][s.k].oi; });
      v1=SEG_DEF.map(function(s){ var c=((spcxBBG.seg[s.bbg]||{}).oi||{}).f; c=c?c[fi]:null; return c==null?null:c+Math.abs(c)*(adj[s.k]||0)/100; }); }
    if(v0.concat(v1).some(function(v){ return v==null; })){ sClear(cap, 'No segment operating income for one of the two years.'); return; }
    var l0=fyLab(y0), l1=fyLab(y1)+(est?'E':'');
    var t0=v0.reduce(function(a,v){ return a+v; },0)/1000, run=t0;
    steps=[{label:l0+' op. income', kind:'base', color:INK, range:[0,run], runAfter:run, val:run}];
    var parts=SEG_DEF.map(function(s,i){ var d=(v1[i]-v0[i])/1000, lo=run; run=lo+d;
      steps.push({label:s.lab, kind:d>=0?'up':'down', color:s.c, dc:d>=0?POS:NEG, range:[Math.min(lo,run),Math.max(lo,run)], runAfter:run, val:d}); return d; });
    steps.push({label:l1+' op. income', kind:'total', color:run>=0?POS:NEG, range:[0,run], runAfter:null, val:run});
    aBuildBrWaterfall('sxSegBr', steps, BR_FMT_D);
    if(cap){ var txt='Operating income went from <b>'+sB(t0*1000)+'</b> in '+l0+' to <b>'+sB(run*1000)+'</b> in '+l1+': '+
        SEG_DEF.map(function(s,i){ return esc(s.lab)+' '+(parts[i]>=0?'added':'took')+' <b>'+sB(Math.abs(parts[i])*1000)+'</b>'; }).join(', ')+'.';
      if(est){ var co=aIsVal('oi',y1), moved=SEG_DEF.some(function(s){ return adj[s.k]; });
        txt+=' '+l1+' = Bloomberg consensus operating income by segment (as of '+esc(spcxBBG.asOf)+')'+(moved?', moved by your sliders':'')+'; the segments are separate analyst sets, so their sum differs from the consolidated consensus of '+sB(co)+'.'; }
      txt+=' The three segments add up to income from operations (no unallocated line). Source: '+SPCX_SEG_SRC+'.';
      cap.innerHTML=txt; }
    return;
  }
  var k=A('.sbr-seg','data-sbrs')||'conn', s=sSeg(k), gq=A('.sbr-gran','data-sbrg')==='q', a, b, la, lb;
  if(gq){ var qp=A('.sbr-cq','data-sbrq')||SBR_QS[SBR_QS.length-1].p, iq=SPCX_SEG_Q.map(function(r){ return r.p; }).indexOf(qp);
    b=SPCX_SEG_Q[iq][k]; a=SPCX_SEG_Q[iq-4][k]; lb=SPCX_SEG_Q[iq].p; la=SPCX_SEG_Q[iq-4].p; }
  else { var c0=+A('.sbr-cfrom','data-sbrcf'), c1=+A('.sbr-cto','data-sbrct');
    if(!(c1>c0)){ sClear(cap, 'Pick a “to” year after the “from” year.'); return; }
    a=SPCX_SEG_Y[c0][k]; b=SPCX_SEG_Y[c1][k]; la=fyLab(c0); lb=fyLab(c1); }
  var r0=a.oi/1000, run2=r0;
  steps=[{label:la+' op. income', kind:'base', color:INK, range:[0,run2], runAfter:run2, val:r0}];
  function st2(lab, d){ var lo=run2; run2=lo+d; steps.push({label:lab, kind:d>=0?'up':'down', color:d>=0?POS:NEG, range:[Math.min(lo,run2),Math.max(lo,run2)], runAfter:run2, val:d}); }
  st2('Revenue', (b.rev-a.rev)/1000);
  SEG_LINES.forEach(function(l){ st2(l.lab, -(b[l.k]-a[l.k])/1000); });
  steps.push({label:lb+' op. income', kind:'total', color:b.oi>=0?POS:NEG, range:[0,run2], runAfter:null, val:run2});
  aBuildBrWaterfall('sxSegBr', steps, BR_FMT_D);
  if(cap){ var mA=a.rev?a.oi/a.rev*100:null, mB=b.rev?b.oi/b.rev*100:null;
    cap.innerHTML='<b>'+esc(s.lab)+'</b>, '+la+' → '+lb+': revenue '+(b.rev>=a.rev?'added':'took')+' <b>'+sB(Math.abs(b.rev-a.rev))+'</b>; '+
      SEG_LINES.map(function(l){ var d=b[l.k]-a[l.k]; return esc(l.lab)+' '+(d>=0?'took':'gave back')+' <b>'+sB(Math.abs(d))+'</b>'; }).join(', ')+
      ' — operating margin '+sPct(mA)+' → '+sPct(mB)+'.'+(gq?' Each quarter is compared with the same quarter a year earlier.':'')+' Source: '+SPCX_SEG_SRC+'.'; }
}

// ── 4 · Segment deep dives (collapsible) — one tab per segment, same formal layout as the Expense lines ──
function sCostTable(k){
  var qL=SPCX_SEG_Q[SPCX_SEG_Q.length-1], qP=SPCX_SEG_Q[SPCX_SEG_Q.length-5];
  var rows=S_YA.map(function(y){ return [fyLab(y), SPCX_SEG_Y[y][k]]; }).concat([[qP.p, qP[k]],[qL.p, qL[k]]]);
  return '<div class="twrap ew-twrap"><table class="rt ew-tbl"><thead><tr><th>Period</th><th>Revenue</th><th>Cost of revenue</th><th>R&amp;D</th><th>SG&amp;A</th><th>Restr. &amp; impairment</th><th>Op. income</th><th>Op. margin</th></tr></thead><tbody>'+
    rows.map(function(r){ var d=r[1], m=d.rev?d.oi/d.rev:null;
      return '<tr><td class="ew-tk">'+r[0]+'</td><td>'+sB(d.rev)+'</td><td>'+sB(d.cor)+'</td><td>'+sB(d.rnd)+'</td><td>'+sB(d.sga)+'</td><td>'+sB(d.oth)+'</td><td>'+sB(d.oi)+'</td><td>'+(m==null?'—':sPct(m*100))+'</td></tr>'; }).join('')+
    '</tbody></table></div>';
}
function sSpark(vals, labs, fmt){ var mx=Math.max.apply(null,vals.map(function(v){ return Math.abs(v||0); }))||1;
  return '<div class="ew-spark">'+vals.map(function(v,i){ return '<div class="ew-sb'+(i===vals.length-1?' on':'')+'"><div class="ew-sb-v">'+fmt(v)+'</div><div class="ew-sb-bar" style="height:'+Math.max(2,Math.round(Math.abs(v||0)/mx*72))+'px"></div><div class="ew-sb-l">'+labs[i]+'</div></div>'; }).join('')+'</div>'; }
function sEbitdaQ(s, p){ var m=spcxResults.views.q.metrics[s.ek], i=m?m.periods.indexOf(p):-1; return i>=0?m.act[i]:null; }
function sDive(d){
  var k=d.k, s=sSeg(k), yL=S_YA[S_LA], cur=SPCX_SEG_Y[yL][k], tot=SPCX_OPEX[yL]?SPCX_OPEX[yL].revenue:null;
  var qL=SPCX_SEG_Q[SPCX_SEG_Q.length-1], qP=SPCX_SEG_Q[SPCX_SEG_Q.length-5], q=qL[k], p=qP[k], eb=sEbitdaQ(s, qL.p);
  var kp=[[sB(cur.rev), fyLab(yL)+' revenue · '+sPct(tot?cur.rev/tot*100:null)+' of SpaceX'],
    [sB(cur.oi), fyLab(yL)+' operating '+(cur.oi<0?'loss':'income')+' · '+sPct(cur.oi/cur.rev*100)+' margin'],
    [sB(q.oi), qL.p+' operating '+(q.oi<0?'loss':'income')+' · '+sPct(q.oi/q.rev*100)+' margin ('+sPct(p.oi/p.rev*100)+' in '+qP.p+')']];
  if(eb!=null) kp.push([sB(eb), qL.p+' Adj. EBITDA · '+sPct(eb/q.rev*100)+' margin (company definition)']);
  var h='<div class="ew-h">Key figures</div><div class="ov-kpis">'+kp.map(function(x){ return '<div class="ov-kpi"><div class="ov-kpi-v">'+x[0]+'</div><div class="ov-kpi-d muted">'+x[1]+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ew-h">Definition — 424B4 prospectus</div><div class="ew-q ew-def">“'+d.def+'”<span class="ew-att">— SpaceX 424B4 prospectus, Description of Our Segments (revenue)</span></div>';
  if(d.costDef) h+='<div class="ew-q ew-def">“'+d.costDef+'”<span class="ew-att">— what the segment’s cost of revenue contains · 424B4, Description of Our Segments</span></div>';
  h+='<div class="ew-h">The business</div><div class="ew-note">'+d.business+'</div>';
  var qs=SPCX_SEG_Q.map(function(r){ return r[k]; });
  h+='<div class="ew-h">Operating margin, '+esc(SPCX_SEG_Q[0].p)+'–'+esc(qL.p)+'</div>'+
    sSpark(qs.map(function(r){ return r.rev?r.oi/r.rev*100:null; }), SPCX_SEG_Q.map(function(r){ return r.p; }), function(v){ return v==null?'—':(v<0?'−':'')+Math.abs(v).toFixed(0)+'%'; });
  h+='<div class="ew-h">Cost split — what SpaceX breaks out by segment</div>'+sCostTable(k);
  h+='<div class="ew-h">What drives it</div><div class="twrap ew-twrap"><table class="rt ew-tbl"><tbody>'+d.moves.map(function(m){ return '<tr><td class="ew-tk">'+m[0]+'</td><td>'+m[1]+'</td></tr>'; }).join('')+'</tbody></table></div>';
  h+='<div class="ew-h">What the segment note discloses — and what it does not</div><div class="twrap ew-twrap"><table class="rt ew-tbl"><tbody>'+
    ewTableRows('Disclosed by segment', [['','Income statement','Revenue, cost of revenue, R&amp;D, SG&amp;A, restructuring, impairment and operating income (loss), annual and quarterly.'],
      ['','Supplemental','Depreciation and amortization, share-based compensation, impairment and capital expenditures; adjusted EBITDA (non-GAAP) in the earnings releases.']])+
    ewTableRows('Not disclosed by segment', [['','Assets and liabilities','“'+esc(SPCX_SEG_NOTE.codm)+'”'],
      ['','Inter-segment revenue','“'+esc(SPCX_SEG_NOTE.interseg)+'”']])+
    '</tbody></table></div>';
  h+=ewCallsTable(d.calls);
  h+='<div class="ov-foot">Sources: '+SPCX_SEG_SRC+'; Results dataset for segment adjusted EBITDA; SpaceX’s earnings webcasts (docs/calls/SPCX-latest.md, SPCX.md) for management commentary.</div>';
  return h;
}
function sDivesBody(){
  var yL=S_YA[S_LA];
  var tabs=SPCX_SEG_DIVES.map(function(d,i){ var s=sSeg(d.k), r=SPCX_SEG_Y[yL][d.k];
    var tag=sB(r.oi)+(r.oi<0?' op. loss':' · '+sPct(r.oi/r.rev*100)+' margin');
    return '<button type="button" class="exp-tab'+(i===0?' active':'')+'" data-segtab="'+d.k+'"><span class="exp-dot" style="background:'+s.c+'"></span>'+esc(d.name)+' <span class="exp-tag">'+tag+' · '+fyLab(yL)+'</span></button>'; }).join('');
  return '<div class="exp-explorer exp-flat"><div class="exp-tabs">'+tabs+'</div><div class="exp-panels">'+
    SPCX_SEG_DIVES.map(function(d,i){ return '<div class="exp-panel exp-panel-card" data-segpanel="'+d.k+'"'+(i>0?' hidden':'')+'>'+sDive(d)+'</div>'; }).join('')+'</div></div>';
}
function spcxBlFootSegments(){
  return '<div class="ov-foot">Sources — '+SPCX_SEG_SRC+': segment revenue, cost lines and operating income, '+fyLab(S_YA[0])+'–'+fyLab(S_YA[S_LA])+' and '+esc(SPCX_SEG_Q[0].p)+'–'+esc(SPCX_SEG_Q[SPCX_SEG_Q.length-1].p)+' (2Q25 and 4Q25 derived from the nine-month and full-year figures); '+
    'Results dataset for quarterly segment series and segment adjusted EBITDA; Bloomberg consensus export (SPCX BBG CONSENSUS, as of '+esc(spcxBBG.asOf)+'), segment fields, forward. SpaceX does not recognise inter-segment revenue: launching Starlink satellites is capitalised into the satellites, so Space looks smaller and Connectivity carries the launch cost through depreciation (424B4). There is no Summit model for SpaceX. Forward figures are estimates.</div>';
}
function sBuildSegments(){
  var pane=sPane(); if(!pane) return;
  aWireCollaps(pane);
  sBuildProfit(); sBuildMix(); sBridgeSync(pane); sBuildBridge();
  if(pane._segWired) return; pane._segWired=true;
  var tog=function(sel,after){ pane.querySelectorAll(sel+' button').forEach(function(b){ b.onclick=function(){ pane.querySelectorAll(sel+' button').forEach(function(x){ x.classList.toggle('active',x===b); }); after(); }; }); };
  ['.sbr-mode','.sbr-gran'].forEach(function(s){ tog(s, function(){ sBridgeSync(pane); sBuildBridge(); }); });
  ['.sbr-from','.sbr-to','.sbr-fy','.sbr-seg','.sbr-cfrom','.sbr-cto','.sbr-cq'].forEach(function(s){ tog(s, sBuildBridge); });
  pane.querySelectorAll('.sbr-sl input[type=range]').forEach(function(sl){ sl.addEventListener('input', sBuildBridge); });
  var rs=pane.querySelector('.sbr-reset'); if(rs) rs.onclick=function(){ pane.querySelectorAll('.sbr-sl input[data-sbrx]').forEach(function(sl){ sl.value=0; }); sBuildBridge(); };
  var stabs=pane.querySelectorAll('.exp-tab[data-segtab]');
  stabs.forEach(function(b){ b.onclick=function(){ var key=b.getAttribute('data-segtab');
    stabs.forEach(function(x){ x.classList.toggle('active',x===b); });
    pane.querySelectorAll('.exp-panel[data-segpanel]').forEach(function(p){ p.hidden=(p.getAttribute('data-segpanel')!==key); }); }; });
}
// Mount: subtab 'segments' of the Bottom Line pane in spcx.js; build lazily once visible: spcxBlSegmentsBuild(root?).
export function spcxBlSegmentsHtml(){
  return '<div class="seg-gsec" data-sgsec="oimargin">'+sProfitBody()+'</div>'+
    '<div class="seg-gsec me-bl-gap" data-sgsec="mix">'+sMixBody()+'</div>'+
    '<div class="seg-gsec me-bl-gap" data-sgsec="bridge">'+sBridgeBody()+'</div>'+
    aCollap('Segment deep dives — Connectivity, SI and Space (key figures, cost split, drivers, what is disclosed, calls)', sDivesBody(), false)+spcxBlFootSegments();
}
export function spcxBlSegmentsBuild(root){ if(root) _root=root; sBuildSegments(); }
