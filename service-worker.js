// Service Worker - Konteo 05
const CACHE_NAME = 'konteo05-v4.0.0';
const APP_SHELL = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/manifest.json',
  '/js/app.js',
  '/js/state.js',
  '/js/firebase/runtime-config.js',
  '/js/firebase/config.js',
  '/js/services/dbService.js',
  '/js/services/exportService.js',
  '/js/ui/helpers.js',
  '/js/ui/toast.js',
  '/js/ui/modals.js',
  '/js/ui/render.js',
  '/js/ui/charts.js',
  '/js/ui/insights.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

function isFirebaseRequest(url) {
  return (
    url.includes('firebaseio.com') ||
    url.includes('googleapis.com') ||
    url.includes('gstatic.com') ||
    url.includes('firestore')
  );
}

function isCacheableRequest(request, response) {
  return (
    request.method === 'GET' &&
    response &&
    response.ok &&
    (request.url.startsWith('https://') || request.url.startsWith('http://'))
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET' || isFirebaseRequest(request.url)) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (isCacheableRequest(request, response)) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (isCacheableRequest(request, response)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});

self.addEventListener('push', (event) => {
  event.waitUntil(
    self.registration.showNotification('Konteo 05', {
      body: event.data ? event.data.text() : 'Nueva notificacion',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
      tag: 'konteo05-notification'
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
