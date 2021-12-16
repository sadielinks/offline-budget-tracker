// service-worker.js to utilize caches to run offline
const FILES_TO_CACHE = [
    // files from app
    '/',
    '/index.html',
    '/index.js',
    '/indexedDb.js',
    '/service-worker.js',
    '/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    // links within index.html doc
    '/https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    '/https://cdn.jsdelivr.net/npm/chart.js@2.8.0',
];

// mini project:
const CACHE_NAME = 'static-cache-v1';
const RUNTIME = 'runtime';
const DATA_CACHE_NAME = 'data-cache-v1';

// install sw
self.addEventListener("install", (event) => {
    // pre cache all static assets
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
    );
    self.skipWaiting();
});

// activate sw
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            // https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/keys
            .keys()
            .then((keyList) => {
                return keyList.filter(
                    (keyList) => !currentCaches.includes(keyList)
                );
            })
            .then((cachesToDelete) => {
                return Promise.all(
                    cachesToDelete.map((cacheToDelete) => {
                        return caches.delete(cacheToDelete);
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// fetch sw
self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return caches.open(RUNTIME).then((cache) => {
                    return fetch(event.request).then((response) => {
                        return cache.put(event.request, response.clone()).then(() => {
                            return response;
                        });
                    });
                });
            })
        );
    }
});
