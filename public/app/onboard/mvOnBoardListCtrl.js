angular.module('compass')
  .controller('mvOnboardListCtrl', function ($scope, mvInterview, mvMoment) {
    $scope.dateRange = {
      startDate: mvMoment().startOf('day'),
      endDate: mvMoment().add('months', 1).endOf('day')
    };

    $scope.query = function () {
      mvInterview.query({
          status: 'offer accepted',
          name: $scope.name,
          startDate: $scope.dateRange.startDate.toISOString(),
          endDate: $scope.dateRange.endDate.toISOString()
        },
        function (res) {
          $scope.onboards = res;
        });
    };

    $scope.query();
  });