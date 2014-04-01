exports.onlyNumber = function onlyNumber(input) {
    var match = input.match(/\d+/g);
    return match[0];
};

exports.parseGender = function parseGender(input) {
    return input.trim() === '男' ? 'male' : 'female';
};

exports.parseDate = function parseDate(input) {
    if (input.trim() === '至今') {
        var date = new Date();
        date.setFullYear(9999);
        return date;
    }
    var match = input.match(/\d+/g);
    var result = new Date();
    result.setYear(parseInt(match[0], 10));
    result.setMonth(parseInt(match[1], 10) - 1);
    result.setDate(parseInt(match[2], 10) || 1);
    return result;
};

exports.parseMatchRate = function parseMatchRate(input) {
    return parseInt(exports.onlyNumber(input), 10);
};

var yearsOfExperienceMap = {
    '应届毕业生': 'graduating student',
    '一年以上工作经验': '1',
    '两年以上工作经验': '2',
    '三年以上工作经验': '3',
    '四年以上工作经验': '4',
    '五年以上工作经验': '5',
    '八年以上工作经验': '8',
    '十年以上工作经验': '10'
};

exports.parseYearsOfExperience = function parseYearsOfExperience(input) {
    return yearsOfExperienceMap[input.trim()];
};

var entryTimeMap = {
    '待定': 'to be determined',
    '即时': 'immediately',
    '一周以内': 'within 1 week',
    '一个月内': 'within 1 month',
    '1-3个月': '1 to 3 months',
    '三个月后': 'after 3 months'
};

exports.parseEntryTime = function parseEntryTime(input) {
    return entryTimeMap[input.trim()];
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
};

exports.replaceEmpty = function replaceEmpty(input) {
    if (Array.isArray(input)) {
        return _.forEach(input, function (item) {
            return item.replace(/\n| +/g, '');
        });
    }
    return input.replace(/\n| +/g, '');
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
    '熟练': 'advanced',
    '精通': 'expert'
};

exports.parseLanguageSkill = function parseLanguageSkill(summary, detail) {
    var languageMap = {
        '英语': 'english',
        '日语': 'japanese'
    };
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
    '精通': 'expert'
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
