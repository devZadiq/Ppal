/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope; // Explicit type declaration

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
  self.skipWaiting();
});

// Cache and return requests
self.addEventListener("fetch", (event) => {
  console.log("Service Worker fetching", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        console.log("Cache hit for", event.request.url);
        return response;
      }
      console.log("Cache miss, fetching from network", event.request.url);
      return fetch(event.request).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          console.log("Caching", event.request.url);
          cache.put(event.request, responseToCache);
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
  self.clients.claim();
});
