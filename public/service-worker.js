const CACHE_NAME = 'budsjett-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate the new service worker immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim(); // Take control of all open clients
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Check for app version updates
async function checkAppVersion() {
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match('/manifest.json');
  if (response) {
    const manifest = await response.json();
    const currentVersion = manifest.version;

    // Fetch the latest manifest.json
    const latestResponse = await fetch('/manifest.json');
    const latestManifest = await latestResponse.json();
    const latestVersion = latestManifest.version;

    if (currentVersion !== latestVersion) {
      self.registration.showNotification('Ny versjon tilgjengelig', {
        body: `Versjon ${latestVersion} er tilgjengelig. Oppdater appen!`,
        icon: '/icons/icon-192x192.png',
      });
    }
  }
}

self.addEventListener('activate', (event) => {
  event.waitUntil(checkAppVersion());
});
