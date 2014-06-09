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

// angular initialization
var txlfApp = angular.module('txlfApp', [
    'ngSanitize',
    'ngRoute',
    'ngTouch',
    'ui.bootstrap'
]);

txlfApp.constant('appConfig', {
    'title' : 'Texas Linux Festival 2014',
    'dates' : 'Friday June 13 and Saturday June 14',
    'sessionScheduleUrl' : 'http://2014.texaslinuxfest.org/sessions_mobile',
    'sponsorsUrl' : 'http://2014.texaslinuxfest.org/sponsors_mobile',
    'checkInUrl' : 'https://register.texaslinuxfest.org/reg6/checkin',
    // use UTC since we do not know what phone timezone is
    // test date Jan 1, 2014, actual June 13, 2014
    // debug 
    // 'checkInStart' : Date.UTC(2014, 0, 1, 5)
    // release
    'checkInStart': Date.UTC(2014, 5, 13, 5)
});

txlfApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'views/main.html', controller: 'MainController'});
    $routeProvider.when('/venue', {templateUrl: 'views/venue.html', controller: 'MainController'});
    $routeProvider.when('/sessions', {templateUrl: 'views/sessions.html', controller: 'SessionsController'});
    $routeProvider.when('/session/:sessionId', {templateUrl: 'views/session.html', controller: 'SessionController'});
    $routeProvider.when('/sponsors', {templateUrl: 'views/sponsors.html', controller: 'SponsorsController'});
    $routeProvider.when('/sponsor/:sponsorId', {templateUrl: 'views/sponsor.html', controller: 'SponsorController'});
    $routeProvider.when('/scan', {templateUrl: 'views/scan.html', controller: 'MainController'});
    $routeProvider.when('/checkIn', {templateUrl: 'views/check-in.html', controller: 'MainController'});
    $routeProvider.otherwise({redirectTo: '/home'});
}]);

