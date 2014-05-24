'use strict';

angular.module('compass')
  .controller('mvInterviewViewCtrl', function ($scope, $routeParams, $location, mvIdentity, mvInterview, mvNotifier, mvEvaluationCriterion,$http) {
    mvInterview.get({_id: $routeParams.id}, function (interview) {
      $scope.interview = interview;
      $scope.title = interview.name;
      sync();
    });

    $scope.review = {items: []};

    $scope.isNewReview = $routeParams.isNewReview;

    $scope.$watch('isNewReview', function (value) {
      if (value) {
        mvEvaluationCriterion.get({}, function (res) {
          $scope.review = {
            items: []
          };
          angular.forEach(res.items, function (item) {
            $scope.review.items.push({
              name: item.name,
              rate: item.rate
            });
          });
        });
      }
    });

    $scope.$watch('review.items', function (items) {
      if (items) {
        $scope.review.totalScore = _.reduce(items, function (total, item) {
          if (item.score) {
            return total + item.score * item.rate;
          } else {
            return total;
          }
        }, 0);
      }
    }, true);

    function sync() {
      $scope.reviewHeader = [];
      $scope.reviewData = {};
      angular.forEach($scope.interview.reviews, function (review) {
        $scope.reviewData[review.interviewer._id] = {};
        angular.forEach(review.items, function (item) {
          if ($scope.reviewHeader.indexOf(item.name) < 0) {
            $scope.reviewHeader.push(item.name);
          }
          $scope.reviewData[review.interviewer._id][item.name] = item.score;
        });
      });
    }

    $scope.backToList = function () {
      $location.path('/interviews/unprocessed');
    };

    $scope.newReview = function () {
      $scope.isNewReview = true;
    };

    $scope.saveReview = function (qualified) {
      $scope.review.qualified = !!qualified;
      mvInterview.update({_id: $scope.interview._id}, {review: $scope.review},
        function () {
          $scope.review.interviewer = mvIdentity.currentUser;
          $scope.review.createdAt = new Date();
          $scope.interview.reviews.push($scope.review);
          $scope.isNewReview = false;
          sync();
          mvNotifier.notify('评价保存成功');
        },
        function () {
          mvNotifier.error('评价保存失败');
        });
    };

    $scope.deleteReview = function (reviewId) {
      $http.put('/api/interviews/' + $scope.interview._id, {reviewToDelete: reviewId})
        .success(function () {
          mvNotifier.notify('评价删除成功');
        })
        .error(function () {
          mvNotifier.error('评价删除失败');
        });
    };

    $scope.cancel = function () {
      $scope.isNewReview = false;
    };
  });