const CACHE_NAME = "static_cache"

const STATIC_ASSETS =  [
    '/Currency.html',
    '/Currency.css',
    'bg.jpeg',
    'currency-list.js',
    'Currency.js',
    'exchange.png'
]

async function preCache() {
    const cache = await caches.open(CACHE_NAME)
    return cache.addAll(STATIC_ASSETS)
}

async function cleanupCache() {
    const key = await caches.keys()
    const keysToDelete = keys.map(key => {
        if (key !== CACHE_NAME) {
            return caches.delete(key)
        }
    })
    return Promise.all(keysToDelete)
}

self.addEventListener('install', event => {
    console.log("[SW] installed");
    self.skipWaiting()
    event.waitUntil(preCache())
   
})

self.addEventListener('activate', event => {
    console.log("[SW] activated");
    event.waitUntil(cleanupCache)
})

async function fetchAssets(event) {
    try{
        const response = await fetch(event.request)
        return response
    }
    catch(err) {
        const cache = caches.open(CACHE_NAME)
        return (await cache).match(event.request)
    }
}
self.addEventListener('fetch', event => {
    console.log("[SW] fetched");
    event.respondWith(fetchAssets(event))
})