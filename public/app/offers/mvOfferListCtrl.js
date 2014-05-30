angular.module('compass')
  .controller('mvOfferListCtrl', function ($scope, mvInterview, states, mvNotifier, $http) {
    $scope.today = new Date();

    $http.get('/api/applierRejectReasons').success(function (result) {
      $scope.applierRejectReasons = result;
    });

    $scope.query = function () {
      mvInterview.query({status: 'offered', name: $scope.name}, function (offers, headers) {
        $scope.offers = offers;
        $scope.totalOffersCount = parseInt(headers('totalCount'), 10);
      });
    };

    $scope.query();

    $scope.clearQueryOptions = function () {
      $scope.name = '';
      $scope.query();
    };

    $scope.accept = function (offer) {
      offer.status = 'offer accepted';
    };

    $scope.reject = function (offer) {
      offer.status = 'offer rejected';
    };

    $scope.save = function (offer) {
      mvInterview.update({ _id: offer._id },
        {status: offer.status,
          applierRejectReason: offer.applierRejectReason,
          onBoardDate: offer.onBoardDate
        },
        function () {
          console.log('hello');
          mvNotifier.notify('保存成功');
          angular.forEach($scope.offers, function (inOffer, index) {
            if (inOffer._id === offer._id) {
              $scope.offers.splice(index, 1);
              return false;
            }
          });
        });
    };
  });