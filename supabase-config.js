// ============================================
// JESSEL — Shared Supabase connection
// Paste your real values below (from Supabase -> Project Settings -> API)
// This file is loaded by every page via <script src="supabase-config.js">
// ============================================

const SUPABASE_URL = "https://lubvapzunrcwqcorgprd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_qXLa9TIC_u5z6EIZVQcJNA_a877E7Hs";

// ============================================
// "Keep me signed in" support
// If checked: session survives closing the browser (localStorage)
// If unchecked: session clears when the browser is closed (sessionStorage)
// The choice is remembered via a small flag in localStorage (not the
// session itself, just the preference), so every page loads with the
// right kind of session storage from the start.
// ============================================
function getPersistPreference() {
  return localStorage.getItem('jessel_persist') !== 'false'; // default: true
}

function buildClient(persist) {
  return supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: persist ? window.localStorage : window.sessionStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let sb = buildClient(getPersistPreference());

// Call this right before signing in, passing the checkbox's checked state
window.configureAuthStorage = function (persist) {
  localStorage.setItem('jessel_persist', persist ? 'true' : 'false');
  sb = buildClient(persist);
};

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

// ============================================
// PWA setup — applied to every page automatically since this file
// is loaded everywhere. Adds the manifest link, theme color, and
// apple touch icon to <head>, and registers the service worker.
// ============================================
(function setupPWA() {
  const manifestLink = document.createElement('link');
  manifestLink.rel = 'manifest';
  manifestLink.href = '/manifest.json';
  document.head.appendChild(manifestLink);

  const themeColor = document.createElement('meta');
  themeColor.name = 'theme-color';
  themeColor.content = '#0D2818';
  document.head.appendChild(themeColor);

  const appleIcon = document.createElement('link');
  appleIcon.rel = 'apple-touch-icon';
  appleIcon.href = '/apple-touch-icon.png';
  document.head.appendChild(appleIcon);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Service worker registration failed:', err);
      });
    });
  }
})();
