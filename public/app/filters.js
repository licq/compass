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
            return application &&  application.status !== 'archived';
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
    });