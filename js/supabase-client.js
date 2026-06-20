// Single Supabase client — used by every module
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

if (!window.ENV || !window.ENV.SUPABASE_URL || !window.ENV.SUPABASE_ANON_KEY) {
  document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Inter,sans-serif;color:#1E2733"><div style="text-align:center"><h2>Configuration Error</h2><p style="color:#7C8694">Environment variables failed to load. Please contact the admin.</p></div></div>';
  throw new Error('Missing window.ENV — env.js may have failed to load');
}

export const supabase = createClient(
  window.ENV.SUPABASE_URL,
  window.ENV.SUPABASE_ANON_KEY
);
