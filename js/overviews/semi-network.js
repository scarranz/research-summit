// overviews/semi-network.js — "Network" view: high-level SEGMENT map.
//
// The 9 supply-chain buckets as nodes, with the aggregated money flow between them
// (the 676 company-level Bloomberg SPLC relationships rolled up to segment → segment).
// Arrows point from supplier segment to customer segment.
//
// Which segment flows are shown: each segment's TOP-2 outflows and TOP-2 inflows (above a
// small floor). This surfaces every segment's principal relationships — e.g. EDA → Fabless —
// even when small in absolute $, instead of only the globally-largest dollar flows.
//
// Each segment circle also shows the logos of its largest companies (HTML overlay, so it
// uses the same logo sources the rest of the portal does — no canvas/CORS issues).
//
// A company-level drill-down (select a company → its own suppliers/customers) is next.

import { BUCKETS, MCAP, LOGO_DOMAIN, logoCandidates, wireLogoFallback, uniqueCompanies, getBucket } from './semi-map-data.js';
import { SPLC_EDGES } from './semi-edges.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtAmt(v){ if(v==null) return '—'; if(v>=1e9) return '$'+(v/1e9).toFixed(1)+'B'; if(v>=1e6) return '$'+(v/1e6).toFixed(0)+'M'; return '$'+Math.round(v); }

// ─── Lazy CDN loader (core only) ──────────────────────────────────────────────
var _loading = null;
function ensureCytoscape(){
  if (window.cytoscape) return Promise.resolve();
  if (_loading) return _loading;
  _loading = new Promise(function(res, rej){
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/cytoscape@3.30.2/dist/cytoscape.min.js';
    s.onload = res; s.onerror = function(){ rej(new Error('cytoscape load failed')); };
    document.head.appendChild(s);
  });
  return _loading;
}

// ─── Aggregate company edges → segment edges ──────────────────────────────────
function aggregate(){
  var t2b = {}, comps = {}, mcap = {}, byBucket = {};
  uniqueCompanies().forEach(function(u){
    t2b[u.co.ticker] = u.bucket.id;
    comps[u.bucket.id] = (comps[u.bucket.id]||0)+1;
    mcap[u.bucket.id] = (mcap[u.bucket.id]||0)+(MCAP[u.co.ticker]||4);
    (byBucket[u.bucket.id] = byBucket[u.bucket.id]||[]).push(u.co.ticker);
  });
  var agg = {};
  SPLC_EDGES.forEach(function(e){
    var ba=t2b[e.a], bb=t2b[e.b];
    if (!ba || !bb || ba===bb) return;
    var k = ba+'|'+bb;
    var o = agg[k] || (agg[k] = { a:ba, b:bb, sum:0, count:0 });
    o.sum += (e.amt||0); o.count++;
  });
  return { edges:Object.keys(agg).map(function(k){return agg[k];}), comps:comps, mcap:mcap, byBucket:byBucket };
}

// Top-N companies (by market cap) in a bucket that have a logo domain.
function topLogos(bucketId, n){
  var list = (_agg.byBucket[bucketId]||[]).filter(function(t){ return LOGO_DOMAIN[t]; });
  list.sort(function(a,b){ return (MCAP[b]||0)-(MCAP[a]||0); });
  return list.slice(0, n).map(function(t){ return { ticker:t, domain:LOGO_DOMAIN[t] }; });
}

var _cy = null, _agg = null, _bname = {}, _raf = null, _t2b = {}, _tname = {};

function buildElements(){
  _agg = aggregate();
  BUCKETS.forEach(function(b){ _bname[b.id]=b.name; });
  // ticker → bucket / name lookups for company-level expansion in the detail box
  _t2b = {}; _tname = {};
  uniqueCompanies().forEach(function(u){ _t2b[u.co.ticker]=u.bucket.id; _tname[u.co.ticker]=u.co.name; });
  var maxSum = _agg.edges.reduce(function(m,e){ return Math.max(m, e.sum); }, 1);
  var maxMc  = Object.keys(_agg.mcap).reduce(function(m,k){ return Math.max(m, _agg.mcap[k]); }, 1);

  var els = [];
  BUCKETS.forEach(function(b){
    var mc = _agg.mcap[b.id]||0;
    var size = Math.max(230, Math.min(420, 150 + Math.sqrt(mc/maxMc)*300));
    els.push({ data:{ id:b.id, label:b.name, accent:b.accent, flow:b.flow, size:size, ncos:_agg.comps[b.id]||0 } });
  });

  // Keep each segment's top-2 outflows and top-2 inflows (above a small floor).
  var bySrc={}, byTgt={};
  _agg.edges.forEach(function(e){ (bySrc[e.a]=bySrc[e.a]||[]).push(e); (byTgt[e.b]=byTgt[e.b]||[]).push(e); });
  var keep = new Set();
  function topK(arr){ return arr.slice().sort(function(x,y){return y.sum-x.sum;}).slice(0,2); }
  Object.keys(bySrc).forEach(function(s){ topK(bySrc[s]).forEach(function(e){ keep.add(e); }); });
  Object.keys(byTgt).forEach(function(t){ topK(byTgt[t]).forEach(function(e){ keep.add(e); }); });
  var FLOOR = 100e6;
  _agg.edges.filter(function(e){ return keep.has(e) && e.sum>=FLOOR; }).forEach(function(e, i){
    els.push({ data:{ id:'s'+i, source:e.a, target:e.b, sum:e.sum, count:e.count,
      w: 1.8 + 9*Math.pow(e.sum/maxSum, 0.55), accent:getBucket(e.a).accent } });
  });
  return els;
}

function styleSheet(){
  return [
    { selector:'node', style:{
      'background-color':'data(accent)','background-opacity':0.12,'width':'data(size)','height':'data(size)',
      'label':'data(label)','color':'#1E2733','font-size':30,'font-weight':700,
      'text-valign':'bottom','text-margin-y':10,'text-wrap':'wrap','text-max-width':260,
      'text-background-color':'#fff','text-background-opacity':0.9,'text-background-padding':6,'text-background-shape':'roundrectangle',
      'border-width':3,'border-color':'data(accent)' }},
    { selector:'edge', style:{
      'width':'data(w)','line-color':'data(accent)','opacity':0.5,'curve-style':'bezier',
      'control-point-step-size':55,'target-arrow-shape':'triangle','target-arrow-color':'data(accent)','arrow-scale':1.15 }},
    { selector:'.faded', style:{ 'opacity':0.08,'text-opacity':0.3 }},
    { selector:'node.hot', style:{ 'border-width':3.5,'z-index':40 }},
    { selector:'edge.hot', style:{ 'opacity':0.95,'z-index':40 }},
  ];
}

// Segment zoom toggle (one chip per segment + an "All" chip).
function segtabsHtml(){
  var tabs = BUCKETS.slice().sort(function(a,b){ return a.flow-b.flow; }).map(function(b){
    return '<button type="button" class="snet-segtab" data-seg="'+esc(b.id)+'" style="--accent:'+esc(b.accent)+'">'+esc(b.name)+'</button>';
  }).join('');
  return '<div class="snet-segtabs" id="snetSegtabs">'+
    '<button type="button" class="snet-segtab snet-segtab-all active" data-seg="">All segments</button>'+tabs+'</div>';
}

// ─── Static shell ─────────────────────────────────────────────────────────────
function html(opts){
  opts = opts || {};
  var hl = opts.highlight ? ' data-hl="'+esc(opts.highlight)+'"' : '';
  return '<div class="snet"'+hl+'>'+
      '<div class="snet-toolbar">'+
        '<div class="snet-legend">Arrows point <b>supplier segment → customer segment</b>; width = total $ flow · node size ≈ segment market cap · logos = largest companies · Bloomberg SPLC.</div>'+
        '<div class="snet-ctl-btns">'+
          '<button type="button" class="snet-btn" data-act="expand">Expand</button>'+
          '<button type="button" class="snet-btn" data-act="fit">Reset</button>'+
        '</div>'+
      '</div>'+
      segtabsHtml()+
      '<div class="snet-canvas" id="snetCanvas"><div class="snet-loading">Loading map…</div>'+
        '<div class="snet-logos" id="snetLogos"></div><div class="snet-tip" id="snetTip" hidden></div></div>'+
      '<div class="smap-panel snet-panel"></div>'+
    '</div>';
}

// ─── Logo overlay ─────────────────────────────────────────────────────────────
function buildLogoOverlay(){
  var layer = document.getElementById('snetLogos'); if (!layer) return;
  layer.innerHTML = '';
  BUCKETS.forEach(function(b){
    var n = _cy.getElementById(b.id);
    var sz = n.data('size');
    var logos = topLogos(b.id, sz >= 360 ? 5 : sz >= 280 ? 4 : 3);
    if (!logos.length) return;
    var grp = document.createElement('div'); grp.className = 'snet-logo-grp'; grp.dataset.bucket = b.id;
    logos.forEach(function(L){
      var cands = logoCandidates(L.ticker, L.domain); if (!cands.length) return;
      var img = document.createElement('img'); img.className = 'snet-logo'; img.alt = L.ticker;
      img.src = cands[0]; img.setAttribute('data-srcs', cands.slice(1).join(' '));
      wireLogoFallback(img);
      grp.appendChild(img);
    });
    layer.appendChild(grp);
  });
  positionLogos();
}
function positionLogos(){
  if (!_cy) return;
  var grps = document.querySelectorAll('#snetLogos .snet-logo-grp');
  grps.forEach(function(grp){
    var n = _cy.getElementById(grp.dataset.bucket); if (!n || !n.length) return;
    var p = n.renderedPosition(), rw = n.renderedWidth(), rh = n.renderedHeight();
    var sz = Math.max(18, Math.min(96, rw*0.19));
    grp.querySelectorAll('img').forEach(function(im){ im.style.width = sz+'px'; im.style.height = sz+'px'; });
    grp.style.left = p.x+'px';
    grp.style.top  = (p.y - rh*0.16)+'px';
  });
}
function scheduleReposition(){ if (_raf) return; _raf = requestAnimationFrame(function(){ _raf=null; positionLogos(); }); }

// ─── Detail panel ─────────────────────────────────────────────────────────────
function panelDefault(root){
  root.querySelector('.snet-panel').innerHTML =
    '<div class="smap-p-h">Supply-Chain Segments · Bloomberg SPLC</div>'+
    '<p class="smap-p-d">Each circle is a segment; arrows show the aggregate money flow between segments (who sells to whom). <b>Click a circle</b> to fade everything unrelated and see only its relationships. Use the <b>chips above</b> to zoom into a segment. Hover an arrow for the total.</p>';
}
// Clickable company logos for a segment (click → open the Company view on that company).
function segLogos(bid){
  var all = (_agg.byBucket[bid]||[]).slice().sort(function(a,b){ return (MCAP[b]||0)-(MCAP[a]||0); });
  if (!all.length) return '';
  var list = all.slice(0, 12);
  var more = all.length - list.length;
  var chips = list.map(function(t){
    var dom = LOGO_DOMAIN[t], nm = _tname[t]||t;
    var cands = logoCandidates(t, dom);
    var inner = cands.length ? '<img src="'+esc(cands[0])+'" data-srcs="'+esc(cands.slice(1).join(' '))+'" alt="'+esc(nm)+'">'
                             : '<span class="snet-co-txt">'+esc(nm)+'</span>';
    return '<button type="button" class="snet-co-logo" data-co="'+esc(t)+'" title="'+esc(nm)+'">'+inner+'</button>';
  }).join('');
  var moreChip = more>0 ? '<span class="snet-co-more">+'+more+' more</span>' : '';
  return '<div class="smap-p-rel-h">Companies in this segment <span class="snet-hint">(click a logo to open it)</span></div><div class="snet-box-logos">'+chips+moreChip+'</div>';
}
// Clickable segment-flow rows. Clicking expands the underlying company relationships.
function flowList(id, dir){
  var rows = _agg.edges.filter(function(e){ return dir==='in' ? e.b===id : e.a===id; })
    .sort(function(a,b){ return b.sum-a.sum; }).slice(0,6);
  if (!rows.length) return '';
  var items = rows.map(function(e){
    var other = dir==='in' ? e.a : e.b;
    var src = dir==='in' ? other : id, tgt = dir==='in' ? id : other;
    return '<button type="button" class="snet-flow" data-src="'+esc(src)+'" data-tgt="'+esc(tgt)+'">'+
        '<span class="snet-flow-row"><span class="snet-flow-n">'+esc(_bname[other])+'</span>'+
        '<span class="snet-rel-t">'+fmtAmt(e.sum)+' · '+e.count+' links</span></span>'+
        '<span class="snet-flow-exp"></span></button>';
  }).join('');
  return '<div class="smap-p-rel-h">'+(dir==='in'?'Top supplier segments →':'→ Top customer segments')+'</div><div class="snet-flows">'+items+'</div>';
}
function pairLinks(src, tgt){
  return SPLC_EDGES.filter(function(e){ return _t2b[e.a]===src && _t2b[e.b]===tgt; })
    .sort(function(x,y){ return (y.amt||0)-(x.amt||0); });
}
function wireLogoErrors(el){ el.querySelectorAll('img[data-srcs]').forEach(wireLogoFallback); }
function panelBucket(root, b){
  var el = root.querySelector('.snet-panel');
  el.innerHTML =
    '<div class="smap-p-h" style="--accent:'+esc(b.accent)+'"><span class="smap-p-dot"></span>'+esc(b.name)+' <span class="smap-p-sub">· step '+b.flow+' · '+(_agg.comps[b.id]||0)+' companies</span></div>'+
    '<p class="smap-p-d">'+esc(b.desc)+'</p>'+ segLogos(b.id) + flowList(b.id,'in') + flowList(b.id,'out');
  wireLogoErrors(el);
}
function focusBucket(root, n){
  if (!_cy) return;
  _cy.elements().removeClass('hot faded');
  var hood = n.closedNeighborhood();
  _cy.elements().not(hood).addClass('faded');
  hood.nodes().addClass('hot'); hood.edges().addClass('hot');
  panelBucket(root, getBucket(n.id()));
}

// ─── Edge hover tooltip ───────────────────────────────────────────────────────
function showTip(e, ev){
  var tip = document.getElementById('snetTip'); if (!tip) return;
  tip.innerHTML = '<div class="snet-tip-h">'+esc(_bname[e.data('source')])+' <span>→</span> '+esc(_bname[e.data('target')])+'</div>'+
    '<div class="snet-tip-row"><span>Total flow</span><b>'+fmtAmt(e.data('sum'))+'</b></div>'+
    '<div class="snet-tip-row"><span>Company links</span><b>'+e.data('count')+'</b></div>';
  tip.hidden = false; moveTip(ev);
}
function moveTip(ev){
  var tip = document.getElementById('snetTip'); var canvas = document.getElementById('snetCanvas');
  if (!tip || !canvas || tip.hidden) return;
  var oe = ev && ev.originalEvent ? ev.originalEvent : ev; var r = canvas.getBoundingClientRect();
  var x = (oe.clientX!=null?oe.clientX-r.left:0)+14, y=(oe.clientY!=null?oe.clientY-r.top:0)+14;
  x = Math.min(x, canvas.clientWidth - tip.offsetWidth - 8); y = Math.min(y, canvas.clientHeight - tip.offsetHeight - 8);
  tip.style.left = Math.max(6,x)+'px'; tip.style.top = Math.max(6,y)+'px';
}
function hideTip(){ var tip=document.getElementById('snetTip'); if (tip) tip.hidden = true; }

// ─── Segment zoom (camera only — does NOT touch the fade/highlight state) ──────
function setActiveSeg(id){
  document.querySelectorAll('#snetSegtabs .snet-segtab').forEach(function(t){
    t.classList.toggle('active', t.getAttribute('data-seg')===(id||''));
  });
}
function zoomToSegment(id){
  if (!_cy) return;
  var n = _cy.getElementById(id); if (!n || !n.length) return;
  setActiveSeg(id);
  _cy.animate({ fit:{ eles:n, padding:70 } }, { duration:420 });
}
function zoomAll(){
  if (!_cy) return;
  setActiveSeg('');
  _cy.animate({ fit:{ eles:_cy.elements(), padding:25 } }, { duration:420 });
}
// Clear the fade/highlight (separate from the camera).
function clearFocus(root){
  if (!_cy) return;
  _cy.elements().removeClass('hot faded'); panelDefault(root);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function init(){
  var root = document.querySelector('.snet');
  if (!root) return;
  if (root._built){ if (_cy) requestAnimationFrame(function(){ _cy.resize(); _cy.fit(undefined,46); positionLogos(); }); return; }
  root._built = true;
  panelDefault(root);

  // Delegated clicks in the detail box: company logos → Company view; segment flows → expand.
  root.querySelector('.snet-panel').addEventListener('click', function(ev){
    var logo = ev.target.closest('.snet-co-logo');
    if (logo){ root.dispatchEvent(new CustomEvent('semi-select-company', { bubbles:true, detail:{ ticker:logo.getAttribute('data-co') } })); return; }
    var flow = ev.target.closest('.snet-flow');
    if (flow){
      var exp = flow.querySelector('.snet-flow-exp');
      if (flow.classList.toggle('open')){
        var links = pairLinks(flow.getAttribute('data-src'), flow.getAttribute('data-tgt'));
        exp.innerHTML = '<ul class="snet-links">'+links.map(function(l){
          return '<li><span>'+esc(_tname[l.a]||l.a)+' <i>→</i> '+esc(_tname[l.b]||l.b)+'</span><b>'+fmtAmt(l.amt)+'</b></li>';
        }).join('')+'</ul>';
      } else { exp.innerHTML=''; }
      return;
    }
  });

  root.querySelectorAll('.snet-btn').forEach(function(btn){
    var act = btn.getAttribute('data-act');
    btn.onclick = function(){
      if (act==='fit'){ clearFocus(root); zoomAll(); }
      if (act==='expand'){ var c=document.getElementById('snetCanvas'); c.classList.toggle('snet-canvas--big'); btn.textContent = c.classList.contains('snet-canvas--big')?'Shrink':'Expand'; if(_cy) requestAnimationFrame(function(){ _cy.resize(); zoomAll(); }); }
    };
  });

  // Segment zoom toggle: click a chip → ONLY zoom to that segment's circle ("All" → zoom out).
  // It does not touch the fade/highlight (that lives on clicking a circle).
  var segtabs = document.getElementById('snetSegtabs');
  if (segtabs) segtabs.addEventListener('click', function(ev){
    var btn = ev.target.closest('.snet-segtab'); if (!btn) return;
    var id = btn.getAttribute('data-seg');
    if (id) zoomToSegment(id); else zoomAll();
  });

  ensureCytoscape().then(function(){
    var canvas = document.getElementById('snetCanvas');
    if (!canvas || typeof window.cytoscape === 'undefined'){ if(canvas) canvas.innerHTML='<div class="snet-loading">Could not load the map library.</div>'; return; }
    var loadEl = canvas.querySelector('.snet-loading'); if (loadEl) loadEl.remove();
    var highlight = root.getAttribute('data-hl') || '';

    _cy = window.cytoscape({
      container: canvas, elements: buildElements(), style: styleSheet(),
      wheelSensitivity:0.2, minZoom:0.08, maxZoom:2.5,
      layout: { name:'circle', padding:25, spacingFactor:1.05, sort:function(a,b){ return a.data('flow')-b.data('flow'); } },
    });

    buildLogoOverlay();
    _cy.on('render', scheduleReposition);
    // Click a circle → fade everything unrelated + highlight its relationships (the key view).
    _cy.on('tap', 'node', function(evt){ focusBucket(root, evt.target); });
    // Click empty space → clear the fade.
    _cy.on('tap', function(evt){ if (evt.target===_cy){ clearFocus(root); } });
    _cy.on('mouseover', 'edge', function(evt){ showTip(evt.target, evt); });
    _cy.on('mousemove', 'edge', function(evt){ moveTip(evt); });
    _cy.on('mouseout', 'edge', hideTip);
    _cy.on('pan zoom', hideTip);
    // Note: highlight (e.g. NVDA) is a company; this is the segment map, so we show the
    // full map by default rather than auto-focusing one segment. The company-level
    // drill-down view will use the highlight.
  }).catch(function(){
    var canvas = document.getElementById('snetCanvas');
    if (canvas) canvas.innerHTML = '<div class="snet-loading">Could not load the map (offline?). The Flow view still works.</div>';
  });
}

// Primary bucket of a highlighted ticker (first occurrence in flow order).
function uniqueBucketOf(ticker){
  var hit = uniqueCompanies().filter(function(u){ return u.co.ticker===ticker; })[0];
  return hit ? hit.bucket.id : null;
}

export var semiNetwork = { html: html, init: init };
