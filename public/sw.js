// Service Worker for CRM System
// This provides offline support and advanced caching strategies

const CACHE_NAME = 'cipm-crm-v2'
const STATIC_CACHE_NAME = 'cipm-static-v2'
const API_CACHE_NAME = 'cipm-api-v2'

// Files to cache for offline support
const STATIC_FILES = [
  '/',
  '/login',
  '/register',
  '/offline',
  '/manifest.json',
  '/logo.svg'
]

// API endpoints to cache with different strategies
const API_ENDPOINTS = {
  // Long cache for rarely changing data
  STATIC_DATA: [
    '/api/config',
    '/api/system'
  ],
  // Medium cache for moderately changing data
  SEMI_STATIC_DATA: [
    '/api/cursos',
    '/api/videos',
    '/api/instructores'
  ],
  // Short cache for frequently changing data
  DYNAMIC_DATA: [
    '/api/estudiantes',
    '/api/agendados',
    '/api/schedule'
  ]
}

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache static files
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_FILES)
      }),
      // Cache API endpoints
      caches.open(API_CACHE_NAME).then((cache) => {
        // Pre-cache some critical API endpoints if available
        return Promise.resolve()
      })
    ]).then(() => {
      // Skip waiting to activate immediately
      return self.skipWaiting()
    })
  )
})

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE_NAME && 
                cacheName !== API_CACHE_NAME) {
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests and chrome-extension URLs
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request))
  } else if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(handleStaticAssets(request))
  } else if (url.pathname.startsWith('/')) {
    event.respondWith(handlePageRequest(request))
  }
})

// API request handling with different cache strategies
async function handleAPIRequest(request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  try {
    // Determine cache strategy based on endpoint
    let cacheStrategy = 'network-first'
    let maxAge = 5 * 60 * 1000 // 5 minutes default

    if (API_ENDPOINTS.STATIC_DATA.some(endpoint => pathname.includes(endpoint))) {
      cacheStrategy = 'cache-first'
      maxAge = 24 * 60 * 60 * 1000 // 24 hours
    } else if (API_ENDPOINTS.SEMI_STATIC_DATA.some(endpoint => pathname.includes(endpoint))) {
      cacheStrategy = 'stale-while-revalidate'
      maxAge = 10 * 60 * 1000 // 10 minutes
    }

    return await applyCacheStrategy(request, cacheStrategy, maxAge, API_CACHE_NAME)
  } catch (error) {
    console.error('API request failed:', error)
    
    // Try to return cached version
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline response for API
    return new Response(JSON.stringify({
      error: 'Offline - No cached data available',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Static assets handling (Next.js static files)
async function handleStaticAssets(request) {
  return await applyCacheStrategy(request, 'cache-first', 365 * 24 * 60 * 60 * 1000, STATIC_CACHE_NAME)
}

// Page request handling
async function handlePageRequest(request) {
  try {
    return await applyCacheStrategy(request, 'network-first', 5 * 60 * 1000, CACHE_NAME)
  } catch (error) {
    console.error('Page request failed:', error)
    
    // Try to return cached version
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page
    const offlineResponse = await caches.match('/offline')
    if (offlineResponse) {
      return offlineResponse
    }
    
    // Fallback offline response
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offline - CIPM CRM</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .offline { color: #666; }
          </style>
        </head>
        <body>
          <div class="offline">
            <h1>You're offline</h1>
            <p>Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()">Retry</button>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

// Generic cache strategy implementation
async function applyCacheStrategy(request, strategy, maxAge, cacheName) {
  const cache = await caches.open(cacheName)

  switch (strategy) {
    case 'cache-first':
      return await cacheFirst(request, cache, maxAge)
    
    case 'network-first':
      return await networkFirst(request, cache, maxAge)
    
    case 'stale-while-revalidate':
      return await staleWhileRevalidate(request, cache, maxAge)
    
    default:
      return await networkFirst(request, cache, maxAge)
  }
}

// Cache-first strategy
async function cacheFirst(request, cache, maxAge) {
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    const cachedDate = new Date(cachedResponse.headers.get('cached-date') || 0)
    const isExpired = (Date.now() - cachedDate.getTime()) > maxAge
    
    if (!isExpired) {
      return cachedResponse
    }
  }
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone()
      responseToCache.headers.append('cached-date', new Date().toISOString())
      await cache.put(request, responseToCache)
    }
    return networkResponse
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

// Network-first strategy
async function networkFirst(request, cache, maxAge) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone()
      responseToCache.headers.append('cached-date', new Date().toISOString())
      await cache.put(request, responseToCache)
    }
    return networkResponse
  } catch (error) {
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cache, maxAge) {
  const cachedResponse = await cache.match(request)
  
  // Always try to fetch in background
  const networkResponsePromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone()
      responseToCache.headers.append('cached-date', new Date().toISOString())
      cache.put(request, responseToCache)
    }
    return networkResponse
  }).catch(() => null)
  
  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse
  }
  
  // Otherwise wait for network
  return await networkResponsePromise
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync())
  }
})

async function handleBackgroundSync() {
  // Handle any queued requests that failed when offline
  // This would typically involve checking IndexedDB for failed requests
  // and retrying them when online
  console.log('Background sync triggered')
}

// Push notifications (if needed for the CRM)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body,
      icon: '/logo.svg',
      badge: '/logo.svg',
      data: data.data,
      actions: data.actions || []
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action) {
    // Handle action button clicks
    clients.openWindow(event.notification.data.actionUrl || '/')
  } else {
    // Handle notification click
    clients.openWindow(event.notification.data.url || '/')
  }
})