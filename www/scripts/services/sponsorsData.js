'use strict';

var _sponsorsData = null;

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
                _sponsorsData._promise = $http.jsonp(config.sponsorsUrl)
                        .success(function(data) {
                            _sponsorsData.data = data;
                            _sponsorsData.list = parseSponsorsData(data);
                            _sponsorsData.loaded = true;
                        })
                        .error(function() {
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

/**
 *  JSONP call-back entry.
 */
function sponsors(data) {
    var sponsorsCompare = function (a, b) {
        return (b.levelId - a.levelId);
    };
    
    parseSponsorsData(data);

    _sponsorsData.list.sort(sponsorsCompare);
    _sponsorsData.loaded = true;
    // console.log('sponsors data loaded, _sponsorsData.list.length='+_sponsorsData.list.length);
}

