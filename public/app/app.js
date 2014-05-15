'use strict';

angular.module('compass',
  ['ngCookies', 'ngRoute', 'ngResource', 'ngSanitize', 'ui.bootstrap', 'ui.calendar', 'ngGrid',
    'ui.tinymce', 'ui.select2', 'ui.datetimepicker'])
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
      height: 300,
      plugins: 'link image table',
      statusbar: false,
      menubar: 'tools table format view insert edit',
      content_css: '/vendor/tinymce/tinymce-content.css'
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
      .when('/events', {
        templateUrl: '/app/interviews/list.html',
        controller: 'mvEventListCtrl',
        resolve: routeRoleChecks.user
      })
      .when('/settings/eventSetting', {
        templateUrl: '/app/eventSetting/view.html',
        controller: 'mvEventSettingCtrl'
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
      .when('/fuck', {
        templateUrl: '/app/interviews/eventNew.html',
        controller: 'mvEventNewCtrl'
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
        return states[key] || {};
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
    pursued: '通过',
    undetermined: '待定'
  })
  .value('mvMoment', moment)
  .constant('uiCalendarConfig', {
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月', '一月'],
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月', '一月'],
    dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    allDayText: '全天',
    axisFormat: 'HH:mm',
    buttonText: {
      today: '今日',
      'week': '周',
      'month': '月',
      'day': '天'
    },
    allDaySlot: false,
    timeFormat: 'H:mm{ - H:mm}',
    titleFormat: {
      month: 'yyyy年M月',
      week: 'yyyy年M月d日 { \'&#8212;\' [yyyy年][M月]d日}, 第W周',
      day: 'yyyy年M月d日, dddd'
    }
  });