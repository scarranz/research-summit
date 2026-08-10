// overviews/dis.js — Overview + Deep Dive for The Walt Disney Company (NYSE: DIS).
//
// Follows docs/OVERVIEW_CONVENTIONS.md: a hooked Overview (Key Facts + lede + 2x2 quad +
// progressive-disclosure collapsibles) and a Deep Dive spine focused on what the analyst asked
// to understand — segment top line & bottom line, the streaming margin inflection, how capex has
// translated into profit, an interactive map of parks/cruises/Disney+/expansions, and where
// future growth and margin come from. All data lives in dis-data.js (sourced from filings).

import { liveQuote } from '../api.js';
import {
  DIS_BRAND, DIS_BRAND2, SEG_ENT, SEG_SPT, SEG_EXP,
  DIS_FACTS, DIS_LEDE, DIS_QUAD, DIS_SEG_REV, DIS_GEO, DIS_SEG_DEFS,
  SEG_ANN_LABELS, SEG_ANN, SEG_Q_LABELS, SEG_Q,
  SVOD_LABELS, SVOD_OI, SVOD_MARGIN,
  CAPEX_LABELS, CAPEX_VALS, CAPEX_EXP_OI, CAPEX_CFO, CAPEX_IS_EST,
  DIS_PRODUCTS, DIS_TIMELINE, DIS_PEERS,
  DIS_MAP, DIS_MAP_LEGEND, DIS_DRIVERS, DIS_OV_SOURCES, DIS_DD_SOURCES
} from './dis-data.js';

// esc: escapes <>" but leaves & literal (per contract — never double-encode).
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var _co = null;
var _charts = {};
function destroy(id){ if(_charts[id]){ try{ _charts[id].destroy(); }catch(e){} _charts[id]=null; } }
function canBuild(cv){ return cv && typeof Chart !== 'undefined' && cv.offsetParent !== null; }

function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}
// $M -> compact ($1.2B / $340M); values already in $M.
function fmtM(v){ if(v==null) return '—'; var a=Math.abs(v); if(a>=1000) return '$'+(v/1000).toFixed(1)+'B'; return '$'+Math.round(v)+'M'; }
function fmtB(v){ if(v==null) return '—'; return '$'+Number(v).toFixed(1)+'B'; }
function fmtPct(v){ if(v==null) return '—'; return Number(v).toFixed(1)+'%'; }

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED STYLES (injected once per pane)
// ═══════════════════════════════════════════════════════════════════════════════
function styleBlock(){
  return '<style>'+
    '.stdkf{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--bdr);border-top:3px solid '+DIS_BRAND+';border-radius:12px;overflow:hidden;background:var(--w);margin:2px 0}'+
    '.stdkf-cell{padding:11px 13px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.stdkf-cell:nth-child(5n){border-right:none}.stdkf-cell:nth-child(n+6){border-bottom:none}'+
    '.stdkf-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:3px}'+
    '.stdkf-v{font-size:12px;font-weight:700;color:var(--navy);line-height:1.3}'+
    '@media(max-width:720px){.stdkf{grid-template-columns:repeat(2,1fr)}.stdkf-cell{border-right:none}}'+
    '.ov-lede{margin:16px 0 6px;font-size:13px;line-height:1.6;color:var(--navy)}'+
    '.q2{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--bdr);border-radius:12px;overflow:hidden;background:var(--w);margin:4px 0}'+
    '.q2-cell{padding:13px 15px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.q2-cell:nth-child(2n){border-right:none}.q2-cell:nth-child(n+3){border-bottom:none}'+
    '.q2-k{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:'+DIS_BRAND+';margin-bottom:5px}'+
    '.q2-v{font-size:12px;color:var(--navy);line-height:1.5}.q2-v b{font-weight:800}'+
    '@media(max-width:600px){.q2{grid-template-columns:1fr}.q2-cell{border-right:none}.q2-cell:nth-child(n+2){border-bottom:1px solid var(--bdr)}.q2-cell:last-child{border-bottom:none}}'+
    '.ov-collap{border:1px solid var(--bdr);border-radius:10px;margin:12px 0 0;overflow:hidden}'+
    '.ov-collap-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:8px}'+
    '.ov-collap-h:hover{background:#EEF2F6}.ov-collap-ic{font-size:10px;color:var(--mu)}.ov-collap-b{padding:12px 14px 6px}'+
    '.dmm-row{display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start}'+
    '.dmm-chart-wrap{flex:1 1 300px;min-width:280px}'+
    '.dmm-tog{display:inline-flex;gap:4px;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:3px;margin-bottom:10px}'+
    '.dmm-tog button{border:none;background:transparent;font:inherit;font-size:11.5px;font-weight:700;color:var(--mu);padding:5px 13px;border-radius:999px;cursor:pointer}'+
    '.dmm-tog button.active{background:'+DIS_BRAND+';color:#fff}'+
    '.dmm-legend{display:flex;flex-wrap:wrap;gap:12px;margin:8px 0 2px}'+
    '.dmm-lg{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--navy)}'+
    '.dmm-dot{width:11px;height:11px;border-radius:3px;flex:none}'+
    '.dmm-defs{flex:1 1 300px;min-width:280px}'+
    '.acc{border:1px solid var(--bdr);border-radius:9px;margin-top:6px;overflow:hidden;background:var(--w)}'+
    '.acc-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12px;font-weight:700;color:var(--navy);padding:9px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px}'+
    '.acc-h:hover{background:#EEF2F6}.acc-x{color:var(--mu);font-weight:800}.acc-b{padding:10px 12px}'+
    '.famd{font-size:12px;color:var(--navy);line-height:1.55}.famd b{font-weight:800}'+
    '.subrow{display:flex;flex-direction:column;gap:5px;margin-top:8px}'+
    '.subrow .sr{border:1px solid var(--bdr);border-radius:8px;padding:8px 10px;background:#FBFCFD}'+
    '.sr-t{font-size:11.5px;font-weight:800;color:var(--navy)}.sr-d{font-size:11px;color:var(--mu);line-height:1.45;margin-top:2px}'+
    '.stdp{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px}'+
    '.stdp-card{border:1px solid var(--bdr);border-radius:11px;padding:13px 14px;background:var(--w);cursor:pointer;transition:.14s}'+
    '.stdp-card:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px);border-color:'+DIS_BRAND+'}'+
    '.stdp-ic{font-size:26px;line-height:1}.stdp-n{font-size:13px;font-weight:800;color:var(--navy);margin:7px 0 3px}'+
    '.stdp-d{font-size:11px;color:var(--mu);line-height:1.45}.stdp-more{font-size:10px;font-weight:700;color:'+DIS_BRAND+';margin-top:6px}'+
    '.tl{position:relative;margin:4px 0 0;padding-left:20px}'+
    '.tl:before{content:"";position:absolute;left:5px;top:4px;bottom:4px;width:2px;background:var(--bdr)}'+
    '.tl-i{position:relative;padding:0 0 15px}'+
    '.tl-i:before{content:"";position:absolute;left:-18px;top:3px;width:9px;height:9px;border-radius:50%;background:'+DIS_BRAND+';border:2px solid var(--w);box-shadow:0 0 0 1px var(--bdr)}'+
    '.tl-y{font-size:10.5px;font-weight:800;color:'+DIS_BRAND+'}.tl-t{font-size:12.5px;font-weight:800;color:var(--navy);margin:1px 0 2px}'+
    '.tl-d{font-size:11.5px;color:var(--mu);line-height:1.5}'+
    '.tl-more{margin-top:5px;font-size:10.5px;font-weight:800;color:'+DIS_BRAND+';background:none;border:none;cursor:pointer;padding:0}'+
    '.tl-rm{margin:6px 0 0;padding-left:16px}.tl-rm li{font-size:11px;color:var(--navy);line-height:1.5;margin-bottom:3px}'+
    '.ov-foot{font-size:10px;color:var(--mu);line-height:1.5;margin:16px 0 4px;padding-top:10px;border-top:1px solid var(--bdr)}'+
    '.ov-clickable{cursor:pointer}'+
    // deep-dive spine
    '.dd-tabs{display:flex;flex-wrap:wrap;gap:4px;margin:0 0 16px;border-bottom:1px solid var(--bdr)}'+
    '.dd-tab{border:none;background:transparent;font:inherit;font-size:12.5px;font-weight:700;color:var(--mu);padding:9px 14px;cursor:pointer;border-bottom:2.5px solid transparent;margin-bottom:-1px}'+
    '.dd-tab:hover{color:var(--navy)}.dd-tab.active{color:'+DIS_BRAND+';border-bottom-color:'+DIS_BRAND+'}'+
    '.dd-pane[hidden]{display:none}'+
    '.dd-h{font-size:14px;font-weight:800;color:var(--navy);margin:4px 0 2px}'+
    '.dd-sub{font-size:11.5px;color:var(--mu);line-height:1.55;margin:0 0 12px}'+
    '.dd-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:9px;margin:2px 0 16px}'+
    '.dd-kpi{border:1px solid var(--bdr);border-top:3px solid '+DIS_BRAND+';border-radius:10px;padding:10px 12px;background:var(--w);text-align:center}'+
    '.dd-kpi-v{font-size:16px;font-weight:800;color:var(--navy);line-height:1.15}.dd-kpi-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--mu);margin-top:3px}'+
    '.dd-2col{display:grid;grid-template-columns:1fr 1fr;gap:16px}@media(max-width:760px){.dd-2col{grid-template-columns:1fr}}'+
    '.dd-cardt{font-size:12px;font-weight:800;color:var(--navy);margin:0 0 6px}'+
    '.dd-chart{height:260px;position:relative}'+
    '.dd-note{font-size:10.5px;color:var(--mu);line-height:1.5;margin:8px 0 0}'+
    '.dd-callout{border:1px solid var(--bdr);border-left:4px solid '+DIS_BRAND+';border-radius:10px;padding:11px 14px;background:#F7F9FB;font-size:12px;line-height:1.55;color:var(--navy);margin:12px 0}'+
    '.drv{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:11px}'+
    '.drv-c{border:1px solid var(--bdr);border-radius:12px;padding:14px 15px;background:var(--w)}'+
    '.drv-h{display:flex;align-items:center;gap:9px;margin-bottom:6px}.drv-ic{font-size:21px}'+
    '.drv-t{font-size:13px;font-weight:800;color:var(--navy)}.drv-tag{font-size:9px;font-weight:800;color:'+DIS_BRAND+';background:var(--brand-soft);border-radius:20px;padding:2px 9px;margin-left:auto;white-space:nowrap}'+
    '.drv-d{font-size:11.5px;color:var(--navy);line-height:1.5}.drv-pts{margin:8px 0 0;padding-left:16px}.drv-pts li{font-size:11px;color:var(--mu);line-height:1.5;margin-bottom:3px}'+
    // interactive explorer (map)
    '.dmap-legend{display:flex;flex-wrap:wrap;gap:14px;margin:2px 0 12px}'+
    '.dmap-lg{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--navy)}'+
    '.dmap-sd{width:9px;height:9px;border-radius:50%;flex:none}'+
    '.dmap-sd.open{background:#2FA36B}.dmap-sd.launch{background:#E3A73A}.dmap-sd.planned{background:#8A93A0}'+
    '.dmap-cats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:9px;margin-bottom:14px}'+
    '.dmap-cat{border:1px solid var(--bdr);border-radius:11px;padding:12px 13px;background:var(--w);cursor:pointer;text-align:left;transition:.13s;border-top:3px solid var(--accent,#ccc)}'+
    '.dmap-cat:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px)}'+
    '.dmap-cat.active{background:var(--brand-soft);border-color:'+DIS_BRAND+'}'+
    '.dmap-cat-ic{font-size:22px;line-height:1}.dmap-cat-n{font-size:12.5px;font-weight:800;color:var(--navy);margin:6px 0 2px}'+
    '.dmap-cat-t{font-size:10.5px;color:var(--mu);line-height:1.4}'+
    '.dmap-body{display:grid;grid-template-columns:1.1fr 1fr;gap:14px}@media(max-width:760px){.dmap-body{grid-template-columns:1fr}}'+
    '.dmap-items{display:flex;flex-direction:column;gap:7px}'+
    '.dmap-item{border:1px solid var(--bdr);border-radius:9px;padding:9px 12px;background:var(--w);cursor:pointer;text-align:left;transition:.12s;display:flex;align-items:center;gap:9px}'+
    '.dmap-item:hover{border-color:'+DIS_BRAND+';background:#FBFCFD}.dmap-item.active{border-color:'+DIS_BRAND+';background:var(--brand-soft)}'+
    '.dmap-item-n{font-size:12px;font-weight:800;color:var(--navy)}.dmap-item-w{font-size:10.5px;color:var(--mu);margin-top:1px}'+
    '.dmap-item-body{flex:1}'+
    '.dmap-panel{border:1px solid var(--bdr);border-radius:11px;padding:15px 16px;background:#FBFCFD;align-self:start;position:sticky;top:8px}'+
    '.dmap-p-h{font-size:14px;font-weight:800;color:var(--navy)}.dmap-p-w{font-size:11px;color:var(--mu);margin:2px 0 8px}'+
    '.dmap-p-d{font-size:12px;color:var(--navy);line-height:1.6}'+
    '.dmap-tags{display:flex;flex-wrap:wrap;gap:5px;margin:8px 0 0}'+
    '.dmap-tag{font-size:9.5px;font-weight:800;color:'+DIS_BRAND+';background:var(--brand-soft);border-radius:20px;padding:2px 9px}'+
    '.dmap-intro{font-size:11.5px;color:var(--mu);line-height:1.55;margin-bottom:10px}'+
    // modal
    '.dis-modal-back{position:fixed;inset:0;background:rgba(15,23,42,.5);display:flex;align-items:center;justify-content:center;z-index:1000;opacity:0;transition:opacity .16s;padding:20px}'+
    '.dis-modal-back.on{opacity:1}.dis-modal-back[hidden]{display:none}'+
    '.dis-modal{background:var(--w);border-radius:14px;max-width:560px;width:100%;max-height:82vh;overflow:auto;padding:20px 22px;box-shadow:0 20px 60px rgba(0,0,0,.3)}'+
    '.dis-modal-t{font-size:16px;font-weight:800;color:var(--navy);margin:0 0 12px;display:flex;align-items:center;gap:9px}'+
    '.dis-modal-x{margin-left:auto;background:none;border:none;font-size:20px;color:var(--mu);cursor:pointer;line-height:1}'+
    '</style>';
}

// ═══════════════════════════════════════════════════════════════════════════════
// OVERVIEW — the 7 blocks
// ═══════════════════════════════════════════════════════════════════════════════
function keyFacts(){
  return '<div class="stdkf">'+DIS_FACTS.map(function(f){
    var v = f[1]==='live' ? '<span data-mcap>~$205B · 2026</span>' : esc(f[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(f[0])+'</div><div class="stdkf-v">'+v+'</div></div>';
  }).join('')+'</div>';
}
function fourQuad(){
  return '<div class="q2">'+DIS_QUAD.map(function(q){
    return '<div class="q2-cell"><div class="q2-k">'+esc(q[0])+'</div><div class="q2-v">'+q[1]+'</div></div>';
  }).join('')+'</div>';
}
// How it makes money — segments <-> geography toggle + segment definitions.
function moneyMap(){
  function bars(rows, key){
    return '<div class="dmm-bars" data-mmview="'+key+'"'+(key==='geo'?' hidden':'')+'>'+rows.map(function(r){
      return '<div style="margin:7px 0"><div style="display:flex;justify-content:space-between;font-size:11.5px;margin-bottom:3px"><span style="font-weight:800;color:var(--navy)">'+esc(r[0])+'</span><span style="font-weight:800;color:var(--mu)">'+esc(r[2])+' · '+esc(r[3])+'</span></div>'+
        '<div style="background:#F2F5F8;border-radius:6px;height:14px;overflow:hidden"><div style="height:100%;width:'+r[1]+'%;background:'+r[4]+'"></div></div></div>';
    }).join('')+'</div>';
  }
  var defs = '<div class="dmm-defs">'+DIS_SEG_DEFS.map(function(d){
    var subs = d.subs.map(function(s){ return '<div class="sr"><div class="sr-t">'+esc(s[0])+'</div><div class="sr-d">'+esc(s[1])+'</div></div>'; }).join('');
    return '<div class="acc"><button type="button" class="acc-h">What is '+esc(d.seg)+'?<span class="acc-x">+</span></button>'+
      '<div class="acc-b" hidden><div class="famd">'+d.desc+'</div><div class="subrow">'+subs+'</div></div></div>';
  }).join('')+'</div>';
  return '<div class="dmm-row">'+
    '<div class="dmm-chart-wrap">'+
      '<div class="dmm-tog" data-mmtog><button type="button" class="active" data-mm="seg">Segments</button><button type="button" data-mm="geo">Geography</button></div>'+
      bars(DIS_SEG_REV,'seg')+bars(DIS_GEO,'geo')+
      '<div class="dd-note">FY2025 revenue, two views of the same ~$94B total. Segment figures gross before -$1.9B of eliminations; geography is approximate by source region.</div>'+
    '</div>'+
    defs+
  '</div>';
}
function products(){
  return '<div class="stdp">'+DIS_PRODUCTS.map(function(f,i){
    return '<div class="stdp-card ov-clickable" data-prod="'+i+'"><div class="stdp-ic">'+f.ic+'</div>'+
      '<div class="stdp-n">'+esc(f.fam)+'</div><div class="stdp-d">'+esc(f.d)+'</div><div class="stdp-more">See products ›</div></div>';
  }).join('')+'</div>';
}
function peerScatter(){
  return '<div><div class="dmm-tog" data-sctog>'+
      '<button type="button" class="active" data-sc="ev">EV/EBITDA</button><button type="button" data-sc="pe">P/E</button>'+
      '<span style="width:8px"></span>'+
      '<button type="button" class="active" data-scb="fwd">Forward</button><button type="button" data-scb="ttm">Trailing</button>'+
    '</div>'+
    '<div class="dd-chart" style="height:320px"><canvas id="disScatter"></canvas></div>'+
    '<div class="dd-note">Bubble size = market cap. Multiples & growth are seeded approximations (mid-2026), directional — not live quotes. Unlisted rivals (e.g. NBCUniversal) and private streamers are not plotted. Peer-set is fixed in this draft (add/remove-by-ticker is a planned enhancement).</div></div>';
}
function timeline(){
  return '<div class="tl">'+DIS_TIMELINE.map(function(t,i){
    var rm = t[3] ? '<button type="button" class="tl-more" data-tlrm="'+i+'">Read more ›</button><ul class="tl-rm" data-tlbody="'+i+'" hidden>'+t[3].map(function(b){ return '<li>'+esc(b)+'</li>'; }).join('')+'</ul>' : '';
    return '<div class="tl-i"><div class="tl-y">'+esc(t[0])+'</div><div class="tl-t">'+esc(t[1])+'</div><div class="tl-d">'+esc(t[2])+'</div>'+rm+'</div>';
  }).join('')+'</div>';
}

function html(c){
  _co = c;
  var h = '<div class="ov ov-dis" data-brand="DIS" style="--brand:'+DIS_BRAND+';--brand-soft:#EAF0FF">';
  h += styleBlock();
  h += keyFacts();
  h += '<p class="ov-lede">'+esc(DIS_LEDE)+'</p>';
  h += fourQuad();
  h += collapsible('How Disney makes money — the three segments', moneyMap(), false);
  h += collapsible('Products & brands', products(), false);
  h += collapsible('Competitors — the peer map', peerScatter(), false);
  h += collapsible('Timeline — how it became today’s Disney', timeline(), false);
  h += '<div class="ov-foot">'+esc(DIS_OV_SOURCES)+'</div>';
  h += modalMarkup();
  h += '</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEEP DIVE — the interactive analysis
// ═══════════════════════════════════════════════════════════════════════════════
function ddKpis(){
  var k = [
    ['$94.4B', 'FY2025 revenue'],
    ['$17.6B', 'Segment op. income'],
    ['~13%', 'SVOD margin (Q3’26)'],
    ['~12%', 'FY26E adj. EPS growth'],
    ['≥$9B', 'FY26 buyback'],
  ];
  return '<div class="dd-kpis">'+k.map(function(x){ return '<div class="dd-kpi"><div class="dd-kpi-v">'+esc(x[0])+'</div><div class="dd-kpi-k">'+esc(x[1])+'</div></div>'; }).join('')+'</div>';
}
function paneSegments(){
  return '<div class="dd-pane" data-dd="segments">'+
    '<div class="dd-h">Top line & bottom line by segment</div>'+
    '<p class="dd-sub">Revenue (top line) and operating income (bottom line) for the three segments. Experiences is the profit ballast; Entertainment’s profit is inflecting on streaming; Sports is squeezed by rising rights costs.</p>'+
    '<div class="dmm-tog" data-segtog><button type="button" class="active" data-seg="ann">Annual (FY24–FY25)</button><button type="button" data-seg="q">Quarterly (FY26)</button></div>'+
    '<div class="dmm-legend">'+
      '<span class="dmm-lg"><span class="dmm-dot" style="background:'+SEG_ENT+'"></span>Entertainment</span>'+
      '<span class="dmm-lg"><span class="dmm-dot" style="background:'+SEG_SPT+'"></span>Sports</span>'+
      '<span class="dmm-lg"><span class="dmm-dot" style="background:'+SEG_EXP+'"></span>Experiences</span>'+
    '</div>'+
    '<div class="dd-2col">'+
      '<div><div class="dd-cardt">Revenue — top line</div><div class="dd-chart"><canvas id="disSegRev"></canvas></div></div>'+
      '<div><div class="dd-cardt">Operating income — bottom line</div><div class="dd-chart"><canvas id="disSegOi"></canvas></div></div>'+
    '</div>'+
    '<div class="dd-callout"><b>The read:</b> Experiences earns the most profit on the least revenue — the highest-margin pool. Entertainment carries the most revenue but thin profit until streaming scales. Sports revenue is steady but operating income fell through FY2026 as NFL/NBA rights costs stepped up.</div>'+
  '</div>';
}
function paneStreaming(){
  return '<div class="dd-pane" data-dd="streaming" hidden>'+
    '<div class="dd-h">The streaming inflection</div>'+
    '<p class="dd-sub">Entertainment SVOD (Disney+ and Hulu) operating income and margin, quarter by quarter. This is the single most important profitability story in the company — from a ~$4B annual loss three years ago to double-digit margins.</p>'+
    '<div class="dd-2col">'+
      '<div><div class="dd-cardt">SVOD operating income ($M) & margin (%)</div><div class="dd-chart" style="height:300px"><canvas id="disSvod"></canvas></div></div>'+
      '<div><div class="dd-cardt">Why it matters</div>'+
        '<div class="drv-d" style="font-size:12px;line-height:1.6">Streaming margin roughly doubled from ~5% to ~13% in six quarters. Management wants to keep taking margin “in chunks, not basis points.” On ~$20B+ of streaming revenue, each margin point is real profit — and the lever is retention (one Disney+/Hulu app, bundling) plus pricing, not cost-cutting.</div>'+
        '<ul class="drv-pts" style="margin-top:10px"><li>FY2025 SVOD operating income: ~$1.3B (from a ~$4B loss in FY2022)</li><li>Q3 FY2026 SVOD margin: 12.9%</li><li>Bundled subscribers churn materially less</li><li>ESPN DTC + Trio bundle extend the model to sports</li></ul>'+
      '</div>'+
    '</div>'+
    '<div class="dd-callout"><b>Benchmark:</b> management notes that at a comparable revenue scale, Disney’s streaming margins now look similar to where Netflix was — the profitability gap is closing.</div>'+
  '</div>';
}
function paneCapex(){
  return '<div class="dd-pane" data-dd="capex" hidden>'+
    '<div class="dd-h">Capex → the profit it funds</div>'+
    '<p class="dd-sub">How the capital Disney is spending flows into the Experiences profit pool. Capex stepped up from ~$5.4B (FY24) to ~$8.0B (FY25), with ~$9B guided for FY26 — the front end of a roughly $60B, decade-long parks-and-cruise investment cycle.</p>'+
    '<div class="dd-2col">'+
      '<div><div class="dd-cardt">Capex vs Experiences operating income ($B)</div><div class="dd-chart" style="height:300px"><canvas id="disCapex"></canvas></div></div>'+
      '<div><div class="dd-cardt">The investment logic</div>'+
        '<div class="drv-d" style="font-size:12px;line-height:1.6">Experiences is the highest-return part of Disney, so management is pushing capital into it: new cruise ships (8 → 13 by 2031), new lands (Villains Land, Avengers Campus, Paris), and capital-light international deals (Abu Dhabi, Tokyo) that earn royalties with no Disney capital. Returns on this investment have risen over time, and new capacity opens with pre-opening costs that then ramp into profit.</div>'+
        '<ul class="drv-pts" style="margin-top:10px"><li>FY2025 capex: ~$8.0B (up from ~$5.4B in FY24)</li><li>FY2026E capex: ~$9B (company guidance)</li><li>Experiences OI: ~$9.3B → ~$10.0B (FY24 → FY25)</li><li>Cruise capacity expanding ~40% into 2031</li></ul>'+
      '</div>'+
    '</div>'+
    '<div class="dd-note">FY2026 capex is company guidance. Cruise-fleet and expansion dates and the ~$60B/10-year figure are management framing from earnings calls, not a hard 10-K commitment.</div>'+
  '</div>';
}
function paneMap(){
  var legend = '<div class="dmap-legend">'+DIS_MAP_LEGEND.map(function(l){ return '<span class="dmap-lg"><span class="dmap-sd '+l[0]+'"></span>'+esc(l[1])+'</span>'; }).join('')+'</div>';
  var cats = '<div class="dmap-cats">'+DIS_MAP.map(function(cat,i){
    return '<button type="button" class="dmap-cat'+(i===0?' active':'')+'" data-cat="'+i+'" style="--accent:'+cat.accent+'">'+
      '<div class="dmap-cat-ic">'+cat.ic+'</div><div class="dmap-cat-n">'+esc(cat.name)+'</div><div class="dmap-cat-t">'+esc(cat.tag)+'</div></button>';
  }).join('')+'</div>';
  return '<div class="dd-pane" data-dd="map" hidden>'+
    '<div class="dd-h">The interactive map — parks, cruises, Disney+ & the expansion pipeline</div>'+
    '<p class="dd-sub">Click a category, then any item, to see what it is and where it fits. This is where the Experiences and streaming growth is being built.</p>'+
    legend + cats +
    '<div class="dmap-shell" data-cat-sel="0">'+
      '<div class="dmap-intro" data-dmap-intro></div>'+
      '<div class="dmap-body"><div class="dmap-items" data-dmap-items></div><div class="dmap-panel" data-dmap-panel></div></div>'+
    '</div>'+
  '</div>';
}
function paneGrowth(){
  var cards = '<div class="drv">'+DIS_DRIVERS.map(function(d){
    var pts = d.pts.map(function(p){ return '<li>'+esc(p)+'</li>'; }).join('');
    return '<div class="drv-c"><div class="drv-h"><span class="drv-ic">'+d.ic+'</span><span class="drv-t">'+esc(d.t)+'</span><span class="drv-tag">'+esc(d.tag)+'</span></div>'+
      '<div class="drv-d">'+esc(d.d)+'</div><ul class="drv-pts">'+pts+'</ul></div>';
  }).join('')+'</div>';
  return '<div class="dd-pane" data-dd="growth" hidden>'+
    '<div class="dd-h">Where growth & margin come from next</div>'+
    '<p class="dd-sub">Four levers drive the forward story — and they compound: streaming margin, funded Experiences growth, sports monetization, and capital return.</p>'+
    cards +
    '<div class="dd-callout"><b>Putting it together:</b> streaming margin expansion + Experiences capex returns + ESPN’s DTC ramp feed operating income, while a ramped buyback (to ≥$9B) converts that into ~12% adjusted EPS growth in FY2026 and double digits guided for FY2027.</div>'+
  '</div>';
}
function deepDiveHtml(c){
  _co = c;
  var h = '<div class="ov ov-dis ov-dis-dd" data-brand="DIS" style="--brand:'+DIS_BRAND+';--brand-soft:#EAF0FF">';
  h += styleBlock();
  h += ddKpis();
  h += '<div class="dd-tabs">'+
    '<button type="button" class="dd-tab active" data-dd="segments">Segments</button>'+
    '<button type="button" class="dd-tab" data-dd="streaming">Streaming</button>'+
    '<button type="button" class="dd-tab" data-dd="capex">Capex</button>'+
    '<button type="button" class="dd-tab" data-dd="map">Expansion Map</button>'+
    '<button type="button" class="dd-tab" data-dd="growth">Growth & Margins</button>'+
  '</div>';
  h += paneSegments() + paneStreaming() + paneCapex() + paneMap() + paneGrowth();
  h += '<div class="ov-foot">'+esc(DIS_DD_SOURCES)+'</div>';
  h += '</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHARTS
// ═══════════════════════════════════════════════════════════════════════════════
function groupedBars(id, labels, series, fmt){
  var cv = document.getElementById(id); if(!canBuild(cv)) return; destroy(id);
  _charts[id] = new Chart(cv.getContext('2d'), {
    type:'bar',
    data:{ labels:labels, datasets:series.map(function(s){ return { label:s.label, data:s.data, backgroundColor:s.color, borderRadius:3, maxBarThickness:34 }; }) },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:14, bottom:2 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+fmt(ctx.parsed.y); } } } },
      scales:{ y:{ display:false, grace:'16%' }, x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } }
  });
}
function buildSegCharts(root){
  var mode = (root.querySelector('[data-segtog] button.active')||{}).getAttribute ? root.querySelector('[data-segtog] button.active').getAttribute('data-seg') : 'ann';
  var labels = mode==='q' ? SEG_Q_LABELS : SEG_ANN_LABELS;
  var rev = mode==='q' ? SEG_Q.rev : SEG_ANN.rev;
  var oi  = mode==='q' ? SEG_Q.oi  : SEG_ANN.oi;
  groupedBars('disSegRev', labels, [
    { label:'Entertainment', data:rev.Entertainment, color:SEG_ENT },
    { label:'Sports', data:rev.Sports, color:SEG_SPT },
    { label:'Experiences', data:rev.Experiences, color:SEG_EXP },
  ], fmtM);
  groupedBars('disSegOi', labels, [
    { label:'Entertainment', data:oi.Entertainment, color:SEG_ENT },
    { label:'Sports', data:oi.Sports, color:SEG_SPT },
    { label:'Experiences', data:oi.Experiences, color:SEG_EXP },
  ], fmtM);
}
function buildSvod(){
  var id='disSvod', cv=document.getElementById(id); if(!canBuild(cv)) return; destroy(id);
  _charts[id]=new Chart(cv.getContext('2d'),{
    type:'bar',
    data:{ labels:SVOD_LABELS, datasets:[
      { type:'bar', label:'SVOD operating income', data:SVOD_OI, backgroundColor:DIS_BRAND, borderRadius:3, maxBarThickness:30, yAxisID:'y' },
      { type:'line', label:'SVOD operating margin', data:SVOD_MARGIN, borderColor:SEG_EXP, backgroundColor:SEG_EXP, borderWidth:2.5, tension:.25, pointRadius:3, pointBackgroundColor:'#fff', pointBorderColor:SEG_EXP, pointBorderWidth:2, yAxisID:'y1' },
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:14 } },
      plugins:{ legend:{ display:true, position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+(ctx.datasetIndex===0?fmtM(ctx.parsed.y):fmtPct(ctx.parsed.y)); } } } },
      scales:{ x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:10.5 } } },
        y:{ position:'left', grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return '$'+v+'M'; } } },
        y1:{ position:'right', grid:{ display:false }, min:0, ticks:{ color:SEG_EXP, font:{ size:10 }, callback:function(v){ return v+'%'; } } } } }
  });
}
function buildCapex(){
  var id='disCapex', cv=document.getElementById(id); if(!canBuild(cv)) return; destroy(id);
  _charts[id]=new Chart(cv.getContext('2d'),{
    type:'bar',
    data:{ labels:CAPEX_LABELS, datasets:[
      { type:'bar', label:'Capex', data:CAPEX_VALS, backgroundColor:CAPEX_LABELS.map(function(l,i){ return CAPEX_IS_EST[i]?'#9BB0E8':DIS_BRAND; }), borderRadius:3, maxBarThickness:46, yAxisID:'y' },
      { type:'line', label:'Experiences operating income', data:CAPEX_EXP_OI, borderColor:SEG_EXP, backgroundColor:SEG_EXP, borderWidth:2.5, tension:.2, pointRadius:4, pointBackgroundColor:'#fff', pointBorderColor:SEG_EXP, pointBorderWidth:2, spanGaps:true, yAxisID:'y' },
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:14 } },
      plugins:{ legend:{ display:true, position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
        tooltip:{ callbacks:{ label:function(ctx){ if(ctx.parsed.y==null) return ctx.dataset.label+': n/a'; return ctx.dataset.label+': '+fmtB(ctx.parsed.y)+(CAPEX_IS_EST[ctx.dataIndex]&&ctx.datasetIndex===0?' (guide)':''); } } } },
      scales:{ x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } },
        y:{ grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return '$'+v+'B'; } } } } }
  });
}
function buildScatter(root){
  var id='disScatter', cv=document.getElementById(id); if(!canBuild(cv)) return; destroy(id);
  var mMode = (root.querySelector('[data-sctog] button[data-sc].active')||{}).getAttribute ? root.querySelector('[data-sctog] button[data-sc].active').getAttribute('data-sc') : 'ev';
  var bMode = (root.querySelector('[data-sctog] button[data-scb].active')||{}).getAttribute ? root.querySelector('[data-sctog] button[data-scb].active').getAttribute('data-scb') : 'fwd';
  var pts = DIS_PEERS.map(function(p){
    var mult = mMode==='pe' ? (bMode==='fwd'?p.peF:p.pe) : (bMode==='fwd'?p.evF:p.ev);
    var g = bMode==='fwd'?p.gF:p.g;
    if(mult==null) return null;
    return { x:mult, y:g, r:p.self?13:9, tk:p.tk, name:p.name, self:!!p.self };
  }).filter(Boolean);
  _charts[id]=new Chart(cv.getContext('2d'),{
    type:'bubble',
    data:{ datasets:[{ data:pts, backgroundColor:pts.map(function(p){ return p.self?DIS_BRAND:'rgba(59,111,224,.35)'; }), borderColor:pts.map(function(p){ return p.self?DIS_BRAND:DIS_BRAND2; }), borderWidth:1.5 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){ var d=ctx.raw; return d.name+' ('+d.tk+'): '+d.x.toFixed(1)+'x · '+d.y+'% growth'; } } },
        datalabels:false },
      scales:{
        x:{ title:{ display:true, text:'cheaper ←   '+(mMode==='pe'?'P/E':'EV/EBITDA')+'   → more expensive', color:'#8A93A0', font:{ size:10.5 } }, grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 } } },
        y:{ title:{ display:true, text:'slow ←   revenue growth   → fast', color:'#8A93A0', font:{ size:10.5 } }, grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return v+'%'; } } } } },
    plugins:[{ id:'disScatterLabels', afterDatasetsDraw:function(ch){ var ctx=ch.ctx; ctx.save(); ctx.font='700 10px Inter, sans-serif'; ctx.fillStyle='#334155'; ctx.textAlign='center'; ch.getDatasetMeta(0).data.forEach(function(el,i){ var d=pts[i]; ctx.fillText(d.tk, el.x, el.y-el.options.radius-3); }); ctx.restore(); } }]
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTIVE MAP (explorer)
// ═══════════════════════════════════════════════════════════════════════════════
function sdClass(s){ return s==='open'?'open':(s==='launch'?'launch':'planned'); }
function renderMap(shell, catIdx, itemIdx){
  var cat = DIS_MAP[catIdx]; if(!cat) return;
  shell.setAttribute('data-cat-sel', catIdx);
  var intro = shell.querySelector('[data-dmap-intro]');
  var itemsWrap = shell.querySelector('[data-dmap-items]');
  var panel = shell.querySelector('[data-dmap-panel]');
  if(intro) intro.innerHTML = esc(cat.desc);
  if(itemsWrap) itemsWrap.innerHTML = cat.items.map(function(it,i){
    return '<button type="button" class="dmap-item'+(i===itemIdx?' active':'')+'" data-item="'+i+'">'+
      '<span class="dmap-sd '+sdClass(it.status)+'"></span>'+
      '<span class="dmap-item-body"><span class="dmap-item-n">'+esc(it.name)+'</span><span class="dmap-item-w">'+esc(it.where)+'</span></span></button>';
  }).join('');
  var it = cat.items[itemIdx] || cat.items[0];
  if(panel && it){
    var tags = (it.tags||[]).map(function(t){ return '<span class="dmap-tag">'+esc(t)+'</span>'; }).join('');
    panel.innerHTML = '<div class="dmap-p-h">'+esc(it.name)+'</div><div class="dmap-p-w">'+cat.ic+' '+esc(it.where)+'</div>'+
      '<div class="dmap-tags">'+tags+'</div><p class="dmap-p-d" style="margin-top:9px">'+esc(it.detail)+'</p>';
  }
}
function wireMap(root){
  var shell = root.querySelector('.dmap-shell'); if(!shell || shell._wired) { if(shell) renderMap(shell, parseInt(shell.getAttribute('data-cat-sel')||'0',10), 0); return; }
  shell._wired = true;
  root.querySelectorAll('.dmap-cat').forEach(function(btn){
    btn.addEventListener('click', function(){
      root.querySelectorAll('.dmap-cat').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      renderMap(shell, parseInt(btn.getAttribute('data-cat'),10), 0);
    });
  });
  shell.addEventListener('click', function(e){
    var it = e.target.closest('.dmap-item'); if(!it) return;
    var catIdx = parseInt(shell.getAttribute('data-cat-sel')||'0',10);
    renderMap(shell, catIdx, parseInt(it.getAttribute('data-item'),10));
  });
  renderMap(shell, 0, 0);
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODAL (product pop-ups) — hoisted to #co-detailview so it shows from either tab
// ═══════════════════════════════════════════════════════════════════════════════
function modalMarkup(){
  return '<div class="dis-modal-back" data-dis-modal hidden><div class="dis-modal"><div class="dis-modal-t"><span data-dis-modal-t></span><button type="button" class="dis-modal-x" data-dis-modal-x>×</button></div><div data-dis-modal-b></div></div></div>';
}
function openModal(title, body){
  var back = document.querySelector('.dis-modal-back'); if(!back) return;
  back.querySelector('[data-dis-modal-t]').innerHTML = title;
  back.querySelector('[data-dis-modal-b]').innerHTML = body;
  back.hidden = false;
  requestAnimationFrame(function(){ back.classList.add('on'); });
}
function closeModal(){ var back=document.querySelector('.dis-modal-back'); if(!back) return; back.classList.remove('on'); setTimeout(function(){ back.hidden=true; }, 160); }
function wireModal(root){
  var back = root.querySelector('.dis-modal-back'); if(!back) return;
  // hoist to shared ancestor so it is not hidden with an inactive pane; drop any stale modal
  // left behind from a previously-opened company.
  var host = document.getElementById('co-detailview');
  if(host){
    host.querySelectorAll(':scope > .dis-modal-back').forEach(function(el){ if(el!==back) el.remove(); });
    if(back.parentNode !== host){ host.appendChild(back); }
  }
  back.addEventListener('click', function(e){ if(e.target===back || e.target.closest('[data-dis-modal-x]')) closeModal(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });
}
function productModal(i){
  var f = DIS_PRODUCTS[i]; if(!f) return;
  var body = '<div class="famd" style="margin-bottom:8px">'+esc(f.d)+'</div><div class="subrow">'+f.items.map(function(it){
    return '<div class="sr"><div class="sr-t">'+esc(it[0])+'</div><div class="sr-d">'+esc(it[1])+'</div></div>';
  }).join('')+'</div>';
  openModal(f.ic+' '+esc(f.fam), body);
}

// ═══════════════════════════════════════════════════════════════════════════════
// WIRING
// ═══════════════════════════════════════════════════════════════════════════════
function wireToggle(root, sel, cb){
  var grp = root.querySelector(sel); if(!grp) return;
  grp.querySelectorAll('button').forEach(function(btn){
    btn.addEventListener('click', function(){
      // toggle within the same attribute family (buttons sharing the clicked button's data key)
      var keys = Object.keys(btn.dataset);
      var famAttr = keys[0];
      grp.querySelectorAll('button['+ (famAttr?('data-'+famAttr):'') +']').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      cb();
    });
  });
}
function wireCollapsibles(root){
  root.querySelectorAll('.ov-collap-h').forEach(function(btn){
    if(btn._wired) return; btn._wired=true;
    btn.addEventListener('click', function(){
      var c=btn.parentElement; var open=c.classList.toggle('open');
      var b=c.querySelector('.ov-collap-b'); if(b) b.hidden=!open;
      var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent=open?'▾':'▸';
      // build the scatter lazily when its section first opens
      if(open && c.querySelector('#disScatter')) requestAnimationFrame(function(){ buildScatter(root); });
    });
  });
}
function wireAccordions(root){
  root.querySelectorAll('.acc-h').forEach(function(btn){
    if(btn._wired) return; btn._wired=true;
    btn.addEventListener('click', function(){
      var b=btn.nextElementSibling; if(!b) return; var hid=b.hidden; b.hidden=!hid;
      var x=btn.querySelector('.acc-x'); if(x) x.textContent=hid?'−':'+';
    });
  });
}

function init(c){
  if(c) _co=c;
  var root = document.querySelector('.copane[data-pane="overview"] .ov-dis:not(.ov-dis-dd)') || document.querySelector('.ov-dis:not(.ov-dis-dd)');
  if(!root) return;
  if(root._wired) return;   // idempotent: companies.js re-inits on every tab switch
  root._wired = true;
  wireCollapsibles(root);
  wireAccordions(root);
  wireModal(root);
  // money map seg/geo toggle
  wireToggle(root, '[data-mmtog]', function(){
    var v = root.querySelector('[data-mmtog] button.active').getAttribute('data-mm');
    root.querySelectorAll('[data-mmview]').forEach(function(el){ el.hidden = el.getAttribute('data-mmview')!==v; });
  });
  // scatter multiple/basis toggles -> rebuild
  wireToggle(root, '[data-sctog]', function(){ buildScatter(root); });
  // product cards -> modal
  root.querySelectorAll('[data-prod]').forEach(function(card){
    if(card._wired) return; card._wired=true;
    card.addEventListener('click', function(){ productModal(parseInt(card.getAttribute('data-prod'),10)); });
  });
  // timeline read-more
  root.querySelectorAll('[data-tlrm]').forEach(function(btn){
    if(btn._wired) return; btn._wired=true;
    btn.addEventListener('click', function(){
      var i=btn.getAttribute('data-tlrm'); var body=root.querySelector('[data-tlbody="'+i+'"]');
      if(body){ var hid=body.hidden; body.hidden=!hid; btn.textContent=hid?'Read less ›':'Read more ›'; }
    });
  });
  // live market cap into Key Facts
  fillMarketCap(root);
}

function fillMarketCap(root){
  try{
    var r = liveQuote('DIS');
    if(r && typeof r.then==='function'){
      r.then(function(res){
        var q = res && (res.data||res); if(!q) return;
        var mc = q.marketCap; if(mc==null) return;
        var cell = root.querySelector('[data-mcap]'); if(cell) cell.textContent = '$'+(mc/1e9).toFixed(0)+'B · live';
      }).catch(function(){});
    }
  }catch(e){}
}

// ─── Deep Dive wiring ───────────────────────────────────────────────────────────
function buildDD(root, key){
  if(key==='segments') requestAnimationFrame(function(){ buildSegCharts(root); });
  else if(key==='streaming') requestAnimationFrame(buildSvod);
  else if(key==='capex') requestAnimationFrame(buildCapex);
  else if(key==='map') requestAnimationFrame(function(){ wireMap(root); });
}
function deepDiveInit(c){
  if(c) _co=c;
  var root = document.querySelector('.copane[data-pane="deepdive"] .ov-dis-dd') || document.querySelector('.ov-dis-dd');
  if(!root) return;
  if(!root._wired){
    root._wired = true;
    // tab spine
    root.querySelectorAll('.dd-tab').forEach(function(btn){
      btn.addEventListener('click', function(){
        var k=btn.getAttribute('data-dd');
        root.querySelectorAll('.dd-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
        root.querySelectorAll('.dd-pane').forEach(function(p){ p.hidden = p.getAttribute('data-dd')!==k; });
        buildDD(root, k);
      });
    });
    // segment annual/quarterly toggle
    wireToggle(root, '[data-segtog]', function(){ buildSegCharts(root); });
  }
  // always (re)build the currently-active pane — canvases need a laid-out, visible parent
  var active = (root.querySelector('.dd-tab.active')||{}).getAttribute ? root.querySelector('.dd-tab.active').getAttribute('data-dd') : 'segments';
  buildDD(root, active);
}

export var disOverview = { html: html, init: init, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
