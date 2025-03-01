// app/sw.ts
/// <reference lib="webworker" />

const CACHE_NAME = "taskflow-cache-v1";
const urlsToCache = ["/", "/manifest.json", "/icons/icon-192x192.png", "/icons/icon-512x512.png"];

// Install a service worker
self.addEventListener("install", (event) => {
  console.log("Service Worker installing");
  (event as ExtendableEvent).waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
  (self as unknown as ServiceWorkerGlobalScope).skipWaiting();
});

// Cache and return requests
self.addEventListener("fetch", (event) => {
  const fetchEvent = event as FetchEvent; // Type cast here
  console.log("Service Worker fetching", fetchEvent.request.url);
  event.respondWith(
    caches.match(fetchEvent.request).then((response) => {
      // Cache hit - return response
      if (response) {
        console.log("Cache hit for", fetchEvent.request.url);
        return response;
      }
      console.log("Cache miss, fetching from network", fetchEvent.request.url);
      return fetch(fetchEvent.request).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          console.log("Caching", fetchEvent.request.url);
          cache.put(fetchEvent.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Update a service worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating");
  const cacheWhitelist = [CACHE_NAME];
  (event as ExtendableEvent).waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log("Deleting old cache", cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
  (self as unknown as ServiceWorkerGlobalScope).clients.claim();
});
