// overviews/app.js — Overview + Deep Dive for AppLovin Corporation (NASDAQ: APP).
//
// Follows docs/OVERVIEW_CONVENTIONS.md: a hooked Overview (Key Facts + lede + 2x2 quadrant
// always visible, everything below it collapsed) and a Deep Dive built on the same spine as
// the Disney profile — a Top Line / Bottom Line tab pair, with the segment explorer's
// metric x breakdown x mode x view x year-range engine reused here.
//
// AppLovin has ONE reportable segment, so that engine's "segment" selector becomes a LENS
// selector: Company / Geography / Cost structure / Divestiture. The point is the same — see
// the same numbers sliced the way the question demands, as a table or as a chart, in dollars,
// growth, mix or margin.
//
// Data lives in app-model.js (time series) and app-data.js (narrative). No data here.

import { liveQuote } from '../api.js';
import {
  APP_BRAND, APP_BRAND2, C_US, C_ROW, C_COGS, C_SM, C_RD, C_GA, C_APPS, C_POS, C_NEG,
  APP_FACTS, APP_LEDE, APP_QUAD, APP_ONE_SEGMENT, APP_GEO, APP_GEO_CAPTION, APP_PROD_DEFS,
  APP_PRODUCTS, APP_PEERS, APP_PEERS_NOTE, APP_TIMELINE,
  APP_DD_INTRO, APP_MARGIN_DRIVERS, APP_CAPRET, APP_OV_SOURCES, APP_DD_SOURCES,
  ECO_NAVY, ECO_GRAY, ECO_SKY, ECO_BLUE, ECO_RULE, ECO_HEAD,
  APP_ECO_CHAIN, APP_ECO_PLAYERS, APP_ECO_LEGEND, APP_ECO_APPNOTE, APP_ECO_SOURCE
} from './app-data.js';
import {
  AM_YEARS, AM_ISEST, AM_LAST_ACTUAL, AM_MIN_FULL,
  AM_IS, AM_GEO, AM_GEO_NOTE, AM_APPS, AM_CF, AM_BS, AM_CODM, AM_CODM_NOTE,
  AM_DRIVERS, AM_DRIVERS_NOTE, AQ_LABELS, AQ, AQ_NOTE, AM_SOURCE
} from './app-model.js';

// esc: escapes <>" but leaves & literal (per contract — never double-encode).
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var _co = null;
var _charts = {};
function destroy(id){ if(_charts[id]){ try{ _charts[id].destroy(); }catch(e){} _charts[id]=null; } }
function canBuild(cv){ return cv && typeof Chart !== 'undefined' && cv.offsetParent !== null; }
function hexA(hex, a){ var h=hex.replace('#',''); var r=parseInt(h.substr(0,2),16),g=parseInt(h.substr(2,2),16),b=parseInt(h.substr(4,2),16); return 'rgba('+r+','+g+','+b+','+a+')'; }

function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}
function fmtMoneyM(v){ if(v==null) return '—'; var a=Math.abs(v); if(a>=1000) return '$'+(v/1000).toFixed(2)+'B'; return '$'+Math.round(v)+'M'; }
function pctStr(v, dp){ if(v==null) return '—'; return Number(v).toFixed(dp==null?1:dp)+'%'; }
function signed(v){ return (v>=0?'+':'')+v.toFixed(1)+'%'; }

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED STYLES (injected once per pane, scoped by .ov-app)
// ═══════════════════════════════════════════════════════════════════════════════
function styleBlock(){
  return '<style>'+
    '.stdkf{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--bdr);border-top:3px solid '+APP_BRAND+';border-radius:12px;overflow:hidden;background:var(--w);margin:2px 0}'+
    '.stdkf-cell{padding:11px 13px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.stdkf-cell:nth-child(5n){border-right:none}.stdkf-cell:nth-child(n+6){border-bottom:none}'+
    '.stdkf-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:3px}'+
    '.stdkf-v{font-size:12px;font-weight:700;color:var(--navy);line-height:1.3}'+
    '@media(max-width:720px){.stdkf{grid-template-columns:repeat(2,1fr)}.stdkf-cell{border-right:none}}'+
    '.ov-lede{margin:16px 0 6px;font-size:13px;line-height:1.6;color:var(--navy)}'+
    '.q2{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--bdr);border-radius:12px;overflow:hidden;background:var(--w);margin:4px 0}'+
    '.q2-cell{padding:13px 15px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.q2-cell:nth-child(2n){border-right:none}.q2-cell:nth-child(n+3){border-bottom:none}'+
    '.q2-k{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:'+APP_BRAND+';margin-bottom:5px}'+
    '.q2-v{font-size:12px;color:var(--navy);line-height:1.5}.q2-v b{font-weight:800}'+
    '@media(max-width:600px){.q2{grid-template-columns:1fr}.q2-cell{border-right:none}.q2-cell:nth-child(n+2){border-bottom:1px solid var(--bdr)}.q2-cell:last-child{border-bottom:none}}'+
    '.ov-collap{border:1px solid var(--bdr);border-radius:10px;margin:12px 0 0;overflow:hidden}'+
    '.ov-collap-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:8px}'+
    '.ov-collap-h:hover{background:#EEF2F6}.ov-collap-ic{font-size:10px;color:var(--mu)}.ov-collap-b{padding:12px 14px 6px}'+
    '.dmm-row{display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start}'+
    '.dmm-chart-wrap{flex:1 1 300px;min-width:280px}'+
    '.dmm-tog{display:inline-flex;flex-wrap:wrap;gap:4px;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:3px;margin-bottom:10px}'+
    '.dmm-tog button{border:none;background:transparent;font:inherit;font-size:11.5px;font-weight:700;color:var(--mu);padding:5px 13px;border-radius:999px;cursor:pointer}'+
    '.dmm-tog button.active{background:'+APP_BRAND+';color:#fff}'+
    '.dmm-tog button:disabled{opacity:.38;cursor:not-allowed}'+
    '.dmm-defs{flex:1 1 300px;min-width:280px}'+
    '.acc{border:1px solid var(--bdr);border-radius:9px;margin-top:6px;overflow:hidden;background:var(--w)}'+
    '.acc-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12px;font-weight:700;color:var(--navy);padding:9px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px}'+
    '.acc-h:hover{background:#EEF2F6}.acc-x{color:var(--mu);font-weight:800}.acc-b{padding:10px 12px}'+
    '.famd{font-size:12px;color:var(--navy);line-height:1.55}.famd b{font-weight:800}'+
    '.subrow{display:flex;flex-direction:column;gap:5px;margin-top:8px}'+
    '.subrow .sr{border:1px solid var(--bdr);border-radius:8px;padding:8px 10px;background:#FBFCFD}'+
    '.sr-t{font-size:11.5px;font-weight:800;color:var(--navy)}.sr-d{font-size:11px;color:var(--mu);line-height:1.45;margin-top:2px}'+
    '.geo-bar{margin:7px 0}'+
    '.geo-bar-h{display:flex;justify-content:space-between;font-size:11.5px;margin-bottom:3px}'+
    '.geo-bar-n{font-weight:800;color:var(--navy)}.geo-bar-v{font-weight:800;color:var(--mu)}'+
    '.geo-bar-t{background:#F2F5F8;border-radius:6px;height:14px;overflow:hidden}'+
    '.stdp{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px}'+
    '.stdp-card{border:1px solid var(--bdr);border-radius:11px;padding:13px 14px;background:var(--w);cursor:pointer;transition:.14s}'+
    '.stdp-card:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px);border-color:'+APP_BRAND+'}'+
    '.stdp-ic{font-size:26px;line-height:1}.stdp-n{font-size:13px;font-weight:800;color:var(--navy);margin:7px 0 3px}'+
    '.stdp-d{font-size:11px;color:var(--mu);line-height:1.45}.stdp-more{font-size:10px;font-weight:700;color:'+APP_BRAND+';margin-top:6px}'+
    '.tl{position:relative;margin:4px 0 0;padding-left:20px}'+
    '.tl:before{content:"";position:absolute;left:5px;top:4px;bottom:4px;width:2px;background:var(--bdr)}'+
    '.tl-i{position:relative;padding:0 0 15px}'+
    '.tl-i:before{content:"";position:absolute;left:-18px;top:3px;width:9px;height:9px;border-radius:50%;background:'+APP_BRAND+';border:2px solid var(--w);box-shadow:0 0 0 1px var(--bdr)}'+
    '.tl-y{font-size:10.5px;font-weight:800;color:'+APP_BRAND+'}.tl-t{font-size:12.5px;font-weight:800;color:var(--navy);margin:1px 0 2px}'+
    '.tl-d{font-size:11.5px;color:var(--mu);line-height:1.5}'+
    '.tl-more{margin-top:5px;font-size:10.5px;font-weight:800;color:'+APP_BRAND+';background:none;border:none;cursor:pointer;padding:0}'+
    '.tl-rm{margin:6px 0 0;padding-left:16px}.tl-rm li{font-size:11px;color:var(--navy);line-height:1.5;margin-bottom:3px}'+
    '.ov-foot{font-size:10px;color:var(--mu);line-height:1.5;margin:16px 0 4px;padding-top:10px;border-top:1px solid var(--bdr)}'+
    '.ov-clickable{cursor:pointer}'+
    // peer controls
    '.pr-row{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:2px 0 10px}'+
    '.pr-chip{border:1px solid var(--bdr);background:var(--w);border-radius:20px;padding:4px 6px 4px 11px;font-size:11px;font-weight:800;color:var(--navy);display:inline-flex;align-items:center;gap:6px}'+
    '.pr-chip .pr-dot{width:7px;height:7px;border-radius:50%;background:'+APP_BRAND+'}'+
    '.pr-chip.analyst .pr-dot{background:'+C_SM+'}'+
    '.pr-x{border:none;background:#F2F5F8;color:var(--mu);border-radius:50%;width:17px;height:17px;line-height:1;font-size:12px;font-weight:800;cursor:pointer;padding:0}'+
    '.pr-x:hover{background:'+C_NEG+';color:#fff}'+
    '.pr-in{font:inherit;font-size:11.5px;font-weight:700;border:1px solid var(--bdr);border-radius:20px;padding:5px 11px;width:104px;text-transform:uppercase}'+
    '.pr-add{border:1px solid '+APP_BRAND+';background:'+APP_BRAND+';color:#fff;border-radius:20px;padding:5px 13px;font:inherit;font-size:11.5px;font-weight:800;cursor:pointer}'+
    // deep-dive spine
    '.dd-tabs{display:flex;flex-wrap:wrap;gap:4px;margin:0 0 16px;border-bottom:1px solid var(--bdr)}'+
    '.dd-tab{border:none;background:transparent;font:inherit;font-size:12.5px;font-weight:700;color:var(--mu);padding:9px 14px;cursor:pointer;border-bottom:2.5px solid transparent;margin-bottom:-1px}'+
    '.dd-tab:hover{color:var(--navy)}.dd-tab.active{color:'+APP_BRAND+';border-bottom-color:'+APP_BRAND+'}'+
    '.dd-pane[hidden]{display:none}'+
    '.dd-h{font-size:14px;font-weight:800;color:var(--navy);margin:4px 0 2px}'+
    '.dd-sub{font-size:11.5px;color:var(--mu);line-height:1.55;margin:0 0 12px}'+
    '.dd-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:9px;margin:2px 0 16px}'+
    '.dd-kpi{border:1px solid var(--bdr);border-top:3px solid '+APP_BRAND+';border-radius:10px;padding:10px 12px;background:var(--w);text-align:center}'+
    '.dd-kpi-v{font-size:16px;font-weight:800;color:var(--navy);line-height:1.15}'+
    '.dd-kpi-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--mu);margin-top:3px}'+
    '.dd-kpi-s{font-size:10px;color:var(--mu);margin-top:2px}'+
    '.dd-chart{height:340px;position:relative}'+
    '.dd-note{font-size:10.5px;color:var(--mu);line-height:1.5;margin:8px 0 0}'+
    '.dd-callout{border:1px solid var(--bdr);border-left:4px solid '+APP_BRAND+';border-radius:10px;padding:11px 14px;background:#F7F9FB;font-size:12px;line-height:1.55;color:var(--navy);margin:12px 0}'+
    '.drv{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:11px}'+
    '.drv-c{border:1px solid var(--bdr);border-radius:12px;padding:14px 15px;background:var(--w)}'+
    '.drv-h{display:flex;align-items:center;gap:9px;margin-bottom:6px}.drv-ic{font-size:21px}'+
    '.drv-t{font-size:13px;font-weight:800;color:var(--navy)}'+
    '.drv-tag{font-size:9px;font-weight:800;color:'+APP_BRAND+';background:var(--brand-soft);border-radius:20px;padding:2px 9px;margin-left:auto;white-space:nowrap}'+
    '.drv-d{font-size:11.5px;color:var(--navy);line-height:1.5}'+
    '.drv-pts{margin:8px 0 0;padding-left:16px}.drv-pts li{font-size:11px;color:var(--mu);line-height:1.5;margin-bottom:3px}'+
    // lens cards
    '.subseg-c{border:1px solid var(--bdr);border-left:4px solid var(--seg,'+APP_BRAND+');border-radius:11px;padding:13px 15px;background:var(--w)}'+
    '.subseg-h{display:flex;align-items:center;gap:8px;margin-bottom:4px}'+
    '.subseg-dot{width:11px;height:11px;border-radius:3px;background:var(--seg,'+APP_BRAND+');flex:none}'+
    '.subseg-t{font-size:13.5px;font-weight:800;color:var(--navy)}'+
    '.subseg-s{font-size:11px;color:var(--mu);margin:0 0 2px}'+
    '.dmm-tog button.active[data-ss="geo"]{background:'+C_ROW+'}'+
    '.dmm-tog button.active[data-ss="cost"]{background:'+C_SM+'}'+
    '.dmm-tog button.active[data-ss="div"]{background:#64748B}'+
    // financial tables
    '.dfin-wrap{overflow-x:auto;margin:2px 0 4px}'+
    '.dfin{border-collapse:collapse;width:100%;min-width:600px;font-size:11.5px}'+
    '.dfin th,.dfin td{padding:6px 10px;text-align:right;border-bottom:1px solid var(--bdr);white-space:nowrap}'+
    '.dfin th:first-child,.dfin td:first-child{text-align:left;font-weight:700;color:var(--navy)}'+
    '.dfin thead th{font-size:10px;text-transform:uppercase;letter-spacing:.03em;color:var(--mu);border-bottom:2px solid var(--bdr)}'+
    '.dfin thead th.est,.dfin td.est{background:var(--brand-soft)}'+
    '.dfin thead th.est{color:'+APP_BRAND+'}'+
    '.dfin td{color:var(--navy);font-weight:600}'+
    '.dfin tr.dfin-tot td{border-top:2px solid var(--bdr);font-weight:800;color:var(--navy)}'+
    '.dfin tr.dfin-sub td:first-child{font-weight:600;color:var(--mu);padding-left:20px}'+
    '.dfin td.cagr,.dfin th.cagr{border-left:1px solid var(--bdr);font-weight:800}'+
    '.dfin-note{font-size:10px;color:var(--mu);line-height:1.5;margin:6px 0 0}'+
    '.dfin-est-key{display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--brand-soft);border:1px solid '+APP_BRAND+';vertical-align:-1px;margin-right:4px}'+
    '.exp-ctrls{display:flex;flex-wrap:wrap;gap:10px 14px;align-items:center;margin:12px 0 6px}'+
    '.exp-range{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:2px 0 12px;font-size:11.5px;font-weight:700;color:var(--mu)}'+
    '.exp-ysel{font:inherit;font-size:11.5px;font-weight:700;color:var(--navy);border:1px solid var(--bdr);border-radius:7px;padding:4px 9px;background:var(--w);cursor:pointer}'+
    '.kv{border:1px solid var(--bdr);border-radius:11px;overflow:hidden;background:var(--w);margin-top:10px}'+
    '.kv-r{display:flex;gap:12px;padding:10px 13px;border-bottom:1px solid var(--bdr)}'+
    '.kv-r:last-child{border-bottom:none}'+
    '.kv-k{flex:0 0 108px;font-size:11px;font-weight:800;color:'+APP_BRAND+';text-transform:uppercase;letter-spacing:.03em}'+
    '.kv-v{flex:1;font-size:11.5px;color:var(--navy);line-height:1.55}'+
    '.ov-app .ovt-subtabs{margin-bottom:12px}'+
    // ── Advertising ecosystem: replicas of The Trade Desk slides 11 and 14 ──
    '.eco-slide{background:'+ECO_NAVY+';border-radius:12px;padding:34px 30px 38px;margin:14px 0 0;overflow-x:auto}'+
    '.eco-slide-light{background:#FFFFFF;border:1px solid var(--bdr)}'+
    '.eco-title{color:#fff;font-size:clamp(19px,2.4vw,30px);font-weight:400;letter-spacing:-.01em;line-height:1.2;margin:0 0 34px}'+
    '.eco-title-dark{color:'+ECO_HEAD+';text-align:center;margin-bottom:26px}'+
    // slide 11 — column widths mirror the slide's own pixel proportions
    '.eco-chain{display:grid;grid-template-columns:1fr .17fr 1.03fr 1.03fr 3.13fr 1.03fr 1.03fr .17fr 1fr;'+
      'gap:12px;align-items:stretch;min-width:820px}'+
    '.eco-val{align-self:center;background:#fff;border-radius:2px;min-height:98px;display:flex;align-items:center;justify-content:center}'+
    '.eco-val span{color:'+ECO_HEAD+';font-size:clamp(17px,2.1vw,30px);font-weight:500}'+
    '.eco-arrow{align-self:center;display:flex;align-items:center;justify-content:center;gap:0}'+
    '.eco-line{flex:1;height:1.5px;background:'+ECO_SKY+'}'+
    '.eco-head{width:0;height:0;border-top:5px solid transparent;border-bottom:5px solid transparent}'+
    '.eco-head-r{border-left:7px solid '+ECO_SKY+'}'+
    '.eco-head-l{border-right:7px solid '+ECO_SKY+'}'+
    '.eco-col{border-radius:2px;display:flex;align-items:center;justify-content:center;text-align:center;padding:10px 6px}'+
    '.eco-col span{font-size:clamp(10px,1.05vw,13.5px);line-height:1.32}'+
    '.eco-mid{display:flex;flex-direction:column;gap:13px}'+
    '.eco-mbox{background:'+ECO_GRAY+';border-radius:2px;display:flex;align-items:center;justify-content:center;'+
      'text-align:center;color:#5A5A5A;font-size:clamp(10px,1.05vw,13.5px);line-height:1.3;padding:4px 8px}'+
    '.eco-mrow{display:grid;grid-template-columns:repeat(4,1fr);gap:13px}'+
    '.eco-mrow .eco-mbox{height:100%}'+
    // slide 14
    '.eco-grid{display:grid;gap:0}'+
    '.eco-grid-4{grid-template-columns:repeat(4,1fr)}'+
    '.eco-grid-3{grid-template-columns:1.5fr 1.5fr 1.5fr;padding-left:11.1%;padding-right:11.1%}'+
    '.eco-cat{padding:4px 16px 16px;border-left:1px solid '+ECO_RULE+'33;text-align:center}'+
    '.eco-grid-4 .eco-cat:first-child,.eco-grid-3 .eco-cat:first-child{border-left:none}'+
    '.eco-cat-h{font-size:12px;font-weight:800;letter-spacing:.02em;color:'+ECO_HEAD+';margin-bottom:16px;line-height:1.25}'+
    '.eco-marks{display:flex;flex-wrap:wrap;gap:7px 14px;justify-content:center;align-items:center}'+
    '.eco-mark{font-size:12px;font-weight:700;color:#4A4F5A;white-space:nowrap}'+
    // the AppLovin placements: boxed, brand-coloured, with the product underneath
    '.eco-mark-app{display:inline-flex;flex-direction:column;align-items:center;line-height:1.15;'+
      'border:1.5px solid '+APP_BRAND+';background:var(--brand-soft);border-radius:7px;'+
      'padding:5px 11px;color:'+APP_BRAND+'}'+
    '.eco-mark-app b{font-size:12.5px;font-weight:800}'+
    '.eco-mark-app i{font-size:9.5px;font-style:normal;font-weight:700;opacity:.8;margin-top:1px}'+
    '.eco-cat-app .eco-cat-h{color:'+APP_BRAND+'}'+
    '.eco-legend{display:flex;align-items:center;justify-content:center;gap:9px;margin:0 0 20px}'+
    '.eco-legend-t{font-size:11px;font-weight:700;color:var(--mu)}'+
    '.eco-cat-n{font-size:10.5px;color:#6B7684;margin-top:12px}'+
    '.eco-rule{position:relative;height:1px;background:'+ECO_RULE+'55;margin:14px 0 18px}'+
    '.eco-dot{position:absolute;top:-3px;width:7px;height:7px;border-radius:50%;background:'+ECO_BLUE+';transform:translateX(-50%)}'+
    '@media(max-width:820px){.eco-grid-4{grid-template-columns:repeat(2,1fr)}.eco-grid-3{grid-template-columns:1fr;padding:0}'+
      '.eco-cat{border-left:none;border-top:1px solid '+ECO_RULE+'33}}'+
    // modal (own copy — dis.js styles only exist while a Disney pane is mounted)
    '.app-modal-back{position:fixed;inset:0;background:rgba(15,23,42,.5);display:flex;align-items:center;justify-content:center;z-index:1000;opacity:0;transition:opacity .16s;padding:20px}'+
    '.app-modal-back.on{opacity:1}.app-modal-back[hidden]{display:none}'+
    '.app-modal{background:var(--w);border-radius:14px;max-width:560px;width:100%;max-height:82vh;overflow:auto;padding:20px 22px;box-shadow:0 20px 60px rgba(0,0,0,.3)}'+
    '.app-modal-t{font-size:16px;font-weight:800;color:var(--navy);margin:0 0 12px;display:flex;align-items:center;gap:9px}'+
    '.app-modal-x{margin-left:auto;background:none;border:none;font-size:20px;color:var(--mu);cursor:pointer;line-height:1}'+
    '</style>';
}

// ═══════════════════════════════════════════════════════════════════════════════
// OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════
function keyFacts(){
  return '<div class="stdkf">'+APP_FACTS.map(function(f){
    var v = f[1]==='live' ? '<span data-mcap>fetching…</span>' : esc(f[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(f[0])+'</div><div class="stdkf-v">'+v+'</div></div>';
  }).join('')+'</div>';
}
function fourQuad(){
  return '<div class="q2">'+APP_QUAD.map(function(q){
    return '<div class="q2-cell"><div class="q2-k">'+esc(q[0])+'</div><div class="q2-v">'+q[1]+'</div></div>';
  }).join('')+'</div>';
}
// How it makes money — GEOGRAPHY ONLY (single reportable segment; no one-bar chart).
function moneyMap(){
  var bars = APP_GEO.map(function(r){
    return '<div class="geo-bar"><div class="geo-bar-h"><span class="geo-bar-n">'+esc(r[0])+'</span>'+
      '<span class="geo-bar-v">'+esc(r[2])+' · '+esc(r[3])+'</span></div>'+
      '<div class="geo-bar-t"><div style="height:100%;width:'+r[1]+'%;background:'+r[4]+'"></div></div></div>';
  }).join('');
  var defs = '<div class="dmm-defs">'+APP_PROD_DEFS.map(function(d){
    var subs = d.subs.map(function(s){ return '<div class="sr"><div class="sr-t">'+esc(s[0])+'</div><div class="sr-d">'+esc(s[1])+'</div></div>'; }).join('');
    return '<div class="acc"><button type="button" class="acc-h">What is '+esc(d.seg)+'?<span class="acc-x">+</span></button>'+
      '<div class="acc-b" hidden><div class="famd">'+d.desc+'</div><div class="subrow">'+subs+'</div></div></div>';
  }).join('')+'</div>';
  return '<div class="dd-callout" style="margin-top:0">'+APP_ONE_SEGMENT+'</div>'+
    '<div class="dmm-row"><div class="dmm-chart-wrap">'+bars+
      '<div class="dd-note">'+APP_GEO_CAPTION+'</div></div>'+defs+'</div>';
}
function products(){
  return '<div class="stdp">'+APP_PRODUCTS.map(function(f,i){
    return '<div class="stdp-card ov-clickable" data-prod="'+i+'"><div class="stdp-ic">'+f.ic+'</div>'+
      '<div class="stdp-n">'+esc(f.fam)+'</div><div class="stdp-d">'+esc(f.d)+'</div><div class="stdp-more">See products ›</div></div>';
  }).join('')+'</div>';
}
function peerScatter(){
  return '<div>'+
    '<div class="dmm-tog" data-sctog>'+
      '<button type="button" class="active" data-sc="ev">EV/EBITDA</button><button type="button" data-sc="pe">P/E</button>'+
      '<span style="width:8px"></span>'+
      '<button type="button" class="active" data-scb="fwd">Forward</button><button type="button" data-scb="ttm">Trailing</button>'+
    '</div>'+
    '<div class="pr-row" data-prchips></div>'+
    '<div class="pr-row"><input class="pr-in" data-prin placeholder="Ticker" maxlength="6">'+
      '<button type="button" class="pr-add" data-pradd>Add peer</button>'+
      '<span style="font-size:10.5px;color:var(--mu)">Dot: <b style="color:'+APP_BRAND+'">named in the 10-K</b> · <b style="color:'+C_SM+'">analyst-selected</b></span></div>'+
    '<div class="dd-chart" style="height:330px"><canvas id="appScatter"></canvas></div>'+
    '<div class="dd-note" data-prnote>'+APP_PEERS_NOTE+'</div></div>';
}
function timeline(){
  return '<div class="tl">'+APP_TIMELINE.map(function(t,i){
    var rm = t[3] ? '<button type="button" class="tl-more" data-tlrm="'+i+'">Read more ›</button><ul class="tl-rm" data-tlbody="'+i+'" hidden>'+t[3].map(function(b){ return '<li>'+esc(b)+'</li>'; }).join('')+'</ul>' : '';
    return '<div class="tl-i"><div class="tl-y">'+esc(t[0])+'</div><div class="tl-t">'+esc(t[1])+'</div><div class="tl-d">'+esc(t[2])+'</div>'+rm+'</div>';
  }).join('')+'</div>';
}

function html(c){
  _co = c;
  var h = '<div class="ov ov-app" data-brand="APP" style="--brand:'+APP_BRAND+';--brand-soft:#EAF1FE">';
  h += styleBlock();
  h += keyFacts();
  h += '<p class="ov-lede">'+esc(APP_LEDE)+'</p>';
  h += fourQuad();
  h += collapsible('How AppLovin makes money — one segment, two geographies, four products', moneyMap(), false);
  h += collapsible('Products', products(), false);
  h += collapsible('Competitors — the peer map', peerScatter(), false);
  h += collapsible('Timeline — how it became today’s AppLovin', timeline(), false);
  h += '<div class="ov-foot">'+esc(APP_OV_SOURCES)+'</div>';
  h += modalMarkup();
  h += '</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEEP DIVE — the financials explorer (Disney's segment engine, re-pointed at lenses)
// ═══════════════════════════════════════════════════════════════════════════════
var LENSES = [
  { key:'co',   name:'Company',        color:APP_BRAND, sub:'The whole P&L, top line to free cash flow.' },
  { key:'geo',  name:'Geography',      color:C_ROW,     sub:'The only revenue split AppLovin publishes — by end-user location.' },
  { key:'cost', name:'Cost structure', color:C_SM,      sub:'Where the money goes, and why operating leverage is this extreme.' },
  { key:'div',  name:'Divestiture',    color:'#64748B', sub:'Advertising vs the Apps business that was sold in June 2025.' },
];
// Used to build the total-row label, e.g. "Total AppLovin revenue" / "Total operating expenses".
var LENS_NAME = { co:'AppLovin', geo:'AppLovin', cost:'', div:'combined' };
var LENS_DEFAULT = 'co';
var SEG_MIN = 0, SEG_MAX = 7;          // 2021 .. 2028E (indices into AM_YEARS)
var SEG_DEF_FROM = AM_MIN_FULL;        // default range starts at 2023 (first full P&L)

function arrSub(a,b){ return a.map(function(v,i){ return (v==null||b[i]==null)?null:(v-b[i]); }); }
function arrSum(list){
  return AM_YEARS.map(function(_,i){
    var t=0, any=false;
    for(var k=0;k<list.length;k++){ var v=list[k][i]; if(v==null) return null; t+=v; any=true; }
    return any?t:null;
  });
}

function lensMetrics(lens){
  if(lens==='co') return [{k:'rev',l:'Revenue'},{k:'opex',l:'Operating expenses'},{k:'oi',l:'Operating income'},
                          {k:'ebitda',l:'Adj. EBITDA'},{k:'ni',l:'Net income'},{k:'eps',l:'EPS'},{k:'fcf',l:'Free cash flow'}];
  if(lens==='geo')  return [{k:'rev',l:'Revenue'}];
  if(lens==='cost') return [{k:'opex',l:'Operating expenses'}];
  return [{k:'rev',l:'Revenue'}];
}
function lensBreaks(lens, metric){
  if(lens==='co'){
    if(metric==='rev')  return [{k:'geo',l:'By geography'}];
    if(metric==='opex') return [{k:'type',l:'By cost type'}];
    return [];
  }
  if(lens==='cost') return [{k:'type',l:'By cost type'},{k:'codm',l:'By CODM category'}];
  return [];
}
// "% of revenue" is meaningful for every dollar metric; never for EPS, never for the
// divestiture lens (whose denominator would mix two different bases).
function lensHasPctRev(lens, metric){ return metric!=='eps' && lens!=='div'; }

var M_NAME  = { rev:'Revenue', opex:'Operating expenses', oi:'Operating income', ebitda:'Adjusted EBITDA', ni:'Net income', eps:'Diluted EPS', fcf:'Free cash flow' };
var M_LOWER = { rev:'revenue', opex:'operating expenses', oi:'operating income', ebitda:'adjusted EBITDA', ni:'net income', eps:'EPS', fcf:'free cash flow' };

// Row data: { rows:[[name,arr]...], total, colors, unit }
function lensRows(lens, metric, which){
  if(lens==='geo' || (lens==='co' && metric==='rev')){
    return { rows:[['United States',AM_GEO.unitedStates],['Rest of world',AM_GEO.restOfWorld]],
             total:AM_IS.revenue, colors:[C_US,C_ROW] };
  }
  if(lens==='div'){
    var adv = AM_IS.revenue, apps = AM_APPS.revenue;
    // Apps stops after 2025, so treat a missing Apps year as zero rather than voiding the total.
    var both = adv.map(function(v,i){ return v==null ? null : v + (apps[i]||0); });
    return { rows:[['Advertising (continuing ops)',adv],['Apps (discontinued)',apps]],
             total:both, colors:[APP_BRAND,C_APPS] };
  }
  if(metric==='opex'){
    if(which==='codm'){
      var rows = [['Datacenter',AM_CODM.datacenter],['Personnel',AM_CODM.personnel],['Stock-based comp',AM_CODM.sbc],
                  ['D&A and write-offs',AM_CODM.daWriteoffs],['Interest expense',AM_CODM.interest],
                  ['Income tax',AM_CODM.taxes],['Other expenses',AM_CODM.other]];
      return { rows:rows, total:arrSum(rows.map(function(r){ return r[1]; })),
               colors:[C_COGS,C_SM,C_RD,C_GA,'#94A3B8','#334155','#CBD5E1'] };
    }
    return { rows:[['Cost of revenue',AM_IS.costOfRevenue],['Sales & marketing',AM_IS.salesMarketing],
                   ['Research & development',AM_IS.researchDev],['General & administrative',AM_IS.generalAdmin]],
             total:AM_IS.totalCosts, colors:[C_COGS,C_SM,C_RD,C_GA] };
  }
  if(metric==='oi')     return { rows:[], total:AM_IS.operatingIncome };
  if(metric==='ebitda') return { rows:[], total:AM_IS.adjEbitda };
  if(metric==='ni')     return { rows:[], total:AM_IS.netIncome };
  if(metric==='eps')    return { rows:[], total:AM_IS.epsDiluted };
  if(metric==='fcf')    return { rows:[], total:AM_CF.fcf };
  return { rows:[], total:AM_IS.revenue };
}

function lensNote(lens, metric, which, mode){
  var n='';
  if(lens==='geo' || (lens==='co'&&metric==='rev')) n = AM_GEO_NOTE+' ';
  else if(lens==='div') n = 'Advertising is today\'s whole company (continuing operations); Apps is the divested games business, shown in discontinued operations. <b>2025 Apps covers only the six months to 30 June</b>, when the sale closed, and from 2025 the reported revenue line is advertising only — so the Total row here is the two businesses combined, not a figure AppLovin ever printed. The 2021-2024 split is Bloomberg segment data, verified against the 10-K restatement. ';
  else if(lens==='cost' && which==='codm') n = AM_CODM_NOTE+' The Total row is revenue minus net income from continuing operations, i.e. everything the CODM deducts. Consensus does not forecast these categories, so the estimate years are empty. ';
  else if(metric==='opex') n = 'The four reported cost lines. They foot exactly for 2023-2025 (10-K); for the estimate years the consensus lines sum about 0.7% away from the consensus operating-income line, so treat the forward split as directional. ';
  else if(metric==='oi') n = 'Operating income = revenue minus total costs and expenses. ';
  else if(metric==='ebitda') n = 'Adjusted EBITDA as the company defines it. <b>2021 and 2022 are the Advertising segment as reported at the time</b>, a slightly different basis from the 2023-2025 restated continuing-operations figures. ';
  else if(metric==='ni') n = 'Net income from continuing operations. Estimate years are the consensus GAAP net income line. ';
  else if(metric==='eps') n = 'Diluted EPS. Actuals are the reported total (continuing plus discontinued); estimates are consensus adjusted diluted EPS. The two coincide in 2023-2025. ';
  else if(metric==='fcf') n = 'Free cash flow on the company definition: cash from operations less capex and finance-lease principal. ';
  if(mode==='pctrev') n += 'Shown as a percentage of revenue. ';
  if(AM_IS.costOfRevenue[0]==null && lens!=='div') n += '<b>2021 and 2022 are blank for most lines</b> — AppLovin never restated those years onto a continuing-operations basis, so only revenue and Adjusted EBITDA exist that far back. ';
  return n+'Shaded columns are Bloomberg consensus (BST), not guidance. YoY compares with the prior year; CAGR spans the selected range.';
}

function yearSelect(which){
  var def = (which==='from')?SEG_DEF_FROM:SEG_MAX;
  var opts=''; for(var i=SEG_MIN;i<=SEG_MAX;i++){ opts+='<option value="'+i+'"'+(i===def?' selected':'')+'>'+AM_YEARS[i]+'</option>'; }
  return '<select class="exp-ysel seg-'+which+'">'+opts+'</select>';
}
function lensBody(){
  return ''+
    '<div class="exp-ctrls">'+
      '<div class="dmm-tog seg-metric"></div>'+
      '<div class="dmm-tog seg-break"></div>'+
      '<div class="dmm-tog seg-mode">'+
        '<button type="button" class="active" data-mode="val">$ Value</button>'+
        '<button type="button" data-mode="yoy">YoY %</button>'+
        '<button type="button" data-mode="cs">% of total</button>'+
        '<button type="button" data-mode="pctrev">% of revenue</button>'+
      '</div>'+
      '<div class="dmm-tog seg-view"><button type="button" class="active" data-view="table">Table</button><button type="button" data-view="chart">Chart</button></div>'+
    '</div>'+
    '<div class="exp-range">Years <span>'+yearSelect('from')+'</span><span>→</span><span>'+yearSelect('to')+'</span></div>'+
    '<div class="seg-table dfin-wrap"></div>'+
    '<div class="seg-chart dd-chart" hidden><canvas></canvas></div>'+
    '<div class="dfin-note seg-note"></div>';
}
function lensSubpane(){
  var toggle = '<div class="dmm-tog" data-segseltog>'+LENSES.map(function(s){
    return '<button type="button" class="'+(s.key===LENS_DEFAULT?'active':'')+'" data-ss="'+s.key+'">'+esc(s.name)+'</button>';
  }).join('')+'</div>';
  var views = LENSES.map(function(s){
    return '<div class="subseg-c" data-segview="'+s.key+'"'+(s.key===LENS_DEFAULT?'':' hidden')+' style="--seg:'+s.color+'">'+
      '<div class="subseg-h"><span class="subseg-dot"></span><span class="subseg-t">'+esc(s.name)+'</span></div>'+
      '<p class="subseg-s">'+esc(s.sub)+'</p>'+ lensBody() +
    '</div>';
  }).join('');
  return '<p class="dd-sub">One reportable segment, so pick the <b>lens</b> instead: the whole P&L, the geographic split, the cost base, or the business that was sold. Every lens shares the same controls — metric, breakdown, dollars/growth/mix/margin, table or chart, and a year range that runs from 2021 through consensus 2028.</p>'+toggle+views;
}

function cardTog(card, sel, attr, dflt){ var b=card.querySelector(sel+' button.active'); return (b&&b.getAttribute(attr))||dflt; }

function segSyncControls(card, lens){
  var el = card.querySelector('.seg-metric');
  if(el && !el.getAttribute('data-filled')){
    el.innerHTML = lensMetrics(lens).map(function(m,i){ return '<button type="button" class="'+(i===0?'active':'')+'" data-metric="'+m.k+'">'+esc(m.l)+'</button>'; }).join('');
    el.setAttribute('data-filled','1');
    el.style.display = lensMetrics(lens).length>1 ? '' : 'none';
  }
  var metric = cardTog(card, '.seg-metric', 'data-metric', 'rev');
  var bwrap = card.querySelector('.seg-break');
  if(bwrap){
    var breaks = lensBreaks(lens, metric);
    if(breaks.length){
      var cur = cardTog(card, '.seg-break', 'data-break', breaks[0].k);
      var keep = breaks.some(function(b){ return b.k===cur; }) ? cur : breaks[0].k;
      bwrap.innerHTML = breaks.map(function(b){ return '<button type="button" class="'+(b.k===keep?'active':'')+'" data-break="'+b.k+'">'+esc(b.l)+'</button>'; }).join('');
      bwrap.style.display = breaks.length>1 ? '' : 'none';
    } else { bwrap.innerHTML=''; bwrap.style.display='none'; }
  }
  var data = lensRows(lens, metric, cardTog(card,'.seg-break','data-break','type'));
  // "% of total" needs rows; "% of revenue" needs a revenue denominator.
  lockMode(card, 'cs', data.rows.length===0);
  lockMode(card, 'pctrev', !lensHasPctRev(lens, metric));
}
function lockMode(card, mode, locked){
  var b = card.querySelector('.seg-mode button[data-mode="'+mode+'"]'); if(!b) return;
  b.disabled = locked;
  if(locked && b.classList.contains('active')){
    card.querySelectorAll('.seg-mode button').forEach(function(x){ x.classList.toggle('active', x.getAttribute('data-mode')==='val'); });
  }
}
function segReadState(card, lens){
  var metric = cardTog(card, '.seg-metric', 'data-metric', lensMetrics(lens)[0].k);
  var breaks = lensBreaks(lens, metric);
  var which = cardTog(card, '.seg-break', 'data-break', breaks.length?breaks[0].k:'type');
  var mode = cardTog(card, '.seg-mode', 'data-mode', 'val');
  var data = lensRows(lens, metric, which);
  if(mode==='cs' && data.rows.length===0) mode='val';
  if(mode==='pctrev' && !lensHasPctRev(lens, metric)) mode='val';
  var fs=card.querySelector('.seg-from'), ts=card.querySelector('.seg-to');
  var fromIdx = fs?parseInt(fs.value,10):SEG_DEF_FROM, toIdx = ts?parseInt(ts.value,10):SEG_MAX;
  if(toIdx<fromIdx){ var t=toIdx; toIdx=fromIdx; fromIdx=t; }
  return { metric:metric, which:which, mode:mode, fromIdx:fromIdx, toIdx:toIdx, data:data };
}

function buildSegTable(card, lens){
  var wrap = card.querySelector('.seg-table'); if(!wrap) return;
  var st = segReadState(card, lens), metric=st.metric, mode=st.mode, data=st.data;
  var years=[]; for(var i=st.fromIdx;i<=st.toIdx;i++) years.push(i);
  var rows = data.rows, total = data.total, rev = AM_IS.revenue;
  var isEps = (metric==='eps');

  function val(v){ if(v==null) return '—'; return isEps ? ('$'+v.toFixed(2)) : Math.round(v).toLocaleString(); }
  function yoy(arr,i){ var p=arr[i-1],v=arr[i]; if(v==null||p==null||p===0) return '—';
    var g=(v/p-1)*100; return '<span style="color:'+(g>=0?C_POS:C_NEG)+'">'+signed(g)+'</span>'; }
  function cs(arr,i){ var v=arr[i],tot=total[i]; if(v==null||tot==null||tot===0) return '—'; return (v/tot*100).toFixed(1)+'%'; }
  function pr(arr,i){ var v=arr[i],d=rev[i]; if(v==null||d==null||d===0) return '—'; return (v/d*100).toFixed(1)+'%'; }
  function cell(arr,i){ if(mode==='yoy') return yoy(arr,i); if(mode==='cs') return cs(arr,i); if(mode==='pctrev') return pr(arr,i); return val(arr[i]); }
  function cagr(arr){ var a=arr[st.fromIdx],b=arr[st.toIdx],n=st.toIdx-st.fromIdx;
    if(a==null||b==null||a<=0||b<=0||n<=0) return '—'; return signed((Math.pow(b/a,1/n)-1)*100); }

  var showCagr = (mode==='val');
  var corner = (mode==='pctrev' ? '% of revenue' : (mode==='cs' ? '% of total' : M_NAME[metric]||'Revenue'));
  var head='<tr><th>'+esc(corner)+'</th>'+
    years.map(function(i){ return '<th class="'+(AM_ISEST[i]?'est':'')+'">'+esc(AM_YEARS[i])+'</th>'; }).join('')+
    (showCagr?'<th class="cagr">CAGR</th>':'')+'</tr>';
  function rowHtml(name, arr, cls){
    return '<tr'+(cls?' class="'+cls+'"':'')+'><td>'+esc(name)+'</td>'+
      years.map(function(i){ return '<td class="'+(AM_ISEST[i]?'est':'')+'">'+cell(arr,i)+'</td>'; }).join('')+
      (showCagr?'<td class="cagr">'+cagr(arr)+'</td>':'')+'</tr>';
  }
  var totLabel = rows.length ? ('Total '+(LENS_NAME[lens]||'')+' '+(M_LOWER[metric]||'')).replace(/\s+/g,' ').trim()
                             : ((LENS_NAME[lens]==='AppLovin'?'':LENS_NAME[lens]+' ')+M_NAME[metric]);
  var body = rows.map(function(r){ return rowHtml(r[0], r[1], 'dfin-sub'); }).join('') + rowHtml(totLabel, total, 'dfin-tot');
  wrap.innerHTML = '<table class="dfin"><thead>'+head+'</thead><tbody>'+body+'</tbody></table>';
}

function buildSegChart(card, lens){
  var cv = card.querySelector('.seg-chart canvas'); if(!cv || !canBuild(cv)) return;
  if(cv._chart){ try{ cv._chart.destroy(); }catch(e){} cv._chart=null; }
  var st = segReadState(card, lens), mode=st.mode, data=st.data;
  var years=[]; for(var i=st.fromIdx;i<=st.toIdx;i++) years.push(i);
  var rows = data.rows.length ? data.rows : [[M_NAME[st.metric]||'Total', data.total]];
  var total = data.total, rev = AM_IS.revenue, colors = data.colors;
  var stacked = (mode==='val' || mode==='cs') && data.rows.length>0;
  var isPct = (mode!=='val');
  var isEps = (st.metric==='eps');
  var PAL = [APP_BRAND, C_SM, C_RD, C_GA, '#64748B', '#334155', '#CBD5E1'];
  var datasets = rows.map(function(r, ri){
    var color = (colors && colors[ri]) ? colors[ri] : PAL[ri % PAL.length];
    var vals = years.map(function(i){
      var v = r[1][i];
      if(mode==='cs'){ var tt=total[i]; return (v==null||tt==null||tt===0)?null:(v/tt*100); }
      if(mode==='yoy'){ var p=r[1][i-1]; return (v==null||p==null||p===0)?null:((v/p-1)*100); }
      if(mode==='pctrev'){ var d=rev[i]; return (v==null||d==null||d===0)?null:(v/d*100); }
      return v;
    });
    return { label:r[0], data:vals, stack: stacked?'s':undefined,
      backgroundColor: years.map(function(i){ return AM_ISEST[i]?hexA(color,.45):color; }),
      borderColor:color, borderWidth: years.map(function(i){ return AM_ISEST[i]?1.2:0; }),
      borderRadius:2, maxBarThickness:52 };
  });
  cv._chart = new Chart(cv.getContext('2d'), {
    type:'bar',
    data:{ labels:years.map(function(i){ return AM_YEARS[i]; }), datasets:datasets },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:6 } },
      plugins:{ legend:{ display:datasets.length>1, position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
        tooltip:{ callbacks:{ label:function(ctx){ var v=ctx.parsed.y; if(v==null) return ctx.dataset.label+': —';
          return ctx.dataset.label+': '+(isPct ? (v.toFixed(1)+'%') : (isEps ? ('$'+v.toFixed(2)) : ('$'+Math.round(v).toLocaleString()+'M'))); } } } },
      scales:{
        x:{ stacked:stacked, grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:10.5 } } },
        y:{ stacked:stacked, grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 },
          callback:function(v){ return isPct ? (v+'%') : (isEps ? ('$'+v.toFixed(2)) : ('$'+(v/1000).toFixed(1)+'B')); } } } } }
  });
}
function buildSegView(card, lens){
  if(!card) return;
  var view = cardTog(card, '.seg-view', 'data-view', 'table');
  var tableWrap = card.querySelector('.seg-table'), chartWrap = card.querySelector('.seg-chart');
  var noteEl = card.querySelector('.seg-note');
  if(noteEl){ var st=segReadState(card, lens); noteEl.innerHTML = '<span class="dfin-est-key"></span>'+lensNote(lens, st.metric, st.which, st.mode); }
  if(view==='chart'){
    if(tableWrap) tableWrap.hidden = true; if(chartWrap) chartWrap.hidden = false;
    requestAnimationFrame(function(){ buildSegChart(card, lens); });
  } else {
    if(chartWrap) chartWrap.hidden = true; if(tableWrap) tableWrap.hidden = false;
    buildSegTable(card, lens);
  }
}

// ─── Top Line ▸ Growth engine (volume vs price) ─────────────────────────────────
function growthBody(){
  var rows = AM_DRIVERS.labels.map(function(l,i){
    return '<tr><td>'+esc(l)+'</td>'+
      '<td style="color:'+(AM_DRIVERS.installs[i]>=0?C_POS:C_NEG)+'">'+signed(AM_DRIVERS.installs[i])+'</td>'+
      '<td style="color:'+C_POS+'">'+signed(AM_DRIVERS.netRevPerInstall[i])+'</td>'+
      '<td style="font-weight:800">'+signed(AM_DRIVERS.revenue[i])+'</td></tr>';
  }).join('');
  return '<p class="dd-sub">The single most important trend line in this business. Until 2024 growth came from <b>volume</b> — more installs. Since then it has come almost entirely from <b>price</b>: how much revenue AppLovin extracts per install. Volume has been flat to negative for six straight periods.</p>'+
    '<div class="dd-chart" style="height:320px"><canvas id="appDrivers"></canvas></div>'+
    '<div class="dfin-wrap" style="margin-top:14px"><table class="dfin" style="min-width:420px"><thead><tr>'+
      '<th>Year-over-year</th><th>Install volume</th><th>Net revenue / install</th><th>Revenue</th>'+
    '</tr></thead><tbody>'+rows+'</tbody></table></div>'+
    '<div class="dfin-note">'+esc(AM_DRIVERS_NOTE)+'</div>'+
    '<div class="dd-callout">Read it both ways. <b>Bull:</b> Axon monetises each install far better than it did, and that is a software outcome that compounds without adding cost. <b>Bear:</b> the underlying volume is not growing, so the whole thesis rests on yield continuing to climb — and yield has a ceiling that volume does not.</div>';
}
function buildDrivers(root){
  var cv = root.querySelector('#appDrivers'); if(!canBuild(cv)) return; destroy('appDrivers');
  var L = AM_DRIVERS.labels;
  _charts['appDrivers'] = new Chart(cv.getContext('2d'), {
    type:'bar',
    data:{ labels:L, datasets:[
      { label:'Install volume', data:AM_DRIVERS.installs, backgroundColor:C_APPS, borderRadius:2, maxBarThickness:34 },
      { label:'Net revenue per install', data:AM_DRIVERS.netRevPerInstall, backgroundColor:APP_BRAND, borderRadius:2, maxBarThickness:34 },
      { label:'Revenue', data:AM_DRIVERS.revenue, type:'line', borderColor:C_SM, backgroundColor:C_SM,
        borderWidth:2.4, pointRadius:4, pointBackgroundColor:C_SM, tension:.25, fill:false } ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+signed(ctx.parsed.y); } } } },
      scales:{ x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:10.5 } } },
        y:{ grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return v+'%'; } } } } }
  });
}

// ─── Top Line ▸ Quarterly ───────────────────────────────────────────────────────
function qRow(label, arr, fmt, cls){
  return '<tr'+(cls?' class="'+cls+'"':'')+'><td>'+esc(label)+'</td>'+
    arr.map(function(v){ return '<td>'+fmt(v)+'</td>'; }).join('')+'</tr>';
}
function quarterlyBody(){
  var d0=function(v){ return v==null?'—':Math.round(v).toLocaleString(); };
  var p1=function(v){ return v==null?'—':v.toFixed(1)+'%'; };
  var e2=function(v){ return v==null?'—':'$'+v.toFixed(2); };
  var margin = function(num){ return AQ.revenue.map(function(r,i){ return num[i]==null?null:(num[i]/r*100); }); };
  var head = '<tr><th>$M unless noted</th>'+AQ_LABELS.map(function(l){ return '<th>'+esc(l)+'</th>'; }).join('')+'</tr>';
  var body =
    qRow('Revenue', AQ.revenue, d0, 'dfin-tot')+
    qRow('Cost of revenue', AQ.costOfRevenue, d0, 'dfin-sub')+
    qRow('Sales & marketing', AQ.salesMarketing, d0, 'dfin-sub')+
    qRow('Research & development', AQ.researchDev, d0, 'dfin-sub')+
    qRow('General & administrative', AQ.generalAdmin, d0, 'dfin-sub')+
    qRow('Total costs and expenses', AQ.totalCosts, d0)+
    qRow('Operating income', AQ.operatingIncome, d0, 'dfin-tot')+
    qRow('Operating margin', margin(AQ.operatingIncome), p1, 'dfin-sub')+
    qRow('Adjusted EBITDA', AQ.adjEbitda, d0, 'dfin-tot')+
    qRow('Adjusted EBITDA margin', margin(AQ.adjEbitda), p1, 'dfin-sub')+
    qRow('Net income (continuing)', AQ.netIncome, d0)+
    qRow('Diluted EPS (continuing)', AQ.epsDiluted, e2)+
    qRow('Free cash flow', AQ.fcf, d0)+
    qRow('Stock-based compensation', AQ.sbc, d0, 'dfin-sub')+
    qRow('United States', AQ.unitedStates, d0, 'dfin-sub')+
    qRow('Rest of world', AQ.restOfWorld, d0, 'dfin-sub');
  return '<p class="dd-sub">The four quarters these two 10-Qs actually cover. 3Q25 and 4Q25 are not in them, so the series jumps — but the year-over-year pairs (1Q25 to 1Q26, 2Q25 to 2Q26) are clean.</p>'+
    '<div class="dd-chart" style="height:320px"><canvas id="appQtr"></canvas></div>'+
    '<div class="dfin-wrap" style="margin-top:14px"><table class="dfin"><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div>'+
    '<div class="dfin-note">'+esc(AQ_NOTE)+'</div>'+
    '<div class="dd-callout">Two things jump out. Adjusted EBITDA margin moved from <b>80.9%</b> in both 2025 quarters to <b>84.5%</b> and <b>83.9%</b> in 2026 — the leverage is still widening. And research &amp; development more than doubled year over year in 2Q26, almost entirely stock compensation from the October-2025 performance grant, which is why operating margin edged <i>down</i> sequentially even as revenue grew.</div>';
}
function buildQtr(root){
  var cv = root.querySelector('#appQtr'); if(!canBuild(cv)) return; destroy('appQtr');
  var marg = AQ.adjEbitda.map(function(v,i){ return v/AQ.revenue[i]*100; });
  _charts['appQtr'] = new Chart(cv.getContext('2d'), {
    type:'bar',
    data:{ labels:AQ_LABELS, datasets:[
      { label:'Revenue ($M)', data:AQ.revenue, backgroundColor:APP_BRAND, borderRadius:2, maxBarThickness:56, yAxisID:'y' },
      { label:'Adjusted EBITDA ($M)', data:AQ.adjEbitda, backgroundColor:hexA(APP_BRAND,.42), borderRadius:2, maxBarThickness:56, yAxisID:'y' },
      { label:'Adj. EBITDA margin', data:marg, type:'line', borderColor:C_SM, backgroundColor:C_SM,
        borderWidth:2.4, pointRadius:4, tension:.25, fill:false, yAxisID:'y1' } ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
        tooltip:{ callbacks:{ label:function(ctx){ var v=ctx.parsed.y;
          return ctx.dataset.label+': '+(ctx.dataset.yAxisID==='y1' ? v.toFixed(1)+'%' : '$'+Math.round(v).toLocaleString()+'M'); } } } },
      scales:{ x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:10.5 } } },
        y:{ position:'left', grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return '$'+(v/1000).toFixed(1)+'B'; } } },
        y1:{ position:'right', min:70, max:90, grid:{ display:false }, ticks:{ color:C_SM, font:{ size:10 }, callback:function(v){ return v+'%'; } } } } }
  });
}

// ─── Bottom Line ▸ Margins & operating leverage ─────────────────────────────────
function marginsBody(){
  var drv = APP_MARGIN_DRIVERS.map(function(d){
    return '<div class="drv-c"><div class="drv-h"><span class="drv-ic">'+d.ic+'</span><span class="drv-t">'+esc(d.t)+'</span>'+
      '<span class="drv-tag">'+esc(d.tag)+'</span></div><div class="drv-d">'+d.d+'</div>'+
      '<ul class="drv-pts">'+d.pts.map(function(p){ return '<li>'+p+'</li>'; }).join('')+'</ul></div>';
  }).join('');
  return '<p class="dd-sub">Three margins on one axis, 2023 through consensus 2028. The gap between them is interest, tax and stock compensation — and it narrows as the debt stays fixed while revenue triples.</p>'+
    '<div class="dd-chart" style="height:330px"><canvas id="appMargins"></canvas></div>'+
    '<div class="dd-note">Operating margin = operating income ÷ revenue. Adjusted EBITDA margin is on the company definition. Net margin uses net income from continuing operations. Shaded region marks consensus years.</div>'+
    '<div class="dd-h" style="margin-top:22px">The cost base, as a share of revenue</div>'+
    '<p class="dd-sub">Every cost line shrinking against revenue at once is what a genuine operating-leverage story looks like.</p>'+
    '<div class="dd-chart" style="height:300px"><canvas id="appCostMix"></canvas></div>'+
    '<div class="dd-note">Reported cost lines as a percentage of revenue. 2021 and 2022 are absent because AppLovin never restated those years onto a continuing-operations basis.</div>'+
    '<div class="dd-h" style="margin-top:22px">Why the margin goes where it goes</div>'+
    '<div class="drv" style="margin-top:8px">'+drv+'</div>';
}
function buildMargins(root){
  var cv = root.querySelector('#appMargins');
  if(canBuild(cv)){
    destroy('appMargins');
    var idx=[]; for(var i=AM_MIN_FULL;i<=SEG_MAX;i++) idx.push(i);
    var pick=function(arr){ return idx.map(function(i){ var v=arr[i],r=AM_IS.revenue[i]; return (v==null||r==null)?null:(v/r*100); }); };
    _charts['appMargins'] = new Chart(cv.getContext('2d'), {
      type:'line',
      data:{ labels:idx.map(function(i){ return AM_YEARS[i]; }), datasets:[
        { label:'Adjusted EBITDA margin', data:pick(AM_IS.adjEbitda), borderColor:APP_BRAND, backgroundColor:hexA(APP_BRAND,.10), borderWidth:2.6, pointRadius:3.5, tension:.3, fill:true },
        { label:'Operating margin', data:pick(AM_IS.operatingIncome), borderColor:C_SM, backgroundColor:C_SM, borderWidth:2.4, pointRadius:3.5, tension:.3, fill:false },
        { label:'Net margin', data:pick(AM_IS.netIncome), borderColor:C_RD, backgroundColor:C_RD, borderWidth:2.4, pointRadius:3.5, tension:.3, fill:false, borderDash:[5,3] } ] },
      options:{ responsive:true, maintainAspectRatio:false, animation:false,
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
          tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+(ctx.parsed.y==null?'—':ctx.parsed.y.toFixed(1)+'%'); } } } },
        scales:{ x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:10.5 } } },
          y:{ grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return v+'%'; } } } } }
    });
  }
  var cv2 = root.querySelector('#appCostMix');
  if(canBuild(cv2)){
    destroy('appCostMix');
    var idx2=[]; for(var j=AM_MIN_FULL;j<=SEG_MAX;j++) idx2.push(j);
    var share=function(arr){ return idx2.map(function(i){ var v=arr[i],r=AM_IS.revenue[i]; return (v==null||r==null)?null:(v/r*100); }); };
    var ds=[['Cost of revenue',AM_IS.costOfRevenue,C_COGS],['Sales & marketing',AM_IS.salesMarketing,C_SM],
            ['Research & development',AM_IS.researchDev,C_RD],['General & administrative',AM_IS.generalAdmin,C_GA]];
    _charts['appCostMix'] = new Chart(cv2.getContext('2d'), {
      type:'bar',
      data:{ labels:idx2.map(function(i){ return AM_YEARS[i]; }),
        datasets: ds.map(function(d){ return { label:d[0], data:share(d[1]), stack:'s',
          backgroundColor: idx2.map(function(i){ return AM_ISEST[i]?hexA(d[2],.45):d[2]; }),
          borderColor:d[2], borderWidth: idx2.map(function(i){ return AM_ISEST[i]?1.2:0; }), borderRadius:2, maxBarThickness:52 }; }) },
      options:{ responsive:true, maintainAspectRatio:false, animation:false,
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
          tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+(ctx.parsed.y==null?'—':ctx.parsed.y.toFixed(1)+'%'); } } } },
        scales:{ x:{ stacked:true, grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:10.5 } } },
          y:{ stacked:true, grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return v+'%'; } } } } }
    });
  }
}

// ─── Bottom Line ▸ Advertising ecosystem ────────────────────────────────────────
// Faithful replicas of The Trade Desk deck, slides 11 and 14. Column widths follow the
// slide's own pixel proportions (140:24:144:144:438:144:144:24:140) and every colour was
// sampled from the rendered page — see APP_ECO_SOURCE.
function ecoLines(t){ return esc(t).split('\n').join('<br>'); }

function ecoChain(){
  var C = APP_ECO_CHAIN;
  function col(b){
    return '<div class="eco-col" style="background:'+b.bg+';color:'+b.fg+'">'+
      '<span>'+ecoLines(b.t)+'</span></div>';
  }
  var mid = C.middle.map(function(m){
    if(m.row){
      return '<div class="eco-mrow" style="height:'+m.h+'px">'+m.row.map(function(r){
        return '<div class="eco-mbox eco-chip"><span>'+esc(r)+'</span></div>';
      }).join('')+'</div>';
    }
    return '<div class="eco-mbox" style="height:'+m.h+'px"><span>'+ecoLines(m.t)+'</span></div>';
  }).join('');
  return '<div class="eco-slide">'+
    '<div class="eco-title">'+esc(C.title)+'</div>'+
    '<div class="eco-chain">'+
      '<div class="eco-val"><span>'+esc(C.leftValue)+'</span></div>'+
      '<div class="eco-arrow"><span class="eco-line"></span><span class="eco-head eco-head-r"></span></div>'+
      col(C.sell[0])+col(C.sell[1])+
      '<div class="eco-mid">'+mid+'</div>'+
      col(C.buy[0])+col(C.buy[1])+
      '<div class="eco-arrow"><span class="eco-head eco-head-l"></span><span class="eco-line"></span></div>'+
      '<div class="eco-val"><span>'+esc(C.rightValue)+'</span></div>'+
    '</div>'+
  '</div>';
}

function ecoPlayers(){
  var P = APP_ECO_PLAYERS;
  // An item is either a plain wordmark (string) or { n, app, via } — the AppLovin
  // placements, boxed and in the brand colour so they read at a glance.
  function mark(i){
    if(typeof i === 'string') return '<span class="eco-mark">'+esc(i)+'</span>';
    return '<span class="eco-mark eco-mark-app"><b>'+esc(i.n)+'</b>'+
      (i.via ? '<i>'+esc(i.via)+'</i>' : '')+'</span>';
  }
  function isApp(c){ return c.items.some(function(i){ return typeof i !== 'string' && i.app; }); }
  function cell(c){
    return '<div class="eco-cat'+(isApp(c)?' eco-cat-app':'')+'">'+
      '<div class="eco-cat-h">'+ecoLines(c.cat)+'</div>'+
      '<div class="eco-marks">'+c.items.map(mark).join('')+'</div>'+
      (c.note ? '<div class="eco-cat-n">'+esc(c.note)+'</div>' : '')+
    '</div>';
  }
  // A dot sits wherever a column divider meets the rule — four from the top row's
  // boundaries (25/50/75%) and the bottom row's inset edges (11.1 / 37 / 63 / 88.9%).
  var dots = '<div class="eco-rule">'+
    [11.1, 25, 37, 50, 63, 75, 88.9].map(function(p){
      return '<span class="eco-dot" style="left:'+p+'%"></span>';
    }).join('')+
  '</div>';
  return '<div class="eco-slide eco-slide-light">'+
    '<div class="eco-title eco-title-dark">'+esc(P.title)+'</div>'+
    '<div class="eco-legend"><span class="eco-mark eco-mark-app"><b>AppLovin</b><i>product</i></span>'+
      '<span class="eco-legend-t">'+esc(APP_ECO_LEGEND)+'</span></div>'+
    '<div class="eco-grid eco-grid-4">'+P.top.map(cell).join('')+'</div>'+
    dots+
    '<div class="eco-grid eco-grid-3">'+P.bottom.map(cell).join('')+'</div>'+
  '</div>'+
  '<div class="dd-callout">'+APP_ECO_APPNOTE+'</div>';
}

function ecosystemBody(){
  return '<p class="dd-sub">Two slides from The Trade Desk investor deck. The first traces where a dollar of advertiser spend goes before it reaches a publisher, and is reproduced verbatim. The second maps who occupies each layer of that chain — same layout and wording, but with <b>AppLovin marked in every layer where it actually fields a product</b>, not just the single box the source assigns it.</p>'+
    ecoChain()+
    ecoPlayers()+
    '<div class="dd-note">'+esc(APP_ECO_SOURCE)+'</div>';
}

// ─── Bottom Line ▸ Capital & returns ────────────────────────────────────────────
function capitalBody(){
  var kv = APP_CAPRET.map(function(r){
    return '<div class="kv-r"><div class="kv-k">'+esc(r[0])+'</div><div class="kv-v">'+esc(r[1])+'</div></div>';
  }).join('');
  var kpis = [
    ['$3,952M','FY2025 free cash flow','87.6% of adjusted EBITDA'],
    ['$2,192M','FY2025 buyback','5.5M shares retired'],
    ['$1.8B','Authorisation left','at 30 Jun 2026'],
    ['$0.5M','FY2025 capex','the compute is rented'],
  ].map(function(k){ return '<div class="dd-kpi"><div class="dd-kpi-v">'+esc(k[0])+'</div><div class="dd-kpi-k">'+esc(k[1])+'</div><div class="dd-kpi-s">'+esc(k[2])+'</div></div>'; }).join('');
  return '<div class="dd-kpis">'+kpis+'</div>'+
    '<p class="dd-sub">There is no dividend and no acquisition programme of scale. Free cash flow goes to buying back stock, and consensus expects the balance sheet to flip to net cash during 2026 even as the buyback grows.</p>'+
    '<div class="dd-chart" style="height:330px"><canvas id="appCapital"></canvas></div>'+
    '<div class="dd-note">Bars are free cash flow and share repurchases (both cash outflows shown as positive magnitudes). The line is net debt — below zero means net cash. Shaded bars are consensus; the consensus buyback path is a Bloomberg estimate, not an announced programme.</div>'+
    '<div class="kv">'+kv+'</div>';
}
function buildCapital(root){
  var cv = root.querySelector('#appCapital'); if(!canBuild(cv)) return; destroy('appCapital');
  var idx=[]; for(var i=AM_MIN_FULL;i<=SEG_MAX;i++) idx.push(i);
  var pick=function(arr){ return idx.map(function(i){ return arr[i]; }); };
  _charts['appCapital'] = new Chart(cv.getContext('2d'), {
    type:'bar',
    data:{ labels:idx.map(function(i){ return AM_YEARS[i]; }), datasets:[
      { label:'Free cash flow', data:pick(AM_CF.fcf), yAxisID:'y',
        backgroundColor: idx.map(function(i){ return AM_ISEST[i]?hexA(APP_BRAND,.45):APP_BRAND; }),
        borderColor:APP_BRAND, borderWidth: idx.map(function(i){ return AM_ISEST[i]?1.2:0; }), borderRadius:2, maxBarThickness:40 },
      { label:'Share repurchases', data:pick(AM_CF.buyback), yAxisID:'y',
        backgroundColor: idx.map(function(i){ return AM_ISEST[i]?hexA(C_SM,.45):C_SM; }),
        borderColor:C_SM, borderWidth: idx.map(function(i){ return AM_ISEST[i]?1.2:0; }), borderRadius:2, maxBarThickness:40 },
      { label:'Net debt (net cash below 0)', data:pick(AM_BS.netDebt), type:'line', yAxisID:'y',
        borderColor:C_NEG, backgroundColor:C_NEG, borderWidth:2.4, pointRadius:3.5, tension:.25, fill:false } ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
        tooltip:{ callbacks:{ label:function(ctx){ var v=ctx.parsed.y; return ctx.dataset.label+': '+(v==null?'—':fmtMoneyM(v)); } } } },
      scales:{ x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:10.5 } } },
        y:{ grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return '$'+(v/1000).toFixed(0)+'B'; } } } } }
  });
}

// ─── Deep Dive shell ────────────────────────────────────────────────────────────
function deepDiveHtml(c){
  _co = c;
  var h = '<div class="ov ov-app ov-app-dd" data-brand="APP" style="--brand:'+APP_BRAND+';--brand-soft:#EAF1FE">';
  h += styleBlock();
  h += '<div class="dd-callout" style="margin-top:0">'+APP_DD_INTRO+'</div>';
  h += '<div class="dd-tabs">'+
    '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
    '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
  '</div>';
  h += '<div class="dd-pane" data-dd="topline">'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="financials">Financials</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="growth">Growth Engine</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="quarterly">Quarterly</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="financials">'+lensSubpane()+'</div>'+
    '<div class="ovt-subpane" data-ovst="growth" hidden>'+growthBody()+'</div>'+
    '<div class="ovt-subpane" data-ovst="quarterly" hidden>'+quarterlyBody()+'</div>'+
  '</div>';
  h += '<div class="dd-pane" data-dd="bottomline" hidden>'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="ecosystem">Advertising Ecosystem</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="margins">Margins &amp; Leverage</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="capital">Capital &amp; Returns</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="ecosystem">'+ecosystemBody()+'</div>'+
    '<div class="ovt-subpane" data-ovst="margins" hidden>'+marginsBody()+'</div>'+
    '<div class="ovt-subpane" data-ovst="capital" hidden>'+capitalBody()+'</div>'+
  '</div>';
  h += '<div class="ov-foot">'+esc(APP_DD_SOURCES)+' '+esc(AM_SOURCE)+'</div>';
  h += '</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PEER SCATTER (live market-cap bubbles, editable peer set)
// ═══════════════════════════════════════════════════════════════════════════════
var _peers = null;      // working set (clone of the seeds, mutated by add/remove)
var _mcaps = {};        // ticker -> market cap (USD), filled asynchronously

function peerSeed(tk){
  for(var i=0;i<APP_PEERS.length;i++){ if(APP_PEERS[i].tk===tk) return APP_PEERS[i]; }
  return null;
}
function ensurePeers(){ if(!_peers) _peers = APP_PEERS.map(function(p){ return Object.assign({}, p); }); return _peers; }

function renderPeerChips(root){
  var wrap = root.querySelector('[data-prchips]'); if(!wrap) return;
  wrap.innerHTML = ensurePeers().map(function(p){
    if(p.self) return '<span class="pr-chip" style="border-color:'+APP_BRAND+'"><span class="pr-dot"></span>'+esc(p.tk)+'</span>';
    return '<span class="pr-chip'+(p.named?'':' analyst')+'"><span class="pr-dot"></span>'+esc(p.tk)+
      '<button type="button" class="pr-x" data-prdel="'+esc(p.tk)+'" title="Remove">×</button></span>';
  }).join('');
}
function fetchMcaps(root){
  ensurePeers().forEach(function(p){
    if(_mcaps[p.tk]!==undefined) return;
    _mcaps[p.tk] = null;
    try{
      var r = liveQuote(p.tk);
      if(r && typeof r.then==='function'){
        r.then(function(res){
          var q = res && (res.data||res); if(!q) return;
          if(q.marketCap!=null){ _mcaps[p.tk]=q.marketCap; buildScatter(root); }
        }).catch(function(){});
      }
    }catch(e){}
  });
}
function buildScatter(root){
  var cv = root.querySelector('#appScatter'); if(!canBuild(cv)) return; destroy('appScatter');
  var ma = root.querySelector('[data-sctog] button[data-sc].active');
  var mb = root.querySelector('[data-sctog] button[data-scb].active');
  var mMode = (ma && ma.getAttribute('data-sc')) || 'ev';
  var bMode = (mb && mb.getAttribute('data-scb')) || 'fwd';
  var caps = ensurePeers().map(function(p){ return _mcaps[p.tk]; }).filter(function(v){ return v!=null; });
  var maxCap = caps.length ? Math.max.apply(null, caps) : null;
  var dropped = [];
  var pts = ensurePeers().map(function(p){
    var mult = mMode==='pe' ? (bMode==='fwd'?p.peF:p.pe) : (bMode==='fwd'?p.evF:p.ev);
    var g = bMode==='fwd'?p.gF:p.g;
    if(mult==null || g==null){ dropped.push(p.tk); return null; }
    var cap = _mcaps[p.tk];
    var r = (cap!=null && maxCap) ? (7 + 15*Math.sqrt(cap/maxCap)) : (p.self?12:8);
    return { x:mult, y:g, r:r, tk:p.tk, name:p.name, self:!!p.self, named:!!p.named, cap:cap };
  }).filter(Boolean);
  var note = root.querySelector('[data-prnote]');
  if(note){
    var extra = dropped.length ? ' <b>Dropped from this view (no meaningful multiple): '+esc(dropped.join(', '))+'.</b>' : '';
    var capNote = maxCap ? '' : ' <b>Live market cap unavailable right now — bubbles are drawn at a fixed size.</b>';
    note.innerHTML = APP_PEERS_NOTE + extra + capNote;
  }
  _charts['appScatter'] = new Chart(cv.getContext('2d'), {
    type:'bubble',
    data:{ datasets:[{ data:pts,
      backgroundColor:pts.map(function(p){ return p.self?APP_BRAND:(p.named?hexA(APP_BRAND,.32):hexA(C_SM,.32)); }),
      borderColor:pts.map(function(p){ return p.self?APP_BRAND:(p.named?APP_BRAND2:C_SM); }), borderWidth:1.5 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){ var d=ctx.raw;
          return d.name+' ('+d.tk+'): '+d.x.toFixed(1)+'x · '+d.y+'% growth'+(d.cap!=null?(' · $'+(d.cap/1e9).toFixed(0)+'B cap'):' · cap n/a'); } } } },
      scales:{
        x:{ title:{ display:true, text:'cheaper ←   '+(mMode==='pe'?'P/E':'EV/EBITDA')+'   → more expensive', color:'#8A93A0', font:{ size:10.5 } },
            grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return v+'x'; } } },
        y:{ title:{ display:true, text:'slow ←   revenue growth   → fast', color:'#8A93A0', font:{ size:10.5 } },
            grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return v+'%'; } } } } },
    plugins:[{ id:'appScatterLabels', afterDatasetsDraw:function(ch){
      var ctx=ch.ctx; ctx.save(); ctx.font='700 10px Inter, sans-serif'; ctx.fillStyle='#334155'; ctx.textAlign='center';
      ch.getDatasetMeta(0).data.forEach(function(el,i){ var d=pts[i]; if(d) ctx.fillText(d.tk, el.x, el.y-el.options.radius-3); });
      ctx.restore(); } }]
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODAL — hoisted to #co-detailview so it shows from either tab
// ═══════════════════════════════════════════════════════════════════════════════
function modalMarkup(){
  return '<div class="app-modal-back" data-app-modal hidden><div class="app-modal"><div class="app-modal-t"><span data-app-modal-t></span><button type="button" class="app-modal-x" data-app-modal-x>×</button></div><div data-app-modal-b></div></div></div>';
}
function openModal(title, body){
  var back = document.querySelector('.app-modal-back'); if(!back) return;
  back.querySelector('[data-app-modal-t]').innerHTML = title;
  back.querySelector('[data-app-modal-b]').innerHTML = body;
  back.hidden = false;
  requestAnimationFrame(function(){ back.classList.add('on'); });
}
function closeModal(){ var back=document.querySelector('.app-modal-back'); if(!back) return; back.classList.remove('on'); setTimeout(function(){ back.hidden=true; }, 160); }
function wireModal(root){
  var back = root.querySelector('.app-modal-back'); if(!back) return;
  var host = document.getElementById('co-detailview');
  if(host){
    host.querySelectorAll(':scope > .app-modal-back').forEach(function(el){ if(el!==back) el.remove(); });
    if(back.parentNode !== host){ host.appendChild(back); }
  }
  back.addEventListener('click', function(e){ if(e.target===back || e.target.closest('[data-app-modal-x]')) closeModal(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });
}
function productModal(i){
  var f = APP_PRODUCTS[i]; if(!f) return;
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
  grp.addEventListener('click', function(e){
    var btn = e.target.closest('button'); if(!btn || btn.disabled || !grp.contains(btn)) return;
    var keys = Object.keys(btn.dataset); var famAttr = keys[0]; if(!famAttr) return;
    grp.querySelectorAll('button[data-'+famAttr+']').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    cb();
  });
}
function wireCollapsibles(root){
  root.querySelectorAll('.ov-collap-h').forEach(function(btn){
    if(btn._wired) return; btn._wired=true;
    btn.addEventListener('click', function(){
      var box=btn.parentElement, body=btn.nextElementSibling; if(!body) return;
      var open = body.hidden; body.hidden = !open;
      box.classList.toggle('open', open);
      var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent = open?'▾':'▸';
      if(open && box.querySelector('#appScatter')) requestAnimationFrame(function(){ buildScatter(root); });
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
  var root = document.querySelector('.copane[data-pane="overview"] .ov-app:not(.ov-app-dd)') || document.querySelector('.ov-app:not(.ov-app-dd)');
  if(!root) return;
  if(root._wired) return;
  root._wired = true;
  wireCollapsibles(root);
  wireAccordions(root);
  wireModal(root);
  wireToggle(root, '[data-sctog]', function(){ buildScatter(root); });
  root.querySelectorAll('[data-prod]').forEach(function(card){
    if(card._wired) return; card._wired=true;
    card.addEventListener('click', function(){ productModal(parseInt(card.getAttribute('data-prod'),10)); });
  });
  root.querySelectorAll('[data-tlrm]').forEach(function(btn){
    if(btn._wired) return; btn._wired=true;
    btn.addEventListener('click', function(){
      var i=btn.getAttribute('data-tlrm'); var body=root.querySelector('[data-tlbody="'+i+'"]');
      if(body){ var hid=body.hidden; body.hidden=!hid; btn.textContent=hid?'Read less ›':'Read more ›'; }
    });
  });
  // peer set: remove on chip x, add by ticker
  var chips = root.querySelector('[data-prchips]');
  if(chips) chips.addEventListener('click', function(e){
    var b = e.target.closest('[data-prdel]'); if(!b) return;
    var tk = b.getAttribute('data-prdel');
    _peers = ensurePeers().filter(function(p){ return p.tk!==tk; });
    renderPeerChips(root); buildScatter(root);
  });
  var addBtn = root.querySelector('[data-pradd]'), inp = root.querySelector('[data-prin]');
  function addPeer(){
    if(!inp) return;
    var tk = (inp.value||'').trim().toUpperCase(); if(!tk) return;
    inp.value='';
    if(ensurePeers().some(function(p){ return p.tk===tk; })) return;
    var seed = peerSeed(tk);
    // Re-adding a known peer restores its seeded multiples (conventions §4.6).
    _peers.push(seed ? Object.assign({}, seed) : { tk:tk, name:tk, named:false, ev:null, evF:null, pe:null, peF:null, g:null, gF:null });
    renderPeerChips(root); fetchMcaps(root); buildScatter(root);
  }
  if(addBtn) addBtn.addEventListener('click', addPeer);
  if(inp) inp.addEventListener('keydown', function(e){ if(e.key==='Enter'){ e.preventDefault(); addPeer(); } });
  renderPeerChips(root);
  fetchMcaps(root);
  fillMarketCap(root);
}

function fillMarketCap(root){
  var cell = root.querySelector('[data-mcap]'); if(!cell) return;
  try{
    var r = liveQuote('APP');
    if(r && typeof r.then==='function'){
      r.then(function(res){
        var q = res && (res.data||res); if(!q || q.marketCap==null){ cell.textContent='n/a'; return; }
        var d = new Date();
        var mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
        cell.textContent = '$'+(q.marketCap/1e9).toFixed(0)+'B · live '+mon+' '+d.getFullYear();
      }).catch(function(){ cell.textContent='n/a'; });
    } else cell.textContent='n/a';
  }catch(e){ cell.textContent='n/a'; }
}

// ─── Deep Dive wiring ───────────────────────────────────────────────────────────
function buildVisible(root){
  var pane = root.querySelector('.dd-pane:not([hidden])'); if(!pane) return;
  var sub = pane.querySelector('.ovt-subpane:not([hidden])'); if(!sub) return;
  var key = sub.getAttribute('data-ovst');
  if(key==='financials'){
    var card = root.querySelector('.subseg-c:not([hidden])');
    if(card) buildSegView(card, card.getAttribute('data-segview'));
  }
  else if(key==='growth')    requestAnimationFrame(function(){ buildDrivers(root); });
  else if(key==='quarterly') requestAnimationFrame(function(){ buildQtr(root); });
  else if(key==='margins')   requestAnimationFrame(function(){ buildMargins(root); });
  else if(key==='capital')   requestAnimationFrame(function(){ buildCapital(root); });
}

function deepDiveInit(c){
  if(c) _co=c;
  var root = document.querySelector('.copane[data-pane="deepdive"] .ov-app-dd') || document.querySelector('.ov-app-dd');
  if(!root) return;
  if(root._wired){ buildVisible(root); return; }
  root._wired = true;

  root.querySelectorAll('.dd-tab').forEach(function(btn){
    btn.addEventListener('click', function(){
      var k = btn.getAttribute('data-dd');
      root.querySelectorAll('.dd-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
      root.querySelectorAll('.dd-pane').forEach(function(p){ p.hidden = p.getAttribute('data-dd')!==k; });
      buildVisible(root);
    });
  });
  root.querySelectorAll('.dd-pane').forEach(function(pane){
    pane.querySelectorAll(':scope > .ovt-subtabs > .ovt-subtab').forEach(function(btn){
      btn.addEventListener('click', function(){
        var key = btn.getAttribute('data-ovst');
        pane.querySelectorAll(':scope > .ovt-subtabs > .ovt-subtab').forEach(function(b){ b.classList.toggle('active', b===btn); });
        pane.querySelectorAll(':scope > .ovt-subpane').forEach(function(p){ p.hidden = p.getAttribute('data-ovst')!==key; });
        buildVisible(root);
      });
    });
  });
  // lens selector
  wireToggle(root, '[data-segseltog]', function(){
    var v = root.querySelector('[data-segseltog] button.active').getAttribute('data-ss');
    root.querySelectorAll('[data-segview]').forEach(function(el){ el.hidden = el.getAttribute('data-segview')!==v; });
    var card = root.querySelector('.subseg-c[data-segview="'+v+'"]');
    if(card){ segSyncControls(card, v); buildSegView(card, v); }
  });
  // per-lens explorer controls
  root.querySelectorAll('.subseg-c').forEach(function(card){
    var lens = card.getAttribute('data-segview');
    segSyncControls(card, lens);
    wireToggle(card, '.seg-metric', function(){ segSyncControls(card, lens); buildSegView(card, lens); });
    wireToggle(card, '.seg-mode',   function(){ buildSegView(card, lens); });
    wireToggle(card, '.seg-view',   function(){ buildSegView(card, lens); });
    var bwrap = card.querySelector('.seg-break');
    if(bwrap) bwrap.addEventListener('click', function(e){
      var b=e.target.closest('button'); if(!b||b.disabled) return;
      bwrap.querySelectorAll('button').forEach(function(x){ x.classList.toggle('active', x===b); });
      buildSegView(card, lens);
    });
    card.querySelectorAll('.seg-from, .seg-to').forEach(function(sel){ sel.addEventListener('change', function(){ buildSegView(card, lens); }); });
    buildSegView(card, lens);
  });
  buildVisible(root);
}

export var appOverview = { html: html, init: init, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
