'use strict';

angular.module('compass', ['ngCookies', 'ngRoute', 'ngResource', 'ngSanitize', 'ui.bootstrap', 'ui.calendar', 'ngGrid',
    'ui.tinymce'])
    .run(function ($rootScope) {
        $rootScope.gridDefaults = {
            multiSelect: false,
            headerRowHeight: 40,
            rowHeight: 40,
            showFooter: true,
            i18n: 'zh-cn'
        };
        $rootScope.tinymceOptions = {
            language: 'zh_CN',
            height: 500,
            plugins: 'link image table',
            statusbar: false,
            menubar: 'tools table format view insert edit',
            toolbar: 'undo redo | styleselect | bold italic | link image | alignleft aligncenter alignright | insertName | insertApplyPosition',
            content_css: '/vendor/tinymce/tinymce-content.css',
            setup: function (ed) {
                ed.addButton('insertName', {
                    text: '插入姓名',
                    icon: false,
                    onclick: function () {
                        ed.focus();
                        ed.execCommand('mceInsertContent', false, '{{name}}');
                    }
                });
                ed.addButton('insertApplyPosition', {
                    text: '插入应聘职位',
                    icon: false,
                    onclick: function () {
                        ed.focus();
                        ed.execCommand('mceInsertContent', false, '{{applyPosition}}');
                    }
                });
            }
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
            .when('/users', {
                templateUrl: '/app/users/list.html',
                controller: 'mvUserListCtrl',
                resolve: routeRoleChecks.user
            })
            .when('/users/new', {
                templateUrl: '/app/users/new.html',
                controller: 'mvUserNewCtrl',
                resolve: routeRoleChecks.user
            })
            .when('/users/edit/:id', {
                templateUrl: '/app/users/edit.html',
                controller: 'mvUserEditCtrl',
                resolve: routeRoleChecks.user
            })
            .when('/resumes', {
                templateUrl: '/app/resumes/list.html',
                controller: 'mvResumeListCtrl',
                resolve: routeRoleChecks.user
            })
            .when('/resumes/:id', {
                templateUrl: '/app/resumes/view.html',
                controller: 'mvResumeViewCtrl',
                resolve: routeRoleChecks.user
            })
            .when('/companies', {
                templateUrl: '/app/companies/list.html',
                controller: 'mvCompanyListCtrl',
                resolve: routeRoleChecks.user
            })
            .when('/companies/new', {
                templateUrl: '/app/companies/new.html',
                controller: 'mvCompanyNewCtrl',
                resolve: routeRoleChecks.user
            })
            .when('/companies/edit/:id', {
                templateUrl: '/app/companies/edit.html',
                controller: 'mvCompanyEditCtrl',
                resolve: routeRoleChecks.user
            })
            .when('/calendar', {
                templateUrl: '/app/calendar/view.html',
                controller: 'mvCalendarViewCtrl',
                resolve: routeRoleChecks.user
            })
            .when('/settings/emailTemplates', {
                templateUrl: '/app/emailTemplates/list.html',
                controller: 'mvEmailTemplateListCtrl'
            })
            .when('/settings/emailTemplates/new', {
                templateUrl: '/app/emailTemplates/new.html',
                controller: 'mvEmailTemplateNewCtrl'
            })
            .when('/settings/emailTemplates/edit/:id', {
                templateUrl: '/app/emailTemplates/edit.html',
                controller: 'mvEmailTemplateEditCtrl'
            })
            .when('/settings/evaluationCriterions', {
                templateUrl: '/app/evaluationCriterions/edit.html',
                controller: 'mvEvaluationCriterionEditCtrl'
            })
            .when('/applications/:status', {
                templateUrl: '/app/applications/list.html',
                controller: 'mvApplicationListCtrl'
            })
            .when('/applications/:status/:index', {
                templateUrl: '/app/applications/view.html',
                controller: 'mvApplicationViewCtrl',
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
    .factory('states', function () {
        var states = {};
        return {
            defaults: function (key, value) {
                if (!states.hasOwnProperty(key)) {
                    states[key] = value;
                }
                return states[key];
            },
            get: function (key) {
                return states[key];
            }
        };
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
    })
    .value('applicationStatusMap', {
        new: '新应聘',
        archived: '归档',
        pursued: '约面试',
        undetermined: '待定'
    });



