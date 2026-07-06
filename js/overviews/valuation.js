// overviews/valuation.js — shared "Scenario → price target" calculator for the
// gig-marketplace names (UBER / LYFT / CART). Config-driven: each company builds one
// instance via makeValuation(cfg) and wires it as a "Valuation" sub-tab.
//
// Model (one forward scenario off the last reported year, FY2025 actuals):
//   segment revenue_i = GrossBookings/GTV_i × (1 + growth_i) × take_i
//   revenue           = Σ revenue_i
//   adj. EBITDA       = revenue × margin
//   Enterprise value  = EV/EBITDA multiple × EBITDA
//   equity value      = EV + net cash                        // net cash < 0 ⇒ net debt
//   implied price     = equity value ÷ diluted shares
//
// Fundamentals (segment GB/GTV, take, EBITDA, DCF forward, shares) are Summit DCF
// actuals/estimates. The Summit model carries NO balance sheet or share price, so
// net cash and the current price are EDITABLE inputs. Each driver carries a hover hint
// (historical distribution + guidance) so the case can be modelled with reference.
// Defaults reproduce the Summit DCF FY2026E case.

function vEsc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function vB(m){ if(m==null||isNaN(m)) return '—'; var a=Math.abs(m); return '$'+(m/1000).toFixed(a>=10000?1:2)+'B'; }
function vPx(p){ if(p==null||isNaN(p)) return '$—'; return '$'+p.toFixed(2); }
function vPct1(x){ return (x>=0?'+':'−')+Math.abs(x).toFixed(1)+'%'; }

export function makeValuation(cfg){
  var A = cfg.brand || '#12356B';
  var EVB = cfg.mult.evebitda;
  // ── instance state (private) ────────────────────────────────────────────────
  var seg = cfg.segments.map(function(s){ return { growth:(s.growthDefaultPct||0)/100, take:s.take2025Pct/100 }; });
  var st = { margin:cfg.marginDefaultPct/100, mult:EVB.def, netCash:cfg.netCashDefaultM,
             price:cfg.priceDefault, gGrowth:(cfg.sharedGrowthDefaultPct||0)/100 };

  function calc(){
    if(cfg.sharedVolume){
      var vol=cfg.sharedBaseM*(1+st.gGrowth);
      var sr=cfg.segments.map(function(s,i){ return vol*seg[i].take; });
      var rv=sr.reduce(function(a,b){ return a+b; }, 0);
      return { rev:rv, ebitda:rv*st.margin, segRev:sr, vol:vol };
    }
    var rev=0, segRev=cfg.segments.map(function(s,i){ var r=s.gb2025M*(1+seg[i].growth)*seg[i].take; rev+=r; return r; });
    return { rev:rev, ebitda:rev*st.margin, segRev:segRev };
  }
  function priceAt(mult, c){ return (mult*c.ebitda + st.netCash)/cfg.sharesM; }
  function multAtPrice(c){ if(st.price==null||isNaN(st.price)) return null; return (st.price*cfg.sharesM - st.netCash)/c.ebitda; }

  // hover hint (info dot + tooltip)
  function hintIco(html){ if(!html) return ''; return '<span class="val-hint">i<span class="val-tip">'+html+'</span></span>'; }
  function segHint(s){ var hn=s.hint; if(!hn) return '';
    var t=''; if(hn.take) t+='<b>Take rate</b> — '+hn.take;
    if(hn.growth) t+=(t?'<br>':'')+'<b>'+vEsc(cfg.volLabel)+' growth</b> — '+hn.growth;
    if(hn.note) t+=(t?'<br>':'')+hn.note;
    if(hn.guide) t+='<span class="val-tip-g">'+hn.guide+'</span>';
    return hintIco(t);
  }
  function volHint(){ var hn=cfg.volHint; if(!hn) return '';
    var t=''; if(hn.growth) t+='<b>'+vEsc(cfg.volLabel)+' growth</b> — '+hn.growth;
    if(hn.guide) t+='<span class="val-tip-g">'+hn.guide+'</span>';
    return hintIco(t);
  }

  // ── body (HTML) ─────────────────────────────────────────────────────────────
  function body(){
    var volL = cfg.volLabel || 'Gross Bookings';
    var h = '<style>'+
      '.val{--acc:'+A+'}'+
      '.val-lede{font-size:13px;line-height:1.6;color:var(--navy);margin:0 0 14px}.val-lede b{font-weight:800}'+
      '.val-sec-h{font-size:12.5px;font-weight:800;color:var(--navy);letter-spacing:.2px;margin:18px 0 9px;padding-bottom:5px;border-bottom:1px solid var(--bdr)}'+
      '.val-seg{display:grid;grid-template-columns:118px 1fr 132px 92px;gap:10px;align-items:center;padding:7px 0;border-bottom:1px solid var(--bdr)}'+
      '@media(max-width:640px){.val-seg{grid-template-columns:96px 1fr 116px}.val-seg .val-seg-rev{display:none}}'+
      '.val-seg-n{font-size:12px;font-weight:800;color:var(--navy);display:flex;align-items:center}'+
      '.val-sl-h{font-size:10.5px;color:var(--mu);font-weight:700;margin-bottom:2px}.val-sl-h b{color:var(--navy);font-weight:800}'+
      '.val-seg input[type=range]{width:100%;accent-color:var(--acc);margin:0}'+
      '.val-take{display:flex;align-items:center;gap:2px;border:1px solid var(--bdr);border-radius:7px;padding:3px 8px;background:#fff}'+
      '.val-take input{width:60px;border:0;outline:0;font-size:12.5px;font-weight:700;color:var(--navy);text-align:right;font-family:inherit;-moz-appearance:textfield}'+
      '.val-take input::-webkit-outer-spin-button,.val-take input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}'+
      '.val-take span{font-size:11px;color:var(--mu)}'+
      '.val-seg-rev{font-size:12px;font-weight:800;color:var(--navy);text-align:right}'+
      '.val-marg{display:flex;align-items:center;gap:12px;margin:12px 0 2px;flex-wrap:wrap}'+
      '.val-marg .val-sl{flex:1;min-width:220px}.val-marg input[type=range]{width:100%;accent-color:var(--acc)}'+
      '.val-out{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0 2px}'+
      '.val-tile{border:1px solid var(--bdr);border-radius:10px;padding:10px 13px}'+
      '.val-tile-l{font-size:10.5px;color:var(--mu);font-weight:700;text-transform:uppercase;letter-spacing:.4px}'+
      '.val-tile-v{font-size:19px;font-weight:800;color:var(--navy);margin-top:2px}'+
      '.val-tile-d{font-size:10.5px;margin-top:2px}.val-up{color:#0a8f0a;font-weight:700}.val-dn{color:#C0392B;font-weight:700}.val-mut{color:var(--mu)}'+
      '.val-vgrid{display:grid;grid-template-columns:1fr 160px 150px;gap:12px;align-items:end}@media(max-width:640px){.val-vgrid{grid-template-columns:1fr}}'+
      '.val-num{display:flex;align-items:center;gap:3px;border:1px solid var(--bdr);border-radius:8px;padding:5px 10px;background:#fff}'+
      '.val-num span{font-size:12px;color:var(--mu);font-weight:700}.val-num input{width:100%;border:0;outline:0;font-size:13px;font-weight:700;color:var(--navy);font-family:inherit}'+
      '.val-in-l{font-size:10.5px;color:var(--mu);font-weight:700;margin-bottom:3px;display:flex;align-items:center}'+
      '.val-result{display:flex;align-items:center;gap:16px;flex-wrap:wrap;background:linear-gradient(180deg,rgba(0,0,0,0.02),transparent);border:1px solid var(--bdr);border-left:3px solid var(--acc);border-radius:11px;padding:13px 16px;margin:14px 0 4px}'+
      '.val-result-v{font-size:30px;font-weight:900;color:var(--acc);line-height:1}'+
      '.val-result-l{font-size:11px;color:var(--mu);font-weight:700}'+
      '.val-result-s{font-size:12px;color:var(--navy);line-height:1.5}'+
      '.val-ff{margin-top:6px}'+
      '.val-ff-row{display:grid;grid-template-columns:56px 1fr 66px;gap:9px;align-items:center;margin:5px 0}'+
      '.val-ff-m{font-size:11px;font-weight:800;color:var(--navy);text-align:right}'+
      '.val-ff-bar-wrap{position:relative;height:20px;background:rgba(138,147,160,0.10);border-radius:5px;overflow:hidden}'+
      '.val-ff-bar{height:100%;border-radius:5px;background:var(--acc);opacity:.85}'+
      '.val-ff-p{font-size:11.5px;font-weight:800;color:var(--navy)}'+
      '.val-ff-now{position:absolute;top:-3px;bottom:-3px;width:2px;background:#C0392B;z-index:3}'+
      '.val-ff-nowlbl{font-size:10px;font-weight:800;color:#C0392B;margin-top:5px}'+
      '.val-hint{position:relative;display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:50%;border:1px solid var(--bdr);color:var(--mu);font-size:9px;font-weight:800;font-style:normal;cursor:help;margin-left:5px;flex:none}'+
      '.val-hint:hover{border-color:var(--acc);color:var(--acc)}'+
      '.val-tip{position:absolute;bottom:150%;left:0;width:232px;background:#0e1524;color:#eef2f7;font-size:10.5px;font-weight:500;line-height:1.55;padding:9px 11px;border-radius:8px;opacity:0;visibility:hidden;transition:opacity .12s;z-index:60;box-shadow:0 6px 22px rgba(0,0,0,.28);text-align:left;pointer-events:none;white-space:normal}'+
      '.val-hint:hover .val-tip{opacity:1;visibility:visible}'+
      '.val-tip b{color:#cdd6e4;font-weight:800}'+
      '.val-tip-g{display:block;margin-top:6px;padding-top:6px;border-top:1px solid rgba(255,255,255,.14);color:#7fd39a;font-weight:600}'+
      '.val-foot{font-size:10.5px;color:var(--mu);line-height:1.5;margin-top:14px}'+
    '</style>';

    h += '<div class="val">';
    h += '<p class="val-lede">A <b>scenario → price-target</b> calculator. Move each segment’s <b>'+vEsc(volL)+'</b> growth and <b>take rate</b>, plus the <b>Adj. EBITDA margin</b>, to build a forward revenue &amp; profit case — then apply an <b>EV/EBITDA</b> multiple for an implied price and upside. Hover the <span class="val-hint" style="cursor:default">i</span> on any driver for its history &amp; guidance. Defaults reproduce the <b>Summit DCF '+vEsc(cfg.dcf.fy)+'</b>.</p>';

    // Step 1 — scenario builder
    h += '<div class="val-sec-h">1 · Build the forward case</div>';
    if(cfg.sharedVolume){
      h += '<div class="val-seg">'+
        '<div class="val-seg-n">'+vEsc(volL)+volHint()+'</div>'+
        '<div class="val-sl"><div class="val-sl-h">'+vEsc(volL)+' growth <b class="val-gg-v">'+vPct1(st.gGrowth*100)+'</b></div>'+
          '<input type="range" class="val-gg" min="-10" max="30" step="1" value="'+(st.gGrowth*100)+'"></div>'+
        '<div class="val-sl-h" style="align-self:center">×  take →</div>'+
        '<div class="val-seg-rev val-volrev">'+vB(cfg.sharedBaseM*(1+st.gGrowth))+'</div>'+
      '</div>';
      cfg.segments.forEach(function(s,i){
        h += '<div class="val-seg" data-si="'+i+'">'+
          '<div class="val-seg-n">'+vEsc(s.label)+segHint(s)+'</div>'+
          '<div class="val-sl-h" style="align-self:center;color:var(--mu)">'+vEsc(s.sub||('take on '+volL))+'</div>'+
          '<div><div class="val-sl-h">Take rate</div><div class="val-take"><input class="val-t" type="number" step="0.05" value="'+(seg[i].take*100).toFixed(2)+'"><span>%</span></div></div>'+
          '<div class="val-seg-rev val-segrev">'+vB(cfg.sharedBaseM*(1+st.gGrowth)*seg[i].take)+'</div>'+
        '</div>';
      });
    } else {
      cfg.segments.forEach(function(s,i){
        h += '<div class="val-seg" data-si="'+i+'">'+
          '<div class="val-seg-n">'+vEsc(s.label)+segHint(s)+'</div>'+
          '<div class="val-sl"><div class="val-sl-h">'+vEsc(volL)+' growth <b class="val-g-v">'+vPct1(seg[i].growth*100)+'</b></div>'+
            '<input type="range" class="val-g" min="-15" max="40" step="1" value="'+(seg[i].growth*100)+'"></div>'+
          '<div><div class="val-sl-h">Take rate</div><div class="val-take"><input class="val-t" type="number" step="0.1" value="'+(seg[i].take*100).toFixed(2)+'"><span>%</span></div></div>'+
          '<div class="val-seg-rev val-segrev">'+vB(s.gb2025M*(1+seg[i].growth)*seg[i].take)+'</div>'+
        '</div>';
      });
    }
    h += '<div class="val-marg"><div class="val-sl"><div class="val-sl-h">Adj. EBITDA margin '+hintIco(cfg.marginHint)+' <b class="val-m-v">'+(st.margin*100).toFixed(1)+'%</b></div>'+
      '<input type="range" class="val-m" min="'+cfg.mult.marginMin+'" max="'+cfg.mult.marginMax+'" step="0.5" value="'+(st.margin*100)+'"></div></div>';
    h += '<div class="val-out">'+
      '<div class="val-tile"><div class="val-tile-l">Revenue</div><div class="val-tile-v val-rev">—</div><div class="val-tile-d val-revd"></div></div>'+
      '<div class="val-tile"><div class="val-tile-l">Adj. EBITDA</div><div class="val-tile-v val-eb">—</div><div class="val-tile-d val-ebd"></div></div>'+
    '</div>';

    // Step 2 — value it
    h += '<div class="val-sec-h">2 · Value it → implied price</div>';
    h += '<div class="val-vgrid">'+
      '<div class="val-sl"><div class="val-sl-h">EV / EBITDA '+hintIco(cfg.multHint)+' <b class="val-mult-v">'+st.mult.toFixed(1)+'×</b></div>'+
        '<input type="range" class="val-mult" min="'+EVB.min+'" max="'+EVB.max+'" step="0.5" value="'+st.mult+'"></div>'+
      '<div><div class="val-in-l">Net cash / (debt), $M '+hintIco(cfg.netCashNote)+'</div><div class="val-num"><span>$</span><input class="val-nc" type="number" step="50" value="'+st.netCash+'"></div></div>'+
      '<div><div class="val-in-l">Current price '+hintIco(cfg.priceHint)+'</div><div class="val-num"><span>$</span><input class="val-px" type="number" step="0.01" value="'+(st.price!=null?st.price:'')+'"></div></div>'+
    '</div>';
    h += '<div class="val-result"><div><div class="val-result-l">Implied price</div><div class="val-result-v val-tp">$—</div></div>'+
      '<div class="val-result-s">implied market cap <b class="val-mc">—</b><br><span class="val-upside"></span></div></div>';

    // Football field
    h += '<div class="val-sec-h">Price targets across the EV/EBITDA range</div>';
    h += '<div class="val-sl-h" style="margin-bottom:6px">Implied price at each EV/EBITDA multiple, holding the case you built. Red line = current price.</div>';
    h += '<div class="val-ff"></div>';

    h += '<div class="val-foot">Segment '+vEsc(volL)+', take rates, Adj. EBITDA and the DCF forward are from the <b>Summit DCF model</b> (FY2025 reported actuals; '+vEsc(cfg.dcf.fy)+' estimate). '+
      'Revenue = Σ (segment '+vEsc(volL)+' × (1+growth) × take); Adj. EBITDA = revenue × margin; EV = EV/EBITDA × EBITDA; equity = EV + net cash; price = equity ÷ '+(cfg.sharesM/1000).toFixed(2)+'B diluted shares. '+
      '<b>Net cash and current price are editable</b> — the Summit model carries no balance sheet or quote; defaults: net '+(cfg.netCashDefaultM>=0?'cash':'debt')+' '+vB(Math.abs(cfg.netCashDefaultM))+' and $'+((cfg.priceDefault!=null)?cfg.priceDefault.toFixed(2):'—')+' ('+vEsc(cfg.priceAsOf||'')+'), from filings/last quote — verify live.</div>';
    h += '</div>';
    return h;
  }

  // ── paint (recompute + update DOM) ──────────────────────────────────────────
  function paint(scope){
    var c=calc();
    if(cfg.sharedVolume){
      var ggv=scope.querySelector('.val-gg-v'); if(ggv) ggv.textContent=vPct1(st.gGrowth*100);
      var vr=scope.querySelector('.val-volrev'); if(vr) vr.textContent=vB(c.vol);
    }
    scope.querySelectorAll('.val-seg').forEach(function(row){ var i=+row.getAttribute('data-si');
      var rv=row.querySelector('.val-segrev'); if(rv && !isNaN(i)) rv.textContent=vB(c.segRev[i]);
      var gv=row.querySelector('.val-g-v'); if(gv && !isNaN(i)) gv.textContent=vPct1(seg[i].growth*100);
    });
    var mvi=scope.querySelector('.val-m-v'); if(mvi) mvi.textContent=(st.margin*100).toFixed(1)+'%';
    var rev=scope.querySelector('.val-rev'); if(rev) rev.textContent=vB(c.rev);
    var eb=scope.querySelector('.val-eb'); if(eb) eb.textContent=vB(c.ebitda);
    var revd=scope.querySelector('.val-revd'); if(revd){ var dr=(c.rev/cfg.dcf.revM-1)*100; revd.innerHTML='<span class="'+(Math.abs(dr)<0.05?'val-mut':(dr>=0?'val-up':'val-dn'))+'">'+(Math.abs(dr)<0.05?'= ':vPct1(dr)+' vs ')+'DCF '+cfg.dcf.fy+'</span>'; }
    var ebd=scope.querySelector('.val-ebd'); if(ebd){ var de=(c.ebitda/cfg.dcf.ebitdaM-1)*100; ebd.innerHTML='<span class="'+(Math.abs(de)<0.05?'val-mut':(de>=0?'val-up':'val-dn'))+'">'+(Math.abs(de)<0.05?'= ':vPct1(de)+' vs ')+'DCF '+cfg.dcf.fy+'</span>'; }
    var mv=scope.querySelector('.val-mult-v'); if(mv) mv.textContent=st.mult.toFixed(1)+'×';
    var tp=priceAt(st.mult, c);
    var tpe=scope.querySelector('.val-tp'); if(tpe) tpe.textContent=vPx(tp);
    var mc=scope.querySelector('.val-mc'); if(mc) mc.textContent=vB(tp*cfg.sharesM);
    var up=scope.querySelector('.val-upside');
    if(up){ if(st.price!=null&&!isNaN(st.price)&&st.price>0){ var u=(tp/st.price-1)*100;
        up.innerHTML='vs current '+vPx(st.price)+' → <b class="'+(u>=0?'val-up':'val-dn')+'">'+vPct1(u)+'</b>'+
          ' &middot; at market the case trades <b>'+(multAtPrice(c)||0).toFixed(1)+'×</b>';
      } else up.innerHTML='<span class="val-mut">enter a current price for upside</span>'; }
    var ff=scope.querySelector('.val-ff');
    if(ff){ var rows=[], maxP=0, curX=null, steps=7;
      for(var k=0;k<steps;k++){ var m=EVB.min+(EVB.max-EVB.min)*k/(steps-1); var pp=priceAt(m,c); rows.push({m:m,p:pp}); if(pp>maxP)maxP=pp; }
      if(st.price!=null&&!isNaN(st.price)&&maxP>0) curX=Math.max(0,Math.min(100,(st.price/maxP)*100));
      var hh='';
      rows.forEach(function(r){ var w=maxP>0?Math.max(1,(r.p/maxP)*100):0; var near=Math.abs(r.m-st.mult)<((EVB.max-EVB.min)/(steps-1))/2;
        hh+='<div class="val-ff-row"><div class="val-ff-m">'+r.m.toFixed(1)+'×</div>'+
          '<div class="val-ff-bar-wrap">'+(curX!=null?'<div class="val-ff-now" style="left:'+curX+'%"></div>':'')+
            '<div class="val-ff-bar" style="width:'+w+'%;opacity:'+(near?1:0.7)+'"></div></div>'+
          '<div class="val-ff-p">'+vPx(r.p)+'</div></div>';
      });
      if(curX!=null) hh+='<div class="val-ff-nowlbl">▲ current price '+vPx(st.price)+'</div>';
      ff.innerHTML=hh;
    }
  }

  // ── init (wire controls) ────────────────────────────────────────────────────
  function init(root){
    var scope = root.querySelector('.ovt-pane[data-ovt="valuation"]') || root.querySelector('.ov-pane[data-capane="valuation"]') || root;
    if(!scope.querySelector('.val-ff')) return;
    scope.querySelectorAll('.val-seg').forEach(function(row){ var i=+row.getAttribute('data-si');
      var g=row.querySelector('.val-g'); if(g) g.oninput=function(){ seg[i].growth=(+g.value)/100; paint(scope); };
      var t=row.querySelector('.val-t'); if(t) t.oninput=function(){ var v=parseFloat(t.value); if(!isNaN(v)){ seg[i].take=v/100; paint(scope);} };
    });
    var gg=scope.querySelector('.val-gg'); if(gg) gg.oninput=function(){ st.gGrowth=(+gg.value)/100; paint(scope); };
    var m=scope.querySelector('.val-m'); if(m) m.oninput=function(){ st.margin=(+m.value)/100; paint(scope); };
    var mult=scope.querySelector('.val-mult'); if(mult) mult.oninput=function(){ st.mult=+mult.value; paint(scope); };
    var nc=scope.querySelector('.val-nc'); if(nc) nc.oninput=function(){ var v=parseFloat(nc.value); if(!isNaN(v)){ st.netCash=v; paint(scope);} };
    var px=scope.querySelector('.val-px'); if(px) px.oninput=function(){ var v=parseFloat(px.value); st.price=isNaN(v)?null:v; paint(scope); };
    paint(scope);
  }

  return { body:body, init:init };
}
