// Povećaj broj kod svake izmjene bilo koje datoteke s popisa (vidi CLAUDE.md).
const CACHE = 'dnevnik-v4';
const ASSETS = [
  './dnevnik-prehrane-i-tezine.html',
  './manifest.json',
  './dnevnik-sah-i-engleski.html',
  './manifest-sah-engleski.json',
  './icons/sah-apple-touch-icon.png',
  './icons/sah-192.png',
  './icons/sah-512.png',
  './vendor/chart.umd.min.js',
  './vendor/fonts.css',
  ...Array.from({ length: 10 }, (_, i) => `./vendor/fonts/f${String(i).padStart(2, '0')}.woff2`),
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache first, then update in background; offline falls back to cache.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => {
      const fresh = fetch(e.request).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => hit);
      return hit || fresh;
    })
  );
});
