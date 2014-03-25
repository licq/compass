'use strict';

angular.module('compass').filter('state', function () {
    return function (input) {
        if (!input) return '正常';
        if (input === 'connect failed') return '服务器无法连接';
        if (input === 'login failed') return '用户名或密码不正确';
        return input;
    };
});