const CACHE_NAME = 'tib-nabwi-v4'; // ورژن چینج کر دیں تاکہ نیا cache بنے
const URLS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. INSTALL - فائلیں Cache کریں
self.addEventListener('install', event => {
  self.skipWaiting(); // فوراً نیا SW ایکٹیو ہو جائے
  event.waitUntil(
    caches.open(CACHE_NAME)
     .then(cache => {
       console.log('Opened cache');
       return cache.addAll(URLS_TO_CACHE);
     })
  );
});

// 2. FETCH - پہلے Cache چیک کریں، نہ ملے تو Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
     .then(response => {
       // Cache میں ہے تو وہی دے دیں ورنہ fetch کریں
       return response || fetch(event.request);
     })
     .catch(() => {
       // اگر نیٹ بھی نہیں اور cache بھی نہیں تو index.html دے دیں
       return caches.match('./index.html');
     })
  );
});

// 3. ACTIVATE - پرانے cache ڈیلیٹ کریں
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // فوراً سارے pages کنٹرول کر لیں
});
