// Auth module — magic-link login, session management, role gates
import { supabase } from './supabase-client.js';

// ─── Role config ───────────────────────────────────────────
// Add team members here as roles. allowedPages controls sidebar visibility.
// 'admin' has access to everything; other roles see only their pages.

const ROLE_CONFIG = {
  admin: { name: 'Admin', label: 'Admin', allowedPages: ['companies', 'market-analysis', 'hedge-funds', 'prueba'], defaultPage: 'companies' },
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

  // Fetch role
  let { data: roleRow, error: roleErr } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .single();

  if (roleErr || !roleRow) {
    await supabase.rpc('backfill_user_role_on_login');

    ({ data: roleRow, error: roleErr } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single());

    if (roleErr || !roleRow) {
      await supabase.auth.signOut();
      return { status: 'unauthorized' };
    }
  }

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
