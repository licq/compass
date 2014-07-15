'use strict';

var cheerio = require('cheerio'),
  _ = require('lodash'),
  helper = require('../utilities/helper'),
  entities = require('entities'),
  logger = require('../config/winston').logger();

function parseBasicInfo(table,errors) {
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
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseLanguageSkills(table,errors) {
  if (!table) return;
  try {
    return table.find('td:nth-child(1)').text().split('、').map(function (language) {
      return {
        language: helper.parseLanguage(language)
      };
    });
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseCareerObjective(table,errors) {
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
    errors.push(e.message);
    logger.error(e.stack);
  }
}


function parseWorkExperience(table,errors) {
  if (!table) return;
  try {
    var workExperience = [];
    var workTable = table.find('table');
    var tableData = helper.parseTable(workTable);
    if (tableData[0].length === 2) {
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
    } else {
      var work;
      var contents = workTable.find('td:nth-child(1)').contents();
      _.forEach(_.map(_.filter(contents, function (item) {
        return item.type === 'text';
      }), function (item) {
        return item.data.trim();
      }), function (data) {
        var items = data.split(/ |：/);
        if (helper.isNewWork(items)) {
          if (!!work) workExperience.push(work);
          var dateRange = helper.parseDateRange(items[0]);
          work = {
            from: dateRange.from,
            to: dateRange.to,
            company: items[1]
          };
        } else if (items[0].indexOf('所属行业') > -1) {
          work.industry = items[1].trim();
        } else if (items[0].indexOf('所在部门') > -1) {
          work.department = items[1].trim();
        } else if (items[0].indexOf('职位') > -1) {
          work.jobTitle = items[1].trim();
        } else if (items[0].indexOf('工作职责') > -1) {
          work.jobDescription = items[items.length - 1].trim();
        }
      });
      if (!!work) workExperience.push(work);
    }
    return workExperience;
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseProjectExperience(table,errors) {
  if (!table) return;
  try {
    var trs = table.find('table').find('tr');
    if (trs.length > 1) {
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
    } else {
      var projects = [];
      var project;
      var match;
      var contents = trs.find('td:nth-child(1)').contents();
      contents = _.filter(contents, function (item) {
        return item.type === 'text';
      });
      contents = _.map(contents, function (item) {
        return item.data;
      });
      _.forEach(contents, function (data) {
        if ((match = data.match(/(\d{4}\/\d{1,2}\s?(?:–|—)\s?(?:\d{4}\/\d{1,2})?)\s+(.+)/))) {
          if (!!project) projects.push(project);
          var dateRange = helper.parseDateRange(match[1]);
          project = {
            from: dateRange.from,
            to: dateRange.to,
            name: match[2]
          };
        } else if (data.indexOf('职责') === 0) {
          project.responsibility = (project.responsibility || '') + data.split(':')[1].trim();
        } else if (data.indexOf('技术工具') === 0) {
          project.softwareEnvironment = data.split(':')[1].trim();
        } else if (data.indexOf('业绩') === 0) {
          project.responsibility = (project.responsibility || '') + data.split(':')[1].trim();
        } else if (data.indexOf('团队人数') === 0) {
        } else {
          if (project)
            project.description = data;
        }
      });
      if (!!project) projects.push(project);
      return projects;
    }
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseEducationHistory(table,errors) {
  if (!table) return;
  try {
    var tableData = helper.parseTable(table.find('table'));
    if (tableData[0].length === 2) {
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
    } else {
      var contents = table.find('table').find('td:nth-child(1)').contents();
      contents = _.filter(contents, function (item) {
        return item.type === 'text';
      });
      contents = _.map(contents, function (item) {
        return item.data;
      });
      var educationHistory = [],
        education,
        match;
      _.forEach(contents, function (content) {
        if (content.match(/\d+年\d+月到\d+年\d+月/)) {
          if (!!education) educationHistory.push(education);
          education = helper.parseDateRange(content);
        } else if ((match = content.match(/学\s*校\s+(.+)/))) {
          education.school = match[1];
        } else if ((match = content.match(/专\s*业\s+(.+)/))) {
          education.major = match[1];
        } else if ((match = content.match(/学\s*历\s+(.+)/))) {
          education.degree = helper.parseDegree(match[1]);
        } else if ((match = content.match(/专业描述\s+(.+)/))) {
          education.description = match[1];
        }
      });
      if (!!education) educationHistory.push(education);
      return educationHistory;
    }
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseFirstTdText(table,errors) {
  if (!table) return;
  try {
    return table.find('td:nth-child(1)').text();
  } catch (e) {
    errors.push(e.message);
    logger.error('parse in first td text failed: ', e.stack);
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

  var errors = [];
  var resume = parseBasicInfo(findTable('基本信息'),errors);
  resume.applyPosition = $('body > table table tr:nth-child(1) td div span').text();
  resume.careerObjective = parseCareerObjective(findTable('求职意向'),errors);
  resume.careerObjective.selfAssessment = parseFirstTdText(findTable('自我评价'),errors);
  resume.workExperience = parseWorkExperience(findTable('工作经历'),errors);
  resume.projectExperience = parseProjectExperience(findTable('项目经历'),errors);
  resume.educationHistory = parseEducationHistory(findTable('教育经历'),errors);
  resume.languageSkills = parseLanguageSkills(findTable('语言能力'),errors);
  resume.additionalInformation = parseFirstTdText(findTable('附加信息'),errors);
  resume.channel = '猎聘网';
  resume.mail = data.mailId;
  resume.company = data.company;
  resume.parseErrors = errors;
  return resume;
};

exports.test = function (data) {
  return data.fromAddress.indexOf('lietou') > -1;
};