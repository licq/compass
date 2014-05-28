'use strict';

angular.module('compass')
  .controller('mvMailListCtrl', function ($scope, mvMail, $location, states) {
    states.defaults('mvMailListCtrl', {
      queryOptions: {
        page: 1,
        pageSize: 20
      }
    });

    $scope.totalMailsCount = 0;

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
