angular.module('compass')
  .factory('mvReview', function ($resource) {
    return $resource('/api/reviews');
  });