angular.module('compass')
    .factory('mvEvent', function ($resource) {
        return $resource('/api/events/:_id', {_id: '@_id'});
    });