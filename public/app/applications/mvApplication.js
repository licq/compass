angular.module('compass')
  .factory('mvApplication', function ($resource) {
    return $resource('/api/applications/:_id', {_id: '@_id'}, {
      archive: {
        method: 'PUT',
        isArray: false,
        params: {
          status: 'archived'
        }
      },
      pursue: {
        method: 'PUT',
        isArray: false,
        params: {
          status: 'pursued'
        }
      },
      undetermine: {
        method: 'PUT',
        isArray: false,
        params: {
          status: 'undetermined'
        }
      }
    });
  });