
// 3D Slot Machine Service Worker
const CACHE_NAME = 'slot-machine-v1.0.0';
const urlsToCache = [
    './',
    './index.html',
    './css/main.css',
    './js/slot-game.js',
    './libs/three.min.js',
    './test-validation.html'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});
