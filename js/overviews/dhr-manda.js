// dhr-manda.js — Danaher, Deep Dive ▸ Evolution ▸ M&A.
//
// Danaher is an acquirer before it is anything else, and its P&L only makes sense read that way:
// the ~$1.9B of annual intangible amortisation that separates GAAP from adjusted earnings is the
// accumulated price of this table. So this pane sits in Evolution, next to Guidance, rather than
// in Miscellaneous — it is part of how the company evolves, not a footnote.
//
// ── WHAT IS IN THE TABLE, AND WHAT IS DELIBERATELY NOT ────────────────────────────────────────
// The NINE platform deals, not all of them. Danaher has done scores of bolt-ons — the 10-Ks
// disclose them only in aggregate ("acquired three businesses for total consideration of $558
// million in cash, net of cash acquired") with no names, no prices and no multiples. Listing a
// bolt-on with blank columns would pad the table without informing it, so the bolt-on years are
// shown in the CHART, where they are the real bars they were, and named in the note.
//
// ── THE MULTIPLE COLUMN IS THE ONE THAT NEEDS CARE ────────────────────────────────────────────
// Three provenances, and the pane marks which is which on every row, because they are not
// interchangeable:
//   `co`   Danaher (or the target) stated the multiple in the deal announcement. The best kind.
//   `calc` Derived here: the announced enterprise value divided by a target revenue figure the
//          announcement itself gives. The arithmetic is shown so it can be checked.
//   `none` Not disclosed and not derivable — a private target that never published revenue. It
//          says "not disclosed" and stays empty. It is never estimated.
// A multiple with no source behind it would be the easiest thing in this pane to invent and the
// hardest for a reader to catch, which is exactly why each one carries its provenance chip.

import { dStdScaffold, dStdRender, dWireTables, D_ACT } from './dhr-chartkit.js';
import { A } from './dhr-bottomline.js';

var BRAND = '#0F7DC2', BRAND2 = '#1E3A5F', GRAY = '#9AA4B0', AMBER = '#B7791F', GREEN = '#2E8B57', PURPLE = '#7A5AF8';
function esc(s){ if (s == null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// Segment colours match the rest of the Danaher tab.
var SEG = {
  bio: { n:'Biotechnology', c:BRAND },
  ls:  { n:'Life Sciences', c:GREEN },
  dx:  { n:'Diagnostics',   c:PURPLE },
  mix: { n:'Dx + Life Sci', c:GRAY }
};

// ═══ The platform deals ═══════════════════════════════════════════════════════════════════════
// `ev` in $M. `mult` is what is shown; `multSrc` is its provenance (see the header).
var DEALS = [
  { co:'Masimo', closed:'Jun 2026', year:2026, ev:9900, evLab:'~$9.9B EV', seg:'dx',
    mult:'~18× 2027E EBITDA', multSrc:'co', multNote:'15× including the full benefit of expected annual synergies. Danaher\'s own figure in the 17-Feb-2026 announcement. $180.00 per share.',
    prod:'Pulse oximetry and patient monitoring', prodX:'Acute care. ~$1.5B of revenue. The first time Danaher has bought a bedside medical-device business rather than a laboratory one.',
    flag:'The most recent. Closed earlier than planned and took net debt from $13.8B to $22.2B.' },

  { co:'StatLab', closed:'pending', year:2026, ev:null, evLab:'not disclosed', seg:'dx',
    mult:'not disclosed', multSrc:'none',
    prod:'Histology consumables', prodX:'~$250M of 2025 revenue and <b>more than 85% recurring</b>. Comes in through Leica Biosystems. Danaher expects high-single-digit growth over the long term and accretion in the first full year.',
    flag:'Announced in July 2026, subject to approvals. Not yet in any 10-K or 10-Q.' },

  { co:'Abcam', closed:'Dec 2023', year:2023, ev:5700, evLab:'$5.7B', seg:'ls',
    mult:'7.9× revenue · 22.7× EBITDA', multSrc:'co', multNote:'Both on CY2023. $24.00 per share.',
    prod:'Research antibodies and reagents', prodX:'A branded, direct-sold catalogue of research consumables. On the 2Q26 call management called it “its best quarter since acquisition”.',
    flag:'The highest EBITDA multiple on the list.' },

  { co:'Aldevron', closed:'Aug 2021', year:2021, ev:9600, evLab:'$9.6B', seg:'bio',
    mult:'~32× 2020 revenue', multSrc:'calc', multNote:'$9.6B ÷ ~$300M of 2020 revenue. Danaher published no multiple; the revenue figure is the one in the announcement.',
    prod:'Plasmid DNA, mRNA and proteins', prodX:'GMP-grade inputs for gene and cell therapies and for mRNA vaccines. Bought from EQT at the peak of the post-COVID cycle.',
    flag:'Bought in 2021, when the bioprocessing market was paying multiples that have not come back.' },

  { co:'Cytiva (GE Biopharma)', closed:'Mar 2020', year:2020, ev:21400, evLab:'$21.4B', seg:'bio',
    mult:'~17× 2019E EBITDA', multSrc:'co', multNote:'Danaher\'s own figure. Net price ~$20B after expected tax benefits ⇒ ~6.7× on ~$3.2B of revenue, with ~75% recurring.',
    prod:'Bioprocessing equipment and consumables', prodX:'Chromatography resins, filtration, single-use systems. It is the heart of the Biotechnology segment, and the origin of the resin shipments that slipped into 2027.',
    flag:'The largest deal in Danaher\'s history, and the one that defines the Biotechnology segment.' },

  { co:'Integrated DNA Technologies (IDT)', closed:'Apr 2018', year:2018, ev:2100, evLab:'~$2.1B net of cash', seg:'ls',
    mult:'not disclosed', multSrc:'none', multNote:'IDT was private and published no revenue; the price was not disclosed in the initial announcement either.',
    prod:'Synthetic DNA and oligonucleotides', prodX:'High-value consumables for genomics. Made-to-order oligos for research, diagnostics and therapeutics.',
    flag:'' },

  { co:'Cepheid', closed:'Nov 2016', year:2016, ev:4000, evLab:'~$4.0B', seg:'dx',
    mult:'~6.3–6.5× 2016E revenue', multSrc:'calc', multNote:'~$4.0B ÷ the $618–635M Cepheid was guiding for 2016 (2015 revenue: $539M). $53.00 per share, including debt and net of cash acquired.',
    prod:'Molecular diagnostics — GeneXpert', prodX:'Point-of-care PCR on closed cartridges. This is the business that runs the respiratory tests — the ~$1.6B that is today the largest single swing factor in the guide.',
    flag:'Without this deal there would be no respiratory problem, and no 2020–2022 boom either.' },

  { co:'Pall Corporation', closed:'Aug 2015', year:2015, ev:13800, evLab:'$13.8B', seg:'ls',
    mult:'~18× EBITDA · ~4.9× revenue', multSrc:'calc', multNote:'The EBITDA multiple (~18×) is the one the financial press reported at announcement; the revenue multiple is $13.8B ÷ $2.8B of revenue for the year ended July 2014. $127.20 per share.',
    prod:'Filtration, separation and purification', prodX:'Filtration consumables for biopharma and industry. This is the “applied filtration” business that grew ~10% in 2Q26 on semiconductor microelectronics.',
    flag:'' },

  { co:'Beckman Coulter', closed:'Jun 2011', year:2011, ev:6800, evLab:'~$6.8B EV', seg:'mix',
    mult:'~1.8× revenue', multSrc:'calc', multNote:'~$6.8B of enterprise value ÷ ~$3.7B of annual revenue. $83.50 per share, including assumed debt and net of cash. The announcement gave no EBITDA multiple.',
    prod:'Clinical diagnostics and laboratory instruments', prodX:'Clinical chemistry, immunoassay, haematology and lab automation. Today it is split between Diagnostics and Life Sciences.',
    flag:'The lowest multiple on the list, by a wide margin — a different era and a different kind of asset.' }
];

// ═══ Capital deployed ═════════════════════════════════════════════════════════════════════════
// The `acq` line of the cash flow statement, read through dhr-bottomline.js so it keeps one home.
// FY2026 is the Bloomberg consensus figure, which is essentially the Masimo cheque — it is an
// ESTIMATE and the chart fades it like every other forward bar.
var Y2026E = 9855;

function acqSeries(){
  var years = A.map(function(a){ return a.y; }).concat([2026]);
  var vals  = A.map(function(a){ return a.acq == null ? null : a.acq; }).concat([Y2026E]);
  return { labels: years.map(String), vals: vals, lastAct: A.length - 1 };
}

// ═══ Style ════════════════════════════════════════════════════════════════════════════════════
function style(){
  return '<style>' + [
    '.dma .dma-lede{font-size:12.5px;line-height:1.65;color:var(--mu);margin:0 0 18px}',
    '.dma .dma-lede b{color:var(--navy)}',
    '.dma .ov-sec-h{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);margin:26px 0 10px;display:flex;align-items:center;gap:9px}',
    '.dma .ov-sec-h:first-child{margin-top:0}',
    '.dma .ov-sec-h::after{content:"";flex:1;height:1px;background:var(--bdr)}',
    '.dma .dma-sub{font-size:11.5px;color:var(--mu);line-height:1.6;margin:0 0 12px}',
    '.dma .dma-strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:9px;margin:0 0 18px}',
    '.dma .dma-tile{border:1px solid var(--bdr);border-radius:11px;padding:11px 13px;background:var(--w)}',
    '.dma .dma-tv{font-size:20px;font-weight:800;color:var(--navy);line-height:1.15;letter-spacing:-.01em}',
    '.dma .dma-tl{font-size:9.5px;font-weight:800;letter-spacing:.045em;text-transform:uppercase;color:var(--mu);margin-top:5px;line-height:1.4}',
    '.dma .dma-tn{font-size:10.5px;color:var(--mu);margin-top:5px;line-height:1.5}',
    '.dma .dma-filter{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 12px}',
    '.dma .dma-fl{font-size:9.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu);margin-right:3px}',
    '.dma .dma-chip{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--bdr);background:#fff;border-radius:999px;padding:5px 12px;cursor:pointer;font:inherit;font-size:11px;font-weight:800;color:var(--navy);transition:.13s}',
    '.dma .dma-chip:hover{border-color:' + BRAND + '}',
    '.dma .dma-chip.off{opacity:.4}',
    '.dma .dma-dot{width:9px;height:9px;border-radius:3px;flex:none}',
    '.dma .dma-deal{border:1px solid var(--bdr);border-left:3px solid var(--bdr);border-radius:11px;padding:13px 15px;margin-bottom:9px;background:var(--w)}',
    '.dma .dma-deal[hidden]{display:none}',
    '.dma .dma-dh{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:3px}',
    '.dma .dma-dn{font-size:14px;font-weight:800;color:var(--navy)}',
    '.dma .dma-dd{font-size:10px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--mu)}',
    '.dma .dma-seg{font-size:8.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;border-radius:999px;padding:2px 8px;color:#fff}',
    '.dma .dma-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin-top:10px}',
    '.dma .dma-f{border-top:1px solid var(--bdr);padding-top:8px}',
    '.dma .dma-fk{font-size:9px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:' + GRAY + ';margin-bottom:4px}',
    '.dma .dma-fv{font-size:12.5px;font-weight:800;color:var(--navy);line-height:1.35}',
    '.dma .dma-fx{font-size:10.5px;color:var(--mu);line-height:1.55;margin-top:4px}',
    '.dma .dma-fx b{color:var(--navy)}',
    '.dma .dma-prov{font-size:8px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;border-radius:999px;padding:1px 6px;margin-left:6px;white-space:nowrap;vertical-align:middle}',
    '.dma .dma-prov.co{color:' + GREEN + ';background:rgba(46,139,87,.10);border:1px solid rgba(46,139,87,.30)}',
    '.dma .dma-prov.calc{color:' + AMBER + ';background:rgba(183,121,31,.10);border:1px solid rgba(183,121,31,.30)}',
    '.dma .dma-prov.none{color:' + GRAY + ';background:#F2F5F8;border:1px solid var(--bdr)}',
    '.dma .dma-flag{font-size:11px;color:var(--navy);background:rgba(15,125,194,.055);border:1px solid rgba(15,125,194,.22);border-radius:8px;padding:7px 10px;margin-top:10px;line-height:1.55}',
    '.dma .dma-legend{font-size:10.5px;color:var(--mu);line-height:1.65;margin:0 0 14px}',
    '.dma .dma-foot{font-size:10.5px;color:' + GRAY + ';line-height:1.6;margin-top:20px;padding-top:12px;border-top:1px solid var(--bdr)}',
    '.dma .dma-none{font-size:11.5px;color:' + GRAY + ';font-style:italic;padding:14px 0}'
  ].join('') + '</style>';
}

var PROV = { co:['company-stated','co'], calc:['derived here','calc'], none:['not disclosed','none'] };

function dealCard(d){
  var s = SEG[d.seg];
  var h = '<div class="dma-deal" data-dmadeal="' + d.seg + '" style="border-left-color:' + s.c + '">' +
    '<div class="dma-dh"><span class="dma-dn">' + esc(d.co) + '</span>' +
    '<span class="dma-seg" style="background:' + s.c + '">' + esc(s.n) + '</span>' +
    '<span class="dma-dd">' + esc(d.closed) + '</span></div>' +
    '<div class="dma-grid">' +
      '<div class="dma-f"><div class="dma-fk">Price</div><div class="dma-fv">' + esc(d.evLab) + '</div></div>' +
      '<div class="dma-f"><div class="dma-fk">Multiple paid</div><div class="dma-fv">' + esc(d.mult) +
        '<span class="dma-prov ' + PROV[d.multSrc][1] + '">' + PROV[d.multSrc][0] + '</span></div>' +
        (d.multNote ? '<div class="dma-fx">' + d.multNote + '</div>' : '') + '</div>' +
      '<div class="dma-f"><div class="dma-fk">What it makes</div><div class="dma-fv">' + esc(d.prod) + '</div>' +
        '<div class="dma-fx">' + d.prodX + '</div></div>' +
    '</div>';
  if (d.flag) h += '<div class="dma-flag">' + d.flag + '</div>';
  return h + '</div>';
}

export function dhrMandaHtml(){
  if (!A || !A.length) return '';                    // rule 6 — nothing, never broken
  var total = A.reduce(function(t, a){ return t + (a.acq || 0); }, 0) + Y2026E;
  return style() + '<div class="dma">' +
    '<p class="dma-lede"><b>Danaher is an acquirer before it is anything else</b>, and its income statement only makes sense read that way: the ~$1.9B of annual intangible amortisation that separates GAAP from adjusted earnings is the accumulated price of this table. These are the <b>nine platform deals</b> — not all of them: Danaher has done scores of smaller acquisitions that the 10-Ks disclose only in aggregate, with no name, no price and no multiple. Those live in the chart, which is where they are the bars they actually were.</p>' +

    '<div class="dma-strip">' +
      '<div class="dma-tile"><div class="dma-tv">$' + (total / 1000).toFixed(1) + 'B</div><div class="dma-tl">Cash on acquisitions, 2016–2026E</div><div class="dma-tn">From the cash flow statement, not from announced prices.</div></div>' +
      '<div class="dma-tile"><div class="dma-tv">9</div><div class="dma-tl">Platform deals</div><div class="dma-tn">2011 to today. One is still pending.</div></div>' +
      '<div class="dma-tile"><div class="dma-tv">$21.4B</div><div class="dma-tl">The largest — Cytiva, 2020</div><div class="dma-tn">It defines the entire Biotechnology segment.</div></div>' +
      '<div class="dma-tile"><div class="dma-tv">~1.8× → ~32×</div><div class="dma-tl">Range of revenue multiples</div><div class="dma-tn">Beckman in 2011 against Aldevron in 2021. They are not comparable with each other.</div></div>' +
      '<div class="dma-tile"><div class="dma-tv">$22.2B</div><div class="dma-tl">Net debt at Jun 2026</div><div class="dma-tn">From $13.8B before Masimo. ~2.5× net debt/EBITDA.</div></div>' +
      '<div class="dma-tile"><div class="dma-tv">~$1.9B</div><div class="dma-tl">Resulting annual amortisation</div><div class="dma-tn">FY2026 guide. It is the accounting bill for everything above.</div></div>' +
    '</div>' +

    '<div class="ov-sec-h">Cash deployed on acquisitions, by year</div>' +
    '<p class="dma-sub">This is the <i>Acquisitions of businesses</i> line of the cash flow statement, so it also picks up the small deals that have no card below: <b>2022</b> is seven businesses for $582M and <b>2024</b> is three for $558M, unnamed in the filing. Pall (2015) falls outside the chart because the series starts in 2016. <b>2025 was zero</b> — the only blank year of the decade, immediately before Masimo.</p>' +
    dStdScaffold({ id:'dhrAcq', title:'Cash paid for acquisitions ($M)', height:300,
      metricSel:[{ v:'acq', label:'Cash paid for acquisitions', on:true }],
      presets:[['all','All'],['l5','Last 5'],['big','Platform years only']],
      note:'FY2016–FY2025 from Danaher\'s cash flow statement, net of cash acquired. <b>FY2026 is an estimate</b> (Bloomberg consensus), and it is essentially the Masimo cheque.' }) +

    '<div class="ov-sec-h">The platform deals</div>' +
    '<p class="dma-legend"><b>On the multiple column</b>, which is the one to read carefully. ' +
      '<span class="dma-prov co">company-stated</span> Danaher gave the multiple in the announcement. ' +
      '<span class="dma-prov calc">derived here</span> announced enterprise value divided by a revenue figure the announcement itself gives — the arithmetic is written out so it can be checked. ' +
      '<span class="dma-prov none">not disclosed</span> neither disclosed nor derivable, and left empty rather than estimated. ' +
      'Multiples from different years are <b>not comparable with each other</b>: 2011 and 2021 are two different markets.</p>' +
    '<div class="dma-filter"><span class="dma-fl">Segment</span>' +
      Object.keys(SEG).map(function(k){
        return '<button type="button" class="dma-chip" data-dmaseg="' + k + '"><span class="dma-dot" style="background:' + SEG[k].c + '"></span>' + esc(SEG[k].n) + '</button>';
      }).join('') + '</div>' +
    '<div id="dmaDeals">' + DEALS.map(dealCard).join('') + '</div>' +
    '<div class="dma-none" id="dmaNone" hidden>No segment selected — switch at least one back on.</div>' +

    '<p class="dma-foot">Prices and dates: Danaher and target-company announcements, plus the corresponding 8-K/10-K filings (SEC EDGAR, CIK 0000313616). Cash series: consolidated statement of cash flows, FY2016–FY2025. Every multiple carries its provenance one by one; none is estimated.</p>' +
  '</div>';
}

// ═══ Init ═════════════════════════════════════════════════════════════════════════════════════
function acqDerive(st){
  var s = acqSeries(), n = s.labels.length;
  var pr = st.range || 'all', lo = 0, hi = n - 1;
  if (pr === 'l5') lo = Math.max(0, n - 5);
  st.win = (st.win && st.win[0] >= lo && st.win[1] <= hi) ? st.win : [lo, hi];
  var vals = s.vals.slice();
  if (pr === 'big') vals = vals.map(function(v){ return (v != null && v >= 2000) ? v : null; });
  return {
    labels: s.labels.slice(), lastAct: s.lastAct,
    series: [{ k:'acq', grp:'acq', src:'Cash on acquisitions', label:'Cash paid for acquisitions ($M)', color:D_ACT, type:'bar', data:vals }],
    yFmt: function(v){ return '$' + Math.round(v).toLocaleString('en-US') + 'M'; },
    tblTitle:'Data — what the chart draws',
    legNote:'The pale bar (FY2026) is an estimate.'
  };
}

export function dhrMandaInit(pane){
  var root = pane && pane.querySelector ? pane.querySelector('.dma') : null;
  if (!root) return;
  dStdRender('dhrAcq', acqDerive, root);
  if (root._dmaWired) return;
  root._dmaWired = true;
  dWireTables(root);
  var off = {};
  root.addEventListener('click', function(e){
    var b = e.target.closest ? e.target.closest('[data-dmaseg]') : null;
    if (!b || !root.contains(b)) return;
    var k = b.getAttribute('data-dmaseg');
    off[k] = !off[k];
    b.classList.toggle('off', !!off[k]);
    var shown = 0;
    root.querySelectorAll('[data-dmadeal]').forEach(function(d){
      var hide = !!off[d.getAttribute('data-dmadeal')];
      d.hidden = hide; if (!hide) shown++;
    });
    // rule 6 again — an empty list says so rather than rendering as a blank gap.
    var none = root.querySelector('#dmaNone'); if (none) none.hidden = shown > 0;
  });
}
