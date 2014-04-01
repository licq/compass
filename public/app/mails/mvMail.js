angular.module('compass')
    .factory('mvMail', function ($resource) {
        return $resource('/api/mails/:_id', {_id: '@_id'}, {
            parse: {method: 'PUT', isArray: false}
        });
    });