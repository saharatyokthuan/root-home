const CACHE_NAME = 'finance-v1';
const ASSETS = [
  './index.html',
  './transactions.html',
  './categories.html',
  './settings.html',
  './css/style.css',
  './js/utils.js',
  './js/db.js',
  './js/nav.js',
  './js/index.js',
  './js/transactions.js',
  './js/categories.js',
  './js/settings.js',
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
        return fetch(event.request)
          .catch(() => caches.match('./index.html'));
      })
  );
});
