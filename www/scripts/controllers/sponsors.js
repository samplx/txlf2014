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
.controller('SponsorsController', ['$scope', 'appConfig', 'sponsorsData',
    function SponsorsControllerFactory($scope, config, sponsors) {
        $scope.title = config.title;
        $scope.sponsors = [];
        $scope.showDetails = false;
        $scope.showList = false;
        $scope.loading = true;
        $scope.details = {};
        
        $scope.clickDetails = function (nid) {
            for (var n=0, len= $scope.sponsors.length; n < len; n++) {
                if ($scope.sponsors[n].nid == nid) {
                    $scope.detail = $scope.sponsors[n];
                    $scope.showList = false;
                    $scope.showDetails = true;
                    break;
                }
            }
        };

        $scope.clickBack = function () {
            $scope.showDetails = false;
            $scope.showList = true;
        };
        
        sponsors.load().then(function () {
            $scope.sponsors = sponsors.list;
            $scope.showList = true;
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            if (sponsors.loaded) {
                $scope.sponsors = sponsors.list;
                $scope.showList = true;
            }
        });
    }
]);

