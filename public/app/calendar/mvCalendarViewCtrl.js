'use strict';

angular.module('compass')
    .controller('mvCalendarViewCtrl', function ($scope) {
        $scope.crumbs = [
            {text: '面试日历', url: 'calendars'},
        ];
        $scope.eventCalendarConfig = {
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月', '一月'],
            dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', ],
            editable: true,
            header: {
                left: 'month basicWeek basicDay agendaWeek agendaDay',
                center: '面试日历',
                right: 'today prev,next'
            },
            dayClick: $scope.alertEventOnClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
        };

    });
