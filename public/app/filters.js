'use strict';

angular.module('compass')
  .filter('state', function () {
    return function (input) {
      if (!input) {
        return '正常';
      }
      if (input === 'connect failed') {
        return '服务器无法连接';
      }
      if (input === 'login failed') {
        return '用户名或密码不正确';
      }
      return input;
    };
  })
  .filter('deletedState', function () {
    return function (deleted) {
      if (deleted) {
        return '已删除';
      }
      return '正常';
    };
  })
  .filter('isDeletedUser', function () {
    return function (user) {
      if (user.deleted) {
        return true;
      }
      return false;
    };
  })
  .filter('yearAndMonth', function ($filter) {
    var dateFilter = $filter('date');
    return function (date) {
      if (!date) {
        return;
      }
      var result = dateFilter(date, 'yyyy年M月');
      if (result.indexOf('9999') === 0) {
        return '至今';
      }
      return result;
    };
  })
  .filter('shortDate', function ($filter) {
    var dateFilter = $filter('date');
    return function (date) {
      return dateFilter(date, 'yyyy年M月d日');
    };
  })
  .filter('longDate', function ($filter) {
    var dateFilter = $filter('date');
    return function (date) {
      return dateFilter(date, 'yyyy年M月d日 HH:mm:ss');
    };
  })
  .filter('yearsOfExperience', function () {
    return function (input) {
      if (input === 0) {
        return '应届毕业生';
      }
      if (input === -1) {
        return '学生';
      }
      if (typeof(input) === 'undefined') {
        return '';
      }
      return '' + input + '年';
    };
  })
  .filter('gender', function () {
    return function (input) {
      var genderMap = {
        'male': '男',
        'female': '女'
      };
      return genderMap[input];
    };
  })
  .filter('politicalStatus', function () {
    return function (input) {
      var politicalStatusMap = {
        'party member': '党员',
        'league member': '团员',
        'democratic part': '民主党派',
        'no party': '无党派',
        'citizen': '群众',
        'others': '其他'
      };
      return politicalStatusMap[input];
    };
  })
  .filter('civilState', function () {
    return function (input) {
      var civilStateMap = {
        'single': '单身',
        'married': '已婚',
        'divorced': '离异',
        'confidential': '隐私'
      };
      return civilStateMap[input];
    };
  })
  .filter('typeOfEmployment', function () {
    return function (input) {
      var typeOfEmploymentMap = {
        'fulltime': '全职',
        'parttime': '兼职',
        'intern': '实习'
      };
      return typeOfEmploymentMap[input];
    };
  })
  .filter('entryTime', function () {
    return function (input) {
      var entryTimeMap = {
        'immediately': '立即',
        'within 1 week': '一周以内',
        'within 1 month': '一个月以内',
        '1 to 3 months': '一到三个月',
        'after 3 months': '三个月以上',
        'to be determined': '待定'
      };
      return entryTimeMap[input];
    };
  })
  .constant('degrees', {
    'junior high': '初中',
    'technical school': '中技',
    'high school': '高中',
    'polytechnic': '中专',
    'associate': '大专',
    'bachelor': '本科',
    'mba': 'MBA',
    'master': '硕士',
    'doctorate': '博士',
    'others': '其他'
  })
  .filter('degree', function (degrees) {
    return function (input) {
      return degrees[input];
    };
  })
  .filter('language', function () {
    return function (input) {
      var languageMap = {
        'english': '英语',
        'japanese': '日语',
        'mandarin': '普通话',
        'shanghaihua': '上海话',
        'cantonese': '粤语',
        'french': '法语',
        'germany': '德语',
        'other': '其他'
      };
      return languageMap[input];
    };
  })
  .filter('languageSkillLevel', function () {
    return function (input) {
      var languageSkillMap = {
        'not sure': '不限',
        'average': '一般',
        'good': '良好',
        'very good': '熟练',
        'excellent': '精通',
        undefined: 'N/A'
      };
      return languageSkillMap[input];
    };
  })
  .filter('englishCertificate', function () {
    return function (input) {
      var englishCertificateMap = {
        'cet4': '英语四级',
        'not participate': '未参加',
        'not passed': '未通过',
        'cet6': '英语六级',
        'tem4': '专业四级',
        'tem8': '专业八级'
      };
      return englishCertificateMap[input];
    };
  })
  .filter('japaneseCertificate', function () {
    return function (input) {
      var japaneseCertificateMap = {
        'none': '未参加',
        'level1': '一级',
        'level2': '二级',
        'level3': '三级',
        'level4': '四级',
      };
      return japaneseCertificateMap[input];
    };
  })
  .filter('itSkillLevel', function () {
    return function (input) {
      var itSkillLevelMap = {
        'none': '无',
        'basic': '一般',
        'limited': '了解',
        'advanced': '熟练',
        'expert': '精通'
      };
      return itSkillLevelMap[input];
    };
  })
  .filter('targetSalary', function () {
    return function (range) {
      if (!range || range.from === undefined) {
        return;
      }
      if (range.from === 0 && range.to === 0) {
        return '面议';
      }
      return '' + range.from + '--' + range.to;
    };
  })
  .filter('ageRange', function () {
    return function (age) {
      return '' + age + ' -- ' + (age + 4);
    };
  })
  .filter('showArchiveButton', function () {
    return function (application) {
      return application && application.status !== 'archived';
    };
  })
  .filter('showPursueButton', function () {
    return function (application) {
      return application && application.status !== 'pursued';
    };
  })
  .filter('showUndetermineButton', function () {
    return function (application) {
      return application && application.status === 'new';
    };
  })
  .filter('showInterviewButton', function () {
    return function (application) {
      return application && application.status === 'pursued';
    };
  })
  .filter('interviewers', function () {
    return function (interviewers) {
      return _.map(interviewers, 'name').join(', ');
    };
  })
  .filter('qualified', function () {
    return function (qualified) {
      if (qualified) {
        return '合格';
      } else if (qualified === false) {
        return '不合格';
      }
      return '';
    };
  })
  .filter('interviewStatus', function (shortDateFilter) {
    return function (interview) {
      if (interview) {
        if (interview.status === 'offered') return '面试通过';
        if (interview.status === 'rejected') return '面试拒绝';
        if (interview.status === 'noshow') return '面试爽约';
        if (interview.status === 'offer rejected') return '应聘者拒绝,拒绝原因:' + interview.applierRejectReason;
        if (interview.status === 'offer accepted') return '应聘者接受,入职日期:' + shortDateFilter(interview.onboardDate);
        if (interview.status === 'recruited') return '已入职,入职日期:' + shortDateFilter(interview.onboardDate);
        if (interview.status === 'not recruited') return '应聘者未入职,拒绝原因:' + interview.applierRejectReason;
        return 'unknown';
      }
      return 'unknown';
    };
  })
  .filter('resumeStatus', function () {
    return function (status) {
      if (status === 'archived') return '初审拒绝';
      if (status === 'rejected') return '面试拒绝';
      if (status === 'offer rejected') return '应聘者拒绝';
      if (status === 'not recruited') return '应聘者未入职';
      if (status === 'duplicate') return '重复投递';
      if (status === 'noshow') return '面试爽约';

      return 'unknown';
    };
  })
  .filter('zeroToLiteral', function () {
    return function (input) {
      return input > 0 ? ('总共有' + input + '个') : '没有';
    };
  })
  .filter('nullToZero', function () {
    return function (input) {
      return input ? input : 0;
    };
  })
  .filter('eventTimeRange', function () {
    return function (event) {
      var start = moment(event.startTime).format('H:mm'),
        end = moment(event.startTime).add(event.duration, 'm').format('H:mm');
      return start + '-' + end;
    };
  })
  .filter('todayTimeRange', function () {
    return function (event) {
      var start = moment(event.startTime).format('M月D日 H:mm'),
        end = moment(event.startTime).add(event.duration, 'm').format('H:mm');
      return start + '-' + end;
    };
  })
  .filter('displayNames', function () {
    return function (array, typeName) {
      if (array && array.length)
        return _.map(array, 'name').join(', ');
      else if (typeName === 'position')
        return '该职位没有招聘负责人';
      else if (typeName === 'user')
        return '该用户没有负责招聘岗位';
    };
  })
  .filter('eventCompleteCount', function () {
    return function (events) {
      return _.filter(events, function (event) {
        return moment(event.startTime).isBefore(moment());
      }).length;
    };
  })
  .filter('nextEventStartTime', function () {
    return function (events) {
      var result;
      angular.forEach(events, function (event) {
        if (moment(event.startTime).isAfter(moment())) {
          if (!result || moment(event.startTime).isBefore(moment(result))) {
            result = event.startTime;
          }
        }
      });
      return result;
    };
  })
  .filter('isPast', function () {
    return function (time) {
      return moment(time).isBefore(moment());
    };
  })
  .filter('isNotEmpty', function () {
    return function (input) {
      return !_.isEmpty(input);
    };
  })
  .filter('isEmpty', function () {
    return function (input) {
      return _.isEmpty(input);
    };
  });