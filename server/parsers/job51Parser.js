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
    var resume = {};

    var tableData = helper.parseTable(table);

    var firstLineItems = tableData[0][0].split('|');
    resume.yearsOfExperience = helper.parseYearsOfExperience(firstLineItems[0]);
    resume.gender = helper.parseGender(firstLineItems[1]);
    resume.birthday = helper.parseDate(firstLineItems[2].split(/\(|（/)[1]);
    if (firstLineItems.length > 3) {
      resume.civilStatus = helper.parseCivilState(firstLineItems[3]);
    }
    resume.job51Id = helper.onlyNumber(tableData[0][1]);
    resume.residency = tableData[1][1];
    if (tableData.length >= 4) {
      resume.hukou = tableData[1][3];
    }

    tableData.splice(0, 2);
    _.forEach(tableData, function (line) {
      if (line[0]) {
        var title = helper.removeSpaces(line[0]);
        if (helper.isMobile(title)) {
          resume.mobile = helper.onlyNumber(line[1]);
        } else if (helper.isAddress(title)) {
          resume.address = line[1];
        } else if (helper.isEmail(title)) {
          resume.email = line[1];
        }
      }
    });

    resume.photoUrl = table.find('tr:nth-child(1) img').attr('src');
    return resume;
  }
  catch
    (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseLanguageSkills(table, errors) {
  if (!table) return;
  try {
    var languageTable = table.find('tr td table');
    return _.map(_.filter(helper.parseTable(languageTable), function (line) {
      return line[0].indexOf('等级') < 0;
    }), function (line) {
      return helper.parseLanguageSkill(line[0], line[1]);
    });
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseCareerObjective(table, errors) {
  if (!table) return;
  try {
    var careerObjective = {};
    var tableData = helper.parseTable(table);
    var items = _.map(tableData, function (line) {
      if (line.length > 1) {
        line[0] = line.join('');
      }
      return helper.removeSpaces(line[0]);
    });
    _.forEach(items, function (item) {
      if (helper.isEntryTime(item)) {
        careerObjective.entryTime = helper.parseEntryTime(item);
      } else if (helper.isTypeOfEmployment(item)) {
        careerObjective.typeOfEmployment = helper.parseTypeOfEmployment(helper.splitByColon(item)[1]);
      } else if (helper.isIndustry(item)) {
        careerObjective.industry = helper.splitByCommas(helper.splitByColon(item)[1]);
      } else if (helper.isLocations(item)) {
        careerObjective.locations = helper.splitByCommas(helper.splitByColon(item)[1]);
      } else if (helper.isTargetSalary(item)) {
        careerObjective.targetSalary = helper.parseTargetSalary(helper.splitByColon(item)[1]);
      } else if (helper.isJobCategory(item)) {
        careerObjective.jobCategory = helper.splitByCommas(helper.splitByColon(item)[1]);
      }
    });
    return careerObjective;
  } catch (e) {
    errors.push(e.message);
    logger.error(e.stack);
  }
}

function parseWorkExperience(table, errors) {
  if (!table) return;
  try {
    var workTableData = helper.parseTable(table);
    return _.map(helper.chunkByEmptyArray(workTableData), function (workData) {
      var work = {};
      var description = ' ', hasIndustry = false;
      _.each(workData, function (line, index) {
        if (helper.isWorkHeader(line[0])) {
          if (line.length > 1)
            line[0] = line.join('');
          var items = line[0].split(/--|：|（|）/);
          work.from = helper.parseDate(items[0]);
          work.to = helper.parseDate(items[1]);
          work.name = items[2];
        } else if (helper.isIndustry(line[0])) {
          work.industry = line[1];
          hasIndustry = true;
        } else if (helper.isReportToOrHasStaffs(line[0])) {
          if (line.length > 1)
            line[0] = line.join('');
          description += (line[0] + ' ');
        } else if (hasIndustry) {
          if (index === 2) {
            if(line.length === 1)
                line = line[0].split(/ |--|：|（|）/);
              work.department = line[0];
            work.jobTitle = line[1];
          } else if (index === 3) {
            work.jobDescription = line[0];
          }
        } else if(!hasIndustry){
          if (index === 1) {
            work.department = line[0];
            work.jobTitle = line[1];
          } else if (index === 2) {
            work.jobDescription = line[0];
          }
        }
      });

      work.jobDescription += description;
      return work;
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
          if (line.length > 1)
            line[0] = line.join('');
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
    var tableData = _.filter(helper.parseTable(table), function (line) {
      return line[0].trim().length !== 0;
    });
    var history = [],
      education;

    for (var i = 0; i < tableData.length; i++) {
      if (tableData[i].length > 1) {
        if (education) history.push(education);
        var dateRange = helper.parseDateRange(tableData[i][0]);
        education = {
          from: dateRange.from,
          to: dateRange.to,
          school: tableData[i][1],
          major: tableData[i][2],
          degree: helper.parseDegree(tableData[i][3])
        };
      } else {
        education.description = tableData[i][0];
      }
    }

    if (education) history.push(education);
    return history;
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

    var tableTitle;
    if ($('style').text().indexOf('.cvtitle') > -1) {
      tableTitle = function (tableNames, i) {
        var table = $('td.cvtitle:contains(' + tableNames[i] + ')').parent().next();
        while (table.find('table').length === 0 && table.next().length !== 0) {
          table = table.next();
        }
        return table.find('table');
      };
    } else if ($('style').text().indexOf('.v3_t') > -1) {
      tableTitle = function (tableNames, i) {
        return $('div.v3_t > table > tr > td:contains(' + tableNames[i] + ')').closest('div').next();
      };
    } else if ($('style').text().indexOf('.v2_t') > -1) {
      tableTitle = function (tableNames, i) {
        return $('p.v2_t:contains(' + tableNames[i] + ')').next();
      };
    }
    var tableNames = Array.prototype.slice.call(arguments, 0);
    var table;
    for (var i = 0; i < tableNames.length; i++) {
      table = tableTitle(tableNames, i);
      if (table.length > 0) {
        return table;
      }
    }
  };

  var errors = [];
  var resume = parseBasicInfo($('table tr:nth-child(2) table'), errors);
  resume.name = $('strong').first().text().trim() || $('b').first().text().trim();
  resume.careerObjective = parseCareerObjective(findTable('求职意向'), errors);
  if (!resume.careerObjective)
    resume.careerObjective = {};
  resume.careerObjective.selfAssessment = helper.replaceEmpty($('#Cur_Val').first().text()) ||
    $('td.cvtitle:contains(自我评价)').parent().next().next().next().text();
  resume.workExperience = parseWorkExperience(findTable('工作经验'), errors);
  resume.projectExperience = parseProjectExperience(findTable('项目经验'), errors);
  resume.educationHistory = parseEducationHistory(findTable('教育经历'), errors);
  resume.trainingHistory = parseTrainingHistory(findTable('培训经历'), errors);
  resume.certifications = parseCertifications(findTable('证'), errors);
  resume.languageSkills = parseLanguageSkills(findTable('语言能力'), errors);
  resume.languageCertificates = parseLanguageCertificates(findTable('语言能力'), errors);
  resume.itSkills = parseItSkills(findTable('IT'), errors);
  resume.inSchoolPractices = parseInSchoolPractices(findTable('社会经验'), errors);
  resume.inSchoolStudy = parseInSchoolStudy(findTable('所获奖项'), errors);
  resume.applyPosition = $('td tr:nth-child(1) .blue1:nth-child(2)').text().trim();
  resume.applyDate = helper.parseDate($('tr:nth-child(3) .blue1').text());
  resume.channel = '前程无忧';
  resume.mail = data.mailId;
  resume.company = data.company;
  resume.parseErrors = errors;
  return resume;
};

exports.test = function (data) {
  return data.fromAddress.indexOf('51job') > -1;
};