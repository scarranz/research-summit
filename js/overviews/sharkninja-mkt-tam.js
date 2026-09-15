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
// Quartr + SEC filings. This file only draws. Charts are the shared Results ENGINE (registered
// datasets), so they carry the six non-negotiables of CHART_ENGINE_REFERENCE §0.2 for free; every
// other block uses the canonical Deep Dive components (dd-*, ov-sec, ov-table, ov-timeline,
// guid-year pills, ov-collap) — no inline <style>.

import { registerResultsData, resultsHtml, initResults } from '../results.js';
import { snResults } from '../results-data/sn.js';
import { SN_MKT } from './sharkninja-mkt-data.js';
import { SN_TAM } from './sharkninja-tam-data.js';

// Escapes, but never double-encodes an entity the data file already wrote (e.g. "Hair dryers &amp; stylers").
function esc(s){ if(s==null) return ''; return String(s).replace(/&(?!#?\w+;)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function arr(a){ return Array.isArray(a) ? a : []; }
function nulls(n){ var o = []; for (var i = 0; i < n; i++) o.push(null); return o; }

function kpis(items){
  return '<div class="dd-kpis">' + arr(items).map(function(k){
    return '<div class="dd-kpi"><div class="dd-kpi-v">' + esc(k.v) + '</div><div class="dd-kpi-k">' + esc(k.k) + '</div><div class="dd-kpi-s">' + esc(k.s) + '</div></div>';
  }).join('') + '</div>';
}
function collapsible(title, inner){
  return '<div class="ov-collap">' +
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">▸</span>' + esc(title) + '</button>' +
    '<div class="ov-collap-b" hidden>' + inner + '</div></div>';
}
function sec(title, inner){ return '<div class="ov-sec"><div class="ov-sec-h">' + esc(title) + '</div>' + inner + '</div>'; }
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

function mktSpend(){
  var sp = SN_MKT.spend || {};
  var said = arr(sp.said).map(function(s){
    return '<tr><td class="ov-td-name">' + fmtDate(s.d) + '</td><td>' + esc(s.src) + '</td><td>' + esc(s.who || '') + '</td>' +
      '<td style="font-weight:600">' + esc(s.said) + '</td><td>' + esc(s.reported || '—') + '</td><td>' + link(s.url) + '</td></tr>';
  }).join('');
  return '<div data-snmktchart>' + (resultsHtml('SN_MKT') || '') + '</div>' +
    (sp.read ? '<div class="dd-callout">' + sp.read + '</div>' : '') +
    (said ? collapsible('Said vs reported — every spoken spend figure, ' + arr(sp.said).length + ' statements',
      table(['Date', 'Where', 'Who', 'What was said', 'What the filings show', ''], said)) : '');
}

function mktEras(){
  var eras = arr(SN_MKT.eras); if (!eras.length) return '';
  var pills = '<div class="guid-years">' + eras.map(function(e, i){
    return '<button type="button" class="guid-year' + (i === eras.length - 1 ? ' active' : '') + '" data-snera="' + esc(e.id) + '">' + esc(e.label) + '</button>';
  }).join('') + '</div>';
  var panes = eras.map(function(e, i){
    return '<div data-snerapane="' + esc(e.id) + '"' + (i === eras.length - 1 ? '' : ' hidden') + '>' +
      '<div class="dd-h" style="font-size:13px;margin-top:4px">' + esc(e.title) + ' <span class="ov-stat-mut" style="font-weight:600">' + esc(e.period || '') + '</span></div>' +
      '<div class="dd-sub">' + (e.summary || '') + '</div>' +
      '<ul class="ov-bullets">' + arr(e.points).map(function(p){ return '<li>' + p + '</li>'; }).join('') + '</ul>' +
      quoteBlock(e.quotes) + '</div>';
  }).join('');
  return pills + panes;
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

export function snMktBody(){
  register();
  return '<div class="dd-h">Marketing Strategy</div>' +
    (SN_MKT.lede ? '<div class="dd-sub">' + SN_MKT.lede + '</div>' : '') +
    kpis(SN_MKT.kpis) +
    sec('What they spend — and what they say they spend', mktSpend()) +
    sec('How the marketing model changed', mktEras()) +
    sec('Social media and social commerce', mktSocial()) +
    sec('The playbooks — launching a product, entering a country', mktPlaybooks()) +
    sec('The record — every statement, filterable', collapsible('Open the record — ' + arr(SN_MKT.log).length + ' statements, filter by topic, source and year', logBody('mkt', SN_MKT.log))) +
    (SN_MKT.sources ? '<div class="dd-note">' + SN_MKT.sources + '</div>' : '');
}

// ═══ TAM ════════════════════════════════════════════════════════════════════════════════════════

function tamMarket(){
  var t = SN_TAM.tam || {};
  var rows = arr(t.points).slice().sort(function(a, b){ return a.d < b.d ? -1 : 1; }).map(function(p){
    var v = (p.lo != null && p.hi != null) ? ('$' + (p.lo / 1000) + '–' + (p.hi / 1000) + 'B') : (p.v != null ? '$' + (p.v / 1000) + 'B' : '—');
    return '<tr><td class="ov-td-name">' + fmtDate(p.d) + '</td><td style="font-weight:700">' + esc(v) + (p.qual ? ' <span class="ov-stat-mut">(' + esc(p.qual) + ')</span>' : '') + '</td>' +
      '<td>' + esc(p.who || '') + (p.analyst ? ' <span class="ov-tag">analyst</span>' : '') + (p.plan ? ' <span class="ov-tag">projection</span>' : '') + '</td>' +
      '<td>' + srcLine(p.src, p.url) + '</td></tr>';
  }).join('');
  return '<div data-sntamchart>' + (resultsHtml('SN_TAMQ') || '') + '</div>' +
    (t.read ? '<div class="dd-callout">' + t.read + '</div>' : '') +
    (rows ? collapsible('Every TAM statement — ' + arr(t.points).length + ', incl. analyst-quoted', table(['Date', 'Stated', 'Who', 'Source'], rows)) : '');
}

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

function tamAlgorithm(){
  var a = SN_TAM.algorithm || {}, dk = a.deck;
  var bar = '';
  if (dk && dk.existing != null){
    var parts = [['Existing categories', dk.existing, 'var(--navy)'], ['International', dk.international, 'var(--steel)'], ['New categories', dk.newCats, '#A3AEBC']];
    bar = '<div class="dd-h" style="font-size:12.5px;margin-top:4px">What the Aug 2026 deck says growth actually came from</div>' +
      '<div style="display:flex;height:26px;border-radius:7px;overflow:hidden;border:1px solid var(--bdr)">' +
      parts.map(function(p){ return '<div style="width:' + (+p[1]) + '%;background:' + p[2] + ';color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center" title="' + esc(p[0]) + '">≈' + esc(p[1]) + '%</div>'; }).join('') +
      '</div>' +
      '<div class="dd-note">' + parts.map(function(p){ return '<b>' + esc(p[0]) + '</b> ≈' + esc(p[1]) + '%'; }).join(' · ') +
        (dk.launchYear != null ? ' · new categories in their launch year ≈' + esc(dk.launchYear) + '%' : '') + '. ' + (dk.note || '') + ' ' + srcLine(dk.src, dk.url) + '</div>';
  }
  var said = arr(a.said).slice().sort(function(x, y){ return x.d < y.d ? -1 : 1; }).map(function(s){
    return '<tr><td class="ov-td-name">' + fmtDate(s.d) + '</td><td>' + s.claim + (s.q ? '<br><i>"' + esc(s.q) + '"</i>' : '') + '</td><td>' + srcLine(s.src, s.url) + '</td></tr>';
  }).join('');
  return bar + (a.read ? '<div class="dd-callout">' + a.read + '</div>' : '') +
    (said ? collapsible('How management has described the formula — ' + arr(a.said).length + ' statements', table(['Date', 'What they said', 'Source'], said)) : '');
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

export function snTamBody(){
  register();
  return '<div class="dd-h">TAM</div>' +
    (SN_TAM.lede ? '<div class="dd-sub">' + SN_TAM.lede + '</div>' : '') +
    kpis(SN_TAM.kpis) +
    sec('The addressable market, as management has sized it', tamMarket()) +
    sec('Sub-categories — the portfolio that expands it', tamSubcats()) +
    sec('The category ledger — what was entered, what it was worth, what it did', tamLedger()) +
    sec('The growth algorithm — said vs shown', tamAlgorithm()) +
    sec('International — the same categories, more markets', tamInternational() + tamShare()) +
    sec('The record — every statement, filterable', collapsible('Open the record — ' + arr(SN_TAM.log).length + ' statements, filter by topic, source and year', logBody('tam', SN_TAM.log))) +
    (SN_TAM.sources ? '<div class="dd-note">' + SN_TAM.sources + '</div>' : '');
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
}
export function snTamInit(pane){
  if (!pane) return;
  var host = pane.querySelector('[data-sntamchart]');
  if (host && host.querySelector('.rs-wrap, [class^="rs-"]')) initResults(host, 'SN_TAMQ');
  if (!pane._snWired){ pane._snWired = true; wireCollapsibles(pane); wireLog(pane); }
}
