angular.module('compass')
  .factory('mvInterview', function ($resource) {
    return $resource('/api/interviews/:_id', {_id: '@_id'},
      {
        unprocessed: {
          method: 'GET',
          params: {
            status: 'unprocessed'
          },
          isArray: true
        }
      }
    );
  });