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

angular.module('txlfApp')
.controller('MainController', ['$scope', '$sce', '$window', 'appConfig', 'cordovaService', 
    function MainControllerFactory($scope, $sce, $window, config, cordovaService) {
        $scope.alert = { type: 'success', msg: '' };

        $scope.title = config.title;
        $scope.dates = config.dates;
        $scope.loading = true;
        $scope.showScan = false;
        $scope.showData = false;
        $scope.scanData = {};
        
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
            console.log('clickImport: stub');
            $window.plugins.barcodeScanner.scan(
                function (result) {
                    console.log('barcode text="' + result.text + '"');
                    console.log('barcode format=' + result.format);
                    console.log('barcode cancelled=' + result.cancelled);
                    $scope.scanData = angular.fromJson(result.text);
                    $scope.showScan = false;
                    $scope.showData = true;
                },
                function (error) {
                    $scope.alert.type = 'warning';
                    $scope.alert.msg = 'Unable to read QR code.';
                }
            );
        };
        
        $scope.clickSave = function () {
            console.log('clickSave: stub');
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
            contract.note = config.title;
            contact.categories = [ new ContactField('work', config.title, false) ];
            
            contact.save(
                function (success) {
                    $scope.alert.msg = 'Saved contact information.';
                }, function (error) {
                    $scope.alert.type = 'danger';
                    $scope.alert.msg = 'Error saving contact: ' + error.code;
                }
            );
        };
        
        $scope.clickCheckIn = function () {
            if ($scope.firstName === undefined) {
                console.log('clickCheckIn(): need firstName');
                $('#checkInFirstName').focus();
            } else if ($scope.lastName === undefined) {
                console.log('clickCheckIn(): need lastName');
                $('#checkInLastName').focus();
            } else if ($scope.emailAddress === undefined) {
                console.log('clickCheckIn(): need emailAddress');
                $('#checkInEmailAddress').focus();
            } else if ($scope.zipCode === undefined) {
                console.log('clickCheckIn(): need zipCode');
                $('#checkInZipCode').focus();
            } else if ($scope.checkInForm.$valid) {
                console.log('clickCheckIn(): stub');
                console.log('$scope.firstName='+$scope.firstName);
                console.log('$scope.lastName='+$scope.lastName);
                console.log('$scope.emailAddress='+$scope.emailAddress);
                console.log('$scope.zipCode='+$scope.zipCode);
                console.log('$scope.checkInForm.$valid='+$scope.checkInForm.$valid);
                $scope.alert.msg = 'I guess it worked.';
            }
        };
        
        cordovaService.ready.then(function () {
            $scope.loading = false;
            if (!cordova.plugins) {
                $scope.alert.type = 'danger';
                $scope.alert.msg = 'Cordova plugins are missing.';
            } else if (!cordova.plugins.barcodeScanner) {
                $scope.alert.type = 'danger';
                $scope.alert.msg = 'Barcode scanner plugin is missing.';
            } else if (!navigator.contacts) {
                $scope.alert.type = 'danger';
                $scope.alert.msg = 'Contact plugin is missing.';
            } else {
                $scope.showScan = true;
            }
        });
        
        $scope.clickScan = function () {
            cordovaService.ready.then(function () {
                console.log('clickScan: stub');
            });
        }
    }
]);

