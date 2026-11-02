// bbb-notes.js — Evolution ▸ Earnings ▸ Notes for Tiendas 3B: the theme record, a living register of the threads the team
// follows call to call (docs/PROFILE_PLAYBOOK.md §12 EV-NOTES and §24).
//   Theme (an axis of the business)
//    └─ Sub-theme = one thread; status Confirmed trend | Promise, reconcile | Watch; a tracking window; notes by call quarter
// Seed: js/themes-data/tbbb.js (generated from the 11 earnings calls on file). Persistence: Supabase table
// company_theme_record, one record per company holding this whole array. Once a record is saved, that copy wins and the
// seed is no longer read; this module saves ONLY on an edit, never on render, so a seed refresh stays visible until then.
// Views: By theme (default) | By quarter; a "Since" filter; All | Open | Closed hooks; add a note to any sub-theme.
import { TBBB_THEMES } from '../themes-data/tbbb.js';

var REC = null;                                   // the working record (array of sub-themes)
var _co = null, _view = 'theme', _since = '', _hook = 'all', _saveT = null, _saved = false;
var SUMMIT = { trend: '#1F9D55', promise: '#B7791F', watch: '#2557D6', closed: '#5B7085' };
var ST_LABEL = { trend: 'Confirmed trend', promise: 'Promise: reconcile', watch: 'Watch' };

function esc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function qn(q){ var m = String(q || '').match(/Q(\d)\s+(\d{4})/); return m ? (+m[2]) * 4 + (+m[1]) : null; }
function isClosed(t){ return !!(t.st && t.st.until); }
function clone(a){ return JSON.parse(JSON.stringify(a)); }
function allQuarters(){
  var seen = {}, out = [];
  REC.forEach(function(t){ (t.updates || []).forEach(function(u){ if (!seen[u.q]) { seen[u.q] = 1; out.push(u.q); } }); });
  return out.sort(function(a, b){ return qn(b) - qn(a); });
}
function age(t){
  var a = qn(t.st && t.st.since), b = qn(t.st && (t.st.until || t.st.last));
  if (a == null || b == null) return '';
  var n = b - a + 1;
  return isClosed(t) ? 'reconciled ' + t.st.until + ' after ' + n + ' quarter' + (n === 1 ? '' : 's') : 'tracked ' + n + ' quarter' + (n === 1 ? '' : 's') + ' since ' + t.st.since;
}
function visibleUpdates(t){
  var s = qn(_since);
  return (t.updates || []).filter(function(u){ return s == null || qn(u.q) >= s; }).sort(function(a, b){ return qn(b.q) - qn(a.q); });
}
function hookOK(t){ return _hook === 'all' || (_hook === 'open' ? !isClosed(t) : isClosed(t)); }

function chip(t){
  var k = isClosed(t) ? 'closed' : (t.st && t.st.k) || 'watch';
  var lab = isClosed(t) ? 'Closed ' + t.st.until : (ST_LABEL[(t.st && t.st.k)] || 'Watch');
  return '<span class="tn-chip" style="color:' + SUMMIT[k] + ';border-color:' + SUMMIT[k] + '33;background:' + SUMMIT[k] + '12">' + esc(lab) + '</span>';
}
function noteList(u){ return '<ul class="tn-items">' + (u.items || []).map(function(i){ return '<li>' + i + '</li>'; }).join('') + '</ul>'; }

function subTheme(t, idx){
  var ups = visibleUpdates(t);
  if (!ups.length) return '';
  return '<div class="tn-sub" data-i="' + idx + '">' +
    '<div class="tn-sub-h"><span class="tn-sub-t">' + esc(t.theme) + '</span>' + chip(t) + '<span class="tn-age">' + esc(age(t)) + '</span></div>' +
    (t.why ? '<div class="tn-why">' + esc(t.why) + '</div>' : '') +
    ups.map(function(u){ return '<div class="tn-q"><div class="tn-q-l">' + esc(u.q) + '</div>' + noteList(u) + '</div>'; }).join('') +
    '<div class="tn-add"><button type="button" class="tn-addbtn" data-i="' + idx + '">✎ Add note</button></div>' +
  '</div>';
}
function byTheme(){
  var order = [], seen = {};
  REC.forEach(function(t){ if (!seen[t.seg]) { seen[t.seg] = 1; order.push(t.seg); } });
  return order.map(function(seg){
    var subs = REC.map(function(t, i){ return t.seg === seg && hookOK(t) ? subTheme(t, i) : ''; }).join('');
    if (!subs) return '';
    var n = REC.filter(function(t){ return t.seg === seg && hookOK(t); }).length;
    return '<details class="tn-seg" open><summary class="tn-seg-h"><span class="tn-caret">▸</span>' + esc(seg) + '<span class="tn-seg-n">' + n + ' thread' + (n === 1 ? '' : 's') + '</span></summary>' + subs + '</details>';
  }).join('') || '<div class="tn-empty">No threads match this filter.</div>';
}
function byQuarter(){
  var map = {}, order = [];
  REC.forEach(function(t){ if (!hookOK(t)) return; visibleUpdates(t).forEach(function(u){ if (!map[u.q]) { map[u.q] = []; order.push(u.q); } map[u.q].push({ t: t, u: u }); }); });
  order.sort(function(a, b){ return qn(b) - qn(a); });
  return order.map(function(q){
    return '<details class="tn-seg" open><summary class="tn-seg-h"><span class="tn-caret">▸</span>' + esc(q) + ' call<span class="tn-seg-n">' + map[q].length + ' note group' + (map[q].length === 1 ? '' : 's') + '</span></summary>' +
      map[q].map(function(x){ return '<div class="tn-sub"><div class="tn-sub-h"><span class="tn-sub-t">' + esc(x.t.theme) + '</span>' + chip(x.t) + '<span class="tn-age">' + esc(x.t.seg) + '</span></div>' + noteList(x.u) + '</div>'; }).join('') +
    '</details>';
  }).join('') || '<div class="tn-empty">No notes match this filter.</div>';
}
function render(host){
  var qs = allQuarters(), nClosed = REC.filter(isClosed).length, nOpen = REC.length - nClosed;
  host.querySelector('.tn-body').innerHTML = _view === 'theme' ? byTheme() : byQuarter();
  host.querySelector('.tn-since').innerHTML = '<option value="">All calls</option>' + qs.slice().reverse().map(function(q){ return '<option value="' + esc(q) + '"' + (q === _since ? ' selected' : '') + '>From ' + esc(q) + '</option>'; }).join('');
  host.querySelectorAll('.tn-hook').forEach(function(b){
    var k = b.getAttribute('data-h'); b.classList.toggle('active', k === _hook);
    b.textContent = { all: 'All (' + REC.length + ')', open: 'Open hooks (' + nOpen + ')', closed: 'Closed (' + nClosed + ')' }[k];
  });
  host.querySelectorAll('.tn-view').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-v') === _view); });
  wireAdd(host);
}
function persist(){
  if (!_co || !_co.id) return;
  clearTimeout(_saveT);
  _saveT = setTimeout(function(){
    import('../api.js').then(function(m){ return m.saveThemeRecord(_co.id, _co.ticker, REC); }).then(function(){ _saved = true; }).catch(function(){});
  }, 400);
}
function wireAdd(host){
  host.querySelectorAll('.tn-addbtn').forEach(function(btn){ btn.onclick = function(){
    var i = +btn.getAttribute('data-i'), box = btn.parentNode;
    if (box.querySelector('.tn-form')) return;
    var qs = allQuarters(), next = 'Q3 2026';
    if (qs.indexOf(next) < 0) qs.unshift(next);
    var f = document.createElement('div'); f.className = 'tn-form';
    f.innerHTML = '<select class="tn-fq">' + qs.map(function(q){ return '<option>' + esc(q) + '</option>'; }).join('') + '</select>' +
      '<textarea class="tn-ft" rows="2" placeholder="One fact, figure or promise, in English, with the call quarter. No investment opinion."></textarea>' +
      '<button type="button" class="tn-fs">Save note</button><button type="button" class="tn-fc">Cancel</button><span class="tn-fm"></span>';
    box.appendChild(f);
    f.querySelector('.tn-fc').onclick = function(){ f.remove(); };
    f.querySelector('.tn-fs').onclick = function(){
      var q = f.querySelector('.tn-fq').value, txt = f.querySelector('.tn-ft').value.trim(), msg = f.querySelector('.tn-fm');
      if (!txt) { msg.textContent = 'Write the note first.'; return; }
      var t = REC[i], safe = esc(txt), up = (t.updates || []).filter(function(u){ return u.q === q; })[0];
      if (up && up.items.indexOf(safe) >= 0) { msg.textContent = 'That note already exists for this quarter.'; return; }
      if (!up) { up = { q: q, items: [] }; t.updates = t.updates || []; t.updates.push(up); }
      up.items.push(safe);
      if (qn(q) > qn(t.st.last)) t.st.last = q;
      persist(); render(host);
    };
  }; });
}

var CSS = '<style>' +
  '.tn-band{border:1px solid var(--bdr);border-radius:12px;background:var(--w);padding:12px 14px;margin:0 0 12px}' +
  '.tn-band-t{font-size:12.5px;font-weight:800;color:var(--navy)}.tn-band-s{font-size:11px;color:var(--mu);margin-top:3px;line-height:1.5}' +
  '.tn-ctl{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:0 0 12px}' +
  '.tn-pill{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11px;font-weight:700;color:var(--mu);padding:5px 11px;border-radius:999px;cursor:pointer}' +
  '.tn-pill.active{background:var(--navy);color:#fff;border-color:var(--navy)}' +
  '.tn-since{border:1px solid var(--bdr);border-radius:8px;font:inherit;font-size:11px;padding:5px 8px;background:var(--w);color:var(--navy)}' +
  '.tn-seg{border:1px solid var(--bdr);border-radius:12px;margin:0 0 10px;overflow:hidden;background:var(--w)}' +
  '.tn-seg-h{cursor:pointer;list-style:none;display:flex;align-items:center;gap:8px;padding:11px 14px;font-size:12.5px;font-weight:800;color:var(--navy);background:#F7F9FB}' +
  '.tn-seg-h::-webkit-details-marker{display:none}.tn-caret{font-size:10px;color:var(--mu);transition:.15s}.tn-seg[open] .tn-caret{transform:rotate(90deg)}' +
  '.tn-seg-n{margin-left:auto;font-size:10.5px;font-weight:700;color:var(--mu)}' +
  '.tn-sub{padding:12px 14px;border-top:1px solid var(--bdr)}' +
  '.tn-sub-h{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.tn-sub-t{font-size:12.5px;font-weight:800;color:var(--navy)}' +
  '.tn-chip{font-size:10px;font-weight:800;border:1px solid;border-radius:999px;padding:2px 9px;text-transform:uppercase;letter-spacing:.03em}' +
  '.tn-age{font-size:10.5px;color:var(--mu);font-weight:600}.tn-why{font-size:11.5px;color:var(--mu);font-style:italic;margin:5px 0 8px;line-height:1.5}' +
  '.tn-q{display:flex;gap:10px;margin:6px 0}.tn-q-l{flex:none;width:62px;font-size:10.5px;font-weight:800;color:var(--navy);padding-top:2px}' +
  '.tn-items{margin:0;padding-left:16px;font-size:12px;color:var(--navy);line-height:1.55}.tn-items li{margin:0 0 3px}' +
  '.tn-add{margin-top:8px}.tn-addbtn{border:none;background:none;font:inherit;font-size:11px;font-weight:700;color:#2557D6;cursor:pointer;padding:0}' +
  '.tn-form{display:flex;flex-wrap:wrap;gap:6px;align-items:flex-start;margin-top:8px}.tn-ft{flex:1;min-width:240px;font:inherit;font-size:12px;border:1px solid var(--bdr);border-radius:8px;padding:6px 8px}' +
  '.tn-fq{font:inherit;font-size:11.5px;border:1px solid var(--bdr);border-radius:8px;padding:5px}.tn-fs,.tn-fc{font:inherit;font-size:11px;font-weight:700;border-radius:8px;padding:6px 12px;cursor:pointer;border:1px solid var(--bdr);background:var(--w)}' +
  '.tn-fs{background:var(--navy);color:#fff;border-color:var(--navy)}.tn-fm{font-size:11px;color:#C0392B;align-self:center}.tn-empty{padding:20px;text-align:center;color:var(--mu);font-size:12px}' +
'</style>';

function body(){
  return CSS + '<div class="tn-host">' +
    '<div class="tn-band"><div class="tn-band-t">▤ The theme record: every thread, across all calls</div>' +
    '<div class="tn-band-s">Generated from the 11 earnings calls on file (4Q23 to 2Q26) and each quarter\'s release; the team has not added notes yet. A note is one fact, figure or promise with its call quarter. Edits save to the company record.</div></div>' +
    '<div class="tn-ctl"><button type="button" class="tn-pill tn-view active" data-v="theme">By theme</button><button type="button" class="tn-pill tn-view" data-v="quarter">By quarter</button>' +
    '<select class="tn-since"></select><span style="flex:1"></span>' +
    '<button type="button" class="tn-pill tn-hook active" data-h="all"></button><button type="button" class="tn-pill tn-hook" data-h="open"></button><button type="button" class="tn-pill tn-hook" data-h="closed"></button></div>' +
    '<div class="tn-body"></div>' +
    '<div class="ov-foot">Sources: BBB Foods earnings call transcripts (Apr 2024 to Aug 2026), quarterly earnings releases (Form 6-K) and Form 20-F. Notes paraphrase management and the releases; they carry no investment view.</div>' +
  '</div>';
}
function init(root, co){
  var host = root.querySelector('.tn-host'); if (!host) return;
  _co = co || _co;
  if (!REC) REC = clone(TBBB_THEMES);
  render(host);
  if (!host._wired) {
    host._wired = true;
    host.querySelectorAll('.tn-view').forEach(function(b){ b.onclick = function(){ _view = b.getAttribute('data-v'); render(host); }; });
    host.querySelectorAll('.tn-hook').forEach(function(b){ b.onclick = function(){ _hook = b.getAttribute('data-h'); render(host); }; });
    host.querySelector('.tn-since').onchange = function(e){ _since = e.target.value; render(host); };
    // A record saved by the portal wins over the seed.
    if (_co && _co.id) import('../api.js').then(function(m){ return m.fetchThemeRecord(_co.id); }).then(function(res){
      var rec = res && res.success ? res.data : null;
      if (Array.isArray(rec) && rec.length) { REC = rec; render(host); }
    }).catch(function(){});
  }
}
export var bbbNotes = { body: body, init: init };
