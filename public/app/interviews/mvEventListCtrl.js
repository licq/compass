'use strict';

angular.module('compass')
  .controller('mvEventListCtrl', function ($scope, mvEvent, mvIdentity, mvMoment) {
    $scope.crumbs = [
      {text: '面试日历', url: 'events'},
    ];

    $scope.eventsForCalendar = [ ];
    $scope.eventSources = [$scope.eventsForCalendar];

    $scope.retrieveEvents = function (start, end, user) {
      mvEvent.query(
        {user: user || mvIdentity.currentUser._id,
          startTime: start,
          endTime: end
        }, function (events) {
          $scope.events = events;
          $scope.eventsForCalendar.length = 0;
          $scope.events.forEach(function (evt) {
            $scope.eventsForCalendar.push({
              id: evt._id,
              start: mvMoment(evt.time).toDate(),
              end: mvMoment(evt.time).add(evt.duration, 'minutes').toDate(),
              title: evt.name + '面试(' + evt.applyPosition + ')',
              allDay: false,
              backgroundColor: mvMoment(evt.time).isBefore(new Date()) ? 'rgb(128,128,128)' : 'rgb(219,173,255)',
              textColor: 'black'
            });
          });
        });
    };

    $scope.showModal = function (event) {
      console.log(event);
    };

    $scope.eventCalendarConfig = {
      timezone: 'local',
      header: {
        right: 'month agendaWeek agendaDay',
        center: 'title',
        left: 'prev,next today'
      },
      defaultView: 'agendaWeek',
      firstHour: 8,
      eventClick: $scope.showModal,
      viewRender: function (view) {
        $scope.retrieveEvents(view.start.toISOString(), view.end.toISOString());
      }
    };
  });
