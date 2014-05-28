'use strict';

function totalFieldScores(interview) {
  return _.reduce(interview.reviews, function (scores, review) {
    _.forEach(review.items, function (item) {
      scores[item.name] = scores[item.name] || 0;
      scores[item.name] += item.score;
    });
    return scores;
  }, {});
}
function calculateQualifiedSummaries(interview) {
  var qualifiedSummaries = _.unique(_.flatten(_.map(interview.events, function (event) {
    return _.map(event.interviewers, function (interviewer) {
      return {
        name: interviewer.name
      };
    });
  })), function (summary) {
    return summary.name;
  });

  _.forEach(interview.reviews, function (review) {
    _.forEach(qualifiedSummaries, function (summary) {
      if (review.interviewer.name === summary.name) {
        summary.qualified = review.qualified;
        return false;
      }
    });
  });

  qualifiedSummaries = _.sortBy(qualifiedSummaries, function (summary) {
    if (summary.qualified === true) {
      return -1;
    }
    if (summary.qualified === false) {
      return 0;
    }
    return 1;
  });

  return qualifiedSummaries;
}
angular.module('compass')
  .controller('mvInterviewListCtrl', function ($scope, mvInterview, $modal, $location, states, $http) {

    $http.get('/api/applyPositions?for=company').success(function (applyPositions) {
      $scope.applyPositions = applyPositions;
    });

    $scope.today = new Date();

    states.defaults('mvInterviewListCtrl', {
      page: 1,
      pageSize: 20
    });

    $scope.queryOptions = states.get('mvInterviewListCtrl');

    function prepareForPage(interview) {
      if (interview.reviews.length > 0) {
        interview.averageTotalScore = _.reduce(interview.reviews, function (sum, review) {
          return sum + review.totalScore;
        }, 0) / interview.reviews.length;
      }
      interview.qualifiedSummaries = calculateQualifiedSummaries(interview);
      interview.averageFieldScores = _.sortBy(_.map(totalFieldScores(interview), function (score, name) {
        return {
          name: name,
          score: score / interview.reviews.length
        };
      }), function (score) {
        return -score.score;
      });
    }

    $scope.query = function () {
      mvInterview.query($scope.queryOptions, function (interviews, headers) {
        $scope.interviews = interviews;
        $scope.totalInterviewsCount = parseInt(headers('totalCount'), 10);
        $scope.interviews.forEach(prepareForPage);
      });
    };


    $scope.query();

    $scope.search = function () {
      $scope.queryOptions.page = 1;
      $scope.query();
    };

    $scope.clearQueryOptions = function () {
      $scope.queryOptions.name = '';
      $scope.queryOptions.applyPosition = '';
      $scope.queryOptions.startDate = '';
      $scope.queryOptions.page = 1;
      $scope.queryOptions.pageSize = 20;
      $scope.query();
    };

    $scope.view = function (interviewId) {
      $location.path('/interviews/' + interviewId);
    };

    $scope.newEvent = function (interview) {
      var modalInstance = $modal.open({
        templateUrl: '/app/events/new.html',
        controller: 'mvEventNewCtrl',
        resolve: {
          event: function () {
            return {
              name: interview.name,
              applyPosition: interview.applyPosition,
              mobile: interview.mobile,
              email: interview.email,
              application: interview.application
            };
          }
        }});

      modalInstance.result.then(function (event) {
        event.startTime = event.startTime.toISOString();
        interview.events.push(event);
        prepareForPage(interview);
      });
    };
  });