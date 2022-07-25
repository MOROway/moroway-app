//cache-name
var CACHE_NAME = "moroway-app-sw-web-8.0.1";

//list of all files related to moroway app
var urlsToCache = ['.','ABOUT','LICENSE.txt','LICENSE_ASSETS.txt','assets/asset0.png','assets/asset1.png','assets/asset10.png','assets/asset11.png','assets/asset12.png','assets/asset13.png','assets/asset14.png','assets/asset15.png','assets/asset16.png','assets/asset17.png','assets/asset18.png','assets/asset19.png','assets/asset2.png','assets/asset20.png','assets/asset21.png','assets/asset22.png','assets/asset23.png','assets/asset24.png','assets/asset25.png','assets/asset26.png','assets/asset27.png','assets/asset28.png','assets/asset29.png','assets/asset3.png','assets/asset30.png','assets/asset31.png','assets/asset32.png','assets/asset33.png','assets/asset34.png','assets/asset35.png','assets/asset36.png','assets/asset37.png','assets/asset4.png','assets/asset5.png','assets/asset6.png','assets/asset7.png','assets/asset8.png','assets/asset9.jpg','assets/asset_background_train.png','assets/audio_asset_0.ogg','assets/audio_asset_1.ogg','assets/audio_asset_2.ogg','assets/audio_asset_3.ogg','assets/audio_asset_4.ogg','assets/audio_asset_5.ogg','assets/audio_asset_6.ogg','assets/audio_asset_crash.ogg','assets/audio_asset_switch.ogg','assets/helpasset1_bug_report.png','assets/helpasset3_source.png','assets/helpasset4_translate.jpg','error/','favicon.ico','help/','manifest.webmanifest','settings/','src/css/general.css','src/css/help.css','src/css/settings.css','src/css/styling.css','src/js/appdata.js','src/js/error.js','src/js/error_handler.js','src/js/general.js','src/js/help.js','src/js/init.js','src/js/scripting.js','src/js/scripting_worker_animate.js','src/js/settings.js','src/js/whatsnew.js','src/js_platform/general.js','src/js_platform/help.js','src/js_platform/scripting.js','src/lib/README.md','src/lib/open_fonts/google/MaterialIcons/LICENSE.txt','src/lib/open_fonts/google/MaterialIcons/MaterialIcons-Regular.ttf','src/lib/open_fonts/google/MaterialIcons/font.css','src/lib/open_fonts/google/Roboto/COPYRIGHT.txt','src/lib/open_fonts/google/Roboto/LICENSE.txt','src/lib/open_fonts/google/Roboto/Roboto-Medium.ttf','src/lib/open_fonts/google/Roboto/Roboto-Regular.ttf','src/lib/open_fonts/google/Roboto/font.css','whatsnew/'];

//service worker code to let them do their service work
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response !== undefined) {
                return response;
            }
            var fetchRequest = event.request.clone();
            return fetch(fetchRequest)
                .then(function (response) {
                    return response;
                })
                .catch(function (error) {
                    return caches.open(CACHE_NAME).then(function (cache) {
                        return cache.match(event.request, {ignoreSearch: true});
                    });
                });
        })
    );
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(
                keyList.map(function (key, i) {
                    if (key !== CACHE_NAME) {
                        return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});
