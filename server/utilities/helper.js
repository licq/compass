"use strict";

var _ = require('lodash'),
  moment = require('moment');

exports.onlyNumber = function onlyNumber(input) {
  var match = input.match(/\d+/g);
  return match ? match[0] : null;
};

var genderMap = {
  '男': 'male',
  '女': 'female',
  'Male': 'male',
  'Female': 'female'
};

exports.parseGender = function parseGender(input) {
  if (input)
    return genderMap[input.trim()];
};

exports.parseDate = function parseDate(input) {
  if (!input) return undefined;
  var match = input.match(/\d+/g);
  if (match) {
    var result = new Date();
    result.setYear(parseInt(match[0], 10));
    result.setDate(parseInt(match[2], 10) || 1);
    result.setMonth(parseInt(match[1], 10) - 1);
    return result;
  } else if (input.indexOf('今') > -1 || input.indexOf('现在') > -1) {
    var date = new Date();
    date.setFullYear(9999);
    return date;
  }
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
  '十': 10,
};

var englishToNumberMap = {
  'one': 1,
  'two': 2,
  'three': 3,
  'four': 4,
  'five': 5,
  'six': 6,
  'seven': 7,
  'eight': 8,
  'nine': 9,
  'ten': 10
};

exports.parseYearsOfExperience = function parseYearsOfExperience(input) {
  if (!input) return;
  if (input.indexOf('应届') > -1 || input.indexOf('Graduates') > -1) {
    return 0;
  }
  if (input.indexOf('学生') > -1 || input.indexOf('Student') > -1) {
    return -1;
  }

  if (input.indexOf('工作经验') > -1 || input.indexOf('年以上') > -1 || input.indexOf('年') > -1) {
    if (/\d+/.test(input)) {
      return _.parseInt(exports.onlyNumber(input));
    } else {
      var first = input.trim().charAt(0);
      return chineseToNumberMap[first];
    }
  }

  var match = input.match(/^(\d+)\s*年$/);
  if (match) return Number(match[1]);
  match = input.match(/More than (.+) year/);
  if (match) return englishToNumberMap[match[1]];
};

var entryTimeMap = {
  '待定': 'to be determined',
  '即时': 'immediately',
  '一周以内': 'within 1 week',
  '一个月': 'within 1 month',
  '1-3个月': '1 to 3 months',
  '三个月后': 'after 3 months',
  '立即': 'immediately',
  '目前已离职': 'immediately',
  '应届毕业生': 'immediately'
};

exports.parseEntryTime = function parseEntryTime(input) {
  var result;
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
  '实习': 'intern',
  'Full-time': 'fulltime',
  'Part-time': 'parttime',
  'Internship': 'intern',
  'Full / part-time': 'fulltime'
};
exports.parseTypeOfEmployment = function parseTypeOfEmployment(input) {
  return typeOfEmploymentMap[input.trim()];
};

exports.splitByCommas = function splitByCommas(input) {
  return input.trim().split(/,|,|，/);
};

exports.parseTargetSalary = function parseTargetSalary(input) {
  if (input.match(/面议/) || input.match(/Negotiable/)) return {from: 0, to: 0};
  var match = input.match(/(\d+).*?(\d+)/);
  if (match) {
    return {
      from: +match[1],
      to: +match[2]
    };
  }
};

exports.replaceEmpty = function replaceEmpty(input) {
  if (Array.isArray(input)) {
    return _.filter(_.map(input, function (item) {
      return item.replace(/\n|\s+/g, ' ').trim();
    }), function (item) {
      return item.length !== 0;
    });
  }
  return input.replace(/\n|\s+/g, ' ').trim();
};

exports.parseTable = function parseTable(table) {
  var items = [];
  var item, i, j;
  var trs = table.find('tr');
  for (i = 0; i < trs.length; i++) {
    item = [];
    var tds = trs.eq(i).find('td');
    for (j = 0; j < tds.length; j++) {
      item.push(exports.replaceEmpty(tds.eq(j).text()));
    }
    items.push(item);
  }
  return items;
};

exports.parseV1BTable = function parseV1BTable(table) {
  var items = [];

  function depthfirst(element) {
    var contents = element.contents();
    var i;
    var child = element.children().eq(0);
    var text;
    for (i = 0; i < contents.length; i++) {
      if (contents[i].type === 'text') {
        text = exports.replaceEmpty(contents[i].data);
        if (text.length > 0)
          items.push(text);
      } else {
        if (child.find('div').length === 0) {
          text = exports.replaceEmpty(child.text());
          if (text.length > 0) {
            items.push(text);
          }
        } else {
          depthfirst(child);
        }
          child = child.next();
      }
    }
  }

  depthfirst(table);
  return items;

}
;

exports.isEnglishCertificate = function isEnglishCertificate(input) {
  return /等级|gmat|ielts|toeic|toefl|gre/i.test(input);
};

exports.isAddress = function isAddress(input) {
  return /地址/.test(input);
};

var englishCertificateMap = {
  '英语四级': 'cet4',
  '未参加': 'not participate',
  '未通过': 'not passed',
  '英语六级': 'cet6',
  '专业四级': 'tem4',
  '专业八级': 'tem8',
  '四级': 'level4',
  '三级': 'level3',
  '二级': 'level2',
  '一级': 'level1',
  '无': 'none'
};

exports.parseEnglishCertificate = function parseEnglishCertificate(input) {
  var result = englishCertificateMap[input.trim()];
  if (!result) {
    result = parseInt(input);
    result = isNaN(result) ? 0 : result;
  }
  return result;
};

var languageSkillMap = {
  '不限': 'not sure',
  '一般': 'average',
  '良好': 'good',
  '熟练': 'very good',
  '精通': 'excellent',
  'Good': 'good',
  'General': 'average',
  'Skilled': 'very good',
  'Proficient': 'excellent'
};

var languageMap = {
  '英语': 'english',
  '日语': 'japanese',
  '上海话': 'shanghaihua',
  '普通话': 'mandarin',
  '粤语': 'cantonese',
  '法语': 'french',
  '德语': 'germany',
  '其它': 'other',
  '其他': 'other',
  'English': 'english'
};

exports.parseLanguageTest = function parseLanguageTest(input) {
  if (/英语等级/.test(input))
    return 'english';
  else if (/日语等级/.test(input))
    return 'japanese';
  else if (/toefl/i.test(input))
    return 'toefl';
  else if (/gre/i.test(input))
    return 'gre';
  else if (/ielts/i.test(input))
    return 'ielts';
  else if (/toeic/i.test(input))
    return 'toeic';
  else if (/gmat/i.test(input))
    return 'gmat';
};

exports.parseLanguage = function parseLanguage(input) {
  return languageMap[input.trim()];
};

exports.parseLanguageLevel = function parseLanguageLevel(input) {
  var result;
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
  var sumItems = summary.split(/（|）|:/);
  languageSkill.language = languageMap[sumItems[0].trim()];
  if (sumItems[1])
    languageSkill.level = languageSkillMap[sumItems[1].trim()];

  if (detail) {

    var detailItems = detail.split(/（|）/g);
    languageSkill.readingAndWriting = languageSkillMap[detailItems[1]];
    languageSkill.listeningAndSpeaking = languageSkillMap[detailItems[3]];
  }
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
  return /\d+.+--.+：.*/.test(input);
};

exports.isWorkHeader = function isWorkHeader(input) {
  return /\d+.+--.+：.*/.test(input);
};

exports.isSoftwareEnvironment = function isSoftwareEnvironment(input) {
  return input.indexOf('软件环境') > -1;
};

exports.isHardwareEnvironment = function isHardwareEnvironment(input) {
  return input.indexOf('硬件环境') > -1;
};

exports.isDevelopmentTools = function isDevelopmentTools(input) {
  return input.indexOf('开发工具') > -1;
};

exports.isDescription = function isDescription(input) {
  return input.indexOf('项目描述') > -1;
};

exports.isReportToOrHasStaffs = function isReportToOrHasStaffs(input) {
  return /汇报对象|下属人数/.test(input);
};

exports.isResponsibility = function isResponsibility(input) {
  return input.indexOf('责任描述') > -1;
};

var civilStateMap = {
  '未婚': 'single',
  '已婚': 'married',
  '离异': 'divorced',
  '保密': 'confidential',
  'Married': 'married',
  'Unmarried': 'single',
  'Divorce': 'divorced',
  'Privacy': 'confidential'
};

exports.parseCivilState = function parseCivilState(input) {
  if (input) {
    return civilStateMap[input.trim()];
  }
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
  var parts = input.split(/-+|：|—|–/g);
  if (parts.length === 4) {
    parts[0] = parts[0] + '-' + parts[1];
    parts[1] = parts[2] + '-' + parts[3];
  }
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
  '其他': 'others',
  'Junior High School': 'junior high',
  'High School': 'high school',
  'CNTIC': 'technical school',
  'Vocational': 'polytechnic',
  'College': 'associate',
  'Undergraduate': 'bachelor',
  'Master': 'master',
  'Dr.': 'doctorate',
  'Other': 'others'
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
  return _.has(politicalStatusMap, input.trim().split(' ')[0]);
};

exports.isMobile = function isMobile(input) {
  return /手机|电话/.test(input) || (exports.onlyNumber(input) && exports.onlyNumber(input).length === 11);
};

exports.isEmail = function isEmail(input) {
  return /Email|E-mail/i.test(input);
};

exports.parseEmail = function parseEmail(input) {
  return input.substr(input.indexOf(':') + 1).trim();
};

exports.parseZhaopinApplyPosition = function parseZhaopinApplyPosition(input) {
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

exports.isProjectDescription = function isProjectDescription(input) {
  return input.indexOf('项目描述') > -1 || input.indexOf('项目简介') > -1;
};

exports.isProjectResponsibility = function isProjectResponsibility(input) {
  return input.indexOf('责任描述') > -1 || input.indexOf('项目职责') > -1 || input.indexOf('项目业绩') > -1;
};

exports.removeTags = function removeTags(input) {
  return input.replace(/<\/?.+?>/g, '').replace(/(&nbsp;)+/g, '');
};

exports.splitByColon = function removeTags(input) {
  return input.split(/:|：/g);
};

exports.isTrainingCourse = function isTraningCourse(input) {
  return input.indexOf('培训课程') > -1;
};

exports.isTrainingLocation = function isTraningLocatioin(input) {
  return input.indexOf('培训地点') > -1;
};

exports.isTrainingCertification = function isTrainingCertification(input) {
  return input.indexOf('所获证书') > -1;
};
exports.isTrainingDescription = function isTrainingDescription(input) {
  return input.indexOf('培训描述') > -1;
};

exports.isTrainingDescriptionAdditional = function isTrainingDescriptionAdditional(input) {
  return !exports.isTrainingCertification(input) && !exports.isTrainingDescription(input) && !exports.isTrainingLocation(input) && !exports.isTrainingCourse(input);
};

exports.isEntryTime = function isEntryTime(input) {
  return input.indexOf('到岗时间') > -1;
};

exports.isTypeOfEmployment = function isTypeOfEmployment(input) {
  return input.indexOf('工作性质') > -1;
};

exports.isIndustry = function isIndustry(input) {
  return /希望行业|期望从事行业|所属行业/.test(input);
};

exports.isLocations = function isLocations(input) {
  return input.indexOf('目标地点') > -1 || input.indexOf('期望工作地点') > -1;
};

exports.isTargetSalary = function isTargetSalary(input) {
  return /期望月薪|期望年薪|期望工资|期望薪水/.test(input);
};

exports.isJobCategory = function isJobCategory(input) {
  return input.indexOf('目标职能') > -1 || input.indexOf('期望从事职业') > -1;
};

exports.render = function render(template, event) {
  var dateFormat = 'YYYY年M月D日H:mm';
  return template.replace(/\{\{姓名\}\}/g, event.name)
    .replace(/\{\{应聘职位\}\}/g, event.applyPosition)
    .replace(/\{\{开始时间\}\}/g, moment(event.startTime).format(dateFormat))
    .replace(/\{\{结束时间\}\}/g, moment(event.endTime).format(dateFormat));
};

exports.calculateBirthday = function calculateBirthday(age, current) {
  return moment(current).subtract(exports.onlyNumber(age), 'y').toDate();
};

exports.parseTargetAnnualSalary = function parseTargetAnnualSalary(input) {
  var match = input.match(/(\d+)元\/月 \* (\d+)个月/);
  if (match) {
    return {
      from: Number(match[1]),
      to: Number(match[1]),
      months: Number(match[2])
    };
  }
};

exports.splitBySemiolon = function splitBySemiolon(input) {
  return input.split(/;|；/);
};

exports.isNewWork = function isNewWork(input) {
  if (Array.isArray(input)) {
    input = input[0];
  }
  return (!!input.match(/\d+\.\d+\.?\s?-\s?至今/) || !!/\d+ ?.?\d+\s?-+\s?至今/.test(input) || !!input.match(/\d+\.\d+\.?\s?-\s?\d+\.\d+/) || !!input.match(/\d+\/\d+—\d+\/\d+/));
};

exports.splitByDashDashDash = function splitByDashDashDash(lines) {
  var works = [];
  var workData = [];
  _.forEach(lines, function (line) {
    if (line.indexOf('----------------') === -1) {
      if (line) workData.push(line);
    } else {
      works.push(workData);
      workData = [];
    }
  });
  if (workData.length !== 0) {
    works.push(workData);
  }
  return works;
};

