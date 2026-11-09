// nvda-capacity.js — NVIDIA Deep Dive ▸ Miscellaneous ▸ Capacity → revenue (MISC-capacity, docs/PROFILE_PLAYBOOK.md §15b).
//
// Answers: does the supply NVIDIA has secured line up with the revenue expected of it? The playbook chain is input →
// capacity → units → × price → revenue, every link sourced. For NVIDIA the middle links are not published (CoWoS
// capacity, GPU units, prices — Top Line ▸ Segments already says "not published"), so the chain is drawn cut, saying
// where and why (SAB, Nov 9 2026), and the one bridge that IS computable from sources is shown:
//   revenue the committed supply supports = supply & capacity commitments × share that becomes cost of revenue
//                                            ÷ (1 − gross margin)
// against the Summit model and Bloomberg consensus for the same period. The two assumptions are controls.
// Data, not retyped: commitments from ./nvda-splc.js (10-Q Note 10), inventories from the same file, model revenue and
// adjusted gross margin from ./nvda-sensitivity-data.js (Summit 2026-08-28, frozen), consensus and reported revenue
// from js/results-data/nvda.js.

import { SUMMIT_CAT } from '../viz-palette.js';
import { attachBrush } from '../betas-core.js';
import { nvdaResults } from '../results-data/nvda.js';
import { NVDA_SENS } from './nvda-sensitivity-data.js';
import { COMMIT, INV } from './nvda-splc.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function bn(m){ return m==null ? '—' : '$'+(m/1000).toFixed(1)+'B'; }

var Y = nvdaResults.views.y.metrics.rev, Q = nvdaResults.views.q.metrics.rev;
function yv(arr, y){ var i=Y.periods.indexOf(String(y)); return i<0?null:arr[i]; }
function qAct(p){ var i=Q.periods.indexOf(p); return i<0?null:Q.act[i]; }
var H1_27 = (qAct('1Q27')||0) + (qAct('2Q27')||0);            // reported first half of FY2027
var SUP = COMMIT[0].v;                                          // supply & capacity, $B: rest of FY27, FY28, FY29, …
// The periods compared: the commitments fall due by fiscal year; FY2030+ commitments are small because contracts reach
// that far only partly, so the comparison stops at FY2029.
var ROWS = [
  { k:'H2 FY27', lab:'Rest of FY2027 (Aug 2026 – Jan 2027)', sup:SUP[0]*1000, y:2027,
    model:NVDA_SENS.y[2027].rev - H1_27, cons:(yv(Y.cons,2027)!=null ? yv(Y.cons,2027) - H1_27 : null) },
  { k:'FY28', lab:'FY2028', sup:SUP[1]*1000, y:2028, model:NVDA_SENS.y[2028].rev, cons:yv(Y.cons,2028) },
  { k:'FY29', lab:'FY2029', sup:SUP[2]*1000, y:2029, model:NVDA_SENS.y[2029].rev, cons:yv(Y.cons,2029) },
];
function modelGm(y){ var r=NVDA_SENS.y[y]; return r.gp/r.rev; }

var st = { gm:null, share:1, yr:null, hid:{} };   // gm null = the model's adjusted gross margin of each year
function gmOf(row){ return st.gm!=null ? st.gm : modelGm(row.y); }
function supported(row){ return row.sup*st.share/(1-gmOf(row)); }

function chain(){
  var box=function(ok, h, t){ return '<div class="nv-cap-box'+(ok?'':' nv-cap-cut')+'"><div class="nv-cap-st">'+(ok?'Sourced':'Not published — the chain is cut here')+'</div><div class="nv-cap-h">'+h+'</div><div class="nv-cap-t">'+t+'</div></div>'; };
  return '<div class="nv-cap-chain">'+
    box(true, '1 · Input: supply secured', 'Supply and capacity commitments of <b>$'+COMMIT[0].t+'B</b> as of Jul 26, 2026 — “primarily memory and manufacturing facilities” — plus <b>'+bn(INV[3].b)+'</b> of inventories (10-Q, Note 10 and balance sheet).')+
    box(false, '2 · Capacity', 'How many advanced-packaging (CoWoS) wafers and GPUs that supply turns into. NVIDIA does not disclose it, and TSMC does not report capacity by customer.')+
    box(false, '3 · Units × price', 'GPUs or racks shipped and their price. NVIDIA publishes neither (Top Line ▸ Segments).')+
    box(true, '4 · Revenue', 'Reported Data Center revenue to 2Q FY27; forward revenue from the Summit model (2026-08-28) and Bloomberg consensus.')+
  '</div>';
}
function table(){
  var cols=[['sup','Supply commitments due'],['gm','Gross margin used'],['supp','Revenue the commitments support'],['model','Summit model revenue'],['cons','Bloomberg consensus revenue'],['cov','Coverage of consensus']];
  var vis=function(k){ return !( (k==='supp'&&st.hid[0]) || (k==='model'&&st.hid[1]) || (k==='cons'&&st.hid[2]) ); };
  return '<table class="rs-ft"><thead><tr><th class="rs-ft-h">Period</th>'+cols.filter(function(c){ return vis(c[0]); }).map(function(c){ return '<th>'+c[1]+'</th>'; }).join('')+'</tr></thead><tbody>'+
    ROWS.map(function(r){
      var s=supported(r), cell={ sup:bn(r.sup*st.share)+(st.share<1?' <span class="nv-cap-sub">('+Math.round(st.share*100)+'% of '+bn(r.sup)+')</span>':''), gm:(gmOf(r)*100).toFixed(1)+'%', supp:'<b>'+bn(s)+'</b>', model:bn(r.model), cons:bn(r.cons), cov:(r.cons?Math.round(s/r.cons*100)+'%':'—') };
      return '<tr><td class="rs-ft-h">'+esc(r.lab)+'</td>'+cols.filter(function(c){ return vis(c[0]); }).map(function(c){ return '<td>'+cell[c[0]]+'</td>'; }).join('')+'</tr>';
    }).join('')+'</tbody></table>';
}
function controls(){
  var g=st.gm!=null?st.gm:null;
  return '<div class="nv-cap-ctl">'+
    '<label class="nv-cap-l">Gross margin <select class="nv-cap-gm">'+
      '<option value="model"'+(g==null?' selected':'')+'>Summit model, each year (73.7% · 72.5% · 72.8%)</option>'+
      [0.70,0.72,0.74,0.76].map(function(v){ return '<option value="'+v+'"'+(g===v?' selected':'')+'>'+(v*100).toFixed(0)+'% every year</option>'; }).join('')+
    '</select></label>'+
    '<label class="nv-cap-l">Share of commitments that becomes cost of revenue <input class="nv-cap-share" type="range" min="50" max="100" step="5" value="'+Math.round(st.share*100)+'"> <b class="nv-cap-sv">'+Math.round(st.share*100)+'%</b></label>'+
  '</div>';
}

export function nvdaCapacityBody(){
  var h='';
  h+='<p class="ov-lede">Does the supply NVIDIA has locked in line up with the revenue expected of it? The full chain — supply, capacity, units, price, revenue — cannot be drawn: NVIDIA publishes the first and last links only. What can be checked is how much revenue the committed supply supports, against what the Summit model and the Street expect.</p>';
  h+='<div class="ov-sec"><div class="ov-sec-h">The chain, link by link</div>'+chain()+'</div>';
  h+='<div class="ov-sec"><div class="ov-sec-h">Revenue the committed supply supports</div>'+
    '<p class="nv-cap-p">Commitments are paid for and become inventory, then cost of revenue; divided by (1 − gross margin) they give the revenue that supply supports. Over 100% means NVIDIA is buying ahead of the period’s sales; well under 100% means the rest of the period’s supply is not contracted yet — commitments grew from $95.2B in January to $279B in July.</p>'+
    controls()+
    '<div class="nv-cap-c"><canvas id="nvCapChart"></canvas></div>'+
    '<div class="nv-cap-note">Drag up or down on the chart to zoom the values; double-click resets. Click a series in the legend to hide it (its column leaves the table too).</div>'+
    '<div class="rs-collap"><button type="button" class="rs-collap-h" data-selfwired="1" data-nvcap="1"><span class="rs-collap-ic">▾</span> Data — what the chart draws <span class="rs-collap-sub">'+ROWS.length+' periods</span></button>'+
      '<div class="rs-collap-b"><div class="rs-ft-scroll" id="nvCapTbl">'+table()+'</div></div></div>'+
  '</div>';
  h+='<div class="ov-foot">Sources — supply and capacity commitments by fiscal year and inventories: NVIDIA Form 10-Q for the quarter ended Jul 26, 2026 (Note 10; balance sheet); January figure: Form 10-K FY2026 (Note 12). '+
    'Revenue: reported 1Q and 2Q FY27 (8-K) — the rest of FY2027 is the full-year figure less the reported first half ('+bn(H1_27)+'); Summit DCF model, snapshot 2026-08-28 (frozen, not live), with its adjusted gross margin; Bloomberg consensus as of '+esc(nvdaResults.estMatrix.cons.vintages[nvdaResults.estMatrix.cons.vintages.length-1].id)+'. '+
    'Commitments are scheduled payments, not cost recognised in the year, so the coverage is a cross-check, not a forecast. Capacity, units and prices are not disclosed by NVIDIA or by TSMC per customer.</div>';
  return h;
}

var _chart=null;
function render(){
  var tb=document.getElementById('nvCapTbl'); if(tb) tb.innerHTML=table();
  var cv=document.getElementById('nvCapChart'); if(!cv || typeof Chart==='undefined' || !cv.offsetParent) return;
  if(_chart){ _chart.destroy(); _chart=null; }
  var ds=[
    { label:'Revenue the commitments support', data:ROWS.map(function(r){ return supported(r)/1000; }), backgroundColor:SUMMIT_CAT[0], hidden:!!st.hid[0] },
    { label:'Summit model revenue', data:ROWS.map(function(r){ return r.model/1000; }), backgroundColor:SUMMIT_CAT[1], hidden:!!st.hid[1] },
    { label:'Bloomberg consensus revenue', data:ROWS.map(function(r){ return r.cons==null?null:r.cons/1000; }), backgroundColor:SUMMIT_CAT[2], hidden:!!st.hid[2] },
  ];
  _chart=new Chart(cv.getContext('2d'), { type:'bar', data:{ labels:ROWS.map(function(r){ return r.k; }), datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:{ duration:300 },
      plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:11 } },
          onClick:function(e, item){ st.hid[item.datasetIndex]=!st.hid[item.datasetIndex]; render(); } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': $'+ctx.parsed.y.toFixed(1)+'B'; } } } },
      scales:{ x:{ grid:{ display:false } },
        y:{ beginAtZero:!st.yr, min:st.yr?st.yr[0]:undefined, max:st.yr?st.yr[1]:undefined, grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return '$'+v+'B'; } } } } } });
  attachBrush(cv, _chart, null, function(a, b){ st.yr=[a, b]; render(); }, function(){ st.yr=null; render(); });
}

export function nvdaCapacityBuild(root){
  var pane=(root||document).querySelector('.ovt-subpane[data-ovst="capacity"]');
  if(pane && !pane._capWired){ pane._capWired=true;
    pane.addEventListener('change', function(e){
      if(e.target.classList.contains('nv-cap-gm')){ st.gm = e.target.value==='model' ? null : parseFloat(e.target.value); render(); } });
    pane.addEventListener('input', function(e){
      if(e.target.classList.contains('nv-cap-share')){ st.share=(+e.target.value)/100; var sv=pane.querySelector('.nv-cap-sv'); if(sv) sv.textContent=e.target.value+'%'; render(); } });
    pane.addEventListener('click', function(e){ var h=e.target.closest?e.target.closest('.rs-collap-h[data-nvcap]'):null; if(!h) return;
      var b=h.nextElementSibling; if(!b) return; b.hidden=!b.hidden; var ic=h.querySelector('.rs-collap-ic'); if(ic) ic.textContent=b.hidden?'▸':'▾'; });
  }
  render();
}
