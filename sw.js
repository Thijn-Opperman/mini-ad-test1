"use strict";

const CACHE_VERSION = "mini-lesson-v1";
const PRECACHE_NAME = CACHE_VERSION + "-precache";
const RUNTIME_NAME = CACHE_VERSION + "-runtime";

const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/assets/bea.png",
  "/assets/duo%20art.png",
  "/assets/duo%20beginner%20lessons.png",
  "/assets/duo%20culture.png",
  "/assets/duo%20flying.png",
  "/assets/duo%20food.png",
  "/assets/duo%20happy.png",
  "/assets/duo%20music.png",
  "/assets/duo%20travel.png",
  "/assets/eddy.png",
  "/assets/eyes%20duo.png",
  "/assets/junior.png",
  "/assets/xp%20foto.png",
  "/assets/audio/en-nl/art.mp3",
  "/assets/audio/en-nl/beginner.mp3",
  "/assets/audio/en-nl/culture.mp3",
  "/assets/audio/en-nl/food.mp3",
  "/assets/audio/en-nl/pop.mp3",
  "/assets/audio/en-nl/travel.mp3",
  "/assets/audio/nl-en/art.mp3",
  "/assets/audio/nl-en/beginner.mp3",
  "/assets/audio/nl-en/culture.mp3",
  "/assets/audio/nl-en/food.mp3",
  "/assets/audio/nl-en/pop.mp3",
  "/assets/audio/nl-en/travel.mp3"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(PRECACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE_URLS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return key.indexOf("mini-lesson-") === 0 && key !== PRECACHE_NAME && key !== RUNTIME_NAME;
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

function isAssetRequest(url) {
  return url.pathname.indexOf("/assets/") === 0;
}

function isAppShellRequest(url) {
  return url.pathname === "/" || url.pathname === "/index.html";
}

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (isAppShellRequest(requestUrl)) {
    event.respondWith(
      fetch(event.request).then(function (response) {
        const copy = response.clone();
        caches.open(PRECACHE_NAME).then(function (cache) {
          cache.put("/index.html", copy);
        });
        return response;
      }).catch(function () {
        return caches.match("/index.html");
      })
    );
    return;
  }

  if (isAssetRequest(requestUrl)) {
    event.respondWith(
      caches.match(event.request).then(function (cached) {
        if (cached) {
          return cached;
        }

        return fetch(event.request).then(function (response) {
          if (!response || response.status !== 200) {
            return response;
          }

          const copy = response.clone();
          caches.open(RUNTIME_NAME).then(function (cache) {
            cache.put(event.request, copy);
          });
          return response;
        });
      })
    );
  }
});
