angular.module('compass')
  .factory('mvInterview', function ($resource) {
    return $resource('/api/interviews/:_id', {_id: '@_id'},
      {
        update: {
          method: 'PUT',
          isArray: false
        }
      }
    );
  });