// Prancheta · Desenvolvido por Pedro Baschoni
// Guarda o jogo no aparelho para funcionar offline. Troque a versão a cada atualização.
const CACHE = 'prancheta-v1.3';
const FILES = [
  './', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png',
  './fonts/barlow-latin-400-normal.woff2', './fonts/barlow-latin-500-normal.woff2',
  './fonts/barlow-latin-600-normal.woff2', './fonts/barlow-latin-700-normal.woff2',
  './fonts/big-shoulders-display-latin-700-normal.woff2', './fonts/big-shoulders-display-latin-800-normal.woff2',
  './fonts/big-shoulders-display-latin-900-normal.woff2'
];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // rede primeiro (pega as atualizações); se estiver offline, usa a cópia guardada
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
