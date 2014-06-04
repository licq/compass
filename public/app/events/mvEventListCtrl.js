'use strict';

angular.module('compass')
  .controller('mvEventListCtrl', function ($scope, $rootScope, mvEvent, mvIdentity, mvMoment, $modal, $filter, mvUser) {
    $scope.eventsForCalendar = [];
    $scope.eventSources = [$scope.eventsForCalendar];
    $scope.selectedUserId = mvIdentity.currentUser._id;

    mvUser.query({fields: 'name'}, function (users) {
      $scope.users = users;
      $scope.selectedUserId = mvIdentity.currentUser._id;
    });

    function convertCalendarEvent(evt) {
      return {
        id: evt._id,
        start: mvMoment(evt.startTime).toDate(),
        end: mvMoment(evt.startTime).add('minutes', evt.duration).toDate(),
        title: evt.name + '面试(' + evt.applyPosition + ')',
        allDay: false,
        backgroundColor: mvMoment(evt.startTime).isBefore(new Date()) ? 'rgb(128,128,128)' : 'rgb(219,173,255)',
        textColor: 'black',
        editable: true
      };
    }

    $scope.retrieveEvents = function () {
      mvEvent.query(
        {user: $scope.selectedUserId,
          startTime: $scope.start,
          endTime: $scope.end
        }, function (events) {
          $scope.events = events;
          $scope.eventsForCalendar.length = 0;
          $scope.events.forEach(function (evt) {
            $scope.eventsForCalendar.push(convertCalendarEvent(evt));
          });
        });
    };

    $scope.showModal = function (calendarEvent) {
      var event, index;
      angular.forEach($scope.events, function (e, i) {
        if (e._id === calendarEvent.id) {
          event = e;
          index = i;
          return false;
        }
      });

      var modalInstance = $modal.open({
        templateUrl: '/app/events/new.html',
        controller: 'mvEventNewCtrl',
        keyboard: false,
        resolve: {
          event: function () {
            return event;
          }
        }
      });

      modalInstance.result.then(function (newEvent) {
        if (newEvent) {
          newEvent.countsOfEvents = $scope.events[index].countsOfEvents + 1;
          $scope.events[index] = newEvent;
          $scope.eventsForCalendar[index] = convertCalendarEvent(newEvent);
        } else {
          angular.forEach($scope.events, function (e) {
            if (e.application === newEvent.application) {
              e.countsOfEvents--;
            }
          });
          $scope.events.splice(index, 1);
          $scope.eventsForCalendar.splice(index, 1);
        }
      });
    };

    $scope.sync = function (calendarEvent) {
      var event, index;
      angular.forEach($scope.events, function (e, i) {
        if (e._id === calendarEvent.id) {
          event = e;
          index = i;
          return false;
        }
      });
      var oldStartTime = new Date(event.startTime), newStartTime = new Date(calendarEvent.start);
      event.startTime = calendarEvent.start;
      event.duration = mvMoment(calendarEvent.end).diff(calendarEvent.start, 'minutes');
      var countOfEvents = event.countOfEvents;
      console.log(countOfEvents);
      mvEvent.update(event, function () {
        $rootScope.$broadcast('changeOfEvent', 'update', newStartTime, oldStartTime, countOfEvents);
        $scope.eventsForCalendar[index] = convertCalendarEvent(event);
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
        $scope.start = view.start.toISOString();
        $scope.end = view.end.toISOString();
        $scope.retrieveEvents();
      },
      eventDrop: $scope.sync,
      eventResize: $scope.sync
    };
  });