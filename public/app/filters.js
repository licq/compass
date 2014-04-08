'use strict';

angular.module('compass')
    .filter('state', function () {
        return function (input) {
            if (!input) return '正常';
            if (input === 'connect failed') return '服务器无法连接';
            if (input === 'login failed') return '用户名或密码不正确';
            return input;
        };
    })
    .filter('deletedState', function () {
        return function (deleted) {
            if (deleted) return '已删除';
            return '正常';
        };
    })
    .filter('yearAndMonth', function ($filter) {
        var dateFilter = $filter('date');
        return function (date) {
            return dateFilter(date, 'yyyy年M月');
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
            if (input === 0) return '应届毕业生';
            if (input === -1) return '学生';
            return '' + input + '年';
        };
    })
    .filter('gender', function () {
        return function (input) {
            if (input === 'male') return '男';
            if (input === 'female') return '女';
        };
    })
    .filter('politicalStatus', function () {
        return function (input) {
            switch (input) {
                case 'party member':
                    return '党员';
                case 'league member':
                    return '团员';
                case 'democratic part':
                    return '民主党派';
                case 'no party':
                    return '无党派';
                case 'citizen':
                    return '群众';
                case 'others':
                    return '其他';
            }
        };
    })
    .filter('civilState', function () {
        return function (input) {
            switch (input) {
                case 'married':
                    return '已婚';
                case 'single':
                    return '单身';
                case 'divorced':
                    return '离异';
                case 'confidential':
                    return '隐私';
            }
        };
    })
    .filter('typeOfEmployment', function () {
        return function (input) {
            switch (input) {
                case 'fulltime':
                    return '全职';
                case 'parttime':
                    return '兼职';
                case 'intern':
                    return '实习';
            }
        };
    })
    .filter('entryTime', function () {
        return function (input) {
            switch (input) {
                case 'immediately':
                    return '立即';
                case 'within 1 week':
                    return '一周以内';
                case 'within 1 month':
                    return '一个月以内';
                case '1 to 3 months':
                    return '一到三个月';
                case 'after 3 months':
                    return '三个月以上';
                case 'to be determined':
                    return '待定';
            }
        };
    })
    .filter('degree', function () {
        return function (input) {
            var degreeMap = {
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
            };
            return degreeMap[input];
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
        }
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
        }
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
    });