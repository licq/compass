angular.module('compass')
  .controller('mvTodayCtrl', function (mvIdentity, mvEvent, mvMoment, mvReview, mvInterview, $scope) {
    $scope.isopen = {};
    angular.extend($scope.isopen, $scope.counts);
    $scope.nextNdays = 3;
    var onToday = function (obj, field) {
      return mvMoment(obj[field]).toDate() >= mvMoment().startOf('day').toDate() &&
        mvMoment(obj[field]).toDate() <= mvMoment().endOf('day').toDate();
    };
//    var notOnToday = function (obj, field) {
//      return mvMoment(obj[field]).toDate() < mvMoment().startOf('day').toDate() ||
//        mvMoment(obj[field]).toDate() > mvMoment().endOf('day').toDate();
//    };

    $scope.retrieveEventsOfDays = function () {
      mvEvent.query({
        user: mvIdentity.currentUser._id,
        startTime: mvMoment().startOf('day').toISOString(),
        endTime: mvMoment().add('day', $scope.nextNdays).endOf('day').toISOString()
      }, function (events) {
        $scope.eventsOfToday = _.filter(events, function (event) {
          return onToday(event, 'startTime');
        });

        $scope.eventsOfNextDays = _.filter(events, function (event) {
          return !onToday(event, 'startTime');
        });
        angular.extend($scope.isopen, {eventsOfNextDays: $scope.eventsOfNextDays.length});
      });
    };

    $scope.retrieveReviewsOfDays = function () {
      return mvReview.query({orderBy: 'events[0].startTime',
        orderByReverse: false, unreviewed: true}, function (unreviewed) {
        $scope.unreviewedOfDays = unreviewed;
      });
    };

    $scope.retrieveOnboardsOfDays = function () {
      mvInterview.query({
        status: 'offer accepted',
        startDate: mvMoment().startOf('day').toISOString(),
        endDate: mvMoment().add('day', $scope.nextNdays).endOf('day').toISOString()}, function (interviews) {

        $scope.onboardsOfToday = _.filter(interviews, function (interview) {
          return onToday(interview, 'onboardDate');
        });

        $scope.onboardsOfNextDays = _.filter(interviews, function (interview) {
          return !onToday(interview, 'onboardDate');
        });

        angular.extend($scope.isopen, {onboardsOfNextDays: $scope.onboardsOfNextDays.length});

      });
    };

    $scope.retrieveEventsOfDays();
    $scope.retrieveReviewsOfDays();
    $scope.retrieveOnboardsOfDays();
  });