angular.module('compass')
  .controller('mvSystemOperationsCtrl', function ($scope, $http, mvNotifier) {
    function refreshTaskStats() {
      $http.get('/tasks/stats').success(function (res) {
        $scope.taskStats = res;
      });
    }

    refreshTaskStats();
    $http.get('/api/emailCount').success(function (res) {
      $scope.emailCount = res.emailCount;
    });
    function refreshResumeCounts() {
      $http.get('/api/resumeCounts').success(function (res) {
        $scope.resumeCountInDb = res.resumeCountInDb;
        $scope.resumeCountInEs = res.resumeCountInEs;
        $scope.mailCount = res.mailCount;
      });
    }

    refreshResumeCounts();

    $scope.recreateAllJobs = function () {
      mvNotifier.notify('重建开始');
      $http.post('/api/systemOperations/recreateAllJobs').success(function () {
        refreshTaskStats();
        mvNotifier.notify('重建已完成');
      });
    };
    $scope.recreateFetchEmailJobs = function () {
      mvNotifier.notify('重建开始');
      $http.post('/api/systemOperations/recreateFetchEmailJobs').success(function () {
        refreshTaskStats();
        mvNotifier.notify('重建已完成');
      });
    };

    $scope.synchronizeEsToDb = function () {
      mvNotifier.notify('重建ES开始');
      $http.post('/api/systemOperations/synchronizeEsToDb').success(function () {
        refreshResumeCounts();
        mvNotifier.notify('重建ES完成');
      });
    };
  });