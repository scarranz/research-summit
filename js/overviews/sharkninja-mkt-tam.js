// overviews/sharkninja-mkt-tam.js — SharkNinja Deep Dive ▸ Miscellaneous ▸ Marketing Strategy · TAM.
//
// WHY THESE TWO SUB-TABS (Sep 2026, SAB). The thesis they serve: SharkNinja's top line compounds
// mainly by (1) adding categories — expanding the market it can address — and (2) marketing, above
// all social media, creators and TikTok Shop. Both tabs read management's claims ACROSS TIME, from
// the Jul 2023 spin-off to the Goldman Sachs conference of Sep 15 2026 that prompted them, and set
// the spoken claims against what the filings and decks actually report.
//
// ⚠ Blueprint note: the Miscellaneous spine is Capex & Depreciation · M&A · Other Analysis. These two
// sub-tabs are an explicit, SAB-approved addition to it (flag in the PR for San/Oscar).
//
// DATA lives in ./sharkninja-mkt-data.js (SN_MKT) and ./sharkninja-tam-data.js (SN_TAM), frozen from
// Quartr + SEC filings, plus ./sharkninja-deck-data.js (SN_DECK) — numbers read off the rendered
// investor-deck slides. This file only draws. Time-series charts are the shared Results ENGINE
// (registered datasets); the deck snapshots are drawn with ./sharkninja-misc-kit.js, which meets
// CHART_ENGINE_REFERENCE §0.2 by the §0.7 route. Since Sep 16 2026 (SAB: "mucho más visual, mucho
// menos texto") the panes lead with visuals and every earlier paragraph and table sits inside a fold.

import { registerResultsData, resultsHtml, initResults } from '../results.js';
import { snResults } from '../results-data/sn.js';
import { SN_MKT } from './sharkninja-mkt-data.js';
import { SN_TAM } from './sharkninja-tam-data.js';
import { SN_DECK } from './sharkninja-deck-data.js';
import { snvChart, snvInit, fold, tiles, head, YEAR_RAMP, SUMMIT_CAT, SUMMIT_INK } from './sharkninja-misc-kit.js';

// Escapes, but never double-encodes an entity the data file already wrote (e.g. "Hair dryers &amp; stylers").
function esc(s){ if(s==null) return ''; return String(s).replace(/&(?!#?\w+;)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function arr(a){ return Array.isArray(a) ? a : []; }
function nulls(n){ var o = []; for (var i = 0; i < n; i++) o.push(null); return o; }

function collapsible(title, inner){
  return '<div class="ov-collap">' +
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">▸</span>' + esc(title) + '</button>' +
    '<div class="ov-collap-b" hidden>' + inner + '</div></div>';
}
function link(url){ return url ? ' <a href="' + esc(url) + '" target="_blank" rel="noopener">Quartr ↗</a>' : ''; }
function srcLine(src, url){ return '<span class="ov-stat-mut">' + esc(src || '') + '</span>' + link(url); }
function table(head, rows){
  return '<div class="ov-table-wrap" style="overflow-x:auto"><table class="ov-table"><thead><tr>' +
    head.map(function(h){ return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
}
function fmtDate(d){
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || ''); if (!m) return esc(d || '');
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m[2] - 1] + ' ' + (+m[3]) + ', ' + m[1];
}
// '3Q23' ordering key
function pKey(p){ var m = /^([1-4])Q(\d{2})$/.exec(p || ''); return m ? (+m[2]) * 10 + (+m[1]) : null; }

// ═══ Engine datasets ═══════════════════════════════════════════════════════════════════════════

var _reg = false;
function register(){
  if (_reg) return; _reg = true;

  // ── SN_MKT: advertising and S&M, annual from the filings; S&M quarterly from results-data ──
  var sp = SN_MKT.spend || {}, yrs = arr(sp.years);
  if (yrs.length){
    var ny = yrs.length;
    var ym = {
      rev: { label: 'Net sales', short: 'Net sales', group: 'Base', unit: 'usdM', periods: yrs.slice(),
        act: arr(sp.rev).slice(), cons: nulls(ny), summit: nulls(ny), guideLo: nulls(ny), guideHi: nulls(ny),
        note: 'Net sales — the denominator for every "% of sales" read.' },
      adv: { label: 'Advertising costs', short: 'Advertising', group: 'Spend', unit: 'usdM', marginOf: 'rev', marginLabel: 'Advertising % of sales',
        periods: yrs.slice(), act: arr(sp.adv).slice(), cons: nulls(ny), summit: nulls(ny), guideLo: nulls(ny), guideHi: nulls(ny),
        note: 'Advertising costs as disclosed in the notes to the financial statements (inside Sales & marketing).' },
      sm: { label: 'Sales & marketing expense', short: 'Sales & marketing', group: 'Spend', unit: 'usdM', marginOf: 'rev', marginLabel: 'S&M % of sales',
        periods: yrs.slice(), act: arr(sp.sm).slice(), cons: nulls(ny), summit: nulls(ny), guideLo: nulls(ny), guideHi: nulls(ny),
        note: 'Reported Sales & marketing expense (advertising plus the sales and marketing organisation, commissions and fees).' },
    };
    var q = snResults.views.q.metrics, qp = q.sm ? q.sm.periods : [];
    // Reported quarters only: this block is about what was spent, so the Street's forward S&M
    // quarters are cut rather than drawn as an empty forecast band.
    var lastAct = -1; if (q.sm) q.sm.act.forEach(function(v, i){ if (v != null) lastAct = i; });
    qp = qp.slice(0, lastAct + 1);
    var nq = qp.length, qm = {};
    if (q.sm && q.rev && nq){
      qm.rev = { label: 'Net sales', short: 'Net sales', group: 'Base', unit: 'usdM', periods: qp.slice(),
        act: q.rev.act.slice(0, nq), cons: nulls(nq), summit: nulls(nq), guideLo: nulls(nq), guideHi: nulls(nq), note: q.rev.note };
      qm.sm = { label: 'Sales & marketing expense', short: 'Sales & marketing', group: 'Spend', unit: 'usdM', marginOf: 'rev', marginLabel: 'S&M % of sales',
        periods: qp.slice(), act: q.sm.act.slice(0, nq), cons: nulls(nq), summit: nulls(nq), guideLo: nulls(nq), guideHi: nulls(nq),
        note: 'Quarterly Sales & marketing expense (Bloomberg company-financials export, via js/results-data/sn.js). Advertising is disclosed only annually, so it has no quarterly line.' };
    }
    var views = {
      y: { label: 'Annual', note: 'Reported fiscal years. Advertising costs and S&M from the F-1 (FY2020–22), the 20-F (FY2023–24) and the 10-K (FY2025).',
        metrics: ym, sections: [{ key: 'snmkt', label: 'Marketing spend', defaultMetric: 'adv', groups: [
          { label: 'Spend', keys: ['adv', 'sm'] }, { label: 'Base', keys: ['rev'] } ] }] }
    };
    if (qm.sm) views.q = { label: 'Quarterly', note: 'Sales & marketing by quarter. Advertising is an annual disclosure only.',
        metrics: qm, sections: [{ key: 'snmkt', label: 'Marketing spend', defaultMetric: 'sm', groups: [
          { label: 'Spend', keys: ['sm'] }, { label: 'Base', keys: ['rev'] } ] }] };
    registerResultsData('SN_MKT', {
      updated: 'Sep 2026',
      intro: 'What SharkNinja reports spending to create demand. Switch to <b>Margin</b> to read each line as a share of net sales — the basis on which management talks about it.',
      source: sp.src || '', surprise: false, defaultView: 'y', views: views
    });
  }

  // ── SN_TAMQ: the addressable market and the sub-category count, as management last stated them ──
  var tp = arr((SN_TAM.tam || {}).points), cp = arr((SN_TAM.subcats || {}).points);
  var stated = tp.filter(function(p){ return !p.analyst && !p.plan && p.v != null && pKey(p.period) != null; });
  var counts = cp.filter(function(p){ return !p.analyst && !p.plan && !p.asOf && p.n != null && pKey(p.period) != null; });
  var plans = tp.filter(function(p){ return !p.analyst && p.plan && pKey(p.period) != null; });
  var all = stated.concat(counts).concat(plans).map(function(p){ return pKey(p.period); });
  if (stated.length && all.length){
    var lo = Math.min.apply(null, all), hi = Math.max.apply(null, all), periods = [];
    for (var k = lo; k <= hi; k++){ var qn = k % 10, yy = Math.floor(k / 10); if (qn >= 1 && qn <= 4) periods.push(qn + 'Q' + (yy < 10 ? '0' : '') + yy); }
    var np = periods.length;
    function lastStated(list, field){
      var out = nulls(np), cur = null, byP = {};
      list.slice().sort(function(a, b){ return a.d < b.d ? -1 : 1; }).forEach(function(p){ byP[p.period] = p[field]; });
      var lastKey = Math.max.apply(null, list.map(function(p){ return pKey(p.period); }));
      periods.forEach(function(p, i){ if (byP[p] != null) cur = byP[p]; if (pKey(p) <= lastKey) out[i] = cur; });
      return out;
    }
    var tamAct = lastStated(stated, 'v'), subAct = lastStated(counts, 'n');
    var gLo = nulls(np), gHi = nulls(np);
    plans.forEach(function(p){ var i = periods.indexOf(p.period); if (i >= 0){ gLo[i] = (p.lo != null ? p.lo : p.v); gHi[i] = (p.hi != null ? p.hi : p.v); } });
    // A forward period exists only for a stated projection; everything else stops at the last statement.
    registerResultsData('SN_TAMQ', {
      updated: 'Sep 2026',
      intro: 'Each quarter carries the figure management had <b>most recently stated</b> — these are claims, not measurements. The shaded column is management\'s own projection for exiting 2026. Analyst-quoted figures are left out of the line and listed in the table below.',
      source: (SN_TAM.sources || ''), surprise: false,
      views: { q: { label: 'Quarterly', note: 'Quarter in which the statement was made (calendar = fiscal year).',
        metrics: {
          tam: { label: 'Addressable market (as stated)', short: 'TAM', group: 'Market', unit: 'usdM', periods: periods.slice(),
            act: tamAct, cons: nulls(np), summit: nulls(np), guideLo: gLo, guideHi: gHi,
            note: 'Management\'s stated total addressable market, carried forward until restated. The range at the end is the projection given on the Q2 2026 call.' },
          subcats: { label: 'Sub-categories (as stated)', short: 'Sub-categories', group: 'Portfolio', unit: 'count', unitLabel: 'sub-categories', periods: periods.slice(),
            act: subAct, cons: nulls(np), summit: nulls(np), guideLo: nulls(np), guideHi: nulls(np),
            note: 'Total sub-categories as stated on calls and at conferences, carried forward until restated. Deck counts "as of" a past date are listed separately below.' }
        },
        sections: [{ key: 'sntam', label: 'Addressable market & portfolio', defaultMetric: 'tam', groups: [
          { label: 'Market', keys: ['tam'] }, { label: 'Portfolio', keys: ['subcats'] } ] }] } }
    });
  }
}

// ═══ The record — a filterable log (shared by both tabs) ════════════════════════════════════════

var TOPIC_LABEL = {
  spend: 'Spend', social: 'Social & creators', 'social-commerce': 'Social commerce', dtc: 'DTC', 'retail-marketing': 'Retail marketing',
  'launch-playbook': 'Launch playbook', brand: 'Brand', 'international-marketing': 'International', 'ai-marketing': 'AI', 'consumer-insight': 'Consumer insight',
  tam: 'TAM', sam: 'SAM / market size', 'subcategory-count': 'Sub-category count', 'category-count': 'Categories per market', penetration: 'Penetration',
  'market-share': 'Market share', 'new-category': 'New category', 'category-tam': 'Category TAM', framework: 'Growth algorithm'
};
var TYPE_LABEL = { call: 'Earnings call', conference: 'Conference', deck: 'Investor deck', filing: 'Filing' };

function logBody(id, items){
  items = arr(items).slice().sort(function(a, b){ return a.d < b.d ? 1 : -1; });
  if (!items.length) return '';
  var topics = [], types = [], years = [];
  items.forEach(function(it){
    if (topics.indexOf(it.topic) < 0) topics.push(it.topic);
    if (types.indexOf(it.type) < 0) types.push(it.type);
    var y = String(it.d || '').slice(0, 4); if (y && years.indexOf(y) < 0) years.push(y);
  });
  years.sort().reverse();
  function pills(attr, list, labels){
    return '<div class="guid-years"><button type="button" class="guid-year active" data-' + attr + '="all">All</button>' +
      list.map(function(t){ return '<button type="button" class="guid-year" data-' + attr + '="' + esc(t) + '">' + esc(labels[t] || t) + '</button>'; }).join('') + '</div>';
  }
  var rows = items.map(function(it){
    return '<div class="ov-tl-item" data-snlogi data-topic="' + esc(it.topic) + '" data-type="' + esc(it.type) + '" data-year="' + esc(String(it.d || '').slice(0, 4)) + '">' +
      '<div class="ov-tl-dot"></div>' +
      '<div class="ov-tl-yr">' + fmtDate(it.d) + '</div>' +
      '<div class="ov-tl-body">' +
        '<span class="ov-tag">' + esc(TOPIC_LABEL[it.topic] || it.topic) + '</span> ' +
        '<span class="ov-tag">' + esc(TYPE_LABEL[it.type] || it.type) + '</span>' + (it.analyst ? ' <span class="ov-tag">said by the analyst</span>' : '') + '<br>' +
        it.claim +
        (it.q ? '<br><i>"' + esc(it.q) + '"</i>' : '') +
        '<br>' + '<span class="ov-stat-mut">' + esc(it.who || '') + (it.who ? ' · ' : '') + esc(it.src || '') + '</span>' + link(it.url) +
      '</div></div>';
  }).join('');
  return '<div data-snlog="' + esc(id) + '">' +
    pills('snlogtopic', topics, TOPIC_LABEL) +
    pills('snlogtype', types, TYPE_LABEL) +
    '<div class="guid-years"><button type="button" class="guid-year active" data-snlogyear="all">All years</button>' +
      years.map(function(y){ return '<button type="button" class="guid-year" data-snlogyear="' + esc(y) + '">' + esc(y) + '</button>'; }).join('') + '</div>' +
    '<div class="dd-note" data-snlogcount>' + items.length + ' statements</div>' +
    '<div class="ov-timeline">' + rows + '</div></div>';
}
function wireLog(root){
  root.querySelectorAll('[data-snlog]').forEach(function(host){
    if (host._wired) return; host._wired = true;
    var st = { topic: 'all', type: 'all', year: 'all' };
    function apply(){
      var n = 0;
      host.querySelectorAll('[data-snlogi]').forEach(function(el){
        var ok = (st.topic === 'all' || el.getAttribute('data-topic') === st.topic) &&
                 (st.type === 'all' || el.getAttribute('data-type') === st.type) &&
                 (st.year === 'all' || el.getAttribute('data-year') === st.year);
        el.hidden = !ok; if (ok) n++;
      });
      var c = host.querySelector('[data-snlogcount]'); if (c) c.textContent = n + ' statement' + (n === 1 ? '' : 's');
    }
    [['snlogtopic', 'topic'], ['snlogtype', 'type'], ['snlogyear', 'year']].forEach(function(pair){
      host.querySelectorAll('[data-' + pair[0] + ']').forEach(function(btn){
        btn.addEventListener('click', function(){
          st[pair[1]] = btn.getAttribute('data-' + pair[0]);
          host.querySelectorAll('[data-' + pair[0] + ']').forEach(function(b){ b.classList.toggle('active', b === btn); });
          apply();
        });
      });
    });
  });
}

// ═══ Marketing Strategy ═════════════════════════════════════════════════════════════════════════

function quoteBlock(qs){
  return arr(qs).map(function(x){
    return '<div class="dd-note" style="border-left:3px solid var(--bdr);padding-left:10px;margin-top:8px"><i>"' + esc(x.q) + '"</i><br>' +
      '<span class="ov-stat-mut">' + esc(x.who || '') + ' · ' + esc(x.src || '') + (x.d ? ' · ' + fmtDate(x.d) : '') + '</span>' + link(x.url) + '</div>';
  }).join('');
}

function mktSocial(){
  var s = SN_MKT.social || {};
  var ms = arr(s.milestones).slice().sort(function(a, b){ return a.d < b.d ? -1 : 1; });
  var tl = ms.length ? '<div class="ov-timeline">' + ms.map(function(m){
    return '<div class="ov-tl-item"><div class="ov-tl-dot"></div><div class="ov-tl-yr">' + fmtDate(m.d) + '</div>' +
      '<div class="ov-tl-body">' + (m.plan ? '<span class="ov-tag">plan</span> ' : '') + '<b>' + esc(m.label) + '</b><br>' + (m.detail || '') +
      '<br>' + srcLine(m.src, m.url) + '</div></div>';
  }).join('') + '</div>' : '';
  var ctry = arr(s.countries).map(function(c){
    return '<tr><td class="ov-td-name">' + fmtDate(c.d) + '</td><td>' + esc(c.period || '') + '</td><td style="font-weight:700">' + esc(c.n) + (c.plan ? ' (plan)' : '') + '</td>' +
      '<td>' + esc(c.note || '') + '</td><td>' + srcLine(c.src, c.url) + '</td></tr>';
  }).join('');
  var met = arr(s.metrics).map(function(m){
    return '<tr><td class="ov-td-name">' + fmtDate(m.d) + '</td><td>' + esc(m.name) + '</td><td style="font-weight:700">' + esc(m.value) + '</td><td>' + srcLine(m.src, m.url) + '</td></tr>';
  }).join('');
  return (s.read ? '<div class="dd-callout" style="margin-top:0">' + s.read + '</div>' : '') +
    (ctry ? '<div class="dd-h" style="font-size:12.5px;margin-top:14px">TikTok Shop — countries live</div>' +
      table(['Stated', 'Quarter', 'Countries', 'Note', 'Source'], ctry) : '') +
    (tl ? '<div class="dd-h" style="font-size:12.5px;margin-top:18px">Milestones</div>' + tl : '') +
    (met ? collapsible('Social proof points over time — ' + arr(s.metrics).length + ' figures', table(['Date', 'Metric', 'Value', 'Source'], met)) : '');
}

function mktPlaybooks(){
  var pb = arr(SN_MKT.playbooks); if (!pb.length) return '';
  return pb.map(function(p){
    function col(side, lab){
      if (!side) return '';
      return '<div class="ov-driver"><div class="ov-driver-t">' + esc(lab) + ' · ' + esc(side.label || '') + '</div>' +
        '<div class="ov-driver-d"><ul class="ov-bullets" style="margin:4px 0 0">' + arr(side.points).map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul></div></div>';
    }
    var ev = arr(p.evidence).map(function(e){
      return '<tr><td class="ov-td-name">' + fmtDate(e.d) + '</td><td>' + e.claim + (e.q ? '<br><i>"' + esc(e.q) + '"</i>' : '') + '</td><td>' + srcLine(e.src, e.url) + '</td></tr>';
    }).join('');
    return '<div class="dd-h" style="font-size:12.5px;margin-top:14px">' + esc(p.title) + '</div>' +
      '<div class="ov-drivers" style="grid-template-columns:repeat(2,1fr)">' + col(p.then, 'Then') + col(p.now, 'Now') + '</div>' +
      (ev ? collapsible('The evidence — ' + arr(p.evidence).length + ' statements', table(['Date', 'What changed', 'Source'], ev)) : '');
  }).join('');
}

// ── Visual layer (Sep 16 2026, SAB: "mucho más visual, mucho menos texto, sacar partes de sus
// presentaciones"). The pane now leads with the decks' own diagrams and numbers, redrawn in Summit
// tokens; every paragraph and table that was here before is still one click away, inside a fold.

function mktFunnel(){
  var f = SN_DECK.funnel, cols = [SUMMIT_CAT[1], SUMMIT_CAT[0], SUMMIT_CAT[6]];
  return '<div class="snv-flow">' + f.steps.map(function(s, i){
    return '<div class="snv-step"><div class="snv-step-stage">' + esc(s.stage) + '</div>' +
      '<div class="snv-step-card" style="background:' + cols[i] + '"><div class="snv-step-t">' + esc(s.t) + '</div><div class="snv-step-d">' + esc(s.d) + '</div></div></div>';
  }).join('') + '</div>';
}
function chips(list, cls){ return '<div class="snv-chips">' + list.map(function(x){ return '<span class="snv-chip' + (cls ? ' ' + cls : '') + '">' + esc(x) + '</span>'; }).join('') + '</div>'; }
function mktDemand(){
  var d = SN_DECK.demand;
  return '<div class="snv-demand">' +
    '<div class="snv-demand-col"><div class="snv-demand-t">Creating demand</div>' + chips(d.create) + '</div>' +
    '<div class="snv-hub"><b>SharkNinja</b>available everywhere</div>' +
    '<div class="snv-demand-col"><div class="snv-demand-t">Fulfilling demand</div>' + chips(d.fulfil) + '</div>' +
  '</div><div class="snv-sub" style="margin-top:8px;text-align:center"><b>' + esc(d.rule) + '</b> — the brand goes wherever the consumer shops.</div>';
}
function mktStory(){
  var s = SN_DECK.storytelling;
  function card(t, sub, items, color){
    return '<div class="snv-card" style="border-top:4px solid ' + color + '"><div class="snv-card-t">' + esc(t) + '</div><div class="snv-card-m">' + esc(sub) + '</div>' +
      '<ul class="snv-list">' + items.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
  }
  return '<div class="snv-grid2">' + card('Long-form storytelling', 'the infomercial heritage', s.long, SUMMIT_CAT[0]) +
    card('Short-form storytelling', 'where the growth is now', s.short, SUMMIT_CAT[1]) + '</div>' +
    '<div class="dd-note">' + esc(s.base) + '</div>';
}
function mktErasVisual(){
  var eras = arr(SN_MKT.eras); if (!eras.length) return '';
  var last = eras.length - 1;
  var cards = '<div class="snv-eras">' + eras.map(function(e, i){
    return '<button type="button" class="snv-era' + (i === last ? ' active' : '') + '" data-snera="' + esc(e.id) + '"><div class="snv-era-p">' + esc(e.period || e.label) + '</div><div class="snv-era-t">' + esc(e.title) + '</div></button>';
  }).join('') + '</div>';
  var panes = eras.map(function(e, i){
    return '<div data-snerapane="' + esc(e.id) + '"' + (i === last ? '' : ' hidden') + '>' +
      '<div class="dd-callout" style="margin-top:10px">' + (e.summary || '') + '</div>' +
      fold('What changed in ' + esc(e.label) + ' — ' + arr(e.points).length + ' points, ' + arr(e.quotes).length + ' quotes',
        '<ul class="ov-bullets" style="margin:0">' + arr(e.points).map(function(p){ return '<li>' + p + '</li>'; }).join('') + '</ul>' + quoteBlock(e.quotes)) +
    '</div>';
  }).join('');
  return cards + panes;
}
function mktTikTok(){
  var c = arr((SN_MKT.social || {}).countries).slice().sort(function(a, b){ return pKey(a.period) - pKey(b.period); });
  if (!c.length) return '';
  var firstPlan = -1; c.forEach(function(x, i){ if (x.plan && firstPlan < 0) firstPlan = i; });
  return snvChart('sn-tiktok', {
    unit: 'n', unitLabel: 'Countries live on TikTok Shop', labelsOn: true, height: 200, estFrom: firstPlan >= 0 ? firstPlan : null,
    labels: c.map(function(x){ return x.period + (x.plan ? ' (target)' : ''); }),
    series: [{ k: 'n', label: 'Countries live', color: SUMMIT_CAT[0], data: c.map(function(x){ return x.n; }) }],
    note: 'Countries with a live TikTok Shop, as stated on calls and at conferences. The last bar is the target for holiday 2026 ("12 or 13").',
    tableHead: 'Countries by quarter',
  });
}

export function snMktBody(){
  register();
  var d = SN_DECK;
  return '<div class="snv">' +
    tiles(arr(SN_MKT.kpis).slice(0, 4).map(function(k){ return { v: k.v, l: k.k, s: String(k.s || '').split(' · ')[0] }; })) +
    fold('The thesis in one paragraph', SN_MKT.lede || '') +

    head('What they spend') +
    '<div data-snmktchart>' + (resultsHtml('SN_MKT') || '') + '</div>' +
    fold('What they say vs what the filings show', (SN_MKT.spend && SN_MKT.spend.read ? '<p style="margin:0 0 10px">' + SN_MKT.spend.read + '</p>' : '') + mktSpendTable()) +

    head('How a product gets marketed', d.funnel.link, esc(d.funnel.lede)) + mktFunnel() +
    head('Create demand everywhere, sell it everywhere', d.demand.link) + mktDemand() +
    head('Long-form vs short-form', d.storytelling.link) + mktStory() +
    head('Engagement at the IPO', d.engagement.link, 'The proof points the Jul 2023 deck chose to lead with.') + tiles(d.engagement.tiles, 4) +

    head('How the model changed, 2023 → 2026', null, 'Pick a period.') + mktErasVisual() +

    head('Social commerce — TikTok Shop') + mktTikTok() +
    fold('Milestones and social proof points', mktSocial()) +

    head('The playbooks — then vs now') + mktPlaybooks() +

    fold('The record — every statement, filterable (' + arr(SN_MKT.log).length + ')', logBody('mkt', SN_MKT.log)) +
    (SN_MKT.sources ? '<div class="dd-note">' + SN_MKT.sources + ' Diagrams redrawn from the SharkNinja investor decks of Jul 2023, Mar 2025 and Aug 2026 (slide links on each heading).</div>' : '') +
  '</div>';
}
function mktSpendTable(){
  var sp = SN_MKT.spend || {};
  var said = arr(sp.said).map(function(s){
    return '<tr><td class="ov-td-name">' + fmtDate(s.d) + '</td><td>' + esc(s.src) + '</td><td>' + esc(s.who || '') + '</td>' +
      '<td style="font-weight:600">' + esc(s.said) + '</td><td>' + esc(s.reported || '—') + '</td><td>' + link(s.url) + '</td></tr>';
  }).join('');
  return said ? table(['Date', 'Where', 'Who', 'What was said', 'What the filings show', ''], said) : '';
}

// ═══ TAM ════════════════════════════════════════════════════════════════════════════════════════

function tamSubcats(){
  var s = SN_TAM.subcats || {};
  var byb = arr(s.byBrand).map(function(r){
    return '<tr><td class="ov-td-name">' + fmtDate(r.d) + '</td><td>' + esc(r.asOf ? 'as of ' + fmtDate(r.asOf) : '') + '</td>' +
      '<td>' + esc(r.shark) + '</td><td>' + esc(r.ninja) + '</td><td style="font-weight:700">' + esc(r.total) + '</td><td>' + srcLine(r.src, r.url) + '</td></tr>';
  }).join('');
  var pts = arr(s.points).slice().sort(function(a, b){ return a.d < b.d ? -1 : 1; }).map(function(p){
    return '<tr><td class="ov-td-name">' + fmtDate(p.d) + '</td><td style="font-weight:700">' + esc(p.n) + (p.plan ? ' (plan)' : '') + '</td>' +
      '<td>' + esc(p.asOf ? 'as of ' + fmtDate(p.asOf) : '') + '</td><td>' + esc(p.who || '') + (p.analyst ? ' <span class="ov-tag">analyst</span>' : '') + '</td><td>' + srcLine(p.src, p.url) + '</td></tr>';
  }).join('');
  return (s.cadence ? '<div class="dd-callout" style="margin-top:0">' + s.cadence + '</div>' : '') +
    (byb ? '<div class="dd-h" style="font-size:12.5px;margin-top:14px">By brand, from the investor decks</div>' + table(['Deck', 'Count date', 'Shark', 'Ninja', 'Total', 'Source'], byb) : '') +
    (s.read ? '<div class="dd-callout">' + s.read + '</div>' : '') +
    (pts ? collapsible('Every count statement — ' + arr(s.points).length, table(['Date', 'Count', 'Basis', 'Who', 'Source'], pts)) : '');
}

function tamLedger(){
  var rows = arr(SN_TAM.categories).map(function(c){
    // Widths set per cell: the text columns (TAM, result) carry the read, so they get the room.
    return '<tr><td class="ov-td-name" style="white-space:normal;width:20%">' + esc(c.name) + '</td><td>' + esc(c.brand || '') + '</td><td>' + esc(c.entered || '') + '</td>' +
      '<td style="font-weight:600;white-space:normal;width:26%">' + esc(c.tam || '—') + (c.tamWho && c.tamWho !== 'management' && c.tamWho !== '—' ? ' <span class="ov-tag">' + esc(c.tamWho) + '</span>' : '') + '</td>' +
      '<td style="white-space:normal;width:34%">' + (c.result || '') + '</td><td style="white-space:normal;width:12%">' + srcLine(c.src, c.url) + '</td></tr>';
  }).join('');
  return rows ? table(['Category', 'Brand', 'Entered', 'TAM as sized', 'What it did', 'Source'], rows) : '';
}

function tamInternational(){
  var i = SN_TAM.international || {};
  var opp = arr(i.opportunities).map(function(o){
    return '<tr><td class="ov-td-name">' + esc(o.market) + '</td><td style="font-weight:700">' + esc(o.stated) + '</td><td>' + fmtDate(o.d) + '</td><td>' + esc(o.who || '') + '</td><td>' + srcLine(o.src, o.url) + '</td></tr>';
  }).join('');
  var per = arr(i.perMarket).map(function(o){
    return '<tr><td class="ov-td-name">' + esc(o.market) + '</td><td style="font-weight:700">' + esc(o.n) + ' ' + esc(o.unit || '') + '</td><td>' + fmtDate(o.d) + '</td><td>' + srcLine(o.src, o.url) + '</td></tr>';
  }).join('');
  var pen = arr(i.penetration).map(function(o){
    return '<tr><td class="ov-td-name">' + esc(o.scope) + '</td><td>' + o.claim + '</td><td>' + fmtDate(o.d) + '</td><td>' + srcLine(o.src, o.url) + '</td></tr>';
  }).join('');
  return (i.read ? '<div class="dd-callout" style="margin-top:0">' + i.read + '</div>' : '') +
    (opp ? '<div class="dd-h" style="font-size:12.5px;margin-top:14px">Market opportunities, as sized</div>' + table(['Market', 'Stated', 'Date', 'Who', 'Source'], opp) : '') +
    (per ? '<div class="dd-h" style="font-size:12.5px;margin-top:14px">Categories per market</div>' + table(['Market', 'Count', 'Date', 'Source'], per) : '') +
    (pen ? '<div class="dd-h" style="font-size:12.5px;margin-top:14px">Penetration</div>' + table(['Scope', 'Claim', 'Date', 'Source'], pen) : '');
}

function tamShare(){
  var rows = arr(SN_TAM.share).slice().sort(function(a, b){ return a.d < b.d ? -1 : 1; }).map(function(s){
    return '<tr><td class="ov-td-name">' + fmtDate(s.d) + '</td><td>' + esc(s.scope) + '</td><td>' + s.claim + '</td><td>' + srcLine(s.src, s.url) + '</td></tr>';
  }).join('');
  return rows ? collapsible('Share and rank claims — ' + arr(SN_TAM.share).length, table(['Date', 'Scope', 'Claim', 'Source'], rows)) : '';
}

// ── Visual layer (Sep 16 2026) — see the note above snMktBody. ──

function tamScale(){
  var s = SN_DECK.scale, last = s.labels.length - 1;
  return '<div class="snv-scale">' + s.tiles.map(function(t){
    var max = Math.max.apply(null, t.v), first = t.v[0], end = t.v[last];
    var val = t.fmt ? t.fmt(end) : end.toLocaleString('en-US') + (t.plus ? '+' : '');
    var mult = end / first;
    var delta = t.unit === '$B' ? '+' + Math.round((mult - 1) * 100) + '% since Dec 2022' : '+' + (end - first).toLocaleString('en-US') + ' since Dec 2022';
    return '<div class="snv-sc"><div class="snv-sc-l">' + esc(t.label) + '</div><div class="snv-sc-v">' + esc(val) + '</div><div class="snv-sc-d">' + esc(delta) + '</div>' +
      '<div class="snv-sc-bars">' + t.v.map(function(x, i){
        var lbl = (t.fmt ? t.fmt(x) : x.toLocaleString('en-US') + (t.plus ? '+' : '')) + ' · ' + s.labels[i];
        return '<div class="snv-sc-bar" title="' + esc(lbl) + '" style="height:' + Math.max(8, Math.round(x / max * 100)) + '%;background:' + YEAR_RAMP[i] + '"></div>';
      }).join('') + '</div>' +
      '<div class="snv-sc-yr">' + s.labels.map(function(l){ return '<span>' + esc('’' + l.slice(-2)) + '</span>'; }).join('') + '</div></div>';
  }).join('') + '</div>';
}
function tamScaleTable(){
  var s = SN_DECK.scale;
  var rows = s.tiles.map(function(t){
    return '<tr><td class="ov-td-name">' + esc(t.label) + '</td>' + t.v.map(function(x){ return '<td>' + esc(t.fmt ? t.fmt(x) : x.toLocaleString('en-US') + (t.plus ? '+' : '')) + '</td>'; }).join('') + '</tr>';
  }).join('');
  var src = '<tr><td class="ov-td-name">Deck</td>' + s.decks.map(function(d, i){ return '<td><a href="' + esc(s.links[i]) + '" target="_blank" rel="noopener">' + esc(d) + ' ↗</a></td>'; }).join('') + '</tr>';
  return table(['As of'].concat(s.labels), rows + src) + '<div class="dd-note">' + esc(s.note) + '</div>';
}
function shareViews(sh, prefix){
  return sh.views.map(function(v){
    var ramp = v.years.length === 2 ? [YEAR_RAMP[0], YEAR_RAMP[3]] : YEAR_RAMP;
    return { id: v.id, label: v.label, labels: v.cats, note: v.note,
      series: v.years.map(function(y, i){ return { k: prefix + y, label: y, color: ramp[i], data: v.data[i] }; }) };
  });
}
function tamShare2(){
  var us = snvChart('sn-share-us', { unit: '%', unitLabel: 'US market share, % of dollar sales', height: 250, views: shareViews(SN_DECK.shareUS, 'us'), tableHead: 'US share by category' });
  var uk = snvChart('sn-share-uk', { unit: '%', unitLabel: 'UK market share, %', height: 250, labelsOn: true, views: shareViews(SN_DECK.shareUK, 'uk'), tableHead: 'UK share by category' });
  return us + '<div class="snv-sub" style="margin:14px 0 0"><b>United Kingdom</b> — each deck measured it differently, so each is its own view.</div>' + uk;
}
function tamBrands(){
  var b = SN_DECK.brands, sc = arr((SN_TAM.subcats || {}).byBrand).filter(function(r){ return r.d !== '2023-12-18' && r.d !== '2026-02-11'; });
  var sales = snvChart('sn-brand-sales', { title: 'Net sales by brand', unit: '$B', unitLabel: 'Net sales, $B', stacked: true, labelsOn: true, height: 220, labels: b.labels,
    series: [{ k: 'shark', label: 'Shark', color: SUMMIT_CAT[0], data: b.shark }, { k: 'ninja', label: 'Ninja', color: SUMMIT_CAT[1], data: b.ninja }],
    note: b.note, tableHead: 'Net sales by brand' });
  var subs = sc.length ? snvChart('sn-brand-subcats', { title: 'Sub-categories by brand', unit: 'n', unitLabel: 'Sub-categories at year end', stacked: true, labelsOn: true, height: 220,
    labels: sc.map(function(r){ return 'Dec ' + String(r.asOf).slice(0, 4); }),
    series: [{ k: 'shark', label: 'Shark', color: SUMMIT_CAT[0], data: sc.map(function(r){ return r.shark; }) }, { k: 'ninja', label: 'Ninja', color: SUMMIT_CAT[1], data: sc.map(function(r){ return r.ninja; }) }],
    note: 'Deck year-end counts. Spoken counts run ahead: 41 by Sep 15 2026.', tableHead: 'Sub-categories by brand' }) : '';
  var nw = b.newSubcats;
  var newChips = '<div class="snv-grid2" style="margin-top:12px">' +
    '<div class="snv-card"><div class="snv-card-top"><span class="snv-card-t">Shark — entered in the last 3 years</span><span class="snv-pill" style="background:' + SUMMIT_CAT[0] + '">' + nw.Shark.length + '</span></div>' + chips(nw.Shark, 'is-new') + '</div>' +
    '<div class="snv-card"><div class="snv-card-top"><span class="snv-card-t">Ninja — entered in the last 3 years</span><span class="snv-pill" style="background:' + SUMMIT_CAT[1] + '">' + nw.Ninja.length + '</span></div>' + chips(nw.Ninja, 'is-new') + '</div>' +
  '</div><div class="dd-note">' + esc(nw.note) + '</div>';
  return '<div class="snv-grid2">' + sales + subs + '</div>' + newChips;
}
function tamPillars(){
  var p = SN_DECK.pillars, cols = [SUMMIT_CAT[0], SUMMIT_CAT[2], SUMMIT_CAT[1]];
  var ly = ((SN_TAM.algorithm || {}).deck || {}).launchYear;
  return '<div class="snv-grid2"><div>' +
      '<div class="snv-pillars">' + p.map(function(x, i){ return '<div class="snv-pillar"><div class="snv-pillar-bar" style="height:' + (x.v * 2.2) + '%;background:' + cols[i] + '">~' + x.v + '%</div></div>'; }).join('') + '</div>' +
      '<div class="snv-pillar-l">' + p.map(function(x){ return '<div>' + esc(x.label) + '<small>' + esc(x.def) + '</small></div>'; }).join('') + '</div>' +
      '<div class="dd-note">Share of net sales growth, 3-year average 2023–2025, approximate. <a href="' + esc(SN_DECK.pillarsLink) + '" target="_blank" rel="noopener">slide 20 ↗</a></div>' +
    '</div><div>' +
      '<div class="snv-sub" style="margin:4px 0 8px"><b>In the year a category launches</b>, it adds only a sliver of growth — the core carries the top line, and new categories mature into it.</div>' +
      (ly != null ? '<div class="snv-split"><div style="flex:' + (100 - ly) + ';background:' + SUMMIT_CAT[0] + '">~' + (100 - ly) + '%</div><div style="flex:' + ly + ';background:' + SUMMIT_CAT[1] + '">~' + ly + '%</div></div>' +
        '<div class="snv-split-leg"><span><i style="background:' + SUMMIT_CAT[0] + '"></i>Existing categories</span><span><i style="background:' + SUMMIT_CAT[1] + '"></i>New categories launched in-year</span></div>' +
        '<div class="dd-note">Contribution to net sales growth within the launch year, 2023–2025 average. <a href="' + esc(SN_DECK.launchYearLink) + '" target="_blank" rel="noopener">slide 21 ↗</a></div>' : '') +
    '</div></div>';
}
function tamLedgerCards(){
  var cats = arr(SN_TAM.categories); if (!cats.length) return '';
  return '<div class="snv-cards">' + cats.map(function(c){
    var col = /Shark/i.test(c.brand || '') ? SUMMIT_CAT[0] : SUMMIT_CAT[1];
    var name = String(c.name || '').replace(/\s*\(.*\)\s*$/, '');
    var prod = (/\((.*)\)/.exec(c.name || '') || [])[1] || '';
    return '<div class="snv-card" style="border-top:4px solid ' + col + '"><div class="snv-card-top"><span class="snv-card-yr">' + esc(c.entered || '') + '</span><span class="snv-pill" style="background:' + col + '">' + esc(c.brand || '') + '</span></div>' +
      '<div class="snv-card-t">' + name + '</div>' + (prod ? '<div class="snv-card-m">' + prod + '</div>' : '') +
      '<div class="snv-card-d"><b>TAM:</b> ' + esc(String(c.tam || '—').replace(/&amp;/g, '&')) + '</div></div>';
  }).join('') + '</div>';
}
function tamIntl(){
  var t = SN_DECK.intl;
  var chart = snvChart('sn-intl', { title: 'International net sales (outside North America)', unit: '$M', unitLabel: 'Net sales outside North America, $M', labelsOn: true, height: 220, labels: t.labels,
    series: [{ k: 'intl', label: 'International net sales', color: SUMMIT_CAT[0], data: t.sales }],
    note: t.cagr.map(function(c, i){ return t.labels[i] + ': ' + c; }).join(' · '), tableHead: 'International net sales and markets',
    extraRows: [{ label: 'Net sales CAGR from 2020', cells: t.cagr.map(function(c){ return c.split(' CAGR')[0]; }) },
                { label: 'Markets at year end', cells: t.markets.map(String) }] });
  // North America is the reference mass, so it takes ink; the three smaller regions take identity hues.
  var r = SN_DECK.regions, cols = [SUMMIT_INK, SUMMIT_CAT[0], SUMMIT_CAT[2], SUMMIT_CAT[3]];
  var split = r.labels.map(function(y, j){
    return '<div style="display:grid;grid-template-columns:44px 1fr;gap:8px;align-items:center;margin-top:8px"><b style="font-size:12px;color:var(--navy)">' + esc(y) + '</b><div class="snv-split">' +
      r.series.map(function(s, i){ return '<div title="' + esc(s.label + ' ' + s.v[j] + '%') + '" style="flex:' + s.v[j] + ';background:' + cols[i] + '">' + (s.v[j] >= 8 ? s.v[j] + '%' : '') + '</div>'; }).join('') + '</div></div>';
  }).join('') + '<div class="snv-split-leg">' + r.series.map(function(s, i){ return '<span><i style="background:' + cols[i] + '"></i>' + esc(s.label) + '</span>'; }).join('') + '</div>' +
    '<div class="dd-note">' + esc(r.note) + ' <a href="' + esc(r.links[1]) + '" target="_blank" rel="noopener">slide ↗</a></div>';
  var direct = '<div class="snv-cards" style="grid-template-columns:repeat(auto-fill,minmax(120px,1fr))">' + t.direct.map(function(m){
    var home = m.y === 'home';
    return '<div class="snv-card" style="padding:9px 11px"><div class="snv-card-yr" style="font-size:' + (home || m.y.length > 4 ? '12px' : '18px') + '">' + esc(home ? 'Home market' : m.y) + '</div><div class="snv-card-t">' + esc(m.c) + '</div></div>';
  }).join('') + '</div>';
  return '<div class="snv-grid2"><div>' + chart + '</div><div>' +
      '<div class="snv-chart"><div class="snv-chart-h">Where net sales came from</div>' + split + '</div>' +
      '<div class="snv-chart"><div class="snv-chart-h">Direct SharkNinja operations</div><div class="snv-card-m">Markets served: ' + t.markets.join(' → ') + ' (Dec 2022 → Dec 2025)</div>' + direct + '</div>' +
    '</div></div>' +
    '<div class="dd-note">' + esc(t.note) + '</div>';
}

export function snTamBody(){
  register();
  var d = SN_DECK;
  return '<div class="snv">' +
    tiles(arr(SN_TAM.kpis).slice(0, 4).map(function(k){ return { v: k.v, l: k.k, s: String(k.s || '').split(' · ')[0] }; })) +
    fold('The thesis in one paragraph', SN_TAM.lede || '') +

    head('The scale, deck by deck', d.scale.links[3], 'The same "Who We Are" tiles, four decks in a row.') + tamScale() +
    fold('The numbers behind the tiles', tamScaleTable()) +

    head('The addressable market, as management has sized it') +
    '<div data-sntamchart>' + (resultsHtml('SN_TAMQ') || '') + '</div>' +
    fold('What the TAM claims do and do not say — ' + arr((SN_TAM.tam || {}).points).length + ' statements', ((SN_TAM.tam || {}).read ? '<p style="margin:0 0 10px">' + SN_TAM.tam.read + '</p>' : '') + tamMarketTable()) +

    head('Share in the categories it already sells', d.shareUS.views[0].links[3], esc(d.shareUK.read)) + tamShare2() +

    head('Two brands, more sub-categories', d.brands.links[3]) + tamBrands() +
    fold('How many categories a year, and the count noise', tamSubcats()) +

    head('Where growth came from, 2023–2025', d.pillarsLink) + tamPillars() +
    fold('Said vs shown — how management describes the formula', tamAlgorithmText()) +

    head('The categories it entered, and what they were worth') + tamLedgerCards() +
    fold('What each category did — the full ledger', tamLedger()) +

    head('International — the same categories, more markets', d.intl.links[3]) + tamIntl() +
    fold('Market sizes, categories per market, penetration and share claims', tamInternational() + tamShare()) +

    fold('The record — every statement, filterable (' + arr(SN_TAM.log).length + ')', logBody('tam', SN_TAM.log)) +
    (SN_TAM.sources ? '<div class="dd-note">' + SN_TAM.sources + ' Charts redrawn from the SharkNinja investor decks of Jul 2023, Mar 2024, Mar 2025 and Aug 2026 (slide links on each heading).</div>' : '') +
  '</div>';
}
function tamMarketTable(){
  var t = SN_TAM.tam || {};
  var rows = arr(t.points).slice().sort(function(a, b){ return a.d < b.d ? -1 : 1; }).map(function(p){
    var v = (p.lo != null && p.hi != null) ? ('$' + (p.lo / 1000) + '–' + (p.hi / 1000) + 'B') : (p.v != null ? '$' + (p.v / 1000) + 'B' : '—');
    return '<tr><td class="ov-td-name">' + fmtDate(p.d) + '</td><td style="font-weight:700">' + esc(v) + (p.qual ? ' <span class="ov-stat-mut">(' + esc(p.qual) + ')</span>' : '') + '</td>' +
      '<td>' + esc(p.who || '') + (p.analyst ? ' <span class="ov-tag">analyst</span>' : '') + (p.plan ? ' <span class="ov-tag">projection</span>' : '') + '</td>' +
      '<td>' + srcLine(p.src, p.url) + '</td></tr>';
  }).join('');
  return rows ? table(['Date', 'Stated', 'Who', 'Source'], rows) : '';
}
function tamAlgorithmText(){
  var a = SN_TAM.algorithm || {};
  var said = arr(a.said).slice().sort(function(x, y){ return x.d < y.d ? -1 : 1; }).map(function(s){
    return '<tr><td class="ov-td-name">' + fmtDate(s.d) + '</td><td>' + s.claim + (s.q ? '<br><i>"' + esc(s.q) + '"</i>' : '') + '</td><td>' + srcLine(s.src, s.url) + '</td></tr>';
  }).join('');
  return (a.read ? '<p style="margin:0 0 10px">' + a.read + '</p>' : '') + (a.deck && a.deck.note ? '<div class="dd-note" style="margin-bottom:10px">' + a.deck.note + '</div>' : '') +
    (said ? table(['Date', 'What they said', 'Source'], said) : '');
}

// ═══ Wiring ═════════════════════════════════════════════════════════════════════════════════════

function wireCollapsibles(root){
  root.querySelectorAll('.ov-collap-h').forEach(function(btn){
    if (btn._wired) return; btn._wired = true;
    btn.addEventListener('click', function(){
      var box = btn.parentElement, body = btn.nextElementSibling; if (!body) return;
      var open = body.hidden; body.hidden = !open; box.classList.toggle('open', open);
      var ic = btn.querySelector('.ov-collap-ic'); if (ic) ic.textContent = open ? '▾' : '▸';
    });
  });
}

// Called when Misc ▸ Marketing Strategy becomes visible (Chart.js needs a non-null offsetParent).
export function snMktInit(pane){
  if (!pane) return;
  var host = pane.querySelector('[data-snmktchart]');
  if (host && host.querySelector('.rs-wrap, [class^="rs-"]')) initResults(host, 'SN_MKT');
  if (!pane._snWired){
    pane._snWired = true;
    pane.querySelectorAll('[data-snera]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var k = btn.getAttribute('data-snera');
        pane.querySelectorAll('[data-snera]').forEach(function(b){ b.classList.toggle('active', b === btn); });
        pane.querySelectorAll('[data-snerapane]').forEach(function(p){ p.hidden = p.getAttribute('data-snerapane') !== k; });
      });
    });
    wireCollapsibles(pane);
    wireLog(pane);
  }
  snvInit(pane);
}
export function snTamInit(pane){
  if (!pane) return;
  var host = pane.querySelector('[data-sntamchart]');
  if (host && host.querySelector('.rs-wrap, [class^="rs-"]')) initResults(host, 'SN_TAMQ');
  if (!pane._snWired){ pane._snWired = true; wireCollapsibles(pane); wireLog(pane); }
  snvInit(pane);
}
