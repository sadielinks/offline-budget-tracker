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
    '/https://cdn.jsdelivr.net/npm/chart.js@2.8.0'
];

// mini project:
const PRECACHE = 'precache-v1';
const CACHE_NAME = "static-cache-v1";
const RUNTIME = 'runtime';
const DATA_CACHE_NAME = "data-cache-v1";

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(PRECACHE)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
            .then(self.skipWaiting())
    );
});

