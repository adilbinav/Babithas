const CACHE_NAME = 'babithas-cms-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/admin.html',
  '/config.js',
  '/db.js',
  '/admin_manifest.json',
  '/assets/Logo-web.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // Use a Network-first helper strategy to keep content fresh in CMS dashboard
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
