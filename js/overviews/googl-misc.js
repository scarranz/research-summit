// overviews/googl-misc.js — Alphabet Deep Dive ▸ Miscellaneous ▸ Capex & Depreciation (MISC-capex). Playbook §15b.
// Copy of meta-misc.js metaCapexBody/metaCapexBuild (formal layout: tables over cards, no emoji, one source footer),
// with Alphabet's own routes: owned capex, leases not yet commenced, long-term supply agreements and data-center backstops.
// Capex and revenue come from js/results-data/googl.js (the same series Results draws); depreciation and every text row
// from googl-misc-data.js. Summit figures are the frozen 2026-08-06 snapshot (rule 10).
import { googlResults } from '../results-data/googl.js';
import { GOOGL_DEPR, GOOGL_LIFE_NOTE, GOOGL_CAPEX_GUIDE, GOOGL_COMMIT, GOOGL_COMMIT_WHAT, GOOGL_COMMIT_AFTER,
         GOOGL_BACKSTOP_NOTE, GOOGL_PPE, GOOGL_LEASES, GOOGL_INTERSECT, GOOGL_FUNDING, GOOGL_FUNDING_ROWS,
         GOOGL_CHAIN, GOOGL_BACKLOG_NOTE, GOOGL_DC, GOOGL_DC_SRC, GOOGL_LOOP, GOOGL_BETS,
         GOOGL_TAM_ADS, GOOGL_TAM_ADS_SRC, GOOGL_TAM_CLOUD, GOOGL_TAM_CLOUD_SRC, GOOGL_TAM_FRONTIER, GOOGL_TAM_DEF } from './googl-misc-data.js';
import { googlSegments } from '../segments-data/googl.js';

function tbl(head, rows, cls, numFrom){
  return '<div class="twrap mx-twrap"><table class="rt mx-tbl'+(cls?' '+cls:'')+'"><thead><tr>'+head.map(function(h,i){ return '<th'+(numFrom!=null&&i>=numFrom?' class="mx-n"':'')+'>'+h+'</th>'; }).join('')+
    '</tr></thead><tbody>'+rows.map(function(r){ var rc=r._cls?' class="'+r._cls+'"':''; return '<tr'+rc+'>'+r.map(function(c,i){ return '<td'+(i===0?' class="mx-k"':(numFrom!=null&&i>=numFrom?' class="mx-n"':''))+'>'+c+'</td>'; }).join('')+'</tr>'; }).join('')+'</tbody></table></div>';
}
function h3(t){ return '<div class="ew-h">'+t+'</div>'; }
function bn(m){ return m==null ? '—' : '$'+(m/1000).toFixed(1)+'B'; }
function bB(v){ return v==null ? '—' : '$'+v.toFixed(1)+'B'; }
function mm(v){ return v==null ? '—' : (v<0?'(':'')+Math.abs(v).toLocaleString('en-US')+(v<0?')':''); }
function row(arr, cls){ arr._cls=cls; return arr; }
// Collapsible section — toggled by googlCapexBuild (data-selfwired: the profile’s global handler skips it).
function collap(title, inner, open){
  return '<div class="rs-collap mx-collap"><button type="button" class="rs-collap-h" data-selfwired="1" data-mx="1"><span class="rs-collap-ic">'+(open?'▾':'▸')+'</span> '+title+'</button>'+
    '<div class="rs-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}

// ── Capex & Depreciation ─────────────────────────────────────────────────────
var CX = googlResults.views.y.metrics.capex, RV = googlResults.views.y.metrics.rev, CQ = googlResults.views.q.metrics.capex;
var YRS = ['2021','2022','2023','2024','2025','2026','2027','2028'];
function pick(m, y){ var i=m.periods.indexOf(y); if(i<0) return null; return m.act[i]!=null?{v:m.act[i],e:false}:(m.summit&&m.summit[i]!=null?{v:m.summit[i],e:true}:null); }
function capexOf(y){ return pick(CX,y); }
function revOf(y){ return pick(RV,y); }
function dnaOf(y){ return GOOGL_DEPR.act[y]!=null?{v:GOOGL_DEPR.act[y],e:false}:(GOOGL_DEPR.summit[y]!=null?{v:GOOGL_DEPR.summit[y],e:true}:null); }
function cxA(y){ return CX.act[CX.periods.indexOf(y)]; }
function rvA(y){ return RV.act[RV.periods.indexOf(y)]; }
function cqA(q){ return CQ.act[CQ.periods.indexOf(q)]; }
var MX = { view:'y' };

function kpis(){
  var C=GOOGL_COMMIT, n=C.dates.length-1, P=GOOGL_PPE;
  var k=[
    [bn(cxA('2025')), 'capex FY2025 (FY2024: '+bn(cxA('2024'))+')'],
    [bn(cqA('1Q26')+cqA('2Q26')), 'capex 1H26 — FY2026 guided $195–205B'],
    [bB(C.purchase[n]), 'purchase commitments, Jun 30 2026 (Dec 2025: '+bB(C.purchase[1])+')'],
    [bn(P.net[P.net.length-1]), 'property and equipment, net, Jun 30 2026 (Dec 2024: '+bn(P.net[0])+')']
  ];
  return '<div class="ov-kpis mx-kpis">'+k.map(function(x){ return '<div class="ov-kpi"><div class="ov-kpi-v">'+x[0]+'</div><div class="ov-kpi-d muted">'+x[1]+'</div></div>'; }).join('')+'</div>';
}

export function googlCapexBody(){
  var C=GOOGL_COMMIT, n=C.dates.length-1, P=GOOGL_PPE, F=GOOGL_FUNDING;
  var off0=C.purchase[1]+C.leasesNotCommenced[1]+C.creditBackstops[1], offN=C.purchase[n]+C.leasesNotCommenced[n]+C.creditBackstops[n];
  var h='<p class="ov-lede">Alphabet’s build is paid for in four ways — capex on servers and data centers it owns, leases on data centers others build, long-term supply agreements for the hardware still to come, and backstops on other companies’ data-center leases. Only the first shows up as capex. The other three went from $'+off0.toFixed(0)+'B at the end of 2025 to $'+offN.toFixed(0)+'B by June 2026; the depreciation and lease cost they create reach the income statement over the following years.</p>';
  h+=kpis();

  // 1 — capex and depreciation
  h+=h3('Capex and depreciation')+
     '<div class="mx-ctl"><span class="mg-seg">'+[['y','Annual, FY2021–FY2028E'],['q','Quarterly, 1Q23–2Q26']].map(function(o){ return '<button type="button" class="mg-pill'+(MX.view===o[0]?' active':'')+'" data-mxv="'+o[0]+'">'+o[1]+'</button>'; }).join('')+'</span></div>'+
     chartBlock('capex', 280)+
     '<div class="ov-fynote" id="gMxCapexNote"></div>';
  var c26=capexOf('2026'), r26=revOf('2026');
  h+='<div class="ov-fynote">Capital intensity went from '+(cxA('2021')/rvA('2021')*100).toFixed(0)+'% of revenue in 2021 to '+(cxA('2025')/rvA('2025')*100).toFixed(0)+'% in 2025; the frozen model has it at '+(c26.v/r26.v*100).toFixed(0)+'% in 2026. 2026E = reported 1Q–2Q + the model’s 3Q–4Q; 2026E–2028E: Summit model, snapshot 2026-08-06 (frozen, not live).</div>';
  h+=collap('Capex guidance — every revision', tbl(['Given','For','Guide','Context'],GOOGL_CAPEX_GUIDE.map(function(r){ return [r[0],r[1],'<b>'+r[2]+'</b>',r[3]]; })));

  // 2 — the four ways the build is paid for
  h+=h3('Four ways the build is paid for')+tbl(['Route','What it is','How it reaches the income statement','Scale (latest filing)'],[
    ['1 · Owned — capex','Servers, network gear and data-center buildings Alphabet buys and builds itself.','Capitalized as property and equipment, then depreciated once in service (servers generally over six years). The cost arrives years after the cash.','Capex '+bn(cxA('2025'))+' in 2025 and '+bn(cqA('1Q26')+cqA('2Q26'))+' in 1H26; '+bn(P.notInService[n])+' of assets not yet in service at Jun 30 2026, not yet depreciating.'],
    ['2 · Leased','Data centers that others build and Alphabet leases, including leases with data-center leasing entities (VIEs), accounted for as finance leases.','Lease cost over the term from the day each lease commences — operating lease cost, or amortization plus interest for finance leases.','$'+C.leasesNotCommenced[n].toFixed(1)+'B signed but not yet commenced at Jun 30 2026 (from $'+C.leasesNotCommenced[0].toFixed(1)+'B at Dec 2024), commencing 2026–2031; plus a $5.8B short-term lease starting in 3Q26.'],
    ['3 · Contracted — supply agreements','Long-term agreements that secure future production capacity for technical-infrastructure and inventory components, plus energy take-or-pay contracts and content licenses.','Infrastructure hardware becomes capex on delivery, then depreciation; inventory components become cost of revenue when the TPU systems are sold; energy and content are operating cost as used.','$'+C.purchase[n].toFixed(1)+'B of purchase commitments at Jun 30 2026, $'+C.purchaseShort[n].toFixed(1)+'B short-term (Dec 2025: $'+C.purchase[1].toFixed(1)+'B). Note 10: $707.0B fixed or guaranteed, generally fulfilled through 2030.'],
    ['4 · Backstopped — third-party data centers','Alphabet guarantees other companies’ data-center lease payments (credit derivatives) and energy-equipment orders (financial guarantees).','Nothing unless a counterparty defaults; changes in fair value run through other income (OI&amp;E). On a default Alphabet can take over the leases.','$'+C.creditBackstops[n].toFixed(1)+'B of lease backstops and $'+C.guarantees[n].toFixed(1)+'B of guarantees at Jun 30 2026 (lease backstops: zero at Dec 2024); about $'+C.backstopsAgreed[n].toFixed(1)+'B more agreed, terms not final.']
  ]);

  // 3 — commitments over time
  h+=h3('Commitments outside the capex line, Dec 2024 – Jun 2026')+
     chartBlock('commit', 260, true);
  h+='<div class="ov-fynote">'+GOOGL_BACKSTOP_NOTE+' The purchase-commitment total is the filing’s headline figure; its wording moved from purchase orders (2024) to long-term supply agreements (2026), so read the jump as both more hardware ordered and longer contracts. — = not disclosed at that date.</div>';
  h+=tbl(['Signed','What Alphabet signed','Source'], GOOGL_COMMIT_AFTER);
  h+=collap('What the commitments are for, in Alphabet’s words', tbl(['As of','Description','Source'], GOOGL_COMMIT_WHAT));

  // 4 — the balance sheet: property and equipment
  h+=h3('What the capex has built — property and equipment');
  h+=tbl(['US$ millions'].concat(P.cols), P.rows.map(function(r){ return [r[0]].concat(r.slice(1).map(mm)); }).concat([
      row(['Property and equipment, in service'].concat(P.inService.map(mm)),'mx-tot'),
      row(['Less: accumulated depreciation'].concat(P.accum.map(mm))),
      row(['Add: assets not yet in service'].concat(P.notInService.map(mm))),
      row(['Property and equipment, net'].concat(P.net.map(mm)),'mx-tot')]), null, 1)+
     '<div class="ov-fynote">Technical infrastructure in service grew '+((P.rows[0][4]/P.rows[0][1]-1)*100).toFixed(0)+'% in 18 months and assets not yet in service went from '+bn(P.notInService[0])+' to '+bn(P.notInService[3])+' — most of the build is still to start depreciating. '+P.note+'</div>';
  h+=collap('Why depreciation fell in 2023', '<div class="ov-fynote">'+GOOGL_LIFE_NOTE+' Since then depreciation has grown faster than in-service assets as the 2024–2026 capex comes online: $'+(GOOGL_DEPR.act['2025']/1000).toFixed(1)+'B in 2025 (+'+((GOOGL_DEPR.act['2025']/GOOGL_DEPR.act['2024']-1)*100).toFixed(0)+'%), and $'+((GOOGL_DEPR.q['1Q26']+GOOGL_DEPR.q['2Q26'])/1000).toFixed(1)+'B in 1H26 (+'+(((GOOGL_DEPR.q['1Q26']+GOOGL_DEPR.q['2Q26'])/(GOOGL_DEPR.q['1Q25']+GOOGL_DEPR.q['2Q25'])-1)*100).toFixed(0)+'%). The CFO, 4Q25 call: “we expect the growth rate in 2026 depreciation to accelerate in Q1, and meaningfully increase for the full year.”</div>');

  // 5 — leases on the balance sheet
  var L=GOOGL_LEASES, M=L.mat;
  h+=collap('Leases already on the balance sheet', tbl(['US$ millions'].concat(L.cols), [
      ['Operating lease liabilities'].concat(L.opLiab.map(mm)), ['Finance lease liabilities'].concat(L.finLiab.map(mm)),
      ['Undiscounted future payments — operating'].concat(L.opPay.map(mm)), ['Undiscounted future payments — finance'].concat(L.finPay.map(mm))], null, 1)+
      tbl(['Maturities at Jun 30 2026 (US$ M)'].concat(M.years), [['Operating leases'].concat(M.op.map(mm)), ['Finance leases'].concat(M.fin.map(mm))], null, 1)+
      '<div class="ov-fynote">The leases already recorded total about $'+((L.opPay[2]+L.finPay[2])/1000).toFixed(0)+'B of future payments; the leases signed but not yet commenced ($'+C.leasesNotCommenced[n].toFixed(1)+'B) are about three and a half times that — that cost is still to come.</div>');

  // 6 — Intersect
  h+=h3('Intersect — buying the power and the sites')+tbl(['Item','What the filings say'], GOOGL_INTERSECT)+
     '<div class="ov-fynote">Intersect is a variable interest entity of which Alphabet is the primary beneficiary, so it is consolidated in full. Its $5.1B of property and equipment entered the balance sheet at close, which is part of the jump in assets not yet in service in 1Q26.</div>';

  // 7 — funding
  h+=h3('How the build is being funded')+tbl(['US$ billions'].concat(F.cols), [
      ['Long-term debt'].concat(F.ltDebt.map(bB)),
      ['Cash, cash equivalents and marketable securities'].concat(F.cash.map(bB))], null, 1)+
     tbl(['Item','What the filings say','Source'], GOOGL_FUNDING_ROWS)+
     '<div class="ov-fynote">Long-term debt rose about ninefold in 18 months and buybacks stopped; together with the 2Q26 equity, the raised money more than covered the spend — cash and securities nearly doubled in the first half of 2026.</div>';

  h+='<div class="ov-foot">Sources — Alphabet Form 10-K FY2023, FY2024 and FY2025 and Form 10-Q 1Q26 and 2Q26 (MD&amp;A; cash-flow statements; notes on derivatives, leases, variable interest entities, debt, property and equipment, acquisitions, commitments and contingencies), SEC EDGAR, read Oct 27 2026; earnings calls 4Q23–2Q26 (docs/calls); Summit DCF model, snapshot 2026-08-06 (frozen, not live). 3Q26 (10-Q due after the Oct 28 print) not yet included.</div>';
  return h;
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
var ZS = { capex:{ h:{}, xr:null, yr:null, ch:null }, commit:{ h:{}, xr:null, yr:null, ch:null }, backlog:{ h:{}, xr:null, yr:null, ch:null } };
var IDS = { capex:'gMxCapex', commit:'gMxCommit', backlog:'gMxBacklog' };
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

// 1 — capex and depreciation (annual FY21–FY28E, quarterly 1Q23–2Q26)
function capexSpec(){
  var navy=cssVar('--navy','#1B2A41'), steel=cssVar('--steel','#3E5A82'), labels, cap, dep, cE, dE, tbl2;
  if(MX.view==='q'){
    var ps=CQ.periods.filter(function(p,i){ return CQ.act[i]!=null; });
    labels=ps; cap=ps.map(function(p){ return cqA(p)/1000; }); dep=ps.map(function(p){ var d=GOOGL_DEPR.q[p]; return d!=null?d/1000:null; });
    cE=null; dE=null;
    tbl2=function(){ var hd=['Quarter'], sc=vis('capex','capex'), sd=vis('capex','dep');
      if(sc) hd.push('Capex'); if(sd) hd.push('Depreciation'); if(sc&&sd) hd.push('Depreciation ÷ capex');
      return tbl(hd, ps.map(function(q){ var c=cqA(q), d=GOOGL_DEPR.q[q], r=[q]; if(sc) r.push(bn(c)); if(sd) r.push(d!=null?bn(d):'—'); if(sc&&sd) r.push((c&&d)?(d/c*100).toFixed(0)+'%':'—'); return r; }), null, 1); };
  } else {
    var c=YRS.map(capexOf), d=YRS.map(dnaOf);
    labels=YRS.map(function(y,i){ return 'FY'+y.slice(2)+(((c[i]&&c[i].e)||(d[i]&&d[i].e))?'E':''); });
    cap=c.map(function(x){ return x?x.v/1000:null; }); dep=d.map(function(x){ return x?x.v/1000:null; });
    cE=c.map(function(x){ return !!(x&&x.e); }); dE=d.map(function(x){ return !!(x&&x.e); });
    tbl2=function(){ var hd=['Fiscal year'], sc=vis('capex','capex'), sd=vis('capex','dep');
      if(sc) hd.push('Capex','Revenue','Capex ÷ revenue'); if(sd) hd.push('Depreciation'); if(sc&&sd) hd.push('Depreciation ÷ capex');
      return '<div class="mx-src">E = estimate: Summit model, snapshot 2026-08-06 (frozen); 2026E = reported 1Q–2Q + the model’s 3Q–4Q.</div>'+
        tbl(hd, YRS.map(function(y){ var cc=capexOf(y), dd=dnaOf(y), rr=revOf(y), est=(cc&&cc.e)||(dd&&dd.e), r=[y+(est?' E':'')];
          if(sc) r.push(cc?bn(cc.v):'—', rr?bn(rr.v):'—', (cc&&rr)?(cc.v/rr.v*100).toFixed(1)+'%':'—'); if(sd) r.push(dd?bn(dd.v):'—'); if(sc&&sd) r.push((cc&&dd)?(dd.v/cc.v*100).toFixed(0)+'%':'—'); return r; }), null, 1); };
  }
  return { labels:labels, table:tbl2,
    ser:[{ k:'capex', label:'Capex', color:navy, data:cap, est:cE }, { k:'dep', label:'Depreciation', color:steel, type:'line', data:dep, est:dE }],
    scales:function(){ return { x:{ grid:{ display:false }, ticks:TICK }, y:{ grid:{ color:'#EEF2F7' }, ticks:yB() } }; } };
}
function capexNote(){
  return MX.view==='q'
    ? 'Bars = quarterly capex (purchases of property and equipment), 1Q23–2Q26; line = depreciation of property and equipment, from the 10-Q year-to-date figures. 2Q26 alone was $44.9B, more than all of 2023.'
    : 'Bars = capex (purchases of property and equipment); line = depreciation of property and equipment, from the cash-flow statement. Solid = reported; lighter bars and dashed line = Summit model, snapshot 2026-08-06 (frozen) — FY2026E is reported 1Q–2Q plus the model’s 3Q–4Q, and at $205.8B sits at the top of the $195–205B guide.';
}
function buildCapex(sp){ drawChart(sp, 'capex', capexSpec()); var nt=sp.querySelector('#gMxCapexNote'); if(nt) nt.innerHTML=capexNote(); }

// 2 — commitments outside the capex line (stacked); the total adds only the series shown
function commitSpec(){
  var navy=cssVar('--navy','#1B2A41'), C=GOOGL_COMMIT;
  var ser=[{ k:'pur', label:'Purchase commitments', color:navy, data:C.purchase, bar:70 },
           { k:'lea', label:'Leases signed, not yet commenced', color:'#9AACC4', data:C.leasesNotCommenced, bar:70 },
           { k:'bks', label:'Data-center lease backstops', color:'#D3DCE8', data:C.creditBackstops, bar:70 }];
  function tot(i){ return ser.reduce(function(s,x){ return s+(vis('commit',x.k)?x.data[i]:0); },0); }
  return { labels:C.dates, ser:ser, stacked:true,
    tooltip:{ label:function(ctx){ return ctx.dataset.label+': $'+ctx.parsed.y.toFixed(1)+'B'; },
      footer:function(items){ var i=items[0].dataIndex+(ZS.commit.xr?ZS.commit.xr[0]:0); return 'Total shown: $'+tot(i).toFixed(1)+'B · '+C.src[i]; } },
    scales:function(){ return { x:{ stacked:true, grid:{ display:false }, ticks:TICK }, y:{ stacked:true, grid:{ color:'#EEF2F7' }, ticks:yB() } }; },
    table:function(){
      var trs=[];
      if(vis('commit','pur')){ trs.push(row(['Purchase commitments and other contractual obligations'].concat(C.purchase.map(bB)))); trs.push(row(['&nbsp;&nbsp;of which short-term'].concat(C.purchaseShort.map(bB)))); }
      if(vis('commit','lea')) trs.push(row(['Leases signed, not yet commenced'].concat(C.leasesNotCommenced.map(bB))));
      if(vis('commit','bks')) trs.push(row(['Backstops of third-party data-center leases (notional)'].concat(C.creditBackstops.map(bB))));
      var all=ser.every(function(x){ return vis('commit',x.k); });
      trs.push(row([(all?'Total outside the balance sheet':'Total of the series shown')].concat(C.dates.map(function(_,i){ return bB(tot(i)); })),'mx-tot'));
      trs.push(row(['Memo: financial guarantees (energy equipment)'].concat(C.guarantees.map(bB))));
      trs.push(row(['Memo: further backstops agreed, terms not final'].concat(C.backstopsAgreed.map(bB))));
      return tbl(['US$ billions'].concat(C.dates.map(function(d,i){ return d+'<br><span class="mx-src">'+C.src[i]+'</span>'; })), trs, null, 1);
    } };
}
function buildCommit(sp){ drawChart(sp, 'commit', commitSpec()); }

export function googlCapexBuild(root){
  var sp=root.querySelector('.ovt-subpane[data-ovst="capex"]')||root;
  if(!sp._mxWired){ sp._mxWired=true;
    sp.addEventListener('click', function(e){
      var v=e.target.closest&&e.target.closest('[data-mxv]');
      if(v){ MX.view=v.getAttribute('data-mxv'); ZS.capex.xr=null; ZS.capex.yr=null;   // a new axis drops the zoom
        sp.querySelectorAll('[data-mxv]').forEach(function(b){ b.classList.toggle('active', b===v); }); buildCapex(sp); return; }
      if(legClick(e, sp)) return;
      collapClick(e);
    });
  }
  buildCapex(sp); buildCommit(sp);
}
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
// = results-data (as Results). Conversion share is the reader's control, default 50% (“just over 50%” in 24 months).
var CLQ = googlResults.views.q.metrics.cloud, CLY = googlResults.views.y.metrics.cloud, RPO = googlSegments.shared.rpo.q.act;
var BL_Q = Object.keys(RPO);
var CAP = { share:50 };
var CLOUD_BACKLOG = 513900;   // Google Cloud's part of the Jun 30 2026 backlog, US$ M (10-Q 2Q26, Note 2)
function clq(p){ var i=CLQ.periods.indexOf(p); return i<0?null:{ act:CLQ.act[i], cons:CLQ.cons[i] }; }
function cly(y){ var i=CLY.periods.indexOf(y); return i<0?null:{ cons:CLY.cons[i], summit:CLY.summit[i] }; }
function pc(v){ return v==null ? '—' : Math.round(v*100)+'%'; }
function coverRows(){
  var perYr=CLOUD_BACKLOG*CAP.share/100/2, n4=['3Q26','4Q26','1Q27','2Q27'].reduce(function(s,p){ var c=clq(p); return s+(c&&c.cons!=null?c.cons:0); },0);
  var y27=cly('2027'), y28=cly('2028');
  var cmp=[
    ['Consensus, next four quarters (3Q26–2Q27)', n4],
    ['Consensus FY2027', y27&&y27.cons], ['Summit FY2027', y27&&y27.summit],
    ['Consensus FY2028', y28&&y28.cons], ['Summit FY2028', y28&&y28.summit]
  ];
  return { perYr:perYr, rows:cmp.map(function(r){ return [r[0], bn(r[1]), bn(perYr), r[1]?pc(perYr/r[1]):'—']; }) };
}
function coverHtml(){
  var C=coverRows();
  return '<div class="me-bl-note">At '+CAP.share+'% within 24 months, Google Cloud’s $513.9B backlog alone is <b>'+bn(C.perYr)+' a year</b> of revenue from contracts already signed (3Q26–2Q28, averaged).</div>'+
    tbl(['Against','Cloud revenue expected','From signed backlog, per year','Covered'], C.rows, null, 1);
}
export function googlCapacityBody(){
  var h='<p class="ov-lede">Alphabet reports what goes in (capex), what is contracted (the revenue backlog) and what comes out (Cloud revenue), but not the capacity in between — no megawatts, gigawatts or TPU counts. Each link is shown with its source, and where the chain breaks.</p>';
  h+=h3('The chain, link by link')+tbl(['Link','Measure','Latest value','Source','Status'],GOOGL_CHAIN.map(function(r){ return ['<b>'+r[0]+'</b>',r[1],r[2],r[3],r[4]]; }));
  // backlog vs Cloud revenue
  h+=h3('Revenue backlog against Google Cloud revenue')+chartBlock('backlog', 280)+
    '<div class="me-bl-note">Bars = revenue backlog at each quarter-end (left axis); line = Google Cloud revenue in the quarter (right axis). Both reported. The backlog went from $61.7B (1Q23) to $519.5B (2Q26); Cloud revenue from $7.5B to $24.8B a quarter.</div>';
  // what the signed backlog covers
  h+=h3('What the signed backlog already covers')+
    '<div class="br-sl"><span class="br-sl-l">Recognized in 24 months</span><input type="range" data-gcap="1" min="40" max="70" step="1" value="'+CAP.share+'" aria-label="Share of the backlog recognized within 24 months"><span class="br-sl-v" data-gcapv="1">'+CAP.share+'%</span></div>'+
    '<div id="gCapCover">'+coverHtml()+'</div>'+
    '<div class="ov-fynote">'+GOOGL_BACKLOG_NOTE+' Consensus = Bloomberg, newest snapshot in the Results dataset; Summit = model snapshot 2026-08-06 (frozen). The backlog also includes TPU system sales, “the vast majority” of which Alphabet expects to be revenue in 2027 (2Q26 call).</div>';
  // directory grouped by country, with subtotals
  var order=[], g={}, dev=0;
  GOOGL_DC.forEach(function(r){ if(!g[r[0]]){ g[r[0]]=[]; order.push(r[0]); } g[r[0]].push(r); if(r[2]==='In development') dev++; });
  var body='';
  order.forEach(function(cn){ var rs=g[cn], d=rs.filter(function(r){ return r[2]==='In development'; }).length;
    body+='<tr class="ew-tgrp"><td>'+cn+'</td><td>'+rs.length+' location'+(rs.length>1?'s':'')+(d?' · '+d+' in development':'')+'</td></tr>';
    rs.slice().sort(function(a,b){ return a[1].localeCompare(b[1]); }).forEach(function(r){ body+='<tr><td class="mx-k">'+r[1]+'</td><td>'+r[2]+'</td></tr>'; });
  });
  h+=h3('Data centers by country ('+GOOGL_DC.length+' locations, '+dev+' in development)')+
    collap('All locations', '<div class="twrap mx-twrap"><table class="rt mx-tbl ew-tbl"><thead><tr><th>Location</th><th>Status</th></tr></thead><tbody>'+body+'</tbody></table></div>');
  h+='<div class="ov-fynote">Google lists each location and whether it is in development; a location may hold more than one data-center site. It publishes no capacity (MW), investment or opening year per site, so none is shown.</div>';
  h+='<div class="ov-foot">Sources — Alphabet Form 10-K FY2025 and 10-Q 2Q26 (Notes 2 and 7), SEC EDGAR; earnings calls 4Q24, 2Q25–2Q26 (official transcripts for 4Q25–2Q26); Results dataset (Cloud revenue, Bloomberg consensus, Summit snapshot 2026-08-06); Top Line dataset (revenue backlog); '+GOOGL_DC_SRC+'.</div>';
  return h;
}
// 3 — revenue backlog (bars, left axis) against Google Cloud revenue (line, right axis); vertical zoom acts on the left axis
function backlogSpec(){
  var navy=cssVar('--navy','#1B2A41'), steel=cssVar('--steel','#3E5A82');
  var rpo=BL_Q.map(function(p){ return RPO[p]/1000; }), cr=BL_Q.map(function(p){ var c=clq(p); return c&&c.act!=null?c.act/1000:null; });
  return { labels:BL_Q,
    ser:[{ k:'rpo', label:'Revenue backlog (left axis)', color:'#B8C4D6', data:rpo, bar:40 },
         { k:'cloud', label:'Google Cloud revenue (right axis)', color:navy, type:'line', data:cr, yAxisID:'y1' }],
    scales:function(){ return { x:{ grid:{ display:false }, ticks:TICK },
      y:{ position:'left', display:vis('backlog','rpo'), grid:{ color:'#EEF2F7' }, title:{ display:true, text:'Backlog', color:'#8A93A0', font:{ size:10 } }, ticks:yB() },
      y1:{ position:'right', display:vis('backlog','cloud'), grid:{ display:false }, title:{ display:true, text:'Cloud revenue', color:steel, font:{ size:10 } }, ticks:yB() } }; },
    table:function(){ var sr=vis('backlog','rpo'), sc=vis('backlog','cloud'), hd=['Quarter'];
      if(sr) hd.push('Revenue backlog'); if(sc) hd.push('Google Cloud revenue'); if(sr&&sc) hd.push('Backlog ÷ annualized Cloud revenue');
      return tbl(hd, BL_Q.map(function(p){ var c=clq(p), r=RPO[p], o=[p]; if(sr) o.push(bn(r)); if(sc) o.push(c&&c.act!=null?bn(c.act):'—'); if(sr&&sc) o.push(c&&c.act?(r/(c.act*4)).toFixed(1)+'×':'—'); return o; }), null, 1); } };
}
function buildBacklog(sp){ drawChart(sp, 'backlog', backlogSpec()); }
export function googlCapacityBuild(root){
  var sp=root.querySelector('.ovt-subpane[data-ovst="capacity"]')||root;
  if(!sp._mxWired){ sp._mxWired=true;
    sp.addEventListener('click', function(e){ if(legClick(e, sp)) return; collapClick(e); });
    sp.addEventListener('input', function(e){
      var s=e.target.closest&&e.target.closest('[data-gcap]'); if(!s) return;
      CAP.share=+s.value; var v=sp.querySelector('[data-gcapv]'); if(v) v.textContent=CAP.share+'%';
      var c=sp.querySelector('#gCapCover'); if(c) c.innerHTML=coverHtml();
    });
  }
  buildBacklog(sp);
}

// ── Strategy (MISC-strategy) ─────────────────────────────────────────────────
// Copy of meta-misc.js metaStrategyBody: the loop (five steps, Dani #40) + the bets in a formal table.
export function googlStrategyBody(){
  var h='<p class="ov-lede">Alphabet describes its strategy as “full stack”: own every layer of AI from the chip to the product, ship it to billions of users, earn from it four ways, and put the cash back into the stack. The open question is whether the earnings keep pace with a capex bill that more than doubles in 2026.</p>';
  h+=h3('The loop')+'<div class="mx-loop mx-loop5">'+GOOGL_LOOP.map(function(s,i){ return '<div class="mx-step"><div class="mx-step-n">'+(i+1)+'</div><div class="mx-step-t">'+s[0]+'</div><div class="mx-step-d">'+s[1]+'</div></div>'; }).join('')+'</div>'+
     '<div class="ov-fynote">Reinvest feeds back into Own the silicon: the capex buys the next generation of chips and data centers, which closes the loop.</div>';
  h+=h3('The bets that carry it')+tbl(['Bet','What it is','Why it matters'],GOOGL_BETS.map(function(r){ return ['<b>'+r[0]+'</b>',r[1],r[2]]; }));
  h+='<div class="ov-foot">Sources — Alphabet Form 10-K FY2025 (Item 1 Business) and 10-Q 2Q26, SEC EDGAR; Alphabet earnings-call transcripts 4Q25, 1Q26 and 2Q26 (abc.xyz investor relations).</div>';
  return h;
}

// ── TAM (MISC-tam) ───────────────────────────────────────────────────────────
// Dani's three vectors (#15–16) as tables: third-party size with source and date, Alphabet's reported figure beside it.
// Alphabet's figures are read from the Results dataset (quarterly actuals), never retyped.
var RQ = googlResults.views.q.metrics;
function qsum(m, ps){ var t=0; for(var i=0;i<ps.length;i++){ var j=m.periods.indexOf(ps[i]); if(j<0||m.act[j]==null) return null; t+=m.act[j]; } return t; }
function yoy(m, cur, prev){ var a=qsum(m,cur), b=qsum(m,prev); return a&&b ? (a/b-1) : null; }
function pct1(v){ return v==null ? '—' : (v>=0?'+':'')+(v*100).toFixed(1)+'%'; }
var FY25=['1Q25','2Q25','3Q25','4Q25'], H126=['1Q26','2Q26'], H125=['1Q25','2Q25'];
export function googlTamBody(){
  var ads=RQ.ads, srch=RQ.search, cl=RQ.cloud;
  var h='<p class="ov-lede">Alphabet sells into two large markets that outside firms size — advertising and cloud infrastructure — and is building three businesses that nobody sizes yet. Each figure below names its source and date; Alphabet’s own numbers sit beside them.</p>';
  h+=h3('Advertising')+tbl(['Measure','Size','Source'], GOOGL_TAM_ADS.map(function(r){ return ['<b>'+r[0]+'</b>',r[1],r[2]]; }));
  h+=tbl(['Alphabet','FY2025','1H26, year on year'], [
    ['Google advertising revenue', bn(qsum(ads,FY25)), pct1(yoy(ads,H126,H125))],
    ['of which Search &amp; other', bn(qsum(srch,FY25)), pct1(yoy(srch,H126,H125))]
  ], null, 1);
  h+='<div class="ov-fynote">Against the market’s +8.9% for 2026 (WPP Media). Alphabet figures: Form 10-K FY2025 and 10-Q 1Q26/2Q26, through the Results dataset.</div>';
  h+=h3('Cloud infrastructure')+tbl(['Measure','Size','Source'], GOOGL_TAM_CLOUD.map(function(r){ return ['<b>'+r[0]+'</b>',r[1],r[2]]; }));
  h+=tbl(['Alphabet','2Q26','Year on year'], [
    ['Google Cloud revenue', bn(qsum(cl,['2Q26'])), pct1(yoy(cl,['2Q26'],['2Q25']))]
  ], null, 1);
  h+='<div class="ov-fynote">Against the market’s +43% in the same quarter (Synergy). Google Cloud: 10-Q 2Q26, through the Results dataset.</div>';
  h+=h3('The new frontiers — no market size')+tbl(['Line','What Alphabet reports','Source'], GOOGL_TAM_FRONTIER.map(function(r){ return ['<b>'+r[0]+'</b>',r[1],r[2]]; }));
  h+='<div class="ov-fynote">No third-party size with a primary source was found for these three, so none is shown.</div>';
  h+='<div class="ov-fynote">'+GOOGL_TAM_DEF+'</div>';
  h+='<div class="ov-foot">Sources — '+GOOGL_TAM_ADS_SRC+'; '+GOOGL_TAM_CLOUD_SRC+' (both read Oct 27 2026); Alphabet Form 10-K FY2025 and 10-Q 1Q26/2Q26, SEC EDGAR; earnings calls 1Q26 and 2Q26 (official transcripts).</div>';
  return h;
}
