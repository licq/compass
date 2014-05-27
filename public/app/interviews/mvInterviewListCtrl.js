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
  .controller('mvInterviewListCtrl', function ($scope, mvInterview, $modal, $location) {
    mvInterview.query(function (interviews) {
      $scope.interviews = interviews;
      $scope.interviews.forEach(function (interview) {
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
      });
    });

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

      modalInstance.result.then(function () {
        mvInterview.get({_id: interview._id}, function (newInterview) {
          angular.forEach($scope.interviews, function (inter, index) {
            if (inter._id === newInterview._id) {
              $scope.interviews[index] = newInterview;
              return false;
            }
          });
        });
      });
    };
  });