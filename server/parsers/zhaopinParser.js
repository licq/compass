'use strict';


var cheerio = require('cheerio'),
  logger = require('../config/winston').logger(),
  _ = require('lodash'),
  helper = require('../utilities/helper');

function parseBasicInfo(table) {
  if (!table) return {};
  try {
    var resume = {};
    resume.name = table.find('td:nth-child(1) span').text().trim();
    resume.email = table.find('a').text();
    if (table.find('img')) {
      resume.photoUrl = table.find('img').attr('src');
    }
    var basicInfos = helper.replaceEmpty(table.find('td:nth-child(2)').html().split(/<br>|\|/g));
    _.forEach(basicInfos, function (item) {
      item = helper.removeTags(item);
      if (helper.isGender(item)) resume.gender = helper.parseGender(item);
      else if (helper.isCivilState(item)) resume.civilState = helper.parseCivilState(item);
      else if (helper.isBirthday(item)) resume.birthday = helper.parseDate(item);
      else if (helper.isHukou(item)) resume.hukou = helper.splitByColon(item)[1];
      else if (helper.isResidency(item)) resume.residency = item.substr(4);
      else if (helper.isPoliticalStatus(item)) resume.politicalStatus = helper.parsePoliticalStatus(item);
      else if (helper.isYearsOfExperience(item)) resume.yearsOfExperience = helper.parseYearsOfExperience(item);
      else if (helper.isMobile(item)) resume.mobile = helper.onlyNumber(item);
    });
    return  resume;
  } catch (e) {
    logger.error(e.stack);
  }
}
function parseCareerObjective(table) {
  if (!table) return;
  try {
    var objectiveTable = table.find('table');
    var objectiveTableData = helper.parseTable(objectiveTable);
    objectiveTableData.push([objectiveTable.children().eq(-2).text(), objectiveTable.children().eq(-1).text()]);
    return {
      jobCategory: helper.splitByCommas(objectiveTableData[1][1]),
      targetSalary: helper.parseTargetSalary(objectiveTableData[2][1]),
      entryTime: helper.parseEntryTime(objectiveTableData[3][1]),
      selfAssessment: helper.replaceEmpty(table.find('.resume_p:nth-child(1)').text())
    };
  } catch (e) {
    logger.error(e.stack);
  }
}
function parseInSchoolPractices(table) {
  if (!table) return;
  try {
    var data = helper.parseTable(table);
    return _.map(data, function (line) {
      var dateRange = helper.parseDateRange(line[0]);
      return {
        from: dateRange.from,
        to: dateRange.to,
        content: line[1]
      };
    });
  } catch (e) {
    logger.error(e.stack);
  }
}
function parseWorkExperience(table) {
  if (!table) return;
  try {
    var workExperience = [];
    table.children().each(function () {
      var dateRangeText = this.children().first().text();
      if (dateRangeText.trim().length > 0) {
        var dateRange = helper.parseDateRange(dateRangeText);
        var contents = this.children().last().html().split(/<br\/?>/g);
        var companyInfo = helper.replaceEmpty(contents[0].split('|'));
        var industryInfo = helper.replaceEmpty(contents[1].split('|'));
        workExperience.push({
          from: dateRange.from,
          to: dateRange.to,
          company: companyInfo[0],
          department: companyInfo[1],
          jobTitle: companyInfo[2],
          industry: industryInfo[0],
          jobDescription: helper.replaceEmpty(contents.slice(2).join(''))
        });
      }
    });
    return workExperience;
  } catch (e) {
    logger.error(e.stack);
  }
}

function parseTrainingHistory(table) {
  if (!table) return;

  try {
    var htmls = helper.parseTableHtml(table);
    return _.map(_.filter(htmls, function (value, index) {
      return index % 2 === 0;
    }), function (element) {
      var lines = element[0].split('<br>');
      var items = helper.splitByColon(lines.shift());
      var dateRange = helper.parseDateRange(items[0]);
      var training = {
        from: dateRange.from,
        to: dateRange.to,
        institution: items[1]
      };
      _.forEach(lines, function (line) {
        if (helper.isTrainingCourse(line)) {
          training.course = helper.splitByColon(line)[1];
        } else if (helper.isTrainingCertification(line)) {
          training.certification = helper.splitByColon(line)[1];
        } else if (helper.isTrainingLocation(line)) {
          training.location = helper.splitByColon(line)[1];
        } else if (helper.isTrainingDescription(line)) {
          training.description = helper.splitByColon(line)[1];
        }
      });
      return training;
    });
  } catch (e) {
    logger.error('parse failed: ', e.stack);
  }
}

function parseProjectExperience(table) {
  if (!table) return;

  try {
    var html = table.find('td').html();
    var projectsHtml = html.split(/<\/div><br>/g);
    return _.map(_.filter(projectsHtml, function (projectHtml) {
      return projectHtml.match('.resume_p');
    }), function (project) {
      project = project + '</div>';
      var parts = helper.replaceEmpty(project.substr(0, project.indexOf('<div')).split(/<br\/?>|<\/?p>/g));
      var titleParts = helper.splitByColon(parts[0]);
      var dateRange = helper.parseDateRange(titleParts[0]);
      var descriptions = project.match(/<div.+?>.+?<\/div>/g);
      var result = {
        from: dateRange.from,
        to: dateRange.to,
        name: helper.removeSpaces(titleParts[1])
      };

      _.forEach(descriptions, function (description) {
        description = helper.removeSpaces(helper.removeTags(description));
        if (helper.isProjectDescription(description.substr(0, 4))) result.description = description.substr(5);
        if (helper.isProjectResponsibility(description.substr(0, 4))) result.responsibility = description.substr(5);
      });

      _.forEach(parts.slice(1), function (item) {
        var parts = item.split(/：/g);
        if (helper.isDevelopmentTools(parts[0])) result.developmentTools = parts[1];
        else if (helper.isSoftwareEnvironment(parts[0])) result.softwareEnvironment = parts[1];
        else if (helper.isHardwareEnvironment(parts[0])) result.hardwareEnvironment = parts[1];
      });

      return result;
    });
  } catch (e) {
    logger.error(e.stack);
  }
}

function parseCertifications(table) {
  if (!table) return;
  try {
    var certificationTableData = (helper.parseTable(table));
    var certificationLength = (certificationTableData.length + 1) / 3;
    return _.times(certificationLength, function (n) {
      return {
        date: helper.parseDate(certificationTableData[0 + n * 3][0]),
        subject: certificationTableData[0 + n * 3][1],
        score: certificationTableData[1 + n * 3][1]
      };
    });
  } catch (e) {
    logger.error(e.stack);
  }
}
function parseEducationHistory(table) {
  if (!table) return;
  try {
    var data = helper.replaceEmpty(helper.parseTableHtml(table)[0][0].split('<br>'));
    return _.map(data, function (line) {
      var parts = line.split(/：|\|/g);
      var dateRange = helper.parseDateRange(parts[0]);
      return {
        from: dateRange.from,
        to: dateRange.to,
        school: parts[1],
        major: parts[2],
        degree: helper.parseDegree(parts[3])
      };
    });
  } catch (e) {
    logger.error(e.stack);
  }
}
function parseItSkills(table) {
  if (!table) return;
  try {
    if (table.find('div.resume_p')) return;
    return _.map(helper.parseTableHtml(table)[0][0].split('<br>'), function (item) {
      item = helper.removeTags(item);
      var parts = item.split('|');
      if (parts.length === 3) {
        return {
          skill: helper.replaceEmpty(parts[0]),
          experience: helper.onlyNumber(parts[2]),
          level: helper.parseItSkillLevel(parts[1])
        };
      } else {
        return {
          skill: helper.replaceEmpty(parts[0])
        };
      }
    });
  }
  catch (e) {
    logger.error(e.stack);
  }
}
function parseLanguageSkills(table) {
  if (!table) return;
  try {
    var data = helper.parseTable(table);
    return _.map(data, function (item) {
      var parts = item[0].split(/：|\|/g);
      return {
        language: helper.parseLanguage(parts[0]),
        readingAndWriting: helper.parseLanguageLevel(parts[1]),
        listeningAndSpeaking: helper.parseLanguageLevel(parts[2])
      };
    });
  } catch (e) {
    logger.error(e.stack);
  }
}

function parseInSchoolStudy(table) {
  if (!table) return;
  try {
    var data = helper.parseTableHtml(table);
    return _.map(helper.replaceEmpty(data[0][0].split(/<br>|<\/?div.*?>|<\/?p>/g)),
      function (line) {
        return helper.removeTags(line);
      });
  } catch (e) {
    logger.error(e.stack);
  }
}

exports.parse = function (data) {
  var $ = cheerio.load(data.html);
  var findTable = function () {
    var tableNames = Array.prototype.slice.call(arguments, 0);
    var table;
    for (var i = 0; i < tableNames.length; i++) {
      table = $('span:contains(' + tableNames[i] + ')').closest('table').next().next();
      if (table.length > 0) {
        return table;
      }
    }
  };

  var resume;
  if ($('html html').length > 0) {
    resume = parseBasicInfo($('td tr:nth-child(1) table:nth-child(1)'));
    resume.letter = helper.replaceEmpty($('html html p').text());
  } else {
    resume = parseBasicInfo($('table:nth-child(3) table tr:nth-child(1) table:nth-child(1)'));
  }

  resume.careerObjective = parseCareerObjective(findTable('专业特长', '自我评价', '职业目标', '技能专长', '专业技能'));
  resume.workExperience = parseWorkExperience(findTable('工作经历'));
  resume.educationHistory = parseEducationHistory(findTable('教育经历'));
  resume.certifications = parseCertifications(findTable('证书'));
  resume.itSkills = parseItSkills(findTable('专业技能'));
  resume.languageSkills = parseLanguageSkills(findTable('语言能力'));
  resume.projectExperience = parseProjectExperience(findTable('项目经验'));
  resume.inSchoolPractices = parseInSchoolPractices(findTable('在校实践经验'));
  resume.inSchoolStudy = parseInSchoolStudy(findTable('在校学习情况'));
  resume.trainingHistory = parseTrainingHistory(findTable('培训经历'));
  resume.applyPosition = helper.parseZhaopinApplyPosition(data.subject);
  resume.channel = '智联招聘';
  resume.company = data.company;
  resume.mail = data.mailId;

  return resume;

};

exports.test = function (data) {
  return data.fromAddress.indexOf('zhaopin') > -1;
};

