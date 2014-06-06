'use strict';

angular.module('compass',
  ['ngCookies', 'ngRoute', 'ngResource', 'ngSanitize', 'ui.bootstrap', 'ui.calendar',
    'ui.select2', 'ui.datetimepicker', 'trNgGrid', 'textAngular', 'ui.daterangepicker'])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/welcome', {
        templateUrl: '/app/common/welcome.html'
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
        authenticate: true
      })
      .
      when('/settings/emails', {
        templateUrl: '/app/emails/list.html',
        controller: 'mvEmailListCtrl',
        authenticate: true
      })
      .when('/settings/emails/new', {
        templateUrl: '/app/emails/new.html',
        controller: 'mvEmailNewCtrl',
        authenticate: true
      })
      .when('/settings/emails/edit/:id', {
        templateUrl: '/app/emails/edit.html',
        controller: 'mvEmailEditCtrl',
        authenticate: true
      })
      .when('/settings/mails', {
        templateUrl: '/app/mails/list.html',
        controller: 'mvMailListCtrl',
        authenticate: true
      })
      .when('/settings/mails/:id', {
        templateUrl: '/app/mails/view.html',
        controller: 'mvMailViewCtrl',
        authenticate: true
      })
      .when('/settings/users', {
        templateUrl: '/app/users/list.html',
        controller: 'mvUserListCtrl',
        authenticate: true
      })
      .when('/settings/users/new', {
        templateUrl: '/app/users/new.html',
        controller: 'mvUserNewCtrl',
        authenticate: true
      })
      .when('/settings/users/edit/:id', {
        templateUrl: '/app/users/edit.html',
        controller: 'mvUserEditCtrl',
        authenticate: true
      })
      .when('/resumes', {
        templateUrl: '/app/resumes/list.html',
        controller: 'mvResumeListCtrl',
        authenticate: true
      })
      .when('/resumes/:id', {
        templateUrl: '/app/resumes/view.html',
        controller: 'mvResumeViewCtrl',
        authenticate: true
      })
      .when('/settings/companies', {
        templateUrl: '/app/companies/list.html',
        controller: 'mvCompanyListCtrl',
        authenticate: true
      })
      .when('/events', {
        templateUrl: '/app/events/list.html',
        controller: 'mvEventListCtrl',
        authenticate: true
      })
      .when('/interviews/list', {
        templateUrl: '/app/interviews/list.html',
        controller: 'mvInterviewListCtrl',
        authenticate: true
      })
      .when('/interviews/reviews', {
        templateUrl: '/app/reviews/list.html',
        controller: 'mvReviewListCtrl',
        authenticate: true
      })
      .when('/interviews/offers', {
        templateUrl: '/app/offers/list.html',
        controller: 'mvOfferListCtrl',
        authenticate: true
      })
      .when('/interviews/onboards', {
        templateUrl: '/app/onboard/list.html',
        controller: 'mvOnboardListCtrl',
        authenticate: true
      })
      .when('/interviews/reviews/:id', {
        templateUrl: '/app/reviews/new.html',
        controller: 'mvReviewNewCtrl',
        authenticate: true
      })
      .when('/interviews/:id', {
        templateUrl: '/app/interviews/view.html',
        controller: 'mvInterviewViewCtrl',
        authenticate: true
      })
      .when('/settings/eventSetting', {
        templateUrl: '/app/eventSetting/view.html',
        controller: 'mvEventSettingCtrl',
        authenticate: true
      })
      .when('/settings/evaluationCriterions', {
        templateUrl: '/app/evaluationCriterions/edit.html',
        controller: 'mvEvaluationCriterionEditCtrl',
        authenticate: true
      })
      .when('/applications/:status', {
        templateUrl: '/app/applications/list.html',
        controller: 'mvApplicationListCtrl',
        authenticate: true
      })
      .when('/applications/:status/:index', {
        templateUrl: '/app/applications/view.html',
        controller: 'mvApplicationViewCtrl',
        authenticate: true
      })
      .when('/systemSettings/systemOperations', {
        templateUrl: '/app/systemOperations/view.html',
        controller: 'mvSystemOperationsCtrl',
        authenticate: true
      })
      .otherwise({
        resolve: {
          load: function (mvIdentity, $location, $q) {
            var defer = $q.defer();
            if (mvIdentity.isAuthenticated()) {
              $location.path('/dashboard');
            } else {
              $location.path('/welcome');
            }
            defer.reject();
            return defer.promise;
          }
        }
      });
    $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
      return {
        'responseError': function (response) {
          if (response.status === 401) {
            $location.path('/login');
            return $q.reject(response);
          } else {
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
    timeFormat: 'H:mm{ -H:mm}',
    titleFormat: {
      month: 'yyyy年M月',
      week: 'yyyy年M月d日 { \'&#8212;\' [yyyy年][M月]d日}, 第W周',
      day: 'yyyy年M月d日, dddd'
    }
  })
  .run(function ($rootScope) {
    $rootScope.gridDefaults = {
      multiSelect: false,
//      headerRowHeight: 40,
//      rowHeight: 40,
      showFooter: true,
      i18n: 'zh-cn'
    };
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
    timeFormat: 'H:mm{ -H:mm}',
    titleFormat: {
      month: 'yyyy年M月',
      week: 'yyyy年M月d日 { \'&#8212;\' [yyyy年][M月]d日}, 第W周',
      day: 'yyyy年M月d日, dddd'
    }
  })
  .config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate',
      function (taRegisterTool, taOptions) {

        taRegisterTool('insertName', {
          buttontext: '插入姓名',
          action: function () {
            document.execCommand('insertText', false, '{{姓名}}');
          }});
        taRegisterTool('applyPosition', {
          buttontext: '应聘职位',
          action: function () {
            document.execCommand('insertText', false, '{{应聘职位}}');
          }});
        taRegisterTool('startTime', {
          buttontext: '开始时间',
          action: function () {
            document.execCommand('insertText', false, '{{开始时间}}');
          }});
        taRegisterTool('endTime', {
          buttontext: '结束时间',
          action: function () {
            document.execCommand('insertText', false, '{{结束时间}}');
          }});

        taOptions.toolbar.push(['insertName', 'applyPosition', 'startTime', 'endTime']);
        //taOptions.toolbar[4].push('insertName','applyPosition', 'startTime', 'endTime');
        return taOptions;
      }]);
  });