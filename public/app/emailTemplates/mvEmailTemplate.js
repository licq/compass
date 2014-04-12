angular.module('compass')
    .factory('mvEmailTemplate', function ($resource) {
        return $resource('/api/emailTemplates');
    });