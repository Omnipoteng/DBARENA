const CACHE_NAME = 'dbarena-pwa-cache-v1';

// Aset yang akan di-precache saat instalasi service worker
const PRECACHE_ASSETS = [
  '/offline',
  '/icon-192.png',
  '/icon-512.png',
  '/images/logo-dba.png',
];

// Event Install: Menyiapkan cache dan menyimpan aset statis dasar
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Membuka cache dan melakukan precaching');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      // Memaksa service worker yang baru untuk langsung aktif
      return self.skipWaiting();
    })
  );
});

// Event Activate: Membersihkan cache lama jika ada pembaruan versi cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Mengklaim kontrol semua tab klien agar SW langsung aktif sepenuhnya
      return self.clients.claim();
    })
  );
});

// Event Fetch: Menangani request jaringan dengan strategi Network-First
self.addEventListener('fetch', (event) => {
  // Hanya tangani request GET (bukan POST, PUT, DELETE, dll)
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Jangan tangani request chrome-extension, internal, atau next-dev HMR
  if (
    url.protocol === 'chrome-extension:' || 
    url.pathname.startsWith('/_next/') ||
    url.pathname.includes('webpack-hmr')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Jika request berhasil, simpan salinan respons di cache untuk offline
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Jika gagal koneksi (offline), coba ambil dari cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // Jika halaman navigasi HTML tidak ada di cache, arahkan ke offline fallback page
          if (event.request.mode === 'navigate') {
            return caches.match('/offline');
          }

          // Jika tidak ada di cache dan bukan navigasi halaman, kembalikan respons kosong/error
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        });
      })
  );
});
