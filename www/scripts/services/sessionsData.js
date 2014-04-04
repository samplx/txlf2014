'use strict';

var _sessionsData = null;

function parseSessionsData(jsonpData) {
    angular.forEach(jsonpData.nodes, function (item) {
        /* jshint camelcase: false */
        var n = _sessionsData.list.length;
        var session = _sessionsData.list[n] = {};
        session.title = item.node.title;
        session.room = item.node.field_session_room;
        session.nid = item.node.nid;
        session.slot = item.node.field_session_slot;
        // slot format is
        // 012345678901234
        // Day, MM/DD/YYYY - HH:mmxm - Day, MM/DD/YYYY - HH:mmxm
        // 0123456789
        // - H:mmxm
        // - HH:mmxm
        // timeslot format is
        // Day, HH:mmxm-HH:mmxm
        var firstDash = session.slot.indexOf('-');
        var lastDash = session.slot.indexOf('-', firstDash+1);
        // first second, and now last
        lastDash = session.slot.indexOf('-', lastDash+1);
        var dayOfWeek = session.slot.substr(0, 3);
        var day = parseInt(session.slot.substr(8, 2));
        var month = parseInt(session.slot.substr(5, 2)) - 1;
        var year = parseInt(session.slot.substr(11, 4));
        var startHours;
        var startMinutes;
        var startTime;
        if (':' == session.slot.substr(firstDash + 3, 1)) {
            startHours = parseInt(session.slot.substr(firstDash + 2, 1));
            startMinutes = parseInt(session.slot.substr(firstDash + 4, 2));
            startTime = session.slot.substr(firstDash + 2, 6);
            if (session.slot.substr(firstDash + 6, 2) == 'pm') {
                startHours += 12;
            }
        } else {
            startHours = parseInt(session.slot.substr(firstDash + 2, 2));
            startMinutes = parseInt(session.slot.substr(firstDash + 5, 2));
            startTime = session.slot.substr(firstDash + 2, 7);
            if (session.slot.substr(firstDash + 7, 2) == 'pm') {
                startHours += 12;
            }
        }
        var endHours;
        var endMinutes;
        var endTime;
        if (':' == session.slot.substr(lastDash + 3, 1)) {
            endHours = parseInt(session.slot.substr(lastDash + 2, 1));
            endMinutes = parseInt(session.slot.substr(lastDash + 4, 2));
            endTime = session.slot.substr(lastDash + 2, 6);
            if (session.slot.substr(lastDash + 6, 2) == 'pm') {
                startHours += 12;
            }
        } else {
            endHours = parseInt(session.slot.substr(lastDash + 2, 2));
            endMinutes = parseInt(session.slot.substr(lastDash + 5, 2));
            endTime = session.slot.substr(lastDash + 2, 7);
            if (session.slot.substr(lastDash + 7, 2) == 'pm') {
                endHours += 12;
            }
        }
/*
        if (_sessionsData.list.length <  4) {
            console.log('slot     =' + session.slot);
            console.log('firstDash=' + firstDash);
            console.log('lastDash =' + lastDash);
            console.log('start: hours=' + startHours + ', minutes='+startMinutes + ', time="'+startTime+'"');
            console.log('end: hours=' + endHours + ', minutes='+endMinutes + ', time="'+endTime+'"');
            console.log('dayofweek=' + dayOfWeek);
            console.log('yyyy/mm/dd=' + year + '/' + month + '/' + day);
        }
 */
        session.timeslot = dayOfWeek + ', ' + startTime + '-' + endTime;
        session.date = new Date(year, month, day, startHours, startMinutes);
        session.body = item.node.body;
        session.firstName = item.node.field_profile_first_name;
        session.lastName = item.node.field_profile_last_name;
        if ((session.firstName !== '') && (session.lastName !== '')) {
            session.displayName = session.firstName + ' ' + session.lastName;
        } else if (session.firstName !== '') {
            session.displayName = session.firstName;
        } else if (session.lastName !== '') {
            session.displayName = session.lastName;
        } else {
            session.displayName = 'TXLF Speaker';
        }
        session.url = item.node.uri;
        session.bio = item.node.field_profile_bio;
        if (item.node.picture === '') {
            session.pictureUrl = _sessionsData.noAuthorImage;
        } else {
            session.pictureUrl = item.node.picture;
        }
        session.company = item.node.field_profile_company;
        session.companyUrl = item.node.field_profile_website;
        session.experience = item.node.field_experience;
        if (session.experience.indexOf('Novice') != -1) {
            session.experienceLevel = 1;
        } else if (session.experience.indexOf('Intermediate') != -1) {
            session.experienceLevel = 2;
        } else if (session.experience.indexOf('Advanced') != -1) {
            session.experienceLevel = 3;
        } else {
            session.experienceLevel = 0;
        }
    });
}

angular.module('txlfApp')
.factory('sessionsData', ['$http', '$window', 'appConfig',
    function SessionsDataFactory($http, $window, config) {
        _sessionsData = {
            _promise : null,
            list : [],
            loaded : false,
            noAuthorImage : config.noAuthorImage
        };

        _sessionsData.load = function() {
            if (_sessionsData._promise === null) {
                _sessionsData._promise = $http.jsonp(config.sessionScheduleUrl)
                        .success(function(data) {
                            _sessionsData.data = data;
                            _sessionsData.list = parseSessionsData(data);
                            _sessionsData.loaded = true;
                        })
                        .error(function() {
                            if (!_sessionsData.loaded) {
                                $window.alert('Unable to load schedule data.');
                            }
                        });
            }
            return _sessionsData._promise;
        };

        return _sessionsData;
    }
]);

/**
 *  JSONP call-back entry.
 */
function sessions(data) {
    parseSessionsData(data);
    _sessionsData.loaded = true;
//    console.log('sessions data loaded, _sessionsData.list.length='+_sessionsData.list.length);
}

