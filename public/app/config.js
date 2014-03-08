'use strict';

angular.module('compass').config(
    function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/views/dashboard.html'
            })
            .when('/emails', {
                templateUrl: '/views/emails/list.html',
                controller: 'EmailListController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
);

