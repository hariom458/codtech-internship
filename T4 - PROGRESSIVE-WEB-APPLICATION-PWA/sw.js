const CACHE_NAME = 'e-commerce-pwa-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  'https://i.pinimg.com/550x/c5/69/13/c56913eebb22029d5402c3cf2ae1e8b4.jpg',
  'https://i.pinimg.com/736x/d7/5f/20/d75f204be2f2286587efa552301c4491.jpg',
  'https://i.pinimg.com/236x/e3/69/e8/e369e870f6efb5f4e3a1765c9f35dac8.jpg',
  'https://i.pinimg.com/736x/5c/0c/e0/5c0ce0765bc0c1b6a57058f5404ab035.jpg'

];

// 1. Installation: Open a cache and add the "app shell" files to it.
self.addEventListener('install', event => {
  console.log('SW: Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(err => console.log('SW: Cache open failed', err))
  );
});

// 2. Fetch: Intercept network requests and serve from cache if available.
self.addEventListener('fetch', event => {
  console.log('SW: Fetch event for', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If the request is in the cache, return the cached response
        if (response) {
          console.log('SW: Found in cache', event.request.url);
          return response;
        }
        
        // If the request is not in the cache, fetch it from the network
        console.log('SW: Not in cache, fetching from network', event.request.url);
        return fetch(event.request);
      })
  );
});

// 3. Activate: Clean up old caches.
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});


// 4. Push: Listen for push notifications from a server.
self.addEventListener('push', event => {
  console.log('SW: Push event received');
  const data = event.data ? event.data.json() : { title: 'New Notification', body: 'Something new happened!' };
  
  const title = data.title;
  const options = {
    body: data.body,
    icon: '/images/icon-192x192.png',
    badge: '/images/icon-192x192.png' // Badge for Android notifications bar
  };

  event.waitUntil(self.registration.showNotification(title, options));
});