'use strict';

var cheerio = require('cheerio'),
  _ = require('lodash'),
  helper = require('../utilities/helper'),
  fs = require('fs'),
  logger = require('../config/winston').logger();

function parseBasicInfo(tableData, errors) {

  try {
    if (!tableData) return;
    var infoMap = {};
    tableData = tableData.text().trim().split('）');
    var head = tableData[0], basic = tableData[1];
    basic = basic.match(/(）|工作年限|学历|工作地点|期望薪资|求职意向|籍贯|电话|邮箱).*?(?=(工作年限|学历|工作地点|期望薪资|求职意向|籍贯|电话|邮箱|发送面试邀请|工作经历|自我描述|教育经历))/g);
    head = head.split(/：|（|岁| |，/);
    infoMap['姓名'] = head[0];
    infoMap['性别'] = head[1];
    var now = new Date();
    infoMap['出生日期'] = String(now.getFullYear() - parseInt(head[2]));

    _.forEach(basic, function (line) {
      var keyvalue;
      if (line) {
        line.trim();
        keyvalue = (line.split(/ |：/));
        infoMap[keyvalue[0]] = keyvalue[1];
      }
    });

    var resume = {
      name: infoMap['姓名'] || infoMap.Name,
      gender: helper.parseGender(infoMap['性别'] || infoMap.Gender),
      birthday: helper.parseDate(infoMap['出生日期'] || infoMap.DateofBirth),
      civilState: helper.parseCivilState(infoMap['婚姻状况'] || infoMap.Marry),
      hukou: infoMap['籍贯'] || infoMap.Hukou,
      yearsOfExperience: helper.parseYearsOfExperience(infoMap['工作年限'] || infoMap['Y.ofExperience']),
      mobile: infoMap['电话'] || infoMap.MobilePhone,
      email: infoMap['邮箱'] || infoMap.Email,
      applyPosition: infoMap['求职意向'] || infoMap.ApplyPositioin,
      degree: helper.parseDegree(infoMap['学历'])
    };
    if (resume.mobile && resume.mobile.indexOf('086-') === 0) {
      resume.mobile = resume.mobile.substr(4);
    }
    return resume;
  }
  catch
    (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }

}

function parseCareerObjective(tableData, errors) {

  try {
    var careerObjective = {};
    if (!tableData) return;

    _.forEach(tableData, function (line) {
      if (/期望月薪|期望薪资/.test(line)) {
        careerObjective.targetSalary = helper.parseTargetSalary(helper.splitByColon(line)[1]);
      }
      if (line.indexOf('自我描述') > -1) {
        careerObjective.selfAssessment = line.substring(5);
      }
    });

    return careerObjective;
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseWorkExperience(tableData, errors) {

  if (!tableData) return;
  try {
    var work = {};

    _.forEach(tableData, function (line) {
      if (line.indexOf('工作经历') > -1) {
        work.jobDescription = line.substring(5);
      }
    });
    return work;

  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseEducationHistory(tableData, errors) {
  if (!tableData) return;
  try {
    var history = [];
    _.forEach(tableData, function (line) {
      if (/教育经历/.test(line)) {
        var education = {};
        education.description = line.substring(5);
        if (education)
          history.push(education);
      }
    });

    return history;
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

exports.parse = function (data) {
  var $ = cheerio.load(data.html, {normalizeWhitespace: true}), resume = {};

  var p = $('p:contains(亲爱的)').next();
  var table = p.next();
  var tableData = _.flatten(helper.parseTable(p.next()));
  var errors = [];

  resume = parseBasicInfo(table, errors);
  resume.careerObjective = parseCareerObjective(tableData, errors);
  if (!resume.careerObjective)
    resume.careerObjective = {};
  resume.workExperience = parseWorkExperience(tableData, errors);
  resume.educationHistory = parseEducationHistory(tableData, errors);
  resume.channel = '赶集网';
  resume.mail = data.mailId;
  resume.company = data.company;
  resume.parseErrors = errors;
  var title = $('head title').text();

  return resume;
};

exports.test = function (data) {
  return data.fromAddress.indexOf('ganji') > -1;
};