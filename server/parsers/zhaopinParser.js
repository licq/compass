var cheerio = require('cheerio'),
    logger = require('../config/winston').logger(),
    _ = require('lodash'),
    helper = require('../utilities/helper');

exports.parse = function (data) {
    var $ = cheerio.load(data.html);
    var resume;
    if ($('html html').length > 0) {
        resume = parseBasicInfo($('td tr:nth-child(1) table:nth-child(1)'));
        resume.letter = helper.replaceEmpty($('html html p').text());
    } else {
        resume = parseBasicInfo($('table:nth-child(3) table tr:nth-child(1) table:nth-child(1)'));
    }

    resume.careerObjective = parseCareerObjective(findTable('自我评价', '职业目标'));
    resume.workExperience = parseWorkExperience(findTable('工作经历'));
    resume.educationHistory = parseEducationHistory(findTable('教育经历'));
    resume.certifications = parseCertifications(findTable('证书'));
    resume.itSkills = parseItSkills(findTable('专业技能'));
    resume.languageSkills = parseLanguageSkills(findTable('语言能力'));
    resume.projectExperience = parseProjectExperience(findTable('项目经验'));
    resume.inSchoolPractices = parseInSchoolPractices(findTable('在校实践经验'));
    resume.inSchoolStudy = parseInSchoolStudy(findTable('在校学习情况'));
    resume.applyPosition = helper.parseZhaopinApplyPosition(data.subject);
    resume.channel = '智联招聘';
    resume.company = data.company;
    resume.mail = data.mailId;

    return resume;

    function findTable(name, another) {
        var table = $('span:contains(' + name + ')').closest('table').next().next();
        if (table.length !== 0) return table;
        return  $('span:contains(' + another + ')').closest('table').next().next();
    }

    function parseBasicInfo(table) {
        if (table.length === 0) return {};
        try {
            var contactInfoLine;
            var mobileLine;
            var emailLine;
            var resume = {};

            var basicInfos = table.find('td:nth-child(2)').html().split('<br>');
            var line1Items = helper.replaceEmpty(basicInfos[0].split('|'));
            if (!helper.isMobileLine(basicInfos[1])) {
                contactInfoLine = basicInfos[1];
                mobileLine = basicInfos[2];
                emailLine = basicInfos[3];
            } else {
                mobileLine = basicInfos[1];
                emailLine = basicInfos[2];
            }

            resume.name = table.find('td:nth-child(1) span').text().trim();
            _.forEach(line1Items, function (item) {
                if (helper.isGender(item)) resume.gender = helper.parseGender(item);
                else if (helper.isCivilState(item)) resume.civilState = helper.parseCivilState(item);
                else if (helper.isBirthday(item)) resume.birthday = helper.parseDate(item);
                else if (helper.isHukou(item)) resume.hukou = item.split('：')[1];
                else if (helper.isResidency(item)) resume.residency = item.substr(4);
            });

            if (contactInfoLine) {
                var items = helper.replaceEmpty(contactInfoLine.split(/\s+|\s*\|\s*/g));
                _.forEach(items, function (item) {
                    if (helper.isPoliticalStatus(item)) resume.politicalStatus = helper.parsePoliticalStatus(item);
                    if (helper.isYearsOfExperience(item)) resume.yearsOfExperience = helper.parseYearsOfExperience(item);
                })
            }
            if (mobileLine) resume.mobile = helper.onlyNumber(mobileLine);
            if (emailLine) resume.email = table.find('a').text();

            return  resume;
        } catch (e) {
            logger.error(e.stack);
        }
    }

    function parseCareerObjective(table) {
        if (table.length === 0) return;
        try {
            var objectiveTable = table.find('table');
            var objectiveTableData = helper.parseTable(objectiveTable, $);
            objectiveTableData.push([objectiveTable.children().eq(-2).text(), objectiveTable.children().eq(-1).text()]);
            return {
                jobCategory: helper.splitByCommas(objectiveTableData[1][1]),
                targetSalary: helper.parseTargetSalary(objectiveTableData[2][1]),
                entryTime: helper.parseEntryTime(objectiveTableData[3][1]),
                selfAssessment: helper.replaceEmpty($('.resume_p:nth-child(1)').text())
            };
        } catch (e) {
            logger.error(e.stack);
        }
    }

    function parseInSchoolPractices(table) {
        if (table.length === 0) return;
        try {
            var data = helper.parseTable(table, $);
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
        if (table.length === 0) return;
        try {
            var workExperience = [];
            table.children().each(function () {
                var dateRangeText = $(this).children().first().text();
                if (dateRangeText.trim().length > 0) {
                    var dateRange = helper.parseDateRange(dateRangeText);
                    var contents = $(this).children().last().html().split(/<br\/?>/g);
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

    function parseProjectExperience(table) {
        if (table.length === 0) return;

        try {
            var divs = table.find('div.resume_p');
            var html = helper.parseTableHtml(table, $)[0][0];

            var projectTitles = html.split(/<div.*?<\/div>\s*?<div.*?<\/div>/g).slice(0, -1);
            var projectLength = divs.length / 2;
            return _.times(projectLength, function (n) {
                var firstDiv = divs.eq(n * 2);
                var secondDiv = divs.eq(n * 2 + 1);
                var parts = helper.replaceEmpty(projectTitles[n].split(/<br\/?>|<\/?p>/g));
                var divideAt = parts[0].indexOf('：');
                var dateRange = helper.parseDateRange(parts[0].substr(0, divideAt));

                var result = {
                    from: dateRange.from,
                    to: dateRange.to,
                    name: parts[0].substr(divideAt + 1),
                    responsibility: helper.replaceEmpty($(firstDiv).text()).substr(5),
                    description: $(secondDiv).text().trim().substr(5)
                };

                _.forEach(parts.slice(1), function (item) {
                    var parts = item.split(/：/g);
                    if (parts[0].trim() === '开发工具') result.developmentTools = parts[1];
                    else if (parts[0].trim() === '软件环境') result.softwareEnviroment = parts[1];
                    else if (parts[0].trim() === '硬件环境') result.hardwareEnviroment = parts[1];
                });

                return result;
            });
        } catch (e) {
            logger.error(e.stack);
        }
    }

    function parseCertifications(table) {
        if (table.length === 0) return;
        try {
            var certificationTableData = (helper.parseTable(table, $));
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
        if (table.length === 0) return;
        try {
            var data = helper.replaceEmpty(helper.parseTableHtml(table, $)[0][0].split('<br>'));
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
        if (!table.length) return;
        try {
            return _.map(helper.parseTableHtml(table, $)[0][0].split('<br>'), function (item) {
                var parts = item.split('|');
                return {
                    skill: helper.replaceEmpty(parts[0]),
                    experience: helper.onlyNumber(parts[2]),
                    level: helper.parseItSkillLevel(parts[1])
                };
            });
        } catch (e) {
            logger.error(e.stack);
        }
    }

    function parseLanguageSkills(table) {
        if (table.length === 0) return;
        try {
            var data = helper.parseTable(table, $);
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
        if (table.length === 0) return;
        try {
            var data = helper.parseTableHtml(table, $);
            return helper.replaceEmpty(data[0][0].split(/<br>|<\/?div.*?>|<\/?p>/g));
        } catch (e) {
            logger.error(e.stack);
        }
    }
};

exports.test = function (data) {
    return data.fromAddress.indexOf('zhaopin') > -1;
};
