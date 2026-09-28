/* EduSmart Consult service worker: keeps the main pages available offline. Version 2026-09-28. */
var V = "edusmart-2026-09-28-1651", CORE = ["index.html", "products.html", "smart-school-app.html", "smart-school-cloud.html", "tour.html", "downloads.html", "pricing.html", "request.html", "contact.html", "about.html", "news.html", "offline.html", "assets/styles.css", "assets/extra.css", "assets/site.js", "assets/extra.js", "assets/config.js", "assets/logo-horizontal.webp", "assets/emblem-192.png", "content/announcements.json", "search-index.json"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(V).then(function (c) { return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () {}); })); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener("activate", function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener("fetch", function (e) {
  var r = e.request; if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  if (new URL(r.url).pathname.indexOf("/amategeko/") === 0) return;   // the road code web app manages its own files
  var isPage = r.mode === "navigate" || (r.headers.get("accept") || "").indexOf("text/html") > -1;
  var isCode = /\.(js|css)$/.test(new URL(r.url).pathname);
  if (isPage || isCode) {
    // network-first: JS/CSS and pages must never go stale just because a visitor already has this service
    // worker installed - a version bump alone isn't enough, since cache-first would keep serving old code
    // (built for an older data shape) until the cache happened to expire. Offline (or a flaky network)
    // still falls back to whatever was last cached, so the site keeps working without internet.
    e.respondWith(fetch(r).then(function (res) { var cp = res.clone(); caches.open(V).then(function (c) { c.put(r, cp); }); return res; }).catch(function () { return caches.match(r).then(function (m) { return m || (isPage ? caches.match("offline.html") : undefined); }); }));
  } else {
    e.respondWith(caches.match(r).then(function (m) { return m || fetch(r).then(function (res) { if (res.ok) { var cp = res.clone(); caches.open(V).then(function (c) { c.put(r, cp); }); } return res; }); }));
  }
});
