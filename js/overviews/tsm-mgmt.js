// overviews/tsm-mgmt.js — TSMC Deep Dive ▸ Management, on AMAZON'S code (playbook §15).
//
// Executives & Board runs on the shared makeManagement mold (js/overviews/management.js), exactly as amzn.js
// (AMZN_MGMT) and sharkninja-mgmt.js (SN_MGMT) mount it; the data is ./tsm-mgmt-data.js (TSMC 20-F FY2025,
// Item 6). Ownership (SAB, Oct 16 2026) is NOT Amazon's box layout: a structured holder table — insiders now, from
// the 20-F share-ownership table; institutional holders join from a Bloomberg HDS export when it exists. Value is
// ADS-equivalent shares × the live ADR price (Massive). Governance & SBC and Track Record come with their units.

import { makeManagement } from './management.js';
import { SUMMIT_CAT } from '../viz-palette.js';
import { TSM_MGMT_CFG, TSM_SHARES_OUT, TSM_INSIDERS, TSM_INSIDER_GROUP, TSM_OWN_SRC, TSM_GOV, TSM_TRACK, TSM_TRACK_BENCH, TSM_TRACK_FOOT } from './tsm-mgmt-data.js';

var cfg = {}; for (var k in TSM_MGMT_CFG) cfg[k] = TSM_MGMT_CFG[k];
cfg.brand = SUMMIT_CAT[0];   // Summit token, never the company colour
export var TSM_MGMT = makeManagement(cfg);

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function adsEq(h){ return h.common/5 + h.ads; }                       // ADS-equivalent shares (1 ADS = 5 common)
function pctOut(h){ return (h.common + 5*h.ads) / TSM_SHARES_OUT; }
function fmtN(v){ return Math.round(v).toLocaleString('en-US'); }
function fmtPct(p){ return p===0 ? '0%' : (p<0.0001 ? '&lt;0.01%' : (p*100).toFixed(2)+'%'); }
function fmtUsd(v){ return v>=1e9 ? '$'+(v/1e9).toFixed(2)+'B' : v>=1e6 ? '$'+(v/1e6).toFixed(1)+'M' : v>=1e3 ? '$'+Math.round(v/1e3)+'K' : (v>0 ? '$'+Math.round(v) : '—'); }
var NIL = '<span class="own-nil">–</span>';
var OWN = { filter:'all', px:null, failed:false };
var HOLDERS = TSM_INSIDERS.map(function(r){ return { name:r[0], role:r[1], grp:r[2], common:r[3], ads:r[4], note:r[5]||'' }; })
  .sort(function(a,b){ return adsEq(b)-adsEq(a); });
function ownRows(){
  var list=HOLDERS.filter(function(h){ return OWN.filter==='all' || h.grp===OWN.filter; });
  var tot={ common:0, ads:0 }; list.forEach(function(h){ tot.common+=h.common; tot.ads+=h.ads; });
  function val(h){ return OWN.px!=null ? fmtUsd(adsEq(h)*OWN.px) : NIL; }
  var body=list.map(function(h,i){
    return '<tr><td class="own-rk">'+(i+1)+'</td><td><b>'+esc(h.name)+'</b>'+(h.note?'<span class="own-note">'+esc(h.note)+'</span>':'')+'</td>'+
      '<td class="own-role">'+esc(h.role)+'</td><td>'+(h.common?fmtN(h.common):'—')+'</td><td>'+(h.ads?fmtN(h.ads):'—')+'</td>'+
      '<td><b>'+fmtN(adsEq(h))+'</b></td><td>'+fmtPct(pctOut(h))+'</td><td>'+val(h)+'</td></tr>';
  }).join('');
  return body+'<tr class="own-tot"><td></td><td>Total shown <span class="own-note">'+list.length+' people</span></td><td></td><td>'+fmtN(tot.common)+'</td><td>'+fmtN(tot.ads)+'</td>'+
    '<td><b>'+fmtN(adsEq(tot))+'</b></td><td>'+fmtPct(pctOut(tot))+'</td><td>'+val(tot)+'</td></tr>';
}
function ownTable(){
  var head='<tr><th class="own-rk">#</th><th>Holder</th><th>Position at TSMC</th><th>Common shares</th><th>ADSs</th><th>ADS-equivalent</th><th>% out</th><th>Value (live)</th></tr>';
  return '<div class="twrap own-wrap"><table class="rt own-tbl own-ins"><thead>'+head+'</thead><tbody id="tsmOwnBody">'+ownRows()+'</tbody></table></div>';
}

// ── Ownership — the holder table (insiders first; institutions join from Bloomberg HDS) ──
export function tsmOwnBody(){
  var h='';
  h+='<p class="ov-lede"><b>What the people running TSMC own.</b> Every director and executive officer in the 20-F, ranked by stake, with its value at the live ADR price.</p>';
  h+='<div class="ov-sec-h mg-sec-gap">Insiders — directors and executive officers</div>';
  h+='<div class="mg-tog-row own-ctl"><span class="mg-tog">Show: <span class="mg-seg">'+
     [['all','All'],['board','Board'],['exec','Executive officers']].map(function(f){ return '<button type="button" class="mg-pill'+(OWN.filter===f[0]?' active':'')+'" data-ownf="'+f[0]+'">'+f[1]+'</button>'; }).join('')+
     '</span></span><span class="own-px" id="tsmOwnPx">loading live ADR price…</span></div>';
  h+=ownTable();
  h+='<div class="ov-fynote">Directors and executive officers as a group held <b>'+fmtN(TSM_INSIDER_GROUP)+' shares ('+fmtPct(TSM_INSIDER_GROUP/TSM_SHARES_OUT)+')</b> on Feb 28, 2026, excluding the National Development Fund; the per-person table is as of Mar 18, 2026. '+
     'Counts exclude shares held by related parties, ESPP and LTI trusts, and unvested restricted stock awards; no director or officer held stock options. The Fund’s director, Dr. Chun-Hsien Yeh, holds no shares personally.</div>';
  h+='<div class="ov-sec-h mg-sec-gap">Executives &amp; insider activity — live from Fiscal.ai</div>';
  h+='<div id="dd-mgmt-slot"></div>';   // filled by companies.js (the same live table as Pillars ▸ Management)
  h+='<div class="ov-foot">Holdings: '+esc(TSM_OWN_SRC)+'. ADS-equivalent = common shares ÷ 5 + ADSs; % out on the Feb 28, 2026 share count. Value = ADS-equivalent × the live NYSE ADR price (Massive). Institutional holders are not disclosed in the 20-F (only holders above 5%); they will be added from a Bloomberg holdings (HDS) export.</div>';
  return h;
}
export function tsmOwnInit(root){
  var sp=root.querySelector('.ov-tsm-dd .ovt-subpane[data-ovst="ownership"]'); if(!sp) return;
  function paint(){
    var b=sp.querySelector('#tsmOwnBody'); if(b) b.innerHTML=ownRows();
    var px=sp.querySelector('#tsmOwnPx'); if(px) px.textContent=OWN.px!=null?('ADR $'+OWN.px.toFixed(2)+' · live'):(OWN.failed?'live ADR price unavailable — values blank':'loading live ADR price…');
    sp.querySelectorAll('[data-ownf]').forEach(function(x){ x.classList.toggle('active', x.getAttribute('data-ownf')===OWN.filter); });
  }
  if(!sp._ownWired){ sp._ownWired=true;
    sp.addEventListener('click', function(e){ var t=e.target.closest&&e.target.closest('[data-ownf]'); if(!t) return; OWN.filter=t.getAttribute('data-ownf'); paint(); });
    import('../api.js').then(function(m){ return m&&m.liveQuote?m.liveQuote('TSM'):null; }).then(function(res){
      var q=res&&res.data?res.data:res; if(q&&q.price!=null) OWN.px=q.price; else OWN.failed=true; paint(); }).catch(function(){ OWN.failed=true; paint(); });
  }
  paint();
}

function kpis(list){ return '<div class="ov-kpis">'+(list||[]).map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-v">'+k[0]+'</div><div class="ov-kpi-d muted">'+k[1]+'</div></div>'; }).join('')+'</div>'; }

// ── Governance & SBC — KPIs + three tables in the portal's .twrap/.rt format (SAB prefers structure) ──
function nt(v){ return v===0 ? '—' : v.toLocaleString('en-US',{minimumFractionDigits:1, maximumFractionDigits:1}); }
function ntB(v){ return v===0 ? '—' : (v/1000).toLocaleString('en-US',{minimumFractionDigits:1, maximumFractionDigits:1}); }
function rtTable(cls, head, rows, foot){
  return '<div class="twrap own-wrap"><table class="rt own-tbl '+cls+'"><thead><tr>'+head.map(function(x){ return '<th>'+x+'</th>'; }).join('')+'</tr></thead><tbody>'+
    rows.map(function(r){ return '<tr>'+r.map(function(c){ return '<td>'+c+'</td>'; }).join('')+'</tr>'; }).join('')+
    (foot ? '<tr class="own-tot">'+foot.map(function(c){ return '<td>'+c+'</td>'; }).join('')+'</tr>' : '')+'</tbody></table></div>';
}
export function tsmGovBody(){
  var g=TSM_GOV, h='';
  h+='<p class="ov-lede"><b>How TSMC is governed and paid.</b> A board with an independent majority and a combined Chairman–CEO; pay that runs through a profit-sharing cash pool rather than stock.</p>';
  h+=kpis(g.kpis);
  h+='<div class="ov-sec-h mg-sec-gap">Executive pay, 2025 (NT$ million, accrued)</div>';
  h+=rtTable('own-pay', ['Executive','Salary','Bonus<br>(cash + profit sharing)','Stock awards','All other<br>(LTI, pension)','Total NT$M','Total US$M'],
    g.execPay.map(function(r){ return ['<b>'+esc(r[0])+'</b>', nt(r[1]), nt(r[2]), nt(r[3]), nt(r[4]), '<b>'+nt(r[5])+'</b>', '<b>$'+r[6].toFixed(1)+'</b>']; }),
    ['Total', nt(g.execPayTotal[1]), nt(g.execPayTotal[2]), nt(g.execPayTotal[3]), nt(g.execPayTotal[4]), nt(g.execPayTotal[5]), '$'+g.execPayTotal[6].toFixed(1)]);
  h+='<div class="ov-sec-h mg-sec-gap">Board committees</div>';
  h+=rtTable('own-com', ['Committee','Chair','Members','Composition','Meetings 2025'],
    g.committees.map(function(r){ return ['<b>'+esc(r[0])+'</b>', esc(r[1]), '<span class="own-role">'+esc(r[2])+'</span>', esc(r[3]), String(r[4])]; }));
  h+='<div class="ov-sec-h mg-sec-gap">Pay pool and capital returned (NT$ billion)</div>';
  h+=rtTable('own-pool', ['Year','Profit sharing<br>to employees','Share-based<br>payment expense','Compensation<br>to directors','Cash dividends<br>paid','Shares<br>repurchased'],
    g.pool.slice().reverse().map(function(r){ return ['<b>'+r[0]+'</b>', ntB(r[1]), ntB(r[2]), ntB(r[3]), ntB(r[4]), ntB(r[5])]; }));
  h+='<div class="ov-fynote">'+g.howPaid+'</div>';
  h+='<div class="ov-foot">'+g.foot+'</div>';
  return h;
}

// ── Track Record (sharkninja-mgmt.js snTrackBody, itself amzn.js amznTrackBody) — WITHOUT the rating colours
// (SAB): every card on the Summit accent, no verdict chip, no legend. Modal: data-detail="exec:<id>" (tsm.js).
export function tsmTrackBody(){
  var cards=(TSM_TRACK||[]).map(function(m){
    return '<div class="ov-clickable trk-card" data-detail="exec:'+esc(m.id)+'">'+
      '<div class="trk-n">'+esc(m.n)+'</div>'+
      '<div class="trk-r">'+esc(m.role)+' · at TSMC since '+esc(m.since)+'</div>'+
      '<div class="trk-t"><b class="trk-k">At TSMC:</b> '+m.at+'</div>'+
      '<div class="trk-t"><b class="trk-c">Context:</b> '+m.prior+'</div>'+
      '<div class="trk-more">Full track record ›</div></div>';
  }).join('');
  var h='<p class="ov-lede">The people running TSMC today, on <b>what they have actually built</b> — roles from the 20-F, outcomes from the reported numbers. <b>Tap a card</b> for the full history.</p>';
  h+='<div class="trk-grid">'+cards+'</div>';
  h+='<div class="ew-note"><b>The bench, in one line.</b> '+TSM_TRACK_BENCH+'</div>';
  h+='<div class="ov-foot">'+TSM_TRACK_FOOT+'</div>';
  return h;
}
export function tsmTrackPop(id){
  var m=(TSM_TRACK||[]).filter(function(x){ return x.id===id; })[0]; if(!m) return null;
  return { t:esc(m.n)+' <span class="trk-pop-r">'+esc(m.role)+'</span>', h:m.detail };
}
