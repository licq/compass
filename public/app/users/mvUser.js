angular.module('compass')
  .factory('mvUser', function ($resource) {
    return $resource('/api/users/:_id', {_id: '@_id'},
      {update: {
        method: 'PUT',
        isArray: false
      },
        enable: {
          method: 'PUT',
          url: '/api/users/:_id/enable',
          isArray: false
        }
      });
  });