'use strict';

angular.module('compass')
    .factory('mvEmail', function ($resource) {
        return $resource('/api/emails/:_id', {_id: '@_id'});
    });