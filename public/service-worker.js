// service-worker.js to utilize caches to run offline
const FILES_TO_CACHE = [
    // files from app
    '/',
    '/index.html',
    '/index.js',
    '/db.js',
    '/service-worker.js',
    '/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
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
            .then(keyList => {
                return Promise.all(
                    keyList.map(key => {
                        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                            console.log(key);
                            return caches.delete(key);
                        }
                    })
                );
            })
    );

    self.clients.claim();
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
