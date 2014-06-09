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
.controller('SessionsController', ['$scope', 'appConfig', 'sessionsData',
    function SessionsControllerFactory($scope, config, sessions) {
        $scope.title = config.title;
        $scope.sessions = [];
        $scope.searchFilter = '';
        $scope.sortBy = 'time';
        $scope.loading = true;
        $scope.showDetails = false;
        $scope.showList = false;
        $scope.details = {};
        
        var timeSort = function (a, b) {
            return (a.date.getTime() - b.date.getTime());
        };

        var presenterSort = function (a, b) {
            var aName = a.displayName.toLowerCase();
            var bName = a.displayName.toLowerCase();
            if (aName < bName) {
                return -1;
            }
            if (aName > bName) {
                return 1;
            }
            return 0;
        };
        
        var titleSort = function (a, b) {
            var aTitle = a.title.toLowerCase();
            var bTitle = b.title.toLowerCase();
            if (aTitle < bTitle) {
                return -1;
            }
            if (aTitle > bTitle) {
                return 1;
            }
            return 0;
        };
        
        var experienceSort = function (a, b) {
            return (a.experienceLevel - b.experienceLevel);
        };
        
        $scope.sessionSearch = function() {
            if ($scope.searchFilter === '') {
                $scope.sessions = sessions.list;
            } else {
                var list = [];
                var re, e;
                try {
                    re = new RegExp($scope.searchFilter, 'i');
                } catch (e) {
                    window.alert('Invalid Regular-Expression: ' + $scope.searchFilter);
                    re = new RegExp(/./);
                }
                angular.forEach(sessions.list, function (session) {
                    // title, body, displayName, bio, company, timeslot
                    if (re.test(session.title) ||
                        re.test(session.body) ||
                        re.test(session.displayName) ||
                        re.test(session.bio) ||
                        re.test(session.company) ||
                        re.test(session.timeslot) ) {
                        list.push(session);
                    }
                });
                $scope.sessions = list;
            }
            console.log('sessionSearch, length='+$scope.sessions.length);
            $scope.sessionSort();
        };

        $scope.sessionSort = function(sortBy) {
            if (sortBy !== undefined) {
                $scope.sortBy = sortBy;
            }
            if ($scope.sessions) {
                console.log('sessionSort, sortBy='+$scope.sortBy);
                if ($scope.sortBy == 'presenter') {
                    $scope.sessions.sort(presenterSort);
                } else if ($scope.sortBy == 'title') {
                    $scope.sessions.sort(titleSort);
                } else if ($scope.sortBy == 'experience') {
                    $scope.sessions.sort(experienceSort);
                } else {
                    $scope.sessions.sort(timeSort);
                }
            }
        };

        $scope.clickDetails = function (nid) {
            for (var n=0, len= $scope.sessions.length; n < len; n++) {
                if ($scope.sessions[n].nid == nid) {
                    $scope.detail = $scope.sessions[n];
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
        
        sessions.load().then(function () {
            $scope.sessions = sessions.list;
            $scope.sessionSort();
            $scope.loading = false;
            $scope.showList = true;
        }, function () {
            $scope.loading = false;
            if (sessions.loaded) {
                $scope.sessions = sessions.list;
                $scope.sessionSort();
                $scope.showList = true;
            }
        });
    }
]);

