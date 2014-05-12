angular.module('compass')
  .factory('mvResume', function ($resource) {
    return $resource('/api/resumes/:_id', {_id: '@_id'});
  });