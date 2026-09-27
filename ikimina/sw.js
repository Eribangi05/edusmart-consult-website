/* Keeps the app on the device so it opens with no internet. Cloud requests (other origins) are never cached. */
const CACHE = 'ikimina-73c9780655';
const FILES = ["./", "app.js", "assets/logo-192.png", "assets/logo-96.png", "cloud.js", "core.js", "i18n-data.js", "i18n.js", "index.html", "styles.css", "web.css", "web.js"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.indexOf('ikimina-') === 0 && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.match(r, { ignoreSearch: true }).then((hit) => hit || fetch(r).catch(() => caches.match('./index.html'))));
});
