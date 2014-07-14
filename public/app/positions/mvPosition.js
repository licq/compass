angular.module('compass')
  .factory('mvPosition', function ($resource) {
    return $resource('/api/positions/:_id', {_id: '@_id'},
      {update: {
        method: 'PUT',
        isArray: false
      }});
  });