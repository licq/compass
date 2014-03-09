'use strict';

angular.module('compass')
    .constant('BASE_URL', 'http://localhost:3000')
    .factory('Email', function ($resource) {
        return $resource('/emails');
    });