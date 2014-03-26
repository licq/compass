'use strict';

angular.module('compass', ['ngCookies', 'ngRoute', 'ngResource', 'ui.bootstrap',
        'ui.router', 'ngGrid'])
    .run(function ($rootScope) {
        $rootScope.gridDefaults = {
            multiSelect: false,
            headerRowHeight: 40,
            rowHeight: 40,
            showFooter: true,
            i18n: 'zh-cn'
        };
    })
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
        var routeRoleChecks = {
            user: { auth: function (mvAuth) {
                return mvAuth.authenticated();
            }},

            anonymous: {auth: function (mvAuth) {
                return mvAuth.notAuthenticated();
            }}
        };

        $routeProvider
            .when('/', {
                templateUrl: '/app/index/index.html',
                resolve: routeRoleChecks.anonymous
            })
            .when('/login', {
                templateUrl: '/app/auth/login.html',
                controller: 'mvLoginCtrl'
            })
            .when('/signup', {
                templateUrl: '/app/signup/new.html',
                controller: 'mvSignupNewCtrl'
            })
            .when('/signup/success/:code/:email', {
                templateUrl: '/app/signup/success.html',
                controller: 'mvSignupSuccessCtrl'
            })
            .when('/signup/activate/:code', {
                templateUrl: '/app/signup/activate.html',
                controller: 'mvSignupActivateCtrl'
            })
            .when('/dashboard', {
                templateUrl: '/app/dashboard/dashboard.html',
                resolve: routeRoleChecks.user
            })
            .
            when('/emails', {
                templateUrl: '/app/emails/list.html',
                controller: 'mvEmailListCtrl'
            })
            .when('/emails/new', {
                templateUrl: '/app/emails/new.html',
                controller: 'mvEmailNewCtrl'
            })
            .when('/emails/edit/:id', {
                templateUrl: '/app/emails/edit.html',
                controller: 'mvEmailEditCtrl'
            })
            .when('/mails', {
                templateUrl: '/app/mails/list.html',
                controller: 'mvMailListCtrl',
                resolve: routeRoleChecks.user
            })
            .when('/mails/:id', {
                templateUrl: '/app/mails/view.html',
                controller: 'mvMailViewCtrl',
                resolve: routeRoleChecks.user
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
            return {
                'responseError': function (response) {
                    if (response.status === 401) {
                        $location.path('/login');
                        return $q.reject(response);
                    }
                    else {
                        return $q.reject(response);
                    }
                }
            };
        }]);
    })
    .run(function ($rootScope, $location, mvIdentity) {
        $rootScope.$on('$routeChangeStart', function (event, next) {
            if (next.authenticate && !mvIdentity.isAuthenticated()) {
                $location.path('/login');
            }
        });

        $rootScope.$on('$routeChangeError', function (evt, current, previous, rejection) {
            if (rejection === 'authenticated already') {
                $location.path('/dashboard');
            }

            if (rejection === 'not authenticated') {
                $location.path('/login');
            }
        });
    });



