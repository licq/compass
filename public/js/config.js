'use strict';

app.config(
    function ($routeProvider, $urlRouterProvider) {
        console.log('config');
        $routeProvider
            .when('/emails', {
                templateUrl: '/views/emails/list.html',
                controller: 'EmailListController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
);

