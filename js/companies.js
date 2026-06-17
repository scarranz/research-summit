// companies.js — extracted from summit-research-portal.html
import { COMPANIES, COMPANY_NAMES, IMGS, FRAMEWORK } from './portal-data.js';

let coEstChart = null;

function coComposite(c){var p=c.pillars;return (p.qb+p.qg+p.qm+p.qv)/4;}

function coSegs(score,max){var h='';for(var i=1;i<=max;i++)h+='<i class="'+(i<=score?'on':'')+'"></i>';return h;}

function coSubScore(comp,i){var off=[0,-1,1,0][i%4],v=comp+off;return v<1?1:(v>5?5:v);}

function logoFallback(img){
  var s=img.getAttribute('data-step')||'0',d=img.getAttribute('data-domain');
  if(s==='0'){img.setAttribute('data-step','1');img.src='https://www.google.com/s2/favicons?sz=128&domain='+d;return;}
  var w=img.parentNode;w.classList.add('mono');
  var b=w.getAttribute('data-brand');
  if(b){w.style.background=b;w.style.color='#fff';w.style.borderColor='transparent';}
  w.textContent=w.getAttribute('data-mono');
}

function coLogo(c,cls){
  return '<div class="cologo'+(cls?' '+cls:'')+'" data-mono="'+c.mono+'" data-brand="'+(c.brand||'')+'">'+
    '<img src="https://logo.clearbit.com/'+c.logo+'" alt="" data-domain="'+c.logo+'" data-step="0" onerror="logoFallback(this)"></div>';
}

function renderCoAnalysis(c){
  var box=document.getElementById('co-analysis');if(!box)return;
  box.innerHTML=FRAMEWORK.map(function(f){
    var sc=c.pillars[f.key];
    var subs=f.subs.map(function(s,i){
      return '<div class="fp-sub"><span class="sname">'+s+'</span><span class="sseg">'+coSegs(coSubScore(sc,i),5)+'</span></div>';
    }).join('');
    return '<div class="fp-block">'+
      '<div class="fp-head"><span class="fp-name">'+f.name+'</span>'+
        '<span class="fp-meter">'+coSegs(sc,5)+'</span><span class="fp-score">'+sc+'/5</span></div>'+
      '<div class="fp-subs">'+subs+'</div>'+
      '<div class="fp-note">'+f.desc+'</div></div>';
  }).join('');
}

function coFmtYtd(v){return (v>=0?'+':'')+v.toFixed(2)+'% YTD';}

function coGroups(){var s={};COMPANIES.forEach(function(c){s[c.grp]=1;});return Object.keys(s).sort();}

function initCoControls(){
  var sel=document.getElementById('co-groupfilter');if(!sel)return;
  sel.innerHTML='<option value="All">All groups</option>'+coGroups().map(function(g){return '<option value="'+g+'">'+g+'</option>';}).join('');
}

function renderCoGrid(){
  var grid=document.getElementById('co-grid');if(!grid)return;
  var si=document.getElementById('co-search'),gf=document.getElementById('co-groupfilter');
  var q=(si&&si.value||'').trim().toLowerCase(),g=(gf&&gf.value)||'All';
  var list=COMPANIES.filter(function(c){
    var okg=(g==='All'||c.grp===g);
    var okq=(!q||c.tk.toLowerCase().indexOf(q)>=0||c.nm.toLowerCase().indexOf(q)>=0);
    return okg&&okq;
  });
  if(!list.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:var(--mu);padding:34px;font-size:13px">No companies match that search.</div>';return;}
  grid.innerHTML=list.map(function(c){
    return '<div class="cotile" onclick="openCo(\''+c.tk+'\')">'+coLogo(c,'circ')+
      '<div class="cotile-nm">'+c.nm+'</div>'+
      '<div class="cotile-meta">'+c.tk+' &middot; '+c.grp+'</div></div>';
  }).join('');
}

function openCo(tk){
  var c=COMPANIES.find(function(x){return x.tk===tk;});if(!c)return;
  document.getElementById('co-logo').innerHTML=coLogo(c,'lg');
  document.getElementById('co-name').textContent=c.nm;
  document.getElementById('co-sub').innerHTML=c.ex+': '+c.tk+' &middot; '+c.grp;
  document.getElementById('co-px').textContent='$'+c.px.toFixed(2);
  renderCoAnalysis(c);
  document.getElementById('co-gridview').style.display='none';
  document.getElementById('co-detailview').style.display='block';
  coTab('analysis');
  window.scrollTo(0,0);
}

function closeCo(){
  document.getElementById('co-detailview').style.display='none';
  document.getElementById('co-gridview').style.display='block';
  window.scrollTo(0,0);
}

function coTab(pane){
  document.querySelectorAll('.cotab').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-pane')===pane);});
  document.querySelectorAll('.copane').forEach(function(p){p.classList.toggle('active',p.getAttribute('data-pane')===pane);});
  if(pane==='est') drawCoEst();
}

function drawCoEst(){
  if(coEstChart) return;
  var cv=document.getElementById('co-estchart');if(!cv)return;
  coEstChart=new Chart(cv,{type:'bar',
    data:{labels:['FY23','FY24','FY25E','FY26E','FY27E'],
      datasets:[
        {label:'Revenue ($B)',data:[37.3,43.9,50.6,58.1,66.0],backgroundColor:'#1E2733',borderRadius:4},
        {label:'EBITDA ($B)',data:[4.1,6.5,8.4,10.6,13.1],backgroundColor:'#C9CFD7',borderRadius:4}
      ]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{labels:{boxWidth:10,color:'#5A6E83',font:{family:'Inter',size:11}}}},
      scales:{x:{grid:{display:false},ticks:{color:'#5A6E83',font:{size:10}}},
              y:{grid:{color:'#E8EFF7'},ticks:{color:'#5A6E83',font:{size:10}}}}}});
}

// Expose to window for inline onclick handlers
window.openCo = openCo;
window.closeCo = closeCo;
window.coTab = coTab;
window.renderCoGrid = renderCoGrid;
window.logoFallback = logoFallback;

export function loadCompaniesPage() {
  initCoControls();
  renderCoGrid();
}
