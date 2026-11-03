// overviews/uber-gov.js — Uber Deep Dive ▸ Management ▸ Governance & SBC (MG-GOV, playbook §15).
//
// Layout copied from js/overviews/googl-gov.js (lede · 4 KPIs · "How Uber is governed" as one .twrap/.rt table, A29)
// plus the SBC-vs-share-count chart that Uber's July profile had here (relocation #92, "keep"): Uber's Bottom Line ▸
// General ▸ Stock-based compensation (BL-GEN-4) is not built yet, so the chart stays in this pane until it is — then it
// moves there and this pane keeps only a pointer (playbook §15 MG-GOV). Relocation: ubGovBody's four tiles (#91, merged
// with the three governance cells of Executives & Board — none repeated here) and the SBC paragraph of both ubGovBody
// and ubCapAllocBody (#86, #92) become rows of the table; the chart is rebuilt on filed figures (the July bars were a
// Summit-model share count that did not tie to the balance sheet) and follows CHART_ENGINE_REFERENCE §0: drag to zoom
// on the y-axis (double-click resets), click a legend chip to hide a series (the table below loses it too), table in
// an .rs-collap dropdown.
// Sources (reported figures, rule 10): Form 10-K FY2025 (filed Feb 13 2026) and earlier 10-Ks — SBC and repurchases from
// the cash-flow statements, revenue from the income statements, shares outstanding from the balance sheets (SEC XBRL
// company facts); Form 10-Q for 2Q26 (filed Aug 5 2026); 2026 proxy statement (DEF 14A filed Mar 23 2026, DEFR14A Apr 20
// 2026); vote results, Form 8-K of May 8 2026.
import { SUMMIT_INK, SUMMIT_CAT, fade } from '../viz-palette.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// US$ million; shares = period-end shares outstanding (millions)
var YRS = ['FY2020','FY2021','FY2022','FY2023','FY2024','FY2025'];
var SBC = [827, 1168, 1793, 1935, 1796, 1826];
var REV = [11139, 17455, 31877, 37281, 43978, 52017];
var BUY = [0, 0, 0, 0, 1252, 6523];
var SH  = [1849.8, 1949.3, 2005.5, 2071.1, 2108.0, 2067.9];
var H1_26 = { sbc:1023, buy:3529, sh:2040.0 };            // 10-Q 2Q26: six months to Jun 30 2026
var SAY_ON_PAY = { f:1416648050, a:94297858, ab:2985807 }; // 8-K May 8 2026
var L = YRS.length-1;
function pctOf(a,b){ return a/b*100; }
function b1(m){ return '$'+(m/1000).toFixed(m>=10000?1:2)+'B'; }

var ROWS = [
  ['Share class', 'One class, one vote',
   'A single class of common stock, one vote a share. The proxy lists what Uber does not have: dual-class stock, a poison pill, a classified board, supermajority votes to amend the bylaws or charter. The holder table is in Ownership.'],
  ['Board', 'Independent Chair · 9 of 10 independent',
   'Ronald Sugar has been Independent Chair since July 2018; the governance guidelines require the Chair to be independent and separate from the CEO. Dara Khosrowshahi is the only non-independent director. The board met nine times in 2025 (2026 proxy).'],
  ['Committees', 'Three, all independent',
   'Audit (chair John Thain; met eight times in 2025), Compensation (chair Robert Eckert; six), Nominating and Governance (chair Ronald Sugar; four). Cybersecurity and AV-partnership risk are reported to the Audit Committee (2026 proxy).'],
  ['Shareholder rights', 'Annual, majority-vote elections',
   'All directors stand every year and need a majority of votes cast. Proxy access: up to 20 holders owning 3% for three years can nominate up to two directors or 20% of the board; holders of 25% can call a special meeting (2026 proxy).'],
  ['Pay', 'CEO $35.6M in FY2025 · 96% at risk',
   'CEO total compensation $35,595,826 in 2025 — 360 times the median employee; base salary $1.1M. 96% of the CEO’s and, on average, 93% of the other named executives’ target pay is variable. Ownership guideline: ten times base salary for the CEO; hedging and pledging are prohibited; the clawback goes beyond the SEC and NYSE minimum (2026 proxy).'],
  ['Shareholder votes, May 2026', 'Say-on-pay '+(SAY_ON_PAY.f/(SAY_ON_PAY.f+SAY_ON_PAY.a+SAY_ON_PAY.ab)*100).toFixed(1)+'% for',
   'At the May 4 2026 meeting say-on-pay passed with '+(SAY_ON_PAY.f/(SAY_ON_PAY.f+SAY_ON_PAY.a+SAY_ON_PAY.ab)*100).toFixed(1)+'% of votes cast (the proxy cites about 91% on average over the past five years). All ten directors were elected; the lowest support went to Nikesh Arora (79.6%) and Ronald Sugar (90.9%); every other director received more than 97% (Form 8-K, May 8 2026).'],
  ['SBC against buybacks', 'Share count falling since 2025',
   'Stock-based compensation has held near $1.8B a year since FY2022 while revenue grew, so it fell from '+pctOf(SBC[0],REV[0]).toFixed(1)+'% of revenue in FY2020 to '+pctOf(SBC[L],REV[L]).toFixed(1)+'% in FY2025. With no buybacks until 2024, shares outstanding rose every year from '+SH[0].toLocaleString('en-US')+'M (FY2020) to '+SH[4].toLocaleString('en-US')+'M (FY2024); FY2025 was the first year they fell ('+SH[L].toLocaleString('en-US')+'M), when buybacks of '+b1(BUY[L])+' ran well ahead of SBC. By Jun 30 2026 the count was '+H1_26.sh.toLocaleString('en-US')+'M.'],
];

export function uberGovBody(){
  var h='<p class="ov-lede">Uber is governed like a widely held company: one class of stock, an independent Chair, an all-independent committee structure, and pay that is almost all equity. Stock-based pay has shrunk relative to revenue, and since 2025 buybacks have been large enough to shrink the share count.</p>';
  h+='<div class="ov-kpis">'+[
    ['9 of 10', 'independent directors · independent Chair (2026 proxy)'],
    [b1(SBC[L]), 'stock-based compensation, FY2025 · '+pctOf(SBC[L],REV[L]).toFixed(1)+'% of revenue (FY2020: '+pctOf(SBC[0],REV[0]).toFixed(1)+'%)'],
    [b1(BUY[L]), 'share repurchases, FY2025 (FY2024: '+b1(BUY[4])+'; 1H26: '+b1(H1_26.buy)+') · no dividend has ever been paid'],
    [(SAY_ON_PAY.f/(SAY_ON_PAY.f+SAY_ON_PAY.a+SAY_ON_PAY.ab)*100).toFixed(1)+'%', 'say-on-pay support, May 4 2026 annual meeting (Form 8-K)'],
  ].map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-v">'+k[0]+'</div><div class="ov-kpi-d muted">'+esc(k[1])+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-sec-h mg-sec-gap">How Uber is governed</div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl gov-tbl"><thead><tr><th>Topic</th><th>In short</th><th>Detail</th></tr></thead><tbody>'+
    ROWS.map(function(r){ return '<tr><td><b>'+esc(r[0])+'</b></td><td>'+esc(r[1])+'</td><td class="own-role">'+esc(r[2])+'</td></tr>'; }).join('')+'</tbody></table></div>';
  h+='<div class="ov-sec-h mg-sec-gap">SBC as % of revenue vs shares outstanding, FY2020–FY2025</div>';
  h+='<div class="ave-leg" id="ubGovLeg"></div>';
  h+='<div class="ov-chart-card"><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="ubGovSbc"></canvas></div></div>';
  h+='<div class="ov-fynote">Bars: shares outstanding at year-end (left axis). Line: SBC ÷ revenue (right axis). Drag up or down on the chart to zoom the share axis; double-click to reset. Click a legend item to hide it. This chart moves to Bottom Line ▸ General ▸ Stock-based compensation once that pane is built.</div>';
  h+='<div class="rs-collap" data-rstbl="ubgov"><button type="button" class="rs-collap-h" data-ubgovtbl="1"><span class="rs-collap-ic">▾</span> Table <span class="rs-collap-sub">SBC, revenue, buybacks and shares, FY2020–FY2025 and 1H26</span></button>'+
     '<div class="rs-collap-b" id="ubGovTblB"><div class="rs-tablewrap" id="ubGovTbl"></div></div></div>';
  h+='<div class="ov-foot">Sources: Uber Form 10-K FY2025 (filed Feb 13 2026) and the 10-Ks for FY2020–FY2024 (SBC and repurchases from the statements of cash flows, revenue from the income statements, shares outstanding from the balance sheets; via SEC XBRL company facts) and Form 10-Q for 2Q26 (filed Aug 5 2026); 2026 proxy statement (DEF 14A, filed Mar 23 2026; DEFR14A of Apr 20 2026) for the board, committees, rights and pay; Form 8-K of May 8 2026 for the vote results.</div>';
  return h;
}

// ── chart (§0: brush on y, legend hides series + table rows, table in .rs-collap) ──
var G = { chart:null, hidden:{}, yr:null };
var SER = [
  { k:'sh',  l:'Shares outstanding, year-end (M)', c:fade(SUMMIT_INK,0.38), line:false },
  { k:'pct', l:'SBC as % of revenue', c:SUMMIT_CAT[0], line:true },
];
function legHtml(){
  return SER.map(function(s){ return '<button type="button" class="rs-leg'+(G.hidden[s.k]?' off':'')+'" data-ubgovleg="'+s.k+'" title="Show / hide">'+
    (s.line?'<span class="rs-leg-line" style="background:'+s.c+'"></span>':'<span class="ave-leg-act" style="background:'+s.c+'"></span>')+esc(s.l)+'</button>'; }).join('');
}
function tblHtml(){
  var cols = YRS.concat(['1H26']);
  var rows = [];
  if(!G.hidden.pct) rows.push(['SBC as % of revenue', SBC.map(function(v,i){ return pctOf(v,REV[i]).toFixed(1)+'%'; }).concat([''])]);
  rows.push(['Stock-based compensation ($M)', SBC.map(function(v){ return v.toLocaleString('en-US'); }).concat([H1_26.sbc.toLocaleString('en-US')])]);
  rows.push(['Revenue ($M)', REV.map(function(v){ return v.toLocaleString('en-US'); }).concat([''])]);
  rows.push(['Share repurchases ($M)', BUY.map(function(v){ return v?v.toLocaleString('en-US'):'—'; }).concat([H1_26.buy.toLocaleString('en-US')])]);
  if(!G.hidden.sh) rows.push(['Shares outstanding, period-end (M)', SH.map(function(v){ return v.toLocaleString('en-US',{minimumFractionDigits:1}); }).concat([H1_26.sh.toLocaleString('en-US',{minimumFractionDigits:1})])]);
  return '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h"></th>'+cols.map(function(c){ return '<th>'+c+'</th>'; }).join('')+'</tr></thead><tbody>'+
    rows.map(function(r){ return '<tr class="rs-ft-main"><td class="rs-ft-h">'+esc(r[0])+'</td>'+r[1].map(function(v){ return '<td>'+(v===''?'<span class="rs-ft-nil">—</span>':v)+'</td>'; }).join('')+'</tr>'; }).join('')+
    '</tbody></table></div>';
}
function rsAttachBrush(el, chart, onX, onY, onReset){   // copied from js/results.js (§0.7)
  var wrap = el.parentElement;
  if (wrap && getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
  el.style.cursor = 'crosshair';
  el.onmousedown = function(ev){
    if (ev.button !== 0) return;
    var r0 = el.getBoundingClientRect(), w0 = wrap.getBoundingClientRect();
    var area = chart.chartArea;
    var onAxis = (ev.clientX - r0.left) < area.left || (ev.clientX - r0.left) > area.right;
    var forcedY = onAxis || !onX;
    var vertical = forcedY ? true : null;
    var startX = ev.clientX, startY = ev.clientY;
    var box = null;
    function ensureBox(){
      if (box) return;
      box = document.createElement('div');
      box.className = 'rs-brush';
      if (vertical){ box.style.left = (r0.left - w0.left + area.left) + 'px'; box.style.width = (area.right - area.left) + 'px'; }
      else { box.style.top = (r0.top - w0.top) + 'px'; box.style.height = r0.height + 'px'; }
      wrap.appendChild(box);
    }
    function decide(cx, cy){ if (vertical != null) return; var dx = Math.abs(cx - startX), dy = Math.abs(cy - startY); if (Math.max(dx, dy) < 8) return; vertical = dy > dx; }
    function place(cx, cy){
      if (vertical == null) return;
      ensureBox();
      if (vertical){ var a = Math.min(startY, cy), b = Math.max(startY, cy); box.style.top = (a - w0.top) + 'px'; box.style.height = (b - a) + 'px'; }
      else { var a2 = Math.min(startX, cx), b2 = Math.max(startX, cx); box.style.left = (a2 - w0.left) + 'px'; box.style.width = (b2 - a2) + 'px'; }
    }
    place(ev.clientX, ev.clientY);
    function onMove(e2){ decide(e2.clientX, e2.clientY); place(e2.clientX, e2.clientY); }
    function onUp(e2){
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      decide(e2.clientX, e2.clientY);
      if (box) box.remove();
      if (vertical == null) return;
      if (vertical){
        if (Math.abs(e2.clientY - startY) < 8) return;
        var v1 = chart.scales.y.getValueForPixel(Math.min(startY, e2.clientY) - r0.top);
        var v2 = chart.scales.y.getValueForPixel(Math.max(startY, e2.clientY) - r0.top);
        onY(Math.min(v1, v2), Math.max(v1, v2));
      } else {
        if (Math.abs(e2.clientX - startX) < 8) return;
        function idxAt(clientX){ var v = chart.scales.x.getValueForPixel(clientX - r0.left); return Math.max(0, Math.min(chart.data.labels.length - 1, Math.round(v))); }
        var a = idxAt(startX), b = idxAt(e2.clientX);
        if (a !== b) onX(Math.min(a, b), Math.max(a, b));
      }
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    ev.preventDefault();
  };
  el.ondblclick = onReset;
}
function draw(sp){
  var cv=sp.querySelector('#ubGovSbc'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  if(G.chart){ G.chart.destroy(); G.chart=null; }
  var leg=sp.querySelector('#ubGovLeg'); if(leg) leg.innerHTML=legHtml();
  var tb=sp.querySelector('#ubGovTbl'); if(tb) tb.innerHTML=tblHtml();
  var ds=[];
  if(!G.hidden.sh) ds.push({ type:'bar', label:SER[0].l, data:SH, backgroundColor:SER[0].c, borderColor:'white', borderWidth:1, maxBarThickness:46, yAxisID:'y', order:2 });
  if(!G.hidden.pct) ds.push({ type:'line', label:SER[1].l, data:SBC.map(function(v,i){ return Math.round(pctOf(v,REV[i])*10)/10; }), borderColor:SER[1].c, backgroundColor:SER[1].c, borderWidth:2.5, tension:.25, pointRadius:3, yAxisID:'y1', order:1 });
  G.chart=new Chart(cv.getContext('2d'),{
    data:{ labels:YRS, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(c){ return c.dataset.yAxisID==='y1' ? ' SBC: '+c.parsed.y.toFixed(1)+'% of revenue' : ' Shares outstanding: '+c.parsed.y.toLocaleString('en-US',{minimumFractionDigits:1})+'M'; } } } },
      scales:{
        y:{ position:'left', display:!G.hidden.sh, title:{ display:true, text:'Shares outstanding (M)', font:{ size:10 } }, ticks:{ font:{ size:10 }, callback:function(v){ return v.toLocaleString('en-US')+'M'; } }, grid:{ color:'#EEF2F7' },
            min:G.yr?G.yr[0]:1600, max:G.yr?G.yr[1]:undefined },
        y1:{ position:'right', display:!G.hidden.pct, title:{ display:true, text:'SBC (% of revenue)', font:{ size:10 } }, ticks:{ font:{ size:10 }, callback:function(v){ return v+'%'; } }, grid:{ display:false }, min:0 },
        x:{ grid:{ display:false }, ticks:{ font:{ size:10 } } } } }
  });
  rsAttachBrush(cv, G.chart, null, function(v1,v2){ G.yr=[v1,v2]; draw(sp); }, function(){ G.yr=null; draw(sp); });
}
export function uberGovBuild(root){
  var sp=(root||document).querySelector('.ov-uber-dd .ovt-subpane[data-ovst="governance"]'); if(!sp) return;
  if(!sp._govWired){ sp._govWired=true;
    sp.addEventListener('click', function(e){
      var l=e.target.closest&&e.target.closest('[data-ubgovleg]');
      if(l){ var k=l.getAttribute('data-ubgovleg'); G.hidden[k]=!G.hidden[k]; if(k==='sh') G.yr=null; draw(sp); return; }
      var t=e.target.closest&&e.target.closest('[data-ubgovtbl]');
      if(t){ var b=sp.querySelector('#ubGovTblB'); if(b) b.hidden=!b.hidden; }
    });
  }
  draw(sp);
}
