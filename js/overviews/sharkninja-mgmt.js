// overviews/sharkninja-mgmt.js — SharkNinja Deep Dive ▸ Management, on AMAZON'S code.
//
// Executives & Board · Ownership · Governance & SBC · Track Record — the four bodies are copied from
// js/overviews/amzn.js (AMZN_MGMT via the shared makeManagement mold, amznOwnBody, amznGovBody,
// AMZN_TRK_RATE / amznTrackBody, plus the EW_CSS box styles and ewBoxes they depend on). The only
// change is the data: every company fact comes from ./sharkninja-mgmt-data.js (proxy DEF 14A, 10-K,
// 13G/A, Form 4, IR), so the markup, the CV modal, the rated track cards and the live Fiscal.ai
// insider slot (#dd-mgmt-slot, filled by companies.js) are identical to Amazon's.

import { makeManagement } from './management.js';
import { SUMMIT_CAT } from '../viz-palette.js';
import { SN_MGMT_CFG, SN_OWN, SN_GOV, SN_TRACK, SN_TRACK_CALLOUT, SN_TRACK_FOOT } from './sharkninja-mgmt-data.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&(?!#?\w+;)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
var BRAND=SUMMIT_CAT[0], BRAND2=SUMMIT_CAT[1];

// ── amzn.js EW_CSS (verbatim) — the .ew-* box styles Ownership/Governance render with. Amazon gets
// them from its Bottom Line expense dives; SN has no such pane, so they ship with this module.
var EW_CSS='<style>'+
  '.ew-h{font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--brand-2);margin:18px 0 9px;display:flex;align-items:center;gap:8px}.ew-h::after{content:"";flex:1;height:1px;background:var(--bdr)}'+
  '.ew-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:560px){.ew-two{grid-template-columns:1fr}}'+
  '.ew-box{border:1px solid var(--bdr);border-radius:10px;padding:12px 14px;background:var(--card,#fff)}'+
  '.ew-box-h{font-size:13px;font-weight:800;color:var(--navy);display:flex;align-items:center;gap:8px;margin-bottom:5px}.ew-box-i{font-size:18px}'+
  '.ew-box-t{font-size:11.5px;color:var(--navy);line-height:1.5}'+
  '.ew-note{font-size:12px;color:var(--navy);background:rgba(20,110,180,.06);border-radius:8px;padding:9px 12px;margin-top:9px;line-height:1.5}'+
'</style>';
function ewBoxes(arr){ return '<div class="ew-two"'+(arr.length<2?' style="grid-template-columns:1fr"':'')+'>'+arr.map(function(b){ return '<div class="ew-box"><div class="ew-box-h"><span class="ew-box-i">'+b[0]+'</span>'+b[1]+'</div><div class="ew-box-t">'+b[2]+'</div></div>'; }).join('')+'</div>'; }
function kpis(list){ return '<div class="ov-kpis">'+(list||[]).map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-v">'+k[0]+'</div><div class="ov-kpi-d muted">'+k[1]+'</div></div>'; }).join('')+'</div>'; }

// ── Executives & Board (amzn.js AMZN_MGMT) ──
var cfg = {}; for (var k in SN_MGMT_CFG) cfg[k] = SN_MGMT_CFG[k];
cfg.brand = BRAND;
export var SN_MGMT = makeManagement(cfg);

// ── Ownership (amzn.js amznOwnBody) ──
export function snOwnBody(){
  var o = SN_OWN || {};
  var h=EW_CSS+'<p class="ov-lede">'+(o.lede||'')+'</p>';
  h+=kpis(o.kpis);
  h+='<div class="ov-sec-h">Who owns SharkNinja</div>';
  h+=ewBoxes(o.boxes||[]);
  h+='<div class="ov-sec-h" style="margin-top:16px">Capital returned to shareholders</div>';
  h+='<div class="ov-fynote">'+(o.capitalReturned||'')+'</div>';
  h+='<div class="ov-sec-h" style="margin-top:18px">Executives &amp; insider activity — live from Fiscal.ai</div>';
  h+='<div id="dd-mgmt-slot"></div>';   // filled by companies.js (the same live table as Pillars ▸ Management)
  h+='<div class="ov-foot">'+(o.foot||'')+'</div>';
  return h;
}

// ── Governance & SBC (amzn.js amznGovBody) ──
export function snGovBody(){
  var g = SN_GOV || {};
  var h=EW_CSS+'<p class="ov-lede">'+(g.lede||'')+'</p>';
  h+=kpis(g.kpis);
  h+=ewBoxes(g.boxes||[]);
  h+='<div class="ov-fynote">'+(g.fynote||'')+'</div>';
  if(g.relatedParty) h+='<div class="ov-sec-h" style="margin-top:16px">Related parties — JS Global</div><div class="ov-fynote">'+g.relatedParty+'</div>';
  h+='<div class="ov-foot">'+(g.foot||'')+'</div>';
  return h;
}

// ── Track Record (amzn.js AMZN_TRK_RATE / amznTrackBody) ──
var SN_TRK_RATE={ green:{c:'#06965A',bg:'rgba(6,150,90,0.09)',bd:'rgba(6,150,90,0.34)',l:'Value creator'},
  amber:{c:'#B7791F',bg:'rgba(183,121,31,0.10)',bd:'rgba(183,121,31,0.34)',l:'Mixed / unproven'} };
export function snTrackBody(){
  var legend=Object.keys(SN_TRK_RATE).map(function(k){ var r=SN_TRK_RATE[k]; return '<span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:var(--navy)"><span style="width:10px;height:10px;border-radius:50%;background:'+r.c+'"></span>'+r.l+'</span>'; }).join('');
  var cards=(SN_TRACK||[]).map(function(m){ var r=SN_TRK_RATE[m.rate]||SN_TRK_RATE.amber;
    return '<div class="ov-clickable" data-detail="exec:'+esc(m.id)+'" style="border:1px solid '+r.bd+';border-left:4px solid '+r.c+';background:'+r.bg+';border-radius:11px;padding:13px 15px;cursor:pointer">'+
      '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap"><div style="font-size:13.5px;font-weight:800;color:var(--navy)">'+esc(m.n)+'</div><div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:'+r.c+'">'+r.l+'</div></div>'+
      '<div style="font-size:11px;color:var(--mu);font-weight:600;margin:1px 0 8px">'+esc(m.role)+' · at SharkNinja since '+esc(m.since)+'</div>'+
      '<div style="font-size:11.5px;color:var(--navy);line-height:1.5;margin-bottom:6px"><b style="color:'+r.c+'">At SharkNinja:</b> '+m.sn+'</div>'+
      '<div style="font-size:11.5px;color:var(--navy);line-height:1.5"><b style="color:var(--mu)">Context:</b> '+m.prior+'</div>'+
      '<div class="ov-more" style="margin-top:7px;font-size:10.5px;font-weight:800;color:'+BRAND2+'">Full track record ›</div></div>';
  }).join('');
  var h='<p class="ov-lede">The people running SharkNinja today, rated on <b>what they have actually built</b>. Color = the net read; <b>tap a card</b> for the full history. (Management only — board and ownership are separate tabs.)</p>';
  h+='<div style="display:flex;gap:14px;flex-wrap:wrap;margin:0 0 12px">'+legend+'</div>';
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:11px">'+cards+'</div>';
  if(SN_TRACK_CALLOUT) h+='<div class="ov-callout" style="margin-top:14px">'+SN_TRACK_CALLOUT+'</div>';
  h+='<div class="ov-foot">'+(SN_TRACK_FOOT||'')+'</div>';
  return h;
}
// The track-card modal, resolved like amzn.js wireModal's 'exec:' kind.
export function snTrackPop(id){
  var ex=(SN_TRACK||[]).filter(function(x){ return x.id===id; })[0];
  return ex ? { t: ex.n + ' — ' + ex.role, h: ex.detail } : null;
}
