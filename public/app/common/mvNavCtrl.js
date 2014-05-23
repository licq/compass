'use strict';

angular.module('compass')
  .controller('mvNavCtrl', function ($scope, mvIdentity, mvAuth, $location) {
    $scope.identity = mvIdentity;

    $scope.logout = function () {
      mvAuth.logout().then(function () {
        $location.path('/login');
      });
    };
  });