angular.module('compass')
    .factory('mvCompany', function ($resource) {
        return $resource('/api/companies/:_id', {_id: '@_id'},
            {update: {
                method: 'PUT',
                isArray: false
            }});
    });