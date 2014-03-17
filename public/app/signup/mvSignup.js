angular.module('compass')
    .factory('mvSignup', function ($resource) {
        return $resource('/api/signups/:code',
            {code: '@code'}, {
                activate: {
                    method: 'PUT'
                }
            });
    });