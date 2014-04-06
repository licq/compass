'use strict';

angular.module('compass')
    .filter('state', function () {
        return function (input) {
            if (!input) return '正常';
            if (input === 'connect failed') return '服务器无法连接';
            if (input === 'login failed') return '用户名或密码不正确';
            return input;
        };
    })
    .filter('deletedState', function () {
        return function (deleted) {
            if (deleted) return '已删除';
            return '正常';
        };
    })
    .filter('yearAndMonth', function ($filter) {
        var dateFilter = $filter('date');
        return function (date) {
            return dateFilter(date, 'yyyy年M月');
        }
    })
    .filter('shortDate', function ($filter) {
        var dateFilter = $filter('date');
        return function (date) {
            return dateFilter(date, 'yyyy年M月d日');
        }
    })
    .filter('longDate', function ($filter) {
        var dateFilter = $filter('date');
        return function (date) {
            return dateFilter(date, 'yyyy年M月d日 HH:mm:ss');
        }
    })
    .filter('yearsOfExperience', function () {
        return function (input) {
            if (input === 0) return '应届毕业生';
            if (input === -1) return '学生';
            return '' + input + '年';
        }
    });