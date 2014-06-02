'use strict';

angular.module('compass')
  .controller('mvNavCtrl', function ($scope, $interval, mvNav, mvIdentity, mvAuth, $location) {
    $scope.identity = mvIdentity;

    $scope.updateNavCounts = function () {
      $scope.counts = mvNav.get();
    };

    if (mvIdentity.isAuthenticated()) {
      $scope.updateNavCounts();
    }

    $interval($scope.updateNavCounts, 300000);

    $scope.$on('loggedin', function () {
      $scope.updateNavCounts();
    });

    $scope.$on('create_eventOfToday', function () {
      $scope.counts.eventsOfToday++;
    });

    $scope.$on('delete_eventOfToday', function () {
      $scope.counts.eventsOfToday--;
    });

    $scope.$on('undetermine', function () {
      $scope.counts.undetermined++;
      $scope.counts.new--;
    });

    $scope.$on('new_pursue', function () {
      $scope.counts.pursued++;
      $scope.counts.new--;
    });

    $scope.$on('undetermined_pursue', function () {
      $scope.counts.pursued++;
      $scope.counts.undetermined--;
    });

    $scope.$on('new_archive', function () {
      $scope.counts.new--;
    });

    $scope.$on('undetermined_archive', function () {
      $scope.counts.undetermined--;
    });

    $scope.$on('pursued_archive', function () {
      $scope.counts.pursued--;
    });

    $scope.$on('pursued_interview', function () {
      $scope.counts.pursued--;
    });

    $scope.$on('reviewed', function () {
      $scope.counts.reviews--;
    });

    $scope.$on('$destroy', function () {
      $interval.cancel($scope.updateNavCounts);
    });

    $scope.logout = function () {
      mvAuth.logout().then(function () {
        $location.path('/login');
      });
    };
  });