angular.module('compass')
  .controller('mvReviewListCtrl', function ($scope, mvReview, $http, states, $location) {
    var defaultQueryOptions = {
      page: 1,
      pageSize: 20,
      orderBy: 'events[0].startTime',
      orderByReverse: true
    };

    states.defaults('mvReviewListCtrl', {
      queryOptions: defaultQueryOptions
    });

    $scope.today = new Date();
    $scope.queryOptions = states.get('mvReviewListCtrl').queryOptions;
    $http.get('/api/applyPositions').success(function (positions) {
      $scope.applyPositions = positions;
    });

    $scope.query = function () {
      mvReview.query($scope.queryOptions,
        function (interviews, headers) {
          $scope.totalInterviewsCount = parseInt(headers('totalCount'), 10);
          $scope.interviews = interviews;
        });
    };

    $scope.clearQueryOptions = function () {
      $scope.queryOptions.name = '';
      $scope.queryOptions.applyPosition = '';
      $scope.queryOptions.startDate = '';
      $scope.queryOptions.page = 1;
      $scope.query();
    };

    $scope.search = function () {
      $scope.queryOptions.page = 1;
      $scope.query();
    };

    $scope.view = function (interview) {
      $location.path('/interviews/reviews/' + interview._id);
    };
  });