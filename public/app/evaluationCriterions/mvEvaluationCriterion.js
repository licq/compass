angular.module('compass')
  .factory('mvEvaluationCriterion', function ($resource) {
    return $resource('/api/evaluationCriterions', {}, {
      update: {
        method: 'PUT',
        isArray: false
      },
      forReview: {
        method: 'GET',
        isArray: false,
        url: '/api/evaluationCriterions/forReview'
      }
    });
  });