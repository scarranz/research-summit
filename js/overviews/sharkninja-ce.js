// overviews/sharkninja-ce.js — SharkNinja's Evolution ▸ Earnings, on AMAZON'S machinery.
//
// WHY THIS FILE EXISTS (Sep 2026). SN's first Earnings tab was a re-implementation built from
// docs/EARNINGS_CONVENTIONS.md — and the doc had drifted from what Amazon actually ships, so the
// three phases came out structurally different (red-lines + a surprise list instead of "The print",
// a hunt list instead of the theme record). The fix is the same one GOOGL / META / UBER / LYFT /
// SPOT already use: carry a COPY of amzn.js's Earnings code and feed it this company's data.
//
// Everything below the marker is extracted MECHANICALLY from js/overviews/amzn.js — the dependency
// closure of the Earnings entry points (ceQPills, ceSetupBody, ceResultsBody, ceWatchBody,
// wireCallEarnings, wireCeTrack, wireThemeRecord, the ✎ editor and the theme-record persistence).
// The only edits are the data swap, stated here so a diff against amzn.js is not a surprise:
//   • CE_CONS / CALL_EARNINGS come from ./sharkninja-ce-data.js instead of being inlined
//   • AMZN_THEMES → SN_THEMES (themes-data/sn.js); the segment list is ['SharkNinja']
//   • CE_MARGIN_DEN / CE_STMT_ORDER / CE_TOPLINE carry SN's lines; ceGuessTarget maps SN's themes
//   • ceFmtV / ceTkFmt learn `$M` and `M` (SN reports in millions; Amazon's cells were $B)
//   • datasets AMZN_SETUP → SN_SETUP, 'AMZN' → 'SN'; amzn* helper names and hooks → sn*
// When amzn.js's Earnings changes, re-run the extraction rather than hand-patching this copy.

import { resultsHtml, initResults } from '../results.js';
import { mountWatchList } from '../watchlist.js';
import { fetchThemeRecord, saveThemeRecord } from '../api.js';   // durable persistence of the SN theme record (Notes)
import { SN_THEMES } from '../themes-data/sn.js';
import { consensusEvo } from '../consensus-evolution.js';
import { SUMMIT_CAT, SUMMIT_INK } from '../viz-palette.js';
import { SN_CE_CONS as CE_CONS, SN_CALL_EARNINGS as CALL_EARNINGS } from './sharkninja-ce-data.js';

// ════ extracted from amzn.js ════════════════════════════════════════════════════════════════════
// ─── esc: escapes <>" but deliberately leaves & literal (per contract; never double-encode) ──
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// Page-styled inline prompt/confirm — a small floating card anchored to the trigger, replacing the
// browser's window.prompt / window.confirm so every add / edit / delete matches the page. onOk(value)
// fires on commit (value = '' for a pure confirm); Cancel / Esc / click-outside dismiss it. Set
// {multiline:true} for a textarea (notes), {confirm:true} for a yes/no, {danger:true} to redden OK.
function ceInlinePop(anchor, opts, onOk){
  Array.prototype.forEach.call(document.querySelectorAll('.ce-ip'), function(p){ p.remove(); });
  opts=opts||{}; var isConfirm=!!opts.confirm, ml=!!opts.multiline;
  var pop=document.createElement('div'); pop.className='ce-ip';
  pop.innerHTML='<div class="ce-ip-t">'+esc(opts.title||'')+'</div>'+
    (isConfirm?'':(ml?'<textarea class="ce-ip-in" rows="3"></textarea>':'<input class="ce-ip-in" type="text">'))+
    '<div class="ce-ip-btns"><button type="button" class="ce-ip-cancel">Cancel</button>'+
      '<button type="button" class="ce-ip-ok'+(opts.danger?' danger':'')+'">'+esc(opts.ok||(isConfirm?'Confirm':'Save'))+'</button></div>';
  document.body.appendChild(pop);
  var inp=pop.querySelector('.ce-ip-in'); if(inp && opts.value!=null) inp.value=opts.value;
  cewPositionPop(pop, anchor);
  function close(){ pop.remove(); document.removeEventListener('mousedown', outside, true); document.removeEventListener('keydown', onKey, true); }
  function outside(e){ if(!pop.contains(e.target)) close(); }
  function ok(){ var v=inp?(inp.value||'').trim():''; if(inp && !v) return; close(); onOk(v); }
  function onKey(e){ if(e.key==='Escape') close(); else if(e.key==='Enter' && (!ml || isConfirm)){ e.preventDefault(); ok(); } }
  pop.querySelector('.ce-ip-cancel').onclick=close;
  pop.querySelector('.ce-ip-ok').onclick=ok;
  setTimeout(function(){ document.addEventListener('mousedown', outside, true); document.addEventListener('keydown', onKey, true); }, 0);
  if(inp){ inp.focus(); if(inp.select) inp.select(); }
}
// Anchor a fixed popup to a launch button, orienting toward the side with room so a WIDE popup never
// runs off-screen: the ＋ add-note button is pinned bottom-RIGHT, so a note composer opens LEFTWARD
// (right edge aligned to the button) and, if there is no room below, UPWARD. Falls back to plain
// left/below when the button sits in the left half or has room beneath it. (Dani, Aug 2026.)
function cewPositionPop(pop, anchor){
  var r=(anchor&&anchor.getBoundingClientRect)?anchor.getBoundingClientRect():{left:80,right:80,top:80,bottom:80};
  pop.style.position='fixed';
  var pw=pop.offsetWidth, ph=pop.offsetHeight, vw=window.innerWidth, vh=window.innerHeight;
  // Horizontal: right-align to the button when it sits past the viewport midpoint, else left-align.
  var left=(r.left>vw/2)?(r.right-pw):r.left;
  left=Math.max(8, Math.min(left, vw-pw-12));
  // Vertical: below the button by default; flip above if it would overflow the bottom edge.
  var top=r.bottom+6;
  if(top+ph>vh-12) top=Math.max(8, r.top-ph-6);
  pop.style.left=left+'px'; pop.style.top=top+'px';
}
// Per-call-point note capture. The "＋ add note" button + a composer popup that reuses the SAME note
// engine as Propose Notes (cePublishNoteToRecord → the Notes record → Supabase), but does NOT auto-propose
// a Theme/Sub-theme — the user files it manually (this point did not qualify for Propose Notes, so the
// filing is a deliberate manual choice). qLabel = the reported quarter (e.g. "2Q26").
// Strip HTML/entities to plain text — the seed for a note is the point's PROSE (body/answer/detail), not
// its title, so a raw-HTML body becomes clean text in the composer's textarea.
function ceStripHtml(h){ return String(h==null?'':h).replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim(); }
// The "＋ add note" affordance — pinned bottom-RIGHT in its own row so it never collides with the prose.
function ceNoteAddBtn(qLabel, seed){
  return '<div class="ce-note-row"><button type="button" class="ce-noteadd" data-noteadd data-nq="'+esc(qLabel||'').replace(/"/g,'&quot;')+'" data-nseed="'+esc(seed||'').replace(/"/g,'&quot;')+'">＋ add note</button></div>';
}
function ceNoteAddPop(anchor){
  Array.prototype.forEach.call(document.querySelectorAll('.ce-ip'), function(p){ p.remove(); });
  var qLabel=anchor.getAttribute('data-nq')||'', seed=anchor.getAttribute('data-nseed')||'';
  var pop=document.createElement('div'); pop.className='ce-ip ce-ip-note';
  pop.innerHTML='<div class="ce-ip-t">Add a note'+(qLabel?' · '+esc(qLabel):'')+'</div>'+
    '<textarea class="ce-ip-in" rows="3"></textarea>'+
    '<div class="ce-ip-row"><span class="ce-ip-l">Theme</span>'+ceSegSelectHtml('__none__')+'</div>'+
    '<input class="ce-ip-newseg" type="text" placeholder="New theme name" hidden>'+
    '<div class="ce-ip-row"><span class="ce-ip-l">Sub-theme</span><span class="ce-ip-subwrap">'+ceSubSelectHtml('','__none__')+'</span></div>'+
    '<input class="ce-ip-newsub" type="text" placeholder="New sub-theme name" hidden>'+
    '<div class="ce-ip-btns"><button type="button" class="ce-ip-cancel">Cancel</button>'+
      '<button type="button" class="ce-ip-ok">Save note</button></div>';
  document.body.appendChild(pop);
  var ta=pop.querySelector('.ce-ip-in'); ta.value=seed;
  var segSel=pop.querySelector('.ce-tp-seg'), subWrap=pop.querySelector('.ce-ip-subwrap');
  var newSeg=pop.querySelector('.ce-ip-newseg'), newSub=pop.querySelector('.ce-ip-newsub');
  // Force an explicit choice — prepend a selected blank so nothing is pre-filed (unlike Propose Notes).
  function blankFirst(sel){ var o=document.createElement('option'); o.value='__none__'; o.textContent='— pick —'; o.selected=true; sel.insertBefore(o, sel.firstChild); }
  blankFirst(segSel); blankFirst(subWrap.querySelector('.ce-tp-sub'));
  function rebuildSub(){
    if(segSel.value==='__newseg__'){ newSeg.hidden=false; subWrap.innerHTML=''; newSub.hidden=false; return; }
    newSeg.hidden=true;
    subWrap.innerHTML=ceSubSelectHtml(segSel.value==='__none__'?'':segSel.value,'__none__');
    var ns=subWrap.querySelector('.ce-tp-sub'); blankFirst(ns);
    ns.onchange=function(){ newSub.hidden=(ns.value!=='__new__'); };
    newSub.hidden=true;
  }
  segSel.onchange=rebuildSub;
  subWrap.querySelector('.ce-tp-sub').onchange=function(){ newSub.hidden=(this.value!=='__new__'); };
  cewPositionPop(pop, anchor);
  function close(){ pop.remove(); document.removeEventListener('mousedown', outside, true); document.removeEventListener('keydown', onKey, true); }
  function outside(e){ if(!pop.contains(e.target)) close(); }
  function onKey(e){ if(e.key==='Escape') close(); }
  function save(){
    var text=(ta.value||'').trim(); if(!text) return;
    var seg=(segSel.value==='__newseg__')?(newSeg.value||'').trim():segSel.value;
    var cur=subWrap.querySelector('.ce-tp-sub');
    var sub=(segSel.value==='__newseg__')?(newSub.value||'').trim():(cur?(cur.value==='__new__'?(newSub.value||'').trim():cur.value):'');
    if(!seg||seg==='__none__'||!sub||sub==='__none__') return;   // both must be chosen
    var res=cePublishNoteToRecord(seg, sub, text, qLabel);
    if(res && res.dup){   // identical note already filed here — warn, keep the composer open, do not duplicate
      var warn=pop.querySelector('.ce-ip-warn');
      if(!warn){ warn=document.createElement('div'); warn.className='ce-ip-warn'; pop.insertBefore(warn, pop.querySelector('.ce-ip-btns')); }
      warn.textContent='This note is already filed under '+sub+' · '+qLabel+' — not added again.';
      return;
    }
    // Confirm the save on the button itself (green "Saved ✓") so a click never feels like it did nothing,
    // then close and refresh the record once the confirmation has registered.
    var okBtn=pop.querySelector('.ce-ip-ok'), cancelBtn=pop.querySelector('.ce-ip-cancel');
    if(okBtn){ okBtn.classList.add('done'); okBtn.textContent='Saved ✓'; okBtn.disabled=true; }
    if(cancelBtn) cancelBtn.disabled=true;
    setTimeout(function(){ close(); snRerenderRecord(document); }, 480);
  }
  ta.addEventListener('input', function(){ var w=pop.querySelector('.ce-ip-warn'); if(w) w.remove(); });
  pop.querySelector('.ce-ip-cancel').onclick=close;
  pop.querySelector('.ce-ip-ok').onclick=save;
  setTimeout(function(){ document.addEventListener('mousedown', outside, true); document.addEventListener('keydown', onKey, true); }, 0);
  ta.focus();
}

// ─── Brand: Amazon orange + Amazon blue ─────────────────────────────────────────────────────
// These were Amazon's own brand hexes (#FF9900 smile orange, #146EB4 blue, #232F3E squid ink), used
// as chart colours in ~175 places. They now point at the portal's fixed categorical palette, so the
// profile no longer paints itself in the company's brand — the brand belongs in the logo, and slot 1
// is the same blue on every company. The NAMES are kept deliberately: renaming 175 call sites would
// bury a palette change inside an unreviewable diff. Read BRAND as "series 1", BRAND2 as "series 2".
var BRAND=SUMMIT_CAT[0], BRAND2=SUMMIT_CAT[1], SQUID=SUMMIT_INK, GREEN='#2E8B57', GRAY='#9AA4B0';
var _co=null;   // open company (id + ticker), captured in html/deepDiveHtml for the shared Watch List engine

// ════════════════════════════════════════════════════════════════════════════
//  Evolution ▸ EARNINGS — the decision layer (docs/EARNINGS_CONVENTIONS.md v2.10)
//  Fresh build on the 2Q26 cycle (machinery ported from googl.js via meta.js —
//  the v2.10 canonical). Three phases: Setup · Watch List · Post-Results; the
//  Watch List is the SHARED engine (js/watchlist.js, v3.0) — persistent in Supabase
//  (table company_themes, scoped by company_id) with sorting + the delete rule; the
//  theme record is folded in below the mount.
//  CONSENSUS: AMZN has no rows in the BBG_CONSENSUS.txt archive (GOOGL/META
//  only) — CE_CONS is DERIVED at load from js/results-data/amzn.js, whose cons
//  is the pre-print Street number (Refinitiv/LSEG via earnings-day coverage;
//  BBG export for forward quarters) — so only the 1q-out horizon exists and the
//  4q/3q/2q columns stay null. When Dani adds AMZN to the archive, rebuild the
//  qr matrix from it (the META parser in the session scratchpad is the recipe).
// ════════════════════════════════════════════════════════════════════════════
var BLUE='#2557D6', RED='#EA4335', YELLOW='#E8A00C', PURPLE='#7A5AF8', AMBER='#B7791F';

// ── The theme record — narrative threads across the recent calls (v2.3 fold-in) ──
// (SRC_CALLS source foot removed — Dani, Aug 2026.)
// Segment divisions for the theme record (Aug 2026, AMZN only). Each theme carries a `seg`; the
// "By theme" view groups them under these headers, in this order. Empty themes (no `updates`) are
// tracked placeholders — the section exists so we can fill it as the notes come in.
var SN_SEG_ORDER=['SharkNinja'];   // SN has ONE reportable segment — the theme record's single group (matches segments.js THEME_SEG)
// A note's quarter is inside a sub-theme's tracking window when Since ≤ q ≤ Until (open bounds when
// unset). Setting "Since" therefore shows the notes only from that quarter onward; "Until" caps them.
function snInWindow(q, since, until){
  var n=ceQnum(q); if(n==null) return true;
  if(since){ var s=ceQnum(since); if(s!=null && n<s) return false; }
  if(until){ var u=ceQnum(until); if(u!=null && n>u) return false; }
  return true;
}
// The tracking window is a GLOBAL filter on the record view (below the By-theme/By-quarter toggle),
// not per sub-theme. Setting Since/Until narrows every sub-theme's notes to that quarter range.
var _recSince=null, _recUntil=null;
var _recHook='all';   // record hook filter (below the Since filter): all | open | closed
function snWinUpdates(ct){ return (ct.updates||[]).filter(function(u){ return snInWindow(u.q, _recSince, _recUntil); }); }
function snHookMatch(ct){ if(_recHook==='open') return snHookOpen(ct); if(_recHook==='closed') return snHookClosed(ct); return true; }
function snThemeQuarters(){ var seen={}, out=[]; SN_THEMES.forEach(function(ct){ (ct.updates||[]).forEach(function(u){ if(!seen[u.q]){ seen[u.q]=1; out.push(u.q); } }); }); return out; }
function snCallsByQuarter(){
  var map={}, order=[];
  SN_THEMES.forEach(function(ct){ if(!snHookMatch(ct)) return; snWinUpdates(ct).forEach(function(u){ if(!map[u.q]){ map[u.q]=[]; order.push(u.q); } map[u.q].push({ theme:ct.theme, seg:ct.seg, items:u.items }); }); });
  function qv(q){ var m=String(q).match(/Q(\d)\s+(\d{4})/); return m?(+m[2])*10+(+m[1]):0; }
  order.sort(function(a,b){ return qv(b)-qv(a); });
  return { order:order, map:map };
}
// The theme record (rendered inside the Watch List, v2.3) — compact contract renderer.
function callsBody(){
  var h='<style>.calls-tog{display:inline-flex;gap:4px;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:3px;margin-bottom:14px}'+
    '.calls-pill{border:none;background:transparent;font:inherit;font-size:12px;font-weight:700;color:var(--mu);padding:5px 15px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.calls-pill:hover{color:var(--navy)}.calls-pill.active{background:'+BRAND+';color:#fff}'+
    '.calls-tl{font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--navy);margin:0 0 4px}'+
    /* By-quarter: segment sub-headers + per-theme cards */
    '.calls-qseg{display:flex;align-items:center;gap:7px;font-size:9.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:'+BRAND+';margin:16px 0 8px;padding-bottom:5px;border-bottom:1px solid var(--bdr)}'+
    '.calls-qseg:first-child{margin-top:2px}'+
    '.calls-qseg-n{font-size:9px;font-weight:800;color:var(--mu);background:#F2F5F8;border:1px solid var(--bdr);border-radius:20px;padding:1px 7px}'+
    '.calls-qrow{border-left:2px solid var(--bdr);padding:1px 0 1px 11px;margin:0 0 11px}'+
    '.calls-qrow:hover{border-left-color:'+BRAND+'}'+
    '.calls-st{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:2px 8px;white-space:nowrap;border:1px solid;flex:none}'+
    /* segment divisions (Amazon US / International / AWS) — each a dropdown over its themes, */
    /* styled to match the By-quarter accordion (.lpb-acc-item / .lpb-acc-h / .lpb-acc-ic). */
    '.calls-seg-group{border:1px solid var(--bdr);border-radius:10px;overflow:hidden;background:var(--w)}'+
    '.calls-seg-group.open{border-color:'+BRAND+'}'+
    '.calls-seg{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;background:none;border:none;cursor:pointer;padding:14px 16px;font-family:\'Inter\',sans-serif;font-size:13.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--navy);text-align:left}'+
    '.calls-seg:hover{color:'+BRAND+'}.calls-seg-group.open>.calls-seg{color:'+BRAND+'}'+
    '.calls-seg-l{display:inline-flex;align-items:baseline;gap:9px}'+
    '.calls-seg-n{font-size:9.5px;font-weight:700;letter-spacing:0;text-transform:none;color:var(--mu)}'+
    '.calls-seg-ic{flex:none;width:22px;height:22px;border-radius:50%;background:var(--brand-soft);color:'+BRAND+';font-weight:800;font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center}'+
    '.calls-seg-body{display:none;padding:2px 14px 14px;flex-direction:column;gap:10px}'+
    '.calls-seg-group.open>.calls-seg-body{display:flex}'+
    '.calls-empty{font-size:11.5px;color:var(--mu);font-style:italic;border:1px dashed var(--bdr);border-radius:8px;padding:9px 12px;background:#FAFBFD}'+
    '.rec-editbtn{margin-top:6px;font:inherit;font-size:10.5px;font-weight:800;border:1px dashed '+BRAND2+';background:var(--w);color:'+BRAND2+';padding:5px 12px;border-radius:999px;cursor:pointer}'+
    '.rec-editbtn:hover{background:rgba(20,110,180,0.06)}'+
    '.rec-edit{margin-top:10px}'+
    '.calls-trk{font-size:8.5px;font-weight:800;letter-spacing:.02em;color:var(--mu);background:#F2F5F8;border:1px solid var(--bdr);border-radius:20px;padding:2px 8px;white-space:nowrap;flex:none}'+
    '.calls-trk.closed{color:'+RED+';border-color:rgba(234,67,53,0.35);background:rgba(234,67,53,0.06)}'+
    '.calls-trkbar{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:0 0 14px;padding:8px 12px;background:#F7F9FB;border:1px solid var(--bdr);border-radius:10px;font-size:10.5px;font-weight:700;color:var(--mu)}'+
    '.calls-trkbar-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu)}'+
    '.calls-trkbar select{font:inherit;font-size:11px;border:1px solid var(--bdr);border-radius:8px;padding:4px 8px;background:var(--w);color:var(--navy);margin-left:5px}'+
    '.calls-trkbar select:focus{outline:none;border-color:'+BRAND+'}'+
    '.calls-trkbar-clr{font:inherit;font-size:10px;font-weight:800;border:1px solid var(--bdr);background:var(--w);color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.calls-trkbar-clr:hover{border-color:'+BRAND+';color:'+BRAND+'}'+
    '.calls-hookbar{margin:-6px 0 14px}'+
    '.calls-hookseg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.calls-hookseg button{font:inherit;font-size:10px;font-weight:800;border:0;background:transparent;color:var(--mu);padding:4px 12px;border-radius:999px;cursor:pointer}'+
    '.calls-hookseg button.on{background:var(--navy);color:#fff}</style>';
  h+='<div class="calls-tog" role="tablist"><button type="button" class="calls-pill active" data-callsv="theme">By theme</button><button type="button" class="calls-pill" data-callsv="quarter">By quarter</button></div>';
  // Global "Since" filter (applies to both views): show only notes from that quarter onward.
  var trkQ=snThemeQuarters();
  h+='<div class="calls-trkbar"><span>Since <select data-rectrks>'+snQuarterOpts(_recSince||'', '— all —', trkQ)+'</select></span>'+
     (_recSince?'<button type="button" class="calls-trkbar-clr" data-rectrkclear>clear</button>':'')+'</div>';
  // Hook filter (below Since): All / Open hooks / Closed — narrows which sub-themes show.
  h+='<div class="calls-hookbar"><span class="calls-hookseg">'+
       '<button type="button" class="'+(_recHook==='all'?'on':'')+'" data-rechook="all">All</button>'+
       '<button type="button" class="'+(_recHook==='open'?'on':'')+'" data-rechook="open">Open hooks</button>'+
       '<button type="button" class="'+(_recHook==='closed'?'on':'')+'" data-rechook="closed">Closed</button>'+
     '</span></div>';
  h+='<div class="lpb-acc" id="aCallsTheme">';
  SN_SEG_ORDER.forEach(function(seg,si){
    var group=SN_THEMES.filter(function(ct){ return ct.seg===seg && snHookMatch(ct); });
    // Segments always render (even empty) so a newly added theme shows here immediately.
    // Segment is itself a dropdown (outer accordion): click the header to unfold its sub-themes.
    // All segments start COLLAPSED so the record opens clean.
    h+='<div class="calls-seg-group" data-seg="'+esc(seg)+'">';
    h+='<button type="button" class="calls-seg" data-segtog><span class="calls-seg-l">'+esc(seg)+' <span class="calls-seg-n">'+group.length+' theme'+(group.length===1?'':'s')+'</span></span><span class="calls-seg-ic">+</span></button>';
    h+='<div class="calls-seg-body">';
    if(!group.length) h+='<div class="calls-empty">'+(_recHook==='all'?'— no sub-themes yet. Use ✎ Edit below to add one.':'— no sub-themes match this filter.')+'</div>';
    group.forEach(function(ct){
      var sk=(ct.st&&ct.st.k)?ct.st.k:'watch'; var st=CE_THST[sk]||CE_THST.watch;
      h+='<div class="lpb-acc-item" data-theme="'+esc(ct.theme)+'"><button type="button" class="lpb-acc-h"><span style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap">'+esc(ct.theme)+' <span class="calls-st" style="color:'+st.c+';border-color:'+st.c+'">'+st.l+ceStAge(ct.st)+'</span></span><span class="lpb-acc-ic">+</span></button>';
      var key=ct.seg+'|'+ct.theme, editing=!!_recEditOpen[key];
      h+='<div class="lpb-acc-body"><p style="font-size:12px;color:var(--mu);margin:0 0 10px;font-style:italic">'+esc(ct.why)+'</p>';
      if(editing){
        h+=snInlineEdit(ct);
      } else {
        var ups=snWinUpdates(ct);
        if(ups.length){
          ups.forEach(function(u){ h+='<div style="margin-bottom:10px"><span class="ov-chip" style="margin-right:6px">'+esc(u.q)+'</span><ul class="ov-bullets" style="margin-top:4px">'+u.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>'; });
        } else {
          h+='<div class="calls-empty">— to fill: no notes tracked yet for this theme.</div>';
        }
        h+='<button type="button" class="rec-editbtn" data-receditopen="'+esc(key)+'">✎ Edit / Add note</button>';
      }
      h+='</div></div>';
    });
    h+='</div></div>';
  });
  h+='</div>';
  var byQ=snCallsByQuarter();
  h+='<div class="lpb-acc" id="aCallsQuarter" style="display:none">';
  byQ.order.forEach(function(q){
    h+='<div class="lpb-acc-item"><button type="button" class="lpb-acc-h"><span>'+esc(q)+'</span><span class="lpb-acc-ic">+</span></button><div class="lpb-acc-body">';
    // Group the quarter's themes by segment (Amazon US / International / AWS) so they read distinct.
    SN_SEG_ORDER.forEach(function(seg){
      var rows=byQ.map[q].filter(function(r){ return r.seg===seg; });
      if(!rows.length) return;
      h+='<div class="calls-qseg">'+esc(seg)+' <span class="calls-qseg-n">'+rows.length+'</span></div>';
      rows.forEach(function(row){ h+='<div class="calls-qrow"><div class="calls-tl">'+esc(row.theme)+'</div><ul class="ov-bullets" style="margin-top:2px">'+row.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>'; });
    });
    h+='</div></div>';
  });
  h+='</div>';
  return h;
}

var CE_POP={};
function ceReg(id, t, h){ CE_POP[id]={t:t, h:ceProse(h)}; return id; }
function ceQ(id, t, h){ return '<span class="ce-info ov-clickable" data-detail="ce:'+ceReg(id,t,h)+'" title="'+esc(String(t).replace(/<[^>]+>/g,''))+'">?</span>'; }
// ─── ceProse · the anti-wall transform ──────────────────────────────────────────────────────────
// Every pop-up body in this file was authored as flowing <p> prose — 81 of 81 with no bullets —
// and a reader who taps "＋ detail" got a paragraph block. This runs at REGISTRATION time so the
// rule cannot be forgotten by the next author, and so it applies to old content too:
//   · the first paragraph becomes the LEAD — one short block, set larger; if it is itself long,
//     only its first sentence leads and the remainder joins the bullets.
//   · any paragraph of 2+ sentences is split into <li> bullets, one sentence each.
//   · a paragraph opening "<b>Label:</b> …" keeps its label and becomes a labelled row.
// Content already carrying <ul>/<li> is left exactly as authored. (§6a-iv.)
function ceSentences(s){
  // split on sentence end followed by a capital / tag-open — never inside "$1.5B" or "vs. the"
  return String(s).split(/(?<=[.!?])\s+(?=(?:<[a-z]+>)*[A-Z“"(])/).filter(function(x){ return x.trim(); });
}
function ceProse(h){
  h=String(h||'');
  if(!h || h.indexOf('<li>')>=0 || h.indexOf('<ul')>=0) return h;   // already structured
  var paras=h.match(/<p>[\s\S]*?<\/p>/g);
  if(!paras || paras.length===0) return h;
  var tail=h.replace(/<p>[\s\S]*?<\/p>/g,'').trim();               // anything not in a <p>
  var lead='', bullets=[];
  paras.forEach(function(p,i){
    var inner=p.replace(/^<p>/,'').replace(/<\/p>$/,'').trim();
    var lab=inner.match(/^<b>([^<]{1,42}[:—-])<\/b>\s*([\s\S]*)$/);
    if(lab){ bullets.push('<b>'+lab[1]+'</b> '+lab[2]); return; }
    var sents=ceSentences(inner);
    if(i===0){
      lead=sents.shift();
      sents.forEach(function(s){ bullets.push(s); });
    } else {
      sents.forEach(function(s){ bullets.push(s); });
    }
  });
  var out='';
  if(lead)          out+='<p class="ce-pop-lead">'+lead+'</p>';
  if(bullets.length) out+='<ul class="ce-pop-l">'+bullets.map(function(b){ return '<li>'+b+'</li>'; }).join('')+'</ul>';
  return out+tail;
}
// The Earnings CSS is ~21KB and ceStyle() is called by all THREE phase bodies (Setup, Watch,
// Post-Results), which are built in one deepDiveHtml() pass and all live in the DOM at once — so it
// was shipping three identical copies, ~43KB of dead duplicate. Emit once per render; the flag is
// cleared at the top of deepDiveHtml(), so a company switch re-emits correctly.
// (The real fix is lifting these rules into a stylesheet, but the CSS is interpolated with JS
//  constants and eight overviews each own a copy of it — that is its own PR.)
var _ceStyleEmitted = false;
function ceStyleReset(){ _ceStyleEmitted = false; }
function ceStyle(){
  if (_ceStyleEmitted) return '';
  _ceStyleEmitted = true;
  return '<style>'+
    /* page-styled inline prompt/confirm popover (replaces window.prompt / window.confirm) */
    '.ce-ip{z-index:9999;background:#fff;border:1px solid var(--bdr);border-radius:12px;box-shadow:0 16px 44px rgba(15,23,42,.30);padding:13px 14px;min-width:264px;max-width:380px}'+
    '.ce-ip-t{font-size:11px;font-weight:800;color:var(--navy);margin-bottom:9px;line-height:1.4}'+
    '.ce-ip-in{width:100%;box-sizing:border-box;font:inherit;font-size:12px;line-height:1.5;border:1px solid var(--bdr);border-radius:9px;padding:9px 11px;color:var(--navy);resize:vertical}'+
    '.ce-ip-in:focus{outline:none;border-color:'+BRAND2+'}'+
    '.ce-ip-warn{margin-top:10px;padding:8px 11px;border:1px solid '+RED+';border-left:4px solid '+RED+';border-radius:8px;background:rgba(234,67,53,0.06);color:'+RED+';font-size:11px;font-weight:700;line-height:1.4}'+
    '.ce-ip-btns{display:flex;justify-content:flex-end;gap:8px;margin-top:11px}'+
    '.ce-ip-btns button{font:inherit;font-size:11px;font-weight:800;border-radius:8px;padding:6px 15px;cursor:pointer;border:1px solid var(--bdr);background:#fff;color:var(--mu);transition:background .14s,color .14s,border-color .14s,transform .06s,box-shadow .14s}'+
    /* Cancel — secondary, but it now answers the click (hover fill + pressed nudge). */
    '.ce-ip-btns .ce-ip-cancel:hover{background:#F2F5F8;color:var(--navy);border-color:var(--mu)}'+
    '.ce-ip-btns .ce-ip-cancel:active{transform:translateY(1px)}'+
    /* Save — the primary action. Scoped to `.ce-ip-btns .ce-ip-ok` so it BEATS `.ce-ip-btns button`
       (which was painting it grey), and it now reacts: hover darkens, :active presses in, .done flashes
       green with a "Saved ✓" confirmation before the composer closes. */
    '.ce-ip-btns .ce-ip-ok{background:'+BRAND2+';color:#fff;border-color:'+BRAND2+';box-shadow:0 1px 3px rgba(20,110,180,.30)}'+
    '.ce-ip-btns .ce-ip-ok:hover{background:#0F5A8F;border-color:#0F5A8F}'+
    '.ce-ip-btns .ce-ip-ok:active{transform:translateY(1px);box-shadow:none}'+
    '.ce-ip-btns .ce-ip-ok:focus-visible{outline:2px solid #0F5A8F;outline-offset:2px}'+
    '.ce-ip-btns .ce-ip-ok.done{background:#0a8f4c;border-color:#0a8f4c;box-shadow:none}'+
    '.ce-ip-note{min-width:min(1040px,94vw);max-width:94vw}'+
    '.ce-ip-row{display:flex;align-items:center;gap:8px;margin-top:8px}'+
    '.ce-ip-l{font-size:9px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu);width:66px;flex:none}'+
    '.ce-ip-note select{flex:1;min-width:0;font:inherit;font-size:12px;border:1px solid var(--bdr);border-radius:8px;padding:6px 8px;color:var(--navy);background:#fff}'+
    '.ce-ip-note .ce-ip-subwrap{flex:1;display:flex;min-width:0}'+
    '.ce-ip-newseg,.ce-ip-newsub{width:100%;box-sizing:border-box;font:inherit;font-size:12px;border:1px solid var(--bdr);border-radius:8px;padding:7px 9px;margin-top:6px;color:var(--navy)}'+
    '.ce-note-row{display:flex;justify-content:flex-end;margin-top:10px}'+
    '.ce-noteadd{display:inline-block;font:inherit;font-size:9.5px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;color:'+BRAND2+';background:rgba(20,110,180,.08);border:1px solid rgba(20,110,180,.28);border-radius:7px;padding:4px 10px;cursor:pointer}'+
    '.ce-noteadd:hover{background:rgba(20,110,180,.16)}'+
    '.ce-ip-btns .ce-ip-ok.danger{background:'+RED+';border-color:'+RED+'}'+
    '.ce-ip-btns .ce-ip-ok.danger:hover{background:#C5221F;border-color:#C5221F}'+
    '.ce-note{font-size:11px;color:var(--mu);line-height:1.5;background:#F7F9FB;border:1px solid var(--bdr);border-radius:9px;padding:9px 12px;margin:0 0 12px}'+
    '.ce-phtabs{display:inline-flex;gap:3px;background:rgba(66,133,244,0.08);border:1px solid var(--bdr);border-radius:9px;padding:4px;margin:0 0 20px}'+
    '.ce-phtab{background:none;border:none;color:var(--mu);font-family:\'Inter\',sans-serif;font-size:12px;letter-spacing:.5px;text-transform:uppercase;font-weight:600;padding:7px 16px;border-radius:6px;cursor:pointer;transition:all .15s;white-space:nowrap}'+
    '.ce-phtab:hover{color:var(--navy)}.ce-phtab.active{background:'+BRAND+';color:#fff}'+
    '.ce-phpane[hidden]{display:none}'+
    /* quarter selector — one Earnings, many quarters; only the selected quarter renders (page stays light) */
    '.ce-qpills{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 14px}'+
    '.ce-qpills[hidden]{display:none}'+
    '.ce-qpill{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11px;font-weight:800;color:var(--mu);padding:5px 13px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.ce-qpill:hover{color:var(--navy)}.ce-qpill.active{background:var(--navy);color:#fff;border-color:var(--navy)}'+
    '.ce-qpill .ce-qtag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;margin-left:6px;opacity:.75}'+
    '.ce-qblock[hidden]{display:none}'+
    '.ce-frozen{display:inline-block;font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;background:'+GRAY+';border-radius:20px;padding:2px 8px;margin-left:7px;vertical-align:middle}'+
    /* watch-list theme tags (cross-quarter filter) + add-theme form */
    '.ce-wl-hint{font-size:10.5px;line-height:1.5;color:var(--navy);background:rgba(66,133,244,0.06);border:1px solid rgba(66,133,244,0.28);border-radius:9px;padding:8px 12px;margin:0 0 10px}'+'.ce-wl-tagbar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 12px;padding:9px 12px;background:#F7F9FB;border:1px solid var(--bdr);border-radius:10px}'+
    '.ce-wl-tag{border:1px solid rgba(122,90,248,0.35);background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:'+PURPLE+';padding:3px 10px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.ce-wl-tag:hover{background:rgba(122,90,248,0.08)}.ce-wl-tag.active{background:'+PURPLE+';color:#fff;border-color:'+PURPLE+'}'+
    '.ce-wl-clear{border-color:var(--bdr);color:var(--mu)}'+
    '.ce-wl-add-btn{margin-left:auto;border:1px dashed '+BRAND+';background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:'+BRAND+';padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.ce-wl-bar-k{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu)}'+
    '.ce-wl-win{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 11px;border-radius:999px;cursor:pointer}'+
    '.ce-wl-win.active{background:var(--navy);color:#fff}'+
    /* ── the Add / Edit theme form ── */
    '.ce-wl-addform{display:flex;flex-direction:column;gap:5px;border:1px dashed '+BRAND+';border-radius:10px;padding:14px 15px;margin:0 0 12px;background:rgba(66,133,244,0.03)}'+
    '.ce-wl-addform[hidden]{display:none}'+
    '.ce-wl-fh{display:flex;align-items:baseline;gap:9px;flex-wrap:wrap;margin-bottom:4px}'+
    '.ce-wl-fh-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.ce-wl-fh-s{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.ce-wl-lb{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--navy);margin-top:5px}'+
    '.ce-wl-lb span{font-weight:600;text-transform:none;letter-spacing:0;color:var(--mu);font-size:10px;margin-left:5px}'+
    '.ce-wl-in{font:inherit;font-size:12px;border:1px solid var(--bdr);border-radius:8px;padding:7px 10px;background:var(--w);color:var(--navy);width:100%;box-sizing:border-box}'+
    '.ce-wl-in:focus{outline:none;border-color:'+BRAND+'}'+
    '.ce-wl-ta{resize:vertical;line-height:1.5}'+
    '.ce-wl-2col{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:600px){.ce-wl-2col{grid-template-columns:1fr}}'+
    '.ce-wl-tagpick{display:flex;gap:6px;flex-wrap:wrap;border:1px solid var(--bdr);border-radius:8px;padding:8px 9px;background:var(--w);min-height:20px}'+
    '.ce-wl-pick{border:1px solid rgba(122,90,248,0.35);background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:'+PURPLE+';padding:3px 10px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.ce-wl-pick:hover{background:rgba(122,90,248,0.08)}.ce-wl-pick.on{background:'+PURPLE+';color:#fff;border-color:'+PURPLE+'}'+
    '.ce-wl-newtag{display:flex;gap:7px;align-items:center}.ce-wl-newtag .ce-wl-in{flex:1}'+
    '.ce-wl-newtag-go{font:inherit;font-size:10.5px;font-weight:800;border:1px dashed '+PURPLE+';background:var(--w);color:'+PURPLE+';padding:6px 12px;border-radius:999px;cursor:pointer;white-space:nowrap}'+
    '.ce-wl-frow{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-top:9px}'+
    '.ce-wl-add-go{font:inherit;font-size:11px;font-weight:800;border:none;border-radius:8px;padding:7px 15px;background:'+BRAND+';color:#fff;cursor:pointer}'+
    '.ce-wl-cancel{font:inherit;font-size:10.5px;font-weight:700;border:1px solid var(--bdr);background:var(--w);color:var(--mu);padding:6px 12px;border-radius:8px;cursor:pointer}'+
    '.ce-wl-all[hidden]{display:none}.ce-w[data-wlhide]{display:none}'+
    /* ── the table: the storage view + the copy-out ── */
    '.ce-wl-tbl-sc[hidden]{display:none}'+'.ce-wl-tbl-wrap{margin-top:22px;border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:12px;padding:13px 15px;background:var(--w)}'+
    '.ce-wl-tbl-h{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:9px}'+
    '.ce-wl-tbl-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.ce-wl-tbl-s{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.ce-wl-tbl-n{margin-left:auto;font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:'+BRAND2+';background:rgba(52,168,83,0.10);border:1px solid rgba(52,168,83,0.3);border-radius:999px;padding:3px 11px;white-space:nowrap}'+
    '.ce-wl-copy{border:1px solid '+BRAND+';background:'+BRAND+';font:inherit;font-size:10px;font-weight:800;color:#fff;padding:4px 14px;border-radius:999px;cursor:pointer;letter-spacing:.03em;transition:.12s}'+
    '.ce-wl-copy:hover{filter:brightness(1.08)}'+
    '.ce-wl-copy.alt{background:var(--w);color:'+BRAND+'}.ce-wl-copy.alt:hover{background:rgba(66,133,244,0.08)}'+
    '.ce-wl-tbl-sc{overflow-x:auto;border:1px solid var(--bdr);border-radius:9px}'+
    '.ce-wl-tbl{width:100%;border-collapse:collapse;font-size:10.5px;min-width:1100px}'+
    '.ce-wl-tbl th{text-align:left;background:#F7F9FB;color:var(--mu);font-weight:800;font-size:9.5px;text-transform:uppercase;letter-spacing:.04em;padding:7px 9px;border-bottom:1px solid var(--bdr);white-space:nowrap;position:sticky;top:0}'+
    '.ce-wl-tbl td{padding:7px 9px;border-bottom:1px solid var(--bdr);color:var(--navy);line-height:1.45;vertical-align:top;max-width:270px}'+
    '.ce-wl-tbl tr:last-child td{border-bottom:none}'+
    '.ce-wl-tbl td.wl-key{white-space:nowrap;font-weight:800;color:var(--mu);font-size:10px}'+
    '.ce-wl-tbl td.wl-th{font-weight:800;min-width:190px}'+
    '.ce-wl-tbl tr.wl-open td.wl-key{color:'+BRAND2+'}'+
    '.ce-wl-tbl tbody tr:hover{background:rgba(66,133,244,0.035)}'+
    '.ce-empty{color:var(--mu);font-style:italic;opacity:.7}'+
    '.ce-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:4px 0}@media(max-width:640px){.ce-grid4{grid-template-columns:1fr 1fr}}'+
    '.ce-cell{border:1px solid var(--bdr);border-top:3px solid '+BLUE+';border-radius:10px;padding:11px 13px;background:var(--w)}'+
    '.ce-cell-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--mu)}.ce-cell-v{font-size:15px;font-weight:800;color:var(--navy);margin-top:3px;line-height:1.2}'+
    /* Setup v2 — estimates toggle (Consensus ⇄ Summit ⇄ Both) */
    '.ce-ev-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.ce-ev-pill.active{background:var(--navy);color:#fff}'+
    '.ce-cell-custom{border-top-color:'+YELLOW+'}'+
    '.ce-row-cap{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin:2px 0 4px}'+
    '.ce-val{display:flex;align-items:baseline;gap:7px}'+
    '.ce-val-lab{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:1px 7px;flex:none}'+
    '.ce-val-cons .ce-val-lab{background:rgba(26,115,232,0.10);color:'+BLUE+'}'+
    '.ce-val-us .ce-val-lab{background:rgba(52,168,83,0.12);color:'+BRAND2+'}'+
    '.ce-evwrap[data-ev="cons"] .ce-val-us{display:none}'+
    '.ce-evwrap[data-ev="us"] .ce-val-cons{display:none}'+
    '.ce-evwrap:not([data-ev="both"]) .ce-val-lab{display:none}'+
    '.ce-evwrap[data-ev="both"] .ce-cell-v{font-size:13px}'+
    '.ce-evwrap[data-ev="both"] .ce-val{margin-top:3px}'+
    '.ce-banner{border:1px solid var(--bdr);border-left:4px solid '+BRAND+';border-radius:11px;padding:13px 15px;background:linear-gradient(180deg,rgba(66,133,244,0.05),transparent);font-size:12.5px;line-height:1.6;color:var(--navy);margin:12px 0}'+
    '.ce-watch{display:flex;flex-direction:column;gap:11px}'+
    '.ce-w{border:1px solid var(--bdr);border-radius:12px;padding:13px 15px;background:var(--w);position:relative}'+
    '.ce-w-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}'+
    /* v2.6: the numbered rank badge is gone — a plain marker, so removing a theme never leaves a
       stale number behind. `rank` still orders the rows, it just is not rendered. */
    '.ce-w-dot{width:8px;height:8px;border-radius:50%;background:'+BRAND+';flex:none;margin:0 2px}'+
    '.ce-w-metric{font-size:13.5px;font-weight:800;color:var(--navy)}'+
    /* the definition — what the theme means, in our words. (v2.6 replaced the tell 🔎 box, which
       had been carrying the model's voice; no black slabs left anywhere in the watch cards.) */
    '.ce-w-def{color:var(--navy);border-left:3px solid rgba(66,133,244,0.35);padding:1px 0 1px 11px;font-size:12px;line-height:1.55;margin-top:7px}'+
    '.ce-w-def b{color:'+BLUE+'}'+
    /* per-card edit / delete (live quarter only) + the closed-hook badge */
    '.ce-w-ctl{margin-left:auto;display:inline-flex;gap:5px;flex:none}'+
    '.ce-w-ed,.ce-w-del{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11px;font-weight:800;color:var(--mu);width:24px;height:24px;border-radius:7px;cursor:pointer;line-height:1;transition:.12s}'+
    '.ce-w-ed:hover{border-color:'+BRAND+';color:'+BRAND+'}.ce-w-del:hover{border-color:'+RED+';color:'+RED+'}'+
    '.ce-w-closed{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--mu);background:#F2F5F8;border:1px solid var(--bdr);border-radius:20px;padding:2px 8px;flex:none}'+
    '.ce-kind{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:2px 8px;white-space:nowrap;border:1px solid}'+
    '.ce-phase{display:inline-block;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#fff;border-radius:20px;padding:3px 10px;margin-bottom:8px}'+
    '.ce-info{display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;border-radius:50%;background:'+AMBER+';color:#fff;font-size:10px;font-weight:800;cursor:pointer;margin-left:5px;vertical-align:middle;flex:none}'+
    '.ce-info:hover{filter:brightness(1.1)}'+
    /* (retired Jul 2026: .ce-debate / .ce-dc / .ce-mech — the fear-vs-consensus pair and the
       mechanism chips. The Setup now goes straight from the estimates grid to the debate box.) */
    '.ce-synth{border-left:4px solid var(--navy);background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:6px 0}.ce-synth b{color:#AECBFA}'+
    '.ce-why-btn{display:inline-block;font-size:10px;font-weight:800;color:'+BLUE+';cursor:pointer;margin-top:8px}'+
    '.ce-w-chips{display:flex;gap:7px;flex-wrap:wrap;margin:6px 0 0}'+
    '.ce-w-chip{font-size:10px;font-weight:700;border-radius:7px;padding:4px 9px;line-height:1.3;color:var(--navy)}'+
    '.ce-w-chip.tag{background:rgba(122,90,248,0.08);border:1px solid rgba(122,90,248,0.3)}'+
    '.ce-w-chip.since{background:rgba(251,188,5,0.12);border:1px solid rgba(183,121,31,0.35)}'+
    '.ce-w-chip.until{background:#F2F5F8;border:1px solid var(--bdr);color:var(--mu)}'+
    '.ce-w-chip.cons{background:rgba(26,115,232,0.08);border:1px solid rgba(26,115,232,0.28)}'+
    /* .cons and .red are kept for the SPLC infra cards (Deep Dive ▸ SPLC), their only remaining user */
    '.ce-w-chip.red{background:rgba(234,67,53,0.06);border:1px solid rgba(234,67,53,0.28)}'+
    '.ce-w-chip b{font-weight:800}'+
    '.ce-take{border-left:4px solid '+BRAND+';background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:2px 0 14px}.ce-take b{color:#AECBFA}'+
    '.ce-hl{display:flex;flex-direction:column;gap:8px}'+
    '.ce-hl-row{display:grid;grid-template-columns:auto 1fr auto;gap:11px;align-items:center;border:1px solid var(--bdr);border-left:4px solid var(--hc);border-radius:10px;padding:10px 13px;background:var(--w);cursor:pointer;transition:.12s}'+
    '.ce-hl-row:hover{box-shadow:0 3px 10px rgba(0,0,0,.08)}'+
    '.ce-hl-tag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;background:var(--hc);border-radius:20px;padding:3px 9px;white-space:nowrap}'+
    '.ce-hl-head{font-size:12.5px;font-weight:700;color:var(--navy);line-height:1.4}'+
    '.ce-hl-more{font-size:15px;color:var(--hc);font-weight:800}'+
    '@media(max-width:560px){.ce-hl-row{grid-template-columns:auto 1fr}.ce-hl-more{display:none}}'+
    '.ce-dots{border:1px dashed '+BRAND+';border-radius:11px;padding:12px 15px;margin-top:14px;background:rgba(66,133,244,0.03);font-size:12px;line-height:1.6;color:var(--navy)}.ce-dots b{color:'+BRAND+'}'+
    '.ce-sc{display:flex;flex-direction:column;gap:6px}'+
    '.ce-sc-row{display:grid;grid-template-columns:1.1fr 1fr 1.2fr auto;gap:10px;align-items:center;border:1px solid var(--bdr);border-left:4px solid var(--sc);border-radius:9px;padding:8px 12px}'+
    '.ce-sc-m{font-size:12px;font-weight:800;color:var(--navy)}.ce-sc-c{font-size:11px;color:var(--mu)}.ce-sc-a{font-size:11.5px;font-weight:700;color:var(--navy)}'+
    '.ce-sc-v{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 10px;background:var(--sc);white-space:nowrap}'+
    '@media(max-width:600px){.ce-sc-row{grid-template-columns:1fr auto}.ce-sc-c,.ce-sc-a{display:none}}'+
    '.ce-tc{display:flex;flex-direction:column;gap:6px}'+
    '.ce-tc-row{display:flex;gap:9px;align-items:flex-start;font-size:11.5px;color:var(--navy);line-height:1.45;border:1px solid var(--bdr);border-radius:9px;padding:8px 11px}'+
    '.ce-tbl{width:100%;border-collapse:collapse;font-size:11.5px}'+
    '.ce-tbl th{text-align:left;color:var(--mu);font-weight:700;padding:7px 10px;border-bottom:1px solid var(--bdr);font-size:10.5px;text-transform:uppercase;letter-spacing:.03em}'+
    '.ce-tbl td{padding:9px 10px;border-bottom:1px solid var(--bdr);color:var(--navy);line-height:1.45;vertical-align:top}'+
    /* ── Bottom Line ▸ Supply Chain — stat row (ported from googl.js ddStat) ── */
    '.gdd-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:14px 0}'+
    '.gdd-kpi{background:var(--w);border:1px solid var(--bdr);border-radius:12px;padding:12px 14px}'+
    '.gdd-kpi-v{font-size:19px;font-weight:800;color:var(--navy);line-height:1.12}'+
    '.gdd-kpi-k{font-size:10.5px;color:var(--mu);margin-top:4px;line-height:1.35}'+
    '.ce-pill{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 9px;white-space:nowrap}'+
    /* ── #1 · the chain: seededBy chip on watch items, landing chip on newQuestions ── */
    '.ce-seed{display:inline-flex;align-items:center;gap:4px;font-size:9.5px;font-weight:800;color:'+PURPLE+';background:rgba(122,90,248,0.08);border:1px solid rgba(122,90,248,0.3);border-radius:20px;padding:2px 9px;white-space:nowrap;flex:none}'+
    '.ce-nq{display:flex;flex-direction:column;gap:5px}'+
    '.ce-nq-row{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;border:1px solid var(--bdr);border-left:3px solid '+PURPLE+';border-radius:9px;padding:7px 11px;font-size:11.5px;color:var(--navy);line-height:1.45}'+
    '.ce-nq-land{font-size:9.5px;font-weight:800;color:'+PURPLE+';white-space:nowrap}'+
    '.ce-nq-land.open{color:var(--mu)}'+
    '@media(max-width:560px){.ce-nq-row{grid-template-columns:1fr}.ce-nq-land{margin-top:3px}}'+
    /* ── #2 · scorecard: surprise bars, watch-rank badges, richer result kinds ── */
    '.ce-sc-row{grid-template-columns:78px 1.1fr 1fr 1.2fr 92px auto}'+
    '.ce-sc-rk{font-size:9px;font-weight:800;color:'+BRAND+';background:rgba(66,133,244,0.10);border:1px solid rgba(66,133,244,0.3);border-radius:20px;padding:2px 8px;white-space:nowrap;text-align:center}'+
    '.ce-sc-rk.blank{background:transparent;border:none}'+
    '.ce-sc-surp{font-size:9.5px;font-weight:800;text-align:center;letter-spacing:.02em;border-radius:20px;padding:2px 8px;white-space:nowrap}'+
    '.ce-sc-surp.hi{color:'+RED+';background:rgba(234,67,53,0.09);border:1px solid rgba(234,67,53,0.3)}'+
    '.ce-sc-surp.md{color:'+AMBER+';background:rgba(183,121,31,0.09);border:1px solid rgba(183,121,31,0.3)}'+
    '.ce-sc-surp.lo{color:var(--mu);background:transparent;border:1px solid var(--bdr)}'+
    /* the legend that makes the row readable without a manual */
    '.ce-legend{display:flex;flex-wrap:wrap;gap:14px;align-items:center;background:#F7F9FB;border:1px solid var(--bdr);border-radius:10px;padding:10px 13px;margin:0 0 10px}'+
    '.ce-legend-i{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--navy);line-height:1.4}'+
    '.ce-legend-i b{font-weight:800}'+
    '@media(max-width:600px){.ce-sc-row{grid-template-columns:1fr auto}.ce-sc-c,.ce-sc-a,.ce-sc-bw,.ce-sc-rk{display:none}}'+
    /* ── #3 · post-call highlight bands ── */
    '.ce-band{margin:16px 0 8px;display:flex;align-items:center;gap:9px}'+
    '.ce-band-i{font-size:13px;font-weight:800;color:var(--bc);line-height:1}'+
    '.ce-band-t{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--bc)}'+
    '.ce-band-s{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.ce-band-l{flex:1;height:1px;background:var(--bdr)}'+
    '@media(max-width:560px){.ce-band-s{display:none}}'+
    '.ce-hl-open{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:'+AMBER+';border:1px solid '+AMBER+';border-radius:20px;padding:2px 7px;white-space:nowrap;margin-left:7px;vertical-align:middle}'+
    /* ── #4 · the deliverable: three minutes + what we are not bringing ── */
    '.ce-3m{border:1px solid var(--bdr);border-top:4px solid '+BRAND+';border-radius:12px;padding:15px 17px;margin:16px 0 0;background:linear-gradient(180deg,rgba(66,133,244,0.05),transparent)}'+
    '.ce-3m-h{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:10px}'+
    '.ce-3m-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.ce-3m-sub{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.ce-3m-copy{margin-left:auto;border:1px solid '+BRAND+';background:var(--w);font:inherit;font-size:10px;font-weight:800;color:'+BRAND+';padding:3px 11px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.ce-3m-copy:hover{background:'+BRAND+';color:#fff}'+
    '.ce-3m-l{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}'+'@media(max-width:760px){.ce-3m-l{grid-template-columns:1fr}}'+'.ce-3m-n{width:22px;height:22px;border-radius:50%;background:'+BRAND+';color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;flex:none}'+'.ce-3m-bd{min-width:0}'+'.ce-3m-lead{display:block;font-size:13.5px;font-weight:800;color:var(--navy);line-height:1.4}'+'.ce-3m-ev{display:block;font-size:11px;font-weight:500;color:var(--mu);line-height:1.5;margin-top:4px}'+'.ce-3m-more{margin-top:6px}'+'.ce-3m-more>summary{font-size:9.5px;font-weight:800;color:'+BLUE+';cursor:pointer;list-style:none}'+'.ce-3m-more>summary::-webkit-details-marker{display:none}'+'.ce-3m-more[open]>summary{color:var(--mu)}'+
    '.ce-3m-i{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:11px;padding:11px 13px;background:#fff}'+
    
    '.ce-nb{margin-top:13px;border-top:1px dashed var(--bdr);padding-top:11px}'+
    '.ce-nb-h{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:6px}'+
    '.ce-nb-r{display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:start;font-size:11px;line-height:1.5;color:var(--mu);padding:2px 0}'+
    '.ce-nb-r b{color:var(--navy);font-weight:800}'+
    '.ce-nb-x{color:'+GRAY+';font-weight:800;flex:none}'+
    /* ── #5 · earnings-call theme status with age ── */
    '.calls-st-age{font-size:8.5px;font-weight:700;opacity:.8;margin-left:4px}</style>';
}
function ceQkey(q){ return String(q||'').replace(/\s/g,''); }
// Renders the quarter-pill selector (shared across the three phase panes via .ce-qblock filtering).
// The quarter selector is PHASE-AWARE: Setup & Watch List offer every quarter, but Post-Results
// only offers quarters that have a `results` block — the upcoming quarter has none, so it does not
// exist in that section (its data does not exist yet). The upcoming quarter is added to
// CALL_EARNINGS.quarters only once the PRIOR quarter's Post-Results (print + call highlights) is
// filled. data-ceqhas lists the phases each quarter is valid for.
function ceQPhases(q){
  var ph=['setup','watch'];
  if(q.results) ph.push('results');
  return ph;
}
function ceQPills(){
  return '<div class="ce-qpills">'+CALL_EARNINGS.quarters.map(function(q,i){
    return '<button type="button" class="ce-qpill'+(i===0?' active':'')+'" data-ceqsel="'+esc(ceQkey(q.q))+'" data-ceqhas="'+ceQPhases(q).join(' ')+'">'+esc(q.q)+(q.status==='upcoming'?'<span class="ce-qtag">upcoming</span>':'')+'</button>';
  }).join('')+'</div>';
}
// A · The Setup — the grid is BUILT FROM THE ARCHIVE, not hand-authored. CE_CONS carries the
// consensus and both growth bases, so the 13 cells, their YoY and their QoQ can never drift out of
// sync with the file. What stays hand-authored per quarter: `setup.us` (Summit's own number) and
// `setup.notes` (the caveat pop-ups), both keyed by metric name. (§6a-ii.)
function ceFmtV(u,v){
  if(v==null) return null;
  if(u==='$M') return (Math.abs(v)>=1000)?('$'+(+v/1000).toFixed(2)+'B'):('$'+Math.round(+v)+'M');
  if(u==='M')  return Math.round(+v)+'M';
  if(u==='$')  return '$'+(+v).toFixed(2);
  if(u==='$B') return '$'+(+v)+'B';
  if(u==='B')  return (+v)+'B';
  return String(v);
}
// `cur` = the current-period value the growth is measured off. Omitted → the consensus actual
// (Street); pass Summit's own estimate to get Summit's implied growth, so BOTH columns carry a
// YoY/QoQ chip, not just Street (Dani, Aug 2026).
function ceGrowth(m,qi,base,cur){
  if(m.t==='basis') return null;                       // never a growth number off a basis mismatch
  if(m.u==='%') return null;                           // a %-line IS a YoY rate — no growth-of-a-growth (AMZN ad KPIs)
  var c=(cur!==undefined&&cur!==null)?cur:(m.qr[qi]?m.qr[qi][3]:null);
  var b=(base==='qoq')?m.qq[qi]:m.qy[qi];
  if(c==null||b==null||!b) return null;
  return Math.round((c/b-1)*100);
}
function ceChip(g){
  if(g==null) return '';
  var up=g>=0;
  return '<span class="ce-gchip" style="color:'+(up?'#0a8f4c':'#C5221F')+'">'+(up?'+':'−')+Math.abs(g)+'%</span>';
}
// Margin lens (EXCEPTION, headline only): Gross profit / Operating income / EBITDA also carry a
// margin = the metric ÷ revenue, computed per column. Street margin = BBG metric ÷ BBG revenue;
// Summit margin = Summit metric ÷ Summit revenue (falls back to BBG revenue if Summit has none).
// Toggled in the estimates bar; lives in the SAME headline cell, never a new box. (§6a-ii.)
function ceMarginPct(v, rev){ return (v==null||rev==null||!rev)?null:Math.round((v/rev*100)*10)/10; }
// Margins — each margin line ÷ its OWN revenue base (Dani, Aug 2026), used by BOTH the Setup grid and the
// Post-Results cards. Consolidated lines divide by total Revenue; a SEGMENT operating income divides by
// THAT segment's net sales (segment OI ÷ total revenue is meaningless — which is why segment margins were
// absent before). The value is the metric whose actual/estimate/prior supplies the denominator.
var CE_MARGIN_DEN={
  'Gross profit':'Revenue','Operating income':'Revenue','Adj. EBITDA':'Revenue'
};
function ceMetricByKey(k){ for(var i=0;i<CE_CONS.m.length;i++){ if(CE_CONS.m[i].k===k) return CE_CONS.m[i]; } return null; }
// Post-Results DEFAULT ordering — top-to-bottom down the income statement, NOT by surprise (Dani,
// Aug 2026): top line → sales by segment → margins/expenses → profit by segment → cash & shares →
// EPS last. The "By surprise" toggle re-sorts to |Street surprise| desc. Keys are CE_CONS.m[].k;
// anything not listed sorts to the end (so a new line never silently jumps to the top).
var CE_STMT_ORDER=['Revenue','Domestic net sales','International net sales',
  'Cleaning','Cooking & Beverage','Food Preparation','Beauty & Home Environment',
  'Gross profit','Operating income','Adj. EBITDA','Operating cash flow','Capex','D&A','Diluted shares','Adj. EPS (diluted)'];
function ceStmtIdx(k){ var i=CE_STMT_ORDER.indexOf(k); return i<0?CE_STMT_ORDER.length:i; }
// Post-Results category filter (All / Top line / Bottom line). Top line = the revenue lines; everything
// below the top line (profit, margins, cash, shares, EPS) is Bottom line. Keys are CE_CONS.m[].k.
var CE_TOPLINE={'Revenue':1,'Domestic net sales':1,'International net sales':1,'Cleaning':1,'Cooking & Beverage':1,'Food Preparation':1,'Beauty & Home Environment':1};
function ceCat(k){ return CE_TOPLINE[k]?'top':'bottom'; }
// A dedicated margin ROW for a cell (label + value + the base-period margin in parens). Sits on
// its own line so it always fits the box — the old inline chip overflowed (§6a-ii). The base
// swaps with the growth lens: YoY → same quarter a year ago, QoQ → prior quarter.
// Current margin + the margin of the period the growth chip compares against. The base swaps with
// the lens (YoY → the same quarter a year ago; QoQ → the prior quarter), so with Margin + YoY on
function ceGrid(u,which){
  var qi=CE_CONS.q.indexOf(u.q); if(qi<0) return '';
  var st=u.setup||{}, us=st.us||{}, notes=st.notes||{};
  var revM=CE_CONS.m.filter(function(x){ return x.k==='Revenue'; })[0];
  var revC=(revM&&revM.qr[qi])?revM.qr[qi][3]:null;      // BBG revenue for the quarter
  var revS=(us['Revenue']?us['Revenue'].v:null)||revC;   // Summit revenue, else BBG
  var revQy=revM?revM.qy[qi]:null, revQq=revM?revM.qq[qi]:null;   // revenue actual 1yr / 1q earlier
  // Revenue BASE for a margin line (CE_MARGIN_DEN): total Revenue for consolidated lines, the segment's
  // own net sales for a SEGMENT operating income. Same pattern as the Post-Results cards — implied margin
  // (Street metric ÷ Street base) with the prev period (actual metric ÷ actual base). The Street-consensus
  // base differs from the metric's own consensus, but we compare like-with-like anyway (§ Dani, Aug 2026).
  function denRow(dk){ var dm=ceMetricByKey(dk); if(!dm) return null;
    var dc=(dm.qr[qi])?dm.qr[qi][3]:null;
    return { c:dc, s:(us[dk]&&us[dk].v!=null)?us[dk].v:dc, qy:dm.qy[qi], qq:dm.qq[qi] }; }
  var list=CE_CONS.m.map(function(m,i){ return {m:m,i:i}; })
    .filter(function(x,i){ return (which==='head')?(x.i<CE_CONS.nHead):(x.i>=CE_CONS.nHead); });
  return '<div class="ce-mgrid">'+list.map(function(x){
    var m=x.m, c=m.qr[qi]?m.qr[qi][3]:null;
    var note=notes[m.k], q=note?ceQ('setnote-'+ceQkey(u.q)+'-'+x.i, note.t, note.h):'';
    var uv=us[m.k];
    var denK=CE_MARGIN_DEN[m.k], mgn=!!denK, den=mgn?denRow(denK):null;
    var street=(c==null)
      ? '<span class="ce-empty">—</span>'+(m.t==='nocons'?'<span class="ce-nocons" title="The archive carries no forward estimate for this line — actuals only">no est.</span>':'')
      : ceFmtV(m.u,c)+'<span class="ce-gy">'+ceChip(ceGrowth(m,qi,'yoy'))+'</span><span class="ce-gq">'+ceChip(ceGrowth(m,qi,'qoq'))+'</span>';
    var summitCell=uv
      ? ceFmtV(m.u,uv.v)+'<span class="ce-gy">'+ceChip(ceGrowth(m,qi,'yoy',uv.v))+'</span><span class="ce-gq">'+ceChip(ceGrowth(m,qi,'qoq',uv.v))+'</span>'
      : '<span class="ce-empty">—</span>';
    // Implied margins — Street (consensus ÷ its own base) and Summit (Summit ÷ its Summit base), plus the
    // prev-period realised margin. Segment OIs use their segment net sales as base (CE_MARGIN_DEN).
    var mExpC=(mgn&&den)?ceMarginPct(c,den.c):null, mExpU=(mgn&&den)?ceMarginPct(uv?uv.v:null,den.s):null;
    var mPrevY=(mgn&&den)?ceMarginPct(m.qy[qi],den.qy):null, mPrevQ=(mgn&&den)?ceMarginPct(m.qq[qi],den.qq):null;
    // One compact table per metric — columns Street | Summit (one header each, no repeated labels), rows
    // est · margin. Single view hides the inactive column; Both widens to both (Dani, Aug 2026).
    return '<div class="ce-mcell'+(which==='cust'?' cust':'')+(m.t==='basis'?' flagged':'')+'">'+
      '<div class="ce-mcell-k">'+esc(m.k)+q+'</div>'+
      '<div class="ce-mtbl">'+
        '<span class="ce-mrl"></span><span class="ce-mh ce-mcol-cons">Street</span><span class="ce-mh ce-mcol-us">Summit</span>'+
        '<span class="ce-mrl">est</span><span class="ce-mv ce-mcol-cons">'+street+'</span><span class="ce-mv ce-mcol-us">'+summitCell+'</span>'+
        ((mgn&&den)?('<span class="ce-mrl ce-mmc">margin</span>'+
          '<span class="ce-mv ce-mgn-v ce-mmc ce-mcol-cons">'+(mExpC!=null?mExpC+'%':'—')+'</span>'+
          '<span class="ce-mv ce-mgn-v ce-mmc ce-mcol-us">'+(mExpU!=null?mExpU+'%':'—')+'</span>'+
          ((mPrevY!=null||mPrevQ!=null)?'<span class="ce-mprev ce-mmc">'+(mPrevY!=null?'<span class="ce-mm-b yoy"><span class="ce-mprev-l">a year ago</span>'+mPrevY+'%</span>':'')+(mPrevQ!=null?'<span class="ce-mm-b qoq"><span class="ce-mprev-l">prior quarter</span>'+mPrevQ+'%</span>':'')+'</span>':'')):'')+
      '</div></div>';
  }).join('')+'</div>';
}
function ceGridStyle(){
  return '<style>'+
    '.ce-mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:8px;margin:4px 0}'+
    '.ce-mcell{border:1px solid var(--bdr);border-left:3px solid '+BRAND+';border-radius:9px;padding:8px 10px;background:#fff}'+
    '.ce-mcell.cust{border-left-color:'+BRAND2+'}'+
    '.ce-mcell.flagged{border-left-color:'+GRAY+';opacity:.72}'+
    '.ce-mcell-k{font-size:10px;font-weight:700;color:var(--mu);display:flex;align-items:center;gap:4px;line-height:1.3;min-height:26px}'+
    '.ce-mcell-v{margin-top:3px}'+
    /* per-metric mini-table: columns Street | Summit (one header each). Single view hides the inactive
       estimate column; Both widens to both. Column-hide uses .ce-mtbl (spec 0,4,0) so it beats the mm rule. */
    '.ce-mtbl{display:grid;grid-template-columns:auto 1fr;gap:2px 8px;align-items:baseline;margin-top:4px;font-variant-numeric:tabular-nums}'+
    '.ce-evwrap[data-ev="both"] .ce-mtbl{grid-template-columns:auto 1fr 1fr}'+
    '.ce-evwrap[data-ev="cons"] .ce-mtbl .ce-mcol-us{display:none}'+
    '.ce-evwrap[data-ev="us"] .ce-mtbl .ce-mcol-cons{display:none}'+
    '.ce-mrl{font-size:8px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu);white-space:nowrap;align-self:center}'+
    '.ce-mh{font-size:8px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu)}'+
    '.ce-mv{font-size:13px;font-weight:900;color:var(--navy);display:flex;align-items:baseline;gap:4px;flex-wrap:wrap}'+
    '.ce-mgn-v{font-size:11px;color:'+PURPLE+'}'+
    /* prev-period realised margin — its OWN full-width row so it never widens the Street cell / breaks the
       column alignment; small + muted so it does not compete with the estimate margins. */
    /* prev-period realised margin — its OWN full-width row, set off from the estimate margins by a
       hairline so it reads as a reference, not a competing number. A small period label ("a year ago"
       / "prior quarter") makes clear which toggled period it compares against — no bare "prev". */
    '.ce-mprev{grid-column:1/-1;margin-top:3px;padding-top:3px;border-top:1px dotted var(--bdr);line-height:1.2}'+
    '.ce-mprev-l{font-size:7.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--mu);margin-right:5px}'+
    '.ce-mmc{display:none}'+
    '.ce-evwrap[data-mm="on"] .ce-mmc{display:flex}'+
    '.ce-evwrap[data-g="off"] .ce-mprev{display:none}'+   /* no toggled period → no prev line, one less thing on the card */
    '.ce-gchip{font-size:10px;font-weight:800;margin-left:2px}'+
    '.ce-mm{display:none}'+'.ce-mm-b{display:none;font-size:9.5px;font-weight:800;color:var(--navy);white-space:nowrap;align-items:baseline}'+'.ce-evwrap[data-mm="on"][data-g="yoy"] .ce-mm-b.yoy{display:inline-flex}'+'.ce-evwrap[data-mm="on"][data-g="qoq"] .ce-mm-b.qoq{display:inline-flex}'+
    '.ce-evwrap[data-mm="on"] .ce-mm{display:inline}'+
    '.ce-nocons{font-size:8.5px;font-weight:800;color:var(--mu);border:1px solid var(--bdr);border-radius:999px;padding:1px 6px;margin-left:6px}'+
    /* the growth lens: CSS-driven, so switching does not re-render the grid */
    '.ce-evwrap[data-g="yoy"] .ce-gq,.ce-evwrap[data-g="qoq"] .ce-gy,'+
    '.ce-evwrap[data-g="off"] .ce-gy,.ce-evwrap[data-g="off"] .ce-gq{display:none}'+
    '.ce-gseg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.ce-gseg button{font-size:10px;font-weight:800;padding:3px 11px;border:0;border-radius:999px;background:transparent;color:var(--mu);cursor:pointer;transition:.14s}'+
    '.ce-gseg button.active{background:var(--navy);color:#fff}'+'.ce-vdf{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+'.ce-vdf button{font-size:10px;font-weight:800;padding:3px 11px;border:0;border-radius:999px;background:transparent;color:var(--mu);cursor:pointer;transition:.14s}'+'.ce-vdf button.active{background:var(--navy);color:#fff}'+
    /* verdict filter — data-f on the .ce-fz root drives BOTH the cards (.ce-fz-t) and the chart rows
       (.ce-dv-row), each estimate-view-aware (data-vdc = Street verdict, data-vdu = Summit verdict) */
    '.ce-fz[data-ev="cons"][data-f="beat"] .ce-fz-t:not([data-vdc="beat"]),'+'.ce-fz[data-ev="cons"][data-f="miss"] .ce-fz-t:not([data-vdc="miss"]),'+'.ce-fz[data-ev="cons"][data-f="inline"] .ce-fz-t:not([data-vdc="inline"]),'+'.ce-fz[data-ev="us"][data-f="beat"] .ce-fz-t:not([data-vdu="beat"]),'+'.ce-fz[data-ev="us"][data-f="miss"] .ce-fz-t:not([data-vdu="miss"]),'+'.ce-fz[data-ev="us"][data-f="inline"] .ce-fz-t:not([data-vdu="inline"]),'+'.ce-fz[data-ev="cons"][data-f="beat"] .ce-dv-row:not([data-vdc="beat"]),'+'.ce-fz[data-ev="cons"][data-f="miss"] .ce-dv-row:not([data-vdc="miss"]),'+'.ce-fz[data-ev="cons"][data-f="inline"] .ce-dv-row:not([data-vdc="inline"]),'+'.ce-fz[data-ev="us"][data-f="beat"] .ce-dv-row:not([data-vdu="beat"]),'+'.ce-fz[data-ev="us"][data-f="miss"] .ce-dv-row:not([data-vdu="miss"]),'+'.ce-fz[data-ev="us"][data-f="inline"] .ce-dv-row:not([data-vdu="inline"]){display:none}'+
    '.ce-dbt{display:flex;flex-direction:column;gap:5px}'+
    '.ce-dbt-r{display:grid;grid-template-columns:1.3fr 1fr 1fr 70px;gap:10px;align-items:center;'+
      'border:1px solid var(--bdr);border-left:4px solid var(--mu);border-radius:9px;padding:7px 12px;background:#fff}'+
    '.ce-dbt-r.above{border-left-color:#0a8f4c}.ce-dbt-r.below{border-left-color:'+RED+'}'+
    '.ce-dbt-k{font-size:11.5px;font-weight:800;color:var(--navy)}'+
    '.ce-dbt-v{font-size:11px;color:var(--navy);font-variant-numeric:tabular-nums}'+
    '.ce-dbt-v b{font-size:8.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);margin-right:5px}'+
    '.ce-dbt-d{font-size:12px;font-weight:900;text-align:right;font-variant-numeric:tabular-nums}'+
    '.ce-dbt-r.above .ce-dbt-d{color:#0a8f4c}.ce-dbt-r.below .ce-dbt-d{color:'+RED+'}'+
    '.ce-dbt-none{border:1px dashed var(--bdr);border-radius:10px;padding:10px 13px;font-size:11px;'+
      'line-height:1.55;color:var(--mu);background:#FAFBFD}'+
    '@media(max-width:640px){.ce-dbt-r{grid-template-columns:1fr auto}.ce-dbt-v{display:none}}'+
  '</style>';
}
function ceSetupBody(c){
  var h=ceStyle()+ceGridStyle();
  h+=CALL_EARNINGS.quarters.map(function(u,qi){
    var qk=ceQkey(u.q), frozen=(u.status!=='upcoming');
    var b='<div class="ce-qblock" data-ceq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="ce-phase" style="background:'+BLUE+'">① Pre-Call'+(frozen?'<span class="ce-frozen">frozen</span>':'')+'</div>';
    var st=u.setup||{}, hasGrid=(CE_CONS.q.indexOf(u.q)>=0);
    if(hasGrid){
      b+='<div class="ov-diagram-cap" style="margin:6px 0 6px;display:flex;flex-wrap:wrap;align-items:center;gap:12px"><b>Estimates</b>'+
        '<span class="mg-seg" style="display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px">'+
          '<button type="button" class="ce-ev-pill active" data-ceev="cons">Consensus</button>'+
          '<button type="button" class="ce-ev-pill" data-ceev="us">Summit</button>'+
          '<button type="button" class="ce-ev-pill" data-ceev="both">Both</button>'+
        '</span>'+
        // Growth lens. `fq-3` and `fq0` are both reported actuals, so the same consensus cell can
        // be read against either base — that is exactly why the archive carries fq-3.
        '<span class="ce-gseg"><button type="button" class="active" data-ceg="yoy">YoY</button>'+
          '<button type="button" data-ceg="qoq">QoQ</button>'+
          '<button type="button" data-ceg="off">Off</button></span>'+
        '<span class="ce-gseg"><button type="button" data-cemm="on">Margin</button>'+
          '<button type="button" class="active" data-cemm="off">Hide mgn</button></span>'+
      '</div>';
      b+='<div class="ce-evwrap" data-ev="cons" data-g="yoy">';
      b+='<div class="ce-row-cap">Headline — every company, always</div>'+ceGrid(u,'head');
      b+='<div class="ce-row-cap" style="margin-top:12px">Custom KPIs — SN</div>'+ceGrid(u,'cust');
      b+='</div>';
      // (The "debate" line-by-line block + its synth line were removed per request — Aug 2026.)
      // (Foot caption "Frozen at call time…" removed — Dani, Aug 2026.)
    }
    // "The contemporaneous read" block (priced-in + one-liner) removed from Setup per Dani (Aug 2026).
    // The data (st.pricedIn / st.oneLiner) is kept in CALL_EARNINGS but no longer rendered here.
    b+='</div>';
    return b;
  }).join('');
  h+=ceAnnualBody();
  h+=ceConsensusEvoBody();
  return h;
}
// A2 · Consensus Estimate Evolution — how the Street's forward Revenue estimate has been REVISED
// across the Bloomberg quarterly snapshots (BBG_CONSENSUS.txt). Fixed FY (one line per fiscal year,
// the revision trend) ⇄ Rolling NTM (Σ next 4 forecast quarters). Revenue only for now; the module
// (js/consensus-evolution.js) is ticker/metric-agnostic so more slot in with the same data shape.
function ceConsensusEvoBody(){
  return '<div class="ce-cev" style="margin:22px 0 4px;padding:16px 0 0;border-top:2px solid var(--bdr)">'+
    consensusEvo.html('SN','rev')+'</div>';
}
function ceConsensusEvoRoot(){ return document.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phpane[data-cep="setup"] .ce-cev'); }
// A1 · The annual picture — how the FY has looked, and what BBG vs Summit expect for the ones
// still open. Reported FY actuals are bars/line; the forward years carry two forward points,
// Bloomberg consensus (our txt) and Summit (the DCF, most-recent annual snapshot). If the company
// gave numeric FY guidance we would add a third; AMZN does not, so we say so. (§6a-viii.)
// Quarterly is deliberately NOT wired yet — see the rules; the annual forecast is what exists today.
// ── The Setup chart IS the Results engine (js/results.js), one MERGED section (AMZN_SETUP dataset),
// rendered inside Earnings > Setup — the SAME chart + integrated table + period-lever + margin lines
// as the Results tab, clubbed into one (§6a-viii-bis, v2.9). The section key 'setup' keeps its engine
// canvases/tables/sliders UNIQUE, so the two engine instances (Setup + Results) coexist on the page.
function ceAnnualBody(){
  return '<div class="ce-ann" style="margin:20px 0 4px;padding:16px 0 0;border-top:2px solid var(--bdr)">'+
    '<div class="ov-sec-h">The Setup picture — reported vs Street (Summit pending): pick any line, window the period with the lever, toggle margins</div>'+
    resultsHtml('SN_SETUP')+'</div>';
}
function ceSetupWrap(){ return document.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phpane[data-cep="setup"] .rs-wrap'); }
function gBuildCeAnnual(){ var w=ceSetupWrap(); if(w) initResults(w, 'SN_SETUP');   // (kept name: called from buildSub / phase-tab wiring)
  var cev=ceConsensusEvoRoot(); if(cev && !cev._cevInit){ cev._cevInit=true; consensusEvo.init(cev, 'SN', 'rev'); }
}
// B · Watch List ─────────────────────────────────────────────────────────────────────────────────
// v3.0 (Aug 2026): migrated to the SHARED engine (js/watchlist.js). We render a mount host here;
// wireCallEarnings mounts the engine into it with the company id + quarters. Persistence, sorting,
// tags and the delete rule all come from the engine (Supabase table company_themes) — no per-file
// WL_ROWS. The multi-year theme record stays below, folded in as before.
function ceWatchBody(c){
  var h=ceStyle();
  // ── FUSED: the full multi-year theme record (was the standalone Evolution ▸ Earnings Calls tab,
  // dissolved Jul 2026 — no two tabs on the same call highlights). Moved to the TOP of this sub-tab
  // (Aug 2026, AMZN only) — it now leads; the Watch List is folded in below it. ──
  h+='<div class="ce-band" style="--bc:'+BRAND+'"><span class="ce-band-i">▤</span><span class="ce-band-t">The theme record — every thread, across all calls</span><span class="ce-band-s">the multi-year backbone behind the hunt below (the former "Earnings Calls" tab, folded in)</span><span class="ce-band-l"></span></div>';
  // Wrapped so the editor below can re-render it in place when a theme / sub-theme is added.
  h+='<div data-snrec>'+callsBody()+'</div>';
  // ── The editing surface — a Theme → Sub-theme picker (AMZN-only). HIDDEN by default so the record
  // above reads clean; the button reveals it only when you want to add/update. Adding a theme or
  // sub-theme reflects in the record above immediately. ──
  h+='<style>.sn-edit{margin-top:22px}'+
     '.sn-edit-tog{display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap;font:inherit;font-size:11px;font-weight:800;color:var(--mu);background:var(--w);border:1px dashed var(--bdr);border-radius:999px;padding:7px 15px;cursor:pointer;transition:.14s}'+
     '.sn-edit-tog:hover{color:'+BRAND2+';border-color:'+BRAND2+'}'+
     '.sn-edit[data-open="1"] .sn-edit-tog{color:'+BRAND2+';border-style:solid;border-color:'+BRAND2+'}'+
     '.sn-edit-ic{font-size:12px}'+
     '.sn-edit-s{font-weight:600;font-style:italic;color:var(--mu);font-size:10px}'+
     '.sn-edit-body{margin-top:16px;border-top:2px solid var(--bdr);padding-top:16px}'+
     '.sn-edit-body[hidden]{display:none}'+
     /* the Theme → Sub-theme editor */
     '.aed-hint{font-size:11px;color:var(--navy);background:rgba(20,110,180,0.06);border:1px solid rgba(20,110,180,0.25);border-radius:9px;padding:8px 12px;margin:0 0 12px;line-height:1.5}'+
     '.aed-row{display:flex;align-items:flex-start;gap:10px;margin:0 0 12px}'+
     '.aed-lb{flex:none;width:78px;font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);padding-top:6px}'+
     '.aed-pills{display:flex;gap:6px;flex-wrap:wrap;flex:1}'+
     '.aed-pill{font:inherit;font-size:11px;font-weight:800;border:1px solid var(--bdr);background:var(--w);color:var(--navy);padding:5px 13px;border-radius:999px;cursor:pointer;transition:.12s}'+
     '.aed-pill:hover{border-color:'+BRAND2+';color:'+BRAND2+'}.aed-pill.on{background:'+BRAND2+';color:#fff;border-color:'+BRAND2+'}'+
     '.aed-pill.sub.on{background:'+BRAND+';border-color:'+BRAND+';color:#fff}'+
     '.aed-add{font:inherit;font-size:10.5px;font-weight:800;border:1px dashed '+BRAND2+';background:var(--w);color:'+BRAND2+';padding:5px 12px;border-radius:999px;cursor:pointer}'+
     '.aed-add:hover{background:rgba(20,110,180,0.06)}'+
     '.aed-win{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
     '.aed-win button{font:inherit;font-size:10px;font-weight:800;border:0;background:transparent;color:var(--mu);padding:4px 11px;border-radius:999px;cursor:pointer}'+
     '.aed-win button.on{background:var(--navy);color:#fff}'+
     '.aed-hookst{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--mu);align-self:center}'+
     '.aed-hookst.open{color:'+BRAND2+'}.aed-hookst.closed{color:'+RED+'}'+
     '.aed-delseg{font:inherit;font-size:10px;font-weight:800;border:1px solid var(--bdr);background:var(--w);color:var(--mu);padding:4px 11px;border-radius:999px;cursor:pointer}'+
     '.aed-delseg:hover{border-color:'+RED+';color:'+RED+'}'+
     '.aed-empty{font-size:10.5px;color:var(--mu);font-style:italic;padding:6px 0}'+
     '.aed-detail{border:1px solid var(--bdr);border-left:3px solid '+BRAND+';border-radius:10px;padding:12px 14px;background:#FAFBFD;margin-top:4px}'+
     '.aed-detail-h{font-size:13px;font-weight:800;color:var(--navy)}.aed-detail-seg{font-size:9.5px;font-weight:700;color:var(--mu);margin-left:8px}'+
     '.aed-why{font-size:11.5px;color:var(--mu);font-style:italic;margin:6px 0 8px;line-height:1.5}'+
     '.aed-notes{display:flex;flex-direction:column;gap:10px}.aed-note-q{display:inline-flex;align-items:center;gap:6px;font-size:9px;font-weight:800;color:'+BRAND+';background:rgba(255,153,0,0.10);border-radius:20px;padding:2px 8px;margin-bottom:2px}'+
     '.aed-qgroup{border-top:1px dashed var(--bdr);padding-top:6px}'+
     '.aed-flb{display:block;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin:12px 0 4px}'+
     '.aed-ta{width:100%;box-sizing:border-box;font:inherit;font-size:12px;border:1px solid var(--bdr);border-radius:8px;padding:7px 10px;background:var(--w);color:var(--navy);line-height:1.5;resize:vertical}'+
     '.aed-ta:focus,.aed-sel:focus,.aed-addnote input:focus{outline:none;border-color:'+BRAND2+'}'+
     '.aed-sel{font:inherit;font-size:11px;border:1px solid var(--bdr);border-radius:8px;padding:5px 8px;background:var(--w);color:var(--navy)}'+
     '.aed-track{display:flex;gap:16px;flex-wrap:wrap;align-items:center;font-size:10px;font-weight:700;color:var(--mu)}'+
     '.aed-note-row{display:flex;align-items:flex-start;gap:8px;padding:4px 0;font-size:12px;line-height:1.5}.aed-note-row>span{flex:1}'+
     '.aed-del{flex:none;font:inherit;font-size:11px;font-weight:800;border:1px solid var(--bdr);background:var(--w);color:var(--mu);width:20px;height:20px;border-radius:6px;cursor:pointer;line-height:1}'+
     '.aed-del:hover{border-color:'+RED+';color:'+RED+'}'+
     '.aed-ed{flex:none;font:inherit;font-size:10px;font-weight:800;border:1px solid var(--bdr);background:var(--w);color:var(--mu);width:20px;height:20px;border-radius:6px;cursor:pointer;line-height:1}'+
     '.aed-ed:hover{border-color:'+BRAND2+';color:'+BRAND2+'}'+
     '.aed-mini{font:inherit;font-size:10.5px;font-weight:800;border:1px solid '+BRAND2+';background:'+BRAND2+';color:#fff;padding:6px 12px;border-radius:8px;cursor:pointer}'+
     '.aed-mini.alt{background:var(--w);color:'+BRAND2+'}.aed-mini{transition:filter .14s,transform .06s}.aed-mini:hover{filter:brightness(1.08)}.aed-mini:active{transform:translateY(1px)}'+
     '.aed-addnote{display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin-top:8px}'+
     '.aed-addnote input{flex:1;min-width:180px;box-sizing:border-box;font:inherit;font-size:12px;border:1px solid var(--bdr);border-radius:8px;padding:6px 9px;background:var(--w);color:var(--navy)}'+
     '.aed-frow{display:flex;gap:8px;align-items:center;margin-top:10px}'+
     '.aed-delsub{margin-left:auto;font:inherit;font-size:9.5px;font-weight:800;border:1px solid var(--bdr);background:var(--w);color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
     '.aed-delsub:hover{border-color:'+RED+';color:'+RED+'}'+
     '.aed-note ul{margin:2px 0 0;padding-left:18px;font-size:12px;line-height:1.55}</style>';
  h+='<div class="sn-edit" data-snedit data-open="0">'+
       '<button type="button" class="sn-edit-tog" data-sneditog aria-expanded="false"><span class="sn-edit-ic">✎</span> Edit notes &amp; tracking <span class="sn-edit-s">— opens only to add/update a theme or sub-theme</span></button>'+
       '<div class="sn-edit-body" hidden><div data-sneditor></div></div>'+
     '</div>';
  return h;
}
// (Promise Tracker dissolved Jul 2026 — promise-type items now live as tracked themes inside the
// Watch List `thread`s and in Evolution ▸ Earnings Calls.)
// Scorecard result kinds. beat/miss/inline score against a consensus line; `nodisc` (a KPI
// management STOPPED disclosing) and `nocons` (a number nobody modelled) are not beats or misses —
// they are their own signal, and conflating them with a miss loses the point.
var CE_RES={ beat:{c:'#0a8f4c',l:'Beat'}, miss:{c:RED,l:'Miss'}, inline:{c:'#6b7684',l:'In line'},
             nodisc:{c:AMBER,l:'Not disclosed'}, nocons:{c:PURPLE,l:'No consensus'} };
// D · Post-Results ── the numbers (available first, before/without the call): a beat/miss scorecard.
// ─── The frozen Street number, straight from the archive ────────────────────────────────────────
// "Frozen expectations" used to mean whatever prose someone typed into `scorecard[].cons` before
// the print ("high-teens growth modeled"). That is a memory, not a record. The archive gives us
// the real thing: the snapshot immediately BEFORE the print carries the consensus that actually
// stood going in, so the comparison is reconstructed from data instead of recalled.
// Renders as a tile strip at the top of Post-Results. Revenue shows no surprise — different basis.
// ─── cePrintBlock · THE print, in one place ─────────────────────────────────────────────────────
// Formerly two blocks that said the same thing twice: the archive "frozen strip" (consensus →
// print, 13 standardized lines) and a hand-authored "scorecard — ranked by surprise". Merged.
// The archive is the spine — every number and every surprise is computed from BBG_CONSENSUS.txt,
// so it cannot drift. The hand-authored layer contributes only what a number cannot: a per-metric
// note (`results.notes[metric]`) and the frozen-Watch-List rank (`results.watch[metric]`). Any
// bespoke row that is NOT one of the standardized metrics (an old "funding flip" card, a
// disclosure with no consensus like Gemini app MAU) is intentionally dropped — the standardized
// view is the metrics the archive tracks, ranked by how far each landed from the Street. (§6a-ii.)
function ceVerdict(m, c, a, surp){
  if(a==null) return {l:'—', c:'#9AA4B0', k:'none'};
  if(c==null) return {l:'no est.', c:'#7A5AF8', k:'noest'};       // nocons / noact: a print, nothing to score
  if(surp==null) return {l:'—', c:'#9AA4B0', k:'none'};
  if(Math.abs(surp)<2) return {l:CE_RES.inline.l, c:CE_RES.inline.c, k:'inline'};
  return surp>0 ? {l:CE_RES.beat.l, c:CE_RES.beat.c, k:'beat'} : {l:CE_RES.miss.l, c:CE_RES.miss.c, k:'miss'};
}
// ── The print AT A GLANCE — a diverging surprise chart (Aug 2026). The cards give absolute values on
// each metric's own scale; this normalizes EVERY metric to a single % axis (surprise = actual/expected
// − 1), so revenue, EPS, AWS and capex line up on the same ruler. Green beats grow right, red misses
// grow left, ranked by |Street surprise| like the cards. Both bases are baked in and toggled by the
// same data-ev (vs Street ⇄ vs Summit) as the cards, so one control drives both views. Outliers past
// the axis (an EPS mark) clamp to the edge with a ▸ and print their true number.
function cePrintChartRows(qi, us){
  us=us||{};
  return CE_CONS.m.map(function(m){
    var c=m.qr[qi]?m.qr[qi][3]:null, a=m.qa[qi];
    var uexp=(us[m.k]&&us[m.k].v!=null)?us[m.k].v:null;
    if(c==null&&a==null&&uexp==null) return null;
    var cS=(c!=null&&a!=null&&c)?((a/c-1)*100):null;
    var uS=(uexp!=null&&a!=null&&uexp)?((a/uexp-1)*100):null;
    return { k:m.k, cS:cS, uS:uS, c:c, uexp:uexp, a:a, u:m.u };
  }).filter(Boolean);
}
function cePrintChart(qi, us){
  var rows=cePrintChartRows(qi, us);
  var withSurp=rows.filter(function(r){ return r.cS!=null||r.uS!=null; });
  if(withSurp.length<2) return '';
  // Axis scale ignores outliers over 50% (e.g. an EPS mark) so one big number does not flatten the rest.
  var mags=[];
  withSurp.forEach(function(r){ [r.cS,r.uS].forEach(function(v){ if(v!=null && Math.abs(v)<=50) mags.push(Math.abs(v)); }); });
  var axisMax=Math.max(8, Math.ceil(mags.length?Math.max.apply(null,mags):8));
  // Default order = statement order (same as the cards); --od carries the |Street surprise| rank so the
  // "By surprise" toggle reflows in pure CSS — one data-ord on .ce-fz drives both the cards and this chart.
  rows.forEach(function(r){ r.stmt=ceStmtIdx(r.k); r.sa=(r.cS==null?-1:Math.abs(r.cS)); });
  rows.slice().sort(function(a,z){ return z.sa-a.sa; }).forEach(function(r,i){ r.od=i; });
  rows=rows.slice().sort(function(a,z){ return (a.stmt-z.stmt) || (a.od-z.od); });
  // Bar lives in a bounded track (no floating labels); the number sits in its own right column, so
  // nothing overflows and every metric name gets a full column. Bar width caps at the axis.
  function bar(v, cls){
    if(v==null) return '<span class="ce-dv-dot '+cls+'"></span>';
    var k=(Math.abs(v)<2)?'inline':(v>0?'beat':'miss');
    var w=Math.min(Math.abs(v),axisMax)/axisMax*50;
    return '<span class="ce-dv-bar '+cls+' '+(v>=0?'pos':'neg')+' '+k+'" style="width:'+w.toFixed(1)+'%"></span>';
  }
  function val(v, cls){
    if(v==null) return '<span class="ce-dv-v '+cls+' none">—</span>';
    var over=Math.abs(v)>axisMax, k=(Math.abs(v)<2)?'inline':(v>0?'beat':'miss');
    return '<span class="ce-dv-v '+cls+' '+k+'">'+(v>=0?'+':'−')+(Math.round(Math.abs(v)*10)/10)+'%'+(over?'▸':'')+'</span>';
  }
  // Hover reads the WHOLE ROW (bars for a small surprise are only ~2px wide — too thin to point at),
  // so the tooltip target is the full row and it carries BOTH bases: metric · expected (its own
  // value+unit) · actual · surprise %. The tip is a visible styled card (::after on data-tip), not a
  // native title, so it is legible even when the list runs long.
  function tipRow(basis, cls, exp, a, v, u){
    if(v==null && exp==null) return '';
    var col=(v==null)?'#9AA4B0':(Math.abs(v)<2?'#9AA4B0':(v>0?'#0a8f4c':RED));
    var pct=(v==null)?'no est.':((v>=0?'+':'−')+(Math.round(Math.abs(v)*10)/10)+'%');
    return '<div class="ce-dv-tip-l"><span class="ce-dv-tip-b '+cls+'">'+basis+'</span>'+
      '<span class="ce-dv-tip-x">exp <b>'+(ceFmtV(u,exp)||'—')+'</b> · act <b>'+(ceFmtV(u,a)||'—')+'</b></span>'+
      '<span class="ce-dv-tip-p" style="color:'+col+'">'+pct+'</span></div>';
  }
  // verdict per basis (mirrors ceVerdict.k) so the All/Beats/Misses filter works on the chart too
  function vk(surp, exp, a){ if(a==null) return 'none'; if(exp==null) return 'noest'; if(surp==null) return 'none'; return (Math.abs(surp)<2)?'inline':(surp>0?'beat':'miss'); }
  var rowsHtml=rows.map(function(r){
    var tip='<div class="ce-dv-tip"><div class="ce-dv-tip-h">'+esc(r.k)+'</div>'+
      tipRow('Street','ce-exp-cons',r.c,r.a,r.cS,r.u)+tipRow('Summit','ce-exp-us',r.uexp,r.a,r.uS,r.u)+'</div>';
    return '<div class="ce-dv-row" data-vdc="'+vk(r.cS,r.c,r.a)+'" data-vdu="'+vk(r.uS,r.uexp,r.a)+'" style="--od:'+r.od+'">'+
      '<span class="ce-dv-k" title="'+esc(r.k)+'">'+esc(r.k)+'</span>'+
      '<span class="ce-dv-track"><span class="ce-dv-zero"></span>'+bar(r.cS,'ce-exp-cons')+bar(r.uS,'ce-exp-us')+'</span>'+
      '<span class="ce-dv-vwrap">'+val(r.cS,'ce-exp-cons')+val(r.uS,'ce-exp-us')+'</span>'+
      tip+
    '</div>';
  }).join('');
  return '<div class="ce-dv">'+
    '<div class="ce-dv-cap">Every metric on one surprise axis, so different scales line up. '+
      'Reading <b class="ce-exp-cons">vs Street</b><b class="ce-exp-us">vs Summit</b>: green beats grow right, red misses grow left. A ▸ means the surprise runs past the axis.</div>'+
    '<div class="ce-dv-rows">'+rowsHtml+'</div>'+
    '<div class="ce-dv-axis"><span>−'+axisMax+'%</span><span>in line</span><span>+'+axisMax+'%</span></div>'+
  '</div>';
}
function cePrintBlock(qLabel, r, us){
  var qi=CE_CONS.q.indexOf(qLabel); if(qi<0) return '';
  r=r||{}; us=us||{};
  var notes=r.notes||{}, watch=r.watch||{};
  // Revenue for the quarter — the margin denominator (§6a-vi). Street, Summit, and the print.
  var revM=CE_CONS.m.filter(function(x){ return x.k==='Revenue'; })[0];
  var revC=(revM&&revM.qr[qi])?revM.qr[qi][3]:null, revA=revM?revM.qa[qi]:null;
  var revS=(us['Revenue']&&us['Revenue'].v!=null)?us['Revenue'].v:revC;   // Summit revenue, else BBG
  var GRN='#0a8f4c';
  var revQY=revM?revM.qy[qi]:null, revQQ=revM?revM.qq[qi]:null;
  // Revenue base for a margin line: actual / Street / Summit / prior-year / prior-quarter of the metric
  // named in CE_MARGIN_DEN (total Revenue for consolidated lines, the segment's net sales for a segment OI).
  function denVals(dk){
    var dm=ceMetricByKey(dk); if(!dm) return null;
    var dc=(dm.qr[qi])?dm.qr[qi][3]:null;
    return { a:dm.qa[qi], c:dc, s:(us[dk]&&us[dk].v!=null)?us[dk].v:dc, qy:dm.qy[qi], qq:dm.qq[qi] };
  }
  // Signed, coloured growth: value ÷ prior − 1 (prior = the YoY or QoQ actual). "—" when unknown.
  function ceGwSpan(val, prior){
    if(val==null||prior==null||!prior) return '<span class="ce-tv-e">—</span>';
    var gv=Math.round((val/prior-1)*100);
    return '<span style="color:'+(gv>=0?GRN:RED)+'">'+(gv>=0?'+':'−')+Math.abs(gv)+'%</span>';
  }
  // Realised margin %, NO sign — the colour carries direction: green = EXPANSION vs the prior period,
  // red = contraction, on the SAME YoY/QoQ lens as growth (a seasonally soft QoQ can read red while
  // YoY reads green). "—" prior = neutral (navy).
  function ceMgExpSpan(real, prior){
    if(real==null) return '<span class="ce-tv-e">—</span>';
    var col=(prior==null)?'var(--navy)':(real>=prior?GRN:RED);
    return '<span style="color:'+col+';font-weight:800">'+real+'%</span>';
  }
  // Pass 1 — compute every line's numbers. We need all surprises before we can rank (for the
  // "By surprise" order toggle), so no HTML is built yet.
  var rows=CE_CONS.m.map(function(m){
    var c=m.qr[qi]?m.qr[qi][3]:null, a=m.qa[qi];
    var uexp=(us[m.k]&&us[m.k].v!=null)?us[m.k].v:null;   // Summit's FROZEN expectation for this line
    if(c==null&&a==null&&uexp==null) return null;
    // Surprise = actual / expected − 1, for BOTH bases (the vs Street ⇄ vs Summit toggle picks one).
    var cSurp=(c!=null&&a!=null&&c)?((a/c-1)*100):null;
    var uSurp=(uexp!=null&&a!=null&&uexp)?((a/uexp-1)*100):null;
    return { m:m, c:c, a:a, uexp:uexp, cSurp:cSurp, uSurp:uSurp,
      cV:ceVerdict(m,c,a,cSurp), uV:ceVerdict(m,uexp,a,uSurp),
      py:m.qy[qi], pq:m.qq[qi], stmt:ceStmtIdx(m.k),
      surpAbs:(cSurp==null?-1:Math.abs(cSurp)) };
  }).filter(Boolean);
  if(!rows.length) return '';
  // --od = rank by |Street surprise| desc (the "By surprise" order); default DOM order is statement order.
  rows.slice().sort(function(x,z){ return z.surpAbs-x.surpAbs; }).forEach(function(r,i){ r.od=i; });
  rows.sort(function(x,z){ return (x.stmt-z.stmt) || (x.od-z.od); });   // top-to-bottom down the statement, EPS last
  var tiles=rows.map(function(r){
    var m=r.m, c=r.c, a=r.a, uexp=r.uexp, cV=r.cV, uV=r.uV;
    var sp=function(s){ return (s==null)?'':' <span class="ce-fz-sp">'+(s>=0?'+':'−')+(Math.round(Math.abs(s)*10)/10)+'%</span>'; };
    var surpFmt=function(s){ return (s==null)?'—':((s>=0?'+':'−')+(Math.round(Math.abs(s)*10)/10)+'%'); };
    var actStr=(a==null?'—':ceTkFmt(m.u,a));
    // Margins — each margin line ÷ its OWN base (CE_MARGIN_DEN): Street-implied, Summit-implied, realised.
    var denK=CE_MARGIN_DEN[m.k], mgnOn=!!denK, den=mgnOn?denVals(denK):null;
    var mReal=(mgnOn&&den)?ceMarginPct(a,den.a):null;
    var mExpC=(mgnOn&&den)?ceMarginPct(c,den.c):null, mExpU=(mgnOn&&den)?ceMarginPct(uexp,den.s):null;
    var mPY=(mgnOn&&den&&r.py!=null)?ceMarginPct(r.py,den.qy):null;
    var mPQ=(mgnOn&&den&&r.pq!=null)?ceMarginPct(r.pq,den.qq):null;
    var hasMgn=(mgnOn&&mReal!=null);
    // Both-mode verdict chip: "BEAT ×2" when Street & Summit agree, "MIXED" (amber) when they disagree in
    // direction; falls back to the single available verdict. Single view keeps the plain top-right badge.
    var cK=cV.k, uK=uV.k, cHas=(cK==='beat'||cK==='miss'||cK==='inline'), uHas=(uK==='beat'||uK==='miss'||uK==='inline');
    var mixed=(cHas&&uHas&&cK!==uK);
    var bothV=(cHas&&uHas)?((cK===uK)?{l:cV.l+' ×2',c:cV.c}:{l:'MIXED',c:AMBER}):(cHas?{l:cV.l,c:cV.c}:(uHas?{l:uV.l,c:uV.c}:{l:'—',c:'#6b7684'}));
    var hdr='<div class="ce-fz-k"><span class="ce-fz-kn">'+esc(m.k)+'</span>'+
      '<span class="ce-fz-vd ce-vd-cons" style="color:'+cV.c+'">'+cV.l+sp(r.cSurp)+'</span>'+
      '<span class="ce-fz-vd ce-vd-us" style="color:'+uV.c+'">'+uV.l+sp(r.uSurp)+'</span>'+
      '<span class="ce-fz-vd ce-vd-both" style="color:'+bothV.c+'">'+bothV.l+'</span></div>';
    function gcell(v){ return '<span class="ce-gy">'+ceGwSpan(v,r.py)+'</span><span class="ce-gq">'+ceGwSpan(v,r.pq)+'</span>'; }
    // The table — columns Street | Summit | Actual, ONE header each (no per-cell labels). In single view
    // the inactive estimate column is hidden (CSS); in Both all three show. Rows: value · growth · margin
    // · surprise (surprise only in Both). data-vdc/data-vdu carry both verdicts for the CSS filter.
    var tbl='<div class="ce-fz-tbl">'+
      '<span class="ce-fz-rl"></span>'+
      '<span class="ce-fz-ch ce-col-cons">Street</span>'+
      '<span class="ce-fz-ch ce-col-us">Summit</span>'+
      '<span class="ce-fz-ch ce-col-act">Actual</span>'+
      '<span class="ce-fz-rl"></span>'+
      '<span class="ce-fz-cv ce-fz-exp ce-col-cons">'+(c==null?'—':ceTkFmt(m.u,c))+'</span>'+
      '<span class="ce-fz-cv ce-fz-exp ce-col-us">'+(uexp==null?'—':ceTkFmt(m.u,uexp))+'</span>'+
      '<span class="ce-fz-cv ce-fz-act ce-col-act">'+actStr+'</span>'+
      '<span class="ce-fz-rl ce-fz-gc">Growth</span>'+
      '<span class="ce-fz-cv ce-fz-gc ce-col-cons">'+gcell(c)+'</span>'+
      '<span class="ce-fz-cv ce-fz-gc ce-col-us">'+gcell(uexp)+'</span>'+
      '<span class="ce-fz-cv ce-fz-gc ce-col-act">'+gcell(a)+'</span>'+
      (hasMgn?('<span class="ce-fz-rl ce-fz-mc">Margin</span>'+
        '<span class="ce-fz-cv ce-fz-mc ce-col-cons">'+(mExpC!=null?mExpC+'%':'—')+'</span>'+
        '<span class="ce-fz-cv ce-fz-mc ce-col-us">'+(mExpU!=null?mExpU+'%':'—')+'</span>'+
        '<span class="ce-fz-cv ce-fz-mc ce-col-act"><span class="ce-gy">'+ceMgExpSpan(mReal,mPY)+'</span><span class="ce-gq">'+ceMgExpSpan(mReal,mPQ)+'</span></span>'):'')+
      '<span class="ce-fz-rl ce-fz-surp">Surprise</span>'+
      '<span class="ce-fz-cv ce-fz-surp ce-col-cons" style="color:'+cV.c+';font-weight:800">'+surpFmt(r.cSurp)+' '+cV.l+'</span>'+
      '<span class="ce-fz-cv ce-fz-surp ce-col-us" style="color:'+uV.c+';font-weight:800">'+surpFmt(r.uSurp)+' '+uV.l+'</span>'+
      '<span class="ce-fz-cv ce-fz-surp ce-col-act"></span>'+
    '</div>';
    return '<div class="ce-fz-t" data-vdc="'+cV.k+'" data-vdu="'+uV.k+'" data-cat="'+ceCat(m.k)+'" data-mixed="'+(mixed?1:0)+'" style="--od:'+r.od+'">'+hdr+tbl+'</div>';
  });
  return '<div class="ce-fz" data-g="yoy" data-ev="cons" data-mm="on" data-view="cards" data-ord="stmt" data-fzcat="all"><div class="ce-fz-h">The print — down the income statement'+
    ceQ('fz-'+ceQkey(qLabel),'How this is built',
      '<p>One block, archive-driven. Every number and surprise is computed from <code>BBG_CONSENSUS.txt</code>: the last snapshot before the print carries the consensus (<code>fq+1</code>), a later snapshot carries the print (<code>fq0</code>). Reconstructed from data, so it cannot drift.</p>'+
      '<ul><li><b>Order</b> — by default the lines read top-to-bottom down the income statement (top line → sales by segment → margins → profit by segment → cash &amp; shares → EPS last). <b>By surprise</b> re-sorts to the biggest |Street surprise| first.</li>'+
      '<li><b>vs Street ⇄ vs Summit ⇄ Both</b> — which frozen expectation the print is scored against (Street = Bloomberg, Summit = ours). <b>Both</b> shows the two side by side; since one BEAT/MISS badge can\'t score two references it becomes a <b>Surprise</b> row (Both only) plus a <b>MIXED</b> flag when Street and Summit disagree. Where Summit had no number it reads <b>—</b> (only Revenue, Operating income and the segment net-sales are modelled).</li>'+
      '<li><b>Growth</b> — the estimate\'s implied growth and the print\'s own growth, YoY or QoQ per the toggle, signed.</li>'+
      '<li><b>Margin</b> — GP / Operating income / EBITDA carry an expected (estimate-implied) and a realised margin; the realised one is coloured by expansion vs the prior period on the same YoY/QoQ lens.</li>'+
      '<li><b>Verdict</b> — beat / miss / in-line off the computed surprise; <b>no est.</b> where that basis had no number</li></ul>'+
      '<p>The cards are pure metrics. Notes, Watch-List context and call colour live in the Notes tab and the highlights below — not on the card. Lines the archive does not track are not shown here (a disclosure with no consensus is a supplemental call note, not a scored line).</p>')+
    // Fixed toggle order (Dani, Aug 2026): Cards/Chart · vs Street/Summit · All/Beats/Misses · order.
    // These four apply to BOTH views and must NEVER shift when switching Cards ⇄ Chart, so no auto-margin
    // and nothing collapses. Margin + YoY only change the cards, so they sit LAST and go visibility:hidden
    // (slot kept) in Chart via .ce-gseg-cardsonly — the four above stay put.
    '<span class="ce-gseg"><button type="button" class="active" data-fzview="cards">Cards</button>'+
      '<button type="button" data-fzview="chart">Chart</button></span>'+
    '<span class="ce-gseg"><button type="button" class="active" data-fzev="cons">vs Street</button>'+
      '<button type="button" data-fzev="us">vs Summit</button>'+
      '<button type="button" data-fzev="both">Both</button></span>'+
    '<span class="ce-vdf"><button type="button" class="active" data-vdf="all">All</button>'+
      '<button type="button" data-vdf="beat">Beats</button>'+
      '<button type="button" data-vdf="miss">Misses</button>'+
      '<button type="button" data-vdf="inline">In line</button></span>'+
    '<span class="ce-gseg"><button type="button" class="active" data-fzord="stmt">Statement order</button>'+
      '<button type="button" data-fzord="surp">By surprise</button></span>'+
    '<span class="ce-gseg ce-gseg-cardsonly"><button type="button" class="active" data-fzcat="all">All</button>'+
      '<button type="button" data-fzcat="top">Top line</button>'+
      '<button type="button" data-fzcat="bottom">Bottom line</button></span>'+
    '<span class="ce-gseg ce-gseg-cardsonly"><button type="button" class="active" data-fzmm="on">Margin</button>'+
      '<button type="button" data-fzmm="off">Hide mgn</button></span>'+
    '<span class="ce-gseg ce-gseg-cardsonly"><button type="button" class="active" data-ceg="yoy">YoY</button>'+
      '<button type="button" data-ceg="qoq">QoQ</button>'+
      '<button type="button" data-ceg="off">Off</button></span>'+
    '</div>'+cePrintChart(qi, us)+'<div class="ce-fz-g" data-vdf-host>'+tiles.join('')+'</div></div>';
}
function cePhaseStyle(){
  return '<style>'+
    '.ce-fz{border:1px solid var(--bdr);border-radius:12px;padding:12px 14px;margin-bottom:14px;background:#FBFCFE}'+
    '.ce-fz-h{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--mu);margin-bottom:9px}'+
    '.ce-fz-g{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}'+
    '@media(max-width:900px){.ce-fz-g{grid-template-columns:repeat(2,1fr)}}'+
    '@media(max-width:520px){.ce-fz-g{grid-template-columns:1fr}}'+
    '.ce-fz-t{border:1px solid var(--bdr);border-radius:9px;padding:7px 9px;background:#fff}'+
    '.ce-fz-t.basis{opacity:.62}'+
    '.ce-fz-k{font-size:10px;font-weight:800;color:var(--navy);line-height:1.25}'+
    '.ce-fz-kn{flex:1 1 auto;min-width:0}'+   /* full metric name, wraps — NEVER truncated (e.g. "…operating income") */
    /* the table layout — Street/Summit est. | Actual columns, with Growth / Margin rows below (Dani, Aug 2026) */
    '.ce-fz-tbl{display:grid;grid-template-columns:auto 1fr 1fr;gap:3px 8px;margin-top:6px;align-items:baseline;font-variant-numeric:tabular-nums}'+
    '.ce-fz-rl{font-size:8px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu);white-space:nowrap;align-self:center}'+
    '.ce-fz-ch{font-size:8px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--mu);text-align:right}'+
    '.ce-fz-cv{font-size:11px;font-weight:700;color:var(--navy);text-align:right}'+
    '.ce-fz-exp{color:var(--mu)}'+
    '.ce-fz-act{font-size:13px;font-weight:900;color:var(--navy)}'+
    '.ce-tv-e{color:var(--mu);font-weight:600}'+
    '.ce-fz-sp{font-weight:900;margin-left:3px;font-size:11.5px}'+
    /* ordering — statement order is DOM order (default); --od reflows to |surprise| desc on the toggle */
    '.ce-fz[data-ord="surp"] .ce-fz-t{order:var(--od)}'+
    '.ce-fz[data-ord="surp"] .ce-dv-row{order:var(--od)}'+
    /* Chart view — Margin + YoY/QoQ toggles do nothing to the chart, so hide them; visibility (not
       display) keeps their slot so the toggles shared by both views never shift on Cards ⇄ Chart. */
    '.ce-fz[data-view="chart"] .ce-gseg-cardsonly{visibility:hidden}'+
    /* ── The card is a compact detail table (columns Street | Summit | Actual) — no flip, no clean toggle ── */
    '.ce-fz-t:hover{box-shadow:0 4px 14px rgba(16,24,40,.10)}'+
    '.ce-fz-f{font-size:9.5px;color:var(--mu);margin-top:8px}'+'.ce-fz-t{position:relative;transition:.14s}'+'.ce-fz-t[data-detail]{cursor:pointer}'+'.ce-fz-t[data-detail]:hover{box-shadow:0 4px 14px rgba(16,24,40,.10);transform:translateY(-1px)}'+'.ce-fz-vd{margin-left:auto;font-size:10.5px;font-weight:900;letter-spacing:.04em;text-transform:uppercase}'+'.ce-fz-k{display:flex;align-items:flex-start;gap:5px;flex-wrap:wrap}'+'.ce-fz-wl{font-size:8px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:'+BLUE+';margin-top:5px}'+'.ce-fz-more{position:absolute;right:9px;bottom:7px;font-size:8.5px;font-weight:800;color:'+BLUE+'}'+'.ce-fz-h{display:flex;align-items:center;gap:6px}'+'.ce-fz-gr{display:flex;align-items:baseline;gap:5px;margin-top:3px;font-size:9.5px;font-weight:800}'+'.ce-fz-gl{font-size:8.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu)}'+'.ce-fz-mgn{display:flex;align-items:baseline;gap:5px;margin-top:3px;font-size:11px;font-weight:900;color:'+PURPLE+'}'+'.ce-fz-mexp{font-size:9px;font-weight:700;color:var(--mu)}'+'.ce-fz-g-e{color:var(--mu);font-weight:600}'+'.ce-fz .ce-gq{display:none}.ce-fz[data-g="qoq"] .ce-gy{display:none}.ce-fz[data-g="qoq"] .ce-gq{display:inline}.ce-fz[data-g="off"] .ce-fz-gc{display:none}'+
    /* estimate view (vs Street ⇄ vs Summit) — pure-CSS swap of expected value, surprise & verdict */
    '.ce-fz-h{flex-wrap:wrap}'+
    '.ce-vd-us,.ce-exp-us{display:none}'+
    '.ce-fz[data-ev="us"] .ce-vd-cons,.ce-fz[data-ev="us"] .ce-exp-cons{display:none}'+
    '.ce-fz[data-ev="us"] .ce-vd-us,.ce-fz[data-ev="us"] .ce-exp-us{display:inline}'+
    /* margin row (GP / Operating income / EBITDA) — 3 grid cells, hidden until the Margin toggle is on.
       Actual margin is coloured by expansion vs the prior period on the YoY/QoQ lens (inline styles). */
    '.ce-fz-mc{display:none}'+
    '.ce-fz[data-mm="on"] .ce-fz-mc{display:block}'+
    /* Both mode — the single verdict badge gives way to the Both chip; the Surprise row and the Summit
       column appear. Column-hide uses .ce-fz-tbl in the selector (specificity 0,4,0) so it beats the
       margin/surprise show rules; the grid widens to Street+Summit+Actual. MIXED cards get an amber outline. */
    '.ce-vd-both{display:none}'+
    '.ce-fz[data-ev="both"] .ce-vd-cons,.ce-fz[data-ev="both"] .ce-vd-us{display:none}'+
    '.ce-fz[data-ev="both"] .ce-vd-both{display:inline}'+
    '.ce-fz[data-ev="cons"] .ce-fz-tbl .ce-col-us{display:none}'+
    '.ce-fz[data-ev="us"] .ce-fz-tbl .ce-col-cons{display:none}'+
    '.ce-fz[data-ev="both"] .ce-fz-tbl{grid-template-columns:auto 1fr 1fr 1fr}'+
    '.ce-fz-surp{display:none}'+
    '.ce-fz[data-ev="both"] .ce-fz-surp{display:block}'+
    '.ce-fz[data-ev="both"] .ce-fz-t[data-mixed="1"]{outline:1.5px solid '+AMBER+';outline-offset:-1px}'+
    '.ce-fz[data-ev="both"] .ce-vdf{visibility:hidden}'+
    /* category filter — All / Top line / Bottom line (cards) */
    '.ce-fz[data-fzcat="top"] .ce-fz-t:not([data-cat="top"]){display:none}'+
    '.ce-fz[data-fzcat="bottom"] .ce-fz-t:not([data-cat="bottom"]){display:none}'+
    /* folds — secondary depth, closed by default */
    '.ce-fold{border:1px solid var(--bdr);border-radius:11px;margin:0 0 10px;overflow:hidden;background:#fff}'+
    '.ce-fold .ov-collap-h{display:flex;align-items:center;gap:8px;width:100%;text-align:left;border:0;background:#FAFBFD;'+
      'padding:9px 13px;cursor:pointer;font-family:inherit}'+
    '.ce-fold .ov-collap-h:hover{background:#F2F6FB}'+
    '.ce-fold .ov-collap-ic{font-size:10px;color:var(--mu)}'+
    '.ce-fold-t{font-size:11px;font-weight:800;color:var(--navy)}'+
    '.ce-fold-s{font-size:10px;color:var(--mu);font-weight:600;margin-left:auto;text-align:right}'+
    '.ce-fold .ov-collap-b{padding:12px 13px}'+
    /* the print, as cards rather than full-width rows */
    '.ce-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}'+
    '@media(max-width:760px){.ce-cards{grid-template-columns:1fr}}'+
    '.ce-card{border:1px solid var(--bdr);border-left:4px solid var(--sc,#9AA4B0);border-radius:10px;padding:9px 11px;background:#fff}'+
    '.ce-card-h{display:flex;align-items:center;gap:6px;flex-wrap:wrap}'+
    '.ce-card-m{font-size:11.5px;font-weight:800;color:var(--navy)}'+
    '.ce-card-v{font-size:9px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--sc);margin-left:auto}'+
    '.ce-card-b{display:grid;grid-template-columns:auto 1fr;gap:2px 8px;margin-top:6px;font-size:10.5px;line-height:1.45}'+
    '.ce-card-l{color:var(--mu);font-weight:700;white-space:nowrap}'+
    '.ce-card-x{color:var(--navy)}'+
    '.ce-card-f{display:flex;align-items:center;gap:6px;margin-top:7px}'+
    '.ce-chip{font-size:8.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:2px 7px;border-radius:999px}'+
    '.ce-chip.list{background:rgba(26,115,232,.12);color:'+BLUE+'}'+
    '.ce-chip.hi{background:rgba(234,67,53,.12);color:'+RED+'}'+
    '.ce-chip.md{background:rgba(251,188,5,.18);color:#7A5B02}'+
    '.ce-chip.lo{background:#EEF1F5;color:var(--mu)}'+
    /* "Also on the call" — one box, a plain list, each point a native <details> dropdown (v2.9) */
    '.ce-alsobox{margin-top:18px;border:1px solid var(--bdr);border-radius:12px;background:#fff;overflow:hidden}'+
    '.ce-alsobox>summary.ce-alsobox-h{list-style:none;cursor:pointer;display:flex;align-items:center;gap:10px;padding:11px 13px;background:#F6F8FA}'+
    '.ce-alsobox>summary::-webkit-details-marker{display:none}'+
    '.ce-alsobox>summary.ce-alsobox-h:hover{background:#F0F4F8}'+
    '.ce-alsobox[open]>summary.ce-alsobox-h{border-bottom:1px solid var(--bdr)}'+
    '.ce-alsobox-ic{font-size:11px;color:var(--mu);transition:transform .15s;flex:none}'+
    '.ce-alsobox[open] .ce-alsobox-ic{transform:rotate(90deg)}'+
    '.ce-alsobox-htext{display:flex;flex-direction:column;gap:2px;min-width:0}'+
    '.ce-alsobox-htext>b{font-size:12px;color:var(--navy);font-weight:800}'+
    '.ce-alsobox-n{margin-left:auto;font-size:9px;font-weight:900;color:var(--mu);background:#fff;border:1px solid var(--bdr);border-radius:999px;padding:2px 9px;flex:none}'+
    '.ce-alsobox-sub{font-size:9.5px;color:var(--mu);font-weight:600;line-height:1.4}'+
    '.ce-alsolist{display:flex;flex-direction:column}'+
    '.ce-also-i{border-bottom:1px solid var(--bdr)}'+'.ce-also-i:last-child{border-bottom:0}'+
    '.ce-also-s{display:flex;align-items:center;gap:8px;padding:9px 13px;cursor:pointer;list-style:none;font-size:11.5px;font-weight:600;color:var(--navy);line-height:1.45}'+
    '.ce-also-s::-webkit-details-marker{display:none}'+
    '.ce-also-s:hover{background:#FAFBFD}'+
    '.ce-also-tag{font-size:8px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--tc,#6b7684);border:1px solid currentColor;border-radius:999px;padding:1px 7px;flex:none;opacity:.85}'+
    '.ce-also-hd{flex:1;min-width:0}'+
    '.ce-also-ar{margin-left:auto;color:var(--mu);font-size:10px;transition:transform .15s;flex:none}'+
    '.ce-also-i[open] .ce-also-ar{transform:rotate(180deg)}'+
    '.ce-also-body{padding:0 13px 12px 13px;font-size:10.5px;font-weight:500;color:var(--navy);line-height:1.55;background:#FBFCFE}'+
    '.ce-also-body p{margin:6px 0}'+
    /* (AI call-summary styles removed with the section, Dani Aug 2026) */
    /* glossary term — dashed underline, attractive hover tooltip (CSS-only, no pop-up) */
    '.ce-gl{border-bottom:1px dashed '+BLUE+';cursor:help;position:relative}'+
    '.ce-gl:hover::after{content:attr(data-def);position:absolute;left:0;bottom:calc(100% + 8px);width:min(300px,74vw);white-space:normal;text-align:left;background:#10141A;color:#fff;font-size:10.5px;font-weight:500;line-height:1.55;padding:9px 12px;border-radius:9px;box-shadow:0 10px 28px rgba(16,24,40,.28);z-index:60}'+
    '.ce-gl:hover::before{content:"";position:absolute;left:16px;bottom:calc(100% + 3px);border:5px solid transparent;border-top-color:#10141A;z-index:61}'+
    /* highlights, as cards */
    '.ce-hcards{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}'+
    '@media(max-width:760px){.ce-hcards{grid-template-columns:1fr}}'+
    '.ce-hcard{border:1px solid var(--bdr);border-top:3px solid var(--hc,#9AA4B0);border-radius:10px;padding:9px 11px;background:#fff;cursor:pointer;transition:.14s}'+
    '.ce-hcard:hover{box-shadow:0 4px 14px rgba(16,24,40,.09);transform:translateY(-1px)}'+
    '.ce-hcard-t{font-size:8.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--hc)}'+
    '.ce-hcard-h{font-size:11px;color:var(--navy);line-height:1.5;margin-top:3px}'+
    '.ce-hcard-f{display:flex;align-items:center;gap:6px;margin-top:6px}'+
    '.ce-hcard-more{font-size:9.5px;font-weight:800;color:'+BLUE+';margin-left:auto}'+
    '.ce-bandh{display:flex;align-items:center;gap:7px;margin:12px 0 7px}'+
    '.ce-bandh-i{font-size:12px;color:var(--bc)}'+
    '.ce-bandh-t{font-size:10.5px;font-weight:900;text-transform:uppercase;letter-spacing:.05em;color:var(--bc)}'+
    '.ce-bandh-s{font-size:9.5px;color:var(--mu);font-weight:600}'+
    /* thesis red-lines — verdict word, plain line, depth behind "why" */
    '.ce-rl{display:flex;flex-direction:column;gap:5px}'+
    '.ce-rl-row{display:grid;grid-template-columns:74px 1fr auto;gap:10px;align-items:center;'+
      'border:1px solid var(--bdr);border-left:4px solid #0a8f4c;border-radius:9px;padding:8px 12px;background:#fff}'+
    '.ce-rl-row.trip{border-left-color:'+RED+';background:rgba(234,67,53,.035)}'+
    '.ce-rl-v{font-size:9.5px;font-weight:900;letter-spacing:.06em;color:#0a8f4c}'+
    '.ce-rl-row.trip .ce-rl-v{color:'+RED+'}'+
    '.ce-rl-l{font-size:11.5px;font-weight:700;color:var(--navy);line-height:1.4}'+
    '.ce-rl-w{font-size:9.5px;font-weight:800;color:'+BLUE+';white-space:nowrap;cursor:pointer}'+
    '@media(max-width:600px){.ce-rl-row{grid-template-columns:64px 1fr}.ce-rl-w{display:none}}'+
    /* what this tees up — short boxes, always visible */
    '.ce-tee{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px}'+
    '.ce-tee-c{border:1px solid var(--bdr);border-top:3px solid '+AMBER+';border-radius:10px;'+
      'padding:9px 11px;background:#fff;cursor:pointer;transition:.14s}'+
    '.ce-tee-c:hover{box-shadow:0 4px 14px rgba(16,24,40,.09);transform:translateY(-1px)}'+
    '.ce-tee-h{font-size:11.5px;color:var(--navy);line-height:1.45;font-weight:600}'+
    '.ce-tee-m{font-size:9.5px;font-weight:800;color:'+BLUE+';margin-top:6px}'+
    /* the triage strip — three bands, always all three, colour is the meaning */
    '.ce-tri{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0 10px}'+
    '@media(max-width:700px){.ce-tri{grid-template-columns:1fr}}'+
    '.ce-tri-b{display:grid;grid-template-columns:auto auto 1fr;grid-template-areas:"i t n" "s s s";'+
      'gap:2px 7px;align-items:center;text-align:left;border:1px solid var(--bdr);border-top:3px solid var(--bc);'+
      'border-radius:10px;padding:8px 11px;background:#fff;font:inherit;cursor:pointer;transition:.14s;opacity:.45}'+
    '.ce-tri-b.active{opacity:1;box-shadow:0 2px 10px rgba(16,24,40,.07)}'+
    '.ce-tri-b:hover{border-color:var(--bc)}'+
    '.ce-tri-i{grid-area:i;font-size:12px;color:var(--bc);line-height:1}'+
    '.ce-tri-t{grid-area:t;font-size:10.5px;font-weight:900;text-transform:uppercase;letter-spacing:.04em;color:var(--bc)}'+
    '.ce-tri-n{grid-area:n;justify-self:end;font-size:11px;font-weight:900;color:var(--navy)}'+
    '.ce-tri-s{grid-area:s;font-size:9.5px;color:var(--mu);font-weight:600}'+
    '.ce-hcard-b{margin-right:5px;color:var(--hc)}'+
    '.ce-hcard[hidden]{display:none}'+
    '.ce-bandh-n{margin-left:auto;font-size:9.5px;font-weight:800;color:var(--mu)}'+
    /* ② points for the call — merged red-lines + tee-ups, one strip */
    '.ce-pts{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px}'+
    '.ce-pt{position:relative;border:1px solid var(--bdr);border-top:3px solid var(--pc,#9AA4B0);'+
      'border-radius:10px;padding:9px 11px 22px;background:#fff;transition:.14s}'+
    '.ce-pt[data-detail]{cursor:pointer}'+
    '.ce-pt[data-detail]:hover{box-shadow:0 4px 14px rgba(16,24,40,.09);transform:translateY(-1px)}'+
    '.ce-pt.held{--pc:#0a8f4c}'+
    '.ce-pt.trip{--pc:'+RED+';background:rgba(234,67,53,.035)}'+
    '.ce-pt.tee{--pc:'+AMBER+'}'+
    '.ce-pt-top{margin-bottom:5px}'+
    '.ce-pt-chip{font-size:8px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;'+
      'padding:2px 7px;border-radius:999px;color:#fff;background:var(--pc)}'+
    '.ce-pt-chip.tee{background:'+AMBER+';color:#5A4300}'+
    '.ce-pt-h{font-size:11.5px;color:var(--navy);line-height:1.45;font-weight:600}'+
    '.ce-pt-more{position:absolute;left:11px;bottom:7px;font-size:9px;font-weight:800;color:'+BLUE+'}'+
    /* ③ the call, classified — Prepared Remarks ⇄ Q&A toggle */
    '.ce-cc{margin-top:16px;border:1px solid var(--bdr);border-radius:12px;background:#fff;overflow:hidden}'+
    /* collapsed-by-default dropdown wrappers — The call classified and Propose Notes are separate cards */
    '.ce-cc-wrap,.ce-tp-wrap{margin-top:14px;border:1px solid var(--bdr);border-radius:12px;background:#fff;overflow:hidden}'+
    /* tinted header so the dropdown bar never reads as one of the white Prepared-Remarks / Q&A cards below */
    '.ce-cc-sum,.ce-tp-sum{list-style:none;cursor:pointer;display:flex;align-items:center;gap:9px;padding:12px 14px;user-select:none;background:linear-gradient(180deg,#E8EEF6,#F1F5FA);border-bottom:1px solid var(--bdr)}'+
    '.ce-cc-wrap:not([open])>.ce-cc-sum,.ce-tp-wrap:not([open])>.ce-tp-sum{border-bottom:0}'+
    '.ce-cc-sum:hover,.ce-tp-sum:hover{background:linear-gradient(180deg,#DFE7F2,#E9EFF7)}'+
    '.ce-cc-sum::-webkit-details-marker,.ce-tp-sum::-webkit-details-marker{display:none}'+
    '.ce-cc-sum-t,.ce-tp-sum-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.ce-cc-sum-s,.ce-tp-sum-s{font-size:10px;font-weight:600;color:var(--mu);flex:1}'+
    '.ce-cc-ar2{font-size:10px;color:var(--mu);transition:transform .18s;flex:none}'+
    'details[open]>.ce-cc-sum .ce-cc-ar2,details[open]>.ce-tp-sum .ce-cc-ar2{transform:rotate(180deg)}'+
    '.ce-cc-wrap>.ce-cc{margin:0;border:0;border-radius:0;border-top:1px solid var(--bdr)}'+
    '.ce-tp-wrap>.ce-tp{border-top:1px solid var(--bdr)}'+
    '.ce-cc-h{display:flex;align-items:center;gap:9px;flex-wrap:wrap;padding:10px 13px;background:#F6F8FA;border-bottom:1px solid var(--bdr)}'+
    '.ce-cc-h>b{font-size:12px;color:var(--navy)}'+
    '.ce-cc-ph{font-size:8.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--mu);border:1px dashed var(--bdr);border-radius:999px;padding:2px 8px}'+
    '.ce-cc-seg{margin-left:auto;display:inline-flex;gap:3px;background:rgba(66,133,244,.08);border:1px solid var(--bdr);border-radius:9px;padding:3px}'+
    '.ce-cc-seg button{background:none;border:0;font-family:inherit;font-size:10px;font-weight:800;letter-spacing:.03em;color:var(--mu);padding:5px 11px;border-radius:6px;cursor:pointer;transition:.14s}'+
    '.ce-cc-seg button:hover{color:var(--navy)}'+
    '.ce-cc-seg button.active{background:'+BRAND+';color:#fff}'+
    '.ce-cc-pane{display:flex;flex-direction:column}'+
    '.ce-cc-pane[hidden]{display:none}'+
    '.ce-cc-row{border-bottom:1px solid var(--bdr)}'+
    '.ce-cc-row:last-child{border-bottom:0}'+
    '.ce-cc-row-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 13px;cursor:pointer;list-style:none}'+
    '.ce-cc-row-h::-webkit-details-marker{display:none}'+
    '.ce-cc-row-h:hover{background:#FAFBFD}'+
    '.ce-cc-ar{margin-left:auto;color:var(--mu);font-size:10px;transition:transform .15s;flex:none}'+
    '.ce-cc-row[open]>.ce-cc-row-h .ce-cc-ar{transform:rotate(180deg)}'+
    '.ce-cc-topic{font-size:11.5px;font-weight:700;color:var(--navy);line-height:1.45}'+
    '.ce-cc-tag{font-size:8.5px;font-weight:800;letter-spacing:.03em;color:'+BLUE+';background:rgba(26,115,232,.10);border-radius:999px;padding:2px 8px;white-space:nowrap}'+
    '.ce-cc-meta{font-size:9.5px;font-weight:700;color:var(--mu);margin-bottom:4px}'+
    '.ce-cc-row-b{font-size:10.5px;color:var(--navy);line-height:1.55;padding:0 13px 11px;font-weight:500;background:#FBFCFE}'+
    '.ce-cc-a-l{display:inline-block;font-size:8px;font-weight:900;color:#fff;background:var(--mu);border-radius:4px;padding:1px 5px;margin-right:6px;vertical-align:middle}'+
    '.ce-cc-empty{padding:16px 14px;font-size:10.5px;color:var(--mu);font-weight:600;line-height:1.5;text-align:center;background:#FBFCFE}'+
    /* By Analyst Question — bank leads, analyst beside it; Q and A BOTH always visible */
    '.ce-cc-qa{padding:11px 13px;border-bottom:1px solid var(--bdr)}'+
    '.ce-cc-qa:last-child{border-bottom:0}'+
    '.ce-cc-qa-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px}'+
    '.ce-cc-bank{font-size:11px;font-weight:900;color:var(--navy);letter-spacing:.01em}'+
    '.ce-cc-analyst{font-size:10px;font-weight:600;color:var(--mu)}'+
    '.ce-cc-q,.ce-cc-a{display:grid;grid-template-columns:16px 1fr;gap:8px;font-size:11px;line-height:1.55;margin-top:4px;color:var(--navy)}'+
    '.ce-cc-q{font-weight:600}.ce-cc-a{font-weight:500}'+
    '.ce-cc-ql,.ce-cc-al{font-size:8px;font-weight:900;color:#fff;border-radius:4px;width:15px;height:15px;display:flex;align-items:center;justify-content:center;margin-top:2px}'+
    '.ce-cc-ql{background:'+BLUE+'}.ce-cc-al{background:#0a8f4c}'+
    /* ③b Propose Notes — Theme ▸ Sub-theme filing, target line, existing/NEW badges */
    '.ce-tp{border-top:1px solid var(--bdr);background:#FCFCFF;padding:12px 13px}'+
    '.ce-tp-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px}'+
    '.ce-tp-ic{font-size:13px}.ce-tp-h>b{font-size:11.5px;color:var(--navy)}'+
    '.ce-tp-refresh{font-family:inherit;font-size:9px;font-weight:800;color:'+BLUE+';border:1px solid var(--bdr);border-radius:999px;padding:3px 9px;cursor:pointer;background:#fff;transition:.12s}'+
    '.ce-tp-refresh:hover{border-color:'+BLUE+';background:rgba(26,115,232,.06)}'+
    '.ce-tp-subtitle{font-size:9.5px;color:var(--mu);font-weight:600;flex-basis:100%;line-height:1.4}'+
    '.ce-tp-list{display:flex;flex-direction:column;gap:7px}'+
    '.ce-tp-card{border:1px solid var(--bdr);border-left:3px solid '+PURPLE+';border-radius:9px;padding:8px 9px;background:#fff}'+
    '.ce-tp-row1{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px}'+
    '.ce-tp-fld{display:flex;align-items:center;gap:5px;min-width:0}'+
    '.ce-tp-lb{font-size:8.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--mu);flex:none}'+
    '.ce-tp-seg,.ce-tp-sub{min-width:0;max-width:210px;font-family:inherit;font-size:10px;font-weight:700;color:'+BLUE+';border:1px solid var(--bdr);border-radius:6px;padding:4px 6px;background:#F7F9FC;cursor:pointer}'+
    '.ce-tp-seg:focus,.ce-tp-sub:focus{outline:none;border-color:'+BLUE+'}'+
    '.ce-tp-newsub,.ce-tp-newseg{display:block;width:100%;box-sizing:border-box;font-family:inherit;font-size:10.5px;font-weight:600;color:var(--navy);border:1px solid '+AMBER+';border-radius:6px;padding:5px 8px;background:#FFFDF7;margin-bottom:6px}'+
    '.ce-tp-newsub[hidden],.ce-tp-newseg[hidden]{display:none}'+
    '.ce-tp-target{font-size:9.5px;font-weight:700;color:var(--navy);margin-bottom:6px;display:flex;align-items:center;gap:5px;flex-wrap:wrap}'+
    '.ce-tp-arrow{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--mu)}'+
    '.ce-tp-sep{color:var(--mu)}'+
    '.ce-tp-badge{font-size:8px;font-weight:900;letter-spacing:.04em;text-transform:uppercase;color:#0a6b3a;background:rgba(10,143,76,.12);border-radius:999px;padding:2px 7px}'+
    '.ce-tp-badge.new{color:#7A5B02;background:rgba(251,188,5,.22)}'+
    '.ce-tp-chip-new{font-size:7.5px;font-weight:900;letter-spacing:.04em;color:#7A5B02;background:rgba(251,188,5,.22);border-radius:999px;padding:1px 6px;flex:none;margin-top:1px}'+
    '.ce-tp-acts{display:flex;gap:5px;flex:none}'+
    '.ce-tp-ok,.ce-tp-no{font-family:inherit;font-size:9.5px;font-weight:800;border:1px solid var(--bdr);border-radius:999px;padding:4px 9px;cursor:pointer;background:#fff;transition:.12s}'+
    '.ce-tp-ok{color:#0a8f4c}.ce-tp-ok:hover{border-color:#0a8f4c;background:rgba(10,143,76,.06)}'+
    '.ce-tp-no{color:'+RED+'}.ce-tp-no:hover{border-color:'+RED+';background:rgba(234,67,53,.06)}'+
    '.ce-tp-in{display:block;width:100%;box-sizing:border-box;resize:vertical;font-family:inherit;font-size:11px;font-weight:500;line-height:1.5;color:var(--navy);border:1px solid var(--bdr);border-radius:6px;padding:6px 8px;background:#FAFBFD}'+
    '.ce-tp-in:focus{outline:none;border-color:'+BLUE+';background:#fff}'+
    '.ce-tp-staged-h{font-size:9px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--mu);margin:14px 0 7px;display:flex;align-items:center;gap:7px}'+
    '.ce-tp-count{font-size:9px;font-weight:900;color:'+BLUE+';background:rgba(26,115,232,.10);border-radius:999px;padding:1px 8px}'+
    '.ce-tp-pub{font-family:inherit;font-size:9px;font-weight:900;letter-spacing:.03em;text-transform:uppercase;color:#fff;background:'+BLUE+';border:0;border-radius:999px;padding:3px 10px;cursor:pointer;transition:.14s}'+
    '.ce-tp-pub:hover{filter:brightness(1.08)}.ce-tp-pub:disabled{opacity:.5;cursor:default}'+
    '.ce-tp-status{font-size:9px;font-weight:700;letter-spacing:0;text-transform:none;color:var(--mu)}'+
    '.ce-tp-chip.published{border-left-color:'+BLUE+';opacity:.72}'+
    '.ce-tp-chip.published .ce-tp-chip-tag::after{content:" · in Notes";color:'+BLUE+';font-weight:800}'+
    '.ce-tp-chip.dup{border-left-color:'+RED+';opacity:.72}'+
    '.ce-tp-chip.dup .ce-tp-chip-tag::after{content:" · already filed";color:'+RED+';font-weight:800}'+
    '.ce-tp-staged{display:flex;flex-direction:column;gap:6px}'+
    '.ce-tp-empty{font-size:10px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.ce-tp-chip{display:flex;align-items:flex-start;gap:8px;font-size:10.5px;font-weight:500;color:var(--navy);line-height:1.5;background:#fff;border:1px solid var(--bdr);border-left:3px solid #0a8f4c;border-radius:9px;padding:7px 9px}'+
    '.ce-tp-chip-tag{font-size:8.5px;font-weight:800;color:'+BLUE+';background:rgba(26,115,232,.10);border-radius:999px;padding:2px 8px;flex:none;margin-top:1px;line-height:1.35}'+
    '.ce-tp-chip-t{flex:1;min-width:0}'+
    '.ce-tp-unstage{font-family:inherit;font-size:9px;font-weight:900;color:var(--mu);border:0;background:none;cursor:pointer;line-height:1;padding:2px 3px;border-radius:50%;flex:none}'+
    '.ce-tp-unstage:hover{color:'+RED+';background:rgba(234,67,53,.10)}'+
    '.ce-tp-foot{font-size:9px;color:var(--mu);font-weight:600;line-height:1.45;margin-top:11px;padding-top:9px;border-top:1px dashed var(--bdr)}'+
    /* the print at a glance — diverging surprise chart, one normalized % axis, data-ev toggle-aware */
    '.ce-dv{margin:2px 0 4px}'+
    '.ce-dv-cap{font-size:9.5px;color:var(--mu);font-weight:600;margin-bottom:11px;line-height:1.45}'+
    '.ce-dv-rows{display:flex;flex-direction:column;gap:8px}'+
    '.ce-dv-row{position:relative;display:grid;grid-template-columns:148px 1fr 52px;gap:10px;align-items:center}'+
    /* full-row hover tooltip — the bars themselves are too thin to point at, so the whole row is the target */
    '.ce-dv-row:hover{background:rgba(148,163,184,.07);border-radius:6px}'+
    '.ce-dv-tip{display:none;position:absolute;left:50%;bottom:calc(100% + 7px);transform:translateX(-50%);z-index:30;background:#fff;border:1px solid var(--bdr);'+
      'border-radius:10px;box-shadow:0 10px 26px rgba(15,23,42,.22);padding:9px 11px;min-width:236px;max-width:340px;pointer-events:none}'+
    '.ce-dv-row:hover .ce-dv-tip{display:block}'+
    '.ce-dv-tip::after{content:"";position:absolute;left:50%;top:100%;transform:translateX(-50%);border:6px solid transparent;border-top-color:#fff}'+
    '.ce-dv-tip-h{font-size:10.5px;font-weight:800;color:var(--navy);margin-bottom:6px}'+
    '.ce-dv-tip-l{display:flex;align-items:center;gap:8px;font-size:10px;font-weight:600;color:var(--navy);margin-top:4px;white-space:nowrap}'+
    '.ce-dv-tip-b{font-size:8px;font-weight:900;letter-spacing:.04em;padding:2px 7px;border-radius:999px;flex:none}'+
    '.ce-dv-tip-b.ce-exp-cons{color:'+BLUE+';background:rgba(37,87,214,.11)}'+
    '.ce-dv-tip-b.ce-exp-us{color:'+PURPLE+';background:rgba(122,90,248,.12)}'+
    '.ce-dv-tip-x{flex:1;color:var(--mu);font-weight:600}.ce-dv-tip-x b{color:var(--navy);font-weight:800}'+
    '.ce-dv-tip-p{font-weight:900;font-variant-numeric:tabular-nums;flex:none}'+
    '@media(max-width:560px){.ce-dv-row{grid-template-columns:104px 1fr 46px}}'+
    '.ce-dv-k{font-size:9.5px;font-weight:700;color:var(--navy);text-align:right;line-height:1.2}'+   /* wraps — full name, never truncated */
    '.ce-dv-track{position:relative;height:15px}'+
    '.ce-dv-zero{position:absolute;left:50%;top:-1px;bottom:-1px;width:1px;background:var(--bdr)}'+
    '.ce-dv-bar{position:absolute;top:50%;transform:translateY(-50%);height:11px;border-radius:3px;min-width:2px;max-width:50%}'+
    '.ce-dv-bar.pos{left:50%}.ce-dv-bar.neg{right:50%}'+
    '.ce-dv-bar.beat{background:#0a8f4c}.ce-dv-bar.miss{background:'+RED+'}.ce-dv-bar.inline{background:#9AA4B0}'+
    '.ce-dv-dot{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:7px;height:7px;border-radius:50%;border:1.5px solid #9AA4B0;background:#fff}'+
    '.ce-dv-vwrap{font-variant-numeric:tabular-nums}'+
    '.ce-dv-v{font-size:9.5px;font-weight:800}'+
    '.ce-dv-v.beat{color:#0a8f4c}.ce-dv-v.miss{color:'+RED+'}.ce-dv-v.inline,.ce-dv-v.none{color:var(--mu)}'+
    '.ce-dv-axis{display:flex;justify-content:space-between;margin-top:10px;padding:0 62px 0 158px;font-size:8.5px;font-weight:700;color:var(--mu)}'+
    '@media(max-width:560px){.ce-dv-axis{padding:0 56px 0 114px}}'+
    '.ce-fz[data-view="cards"] .ce-dv{display:none}'+
    '.ce-fz[data-view="chart"] .ce-fz-g{display:none}'+
    /* All/Beats/Misses now filters the chart too, so it STAYS visible in Chart (no display:none — that
       is what made the row collapse and the other toggles jump). */
  '</style>';
}
function ceResultsBody(c){
  var h=ceStyle()+cePhaseStyle();
  h+=CALL_EARNINGS.quarters.map(function(q,qi){
    var qk=ceQkey(q.q);
    var b='<div class="ce-qblock" data-ceq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="ce-phase" style="background:'+BRAND2+'">② Post-Results</div>';
    var r=q.results;
    if(!r){ b+='<p class="ov-lede"><b>'+esc(q.q)+' — the numbers vs. the frozen expectations.</b></p>'+
      '<div class="ce-note">Empty until the print lands.</div></div>'; return b; }
    // Lede removed (Aug 2026 restructure) — the phase chip already reads "② Post-Results" and the
    // print block leads. Below the print, three segmented sections: ① AI Summary · ② Points for the
    // call · ③ The call, classified. "Also on the call" is kept at the very bottom.
    // 1 · THE print — archive spine + hand-authored notes, ranked by surprise (one block now).
    // Pass the quarter's FROZEN Summit expectations (setup.us) so the print can be scored against
    // Street OR Summit via the vs-Street ⇄ vs-Summit toggle (§6a-iii).
    b+=cePrintBlock(q.q, r, (q.setup&&q.setup.us)||{});
    // The AI-generated "Call summary — the minute" was REMOVED (Dani, Aug 2026) — no AI-authored section.
    // ② "Points for the call" was REMOVED (Aug 2026) per Dani — the red-line/tee-up cards were noise.
    // 4 · ③ The call, classified — Prepared Remarks ⇄ Q&A toggle, each item tagged to a Watch List
    //     theme (Aug 2026). Scaffold: renders a placeholder until q.call.prepared / q.call.qanda fill.
    b+=ceCallClassified(q, qk);
    // 5 · "Also on the call" — the supplemental colour (was the Post-Call tab, dissolved Jul 2026).
    // Kept at the very BOTTOM for now. NOT the tracking layer (Watch List) nor the meeting-critical
    // read (the scorecard). Includes non-trackable call colour.
    b+=ceHighlightsBlock(q.call, qk, q.q);
    // (Foot caption "Numbers scored against the frozen expectation…" removed — Dani, Aug 2026.)
    b+='</div>';
    return b;
  }).join('');
  return h;
}
// Rows are COLLAPSED to a scannable line (topic/question + theme tag) — the detail opens on demand
// (Aug 2026, "temas más resumidos"). Each row is a native <details>; the summary is the takeaway,
// the body is the prose.
function ceCallClassified(q, qk){
  var cc=q.call||{};
  var pr=cc.prepared||[], qa=cc.qanda||[];
  var hasData=pr.length||qa.length;
  var prBody = pr.length ? pr.map(function(p,i){
    return '<details class="ce-cc-row">'+
      '<summary class="ce-cc-row-h"><span class="ce-cc-topic">'+esc(p.topic||'')+'</span>'+
        (p.body?'<span class="ce-cc-ar">▾</span>':'')+'</summary>'+
      (p.body?'<div class="ce-cc-row-b">'+p.body+ceNoteAddBtn(q.q, ceStripHtml(p.body)||p.topic)+'</div>':'')+
    '</details>';
  }).join('') : '<div class="ce-cc-empty">Prepared-remarks topics land here once the call is processed.</div>';
  var qaBody = qa.length ? qa.map(function(x,i){
    // THEME-LED (Aug 2026): the collapsed row leads with the theme tag + the question's topic — NOT the
    // bank. Open it and the bank/analyst sit at the top, then the question (Q) and the answer (A). A is
    // management's answer IN THEIR OWN WORDS — direct, attributed speech in quotes with the relevant parts
    // bolded (a holds raw HTML), never a third-person summary. `qFull` (optional) is the fuller question.
    var parts=String(x.analyst||'').split('·');
    var name=(parts[0]||'').trim(), bank=(parts[1]||'').trim();
    var qLine=x.qFull||x.q||'';
    return '<details class="ce-cc-row ce-cc-qarow">'+
      '<summary class="ce-cc-row-h">'+
        '<span class="ce-cc-topic">'+esc(x.q||x.theme||'')+'</span>'+
        '<span class="ce-cc-ar">▾</span></summary>'+
      '<div class="ce-cc-row-b">'+
        '<div class="ce-cc-qa-h">'+
          (bank?'<span class="ce-cc-bank">🏦 '+esc(bank)+'</span>':'')+
          (name?'<span class="ce-cc-analyst">'+esc(name)+'</span>':'')+
        '</div>'+
        (qLine?'<div class="ce-cc-q"><span class="ce-cc-ql">Q</span><span>'+esc(qLine)+'</span></div>':'')+
        (x.a?'<div class="ce-cc-a"><span class="ce-cc-al">A</span><span>'+x.a+'</span></div>':'')+
        ceNoteAddBtn(q.q, ceStripHtml(x.a)||x.q||x.theme||'')+
      '</div>'+
    '</details>';
  }).join('') : '<div class="ce-cc-empty">Every analyst question, tagged to its theme, with the bank and the answer inside — lands here once the call is processed.</div>';
  // "The call, classified" is its OWN collapsed dropdown (closed by default); Propose Notes is a
  // SEPARATE sibling section (also its own dropdown) so the two never read as one block.
  return '<details class="ce-cc-wrap">'+
    '<summary class="ce-cc-sum"><span class="ce-cc-sum-t">Call Summary</span>'+
      '<span class="ce-cc-sum-s">prepared remarks &amp; analyst Q&amp;A</span><span class="ce-cc-ar2">▾</span></summary>'+
    '<div class="ce-cc">'+
      '<div class="ce-cc-h">'+
        '<span class="ce-cc-seg"><button type="button" class="active" data-ccv="pr">By Prepared Remarks</button>'+
          '<button type="button" data-ccv="qa">By Analyst Question</button></span>'+
      '</div>'+
      '<div class="ce-cc-pane" data-ccp="pr">'+prBody+'</div>'+
      '<div class="ce-cc-pane" data-ccp="qa" hidden>'+qaBody+'</div>'+
    '</div>'+
  '</details>'+
  ceThemeProposals(q, qk);
}
// ③b PROPOSE NOTES → the Watch List. The call's takeaways drafted as candidate NOTES. Each note is
// filed under a Theme (segment) ▸ Sub-theme — the exact shape the Watch List stores a note — so you
// SEE where it will land, and whether the sub-theme already exists or is new, before staging it.
// Source = q.call.newQuestions. Editable (Theme + Sub-theme + text); Accept stages it, Reject drops
// it, "↻ Rejected" restores rejected ones if you mis-clicked (accepted ones never return). The
// Theme/Sub-theme lists are the real Watch List taxonomy, read live from SN_THEMES / SN_SEG_ORDER.
// Staging is client-side; the actual publish into the Watch List is San/Oscar-gated.
function ceWlThemes(){
  var by={}, order=[];
  (typeof SN_THEMES!=='undefined'?SN_THEMES:[]).forEach(function(ct){
    if(!ct||!ct.seg||!ct.theme) return;
    if(!by[ct.seg]){ by[ct.seg]=[]; order.push(ct.seg); }
    if(by[ct.seg].indexOf(ct.theme)<0) by[ct.seg].push(ct.theme);
  });
  return order.map(function(s){ return { seg:s, themes:by[s] }; });
}
function ceSegsList(){
  if(typeof SN_SEG_ORDER!=='undefined' && SN_SEG_ORDER.length) return SN_SEG_ORDER.slice();
  return ceWlThemes().map(function(g){ return g.seg; });
}
function ceSubsOfSeg(seg){ var g=ceWlThemes().filter(function(x){ return x.seg===seg; })[0]; return g?g.themes:[]; }
function ceGuessTarget(txt){
  var t=(txt||'').toLowerCase(), theme;
  if(/tariff|china|sourcing|supply chain|refund/.test(t)) theme='Tariffs & supply-chain diversification';
  else if(/ebitda|margin|opex|leverage|eps/.test(t)) theme='Operating leverage';
  else if(/international|europe|germany|france|emea|distributor|conversion/.test(t)) theme='International — transition complete';
  else if(/tiktok|social|dtc|d2c|direct-to-consumer|affiliate|salesforce/.test(t)) theme='Social commerce as a new front door';
  else if(/beauty|skincare|hair|cryoglow|flexstyle/.test(t)) theme='Beauty — from hair care to skincare';
  else if(/retail|inventory|pos|shelf|walmart|target|costco|ulta|canada/.test(t)) theme='Retail relationships & channel inventory';
  else if(/\bai\b|palantir|headcount|jailbreak/.test(t)) theme='AI — "Jailbreak SharkNinja"';
  else if(/price|pricing|promot|elastic/.test(t)) theme='Pricing, promotion & elasticity';
  else if(/buyback|repurchase|capital|cash|capex/.test(t)) theme='Capital allocation — from separation to buybacks';
  else if(/launch|category|categories|cleaning|core|crispi|creami|slushi/.test(t)) theme='The core vs the viral launches';
  else theme='Durability of double-digit growth';
  var seg=(ceSegsList()[0]||'SharkNinja');
  ceWlThemes().forEach(function(g){ if(g.themes.indexOf(theme)>=0) seg=g.seg; });
  return { seg:seg, theme:theme };
}
function ceSegSelectHtml(sel){
  // A proposed note can file under an EXISTING theme OR create a NEW one (Dani, Aug 2026) — the
  // "＋ New theme…" option reveals a name field and forces the sub-theme to new (a fresh theme has
  // no sub-themes yet). Publishing creates the theme record (cePublishNoteToRecord), same as the ✎ editor.
  return '<select class="ce-tp-seg" title="Theme (segment) — where the note is filed">'+ceSegsList().map(function(s){
    return '<option value="'+esc(s).replace(/"/g,'&quot;')+'"'+(s===sel?' selected':'')+'>'+esc(s)+'</option>';
  }).join('')+'<option value="__newseg__">＋ New theme…</option></select>';
}
function ceSubSelectHtml(seg, sel){
  var subs=ceSubsOfSeg(seg);
  var opts=subs.map(function(th){
    return '<option value="'+esc(th).replace(/"/g,'&quot;')+'"'+(th===sel?' selected':'')+'>'+esc(th)+'</option>';
  }).join('');
  opts+='<option value="__new__"'+(sel&&subs.indexOf(sel)<0?' selected':'')+'>＋ New sub-theme…</option>';
  return '<select class="ce-tp-sub" title="Sub-theme — the tracked line the note attaches to">'+opts+'</select>';
}
function ceThemeProposals(q, qk){
  var nq=(q.call&&q.call.newQuestions)||[];
  if(!nq.length) return '';
  var cards=nq.map(function(x,i){
    var txt=(typeof x==='string')?x:(x.n||'');
    var tg=ceGuessTarget(txt);
    return '<div class="ce-tp-card" data-tp="'+qk+'-'+i+'">'+
      '<div class="ce-tp-row1">'+
        '<span class="ce-tp-fld"><label class="ce-tp-lb">Theme</label>'+ceSegSelectHtml(tg.seg)+'</span>'+
        '<span class="ce-tp-fld"><label class="ce-tp-lb">Sub-theme</label>'+ceSubSelectHtml(tg.seg, tg.theme)+'</span>'+
        '<span class="ce-tp-acts">'+
          '<button type="button" class="ce-tp-ok" data-tpact="accept" title="Stage this note">✓ Accept</button>'+
          '<button type="button" class="ce-tp-no" data-tpact="reject" title="Drop this note">✕</button>'+
        '</span></div>'+
      '<input class="ce-tp-newseg" type="text" placeholder="New theme name" hidden>'+
      '<input class="ce-tp-newsub" type="text" placeholder="New sub-theme name" hidden>'+
      '<div class="ce-tp-target" data-tptarget></div>'+
      '<textarea class="ce-tp-in" rows="2">'+esc(txt)+'</textarea>'+
    '</div>';
  }).join('');
  return '<details class="ce-tp-wrap">'+
    '<summary class="ce-tp-sum"><span class="ce-tp-ic">📝</span><span class="ce-tp-sum-t">Propose Notes</span>'+
      '<span class="ce-tp-sum-s">draft the call&#39;s takeaways → publish to the Notes tab</span><span class="ce-cc-ar2">▾</span></summary>'+
    '<div class="ce-tp" data-tpq="'+esc(q.q||'')+'">'+
      '<div class="ce-tp-h">'+
        '<button type="button" class="ce-tp-refresh" data-tprefresh title="Bring back the notes you rejected">↻ Rejected <span data-tprej>0</span></button>'+
      '</div>'+
      '<div class="ce-tp-list" data-tplist>'+cards+'</div>'+
      '<div class="ce-tp-staged-h">Staged notes <span class="ce-tp-count" data-tpcount>0</span>'+
        '<button type="button" class="ce-tp-pub" data-tppublish title="File the staged notes into the theme record on the Notes tab">Publish to Notes →</button>'+
        '<span class="ce-tp-status" data-tpstatus></span></div>'+
      '<div class="ce-tp-staged" data-tpstaged><div class="ce-tp-empty">Nothing staged yet — accept a note above.</div></div>'+
    '</div>'+
  '</details>';
}
// E · "Also on the call" ── the supplemental colour from the call, rendered inside Post-Results as a
// SINGLE BOX holding a plain LIST, each point with its own native <details> dropdown (v2.9). The
// Context/Logged band classification and the triage strip are GONE (Dani did not want them). Still
// not the meeting-critical read (that is the scorecard + the Watch List): a thesis-mover (band:'lead')
// is tracked on the Watch List and stays filtered out here. `take`/`threeMinutes`/`notBringing`/
// `newQuestions` survive as data (newQuestions still seeds the next Watch List) but are not rendered.
function ceHighlightsBlock(cc, qk, qlabel){
  if(!cc||!cc.highlights||!cc.highlights.length) return '';
  // A thesis-mover (band:'lead') is tracked on the Watch List, never here — keep filtering it out.
  var hls=cc.highlights.filter(function(x){ return (x.band||'context')!=='lead'; });
  if(!hls.length) return '';
  // The whole box is collapsed by default (Aug 2026) — a supplemental aside should not compete with
  // the scorecard for attention. Outer <details> closed; the caret + count make it obviously openable.
  var b='<details class="ce-alsobox"><summary class="ce-alsobox-h">'+
    '<span class="ce-alsobox-ic">▸</span>'+
    '<span class="ce-alsobox-htext"><b>Also on the call</b>'+
    '<span class="ce-alsobox-sub">supplemental colour — the meeting-critical items are the scorecard above and Notes</span></span>'+
    '<span class="ce-alsobox-n">'+hls.length+'</span>'+
    '</summary>'+
    '<div class="ce-alsolist">';
  b+=hls.map(function(x){
    // No tag chips (tone/curious/connects-dots/…) — just the theme and its dropdown (v2.10).
    var det=x.detail||'';
    if(x.open) det+='<p><b>Still open:</b> '+x.open+'</p>';
    return '<details class="ce-also-i">'+
      '<summary class="ce-also-s">'+
        '<span class="ce-also-hd">'+x.head+'</span>'+
        (det?'<span class="ce-also-ar">▾</span>':'')+
      '</summary>'+
      (det?'<div class="ce-also-body">'+det+ceNoteAddBtn(qlabel, ceStripHtml(det)||x.head)+'</div>':'')+
    '</details>';
  }).join('');
  b+='</div></details>';
  return b;
}

// F · (REMOVED, Dani Aug 2026) The AI-generated "Call summary — the minute" — the whole AI-authored
// section is gone: no ceSummaryBlock / ceSumNodes / ceSumMore, no `results.summary` render, no build
// instruction. Post-Results goes straight from the print to "The call, classified".

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// EVOLUTION ▸ EARNINGS CALLS — SN_THEMES with By theme ⇄ By quarter toggle + accordion
// (9 threads across 10 calls, Q4 2023 → Q1 2026). Same contract as ibkr/uber/lyft/cart/ma/rely/v,
// ENHANCED with a status chip per theme (trend / promise-to-reconcile / watch) — the essence of
// the dissolved Promise Tracker. Source: docs/calls/AMZN.md + AMZN-latest.md.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
var CE_THST={ trend:{c:'#0a8f4c',l:'Confirmed trend'}, promise:{c:'#2E6BE6',l:'Promise — reconcile'}, watch:{c:'#B7791F',l:'Watch'} };
// A promise open for one quarter and one open for four look identical without this. Age is the
// signal: how long has it been unreconciled, or how many quarters has the silence run?
function ceQnum(q){ var m=String(q||'').match(/Q(\d)\s+(\d{4})/); return m?((+m[2])*4+(+m[1])):null; }
function ceStAge(st){
  if(!st||typeof st!=='object'||!st.since) return '';
  var newest=CALL_EARNINGS.quarters.filter(function(q){ return q.status!=='upcoming'; })[0];
  var a=ceQnum(st.since), b=ceQnum(newest?newest.q:null);
  if(a==null||b==null) return '';
  var n=Math.max(1, b-a+1), k=(st.k||'');
  var lbl = (k==='promise') ? ('unreconciled '+n+' quarter'+(n>1?'s':''))
          : (st.silent)     ? ('silent '+n+' quarter'+(n>1?'s':''))
          : (k==='watch')   ? ('tracked '+n+' quarter'+(n>1?'s':''))
          :                   ('running '+n+' quarter'+(n>1?'s':''));
  return '<span class="calls-st-age"> · '+lbl+'</span>';
}

// ═══ Earnings · Setup charts (Chart.js, lazy — the pane must be visible or offsetParent is null)
// Quarterly only. Both charts read CE_CONS and redraw on the metric pills and the range control.
function ceTkFmt(u,v){
  if(v==null) return '';
  if(u==='$M') return (Math.abs(v)>=1000)?('$'+(+v/1000).toFixed(2)+'B'):('$'+(+v).toFixed(1)+'M');
  if(u==='M')  return (+v).toFixed(1)+'M';
  if(u==='$')  return '$'+(+v).toFixed(2);
  if(u==='$B') return '$'+(+v).toFixed(1)+'B';
  if(u==='B')  return (+v).toFixed(2)+'B';
  return String(v);
}
function wireCeTrack(root){
  var pane=root.querySelector('.ovt-subpane[data-ovst="earnings"]'); if(!pane) return;
  // The lens defaults are asserted here as well as in the markup — Consensus + YoY, showing YoY.
  // Belt and braces: a half-applied default reads as a broken control (§6a-ii).
  function ceSetLens(v){
    // MUST scope to [data-ceg] — a bare '.ce-gseg button' also matches the margin toggle that
    // shares the .ce-gseg pill styling, and would clear its active state (§6a-v cross-check rule).
    pane.querySelectorAll('.ce-gseg button[data-ceg]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ceg')===v); });
    pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-g', v); });
    pane.querySelectorAll('.ce-fz').forEach(function(f){ f.setAttribute('data-g', v); });
  }
  ceSetLens('yoy');
  pane.querySelectorAll('.ce-ev-pill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ceev')==='cons'); });
  pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-ev','cons'); });
  // Margin default: off, and its own segment's active state set independently of the growth lens.
  pane.querySelectorAll('.ce-gseg button[data-cemm]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-cemm')==='off'); });
  pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-mm','off'); });
  pane.querySelectorAll('.ce-gseg button[data-ceg]').forEach(function(btn){ btn.onclick=function(){
    ceSetLens(btn.getAttribute('data-ceg'));
  }; });
  // Margin lens (headline GP/OpInc/EBITDA only) — CSS-driven via data-mm on the wrap.
  pane.querySelectorAll('.ce-gseg button[data-cemm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-cemm');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-mm', v); });
  }; });
  // Post-Results print-block toggles — scoped to their own .ce-fz so each quarter's print block is
  // independent. These are SEPARATE from the Setup's Consensus/Summit/Both (which does not apply
  // now supports Both here too). `vs Street ⇄ vs Summit ⇄ Both` sets data-ev (swaps the frozen
  // expectation the print is scored against); `Margin` sets data-mm (expected-implied → realized).
  pane.querySelectorAll('.ce-gseg button[data-fzev]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-fzev'), fz=btn.closest('.ce-fz');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    if(!fz) return;
    fz.setAttribute('data-ev', v);
    // The beat/miss filter can't score two references — clear it and reset the pills to All when entering Both
    // (the filter group is hidden in Both by CSS; this stops a stale filter from carrying over on the way out).
    if(v==='both'){ fz.removeAttribute('data-f'); var vdf=fz.querySelector('.ce-vdf');
      if(vdf) vdf.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-vdf')==='all'); }); }
  }; });
  pane.querySelectorAll('.ce-gseg button[data-fzmm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-fzmm'), fz=btn.closest('.ce-fz');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    if(fz) fz.setAttribute('data-mm', v);
  }; });
  // Cards ⇄ Chart — show the print as tiles OR as the diverging surprise chart, one at a time.
  pane.querySelectorAll('.ce-gseg button[data-fzview]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-fzview'), fz=btn.closest('.ce-fz');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    if(fz) fz.setAttribute('data-view', v);
  }; });
  // Statement order ⇄ By surprise — sets data-ord on the .ce-fz; both the cards and the chart reflow
  // in pure CSS via each row's --od (surprise rank). Default is statement order (top-to-bottom).
  pane.querySelectorAll('.ce-gseg button[data-fzord]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-fzord'), fz=btn.closest('.ce-fz');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    if(fz) fz.setAttribute('data-ord', v);
  }; });
  // Metric-category filter — All / Top line / Bottom line; sets data-fzcat on the .ce-fz (pure-CSS filter).
  pane.querySelectorAll('.ce-gseg button[data-fzcat]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-fzcat'), fz=btn.closest('.ce-fz');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    if(fz) fz.setAttribute('data-fzcat', v);
  }; });
  // Per-point "＋ add note" (Prepared Remarks / Q&A / Also on the call) — opens the manual note composer;
  // reuses the note engine (cePublishNoteToRecord) but the user files Theme/Sub-theme by hand.
  pane.querySelectorAll('[data-noteadd]').forEach(function(btn){ btn.onclick=function(e){
    e.preventDefault(); e.stopPropagation(); ceNoteAddPop(btn);
  }; });
  // ③ "The call, classified" — By Prepared Remarks ⇄ By Analyst Question. Scoped to its own .ce-cc so
  // each quarter's block toggles independently (mirrors the .ce-phtab / print-toggle pattern).
  pane.querySelectorAll('.ce-cc-seg button[data-ccv]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-ccv'), cc=btn.closest('.ce-cc'); if(!cc) return;
    cc.querySelectorAll('.ce-cc-seg button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    cc.querySelectorAll('.ce-cc-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-ccp')!==v); });
  }; });
  // ③b Propose Notes — each note files under Theme (segment) ▸ Sub-theme. The Sub-theme list rebuilds
  // when the Theme changes; "＋ New sub-theme…" reveals a name field and flags the note NEW. The target
  // line shows exactly where it lands. Accept stages "Theme ▸ Sub-theme · text"; Reject parks it; the
  // "↻ Rejected" button is ALWAYS visible and restores rejects (accepted notes never return).
  pane.querySelectorAll('.ce-tp').forEach(function(tp){
    var list=tp.querySelector('[data-tplist]'), staged=tp.querySelector('[data-tpstaged]'),
        countEl=tp.querySelector('[data-tpcount]'), rejEl=tp.querySelector('[data-tprej]'),
        refreshBtn=tp.querySelector('[data-tprefresh]'),
        publishBtn=tp.querySelector('[data-tppublish]'), statusEl=tp.querySelector('[data-tpstatus]'),
        qLabel=tp.getAttribute('data-tpq')||'', rejected=[];
    function refresh(){
      var chips=staged.querySelectorAll('.ce-tp-chip');
      if(countEl) countEl.textContent=chips.length;
      var empty=staged.querySelector('.ce-tp-empty'); if(empty) empty.hidden=chips.length>0;
      if(rejEl) rejEl.textContent=rejected.length;
      if(publishBtn) publishBtn.hidden=(chips.length===0);
    }
    function setStatus(m){ if(statusEl) statusEl.textContent=m||''; }
    function readTarget(card){
      var segSel=card.querySelector('.ce-tp-seg'), segRaw=(segSel||{}).value||'';
      var isNewSeg=(segRaw==='__newseg__'), newSegInp=card.querySelector('.ce-tp-newseg');
      var seg=isNewSeg?((newSegInp&&newSegInp.value||'').trim()):segRaw;
      var subSel=card.querySelector('.ce-tp-sub');
      // a brand-new theme has no sub-themes yet, so the sub is ALWAYS new in that case
      var isNew=isNewSeg || !!(subSel && subSel.value==='__new__');
      var newInp=card.querySelector('.ce-tp-newsub');
      var sub=isNew?((newInp&&newInp.value||'').trim()):(subSel?subSel.value:'');
      return { seg:seg, sub:sub, isNew:isNew, isNewSeg:isNewSeg };
    }
    function paintTarget(card){
      var t=readTarget(card), tgt=card.querySelector('[data-tptarget]'); if(!tgt) return;
      var segLabel=t.seg||(t.isNewSeg?'(name the new theme)':'—');
      var subLabel=t.sub||(t.isNew?'(name the new sub-theme)':'—');
      var badge=t.isNewSeg?'<span class="ce-tp-badge new">NEW theme</span>'
        :(t.isNew?'<span class="ce-tp-badge new">NEW sub-theme</span>':'<span class="ce-tp-badge">existing sub-theme</span>');
      tgt.innerHTML='<span class="ce-tp-arrow">files under →</span> <b></b> <span class="ce-tp-sep">▸</span> <b></b> '+badge;
      var bs=tgt.querySelectorAll('b'); if(bs[0]) bs[0].textContent=segLabel; if(bs[1]) bs[1].textContent=subLabel;
    }
    function rebuildSub(card){
      var seg=(card.querySelector('.ce-tp-seg')||{}).value||'', subSel=card.querySelector('.ce-tp-sub'); if(!subSel) return;
      // a new theme ("__newseg__") has no existing sub-themes → only the "＋ New sub-theme…" option
      var subs=(seg==='__newseg__')?[]:ceSubsOfSeg(seg);
      subSel.innerHTML=subs.map(function(th){ return '<option value="'+esc(th).replace(/"/g,'&quot;')+'">'+esc(th)+'</option>'; }).join('')+'<option value="__new__">＋ New sub-theme…</option>';
    }
    function syncNew(card){
      var segSel=card.querySelector('.ce-tp-seg'), subSel=card.querySelector('.ce-tp-sub'),
          newInp=card.querySelector('.ce-tp-newsub'), newSegInp=card.querySelector('.ce-tp-newseg');
      var isNewSeg=!!(segSel && segSel.value==='__newseg__');
      if(newSegInp) newSegInp.hidden = !isNewSeg;
      if(newInp) newInp.hidden = !(isNewSeg || (subSel && subSel.value==='__new__'));
    }
    function wireCard(card){
      var segSel=card.querySelector('.ce-tp-seg'), subSel=card.querySelector('.ce-tp-sub'),
          newInp=card.querySelector('.ce-tp-newsub'), newSegInp=card.querySelector('.ce-tp-newseg');
      if(segSel) segSel.onchange=function(){ rebuildSub(card); syncNew(card); paintTarget(card); };
      if(subSel) subSel.onchange=function(){ syncNew(card); paintTarget(card); };
      if(newInp) newInp.oninput=function(){ paintTarget(card); };
      if(newSegInp) newSegInp.oninput=function(){ paintTarget(card); };
      syncNew(card); paintTarget(card);
      card.querySelectorAll('[data-tpact]').forEach(function(btn){ btn.onclick=function(){
        if(btn.getAttribute('data-tpact')==='accept'){
          var ta=card.querySelector('.ce-tp-in'), v=(ta&&ta.value||'').trim(); if(!v) return;
          var t=readTarget(card);
          if(t.isNewSeg && !t.seg){ if(newSegInp) newSegInp.focus(); return; }   // name the new theme first
          if(t.isNew && !t.sub){ if(newInp) newInp.focus(); return; }
          var chip=document.createElement('div'); chip.className='ce-tp-chip';
          // carry the target on the chip so Publish can build the company_themes payload
          chip.dataset.seg=t.seg; chip.dataset.sub=t.sub; chip.dataset.text=v; chip.dataset.isNew=t.isNew?'1':'';
          var tag=document.createElement('span'); tag.className='ce-tp-chip-tag'; tag.textContent=t.seg+' ▸ '+t.sub;
          chip.appendChild(tag);
          if(t.isNew){ var nb=document.createElement('span'); nb.className='ce-tp-chip-new'; nb.textContent='NEW'; chip.appendChild(nb); }
          var txt=document.createElement('span'); txt.className='ce-tp-chip-t'; txt.textContent=v; chip.appendChild(txt);  // textContent = no injection
          var x=document.createElement('button'); x.type='button'; x.className='ce-tp-unstage'; x.title='Unstage (return to proposals)'; x.textContent='✕';
          // Unstage RESTORES the card (bug fix): accepting HIDES the card, so ✕ un-hides it and it can be
          // re-accepted — previously the card was removed outright and an unstaged note vanished forever.
          x.onclick=function(){ chip.remove(); card.hidden=false; refresh(); }; chip.appendChild(x);
          staged.appendChild(chip); card.hidden=true;
        } else { rejected.push(card); card.remove(); }
        refresh();
      }; });
    }
    tp.querySelectorAll('.ce-tp-card').forEach(wireCard);
    if(refreshBtn) refreshBtn.onclick=function(){ rejected.forEach(function(c){ list.appendChild(c); }); rejected=[]; refresh(); };
    // Publish staged notes → the Notes theme record (SN_THEMES). Pablo's #79 replaced the shared
    // Watch List with an in-file segmented theme record, so THAT is where a note has to land to "flow
    // to Notes": each staged note is filed under its Theme (segment) ▸ Sub-theme, as an item under the
    // reported quarter, then the record re-renders in place. Session-only for now (SN_THEMES is the
    // in-memory model Pablo's own editor mutates) — durable persistence is the next step (a Supabase
    // table / edge function for the theme record), same gap the editor has today.
    if(publishBtn) publishBtn.onclick=function(){
      var chips=[].slice.call(staged.querySelectorAll('.ce-tp-chip')).filter(function(c){ return !c.classList.contains('published'); });
      if(!chips.length){ setStatus('Nothing new to publish.'); return; }
      var filed=0, dup=0;
      chips.forEach(function(chip){
        var res=cePublishNoteToRecord(chip.dataset.seg||'', chip.dataset.sub||chip.dataset.seg||'', chip.dataset.text||'', qLabel);
        if(res && res.dup){ dup++; chip.classList.add('dup'); }   // already in the record — skip, flag the chip
        else { filed++; chip.classList.add('published'); }
      });
      if(filed) snRerenderRecord(document);   // the theme record lives in the Notes pane; re-render it (and persist)
      setStatus(filed+' filed into the theme record (Notes tab)'+(dup?' · '+dup+' skipped (already filed)':'')+(filed?' — saved when signed in':''));
    };
    refresh();
  });
}
function ceResultsPending(label){
  return '<div class="ce-note" style="margin:8px 0">📊 <b>'+esc(label)+'</b> — the Amazon-style actuals-vs-estimates chart + table. '+
    'This pane is wired to the shared Results engine (<code>js/results.js</code>); it will populate once SN\'s '+
    'dataset is registered in <code>RESULTS_DATA</code> (built from the CE_CONS archive + the Summit projection export, '+
    'per <code>docs/RESULTS_CONVENTIONS.md</code> §6).</div>';
}
// Tab switches hide a tall pane and show a shorter one, so the browser clamps scrollTop and the
// page appears to jump to the top. Keep the clicked control visually anchored: measure its
// viewport position, run the change, then scroll by the delta so it does not move. (§6a-iv.)
function ceKeepPos(el, fn){
  var before=el.getBoundingClientRect().top;
  fn();
  var after=el.getBoundingClientRect().top, d=after-before;
  if(Math.abs(d)>1) window.scrollBy(0, d);
}
// Earnings phase tabs — nested inside Evolution's earnings subpane, wired independently.
// Show only the quarter pills valid for `phase`; if the active pill just became invalid, activate
// the most-recent valid one and drive the same block-visibility the pill click would.
function ceSelectQuarter(pane, qk){
  pane.querySelectorAll('.ce-qpill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ceqsel')===qk); });
  pane.querySelectorAll('.ce-qblock').forEach(function(blk){ blk.hidden=(blk.getAttribute('data-ceq')!==qk); });
  pane.querySelectorAll('.ce-wl-tag').forEach(function(b){ b.classList.remove('active'); });
  var flat=pane.querySelector('.ce-wl-all'); if(flat) flat.hidden=true;
}
function ceApplyPhaseQuarters(pane, phase){
  // The quarter selector drives the Setup & Post-Results per-quarter blocks; the Watch List pane has
  // no per-quarter blocks (the shared engine carries its own quarters), so the pills are inert there.
  // Hide the whole selector on the Watch List phase (AMZN-only) rather than leave a dead control.
  var pillbar=pane.querySelector('.ce-qpills'); if(pillbar) pillbar.hidden=(phase==='watch');
  var pills=Array.prototype.slice.call(pane.querySelectorAll('.ce-qpill')), lastVisible=null, activeVisible=false;
  pills.forEach(function(b){
    var ok=(b.getAttribute('data-ceqhas')||'').split(' ').indexOf(phase)>=0;
    b.hidden=!ok;
    if(ok){ lastVisible=b; if(b.classList.contains('active')) activeVisible=true; }
  });
  // pills render newest-first, so the FIRST visible is the most recent valid quarter.
  var firstVisible=pills.filter(function(b){ return !b.hidden; })[0];
  if(!activeVisible && firstVisible) ceSelectQuarter(pane, firstVisible.getAttribute('data-ceqsel'));
}
function wireCallEarnings(root){
  var pane=root.querySelector('.ovt-subpane[data-ovst="earnings"]'); if(!pane) return;
  // (Call-summary Expand/Collapse wiring removed with the AI summary section, Dani Aug 2026.)
  pane.querySelectorAll('.ce-phtab').forEach(function(btn){ btn.onclick=function(){
    var key=btn.getAttribute('data-cep');
    ceKeepPos(btn, function(){
    pane.querySelectorAll('.ce-phtab').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.ce-phpane').forEach(function(p){ p.hidden=(p.getAttribute('data-cep')!==key); });
    ceApplyPhaseQuarters(pane, key);
    });
    // Returning to Setup re-arms the Setup chart (the Results engine; canvases were hidden, so any
    // earlier build produced a zero-size chart).
    if(key==='setup') requestAnimationFrame(gBuildCeAnnual);
  }; });
  // Setup estimates toggle: Consensus ⇄ Summit ⇄ Both (CSS-driven via data-ev on the wrap)
  pane.querySelectorAll('.ce-ev-pill').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-ceev');
    pane.querySelectorAll('.ce-ev-pill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-ev', v); });
  }; });
  // Quarter selector: one Earnings, many quarters — only the selected quarter's blocks render.
  // Picking a quarter also exits the cross-quarter tag view.
  pane.querySelectorAll('.ce-qpill').forEach(function(btn){ btn.onclick=function(){
    ceSelectQuarter(pane, btn.getAttribute('data-ceqsel'));
  }; });
  // initial phase is Setup — every quarter valid, nothing to hide, but keep it consistent.
  ceApplyPhaseQuarters(pane, 'setup');
  // Verdict filter on the print block: All / Beats / Misses / In line. Sets data-f on the tile
  // grid; CSS hides the non-matching tiles. Scoped per quarter block so the active quarter filters.
  pane.querySelectorAll('.ce-vdf button').forEach(function(btn){ btn.onclick=function(){
    var seg=btn.parentNode, host=seg.closest('.ce-fz'); if(!host) return;
    seg.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    // data-f on the .ce-fz ROOT (not just the cards grid) so the same filter drives BOTH the cards and
    // the chart rows — the All/Beats/Misses control stays live in Chart view.
    var v=btn.getAttribute('data-vdf');
    if(v==='all') host.removeAttribute('data-f'); else host.setAttribute('data-f', v);
  }; });
  // Band triage filter: each button shows/hides its own cards. All three start on, so the
  // reader sees the whole call and uses colour to triage; the filter is for narrowing, not for
  // hiding by default (§6a-iv). The highlight cards now live inside the Post-Results pane (the
  // Post-Call tab was dissolved Jul 2026), but the filter is pane-scoped so it still finds them.
  pane.querySelectorAll('.ce-tri-b').forEach(function(btn){ btn.onclick=function(){
    var on=btn.classList.toggle('active');
    var qk=btn.getAttribute('data-cebq'), band=btn.getAttribute('data-ceband');
    var host=pane.querySelector('.ce-hcards[data-cehl="'+qk+'"]'); if(!host) return;
    host.querySelectorAll('.ce-hcard[data-band="'+band+'"]').forEach(function(c){ c.hidden=!on; });
  }; });
  // ── Watch List: mount the SHARED engine (js/watchlist.js). It owns rendering + Supabase
  // persistence + sorting + the delete rule, scoped by company id/ticker; re-mount is idempotent. ──
  ceMountWatchList();
}
// Mount / re-mount the shared Watch List engine into the Notes pane. Re-mount is idempotent (it
// re-fetches from company_themes), so Propose Notes calls it again after a publish to surface the
// freshly-inserted theme without a page reload.
function ceMountWatchList(){
  var wmount=document.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phpane[data-cep="watch"] [data-wlmount]');
  if(wmount && _co && _co.id){
    mountWatchList(wmount, { companyId:_co.id, ticker:_co.ticker, quarters:CALL_EARNINGS.quarters,
      colors:{ brand:BRAND, brand2:BRAND2, purple:'#7A5AF8', gray:GRAY, red:'#D64545' } });
  }
}

// Give the Evolution sub-tab bar (Earnings · Results · Estimates) and the phase bar (Setup · Post-Results
// · Notes) the SAME width — they have identical styling, only the labels differ. Measure both, size both
// to the wider one, and let the buttons flex to fill (Dani, Aug 2026). Needs both bars visible to measure.
function ceEqualizeTabBars(root){
  var ev=root.querySelector('.ov-sn-dd .dd-pane[data-dd="evolution"]'); if(!ev) return;
  var a=ev.querySelector('.ce-evohead .ovt-subtabs');
  var b=ev.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phtabs');
  if(!a||!b) return;
  var wa=a.offsetWidth, wb=b.offsetWidth; if(wa<=0||wb<=0) return;   // one is hidden — can't measure, skip
  var w=Math.max(wa,wb);
  [a,b].forEach(function(el){ el.style.boxSizing='border-box'; el.style.width=w+'px';
    el.querySelectorAll(':scope > button').forEach(function(btn){ btn.style.flex='1'; }); });
}
// Wire the theme-record interactions (accordions, segment dropdowns, By theme ⇄ By quarter toggle).
function wireThemeRecord(scope){
  if(!scope) return;
  scope.querySelectorAll('.lpb-acc-h').forEach(function(btn){ btn.onclick=function(){ var item=btn.parentElement; var open=item.classList.toggle('open'); var ic=btn.querySelector('.lpb-acc-ic'); if(ic) ic.textContent=open?'–':'+'; }; });
  scope.querySelectorAll('.calls-seg[data-segtog]').forEach(function(btn){ btn.onclick=function(){ var g=btn.closest('.calls-seg-group'); if(!g) return; var open=g.classList.toggle('open'); var ic=btn.querySelector('.calls-seg-ic'); if(ic) ic.textContent=open?'–':'+'; }; });
  scope.querySelectorAll('.calls-pill[data-callsv]').forEach(function(b){ b.onclick=function(){ var v=b.getAttribute('data-callsv');
    scope.querySelectorAll('.calls-pill[data-callsv]').forEach(function(x){ x.classList.toggle('active', x===b); });
    var th=scope.querySelector('#aCallsTheme'), qu=scope.querySelector('#aCallsQuarter'); if(th) th.style.display=(v==='theme'?'':'none'); if(qu) qu.style.display=(v==='quarter'?'':'none');
    // The ✎ editor lives only in the By-theme view — hide it on By-quarter (edits still flow through
    // to By-quarter since that view derives from the same data).
    var pane=b.closest('.ce-phpane'); var edit=pane?pane.querySelector('.sn-edit'):null; if(edit) edit.style.display=(v==='theme'?'':'none'); }; });
  // Global tracking-window filter (below the toggle) — narrows the notes shown in both views.
  var rerec=function(){ snRerenderRecord(document.getElementById('co-detailview')); };
  scope.querySelectorAll('[data-rectrks]').forEach(function(s){ s.onchange=function(){ _recSince=s.value||null; rerec(); }; });
  scope.querySelectorAll('[data-rectrkclear]').forEach(function(b){ b.onclick=function(){ _recSince=null; rerec(); }; });
  scope.querySelectorAll('[data-rechook]').forEach(function(b){ b.onclick=function(){ _recHook=b.getAttribute('data-rechook'); rerec(); }; });
  // ── inline per-sub-theme editor (opened from each sub-theme's ✎ Edit / Add note button) ──
  function ctOfEl(el){ var item=el.closest('.lpb-acc-item[data-theme]'), grp=el.closest('.calls-seg-group[data-seg]'); if(!item||!grp) return null; return snFindTheme(grp.getAttribute('data-seg')+'|'+item.getAttribute('data-theme')); }
  scope.querySelectorAll('[data-receditopen]').forEach(function(b){ b.onclick=function(){ _recEditOpen[b.getAttribute('data-receditopen')]=1; rerec(); }; });
  scope.querySelectorAll('[data-recdone]').forEach(function(b){ b.onclick=function(){ var ct=ctOfEl(b); if(ct) delete _recEditOpen[ct.seg+'|'+ct.theme]; rerec(); }; });
  scope.querySelectorAll('[data-rects]').forEach(function(s){ s.onchange=function(){ var ct=ctOfEl(s); if(!ct) return; ct.st=ct.st||{ k:'watch' }; if(s.value) ct.st.since=s.value; else delete ct.st.since; rerec(); }; });
  scope.querySelectorAll('[data-rectu]').forEach(function(s){ s.onchange=function(){ var ct=ctOfEl(s); if(!ct) return; ct.trackUntil=s.value||null; rerec(); }; });
  scope.querySelectorAll('[data-recadd]').forEach(function(b){ b.onclick=function(){ var ct=ctOfEl(b); if(!ct) return; var box=b.closest('.rec-edit'); var q=box.querySelector('[data-recnq]').value, tx=(box.querySelector('[data-recntext]').value||'').trim(); if(!q){ ceInlinePop(b, { title:'Pick a quarter for the note first.', confirm:true, ok:'OK' }, function(){}); return; } if(!tx) return; ct.updates=ct.updates||[]; var u=ct.updates.filter(function(x){ return x.q===q; })[0]; if(!u){ u={ q:q, items:[] }; ct.updates.push(u); ct.updates.sort(function(a,z){ return (ceQnum(a.q)||0)-(ceQnum(z.q)||0); }); } u.items.push(tx); rerec(); }; });
  scope.querySelectorAll('[data-recdelnote]').forEach(function(b){ b.onclick=function(){ var ct=ctOfEl(b); if(!ct) return; var q=b.getAttribute('data-q'), ix=+b.getAttribute('data-i'); var u=(ct.updates||[]).filter(function(x){ return x.q===q; })[0]; if(!u) return; u.items.splice(ix,1); if(!u.items.length) ct.updates=ct.updates.filter(function(x){ return x!==u; }); rerec(); }; });
  scope.querySelectorAll('[data-recednote]').forEach(function(b){ b.onclick=function(){ var ct=ctOfEl(b); if(!ct) return; var q=b.getAttribute('data-q'), ix=+b.getAttribute('data-i'); var u=(ct.updates||[]).filter(function(x){ return x.q===q; })[0]; if(!u||u.items[ix]==null) return; ceInlinePop(b, { title:'Edit note · '+q+'  (HTML ok)', value:u.items[ix], multiline:true }, function(nv){ u.items[ix]=nv; rerec(); }); }; });
}
// Re-render the theme record above (from SN_THEMES) and re-wire it — called after an edit or a
// filter change. Open/closed state (segments, sub-themes, the active view) is preserved across the
// rebuild so applying a filter never collapses the panes the user had expanded.
function snCaptureRecState(host){
  var segs={}, subs={};
  host.querySelectorAll('.calls-seg-group[data-seg]').forEach(function(g){ segs[g.getAttribute('data-seg')]=g.classList.contains('open'); });
  host.querySelectorAll('.lpb-acc-item[data-theme]').forEach(function(it){ if(it.classList.contains('open')) subs[it.getAttribute('data-theme')]=1; });
  var qp=host.querySelector('.calls-pill[data-callsv="quarter"]');
  return { segs:segs, subs:subs, view:(qp&&qp.classList.contains('active'))?'quarter':'theme' };
}
function snRestoreRecState(host, st){
  host.querySelectorAll('.calls-seg-group[data-seg]').forEach(function(g){ if(st.segs[g.getAttribute('data-seg')]){ g.classList.add('open'); var ic=g.querySelector('.calls-seg-ic'); if(ic) ic.textContent='–'; } });
  host.querySelectorAll('.lpb-acc-item[data-theme]').forEach(function(it){ if(st.subs[it.getAttribute('data-theme')]){ it.classList.add('open'); var ic=it.querySelector('.lpb-acc-ic'); if(ic) ic.textContent='–'; } });
  if(st.view==='quarter'){
    host.querySelectorAll('.calls-pill[data-callsv]').forEach(function(x){ x.classList.toggle('active', x.getAttribute('data-callsv')==='quarter'); });
    var th=host.querySelector('#aCallsTheme'), qu=host.querySelector('#aCallsQuarter'); if(th) th.style.display='none'; if(qu) qu.style.display='';
    var pane=host.closest('.ce-phpane'); var edit=pane?pane.querySelector('.sn-edit'):null; if(edit) edit.style.display='none';
  }
}
function snRerenderRecord(root){ var host=root&&root.querySelector('[data-snrec]'); if(!host) return; var st=snCaptureRecState(host); host.innerHTML=callsBody(); snRestoreRecState(host, st); wireThemeRecord(host); snPersistThemes(); }
// ── Durable persistence of the theme record (AMZN Notes) to Supabase (table company_theme_record) ──
// The record is Pablo's in-memory SN_THEMES; here it becomes durable. HYDRATE on mount (replace the
// hardcoded seed with the saved record if one exists), then SAVE the whole record after every mutation.
// snRerenderRecord runs after every edit/publish, so a single save hook there covers them all. The
// _amznReady gate prevents the initial (pre-hydration) render from overwriting the DB. Requires a
// signed-in session (RLS) and sql/011_company_theme_record.sql — until then it degrades silently.
var _amznReady=false, _amznSaveT=null;
function snPersistThemes(){
  if(!_amznReady || !_co || !_co.id) return;
  if(_amznSaveT) clearTimeout(_amznSaveT);
  _amznSaveT=setTimeout(function(){ Promise.resolve(saveThemeRecord(_co.id, _co.ticker, SN_THEMES)).catch(function(){}); }, 400);
}
function snHydrateThemes(root){
  if(_amznReady) return;
  if(!_co || !_co.id){ _amznReady=true; return; }
  Promise.resolve(fetchThemeRecord(_co.id)).then(function(res){
    if(res && res.success && res.data && res.data.length){
      SN_THEMES.length=0; Array.prototype.push.apply(SN_THEMES, res.data);
      _amznReady=true; snRerenderRecord(root); snRenderEditor(root);
    } else { _amznReady=true; }   // no saved record yet — keep the seed; the first edit will persist it
  }).catch(function(){ _amznReady=true; });
}

// ═══ Theme → Sub-theme editor (AMZN-only, in the hidden ✎ panel) ═══════════════════════════════
// "Theme" = the segment (SN_SEG_ORDER); "Sub-theme" = a theme within it (SN_THEMES[].theme).
// Picking a Theme filters the Sub-theme list to that segment. Adding either mutates the in-memory
// model and re-renders the record above at once. (Session-only for now — see the note to the user.)
var _edSeg=null, _edSub=null;
var _recEditOpen={};   // per sub-theme inline editor open state, keyed by "seg|theme"
function snSubsOf(seg){ return SN_THEMES.filter(function(ct){ return ct.seg===seg; }); }
function snFindTheme(key){ var p=String(key||'').split('|'); return SN_THEMES.filter(function(x){ return x.seg===p[0] && x.theme===p.slice(1).join('|'); })[0]; }
// Propose Notes → Notes: file a staged note into the theme record. Finds (or creates) the
// segment ▸ sub-theme, then appends the text as an item under the reported quarter's updates —
// the same shape the ✎ editor writes, so it renders identically in the record above.
// Duplicate guard for theme-record notes. Two notes collide when they normalise to the SAME plain
// text (HTML/entities stripped, whitespace collapsed, case-folded) under the same sub-theme + quarter
// — the real spam / double-click case: the ＋ add-note composer pre-seeds the point's prose, so
// re-opening it and saving twice, or publishing the same Propose-Notes batch twice, would otherwise
// file the identical note again. Used by every note-write path so the rule holds everywhere. (§6a-ii.)
function ceNoteNorm(t){ return ceStripHtml(t).toLowerCase(); }
function ceNoteDup(items, text){ var n=ceNoteNorm(text); return (items||[]).some(function(it){ return ceNoteNorm(it)===n; }); }
// Returns {added:true} on success, {added:false, dup:true} when the identical note is already filed.
function cePublishNoteToRecord(seg, sub, text, q){
  if(!seg || !sub || !text) return {added:false};
  var ct=snFindTheme(seg+'|'+sub);
  if(!ct){ ct={ seg:seg, theme:sub, why:'', updates:[], st:{ k:'watch' } }; SN_THEMES.push(ct); }
  ct.updates=ct.updates||[];
  var u=ct.updates.filter(function(x){ return x.q===q; })[0];
  if(!u){ u={ q:q, items:[] }; ct.updates.push(u); ct.updates.sort(function(a,z){ return (ceQnum(a.q)||0)-(ceQnum(z.q)||0); }); }
  if(ceNoteDup(u.items, text)) return {added:false, dup:true};   // already filed here — never duplicate
  u.items.push(text);
  return {added:true};
}
// A hook is OPEN when it has a Tracking since and no Tracking until; CLOSED once an until is set.
function snHookOpen(ct){ return !!(ct.st&&ct.st.since) && !ct.trackUntil; }
function snHookClosed(ct){ return !!ct.trackUntil; }
function snEditorBody(){
  if(!_edSeg || SN_SEG_ORDER.indexOf(_edSeg)<0) _edSeg=SN_SEG_ORDER[0]||null;
  var subs=snSubsOf(_edSeg);
  if(_edSub && !subs.some(function(s){ return s.theme===_edSub; })) _edSub=null;
  var h='<div class="aed-row"><span class="aed-lb">Theme</span><div class="aed-pills">';
  SN_SEG_ORDER.forEach(function(seg){ h+='<button type="button" class="aed-pill'+(seg===_edSeg?' on':'')+'" data-aedseg="'+esc(seg)+'">'+esc(seg)+'</button>'; });
  h+='<button type="button" class="aed-add" data-aedaddseg>+ New theme</button>';
  if(_edSeg) h+='<button type="button" class="aed-delseg" data-aeddelseg title="Delete the selected Theme and all its sub-themes">✕ delete ‘'+esc(_edSeg)+'’</button>';
  h+='</div></div>';
  h+='<div class="aed-row"><span class="aed-lb">Sub-theme</span><div class="aed-pills">';
  if(subs.length) subs.forEach(function(s){ h+='<button type="button" class="aed-pill sub'+(s.theme===_edSub?' on':'')+'" data-aedsub="'+esc(s.theme)+'">'+esc(s.theme)+(snHookClosed(s)?' <span style="opacity:.6">·closed</span>':'')+'</button>'; });
  else h+='<span class="aed-empty">no sub-themes yet</span>';
  h+='<button type="button" class="aed-add" data-aedaddsub>+ New sub-theme</button></div></div>';
  var cur=subs.filter(function(s){ return s.theme===_edSub; })[0];
  if(cur){
    var extraQ=(cur.updates||[]).map(function(u){ return u.q; });
    h+='<div class="aed-detail">';
    h+='<div class="aed-detail-h">'+esc(cur.theme)+'<span class="aed-detail-seg">in '+esc(cur.seg)+'</span>'+
       '<button type="button" class="aed-delsub" data-aeddelsub>✕ delete sub-theme</button></div>';
    // Tracking window (per sub-theme): since + until (empty = still open). Drives the Open/Closed filter.
    h+='<label class="aed-flb">Tracking window</label>'+
       '<div class="aed-track"><span>Tracking since <select class="aed-sel" data-aedts>'+snQuarterOpts((cur.st&&cur.st.since)||'', '— none —', extraQ)+'</select></span>'+
       '<span>Tracking until <select class="aed-sel" data-aedtu>'+snQuarterOpts(cur.trackUntil||'', '— still open —', extraQ)+'</select></span>'+
       '<span class="aed-hookst '+(snHookClosed(cur)?'closed':(snHookOpen(cur)?'open':''))+'">'+(snHookClosed(cur)?'closed':(snHookOpen(cur)?'open hook':'not tracked'))+'</span></div>';
    // Add a note — right below the tracking window.
    h+='<label class="aed-flb">Add a note</label>'+
       '<div class="aed-addnote"><select class="aed-sel" data-aednoteq>'+snQuarterOpts('', '— quarter —', extraQ)+'</select>'+
       '<input type="text" data-aednotetext placeholder="new note for that quarter (bold ok: &lt;b&gt;…&lt;/b&gt;)">'+
       '<button type="button" class="aed-mini" data-aedaddnote>+ Add note</button></div>';
    // Notes per quarter — the editor shows ALL notes; the "Since" filter is global (above the record).
    h+='<label class="aed-flb">Notes by quarter</label>';
    if(cur.updates&&cur.updates.length){
      h+='<div class="aed-notes">'+cur.updates.map(function(u){
        return '<div class="aed-qgroup"><span class="aed-note-q">'+esc(u.q)+'</span>'+
          u.items.map(function(it,ii){ return '<div class="aed-note-row"><span>'+it+'</span>'+
            '<button type="button" class="aed-ed" data-aedednote data-q="'+esc(u.q)+'" data-i="'+ii+'" title="Edit this note">✎</button>'+
            '<button type="button" class="aed-del" data-aeddelnote data-q="'+esc(u.q)+'" data-i="'+ii+'" title="Delete this note">✕</button></div>'; }).join('')+
        '</div>';
      }).join('')+'</div>';
    } else h+='<div class="aed-empty">no notes yet — add one above</div>';
    h+='</div>';
  }
  return h;
}
// Quarter <option>s: the tracked quarters (CALL_EARNINGS) plus any already used by this sub-theme,
// newest first. `sel` pre-selects; `blank` is the empty option label.
function snQuarterOpts(sel, blank, extra){
  var seen={}, list=[];
  (CALL_EARNINGS.quarters||[]).forEach(function(q){ if(!seen[q.q]){ seen[q.q]=1; list.push(q.q); } });
  (extra||[]).forEach(function(q){ if(q && !seen[q]){ seen[q]=1; list.push(q); } });
  list.sort(function(a,b){ return (ceQnum(b)||0)-(ceQnum(a)||0); });
  var out='<option value="">'+esc(blank||'—')+'</option>';
  list.forEach(function(q){ out+='<option value="'+esc(q)+'"'+(sel===q?' selected':'')+'>'+esc(q)+'</option>'; });
  return out;
}
function snRenderEditor(root){
  var host=root&&root.querySelector('[data-sneditor]'); if(!host) return;
  host.innerHTML=snEditorBody();
  host.querySelectorAll('[data-aedseg]').forEach(function(b){ b.onclick=function(){ _edSeg=b.getAttribute('data-aedseg'); _edSub=null; snRenderEditor(root); }; });
  host.querySelectorAll('[data-aedsub]').forEach(function(b){ b.onclick=function(){ _edSub=b.getAttribute('data-aedsub'); snRenderEditor(root); }; });
  var addSeg=host.querySelector('[data-aedaddseg]');
  if(addSeg) addSeg.onclick=function(){ ceInlinePop(addSeg, { title:'New Theme (segment) name' }, function(n){ if(SN_SEG_ORDER.indexOf(n)<0) SN_SEG_ORDER.push(n); _edSeg=n; _edSub=null; snRenderEditor(root); snRerenderRecord(root); }); };
  var addSub=host.querySelector('[data-aedaddsub]');
  if(addSub) addSub.onclick=function(){ if(!_edSeg){ ceInlinePop(addSub, { title:'Pick a Theme first.', confirm:true, ok:'OK' }, function(){}); return; } ceInlinePop(addSub, { title:'New Sub-theme under “'+_edSeg+'”' }, function(n){ if(!snSubsOf(_edSeg).some(function(s){ return s.theme===n; })) SN_THEMES.push({ seg:_edSeg, theme:n, why:'', updates:[], st:{ k:'watch' } }); _edSub=n; snRenderEditor(root); snRerenderRecord(root); }); };
  var delSeg=host.querySelector('[data-aeddelseg]');
  if(delSeg) delSeg.onclick=function(){ if(!_edSeg) return; var nsub=snSubsOf(_edSeg).length;
    ceInlinePop(delSeg, { title:'Delete Theme “'+_edSeg+'”'+(nsub?(' and its '+nsub+' sub-theme'+(nsub>1?'s':'')+' (and their notes)'):'')+'?', confirm:true, ok:'Delete', danger:true }, function(){
      for(var k=SN_THEMES.length-1;k>=0;k--){ if(SN_THEMES[k].seg===_edSeg) SN_THEMES.splice(k,1); }
      var si=SN_SEG_ORDER.indexOf(_edSeg); if(si>=0) SN_SEG_ORDER.splice(si,1);
      _edSeg=null; _edSub=null; snRenderEditor(root); snRerenderRecord(root);
    });
  };
  // ── the selected sub-theme's editable detail (tracking window · notes by quarter) ──
  var cur=snSubsOf(_edSeg).filter(function(s){ return s.theme===_edSub; })[0];
  if(cur){
    var delsub=host.querySelector('[data-aeddelsub]');
    if(delsub) delsub.onclick=function(){ ceInlinePop(delsub, { title:'Delete sub-theme “'+cur.theme+'” and its notes?', confirm:true, ok:'Delete', danger:true }, function(){ var i=SN_THEMES.indexOf(cur); if(i>=0) SN_THEMES.splice(i,1); _edSub=null; snRenderEditor(root); snRerenderRecord(root); }); };
    var ts=host.querySelector('[data-aedts]');
    if(ts) ts.onchange=function(){ cur.st=cur.st||{ k:'watch' }; if(ts.value) cur.st.since=ts.value; else delete cur.st.since; snRenderEditor(root); snRerenderRecord(root); };
    var tu=host.querySelector('[data-aedtu]');
    if(tu) tu.onchange=function(){ cur.trackUntil=tu.value||null; snRenderEditor(root); snRerenderRecord(root); };
    host.querySelectorAll('[data-aeddelnote]').forEach(function(b){ b.onclick=function(){
      var q=b.getAttribute('data-q'), ix=+b.getAttribute('data-i');
      var u=(cur.updates||[]).filter(function(x){ return x.q===q; })[0]; if(!u) return;
      u.items.splice(ix,1);
      if(!u.items.length) cur.updates=cur.updates.filter(function(x){ return x!==u; });
      snRenderEditor(root); snRerenderRecord(root);
    }; });
    host.querySelectorAll('[data-aedednote]').forEach(function(b){ b.onclick=function(){
      var q=b.getAttribute('data-q'), ix=+b.getAttribute('data-i');
      var u=(cur.updates||[]).filter(function(x){ return x.q===q; })[0]; if(!u||u.items[ix]==null) return;
      ceInlinePop(b, { title:'Edit note · '+q+'  (HTML ok, e.g. <b>…</b>)', value:u.items[ix], multiline:true }, function(nv){
        u.items[ix]=nv; snRenderEditor(root); snRerenderRecord(root);
      });
    }; });
    var addNote=host.querySelector('[data-aedaddnote]');
    if(addNote) addNote.onclick=function(){
      var q=host.querySelector('[data-aednoteq]').value, tx=(host.querySelector('[data-aednotetext]').value||'').trim();
      if(!q){ ceInlinePop(addNote, { title:'Pick a quarter for the note first.', confirm:true, ok:'OK' }, function(){}); return; }
      if(!tx) return;
      cur.updates=cur.updates||[];
      var u=cur.updates.filter(function(x){ return x.q===q; })[0];
      if(u && ceNoteDup(u.items, tx)){   // identical note already filed under this quarter — block + tell the user
        ceInlinePop(addNote, { title:'This note is already filed under '+q+' — not added again.', confirm:true, ok:'OK' }, function(){});
        return;
      }
      if(!u){ u={ q:q, items:[] }; cur.updates.push(u); cur.updates.sort(function(a,z){ return (ceQnum(a.q)||0)-(ceQnum(z.q)||0); }); }
      u.items.push(tx);
      snRenderEditor(root); snRerenderRecord(root);
    };
  }
}
// ── Inline per-sub-theme editor (opened from the "✎ Edit / Add note" button inside a sub-theme in
// the record). Same box as the ✎ panel: Tracking window + Add a note + notes with edit/delete. ──
function snInlineEdit(ct){
  var extraQ=(ct.updates||[]).map(function(u){ return u.q; });
  var h='<div class="aed-detail rec-edit" style="margin-top:10px">';
  h+='<label class="aed-flb">Tracking window</label>'+
     '<div class="aed-track"><span>Tracking since <select class="aed-sel" data-rects>'+snQuarterOpts((ct.st&&ct.st.since)||'', '— none —', extraQ)+'</select></span>'+
     '<span>Tracking until <select class="aed-sel" data-rectu>'+snQuarterOpts(ct.trackUntil||'', '— still open —', extraQ)+'</select></span>'+
     '<span class="aed-hookst '+(snHookClosed(ct)?'closed':(snHookOpen(ct)?'open':''))+'">'+(snHookClosed(ct)?'closed':(snHookOpen(ct)?'open hook':'not tracked'))+'</span></div>';
  h+='<label class="aed-flb">Add a note</label>'+
     '<div class="aed-addnote"><select class="aed-sel" data-recnq>'+snQuarterOpts('', '— quarter —', extraQ)+'</select>'+
     '<input type="text" data-recntext placeholder="new note for that quarter (bold ok: &lt;b&gt;…&lt;/b&gt;)">'+
     '<button type="button" class="aed-mini" data-recadd>+ Add note</button></div>';
  h+='<label class="aed-flb">Notes by quarter</label>';
  if(ct.updates&&ct.updates.length){
    h+='<div class="aed-notes">'+ct.updates.map(function(u){
      return '<div class="aed-qgroup"><span class="aed-note-q">'+esc(u.q)+'</span>'+
        u.items.map(function(it,ii){ return '<div class="aed-note-row"><span>'+it+'</span>'+
          '<button type="button" class="aed-ed" data-recednote data-q="'+esc(u.q)+'" data-i="'+ii+'" title="Edit this note">✎</button>'+
          '<button type="button" class="aed-del" data-recdelnote data-q="'+esc(u.q)+'" data-i="'+ii+'" title="Delete this note">✕</button></div>'; }).join('')+
      '</div>'; }).join('')+'</div>';
  } else h+='<div class="aed-empty">no notes yet — add one above</div>';
  h+='<div class="aed-frow" style="margin-top:10px"><button type="button" class="aed-mini alt" data-recdone>Done</button></div>';
  h+='</div>';
  return h;
}


// ════ SN entry points ═══════════════════════════════════════════════════════════════════════════
// The Earnings subpane's inner HTML — amzn.js deepDiveHtml lines, verbatim.
export function snCeHtml(c){
  _co=c;          // company (id + ticker) for the theme-record persistence
  ceStyleReset(); // one copy of the Earnings CSS per render
  return '<div class="ce-phtabs">'+
      '<button type="button" class="ce-phtab active" data-cep="setup">Setup</button>'+
      '<button type="button" class="ce-phtab" data-cep="results">Post-Results</button>'+
      '<button type="button" class="ce-phtab" data-cep="watch">Notes</button>'+
    '</div>'+
    ceQPills()+
    '<div class="ce-phpane" data-cep="setup">'+ceSetupBody(c)+'</div>'+
    '<div class="ce-phpane" data-cep="results" hidden>'+ceResultsBody(c)+'</div>'+
    '<div class="ce-phpane" data-cep="watch" hidden>'+ceWatchBody(c)+'</div>';
}
// The Earnings wiring from amzn.js wireDD, verbatim (phase tabs · quarter pills · toggles · Notes).
export function snCeWire(root){
  wireCallEarnings(root);
  wireCeTrack(root);
  wireThemeRecord(root);
  root.querySelectorAll('.sn-edit-tog[data-sneditog]').forEach(function(btn){ btn.onclick=function(){
    var wrap=btn.closest('.sn-edit'); if(!wrap) return;
    var body=wrap.querySelector('.sn-edit-body'); if(!body) return;
    var open=body.hidden; body.hidden=!open;
    wrap.setAttribute('data-open', open?'1':'0');
    btn.setAttribute('aria-expanded', open?'true':'false');
  }; });
  snRenderEditor(root);
  snHydrateThemes(root);
}
// amzn.js aBuildSub('evolution','earnings'): build the Setup chart when Setup is the active phase.
export function snCeBuild(root){
  var ph=root.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phtab.active');
  if(!ph || ph.getAttribute('data-cep')==='setup') requestAnimationFrame(gBuildCeAnnual);
}
// The ceQ "?" pop-ups resolve through the profile modal as data-detail="ce:<id>".
export function snCePop(id){ return CE_POP[id]||null; }
export { ceEqualizeTabBars as snCeEqualize };