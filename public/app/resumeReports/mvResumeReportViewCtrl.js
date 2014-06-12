angular.module('compass')
  .controller('mvResumeReportViewCtrl', function ($scope, $http, mvMoment, $filter) {
    function convert(type, data) {
      var map = {
        day: {
          series: _.range(mvMoment().add('months', -1).add('days', 1).startOf('day').valueOf(),
              mvMoment().startOf('day').valueOf() + 1,
              1000 * 60 * 60 * 24),
          lookup: function (d, t) {
            var m = mvMoment(t);
            return _.find(d, {year: m.year(), month: m.month() + 1, day: m.date()});
          },
          format: function (time) {
            var m = mvMoment(time);
            if (m.date() === 1) {
              return m.format('M月');
            }
            return mvMoment(time).format('D');
          }
        },
        week: {
          series: _.range(mvMoment().add('weeks', -11).startOf('week').valueOf(),
              mvMoment().startOf('week').valueOf() + 1,
              1000 * 60 * 60 * 24 * 7),
          lookup: function (d, t) {
            var m = mvMoment(t);
            return _.find(d, {year: m.year(), week: m.week()});
          },
          format: function (time) {
            return mvMoment(time).format('第w周');
          }
        },
        month: {
          series: _.map(_.range(-11, 1), function (i) {
            return mvMoment().add('months', i).startOf('month').toDate();
          }),
          lookup: function (d, t) {
            var m = mvMoment(t);
            return _.find(d, {year: m.year(), month: m.month() + 1});
          },
          format: function (time) {
            var m = mvMoment(time);
            if (m.month() === 0) {
              return m.format('YYYY年');
            }
            return m.format('M月');
          }
        }
      };
      return _.map(map[type].series, function (time) {
        var xLabel = map[type].format(time),
          d = map[type].lookup(data, time);
        if (d) {
          return [xLabel, d.count];
        } else {
          return [xLabel, 0];
        }
      });
    }

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
            values: convert($scope.queryOptions.reportType, data)
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

      $scope.summaries.age = _.map(_.groupBy(data.age, function(d){
        return Math.floor(d.name / 5);
      }), function(value,key){
        return {
          name : '' + key * 5 + '-' + (key * 5 + 4),
          count: _.reduce(value, function(s,d){
            return s + d.count;
          },0)
        };
      });
    });

    $scope.yAxisTickFormatFunction = function () {
      return function (n) {
        return $filter('number')(n, 0);
      };
    };

    $scope.toolTipContentFunction = function () {
      return function (key, x, y) {
        return '<strong class="text-success">' + y + '</strong>';
      };
    };

    $scope.pieToolTipContentFunction = function(){
      return function(key,x){
        return key + ' <strong>' + $filter('number')(x,0) + '</strong>';
      };
    };

    $scope.pieX = function () {
      return function (d) {
        return d.name;
      };
    };

    $scope.pieY = function () {
      return function (d) {
        return d.count;
      };
    };

    $scope.pieDescription = function () {
      return function (d) {
        return d.count;
      };
    };
  });