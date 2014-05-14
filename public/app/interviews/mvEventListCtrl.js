'use strict';

angular.module('compass')
  .controller('mvEventListCtrl', function ($scope, mvEvent, mvIdentity, mvMoment, $modal, $filter) {
    $scope.crumbs = [
      {text: '面试日历', url: 'events'},
    ];

    $scope.eventsForCalendar = [ ];
    $scope.eventSources = [$scope.eventsForCalendar];
    $scope.selectedUserId = mvIdentity.currentUser._id;

    function convertCalendarEvent(evt) {
      return {
        id: evt._id,
        start: mvMoment(evt.startTime).toDate(),
        end: mvMoment(evt.startTime).add(evt.duration, 'minutes').toDate(),
        title: evt.name + '面试(' + evt.applyPosition + ')',
        allDay: false,
        backgroundColor: mvMoment(evt.startTime).isBefore(new Date()) ? 'rgb(128,128,128)' : 'rgb(219,173,255)',
        textColor: 'black'
      };
    }

    $scope.retrieveEvents = function (start, end) {
      mvEvent.query(
        {user: $scope.selectedUserId,
          startTime: start,
          endTime: end
        }, function (events) {
          $scope.events = events;
          $scope.eventsForCalendar.length = 0;
          $scope.events.forEach(function (evt) {
            $scope.eventsForCalendar.push(convertCalendarEvent(evt));
          });
        });
    };

    $scope.showModal = function (calendarEvent) {
      var event = $filter('filter')($scope.events, {_id: calendarEvent.id})[0];
      var modalInstance = $modal.open({
        templateUrl: '/app/interviews/eventNew.html',
        controller: 'mvEventNewCtrl',
        keyboard: false,
        resolve: {
          application: function () {
            return {
              name: event.name,
              applyPosition: event.applyPosition,
              mobile: event.mobile,
              email: event.email
            };
          },
          event: function () {
            return event;
          }
        }
      });

      modalInstance.result.then(function (newEvent) {
        angular.forEach($scope.events, function (event, index) {
          if (event._id === newEvent._id) {
            $scope.events[index] = newEvent;
            return false;
          }
        });

        angular.forEach($scope.eventsForCalendar, function (event, index) {
          if (event.id === newEvent._id) {
            $scope.eventsForCalendar[index] = convertCalendarEvent(newEvent);
            return false;
          }
        });
      });
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