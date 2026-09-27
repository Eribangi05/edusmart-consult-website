/* Keeps the app on the device so it opens with no internet. Cloud requests (other origins) are never cached. */
const CACHE = 'fmis-13e1b381e1';
const FILES = ["./", "assets/logo-192.png", "assets/logo-48.png", "assets/logo-512.png", "assets/logo-96.png", "css/styles.css", "index.html", "js/app.js", "js/cloud.js", "js/core.js", "js/logo.js", "js/platform.js", "js/ui.js", "js/views1.js", "js/views2.js", "js/views3.js"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.indexOf('fmis-') === 0 && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.match(r, { ignoreSearch: true }).then((hit) => hit || fetch(r).catch(() => caches.match('./index.html'))));
});
