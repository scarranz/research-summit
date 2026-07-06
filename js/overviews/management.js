// overviews/management.js — shared "Management" sub-tab for the gig-marketplace names
// (UBER / LYFT / CART). Config-driven: each company passes its leadership roster and
// makeManagement(cfg) renders a clean executive grid + a CV modal, plus a compact
// board strip. Public-source bios only — no ownership counts or insider trades
// (those live in the Pillars → Management pillar / Bloomberg).
//
// Avatars are initials (the portal CSP only allows same-origin images, so we avoid
// external headshots). Everything is pure CSS/HTML — CSP-safe, no chart lib.

function mEsc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function mInitials(name){
  var parts = String(name||'').trim().split(/\s+/).filter(function(w){ return /[A-Za-zÀ-ÿ]/.test(w); });
  var a = parts.length ? parts[0].charAt(0) : '';
  var b = parts.length > 1 ? parts[parts.length-1].charAt(0) : '';
  return (a+b).toUpperCase();
}

export function makeManagement(cfg){
  var A = cfg.brand || '#12356B';
  var people = {}; cfg.execs.forEach(function(e){ people[e.id]=e; });

  function av(e, big){
    var cls='mg2-av'+(big?' mg2-av-lg':'');
    if(e.img) return '<span class="'+cls+' mg2-av-img" data-ini="'+mEsc(mInitials(e.name))+'"><img src="'+mEsc(e.img)+'" alt="'+mEsc(e.name)+'" loading="lazy" onerror="var s=this.parentNode;s.style.background=\''+A+'\';s.style.color=\'#fff\';s.textContent=s.getAttribute(\'data-ini\')"></span>';
    return '<span class="'+cls+'" style="background:'+A+'">'+mEsc(mInitials(e.name))+'</span>';
  }

  function body(){
    var h = '<style>'+
      '.mg2{--acc:'+A+'}'+
      '.mg2-lede{font-size:13px;line-height:1.6;color:var(--navy);margin:0 0 14px}.mg2-lede b{font-weight:800}'+
      '.mg2-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:11px}'+
      '.mg2-card{border:1px solid var(--bdr);border-radius:12px;padding:13px 14px;cursor:pointer;transition:border-color .15s,box-shadow .15s,transform .15s;background:#fff;display:flex;flex-direction:column}'+
      '.mg2-card:hover{border-color:var(--acc);box-shadow:0 3px 14px rgba(0,0,0,.08);transform:translateY(-2px)}'+
      '.mg2-card.mg2-lead{grid-column:1/-1;background:linear-gradient(180deg,rgba(0,0,0,0.015),transparent);border-left:3px solid var(--acc)}'+
      '.mg2-top{display:flex;align-items:center;gap:11px}'+
      '.mg2-av{width:40px;height:40px;border-radius:50%;color:#fff;font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:center;flex:none;letter-spacing:.3px}'+
      '.mg2-av-lg{width:56px;height:56px;font-size:19px}'+
      '.mg2-av-img{position:relative;overflow:hidden;background:#eef2f7}'+
      '.mg2-av-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:50%}'+
      '.mg2-tag{display:inline-block;font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;padding:1px 6px;border-radius:20px;background:rgba(10,143,10,0.12);color:#0a8f0a;vertical-align:middle;margin-left:6px}'+
      '.mg2-tag-in{background:rgba(138,147,160,0.18);color:var(--mu)}'+
      '.mg2-bd.mg2-dual{opacity:.7}'+
      '.mg2-gov{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}'+
      '.mg2-gov-c{border:1px solid var(--bdr);border-top:2px solid var(--acc);border-radius:10px;padding:11px 13px}'+
      '.mg2-gov-k{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--mu)}'+
      '.mg2-gov-v{font-size:15px;font-weight:800;color:var(--navy);margin-top:3px;line-height:1.25}'+
      '.mg2-gov-n{font-size:10.5px;color:var(--mu);margin-top:3px;line-height:1.4}'+
      '.mg2-name{font-size:13.5px;font-weight:800;color:var(--navy);line-height:1.15}'+
      '.mg2-title{font-size:11.5px;color:var(--acc);font-weight:700;margin-top:1px}'+
      '.mg2-since{font-size:10.5px;color:var(--mu);font-weight:700;margin:7px 0 0}'+
      '.mg2-blurb{font-size:11.5px;color:var(--navy);line-height:1.5;margin-top:6px;flex:1}'+
      '.mg2-more{font-size:10.5px;font-weight:800;color:var(--acc);margin-top:8px}'+
      '.mg2-sec-h{font-size:12.5px;font-weight:800;color:var(--navy);margin:20px 0 9px;padding-bottom:5px;border-bottom:1px solid var(--bdr)}'+
      '.mg2-board{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px}'+
      '.mg2-bd{border:1px solid var(--bdr);border-radius:9px;padding:9px 11px}'+
      '.mg2-bd.mg2-chair{border-left:3px solid var(--acc)}'+
      '.mg2-bd-n{font-size:12px;font-weight:800;color:var(--navy)}'+
      '.mg2-bd-r{font-size:10.5px;color:var(--mu);margin-top:1px;line-height:1.4}'+
      '.mg2-modal{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}'+
      '.mg2-modal[hidden]{display:none}'+
      '.mg2-modal-bd{position:absolute;inset:0;background:rgba(14,21,36,0.55)}'+
      '.mg2-modal-card{position:relative;background:#fff;border-radius:14px;max-width:440px;width:100%;padding:20px 22px;box-shadow:0 20px 60px rgba(0,0,0,.3);max-height:85vh;overflow:auto}'+
      '.mg2-x{position:absolute;top:12px;right:14px;border:0;background:transparent;font-size:22px;line-height:1;color:var(--mu);cursor:pointer}'+
      '.mg2-card-top{display:flex;align-items:center;gap:13px;margin-bottom:12px;padding-right:20px}'+
      '.mg2-card-name{font-size:17px;font-weight:800;color:var(--navy)}'+
      '.mg2-card-title{font-size:12.5px;color:var(--acc);font-weight:700}'+
      '.mg2-card-since{font-size:11px;color:var(--mu);margin-top:2px}'+
      '.mg2-card-bio{font-size:12.5px;line-height:1.65;color:var(--navy)}'+
    '</style>';
    h += '<div class="mg2">';
    h += '<p class="mg2-lede">'+cfg.lede+'</p>';
    h += '<div class="mg2-grid">'+cfg.execs.map(function(e){
      return '<div class="mg2-card'+(e.lead?' mg2-lead':'')+'" data-pid="'+mEsc(e.id)+'" role="button" tabindex="0">'+
        '<div class="mg2-top">'+av(e,false)+'<div><div class="mg2-name">'+mEsc(e.name)+'</div><div class="mg2-title">'+mEsc(e.title)+'</div></div></div>'+
        (e.since?'<div class="mg2-since">'+mEsc(e.since)+'</div>':'')+
        '<div class="mg2-blurb">'+mEsc(e.line)+'</div>'+
        '<div class="mg2-more">Full bio ›</div>'+
      '</div>';
    }).join('')+'</div>';
    if(cfg.board && cfg.board.length){
      h += '<div class="mg2-sec-h">Board of Directors'+(cfg.boardNote?' <span style="font-weight:600;color:var(--mu);font-size:11px">— '+cfg.boardNote+'</span>':'')+'</div>';
      h += '<div class="mg2-board">'+cfg.board.map(function(b){
        var tag = b.independent===false ? '<span class="mg2-tag mg2-tag-in">Insider</span>' : (b.independent ? '<span class="mg2-tag">Independent</span>' : '');
        return '<div class="mg2-bd'+(b.chair?' mg2-chair':'')+(b.dual?' mg2-dual':'')+'"><div class="mg2-bd-n">'+mEsc(b.name)+tag+'</div>'+
          '<div class="mg2-bd-r">'+mEsc(b.role)+(b.dual?' · also management (see above)':'')+'</div></div>';
      }).join('')+'</div>';
    }
    if(cfg.gov && cfg.gov.length){
      h += '<div class="mg2-sec-h">Governance &amp; compensation</div>';
      h += '<div class="mg2-gov">'+cfg.gov.map(function(g){ return '<div class="mg2-gov-c"><div class="mg2-gov-k">'+mEsc(g.k)+'</div><div class="mg2-gov-v">'+g.v+'</div>'+(g.d?'<div class="mg2-gov-n">'+g.d+'</div>':'')+'</div>'; }).join('')+'</div>';
    }
    h += '<div class="ov-foot">'+(cfg.foot||'')+'</div>';
    h += '<div class="mg2-modal" hidden><div class="mg2-modal-bd" data-close="1"></div>'+
      '<div class="mg2-modal-card" role="dialog" aria-modal="true"><button type="button" class="mg2-x" data-close="1" aria-label="Close">×</button>'+
      '<div class="mg2-card-top"><span class="mg2-card-av"></span><div><div class="mg2-card-name"></div><div class="mg2-card-title"></div><div class="mg2-card-since"></div></div></div>'+
      '<div class="mg2-card-bio"></div></div></div>';
    h += '</div>';
    return h;
  }

  function init(root){
    var scope = root.querySelector('.ovt-pane[data-ovt="mgmt"]') || root.querySelector('.ov-pane[data-capane="mgmt"]') || root;
    var modal = scope.querySelector('.mg2-modal'); if(!modal) return;
    var avEl=modal.querySelector('.mg2-card-av'), nEl=modal.querySelector('.mg2-card-name'),
        tEl=modal.querySelector('.mg2-card-title'), sEl=modal.querySelector('.mg2-card-since'), bEl=modal.querySelector('.mg2-card-bio');
    function open(pid){ var p=people[pid]; if(!p) return;
      var ini=mInitials(p.name);
      if(p.img){ avEl.className='mg2-card-av mg2-av mg2-av-lg mg2-av-img'; avEl.style.background=''; avEl.setAttribute('data-ini',ini);
        avEl.innerHTML='<img src="'+mEsc(p.img)+'" alt="'+mEsc(p.name)+'" onerror="var s=this.parentNode;s.style.background=\''+A+'\';s.style.color=\'#fff\';s.textContent=s.getAttribute(\'data-ini\')">';
      } else { avEl.className='mg2-card-av mg2-av mg2-av-lg'; avEl.style.background=A; avEl.style.color='#fff'; avEl.textContent=ini; }
      nEl.textContent=p.name; tEl.textContent=p.title; sEl.textContent=p.since||''; bEl.textContent=p.bio||p.line||'';
      modal.hidden=false;
    }
    function close(){ modal.hidden=true; }
    scope.querySelectorAll('[data-pid]').forEach(function(el){
      el.onclick=function(){ open(el.getAttribute('data-pid')); };
      el.onkeydown=function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(el.getAttribute('data-pid')); } };
    });
    modal.querySelectorAll('[data-close]').forEach(function(el){ el.onclick=close; });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape' && !modal.hidden) close(); });
  }

  return { body:body, init:init };
}
