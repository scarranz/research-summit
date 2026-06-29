// overviews/bbb-management.js — TBBB "Management" sub-tab.
//
// Two org charts behind a toggle:
//   1. Corporate — leadership + functional divisions. Each officer has an avatar
//      (initials, or a local photo if provided) and is CLICKABLE → a CV modal.
//   2. Regional  — how an autonomous region is structured. POSITIONS ONLY, no names.
//
// Org charts are pure CSS/HTML (nested <ul>) — no chart library, CSP-safe.
// Photos: drop a file in img/leadership/ and set `img:'img/leadership/<file>'` on a
// person; otherwise an initials avatar is shown. (The portal CSP only allows
// same-origin images, so external/LinkedIn URLs will not load — host locally.)

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Corporate org (names, bios, avatars, functional divisions) ───────────────
// Officers per the FY2025 Form 20-F (Item 6), as of Dec 31, 2025.
var CORP = {
  head:true, id:'hatoum', title:'Founder, Chairman & CEO', name:'K. Anthony Hatoum',
  sub:'Chairman of the 9-member Board', img:'img/leadership/3b-hatoum.png',
  bio:'Founded Tiendas 3B in 2004, modeling it on the Turkish hard-discounter BİM. Earlier spent his career in investment banking and private equity at J.P. Morgan, McKinsey and Merrill Lynch Private Equity — where he covered BİM. Engineering degrees from Columbia and MIT; MBA from Stanford. ~21 years building 3B.',
  children:[
    { id:'pizzuto', title:'Chief Financial Officer', name:'Eduardo Pizzuto', sub:'& Investor Relations', img:'img/leadership/3b-pizzuto.png',
      bio:'CFO and Investor Relations Officer. With Tiendas 3B since 2007. Previously at Nestlé Purina. Studied at Universidad Iberoamericana; MBA from SMU. ~18 years at the company.' },
    { id:'apalategui', title:'Director of Sales & Operations', name:'Diego Apalategui', img:'img/leadership/3b-apalategui.png',
      bio:'Leads sales and store operations. Two-plus decades in retail; helped scale Argentina’s EKI hard-discount chain from 6 to 250 stores. Joined Tiendas 3B in December 2004. ~21 years at the company.' },
    { multi:true, title:'Directors of Purchasing', sub:'three co-equal', people:[
      { id:'bermudez', title:'Director of Purchasing', name:'Luis Bermúdez', img:'img/leadership/3b-bermudez.png',
        bio:'One of three co-equal Directors of Purchasing. 20+ years in category management; previously at Lidl Spain, Aldi Spain and Dukan (Saudi Arabia). Joined 3B in 2018.' },
      { id:'domene', title:'Director of Purchasing', name:'David Domene', img:null,
        bio:'One of three co-equal Directors of Purchasing (role added in 2025; joined 2024). Former Purchasing Director at Lidl Spain and Lidl US, and at Aldi Spain.' },
      { id:'fernandez', title:'Director of Purchasing', name:'José Miguel Fernández', img:null,
        bio:'One of three co-equal Directors of Purchasing (joined 2025). 16+ years at Mercadona, including Director of Purchasing and Executive Committee member; earlier at EY-Parthenon.' },
    ]},
    { id:'suarez', title:'Director of Human Resources', name:'Javier Suárez', img:'img/leadership/3b-suarez.png',
      bio:'Leads people and culture. With 3B since 2004. Previously at McDonald’s Argentina and Operations Manager at the EKI hard-discount chain. ~21 years at the company.' },
    { id:'grattarola', title:'Director of Information Technology', name:'Pablo Grattarola', img:'img/leadership/3b-grattarola.png',
      bio:'Leads technology and systems. Former CIO of Banco Santander Uruguay; began his career at AB InBev. ~2 years at the company.' },
    { id:'davila', title:'Director of Real Estate', name:'Alejandro Dávila', img:'img/leadership/3b-davila.png',
      bio:'Leads store expansion and real estate. Joined in 2022. Previously at OXXO, where he was General Manager of OXXO Colombia.' },
    { id:'martinez', title:'General Counsel', name:'Amparo Martínez Ruiz', img:'img/leadership/3b-martinez.png',
      bio:'General Counsel (joined 2025). Previously General Counsel at Grupo Jumex and Corporate Counsel Director at Kellogg Mexico; 21 years in private practice focused on antitrust.' },
  ],
};

// ─── Regional org (positions only — no names) ─────────────────────────────────
var REGIONAL = {
  head:true, title:'Regional Director', sub:'Autonomous region · up to ~200 stores + 1 DC',
  children:[
    { title:'Store Operations', children:[
      { title:'Zone Managers', sub:'3 per region · 40–80 stores each', children:[
        { title:'District Managers', sub:'5–8 stores each', children:[
          { title:'Store Managers', children:[
            { title:'Store Team', sub:'2 assistant mgrs · ~4 associates' },
          ]},
        ]},
      ]},
    ]},
    { title:'Distribution Center Manager', sub:'Reports to Regional Director', children:[
      { title:'Receiving · Picking · Dispatching' },
      { title:'Transport — Own Fleet', sub:'Cross-docking · ~150 km radius' },
    ]},
    { title:'Regional Support', list:['Human Resources','Real Estate','IT Support','Regional Purchasing','Accounting'] },
  ],
};

// People lookup (id → person) for the CV modal.
var PEOPLE = {};
(function collect(n){
  if (n.id && n.bio) PEOPLE[n.id] = n;
  (n.children || []).forEach(collect);
  (n.people || []).forEach(collect);
})(CORP);

// ─── Avatar ───────────────────────────────────────────────────────────────────
function initials(name){
  var parts = String(name).trim().split(/\s+/).filter(function(w){ return /[A-Za-zÀ-ÿ]/.test(w); });
  var a = parts.length ? parts[0].charAt(0) : '';
  var b = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (a + b).toUpperCase();
}
function avatarHTML(n, big){
  var cls = 'mgmt-av' + (big ? ' mgmt-av-lg' : '');
  if (n.img) return '<img class="'+cls+'" src="'+esc(n.img)+'" alt="'+esc(n.name)+'">';
  return '<span class="'+cls+' mgmt-av-i">'+esc(initials(n.name))+'</span>';
}

// ─── Tree rendering (recursive nested <ul>) ───────────────────────────────────
function nodeHTML(n, showNames){
  var inner, cls = '', attr = '';
  if (n.multi){
    // One card holding several co-equal people (each clickable).
    cls = ' mgmt-multi';
    inner = '<div class="mgmt-role">'+esc(n.title)+'</div>' +
            (n.sub ? '<div class="mgmt-sub">'+esc(n.sub)+'</div>' : '') +
            '<div class="mgmt-chips">' + n.people.map(function(p){
              return '<span class="mgmt-chip" data-pid="'+esc(p.id)+'" role="button" tabindex="0">'+
                avatarHTML(p, false) + '<span class="mgmt-chip-n">'+esc(p.name)+'</span></span>';
            }).join('') + '</div>';
  } else if (n.list){
    // One card listing functions (no names, no clicks).
    cls = ' mgmt-dept';
    inner = '<div class="mgmt-role">'+esc(n.title)+'</div>' +
            '<div class="mgmt-flist">' + n.list.map(function(x){ return '<div>'+esc(x)+'</div>'; }).join('') + '</div>';
  } else if (n.dept){
    cls = ' mgmt-dept';
    inner = '<div class="mgmt-role">'+esc(n.title)+'</div>' + (n.sub ? '<div class="mgmt-sub">'+esc(n.sub)+'</div>' : '');
  } else if (showNames){
    inner = avatarHTML(n, false) +
            '<div class="mgmt-name">'+esc(n.name)+'</div>' +
            '<div class="mgmt-title">'+esc(n.title)+'</div>' +
            (n.sub ? '<div class="mgmt-sub">'+esc(n.sub)+'</div>' : '');
    if (n.bio){ cls += ' mgmt-click'; attr = ' data-pid="'+esc(n.id)+'" role="button" tabindex="0"'; }
  } else {
    inner = '<div class="mgmt-role">'+esc(n.title)+'</div>' + (n.sub ? '<div class="mgmt-sub">'+esc(n.sub)+'</div>' : '');
  }
  var box = '<div class="mgmt-node'+(n.head?' mgmt-head':'')+cls+'"'+attr+'>'+inner+'</div>';
  var kids = '';
  if (n.children && n.children.length){
    kids = '<ul>'+n.children.map(function(k){ return nodeHTML(k, showNames); }).join('')+'</ul>';
  }
  return '<li>'+box+kids+'</li>';
}
function treeHTML(root, showNames){
  return '<div class="mgmt-scroll"><div class="mgmt-tree"><ul>'+nodeHTML(root, showNames)+'</ul></div></div>';
}

// ─── Body ─────────────────────────────────────────────────────────────────────
// ─── Ownership & Dilution ─────────────────────────────────────────────────────
// From the FY2025 Form 20-F (Item 7, beneficial ownership as of Mar 31, 2026).
var OWN_CLASSES = [
  ['Class A', '62.6M', '1', 'Listed on the NYSE — the public float'],
  ['Class B', '5.2M', '15', '100% founder (Bolton Partners) — super-voting'],
  ['Class C', '50.0M', '1', 'Pre-IPO holders — convert to Class A on sale'],
];
// [block, economic %, voting %, color]
var OWN_BLOCKS = [
  ['Founder & insiders (18)',      15.2, 47.6, '#E1251B'],
  ['Quilvest Capital (PE)',         9.8,  6.0, '#F59E0B'],
  ['Index & active institutions',  22.7, 14.0, '#0E8F8F'],
  ['Other public float',           52.3, 32.4, '#9AA3AE'],
];
// [holder, role, economic %, voting %]
var OWN_CAP = [
  ['K. Anthony Hatoum',          'Founder · Chairman · CEO (Bolton Partners)', 11.1, 45.2],
  ['Quilvest Capital Partners',  'Private equity', 9.8, 6.0],
  ['Capital Group (CRMC)',       'Institutional', 9.1, 5.6],
  ['GIC',                        'Singapore sovereign fund', 4.9, 3.0],
  ['Sami Khouri (MNCF)',         'Director', 3.2, 2.0],
  ['Fidelity (FMR)',             'Institutional', 3.0, 1.8],
  ['Wasatch Advisors',           'Institutional', 2.9, 1.8],
  ['Orbis',                      'Institutional', 2.8, 1.7],
];
var OWN_SBC = [['2023',385],['2024',523],['2025',2930],['2026',2391],['2027',882],['2028',216],['2029',50]];
var OWN_SBC_EST = 3; // first projected index (2026E)

function ownershipBody(c){
  var h = '';
  h += '<p class="ov-lede">3B is <b>founder-controlled</b> through a <b>triple-class</b> share structure. Anthony Hatoum holds about '+
    '<b>11% of the economics but ~45% of the votes</b> via super-voting Class B shares (15 votes each); insiders together control ~48% of the vote.</p>';

  // 1 — Share classes
  h += '<div class="ov-sec-h ovt-store-h">Share structure</div>';
  h += '<div class="own-classes">' + OWN_CLASSES.map(function(k){
    return '<div class="own-class">'+
      '<div class="own-class-h">'+esc(k[0])+'</div>'+
      '<div class="own-class-row"><span>Shares</span><b>'+esc(k[1])+'</b></div>'+
      '<div class="own-class-row"><span>Votes / share</span><b>'+esc(k[2])+'</b></div>'+
      '<div class="own-class-d">'+esc(k[3])+'</div>'+
    '</div>';
  }).join('') + '</div>';
  h += '<div class="ov-foot">117.9M shares and ~190.6M votes outstanding (Mar 2026). Class B carries 15 votes/share so long as it stays ≥1% of shares; it converts to Class A on a public sale.</div>';

  // 2 — Economics vs control
  h += '<div class="ov-sec-h ovt-store-h">Economics vs. control</div>';
  h += '<div class="own-cmp"><div class="own-cmp-hd"><span></span><span>Economic ownership</span><span>Voting power</span></div>'+
    OWN_BLOCKS.map(function(b){
      return '<div class="own-cmp-row">'+
        '<div class="own-cmp-l"><i style="background:'+b[3]+'"></i>'+esc(b[0])+'</div>'+
        '<div class="own-bar"><div class="own-bar-f" style="width:'+b[1]+'%;background:'+b[3]+'"></div><span>'+b[1].toFixed(1)+'%</span></div>'+
        '<div class="own-bar"><div class="own-bar-f" style="width:'+b[2]+'%;background:'+b[3]+'"></div><span>'+b[2].toFixed(1)+'%</span></div>'+
      '</div>';
    }).join('') + '</div>';
  h += '<div class="milk-takeaway">The founder turns ~<b>11% of the economics into 45% of the votes</b> — and insiders as a group hold ~<b>48% of the voting power</b> with ~15% of the shares. Investors get the upside but very limited governance influence.</div>';

  // 3 — Cap table
  h += '<div class="ov-sec-h ovt-store-h">Major shareholders</div>';
  h += '<table class="own-cap"><thead><tr><th>Holder</th><th></th><th>Economic</th><th>Voting</th></tr></thead><tbody>'+
    OWN_CAP.map(function(r){
      return '<tr><td class="own-cap-n">'+esc(r[0])+'</td><td class="own-cap-r">'+esc(r[1])+'</td>'+
        '<td class="own-cap-v">'+r[2].toFixed(1)+'%</td><td class="own-cap-v">'+r[3].toFixed(1)+'%</td></tr>';
    }).join('') + '</tbody></table>';
  h += '<div class="ov-foot">Beneficial ownership per FY2025 Form 20-F (Item 7), as of Mar 31, 2026, plus 13G filings. Economic % is derived (shares ÷ 117.9M total) and approximate; Capital Group = combined CRMC divisions. <b>Offerings & lock-ups:</b> IPO Feb 2024 (US$17.50); a Feb 2025 follow-on (US$28.25) was mostly a secondary sell-down by pre-IPO holders; the liquidity lock-up on Class B/C ends <b>Jul 8, 2026</b>.</div>';

  // 4 — Dilution & SBC
  h += '<div class="ov-sec-h ovt-store-h">Dilution & stock-based compensation</div>';
  h += '<p class="ov-lede">Share-based compensation spiked around the IPO and then fades fast. Shares grew from ~84M (pre-IPO) to ~118M; an option overhang of ~51M (mostly legacy 2004-plan Class C options) implies ~169M fully diluted (~30%).</p>';
  var sbcMax = 2930;
  h += '<div class="own-sbc"><div class="own-sbc-t">Stock-based compensation <span>(Ps. MM · light = projected)</span></div>'+
    OWN_SBC.map(function(s, i){
      return '<div class="own-sbc-row"><span class="own-sbc-y">'+s[0]+(i>=OWN_SBC_EST?'E':'')+'</span>'+
        '<div class="own-sbc-bar"><div class="own-sbc-f'+(i>=OWN_SBC_EST?' own-sbc-est':'')+'" style="width:'+(s[1]/sbcMax*100).toFixed(1)+'%"></div></div>'+
        '<span class="own-sbc-v">'+s[1].toLocaleString()+'</span></div>';
    }).join('') + '</div>';
  h += '<div class="ov-foot">SBC (Ps. MM): Ps.2,930M in 2025 and Ps.2,391M in 2026E, tapering to Ps.50M by 2029E — front-loaded IPO grants that fade (from ~3.7% to ~0.02% of revenue). This non-cash charge drove the FY2025–26 GAAP net loss; net income turns positive from 2027. The Summit model holds shares roughly flat at ~115M (assumes minimal net dilution after the taper; the 2026 evergreen plan increase was set to zero). Sources: FY2025 Form 20-F; Summit DCF model.</div>';

  return h;
}

function mgmtBody(c){
  var h = '';
  h += '<p class="ov-lede">Tiendas 3B runs on a <b>lean corporate HQ</b> plus a <b>decentralized network of autonomous regions</b> — '+
    'each region is built around a distribution center that serves up to <b>~200 stores</b> within a ~150 km radius. '+
    'Toggle between the two views; <b>click any leader</b> for a short CV.</p>';

  h += '<div class="mgmt-modes">'+
    '<button type="button" class="mgmt-mode active" data-mg="corp">Corporate</button>'+
    '<button type="button" class="mgmt-mode" data-mg="regional">Regional</button>'+
    '<button type="button" class="mgmt-mode" data-mg="ownership">Ownership &amp; Dilution</button>'+
  '</div>';

  h += '<div class="mgmt-pane" data-mg="corp">'+
    treeHTML(CORP, true)+
    '<div class="ov-foot">Executive officers as of Dec 31, 2025 (FY2025 Form 20-F, Item 6). Click a name for a CV. The Mexico City HQ is deliberately lean — it houses the CEO and his direct reports plus the Product &amp; Pricing and Operation committees. There is no separate COO or CMO: operations run through the Director of Sales &amp; Operations and the Regional Directors, and commercial/merchandising sits under three co-equal Directors of Purchasing. The Board has nine members (Chair: K. Anthony Hatoum; Audit Committee chair: Nicole Reich).</div>'+
  '</div>';

  h += '<div class="mgmt-pane" data-mg="regional" hidden>'+
    treeHTML(REGIONAL, false)+
    '<div class="ov-foot">How a single autonomous region is organized — positions only; the same template repeats across every region. Each region is led by a Regional Director and contains its full functional stack (HR, real estate, logistics, IT, regional purchasing &amp; accounting), pairing store operations with its own distribution center and truck fleet. Disclosed spans: ~3 Zone Managers per region (40–80 stores each) → District Managers (5–8 stores each) → Store Managers (a store runs with 1 manager, 2 assistant managers and ~4 sales associates). The DC Manager reports directly to the Regional Director. Source: FY2025 Form 20-F (Item 4).</div>'+
  '</div>';

  h += '<div class="mgmt-pane" data-mg="ownership" hidden>'+ownershipBody(c)+'</div>';

  // CV modal (hidden until a leader is clicked).
  h += '<div class="mgmt-modal" hidden>'+
    '<div class="mgmt-modal-bd" data-close="1"></div>'+
    '<div class="mgmt-card" role="dialog" aria-modal="true">'+
      '<button type="button" class="mgmt-x" data-close="1" aria-label="Close">×</button>'+
      '<div class="mgmt-card-top"><span class="mgmt-card-av"></span>'+
        '<div><div class="mgmt-card-name"></div><div class="mgmt-card-title"></div></div>'+
      '</div>'+
      '<div class="mgmt-card-bio"></div>'+
    '</div>'+
  '</div>';

  return h;
}

// ─── Fit-to-width: scale each org chart down so it fits with no horizontal scroll ──
function fitTree(scrollEl){
  var tree = scrollEl.querySelector('.mgmt-tree');
  if (!tree || !scrollEl.offsetParent) return;            // not visible → skip
  tree.style.transform = 'none';                          // reset to measure natural size
  var cw = scrollEl.clientWidth;
  var tw = Math.max(tree.offsetWidth, tree.scrollWidth);  // true content width (handles flex overflow)
  var scale = (tw > cw && tw > 0) ? (cw / tw) : 1;
  tree.style.transformOrigin = 'top left';                // scale from the left edge → fits [0, cw]
  tree.style.transform = 'scale(' + scale + ')';
  scrollEl.style.height = Math.ceil(tree.offsetHeight * scale) + 'px';  // trim scaled whitespace
}
function fitVisible(){
  document.querySelectorAll('.ovt-pane[data-ovt="mgmt"] .mgmt-pane:not([hidden]) .mgmt-scroll').forEach(fitTree);
}
var _mgmtResizeWired = false;

// ─── Toggle + CV modal ─────────────────────────────────────────────────────────
function initMgmt(root){
  var scope = root.querySelector('.ovt-pane[data-ovt="mgmt"]') || root;

  // View toggle.
  scope.querySelectorAll('.mgmt-mode').forEach(function(btn){
    btn.onclick = function(){
      var key = btn.getAttribute('data-mg');
      scope.querySelectorAll('.mgmt-mode').forEach(function(b){ b.classList.toggle('active', b === btn); });
      scope.querySelectorAll('.mgmt-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-mg') !== key); });
      requestAnimationFrame(fitVisible);
    };
  });

  // CV modal.
  var modal = scope.querySelector('.mgmt-modal');
  if (!modal) return;
  var avEl = modal.querySelector('.mgmt-card-av');
  var nameEl = modal.querySelector('.mgmt-card-name');
  var titleEl = modal.querySelector('.mgmt-card-title');
  var bioEl = modal.querySelector('.mgmt-card-bio');

  function open(pid){
    var p = PEOPLE[pid]; if (!p) return;
    avEl.innerHTML = avatarHTML(p, true);
    nameEl.textContent = p.name;
    titleEl.textContent = p.title + (p.sub ? ' ' + p.sub : '');
    bioEl.textContent = p.bio;
    modal.hidden = false;
  }
  function close(){ modal.hidden = true; }

  scope.querySelectorAll('[data-pid]').forEach(function(el){
    el.onclick = function(e){ e.stopPropagation(); open(el.getAttribute('data-pid')); };
    el.onkeydown = function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(el.getAttribute('data-pid')); } };
  });
  modal.querySelectorAll('[data-close]').forEach(function(el){ el.onclick = close; });
  // Esc closes (scoped listener, idempotent via onkeydown on the modal isn't enough — use document).
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !modal.hidden) close(); });

  // Fit the chart(s) to the container width (no horizontal scroll), and on resize.
  requestAnimationFrame(fitVisible);
  if (!_mgmtResizeWired){
    window.addEventListener('resize', function(){ requestAnimationFrame(fitVisible); });
    _mgmtResizeWired = true;
  }
}

export var bbbManagement = { body: mgmtBody, init: initMgmt };
