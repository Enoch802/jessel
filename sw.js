// sw.js — minimal service worker, required for PWA installability.
// This app depends on live data (Supabase), so we intentionally don't
// cache pages aggressively — this just satisfies the browser's
// requirement that a service worker exists and responds to fetches.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass everything straight through to the network — no offline caching
  // yet. This can be expanded later if offline support is ever wanted.
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});


