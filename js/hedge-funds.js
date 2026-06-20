// hedge-funds.js — extracted from summit-research-portal.html
import { INVESTORS, SP500_REF, SP500_B26, HF_FUNDS, HF_BMK, HF_AYEARS, YEARS, SP500, IMGS } from './portal-data.js';

let alphaChart = null, ALPHA_MODE = 'cum', HF_SEL = {}, HF_START = '2015';

function hfList(){return HF_FUNDS.concat([{name:'S&P 500 (SPY)',color:'#94A3B8',r:HF_BMK,bench:true}]);}

function renderFundChips(){
  var row=document.getElementById('fund-chips');if(!row)return;
  var html='<span class="sb-secrow-lbl">Funds</span>';
  hfList().forEach(function(f){
    var on=HF_SEL[f.name]!==false;
    var style=on?('background:'+f.color+';color:#fff;border-color:'+f.color):'';
    html+='<span class="sb-secchip'+(on?' active':'')+'" style="'+style+'" onclick="toggleFund(\''+f.name.replace(/'/g,"\\'")+'\')">'+f.name+'</span>';
  });
  html+='<span class="sb-secchip-all" onclick="allFunds(true)">All</span><span class="sb-secchip-all" style="margin-left:6px" onclick="allFunds(false)">None</span>';
  row.innerHTML=html;
}

function toggleFund(n){HF_SEL[n]=(HF_SEL[n]===false);renderFundChips();renderAlphaChart();}

function allFunds(on){hfList().forEach(function(f){HF_SEL[f.name]=on;});renderFundChips();renderAlphaChart();}

function setAlphaStart(v){HF_START=v;renderAlphaChart();}

function setAlphaMode(m){ALPHA_MODE=m;document.querySelectorAll('#alpha-toggle .sb-tbtn').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-am')===m);});renderAlphaChart();}

function alphaSt(msg){var s=document.getElementById('alphaStatus');if(s){s.textContent=msg||'';s.style.display=msg?'flex':'none';}}

function renderAlphaChart(_tries){
  var cv=document.getElementById('alphaChart');if(!cv)return;
  if(typeof Chart==='undefined'){alphaSt('Chart library did not load in this browser.');return;}
  var box=cv.parentNode;
  if(box&&box.clientHeight<10){if((_tries||0)<30){requestAnimationFrame(function(){renderAlphaChart((_tries||0)+1);});}else{alphaSt('Chart area has no height (clientHeight=0).');}return;}
  if(alphaChart){alphaChart.destroy();alphaChart=null;}
  alphaSt('');
  var series=hfList().filter(function(f){return HF_SEL[f.name]!==false;});
  var si=HF_AYEARS.indexOf(HF_START);if(si<0)si=0;
  var sliceYears=HF_AYEARS.slice(si);
  var isCum=(ALPHA_MODE!=='annual');
  var baseYear=String(parseInt(HF_START,10)-1);
  var labels=isCum?[baseYear].concat(sliceYears):sliceYears;
  var datasets=series.map(function(f){
    var rs=f.r.slice(si);
    var n=rs.length, fi=-1;
    for(var j=0;j<n;j++){if(rs[j]!=null){fi=j;break;}}
    var data,annualData,cumData,anchor;
    if(isCum){
      // labels prepend a base year at index 0; fund arrays align to labels (length n+1)
      data=new Array(n+1).fill(null);annualData=new Array(n+1).fill(null);cumData=new Array(n+1).fill(null);
      anchor=(fi<0)?0:fi;             // labels index of this fund's 0-baseline (year before its first data)
      if(fi>=0){
        data[anchor]=0;annualData[anchor]=0;cumData[anchor]=0;
        var c=1;
        for(var k=fi;k<n;k++){
          if(rs[k]==null){continue;}
          c*=(1+rs[k]/100);var v=+(((c-1))*100).toFixed(2);
          data[k+1]=v;cumData[k+1]=v;annualData[k+1]=+rs[k].toFixed(2);
        }
      }
    } else {
      data=rs.map(function(rv){return rv==null?null:+rv.toFixed(2);});
      annualData=data;
      cumData=new Array(n).fill(null);
      anchor=(fi<0)?0:fi;
      if(fi>=0){var c2=1;for(var k2=fi;k2<n;k2++){if(rs[k2]==null)continue;c2*=(1+rs[k2]/100);cumData[k2]=+(((c2-1))*100).toFixed(2);}}
    }
    return {label:f.name,data:data,annualData:annualData,cumData:cumData,_anchor:anchor,_cum:isCum,spanGaps:false,
      borderColor:f.color,backgroundColor:f.color,
      borderWidth:f.bench?2.5:2,borderDash:f.bench?[6,4]:[],pointRadius:f.bench?0:2.5,pointHoverRadius:5,tension:.25,fill:false};
  });
  alphaChart=new Chart(cv.getContext('2d'),{type:'line',data:{labels:labels,datasets:datasets},
    options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'nearest',intersect:false},
      plugins:{legend:{position:'top',labels:{usePointStyle:true,boxWidth:8,padding:16,font:{size:11},color:'#1E2733'}},
        tooltip:{mode:'nearest',intersect:false,
          callbacks:{
            title:function(items){return items.length?items[0].dataset.label:'';},
            label:function(c){
              var ds=c.dataset,pf=function(v){return (v>=0?'+':'')+v.toFixed(1)+'%';};
              if(ds._cum && c.dataIndex===ds._anchor) return ['Baseline: 0.0%'];
              if(ds.cumData[c.dataIndex]==null) return [];
              var lines=[c.label+' return: '+pf(ds.annualData[c.dataIndex]),'Cumulative: '+pf(ds.cumData[c.dataIndex])];
              var ye=ds._cum?(c.dataIndex-ds._anchor):(c.dataIndex-ds._anchor+1);
              if(ye>0){var ann=(Math.pow(1+ds.cumData[c.dataIndex]/100,1/ye)-1)*100;lines.push('Annualized: '+pf(ann));}
              return lines;
            }
          }}},
      scales:{
        y:{title:{display:true,text:(ALPHA_MODE==='annual'?'Annual return (%)':'Cumulative return (%)'),font:{size:11},color:'#8A93A0'},
           grid:{color:function(c){return c.tick.value===0?'#B8C0CC':'#EEF2F7';}},ticks:{color:'#8A93A0',font:{size:10},callback:function(v){return v+'%';}}},
        x:{grid:{display:false},ticks:{color:'#8A93A0',font:{size:10}}}}}});
  requestAnimationFrame(function(){if(alphaChart){alphaChart.resize();}});
}

function renderBenchmark(){
  var el=document.getElementById('inv-bench');if(!el||!SP500_REF)return;
  var rets=SP500_REF.returns;
  var annualized=Math.pow(1+SP500_REF.cum/100,1/7)-1;
  var annStr=(annualized*100).toFixed(1)+'%';
  var html='<div class="inv-bench-left"><div class="inv-bench-title">S&amp;P 500 Benchmark</div><div class="inv-bench-sub">All managers measured against this</div></div>';
  html+='<div class="inv-bench-mets">';
  html+='<div class="inv-bench-m"><div class="inv-bench-ml">Cumul. 2019&ndash;Q1 2026</div><div class="inv-bench-mv">+'+SP500_REF.cum.toFixed(1)+'%</div></div>';
  html+='<div class="inv-bench-m"><div class="inv-bench-ml">Annualized (7yr)</div><div class="inv-bench-mv">+'+annStr+'</div></div>';
  html+='<div class="inv-bench-m"><div class="inv-bench-ml">2026 YTD</div><div class="inv-bench-mv">+10.0%</div></div>';
  html+='<div class="inv-bench-bars">';
  rets.forEach(function(r,i){var pp=r>=0?Math.min(r/80*100,100):0;var np=r<0?Math.min(Math.abs(r)/40*100,100):0;
    html+='<div class="ibb-col"><div class="ibb-wrap"><div class="ibb-pos" style="height:'+pp+'%"></div><div class="ibb-neg" style="height:'+np+'%"></div></div><div class="ibb-lbl">'+YEARS[i].slice(2)+'</div></div>';});
  html+='</div></div>';
  el.innerHTML=html;
}

function renderInvGrid(){
  var grid=document.getElementById('inv-grid');if(!grid)return;
  var html='';
  INVESTORS.forEach(function(inv){
    var isSummit=inv.key==='summit';
    var photo=inv.photo?(IMGS[inv.photo]||''):'';
    var hasPerf=inv.cum!=null;var cumClr=hasPerf?(inv.cum>=300?'gold':inv.cum>=171?'gp':''):'';
    var q1html=inv.q1!=null
      ?'<div class="icard-mv '+(inv.q1>=0?'gp':'rn')+'">'+(inv.q1>0?'+':'')+inv.q1.toFixed(2)+'%</div>'
      :'<div class="icard-mv" style="color:var(--mu);font-size:11px">n/a</div>';
    var cumLbl=inv.q1!=null?'Cumul. 2019&ndash;Q1 26':'Cumul. 2019&ndash;2025';
    html+='<div class="icard'+(isSummit?' summit':'')+'">';
    // Header
    html+='<div class="icard-hdr"><div class="icard-left">';
    if(photo){html+='<img class="icard-photo'+(isSummit?' sp':'')+'" src="'+photo+'" alt="" onerror="this.style.opacity=0.3">';}
    else{var ini=inv.name.split(' ').slice(0,2).map(function(n){return n[0];}).join('');html+='<div class="icard-ini">'+ini+'</div>';}
    html+='<div><div class="icard-name">'+inv.name+'</div><div class="icard-fund">'+inv.fund+'</div></div>';
    html+='</div><div><div class="icard-aum-lbl">Portfolio</div><div class="icard-aum-val">'+inv.aum+'</div></div></div>';
    // Metrics
    var annualized=hasPerf?Math.pow(1+inv.cum/100,1/7)-1:null;
    var annStr=hasPerf?(annualized*100).toFixed(1)+'%':'n/a';
    var ytd2026=inv.ytd2026!=null?inv.ytd2026:null;
    var ytdStr=ytd2026!=null?((ytd2026>=0?'+':'')+ytd2026.toFixed(1)+'%'):'n/a';
    html+='<div class="icard-mets">';
    html+='<div class="icard-met"><div class="icard-ml">Cumul. 2019&ndash;Q1 26</div><div class="icard-mv">'+(hasPerf?((inv.cum>0?'+':'')+inv.cum.toFixed(1)+'%'+(inv.est?' <span style="font-size:9px;color:var(--mu)">est</span>':'')):'<span style="color:var(--mu);font-size:11px">n/a</span>')+'</div></div>';
    html+='<div class="icard-met"><div class="icard-ml">Annualized (7yr)</div><div class="icard-mv">'+(hasPerf?((annualized>=0?'+':'')+annStr):'<span style="color:var(--mu);font-size:11px">n/a</span>')+'</div></div>';
    html+='<div class="icard-met"><div class="icard-ml">2026 YTD</div><div class="icard-mv">'+ytdStr+(inv.ytdEst?' <span style="font-size:9px;color:var(--mu)">est</span>':'')+'</div>'+(ytd2026!=null&&ytd2026<SP500_B26?'<div style="font-size:8px;color:var(--neg);font-weight:700;letter-spacing:.5px;text-transform:uppercase;margin-top:2px">Underperforming</div>':'')+'</div>';
    html+='</div>';
    // Holdings
    html+='<table class="icard-tbl"><thead><tr><th>Ticker</th><th>Company</th><th class="nr">% Port</th><th class="nr">YTD</th></tr></thead><tbody>';
    inv.holdings.forEach(function(h){var pc=h.ytd>=0?'rp':'rn';var ys=(h.ytd>=0?'+':'')+h.ytd.toFixed(2)+'%';var nb=h.nw?' <span style="font-size:8px;font-weight:700;letter-spacing:.5px;color:#2563EB;border:1px solid #2563EB;border-radius:3px;padding:0 3px;vertical-align:middle">NEW</span>':'';
      html+='<tr><td><span class="iticker">'+h.t+'</span></td><td><span class="ico">'+h.co+'</span>'+nb+'</td><td class="nr" style="color:var(--mu)">'+h.w.toFixed(2)+'%</td><td class="nr"><span class="rpill '+pc+'">'+ys+'</span></td></tr>';});
    html+='</tbody></table>';
    if(inv.est)html+='<div class="est-note">&#x26A0; Annual returns estimated from portfolio data.</div>';
    html+='</div>';
  });
  grid.innerHTML=html;
}

// Expose to window for inline onclick handlers
window.toggleFund = toggleFund;
window.allFunds = allFunds;
window.setAlphaStart = setAlphaStart;
window.setAlphaMode = setAlphaMode;

export function loadHedgeFundsPage() {
  if (!HF_FUNDS || !HF_FUNDS.length || !INVESTORS || !INVESTORS.length) {
    var main = document.getElementById('tp-inv');
    if (main) main.innerHTML = '<div style="text-align:center;color:var(--neg);padding:34px;font-size:13px">Hedge fund data failed to load. Please refresh the page.</div>';
    return;
  }
  renderFundChips();
  renderAlphaChart();
  renderBenchmark();
  renderInvGrid();
}
