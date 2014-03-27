angular.module('compass')
    .factory('mvUser', function ($resource) {
        return $resource('/api/users/:_id', {_id: '@_id'});
    });