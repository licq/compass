'use strict';

angular.module('compass').run(
    function ($rootScope) {
        $rootScope.gridDefaults = {
            multiSelect: false,
            headerRowHeight: 40,
            rowHeight: 40,
            showFooter: true,
            i18n: 'zh-cn'
        };
    });


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
            .when('/emails/new',{
                templateUrl: '/views/emails/new.html',
                controller: 'EmailNewController'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

