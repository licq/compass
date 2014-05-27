angular.module('compass')
  .controller('mvReviewListCtrl', function ($scope, mvInterview, $http, states, $location) {
    var defaultQueryOptions = {
      currentPage: 1,
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
      mvInterview.query(_.extend({review: true}, $scope.queryOptions),
        function (interviews, headers) {
          $scope.totalInterviewsCount = parseInt(headers('totalCount'), 10);
          $scope.interviews = interviews;
        });
    };

    $scope.clearQueryOptions = function () {
      $scope.queryOptions.name = '';
      $scope.queryOptions.applyPosition = '';
      $scope.queryOptions.startDate = '';
      $scope.queryOptions.currentPage = 1;
      $scope.query();
    };

    $scope.search = function () {
      $scope.queryOptions.currentPage = 1;
      $scope.query();
    };

    $scope.view = function (interview) {
      $location.path('/interviews/' + interview._id);
    };

    $scope.newReview = function (interview) {
      $location.path('/interviews/' + interview._id);
    };
  });