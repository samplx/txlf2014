'use strict';

angular.module('txlfApp')
.service('cordovaService', ['$document', '$q',
    function CordovaServiceFactory($document, $q) {
        var d = $q.defer();
        var resolved = false;
        
        this.ready = d.promise;
        
        document.addEventListener('deviceready', function () {
            resolved = true;
            d.resolve(window.cordova);
        });
        
        // just in case we missed the event, use a timeout
        setTimeout(function () {
            if (!resolved && window.cordova) {
                d.resolve(window.cordova);
            }
        }, 3000);
    }
]);

