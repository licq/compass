'use strict';

angular.module('compass')
  .controller('mvNavCtrl', function ($scope, $interval, mvNav, mvIdentity, mvMoment, mvReview, mvAuth, mvEvent, $location) {
    $scope.identity = mvIdentity;
    $scope.counts = {};

    $scope.updateNavCounts = function (query) {
      mvNav.get(query, function (counts) {
        angular.extend($scope.counts, counts);
      });
    };

    $scope.retrieveEventsForHeader = function () {

      var now = mvMoment().toISOString(),
        endOfToday = mvMoment().endOf('day').toISOString();
      //today.setHours(0, 0, 0, 0);
      //  $scope.endOfToday.setHours(23, 59, 59, 999);

      mvEvent.query(
        {user: mvIdentity.currentUser._id,
          startTime: now,
          endTime: endOfToday,
          limit: 3
        }, function (events) {
          $scope.eventsForHeader = events;
          angular.forEach($scope.eventsForHeader, function (evt) {
            var start = mvMoment(evt.startTime).toDate(),
              end = mvMoment(evt.startTime).add('minutes', evt.duration).toDate();
              var startMinutes = start.getMinutes(),
                endMinutes = end.getMinutes();
            evt.from = start.getHours() + ':' + (startMinutes >= 10? startMinutes : ('0'+startMinutes));
            evt.to = end.getHours() + ':' + (endMinutes >= 10? endMinutes : ('0'+endMinutes));
            evt.title = evt.name + '面试(' + evt.applyPosition + ')';
          });
        });
    };

    $scope.retrieveReviewsForHeader = function () {
      mvReview.query({orderBy: 'events[0].startTime',
          orderByReverse: false, unreviewed: true, limit: 3},
        function (interviews) {
          $scope.unreviewedForHeader = [];
          angular.forEach(interviews, function (interview) {
            var unreviewed ={};
            unreviewed.name = interview.name;
            unreviewed.startTime = interview.events[0].startTime;
            unreviewed.applyPosition = interview.applyPosition;
            unreviewed.interviewId = interview._id;
            $scope.unreviewedForHeader.push(unreviewed);
          });
        });
    };

    if (mvIdentity.isAuthenticated()) {
      $scope.updateNavCounts();
      $scope.retrieveEventsForHeader();
      $scope.retrieveReviewsForHeader();
      $scope.interval = $interval(function () {
        $scope.updateNavCounts();
        $scope.retrieveEventsForHeader();
        $scope.retrieveReviewsForHeader();
      }, 300000);
    }


    $scope.$on('loggedIn', function () {
      $scope.updateNavCounts();
      $scope.retrieveEventsForHeader();
      $scope.retrieveReviewsForHeader();
      $scope.interval = $interval(function () {
        $scope.updateNavCounts();
        $scope.retrieveEventsForHeader();
        $scope.retrieveReviewsForHeader();
      }, 300000);
    });

    $scope.$on('loggedOut', function () {
      if ($scope.interval) {
        $interval.cancel($scope.interval);
      }
    });

    $scope.$on('$destroy', function () {
      if ($scope.interval) {
        $interval.cancel($scope.interval);
      }
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
      }
    });

    $scope.$on('reviewAdded', function () {
      $scope.counts.toBeReviewed--;
    });

    $scope.logout = function () {
      mvAuth.logout().then(function () {
        $location.path('/login');
      });
    };
  })
;