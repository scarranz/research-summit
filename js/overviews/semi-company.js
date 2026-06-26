// overviews/semi-company.js — "Company" view: per-company supplier/customer map.
//
// Pick a company → it sits in the centre with its biggest SUPPLIERS fanned out on the
// left and biggest CUSTOMERS on the right (coloured by the segment each counterparty
// belongs to, with the company logo on the node where we have one). Below the map, two
// tables list ALL of its relationships from the Bloomberg SPLC document (amount, rev %, cost %).

import { getBucket } from './semi-map-data.js';
import { COMPANY_RELS } from './semi-company-rels.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtAmt(v){ if(v==null) return '—'; if(v>=1e9) return '$'+(v/1e9).toFixed(2)+'B'; if(v>=1e6) return '$'+(v/1e6).toFixed(0)+'M'; return '$'+Math.round(v); }
function fmtPct(v){ return v==null ? '—' : (+v).toFixed(1)+'%'; }
function segColor(seg){ var b = seg && getBucket(seg); return b ? b.accent : '#9aa6b4'; }
function segName(seg){ var b = seg && getBucket(seg); return b ? b.name : 'Other / external'; }
function clearbit(dom){ return 'https://logo.clearbit.com/'+dom; }
function favicon(dom){ return 'https://www.google.com/s2/favicons?domain='+dom+'&sz=64'; }
// Attach a clearbit → google-favicon → hide fallback chain to an <img>.
function wireImg(img){
  img.addEventListener('error', function(){
    var d = img.getAttribute('data-dom');
    if (!img.dataset.f){ img.dataset.f='1'; img.src = favicon(d); }
    else { img.style.visibility='hidden'; }
  });
}

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

var _cy = null, _sel = null, _raf = null;
var GRAPH_N = 10;   // suppliers / customers drawn in the graph (tables show all)

// ─── Static shell ─────────────────────────────────────────────────────────────
function companyOptions(selected){
  return Object.keys(COMPANY_RELS).map(function(id){
    return '<option value="'+esc(id)+'"'+(id===selected?' selected':'')+'>'+esc(COMPANY_RELS[id].name)+'</option>';
  }).join('');
}
function html(opts){
  opts = opts || {};
  var def = (opts.highlight && COMPANY_RELS[opts.highlight]) ? opts.highlight : Object.keys(COMPANY_RELS)[0];
  _sel = def;
  return '<div class="sco" data-sel="'+esc(def)+'">'+
      '<div class="sco-toolbar">'+
        '<label class="sco-pick"><span>Company</span>'+
          '<select id="scoSelect" class="sco-select">'+companyOptions(def)+'</select></label>'+
        '<div class="sco-sub" id="scoSub"></div>'+
      '</div>'+
      '<div class="sco-canvas" id="scoCanvas"><div class="snet-loading">Loading…</div><div class="sco-logos" id="scoLogos"></div></div>'+
      '<div class="sco-tables" id="scoTables"></div>'+
    '</div>';
}

// ─── Graph ────────────────────────────────────────────────────────────────────
function buildGraph(){
  var data = COMPANY_RELS[_sel]; if (!_cy || !data) return;
  var sup = data.suppliers.slice(0, GRAPH_N);
  var cus = data.customers.slice(0, GRAPH_N);
  var maxAmt = 1; sup.concat(cus).forEach(function(r){ if (r.amt>maxAmt) maxAmt=r.amt; });
  function sz(a){ return Math.max(30, Math.min(96, 20 + Math.sqrt((a||0)/maxAmt)*78)); }

  var els = [];
  els.push({ data:{ id:'__c', label:data.name, kind:'ctr', accent:segColor(data.seg), dom:data.dom||null, hasLogo:data.dom?1:0 }, position:{x:0,y:0}, classes:'ctr' });
  function place(list, side){
    var n=list.length;
    list.forEach(function(r,i){
      var id=(side<0?'s_':'c_')+i;
      els.push({ data:{ id:id, label:r.name, accent:segColor(r.seg), size:sz(r.amt), amt:r.amt, seg:r.seg,
          dom:r.dom||null, hasLogo:r.dom?1:0, coid:(r.id && COMPANY_RELS[r.id]) ? r.id : null },
        position:{ x:side*400, y:(i-(n-1)/2)*70 }, classes:(side<0?'sup':'cus') });
      var w = 1.4+6*Math.pow((r.amt||0)/maxAmt,0.6);
      els.push(side<0 ? { data:{ id:'e'+id, source:id, target:'__c', w:w } }
                      : { data:{ id:'e'+id, source:'__c', target:id, w:w } });
    });
  }
  place(sup,-1); place(cus,1);

  _cy.elements().remove();
  _cy.add(els);
  _cy.layout({ name:'preset', fit:true, padding:36 }).run();
  buildEgoLogos();
}

function graphStyle(){
  return [
    { selector:'node', style:{ 'background-color':'data(accent)','width':'data(size)','height':'data(size)',
      'label':'data(label)','font-size':10,'color':'#46505e','text-wrap':'ellipsis','text-max-width':150,
      'border-width':1,'border-color':'#fff' }},
    { selector:'node[hasLogo = 1]', style:{ 'background-color':'#fff','border-width':2.5,'border-color':'data(accent)' }},
    { selector:'node.ctr', style:{ 'background-color':'data(accent)','width':78,'height':78,'color':'#1E2733',
      'font-size':13,'font-weight':700,'text-valign':'bottom','text-margin-y':7,'text-max-width':180,'text-wrap':'wrap',
      'border-width':3,'border-color':'#1E2733' }},
    { selector:'node.ctr[hasLogo = 1]', style:{ 'background-color':'#fff' }},
    { selector:'node.sup', style:{ 'text-halign':'left','text-valign':'center','text-margin-x':-5 }},
    { selector:'node.cus', style:{ 'text-halign':'right','text-valign':'center','text-margin-x':5 }},
    { selector:'edge', style:{ 'width':'data(w)','line-color':'#c2cad4','curve-style':'bezier','opacity':0.7,
      'target-arrow-shape':'triangle','target-arrow-color':'#c2cad4','arrow-scale':0.8 }},
  ];
}

// ─── Logo overlay on graph nodes ──────────────────────────────────────────────
function buildEgoLogos(){
  var layer = document.getElementById('scoLogos'); if (!layer || !_cy) return;
  layer.innerHTML = '';
  _cy.nodes('[hasLogo = 1]').forEach(function(n){
    var dom = n.data('dom'); if (!dom) return;
    var g = document.createElement('div'); g.className = 'sco-logo-grp'; g.dataset.id = n.id();
    var img = document.createElement('img'); img.className = 'sco-logo-img'; img.src = clearbit(dom); img.setAttribute('data-dom', dom);
    wireImg(img); g.appendChild(img); layer.appendChild(g);
  });
  positionEgoLogos();
}
function positionEgoLogos(){
  if (!_cy) return;
  document.querySelectorAll('#scoLogos .sco-logo-grp').forEach(function(g){
    var n = _cy.getElementById(g.dataset.id); if (!n || !n.length) return;
    var p = n.renderedPosition(), rw = n.renderedWidth();
    var sz = Math.max(14, rw*0.66);
    var img = g.querySelector('img'); img.style.width = sz+'px'; img.style.height = sz+'px';
    g.style.left = p.x+'px'; g.style.top = p.y+'px';
  });
}
function scheduleReposition(){ if (_raf) return; _raf = requestAnimationFrame(function(){ _raf=null; positionEgoLogos(); }); }

// ─── Tables ───────────────────────────────────────────────────────────────────
function nameCell(r){
  var ic = r.dom ? '<img class="sco-logo" data-dom="'+esc(r.dom)+'" src="'+clearbit(r.dom)+'" alt="">'
                 : '<span class="sco-dot" style="background:'+segColor(r.seg)+'"></span>';
  return '<td>'+ic+'<span>'+esc(r.name)+'</span></td>';
}
function table(title, rows, revLabel, costLabel){
  var body = rows.map(function(r){
    return '<tr>'+ nameCell(r) +
      '<td class="sco-seg">'+esc(segName(r.seg))+'</td>'+
      '<td class="sco-num">'+fmtAmt(r.amt)+'</td>'+
      '<td class="sco-num">'+fmtPct(r.revp)+'</td>'+
      '<td class="sco-num">'+fmtPct(r.costp)+'</td>'+
    '</tr>';
  }).join('');
  return '<div class="sco-table-wrap">'+
    '<div class="sco-table-h">'+esc(title)+' <span>('+rows.length+')</span></div>'+
    '<table class="sco-table"><thead><tr><th>Company</th><th>Segment</th><th>Amount</th><th>'+esc(revLabel)+'</th><th>'+esc(costLabel)+'</th></tr></thead>'+
    '<tbody>'+(body||'<tr><td colspan="5" class="sco-empty">No relationships in the document.</td></tr>')+'</tbody></table></div>';
}
function renderTables(){
  var data = COMPANY_RELS[_sel];
  var el = document.getElementById('scoTables'); if (!el) return;
  if (!data){ el.innerHTML = '<div class="sco-empty">No Bloomberg SPLC data for this company.</div>'; return; }
  el.innerHTML =
    table('Suppliers · who '+data.name+' buys from', data.suppliers, 'Their rev %', 'Its cost %') +
    table('Customers · who '+data.name+' sells to', data.customers, 'Its rev %', 'Their cost %');
  el.querySelectorAll('img.sco-logo').forEach(wireImg);
}
function renderSub(){
  var data = COMPANY_RELS[_sel]; var sub = document.getElementById('scoSub'); if (!sub) return;
  if (!data){ sub.textContent=''; return; }
  var seg = data.seg ? getBucket(data.seg) : null;
  sub.innerHTML = (seg ? '<span class="sco-chip" style="--accent:'+seg.accent+'">'+esc(seg.name)+'</span>' : '')+
    '<span class="sco-subnote">'+data.suppliers.length+' suppliers · '+data.customers.length+' customers · top '+GRAPH_N+' on the map (click a node to open it); full lists below</span>';
}

// ─── Public select ────────────────────────────────────────────────────────────
function select(ticker){
  if (!ticker) return;
  _sel = ticker;
  var root = document.querySelector('.sco'); if (root) root.setAttribute('data-sel', ticker);
  var sel = document.getElementById('scoSelect'); if (sel && COMPANY_RELS[ticker]) sel.value = ticker;
  renderSub(); renderTables();
  if (_cy){ if (COMPANY_RELS[ticker]) buildGraph(); else { _cy.elements().remove(); buildEgoLogos(); } }
}

function init(){
  var root = document.querySelector('.sco'); if (!root) return;
  _sel = root.getAttribute('data-sel') || _sel;
  if (!root._wired){
    root._wired = true;
    var sel = document.getElementById('scoSelect');
    if (sel) sel.onchange = function(){ select(sel.value); };
  }
  renderSub(); renderTables();
  ensureCytoscape().then(function(){
    var canvas = document.getElementById('scoCanvas');
    if (!canvas || typeof window.cytoscape==='undefined'){ if(canvas) canvas.innerHTML='<div class="snet-loading">Could not load the map library.</div>'; return; }
    var loadEl = canvas.querySelector('.snet-loading'); if (loadEl) loadEl.remove();
    if (!_cy || _cy.destroyed()){
      _cy = window.cytoscape({ container:canvas, style:graphStyle(), wheelSensitivity:0.2, minZoom:0.2, maxZoom:2.5 });
      _cy.on('render', scheduleReposition);
      // Click a counterparty node → jump to its own supply chain (if we have its data).
      _cy.on('tap', 'node', function(evt){
        var t = evt.target; if (t.id()==='__c') return;
        var coid = t.data('coid'); if (coid && COMPANY_RELS[coid]) select(coid);
      });
    } else { _cy.resize(); }
    buildGraph();
  }).catch(function(){
    var canvas = document.getElementById('scoCanvas');
    if (canvas) canvas.innerHTML = '<div class="snet-loading">Could not load the map (offline?). The tables below still work.</div>';
  });
}

export var semiCompany = { html: html, init: init, select: select };
