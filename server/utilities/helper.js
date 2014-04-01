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

exports.parseYearsOfExperience = function parseYearsOfExperience(input) {
    switch (input.trim()) {
        case '应届毕业生':
            return 'graduating student';
    }
};

exports.parseEntryTime = function parseEntryTime(input) {
    switch (input.trim()) {
        case '待定':
            return 'to be determined';
    }
};

exports.parseTypeOfEmployment = function parseTypeOfEmployment(input) {
    var map = {
        '全职': 'fulltime'
    };
    return map[input.trim()];
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

exports.parseEnglishCertificate = function parseEnglishCertificate(input) {
    var map = {
        '英语四级': 'cet4'
    };
    return map[input.trim()];
};

exports.parseLanguageSkill = function parseLanguageSkill(summary, detail) {
    var languageMap = {
        '英语': 'english',
        '日语': 'japanese'
    };
    var skillMap = {
        '良好': 'good',
    };
    var languageSkill = {};
    var sumItems = summary.split(/（|）/);
    languageSkill.language = languageMap[sumItems[0].trim()];
    languageSkill.level = skillMap[sumItems[1].trim()];

    var detailItems = detail.split(/（|）/g);
    languageSkill.readingAndWriting = skillMap[detailItems[1]];
    languageSkill.listeningAndSpeaking = skillMap[detailItems[3]];
    return languageSkill;
};

exports.parseItSkillLevel = function parseItSkillLevel(input){
    var map = {
        '熟练': 'basic',
        '精通': 'advanced'
    };

    return map[input.trim()];
};
