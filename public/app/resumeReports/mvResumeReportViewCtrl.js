angular.module('compass')
  .controller('mvResumeReportViewCtrl', function ($scope, $http) {
    $scope.queryOptions = {
      reportType: 'day',
      applyPosition: '',
      channel: ''
    };

    $scope.query = function () {
      $http.get('/api/resumeReports/counts', {params: $scope.queryOptions}).success(function (data) {
        $scope.resumeCounts = [
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

    $http.get('/api/resumeReports/channels').success(function (data) {
      $scope.channels = data;
    });

    $http.get('/api/resumeReports/applyPositions').success(function (data) {
      $scope.applyPositions = data;
    });

    $scope.query();

    $http.get('/api/resumeReports/summaries', {params: {groupBy: ['channel', 'applyPosition', 'gender', 'age']}}).success(function (data) {
      $scope.summaries = data;
      $scope.summaries.gender = _.map(data.gender, function (s) {
        return s.name === 'male' ? {name: '男', count: s.count} : {name: '女', count: s.count};
      });

      $scope.summaries.age = _.map(_.groupBy(data.age, function (d) {
        return Math.floor(d.name / 5);
      }), function (value, key) {
        return {
          name: '' + key * 5 + '-' + (key * 5 + 4),
          count: _.reduce(value, function (s, d) {
            return s + d.count;
          }, 0)
        };
      });
    });
  });