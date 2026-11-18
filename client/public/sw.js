// Service worker mínimo: deixa o app instalável e abre a "casca" mesmo sem internet.
// Rede primeiro (sempre pega a versão nova do jogo); o cache só entra quando a rede falha.
// O jogo em si precisa do servidor, então não há modo offline de jogo.
const CACHE = 'classroom-escape-v2';

// Na instalação, guarda a página e os arquivos que ela usa (JS/CSS com hash, ícones),
// senão o que foi carregado antes do service worker ativar nunca entraria no cache.
async function precacheShell() {
  const cache = await caches.open(CACHE);
  const response = await fetch('/', { cache: 'reload' });
  if (!response.ok) return;
  await cache.put('/', response.clone());

  const html = await response.text();
  const urls = [...html.matchAll(/(?:src|href)="(\/[^"]+)"/g)].map((match) => match[1]);
  await Promise.all(urls.map((url) => cache.add(url).catch(() => undefined)));
}

self.addEventListener('install', (event) => {
  event.waitUntil(precacheShell().catch(() => undefined).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE).map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  // Só arquivos do próprio jogo. O socket (tempo real) e outras origens passam direto.
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/socket.io')) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => (await caches.match(request)) ?? (request.mode === 'navigate' ? await caches.match('/') : undefined) ?? Response.error()),
  );
});
