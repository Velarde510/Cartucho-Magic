const CACHE_NAME = 'cartusho-pwa-v3';
const assets = ['/', '/index.html', '/manifest.json', '/assets/icon-192.png', '/assets/icon-512.png'];

self.addEventListener('install', e =>
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(assets)))
);
self.addEventListener('fetch', e =>
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
);
