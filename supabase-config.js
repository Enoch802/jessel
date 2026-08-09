// ============================================
// JESSEL — Shared Supabase connection
// Paste your real values below (from Supabase -> Project Settings -> API)
// This file is loaded by every page via <script src="supabase-config.js">
// ============================================

const SUPABASE_URL = "https://lubvapzunrcwqcorgprd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_qXLa9TIC_u5z6EIZVQcJNA_a877E7Hs";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// GitHub OAuth App Client ID — safe to expose publicly (only the Client
// Secret is sensitive, and that lives in Vercel's environment variables,
// never here). Get this from GitHub -> Settings -> Developer settings ->
// OAuth Apps -> your Jessel app.
window.GITHUB_CLIENT_ID = "Ov23liCM4NjxDwoUXuhb";

// ============================================
// Auto-clean links: strips ".html" from every internal link on the page,
// so URLs show as /dashboard instead of /dashboard.html everywhere.
// Works together with "cleanUrls": true in vercel.json (which is what
// actually makes /dashboard load dashboard.html behind the scenes).
// This only affects links you click — it doesn't change file names.
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href$=".html"]').forEach((link) => {
    const href = link.getAttribute('href');
    // Only touch same-site relative links, not external ones
    if (href && !href.startsWith('http') && !href.startsWith('//')) {
      link.setAttribute('href', href.replace(/\.html$/, ''));
    }
  });
});
