// dhr-callprep.js — Danaher, Deep Dive ▸ Evolution ▸ Earnings (the Call Prep pane).
//
// Built to docs/EARNINGS_CONVENTIONS.md §6: the quarter selector plus three phases —
// Setup · Watch List · Post-Results — with per-quarter blocks (`.ce-qblock[data-ceq]`) that the
// quarter pills toggle, so the page stays light as quarters accumulate. The class names and the
// visual language are the ones amzn.js / googl.js use; the machinery here is a lean re-build
// rather than a port, because Danaher needs none of the note-composer chrome those carry.
//
// ── THE ONE STRUCTURAL DIFFERENCE FROM AMAZON, AND IT IS A DATA DIFFERENCE ────────────────────
// Amazon's Setup grid shows a Street number AND a Summit number behind a Consensus ⇄ Summit ⇄
// Both toggle. Danaher has no Summit model (`search_ticker('Danaher')` → no_matches), so there is
// one estimate column and no toggle. The second column is not left empty and it is not faked —
// it is replaced by the thing Danaher actually gives that Amazon does not: **the company's own
// guide**, which for Q3 2026 is numeric for the first time in its history. Street vs guide is a
// real disparity row; Street vs a blank is not.
//
// ── WHERE THE NUMBERS COME FROM ──────────────────────────────────────────────────────────────
// Every estimate and every actual in the Setup grid and the scorecard is READ THROUGH
// js/results-data/dhr.js — nothing is re-hardcoded here. That dataset's provenance rules apply
// unchanged: reported figures from the 10-K/10-Q segment notes and the 8-K releases, forward
// consensus from the Bloomberg BEst export, pre-print consensus (1Q25–2Q26 only) from earnings-day
// coverage. If a number looks wrong, it is wrong in the dataset and fixing it here would create a
// second copy. The only figures authored in THIS file are the ones that exist solely as words on
// a call — they are marked `spoken:true` and rendered with a "said on the call" marker.
//
// The theme record below the Watch List is js/themes-data/dhr.js.

import { dhrResults } from '../results-data/dhr.js';
import { DHR_THEMES } from '../themes-data/dhr.js';
import { mountWatchList } from '../watchlist.js';

var BRAND = '#0F7DC2', BRAND2 = '#1E3A5F', GRAY = '#9AA4B0';
var UP = '#2E8B57', DOWN = '#C0504D', AMBER = '#B7791F';

function esc(s){ if (s == null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function qkey(q){ return String(q || '').replace(/\s/g, ''); }

// ═══ Quarters ═════════════════════════════════════════════════════════════════════════════════
// Newest/upcoming first, active by default (§6). `pk` is the period key in the Results dataset —
// the join between this pane and the data, so a quarter is never named in two notations.
var QUARTERS = [
  { q:'Q3 2026', pk:'3Q26', status:'upcoming', date:'expected late Oct 2026', prior:'3Q25' },
  { q:'Q2 2026', pk:'2Q26', status:'reported', date:'21 Jul 2026',            prior:'2Q25' },
  { q:'Q1 2026', pk:'1Q26', status:'reported', date:'21 Apr 2026',            prior:'1Q25' },
  { q:'Q4 2025', pk:'4Q25', status:'reported', date:'28 Jan 2026',            prior:'4Q24' }
];
export var DHR_CALL_QUARTERS = QUARTERS.map(function(x){ return { q:x.q, status:x.status }; });

// ═══ Reading the Results dataset ══════════════════════════════════════════════════════════════
function M(k){ var v = dhrResults.views.q; return (v && v.metrics[k]) || null; }
function at(k, period, src){
  var m = M(k); if (!m) return null;
  var i = m.periods.indexOf(period); if (i < 0) return null;
  var a = m[src || 'act']; return (a && a[i] != null) ? a[i] : null;
}
function guideAt(k, period){
  var m = M(k); if (!m || !m.guideLo) return null;
  var i = m.periods.indexOf(period); if (i < 0) return null;
  return (m.guideLo[i] != null && m.guideHi[i] != null) ? [m.guideLo[i], m.guideHi[i]] : null;
}
function fmtM(v){ return v == null ? '—' : (v < 0 ? '−$' : '$') + Math.abs(Math.round(v)).toLocaleString('en-US') + 'M'; }
function fmtEps(v){ return v == null ? '—' : '$' + Number(v).toFixed(2); }
function fmtPct(v, d){ return v == null ? '—' : (v > 0 ? '+' : '') + Number(v).toFixed(d == null ? 1 : d) + '%'; }
function fmtBy(unit, v){ return unit === 'eps' ? fmtEps(v) : unit === 'pct' ? fmtPct(v) : fmtM(v); }
function growth(cur, base){ return (cur == null || base == null || !base) ? null : (cur / base - 1) * 100; }
function marginPct(v, rev){ return (v == null || rev == null || !rev) ? null : (v / rev) * 100; }

// ═══ Style ════════════════════════════════════════════════════════════════════════════════════
// Scoped under .ce-dhr so the generic class names cannot reach the rest of the portal.
function style(){
  return '<style>' + [
    '.ce-dhr{--ce-b:' + BRAND + ';--ce-b2:' + BRAND2 + '}',
    '.ce-dhr .ce-note{font-size:11.5px;color:var(--mu);line-height:1.55;background:#F7F9FB;border:1px solid var(--bdr);border-radius:9px;padding:10px 13px;margin:0 0 14px}',
    '.ce-dhr .ce-phtabs{display:inline-flex;gap:3px;background:rgba(15,125,194,0.08);border:1px solid var(--bdr);border-radius:9px;padding:4px;margin:0 0 18px}',
    '.ce-dhr .ce-phtab{background:none;border:none;color:var(--mu);font:inherit;font-size:12px;letter-spacing:.5px;text-transform:uppercase;font-weight:700;padding:7px 16px;border-radius:6px;cursor:pointer;transition:.15s;white-space:nowrap}',
    '.ce-dhr .ce-phtab:hover{color:var(--navy)}.ce-dhr .ce-phtab.active{background:var(--ce-b);color:#fff}',
    '.ce-dhr .ce-qpills{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 16px}',
    '.ce-dhr .ce-qpill{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11px;font-weight:800;color:var(--mu);padding:5px 13px;border-radius:999px;cursor:pointer;transition:.12s}',
    '.ce-dhr .ce-qpill:hover{color:var(--navy)}.ce-dhr .ce-qpill.active{background:var(--ce-b2);color:#fff;border-color:var(--ce-b2)}',
    '.ce-dhr .ce-qtag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;margin-left:6px;opacity:.75}',
    '.ce-dhr .ce-qblock[hidden],.ce-dhr .ce-phpane[hidden]{display:none}',
    '.ce-dhr .ce-h{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);margin:0 0 9px;display:flex;align-items:center;gap:9px;flex-wrap:wrap}',
    '.ce-dhr .ce-h::after{content:"";flex:1;height:1px;background:var(--bdr)}',
    '.ce-dhr .ce-sub{font-size:11.5px;color:var(--mu);line-height:1.55;margin:0 0 12px}',
    /* the metric grid */
    '.ce-dhr .ce-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(214px,1fr));gap:10px;margin:0 0 16px}',
    '.ce-dhr .ce-card{border:1px solid var(--bdr);border-radius:11px;padding:11px 13px;background:var(--w)}',
    '.ce-dhr .ce-card.kpi{background:linear-gradient(180deg,rgba(15,125,194,0.045),rgba(15,125,194,0))}',
    '.ce-dhr .ce-ck{font-size:9.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu);margin-bottom:6px}',
    '.ce-dhr .ce-cv{font-size:21px;font-weight:800;color:var(--navy);line-height:1.15;letter-spacing:-.01em}',
    '.ce-dhr .ce-cv small{font-size:10.5px;font-weight:700;color:var(--mu);margin-left:5px;letter-spacing:0}',
    '.ce-dhr .ce-cm{font-size:10.5px;color:var(--mu);margin-top:6px;line-height:1.5}',
    '.ce-dhr .ce-cm b{color:var(--navy)}',
    '.ce-dhr .ce-gd{margin-top:7px;font-size:10px;font-weight:800;letter-spacing:.03em;display:inline-block;padding:3px 9px;border-radius:999px;background:rgba(183,121,31,.10);border:1px solid rgba(183,121,31,.30);color:' + AMBER + '}',
    /* the debate box */
    '.ce-dhr .ce-debate{background:linear-gradient(135deg,#141C26 0%,#1E2C3C 100%);border-radius:13px;padding:16px 18px;color:#E8EEF5;margin:0 0 16px}',
    '.ce-dhr .ce-debate .ce-dk{font-size:9.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:#7FC3EE;margin-bottom:8px}',
    '.ce-dhr .ce-debate p{margin:0 0 9px;font-size:12.5px;line-height:1.65;color:#DCE6F0}',
    '.ce-dhr .ce-debate p:last-child{margin-bottom:0}.ce-dhr .ce-debate b{color:#fff}',
    /* disparity rows */
    '.ce-dhr .ce-disp{border:1px solid var(--bdr);border-radius:11px;overflow:hidden;margin:0 0 16px}',
    '.ce-dhr .ce-disp-r{display:grid;grid-template-columns:1.5fr 1fr 1fr 1.1fr;gap:10px;padding:9px 13px;border-bottom:1px solid var(--bdr);font-size:11.5px;align-items:center}',
    '.ce-dhr .ce-disp-r:last-child{border-bottom:none}',
    '.ce-dhr .ce-disp-r.hd{background:#F7F9FB;font-size:9.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu)}',
    '.ce-dhr .ce-disp-r b{color:var(--navy)}',
    /* scorecard */
    '.ce-dhr .ce-legend{font-size:10.5px;color:var(--mu);margin:0 0 8px;line-height:1.5}',
    '.ce-dhr .ce-sc{border:1px solid var(--bdr);border-radius:11px;overflow:hidden;margin:0 0 14px}',
    '.ce-dhr .ce-sc-r{display:grid;grid-template-columns:1.45fr .85fr .85fr .95fr 1.6fr;gap:10px;padding:10px 13px;border-bottom:1px solid var(--bdr);font-size:11.5px;align-items:center}',
    '.ce-dhr .ce-sc-r:last-child{border-bottom:none}',
    '.ce-dhr .ce-sc-r.hd{background:#F7F9FB;font-size:9.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu)}',
    '.ce-dhr .ce-sc-r .m{font-weight:800;color:var(--navy)}',
    '.ce-dhr .ce-sc-r .why{color:var(--mu);line-height:1.5;font-size:11px}',
    '.ce-dhr .ce-word{font-size:9.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;padding:3px 9px;border-radius:999px;white-space:nowrap;display:inline-block}',
    '.ce-dhr .ce-word.beat{color:' + UP + ';background:rgba(46,139,87,.10);border:1px solid rgba(46,139,87,.32)}',
    '.ce-dhr .ce-word.miss{color:' + DOWN + ';background:rgba(192,80,77,.10);border:1px solid rgba(192,80,77,.32)}',
    '.ce-dhr .ce-word.line{color:var(--mu);background:#F2F5F8;border:1px solid var(--bdr)}',
    '.ce-dhr .ce-onlist{font-size:8.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--ce-b);background:rgba(15,125,194,.09);border:1px solid rgba(15,125,194,.30);border-radius:999px;padding:2px 7px;margin-left:7px;white-space:nowrap}',
    /* "opened a hook" points FORWARD (this print started a thread) where "on the list" points back
       (we called it). They must not read as the same badge, so this one is muted, not branded. */
    '.ce-dhr .ce-seeds{font-size:8.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:' + GRAY + ';background:#F2F5F8;border:1px dashed var(--bdr);border-radius:999px;padding:2px 7px;margin-left:7px;white-space:nowrap}',
    /* red lines */
    '.ce-dhr .ce-rl{border:1px solid var(--bdr);border-radius:11px;overflow:hidden;margin:0 0 16px}',
    '.ce-dhr .ce-rl-h{display:flex;align-items:center;gap:10px;padding:9px 13px;background:#F7F9FB;border-bottom:1px solid var(--bdr);font-size:9.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu)}',
    '.ce-dhr .ce-rl-n{margin-left:auto;letter-spacing:.03em;padding:2px 10px;border-radius:999px}',
    '.ce-dhr .ce-rl-n.ok{color:' + UP + ';background:rgba(46,139,87,.10);border:1px solid rgba(46,139,87,.32)}',
    '.ce-dhr .ce-rl-n.bad{color:' + DOWN + ';background:rgba(192,80,77,.10);border:1px solid rgba(192,80,77,.32)}',
    '.ce-dhr .ce-rl-r{display:grid;grid-template-columns:auto 1.4fr 1.6fr;gap:11px;padding:10px 13px;border-bottom:1px solid var(--bdr);font-size:11.5px;align-items:start}',
    '.ce-dhr .ce-rl-r:last-child{border-bottom:none}',
    '.ce-dhr .ce-rl-r.trip{background:rgba(192,80,77,.045)}',
    '.ce-dhr .ce-rl-r .lbl{font-weight:800;color:var(--navy)}',
    '.ce-dhr .ce-rl-r .out{color:var(--mu);line-height:1.5}',
    '.ce-dhr .ce-rl-ic{font-size:13px;line-height:1.3}',
    /* the supplemental "also on the call" block — deliberately NOT scorecard formatting */
    '.ce-dhr .ce-suppl{border:1px dashed var(--bdr);border-radius:11px;padding:13px 15px;background:#FCFDFE;margin:0 0 14px}',
    '.ce-dhr .ce-suppl-h{font-size:9.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu);margin-bottom:10px;display:flex;align-items:center;gap:9px}',
    '.ce-dhr .ce-pill{font-size:8.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu);background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px 8px}',
    '.ce-dhr .ce-band{margin:0 0 11px}.ce-dhr .ce-band:last-child{margin-bottom:0}',
    '.ce-dhr .ce-band-k{font-size:9px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:' + GRAY + ';margin-bottom:5px}',
    '.ce-dhr .ce-band ul{margin:0;padding-left:17px}',
    '.ce-dhr .ce-band li{font-size:11.5px;color:var(--mu);line-height:1.6;margin-bottom:5px}',
    '.ce-dhr .ce-band li b{color:var(--navy)}',
    '.ce-dhr .ce-open{font-size:8.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:' + AMBER + ';background:rgba(183,121,31,.10);border:1px solid rgba(183,121,31,.30);border-radius:999px;padding:1px 7px;margin-left:6px}',
    '.ce-dhr .ce-spoken{font-size:8.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--mu);background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:1px 7px;margin-left:6px;white-space:nowrap}',
    /* theme record */
    '.ce-dhr .ce-tr{margin-top:22px;border-top:1px solid var(--bdr);padding-top:16px}',
    '.ce-dhr .ce-tr-tog{display:inline-flex;gap:3px;background:#F2F5F8;border:1px solid var(--bdr);border-radius:8px;padding:3px;margin:0 0 13px}',
    '.ce-dhr .ce-tr-tog button{background:none;border:none;font:inherit;font-size:10.5px;font-weight:800;color:var(--mu);padding:5px 13px;border-radius:6px;cursor:pointer}',
    '.ce-dhr .ce-tr-tog button.active{background:var(--w);color:var(--navy);box-shadow:0 1px 3px rgba(15,23,42,.10)}',
    '.ce-dhr .ce-acc-item{border:1px solid var(--bdr);border-radius:10px;margin-bottom:7px;overflow:hidden}',
    '.ce-dhr .ce-acc-h{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--w);border:none;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 13px;cursor:pointer;text-align:left}',
    '.ce-dhr .ce-acc-h:hover{background:#F7F9FB}',
    '.ce-dhr .ce-acc-ic{color:var(--mu);font-weight:800;flex:none}',
    '.ce-dhr .ce-acc-b{padding:0 13px 13px;border-top:1px solid var(--bdr)}',
    '.ce-dhr .ce-acc-b[hidden]{display:none}',
    '.ce-dhr .ce-why{font-size:11.5px;color:var(--mu);margin:11px 0 10px;font-style:italic;line-height:1.6}',
    '.ce-dhr .ce-st{font-size:9px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;border:1px solid;border-radius:999px;padding:2px 8px;white-space:nowrap}',
    '.ce-dhr .ce-upd{margin-bottom:10px}.ce-dhr .ce-upd:last-child{margin-bottom:0}',
    '.ce-dhr .ce-upd-q{font-size:9.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--ce-b);margin-bottom:4px}',
    '.ce-dhr .ce-upd ul{margin:0;padding-left:17px}',
    '.ce-dhr .ce-upd li{font-size:11.5px;color:var(--mu);line-height:1.6;margin-bottom:4px}',
    '.ce-dhr .ce-upd li b{color:var(--navy)}',
    '.ce-dhr .ce-seg-h{font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:' + GRAY + ';margin:14px 0 7px}',
    '.ce-dhr .ce-seg-h:first-child{margin-top:0}',
    '.ce-dhr .ce-empty{color:' + GRAY + ';font-style:italic}'
  ].join('') + '</style>';
}

// ═══ Setup ════════════════════════════════════════════════════════════════════════════════════
// The four HEADLINE metrics are mandatory for every company (§6): Revenue · Operating income ·
// EPS · EBITDA. Danaher's meaningful basis for the last three is the adjusted one — it is what it
// guides, what it is judged on, and what the Street publishes — so the adjusted figure is the
// value and the GAAP figure sits under it rather than the other way round. Showing GAAP as the
// headline against an adjusted consensus would be the mixed-basis error §5 forbids.
var HEADLINE = [
  { k:'Revenue',          key:'rev',       unit:'usdM', sub:null },
  { k:'Operating profit', key:'adjopinc',  unit:'usdM', sub:'opinc', subLabel:'GAAP', margin:'rev' },
  { k:'EPS',              key:'adjeps',    unit:'eps',  sub:'eps',   subLabel:'GAAP' },
  { k:'EBITDA',           key:'adjebitda', unit:'usdM', sub:null,    margin:'rev' }
];
// The four CUSTOM KPIs — the Danaher-specific lines. Core revenue growth first: it is the only
// thing the company guides by quarter, so it is the only card that can carry a band.
var CUSTOM = [
  { k:'Core revenue growth', key:'coregr', unit:'pct' },
  { k:'Biotechnology',       key:'bio',    unit:'usdM' },
  { k:'Life Sciences',       key:'ls',     unit:'usdM' },
  { k:'Diagnostics',         key:'dx',     unit:'usdM' }
];

function card(spec, Q, kpi){
  var est = at(spec.key, Q.pk, 'cons');
  var prior = at(spec.key, Q.prior, 'act');
  var priorCons = at(spec.key, Q.prior, 'cons');
  var g = (spec.unit === 'pct') ? null : growth(est, prior);
  var h = '<div class="ce-card' + (kpi ? ' kpi' : '') + '">' +
    '<div class="ce-ck">' + esc(spec.k) + '</div>' +
    '<div class="ce-cv">' + (est == null ? '<span class="ce-empty">no estimate</span>' : fmtBy(spec.unit, est)) +
      (spec.margin && est != null ? '<small>' + fmtPct(marginPct(est, at(spec.margin, Q.pk, 'cons')), 1) .replace('+','') + ' margin</small>' : '') + '</div>';
  var cm = [];
  if (g != null) cm.push('<b>' + fmtPct(g) + '</b> vs ' + esc(Q.prior) + ' (' + fmtBy(spec.unit, prior) + ')');
  else if (spec.unit === 'pct' && prior != null) cm.push(esc(Q.prior) + ' printed <b>' + fmtPct(prior) + '</b>');
  if (spec.sub){
    var sv = at(spec.sub, Q.pk, 'cons');
    if (sv != null) cm.push(esc(spec.subLabel) + ' ' + fmtBy(M(spec.sub).unit, sv));
  }
  if (cm.length) h += '<div class="ce-cm">' + cm.join(' · ') + '</div>';
  var gd = guideAt(spec.key, Q.pk);
  if (gd) h += '<div class="ce-gd">guided ' + fmtBy(spec.unit, gd[0]) + ' to ' + fmtBy(spec.unit, gd[1]) + '</div>';
  // A reported quarter shows what the Street had going in, next to what printed (the frozen view).
  if (Q.status === 'reported'){
    var act = at(spec.key, Q.pk, 'act');
    if (act != null) h += '<div class="ce-cm">printed <b>' + fmtBy(spec.unit, act) + '</b>' +
      (est != null && spec.unit !== 'pct' ? ' · ' + fmtPct(growth(act, est)) + ' vs the Street' : '') + '</div>';
  }
  // priorCons is read but only used to keep the card honest about whether the prior quarter had
  // a Street number at all; it is not rendered, so nothing is claimed that is not shown.
  void priorCons;
  return h + '</div>';
}

// The debate — "the one thing to resolve" (§6). One per quarter; authored, not derived. It is the
// going-in read, so a reported quarter keeps the one it had, frozen.
var DEBATE = {
  '3Q26': {
    k:'The debate going in',
    p:[
      'Danaher guides FY2026 core revenue growth of <b>+3.0% to +4.0%</b>. The Bloomberg consensus in our own dataset models <b>+2.9%</b> — below the low end. The quarterly consensus says the same thing a second way: <b>+2.5%</b> in Q3 against a company guide of <b>+2.0% to +3.0%</b>, then a jump to <b>+5.1%</b> in Q4.',
      'So the whole disagreement is Q4. Management said on the July call that it expects to <b>exit Q4 at a mid-single-digit core growth rate</b>, and the Street has written that number down — it just does not believe the year adds up to the guide. <b>The one thing to resolve: whether the Q3 print moves the FY26 core guide, or moves the Street.</b>',
      'Two things decide it, and both are Q2 leftovers. First, the <b>$100M+ of bioprocessing revenue management says slipped into 2027</b> on customer timing — if any of it comes back inside 2026 the guide holds easily, and if more follows it out, +3% is the ceiling not the floor. Second, <b>respiratory</b>: management has sized it at ~$1.6B for the year and called out a <b>250bp headwind</b> to Q3 growth, which is most of the gap between the guided +2–3% and the ~5% they say the business does excluding it.'
    ]
  },
  '2Q26': {
    k:'The debate going in — frozen at the print',
    p:[
      'The Street had <b>$6,100M</b> and <b>$1.83</b> adjusted EPS, against a company core-growth guide given in words: "increase in the <b>low-single digit</b> percent range".',
      'The going-in question was whether Life Sciences had actually turned or was still bumping along, and whether Masimo — which closed earlier than planned — would land as an EPS raise or as dilution and acquisition noise.'
    ]
  }
};

function debateBlock(Q){
  var d = DEBATE[Q.pk]; if (!d) return '';
  return '<div class="ce-debate"><div class="ce-dk">' + esc(d.k) + '</div>' + d.p.map(function(p){ return '<p>' + p + '</p>'; }).join('') + '</div>';
}

// The disparity rows: Street against the company's own guide, wherever the guide is numeric.
// Amazon's equivalent row is Street vs Summit; Danaher has no Summit, and a guide is a better
// comparator than a blank column.
function disparityBlock(Q){
  var rows = [];
  [{ k:'Core revenue growth', key:'coregr', unit:'pct' }].forEach(function(s){
    var gd = guideAt(s.key, Q.pk), est = at(s.key, Q.pk, 'cons');
    if (!gd || est == null) return;
    var mid = (gd[0] + gd[1]) / 2, delta = est - mid;
    rows.push('<div class="ce-disp-r"><span><b>' + esc(s.k) + '</b></span>' +
      '<span>' + fmtBy(s.unit, est) + '</span>' +
      '<span>' + fmtBy(s.unit, gd[0]) + ' – ' + fmtBy(s.unit, gd[1]) + '</span>' +
      '<span>' + (Math.abs(delta) < 0.05 ? '<span class="ce-word line">at the midpoint</span>'
        : '<span class="ce-word ' + (delta > 0 ? 'beat' : 'line') + '">' + (delta > 0 ? 'above' : 'below') + ' the midpoint by ' + Math.abs(delta).toFixed(1) + 'pts</span>') + '</span></div>');
  });
  // The annual guide is the one that actually disagrees, so it is shown alongside the quarter.
  var yM = dhrResults.views.y.metrics.coregr, yi = yM.periods.indexOf('2026');
  if (yi >= 0 && yM.cons[yi] != null && yM.guideLo[yi] != null){
    var yd = yM.cons[yi] - yM.guideLo[yi];
    rows.push('<div class="ce-disp-r"><span><b>FY2026 core revenue growth</b></span>' +
      '<span>' + fmtPct(yM.cons[yi]) + '</span>' +
      '<span>' + fmtPct(yM.guideLo[yi]) + ' – ' + fmtPct(yM.guideHi[yi]) + '</span>' +
      '<span><span class="ce-word ' + (yd < 0 ? 'miss' : 'beat') + '">' + (yd < 0 ? 'below the low end by ' + Math.abs(yd).toFixed(1) + 'pts' : 'inside the band') + '</span></span></div>');
  }
  var yE = dhrResults.views.y.metrics.adjeps, ei = yE.periods.indexOf('2026');
  if (ei >= 0 && yE.cons[ei] != null && yE.guideLo[ei] != null){
    var inside = yE.cons[ei] >= yE.guideLo[ei] && yE.cons[ei] <= yE.guideHi[ei];
    rows.push('<div class="ce-disp-r"><span><b>FY2026 adjusted EPS</b></span>' +
      '<span>' + fmtEps(yE.cons[ei]) + '</span>' +
      '<span>' + fmtEps(yE.guideLo[ei]) + ' – ' + fmtEps(yE.guideHi[ei]) + '</span>' +
      '<span><span class="ce-word ' + (inside ? 'line' : 'beat') + '">' + (inside ? 'inside the band' : 'outside the band') + '</span></span></div>');
  }
  if (!rows.length) return '';
  return '<div class="ce-h">What the estimates establish going in</div>' +
    '<div class="ce-disp"><div class="ce-disp-r hd"><span>Line</span><span>Street</span><span>Company guide</span><span>Read</span></div>' +
    rows.join('') + '</div>';
}

function setupBody(){
  return QUARTERS.map(function(Q, i){
    var h = '<div class="ce-qblock" data-ceq="' + esc(qkey(Q.q)) + '"' + (i === 0 ? '' : ' hidden') + '>';
    h += '<p class="ce-sub">' + (Q.status === 'upcoming'
      ? '<b>' + esc(Q.q) + '</b> — ' + esc(Q.date) + '. What the Street has written down, and what Danaher has guided. There is no Summit column: Danaher is not in the DCF universe yet.'
      : '<b>' + esc(Q.q) + '</b> — reported ' + esc(Q.date) + '. The frozen pre-call view: what was priced in going in, with the print beside it.') + '</p>';
    h += '<div class="ce-h">Headline</div><div class="ce-grid">' + HEADLINE.map(function(s){ return card(s, Q, false); }).join('') + '</div>';
    h += '<div class="ce-h">Danaher KPIs</div><div class="ce-grid">' + CUSTOM.map(function(s){ return card(s, Q, true); }).join('') + '</div>';
    h += disparityBlock(Q);
    h += debateBlock(Q);
    if (Q.status === 'reported' && !DEBATE[Q.pk])
      h += '<p class="ce-sub"><span class="ce-empty">No frozen going-in read was recorded for this quarter — the pane started at Q2 2026. The numbers above are the Street figures the dataset carries, which are contemporaneous.</span></p>';
    return h + '</div>';
  }).join('');
}

// ═══ Post-Results ═════════════════════════════════════════════════════════════════════════════
// The red lines FIRST (§6) — the most falsifiable thing in the tab — then the scorecard, ordered
// biggest-surprise first and never in release order.
var REDLINES = {
  '2Q26': [
    { lbl:'Bioprocessing does not go backwards', trip:false,
      out:'Held, but on management\'s own framing. Biotechnology core <b>+2.5%</b> and bioprocessing <b>low single digits</b> — with <b>$100M+ said to have moved into 2027</b>. Orders grew mid-teens in both consumables and equipment, which is the reason to read the slip as timing.' },
    { lbl:'Life Sciences stops being the drag', trip:false,
      out:'Held, and then some: <b>+5.5% core</b>, called the strongest quarter in several years. The segment\'s GAAP operating profit is still only <b>$244M on $1,879M</b>, so the recovery is in growth and not yet in profit.' },
    { lbl:'The FY26 EPS guide does not come down', trip:false,
      out:'Held — raised twice this year, now <b>$8.45–$8.60</b> from $8.35–$8.55.' },
    { lbl:'The FY26 core guide does not come down', trip:true,
      out:'⚑ Tripped on a technicality that matters: the range was <b>narrowed from +3–6% to +3.0–4.0%</b>. The floor held and the ceiling fell by two points, which is a cut to the upside case even though no headline number went down.' },
    { lbl:'Diagnostics profit is not eaten by the deal', trip:true,
      out:'⚑ Tripped for now. Segment operating profit fell to <b>$416M</b> from $554M a year earlier on <b>higher</b> revenue, carrying <b>$108M of pretax Masimo acquisition items</b>. Expected, dated, and still the largest single-line deterioration in the print.' }
  ]
};

// Scorecard rows. `est` and `act` are read from the dataset where the line exists there; a row
// that exists only as something said on the call is marked `spoken` and carries no surprise
// percentage, because there is no frozen estimate to score it against (Rule H — never render
// judgement as measurement).
//
// ⚠ NO "ON THE LIST" BADGE ON Q2 2026, AND THAT IS DELIBERATE. The badge means the line was on
// the watch list we had FROZEN going into the print — a call we made and got right. Our Danaher
// watch list starts at this quarter: every theme in js/themes-data/dhr.js was opened BY this
// call. Badging these rows would claim foresight the desk did not have (Rule D, read the other
// way round). `seeds` is the honest marker — it points forward, at the hook this line opened,
// and it is what §6d's `seededBy` chain renders from the far end. From Q3 2026 the badge becomes
// available and means something.
var SCORECARD = {
  '2Q26': [
    { m:'Adjusted diluted EPS', key:'adjeps',
      why:'The line Danaher is judged on, and the reason the guide went up.' },
    { m:'Revenue', key:'rev',
      why:'A 5.5% reported increase, of which Masimo is a large part — the core number below is the cleaner read.' },
    { m:'Core revenue growth', key:'coregr', seeds:'The guide against the Street',
      why:'Guided in words as "low-single digit"; printed +3.0%, at or above the top of that. It is the number the FY26 guide now hangs on.' },
    { m:'Life Sciences — core growth', spoken:'+5.5%', seeds:'The Life Sciences turn',
      why:'Strongest in several years; Pall applied filtration ~+10% on semiconductor microelectronics, Abcam\'s best quarter since acquisition.' },
    { m:'Diagnostics — core ex-respiratory', spoken:'+5.0%', seeds:'Respiratory — the drag with a size on it',
      why:'Reported Diagnostics core was +2.0%. The 300bp gap is respiratory, and management now sizes it at ~$1.6B for the year.' },
    { m:'Biotechnology — core growth', spoken:'+2.5%', seeds:'Bioprocessing — the revenue that moved to 2027',
      why:'Bioprocessing itself low single digits, with $100M+ said to have moved to 2027 on customer timing.' },
    { m:'Diagnostics — operating profit', key:'dxopinc', seeds:'Masimo — bought, closed early, not yet in the margin',
      why:'Down year on year on higher revenue: $108M of pretax Masimo acquisition items sit in this line.' }
  ]
};

function surpriseWord(pct){
  if (pct == null) return '<span class="ce-word line">no frozen estimate</span>';
  if (Math.abs(pct) < 0.5) return '<span class="ce-word line">in line</span>';
  return '<span class="ce-word ' + (pct > 0 ? 'beat' : 'miss') + '">' + (pct > 0 ? 'beat' : 'miss') + ' ' + Math.abs(pct).toFixed(1) + '%</span>';
}
function scorecardBlock(Q){
  var rows = (SCORECARD[Q.pk] || []).map(function(r){
    var est = r.key ? at(r.key, Q.pk, 'cons') : null;
    var act = r.key ? at(r.key, Q.pk, 'act') : null;
    var unit = r.key && M(r.key) ? M(r.key).unit : 'usdM';
    // A percentage metric's surprise is a difference in points, not a ratio — a ratio on a growth
    // rate is meaningless (+3.0% against +2.0% is not "50% better").
    var pct = (est == null || act == null) ? null : (unit === 'pct' ? (act - est) : growth(act, est));
    return { r:r, est:est, act:act, unit:unit, pct:pct, rank:(pct == null ? -1 : Math.abs(pct)) };
  }).sort(function(a, z){ return z.rank - a.rank; });                 // biggest surprise first (§6)
  if (!rows.length) return '';
  return '<div class="ce-h">The scorecard</div>' +
    '<p class="ce-legend">Ordered <b>biggest surprise first</b>, never release order. “Beat/miss” is against the <b>Street number that stood going in</b>. A row with no frozen estimate is a figure management gave on the call — it is reported, not scored, and says so. Percentage metrics are compared in <b>points</b>, not as a ratio. <b>“Opened a hook”</b> means this line started a thread on the watch list; it is not <b>“on the list”</b>, which would mean we had already called it going in — our Danaher list starts at this quarter, so nothing here can carry that badge.</p>' +
    '<div class="ce-sc"><div class="ce-sc-r hd"><span>Line</span><span>Street</span><span>Printed</span><span>Surprise</span><span>Why it matters</span></div>' +
    rows.map(function(x){
      var r = x.r;
      return '<div class="ce-sc-r"><span class="m">' + esc(r.m) +
        (r.onList ? '<span class="ce-onlist" title="' + esc(r.onList) + '">on the list</span>'
          : r.seeds ? '<span class="ce-seeds" title="Opened the hook: ' + esc(r.seeds) + '">opened a hook</span>' : '') + '</span>' +
        '<span>' + (x.est == null ? '<span class="ce-empty">—</span>' : fmtBy(x.unit, x.est)) + '</span>' +
        '<span>' + (x.act != null ? fmtBy(x.unit, x.act) : (r.spoken ? esc(r.spoken) + '<span class="ce-spoken">said on the call</span>' : '<span class="ce-empty">—</span>')) + '</span>' +
        '<span>' + (x.unit === 'pct' && x.pct != null
          ? '<span class="ce-word ' + (x.pct > 0 ? 'beat' : x.pct < 0 ? 'miss' : 'line') + '">' + (x.pct > 0 ? '+' : '') + x.pct.toFixed(1) + ' pts</span>'
          : surpriseWord(x.pct)) + '</span>' +
        '<span class="why">' + r.why + '</span></div>';
    }).join('') + '</div>';
}

function redlineBlock(Q){
  var rl = REDLINES[Q.pk]; if (!rl) return '';
  var tripped = rl.filter(function(x){ return x.trip; }).length;
  var sorted = rl.slice().sort(function(a, z){ return (z.trip ? 1 : 0) - (a.trip ? 1 : 0); });   // tripped to the top
  return '<div class="ce-h">The red-line check</div>' +
    '<div class="ce-rl"><div class="ce-rl-h"><span>What we said would break the read</span>' +
      '<span class="ce-rl-n ' + (tripped ? 'bad' : 'ok') + '">' + (tripped ? '⚑ ' + tripped + ' tripped' : '✓ all held') + '</span></div>' +
    sorted.map(function(x){
      return '<div class="ce-rl-r' + (x.trip ? ' trip' : '') + '"><span class="ce-rl-ic">' + (x.trip ? '⚑' : '✓') + '</span>' +
        '<span class="lbl">' + esc(x.lbl) + '</span><span class="out">' + x.out + '</span></div>';
    }).join('') + '</div>';
}

// "Also on the call" — the de-emphasized supplemental aside (§6, v2.8). Two bands only, `context`
// and `logged`. Thesis-movers are deliberately NOT here: those are tracked, and the tracking layer
// is the Watch List.
var CALL_COLOUR = {
  '2Q26': {
    context:[
      'Rainer Blair framed the quarter as <b>acceleration in core growth versus Q1</b>, on commercial execution, recent innovation and end-market recovery. Core went <b>+0.5% → +3.0%</b> between the two quarters, so the framing is supported by the print.',
      'The <b>$100M+ bioprocessing slip</b> was attributed to <b>a few large commercial drug manufacturers</b> rescheduling <b>resin shipments</b> — production-schedule changes and site readiness, across different molecules and geographies, with <b>no common customer characteristic</b> when Dan Leonard (RBC) asked for one.',
      'Equipment revenue grew again after <b>four quarters of order-only growth</b>. Blair put it down to <b>reshoring and brownfield expansion</b> and called it the "early innings of a multi-year capex cycle".',
      'Matt McGrew on the raise: it <b>implies nearly 10% EPS growth</b> and still leaves room to reinvest.'
    ],
    logged:[
      '<b>China grew mid-single digits</b>; pricing stabilised and volumes improved.',
      'Respiratory testing revenue put at <b>~$1.6B for the full year</b>; a <b>250bp headwind</b> to Q3 revenue growth.',
      'Q3 guided: revenue growth <b>~2–3%</b>, core <b>ex-respiratory ~5%</b>, accelerating from Q2\'s 4.5% on the same basis.',
      '<b>~$900M</b> of buybacks, <b>5 million shares</b>.',
      'Masimo: <b>high-single-digit revenue growth in the first half</b>, plus an <b>FDA 510(k)</b> for AI-enabled respiratory-depression detection.',
      'Leica\'s <b>StatLab</b> acquisition named as workflow integration against an <b>85% recurring revenue</b> base; Radiometer and Leica both expected to hold <b>high-single-digit</b> growth.',
      '<b>Academia is under 5% of revenue</b> — offered by Blair as the reason a slow funding recovery does not move the model. <span class="ce-open">open</span> No timeline was given.',
      'New launches named as Life Sciences drivers: <b>Biacore 8S</b>, <b>SCIEX novus V55</b>, Beckman automation systems.'
    ]
  }
};

function colourBlock(Q){
  var cc = CALL_COLOUR[Q.pk]; if (!cc) return '';
  var band = function(k, label, items){
    if (!items || !items.length) return '';
    return '<div class="ce-band"><div class="ce-band-k">' + esc(label) + '</div><ul>' +
      items.map(function(t){ return '<li>' + t + '</li>'; }).join('') + '</ul></div>';
  };
  return '<div class="ce-suppl"><div class="ce-suppl-h">Also on the call<span class="ce-pill">supplemental</span></div>' +
    band('context', 'Context — what management said the numbers mean', cc.context) +
    band('logged', 'Logged — figures worth having, not worth a Watch slot', cc.logged) +
    '</div>';
}

function resultsBody(){
  return QUARTERS.map(function(Q, i){
    var h = '<div class="ce-qblock" data-ceq="' + esc(qkey(Q.q)) + '"' + (i === 0 ? '' : ' hidden') + '>';
    if (Q.status === 'upcoming'){
      h += '<p class="ce-sub"><span class="ce-empty"><b>' + esc(Q.q) + '</b> has not reported — ' + esc(Q.date) + '. The going-in read is in <b>Setup</b>; this phase fills after the print.</span></p>';
      return h + '</div>';
    }
    if (!SCORECARD[Q.pk] && !REDLINES[Q.pk]){
      h += '<p class="ce-sub"><span class="ce-empty"><b>' + esc(Q.q) + '</b> — no post-mortem was written for this quarter. The pane starts at Q2 2026; the print itself is in <b>Evolution ▸ Results</b>, which carries every quarter back to 1Q23.</span></p>';
      return h + '</div>';
    }
    h += '<p class="ce-sub"><b>' + esc(Q.q) + '</b> — reported ' + esc(Q.date) + '. The numbers first, then what management said.</p>';
    h += redlineBlock(Q) + scorecardBlock(Q) + colourBlock(Q);
    return h + '</div>';
  }).join('');
}

// ═══ Watch List phase ═════════════════════════════════════════════════════════════════════════
// The list itself is the SHARED engine (js/watchlist.js) — persistent in Supabase, scoped by
// company_id, ours to open and close by hand. The theme record below it is the authored
// compendium (js/themes-data/dhr.js), folded in here per §6 rather than given its own tab.
var ST = { trend:{ l:'Trend — confirmed', c:UP }, promise:{ l:'Promise — reconcile', c:AMBER }, watch:{ l:'Watch', c:BRAND } };
function qnum(q){ var m = String(q || '').match(/Q(\d)\s+(\d{4})/); return m ? ((+m[2]) * 4 + (+m[1])) : null; }
// Age is measured against the last quarter that has actually REPORTED, never against the upcoming
// one. Measuring against Q3 2026 — which has not happened — would mark every theme "silent 1
// quarter" the moment the pane opens, which is an artefact of the calendar rather than a fact
// about the theme. A promise made on the most recent call is open, not overdue.
function lastReportedQ(){
  for (var i = 0; i < QUARTERS.length; i++) if (QUARTERS[i].status === 'reported') return QUARTERS[i].q;
  return QUARTERS[0].q;
}
function stAge(st){
  var ref = qnum(lastReportedQ()), last = qnum(st.last);
  if (ref == null || last == null) return '';
  var n = ref - last;
  if (st.k === 'promise') return n <= 0 ? ' · open since the last call' : ' · unreconciled ' + n + ' quarter' + (n === 1 ? '' : 's');
  if (n >= 1) return ' · silent ' + n + ' quarter' + (n === 1 ? '' : 's');
  return '';
}
function themeRecord(){
  var segs = [];
  DHR_THEMES.forEach(function(t){ if (segs.indexOf(t.seg) < 0) segs.push(t.seg); });
  var byTheme = '<div id="dhrTrTheme">' + segs.map(function(seg){
    return '<div class="ce-seg-h">' + esc(seg) + '</div>' + DHR_THEMES.filter(function(t){ return t.seg === seg; }).map(function(t){
      var s = ST[t.st.k] || ST.watch;
      return '<div class="ce-acc-item"><button type="button" class="ce-acc-h"><span style="display:inline-flex;align-items:center;gap:9px;flex-wrap:wrap">' +
        esc(t.theme) + ' <span class="ce-st" style="color:' + s.c + ';border-color:' + s.c + '">' + esc(s.l) + esc(stAge(t.st)) + '</span></span><span class="ce-acc-ic">+</span></button>' +
        '<div class="ce-acc-b" hidden><p class="ce-why">' + esc(t.why) + '</p>' +
        (t.updates || []).map(function(u){
          return '<div class="ce-upd"><div class="ce-upd-q">' + esc(u.q) + '</div><ul>' + u.items.map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
        }).join('') + '</div></div>';
    }).join('');
  }).join('') + '</div>';

  var map = {}, order = [];
  DHR_THEMES.forEach(function(t){ (t.updates || []).forEach(function(u){ if (!map[u.q]){ map[u.q] = []; order.push(u.q); } map[u.q].push({ theme:t.theme, seg:t.seg, items:u.items }); }); });
  order.sort(function(a, z){ return (qnum(z) || 0) - (qnum(a) || 0); });
  var byQuarter = '<div id="dhrTrQuarter" hidden>' + order.map(function(q){
    return '<div class="ce-acc-item"><button type="button" class="ce-acc-h"><span>' + esc(q) + '</span><span class="ce-acc-ic">+</span></button>' +
      '<div class="ce-acc-b" hidden>' + map[q].map(function(e){
        return '<div class="ce-upd"><div class="ce-upd-q">' + esc(e.seg) + ' · ' + esc(e.theme) + '</div><ul>' +
          e.items.map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
      }).join('') + '</div></div>';
  }).join('') + '</div>';

  return '<div class="ce-tr"><div class="ce-h">The theme record</div>' +
    '<p class="ce-sub">How each story has evolved, call by call. Entries are contemporaneous highlights from the release or the call itself. <b>Q2 2026 is the quarter with call-level detail</b> — the earlier quarters carry what their releases carry, and nothing has been invented to fill the gap.</p>' +
    '<div class="ce-tr-tog"><button type="button" class="active" data-dhrtr="theme">By theme</button><button type="button" data-dhrtr="quarter">By quarter</button></div>' +
    byTheme + byQuarter + '</div>';
}

function watchBody(){
  return '<div id="dhrWlMount"></div>' + themeRecord();
}

// ═══ Assembly ═════════════════════════════════════════════════════════════════════════════════
export function dhrCallPrepHtml(){
  return style() + '<div class="ce-dhr">' +
    '<p class="ce-note">The decision layer: what the Street and the company have written down for the coming print, what earned a slot on the watch list, and how the last print actually landed. ' +
    'Every estimate and actual here is read through <b>Evolution ▸ Results</b> — one home for the numbers. There is <b>no Summit column anywhere in this tab</b>: Danaher is not in the DCF universe yet, so the second estimate is the company\'s own guide.</p>' +
    '<div class="ce-phtabs">' +
      '<button type="button" class="ce-phtab active" data-cep="setup">Setup</button>' +
      '<button type="button" class="ce-phtab" data-cep="watch">Watch List</button>' +
      '<button type="button" class="ce-phtab" data-cep="results">Post-Results</button>' +
    '</div>' +
    '<div class="ce-qpills">' + QUARTERS.map(function(q, i){
      return '<button type="button" class="ce-qpill' + (i === 0 ? ' active' : '') + '" data-ceqsel="' + esc(qkey(q.q)) + '">' +
        esc(q.q) + (q.status === 'upcoming' ? '<span class="ce-qtag">upcoming</span>' : '') + '</button>';
    }).join('') + '</div>' +
    '<div class="ce-phpane" data-cep="setup">' + setupBody() + '</div>' +
    '<div class="ce-phpane" data-cep="watch" hidden>' + watchBody() + '</div>' +
    '<div class="ce-phpane" data-cep="results" hidden>' + resultsBody() + '</div>' +
  '</div>';
}

export function dhrCallPrepInit(pane, c){
  var root = pane && pane.querySelector ? pane.querySelector('.ce-dhr') : null;
  if (!root || root._dhrCPWired) return;
  root._dhrCPWired = true;

  // Phase tabs. The quarter pills belong to the SECTION, not to a phase (§6a-ix), so they stay
  // visible across all three and keep their selection when the phase changes.
  root.querySelectorAll('.ce-phtab').forEach(function(btn){
    btn.onclick = function(){
      var k = btn.getAttribute('data-cep');
      root.querySelectorAll('.ce-phtab').forEach(function(b){ b.classList.toggle('active', b === btn); });
      root.querySelectorAll('.ce-phpane').forEach(function(p){ p.hidden = (p.getAttribute('data-cep') !== k); });
      // The quarter pills mean nothing on the Watch List phase — that list is flat across quarters
      // by design — so they are hidden there rather than left to imply a filter that does not exist.
      var pills = root.querySelector('.ce-qpills'); if (pills) pills.hidden = (k === 'watch');
      if (k === 'watch') mountWL(root, c);
    };
  });

  // Quarter pills — toggle the .ce-qblock of that quarter inside every phase at once.
  root.querySelectorAll('.ce-qpill').forEach(function(btn){
    btn.onclick = function(){
      var k = btn.getAttribute('data-ceqsel');
      root.querySelectorAll('.ce-qpill').forEach(function(b){ b.classList.toggle('active', b === btn); });
      root.querySelectorAll('.ce-qblock').forEach(function(b){ b.hidden = (b.getAttribute('data-ceq') !== k); });
    };
  });

  // Theme record — By theme ⇄ By quarter, and the accordions.
  root.querySelectorAll('[data-dhrtr]').forEach(function(btn){
    btn.onclick = function(){
      var k = btn.getAttribute('data-dhrtr');
      root.querySelectorAll('[data-dhrtr]').forEach(function(b){ b.classList.toggle('active', b === btn); });
      var t = root.querySelector('#dhrTrTheme'), q = root.querySelector('#dhrTrQuarter');
      if (t) t.hidden = (k !== 'theme');
      if (q) q.hidden = (k !== 'quarter');
    };
  });
  root.addEventListener('click', function(e){
    var h = e.target.closest ? e.target.closest('.ce-acc-h') : null;
    if (!h || !root.contains(h)) return;
    var b = h.nextElementSibling; if (!b || !b.classList.contains('ce-acc-b')) return;
    var open = b.hidden; b.hidden = !open;
    var ic = h.querySelector('.ce-acc-ic'); if (ic) ic.textContent = open ? '−' : '+';
  });
}

// The shared Watch List needs a company row to persist against. Without one (a harness, or a
// company not yet in the table) it would mount and silently fail to save, which is worse than
// saying so — the themes below it are the durable record either way.
function mountWL(root, c){
  var host = root.querySelector('#dhrWlMount');
  if (!host || host._mounted) return;
  host._mounted = true;
  if (!c || !c.id){
    host.innerHTML = '<p class="ce-sub"><span class="ce-empty">The Watch List saves against a company row and there is none in this context, so it is not mounted here. Open Danaher from the Companies grid to use it. The theme record below is static and always renders.</span></p>';
    return;
  }
  mountWatchList(host, { companyId:c.id, ticker:(c.ticker || 'DHR'), quarters:DHR_CALL_QUARTERS,
    colors:{ brand:BRAND, brand2:BRAND2, gray:GRAY, red:DOWN } });
}
