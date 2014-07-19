angular.module('compass')
  .controller('mvOnboardListCtrl', function ($scope, $http, mvInterview, mvNotifier) {
    $scope.dateRange = {
      startDate: moment().startOf('day'),
      endDate: moment().add('months', 1).endOf('day')
    };

    $http.get('/api/applierRejectReasons').success(function (result) {
      $scope.applierRejectReasons = result;
    });

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

    $scope.accept = function (onboard) {
      onboard.status = 'recruited';
      $scope.save(onboard);
    };

    $scope.reject = function (onboard) {
      onboard.status = 'not recruited';
      onboard.onboardDate = undefined;
    };

    $scope.cancel = function (onboard) {
      onboard.status = null;
    };


    $scope.save = function (onboard) {
      mvInterview.update({ _id: onboard._id },
        {status: onboard.status,
          applierRejectReason: onboard.applierRejectReason,
          onboardDate: onboard.onboardDate
        },
        function () {
          mvNotifier.notify('保存成功');
          angular.forEach($scope.onboards, function (inOffer, index) {
            if (inOffer._id === onboard._id) {
              $scope.onboards.splice(index, 1);
              return false;
            }
          });
        });
    };


  });