angular.module('compass')
  .controller('mvResumeReportViewCtrl', function ($scope, $http, mvMoment) {
    function convert(data) {
      data = _.map(data, function (m, d) {
        var date = mvMoment().year(d.year).month(d.month - 1).day(d.day).startOf('day').add('hours', 8).valueOf();
        m[date] = d.count;
        return m;
      }, {});
      console.log(data);
    }

    $http.get('/api/resumeReports/counts').success(function (data) {
      $scope.resumeCounts = convert(data);
    });
  });