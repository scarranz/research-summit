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
  DIS_MAP, DIS_MAP_LEGEND, DIS_DRIVERS, DIS_OV_SOURCES, DIS_DD_SOURCES,
  DIS_MGMT, DIS_MGMT_NOTE, DIS_CAPRET, DIS_VAL_READ,
  DIS_PLAN_FACTS, DIS_PLAN_THESIS, DIS_PLAN_ALLOC, DIS_PLAN_ALLOC_NOTE, DIS_PLAN_CAPEX_NOTE,
  DIS_PLAN_PILLARS, DIS_PLAN_GROWTH, DIS_PLAN_SOURCES,
  DIS_RET_THESIS, DIS_USEFUL_LIVES, DIS_LIVES_NOTE, DIS_DEPR_MATH, DIS_RET_PHASES, DIS_RET_CHART_NOTE,
  DIS_DEPR_CALC, DIS_PROJECTS, DIS_PROJ_BUCKETS, DIS_PROJ_REGIONS,
  DIS_DPLUS_KPIS, DIS_DPLUS_STUDIOS, DIS_DPLUS_SLATE, DIS_DPLUS_STRATEGY, DIS_DPLUS_NOTE,
  DIS_MOVIES_INTRO, DIS_MOVIES_PAST, DIS_MOVIES_PAST_NOTE, DIS_LINEAR_INTRO, DIS_LINEAR_POINTS, DIS_LINEAR_CHART_NOTE,
  DIS_ESPN_INTRO, DIS_ESPN_KPIS, DIS_ESPN_NFL, DIS_ESPN_RIGHTS, DIS_ESPN_RIGHTS_NOTE, DIS_ESPN_INSIGHTS,
  DIS_CRUISE_INTRO, DIS_CRUISE_FLEET, DIS_CRUISE_FLEET_NOTE,
  DIS_CRUISE_BUILD, DIS_CRUISE_BUILD_NOTE,
  DIS_CRUISE_ECON_LEAD, DIS_CRUISE_ECON, DIS_CRUISE_ECON_NOTE,
  DIS_CRUISE_SHIP_LEAD, DIS_CRUISE_SHIP, DIS_CRUISE_SHIP_NOTE,
  DIS_PARKS_INTRO, DIS_PARKS_FOOTPRINT, DIS_PARKS_FOOTPRINT_NOTE,
  DIS_PARKS_BUILD_LEAD, DIS_PARKS_BUILD, DIS_PARKS_BUILD_NOTE,
  DIS_PARKS_CAP_LEAD, DIS_PARKS_CAP, DIS_PARKS_CAP_NOTE,
  DIS_BUILDOUT_INTRO, DIS_BUILDOUT_INPUTS, DIS_BUILDOUT_BASE, DIS_BUILDOUT_NOTE
} from './dis-data.js';
import { WORLD_VB, WORLD_PATHS } from './world-paths.js';
import {
  DM_YEARS, DM_ISEST, DM_LAST_ACTUAL, DM_EST_FROM,
  DM_IS, DM_SEG, DM_SEG_DETAIL, DM_STREAM, DM_CF, DM_BS, DM_SOURCE
} from './dis-model.js';

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
    // subsegments cards
    '.subseg-grid{display:grid;grid-template-columns:1fr;gap:12px}'+
    '.subseg-c{border:1px solid var(--bdr);border-left:4px solid var(--seg,'+DIS_BRAND+');border-radius:11px;padding:13px 15px;background:var(--w)}'+
    '.subseg-h{display:flex;align-items:center;gap:8px;margin-bottom:4px}'+
    '.subseg-dot{width:11px;height:11px;border-radius:3px;background:var(--seg,'+DIS_BRAND+');flex:none}'+
    '.subseg-t{font-size:13.5px;font-weight:800;color:var(--navy)}'+
    // per-segment toggle: active pill takes the segment color
    '.dmm-tog button.active[data-ss="ent"]{background:'+SEG_ENT+'}'+
    '.dmm-tog button.active[data-ss="spt"]{background:'+SEG_SPT+'}'+
    '.dmm-tog button.active[data-ss="exp"]{background:'+SEG_EXP+'}'+
    // financial summary table
    '.dfin-wrap{overflow-x:auto;margin:2px 0 4px}'+
    '.dfin{border-collapse:collapse;width:100%;min-width:560px;font-size:11.5px}'+
    '.dfin th,.dfin td{padding:6px 10px;text-align:right;border-bottom:1px solid var(--bdr);white-space:nowrap}'+
    '.dfin th:first-child,.dfin td:first-child{text-align:left;font-weight:700;color:var(--navy)}'+
    '.dfin thead th{font-size:10px;text-transform:uppercase;letter-spacing:.03em;color:var(--mu);border-bottom:2px solid var(--bdr)}'+
    '.dfin thead th.est,.dfin td.est{background:var(--brand-soft)}'+
    '.dfin thead th.est{color:'+DIS_BRAND+'}'+
    '.dfin td{color:var(--navy);font-weight:600}'+
    '.dfin tr.sub td:first-child{font-weight:600;color:var(--mu);padding-left:18px}'+
    '.dfin-note{font-size:10px;color:var(--mu);margin:6px 0 0}'+
    '.dfin-est-key{display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--brand-soft);border:1px solid '+DIS_BRAND+';vertical-align:-1px;margin-right:4px}'+
    '.dfin tr.dfin-tot td{border-top:2px solid var(--bdr);font-weight:800;color:var(--navy)}'+
    '.dfin td.cagr,.dfin th.cagr{border-left:1px solid var(--bdr);font-weight:800}'+
    '.exp-ctrls{display:flex;flex-wrap:wrap;gap:10px 14px;align-items:center;margin:12px 0 6px}'+
    '.exp-range{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:2px 0 12px;font-size:11.5px;font-weight:700;color:var(--mu)}'+
    '.exp-ysel{font:inherit;font-size:11.5px;font-weight:700;color:var(--navy);border:1px solid var(--bdr);border-radius:7px;padding:4px 9px;background:var(--w);cursor:pointer}'+
    // $60B expansion plan
    '.plan-alloc{display:flex;height:30px;border-radius:8px;overflow:hidden;border:1px solid var(--bdr);margin:8px 0 6px}'+
    '.plan-alloc-seg{display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:800;white-space:nowrap;min-width:0}'+
    '.plan-legend{display:flex;flex-wrap:wrap;gap:14px;margin:2px 0 4px}'+
    '.plan-lg{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--navy)}'+
    '.plan-lg-dot{width:11px;height:11px;border-radius:3px;flex:none}'+
    '.plan-pill{border:1px solid var(--bdr);border-left:4px solid var(--seg,'+DIS_BRAND+');border-radius:11px;padding:12px 15px;background:var(--w);margin-top:11px}'+
    '.plan-pill-h{display:flex;align-items:center;gap:9px}'+
    '.plan-pill-ic{font-size:20px;line-height:1}.plan-pill-n{font-size:13.5px;font-weight:800;color:var(--navy)}'+
    '.plan-pill-tag{font-size:9px;font-weight:800;color:var(--mu);text-transform:uppercase;letter-spacing:.04em;margin-left:auto;background:#F2F5F8;border-radius:20px;padding:3px 10px}'+
    '.plan-item{border-top:1px solid var(--bdr);padding:9px 0 3px;margin-top:8px}'+
    '.plan-item:first-of-type{margin-top:10px}'+
    '.plan-item-h{display:flex;justify-content:space-between;gap:10px;align-items:baseline;flex-wrap:wrap}'+
    '.plan-item-n{font-size:12px;font-weight:800;color:var(--navy)}'+
    '.plan-item-w{font-size:10.5px;font-weight:700;color:'+DIS_BRAND+';white-space:nowrap}'+
    '.plan-item-d{font-size:11.5px;color:var(--mu);line-height:1.5;margin-top:3px}'+
    // Where / What / How segmented tabs
    '.wwh-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:2px 0 18px}'+
    '.wwh-tab{border:1px solid var(--bdr);border-top:3px solid transparent;border-radius:12px;padding:12px 15px;background:var(--w);cursor:pointer;text-align:left;transition:.14s;display:flex;flex-direction:column;gap:2px}'+
    '.wwh-tab:hover{box-shadow:0 3px 10px rgba(0,0,0,.07)}'+
    '.wwh-tab.active{border-color:'+DIS_BRAND+';border-top-color:'+DIS_BRAND+';background:var(--brand-soft)}'+
    '.wwh-ic{font-size:20px;line-height:1}.wwh-t{font-size:14px;font-weight:800;color:var(--navy)}'+
    '.wwh-tab.active .wwh-t{color:'+DIS_BRAND+'}'+
    '.wwh-sub{font-size:10.5px;color:var(--mu);line-height:1.3}'+
    '.wwh-pane[hidden]{display:none}'+
    '.wwh-tabs.two{grid-template-columns:repeat(2,1fr)}'+
    '@media(max-width:640px){.wwh-tabs,.wwh-tabs.two{grid-template-columns:1fr}}'+
    // What explorer — filters, chips, views
    '.wf-row{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;margin:2px 0 10px}'+
    '.wf-lbl{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu)}'+
    '.wf-chips{display:inline-flex;flex-wrap:wrap;gap:5px}'+
    '.wchip{border:1px solid var(--bdr);background:var(--w);border-radius:20px;padding:4px 11px;font:inherit;font-size:11px;font-weight:700;color:var(--mu);cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:.12s}'+
    '.wchip:hover{color:var(--navy)}.wchip.active{background:var(--navy);color:#fff;border-color:var(--navy)}'+
    '.wchip-dot{width:9px;height:9px;border-radius:3px;flex:none}'+
    '.wproj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;align-items:start}'+
    '.wproj{border:1px solid var(--bdr);border-left:4px solid var(--seg);border-radius:11px;padding:12px 14px;background:var(--w)}'+
    '.wproj-h{display:flex;justify-content:space-between;gap:10px;align-items:baseline}'+
    '.wproj-n{font-size:12.5px;font-weight:800;color:var(--navy)}.wproj-w{font-size:10.5px;font-weight:700;color:'+DIS_BRAND+';white-space:nowrap}'+
    '.wproj-loc{font-size:11px;font-weight:700;color:var(--mu);margin:2px 0 4px}'+
    '.wproj-d{font-size:11px;color:var(--mu);line-height:1.5}'+
    '.wproj-tags{margin-top:7px;display:flex;flex-wrap:wrap;gap:5px}'+
    '.wproj-tag{font-size:9px;font-weight:800;border-radius:20px;padding:2px 8px}'+
    '.wempty{color:var(--mu);font-size:12px;padding:16px;text-align:center;border:1px dashed var(--bdr);border-radius:10px}'+
    // timeline
    '.wtl{position:relative;margin:6px 0 0;padding-left:64px}'+
    '.wtl:before{content:"";position:absolute;left:52px;top:6px;bottom:6px;width:2px;background:var(--bdr)}'+
    '.wtl-row{position:relative;margin-bottom:14px}'+
    '.wtl-yr{position:absolute;left:-64px;top:0;width:44px;text-align:right;font-size:12px;font-weight:800;color:var(--navy)}'+
    '.wtl-dot{position:absolute;left:-16px;top:5px;width:11px;height:11px;border-radius:50%;background:var(--seg);border:2px solid var(--w);box-shadow:0 0 0 1px var(--bdr)}'+
    '.wtl-card{border:1px solid var(--bdr);border-left:3px solid var(--seg);border-radius:9px;padding:8px 12px;background:var(--w)}'+
    '.wtl-n{font-size:12px;font-weight:800;color:var(--navy)}.wtl-loc{font-size:10.5px;color:var(--mu)}'+
    '.wtl-clk{cursor:pointer;transition:.12s}.wtl-clk:hover{border-color:'+DIS_BRAND+';box-shadow:0 2px 8px rgba(0,0,0,.06)}'+
    '.wtl-cardh{display:flex;justify-content:space-between;align-items:center;gap:10px}'+
    '.wtl-caret{color:var(--mu);font-size:11px;flex:none;transition:transform .15s}'+
    '.wtl-clk.open .wtl-caret{transform:rotate(90deg)}'+
    '.wtl-det{margin-top:8px;padding-top:8px;border-top:1px solid var(--bdr)}'+
    '.wtl-detd{font-size:11.5px;color:var(--navy);line-height:1.55}'+
    // map
    '.wmap{border:1px solid var(--bdr);border-radius:12px;overflow:hidden;background:#EAF2F8}'+
    '.wmap-svg{display:block;width:100%;height:auto}'+
    '.wmap-pin{cursor:pointer;transition:r .12s,stroke-width .12s}.wmap-pin:hover{r:9}'+
    '.wmap-pin.sel{r:10;stroke:#0F172A;stroke-width:3}'+
    '.wmap-panel{border:1px solid var(--bdr);border-left:4px solid var(--seg,'+DIS_BRAND+');border-radius:11px;padding:12px 15px;background:#FBFCFD;margin-top:10px}'+
    '.wmap-panel-n{font-size:13px;font-weight:800;color:var(--navy)}.wmap-panel-loc{font-size:11px;font-weight:700;color:var(--mu);margin:1px 0 6px}'+
    '.wmap-panel-d{font-size:11.5px;color:var(--navy);line-height:1.55}'+
    '.wmap-off{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}'+
    '.wmap-offchip{border:1px solid var(--bdr);border-radius:8px;padding:6px 10px;font-size:10.5px;font-weight:700;color:var(--navy);cursor:pointer;display:inline-flex;align-items:center;gap:6px;background:var(--w)}'+
    // returns & depreciation — useful-lives table
    '.rlt{border-collapse:collapse;width:100%;min-width:520px;font-size:11.5px}'+
    '.rlt th,.rlt td{text-align:left;padding:8px 12px;border-bottom:1px solid var(--bdr);vertical-align:top}'+
    '.rlt thead th{font-size:10px;text-transform:uppercase;letter-spacing:.03em;color:var(--mu);border-bottom:2px solid var(--bdr)}'+
    '.rlt tbody tr:last-child td{border-bottom:none}'+
    '.rlt td:first-child{font-weight:800;color:var(--navy);white-space:nowrap}'+
    '.rlt .rlt-life{font-weight:800;color:'+DIS_BRAND+';white-space:nowrap}.rlt .rlt-n{color:var(--mu);line-height:1.45}'+
    // J-curve
    '.jc{border:1px solid var(--bdr);border-radius:12px;background:var(--w);padding:8px 10px;margin:0 0 12px}'+
    '.jc-svg{display:block;width:100%;height:auto}'+
    // Disney+ slate + strategy
    '.dsl{display:flex;flex-direction:column;gap:6px}'+
    '.dsl-row{display:flex;align-items:center;gap:12px;border:1px solid var(--bdr);border-left:3px solid var(--seg,'+DIS_BRAND+');border-radius:9px;padding:9px 13px;background:var(--w)}'+
    '.dsl-date{font-size:10.5px;font-weight:800;color:var(--mu);min-width:70px;flex:none}'+
    '.dsl-main{flex:1;min-width:0}.dsl-t{font-size:12px;font-weight:800;color:var(--navy)}.dsl-why{font-size:11px;color:var(--mu);line-height:1.4;margin-top:1px}'+
    '.dsl-type{font-size:9px;font-weight:800;border-radius:20px;padding:3px 9px;white-space:nowrap;flex:none}'+
    // Movies ▸ Past — box-office bar list
    '.mvb{display:flex;flex-direction:column;gap:5px}'+
    '.mvb-row{display:flex;align-items:center;gap:12px}'+
    '.mvb-name{width:238px;flex:none;display:flex;align-items:baseline;gap:7px;min-width:0}'+
    '.mvb-dot{width:7px;height:7px;border-radius:50%;flex:none;align-self:center}'+
    '.mvb-t{font-size:11.5px;font-weight:800;color:var(--navy);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
    '.mvb-d{font-size:9.5px;font-weight:700;color:var(--mu);flex:none}'+
    '.mvb-track{position:relative;flex:1;height:15px;background:#F2F5F8;border-radius:5px;min-width:60px}'+
    '.mvb-fill{position:absolute;left:0;top:0;bottom:0;border-radius:5px;min-width:2px}'+
    '.mvb-avg{position:absolute;top:-3px;bottom:-3px;width:2px;background:var(--navy);opacity:.5;z-index:2}'+
    '.mvb-v{width:62px;flex:none;text-align:right;font-size:11.5px;font-weight:800;color:var(--navy)}'+
    '.mvb-legend{font-size:9.5px;font-weight:700;color:var(--mu);margin:2px 0 10px;display:flex;align-items:center;gap:6px}'+
    '.mvb-legend i{display:inline-block;width:2px;height:11px;background:var(--navy);opacity:.5;vertical-align:middle}'+
    // Sports (ESPN) ▸ NFL deal anatomy
    '.espn-deal{border:1px solid var(--bdr);border-radius:13px;background:linear-gradient(180deg,#F7F9FC,var(--w));padding:16px 16px 14px;margin:4px 0 8px}'+
    '.espn-swap{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:stretch}'+
    '.espn-swap-col{display:flex;flex-direction:column;gap:7px}'+
    '.espn-swap-h{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);display:flex;align-items:center;gap:6px}'+
    '.espn-swap-h b{color:var(--navy)}'+
    '.espn-swap-c{border:1px solid var(--bdr);border-radius:9px;background:var(--w);padding:8px 11px}'+
    '.espn-swap-c.eg{border-left:3px solid #1D3FB8}.espn-swap-c.ng{border-left:3px solid #2FA36B}'+
    '.espn-swap-t{font-size:12px;font-weight:800;color:var(--navy)}.espn-swap-d{font-size:10.5px;color:var(--mu);line-height:1.4;margin-top:2px}'+
    '.espn-swap-mid{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-width:78px}'+
    '.espn-swap-ar{font-size:24px;color:var(--brand);line-height:1;font-weight:800}'+
    '.espn-swap-eq{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--mu);text-align:center;line-height:1.3}'+
    '.espn-mnf{margin-top:13px;border-top:1px dashed var(--bdr);padding-top:12px}'+
    '.espn-mnf-h{font-size:12px;font-weight:800;color:var(--navy);display:flex;flex-wrap:wrap;align-items:baseline;gap:8px;margin-bottom:9px}'+
    '.espn-mnf-tag{font-size:9.5px;font-weight:800;color:#1D3FB8;background:rgba(29,63,184,.1);border-radius:20px;padding:2px 9px}'+
    '.espn-mnf-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:9px}'+
    '.espn-mnf-c{border:1px solid var(--bdr);border-radius:9px;background:var(--w);padding:9px 11px}'+
    '.espn-mnf-t{font-size:11.5px;font-weight:800;color:var(--navy)}.espn-mnf-d{font-size:10.5px;color:var(--mu);line-height:1.4;margin-top:2px}'+
    // Sports (ESPN) ▸ rights portfolio Gantt timeline
    '.espn-gwrap{border:1px solid var(--bdr);border-radius:12px;background:var(--w);padding:12px 14px 6px;overflow:hidden}'+
    '.espn-axis{position:relative;height:16px;margin:0 0 4px}'+
    '.espn-axis-yr{position:absolute;top:0;transform:translateX(-50%);font-size:9px;font-weight:700;color:var(--mu)}'+
    '.espn-grid{position:absolute;top:0;bottom:0;width:1px;background:#EEF2F7}'+
    '.espn-gantt{position:relative;padding-top:2px}'+
    '.espn-grow{position:relative;z-index:2;display:flex;align-items:center;gap:10px;height:26px}'+
    '.espn-glabel{width:210px;flex:none;display:flex;align-items:center;gap:7px;min-width:0}'+
    '.espn-gemoji{font-size:13px;flex:none;width:16px;text-align:center}'+
    '.espn-gname{font-size:11.5px;font-weight:800;color:var(--navy);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
    '.espn-gfee{font-size:9.5px;font-weight:700;color:var(--mu);flex:none;margin-left:auto;padding-left:6px}'+
    '.espn-gtrack{position:relative;flex:1;height:100%;min-width:80px}'+
    '.espn-gbar{position:absolute;top:6px;height:14px;border-radius:7px;display:flex;align-items:center;box-shadow:inset 0 0 0 1px rgba(255,255,255,.25)}'+
    '.espn-gbar.clip-l{border-top-left-radius:2px;border-bottom-left-radius:2px}'+
    '.espn-gend{position:absolute;top:5px;font-size:9px;font-weight:800;white-space:nowrap;line-height:16px}'+
    '.espn-todaywrap{position:absolute;left:220px;right:0;top:0;bottom:6px;pointer-events:none;z-index:5}'+
    '.espn-gtoday{position:absolute;top:0;bottom:0;width:0;border-left:2px dotted var(--navy);opacity:.6}'+
    '.espn-gtoday b{position:absolute;top:-15px;left:50%;transform:translateX(-50%);font-size:8.5px;font-weight:800;color:var(--navy);background:var(--w);padding:0 3px;white-space:nowrap}'+
    '.espn-glegend{display:flex;flex-wrap:wrap;gap:14px;font-size:10px;font-weight:700;color:var(--mu);margin:9px 2px 2px}'+
    '.espn-glegend span{display:inline-flex;align-items:center;gap:5px}'+
    '.espn-glegend i{width:11px;height:11px;border-radius:3px;display:inline-block}'+
    // What ▸ Cruise deep-dive — fleet list + economics
    '.crus{display:flex;flex-direction:column;gap:6px}'+
    '.crus-grp{display:flex;align-items:baseline;gap:8px;font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin:12px 2px 5px}'+
    '.crus-grp b{color:var(--navy);font-size:12px;text-transform:none;letter-spacing:0}'+
    '.crus-row{display:flex;align-items:center;gap:12px;border:1px solid var(--bdr);border-left:3px solid var(--seg,#1E88C7);border-radius:9px;padding:8px 12px;background:var(--w)}'+
    '.crus-row.order{border-left-style:dashed;background:#FAFBFD}'+
    '.crus-yr{font-size:10.5px;font-weight:800;color:var(--mu);width:40px;flex:none}'+
    '.crus-main{width:216px;flex:none;min-width:0}'+
    '.crus-n{font-size:12px;font-weight:800;color:var(--navy);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
    '.crus-n .crus-cls{font-size:9px;font-weight:800;color:#1E88C7;background:rgba(30,136,199,.12);border-radius:20px;padding:1px 7px;margin-left:6px;vertical-align:middle}'+
    '.crus-sub{font-size:10px;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}'+
    '.crus-bar{position:relative;flex:1;height:14px;background:#F2F5F8;border-radius:5px;min-width:50px}'+
    '.crus-fill{position:absolute;left:0;top:0;bottom:0;border-radius:5px;min-width:3px}'+
    '.crus-pax{width:104px;flex:none;text-align:right;font-size:11px;font-weight:800;color:var(--navy);line-height:1.2}'+
    '.crus-pax span{display:block;font-size:8.5px;font-weight:700;color:var(--mu)}'+
    '.cru-econ-lead{font-size:12px;font-weight:700;color:var(--navy);line-height:1.5;margin:2px 0 10px}'+
    '.cru-econ-lead b{color:#1E88C7}'+
    '.cru-hl{display:inline;background:linear-gradient(180deg,transparent 62%,rgba(30,136,199,.22) 0)}'+
    // Full Buildout — interactive sensitivity model
    '.bo-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px 22px;margin:12px 0 6px}'+
    '.bo-in{display:flex;flex-direction:column;gap:5px}'+
    '.bo-in label{font-size:11px;font-weight:700;color:var(--navy);display:flex;justify-content:space-between;align-items:baseline;gap:8px}'+
    '.bo-val{font-size:12.5px;font-weight:800;color:var(--brand);white-space:nowrap}'+
    '.bo-sl{width:100%;height:5px;accent-color:var(--brand);cursor:pointer;margin:0}'+
    '.bo-seg{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);grid-column:1/-1;margin:6px 0 -4px;border-top:1px solid var(--bdr);padding-top:9px}'+
    '.bo-seg:first-child{border-top:none;padding-top:0;margin-top:0}'+
    '.dstr{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px}'+
    '.dstr-c{border:1px solid var(--bdr);border-top:3px solid '+DIS_BRAND+';border-radius:11px;padding:12px 14px;background:var(--w)}'+
    '.dstr-t{font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:4px}.dstr-d{font-size:11.5px;color:var(--mu);line-height:1.5}'+
    // collapsible deep-dive sections
    '.dcol{border:1px solid var(--bdr);border-radius:11px;margin:10px 0;overflow:hidden;background:var(--w)}'+
    '.dcol-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:12px 15px;cursor:pointer;display:flex;align-items:center;gap:9px}'+
    '.dcol-h:hover{background:#EEF2F6}.dcol-ic{font-size:10px;color:var(--mu);flex:none}'+
    '.dcol-b{padding:13px 15px 15px}.dcol-b[hidden]{display:none}'+
    '.rph{display:flex;flex-direction:column;gap:8px;margin-top:8px}'+
    '.rph-c{display:flex;gap:13px;align-items:baseline;border:1px solid var(--bdr);border-left:4px solid var(--seg,'+DIS_BRAND+');border-radius:10px;padding:10px 14px;background:var(--w)}'+
    '.rph-l{min-width:118px;flex:none}.rph-ph{font-size:12px;font-weight:800;color:var(--navy)}.rph-yrs{font-size:10px;font-weight:700;color:var(--mu)}'+
    '.rph-d{font-size:11.5px;color:var(--navy);line-height:1.5}'+
    '.rph-tag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;border-radius:20px;padding:2px 8px;margin-left:8px;white-space:nowrap}'+
    '.depr-life{width:54px;font:inherit;font-size:11.5px;font-weight:800;color:var(--navy);border:1px solid var(--bdr);border-radius:6px;padding:3px 6px;text-align:center}'+
    '.depr-tbl td:first-child,.depr-tbl th:first-child{white-space:normal}'+
    '.depr-tbl td.depr-da,.depr-tbl td.depr-total{font-weight:800;color:'+DIS_BRAND+'}'+
    '.depr-sum{border:1px solid var(--bdr);border-left:4px solid '+DIS_BRAND+';border-radius:10px;padding:11px 14px;background:#F7F9FB;font-size:12.5px;line-height:1.55;color:var(--navy);margin:10px 0 4px}'+
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
// DEEP DIVE — rebuilt from scratch, step by step.
// All data & context are preserved in dis-data.js and dis-model.js (the Bloomberg
// model). This renders an EMPTY shell until we add each section back in, together.
// styleBlock() is still injected so any future content is styled consistently.
// ═══════════════════════════════════════════════════════════════════════════════
// small helper: read the active button's attr within a toggle group (or a default)
function ddTog(root, sel, attr, dflt){ var b=root.querySelector(sel+' button.active'); return (b&&b.getAttribute(attr))||dflt; }
// hex #RRGGBB -> rgba at alpha a (fade estimate-year bars)
function hexA(hex, a){ var h=hex.replace('#',''); var r=parseInt(h.substr(0,2),16),g=parseInt(h.substr(2,2),16),b=parseInt(h.substr(4,2),16); return 'rgba('+r+','+g+','+b+','+a+')'; }
// categorical palette for the Experiences breakdown lines (blue · gold · purple · green · red)
var EXP_PALETTE = ['#1D3FB8','#E3A73A','#6B5AE0','#2FA36B','#E0463C'];

// The three reporting segments. Built segments get the interactive explorer; others are
// placeholders until we get to them. SEG_DMKEY also doubles as the display name.
var TL_SEGS = [
  { key:'dis', name:'DIS',           color:DIS_BRAND },
  { key:'ent', name:'Entertainment', color:SEG_ENT },
  { key:'spt', name:'Sports',        color:SEG_SPT },
  { key:'exp', name:'Experiences',   color:SEG_EXP },
];
var SEG_DEFAULT = 'dis';
var SEG_DMKEY = { dis:'Disney', ent:'Entertainment', spt:'Sports', exp:'Experiences' };
var SEG_BUILT = { dis:true, ent:true, spt:true, exp:true };   // segments with the interactive explorer
var SEG_MIN = 3, SEG_MAX = 9;             // FY22 .. FY28E (index into DM_YEARS)
function segArrSub(a,b){ return a.map(function(v,i){ return (v==null||b[i]==null)?null:(v-b[i]); }); }

// Breakdowns each segment/metric supports. [] = no breakdown (single total row).
function segBreaks(seg, metric){
  if(seg==='dis') return (metric==='rev'||metric==='opex'||metric==='oi') ? [{k:'seg',l:'By Segment'}] : [];
  if(seg==='exp'){
    if(metric==='rev')  return [{k:'region',l:'By Region'},{k:'type',l:'By Type'}];
    if(metric==='opex') return [{k:'region',l:'By Region'},{k:'type',l:'By Cost Type'}];
    return [{k:'region',l:'By Region'}];
  }
  if(seg==='spt'){
    if(metric==='rev') return [{k:'type',l:'By Type'}];
    return [];   // OpEx / OI: total only in the model
  }
  if(seg==='ent'){
    if(metric==='rev')  return [{k:'type',l:'By Type'}];
    if(metric==='opex') return [{k:'type',l:'By Cost Type'}];
    return [];   // OI: total only
  }
  return [];
}
function segHasMargin(seg, metric){ return metric==='oi'; }

// Metrics each segment exposes. DIS (whole company) adds company-level lines.
function segMetrics(seg){
  var base = [{k:'rev',l:'Revenue'},{k:'opex',l:'Operating Expenses'},{k:'oi',l:'Operating Income'}];
  if(seg==='dis') return base.concat([{k:'ebitda',l:'EBITDA'},{k:'ni',l:'Net Income'},{k:'eps',l:'EPS'},{k:'fcf',l:'FCF'}]);
  return base;
}
function renderMetrics(card, seg){
  var el = card.querySelector('.seg-metric'); if(!el) return;
  el.innerHTML = segMetrics(seg).map(function(m,i){ return '<button type="button" class="'+(i===0?'active':'')+'" data-metric="'+m.k+'">'+esc(m.l)+'</button>'; }).join('');
}
var SEG_MNAME  = { rev:'Revenue', opex:'Operating expenses', oi:'Operating income', ebitda:'EBITDA', ni:'Net income', eps:'EPS', fcf:'Free cash flow' };
var SEG_MLOWER = { rev:'revenue', opex:'operating expenses', oi:'operating income', ebitda:'EBITDA', ni:'net income', eps:'EPS', fcf:'free cash flow' };
function segMetricName(m){ return SEG_MNAME[m]||'Revenue'; }
function segMetricLower(m){ return SEG_MLOWER[m]||'revenue'; }

// Row data: { rows:[[name,arr]...], total, denom?, denomTotal? }. rows may be [] (total only).
function segRows(seg, metric, which){
  if(seg==='dis'){
    // company-level single-series metrics (no segment breakdown)
    if(metric==='ebitda') return { rows:[], total:DM_IS.ebitda };
    if(metric==='ni')     return { rows:[], total:DM_IS.netIncomeGAAP };
    if(metric==='eps')    return { rows:[], total:DM_IS.epsAdj };
    if(metric==='fcf')    return { rows:[], total:DM_CF.fcf };
    var er=DM_SEG.rev.Entertainment, sr=DM_SEG.rev.Sports, xr=DM_SEG.rev.Experiences;
    var eo=DM_SEG.oi.Entertainment,  so=DM_SEG.oi.Sports,  xo=DM_SEG.oi.Experiences;
    var consRev = DM_IS.revenue;
    var segCols = [SEG_ENT, SEG_SPT, SEG_EXP, '#8A93A0'];
    if(metric==='oi'){
      var segOiTot = eo.map(function(v,i){ var s=so[i],x=xo[i]; return (v==null||s==null||x==null)?null:(v+s+x); });
      return { rows:[['Entertainment',eo],['Sports',so],['Experiences',xo]], total:segOiTot, denom:[er,sr,xr], denomTotal:consRev, colors:[SEG_ENT,SEG_SPT,SEG_EXP] };
    }
    if(metric==='opex'){
      var eOp=segArrSub(er,eo), sOp=segArrSub(sr,so), xOp=segArrSub(xr,xo);
      var totOp=consRev.map(function(cv,i){ var e=eo[i],s=so[i],x=xo[i]; return (cv==null||e==null||s==null||x==null)?null:(cv-(e+s+x)); });
      var elimO=totOp.map(function(tv,i){ var e=eOp[i],s=sOp[i],x=xOp[i]; return (tv==null||e==null||s==null||x==null)?null:(tv-e-s-x); });
      return { rows:[['Entertainment',eOp],['Sports',sOp],['Experiences',xOp],['Eliminations',elimO]], total:totOp, colors:segCols };
    }
    var elim=consRev.map(function(cv,i){ var e=er[i],s=sr[i],x=xr[i]; return (cv==null||e==null||s==null||x==null)?null:(cv-e-s-x); });
    return { rows:[['Entertainment',er],['Sports',sr],['Experiences',xr],['Eliminations',elim]], total:consRev, colors:segCols };
  }
  var K = SEG_DMKEY[seg];
  var rev = DM_SEG.rev[K], oi = DM_SEG.oi[K], D = DM_SEG_DETAIL[K] || {};
  var totOpex = segArrSub(rev, oi);
  if(seg==='exp'){
    if(metric==='oi') return { rows:[['Domestic',D.domesticOI],['International',D.intlOI],['Consumer Products',D.consumerProductsOI]],
                               total:oi, denom:[D.domesticRev,D.intlRev,D.consumerProductsRev], denomTotal:rev };
    if(metric==='opex'){
      if(which==='type'){
        var other = totOpex.map(function(tv,i){ var l=D.operatingLabor[i],s=D.sga[i],d=D.da[i]; return (tv==null||l==null||s==null||d==null)?null:(tv-l-s-d); });
        return { rows:[['Operating Labor',D.operatingLabor],['Selling, General & Admin',D.sga],['Depreciation & Amortization',D.da],['Other operating costs',other]], total:totOpex };
      }
      return { rows:[['Domestic',segArrSub(D.domesticRev,D.domesticOI)],['International',segArrSub(D.intlRev,D.intlOI)],['Consumer Products',segArrSub(D.consumerProductsRev,D.consumerProductsOI)]], total:totOpex };
    }
    if(which==='type') return { rows:[['Theme Park Admissions',D.themeParkAdmissions],['Resorts & Vacation',D.resortsVacation],['Parks & Experiences Merch, Food & Bev',D.merchandiseFB],['Parks Licensing & Other',D.parksLicensingOther],['Merchandise Licensing & Retail',D.merchandiseLicensingRetail]], total:rev };
    return { rows:[['Domestic',D.domesticRev],['International',D.intlRev],['Consumer Products',D.consumerProductsRev]], total:rev };
  }
  if(seg==='spt'){
    if(metric==='rev'){
      var subaff = rev.map(function(rv,i){ var a=D.advertising[i],o=D.other[i]; return (rv==null||a==null||o==null)?null:(rv-a-o); });
      return { rows:[['Subscription & Affiliate',subaff],['Advertising',D.advertising],['Other',D.other]], total:rev };
    }
    if(metric==='oi') return { rows:[], total:oi, denomTotal:rev };
    return { rows:[], total:totOpex };
  }
  if(seg==='ent'){
    if(metric==='rev'){
      // Advertising reported all years; the rest (streaming subscription, affiliate, content) as residual.
      var rest = rev.map(function(rv,i){ var a=D.advertising[i]; return (rv==null||a==null)?null:(rv-a); });
      return { rows:[['Subscription, Affiliate & Content',rest],['Advertising',D.advertising]], total:rev };
    }
    if(metric==='opex'){
      // SG&A and D&A reported; Cost of services & other is the reconciling residual.
      var eother = totOpex.map(function(tv,i){ var s=D.sga[i],d=D.da[i]; return (tv==null||s==null||d==null)?null:(tv-s-d); });
      return { rows:[['Cost of services & other',eother],['Selling, General & Admin',D.sga],['Depreciation & Amortization',D.da]], total:totOpex };
    }
    return { rows:[], total:oi, denomTotal:rev };   // OI total + margin
  }
  return { rows:[], total:rev };
}

// Contextual note under each segment table/chart.
function segNote(seg, metric, which, mode){
  var n='';
  if(seg==='dis'){
    if(mode==='margin') n='Company operating margin = total segment operating income ÷ consolidated revenue. ';
    else if(metric==='rev') n='Whole-company revenue by segment. The segments gross above the consolidated total; <b>Eliminations</b> removes intersegment revenue (~$1.9B in FY2025) to tie to reported revenue. ';
    else if(metric==='opex') n='Implied operating expenses by segment (= segment revenue − operating income); <b>Eliminations</b> ties it to the consolidated basis. ';
    else if(metric==='oi') n='Total segment operating income by segment — before corporate/other items (which bridge to GAAP operating income). ';
    else if(metric==='ebitda') n='Comparable EBITDA — company total. ';
    else if(metric==='ni') n='GAAP net income — company total (FY2025 was lifted by a large one-time tax benefit). ';
    else if(metric==='eps') n='Adjusted diluted EPS — company total, per share. ';
    else if(metric==='fcf') n='Free cash flow — company total (cash from operations − capex). ';
    return n+'Shaded = BST estimates (FY26E–FY28E). YoY vs prior year · CAGR across the selected range · '+(metric==='eps'?'$ per share.':'$ in millions.');
  }
  if(mode==='margin') n='Operating margin = operating income ÷ segment revenue. ';
  else if(seg==='exp'){
    if(metric==='opex' && which==='type') n='Total operating expenses = revenue − operating income. Operating Labor, SG&A and D&A are the clean lines; <b>Other operating costs</b> is the reconciling residual (cost of goods, infrastructure, distribution &amp; occupancy). ';
    else if(metric==='opex') n='Operating expenses are <b>implied</b> = revenue − operating income (by region). ';
    else if(metric==='oi') n='Operating income by region (Domestic includes the cruise line). ';
  } else if(seg==='spt'){
    if(metric==='rev') n='ESPN revenue. <b>Subscription &amp; Affiliate</b> is the reconciling residual (= revenue − advertising − other); the model reports it explicitly only for the estimate years. ';
    else if(metric==='opex') n='Operating expenses are <b>implied</b> = revenue − operating income. Sports isn’t split by region or cost type in the model. ';
    else if(metric==='oi') n='ESPN operating income — not split by region/type in the model. ';
  } else if(seg==='ent'){
    if(metric==='rev') n='Entertainment revenue. Advertising is reported; <b>Subscription, Affiliate &amp; Content</b> is the residual (= revenue − advertising) — the model splits it (streaming subscription, affiliate fees, content sales) only for the estimate years. ';
    else if(metric==='opex') n='Total operating expenses = revenue − operating income. SG&amp;A and D&amp;A are reported; <b>Cost of services &amp; other</b> is the reconciling residual (net of equity-method income). ';
    else if(metric==='oi') n='Entertainment operating income — the streaming inflection lifts margin from ~5% (FY22) toward the mid-teens. Not split by type in the model. ';
  }
  return n+'Shaded = BST estimates (FY26E–FY28E). YoY vs prior year · CAGR across the selected range · $ in millions.';
}
function segYearSelect(which){
  var def = (which==='from')?SEG_MIN:SEG_MAX;
  var opts=''; for(var i=SEG_MIN;i<=SEG_MAX;i++){ opts+='<option value="'+i+'"'+(i===def?' selected':'')+'>'+DM_YEARS[i]+'</option>'; }
  return '<select class="exp-ysel seg-'+which+'">'+opts+'</select>';
}
// The interactive explorer markup for one segment (controls scoped by class; the breakdown
// toggle is filled in by segSyncControls per the active metric).
function segBody(){
  return ''+
    '<div class="exp-ctrls">'+
      '<div class="dmm-tog seg-metric"></div>'+
      '<div class="dmm-tog seg-break"></div>'+
      '<div class="dmm-tog seg-mode"><button type="button" class="active" data-mode="val">$ Value</button><button type="button" data-mode="yoy">YoY %</button><button type="button" data-mode="cs">% of total</button><button type="button" data-mode="margin">Margin %</button></div>'+
      '<div class="dmm-tog seg-view"><button type="button" class="active" data-view="table">Table</button><button type="button" data-view="chart">Chart</button></div>'+
    '</div>'+
    '<div class="exp-range">Years <span>'+segYearSelect('from')+'</span><span>→</span><span>'+segYearSelect('to')+'</span></div>'+
    '<div class="seg-table dfin-wrap"></div>'+
    '<div class="seg-chart dd-chart" style="height:360px" hidden><canvas></canvas></div>'+
    '<div class="dfin-note seg-note"></div>';
}
function placeholderView(s){
  return '<p class="dd-sub" style="margin:2px 0 0">Construimos <b>'+esc(s.name)+'</b> aquí — dime qué va (revenue, sub-líneas, gráfico…).</p>';
}
function segmentsSubpane(){
  var toggle = '<div class="dmm-tog" data-segseltog>'+TL_SEGS.map(function(s){
    return '<button type="button" class="'+(s.key===SEG_DEFAULT?'active':'')+'" data-ss="'+s.key+'">'+esc(s.name)+'</button>';
  }).join('')+'</div>';
  var views = TL_SEGS.map(function(s){
    var body = SEG_BUILT[s.key] ? segBody() : placeholderView(s);
    return '<div class="subseg-c" data-segview="'+s.key+'"'+(SEG_BUILT[s.key]?' data-segbuilt="1"':'')+(s.key===SEG_DEFAULT?'':' hidden')+' style="--seg:'+s.color+'">'+
      '<div class="subseg-h"><span class="subseg-dot"></span><span class="subseg-t">'+esc(s.name)+'</span></div>'+
      body +
    '</div>';
  }).join('');
  return '<p class="dd-sub">Los tres segmentos de Disney. Elige uno — los armamos uno por uno.</p>'+toggle+views;
}

// read the active button's attr within a toggle group scoped to a segment card
function cardTog(card, sel, attr, dflt){ var b=card.querySelector(sel+' button.active'); return (b&&b.getAttribute(attr))||dflt; }

// Render the breakdown toggle for the active metric, and enable/disable Margin %.
function segSyncControls(card, seg){
  var metric = cardTog(card, '.seg-metric', 'data-metric', 'rev');
  var bwrap = card.querySelector('.seg-break');
  if(bwrap){
    var breaks = segBreaks(seg, metric);
    if(breaks.length){
      var cur = cardTog(card, '.seg-break', 'data-break', breaks[0].k);
      var keep = breaks.some(function(b){ return b.k===cur; }) ? cur : breaks[0].k;
      bwrap.innerHTML = breaks.map(function(b){ return '<button type="button" class="'+(b.k===keep?'active':'')+'" data-break="'+b.k+'">'+esc(b.l)+'</button>'; }).join('');
      bwrap.style.display = breaks.length>1 ? '' : 'none';   // single option: keep value, hide the toggle
    } else { bwrap.innerHTML=''; bwrap.style.display='none'; }
  }
  var marBtn = card.querySelector('.seg-mode button[data-mode="margin"]');
  if(marBtn){
    var lockM = !segHasMargin(seg, metric);
    marBtn.disabled = lockM; marBtn.style.opacity = lockM?'.4':''; marBtn.style.cursor = lockM?'not-allowed':'';
    if(lockM && marBtn.classList.contains('active')) card.querySelectorAll('.seg-mode button').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mode')==='val'); });
  }
}
// Read the full control state of a segment card.
function segReadState(card, seg){
  var metric = cardTog(card, '.seg-metric', 'data-metric', 'rev');
  var breaks = segBreaks(seg, metric);
  var which = cardTog(card, '.seg-break', 'data-break', breaks.length?breaks[0].k:'region');
  var mode = cardTog(card, '.seg-mode', 'data-mode', 'val');
  if(mode==='margin' && !segHasMargin(seg, metric)) mode='val';
  var fs=card.querySelector('.seg-from'), ts=card.querySelector('.seg-to');
  var fromIdx = fs?parseInt(fs.value,10):SEG_MIN, toIdx = ts?parseInt(ts.value,10):SEG_MAX;
  if(toIdx<fromIdx){ var t=toIdx; toIdx=fromIdx; fromIdx=t; }
  return { metric:metric, which:which, mode:mode, fromIdx:fromIdx, toIdx:toIdx };
}
// Build a segment's table for the current metric / breakdown / mode / year range.
function buildSegTable(card, seg){
  var wrap = card.querySelector('.seg-table'); if(!wrap) return;
  var st = segReadState(card, seg), metric=st.metric, which=st.which, mode=st.mode, fromIdx=st.fromIdx, toIdx=st.toIdx;
  var years=[]; for(var i=fromIdx;i<=toIdx;i++) years.push(i);
  var data = segRows(seg, metric, which);
  var rows = data.rows, total = data.total, denom = data.denom, denomTotal = data.denomTotal;
  var metricName = segMetricName(metric);
  var segName = SEG_DMKEY[seg];
  var isEps = (metric==='eps');

  function val(v){ if(v==null) return '—'; return isEps ? ('$'+v.toFixed(2)) : Math.round(v).toLocaleString(); }
  function yoy(arr,i){ var p=arr[i-1],v=arr[i]; if(v==null||p==null||p===0) return '—'; var g=(v/p-1)*100; return '<span style="color:'+(g>=0?'#2FA36B':'#E0463C')+'">'+(g>=0?'+':'')+g.toFixed(1)+'%</span>'; }
  function cs(v,i){ var tot=total[i]; if(v==null||tot==null||tot===0) return '—'; return (v/tot*100).toFixed(1)+'%'; }
  function marg(v,den,i){ var d=den?den[i]:null; if(v==null||d==null||d===0) return '—'; var m=v/d*100; return '<span style="color:'+(m>=0?'var(--navy)':'#E0463C')+'">'+m.toFixed(1)+'%</span>'; }
  function cell(arr,den,i){ if(mode==='yoy') return yoy(arr,i); if(mode==='cs') return cs(arr[i],i); if(mode==='margin') return marg(arr[i],den,i); return val(arr[i]); }
  function cagr(arr){ var a=arr[fromIdx],b=arr[toIdx],n=toIdx-fromIdx; if(a==null||b==null||a<=0||n<=0) return '—'; var g=(Math.pow(b/a,1/n)-1)*100; return (g>=0?'+':'')+g.toFixed(1)+'%'; }

  var showCagr = (mode==='val' || mode==='yoy');   // no CAGR for % of total or margin (ratios)
  var corner = (mode==='margin'?'Operating margin':metricName);
  var head='<tr><th>'+esc(corner)+'</th>'+
    years.map(function(i){ return '<th class="'+(DM_ISEST[i]?'est':'')+'">'+esc(DM_YEARS[i])+'</th>'; }).join('')+
    (showCagr?'<th class="cagr">CAGR</th>':'')+'</tr>';
  function rowHtml(name, arr, den, cls){
    return '<tr'+(cls?' class="'+cls+'"':'')+'><td>'+esc(name)+'</td>'+
      years.map(function(i){ return '<td class="'+(DM_ISEST[i]?'est':'')+'">'+cell(arr,den,i)+'</td>'; }).join('')+
      (showCagr?'<td class="cagr">'+cagr(arr)+'</td>':'')+'</tr>';
  }
  var totLabel = (mode==='margin'?segName+' margin':(rows.length?'Total '+segName+' '+segMetricLower(metric):segName+' '+segMetricLower(metric)));
  var body = rows.map(function(r,ri){ return rowHtml(r[0], r[1], denom?denom[ri]:null); }).join('') +
             rowHtml(totLabel, total, denomTotal, 'dfin-tot');
  wrap.innerHTML = '<table class="dfin"><thead>'+head+'</thead><tbody>'+body+'</tbody></table>';
}

// Bar chart of the same segment data. Stacked for $ Value / % of total; grouped for
// YoY % / Margin % (ratios). Estimate years are faded. Single series when no breakdown.
function buildSegChart(card, seg){
  var cv = card.querySelector('.seg-chart canvas'); if(!cv || !canBuild(cv)) return;
  if(cv._chart){ try{ cv._chart.destroy(); }catch(e){} cv._chart=null; }
  var st = segReadState(card, seg), mode=st.mode, fromIdx=st.fromIdx, toIdx=st.toIdx;
  var years=[]; for(var i=fromIdx;i<=toIdx;i++) years.push(i);
  var data = segRows(seg, st.metric, st.which);
  var rows = data.rows.length ? data.rows : [[SEG_DMKEY[seg], data.total]];
  var total = data.total, denom = data.denom, denomTotal = data.denomTotal, colors = data.colors;
  var stacked = (mode==='val' || mode==='cs') && data.rows.length>0;
  var isPct = (mode!=='val');
  var isEps = (st.metric==='eps');
  var datasets = rows.map(function(r, ri){
    var color = (colors && colors[ri]) ? colors[ri] : EXP_PALETTE[ri % EXP_PALETTE.length];
    var vals = years.map(function(i){
      var v = r[1][i];
      if(mode==='cs'){ var tt=total[i]; return (v==null||tt==null||tt===0)?null:(v/tt*100); }
      if(mode==='yoy'){ var p=r[1][i-1]; return (v==null||p==null||p===0)?null:((v/p-1)*100); }
      if(mode==='margin'){ var d = data.rows.length ? (denom?denom[ri][i]:null) : (denomTotal?denomTotal[i]:null); return (v==null||d==null||d===0)?null:(v/d*100); }
      return v;
    });
    return { label:r[0], data:vals, stack: stacked?'s':undefined,
      backgroundColor: years.map(function(i){ return DM_ISEST[i]?hexA(color,.45):color; }),
      borderColor:color, borderWidth: years.map(function(i){ return DM_ISEST[i]?1.2:0; }),
      borderRadius:2, maxBarThickness:48 };
  });
  cv._chart = new Chart(cv.getContext('2d'), {
    type:'bar',
    data:{ labels:years.map(function(i){ return DM_YEARS[i]; }), datasets:datasets },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:6 } },
      plugins:{ legend:{ display:datasets.length>1, position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
        tooltip:{ callbacks:{ label:function(ctx){ var v=ctx.parsed.y; if(v==null) return ctx.dataset.label+': —';
          return ctx.dataset.label+': '+(isPct ? (v.toFixed(1)+'%') : (isEps ? ('$'+v.toFixed(2)) : ('$'+Math.round(v).toLocaleString()+'M'))); } } } },
      scales:{
        x:{ stacked:stacked, grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:10.5 } } },
        y:{ stacked:stacked, grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 },
          callback:function(v){ return isPct ? (v+'%') : (isEps ? ('$'+v.toFixed(2)) : ('$'+(v/1000).toFixed(0)+'B')); } } } } }
  });
}

// Dispatcher — render a segment card as a table or a chart per its view toggle, + the note.
function buildSegView(card, seg){
  if(!card) return;
  var view = cardTog(card, '.seg-view', 'data-view', 'table');
  var tableWrap = card.querySelector('.seg-table'), chartWrap = card.querySelector('.seg-chart');
  var noteEl = card.querySelector('.seg-note');
  if(noteEl){ var st=segReadState(card, seg); noteEl.innerHTML = '<span class="dfin-est-key"></span>'+segNote(seg, st.metric, st.which, st.mode); }
  if(view==='chart'){
    if(tableWrap) tableWrap.hidden = true; if(chartWrap) chartWrap.hidden = false;
    requestAnimationFrame(function(){ buildSegChart(card, seg); });
  } else {
    if(chartWrap) chartWrap.hidden = true; if(tableWrap) tableWrap.hidden = false;
    buildSegTable(card, seg);
  }
}

// ─── What ▸ interactive project explorer (filters · cards · timeline · map) ────────
function projBucketColor(b){ var m={}; DIS_PROJ_BUCKETS.forEach(function(x){ m[x.k]=x.color; }); return m[b]||DIS_BRAND; }
function projBucketLabel(b){ var m={}; DIS_PROJ_BUCKETS.forEach(function(x){ m[x.k]=x.l; }); return m[b]||b; }
function whatBody(){
  var bucketChips = '<span class="wf-lbl">Bucket</span><span class="wf-chips"><button type="button" class="wchip active" data-wbucket="all">All</button>'+
    DIS_PROJ_BUCKETS.map(function(b){ return '<button type="button" class="wchip" data-wbucket="'+b.k+'"><span class="wchip-dot" style="background:'+b.color+'"></span>'+esc(b.l)+'</button>'; }).join('')+'</span>';
  var regionChips = '<span class="wf-lbl">Region</span><span class="wf-chips"><button type="button" class="wchip active" data-wregion="all">All</button>'+
    DIS_PROJ_REGIONS.map(function(r){ return '<button type="button" class="wchip" data-wregion="'+esc(r)+'">'+esc(r)+'</button>'; }).join('')+'</span>';
  var viewTog = '<span class="wf-lbl">View</span><div class="dmm-tog" data-wview><button type="button" class="active" data-view="cards">Cards</button><button type="button" data-view="timeline">Timeline</button><button type="button" data-view="map">Map</button></div>';
  return '<div class="dd-cardt" style="margin:2px 0 8px">What they’re expanding</div>'+
    '<div class="wf-row">'+bucketChips+'</div>'+
    '<div class="wf-row">'+regionChips+'</div>'+
    '<div class="wf-row">'+viewTog+'</div>'+
    '<div id="whatOut"></div>';
}
function whatCards(list){
  if(!list.length) return '<div class="wempty">No projects match these filters.</div>';
  return '<div class="wproj-grid">'+list.map(function(p){
    var c=projBucketColor(p.bucket), gi=DIS_PROJECTS.indexOf(p);
    var tags='<span class="wproj-tag" style="color:'+c+';background:'+hexA(c,.14)+'">'+esc(projBucketLabel(p.bucket))+'</span>'+
      '<span class="wproj-tag" style="color:var(--mu);background:#F2F5F8">'+esc(p.region)+'</span>'+
      (p.franchise&&p.franchise!=='—'?'<span class="wproj-tag" style="color:var(--mu);background:#F2F5F8">'+esc(p.franchise)+'</span>':'');
    return '<div class="wproj wtl-clk" data-proj="'+gi+'" style="--seg:'+c+'">'+
      '<div class="wproj-h"><span class="wproj-n">'+esc(p.name)+'</span><span style="display:inline-flex;align-items:center;gap:7px"><span class="wproj-w">'+esc(p.when)+'</span><span class="wtl-caret">▸</span></span></div>'+
      '<div class="wproj-loc">'+esc(p.loc)+'</div>'+
      '<div class="wproj-tags">'+tags+'</div>'+
      '<div class="wproj-det" data-proj-det hidden><div class="wproj-d" style="margin-top:8px;padding-top:8px;border-top:1px solid var(--bdr)">'+esc(p.detail)+'</div></div>'+
    '</div>';
  }).join('')+'</div>';
}
function whatTimeline(list){
  if(!list.length) return '<div class="wempty">No projects match these filters.</div>';
  var sorted = list.slice().sort(function(a,b){ return (a.year||9999)-(b.year||9999); });
  return '<div class="wtl">'+sorted.map(function(p){
    var c=projBucketColor(p.bucket), gi=DIS_PROJECTS.indexOf(p);
    var yr = p.year ? ('<div class="wtl-yr">'+p.year+'</div>') : ('<div class="wtl-yr" style="font-size:10px;color:var(--mu)">Ongoing</div>');
    var fr = (p.franchise&&p.franchise!=='—') ? '<span class="wproj-tag" style="color:var(--mu);background:#F2F5F8">'+esc(p.franchise)+'</span>' : '';
    var det = '<div class="wtl-det" data-proj-det hidden>'+
      '<div class="wtl-detd">'+esc(p.detail)+'</div>'+
      '<div class="wproj-tags" style="margin-top:7px">'+
        '<span class="wproj-tag" style="color:'+c+';background:'+hexA(c,.14)+'">'+esc(projBucketLabel(p.bucket))+'</span>'+
        '<span class="wproj-tag" style="color:var(--mu);background:#F2F5F8">'+esc(p.region)+'</span>'+fr+
      '</div></div>';
    return '<div class="wtl-row">'+yr+'<div class="wtl-dot" style="--seg:'+c+'"></div>'+
      '<div class="wtl-card wtl-clk" data-proj="'+gi+'" style="--seg:'+c+'">'+
        '<div class="wtl-cardh"><div><div class="wtl-n">'+esc(p.name)+'</div><div class="wtl-loc">'+esc(p.loc)+' · '+esc(p.when)+'</div></div><span class="wtl-caret">▸</span></div>'+
        det +
      '</div></div>';
  }).join('')+'</div>';
}
function whatMapPanel(p){
  return '<div class="wmap-panel-n">'+esc(p.name)+'</div><div class="wmap-panel-loc">'+esc(p.loc)+' · '+esc(p.when)+'</div><div class="wmap-panel-d">'+esc(p.detail)+'</div>';
}
function whatMap(list){
  var located0 = list.filter(function(p){ return p.lat!=null && p.lng!=null; });
  var off = list.filter(function(p){ return p.lat==null; });
  if(!located0.length && !off.length) return '<div class="wempty">No projects match these filters.</div>';
  var W=WORLD_VB[0], H=WORLD_VB[1];
  var land = WORLD_PATHS.map(function(c){ return '<path d="'+c.d+'" fill="#D3DCE6" stroke="#EAF2F8" stroke-width="0.6"/>'; }).join('');
  // positions, fanning out pins that land on (nearly) the same spot (e.g. the Orlando trio)
  var seen={};
  var located = located0.map(function(p){
    var x=(p.lng+180)/360*W, y=(90-p.lat)/180*H;
    var key=Math.round(x/10)+','+Math.round(y/10), n=(seen[key]=(seen[key]||0)+1)-1;
    if(n>0){ var a=(n-1)*2.2; x+=Math.cos(a)*12; y+=Math.sin(a)*12; }
    return { p:p, gi:DIS_PROJECTS.indexOf(p), x:x, y:y };
  });
  var pinEls = located.map(function(o, idx){
    var c=projBucketColor(o.p.bucket);
    return '<circle class="wmap-pin'+(idx===0?' sel':'')+'" data-proj="'+o.gi+'" cx="'+o.x.toFixed(1)+'" cy="'+o.y.toFixed(1)+'" r="6.5" fill="'+c+'" stroke="#fff" stroke-width="2"/>';
  });
  if(pinEls.length>1) pinEls.push(pinEls.shift());   // draw the default-selected pin on top
  var svg = '<div class="wmap"><svg class="wmap-svg" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid meet">'+
    '<rect x="0" y="0" width="'+W+'" height="'+H+'" fill="#EAF2F8"/>'+land+pinEls.join('')+'</svg></div>';
  var first = located[0] ? located[0].p : null;
  var panel = '<div class="wmap-panel" id="wmapPanel" style="--seg:'+(first?projBucketColor(first.bucket):DIS_BRAND)+'">'+
    (first? whatMapPanel(first) : '<div class="wmap-panel-d">Click a pin to see the project.</div>')+'</div>';
  var offHtml = off.length ? ('<div class="wf-lbl" style="margin-top:12px">Global / at sea (no single location)</div><div class="wmap-off">'+off.map(function(p){
    var gi=DIS_PROJECTS.indexOf(p), c=projBucketColor(p.bucket);
    return '<button type="button" class="wmap-offchip" data-proj="'+gi+'"><span class="wchip-dot" style="background:'+c+'"></span>'+esc(p.name)+'</button>';
  }).join('')+'</div>') : '';
  return svg + panel + offHtml + '<div class="dd-note" style="margin-top:8px">Click a pin (or a chip) for the project. Equirectangular world map; cruise & company-wide items have no single point, so they’re listed below.</div>';
}
// ─── What ▸ Cruise deep-dive (shown when the Cruise bucket is selected) ───────────
function cruiseFleetRows(list){
  var max = list.reduce(function(m,s){ return Math.max(m, s.pax||0); }, 1);
  return list.map(function(s){
    var c = s.status==='order' ? ' order' : '';
    var cls = '<span class="crus-cls">'+esc(s.cls)+(s.largest?' · largest':'')+(s.capLight?' · capital-light':'')+'</span>';
    var bar = s.pax
      ? '<div class="crus-bar" title="'+esc(s.gt? (Math.round(s.gt/1000)+'k GT'):'')+'"><div class="crus-fill" style="width:'+Math.max(3,s.pax/max*100).toFixed(1)+'%;background:'+(s.status==='order'?hexA('#1E88C7',.5):'#1E88C7')+'"></div></div>'
      : '<div class="crus-bar" style="background:transparent"></div>';
    var pax = s.pax
      ? '<div class="crus-pax">'+s.pax.toLocaleString('en-US')+'<span>double-occ'+(s.est?' · est':'')+'</span></div>'
      : '<div class="crus-pax">~'+s.paxMax.toLocaleString('en-US')+'<span>max · est</span></div>';
    return '<div class="crus-row'+c+'" title="'+esc(s.note)+'">'+
      '<div class="crus-yr">'+esc(s.yr)+'</div>'+
      '<div class="crus-main"><div class="crus-n">'+esc(s.name)+cls+'</div><div class="crus-sub">'+esc(s.port)+'</div></div>'+
      bar+pax+'</div>';
  }).join('');
}
function cruTiles(list, mt){
  return '<div class="dd-kpis"'+(mt?' style="margin:'+mt+'"':'')+'>'+list.map(function(k){
    return '<div class="dd-kpi"><div class="dd-kpi-v">'+esc(k[0])+'</div><div class="dd-kpi-k">'+esc(k[1])+'</div></div>';
  }).join('')+'</div>';
}
// A collapsible section (reuses the .dcol pattern; toggled via delegation on #whatOut).
function cruDcol(id, title, sub, body, open){
  return '<div class="dcol'+(open?' open':'')+'" data-dcol="'+id+'">'+
    '<button type="button" class="dcol-h"><span class="dcol-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+
      (sub?' <span style="color:var(--mu);font-weight:600;font-size:11px">'+esc(sub)+'</span>':'')+'</button>'+
    '<div class="dcol-b"'+(open?'':' hidden')+'>'+body+'</div></div>';
}
function cruiseFleetBody(){
  var inService = DIS_CRUISE_FLEET.filter(function(s){ return s.status==='service'; });
  var onOrder   = DIS_CRUISE_FLEET.filter(function(s){ return s.status==='order'; });
  return '<div class="crus-grp"><b>In service</b> · '+inService.length+' ships</div>'+
    '<div class="crus">'+cruiseFleetRows(inService)+'</div>'+
    '<div class="crus-grp"><b>On order</b> · through 2031</div>'+
    '<div class="crus">'+cruiseFleetRows(onOrder)+'</div>'+
    '<div class="dd-note" style="margin-top:8px">'+esc(DIS_CRUISE_FLEET_NOTE)+'</div>';
}
// Full-fleet projection — today (8 ships) vs the full 13, at RCL economics.
function cruiseBuildBody(){
  var B = DIS_CRUISE_BUILD;
  var head = '<tr><th>Metric</th><th>Today · 8 ships</th><th>Full fleet · 13 (~2032)</th><th>Incremental</th></tr>';
  var rows = B.rows.map(function(r){
    var cls = (r.kind==='rev'||r.kind==='oi') ? ' class="dfin-tot"' : '';
    var incStyle = (r.kind==='rev'||r.kind==='oi') ? ' style="color:#2FA36B"' : ' style="color:#1E88C7"';
    return '<tr'+cls+'><td>'+esc(r.l)+'</td><td>'+esc(r.today)+'</td><td>'+esc(r.full)+'</td><td'+incStyle+'>'+esc(r.inc)+'</td></tr>';
  }).join('');
  var table = '<div class="dfin-wrap"><table class="dfin" style="min-width:520px"><thead>'+head+'</thead><tbody>'+rows+'</tbody></table></div>';
  return cruTiles(B.tiles, '2px 0 12px')+table+'<div class="dd-note" style="margin-top:6px">'+esc(DIS_CRUISE_BUILD_NOTE)+'</div>';
}
function cruiseEconBody(){
  var head = '<tr><th>Operator · FY25</th><th>Revenue</th><th>Op. income</th><th>Op. margin</th><th>EBITDA margin</th><th>Net yield / day</th><th>Occupancy</th><th>Onboard %</th><th>Cust. deposits</th><th>ROIC</th></tr>';
  var rows = DIS_CRUISE_ECON.map(function(r){
    return '<tr><td>'+esc(r.co)+' <span style="color:var(--mu);font-weight:600;font-size:10px">'+esc(r.ticker)+'</span></td>'+
      '<td>'+esc(r.rev)+'</td><td>'+esc(r.oi)+'</td><td>'+esc(r.opm)+'</td><td>'+esc(r.ebitda)+'</td>'+
      '<td>'+esc(r.yield)+'</td><td>'+esc(r.occ)+'</td><td>'+esc(r.onboard)+'</td><td>'+esc(r.deposits)+'</td><td>'+esc(r.roic)+'</td></tr>';
  }).join('');
  return '<div class="cru-econ-lead">'+DIS_CRUISE_ECON_LEAD+'</div>'+
    '<div class="dfin-wrap"><table class="dfin"><thead>'+head+'</thead><tbody>'+rows+'</tbody></table></div>'+
    '<div class="dd-note" style="margin-top:6px">'+esc(DIS_CRUISE_ECON_NOTE)+'</div>';
}
function cruiseShipBody(){
  var S = DIS_CRUISE_SHIP;
  var shipHead = '<tr><th>One ~2,500-berth ship · 1 year</th><th>Per passenger-night</th><th>Per year</th></tr>';
  var shipRows = S.lines.map(function(l){
    var cls = (l.kind==='sub'||l.kind==='oi') ? ' class="dfin-tot"' : (l.kind==='base' ? ' class="sub"' : '');
    var yStyle = l.kind==='oi' ? ' style="color:#2FA36B"' : '';
    return '<tr'+cls+'><td>'+esc(l.l)+'</td><td>'+esc(l.night)+'</td><td'+yStyle+'>'+esc(l.year)+'</td></tr>';
  }).join('');
  return '<div class="cru-econ-lead">'+DIS_CRUISE_SHIP_LEAD+'</div>'+
    cruTiles(S.tiles, '2px 0 12px')+
    '<div class="dfin-wrap"><table class="dfin" style="min-width:460px"><thead>'+shipHead+'</thead><tbody>'+shipRows+'</tbody></table></div>'+
    '<div class="dd-note" style="margin-top:6px">'+esc(DIS_CRUISE_SHIP_NOTE)+'</div>';
}
function cruiseWhatPanel(){
  return '<p class="dd-sub" style="margin:6px 0 12px">'+esc(DIS_CRUISE_INTRO)+'</p>'+
    cruDcol('cru-fleet','🚢 The fleet','8 in service · 5 on order', cruiseFleetBody(), true)+
    cruDcol('cru-econ','💰 Industry economics','Royal Caribbean · Carnival · Norwegian, FY25', cruiseEconBody(), false)+
    cruDcol('cru-ship','🔎 Anatomy of one ship','~2,500 berths, one year', cruiseShipBody(), false)+
    cruDcol('cru-build','📈 Build-out to 13 ships','full-fleet revenue & margins', cruiseBuildBody(), false);
}
// ─── What ▸ Parks & resorts deep-dive (shown when the Parks bucket is selected) ────
function parksFootprintRows(list){
  var max = list.reduce(function(m,p){ return Math.max(m, p.sqm||0); }, 1);
  return list.map(function(p){
    var lic = p.status==='licensed';
    var tag = lic ? '<span style="font-size:9px;font-weight:800;color:var(--mu);background:#F2F5F8;border-radius:20px;padding:1px 7px;margin-left:6px">licensed</span>' : '';
    return '<div class="crus-row'+(lic?' order':'')+'" title="'+esc(p.note||'')+'" style="--seg:#E3A73A">'+
      '<div class="crus-main"><div class="crus-n">'+esc(p.park)+tag+'</div><div class="crus-sub">'+esc(p.resort)+'</div></div>'+
      '<div class="crus-bar"><div class="crus-fill" style="width:'+Math.max(4,p.sqm/max*100).toFixed(1)+'%;background:'+(lic?hexA('#E3A73A',.5):'#E3A73A')+'"></div></div>'+
      '<div class="crus-pax">'+p.acres.toLocaleString('en-US')+' ac<span>'+(p.sqm/1e6).toFixed(2)+'M m²</span></div></div>';
  }).join('');
}
function parksFootprintBody(){
  var owned    = DIS_PARKS_FOOTPRINT.filter(function(p){ return p.status==='owned'; });
  var licensed = DIS_PARKS_FOOTPRINT.filter(function(p){ return p.status==='licensed'; });
  var oAc = owned.reduce(function(s,p){ return s+p.acres; },0), oM = owned.reduce(function(s,p){ return s+p.sqm; },0);
  return '<div class="crus-grp"><b>Owned &amp; operated</b> · '+owned.length+' parks · ~'+oAc.toLocaleString('en-US')+' acres (~'+(oM/1e6).toFixed(1)+'M m²)</div>'+
    '<div class="crus">'+parksFootprintRows(owned)+'</div>'+
    '<div class="crus-grp"><b>Licensed</b> · royalties, not park revenue</div>'+
    '<div class="crus">'+parksFootprintRows(licensed)+'</div>'+
    '<div class="dd-note" style="margin-top:8px">'+esc(DIS_PARKS_FOOTPRINT_NOTE)+'</div>';
}
// Generic today / full-build-out / incremental projection table (reused by the m² and person-capacity lenses).
function parksProjection(lead, B, note){
  var head = '<tr><th>Metric</th><th>Today</th><th>Full build-out</th><th>Incremental</th></tr>';
  var rows = B.rows.map(function(r){
    var cls = (r.kind==='rev'||r.kind==='oi') ? ' class="dfin-tot"' : '';
    var incStyle = r.inc==='—' ? '' : ((r.kind==='rev'||r.kind==='oi') ? ' style="color:#2FA36B"' : ' style="color:#E3A73A"');
    return '<tr'+cls+'><td>'+esc(r.l)+'</td><td>'+esc(r.today)+'</td><td>'+esc(r.full)+'</td><td'+incStyle+'>'+esc(r.inc)+'</td></tr>';
  }).join('');
  var table = '<div class="dfin-wrap"><table class="dfin" style="min-width:480px"><thead>'+head+'</thead><tbody>'+rows+'</tbody></table></div>';
  return '<div class="cru-econ-lead">'+lead+'</div>'+cruTiles(B.tiles, '2px 0 12px')+table+
    '<div class="dd-note" style="margin-top:6px">'+esc(note)+'</div>';
}
function parksWhatPanel(){
  var projects = DIS_PROJECTS.filter(function(p){ return p.bucket==='parks'; });
  return '<p class="dd-sub" style="margin:6px 0 12px">'+esc(DIS_PARKS_INTRO)+'</p>'+
    cruDcol('pk-foot','🏰 Park footprint','12 parks · developed area', parksFootprintBody(), true)+
    cruDcol('pk-proj','🎢 Expansion projects','the $60B new lands & attractions', whatCards(projects), false)+
    cruDcol('pk-cap','👥 Capacity & ARPU','incremental visits × in-park spend', parksProjection(DIS_PARKS_CAP_LEAD, DIS_PARKS_CAP, DIS_PARKS_CAP_NOTE), false)+
    cruDcol('pk-build','📐 Revenue per m² & full-capacity','land-bank revenue potential', parksProjection(DIS_PARKS_BUILD_LEAD, DIS_PARKS_BUILD, DIS_PARKS_BUILD_NOTE), false);
}

// ─── Top Line ▸ Full Buildout — interactive sensitivity model ─────────────────────
function boGroup(key){
  if(key==='parksPct') return 'Parks & Resorts';
  if(key==='cruiseMult') return 'Disney Cruise Line';
  if(key==='films'||key==='avgGross') return 'Studio';
  if(key==='dtcPrice'||key==='dtcSubs') return 'Streaming (DTC)';
  if(key==='espnSubs') return 'ESPN';
  if(key==='life') return 'Depreciation';
  return 'Valuation';
}
function boFmtVal(inp, v){ return (inp.fmt==='$'?'$':'')+v+(inp.unit||''); }
function buildoutSubpane(){
  var lastG=null, inputs='';
  DIS_BUILDOUT_INPUTS.forEach(function(i){
    var g=boGroup(i.key); if(g!==lastG){ inputs+='<div class="bo-seg">'+esc(g)+'</div>'; lastG=g; }
    inputs+='<div class="bo-in"><label>'+esc(i.label)+' <b class="bo-val">'+esc(boFmtVal(i,i.val))+'</b></label>'+
      '<input type="range" class="bo-sl" data-bo="'+i.key+'" data-pre="'+(i.fmt==='$'?'$':'')+'" data-unit="'+esc(i.unit||'')+'" min="'+i.min+'" max="'+i.max+'" step="'+i.step+'" value="'+i.val+'"></div>';
  });
  return '<p class="dd-sub" style="margin:2px 0 8px">'+esc(DIS_BUILDOUT_INTRO)+'</p>'+
    '<div id="boTiles" class="dd-kpis"></div>'+
    '<div class="dd-cardt" style="margin:14px 0 2px">Drivers</div>'+
    '<div class="bo-grid">'+inputs+'</div>'+
    '<div class="dd-cardt" style="margin:16px 0 6px">Incremental at full buildout</div>'+
    '<div id="boOut"></div>'+
    '<div class="dd-note" style="margin-top:8px">'+esc(DIS_BUILDOUT_NOTE)+'</div>';
}
function boVal(root, key){ var el=root.querySelector('.bo-sl[data-bo="'+key+'"]'); return el?parseFloat(el.value):0; }
function buildBuildout(root){
  var scope=root||document; var out=scope.querySelector('#boOut'); if(!out) return;
  var B=DIS_BUILDOUT_BASE;
  var films=boVal(scope,'films'), avgGross=boVal(scope,'avgGross'), dtcPrice=boVal(scope,'dtcPrice'),
      dtcSubs=boVal(scope,'dtcSubs'), espnSubs=boVal(scope,'espnSubs'), life=boVal(scope,'life'), mult=boVal(scope,'mult');
  var parksRev=B.parksRev,  parksOI=B.parksOI;       // fixed — deep-dive
  var cruiseRev=B.cruiseRev, cruiseOI=B.cruiseOI;    // fixed — deep-dive
  var studioRev=films*avgGross*B.studioTake/1000,   studioOI=studioRev*B.studioMargin;
  var dtcPriceRev=B.dtcBaseSubs*dtcPrice*12/1000, dtcSubRev=dtcSubs*B.dtcArpu*12/1000;
  var dtcRev=dtcPriceRev+dtcSubRev,                 dtcOI=dtcPriceRev*B.dtcPriceMargin+dtcSubRev*B.dtcSubMargin;
  var espnRev=espnSubs*B.espnArpu*12/1000,          espnOI=espnRev*B.espnMargin;
  var dep=B.capex/life;
  var segs=[['Parks & Resorts',parksRev,parksOI,1],['Disney Cruise Line',cruiseRev,cruiseOI,1],
            ['Studio (theatrical)',studioRev,studioOI,0],['Streaming (DTC)',dtcRev,dtcOI,0],['ESPN',espnRev,espnOI,0]];
  var totRev=0, totOIb=0; segs.forEach(function(s){ totRev+=s[1]; totOIb+=s[2]; });
  var totOI=totOIb-dep, val=totOI*mult, eps=totOI*(1-B.taxRate)/B.shares;
  function b(x){ return (x<0?'–$':'$')+Math.abs(x).toFixed(1)+'B'; }
  // headline tiles
  var tiles=[[b(totRev),'Incremental revenue'],[b(totOI),'Incremental operating income'],
             ['$'+Math.round(val)+'B','Implied value ('+mult+'×)'],['$'+eps.toFixed(2),'Implied EPS uplift']];
  var tw=scope.querySelector('#boTiles');
  if(tw) tw.innerHTML=tiles.map(function(k){ return '<div class="dd-kpi"><div class="dd-kpi-v">'+esc(k[0])+'</div><div class="dd-kpi-k">'+esc(k[1])+'</div></div>'; }).join('');
  // detail table
  var head='<tr><th>Segment</th><th>Δ Revenue</th><th>Δ Operating income</th></tr>';
  var rows=segs.map(function(s){
    var tag = s[3] ? ' <span style="font-size:9px;font-weight:800;color:#2FA36B;background:rgba(47,163,107,.12);border-radius:20px;padding:1px 7px">deep-dive</span>'
                   : ' <span style="font-size:9px;font-weight:700;color:var(--mu)">· slider</span>';
    return '<tr><td>'+esc(s[0])+tag+'</td><td>'+b(s[1])+'</td><td>'+b(s[2])+'</td></tr>';
  }).join('');
  rows+='<tr class="dfin-tot"><td>Before new depreciation</td><td>'+b(totRev)+'</td><td>'+b(totOIb)+'</td></tr>';
  rows+='<tr><td>– New depreciation ($'+B.capex+'B ÷ '+life+' yr)</td><td>—</td><td style="color:#E0463C">'+b(-dep)+'</td></tr>';
  rows+='<tr class="dfin-tot"><td>= Incremental operating income</td><td>—</td><td style="color:#2FA36B">'+b(totOI)+'</td></tr>';
  out.innerHTML='<div class="dfin-wrap"><table class="dfin" style="min-width:460px"><thead>'+head+'</thead><tbody>'+rows+'</tbody></table></div>';
}
function buildWhat(root){
  var scope = root||document; var out = scope.querySelector('#whatOut'); if(!out) return;
  function act(sel,attr,dflt){ var el=scope.querySelector(sel+'.active'); return el?el.getAttribute(attr):dflt; }
  var bucket = act('[data-wbucket]','data-wbucket','all');
  var region = act('[data-wregion]','data-wregion','all');
  var view = ddTog(scope,'[data-wview]','data-view','cards');
  // Cruise & Parks get dedicated deep-dives, ignoring the card/timeline/map toggle.
  if(bucket==='cruise'){ out.innerHTML = cruiseWhatPanel(); return; }
  if(bucket==='parks'){ out.innerHTML = parksWhatPanel(); return; }
  var list = DIS_PROJECTS.filter(function(p){ return (bucket==='all'||p.bucket===bucket) && (region==='all'||p.region===region); });
  out.innerHTML = view==='timeline' ? whatTimeline(list) : (view==='map' ? whatMap(list) : whatCards(list));
}

// ─── Bottom Line ▸ the ~$60B / 10-year Experiences expansion plan ─────────────────
function planBody(){
  var kpis = '<div class="dd-kpis">'+DIS_PLAN_FACTS.map(function(f){
    return '<div class="dd-kpi"><div class="dd-kpi-v">'+esc(f[1])+'</div><div class="dd-kpi-k">'+esc(f[0])+'</div></div>';
  }).join('')+'</div>';
  // allocation bar + legend (clicking a segment jumps to What, filtered to that bucket)
  var bmap = ['parks','cruise','tech'];
  var bar = '<div class="plan-alloc">'+DIS_PLAN_ALLOC.map(function(a,i){
    return '<div class="plan-alloc-seg" data-plan-bucket="'+bmap[i]+'" title="See '+esc(a.k)+' projects" style="flex:'+a.pct+' 0 0;background:'+a.color+';cursor:pointer">'+a.pct+'%</div>';
  }).join('')+'</div>';
  var legend = '<div class="plan-legend">'+DIS_PLAN_ALLOC.map(function(a){
    return '<span class="plan-lg"><span class="plan-lg-dot" style="background:'+a.color+'"></span>'+esc(a.k)+' — '+a.pct+'%'+(a.tag==='capacity'?' <span style="color:var(--mu);font-weight:600">(capacity)</span>':'')+'</span>';
  }).join('')+'</div>';
  var alloc = '<div class="dd-cardt" style="margin:20px 0 4px">Where the capex goes</div>'+bar+legend+
    '<div class="dd-note">'+esc(DIS_PLAN_ALLOC_NOTE)+'</div>';
  // capex timing chart
  var capex = '<div class="dd-cardt" style="margin:22px 0 6px">Capex timing — the ramp toward $60B</div>'+
    '<div class="dd-chart" style="height:300px"><canvas id="planCapex"></canvas></div>'+
    '<div class="dd-note">'+esc(DIS_PLAN_CAPEX_NOTE)+'</div>';
  // what they're expanding — the interactive explorer
  var pillars = whatBody();
  // how growth compounds
  var growth = '<div class="dd-cardt" style="margin:24px 0 2px">How tomorrow’s growth compounds</div>'+
    '<div class="drv">'+DIS_PLAN_GROWTH.map(function(d){
      return '<div class="drv-c"><div class="drv-h"><span class="drv-ic">'+d.ic+'</span><span class="drv-t">'+esc(d.t)+'</span></div><div class="drv-d">'+esc(d.d)+'</div></div>';
    }).join('')+'</div>';
  // Split into three visual sub-tabs: Where (money) · What (projects) · How (returns).
  function wwhBtn(k, ic, t, sub, active){
    return '<button type="button" class="wwh-tab'+(active?' active':'')+'" data-wwh="'+k+'">'+
      '<span class="wwh-ic">'+ic+'</span><span class="wwh-t">'+t+'</span><span class="wwh-sub">'+esc(sub)+'</span></button>';
  }
  var tabs = '<div class="wwh-tabs">'+
    wwhBtn('where','📍','Where','Where the ~$60B goes', true)+
    wwhBtn('what','🎢','What','What they’re expanding', false)+
    wwhBtn('how','📈','How','How growth compounds', false)+
  '</div>';
  var whereC = '<div class="dd-h">The ~$60B, 10-year Experiences plan</div>'+
    '<p class="dd-sub">'+esc(DIS_PLAN_THESIS)+'</p>'+ kpis + alloc + capex;
  var whatC  = pillars;
  var howC   = growth + '<div class="ov-foot">'+esc(DIS_PLAN_SOURCES)+'</div>';
  return tabs +
    '<div class="wwh-pane" data-wwh="where">'+whereC+'</div>'+
    '<div class="wwh-pane" data-wwh="what" hidden>'+whatC+'</div>'+
    '<div class="wwh-pane" data-wwh="how" hidden>'+howC+'</div>';
}
function buildPlanCapex(root){
  var cv = (root||document).querySelector('#planCapex'); if(!cv || !canBuild(cv)) return;
  if(cv._chart){ try{ cv._chart.destroy(); }catch(e){} cv._chart=null; }
  var idxs=[5,6,7,8,9];   // FY24 .. FY28E (plan window we have data for)
  var capex = DM_SEG_DETAIL.Experiences.capex;
  var labels = idxs.map(function(i){ return DM_YEARS[i]; });
  var vals = idxs.map(function(i){ return capex[i]; });
  var cum=[], run=0; vals.forEach(function(v){ run+=(v||0); cum.push(run); });
  cv._chart = new Chart(cv.getContext('2d'), {
    data:{ labels:labels, datasets:[
      { type:'bar', label:'Experiences capex (annual)', data:vals, yAxisID:'y', order:2,
        backgroundColor:idxs.map(function(i){ return DM_ISEST[i]?hexA(SEG_EXP,.45):SEG_EXP; }),
        borderColor:SEG_EXP, borderWidth:idxs.map(function(i){ return DM_ISEST[i]?1.2:0; }), borderRadius:3, maxBarThickness:54 },
      { type:'line', label:'Cumulative vs $60B', data:cum, yAxisID:'y1', order:1,
        borderColor:DIS_BRAND, backgroundColor:DIS_BRAND, borderWidth:2.5, tension:.25, pointRadius:3, pointBackgroundColor:'#fff', pointBorderColor:DIS_BRAND, pointBorderWidth:2 },
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:8 } },
      plugins:{ legend:{ display:true, position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': $'+(ctx.parsed.y/1000).toFixed(1)+'B'; } } } },
      scales:{ x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } },
        y:{ grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return '$'+(v/1000).toFixed(0)+'B'; } } },
        y1:{ position:'right', grid:{ display:false }, min:0, max:60000, ticks:{ color:DIS_BRAND, font:{ size:10 }, callback:function(v){ return '$'+(v/1000).toFixed(0)+'B'; } } } } }
  });
}

// The simple depreciation calculator (editable useful lives → added annual D&A).
function depCalc(){
  var C = DIS_DEPR_CALC;
  var rows = C.buckets.map(function(b,i){
    var amt = C.total*b.pct/100, da = amt/b.life;
    return '<tr><td>'+esc(b.k)+'</td><td>'+b.pct+'%</td><td>$'+amt.toFixed(0)+'B</td>'+
      '<td><input type="number" class="depr-life" data-b="'+i+'" value="'+b.life+'" min="3" max="50" step="1"> <span style="color:var(--mu);font-size:9.5px">('+esc(b.range)+')</span></td>'+
      '<td class="depr-da" data-b="'+i+'">$'+da.toFixed(2)+'B</td></tr>';
  }).join('');
  return '<div class="dfin-wrap"><table class="dfin depr-tbl">'+
    '<thead><tr><th>Where the $60B goes</th><th>Share</th><th>Amount</th><th>Useful life (yrs)</th><th>Adds to D&amp;A / yr</th></tr></thead>'+
    '<tbody>'+rows+
    '<tr class="dfin-tot"><td>Total</td><td>100%</td><td>$60B</td><td></td><td class="depr-total">—</td></tr>'+
    '</tbody></table></div>'+
    '<div class="depr-sum" data-depr-summary></div>'+
    '<div class="dd-note">'+esc(C.caveat)+'</div>';
}
function buildDepCalc(root){
  var scope = root || document; var C = DIS_DEPR_CALC; var total = 0;
  scope.querySelectorAll('.depr-life').forEach(function(inp){
    var i = parseInt(inp.getAttribute('data-b'),10); var b = C.buckets[i]; if(!b) return;
    var life = parseFloat(inp.value); if(!life || life<=0) life = b.life;
    var amt = C.total*b.pct/100, da = amt/life; total += da;
    var cell = scope.querySelector('.depr-da[data-b="'+i+'"]'); if(cell) cell.textContent = '$'+da.toFixed(2)+'B';
  });
  var totCell = scope.querySelector('.depr-total'); if(totCell) totCell.textContent = '~$'+total.toFixed(1)+'B';
  var sum = scope.querySelector('[data-depr-summary]');
  if(sum){ var combined = total + C.currentDA, mult = combined / C.currentDA;
    sum.innerHTML = 'At full deployment this adds <b>≈ $'+total.toFixed(1)+'B/yr</b> of depreciation. On top of today’s ~$'+C.currentDA.toFixed(1)+'B of Experiences D&amp;A, segment D&amp;A heads toward <b>~$'+combined.toFixed(1)+'B/yr (~'+mult.toFixed(1)+'×)</b> — the bet is that new-capacity revenue grows faster than this.'; }
}

// ─── Bottom Line ▸ Returns & Depreciation — useful lives, the capex→D&A→OI relationship, J-curve ─
// Smooth path (Catmull-Rom → cubic Bézier) through a list of [x,y] points.
function smoothPath(pts){
  if(!pts.length) return ''; var d='M'+pts[0][0]+' '+pts[0][1];
  for(var i=0;i<pts.length-1;i++){
    var p0=pts[i-1]||pts[i], p1=pts[i], p2=pts[i+1], p3=pts[i+2]||p2;
    var c1x=p1[0]+(p2[0]-p0[0])/6, c1y=p1[1]+(p2[1]-p0[1])/6;
    var c2x=p2[0]-(p3[0]-p1[0])/6, c2y=p2[1]-(p3[1]-p1[1])/6;
    d+=' C'+c1x.toFixed(1)+' '+c1y.toFixed(1)+','+c2x.toFixed(1)+' '+c2y.toFixed(1)+','+p2[0]+' '+p2[1];
  }
  return d;
}
// A visual J-curve: cumulative operating-income contribution of an investment over its life.
function jcurveSVG(){
  var W=640, H=250, zeroY=150, x0=24, x1=616;
  var phaseX=[80,205,335,485,596];                 // one x per phase (1..5)
  var phaseY=[178,208,138,72,86];                   // y<zeroY = accretive, y>zeroY = drag
  var pts=[[x0,150]]; phaseX.forEach(function(x,i){ pts.push([x,phaseY[i]]); });
  var curve=smoothPath(pts);
  var area=curve+' L'+phaseX[4]+' '+zeroY+' L'+x0+' '+zeroY+' Z';
  var split=(zeroY/H).toFixed(3);
  var dots=DIS_RET_PHASES.map(function(ph,i){
    var x=phaseX[i], y=phaseY[i], col=ph.drag?'#E0A03A':'#2FA36B', ly=(y>zeroY?y+4:y+4);
    return '<circle cx="'+x+'" cy="'+y+'" r="9" fill="'+col+'"/>'+
      '<text x="'+x+'" y="'+(y+3.5)+'" text-anchor="middle" font-size="10.5" font-weight="800" fill="#fff">'+(i+1)+'</text>';
  }).join('');
  var labels=DIS_RET_PHASES.map(function(ph,i){
    var x=phaseX[i], y=phaseY[i], below=y>zeroY, ty=below?y+26:y-16;
    var nm=ph.ph.replace(/^\d+\s·\s/,'');
    return '<text x="'+x+'" y="'+ty+'" text-anchor="middle" font-size="10" font-weight="700" fill="#334155">'+esc(nm)+'</text>';
  }).join('');
  return '<div class="jc"><svg viewBox="0 0 '+W+' '+H+'" class="jc-svg" preserveAspectRatio="xMidYMid meet">'+
    '<defs><linearGradient id="jcg" x1="0" y1="0" x2="0" y2="1">'+
      '<stop offset="0" stop-color="#2FA36B" stop-opacity="0.18"/><stop offset="'+split+'" stop-color="#2FA36B" stop-opacity="0.18"/>'+
      '<stop offset="'+split+'" stop-color="#E0A03A" stop-opacity="0.20"/><stop offset="1" stop-color="#E0A03A" stop-opacity="0.20"/>'+
    '</linearGradient></defs>'+
    '<path d="'+area+'" fill="url(#jcg)"/>'+
    '<line x1="'+x0+'" y1="'+zeroY+'" x2="'+x1+'" y2="'+zeroY+'" stroke="#B7C0CC" stroke-width="1" stroke-dasharray="4 3"/>'+
    '<text x="'+x0+'" y="'+(zeroY-6)+'" font-size="9.5" font-weight="700" fill="#8A93A0">break-even</text>'+
    '<text x="34" y="30" font-size="9.5" font-weight="800" fill="#2FA36B">▲ accretive (returns)</text>'+
    '<text x="34" y="'+(H-10)+'" font-size="9.5" font-weight="800" fill="#C77E12">▼ near-term drag</text>'+
    '<text x="'+x1+'" y="'+(H-10)+'" text-anchor="end" font-size="9.5" fill="#8A93A0">time / life of the asset →</text>'+
    '<path d="'+curve+'" fill="none" stroke="#1D3FB8" stroke-width="2.6"/>'+
    dots+labels+
  '</svg></div>';
}
// A collapsible deep-dive section (header + toggling body). id lets us rebuild charts on open.
function collapSec(id, title, inner, open){
  return '<div class="dcol'+(open?' open':'')+'" data-dcol="'+id+'">'+
    '<button type="button" class="dcol-h"><span class="dcol-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="dcol-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}
function returnsBody(){
  var livesRows = DIS_USEFUL_LIVES.map(function(l){
    return '<tr><td>'+esc(l.asset)+'</td><td class="rlt-life">'+esc(l.life)+'</td><td class="rlt-n">'+esc(l.note)+'</td></tr>';
  }).join('');
  var livesInner = '<div class="dfin-wrap"><table class="rlt"><thead><tr><th>Asset type</th><th>Useful life</th><th>What it covers</th></tr></thead><tbody>'+livesRows+'</tbody></table></div>'+
    '<div class="dd-note">'+esc(DIS_LIVES_NOTE)+'</div>';
  var calcInner = '<p class="dd-sub" style="margin:0 0 8px">'+DIS_DEPR_MATH+'</p>'+depCalc();
  var chartInner = '<div class="dd-chart" style="height:320px"><canvas id="retChart"></canvas></div>'+
    '<div class="dd-note">'+esc(DIS_RET_CHART_NOTE)+'</div>';
  var phases = '<div class="rph">'+DIS_RET_PHASES.map(function(p){
    var col = p.drag ? '#E0A03A' : '#2FA36B';
    var tag = p.drag ? '<span class="rph-tag" style="color:#B87708;background:#FBF0DC">near-term drag</span>' : '<span class="rph-tag" style="color:#1B7A4E;background:#DFF3E8">accretive</span>';
    return '<div class="rph-c" style="--seg:'+col+'"><div class="rph-l"><div class="rph-ph">'+esc(p.ph)+'</div><div class="rph-yrs">'+esc(p.yrs)+'</div></div>'+
      '<div class="rph-d">'+esc(p.d)+tag+'</div></div>';
  }).join('')+'</div>';
  var jcurveInner = jcurveSVG() + phases;
  return '<div class="dd-h" style="margin-bottom:10px">Returns &amp; depreciation — reading the payoff over time</div>'+
    collapSec('lives', 'Useful lives — how long Disney depreciates each asset', livesInner, true)+
    collapSec('calc',  'The simple math — what the $60B adds to annual D&A', calcInner, false)+
    collapSec('chart', 'Investment, depreciation & returns over time', chartInner, false)+
    collapSec('jcurve','The investment return profile (the J-curve)', jcurveInner, false)+
    '<div class="ov-foot">Useful lives per Disney’s 10-K PP&amp;E note; cruise-ship life per cruise-industry convention. Capex, D&amp;A and operating income are the Bloomberg model (Experiences segment). The D&amp;A calculator and the J-curve are simplified, illustrative frameworks — not company data.</div>';
}
function buildRetChart(root){
  var cv = (root||document).querySelector('#retChart'); if(!cv || !canBuild(cv)) return;
  if(cv._chart){ try{ cv._chart.destroy(); }catch(e){} cv._chart=null; }
  var idxs=[3,4,5,6,7,8,9];   // FY22 .. FY28E
  var E = DM_SEG_DETAIL.Experiences, oiA = DM_SEG.oi.Experiences;
  var labels = idxs.map(function(i){ return DM_YEARS[i]; });
  var capex = idxs.map(function(i){ return E.capex[i]; });
  var da    = idxs.map(function(i){ return E.da[i]; });
  var oi    = idxs.map(function(i){ return oiA[i]; });
  function line(label,data,color){ return { type:'line', label:label, data:data, borderColor:color, backgroundColor:color, borderWidth:2.5, tension:.25, pointRadius:3, pointBackgroundColor:'#fff', pointBorderColor:color, pointBorderWidth:2 }; }
  cv._chart = new Chart(cv.getContext('2d'), {
    data:{ labels:labels, datasets:[
      { type:'bar', label:'Capex', data:capex, order:3, borderRadius:3, maxBarThickness:44,
        backgroundColor:idxs.map(function(i){ return DM_ISEST[i]?hexA(SEG_EXP,.42):SEG_EXP; }),
        borderColor:SEG_EXP, borderWidth:idxs.map(function(i){ return DM_ISEST[i]?1.2:0; }) },
      Object.assign(line('Depreciation & amortization', da, '#8A93A0'), { order:2 }),
      Object.assign(line('Operating income', oi, DIS_BRAND), { order:1 }),
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:8 } },
      plugins:{ legend:{ display:true, position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': $'+(ctx.parsed.y/1000).toFixed(1)+'B'; } } } },
      scales:{ x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } },
        y:{ grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return '$'+(v/1000).toFixed(0)+'B'; } } } } }
  });
}

// ─── Bottom Line ▸ Disney+ — a simple, interactive streaming overview ─────────────
function dplusStudioColor(s){ var m={}; DIS_DPLUS_STUDIOS.forEach(function(x){ m[x.k]=x.color; }); return m[s]||DIS_BRAND; }
function dplusBody(){
  var kpis = '<div class="dd-kpis">'+DIS_DPLUS_KPIS.map(function(k){
    return '<div class="dd-kpi"><div class="dd-kpi-v">'+esc(k[0])+'</div><div class="dd-kpi-k">'+esc(k[1])+'</div></div>';
  }).join('')+'</div>';
  var viewTog = '<div class="wf-row"><span class="wf-lbl">View</span><div class="dmm-tog" data-dpview><button type="button" class="active" data-v="table">Table</button><button type="button" data-v="chart">Chart</button></div></div>';
  var tableWrap = '<div id="dplusTableWrap">'+
    '<div class="wf-row" style="margin:0 0 8px;gap:8px 16px">'+
      '<span class="wf-lbl">Mode</span><div class="dmm-tog" data-dpmode><button type="button" class="active" data-m="val">$ Value</button><button type="button" data-m="yoy">YoY %</button></div>'+
      '<span class="wf-lbl">Years</span><span class="exp-range" style="margin:0">'+dpYearSelect('from',2)+'<span>→</span>'+dpYearSelect('to',9)+'</span>'+
    '</div>'+
    '<div class="dfin-wrap"><div id="dplusTable"></div></div>'+
    '<div class="dd-note" style="margin-top:6px">'+esc(DIS_DPLUS_NOTE)+'</div></div>';
  var chartWrap = '<div id="dplusChartWrap" hidden>'+
    '<div class="dmm-tog" data-dplusm style="margin-bottom:8px"><button type="button" class="active" data-m="subs">Subscribers &amp; ARPU</button><button type="button" data-m="pl">Streaming P&amp;L</button></div>'+
    '<div class="dd-chart" style="height:300px"><canvas id="dplusChart"></canvas></div></div>';
  var stratSec = '<div class="dd-cardt" style="margin:22px 0 8px">The strategy</div>'+
    '<div class="dstr">'+DIS_DPLUS_STRATEGY.map(function(s){ return '<div class="dstr-c"><div class="dstr-t">'+esc(s.t)+'</div><div class="dstr-d">'+esc(s.d)+'</div></div>'; }).join('')+'</div>';
  var dtcSlate = '<div class="dd-cardt" style="margin:22px 0 8px">Coming to Disney+ — streaming originals that drive engagement</div>'+
    '<div class="wf-row">'+slateStudioChips('data-dtcstudio')+'</div><div id="dtcSlate" class="dsl"></div>';
  var dtc = '<div class="wwh-pane" data-wwh="dtc">'+kpis+viewTog+tableWrap+chartWrap+stratSec+dtcSlate+'</div>';
  var mvModeTog = '<div class="dmm-tog" data-mvmode><button type="button" class="active" data-m="upcoming">Upcoming</button><button type="button" data-m="past">Past</button></div>';
  var mvUpcoming = '<div data-mvview="upcoming"><div id="mvSlate" class="dsl"></div></div>';
  var mvPast = '<div data-mvview="past" hidden>'+
    '<div id="mvPastKpis" class="dd-kpis"></div>'+
    '<div class="mvb-legend"><i></i>average worldwide gross for the current filter</div>'+
    '<div id="mvPast" class="mvb"></div>'+
    '<div class="dd-note" style="margin-top:8px">'+esc(DIS_MOVIES_PAST_NOTE)+'</div></div>';
  var movies = '<div class="wwh-pane" data-wwh="movies" hidden>'+
    '<p class="dd-sub">'+esc(DIS_MOVIES_INTRO)+'</p>'+mvModeTog+
    '<div class="wf-row">'+slateStudioChips('data-mvstudio')+'</div>'+mvUpcoming+mvPast+'</div>';
  var linPts = '<div class="dstr">'+DIS_LINEAR_POINTS.map(function(s){ return '<div class="dstr-c"><div class="dstr-t">'+esc(s.t)+'</div><div class="dstr-d">'+esc(s.d)+'</div></div>'; }).join('')+'</div>';
  var linear = '<div class="wwh-pane" data-wwh="linear" hidden>'+
    '<p class="dd-sub">'+esc(DIS_LINEAR_INTRO)+'</p>'+
    '<div class="dd-cardt" style="margin:14px 0 6px">Advertising is shrinking</div>'+
    '<div class="dd-chart" style="height:240px"><canvas id="linChart"></canvas></div>'+
    '<div class="dd-note" style="margin:6px 0 0">'+esc(DIS_LINEAR_CHART_NOTE)+'</div>'+
    '<div class="dd-cardt" style="margin:18px 0 8px">The read</div>'+linPts+'</div>';
  var tabs = '<div class="wwh-tabs">'+
    '<button type="button" class="wwh-tab active" data-wwh="dtc"><span class="wwh-t">DTC</span><span class="wwh-sub">Disney+ &amp; Hulu streaming</span></button>'+
    '<button type="button" class="wwh-tab" data-wwh="movies"><span class="wwh-t">Movies</span><span class="wwh-sub">Studio / theatrical slate</span></button>'+
    '<button type="button" class="wwh-tab" data-wwh="linear"><span class="wwh-t">Linear Networks</span><span class="wwh-sub">ABC &amp; cable, in decline</span></button>'+
  '</div>';
  return '<div class="dd-h" style="margin-bottom:12px">Entertainment — film, TV &amp; streaming</div>'+tabs+dtc+movies+linear;
}
// FY21 (idx 2) .. FY28E (idx 9) year-range select for the Disney+ table.
function dpYearSelect(which, def){ var o=''; for(var i=2;i<=9;i++){ o+='<option value="'+i+'"'+(i===def?' selected':'')+'>'+DM_YEARS[i]+'</option>'; } return '<select class="exp-ysel dp-'+which+'">'+o+'</select>'; }
// The streaming KPI table — same design as the Top Line segment tables.
function buildDplusTable(root){
  var scope = root||document; var out = scope.querySelector('#dplusTable'); if(!out) return;
  var mode = ddTog(scope, '[data-dpmode]', 'data-m', 'val'); var S=DM_STREAM;
  var fs=scope.querySelector('.dp-from'), ts=scope.querySelector('.dp-to');
  var fromIdx = fs?parseInt(fs.value,10):2, toIdx = ts?parseInt(ts.value,10):9;
  if(toIdx<fromIdx){ var t=toIdx; toIdx=fromIdx; fromIdx=t; }
  var margin = S.dtcOI.map(function(oi,i){ var r=S.dtcRev[i]; return (oi==null||r==null||r===0)?null:(oi/r*100); });
  var rows = [
    { n:'Disney+ Core subs', a:S.disneyPlusSubs, f:'subs' },
    { n:'Disney+ ARPU / mo', a:S.disneyPlusArpu, f:'arpu' },
    { n:'Hulu subscribers',  a:S.huluSubs, f:'subs' },
    { n:'DTC revenue',       a:S.dtcRev, f:'bn' },
    { n:'DTC operating income', a:S.dtcOI, f:'bn' },
    { n:'SVOD margin',       a:margin, f:'pct' },
  ];
  var cols=[]; for(var i=fromIdx;i<=toIdx;i++) cols.push(i);
  function fmtv(v,f){ if(v==null) return '—'; if(f==='subs') return (v/1000).toFixed(1)+'M'; if(f==='arpu') return '$'+v.toFixed(2); if(f==='bn') return '$'+(v/1000).toFixed(1)+'B'; return v.toFixed(1)+'%'; }
  function yoy(a,i){ var p=a[i-1],v=a[i]; if(v==null||p==null||p===0) return '—'; var g=(v/p-1)*100; return '<span style="color:'+(g>=0?'#2FA36B':'#E0463C')+'">'+(g>=0?'+':'')+g.toFixed(1)+'%</span>'; }
  function cell(r,i){ return mode==='yoy' ? yoy(r.a,i) : fmtv(r.a[i], r.f); }
  function cagr(r){ var a=r.a, av=a[fromIdx], bv=a[toIdx], n=toIdx-fromIdx; if(av==null||bv==null||av<=0||n<=0) return '—'; var g=(Math.pow(bv/av,1/n)-1)*100; return (g>=0?'+':'')+g.toFixed(1)+'%'; }
  var cagrHdr='CAGR <span style="font-weight:600;font-size:8.5px;color:var(--mu)">'+esc(DM_YEARS[fromIdx])+'–'+esc(DM_YEARS[toIdx])+'</span>';
  var head='<tr><th>Metric</th>'+cols.map(function(i){ return '<th class="'+(DM_ISEST[i]?'est':'')+'">'+esc(DM_YEARS[i])+'</th>'; }).join('')+'<th class="cagr">'+cagrHdr+'</th></tr>';
  var body=rows.map(function(r){ return '<tr><td>'+esc(r.n)+'</td>'+cols.map(function(i){ return '<td class="'+(DM_ISEST[i]?'est':'')+'">'+cell(r,i)+'</td>'; }).join('')+'<td class="cagr">'+cagr(r)+'</td></tr>'; }).join('');
  out.innerHTML='<table class="dfin"><thead>'+head+'</thead><tbody>'+body+'</tbody></table>';
}
// Dispatcher for the DTC pane — table or chart.
function buildDplus(root){
  var view = ddTog(root, '[data-dpview]', 'data-v', 'table');
  var tw = root.querySelector('#dplusTableWrap'), cw = root.querySelector('#dplusChartWrap');
  if(view==='chart'){ if(tw) tw.hidden=true; if(cw) cw.hidden=false; requestAnimationFrame(function(){ buildDplusChart(root); }); }
  else { if(cw) cw.hidden=true; if(tw) tw.hidden=false; buildDplusTable(root); }
}
// Build the active Entertainment sub-tab (DTC / Movies / Linear Networks).
function buildEnt(root){
  var pane = root.querySelector('.ovt-subpane[data-ovst="dplus"]'); if(!pane) return;
  var act = pane.querySelector(':scope > .wwh-tabs > .wwh-tab.active');
  var k = act ? act.getAttribute('data-wwh') : 'dtc';
  if(k==='linear') requestAnimationFrame(function(){ buildLinearChart(root); });
  else if(k==='dtc') buildDplus(root);
  // movies: slate is static HTML (built at init)
}
function slateRows(list){
  return list.map(function(p){ var c=dplusStudioColor(p.studio);
    return '<div class="dsl-row" style="--seg:'+c+'"><span class="dsl-date">'+esc(p.date)+'</span>'+
      '<span class="dsl-main"><span class="dsl-t">'+esc(p.title)+'</span><div class="dsl-why">'+esc(p.why)+'</div></span>'+
      '<span class="dsl-type" style="color:'+c+';background:'+hexA(c,.14)+'">'+esc(p.studio)+'</span></div>';
  }).join('');
}
function slateStudioChips(attr){
  return '<span class="wf-lbl">Studio</span><span class="wf-chips"><button type="button" class="wchip active" '+attr+'="all">All</button>'+
    DIS_DPLUS_STUDIOS.map(function(s){ return '<button type="button" class="wchip" '+attr+'="'+esc(s.k)+'"><span class="wchip-dot" style="background:'+s.color+'"></span>'+esc(s.k)+'</button>'; }).join('')+'</span>';
}
function buildSlate(root, containerId, attr, type){
  var scope=root||document; var out=scope.querySelector('#'+containerId); if(!out) return;
  var active=scope.querySelector('['+attr+'].active'); var studio=active?active.getAttribute(attr):'all';
  var list=DIS_DPLUS_SLATE.filter(function(p){ return p.type===type && (studio==='all'||p.studio===studio); });
  out.innerHTML = list.length ? slateRows(list) : '<div class="wempty">No titles match.</div>';
}
// Movies ▸ Past — worldwide box-office bars + summary tiles, recomputed for the active studio filter.
function fmtBO(v){ return v>=1e9 ? '$'+(v/1e9).toFixed(2)+'B' : '$'+Math.round(v/1e6)+'M'; }
function buildMoviesPast(root){
  var scope=root||document; var out=scope.querySelector('#mvPast'); if(!out) return;
  var active=scope.querySelector('[data-mvstudio].active'); var studio=active?active.getAttribute('data-mvstudio'):'all';
  var list=DIS_MOVIES_PAST.filter(function(p){ return studio==='all'||p.studio===studio; })
    .slice().sort(function(a,b){ return b.ww-a.ww; });
  var kwrap=scope.querySelector('#mvPastKpis');
  if(!list.length){ if(kwrap) kwrap.innerHTML=''; out.innerHTML='<div class="wempty">No titles match.</div>'; return; }
  var n=list.length, total=list.reduce(function(s,p){ return s+p.ww; },0), avg=total/n;
  var s=list.map(function(p){ return p.ww; }).sort(function(a,b){ return a-b; });
  var median = n%2 ? s[(n-1)/2] : (s[n/2-1]+s[n/2])/2;
  var billion=list.filter(function(p){ return p.ww>=1e9; }).length;
  var kpis=[
    [fmtBO(avg),    'Avg worldwide gross'],
    [fmtBO(median), 'Median gross'],
    [n+' films',    studio==='all'?'FY21–25 theatrical':studio+' releases'],
    [billion+' / '+n, 'Crossed $1B'],
  ];
  if(kwrap) kwrap.innerHTML=kpis.map(function(k){ return '<div class="dd-kpi"><div class="dd-kpi-v">'+esc(k[0])+'</div><div class="dd-kpi-k">'+esc(k[1])+'</div></div>'; }).join('');
  var max=list[0].ww||1, avgPct=Math.min(100, avg/max*100);
  out.innerHTML=list.map(function(p){ var c=dplusStudioColor(p.studio); var pct=Math.max(1, p.ww/max*100);
    return '<div class="mvb-row">'+
      '<span class="mvb-name"><span class="mvb-dot" style="background:'+c+'"></span><span class="mvb-t">'+esc(p.title)+'</span><span class="mvb-d">'+esc(p.date)+'</span></span>'+
      '<span class="mvb-track"><span class="mvb-fill" style="width:'+pct.toFixed(1)+'%;background:'+c+'"></span><span class="mvb-avg" style="left:'+avgPct.toFixed(1)+'%"></span></span>'+
      '<span class="mvb-v">'+fmtBO(p.ww)+'</span></div>';
  }).join('');
}
// Movies pane dispatcher — Upcoming slate or Past box-office view, per the active toggle + studio filter.
function buildMovies(root){
  var scope=root||document;
  var mode=ddTog(scope, '[data-mvmode]', 'data-m', 'upcoming');
  var up=scope.querySelector('[data-mvview="upcoming"]'), pa=scope.querySelector('[data-mvview="past"]');
  if(mode==='past'){ if(up) up.hidden=true; if(pa) pa.hidden=false; buildMoviesPast(root); }
  else { if(pa) pa.hidden=true; if(up) up.hidden=false; buildSlate(root,'mvSlate','data-mvstudio','Film'); }
}
// ─── Bottom Line ▸ Sports (ESPN) — rights portfolio, the NFL deal, the DTC pivot ──
function espnStatusColor(s){ return s==='losing' ? '#E0463C' : (s==='new' ? '#2FA36B' : '#1D3FB8'); }
function fmtFee(v){ return v>=1e9 ? '$'+(v/1e9).toFixed(1).replace(/\.0$/,'')+'B' : '$'+Math.round(v/1e6)+'M'; }
function sportsBody(){
  var N = DIS_ESPN_NFL;
  var kpis = '<div class="dd-kpis">'+DIS_ESPN_KPIS.map(function(k){
    return '<div class="dd-kpi"><div class="dd-kpi-v">'+esc(k[0])+'</div><div class="dd-kpi-k">'+esc(k[1])+'</div></div>';
  }).join('')+'</div>';
  // NFL deal — the asset-for-equity swap + the existing media deal
  function swapCol(head, cls, items){
    return '<div class="espn-swap-col"><div class="espn-swap-h">'+head+'</div>'+
      items.map(function(x){ return '<div class="espn-swap-c '+cls+'"><div class="espn-swap-t">'+esc(x.t)+'</div><div class="espn-swap-d">'+esc(x.d)+'</div></div>'; }).join('')+'</div>';
  }
  var mid = '<div class="espn-swap-mid"><div class="espn-swap-eq">Asset-for-equity swap</div><div class="espn-swap-ar">⇄</div>'+
    '<div class="espn-swap-eq">'+esc(N.equityPct)+'% of ESPN<br>≈ '+esc(N.impliedEv)+' value</div></div>';
  var mnf = '<div class="espn-mnf"><div class="espn-mnf-h">The existing media deal '+
      '<span class="espn-mnf-tag">'+fmtFee(N.media.annual)+'/yr · '+N.media.start+'–'+N.media.end+'</span>'+
      '<span class="espn-mnf-tag" style="color:#E0463C;background:rgba(224,70,60,.1)">opt-out '+N.media.optOut+'</span></div>'+
    '<div class="espn-mnf-g">'+N.media.covers.map(function(x){ return '<div class="espn-mnf-c"><div class="espn-mnf-t">'+esc(x.t)+'</div><div class="espn-mnf-d">'+esc(x.d)+'</div></div>'; }).join('')+'</div></div>';
  var deal = '<div class="dd-cardt" style="margin:16px 0 8px">🏈 The NFL deal — two moving parts</div>'+
    '<div class="espn-deal"><div class="espn-swap">'+
      swapCol('ESPN <b>receives</b>', 'eg', N.espnGets)+mid+swapCol('NFL <b>receives</b>', 'ng', N.nflGets)+
    '</div>'+mnf+'<div class="dd-note" style="margin-top:11px">'+esc(N.note)+'</div></div>';
  // Rights portfolio timeline
  var chips = [['all','All'],['held','Held'],['new','New / won'],['renew','Renews soon'],['losing','Losing']];
  var filters = '<div class="wf-row"><span class="wf-lbl">Show</span><span class="wf-chips">'+
    chips.map(function(c,i){ return '<button type="button" class="wchip'+(i===0?' active':'')+'" data-espnf="'+c[0]+'">'+esc(c[1])+'</button>'; }).join('')+'</span></div>';
  var legend = '<div class="espn-glegend">'+
    '<span><i style="background:#1D3FB8"></i>Held</span>'+
    '<span><i style="background:#2FA36B"></i>New / won</span>'+
    '<span><i style="background:#E0463C"></i>Losing (off ESPN 2026)</span>'+
    '<span><i style="width:2px;border-radius:0;background:var(--navy);opacity:.6"></i>Today</span></div>';
  var timeline = '<div class="dd-cardt" style="margin:22px 0 8px">📅 Rights portfolio — what they hold, and when it renews</div>'+
    filters+'<div class="espn-gwrap"><div id="espnGantt"></div></div>'+legend+
    '<div class="dd-note" style="margin-top:4px">'+esc(DIS_ESPN_RIGHTS_NOTE)+'</div>';
  // Insights
  var insights = '<div class="dd-cardt" style="margin:22px 0 8px">🔍 More ESPN insights</div>'+
    '<div class="dstr">'+DIS_ESPN_INSIGHTS.map(function(s){ return '<div class="dstr-c"><div class="dstr-t">'+esc(s.ic)+' '+esc(s.t)+'</div><div class="dstr-d">'+esc(s.d)+'</div></div>'; }).join('')+'</div>';
  return '<p class="dd-sub">'+esc(DIS_ESPN_INTRO)+'</p>'+kpis+deal+timeline+insights;
}
// Render the rights Gantt for the active status filter (bars 2022→2037, today marker at 2026).
function buildSports(root){
  var scope=root||document; var out=scope.querySelector('#espnGantt'); if(!out) return;
  var active=scope.querySelector('[data-espnf].active'); var f=active?active.getAttribute('data-espnf'):'all';
  var list=DIS_ESPN_RIGHTS.filter(function(r){
    if(f==='all') return true; if(f==='renew') return !!r.renew; return r.status===f;
  }).slice().sort(function(a,b){ return b.annual-a.annual; });
  var YMIN=2022, YMAX=2037, span=YMAX-YMIN;
  function x(y){ var c=Math.max(YMIN, Math.min(YMAX, y)); return (c-YMIN)/span*100; }
  var ticks=[2022,2025,2028,2031,2034,2037];
  var axis='<div class="espn-axis" style="margin-left:220px">'+ticks.map(function(y){ return '<span class="espn-axis-yr" style="left:'+x(y).toFixed(2)+'%">'+y+'</span>'; }).join('')+'</div>';
  if(!list.length){ out.innerHTML=axis+'<div class="wempty" style="margin-top:8px">No rights match.</div>'; return; }
  var rows=list.map(function(r){
    var c=espnStatusColor(r.status);
    var L=x(r.start), R=x(r.end), w=Math.max(2.5, R-L);
    var clipL = r.start<YMIN ? ' clip-l' : '';
    var endLbl = r.status==='losing' ? ('ends '+r.end) : ("’"+String(r.end).slice(2));
    var inside = R>84;
    var barLbl = inside ? '<span style="margin-left:auto;padding-right:6px;font-size:9px;font-weight:800;color:#fff">'+endLbl+'</span>' : '';
    var bar='<div class="espn-gbar'+clipL+'" title="'+esc(r.note)+'" style="left:'+L.toFixed(2)+'%;width:'+w.toFixed(2)+'%;background:'+c+'">'+barLbl+'</div>';
    var endTag = inside ? '' : '<span class="espn-gend" style="left:'+R.toFixed(2)+'%;padding-left:5px;color:'+(r.renew?'#E0463C':c)+'">'+endLbl+(r.renew?' ⟳':'')+'</span>';
    return '<div class="espn-grow"><div class="espn-glabel"><span class="espn-gemoji">'+r.emoji+'</span>'+
      '<span class="espn-gname">'+esc(r.league)+'</span><span class="espn-gfee">'+fmtFee(r.annual)+'/yr</span></div>'+
      '<div class="espn-gtrack">'+bar+endTag+'</div></div>';
  }).join('');
  var today='<div class="espn-todaywrap"><div class="espn-gtoday" style="left:'+x(2026).toFixed(2)+'%"><b>TODAY</b></div></div>';
  out.innerHTML=axis+'<div class="espn-gantt">'+today+rows+'</div>';
}
function buildLinearChart(root){
  var cv=(root||document).querySelector('#linChart'); if(!cv || !canBuild(cv)) return;
  if(cv._chart){ try{ cv._chart.destroy(); }catch(e){} cv._chart=null; }
  var idx=[3,4,5,6,7,8,9], adv=DM_SEG_DETAIL.Entertainment.advertising;
  cv._chart=new Chart(cv.getContext('2d'),{ type:'bar', data:{ labels:idx.map(function(i){return DM_YEARS[i];}), datasets:[
    { label:'Entertainment advertising', data:idx.map(function(i){return adv[i];}), borderRadius:3, maxBarThickness:44,
      backgroundColor:idx.map(function(i){return DM_ISEST[i]?hexA('#8A93A0',.5):'#8A93A0';}), borderColor:'#8A93A0', borderWidth:idx.map(function(i){return DM_ISEST[i]?1.2:0;}) },
  ] }, options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{padding:{top:8}},
    plugins:{ legend:{display:false}, tooltip:{callbacks:{label:function(ctx){return '$'+(ctx.parsed.y/1000).toFixed(1)+'B';}}}},
    scales:{ x:{grid:{display:false},ticks:{color:'#8A93A0',font:{size:11}}},
      y:{grid:{color:'#EEF2F7'},ticks:{color:'#8A93A0',font:{size:10},callback:function(v){return '$'+(v/1000).toFixed(0)+'B';}}} } } });
}
function buildDplusChart(root){
  var cv=(root||document).querySelector('#dplusChart'); if(!cv || !canBuild(cv)) return;
  if(cv._chart){ try{ cv._chart.destroy(); }catch(e){} cv._chart=null; }
  var metric = ddTog(root, '[data-dplusm]', 'data-m', 'subs'); var S=DM_STREAM;
  if(metric==='pl'){
    var pi=[3,4,5,6,7,8,9];
    cv._chart=new Chart(cv.getContext('2d'),{ data:{ labels:pi.map(function(i){return DM_YEARS[i];}), datasets:[
      { type:'bar', label:'DTC revenue', data:pi.map(function(i){return S.dtcRev[i];}), yAxisID:'y', order:2, borderRadius:3, maxBarThickness:46,
        backgroundColor:pi.map(function(i){return DM_ISEST[i]?hexA(DIS_BRAND,.4):DIS_BRAND;}), borderColor:DIS_BRAND, borderWidth:pi.map(function(i){return DM_ISEST[i]?1.2:0;}) },
      { type:'line', label:'Operating income (loss)', data:pi.map(function(i){return S.dtcOI[i];}), yAxisID:'y', order:1, spanGaps:true,
        borderColor:'#2FA36B', backgroundColor:'#2FA36B', borderWidth:2.6, tension:.2, pointRadius:3, pointBackgroundColor:'#fff', pointBorderColor:'#2FA36B', pointBorderWidth:2 },
    ] }, options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{padding:{top:8}},
      plugins:{ legend:{display:true,position:'bottom',labels:{boxWidth:10,font:{size:10.5},color:'#6b7684'}},
        tooltip:{callbacks:{label:function(ctx){return ctx.dataset.label+': $'+(ctx.parsed.y/1000).toFixed(1)+'B';}}}},
      scales:{ x:{grid:{display:false},ticks:{color:'#8A93A0',font:{size:11}}},
        y:{grid:{color:'#EEF2F7'},ticks:{color:'#8A93A0',font:{size:10},callback:function(v){return '$'+(v/1000).toFixed(0)+'B';}}} } } });
    return;
  }
  var si=[2,3,4,5,6,7,8,9];
  cv._chart=new Chart(cv.getContext('2d'),{ data:{ labels:si.map(function(i){return DM_YEARS[i];}), datasets:[
    { type:'bar', label:'Disney+ Core subs (M)', data:si.map(function(i){return S.disneyPlusSubs[i]!=null?S.disneyPlusSubs[i]/1000:null;}), yAxisID:'y', order:2, borderRadius:3, maxBarThickness:44,
      backgroundColor:si.map(function(i){return DM_ISEST[i]?hexA(DIS_BRAND,.4):DIS_BRAND;}), borderColor:DIS_BRAND, borderWidth:si.map(function(i){return DM_ISEST[i]?1.2:0;}) },
    { type:'line', label:'ARPU ($/mo)', data:si.map(function(i){return S.disneyPlusArpu[i];}), yAxisID:'y1', order:1,
      borderColor:SEG_EXP, backgroundColor:SEG_EXP, borderWidth:2.6, tension:.25, pointRadius:3, pointBackgroundColor:'#fff', pointBorderColor:SEG_EXP, pointBorderWidth:2 },
  ] }, options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{padding:{top:8}},
    plugins:{ legend:{display:true,position:'bottom',labels:{boxWidth:10,font:{size:10.5},color:'#6b7684'}},
      tooltip:{callbacks:{label:function(ctx){ return ctx.datasetIndex===0 ? (ctx.dataset.label+': '+ctx.parsed.y.toFixed(0)+'M') : ('ARPU: $'+ctx.parsed.y.toFixed(2)); }}}},
    scales:{ x:{grid:{display:false},ticks:{color:'#8A93A0',font:{size:11}}},
      y:{grid:{color:'#EEF2F7'},ticks:{color:'#8A93A0',font:{size:10},callback:function(v){return v+'M';}}},
      y1:{position:'right',grid:{display:false},min:0,ticks:{color:SEG_EXP,font:{size:10},callback:function(v){return '$'+v;}}} } } });
}

// Build the chart of whichever Bottom Line sub-tab is active (canvases need a visible parent).
function buildBottomLine(root){
  var pane = root.querySelector('.dd-pane[data-dd="bottomline"]'); if(!pane) return;
  var act = pane.querySelector(':scope > .ovt-subtabs > .ovt-subtab.active');
  var key = act ? act.getAttribute('data-ovst') : 'plan';
  if(key==='returns') requestAnimationFrame(function(){ buildRetChart(root); });
  else if(key==='dplus') buildEnt(root);
  else if(key==='sports') buildSports(root);
  else requestAnimationFrame(function(){ buildPlanCapex(root); });
}

function deepDiveHtml(c){
  _co = c;
  var h = '<div class="ov ov-dis ov-dis-dd" data-brand="DIS" style="--brand:'+DIS_BRAND+';--brand-soft:#EAF0FF">';
  h += styleBlock();
  // Deep Dive tab spine.
  h += '<div class="dd-tabs">'+
    '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
    '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
  '</div>';
  h += '<div class="dd-pane" data-dd="topline">'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="segments">Segments</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="buildout">Full Buildout</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="segments">'+segmentsSubpane()+'</div>'+
    '<div class="ovt-subpane" data-ovst="buildout" hidden>'+buildoutSubpane()+'</div>'+
  '</div>';
  h += '<div class="dd-pane" data-dd="bottomline" hidden>'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="plan">$60B Expansion Plan</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="returns">Returns &amp; Depreciation</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="dplus">Entertainment</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="sports">Sports (ESPN)</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="plan">'+planBody()+'</div>'+
    '<div class="ovt-subpane" data-ovst="returns" hidden>'+returnsBody()+'</div>'+
    '<div class="ovt-subpane" data-ovst="dplus" hidden>'+dplusBody()+'</div>'+
    '<div class="ovt-subpane" data-ovst="sports" hidden>'+sportsBody()+'</div>'+
  '</div>';
  h += '</div>';
  return h;
}
// ─── OLD Deep Dive removed below — start rebuilding here ──────────────────────────

// ═══════════════════════════════════════════════════════════════════════════════
// CHARTS
// ═══════════════════════════════════════════════════════════════════════════════
// Reusable chart toolkit (kept: the Overview peer scatter uses it). Deep-Dive-specific
// builders were removed with the old panes — we re-add them as we rebuild each section.
function buildScatter(root){ buildScatterInto(root, 'disScatter', '[data-sctog]', 'data-sc', 'data-scb'); }
function buildScatterInto(root, id, togSel, aAttr, bAttr){
  var cv=document.getElementById(id); if(!canBuild(cv)) return; destroy(id);
  var ma = root.querySelector(togSel+' button['+aAttr+'].active');
  var mb = root.querySelector(togSel+' button['+bAttr+'].active');
  var mMode = (ma && ma.getAttribute(aAttr)) || 'ev';
  var bMode = (mb && mb.getAttribute(bAttr)) || 'fwd';
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
// Rebuilding step by step. For now: just the tab spine (one tab). As we add each
// section's charts we build them here per active tab. Data lives in dis-data.js / dis-model.js.
function deepDiveInit(c){
  if(c) _co=c;
  var root = document.querySelector('.copane[data-pane="deepdive"] .ov-dis-dd') || document.querySelector('.ov-dis-dd');
  if(!root) return;
  if(!root._wired){
    root._wired = true;
    // tab spine: switch which .dd-pane is visible
    root.querySelectorAll('.dd-tab').forEach(function(btn){
      btn.addEventListener('click', function(){
        var k = btn.getAttribute('data-dd');
        root.querySelectorAll('.dd-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
        root.querySelectorAll('.dd-pane').forEach(function(p){ p.hidden = p.getAttribute('data-dd')!==k; });
        if(k==='bottomline') buildBottomLine(root);   // canvas needs a visible parent
      });
    });
    // Bottom Line ▸ Plan ▸ Where / What / How segmented tabs
    root.querySelectorAll('.wwh-tab').forEach(function(btn){
      btn.addEventListener('click', function(){
        var k = btn.getAttribute('data-wwh');
        var wrap = btn.closest('.ovt-subpane') || root;
        wrap.querySelectorAll('.wwh-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
        wrap.querySelectorAll('.wwh-pane').forEach(function(p){ p.hidden = p.getAttribute('data-wwh')!==k; });
        if(k==='where') requestAnimationFrame(function(){ buildPlanCapex(root); });   // canvas lives in Where
        else if(k==='dtc') buildDplus(root);                                          // Entertainment ▸ DTC
        else if(k==='linear') requestAnimationFrame(function(){ buildLinearChart(root); });
      });
    });
    // What explorer — filter chips (bucket / region), view toggle, and pin/off-map clicks
    function wireChips(sel){
      root.querySelectorAll(sel).forEach(function(b){ b.addEventListener('click', function(){
        root.querySelectorAll(sel).forEach(function(x){ x.classList.toggle('active', x===b); });
        buildWhat(root);
      }); });
    }
    wireChips('[data-wbucket]'); wireChips('[data-wregion]');
    wireToggle(root, '[data-wview]', function(){ buildWhat(root); });
    var whatOut = root.querySelector('#whatOut');
    if(whatOut) whatOut.addEventListener('click', function(e){
      // Cruise deep-dive — collapsible section headers (delegated, since the panel is rendered on demand)
      var dh = e.target.closest('.dcol-h');
      if(dh && whatOut.contains(dh)){
        var sec = dh.parentElement, open = sec.classList.toggle('open');
        var b = sec.querySelector('.dcol-b'); if(b) b.hidden = !open;
        var ic = dh.querySelector('.dcol-ic'); if(ic) ic.textContent = open?'▾':'▸';
        return;
      }
      var el = e.target.closest('[data-proj]'); if(!el) return;
      var p = DIS_PROJECTS[parseInt(el.getAttribute('data-proj'),10)]; if(!p) return;
      var panel = whatOut.querySelector('#wmapPanel');
      // Map view (pins / off-map chips) -> update the detail panel + highlight the pin
      if(panel && (el.tagName==='circle' || el.classList.contains('wmap-offchip'))){
        panel.style.setProperty('--seg', projBucketColor(p.bucket)); panel.innerHTML = whatMapPanel(p);
        var svg = whatOut.querySelector('.wmap-svg');
        if(svg){
          svg.querySelectorAll('.wmap-pin.sel').forEach(function(c){ c.classList.remove('sel'); });
          var pin = (el.tagName==='circle') ? el : svg.querySelector('.wmap-pin[data-proj="'+el.getAttribute('data-proj')+'"]');
          if(pin){ pin.classList.add('sel'); pin.parentNode.appendChild(pin); }   // select + bring to front
        }
        return;
      }
      // Timeline card -> expand/collapse its detail
      var det = el.querySelector('[data-proj-det]');
      if(det){ det.hidden = !det.hidden; el.classList.toggle('open', !det.hidden); }
    });
    // Where ▸ allocation bar segment -> jump to What, filtered to that bucket
    root.querySelectorAll('[data-plan-bucket]').forEach(function(seg){ seg.addEventListener('click', function(){
      var b = seg.getAttribute('data-plan-bucket');
      var whatTab = root.querySelector('.wwh-tab[data-wwh="what"]'); if(whatTab) whatTab.click();
      root.querySelectorAll('[data-wbucket]').forEach(function(x){ x.classList.toggle('active', x.getAttribute('data-wbucket')===b); });
      buildWhat(root);
    }); });
    buildWhat(root);   // initial render (Cards view)
    // Bottom Line ▸ Disney+ — view (table/chart) + mode + chart-metric toggles, slate filters
    wireToggle(root, '[data-dpview]', function(){ buildDplus(root); });
    wireToggle(root, '[data-dpmode]', function(){ buildDplusTable(root); });
    root.querySelectorAll('.dp-from, .dp-to').forEach(function(sel){ sel.addEventListener('change', function(){ buildDplusTable(root); }); });
    wireToggle(root, '[data-dplusm]', function(){ buildDplusChart(root); });
    // two slate filter groups: DTC (series) and Movies (films)
    root.querySelectorAll('[data-dtcstudio]').forEach(function(b){ b.addEventListener('click', function(){
      root.querySelectorAll('[data-dtcstudio]').forEach(function(x){ x.classList.toggle('active', x===b); }); buildSlate(root,'dtcSlate','data-dtcstudio','Series');
    }); });
    root.querySelectorAll('[data-mvstudio]').forEach(function(b){ b.addEventListener('click', function(){
      root.querySelectorAll('[data-mvstudio]').forEach(function(x){ x.classList.toggle('active', x===b); }); buildMovies(root);
    }); });
    wireToggle(root, '[data-mvmode]', function(){ buildMovies(root); });
    // Bottom Line ▸ Sports (ESPN) — rights-timeline status filter
    root.querySelectorAll('[data-espnf]').forEach(function(b){ b.addEventListener('click', function(){
      root.querySelectorAll('[data-espnf]').forEach(function(x){ x.classList.toggle('active', x===b); }); buildSports(root);
    }); });
    buildDplusTable(root);
    buildSlate(root,'dtcSlate','data-dtcstudio','Series');
    buildMovies(root);
    buildSports(root);
    // Top Line ▸ Full Buildout — sensitivity sliders recompute the model live
    root.querySelectorAll('.bo-sl').forEach(function(sl){ sl.addEventListener('input', function(){
      var box=sl.closest('.bo-in'), v=box?box.querySelector('.bo-val'):null;
      if(v) v.textContent=(sl.getAttribute('data-pre')||'')+sl.value+(sl.getAttribute('data-unit')||'');
      buildBuildout(root);
    }); });
    buildBuildout(root);
    // Bottom Line ▸ Returns — collapsible sections
    root.querySelectorAll('.dcol-h').forEach(function(btn){ btn.addEventListener('click', function(){
      var sec = btn.parentElement, open = sec.classList.toggle('open');
      var b = sec.querySelector('.dcol-b'); if(b) b.hidden = !open;
      var ic = btn.querySelector('.dcol-ic'); if(ic) ic.textContent = open?'▾':'▸';
      if(open && sec.getAttribute('data-dcol')==='chart') requestAnimationFrame(function(){ buildRetChart(root); });
    }); });
    // Bottom Line ▸ Returns — the editable depreciation calculator (pure math, wire once)
    root.querySelectorAll('.depr-life').forEach(function(inp){ inp.addEventListener('input', function(){ buildDepCalc(root); }); });
    buildDepCalc(root);
    // nested sub-tabs (pane-scoped) — e.g. Top Line ▸ Segments
    root.querySelectorAll('.dd-pane').forEach(function(pane){
      pane.querySelectorAll(':scope > .ovt-subtabs > .ovt-subtab').forEach(function(btn){
        btn.addEventListener('click', function(){
          var key = btn.getAttribute('data-ovst');
          pane.querySelectorAll(':scope > .ovt-subtabs > .ovt-subtab').forEach(function(b){ b.classList.toggle('active', b===btn); });
          pane.querySelectorAll(':scope > .ovt-subpane').forEach(function(p){ p.hidden = p.getAttribute('data-ovst')!==key; });
          if(pane.getAttribute('data-dd')==='bottomline') buildBottomLine(root);   // (re)build the visible chart
        });
      });
    });
    // Segment toggle (Entertainment / Sports / Experiences) — show one card, (re)build it.
    wireToggle(root, '[data-segseltog]', function(){
      var v = root.querySelector('[data-segseltog] button.active').getAttribute('data-ss');
      root.querySelectorAll('[data-segview]').forEach(function(el){ el.hidden = el.getAttribute('data-segview')!==v; });
      var card = root.querySelector('.subseg-c[data-segview="'+v+'"]');
      if(card && card.getAttribute('data-segbuilt')==='1') buildSegView(card, v);
    });
    // Per built-segment explorer — metric / breakdown / mode / view + year-range, scoped to the card.
    root.querySelectorAll('.subseg-c[data-segbuilt="1"]').forEach(function(card){
      var seg = card.getAttribute('data-segview');
      renderMetrics(card, seg);   // fill the metric toggle (segment-specific) before wiring it
      wireToggle(card, '.seg-metric', function(){ segSyncControls(card, seg); buildSegView(card, seg); });
      wireToggle(card, '.seg-mode',   function(){ buildSegView(card, seg); });
      wireToggle(card, '.seg-view',   function(){ buildSegView(card, seg); });
      // the breakdown toggle is re-rendered per metric, so delegate its clicks
      var bwrap = card.querySelector('.seg-break');
      if(bwrap) bwrap.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b||b.disabled) return;
        bwrap.querySelectorAll('button').forEach(function(x){ x.classList.toggle('active', x===b); }); buildSegView(card, seg); });
      card.querySelectorAll('.seg-from, .seg-to').forEach(function(sel){ sel.addEventListener('change', function(){ buildSegView(card, seg); }); });
      segSyncControls(card, seg);
      buildSegView(card, seg);
    });
  }
}

export var disOverview = { html: html, init: init, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
