'use strict';

angular.module('compass')
    .controller('mvCalendarViewCtrl', function ($scope) {
        $scope.crumbs = [
            {text: '面试日历', url: 'calendars'},
        ];
        $scope.eventCalendarConfig = {
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月', '一月'],
            monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月', '一月'],
            dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', ],
            dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', ],
            header: {
                right: 'month agendaWeek agendaDay',
                center: 'title',
                left: 'prev,next today'
            },
            buttonText: {
                today: '今日',
                'week': '周',
                'month': '月',
                'day': '天'
            },
            firstHour: 8
        };

    });
