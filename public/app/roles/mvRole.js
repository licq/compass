angular.module('compass')
  .factory('mvRole', function ($resource) {
    return $resource('/api/roles/:_id', {_id: '@_id'},
      {update: {
        method: 'PUT',
        isArray: false
      }});
  });