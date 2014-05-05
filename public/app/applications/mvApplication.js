angular.module('compass')
    .factory('mvApplication', function ($resource) {
        return $resource('/api/applications/:_id', {_id: '@_id'},{
            archive:{
                method: 'PUT',
                isArray: false,
                params: {
                    status: 'archived'
                }
            }
        });
    });