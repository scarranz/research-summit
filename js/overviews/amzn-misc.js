// overviews/amzn-misc.js — Amazon Deep Dive ▸ Miscellaneous ▸ Capacity → revenue (MISC-capacity). Playbook §15b.
// Copy of googl-misc.js googlCapacityBody/googlCapacityBuild and their helpers (formal layout: tables over cards, no emoji,
// one source footer), with Amazon's chain: capex → power added → (installed capacity: not disclosed) → backlog → AWS revenue.
// AWS revenue, its consensus and Summit come from js/results-data/amzn.js (the series Results draws); the backlog from
// js/segments-data/amzn.js (shared.rpo, as Top Line); every text row from amzn-misc-data.js. Summit = the frozen
// 2026-10-30 snapshot (rule 10; forward years from the Results dataset).
import { amznResults } from '../results-data/amzn.js';
import { amznSegments } from '../segments-data/amzn.js';
import { AMZN_CHAIN, AMZN_BACKLOG_NOTE, AMZN_AWS_REGIONS, AMZN_AWS_REGIONS_SRC } from './amzn-misc-data.js';

function tbl(head, rows, cls, numFrom){
  return '<div class="twrap mx-twrap"><table class="rt mx-tbl'+(cls?' '+cls:'')+'"><thead><tr>'+head.map(function(h,i){ return '<th'+(numFrom!=null&&i>=numFrom?' class="mx-n"':'')+'>'+h+'</th>'; }).join('')+
    '</tr></thead><tbody>'+rows.map(function(r){ var rc=r._cls?' class="'+r._cls+'"':''; return '<tr'+rc+'>'+r.map(function(c,i){ return '<td'+(i===0?' class="mx-k"':(numFrom!=null&&i>=numFrom?' class="mx-n"':''))+'>'+c+'</td>'; }).join('')+'</tr>'; }).join('')+'</tbody></table></div>';
}
function h3(t){ return '<div class="ew-h">'+t+'</div>'; }
function bn(m){ return m==null ? '—' : '$'+(m/1000).toFixed(1)+'B'; }
function bB(v){ return v==null ? '—' : '$'+v.toFixed(1)+'B'; }
function mm(v){ return v==null ? '—' : (v<0?'(':'')+Math.abs(v).toLocaleString('en-US')+(v<0?')':''); }
function row(arr, cls){ arr._cls=cls; return arr; }
// Collapsible section — toggled by amznCapacityBuild (data-selfwired: the profile’s global handler skips it).
function collap(title, inner, open){
  return '<div class="rs-collap mx-collap"><button type="button" class="rs-collap-h" data-selfwired="1" data-mx="1"><span class="rs-collap-ic">'+(open?'▾':'▸')+'</span> '+title+'</button>'+
    '<div class="rs-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}


function cssVar(n,f){ try{ var v=getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v||f; }catch(e){ return f; } }
var TICK={ color:'#8A93A0', font:{ size:10.5 } };

// ── The three Misc charts meet CHART_ENGINE_REFERENCE §0.2 (playbook §17.2; SAB, F-FINAL Oct 27 2026) ──────────
// Each chart: chips are the legend (click hides the series in the chart, its table and its total — one predicate,
// vis()); drag zooms (sideways = periods, vertical or on the axis = values), double-click resets, and changing the
// annual/quarterly view drops the zoom; the table sits under the chart in a dropdown that counts what it holds.
// rsAttachBrush copied from js/results.js (as js/betas-core.js attachBrush) — §0.7 path 3.
function attachBrush(el, chart, onX, onY, onReset){
  var wrap=el.parentElement;
  if(wrap&&getComputedStyle(wrap).position==='static') wrap.style.position='relative';
  el.style.cursor='crosshair';
  el.onmousedown=function(ev){
    if(ev.button!==0) return;
    var r0=el.getBoundingClientRect(), w0=wrap.getBoundingClientRect(), area=chart.chartArea;
    var onAxis=(ev.clientX-r0.left)<area.left||(ev.clientX-r0.left)>area.right;
    var vertical=onAxis?true:null, startX=ev.clientX, startY=ev.clientY, box=null;
    function ensureBox(){ if(box) return; box=document.createElement('div'); box.className='rs-brush';
      if(vertical){ box.style.left=(r0.left-w0.left+area.left)+'px'; box.style.width=(area.right-area.left)+'px'; }
      else { box.style.top=(r0.top-w0.top)+'px'; box.style.height=r0.height+'px'; }
      wrap.appendChild(box); }
    function decide(cx,cy){ if(vertical!=null) return; var dx=Math.abs(cx-startX), dy=Math.abs(cy-startY); if(Math.max(dx,dy)<8) return; vertical=dy>dx; }
    function place(cx,cy){ if(vertical==null) return; ensureBox();
      if(vertical){ var a=Math.min(startY,cy), b=Math.max(startY,cy); box.style.top=(a-w0.top)+'px'; box.style.height=(b-a)+'px'; }
      else { var a2=Math.min(startX,cx), b2=Math.max(startX,cx); box.style.left=(a2-w0.left)+'px'; box.style.width=(b2-a2)+'px'; } }
    place(ev.clientX,ev.clientY);
    function onMove(e2){ decide(e2.clientX,e2.clientY); place(e2.clientX,e2.clientY); }
    function onUp(e2){
      document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp);
      decide(e2.clientX,e2.clientY); if(box) box.remove(); if(vertical==null) return;
      if(vertical){ if(Math.abs(e2.clientY-startY)<8) return;
        var v1=chart.scales.y.getValueForPixel(Math.min(startY,e2.clientY)-r0.top), v2=chart.scales.y.getValueForPixel(Math.max(startY,e2.clientY)-r0.top);
        onY(Math.min(v1,v2),Math.max(v1,v2)); }
      else { if(Math.abs(e2.clientX-startX)<8) return;
        var xs=chart.scales.x, idxAt=function(cx){ return Math.max(0,Math.min(chart.data.labels.length-1,Math.round(xs.getValueForPixel(cx-r0.left)))); };
        var a=idxAt(startX), b=idxAt(e2.clientX); if(a!==b) onX(Math.min(a,b),Math.max(a,b)); }
    }
    document.addEventListener('mousemove',onMove); document.addEventListener('mouseup',onUp); ev.preventDefault();
  };
  el.ondblclick=onReset;
}

// Chart state: hidden series, x window (indices into the full series) and y window. One entry per chart.
var ZS = { backlog:{ h:{}, xr:null, yr:null, ch:null } };
var IDS = { backlog:'aMxBacklog' };
function vis(k, s){ return !ZS[k].h[s]; }   // the ONE predicate: chart, table and totals all ask it
function chartBlock(k, ht, open){
  return '<div class="mx-leg" id="'+IDS[k]+'Leg"></div>'+
    '<div class="ov-chart-card mx-chart"><div class="ov-chart-wrap" style="height:'+ht+'px"><canvas id="'+IDS[k]+'"></canvas></div></div>'+
    '<div class="ov-fynote mx-zhint">Drag sideways to zoom periods, up or down (or on the axis) to zoom values; double-click resets.</div>'+
    '<div class="rs-collap mx-collap"><button type="button" class="rs-collap-h" data-selfwired="1" data-mx="1"><span class="rs-collap-ic">'+(open?'▾':'▸')+'</span> Period detail <span class="rs-collap-sub" id="'+IDS[k]+'Sub"></span></button>'+
    '<div class="rs-collap-b"'+(open?'':' hidden')+'><div id="'+IDS[k]+'Tbl"></div></div></div>';
}
function chips(k, ser){
  return ser.map(function(s){ var line=s.type==='line';
    return '<button type="button" class="rs-leg'+(vis(k,s.k)?'':' off')+'" data-mxlg="'+k+':'+s.k+'"><span class="'+(line?'rs-leg-line':'ave-leg-act')+'" style="background:'+s.color+'"></span>'+s.label+'</button>'; }).join('');
}
function win(k, arr){ var z=ZS[k].xr; return z ? arr.slice(z[0], z[1]+1) : arr; }
// Draws chart k from a spec: { labels, ser:[{k,label,color,type,data,est?,yAxisID?}], scales, tooltip, stacked }.
function drawChart(sp, k, spec){
  var cv=sp.querySelector('#'+IDS[k]); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  var Z=ZS[k]; if(Z.ch){ Z.ch.destroy(); Z.ch=null; }
  var lg=sp.querySelector('#'+IDS[k]+'Leg'); if(lg) lg.innerHTML=chips(k, spec.ser);
  var ds=spec.ser.filter(function(s){ return vis(k,s.k); }).map(function(s){
    var est=s.est?win(k,s.est):null, d={ label:s.label, data:win(k,s.data), yAxisID:s.yAxisID||'y', order:s.type==='line'?1:2 };
    if(s.type==='line'){ d.type='line'; d.borderColor=s.color; d.backgroundColor=s.color; d.borderWidth=2.5; d.tension=.25; d.pointRadius=3;
      if(est) d.segment={ borderDash:function(ctx){ return est[ctx.p1DataIndex]?[5,4]:undefined; } }; }
    else { d.backgroundColor=est?est.map(function(e){ return e?(s.estColor||'#B8C4D6'):s.color; }):s.color; d.maxBarThickness=s.bar||46; if(spec.stacked) d.stack='s'; }
    return d; });
  var sc=spec.scales();
  if(Z.yr){ sc.y.min=Z.yr[0]; sc.y.max=Z.yr[1]; }
  Z.ch=new Chart(cv.getContext('2d'),{ type:'bar', data:{ labels:win(k,spec.labels), datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:spec.tooltip||{ label:function(ctx){ return ctx.dataset.label+': $'+ctx.parsed.y.toFixed(1)+'B'; } } } },
      scales:sc } });
  var off=Z.xr?Z.xr[0]:0;
  attachBrush(cv, Z.ch, function(a,b){ Z.xr=[off+a, off+b]; drawChart(sp,k,spec); }, function(v1,v2){ Z.yr=[v1,v2]; drawChart(sp,k,spec); },
    function(){ Z.xr=null; Z.yr=null; drawChart(sp,k,spec); });
  var t=sp.querySelector('#'+IDS[k]+'Tbl'); if(t) t.innerHTML=spec.table();
  var sub=sp.querySelector('#'+IDS[k]+'Sub'); if(sub) sub.textContent=spec.ser.filter(function(s){ return vis(k,s.k); }).length+' of '+spec.ser.length+' series · '+spec.labels.length+' periods'+(Z.xr||Z.yr?' · zoomed (double-click the chart to reset)':'');
}
function yB(){ return { color:'#8A93A0', font:{ size:10 }, callback:function(v){ return '$'+v+'B'; } }; }

function legClick(e, sp){
  var lg=e.target.closest&&e.target.closest('[data-mxlg]'); if(!lg) return false;
  var p=lg.getAttribute('data-mxlg').split(':'), Z=ZS[p[0]]; Z.h[p[1]]=!Z.h[p[1]]; Z.yr=null;   // values change, so does the y range
  if(p[0]==='capex') buildCapex(sp); else if(p[0]==='commit') buildCommit(sp); else if(p[0]==='backlog') buildBacklog(sp);
  return true;
}
function collapClick(e){
  var hd=e.target.closest&&e.target.closest('.rs-collap-h[data-mx]'); if(!hd) return;
  var b=hd.nextElementSibling; b.hidden=!b.hidden; var ic=hd.querySelector('.rs-collap-ic'); if(ic) ic.textContent=b.hidden?'▸':'▾';
}

// ── Capacity → revenue (MISC-capacity) ───────────────────────────────────────
// Copy of meta-misc.js metaCapacityBody (chain table + directory by country), plus what Alphabet publishes that Meta
// does not: the revenue backlog. Backlog = segments-data shared:rpo (as TL-SEG); Cloud revenue and its consensus/Summit

// ── Capacity → revenue (MISC-capacity) ───────────────────────────────────────
var AWQ = amznResults.views.q.metrics.aws, AWY = amznResults.views.y.metrics.aws, RPO = amznSegments.shared.rpo.q.act;
var BL_Q = Object.keys(RPO);
var CAP = { life:6.1 };   // weighted-average remaining life of the long-term contracts, years (10-Q 3Q26)
function awq(p){ var i=AWQ.periods.indexOf(p); return i<0?null:{ act:AWQ.act[i], cons:AWQ.cons[i] }; }
function awy(y){ var i=AWY.periods.indexOf(y); return i<0?null:{ act:AWY.act[i], cons:AWY.cons[i], summit:AWY.summit[i] }; }
function pc(v){ return v==null ? '—' : Math.round(v*100)+'%'; }
var LAST_RPO = BL_Q[BL_Q.length-1];
function coverRows(){
  var perYr=RPO[LAST_RPO]/CAP.life, y26=awy('2026'), y27=awy('2027'), y28=awy('2028');
  var cmp=[
    ['Consensus FY2026 (Bloomberg, newest snapshot)', y26&&y26.cons], ['Summit FY2026', y26&&y26.summit],
    ['Consensus FY2027', y27&&y27.cons], ['Summit FY2027', y27&&y27.summit],
    ['Consensus FY2028', y28&&y28.cons], ['Summit FY2028', y28&&y28.summit]
  ];
  return { perYr:perYr, rows:cmp.map(function(r){ return [r[0], bn(r[1]), bn(perYr), r[1]?pc(perYr/r[1]):'—']; }) };
}
function coverHtml(){
  var C=coverRows();
  return '<div class="me-bl-note">Spread evenly over '+CAP.life.toFixed(1)+' years, the '+bn(RPO[LAST_RPO])+' signed at '+LAST_RPO+' is <b>'+bn(C.perYr)+' a year</b> of revenue from contracts already signed.</div>'+
    tbl(['Against','AWS revenue expected','From signed contracts, per year','Covered'], C.rows, null, 1);
}
// Revenue per gigawatt added, FY2025: AWS revenue added in the year ÷ power added in the year (our arithmetic on reported figures).
function perGwHtml(){
  var a25=awy('2025'), a24=awy('2024'); if(!a25||!a24||a25.act==null||a24.act==null) return '';
  var add=a25.act-a24.act, gw=3.99;
  return tbl(['FY2025','Value','Source'], [
    ['AWS revenue added in the year', bn(add), 'Form 10-K FY2025 (FY2024 '+bn(a24.act)+' → FY2025 '+bn(a25.act)+')'],
    ['Power capacity added in the year', gw.toFixed(2)+' GW', 'Andy Jassy, 4Q25 call (Feb 5 2026)'],
    ['AWS revenue added per gigawatt added', bn(add/gw), 'Our arithmetic — the two rows above']
  ], null, 1)+'<div class="ov-fynote">Capacity added late in the year earns little revenue in it, and revenue also grows on capacity installed before 2025, so this ratio is a reading of the year, not a unit economic Amazon discloses.</div>';
}
export function amznCapacityBody(){
  var h='<p class="ov-lede">Amazon reports what goes in (capex), what is contracted (the backlog) and what comes out (AWS revenue). On the calls it adds the power it brings online each year, but never the installed total. Each link is shown with its source, and where the chain breaks.</p>';
  h+=h3('The chain, link by link')+tbl(['Link','Measure','Latest value','Source','Status'],AMZN_CHAIN.map(function(r){ return ['<b>'+r[0]+'</b>',r[1],r[2],r[3],r[4]]; }));
  h+=h3('Revenue per gigawatt added')+perGwHtml();
  h+=h3('Backlog against AWS revenue')+chartBlock('backlog', 280)+
    '<div class="me-bl-note">Bars = performance obligations not yet recognized at each quarter-end (left axis); line = AWS revenue in the quarter (right axis). Both reported.</div>';
  h+=h3('What the signed backlog already covers')+
    '<div class="br-sl"><span class="br-sl-l">Remaining life (years)</span><input type="range" data-acap="1" min="3" max="10" step="0.1" value="'+CAP.life+'" aria-label="Weighted-average remaining life of the contracts, years"><span class="br-sl-v" data-acapv="1">'+CAP.life.toFixed(1)+'</span></div>'+
    '<div id="aCapCover">'+coverHtml()+'</div>'+
    '<div class="ov-fynote">'+AMZN_BACKLOG_NOTE+' Default life = 6.1 years, the weighted-average remaining life Amazon reports (10-Q 3Q26); an even spread is our simplification — the 10-Q says timing "will be driven by customer usage". Consensus = Bloomberg, newest snapshot in the Results dataset; Summit = model snapshot 2026-10-30 (frozen).</div>';
  // directory grouped by country, with subtotals (§18): groups by AZ subtotal, largest first; a Total row that ties
  var g={}, order=[];
  AMZN_AWS_REGIONS.forEach(function(r){ if(!g[r[0]]){ g[r[0]]=[]; order.push(r[0]); } g[r[0]].push(r); });
  function az(rs){ return rs.reduce(function(s,r){ return s+(r[3]||0); },0); }
  order.sort(function(a,b){ return az(g[b])-az(g[a]) || a.localeCompare(b); });
  var body='', nReg=0, nAz=0, nAnn=0;
  order.forEach(function(cn){ var rs=g[cn], live=rs.filter(function(r){ return r[5]==='Available'; }).length, ann=rs.length-live;
    nReg+=live; nAnn+=ann; nAz+=az(rs);
    body+='<tr class="ew-tgrp"><td>'+cn+'</td><td>'+live+' Region'+(live===1?'':'s')+(ann?' · '+ann+' announced':'')+'</td><td class="mx-n">'+az(rs)+'</td><td></td></tr>';
    rs.forEach(function(r){ body+='<tr><td class="mx-k">'+r[1]+' <span class="asc-tk">'+r[2]+'</span></td><td>'+r[5]+'</td><td class="mx-n">'+(r[3]==null?'—':r[3])+'</td><td>'+(r[4]||'—')+'</td></tr>'; });
  });
  body+='<tr class="ew-tgrp"><td>Total</td><td>'+nReg+' Regions · '+nAnn+' announced</td><td class="mx-n">'+nAz+'</td><td></td></tr>';
  h+=h3('AWS Regions by country ('+nReg+' Regions, '+nAz+' Availability Zones, '+nAnn+' announced)')+
    collap('All Regions', '<div class="twrap mx-twrap"><table class="rt mx-tbl ew-tbl"><thead><tr><th>Region</th><th>Status</th><th class="mx-n">Availability Zones</th><th>Launched</th></tr></thead><tbody>'+body+'</tbody></table></div>', true);
  h+='<div class="ov-fynote">An Availability Zone is one or more data centers; AWS publishes no capacity (MW), investment or site count per Region, so none is shown. The page headline counts 124 Availability Zones in 39 Regions; the list it publishes, read here, also carries the AWS European Sovereign Cloud.</div>';
  h+='<div class="ov-foot">Sources — Amazon 8-K earnings release (Oct 29 2026), Form 10-Q 3Q26 (filed Oct 30 2026, Note 1) and Form 10-K FY2025 (segment note), SEC EDGAR; earnings calls 4Q25 and 2Q26 (The Motley Fool transcripts); Results dataset (AWS revenue, Bloomberg consensus, Summit snapshot 2026-10-30, frozen); Top Line dataset (backlog, Bloomberg; 3Q26 from the 10-Q); '+AMZN_AWS_REGIONS_SRC+'.</div>';
  return h;
}
function backlogSpec(){
  var navy=cssVar('--navy','#1B2A41'), steel=cssVar('--steel','#3E5A82'), mute=cssVar('--bdr','#B8C4D6');
  var rpo=BL_Q.map(function(p){ return RPO[p]/1000; }), cr=BL_Q.map(function(p){ var c=awq(p); return c&&c.act!=null?c.act/1000:null; });
  return { labels:BL_Q,
    ser:[{ k:'rpo', label:'Backlog (left axis)', color:mute, data:rpo, bar:40 },
         { k:'aws', label:'AWS revenue (right axis)', color:navy, type:'line', data:cr, yAxisID:'y1' }],
    scales:function(){ return { x:{ grid:{ display:false }, ticks:TICK },
      y:{ position:'left', display:vis('backlog','rpo'), grid:{ color:'#EEF2F7' }, title:{ display:true, text:'Backlog', color:'#8A93A0', font:{ size:10 } }, ticks:yB() },
      y1:{ position:'right', display:vis('backlog','aws'), grid:{ display:false }, title:{ display:true, text:'AWS revenue', color:steel, font:{ size:10 } }, ticks:yB() } }; },
    table:function(){ var sr=vis('backlog','rpo'), sc=vis('backlog','aws'), hd=['Quarter'];
      if(sr) hd.push('Backlog'); if(sc) hd.push('AWS revenue'); if(sr&&sc) hd.push('Backlog ÷ annualized AWS revenue');
      return tbl(hd, BL_Q.map(function(p){ var c=awq(p), r=RPO[p], o=[p]; if(sr) o.push(bn(r)); if(sc) o.push(c&&c.act!=null?bn(c.act):'—'); if(sr&&sc) o.push(c&&c.act?(r/(c.act*4)).toFixed(1)+'×':'—'); return o; }), null, 1); } };
}
function buildBacklog(sp){ drawChart(sp, 'backlog', backlogSpec()); }
export function amznCapacityBuild(root){
  var sp=root.querySelector('.ovt-subpane[data-ovst="capacity"]')||root;
  if(!sp._mxWired){ sp._mxWired=true;
    sp.addEventListener('click', function(e){ if(legClick(e, sp)) return; collapClick(e); });
    sp.addEventListener('input', function(e){
      var s=e.target.closest&&e.target.closest('[data-acap]'); if(!s) return;
      CAP.life=+s.value; var v=sp.querySelector('[data-acapv]'); if(v) v.textContent=CAP.life.toFixed(1);
      var c=sp.querySelector('#aCapCover'); if(c) c.innerHTML=coverHtml();
    });
  }
  buildBacklog(sp);
}
