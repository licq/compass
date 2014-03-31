var cheerio = require('cheerio'),
    _ = require('lodash');

exports.parse = function (html) {
    var resume = {};

    var $ = cheerio.load(html);
    resume.name = $('td tr:nth-child(1) tr:nth-child(2) span').text();
    var contactInfos = $('td tr:nth-child(1) table:nth-child(1) td:nth-child(2)').text().split('\n');
    var firstLine = contactInfos[0].split('|');
    resume.gender = firstLine[0].trim() === '男' ? 'male' : 'female';
    resume.married = firstLine[1].trim() !== '未婚';
    var match = firstLine[2].match(/\d+/g);
    resume.birthYear = match[0];
    resume.birthMonth = match[1];
    resume.residence = firstLine[3].split('：')[1].trim();
    resume.ghetto = firstLine[4].substr(5).trim();
    resume.educationLevel = firstLine[5].trim();
    var secondLine = _.filter(contactInfos[1].split(' '), function (item) {
        return item.length !== 0;
    });
    resume.politics = secondLine[0];
    resume.university = secondLine[1];
    resume.zipcode = secondLine[2].substr(0, 6);
    resume.mobile = secondLine[2].substr(6, 11);
    resume.email = contactInfos[2].split(': ')[1];

    resume.selfDescription = $('.resume_p:nth-child(1)').text().trim();
    resume.desiredPositions = $('td td td td tr:nth-child(2) td:nth-child(2)').text().split('，');
    resume.desiredSalary = $('td td td td tr:nth-child(3) td:nth-child(2)').text();
    resume.currentStatus = $('tr:nth-child(4) td:nth-child(2)').text();

    resume.workExperiences = [];
    $('td td tr:nth-child(2) table:nth-child(4) tr').slice(0, 1).each(function (i, elem) {
        var work = {};
        work.dateRange = $(elem).children().first().text().trim();
        work.work = $(elem).children().last().text().trim();
        resume.workExperiences.push(work);
    });

    resume.practices =
        $('tr:nth-child(6) table:nth-child(4) tr').map(function (index, elem) {
            return {dateRange: $(elem).children().first().text().trim(),
                content: $(elem).children().last().text().trim()};
        });

    resume.studyStatus = $('tr:nth-child(5) table:nth-child(4) td').text().trim();
    resume.educationHistory = $('tr:nth-child(4) table:nth-child(4) td').text();
    resume.projects = $('tr:nth-child(3) table:nth-child(4) td').html();

    resume.professionalSkills = $('tr:nth-child(9) table:nth-child(4) td').text();
    resume.papers = $('td table:nth-child(3) td').text();
    resume.intrests = $('table:nth-child(7) td').text();
    return resume;
};


exports.parse51Job = function (html) {
    var resume = {};
    var $ = cheerio.load(html);
    resume.applyPosition = $('td tr:nth-child(1) .blue1:nth-child(2)').text().trim();
    resume.applyDate = new Date($('tr:nth-child(3) .blue1').text());
    resume.matchRate = $('font b').text();
    resume.name = $('strong').text();
    var currents = $('.blue1 b').text().split('|');
    resume.currentStatus = currents[0];
    resume.gender = parseGender(currents[1]);
    resume.birthday = parseBirthday(currents[2].split('(')[1]);

    resume.ghetto = $('tr:nth-child(2) tr:nth-child(2) td:nth-child(2)').text();
    resume.mobile = $('tr:nth-child(2) tr:nth-child(3) td:nth-child(2)').text().match(/\d+/)[0];
    resume.email = $('a.blue1').text().trim();
    resume.job51Id = onlyNumber($('td:nth-child(2) span').text());

    resume.selfDescription = $('#Cur_Val').text();
    resume.entryTime = $('.table_set tr:nth-child(1) .text_left .text').text();
    resume.desiredPositions = $('tr:nth-child(3) .text_left .text').text().split('，');
    resume.desiredCities = splitByCommas($('.table_set tr:nth-child(4) .text_left .text').text());
    resume.desiredSalary = $('tr:nth-child(5) .text_left .text').text();
    resume.desiredPosition = $('tr:nth-child(6) .text_left .text').text();

    resume.workExperiences = $('table:nth-child(3) tr:nth-child(4) table').map(function (i, table) {
        var items = replaceNewLineAndSpace($(table).children().first().text()).split(/--|: |（|）/);
        return {
            from: items[0],
            to: items[1],
            company: items[2],
            industry: $('tr:nth-child(2) td:nth-child(2)', $(table)).text(),
            department: $('tr:nth-child(3) td:nth-child(1)', $(table)).text().trim(),
            job: $('tr:nth-child(3) td:nth-child(2)', $(table)).text().trim(),
            jobResponsibility: $('tr:nth-child(4)', $(table)).text().trim(),
        };
    });

    resume.projects = [];

    var $trs = $('tr:nth-child(9) td table tr');
    var projectsLength = ($trs.length + 1) / 7;
    for (var pin = 0; pin < projectsLength; pin++) {
        var project = {};
        project.name = replaceNewLineAndSpace($trs.eq(pin * 7 + 0).text());
        project.softwareEnviroment = replaceNewLineAndSpace($('td:nth-child(2)', $trs.eq(1 + pin * 7)).text());
        project.hardwareEnviroment = replaceNewLineAndSpace($('td:nth-child(2)', $trs.eq(2 + pin * 7)).text());
        project.developmentTools = replaceNewLineAndSpace($('td:nth-child(2)', $trs.eq(3 + pin * 7)).text());
        project.description = replaceNewLineAndSpace($('td:nth-child(2)', $trs.eq(4 + pin * 7)).text());
        project.responsibility = replaceNewLineAndSpace($('td:nth-child(2)', $trs.eq(5 + pin * 7)).text());
        resume.projects.push(project);
    }

    resume.educationHistory = _.map(parseTable($('tr:nth-child(14) table'), $), function (line) {
        return { dateRange: line[0],
            university: line[1],
            major: line[2],
            educationLevel: line[3]
        }
    });

    var trainingTable = parseTable($('tr:nth-child(20) table'), $);
    resume.trainingHistory = [];
    resume.trainingHistory.push({
        dateRange: trainingTable[0][0],
        organization: trainingTable[0][1],
        subject: trainingTable[0][2],
        status: trainingTable[0][3],
        description: trainingTable[1][0]
    });

    resume.certificates = _.map(parseTable($('tr:nth-child(25) table'),$), function(line){
        return {
            date: line[0],
            subject: line[1],
            score: parseInt(line[2],10)
        };
    });

    resume.languageSkills = _.map(parseTable($('tr:nth-child(30) table table'), $),function(line){
        return {
            subject: line[0],
            skill: line[1]
        };
    });

    resume.professionalSkills = _.map(parseTable($('tr:nth-child(35) table'),$).slice(2),function(line){
        return {
            subject: line[0],
            level: line[1],
            howlong: line[2]
        };
    });

    return resume;
};

function parseGender(input) {
    return input.trim() === '男' ? 'male' : 'female';
}

function parseBirthday(input) {
    var match = input.match(/\d+/g);
    return {
        birthYear: match[0],
        birthMonth: match[1],
        birthDate: match[2]
    };
}

function onlyNumber(input) {
    var match = input.match(/\d+/g);
    return match[0];
}

function splitByCommas(input) {
    return input.split(/,|,|，/);
}

function replaceNewLineAndSpace(input) {
    if (Array.isArray(input)) {
        return _.forEach(input, function (item) {
            return item.replace(/\n| +/g, '');
        });
    }
    return input.replace(/\n| +/g, '');
}

function parseTable(table, $) {
    var items = [];
    $('tr', $(table)).each(function () {
        var item = [];
        $(this).find('td').each(function () {
            item.push(replaceNewLineAndSpace($(this).text()));
        });
        items.push(item);
    });
    return items;
}