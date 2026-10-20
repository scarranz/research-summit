// overviews/meta-comp.js — Meta Deep Dive ▸ Miscellaneous ▸ Competitive Position (MISC-comp, playbook §15b).
//
// Answers “why don’t they take Meta’s place?” with evidence, not a verdict (no scores, no severity ratings):
//   1. lede — the moat thesis, consistent with Overview OV-3 “The edge”
//   2. the challenges to the moat — one table row per challenge: evidence it is real · evidence the moat holds
//   3. competitors — the business, not the valuation (reported FY2025 figures; rule 10: no market data)
//   4. the closed loop — where the ad dollar goes (illustrative open-web split + a step-through, formal)
//   5. market size — approximate sizing (marked unsourced) + the surfaces Meta has not sized
//   6. one source footer (§22)
// Absorbs the earlier panes moatBody · unitEconBody (+ flowHtml/wireFlow) · industryBody · tamBody of meta.js.
// Data: ./meta-comp-data.js. Styles: css/overview.css, block “Meta ▸ Miscellaneous ▸ Competitive Position”.

import { COMP_ASOF, COMP_ROWS, COMP_CHALLENGES, AD_SPLIT, AD_PUB_KEEPS, TAM_ROWS, TAM_NEW } from './meta-comp-data.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
var NIL = '<span class="rs-ft-nil">—</span>';
function money(m){ if(m==null) return NIL; if(m>=1000) return '$'+(m/1000).toFixed(1)+'B'; if(m>=1) return '$'+Math.round(m)+'M'; return '$'+m.toFixed(1)+'M'; }
function pct(v){ return v==null ? NIL : (v<0?'−':'')+Math.abs(v).toFixed(1)+'%'; }
function growth(v){ if(v==null) return NIL; if(Math.abs(v)<0.05) return '0.0%'; return (v>0?'▲ ':'▼ ')+Math.abs(v).toFixed(1)+'%'; }
function median(a){ var s=a.slice().sort(function(x,y){ return x-y; }), n=s.length; if(!n) return null; return n%2 ? s[(n-1)/2] : (s[n/2-1]+s[n/2])/2; }
function mean(a){ if(!a.length) return null; var t=0; a.forEach(function(v){ t+=v; }); return t/a.length; }

// ── 2. Challenges ───────────────────────────────────────────────────────────
function challengesHtml(){
  var h='<div class="twrap mcp-wrap"><table class="rt mcp-tbl mcp-chal"><thead><tr>'+
    '<th>Challenge</th><th>Evidence it is real</th><th>Evidence the moat holds</th><th>Source</th></tr></thead><tbody>';
  h+=COMP_CHALLENGES.map(function(r){
    return '<tr><td class="mcp-c">'+esc(r.c)+'</td><td>'+esc(r.real)+'</td><td>'+esc(r.holds)+'</td><td class="mcp-src">'+esc(r.src)+'</td></tr>';
  }).join('');
  h+='</tbody></table></div>';
  h+='<div class="ov-fynote">† From the Q2 2026 call record, which is reconstructed from press coverage of the Jul 29 2026 call (the verbatim transcript is not yet on file); its figures were cross-checked against the 8-K Ex. 99.1 release.</div>';
  return h;
}

// ── 3. Competitors ──────────────────────────────────────────────────────────
function compRowHtml(r){
  var cls = r.me ? 'mcp-me' : (r.sub ? 'mcp-sub' : (r.priv ? 'mcp-priv' : ''));
  var name = r.sub ? esc(r.n) : '<b>'+esc(r.n)+'</b>'+(r.tk?' <span class="mcp-tk">'+esc(r.tk)+'</span>':'');
  var users = r.u && r.u!=='—' ? '<b>'+esc(r.u)+'</b>' : NIL;
  if(r.ud) users += '<span class="mcp-def">'+esc(r.ud)+'</span>';
  return '<tr class="'+cls+'"><td class="mcp-name">'+name+'</td><td class="mcp-rl">'+esc(r.rl)+'</td>'+
    '<td class="mcp-num">'+money(r.rev)+'</td><td class="mcp-num">'+growth(r.g)+'</td><td class="mcp-num">'+pct(r.om)+'</td>'+
    '<td class="mcp-num">'+money(r.capex)+'</td><td class="mcp-num">'+pct(r.rd)+'</td>'+
    '<td class="mcp-users">'+users+'</td><td class="mcp-vs">'+(r.vs&&r.vs!=='—'?esc(r.vs):NIL)+'</td><td class="mcp-src">'+esc(r.src)+'</td></tr>';
}
function compStatsHtml(){
  // Average and median over the listed companies, excluding Meta, Alphabet’s segment lines and the private row (§18).
  var peers = COMP_ROWS.filter(function(r){ return !r.me && !r.sub && !r.priv; });
  function col(k){ return peers.map(function(r){ return r[k]; }).filter(function(v){ return v!=null; }); }
  function cells(fn){ return '<td class="mcp-num">'+growth(fn(col('g')))+'</td><td class="mcp-num">'+pct(fn(col('om')))+'</td><td></td><td class="mcp-num">'+pct(fn(col('rd')))+'</td>'; }
  return '<tr class="mcp-stat"><td colspan="3">Average, listed peers (excl. Meta)</td>'+cells(mean)+'<td colspan="3"></td></tr>'+
         '<tr class="mcp-stat"><td colspan="3">Median, listed peers (excl. Meta)</td>'+cells(median)+'<td colspan="3"></td></tr>';
}
function competitorsHtml(){
  // Order: by revenue line, largest first; segment lines stay under their company; the private row last.
  var tops = COMP_ROWS.filter(function(r){ return !r.sub && !r.priv; }).sort(function(a,b){ return (b.rev||0)-(a.rev||0); });
  var rows = [];
  tops.forEach(function(r){
    rows.push(r);
    if(r.tk==='GOOGL') COMP_ROWS.forEach(function(s){ if(s.sub) rows.push(s); });
  });
  COMP_ROWS.forEach(function(r){ if(r.priv) rows.push(r); });
  var h='<div class="twrap mcp-wrap"><table class="rt mcp-tbl mcp-peers"><thead><tr>'+
    '<th>Company</th><th>Revenue line</th><th class="mcp-num">FY2025</th><th class="mcp-num">Growth</th>'+
    '<th class="mcp-num">Op. margin</th><th class="mcp-num">Capex</th><th class="mcp-num">R&amp;D % rev.</th>'+
    '<th>Users, as reported</th><th>Competes with Meta for</th><th>Source</th></tr></thead><tbody>';
  h+=rows.map(compRowHtml).join('')+compStatsHtml();
  h+='</tbody></table></div>';
  h+='<div class="ov-fynote">Revenue and growth are the advertising line where a company reports one (Alphabet, Amazon, Snap, Meta); '+
     'operating margin, capex (purchases of property and equipment) and R&amp;D are company-wide. Meta’s own capex definition, including finance-lease principal, was $72.2B. '+
     'Amazon reports “Technology and infrastructure”, not R&amp;D. User counts follow each company’s own definition and are not comparable. '+
     'Market share is not shown: no primary or official source states it. “Competes with Meta for” is Summit’s read, not a reported figure.</div>';
  return h;
}

// ── 4. The closed loop ──────────────────────────────────────────────────────
var LOOP_STEPS = [
  { row:0, cap:'An advertiser commits $1.00 to win one ad impression.' },
  { row:1, cap:'Open web: the DSP, the software advertisers buy through, keeps about $0.15.' },
  { row:2, cap:'The ad exchange that runs the auction keeps about $0.10.' },
  { row:3, cap:'The SSP, the software publishers sell through, keeps about $0.20.' },
  { row:4, cap:'The publisher showing the ad receives about $0.55 of the original dollar.' },
  { row:-1, cap:'Inside Meta every layer is Meta’s own — the buying tool, the auction, the inventory and the measurement — so nearly the whole $1.00 stays.' },
];
function loopHtml(){
  var rows=[['Advertiser pays','$1.00','$1.00 — the same dollar']];
  var meta={ dsp:'Meta’s buying tools (Ads Manager)', exch:'Meta’s own auction', ssp:'Meta sells its own inventory' };
  AD_SPLIT.forEach(function(s){ rows.push([s.l, '−$'+s.take.toFixed(2), meta[s.k]+' — kept']); });
  rows.push(['Publisher receives', '$'+AD_PUB_KEEPS.toFixed(2), '≈ $1.00 stays with Meta']);
  var h='<div class="mcp-loop" data-mcp-loop>';
  h+='<div class="twrap mcp-wrap"><table class="rt mcp-tbl mcp-loop-tbl"><thead><tr><th>Layer</th><th class="mcp-num">Open web</th><th>Inside Meta</th></tr></thead><tbody>'+
     rows.map(function(r,i){ return '<tr data-mcp-row="'+i+'"><td>'+esc(r[0])+'</td><td class="mcp-num">'+esc(r[1])+'</td><td class="mcp-in">'+esc(r[2])+'</td></tr>'; }).join('')+
     '</tbody></table></div>';
  h+='<div class="mcp-step"><span class="mcp-step-n" data-mcp-n>Step 1 of '+LOOP_STEPS.length+'</span><span class="mcp-step-cap" data-mcp-cap>'+esc(LOOP_STEPS[0].cap)+'</span>'+
     '<span class="mcp-step-ctl"><button type="button" class="mcp-btn" data-mcp-act="prev">Prev</button>'+
     '<button type="button" class="mcp-btn" data-mcp-act="next">Next</button>'+
     '<button type="button" class="mcp-btn" data-mcp-act="play">Play</button></span></div>';
  h+='</div>';
  h+='<div class="ov-fynote">The open-web split is illustrative — typical ad-tech take rates from Summit’s ad-ecosystem primer, not a measured figure; the point is structural. '+
     'Measured: the Family of Apps earned a 52% operating margin in 2025 against 41% consolidated; the gap is Reality Labs’ $19.2B operating loss (10-K FY2025).</div>';
  return h;
}

// ── 5. Market size ──────────────────────────────────────────────────────────
function tamHtml(){
  var h='<div class="mcp-bars">'+TAM_ROWS.map(function(r){
    return '<div class="mcp-bar-row"><div class="mcp-bar-l">'+esc(r.l)+(r.src?'':' <span class="mcp-tag">approx., unsourced</span>')+'</div>'+
      '<div class="mcp-bar-t"><div class="mcp-bar-f'+(r.src?' mcp-bar-src':'')+'" style="width:'+r.pct+'%"></div></div>'+
      '<div class="mcp-bar-v">'+esc(r.v)+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-fynote">The global and digital figures are approximate sizing carried from the earlier profile; no primary document is behind them, so no market share is derived from them. Meta’s bar is the 10-K figure, drawn on the same scale.</div>';
  h+='<div class="twrap mcp-wrap mcp-gap"><table class="rt mcp-tbl"><thead><tr><th>Surface not yet sized in dollars</th><th>What Meta has disclosed</th><th>Source</th></tr></thead><tbody>'+
     TAM_NEW.map(function(r){ return '<tr><td class="mcp-c">'+esc(r.s)+'</td><td>'+esc(r.f)+'</td><td class="mcp-src">'+esc(r.src)+'</td></tr>'; }).join('')+
     '</tbody></table></div>';
  return h;
}

export function metaCompBody(){
  var h='';
  h+='<p class="ov-lede">Meta’s edge is a closed loop: it owns the apps, the auction and the measurement, so it keeps nearly the whole ad dollar and ranks ads with AI trained on 3.58B people’s activity. '+
     'Below, the serious challenges to that loop, each with the evidence on both sides, and the competitors’ businesses side by side.</p>';
  h+='<div class="ov-sec-h">The challenges to the moat</div>'+challengesHtml();
  h+='<div class="ov-sec-h mg-sec-gap">Competitors — the business, not the valuation</div>'+competitorsHtml();
  h+='<div class="ov-sec-h mg-sec-gap">The closed loop — where the ad dollar goes</div>'+loopHtml();
  h+='<div class="ov-sec-h mg-sec-gap">Market size</div>'+tamHtml();
  h+='<div class="ov-foot">Sources — Meta Form 10-K FY2025 (Item 1 Competition, Item 1A, MD&amp;A, segment results, legal-proceedings note; filed Jan 29 2026); '+
     'Meta earnings calls Q3 2025 (Oct 29 2025), Q4 2025 (Jan 28 2026), Q1 2026 (Apr 29 2026); Q2 2026 earnings release (8-K Ex. 99.1, Jul 29 2026) and call record (reconstructed from press, marked †); '+
     'Form 10-K FY2025 of Alphabet, Amazon, Snap, Pinterest, Reddit, AppLovin and The Trade Desk (SEC EDGAR; company-wide figures from XBRL company facts, advertising lines and user counts from the filing text) — '+esc(COMP_ASOF)+'. '+
     'The open-web split of $1.00 is illustrative (Summit ad-ecosystem primer); global and digital ad-market sizes are approximate and unsourced. All figures reported; nothing estimated, no market data.</div>';
  return h;
}

// Step-through of the closed-loop table (no emoji, no animation beyond the row highlight).
export function metaCompInit(root){
  var sp=(root||document).querySelector('.ov-meta-dd .ovt-subpane[data-ovst="comp"]'); if(!sp) return;
  var box=sp.querySelector('[data-mcp-loop]'); if(!box || box._mcpWired) return; box._mcpWired=true;
  var idx=0, timer=null, playBtn=box.querySelector('[data-mcp-act="play"]');
  function apply(i){ idx=i; var s=LOOP_STEPS[i];
    box.querySelectorAll('tr[data-mcp-row]').forEach(function(tr){ var r=+tr.getAttribute('data-mcp-row');
      tr.classList.toggle('mcp-on', s.row===-1 ? false : r===s.row);
      tr.classList.toggle('mcp-in-on', s.row===-1); });
    box.querySelector('[data-mcp-n]').textContent='Step '+(i+1)+' of '+LOOP_STEPS.length;
    box.querySelector('[data-mcp-cap]').textContent=s.cap; }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } if(playBtn) playBtn.textContent='Play'; }
  function play(){ if(timer){ stop(); return; } if(idx>=LOOP_STEPS.length-1) apply(0); playBtn.textContent='Pause';
    timer=setInterval(function(){ if(idx>=LOOP_STEPS.length-1 || !sp.offsetParent){ stop(); return; } apply(idx+1); }, 2400); }
  box.addEventListener('click', function(e){ var b=e.target.closest&&e.target.closest('[data-mcp-act]'); if(!b) return;
    var a=b.getAttribute('data-mcp-act');
    if(a==='play') play();
    else { stop(); apply(a==='prev' ? Math.max(0, idx-1) : Math.min(LOOP_STEPS.length-1, idx+1)); } });
  apply(0);
}
