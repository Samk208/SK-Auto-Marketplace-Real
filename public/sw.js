/**
 * SK AutoSphere Service Worker
 * 
 * Provides offline caching for static assets and API responses.
 */

const CACHE_NAME = 'sk-autosphere-v2';
const STATIC_ASSETS = [
    '/',
    '/shop',
    '/placeholder.svg',
    '/placeholder-logo.svg',
    '/icon.svg',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Push notification event
// Reference: https://web.dev/push-notifications-overview/
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.message || data.body,
        icon: '/icon.svg',
        badge: '/icon.svg',
        vibrate: [100, 50, 100],
        data: {
            url: data.action_url || data.url || '/',
        },
        actions: data.actions || [
            { action: 'view', title: 'View' },
            { action: 'dismiss', title: 'Dismiss' },
        ],
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'SK AutoSphere', options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'dismiss') return;

    const url = event.notification.data?.url || '/';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Focus existing window if available
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        client.navigate(url);
                        return client.focus();
                    }
                }
                // Open new window
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});

// Fetch event - network-first for HTML, cache-first for assets
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Never intercept Next.js internals. Caching these can break HMR and cause stale chunk/runtime errors.
    if (url.pathname.startsWith('/_next/')) {
        return;
    }

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip API routes (except listings which can be cached briefly)
    if (url.pathname.startsWith('/api/') && !url.pathname.includes('/api/listings')) {
        return;
    }

    // Skip Supabase and external URLs
    if (!url.origin.includes(self.location.origin)) {
        return;
    }

    // Use network-first for HTML pages to avoid stale content
    const isHTMLRequest = request.headers.get('accept')?.includes('text/html');
    
    if (isHTMLRequest) {
        // Network-first for HTML pages
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse.ok) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Offline fallback
                    return caches.match(request).then((cachedResponse) => {
                        return cachedResponse || caches.match('/');
                    });
                })
        );
        return;
    }

    // Cache-first for static assets (images, CSS, JS)
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            // No cache, fetch from network
            return fetch(request)
                .then((networkResponse) => {
                    // Cache successful responses
                    if (networkResponse.ok && request.url.includes(self.location.origin)) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    return new Response('Offline', { status: 503 });
                });
        })
    );
});
