'use strict';

angular.module('txlfApp')
.service('cordovaService', ['$document', '$q', '$window',
    function CordovaServiceFactory($document, $q, $window) {
        var d = $q.defer();
        var resolved = false;
        
        this.ready = d.promise;

        console.log('cordovaService: adding deviceready listener');        
        document.addEventListener('deviceready', function () {
            console.log('cordovaService: deviceready fired.');
            resolved = true;
            d.resolve(window.cordova);
        });
        
        // just in case we missed the event, use a timeout
        setTimeout(function () {
            console.log('cordovaService: timeout fired.');
            if (!resolved && window.cordova) {
                d.resolve(window.cordova);
            }
        }, 3000);
    }
]);

