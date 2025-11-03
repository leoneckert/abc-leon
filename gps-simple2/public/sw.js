// public/sw.js

const CACHE_NAME = "my-cache-v1";
const cacheFiles = [
//   '/',
//   '/index.html',
//   '/app.js',
//   '/style.css',
//   '/images/logo.png',
];

// cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(cacheFiles))
  );
});

// fetch files
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});