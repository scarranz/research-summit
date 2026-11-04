// overviews/tpl-track.js — Texas Pacific Land Deep Dive ▸ Management ▸ Track Record (MG-TRACK, playbook §15).
//
// Card layout COPIED from js/overviews/googl-track.js (itself tsm-mgmt.js → sharkninja-mgmt.js → amzn.js), on the
// shared .trk-* CSS. Ratings are PROPOSED here (Claude proposes, the analyst rates — playbook §15): a labelled
// editorial line on each card and a thin left rule in a Summit state token, as uber-track.js first did. SAB dropped
// the ratings for GOOGL (Oct 26 2026) and UBER (Nov 3 2026); if he drops them here too, set SHOW_RATINGS = false —
// nothing else depends on them. The rating field is `rate`; the company-record field is `at` (no ticker-named field, A28).
// Leaders = the four with a disclosed record in the filings: CEO, CFO, General Counsel and the head of the water business.
// Roles and dates: TPL 2026 proxy statement (DEF 14A, filed Sep 25 2026). Outcomes: reported figures — Texas Pacific
// Land Trust Forms 10-K FY2017 / FY2019 (2016–2019), TPL Form 10-K FY2025 (2023–2025), Form 10-K FY2023 (legal fees,
// the Horizon Kinetics case); dividends and buybacks from the cash-flow statements.
// `at` / `prior` / `detail` are HTML (<b>, <p>). Modal: data-detail="tpltrk:<id>" (the host's wireModal → tplTrackPop).
import { SUMMIT_POS, SUMMIT_CAT } from '../viz-palette.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var SHOW_RATINGS = false;   // off by default, as SAB decided for GOOGL (Oct 26) and UBER (Nov 3); confirm for TPL
var RATE = { green:{ c:SUMMIT_POS, l:'Value creator' }, amber:{ c:SUMMIT_CAT[3], l:'Mixed / unproven' } };

var TRACK = [
  { id:'glover', n:'Tyler Glover', role:'President & Chief Executive Officer', since:'2014', rate:'green',
    at:'CEO of the Trust from November 2016 and of the corporation since January 2021. Revenue went from <b>$59.9M (2016) to $798.2M (2025)</b> and net income from <b>$42.3M to $481.4M</b>; the water business he set up in 2017 had <b>$307.5M</b> of revenue in 2025. TPL has no debt.',
    prior:'Assistant General Agent of the Trust from December 2014; more than 17 years in energy services and land management (2026 proxy).',
    detail:'<p><b>At TPL (joined December 2014).</b> Assistant General Agent of the Trust; Chief Executive Officer, Co-General Agent and Secretary from November 2016; President and CEO of the corporation and a director since the conversion on January 11, 2021; President and CEO of Texas Pacific Water Resources since its formation in June 2017.</p>'+
      '<p><b>Outcomes in the filings.</b> Revenue $59.9M (2016, as reported) → $798.2M (2025); net income $42.3M → $481.4M; cash from operations $545.9M in 2025. Water Services and Operations: $307.5M of revenue and $159.0M of segment net income in 2025. Capital returned 2018–2025: $1.21B of dividends and $230M of buybacks. Acquisitions stepped up in 2024–25 ($395.6M and $454.2M of royalty interests), and a $50.0M minority investment in Bolt (data centers) in December 2025.</p>'+
      '<p><b>Net read (editorial) — value creator.</b> The growth rests largely on Permian activity on land TPL has owned since 1888, but the decisions that are his — building a water business from nothing, the conversion, keeping the balance sheet debt-free — show in the numbers. The caveat: his whole record is in one basin and one long up-cycle.</p>' },
  { id:'steddum', n:'Chris Steddum', role:'Chief Financial Officer', since:'2019', rate:'amber',
    at:'CFO since June 2021. The years of large returns of capital — a <b>$3.33 special dividend</b> in 2024 and a <b>$250M</b> buyback program from January 2023 — then a turn to acquisitions (<b>$454.2M</b> of royalty interests in 2025) and a first, undrawn <b>$500M</b> credit facility (October 2025).',
    prior:'Vice President, Finance and Investor Relations of the Trust and TPL from 2019; 10 years of oil and gas investment banking, latterly a Director at Stifel (2016–19) and GMP Securities (2014–16) (2026 proxy).',
    detail:'<p><b>At TPL (joined 2019).</b> Vice President, Finance and Investor Relations of the Trust and then of TPL; CFO since June 1, 2021.</p>'+
      '<p><b>Outcomes in the filings.</b> Dividends paid $85.3M (2021), $247.3M (2022), $100.0M (2023), $347.3M (2024, including the special) and $147.8M (2025); buybacks $87.8M (2022) falling to $8.4M (2025) and none in 1H26. A stated cash target of about $700M, above which most free cash flow goes to special dividends or buybacks (10-K FY2025). Cash, cash equivalents and restricted cash fell from $730.5M (end-2023) to $145.4M (end-2025) after the acquisitions.</p>'+
      '<p><b>Net read (editorial) — mixed / unproven.</b> A clean, conservative balance sheet and a written capital-return policy; but this is his first CFO role, and the shift from returning cash to buying royalties and investing in Bolt is too recent to judge.</p>' },
  { id:'dobbs', n:'Micheal W. Dobbs', role:'SVP, Secretary & General Counsel', since:'2020', rate:'amber',
    at:'General Counsel through the dispute with Horizon Kinetics and SoftVest over the 2020 Stockholders’ Agreement: TPL sued in November 2022 and won in the Court of Chancery (December 1, 2023) and the Delaware Supreme Court (February 26, 2024). Legal and professional fees were <b>$31.5M</b> in 2023, against $8.7M in 2022.',
    prior:'Equity partner at Kelley Drye &amp; Warren LLP and managing partner of its Houston office (2026 proxy).',
    detail:'<p><b>At TPL (joined August 2020).</b> Senior Vice President and General Counsel of the Trust from August 2020; SVP, Secretary and General Counsel since January 11, 2021; the company’s chief compliance officer, reporting to the CEO.</p>'+
      '<p><b>Outcomes in the filings.</b> The courts ruled that the Investor Group’s shares were deemed voted for the 2022 proposal to raise the authorized shares, which was then deemed approved (8-K/A, Feb 28 2024); the charter was amended on March 1, 2024 and the 3-for-1 split followed on March 26, 2024. The 2023 increase in legal and professional fees was "principally related to legal expenses associated with stockholder matters" (10-K FY2023).</p>'+
      '<p><b>Net read (editorial) — mixed / unproven.</b> A legal role without a stand-alone financial outcome: the case was won, at a visible cost.</p>' },
  { id:'crain', n:'Robert A. Crain', role:'Executive Vice President, Texas Pacific Water Resources', since:'2017', rate:'green',
    at:'Has run the water business since its formation in June 2017. In 2025 Water Services and Operations had <b>$307.5M</b> of revenue — water sales $169.7M, produced-water royalties $124.2M — and <b>$159.0M</b> of segment net income, a record year.',
    prior:'Water Resources Manager at EOG Resources (2015–17), leading water resource development across the Permian and the Eagle Ford (2026 proxy).',
    detail:'<p><b>At TPL (joined June 2017).</b> Executive Vice President of Texas Pacific Water Resources, named in the proxy as a significant employee.</p>'+
      '<p><b>Outcomes in the filings.</b> Water sales $150.7M (2024) → $169.7M (2025); produced-water royalties $104.1M → $124.2M. A desalination test facility (10,000 barrels a day) was under construction for a first-half-2026 start, with $45.5M spent through 2025 (10-K FY2025).</p>'+
      '<p><b>Net read (editorial) — value creator.</b> The segment did not exist before 2017 and is now more than a third of revenue; the desalination bet is not yet proven.</p>' },
];
var BENCH = 'A small team that grew up inside the old Trust: the CEO, CFO, General Counsel and Chief Accounting Officer all joined between 2014 and 2020, and the water business is run by the person who built it. The record is one basin and one long up-cycle; the team has not yet run TPL through a sustained Permian slowdown as a corporation, and the move into acquisitions and data-center investment is new.';
var FOOT = 'Roles and dates: TPL 2026 proxy statement (DEF 14A, filed Sep 25 2026, acc. 0001104659-26-110963), Executive Officers and Significant Employees. Outcomes: Texas Pacific Land Trust Form 10-K FY2017 (2016 revenue $59.9M as reported) and XBRL financial data for 2016–2019 (net income); TPL Form 10-K FY2025 (filed Feb 18 2026) for 2023–2025 revenue, segment results, cash flows, the cash target and the desalination project; Form 10-K FY2023 (filed Feb 21 2024) for legal fees and the Horizon Kinetics case; Forms 8-K of Feb 27 2024 and 8-K/A of Feb 28 2024 for the court rulings; Form 10-Q for 2Q26 (filed Aug 5 2026) for 1H26 buybacks. Dividends and buybacks 2018–2025 from the cash-flow statements. Ratings are an editorial read, not a Summit output.';

function cardHtml(m){
  var r = SHOW_RATINGS ? RATE[m.rate] : null;
  return '<div class="ov-clickable trk-card" data-detail="tpltrk:'+esc(m.id)+'"'+(r?' style="border-left-color:'+r.c+'"':'')+'>'+
    '<div class="trk-n">'+esc(m.n)+'</div>'+
    '<div class="trk-r">'+esc(m.role)+' · at TPL since '+esc(m.since)+'</div>'+
    (r?'<div class="trk-t"><b class="trk-c">Editorial rating:</b> '+esc(r.l)+'</div>':'')+
    '<div class="trk-t"><b class="trk-k">At TPL:</b> '+m.at+'</div>'+
    '<div class="trk-t"><b class="trk-c">Context:</b> '+m.prior+'</div>'+
    '<div class="trk-more">Full track record ›</div></div>';
}
function legendHtml(){
  if(!SHOW_RATINGS) return '';
  return '<div class="trk-r">Rating: '+['green','amber'].map(function(k){ var r=RATE[k];
    return '<span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:'+r.c+';margin:0 5px 0 10px;vertical-align:0"></span>'+esc(r.l); }).join('')+'</div>';
}

export function tplTrackBody(){
  var h='<p class="ov-lede">The people running TPL today, on <b>what they have actually built</b> — roles from the proxy, outcomes from the reported numbers. <b>Tap a card</b> for the full history.</p>';
  h+=legendHtml();
  h+='<div class="trk-grid">'+TRACK.map(cardHtml).join('')+'</div>';
  h+='<div class="ew-note"><b>The bench, in one line.</b> '+BENCH+'</div>';
  h+='<div class="ov-foot">'+FOOT+'</div>';
  return h;
}
export function tplTrackPop(id){
  var m=TRACK.filter(function(x){ return x.id===id; })[0]; if(!m) return null;
  var d=String(m.detail||''); if(!SHOW_RATINGS) d=d.replace(/<p><b>Net read[\s\S]*?<\/p>/g, '');
  return { t:esc(m.n)+' <span class="trk-pop-r">'+esc(m.role)+' · at TPL since '+esc(m.since)+'</span>', h:d };
}
