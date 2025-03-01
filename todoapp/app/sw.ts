// Service Worker for caching and offline support

// Type assertion to specify that self is ServiceWorkerGlobalScope
const swSelf = self as ServiceWorkerGlobalScope;

// Define the cache name and the list of URLs to cache
const CACHE_NAME = 'my-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/icon.png',
  '/offline.html'
];

// Install event: cache the app shell
swSelf.addEventListener('install', (event: ExtendableEvent) => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('App shell cached');
        // Skip waiting to activate the service worker immediately
        return swSelf.skipWaiting();
      })
  );
});

// Fetch event: serve from cache or network
swSelf.addEventListener('fetch', (event: FetchEvent) => {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('Found in cache:', event.request.url);
          return response;
        }
        console.log('Network request for ', event.request.url);
        return fetch(event.request).then((networkResponse) => {
          // Check if the response is valid
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          // Clone the response to cache it
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching ', event.request.url);
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        }).catch(() => {
          // If fetch fails, return the offline page
          console.log('Fetch failed; returning offline page instead.');
          return caches.match('/offline.html');
        });
      })
  );
});

// Activate event: clean up old caches
swSelf.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('Service Worker activating.');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Claiming clients');
      // Claim the clients to take control immediately
      return swSelf.clients.claim();
    })
  );
});
