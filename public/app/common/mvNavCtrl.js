'use strict';

angular.module('compass')
  .controller('mvNavCtrl', function ($scope, $interval, mvIdentity, mvAuth, $location) {
    $scope.identity = mvIdentity;
    var updateNavNumber = function(){
      var placeholder = 0;
    };

    var numberUpdater = $interval(updateNavNumber, 1000);

    $scope.$on('$destroy', function(){
      $interval.cancel(numberUpdater);
    });

    $scope.logout = function () {
      mvAuth.logout().then(function () {
        $location.path('/login');
      });
    };
  });