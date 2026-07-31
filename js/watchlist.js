// watchlist.js — SHARED Watch List / Themes engine (Earnings ▸ Evolution).
//
// One engine for every company. A company's Earnings section renders a host element and calls
// mountWatchList(host, { companyId, ticker, quarters }) — the engine then owns EVERYTHING:
// rendering (tag filter, tracking-window filter, add/edit form, per-quarter cards, cross-quarter
// flat view, the storage table), all persistence against Supabase (table `company_themes`, via
// js/api.js), the delete-quarter rule, and first-class sorting. Nothing about Supabase leaks into
// the company module — same spirit as the Resources tab in js/companies.js.
//
// Persistence model (mirrors company_resources): rows are scoped by company_id, any authenticated
// user can read/write (RLS), so an add / edit / close / delete / reorder is visible to the whole
// team immediately — no commit, no push. See sql/010_company_themes.sql and
// docs/EARNINGS_CONVENTIONS.md §6f.
import { fetchThemes, insertTheme, updateTheme, deleteTheme } from './api.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// snake_case DB row → the camelCase shape the renderer uses.
function fromDb(r){
  return { id:r.id, companyId:r.company_id, ticker:r.ticker, q:r.q, createdQuarter:r.created_quarter,
    rank:(typeof r.rank==='number'?r.rank:0), theme:r.theme, tags:r.tags||[], definition:r.definition,
    trackSince:r.track_since, trackUntil:r.track_until,
    seededBy:r.seeded_by||null, src:r.src||null, thread:r.thread||null };
}

// ── one-time CSS (uses --wl-* custom props set per host, so each company can carry its own brand) ──
function injectStyle(){
  if(document.getElementById('wl-engine-css')) return;
  var s=document.createElement('style'); s.id='wl-engine-css';
  s.textContent=[
    '.wl-root{--wl-brand:#4285F4;--wl-brand2:#34A853;--wl-purple:#7A5AF8;--wl-gray:#9AA4B0;--wl-red:#EA4335}',
    '.wl-root .ce-note{font-size:11px;color:var(--mu);line-height:1.5;background:#F7F9FB;border:1px solid var(--bdr);border-radius:9px;padding:9px 12px;margin:0 0 12px}',
    '.wl-root .ce-empty{color:var(--mu);font-style:italic;opacity:.7}',
    '.wl-hint{font-size:10.5px;line-height:1.5;color:var(--navy);background:rgba(66,133,244,0.06);border:1px solid rgba(66,133,244,0.28);border-radius:9px;padding:8px 12px;margin:0 0 10px}',
    '.wl-tagbar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 12px;padding:9px 12px;background:#F7F9FB;border:1px solid var(--bdr);border-radius:10px}',
    '.wl-bar-k{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu)}',
    '.wl-tag{border:1px solid rgba(122,90,248,0.35);background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:var(--wl-purple);padding:3px 10px;border-radius:999px;cursor:pointer;transition:.12s}',
    '.wl-tag:hover{background:rgba(122,90,248,0.08)}.wl-tag.active{background:var(--wl-purple);color:#fff;border-color:var(--wl-purple)}',
    '.wl-tag.wl-clear{border-color:var(--bdr);color:var(--mu)}',
    '.wl-add-btn{margin-left:auto;border:1px dashed var(--wl-brand);background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:var(--wl-brand);padding:3px 10px;border-radius:999px;cursor:pointer}',
    '.wl-win{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 11px;border-radius:999px;cursor:pointer}',
    '.wl-win.active{background:var(--navy);color:#fff}',
    '.wl-seg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}',
    '.wl-qpills{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 14px}',
    '.wl-qpill{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11px;font-weight:800;color:var(--mu);padding:5px 13px;border-radius:999px;cursor:pointer;transition:.12s}',
    '.wl-qpill:hover{color:var(--navy)}.wl-qpill.active{background:var(--navy);color:#fff;border-color:var(--navy)}',
    '.wl-qtag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;margin-left:6px;opacity:.75}',
    '.wl-qblock[hidden]{display:none}',
    '.wl-frozen{display:inline-block;font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;background:var(--wl-gray);border-radius:20px;padding:2px 8px;margin-left:7px;vertical-align:middle}',
    '.wl-phase{display:inline-block;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#fff;background:var(--wl-brand);border-radius:20px;padding:3px 10px;margin-bottom:8px}',
    '.wl-lede{font-size:12px;color:var(--navy);line-height:1.5;margin:0 0 10px}.wl-lede b{color:var(--navy)}',
    '.wl-foot{font-size:10.5px;color:var(--mu);line-height:1.5;margin-top:10px;font-style:italic}',
    // ── add / edit form ──
    '.wl-form{display:flex;flex-direction:column;gap:5px;border:1px dashed var(--wl-brand);border-radius:10px;padding:14px 15px;margin:0 0 12px;background:rgba(66,133,244,0.03)}',
    '.wl-form[hidden]{display:none}',
    '.wl-fh{display:flex;align-items:baseline;gap:9px;flex-wrap:wrap;margin-bottom:4px}',
    '.wl-fh-t{font-size:12.5px;font-weight:800;color:var(--navy)}.wl-fh-s{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}',
    '.wl-fixed{font-size:10px;color:var(--mu)}.wl-fixed b{color:var(--wl-brand)}',
    '.wl-lb{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--navy);margin-top:5px}',
    '.wl-lb span{font-weight:600;text-transform:none;letter-spacing:0;color:var(--mu);font-size:10px;margin-left:5px}',
    '.wl-in{font:inherit;font-size:12px;border:1px solid var(--bdr);border-radius:8px;padding:7px 10px;background:var(--w);color:var(--navy);width:100%;box-sizing:border-box}',
    '.wl-in:focus{outline:none;border-color:var(--wl-brand)}.wl-ta{resize:vertical;line-height:1.5}',
    '.wl-2col{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:600px){.wl-2col{grid-template-columns:1fr}}',
    '.wl-tagpick{display:flex;gap:6px;flex-wrap:wrap;border:1px solid var(--bdr);border-radius:8px;padding:8px 9px;background:var(--w);min-height:20px}',
    '.wl-pick{border:1px solid rgba(122,90,248,0.35);background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:var(--wl-purple);padding:3px 10px;border-radius:999px;cursor:pointer;transition:.12s}',
    '.wl-pick:hover{background:rgba(122,90,248,0.08)}.wl-pick.on{background:var(--wl-purple);color:#fff;border-color:var(--wl-purple)}',
    '.wl-newtag{display:flex;gap:7px;align-items:center}.wl-newtag .wl-in{flex:1}',
    '.wl-newtag-go{font:inherit;font-size:10.5px;font-weight:800;border:1px dashed var(--wl-purple);background:var(--w);color:var(--wl-purple);padding:6px 12px;border-radius:999px;cursor:pointer;white-space:nowrap}',
    '.wl-frow{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-top:9px}',
    '.wl-go{font:inherit;font-size:11px;font-weight:800;border:none;border-radius:8px;padding:7px 15px;background:var(--wl-brand);color:#fff;cursor:pointer}',
    '.wl-go[disabled]{opacity:.55;cursor:default}',
    '.wl-cancel{font:inherit;font-size:10.5px;font-weight:700;border:1px solid var(--bdr);background:var(--w);color:var(--mu);padding:6px 12px;border-radius:8px;cursor:pointer}',
    // ── cards ──
    '.wl-all[hidden]{display:none}.wl-w[data-wlhide]{display:none}',
    '.wl-watch{display:flex;flex-direction:column;gap:11px}',
    '.wl-w{border:1px solid var(--bdr);border-radius:12px;padding:13px 15px;background:var(--w);position:relative}',
    '.wl-w-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}',
    '.wl-w-dot{width:8px;height:8px;border-radius:50%;background:var(--wl-brand);flex:none;margin:0 2px}',
    '.wl-w-metric{font-size:13.5px;font-weight:800;color:var(--navy)}',
    '.wl-seed{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.3px;color:var(--wl-purple);background:rgba(122,90,248,0.08);border:1px solid rgba(122,90,248,0.28);border-radius:20px;padding:2px 8px;flex:none}',
    '.wl-w-def{color:var(--navy);border-left:3px solid rgba(66,133,244,0.35);padding:1px 0 1px 11px;font-size:12px;line-height:1.55;margin-top:7px}.wl-w-def b{color:var(--wl-brand)}',
    '.wl-chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}',
    '.wl-chip{font-size:9px;font-weight:800;border-radius:20px;padding:2px 8px;border:1px solid var(--bdr);color:var(--mu);background:#F7F9FB}',
    '.wl-chip.tag{color:var(--wl-purple);border-color:rgba(122,90,248,0.3);background:rgba(122,90,248,0.06)}',
    '.wl-chip.since b,.wl-chip.until b{color:var(--navy)}',
    '.wl-w-closed{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--mu);background:#F2F5F8;border:1px solid var(--bdr);border-radius:20px;padding:2px 8px;flex:none}',
    '.wl-qchip{font-size:9.5px;font-weight:800;border-radius:20px;padding:2px 9px;flex:none;background:rgba(66,133,244,0.10);color:var(--wl-brand)}',
    '.wl-ctl{margin-left:auto;display:inline-flex;gap:5px;flex:none}',
    '.wl-btn{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11px;font-weight:800;color:var(--mu);width:24px;height:24px;border-radius:7px;cursor:pointer;line-height:1;transition:.12s}',
    '.wl-btn:hover{border-color:var(--wl-brand);color:var(--wl-brand)}',
    '.wl-btn[disabled]{opacity:.35;cursor:default}',
    '.wl-btn.wl-del:hover{border-color:var(--wl-red);color:var(--wl-red)}',
    '.wl-thread{margin-top:9px;font-size:11.5px}.wl-thread>summary{cursor:pointer;font-weight:800;color:var(--wl-brand);font-size:11px;list-style:none}',
    '.wl-thread>summary::-webkit-details-marker{display:none}',
    '.wl-thread-b{padding:8px 0 2px}.wl-thread-row{display:flex;gap:9px;padding:5px 0;border-bottom:1px solid var(--bdr);line-height:1.5}.wl-thread-row b{white-space:nowrap;color:var(--wl-brand)}',
    // ── the storage table ──
    '.wl-tbl-wrap{margin-top:22px;border:1px solid var(--bdr);border-top:3px solid var(--wl-brand);border-radius:12px;padding:13px 15px;background:var(--w)}',
    '.wl-tbl-h{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:9px}',
    '.wl-tbl-t{font-size:12.5px;font-weight:800;color:var(--navy)}.wl-tbl-s{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}',
    '.wl-tbl-n{margin-left:auto;font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--wl-brand2);background:rgba(52,168,83,0.10);border:1px solid rgba(52,168,83,0.3);border-radius:999px;padding:3px 11px;white-space:nowrap}',
    '.wl-copy{border:1px solid var(--wl-brand);background:var(--wl-brand);font:inherit;font-size:10px;font-weight:800;color:#fff;padding:4px 14px;border-radius:999px;cursor:pointer;letter-spacing:.03em;transition:.12s}',
    '.wl-copy:hover{filter:brightness(1.08)}.wl-copy.alt{background:var(--w);color:var(--wl-brand)}',
    '.wl-tbl-sc[hidden]{display:none}.wl-tbl-sc{overflow-x:auto;border:1px solid var(--bdr);border-radius:9px}',
    '.wl-tbl{width:100%;border-collapse:collapse;font-size:10.5px;min-width:1100px}',
    '.wl-tbl th{text-align:left;background:#F7F9FB;color:var(--mu);font-weight:800;font-size:9.5px;text-transform:uppercase;letter-spacing:.04em;padding:7px 9px;border-bottom:1px solid var(--bdr);white-space:nowrap}',
    '.wl-tbl td{padding:7px 9px;border-bottom:1px solid var(--bdr);color:var(--navy);line-height:1.45;vertical-align:top;max-width:270px}',
    '.wl-tbl td.wl-tk{white-space:nowrap;font-weight:800;color:var(--mu);font-size:10px}.wl-tbl td.wl-tth{font-weight:800;min-width:190px}',
    '.wl-tbl tr.wl-open td.wl-tk{color:var(--wl-brand2)}'
  ].join('');
  document.head.appendChild(s);
}

// The storage-table columns (order shown in the table; `rank` is labelled "order").
var COLS=[
  {k:'id',l:'id'},{k:'q',l:'quarter'},{k:'createdQuarter',l:'created'},{k:'rank',l:'order'},
  {k:'theme',l:'theme'},{k:'tags',l:'tags'},{k:'definition',l:'definition'},
  {k:'trackSince',l:'tracking since'},{k:'trackUntil',l:'tracking until'}
];

export function mountWatchList(host, opts){
  if(!host) return;
  opts=opts||{};
  var companyId=opts.companyId||null;
  var ticker=(opts.ticker||'').toUpperCase();
  var quarters=(opts.quarters||[]).slice();          // [{q, status}]  status 'upcoming' = the live one
  injectStyle();

  // per-host brand colours (optional)
  host.classList.add('wl-root');
  if(opts.colors){ Object.keys(opts.colors).forEach(function(k){ host.style.setProperty('--wl-'+k, opts.colors[k]); }); }

  var ROWS=[];                                        // camelCase rows, the in-memory mirror of the DB

  // ── helpers ──
  function qkey(q){ return String(q||'').replace(/\s/g,''); }
  function qnum(q){ var m=String(q||'').match(/Q(\d)\s+(\d{4})/); return m?((+m[2])*4+(+m[1])):null; }
  function upcoming(){ for(var i=0;i<quarters.length;i++){ if(quarters[i].status==='upcoming') return quarters[i]; } return quarters[0]||null; }
  function isOpen(r){ return !!(r.trackSince && !r.trackUntil); }
  function rowsFor(qLabel, openOnly){
    return ROWS.filter(function(r){ if(r.q!==qLabel) return false; if(openOnly && r.trackUntil) return false; return true; })
      .sort(function(a,z){ return (a.rank||0)-(z.rank||0); });
  }
  function allTags(){ var seen={}, out=[]; ROWS.forEach(function(r){ (r.tags||[]).forEach(function(t){ if(!seen[t]){ seen[t]=1; out.push(t); } }); }); return out.sort(); }
  function byId(id){ for(var i=0;i<ROWS.length;i++){ if(ROWS[i].id===id) return ROWS[i]; } return null; }
  function nextRank(qLabel){ var mx=0; ROWS.forEach(function(r){ if(r.q===qLabel && (r.rank||0)>mx) mx=r.rank; }); return mx+1; }
  function countLine(){ var open=ROWS.filter(isOpen).length; return ROWS.length+' rows · '+open+' open hook'+(open===1?'':'s')+' · live'; }

  // quarter dropdown options for the form (Q1 2024 → the newest quarter in `quarters`)
  function quarterOpts(sel, blank){
    var latest=quarters[0]?qnum(quarters[0].q):null;
    var start=2024*4+1, end=latest||(2026*4+3);
    var out='<option value="">'+esc(blank||'—')+'</option>';
    for(var t=end;t>=start;t--){ var lab='Q'+(((t-1)%4)+1)+' '+Math.floor((t-1)/4); out+='<option value="'+esc(lab)+'"'+(sel===lab?' selected':'')+'>'+esc(lab)+'</option>'; }
    return out;
  }

  function cellText(r,k){ var v=r[k]; if(k==='tags') return (v||[]).join(', '); if(v==null) return ''; return String(v).replace(/<[^>]+>/g,''); }
  function tableRows(){
    return ROWS.slice().sort(function(a,z){ return qkey(z.q).localeCompare(qkey(a.q))|| (a.rank||0)-(z.rank||0); }).map(function(r){
      return '<tr'+(isOpen(r)?' class="wl-open"':'')+'>'+COLS.map(function(c){
        var t=cellText(r,c.k); var cls=(c.k==='theme')?' class="wl-tth"':((c.k==='id'||c.k==='q'||c.k==='createdQuarter'||c.k==='rank')?' class="wl-tk"':'');
        return '<td'+cls+'>'+(t?esc(t):'<span class="ce-empty">—</span>')+'</td>';
      }).join('')+'</tr>';
    }).join('');
  }

  // ── a single card. flags: {editable, first, last, qLabel} ──
  function card(w, flags){
    flags=flags||{};
    var deep='';
    if(w.src) deep+='<p style="margin:0 0 6px"><b>Why it earned a slot:</b> '+esc(w.src)+'</p>';
    if(w.thread&&w.thread.length){
      deep+='<div class="wl-thread-b">'+w.thread.map(function(t){ return '<div class="wl-thread-row"><b>'+esc(t.q)+'</b><span>'+esc(t.n)+'</span></div>'; }).join('')+'</div>';
    }
    var thread=deep?('<details class="wl-thread"><summary>'+(w.thread?'the thread':'background')+' ›</summary>'+deep+'</details>'):'';
    var seed=w.seededBy?'<span class="wl-seed" title="'+esc(w.seededBy.n)+'">'+(w.seededBy.tripped?'⚑ '+esc(w.seededBy.q):'left open by '+esc(w.seededBy.q))+'</span>':'';
    var tagsAttr=(w.tags&&w.tags.length)?w.tags.join(' '):'';
    var ctl='';
    if(flags.editable){
      ctl='<span class="wl-ctl">'+
        '<button type="button" class="wl-btn wl-up" data-wlup="'+esc(w.id)+'"'+(flags.first?' disabled':'')+' title="Move up (rank higher)">▲</button>'+
        '<button type="button" class="wl-btn wl-down" data-wldown="'+esc(w.id)+'"'+(flags.last?' disabled':'')+' title="Move down (rank lower)">▼</button>'+
        '<button type="button" class="wl-btn wl-ed" data-wledit="'+esc(w.id)+'" title="Edit (and close its hook by filling Tracking until)">✎</button>'+
        '<button type="button" class="wl-btn wl-del" data-wldel="'+esc(w.id)+'" title="Remove this theme">✕</button>'+
      '</span>';
    }
    return '<div class="wl-w" data-wltags="'+esc(tagsAttr)+'" data-wlid="'+esc(w.id)+'" data-wlopen="'+(isOpen(w)?'1':'0')+'">'+
      '<div class="wl-w-top"><span class="wl-w-dot" aria-hidden="true"></span><div class="wl-w-metric">'+esc(w.theme)+'</div>'+seed+
        (w.trackUntil?'<span class="wl-w-closed" title="Hook closed in '+esc(w.trackUntil)+'">closed</span>':'')+
        (flags.qLabel?'<span class="wl-qchip">'+esc(flags.qLabel)+'</span>':'')+ctl+
      '</div>'+
      (w.definition?'<div class="wl-w-def">'+esc(w.definition)+'</div>':'')+
      '<div class="wl-chips">'+
        ((w.tags||[]).map(function(t){ return '<span class="wl-chip tag">#'+esc(t)+'</span>'; }).join(''))+
        (w.trackSince?'<span class="wl-chip since"><b>Tracking since:</b> '+esc(w.trackSince)+'</span>':'')+
        (w.trackUntil?'<span class="wl-chip until"><b>Tracking until:</b> '+esc(w.trackUntil)+'</span>':'')+
      '</div>'+thread+
    '</div>';
  }

  // ── the add / edit form markup ──
  function formHtml(){
    return '<div class="wl-form" hidden>'+
      '<div class="wl-fh"><b class="wl-fh-t">New theme</b><span class="wl-fh-s">the hunt list is ours — the model does not get a vote here</span></div>'+
      '<div class="wl-fixed">Company: <b>'+esc(ticker||'—')+'</b> · fixed to this profile</div>'+
      '<input type="hidden" data-wlf="id">'+
      '<label class="wl-lb">Theme <span>what we are hunting</span></label>'+
      '<input class="wl-in" data-wlf="theme" placeholder="e.g. Regulatory: DOJ ad-tech remedies">'+
      '<label class="wl-lb">Tags <span>click to select · they drive the cross-quarter filter</span></label>'+
      '<div class="wl-tagpick" data-wlf="tagpick"></div>'+
      '<div class="wl-newtag"><input class="wl-in" data-wlf="newtag" placeholder="create a new tag (e.g. regulatory)"><button type="button" class="wl-newtag-go">+ add tag</button></div>'+
      '<label class="wl-lb">Definition <span>required — what the theme means, in our words</span></label>'+
      '<textarea class="wl-in wl-ta" data-wlf="definition" rows="3" placeholder="What this theme is and why it moves the thesis"></textarea>'+
      '<div class="wl-2col">'+
        '<div><label class="wl-lb">Tracking since</label><select class="wl-in" data-wlf="trackSince">'+quarterOpts(null,'— pick a quarter —')+'</select></div>'+
        '<div><label class="wl-lb">Tracking until <span>empty = still open</span></label><select class="wl-in" data-wlf="trackUntil">'+quarterOpts(null,'— still open —')+'</select></div>'+
      '</div>'+
      '<div class="wl-frow"><button type="button" class="wl-go">Add to the live list</button>'+
        '<button type="button" class="wl-cancel">cancel</button>'+
        '<span class="wl-fh-s">Saved to the shared database — visible to the whole team immediately, no commit.</span></div>'+
    '</div>';
  }

  // ── the storage table markup ──
  function tableHtml(){
    return '<div class="wl-tbl-wrap">'+
      '<div class="wl-tbl-h">'+
        '<span class="wl-tbl-t">The Watch List table — one row per theme</span>'+
        '<span class="wl-tbl-s">the storage view (this is what lives in Supabase)</span>'+
        '<span class="wl-tbl-n" data-wlcount>'+esc(countLine())+'</span>'+
        '<button type="button" class="wl-copy alt" data-wltoggle="1">show table</button>'+
        '<button type="button" class="wl-copy" data-wlcopy="tsv">COPY</button>'+
        '<button type="button" class="wl-copy alt" data-wlcopy="json">copy JSON</button>'+
      '</div>'+
      '<div class="wl-tbl-sc" data-wltblbody hidden><table class="wl-tbl"><thead><tr>'+
        COLS.map(function(c){ return '<th>'+esc(c.l)+'</th>'; }).join('')+
      '</tr></thead><tbody data-wltbody>'+tableRows()+'</tbody></table></div>'+
    '</div>';
  }

  // ── the whole shell (static structure; card hosts are filled by render()) ──
  function shellHtml(){
    var h='';
    h+='<div class="wl-hint">🔁 <b>How quarters advance:</b> a new upcoming quarter opens in the Watch List once the prior quarter is filled. Open hooks (a <i>Tracking since</i> with no <i>Tracking until</i>) carry forward; closed ones drop off.</div>';
    h+='<div class="wl-tagbar"><span class="wl-bar-k">Filter by theme (across quarters):</span><span data-wltags></span>'+
       '<button type="button" class="wl-tag wl-clear" data-wltag="">clear</button>'+
       '<button type="button" class="wl-add-btn">+ Add theme</button></div>';
    h+='<div class="wl-tagbar" style="margin-top:-4px"><span class="wl-bar-k">Tracking window:</span>'+
       '<span class="wl-seg">'+
         '<button type="button" class="wl-win active" data-wlwin="all">All</button>'+
         '<button type="button" class="wl-win" data-wlwin="open">Open hooks</button>'+
         '<button type="button" class="wl-win" data-wlwin="closed">Closed</button>'+
       '</span></div>';
    h+=formHtml();
    // quarter pills (engine-owned navigation) — only if more than one quarter
    if(quarters.length>1){
      h+='<div class="wl-qpills">'+quarters.map(function(u,i){
        var frozen=(u.status!=='upcoming');
        return '<button type="button" class="wl-qpill'+(i===0?' active':'')+'" data-wlqsel="'+esc(u.q)+'">'+esc(u.q)+(frozen?'<span class="wl-qtag">frozen</span>':'<span class="wl-qtag">live</span>')+'</button>';
      }).join('')+'</div>';
    }
    // per-quarter blocks (render() fills the .wl-watch host)
    h+='<div class="wl-blocks">'+quarters.map(function(u,i){
      var frozen=(u.status!=='upcoming');
      return '<div class="wl-qblock" data-wlq="'+esc(u.q)+'"'+(i===0?'':' hidden')+'>'+
        '<div class="wl-phase">Watch List'+(frozen?'<span class="wl-frozen">frozen</span>':'')+'</div>'+
        '<p class="wl-lede"><b>'+(frozen?'The list as it was frozen — ':'Things to hunt — ')+esc(u.q)+'</b>'+(frozen?'':' — the open hooks, in our order. Use ▲▼ to rank them.')+'</p>'+
        '<div class="wl-watch" data-wlwatch="'+esc(u.q)+'" data-wlfrozen="'+(frozen?'1':'0')+'"><div class="ce-note" data-wlloading>Loading themes…</div></div>'+
        '<div class="wl-foot">'+(frozen?'Frozen — scored against '+esc(u.q)+'\'s results.':'Ours to curate. Frozen once the quarter closes.')+'</div>'+
      '</div>';
    }).join('')+'</div>';
    // flat cross-quarter view (shown when a tag is selected)
    h+='<div class="wl-all" hidden><div class="wl-phase" style="background:var(--wl-purple)">Themes across quarters</div>'+
       '<p class="wl-lede">Every theme matching the selected tag(s), across all quarters. Clear the tags to return to the per-quarter view.</p>'+
       '<div class="wl-watch" data-wlflat></div></div>';
    h+=tableHtml();
    return h;
  }

  // ══ wiring ══════════════════════════════════════════════════════════════════
  host.innerHTML='<div class="wl-body">'+shellHtml()+'</div>';
  var root=host;                                   // queries scoped to the host
  var form=root.querySelector('.wl-form');
  var flat=root.querySelector('[data-wlflat]');

  function fld(k){ return form?form.querySelector('[data-wlf="'+k+'"]'):null; }
  function fval(k){ var el=fld(k); return el?el.value.trim():''; }
  function setF(k,v){ var el=fld(k); if(el) el.value=(v==null?'':v); }
  function pickedTags(){ return Array.prototype.map.call(form.querySelectorAll('.wl-pick.on'), function(b){ return b.getAttribute('data-pick'); }); }

  function activeTags(){ return Array.prototype.map.call(root.querySelectorAll('.wl-tag.active'), function(b){ return b.getAttribute('data-wltag'); }).filter(Boolean); }
  function activeWin(){ var b=root.querySelector('.wl-win.active'); return b?b.getAttribute('data-wlwin'):'all'; }
  function selectedQuarter(){ var b=root.querySelector('.wl-qpill.active'); return b?b.getAttribute('data-wlqsel'):(quarters[0]?quarters[0].q:null); }

  function applyFilters(){
    var tags=activeTags(), on=tags.length>0, win=activeWin();
    if(on){ root.querySelectorAll('.wl-qblock').forEach(function(b){ b.hidden=true; }); }
    else{ var sel=selectedQuarter(); root.querySelectorAll('.wl-qblock').forEach(function(b){ b.hidden=(sel!=null && b.getAttribute('data-wlq')!==sel); }); }
    var all=root.querySelector('.wl-all'); if(all) all.hidden=!on;
    root.querySelectorAll('.wl-w').forEach(function(cardEl){
      var ct=(cardEl.getAttribute('data-wltags')||'').split(/\s+/);
      var op=cardEl.getAttribute('data-wlopen')==='1';
      var hitTag=!on || tags.some(function(t){ return ct.indexOf(t)>=0; });
      var hitWin=(win==='all')||(win==='open'&&op)||(win==='closed'&&!op);
      if(hitTag&&hitWin) cardEl.removeAttribute('data-wlhide'); else cardEl.setAttribute('data-wlhide','1');
    });
  }

  function registerTag(t){
    var bar=root.querySelector('[data-wltags]');
    if(bar && !root.querySelector('.wl-tag[data-wltag="'+t+'"]')){
      var b=document.createElement('button'); b.type='button'; b.className='wl-tag'; b.setAttribute('data-wltag',t); b.textContent='#'+t;
      bar.appendChild(b); wireTag(b);
    }
    var pick=form?form.querySelector('.wl-tagpick'):null;
    if(pick && !pick.querySelector('[data-pick="'+t+'"]')){
      var p=document.createElement('button'); p.type='button'; p.className='wl-pick'; p.setAttribute('data-pick',t); p.textContent='#'+t;
      p.onclick=function(){ p.classList.toggle('on'); }; pick.appendChild(p);
    }
  }
  function wireTag(btn){ btn.onclick=function(){
    if(btn.classList.contains('wl-clear')){ root.querySelectorAll('.wl-tag').forEach(function(b){ b.classList.remove('active'); }); }
    else btn.classList.toggle('active');
    applyFilters();
  }; }

  function resetForm(){
    ['id','theme','definition','trackSince','trackUntil','newtag'].forEach(function(k){ setF(k,''); });
    if(form){ form.querySelectorAll('.wl-pick.on').forEach(function(b){ b.classList.remove('on'); });
      form.querySelector('.wl-fh-t').textContent='New theme'; form.querySelector('.wl-go').textContent='Add to the live list'; }
  }

  function render(){
    // per-quarter card hosts
    root.querySelectorAll('.wl-watch[data-wlwatch]').forEach(function(hostEl){
      var qLabel=hostEl.getAttribute('data-wlwatch'), frozen=hostEl.getAttribute('data-wlfrozen')==='1';
      var rows=rowsFor(qLabel, !frozen);
      if(!rows.length){ hostEl.innerHTML='<div class="ce-note">'+(frozen?'No themes recorded for '+esc(qLabel)+'.':'No open hooks yet — add one with <b>+ Add theme</b> above.')+'</div>'; return; }
      hostEl.innerHTML=rows.map(function(w,i){ return card(w, {editable:!frozen, first:i===0, last:i===rows.length-1, qLabel:null}); }).join('');
    });
    // flat cross-quarter view
    if(flat) flat.innerHTML=ROWS.slice().sort(function(a,z){ return qkey(z.q).localeCompare(qkey(a.q))||(a.rank||0)-(z.rank||0); }).map(function(w){ return card(w, {editable:false, qLabel:w.q}); }).join('');
    // table + counter
    var tb=root.querySelector('[data-wltbody]'); if(tb) tb.innerHTML=tableRows();
    var n=root.querySelector('[data-wlcount]'); if(n) n.textContent=countLine();
    wireCards(); applyFilters();
  }

  // ── reorder (sorting): move a card up/down within its quarter, persist the new rank ──
  function reorder(row, dir){
    var list=rowsFor(row.q, true);
    var idx=list.indexOf(row); if(idx<0) return;
    var swap=dir<0?idx-1:idx+1; if(swap<0||swap>=list.length) return;
    list.splice(idx,1); list.splice(swap,0,row);
    var changed=[];
    list.forEach(function(r,i){ var nr=i+1; if(r.rank!==nr){ changed.push({r:r,old:r.rank}); r.rank=nr; } });
    render();
    Promise.all(changed.map(function(c){ return updateTheme(c.r.id, {rank:c.r.rank}); })).then(function(res){
      var bad=res.filter(function(x){ return !x||!x.success; });
      if(bad.length){ changed.forEach(function(c){ c.r.rank=c.old; }); render(); window.alert('Could not save the new order: '+((bad[0]&&bad[0].error&&bad[0].error.message)||'error')); }
    });
  }

  function wireCards(){
    root.querySelectorAll('[data-wlup]').forEach(function(btn){ btn.onclick=function(){ var r=byId(btn.getAttribute('data-wlup')); if(r) reorder(r,-1); }; });
    root.querySelectorAll('[data-wldown]').forEach(function(btn){ btn.onclick=function(){ var r=byId(btn.getAttribute('data-wldown')); if(r) reorder(r,1); }; });
    root.querySelectorAll('[data-wledit]').forEach(function(btn){ btn.onclick=function(){
      var r=byId(btn.getAttribute('data-wledit')); if(!r||!form) return;
      resetForm(); form.hidden=false;
      setF('id',r.id); setF('theme',r.theme); setF('definition',r.definition); setF('trackSince',r.trackSince); setF('trackUntil',r.trackUntil);
      (r.tags||[]).forEach(function(t){ registerTag(t); var p=form.querySelector('.wl-pick[data-pick="'+t+'"]'); if(p) p.classList.add('on'); });
      form.querySelector('.wl-fh-t').textContent='Edit theme'; form.querySelector('.wl-go').textContent='Save changes';
      form.scrollIntoView({block:'nearest'});
    }; });
    root.querySelectorAll('[data-wldel]').forEach(function(btn){ btn.onclick=function(){
      var r=byId(btn.getAttribute('data-wldel')); if(!r) return;
      var live=upcoming();
      // THE DELETE RULE: only deletable from the quarter it was created in. Later, it is part of the
      // record — the only change allowed is to CLOSE it (fill Tracking until).
      if(r.createdQuarter && live && r.createdQuarter!==live.q){
        window.alert('Can’t delete “'+r.theme+'”.\n\nIt was created in '+r.createdQuarter+' and the live quarter is now '+live.q+'. A theme can only be deleted from the quarter it was created in.\n\nThe only change allowed now is to CLOSE it (this or an earlier quarter): use ✎ and fill “Tracking until”.');
        return;
      }
      if(!window.confirm('Delete “'+r.theme+'” from the Watch List?\n\nThis removes it from the shared database for the whole team, and cannot be undone.')) return;
      btn.disabled=true;
      deleteTheme(r.id).then(function(res){
        if(!res||!res.success){ btn.disabled=false; window.alert('Could not delete: '+((res&&res.error&&res.error.message)||'unknown error')); return; }
        var i=ROWS.indexOf(r); if(i>=0) ROWS.splice(i,1);
        render();
      });
    }; });
  }

  // filters + window + quarter pills + add button
  root.querySelectorAll('.wl-tag').forEach(wireTag);
  root.querySelectorAll('.wl-win').forEach(function(btn){ btn.onclick=function(){ root.querySelectorAll('.wl-win').forEach(function(b){ b.classList.toggle('active', b===btn); }); applyFilters(); }; });
  root.querySelectorAll('.wl-qpill').forEach(function(btn){ btn.onclick=function(){ root.querySelectorAll('.wl-qpill').forEach(function(b){ b.classList.toggle('active', b===btn); }); applyFilters(); }; });
  var addBtn=root.querySelector('.wl-add-btn');
  if(addBtn&&form) addBtn.onclick=function(){ if(form.hidden){ resetForm(); form.hidden=false; } else form.hidden=true; };
  if(form){
    var nt=form.querySelector('.wl-newtag-go');
    if(nt) nt.onclick=function(){ var raw=fval('newtag'); if(!raw) return; raw.split(',').forEach(function(t){ t=t.trim().toLowerCase().replace(/\s+/g,'-'); if(!t) return; registerTag(t); var p=form.querySelector('.wl-pick[data-pick="'+t+'"]'); if(p) p.classList.add('on'); }); setF('newtag',''); };
    var cancel=form.querySelector('.wl-cancel'); if(cancel) cancel.onclick=function(){ resetForm(); form.hidden=true; };
  }

  // submit (add or edit)
  var go=root.querySelector('.wl-go');
  if(go&&form){ go.onclick=function(){
    var theme=fval('theme'); if(!theme){ var t=fld('theme'); if(t) t.focus(); return; }
    var live=upcoming(); if(!live) return;
    if(!companyId){ window.alert('No company context — cannot save themes.'); return; }
    var id=fval('id'); var existing=id?byId(id):null; var isNew=!existing;
    var tags=pickedTags(), definition=fval('definition')||null, trackSince=fval('trackSince')||null, trackUntil=fval('trackUntil')||null;
    tags.forEach(registerTag);
    go.disabled=true;
    if(isNew){
      var payload={ company_id:companyId, ticker:ticker, q:live.q, created_quarter:live.q, rank:nextRank(live.q),
        theme:theme, tags:tags, definition:definition, track_since:trackSince, track_until:trackUntil, seeded_by:null, src:null, thread:null };
      insertTheme(payload).then(function(res){
        go.disabled=false;
        if(!res||!res.success){ window.alert('Could not save: '+((res&&res.error&&res.error.message)||'unknown error')); return; }
        ROWS.push(fromDb(res.data)); resetForm(); form.hidden=true; render();
      });
    } else {
      var updates={ theme:theme, tags:tags, definition:definition, track_since:trackSince, track_until:trackUntil };
      updateTheme(existing.id, updates).then(function(res){
        go.disabled=false;
        if(!res||!res.success){ window.alert('Could not save: '+((res&&res.error&&res.error.message)||'unknown error')); return; }
        var fresh=fromDb(res.data); Object.keys(fresh).forEach(function(k){ existing[k]=fresh[k]; });
        resetForm(); form.hidden=true; render();
      });
    }
  }; }

  // table toggle + copy
  root.querySelectorAll('[data-wltoggle]').forEach(function(btn){ btn.onclick=function(){ var b=root.querySelector('[data-wltblbody]'); if(!b) return; var hide=!b.hasAttribute('hidden'); if(hide) b.setAttribute('hidden',''); else b.removeAttribute('hidden'); btn.textContent=hide?'show table':'hide table'; }; });
  root.querySelectorAll('.wl-copy[data-wlcopy]').forEach(function(btn){ btn.onclick=function(){
    var kind=btn.getAttribute('data-wlcopy'), txt;
    if(kind==='json'){ txt=JSON.stringify(ROWS,null,2); }
    else { txt=[COLS.map(function(c){ return c.l; }).join('\t')].concat(ROWS.map(function(r){ return COLS.map(function(c){ return cellText(r,c.k).replace(/[\t\n]+/g,' '); }).join('\t'); })).join('\n'); }
    var done=function(){ var o=btn.textContent; btn.textContent='copied ✓'; setTimeout(function(){ btn.textContent=o; },1500); };
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(done,done); }
    else { var ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); }catch(e){} document.body.removeChild(ta); done(); }
  }; });

  // ── load from Supabase, then render ──
  function load(){
    var hosts=root.querySelectorAll('.wl-watch[data-wlwatch]');
    if(!companyId){ hosts.forEach(function(h){ h.innerHTML='<div class="ce-note">Themes load from the shared database once this company is set up (no company id).</div>'; }); return; }
    fetchThemes(companyId).then(function(res){
      if(!res||!res.success){ hosts.forEach(function(h){ h.innerHTML='<div class="ce-note">Could not load themes: '+esc((res&&res.error&&res.error.message)||'unknown error')+'. (Has sql/010_company_themes.sql been run in Supabase?)</div>'; }); return; }
      ROWS.length=0; (res.data||[]).forEach(function(r){ ROWS.push(fromDb(r)); });
      allTags().forEach(registerTag);
      render();
    });
  }

  applyFilters();
  load();

  // a small handle in case the host wants to force a reload later
  return { reload: load };
}
