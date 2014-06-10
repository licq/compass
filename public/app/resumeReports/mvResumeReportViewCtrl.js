angular.module('compass')
  .controller('mvResumeReportViewCtrl', function ($scope, $http, mvMoment, $filter) {
    function convert(data) {
      if (data.length === 0) {
        return [];
      }
      data = _.sortBy(_.map(data, function (item) {
        return {
          date: mvMoment().year(item.year).month(item.month - 1).date(item.day).startOf('day').add('hours', 8).valueOf(),
          count: item.count
        };
      }), function (item) {
        return item.date;
      });

      return _.reduce(_.range(data[0].date, data[data.length - 1].date + 1, 1000 * 60 * 60 * 24), function (arr, date) {
        if (_.find(data, {'date': date})) {
          arr.push([date, _.find(data, {'date': date}).count]);
        } else {
          arr.push([date, 0]);
        }
        return arr;
      }, []);
    }

    $http.get('/api/resumeReports/counts').success(function (data) {
      $scope.resumeCounts = [
        {
          key: 'counts',
          values: convert(data)
        }
      ];
    });

    $scope.xAxisTickFormatFunction = function () {
      return function (d) {
        return mvMoment(d).format('MM/DD');
      };
    };

    $scope.yAxisTickFormatFunction = function () {
      return function (n) {
        return $filter('number')(n, 0);
      };
    };

    $scope.toolTipContentFunction = function () {
      return function (key, x, y) {
        return '<strong class="text-success">' + y + '</strong> <small>' + x + '</small>';
      };
    };
  });