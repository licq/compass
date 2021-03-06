'use strict';

angular.module('compass')
  .controller('mvReviewNewCtrl', function ($scope, $rootScope,$routeParams, $location, mvIdentity, mvInterview, mvReview,mvNotifier, mvEvaluationCriterion) {
    mvInterview.get({_id: $routeParams.id}, function (interview) {
      $scope.interview = interview;
      if (!reviewed($scope.interview)) {
        setupNewReview();
      } else {
        $scope.isNewReview = false;
        $scope.isShowDetail = !$scope.isNewReview;
        sync();
      }
    });

    function reviewed(interview) {
      return _.filter(interview.reviews, function (review) {
        return review.interviewer._id === mvIdentity.currentUser._id;
      }).length > 0;
    }

    function setupNewReview() {
      $scope.isNewReview = true;
      $scope.isShowDetail = !$scope.isNewReview;
      mvEvaluationCriterion.forReview({applyPosition:$scope.interview.applyPosition}, function (res) {
        $scope.review = {
          items: [],
          totalScore: 0,
          interview: $scope.interview._id
        };
        angular.forEach(res.items, function (item) {
          $scope.review.items.push({
            name: item.name,
            rate: item.rate
          });
        });
      });

      $scope.calculateTotalScore = function () {
        $scope.review.totalScore = _.reduce($scope.review.items, function (total, item) {
          if (item.score) {
            return total + item.score * item.rate;
          } else {
            return total;
          }
        }, 0);
      };

      $scope.save = function (qualified) {
        $scope.review.qualified = !!qualified;
        mvReview.save({review: $scope.review},
          function () {
            $rootScope.$broadcast('reviewAdded');
            $scope.review.interviewer = mvIdentity.currentUser;
            $scope.review.createdAt = new Date();
            $scope.interview.reviews.push($scope.review);
            $scope.isNewReview = false;
            $scope.isShowDetail = !$scope.isNewReview;
            sync();
            mvNotifier.notify('评价保存成功');
          },
          function () {
            mvNotifier.error('评价保存失败');
          });
      };
    }

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

    $scope.cancel = function () {
      $location.path('/interviews/reviews');
    };
  });