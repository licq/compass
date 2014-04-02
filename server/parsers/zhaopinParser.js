var cheerio = require('cheerio'),
    logger = require('../config/winston').logger(),
    _ = require('lodash'),
    helper = require('../utilities/helper');

exports.parse = function (data) {
    var $ = cheerio.load(data.html);
    var resume = parseBasicInfo($('table:nth-child(3) table tr:nth-child(1) table:nth-child(1)'));
    resume.careerObjective = parseCareerObjective(findTable('自我评价', '职业目标'));
    resume.workExperience = parseWorkExperience(findTable('工作经历'));
    resume.educationHistory = parseEducationHistory(findTable('教育经历'));
    resume.certifications = parseCertifications(findTable('证书'));
    resume.itSkills = parseItSkills(findTable('专业技能'));
    resume.languageSkills = parseLanguageSkills(findTable('语言能力'));
    resume.projectExperience = parseProjectExperience(findTable('项目经验'))
    resume.channel = '智联招聘';
    resume.company = data.company;
    resume.mail = data._id;
    return resume;

    function findTable(name, another) {
        var table = $('span:contains(' + name + ')').closest('table').next().next();
        if (table.length !== 0) return table;
        return  $('span:contains(' + another + ')').closest('table').next().next();
    }

    function parseBasicInfo(table) {
        if (table.length === 0) return {};
        try {
            var basicInfos = table.find('td:nth-child(2)').html().split('<br>');
            var line1Items = helper.replaceEmpty(basicInfos[0].split('|'));
            var line2Items = helper.replaceEmpty(basicInfos[1].split(/\s+|\s*\|\s*/g));
            return {
                name: table.find('td:nth-child(1) span').text().trim(),
                gender: helper.parseGender(line1Items[0]),
                civilState: helper.parseCivilState(line1Items[1]),
                birthday: helper.parseDate(line1Items[2]),
                hukou: line1Items[3].split('：')[1],
                residency: line1Items[4].substr(4),
                yearsOfExperience: helper.parseYearsOfExperience(line2Items[0]),
                politicalStatus: helper.parsePoliticalStatus(line2Items[1]),
                mobile: helper.onlyNumber(basicInfos[2]),
                email: $('table:nth-child(3) a').text()
            };
        } catch (err) {
            logger.error(err);
            return {};
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
                selfAssessment: helper.replaceEmpty($('.resume_p:nth-child(1)').text()),
            };
        } catch (err) {
            logger.error(err);
        }
    }

    function parseWorkExperience(table) {
        if (table.length === 0) return;
        try {
            var workExperience = [];
            table.children()
                .filter(function (index) {
                    return index % 2 === 0;
                }).each(function () {
                    var dateRange = helper.parseDateRange($(this).children().first().text());
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

                });
            return workExperience;
        } catch (e) {
            logger.error(e);
        }
    }


    function parseProjectExperience(table) {
        if (table.length === 0) return;

        var divs = table.find('div.resume_p');
        var html = helper.parseTableHtml(table, $)[0][0];

        var titleRegexp = /<p>(.*?)<br>/g;
        var projectTitles = [];
        var matchResult;
        while (matchResult = titleRegexp.exec(html)) {
            projectTitles.push(matchResult[1]);
        }
        var project1Additional = html.substr(0, html.indexOf('<p>'));
        projectTitles[0] = project1Additional + projectTitles[0];

        var projectLength = divs.length / 2;
        return _.times(projectLength, function (n) {
            var firstDiv = divs.eq(n * 2);
            var secondDiv = divs.eq(n * 2 + 1);
            var divideAt = projectTitles[n].indexOf('：');
            var dateRange = helper.parseDateRange(projectTitles[n].substr(0, divideAt));
            return {
                from: dateRange.from,
                to: dateRange.to,
                name: projectTitles[n].substr(divideAt + 1).trim(),
                responsibility: helper.replaceEmpty($(firstDiv).text()).substr(5),
                description: $(secondDiv).text().trim().substr(5)
            }
        });
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
            logger.error(e);
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
            logger.error(e);
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
            logger.error(e);
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
            logger.error(e);
        }
    }
};

exports.test = function (data) {
    return data.fromAddress.indexOf('zhaopin') > -1;
};

