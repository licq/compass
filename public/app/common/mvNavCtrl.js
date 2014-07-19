'use strict';

angular.module('compass')
  .controller('mvNavCtrl', function ($scope, $interval, $timeout, mvNav, mvIdentity, mvPermission, mvReview, mvAuth, mvEvent, mvInterview, $location) {
    $scope.identity = mvIdentity;
    $scope.counts = {};

    $scope.updateNavCounts = function (query) {
      mvNav.get(query, function (counts) {
        angular.extend($scope.counts, counts);
      });
    };

    $scope.onboardCount = function () {
      mvNav.get({counts: 'onboards'}, function (counts) {
        angular.extend($scope.counts, counts);
      });
    };

    $scope.updateAppCounts = function(){
      $scope.updateNavCounts({counts:['new','pursued','undetermined']});
    };

    $scope.retrieveEvents = function () {
      mvEvent.query(
        {
          user: mvIdentity.currentUser._id,
          startTime: moment().toISOString(),
          endTime: moment().endOf('day').toISOString(),
          pageSize: 3
        }, function (events) {
          $scope.eventsForHeader = events;
        });
    };

    $scope.retrieveReviews = function () {
      mvReview.query({orderBy: 'events[0].startTime',
          orderByReverse: false, unreviewed: true, pageSize: 3},
        function (interviews) {
          $scope.unreviewedForHeader = interviews;
        });
    };

    $scope.retrieveOnboards = function () {
      mvInterview.query({
        status: 'offer accepted',
        startDate: moment().startOf('day').toISOString(),
        endDate: moment().endOf('day').toISOString(),
        pageSize: 3
      }, function (onboards) {
        $scope.onboardsForHeader = onboards;
      });
    };

    function refreshAll() {
      $scope.updateNavCounts();
      $scope.retrieveEvents();
      $scope.retrieveReviews();
      $scope.retrieveOnboards();
    }

    if (mvIdentity.isAuthenticated()) {
      mvPermission.setPermissions();
      $scope.onboardCount();
      refreshAll();
      $scope.interval = $interval(function () {
        refreshAll();
      }, 300000);
    }

    $scope.$on('loggedIn', function () {
      mvPermission.setPermissions();
      $scope.onboardCount();
      refreshAll();
      $scope.interval = $interval(function () {
        refreshAll();
      }, 300000);
    });

    function cancelInterval() {
      if ($scope.interval) {
        $interval.cancel($scope.interval);
      }
    }

    $scope.$on('loggedOut', function () {
      cancelInterval();
      mvPermission.setPermissions();
    });

    $scope.$on('$destroy', cancelInterval);

    $scope.$on('applicationStatusUpdated', function (event, from, to) {
      if ($scope.counts.hasOwnProperty(to)) $scope.counts[to]++;
      if ($scope.counts.hasOwnProperty(from)) $scope.counts[from]--;
    });

    var refreshUnreviewed = null;
    $scope.$on('changeOfEvent', function (event, operation, newStartTime, oldStartTime, countOfEvents) {
      var today = moment().startOf('day').toDate(),
        endOfToday = moment().endOf('day').toDate();

      $timeout.cancel(refreshUnreviewed);
      refreshUnreviewed = $timeout(function () {
        $scope.updateNavCounts({counts: 'unreviewed'});
      }, 3000);

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
      }
    });

    $scope.$on('reviewAdded', function () {
      $scope.counts.unreviewed--;
    });

    $scope.$on('roleChanged', function (event, role) {
      if (mvIdentity.currentUser.role._id === role._id) {
        mvIdentity.currentUser.role = role;
        mvPermission.setPermissions();
      }
    });

    $scope.$on('userChanged', function (event, user) {
      if (mvIdentity.currentUser._id === user._id) {
        mvIdentity.currentUser = angular.copy(user);
        mvPermission.setPermissions();
      }
    });

    $scope.logout = function () {
      mvAuth.logout().then(function () {
        $location.path('/login');
      });
    };
  });