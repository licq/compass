angular.module('compass')
  .controller('mvInterviewViewCtrl', function ($scope, $routeParams, mvInterview, $location, mvNotifier) {
    mvInterview.get({_id: $routeParams.id}, function (interview) {
      $scope.interview = interview;
      $scope.isShowDetail = true;
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

    $scope.offer = function () {
      mvInterview.update({_id: $scope.interview._id}, {status: 'offered'},function () {
        $scope.interview.status = 'offered';
        mvNotifier.notify('已将' + $scope.interview.name + '放入Offer列表中');
        $location.path('/interviews/list');
      });
    };
    $scope.reject = function () {
      mvInterview.update({_id: $scope.interview._id}, {status: 'rejected'},function () {
        $scope.interview.status = 'rejected';
        mvNotifier.notify('已将' + $scope.interview.name + '放入人才库');
        $location.path('/interviews/list');
      });
    };
  });