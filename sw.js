const CACHE = 'registro-producao-v5';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  // não intercepta chamadas ao Firestore nem ao Worker de IA — só o app shell
  if(e.request.url.includes('firestore.googleapis.com') || e.request.url.includes('workers.dev')) return;
  e.respondWith(
    caches.match(e.request).then(cached=>cached || fetch(e.request))
  );
});
