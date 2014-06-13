angular.module('compass')
  .controller('mvInterviewReportViewCtrl', function ($scope, $http) {
    $scope.queryOptions = {
      reportType: 'day',
      applyPosition: ''
    };

    $http.get('/api/applyPositions').success(function (data) {
      $scope.applyPositions = data;
    });

    $scope.query = function () {
      $http.get('/api/interviewReports/counts', {params: $scope.queryOptions}).success(function (data) {
        $scope.interviewCounts = [
          {
            key: 'counts',
            values: $scope.chartFunction.convert($scope.queryOptions.reportType, data)
          }
        ];
      });
    };

    $scope.$watch('queryOptions.reportType', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $scope.query();
      }
    });

    $scope.query();

    $http.get('/api/interviewReports/summaries', {params: {groupBy: ['status', 'applyPosition']}}).success(function (data) {
      $scope.summaries = data;
      $scope.summaries.status = _.map(data.status, function (s) {
        var statusMap = {
          'new': '面试中',
          'offered': '面试通过',
          'rejected': '面试拒绝',
          'offer accepted': '应聘者接受',
          'offer rejected': '应聘者拒绝'
        };
        return {name: statusMap[s.name], count: s.count};
      });
    });
  });