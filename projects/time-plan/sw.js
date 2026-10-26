const CACHE_NAME = 'timeplan-v1';
const ASSETS = [
  './index.html',
  './css/style.css',
  './js/app.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        // navigation requests offline → fallback to app shell (index.html)
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        // asset requests offline → fail gracefully, do not return HTML
        return new Response('', { status: 404, statusText: 'Not Found' });
      })
  );
});