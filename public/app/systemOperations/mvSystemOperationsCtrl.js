angular.module('compass')
  .controller('mvSystemOperationsCtrl', function ($scope, $http, mvNotifier) {
    $scope.refreshTaskStats = function () {
      $http.get('/tasks/stats').success(function (res) {
        $scope.taskStats = res;
      });
      $http.get('/sysAdminApi/emailCount').success(function (res) {
        $scope.emailCount = res.emailCount;
      });
    };

    $scope.refreshResumeCounts = function () {
      $http.get('/sysAdminApi/resumeCounts').success(function (res) {
        $scope.resumeCountInDb = res.resumeCountInDb;
        $scope.resumeCountInEs = res.resumeCountInEs;
        $scope.mailCount = res.mailCount;
      });
    };

    $scope.recreateAllJobs = function () {
      $http.post('/sysAdminApi/recreateAllJobs').success(function () {
        $scope.refreshTaskStats();
        mvNotifier.notify('重建已完成');
      });
    };
    $scope.recreateFetchEmailJobs = function () {
      $http.post('/sysAdminApi/recreateFetchEmailJobs').success(function () {
        $scope.refreshTaskStats();
        mvNotifier.notify('重建已完成');
      });
    };

    $scope.synchronizeToEs = function () {
      mvNotifier.notify('同步到ES开始');
      var query;
      try {
        query = JSON.parse($scope.query);
      } catch (e) {
        query = {};
      }
      $http.post('/sysAdminApi/synchronizeToEs', {query: query}).success(function () {
        $scope.refreshResumeCounts();
        mvNotifier.notify('同步到ES完成');
      });
    };

    $scope.recreateIndex = function () {
      mvNotifier.notify('删除并重建Index和Mapping');
      $http.post('/sysAdminApi/recreateIndex').success(function () {
        $scope.refreshResumeCounts();
        mvNotifier.notify('重建ES完成');
      });
    };

    $scope.reparseMails = function () {
      mvNotifier.notify('准备重新解析邮件');
      $http.post('/sysAdminApi/reparseMails').success(function () {
        $scope.refreshResumeCounts();
        mvNotifier.notify('重新解析任务已生成，请手动刷新');
      });
    };

    $scope.refreshTaskStats();
    $scope.refreshResumeCounts();
  });