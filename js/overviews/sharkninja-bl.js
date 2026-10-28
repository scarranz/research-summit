// overviews/sharkninja-bl.js — SharkNinja Deep Dive ▸ Bottom Line ▸ General, on AMAZON'S code.
//
// Extracted mechanically from js/overviews/amzn.js (the dependency closure of aGeneralPicker,
// aMarginsBody/aBuildMargins, aBridgeBody/aBuildBridge, aNetBridgeBody/aBuildNetBridge,
// aSbcBody/aBuildSbc, expenseTabsBody/aBuildExpenses and the chart-standard kit they share), so the
// chart picker, the profitability dual-axis chart, the revenue → operating-income waterfall (build-up
// / margin change / forward with sliders), the net-income walk, the SBC & dilution chart and the
// expense explorer are the same controls and the same canvases. What changed, so a diff is not a surprise:
//   • data: amznBBG → snBBG, A_OPEX/A_OPEXQ → SN_OPEX/SN_OPEXQ, EW_LINES → SN_EW_LINES (./sharkninja-bl-data.js)
//   • SN's five functional lines (Cost of sales · R&D · S&M · G&A · Other) replace Amazon's six
//   • no Summit DCF for SN: the Summit bars/lines and Summit diluted shares are removed
//   • the segment bridge is omitted (one reportable segment); the net-income caption is SN's (SN_NB_NOTE)
//   • EBITDA on the margins chart is Adjusted EBITDA (the basis SN reports and guides)
// When amzn.js changes, re-run the extraction rather than hand-patching this copy.

import { SUMMIT_CAT, SUMMIT_INK } from '../viz-palette.js';
import { snResults } from '../results-data/sn.js';
import { SN_OPEX_YEARS, SN_OPEX, SN_OPEXQ, snBBG, SN_EW_LABS, SN_EW_LINES, SN_EW_SRC, SN_EXP_DEFS, SN_NB_NOTE, SN_SBC_NOTE } from './sharkninja-bl-data.js';
// ─── esc: escapes <>" but deliberately leaves & literal (per contract; never double-encode) ──
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Brand: Amazon orange + Amazon blue ─────────────────────────────────────────────────────
// These were Amazon's own brand hexes (#FF9900 smile orange, #146EB4 blue, #232F3E squid ink), used
// as chart colours in ~175 places. They now point at the portal's fixed categorical palette, so the
// profile no longer paints itself in the company's brand — the brand belongs in the logo, and slot 1
// is the same blue on every company. The NAMES are kept deliberately: renaming 175 call sites would
// bury a palette change inside an unreviewable diff. Read BRAND as "series 1", BRAND2 as "series 2".
var BRAND=SUMMIT_CAT[0], BRAND2=SUMMIT_CAT[1], SQUID=SUMMIT_INK, GREEN='#2E8B57', GRAY='#9AA4B0';
var BLUE='#2557D6', RED='#EA4335', YELLOW='#E8A00C', PURPLE='#7A5AF8', AMBER='#B7791F';

// ═══ Deep Dive default tabs — built from the Results dataset (no re-hardcode) ═══════════════════
// Chart.js helpers (lazy: panes must be visible — offsetParent — before building).
var _aCharts={};
function aDestroy(id){ if(_aCharts[id]){ _aCharts[id].destroy(); _aCharts[id]=null; } }
function aChartReady(id){ var cv=document.getElementById(id); return (cv&&typeof Chart!=='undefined'&&cv.offsetParent)?cv:null; }
// ═══ Chart-standard kit (docs/CHART_ENGINE_REFERENCE.md §0.7) — copied verbatim / adapted so the
// bespoke AMZN canvases meet the six non-negotiables. rs-* CSS is global (css/results.css). ═══
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
// Standard treatment for a bespoke chart: y-zoom + double-click reset (rule 1; onX=null per §0.2)
// AND an auto-generated collapsible table from the chart's own data (rule 3) — unless the chart
// supplies its own table container (#id-tbl, e.g. the waterfalls). One call covers both.
function aFnum(v){ if(v==null||v==='') return null; if(Array.isArray(v)) v=v[v.length-1]; if(typeof v!=='number') return String(v);
  var a=Math.abs(v), r=a<10?Math.round(v*100)/100:(a<1000?Math.round(v*10)/10:Math.round(v)); return r.toLocaleString('en-US'); }
// Auto-table from a chart's own data (rule 3), honouring hidden series (rule 2) and preserving open state.
function aBuildAutoTbl(id){
  var cv=document.getElementById(id), ch=_aCharts[id]; if(!cv||!ch) return;
  if(document.getElementById(id+'-tbl')) return;   // chart supplies its own table
  var labels=(ch.data&&ch.data.labels)||[], ds=(ch.data&&ch.data.datasets)||[];
  if(!labels.length||!ds.length) return;
  var headers=['Series'].concat(labels.map(function(l){ return Array.isArray(l)?l.join(' '):String(l); }));
  var rows=[]; ds.forEach(function(d,i){ var meta=ch.getDatasetMeta?ch.getDatasetMeta(i):null; if(meta&&meta.hidden) return;   // rule 2: hidden series leaves the table
    rows.push([d.label||'series'].concat((d.data||[]).map(aFnum))); });
  var wrap=cv.parentElement, host=wrap&&wrap.parentNode; if(!host) return;
  var prev=wrap.nextElementSibling, wasOpen=false;
  if(prev&&prev.getAttribute&&prev.getAttribute('data-rstblhost')===id){ var ob=prev.querySelector('.rs-collap-b'); wasOpen=!!(ob&&!ob.hidden); host.removeChild(prev); }
  var div=document.createElement('div'); div.setAttribute('data-rstblhost',id); div.style.marginTop='8px';
  div.innerHTML=aTbl(id,'Data — what the chart draws',headers,rows);
  if(wasOpen){ var nb=div.querySelector('.rs-collap-b'); if(nb) nb.hidden=false; var ic=div.querySelector('.rs-collap-ic'); if(ic) ic.textContent='▾'; }
  host.insertBefore(div, wrap.nextSibling);
}
// Collapsible SECTION (charts / deep dives) so the pane isn't a wall — less shown by default,
// opened on demand. Uses the same rs-collap the table dropdown does (toggled in deepDiveInit).
function aCollap(title, inner, open){
  return '<div class="rs-collap" style="margin:16px 0 4px"><button type="button" class="rs-collap-h">'+
    '<span class="rs-collap-ic">'+(open?'▾':'▸')+'</span> '+esc(title)+'</button>'+
    '<div class="rs-collap-b"'+(open?'':' hidden')+' style="padding-top:10px">'+inner+'</div></div>';
}
// ═══ SAB-parity chart scaffold (docs/AMZN_BOTTOM_LINE §9b) ═════════════════════════════════════════
// Same classes/CSS as results.js so Bottom-Line charts read as ONE product: row1 title + rs-msel metric
// dropdown; row2 rs-views mode pills (left) · rs-quick Range presets (right) — ABOVE the chart; ave-leg
// (Actual/Summit/Consensus, click-to-hide); ov-chart-card; y-axis on the RIGHT; sg-slider two-handle
// PERIOD window with rs-ticks dots + drag-to-zoom on the X. A chart registers a derive(state) fn that
// returns {labels,lastAct,series:[{k,label,color,data,fwdDash}],yFmt}; controls re-render via it.
var ASTD_ACT='rgba(30,39,51,0.92)', ASTD_SUMMIT='rgba(37,99,235,0.85)', ASTD_CONS='rgba(124,134,148,0.85)';
// Fade a series colour to a given alpha. Accepts BOTH '#rrggbb' and 'rgba(r,g,b,a)' — the ASTD_*
// palette is authored as rgba(), and feeding that to acxRGBA (hex-only) yields 'rgba(NaN,186,NaN,0.5)',
// which paints nothing. That silently hid every forward-period bar on the profitability charts.
function aFadeC(c,a){
  if(!c) return c;
  if(c.charAt(0)==='#') return acxRGBA(c,a);
  var m=/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(c);
  return m ? 'rgba('+m[1]+','+m[2]+','+m[3]+','+a+')' : c;
}
var _aStd={}, _aStdDerive={};
function aStdScaffold(cfg){
  var id=cfg.id;
  var st=_aStd[id]||(_aStd[id]={win:null,hidden:{},sel:null,modes:{}});
  if(cfg.metricSel && st.sel==null){ var on=cfg.metricSel.filter(function(o){return o.on;})[0]||cfg.metricSel[0]; st.sel=on.v; }
  (cfg.modes||[]).forEach(function(g){ if(st.modes[g.cls]==null){ var d=g.opts.filter(function(o){return o.on;})[0]||g.opts[0]; st.modes[g.cls]=d.v; } });
  var sel=cfg.metricSel? '<select class="rs-msel" data-astdsel="'+id+'">'+cfg.metricSel.map(function(o){ return '<option value="'+esc(o.v)+'"'+(o.v===st.sel?' selected':'')+'>'+esc(o.label)+'</option>'; }).join('')+'</select>':'';
  var top='<div class="rs-block-top"><div class="rs-block-h">'+esc(cfg.title)+'</div>'+sel+'</div>';
  var modes=(cfg.modes||[]).map(function(g){ return '<div class="astd-modeg" data-astdmodeg="'+id+'|'+g.cls+'" style="display:inline-flex;align-items:center;gap:6px;margin:0 10px 6px 0">'+(g.label?'<span class="rs-quick-l">'+esc(g.label)+'</span>':'')+'<div class="rs-views">'+g.opts.map(function(o){ return '<button type="button" class="rs-view'+(o.v===st.modes[g.cls]?' active':'')+'" data-astdmode="'+id+'|'+g.cls+'|'+o.v+'">'+esc(o.label)+'</button>'; }).join('')+'</div></div>'; }).join('');
  var presets=cfg.presets||[['all','All'],['rep','Reported'],['fwd','Forward']];
  var quick='<div class="rs-quick"><span class="rs-quick-l">Range</span>'+presets.map(function(p){ return '<button type="button" class="rs-preset" data-astdrange="'+id+'|'+p[0]+'">'+esc(p[1])+'</button>'; }).join('')+'</div>';
  var row2='<div class="rs-block-modes"><div class="rs-modes">'+modes+'</div>'+quick+'</div>';
  var leg='<div class="ave-leg" data-astdleg="'+id+'"></div>';
  var chart='<div class="ov-chart-card"><div class="ov-chart-wrap ovs-tall" style="min-height:'+(cfg.height||320)+'px"><canvas id="astd-'+id+'"></canvas></div></div>';
  var slider='<div class="sg-controls"><div class="sg-slider"><div class="sg-track"><div class="sg-fill" data-astdfill="'+id+'"></div></div><div class="rs-ticks" data-astdticks="'+id+'"></div>'+
    '<input type="range" class="astd-r0" min="0" max="1" value="0" step="1" aria-label="Start period">'+
    '<input type="range" class="astd-r1" min="0" max="1" value="1" step="1" aria-label="End period"></div>'+
    '<div class="sg-ends"><span data-astdend0="'+id+'"></span><span data-astdend1="'+id+'"></span></div></div>';
  var tbl='<div class="rs-collap" style="margin-top:8px"><button type="button" class="rs-collap-h"><span class="rs-collap-ic">▸</span> Data — what the chart draws</button>'+
    '<div class="rs-collap-b" hidden style="padding-top:8px"><div class="rs-tablewrap" data-astdtbl="'+id+'"></div></div></div>';
  return '<div class="ov-sec" data-astdblock="'+id+'">'+top+row2+leg+chart+slider+tbl+'</div>';
}
function aStdBlk(id){ return document.querySelector('[data-astdblock="'+id+'"]'); }
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
    if(t==='bar') return { type:'bar', label:s.label, data:s.data.slice(lo,hi+1), backgroundColor:s.data.slice(lo,hi+1).map(function(_,i){ return (lo+i)>la?aFadeC(s.color,0.5):s.color; }), borderColor:'#fff', borderWidth:1, maxBarThickness:34, stack:stk, yAxisID:s.yAxisID||'y', order:s.order||3 };
    return { type:'line', label:s.label, data:s.data.slice(lo,hi+1), borderColor:s.color, backgroundColor:s.color, borderWidth:2.2, pointRadius:2, tension:0.2, spanGaps:false, yAxisID:s.yAxisID||'y', order:s.order||2,
      borderDash:s.dash?[5,4]:undefined, segment: s.fwdDash?{ borderDash:function(ctx){ return (lo+ctx.p1DataIndex)>la?[5,4]:undefined; } }:undefined }; });
  var anyBar=spec.series.some(function(s){ return (s.type||spec.type)==='bar'; }), y2f=spec.y2Fmt||function(v){return v;};
  var scales={ x:{ stacked:anyBar&&spec.stacked, grid:{ display:false }, ticks:{ font:{ size:11 } } },
    y:{ stacked:anyBar&&spec.stacked, position:'right', max:spec.yMax, grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ font:{ size:11 }, callback:function(v){ return yFmt(v); } } } };
  if(needY2) scales.y2={ position:'right', weight:1, grid:{ display:false }, ticks:{ font:{ size:11 }, callback:function(v){ return y2f(v); } } };
  _aCharts['astd-'+id]=new Chart(cv.getContext('2d'),{ type:anyBar?'bar':'line', data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(c){ var f=c.dataset.yAxisID==='y2'?y2f:yFmt; return c.dataset.label+': '+(c.parsed.y==null?'—':f(c.parsed.y))+((lo+c.dataIndex)>la?' (E)':''); } } } },
      scales:scales } });
  var blk=aStdBlk(id);
  if(blk){ var hm=spec.hideModes||[];   // contextual controls: hide groups that don't apply to the current view (SAB does this)
    blk.querySelectorAll('[data-astdmodeg]').forEach(function(g){ var cls=g.getAttribute('data-astdmodeg').split('|')[1]; g.style.display=hm.indexOf(cls)>=0?'none':'inline-flex'; }); }
  var leg=blk&&blk.querySelector('[data-astdleg="'+id+'"]');
  if(leg){
    if(spec.paired){   // one chip per source; toggling hides its bar AND its margin line. Caption disambiguates shapes.
      var seen={}, chips=[];
      spec.series.forEach(function(s){ var g=s.grp||s.k; if(seen[g])return; seen[g]=1;
        chips.push('<button type="button" class="rs-leg'+(st.hidden[s.k]?' off':'')+'" data-astdleggrp="'+id+'|'+g+'"><span class="ave-leg-act" style="background:'+s.color+'"></span>'+esc(s.src||s.label)+'</button>'); });
      leg.innerHTML=chips.join('')+'<span style="font-size:11px;color:var(--mu,#64748b);font-weight:600;margin-left:2px">Bars = $ amount &nbsp;·&nbsp; lines = margin (right axis)</span>';
    } else {
      leg.innerHTML=spec.series.map(function(s){ return '<button type="button" class="rs-leg'+(st.hidden[s.k]?' off':'')+'" data-astdlegk="'+id+'|'+s.k+'"><span class="ave-leg-act" style="background:'+s.color+'"></span>'+esc(s.label)+'</button>'; }).join('');
    }
  }
  // Collapsible data table (rule 3) — windowed + honours hidden series, like San's charts.
  var tblc=blk&&blk.querySelector('[data-astdtbl="'+id+'"]');
  if(tblc){ var vis=spec.series.filter(function(s){ return !st.hidden[s.k]; });
    var hd='<tr><th style="text-align:left;position:sticky;left:0;background:var(--card,#fff)">Series</th>'+labels.map(function(l){ return '<th style="text-align:right">'+esc(l)+'</th>'; }).join('')+'</tr>';
    var bd=vis.map(function(s){ return '<tr><td style="text-align:left;font-weight:700;position:sticky;left:0;background:var(--card,#fff)">'+esc(s.label)+'</td>'+s.data.slice(lo,hi+1).map(function(v){ return '<td style="text-align:right;font-variant-numeric:tabular-nums">'+(v==null?'—':esc(String(yFmt(v))))+'</td>'; }).join('')+'</tr>'; }).join('');
    tblc.innerHTML='<table style="width:100%;border-collapse:collapse;font-size:11.5px"><thead>'+hd+'</thead><tbody>'+bd+'</tbody></table>'; }
  aStdSyncSlider(id, spec.labels, la);
  aStdWire(id);
  // Re-attach the X-window brush to the freshly-built chart each render (onmousedown assignment, not
  // addEventListener, so it replaces rather than stacks). onX windows the PERIOD; double-click resets.
  var cvv=document.getElementById('astd-'+id), chh=_aCharts['astd-'+id];
  if(cvv&&chh) rsAttachBrush(cvv, chh, function(i1,i2){ var w=_aStd[id].win, lo=w[0]; _aStd[id].win=[lo+i1, lo+i2]; aStdRender(id); }, null, function(){ _aStd[id].win=null; aStdRender(id); });
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
    var mode=e.target.closest&&e.target.closest('[data-astdmode]'); if(mode){ var p=mode.getAttribute('data-astdmode').split('|'); st.modes[p[1]]=p[2];
      mode.parentNode.querySelectorAll('.rs-view').forEach(function(x){ x.classList.toggle('active',x===mode); }); aStdRender(id); return; }
    var lg=e.target.closest&&e.target.closest('[data-astdlegk]'); if(lg){ var k=lg.getAttribute('data-astdlegk').split('|')[1]; st.hidden[k]=!st.hidden[k]; aStdRender(id); return; }
    var lgg=e.target.closest&&e.target.closest('[data-astdleggrp]'); if(lgg){ var g=lgg.getAttribute('data-astdleggrp').split('|')[1], spc=_aStdDerive[id]&&_aStdDerive[id](st);
      if(spc){ var mem=spc.series.filter(function(s){ return (s.grp||s.k)===g; }), off=mem.every(function(s){ return st.hidden[s.k]; }); mem.forEach(function(s){ st.hidden[s.k]=!off; }); } aStdRender(id); return; }
    var rp=e.target.closest&&e.target.closest('[data-astdrange]'); if(rp){ var spec=_aStdDerive[id]&&_aStdDerive[id](st); var n=spec?spec.labels.length:2, la=spec&&spec.lastAct!=null?spec.lastAct:n-1;
      st.win=aStdPresetWin(rp.getAttribute('data-astdrange').split('|')[1], n, la); aStdRender(id); return; }
  });
  var sel=blk.querySelector('[data-astdsel]'); if(sel) sel.onchange=function(){ st.sel=sel.value; aStdRender(id); };
  var r0=blk.querySelector('.astd-r0'), r1=blk.querySelector('.astd-r1');
  function onSlide(){ var a=+r0.value, b=+r1.value; st.win=[Math.min(a,b),Math.max(a,b)]; aStdRender(id); }
  if(r0) r0.oninput=onSlide; if(r1) r1.oninput=onSlide;
}
function aZoom(id){ var cv=document.getElementById(id), ch=_aCharts[id]; if(!cv||!ch) return;
  if(ch.options&&ch.options.scales&&ch.options.scales.y){   // rule 1
    rsAttachBrush(cv, ch, null,
      function(v1,v2){ ch.options.scales.y.min=v1; ch.options.scales.y.max=v2; ch.update('none'); },
      function(){ ch.options.scales.y.min=undefined; ch.options.scales.y.max=undefined; ch.update('none'); }); }
  if(ch.options&&ch.options.plugins&&ch.options.plugins.legend){   // rule 2: legend hides the series AND refreshes the table
    var orig=Chart.defaults.plugins.legend.onClick;
    ch.options.plugins.legend.onClick=function(e,item,legend){ orig.call(this,e,item,legend); setTimeout(function(){ aBuildAutoTbl(id); },0); }; }
  aBuildAutoTbl(id);   // rule 3
}
// Collapsible data table under a chart (rule 3) — the portable rs-collap markup (§0.7).
function aTbl(id, title, headers, rows){
  var head='<span class="rs-collap-ic">▸</span> '+esc(title)+' <span class="rs-collap-sub">'+rows.length+' rows</span>';
  var thead='<tr>'+headers.map(function(hh,i){ return '<th'+(i===0?' class="rs-ft-h"':'')+'>'+esc(String(hh))+'</th>'; }).join('')+'</tr>';
  var tb=rows.map(function(r){ return '<tr>'+r.map(function(c,i){ return i===0?('<td class="rs-ft-h">'+esc(String(c))+'</td>'):('<td>'+(c==null||c===''?'<span class="rs-ft-nil">–</span>':esc(String(c)))+'</td>'); }).join('')+'</tr>'; }).join('');
  return '<div class="rs-collap" data-rstbl="'+id+'"><button type="button" class="rs-collap-h" data-rstblb="'+id+'">'+head+'</button>'+
    '<div class="rs-collap-b" id="rsTB-'+id+'" hidden><div class="rs-ft-scroll"><table class="rs-ft"><thead>'+thead+'</thead><tbody>'+tb+'</tbody></table></div></div></div>';
}
// Operating-margin bridge — revenue -> each functional cost -> operating income, as a waterfall.
// Plus the YoY margin-contribution bars (which cost line expanded / compressed the margin). No prose.
var A_MB_COST=[
  {k:'costOfSales',lab:'Cost of sales',c:'#6B7683'},
  {k:'rd',lab:'Research & development',c:BRAND},
  {k:'marketing',lab:'Sales & marketing',c:'#7A5AF8'},
  {k:'gAdmin',lab:'General & administrative',c:GRAY},
  {k:'otherOpex',lab:'Other operating expense',c:'#B7791F'}
];
// (marginBridgeBody / aBuildMarginBridge removed — the General ▸ The bridge (Margin change / bps mode)
//  supersedes the old "What moved the operating margin" bars. A_MB_COST is still used by the bridge.)
// ═══ The bridge — revenue→OI build-up ($B) and margin-change (bps) waterfalls ═══════════════════
// Ported from dis.js (boBridgePlugin/buildBoBridge): floating bars + dashed connectors + delta labels.
// Two historical modes, no sensitizing — a forward/guidance-anchored mode (AMZN gives an OI range)
// is a later pass. Short x-axis labels so all 8 steps read without autoskip.
var A_BR_SHORT={ costOfSales:'Cost of sales', rd:'R&D', marketing:'Marketing', gAdmin:'G&A', otherOpex:'Other' };
var aBrPlugin={ id:'aBrLbl', afterDatasetsDraw:function(chart){
  var steps=chart._steps; if(!steps) return; var ctx=chart.ctx, meta=chart.getDatasetMeta(0), y=chart.scales.y, fmt=chart._fmt||{};
  ctx.save();
  ctx.strokeStyle='rgba(120,130,145,.55)'; ctx.setLineDash([3,3]); ctx.lineWidth=1;
  for(var i=0;i<steps.length-1;i++){ if(steps[i].runAfter==null) continue; var b0=meta.data[i], b1=meta.data[i+1];
    var yy=y.getPixelForValue(steps[i].runAfter); ctx.beginPath(); ctx.moveTo(b0.x+b0.width/2, yy); ctx.lineTo(b1.x-b1.width/2, yy); ctx.stroke(); }
  ctx.setLineDash([]); ctx.textAlign='center';
  for(var j=0;j<steps.length;j++){ var s=steps[j], bar=meta.data[j], topPix=y.getPixelForValue(Math.max(s.range[0], s.range[1])), txt;
    if(s.kind==='base'||s.kind==='total'){ txt=(fmt.base||String)(s.val); ctx.fillStyle='#1E2733'; ctx.font='800 11px Inter, system-ui, sans-serif'; }
    else { txt=(fmt.delta||String)(s.val); ctx.fillStyle=s.dc||(s.val>=0?'#2E8B57':'#C0504D'); ctx.font='700 10.5px Inter, system-ui, sans-serif'; }
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
        if(s.kind==='base') return (fmt.base||String)(s.val);
        if(s.kind==='total') return (fmt.base||String)(s.val);
        return (fmt.delta||String)(s.val)+(s.runAfter!=null?'   ·   running '+(fmt.base||String)(s.runAfter):''); } } } },
      scales:{ x:{ grid:{display:false}, ticks:{color:'#8A93A0', font:{size:11}, autoSkip:false, maxRotation:45, minRotation:0} },
        y:{ position:'right', beginAtZero:true, grid:{color:'#EEF2F7'}, ticks:{color:'#8A93A0', font:{size:11}, callback:function(v){return (fmt.axis||String)(v);}} } } },
    plugins:[ aBrPlugin ] });
  ch._steps=steps; ch._fmt=fmt; _aCharts[id]=ch; ch.update('none'); aZoom(id);
  var tw=document.getElementById(id+'-tbl');   // rule 3: the table carries every step drawn
  if(tw){ var f=(fmt&&fmt.base)||String, fd=(fmt&&fmt.delta)||String;
    tw.innerHTML=aTbl(id, 'The waterfall — every step', ['Step','Value','Running'], steps.map(function(s){
      return [s.label, (s.kind==='base'||s.kind==='total')?f(s.val):fd(s.val), s.runAfter==null?f(s.val):f(s.runAfter)]; })); }
}
// Same build-up as a doughnut — where each revenue dollar goes (cost lines + operating income).
function aBuildBrPie(r){
  var cv=aChartReady('aBrCanvas'); if(!cv) return; aDestroy('aBrCanvas');
  var rev=r.revenue, segs=A_MB_COST.map(function(it){ return {lab:A_BR_SHORT[it.k]||it.lab, v:(r[it.k]||0), c:it.c}; });
  var oi=rev-A_MB_COST.reduce(function(a,it){ return a+(r[it.k]||0); },0);
  segs.push({lab:'Operating income', v:oi, c:'#2E8B57'});
  _aCharts['aBrCanvas']=new Chart(cv.getContext('2d'),{ type:'doughnut',
    data:{ labels:segs.map(function(s){ return s.lab; }), datasets:[{ data:segs.map(function(s){ return Math.round(s.v/100)/10; }), backgroundColor:segs.map(function(s){ return s.c; }), borderColor:'#fff', borderWidth:2 }] },
    options:{ responsive:true, maintainAspectRatio:false, cutout:'55%',
      plugins:{ legend:{ position:'right', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(c){ return c.label+': $'+c.parsed.toFixed(1)+'B ('+(rev?Math.round(c.parsed*1000/rev*100)/10:0)+'% of revenue)'; } } } } } });
  var tw=document.getElementById('aBrCanvas-tbl');
  if(tw) tw.innerHTML=aTbl('aBrCanvas','Where each revenue dollar goes',['Line','$B','% of revenue'],segs.map(function(s){ return [s.lab,'$'+(Math.round(s.v/100)/10).toFixed(1)+'B',(rev?Math.round(s.v/rev*1000)/10:0)+'%']; }));
}
// Revenue → −each functional cost → = Operating income, in $B, for one period row (annual or quarterly).
function aBridgeBuildupSteps(r){
  var rev=r.revenue/1000, run=rev;
  var steps=[{label:'Revenue', kind:'base', color:'#1E2733', range:[0,run], runAfter:run, val:rev}];
  A_MB_COST.forEach(function(it){ var c=(r[it.k]||0)/1000, hi=run; run=hi-c;
    steps.push({label:A_BR_SHORT[it.k]||it.lab, kind:'down', color:it.c, dc:'#6B7683', range:[Math.min(run,hi),Math.max(run,hi)], runAfter:run, val:-c}); });
  steps.push({label:'Op. income', kind:'total', color:'#2E8B57', range:[0,run], runAfter:null, val:run});
  return steps;
}
// Operating-margin change (ppt→bps) between two periods, decomposed by functional line.
function aBridgeBpsSteps(prev, cur, labA, labB){
  var rev=cur.revenue, prevRev=prev.revenue;
  var m0=(prevRev - A_MB_COST.reduce(function(a,it){return a+prev[it.k];},0))/prevRev*100, run=m0;
  var steps=[{label:labA, kind:'base', color:'#1E2733', range:[0,run], runAfter:run, val:m0}];
  A_MB_COST.forEach(function(it){ var contrib=(prev[it.k]/prevRev - cur[it.k]/rev)*100, lo=run; run=lo+contrib;
    steps.push({label:A_BR_SHORT[it.k]||it.lab, kind:contrib>=0?'up':'down', color:contrib>=0?'#2E8B57':'#C0504D', range:[Math.min(lo,run),Math.max(lo,run)], runAfter:run, val:contrib}); });
  steps.push({label:labB, kind:'total', color:'#1E2733', range:[0,run], runAfter:null, val:run});
  return steps;
}
var BR_FMT_D={ axis:function(v){return '$'+v.toFixed(1)+'B';}, base:function(v){return '$'+v.toFixed(2)+'B';}, delta:function(v){return (v>=0?'+$':'−$')+Math.abs(v).toFixed(2)+'B';} };   // SN scale (Amazon: whole/1-dp billions)
var BR_FMT_BPS={ axis:function(v){return v.toFixed(0)+'%';}, base:function(v){return v.toFixed(1)+'%';}, delta:function(v){var b=Math.round(v*100); return (b>=0?'+':'−')+Math.abs(b)+' bps';} };
// Synthetic "opex row" for a forward year (fi = 0..2 → FY26E..FY28E) built from BBG consensus, shaped
// exactly like an A_OPEX row so aBridgeBuildupSteps / aBuildBrPie work on it unchanged. otherOpex is the
// residual so revenue − Σcost = operating income reconciles to the reported consensus OI.
// adj = optional {cogs,fulfillment,techInfra,marketing,gAdmin} percent tweaks vs consensus. The "other"
// residual is held at consensus, so with no adj OI reconciles to consensus; move a slider and OI floats.
var FX_LINES=[{k:'cogs',lab:'Cost of sales'},{k:'rd',lab:'Research &amp; development'},{k:'marketing',lab:'Sales &amp; marketing'},{k:'gAdmin',lab:'G&amp;A'}];
function aFwdOpexRow(fi, adj){
  function f(k){ var s=snBBG.is[k]; return s?s.f[fi]:null; }
  var rev=f('rev'), oi=f('oi'); if(rev==null||oi==null) return null;
  // BBG gives forward gross profit, not COGS directly → derive COGS = revenue − gross profit.
  var cogs=f('cogs'); if(cogs==null){ var gp=f('grossProfit'); cogs=(gp!=null)?(rev-gp):0; } cogs=cogs||0;
  var rd=f('rd')||0, mkt=f('sm')||0, ga=f('ga')||0;
  var other=rev-cogs-rd-mkt-ga-oi;   // consensus residual, held fixed
  adj=adj||{}; function A(v,k){ return v*(1+((adj[k]||0)/100)); }
  return { p:'FY'+String(snBBG.yearsF[fi]).slice(2)+'E', revenue:rev, costOfSales:A(cogs,'cogs'), rd:A(rd,'rd'),
    marketing:A(mkt,'marketing'), gAdmin:A(ga,'gAdmin'), otherOpex:other };
}
function aBridgeBody(){
  var yBtns=function(cls,sel){ return SN_OPEX_YEARS.map(function(y){ return '<button type="button" data-'+cls+'="'+y+'"'+(y===sel?' class="active"':'')+'>FY'+String(y).slice(2)+'</button>'; }).join(''); };
  var qYears=[]; SN_OPEXQ.forEach(function(r){ if(qYears.indexOf(r.yr)<0) qYears.push(r.yr); });
  var qLast=SN_OPEXQ[SN_OPEXQ.length-1];
  var qyBtns=qYears.map(function(y){ return '<button type="button" data-brqy="'+y+'"'+(y===qLast.yr?' class="active"':'')+'>FY'+String(y).slice(2)+'</button>'; }).join('');
  var qqBtns=['Q1','Q2','Q3','Q4'].map(function(q){ return '<button type="button" data-brqq="'+q+'"'+(q===qLast.q?' class="active"':'')+'>'+q+'</button>'; }).join('');
  return '<div class="ov-sec"><div class="ov-sec-h">The bridge — how revenue becomes operating income</div>'+
    '<div class="mch-ctl">'+   /* §0.4 row 2: mode + view (left) */
      '<span style="display:flex;gap:6px;flex-wrap:wrap">'+
        '<span class="acx-tog br-mode"><button type="button" data-brm="buildup" class="active">Build-up ($B)</button><button type="button" data-brm="bps">Margin change (bps)</button><button type="button" data-brm="fexp">Forward (expenses)</button></span>'+
      '</span>'+
      '<span></span>'+
    '</div>'+
    '<div class="br-ctl-bu mch-ctl" style="margin:0 0 8px">'+   /* buildup window (right) */
      '<span></span>'+
      '<span style="display:flex;gap:8px;flex-wrap:wrap">'+
        '<span class="acx-tog br-gran"><button type="button" data-brg="y" class="active">Annual</button><button type="button" data-brg="q">Quarterly</button></span>'+
        '<span class="acx-tog br-yr br-sel-y">'+yBtns('bry',2025)+'</span>'+
        '<span class="acx-tog br-qy br-sel-q" style="display:none">'+qyBtns+'</span>'+
        '<span class="acx-tog br-qq br-sel-q" style="display:none">'+qqBtns+'</span>'+
      '</span>'+
    '</div>'+
    '<style>.br-sl{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;color:var(--navy)}.br-sl input{flex:1;max-width:180px;accent-color:'+BRAND+'}.br-sl-v{width:44px;text-align:right;color:var(--brand-2);font-variant-numeric:tabular-nums}.br-sl-l{width:120px}.br-fx-reset{cursor:pointer;border:1px solid var(--bdr);background:#fff;border-radius:7px;padding:5px 10px;font-size:11px;font-weight:700;color:var(--navy)}</style>'+
    '<div class="br-ctl-bps mch-ctl" style="display:none;margin:0 0 8px"><span></span>'+   /* margin-change from→to (by expense line) */
      '<span style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span style="font-size:11px;color:var(--mu)">From</span><span class="acx-tog br-from">'+yBtns('brf',2022)+'</span>'+
      '<span style="font-size:11px;color:var(--mu)">to</span><span class="acx-tog br-to">'+yBtns('brt',2025)+'</span></span></div>'+
    '<div class="br-ctl-fexp mch-ctl" style="display:none;margin:0 0 8px">'+   /* forward year (right) */
      '<span></span>'+
      '<span style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="acx-tog br-fy"><button type="button" data-brfy="0" class="active">FY26E</button><button type="button" data-brfy="1">FY27E</button><button type="button" data-brfy="2">FY28E</button></span>'+
        '<button type="button" class="br-fx-reset">Reset to consensus</button></span>'+
    '</div>'+
    '<div class="br-fx-sl" style="display:none;flex-direction:column;gap:6px;margin:0 0 10px">'+
      '<div style="font-size:10.5px;color:var(--mu)">Sensitize each cost line vs consensus (0% = BBG consensus). Operating income floats with your changes:</div>'+
      FX_LINES.map(function(l){ return '<div class="br-sl"><span class="br-sl-l">'+l.lab+'</span><input type="range" data-brx="'+l.k+'" min="-25" max="25" step="1" value="0"><span class="br-sl-v" data-brxv="'+l.k+'">0%</span></div>'; }).join('')+
    '</div>'+
    '<div style="height:340px"><canvas id="aBrCanvas"></canvas></div>'+
    '<div id="aBrCanvas-tbl" style="margin-top:8px"></div></div>';
}
function aBridgeSync(pane){
  var mb=pane.querySelector('.br-mode .active'), mode=mb?mb.getAttribute('data-brm'):'buildup';
  var bu=pane.querySelector('.br-ctl-bu'), fe=pane.querySelector('.br-ctl-fexp'), fx=pane.querySelector('.br-fx-sl'), bp=pane.querySelector('.br-ctl-bps');
  if(bu) bu.style.display=mode==='buildup'?'flex':'none';
  if(bp) bp.style.display=mode==='bps'?'flex':'none';
  if(fe) fe.style.display=mode==='fexp'?'flex':'none';
  if(fx) fx.style.display=mode==='fexp'?'flex':'none';
  var g=pane.querySelector('.br-gran .active'), q=!!(g&&g.getAttribute('data-brg')==='q');
  var sy=pane.querySelector('.br-sel-y');
  if(sy) sy.style.display=q?'none':'';
  pane.querySelectorAll('.br-sel-q').forEach(function(el){ el.style.display=q?'':'none'; });
  if(q){   // grey out quarters not yet reported for the picked year; snap the active pill onto an available quarter
    var yb=pane.querySelector('.br-qy .active'), yy=yb?+yb.getAttribute('data-brqy'):null;
    var avail=SN_OPEXQ.filter(function(r){ return r.yr===yy; }).map(function(r){ return r.q; });
    var qbtns=pane.querySelectorAll('.br-qq button'), anyActive=false;
    qbtns.forEach(function(b){ var ok=avail.indexOf(b.getAttribute('data-brqq'))>=0; b.disabled=!ok; b.style.opacity=ok?'':'0.35'; b.style.cursor=ok?'':'not-allowed'; if(b.classList.contains('active')&&!ok) b.classList.remove('active'); });
    qbtns.forEach(function(b){ if(b.classList.contains('active')) anyActive=true; });
    if(!anyActive&&avail.length){ var lastQ=avail[avail.length-1]; qbtns.forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-brqq')===lastQ); }); }
  }
}
function aBuildBridge(){
  var pane=document.querySelector('.ovt-subpane[data-ovst="blgeneral"]'); if(!pane) return;
  var mb=pane.querySelector('.br-mode .active'), mode=mb?mb.getAttribute('data-brm'):'buildup', r;
  if(mode==='bps'){   // margin change between two years, decomposed by functional expense line
    var fb=pane.querySelector('.br-from .active'), tb=pane.querySelector('.br-to .active');
    var ya=fb?+fb.getAttribute('data-brf'):2022, yb2=tb?+tb.getAttribute('data-brt'):2025, prev=SN_OPEX[ya], cur=SN_OPEX[yb2];
    if(prev&&cur) aBuildBrWaterfall('aBrCanvas', aBridgeBpsSteps(prev,cur,'FY'+String(ya).slice(2),'FY'+String(yb2).slice(2)), BR_FMT_BPS);
    return;
  }
  if(mode==='fexp'){   // forward expense build-up — BBG consensus year, sensitizable per cost line
    var fyb=pane.querySelector('.br-fy .active'), fi=fyb?+fyb.getAttribute('data-brfy'):2, adj={};
    pane.querySelectorAll('.br-fx-sl input[data-brx]').forEach(function(s){ adj[s.getAttribute('data-brx')]=+s.value;
      var v=pane.querySelector('.br-sl-v[data-brxv="'+s.getAttribute('data-brx')+'"]'); if(v) v.textContent=((+s.value)>0?'+':'')+s.value+'%'; });
    r=aFwdOpexRow(fi, adj);
  } else {             // build-up — actual year or quarter
    var g=pane.querySelector('.br-gran .active'), gran=g?g.getAttribute('data-brg'):'y';
    if(gran==='q'){ var yb2=pane.querySelector('.br-qy .active'), qb=pane.querySelector('.br-qq .active');
      var yy=yb2?+yb2.getAttribute('data-brqy'):SN_OPEXQ[SN_OPEXQ.length-1].yr, qq=qb?qb.getAttribute('data-brqq'):SN_OPEXQ[SN_OPEXQ.length-1].q;
      r=SN_OPEXQ.filter(function(x){ return x.yr===yy && x.q===qq; })[0]; }
    else { var yb=pane.querySelector('.br-yr .active'); r=SN_OPEX[yb?+yb.getAttribute('data-bry'):2025]; }
  }
  if(!r) return;
  aBuildBrWaterfall('aBrCanvas', aBridgeBuildupSteps(r), BR_FMT_D);
}
// ── OI → Net income walk, with one-off normalization. Consolidated from BBG (snBBG.is), actuals +
// consensus. (Amazon's version strips the Anthropic/Rivian marks; for SharkNinja the item normalization
// removes is defined in SN_NB_NOTE, sharkninja-bl-data.js.) It lands in GAAP "Other income (expense), net" (snBBG.is.otherNonOp,
// stored so that a negative = a gain). "Normalized" removes that gain AFTER TAX, at the period's
// effective rate — because the reported tax provision already carries the tax accrued on the gain, so
// stripping it pretax while keeping full tax would understate underlying earnings. ──
function aIsVal(k,y){ var s=snBBG.is[k]; if(!s) return null; return y<=2025 ? s.a[y-2023] : s.f[y-2026]; }
function aNetBridgeBody(){
  var years=[2023,2024,2025,2026,2027,2028];
  var yb=years.map(function(y){ return '<button type="button" data-nbyr="'+y+'"'+(y===2026?' class="active"':'')+'>FY'+String(y).slice(2)+(y>2025?'E':'')+'</button>'; }).join('');
  return '<div class="ov-sec"><div class="ov-sec-h">Operating income → net income — and the normalization</div>'+
    '<div class="mch-ctl">'+   /* §0.4 row 2: treatment (left) · window (right) */
      '<span class="acx-tog nb-norm"><button type="button" data-nbnorm="rep" class="active">Reported</button><button type="button" data-nbnorm="norm">Normalized</button></span>'+
      '<span class="acx-tog nb-yr" style="flex-wrap:wrap">'+yb+'</span>'+
    '</div>'+
    '<div style="height:330px"><canvas id="aNetBr"></canvas></div>'+
    '<div id="aNetBr-tbl" style="margin-top:8px"></div>'+
    '<div class="acx-cap" id="aNetBrCap" style="font-size:11px;color:var(--mu);margin-top:8px"></div></div>';
}
function aBuildNetBridge(){
  var pane=document.querySelector('.ovt-subpane[data-ovst="blgeneral"]'); if(!pane) return;
  var yb=pane.querySelector('.nb-yr .active'), y=yb?+yb.getAttribute('data-nbyr'):2026;
  var nt=pane.querySelector('.nb-norm .active'), norm=!!(nt&&nt.getAttribute('data-nbnorm')==='norm');
  var oi=aIsVal('oi',y), nInt=aIsVal('netInterest',y), ono=aIsVal('otherNonOp',y), tax=aIsVal('tax',y), pretax=aIsVal('pretax',y), net=aIsVal('netIncome',y), rev=aIsVal('rev',y);
  if(oi==null||net==null||tax==null) return;
  function B(x){ return x==null?0:x/1000; }
  var I = nInt==null?0:-nInt;                 // net interest income (= −netInterest; SN's is net EXPENSE on the term loan, so this is negative)
  var G = ono==null?0:-ono;                    // the non-operating item normalization removes (positive = gain) — see SN_NB_NOTE
  var effR = (pretax&&pretax>0)?(tax/pretax):0;   // period effective tax rate — used to remove the tax accrued on the gain
  var plug = net - (oi + I + G - tax);         // small reconciling item (minority interest / equity-method / consensus noise) — keeps the walk tying to reported net
  var run=B(oi), steps=[{label:'Op. income', kind:'base', color:'#1E2733', range:[0,run], runAfter:run, val:B(oi)}];
  function step(lab,d,dc){ var lo=run; run=lo+d; steps.push({label:lab, kind:d>=0?'up':'down', color:(dc==='#B7791F'?'#B7791F':'#6B7683'), dc:dc, range:[Math.min(lo,run),Math.max(lo,run)], runAfter:run, val:d}); }
  step('Net interest income', B(I), '#6B7683');
  if(!norm) step('Other non-operating, net', B(G), '#B7791F');   // the item normalization removes (see SN_NB_NOTE)
  var taxShown = norm ? -(tax - G*effR) : -tax;   // normalized: also remove the tax accrued on the stripped gain
  step(norm?'Income tax (ex-mark)':'Income tax', B(taxShown), '#6B7683');
  if(Math.abs(plug)>=5) step('Consensus rounding & other', B(plug), '#6B7683');   // only draw when non-trivial (Amazon: 50 on its $M; SN's P&L is ~1/100th the size)
  var endNet = norm ? (net - G*(1-effR)) : net;
  run=B(endNet); steps.push({label:(norm?'Net income (norm.)':'Net income'), kind:'total', color:'#2E8B57', range:[0,run], runAfter:null, val:B(endNet)});
  aBuildBrWaterfall('aNetBr', steps, BR_FMT_D);
  var cap=pane.querySelector('#aNetBrCap');
  if(cap){ var yl='FY'+String(y).slice(2)+(y>2025?'E':''), rm=(rev?net/rev*100:null), nmv=net-G*(1-effR), nm=(rev?nmv/rev*100:null);
    cap.innerHTML='<b>'+yl+'</b> — reported net margin <b>'+(rm==null?'—':rm.toFixed(1)+'%')+'</b>'+(rev?' ($'+B(net).toFixed(1)+'B on $'+B(rev).toFixed(1)+'B revenue)':'')+', normalized <b>'+(nm==null?'—':nm.toFixed(1)+'%')+'</b> (effective tax rate '+(effR*100).toFixed(0)+'%).<br>'+SN_NB_NOTE;
  }
}
// SBC — General tab. Dilution view overlays Summit's diluted-share forecast on consensus (Summit holds
// shares flat, i.e. SBC dilution assumed offset; BBG carries continued dilution). By-line = BBG breakdown.
// Summit diluted shares — snapshot of the Summit DCF (amzn-target-multiple SNAP_DATA, 8/4/26 vintage):
// FY23-25 actual, FY26-28E held flat at the FY25 level (10,827M). Summit does NOT publish an SBC-$
// forecast, so the $ bars stay BBG-only (no fabricated Summit SBC line).
var A_SUMMIT_SHARES=null;   // no Summit DCF for SN
function aSbcBody(){
  return '<div class="ov-sec"><div class="ov-sec-h">Stock-based compensation &amp; dilution</div>'+
    '<div class="mch-ctl">'+
      '<span class="acx-tog sbcv-tog"><button type="button" data-sbcv="dilution" class="active">Dilution</button><button type="button" data-sbcv="line">SBC by line</button></span>'+
      '<span class="acx-tog sbcu-tog"><button type="button" data-sbcu="usd" class="active">$M</button><button type="button" data-sbcu="pct">%</button></span>'+
    '</div>'+
    '<div class="ave-leg" data-sbcleg="1" style="margin:2px 0 8px"></div>'+
    '<div style="height:320px"><canvas id="aSbcMain"></canvas></div></div>';
}
function aSbcSer(k){ var s=snBBG.is[k]; return s?s.a.concat(s.f):[null,null,null,null,null,null]; }
function aBuildSbc(){
  var pane=document.querySelector('.ovt-subpane[data-ovst="blgeneral"]'); if(!pane) return;
  var uw=pane.querySelector('.sbcu-tog .active'), pct=!!(uw&&uw.getAttribute('data-sbcu')==='pct');   // $B vs % (of revenue in Dilution; of the line's expense in By line)
  var vw=pane.querySelector('.sbcv-tog .active'), view=vw?vw.getAttribute('data-sbcv'):'dilution';
  var cv=aChartReady('aSbcMain'); if(!cv) return; aDestroy('aSbcMain');
  var labels=['FY23','FY24','FY25','FY26E','FY27E','FY28E'], legEl=pane.querySelector('[data-sbcleg]');
  var SBC_BAR='rgba(30,39,51,0.42)';   // SBC $ = muted navy context bars; the two share lines carry the comparison
  if(view==='dilution'){   // SBC (bars) vs diluted shares — Summit (flat) vs Consensus (rising)
    var sbc=aSbcSer('sbc'), shC=aSbcSer('dilShares'), rvS=aSbcSer('rev');
    var bars=labels.map(function(_,i){ return sbc[i]==null?null:(pct?(rvS[i]?Math.round(sbc[i]/rvS[i]*1000)/10:null):Math.round(sbc[i]*10)/10); });   // SN: SBC in $M (Amazon: $B)
    var shCons=labels.map(function(_,i){ return shC[i]==null?null:Math.round(shC[i]); });
    var shVals=shCons.filter(function(v){ return v!=null; }), shMin=shVals.length?Math.min.apply(null,shVals):0, shMax=shVals.length?Math.max.apply(null,shVals):1, shPad=Math.max(1,(shMax-shMin)*0.6);
    function fdash(ctx){ return ctx.p1DataIndex>=3?[5,4]:undefined; }   // dash the forward segment
    _aCharts['aSbcMain']=new Chart(cv.getContext('2d'),{ data:{ labels:labels, datasets:[
      { type:'bar', label:'SBC '+(pct?'(% of rev)':'($M)'), data:bars, backgroundColor:bars.map(function(_,i){ return i<3?SBC_BAR:'rgba(30,39,51,0.20)'; }), borderColor:'#fff', borderWidth:1, maxBarThickness:46, yAxisID:'y', order:3 },

      { type:'line', label:'Diluted shares — Actual & Consensus (BBG)', data:shCons, borderColor:ASTD_CONS, backgroundColor:ASTD_CONS, borderWidth:2.6, pointRadius:2.6, tension:0.15, yAxisID:'y1', order:2, segment:{ borderDash:fdash } } ]},
      options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
        plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(c){ return c.dataset.yAxisID==='y1'? c.dataset.label+': '+c.parsed.y.toLocaleString()+'M'+(c.dataIndex>2?' (E)':'') : c.dataset.label+': '+(pct?c.parsed.y+'%':'$'+c.parsed.y.toFixed(1)+'M')+(c.dataIndex>2?' (E)':''); } } } },
        scales:{ x:{ grid:{ display:false } },
          y:{ position:'left', title:{ display:true, text:pct?'SBC (% of rev)':'SBC ($M)', font:{ size:11 } }, grid:{ color:'rgba(0,0,0,0.05)' }, beginAtZero:true, ticks:{ callback:function(v){ return pct?v+'%':'$'+v+'M'; } } },
          y1:{ position:'right', title:{ display:true, text:'Diluted shares (M)', font:{ size:11 } }, grid:{ display:false }, suggestedMin:Math.floor(shMin-shPad), suggestedMax:Math.ceil(shMax+shPad), ticks:{ callback:function(v){ return v.toLocaleString(); } } } } } });
    if(legEl) legEl.innerHTML=[['SBC '+(pct?'(% of rev)':'($M)'),SBC_BAR],['Diluted shares — Actual & Consensus (BBG)',ASTD_CONS]].map(function(p){ return '<span style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:var(--mu);margin-right:14px"><span style="width:13px;height:13px;border-radius:3px;background:'+p[1]+'"></span>'+p[0]+'</span>'; }).join('')+'<span style="font-size:11px;color:var(--mu)">'+SN_SBC_NOTE+'</span>';
  } else {
    if(legEl) legEl.innerHTML='';
    var LN=[{sbc:'sbcCogs',exp:'cogs',lab:'Cost of sales',c:SQUID},{sbc:'sbcRD',exp:'rd',lab:'Research & development',c:BRAND},{sbc:'sbcSM',exp:'sm',lab:'Sales & marketing',c:GREEN},{sbc:'sbcGA',exp:'ga',lab:'General & administrative',c:GRAY}];
    var tot=aSbcSer('sbc');   // in By line, % = each line's share of TOTAL SBC that period
    var ds=LN.map(function(l){ var s=aSbcSer(l.sbc);
      var vals=labels.map(function(_,i){ if(s[i]==null) return null; return pct?(tot[i]?Math.round(s[i]/tot[i]*1000)/10:null):Math.round(s[i]*10)/10; });
      return { label:l.lab, data:vals, backgroundColor:vals.map(function(_,i){ return i<3?l.c:acxRGBA(l.c,0.45); }), borderColor:'#fff', borderWidth:1, maxBarThickness:44, stack:'s' }; });
    _aCharts['aSbcMain']=new Chart(cv.getContext('2d'),{ type:'bar', data:{ labels:labels, datasets:ds },
      options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(c){ return c.dataset.label+': '+(c.parsed.y==null?'—':(pct?c.parsed.y+'% of total SBC':'$'+c.parsed.y.toFixed(1)+'M')); }, footer:function(it){ return pct?'':'Total SBC: $'+it.reduce(function(a,x){ return a+(x.parsed.y||0); },0).toFixed(1)+'M'; } } } },
        scales:{ x:{ stacked:true, grid:{ display:false } }, y:{ stacked:true, max:pct?100:undefined, grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return pct?v+'%':'$'+v+'M'; } } } } } });
  }
  aZoom('aSbcMain');
  if(pane && !pane._sbcmWired){ pane._sbcmWired=true;
    pane.querySelectorAll('.sbcv-tog button, .sbcu-tog button').forEach(function(b){ b.onclick=function(){ b.parentNode.querySelectorAll('button').forEach(function(x){ x.classList.toggle('active',x===b); }); aBuildSbc(); }; }); }
}
// General master chart-picker — one dropdown swaps which chart is on screen (less-by-default; the
// others stay hidden until chosen). Sections are wrapped in .gen-sec[data-gsec]; wiring in aBuildExpenses.
function aGeneralPicker(){
  var opts=[['margins','Profitability & margins'],['bridge','The bridge — revenue → operating income'],['net','Operating income → net income'],['sbc','Stock-based compensation']];
  return '<div class="ov-sec" style="padding-bottom:10px"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">'+
    '<span style="font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu)">Chart</span>'+
    '<select class="gen-chart" style="font-size:13px;font-weight:700;color:var(--navy);border:1px solid var(--bdr);border-radius:8px;padding:6px 10px;background:#fff">'+
    opts.map(function(o){ return '<option value="'+o[0]+'"'+(o[0]==='margins'?' selected':'')+'>'+o[1]+'</option>'; }).join('')+
    '</select>'+
    '<span style="font-size:11px;color:var(--mu)">Pick one — the rest stay tucked away.</span>'+
    '</div></div>';
}
// Summit annual aggregation from snResults quarterly (1Q23..2Q28 → FY23..FY28E). Sums each fiscal
// year's quarters; FY28 is partial (2 quarters published) so it returns null there to avoid a false low.
var ASUM_FYQ=[[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15],[16,17,18,19],[20,21]];
function aSumOpAnnual(metricKey){
  var q=snResults.views&&snResults.views.q&&snResults.views.q.metrics, m=q&&q[metricKey];
  if(!m||!m.summit) return null;
  return ASUM_FYQ.map(function(idxs){ if(idxs.length<4) return null; var s=0,ok=true;
    idxs.forEach(function(j){ var v=m.summit[j]; if(v==null) ok=false; else s+=v; }); return ok?s:null; });
}
// Summit's annual {numerator, revenue} for FY23..FY28E for a margin metric — operating (aggregated from
// the quarterly model), EBITDA and net income (from the annual model, y.ebitda / y.earnings). Gross and
// FCF are not modelled by Summit → returns null (no Summit line).
function aSummitAnnual(sel){ return null;   // no Summit DCF for SN — the Amazon body below is kept for a future model

  var y=snResults.views&&snResults.views.y&&snResults.views.y.metrics;
  if(sel==='operating'){ var so=aSumOpAnnual('opinc'), sr=aSumOpAnnual('rev'); return (so&&sr)?{num:so,den:sr}:null; }
  if(sel==='ebitda' && y&&y.ebitda&&y.rev&&y.ebitda.summit&&y.rev.summit) return {num:y.ebitda.summit.slice(3,9), den:y.rev.summit.slice(3,9)};   // y periods 2020..2028 → slice 3..8 = FY23..FY28E
  if(sel==='net' && y&&y.earnings&&y.rev&&y.earnings.summit&&y.rev.summit) return {num:y.earnings.summit.slice(3,9), den:y.rev.summit.slice(3,9)};
  return null;
}
// Summit's annual segment operating income (single fiscal year, ASUM_FYQ index) from the quarterly model.
function aMarginsBody(){
  return aStdScaffold({ id:'margins', title:'Profitability & margins', height:360,
    metricSel:[{v:'gross',label:'Gross profit'},{v:'operating',label:'Operating income (GAAP)',on:true},{v:'ebitda',label:'Adjusted EBITDA'},{v:'net',label:'Net income (GAAP)'},{v:'fcf',label:'Free cash flow'}],
    modes:[{cls:'gran',label:'Period',opts:[{v:'y',label:'Annual',on:true},{v:'q',label:'Quarterly'}]},{cls:'norm',label:'Net',opts:[{v:'rep',label:'Reported',on:true},{v:'norm',label:'Normalized'}]}],
    presets:[['all','All'],['rep','Reported'],['fwd','Forward'],['l5','Last 5']] });
}
function aLastActIdx(arr){ var la=0; for(var i=0;i<arr.length;i++) if(arr[i]!=null) la=i; return la; }
var MARG_LAB2={gross:'Gross profit',operating:'Op. income',ebitda:'Adj. EBITDA',net:'Net income',fcf:'FCF'};
// SAB dual-axis: the $ amount as bars (Actual/Summit/Consensus grouped) + the margin % as lines on the
// right y2 axis. `numX`/`revX` are the per-source $ series (null outside their window); sm = Summit {num,den}.
// normSub[i] = the AFTER-TAX one-off to REMOVE from a normalized value (gain × (1 − effective rate)).
// Subtracting it lowers a gain-flattered net income to its underlying level (see the net bridge).
function aMargDual(lab, actNum, conNum, rev, la, normOn, normSub, sm){
  function amt(v,i){ if(v==null) return null; if(normOn&&normSub) v=v-(normSub[i]||0); return Math.round(v/10)/100; }   // SN scale: $B to 2 dp (Amazon: 1 dp)
  function marg(v,i){ if(v==null||!rev[i]) return null; if(normOn&&normSub) v=v-(normSub[i]||0); return Math.round(v/rev[i]*1000)/10; }
  var series=[
    {k:'act$',grp:'act',src:'Actual',label:lab+' — Actual',color:ASTD_ACT,type:'bar',data:actNum.map(amt)},
    {k:'con$',grp:'con',src:'Consensus',label:lab+' — Consensus',color:ASTD_CONS,type:'bar',data:conNum.map(amt)},
    {k:'actM',grp:'act',src:'Actual',label:'Margin — Actual',color:ASTD_ACT,type:'line',yAxisID:'y2',data:actNum.map(marg)},
    {k:'conM',grp:'con',src:'Consensus',label:'Margin — Consensus',color:ASTD_CONS,type:'line',yAxisID:'y2',dash:true,data:conNum.map(marg)} ];
  if(sm&&!normOn){ series.splice(1,0,{k:'sum$',grp:'sum',src:'Summit',label:lab+' — Summit',color:ASTD_SUMMIT,type:'bar',data:sm.num.map(function(v){ return v==null?null:Math.round(v/100)/10; })});
    series.push({k:'sumM',grp:'sum',src:'Summit',label:'Margin — Summit',color:ASTD_SUMMIT,type:'line',yAxisID:'y2',data:sm.num.map(function(v,i){ return (v==null||!sm.den[i])?null:Math.round(v/sm.den[i]*1000)/10; })}); }
  return series;
}
function aBuildMargins(){
  aStdRender('margins', function(st){
    var gran=st.modes.gran||'y', metric=st.sel||'operating', lab=MARG_LAB2[metric], normOn=metric==='net'&&st.modes.norm==='norm';
    var out={ type:'bar', stacked:false, yFmt:function(x){ return '$'+(x==null?'':x.toFixed(2))+'B'; }, y2Fmt:function(x){ return x+'%'; } };
    if(gran==='q' && metric==='operating'){   // snResults native, 22 quarters, all three sources
      var Q=snResults.views.q.metrics, oi=Q.opIncome, rv=Q.rev, labels=oi.periods.slice(), la=aLastActIdx(oi.act);
      function amtS(a){ return labels.map(function(_,i){ return a&&a[i]!=null?Math.round(a[i]/10)/100:null; }); }
      function margS(a,r){ return labels.map(function(_,i){ return (a&&a[i]!=null&&r&&r[i])?Math.round(a[i]/r[i]*1000)/10:null; }); }
      out.labels=labels; out.lastAct=la; out.paired=true; out.series=[
        {k:'act$',grp:'act',src:'Actual',label:'Op. income — Actual',color:ASTD_ACT,type:'bar',data:amtS(oi.act)},

        {k:'con$',grp:'con',src:'Consensus',label:'Op. income — Consensus',color:ASTD_CONS,type:'bar',data:amtS(oi.cons)},
        {k:'actM',grp:'act',src:'Actual',label:'Margin — Actual',color:ASTD_ACT,type:'line',yAxisID:'y2',data:margS(oi.act,rv.act)},

        {k:'conM',grp:'con',src:'Consensus',label:'Margin — Consensus',color:ASTD_CONS,type:'line',yAxisID:'y2',dash:true,data:margS(oi.cons,rv.cons)} ];
      return out;
    }
    var MET={gross:'grossProfit',operating:'oi',ebitda:'ebitdaAdj',net:'netIncome',fcf:'fcf'};
    var num=snBBG.is[MET[metric]], rvb=snBBG.is.rev; if(!num||!rvb) return null;
    if(gran==='q'){   // other metrics quarterly — BBG (Actual + Consensus)
      var ql=snBBG.qtrs.slice(), nq=num.q, rq=rvb.q, laq=(num.qA?num.qA.length-1:aLastActIdx(nq));   // actual quarters end at qA.length-1 — the q[] array is fully populated (actual+consensus), so aLastActIdx alone wrongly marks every quarter actual
      var actN=ql.map(function(_,i){ return i<=laq?nq[i]:null; }), conN=ql.map(function(_,i){ return i>=laq?nq[i]:null; });
      out.labels=ql; out.lastAct=laq; out.paired=true; out.series=aMargDual(lab, actN, conN, rq, laq, false, null, null); return out;
    }
    var labels=['FY23','FY24','FY25','FY26E','FY27E','FY28E'], la=2;
    var na=num.a.concat(num.f), rv=rvb.a.concat(rvb.f);
    // after-tax one-off to strip when normalizing net income: gain × (1 − effective rate), gain = −otherNonOp
    var ono=snBBG.is.otherNonOp, taxA=snBBG.is.tax, preA=snBBG.is.pretax, normSub=null;
    if(metric==='net' && ono && taxA && preA){ var oaA=ono.a.concat(ono.f), tA=taxA.a.concat(taxA.f), pA=preA.a.concat(preA.f);
      normSub=labels.map(function(_,i){ var G=oaA[i]==null?0:-oaA[i], eff=(pA[i]?tA[i]/pA[i]:0); return G*(1-eff); }); }
    var actN=labels.map(function(_,i){ return i<=la?na[i]:null; }), conN=labels.map(function(_,i){ return i>=la?na[i]:null; });
    out.labels=labels; out.lastAct=la; out.paired=true; out.series=aMargDual(lab, actN, conN, rv, la, normOn, normSub, aSummitAnnual(metric)); return out;
  });
}
// Expense-line full dives — opened from an Expenses card via data-detail="exp:<key>". VISUAL, not prose.
var EW_CSS='<style>'+
  '.ew-h{font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--brand-2);margin:18px 0 9px;display:flex;align-items:center;gap:8px}.ew-h::after{content:"";flex:1;height:1px;background:var(--bdr)}'+
  '.ew-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:560px){.ew-two{grid-template-columns:1fr}}'+
  '.ew-box{border:1px solid var(--bdr);border-radius:10px;padding:12px 14px;background:var(--card,#fff)}'+
  '.ew-box-h{font-size:13px;font-weight:800;color:var(--navy);display:flex;align-items:center;gap:8px;margin-bottom:5px}.ew-box-i{font-size:18px}'+
  '.ew-box-t{font-size:11.5px;color:var(--navy);line-height:1.5}'+
  '.ew-note{font-size:12px;color:var(--navy);background:rgba(20,110,180,.06);border-radius:8px;padding:9px 12px;margin-top:9px;line-height:1.5}'+
  '.ew-spark{display:flex;align-items:flex-end;gap:5px;height:96px;margin:4px 0}'+
  '.ew-sb{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:3px}'+
  '.ew-sb-v{font-size:9.5px;font-weight:800;color:var(--navy)}.ew-sb-bar{width:100%;border-radius:4px 4px 0 0;background:#B7CBE0}.ew-sb.on .ew-sb-bar{background:var(--brand-2)}.ew-sb-l{font-size:8.5px;color:var(--mu)}'+
  '.ew-flow{display:flex;align-items:stretch;flex-wrap:wrap;margin:2px 0}'+
  '.ew-fn{flex:1;min-width:110px;border:1px solid var(--bdr);border-radius:9px;padding:9px 11px;background:var(--card,#fff);text-align:center}'+
  '.ew-fn-v{font-size:14px;font-weight:800;color:var(--navy)}.ew-fn-l{font-size:9.5px;color:var(--mu);font-weight:600;margin-top:2px}'+
  '.ew-far{display:flex;align-items:center;justify-content:center;color:var(--brand-2);font-size:18px;font-weight:800;padding:0 6px}'+
  '.ew-q{border-left:3px solid var(--brand);background:rgba(0,0,0,.025);border-radius:0 8px 8px 0;padding:9px 13px;margin:8px 0;font-size:12px;line-height:1.55;color:var(--navy)}'+
  '.ew-q .ew-att{display:block;margin-top:4px;font-size:10.5px;font-weight:700;color:var(--mu)}'+
  
  '.ew-tls{position:relative;margin:8px 0 2px;padding-left:20px}'+'.ew-tls::before{content:"";position:absolute;left:5px;top:5px;bottom:5px;width:2px;background:var(--bdr)}'+'.ew-tli{position:relative;margin-bottom:13px}.ew-tli:last-child{margin-bottom:2px}'+'.ew-tli::before{content:"";position:absolute;left:-18px;top:3px;width:9px;height:9px;border-radius:50%;background:var(--brand-2);border:2px solid var(--card,#fff);box-shadow:0 0 0 1px var(--bdr)}'+'.ew-tlq{font-size:10px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--brand-2)}'+'.ew-tlt{font-size:12px;color:var(--navy);line-height:1.5;margin-top:2px}'+'.ew-tlw{font-size:10px;font-weight:700;color:var(--mu);margin-top:3px}'+'.ew-tag{display:inline-block;font-size:8px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:1px 6px;border-radius:5px;margin-left:7px;vertical-align:middle;transform:translateY(-1px)}'+'.ew-tag.why{background:rgba(192,80,77,.13);color:#B23A38}.ew-tag.fwd{background:rgba(46,139,87,.15);color:#2E7D51}.ew-tag.ctx{background:rgba(107,118,131,.15);color:#5B6673}'+
  '.ew-calls{margin-top:14px}.ew-callsum{font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--brand-2);cursor:pointer;list-style:none;display:flex;align-items:center;gap:8px;padding:5px 0}'+
  '.ew-callsum::-webkit-details-marker{display:none}.ew-callsum::before{content:"▸";font-size:11px;transition:transform .15s}.ew-calls[open] .ew-callsum::before{content:"▾"}.ew-callsum::after{content:"";flex:1;height:1px;background:var(--bdr)}'+
'</style>';
var EW_LABS=SN_EW_LABS, EW_LABS_AMZN=["’18","’19","’20","’21","’22","’23","’24","’25"];
function ewSpark(vals,onIdx){ var mx=Math.max.apply(null,vals.map(Math.abs))||1;   // ||1: an all-zero line (SN's residual 'Other') must not divide by zero
  return '<div class="ew-spark">'+vals.map(function(v,i){ return '<div class="ew-sb'+(i===onIdx?' on':'')+'"><div class="ew-sb-v">'+v+'%</div><div class="ew-sb-bar" style="height:'+Math.max(2,Math.round(Math.abs(v)/mx*72))+'px"></div><div class="ew-sb-l">'+EW_LABS[i]+'</div></div>'; }).join('')+'</div>';
}
function ewBoxes(arr){ return '<div class="ew-two"'+(arr.length<2?' style="grid-template-columns:1fr"':'')+'>'+arr.map(function(b){ return '<div class="ew-box"><div class="ew-box-h"><span class="ew-box-i">'+b[0]+'</span>'+b[1]+'</div><div class="ew-box-t">'+b[2]+'</div></div>'; }).join('')+'</div>'; }
// Collapsible "what management has said" block — hidden by default so the dive reads clean.
function ewCallsBlock(calls){ if(!calls||!calls.length) return '';
  return '<details class="ew-calls" open><summary class="ew-callsum">What management has said</summary>'+ewCallTimeline(calls)+'</details>';
}
function ewQord(q){ var m=/Q(\d)\s*(\d{4})/.exec(q||''); if(m) return (+m[2])*10+(+m[1]); var y=/(\d{4})/.exec(q||''); return y?(+y[1])*10:0; }
function ewCallTimeline(calls){ if(!calls||!calls.length) return '';
  var sorted=calls.slice().sort(function(a,b){ return ewQord(a.q)-ewQord(b.q); });   // always oldest → newest
  return '<div class="ew-tls">'+sorted.map(function(c){ return '<div class="ew-tli"><div class="ew-tlq">'+c.q+'</div><div class="ew-tlt">'+c.txt+'</div>'+(c.who&&c.who!=='—'?'<div class="ew-tlw">— '+c.who+'</div>':'')+'</div>'; }).join('')+'</div>';
}
function ewBase(c){
  var h='<div class="ov-kpis">'+c.kpis.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-v">'+k[0]+'</div><div class="ov-kpi-d muted">'+k[1]+'</div></div>'; }).join('')+'</div>';
  if(c.def){ h+='<div class="ew-h">How the 10-K defines it</div><div class="ew-q ew-def">“'+c.def+'”<span class="ew-att">'+SN_EW_SRC+'</span></div>'; }
  h+='<div class="ew-h">What sits inside this line</div>'+ewBoxes(c.comp);
  if(c.compNote) h+='<div class="ew-note">'+c.compNote+'</div>';
  h+='<div class="ew-h">Share of revenue over time</div>'+ewSpark(c.traj,c.traj.length-1);
  if(c.unit){ h+='<div class="ew-h">Unit economics</div>'+c.unit; }
  h+='<div class="ew-h">Why it matters to the bottom line</div><div class="ew-note">'+c.why+'</div>';
  if(c.drivers){ h+='<div class="ew-h">Why it has moved — the drivers</div>'+ewBoxes(c.drivers); }
  if(c.extra) h+=c.extra;
  if(c.calls){ h+=ewCallsBlock(c.calls); }
  h+='<div class="ov-foot">FY2025 figures unless noted. Sources: SharkNinja 10-K MD&amp;A + Notes; SharkNinja earnings calls (management commentary).</div>';
  return h;
}
// Verbatim line-item definitions — the EXACT wording from Amazon's FY2025 Form 10-K, MD&A ▸ Operating
// Expenses (SEC EDGAR accession 0001018724-26-000004, amzn-20251231.htm). Quoted, not paraphrased.
// (EXP_WORLD pop-up index removed — the expense full dives now render inline as tabs, see expenseTabsBody.)
// The six functional expense lines as a clickable index — rendered at the TOP of the
// Margins & Expenses pane styles. Self-contained.
// The six functional expense lines as an inline TAB strip (was 6 big cards + a cramped pop-up):
// pick a line and its full dive (ewBase: composition, unit economics, drivers, calls) renders in place.
function expenseTabsBody(){
  var COL={costOfSales:SQUID,rd:BRAND,marketing:GREEN,gAdmin:GRAY,otherOpex:'#B7791F'};
  var defs=SN_EXP_DEFS.map(function(d){ return {k:d.k,c:COL[d.k]||GRAY,n:d.n,tag:d.tag}; });
  var byk={}; SN_EW_LINES.forEach(function(l){ byk[l.k]=l; });
  var h='<style>'+
    '.exp-explorer{border:1.5px solid var(--brand);border-radius:14px;padding:14px 16px 16px;background:linear-gradient(180deg,var(--brand-soft),transparent);margin:6px 0 6px}'+
    '.exp-explorer-h{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--brand-2);margin:0 0 11px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}'+
    '.exp-explorer-h .exp-hint{font-size:9px;font-weight:700;text-transform:none;letter-spacing:0;color:var(--mu);background:#fff;border:1px solid var(--bdr);border-radius:20px;padding:2px 9px}'+
    '.exp-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}'+
    '.exp-tab{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--bdr);background:#fff;border-radius:20px;padding:7px 12px;cursor:pointer;font-size:12px;font-weight:800;color:var(--navy);transition:.13s}'+
    '.exp-tab:hover{border-color:var(--brand)}'+
    '.exp-tab.active{background:var(--navy);border-color:var(--navy);color:#fff}'+
    '.exp-tab.active .exp-tag{color:rgba(255,255,255,.8)}'+
    '.exp-tab .exp-dot{width:10px;height:10px;border-radius:3px;flex:none}'+
    '.exp-tab .exp-tag{font-size:10px;font-weight:800;color:var(--mu)}'+
    '.exp-panel-card{background:var(--card,#fff);border:1px solid var(--bdr);border-radius:12px;padding:15px 17px}'+
  '</style>';
  h+='<div class="exp-explorer"><div class="exp-explorer-h">Expense explorer — the five functional lines <span class="exp-hint">tap a line to switch</span></div>';
  h+='<div class="exp-tabs">'+defs.map(function(d,i){ return '<button type="button" class="exp-tab'+(i===0?' active':'')+'" data-exptab="'+d.k+'"><span class="exp-dot" style="background:'+d.c+'"></span>'+d.n+' <span class="exp-tag">'+d.tag+'</span></button>'; }).join('')+'</div>';
  h+=EW_CSS;
  h+='<div class="exp-panels">'+defs.map(function(d,i){ return '<div class="exp-panel exp-panel-card" data-exppanel="'+d.k+'"'+(i>0?' hidden':'')+'>'+(byk[d.k]?ewBase(byk[d.k]):'')+'</div>'; }).join('')+'</div>';
  h+='</div>';
  return h;
}
function aBuildExpenses(){
  aBuildBridge();
  aBuildNetBridge();
  aBuildSbc();
  var pane=document.querySelector('.ovt-subpane[data-ovst="blgeneral"]');
  if(pane){
    var tog=function(sel,after){ pane.querySelectorAll(sel+' button').forEach(function(b){ b.onclick=function(){ pane.querySelectorAll(sel+' button').forEach(function(x){ x.classList.toggle('active',x===b); }); after(); }; }); };
    if(!pane._expWired){ pane._expWired=true;
      var GEN_BUILD={ margins:aBuildMargins, bridge:function(){ aBridgeSync(pane); aBuildBridge(); }, net:aBuildNetBridge, sbc:aBuildSbc };
      var gsel=pane.querySelector('.gen-chart');
      if(gsel){ gsel.onchange=function(){ var v=gsel.value;
        pane.querySelectorAll('.gen-sec').forEach(function(s){ s.hidden=(s.getAttribute('data-gsec')!==v); });
        if(GEN_BUILD[v]) GEN_BUILD[v](); }; }
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
        pane.querySelectorAll('.exp-panel').forEach(function(p){ p.hidden=(p.getAttribute('data-exppanel')!==k); }); }; });
      aBridgeSync(pane); }
  }
}
function acxRGBA(hex,a){ var h=hex.replace('#',''); var r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16); return 'rgba('+r+','+g+','+b+','+a+')'; }

// ════ SN entry points ═══════════════════════════════════════════════════════════════════════════
// amzn.js deepDiveHtml 'margins' sub-pane body, verbatim.
// The toggle/caption styles these views use. On Amazon they arrive with the Capex & Depreciation
// pane (amzn.js bottomlineCapexBody); SN has no such pane, so the rules ship here, verbatim.
var BL_TOG_CSS='<style>'+
    '.acx-tog{display:inline-flex;border:1px solid var(--bdr);border-radius:8px;overflow:hidden;flex-wrap:wrap}'+
    '.acx-tog button{appearance:none;border:0;border-right:1px solid var(--bdr);background:#fff;font:600 12px Inter,sans-serif;color:var(--mu);padding:7px 16px;cursor:pointer}.acx-tog button:last-child{border-right:0}.acx-tog button:hover{color:var(--navy)}.acx-tog button.active{background:var(--navy);color:#fff}'+
    '.acx-reset{border:1px solid var(--bdr);background:#fff;color:var(--navy);font:inherit;font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;border-radius:6px;padding:5px 10px;cursor:pointer}.acx-reset:hover{background:rgba(0,0,0,.03)}'+
    '.acx-read{font-size:11px;color:var(--mu);font-variant-numeric:tabular-nums;margin:8px 0 0;line-height:1.5}.acx-read b{color:var(--navy)}'+
    '.acx-cap{font-size:11px;color:var(--mu);line-height:1.45;margin-top:8px}.acx-cap b{color:var(--navy);font-weight:600}'+
    '.mch-ctl{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin:8px 0 4px}'+
  '</style>';
export function snBlGeneralBody(){
  return BL_TOG_CSS+aGeneralPicker()+
    '<div class="gen-sec" data-gsec="margins">'+aMarginsBody()+'</div>'+
    '<div class="gen-sec" data-gsec="bridge" hidden>'+aBridgeBody()+'</div>'+
    '<div class="gen-sec" data-gsec="net" hidden>'+aNetBridgeBody()+'</div>'+
    '<div class="gen-sec" data-gsec="sbc" hidden>'+aSbcBody()+'</div>'+
    aCollap('Expense lines — the five functional deep dives (unit economics, drivers, calls)', expenseTabsBody(), false);
}
// amzn.js aBuildSub('bottomline', …): build the visible charts (Chart.js needs a visible pane).
export function snBlGeneralBuild(){ aBuildMargins(); aBuildExpenses(); }