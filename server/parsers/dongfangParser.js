'use strict';

var cheerio = require('cheerio'),
  _ = require('lodash'),
  helper = require('../utilities/helper'),
  logger = require('../config/winston').logger();

function parseBasicInfo(table, errors) {
  if (!table) return;
  try {
    var tableData = helper.parseTable(table);
    return {
      name: tableData[0][1],
      gender: helper.parseGender(tableData[0][3]),
      birthday: helper.parseDate(tableData[1][1]),
      residency: tableData[2][1],
      hukou: tableData[2][3],
      civilState: helper.parseCivilState(tableData[4][1]),
      politicalStatus: helper.parsePoliticalStatus(tableData[4][3]),
    };
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseContactInfo(table, errors) {
  if (!table) return;
  try {
    var tableData = helper.parseTable(table);
    return {
      mobile: tableData[1][1],
      email: tableData[2][3]
    };
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseLanguageSkills(table, errors) {
  if (!table) return;
  try {
    return _.map(helper.parseTable(table), function (line) {
      return {
        language: helper.parseLanguage(line[1]),
        readingAndWriting: helper.parseLanguageLevel(line[3]),
        listeningAndSpeaking: helper.parseLanguageLevel(line[3])
      };
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
      entryTime: helper.parseEntryTime(tableData[5][1]),
      typeOfEmployment: helper.parseTypeOfEmployment(tableData[0][1]),
      jobCategory: tableData[1][1].split(' '),
      locations: tableData[2][1].split(' '),
      targetSalary: helper.parseTargetSalary(tableData[4][1])
    };
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}


function parseWorkExperience(tr, errors) {
  try {
    var workExperience = [];
    while (tr.text().match(/\d{4}\/\d{1,2}/)) {
      var dateRange = helper.parseDateRange(tr.text());
      var tableData = helper.parseTable(tr.next().next().find('table').eq(1));
      workExperience.push({
        from: dateRange.from,
        to: dateRange.to,
        company: tableData[0][1],
        jobTitle: tableData[2][1],
        jobDescription: tableData.length > 7 ? tableData[7][1] : ''
      });
      tr = tr.next().next().next();
    }
    return workExperience;
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseEducationHistory(tr, errors) {
  try {
    var educationHistory = [];
    while (tr.text().match(/\d{4}\/\d{1,2}/)) {
      var dateRange = helper.parseDateRange(tr.text());
      var tableData = helper.parseTable(tr.next().find('table').eq(1));
      educationHistory.push({
        from: dateRange.from,
        to: dateRange.to,
        school: tableData[0][1],
        major: tableData[1][3],
        degree: helper.parseDegree(tableData[2][1]),
        description: tableData[3][1]
      });
      tr = tr.next().next().next();
    }
    return educationHistory;
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseItSkills(table, errors) {
  if (!table) return;
  try {
    var tableData = helper.parseTable(table);
    return _.times(tableData.length / 2, function (index) {
      return {
        skill: tableData[index * 2][1],
        level: helper.parseItSkillLevel(tableData[index * 2][3])
      };
    });
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

exports.parse = function (data) {
  var $ = cheerio.load(data.html, {normalizeWhitespace: true});

  var findTable = function (tableName) {
    return $('td.tdBar:contains(' + tableName + ')').parent().next().next().find('table:nth-child(1)');
  };

  var errors = [];
  var resume = parseBasicInfo(findTable('基本情况'), errors);
  _.extend(resume, parseContactInfo(findTable('联系方式')), errors);
  resume.careerObjective = parseCareerObjective(findTable('求职意向'), errors);
  resume.careerObjective.selfAssessment = $('td.bluecolor:contains(自我评价：)').next().text();
  var tr = $('td.tdBar:contains(工作经历)').parent();
  if (tr.next().next()) resume.yearsOfExperience = helper.parseYearsOfExperience(tr.next().next().find('td:nth-child(2)').text());
  if (tr.next().next().next()) resume.workExperience = parseWorkExperience(tr.next().next().next(), errors);
  resume.educationHistory = parseEducationHistory($('td.tdBar:contains(教育背景)').parent().next().next(), errors);
  resume.languageSkills = parseLanguageSkills(findTable('语言/技能'), errors);
  resume.itSkills = parseItSkills($('td.tdBar:contains(语言/技能)').parent().next().next().next().find('table:nth-child(1)'), errors);
  resume.applyPosition = $('td.bluecolor:contains(应聘岗位)').next().text();
  resume.applyDate = helper.parseDate($('td.bluecolor:contains(应聘日期)').next().text());
  resume.channel = '最佳东方';
  resume.mail = data.mailId;
  resume.company = data.company;
  resume.parseErrors = errors;
  return resume;

};

exports.test = function (data) {
  return data.fromAddress.indexOf('veryeast') > -1;
};