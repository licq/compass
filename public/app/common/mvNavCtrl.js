'use strict';

angular.module('compass')
  .controller('mvNavCtrl', function ($scope, $interval, mvNav, mvIdentity, mvAuth, $location) {
    $scope.identity = mvIdentity;

    $scope.updateNavCounts = function () {
      $scope.counts = mvNav.get();
    };

    $scope.$on('loggedIn', function () {
      $scope.updateNavCounts();
      $scope.interval = $interval($scope.updateNavCounts, 300000);
    });
    $scope.$on('loggedOut', function () {
      if ($scope.interval) {
        $interval.cancel($scope.interval);
      }
    });

    if (mvIdentity.isAuthenticated()) {
      $scope.updateNavCounts();
      $scope.interval = $interval($scope.updateNavCounts, 300000);
    }

    $scope.$on('$destroy', function () {
      if ($scope.interval) {
        $interval.cancel($scope.interval);
      }
    });

    $scope.$on('applicationStatusUpdated', function (from, to) {

      switch (to) {
        case 'undetermined':
          $scope.counts.undetermined++;
          $scope.counts.new--;
          break;

        case 'interview':
          $scope.counts.pursued--;
          break;

        case 'pursued':
          switch (from) {
            case 'new':
              $scope.counts.pursued++;
              $scope.counts.new--;
              break;

            case 'undetermined':
              $scope.counts.pursued++;
              $scope.counts.undetermined--;
              break;
          }
          break;

        case 'archived':
          switch (from) {
            case 'new':
              $scope.counts.new--;
              break;

            case 'undetermined':
              $scope.counts.undetermined--;
              break;

            case 'pursued':
              $scope.counts.pursued--;
              break;
          }
          break;
      }
    });

    $scope.$on('changeOfEvent', function (event, operation, newStartTime, oldStartTime) {
      var today = new Date(), endOfToday = new Date();
      today.setHours(0, 0, 0, 0);
      endOfToday.setHours(23, 59, 59, 999);
      switch (operation) {
        case 'delete':
          if (oldStartTime >= today && oldStartTime <= endOfToday) {
            $scope.counts.eventsOfToday--;
          }
          break;

        case 'create':
          if (newStartTime >= today && newStartTime <= endOfToday) {
            $scope.counts.eventsOfToday++;
          }
          break;

        case 'update':
          if (newStartTime >= today &&
            newStartTime <= endOfToday &&
            (oldStartTime < today || oldStartTime > endOfToday)) {
            $scope.counts.eventsOfToday++;
          }

          if ((newStartTime < today ||
            newStartTime > endOfToday) &&
            oldStartTime >= today && oldStartTime <= endOfToday) {
            $scope.counts.eventsOfToday--;
          }
      }
    });

    $scope.$on('reviewAdded', function () {
      $scope.counts.reviews--;
    });

    $scope.$on('interviewAdded', function () {
      $scope.counts.interview++;
    });

    $scope.logout = function () {
      mvAuth.logout().then(function () {
        $location.path('/login');
      });
    };
  });