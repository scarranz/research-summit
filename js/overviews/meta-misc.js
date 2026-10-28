// overviews/meta-misc.js — Meta Deep Dive ▸ Miscellaneous: Capex & Depreciation (MISC-capex), Strategy
// (MISC-strategy), M&A (MISC-manda) and Capacity → revenue (MISC-capacity). Playbook §15b.
// Formal layout (SAB, Oct 20 2026): tables over cards, no emoji, no tap-to-open cards, one source footer per sub-tab.
// Capex comes from js/results-data/meta.js (the same series Results draws); D&A and every text row from
// meta-misc-data.js. Summit figures are the frozen 2026-08-04 snapshot (rule 10).
import { metaResults } from '../results-data/meta.js';
import { META_DNA, META_CAPEX_GUIDE, META_CLOUD_SPLIT, META_EFFIC, META_LOOP, META_BETS,
         META_DEALS, META_CHAIN, META_DC, META_DC_SRC,
         META_COMMIT, META_COMMIT_AFTER, META_COMMIT_WHAT, META_COMMIT_SCHED, META_COMMIT_NEAR, META_PPE, META_DEPR,
         META_DEPR_NOTE, META_LEASE_COST, META_LEASE_TERMS, META_LEASE_MAT, META_VENTURE, META_NOTES, META_NOTES_NOTE,
         META_CLOUD_DEALS } from './meta-misc-data.js';

function tbl(head, rows, cls, numFrom){
  return '<div class="twrap mx-twrap"><table class="rt mx-tbl'+(cls?' '+cls:'')+'"><thead><tr>'+head.map(function(h,i){ return '<th'+(numFrom!=null&&i>=numFrom?' class="mx-n"':'')+'>'+h+'</th>'; }).join('')+
    '</tr></thead><tbody>'+rows.map(function(r){ var rc=r._cls?' class="'+r._cls+'"':''; return '<tr'+rc+'>'+r.map(function(c,i){ return '<td'+(i===0?' class="mx-k"':(numFrom!=null&&i>=numFrom?' class="mx-n"':''))+'>'+c+'</td>'; }).join('')+'</tr>'; }).join('')+'</tbody></table></div>';
}
function h3(t){ return '<div class="ew-h">'+t+'</div>'; }
function bn(m){ return m==null ? '—' : '$'+(m/1000).toFixed(1)+'B'; }
function bB(v){ return v==null ? '—' : '$'+v.toFixed(2)+'B'; }
function mm(v){ return v==null ? '—' : (v<0?'(':'')+Math.abs(v).toLocaleString('en-US')+(v<0?')':''); }
function row(arr, cls){ arr._cls=cls; return arr; }
// Collapsible section — toggled by metaCapexBuild (data-selfwired: the profile’s global handler skips it).
function collap(title, inner, open){
  return '<div class="rs-collap mx-collap"><button type="button" class="rs-collap-h" data-selfwired="1" data-mx="1"><span class="rs-collap-ic">'+(open?'▾':'▸')+'</span> '+title+'</button>'+
    '<div class="rs-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}

// ── Capex & Depreciation ─────────────────────────────────────────────────────
var CX = metaResults.views.y.metrics.capex, RV = metaResults.views.y.metrics.rev, CQ = metaResults.views.q.metrics.capex;
var EVO = metaResults.evolution.metrics;
var YRS = ['2021','2022','2023','2024','2025','2026','2027','2028'];
// FY2028 is not in the Results annual view; it comes from the same frozen snapshot via the Estimates block (Aug column).
var CX28 = EVO.capex.summit[2][3], RV28 = EVO.rev.summit[2][3];
function pick(m, y){ var i=m.periods.indexOf(y); if(i<0) return null; return m.act[i]!=null?{v:m.act[i],e:false}:(m.summit&&m.summit[i]!=null?{v:m.summit[i],e:true}:null); }
function capexOf(y){ if(y==='2028') return CX28!=null?{v:CX28,e:true}:null; return pick(CX,y); }
function revOf(y){ if(y==='2028') return RV28!=null?{v:RV28,e:true}:null; return pick(RV,y); }
function dnaOf(y){ return META_DNA.act[y]!=null?{v:META_DNA.act[y],e:false}:(META_DNA.summit[y]!=null?{v:META_DNA.summit[y],e:true}:null); }
function cxA(y){ return CX.act[CX.periods.indexOf(y)]; }
function rvA(y){ return RV.act[RV.periods.indexOf(y)]; }
var MX = { view:'y' };

function kpis(){
  var C=META_COMMIT, n=C.dates.length-1, h1=CQ.act[CQ.periods.indexOf('1Q26')]+CQ.act[CQ.periods.indexOf('2Q26')];
  var k=[
    [bn(cxA('2025')), 'capex FY2025, incl. finance-lease principal'],
    [bn(h1), 'capex 1H26 — FY2026 guided $130–145B'],
    ['$'+C.contractual[n].toFixed(1)+'B', 'non-cancelable contractual commitments, Jun 30 2026 (Dec 2024: $'+C.contractual[0].toFixed(1)+'B)'],
    ['$'+C.leasesNotCommenced[n].toFixed(1)+'B', 'leases signed, not yet commenced, Jun 30 2026 — plus ~$68B signed in July'],
    [bn(META_PPE.net[2]), 'property and equipment, net, Jun 30 2026 (Dec 2024: '+bn(META_PPE.net[0])+')']
  ];
  return '<div class="ov-kpis mx-kpis">'+k.map(function(x){ return '<div class="ov-kpi"><div class="ov-kpi-v">'+x[0]+'</div><div class="ov-kpi-d muted">'+x[1]+'</div></div>'; }).join('')+'</div>';
}

export function metaCapexBody(){
  var C=META_COMMIT, n=C.dates.length-1;
  var off0=C.contractual[0]+C.leasesNotCommenced[0], offN=C.contractual[n]+C.leasesNotCommenced[n];
  var h='<p class="ov-lede">Meta’s AI build is paid for in three ways — capex on servers and data centers it owns, leases on data centers others build, and contracts for third-party cloud capacity. Only the first shows up as capex. The commitments outside the capex line grew from $'+off0.toFixed(0)+'B at the end of 2024 to $'+offN.toFixed(0)+'B by June 2026; the depreciation and lease cost they create reach the income statement over the following years.</p>';
  h+=kpis();

  // 1 — capex and D&A
  h+=h3('Capex and depreciation')+
     '<div class="mx-ctl"><span class="mg-seg">'+[['y','Annual, FY2021–FY2028E'],['q','Quarterly, 1Q23–2Q26']].map(function(o){ return '<button type="button" class="mg-pill'+(MX.view===o[0]?' active':'')+'" data-mxv="'+o[0]+'">'+o[1]+'</button>'; }).join('')+'</span></div>'+
     '<div class="ov-chart-card mx-chart"><div class="ov-chart-wrap" style="height:280px"><canvas id="meMxCapex"></canvas></div></div>'+
     '<div class="ov-fynote" id="meMxCapexNote"></div>';
  var rows=YRS.map(function(y){ var c=capexOf(y), d=dnaOf(y), r=revOf(y), est=(c&&c.e)||(d&&d.e)||(!c&&d);
    return [y+(est?'E':''), c?bn(c.v):'—', r?bn(r.v):'—', (c&&r)?(c.v/r.v*100).toFixed(1)+'%':'—', d?bn(d.v):'—', (c&&d)?(d.v/c.v*100).toFixed(0)+'%':'—']; });
  var c26=capexOf('2026'), r26=revOf('2026');
  h+=collap('Data — capex, capital intensity and D&amp;A by year', tbl(['Fiscal year','Capex','Revenue','Capex ÷ revenue','D&amp;A','D&amp;A ÷ capex'],rows,null,1)+
     '<div class="ov-fynote">Capital intensity went from '+(cxA('2021')/rvA('2021')*100).toFixed(0)+'% of revenue in 2021 to '+(cxA('2025')/rvA('2025')*100).toFixed(0)+'% in 2025; the frozen model has it at '+(c26.v/r26.v*100).toFixed(0)+'% in 2026. 2026E–2028E: Summit model, snapshot 2026-08-04 (frozen, not live).</div>');
  h+=collap('Capex guidance — every revision', tbl(['Given','For','Range','Context'],META_CAPEX_GUIDE.map(function(r){ return [r[0],r[1],'<b>'+r[2]+'</b>',r[3]]; })));

  // 2 — the three ways the build is paid for
  h+=h3('Three ways the build is paid for')+tbl(['Route','What it is','How it reaches the income statement','Scale (latest filing)'],[
    ['1 · Owned — capex','Servers, network gear and data-center buildings Meta buys outright.','Capitalized as property and equipment, then depreciated over the asset life (most servers 5.5 years). The cost arrives years after the cash.','Capex '+bn(cxA('2025'))+' in 2025; property and equipment, net '+bn(META_PPE.net[2])+' at Jun 30 2026, of which '+bn(META_PPE.rows[2][3])+' still under construction.'],
    ['2 · Leased','Data centers, colocation and network sites that others build and Meta leases, including the Louisiana Venture campus.','Lease cost over the term — operating lease cost, or amortization plus interest for finance leases — from the day each lease commences.','$'+C.leasesNotCommenced[n].toFixed(2)+'B signed but not yet commenced at Jun 30 2026 (from $'+C.leasesNotCommenced[0].toFixed(2)+'B at Dec 2024), plus ~$68B signed in July 2026; $26.3B already on the balance sheet (Dec 2025).'],
    ['3 · Contracted — third-party cloud','Multi-year contracts to rent compute capacity and buy servers and network equipment from vendors.','Mostly operating expense as the capacity is used — in cost of revenue (serving) and R&amp;D (training) — so it never appears in the capex line.','$'+C.contractual[n].toFixed(2)+'B of non-cancelable commitments at Jun 30 2026 (from $'+C.contractual[0].toFixed(2)+'B), $'+META_COMMIT_NEAR[1][1].toFixed(1)+'B due in 2026 and $'+META_COMMIT_NEAR[1][2].toFixed(1)+'B in 2027; plus up to $14.72B of contingent cloud purchases.']
  ]);

  // 3 — commitments over time
  h+=h3('Commitments outside the capex line, Dec 2024 – Jun 2026')+
     '<div class="ov-chart-card mx-chart"><div class="ov-chart-wrap" style="height:260px"><canvas id="meMxCommit"></canvas></div></div>';
  var trs=[
    row(['Non-cancelable contractual commitments'].concat(C.contractual.map(bB))),
    row(['Leases signed, not yet commenced'].concat(C.leasesNotCommenced.map(bB))),
    row(['Total outside the balance sheet'].concat(C.dates.map(function(_,i){ return bB(C.contractual[i]+C.leasesNotCommenced[i]); })),'mx-tot'),
    row(['Contingent cloud purchases (up to)'].concat(C.contingentCloud.map(bB))),
    row(['Cash held in escrow for purchase agreements'].concat(C.escrow.map(bB)))];
  h+=tbl(['US$ billions'].concat(C.dates.map(function(d,i){ return d+'<br><span class="mx-src">'+C.src[i]+'</span>'; })), trs, null, 1);
  h+=tbl(['After the period','What Meta signed','Source'], META_COMMIT_AFTER);
  h+=collap('What the commitments are for, in Meta’s words', tbl(['As of','Description','Source'], META_COMMIT_WHAT));
  h+=collap('When the contractual commitments fall due', tbl(['As of'].concat(META_COMMIT_SCHED.years),[
      ['Dec 31 2025 (US$ M)'].concat(META_COMMIT_SCHED.dec25.map(mm))],null,1)+
    tbl(['As of','Due in 2026','Due in 2027','Total'], META_COMMIT_NEAR.map(function(r){ var i=C.dates.indexOf(r[0]); return [r[0], bB(r[1]), bB(r[2]), bB(C.contractual[i])]; }),null,1)+
    '<div class="ov-fynote">The 10-Qs disclose only what falls due in the next two years. Between March and June 2026 the 2027 tranche rose from $47.65B to $81.65B.</div>');

  // 4 — where the spend lands
  h+=h3('Where the AI spend lands — a Summit estimate')+tbl(['Destination of the 2026 cloud commitments','Share','Amount'],META_CLOUD_SPLIT,null,1)+
     '<div class="ov-fynote">An analytical reconstruction by the Summit team from the commitment notes and vendor disclosures — not a company breakdown. On this split about 71% of the 2026 cloud commitments is operating expense, which is why the investment is larger than the capex line shows. Deals reported outside Meta’s filings (vendor filings and press; Meta does not name its providers): '+
     META_CLOUD_DEALS.map(function(r){ return r[0]+' '+r[1]; }).join(' · ')+'.</div>';

  // 5 — the balance sheet: property and equipment, depreciation
  var P=META_PPE;
  h+=h3('What the capex has built — property and equipment');
  h+=tbl(['US$ millions'].concat(P.cols), P.rows.map(function(r){ return [r[0]].concat(r.slice(1).map(mm)); }).concat([
      row(['Property and equipment, gross'].concat(P.gross.map(mm)),'mx-tot'),
      row(['Less: accumulated depreciation'].concat(P.accum.map(mm))),
      row(['Property and equipment, net'].concat(P.net.map(mm)),'mx-tot')]), null, 1)+
     '<div class="ov-fynote">Servers and network assets grew '+((P.rows[0][3]/P.rows[0][1]-1)*100).toFixed(0)+'% and construction in progress tripled in 18 months; most of the build is still to start depreciating. '+P.capInt+'</div>';
  h+=collap('Depreciation of property and equipment', tbl(['Period','Total (US$ B)','Servers and network assets (US$ B)','Servers’ share'],
      META_DEPR.map(function(r){ return [r[0], r[1].toFixed(2), r[2].toFixed(2), (r[2]/r[1]*100).toFixed(0)+'%']; }),null,1)+
      '<div class="ov-fynote">'+META_DEPR_NOTE+' Depreciation of property and equipment excludes amortization of intangibles, so it sits below the cash-flow D&amp;A in the chart.</div>');

  // 6 — leases on the balance sheet
  var L=META_LEASE_COST, M=META_LEASE_MAT;
  h+=collap('Leases already on the balance sheet', tbl(['Lease cost (US$ M)'].concat(L.years), L.rows.map(function(r){ return [r[0]].concat(r.slice(1).map(mm)); }).concat([row(['Total lease cost'].concat(L.total.map(mm)),'mx-tot')]),null,1)+
      tbl(['Terms','Dec 31 2024','Dec 31 2025'], META_LEASE_TERMS, null, 1)+
      tbl(['Maturities at Dec 31 2025 (US$ M)'].concat(M.years), [['Operating leases'].concat(M.op.map(mm)), ['Finance leases'].concat(M.fin.map(mm))], null, 1)+
      '<div class="ov-fynote">Lease cost rose '+((L.total[2]/L.total[0]-1)*100).toFixed(0)+'% from 2023 to 2025, while leases signed but not yet started grew about eightfold from Dec 2024 to Jun 2026 — that cost is still to come. Original lease periods expire between 2026 and 2093.</div>');

  // 7 — the Louisiana venture
  h+=h3('The Louisiana data-center Venture')+tbl(['Item','What the filings say'], META_VENTURE)+
     '<div class="ov-fynote">The campus is built and financed off Meta’s balance sheet; Meta’s side is a 20% stake, the leases from 2029 and the residual value guarantee, which together make up its $46B maximum exposure. Richland Parish, Louisiana is also the largest site on Meta’s own data-center list ($50B+ of investment).</div>';

  // 8 — debt
  h+=collap('Debt raised alongside the build', tbl(['Issue','Maturities','Coupons','Face amount (US$ M)'], META_NOTES.map(function(r){ return [r[0],r[1],r[2],mm(r[3])]; }).concat([row(['Total, Jun 30 2026','','',mm(META_NOTES.reduce(function(s,r){ return s+r[3]; },0))],'mx-tot')]),null,3)+
     '<div class="ov-fynote">'+META_NOTES_NOTE+'</div>');

  // 9 — efficiency
  h+=h3('Efficiency levers')+tbl(['Lever','What has been said or reported','Source'],META_EFFIC);
  h+='<div class="ov-foot">Sources — Meta Form 10-K FY2024 and FY2025 (MD&amp;A; cash-flow statement; notes on property and equipment, leases, equity investments, long-term debt, commitments and contingencies, segments) and Form 10-Q 1Q26 and 2Q26, SEC EDGAR, read Oct 20 2026; earnings calls Q4 2023–Q2 2026 (2Q26 reconstructed from press); Summit DCF model, snapshot 2026-08-04 (frozen, not live). The cloud-commitment split and the named cloud deals are not company disclosures.</div>';
  return h;
}

function cssVar(n,f){ try{ var v=getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v||f; }catch(e){ return f; } }
var _cx=null, _cm=null;
var TICK={ color:'#8A93A0', font:{ size:10.5 } };
function capexData(){
  if(MX.view==='q'){
    var ps=CQ.periods.filter(function(p,i){ return CQ.act[i]!=null; });
    return { labels:ps, capex:ps.map(function(p){ return { v:CQ.act[CQ.periods.indexOf(p)]/1000, e:false }; }), line:null,
      note:'Quarterly capex as Meta states it (including principal payments on finance leases), 1Q23–2Q26, from the earnings releases. The quarters are lumpy: 2Q26 alone was $31.1B, more than all of 2023. No D&amp;A line: the quarterly series is not in the dataset.' };
  }
  var c=YRS.map(capexOf), d=YRS.map(dnaOf);
  return { labels:YRS.map(function(y,i){ return 'FY'+y.slice(2)+(((c[i]&&c[i].e)||(d[i]&&d[i].e))?'E':''); }),
    capex:c.map(function(x){ return x?{ v:x.v/1000, e:x.e }:null; }), line:d.map(function(x){ return x?{ v:x.v/1000, e:x.e }:null; }),
    note:'Bars = capex as Meta states it (including principal payments on finance leases); line = depreciation and amortization from the cash-flow statement. Solid = reported; lighter = Summit model, snapshot 2026-08-04 (frozen) — the model’s capex is purchases of property and equipment only, a few percent below Meta’s basis.' };
}
function buildCapex(root){
  var cv=root.querySelector('#meMxCapex'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  if(_cx){ _cx.destroy(); _cx=null; }
  var navy=cssVar('--navy','#1B2A41'), steel=cssVar('--steel','#3E5A82'), D=capexData();
  var ds=[{ label:'Capex', data:D.capex.map(function(x){ return x?x.v:null; }), backgroundColor:D.capex.map(function(x){ return x&&x.e?'#B8C4D6':navy; }), maxBarThickness:46, order:2 }];
  if(D.line) ds.push({ type:'line', label:'D&A', data:D.line.map(function(x){ return x?x.v:null; }), borderColor:steel, backgroundColor:steel, borderWidth:2.5, tension:.25, pointRadius:3,
    segment:{ borderDash:function(ctx){ return D.line[ctx.p1DataIndex]&&D.line[ctx.p1DataIndex].e?[5,4]:undefined; } }, order:1 });
  _cx=new Chart(cv.getContext('2d'),{ type:'bar', data:{ labels:D.labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{ display:true, position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': $'+ctx.parsed.y.toFixed(1)+'B'; } } } },
      scales:{ x:{ grid:{ display:false }, ticks:TICK }, y:{ grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return '$'+v+'B'; } } } } } });
  var nt=root.querySelector('#meMxCapexNote'); if(nt) nt.innerHTML=D.note;
}
function buildCommit(root){
  var cv=root.querySelector('#meMxCommit'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  if(_cm){ _cm.destroy(); _cm=null; }
  var navy=cssVar('--navy','#1B2A41'), C=META_COMMIT;
  _cm=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:C.dates, datasets:[
      { label:'Non-cancelable contractual commitments', data:C.contractual, backgroundColor:navy, stack:'s', maxBarThickness:70 },
      { label:'Leases signed, not yet commenced', data:C.leasesNotCommenced, backgroundColor:'#9AACC4', stack:'s', maxBarThickness:70 } ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{ display:true, position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': $'+ctx.parsed.y.toFixed(1)+'B'; },
          footer:function(items){ var i=items[0].dataIndex; return 'Total: $'+(C.contractual[i]+C.leasesNotCommenced[i]).toFixed(1)+'B · '+C.src[i]; } } } },
      scales:{ x:{ stacked:true, grid:{ display:false }, ticks:TICK }, y:{ stacked:true, grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return '$'+v+'B'; } } } } } });
}
export function metaCapexBuild(root){
  var sp=root.querySelector('.ovt-subpane[data-ovst="capex"]')||root;
  if(!sp._mxWired){ sp._mxWired=true;
    sp.addEventListener('click', function(e){
      var v=e.target.closest&&e.target.closest('[data-mxv]');
      if(v){ MX.view=v.getAttribute('data-mxv'); sp.querySelectorAll('[data-mxv]').forEach(function(b){ b.classList.toggle('active', b===v); }); buildCapex(sp); return; }
      var hd=e.target.closest&&e.target.closest('.rs-collap-h[data-mx]');
      if(hd){ var b=hd.nextElementSibling; b.hidden=!b.hidden; var ic=hd.querySelector('.rs-collap-ic'); if(ic) ic.textContent=b.hidden?'▸':'▾'; }
    });
  }
  buildCapex(sp); buildCommit(sp);
}

// ── Strategy ─────────────────────────────────────────────────────────────────
export function metaStrategyBody(){
  var h='<p class="ov-lede">Meta’s strategy is one loop: engagement creates ad inventory, AI turns it into revenue, and the cash funds the next platform. The bull case is that the loop compounds; the bear case is that the spend outruns the monetization.</p>';
  h+=h3('The loop')+'<div class="mx-loop">'+META_LOOP.map(function(s,i){ return '<div class="mx-step"><div class="mx-step-n">'+(i+1)+'</div><div class="mx-step-t">'+s[0]+'</div><div class="mx-step-d">'+s[1]+'</div></div>'; }).join('')+'</div>'+
     '<div class="ov-fynote">Build feeds back into Engage: better products and AI bring more time spent, which closes the loop.</div>';
  h+=h3('The bets that carry it')+tbl(['Bet','What it is','Why it matters'],META_BETS);
  h+='<div class="ov-foot">Sources — Meta Form 10-K FY2025 (Item 1 Business, MD&amp;A, Note 15 segment data), SEC EDGAR; earnings calls Q4 2025 and Q1 2026.</div>';
  return h;
}

// ── M&A ──────────────────────────────────────────────────────────────────────
export function metaMnaBody(){
  var h='<p class="ov-lede">Two acquisitions built the franchise — Instagram and WhatsApp, about $20B together. Everything since Oculus is a platform bet the advertising business pays for, from Reality Labs to the 2025 Scale AI stake.</p>';
  h+=h3('Deals')+tbl(['Year','Company','Value','Type','What it became'],META_DEALS.map(function(r){ return [r[0],'<b>'+r[1]+'</b>',r[2],r[3],r[4]]; }));
  h+='<div class="ov-fynote">Reality Labs, the business Oculus started, has lost about $77B at the operating line from FY2021 to FY2025 (segment data, 10-K Note 15). Values are as widely reported at announcement; Meta does not disclose most of them.</div>';
  h+='<div class="ov-foot">Sources — Meta Form 10-K filings (business combinations and segment notes), SEC EDGAR; deal values as reported at announcement (press).</div>';
  return h;
}

// ── Capacity → revenue ───────────────────────────────────────────────────────
export function metaCapacityBody(){
  var h='<p class="ov-lede">Meta’s revenue is not sold by the unit of capacity, so the chain from capex to revenue cannot be drawn end to end: capex and revenue are reported, the compute capacity in between is not. What can be shown is each link with its source, and where the chain breaks.</p>';
  h+=h3('The chain, link by link')+tbl(['Link','Measure','Latest value','Source','Status'],META_CHAIN.map(function(r){ return ['<b>'+r[0]+'</b>',r[1],r[2],r[3],r[4]]; }));
  // directory grouped by country, with subtotals
  var order=[], g={};
  META_DC.forEach(function(r){ if(!g[r[0]]){ g[r[0]]=[]; order.push(r[0]); } g[r[0]].push(r); });
  var body='';
  order.forEach(function(cn){ var rs=g[cn], usd=rs.reduce(function(s,r){ return s+(r[4]||0); },0), allUsd=rs.every(function(r){ return r[4]!=null; });
    body+='<tr class="ew-tgrp"><td>'+cn+'</td><td>'+rs.length+' site'+(rs.length>1?'s':'')+'</td><td>'+(allUsd&&rs.length>1?'$'+usd.toFixed(1)+'B+ in total':'')+'</td></tr>';
    rs.slice().sort(function(a,b){ return a[2].localeCompare(b[2]); }).forEach(function(r){ body+='<tr><td class="mx-k">'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td></tr>'; });
  });
  h+=h3('Data centers by country ('+META_DC.length+' sites)')+'<div class="twrap mx-twrap"><table class="rt mx-tbl ew-tbl"><thead><tr><th>Location</th><th>Broke ground</th><th>Investment (as stated)</th></tr></thead><tbody>'+body+'</tbody></table></div>';
  h+='<div class="ov-fynote">Meta lists each site with the year it broke ground and the investment, in local currency; it does not publish capacity (MW) or whether a site is in operation, so neither is shown. Richland Parish, Louisiana ($50B+) is the largest single commitment.</div>';
  h+='<div class="ov-foot">Sources — '+META_DC_SRC+'; Meta Form 10-K FY2025 and 2Q26 earnings release, SEC EDGAR; earnings calls Q4 2025 and Q1 2026.</div>';
  return h;
}
