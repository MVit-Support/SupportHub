const CACHE_NAME = 'mv-polering-support-v13';
const APP_SHELL = [
  './',
  './index.html',
  './guides.js',
  './ai-config.js',
  './ai.js',
  './contact.js',
  './open-in-chrome.js',
  './manifest.webmanifest',
  './mv-polering-logo.png',
  './icon-192.png',
  './icon-512.png',
  './icon-192-maskable.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (new URL(event.request.url).origin !== self.location.origin) return; // eksterne kald (fx Gemini) rører vi ikke

  // HTML og guides.js: hent altid nyeste fra nettet først, fald tilbage til cache offline.
  // Ellers ser brugerne aldrig opdateringer, før cachen manuelt bumpes.
  const url = new URL(event.request.url);
  const isHtml = event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') || '').includes('text/html') ||
    url.pathname.endsWith('.js');
  if (isHtml) {
    event.respondWith(
      // cache:'no-cache' = spørg altid serveren om der er en nyere version, i stedet for at tage browserens HTTP-cache
      fetch(event.request, { cache: 'no-cache' }).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
