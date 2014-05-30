'use strict';

angular.module('compass')
  .controller('mvNavCtrl', function ($scope, $interval, mvNav, mvIdentity, mvAuth, $location) {
    $scope.identity = mvIdentity;

    $scope.updateNavCounts = function () {
      $scope.counts = mvNav.get();
    };

    $scope.updateNavCounts();
    var countUpdater = $interval($scope.updateNavCounts, 3000000);

    $scope.$on('$destroy', function () {
      $interval.cancel(countUpdater);
    });

    $scope.logout = function () {
      mvAuth.logout().then(function () {
        $location.path('/login');
      });
    };
  });