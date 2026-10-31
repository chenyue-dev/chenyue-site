const CACHE_NAME = "shuaistack-pwa-2026-10-31-v3";
const APP_SHELL = [
  "./",
  "./index.html",
  "./articles.html",
  "./projects.html",
  "./project.html",
  "./resources.html",
  "./about.html",
  "./post.html",
  "./install.html",
  "./offline.html",
  "./manifest.webmanifest",
  "./styles.css",
  "./script.js",
  "./site-config.js",
  "./backend.js",
  "./posts-data.js",
  "./projects-data.js",
  "./resources-data.js",
  "./assets/favicon.svg",
  "./assets/icon-192.png",
  "./assets/icon-180.png",
  "./assets/icon-512.png",
  "./assets/avatar.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match("./offline.html");
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
