// Service Worker for NPO Event Manager

const CACHE_NAME = 'npo-event-manager-v1';
const OFFLINE_PAGE = '/offline.html';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/shortcut-events.svg',
  '/icons/shortcut-registrations.svg'
];

// Install event - cache static assets and offline page
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker...');
  
  // Skip waiting to activate this service worker immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell and content...');
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker...');
  
  // Take control of all clients immediately
  self.clients.claim();
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache or network with offline fallback
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip browser extensions and APIs
  const url = new URL(event.request.url);
  if (!url.protocol.includes('http')) return;
  if (url.pathname.startsWith('/api/')) {
    // For API requests, try network first with timeout, fall back to offline response
    event.respondWith(
      fetchWithTimeout(event.request.clone(), 3000)
        .catch(() => {
          return caches.match(OFFLINE_PAGE);
        })
    );
    return;
  }
  
  // For everything else, use a stale-while-revalidate strategy
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Return cached response if available, update cache in background
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          // Don't cache non-successful responses
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          
          // Clone and cache the new response
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return networkResponse;
        })
        .catch(error => {
          console.log('[Service Worker] Fetch failed; returning offline page instead.', error);
          return caches.match(OFFLINE_PAGE);
        });
        
      return cachedResponse || fetchPromise;
    })
  );
});

// Push notification event
self.addEventListener('push', event => {
  console.log('[Service Worker] Push received:', event);
  
  let notificationData = {};
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData = { 
        title: 'New Notification',
        body: event.data.text()
      };
    }
  }
  
  const title = notificationData.title || 'NPO Event Manager';
  const options = {
    body: notificationData.body || 'Something important happened!',
    icon: '/icons/icon.svg',
    badge: '/icons/icon.svg',
    data: notificationData.data || {},
    tag: notificationData.tag || 'default',
    actions: notificationData.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification click received:', event);
  
  event.notification.close();
  
  let targetUrl = '/';
  if (event.notification.data && event.notification.data.url) {
    targetUrl = event.notification.data.url;
  }
  
  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow(targetUrl);
      })
  );
});

// Helper function - fetch with timeout
function fetchWithTimeout(request, timeout) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Network request timed out'));
    }, timeout);
    
    fetch(request).then(
      response => {
        clearTimeout(timeoutId);
        resolve(response);
      },
      err => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
}
