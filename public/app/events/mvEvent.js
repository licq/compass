angular.module('compass')
  .factory('mvEvent', function ($resource) {
    return $resource('/api/events/:_id', {_id: '@_id'},
      {
        update: {
          method: 'PUT',
          isArray: false
        },
        availableInterviewers: {
          url: '/api/events/availableInterviewers',
          method: 'GET',
          isArray: true
        }
      });
  });