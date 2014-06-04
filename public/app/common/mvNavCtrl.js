'use strict';

angular.module('compass')
  .controller('mvNavCtrl', function ($scope, $interval, mvNav, mvIdentity, mvAuth, $location) {
    $scope.identity = mvIdentity;

    $scope.updateNavCounts = function () {
      mvNav.get(function (counts) {
        $scope.counts = counts;
      });
    };

    if (mvIdentity.isAuthenticated()) {
      $scope.updateNavCounts();
    }

    var updater = $interval($scope.updateNavCounts, 300000);

    $scope.$on('loggedin', function () {
      $scope.updateNavCounts();
    });
    $scope.$on('applicationStatusUpdated', function (event, from, to) {

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

    $scope.$on('changeOfEvent', function (event, operation, newStartTime, oldStartTime, countOfEvents) {
      var today = new Date(), endOfToday = new Date();
      today.setHours(0, 0, 0, 0);
      endOfToday.setHours(23, 59, 59, 999);
      switch (operation) {
        case 'delete':
          if (oldStartTime >= today && oldStartTime <= endOfToday) {
            $scope.counts.eventsOfToday--;
          }

          if (countOfEvents === 1) {
            $scope.counts.interviews--;
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
          } else if ((newStartTime < today ||
            newStartTime > endOfToday) &&
            oldStartTime >= today && oldStartTime <= endOfToday) {
            $scope.counts.eventsOfToday--;
          }

          var now = new Date();
          if (countOfEvents === 1) {
            if (newStartTime <= now && oldStartTime > now) {
              $scope.counts.interviews++;
            } else if (newStartTime > now && oldStartTime <= now) {
              $scope.counts.interviews--;
            }
          }
      }
    });

    $scope.$on('reviewAdded', function (event) {
      $scope.counts.toBeReviewed--;
    });

//    $scope.$on('interviewAdded', function () {
//      $scope.counts.interviews++;
//    });

    $scope.$on('$destroy', function () {
      $interval.cancel(updater);
    });

    $scope.logout = function () {
      mvAuth.logout().then(function () {
        $location.path('/login');
      });
    };
  });