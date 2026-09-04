// Auth module — magic-link login, session management, role gates
import { supabase } from './supabase-client.js';
import { fetchUserRole, backfillUserRole } from './api.js';

// ─── Role config ───────────────────────────────────────────
// Add team members here as roles. allowedPages controls sidebar visibility.
// 'admin' has access to everything; other roles see only their pages.

const ROLE_CONFIG = {
  // 'fund-returns' is restricted to the investment committee / internal team.
  // For now only 'admin' exists, so it lives here; when more roles are added,
  // simply omit 'fund-returns' from any role that should not see it.
  admin: { name: 'Admin', label: 'Admin', allowedPages: ['research', 'market-analysis', 'hedge-funds', 'team', 'fund-returns', 'covered-calls', 'portfolio-metrics'], defaultPage: 'research' },
};

let _currentRole = null;

// ─── Public API ────────────────────────────────────────────

export function getCurrentUser() {
  return _currentRole ? { ..._currentRole } : null;
}

export function canAccess(page) {
  return _currentRole?.allowedPages.includes(page) ?? false;
}

// ─── OTP sign-in (email code) ──────────────────────────────

export async function sendOtp(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  return { error };
}

export async function verifyOtp(email, code) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: 'email',
  });
  return { data, error };
}

// ─── Sign out ──────────────────────────────────────────────

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = '/login.html';
}

// ─── Session bootstrap ─────────────────────────────────────

export async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    if (!window.location.pathname.endsWith('/login.html')) {
      window.location.href = '/login.html';
    }
    return { status: 'no-session' };
  }

  // Fetch role via API layer
  var roleResult = await fetchUserRole(session.user.id);

  if (!roleResult.success) {
    await backfillUserRole();
    roleResult = await fetchUserRole(session.user.id);

    if (!roleResult.success) {
      await supabase.auth.signOut();
      return { status: 'unauthorized' };
    }
  }

  var roleRow = roleResult.data;

  const config = ROLE_CONFIG[roleRow.role];
  if (!config) {
    await supabase.auth.signOut();
    return { status: 'unauthorized' };
  }

  _currentRole = { ...config, role: roleRow.role, email: session.user.email };

  if (window.location.pathname.endsWith('/login.html')) {
    window.location.href = '/index.html';
    return { status: 'redirecting' };
  }

  return { status: 'authenticated', user: _currentRole };
}

// Listen for auth state changes
supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT' && !window.location.pathname.endsWith('/login.html')) {
    window.location.href = '/login.html';
  }
});
