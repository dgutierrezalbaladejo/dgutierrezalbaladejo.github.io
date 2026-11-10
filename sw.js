// Mi entreno: funciona sin conexión. Sube el número de versión al cambiar la app.
const V = 'mi-entreno-v6';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL.map(u => new Request(u, {cache: 'reload'})))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('mi-entreno') && k !== V).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // La sincronización con Google va siempre por la red.
  if (url.hostname.endsWith('script.google.com') || url.hostname.endsWith('googleusercontent.com')) return;
  // La página: primero la red (para recibir mejoras), y si no hay conexión, la copia guardada.
  if (req.mode === 'navigate') {
    // cache 'no-cache': pregunta siempre al servidor, así las mejoras llegan al momento.
    e.respondWith(fetch(req.url, {cache: 'no-cache'}).then(r => {
      const cp = r.clone(); caches.open(V).then(c => c.put('index.html', cp)); return r;
    }).catch(() => caches.match('index.html').then(r => r || caches.match('./'))));
    return;
  }
  // Iconos, manifiesto y tipografías: copia guardada al momento y se actualiza en segundo plano.
  if (url.origin === location.origin || url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
    e.respondWith(caches.match(req).then(hit => {
      const net = fetch(req).then(r => {
        if (r.ok || r.type === 'opaque') { const cp = r.clone(); caches.open(V).then(c => c.put(req, cp)); }
        return r;
      }).catch(() => hit);
      return hit || net;
    }));
  }
});
