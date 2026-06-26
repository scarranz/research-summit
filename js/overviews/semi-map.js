// overviews/semi-map.js — interactive semiconductor supply-chain map.
//
// Reusable across any semiconductor company's Overview (NVIDIA, TSMC, ASML, …).
// Three drill-down levels, kept visually clean — detail accrues in a bottom panel:
//
//   Level 0 — the big buckets (Materials → Equipment → EDA → Fabless → Foundry →
//             Memory → Networking → End markets), shown in value-chain flow order.
//   Level 1 — click a bucket → its sub-segments.
//   Level 2 — click a sub-segment → its companies. Click a company → full detail.
//
// Usage from a company overview module:
//   import { semiMap } from './semi-map.js';
//   semiMap.html({ highlight:'NVDA' })   // returns the map HTML (highlights NVIDIA)
//   semiMap.init()                       // wires interactions (call when pane is visible)
//
// All state lives on the root element's dataset, so the module is stateless/reentrant.

import { BUCKETS, getBucket, getGroup, bucketsWithTicker, LOGO_DOMAIN, logoCandidates, wireLogoFallback } from './semi-map-data.js';
import { COMPANY_RELS } from './semi-company-rels.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtAmt(v){ if(v==null) return '—'; if(v>=1e9) return '$'+(v/1e9).toFixed(2)+'B'; if(v>=1e6) return '$'+(v/1e6).toFixed(0)+'M'; return '$'+Math.round(v); }
// <img> markup for a company logo (parqet → clearbit → favicon chain). '' if no source.
function logoImg(cls, ticker, domain){
  var c = logoCandidates(ticker, domain);
  if (!c.length) return '';
  return '<img class="'+cls+'" src="'+esc(c[0])+'" data-srcs="'+esc(c.slice(1).join(' '))+'" alt="">';
}
function wireImgs(root){ root.querySelectorAll('img[data-srcs]').forEach(wireLogoFallback); }

// ─── Static shell ─────────────────────────────────────────────────────────────
function html(opts){
  opts = opts || {};
  var hl = opts.highlight ? ' data-hl="'+esc(opts.highlight)+'"' : '';
  return '<div class="smap"'+hl+'>'+
      '<div class="smap-intro">The semiconductor industry is <b>not vertically integrated</b> — each link in the chain is a distinct set of companies. '+
        'Click a bucket to drill in; select any node to see detail below.</div>'+
      '<nav class="smap-bc" aria-label="breadcrumb"></nav>'+
      '<div class="smap-stage"></div>'+
      '<div class="smap-panel"></div>'+
    '</div>';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function path(root){ var p = root.getAttribute('data-path'); return p ? p.split('/') : []; }
function setPath(root, arr){ root.setAttribute('data-path', arr.join('/')); }
function hl(root){ return root.getAttribute('data-hl') || ''; }

function companyCount(bucket){
  var n = 0; bucket.groups.forEach(function(g){ n += g.companies.length; }); return n;
}
function tagBadges(tags){
  if (!tags || !tags.length) return '';
  return '<div class="smap-tags">'+tags.map(function(t){ return '<span class="smap-tag">'+esc(t)+'</span>'; }).join('')+'</div>';
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
function renderBC(root){
  var p = path(root);
  var bc = root.querySelector('.smap-bc');
  var html = '<button type="button" class="smap-crumb" data-to="">Industry</button>';
  if (p[0]){
    var b = getBucket(p[0]);
    html += '<span class="smap-sep">›</span><button type="button" class="smap-crumb" data-to="'+esc(p[0])+'">'+esc(b?b.name:p[0])+'</button>';
  }
  if (p[1]){
    var g = getGroup(p[0], p[1]);
    html += '<span class="smap-sep">›</span><button type="button" class="smap-crumb" data-to="'+esc(p[0]+'/'+p[1])+'">'+esc(g?g.name:p[1])+'</button>';
  }
  bc.innerHTML = html;
}

// ─── Stage (the node cards for the current level) ─────────────────────────────
function renderStage(root){
  var p = path(root);
  var stage = root.querySelector('.smap-stage');
  var highlight = hl(root);

  // Level 0 — buckets in flow order.
  if (p.length === 0){
    var hlBuckets = highlight ? bucketsWithTicker(highlight) : [];
    var cards = BUCKETS.slice().sort(function(a,b){ return a.flow-b.flow; }).map(function(b){
      var on = hlBuckets.indexOf(b.id) >= 0;
      return '<button type="button" class="smap-node smap-bucket'+(on?' is-hl':'')+'" data-node="'+esc(b.id)+'" style="--accent:'+esc(b.accent)+'">'+
          '<span class="smap-flow">'+b.flow+'</span>'+
          '<span class="smap-node-t">'+esc(b.name)+'</span>'+
          '<span class="smap-node-tag">'+esc(b.tag)+'</span>'+
          '<span class="smap-node-n">'+companyCount(b)+' companies'+(on?' · incl. '+esc(highlight):'')+'</span>'+
        '</button>';
    }).join('<span class="smap-arrow">→</span>');
    stage.className = 'smap-stage smap-flowrow';
    stage.innerHTML = cards;
    return;
  }

  // Level 1 — sub-segments of a bucket.
  if (p.length === 1){
    var b = getBucket(p[0]); if (!b){ setPath(root, []); return renderStage(root); }
    stage.className = 'smap-stage smap-grid';
    stage.style.setProperty('--accent', b.accent);
    stage.innerHTML = b.groups.map(function(g){
      var hlHit = highlight && g.companies.some(function(c){ return c.ticker===highlight; });
      return '<button type="button" class="smap-node smap-group'+(hlHit?' is-hl':'')+'" data-node="'+esc(g.id)+'" style="--accent:'+esc(b.accent)+'">'+
          '<span class="smap-node-t">'+esc(g.name)+'</span>'+
          '<span class="smap-node-n">'+g.companies.length+' companies</span>'+
        '</button>';
    }).join('');
    return;
  }

  // Level 2 — companies of a sub-segment.
  var b2 = getBucket(p[0]); var g2 = getGroup(p[0], p[1]);
  if (!g2){ setPath(root, [p[0]]); return renderStage(root); }
  stage.className = 'smap-stage smap-grid';
  stage.style.setProperty('--accent', b2.accent);
  stage.innerHTML = g2.companies.map(function(c){
    var isHl = highlight && c.ticker===highlight;
    var logo = logoImg('smap-co-logo', c.ticker, LOGO_DOMAIN[c.ticker])
            || '<span class="smap-co-logo smap-co-logo-x" style="background:'+esc(b2.accent)+'"></span>';
    return '<button type="button" class="smap-node smap-co'+(isHl?' is-hl':'')+'" data-node="co:'+esc(c.ticker)+'" style="--accent:'+esc(b2.accent)+'">'+
        logo +
        '<span class="smap-co-name">'+esc(c.name)+'</span>'+
        '<span class="smap-co-tkr">'+esc(c.ticker)+'</span>'+
      '</button>';
  }).join('');
}

// ─── Bottom detail panel ──────────────────────────────────────────────────────
function panelHTML_root(root){
  var highlight = hl(root);
  var lead = '<div class="smap-p-h">Semiconductor Supply Chain</div>'+
    '<p class="smap-p-d">Eight buckets, upstream to downstream. The industry\'s lack of vertical integration is exactly what makes a detailed map useful — most companies do one link well and depend on the others.</p>';
  if (highlight){
    var ids = bucketsWithTicker(highlight);
    var where = ids.map(function(id){ var b=getBucket(id); return b?b.name:id; }).join(' and ');
    lead += '<div class="smap-p-callout"><b>'+esc(highlight)+'</b> appears in '+(ids.length||0)+' bucket'+(ids.length===1?'':'s')+(where?': '+esc(where):'')+'. Highlighted in the map above.</div>';
  }
  return lead;
}
function panelHTML_bucket(b){
  return '<div class="smap-p-h" style="--accent:'+esc(b.accent)+'"><span class="smap-p-dot"></span>'+esc(b.name)+' <span class="smap-p-sub">· step '+b.flow+' of 8</span></div>'+
    '<p class="smap-p-d">'+esc(b.desc)+'</p>'+
    '<div class="smap-p-meta">'+b.groups.length+' sub-segments · '+companyCount(b)+' companies — select a sub-segment to drill in.</div>';
}
function panelHTML_group(b, g){
  return '<div class="smap-p-h" style="--accent:'+esc(b.accent)+'"><span class="smap-p-dot"></span>'+esc(g.name)+' <span class="smap-p-sub">· '+esc(b.name)+'</span></div>'+
    '<p class="smap-p-d">'+esc(g.desc)+'</p>'+
    '<div class="smap-p-meta">'+g.companies.length+' companies — select one for detail.</div>';
}
// Top-5 suppliers / customers from the Bloomberg SPLC data (shown at the end of a company panel).
function top5(ticker){
  var data = COMPANY_RELS[ticker]; if (!data) return '';
  function lst(rows, label){
    var top = rows.slice(0, 5); if (!top.length) return '';
    return '<div class="smap-p-rel-h">'+label+'</div><ul class="smap-rel5">'+top.map(function(r){
      var ic = logoImg('smap-rel5-logo', r.id, r.dom) || '<span class="smap-rel5-dot"></span>';
      return '<li>'+ic+'<span class="smap-rel5-n">'+esc(r.name)+'</span><b>'+fmtAmt(r.amt)+'</b></li>';
    }).join('')+'</ul>';
  }
  return '<div class="smap-rel5-wrap">'+ lst(data.suppliers,'Top 5 suppliers') + lst(data.customers,'Top 5 customers') +'</div>';
}
function panelHTML_company(b, c){
  var h = '<div class="smap-p-h" style="--accent:'+esc(b.accent)+'"><span class="smap-p-dot"></span>'+esc(c.name)+' <span class="smap-p-sub">· '+esc(c.ticker)+'</span></div>';
  h += tagBadges(c.tags);
  h += '<p class="smap-p-d">'+esc(c.note)+'</p>';
  if (c.rel && c.rel.length){
    h += '<div class="smap-p-rel-h">Key relationships</div><ul class="smap-p-rel">'+
      c.rel.map(function(r){ return '<li>'+esc(r)+'</li>'; }).join('')+'</ul>';
  }
  h += '<div class="smap-p-meta">'+esc(b.name)+' → '+esc(b.groups.filter(function(g){return g.companies.indexOf(c)>=0;}).map(function(g){return g.name;})[0]||'')+'</div>';
  h += top5(c.ticker);
  return h;
}
function renderPanel(root, sel){
  var panel = root.querySelector('.smap-panel');
  var p = path(root);
  // sel: optional {type:'co', ticker} for a clicked company at level 2.
  if (sel && sel.type === 'co'){
    var b = getBucket(p[0]); var g = getGroup(p[0], p[1]);
    var co = g && g.companies.filter(function(c){ return c.ticker===sel.ticker; })[0];
    if (co){ panel.innerHTML = panelHTML_company(b, co); return; }
  }
  if (p.length === 2){ panel.innerHTML = panelHTML_group(getBucket(p[0]), getGroup(p[0],p[1])); return; }
  if (p.length === 1){ panel.innerHTML = panelHTML_bucket(getBucket(p[0])); return; }
  panel.innerHTML = panelHTML_root(root);
}

// ─── Render the whole current level ───────────────────────────────────────────
function render(root, sel){
  renderBC(root);
  renderStage(root);
  renderPanel(root, sel);
  wireImgs(root);
}

// ─── Interaction wiring (delegated; idempotent) ───────────────────────────────
function init(){
  var root = document.querySelector('.smap');
  if (!root || root._wired) { if (root) render(root); return; }
  root._wired = true;

  // Node clicks (stage).
  root.querySelector('.smap-stage').addEventListener('click', function(e){
    var btn = e.target.closest('.smap-node'); if (!btn) return;
    var node = btn.getAttribute('data-node');
    var p = path(root);
    if (node.indexOf('co:') === 0){
      // Company leaf — select only (no drill), mark active.
      root.querySelectorAll('.smap-node').forEach(function(n){ n.classList.remove('is-sel'); });
      btn.classList.add('is-sel');
      renderPanel(root, { type:'co', ticker: node.slice(3) });
      wireImgs(root);
      return;
    }
    // Bucket or group — drill in.
    setPath(root, p.concat(node));
    render(root);
  });

  // Breadcrumb clicks (navigate up).
  root.querySelector('.smap-bc').addEventListener('click', function(e){
    var crumb = e.target.closest('.smap-crumb'); if (!crumb) return;
    setPath(root, (crumb.getAttribute('data-to')||'').split('/').filter(Boolean));
    render(root);
  });

  render(root);
}

export var semiMap = { html: html, init: init };
