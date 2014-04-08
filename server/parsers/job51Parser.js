var cheerio = require('cheerio'),
    _ = require('lodash'),
    helper = require('../utilities/helper'),
    logger = require('../config/winston').logger();

exports.parse = function (data) {
    var $ = cheerio.load(data.html);
    var resume = parseBasicInfo($('table tr:nth-child(2) table'));
    resume.name = $('strong').text().trim();
    resume.careerObjective = parseCareerObjective(findTable('求职意向'));
    resume.careerObjective.selfAssessment = $('#Cur_Val').text();
    resume.workExperience = parseWorkExperience(findTable('工作经验'));
    resume.projectExperience = parseProjectExperience(findTable('项目经验'));
    resume.educationHistory = parseEducationHistory(findTable('教育经历'));
    resume.trainingHistory = parseTrainingHistory(findTable('培训经历'));
    resume.certifications = parseCertifications(findTable('证'));
    resume.languageSkills = parseLanguageSkills(findTable('语言能力'));
    resume.languageCertificates = parseLanguageCertificates(findTable('语言能力'));
    resume.itSkills = parseItSkills(findTable('IT 技能'));
    resume.applyPosition = $('td tr:nth-child(1) .blue1:nth-child(2)').text().trim();
    resume.applyDate = helper.parseDate($('tr:nth-child(3) .blue1').text());
    resume.matchRate = helper.parseMatchRate($('font b').text());
    resume.channel = '前程无忧';
    resume.mail = data.mailId;
    resume.company = data.company;
    return resume;

    function findTable(name) {
        var current = $('td.cvtitle:contains(' + name + ')').parent().next();
        while (current.find('table').length === 0 && current.next().length !== 0) {
            current = current.next();
        }
        return current;
    }
};

exports.test = function (data) {
    return data.fromAddress.indexOf('51job') > -1;
};

function parseCertifications(table) {
    if (table.length === 0) return;
    try {
        return _.map(helper.parseTable(table), function (line) {
            return {
                date: helper.parseDate(line[0]),
                subject: line[1],
                score: parseInt(line[2], 10)
            };
        });
    } catch (e) {
        logger.error(e.stack);
    }
}


function parseBasicInfo(table) {
    if (table.length === 0) return;
    try {
        var resume = {};

        var tableData = helper.parseTable(table);
        var firstLineItems = tableData[0][0].split('|');
        resume.yearsOfExperience = helper.parseYearsOfExperience(firstLineItems[0]);
        resume.gender = helper.parseGender(firstLineItems[1]);
        resume.birthday = helper.parseDate(firstLineItems[2].split('(')[1]);
        resume.job51Id = helper.onlyNumber(tableData[0][1]);
        resume.residency = tableData[1][1];
        resume.mobile = helper.onlyNumber(tableData[2][1]);
        resume.email = tableData[3][1];
        return resume;
    } catch (e) {
        logger.error(e.stack);
    }
}

function parseLanguageSkills(table) {
    if (table.length === 0) return;
    try {
        var languageTable = table.find('table');
        return _.map(_.filter(helper.parseTable(languageTable), function (line) {
            return line[0].indexOf('等级') < 0;
        }), function (line) {
            return helper.parseLanguageSkill(line[0], line[1]);
        });
    } catch (e) {
        logger.error(e.stack);
    }
}

function parseCareerObjective(table) {
    if (table.length === 0) return;
    try {
        var careerObjective = {};
        var tableData = helper.parseTable(table);
        var items = _.map(tableData, function (line) {
            return helper.removeSpaces(line[0].split('：')[1]);
        });

        careerObjective.entryTime = helper.parseEntryTime(items[0]);
        careerObjective.typeOfEmployment = helper.parseTypeOfEmployment(items[1]);
        careerObjective.industry = helper.splitByCommas(items[2]);
        careerObjective.locations = helper.splitByCommas(items[3]);
        careerObjective.targetSalary = helper.parseTargetSalary(items[4]);
        careerObjective.jobCategory = helper.splitByCommas(items[5]);
        return careerObjective;
    } catch (e) {
        logger.error(e.stack);
    }
}


function parseWorkExperience(table) {
    if (table.length === 0) return;
    try {
        var workExperience = [];
        var tableData = helper.parseTable(table);
        var firstLineItems = tableData[0][0].split(/：|（/);
        var dateRange = helper.parseDateRange(firstLineItems[0]);
        workExperience.push({
            from: dateRange.from,
            to: dateRange.to,
            company: firstLineItems[1],
            industry: tableData[1][1],
            department: tableData[2][0],
            jobTitle: tableData[2][1],
            jobDescription: tableData[3][0]
        });
        return workExperience;
    } catch (e) {
        logger.error(e.stack);
    }
}

function parseProjectExperience(table) {
    if (table.length === 0) return;
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
        logger.error(e.stack);
    }
}

function parseEducationHistory(table) {
    if (table.length === 0) return;
    try {
        return _.map(helper.parseTable(table), function (line) {
            var items = line[0].split(/--|: |（|）/);
            return { from: helper.parseDate(items[0]),
                to: helper.parseDate(items[1]),
                school: line[1],
                major: line[2],
                degree: helper.parseDegree(line[3])
            }
        });
    } catch (e) {
        logger.error(e.stack);
    }
}

function parseTrainingHistory(table) {
    if (table.length === 0) return;
    try {
        var trainingHistory = [];
        var tableData = helper.parseTable(table);
        var items = tableData[0][0].split(/--|: |（|）/);
        trainingHistory.push({
            from: helper.parseDate(items[0]),
            to: helper.parseDate(items[1]),
            institution: tableData[0][1],
            course: tableData[0][2],
            certification: tableData[0][3],
            description: tableData[1] ? tableData[1][0] : undefined
        });
        return trainingHistory;
    } catch (e) {
        logger.error(e.stack);
    }
}

function parseItSkills(table) {
    if (table.length === 0) return;
    try {
        return _.map(helper.parseTable(table).slice(2), function (line) {
            return {
                skill: line[0],
                level: helper.parseItSkillLevel(line[1]),
                experience: helper.onlyNumber(line[2])
            };
        });
    } catch (e) {
        logger.error(e.stack);
    }
}

function parseLanguageCertificates(table) {
    if (table.length === 0) return;
    try {
        var languageTable = table.find('table');
        var languageCertificates = {};
        _.forEach(_.filter(helper.parseTable(languageTable), function (line) {
            return line[0].indexOf('等级') > -1;
        }), function (line) {
            if (helper.isEnglishCertificate(line[0]))
                languageCertificates.english = helper.parseEnglishCertificate(line[1])
        });
        return languageCertificates;
    } catch (e) {
        logger.error(e.stack);
    }
}
