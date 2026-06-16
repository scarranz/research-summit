// Navigation module — sidebar + page switching
import { getCurrentUser, canAccess, signOut } from './auth.js';

const _loaders = {};
const _loaded = new Set();

export function registerPageLoader(page, loader) {
  _loaders[page] = loader;
}

export function initNav() {
  const user = getCurrentUser();
  if (!user) return;

  // Update sidebar user info
  document.getElementById('sbUserName').textContent = user.name;
  document.getElementById('sbUserRole').textContent = user.label;

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

  // Update active nav
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  // Show target page, hide others
  document.querySelectorAll('.page').forEach(el => {
    el.style.display = el.id === `page-${page}` ? '' : 'none';
  });

  // Load page data on first visit
  if (!_loaded.has(page) && _loaders[page]) {
    _loaded.add(page);
    _loaders[page]();
  }
}

// Expose for onclick handlers
window._nav = navigateTo;
