importScripts('workbox-sw.dev.v2.0.0.js');

const workboxSW = new WorkboxSW();
workboxSW.precache([]);

workboxSW.router.registerRoute(/(.*)articles(.*)\.(?:png|gif|jpg)/,
  workboxSW.strategies.cacheFirst({
    cacheName: 'images-cache',
    cacheExpiration: {
      maxEntries: 2
    },
    cacheableResponse: {
      statuses: [0, 200]
    }
  })
);

const articleHandler = workboxSW.strategies.networkFirst({
  cacheName: 'articles-cache',
  cacheExpiration: {
    maxEntries: 50
  }
});

workboxSW.router.registerRoute('/pages/article*.html', args => {
  return articleHandler.handle(args).then(response => {
    if (!response) {
      return caches.match('pages/offline.html');
    } else if (response.status === 404) {
      return caches.match('pages/404.html');
    }
    return response;
  });
});
