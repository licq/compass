'use strict';

var cheerio = require('cheerio'),
  _ = require('lodash'),
  helper = require('../utilities/helper'),
  entities = require('entities'),
  logger = require('../config/winston').logger();

function parseBasicInfo(table) {
  if (!table) return;
  try {
    var tableData = helper.parseTable(table);
    var resume = {
      name: tableData[1][1],
      yearsOfExperience: helper.parseYearsOfExperience(tableData[1][3]),
      mobile: tableData[2][1],
      gender: helper.parseGender(tableData[2][3]),
      birthday: helper.calculateBirthday(tableData[3][3]),
      email: tableData[4][1]
    };
    if (tableData[5] && tableData[5][3]) resume.hukou = tableData[5][3];
    return resume;
  } catch (e) {
    logger.error(e.stack);
  }
}

function parseLanguageSkills(table) {
  if (!table) return;
  try {
    return table.find('td:nth-child(1)').text().split('、').map(function(language){
      return {
        language:helper.parseLanguage(language)
      };
    });
  } catch (e) {
    logger.error(e.stack);
  }
}

function parseCareerObjective(table) {
  if (!table) return;
  try {
    var careerObjective = {};
    var tableData = helper.parseTable(table);
    _.forEach(tableData, function (item) {
      if (item.length === 2) {
        if (helper.isIndustry(item[0])) {
          careerObjective.industry = helper.splitBySemiolon(item[1]);
        } else if (helper.isLocations(item[0])) {
          careerObjective.locations = helper.splitBySemiolon(item[1]);
        } else if (helper.isTargetSalary(item[0])) {
          careerObjective.targetSalary = helper.parseTargetAnnualSalary(item[1]);
        } else if (helper.isJobCategory(item[0])) {
          careerObjective.jobCategory = helper.splitBySemiolon(item[1]);
        }
      }
    });

    return careerObjective;
  } catch (e) {
    logger.error(e.stack);
  }
}


function parseWorkExperience(table) {
  if (!table) return;
  try {
    var workExperience = [];
    var tableData = helper.parseTable(table.find('table'));
    for (var i = 0; i < tableData.length; i++) {
      if (helper.isNewWork(tableData[i])) {
        var dateRange = helper.parseDateRange(tableData[i][0]);
        workExperience.push({
          from: dateRange.from,
          to: dateRange.to,
          company: tableData[i][1],
          jobTitle: tableData[i + 1][1].split(' ')[0],
          jobDescription: tableData[i + 2][0]
        });
      }
    }
    return workExperience;
  } catch (e) {
    logger.error(e.stack);
  }
}

function parseProjectExperience(table) {
  if (!table) return;
  try {
    var trs = table.find('table').find('tr');
    return _.times(trs.length / 2, function (index) {
      var dateRange = helper.parseDateRange(trs.eq(index * 2).children().eq(0).text());
      var items = entities.decodeHTML(trs.eq(index * 2 + 1).children().eq(1).html()).split('<br>');
      var project = {
        from: dateRange.from,
        to: dateRange.to,
        name: trs.eq(index * 2).children().eq(1).text()
      };
      items.forEach(function (item) {
        if (helper.isProjectDescription(item)) {
          project.description = helper.splitByColon(item)[1];
        } else if (helper.isProjectResponsibility(item)) {
          project.responsibility = (project.reponsibility || '') + helper.splitByColon(item)[1];
        }
      });
      return project;
    });
  } catch (e) {
    logger.error(e.stack);
  }
}

function parseEducationHistory(table) {
  if (!table) return;
  try {
    var tableData = helper.parseTable(table.find('table'));
    return _.times(tableData.length / 3, function (index) {
      var dateRange = helper.parseDateRange(tableData[index * 3][0]);
      return {
        from: dateRange.from,
        to: dateRange.to,
        school: tableData[index * 3][1],
        major: helper.splitByColon(tableData[index * 3 + 1][1])[1],
        degree: helper.parseDegree(helper.splitByColon(tableData[index * 3 + 2][0])[1])
      };
    });
  } catch (e) {
    logger.error(e.stack);
  }
}

function parseInSchoolStudy(table) {
  if (!table) return;
  try {
    var data = helper.parseTable(table);
    return _.map(data, function (item) {
      return item.join(' ');
    });
  } catch (e) {
    logger.error('parse in school study failed: ', e.stack);
  }
}

exports.parse = function (data) {
  var $ = cheerio.load(data.html, {normalizeWhitespace: true});

  var findTable = function () {
    var tableNames = Array.prototype.slice.call(arguments, 0);
    var table;
    for (var i = 0; i < tableNames.length; i++) {
      table = $('th:contains(' + tableNames[i] + ')').parent().parent();
      if (table.length > 0) {
        return table;
      }
    }
  };

  var resume = parseBasicInfo(findTable('基本信息'));
  resume.applyPosition = $('body > table table tr:nth-child(1) td div span').text();
  resume.careerObjective = parseCareerObjective(findTable('求职意向'));
  console.log(findTable('自我评价').find('td:nth-child(1)').text());
  resume.careerObjective.selfAssessment = findTable('自我评价').find('td:nth-child(1)').text();
  resume.workExperience = parseWorkExperience(findTable('工作经历'));
  resume.projectExperience = parseProjectExperience(findTable('项目经历'));
  resume.educationHistory = parseEducationHistory(findTable('教育经历'));
  resume.languageSkills = parseLanguageSkills(findTable('语言能力'));
  resume.inSchoolStudy = parseInSchoolStudy(findTable('所获奖项'));
  resume.additionalInformation = findTable('附加信息').find('td:nth-child(1)').text();
  resume.channel = '猎聘网';
  resume.mail = data.mailId;
  resume.company = data.company;
  return resume;

};

exports.test = function (data) {
  return data.fromAddress.indexOf('lietou') > -1;
};