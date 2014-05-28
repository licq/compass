'use strict';

angular.module('compass')
  .controller('mvMailListCtrl', function ($scope, mvMail, $location, states) {

    $scope.states = states.get('mvMailListCtrl');

    $scope.totalMailsCount = 0;

    var defaultQueryOptions = {
      currentPage: 1,
      pageSize: 10
    };

    states.defaults('mvMailListCtrl', {
      queryOptions: defaultQueryOptions
    });

    $scope.queryOptions = states.get('mvMailListCtrl').queryOptions;

    $scope.query = function () {
      mvMail.query($scope.queryOptions,
        function (mails, headers) {
          $scope.totalMailsCount = parseInt(headers('totalCount'), 10);
          $scope.mails = mails;
        });
    };

    $scope.view = function (mail) {
      $location.path('/settings/mails/' + mail._id);
    };

  });
