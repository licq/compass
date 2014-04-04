var _ = require('lodash');

exports.onlyNumber = function onlyNumber(input) {
    var match = input.match(/\d+/g);
    return match[0];
};

var genderMap = {
    '男': 'male',
    '女': 'female',
};

exports.parseGender = function parseGender(input) {
    return genderMap[input.trim()];
};

exports.parseDate = function parseDate(input) {
    if (input.indexOf('至今') > -1) {
        var date = new Date();
        date.setFullYear(9999);
        return date;
    }

    var match = input.match(/\d+/g);
    if (_.isNull(match)) console.log('match is null ', input);
    var result = new Date();
    result.setYear(parseInt(match[0], 10));
    result.setMonth(parseInt(match[1], 10) - 1);
    result.setDate(parseInt(match[2], 10) || 1);
    return result;
};

exports.parseMatchRate = function parseMatchRate(input) {
    return parseInt(exports.onlyNumber(input), 10);
};

var chineseToNumberMap = {
    '一': 1,
    '二': 2,
    '两': 2,
    '三': 3,
    '四': 4,
    '五': 5,
    '六': 6,
    '七': 7,
    '八': 8,
    '九': 9,
    '十': 10
};

exports.parseYearsOfExperience = function parseYearsOfExperience(input) {
    if (input.indexOf('应届') > -1) {
        return 0;
    }
    if (input.indexOf('学生') > -1) {
        return -1;
    }
    console.log(input);
    if (input.indexOf('工作经验') > -1) {
        var first = input.trim().substr(0, 1);
        if (/\d+/.test(first)) {
            return _.parseInt(first);
        } else {
            return chineseToNumberMap[first];
        }
    }
};

var entryTimeMap = {
    '待定': 'to be determined',
    '即时': 'immediately',
    '一周以内': 'within 1 week',
    '一个月': 'within 1 month',
    '1-3个月': '1 to 3 months',
    '三个月后': 'after 3 months',
    '立即': 'immediately',
    '应届毕业生': 'immediately'
};

exports.parseEntryTime = function parseEntryTime(input) {
    var result = undefined;
    _.forEach(entryTimeMap, function (value, key) {
        if (input.indexOf(key) > -1) {
            result = value;
            return false;
        }
    });
    return result;
};

var typeOfEmploymentMap = {
    '全职': 'fulltime',
    '兼职': 'parttime',
    '实习': 'intern'
};
exports.parseTypeOfEmployment = function parseTypeOfEmployment(input) {
    return typeOfEmploymentMap[input.trim()];
};

exports.splitByCommas = function splitByCommas(input) {
    return input.trim().split(/,|,|，/);
};

exports.parseTargetSalary = function parseTargetSalary(input) {
    if (input.match(/面议/)) return {from: 0, to: 0};
    var match = input.match(/(\d+).*?(\d+)/);
    if (match) {
        return {
            from: match[1],
            to: match[2]
        };
    }
};

exports.replaceEmpty = function replaceEmpty(input) {
    if (Array.isArray(input)) {
        return _.filter(_.map(input, function (item) {
            return item.replace(/\n| +/g, ' ').trim();
        }), function (item) {
            return item.length !== 0;
        });
    }
    return input.replace(/\n|\s+/g, ' ').trim();
};

exports.parseTable = function parseTable(table, $) {
    var items = [];
    $('tr', $(table)).each(function () {
        var item = [];
        $(this).find('td').each(function () {
            item.push(exports.replaceEmpty($(this).text()));
        });
        items.push(item);
    });
    return items;
};

exports.parseTableHtml = function parseTableHtml(table, $) {
    var items = [];
    $('tr', $(table)).each(function () {
        var item = [];
        $(this).find('td').each(function () {
            item.push(exports.replaceEmpty($(this).html()));
        });
        items.push(item);
    });
    return items;
};

exports.isEnglishCertificate = function isEnglishCertificate(input) {
    return /英语等级/.test(input);
};

var englishCertificateMap = {
    '英语四级': 'cet4',
    '未参加': 'not participate',
    '未通过': 'not passed',
    '英语六级': 'cet6',
    '专业四级': 'tem4',
    '专业八级': 'tem8'
};

exports.parseEnglishCertificate = function parseEnglishCertificate(input) {
    return englishCertificateMap[input.trim()];
};

var languageSkillMap = {
    '不限': 'not sure',
    '一般': 'average',
    '良好': 'good',
    '熟练': 'very good',
    '精通': 'excellent',
};

var languageMap = {
    '英语': 'english',
    '日语': 'japanese',
    '其它': 'other',
    '其他': 'other'
};

exports.parseLanguage = function parseLanguage(input) {
    return languageMap[input.trim()];
};

exports.parseLanguageLevel = function parseLanguageLevel(input) {
    var result = undefined;
    _.forEach(languageSkillMap, function (value, key) {
        if (input.indexOf(key) > -1) {
            result = value;
            return false;
        }
    });
    return result;
};

exports.parseLanguageSkill = function parseLanguageSkill(summary, detail) {
    var languageSkill = {};
    var sumItems = summary.split(/（|）/);
    languageSkill.language = languageMap[sumItems[0].trim()];
    languageSkill.level = languageSkillMap[sumItems[1].trim()];

    var detailItems = detail.split(/（|）/g);
    languageSkill.readingAndWriting = languageSkillMap[detailItems[1]];
    languageSkill.listeningAndSpeaking = languageSkillMap[detailItems[3]];
    return languageSkill;
};

var itSkillLevelMap = {
    '无': 'none',
    '一般': 'basic',
    '了解': 'limited',
    '熟练': 'advanced',
    '精通': 'expert',
    '良好': 'limited'
};


exports.parseItSkillLevel = function parseItSkillLevel(input) {
    return itSkillLevelMap[input.trim()];
};

exports.isProjectHeader = function isProjectHeader(input) {
    return /\d+.+--.+：.+/.test(input);
};

exports.isSoftwareEnviroment = function isSoftwareEnviroment(input) {
    return input.indexOf('软件环境') > -1;
};

exports.isHardwareEnviroment = function isHardwareEnviroment(input) {
    return input.indexOf('硬件环境') > -1;
};

exports.isDevelopmentTools = function isDevelopmentTools(input) {
    return input.indexOf('开发工具') > -1;
};

exports.isDescription = function isDescription(input) {
    return input.indexOf('项目描述') > -1;
};

exports.isResponsibility = function isResponsibility(input) {
    return input.indexOf('责任描述') > -1;
};

var civilStateMap = {
    '未婚': 'single',
    '已婚': 'married',
    '离异': 'divorced',
    '保密': 'confidential'
};

exports.parseCivilState = function parseCivilState(input) {
    return civilStateMap[input.trim()];
};

var politicalStatusMap = {
    '党员': 'party member',
    '团员': 'league member',
    '民主党派': 'democratic part',
    '无党派': 'no party',
    '群众': 'citizen',
    '其他': 'others'};
exports.parsePoliticalStatus = function parsePoliticalStatus(input) {
    return politicalStatusMap[input.trim()];
};

exports.parseDateRange = function parseDateRange(input) {
    var parts = input.split(/--|：/g);
    return {
        from: exports.parseDate(parts[0]),
        to: exports.parseDate(parts[1])
    };
};

var degreeMap = {
    '初中': 'junior high',
    '中技': 'technical school',
    '高中': 'high school',
    '中专': 'polytechnic',
    '大专': 'associate',
    '本科': 'bachelor',
    'MBA': 'mba',
    '硕士': 'master',
    '博士': 'doctorate',
    '其他': 'others'
};
exports.parseDegree = function parseDegree(input) {
    if (input) {
        return degreeMap[input.trim()];
    }
};

exports.isGender = function isGender(input) {
    return _.has(genderMap, input.trim());
};

exports.isCivilState = function isCivilState(input) {
    return _.has(civilStateMap, input.trim());
};

exports.removeSpaces = function replaceInnerSpace(input) {
    return input.replace(/\s+/g, '');
};

exports.isBirthday = function isBirthday(input) {
    return (/\d\d\d\d年\d\d?月/).test(exports.removeSpaces(input));
};

exports.isHukou = function isHukou(input) {
    return input.trim().indexOf('户口') > -1;
};

exports.isResidency = function isResidency(input) {
    return input.indexOf('现居住') > -1;
};

exports.isYearsOfExperience = function isYearsOfExperience(input) {
    return input.indexOf('工作经验') > -1 || input.indexOf('毕业生') > -1;
};

exports.isPoliticalStatus = function isPoliticalStatus(input) {
    return _.has(politicalStatusMap, input.trim());
};

exports.isMobileLine = function isMobileLine(input) {
    return exports.onlyNumber(input).length === 11;
};

exports.parseApplyPosition = function parseZhaopinApplyPosition(input) {
    if (input) {
        var start = input.indexOf('应聘');
        var end = input.lastIndexOf('-');
        return input.substring(start + 3, end);
    }
};

exports.chunkByEmptyArray = function chunk(input) {
    var result = [];
    var start = 0;
    _.forEach(input, function (elem, i) {
        if (_.isEqual(elem, [''])) {
            result.push(input.slice(start, i));
            start = i + 1;
        }
    });
    result.push(input.slice(start));
    return result;
};