var CACHE='rekat-v6';
var FILES=['./','rekat-manifest.json','rekat-icon-192.png','rekat-icon-512.png'];
self.addEventListener('install',function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}).catch(function(){}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k.indexOf('rekat-')===0&&k!==CACHE}).map(function(k){return caches.delete(k)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(fetch(r).then(function(res){
    var copy=res.clone();caches.open(CACHE).then(function(c){c.put(r,copy)}).catch(function(){});
    return res;
  }).catch(function(){return caches.match(r)}));
});
