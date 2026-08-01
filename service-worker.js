const CACHE = "karigar-v2";

const FILES = [
"./",
"./index.html",
"./worker.html",
"./attendance.html",
"./report.html",

"./css/style.css",

"./js/app.js",
"./js/worker.js",
"./js/attendance.js",
"./js/report.js",

"./manifest.json"
];

self.addEventListener("install", event => {

event.waitUntil(

caches.open(CACHE).then(cache => cache.addAll(FILES))

);

self.skipWaiting();

});

self.addEventListener("activate", event => {

event.waitUntil(

caches.keys().then(keys =>

Promise.all(

keys.map(key => {

if(key !== CACHE){

return caches.delete(key);

}

})

)

)

);

self.clients.claim();

});

self.addEventListener("fetch", event => {

event.respondWith(

caches.match(event.request)

.then(response => response || fetch(event.request))

);

});