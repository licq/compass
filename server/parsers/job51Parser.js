var cheerio = require('cheerio'),
    _ = require('lodash'),
    helper = require('../utilities/helper'),
    logger = require('../config/winston').logger();

exports.parse = function (html) {
    var resume = {};
    var $ = cheerio.load(html);
    resume.name = $('strong').text().trim();
    resume.email = $('a.blue1').text().trim();
    resume.mobile = helper.onlyNumber($('tr:nth-child(2) tr:nth-child(3) td:nth-child(2)').text());
    resume.applyPosition = $('td tr:nth-child(1) .blue1:nth-child(2)').text().trim();
    resume.applyDate = helper.parseDate($('tr:nth-child(3) .blue1').text());
    resume.matchRate = helper.parseMatchRate($('font b').text());

    var currents = $('.blue1 b').text().split('|');
    resume.yearsOfExperience = helper.parseYearsOfExperience(currents[0]);
    resume.birthday = helper.parseDate((currents[2].split('(')[1]));
    resume.residency = $('tr:nth-child(2) tr:nth-child(2) td:nth-child(2)').text();
    resume.job51Id = helper.onlyNumber($('td:nth-child(2) span').text());

    var careerObjective = resume.careerObjective = {};
    careerObjective.selfAssessment = $('#Cur_Val').text();
    careerObjective.entryTime = helper.parseEntryTime($('.table_set tr:nth-child(1) .text_left .text').text());
    careerObjective.typeOfEmployment = helper.parseTypeOfEmployment($('tr:nth-child(2) .text_left .text').text());
    careerObjective.industry = helper.splitByCommas($('tr:nth-child(3) .text_left .text').text());
    careerObjective.locations = helper.splitByCommas($('.table_set tr:nth-child(4) .text_left .text').text());
    careerObjective.targetSalary = helper.parseTargetSalary($('tr:nth-child(5) .text_left .text').text());
    careerObjective.jobCategory = helper.splitByCommas($('tr:nth-child(6) .text_left .text').text());

    resume.workExperience = [];
    var workExperienceTableData = helper.parseTable($('table:nth-child(3) tr:nth-child(4) table'), $);
    var items = workExperienceTableData[0][0].split(/--|：|（|）/);
    resume.workExperience.push({
        from: helper.parseDate(items[0]),
        to: helper.parseDate(items[1]),
        company: items[2],
        industry: workExperienceTableData[1][1],
        department: workExperienceTableData[2][0],
        jobTitle: workExperienceTableData[2][1],
        jobDescription: workExperienceTableData[3][0]
    });

    resume.projectExperience = [];

    var projectTableData = helper.parseTable($('tr:nth-child(9) td table'), $);
    var project = undefined;
    _.each(projectTableData, function (line) {
        if (helper.isProjectHeader(line[0])) {
            if (project) resume.projectExperience.push(project);
            project = {};
            var items = line[0].split(/--|：|（|）/);
            project.from = helper.parseDate(items[0]);
            project.to = helper.parseDate(items[1]);
            project.name = items[2];
        } else if (helper.isSoftwareEnviroment(line[0])) {
            project.softwareEnviroment = line[1];
        } else if (helper.isHardwareEnviroment(line[0])) {
            project.hardwareEnviroment = line[1];
        } else if (helper.isDevelopmentTools(line[0])) {
            project.developmentTools = line[1];
        } else if (helper.isDescription(line[0])) {
            project.description = line[1];
        } else if (helper.isResponsibility(line[0])) {
            project.responsibility = line[1];
        }
    });

    resume.projectExperience.push(project);

    resume.educationHistory = _.map(helper.parseTable($('tr:nth-child(14) table'), $), function (line) {
        var items = line[0].split(/--|: |（|）/);
        return { from: helper.parseDate(items[0]),
            to: helper.parseDate(items[1]),
            school: line[1],
            major: line[2],
            degree: helper.parseDegree(line[3])
        }
    });

    var trainingTable = helper.parseTable($('tr:nth-child(20) table'), $);
    resume.trainingHistory = [];
    var items = trainingTable[0][0].split(/--|: |（|）/);
    resume.trainingHistory.push({
        from: helper.parseDate(items[0]),
        to: helper.parseDate(items[1]),
        institution: trainingTable[0][1],
        course: trainingTable[0][2],
        certification: trainingTable[0][3],
        description: trainingTable[1] ? trainingTable[1][0] : undefined
    });

    resume.certifications = _.map(helper.parseTable($('tr:nth-child(25) table'), $), function (line) {
        return {
            date: helper.parseDate(line[0]),
            subject: line[1],
            score: parseInt(line[2], 10)
        };
    });

    resume.languageSkills = [];
    resume.languageCertificates = {};
    _.each(helper.parseTable($('tr:nth-child(30) table table'), $), function (line) {
        if (helper.isEnglishCertificate(line[0])) resume.languageCertificates.english = helper.parseEnglishCertificate(line[1]);
        else resume.languageSkills.push(helper.parseLanguageSkill(line[0], line[1]));
    });

    resume.itSkills = _.map(helper.parseTable($('tr:nth-child(35) table'), $).slice(2), function (line) {
        return {
            skill: line[0],
            level: helper.parseItSkillLevel(line[1]),
            experience: helper.onlyNumber(line[2])
        };
    });

    return resume;
};

exports.test = function(data){
    return data.fromAddress.indexOf('51job') > -1;
};
