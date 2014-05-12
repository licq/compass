'use strict';

angular.module('compass')
  .controller('mvEventListCtrl', function ($scope, mvEvent, mvIdentity, mvMoment) {
    $scope.crumbs = [
      {text: '面试日历', url: 'events'},
    ];
    $scope.eventCalendarConfig = {
      header: {
        right: 'month agendaWeek agendaDay',
        center: 'title',
        left: 'prev,next today'
      },
      defaultView: 'agendaWeek',
      firstHour: 8
    };

    $scope.eventsForCalendar = [
      {
        start: new Date(),
        end: new Date(),
        title: 'fuck',
        allDay: false
      }
    ];
    $scope.eventSources = [$scope.eventsForCalendar];

    mvEvent.query(
      {user: mvIdentity.currentUser._id,
        startTime: mvMoment().startOf('week').format('YYYY-MM-DD'),
        endTime: mvMoment().endOf('week').format('YYYY-MM-DD')
      }, function (events) {
        $scope.events = events;
        $scope.eventsForCalendar.length = 0;
        $scope.events.forEach(function (evt) {
          $scope.eventsForCalendar.push({
            id: evt._id,
            start: mvMoment(evt.time).toDate(),
            end: mvMoment(evt.time).add(evt.duration, 'minutes').toDate(),
            title: evt.name + '面试(' + evt.applyPosition + ')',
            allDay: false
          });
        });
      });
  });
