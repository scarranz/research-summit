// Navigation module — sidebar + tab switching
import { getCurrentUser, canAccess, signOut } from './auth.js';

const _loaders = {};
const _loaded = new Set();

// Map page names to tab panel IDs
const TAB_MAP = {
  'companies': 'co',
  'market-analysis': 'rot',
  'hedge-funds': 'inv',
  'team': 'team',
  'fund-returns': 'ret',
};

const TAB_TITLES = {
  'co': 'Companies',
  'rot': 'Market Analysis',
  'inv': 'Hedge Funds',
  'team': 'Team',
  'ret': 'Fund Returns',
};

export function registerPageLoader(page, loader) {
  _loaders[page] = loader;
}

export function initNav() {
  const user = getCurrentUser();
  if (!user) return;

  // Update sidebar user info
  const nameEl = document.getElementById('sbUserName');
  const roleEl = document.getElementById('sbUserRole');
  if (nameEl) nameEl.textContent = user.email || user.name;
  if (roleEl) roleEl.textContent = user.label;

  // Hide nav items the user can't access
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    const page = el.dataset.page;
    if (!canAccess(page)) el.style.display = 'none';
  });

  // Sign out button
  document.getElementById('signOutBtn').addEventListener('click', () => signOut());

  // Navigate to default page
  navigateTo(user.defaultPage);
}

export function navigateTo(page) {
  if (!canAccess(page)) return;

  const tab = TAB_MAP[page];
  if (!tab) return;

  // Update active nav button
  document.querySelectorAll('.ntb[data-tab]').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tab);
  });

  // Show target tab panel, hide others
  document.querySelectorAll('.tp').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('tp-' + tab);
  if (el) el.classList.add('active');

  // Update topbar title
  const t = document.getElementById('tbTitle');
  if (t && TAB_TITLES[tab]) t.textContent = TAB_TITLES[tab];

  // Load page data on first visit
  if (!_loaded.has(page) && _loaders[page]) {
    _loaded.add(page);
    _loaders[page]();
  }

  // Re-render charts that need visibility to size correctly
  if (tab === 'rot') {
    setTimeout(() => {
      if (_loaders['market-analysis'] && _loaded.has('market-analysis')) {
        // Scatter chart needs re-render on tab switch
        window.dispatchEvent(new Event('resize'));
      }
    }, 80);
  }
}

// Expose for onclick handlers in HTML
window._nav = navigateTo;

// switchTab bridge — maps tab IDs back to page names
const TAB_TO_PAGE = Object.fromEntries(
  Object.entries(TAB_MAP).map(([page, tab]) => [tab, page])
);

window.switchTab = function(tab) {
  const page = TAB_TO_PAGE[tab];
  if (page) navigateTo(page);
};
