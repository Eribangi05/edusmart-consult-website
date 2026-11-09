/* Retired. The old Ikimina kept itself on the device; this replaces it so that browsers that still have it clean up and stop serving it. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.indexOf('ikimina-') === 0).map((k) => caches.delete(k)))).then(() => self.registration.unregister())); });
