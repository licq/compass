angular.module('compass')
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/welcome', {
        templateUrl: '/app/common/welcome.html'
      })
      .when('/tutorial', {
        templateUrl: '/app/tutorial/tutorial.html',
        controller: 'mvTutorialCtrl',
        authenticate: true
      })
      .when('/login', {
        templateUrl: '/app/auth/login.html',
        controller: 'mvLoginCtrl'
      })
      .when('/forgot', {
        templateUrl: '/app/forgot/forgot.html',
        controller: 'mvForgotCtrl'
      })
      .when('/forgot/reset', {
        templateUrl: '/app/forgot/reset.html',
        controller: 'mvResetCtrl'
      })
      .when('/signup', {
        templateUrl: '/app/signup/new.html',
        controller: 'mvSignupNewCtrl'
      })
      .when('/signup/success', {
        templateUrl: '/app/signup/success.html',
        controller: 'mvSignupSuccessCtrl'
      })
      .when('/signup/activate', {
        templateUrl: '/app/signup/activate.html',
        controller: 'mvSignupActivateCtrl'
      })
      .when('/today', {
        templateUrl: '/app/today/today.html',
        controller: 'mvTodayCtrl',
        authenticate: true
      })
      .
      when('/settings/emails', {
        templateUrl: '/app/emails/list.html',
        controller: 'mvEmailListCtrl',
        authenticate: true,
        permissions: 'setMails'
      })
      .when('/settings/emails/new', {
        templateUrl: '/app/emails/new.html',
        controller: 'mvEmailNewCtrl',
        authenticate: true,
        permissions: 'setMails'
      })
      .when('/settings/emails/edit/:id', {
        templateUrl: '/app/emails/edit.html',
        controller: 'mvEmailEditCtrl',
        authenticate: true,
        permissions: 'setMails'
      })
      .when('/settings/mails', {
        templateUrl: '/app/mails/list.html',
        controller: 'mvMailListCtrl',
        authenticate: true,
        permissions: 'setMails'
      })
      .when('/settings/mails/:id', {
        templateUrl: '/app/mails/view.html',
        controller: 'mvMailViewCtrl',
        authenticate: true,
        permissions: 'setMails'
      })
      .when('/settings/users', {
        templateUrl: '/app/users/list.html',
        controller: 'mvUserListCtrl',
        authenticate: true,
        permissions: 'setUsers'
      })
      .when('/settings/users/new', {
        templateUrl: '/app/users/new.html',
        controller: 'mvUserNewCtrl',
        authenticate: true,
        permissions: 'setUsers'
      })
      .when('/settings/users/edit/:id', {
        templateUrl: '/app/users/edit.html',
        controller: 'mvUserEditCtrl',
        authenticate: true,
        resolve: {
          isSelf: ['mvIdentity', 'mvPermission', '$location', '$q', '$route', function (mvIdentity, mvPermission, $location, $q, $route) {
            var defer = $q.defer();
            if (mvPermission.hasPermission('setUsers') ||
              mvIdentity.currentUser._id === $route.current.params.id) {
              defer.resolve({permissions: 'setUsers'});
            } else {
              $location.path('/today');
              defer.reject();
            }
            return defer.promise;
          }]
        }
      })
      .when('/settings/roles', {
        templateUrl: '/app/roles/list.html',
        controller: 'mvRoleListCtrl',
        authenticate: true,
        permissions: 'setRoles'
      })
      .when('/settings/roles/new', {
        templateUrl: '/app/roles/new.html',
        controller: 'mvRoleNewCtrl',
        authenticate: true,
        permissions: 'setRoles'
      })
      .when('/settings/roles/edit/:id', {
        templateUrl: '/app/roles/edit.html',
        controller: 'mvRoleEditCtrl',
        authenticate: true,
        permissions: 'setRoles'
      })
      .when('/settings/positions', {
        templateUrl: '/app/positions/list.html',
        controller: 'mvPositionListCtrl',
        authenticate: true,
        permissions: 'setPositions'
      })
      .when('/settings/positions/new', {
        templateUrl: '/app/positions/new.html',
        controller: 'mvPositionNewCtrl',
        authenticate: true,
        permissions: 'setPositions'
      })
      .when('/settings/positions/edit/:id', {
        templateUrl: '/app/positions/edit.html',
        controller: 'mvPositionEditCtrl',
        authenticate: true,
        permissions: 'setPositions'
      })
      .when('/settings/eventSetting', {
        templateUrl: '/app/eventSetting/view.html',
        controller: 'mvEventSettingCtrl',
        authenticate: true,
        permissions: 'setEventSetting'
      })
      .when('/settings/applicationSetting', {
        templateUrl: '/app/applicationSetting/view.html',
        controller: 'mvApplicationSettingCtrl',
        authenticate: true,
        permissions: 'setApplicationSetting'
      })
      .when('/settings/evaluationCriterions', {
        templateUrl: '/app/evaluationCriterions/edit.html',
        controller: 'mvEvaluationCriterionEditCtrl',
        authenticate: true,
        permissions: 'setEvaluationCriterions'
      })
      .when('/resumes', {
        templateUrl: '/app/resumes/list.html',
        controller: 'mvResumeListCtrl',
        authenticate: true,
        permissions: 'resumes'
      })
      .when('/resumes/:id', {
        templateUrl: '/app/resumes/view.html',
        controller: 'mvResumeViewCtrl',
        authenticate: true
      })
      .when('/events', {
        templateUrl: '/app/events/list.html',
        controller: 'mvEventListCtrl',
        authenticate: true,
        permissions: 'events'
      })
      .when('/interviews/list', {
        templateUrl: '/app/interviews/list.html',
        controller: 'mvInterviewListCtrl',
        authenticate: true,
        permissions: 'intList'
      })
      .when('/interviews/reviews', {
        templateUrl: '/app/reviews/list.html',
        controller: 'mvReviewListCtrl',
        authenticate: true,
        permissions: 'intReviews'
      })
      .when('/interviews/offers', {
        templateUrl: '/app/offers/list.html',
        controller: 'mvOfferListCtrl',
        authenticate: true,
        permissions: 'intOffers'
      })
      .when('/interviews/onboards', {
        templateUrl: '/app/onboard/list.html',
        controller: 'mvOnboardListCtrl',
        authenticate: true,
        permissions: 'intOnboards'
      })
      .when('/interviews/reviews/:id', {
        templateUrl: '/app/reviews/new.html',
        controller: 'mvReviewNewCtrl',
        authenticate: true,
        permissions: 'intReviews'
      })
      .when('/interviews/:id', {
        templateUrl: '/app/interviews/view.html',
        controller: 'mvInterviewViewCtrl',
        authenticate: true,
        permissions: 'interviews'
      })
      .when('/applications/uploadResume', {
        templateUrl: '/app/applications/upload.html',
        controller: 'mvApplicationUploadResumeCtrl',
        authenticate: true,
        permissions: 'applications'
      })
      .when('/applications/:status', {
        templateUrl: '/app/applications/list.html',
        controller: 'mvApplicationListCtrl',
        authenticate: true,
        permissions: 'applications'
      })
      .when('/applications/:status/:index', {
        templateUrl: '/app/applications/view.html',
        controller: 'mvApplicationViewCtrl',
        authenticate: true,
        permissions: 'applications'
      })
      .when('/systemSettings/companies', {
        templateUrl: '/app/companies/list.html',
        controller: 'mvCompanyListCtrl',
        authenticate: true,
        permissions: '#systemSettings'
      })
      .when('/systemSettings/systemOperations', {
        templateUrl: '/app/systemOperations/view.html',
        controller: 'mvSystemOperationsCtrl',
        authenticate: true,
        permissions: '#systemSettings'
      })
      .when('/reports/resumes', {
        templateUrl: '/app/resumeReports/view.html',
        controller: 'mvResumeReportViewCtrl',
        authenticate: true,
        permissions: 'repResumes'
      })
      .when('/reports/interviews', {
        templateUrl: '/app/interviewReports/view.html',
        controller: 'mvInterviewReportViewCtrl',
        authenticate: true,
        permissions: 'repInterviews'
      })
      .otherwise({
        resolve: {
          load: ['mvIdentity', '$location', '$q', function (mvIdentity, $location, $q) {
            var defer = $q.defer();
            if (mvIdentity.isAuthenticated()) {
              if (mvIdentity.currentUser.firstRun)
                $location.path('/tutorial');
              else
                $location.path('/today');
            } else {
              $location.path('/welcome');
            }
            defer.reject();
            return defer.promise;
          }]
        }
      });

    $httpProvider.interceptors.push(['$q', '$location', 'mvIdentity', function ($q, $location, mvIdentity) {
      return {
        'responseError': function (response) {
          if (response.status === 401 || response.status === 403) {
            mvIdentity.currentUser = undefined;
            $location.path('/login');
            return $q.reject(response);
          } else {
            return $q.reject(response);
          }
        }
      };
    }]);
  })
  .run(function (states, $rootScope, $location, mvIdentity, mvPermission) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      if (next.authenticate && !mvIdentity.isAuthenticated()) {
        $location.path('/login');
      }

      var permissions = next.permissions;
      if (permissions && _.isString(permissions) && !mvPermission.hasPermission(permissions)) {
        $location.path('/today');
      }

      var applicationRegExp = /^\/applications\//;
      if (applicationRegExp.test(current && current.originalPath) && (!applicationRegExp.test(next && next.originalPath) || (current.pathParams.status !== next.pathParams.status) )) {
        states.reset('mvApplicationListCtrl' + current.pathParams.status);
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
      reset: function (key) {
        delete states[key];
      },
      get: function (key) {
        return states[key] || {};
      }
    };
  })
  .value('applicationStatusMap', {
    'new': '新应聘',
    archived: '归档',
    pursued: '通过',
    undetermined: '待定'
  })
  .value('menuPermissions',
  [
    //{name: 'today', cnName: '今日', enabled: false},
    {name: 'events', cnName: '日历', enabled: false},
    {name: 'applications', cnName: '应聘', enabled: false,
      submenus: [
        {name: 'appNew', cnName: '新应聘', enabled: false},
        {name: 'appUndetermined', cnName: '待定', enabled: false},
        {name: 'appPursued', cnName: '通过', enabled: false},
        {name: 'uploadResume', cnName: '上传简历', enabled: false}
      ]},
    {name: 'interviews', cnName: '面试', enabled: false,
      submenus: [
        {name: 'intReviews', cnName: '评价', enabled: false},
        {name: 'intList', cnName: '面试中', enabled: false},
        {name: 'intOffers', cnName: '通过', enabled: false},
        {name: 'intOnboards', cnName: '入职', enabled: false}
      ]},
    {name: 'resumes', cnName: '人才库', enabled: false},
    { name: 'reports', cnName: '报表', enabled: false,
      submenus: [
        {name: 'repResumes', cnName: '应聘报表', enabled: false},
        {name: 'repInterviews', cnName: '面试报表', enabled: false}
      ]},
    { name: 'settings', cnName: '设置', enabled: false,
      submenus: [
        {name: 'setMails', cnName: '简历邮箱', enabled: false},
        {name: 'setUsers', cnName: '用户', enabled: false},
        {name: 'setRoles', cnName: '角色', enabled: false},
        {name: 'setPositions', cnName: '职位', enabled: false},
        {name: 'setEvaluationCriterions', cnName: '默认面试评价', enabled: false},
        {name: 'setApplicationSetting', cnName: '应聘设置', enabled: false},
        {name: 'setEventSetting', cnName: '面试设置', enabled: false}
      ]}
  ])
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
    lazyFetching: true,
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

        function insertText(html) {
          var sel, range;
          if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
              range = sel.getRangeAt(0);
              range.deleteContents();

              // Range.createContextualFragment() would be useful here but is
              // non-standard and not supported in all browsers (IE9, for one)
              var el = document.createElement('div');
              el.innerHTML = html;
              var frag = document.createDocumentFragment(), node, lastNode;
              while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
              }
              range.insertNode(frag);

              // Preserve the selection
              if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
              }
            }
          } else if (document.selection && document.selection.type !== 'Control') {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
          }
        }

        taRegisterTool('insertName', {
          buttontext: '插入姓名',
          action: function () {
            insertText('{{姓名}}');
          }});
        taRegisterTool('applyPosition', {
          buttontext: '应聘职位',
          action: function () {
            insertText('{{应聘职位}}');
          }});
        taRegisterTool('startTime', {
          buttontext: '开始时间',
          action: function () {
            insertText('{{开始时间}}');
          }});
        taRegisterTool('endTime', {
          buttontext: '结束时间',
          action: function () {
            insertText('{{结束时间}}');
          }});

        taOptions.toolbar.push(['insertName', 'applyPosition', 'startTime', 'endTime']);
        return taOptions;
      }]);
  })
  .run(function ($rootScope, $filter) {
    moment.locale('zh-cn',{
      longDateFormat : {
        LT : 'H:mm',
        L : 'YYYY-MM-DD',
        LL : 'YYYY年MMMD日',
        LLL : 'YYYY年MMMD日LT',
        LLLL : 'YYYY年MMMD日ddddLT',
        l : 'YYYY-MM-DD',
        ll : 'YYYY年MMMD日',
        lll : 'YYYY年MMMD日LT',
        llll : 'YYYY年MMMD日ddddLT'
      }
    });
    $rootScope.applicationFilterOptions = [
      {label: '不过滤', value: 0},
      {label: '3个月内不允许重复投递', value: 3},
      {label: '半年内不允许重复投递', value: 6},
      {label: '一年内不允许重复投递', value: 12},
      {label: '两年内不允许重复投递', value: 24},
      {label: '永远不允许再投递', value: 999},
    ];

    $rootScope.chartFunction = {
      convert: function (type, data) {
        var map = {
          day: {
            series: _.range(moment().add({months: -1, days: 1}).startOf('day').valueOf(),
                moment().startOf('day').valueOf() + 1,
                1000 * 60 * 60 * 24),
            lookup: function (d, t) {
              var m = moment(t);
              return _.find(d, {year: m.year(), month: m.month() + 1, day: m.date()});
            },
            format: function (time) {
              var m = moment(time);
              if (m.date() === 1) {
                return m.format('M月');
              }
              return moment(time).format('D');
            }
          },
          week: {
            series: _.range(moment().subtract(11, 'w').startOf('week').valueOf(),
                moment().startOf('week').valueOf() + 1,
                1000 * 60 * 60 * 24 * 7),
            lookup: function (d, t) {
              var m = moment(t);
              return _.find(d, {year: m.year(), week: m.week()});
            },
            format: function (time) {
              return moment(time).format('第w周');
            }
          },
          month: {
            series: _.map(_.range(-11, 1), function (i) {
              return moment().add(i, 'M').startOf('month').toDate();
            }),
            lookup: function (d, t) {
              var m = moment(t);
              return _.find(d, {year: m.year(), month: m.month() + 1});
            },
            format: function (time) {
              var m = moment(time);
              if (m.month() === 0) {
                return m.format('YYYY年');
              }
              return m.format('M月');
            }
          }
        };
        return _.map(map[type].series, function (time) {
          var xLabel = map[type].format(time),
            d = map[type].lookup(data, time);
          if (d) {
            return [xLabel, d.count];
          } else {
            return [xLabel, 0];
          }
        });
      },
      yAxisTickFormatFunction: function () {
        return function (n) {
          if (n === Math.floor(n)) {
            return $filter('number')(n, 0);
          } else {
            return '';
          }
        };
      },
      toolTipContentFunction: function () {
        return function (key, x, y) {
          return '<strong class="text-success">' + y + '</strong>';
        };
      },
      pieToolTipContentFunction: function () {
        return function (key, x) {
          return key + ' <strong>' + $filter('number')(x, 0) + '</strong>';
        };
      },
      pieX: function () {
        return function (d) {
          return d.name;
        };
      },
      pieY: function () {
        return function (d) {
          return d.count;
        };
      },
      pieDescription: function () {
        return function (d) {
          return d.count;
        };
      },
      colorFunction: function () {
        var colorArray = ['#FF6600', '#FCD202', '#B0DE09', '#0D8ECF', '#2A0CD0', '#CD0D74', '#CC0000', '#00CC00', '#0000CC', '#DDDDDD', '#999999', '#333333', '#990000'];
        return function (d, i) {
          return colorArray[i];
        };
      },
      barColorFunction: function () {
        return function () {
          return '#0D8ECF';
        };
      }
    };
  });