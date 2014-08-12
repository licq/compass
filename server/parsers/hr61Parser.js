'use strict';

var cheerio = require('cheerio'),
  _ = require('lodash'),
  helper = require('../utilities/helper'),
  logger = require('../config/winston').logger();

function parseCertifications(table, errors) {
  if (!table) return;
  try {
    return _.map(_.filter(helper.parseTable(table), function (element, index) {
      return index % 2 === 0;
    }), function (line) {
      return {
        date: helper.parseDate(line[0]),
        subject: line[1],
        score: parseInt(line[2], 10)
      };
    });
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}


function parseBasicInfo(table, errors) {
  if (!table) return;
  try {
    var tableData = helper.parseTable(table);
    var infoMap = {};
    _.forEach(tableData, function (line) {
      if (line[0]) infoMap[line[0].replace(/ |：/g, '')] = line[1];
      if (line[2]) infoMap[line[2].replace(/ |：/g, '')] = line[3];
    });
    var resume = {
      name: infoMap['姓名'] || infoMap.Name,
      gender: helper.parseGender(infoMap['性别'] || infoMap.Gender),
      birthday: helper.parseDate(infoMap['出生日期'] || infoMap.DateofBirth),
      residency: infoMap['居住地'] || infoMap['P.ofResidence'],
      civilState: helper.parseCivilState(infoMap['婚姻状况'] || infoMap.Marry),
      hukou: infoMap['户口'] || infoMap.Hukou,
      yearsOfExperience: helper.parseYearsOfExperience(infoMap['工作年限'] || infoMap['Y.ofExperience']),
      email: infoMap['电子邮件'] || infoMap.Email,
      mobile: infoMap['移动电话'] || infoMap.MobilePhone
    };
    if (resume.mobile && resume.mobile.indexOf('086-') === 0) {
      resume.mobile = resume.mobile.substr(4);
    }
    return resume;
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseLanguageSkills(table, errors) {
  if (!table) return;
  try {
    var tableData = helper.parseTable(table);
    return _.map(tableData, function (line) {
      return helper.parseLanguageSkill(line.join(':'));
    });
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseCareerObjective(table, errors) {
  if (!table) return;
  try {
    var tableData = helper.parseTable(table);
    return {
      typeOfEmployment: helper.parseTypeOfEmployment(tableData[1][1]),
      locations: tableData[2][1],
      industry: tableData[3][1].split(' '),
      targetSalary: helper.parseTargetSalary(tableData[4][1]),
      jobCategory: tableData[5][1]
    };
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}


function parseWorkExperience(table, errors) {
  if (!table) return;
  try {
    var tableData = helper.parseTable(table);
    return _.times(Math.ceil(tableData.length / 10), function (index) {
      var firstLineData = tableData[index * 10][1];
      var splitIndex = _.lastIndexOf(firstLineData, ' ');
      var dateRange = helper.parseDateRange(firstLineData.substr(0, splitIndex));
      var job = tableData[index * 10 + 3][0].split(' ');
      return {
        from: dateRange.from,
        to: dateRange.to,
        company: firstLineData.substr(splitIndex + 1),
        industry: tableData[index * 10 + 1][1],
        department: job[0],
        jobTitle: job[1],
        jobDescription: tableData[index * 10 + 6][1]
      };
    });
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseProjectExperience(table, errors) {
  if (!table) return;
  try {
    var projectTableData = helper.parseTable(table);
    return _.map(helper.chunkByEmptyArray(projectTableData), function (projectData) {
      var project = {};
      _.each(projectData, function (line) {
        if (helper.isProjectHeader(line[0])) {
          var items = line[0].split(/--|：|（|）/);
          project.from = helper.parseDate(items[0]);
          project.to = helper.parseDate(items[1]);
          project.name = items[2];
        } else if (helper.isSoftwareEnvironment(line[0])) {
          project.softwareEnvironment = line[1];
        } else if (helper.isHardwareEnvironment(line[0])) {
          project.hardwareEnvironment = line[1];
        } else if (helper.isDevelopmentTools(line[0])) {
          project.developmentTools = line[1];
        } else if (helper.isDescription(line[0])) {
          project.description = line[1];
        } else if (helper.isResponsibility(line[0])) {
          project.responsibility = line[1];
        }
      });
      return project;
    });
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseEducationHistory(table, errors) {
  if (!table) return;
  try {
    var tableData = helper.parseTable(table);

    return _.times(tableData.length / 3, function (index) {
      return _.extend(
        helper.parseDateRange(tableData[index * 3][0]),
        {
          school: tableData[index * 3][1],
          major: tableData[index * 3][2],
          degree: tableData[index * 3][3],
          description: tableData[index * 3 + 1][1]
        }
      );
    });
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseTrainingHistory(table, errors) {
  if (!table) return;
  try {
    var trainingHistory = [];
    var tableData = helper.parseTable(table);
    var dateRange = helper.parseDateRange(tableData[0][0]);
    trainingHistory.push({
      from: dateRange.from,
      to: dateRange.to,
      institution: tableData[0][1],
      course: tableData[0][2],
      certification: tableData[0][3],
      description: tableData[1] ? tableData[1][0] : undefined
    });
    return trainingHistory;
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseInSchoolStudy(table, errors) {
  if (!table) return;
  try {
    var data = helper.parseTable(table);
    return _.filter(_.map(data, function (item) {
      return item.join(' ');
    }), function (line) {
      return line.trim().length !== 0;
    });
  } catch (e) {
    errors.push(e.message);
    logger.error('parse in school study failed: ', e.stack);
  }
}

function parseItSkills(table, errors) {
  if (!table) return;
  try {
    var tableData = helper.parseTable(table).slice(2);
    return _.map(_.filter(tableData, function (line) {
      return line.length >= 3;
    }), function (line) {
      return {
        skill: line[0],
        level: helper.parseItSkillLevel(line[1]),
        experience: helper.onlyNumber(line[2])
      };
    });
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseLanguageCertificates(table, errors) {
  if (!table) return;
  try {
    var languageTable = table.find('table');
    if (languageTable.length === 0) languageTable = table;
    var languageCertificates = {};
    _.forEach(_.filter(helper.parseTable(languageTable), function (line) {
      return line[0].indexOf('等级') > -1;
    }), function (line) {
      if (helper.isEnglishCertificate(line[0]))
        languageCertificates.english = helper.parseEnglishCertificate(line[1]);
    });
    return languageCertificates;
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseInSchoolPractices(table, errors) {
  if (!table) return;
  try {
    var tableData = helper.parseTable(table);
    tableData = _.filter(tableData, function (line) {
      return line[0].trim().length !== 0;
    });
    var practices = [],
      practice;
    for (var i = 0; i < tableData.length; i++) {
      if (tableData[i].length === 2) {
        if (practice) practices.push(practice);
        practice = helper.parseDateRange(tableData[i][0]);
        practice.content = tableData[i][1];
      } else {
        practice.content += tableData[i][0];
      }
    }
    if (practice) practices.push(practice);
    return practices;
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

exports.parse = function (data) {
  var $ = cheerio.load(data.html, {normalizeWhitespace: true});

  var findTable = function () {
    var tableNames = Array.prototype.slice.call(arguments, 0);
    var table;
    for (var i = 0; i < tableNames.length; i++) {
      table = $('caption:contains(' + tableNames[i] + ')').parent();
      if (table.length > 0) {
        return table;
      }
    }
  };

  var errors = [];
  var resume = parseBasicInfo(findTable('基本信息', 'Basic Info'), errors);
  resume.careerObjective = parseCareerObjective(findTable('求职意向', 'Career Objective'), errors);
  if (!resume.careerObjective) resume.careerObjective = {};
  resume.careerObjective.entryTime = helper.parseEntryTime($('font:contains(工作状态：)').text());
  var selfAssessmentTable = findTable('自我评价', 'Self Assessment');
  if (!!selfAssessmentTable)
    resume.careerObjective.selfAssessment = helper.replaceEmpty(selfAssessmentTable.find('tbody').text());
  resume.workExperience = parseWorkExperience(findTable('工作经验', 'Work Experience'), errors);
  resume.educationHistory = parseEducationHistory(findTable('教育经历', 'Education'), errors);
//  resume.trainingHistory = parseTrainingHistory(findTable('培训经历'), errors);
//  resume.certifications = parseCertifications(findTable('证'), errors);
  resume.languageSkills = parseLanguageSkills(findTable('语言能力', 'Language'), errors);
//  resume.languageCertificates = parseLanguageCertificates(findTable('语言能力'), errors);
//  resume.itSkills = parseItSkills(findTable('IT'), errors);
//  resume.inSchoolPractices = parseInSchoolPractices(findTable('社会经验'), errors);
//  resume.inSchoolStudy = parseInSchoolStudy(findTable('所获奖项'), errors);
  if (data.subject) {
    var startIndex = data.subject.indexOf('应聘贵公司');
    var endIndex = data.subject.indexOf('职位');
    if (startIndex > -1 && endIndex > -1)
      resume.applyPosition = data.subject.substr(startIndex + 6, endIndex - startIndex - 7);
  }

  var pictureTable = findTable('证件/图片', 'Certificate/Image');
  if (!!pictureTable)
    resume.photoUrl = pictureTable.find('img').attr('src');
  resume.applyDate = data.createdAt;
  resume.channel = '乐聘';
  resume.mail = data.mailId;
  resume.company = data.company;
  resume.parseErrors = errors;
  return resume;
};

exports.test = function (data) {
  return data.fromAddress.indexOf('61hr') > -1;
};