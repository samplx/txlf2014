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
.controller('MenuController', ['$scope', '$location', '$rootScope', 'appConfig',
    function MenuControllerFactory($scope, $location, $rootScope, config) {
        $scope.page = $location.path();
        var now = new Date();
        $scope.checkInEnabled = (now.getTime() > config.checkInStart);
        
        $rootScope.$on('$locationChangeSuccess', function (event, newUrl) {
            $scope.page = $location.path();
            now = new Date();
            $scope.checkInEnabled = (now.getTime() > config.checkInStart);
        });
    }
]);

