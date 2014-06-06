angular.module('compass')
  .controller('mvSystemOperationsCtrl', function ($scope, $http) {
    $http.get('/tasks/stats').success(function (res) {
      $scope.taskStats = res;
    });
    $http.get('/api/emailCount').success(function (res) {
      $scope.emailCount = res.emailCount;
    });
    $http.get('/api/resumeCounts').success(function (res) {
      $scope.resumeCountInDb = res.resumeCountInDb;
      $scope.resumeCountInEs = res.resumeCountInEs;
      $scope.mailCount = res.mailCount;
    });
  });