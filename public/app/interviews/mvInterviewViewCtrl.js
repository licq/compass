angular.module('compass')
  .controller('mvInterviewViewCtrl', function ($scope, $routeParams, mvInterview, $location) {
    mvInterview.get({_id: $routeParams.id}, function (interview) {
      $scope.interview = interview;
      sync();
    });

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
      $location.path('/interviews/list');
    };
  });