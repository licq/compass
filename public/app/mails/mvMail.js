angular.module('compass')
    .factory('mvMail', function ($resource) {
        return $resource('/api/mails/:_id', {_id: '@id'});
    });