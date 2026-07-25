// thesis.js — Single long-form investment thesis document.
// Renders all active positions grouped by sector as one scrollable page.
import { fetchInvestmentSectors, fetchInvestmentCompanies } from './api.js';
import { LOCAL_SECTORS, LOCAL_COMPANIES } from './investment-local-seed.js';

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function mdBold(str) {
  return str.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function prose(text) {
  if (!text) return '';
  return text.trim().split(/\n\s*\n/).map(function(p) {
    return '<p class="thesis-p">' + mdBold(esc(p.trim())) + '</p>';
  }).join('');
}

export async function loadThesisPage() {
  var root = document.getElementById('thesis-root');
  if (!root) return;
  root.innerHTML = '<p class="thesis-loading">Loading…</p>';

  var [sr, cr] = await Promise.all([fetchInvestmentSectors(), fetchInvestmentCompanies()]);

  var sectors = (sr.success ? sr.data : LOCAL_SECTORS) || [];
  var companies = (cr.success ? cr.data : LOCAL_COMPANIES) || [];

  if (!sectors.length) {
    root.innerHTML = '<p class="thesis-empty">No positions yet.</p>';
    return;
  }

  var date = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  var html = '<div class="thesis-doc">';
  html += '<div class="thesis-hd">';
  html += '<p class="thesis-lettermark">Summit Management Technologies</p>';
  html += '<h1 class="thesis-title">Investment Thesis</h1>';
  html += '<p class="thesis-meta">' + date + '</p>';
  html += '</div>';

  for (var i = 0; i < sectors.length; i++) {
    var sector = sectors[i];
    var cos = companies.filter(function(c) { return c.sector_id === sector.id; });
    if (!cos.length) continue;

    html += '<div class="thesis-sector">';
    html += '<h2 class="thesis-sector-name">' + esc(sector.name) + '</h2>';

    for (var j = 0; j < cos.length; j++) {
      var c = cos[j];
      html += '<div class="thesis-co">';
      html += '<div class="thesis-co-hd">';
      html += '<span class="thesis-ticker">' + esc(c.ticker) + '</span>';
      html += '<span class="thesis-co-name">' + esc(c.name) + '</span>';
      html += '</div>';
      html += '<div class="thesis-prose">' + prose(c.opportunity) + '</div>';
      html += '</div>';
    }

    html += '</div>';
  }

  html += '</div>';
  root.innerHTML = html;
}
