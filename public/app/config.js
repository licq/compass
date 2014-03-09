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
            .otherwise({
                redirectTo: '/'
            });
    });

