// submits.js — Valuation ▸ Submit History: where the Summit DCF model put its price target over time, for any company.
//
// One engine, one data file per company (js/submits-data/<ticker>.js, frozen from the Summit data store's
// get_valuation_history — playbook rule 10). A profile mounts it with submitsHtml('<T>') in a Valuation sub-pane and
// initSubmits(root, '<T>') when that sub-pane is shown. (SAB, Oct 28 2026 — built on SPOT, to be rolled out to every
// profile.) Under the chart: the submit detail (what was submitted) and what the target was built on (the model's
// numbers at the target year, the discount rate and the growth the multiple implies) — both one column per submit.
//
// The chart: each price target holds flat through every day it stood and steps only on the day of the next submit,
// one valuation method at a time (EV/EBITDA | P/E toggle; SAB, Oct 28 2026), against the live daily close in light
// grey (Massive via get-market-history). P/E opens by default. Meets playbook §17.2:
// chips hide a series in the chart and the table, drag zooms either axis, double-click resets, the table sits under
// the chart in a dropdown that counts what it holds. Styles: css/overview.css (.dsh-* rules).

import { SUMMIT_MUTE, fade } from './viz-palette.js';
import { fetchPriceHistory } from './api.js';
import { spotSubmits } from './submits-data/spot.js';
import { googlSubmits } from './submits-data/googl.js';
import { metaSubmits } from './submits-data/meta.js';
import { tsmSubmits } from './submits-data/tsm.js';
import { amznSubmits } from './submits-data/amzn.js';

var SUBMITS_DATA = { SPOT: spotSubmits, GOOGL: googlSubmits, META: metaSubmits, TSM: tsmSubmits, AMZN: amznSubmits };

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var DAY = 86400000;
var LEAD_DAYS = 45;   // the window opens this many days before the first submit, so the first step has a "before"
var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function iso(ms){ var d=new Date(ms); return d.getUTCFullYear()+'-'+('0'+(d.getUTCMonth()+1)).slice(-2)+'-'+('0'+d.getUTCDate()).slice(-2); }
function msOf(s){ return Date.parse(s+'T00:00:00Z'); }
function dShort(s){ var p=s.split('-'); return MON[+p[1]-1]+' '+(+p[2]); }
function dTick(s){ var p=s.split('-'); return MON[+p[1]-1]+" '"+p[0].slice(2); }
function dLong(s){ var p=s.split('-'); return MON[+p[1]-1]+' '+(+p[2])+', '+p[0]; }

// The method legs, in the order the workbook writes them. A leg a company's model does not carry is simply absent.
var LEGS = [
  { k:'ev', short:'EV/EBITDA', label:'Price target · EV/EBITDA' },
  { k:'pe', short:'P/E',       label:'Price target · P/E' }
];
// One method on screen at a time, so the target is always the Summit blue: the --steel token that underlines the
// profile tabs and tops the Key Facts box (SAB, Oct 28 2026). The fair value of the same submit is the same line faded
// and dashed, and starts switched off: it is there to check, not to read first.
var SUMMIT_STEEL = '#3E5A82';
var PT_COLOR = SUMMIT_STEEL;
var FV_COLOR = fade(SUMMIT_STEEL, 0.45);
var DEFAULT_LEG = 'pe';
var PX_COLOR = fade(SUMMIT_MUTE, 0.45);   // the share price is context, not the subject: light grey

var ST = {};   // per ticker: { leg, hid, xr, yr, chart, days, pxErr, loading, tbl }
function stOf(tk){ return ST[tk] || (ST[tk] = { leg:DEFAULT_LEG, hid:{ fv:true }, xr:null, yr:null, chart:null, days:null, pxErr:null, loading:false, tbl:true, asm:true }); }
function dataOf(tk){ return SUBMITS_DATA[tk] || null; }
function usable(D){ return D.submits.filter(function(s){ return !s.skip; }).sort(function(a,b){ return a.d<b.d?-1:1; }); }
function legsOf(D){ return LEGS.filter(function(l){ return usable(D).some(function(s){ return s.val && s.val[l.k]; }); }); }
// The method on screen: the one picked in the toggle (P/E to start), else the first the model carries.
function legOf(tk){ var st=stOf(tk), L=legsOf(dataOf(tk)); return L.filter(function(l){ return l.k===st.leg; })[0] || L[0]; }
function series(tk){ var D=dataOf(tk), l=legOf(tk);
  return [{ k:l.k, label:l.label, color:PT_COLOR }, { k:'fv', label:'Fair value · '+l.short, color:FV_COLOR, dash:true },
          { k:'px', label:D.ticker+' share price (daily close)', color:PX_COLOR }]; }

function fmtPx(D, v){ return v==null ? '—' : D.ccy+v.toFixed(2); }
function fmtMult(v){ return v==null ? '—' : (+v).toFixed(1)+'×'; }
function fmtPct(v){ return v==null || !isFinite(v) ? '—' : (v>=0?'+':'−')+Math.abs(v*100).toFixed(1)+'%'; }
function fmtRate(v){ return v==null || !isFinite(v) ? '—' : (v*100).toFixed(1)+'%'; }
function fmtM(D, v){ return v==null || !isFinite(v) ? '—' : D.mccy+Math.round(v).toLocaleString('en-US'); }
function fmtEps(D, v){ return v==null || !isFinite(v) ? '—' : D.mccy+v.toFixed(2); }

// The submit in force on day `d`: the latest usable submit dated on or before it.
function subAt(subs, d){ var s=null; for(var i=0;i<subs.length;i++){ if(subs[i].d<=d) s=subs[i]; } return s; }

function buildDays(subs, rows){
  var from = msOf(subs[0].d) - LEAD_DAYS*DAY, to = Date.now(), out;
  if(rows && rows.length){
    out = rows.map(function(r){ return { d:iso(r.t), px:(r.c==null?null:+r.c) }; })
      .filter(function(p){ return msOf(p.d) >= from; });
  } else {
    out = [];
    for(var t=from; t<=to; t+=DAY){ var w=new Date(t).getUTCDay(); if(w!==0 && w!==6) out.push({ d:iso(t), px:null }); }
  }
  // a submit made on a non-trading day still needs its own day on the axis
  subs.forEach(function(s){ if(!out.some(function(p){ return p.d===s.d; })) out.push({ d:s.d, px:null }); });
  return out.sort(function(a,b){ return a.d<b.d?-1:1; });
}

function load(tk){
  var st=stOf(tk), D=dataOf(tk), subs=usable(D);
  if(st.days || st.loading) return Promise.resolve();
  st.loading = true;
  var from = iso(msOf(subs[0].d) - LEAD_DAYS*DAY), to = iso(Date.now());
  return fetchPriceHistory(tk, from, to)
    .catch(function(e){ return { success:false, error:{ message:(e&&e.message)||'price fetch failed' } }; })
    .then(function(res){
      var rows = (res && res.success && Array.isArray(res.data)) ? res.data : [];
      st.days = buildDays(subs, rows);
      st.pxErr = rows.length ? null : ((res && res.error && res.error.message) || 'no price rows');
      st.loading = false;
    });
}

export function submitsHtml(tk){
  var D=dataOf(tk); if(!D || !usable(D).length) return '';   // no data, no pane (playbook rule 5)
  var subs=usable(D), skipped=D.submits.filter(function(s){ return s.skip; });
  var h = '<div class="rs-block dsh-blk" data-dsh="'+esc(tk)+'">';
  h += '<div class="rs-block-top"><div class="rs-block-h">Submit history — the price target over time</div></div>';
  h += '<div class="rs-block-modes"><div class="rs-modes" data-dshmode></div></div>';
  h += '<div data-dshwarn></div>';
  h += '<div class="dsh-leg" data-dshleg></div>';
  h += '<div class="dsh-chartwrap"><canvas data-dshcv></canvas></div>';
  h += '<div class="ov-fynote">Each target holds flat until the next submit and steps on the day that submit is made; dots mark the submit days. Drag sideways to zoom dates, up or down (or on the axis) to zoom prices; double-click resets.</div>';
  h += '<div class="rs-collap">'+
         '<button type="button" class="rs-collap-h" data-selfwired="1" data-dshtblb="1"></button>'+
         '<div class="rs-collap-b" data-dshtbl></div></div>';
  if(subs.some(function(s){ return s.model; }))
    h += '<div class="rs-collap">'+
           '<button type="button" class="rs-collap-h" data-selfwired="1" data-dshasmb="1"></button>'+
           '<div class="rs-collap-b" data-dshasm></div></div>';
  var fixes=[]; subs.forEach(function(s){ LEGS.forEach(function(l){ var v=s.val[l.k]; if(v && v.fix) fixes.push(dLong(s.d)+' — '+v.fix); }); });
  if(fixes.length) h += '<div class="ov-fynote">Corrected: '+fixes.map(esc).join('; ')+'.</div>';
  if(skipped.length) h += '<div class="ov-fynote">Left out: '+skipped.map(function(s){ return 'the '+esc(dLong(s.d))+' submit — '+esc(s.skip); }).join('; ')+'.</div>';
  h += '<div class="ov-foot">Sources — '+esc(D.src)+': price target and fair value per method as the workbook recorded them (submits '+
       subs.map(function(s){ return s.d; }).join(', ')+'; frozen, not live — pulled '+esc(D.pulled)+'). '+
       'Model figures: the projections each submit carried (revenue, operating income, Adj. EBITDA, earnings, diluted shares), same pull. '+
       'Price: Massive daily close, live and split-adjusted. Targets are never recomputed here; per-share values in '+esc(D.ccy)+'.</div>';
  return h + '</div>';
}

function modeHtml(tk){
  var cur=legOf(tk);
  return '<div class="rs-views">'+legsOf(dataOf(tk)).map(function(l){
    return '<button type="button" class="rs-view'+(l.k===cur.k?' active':'')+'" data-dshmode-k="'+l.k+'">'+esc(l.short)+'</button>';
  }).join('')+'</div>';
}

function legendHtml(tk){
  var st=stOf(tk);
  return series(tk).map(function(s){
    return '<button type="button" class="rs-leg'+(st.hid[s.k]?' off':'')+'" data-dshleg-k="'+s.k+'" title="Show / hide">'+
      '<span class="rs-leg-line" style="background:'+(s.dash ? 'repeating-linear-gradient(90deg,'+s.color+' 0 4px,transparent 4px 7px)' : s.color)+'"></span>'+esc(s.label)+'</button>';
  }).join('');
}

// Both tables share one grid: one column per submit, oldest to newest (the order the chart reads in), the newest
// shaded as the one in force; rows in titled groups; the row each group is about in bold.
function gridHtml(subs, groups){
  var n=subs.length, last=n-1;
  var h = '<div class="rs-ft-scroll"><table class="rs-ft dsh-ft"><colgroup><col class="dsh-c0">'+
    subs.map(function(){ return '<col>'; }).join('')+'</colgroup><thead><tr><th class="rs-ft-h">Submitted</th>'+
    subs.map(function(s,i){ return '<th'+(i===last?' class="dsh-now"':'')+'>'+esc(dLong(s.d))+
      '<span class="dsh-sub">after '+esc(s.after)+(i===last?' · in force':'')+'</span></th>'; }).join('')+'</tr></thead><tbody>';
  groups.forEach(function(g){
    if(!g || !g.rows.length) return;
    h += '<tr class="dsh-sec"><td class="rs-ft-h" colspan="'+(n+1)+'">'+esc(g.t)+(g.u?'<span class="dsh-unit">'+esc(g.u)+'</span>':'')+'</td></tr>';
    g.rows.forEach(function(r){
      if(!r) return;
      h += '<tr class="rs-ft-main'+(r.key?' dsh-key':'')+(r.sub?' dsh-subrow':'')+'"><td class="rs-ft-h">'+esc(r.l)+'</td>'+
        r.v.map(function(c,i){ return '<td class="'+(c==='—'?'rs-ft-nil':'')+(i===last?' dsh-now':'')+'">'+esc(c)+'</td>'; }).join('')+'</tr>';
    });
  });
  return h + '</tbody></table></div>';
}

// Submit detail: what was submitted for the method on screen. A hidden chip drops its rows.
function tableHtml(tk){
  var st=stOf(tk), D=dataOf(tk), subs=usable(D), l=legOf(tk), showPx=!st.hid.px, showPt=!st.hid[l.k];
  function v(s){ return s.val[l.k] || null; }
  function col(f){ return subs.map(function(s,i){ var x=v(s); return x ? f(x, s, i) : '—'; }); }
  return gridHtml(subs, [
    showPt ? { t:'Price target · '+l.short, rows:[
      { l:'Multiple', v:col(function(x){ return fmtMult(x.mult)+' '+(x.basis==='Trailing'?'trailing':'forward'); }) },
      { l:'Target year', v:col(function(x){ return 'FY'+x.year+'E'; }) },
      { l:'Price target', key:true, v:col(function(x){ return fmtPx(D, x.pt); }) },
      { l:'Change vs previous target', sub:true, v:col(function(x, s, i){ var p=i?v(subs[i-1]):null; return p ? fmtPct(x.pt/p.pt-1) : '—'; }) },
      st.hid.fv ? null : { l:'Fair value', v:col(function(x){ return x.fv!=null ? fmtPx(D, x.fv) : '—'; }) }
    ] } : null,
    showPx ? { t:'Share price', rows:[
      { l:'Close on the submit day', v:subs.map(function(s){ return fmtPx(D, s.px); }) },
      showPt ? { l:'Price target vs that close', sub:true, v:col(function(x, s){ return s.px ? fmtPct(x.pt/s.px-1) : '—'; }) } : null
    ] } : null,
    { t:'In force', rows:[
      { l:'Days', v:subs.map(function(s,i){
        var nx = i+1<subs.length ? subs[i+1].d : null, end = nx ? msOf(nx) : msOf(iso(Date.now()));
        return String(Math.round((end-msOf(s.d))/DAY)); }) }
    ] }
  ]);
}

// What the target was built on: the discount rate and the perpetual growth the multiple implies (rate − 1 ÷ multiple,
// the workbook's own 'Implied Growth' cell), and the model's numbers at the target year with their growth over the
// year before — all from the submit's own frozen model, in the model's currency.
function assumptionsHtml(tk){
  var D=dataOf(tk), subs=usable(D), l=legOf(tk), isPE = l.k==='pe';
  function v(s){ return s.val[l.k] || null; }
  function yr(s, off){ var x=v(s); return x && s.model ? s.model[x.year+(off||0)] || null : null; }
  function col(f){ return subs.map(function(s){ var x=v(s), m=yr(s), p=yr(s,-1); var r = x && m ? f(m, p, x, s) : null; return r==null ? '—' : r; }); }
  function gr(a, b){ return a!=null && b ? fmtPct(a/b-1) : null; }
  function eps(m){ return m && m.sh ? m.ni/m.sh : null; }
  var rate = isPE ? 'coe' : 'wacc';
  return gridHtml(subs, [
    { t:'Valuation · '+l.short, rows:[
      { l:'Multiple', v:col(function(m, p, x){ return fmtMult(x.mult)+' FY'+x.year+'E'; }) },
      { l:isPE ? 'Cost of equity' : 'WACC', v:subs.map(function(s){ return fmtRate(s[rate]); }) },
      { l:'Implied perpetual growth', key:true, v:col(function(m, p, x, s){ return s[rate]!=null ? fmtRate(s[rate]-1/x.mult) : null; }) }
    ] },
    { t:'Model at the target year', u:D.mccy+' millions', rows:[
      { l:'Revenue', v:col(function(m){ return fmtM(D, m.rev); }) },
      { l:'Revenue growth', sub:true, v:col(function(m, p){ return gr(m.rev, p && p.rev); }) },
      { l:'Operating income', v:col(function(m){ return fmtM(D, m.opi); }) },
      { l:'Operating margin', sub:true, v:col(function(m){ return m.rev && m.opi!=null ? fmtRate(m.opi/m.rev) : null; }) },
      { l:D.ebitdaLabel||'Adj. EBITDA', key:!isPE, v:col(function(m){ return fmtM(D, m.ebitda); }) },
      { l:'EBITDA margin', sub:true, v:col(function(m){ return m.rev && m.ebitda!=null ? fmtRate(m.ebitda/m.rev) : null; }) },
      { l:'EBITDA growth', sub:true, v:col(function(m, p){ return gr(m.ebitda, p && p.ebitda); }) },
      { l:'Net income', v:col(function(m){ return fmtM(D, m.ni); }) },
      { l:'Net margin', sub:true, v:col(function(m){ return m.rev && m.ni!=null ? fmtRate(m.ni/m.rev) : null; }) },
      { l:'EPS', key:isPE, v:col(function(m){ return fmtEps(D, eps(m)); }) },
      { l:'EPS growth', sub:true, v:col(function(m, p){ return gr(eps(m), eps(p)); }) }
    ] }
  ]);
}

function render(scope, tk){
  var st=stOf(tk), D=dataOf(tk), subs=usable(D);
  var cv = scope.querySelector('[data-dshcv]'); if(!cv || typeof Chart==='undefined' || !cv.offsetParent) return;
  scope.querySelector('[data-dshmode]').innerHTML = modeHtml(tk);
  scope.querySelector('[data-dshleg]').innerHTML = legendHtml(tk);
  scope.querySelector('[data-dshwarn]').innerHTML = st.pxErr ? '<div class="rs-noguide">⚑ Live data pending — price history unavailable</div>' : '';
  var all=st.days, a=st.xr?st.xr[0]:0, b=st.xr?st.xr[1]:all.length-1, days=all.slice(a, b+1);
  // a dot on the first axis day at or after each submit
  var isSub = days.map(function(p,i){
    var prev = (a+i)===0 ? null : all[a+i-1].d;
    return subs.some(function(s){ return s.d<=p.d && (prev==null || s.d>prev); });
  });
  var ds = [];
  [legOf(tk)].forEach(function(l){
    if(st.hid[l.k]) return;
    ds.push({ _k:l.k, label:l.label, borderColor:PT_COLOR, backgroundColor:PT_COLOR, borderWidth:2.5, stepped:'before', spanGaps:false,
      data:days.map(function(p){ var x=subAt(subs,p.d); return x && x.val[l.k] ? x.val[l.k].pt : null; }),
      pointRadius:days.map(function(p,i){ return isSub[i] ? 4 : 0; }), pointHoverRadius:5 });
  });
  var lf=legOf(tk);
  if(!st.hid.fv) ds.push({ _k:'fv', label:'Fair value · '+lf.short, borderColor:FV_COLOR, backgroundColor:FV_COLOR, borderWidth:1.75,
    borderDash:[5,4], stepped:'before', spanGaps:false, pointRadius:0, pointHoverRadius:4,
    data:days.map(function(p){ var x=subAt(subs,p.d), v=x && x.val[lf.k]; return v && v.fv!=null ? v.fv : null; }) });
  if(!st.hid.px && !st.pxErr) ds.push({ _k:'px', label:D.ticker+' close', borderColor:PX_COLOR, backgroundColor:PX_COLOR,
    borderWidth:1.25, pointRadius:0, spanGaps:true, tension:0, data:days.map(function(p){ return p.px; }) });
  if(st.chart){ st.chart.destroy(); st.chart=null; }
  var everyN = Math.max(1, Math.ceil(days.length/9)), long = days.length > 200;
  var yOpt = { position:'right', grid:{ color:'rgba(124,134,148,0.15)' },
    ticks:{ color:SUMMIT_MUTE, font:{ size:10 }, callback:function(v){ return D.ccy+v; } } };
  if(st.yr){ yOpt.min=st.yr[0]; yOpt.max=st.yr[1]; }
  st.chart = new Chart(cv.getContext('2d'), {
    type:'line', data:{ labels:days.map(function(p){ return p.d; }), datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{
        title:function(items){ return dLong(items[0].label); },
        label:function(c){
          if(c.dataset._k==='px') return D.ticker+' close: '+fmtPx(D, c.parsed.y);
          if(c.dataset._k==='fv') return c.dataset.label+': '+fmtPx(D, c.parsed.y);
          var x=subAt(subs, c.label), v=x && x.val[c.dataset._k];
          if(!v) return c.dataset.label+': no submit yet';
          return c.dataset.label+': '+fmtPx(D, v.pt)+'  ·  '+fmtMult(v.mult)+' FY'+v.year+'E, submitted '+dLong(x.d);
        } } } },
      scales:{
        x:{ grid:{ display:false }, ticks:{ color:SUMMIT_MUTE, font:{ size:10 }, maxRotation:0, autoSkip:false,
          callback:function(v,i){ return i%everyN===0 ? (long ? dTick(days[i].d) : dShort(days[i].d)) : ''; } } },
        y:yOpt } }
  });
  attachBrush(cv, st.chart,
    function(i,j){ st.xr=[a+i, a+j]; render(scope, tk); },
    function(v1,v2){ st.yr=[v1,v2]; render(scope, tk); },
    function(){ st.xr=null; st.yr=null; render(scope, tk); });
  var tb=scope.querySelector('[data-dshtbl]'); tb.hidden=!st.tbl; tb.innerHTML=tableHtml(tk);
  var ab=scope.querySelector('[data-dshasm]');
  if(ab){
    ab.hidden=!st.asm;
    ab.innerHTML=assumptionsHtml(tk)+'<div class="ov-fynote">Implied perpetual growth = '+(legOf(tk).k==='pe'?'cost of equity':'WACC')+
      ' − 1 ÷ multiple, the workbook’s own formula: the growth forever that the multiple prices in. '+
      (D.mccy!==D.ccy
        ? 'Model figures are in '+esc(D.mccy)+' as the model is built; the price targets above are in '+esc(D.ccy)+' (the workbook converts at its own rate), so EPS × multiple does not equal the target. '
        : 'EPS here is model earnings ÷ diluted shares; the workbook prices the target off its own per-share line, so EPS × multiple lands close to the target but not on it. ')+
      'Growth = target year over the year before, both from the same submit.</div>';
    scope.querySelector('[data-dshasmb]').innerHTML = '<span class="rs-collap-ic">'+(st.asm?'▾':'▸')+'</span> What the target was built on <span class="rs-collap-sub">'+
      (st.asm?'hide':'show')+' · discount rate, implied growth and the model at the target year</span>';
  }
  var nSer = series(tk).filter(function(s){ return !st.hid[s.k] && !(s.k==='px' && st.pxErr); }).length;
  scope.querySelector('[data-dshtblb]').innerHTML = '<span class="rs-collap-ic">'+(st.tbl?'▾':'▸')+'</span> Submit detail <span class="rs-collap-sub">'+
    (st.tbl?'hide':'show')+' · '+nSer+' series over '+subs.length+' submits'+(st.xr||st.yr?' · zoomed (double-click the chart to reset)':'')+'</span>';
}

export function initSubmits(root, tk){
  var scope = root.querySelector('.dsh-blk[data-dsh="'+tk+'"]'); if(!scope || !dataOf(tk)) return;
  var st = stOf(tk);
  if(!scope._dshWired){
    scope._dshWired = true;
    scope.addEventListener('click', function(e){
      var mb=e.target.closest('[data-dshmode-k]');
      if(mb){ st.leg=mb.getAttribute('data-dshmode-k'); st.yr=null; render(scope, tk); return; }
      var lb=e.target.closest('[data-dshleg-k]');
      if(lb){ var k=lb.getAttribute('data-dshleg-k'); st.hid[k]=!st.hid[k]; render(scope, tk); return; }
      if(e.target.closest('[data-dshtblb]')){ st.tbl=!st.tbl; render(scope, tk); return; }
      if(e.target.closest('[data-dshasmb]')){ st.asm=!st.asm; render(scope, tk); }
    });
  }
  load(tk).then(function(){ render(scope, tk); });
}

// rsAttachBrush copied from js/results.js — drag zooms either axis (sideways = dates, vertical or on the axis = prices),
// double-click resets.
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
