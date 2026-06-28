// overviews/semi-industry.js — wrapper for the Industry Analysis tab.
//
// Hosts three views of the same supply-chain data behind a toggle:
//   • Flow     — the clean drill-down map (semi-map.js)
//   • Segments — the high-level segment relationship graph (semi-network.js)
//   • Company  — per-company supplier/customer map + tables (semi-company.js)
//
// Clicking a company logo inside the Segments view jumps to the Company view with that
// company selected (via a 'semi-select-company' event). Pass { highlight:'<TICKER>' }.

import { semiMap } from './semi-map.js';
import { semiNetwork } from './semi-network.js';
import { semiCompany } from './semi-company.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function html(opts){
  opts = opts || {};
  return '<div class="sind">'+
      '<div class="sind-toggle">'+
        '<button type="button" class="sind-tab active" data-view="flow">Flow</button>'+
        '<button type="button" class="sind-tab" data-view="segments">Segments</button>'+
        '<button type="button" class="sind-tab" data-view="company">Company</button>'+
      '</div>'+
      '<div class="sind-view" data-view="flow">'+semiMap.html(opts)+'</div>'+
      '<div class="sind-view" data-view="segments" hidden>'+semiNetwork.html(opts)+'</div>'+
      '<div class="sind-view" data-view="company" hidden>'+semiCompany.html(opts)+'</div>'+
    '</div>';
}

function show(root, view){
  root.querySelectorAll('.sind-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-view')===view); });
  root.querySelectorAll('.sind-view').forEach(function(v){ v.hidden = (v.getAttribute('data-view')!==view); });
  if (view==='flow')     requestAnimationFrame(function(){ semiMap.init(); });
  if (view==='segments') requestAnimationFrame(function(){ semiNetwork.init(); });
  if (view==='company')  requestAnimationFrame(function(){ semiCompany.init(); });
}

function init(){
  var root = document.querySelector('.sind');
  if (!root) return;
  if (!root._wired){
    root._wired = true;
    root.querySelectorAll('.sind-tab').forEach(function(btn){
      btn.onclick = function(){ show(root, btn.getAttribute('data-view')); };
    });
    // Cross-view: a company logo clicked in Segments → open Company view on that company.
    root.addEventListener('semi-select-company', function(e){
      var t = e.detail && e.detail.ticker; if (!t) return;
      semiCompany.select(t);   // set selection first (updates state even while hidden)
      show(root, 'company');   // then reveal + init builds the graph for that company
    });
  }
  var active = root.querySelector('.sind-tab.active');
  show(root, active ? active.getAttribute('data-view') : 'flow');
}

export var semiIndustry = { html: html, init: init };
