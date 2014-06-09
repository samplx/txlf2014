/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 fileencoding=utf-8 : */
/*
 *     Copyright 2014 James Burlingame
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */
'use strict';

// ~Salutation~First Name~Last Name~Title~Company~Email~Phone~Zip~badge_id~reprint~type~price~size~addons~
function parseDelimited(fields) {
    var result = {};
    var name = '';
    if (fields[1] !== '') {
        name = fields[1] + ' ';
    }
    if (fields[2] !== '') {
        name += fields[2] + ' ';
    }
    name += fields[3];
    result.n = name;
    result.t = fields[4];
    result.c = fields[5];
    result.e = fields[6];
    result.pm = fields[7];
    return result;
}
   
angular.module('txlfApp')
.controller('MainController', ['$scope', '$sce', '$window', '$rootScope', 'appConfig', 'cordovaService', 
    function MainControllerFactory($scope, $sce, $window, $rootScope, config, cordovaService) {
        $scope.alert = { type: 'success', msg: '' };

        $scope.title = config.title;
        $scope.dates = config.dates;
        $scope.loading = true;
        $scope.showScan = false;
        $scope.showData = false;
        $scope.scanData = {};
        $scope.scanner = null;
        
        var frameHeight = $window.innerHeight - $('#checkInFrame').outerHeight();
        var checkInFrame = 
                '<iframe name="scalereg6" src="' + config.checkInUrl + '" width="100%" height="' + frameHeight + 'px" frameborder="0"></iframe>';
                
        $scope.checkInFrame = function() {
            return $sce.trustAsHtml(checkInFrame);
        };

        $scope.closeAlert = function () {
            $scope.alert.msg = '';
        };
        
        $scope.clickImport = function () {
//            console.log('clickImport: stub');
            $scope.alert= {type: 'success', msg: 'Loading barcode scanner.'};
            $scope.scanner.scan(
                function (result) {
//                    console.log('barcode text="' + result.text + '"');
//                    console.log('barcode format=' + result.format);
//                    console.log('barcode cancelled=' + result.cancelled);
                    if (result.cancelled) {
                        $scope.alert = {type: 'warning', msg: 'Scan cancelled.'};
                    } else if (result.format != 'QR_CODE') {
                        $scope.alert = {type: 'warning', msg: 'Expected QR code format.'};
                    } else {
                        try {
                            $scope.scanData = angular.fromJson(result.text);
                            $scope.showScan = false;
                            $scope.showData = true;
                            if ($scope.scanData.title && ($scope.scanData.t === undefined)) {
                                $scope.scanData.t = $scope.scanData.title;
                            }
                        } catch (e) {
                            var fields = result.text.split('~');
                            if (fields.length >= 7) {
                                $scope.scanData = parseDelimited(fields);
                                $scope.showScan = false;
                                $scope.showData = true;
                            } else {
                                $scope.alert = {type: 'danger', msg :'Unable to extract data from QR code.'};
                            }
                        }
                    }
                    $rootScope.$digest();
                },
                function (error) {
                    $scope.alert = {type: 'warning',
                                    msg: 'Unable to read QR code. Error: ' + error};
                    $rootScope.$digest();
                }
            );
        };
        
        $scope.clickSave = function () {
//            console.log('clickSave: stub');
            var scanData = $scope.scanData;
            var contact = navigator.contacts.create();
            contact.displayName = scanData.n;
            contact.nickname = scanData.n;
            
            contact.name = scanData.n;
            var phoneNumbers = [];
            if (scanData.pw) {
                phoneNumbers.push(new ContactField('work', scanData.pw, false));
            }
            if (scanData.pm) {
                phoneNumbers.push(new ContactField('mobile', scanData.pm, true));
            }
            contact.phoneNumbers = phoneNumbers;
            if (scanData.e) {
                contact.email = [ new ContactField('work', scanData.e, true) ];
            }
            if (scanData.www) {
                contact.urls = [ new ContactField('work', scanData.www, true) ];
            }
            if (scanData.c) {
                var title = scanData.t || '';
                contact.organizations = [ new ContactOrganization(true, 'work', scanData.c, '', title) ] ;
            }
            if (scanData.adr) {
                contact.addresses = [ new ContactAddress(true, 'home', scanData.adr, '', '', '', '', '') ] ;
            }
            contact.note = config.title;
            contact.categories = [ new ContactField('work', config.title, false) ];
            
            contact.save(
                function (success) {
                    $scope.alert.msg = 'Saved contact information.';
                    $scope.showScan = true;
                    $scope.showData = false;
                    $rootScope.$digest();
                }, function (error) {
                    $scope.alert = {type: 'danger', msg: 'Error saving contact: ' + error.code};
                    $scope.showScan = true;
                    $scope.showData = false;
                    $rootScope.$digest();
                }
            );
        };
        
        $scope.clickScan = function () {
            cordovaService.ready.then(function () {
                console.log('clickScan: stub');
                if ($scope.scanner) {
                    $scope.showScan = true;
                }
            });
        }

        cordovaService.ready.then(function () {
            $scope.loading = false;
            if (!cordova || !cordova.plugins) {
                $scope.alert.type = 'danger';
                $scope.alert.msg = 'Cordova plugin is missing.';
                console.log('window.cordova='+JSON.stringify(window.cordova));
            } else if (!cordova.plugins.barcodeScanner) {
                $scope.alert.type = 'danger';
                $scope.alert.msg = 'Barcode plugin is missing.';
            } else if (!navigator.contacts) {
                $scope.alert.type = 'danger';
                $scope.alert.msg = 'Contact plugin is missing.';
            } else {
                $scope.showScan = true;
                $scope.scanner = cordova.plugins.barcodeScanner;
            }
        });
    }
]);

