angular.module('compass')
  .controller('mvSystemOperationsCtrl', function ($scope, $http, mvNotifier) {
    $scope.refreshTaskStats = function () {
      $http.get('/tasks/stats').success(function (res) {
        $scope.taskStats = res;
      });
      $http.get('/api/emailCount').success(function (res) {
        $scope.emailCount = res.emailCount;
      });
    };

    $scope.refreshResumeCounts = function () {
      $http.get('/api/resumeCounts').success(function (res) {
        $scope.resumeCountInDb = res.resumeCountInDb;
        $scope.resumeCountInEs = res.resumeCountInEs;
        $scope.mailCount = res.mailCount;
      });
    };

    $scope.recreateAllJobs = function () {
      $http.post('/api/systemOperations/recreateAllJobs').success(function () {
        $scope.refreshTaskStats();
        mvNotifier.notify('重建已完成');
      });
    };
    $scope.recreateFetchEmailJobs = function () {
      $http.post('/api/systemOperations/recreateFetchEmailJobs').success(function () {
        $scope.refreshTaskStats();
        mvNotifier.notify('重建已完成');
      });
    };

    $scope.synchronizeEsToDb = function () {
      mvNotifier.notify('重建ES开始');
      $http.post('/api/systemOperations/synchronizeEsToDb').success(function () {
        $scope.refreshResumeCounts();
        mvNotifier.notify('重建ES完成');
      });
    };

    $scope.reparseMails = function () {
      $http.post('/api/systemOperations/reparseMails').success(function () {
        $scope.refreshResumeCounts();
        mvNotifier.notify('重新解析任务已生成，请手动刷新');
      });
    };

    $scope.refreshTaskStats();
    $scope.refreshResumeCounts();
  });