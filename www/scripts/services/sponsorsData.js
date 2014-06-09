'use strict';

var _sponsorsData = null;

function sponsorsCompare(a, b) {
    return (b.levelId - a.levelId);
}

function parseSponsorsData(jsonpData) {
    angular.forEach(jsonpData.nodes, function (item) {
        /* jshint camelcase: false */
        var n = _sponsorsData.list.length;
        var sponsor = _sponsorsData.list[n] = {};
        sponsor.title = item.node.title;
        sponsor.logo = item.node.field_sponsor_logo;
        sponsor.nid = item.node.nid;
        sponsor.link = item.node.field_sponsor_link;
        sponsor.body = item.node.body;
        sponsor.level = item.node.field_sponsorship_level;
        switch (sponsor.level) {
            case 'Diamond':
                sponsor.levelId = 50;
                break;
            case 'Platinum':
                sponsor.levelId = 40;
                break;
            case 'Gold':
                sponsor.levelId = 30;
                break;
            case 'Silver':
                sponsor.levelId = 20;
                break;
            case 'Bronze':
                sponsor.levelId = 15;
                break;
            case 'Community Exhibitor':
                sponsor.levelId = 10;
                break;
            case 'Media':
                sponsor.levelId = 5;
                break;
            case 'Network':
                sponsor.levelId = 3;
                break;
            default:
                console.log('Unknown sponsor.level='+sponsor.level);
                sponsor.level = 0;
                break;
        }
    });
}

angular.module('txlfApp')
.factory('sponsorsData', ['$http', '$window', 'appConfig',
    function SponsorsDataFactory($http, $window, config) {
        _sponsorsData = {
            _promise : null,
            list : [],
            loaded : false
        };

        _sponsorsData.load = function() {
            if (_sponsorsData._promise === null) {
                console.log('loading sponsors: ' + config.sponsorsUrl);
                _sponsorsData._promise = $http.get(config.sponsorsUrl)
                        .success(function(data) {
                            console.log('got sponsors data');
                            parseSponsorsData(data);
                            console.log('parseSponsorsData complete');
                            _sponsorsData.list.sort(sponsorsCompare);
                            console.log('sort complete');
                            _sponsorsData.loaded = true;
                        })
                        .error(function(data, status) {
                            console.log('sponsors data load error: ' + status);
                            if (!_sponsorsData.loaded) {
                                $window.alert('Unable to load sponsor data.');
                            }
                        });
            }
            return _sponsorsData._promise;
        };

        return _sponsorsData;
    }
]);

