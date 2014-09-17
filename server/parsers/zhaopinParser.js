'use strict';


var cheerio = require('cheerio'),
  logger = require('../config/winston').logger(),
  _ = require('lodash'),
  entities = require('entities'),
  helper = require('../utilities/helper');

function parseBasicInfo(table, errors) {
  if (!table) return {};
  try {
    var resume = {};
    resume.name = table.find('td:nth-child(1) span').text();
    if(resume.name) resume.name = resume.name.trim();
    resume.email = table.find('a').text();
    if (table.find('img')) {
      resume.photoUrl = table.find('img').attr('src');
    }
    var basicInfos = helper.replaceEmpty(entities.decodeHTML(table.find('td:nth-child(2)').html()).split(/<br>|\|/g));
    _.forEach(basicInfos, function (item) {
      item = helper.removeTags(item);
      if (helper.isGender(item)) resume.gender = helper.parseGender(item);
      else if (helper.isCivilState(item)) resume.civilState = helper.parseCivilState(item);
      else if (helper.isBirthday(item)) resume.birthday = helper.parseDate(item);
      else if (helper.isHukou(item)) resume.hukou = helper.splitByColon(item)[1];
      else if (helper.isResidency(item)) resume.residency = item.substr(4);
      else if (helper.isPoliticalStatus(item)) {
        var parts = item.split(' ');
        resume.politicalStatus = helper.parsePoliticalStatus(parts[0]);
        if (parts.length > 1) resume.address = parts[1];
      }
      else if (helper.isYearsOfExperience(item)) resume.yearsOfExperience = helper.parseYearsOfExperience(item);
      else if (helper.isMobile(item)) resume.mobile = helper.onlyNumber(item);
    });
    return  resume;
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}
function parseCareerObjective(table, errors) {
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
    errors.push(e.message);
    logger.error(e.stack);
  }
}
function parseInSchoolPractices(table, errors) {
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
    errors.push(e.message);
    logger.error(e.stack);
  }
}
function parseWorkExperience(table, errors) {
  if (!table) return;
  try {
    var workExperience = [];
    table.children().each(function () {
      var dateRangeText = cheerio(this).children().first().text();
      if (dateRangeText.trim().length > 0) {
        var dateRange = helper.parseDateRange(dateRangeText);
        var contents = entities.decodeHTML(cheerio(this).children().last().html()).split(/<br\/?>/g);
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
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseTrainingHistory(table, errors) {
  if (!table) return;

  try {
    var trs = table.find('tr');
    return _.times(Math.ceil(trs.length / 2), function (index) {
      var contents = trs.eq(index * 2).children().eq(0).contents();
      var items = helper.splitByColon(contents[0].data);
      var dateRange = helper.parseDateRange(items[0]);
      var training = {
        from: dateRange.from,
        to: dateRange.to,
        institution: items[1]
      };
      for (var i = 1; i < contents.length; i++) {
        if (contents[i].type === 'text') {
          var line = contents[i].data;
          if (helper.isTrainingCourse(line)) {
            training.course = helper.splitByColon(line)[1];
          } else if (helper.isTrainingCertification(line)) {
            training.certification = helper.splitByColon(line)[1];
          } else if (helper.isTrainingLocation(line)) {
            training.location = helper.splitByColon(line)[1];
          } else if (helper.isTrainingDescription(line)) {
            training.description = helper.splitByColon(line).slice(1).join('');
          } else if (helper.isTrainingDescriptionAdditional(line)) {
            training.description += line;
          }
        }
      }
      return training;
    });
  } catch (e) {
    errors.push(e.message);
    logger.error('parse failed: ', e.stack);
  }
}

function collectDataOfTextElement(root, collector) {
  if (!root.children) return;
  for (var i = 0; i < root.children.length; i++) {
    var child = root.children[i];
    if (child.type === 'text') {
      if (child.data.trim().length !== 0)
        collector.push(child.data);
    } else if (child.type === 'tag')
      if (child.name === 'p') {
        collectDataOfTextElement(child, collector);
      } else if (child.name === 'div') {
        collector.push(cheerio(child).text());
      }
  }
}

function parseProjectExperience(table, errors) {
  if (!table) return;

  try {
    var data = [],
      projectExperience = [],
      project;
    collectDataOfTextElement(table.find('td').get(0), data);
    for (var i = 0; i < data.length; i++) {
      var items = data[i].split('：');
      if (helper.isProjectHeader(data[i])) {
        if (project) projectExperience.push(project);
        project = helper.parseDateRange(items[0]);
        project.name = items[1];
      } else if (helper.isDevelopmentTools(items[0])) project.developmentTools = items[1];
      else if (helper.isSoftwareEnvironment(items[0])) project.softwareEnvironment = items[1];
      else if (helper.isHardwareEnvironment(items[0])) project.hardwareEnvironment = items[1];
      else if (helper.isProjectDescription(items[0])) project.description = items[1];
      else if (helper.isProjectResponsibility(items[0])) project.responsibility = items[1];
    }
    if (project) projectExperience.push(project);
    return projectExperience;
  }
  catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseCertifications(table, errors) {
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
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseCompactCertifications(table, errors) {
  try {
    var certifications = [];
    var contents = table.find('tr td').contents();
    for (var i = 0; i < contents.length; i++) {
      var content = contents[i];
      if (content.type === 'text') {
        var items = content.data.split(/ +/);
        if (items.length === 2) {
          certifications.push({
            subject: helper.splitByColon(items[0])[1],
            date: helper.parseDate(helper.splitByColon(items[1])[1])
          });
        }
      }
    }
    return certifications;
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseEducationHistory(table, errors) {
  if (!table) return;
  try {
    var data = helper.replaceEmpty(entities.decodeHTML(table.find('tr td').html()).split('<br>'));
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
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseItSkills(table, errors) {
  if (!table) return;
  try {
    if (table.find('div.resume_p').length > 0) return;
    return _.map(entities.decodeHTML(table.find('td').html()).split('<br>'), function (item) {
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
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseLanguageSkills(table, errors) {
  if (!table) return;
  try {
    var contents = table.find('tr td').contents();
    var languages = [];
    for (var i = 0; i < contents.length; i++) {
      if (contents[i].type === 'text') {
        var parts = contents[i].data.split(/：|\|/g);
        if (parts.length === 3) {
          languages.push({
            language: helper.parseLanguage(parts[0]),
            readingAndWriting: helper.parseLanguageLevel(parts[1]),
            listeningAndSpeaking: helper.parseLanguageLevel(parts[2])
          });
        }
      }
    }
    return languages;
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseInSchoolStudy(table, errors) {
  if (!table) return;
  try {
    var data = entities.decodeHTML(table.find('tr td').html());
    return _.map(helper.replaceEmpty(data.split(/<br>|<\/?div.*?>|<\/?p>/g)),
      function (line) {
        return helper.removeTags(line);
      });
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseHobbies(table, errors) {
  if (!table) return;
  try {
    return table.find('tr td').text();
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
      table = $('span:contains(' + tableNames[i] + ')').closest('table').next().next();
      if (table.length > 0) {
        return table;
      }
    }
  };

  var resume;
  var errors = [];
  if ($('html html').length > 0) {
    resume = parseBasicInfo($('td tr:nth-child(1) table:nth-child(1)'), errors);
    resume.letter = helper.replaceEmpty($('html html p').text());
  } else {
    resume = parseBasicInfo($('table:nth-child(3) table tr:nth-child(1) table:nth-child(1)'), errors);
  }

//  resume.careerObjective = parseCareerObjective(findTable('专业特长', '自我评价', '职业目标', '技能专长', '专业技能','个人技能'), errors);
  resume.careerObjective = parseCareerObjective($('table table table').eq(3), errors);
  resume.workExperience = parseWorkExperience(findTable('工作经历'), errors);
  resume.educationHistory = parseEducationHistory(findTable('教育经历'), errors);
  resume.itSkills = parseItSkills(findTable('专业技能'), errors);
  if (findTable('语言/技能/证书')) {
    resume.certifications = parseCompactCertifications(findTable('语言/技能/证书'));
  } else {
    resume.certifications = parseCertifications(findTable('证书'), errors);
  }
  resume.languageSkills = parseLanguageSkills(findTable('语言能力'), errors);
  resume.projectExperience = parseProjectExperience(findTable('项目经验'), errors);
  resume.inSchoolPractices = parseInSchoolPractices(findTable('在校实践经验'), errors);
  resume.inSchoolStudy = parseInSchoolStudy(findTable('在校学习情况'), errors);
  resume.trainingHistory = parseTrainingHistory(findTable('培训经历'), errors);
  resume.hobbies = parseHobbies(findTable('兴趣爱好'), errors);
  resume.applyPosition = helper.parseZhaopinApplyPosition(data.subject, errors);
  resume.channel = '智联招聘';
  resume.company = data.company;
  resume.mail = data.mailId;
  resume.parseErrors = errors;
  return resume;

};

exports.test = function (data) {
  return data.fromAddress.indexOf('@zhaopin') > -1;
};

