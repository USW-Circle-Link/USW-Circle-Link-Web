// sw.js

const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/script/main.js',
  '/index.html'
];

// 서비스 워커 설치 및 캐시 생성
self.addEventListener('install', event => {
  // 설치 중인 서비스 워커가 완료될 때까지 기다림
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // 모든 필수 파일을 캐시에 추가
        return cache.addAll(urlsToCache);
      })
  );
});

// 요청을 가로채 캐시 응답 또는 네트워크 요청
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // 캐시에서 응답을 찾은 경우 이를 반환
          return response;
        }
        // 네트워크에서 요청을 하고, 그 응답을 캐시에 추가
        return fetch(event.request).then(
          networkResponse => {
            // 응답이 유효한지 확인
            if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // 네트워크 응답을 캐시에 복사
            let responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
  );
});

// 활성화 이벤트 - 캐시 갱신 처리
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 화이트리스트에 포함되지 않은 캐시는 모두 삭제
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
