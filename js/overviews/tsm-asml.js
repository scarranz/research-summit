// overviews/tsm-asml.js — TSMC Deep Dive ▸ Miscellaneous ▸ TSMC × ASML (MISC-asml, playbook §15b).
//
// Ported from the "ASML" view of SAB's standalone TSMC dashboard (v7, Oct 16 2026), history only: how much of
// ASML's business TSMC is, and how much of TSMC's capex goes to ASML. Rebuilt on portal pieces (.ov-kpis, Chart.js
// with a table under each chart, .twrap/.rt tables). First pass was history only; SAB then asked for "everything
// necessary" (Oct 16 2026): sales by customer group, the EUV ceiling, machine economics and the EUV-to-N2 capacity
// model were added, every estimate and model row tagged. The prose tool-mix notes stay out (they repeat the tables).
import { SUMMIT_CAT, SUMMIT_INK, SUMMIT_MUTE, fade } from '../viz-palette.js';
import { ASML_TOP_CUST, TSM_CAPEX_ASML, ASML_EUV_SPLIT, ASML_GUIDE, TSM_ASML_SRC, ASML_BY_CUST, ASML_EUV_CEIL, ASML_TOOL_ECON, TSM_EUV_N2 } from './tsm-asml-data.js';

function collap(title, inner){
  return '<div class="rs-collap fab-collap"><button type="button" class="rs-collap-h"><span class="rs-collap-ic">▸</span> '+title+'</button><div class="rs-collap-b" hidden>'+inner+'</div></div>';
}
function tbl(head, rows){
  return '<div class="twrap own-wrap"><table class="rt own-tbl fab-num"><thead><tr>'+head.map(function(h){ return '<th>'+h+'</th>'; }).join('')+'</tr></thead><tbody>'+
    rows.map(function(r){ return '<tr>'+r.map(function(c,i){ return '<td>'+(i===0?'<b>'+c+'</b>':c)+'</td>'; }).join('')+'</tr>'; }).join('')+'</tbody></table></div>';
}
var EST = '<span class="fab-est">estimate</span>';

export function tsmAsmlBody(){
  var last = ASML_TOP_CUST[ASML_TOP_CUST.length-1], peak = ASML_TOP_CUST.reduce(function(a,b){ return b[2]>a[2]?b:a; }), low = ASML_TOP_CUST.reduce(function(a,b){ return b[2]<a[2]?b:a; });
  var cx = TSM_CAPEX_ASML[TSM_CAPEX_ASML.length-1];
  var h = '<p class="ov-lede"><b>TSMC and its most important supplier.</b> TSMC is ASML\u2019s largest customer, and between 2019 and 2025 ASML took 17–35% of TSMC\u2019s capex each year. How large each is in the other\u2019s numbers, year by year.</p>';
  h += '<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-v">'+last[2].toFixed(1)+'%</div><div class="ov-kpi-d muted">of ASML net sales from its largest customer (TSMC), '+last[0]+' — €'+(last[1]/1000).toFixed(1)+'B</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-v">'+peak[2].toFixed(1)+'% → '+low[2].toFixed(1)+'%</div><div class="ov-kpi-d muted">peak ('+peak[0]+') and trough ('+low[0]+') of that share</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-v">'+Math.round(cx[2]/cx[1]*100)+'%</div><div class="ov-kpi-d muted">of TSMC\u2019s '+cx[0]+' capex (US$'+cx[1]+'B) went to ASML</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-v">'+ASML_GUIDE.sales2026+'</div><div class="ov-kpi-d muted">ASML 2026 sales guide · '+ASML_GUIDE.euv2026+' low-NA EUV in 2026, '+ASML_GUIDE.euv2027cap+' capacity in 2027 ('+ASML_GUIDE.asOf+')</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-v">'+ASML_GUIDE.backlog+'</div><div class="ov-kpi-d muted">ASML backlog, end-2025 — the last it published</div></div></div>';
  h += '<div class="ov-sec-h mg-sec-gap">TSMC in ASML\u2019s sales — net sales by customer group, € billion, and TSMC\u2019s %</div>';
  h += '<div class="fab-chart"><canvas id="tsmAsmlConc"></canvas></div>';
  h += collap('Data — what the chart draws', tbl(['Year','TSMC (largest customer, €B)','Samsung (€B) '+EST,'Others (€B)','ASML total (€B)','TSMC % of ASML'],
    ASML_BY_CUST.slice().reverse().map(function(r){ var t=ASML_TOP_CUST.filter(function(x){ return x[0]===r[0]; })[0];
      return [r[0], r[1].toFixed(2), r[2]==null?'—':r[2].toFixed(2), r[3].toFixed(2), r[4].toFixed(2), t?t[2].toFixed(1)+'%':'—']; }))+
    '<div class="ov-fynote">Largest customer back to 2017 (ASML 20-F): '+ASML_TOP_CUST.slice(0,2).map(function(r){ return r[0]+' €'+(r[1]/1000).toFixed(2)+'B ('+r[2].toFixed(1)+'%)'; }).join(' · ')+'.</div>');
  h += '<div class="ov-sec-h mg-sec-gap">ASML in TSMC\u2019s capex — US$ billion</div>';
  h += '<div class="fab-chart"><canvas id="tsmAsmlCapex"></canvas></div>';
  h += collap('Data — what the chart draws', tbl(['Year','TSMC capex (US$B)','ASML sales to TSMC (US$B)','Share of TSMC capex','ASML total net sales (US$B)'],
    TSM_CAPEX_ASML.slice().reverse().map(function(r){ return [r[0], r[1].toFixed(1), r[2].toFixed(1), Math.round(r[2]/r[1]*100)+'%', r[3].toFixed(1)]; })));
  h += '<div class="ov-sec-h mg-sec-gap">Low-NA EUV systems by customer '+EST+'</div>';
  h += '<div class="fab-chart fab-chart-sm"><canvas id="tsmAsmlEuv"></canvas></div>';
  h += collap('Data — what the chart draws', tbl(['Year','TSMC','Samsung','Others','Total'],
    ASML_EUV_SPLIT.slice().reverse().map(function(r){ return [r[0], r[1], r[2], r[3], r[1]+r[2]+r[3]]; })));
  h += '<div class="ov-sec-h mg-sec-gap">The EUV bottleneck — ASML ceiling vs systems delivered vs TSMC\u2019s share</div>';
  h += '<div class="fab-chart"><canvas id="tsmAsmlCeil"></canvas></div>';
  h += collap('Data — what the chart draws', tbl(['Year','ASML ceiling','Delivered','To TSMC '+EST,'Basis'],
    ASML_EUV_CEIL.map(function(r){ return [r[0], r[1], r[2], r[3], /E$/.test(r[0]) ? (r[0]==='2026E'?'ASML guide (~65)':r[0]==='2027E'?'ASML +30% capacity plan':'model')+' '+EST : 'ASML reported']; })));
  h += '<div class="ov-sec-h mg-sec-gap">Machine economics — what one ASML system adds to TSMC\u2019s capacity '+EST+'</div>';
  h += '<div class="twrap own-wrap"><table class="rt own-tbl fab-econ"><thead><tr><th>System</th><th>Unit cost</th><th>Wafers / hour</th><th>Availability</th><th>Effective wafers / month</th><th>Node</th><th>Passes per wafer</th><th>Wafers / month per machine</th><th>Constraint</th></tr></thead><tbody>'+
    ASML_TOOL_ECON.map(function(r){ return '<tr>'+r.map(function(c,i){ return '<td>'+(i===0?'<b>'+c+'</b>':c)+'</td>'; }).join('')+'</tr>'; }).join('')+'</tbody></table></div>';
  h += '<div class="ov-fynote">Wafers per month per machine = effective wafers per month ÷ the critical passes each wafer needs on that tool. A wafer visits several tool types, so the scarcest tool sets the pace: on leading-edge nodes that is EUV.</div>';
  h += '<div class="ov-sec-h mg-sec-gap">From EUV systems to N2 capacity '+EST+'</div>';
  h += '<div class="fab-chart"><canvas id="tsmAsmlN2"></canvas></div>';
  h += collap('Data — what the chart draws', tbl(['Year','EUV to TSMC','Allocated to N2','Cumulative N2 fleet','N2 capacity (K wfpm)','Implied wfpm per tool','Context'],
    TSM_EUV_N2.map(function(r){ return [r[0]+(/E$/.test(r[0])?' '+EST:''), r[1], r[2], r[3], r[4], r[5].toLocaleString('en-US'), r[6]]; })));
  h += '<div class="ov-fynote">The falling wafers-per-tool figure is the signal: early in N2 each new EUV system adds full capacity; from 2028 the fleet is shared by N2, A16 and A14, so each system adds less N2. 2024–2025 follow TSMC\u2019s N2 start; 2026–2030 are the dashboard\u2019s model.</div>';
  h += '<div class="ov-fynote">The 2024 trough is the gap between the N3 build-out and the N2 ramp, not a change in the relationship: sales to the largest customer fell to €4.7B and recovered to €7.8B in 2025. ASML stopped publishing quarterly bookings in 2026.</div>';
  h += '<div class="ov-foot">'+TSM_ASML_SRC+'</div>';
  return h;
}

var _ch = {};
function ready(id){ var c=document.getElementById(id); return (c && typeof Chart!=='undefined' && c.offsetParent) ? c : null; }
var AX = function(fmt){ return { position:'right', grid:{ color:'#EEF2F7' }, ticks:{ color:SUMMIT_MUTE, font:{ size:10 }, callback:fmt } }; };
export function tsmAsmlBuild(){
  var c1 = ready('tsmAsmlConc');
  if(c1){ if(_ch.a) _ch.a.destroy(); var b = ASML_BY_CUST;
    _ch.a = new Chart(c1.getContext('2d'), { type:'bar',
      data:{ labels:b.map(function(r){ return r[0]; }), datasets:[
        { type:'bar', label:'TSMC', data:b.map(function(r){ return r[1]; }), backgroundColor:SUMMIT_INK, maxBarThickness:32, stack:'s', yAxisID:'y' },
        { type:'bar', label:'Samsung (estimate)', data:b.map(function(r){ return r[2]; }), backgroundColor:SUMMIT_CAT[0], maxBarThickness:32, stack:'s', yAxisID:'y' },
        { type:'bar', label:'Others', data:b.map(function(r){ return r[3]; }), backgroundColor:fade(SUMMIT_MUTE,0.55), maxBarThickness:32, stack:'s', yAxisID:'y' },
        { type:'line', label:'TSMC % of ASML net sales', data:b.map(function(r){ var t=ASML_TOP_CUST.filter(function(x){ return x[0]===r[0]; })[0]; return t?t[2]:null; }), borderColor:SUMMIT_CAT[1], backgroundColor:SUMMIT_CAT[1], borderWidth:2.2, pointRadius:3, tension:.25, yAxisID:'y2' } ] },
      options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(c){ return c.parsed.y==null ? null : (c.dataset.yAxisID==='y2' ? c.dataset.label+': '+c.parsed.y.toFixed(1)+'%' : c.dataset.label+': €'+c.parsed.y.toFixed(2)+'B'); } } } },
        scales:{ x:{ stacked:true, grid:{ display:false }, ticks:{ color:SUMMIT_MUTE, font:{ size:10 } } },
          y:Object.assign(AX(function(v){ return '€'+v+'B'; }), { stacked:true }), y2:Object.assign(AX(function(v){ return v+'%'; }), { grid:{ display:false }, min:0, max:50 }) } } }); }
  var c2 = ready('tsmAsmlCapex');
  if(c2){ if(_ch.b) _ch.b.destroy(); var d = TSM_CAPEX_ASML;
    _ch.b = new Chart(c2.getContext('2d'), { type:'bar',
      data:{ labels:d.map(function(r){ return r[0]; }), datasets:[
        { type:'bar', label:'TSMC capex', data:d.map(function(r){ return r[1]; }), backgroundColor:fade(SUMMIT_CAT[0],0.35), borderColor:SUMMIT_CAT[0], borderWidth:1, borderRadius:3, maxBarThickness:30, yAxisID:'y' },
        { type:'bar', label:'ASML sales to TSMC', data:d.map(function(r){ return r[2]; }), backgroundColor:SUMMIT_INK, borderRadius:3, maxBarThickness:30, yAxisID:'y' },
        { type:'line', label:'Share of TSMC capex', data:d.map(function(r){ return Math.round(r[2]/r[1]*1000)/10; }), borderColor:SUMMIT_CAT[1], backgroundColor:SUMMIT_CAT[1], borderWidth:2.2, pointRadius:3, tension:.25, yAxisID:'y2' } ] },
      options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(c){ return c.dataset.yAxisID==='y2' ? c.dataset.label+': '+c.parsed.y+'%' : c.dataset.label+': $'+c.parsed.y+'B'; } } } },
        scales:{ x:{ grid:{ display:false }, ticks:{ color:SUMMIT_MUTE, font:{ size:10 } } },
          y:AX(function(v){ return '$'+v+'B'; }), y2:Object.assign(AX(function(v){ return v+'%'; }), { grid:{ display:false }, min:0, max:50 }) } } }); }
  var c3 = ready('tsmAsmlEuv');
  if(c3){ if(_ch.c) _ch.c.destroy(); var e = ASML_EUV_SPLIT;
    _ch.c = new Chart(c3.getContext('2d'), { type:'bar',
      data:{ labels:e.map(function(r){ return r[0]; }), datasets:[
        { label:'TSMC', data:e.map(function(r){ return r[1]; }), backgroundColor:SUMMIT_INK, maxBarThickness:30 },
        { label:'Samsung', data:e.map(function(r){ return r[2]; }), backgroundColor:SUMMIT_CAT[0], maxBarThickness:30 },
        { label:'Others', data:e.map(function(r){ return r[3]; }), backgroundColor:fade(SUMMIT_MUTE,0.6), maxBarThickness:30 } ] },
      options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(c){ return c.dataset.label+': '+c.parsed.y+' systems (estimate)'; } } } },
        scales:{ x:{ stacked:true, grid:{ display:false }, ticks:{ color:SUMMIT_MUTE, font:{ size:10 } } }, y:Object.assign(AX(function(v){ return v; }), { stacked:true }) } } }); }
  var c4 = ready('tsmAsmlCeil');
  if(c4){ if(_ch.d) _ch.d.destroy(); var k = ASML_EUV_CEIL, isE = function(y){ return /E$/.test(y); };
    _ch.d = new Chart(c4.getContext('2d'), { type:'bar',
      data:{ labels:k.map(function(r){ return r[0]; }), datasets:[
        { label:'ASML ceiling', data:k.map(function(r){ return r[1]; }), backgroundColor:k.map(function(r){ return fade(SUMMIT_MUTE, isE(r[0])?0.25:0.45); }), maxBarThickness:26 },
        { label:'Delivered', data:k.map(function(r){ return r[2]; }), backgroundColor:k.map(function(r){ return isE(r[0])?fade(SUMMIT_CAT[0],0.45):SUMMIT_CAT[0]; }), maxBarThickness:26 },
        { label:'To TSMC (estimate)', data:k.map(function(r){ return r[3]; }), backgroundColor:k.map(function(r){ return isE(r[0])?fade(SUMMIT_INK,0.45):SUMMIT_INK; }), maxBarThickness:26 } ] },
      options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(c){ return c.dataset.label+': '+c.parsed.y+' systems'; } } } },
        scales:{ x:{ grid:{ display:false }, ticks:{ color:SUMMIT_MUTE, font:{ size:10 } } }, y:AX(function(v){ return v; }) } } }); }
  var c5 = ready('tsmAsmlN2');
  if(c5){ if(_ch.e) _ch.e.destroy(); var n = TSM_EUV_N2;
    _ch.e = new Chart(c5.getContext('2d'), { type:'bar',
      data:{ labels:n.map(function(r){ return r[0]; }), datasets:[
        { type:'bar', label:'N2 capacity (K wfpm)', data:n.map(function(r){ return r[4]; }), backgroundColor:n.map(function(r){ return /E$/.test(r[0])?fade(SUMMIT_CAT[0],0.45):SUMMIT_CAT[0]; }), maxBarThickness:30, yAxisID:'y' },
        { type:'line', label:'EUV allocated to N2 (systems)', data:n.map(function(r){ return r[2]; }), borderColor:SUMMIT_INK, backgroundColor:SUMMIT_INK, borderWidth:2, pointRadius:3, tension:.25, yAxisID:'y2' } ] },
      options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(c){ return c.dataset.label+': '+c.parsed.y; } } } },
        scales:{ x:{ grid:{ display:false }, ticks:{ color:SUMMIT_MUTE, font:{ size:10 } } }, y:AX(function(v){ return v+'K'; }), y2:Object.assign(AX(function(v){ return v; }), { grid:{ display:false } }) } } }); }
}
